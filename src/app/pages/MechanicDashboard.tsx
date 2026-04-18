import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Car, Package } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export function MechanicDashboard() {
  const { appointments, vehicles, inventory } = useData();
  const { user } = useAuth();

  const myAppointments = appointments.filter(
    (apt) => apt.mechanicId === user?.id && apt.status !== 'completed'
  );
  const todayAppointments = myAppointments.filter((apt) => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#0B2545]">Panel del Mecánico</h2>
        <p className="text-gray-600 mt-1">Bienvenido, {user?.name}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Citas Hoy
            </CardTitle>
            <Calendar className="w-5 h-5 text-[#FCA311]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0B2545]">
              {todayAppointments.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Programadas para hoy</p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Citas Pendientes
            </CardTitle>
            <Calendar className="w-5 h-5 text-[#8DA9C4]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0B2545]">
              {myAppointments.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Asignadas a mí</p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vehículos Registrados
            </CardTitle>
            <Car className="w-5 h-5 text-[#8DA9C4]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0B2545]">
              {vehicles.filter((v) => v.isActive).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">En el sistema</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Citas de Hoy</CardTitle>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay citas programadas para hoy</p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((apt) => {
                const vehicle = vehicles.find((v) => v.id === apt.vehicleId);
                return (
                  <div
                    key={apt.id}
                    className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[#0B2545]">{apt.time}</p>
                      <p className="text-sm text-gray-600">
                        {apt.clientName} - {vehicle?.plate || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">{apt.description}</p>
                    </div>
                    <Badge
                      variant={apt.status === 'pending' ? 'secondary' : 'default'}
                      className="rounded-full"
                    >
                      {apt.status === 'pending' ? 'Pendiente' : apt.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-600">
            • Ver todas las citas en el módulo de <strong>Citas</strong>
          </p>
          <p className="text-sm text-gray-600">
            • Consultar información de vehículos en <strong>Vehículos</strong>
          </p>
          <p className="text-sm text-gray-600">
            • Añadir observaciones al historial de vehículos
          </p>
          <p className="text-sm text-gray-600">
            • Verificar disponibilidad de repuestos en <strong>Inventario</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
