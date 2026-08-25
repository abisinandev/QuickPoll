import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { LoadingScreen } from '../components/LoadingScreen';
import { ROUTES } from './routes.constants';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isCheckingSession } = useAuth();

  if (isCheckingSession) {
    return <LoadingScreen message="Verifying active session..." />;
  }

  if (!user) {
    return <Navigate to={ROUTES.JOIN} replace />;
  }

  return <>{children}</>;
};
