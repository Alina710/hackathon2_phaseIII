import React, { useState } from 'react';
import { ToolCall } from '../../lib/chat-api';
import { ChevronDown, ChevronUp, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToolCallIndicatorProps {
  toolCalls: ToolCall[];
}

export const ToolCallIndicator: React.FC<ToolCallIndicatorProps> = ({ toolCalls }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    <div className="mt-2 mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700"
      >
        <Terminal size={14} />
        <span>
          Used {toolCalls.length} tool{toolCalls.length > 1 ? 's' : ''}
        </span>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
          {toolCalls.map((call, index) => (
            <div key={index} className="text-xs">
              <div className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                {call.status === 'success' ? (
                  <CheckCircle2 size={12} className="text-green-500" />
                ) : (
                  <AlertCircle size={12} className="text-red-500" />
                )}
                <span className="font-mono">{call.tool}</span>
              </div>

              <div className="mt-1 pl-5 space-y-1">
                <div className="text-gray-500">
                  <span className="uppercase text-[10px] tracking-wider font-semibold">Input:</span>
                  <pre className="mt-0.5 bg-gray-50 dark:bg-gray-900 p-1.5 rounded text-[10px] overflow-x-auto border border-gray-200 dark:border-gray-800">
                    {JSON.stringify(call.input, null, 2)}
                  </pre>
                </div>

                <div className="text-gray-500">
                  <span className="uppercase text-[10px] tracking-wider font-semibold">Output:</span>
                  <pre className="mt-0.5 bg-gray-50 dark:bg-gray-900 p-1.5 rounded text-[10px] overflow-x-auto border border-gray-200 dark:border-gray-800">
                    {JSON.stringify(call.output, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
