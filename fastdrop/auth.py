"""Authentication management for FastDrop."""

import base64
import hmac
import http.cookies
import urllib.parse
from typing import Optional, Tuple

class AuthConfig:
    """Authentication configuration and verification."""

    def __init__(
        self,
        username: Optional[str] = None,
        password: Optional[str] = None,
        token: Optional[str] = None,
        write_auth_only: bool = False,
    ):
        self.username = username
        self.password = password
        self.token = token
        self.write_auth_only = write_auth_only

    @property
    def is_enabled(self) -> bool:
        """Return True if any authentication mechanism is active."""
        return bool(self.token or (self.username and self.password))

    def verify_credentials(self, user: str, pwd: str) -> bool:
        """Verify username and password in constant time."""
        if not self.username or not self.password:
            return False
        user_matches = hmac.compare_digest(user.encode("utf-8"), self.username.encode("utf-8"))
        pwd_matches = hmac.compare_digest(pwd.encode("utf-8"), self.password.encode("utf-8"))
        return user_matches and pwd_matches

    def verify_token(self, token_str: str) -> bool:
        """Verify auth token in constant time."""
        if not self.token or not token_str:
            return False
        return hmac.compare_digest(token_str.strip().encode("utf-8"), self.token.strip().encode("utf-8"))

    def extract_credentials(self, handler) -> Tuple[Optional[str], Optional[str], Optional[str]]:
        """Extract username, password, and token from request headers, query string, or cookies."""
        auth_header = handler.headers.get("Authorization", "")
        extracted_user = None
        extracted_pwd = None
        extracted_token = None

        if auth_header.startswith("Basic "):
            try:
                decoded = base64.b64decode(auth_header[6:].strip()).decode("utf-8", errors="ignore")
                if ":" in decoded:
                    extracted_user, extracted_pwd = decoded.split(":", 1)
            except Exception:
                pass
        elif auth_header.startswith("Bearer "):
            extracted_token = auth_header[7:].strip()

        if not extracted_token:
            extracted_token = handler.headers.get("X-FastDrop-Token")

        if not extracted_token and "?" in handler.path:
            query = urllib.parse.parse_qs(urllib.parse.urlparse(handler.path).query)
            if "token" in query and query["token"]:
                extracted_token = query["token"][0]

        if not extracted_token and "Cookie" in handler.headers:
            try:
                cookie = http.cookies.SimpleCookie(handler.headers.get("Cookie"))
                if "fastdrop_token" in cookie:
                    extracted_token = cookie["fastdrop_token"].value
            except Exception:
                pass

        return extracted_user, extracted_pwd, extracted_token

    def is_authorized(self, handler, is_write: bool = False) -> bool:
        """Check if current request is authorized based on request method/action."""
        if not self.is_enabled:
            return True

        if self.write_auth_only and not is_write:
            return True

        user, pwd, token = self.extract_credentials(handler)

        if token and self.verify_token(token):
            return True

        if user is not None and pwd is not None and self.verify_credentials(user, pwd):
            return True

        return False