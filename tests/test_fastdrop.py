"""Unit and integration tests for FastDrop using standard library unittest."""

import base64
import json
import os
import shutil
import tempfile
import threading
import time
import unittest
import urllib.error
import urllib.request

from fastdrop.auth import AuthConfig
from fastdrop.server import FastDropServer


class TestFastDrop(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp_dir = tempfile.mkdtemp(prefix="fastdrop_test_")
        with open(os.path.join(cls.temp_dir, "hello.txt"), "w", encoding="utf-8") as f:
            f.write("Hello FastDrop!")

        auth_config = AuthConfig(username="admin", password="password123")
        cls.server = FastDropServer(
            ("127.0.0.1", 0),
            root_dir=cls.temp_dir,
            auth_config=auth_config,
        )
        cls.port = cls.server.server_address[1]
        cls.base_url = f"http://127.0.0.1:{cls.port}"

        cls.server_thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.server_thread.start()
        time.sleep(0.1)

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        shutil.rmtree(cls.temp_dir, ignore_errors=True)

    def make_request(self, path, method="GET", data=None, headers=None, auth=None):
        url = f"{self.base_url}{path}"
        req_headers = headers or {}
        if auth:
            user, pwd = auth
            creds = base64.b64encode(f"{user}:{pwd}".encode()).decode()
            req_headers["Authorization"] = f"Basic {creds}"

        req_data = None
        if data is not None:
            if isinstance(data, dict):
                req_data = json.dumps(data).encode("utf-8")
                req_headers["Content-Type"] = "application/json"
            elif isinstance(data, (bytes, str)):
                req_data = data.encode("utf-8") if isinstance(data, str) else data

        req = urllib.request.Request(url, data=req_data, headers=req_headers, method=method)
        try:
            with urllib.request.urlopen(req) as resp:
                return resp.status, resp.read(), resp.headers
        except urllib.error.HTTPError as e:
            return e.code, e.read(), e.headers

    def test_01_ui_assets(self):
        status, body, _ = self.make_request("/")
        self.assertEqual(status, 200)
        self.assertIn(b"FastDrop", body)

        status, body, _ = self.make_request("/style.css")
        self.assertEqual(status, 200)
        self.assertIn(b":root", body)

        status, body, _ = self.make_request("/app.js")
        self.assertEqual(status, 200)
        self.assertIn(b"FastDrop", body)

    def test_02_auth_enforcement(self):
        status, _, _ = self.make_request("/api/list")
        self.assertEqual(status, 401)

        status, _, _ = self.make_request("/api/list", auth=("admin", "wrongpass"))
        self.assertEqual(status, 401)

        status, body, _ = self.make_request("/api/list", auth=("admin", "password123"))
        self.assertEqual(status, 200)
        data = json.loads(body.decode())
        self.assertTrue(data["success"])
        self.assertTrue(any(item["name"] == "hello.txt" for item in data["items"]))

    def test_03_mkdir_and_delete(self):
        auth = ("admin", "password123")

        status, body, _ = self.make_request(
            "/api/mkdir",
            method="POST",
            data={"path": "", "name": "test_folder"},
            auth=auth,
        )
        self.assertEqual(status, 200)
        data = json.loads(body.decode())
        self.assertTrue(data["success"])

        status, body, _ = self.make_request("/api/list", auth=auth)
        data = json.loads(body.decode())
        self.assertTrue(any(item["name"] == "test_folder" and item["is_dir"] for item in data["items"]))

        status, body, _ = self.make_request(
            "/api/delete",
            method="POST",
            data={"path": "test_folder"},
            auth=auth,
        )
        self.assertEqual(status, 200)
        data = json.loads(body.decode())
        self.assertTrue(data["success"])

    def test_04_stream_upload_and_download(self):
        auth = ("admin", "password123")
        upload_content = b"Streamed FastDrop file content payload!"

        status, body, _ = self.make_request(
            "/api/upload-stream?filename=stream_test.txt&path=",
            method="POST",
            data=upload_content,
            headers={"Content-Length": str(len(upload_content))},
            auth=auth,
        )
        self.assertEqual(status, 200)
        data = json.loads(body.decode())
        self.assertTrue(data["success"])
        self.assertEqual(data["uploaded"][0]["name"], "stream_test.txt")

        file_path = os.path.join(self.temp_dir, "stream_test.txt")
        self.assertTrue(os.path.exists(file_path))
        with open(file_path, "rb") as f:
            self.assertEqual(f.read(), upload_content)

        status, body, _ = self.make_request("/api/raw?path=stream_test.txt&download=1", auth=auth)
        self.assertEqual(status, 200)
        self.assertEqual(body, upload_content)

    def test_05_code_editor_content_and_save(self):
        auth = ("admin", "password123")

        status, body, _ = self.make_request("/api/file-content?path=hello.txt", auth=auth)
        self.assertEqual(status, 200)
        data = json.loads(body.decode())
        self.assertEqual(data["content"], "Hello FastDrop!")

        new_text = "print('Hello FastDrop Web Editor!')\n"
        status, body, _ = self.make_request(
            "/api/file-save",
            method="POST",
            data={"path": "hello.txt", "content": new_text},
            auth=auth,
        )
        self.assertEqual(status, 200)
        data = json.loads(body.decode())
        self.assertTrue(data["success"])

        with open(os.path.join(self.temp_dir, "hello.txt"), "r", encoding="utf-8") as f:
            self.assertEqual(f.read(), new_text)

    def test_06_rename_file(self):
        auth = ("admin", "password123")

        status, body, _ = self.make_request(
            "/api/rename",
            method="POST",
            data={"path": "hello.txt", "new_name": "renamed_hello.txt"},
            auth=auth,
        )
        self.assertEqual(status, 200)
        data = json.loads(body.decode())
        self.assertTrue(data["success"])
        self.assertTrue(os.path.exists(os.path.join(self.temp_dir, "renamed_hello.txt")))

    def test_07_path_traversal_protection(self):
        auth = ("admin", "password123")

        status, _, _ = self.make_request("/api/raw?path=../../../../etc/passwd", auth=auth)
        self.assertEqual(status, 404)

    def test_08_multipart_form_upload(self):
        auth = ("admin", "password123")
        boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
        file_body = b"Multipart content uploaded successfully!"
        
        body = (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="file"; filename="multi_test.txt"\r\n'
            f"Content-Type: text/plain\r\n\r\n"
        ).encode("utf-8") + file_body + f"\r\n--{boundary}--\r\n".encode("utf-8")

        status, resp_data, _ = self.make_request(
            "/api/upload",
            method="POST",
            data=body,
            headers={
                "Content-Type": f"multipart/form-data; boundary={boundary}",
                "Content-Length": str(len(body)),
            },
            auth=auth,
        )
        self.assertEqual(status, 200)
        data = json.loads(resp_data.decode())
        self.assertTrue(data["success"])
        self.assertEqual(data["uploaded"][0]["name"], "multi_test.txt")

        dest_file = os.path.join(self.temp_dir, "multi_test.txt")
        self.assertTrue(os.path.exists(dest_file))
        with open(dest_file, "rb") as f:
            self.assertEqual(f.read(), file_body)

    def test_09_clipboard_api(self):
        auth = ("admin", "password123")
        sample_text = "Secret token: fastdrop-shared-clipboard-text-12345"

        status, body, _ = self.make_request(
            "/api/clipboard",
            method="POST",
            data={"text": sample_text},
            auth=auth,
        )
        self.assertEqual(status, 200)
        data = json.loads(body.decode())
        self.assertTrue(data["success"])

        status, body, _ = self.make_request("/api/clipboard", auth=auth)
        self.assertEqual(status, 200)
        data = json.loads(body.decode())
        self.assertEqual(data["text"], sample_text)


if __name__ == "__main__":
    unittest.main()


