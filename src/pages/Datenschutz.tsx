import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Datenschutz() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2 mb-6 -ml-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Zurück
        </Button>

        <h1 className="text-senior-2xl font-bold text-foreground mb-8">
          Datenschutzerklärung
        </h1>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Verantwortlicher
            </h2>
            <p className="text-foreground leading-relaxed">
              Dr. med. John Heim<br />
              [Adresse wird ergänzt]<br />
              [PLZ Ort]<br />
              E-Mail: [wird ergänzt]<br />
              Telefon: [wird ergänzt]
            </p>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Allgemeines zur Datenverarbeitung
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              NutriCheck ist eine webbasierte Anwendung zur Durchführung von Mangelernährungs-Screenings
              nach NRS 2002. Die Anwendung wird ausschließlich von medizinischem Fachpersonal in
              Arztpraxen genutzt. Im Folgenden informieren wir über Art, Umfang und Zweck der
              Verarbeitung personenbezogener Daten.
            </p>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Art der verarbeiteten Daten
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Die Anwendung verarbeitet ausschließlich pseudonymisierte Patientendaten:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
              <li>Initialen des Patienten (Vor- und Nachname, je ein Buchstabe)</li>
              <li>Geburtsdatum</li>
              <li>Screening-Antworten und berechnete Scores</li>
              <li>Risikobewertung und Ernährungsempfehlungen</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">
              <strong>Es werden keine Klarnamen der Patienten gespeichert.</strong> Der Patienten-Code
              wird aus den Initialen und dem Geburtsdatum generiert (z.B. „MH-15-03-1990").
            </p>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Rechtsgrundlage
            </h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) für die allgemeine Datenverarbeitung</li>
              <li>Art. 9 Abs. 2 lit. h DSGVO (Verarbeitung von Gesundheitsdaten im Rahmen der medizinischen Versorgung durch ärztliches Fachpersonal)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Hosting und Datenverarbeitung
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Folgende Dienste werden für den Betrieb der Anwendung eingesetzt:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
              <li><strong>Supabase</strong> — Datenbank und Authentifizierung. Server-Standort: Frankfurt am Main, Deutschland (EU).</li>
              <li><strong>Vercel</strong> — Frontend-Hosting und Bereitstellung der Webanwendung.</li>
              <li><strong>Resend.com</strong> — Versand von Benachrichtigungs-E-Mails mit Screening-Ergebnissen an die Arztpraxis.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Mit allen Auftragsverarbeitern bestehen Verträge zur Auftragsverarbeitung gemäß Art. 28 DSGVO.
            </p>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              E-Mail-Versand
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Nach Abschluss eines Screenings wird das Ergebnis per E-Mail an die hinterlegte
              Praxis-E-Mail-Adresse gesendet. Der Versand erfolgt über den Dienst Resend.com.
              Die E-Mail enthält den pseudonymisierten Patienten-Code, die Screening-Ergebnisse
              und ggf. Ernährungsempfehlungen.
            </p>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Speicherdauer
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Screening-Daten werden gespeichert, bis sie durch den verantwortlichen Praxisinhaber
              gelöscht werden. Es gibt keine automatische Löschung. Der Praxisinhaber ist für die
              Einhaltung der gesetzlichen Aufbewahrungsfristen verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Betroffenenrechte
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Sie haben gegenüber dem Verantwortlichen folgende Rechte hinsichtlich Ihrer
              personenbezogenen Daten:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Beschwerderecht
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die
              Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
            </p>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Weitergabe an Dritte
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Eine Weitergabe personenbezogener Daten an Dritte findet nicht statt, außer an die
              oben genannten Auftragsverarbeiter (Supabase, Vercel, Resend.com), die ausschließlich
              im Rahmen der Auftragsverarbeitung tätig werden.
            </p>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Die Anwendung verwendet ausschließlich technisch notwendige Session-Cookies zur
              Authentifizierung. Es werden keine Tracking-Cookies oder Cookies zu Werbezwecken eingesetzt.
            </p>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              SSL-Verschlüsselung
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Die Anwendung nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung für
              die Übertragung aller Daten. Eine verschlüsselte Verbindung erkennen Sie daran, dass
              die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem
              Schloss-Symbol in Ihrer Browserzeile.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
