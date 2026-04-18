import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { ArrowLeft, Calendar, User, FileText } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

export function VehicleHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, observations, addObservation } = useData();
  const { user } = useAuth();
  const [newObservation, setNewObservation] = useState('');

  const vehicle = vehicles.find((v) => v.id === id);
  const vehicleObservations = observations.filter((o) => o.vehicleId === id);

  const isMechanic = user?.role === 'mechanic';

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="rounded-lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <Card className="rounded-lg shadow-md">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Vehículo no encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddObservation = () => {
    if (!newObservation.trim()) {
      toast.error('Por favor ingrese una observación');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    addObservation({
      vehicleId: id!,
      observation: newObservation,
      mechanicName: user?.name || 'Desconocido',
      date: today,
    });

    toast.success('Observación agregada exitosamente');
    setNewObservation('');
  };

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="rounded-lg">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a Vehículos
      </Button>

      {/* Vehicle Information */}
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Información del Vehículo</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Registrado el {new Date(vehicle.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
            <Badge variant={vehicle.isActive ? 'default' : 'secondary'} className="rounded-full">
              {vehicle.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[#0B2545] mb-3">Datos del Vehículo</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Placa:</span>{' '}
                  <span className="font-semibold">{vehicle.plate}</span>
                </p>
                <p>
                  <span className="text-gray-600">Marca:</span>{' '}
                  <span className="font-medium">{vehicle.brand}</span>
                </p>
                <p>
                  <span className="text-gray-600">Modelo:</span>{' '}
                  <span className="font-medium">{vehicle.model}</span>
                </p>
                <p>
                  <span className="text-gray-600">Año:</span>{' '}
                  <span className="font-medium">{vehicle.year}</span>
                </p>
                <p>
                  <span className="text-gray-600">Tipo:</span>{' '}
                  <span className="font-medium">{vehicle.type || 'No especificado'}</span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[#0B2545] mb-3">Datos del Propietario</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Nombre:</span>{' '}
                  <span className="font-medium">{vehicle.ownerName}</span>
                </p>
                <p>
                  <span className="text-gray-600">Teléfono:</span>{' '}
                  <span className="font-medium">{vehicle.ownerPhone || 'No registrado'}</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Observation (Mechanic only) */}
      {isMechanic && (
        <Card className="rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Añadir Observación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="observation">Nueva Observación</Label>
              <Textarea
                id="observation"
                placeholder="Describa el servicio realizado, observaciones técnicas, repuestos utilizados, etc."
                value={newObservation}
                onChange={(e) => setNewObservation(e.target.value)}
                rows={4}
                className="rounded-lg resize-none"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <p>
                <User className="w-4 h-4 inline mr-1" />
                Mecánico: {user?.name}
              </p>
              <p>
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha: {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
            <Button
              onClick={handleAddObservation}
              className="bg-[#FCA311] hover:bg-[#FCA311]/90 rounded-lg"
            >
              <FileText className="w-4 h-4 mr-2" />
              Guardar Observación
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Service History */}
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Historial de Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          {vehicleObservations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay observaciones registradas para este vehículo
            </p>
          ) : (
            <div className="space-y-4">
              {vehicleObservations
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((obs) => (
                  <div
                    key={obs.id}
                    className="border-l-4 border-[#FCA311] bg-gray-50 p-4 rounded-r-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(obs.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {obs.mechanicName}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{obs.observation}</p>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
