"""Message repository for data access per data-model.md."""

from typing import Optional, List, Any
from uuid import UUID
from sqlmodel import Session, select

from app.models.message import Message


class MessageRepository:
    """Repository for Message entity data access."""

    def __init__(self, session: Session):
        self.session = session

    def create(
        self,
        conversation_id: UUID,
        role: str,
        content: str,
        tool_calls: Optional[Any] = None
    ) -> Message:
        """Create a new message in a conversation."""
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            tool_calls=tool_calls
        )
        self.session.add(message)
        self.session.commit()
        self.session.refresh(message)
        return message

    def get_by_conversation(
        self,
        conversation_id: UUID,
        limit: int = 50
    ) -> List[Message]:
        """Get messages for a conversation, ordered by created_at ascending."""
        statement = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .limit(limit)
        )
        return list(self.session.exec(statement).all())

    def get_history(
        self,
        conversation_id: UUID,
        limit: int = 20
    ) -> List[Message]:
        """
        Get conversation history for agent context.
        Returns the most recent messages up to limit.
        """
        # First get count to determine offset for most recent
        statement = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.desc())
            .limit(limit)
        )
        messages = list(self.session.exec(statement).all())
        # Reverse to get chronological order
        return list(reversed(messages))

    def get_by_id(self, message_id: UUID) -> Optional[Message]:
        """Get a message by ID."""
        return self.session.get(Message, message_id)
