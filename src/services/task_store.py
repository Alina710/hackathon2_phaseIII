"""TaskStore service for in-memory task storage.

Ref: data-model.md lines 34-49, contracts/interfaces.md lines 17-58
"""
from src.models.task import Task


class TaskStore:
    """In-memory storage for Task objects.
    
    Attributes:
        _tasks: Dictionary mapping task IDs to Task objects
        _next_id: Counter for generating unique task IDs (starts at 1)
    """

    def __init__(self) -> None:
        """Initialize empty task store."""
        self._tasks: dict[int, Task] = {}
        self._next_id: int = 1

    def add(self, description: str) -> Task:
        """Create a new task with the given description.
        
        Args:
            description: Non-empty task description
            
        Returns:
            The created Task with auto-assigned ID
            
        Raises:
            ValueError: If description is empty or whitespace-only
            
        Ref: contracts/interfaces.md lines 17-23
        """
        if not description or not description.strip():
            raise ValueError("Task description cannot be empty")
        
        task = Task(id=self._next_id, description=description.strip())
        self._tasks[self._next_id] = task
        self._next_id += 1
        return task

    def get(self, task_id: int) -> Task | None:
        """Retrieve a task by its ID.
        
        Args:
            task_id: The task identifier
            
        Returns:
            Task if found, None otherwise
            
        Ref: contracts/interfaces.md lines 25-29
        """
        return self._tasks.get(task_id)

    def get_all(self) -> list[Task]:
        """Return all tasks in the store.
        
        Returns:
            List of all Task objects (may be empty)
            
        Ref: contracts/interfaces.md lines 31-34
        """
        return list(self._tasks.values())

    def update(self, task_id: int, description: str) -> Task | None:
        """Update the description of an existing task.
        
        Args:
            task_id: The task identifier
            description: New task description (non-empty)
            
        Returns:
            Updated Task if found, None if not found
            
        Raises:
            ValueError: If description is empty or whitespace-only
            
        Ref: contracts/interfaces.md lines 36-44
        """
        if not description or not description.strip():
            raise ValueError("Task description cannot be empty")
        
        task = self._tasks.get(task_id)
        if task is None:
            return None
        
        task.description = description.strip()
        return task

    def delete(self, task_id: int) -> bool:
        """Remove a task from the store.
        
        Args:
            task_id: The task identifier
            
        Returns:
            True if deleted, False if not found
            
        Ref: contracts/interfaces.md lines 46-51
        """
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False

    def toggle_complete(self, task_id: int) -> Task | None:
        """Toggle the completion status of a task.
        
        Args:
            task_id: The task identifier
            
        Returns:
            Updated Task if found, None if not found
            
        Ref: contracts/interfaces.md lines 53-58
        """
        task = self._tasks.get(task_id)
        if task is None:
            return None
        
        task.completed = not task.completed
        return task
