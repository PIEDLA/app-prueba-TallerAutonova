import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Package, AlertTriangle, Users } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../context/AuthContext';

export function AdminDashboard() {
  const { inventory } = useData();
  const { users } = useAuth();

  const lowStockItems = inventory.filter((item) => item.quantity < item.minStock);
  const activeUsers = users.filter((u) => u.isActive && u.role !== 'admin');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#0B2545]">Panel Administrativo</h2>
        <p className="text-gray-600 mt-1">Bienvenido al sistema de gestión</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Repuestos Totales
            </CardTitle>
            <Package className="w-5 h-5 text-[#8DA9C4]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0B2545]">{inventory.length}</div>
            <p className="text-xs text-gray-500 mt-1">Items en inventario</p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Repuestos Bajo Stock
            </CardTitle>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{lowStockItems.length}</div>
            <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Empleados Activos
            </CardTitle>
            <Users className="w-5 h-5 text-[#8DA9C4]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0B2545]">{activeUsers.length}</div>
            <p className="text-xs text-gray-500 mt-1">Personal registrado</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {lowStockItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[#0B2545]">Alertas de Stock</h3>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <Alert key={item.id} variant="destructive" className="rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <span className="font-semibold">{item.name}</span> - Stock por debajo del
                  mínimo (Actual: {item.quantity}, Mínimo: {item.minStock})
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-600">
            • Gestionar inventario desde el módulo de <strong>Inventario</strong>
          </p>
          <p className="text-sm text-gray-600">
            • Administrar empleados desde el módulo de <strong>Usuarios</strong>
          </p>
          <p className="text-sm text-gray-600">
            • Ver alertas críticas en el módulo de <strong>Alertas</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
