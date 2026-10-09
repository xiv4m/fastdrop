"""Streaming file uploader for FastDrop.

Zero external dependencies and minimal memory footprint.
Streams files directly to disk in 64KB chunks without holding them in RAM.
Compatible with Python 3.8 - 3.14+ (does not rely on removed cgi module).
"""

import os
import re
import urllib.parse
from typing import Dict, List, Optional, Tuple

CHUNK_SIZE = 64 * 1024

class UploadError(Exception):
    """Exception raised when an upload operation fails."""
    pass

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent directory traversal attacks."""
    filename = urllib.parse.unquote(filename)
    filename = os.path.basename(filename)
    filename = re.sub(r'[\\/*?:"<>|]', "_", filename)
    filename = filename.strip(". ")
    if not filename:
        filename = "uploaded_file"
    return filename

def sanitize_relative_path(rel_path: str) -> str:
    """Sanitize relative path for folder uploads."""
    rel_path = rel_path.replace("\\", "/").strip("/")
    parts = [p for p in rel_path.split("/") if p and p != "." and p != ".."]
    safe_parts = [sanitize_filename(p) for p in parts]
    return "/".join(safe_parts)

def stream_to_file(rfile, dest_path: str, size: int, max_size: Optional[int] = None) -> int:
    """Stream raw content directly to disk without loading into RAM."""
    if max_size and size > max_size:
        raise UploadError(f"File size exceeds maximum allowed limit ({max_size} bytes)")

    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    tmp_path = dest_path + ".tmp_upload"

    bytes_written = 0
    try:
        with open(tmp_path, "wb") as f:
            remaining = size
            while remaining > 0:
                chunk_to_read = min(CHUNK_SIZE, remaining)
                chunk = rfile.read(chunk_to_read)
                if not chunk:
                    break
                f.write(chunk)
                bytes_written += len(chunk)
                remaining -= len(chunk)

                if max_size and bytes_written > max_size:
                    raise UploadError(f"Upload exceeded maximum allowed size of {max_size} bytes")

        if os.path.exists(dest_path):
            os.remove(dest_path)
        os.replace(tmp_path, dest_path)
        return bytes_written
    except Exception:
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError:
                pass
        raise

def parse_multipart_boundary(content_type: str) -> Optional[bytes]:
    """Extract boundary bytes from Content-Type header."""
    if not content_type:
        return None
    match = re.search(r'boundary=([^;]+)', content_type, re.IGNORECASE)
    if not match:
        return None
    boundary = match.group(1).strip().strip('"').strip("'")
    return boundary.encode("latin-1")

class MultipartStreamParser:
    """Memory-efficient streaming parser for multipart/form-data.

    Processes incoming file streams in chunks and writes parts directly to disk,
    keeping memory usage capped below 1-2 MB regardless of upload size.
    """

    def __init__(self, rfile, content_length: int, boundary: bytes, target_dir: str, max_size: Optional[int] = None):
        self.rfile = rfile
        self.total_remaining = content_length
        self.boundary = boundary
        self.delimiter = b"--" + boundary
        self.target_dir = target_dir
        self.max_size = max_size
        self.buffer = bytearray()
        self.saved_files: List[Dict[str, str]] = []
        self.form_data: Dict[str, str] = {}

    def _read_chunk(self) -> bytes:
        if self.total_remaining <= 0:
            return b""
        to_read = min(CHUNK_SIZE, self.total_remaining)
        chunk = self.rfile.read(to_read)
        self.total_remaining -= len(chunk)
        return chunk

    def _read_line(self) -> bytes:
        """Read until next CRLF."""
        while b"\r\n" not in self.buffer:
            chunk = self._read_chunk()
            if not chunk:
                break
            self.buffer.extend(chunk)

        idx = self.buffer.find(b"\r\n")
        if idx != -1:
            line = bytes(self.buffer[:idx])
            del self.buffer[: idx + 2]
            return line
        else:
            line = bytes(self.buffer)
            self.buffer.clear()
            return line

    def parse(self) -> Tuple[List[Dict[str, str]], Dict[str, str]]:
        """Parse all parts and write files to target_dir."""
        while True:
            line = self._read_line()
            if not line:
                return self.saved_files, self.form_data
            if line.strip() == self.delimiter:
                break

        while True:
            headers = {}
            while True:
                header_line = self._read_line()
                if not header_line:
                    break
                h_str = header_line.decode("utf-8", errors="replace")
                if ":" in h_str:
                    key, val = h_str.split(":", 1)
                    headers[key.strip().lower()] = val.strip()

            content_disp = headers.get("content-disposition", "")
            if not content_disp:
                break

            filename = None
            fn_match = re.search(r'filename\*?=(?:UTF-8\'\')?["\']?([^"\';\r\n]+)["\']?', content_disp, re.IGNORECASE)
            if fn_match:
                filename = sanitize_filename(fn_match.group(1))

            name_match = re.search(r'name=["\']?([^"\';\r\n]+)["\']?', content_disp, re.IGNORECASE)
            field_name = name_match.group(1) if name_match else ""

            rel_folder = self.form_data.get("rel_path", "")

            if filename:
                safe_folder = os.path.join(self.target_dir, sanitize_relative_path(rel_folder)) if rel_folder else self.target_dir
                os.makedirs(safe_folder, exist_ok=True)
                dest_file = os.path.join(safe_folder, filename)
                tmp_file = dest_file + ".tmp_upload"

                bytes_written = 0
                search_delim = b"\r\n" + self.delimiter

                try:
                    with open(tmp_file, "wb") as out_f:
                        while True:
                            delim_pos = self.buffer.find(search_delim)
                            if delim_pos != -1:
                                chunk = self.buffer[:delim_pos]
                                out_f.write(chunk)
                                bytes_written += len(chunk)
                                del self.buffer[: delim_pos + len(search_delim)]
                                break

                            keep_len = len(search_delim) + 2
                            if len(self.buffer) > keep_len:
                                write_len = len(self.buffer) - keep_len
                                chunk = self.buffer[:write_len]
                                out_f.write(chunk)
                                bytes_written += len(chunk)
                                del self.buffer[:write_len]

                            chunk = self._read_chunk()
                            if not chunk:
                                if self.buffer:
                                    out_f.write(self.buffer)
                                    bytes_written += len(self.buffer)
                                    self.buffer.clear()
                                break
                            self.buffer.extend(chunk)

                            if self.max_size and bytes_written > self.max_size:
                                raise UploadError(f"Upload exceeded maximum allowed size of {self.max_size} bytes")

                    if os.path.exists(dest_file):
                        os.remove(dest_file)
                    os.replace(tmp_file, dest_file)

                    rel_path = os.path.relpath(dest_file, self.target_dir).replace("\\", "/")
                    self.saved_files.append({
                        "name": filename,
                        "path": rel_path,
                        "size": bytes_written
                    })
                except Exception:
                    if os.path.exists(tmp_file):
                        try:
                            os.remove(tmp_file)
                        except OSError:
                            pass
                    raise
            else:
                field_val = bytearray()
                search_delim = b"\r\n" + self.delimiter
                while True:
                    delim_pos = self.buffer.find(search_delim)
                    if delim_pos != -1:
                        field_val.extend(self.buffer[:delim_pos])
                        del self.buffer[: delim_pos + len(search_delim)]
                        break
                    keep_len = len(search_delim) + 2
                    if len(self.buffer) > keep_len:
                        w_len = len(self.buffer) - keep_len
                        field_val.extend(self.buffer[:w_len])
                        del self.buffer[:w_len]
                    chunk = self._read_chunk()
                    if not chunk:
                        field_val.extend(self.buffer)
                        self.buffer.clear()
                        break
                    self.buffer.extend(chunk)

                if field_name:
                    self.form_data[field_name] = field_val.decode("utf-8", errors="replace")

            trailer = self._read_line().strip()
            if trailer == b"--":
                break

        return self.saved_files, self.form_data