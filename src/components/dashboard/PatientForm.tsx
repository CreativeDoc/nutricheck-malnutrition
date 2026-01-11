import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { UserPlus, Play } from 'lucide-react';
import { Patient } from '@/types/screening';

interface PatientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (patient: Patient) => void;
}

export function PatientForm({ open, onOpenChange, onSubmit }: PatientFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const generatePatientCode = () => {
    if (!firstName || !lastName || !birthDate) return '';
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    const [year, month, day] = birthDate.split('-');
    return `${initials}-${day}-${month}-${year}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const patient: Patient = {
      id: crypto.randomUUID(),
      patientCode: generatePatientCode(),
      initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase(),
      birthDate,
      createdAt: new Date(),
    };

    onSubmit(patient);
    resetForm();
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setBirthDate('');
  };

  const patientCode = generatePatientCode();
  const isValid = firstName && lastName && birthDate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-senior-lg flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-primary" />
            Neuen Patienten anlegen
          </DialogTitle>
          <DialogDescription className="text-senior">
            Geben Sie die Initialen und das Geburtsdatum ein. Es werden keine Klarnamen gespeichert.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-senior">
                Vorname (Initial)
              </Label>
              <Input
                id="firstName"
                placeholder="Hans"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="text-senior h-14"
                maxLength={20}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-senior">
                Nachname (Initial)
              </Label>
              <Input
                id="lastName"
                placeholder="Müller"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="text-senior h-14"
                maxLength={20}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-senior">
              Geburtsdatum
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="text-senior h-14"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {patientCode && (
            <div className="p-4 bg-accent rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Patienten-Code</p>
              <p className="text-senior-lg font-mono font-bold text-foreground">
                {patientCode}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={!isValid}
            className="btn-xl w-full gap-3"
          >
            <Play className="w-6 h-6" />
            Screening starten
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
