---
title: 'So lernst du mit diesem Kurs'
description: 'Lerne von Grund auf, Probleme zu finden, Bedarf zu prüfen, KI-Produkte zu bauen und echten Nutzern bereitzustellen – als Product Engineer mit Verantwortung für Ergebnisse.'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const relatedArticles = relatedArticlesMap['de-de/stage-1/learning-map'] ?? []
</script>

# So lernst du mit diesem Kurs

::: info Besonderer Dank
Die wichtigsten Mitwirkenden und Testpersonen dieses Kurses kommen von der **Tsinghua University Shenzhen International Graduate School**. Vielen Dank an alle Studierenden, die beim tatsächlichen Lernen immer wieder Probleme benannt, Vorschläge gemacht und an Überarbeitungen mitgewirkt haben. Dadurch wurde der Kurs klarer, verlässlicher und näher an den wirklichen Bedürfnissen von Einsteigern. [**👉 Vollständige Liste der Mitwirkenden**](https://github.com/datawhalechina/easy-vibe#-contributing--contributors)
:::

Software zu bauen hatte früher eine hohe Einstiegshürde. Man musste Programmiersprachen, Entwicklungswerkzeuge und viel technisches Wissen lernen, bevor aus einer Idee ein laufendes Programm wurde. Große Sprachmodelle und KI-Coding-Werkzeuge haben das verändert: Menschen können ihre Absicht in natürlicher Sprache beschreiben und KI beim Erzeugen von Code, beim Aufbau von Oberflächen und beim Ändern von Funktionen einsetzen.

## Von Vibe Coding zum Produktbau

**Der Ausdruck [Vibe Coding](https://www.merriam-webster.com/dictionary/vibe%20coding) erschien am 2. Februar 2025.** Der KI-Forscher Andrej Karpathy beschrieb damit eine neue Arbeitsweise: Menschen teilen der KI in natürlicher Sprache mit, was sie wollen, beobachten das Ergebnis und setzen Gespräch und Änderungen fort, ohne jede Codezeile von Anfang an selbst schreiben, verstehen und verwalten zu müssen.

> **Was ist Vibe Coding?**
> Einfach gesagt: „Programmieren durch Sprechen“. Du beschreibst eine Idee, lässt die KI das Programm erzeugen, startest es und verbesserst es im Gespräch.

Der erste Durchbruch bestand darin, dass mehr Menschen die Hürde „Ich kann nicht programmieren, also kann ich nicht anfangen“ überwinden konnten. Ohne Erfahrung lassen sich innerhalb weniger Minuten ein kleines Spiel, eine Webseite oder ein vorführbarer Prototyp erstellen.

<figure class="concept-illustration">
  <img src="../../../zh-cn/stage-1/learning-map/images/vibe-coding-to-product.webp" alt="Eine Person verwandelt mit KI eine natürlich formulierte Idee in einen Produktprototyp, gibt ihn echten Nutzern und verbessert ihn anhand des Feedbacks" loading="lazy">
  <figcaption>Vibe Coding hilft über die Hürde des „Machens“; ein Produkt zu bauen bedeutet, weiter zu echten Nutzern, Feedback und Wert zu gehen.</figcaption>
</figure>

Das ist eine große Veränderung: **Die Kommunikation zwischen Menschen und Computern erweitert sich von strenger Syntax in natürliche Sprache.**

Wenn ein funktionierendes Demo leichter zu bauen ist, entstehen jedoch neue Fragen:

- Was sollten wir bauen, nicht nur was können wir bauen?
- Wessen Problem löst es, und braucht diese Person es wirklich?
- Wie wird aus der KI-generierten ersten Version ein stabiles, verständliches und wartbares Produkt?
- Wie liefern wir es an Nutzer, statt es nur auf unserem Rechner auszuführen?
- Wie zeigen Nutzung, Feedback und Zahlung, dass es echten Wert erzeugt?

Vibe Coding beseitigt das Lernen nicht, sondern **verändert und erhöht die Anforderungen**.

Beim Coding soll Code laufen. Beim Produktbau trägst du Verantwortung für den ganzen Weg vom Problem bis zum Ergebnis:

> **Coding: Kann ich es bauen?**<br>
> **Build Product: Ist es das Bauen wert, wer nutzt es, wie liefere ich es und woran erkenne ich die Wirkung?**

Vibe Coding ist der Startpunkt dieses Kurses, nicht das Ziel. Wir bauen zuerst schnell etwas und lernen dann Problemwahl, Bedarfsprüfung, Lösungsentwurf, Umsetzung, Nutzerkontakt und Verbesserung anhand von Ergebnissen.

::: tip Was will dieser Kurs wirklich entwickeln?
Er vermittelt nicht nur KI-Coding-Werkzeuge. Er soll dir den Einstieg als **Product Engineer** ermöglichen: Probleme finden, Bedarf prüfen, ein Produkt selbst bauen, echten Nutzern liefern und es anhand von Ergebnissen weiterentwickeln.
:::

## Warum brauchen wir heute Product Engineers?

Product Engineering ist kein Beruf, der plötzlich 2026 entstanden ist.

Intercom beschrieb bereits 2018 mit Product Engineer einen Entwickler mit Produktverantwortung: Er setzt nicht nur eine von anderen entworfene Funktion um, sondern versteht Kunden, beteiligt sich an Produktentscheidungen und verbessert das gelieferte Produkt fortlaufend.

KI hat die Kosten des „Machens“ stark gesenkt und ermöglicht Ingenieuren mehr Aufgaben, die früher auf mehrere Rollen verteilt waren. Mit großen Modellen und Coding-Agenten kann eine Person Prototyp, Oberfläche, Frontend, Backend, KI-Integration, Tests und Deployment verbinden. Die Rolle erweitert sich über „Code fertigstellen“ hinaus: Nutzer direkt verstehen, Lösungen prüfen, Nutzung fördern und Geschäftsergebnisse verantworten.

### Von der Beteiligung am Produkt zur Verantwortung für Ergebnisse

Diese echten Zeitpunkte zeigen die Veränderung:

| Zeitpunkt | Unternehmen und Rolle | Signal der Rolle |
| --- | --- | --- |
| Mai 2018 | [Intercom: Product Engineer](https://www.intercom.com/blog/making-the-transition-from-consultant-to-product-engineer/) | Entwickler denken als Produktmenschen, verstehen Kunden und gestalten die Richtung mit |
| Februar 2026 | [Hamilton AI: Product Engineer](https://jobs.ashbyhq.com/hamilton-ai/78c69fe9-828d-44b3-abe6-af56a2badf76/) | Direkt mit Kunden sprechen, ein Gespräch in ein Produkt verwandeln und es mit echten Nutzern prüfen |
| Juni 2026 | [Alma: Product Engineer - AI](https://jobs.ashbyhq.com/tryalma/8021fb35-fc1e-4950-a078-afc0e89d9856) | Dieselbe Person entwirft Agenten, Backend und Oberfläche und beobachtet Anwälte und Kunden |
| Juli 2026 | [Harper: Product Engineer](https://jobs.ashbyhq.com/harperinsure/7d678dba-885a-4432-94c7-a9c20852db35) | In Vertrieb, Service und Versicherungsprüfung arbeiten und Kennzahlen wie Konversion verantworten |
| August 2026 | [Paradigm: Product Engineer, Applied AI](https://jobs.ashbyhq.com/Paradigm/b85b9094-2467-4f49-9a36-ca93da34a3f5) | Probleme in Investment-, Research- und Betriebsteams finden und interne wie offene Produkte bauen |
| Stand August 2026 | [OpenAI: Forward Deployed Engineer](https://openai.com/careers/forward-deployed-engineer-%28fde%29-seattle-seattle/) | Entdeckung, Planung, Bau und Produktion verantworten; Erfolg mit Nutzung und Workflow-Wirkung messen |

<details>
<summary><strong>Weitere reale Rollen aus verschiedenen Branchen</strong></summary>

Die Beispiele reichen von Luftfahrt, Recht, Versicherung und Finanz-Compliance bis Biomedizin, Industrie, Unternehmenssoftware und KI-Infrastruktur.

| Veröffentlichung | Unternehmen und Rolle | Zu schließender Kreislauf |
| --- | --- | --- |
| Februar 2026 | [Sphinx: Product Engineer](https://jobs.ashbyhq.com/Sphinx/08bdb9eb-4b6c-44ab-9615-3bb6b908d008) | Chancen aus Kundengesprächen wählen, prototypisieren, testen und Ergebnisse in die Roadmap einbringen |
| März 2026 | [Hyperscale: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/hyperscale/950c982f-5fb9-481b-a6ad-808feba76757) | Recherche, PoC, Vor-Ort-Einführung und Enterprise-Vertrieb verbinden |
| April 2026 | [Sphere: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/sphere/7b5f39b0-6f3f-4bc4-9469-74ae9722d85a) | Von Kundenerkundung bis Deployment arbeiten und Anforderungen verallgemeinern |
| Mai 2026 | [Avent: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/avent-industrial-inc/bf8337c2-00cf-4ca7-aa43-b4c29e4b8083) | Geschäft verstehen, Code schreiben, Systeme integrieren und erfolgreiche Einführung verantworten |
| Mai 2026 | [Tamarind Bio: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/tamarindbio/be678c9b-984e-4a0a-aedc-a87187e18748/) | Erstgespräch, Pilot, Produktion, Ausbau, Demo und Vertriebszyklus abdecken |
| Juni 2026 | [Protege: Forward Deployed Engineer, New Verticals](https://jobs.ashbyhq.com/protege/b62ebf3e-e07f-4f67-bc9c-4787f23fe449/) | Aus frühen Kundenbedürfnissen neue Geschäftsfelder schaffen und Erfolge in die Plattform übernehmen |
| Juni 2026 | [Dataleap: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/dataleap/6afe756f-fea9-42fc-82ed-621c72a99387/) | Wichtige Workflows finden, Agenten bauen, integrieren und Kunden schulen |
| Juni 2026 | [Collinear AI: Product Engineer](https://jobs.ashbyhq.com/collinear-ai/4d4af6b1-bfc7-4a28-9d86-5bab73e6e396) | Backend, Frontend, API, Erlebnis, Tests und Produktionsqualität verbinden |
| Juli 2026 | [Restate: Forward Deployed Engineer](https://jobs.ashbyhq.com/restate/c9419551-7f51-4691-8ba9-d80a27f1e284) | PoC, Produktionsreife und Deployment verantworten und Einzelprojekte wiederholbar machen |
| Stand August 2026 | [Scale AI: Forward Deployed Engineer, GenAI](https://scale.com/careers/4593571005) | Direkt mit technischen Kunden arbeiten, vollständig entwickeln und schnell experimentieren |

</details>

::: details Zeitpunkt der Recherche
Diese Seite wurde am **9. August 2026** zusammengestellt. Daten von Ashby-Rollen stammen aus dem Feld `publishedAt` ihrer öffentlichen Jobdaten; ohne Veröffentlichungsdatum gilt das Prüfdatum. Seiten können nach Schließung einer Stelle verschwinden.

Die Beispiele sind Beobachtungen realer Rollen, keine Statistik des gesamten Arbeitsmarktes. Sie zeigen eine Richtung in KI-nativen Unternehmen und kleinen Produktteams, nicht die Abschaffung spezialisierter Produkt-, Design-, Engineering- und Vertriebsrollen in allen Unternehmen.
:::

### Was bedeuten diese Veränderungen?

Es geht nicht nur darum, dass Unternehmen mehr von Ingenieuren erwarten. Die Rolle erfahrener Entwickler verändert sich, während zugleich ein neuer Einstieg für Menschen ohne Programmiererfahrung entsteht.

#### Für Menschen, die bereits programmieren: Die Ingenieurrolle wird neu definiert

- **Der Ausgangspunkt ändert sich:** nicht auf Anforderungen warten, sondern im Nutzer- und Geschäftsumfeld Probleme entdecken.
- **Der Zweck des Prototyps ändert sich:** nicht nur Technik zeigen, sondern schnell ausliefern und eine Annahme prüfen.
- **Die Grenze des Engineerings ändert sich:** von einem Modul zu Oberfläche, Backend, KI, Deployment und Nutzungserlebnis.
- **Der Erfolgsmaßstab ändert sich:** von „Feature veröffentlicht“ zu Nutzung, Zeitgewinn, Konversion, Umsatz und Wirkung.
- **Die Beziehung zum Vertrieb ändert sich:** einige Product Engineers nehmen an Demos, PoCs und Kundeneinführungen teil.

„Verkaufen können“ bedeutet nicht, dass jeder klassischer Verkäufer werden muss. Für Product Engineers heißt es zunächst: Menschen finden, die das Produkt brauchen könnten, ihr Problem verstehen, die Lösung zeigen, sie zum Test einladen und prüfen, ob sie weiter nutzen oder zahlen.

#### Für Einsteiger ohne Programmiererfahrung: Eine neue Tür öffnet sich

KI hat auch die Hürde für die Produktentwicklung deutlich gesenkt.

- **Man muss nicht erst jahrelang programmieren lernen.** In natürlicher Sprache kann KI Code und Oberflächen erzeugen und beim Beheben von Fehlern helfen, während ein funktionierendes Ergebnis entsteht.
- **Branchenwissen kann seltener sein als Programmierfähigkeit.** Lehrkräfte, Ärzte, Juristen, Vertrieb und Betrieb kennen reale Nutzer und Abläufe; dieses Wissen bildet die Grundlage guter Produkte.
- **Der Weg von der Idee zum Produkt kann auf Wochen oder sogar Tage schrumpfen.** Ein vertrautes Problem lässt sich als kleines Werkzeug umsetzen und mit echten Nutzern prüfen.

Der Kurs richtet sich deshalb sowohl an Ingenieure, die ihren Wirkungsbereich erweitern möchten, als auch an Einsteiger mit Ideen oder Branchenwissen.

### Wie hängen Product Engineer, FDE und OPC zusammen?

Die drei Begriffe gehören zu derselben Fähigkeitskette, sind aber nicht identisch.

| Begriff | Was ist das? | Hauptumfeld | Verantwortungsbereich |
| --- | --- | --- | --- |
| **Product Engineer** | Rolle zwischen Produkt und Engineering | Innerhalb eines Produktteams | Von Problem und Lösung bis Veröffentlichung, Feedback und Geschäftszahlen |
| **FDE (Forward Deployed Engineer)** | Product Engineering im Kundeneinsatz | Enterprise-Kunden, reale Abläufe und Produktion | Entdeckung, PoC, Integration, Deployment, Adoption, Ausbau und teils Vertrieb |
| **OPC (One-Person Company)** | Von einer Person geführte Unternehmensform, kein Jobtitel | Eine Person nutzt Agenten, Automatisierung und externe Dienste | Markt, Produkt, Marketing, Vertrieb, Lieferung, Support und Cashflow |

<div class="role-path-figure" role="img" aria-label="Die Verantwortung erweitert sich vom Produktbau zum Kundeneinsatz und zum gesamten Unternehmen">
  <div class="role-path-node">
    <strong>Product Engineer</strong>
    <span>Das richtige Produkt bauen</span>
  </div>
  <div class="role-path-arrow" aria-hidden="true"></div>
  <div class="role-path-node">
    <strong>FDE</strong>
    <span>Das Produkt zum Kunden bringen</span>
  </div>
  <div class="role-path-arrow" aria-hidden="true"></div>
  <div class="role-path-node">
    <strong>OPC</strong>
    <span>Ein vollständiges Unternehmen betreiben</span>
  </div>
</div>
<p class="role-path-caption">Das ist keine verpflichtende Karriereleiter, sondern zeigt unterschiedliche Reichweiten derselben Product-Engineering-Fähigkeiten.</p>

Stell sie dir als drei wachsende Kreise vor:

> **Product Engineer: Das richtige Produkt richtig bauen**<br>
> **FDE: Es in den Kundeneinsatz bringen und Ergebnisse erzeugen**<br>
> **OPC: Mit denselben Fähigkeiten ein ganzes Unternehmen führen**

#### FDE: Ingenieure gehen in den Kundeneinsatz

Ein FDE ist weder ein reiner Implementierer, der Software installiert, noch ein Presales Engineer, der nur Demos zeigt. In KI-Unternehmen übernimmt er typischerweise vier Aufgaben:

1. Gemeinsam mit dem Kunden das wertvollste Problem finden.
2. Schnell einen Prototyp oder PoC bauen und technischen wie geschäftlichen Wert zeigen.
3. Produktionscode schreiben und mit echten Kundendaten und Workflows verbinden.
4. Nutzung beobachten und wiederkehrende Bedürfnisse in allgemeine Produktfähigkeiten überführen.

Im August 2026 suchte OpenAI FDEs in mehreren Ländern und Städten und definierte Erfolg über Produktionsnutzung, messbare Workflow-Wirkung und Feldfeedback, das Produkt- und Modell-Roadmaps verändert. FDE wächst von einer besonderen Methode einiger Softwareanbieter zu einer wichtigen Form der KI-Einführung.

#### OPC: Eine Person kann ein „digitales Team“ besitzen

OPC bezeichnet hier nicht nur eine rechtliche Ein-Personen-Gesellschaft. Gemeint ist eine **One-Person Company: ein von einer Person geführtes Unternehmen, das Software, KI-Agenten und externe Infrastruktur nutzt, um frühere Teamarbeit zu erledigen.**

Es ist keine vollständig von KI geführte „menschenlose Firma“. Der Gründer muss den Markt beurteilen, Verantwortung tragen, Nutzer treffen und wichtige Entscheidungen fällen. KI ist eher ein digitales Team, dem Arbeit zugewiesen wird.

Der Trend begann nicht erst mit KI. Der unabhängige Entwickler Pieter Levels beschreibt, wie er Nomads.com, Remote OK, Photo AI, Interior AI und weitere Produkte allein aufgebaut und betrieben hat. KI erweitert das Modell um Design, Code, Inhalte, Analyse und Support, doch der echte Markt entscheidet weiterhin über den Wert. [Pieter Levels’ Projekte](https://levels.io/projects/)

2025 nannte der Work Trend Index von Microsoft Menschen, die KI-Agenten erstellen, Aufgaben delegieren und sie verwalten, **Agent Boss**. Die Studie mit 31.000 Personen aus 31 Ländern zeigte, dass 81 % der Führungskräfte Agenten innerhalb von 12–18 Monaten mittelstark oder tief in ihre KI-Strategie integrieren wollten. [Microsoft 2025 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born)

Im Juni 2025 kaufte Wix die Plattform Base44 für natürlichsprachliche App-Entwicklung für rund 80 Millionen US-Dollar. Base44 ist keine OPC im strengen Sinn, zeigt aber eine wichtige Voraussetzung: Datenbank, Authentifizierung und Deployment, die früher mehrere Rollen erforderten, werden in dialogbasierten Produkten gebündelt und automatisiert. [Wix-Ankündigung](https://www.wix.com/press-room/home/post/wix-further-expands-into-vibe-coding-with-acquisition-of-base44-a-hyper-growth-startup-that-simplif)

Wann das erste Ein-Personen-Einhorn entsteht, ist weiterhin eine Prognose, keine Tatsache. Für Einsteiger ist wichtiger: **Eine Person kann bereits mit weniger Geld und Team schneller validieren und ein kleines, aber tatsächlich profitables Unternehmen betreiben.**

::: tip Warum behandelt der Kurs alle drei Wege?
Ob Produktteam, FDE oder eigene OPC: Der Start ist derselbe. Echtes Problem finden, kleinstes Produkt bauen, Nutzern liefern, Wert erklären und anhand von Nutzung und Zahlung weiterentwickeln.
:::

Der Kurs trainiert deshalb einen vollständigen Produktkreislauf statt getrennter Jobtitel:

> **Problem finden → Bedarf prüfen → Lösung entwerfen → Produkt bauen → Nutzern liefern → Wert erklären → Ergebnisse beobachten → Weiter verbessern**

KI Code schreiben zu lassen ist nur der Anfang. Ein wirklich nutzbares Produkt wirft weitere Fragen auf:

- Wie entsteht sauberer, wartbarer Code?
- Wie wird aus verstreutem Code eine laufende Anwendung?
- Wie veröffentlichen wir eine App für echte Nutzer?
- Wie integrieren wir Text, Bilder und weitere KI-Fähigkeiten?
- Wie erkennen wir, ob Menschen sie brauchen und bezahlen würden?

Der Kurs beantwortet diese Fragen Schritt für Schritt.

Ob Schüler, Lehrer, Arzt, Arbeiter oder jemand ohne technische Kenntnisse: Du musst nicht jahrelang programmieren lernen, bevor du den ersten Produktprototyp beginnst.

| Deine Situation | Wie der Kurs hilft |
| --- | --- |
| Student | Aufgaben, Wettbewerbe und Gründungsprojekte selbst umsetzen |
| Berufstätiger | Wiederholungen automatisieren, effizienter werden und Nebengeschäfte testen |
| Product Manager / Designer | Ideen in Demos verwandeln und Nutzern geben |
| Gründer / kleines Unternehmen | Ideen günstig testen, bevor ein vollständiges Team entsteht |
| Lehrer / Bildungsarbeit | Unterrichtswerkzeuge, Material und automatische Aufgaben erstellen |
| Arzt / Jurist / Spezialist | Fachprozesse automatisieren und eigene Werkzeuge bauen |
| Jeder | Mit KI ein konkretes Problem in Alltag oder Arbeit lösen |

KI senkt die Umsetzungskosten, aber Produktwert hängt davon ab, ein echtes Problem zu finden und die Lösung Nutzern zu liefern.

## Wachstumspfad: Vom KI-Nutzer zum Product Engineer

<div class="stage-intro">
  <div class="stage-card">
    <div class="stage-icon">🎮</div>
    <h3>Erste Erfahrung</h3>
    <p class="stage-role">KI-Coding ausprobieren</p>
    <div class="stage-tags">
      <span>Snake-Spiel</span>
      <span>Ohne Vorkenntnisse beginnen</span>
      <span>Erste Vibe-Coding-Erfahrung</span>
      <span>In Minuten erzeugen</span>
    </div>
  </div>
</div>

<div class="stage-grid">
  <div class="stage-card">
    <div class="stage-icon">🛠️</div>
    <h3>Stage 1</h3>
    <p class="stage-role">Grundlagen Product Engineering</p>
    <div class="stage-tags">
      <span>AI IDE (Cursor/Claude)</span>
      <span>Bedarfsprüfung & Prototyp</span>
      <span>KI-Fähigkeiten integrieren</span>
      <span>An echte Nutzer liefern</span>
    </div>
  </div>
  <div class="stage-card">
    <div class="stage-icon">💻</div>
    <h3>Stage 2</h3>
    <p class="stage-role">Full-Stack Product Engineer</p>
    <div class="stage-tags">
      <span>Figma zu Code</span>
      <span>Supabase-Datenbank</span>
      <span>Stripe-Zahlungen</span>
      <span>Dify-Wissensbasis</span>
    </div>
  </div>
  <div class="stage-card">
    <div class="stage-icon">🚀</div>
    <h3>Stage 3</h3>
    <p class="stage-role">KI Product Engineer / Technischer Leiter</p>
    <div class="stage-tags">
      <span>Web / Mini-Programme / Plattformübergreifend</span>
      <span>Fortgeschrittene MCP-Werkzeuge</span>
      <span>RAG & LangGraph</span>
      <span>Fortgeschrittenes Engineering-Denken</span>
    </div>
  </div>
</div>

<style>
.concept-illustration {
  margin: 24px 0 12px;
}

.concept-illustration img {
  display: block;
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.concept-illustration figcaption,
.role-path-caption {
  margin: 8px 12px 0;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  line-height: 1.6;
  text-align: center;
}

.role-path-figure {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  margin: 24px 0 0;
}

.role-path-node {
  display: flex;
  min-height: 112px;
  padding: 18px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: linear-gradient(145deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.role-path-node strong {
  color: var(--vp-c-brand-1);
  font-size: 1rem;
}

.role-path-node span {
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
}

.role-path-arrow::before {
  color: var(--vp-c-brand-1);
  content: '→';
  font-size: 1.25rem;
  font-weight: 700;
}

.stage-intro {
  margin: 20px auto;
  max-width: 400px;
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.stage-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}

.stage-card:hover {
  transform: translateY(-2px);
  background-color: var(--vp-c-bg-mute);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border-color: var(--vp-c-brand);
}

.stage-icon {
  font-size: 2rem;
  margin-bottom: 8px;
  line-height: 1;
}

.stage-card h3 {
  margin: 0 0 4px 0 !important;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
}

.stage-role {
  margin: 0 0 8px 0 !important;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.stage-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

.stage-tags span {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 3px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.stage-card:hover .stage-tags span {
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-brand-dimm);
  color: var(--vp-c-brand-dark);
}

@media (max-width: 720px) {
  .role-path-figure {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .role-path-node {
    min-height: 88px;
  }

  .role-path-arrow {
    text-align: center;
  }

  .role-path-arrow::before {
    content: '↓';
  }
}
</style>

Nach diesem Lernpfad besitzt du:

- **Vibe-Coding-Fähigkeit:** KI-Werkzeuge sicher nutzen und zu gutem Code führen, ohne zuerst jede Syntax auswendig zu lernen.
- **Full-Stack-Entwicklung:** von UI und Frontend über Datenbank und API bis zu lokaler Entwicklung und Cloud-Deployment.
- **KI-Integration:** multimodale APIs für Text, Bild und Audio anschließen und später mit Methoden wie RAG intelligente Produkte bauen.
- **Produkt- und Betriebsdenken:** Nutzerforschung, Bedarfszerlegung, MVP, Iteration, Zahlung und Nutzerverwaltung.

# Was kannst du nach dem Kurs?

## Stage 1: Baue deinen ersten Produktprototyp

Diese Stufe ist für vollständige Einsteiger und für Menschen mit etwas Codewissen ohne viel Selbstvertrauen. Du beginnst nicht mit einem großen Theorieblock, sondern lernst beim Bauen, KI Code schreiben und Fehler beheben zu lassen.

**Danach kannst du:**

- eine Webanwendung mit einem KI-Coding-Werkzeug selbstständig fertigstellen;
- eine Produktidee in einen klickbaren, interaktiven Prototyp verwandeln;
- KI-Funktionen wie Bilderzeugung und intelligente Gespräche hinzufügen;
- Fehler untersuchen und lösen, statt beim ersten Problem aufzuhören.

Kurz gesagt: Du kannst etwas bauen, das läuft und anderen gezeigt werden kann.

Wir starten mit einem kleinen Spiel, lernen Codeerzeugung und Fehlerbehebung mit KI, gehen von einer einfachen Seite zu einer interaktiven Anwendung, ergänzen KI-Funktionen und schließen ein eigenes Projekt ab.

# Warum trainieren wir mit Projekten?

> **Die Herausforderung echter Arbeit**
>
> Im Beruf gibt es oft ein Ziel, aber keine vollständige Dokumentation, kein fertiges Gerüst und keine detaillierten Anforderungen.

> Vorgesetzter oder Kunde: Wir müssen xxx bauen und yyy erreichen.
>
> Dokumentation? Bestehender Rahmen? Detaillierte Spezifikation? Oft nichts davon.

Viele Aufgaben lösen unbekannte Probleme unter Unsicherheit. Anforderungen sind vage, Grenzen verändern sich und niemand liefert die Standardantwort. Du musst recherchieren, experimentieren, prototypisieren, iterieren und am Ende eine laufende, nutzbare und veröffentlichbare Lösung liefern.

Der Kurs simuliert das in einer sicheren Umgebung:

- anspruchsvolle Projekte erzwingen Problemzerlegung, Lösungsdesign und eigene Recherche;
- nicht übermäßig vereinfachter Code lehrt das Lesen und Ändern einer mittelgroßen Codebasis;
- der Weg von der Idee zur Veröffentlichung vermittelt eine echte Null-zu-Eins-Produkterfahrung.

Kurzfristig ist das anstrengend. Langfristig verbessert es Verantwortung, Orientierung in Unsicherheit und die Fähigkeit, KI in ein echtes Produkt statt ein Demo zu verwandeln.

# Die Kunst des Fragens: Grundfähigkeit im KI-Zeitalter

Fragen ist eine Grundfähigkeit. Beim gleichen Code und Fehler **bestimmt die Art der Frage fast die Antwort**: vage Rede oder umsetzbare Schritte.

**Mach es zur Gewohnheit:** Behandle das Fragen an KI als Teil der Entwicklung. Frage sofort, wenn etwas unklar ist oder du feststeckst.

## Warum ist das unverzichtbar?

- **Die Realität hat selten vollständige Dokumentation:** Anforderungen sind unklar, Code unfertig, Fehlermeldungen verstreut.
- **KI kann Lehrer und Kollege sein:** Gute Fragen machen daraus hochwertiges Pair Programming.
- **Kommunikation setzt die Obergrenze:** Je besser Kontext und Ausgabevorgaben, desto nutzbarer die Antwort.

**Häufiger Fehler:** Nur „Warum Fehler?“ erzeugt Vermutungen. Mit Kontext entsteht ein ausführbarer Plan.

## Informationen an KI geben: Screenshot oder Kopieren?

Beides funktioniert in verschiedenen Situationen:

| Methode | Geeignet für | Wichtige Anforderung |
| --- | --- | --- |
| **Kopieren und Einfügen** | Fehlerstacks, Logs, Code, Konfiguration, API-Antwort | Relevanten Inhalt vollständig liefern, nicht nur eine Zeile |
| **Screenshot** | Layout, Interaktion oder unauffindbarer Button | Kontext zeigen, wichtigen Bereich markieren und einen Satz ergänzen |

::: danger ⚠️ Wichtige Bedingung
**Nicht jede KI akzeptiert Bilder.** Screenshots brauchen ein multimodales Modell wie Claude, GPT-4V/GPT-4o, Gemini, Qwen oder ERNIE Bot.

**Wenn deine KI keine Bilder versteht**, kann sie den Screenshot nicht lesen. Kopiere stattdessen den Text.
:::

## Prompts für gute Erklärungen

Wenn du nicht nur die Antwort, sondern Verständnis möchtest, helfen Anweisungen wie:

> **Lernorientierte Beispiele**
>
> - „Erkläre das Konzept zuerst in fünf Sätzen und stelle mir danach Fragen, um mein Verständnis zu prüfen.“
> - „Erkläre diese Fehlermeldung im Detail. Ich verstehe nicht, warum sie auftritt.“

# Ich versuche es schon lange und möchte aufgeben

Vielleicht muss sich die Methode ändern, nicht deine Ausdauer. Kämpfe nicht allein. Sprich mit Autoren und Tutoren über deine Versuche, den konkreten Stillstand und deinen Zustand. Eine kleine Richtungsänderung oder ein fehlendes Konzept reicht oft, um weiterzugehen.

# Manche Entscheidungen im Kurs wirken unvernünftig

Kontaktiere die Autoren, eröffne ein Issue oder gib Feedback im Kurs oder der Community. Beschreibe genau, was unklar ist, schlecht funktioniert oder Zeit verschwendet. Ehrliches, konkretes Feedback hilft späteren Lernenden.

# Referenz

- [Universität Nanjing: Praktika zu Grundlagen von Computersystemen](https://nju-projectn.github.io/ics-pa-gitbook/ics2025/)

<RelatedArticlesSection
  title="Was du als Nächstes lernen kannst"
  description="Gehe vom Einsatz von KI zum Bau von Produkten weiter."
  :items="relatedArticles"
/>
