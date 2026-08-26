import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { JoinPage } from '../pages/JoinPage';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../store/AuthContext';
import { LoadingScreen } from '../components/LoadingScreen';
import { QuickPollPage } from '../pages/QuickPollPage';
import { ROUTES } from './routes.constants';

export const AppRoutes: React.FC = () => {
  const { user, isCheckingSession } = useAuth();

  if (isCheckingSession) {
    return <LoadingScreen message="Checking active session..." />;
  }

  return (
    <Routes>
      <Route
        path={ROUTES.JOIN}
        element={user ? <Navigate to={ROUTES.HOME} replace /> : <JoinPage />}
      />
      <Route
        path={ROUTES.HOME}
        element={
          <ProtectedRoute>
            <QuickPollPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};
