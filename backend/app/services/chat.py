"""Chat service for orchestrating chatbot operations.

This module provides the orchestration layer between the API,
repositories, and the AI agent for chat functionality.
"""

from typing import Dict, Any, List, Optional
from uuid import UUID
import logging

from sqlmodel import Session

from app.repositories.conversation import ConversationRepository
from app.repositories.message import MessageRepository
from app.services.agent import AgentService, AgentServiceError
from app.schemas.chat import ChatResponse, ToolCall
from app.schemas.conversation import (
    ConversationSummary,
    ConversationListResponse,
    ConversationDetailResponse
)
from app.schemas.message import MessageResponse, MessageRole

logger = logging.getLogger(__name__)


class ChatServiceError(Exception):
    """Exception raised for chat service errors."""
    pass


class ChatService:
    """
    Service for chat operations.

    Orchestrates between repositories and agent for chat functionality.
    Created per-request for stateless operation.
    """

    def __init__(self, user_id: UUID, session: Session):
        """
        Initialize the chat service.

        Args:
            user_id: The authenticated user's ID
            session: Database session
        """
        self.user_id = user_id
        self.session = session
        self.conversation_repo = ConversationRepository(session)
        self.message_repo = MessageRepository(session)

    def _get_or_create_conversation(
        self,
        conversation_id: Optional[UUID] = None
    ):
        """
        Get existing conversation or create new one.

        Args:
            conversation_id: Optional existing conversation ID

        Returns:
            Conversation object

        Raises:
            ChatServiceError: If conversation not found or unauthorized
        """
        if conversation_id:
            conversation = self.conversation_repo.get_by_id(
                conversation_id,
                self.user_id
            )
            if not conversation:
                raise ChatServiceError("Conversation not found")
            return conversation
        else:
            return self.conversation_repo.create(self.user_id)

    def _load_conversation_history(
        self,
        conversation_id: UUID,
        limit: int = 20
    ) -> List[Dict[str, str]]:
        """
        Load conversation history for agent context.

        Args:
            conversation_id: Conversation ID
            limit: Maximum messages to load

        Returns:
            List of message dicts with role and content
        """
        messages = self.message_repo.get_history(conversation_id, limit)
        return [
            {"role": msg.role, "content": msg.content}
            for msg in messages
            if msg.role in ["user", "assistant"]  # Exclude tool messages
        ]

    def _persist_messages(
        self,
        conversation_id: UUID,
        user_message: str,
        assistant_response: str,
        tool_calls: Optional[List[Dict[str, Any]]] = None
    ) -> None:
        """
        Persist user and assistant messages to database.

        Args:
            conversation_id: Conversation ID
            user_message: User's message
            assistant_response: Assistant's response
            tool_calls: Tool call records (if any)
        """
        # Save user message
        self.message_repo.create(
            conversation_id=conversation_id,
            role="user",
            content=user_message
        )

        # Save assistant message with tool calls
        self.message_repo.create(
            conversation_id=conversation_id,
            role="assistant",
            content=assistant_response,
            tool_calls=tool_calls if tool_calls else None
        )

        # Update conversation last_activity
        self.conversation_repo.update_last_activity(conversation_id)

    def process_message(
        self,
        message: str,
        conversation_id: Optional[UUID] = None
    ) -> ChatResponse:
        """
        Process a chat message and return the response.

        Args:
            message: User's natural language message
            conversation_id: Optional existing conversation ID

        Returns:
            ChatResponse with response, conversation_id, and tool_calls

        Raises:
            ChatServiceError: If processing fails
        """
        # Get or create conversation
        conversation = self._get_or_create_conversation(conversation_id)

        # Load conversation history
        history = self._load_conversation_history(conversation.id)

        # Initialize agent and process message
        try:
            agent = AgentService(self.user_id, self.session)
            result = agent.process_message(message, history)
        except AgentServiceError as e:
            logger.error(f"Agent error: {str(e)}")
            raise ChatServiceError(str(e))

        # Persist messages
        self._persist_messages(
            conversation_id=conversation.id,
            user_message=message,
            assistant_response=result["response"],
            tool_calls=result.get("tool_calls")
        )

        # Build response
        tool_calls = [
            ToolCall(
                tool=tc["tool"],
                input=tc["input"],
                output=tc["output"],
                status=tc["status"]
            )
            for tc in result.get("tool_calls", [])
        ]

        return ChatResponse(
            response=result["response"],
            conversation_id=conversation.id,
            tool_calls=tool_calls
        )

    def list_conversations(
        self,
        limit: int = 10,
        offset: int = 0
    ) -> ConversationListResponse:
        """
        List user's conversations.

        Args:
            limit: Maximum conversations to return
            offset: Offset for pagination

        Returns:
            ConversationListResponse with conversations and total
        """
        conversations = self.conversation_repo.get_by_user(
            self.user_id,
            limit=limit,
            offset=offset
        )
        total = self.conversation_repo.count_by_user(self.user_id)

        summaries = []
        for conv in conversations:
            message_count = self.conversation_repo.get_message_count(conv.id)
            preview = self.conversation_repo.get_first_user_message(conv.id)

            summaries.append(ConversationSummary(
                id=conv.id,
                created_at=conv.created_at,
                last_activity=conv.last_activity,
                message_count=message_count,
                preview=preview
            ))

        return ConversationListResponse(
            conversations=summaries,
            total=total
        )

    def get_conversation(
        self,
        conversation_id: UUID,
        message_limit: int = 50
    ) -> ConversationDetailResponse:
        """
        Get a conversation with its messages.

        Args:
            conversation_id: Conversation ID
            message_limit: Maximum messages to return

        Returns:
            ConversationDetailResponse with messages

        Raises:
            ChatServiceError: If conversation not found
        """
        conversation = self.conversation_repo.get_by_id(
            conversation_id,
            self.user_id
        )
        if not conversation:
            raise ChatServiceError("Conversation not found")

        messages = self.message_repo.get_by_conversation(
            conversation_id,
            limit=message_limit
        )

        message_responses = [
            MessageResponse(
                id=msg.id,
                role=MessageRole(msg.role),
                content=msg.content,
                tool_calls=msg.tool_calls,
                created_at=msg.created_at
            )
            for msg in messages
        ]

        return ConversationDetailResponse(
            id=conversation.id,
            created_at=conversation.created_at,
            last_activity=conversation.last_activity,
            messages=message_responses
        )
