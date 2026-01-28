import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { PatientForm } from '@/components/dashboard/PatientForm';
import { SettingsView } from '@/components/dashboard/SettingsView';
import { RecentScreenings } from '@/components/dashboard/RecentScreenings';
import { ScreeningWizard } from '@/components/screening/ScreeningWizard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient, ScreeningResult } from '@/types/screening';
import { UserPlus, Activity, ArrowLeft, ClipboardList } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

interface PracticeData {
  name: string;
  email: string;
}

type DashboardView = 'home' | 'settings' | 'screenings';

export function Dashboard({ onLogout }: DashboardProps) {
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [currentView, setCurrentView] = useState<DashboardView>('home');
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

  const handleViewChange = (view: DashboardView) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        practiceName={practiceData.name}
        onLogout={onLogout} 
        showSettings={currentView === 'settings'}
        onSettingsClick={() => handleViewChange(currentView === 'settings' ? 'home' : 'settings')}
        showScreenings={currentView === 'screenings'}
        onScreeningsClick={() => handleViewChange(currentView === 'screenings' ? 'home' : 'screenings')}
      />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {currentView !== 'home' && (
          <Button
            variant="ghost"
            onClick={() => setCurrentView('home')}
            className="gap-2 mb-6 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Zurück zum Dashboard
          </Button>
        )}

        {currentView === 'settings' && (
          <>
            <h2 className="text-senior-2xl font-bold text-foreground mb-8">
              Einstellungen
            </h2>

            <SettingsView 
              practiceData={practiceData}
              onPracticeDataChange={setPracticeData}
            />
          </>
        )}

        {currentView === 'screenings' && (
          <>
            <h2 className="text-senior-2xl font-bold text-foreground mb-8">
              Screenings
            </h2>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-senior-lg">Letzte Screenings</CardTitle>
                    <CardDescription className="text-base">
                      Übersicht der durchgeführten Screenings
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-visible">
                <RecentScreenings screenings={screenings} />
              </CardContent>
            </Card>
          </>
        )}

        {currentView === 'home' && (
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
