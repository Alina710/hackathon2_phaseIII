"""API dependencies and exception handlers."""

from typing import Optional
from fastapi import Request, HTTPException, Depends, Cookie
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlmodel import Session

from app.schemas.error import ErrorResponse, ErrorBody, ErrorDetail, ErrorCode
from app.db.session import get_session
from app.services.auth import AuthService
from app.models.user import User

SESSION_COOKIE_NAME = "session_token"


def get_current_user(
    session: Session = Depends(get_session),
    session_token: Optional[str] = Cookie(None, alias=SESSION_COOKIE_NAME),
) -> User:
    """Get current authenticated user from session cookie."""
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    auth_service = AuthService(session)
    user = auth_service.get_session(session_token)

    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    return user


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
) -> JSONResponse:
    """Handle Pydantic validation errors with standardized format."""
    details = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"] if loc != "body")
        details.append(ErrorDetail(field=field, message=error["msg"]))

    error_response = ErrorResponse(
        error=ErrorBody(
            code=ErrorCode.VALIDATION_ERROR,
            message="Invalid input",
            details=details
        )
    )
    return JSONResponse(
        status_code=400,
        content=error_response.model_dump()
    )


async def http_exception_handler(
    request: Request,
    exc: HTTPException
) -> JSONResponse:
    """Handle HTTPException with standardized format."""
    # Map status codes to error codes
    code_map = {
        400: ErrorCode.VALIDATION_ERROR,
        401: ErrorCode.UNAUTHORIZED,
        403: ErrorCode.FORBIDDEN,
        404: ErrorCode.NOT_FOUND,
        409: ErrorCode.CONFLICT,
        500: ErrorCode.SERVER_ERROR,
    }

    error_code = code_map.get(exc.status_code, ErrorCode.SERVER_ERROR)

    error_response = ErrorResponse(
        error=ErrorBody(
            code=error_code,
            message=str(exc.detail)
        )
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump()
    )


async def generic_exception_handler(
    request: Request,
    exc: Exception
) -> JSONResponse:
    """Handle unexpected exceptions with standardized format."""
    error_response = ErrorResponse(
        error=ErrorBody(
            code=ErrorCode.SERVER_ERROR,
            message="Internal server error"
        )
    )
    return JSONResponse(
        status_code=500,
        content=error_response.model_dump()
    )
