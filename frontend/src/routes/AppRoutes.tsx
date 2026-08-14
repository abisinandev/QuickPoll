import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { JoinPage } from '../pages/JoinPage';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../store/AuthContext';
import { LoadingScreen } from '../components/LoadingScreen';
import { QuickPollPage } from '../pages/QuickPollPage';

export const AppRoutes: React.FC = () => {
  const { user, isCheckingSession } = useAuth();

  if (isCheckingSession) {
    return <LoadingScreen message="Checking active session..." />;
  }

  return (
    <Routes>
      <Route
        path="/join"
        element={user ? <Navigate to="/" replace /> : <JoinPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <QuickPollPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
