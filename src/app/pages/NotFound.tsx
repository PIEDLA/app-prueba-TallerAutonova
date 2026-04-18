import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Home } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B2545] to-[#13315C] p-4">
      <Card className="w-full max-w-md shadow-2xl text-center">
        <CardContent className="py-12">
          <h1 className="text-6xl font-bold text-[#0B2545] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Página no encontrada</h2>
          <p className="text-gray-500 mb-6">
            La página que buscas no existe o ha sido movida.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="bg-[#FCA311] hover:bg-[#FCA311]/90 rounded-lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
