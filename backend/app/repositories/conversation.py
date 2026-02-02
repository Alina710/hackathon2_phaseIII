"""Conversation repository for data access per data-model.md."""

from typing import Optional, List
from uuid import UUID
from datetime import datetime
from sqlmodel import Session, select, func

from app.models.conversation import Conversation
from app.models.message import Message


class ConversationRepository:
    """Repository for Conversation entity data access."""

    def __init__(self, session: Session):
        self.session = session

    def create(self, user_id: UUID) -> Conversation:
        """Create a new conversation for a user."""
        conversation = Conversation(user_id=user_id)
        self.session.add(conversation)
        self.session.commit()
        self.session.refresh(conversation)
        return conversation

    def get_by_id(self, conversation_id: UUID, user_id: UUID) -> Optional[Conversation]:
        """Get a conversation by ID, filtered by user_id for authorization."""
        statement = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        return self.session.exec(statement).first()

    def get_by_user(
        self,
        user_id: UUID,
        limit: int = 10,
        offset: int = 0
    ) -> List[Conversation]:
        """Get all conversations for a user, ordered by last_activity descending."""
        statement = (
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.last_activity.desc())
            .offset(offset)
            .limit(limit)
        )
        return list(self.session.exec(statement).all())

    def count_by_user(self, user_id: UUID) -> int:
        """Count total conversations for a user."""
        statement = (
            select(func.count())
            .select_from(Conversation)
            .where(Conversation.user_id == user_id)
        )
        result = self.session.exec(statement).one()
        return result

    def update_last_activity(self, conversation_id: UUID) -> Optional[Conversation]:
        """Update the last_activity timestamp of a conversation."""
        conversation = self.session.get(Conversation, conversation_id)
        if conversation:
            conversation.last_activity = datetime.utcnow()
            self.session.add(conversation)
            self.session.commit()
            self.session.refresh(conversation)
        return conversation

    def get_message_count(self, conversation_id: UUID) -> int:
        """Get the number of messages in a conversation."""
        statement = (
            select(func.count())
            .select_from(Message)
            .where(Message.conversation_id == conversation_id)
        )
        result = self.session.exec(statement).one()
        return result

    def get_first_user_message(self, conversation_id: UUID) -> Optional[str]:
        """Get the first user message in a conversation for preview."""
        statement = (
            select(Message)
            .where(
                Message.conversation_id == conversation_id,
                Message.role == "user"
            )
            .order_by(Message.created_at.asc())
            .limit(1)
        )
        message = self.session.exec(statement).first()
        if message:
            # Truncate for preview
            content = message.content
            if len(content) > 100:
                return content[:100] + "..."
            return content
        return None
