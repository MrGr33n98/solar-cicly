import React from 'react';
import { Clock, Mail, Phone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function PendingApproval() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Conta em Análise
        </h1>
        
        <p className="text-gray-600 mb-6">
          Olá <strong>{profile?.full_name}</strong>, sua conta da empresa{' '}
          <strong>{profile?.company_name}</strong> está sendo analisada pela nossa equipe.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-yellow-800 mb-2">O que acontece agora?</h3>
          <ul className="text-sm text-yellow-700 space-y-1 text-left">
            <li>• Verificação dos dados da empresa</li>
            <li>• Validação do CNPJ</li>
            <li>• Análise da documentação</li>
            <li>• Aprovação em até 24 horas</li>
          </ul>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Você receberá um email de confirmação quando sua conta for aprovada e 
          poderá acessar o marketplace completo.
        </p>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-medium text-gray-900 mb-3">Precisa de ajuda?</h3>
          <div className="flex justify-center space-x-4">
            <a
              href="mailto:support@solarcycle.com"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <Mail className="w-4 h-4 mr-1" />
              Email
            </a>
            <a
              href="tel:+5511999999999"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <Phone className="w-4 h-4 mr-1" />
              Telefone
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}