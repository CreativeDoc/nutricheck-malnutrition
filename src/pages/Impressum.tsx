import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Impressum() {
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
          Impressum
        </h1>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Angaben gemäß § 5 TMG
            </h2>
            <p className="text-foreground leading-relaxed">
              Dr. med. John Heim<br />
              [Adresse wird ergänzt]<br />
              [PLZ Ort]
            </p>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Kontakt
            </h2>
            <p className="text-foreground leading-relaxed">
              Telefon: [wird ergänzt]<br />
              E-Mail: [wird ergänzt]
            </p>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Berufsbezeichnung
            </h2>
            <p className="text-foreground leading-relaxed">
              Arzt (verliehen in der Bundesrepublik Deutschland)
            </p>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Zuständige Aufsichtsbehörde
            </h2>
            <p className="text-foreground leading-relaxed">
              [Zuständige Ärztekammer wird ergänzt]
            </p>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Haftung für Inhalte
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
              allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch
              nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
              Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung
              oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
              Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
              Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
              diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-senior-lg font-semibold text-foreground mb-3">
              Haftung für Links
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss
              haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte
              der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
              Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente
              inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
              Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige
              Links umgehend entfernen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
