# Datenvisualisierung: Designprinzipien

::: tip Vorwort
**Ein gutes Diagramm sagt mehr als tausend Datenzeilen.** Datenvisualisierung verwandelt abstrakte Zahlen in intuitive visuelle Darstellungen, die es ermöglichen, die Geschichte hinter den Daten in wenigen Sekunden zu verstehen. Von Excel-Diagrammen bis hin zu Grafana-Überwachungs-Dashboards — Visualisierung ist allgegenwärtig.
:::

**Was wirst du in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels wirst du Folgendes können:

- **Diagrammauswahl**: Den geeignetsten Diagrammtyp basierend auf dem Zweck der Daten wählen
- **Visualisierungsprinzipien**: Die Kernprinzipien des Visualisierungsdesigns beherrschen
- **Dashboard-Design**: Verschiedene Layoutmuster für unterschiedliche Dashboard-Typen verstehen
- **Tool-Ökosystem**: Die Positionierung und Auswahl gängiger Visualisierungstools kennenlernen
- **Häufige Fallen**: Irreführende Diagramme und typische Visualisierungsfehler vermeiden

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | Diagrammtypauswahl | Vergleich, Trend, Anteil, Verteilung, Beziehung |
| **Kapitel 2** | Visualisierungsdesignprinzipien | Data-Ink-Ratio, Konsistenz, Lesbarkeit |
| **Kapitel 3** | Dashboard-Layout | Übersichtstyp, Vergleichstyp, Drilldown-Typ, Echtzeit-Typ |
| **Kapitel 4** | Tool-Auswahl | ECharts, D3, Grafana, Metabase |
| **Kapitel 5** | Häufige Fallen | Abgeschnittene Achsen, 3D-Kreisdiagramme, Farbführen |

---

## 0. Überblick: Notwendigkeit der Visualisierung

Das menschliche Gehirn verarbeitet visuelle Informationen viel schneller als Text. Ein Liniendiagramm lässt dich sofort erkennen, dass „die Verkäufe im letzten Monat zurückgegangen sind", während du bei derselben Information in Tabellenform Zeile für Zeile vergleichen müsstest, um zu demselben Schluss zu kommen.

Der Kernwert der Visualisierung:

- **Muster erkennen**: Trends, Zyklen und Ausreißer sind in Diagrammen auf einen Blick erkennbar
- **Entscheidungsfindung unterstützen**: Auch Nicht-Techniker können Daten verstehen und an Entscheidungen teilnehmen
- **Kommunikationseffizienz**: Ein Bild sagt mehr als tausend Worte und reduziert Mehrdeutigkeiten bei der Dateninterpretation

::: tip Visualisierung ≠ schön aussehen
Das Ziel der Visualisierung ist es, **Informationen zu vermitteln**, nicht zu beeindrucken. Ein schlichtes, aber genaues Balkendiagramm ist weitaus wertvoller als ein auffälliges, aber schwer verständliches 3D-Diagramm.
:::

---

## 1. Diagrammtypauswahl: Das richtige Diagramm für die richtige Geschichte

Der erste Schritt bei der Diagrammauswahl ist nicht „Welches Diagramm mag ich?", sondern „Welche Information möchte ich vermitteln?". Unterschiedliche Datenzwecke erfordern unterschiedliche optimale Diagrammtypen.

<ChartTypeSelectorDemo />

### Schnellreferenz zur Diagrammauswahl

| Datenzweck | Empfohlenes Diagramm | Nicht empfohlen | Grund |
|---------|---------|--------|------|
| Größen vergleichen | Balkendiagramm, Balkendiagramm (horizontal) | Kreisdiagramm | Das menschliche Auge ist empfindlicher für Längenunterschiede als für Winkelunterschiede |
| Trends anzeigen | Liniendiagramm, Flächendiagramm | Balkendiagramm | Die Kontinuität der Linie suggeriert zeitliche Kontinuität |
| Anteile anzeigen | Kreisdiagramm (≤5 Kategorien), gestapeltes Balkendiagramm | 3D-Kreisdiagramm | 3D-Perspektive verzerrt die Flächenverhältnisse |
| Verteilung anzeigen | Histogramm, Boxplot | Liniendiagramm | Verteilung erfordert die Betrachtung von Häufigkeiten, nicht Trends |
| Beziehungen anzeigen | Streudiagramm, Blasendiagramm | Balkendiagramm | Die Beziehung zwischen zwei kontinuierlichen Variablen erfordert einen zweidimensionalen Raum |

::: tip Eine einfache Entscheidungsregel
- **Eine Variable** → Histogramm (Verteilung) oder Zahlenkarte (KPI)
- **Zwei Variablen** → Liniendiagramm (Zeit vs. Wert) oder Streudiagramm (Wert vs. Wert)
- **Mehrere Kategorien** → Balkendiagramm (Vergleich) oder Kreisdiagramm (Anteil, ≤5 Kategorien)
- **Mehrere Dimensionen** → Radar-Diagramm oder Parallelkoordinaten-Diagramm
:::

---

## 2. Visualisierungsdesignprinzipien: Visuelle Kodierungsprinzipien

Eine gute Visualisierung ist nicht „hübsch", sondern „verständlich". Die mehreren klassischen Prinzipien, die Edward Tufte in „The Visual Display of Quantitative Information" vorgestellt hat, sind bis heute eine wichtige Referenz für das Visualisierungsdesign.

| Prinzip | Beschreibung | Negativbeispiel |
|------|------|---------|
| Data-Ink-Ratio | Der Anteil der „Tinte" zur Darstellung von Daten im Diagramm sollte möglichst hoch sein | Zu viele Gitterlinien, dekorative Elemente |
| Nicht-Daten-Elemente minimieren | Visuelle Elemente entfernen, die keine Informationen vermitteln | 3D-Effekte, Schatten, Farbverlaufshintergründe |
| Konsistente Skalierung | Achsen bei null beginnen, gleichmäßige Teilung; bei abgeschnittenen Achsen muss dies klar gekennzeichnet werden | Y-Achse beginnt bei 95 ohne Hinweis |
| Sinnvoller Farbeinsatz | Farben zur Kodierung von Informationen verwenden, nicht zur Dekoration | Regenbogenfarben für geordnete Daten |
| Klare Beschriftungen | Titel, Achsenbeschriftungen, Legende und Einheiten dürfen nicht fehlen | Keine Einheiten, kein Zeitraum |

### 2.1 Data-Ink-Ratio

> Der Anteil der „Tinte" zur Darstellung von Daten an der gesamten „Tinte" im Diagramm sollte so hoch wie möglich sein.

Einfach gesagt: **Alles entfernen, was keine Informationen vermittelt**.

| Sollte entfernt werden | Sollte beibehalten werden |
|-----------|-----------|
| 3D-Effekte, Schatten, Farbverläufe | Datenpunkte, Achsenbeschriftungen |
| Überflüssige Gitterlinien | Wichtige Referenzlinien (z. B. Zielwert) |
| Dekorative Icons | Legende (bei mehreren Datenreihen) |
| Auffällige Hintergrundfarben | Klare Titel und Einheiten |

### 2.2 Konsistenzprinzip

- **Farbkonsistenz**: Dieselbe Dimension in verschiedenen Diagrammen mit derselben Farbe darstellen, z. B. „Umsatz" immer in Blau
- **Skalakonsistenz**: Achsen möglichst bei 0 beginnen lassen, es sei denn, es gibt triftige Gründe und eine klare Kennzeichnung
- **Zeitkonsistenz**: Die Abstände auf der Zeitachse sollten gleichmäßig sein; ungleichmäßige Zeitpunkte nicht als gleichmäßig darstellen

### 2.3 Lesbarkeitsprinzip

- **Titel sollte eine Schlussfolgerung enthalten**: Nicht „Monatlicher Umsatz", sondern „Umsatz seit 3 Monaten rückläufig"
- **Wichtige Punkte markieren**: An Ausreißern und Wendepunkten Anmerkungen hinzufügen, um die Aufmerksamkeit des Lesers zu lenken
- **Informationsdichte kontrollieren**: Ein Diagramm sollte 1–2 Kernbotschaften vermitteln, nicht überladen

::: tip Drei Regeln für den Farbeinsatz
1. **Dieselbe Kennzahl in derselben Farbe**: Umsatz in allen Diagrammen in Blau darstellen, nicht einmal blau und einmal grün
2. **Geordnete Daten mit Farbverlauf**: Temperatur von niedrig bis hoch mit Blau→Rot-Verlauf darstellen, keine diskreten Farben verwenden
3. **Farbenblindheitsfreundlich**: Etwa 8 % der Männer haben eine Rot-Grün-Schwäche; vermeiden, wichtige Informationen nur durch Rot und Grün zu unterscheiden
:::

---

## 3. Dashboard-Layout: Verschiedene Szenarien, verschiedene Muster

Ein Dashboard ist eine organische Kombination mehrerer Diagramme. Ein gutes Dashboard stapelt nicht einfach Diagramme übereinander, sondern wählt basierend auf dem Verwendungszweck ein geeignetes Layoutmuster.

<DashboardLayoutDemo />

### Vier gängige Layoutmuster

| Layoutmuster | Kernstruktur | Anwendungsbereich | Design-Hinweise |
|---------|---------|---------|---------|
| Globaler Überblick | KPI-Karten + Trenddiagramm + Detailtabelle | Management-Tagesbericht, operatives Dashboard | Kernkennzahlen ganz oben platzieren, wichtigste Zahlen auf einen Blick |
| Vergleichsanalyse | Symmetrisches Links-Rechts-Layout | A/B-Tests, Jahresvergleich | Vergleichsdimensionen konsistent halten, Unterschiede hervorheben |
| Drilldown-Analyse | Von der Zusammenfassung zur Detailebene schrittweise | Vertriebsanalyse, Nutzerverhaltensanalyse | Klick-Interaktion unterstützen, schrittweise tiefer gehen |
| Echtzeit-Überwachung | Große Zahlen + Echtzeit-Kurven + Alarmstatus | Shopping-Festival-Dashboard, Serverüberwachung | Automatische Aktualisierung, dunkler Hintergrund, geeignet für Großbildschirme |

### 5 Prinzipien des Dashboard-Designs

1. **Zuerst fragen: „Wer schaut sich das an?"**: Der CEO sieht strategische Kennzahlen, das operative Team sieht Prozesskennzahlen, Ingenieure sehen technische Kennzahlen
2. **Die 5-Sekunden-Regel**: Der Benutzer sollte die Kerninformation des Dashboards innerhalb von 5 Sekunden erfassen
3. **Informationsebenen**: Das Wichtigste oben links, weniger Wichtiges darunter
4. **Scrollen reduzieren**: Kerninhalte auf einen Bildschirm darstellen; vermeiden, dass Benutzer scrollen müssen, um wichtige Daten zu sehen
5. **Weißraum**: Nicht jeden Zentimeter ausfüllen; angemessener Weißraum wirkt angenehmer

::: tip Dashboard vs. Bericht
- **Dashboard**: Echtzeit/Near-Echtzeit, interaktiv, ausgerichtet auf Überwachung und schnelle Entscheidungsfindung
- **Bericht**: Regelmäßig erstellt (täglich/wöchentlich/monatlich), statisch, ausgerichtet auf detaillierte Analyse und Archivierung

Die beiden stehen nicht in Konkurrenz zueinander, sondern ergänzen sich. Dashboards decken Probleme auf, Berichte analysieren sie vertieft.
:::

---

## 4. Tool-Auswahl: Von Code-Bibliotheken bis zu BI-Plattformen

Visualisierungstools lassen sich in drei Ebenen unterteilen: Diagrammbibliotheken auf Code-Ebene, Diagrammbibliotheken für Datenanalyse und BI-Plattformen. Die Wahl hängt von der Komplexität der Anforderungen, den Interaktionsanforderungen und den technischen Fähigkeiten des Teams ab.

### 4.1 Diagrammbibliotheken auf Code-Ebene

| Tool | Sprache/Plattform | Merkmale | Anwendungsbereich |
|------|----------|------|---------|
| ECharts | JavaScript | sofort einsatzbereit, umfangreicher Diagrammtyp-Katalog, hervorragende chinesische Dokumentation | In Business-Systeme eingebettete Diagramme |
| D3.js | JavaScript | niedrigschwellig flexibel, jede Visualisierung anpassbar | Hochgradig angepasste Datenvisualisierung |
| Chart.js | JavaScript | leichtgewichtig und einfach, schneller Einstieg | Einfache Diagrammanforderungen |
| Matplotlib | Python | Standardbibliothek für wissenschaftliches Rechnen, statische Diagramme | Datenanalyse, Publikationsdiagramme |
| Plotly | Python/JS | interaktive Diagramme, 3D-Unterstützung | Datenexploration, Jupyter Notebook |

### 4.2 BI-Plattformen (No-Code/Low-Code)

| Tool | Positionierung | Kernvorteil | Geeignetes Team |
|------|------|---------|---------|
| Grafana | Überwachungsvisualisierung | Gute Unterstützung für Zeitreihendaten, Alarm-Integration | DevOps/SRE-Teams |
| Metabase | Leichtgewichtige BI | Open Source und kostenlos, Diagramme direkt aus SQL | Kleine und mittlere Teams für schnellen Aufbau |
| Apache Superset | Enterprise BI | Open Source, Unterstützung großer Datenquellen | Unternehmen mit einem Datenteam |
| Tableau | Kommerzielle BI | Drag-and-Drop-Bedienung, hervorragende Visualisierungsergebnisse | Business-Analysten |
| Power BI | Kommerzielle BI | Gute Integration in das Microsoft-Ökosystem | Unternehmen mit Microsoft-Technologie-Stack |

::: tip Auswahl-Empfehlungen
- **Entwickler, die Diagramme in Produkte einbetten** → ECharts (gutes chinesisches Ökosystem) oder Chart.js (einfache Szenarien)
- **Datenanalysten für explorative Analyse** → Plotly + Jupyter oder Metabase
- **DevOps-Überwachungs-Dashboard** → Grafana (De-facto-Standard)
- **Business-Teams für Self-Service-Analyse** → Metabase (Open Source) oder Tableau (kommerziell)
- **Hohe Anpassungsanforderungen** → D3.js (steile Lernkurve, aber am meisten anpassbar)
:::

---

## 5. Häufige Fallen: Diese Diagramme täuschen dich

Datenvisualisierung ist ein zweischneidiges Schwert: Gut eingesetzt deckt sie die Wahrheit auf, schlecht eingesetzt erzeugt sie Illusionen. Im Folgenden die häufigsten Visualisierungsfallen, die jeder Datenfachmann erkennen können sollte.

### 5.1 Abgeschnittene Achsen

Den Startpunkt der Y-Achse von 0 auf eine größere Zahl zu ändern, lässt winzige Unterschiede wie gewaltige Veränderungen erscheinen.

| Szenario | Tatsächlicher Unterschied | Visueller Eindruck |
|------|---------|---------|
| Y-Achse beginnt bei 0 | Produkt A: 98 Punkte, Produkt B: 95 Punkte | Sehr geringer Unterschied |
| Y-Achse beginnt bei 90 | Dieselben Daten | A wirkt um ein Vielfaches größer als B |

**Wann ist eine Abschneidung vertretbar?** Wenn die absoluten Werte groß, die Veränderungen aber gering sind (z. B. Aktienkurs von 100 auf 105), ist eine Abschneidung gerechtfertigt, muss aber klar gekennzeichnet werden.

### 5.2 Die Perspektivfalle des 3D-Kreisdiagramms

Die 3D-Perspektive lässt die Segmente, die näher am Betrachter liegen, größer erscheinen. Ein 25%-Segment kann in der 3D-Ansicht wie 35 % wirken.

**Lösung**: Niemals 3D-Kreisdiagramme verwenden. Stattdessen ein normales Kreisdiagramm oder Donut-Diagramm verwenden — oder gleich ein Balkendiagramm.

### 5.3 Farbführen

| Falsche Vorgehensweise | Richtige Vorgehensweise |
|---------|---------|
| Rot und Grün für Daten verwenden | Blau-Orange und andere farbenblinden-sichere Paletten verwenden |
| Für jede Kategorie eine andere Farbe verwenden | Innerhalb einer Reihe Abstufungen derselben Farbtonfamilie verwenden |
| Farben zur Kodierung kontinuierlicher Daten ohne Legende | Immer eine Farblegende und Wertbeschriftungen bereitstellen |
| Ungenügender Kontrast zwischen Hintergrund- und Datenfarbe | WCAG-AA-Kontraststufe sicherstellen |

### 5.4 Weitere häufige Fehler

| Falle | Problem | Behebung |
|------|------|------|
| Doppelte Y-Achse | Zwei unabhängige Kennzahlen teilen sich die X-Achse und suggerieren eine kausale Beziehung | In zwei separate Diagramme aufteilen oder explizit auf fehlende Kausalität hinweisen |
| Flächenillusion | Den Radius statt der Fläche eines Kreises zur Darstellung von Werten verwenden | Bei Verdopplung des Werts die Fläche verdoppeln, nicht den Radius |
| Ungleichmäßige Zeitachse | Die Abstände für Januar, März und Dezember sind gleich | Nach dem tatsächlichen zeitlichen Verhältnis anordnen |
| Zu viele Kategorien | Ein Kreisdiagramm mit 15 Segmenten | Bei mehr als 5 Kategorien ein Balkendiagramm verwenden oder „Sonstige" zusammenfassen |

::: tip Ethische Grundsätze der Visualisierung
Der Zweck der Visualisierung ist es, das **Verständnis zu fördern**, nicht die **Wahrnehmung zu manipulieren**. Stelle dir bei jedem Diagramm die Fragen:

- Würde mich dieses Diagramm als Leser zu falschen Schlussfolgerungen verleiten?
- Habe ich ungünstige Daten verschwiegen?
- Stellen Achsen, Maßstab und Farben die Daten gerecht dar?
:::

---

## Zusammenfassung

Datenvisualisierung ist die „letzte Meile" der Wertübertragung von Daten. Selbst die beste Analyse ist wertlos, wenn sie nicht richtig verstanden wird.

Rückblick auf die Kernpunkte dieses Kapitels:

1. **Das richtige Diagramm wählen**: Den Diagrammtyp basierend auf dem Datenzweck (Vergleich, Trend, Anteil, Verteilung, Beziehung) auswählen
2. **Designprinzipien**: Hohe Data-Ink-Ratio, Konsistenz und Lesbarkeit sind die drei Kernprinzipien
3. **Dashboard-Layout**: Die vier Muster — Übersichtstyp, Vergleichstyp, Drilldown-Typ und Echtzeit-Typ — decken die meisten Szenarien ab
4. **Tool-Auswahl**: Von ECharts bis Grafana, je nach Teamfähigkeit und Anforderungskomplexität wählen
5. **Fallen vermeiden**: Abgeschnittene Achsen, 3D-Kreisdiagramme und Farbführen sind die häufigsten Mittel zur Irreführung

## Weiterführende Literatur

- [The Visual Display of Quantitative Information](https://www.edwardtufte.com/tufte/books_vdqi) - Edward Tuftes Visualisierungsklassiker
- [ECharts Offizielle Dokumentation](https://echarts.apache.org/zh/index.html) - Die beliebteste chinesische Diagrammbibliothek
- [D3.js](https://d3js.org/) - Leistungsstarke Low-Level-Visualisierungsbibliothek
- [Grafana](https://grafana.com/) - De-facto-Standard für Überwachungsvisualisierung
- [From Data to Viz](https://www.data-to-viz.com/) - Entscheidungsbaum zur Diagrammtypauswahl
- [ColorBrewer](https://colorbrewer2.org/) - Tool für farbenblinden-sichere Farbschemata
