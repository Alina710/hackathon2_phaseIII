"""Todo repository for data access per data-model.md."""

from typing import Optional
from uuid import UUID
from datetime import datetime
from sqlmodel import Session, select, col, or_

from app.models.todo import Todo


class TodoRepository:
    """Repository for Todo entity data access."""

    def __init__(self, session: Session):
        self.session = session

    def create(
        self,
        title: str,
        user_id: UUID,
        description: Optional[str] = None,
        priority: str = "medium",
        category: str = "personal",
        due_date: Optional[datetime] = None,
        is_recurring: bool = False,
        recurring_frequency: Optional[str] = None,
        reminder_time: Optional[datetime] = None,
    ) -> Todo:
        """Create a new todo for a user."""
        todo = Todo(
            title=title,
            user_id=user_id,
            completed=False,
            description=description,
            priority=priority,
            category=category,
            due_date=due_date,
            is_recurring=is_recurring,
            recurring_frequency=recurring_frequency,
            reminder_time=reminder_time,
        )
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

    def list_filtered(
        self,
        user_id: UUID,
        search: Optional[str] = None,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        category: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> list[Todo]:
        """Get filtered and sorted todos for a user."""
        statement = select(Todo).where(Todo.user_id == user_id)

        # Apply search filter
        if search:
            search_term = f"%{search}%"
            statement = statement.where(
                or_(
                    col(Todo.title).ilike(search_term),
                    col(Todo.description).ilike(search_term),
                )
            )

        # Apply status filter
        if status:
            if status == "completed":
                statement = statement.where(Todo.completed == True)
            elif status == "pending":
                statement = statement.where(Todo.completed == False)

        # Apply priority filter
        if priority:
            statement = statement.where(Todo.priority == priority)

        # Apply category filter
        if category:
            statement = statement.where(Todo.category == category)

        # Apply sorting
        sort_column = getattr(Todo, sort_by, Todo.created_at)

        # Special handling for priority sorting (high > medium > low)
        if sort_by == "priority":
            priority_order = {"high": 3, "medium": 2, "low": 1}
            # We'll handle priority sorting after fetching for now
            # In production, use database-specific CASE statements
        else:
            if sort_order.lower() == "desc":
                statement = statement.order_by(sort_column.desc())
            else:
                statement = statement.order_by(sort_column.asc())

        todos = list(self.session.exec(statement).all())

        # Handle priority sorting separately if needed
        if sort_by == "priority":
            reverse = sort_order.lower() != "desc"
            priority_order = {"high": 3, "medium": 2, "low": 1}
            todos.sort(
                key=lambda x: priority_order.get(x.priority, 0),
                reverse=reverse,
            )

        return todos

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
        description: Optional[str] = None,
        priority: Optional[str] = None,
        category: Optional[str] = None,
        due_date: Optional[datetime] = None,
        is_recurring: Optional[bool] = None,
        recurring_frequency: Optional[str] = None,
        reminder_time: Optional[datetime] = None,
    ) -> Optional[Todo]:
        """Update a todo, filtered by user_id for authorization."""
        todo = self.get_by_id(todo_id, user_id)
        if not todo:
            return None

        if title is not None:
            todo.title = title
        if completed is not None:
            todo.completed = completed
        if description is not None:
            todo.description = description
        if priority is not None:
            todo.priority = priority
        if category is not None:
            todo.category = category
        if due_date is not None:
            todo.due_date = due_date
        if is_recurring is not None:
            todo.is_recurring = is_recurring
        if recurring_frequency is not None:
            todo.recurring_frequency = recurring_frequency
        if reminder_time is not None:
            todo.reminder_time = reminder_time

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
