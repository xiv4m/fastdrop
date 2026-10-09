"""Command-line interface for FastDrop."""

import argparse
import os
import re
import secrets
import socket
import sys
from typing import Optional

from . import __version__
from .server import run_server

def get_local_ip() -> str:
    """Detect LAN IP address of the host machine."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.5)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def parse_size_string(size_str: Optional[str]) -> Optional[int]:
    """Parse size string like '500M', '2G', '100k' into bytes."""
    if not size_str:
        return None
    size_str = size_str.strip().upper()
    match = re.match(r"^(\d+(?:\.\d+)?)\s*([KMGT]?B?)$", size_str)
    if not match:
        raise ValueError(f"Invalid size string: '{size_str}'. Use format like '100M', '2G', '500K'")
    val, unit = match.groups()
    num = float(val)
    unit = unit.rstrip("B")
    multipliers = {
        "": 1,
        "K": 1024,
        "M": 1024 * 1024,
        "G": 1024 * 1024 * 1024,
        "T": 1024 * 1024 * 1024 * 1024,
    }
    return int(num * multipliers.get(unit, 1))

COLOR_ENABLED = False

def init_terminal_colors() -> bool:
    """Enable VT100 / ANSI color processing on Windows and check color support."""
    if os.getenv("NO_COLOR"):
        return False
    if not hasattr(sys.stdout, "isatty") or not sys.stdout.isatty():
        return False
    if os.name == "nt":
        try:
            os.system("")
            return True
        except Exception:
            pass
        try:
            import ctypes
            kernel32 = ctypes.windll.kernel32
            hStdOut = kernel32.GetStdHandle(-11)
            mode = ctypes.c_ulong()
            if kernel32.GetConsoleMode(hStdOut, ctypes.byref(mode)):
                if kernel32.SetConsoleMode(hStdOut, mode.value | 0x0004):
                    return True
        except Exception:
            pass
        return False
    return True

def col(text: str, code: str) -> str:
    """Format text with ANSI escape sequence if terminal supports it."""
    if COLOR_ENABLED:
        return f"\033[{code}m{text}\033[0m"
    return text

def print_banner(
    port: int,
    bind: str,
    directory: str,
    scheme: str,
    auth_info: str,
    token: Optional[str] = None,
    readonly: bool = False,
    upload_only: bool = False,
):
    """Print clean ASCII startup banner."""
    global COLOR_ENABLED
    COLOR_ENABLED = init_terminal_colors()

    local_ip = get_local_ip()
    abs_dir = os.path.abspath(directory)

    print()
    print("  " + col("=====================================================", "1;36"))
    print(f"  {col('FastDrop', '1;32')} {col(f'v{__version__}', '90')} - Ultra-Lightweight File & Text Server")
    print(f"  {col('Author:', '90')}   XIV4M (Shivam)")
    print("  " + col("=====================================================", "1;36"))
    print()

    print(f"  {col('-> Local:', '1')}    {col(f'{scheme}://localhost:{port}/', '34')}")
    if bind == "0.0.0.0" and local_ip != "127.0.0.1":
        print(f"  {col('-> Network:', '1')}  {col(f'{scheme}://{local_ip}:{port}/', '34')}")
    elif bind != "0.0.0.0" and bind != "127.0.0.1":
        print(f"  {col('-> Bind:', '1')}     {col(f'{scheme}://{bind}:{port}/', '34')}")

    print(f"  {col('Serving:', '90')}    {abs_dir}")

    if readonly:
        print(f"  {col('Mode:', '33')}       Read-Only (uploads & modifications disabled)")
    elif upload_only:
        print(f"  {col('Mode:', '33')}       Upload-Only (drop-box mode, browsing disabled)")

    if auth_info:
        print(f"  {col('Auth:', '32')}       {auth_info}")
    if token:
        print(f"  {col('Token:', '33')}      {token}")

    print()
    print(f"  {col('Press Ctrl+C to stop the server', '90')}")
    print()

def main():
    """CLI entrypoint."""
    parser = argparse.ArgumentParser(
        prog="fastdrop",
        description="FastDrop - Ultra-lightweight file drop & sharing server with modern web UI, streaming uploads, authentication, and code editor.",
    )
    parser.add_argument(
        "directory",
        nargs="?",
        default=".",
        help="Directory to serve (default: current working directory)",
    )
    parser.add_argument(
        "-p", "--port",
        type=int,
        default=8000,
        help="Port to listen on (default: 8000)",
    )
    parser.add_argument(
        "-b", "--bind",
        default="0.0.0.0",
        help="Address to bind to (default: 0.0.0.0 / all interfaces)",
    )
    parser.add_argument(
        "-a", "--auth",
        metavar="USER:PASS",
        help="Basic authentication credentials in 'username:password' format",
    )
    parser.add_argument(
        "-u", "--username",
        help="Username for authentication",
    )
    parser.add_argument(
        "-P", "--password",
        help="Password for authentication",
    )
    parser.add_argument(
        "-t", "--token",
        help="Bearer / access token for authentication",
    )
    parser.add_argument(
        "--generate-token",
        action="store_true",
        help="Generate a random secure token and require it for access",
    )
    parser.add_argument(
        "--write-auth-only",
        action="store_true",
        help="Public download & browsing, require auth only for uploads and modifications",
    )
    parser.add_argument(
        "--readonly",
        action="store_true",
        help="Disable uploads, edits, and file operations (read-only mode)",
    )
    parser.add_argument(
        "--upload-only",
        action="store_true",
        help="Disable browsing and downloads (drop-box upload mode only)",
    )
    parser.add_argument(
        "--show-hidden",
        action="store_true",
        help="Show hidden files and dotfiles (hidden by default)",
    )
    parser.add_argument(
        "--cors",
        action="store_true",
        help="Enable Cross-Origin Resource Sharing (CORS) headers",
    )
    parser.add_argument(
        "--max-size",
        metavar="SIZE",
        help="Maximum upload file size limit (e.g. 500M, 2G, 50K)",
    )
    parser.add_argument(
        "--ssl-cert",
        metavar="CERTFILE",
        help="SSL certificate file for HTTPS",
    )
    parser.add_argument(
        "--ssl-key",
        metavar="KEYFILE",
        help="SSL private key file for HTTPS",
    )
    parser.add_argument(
        "-v", "--version",
        action="version",
        version=f"%(prog)s {__version__}",
    )

    args = parser.parse_args()

    username = args.username
    password = args.password
    token = args.token

    if args.auth:
        if ":" in args.auth:
            username, password = args.auth.split(":", 1)
        else:
            parser.error("Invalid --auth format. Expected 'username:password'")

    if args.generate_token:
        token = secrets.token_urlsafe(16)

    try:
        max_upload_size = parse_size_string(args.max_size) if args.max_size else None
    except ValueError as e:
        parser.error(str(e))

    scheme = "https" if args.ssl_cert else "http"

    auth_info = ""
    if username and password:
        auth_info = f"Basic Auth ({username})"
    elif token:
        auth_info = "Token Authentication"

    if auth_info and args.write_auth_only:
        auth_info += " [Write Operations Only]"

    try:
        server = run_server(
            directory=args.directory,
            port=args.port,
            bind=args.bind,
            username=username,
            password=password,
            token=token,
            write_auth_only=args.write_auth_only,
            readonly=args.readonly,
            upload_only=args.upload_only,
            show_hidden=args.show_hidden,
            enable_cors=args.cors,
            ssl_cert=args.ssl_cert,
            ssl_key=args.ssl_key,
            max_upload_size=max_upload_size,
        )
    except OSError as e:
        sys.stderr.write(f"\033[91mError starting server: {e}\033[0m\n")
        sys.exit(1)

    print_banner(
        port=args.port,
        bind=args.bind,
        directory=args.directory,
        scheme=scheme,
        auth_info=auth_info,
        token=token if args.generate_token else None,
        readonly=args.readonly,
        upload_only=args.upload_only,
    )

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  \033[90mShutting down FastDrop gracefully...\033[0m")
        server.server_close()
        sys.exit(0)

if __name__ == "__main__":
    main()