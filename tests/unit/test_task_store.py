"""Unit tests for TaskStore service.

Ref: contracts/interfaces.md lines 17-58
"""
import pytest
from src.services.task_store import TaskStore
from src.models.task import Task


class TestTaskStoreAdd:
    """Tests for TaskStore.add() method."""

    def test_add_creates_task_with_id(self):
        """add() creates a task with auto-assigned ID starting at 1."""
        store = TaskStore()
        task = store.add("First task")
        assert task.id == 1
        assert task.description == "First task"
        assert task.completed is False

    def test_add_increments_id(self):
        """Each add() increments the task ID."""
        store = TaskStore()
        task1 = store.add("Task 1")
        task2 = store.add("Task 2")
        assert task1.id == 1
        assert task2.id == 2

    def test_add_strips_whitespace(self):
        """add() strips leading/trailing whitespace from description."""
        store = TaskStore()
        task = store.add("  Trimmed task  ")
        assert task.description == "Trimmed task"

    def test_add_empty_description_raises(self):
        """add() raises ValueError for empty description."""
        store = TaskStore()
        with pytest.raises(ValueError, match="cannot be empty"):
            store.add("")

    def test_add_whitespace_only_raises(self):
        """add() raises ValueError for whitespace-only description."""
        store = TaskStore()
        with pytest.raises(ValueError, match="cannot be empty"):
            store.add("   ")


class TestTaskStoreGet:
    """Tests for TaskStore.get() method."""

    def test_get_existing_task(self):
        """get() returns task when found."""
        store = TaskStore()
        added = store.add("Test task")
        retrieved = store.get(1)
        assert retrieved == added

    def test_get_nonexistent_task(self):
        """get() returns None for nonexistent ID."""
        store = TaskStore()
        assert store.get(999) is None


class TestTaskStoreGetAll:
    """Tests for TaskStore.get_all() method."""

    def test_get_all_empty_store(self):
        """get_all() returns empty list for empty store."""
        store = TaskStore()
        assert store.get_all() == []

    def test_get_all_returns_all_tasks(self):
        """get_all() returns all added tasks."""
        store = TaskStore()
        store.add("Task 1")
        store.add("Task 2")
        tasks = store.get_all()
        assert len(tasks) == 2
        assert tasks[0].description == "Task 1"
        assert tasks[1].description == "Task 2"


class TestTaskStoreUpdate:
    """Tests for TaskStore.update() method."""

    def test_update_existing_task(self):
        """update() modifies description of existing task."""
        store = TaskStore()
        store.add("Original")
        updated = store.update(1, "Modified")
        assert updated is not None
        assert updated.description == "Modified"

    def test_update_nonexistent_task(self):
        """update() returns None for nonexistent task."""
        store = TaskStore()
        assert store.update(999, "New desc") is None

    def test_update_empty_description_raises(self):
        """update() raises ValueError for empty description."""
        store = TaskStore()
        store.add("Original")
        with pytest.raises(ValueError, match="cannot be empty"):
            store.update(1, "")

    def test_update_preserves_completed_status(self):
        """update() does not change completed status."""
        store = TaskStore()
        store.add("Task")
        store.toggle_complete(1)
        updated = store.update(1, "Updated")
        assert updated.completed is True


class TestTaskStoreDelete:
    """Tests for TaskStore.delete() method."""

    def test_delete_existing_task(self):
        """delete() removes task and returns True."""
        store = TaskStore()
        store.add("To delete")
        assert store.delete(1) is True
        assert store.get(1) is None

    def test_delete_nonexistent_task(self):
        """delete() returns False for nonexistent task."""
        store = TaskStore()
        assert store.delete(999) is False


class TestTaskStoreToggleComplete:
    """Tests for TaskStore.toggle_complete() method."""

    def test_toggle_incomplete_to_complete(self):
        """toggle_complete() changes False to True."""
        store = TaskStore()
        store.add("Task")
        toggled = store.toggle_complete(1)
        assert toggled.completed is True

    def test_toggle_complete_to_incomplete(self):
        """toggle_complete() changes True to False."""
        store = TaskStore()
        store.add("Task")
        store.toggle_complete(1)  # Now True
        toggled = store.toggle_complete(1)  # Now False
        assert toggled.completed is False

    def test_toggle_nonexistent_task(self):
        """toggle_complete() returns None for nonexistent task."""
        store = TaskStore()
        assert store.toggle_complete(999) is None
