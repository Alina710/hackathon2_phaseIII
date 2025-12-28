"""Input validation utilities for CLI.

Ref: contracts/interfaces.md lines 73-79
"""


def validate_description(text: str) -> str:
    """Validate and clean task description input.
    
    Args:
        text: Raw input from user
        
    Returns:
        Cleaned description string
        
    Raises:
        ValueError: If text is empty or whitespace-only
    """
    if not text or not text.strip():
        raise ValueError("Task description cannot be empty")
    return text.strip()


def validate_task_id(text: str) -> int:
    """Validate and convert task ID input.
    
    Args:
        text: Raw input from user
        
    Returns:
        Integer task ID
        
    Raises:
        ValueError: If text is not a valid positive integer
    """
    try:
        task_id = int(text.strip())
        if task_id <= 0:
            raise ValueError("Invalid ID format. Please enter a number")
        return task_id
    except ValueError:
        raise ValueError("Invalid ID format. Please enter a number")
