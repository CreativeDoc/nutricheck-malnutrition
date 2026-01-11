import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { PatientForm } from '@/components/dashboard/PatientForm';
import { RecentScreenings } from '@/components/dashboard/RecentScreenings';
import { ScreeningWizard } from '@/components/screening/ScreeningWizard';
import { Button } from '@/components/ui/button';
import { Patient, ScreeningResult } from '@/types/screening';
import { UserPlus, ClipboardList, Activity } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [screenings, setScreenings] = useState<ScreeningResult[]>([]);

  const handlePatientSubmit = (patient: Patient) => {
    setActivePatient(patient);
    setShowPatientForm(false);
  };

  const handleScreeningComplete = (result: ScreeningResult) => {
    setScreenings(prev => [result, ...prev]);
  };

  const handleExitScreening = () => {
    setActivePatient(null);
  };

  // If there's an active patient, show the screening wizard
  if (activePatient) {
    return (
      <ScreeningWizard
        patientCode={activePatient.patientCode}
        birthDate={activePatient.birthDate}
        onComplete={handleScreeningComplete}
        onCancel={handleExitScreening}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-senior-2xl font-bold text-foreground mb-3">
            Willkommen bei NutriCheck
          </h2>
          <p className="text-senior-lg text-muted-foreground max-w-xl mx-auto">
            Führen Sie ein Mangelernährungs-Screening nach NRS 2002 durch
          </p>
        </div>

        {/* Main Action */}
        <div className="mb-12">
          <Button
            onClick={() => setShowPatientForm(true)}
            className="btn-xxl w-full gap-4 shadow-button"
          >
            <UserPlus className="w-8 h-8" />
            Neuen Patienten anlegen
          </Button>
        </div>

        {/* Recent Screenings */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <ClipboardList className="w-6 h-6 text-muted-foreground" />
            <h3 className="text-senior-xl font-semibold text-foreground">
              Letzte Screenings
            </h3>
          </div>
          <RecentScreenings screenings={screenings} />
        </section>
      </main>

      <PatientForm
        open={showPatientForm}
        onOpenChange={setShowPatientForm}
        onSubmit={handlePatientSubmit}
      />
    </div>
  );
}
