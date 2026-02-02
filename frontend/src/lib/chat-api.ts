import { api } from './api';
import { User } from './types';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: ToolCall[];
  created_at: string;
}

export interface ToolCall {
  tool: string;
  input: any;
  output: any;
  status: 'success' | 'error';
}

export interface ConversationSummary {
  id: string;
  created_at: string;
  last_activity: string;
  message_count: number;
  preview?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  tool_calls: ToolCall[];
}

export interface ConversationDetail {
  id: string;
  created_at: string;
  last_activity: string;
  messages: Message[];
}

export const chatApi = {
  // Send a message and get a response
  sendMessage: async (message: string, conversationId?: string): Promise<ChatResponse> => {
    return api.post<ChatResponse>('/chat', {
      message,
      conversation_id: conversationId,
    });
  },

  // List user's conversations
  getConversations: async (limit = 10, offset = 0): Promise<{ conversations: ConversationSummary[], total: number }> => {
    return api.get<{ conversations: ConversationSummary[], total: number }>(`/conversations?limit=${limit}&offset=${offset}`);
  },

  // Get conversation details with messages
  getConversation: async (id: string, messageLimit = 50): Promise<ConversationDetail> => {
    return api.get<ConversationDetail>(`/conversations/${id}?message_limit=${messageLimit}`);
  },
};
