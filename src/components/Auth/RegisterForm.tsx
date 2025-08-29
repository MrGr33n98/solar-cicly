import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Building, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  full_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  role: z.enum(['owner', 'recycler']),
  company_name: z.string().optional(),
  cnpj: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => {
  if (data.role === 'recycler') {
    return data.company_name && data.cnpj;
  }
  return true;
}, {
  message: 'Empresa e CNPJ são obrigatórios para recicladoras',
  path: ['company_name'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'owner',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password, {
        full_name: data.full_name,
        role: data.role,
        company_name: data.company_name,
        cnpj: data.cnpj,
        phone: data.phone,
      });
      
      if (data.role === 'recycler') {
        navigate('/pending-approval');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Erro ao criar conta',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">SC</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link
            to="/login"
            className="font-medium text-green-600 hover:text-green-500 transition-colors"
          >
            entre na sua conta existente
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {errors.root && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errors.root.message}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Conta
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative">
                  <input
                    {...register('role')}
                    type="radio"
                    value="owner"
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRole === 'owner'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-center">
                      <User className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-medium text-sm">Proprietário</div>
                      <div className="text-xs text-gray-500 mt-1">Vender painéis</div>
                    </div>
                  </div>
                </label>
                <label className="relative">
                  <input
                    {...register('role')}
                    type="radio"
                    value="recycler"
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRole === 'recycler'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-center">
                      <Building className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-medium text-sm">Recicladora</div>
                      <div className="text-xs text-gray-500 mt-1">Comprar painéis</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('full_name')}
                  type="text"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Seu nome completo"
                />
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('email')}
                  type="email"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="seu@email.com"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Company Information (for recyclers) */}
            {selectedRole === 'recycler' && (
              <>
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                    Nome da Empresa
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...register('company_name')}
                      type="text"
                      className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nome da sua empresa"
                    />
                    <Building className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  {errors.company_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                    CNPJ
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('cnpj')}
                      type="text"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                  {errors.cnpj && (
                    <p className="mt-1 text-sm text-red-600">{errors.cnpj.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...register('phone')}
                      type="tel"
                      className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(11) 99999-9999"
                    />
                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Atenção:</strong> Contas de recicladora passam por um processo de aprovação 
                    que pode levar até 24 horas. Você receberá um email quando sua conta for aprovada.
                  </p>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}