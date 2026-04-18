import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, Package, TrendingDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';

export function Alerts() {
  const { inventory } = useData();

  const lowStockItems = inventory.filter((item) => item.quantity < item.minStock);
  const criticalItems = lowStockItems.filter((item) => item.quantity < item.minStock * 0.5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#0B2545]">Centro de Alertas</h2>
        <p className="text-gray-600 mt-1">Monitoreo de stock y notificaciones críticas</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-lg shadow-md border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Repuestos con Bajo Stock
            </CardTitle>
            <TrendingDown className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{lowStockItems.length}</div>
            <p className="text-xs text-gray-500 mt-1">Por debajo del mínimo</p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Alertas Críticas
            </CardTitle>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{criticalItems.length}</div>
            <p className="text-xs text-gray-500 mt-1">Stock críticamente bajo</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-red-600 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Alertas Críticas
          </h3>
          <div className="space-y-3">
            {criticalItems.map((item) => (
              <Alert key={item.id} variant="destructive" className="rounded-lg">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle className="font-semibold">Stock Críticamente Bajo</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    <p>
                      <strong>{item.name}</strong> (Código: {item.code})
                    </p>
                    <p className="text-sm">
                      Stock actual: <strong>{item.quantity}</strong> unidades
                    </p>
                    <p className="text-sm">
                      Stock mínimo requerido: <strong>{item.minStock}</strong> unidades
                    </p>
                    <p className="text-sm">
                      Faltan: <strong>{item.minStock - item.quantity}</strong> unidades
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock Warnings */}
      {lowStockItems.filter((item) => !criticalItems.includes(item)).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-orange-600 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2" />
            Advertencias de Stock Bajo
          </h3>
          <div className="space-y-3">
            {lowStockItems
              .filter((item) => !criticalItems.includes(item))
              .map((item) => (
                <Alert
                  key={item.id}
                  className="rounded-lg border-orange-200 bg-orange-50"
                >
                  <Package className="h-5 w-5 text-orange-600" />
                  <AlertTitle className="text-orange-900">
                    Stock por Debajo del Mínimo
                  </AlertTitle>
                  <AlertDescription className="text-orange-800">
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          {item.name} ({item.code})
                        </p>
                        <p className="text-sm mt-1">
                          Stock: {item.quantity} / Mínimo: {item.minStock}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-orange-700 border-orange-700">
                        Reabastecer
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
          </div>
        </div>
      )}

      {/* No Alerts */}
      {lowStockItems.length === 0 && (
        <Card className="rounded-lg shadow-md border-green-200 bg-green-50">
          <CardContent className="py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              ¡Todo en Orden!
            </h3>
            <p className="text-green-700">
              No hay alertas de stock bajo en este momento. Todos los repuestos están por
              encima del stock mínimo.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
