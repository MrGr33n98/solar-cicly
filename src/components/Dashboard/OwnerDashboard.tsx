import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { SolarPanel, Transaction } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export function OwnerDashboard() {
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
      // Fetch user's panels
      const { data: panelsData, error: panelsError } = await supabase
        .from('solar_panels')
        .select('*')
        .eq('owner_id', profile?.id)
        .order('created_at', { ascending: false });

      if (panelsError) throw panelsError;

      // Fetch transactions for user's panels
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          solar_panel:solar_panels(*),
          recycler:users!transactions_recycler_id_fkey(*)
        `)
        .eq('owner_id', profile?.id)
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
      name: 'Painéis Cadastrados',
      value: panels.length,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'À Venda',
      value: panels.filter(p => p.status === 'for_sale').length,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pendentes',
      value: panels.filter(p => p.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Vendidos',
      value: panels.filter(p => p.status === 'sold').length,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

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
            Olá, {profile?.full_name}
          </h1>
          <p className="text-gray-600">Gerencie seus painéis solares e acompanhe suas vendas</p>
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
              to="/sell-panel"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Novo Painel
            </Link>
            <Link
              to="/my-panels"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="w-4 h-4 mr-2" />
              Ver Meus Painéis
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Panels */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Painéis Recentes</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {panels.slice(0, 5).map((panel) => (
                <div key={panel.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {panel.brand} {panel.model}
                      </p>
                      <p className="text-sm text-gray-500">
                        {panel.quantity} unidades • {panel.power_rating}W
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      panel.status === 'for_sale' ? 'bg-green-100 text-green-800' :
                      panel.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      panel.status === 'sold' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {panel.status === 'for_sale' ? 'À venda' :
                       panel.status === 'pending' ? 'Pendente' :
                       panel.status === 'sold' ? 'Vendido' :
                       panel.status}
                    </span>
                  </div>
                </div>
              ))}
              {panels.length === 0 && (
                <div className="px-6 py-8 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum painel cadastrado ainda</p>
                  <Link
                    to="/sell-panel"
                    className="mt-2 inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                  >
                    Cadastrar primeiro painel
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Ofertas Recentes</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.recycler?.company_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        R$ {transaction.offered_price.toLocaleString('pt-BR')} • {transaction.quantity} unidades
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      transaction.status === 'approved' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status === 'pending' ? 'Pendente' :
                       transaction.status === 'approved' ? 'Aprovada' :
                       transaction.status === 'completed' ? 'Concluída' :
                       transaction.status}
                    </span>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="px-6 py-8 text-center">
                  <Handshake className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma oferta recebida ainda</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}