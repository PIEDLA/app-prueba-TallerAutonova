import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Settings, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email, password);
    if (success) {
      // Get user role from context
      const userStr = localStorage.getItem('autonova_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === 'admin') {
          navigate('/dashboard/admin');
        } else if (user.role === 'mechanic') {
          navigate('/dashboard/mechanic');
        } else if (user.role === 'receptionist') {
          navigate('/dashboard/receptionist');
        }
      }
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B2545] to-[#13315C] p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#FCA311] rounded-full flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl">TALLER AUTONOVA</CardTitle>
          <CardDescription>Sistema de Gestión Automotriz</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Usuario</Label>
              <Input
                id="email"
                type="text"
                placeholder="Ingrese su usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>
            
            <Button type="submit" className="w-full rounded-lg bg-[#FCA311] hover:bg-[#FCA311]/90">
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
