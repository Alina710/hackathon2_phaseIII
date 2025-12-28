"""Unit tests for Task model.

Ref: data-model.md lines 8-30
"""
import pytest
from src.models.task import Task


class TestTask:
    """Tests for Task dataclass."""

    def test_task_creation_with_defaults(self):
        """Task created with id and description has completed=False."""
        task = Task(id=1, description="Test task")
        assert task.id == 1
        assert task.description == "Test task"
        assert task.completed is False

    def test_task_creation_with_completed_true(self):
        """Task can be created with completed=True."""
        task = Task(id=2, description="Done task", completed=True)
        assert task.id == 2
        assert task.description == "Done task"
        assert task.completed is True

    def test_task_equality(self):
        """Two tasks with same attributes are equal."""
        task1 = Task(id=1, description="Same", completed=False)
        task2 = Task(id=1, description="Same", completed=False)
        assert task1 == task2

    def test_task_inequality(self):
        """Tasks with different attributes are not equal."""
        task1 = Task(id=1, description="Task A")
        task2 = Task(id=2, description="Task B")
        assert task1 != task2
