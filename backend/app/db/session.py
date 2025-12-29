"""Database session management."""

from typing import Generator
from sqlmodel import SQLModel, Session, create_engine

from app.config import get_settings

settings = get_settings()

# Create engine - handle both SQLite (local) and PostgreSQL (Neon)
connect_args = {}
if settings.database_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.database_url,
    echo=settings.debug,
    connect_args=connect_args,
)


def init_db() -> None:
    """Initialize database tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Get database session dependency."""
    with Session(engine) as session:
        yield session
