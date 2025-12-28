"""Task model for the Todo CLI application.

Ref: data-model.md lines 8-30
"""
from dataclasses import dataclass


@dataclass
class Task:
    """Represents a single todo item.
    
    Attributes:
        id: Unique identifier (auto-assigned, immutable)
        description: Text describing the task (required, non-empty)
        completed: Whether the task is done (default: False)
    """
    id: int
    description: str
    completed: bool = False
