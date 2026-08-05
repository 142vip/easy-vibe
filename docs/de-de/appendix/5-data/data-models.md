# Datenmodelle: Modellierungsgrundlagen

::: tip 🎯 Kernfrage
**Warum kann man nicht einfach alle Daten in MySQL-Tabellen stecken?** Wenn Ihre Daten soziale Netzwerke, Millionen von Sensormeldungen pro Sekunde oder semantische Vektoren sind, die KI verstehen soll, stößt das relationale Tabellenmodell an seine Grenzen. Verschiedene Datenformen erfordern unterschiedliche Modellierungsansätze.
:::

---

## 1. Jenseits des Relationalen: Motivation von braucht man andere Datenmodelle

Relationale Datenbanken (MySQL, PostgreSQL) organisieren Daten in „Tabelle + Zeile + Spalte" und eignen sich für strukturierte Geschäftsdaten mit festem Schema und klaren Beziehungen. Die Daten der realen Welt sind jedoch viel vielfältiger:

| Datenform | Schwachstelle des Relationalen | Passenderes Modell |
|----------|-------------|-------------|
| Nutzerprofile (variable Felder, verschachtelte Strukturen) | Häufige ALTER TABLE, viele NULL-Spalten | **Dokumentenmodell** |
| Soziale Netzwerke (Freunde von Freunden von Freunden) | Mehrstufige JOINs mit exponentiellem Leistungsabfall | **Graphmodell** |
| Monitoring-Metriken (Millionen Schreibvorgänge pro Sekunde) | Schreib-Engpass, historische Daten blähen auf | **Zeitreihenmodell** |
| AI-semantische Suche („inhaltlich ähnliche" Inhalte) | Semantische Ähnlichkeit kann nicht ausgedrückt werden | **Vektormodell** |

::: info 💡 Kernbotschaft
Es geht nicht um „Ersetzen" des Relationalen, sondern um „Ergänzung". Der Kern der meisten Systeme läuft weiterhin auf MySQL/PostgreSQL, aber in bestimmten Szenarien bringt der Einsatz spezialisierter Datenmodelle Leistungssteigerungen um Größenordnungen.
:::

---

## 2. Dokumentenmodell (Document)

### 2.1 Was ist das Dokumentenmodell

Das Dokumentenmodell speichert Daten als **JSON/BSON-Dokumente**. Jeder Datensatz ist ein in sich geschlossenes Dokument, das eine unterschiedliche Feldstruktur aufweisen kann.

```json
{
  "_id": "user_1001",
  "name": "Max Müller",
  "tags": ["VIP", "aktiv"],
  "address": { "city": "Berlin", "district": "Mitte" },
  "orders": [
    { "id": "o1", "amount": 299 },
    { "id": "o2", "amount": 599 }
  ]
}
```

**Hauptmerkmale:**
- **Kein Schema-Zwang**: Keine vorab definierte Tabellenstruktur nötig; Felder können jederzeit hinzugefügt oder entfernt werden
- **Verschachtelte Strukturen**: Adresse und Bestellungen sind direkt im Dokument eingebettet; ein Lesevorgang liefert alle Daten
- **Horizontale Skalierung**: Natürlich geeignet für Sharding, problemlos für massive Datenmengen

### 2.2 Dokument vs. Relational

| Vergleichsdimension | Relational (MySQL) | Dokument (MongoDB) |
|----------|----------------|------------------|
| Datenstruktur | Feste Schemata, Änderung über ALTER TABLE | Flexibles Schema, Felder jederzeit ergänzbar |
| Verschachtelte Daten | Mehrere Tabellen-JOINs erforderlich | Direkt im Dokument eingebettet |
| Datensatzübergreifende Beziehungen | JOIN ist sehr leistungsstark | Beziehungsabfragen sind schwächer |
| Passende Szenarien | Geschäftsdaten mit stabiler Struktur | Inhaltsdaten mit variabler Struktur |

### 2.3 Typische Szenarien

- **CMS-Content-Management**: Artikel, Kommentare, Tags mit unterschiedlicher Struktur
- **Nutzerprofile**: Unterschiedliche Nutzer haben unterschiedliche Attributfelder
- **Produktkatalog**: Handys haben „Bildschirmgröße", Lebensmittel haben „Haltbarkeit" — völlig unterschiedliche Felder
- **Konfigurationszentrale**: Die Konfigurationsstruktur der einzelnen Dienste ist nicht einheitlich

::: warning ⚠️ Häufiger Irrtum
„MongoDB erfordert kein Datenstrukturdesign" — Falsch! Das Dokumentenmodell erfordert ebenfalls sorgfältiges Design: Verschachtelungsebenen sollten nicht zu tief sein, und häufig aktualisierte Subdokumente sollten als separate Collections aufgeteilt werden.
:::

---

## 3. Graphmodell (Graph)

### 3.1 Was ist das Graphmodell

Das Graphmodell drückt Entitäten und deren Beziehungen durch **Knoten (Nodes)** und **Kanten (Edges)** aus. Jeder Knoten ist eine Entität, jede Kante eine Beziehung; sowohl Knoten als auch Kanten können Eigenschaften tragen.

```
(Max) --[folgt]--> (Anna) --[folgt]--> (Tom)
   |                                    |
   +--------[kauft]----> (iPhone) <--[kauft]--+
```

### 3.2 Die Killer-Fähigkeit des Graphmodells: Multi-Hop-Abfragen

**Szenario**: In einem sozialen Netzwerk die „Freunde von Freunden von Freunden" finden

Relationale Vorgehensweise (3-stufiger JOIN):
```sql
SELECT DISTINCT f3.name
FROM friends f1
JOIN friends f2 ON f1.friend_id = f2.user_id
JOIN friends f3 ON f2.friend_id = f3.user_id
WHERE f1.user_id = 1001;
```

Graphdatenbank-Vorgehensweise (Cypher-Abfragesprache):
```cypher
MATCH (me)-[:FOLLOWS*1..3]->(target)
WHERE me.name = 'Max'
RETURN DISTINCT target.name
```

Im Relationalen führt jeder zusätzliche Hop zu einem weiteren JOIN mit exponentiellem Leistungsabfall. Graphdatenbanken traversieren Beziehungen über Zeiger direkt, sodass die Leistung von Multi-Hop-Abfragen nahezu konstant bleibt.

### 3.3 Typische Szenarien

- **Soziale Netzwerke**: Freundesempfehlungen, gemeinsame Kontakte, Einflussausbreitung
- **Wissensgraphen**: Entitätsbeziehungs-Schlussfolgerungen („Wessen Lehrer ist Schüler von wem")
- **Betrugserkennung**: Geldkreisläufe und zusammenhängende Kontonetzwerke aufdecken
- **Empfehlungssysteme**: Empfehlungen basierend auf Nutzer-Produkt-Tag-Beziehungsgraphen

---

## 4. Zeitreihenmodell (Time-Series)

### 4.1 Was ist das Zeitreihenmodell

Das Zeitreihenmodell verwendet **Zeitstempel** als zentrale Achse und ist auf Szenarien optimiert, in denen „chronologisch geschrieben und nach Zeitbereichen abgefragt" wird.

```
timestamp            device      cpu_usage   memory
2024-01-15 10:00:01  server-01   45%         12.3GB
2024-01-15 10:00:02  server-01   67%         12.5GB
2024-01-15 10:00:03  server-01   92%         14.1GB
```

### 4.2 Warum MySQL nicht für Zeitreihendaten verwenden

| Problem | MySQL | Zeitreihen-Datenbank (InfluxDB) |
|------|-------|----------------------|
| Schreibrate | Zehntausende/Sekunde | **Millionen/Sekunde** |
| Historische Daten | Manuelle Bereinigung, Tabellen werden immer größer | **Automatische Ablaufrichtlinien** (TTL) |
| Aggregationsabfragen | GROUP BY ist langsam | **Eingebautes Downsampling** (5 Sek. → 1-Min.-Durchschnitt) |
| Speichereffizienz | Universeller Speicher, Platzverschwendung | **Spaltenbasierte Kompression**, 90 % Platzersparnis |

### 4.3 Typische Szenarien

- **Server-Monitoring**: CPU, Speicher, Festplatte — sekündliche Erfassung
- **IoT-Sensoren**: Temperatur, Luftfeuchtigkeit, GPS-Tracks
- **Finanzmarktdaten**: Aktienkurse, Handelsvolumen in Sekundenauflösung
- **Log-Analyse**: Zeitreien-Aggregation von Anwendungslogs

---

## 5. Vektormodell (Vector)

### 5.1 Was ist das Vektormodell

Das Vektormodell wandelt unstrukturierte Daten wie Text, Bilder und Audio über **Embedding-Modelle** in hochdimensionale numerische Vektoren um und misst dann die semantische Ähnlichkeit durch die Berechnung von Vektorabständen.

```
"leckeres japanisches Essen" → Embedding → [0.82, 0.15, 0.91, 0.33, ...]
                                    ↓ Kosinusähnlichkeit
"Ginza Sushi-Meister"  → [0.80, 0.18, 0.89, ...] → 96 % ähnlich
"Italienische Pizza"    → [0.12, 0.85, 0.20, ...] → 31 % ähnlich
```

### 5.2 Vektorsuche vs. Schlüsselwortsuche

| Vergleich | Schlüsselwortsuche (LIKE / Volltextindex) | Vektorsuche |
|------|---------------------------|---------|
| Suchmethode | Exakter String-Abgleich | Semantische Ähnlichkeitssuche |
| „leckeres japanisches Essen" | Findet nur Texte, die „japanisch" enthalten | Findet auch „Sushi", „Sashimi", „Izakaya" |
| Mehrsprachigkeit | Getrennte Verarbeitung erforderlich | Sprachübergreifendes semantisches Verständnis |
| Multimodalität | Nur Text | Einheitliche Suche über Text, Bild und Audio |

### 5.3 Typische Szenarien

- **RAG (Retrieval-Augmented Generation)**: Bereitstellung relevanter Wissensfragmente für LLMs
- **Semantische Suche**: Verständnis der Nutzerintention statt bloßer Schlüsselwörter
- **Bild-zu-Bild-Suche**: Bild hochladen und visuell ähnliche Bilder finden
- **Empfehlungssysteme**: Ähnlichkeitsempfehlungen basierend auf Inhaltssemantik

::: tip 💡 Auswahl von Vektordatenbanken
- **Eigenständige Vektordatenbanken**: Pinecone, Milvus, Weaviate — auf Vektorsuche spezialisiert, beste Leistung
- **Erweiterungen klassischer Datenbanken**: pgvector (PostgreSQL), Atlas Vector Search (MongoDB) — Architekturkomplexität reduzieren
- **In-Memory-Vektorbibliotheken**: FAISS, Annoy — geeignet für kleine Datensätze mit niedriger Latenz
:::

---

## 6. Auswahl-Entscheidung: Ansatz für wählt man das passende Datenmodell

| Wie sehen Ihre Daten aus? | Empfohlenes Modell | Repräsentative Produkte |
|-------------------|---------|---------|
| Feste Struktur, klare Beziehungen (Bestellungen, Nutzer) | Relational | MySQL, PostgreSQL |
| Flexible Struktur, viele Verschachtelungen (Content, Konfiguration) | Dokument | MongoDB, DynamoDB |
| Komplexe Beziehungen zwischen Entitäten, Multi-Hop-Traversierung erforderlich | Graph | Neo4j, Amazon Neptune |
| Chronologisch schreiben, nach Zeitbereichen abfragen | Zeitreihe | InfluxDB, TimescaleDB |
| Unstrukturierte Daten, semantische Ähnlichkeitssuche erforderlich | Vektor | Pinecone, Milvus, pgvector |

::: info 🎯 Praxisratgeber
Moderne Systeme nutzen in der Regel **Multi-Modell-Mischungen**:
- **Kerngeschäft** auf PostgreSQL (Relational)
- **Nutzerverhaltens-Logs** auf InfluxDB (Zeitreihe)
- **AI-Wissensbasis** auf Milvus + pgvector (Vektor)
- **Empfehlungs-Engine** auf Neo4j (Graph)

Streben Sie nicht danach, „eine Datenbank für alle Probleme" zu finden, sondern geben Sie jedem Daten-Typ das passende Zuhause.
:::

<DataModelsDemo />
