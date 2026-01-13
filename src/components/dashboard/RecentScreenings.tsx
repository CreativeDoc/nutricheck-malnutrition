import { useState } from 'react';
import { ScreeningResult } from '@/types/screening';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, Calendar, User, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ScreeningDetailView } from './ScreeningDetailView';

interface RecentScreeningsProps {
  screenings: ScreeningResult[];
}

export function RecentScreenings({ screenings }: RecentScreeningsProps) {
  const [selectedScreening, setSelectedScreening] = useState<ScreeningResult | null>(null);

  if (selectedScreening) {
    return (
      <ScreeningDetailView 
        screening={selectedScreening} 
        onBack={() => setSelectedScreening(null)} 
      />
    );
  }

  if (screenings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-senior">Noch keine Screenings durchgeführt.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 -mx-1 px-1">
      {screenings.map((screening, index) => (
        <button
          key={index}
          onClick={() => setSelectedScreening(screening)}
          className={cn(
            "w-full p-4 rounded-xl border-2 flex items-center gap-4 text-left transition-all hover:shadow-md",
            screening.isAtRisk 
              ? "border-danger bg-danger-light hover:border-danger/80" 
              : "border-success bg-success-light hover:border-success/80"
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

          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      ))}
    </div>
  );
}
