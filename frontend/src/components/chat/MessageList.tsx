import React, { useEffect, useRef } from 'react';
import { Message } from '../../lib/chat-api';
import { useAuth } from '../../hooks/useAuth';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { Bot, User as UserIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ToolCallIndicator } from './ToolCallIndicator';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
            <Bot size={24} />
          </div>
          <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">AI Todo Assistant</h3>
          <p className="mt-2 text-sm max-w-xs">
            Ask me to add, list, update, complete, or delete your tasks. I can help you manage your todo list naturally.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {['Add a task to buy milk', 'Show my tasks', 'Complete the first task'].map((suggestion) => (
              <div
                key={suggestion}
                className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 pointer-events-none"
              >
                "{suggestion}"
              </div>
            ))}
          </div>
        </div>
      )}

      {messages.map((message) => {
        const isUser = message.role === 'user';
        return (
          <div
            key={message.id}
            className={cn(
              "flex gap-4 max-w-3xl mx-auto",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            {/* Assistant Avatar */}
            {!isUser && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                <Bot size={16} />
              </div>
            )}

            <div className={cn(
              "max-w-[80%]",
              isUser ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed shadow-sm",
                isUser
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-sm"
              )}>
                {message.content}
              </div>

              {/* Tool calls for assistant messages */}
              {!isUser && message.tool_calls && message.tool_calls.length > 0 && (
                <ToolCallIndicator toolCalls={message.tool_calls} />
              )}
            </div>

            {/* User Avatar */}
            {isUser && (
              <Avatar className="flex-shrink-0 w-8 h-8 border border-gray-200 dark:border-gray-700">
                <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {user?.email?.charAt(0).toUpperCase() || <UserIcon size={16} />}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        );
      })}

      {isLoading && (
        <div className="flex gap-4 max-w-3xl mx-auto justify-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Bot size={16} />
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5 h-10">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
