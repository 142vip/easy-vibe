# Suchmaschinen: Indizierung und Abfrage

::: tip Vorwort
**Du suchst auf Taobao nach "rotes Kleid" und findest in 0,1 Sekunden aus Milliarden von Produkten die relevantesten Ergebnisse — wie funktioniert das?** Suchmaschinen sind eine der wichtigsten Infrastrukturen des Internets. Von Google bis zur internen Suche von E-Commerce-Plattformen — das Kernprinzip ist immer dasselbe: Invertierter Index + Relevanz-Ranking.
:::

**Was wirst du in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels wirst du Folgendes erhalten:

- **Invertierter Index**: Die wichtigste Datenstruktur von Suchmaschinen verstehen
- **Segmentierungstechnologie**: Die Herausforderungen und gängigen Lösungen der chinesischen Wortsegmentierung kennenlernen
- **Relevanz-Ranking**: Die Grundprinzipien von TF-IDF und BM25 beherrschen
- **Elasticsearch**: Architektur und Anwendungsszenarien der beliebtesten Suchmaschine verstehen
- **Suchoptimierung**: Synonyme, Rechtschreibkorrektur, Autovervollständigung und andere nützliche Suchfunktionen beherrschen

| Kapitel | Inhalt | Kernkonzept |
|-----|------|---------|
| **Kapitel 1** | Invertierter Index | Vorwärts-Index vs. invertierter Index |
| **Kapitel 2** | Segmentierung und Analyse | Chinesische Segmentierung, Stoppwörter, Wortstammreduktion |
| **Kapitel 3** | Relevanz-Ranking | TF-IDF, BM25 |
| **Kapitel 4** | Elasticsearch | Verteilte Architektur, Shards, Replikas |
| **Kapitel 5** | Suchoptimierung | Synonyme, Korrektur, Autovervollständigung |

---

## 0. Übersicht: Überblick über ist die Essenz der Suche

Die Essenz der Suche ist ein **Information Retrieval**-Problem: Zu einer gegebenen Anfrage die relevantesten Ergebnisse aus einer riesigen Dokumentmenge finden und nach Relevanz sortiert zurückgeben.

Dieser Prozess ist in zwei Phasen unterteilt:

- **Indexierungsphase (Offline)**: Alle Dokumente im Voraus verarbeiten und eine effiziente Suchstruktur aufbauen
- **Abfragephase (Online)**: Wenn der Benutzer Suchbegriffe eingibt, schnell passende Dokumente finden und sortieren

::: tip Warum kann man nicht einfach eine Datenbank-LIKE-Abfrage verwenden?
`SELECT * FROM products WHERE name LIKE '%rotes Kleid%'` scheint zu funktionieren, erfordert aber einen **Full Table Scan** — jede Zeile wird einzeln geprüft. Bei Datenmengen im Millionenbereich wird diese Abfrage unbrauchbar langsam. Der invertierte Index verwandelt diese O(n)-Operation in eine O(1)-Suche.
:::

---

## 1. Invertierter Index: Das "Herz" der Suchmaschine

Herkömmliche Datenbanken verwenden einen **Vorwärts-Index**: Von der Dokument-ID zum Dokumentinhalt. Suchmaschinen verwenden einen **invertierten Index**: Vom Schlüsselwort zur Liste der Dokumente, die es enthalten.

<InvertedIndexDemo />

| Indextyp | Richtung | Suchmethode | Anwendungsszenario |
|---------|------|---------|---------|
| Vorwärts-Index | Dokument → Inhalt | ID bekannt, Inhalt suchen | Datenbank-Primärschlüsselabfrage |
| Invertierter Index | Schlüsselwort → Dokumentliste | Schlüsselwort bekannt, Dokumente suchen | Volltextsuche |

::: tip Der Aufbau eines invertierten Index
1. **Dokumente sammeln**: Alle durchsuchbaren Dokumente erfassen
2. **Segmentierung (Tokenization)**: Jedes Dokument in einzelne Wörter (Tokens) zerlegen
3. **Mapping erstellen**: Erfassen, in welchen Dokumenten jedes Wort vorkommt (sowie Position, Häufigkeit usw.)
4. **Persistent speichern**: Den Index auf die Festplatte schreiben für schnelle Suchen
:::

---

## 2. Segmentierung und Textanalyse

Die Segmentierung (Worttrennung) ist der erste Schritt in einer Suchmaschine und die größte Herausforderung bei der chinesischen Suche. Englisch ist von Natur aus durch Leerzeichen getrennt, aber Chinesisch hat keine Trennzeichen — "乒乓球拍卖了" kann als "乒乓球/拍卖/了" oder als "乒乓/球拍/卖/了" segmentiert werden.

| Segmentierungsmethode | Beschreibung | Beispiel |
|---------|------|------|
| Standard-Segmentierung | Trennung nach Leerzeichen und Satzzeichen (Englisch) | "hello world" → ["hello", "world"] |
| Chinesische Segmentierung | Basierend auf Wörterbuch oder Modell | "搜索引擎" → ["搜索", "引擎"] |
| N-gram | Trennung nach festem gleitendem Fenster | "搜索" → ["搜索", "索引"] |
| Benutzerdefiniertes Wörterbuch | Branchenspezifische Fachbegriffe hinzufügen | "iPhone16ProMax" als ein Wort |

::: tip Textanalyse-Pipeline
Segmentierung ist nur ein Schritt der Textanalyse. Die vollständige Pipeline umfasst:
1. **Zeichenfilterung**: HTML-Tags, Sonderzeichen entfernen
2. **Segmentierung**: Text in Wörter (Tokens) zerlegen
3. **Stoppwort-Filterung**: Bedeutungslose高频-Wörter wie "的", "了", "是" entfernen
4. **Synonymerweiterung**: "手机" zu "手机、电话、移动电话" erweitern
5. **Wortstammreduktion (Stemming)**: "running" zu "run" reduzieren (Englisch)
:::

---

## 3. Relevanz-Ranking: Welches Ergebnis ist am "relevantesten"

Die passenden Dokumente zu finden ist nur der erste Schritt. Noch wichtiger ist die **Sortierung** — die relevantesten Ergebnisse oben.

| Algorithmus | Prinzip | Merkmale |
|------|------|------|
| TF-IDF | Term Frequency (TF) × Inverse Document Frequency (IDF) | Klassischer Algorithmus, einfach und effektiv |
| BM25 | Verbesserte Version von TF-IDF mit Dokumentlängen-Normalisierung | Standard-Algorithmus in Elasticsearch |
| Vektorabfrage | Dokumente und Anfragen in Vektoren umwandeln, Kosinusähnlichkeit berechnen | Unterstützt semantische Suche |

::: tip TF-IDF intuitiv erklärt
- **TF (Term Frequency)**: Je häufiger ein Wort in einem Dokument vorkommt, desto wahrscheinlicher ist das Dokument mit diesem Wort relevant
- **IDF (Inverse Document Frequency)**: Je weniger Dokumente ein Wort enthalten, desto höher seine Unterscheidungskraft
- "的" kommt in allen Dokumenten vor (niedrige IDF), daher ist die Suche nach "的" sinnlos
- "Elasticsearch" kommt nur in wenigen Dokumenten vor (hohe IDF), die Suche danach ist präzise
:::

---

## 4. Elasticsearch: Die beliebteste Suchmaschine

Elasticsearch ist derzeit die beliebteste Open-Source-Suchmaschine, basierend auf Apache Lucene, und bietet verteilte Volltextsuche mit RESTful API.

| Konzept | Beschreibung |
|------|------|
| Index | Ähnlich wie eine Datenbank-"Tabelle", speichert gleichartige Dokumente |
| Document | Ein Datensatz im JSON-Format |
| Shard | Ein Shard, der den Index auf mehrere Knoten aufteilt |
| Replica | Replika, bietet Hochverfügbarkeit und Lese-Skalierung |
| Mapping | Feld-Typdefinition, ähnlich wie ein Datenbank-Schema |
| Analyzer | Textanalysegerät, definiert Segmentierungsregeln |

::: tip ES vs. Datenbank
Elasticsearch dient nicht als Ersatz für eine Datenbank, sondern als Suchschicht, die mit der Datenbank zusammenarbeitet. Typische Architektur: Daten werden in die Datenbank geschrieben → zu ES synchronisiert → Suchanfragen gehen an ES → Detailanfragen gehen an die Datenbank.
:::

---

## 5. Suchoptimierung: Die Suche "intelligenter" machen

| Optimierungsmethode | Beschreibung | Wirkung |
|---------|------|------|
| Synonyme | "手机" findet auch "电话" | Höherer Recall |
| Rechtschreibkorrektur | "iphoen" wird automatisch zu "iphone" korrigiert | Fehlertoleranz |
| Autovervollständigung | Eingabe von "苹" schlägt "苹果手机" vor | Bessere Nutzererfahrung |
| Hervorhebung (Highlighting) | Übereinstimmende Wörter in den Ergebnissen farblich markieren | Übersichtliche Darstellung |
| Gewichtsanpassung | Titel-Übereinstimmung höher gewichten als Inhalts-Übereinstimmung | Höhere Präzision |
| Filter und Aggregation | Nach Preisbereich, Marke filtern | Ergebnisse eingrenzen |

---

## Zusammenfassung

Suchmaschinen sind eine Kerninfrastruktur von Internetanwendungen. Wer den invertierten Index, die Segmentierung und das Relevanz-Ranking verstanden hat, hat die Essenz von Suchmaschinen begriffen.

Wichtige Erkenntnisse dieses Kapitels:

1. **Invertierter Index**: Die Rückwärtsabbildung von Schlüsselwort zu Dokument ist die Kern-Datenstruktur von Suchmaschinen
2. **Segmentierung als Fundament**: Die chinesische Segmentierung ist der Schlüssel zur Suchqualität und erfordert die Wahl des richtigen Segmentierers
3. **BM25-Ranking**: Auf Wortfrequenz und Dokumentfrequenz basierende Relevanzbewertung, der Standard-Algorithmus in ES
4. **ES-Architektur**: Shards + Replikas für Verteilung und Hochverfügbarkeit
5. **Suchoptimierung**: Synonyme, Korrektur, Autovervollständigung machen die Suche intelligenter

## Weiterführende Literatur

- [Elasticsearch Offizielle Dokumentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) - Die autoritativste ES-Referenz
- [Elasticsearch: The Definitive Guide](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html) - Chinesisches Einsteiger-Tutorial
- [Apache Lucene](https://lucene.apache.org/) - Die zugrundeliegende Suchmaschinen-Bibliothek von ES
- [MeiliSearch](https://www.meilisearch.com/) - Leichtgewichtige Suchmaschine für kleine bis mittlere Projekte
- [Typesense](https://typesense.org/) - Open-Source-Echtzeit-Suchmaschine
