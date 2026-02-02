import React, { useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export const ChatContainer: React.FC = () => {
  const {
    messages,
    isLoading,
    error,
    conversationId,
    sendMessage,
    loadConversation,
    startNewConversation
  } = useChat();

  // Load existing conversation on mount if available
  // For now, we'll implement listing later or let the user start fresh
  // Ideally, we'd fetch the most recent conversation here

  useEffect(() => {
    // Only fetch if we have an ID stored (e.g., from URL or localStorage)
    // Since we don't have persistence yet, we start fresh or load if provided
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white dark:bg-gray-950">
      <div className="flex-none border-b border-gray-100 dark:border-gray-800 p-3 flex items-center justify-between bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 px-2">
          <span className="font-semibold text-gray-900 dark:text-gray-100">AI Assistant</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded-full">Beta</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={startNewConversation}
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          title="Start new conversation"
        >
          <RefreshCw size={16} className="mr-2" />
          New Chat
        </Button>
      </div>

      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:bg-red-100 dark:hover:bg-red-900/40" onClick={startNewConversation}>
            Dismiss
          </Button>
        </div>
      )}

      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
};
