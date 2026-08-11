---
title: 'Von einem Screenshot nachbauen: deine erste Nachbauübung'
description: 'Folge dem Unterricht Schritt für Schritt und verwandle einen Produkt-Screenshot in eine Webseite oder ein Minispiel, das sich öffnen und bedienen lässt.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'

const duration = 'Etwa <strong>2 Stunden</strong>'
</script>

# Von einem Screenshot nachbauen: deine erste Nachbauübung

In der vorherigen Lektion haben wir die KI gebeten, aus einem Satz ein Programm zu schreiben. Diesmal beginnen wir mit etwas, das leichter zu beurteilen ist: <strong>Wähle einen Screenshot, der dir gefällt, und lass die KI darauf aufbauen.</strong>

Das ähnelt dem Bauen mit Bausteinen nach einem Bild. Du musst nicht jede Farbe, jeden Abstand und jede Buttonposition im Voraus beschreiben – der Screenshot vermittelt bereits viele dieser Informationen.

<div style="text-align: center;">
<div style="display: inline-block; padding: 8px 20px; border-radius: 8px; border: 1px dashed #FFB6C1; background: linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%); margin: 12px 0;">
  <span style="font-size: 15px; font-weight: 500; color: #666;">Erst nachbauen, dann Schritt für Schritt dein eigenes Werk daraus machen 🧱</span>
</div>
</div>

## Worum es in dieser Lektion geht

<ChapterIntroduction :duration="duration" :tags="['Screenshot nachbauen', 'Programmieren mit KI', 'Übung für Einsteiger']" coreOutput="Ein kleines Projekt" expectedOutput="Eine Webseite oder ein Minispiel, das sich öffnen und bedienen lässt">

Wir beginnen mit einem Screenshot aus einem echten Produkt und erstellen daraus ein kleines Projekt für den Browser. Du kannst eine Produkt-Startseite, ein Daten-Dashboard oder ein einfaches Spiel wählen.

In dieser Lektion übst du vor allem eines: <strong>Finde einen Screenshot, der dir gefällt, gib ihn der KI und erkläre mit deinen eigenen Worten, was du bauen möchtest.</strong>

Du musst weder programmieren können noch ein vollständiges Pflichtenheft vorbereiten. Lass die KI eine erste Version erstellen, schau sie dir an und beschreibe dann, was geändert werden soll.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Bild wählen', description: 'Finde eine Seite, die dir gefällt' },
      { title: 'Der KI geben', description: 'Ziehe es in den Chat' },
      { title: 'Einen Satz schreiben', description: 'Bitte die KI um den Nachbau' },
      { title: 'Weiter verbessern', description: 'Korrigiere jeweils einen Unterschied' }
    ]" />
  </ClientOnly>
</div>

## 1. Wähle aus, was du bauen möchtest

Bevor du das Werkzeug öffnest, entscheide dich für ein kleines Ergebnis, das du heute erreichen willst.

Das Ziel ist kein vollständiges Produkt mit allen Funktionen. Es reicht <strong>eine Seite, die sich öffnet, verständlich ist und eine einfache Interaktion besitzt</strong>. Mit einem kleinen Umfang gelingt der erste Versuch leichter.

Wähle eine dieser Möglichkeiten:

- <strong>Produkt-Startseite:</strong> Überschrift, Einführung, Bild und Button.
- <strong>SaaS-Dashboard:</strong> Seitenleiste, Datenkarten und Diagramme.
- <strong>Einfaches Spiel:</strong> Bewegung, Klick oder ein kleines Ziel.

Prüfe bei der Auswahl der Vorlage drei Dinge:

1. Lässt sich der Hauptinhalt auf einem Screenshot verstehen?
2. Gibt es auf der Seite etwas, das dir wirklich gefällt?
3. Kannst du nach dem Bauen schnell erkennen, ob das Ergebnis ähnlich aussieht?

Wenn dir die große Überschrift und die Farben einer Startseite gefallen, nimm den ersten sichtbaren Bereich auf. Wenn du die Blockwelt eines Spiels magst, speichere ein Bild, auf dem sie klar zu erkennen ist.

::: tip Wie ähnlich soll es werden?
Je näher das Ergebnis kommt, desto genauer hast du die Gestaltung beobachtet und desto besser kannst du Unterschiede gegenüber der KI beschreiben. Stelle am Ende Vorlage und Ergebnis nebeneinander: Wirken sie zu 50, 70 oder 90 Prozent ähnlich?
:::

::: tip Baue nur eine Seite
Beginne nicht gleichzeitig mit Anmeldung, Bezahlung, Chat, Verwaltung und einer mobilen App. In dieser Lektion baust du nur den einen Bildschirm vor dir nach.
:::

## 2. Baue mit der Lehrkraft eine Webseite

Sieh dir zuerst den vollständigen Ablauf an. Sobald er verständlich ist, wiederholst du ihn mit deinem eigenen Screenshot.

Die Lehrkraft hat einen leeren Ordner erstellt und in Trae geöffnet. Das Projekt hieß `trae-screenshot-demo`; anfangs enthielt es weder Webseite noch Code.

### 2.1 Gib Trae das Referenzbild

Die Vorlage stammt von einer Framer-Beispielseite. Große Überschrift, Navigation, violette Berglandschaft und kleine Bedienelemente sind gut erkennbar.

![Der in Trae eingefügte Webseiten-Screenshot](../../../zh-cn/stage-1/clone-your-favorite-app/images/framer-official-interface.jpg)

_Quelle des Screenshots: [Framer Website Builder](https://www.framer.com/solutions/website-builder/)_

Nachdem das Bild in den Trae-Chat gezogen wurde, gab die Lehrkraft eine sehr kurze Anweisung:

```text
Baue eine Webseite, die wie dieses Bild aussieht. Öffne sie für mich, sobald sie fertig ist.
```

Das Bild zeigt Trae ungefähr, wie die Seite aussehen soll; der Satz macht deutlich, dass daraus eine Webseite werden soll.

Warte nach dem Absenden, bis Trae die Dateien erstellt hat. Schicke nicht schon weitere Anweisungen, bevor die erste abgeschlossen ist.

### 2.2 Betrachte die erste Version

Trae erstellte `index.html`, `styles.css` und `script.js` und öffnete die Webseite anschließend im Browser. Diese Animation zeigt das Ergebnis aus dem Unterricht:

![Aus dem Screenshot erzeugte und gestartete Wishlabs-Seite](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-wishlabs.gif)

Lies den Code noch nicht. Sieh dir die Seite an und vergleiche sie mit der Vorlage:

- Die Stimmung mit violettem Himmel und Bergen ist erhalten.
- Eine große Überschrift steht weiterhin in der Mitte.
- Oben gibt es eine Navigation, unten eine Reihe von Bedienelementen.
- Text, Buttons und Bilder ergeben einen vollständigen ersten Bildschirm.

Es ist keine exakte Kopie, aber die auffälligste Struktur und Stimmung sind vorhanden. Das ist eine gute erste Version.

### 2.3 Die erste Version muss zunächst nur sichtbar sein

Wirf nicht alles weg, nur weil Schriftart oder Buttonposition etwas abweichen. Prüfe zuerst, ob sich die Seite öffnet, und wähle dann das deutlichste Problem.

Ist die Überschrift zu klein, sage:

```text
Vergrößere die Überschrift in der Mitte.
```

Öffne die Seite nach der Änderung erneut. Wenn sie deiner Vorstellung näher kommt, war die Überarbeitung sinnvoll.

::: tip Normale Sprache reicht aus
Du baust gemeinsam mit Trae etwas auf und schreibst keine Prüfung über Prompts. Beschreibe einfach mit deinen üblichen Worten, was du siehst.
:::

## 3. Probiere es mit deinem eigenen Bild

Öffne Trae, erstelle einen leeren Ordner und öffne ihn im Editor. Ein einfacher Name wie `my-first-page` reicht aus.

Gehe dann so vor:

1. Finde einen Screenshot einer Webseite oder eines Spiels, der dir gefällt.
2. Wähle über die Bildschaltfläche neben dem Chat den Screenshot aus.
3. Prüfe, ob das Bild in der Nachricht angezeigt wird.
4. Schreibe eine kurze Bitte und sende sie ab.

```text
Baue eine Webseite, die wie dieses Bild aussieht.
Öffne sie für mich, sobald sie fertig ist.
```

Für die erste Übung musst du kein Framework, keine Ordnerstruktur und keine Dateinamen festlegen. Lass Trae diese Entscheidungen treffen.

Wenn du nur den Stil übernehmen möchtest, aber nicht Namen und Texte, ergänze:

```text
Nutze den Stil dieses Bildes, aber ersetze Namen und Inhalte durch etwas Neues.
```

Warte, bis Trae fertig ist. Wenn Trae um Erlaubnis zum Erstellen von Dateien oder Starten des Projekts bittet, bestätige sie. Falls die Seite nicht automatisch erscheint, sage:

```text
Starte dieses Projekt. Ich möchte das Ergebnis sehen.
```

Wenn die Seite erscheint, prüfe kurz, ob sie sich öffnet, ob der Hauptinhalt vorhanden ist und ob der wichtigste Button reagiert. Ändere nicht gleich fünf Dinge auf einmal.

## 4. Dieselbe Methode funktioniert bei anderen Produkten

Die Screenshot-Methode eignet sich nicht nur für Produkt-Startseiten. Zum Vergleich hat die Lehrkraft zwei weitere leere Projekte erstellt: ein Daten-Dashboard und ein Blockspiel.

### Beispiel 1: SaaS-Dashboard

SaaS-Produkte zeigen Projektfortschritt, Verkäufe oder Nutzerdaten häufig in Dashboards. Bei diesem Linear-Screenshot liegt die Navigation links und der Inhalt rechts.

![Offizielle Oberfläche des Linear-Dashboards](../../../zh-cn/stage-1/clone-your-favorite-app/images/linear-official-dashboard.png)

_Unterrichtsreferenz: [Linear Dashboards](https://linear.app/docs/dashboards)_

Die Lehrkraft fügte das Bild in Trae ein und schrieb:

```text
Baue ein Daten-Dashboard wie dieses.
Verwende zunächst Beispieldaten.
```

Trae erzeugte eine Seitenleiste, Datenkarten und Diagramme. So sah die laufende Seite im Browser aus:

![Aus dem Screenshot erzeugtes und getestetes Dashboard](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-linear-dashboard.gif)

Die Zahlen sind noch keine echten Geschäftsdaten – das ist in Ordnung. In der ersten Übung geht es um die Struktur. Beschriftungen und Werte ersetzt du erst, wenn die Seite stabil läuft.

### Beispiel 2: Blockspiel

Wenn dich eine gewöhnliche Webseite nicht anspricht, verwende einen Spiel-Screenshot. Die Lehrkraft wählte ein Bild aus der Blockwelt von Minecraft.

![Oberfläche des Kreativmodus in Minecraft](../../../zh-cn/stage-1/clone-your-favorite-app/images/minecraft-official-creative-mode.png)

_Unterrichtsreferenz: [Minecraft-Beispiel bei Microsoft Learn](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108)_

Auch diese Anweisung war kurz:

```text
Baue ein Blockspiel wie dieses.
Die Figur soll sich bewegen und Blöcke setzen können.
```

Trae erstellte ein spielbares Browsergame, in dem sich die Figur bewegen sowie Blöcke setzen und entfernen kann:

![Aus dem Screenshot erzeugtes und gestartetes 2D-Blockspiel](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-block-game.gif)

Dieses Ergebnis ist ein <strong>2D-Spiel in Seitenansicht</strong>. Die Figur bewegt sich auf einer flachen Ebene; vorwärts und rückwärts in die Tiefe gibt es nicht. Weil die Anweisung nur „Blockspiel“ sagte, wählte Trae die einfachere Auslegung.

Öffne die Seite, drücke die Pfeiltasten und klicke in die Szene. Wenn sich die Figur bewegt und sich Blöcke setzen lassen, funktioniert die erste 2D-Version.

### Erstelle noch eine 3D-Version

Wenn du eine Minecraft-ähnliche Ich-Perspektive möchtest, schreibe ausdrücklich „3D“ in die Anweisung. Die Lehrkraft öffnete ein neues leeres Projekt, fügte denselben Screenshot hinzu und sagte:

```text
Baue ein 3D-Blockspiel wie dieses.
Der Spieler soll laufen, die Kamera drehen und Blöcke setzen können.
```

Diesmal erzeugte Trae eine echte dreidimensionale Blockwelt:

![Aus dem Screenshot erzeugtes und gestartetes 3D-Blockspiel](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-3d-block-game.gif)

Wähle „Start Game“, bewege dich mit `WASD` und drehe dich mit der Maus. Die linke Maustaste entfernt einen Block, die rechte setzt einen; mit den Zahlentasten wechselst du den Blocktyp.

Weder 2D noch 3D ist grundsätzlich besser. Für ein erstes Spiel ist 2D einfacher. Wenn das Vor- und Zurückgehen im Raum für deine Idee wichtig ist, sage deutlich, dass du 3D möchtest.

::: tip Mach etwas Eigenes daraus
Die Vorlage ist nur der Ausgangspunkt. Ändere Farben, Thema, Texte, Bilder oder Interaktion, damit das Ergebnis Schritt für Schritt zu deinem eigenen Werk wird.
:::

## 5. Was tun, wenn die erste Version nicht gut aussieht?

Es ist normal, dass die erste Version anders wirkt oder ein Button nicht reagiert. Ein Projekt ist selten nach einem Satz fertig. Anschauen, ein wenig ändern und erneut anschauen gehört dazu.

Ein typischer Anfängerfehler ist, alle Probleme in eine Nachricht zu packen. Wenn zu viele Dinge gleichzeitig geändert werden, lässt sich nicht erkennen, welche Änderung das Ergebnis verursacht hat.

Nutze eine einfache Regel: <strong>Wähle in jeder Runde das deutlichste Problem.</strong>

### Die Seite sieht falsch aus

Ist eine Karte zu hoch:

```text
Die Karte oben ist zu hoch. Mache sie niedriger.
```

Ist das Hauptbild zu klein:

```text
Das Bild in der Mitte ist zu klein. Vergrößere es.
```

Ist der Hintergrund zu dunkel:

```text
Der Hintergrund ist zu dunkel. Verwende eine hellere Farbe.
```

### Die Seite verhält sich falsch

Wenn ein Button nichts tut:

```text
Dieser Button reagiert nicht auf einen Klick. Bitte repariere ihn.
```

Wenn sich die Spielfigur nicht bewegt:

```text
Die Pfeiltasten bewirken nichts. Bitte repariere die Bewegung.
```

### Du kannst das Problem nicht beschreiben

Mach einen Screenshot der aktuellen Seite und sage:

```text
Das ist der aktuelle Stand. Vergleiche ihn mit der Vorlage und korrigiere den größten Unterschied.
```

Begriffe wie „Margin“ oder „responsives Layout“ musst du nicht kennen. „Es wirkt zu voll“, „der Text ist schwer lesbar“ und „auf dem Handy sieht es unordentlich aus“ sind hilfreiche Beschreibungen. Löse ein Problem und gehe danach zum nächsten.

## 6. Kontrolle im Unterricht

Betrachte nicht nur ein Standbild. Öffne das Ergebnis und klicke oder spiele selbst.

Prüfe vier Punkte:

- <strong>Es öffnet sich:</strong> Nach dem Aktualisieren erscheint keine leere Seite oder Fehlermeldung.
- <strong>Es ist verständlich:</strong> Eine andere Person erkennt, ob es eine Startseite, ein Dashboard oder ein Spiel ist.
- <strong>Es reagiert:</strong> Der Hauptbutton oder die grundlegende Spielsteuerung funktioniert.
- <strong>Es bleibt lesbar:</strong> Beim Verkleinern des Fensters überlappen Text und Bilder nicht stark.

Wenn ein Punkt fehlschlägt, teile Trae genau mit, was du beobachtet hast, und lass nur dieses Problem beheben. Sobald alle vier Punkte stimmen, ist die Übung abgeschlossen.

::: tip Stelle ein kleines Werk fertig
Anmeldung, Bezahlung, Gruppenchat und Mehrspielermodus gehören heute nicht dazu. Eine fertige kleine Seite ist mehr wert als zehn unvollendete Anfänge.
:::

## 📚 Aufgabe

<StageAssignmentCard title="Baue deine eigene Seite aus einem Screenshot">

  <p>Wähle das Bild einer Webseite oder eines Spiels, gib es der KI und baue nur einen Bildschirm nach.</p>

  <ol>
    <li>Bewahre den Referenz-Screenshot auf.</li>
    <li>Erzeuge die Seite und verbessere eine Stelle, die dir nicht gefällt.</li>
    <li>Speichere einen Screenshot des überarbeiteten Ergebnisses.</li>
  </ol>

  <p>Stelle bei der Präsentation Vorlage und eigenes Werk nebeneinander und erkläre eine Änderung, um die du gebeten hast.</p>
</StageAssignmentCard>

## Das solltest du behalten

Wir haben nicht mit Code begonnen, sondern mit einem Screenshot. Die ganze Übung besteht aus vier Schritten:

1. Nimm einen Screenshot auf oder speichere ihn.
2. Gib ihn der KI.
3. Beschreibe das Werk in einem Satz.
4. Korrigiere jeweils einen sichtbaren Unterschied.

Das Bild zeigt der KI, wie das Produkt aussehen soll. Deine Worte erklären, was es tun soll. Sobald die erste Version erscheint, helfen dir Klicken, Beobachten und neue Screenshots dabei, die nächste Änderung zu beschreiben.

Ein Prompt muss nicht wie ein technisches Handbuch klingen. Bitte um eine einfache Sache, bring das Werk zum Laufen und setze das Gespräch mit dem sichtbaren Ergebnis fort. Ein eigenes Projekt zu bauen wird sich dadurch schon viel näher anfühlen.
