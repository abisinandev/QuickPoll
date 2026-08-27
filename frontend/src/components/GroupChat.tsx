import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Users, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import socket from '../socket/socket.config';
import { fetchMessagesApi, ChatMessage } from '../api/chat.api';
import { getAvatarColor } from '../utils/avatarColor';

export const GroupChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatError, setChatError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const fetchMessages = async () => {
    try {
      const res = await fetchMessagesApi();
      if (res.success && res.data) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    const handleNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleUserTyping = (data: { userId: string; username: string }) => {
      setTypingUsers((prev) => {
        const newMap = new Map(prev);
        newMap.set(data.userId, data.username);
        return newMap;
      });
    };

    const handleUserStoppedTyping = (data: { userId: string }) => {
      setTypingUsers((prev) => {
        const newMap = new Map(prev);
        newMap.delete(data.userId);
        return newMap;
      });
    };

    const handleOnlineUsers = (data: { count: number }) => {
      setOnlineCount(data.count);
    };

    socket.on('chat:message', handleNewMessage);
    socket.on('chat:userTyping', handleUserTyping);
    socket.on('chat:userStoppedTyping', handleUserStoppedTyping);
    socket.on('chat:onlineUsers', handleOnlineUsers);

    return () => {
      socket.off('chat:message', handleNewMessage);
      socket.off('chat:userTyping', handleUserTyping);
      socket.off('chat:userStoppedTyping', handleUserStoppedTyping);
      socket.off('chat:onlineUsers', handleOnlineUsers);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (chatError) setChatError(null);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('chat:typing', { username: user?.username });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to emit stopTyping after 1s of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit('chat:stopTyping');
    }, 1000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage.trim();
    setNewMessage('');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    isTypingRef.current = false;
    socket.emit('chat:stopTyping');

    socket.emit('chat:send', { content }, (response: any) => {
      if (!response.success) {
        console.error('Failed to send message:', response.message);
        setChatError(response.message || 'Failed to send message.');
        setNewMessage(content);
      } else {
        setChatError(null);
      }
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const typingArray = Array.from(typingUsers.values());
  const typingText = typingArray.length > 0
    ? typingArray.length > 2
      ? `> ${typingArray.length} USERS TYPING...`
      : `> ${typingArray.join(' & ').toUpperCase()} TYPING...`
    : null;

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-transparent border-2 border-zinc-900 dark:border-zinc-800 font-mono flex-1 relative">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-zinc-900 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-indigo-600 dark:border-indigo-400 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-xl text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              DISCUSS_TOGETHER
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
              </span>
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-zinc-500 dark:text-zinc-400">
              <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{onlineCount > 0 ? `${onlineCount} CONNECTED` : 'LIVE'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/30 dark:bg-transparent">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : (
          messages.map((msg) => {
            const isSelf = msg.user.id === user?.id;
            return (
              <div key={msg.id} className={`flex gap-3 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 ${getAvatarColor(msg.user.username)} flex items-center justify-center text-white text-xs font-black shrink-0`}>
                  {msg.user.username.charAt(0).toUpperCase()}
                </div>

                <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} max-w-[75%]`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
                      {isSelf ? 'YOU' : msg.user.username}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-400">[{formatTime(msg.createdAt)}]</span>
                  </div>

                  <div className={`px-4 py-2.5 text-sm font-medium leading-relaxed ${isSelf
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-2 border-zinc-900 dark:border-zinc-100'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingText && (
        <div className="px-6 py-2 bg-zinc-100 dark:bg-zinc-900 border-t-2 border-zinc-900 dark:border-zinc-800 flex items-center gap-2">
          <div className="w-2 h-4 bg-zinc-900 dark:bg-white animate-pulse" />
          <span className="font-bold text-[10px] uppercase tracking-widest text-zinc-600 dark:text-zinc-300">{typingText}</span>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-transparent border-t-2 border-zinc-900 dark:border-zinc-800 z-10">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="ENTER COMMAND..."
            className="w-full bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-100 rounded-none py-3.5 pl-4 pr-14 text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:bg-zinc-200 dark:focus:bg-zinc-800 transition-colors"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-2 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 flex items-center justify-center text-white transition-colors"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
        {chatError && (
          <div className="mt-3 text-[10px] uppercase font-bold tracking-widest text-white bg-red-600 px-2 py-1 inline-block">
            ERROR: {chatError}
          </div>
        )}
        {!chatError && (
          <div className="mt-2 flex items-center justify-between text-[9px] uppercase font-bold tracking-widest text-zinc-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" />
              STRICT COMMS PROTOCOL
            </span>
            <span>MAX 200 CHARS</span>
          </div>
        )}
      </div>
    </div>
  );
};
