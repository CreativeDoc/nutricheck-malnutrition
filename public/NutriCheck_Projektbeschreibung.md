# NutriCheck – Projektbeschreibung

## 1. Überblick

**NutriCheck** ist eine webbasierte Anwendung zur Erfassung und Bewertung des Ernährungszustands von Patienten. Sie basiert auf dem **NRS 2002** (Nutritional Risk Screening) und wurde von Ernährungsmedizinern, Diätassistentinnen, Krankenschwestern und Pharmazeuten entwickelt.

Die App richtet sich an **medizinische Praxen**, die ein strukturiertes Mangelernährungs-Screening durchführen möchten.

---

## 2. Funktionsumfang (aktueller Stand)

### 2.1 Login
- Praxis-Login mit E-Mail und Passwort
- Aktuell: Demo-Modus (beliebige Zugangsdaten)

### 2.2 Dashboard
- Willkommensseite mit Schnellzugriff auf neues Screening
- Übersicht der durchgeführten Screenings (aktuell nur im Browser-Speicher)
- Einstellungen (Praxisname, E-Mail)

### 2.3 Screening-Wizard
Geführter Fragebogen mit folgenden Schritten:

1. **Sprachauswahl** – Deutsch, Englisch, Russisch
2. **Einleitung** – Aufklärung über Mangelernährung (übersetzt)
3. **Patientenerfassung** – Initialen + Geburtsdatum (keine Klarnamen)
4. **Geschlecht**
5. **Körpergröße & Gewicht** (inkl. "Ich weiß es nicht"-Option)
6. **Normalgewicht**
7. **Gewichtsverlust** (letzte 3 Monate, Menge, Kleidung weiter geworden?)
8. **Mahlzeiten pro Tag**
9. **Portionsgröße** (voller Teller bis ¼ Teller)
10. **Appetitbeurteilung durch Angehörige**
11. **Ernährungshäufigkeit**: Obst, Gemüse, Süßigkeiten, Fleisch, Kohlenhydrate
12. **Aktuelle Erkrankungen**: Krebs, akute Infektionen
13. **Chronische Erkrankungen**: Herzschwäche, Rheuma, Lunge, Niere, Schlaganfall, Durchfall, Übelkeit, Magen-/Darm-OP
14. **Körperliches Befinden**: Schwäche, Muskelabbau, Infektanfälligkeit, Aufstehen, Kurzatmigkeit
15. **Mobilität** (drinnen/draußen)
16. **Trinkmenge**
17. **Schluckbeschwerden**
18. **Medikamente**
19. **Nahrungsergänzungsmittel**
20. **Ernährungstherapie-Erfahrung**
21. **Nährstoff-Infusionen**
22. **Wunsch nach Ernährungsberatung**
23. **Ergebnis** mit Score-Ampel

### 2.4 Ergebnisanzeige
- Ampel-System: Grün (kein Risiko), Gelb (leicht), Rot (schwer)
- Score-Aufschlüsselung nach Kategorien
- BMI-Anzeige (nicht im Score enthalten)
- Therapie-Empfehlung (Energie/Protein pro Tag)
- Option "Bericht kopieren"
- Frage nach Ernährungsberatung mit Bestätigung

---

## 3. Scoring-Kriterien

### 3.1 Gewichtsverlust (0–3 Punkte)
| Situation | Punkte |
|-----------|--------|
| ≥6 kg Verlust | 3 |
| 3–6 kg Verlust | 2 |
| 1–3 kg Verlust | 1 |
| Gewicht unbekannt, aber Kleidung weiter | 1 |
| Kein Verlust | 0 |

### 3.2 Nahrungszufuhr (0–2 Punkte)
Berechnung: **Effektive Mahlzeiten = Mahlzeiten × (Portionsgröße / 100)**

| Effektive Mahlzeiten | Punkte |
|----------------------|--------|
| < 1,5 | 2 |
| < 3 | 1 |
| ≥ 3 | 0 |

Mindestens 1 Punkt, wenn nur 1–2 Mahlzeiten pro Tag.

### 3.3 Erkrankungen (0–7 Punkte max.)
| Erkrankung | Punkte |
|-----------|--------|
| Krebs | 2 |
| Schwere Herzschwäche | 2 |
| Durchfall | 1 |
| Übelkeit/Erbrechen | 1 |
| Zustand nach Magen-/Darm-OP | 1 |
| Andere (Rheuma, Lunge, Niere, Schlaganfall) | 0 (nur Indikator) |

### 3.4 Körperliches Befinden (0–1 Punkt)
1 Punkt, sobald mindestens eine der folgenden Fragen mit "Ja" beantwortet wird:
- Fühlen Sie sich schwächer?
- Muskelabbau?
- Häufigere Infektionen?
- Schwerer aufzustehen?
- Kurzatmiger geworden?

### 3.5 Schluckbeschwerden (0–1 Punkt)
1 Punkt bei "Ja"

### 3.6 BMI
Wird berechnet und angezeigt, fließt **nicht** in den Score ein.

### 3.7 Bewertung
| Gesamtscore | Bewertung |
|------------|-----------|
| 0–2 | Kein Mangelernährungszustand |
| 3–4 | Leichter Mangelernährungszustand |
| ≥ 5 | Schwerer Mangelernährungszustand |

### 3.8 Therapie-Empfehlung (bei Score ≥ 3)
- **Energiebedarf**: 30 kcal × Körpergewicht (kg) pro Tag
- **Proteinbedarf**: 1,0 g × Körpergewicht (kg) pro Tag

---

## 4. Datenschutz

- Keine Klarnamen werden gespeichert
- Patienten werden über Initialen + Geburtsdatum identifiziert (Patienten-Code: z.B. "HM-15031950")
- Zuordnung erfolgt ausschließlich innerhalb der Praxis durch autorisiertes medizinisches Personal
- Externe Identifizierung ist nicht möglich
- Alle Daten sollen verschlüsselt gespeichert werden

---

## 5. Mehrsprachigkeit

Die App unterstützt aktuell drei Sprachen:
- 🇩🇪 **Deutsch** (Standard)
- 🇬🇧 **Englisch**
- 🇷🇺 **Russisch**

Die Sprachauswahl erfolgt vor jedem Screening. Der gesamte Fragebogen und die Ergebnisse werden in der gewählten Sprache angezeigt.

---

## 6. Technologie-Stack

### 6.1 Frontend
| Technologie | Version | Zweck |
|------------|---------|-------|
| React | 18.3 | UI-Framework |
| TypeScript | – | Typsicherheit |
| Vite | – | Build-Tool |
| Tailwind CSS | – | Styling |
| shadcn/ui | – | UI-Komponentenbibliothek |
| React Router | 6.x | Routing |
| React Hook Form + Zod | – | Formulare & Validierung |
| date-fns | 3.x | Datumsformatierung |
| Lucide React | – | Icons |
| Recharts | 2.x | Diagramme (vorbereitet) |
| Framer Motion | – | Animationen (vorbereitet) |

### 6.2 Backend (geplant)
Aktuell läuft die App rein clientseitig ohne persistente Datenspeicherung.

---

## 7. Geplante Features (MVP)

### 7.1 Praxis-Verwaltung
- Echte Authentifizierung (Email/Passwort)
- Jede Praxis hat eigene Screenings
- Praxis-Einstellungen (Name, Logo, Kontaktdaten)

### 7.2 Admin-Bereich
- Übersicht über alle Praxen und deren Screenings
- Statistiken und Auswertungen
- Benutzerverwaltung

### 7.3 Screening-Datenbank
- Persistente Speicherung aller Screenings
- Filterung und Suche
- Export-Funktion (CSV/PDF)

### 7.4 Email-Versand
- Screening-Ergebnisse per Email versenden
- PDF-Bericht generieren und anhängen

---

## 8. Hosting & Infrastruktur – Optionen

### Option A: Lovable Cloud (einfachste Lösung)

**Beschreibung:** Lovable Cloud ist eine integrierte Backend-Lösung, die automatisch eine vollständige Infrastruktur bereitstellt (PostgreSQL-Datenbank, Authentifizierung, Dateispeicher, serverlose Funktionen). Basiert auf Supabase (Open Source).

| Komponente | Beschreibung |
|-----------|-------------|
| Frontend | Automatisch gehostet über Lovable |
| Datenbank | PostgreSQL (automatisch provisioniert) |
| Auth | Email/Passwort, OAuth (Google etc.) |
| Edge Functions | Serverlose Funktionen (Email, AI etc.) |
| Kosten | Nutzungsbasiert, Free Tier verfügbar |

**Vorteile:**
- Kein Setup nötig
- Alles aus einer Hand
- Automatische Skalierung
- Integrierte Secrets-Verwaltung

**Nachteile:**
- Vendor Lock-in (aber Supabase ist Open Source, daher migrierbar)
- Begrenzte Kontrolle über Infrastruktur

---

### Option B: Frontend auf eigenem Hoster (z.B. IONOS) + Supabase Cloud

**Beschreibung:** Das Frontend wird als statische Website auf einem klassischen Hoster deployed. Das Backend läuft über Supabase Cloud (gehosteter Service).

| Komponente | Lösung | Kosten |
|-----------|--------|--------|
| Frontend | IONOS Webhosting / Static Site | Ab ~3€/Mo |
| Backend | Supabase Cloud (supabase.com) | Free Tier, dann ab ~$25/Mo |
| Datenbank | PostgreSQL (über Supabase) | Inkl. |
| Auth | Supabase Auth | Inkl. |
| Edge Functions | Supabase Edge Functions | Inkl. |

**Deployment-Schritte:**
1. GitHub-Repository mit Lovable verbinden
2. Lokal oder in CI/CD: `npm run build`
3. Den `dist/`-Ordner auf IONOS hochladen (FTP oder Git-Deploy)
4. Supabase-Projekt erstellen unter supabase.com
5. `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` im Build konfigurieren
6. Custom Domain in IONOS einrichten

**Vorteile:**
- Volle Kontrolle über Frontend-Hosting
- Eigene Domain einfach konfigurierbar
- Supabase Free Tier reicht für MVP
- Bekannter deutscher Hoster

**Nachteile:**
- Manuelles Deployment nötig
- Zwei Dienste verwalten (Hoster + Supabase)

---

### Option C: Komplett Self-Hosted (eigener Server)

**Beschreibung:** Sowohl Frontend als auch Backend laufen auf einem eigenen Server (VPS). Supabase wird per Docker self-hosted.

| Komponente | Lösung | Kosten |
|-----------|--------|--------|
| Server | VPS (Hetzner, IONOS, DigitalOcean) | Ab ~5€/Mo |
| Frontend | Nginx als Webserver | Inkl. |
| Backend | Supabase Self-Hosted (Docker) | Inkl. |
| Datenbank | PostgreSQL (Docker) | Inkl. |
| SSL | Let's Encrypt | Kostenlos |

**Voraussetzungen:**
- Linux-Server (Ubuntu 22.04+ empfohlen)
- Docker & Docker Compose installiert
- Mindestens 2 GB RAM, 2 vCPUs
- Domain mit DNS-Zugang

**Deployment-Schritte:**
1. VPS mieten und SSH-Zugang einrichten
2. Docker & Docker Compose installieren
3. Supabase Self-Hosted klonen: `git clone https://github.com/supabase/supabase`
4. `.env` konfigurieren (Datenbank-Passwörter, JWT-Secrets, etc.)
5. `docker compose up -d` starten
6. Frontend bauen: `npm run build`
7. `dist/`-Ordner in Nginx-Webroot kopieren
8. SSL mit Certbot/Let's Encrypt einrichten
9. Nginx als Reverse Proxy für Supabase-APIs konfigurieren

**Vorteile:**
- Volle Kontrolle über alle Daten
- Keine laufenden SaaS-Kosten (nur Serverkosten)
- DSGVO-konform (Daten in DE/EU möglich)
- Unabhängig von Drittanbietern

**Nachteile:**
- Höchster Setup-Aufwand
- Server-Wartung und Updates in Eigenverantwortung
- Backups selbst einrichten
- Skalierung manuell

---

### Option D: Eigenes Backend (ohne Supabase)

**Beschreibung:** Statt Supabase wird ein eigenes Backend gebaut (z.B. Node.js/Express + PostgreSQL).

| Aufwand | Hoch |
|---------|------|
| Entwicklungszeit | Mehrere Wochen |
| Wartung | Eigenverantwortlich |

**Nicht empfohlen für MVP**, da Supabase alle benötigten Features out-of-the-box liefert.

---

## 9. Empfohlene Hosting-Strategie

| Phase | Empfehlung |
|-------|-----------|
| **MVP / Prototyp** | Lovable Cloud (Option A) – schnellster Start |
| **Produktion (einfach)** | IONOS + Supabase Cloud (Option B) – bewährt, günstig |
| **Produktion (DSGVO-streng)** | Self-Hosted auf deutschem VPS (Option C) |

---

## 10. Datenbank-Schema (geplant)

### Tabellen

```
practices
├── id (UUID, PK)
├── name (Text)
├── email (Text)
├── created_at (Timestamp)

profiles
├── id (UUID, PK, FK → auth.users)
├── practice_id (UUID, FK → practices)
├── display_name (Text)
├── created_at (Timestamp)

user_roles
├── id (UUID, PK)
├── user_id (UUID, FK → auth.users)
├── role (Enum: admin, user)

screenings
├── id (UUID, PK)
├── practice_id (UUID, FK → practices)
├── created_by (UUID, FK → auth.users)
├── patient_code (Text)
├── birth_date (Date)
├── language (Text: de/en/ru)
├── answers (JSONB)
├── scores (JSONB)
├── total_score (Integer)
├── malnutrition_level (Text: none/mild/severe)
├── is_at_risk (Boolean)
├── wants_counseling (Boolean)
├── created_at (Timestamp)
```

### Row Level Security (RLS)
- Praxen sehen nur eigene Screenings
- Admins sehen alle Screenings aller Praxen
- Rollen werden in separater `user_roles`-Tabelle gespeichert (Sicherheits-Best-Practice)

---

## 11. Kontakt & Weiterentwicklung

Die App wird aktiv weiterentwickelt. Für Fragen, Feature-Requests oder Anpassungen der Scoring-Kriterien wenden Sie sich an das Entwicklungsteam.

---

*Stand: Februar 2026*
*Version: 1.0 (Frontend-Only)*
