import { ScreeningResult } from '@/types/screening';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface RecentScreeningsProps {
  screenings: ScreeningResult[];
}

export function RecentScreenings({ screenings }: RecentScreeningsProps) {
  if (screenings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-senior">Noch keine Screenings durchgeführt.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {screenings.map((screening, index) => (
        <div
          key={index}
          className={cn(
            "p-4 rounded-xl border-2 flex items-center gap-4",
            screening.isAtRisk 
              ? "border-danger bg-danger-light" 
              : "border-success bg-success-light"
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
            screening.isAtRisk ? "bg-danger" : "bg-success"
          )}>
            {screening.isAtRisk ? (
              <AlertTriangle className="w-6 h-6 text-danger-foreground" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-success-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono font-semibold text-foreground">
                {screening.patientCode}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(screening.createdAt, 'dd.MM.yyyy HH:mm', { locale: de })}
              </span>
              <span>Score: {screening.totalScore}</span>
            </div>
          </div>

          <div className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            screening.isAtRisk 
              ? "bg-danger text-danger-foreground" 
              : "bg-success text-success-foreground"
          )}>
            {screening.isAtRisk ? 'Risiko' : 'OK'}
          </div>
        </div>
      ))}
    </div>
  );
}
