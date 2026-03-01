import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Building2, Save, Mail } from 'lucide-react';
import { FEATURES } from '@/config/featureFlags';

interface SettingsViewProps {
  practiceData: { name: string; email: string };
  loginEmail: string;
  appLanguage: string;
  onSave: (data: { name: string; email: string; app_language: string }) => Promise<void>;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SettingsView({ practiceData, loginEmail, appLanguage, onSave }: SettingsViewProps) {
  const [name, setName] = useState(practiceData.name);
  const [email, setEmail] = useState(practiceData.email);
  const [language, setLanguage] = useState(appLanguage);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const emailValid = !email || isValidEmail(email);
  const canSave = name && emailValid;

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({ name, email, app_language: language });
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
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
          {FEATURES.PRACTICE_SETTINGS_FULL && (
            <>
              {/* Login Email (read-only) */}
              <div className="space-y-2">
                <Label className="text-senior font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Anmelde-Email
                </Label>
                <p className="text-senior text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
                  {loginEmail}
                </p>
              </div>

              {/* Practice Name */}
              <div className="space-y-2">
                <Label htmlFor="practiceName" className="text-senior font-medium">
                  Praxisname
                </Label>
                <Input
                  id="practiceName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 text-senior"
                  placeholder="Name Ihrer Praxis"
                />
              </div>
            </>
          )}

          {/* Notification Email */}
          <div className="space-y-2">
            <Label htmlFor="practiceEmail" className="text-senior font-medium">
              Benachrichtigungs-E-Mail
            </Label>
            <Input
              id="practiceEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 text-senior"
              placeholder="praxis@beispiel.de"
            />
            {email && !emailValid && (
              <p className="text-sm text-destructive">
                Bitte geben Sie eine gültige E-Mail-Adresse ein
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Screening-Ergebnisse werden automatisch an diese Adresse gesendet
            </p>
          </div>
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
              <CardTitle className="text-senior-lg">Sprache der Anwendung</CardTitle>
              <CardDescription className="text-base">
                Sprache der Praxis-Oberfläche (die Screening-Sprache für Patienten wird separat gewählt)
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
                Deutsch
              </SelectItem>
              <SelectItem value="en" className="text-senior py-3">
                English
              </SelectItem>
              <SelectItem value="ru" className="text-senior py-3">
                Русский
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={!canSave || isSaving}
        className="btn-xl w-full gap-3"
      >
        <Save className="w-6 h-6" />
        {isSaving ? 'Speichern...' : saved ? 'Gespeichert!' : 'Änderungen speichern'}
      </Button>
    </div>
  );
}
