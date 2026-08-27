import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user.types';
import { checkSessionApi, joinUserApi, leaveUserApi } from '../api/auth.api';
import socket from '../socket/socket.config';

interface AuthContextType {
  user: User | null;
  isCheckingSession: boolean;
  joinUser: (username: string) => Promise<{ success: boolean; message?: string }>;
  checkSession: () => Promise<void>;
  leaveUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);

  const checkSession = async () => {
    setIsCheckingSession(true);
    try {
      const res = await checkSessionApi();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Check session error:', err);
      setUser(null);
    } finally {
      setIsCheckingSession(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const joinUser = async (username: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await joinUserApi(username);

      if (res.success && res.data?.user) {
        setUser(res.data.user);
        return { success: true };
      } else {
        return { success: false, message: res.message || 'Failed to join PollSpace.' };
      }
    } catch (err) {
      console.error('Join user error:', err);
      return { success: false, message: 'Network error joining PollSpace.' };
    }
  };

  const leaveUser = async (): Promise<void> => {
    try {
      await leaveUserApi();
    } catch (err) {
      console.error('Leave user error:', err);
    } finally {
      // Clear client state regardless of whether the request reached the
      // server, so the user is always kicked back to the join screen.
      socket.disconnect();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isCheckingSession, joinUser, checkSession, leaveUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
