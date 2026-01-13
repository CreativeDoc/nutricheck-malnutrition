import { useState } from 'react';
import { Login } from './Login';
import { Dashboard } from './Dashboard';
import { ScreeningWizard } from '@/components/screening/ScreeningWizard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [testScreening, setTestScreening] = useState(false);

  if (testScreening) {
    return (
      <ScreeningWizard
        patientCode="TEST-001"
        birthDate="1950-01-01"
        onComplete={() => setTestScreening(false)}
        onCancel={() => setTestScreening(false)}
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <Login 
        onLogin={() => setIsLoggedIn(true)} 
        onTestScreening={() => setTestScreening(true)}
      />
    );
  }

  return <Dashboard onLogout={() => setIsLoggedIn(false)} />;
};

export default Index;
