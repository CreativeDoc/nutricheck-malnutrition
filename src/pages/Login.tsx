import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, LogIn, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onTestScreening?: () => void;
}

export function Login({ onLogin, onTestScreening }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, accept any credentials
    onLogin();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-10">
            <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Activity className="w-14 h-14 text-primary-foreground" />
            </div>
            <h1 className="text-senior-3xl font-bold text-foreground mb-2">
              NutriCheck
            </h1>
            <p className="text-senior-lg text-muted-foreground">
              Mangelernährungs-Screening
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
            <h2 className="text-senior-xl font-semibold text-foreground mb-6 text-center">
              Praxis-Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-senior">
                  E-Mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="praxis@beispiel.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-senior h-14"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-senior">
                  Passwort
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-senior h-14 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="btn-xl w-full gap-3">
                <LogIn className="w-6 h-6" />
                Anmelden
              </Button>
            </form>
          </div>

          {/* Demo Note */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Demo-Modus: Beliebige Zugangsdaten verwenden
          </p>

          {/* Test Button */}
          {onTestScreening && (
            <Button 
              variant="outline" 
              onClick={onTestScreening}
              className="w-full mt-4 gap-2"
            >
              🧪 Test-Screening starten
            </Button>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>NutriCheck Malnutrition Screening v1.0</p>
        <p className="mt-1">Basierend auf NRS 2002</p>
      </footer>
    </div>
  );
}
