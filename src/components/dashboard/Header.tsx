import { Button } from '@/components/ui/button';
import { LogOut, Activity } from 'lucide-react';

interface HeaderProps {
  practiceName?: string;
  onLogout: () => void;
}

export function Header({ practiceName = "Ihre Praxis", onLogout }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Activity className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-senior-lg font-bold text-foreground">
              NutriCheck
            </h1>
            <p className="text-sm text-muted-foreground">{practiceName}</p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={onLogout}
          className="gap-2"
        >
          <LogOut className="w-5 h-5" />
          Abmelden
        </Button>
      </div>
    </header>
  );
}
