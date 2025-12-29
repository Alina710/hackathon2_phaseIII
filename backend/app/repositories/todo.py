"""Todo repository for data access per data-model.md."""

from typing import Optional
from uuid import UUID
from datetime import datetime
from sqlmodel import Session, select

from app.models.todo import Todo


class TodoRepository:
    """Repository for Todo entity data access."""

    def __init__(self, session: Session):
        self.session = session

    def create(self, title: str, user_id: UUID) -> Todo:
        """Create a new todo for a user."""
        todo = Todo(title=title, user_id=user_id, completed=False)
        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)
        return todo

    def list_by_user(self, user_id: UUID) -> list[Todo]:
        """Get all todos for a user, ordered by created_at descending."""
        statement = (
            select(Todo)
            .where(Todo.user_id == user_id)
            .order_by(Todo.created_at.desc())
        )
        return list(self.session.exec(statement).all())

    def get_by_id(self, todo_id: UUID, user_id: UUID) -> Optional[Todo]:
        """Get a todo by ID, filtered by user_id for authorization."""
        statement = select(Todo).where(
            Todo.id == todo_id,
            Todo.user_id == user_id
        )
        return self.session.exec(statement).first()

    def update(
        self,
        todo_id: UUID,
        user_id: UUID,
        title: Optional[str] = None,
        completed: Optional[bool] = None,
    ) -> Optional[Todo]:
        """Update a todo, filtered by user_id for authorization."""
        todo = self.get_by_id(todo_id, user_id)
        if not todo:
            return None

        if title is not None:
            todo.title = title
        if completed is not None:
            todo.completed = completed

        todo.updated_at = datetime.utcnow()

        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)
        return todo

    def delete(self, todo_id: UUID, user_id: UUID) -> bool:
        """Delete a todo, filtered by user_id for authorization."""
        todo = self.get_by_id(todo_id, user_id)
        if not todo:
            return False

        self.session.delete(todo)
        self.session.commit()
        return True
