"""Authentication service with session-based auth."""

from typing import Optional
from uuid import UUID
from datetime import datetime, timedelta
import secrets
import bcrypt
from sqlmodel import Session, select

from app.models.user import User
from app.repositories.user import UserRepository


class SessionStore:
    """Simple in-memory session store.

    Note: In production, this would be stored in the database or Redis.
    For Phase II, we use a simple dict-based approach with JWT-like tokens.
    """
    _sessions: dict[str, dict] = {}

    @classmethod
    def create(cls, user_id: UUID) -> str:
        """Create a new session and return token."""
        token = secrets.token_urlsafe(32)
        cls._sessions[token] = {
            "user_id": str(user_id),
            "created_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(days=7),
        }
        return token

    @classmethod
    def get(cls, token: str) -> Optional[dict]:
        """Get session data by token."""
        session = cls._sessions.get(token)
        if session and session["expires_at"] > datetime.utcnow():
            return session
        # Clean up expired session
        if session:
            del cls._sessions[token]
        return None

    @classmethod
    def delete(cls, token: str) -> bool:
        """Delete a session."""
        if token in cls._sessions:
            del cls._sessions[token]
            return True
        return False


class AuthService:
    """Service for authentication operations."""

    MIN_PASSWORD_LENGTH = 8

    def __init__(self, session: Session):
        self.session = session
        self.user_repo = UserRepository(session)

    def signup(self, email: str, password: str) -> tuple[User, str]:
        """
        Register a new user.

        Returns:
            Tuple of (user, session_token)

        Raises:
            ValueError: If validation fails
        """
        # Validate password length
        if len(password) < self.MIN_PASSWORD_LENGTH:
            raise ValueError(f"Password must be at least {self.MIN_PASSWORD_LENGTH} characters")

        # Check if email already exists
        if self.user_repo.email_exists(email):
            raise ValueError("Email already registered")

        # Hash password
        password_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # Create user
        user = self.user_repo.create(email=email, password_hash=password_hash)

        # Create session (auto sign-in after signup)
        token = SessionStore.create(user.id)

        return user, token

    def signin(self, email: str, password: str) -> tuple[User, str]:
        """
        Sign in an existing user.

        Returns:
            Tuple of (user, session_token)

        Raises:
            ValueError: If credentials are invalid
        """
        user = self.user_repo.get_by_email(email)
        if not user:
            raise ValueError("Invalid email or password")

        # Verify password
        if not bcrypt.checkpw(
            password.encode("utf-8"),
            user.password_hash.encode("utf-8")
        ):
            raise ValueError("Invalid email or password")

        # Create session
        token = SessionStore.create(user.id)

        return user, token

    def signout(self, token: str) -> bool:
        """Sign out by deleting session."""
        return SessionStore.delete(token)

    def get_session(self, token: str) -> Optional[User]:
        """Get user from session token."""
        session_data = SessionStore.get(token)
        if not session_data:
            return None

        user_id = UUID(session_data["user_id"])
        return self.user_repo.get_by_id(user_id)
