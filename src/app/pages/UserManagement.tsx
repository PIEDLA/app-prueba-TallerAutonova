import { useState } from 'react';
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
import { Search, Plus, UserX, UserCheck } from 'lucide-react';
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
import { toast } from 'sonner';

export function UserManagement() {
  const { users, addUser, updateUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'mechanic' as 'mechanic' | 'receptionist',
  });

  const filteredUsers = users.filter(
    (user) =>
      user.role !== 'admin' &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    // Check if email already exists
    if (users.some((u) => u.email === formData.email)) {
      toast.error('El correo electrónico ya está registrado');
      return;
    }

    addUser({
      ...formData,
      isActive: true,
    });

    toast.success('Usuario creado exitosamente');
    setIsAddDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'mechanic',
    });
  };

  const handleToggleUserStatus = (id: string, currentStatus: boolean) => {
    updateUser(id, { isActive: !currentStatus });
    toast.success(currentStatus ? 'Usuario desactivado' : 'Usuario activado');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#0B2545]">Gestión de Usuarios</h2>
          <p className="text-gray-600 mt-1">Administración de empleados del sistema</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FCA311] hover:bg-[#FCA311]/90 rounded-lg">
              <Plus className="w-4 h-4 mr-2" />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-lg">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Registre un nuevo empleado en el sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo/Usuario *</Label>
                <Input
                  id="email"
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario123"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: 'mechanic' | 'receptionist') =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mechanic">Mecánico</SelectItem>
                    <SelectItem value="receptionist">Recepcionista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddUser}
                className="bg-[#FCA311] hover:bg-[#FCA311]/90 rounded-lg"
              >
                Guardar Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card className="rounded-lg shadow-md">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Lista de Empleados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo/Usuario</TableHead>
                  <TableHead className="text-center">Rol</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="rounded-full capitalize">
                          {user.role === 'mechanic' ? 'Mecánico' : 'Recepcionista'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={user.isActive ? 'default' : 'secondary'}
                          className="rounded-full"
                        >
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant={user.isActive ? 'destructive' : 'default'}
                          className="rounded-lg"
                          onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                        >
                          {user.isActive ? (
                            <>
                              <UserX className="w-4 h-4 mr-1" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 mr-1" />
                              Activar
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
