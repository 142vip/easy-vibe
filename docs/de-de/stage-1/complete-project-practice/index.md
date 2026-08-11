---
title: 'Vollständige Projektpraxis: Von der Idee zum fertigen Werk'
description: 'Nutze deinen KI-Prototyp von Anfang bis Ende, lass ihn von einer anderen Person ausprobieren und behebe die beobachteten Probleme.'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
import ProductFinishMap from '../../../zh-cn/stage-1/complete-project-practice/ProductFinishMap.vue'
import StageOneCompletion from '../../../zh-cn/stage-1/complete-project-practice/StageOneCompletion.vue'

const duration = 'Etwa <strong>2–3 Tage</strong>'
const relatedArticles =
  relatedArticlesMap['de-de/stage-1/complete-project-practice'] ?? []
</script>

# Vollständige Projektpraxis: Von der Idee zum fertigen Werk

<ProductJourney current="finish" />

## Darum geht es in diesem Kapitel

<ChapterIntroduction :duration="duration" :tags="['Vollständige Nutzung', 'Produkterlebnis', 'Nutzertest', 'Präsentation']" coreOutput="Ein KI-Produkt, das eine andere Person ohne Anleitung verwenden kann" expectedOutput="Eine mit echten Nutzern getestete und verbesserte Webanwendung">

In den vorherigen Kapiteln haben wir aus einer Idee einen bedienbaren Prototyp gebaut und die KI-Funktion auf der Seite zum Laufen gebracht.

Du weißt inzwischen, was du eingeben und wo du klicken musst. Eine Person, die die Seite zum ersten Mal öffnet, findet vielleicht nicht einmal den ersten Schritt. Wenn nach einem Klick nicht sofort etwas erscheint, hält sie die Seite womöglich für kaputt.

In diesem Kapitel fügen wir keine neue Funktion hinzu. Wir verwenden das Produkt von Anfang bis Ende, verbessern die Stellen, an denen Menschen hängen bleiben, und lassen es von einer anderen Person testen. Danach hast du ein Werk, das du guten Gewissens teilen kannst.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Selbst benutzen', description: 'Vom Start bis zum Ergebnis' },
      { title: 'Hindernisse beheben', description: 'Warten, Ergebnis und Fehler' },
      { title: 'Testen lassen', description: 'Erst beobachten, dann helfen' },
      { title: 'Vorbereiten und teilen', description: 'Das Werk verständlich machen' }
    ]" />
  </ClientOnly>
</div>

<ProductFinishMap />

## 1. Verwende dein Produkt einmal vollständig

Füge nicht vorschnell Anmeldung, Teamarbeit oder Daten-Dashboards hinzu. Öffne das aktuelle Produkt und benutze es wie ein neuer Nutzer – von der ersten Seite bis zum Ergebnis. Jeder Schritt, den du noch daneben erklären musst, ist eine Stelle für die nächste Verbesserung.

In unserem Arbeitsbereich für E-Commerce-Inhalte sieht ein vollständiger Ablauf ungefähr so aus:

> Ein E-Commerce-Mitarbeiter lädt ein Produktbild hoch, ergänzt die nötigen Angaben, erzeugt einen ersten Entwurf aus Bild und Text, prüft ihn und kopiert oder speichert ihn zur späteren Bearbeitung und Veröffentlichung.

Zunächst reicht es, diesen kurzen Weg gut umzusetzen. Anmeldung, Teamrechte und ein öffentlicher Start können warten, bis das Produkt sie wirklich braucht.

### 1.1 Gehe in der echten Nutzungsreihenfolge vor

Ignoriere zunächst Code und Komponenten. Folge den Handlungen eines Nutzers:

1. Die Seite öffnen und verstehen, wobei das Werkzeug hilft.
2. Ein Produktbild hochladen und notwendige Angaben wie Name und Material eintragen.
3. „Text erzeugen“ wählen und sehen, dass die Seite arbeitet.
4. Titel und Verkaufsargumente der KI prüfen und bei Bedarf bearbeiten oder neu erzeugen.
5. Das Ergebnis kopieren, herunterladen oder vorläufig speichern und die Aufgabe abschließen.

Frage dich am Ende: Würde jemand ohne mich weiterkommen? Teamverwaltung und komplexe Dashboards kannst du notieren, aber jetzt weglassen, wenn sie diesen Ablauf nicht unterstützen.

::: tip Wie groß sollte diese Version sein?
Wenn du die Aufgabe in einem Satz erklären kannst und die andere Person innerhalb weniger Minuten beginnt, ist der Umfang meist passend.
:::

### 1.2 Probiere es erneut mit einer leeren Seite

Nach längerer Entwicklung enthält die Seite oft Testdaten und ein altes Ergebnis. Man vergisst leicht, dass neue Nutzer nichts davon sehen. Öffne ein privates Fenster oder lösche lokale Daten und beginne erneut.

Teste nur drei Situationen:

1. **Leer öffnen:** Klicke ohne Eingaben und prüfe, ob die Seite fehlende Angaben erklärt.
2. **Normal erzeugen:** Lade ein Bild hoch, erzeuge Inhalt und prüfe die Warteanzeige sowie den nächsten Schritt nach dem Ergebnis.
3. **Einen Fehler auslösen:** Lade eine nicht unterstützte Datei hoch oder lass die Anfrage scheitern. Eingaben müssen erhalten bleiben und ein neuer Versuch möglich sein.

Notiere die Hindernisse. Im nächsten Abschnitt beheben wir sie.

Eine KI-IDE kann den Code untersuchen, ersetzt aber nicht die tatsächliche Bedienung:

```text
Ändere den Code noch nicht.

Prüfe das aktuelle Projekt anhand dieser Nutzeraufgabe:
Ein Produktbild hochladen, die nötigen Angaben eintragen,
Text erzeugen, das Ergebnis prüfen und kopieren oder speichern.

Nenne die beteiligten Seiten und Dateien
und die Stellen, an denen der Ablauf derzeit abbrechen könnte.
```

Die KI-IDE kann verdächtigen Code finden. Ob die Seite verständlich ist, weißt du erst nach dem eigenen Test.

## 2. Behebe die Stellen, an denen Nutzer häufig hängen bleiben

Nach einem vollständigen Durchlauf erscheinen Probleme meistens zu vier Zeitpunkten: beim ersten Öffnen, während des Wartens, nach dem Ergebnis und bei einer fehlgeschlagenen Anfrage. Eine komplizierte Gestaltung ist nicht nötig. Die Person muss nur wissen, was geschieht und was sie als Nächstes tun kann.

### 2.1 Ist die erste Handlung klar?

Eine leere Seite sollte nicht nur aus einem Eingabefeld bestehen. Ergänze eine kurze Erklärung, ein Beispiel oder einen Hinweis zu unterstützten Bildformaten und Dateigrößen in der Nähe des Uploads.

Hat das Formular viele Felder, behalte nur die für ein gutes Ergebnis nötigen Angaben. Produktname, Bild und Hauptmerkmale können Pflicht sein; Marke, Referenzlink und genaue Stileinstellungen gehören unter „Weitere Einstellungen“. Neue Nutzer sollten nicht erst ein langes Formular ausfüllen müssen.

### 2.2 Reagiert die Seite nach dem Klick?

Eine KI-Anfrage kann mehrere Sekunden dauern. Nach dem Klick sollte der Button „Wird erzeugt“ anzeigen und weitere Klicks vorübergehend verhindern. Eingaben dürfen nicht plötzlich verschwinden und die Seite sollte nicht zu einem leeren Ergebnis springen.

![Wartezustand während der Erzeugung von Produktinhalten](../../../zh-cn/stage-1/building-prototype/images/index-2026-01-14-15-50-05.png)

*Ein Wartezustand braucht keine aufwendige Animation. Zeige, dass die Arbeit begonnen hat, und erhalte Eingaben und Seitenposition – das verhindert bereits die meiste Verwirrung.*

Bei Bild- oder Videoaufträgen mit Warteschlange kannst du „In Warteschlange“ und „Wird erzeugt“ anzeigen. Erfinde keinen genauen Prozentwert, wenn die API keinen Fortschritt liefert.

### 2.3 Was kann man nach dem Ergebnis tun?

Die KI-Antwort ist nicht das Ende des Ablaufs. Nutzer prüfen Fakten, ändern Formulierungen und übernehmen das Ergebnis in den nächsten Arbeitsschritt. Der Ergebnisbereich braucht daher mindestens eine Aktion: Bearbeiten, Kopieren, Herunterladen oder Neu erzeugen.

![Ergebnisseite nach der Verbindung von Bilderkennung und Texterzeugung](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-35-41.png)

*Das hochgeladene Bild bleibt über dem Ergebnis sichtbar. Nutzer können den Text mit dem Original vergleichen, statt nur eine Modellantwort anzunehmen.*

Kann das Modell eine Angabe nicht bestätigen, markiere sie, damit die Person sie ergänzt oder entfernt. Das passt besser zur echten Arbeit als ein Absatz, der als „endgültige Antwort“ erscheint.

### 2.4 Kann man nach einem Fehler fortfahren?

Netzwerkunterbrechung, verbrauchtes Kontingent oder ein ungeeignetes Dateiformat können eine Anfrage scheitern lassen. Der vollständige technische Fehler ist für normale Nutzer unnötig; die Seite muss aber sagen, dass der Vorgang nicht abgeschlossen wurde, und einen neuen Versuch oder eine Änderung erlauben.

Zum Beispiel:

- **Nicht unterstütztes Bildformat:** Unterstützte Formate nennen und neue Auswahl erlauben.
- **Pflichtangabe fehlt:** Hinweis am zugehörigen Feld statt nur „Ungültige Parameter“.
- **KI-Dienst vorübergehend nicht verfügbar:** Eingaben erhalten und „Erneut erzeugen“ anbieten.
- **Ergebnis ungeeignet:** Eingabe anpassen und erneut versuchen, ohne von vorn zu beginnen.

Wenn eine Aktualisierung ein langes Formular löschen würde, kannst du den Entwurf vorübergehend in LocalStorage speichern. Speichere nur gewöhnliche Daten zum Fortsetzen, niemals API Key, echte Kundendaten oder sensible Dateien im Browser.

Übergib die gefundenen Probleme mit einer konzentrierten Anfrage an die KI-IDE:

```text
Prüfe den Ablauf „Produktbild hochladen und Text erzeugen“
zu vier Zeitpunkten: Start, Warten, Erfolg und Fehler.

Behebe zuerst Probleme, die das Fortsetzen verhindern:
- Pflichtfelder haben keinen klaren Hinweis;
- der Button kann während der Anfrage mehrfach geklickt werden;
- nach einem Fehler verschwinden Eingaben;
- im Ergebnis fehlen Bearbeiten, Kopieren und Neu erzeugen.

Nenne vor der Änderung die betroffenen Dateien.
Gib nach Abschluss Schritte für einen manuellen Test an.
```

## 3. Lass das Produkt von einer anderen Person benutzen

Wenn du deine eigene Seite lange ansiehst, wirken alle Schritte selbstverständlich. Eine Person, die nicht an der Entwicklung beteiligt war, findet oft innerhalb weniger Minuten übersehene Probleme.

Wähle möglichst jemanden, der das Werkzeug wirklich verwenden würde. Für unser Beispiel eignet sich eine Person mit Erfahrung in Shopbetrieb oder Produktinhalten. Wenn du niemanden findest, hilft auch ein Freund, der die Seite noch nie gesehen hat.

### 3.1 Nenne nur die Aufgabe

Erkläre zu Beginn nur das Ziel:

> Erzeuge mit diesem Werkzeug aus dem Produktbild einen Titel und Verkaufsargumente. Prüfe den Inhalt und kopiere die Version, die du weiterbearbeiten würdest.

Beobachte zuerst und sage nicht sofort, wo geklickt werden muss. Notiere Pausen, Rücksprünge, wiederholte Klicks und Fragen. Eine sofortige Erklärung verdeckt ein Problem, das die Seite selbst lösen sollte.

Schon ein oder zwei Personen entdecken viele offensichtliche Schwierigkeiten. Ein formaler Bericht ist unnötig; notiere einfach, wo sie anhielten.

Wenn nach dem Öffnen nichts geschieht, ergänze eine kurze Zweckbeschreibung. Bei wiederholtem „Erzeugen“ machst du die Warteanzeige deutlicher. Wenn nach dem Ergebnis unklar ist, was folgt, ergänzt du Bearbeiten oder Kopieren. Wenn nach einem Fehler alles neu eingetragen werden muss, bewahrst du die Daten und bietest einen neuen Versuch an.

### 3.2 Sprich nach dem Test

Wenn die Person die Aufgabe beendet oder aufgegeben hat, frage:

1. Welcher Schritt war am unsichersten?
2. Welche Teile des Ergebnisses würdest du direkt verwenden und welche immer ändern?
3. Würdest du das Werkzeug bei derselben Aufgabe erneut nutzen? Warum?

Frage nicht nur „War es einfach?“. Ein höfliches „War gut“ hilft wenig. Konkrete Handlungen und Beispiele sind wertvoller.

::: warning Bei echten Materialien
Produktbilder, Aufnahmen oder Dokumente einer Testperson können echte Geschäftsdaten enthalten. Erkläre vorab, an welche Art KI-Dienst sie gesendet werden, nutze keine nicht freigegebenen Kundendaten und lösche anschließend nicht mehr benötigte Dateien.
:::

## 4. Behebe die Blockade und teste erneut

Der Test kann eine lange Problemliste erzeugen. Du musst nicht alles beheben. Beginne mit Punkten, die den Abschluss verhindern oder das Ergebnis unglaubwürdig machen.

Nutze diese Reihenfolge:

1. **Aufgabe kann nicht beendet werden:** Button defekt, Anfrage fehlgeschlagen oder Ergebnis nicht weiterverwendbar.
2. **Ergebnis offensichtlich unglaubwürdig:** erfundene Angaben, keine Prüfung oder fehlende Quellen.
3. **Bedienung leicht missverständlich:** Startpunkt oder aktueller Zustand unklar.
4. **Aufwand zu hoch:** Schritte wiederholen sich, Eingaben verschwinden oder Warten bleibt ohne Rückmeldung.
5. **Stil und neue Funktionen:** Gestaltung und Wünsche, die die Kernaufgabe nicht blockieren.

Wähle die wichtigsten ein bis drei Punkte. Teste danach erneut. Wenn möglich, lade dieselbe Person wieder ein. Eine Änderung hilft erst, wenn das ursprüngliche Hindernis wirklich verschwunden ist.

### 4.1 Teile der KI-IDE eine konkrete Beobachtung mit

Sage nicht nur „Optimiere die Seite“. Beschreibe, was du gesehen hast:

```text
Nutzeraufgabe: ein Produktbild hochladen und drei Verkaufsargumente erzeugen.

Beobachtetes Problem:
Zwei Testpersonen klickten mehrfach auf „Erzeugen“, weil die Seite
nicht deutlich zeigte, dass die Anfrage begonnen hatte.
Dadurch entstanden doppelte Aufträge.

Ändere die aktuelle Seite:
1. Deaktiviere den Button nach dem Start und zeige „Wird erzeugt“.
2. Stelle ihn nach Erfolg oder Fehler wieder her.
3. Lösche bereits eingegebene Informationen nicht.
4. Erkläre den manuellen Test für Mehrfachklicks und Fehler.
```

Eine genaue Anfrage vermeidet unpassende Änderungen und zeigt dir, was du anschließend prüfen musst.

### 4.2 Teste danach erneut von Anfang an

Die Korrektur an einer Stelle kann eine andere beeinflussen. Probiere vor dem Teilen vier Situationen:

- eine normale Eingabe mit allen Informationen;
- ein fehlendes Pflichtfeld;
- eine fehlgeschlagene oder abgelaufene API-Anfrage;
- Bearbeiten, Kopieren oder Neu erzeugen nach dem Ergebnis.

Speichert das Produkt Entwürfe, aktualisiere auch die Seite. Prüfe die neue Funktion und stelle sicher, dass der ursprüngliche Kernablauf nicht beschädigt wurde.

## 5. Bereite das Werk zum Teilen vor

Das Werk „läuft“ nun nicht nur auf deinem Computer. Eine andere Person hat es benutzt und du hast ein echtes Problem verbessert. Bereite Zugang und Erklärung vor, damit mehr Menschen es verstehen.

### 5.1 Erkläre es in einer Minute

Gehe in dieser Reihenfolge vor:

1. **Wer hat welches Problem:** E-Commerce-Mitarbeiter ordnen für jeden ersten Entwurf erneut Bilder und Verkaufsargumente.
2. **Wie hilft das Produkt:** Bild und Angaben hochladen und einen weiter bearbeitbaren Entwurf erhalten.
3. **Welche KI-Fähigkeiten nutzt es:** Bildverständnis und Texterzeugung.
4. **Wie endet die Aufgabe:** Hochladen, Erzeugen, Prüfen, Bearbeiten und Kopieren.
5. **Was änderte sich nach dem Test:** etwa sichtbares Warten und erhaltene Eingaben nach einem Fehler.

Lass andere zuerst das Produkt verstehen, bevor du Frameworks und Modellnamen aufzählst.

### 5.2 Bereite alles Nötige vor

Stelle vor dem Teilen drei Dinge bereit:

1. **Eine ausführbare Anwendung:** Gib einen Link an; ohne Deployment erklärst du Startbefehl und Adresse.
2. **Ein 30–60 Sekunden langes Demo-Video:** Zeige die Kernaufgabe von der Eingabe bis zum Ergebnis, nicht nur schnelle Seitenwechsel.
3. **Eine einseitige Beschreibung:** Zielgruppe, Problem, Ablauf, KI-Fähigkeit, eine echte Rückmeldung und die daraus entstandene Änderung.

Ist Fernzugriff noch nicht möglich, reichen lokale Ausführung und Demo-Video als Stage-1-Ergebnis. Wichtig ist, dass jemand das Werk versteht und den vollständigen Kernablauf sieht.

### 5.3 Dieses Werk fortsetzen oder ein neues beginnen?

Du kannst den E-Commerce-Arbeitsbereich weiterführen oder denselben Prozess für Besprechungen, Audioinhalte, Lernhilfe oder ein Branchenwerkzeug nutzen. Der [Leitfaden zu KI-Anwendungsszenarien](../appendix-industry-scenarios/index.md) hilft bei der Suche.

Wechsle nicht nur aus dem Wunsch nach Originalität zu einem fremden Thema. Ein kleines Problem aus Studium, Arbeit oder Alltag, das echte Menschen getestet haben, überzeugt mehr als eine funktionsreiche Seite, die niemand benutzt hat.

### Vor dem Versenden

Öffne den Link ein letztes Mal und schließe den Ablauf ab. Prüfe, dass andere ihn öffnen können, die KI ein Ergebnis zurückgibt und weder Seite noch Screenshots einen API Key zeigen. Kläre bei fremden Bildern, Tönen oder Dokumenten auch die Nutzungserlaubnis.

## 6. 📚 Aufgabe

<StageAssignmentCard title="Schließe dein Stage-1-Werk ab und veröffentliche es">

  <p>Füge keine neue Funktion hinzu. Bereite das aktuelle Werk vor und gib es wirklich einer Person zum Testen.</p>

  <ol>
    <li>
      <strong>Einmal vollständig benutzen</strong>
      <ul>
        <li>Mit dem Öffnen beginnen und bis zum Erhalten, Bearbeiten oder Speichern des Ergebnisses fortfahren.</li>
      </ul>
    </li>
    <li>
      <strong>Eine Person testen lassen</strong>
      <ul>
        <li>Die Oberfläche nicht zuerst erklären, den Stillstand beobachten und ein Problem beheben.</li>
      </ul>
    </li>
    <li>
      <strong>Das Werk teilen</strong>
      <ul>
        <li>Link oder Startanleitung, ein 30–60-Sekunden-Video und eine kurze Einführung vorbereiten.</li>
      </ul>
    </li>
  </ol>

  <p>Stage 1 ist wirklich abgeschlossen, wenn eine andere Person das Werk öffnen und einen Durchlauf ohne Hilfe beenden kann.</p>
</StageAssignmentCard>

## Nächster Schritt

Du hast nun einen vollständigen Weg zurückgelegt: von einem echten Problem über eine begrenzte erste Version und einen interaktiven Prototyp bis zur KI-Integration, einem Nutzertest und einer Verbesserung.

In Stage 2 lernen wir Datenbanken, Konten, Zahlungen, Deployment sowie vollständigere Frontend- und Backend-Entwicklung. Damit kann das Produkt mehr Nutzer und echte Daten bedienen. Der Ausgangspunkt bleibt jedoch gleich: zuerst eine wertvolle Nutzeraufgabe vollständig lösen.

<RelatedArticlesSection
  title="Weiterlernen"
  description="Nach Stage 1 kannst du mit den folgenden Engineering-Themen fortfahren."
  :items="relatedArticles"
/>

<StageOneCompletion />
