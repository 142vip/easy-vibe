---
title: 'Ideen für AI-Produkte im Verbraucheralltag'
description: '80 konkrete Richtungen für Consumer-AI aus Alltag, Gefühl, Unterhaltung, Lernen, Beziehungen, Gesundheit und weiteren Lebenssituationen.'
---

<script setup>
import { computed, ref } from 'vue'

const duration = 'Etwa <strong>4 Stunden</strong>'
const vibePoint = ref('')
const feeling = ref('')

const scenarios = {
  lifestyle: { name: 'Lebensstil', anchor: '#_1-lebensstil', title: 'Morgenritual-Assistent', desc: 'Eine kurze Routine aus Wetter, Terminplan und Stimmung' },
  emotion: { name: 'Emotionale Begleitung', anchor: '#_2-emotionale-begleitung', title: 'Nächtlicher Zuhörer', desc: 'Gedanken ohne Urteil ordnen' },
  entertainment: { name: 'Unterhaltung', anchor: '#_3-unterhaltung-und-freizeit', title: 'Interaktive Krimi-Spielleitung', desc: 'Eine Geschichte, die Entscheidungen erinnert' },
  growth: { name: 'Persönliches Wachstum', anchor: '#_4-persönliches-wachstum', title: 'Spielerischer Gewohnheitscoach', desc: 'Kleine Handlungen als Aufgaben und Fortschritt' },
  social: { name: 'Soziale Interaktion', anchor: '#_5-soziale-interaktion', title: 'Eisbrecher-Generator', desc: 'Passende erste Fragen für ein Treffen' },
  creative: { name: 'Kreativer Ausdruck', anchor: '#_6-kreativer-ausdruck', title: 'Erste Hilfe bei Ideenblockade', desc: 'Neue Ausgangspunkte durch Grenzen und Varianten' },
  travel: { name: 'Reise und Entdeckung', anchor: '#_7-reise-und-entdeckung', title: 'Stadtspaziergang-Guide', desc: 'Kurze Wege nach Zeit und Stimmung' },
  health: { name: 'Körper und Seele', anchor: '#_8-körper-und-seele', title: 'Bewegungs-Motivator', desc: 'Ein kleiner Anfang passend zur Tagesform' },
  learning: { name: 'Wissensentdeckung', anchor: '#_9-wissensentdeckung', title: 'Sprachpartner für Alltagssituationen', desc: 'Rollenspiele für echte Gespräche' },
  relationship: { name: 'Beziehungen pflegen', anchor: '#_10-beziehungen-pflegen', title: 'Gesprächscoach für Nähe', desc: 'Schwierige Aussagen respektvoll vorbereiten' },
  pet: { name: 'Leben mit Tieren', anchor: '#_11-leben-mit-tieren', title: 'Tagebuch aus Tiersicht', desc: 'Fotos und Notizen als warme Geschichte' },
  finance: { name: 'Finanzielle Gesundheit', anchor: '#_12-finanzielle-gesundheit', title: 'Kaufgefühle erkennen', desc: 'Impulse vor und nach einem Kauf beobachten' },
  career: { name: 'Berufliche Entwicklung', anchor: '#_13-berufliche-entwicklung', title: 'Begleiter bei Berufsunsicherheit', desc: 'Erfahrung und Werte zu Optionen ordnen' },
  home: { name: 'Wohnen', anchor: '#_14-wohnen-und-raum', title: 'Wohnatmosphäre-Designer', desc: 'Kleine Raumänderungen nach Jahreszeit und Gefühl' },
  food: { name: 'Essen und Kochen', anchor: '#_15-essen-und-kochen', title: 'Wohltuendes Essen für eine Person', desc: 'Eine einfache Mahlzeit aus vorhandenen Zutaten' },
  fashion: { name: 'Kleidung und Stil', anchor: '#_16-kleidung-und-stil', title: 'Outfit-Stimmungsboard', desc: 'Kombinationen aus Wetter, Termin und Kleiderschrank' }
}

const recommendationMap = {
  healing: { relax: ['emotion', 'health', 'home'], inspire: ['creative', 'growth', 'lifestyle'], connect: ['relationship', 'pet', 'social'], escape: ['travel', 'entertainment', 'lifestyle'] },
  growth: { relax: ['growth', 'health', 'learning'], inspire: ['career', 'learning', 'creative'], connect: ['social', 'relationship', 'career'], escape: ['travel', 'entertainment', 'creative'] },
  social: { relax: ['social', 'food', 'home'], inspire: ['social', 'creative', 'travel'], connect: ['relationship', 'social', 'pet'], escape: ['travel', 'entertainment', 'creative'] },
  explore: { relax: ['travel', 'lifestyle', 'food'], inspire: ['travel', 'creative', 'learning'], connect: ['travel', 'social', 'relationship'], escape: ['travel', 'entertainment', 'creative'] },
  daily: { relax: ['lifestyle', 'home', 'health'], inspire: ['creative', 'food', 'fashion'], connect: ['relationship', 'pet', 'lifestyle'], escape: ['entertainment', 'travel', 'lifestyle'] }
}

const vibeOptions = [
  { label: 'Wohltuend', value: 'healing' },
  { label: 'Wachstum', value: 'growth' },
  { label: 'Gemeinsam', value: 'social' },
  { label: 'Entdeckend', value: 'explore' },
  { label: 'Alltäglich', value: 'daily' }
]

const feelingOptions = [
  { label: 'Ich möchte entspannen', value: 'relax' },
  { label: 'Ich suche Inspiration', value: 'inspire' },
  { label: 'Ich suche Verbindung', value: 'connect' },
  { label: 'Ich möchte kurz entkommen', value: 'escape' }
]

const recommendations = computed(() => {
  const keys = recommendationMap[vibePoint.value]?.[feeling.value] || []
  return keys.map(key => scenarios[key])
})

const scrollToAnchor = (anchor) => {
  const element = document.querySelector(anchor)
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

# Ideen für AI-Produkte im Verbraucheralltag

## Kapitelüberblick

<ChapterIntroduction :duration="duration" :tags="['Consumer-Anwendungen', 'Alltag', 'Emotionale Erfahrung', 'Atmosphäre']" coreOutput="16 Felder und 80 Szenarien kennenlernen" expectedOutput="Eine Richtung für echte Nutzer auswählen">

Bei Unternehmenssoftware stehen oft Zeit und Kosten im Vordergrund. Für Privatpersonen zählen außerdem Entspannung, Freude, Selbstvertrauen und der Grund, morgen wiederzukommen. Diese Sammlung ist keine Liste zum Kopieren, sondern ein Ausgangspunkt: Wählen Sie eine Lebenssituation, die Sie verstehen, und prüfen Sie sie mit echten Menschen.

</ChapterIntroduction>

## Schnellwahl nach Atmosphäre

<el-card shadow="hover" style="margin: 16px 0 24px; border-left: 5px solid #ec4899;">
  <p><strong>Wählen Sie die gewünschte Atmosphäre und das aktuelle Gefühl.</strong></p>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="vibePoint" placeholder="Atmosphäre auswählen" style="width: 100%;">
        <el-option v-for="item in vibeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-select v-model="feeling" placeholder="Gefühl auswählen" style="width: 100%;">
        <el-option v-for="item in feelingOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-col>
  </el-row>
  <div v-if="recommendations.length" style="margin-top: 16px; display: grid; gap: 10px;">
    <button v-for="item in recommendations" :key="item.anchor" type="button" @click="scrollToAnchor(item.anchor)" style="text-align: left; padding: 10px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg); cursor: pointer;">
      <strong>{{ item.title }}</strong><br><span style="font-size: 13px; color: var(--vp-c-text-2);">{{ item.desc }} · {{ item.name }}</span>
    </button>
  </div>
</el-card>

## Überblick über alle Richtungen

| Felder | Erste Prüffrage |
| --- | --- |
| Alltag, Wohnen, Essen, Kleidung | In welchem Moment denkt die Person an diese Hilfe? |
| Emotion, Gesundheit, Finanzen | Könnte das Ergebnis als Diagnose, Therapie oder Renditeversprechen missverstanden werden? |
| Unterhaltung, Kreativität, Reisen | Entsteht in der ersten Minute ein erfreuliches Ergebnis? |
| Wachstum, Lernen, Beruf, Soziales, Beziehungen und Tiere | Baut das Produkt Fähigkeiten auf und achtet zugleich Rechte, Privatsphäre und Sicherheit anderer? |

Schreiben Sie zu jeder Richtung einen Satz: Wer öffnet sie wann, aus welchem Grund und mit welcher Veränderung schließt die Person sie wieder?

## 1. Lebensstil

### 1.1 Morgenritual-Assistent

Aus Wetter, Schlaf, Terminen und Stimmung entsteht eine fünfminütige Morgenroutine. Statt mehr Alarme anzulegen, soll die Person einen kleinen Start wählen und abschließen können.

### 1.2 Atmosphäre für das Alleinleben

Nach Feierabend werden Licht, Musik, Duft und eine kleine Aufräumhandlung kombiniert. Die Grundidee muss auch ohne Smart-Home-Geräte als einfache Checkliste funktionieren.

### 1.3 Wohltuender Wochenendplan für zu Hause

Energie und Budget ergeben eine Mischung aus Film, Essen, kleiner Aktivität und Ruhe. „Nichts tun“ bleibt ausdrücklich eine erlaubte Auswahl.

### 1.4 Beruhigendes Radio vor dem Schlafen

Länge und Stimmung steuern eine Geschichte, Atemübung oder ruhige Stimme. Es darf keine medizinische Wirkung versprechen; Ausschalten und Löschen müssen leicht sein.

### 1.5 Entdecker kleiner Alltagsästhetik

Ein Foto oder eine Notiz wird zu Farb-, Anordnungs- oder Ritualideen. Vorhandene Dinge sollen genutzt werden, bevor das Produkt zu neuen Käufen drängt.

## 2. Emotionale Begleitung

### 2.1 Nächtlicher Zuhörer

Das Produkt nimmt Gedanken ohne Urteil auf und trennt Gefühle von Ereignissen. Bei Krisensignalen verweist es auf Menschen und lokale Notfallhilfe, statt endlos weiterzureden.

### 2.2 Begleitung nach einer Trennung

Gefühlsnotizen, ein kurzer Aufschub vor impulsivem Kontakt und ein Tagesplan unterstützen die erste Zeit. Überwachung oder Manipulation des ehemaligen Partners gehören nicht hinein.

### 2.3 Atemcoach bei akuter Anspannung

Bild und Ton führen durch eine kurze Übung, die jederzeit beendet werden kann. Sie wird als Selbstregulation und nicht als Behandlung beschrieben.

### 2.4 Mentor zum Wiederaufbau von Selbstvertrauen

Statt allgemeinem Lob zeigt das Produkt reale Handlungen und Fortschritte. Schwierige Gefühle werden nicht weggeredet; die Person wählt einen kleinen nächsten Schritt.

### 2.5 Intelligente Auswertung eines Gefühlstagebuchs

Wiederkehrende Zeiten, Ereignisse und Wörter werden über mehrere Tage sichtbar. Deutungen bleiben Hypothesen und können vom Nutzer korrigiert werden.

## 3. Unterhaltung und Freizeit

### 3.1 Immersive Krimi-Spielleitung

Figuren, Hinweise und Zeitplan bleiben konsistent, während Entscheidungen Informationen freischalten. Die Auflösung liegt in strukturierten Spieldaten und wird nicht spontan geändert.

### 3.2 Lebendige NPCs in einer offenen Spielwelt

NPCs erinnern Begegnungen und verändern Beziehungen und Ton. Zentrale Weltregeln entscheidet die Spielmechanik, nicht eine improvisierte Modellantwort.

### 3.3 Persönlich erzeugter Podcast

Aus Interessen und verfügbaren Quellen entsteht eine kurze Audiosendung. Fakten, Meinung und Fiktion werden unterschieden, Quellen genannt.

### 3.4 Atmosphäre für ein virtuelles Konzert

Live-Abstimmungen, Fanreaktionen und gemeinsame Momente schaffen Nähe. Moderation, langsamer Chat und Schutz vor Belästigung gehören zur Funktion.

### 3.5 Partner für interaktive Romane

Entscheidungen verändern Welt und Beziehungen. Leser können Einstellungen und Text bearbeiten und zu einem früheren Zweig zurückkehren.

## 4. Persönliches Wachstum

### 4.1 Zeuge des eigenen Wachstums

Fotos, Notizen und Erfolge bilden eine Zeitlinie, die an wichtigen Punkten frühere Versionen des eigenen Selbst zeigt. Vergleichsmaßstab sind nicht andere Menschen.

### 4.2 Spielerischer Gewohnheitscoach

Kleine Handlungen werden zu Aufgaben. Belohnt wird auch der Wiedereinstieg nach einer Pause, statt Schuld durch unterbrochene Serien zu erzeugen.

### 4.3 Lernpartner-Matching

Menschen mit ähnlichem Ziel, Niveau und Zeitfenster erhalten eine gemeinsame kleine Aufgabe. Melden, Blockieren und Privatsphäre müssen vor dem Matching funktionieren.

### 4.4 Finder kleiner täglicher Freuden

Ein Foto oder Satz macht einen guten Moment sichtbar. Schwere Tage dürfen unverändert dokumentiert werden; erzwungene Positivität ist nicht das Ziel.

### 4.5 Lebensentscheidungs-Simulator

Umzug, Studium oder Berufswechsel werden unter mehreren Annahmen mit Kosten und Gefühlen verglichen. Das Werkzeug stellt Fragen und sagt keine Zukunft voraus.

## 5. Soziale Interaktion

### 5.1 Eisbrecher-Themengenerator

Art des Treffens, Beziehung und unerwünschte Themen führen zu leichten Einstiegsfragen. Neugier darf nicht in Ausfragen oder Testen kippen.

### 5.2 Stimmung für Social-Media-Texte

Foto und eigener Ton ergeben mehrere Entwürfe. Der Nutzer überarbeitet die Endfassung; das Produkt erfindet keine Erlebnisse.

### 5.3 Planer für eine angenehme Verabredung

Budget, Strecke und Vorlieben beider Personen werden zu Ort, Gesprächen und einer kleinen Überraschung. Zustimmung und Komfort stehen über dem Effekt.

### 5.4 Moderator für ein Treffen auf Distanz

Kurze Spiele, Redeabfolge und Pausen helfen einer Online-Gruppe. Ruhige Personen dürfen mit Reaktionen teilnehmen, ohne zum Sprechen gedrängt zu werden.

### 5.5 Assistent für soziale Energie

Introvertierte Personen planen Energie vor und Erholung nach einem Treffen. Persönlichkeit wird nicht als Fehler dargestellt, der repariert werden muss.

## 6. Kreativer Ausdruck

### 6.1 Erste-Hilfe-Kit bei Ideenblockade

Thema, Form und Einschränkung werden zu mehreren Startpunkten. Das Produkt liefert Material zum Auswählen und Verändern, nicht nur ein fertiges Werk.

### 6.2 Wegweiser zum persönlichen Stil

In Lieblingsbildern und Ausdrucksweisen werden wiederkehrende Farben, Formen und Wörter erkannt. Entscheidend ist, warum etwas gefällt, nicht ein Trendwert.

### 6.3 Ästhetikberater für Journal und Tagebuch

Zweck und vorhandene Werkzeuge führen zu Layout-, Farb- und Inhaltsideen. Eine Variante ohne neue Einkäufe kommt zuerst.

### 6.4 Guide für Bildaufbau und Stimmung

Szene, Licht und gewünschtes Gefühl führen zu Standort und Komposition. Bei Personenbildern werden Einwilligung und Privatsphäre beachtet.

### 6.5 Musik passend zur Stimmung

Aktivität und Gefühl werden mit Tempo und Klang verbunden. Geschützte Musik wird nicht kopiert, sondern in legalen Diensten zu Wiedergabelisten verknüpft.

## 7. Reise und Entdeckung

### 7.1 Guide für Stadtspaziergänge

Zeit, Mobilität und Stimmung ergeben eine kurze Route mit drei Orten. Öffnungszeiten, Sicherheit und Barrierefreiheit brauchen aktuelle Daten.

### 7.2 Reise-Gefühlstagebuch

Fotos, Orte und kurze Sätze werden zu einer bearbeitbaren Zeitlinie. Der Nutzer bestimmt, welche Standortdaten geteilt werden.

### 7.3 Begleiter für Alleinreisende

Check-in, Notfallkontakt und lokale Hinweise vermitteln Sicherheit. Im echten Notfall haben offizielle Hilfen Vorrang vor dem Chat.

### 7.4 Atmosphäre eines Ziels vorab erleben

Jahreszeit, Tageszeit, Geräusch und lokale Gewohnheiten vermitteln einen Eindruck vor der Reise. Werbung und Erfahrungsberichte werden unterschieden.

### 7.5 Fotoanleitung für Reisestimmung

Lichtrichtung, Andrang und Ortseigenschaften führen zu Aufnahmevorschlägen. Zutritt, Drohnen und Personenaufnahmen werden rechtlich geprüft.

## 8. Körper und Seele

### 8.1 Bewegungsmotivation wecken

Die Tagesform führt zu einem kleinsten Start wie zwei Minuten Dehnen. Bei Schmerz oder Warnzeichen wird nicht zum Training gedrängt, sondern Beratung empfohlen.

### 8.2 Küche für gesunde Essensideen

Zutaten, Zeit, Allergien und Ernährungsgrenzen werden zuerst gefragt. Das Produkt verspricht keine Behandlung einer Krankheit.

### 8.3 Schlafatmosphäre verbessern

Licht, Geräusch, Temperatur und Gewohnheit werden einzeln geprüft. Dauerhafte Schlafprobleme gehören in medizinische Hände.

### 8.4 Guide für Körperwahrnehmung

Ein kurzer Body-Scan hilft, Spannung und Müdigkeit wahrzunehmen. Das Modell stellt keine Diagnose und behauptet keine Ursache.

### 8.5 Erinnerung an Selbstfürsorge

Wasser, Essen, Pause und Kontakt werden in einem selbst gewählten Rhythmus erinnert. Benachrichtigungen sind leicht abschaltbar und erzeugen keine Schuld.

## 9. Wissensentdeckung

### 9.1 Spielerischer Wissensweg

Ein Thema wird in Karte und Aufgaben geteilt; Hinweise kommen vor Lösungen. Erfolg bedeutet, das Gelernte mit eigenen Worten zu erklären.

### 9.2 Sprachpartner für Situationen

Café, Vorstellungsgespräch oder Reise werden als Rollenspiel geübt. Wichtige Fehler werden nach dem Gespräch erklärt, ohne jeden Satz zu unterbrechen.

### 9.3 Assistent für Neugier

Aufeinanderfolgende Warum-Fragen werden mit Vergleichen und Quellen beantwortet. Unsicherheit wird benannt und ein Weg zur Prüfung angeboten.

### 9.4 Inspiration für Lesenotizen

Fragen zu auffälligen Aussagen, Einwänden und Anwendungen ordnen die eigenen Gedanken. Das Produkt ersetzt nicht nur das Buch durch eine Zusammenfassung.

### 9.5 Atmosphäre für Wissensaustausch

Gelerntes wird in Karte, Kurzvortrag oder Quiz verwandelt. Quelle und zulässiger Zitatumfang bleiben erhalten.

## 10. Beziehungen pflegen

### 10.1 Gesprächscoach für enge Beziehungen

Beobachtung, Gefühl, Bedürfnis und Bitte werden getrennt vorbereitet. Ziel ist gegenseitiges Gespräch, nicht Manipulation.

### 10.2 Erinnerung an Familienkontakt

Neben Feiertagen werden kleine regelmäßige Kontakte und passende Fragen vorgeschlagen. Automatische Nachrichten müssen vor dem Senden bestätigt werden.

### 10.3 Freundschaften auf Distanz pflegen

Gemeinsame Interessen, letztes Gespräch und verfügbare Zeit führen zu einer leichten Begegnung. Beziehungen werden nicht in Punkte übersetzt.

### 10.4 Planer für Liebeserklärung und Überraschung

Vorlieben, Budget und gewünschte Öffentlichkeit bestimmen eine kleine Erfahrung. Öffentlicher Druck und Aufnahmen ohne Einwilligung werden vermieden.

### 10.5 Guide zur Entschärfung von Konflikten

Fakten und Interpretation werden getrennt; eine Pause und ein Satz für den Wiedereinstieg werden angeboten. Bei Gewalt oder Drohung steht Sicherheit vor Kommunikationstechnik.

## 11. Leben mit Tieren

### 11.1 Tagebuch aus Sicht des Haustiers

Fotos und Halternotizen werden zu einer warmen Stimme des Tiers. Das Produkt behauptet nicht, seine tatsächlichen Gedanken zu kennen.

### 11.2 Deutung von Tierverhalten

Situation und Verhalten ergeben mögliche Erklärungen und Beobachtungspunkte. Gesundheitsfragen werden an Tierärzte verwiesen.

### 11.3 Gemeinsame Zeit planen

Alter, Gesundheit und Wohnraum bestimmen Spiel und Training. Gefährliche Lebensmittel, Gegenstände und Überlastung werden ausgeschlossen.

### 11.4 Erinnerungsgeschichte über ein Tier

Fotos, Daten und Erinnerungen werden zu einem bearbeitbaren Buch. Standort und Gesichter anderer Personen werden vor Veröffentlichung geprüft.

### 11.5 Sicherer Einstieg für neue Tierhalter

Fütterung, Hygiene, Impfung und Umgebung erscheinen als Checkliste. Allgemeine Information wird klar von Zeichen für dringende Behandlung getrennt.

## 12. Finanzielle Gesundheit

### 12.1 Gefühle beim Konsum erkennen

Stimmung, Situation und Zufriedenheit vor und nach einem Kauf zeigen Impulsmuster. Das Werkzeug beschämt nicht, sondern hilft Entscheidungen zu verzögern.

### 12.2 Sparziele sichtbar machen

Reise oder Notgroschen werden in kleine Stufen und ein Bild übersetzt. Bei verändertem Einkommen lässt sich der Plan flexibel anpassen.

### 12.3 Finanzwissen leicht lernen

Zins, Risiko und Streuung werden mit Alltag und Quiz erklärt. Bestimmte Anlagen und sichere Gewinne werden nicht versprochen.

### 12.4 Finanzielle Angst beruhigen

Sorgen werden in Fakten, sofortige Handlung und spätere Prüfung geteilt. Bei Schuldenkrisen werden anerkannte Beratungsstellen genannt.

### 12.5 Spiel für kleine Anlagebeträge

Virtuelles Geld zeigt Schwankung und langfristige Wirkung. Ein Spielergebnis darf nicht als reale Anlagekompetenz erscheinen.

## 13. Berufliche Entwicklung

### 13.1 Begleitung bei Berufsunsicherheit

Erfahrung, Vorlieben, Grenzen und Werte werden zu Optionen und nächsten Erkundungen geordnet. Ein Beruf wird nicht als Schicksal bestimmt.

### 13.2 Erlebten Arbeitserfolg sichtbar machen

Erledigte Aufgaben und Wirkung auf andere zeigen unsichtbare Beiträge. Schlechte Arbeitsbedingungen werden nicht zum persönlichen Einstellungsproblem erklärt.

### 13.3 Assistent für soziale Situationen am Arbeitsplatz

Gesprächsthemen, Dank und Grenzen werden vor einem Treffen vorbereitet. Firmengeheimnisse und Daten von Kolleginnen gehören nicht ungefiltert in ein Modell.

### 13.4 Generator für Nebenprojekt-Ideen

Fähigkeiten, Interessen, Zeit und erreichbare Kunden führen zu kleinen Experimenten. Ziel ist der erste bezahlte Nachweis, nicht schneller Reichtum.

### 13.5 Selbstvertrauen vor einem Vorstellungsgespräch

Fragen werden passend zur Stelle geübt und reale Stärken wiederholt. Struktur und konkrete Beispiele sind wichtiger als auswendig gelernte Musterantworten.

## 14. Wohnen und Raum

### 14.1 Designer für Wohnatmosphäre

Raumfoto, Budget und Gefühl ergeben Licht, Anordnung und kleine Handlungen. In Mietwohnungen kommen rückgängig machbare Änderungen zuerst.

### 14.2 Wohnung durch vier Jahreszeiten verändern

Textilien, Farben, Pflanzen und Aufbewahrung ändern sich in kleinen Schritten. Umstellen und Tauschen kommt vor Neukauf.

### 14.3 Kleine Räume besser nutzen

Laufwege und häufige Gegenstände führen zu Aufbewahrung und Mehrzweckzonen. Maße und sichere Durchgänge werden vor Vorschlägen geprüft.

### 14.4 Rituale zu Hause schaffen

Tee, Aufräumen oder Abendessen erhalten Musik, Licht und einen kurzen Ablauf. Das Ritual muss ohne große Vorbereitung wiederholbar sein.

### 14.5 Psychologische Begleitung beim Entrümpeln

Nutzen, Erinnerung und Pflegekosten helfen bei Behalten, Warten oder Spenden. Das Produkt drängt nicht zu schnellem Wegwerfen.

## 15. Essen und Kochen

### 15.1 Wohltuendes Essen für eine Person

Zutaten, Zeit und mögliche Abwäsche führen zu einer einfachen Mahlzeit. Alleinessen wird nicht als minderwertig dargestellt.

### 15.2 Atmosphäre für einen Festtagstisch

Personenzahl, Kultur, Budget und Raum bestimmen Menü, Anordnung und Vorbereitung. Allergien und Ernährungsgrenzen kommen zuerst.

### 15.3 Kochen passend zur Stimmung

Wärme, Frische oder schnelle Sättigung werden mit Zutaten und Methode verbunden. Essen wird nicht als einzige Regulation von Gefühlen dargestellt.

### 15.4 Kochanfängern Sicherheit geben

Jeweils eine Technik und ein robustes Rezept bauen Können auf. Feuer-, Messer- und Hygieneschritte sind gut sichtbar.

### 15.5 Stimmungsvolle Lebensmittelfotografie

Fensterlicht, Telleranordnung und Winkel werden einfach erklärt. Starke synthetische Veränderungen müssen kenntlich bleiben.

## 16. Kleidung und Stil

### 16.1 Outfit-Stimmungsboard für heute

Wetter, Termin, Gefühl und vorhandene Kleidung ergeben zwei oder drei Kombinationen. Weniger Entscheidungslast ist wichtiger als Neukauf.

### 16.2 Capsule-Wardrobe-Stylist

Wenige häufig getragene Stücke werden mit Kombination und Waschzyklus geplant. Minimalismus wird nicht gegen den echten Alltag erzwungen.

### 16.3 Reise zum eigenen Stil

Lieblingsoutfits und Tragegefühl zeigen wiederkehrende Linien, Farben und Materialien. Körper werden nicht bewertet; Komfort und Selbstvertrauen zählen.

### 16.4 Alte Kleidung neu kombinieren

Schichten, Accessoires und kleine Änderungen geben Vorhandenem neue Nutzung. Reparatur und lokale Änderungsschneiderei können Teil der Lösung sein.

### 16.5 Styling für besondere Anlässe

Dresscode, Weg, Wetter und eigene Ausdrucksweise führen zu einer Vorbereitung. Tatsächlicher Komfort steht über dem Blick anderer.

## Grundsätze für Consumer-Produkte

### 1. Von Funktion zu Gefühl

Notieren Sie nicht nur, was das Produkt kann, sondern welches Gefühl sich vorher und nachher verändert. Funktionen sind Mittel; das emotionale Versprechen braucht ein reales Ergebnis.

### 2. Drei Ebenen von Atmosphäre

Die erste Ebene sind Farbe, Klang und Bewegung; die zweite Ton und Rhythmus der Interaktion; die dritte Erinnerung und Ritual nach der Nutzung. Konsistenz wirkt stärker als Dekoration.

### 3. Die Kraft psychologischer Hinweise

Fortschritt, Wahl und kleine Abschlüsse können Verhalten unterstützen. Falsche Knappheit, Schuld, Angst und übertriebene Versprechen sind keine legitimen Mittel.

### 4. Dem Nutzer helfen, eine bessere Version seiner selbst zu werden

Ein gutes Consumer-Produkt erzeugt keine Abhängigkeit, sondern hilft verstehen, wählen und ausdrücken. Bearbeiten, Löschen, Exportieren und die Grenzen von AI gehören von Anfang an zum Entwurf.
