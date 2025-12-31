"""Todo service for business logic."""

from typing import Optional
from uuid import UUID
from sqlmodel import Session

from app.models.todo import Todo
from app.repositories.todo import TodoRepository


class TodoService:
    """Service for todo operations."""

    def __init__(self, session: Session):
        self.session = session
        self.todo_repo = TodoRepository(session)

    def list_todos(self, user_id: UUID) -> list[Todo]:
        """Get all todos for the current user."""
        return self.todo_repo.list_by_user(user_id)

    def list_todos_filtered(
        self,
        user_id: UUID,
        search: Optional[str] = None,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        category: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> list[Todo]:
        """Get filtered and sorted todos for the current user."""
        return self.todo_repo.list_filtered(
            user_id=user_id,
            search=search,
            status=status,
            priority=priority,
            category=category,
            sort_by=sort_by,
            sort_order=sort_order,
        )

    def create_todo(
        self,
        title: str,
        user_id: UUID,
        description: Optional[str] = None,
        priority: str = "medium",
        category: str = "personal",
        due_date: Optional[str] = None,
        is_recurring: bool = False,
        recurring_frequency: Optional[str] = None,
        reminder_time: Optional[str] = None,
    ) -> Todo:
        """
        Create a new todo for the user.

        Raises:
            ValueError: If title validation fails
        """
        # Validate title length (1-255 chars per FR-TODO-010)
        if not title or len(title.strip()) == 0:
            raise ValueError("Title is required")
        if len(title) > 255:
            raise ValueError("Title must be 255 characters or less")

        return self.todo_repo.create(
            title=title.strip(),
            user_id=user_id,
            description=description,
            priority=priority,
            category=category,
            due_date=due_date,
            is_recurring=is_recurring,
            recurring_frequency=recurring_frequency,
            reminder_time=reminder_time,
        )

    def get_todo(self, todo_id: UUID, user_id: UUID) -> Optional[Todo]:
        """Get a todo by ID. Returns None if not found or not owned by user."""
        return self.todo_repo.get_by_id(todo_id, user_id)

    def update_todo(
        self,
        todo_id: UUID,
        user_id: UUID,
        title: Optional[str] = None,
        completed: Optional[bool] = None,
        description: Optional[str] = None,
        priority: Optional[str] = None,
        category: Optional[str] = None,
        due_date: Optional[str] = None,
        is_recurring: Optional[bool] = None,
        recurring_frequency: Optional[str] = None,
        reminder_time: Optional[str] = None,
    ) -> Optional[Todo]:
        """
        Update a todo.

        Returns None if not found or not owned by user (security: don't leak existence).

        Raises:
            ValueError: If title validation fails
        """
        # Validate title if provided
        if title is not None:
            if len(title.strip()) == 0:
                raise ValueError("Title cannot be empty")
            if len(title) > 255:
                raise ValueError("Title must be 255 characters or less")
            title = title.strip()

        return self.todo_repo.update(
            todo_id=todo_id,
            user_id=user_id,
            title=title,
            completed=completed,
            description=description,
            priority=priority,
            category=category,
            due_date=due_date,
            is_recurring=is_recurring,
            recurring_frequency=recurring_frequency,
            reminder_time=reminder_time,
        )

    def delete_todo(self, todo_id: UUID, user_id: UUID) -> bool:
        """Delete a todo. Returns False if not found or not owned by user."""
        return self.todo_repo.delete(todo_id, user_id)
