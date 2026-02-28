import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/dashboard/Header';
import { PatientForm } from '@/components/dashboard/PatientForm';
import { SettingsView } from '@/components/dashboard/SettingsView';
import { RecentScreenings } from '@/components/dashboard/RecentScreenings';
import { LanguageSelector } from '@/components/dashboard/LanguageSelector';
import { ScreeningIntro } from '@/components/dashboard/ScreeningIntro';
import { ScreeningWizard } from '@/components/screening/ScreeningWizard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient, PatientLanguage, ScreeningResult } from '@/types/screening';
import { UserPlus, Activity, ArrowLeft, ClipboardList } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

type DashboardView = 'home' | 'settings' | 'screenings';

export function Dashboard() {
  const { signOut, user, practice, role, updatePractice } = useAuthContext();
  const navigate = useNavigate();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<PatientLanguage>('de');
  const [currentView, setCurrentView] = useState<DashboardView>('home');
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [screenings, setScreenings] = useState<ScreeningResult[]>([]);
  const screeningSavedRef = useRef(false);

  const loadScreenings = useCallback(async () => {
    if (!practice) return;
    const { data } = await supabase
      .from('screenings')
      .select('*')
      .eq('practice_id', practice.id)
      .order('created_at', { ascending: false });

    if (data) {
      setScreenings(data.map(row => ({
        patientCode: row.patient_code,
        answers: row.answers,
        scores: row.scores,
        totalScore: row.total_score,
        malnutritionLevel: row.malnutrition_level,
        isAtRisk: row.is_at_risk,
        recommendations: row.scores?.recommendations,
        createdAt: new Date(row.created_at),
      })));
    }
  }, [practice]);

  useEffect(() => {
    loadScreenings();
  }, [loadScreenings]);

  const handleStartScreening = () => {
    setShowLanguageSelector(true);
  };

  const handleLanguageSelect = (language: PatientLanguage) => {
    setSelectedLanguage(language);
    setShowLanguageSelector(false);
    setShowIntro(true);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    setShowPatientForm(true);
  };

  const handlePatientSubmit = (patient: Patient) => {
    setActivePatient(patient);
    setShowPatientForm(false);
  };

  const handleScreeningComplete = async (result: ScreeningResult) => {
    if (practice && user && !screeningSavedRef.current) {
      // First call: insert into DB
      screeningSavedRef.current = true;
      await supabase.from('screenings').insert({
        practice_id: practice.id,
        created_by: user.id,
        patient_code: result.patientCode,
        birth_date: result.answers.birthDate || null,
        language: selectedLanguage,
        answers: result.answers,
        scores: result.scores,
        total_score: result.totalScore,
        malnutrition_level: result.malnutritionLevel,
        is_at_risk: result.isAtRisk,
        wants_counseling: result.answers.wantsNutritionCounseling ?? null,
        practice_email: practice.email || null,
      });
      setScreenings(prev => [result, ...prev]);
    } else if (screeningSavedRef.current) {
      // Subsequent calls (e.g. counseling choice update): update local state only
      setScreenings(prev => [result, ...prev.slice(1)]);
    }
  };

  const handleExitScreening = () => {
    setActivePatient(null);
    screeningSavedRef.current = false;
  };

  // If there's an active patient, show the screening wizard
  if (activePatient) {
    return (
      <ScreeningWizard
        patientCode={activePatient.patientCode}
        birthDate={activePatient.birthDate}
        language={activePatient.language}
        onComplete={handleScreeningComplete}
        onCancel={handleExitScreening}
      />
    );
  }

  const handleViewChange = (view: DashboardView) => {
    setCurrentView(view);
  };

  const handlePracticeDataChange = async (data: { name: string; email: string }) => {
    await updatePractice({ name: data.name, email: data.email });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        practiceName={practice?.name || 'Praxis'}
        onLogout={signOut}
        showSettings={currentView === 'settings'}
        onSettingsClick={() => handleViewChange(currentView === 'settings' ? 'home' : 'settings')}
        showScreenings={currentView === 'screenings'}
        onScreeningsClick={() => handleViewChange(currentView === 'screenings' ? 'home' : 'screenings')}
        isAdmin={role === 'admin'}
        onAdminClick={() => navigate('/admin')}
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
              practiceData={{ name: practice?.name || '', email: practice?.email || '' }}
              onPracticeDataChange={handlePracticeDataChange}
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
                onClick={handleStartScreening}
                className="btn-xxl w-full gap-4 shadow-button"
              >
                <UserPlus className="w-8 h-8" />
                Neuen Patienten anlegen
              </Button>
            </div>
          </>
        )}
      </main>

      <LanguageSelector
        open={showLanguageSelector}
        onOpenChange={setShowLanguageSelector}
        onSelect={handleLanguageSelect}
      />

      <ScreeningIntro
        open={showIntro}
        onOpenChange={setShowIntro}
        onContinue={handleIntroComplete}
        language={selectedLanguage}
      />

      <PatientForm
        open={showPatientForm}
        onOpenChange={setShowPatientForm}
        onSubmit={handlePatientSubmit}
        selectedLanguage={selectedLanguage}
      />
    </div>
  );
}
