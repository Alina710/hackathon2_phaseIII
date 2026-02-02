"""Groq Agent service for AI chatbot.

This module provides the agent that interprets natural language and
invokes MCP tools for todo management operations.
"""

import json
import logging
from typing import Dict, Any, List, Optional
from uuid import UUID

from groq import Groq
from sqlmodel import Session

from app.mcp.server import MCPServer
from app.config import get_settings

logger = logging.getLogger(__name__)

# System prompt for the todo management assistant
SYSTEM_PROMPT = """You are a helpful todo management assistant. Help users manage their tasks through natural conversation.

Your capabilities:
- Add new tasks
- List existing tasks (all, completed, or incomplete)
- Update task titles
- Delete tasks
- Mark tasks as complete or incomplete

Guidelines:
1. Always confirm actions you take with friendly, clear messages
2. If the user's intent is unclear, ask a clarifying question
3. Stay focused on todo management - politely redirect off-topic questions
4. When listing tasks, format them in a readable way
5. Be concise but friendly
6. When a task operation fails, explain the issue clearly

When you need to perform a task operation, use the available tools.
Always use tools when the user wants to add, list, update, delete, or complete tasks."""


class AgentServiceError(Exception):
    """Exception raised for agent service errors."""
    pass


class AgentService:
    """
    Service for Groq Agent operations.

    Handles natural language processing and tool invocation for todo management.
    Created per-request with user context for stateless operation.
    """

    def __init__(self, user_id: UUID, session: Session):
        """
        Initialize the agent service.

        Args:
            user_id: The authenticated user's ID
            session: Database session for tool operations
        """
        self.user_id = user_id
        self.session = session
        self.mcp_server = MCPServer(user_id, session)

        # Initialize Groq client
        settings = get_settings()
        if not settings.groq_api_key:
            raise AgentServiceError("GROQ_API_KEY not configured")

        self.client = Groq(api_key=settings.groq_api_key)
        self.model = settings.groq_model

    def _build_messages(
        self,
        user_message: str,
        conversation_history: List[Dict[str, str]]
    ) -> List[Dict[str, str]]:
        """
        Build the messages array for the OpenAI API.

        Args:
            user_message: Current user message
            conversation_history: Previous messages in the conversation

        Returns:
            List of message dicts for OpenAI API
        """
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Add conversation history (limit to last 20 messages per research.md)
        history_limit = 20
        if len(conversation_history) > history_limit:
            conversation_history = conversation_history[-history_limit:]

        for msg in conversation_history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        return messages

    def _execute_tool_call(self, tool_call) -> Dict[str, Any]:
        """
        Execute a tool call and return the result.

        Args:
            tool_call: OpenAI tool call object

        Returns:
            Tool execution result
        """
        tool_name = tool_call.function.name
        try:
            arguments = json.loads(tool_call.function.arguments)
        except json.JSONDecodeError:
            return {
                "status": "error",
                "error": "invalid_arguments",
                "message": "Failed to parse tool arguments"
            }

        try:
            result = self.mcp_server.execute_tool(tool_name, arguments)
            return result
        except ValueError as e:
            return {
                "status": "error",
                "error": "tool_not_found",
                "message": str(e)
            }
        except Exception as e:
            logger.error(f"Tool execution error: {tool_name} - {str(e)}")
            return {
                "status": "error",
                "error": "execution_error",
                "message": f"Tool execution failed: {str(e)}"
            }

    def process_message(
        self,
        user_message: str,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Process a user message and return the agent's response.

        Args:
            user_message: The user's natural language message
            conversation_history: Previous messages for context

        Returns:
            Dict containing:
                - response: Agent's text response
                - tool_calls: List of tool invocations (if any)

        Raises:
            AgentServiceError: If OpenAI API fails
        """
        if conversation_history is None:
            conversation_history = []

        messages = self._build_messages(user_message, conversation_history)
        tools = self.mcp_server.get_tool_definitions()
        tool_call_records: List[Dict[str, Any]] = []

        try:
            # First API call - may include tool calls
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=tools if tools else None,
                tool_choice="auto" if tools else None,
                max_tokens=500,
                temperature=0.7
            )

            message = response.choices[0].message

            # Process tool calls if any
            while message.tool_calls:
                # Add assistant message with tool calls to context
                messages.append({
                    "role": "assistant",
                    "content": message.content or "",
                    "tool_calls": [
                        {
                            "id": tc.id,
                            "type": "function",
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments
                            }
                        }
                        for tc in message.tool_calls
                    ]
                })

                # Execute each tool call
                for tool_call in message.tool_calls:
                    tool_name = tool_call.function.name
                    try:
                        tool_input = json.loads(tool_call.function.arguments)
                    except json.JSONDecodeError:
                        tool_input = {}

                    tool_output = self._execute_tool_call(tool_call)

                    # Record the tool call
                    tool_call_records.append({
                        "tool": tool_name,
                        "input": tool_input,
                        "output": tool_output,
                        "status": tool_output.get("status", "error")
                    })

                    # Add tool result to messages
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": json.dumps(tool_output)
                    })

                # Get follow-up response after tool execution
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    tools=tools if tools else None,
                    tool_choice="auto" if tools else None,
                    max_tokens=500,
                    temperature=0.7
                )
                message = response.choices[0].message

            # Return final response
            return {
                "response": message.content or "I'm not sure how to help with that.",
                "tool_calls": tool_call_records
            }

        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise AgentServiceError(f"AI service unavailable: {str(e)}")
