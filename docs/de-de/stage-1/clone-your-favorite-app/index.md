---
title: 'Aus einem Screenshot nachbauen: Erste Imitationsübung'
description: 'Verwandle einen Produkt-Screenshot in eine Webseite oder ein Minispiel, das sich wirklich öffnen und bedienen lässt.'
---

# Aus einem Screenshot nachbauen: Erste Imitationsübung

In der letzten Lektion haben wir die KI mit einem Satz um ein Programm gebeten. Diesmal beginnen wir mit etwas Sichtbarem: **Wähle einen Screenshot aus und lass die KI darauf aufbauend etwas erstellen.**

Das Bild zeigt Farben, Abstände, Schaltflächen und Anordnung bereits. Du entscheidest, welches interaktive Ergebnis daraus werden soll.

## 1. Ein kleines Ziel wählen

Für die erste Übung reicht ein Bildschirm: eine Produktseite, ein SaaS-Dashboard oder ein Minispiel mit einer einfachen Aktion. Bewahre das Originalbild auf, damit du es später mit dem Ergebnis vergleichen kannst.

## 2. Das erste Beispiel bauen

Im Unterricht haben wir diesen Framer-Bildschirm verwendet. Navigation, großer Titel, violette Landschaft und Bedienelemente sind auf einem Bild erkennbar.

![Framer-Bildschirm als Vorlage](../../../zh-cn/stage-1/clone-your-favorite-app/images/framer-official-interface.jpg)

_Quelle: [Framer Website Builder](https://www.framer.com/solutions/website-builder/)_

Erstelle einen leeren Ordner, öffne ihn in Trae und ziehe das Bild in den Chat. Schreibe:

```text
Erstelle eine Webseite, die diesem Bild ähnelt. Öffne sie, wenn sie fertig ist.
```

Warte, bis Trae die Dateien erstellt und startet. Dies ist das tatsächlich im Unterricht erzeugte Ergebnis:

![Aus der Vorlage erzeugte und gestartete Webseite](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-wishlabs.gif)

Lies noch nicht den gesamten Code. Prüfe zuerst, ob die Seite öffnet, der Hauptinhalt erscheint und die Struktur der Vorlage ähnelt.

Ist der Titel zu klein, ändere nur diesen Punkt:

```text
Mach den Titel in der Mitte etwas größer.
```

## 3. Mit dem eigenen Bild wiederholen

Öffne einen neuen leeren Ordner, füge deinen Screenshot hinzu und sage:

```text
Erstelle anhand dieses Bildes eine Webseite und öffne sie, wenn sie fertig ist.
```

Wenn du nur den Stil übernehmen möchtest:

```text
Nutze den Stil des Bildes, aber ersetze Namen und Inhalt.
```

Klicke in der ersten Version auf die Hauptaktion und verkleinere das Fenster, um das Layout zu prüfen.

## 4. Dashboard oder Spiel ausprobieren

Das Linear-Dashboard hat links eine Navigation und rechts Karten und Diagramme.

![Linear-Dashboard als Vorlage](../../../zh-cn/stage-1/clone-your-favorite-app/images/linear-official-dashboard.png)

_Quelle: [Linear Dashboards](https://linear.app/docs/dashboards)_

```text
Erstelle ein Dashboard wie dieses. Verwende vorerst Beispieldaten.
```

![Im Unterricht erzeugtes und getestetes Dashboard](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-linear-dashboard.gif)

Auch eine Minecraft-Szene kann als Ausgangspunkt dienen.

![Minecraft Creative Mode als Vorlage](../../../zh-cn/stage-1/clone-your-favorite-app/images/minecraft-official-creative-mode.png)

_Quelle: [Minecraft-Beispiel bei Microsoft Learn](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108)_

```text
Erstelle ein Blockspiel wie dieses. Die Figur soll laufen und Blöcke setzen können.
```

![Im Unterricht erzeugtes 2D-Blockspiel](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-block-game.gif)

Für eine Welt aus der Ich-Perspektive musst du „3D“ ausdrücklich nennen:

```text
Erstelle ein 3D-Blockspiel wie dieses. Ich möchte laufen, die Ansicht drehen und Blöcke setzen.
```

![Im Unterricht erzeugtes 3D-Blockspiel](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-3d-block-game.gif)

## 5. Jeweils nur ein Problem beheben

Die erste Version muss nicht perfekt sein. Beschreibe das sichtbarste Problem in einfachen Worten:

```text
Die obere Karte ist zu hoch. Mach sie niedriger.
```

```text
Diese Schaltfläche reagiert nicht. Bitte repariere sie.
```

Öffne und teste die Seite nach jeder Änderung erneut. Vermische nicht mehrere unabhängige Wünsche in einer Nachricht.

## 6. Vor der Abgabe prüfen

- die Seite öffnet auch nach dem Neuladen;
- andere erkennen, ob es eine Webseite, ein Dashboard oder ein Spiel ist;
- die wichtigste Schaltfläche oder Spielsteuerung funktioniert;
- Text und Bilder überlappen sich bei schmalem Fenster nicht stark.

Stelle zum Schluss Vorlage und Ergebnis nebeneinander und erkläre eine Änderung. Der Ablauf lautet: Bild wählen, der KI geben, erste Version anfordern und sichtbare Unterschiede einzeln verbessern.
