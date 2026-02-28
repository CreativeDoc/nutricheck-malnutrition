import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-destructive text-destructive-foreground px-4 py-3 text-center shadow-lg">
      <div className="flex items-center justify-center gap-2 text-sm font-medium">
        <WifiOff className="w-4 h-4 flex-shrink-0" />
        <span>
          Keine Internetverbindung. Bitte prüfen Sie Ihre Verbindung.
          Das Screening kann nicht gespeichert werden.
        </span>
      </div>
    </div>
  );
}
