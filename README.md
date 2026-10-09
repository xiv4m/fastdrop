# FastDrop

<p align="center">
  <b>Ultra-lightweight, zero-dependency file and text sharing server with a sleek modern Web UI, streaming transfers, authentication, shared clipboard, and a built-in code editor.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.8%2B-blue.svg" alt="Python 3.8+">
  <img src="https://img.shields.io/badge/Dependencies-Zero-brightgreen.svg" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/RAM_Usage-~15MB-success.svg" alt="RAM Usage">
  <img src="https://img.shields.io/badge/License-MIT-orange.svg" alt="License MIT">
</p>

---

## Why FastDrop?

Python's built-in `python -m http.server` is convenient, but it only supports downloading. Third-party alternatives like `uploadserver` add upload functionality, but:
1. They lack a modern, intuitive user interface and professional vector icons.
2. Naive upload handling buffers entire multi-gigabyte files into system RAM, quickly exhausting server memory and crashing processes.
3. They lack crucial features like built-in authentication, quick text copy/paste sharing, file editing, directory creation, and batch actions.

**FastDrop solves all of this.** It is designed to be the ultimate developer utility: **zero external dependencies**, **instant startup**, **constant low memory usage (< 20MB RAM)** even while uploading 50GB files, vector SVG icons, and a **modern responsive dashboard** you actually enjoy using.

---

## Features

- **Ultra-Lightweight & Zero-Dependencies**: Built entirely using Python's standard library. No bloated third-party dependencies required. Instant installation and startup.
- **Constant Memory Streaming (< 20MB RAM)**: Both uploads and downloads stream in 64KB chunks directly to and from disk. You can upload a 100GB video without increasing RAM usage.
- **Modern Responsive Web Dashboard**:
  - Crisp, professional SVG vector icons (no emojis, zero external icon font requests).
  - Responsive layout for desktops, tablets, and smartphones.
  - One-click Dark and Light theme toggle (persisted across sessions).
  - List View and Grid/Card View.
  - Live client-side instant search and filtering (shortcut: `/`).
  - Real-time disk storage gauge and item statistics.
- **Android & Mobile App Experience**:
  - **Material Floating Action Button (FAB)** with expandable Speed Dial menu (Upload Files, Upload Folder, New Folder, New File, Quick Text).
  - **Native-style Action Bottom Sheet** for file actions (Download, Copy, Edit, Preview, Rename, Delete) with 48px+ thumb-friendly touch targets.
  - Dynamic Android browser status bar tinting via `<meta name="theme-color">` matching dark/light mode.
  - Mobile safe-area insets (`env(safe-area-inset-bottom)`) supporting modern gesture bars and notches.
  - Fullscreen touch-optimized Code Editor and Quick Text clipboard modals.
  - Horizontal swipeable breadcrumbs navigation.
- **Quick Text & Clipboard Sharing**:
  - Quickly paste, share, and copy text snippets, tokens, links, or notes across devices on your local Wi-Fi without creating files.
  - 1-click **Copy to Device Clipboard** via browser clipboard API.
  - Sync text in real-time with the FastDrop server.
  - Option to save shared text directly as a file into the current directory.
  - 1-click **Copy Content** button on any text file in the file explorer.
- **Seamless Uploads**:
  - Drag and drop files anywhere on the screen.
  - Drag and drop **entire directory trees** (preserves folder structure).
  - Multi-file picker with real-time upload progress drawer and speeds.
  - Streaming raw binary upload API (`/api/upload-stream`) and multipart form support.
- **Flexible Authentication**:
  - HTTP Basic Auth (`--auth user:password` or `-u user -P pass`).
  - Bearer Token authentication (`--token secret` or `--generate-token`).
  - **Write-Auth-Only Mode (`--write-auth-only`)**: Allow anyone to browse and download files publicly, while requiring authentication to upload, edit, rename, or delete!
- **Built-in Code & Text Editor**:
  - View and edit `.py`, `.js`, `.json`, `.html`, `.css`, `.md`, `.txt`, `.sh`, `.yml`, `.env`, and more directly in the browser.
  - Syntax gutter with line numbers.
  - Tab indentation support (inserts 4 spaces instead of losing focus).
  - Keyboard shortcuts: `Ctrl+S` (or `Cmd+S`) to save immediately, `Esc` to close.
  - 1-click **Copy All** button to copy file content to clipboard.
  - Unsaved changes indicator and discard prevention.
- **File Management Controls**:
  - Create new folders with one click.
  - Create new text/code files on the fly.
  - Rename files and folders safely.
  - Delete individual files or multi-select for batch deletion.
  - **Download entire directories as `.zip`** in a single click.
- **Instant LAN / Network Sharing**:
  - Automatically discovers your local Wi-Fi / Ethernet IP address and prints clickable links in the terminal so you can immediately connect from your phone or another PC.
- **Resumable Downloads & Video Streaming**:
  - Full support for HTTP `Range` requests (`206 Partial Content`). Seek through videos or resume interrupted downloads seamlessly.
- **Built-in Security**:
  - Strict path traversal mitigation (`os.path.commonpath`).
  - Hidden dotfile filtering (`--show-hidden` flag to reveal).
  - Safe atomic file writes using temporary staging files.
  - Optional Read-Only mode (`--readonly`) and Drop-Box mode (`--upload-only`).

---

## Installation

Install FastDrop directly from PyPI:

```bash
pip install fastdrop
```

Or install from source:

```bash
git clone https://github.com/fastdrop/fastdrop.git
cd fastdrop
pip install .
```

---

## Quick Start

### 1. Launch with default settings
Serves the current directory on port 8000:

```bash
fastdrop
```

Terminal output:
```text
  =====================================================
  FastDrop v0.1.0 - Ultra-Lightweight File & Text Server
  =====================================================

  -> Local:    http://localhost:8000/
  -> Network:  http://192.168.1.105:8000/
  Serving:     /home/user/my-folder

  Press Ctrl+C to stop the server
```

### 2. Protect with Password Authentication
```bash
fastdrop -a admin:secret123
```

### 3. Share Public Downloads, Protect Uploads
Allow anyone on your Wi-Fi to browse and download, but require password to upload, edit, or delete:
```bash
fastdrop -a admin:secret123 --write-auth-only
```

### 4. Quick Text Sharing Across Devices
- Click the **Quick Text** button in the top toolbar.
- Paste your snippet, token, link, or note.
- Click **Save / Share** — open FastDrop on your phone and tap **Copy to Clipboard**!

### 5. Serve a Specific Folder on a Custom Port
```bash
fastdrop /path/to/downloads -p 9090
```

### 6. Generate a One-Time Secure Access Token
```bash
fastdrop --generate-token
```

### 7. Read-Only Mode (Disable All Modifications)
```bash
fastdrop --readonly
```

### 8. Upload-Only Mode (Drop-Box / Submission Portal)
Users can only drop files; file listing and downloads are disabled:
```bash
fastdrop --upload-only
```

---

## Command-Line Options

| Argument | Description | Default |
| :--- | :--- | :--- |
| `directory` | Directory path to serve | Current directory (`.`) |
| `-p`, `--port PORT` | Port to bind to | `8000` |
| `-b`, `--bind ADDR` | Network address to bind | `0.0.0.0` (all interfaces) |
| `-a`, `--auth USER:PASS` | Basic authentication credentials | None |
| `-u`, `--username USER` | Username for basic auth | None |
| `-P`, `--password PASS` | Password for basic auth | None |
| `-t`, `--token TOKEN` | Secret access token | None |
| `--generate-token` | Generate random 32-char token | Disabled |
| `--write-auth-only` | Require auth only for write operations | Disabled |
| `--readonly` | Disable uploads, edits, and file modifications | Disabled |
| `--upload-only` | Drop-box mode: enable uploads only, hide listings | Disabled |
| `--show-hidden` | Display hidden files and dotfiles | Disabled |
| `--cors` | Enable Cross-Origin Resource Sharing (CORS) | Disabled |
| `--max-size SIZE` | Maximum upload size limit (e.g. `500M`, `2G`) | Unlimited |
| `--ssl-cert FILE` | Path to SSL certificate for HTTPS | None |
| `--ssl-key FILE` | Path to SSL private key for HTTPS | None |
| `-v`, `--version` | Display version and exit | |

---

## Command-Line Scripting & cURL

FastDrop can be used directly from scripts and terminal tools:

### Upload via cURL (Streaming):
```bash
curl -T archive.tar.gz "http://localhost:8000/api/upload-stream?filename=archive.tar.gz"
```

### Upload with Authentication:
```bash
curl -u admin:secret123 -T file.zip "http://localhost:8000/api/upload-stream?filename=file.zip"
```

### Read Shared Clipboard Text:
```bash
curl "http://localhost:8000/api/clipboard"
```

### Update Shared Clipboard Text:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"text": "My shared text"}' "http://localhost:8000/api/clipboard"
```

### Download a File:
```bash
curl -u admin:secret123 -O "http://localhost:8000/api/raw?path=document.pdf&download=1"
```

### Download Entire Directory as ZIP:
```bash
curl -u admin:secret123 -o my_folder.zip "http://localhost:8000/api/zip?path=subfolder"
```

---

## Running Tests

Run the test suite with Python's built-in `unittest`:

```bash
python -m unittest tests/test_fastdrop.py
```

---

## Author

Developed by **XIV4M (Shivam)**
- GitHub: [@XIV4M](https://github.com/XIV4M)
- Repository: [github.com/XIV4M/fastdrop](https://github.com/XIV4M/fastdrop)

---

## License

FastDrop is open-source software licensed under the [MIT License](LICENSE) &copy; 2026 XIV4M (Shivam).
