import { Outlet, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
  Home,
  Package,
  Car,
  AlertTriangle,
  LogOut,
  Users,
  Calendar,
  Menu,
} from 'lucide-react';
import { cn } from './ui/utils';
import { useEffect, useState } from 'react';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      label: 'Inicio',
      icon: Home,
      path:
        user.role === 'admin'
          ? '/dashboard/admin'
          : user.role === 'mechanic'
          ? '/dashboard/mechanic'
          : '/dashboard/receptionist',
      roles: ['admin', 'mechanic', 'receptionist'],
    },
    {
      label: 'Inventario',
      icon: Package,
      path: '/dashboard/inventory',
      roles: ['admin', 'mechanic'],
    },
    {
      label: 'Vehículos',
      icon: Car,
      path: '/dashboard/vehicles',
      roles: ['mechanic', 'receptionist'],
    },
    {
      label: 'Citas',
      icon: Calendar,
      path: '/dashboard/appointments',
      roles: ['mechanic', 'receptionist'],
    },
    {
      label: 'Alertas',
      icon: AlertTriangle,
      path: '/dashboard/alerts',
      roles: ['admin'],
    },
    {
      label: 'Usuarios',
      icon: Users,
      path: '/dashboard/users',
      roles: ['admin'],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-[#EEF4ED]">
      {/* Top Navigation */}
      <header className="bg-[#0B2545] text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">TALLER AUTONOVA</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm">{user.name}</p>
              <p className="text-xs text-gray-300 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'bg-[#134074] text-white h-[calc(100vh-64px)] transition-all duration-300',
            sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          )}
        >
          <nav className="p-4 space-y-2">
            {filteredMenuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10 rounded-lg"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-red-500/20 rounded-lg mt-8"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar sesión
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
