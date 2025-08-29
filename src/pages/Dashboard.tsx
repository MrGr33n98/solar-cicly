import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { OwnerDashboard } from '../components/Dashboard/OwnerDashboard';
import { RecyclerDashboard } from '../components/Dashboard/RecyclerDashboard';

export function Dashboard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  if (profile.role === 'owner') {
    return <OwnerDashboard />;
  }

  if (profile.role === 'recycler') {
    return <RecyclerDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Tipo de usuário não reconhecido</h2>
        <p className="text-gray-600">Entre em contato com o suporte.</p>
      </div>
    </div>
  );
}