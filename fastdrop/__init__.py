"""FastDrop - Ultra-lightweight file drop & sharing server.

Zero external dependencies, minimal RAM usage, streaming uploads,
authentication, modern UI, and built-in code editor.
"""

__version__ = "0.1.0"
__author__ = "XIV4M (Shivam)"

from .server import FastDropServer, run_server

__all__ = ["FastDropServer", "run_server", "__version__", "__author__"]
