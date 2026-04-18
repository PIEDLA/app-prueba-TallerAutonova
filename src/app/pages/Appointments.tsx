import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Search, Plus, Calendar, Edit, X, MessageSquare } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

export function Appointments() {
  const { appointments, vehicles, addAppointment, updateAppointment } = useData();
  const { user, users } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    vehicleId: '',
    clientName: '',
    date: '',
    time: '',
    description: '',
    mechanicId: '',
  });
  const [newObservation, setNewObservation] = useState('');
  const [observationDialog, setObservationDialog] = useState<string | null>(null);

  const isReceptionist = user?.role === 'receptionist';
  const isMechanic = user?.role === 'mechanic';

  const [formData, setFormData] = useState({
    vehicleId: '',
    clientName: '',
    date: '',
    time: '',
    description: '',
    mechanicId: '',
  });

  const filteredAppointments = isMechanic
    ? appointments.filter(
        (apt) =>
          apt.mechanicId === user?.id &&
          (apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicles
              .find((v) => v.id === apt.vehicleId)
              ?.plate.toLowerCase()
              .includes(searchTerm.toLowerCase()))
      )
    : appointments.filter(
        (apt) =>
          apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicles
            .find((v) => v.id === apt.vehicleId)
            ?.plate.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );

  const handleAddAppointment = () => {
    if (!formData.vehicleId || !formData.clientName || !formData.date || !formData.time) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    // Validar que la fecha no sea anterior a hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(formData.date);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      toast.error('La fecha de la cita no puede ser anterior a la fecha actual');
      return;
    }

    // Validar horario ocupado para el mismo mecánico
    if (formData.mechanicId) {
      const isTimeOccupied = appointments.some(
        (apt) =>
          apt.mechanicId === formData.mechanicId &&
          apt.date === formData.date &&
          apt.time === formData.time &&
          apt.status !== 'cancelled'
      );

      if (isTimeOccupied) {
        toast.error('El mecánico ya tiene una cita asignada en este horario');
        return;
      }
    }

    addAppointment({
      ...formData,
      status: 'pending',
      observations: [],
    });

    toast.success('Cita creada exitosamente');
    setIsAddDialogOpen(false);
    setFormData({
      vehicleId: '',
      clientName: '',
      date: '',
      time: '',
      description: '',
      mechanicId: '',
    });
  };

  const handleUpdateStatus = (
    id: string,
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  ) => {
    const appointment = appointments.find((apt) => apt.id === id);
    if (!appointment) return;

    // Validar flujo para mecánico: Pendiente -> En proceso -> Completada
    if (isMechanic) {
      if (appointment.status === 'pending' && status === 'completed') {
        toast.error('Debe pasar por "En Proceso" antes de completar');
        return;
      }
      if (appointment.status === 'completed' && status === 'pending') {
        toast.error('No se puede regresar una cita completada a pendiente');
        return;
      }
      if (appointment.status === 'in-progress' && status === 'pending') {
        toast.error('No se puede regresar una cita en proceso a pendiente');
        return;
      }
    }

    updateAppointment(id, { status });
    toast.success('Estado actualizado');
  };

  const handleCancelAppointment = (id: string) => {
    const appointment = appointments.find((apt) => apt.id === id);
    if (!appointment) return;

    // No permitir cancelación de citas atendidas (completadas)
    if (appointment.status === 'completed') {
      toast.error('No se puede cancelar una cita que ya fue completada');
      return;
    }

    updateAppointment(id, { status: 'cancelled' });
    toast.success('Cita cancelada correctamente');
  };

  const handleAddObservation = (appointmentId: string) => {
    if (!newObservation.trim()) {
      toast.error('La observación no puede estar vacía');
      return;
    }

    const appointment = appointments.find((apt) => apt.id === appointmentId);
    if (!appointment) return;

    const updatedObservations = [...(appointment.observations || []), newObservation];
    updateAppointment(appointmentId, { observations: updatedObservations });

    toast.success('Observación agregada');
    setNewObservation('');
    setObservationDialog(null);
  };

  const handleEditAppointment = (id: string) => {
    const appointment = appointments.find((apt) => apt.id === id);
    if (!appointment) return;

    // Validar que no se puede modificar citas en proceso o finalizadas
    if (appointment.status === 'in-progress' || appointment.status === 'completed') {
      toast.error('No se puede modificar una cita en proceso o finalizada');
      return;
    }

    setEditFormData({
      vehicleId: appointment.vehicleId,
      clientName: appointment.clientName,
      date: appointment.date,
      time: appointment.time,
      description: appointment.description,
      mechanicId: appointment.mechanicId || '',
    });
    setEditingAppointment(id);
    setIsAddDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editFormData.vehicleId || !editFormData.clientName || !editFormData.date || !editFormData.time) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    // Validar que la fecha no sea anterior a hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(editFormData.date);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      toast.error('La fecha de la cita no puede ser anterior a la fecha actual');
      return;
    }

    // Validar horario ocupado para el mismo mecánico (excluyendo la cita actual)
    if (editFormData.mechanicId) {
      const isTimeOccupied = appointments.some(
        (apt) =>
          apt.id !== editingAppointment &&
          apt.mechanicId === editFormData.mechanicId &&
          apt.date === editFormData.date &&
          apt.time === editFormData.time &&
          apt.status !== 'cancelled'
      );

      if (isTimeOccupied) {
        toast.error('El mecánico ya tiene una cita asignada en este horario');
        return;
      }
    }

    if (editingAppointment) {
      updateAppointment(editingAppointment, {
        ...editFormData,
        status: 'pending',
      });

      toast.success('Cita actualizada exitosamente');
      setIsAddDialogOpen(false);
      setEditFormData({
        vehicleId: '',
        clientName: '',
        date: '',
        time: '',
        description: '',
        mechanicId: '',
      });
      setEditingAppointment(null);
    }
  };

  const mechanics = users.filter((u) => u.role === 'mechanic' && u.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#0B2545]">Gestión de Citas</h2>
          <p className="text-gray-600 mt-1">Programación de servicios y mantenimiento</p>
        </div>
        {isReceptionist && (
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                setEditingAppointment(null);
                setEditFormData({
                  vehicleId: '',
                  clientName: '',
                  date: '',
                  time: '',
                  description: '',
                  mechanicId: '',
                });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                className="bg-[#FCA311] hover:bg-[#FCA311]/90 rounded-lg"
                onClick={() => setEditingAppointment(null)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Cita
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-lg max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAppointment ? 'Editar Cita' : 'Crear Nueva Cita'}
                </DialogTitle>
                <DialogDescription>
                  {editingAppointment
                    ? 'Modifique los detalles de la cita'
                    : 'Programe un servicio para un cliente y vehículo'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="clientName">Nombre del Cliente *</Label>
                  <Input
                    id="clientName"
                    value={editingAppointment ? editFormData.clientName : formData.clientName}
                    onChange={(e) =>
                      editingAppointment
                        ? setEditFormData({ ...editFormData, clientName: e.target.value })
                        : setFormData({ ...formData, clientName: e.target.value })
                    }
                    placeholder="Nombre completo"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="vehicleId">Vehículo *</Label>
                  <Select
                    value={editingAppointment ? editFormData.vehicleId : formData.vehicleId}
                    onValueChange={(value) =>
                      editingAppointment
                        ? setEditFormData({ ...editFormData, vehicleId: value })
                        : setFormData({ ...formData, vehicleId: value })
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Seleccione un vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles
                        .filter((v) => v.isActive)
                        .map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.plate} - {vehicle.brand} {vehicle.model} (
                            {vehicle.ownerName})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editingAppointment ? editFormData.date : formData.date}
                    onChange={(e) =>
                      editingAppointment
                        ? setEditFormData({ ...editFormData, date: e.target.value })
                        : setFormData({ ...formData, date: e.target.value })
                    }
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Hora *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={editingAppointment ? editFormData.time : formData.time}
                    onChange={(e) =>
                      editingAppointment
                        ? setEditFormData({ ...editFormData, time: e.target.value })
                        : setFormData({ ...formData, time: e.target.value })
                    }
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="mechanicId">Mecánico Asignado (Opcional)</Label>
                  <Select
                    value={editingAppointment ? editFormData.mechanicId : formData.mechanicId}
                    onValueChange={(value) =>
                      editingAppointment
                        ? setEditFormData({ ...editFormData, mechanicId: value })
                        : setFormData({ ...formData, mechanicId: value })
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Sin asignar" />
                    </SelectTrigger>
                    <SelectContent>
                      {mechanics.map((mechanic) => (
                        <SelectItem key={mechanic.id} value={mechanic.id}>
                          {mechanic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Descripción del Servicio</Label>
                  <Textarea
                    id="description"
                    value={editingAppointment ? editFormData.description : formData.description}
                    onChange={(e) =>
                      editingAppointment
                        ? setEditFormData({ ...editFormData, description: e.target.value })
                        : setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Detalle del servicio a realizar..."
                    rows={3}
                    className="rounded-lg resize-none"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={editingAppointment ? handleSaveEdit : handleAddAppointment}
                  className="bg-[#FCA311] hover:bg-[#FCA311]/90 rounded-lg"
                >
                  {editingAppointment ? 'Guardar Cambios' : 'Guardar Cita'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search Bar */}
      <Card className="rounded-lg shadow-md">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por cliente o placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>
            {isMechanic ? 'Mis Citas Programadas' : 'Lista de Citas'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Descripción</TableHead>
                  {!isMechanic && <TableHead>Mecánico</TableHead>}
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isMechanic ? 7 : 7}
                      className="text-center py-8 text-gray-500"
                    >
                      No hay citas programadas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments
                    .sort((a, b) => {
                      const dateA = new Date(`${a.date} ${a.time}`);
                      const dateB = new Date(`${b.date} ${b.time}`);
                      return dateA.getTime() - dateB.getTime();
                    })
                    .map((apt) => {
                      const vehicle = vehicles.find((v) => v.id === apt.vehicleId);
                      const mechanic = users.find((u) => u.id === apt.mechanicId);
                      return (
                        <TableRow key={apt.id}>
                          <TableCell>
                            {new Date(apt.date).toLocaleDateString('es-ES')}
                          </TableCell>
                          <TableCell className="font-medium">{apt.time}</TableCell>
                          <TableCell>{apt.clientName}</TableCell>
                          <TableCell>
                            {vehicle ? (
                              <div>
                                <p className="font-medium">{vehicle.plate}</p>
                                <p className="text-sm text-gray-500">
                                  {vehicle.brand} {vehicle.model}
                                </p>
                              </div>
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {apt.description || 'Sin descripción'}
                          </TableCell>
                          {!isMechanic && (
                            <TableCell>{mechanic?.name || 'Sin asignar'}</TableCell>
                          )}
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                apt.status === 'cancelled'
                                  ? 'destructive'
                                  : apt.status === 'completed'
                                  ? 'default'
                                  : apt.status === 'in-progress'
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className="rounded-full"
                            >
                              {apt.status === 'pending'
                                ? 'Pendiente'
                                : apt.status === 'in-progress'
                                ? 'En Proceso'
                                : apt.status === 'cancelled'
                                ? 'Cancelada'
                                : 'Completado'}
                            </Badge>
                          </TableCell>
                          {isMechanic && (
                            <TableCell className="text-center">
                              <div className="flex gap-2 justify-center items-center">
                                {apt.status === 'cancelled' ? (
                                  <Badge variant="destructive" className="rounded-full">
                                    Cancelada
                                  </Badge>
                                ) : (
                                  <>
                                    <Select
                                      value={apt.status}
                                      onValueChange={(value: any) =>
                                        handleUpdateStatus(apt.id, value)
                                      }
                                    >
                                      <SelectTrigger className="rounded-lg w-[140px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pendiente</SelectItem>
                                        <SelectItem value="in-progress">En Proceso</SelectItem>
                                        <SelectItem value="completed">Completado</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Dialog
                                      open={observationDialog === apt.id}
                                      onOpenChange={(open) => {
                                        if (!open) {
                                          setObservationDialog(null);
                                          setNewObservation('');
                                        }
                                      }}
                                    >
                                      <DialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setObservationDialog(apt.id)}
                                          className="rounded-lg"
                                        >
                                          <MessageSquare className="w-4 h-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="rounded-lg">
                                        <DialogHeader>
                                          <DialogTitle>Observaciones de la Cita</DialogTitle>
                                          <DialogDescription>
                                            Historial y nuevas observaciones para {apt.clientName}
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                          {apt.observations && apt.observations.length > 0 && (
                                            <div className="space-y-2">
                                              <Label>Observaciones Anteriores</Label>
                                              <div className="max-h-40 overflow-y-auto space-y-2">
                                                {apt.observations.map((obs, idx) => (
                                                  <div
                                                    key={idx}
                                                    className="p-3 bg-gray-50 rounded-lg text-sm"
                                                  >
                                                    {obs}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                          <div className="space-y-2">
                                            <Label htmlFor="newObservation">Nueva Observación</Label>
                                            <Textarea
                                              id="newObservation"
                                              value={newObservation}
                                              onChange={(e) => setNewObservation(e.target.value)}
                                              placeholder="Agregar observación sobre el servicio..."
                                              rows={3}
                                              className="rounded-lg resize-none"
                                            />
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button
                                            onClick={() => handleAddObservation(apt.id)}
                                            className="bg-[#FCA311] hover:bg-[#FCA311]/90 rounded-lg"
                                          >
                                            Agregar Observación
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          )}
                          {isReceptionist && (
                            <TableCell className="text-center">
                              <div className="flex gap-2 justify-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditAppointment(apt.id)}
                                  className="rounded-lg"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Editar
                                </Button>
                                {apt.status !== 'cancelled' && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleCancelAppointment(apt.id)}
                                    className="rounded-lg"
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Cancelar
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}