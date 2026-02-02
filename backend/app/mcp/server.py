"""MCP Server setup for AI chatbot tool invocation.

This module provides the MCP server that registers and executes todo
management tools. The server is created fresh per request (stateless).
"""

from typing import Dict, Any, Callable, List
from uuid import UUID

from app.mcp.tools import get_all_tools


class MCPToolRegistry:
    """Registry for MCP tools with user context injection."""

    def __init__(self):
        self._tools: Dict[str, Callable] = {}
        self._tool_definitions: List[Dict[str, Any]] = []

    def register_tool(
        self,
        name: str,
        func: Callable,
        description: str,
        parameters: Dict[str, Any]
    ) -> None:
        """Register a tool with its schema."""
        self._tools[name] = func
        self._tool_definitions.append({
            "type": "function",
            "function": {
                "name": name,
                "description": description,
                "parameters": parameters
            }
        })

    def get_tool(self, name: str) -> Callable:
        """Get a registered tool by name."""
        return self._tools.get(name)

    def get_tool_definitions(self) -> List[Dict[str, Any]]:
        """Get OpenAI-compatible tool definitions."""
        return self._tool_definitions

    def list_tools(self) -> List[str]:
        """List all registered tool names."""
        return list(self._tools.keys())


class MCPServer:
    """
    MCP Server for managing todo operations via tool calls.

    Created per-request with user context injected for stateless operation.
    """

    def __init__(self, user_id: UUID, session):
        """
        Initialize MCP server with user context.

        Args:
            user_id: The authenticated user's ID
            session: Database session for tool operations
        """
        self.user_id = user_id
        self.session = session
        self.registry = MCPToolRegistry()
        self._register_tools()

    def _register_tools(self) -> None:
        """Register all MCP tools for todo management."""
        tools = get_all_tools()

        for tool_def in tools:
            self.registry.register_tool(
                name=tool_def["name"],
                func=tool_def["function"],
                description=tool_def["description"],
                parameters=tool_def["parameters"]
            )

    def get_tool_definitions(self) -> List[Dict[str, Any]]:
        """Get OpenAI-compatible tool definitions for agent."""
        return self.registry.get_tool_definitions()

    def execute_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a tool with the given arguments.

        Args:
            tool_name: Name of the tool to execute
            arguments: Arguments to pass to the tool

        Returns:
            Tool execution result

        Raises:
            ValueError: If tool not found
        """
        tool_func = self.registry.get_tool(tool_name)
        if not tool_func:
            raise ValueError(f"Tool not found: {tool_name}")

        # Inject user context and session into arguments
        return tool_func(
            user_id=self.user_id,
            session=self.session,
            **arguments
        )
