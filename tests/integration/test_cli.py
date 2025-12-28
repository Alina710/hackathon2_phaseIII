"""Integration tests for CLI flows.

Tests end-to-end user workflows.
"""
import pytest
from io import StringIO
from unittest.mock import patch
from src.services.task_store import TaskStore
from src.cli.handlers import (
    handle_add_task,
    handle_view_tasks,
    handle_update_task,
    handle_delete_task,
    handle_toggle_task,
    handle_exit,
)


class TestAddViewFlow:
    """Test add -> view workflow."""

    def test_add_then_view_shows_task(self):
        """Adding a task then viewing shows it in the list."""
        store = TaskStore()
        
        # Add a task
        with patch("builtins.input", return_value="Buy groceries"):
            with patch("sys.stdout", new=StringIO()) as output:
                handle_add_task(store)
                assert "Task added with ID 1" in output.getvalue()
        
        # View tasks
        with patch("sys.stdout", new=StringIO()) as output:
            handle_view_tasks(store)
            output_text = output.getvalue()
            assert "Buy groceries" in output_text
            assert "[ ]" in output_text

    def test_add_multiple_tasks(self):
        """Multiple tasks can be added and viewed."""
        store = TaskStore()
        
        with patch("builtins.input", return_value="Task 1"):
            handle_add_task(store)
        with patch("builtins.input", return_value="Task 2"):
            handle_add_task(store)
        
        tasks = store.get_all()
        assert len(tasks) == 2


class TestToggleCompleteFlow:
    """Test toggle complete workflow."""

    def test_toggle_marks_complete(self):
        """Toggling a task marks it complete."""
        store = TaskStore()
        store.add("Test task")
        
        with patch("builtins.input", return_value="1"):
            with patch("sys.stdout", new=StringIO()) as output:
                handle_toggle_task(store)
                assert "marked as complete" in output.getvalue()
        
        # Verify in view
        with patch("sys.stdout", new=StringIO()) as output:
            handle_view_tasks(store)
            assert "[X]" in output.getvalue()

    def test_toggle_twice_returns_incomplete(self):
        """Toggling twice returns to incomplete."""
        store = TaskStore()
        store.add("Test task")
        
        with patch("builtins.input", return_value="1"):
            handle_toggle_task(store)
        with patch("builtins.input", return_value="1"):
            with patch("sys.stdout", new=StringIO()) as output:
                handle_toggle_task(store)
                assert "marked as incomplete" in output.getvalue()


class TestUpdateFlow:
    """Test update workflow."""

    def test_update_changes_description(self):
        """Updating a task changes its description."""
        store = TaskStore()
        store.add("Original description")
        
        with patch("builtins.input", side_effect=["1", "Updated description"]):
            with patch("sys.stdout", new=StringIO()) as output:
                handle_update_task(store)
                assert "Task 1 updated" in output.getvalue()
        
        task = store.get(1)
        assert task.description == "Updated description"


class TestDeleteFlow:
    """Test delete workflow."""

    def test_delete_removes_task(self):
        """Deleting a task removes it from the store."""
        store = TaskStore()
        store.add("To be deleted")
        
        with patch("builtins.input", return_value="1"):
            with patch("sys.stdout", new=StringIO()) as output:
                handle_delete_task(store)
                assert "Task 1 deleted" in output.getvalue()
        
        assert store.get(1) is None

    def test_view_empty_after_delete(self):
        """View shows no tasks after deleting the only task."""
        store = TaskStore()
        store.add("Only task")
        store.delete(1)
        
        with patch("sys.stdout", new=StringIO()) as output:
            handle_view_tasks(store)
            assert "No tasks found" in output.getvalue()


class TestInvalidInputHandling:
    """Test invalid input handling."""

    def test_add_empty_description(self):
        """Adding empty description shows error."""
        store = TaskStore()
        
        with patch("builtins.input", return_value=""):
            with patch("sys.stdout", new=StringIO()) as output:
                handle_add_task(store)
                assert "cannot be empty" in output.getvalue()

    def test_toggle_invalid_id(self):
        """Toggling with invalid ID shows error."""
        store = TaskStore()
        
        with patch("builtins.input", return_value="abc"):
            with patch("sys.stdout", new=StringIO()) as output:
                handle_toggle_task(store)
                assert "Invalid ID format" in output.getvalue()

    def test_toggle_nonexistent_task(self):
        """Toggling nonexistent task shows error."""
        store = TaskStore()
        
        with patch("builtins.input", return_value="999"):
            with patch("sys.stdout", new=StringIO()) as output:
                handle_toggle_task(store)
                assert "not found" in output.getvalue()

    def test_update_empty_description(self):
        """Updating with empty description shows error."""
        store = TaskStore()
        store.add("Original")
        
        with patch("builtins.input", side_effect=["1", ""]):
            with patch("sys.stdout", new=StringIO()) as output:
                handle_update_task(store)
                assert "cannot be empty" in output.getvalue()


class TestExitFlow:
    """Test exit workflow."""

    def test_exit_returns_true(self):
        """handle_exit() returns True to signal exit."""
        with patch("sys.stdout", new=StringIO()) as output:
            result = handle_exit()
            assert result is True
            assert "Goodbye" in output.getvalue()
