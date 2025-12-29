"""User schemas per contracts/api.md."""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """Schema for user registration request."""
    email: EmailStr
    password: str  # Min 8 chars validated in service


class UserSignIn(BaseModel):
    """Schema for user sign-in request."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user in API responses."""
    id: UUID
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    """Schema for auth API responses."""
    user: UserResponse


class SignOutResponse(BaseModel):
    """Schema for sign-out response."""
    message: str
