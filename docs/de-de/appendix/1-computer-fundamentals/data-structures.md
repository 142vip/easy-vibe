# Einführung in Datenstrukturen

::: tip Vorwort
**Programm = Datenstruktur + Algorithmus.** Wir haben gelernt, wie der CPU Befehle ausführt und wie das Betriebssystem Ressourcen verwaltet. Aber das zentrale Objekt, das Programme verarbeiten, sind **Daten** — Benutzerinformationen, Produktlisten, soziale Beziehungen... Wie diese Daten im Speicher organisiert sind, bestimmt direkt die Geschwindigkeit des Programms. Haben Sie sich schon gefragt, warum manche Programme Zehntausende von Datensätzen schnell verarbeiten, während andere schon bei Hunderten einfrieren? Die Antwort liegt meist in der **Wahl der Datenstruktur**.
:::

**Was werden Sie in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels werden Sie Folgendes gewonnen haben:

- **Intuitive Urteilskraft**: Bei einem Requirement sofort wissen, welche Datenstruktur sich eignet
- **Performance-Analyse-Perspektive**: Erkennen, ob ein Flaschenhals an der falschen Datenstruktur oder an einem ineffizienten Algorithmus liegt
- **Abwägungsdenken**: Verstehen, dass man „Platz gegen Zeit" oder „Zeit gegen Platz" tauscht — es gibt keine perfekte Datenstruktur
- **Code-Lesekompetenz**: Begriffe wie HashMap, Stack, Queue nicht mehr als fremd empfinden
- **Grundlage für Weiteres**: Basis für Datenbankindizes, Caching-Systeme und Suchmaschinen

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | Überblick | Vier Hauptkategorien, Klassifikationskriterien |
| **Kapitel 2** | Lineare Strukturen | Arrays, verkettete Listen, Stapel, Warteschlangen |
| **Kapitel 3** | Hashtabellen | Hashfunktion, Kollisionsbehandlung, O(1)-Suche |
| **Kapitel 4** | Baumstrukturen | Binärbaum, Dateisystembaum, DOM-Baum |
| **Kapitel 5** | Graphstrukturen | Gerichteter Graph, ungerichteter Graph, Traversierung |
| **Kapitel 6** | Performance-Vergleich | Zeitkomplexität, Platzkomplexität |
| **Kapitel 7** | Auswahlleitfaden | Szenarioanalyse, Entscheidungsprozess |

---

## 1. Überblick über Datenstrukturen
Stellen Sie sich vor, Sie müssen einen Stapel Bücher ordnen:

- **Auf dem Boden gestapelt**: Jedes Buch einzeln durchsuchen — das ist die ursprünglichste Speicherung
- **Nummeriert ins Regal**: Direkt zum entsprechenden Platz greifen — das ist ein **Array**
- **Nach Kategorie in Schränke**: Erst den Schrank bestimmen, dann darin suchen — das ist eine **Hashtabelle**
- **Nach Titel sortiert auf Etagenregalen**: Jedes Mal die Hälfte ausschließen — das ist ein **Baum**

Die Art der Ordnung macht einen enormen Unterschied bei der Effizienz. **Eine Datenstruktur ist die „Ordnungsmethode" für Daten** — sie bestimmt, wie Daten gespeichert, gefunden und geändert werden.

<DataStructureOverviewDemo />

Alle Datenstrukturen lassen sich in vier Hauptkategorien einteilen:

| Typ | Datenbeziehung | Typische Vertreter | Alltagsanalogie |
|------|---------|---------|---------|
| **Lineare Struktur** | Eins-zu-eins, in einer Reihe | Array, verkettete Liste, Stack, Queue | Eisenbahnwaggons, Warteschlange |
| **Hash-Struktur** | Schlüssel→Wert-Zuordnung | Hashtabelle, Dictionary, Set | Bibliothekskatalogkarten |
| **Baumstruktur** | Eins-zu-viele, hierarchisch | Binärbaum, B-Baum, Heap | Stammbaum, Ordnerstruktur |
| **Graphstruktur** | Viele-zu-viele, netzwerkartig | Gerichteter Graph, ungerichteter Graph | U-Bahn-Plan, Soziales Netzwerk |

::: tip Warum so viele Arten lernen?
Weil es **keine universelle Datenstruktur** gibt. Jede Struktur ist ein Kompromiss zwischen „Suchgeschwindigkeit", „Einfügegeschwindigkeit" und „Speicherverbrauch". Wie Sie keinen Rucksack für Möbelumzüge und keinen Lastwagen für einen Brief verwenden — das richtige Werkzeug halbiert den Aufwand.
:::

---

## 2. Lineare Strukturen: Die grundlegendste Organisationsform

Lineare Strukturen sind die intuitivste Art der Datenorganisation — Daten werden nacheinander angeordnet wie Eisenbahnwaggons. Aber die unterschiedliche Art der „Verknüpfung" und der „Zugriffsseite" erzeugt vier Varianten mit je eigenen Stärken.

<LinearStructuresDemo />

### 2.1 Array vs. Verkettete Liste: Zwei grundlegend verschiedene Speicherarten

Arrays und verkettete Listen sind die beiden grundlegendsten linearen Strukturen. Ihr Kernunterschied liegt im **Speicherlayout**:

| Vergleichsdimension | Array | Verkettete Liste |
|---------|------|------|
| **Speicherlayout** | Ein zusammenhängender Block | Überall verstreut, mit Zeigern verkettet |
| **Auf das n-te Element zugreifen** | Adresse direkt berechnen, O(1) | Vom Anfang einzeln suchen, O(n) |
| **In der Mitte einfügen** | Alle folgenden verschieben, O(n) | Nur zwei Zeiger ändern, O(1) |
| **Größe** | Bei Erstellung festgelegt | Jederzeit erweiterbar |
| **Alltagsanalogie** | Nummerierte Schließfachreihe | Schnitzeljagd-Hinweiskette |

::: tip Wann Array, wann verkettete Liste?
- **Datenmenge bekannt, häufiger Zugriff nach Position** → Array (z. B. Schülernotenliste, Pixelmatrix)
- **Datenmenge unbekannt, häufiges Einfügen/Löschen** → Verkettete Liste (z. B. Playlist, Rückgängig-Verlauf)
- **Unsicher?** → Zuerst Array verwenden. In den meisten Szenarien überwiegt der Cache-freundliche Performance-Vorteil
:::

### 2.2 Stack und Queue: Lineare Strukturen mit Regeln"

Stacks und Queues sind im Grunde Arrays oder verkettete Listen mit **eingeschränkten Operationen**. Es sieht aus, als würden Funktionen wegfallen, aber genau diese Einschränkung gibt ihnen klare Einsatzgebiete:

| Struktur | Regel | Operationen | Analogie | Wo in Ihrem Code? |
|------|------|------|------|-----------------|
| **Stack** | LIFO (Last In, First Out) | push / pop | Tellerstapel | Funktionsaufruf-Stack, Browser-Zurück, Strg+Z Rückgängig |
| **Queue** | FIFO (First In, First Out) | enqueue / dequeue | Ticketschlange | Aufgabenplanung, Nachrichtenwarteschlange, Druckwarteschlange |

::: tip Warum ist „Einschränkung" gut?
Stellen Sie sich einen Stack vor, der nur „Teller drauflegen" und „Teller wegnehmen" erlaubt — Sie greifen nie in der falschen Reihenfolge. **Einschränkung bringt Bestimmtheit, Bestimmtheit bringt Zuverlässigkeit.** Der Funktionsaufruf-Stack garantiert durch LIFO, dass die zuletzt aufgerufene Funktion als Erstes zurückkehrt. Wenn man beliebig auf Funktionen in der Mitte zugreifen könnte, würde das Programm im Chaos enden.
:::

---

## 3. Hashtabelle: Hashfunktion und Kollisionsbehandlung

Die Suche in linearen Strukturen ist nicht schnell genug — Array erfordert Traversierung O(n), selbst sortiert mit binärer Suche O(log n). Gibt es eine Struktur, die **O(1) direkt findet**? Ja, die Hashtabelle.

<HashTableDemo />

### 3.1 Kernidee der Hashtabelle

Das Prinzip ist eigentlich sehr einfach:

1. Sie geben einen **Schlüssel** (z. B. „apple")
2. Die **Hashfunktion** berechnet daraus eine Zahl (z. B. `hash("apple") = 3`)
3. Direkt an Position 3 des Arrays nachschauen — keine Traversierung, ein Schritt

Wie das Indexsystem einer Bibliothek: Man muss nicht Regal für Regal durchsuchen, man schlägt im Katalog nach und findet direkt den Standort.

### 3.2 Hash-Kollision und Behandlungsstrategien
Zwei verschiedene Schlüssel können denselben Index berechnen — das nennt man **Hash-Kollision**. Wie zwei Bücher mit derselben Katalognummer, die auf denselben Platz zeigen.

| Lösung | Prinzip | Analogie |
|---------|------|------|
| **Verkettung** | Mehrere Werte am selben Ort in einer Liste speichern | Mehrere Bücher im selben Schließfach |
| **Offene Adressierung** | Bei Kollision den nächsten freien Platz suchen | Schließfach voll → ins Nachbarfach legen |

### 3.3 Performance der Hashtabelle

| Operation | Durchschnitt | Worst Case (alles kollidiert) |
|------|---------|-------------------|
| **Suchen** | O(1) | O(n) |
| **Einfügen** | O(1) | O(n) |
| **Löschen** | O(1) | O(n) |

::: warning Wann tritt Degradation auf?
Wenn alle Schlüssel auf denselben Index abgebildet werden, degeneriert die Hashtabelle zu einer verketteten Liste — alle Operationen werden O(n). Abhilfe: Gute Hashfunktion wählen + dynamisches Resizing (bei Überschreitung des Lastfaktors erweitern).
:::

::: tip Hashtabellen sind überall in Ihrem Code
- JavaScript `{}`-Objekte und `Map` → Hashtabelle
- Python `dict` → Hashtabelle
- Java `HashMap` → Hashtabelle
- Datenbankindizes → nutzen intern auch Hash

Jedes Mal, wenn Sie `user["name"]` oder `map.get("key")` schreiben, arbeitet im Hintergrund eine Hashtabelle.
:::

---

## 4. Baumstrukturen: Hierarchische Beziehungen ausdrücken

Hashtabellen suchen schnell, aber die Daten sind unsortiert. Wenn Sie **sowohl schnell suchen als auch Daten sortiert halten** müssen, sind Baumstrukturen die Wahl.

Kernmerkmal des Baums: Jeder Knoten kann mehrere „Kinder" haben, aber nur einen „Elternteil" (außer der Wurzel). Diese eins-zu-viele-Hierarchiebeziehung ist in der Realität allgegenwärtig.

<TreeStructureDemo />

### 4.1 Binärer Suchbaum: Ein sortierter Baum

Der binäre Suchbaum hat eine einfache, aber mächtige Regel: **Links klein, rechts groß**.

- Alle Werte im linken Teilbaum < Wurzelknoten
- Alle Werte im rechten Teilbaum > Wurzelknoten

Bei der Suche wird bei jedem Vergleich die Hälfte der Knoten ausgeschlossen — Zeitkomplexität O(log n). Wie beim Zahlenraten: „Größer oder kleiner als 50?" → „Größer." „Größer oder kleiner als 75?" → Jedes Mal die Hälfte ausschließen.

### 4.2 Ausbalancierte Bäume: Degeneration verhindern

Der binäre Suchbaum hat ein Problem: Wenn Daten sortiert eingefügt werden (1, 2, 3, 4, 5), degeneriert der Baum zu einer linearen Kette — die Suche wird wieder O(n). Ausbalancierte Bäume vermeiden dieses Problem durch automatische Strukturanpassung:

| Typ | Balancierungsstrategie | Merkmale | Typische Anwendung |
|------|---------|------|---------|
| **AVL-Baum** | Strikte Balance (Höhendifferenz ≤ 1) | Schnellste Suche, Einfügen/Löschen etwas langsamer | Häufige Suchszenarien |
| **Rot-Schwarz-Baum** | Annähernde Balance | Gute Gesamtleistung | Java TreeMap, Linux-Kernel |
| **B-Baum** | Mehrwege-Balance, mehrere Werte pro Knoten | Reduziert Festplatten-I/O | Datenbankindizes |

::: tip Wo sind Bäume in Ihrem Code?
- **Dateisystem**: Verschachtelte Ordner sind Baumstrukturen
- **HTML-DOM**: `<html>` → `<body>` → `<div>` → `<p>` ist ein Baum
- **Datenbankindizes**: B+-Bäume benötigen nur 3-4 Festplattenlesezugriffe für die Suche in Millionen von Datensätzen
- **JSON/XML**: Verschachtelte Datenformate sind im Kern Bäume
:::

---

## 5. Graphstrukturen: Netzwerke komplexer Beziehungen

Bäume können nur „eins-zu-viele"-Hierarchiebeziehungen darstellen. Aber in der Realität sind viele Beziehungen „viele-zu-viele" — Ihre Freunde haben auch Freunde, zwischen Städten gibt es mehrere Wege. Eine Struktur, in der **beliebige Knoten miteinander verbunden** sein können, ist ein Graph.

<GraphStructureDemo />

### 5.1 Drei Formen von Graphen

| Typ | Merkmale | Analogie | Typische Anwendung |
|------|------|------|---------|
| **Ungerichteter Graph** | Kanten ohne Richtung, A→B gleich B→A | WeChat-Freunde (gegenseitig) | Soziale Netzwerke, Kommunikationsnetze |
| **Gerichteter Graph** | Kanten mit Richtung, A→B ≠ B→A | Weibo-Follow (einseitig) | Webseiten-Links, Abhängigkeiten |
| **Gewichteter Graph** | Kanten mit Gewicht (Entfernung, Kosten etc.) | Straßen zwischen Städten (mit Kilometern) | Karten-Navigation, Kürzeste Wege |

### 5.2 Graphtraversierung

Die Traversierung von Graphen ist komplexer als bei linearen Strukturen, da Zyklen möglich sind (A→B→C→A). Bereits „besuchte" Knoten müssen markiert werden:

| Traversierungsart | Strategie | Analogie | Anwendung |
|---------|------|------|---------|
| **BFS (Breitensuche)** | Zuerst alle Nachbarn besuchen, dann deren Nachbarn | Wellenausbreitung | Kürzeste Wege, Ebenentraversierung |
| **DFS (Tiefensuche)** | Einen Weg bis zum Ende gehen, bei Sackgasse umkehren | Labyrinth | Pfadsuche, Zusammenhangsprüfung |

::: tip Graphen in der Praxis
- **Kartennavigation**: Städte sind Knoten, Straßen sind Kanten, Navigation findet den kürzesten Pfad im Graph
- **Soziale Netzwerke**: Nutzer sind Knoten, Follow/Freunde sind Kanten, „Personen, die Sie kennen könnten" werden durch Graph-Algorithmen empfohlen
- **Paketmanager**: npm/pip-Abhängigkeiten sind gerichtete Graphen, `npm install` ist eine topologische Sortierung
:::

---

## 6. Performance-Vergleich: Alle Datenstrukturen auf einen Blick

So viele Datenstrukturen gelernt — wie groß sind die Performance-Unterschiede? Die folgende interaktive Vergleichstabelle hilft beim Aufbau einer Intuition:

<DataStructureDemo />

**Kern-Performance-Vergleichstabelle:**

| Datenstruktur | Zugriff | Suche | Einfügen | Löschen | Platz |
|---------|------|------|------|------|------|
| **Array** | O(1) | O(n) | O(n) | O(n) | O(n) |
| **Verkettete Liste** | O(n) | O(n) | O(1) | O(1) | O(n) |
| **Stack/Queue** | O(n) | O(n) | O(1) | O(1) | O(n) |
| **Hashtabelle** | — | O(1) | O(1) | O(1) | O(n) |
| **Binärer Suchbaum** | — | O(log n) | O(log n) | O(log n) | O(n) |
| **Graph** | — | O(V+E) | O(1) | O(E) | O(V+E) |

::: tip Wie liest man diese Tabelle?
- **O(1)**: Unabhängig von der Datenmenge konstante Operationszeit — am schnellsten
- **O(log n)**: Datenmenge verdoppelt sich, Zeit wächst nur um einen Schritt — sehr schnell
- **O(n)**: Datenmenge verdoppelt sich, Zeit verdoppelt sich — durchschnittlich
- **O(V+E)**: Abhängig von Knoten- und Kantenzahl — Graph-spezifische Darstellung

Hinweis: Dies sind alles **Durchschnittswerte**. Im schlimmsten Fall degeneriert die Hashtabelle zu O(n) und der binäre Suchbaum ebenfalls.
:::

---

## 7. Auswahlleitfaden: Welche Datenstruktur verwenden

Mit all diesen Datenstrukturen — wie wählen Sie bei echten Anforderungen? Der Schlüssel ist, **vom Bedarf auszugehen** und sich folgende Fragen zu stellen:

1. **Welche Operation ist am häufigsten?** Suchen? Einfügen? Löschen? Traversieren?
2. **Welche Beziehung haben die Daten?** Eins-zu-eins? Eins-zu-viele? Viele-zu-viele?
3. **Wie groß ist die Datenmenge?** Bei wenigen Dutzend und bei Millionen kann die optimale Wahl völlig unterschiedlich sein
4. **Muss sortiert sein?** Ob die Daten in einer bestimmten Reihenfolge traversiert werden müssen

<DataStructureSelectorDemo />

**Schnell-Entscheidungsfluss:**

| Ihr Bedarf | Empfohlene Struktur | Begründung |
|---------|---------|------|
| Schneller Zugriff nach Position | Array | O(1) wahlfreier Zugriff |
| Häufiges Einfügen/Löschen in der Mitte | Verkettete Liste | O(1) Einfügen/Löschen, keine Elementverschiebung |
| LIFO (Rückgängig, Rekursion) | Stack | LIFO-Semantik passt natürlich |
| FIFO (Aufgabenwarteschlange) | Queue | FIFO-Semantik passt natürlich |
| Schnelle Suche nach Schlüssel | Hashtabelle | O(1) durchschnittliche Suche |
| Sortierte Daten + schnelle Suche | Binärer Suchbaum | O(log n) Suche und sortiert |
| Komplexe Viele-zu-Viele-Beziehungen | Graph | Kann beliebige Verbindungen zwischen Knoten ausdrücken |

::: tip Erfahrungsregeln in der Praxis
- In **80 % der Fälle** reichen Arrays und Hashtabellen
- Wenn **Sortierung** nötig ist, Bäume in Betracht ziehen
- Bei **komplexen Beziehungen**, Graphen in Betracht ziehen
- **Unsicher?** Einfachste zuerst, bei Performance-Problemen wechseln. Vorzeitige Optimierung ist die Wurzel allen Übels
:::

---

## Zusammenfassung

> Datenstrukturen sind das Skelett des Programms. **Arrays** sind wie eine nummerierte Schließfachreihe — am schnellsten nach Position; **Verkettete Listen** wie eine Schnitzeljagd-Hinweiskette — am flexibelsten beim Einfügen/Löschen; **Hashtabellen** wie ein Bibliothekskatalog — am schnellsten beim Suchen nach Namen; **Bäume** wie ein Stammbaum — drücken Hierarchien aus und bleiben sortiert; **Graphen** wie ein U-Bahn-Plan — stellen beliebige komplexe Netzwerkbeziehungen dar. Es gibt keine beste Datenstruktur, nur die passende — entscheidend ist, die Stärken und Kosten jeder Struktur zu verstehen und basierend auf den tatsächlichen Anforderungen abzuwägen.

---

## Weiterführende Literatur

| Thema | Empfohlene Ressource |
|------|---------|
| Datenstruktur-Visualisierung | [VisuAlgo](https://visualgo.net/) — Animierte Demonstrationen verschiedener Datenstrukturen und Algorithmen |
| Algorithmen und Datenstrukturen | „Grokking Algorithms" — Aditya Bhargava, anschaulich und einsteigerfreundlich |
| Tieferes Verständnis | „Datenstrukturen und Algorithmen" — Mark Allen Weiss |
| Übungen | [LeetCode](https://leetcode.com/) — Übung nach Datenstruktur-Kategorien |

---

## Nächste Schritte

Nun haben Sie die Kernkonzepte von Datenstrukturen gemeistert. Als Nächstes können Sie lernen:

- **[Algorithmisches Denken](./algorithm-thinking.md)**: Lernen Sie, Probleme mit Sortierung, Suche, Rekursion und dynamischer Programmierung zu lösen
- **[Programmiersprachen](./programming-languages.md)**: Verstehen Sie, wie verschiedene Sprachen diese Datenstrukturen implementieren
