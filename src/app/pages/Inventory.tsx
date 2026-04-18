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
import { Search, Edit, AlertTriangle, CheckCircle, Minus, Plus } from 'lucide-react';
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
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function Inventory() {
  const { inventory, updateInventoryItem, addInventoryItem } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [withdrawItem, setWithdrawItem] = useState<string | null>(null);
  const [withdrawQuantity, setWithdrawQuantity] = useState<number>(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    code: '',
    name: '',
    quantity: 0,
    minStock: 0,
  });

  const isAdmin = user?.role === 'admin';
  const isMechanic = user?.role === 'mechanic';

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStock = () => {
    if (editingItem && newQuantity >= 0) {
      updateInventoryItem(editingItem, newQuantity);
      toast.success('Inventario actualizado correctamente');
      setEditingItem(null);
      setNewQuantity(0);
    }
  };

  const handleWithdrawStock = () => {
    if (withdrawItem) {
      const item = inventory.find((i) => i.id === withdrawItem);
      if (item && withdrawQuantity > 0 && withdrawQuantity <= item.quantity) {
        updateInventoryItem(withdrawItem, item.quantity - withdrawQuantity);
        toast.success(`Se retiraron ${withdrawQuantity} unidades de ${item.name}`);
        setWithdrawItem(null);
        setWithdrawQuantity(1);
      } else if (item && withdrawQuantity > item.quantity) {
        toast.error('No hay suficiente stock disponible');
      }
    }
  };

  const handleAddItem = () => {
    if (!newItem.code || !newItem.name) {
      toast.error('El código y el nombre son campos obligatorios');
      return;
    }
    if (newItem.minStock <= 0) {
      toast.error('El nivel mínimo de stock debe ser mayor a 0');
      return;
    }
    if (newItem.quantity < 0 || newItem.minStock < 0) {
      toast.error('Las cantidades no pueden ser negativas');
      return;
    }

    try {
      addInventoryItem(newItem);
      toast.success('Repuesto agregado correctamente');
      setIsAddDialogOpen(false);
      setNewItem({
        code: '',
        name: '',
        quantity: 0,
        minStock: 0,
      });
    } catch (error: any) {
      toast.error(error.message || 'Error al agregar el repuesto');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#0B2545]">Inventario de Repuestos</h2>
          <p className="text-gray-600 mt-1">Gestión de stock y alertas</p>
        </div>
        {isAdmin && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Agregar Repuesto
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <Card className="rounded-lg shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por código o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Lista de Repuestos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="text-center">Stock Mínimo</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  {(isAdmin || isMechanic) && <TableHead className="text-center">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin || isMechanic ? 6 : 5} className="text-center py-8 text-gray-500">
                      No se encontraron repuestos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => {
                    const isLowStock = item.quantity < item.minStock;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={isLowStock ? 'text-red-600 font-semibold' : ''}
                          >
                            {item.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">{item.minStock}</TableCell>
                        <TableCell className="text-center">
                          {isLowStock ? (
                            <Badge variant="destructive" className="rounded-full">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Bajo Stock
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="rounded-full bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Normal
                            </Badge>
                          )}
                        </TableCell>
                        {(isAdmin || isMechanic) && (
                          <TableCell className="text-center">
                            <div className="flex gap-2 justify-center">
                              {isAdmin && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="rounded-lg"
                                      onClick={() => {
                                        setEditingItem(item.id);
                                        setNewQuantity(item.quantity);
                                      }}
                                    >
                                      <Edit className="w-4 h-4 mr-1" />
                                      Actualizar
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="rounded-lg">
                                    <DialogHeader>
                                      <DialogTitle>Actualizar Inventario</DialogTitle>
                                      <DialogDescription>
                                        Modifica la cantidad en stock de {item.name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="quantity">Nueva Cantidad</Label>
                                        <Input
                                          id="quantity"
                                          type="number"
                                          min="0"
                                          value={newQuantity}
                                          onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                                          className="rounded-lg"
                                        />
                                      </div>
                                      <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                        <p className="text-gray-600">
                                          <strong>Stock actual:</strong> {item.quantity}
                                        </p>
                                        <p className="text-gray-600">
                                          <strong>Stock mínimo:</strong> {item.minStock}
                                        </p>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={handleUpdateStock}
                                        className="bg-[#FCA311] hover:bg-[#FCA311]/90 rounded-lg"
                                      >
                                        Guardar Cambios
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                              {isMechanic && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="rounded-lg"
                                      onClick={() => {
                                        setWithdrawItem(item.id);
                                        setWithdrawQuantity(1);
                                      }}
                                    >
                                      <Minus className="w-4 h-4 mr-1" />
                                      Retirar
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="rounded-lg">
                                    <DialogHeader>
                                      <DialogTitle>Retirar Repuesto</DialogTitle>
                                      <DialogDescription>
                                        Retira unidades de {item.name} del inventario
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="withdraw-quantity">Cantidad a Retirar</Label>
                                        <Input
                                          id="withdraw-quantity"
                                          type="number"
                                          min="1"
                                          max={item.quantity}
                                          value={withdrawQuantity}
                                          onChange={(e) => setWithdrawQuantity(parseInt(e.target.value) || 1)}
                                          className="rounded-lg"
                                        />
                                      </div>
                                      <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                        <p className="text-gray-600">
                                          <strong>Stock disponible:</strong> {item.quantity}
                                        </p>
                                        <p className="text-gray-600">
                                          <strong>Stock restante:</strong> {Math.max(0, item.quantity - withdrawQuantity)}
                                        </p>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={handleWithdrawStock}
                                        className="bg-[#FCA311] hover:bg-[#FCA311]/90 rounded-lg"
                                      >
                                        Confirmar Retiro
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
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

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="rounded-lg">
          <DialogHeader>
            <DialogTitle>Agregar Repuesto</DialogTitle>
            <DialogDescription>
              Agrega un nuevo repuesto al inventario
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                type="text"
                value={newItem.code}
                onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                className="rounded-lg"
                placeholder="Ej: FIL-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="rounded-lg"
                placeholder="Ej: Filtro de aceite"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad Inicial</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Nivel Mínimo de Stock *</Label>
              <Input
                id="minStock"
                type="number"
                min="1"
                value={newItem.minStock}
                onChange={(e) => setNewItem({ ...newItem, minStock: parseInt(e.target.value) || 0 })}
                className="rounded-lg"
                placeholder="Cantidad mínima requerida"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddItem}
              className="bg-[#FCA311] hover:bg-[#FCA311]/90 rounded-lg"
            >
              Agregar Repuesto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}