import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useScreeningEmail } from '@/hooks/useScreeningEmail';
import { generateReportText } from '@/lib/nrsCalculator';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import {
  ArrowLeft, Building2, ClipboardList, Settings, Pencil, Trash2, X, Check,
  Mail, Loader2, Save,
} from 'lucide-react';

type AdminView = 'practices' | 'screenings' | 'settings';

interface PracticeRow {
  id: string;
  name: string;
  email: string | null;
  created_at: string;
  screenings: { count: number }[];
}

interface ScreeningRow {
  id: string;
  patient_code: string;
  created_at: string;
  total_score: number;
  malnutrition_level: 'none' | 'mild' | 'severe';
  is_at_risk: boolean;
  wants_counseling: boolean | null;
  practice_email: string | null;
  scores: {
    bmi: number;
    weightLossScore: number;
    nutritionScore: number;
    diseaseScore: number;
    physicalConditionScore: number;
    swallowingScore: number;
    recommendations?: { energy: number; protein: number };
  };
  answers: Record<string, unknown>;
}

export function AdminDashboard() {
  const { role, practice, signOut } = useAuthContext();
  const navigate = useNavigate();
  const [view, setView] = useState<AdminView>('practices');
  const [practices, setPractices] = useState<PracticeRow[]>([]);
  const [screenings, setScreenings] = useState<ScreeningRow[]>([]);
  const [selectedPractice, setSelectedPractice] = useState<PracticeRow | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [ccSaving, setCcSaving] = useState(false);
  const [loadingPractices, setLoadingPractices] = useState(true);
  const [loadingScreenings, setLoadingScreenings] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [deletingScreeningId, setDeletingScreeningId] = useState<string | null>(null);
  const { sendScreeningEmail } = useScreeningEmail();

  // Redirect when admin dashboard is disabled or user is not admin
  useEffect(() => {
    if (role !== null && role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  const loadPractices = useCallback(async () => {
    setLoadingPractices(true);
    const { data, error } = await supabase
      .from('practices')
      .select('*, screenings(count)')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
    } else {
      setPractices(data as PracticeRow[]);
    }
    setLoadingPractices(false);
  }, []);

  const loadScreenings = useCallback(async (practiceId: string) => {
    setLoadingScreenings(true);
    const { data, error } = await supabase
      .from('screenings')
      .select('*')
      .eq('practice_id', practiceId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
    } else {
      setScreenings((data ?? []) as ScreeningRow[]);
    }
    setLoadingScreenings(false);
  }, []);

  const loadSettings = useCallback(async () => {
    const { data } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'cc_email')
      .single();
    if (data) setCcEmail(data.value ?? '');
  }, []);

  useEffect(() => {
    if (role === 'admin') {
      loadPractices();
      loadSettings();
    }
  }, [role, loadPractices, loadSettings]);

  const startEdit = (p: PracticeRow) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditEmail(p.email ?? '');
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase
      .from('practices')
      .update({ name: editName, email: editEmail || null })
      .eq('id', editingId);

    if (error) {
      toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
    } else {
      setPractices(prev => prev.map(p =>
        p.id === editingId ? { ...p, name: editName, email: editEmail || null } : p
      ));
      toast({ title: 'Gespeichert' });
      setEditingId(null);
    }
  };

  const deletePractice = async (id: string) => {
    const { error } = await supabase.from('practices').delete().eq('id', id);
    if (error) {
      toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
    } else {
      setPractices(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Praxis gelöscht' });
    }
  };

  const handlePracticeClick = (p: PracticeRow) => {
    setSelectedPractice(p);
    setView('screenings');
    loadScreenings(p.id);
  };

  const deleteScreening = async (s: ScreeningRow) => {
    setDeletingScreeningId(s.id);
    const { error } = await supabase.from('screenings').delete().eq('id', s.id);
    if (error) {
      toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
    } else {
      setScreenings(prev => prev.filter(sc => sc.id !== s.id));
      toast({ title: 'Screening gelöscht' });
    }
    setDeletingScreeningId(null);
  };

  const handleResendEmail = async (s: ScreeningRow) => {
    if (!ccEmail) {
      toast({ title: 'Keine Admin-Email in Einstellungen hinterlegt', variant: 'destructive' });
      return;
    }
    setResendingId(s.id);

    const result = {
      patientCode: s.patient_code,
      answers: s.answers as Record<string, unknown> & { birthDate?: string; wantsNutritionCounseling?: boolean },
      scores: s.scores,
      totalScore: s.total_score,
      malnutritionLevel: s.malnutrition_level,
      isAtRisk: s.is_at_risk,
      recommendations: s.scores.recommendations,
    };
    const reportText = generateReportText(result as Parameters<typeof generateReportText>[0]);

    const success = await sendScreeningEmail({
      patient_code: s.patient_code,
      patient_birth_date: (s.answers as Record<string, unknown>)?.birthDate as string ?? '',
      total_score: s.total_score,
      malnutrition_level: s.malnutrition_level,
      report_text: reportText,
      wants_counseling: s.wants_counseling === true,
      practice_email: ccEmail,
      scores: s.scores,
      recommendations: s.scores.recommendations,
      answers: s.answers as Record<string, unknown>,
    });

    if (success) {
      toast({ title: 'Email gesendet', description: `An ${ccEmail}` });
    } else {
      toast({ title: 'Fehler beim Email-Versand', variant: 'destructive' });
    }
    setResendingId(null);
  };

  const saveCcEmail = async () => {
    setCcSaving(true);
    const { error } = await supabase
      .from('app_settings')
      .update({ value: ccEmail, updated_at: new Date().toISOString() })
      .eq('key', 'cc_email');

    if (error) {
      toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'CC-Email gespeichert' });
    }
    setCcSaving(false);
  };

  const riskBadge = (level: string) => {
    switch (level) {
      case 'severe':
        return <Badge className="bg-destructive text-destructive-foreground">Schwer</Badge>;
      case 'mild':
        return <Badge className="bg-yellow-500 text-white">Leicht</Badge>;
      default:
        return <Badge className="bg-green-600 text-white">Kein Risiko</Badge>;
    }
  };

  if (role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-senior-lg font-bold text-foreground">Verwaltung</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'practices' ? 'default' : 'outline'}
              onClick={() => { setView('practices'); setSelectedPractice(null); }}
              className="gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Praxen</span>
            </Button>
            <Button
              variant={view === 'settings' ? 'default' : 'outline'}
              onClick={() => setView('settings')}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Einstellungen</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Practices View */}
        {view === 'practices' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Alle Praxen
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPractices ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Registriert</TableHead>
                      <TableHead>Screenings</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {practices.map(p => (
                      <TableRow key={p.id}>
                        <TableCell>
                          {editingId === p.id ? (
                            <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-8" />
                          ) : (
                            <button
                              onClick={() => handlePracticeClick(p)}
                              className="text-primary hover:underline font-medium text-left"
                            >
                              {p.name}
                            </button>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === p.id ? (
                            <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="h-8" />
                          ) : (
                            p.email ?? '–'
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(p.created_at).toLocaleDateString('de-DE')}
                        </TableCell>
                        <TableCell>
                          {p.screenings?.[0]?.count ?? 0}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {editingId === p.id ? (
                              <>
                                <Button variant="ghost" size="icon" onClick={saveEdit}>
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={cancelEdit}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => startEdit(p)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                {p.id !== practice?.id && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Praxis löschen?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Die Praxis "{p.name}" und alle zugehörigen Screenings werden unwiderruflich gelöscht.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deletePractice(p.id)}>
                                          Löschen
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {practices.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          Keine Praxen vorhanden
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Screenings View */}
        {view === 'screenings' && selectedPractice && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => { setView('practices'); setSelectedPractice(null); }}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Screenings — {selectedPractice.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loadingScreenings ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patienten-Code</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Risiko</TableHead>
                      <TableHead>Beratung</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {screenings.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.patient_code}</TableCell>
                        <TableCell>
                          {new Date(s.created_at).toLocaleDateString('de-DE')}
                        </TableCell>
                        <TableCell>{s.total_score}</TableCell>
                        <TableCell>{riskBadge(s.malnutrition_level)}</TableCell>
                        <TableCell>
                          {s.wants_counseling === true ? 'Ja' : s.wants_counseling === false ? 'Nein' : '–'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={resendingId === s.id}
                              onClick={() => handleResendEmail(s)}
                              className="gap-1"
                            >
                              {resendingId === s.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Mail className="w-3 h-3" />
                              )}
                              per Email senden
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={deletingScreeningId === s.id}
                                  className="h-8 w-8"
                                >
                                  {deletingScreeningId === s.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Screening löschen?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Screening für Patient „{s.patient_code}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteScreening(s)}>
                                    Löschen
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {screenings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          Keine Screenings vorhanden
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Settings View */}
        {view === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    CC-Email für Screening-Benachrichtigungen
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      value={ccEmail}
                      onChange={e => setCcEmail(e.target.value)}
                      placeholder="cc@example.com"
                    />
                    <Button onClick={saveCcEmail} disabled={ccSaving} className="gap-2">
                      {ccSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Speichern
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Diese Adresse erhält eine Kopie aller Screening-Emails.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
