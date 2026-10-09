"""Core HTTP Server implementation for FastDrop.

High performance, minimal RAM usage, streaming file transfers,
Range request support, and interactive REST API for file management.
"""

import http.server
import json
import mimetypes
import os
import shutil
import ssl
import sys
import tempfile
import time
import urllib.parse
import zipfile
from pathlib import Path
from typing import Optional, Tuple

from .auth import AuthConfig
from .uploader import MultipartStreamParser, UploadError, sanitize_filename, stream_to_file

mimetypes.init()
if not mimetypes.inited:
    mimetypes.init()
mimetypes.add_type("text/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("application/json", ".json")
mimetypes.add_type("text/markdown", ".md")
mimetypes.add_type("text/plain", ".py")
mimetypes.add_type("text/plain", ".txt")
mimetypes.add_type("text/plain", ".env")
mimetypes.add_type("text/plain", ".yml")
mimetypes.add_type("text/plain", ".yaml")
mimetypes.add_type("text/plain", ".toml")

class FastDropServer(http.server.ThreadingHTTPServer):
    """Multi-threaded HTTP server for FastDrop."""

    def __init__(
        self,
        server_address: Tuple[str, int],
        root_dir: str,
        auth_config: Optional[AuthConfig] = None,
        readonly: bool = False,
        upload_only: bool = False,
        show_hidden: bool = False,
        enable_cors: bool = False,
        max_upload_size: Optional[int] = None,
    ):
        self.root_dir = os.path.abspath(root_dir)
        self.auth_config = auth_config or AuthConfig()
        self.readonly = readonly
        self.upload_only = upload_only
        self.show_hidden = show_hidden
        self.enable_cors = enable_cors
        self.max_upload_size = max_upload_size
        self.clipboard_text = ""
        self.clipboard_mtime = 0
        self.daemon_threads = True
        super().__init__(server_address, FastDropRequestHandler)

class FastDropRequestHandler(http.server.BaseHTTPRequestHandler):
    """Streaming, memory-optimized request handler for FastDrop."""

    protocol_version = "HTTP/1.1"

    @property
    def server_conf(self) -> FastDropServer:
        return self.server

    def log_message(self, format, *args):
        """Custom request logger."""
        sys.stderr.write(f"[{self.log_date_time_string()}] {self.address_string()} - {format % args}\n")

    def send_cors_headers(self):
        """Add CORS headers if enabled."""
        if self.server_conf.enable_cors:
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
            self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type, Range, X-FastDrop-Token")
            self.send_header("Access-Control-Expose-Headers", "Content-Range, Content-Length, Content-Disposition")

    def send_json(self, data: dict, status: int = 200):
        """Send JSON response."""
        encoded = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(encoded)

    def send_error_json(self, message: str, status: int = 400):
        """Send standardized JSON error message."""
        self.send_json({"success": False, "error": message}, status=status)

    def send_auth_challenge(self):
        """Send 401 Unauthorized with Basic Auth realm."""
        body = json.dumps({"success": False, "error": "Unauthorized", "auth_required": True}).encode("utf-8")
        self.send_response(401)
        self.send_header("WWW-Authenticate", 'Basic realm="FastDrop"')
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def check_request_auth(self, is_write: bool = False) -> bool:
        """Check if request is authorized."""
        if not self.server_conf.auth_config.is_authorized(self, is_write=is_write):
            self.send_auth_challenge()
            return False
        return True

    def resolve_safe_path(self, rel_path: str) -> Optional[str]:
        """Resolve a relative path securely within the server root directory."""
        clean_rel = urllib.parse.unquote(rel_path).lstrip("/\\")
        target = os.path.abspath(os.path.join(self.server_conf.root_dir, clean_rel))
        try:
            if os.path.commonpath([self.server_conf.root_dir, target]) == self.server_conf.root_dir:
                return target
        except ValueError:
            return None
        return None

    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        self.send_response(204)
        self.send_cors_headers()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        """Handle GET requests."""
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        if path in ("/", "/index.html"):
            if self.server_conf.upload_only:
                pass
            return self.serve_ui_asset("index.html", "text/html; charset=utf-8")

        if path == "/style.css":
            return self.serve_ui_asset("style.css", "text/css; charset=utf-8")

        if path == "/app.js":
            return self.serve_ui_asset("app.js", "application/javascript; charset=utf-8")

        if path == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
            return

        if path == "/api/status":
            auth_ok = self.server_conf.auth_config.is_authorized(self, is_write=False)
            return self.send_json({
                "success": True,
                "auth_required": self.server_conf.auth_config.is_enabled,
                "is_authorized": auth_ok,
                "readonly": self.server_conf.readonly,
                "upload_only": self.server_conf.upload_only,
                "version": "0.1.0"
            })

        if not self.check_request_auth(is_write=False):
            return

        if self.server_conf.upload_only and path.startswith(("/api/list", "/api/raw", "/api/zip", "/api/file-content")):
            return self.send_error_json("Server is operating in upload-only mode", 403)

        if path == "/api/list":
            return self.handle_api_list(query)

        if path == "/api/raw":
            return self.handle_api_raw(query)

        if path == "/api/zip":
            return self.handle_api_zip(query)

        if path == "/api/file-content":
            return self.handle_api_file_content(query)

        if path == "/api/clipboard":
            return self.handle_api_get_clipboard()

        self.send_error_json("Endpoint not found", 404)

    def do_POST(self):
        """Handle POST requests."""
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        if not self.check_request_auth(is_write=True):
            return

        if path == "/api/login":
            return self.send_json({"success": True, "message": "Authenticated successfully"})

        if self.server_conf.readonly and path in ("/api/upload", "/api/upload-stream", "/api/mkdir", "/api/delete", "/api/rename", "/api/file-save", "/api/clipboard"):
            return self.send_error_json("Server is running in read-only mode", 403)

        if path == "/api/upload":
            return self.handle_api_upload()

        if path == "/api/upload-stream":
            return self.handle_api_upload_stream(query)

        if self.server_conf.upload_only:
            return self.send_error_json("Server is running in upload-only mode", 403)

        try:
            content_length = int(self.headers.get("Content-Length", 0))
            raw_body = self.rfile.read(content_length) if content_length > 0 else b"{}"
            data = json.loads(raw_body.decode("utf-8")) if raw_body else {}
        except Exception as e:
            return self.send_error_json(f"Invalid JSON payload: {e}", 400)

        if path == "/api/mkdir":
            return self.handle_api_mkdir(data)

        if path == "/api/delete":
            return self.handle_api_delete(data)

        if path == "/api/rename":
            return self.handle_api_rename(data)

        if path == "/api/file-save":
            return self.handle_api_file_save(data)

        if path == "/api/clipboard":
            return self.handle_api_set_clipboard(data)

        self.send_error_json("Endpoint not found", 404)

    def serve_ui_asset(self, filename: str, content_type: str):
        """Serve embedded or bundled web UI file."""
        web_dir = os.path.join(os.path.dirname(__file__), "web")
        file_path = os.path.join(web_dir, filename)

        if os.path.exists(file_path):
            try:
                with open(file_path, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", str(len(content)))
                self.send_header("Cache-Control", "no-cache")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(content)
                return
            except Exception as e:
                self.send_error_json(f"Failed to load asset: {e}", 500)
                return

        if filename == "index.html":
            fallback = b"<!DOCTYPE html><html><body><h1>FastDrop</h1><p>Web UI asset not found.</p></body></html>"
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.send_header("Content-Length", str(len(fallback)))
            self.end_headers()
            self.wfile.write(fallback)
            return

        self.send_error_json("Asset not found", 404)

    def handle_api_list(self, query: dict):
        """List files and folders in directory."""
        rel_path = query.get("path", [""])[0]
        full_path = self.resolve_safe_path(rel_path)

        if not full_path or not os.path.exists(full_path):
            return self.send_error_json("Directory not found", 404)

        if not os.path.isdir(full_path):
            return self.send_error_json("Target path is not a directory", 400)

        items = []
        try:
            with os.scandir(full_path) as it:
                for entry in it:
                    name = entry.name
                    if not self.server_conf.show_hidden and name.startswith("."):
                        continue
                    try:
                        stat = entry.stat(follow_symlinks=False)
                        is_dir = entry.is_dir(follow_symlinks=False)
                        ext = os.path.splitext(name)[1].lower().lstrip(".") if not is_dir else ""
                        item_rel = os.path.relpath(entry.path, self.server_conf.root_dir).replace("\\", "/")
                        items.append({
                            "name": name,
                            "is_dir": is_dir,
                            "size": 0 if is_dir else stat.st_size,
                            "mtime": int(stat.st_mtime),
                            "extension": ext,
                            "path": item_rel,
                        })
                    except OSError:
                        continue
        except PermissionError:
            return self.send_error_json("Permission denied", 403)

        items.sort(key=lambda x: (not x["is_dir"], x["name"].lower()))

        norm_rel = os.path.relpath(full_path, self.server_conf.root_dir).replace("\\", "/")
        if norm_rel == ".":
            norm_rel = ""
        breadcrumbs = []
        curr = ""
        if norm_rel:
            for part in norm_rel.split("/"):
                curr = f"{curr}/{part}" if curr else part
                breadcrumbs.append({"name": part, "path": curr})

        try:
            total, used, free = shutil.disk_usage(full_path)
        except Exception:
            total, used, free = 0, 0, 0

        self.send_json({
            "success": True,
            "current_path": norm_rel,
            "breadcrumbs": breadcrumbs,
            "items": items,
            "storage": {
                "total": total,
                "used": used,
                "free": free,
            },
            "server": {
                "readonly": self.server_conf.readonly,
                "upload_only": self.server_conf.upload_only,
                "version": "0.1.0",
            }
        })

    def handle_api_raw(self, query: dict):
        """Serve raw file with HTTP Range support for resumable downloads and media streaming."""
        rel_path = query.get("path", [""])[0]
        as_download = query.get("download", ["0"])[0] == "1"
        full_path = self.resolve_safe_path(rel_path)

        if not full_path or not os.path.isfile(full_path):
            return self.send_error_json("File not found", 404)

        try:
            file_stat = os.stat(full_path)
            file_size = file_stat.st_size
        except OSError:
            return self.send_error_json("Failed to read file", 500)

        mime_type, _ = mimetypes.guess_type(full_path)
        if not mime_type:
            mime_type = "application/octet-stream"

        filename = os.path.basename(full_path)
        quoted_filename = urllib.parse.quote(filename)

        range_header = self.headers.get("Range")
        if range_header and range_header.startswith("bytes="):
            try:
                range_spec = range_header[6:].strip()
                start_str, end_str = range_spec.split("-", 1)
                start = int(start_str) if start_str else 0
                end = int(end_str) if end_str else file_size - 1
                if start >= file_size or end >= file_size or start > end:
                    self.send_response(416)
                    self.send_header("Content-Range", f"bytes */{file_size}")
                    self.end_headers()
                    return

                length = end - start + 1
                self.send_response(206)
                self.send_header("Content-Type", mime_type)
                self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
                self.send_header("Content-Length", str(length))
                self.send_header("Accept-Ranges", "bytes")
                self.send_cors_headers()
                self.end_headers()

                with open(full_path, "rb") as f:
                    f.seek(start)
                    remaining = length
                    while remaining > 0:
                        chunk = f.read(min(65536, remaining))
                        if not chunk:
                            break
                        self.wfile.write(chunk)
                        remaining -= len(chunk)
                return
            except Exception:
                pass

        self.send_response(200)
        self.send_header("Content-Type", mime_type)
        self.send_header("Content-Length", str(file_size))
        self.send_header("Accept-Ranges", "bytes")
        if as_download:
            self.send_header("Content-Disposition", f'attachment; filename="{quoted_filename}"; filename*=UTF-8\'\'{quoted_filename}')
        else:
            self.send_header("Content-Disposition", f'inline; filename="{quoted_filename}"')
        self.send_cors_headers()
        self.end_headers()

        try:
            with open(full_path, "rb") as f:
                shutil.copyfileobj(f, self.wfile, length=65536)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def handle_api_zip(self, query: dict):
        """Stream a zip archive of requested directory or files on-the-fly."""
        rel_path = query.get("path", [""])[0]
        full_path = self.resolve_safe_path(rel_path)

        if not full_path or not os.path.exists(full_path):
            return self.send_error_json("Target path not found", 404)

        zip_name = sanitize_filename(os.path.basename(full_path) or "archive") + ".zip"
        quoted_zip_name = urllib.parse.quote(zip_name)

        tmp_zip = tempfile.NamedTemporaryFile(delete=False, suffix=".zip")
        tmp_zip_path = tmp_zip.name
        tmp_zip.close()

        try:
            with zipfile.ZipFile(tmp_zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
                if os.path.isdir(full_path):
                    for root, _, files in os.walk(full_path):
                        for f in files:
                            if not self.server_conf.show_hidden and f.startswith("."):
                                continue
                            file_full = os.path.join(root, f)
                            arcname = os.path.relpath(file_full, full_path)
                            try:
                                zf.write(file_full, arcname)
                            except OSError:
                                pass
                else:
                    zf.write(full_path, os.path.basename(full_path))

            zip_size = os.path.getsize(tmp_zip_path)
            self.send_response(200)
            self.send_header("Content-Type", "application/zip")
            self.send_header("Content-Length", str(zip_size))
            self.send_header("Content-Disposition", f'attachment; filename="{quoted_zip_name}"')
            self.send_cors_headers()
            self.end_headers()

            with open(tmp_zip_path, "rb") as f:
                shutil.copyfileobj(f, self.wfile, length=65536)
        finally:
            if os.path.exists(tmp_zip_path):
                try:
                    os.remove(tmp_zip_path)
                except OSError:
                    pass

    def handle_api_file_content(self, query: dict):
        """Get file content for the built-in code/text editor."""
        rel_path = query.get("path", [""])[0]
        full_path = self.resolve_safe_path(rel_path)

        if not full_path or not os.path.isfile(full_path):
            return self.send_error_json("File not found", 404)

        stat = os.stat(full_path)
        if stat.st_size > 8 * 1024 * 1024:
            return self.send_error_json("File is too large for web editor (maximum 8 MB)", 400)

        try:
            with open(full_path, "r", encoding="utf-8") as f:
                content = f.read()
        except UnicodeDecodeError:
            try:
                with open(full_path, "r", encoding="latin-1") as f:
                    content = f.read()
            except Exception as e:
                return self.send_error_json(f"Cannot read file as text: {e}", 400)

        filename = os.path.basename(full_path)
        ext = os.path.splitext(filename)[1].lower().lstrip(".")

        self.send_json({
            "success": True,
            "name": filename,
            "path": rel_path,
            "extension": ext,
            "size": stat.st_size,
            "content": content
        })

    def handle_api_file_save(self, data: dict):
        """Save edited file content from code editor."""
        rel_path = data.get("path", "").strip()
        content = data.get("content", "")

        if not rel_path:
            return self.send_error_json("Missing path", 400)

        full_path = self.resolve_safe_path(rel_path)
        if not full_path:
            return self.send_error_json("Invalid target path", 400)

        try:
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            tmp_path = full_path + ".tmp_edit"
            with open(tmp_path, "w", encoding="utf-8") as f:
                f.write(content)
            if os.path.exists(full_path):
                os.remove(full_path)
            os.replace(tmp_path, full_path)

            return self.send_json({
                "success": True,
                "message": f"Successfully saved {os.path.basename(full_path)}",
                "size": os.path.getsize(full_path)
            })
        except Exception as e:
            return self.send_error_json(f"Failed to save file: {e}", 500)

    def handle_api_mkdir(self, data: dict):
        """Create new directory."""
        rel_path = data.get("path", "").strip()
        folder_name = sanitize_filename(data.get("name", "").strip())

        if not folder_name:
            return self.send_error_json("Invalid folder name", 400)

        base_dir = self.resolve_safe_path(rel_path)
        if not base_dir or not os.path.isdir(base_dir):
            return self.send_error_json("Parent directory does not exist", 404)

        new_dir = os.path.join(base_dir, folder_name)
        if os.path.exists(new_dir):
            return self.send_error_json(f"Folder '{folder_name}' already exists", 400)

        try:
            os.makedirs(new_dir, exist_ok=False)
            return self.send_json({
                "success": True,
                "message": f"Folder '{folder_name}' created",
                "name": folder_name
            })
        except Exception as e:
            return self.send_error_json(f"Failed to create folder: {e}", 500)

    def handle_api_delete(self, data: dict):
        """Delete file or directory."""
        paths = data.get("paths") or ([data.get("path")] if data.get("path") else [])
        if not paths:
            return self.send_error_json("No items specified for deletion", 400)

        deleted = []
        errors = []

        for p in paths:
            if not p:
                continue
            full_path = self.resolve_safe_path(p)
            if not full_path or full_path == self.server_conf.root_dir:
                errors.append(f"Cannot delete root directory or invalid path '{p}'")
                continue

            if not os.path.exists(full_path):
                errors.append(f"Path '{p}' does not exist")
                continue

            try:
                if os.path.isdir(full_path):
                    shutil.rmtree(full_path)
                else:
                    os.remove(full_path)
                deleted.append(os.path.basename(full_path))
            except Exception as e:
                errors.append(f"Failed to delete '{p}': {e}")

        if not deleted and errors:
            return self.send_error_json("; ".join(errors), 400)

        return self.send_json({
            "success": True,
            "deleted": deleted,
            "errors": errors
        })

    def handle_api_rename(self, data: dict):
        """Rename file or directory."""
        old_path = data.get("path", "").strip()
        new_name = sanitize_filename(data.get("new_name", "").strip())

        if not old_path or not new_name:
            return self.send_error_json("Missing path or new name", 400)

        full_old = self.resolve_safe_path(old_path)
        if not full_old or not os.path.exists(full_old):
            return self.send_error_json("Item does not exist", 404)

        if full_old == self.server_conf.root_dir:
            return self.send_error_json("Cannot rename root directory", 400)

        parent_dir = os.path.dirname(full_old)
        full_new = os.path.join(parent_dir, new_name)

        if os.path.exists(full_new):
            return self.send_error_json(f"An item named '{new_name}' already exists", 400)

        try:
            os.rename(full_old, full_new)
            new_rel = os.path.relpath(full_new, self.server_conf.root_dir).replace("\\", "/")
            return self.send_json({
                "success": True,
                "message": f"Renamed to '{new_name}'",
                "new_path": new_rel
            })
        except Exception as e:
            return self.send_error_json(f"Failed to rename: {e}", 500)

    def handle_api_upload(self):
        """Handle streaming multipart file upload."""
        content_type = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in content_type:
            return self.send_error_json("Expected multipart/form-data Content-Type", 400)

        boundary_match = None
        for part in content_type.split(";"):
            part = part.strip()
            if part.lower().startswith("boundary="):
                boundary_match = part[9:].strip('"\'').encode("latin-1")
                break

        if not boundary_match:
            return self.send_error_json("Missing multipart boundary", 400)

        try:
            content_length = int(self.headers.get("Content-Length", 0))
        except ValueError:
            return self.send_error_json("Invalid Content-Length", 400)

        if content_length <= 0:
            return self.send_error_json("Empty request body", 400)

        parsed_url = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed_url.query)
        rel_path = query.get("path", [""])[0]

        target_dir = self.resolve_safe_path(rel_path)
        if not target_dir or not os.path.isdir(target_dir):
            target_dir = self.server_conf.root_dir

        try:
            parser = MultipartStreamParser(
                rfile=self.rfile,
                content_length=content_length,
                boundary=boundary_match,
                target_dir=target_dir,
                max_size=self.server_conf.max_upload_size
            )
            saved_files, form_data = parser.parse()
            return self.send_json({
                "success": True,
                "uploaded": saved_files,
                "count": len(saved_files)
            })
        except UploadError as e:
            return self.send_error_json(str(e), 413)
        except Exception as e:
            return self.send_error_json(f"Upload failed: {e}", 500)

    def handle_api_upload_stream(self, query: dict):
        """Handle raw octet-stream upload."""
        raw_name = query.get("filename", [""])[0]
        if not raw_name:
            return self.send_error_json("Missing filename query parameter", 400)

        filename = sanitize_filename(raw_name)
        rel_path = query.get("path", [""])[0]
        target_dir = self.resolve_safe_path(rel_path)

        if not target_dir or not os.path.isdir(target_dir):
            target_dir = self.server_conf.root_dir

        dest_file = os.path.join(target_dir, filename)

        try:
            content_length = int(self.headers.get("Content-Length", 0))
        except ValueError:
            return self.send_error_json("Invalid Content-Length", 400)

        try:
            bytes_written = stream_to_file(
                self.rfile,
                dest_file,
                content_length,
                max_size=self.server_conf.max_upload_size
            )
            rel = os.path.relpath(dest_file, self.server_conf.root_dir).replace("\\", "/")
            return self.send_json({
                "success": True,
                "uploaded": [{"name": filename, "path": rel, "size": bytes_written}],
                "count": 1
            })
        except UploadError as e:
            return self.send_error_json(str(e), 413)
        except Exception as e:
            return self.send_error_json(f"Streaming upload failed: {e}", 500)

    def handle_api_get_clipboard(self):
        """Get shared clipboard text."""
        return self.send_json({
            "success": True,
            "text": self.server_conf.clipboard_text,
            "updated_at": self.server_conf.clipboard_mtime
        })

    def handle_api_set_clipboard(self, data: dict):
        """Update shared clipboard text."""
        text = data.get("text", "")
        self.server_conf.clipboard_text = text
        self.server_conf.clipboard_mtime = int(time.time())
        return self.send_json({
            "success": True,
            "message": "Text saved to clipboard",
            "length": len(text),
            "updated_at": self.server_conf.clipboard_mtime
        })

def run_server(
    directory: str = ".",
    port: int = 8000,
    bind: str = "0.0.0.0",
    username: Optional[str] = None,
    password: Optional[str] = None,
    token: Optional[str] = None,
    write_auth_only: bool = False,
    readonly: bool = False,
    upload_only: bool = False,
    show_hidden: bool = False,
    enable_cors: bool = False,
    ssl_cert: Optional[str] = None,
    ssl_key: Optional[str] = None,
    max_upload_size: Optional[int] = None,
):
    """Run FastDrop server instance."""
    auth_config = AuthConfig(
        username=username,
        password=password,
        token=token,
        write_auth_only=write_auth_only
    )

    server = FastDropServer(
        (bind, port),
        root_dir=directory,
        auth_config=auth_config,
        readonly=readonly,
        upload_only=upload_only,
        show_hidden=show_hidden,
        enable_cors=enable_cors,
        max_upload_size=max_upload_size,
    )

    if ssl_cert and ssl_key:
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain(certfile=ssl_cert, keyfile=ssl_key)
        server.socket = context.wrap_socket(server.socket, server_side=True)

    return server