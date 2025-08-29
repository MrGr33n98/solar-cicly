import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, User, LogOut, Plus, Grid3X3 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SolarCycle</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/marketplace" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Marketplace
            </Link>
            <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Como Funciona
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Sobre
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user && profile ? (
              <>
                {profile.role === 'owner' && (
                  <Link
                    to="/sell-panel"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Vender Painel
                  </Link>
                )}
                
                {profile.role === 'recycler' && profile.status === 'active' && (
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Ver Painéis
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                    <User className="w-5 h-5" />
                    <span className="font-medium">{profile.full_name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Perfil
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}