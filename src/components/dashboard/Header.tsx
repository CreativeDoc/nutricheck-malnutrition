import { Button } from '@/components/ui/button';
import { LogOut, Activity, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  practiceName?: string;
  onLogout: () => void;
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

export function Header({ 
  practiceName = "Ihre Praxis", 
  onLogout,
  showSettings = false,
  onSettingsClick
}: HeaderProps) {
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

        <div className="flex items-center gap-2">
          <Button
            variant={showSettings ? "default" : "outline"}
            onClick={onSettingsClick}
            className={cn("gap-2", showSettings && "bg-primary text-primary-foreground")}
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Einstellungen</span>
          </Button>

          <Button
            variant="outline"
            onClick={onLogout}
            className="gap-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Abmelden</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
