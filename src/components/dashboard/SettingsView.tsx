import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Building2, Save, Eye, EyeOff, Mail } from 'lucide-react';

interface PracticeData {
  name: string;
  email: string;
}

interface SettingsViewProps {
  practiceData: PracticeData;
  onPracticeDataChange: (data: PracticeData) => void;
}

const PRACTICE_EMAIL_KEY = 'nutricheck_practice_email';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SettingsView({ practiceData, onPracticeDataChange }: SettingsViewProps) {
  const [language, setLanguage] = useState('de');
  const [localPracticeData, setLocalPracticeData] = useState(practiceData);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState(
    () => localStorage.getItem(PRACTICE_EMAIL_KEY) || ''
  );
  const [emailSaved, setEmailSaved] = useState(false);
  const emailValid = notificationEmail === '' || isValidEmail(notificationEmail);

  const handleSavePracticeData = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      onPracticeDataChange(localPracticeData);
      setIsSaving(false);
      setNewPassword('');
      setConfirmPassword('');
    }, 500);
  };

  const passwordsMatch = newPassword === confirmPassword;
  const canSave = localPracticeData.name && localPracticeData.email && 
    (newPassword === '' || (newPassword.length >= 8 && passwordsMatch));

  return (
    <div className="space-y-8">
      {/* Notification Email */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-senior-lg">Benachrichtigungs-Email</CardTitle>
              <CardDescription className="text-base">
                Screening-Ergebnisse werden automatisch an diese Adresse gesendet
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notificationEmail" className="text-senior font-medium">
              E-Mail-Adresse der Praxis
            </Label>
            <Input
              id="notificationEmail"
              type="email"
              value={notificationEmail}
              onChange={(e) => {
                setNotificationEmail(e.target.value);
                setEmailSaved(false);
              }}
              className="h-14 text-senior"
              placeholder="praxis@beispiel.de"
            />
            {notificationEmail && !emailValid && (
              <p className="text-sm text-destructive">
                Bitte geben Sie eine gültige E-Mail-Adresse ein
              </p>
            )}
          </div>
          <Button
            onClick={() => {
              if (notificationEmail && !emailValid) return;
              localStorage.setItem(PRACTICE_EMAIL_KEY, notificationEmail);
              setEmailSaved(true);
              setTimeout(() => setEmailSaved(false), 2000);
            }}
            disabled={notificationEmail !== '' && !emailValid}
            variant="outline"
            className="btn-xl w-full gap-3"
          >
            <Save className="w-6 h-6" />
            {emailSaved ? 'Gespeichert!' : 'Email speichern'}
          </Button>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-senior-lg">Sprache</CardTitle>
              <CardDescription className="text-base">
                Wählen Sie die Sprache der Anwendung
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full h-14 text-senior">
              <SelectValue placeholder="Sprache wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de" className="text-senior py-3">
                🇩🇪 Deutsch
              </SelectItem>
              <SelectItem value="en" className="text-senior py-3">
                🇬🇧 English
              </SelectItem>
              <SelectItem value="fr" className="text-senior py-3">
                🇫🇷 Français
              </SelectItem>
              <SelectItem value="es" className="text-senior py-3">
                🇪🇸 Español
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Practice Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-senior-lg">Praxisdaten</CardTitle>
              <CardDescription className="text-base">
                Verwalten Sie die Daten Ihrer Praxis
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="practiceName" className="text-senior font-medium">
              Praxisname
            </Label>
            <Input
              id="practiceName"
              value={localPracticeData.name}
              onChange={(e) => setLocalPracticeData(prev => ({ ...prev, name: e.target.value }))}
              className="h-14 text-senior"
              placeholder="Name Ihrer Praxis"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-senior font-medium">
              E-Mail-Adresse
            </Label>
            <Input
              id="email"
              type="email"
              value={localPracticeData.email}
              onChange={(e) => setLocalPracticeData(prev => ({ ...prev, email: e.target.value }))}
              className="h-14 text-senior"
              placeholder="praxis@beispiel.de"
            />
          </div>

          <div className="border-t border-border pt-6">
            <h4 className="text-senior font-medium mb-4">Passwort ändern</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-senior font-medium">
                  Neues Passwort
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-14 text-senior pr-14"
                    placeholder="Mindestens 8 Zeichen"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-senior font-medium">
                  Passwort bestätigen
                </Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-14 text-senior"
                  placeholder="Passwort wiederholen"
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="text-sm text-danger">
                    Die Passwörter stimmen nicht überein
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSavePracticeData}
            disabled={!canSave || isSaving}
            className="btn-xl w-full gap-3"
          >
            <Save className="w-6 h-6" />
            {isSaving ? 'Speichern...' : 'Änderungen speichern'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
