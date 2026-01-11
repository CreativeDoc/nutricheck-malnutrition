import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { PatientForm } from '@/components/dashboard/PatientForm';
import { SettingsView } from '@/components/dashboard/SettingsView';
import { ScreeningWizard } from '@/components/screening/ScreeningWizard';
import { Button } from '@/components/ui/button';
import { Patient, ScreeningResult } from '@/types/screening';
import { UserPlus, Activity, ArrowLeft } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

interface PracticeData {
  name: string;
  email: string;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [screenings, setScreenings] = useState<ScreeningResult[]>([]);
  const [practiceData, setPracticeData] = useState<PracticeData>({
    name: 'Ihre Praxis',
    email: 'praxis@beispiel.de'
  });

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
      <Header 
        practiceName={practiceData.name}
        onLogout={onLogout} 
        showSettings={showSettings}
        onSettingsClick={() => setShowSettings(!showSettings)}
      />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {showSettings ? (
          <>
            {/* Back to Dashboard */}
            <Button
              variant="ghost"
              onClick={() => setShowSettings(false)}
              className="gap-2 mb-6 -ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Zurück zum Dashboard
            </Button>

            <h2 className="text-senior-2xl font-bold text-foreground mb-8">
              Einstellungen
            </h2>

            <SettingsView 
              screenings={screenings}
              practiceData={practiceData}
              onPracticeDataChange={setPracticeData}
            />
          </>
        ) : (
          <>
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
            <div>
              <Button
                onClick={() => setShowPatientForm(true)}
                className="btn-xxl w-full gap-4 shadow-button"
              >
                <UserPlus className="w-8 h-8" />
                Neuen Patienten anlegen
              </Button>
            </div>
          </>
        )}
      </main>

      <PatientForm
        open={showPatientForm}
        onOpenChange={setShowPatientForm}
        onSubmit={handlePatientSubmit}
      />
    </div>
  );
}
