"""Unit tests for input validators.

Ref: contracts/interfaces.md lines 73-79
"""
import pytest
from src.cli.validators import validate_description, validate_task_id


class TestValidateDescription:
    """Tests for validate_description function."""

    def test_valid_description(self):
        """Valid description is returned stripped."""
        assert validate_description("Test task") == "Test task"

    def test_description_with_whitespace(self):
        """Description with whitespace is trimmed."""
        assert validate_description("  Trimmed  ") == "Trimmed"

    def test_empty_description_raises(self):
        """Empty string raises ValueError."""
        with pytest.raises(ValueError, match="cannot be empty"):
            validate_description("")

    def test_whitespace_only_raises(self):
        """Whitespace-only string raises ValueError."""
        with pytest.raises(ValueError, match="cannot be empty"):
            validate_description("   ")


class TestValidateTaskId:
    """Tests for validate_task_id function."""

    def test_valid_id(self):
        """Valid numeric string returns integer."""
        assert validate_task_id("5") == 5

    def test_id_with_whitespace(self):
        """ID with whitespace is trimmed and parsed."""
        assert validate_task_id("  10  ") == 10

    def test_non_numeric_raises(self):
        """Non-numeric string raises ValueError."""
        with pytest.raises(ValueError, match="Invalid ID format"):
            validate_task_id("abc")

    def test_negative_id_raises(self):
        """Negative ID raises ValueError."""
        with pytest.raises(ValueError, match="Invalid ID format"):
            validate_task_id("-1")

    def test_zero_id_raises(self):
        """Zero ID raises ValueError."""
        with pytest.raises(ValueError, match="Invalid ID format"):
            validate_task_id("0")

    def test_float_string_raises(self):
        """Float string raises ValueError."""
        with pytest.raises(ValueError, match="Invalid ID format"):
            validate_task_id("3.5")
