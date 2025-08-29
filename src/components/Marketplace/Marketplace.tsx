import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { SolarPanel } from '../../types';
import { PanelCard } from './PanelCard';
import { useAuth } from '../../hooks/useAuth';

export function Marketplace() {
  const { profile } = useAuth();
  const [panels, setPanels] = useState<SolarPanel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    condition: '',
    minPower: '',
    maxPower: '',
    brand: '',
  });

  useEffect(() => {
    fetchPanels();
  }, []);

  const fetchPanels = async () => {
    try {
      let query = supabase
        .from('solar_panels')
        .select(`
          *,
          owner:users!solar_panels_owner_id_fkey(*)
        `)
        .eq('status', 'for_sale')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setPanels(data || []);
    } catch (error) {
      console.error('Error fetching panels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPanels = panels.filter(panel => {
    const matchesSearch = 
      panel.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      panel.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      panel.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCondition = !filters.condition || panel.condition === filters.condition;
    const matchesMinPower = !filters.minPower || panel.power_rating >= parseInt(filters.minPower);
    const matchesMaxPower = !filters.maxPower || panel.power_rating <= parseInt(filters.maxPower);
    const matchesBrand = !filters.brand || panel.brand.toLowerCase().includes(filters.brand.toLowerCase());

    return matchesSearch && matchesCondition && matchesMinPower && matchesMaxPower && matchesBrand;
  });

  if (profile?.role !== 'recycler') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <Grid3X3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600">
            O marketplace é exclusivo para empresas recicladoras aprovadas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Marketplace</h1>
          <p className="text-gray-600">Encontre painéis solares para reciclagem</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por marca, modelo ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={filters.condition}
                onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas as condições</option>
                <option value="excellent">Excelente</option>
                <option value="good">Bom</option>
                <option value="fair">Regular</option>
                <option value="poor">Ruim</option>
              </select>

              <input
                type="number"
                placeholder="Potência mín."
                value={filters.minPower}
                onChange={(e) => setFilters(prev => ({ ...prev, minPower: e.target.value }))}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredPanels.length} painéis encontrados
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPanels.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredPanels.map((panel) => (
              <PanelCard key={panel.id} panel={panel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Grid3X3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum painel encontrado</h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou volte mais tarde para ver novos painéis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}