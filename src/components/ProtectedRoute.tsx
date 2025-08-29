import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireApproval?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requireApproval = false 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && profile.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireApproval && profile.status !== 'active') {
    return <Navigate to="/pending-approval" replace />;
  }

  return <>{children}</>;
}