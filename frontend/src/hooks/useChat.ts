import { useState, useCallback } from 'react';
import { chatApi, Message, ChatResponse, ToolCall } from '../lib/chat-api';
import { useAuth } from './useAuth';

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  conversationId: string | null;
  sendMessage: (content: string) => Promise<void>;
  loadConversation: (id: string) => Promise<void>;
  startNewConversation: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { user } = useAuth();

  const loadConversation = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const detail = await chatApi.getConversation(id);
      setMessages(detail.messages);
      setConversationId(detail.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startNewConversation = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setError(null);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Optimistic update
    const tempUserMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempUserMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatApi.sendMessage(content, conversationId || undefined);

      // Update conversation ID if it was new
      if (!conversationId) {
        setConversationId(response.conversation_id);
      }

      // Create assistant message from response
      const assistantMessage: Message = {
        id: crypto.randomUUID(), // In reality backend provides IDs, but for new messages we generate ID or refresh
        role: 'assistant',
        content: response.response,
        tool_calls: response.tool_calls,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If needed, we could reload full conversation to ensure sync with backend IDs
      // await loadConversation(response.conversation_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Theoretically remove the optimistic message on error, but keeping it lets user retry copy-paste
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  return {
    messages,
    isLoading,
    error,
    conversationId,
    sendMessage,
    loadConversation,
    startNewConversation,
  };
}
