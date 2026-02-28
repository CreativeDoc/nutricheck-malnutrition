import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, LogIn, Eye, EyeOff, UserPlus, Mail, Loader2 } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

type AuthMode = 'login' | 'register' | 'reset';

export function Login() {
  const { signIn, signUp, resetPassword } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [practiceName, setPracticeName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) setError(error.message);
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Passwörter stimmen nicht überein');
          setSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password, practiceName);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Bestätigungs-E-Mail gesendet. Bitte prüfen Sie Ihr Postfach.');
        }
      } else {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Link zum Zurücksetzen wurde gesendet. Bitte prüfen Sie Ihr Postfach.');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
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
              {mode === 'login' && 'Praxis-Login'}
              {mode === 'register' && 'Registrierung'}
              {mode === 'reset' && 'Passwort zurücksetzen'}
            </h2>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-700 text-sm rounded-lg p-3 mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="practiceName" className="text-senior">
                    Praxisname
                  </Label>
                  <Input
                    id="practiceName"
                    type="text"
                    placeholder="Name Ihrer Praxis"
                    value={practiceName}
                    onChange={(e) => setPracticeName(e.target.value)}
                    className="text-senior h-14"
                    required
                  />
                </div>
              )}

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

              {mode !== 'reset' && (
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
              )}

              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-senior">
                    Passwort bestätigen
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="text-senior h-14"
                    required
                  />
                </div>
              )}

              <Button type="submit" className="btn-xl w-full gap-3" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : mode === 'login' ? (
                  <LogIn className="w-6 h-6" />
                ) : mode === 'register' ? (
                  <UserPlus className="w-6 h-6" />
                ) : (
                  <Mail className="w-6 h-6" />
                )}
                {mode === 'login' && 'Anmelden'}
                {mode === 'register' && 'Registrieren'}
                {mode === 'reset' && 'Link senden'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2 text-sm">
              {mode === 'login' && (
                <>
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-muted-foreground hover:text-foreground underline"
                  >
                    Passwort vergessen?
                  </button>
                  <div>
                    <span className="text-muted-foreground">Noch kein Konto? </span>
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className="text-primary hover:underline font-medium"
                    >
                      Registrieren
                    </button>
                  </div>
                </>
              )}
              {mode === 'register' && (
                <div>
                  <span className="text-muted-foreground">Bereits registriert? </span>
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-primary hover:underline font-medium"
                  >
                    Anmelden
                  </button>
                </div>
              )}
              {mode === 'reset' && (
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-primary hover:underline font-medium"
                >
                  Zurück zum Login
                </button>
              )}
            </div>
          </div>
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
