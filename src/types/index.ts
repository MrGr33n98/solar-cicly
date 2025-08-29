export type UserRole = 'owner' | 'recycler' | 'admin';

export type UserStatus = 'active' | 'pending_approval' | 'rejected';

export type SolarPanelStatus = 'pending' | 'for_sale' | 'sold' | 'recycled' | 'rejected';

export type SolarPanelCondition = 'excellent' | 'good' | 'fair' | 'poor';

export type TransactionStatus = 'pending' | 'approved' | 'cancelled' | 'in_transit' | 'completed';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  company_name?: string;
  cnpj?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface SolarPanel {
  id: string;
  owner_id: string;
  brand: string;
  model: string;
  power_rating: number;
  quantity: number;
  condition: SolarPanelCondition;
  manufacturing_year: number;
  price?: number;
  description?: string;
  status: SolarPanelStatus;
  images: string[];
  location: string;
  created_at: string;
  updated_at: string;
  owner?: User;
}

export interface Transaction {
  id: string;
  solar_panel_id: string;
  recycler_id: string;
  owner_id: string;
  quantity: number;
  offered_price: number;
  agreed_price?: number;
  status: TransactionStatus;
  notes?: string;
  pickup_date?: string;
  pickup_address?: string;
  created_at: string;
  updated_at: string;
  solar_panel?: SolarPanel;
  recycler?: User;
  owner?: User;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    role: UserRole;
  };
}