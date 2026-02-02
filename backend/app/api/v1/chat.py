"""Chat API endpoints per contracts/chat-api.yaml."""

from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from app.db.session import get_session
from app.api.deps import get_current_user
from app.models.user import User
from app.services.chat import ChatService, ChatServiceError
from app.services.agent import AgentServiceError
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.conversation import ConversationListResponse, ConversationDetailResponse
from app.schemas.error import ErrorResponse, ErrorBody, ErrorCode

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
def send_chat_message(
    request: ChatRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Send a natural language message to the AI assistant.

    The assistant will interpret the message and perform todo operations
    as needed, returning a conversational response.
    """
    # Validate message
    if not request.message or len(request.message.strip()) == 0:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )

    if len(request.message) > 5000:
        raise HTTPException(
            status_code=400,
            detail="Message must be 5000 characters or less"
        )

    chat_service = ChatService(current_user.id, session)

    try:
        response = chat_service.process_message(
            message=request.message.strip(),
            conversation_id=request.conversation_id
        )
        return response

    except ChatServiceError as e:
        error_msg = str(e)

        # Handle specific error cases
        if "not found" in error_msg.lower():
            raise HTTPException(status_code=404, detail=error_msg)
        elif "unavailable" in error_msg.lower():
            raise HTTPException(status_code=503, detail=error_msg)
        else:
            raise HTTPException(status_code=500, detail=error_msg)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred"
        )


@router.get("/conversations", response_model=ConversationListResponse)
def list_conversations(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    limit: int = Query(default=10, ge=1, le=50),
    offset: int = Query(default=0, ge=0),
):
    """
    List all conversations for the authenticated user.

    Returns conversations sorted by last activity (most recent first).
    """
    chat_service = ChatService(current_user.id, session)
    return chat_service.list_conversations(limit=limit, offset=offset)


@router.get("/conversations/{conversation_id}", response_model=ConversationDetailResponse)
def get_conversation(
    conversation_id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    message_limit: int = Query(default=50, ge=1, le=100),
):
    """
    Get a specific conversation with its messages.

    Returns the conversation details and message history.
    """
    chat_service = ChatService(current_user.id, session)

    try:
        return chat_service.get_conversation(
            conversation_id=conversation_id,
            message_limit=message_limit
        )
    except ChatServiceError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail="Conversation not found")
        raise HTTPException(status_code=500, detail=str(e))
