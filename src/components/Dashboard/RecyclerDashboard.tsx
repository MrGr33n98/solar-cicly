import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid3X3, TrendingUp, Package, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { SolarPanel, Transaction } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export function RecyclerDashboard() {
  const { profile } = useAuth();
  const [panels, setPanels] = useState<SolarPanel[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    try {
      // Fetch available panels
      const { data: panelsData, error: panelsError } = await supabase
        .from('solar_panels')
        .select(`
          *,
          owner:users!solar_panels_owner_id_fkey(*)
        `)
        .eq('status', 'for_sale')
        .order('created_at', { ascending: false })
        .limit(6);

      if (panelsError) throw panelsError;

      // Fetch user's transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          solar_panel:solar_panels(*),
          owner:users!transactions_owner_id_fkey(*)
        `)
        .eq('recycler_id', profile?.id)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      setPanels(panelsData || []);
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      name: 'Ofertas Feitas',
      value: transactions.length,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Aprovadas',
      value: transactions.filter(t => t.status === 'approved' || t.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pendentes',
      value: transactions.filter(t => t.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Painéis Disponíveis',
      value: panels.length,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  if (profile?.status === 'pending_approval') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Conta em Análise</h2>
          <p className="text-gray-600 mb-6">
            Sua conta está sendo analisada pela nossa equipe. Você receberá um email 
            quando a aprovação for concluída, geralmente em até 24 horas.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Enquanto isso, você pode explorar nossa plataforma e conhecer como funciona o processo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Bem-vindo, {profile?.company_name}
          </h1>
          <p className="text-gray-600">Encontre os melhores painéis solares para reciclagem</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/marketplace"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Explorar Marketplace
            </Link>
            <Link
              to="/my-offers"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Minhas Ofertas
            </Link>
          </div>
        </div>

        {/* Available Panels Preview */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Painéis Disponíveis</h3>
            <Link
              to="/marketplace"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Ver todos
            </Link>
          </div>
          <div className="p-6">
            {panels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {panels.map((panel) => (
                  <div key={panel.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <img
                        src={panel.images[0] || 'https://images.pexels.com/photos/9875414/pexels-photo-9875414.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={`${panel.brand} ${panel.model}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {panel.brand} {panel.model}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2">
                      {panel.quantity} unidades • {panel.power_rating}W
                    </p>
                    {panel.price && (
                      <p className="text-lg font-bold text-green-600 mb-3">
                        R$ {panel.price.toLocaleString('pt-BR')}
                      </p>
                    )}
                    <Link
                      to={`/panel/${panel.id}`}
                      className="block w-full text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum painel disponível no momento</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}