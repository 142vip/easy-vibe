# Einführung in Algorithmen

::: tip Vorwort
**Wie löst man Probleme effizient?** Sie haben vielleicht schon folgende Erfahrung gemacht: Dasselbe Problem — der Code der einen Person liefert in wenigen Sekunden ein Ergebnis, während der einer anderen nach Minuten noch immer rechnet. Der Unterschied liegt meist im Algorithmus. Dieses Kapitel vermittelt Ihnen die Kernkonzepte algorithmischen Denkens.
:::

**Was werden Sie in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels werden Sie Folgendes gewonnen haben:

- **Problemaufteilungsfähigkeit**: Bei komplexen Problemen an Strategien wie Teile-und-Herrsche oder Rekursion denken, anstatt sofort zu programmieren
- **Effizienzeinschätzung**: Mit der O-Notation beurteilen können, welche von zwei Lösungen effizienter ist, statt auf Bauchgefühl zu vertrauen
- **Komplexitätsdenken**: Vor dem Programmieren die Datenmenge und Zeitanforderungen abschätzen und die passende Algorithmusklasse wählen
- **Grundlage für weiterführendes Lernen**: Basis für fortgeschrittene Datenstrukturen, verteilte Systeme und maschinelles Lernen schaffen

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | Binäre Suche | Teile-und-Herrsche, O(log n) |
| **Kapitel 2** | Sortieralgorithmen | Bubble Sort, Quick Sort, Merge Sort |
| **Kapitel 3** | Komplexitätsanalyse | Zeitkomplexität, Platzkomplexität |

---

## 0. Überblick über Algorithmen
Stellen Sie sich vor, Sie suchen ein Wort in einem Wörterbuch:

- **Methode 1**: Von der ersten Seite an Seite für Seite blättern (lineare Suche)
- **Methode 2**: Anhand des Anfangsbuchstabens positionieren, dann binär suchen (binäre Suche)

Beide Methoden führen zum Ziel, aber die Effizienz unterscheidet sich dramatisch. **Ein Algorithmus ist eine Methode zur Problemlösung.**

<AlgorithmDemo />

**Kennzahlen eines Algorithmus:**

| Kennzahl | Bedeutung | Warum wichtig |
|------|------|-----------|
| **Zeitkomplexität** | Trend der Laufzeit bei wachsender Datenmenge | Performance-Vorhersage bei großen Datenmengen |
| **Platzkomplexität** | Trend des Speicherverbrauchs bei wachsender Datenmenge | Bewertung des Speicherbedarfs |
| **Korrektheit** | Ob stets das richtige Ergebnis geliefert wird | Grundvoraussetzung eines Algorithmus |

::: tip 📊 Zeile für Zeile erklärt
**Zeitkomplexität**: Wird mit der O-Notation beschrieben. O(n) bedeutet: Verdoppelt sich die Datenmenge, verdoppelt sich die Zeit; O(n²) bedeutet: Verdoppelt sich die Datenmenge, vervierfacht sich die Zeit.

**Platzkomplexität**: Ebenfalls in O-Notation. Manche Algorithmen tauschen Platz gegen Zeit (z. B. Hashtabellen), andere Zeit gegen Platz (z. B. Kompressionsalgorithmen).

**Korrektheit**: Ein Algorithmus muss für alle möglichen Eingaben korrekte Ergebnisse liefern. Randbedingungen (leere Eingabe, extrem große Eingabe) sind am fehleranfälligsten.
:::

---

## 1. Binäre Suche: Jedes Mal die Hälfte ausschließen

### 1.1 Prinzip der binären Suche

::: tip 💡 Wie funktioniert die binäre Suche?
**Voraussetzung**: Die Daten müssen sortiert sein

**Ablauf**:
1. Das mittlere Element finden
2. Wenn das mittlere Element dem Ziel entspricht — gefunden!
3. Wenn das Ziel kleiner als das mittlere Element ist, im linken Teil weitersuchen
4. Wenn das Ziel größer als das mittlere Element ist, im rechten Teil weitersuchen
5. Jedes Mal die Hälfte ausschließen, bis gefunden oder Nicht-Existenz bestätigt ist

**Zeitkomplexität**: O(log n)

**Alltagsanalogie**: Zahlenratespiel. Ich denke mir eine Zahl zwischen 1 und 100, Sie raten jedes Mal die Mitte und ich sage, ob sie zu groß oder zu klein ist. Nach höchstens 7 Versuchen haben Sie die Zahl (da 2⁷ = 128 > 100).
:::

👇 **Probieren Sie es selbst**:
Die folgende Demo zeigt das Funktionsprinzip der binären Suche. Wählen Sie zwischen sequenzieller und binärer Suche, um zu vergleichen:

<SearchAlgorithmDemo />

### 1.2 Prinzipien der logarithmischen Komplexität
| Datenmenge | Lineare Suche | Binäre Suche |
|--------|---------|---------|
| 100 | 100 Vergleiche | 7 Vergleiche |
| 1.000 | 1.000 Vergleiche | 10 Vergleiche |
| 1.000.000 | 1.000.000 Vergleiche | 20 Vergleiche |
| 1.000.000.000 | 1.000.000.000 Vergleiche | 30 Vergleiche |

::: tip 📊 Zeile für Zeile erklärt
**Erste Spalte (Datenmenge)**: Wie viele Daten durchsucht werden. Die Datenmenge wächst von 100 auf 1 Milliarde (eine Verzehnfachung um das Millionenfache!)

**Zweite Spalte (lineare Suche)**: Die „dümmste" Methode — vom ersten Element an einzeln suchen. Die Anzahl der Vergleiche entspricht der Datenmenge; je mehr Daten, desto mehr Vergleiche.

**Dritte Spalte (binäre Suche)**: Die clevere Methode — jedes Mal die Hälfte ausschließen. Die Anzahl der Vergleiche hängt nur vom Logarithmus der Datenmenge ab. Selbst bei 1 Milliarde Datensätzen sind nur 30 Vergleiche nötig!

**Vergleichsfazit**: Bei 1 Million Datensätzen benötigt die lineare Suche 1 Million Vergleiche, die binäre Suche nur 20 — ein Unterschied vom Faktor 50.000!
:::

::: tip 📊 Die Macht des logarithmischen Wachstums
Die Zeitkomplexität der binären Suche ist O(log n). Das bedeutet:

- 1 Milliarde Daten — höchstens 30 Vergleiche
- 1 Billion Daten — höchstens 40 Vergleiche

Das ist die Macht des logarithmischen Wachstums: Die Datenmenge wächst um das 1000-fache, aber die Anzahl der Vergleiche steigt nur um 10.
:::

---

## 2. Sortieren: Aus Unordnung wird Ordnung

### 2.1 Gängige Sortieralgorithmen

| Algorithmus | Zeitkomplexität | Merkmale | Anwendungsbereich |
|------|-----------|------|---------|
| **Bubble Sort** | O(n²) | Einfach, aber langsam | Lehre, kleine Datenmengen |
| **Selection Sort** | O(n²) | Einfach, aber langsam | Kleine Datenmengen |
| **Insertion Sort** | O(n²) | Schnell bei nahezu sortierten Daten | Kleine Datenmengen, nahezu sortiert |
| **Quick Sort** | O(n log n) | In der Praxis am schnellsten | Allgemeines Sortieren |
| **Merge Sort** | O(n log n) | Stabiles Sortieren | Szenarien, die Stabilität erfordern |
| **Heap Sort** | O(n log n) | In-place Sortierung | Speicherbegrenzte Szenarien |

::: tip 📊 Zeile für Zeile erklärt
**Bubble Sort**: Der grundlegendste Sortieralgorithmus, wie Luftblasen, die im Wasser aufsteigen. Leicht verständlich, aber am langsamsten. Geeignet zum Erlernen des Sortierkonzepts, nicht für den praktischen Einsatz.

**Selection Sort**: Jedes Mal das kleinste Element auswählen und nach vorne stellen. Ebenfalls einfach, aber unabhängig davon, ob die Daten bereits sortiert sind, immer gleich viele Vergleiche.

**Insertion Sort**: Wie beim Sortieren von Handkarten. Jedes Element wird in den bereits sortierten vorderen Teil eingefügt. Sehr effizient bei nahezu sortierten Daten.

**Quick Sort**: Der in der Praxis am häufigsten verwendete Sortieralgorithmus. Im Durchschnitt am schnellsten, verschlechtert sich aber im schlechtesten Fall (bereits sortierte Daten) auf O(n²).

**Merge Sort**: Basiert auf dem „Teile-und-Herrsche"-Prinzip, immer O(n log n), benötigt aber zusätzlichen Speicherplatz. Geeignet, wenn stabiles Sortieren erforderlich ist.

**Heap Sort**: Nutzt die Heap-Datenstruktur zum Sortieren, in-place (kein zusätzlicher Speicherplatz), aber in der Praxis oft langsamer als Quick Sort.
:::

### 2.2 Prinzipien der schnellen Sortierung
::: tip 💡 Prinzip von Quick Sort
**Kernidee**: Teile-und-Herrsche-Methode

1. Ein „Pivot"-Element auswählen
2. Kleinere Elemente als das Pivot nach links, größere nach rechts
3. Den linken und rechten Teil jeweils rekursiv sortieren
4. Ergebnisse zusammenführen

**Warum schnell?**
- Nach jeder Partitionierung steht das Pivot-Element an seiner endgültigen Position
- Im Durchschnitt wird bei jeder Partition etwa die Hälfte der Elemente ausgeschlossen
- Zeitkomplexität O(n log n)

**Alltagsanalogie**: Bücherregal aufräumen. Ein Buch herausziehen, dünnere nach links, dickere nach rechts legen. Dann den Prozess für beide Stapel wiederholen.
:::

👇 **Probieren Sie es selbst**:
Die folgende Demo visualisiert Sortieralgorithmen. Erzeugen Sie ein Array und beobachten Sie den Vergleich zwischen Bubble Sort und Quick Sort:

<SortingAlgorithmDemo />

---

## 3. Rekursion: Sich selbst aufrufen

### 3.1 Die Essenz der Rekursion

::: tip 💡 Was ist Rekursion?
**Rekursion** ist eine Programmiertechnik, bei der eine Funktion sich selbst aufruft.

**Zwei Schlüsselelemente**:
1. **Basisfall**: Wann wird die Rekursion beendet?
2. **Rekursionsschritt**: Wie wird das Problem in kleinere Teilprobleme zerlegt?

**Klassisches Beispiel: Fakultät**
```js
function factorial(n) {
  if (n <= 1) return 1        // Basisfall
  return n * factorial(n - 1) // Rekursionsschritt
}
```

**Alltagsanalogie**: Russische Matrjoschka-Puppen. Eine Puppe öffnen, darin ist eine kleinere, bis zur kleinsten, die sich nicht mehr öffnen lässt.
:::

### 3.2 Rekursion vs. Iteration

| Eigenschaft | Rekursion | Iteration (Schleife) |
|------|------|-------------|
| **Code-Knappheit** | Meist knapper | Möglicherweise komplexer |
| **Speicherverbrauch** | Höher (Aufrufstapel) | Niedriger |
| **Performance** | Etwas langsamer (Funktionsaufruf-Overhead) | Schneller |
| **Anwendungsbereich** | Baumtraversierung, Teile-und-Herrsche | Einfache Wiederholungsaufgaben |

::: tip 📊 Zeile für Zeile erklärt
**Code-Knappheit**: Rekursion kann komplexe Logik oft in wenigen Zeilen ausdrücken (z. B. Baumtraversierung), während Schleifen mehr Variablen und Verschachtelungen benötigen können.

**Speicherverbrauch**: Rekursion verwendet einen „Aufrufstapel", um die Informationen jeder Ebene zu speichern — wie das Stapeln von Tellern. Bei jedem Rekursionsschritt kommt ein Teller hinzu. Schleifen benötigen diesen Overhead nicht.

**Performance**: Jeder Funktionsaufruf hat einen Overhead (Parameterübergabe, Stapeloperationen etc.), daher ist Rekursion in der Regel etwas langsamer als Schleifen.

**Anwendungsbereich**: Rekursion eignet sich für Probleme mit intrinsisch rekursiver Struktur (z. B. Dateibäume, DOM-Bäume); Schleifen für einfache Wiederholungsoperationen (z. B. Array-Traversierung).
:::

::: warning ⚠️ Fallen der Rekursion
**Stapelüberlauf (Stack Overflow)**: Die Rekursionstiefe ist zu groß, der Aufrufstapel wird erschöpft.

**Lösungen**:
- Auf Iteration umstellen
- Endrekursionsoptimierung verwenden (von einigen Sprachen unterstützt)
- Rekursionstiefe begrenzen
:::

👇 **Probieren Sie es selbst**:
Die folgende Demo zeigt den Aufrufprozess der Rekursion. Beobachten Sie, wie eine Funktion sich selbst aufruft:

<RecursiveThinkingDemo />

---

## 4. Greedy-Algorithmen: In jedem Schritt das Optimum wählen

### 4.1 Das Greedy-Prinzip

::: tip 💡 Was ist ein Greedy-Algorithmus?
**Greedy-Algorithmen** wählen in jedem Schritt die aktuell optimal erscheinende Entscheidung in der Hoffnung, dadurch eine global optimale Lösung zu finden.

**Anwendungsbedingungen**:
1. **Greedy-Eigenschaft**: Lokale Optima führen zu globalen Optima
2. **Optimale Teilstruktur**: Die optimale Lösung des Problems enthält die optimalen Lösungen der Teilprobleme

**Klassisches Beispiel: Münzwechsel**
- Ziel: Einen bestimmten Betrag mit möglichst wenigen Münzen bilden
- Greedy-Strategie: Jedes Mal die größte Münze wählen
- Ergebnis: 67 € = 50 + 10 + 5 + 1 + 1 (5 Münzen)

**Alltagsanalogie**: Beim Bergaufsteigen jedes Mal den steilsten Weg wählen. Man erreicht zwar nicht unbedingt den höchsten Gipfel, aber meistens eine gute Position.
:::

### 4.2 Grenzen des Greedy-Ansatzes

::: warning ⚠️ Greedy liefert nicht immer die optimale Lösung
**Gegenbeispiel: Münzwechsel**

Wenn die Münzwerte [1, 3, 4] sind und 6 € gebildet werden sollen:
- Greedy: 4 + 1 + 1 = 3 Münzen
- Optimal: 3 + 3 = 2 Münzen

Der Greedy-Algorithmus ist hier gescheitert!

**Lerneffekt**: Greedy-Algorithmen sind einfach und effizient, führen aber nicht immer zur optimalen Lösung. Vor der Anwendung muss bewiesen werden, dass das Problem die Greedy-Bedingungen erfüllt.
:::

👇 **Probieren Sie es selbst**:
Die folgende Demo zeigt die praktische Wirkung von Greedy-Algorithmen. Probieren Sie verschiedene Münzkombinationen und beobachten Sie die Leistung der Greedy-Strategie:

<GreedyThinkingDemo />

---

## 5. Algorithmus-Entwurfsparadigmen

| Paradigma | Idee | Typische Algorithmen | Anwendbare Probleme |
|------|------|---------|---------|
| **Teile-und-Herrsche** | Problem in kleinere Probleme zerlegen | Quick Sort, Merge Sort | Zerlegbare Probleme |
| **Greedy** | Jeden Schritt optimal wählen | Minimaler Spannbaum, Huffman-Kodierung | Probleme mit Greedy-Eigenschaft |
| **Dynamische Programmierung** | Lösungen von Teilproblemen speichern | Rucksackproblem, Kürzester Pfad | Überlappende Teilprobleme |
| **Backtracking** | Ausprobieren, bei Sackgasse zurückgehen | Acht-Damen, Alle Permutationen | Suchprobleme |

::: tip 📊 Zeile für Zeile erklärt
**Teile-und-Herrsche**: Große Probleme in kleine zerlegen, einzeln lösen und dann zusammenführen. Wie beim Aufräumen: Wohnzimmer, Schlafzimmer und Küche getrennt putzen, am Ende ist alles sauber.

**Greedy**: Jeden Schritt das aktuell Beste wählen, ohne langfristige Konsequenzen zu bedenken. Wie beim Essen zuerst das Lieblingsgericht zu wählen — vielleicht nicht die optimale Essensreihenfolge, aber schnell.

**Dynamische Programmierung**: Zwischenergebnisse merken, um Doppelberechnungen zu vermeiden. Wie sich Notizen machen: Beim nächsten Mal dasselbe Problem einfach nachschlagen, ohne es neu zu lösen.

**Backtracking**: Wenn es nicht weitergeht, zurückkehren und es anders versuchen. Wie in einem Labyrinth: Dieser Weg ist versperrt — zurück zur letzten Kreuzung und einen anderen probieren.
:::

👇 **Probieren Sie es selbst**:
Die folgende Demo zeigt die Merkmale und Anwendungsbereiche verschiedener Algorithmus-Entwurfsparadigmen:

<AlgorithmParadigmDemo />

---

## 6. Zusammenfassung: Algorithmen als Kunst des Problemlösens

Lassen Sie uns die verschiedenen algorithmischen Denkweisen mit einer Analogie zusammenfassen:

| Denkweise | Analogie | Kernpunkt |
|------|------|---------|
| **Binäre Suche** | Zahlenraten | Jedes Mal die Hälfte ausschließen |
| **Sortieren** | Bücherregal aufräumen | Ordnung schaffen |
| **Rekursion** | Matrjoschka-Puppen | Großes klein machen |
| **Greedy** | Bergauf den Weg wählen | Lokales Optimum |

::: tip 💡 Kernbotschaft
**Die Essenz von Algorithmen ist die Balance zwischen „Effizienz" und „Korrektheit".**

- Ein guter Algorithmus kann die Programmeffizienz um Größenordnungen steigern
- Überoptimierung kann jedoch zu unnötiger Komplexität führen
- Erst Korrektheit sicherstellen, dann Effizienz anstreben

Algorithmisches Denken zu verstehen ist wichtiger als spezifische Algorithmen zu memorieren:
- Teile-und-Herrsche: Große Probleme in kleine zerlegen
- Greedy: Jeden Schritt optimal wählen
- Dynamische Programmierung: Teilproblemlösungen speichern
- Backtracking: Ausprobieren, bei Sackgasse zurückkehren
:::

---

## Weiterführende Literatur

- **Introduction to Algorithms**: Klassisches Lehrbuch für systematisches Algorithmus-Lernen
- **LeetCode**: Algorithmusfähigkeiten durch Übungsaufgaben verbessern
- **Algorithmus-Visualisierung**: Ausführung von Algorithmen intuitiv verstehen
- **Wettbewerbs-Algorithmen**: Fortgeschrittene Algorithmus-Techniken erlernen
