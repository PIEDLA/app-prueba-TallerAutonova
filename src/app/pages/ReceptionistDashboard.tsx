import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Car, CheckCircle } from 'lucide-react';

export function ReceptionistDashboard() {
  const { appointments, vehicles } = useData();
  const { user } = useAuth();

  const activeVehicles = vehicles.filter((v) => v.isActive);
  const todayAppointments = appointments.filter((apt) => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today;
  });
  const completedThisMonth = appointments.filter((apt) => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return (
      apt.status === 'completed' &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getFullYear() === today.getFullYear()
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#0B2545]">Panel de Recepción</h2>
        <p className="text-gray-600 mt-1">Bienvenido, {user?.name}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vehículos Registrados
            </CardTitle>
            <Car className="w-5 h-5 text-[#8DA9C4]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0B2545]">{vehicles.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total en el sistema</p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vehículos Activos
            </CardTitle>
            <Car className="w-5 h-5 text-[#FCA311]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0B2545]">{activeVehicles.length}</div>
            <p className="text-xs text-gray-500 mt-1">En servicio actualmente</p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Servicios Este Mes
            </CardTitle>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0B2545]">
              {completedThisMonth.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Completados</p>
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
                    className="p-4 bg-gray-50 rounded-lg flex items-start justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[#0B2545]">
                        {apt.time} - {apt.clientName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Vehículo: {vehicle?.brand} {vehicle?.model} ({vehicle?.plate})
                      </p>
                      <p className="text-sm text-gray-500">{apt.description}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {apt.status}
                    </span>
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
            • Crear nuevas citas en el módulo de <strong>Citas</strong>
          </p>
          <p className="text-sm text-gray-600">
            • Registrar nuevos vehículos en <strong>Vehículos</strong>
          </p>
          <p className="text-sm text-gray-600">
            • Consultar historial de servicios de vehículos
          </p>
          <p className="text-sm text-gray-600">
            • Marcar vehículos como inactivos cuando sea necesario
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
