"""Error response schemas per contracts/api.md."""

from typing import Optional
from pydantic import BaseModel


class ErrorDetail(BaseModel):
    """Field-specific error detail."""
    field: str
    message: str


class ErrorBody(BaseModel):
    """Error body structure."""
    code: str
    message: str
    details: Optional[list[ErrorDetail]] = None


class ErrorResponse(BaseModel):
    """Standardized error response wrapper."""
    error: ErrorBody


# Error codes as constants
class ErrorCode:
    VALIDATION_ERROR = "VALIDATION_ERROR"
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    NOT_FOUND = "NOT_FOUND"
    CONFLICT = "CONFLICT"
    SERVER_ERROR = "SERVER_ERROR"
