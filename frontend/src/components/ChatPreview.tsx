import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  avatarColor: string;
  text: string;
}

export const ChatPreview: React.FC = () => {
  const messages: ChatMessage[] = [
    { id: '1', sender: 'Abi', avatarColor: 'bg-indigo-600', text: 'Express all the way!' },
    { id: '2', sender: 'Rahul', avatarColor: 'bg-purple-600', text: 'Same here.' },
    { id: '3', sender: 'John', avatarColor: 'bg-emerald-600', text: 'NestJS for me.' },
  ];

  return (
    <div className="rounded-2xl p-5 shadow-sm space-y-4 bg-white border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700/60">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Live Conversation</span>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">3 messages</span>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-2.5 text-xs">
            <div
              className={`w-6 h-6 rounded-full text-white font-bold flex items-center justify-center text-[10px] ${msg.avatarColor} shrink-0`}
            >
              {msg.sender[0]}
            </div>
            <div className="bg-slate-50 border border-slate-100 dark:bg-slate-900/60 dark:border-slate-700/50 rounded-xl p-2.5 max-w-[85%] text-slate-800 dark:text-slate-200">
              <span className="font-semibold text-slate-900 dark:text-slate-100 block text-[11px] mb-0.5">
                {msg.sender}
              </span>
              <p className="leading-snug text-slate-700 dark:text-slate-300">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Typing Indicator */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium text-slate-600 dark:text-slate-300">Rahul is typing</span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};
