import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Zap } from 'lucide-react';
import type { SolarPanel } from '../../types';

interface PanelCardProps {
  panel: SolarPanel;
}

export function PanelCard({ panel }: PanelCardProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bom';
      case 'fair': return 'Regular';
      case 'poor': return 'Ruim';
      default: return condition;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={panel.images[0] || 'https://images.pexels.com/photos/9875414/pexels-photo-9875414.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={`${panel.brand} ${panel.model}`}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {panel.brand} {panel.model}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Zap className="w-4 h-4 mr-1" />
              {panel.power_rating}W • {panel.quantity} unidades
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(panel.condition)}`}>
            {getConditionText(panel.condition)}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            Fabricado em {panel.manufacturing_year}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            {panel.location}
          </div>
        </div>

        {panel.price && (
          <div className="mb-4">
            <span className="text-2xl font-bold text-green-600">
              R$ {panel.price.toLocaleString('pt-BR')}
            </span>
            <span className="text-sm text-gray-500 ml-1">preço sugerido</span>
          </div>
        )}

        <div className="flex space-x-3">
          <Link
            to={`/panel/${panel.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ver Detalhes
          </Link>
          <Link
            to={`/panel/${panel.id}/offer`}
            className="flex-1 border border-blue-600 text-blue-600 text-center py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Fazer Oferta
          </Link>
        </div>
      </div>
    </div>
  );
}