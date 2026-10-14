import React from 'react';
import { AdminDashboard } from '../components/AdminDashboard';
import { Product } from '../types';
import { AppRoute } from '../components/Navbar';

interface AdminPageProps {
  products: Product[];
  onRefreshProducts: () => void;
  onNavigate: (route: AppRoute) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  onRefreshProducts,
  onNavigate,
}) => {
  return (
    <AdminDashboard
      isOpen={true}
      isStandalonePage={true}
      onClose={() => onNavigate('home')}
      products={products}
      onRefreshProducts={onRefreshProducts}
    />
  );
};
