import React from 'react';
import { Recycle, Shield, Zap, Users, TrendingUp, Award } from 'lucide-react';

const features = [
  {
    name: 'Economia Circular',
    description: 'Promovemos a reutilização e reciclagem de painéis solares, reduzindo o impacto ambiental.',
    icon: Recycle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    name: 'Transações Seguras',
    description: 'Sistema de pagamento seguro e verificação de empresas recicladoras certificadas.',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'Avaliação Técnica',
    description: 'Nossa equipe avalia cada painel para garantir preços justos e qualidade.',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    name: 'Rede Especializada',
    description: 'Conectamos você com empresas recicladoras especializadas em energia solar.',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'Melhor Preço',
    description: 'Sistema de ofertas competitivas garante o melhor valor para seus painéis.',
    icon: TrendingUp,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  {
    name: 'Certificação',
    description: 'Processo certificado de reciclagem com documentação completa.',
    icon: Award,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
];

export function Features() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">
            Por que escolher
          </h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            A plataforma mais confiável do Brasil
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Desenvolvemos uma solução completa que beneficia proprietários, empresas e o meio ambiente.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className={`absolute flex items-center justify-center h-12 w-12 rounded-lg ${feature.bgColor}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}