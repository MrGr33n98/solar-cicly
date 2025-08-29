import React from 'react';
import { Upload, CheckCircle, Handshake, Truck } from 'lucide-react';

const steps = [
  {
    id: 1,
    name: 'Cadastre seus painéis',
    description: 'Faça upload das fotos e informações dos seus painéis solares usados.',
    icon: Upload,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 2,
    name: 'Avaliação técnica',
    description: 'Nossa equipe avalia e aprova seu anúncio com preço sugerido.',
    icon: CheckCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 3,
    name: 'Receba ofertas',
    description: 'Empresas recicladoras fazem ofertas competitivas pelos seus painéis.',
    icon: Handshake,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    id: 4,
    name: 'Logística facilitada',
    description: 'Coordenamos a retirada e pagamento de forma segura e prática.',
    icon: Truck,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
];

export function HowItWorks() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">
            Processo
          </h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            Como funciona
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Um processo simples e transparente em 4 etapas
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, stepIdx) => (
              <div key={step.id} className="relative">
                <div className="text-center">
                  <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${step.bgColor} mb-4`}>
                    <step.icon className={`h-8 w-8 ${step.color}`} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                    {step.name}
                  </h3>
                  <p className="text-base text-gray-500">
                    {step.description}
                  </p>
                </div>
                
                {stepIdx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <div className="h-0.5 bg-gray-200 relative">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}