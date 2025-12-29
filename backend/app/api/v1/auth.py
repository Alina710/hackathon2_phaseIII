"""Authentication endpoints per contracts/api.md."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlmodel import Session

from app.db.session import get_session
from app.services.auth import AuthService
from app.schemas.user import (
    UserCreate,
    UserSignIn,
    AuthResponse,
    UserResponse,
    SignOutResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])

SESSION_COOKIE_NAME = "session_token"


@router.post("/signup", response_model=AuthResponse, status_code=201)
def signup(
    user_data: UserCreate,
    response: Response,
    session: Session = Depends(get_session),
):
    """Create a new user account."""
    auth_service = AuthService(session)

    try:
        user, token = auth_service.signup(
            email=user_data.email,
            password=user_data.password,
        )
    except ValueError as e:
        error_message = str(e)
        if "already registered" in error_message:
            raise HTTPException(status_code=409, detail=error_message)
        raise HTTPException(status_code=400, detail=error_message)

    # Set session cookie
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=7 * 24 * 60 * 60,  # 7 days
    )

    return AuthResponse(user=UserResponse.model_validate(user))


@router.post("/signin", response_model=AuthResponse)
def signin(
    user_data: UserSignIn,
    response: Response,
    session: Session = Depends(get_session),
):
    """Sign in to an existing account."""
    auth_service = AuthService(session)

    try:
        user, token = auth_service.signin(
            email=user_data.email,
            password=user_data.password,
        )
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

    # Set session cookie
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=7 * 24 * 60 * 60,  # 7 days
    )

    return AuthResponse(user=UserResponse.model_validate(user))


@router.post("/signout", response_model=SignOutResponse)
def signout(
    response: Response,
    session: Session = Depends(get_session),
    session_token: Optional[str] = Cookie(None, alias=SESSION_COOKIE_NAME),
):
    """End the current session."""
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    auth_service = AuthService(session)
    auth_service.signout(session_token)

    # Clear session cookie
    response.delete_cookie(key=SESSION_COOKIE_NAME)

    return SignOutResponse(message="Signed out successfully")


@router.get("/session", response_model=AuthResponse)
def get_session_info(
    session: Session = Depends(get_session),
    session_token: Optional[str] = Cookie(None, alias=SESSION_COOKIE_NAME),
):
    """Get current session information."""
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    auth_service = AuthService(session)
    user = auth_service.get_session(session_token)

    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    return AuthResponse(user=UserResponse.model_validate(user))
