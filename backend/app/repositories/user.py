"""User repository for data access per data-model.md."""

from typing import Optional
from uuid import UUID
from sqlmodel import Session, select

from app.models.user import User


class UserRepository:
    """Repository for User entity data access."""

    def __init__(self, session: Session):
        self.session = session

    def create(self, email: str, password_hash: str) -> User:
        """Create a new user."""
        user = User(email=email, password_hash=password_hash)
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email address."""
        statement = select(User).where(User.email == email)
        return self.session.exec(statement).first()

    def get_by_id(self, user_id: UUID) -> Optional[User]:
        """Get user by ID."""
        return self.session.get(User, user_id)

    def email_exists(self, email: str) -> bool:
        """Check if email is already registered."""
        statement = select(User).where(User.email == email)
        return self.session.exec(statement).first() is not None
