# Caching: Leistungsoptimierung
::: tip 🎯 Kernfrage
**Warum laden manche Websites in 50 Millisekunden, während andere 5 Sekunden brauchen?** Das ist, als würde man fragen: Warum dauert es 1 Sekunde, ein Buch aus dem Schulranzen zu holen, aber 10 Minuten, es in der Bibliothek zu suchen? Die Antwort lautet – Caching. Dieses Kapitel führt dich tief in die Kernprinzipien, Designmuster und praktischen Techniken des Cachings ein, damit du deine Systemleistung um das 100-fache steigern kannst.
:::

---

## 1. Warum „Caching"

### 1.1 Die Entwicklung vom „Jedes-mal-Nachschlagen" zum „Häufige-Daten-Merken"

In den frühen Tagen der Computerwelt mussten Programmierer bei jedem Datenbedarf die Festplatte oder Datenbank abfragen. Das ist, als würde man bei jeder Matheaufgabe im Buch die Formel nachschlagen – zwar genau, aber sehr ineffizient. Mit wachsender Systemgröße zeigte dieser „Jedes-mal-Nachschlagen"-Ansatz gravierende Probleme: Die Datenbank-CPU stieg auf 95 %, die Antwortzeit explodierte von 100 Millisekunden auf 8 Sekunden, und schließlich brach das gesamte System zusammen.

Das ist wie ein Schüler, der für jede Unterrichtsstunde vom Wohnheim in die Bibliothek rennt, um Material zu suchen – 50 Mal am Tag – und schließlich auf halbem Weg erschöpft zusammenbricht. Die Lösung ist einfach: Ein Heft mit häufig verwendeten Formeln im Schulranzen, sodass man bei Bedarf direkt nachschlagen kann, ohne jedes Mal in die Bibliothek zu rennen. Der Cache ist das „Formelheft" des Computersystems – er speichert häufig verwendete Daten an einem schnell zugänglichen Ort, damit das System nicht jedes Mal in die „Bibliothek" (Datenbank) gehen muss.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🐌 Ohne Cache**
- Jede Anfrage fragt die Datenbank ab
- Datenbank-CPU-Auslastung 95 %
- Antwortzeit 5–8 Sekunden
- System anfällig für Abstürze

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Mit Cache**
- 95 % der Anfragen werden direkt beantwortet
- Datenbank-CPU-Auslastung < 20 %
- Antwortzeit 50 Millisekunden
- System läuft stabil

</div>
</div>

**Das ist das Kernproblem, das „Caching" löst: Durch das Speichern von Kopien häufig verwendeter Daten werden Zugriffe auf den langsamen Speicher (Datenbank) reduziert, wodurch das System schneller und stabiler wird.**

<CachePerformanceComparisonDemo />

### 1.2 Eine wahre Geschichte: Motivation von Caching der Rettungsanker ist

Du denkst vielleicht: „Mein System läuft doch gerade gut, warum sollte ich Caching im Voraus einplanen?" Lass mich eine wahre Geschichte erzählen, damit du verstehst, warum Caching keine „Option", sondern ein „Muss" ist.

::: warning Aqiangs Datenbank-Crash
Aqiang ist Fullstack-Ingenieur in einem Startup, das eine soziale App entwickelt hat. Anfangs gab es wenige Nutzer (ein paar Hundert), das System lief normal, und Aqiang hielt Caching für unnötig – direkte Datenbankabfragen reichten.

Ein halbes Jahr später war die Nutzerzahl auf 100.000 angewachsen. Eines Tages postete ein Prominenter etwas in der App, und sofort strömten 100.000 Nutzer auf die Seite. Die Datenbank brach zusammen: CPU 100 %, Antwortzeit von 100 ms auf 30 Sekunden gestiegen, und schließlich stürzte die gesamte App ab – mit massiver Nutzerabwanderung.

Bei der Nachbesprechung wurde klar: Hätte es eine einfache Cache-Schicht (z. B. Redis) gegeben, um beliebte Beiträge zu cachen, wäre die Datenbanklast um mindestens 95 % gesenkt worden, und das System hätte diesen Traffic-Ansturm problemlos bewältigt.

Aqiang lernte daraus eine Lektion: **Caching ist kein Nice-to-have, sondern ein Rettungsanker für Systeme mit hoher Parallelität. Ohne Cache zu arbeiten ist wie Autofahren ohne Sicherheitsgurt – im Alltag fällt es nicht auf, aber im Ernstfall ist es zu spät.**
:::

::: info 💡 Kernbotschaft
Der Wert von Caching liegt nicht nur in „schneller", sondern vor allem im „Schutz". Es schützt die Datenbank vor Überlastung und hält das System auch bei hohem Traffic stabil. Wenn du ein System entwirfst, warte nicht, bis etwas schiefgeht – integriere Caching von Anfang an als Kernbestandteil deiner Architektur.
:::

---

## 2. Kernkonzepte: Überblick über Caches

::: tip 🤔 Was genau ist ein Cache?
Einfach ausgedrückt: **Ein Cache ist ein Speicherplatz für Datenkopien**. So wie ein Haftnotiz-Zettel an deinem Schreibtisch mit den wichtigsten Telefonnummern – dann musst du nicht jedes Mal das Telefonbuch durchblättern.

**Drei Kernpunkte**:
1. **Kopie**: Die Daten im Cache sind Kopien der Originaldaten (Datenbank), nicht die Primärdaten
2. **Schneller Zugriff**: Caches befinden sich normalerweise im Arbeitsspeicher, dessen Lesegeschwindigkeit 100.000-mal schneller ist als die der Festplatte
3. **Begrenzte Kapazität**: Cache-Speicher ist begrenzt und kann nur die am häufigsten verwendeten Daten speichern

**Cache ist also der Tausch von Speicherplatz gegen Geschwindigkeit** – etwas Arbeitsspeicher opfern, um extrem schnellen Datenzugriff zu erhalten.
:::

Bevor wir in die Technik eintauchen, müssen wir einige Kernkonzepte klären. Zum besseren Verständnis nutzen wir den „Schulranzen" als Analogie für ein Cache-System.

### 2.1 Die Kernkonzepte des Cachings mit der „Schulranzen-Analogie" verstehen

Stell dir vor, du bist ein Schüler und musst jeden Tag verschiedene Materialien nachschlagen. Dieser Prozess ähnelt einem Cache-System erstaunlich genau:

| Konzept | 🎒 Schulranzen-Analogie | Technische Bedeutung | Praxisbeispiel |
|------|-----------|----------|----------|
| **Cache Hit (Treffer)** | Die gesuchte Formel steht genau auf dem Haftnotizzettel | Die angeforderten Daten wurden im Cache gefunden | Benutzerinfo wird abgefragt, ist in Redis vorhanden, wird direkt zurückgegeben |
| **Cache Miss (Fehltreffer)** | Die Formel steht nicht auf dem Zettel, du musst im Buch nachschlagen | Die angeforderten Daten sind nicht im Cache | Benutzerinfo wird abgefragt, ist nicht in Redis, muss aus der Datenbank geholt werden |
| **Hit Ratio (Trefferquote)** | Bei 100 Formelabfragen waren 95 auf dem Zettel | Der Anteil der Cache-Treffer | 95 % Trefferquote bedeutet, dass 95 % der Anfragen die Datenbank nicht belasten |
| **TTL (Time To Live)** | Auf dem Zettel steht: „In 3 Tagen wegwerfen" | Die Ablaufzeit des Caches | Benutzerinfo-Cache wird nach 30 Minuten automatisch ungültig |
| **Eviction (Verdrängung)** | Der Ranzen ist voll, der älteste Zettel wird weggeworfen | Alte Daten werden gelöscht, wenn der Cache voll ist | Redis-Speicher ist voll, am wenigsten genutzte Daten werden automatisch gelöscht |

### 2.2 Cache Hit vs. Cache Miss

Der Leistungsunterschied zwischen Cache Hit und Miss ist enorm. Schauen wir uns die konkreten Zahlen an:

| Operationstyp | Antwortzeit | Relative Geschwindigkeit | Geeignetes Szenario |
|---------|---------|----------|----------|
| **CPU L1-Cache** | ~0,5 Nanosekunden | Extrem schnell (Basis) | CPU-interne Berechnungen |
| **Arbeitsspeicher-Lesen** | ~100 Nanosekunden | 200× schneller | Lokaler Cache (z. B. Caffeine) |
| **Redis-Abfrage** | ~1 Millisekunde | 2.000.000× langsamer | Verteilter Cache |
| **MySQL-Abfrage** | ~10 Millisekunden | 20.000.000× langsamer | Festplatten-Datenbankabfrage |

::: tip 📊 Was kannst du aus dieser Tabelle ablesen?
**Der Leistungsunterschied ist frappierend**: Arbeitsspeicher-Operationen sind 100.000-mal schneller als MySQL-Abfragen! Das entspricht dem Unterschied, ein Buch vom Schreibtisch zu nehmen (1 Sekunde) versus es in der Bibliothek zu suchen (100.000 Sekunden, etwa 28 Stunden).

**Drei Leistungsstufen**:
1. **Lokaler Cache (RAM)**: Am schnellsten, aber kleine Kapazität – ideal für Hot Data
2. **Redis-Cache**: Mittlere Geschwindigkeit, große Kapazität – ideal für verteilte Szenarien
3. **Datenbank**: Am langsamsten, aber unbegrenzte Kapazität – die endgültige Datenquelle

**Praktische Erkenntnis**: Dein System sollte über 95 % der Anfragen in der Cache-Schicht beantworten, nur weniger als 5 % sollten die Datenbank erreichen. So bleibt die Datenbanklast gering und die Gesamtleistung des Systems steigt erheblich.
:::

::: details 🔍 Schau dir echten Code für „Cache Hit" und „Cache Miss" an
Vergleichen wir beide Fälle im Code:

```javascript
// Szenario: Benutzerinformationen abfragen

// ===== Cache Hit (Treffer) =====
// 1. Zuerst den Redis-Cache abfragen
const userFromCache = await redis.get('user:123')
if (userFromCache) {
  // Treffer! Direkt zurückgeben, Dauer ca. 1 Millisekunde
  return JSON.parse(userFromCache)
}

// ===== Cache Miss (Fehltreffer) =====
// 2. Cache hat nichts, Datenbank abfragen
const userFromDB = await db.query('SELECT * FROM users WHERE id = 123')
// Fehltreffer! Datenbankabfrage nötig, Dauer ca. 10 ms, 10× langsamer

// 3. Nach dem Fund in den Cache schreiben, damit es beim nächsten Mal trifft
await redis.set('user:123', JSON.stringify(userFromDB), 'EX', 1800)
return userFromDB
```

**Kernpunkte**:
- Cache Hit: 1 ms Antwortzeit, exzellente Benutzererfahrung
- Cache Miss: 10 ms Antwortzeit, etwas schlechtere Benutzererfahrung
- **Der Wert des Caches**: Aus Miss einen Hit machen, Leistung um das 10-fache steigern
:::

### 2.3 Der Cache-Lebenszyklus

Ein Cache-Eintrag durchläuft von der Erstellung bis zur Löschung einen vollständigen Lebenszyklus. Diesen Prozess zu verstehen ist entscheidend für das Design von Cache-Systemen.

**Vier Phasen**:

**Phase 1: Schreiben (Write)**
- **Aktives Schreiben**: Beim Systemstart werden Hot Data vorab in den Cache geladen (Cache-Warmup)
- **Lazy Loading**: Beim ersten Zugriff aus der Datenbank laden und in den Cache schreiben (am häufigsten)

**Phase 2: Treffer/Fehltreffer (Hit/Miss)**
- Jede Anfrage prüft zuerst den Cache
- Bei Treffer direkt zurückgeben, bei Fehltreffer die Datenbank abfragen

**Phase 3: Ablauf (Expiration)**
- **TTL (Time To Live)** : Legt die Lebensdauer des Caches fest (z. B. 30 Minuten)
- Nach Ablauf wird der Cache automatisch ungültig, beim nächsten Zugriff muss neu geladen werden

**Phase 4: Verdrängung (Eviction)**
- Der Cache-Speicher ist begrenzt, wenn er voll ist, müssen alte Daten gelöscht werden
- Gängige Verdrängungsstrategien:
  - **LRU (Least Recently Used)** : Löscht die am längsten nicht verwendeten Daten (am häufigsten)
  - **LFU (Least Frequently Used)** : Löscht die am seltensten verwendeten Daten
  - **FIFO (First In First Out)** : Löscht die zuerst geschriebenen Daten

👇 **Selbst ausprobieren**:
Die folgende Demo zeigt den Cache-Lebenszyklus. Klicke auf „Neuer Cache", um zu beobachten, wie ein Cache die Phasen Schreiben, Treffer, Ablauf und Verdrängung durchläuft:

<CacheLifecycleDemo />

---

## 3. Die Evolution des Cachings: Vom Einzelrechner zum verteilten System

::: tip 🤔 Warum braucht man verschiedene Cache-Typen?
Genau wie du deine Lernmaterialien an verschiedenen Orten aufbewahrst: Die wichtigsten auf dem Schreibtisch (Haftnotizen), häufig genutzte im Schulranzen (Notizbuch), und alle Materialien in der Bibliothek (Büchersammlung).

**Genauso ist es beim Cache-System**:
- **Lokaler Cache (Schreibtisch)** : Am schnellsten, kleine Kapazität, für extrem heiße Daten
- **Verteilter Cache (Gemeinschaftsschließfach)** : Ziemlich schnell, große Kapazität, für häufig genutzte Daten
- **Datenbank (Bibliothek)** : Am langsamsten, unbegrenzte Kapazität, für alle Daten

**Warum Schichten?** Weil verschiedene Ebenen unterschiedliche Leistung und Kosten haben – nur die richtige Kombination bringt das optimale Ergebnis.
:::

Nach all den Konzepten schauen wir uns einen echten Fall an: Wie sich ein E-Commerce-System von „kein Cache" zu einer „Multi-Level-Cache-Architektur" entwickelt hat. Anhand dieses Beispiels wirst du die Bedeutung von Cache-Design intuitiver verstehen.

### 3.1 Phase 1: Die cachefreie Ära – die Datenbank läuft ungeschützt

**Hintergrund**: In der Frühphase gab es wenige Nutzer (ein paar Hundert), alle Anfragen gingen direkt an die Datenbank, ohne jegliche Cache-Schicht.

**Technologie-Stack**:
- Datenbank: MySQL
- Kein Cache: Kein Redis, kein lokaler Cache

**Systemarchitektur**:
```
Nutzeranfrage → Anwendungsserver → MySQL-Datenbank
```

**Merkmale dieser Phase**:
- ✅ **Vorteil**: Einfache Architektur, schnelle Entwicklung
- ❌ **Nachteil**: Hohe Datenbanklast, schlechte Leistung, Zusammenbruch ab wenigen tausend Nutzern

::: details Code und Probleme dieser Phase ansehen
**Codebeispiel** (jedes Mal die Datenbank abfragen):

```javascript
// Produktdetails abrufen – jedes Mal die Datenbank abfragen
async function getProduct(productId) {
  // Direkt die Datenbank abfragen, ohne jeglichen Cache
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )
  return product
}
```

**Aufgetretene Probleme**:
1. **Datenbank-CPU schießt in die Höhe**: Jede Anfrage fragt die Datenbank ab, CPU-Auslastung 80 %+
2. **Langsame Antwortzeiten**: Komplexe Abfragen brauchen 50–100 ms, schlechte Benutzererfahrung
3. **Schlechte Parallelitätsfähigkeit**: Die Datenbank schafft maximal 2.000 QPS (Queries per Second), darüber hinaus Absturz
4. **Hot-Product-Problem**: Beliebte Produktdetailseiten werden ständig abgefragt, die Datenbank wird zum Flaschenhals

**Damalige Übergangslösungen**:
- Teurere Server kaufen (mehr CPU, RAM) – hohe Kosten, begrenzte Wirkung
- Datenbank-Read/Write-Splitting – entlastet Lesevorgänge, aber Schreibdruck bleibt
- SQL-Optimierung – bringt 20–30 % Verbesserung, löst aber nicht das Grundproblem
:::

Dieser „ungeschützte" Modus funktionierte noch bei < 1.000 Nutzern, aber als die Nutzerzahl auf 10.000 und 100.000 anwuchs, brach die Datenbank immer häufiger zusammen. Das Team musste dringend Caching einführen.

### 3.2 Phase 2: Einführung von Redis-Cache – 10-fache Leistungssteigerung

**Hintergrund**: Die Nutzerzahl wuchs auf 10.000, die Datenbank kam nicht mehr mit, das Team entschied sich, Redis als Cache-Schicht einzuführen.

**Technologie-Stack**:
- Datenbank: MySQL
- Cache: Redis (Einzelinstanz)

**Systemarchitektur**:
```
Nutzeranfrage → Anwendungsserver → Redis-Cache (nur bei Miss zur DB) → MySQL-Datenbank
```

**Merkmale dieser Phase**:
- ✅ **Vorteil**: 10-fache Leistungssteigerung, Datenbanklast um 90 % reduziert
- ❌ **Nachteil**: Redis-Single-Point-of-Failure, mögliche Inkonsistenz zwischen Cache und Datenbank

::: details Implementierungscode des Redis-Caches ansehen
**Codebeispiel** (mit Redis-Cache):

```javascript
// Produktdetails abrufen – erst Redis, dann Datenbank
async function getProduct(productId) {
  // 1. Zuerst Redis-Cache abfragen
  const cacheKey = `product:${productId}`
  const cached = await redis.get(cacheKey)

  if (cached) {
    // Cache-Treffer! Direkt zurückgeben, ca. 1 ms
    return JSON.parse(cached)
  }

  // 2. Cache-Miss, Datenbank abfragen
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 3. Nach Fund in Redis schreiben, 30 Minuten Ablaufzeit
  await redis.setex(
    cacheKey,
    1800,  // 30 Minuten = 1800 Sekunden
    JSON.stringify(product)
  )

  return product
}
```

**Leistungsvergleich**:

| Szenario | Ohne Cache | Mit Redis-Cache | Steigerung |
|------|-------|--------------|---------|
| Normale Produktabfrage | 50 ms | 5 ms (bei Cache-Treffer) | **10×** |
| Beliebte Produktabfrage | 80 ms | 1 ms (95 % Trefferquote) | **80×** |
| Datenbank-QPS | 2.000 (Volllast) | 200 (90 % vom Cache abgefangen) | **Datenbanklast 10× reduziert** |
| Maximale Parallelität | 2.000 Nutzer | 20.000 Nutzer | **10×** |

**Erzielte Verbesserungen**:
1. **Antwortgeschwindigkeit**: Bei Cache-Treffer von 50 ms auf 1–5 ms reduziert
2. **Parallelitätsfähigkeit**: Unterstützte Nutzerzahl von 2.000 auf 20.000 gestiegen
3. **Datenbanklast**: 90 % der Anfragen von Redis abgefangen, Datenbank-CPU von 80 % auf 20 % gesunken
4. **Benutzererfahrung**: Seitenladezeiten deutlich verbessert, weniger Nutzerbeschwerden

**Neue Herausforderungen**:
1. **Cache-Konsistenzproblem**: Produktpreis wurde geändert, Datenbank aktualisiert, aber Cache noch alt
2. **Cache Penetration**: Bösartige Anfragen mit nicht existierenden Produkt-IDs (z. B. id=-1) gehen jedes Mal bis zur Datenbank durch
3. **Cache Lawine**: Nach Systemneustart laufen alle Caches gleichzeitig ab, ein plötzlicher Ansturm von Anfragen trifft die Datenbank
4. **Redis-Single-Point-of-Failure**: Redis fällt aus, alle Anfragen gehen direkt an die Datenbank, System droht abzustürzen

**Lösungen**:
- **Cache-Konsistenz**: Bei Datenbank-Update den Cache synchron löschen
- **Cache Penetration**: Auch nicht existierende Daten in Redis cachen (Value als leer, TTL kürzer, z. B. 5 Minuten)
- **Cache Lawine**: Cache-Ablaufzeiten mit zufälligen Werten versehen, um gleichzeitiges Ablaufen zu vermeiden
:::

Nach der Einführung von Redis stieg die Systemleistung erheblich, aber neue Probleme tauchten auf. Das Team begann zu erforschen, wie man diese cachebezogenen Probleme lösen kann.

### 3.3 Phase 3: Multi-Level-Cache-Architektur – weitere 5-fache Leistungssteigerung

**Hintergrund**: Die Nutzerzahl wuchs auf 100.000, selbst der Redis-Cache wurde zum Engpass (Einzelinstanz-Redis schafft maximal ca. 100.000 QPS). Das Team entschied sich für Multi-Level-Caching.

**Technologie-Stack**:
- L1-Cache: Lokaler Anwendungscache (Caffeine)
- L2-Cache: Redis-Cluster
- Datenbank: MySQL-Master-Slave-Cluster

**Systemarchitektur**:
```
Nutzeranfrage → CDN-Cache (statische Ressourcen) → Anwendungsserver
                                                        ↓
                                      L1: Lokaler Cache (Caffeine) → Miss → L2: Redis → Miss → MySQL
```

**Merkmale dieser Phase**:
- ✅ **Vorteil**: Extreme Leistung (lokaler Cache nur 0,1 ms), hohe Verfügbarkeit (Redis-Ausfall betrifft keine Hot Data)
- ❌ **Nachteil**: Komplexe Architektur, Konsistenz über mehrere Cache-Ebenen schwer zu gewährleisten

::: details Implementierungscode des Multi-Level-Caches ansehen
**Codebeispiel** (Lokaler Cache + Redis):

```javascript
// Caffeine lokalen Cache verwenden
const caffeine = require('caffeine')
const localCache = new caffeine.Cache({
  max: 1000,              // Maximal 1000 Einträge
  ttl: 30,                // 30 Sekunden Ablaufzeit
})

// Produktdetails abrufen – zwei Cache-Ebenen
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // L1: Zuerst lokalen Cache prüfen (am schnellsten, ca. 0,1 ms)
  const localCached = localCache.get(cacheKey)
  if (localCached) {
    console.log('L1-Treffer')
    return localCached
  }

  // L2: Lokaler Cache-Miss, Redis prüfen (schnell, ca. 1 ms)
  const redisCached = await redis.get(cacheKey)
  if (redisCached) {
    console.log('L2-Treffer, fülle L1 auf')
    const product = JSON.parse(redisCached)
    // Lokalen Cache auffüllen
    localCache.set(cacheKey, product)
    return product
  }

  // L3: Auch Redis-Miss, Datenbank abfragen (am langsamsten, ca. 10 ms)
  console.log('L3-Treffer, fülle L2 und L1 auf')
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // Redis auffüllen (30 Minuten Ablaufzeit)
  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  // Lokalen Cache auffüllen
  localCache.set(cacheKey, product)

  return product
}
```

**Multi-Level-Cache Leistungsvergleich**:

| Cache-Ebene | Antwortzeit | Trefferquote | Geeignete Daten |
|---------|---------|--------|--------------|
| **L1: Lokaler Cache** | ~0,1 ms | 70 % (extrem heiß) | Beliebte Produkte, Systemkonfiguration, Benutzersitzungen |
| **L2: Redis-Cache** | ~1 ms | 25 % (normal heiß) | Die meisten Produktdaten, Bewertungsaggregationen |
| **L3: Datenbank** | ~10 ms | 5 % (kalte Daten) | Alle Produktdaten im Vollbestand |

**Gesamtleistungssteigerung**:
- **Durchschnittliche Antwortzeit**: 5 ms (Phase 2) → 1 ms (Phase 3), **weitere 5× Steigerung**
- **Maximale Parallelität**: 20.000 Nutzer (Phase 2) → 100.000 Nutzer (Phase 3), **5× Steigerung**
- **Datenbank-QPS**: 200 (Phase 2) → 50 (Phase 3), **weitere 4× Reduzierung**

**In dieser Phase gelöste neue Probleme**:
1. **Lokale Cache-Konsistenz**: Lokale Caches mehrerer Anwendungsinstanzen können inkonsistent sein (Instanz A hat alten Preis, Instanz B neuen Preis)
   - **Lösung**: Lokale Cache-TTL kurz halten (30 Sekunden), um das Inkonsistenz-Zeitfenster zu verkleinern
2. **Cache-Warmup**: Nach Systemneustart ist der lokale Cache leer, viele Anfragen gehen bis Redis durch
   - **Lösung**: Beim Systemstart aktiv Hot Data in den lokalen Cache laden
:::

Multi-Level-Cache-Architekturen werden in großen Internetunternehmen (wie Taobao, JD.com) umfassend eingesetzt und können Millionen von QPS bewältigen.

### 3.4 Gesamtüberblick der Cache-Architektur-Evolution

| Phase | Architektur | Antwortzeit | Maximale Parallelität | Kernveränderung |
|------|------|---------|---------|---------|
| **Phase 1: Kein Cache** | App → Datenbank | 50 ms | 2.000 Nutzer | Datenbank ungeschützt, schlechte Leistung |
| **Phase 2: Einzelner Cache** | App → Redis → Datenbank | 5 ms | 20.000 Nutzer | Redis eingeführt, 10× Leistungssteigerung |
| **Phase 3: Multi-Level-Cache** | App → Lokaler Cache → Redis → Datenbank | 1 ms | 100.000 Nutzer | Lokaler Cache + Redis, weitere 5× Steigerung |

::: tip 📊 Was kannst du aus dieser Tabelle ablesen?
**Phase 1 → Phase 2**: Ein qualitativer Sprung. Nach Einführung von Redis stieg die Leistung um das 10-fache, die Datenbanklast sank um 90 %. Das ist der entscheidende Schritt von „funktioniert" zu „funktioniert gut".

**Phase 2 → Phase 3**: Extreme Optimierung. Nach Einführung des lokalen Caches stieg die Leistung um weitere 5×. Das ist der Aufstieg von „funktioniert gut" zu „extrem" – geeignet für Szenarien mit sehr hohem Traffic.

**Praktische Empfehlungen**:
- **< 10.000 Nutzer**: Phase 1 (kein Cache) reicht aus, aber Einführung von Redis (Phase 2) wird empfohlen
- **10.000–100.000 Nutzer**: Phase 2 (Redis-Cache) ist die beste Wahl
- **> 100.000 Nutzer**: Phase 3 (Multi-Level-Cache) in Betracht ziehen, aber Konsistenzkomplexität beachten

**Zusammenfassung**: Die Cache-Architektur-Evolution bedeutet nicht einfach „mehr Cache-Schichten hinzufügen", sondern **die passende Architektur entsprechend der Traffic-Größe wählen** – Über-Engineering erhöht die Komplexität, Unter-Design führt zu Leistungsengpässen.
:::

---

## 4. Die drei klassischen Cache-Probleme: Penetration, Hotspot-Invalidierung und Lawine

In der Praxis bringt Caching drei klassische Problemtypen mit sich. Wenn du sie nicht kennst, kann dein System irgendwann plötzlich zusammenbrechen. Lass uns diese Probleme mit Alltagsanalogien verstehen.

### 4.1 Cache Penetration: Abfrage nicht existierender Daten

**Problemdefinition**: Eine Abfrage nach **nicht existierenden Daten** (z. B. id=-1), die weder im Cache (wurde nie gespeichert) noch in der Datenbank vorhanden sind, führt dazu, dass jede Anfrage direkt bis zur Datenbank durchdringt.

::: tip 🤔 Cache Penetration mit der „Buchsuche"-Analogie
Stell dir vor, du suchst in der Bibliothek nach einem Buch und fragst den Bibliothekar: „Gibt es das Buch ‚Die Nichtexistenz‘?"

**Normaler Ablauf**:
- Der Bibliothekar prüft den Katalog: „Das Buch gibt es nicht"
- Du gehst

**Cache-Penetration-Szenario**:
- Du fragst zum 1. Mal, der Bibliothekar prüft die Datenbank: „Nein", sagt er
- Du fragst zum 2. Mal, der Bibliothekar prüft erneut die Datenbank: „Nein"
- Du fragst zum 100. Mal, der Bibliothekar prüft immer noch die Datenbank: „Nein"

**Problem**: Der Bibliothekar (Datenbank) wird wahnsinnig, jedes Mal muss er die Datenbank prüfen, obwohl die Antwort immer „Nein" ist.

**Lösung**: Der Bibliothekar merkt sich: „Das Buch ‚Die Nichtexistenz‘ gibt es nicht". Beim nächsten Mal sagt er direkt „Nein", ohne die Datenbank zu prüfen. Das ist **Null-Objekt-Caching**.
:::

**Praxisszenarien**:
- Bösartige Angreifer konstruieren massenhaft nicht existierende IDs (z. B. id=-1, id=999999999)
- Crawler durchlaufen nicht existierende Ressourcenpfade (z. B. /api/products/invalid-id)
- Geschäftslogikfehler führen zu Abfragen ungültiger Daten

**Lösung 1: Null-Objekt-Caching**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Zuerst Cache prüfen
  const cached = await redis.get(cacheKey)
  if (cached !== null) {
    // Beachte: cached könnte der String "null" sein
    if (cached === 'null') {
      // Cache enthält „Null-Objekt", Datenbank hat diesen Eintrag nicht
      return null
    }
    return JSON.parse(cached)
  }

  // 2. Datenbank abfragen
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 3. Auch wenn die Datenbank nichts hat, "null" cachen, TTL kurz halten (z. B. 5 Minuten)
  if (!product) {
    await redis.setex(cacheKey, 300, 'null')
    return null
  }

  // 4. Daten gefunden, normal cachen
  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  return product
}
```

**Lösung 2: Bloom-Filter**

Ein Bloom-Filter ist ein Werkzeug zur schnellen Prüfung, ob Daten existieren – wie ein „Super-Index":

::: tip 📖 Was ist ein Bloom-Filter?
Stell dir eine „magische Blackbox" vor:
- Du fragst: „Existiert das Produkt mit ID 123?"
- Sie sagt: „**Existiert definitiv nicht**" → Dann existiert es wirklich nicht, keine Datenbankabfrage nötig
- Sie sagt: „**Existiert möglicherweise**" → Dann Datenbank prüfen

**Eigenschaften**:
- **Keine False Negatives**: Wenn sie sagt, es existiert nicht, dann existiert es wirklich nicht
- **Mögliche False Positives**: Wenn sie sagt, es existiert möglicherweise, könnte es tatsächlich nicht existieren (geringe, einstellbare Wahrscheinlichkeit)

**Wert**: Der Bloom-Filter kann 99 % der „Nicht-Existiert"-Anfragen abfangen, bevor sie den Cache erreichen, und schützt so die Datenbank.
:::

```javascript
// Bloom-Filter verwenden
const { BloomFilter } = require('bloom-filters')

// Bloom-Filter initialisieren (maximal 1 Million Produkt-IDs)
const bloomFilter = new BloomFilter(1000000, 0.01)  // 1 % False-Positive-Rate

// Beim Systemstart alle Produkt-IDs in den Bloom-Filter laden
async function initBloomFilter() {
  const allIds = await db.query('SELECT id FROM products')
  allIds.forEach(row => {
    bloomFilter.add(row.id)
  })
}

// Vor der Produktabfrage mit Bloom-Filter prüfen
async function getProduct(productId) {
  // 1. Zuerst Bloom-Filter prüfen
  if (!bloomFilter.has(productId)) {
    // Definitiv nicht vorhanden, direkt null zurückgeben, keine DB-Abfrage
    console.log('Bloom-Filter-Abfang: Produkt existiert nicht')
    return null
  }

  // 2. Bloom-Filter sagt „möglicherweise", Cache prüfen
  const cached = await redis.get(`product:${productId}`)
  if (cached) {
    return JSON.parse(cached)
  }

  // 3. Cache-Miss, Datenbank abfragen
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  if (!product) {
    // Bloom-Filter False Positive (sehr geringe Wahrscheinlichkeit), tatsächlich nicht vorhanden
    await redis.setex(`product:${productId}`, 300, 'null')
    return null
  }

  // 4. Daten gefunden, in Cache schreiben
  await redis.setex(`product:${productId}`, 1800, JSON.stringify(product))
  return product
}
```

### 4.2 Hotspot-Cache-Invalidierung: Ablauf heißer Daten

**Problemdefinition**: Ein **Hot-Data-Eintrag** (z. B. beliebtes Produkt, Trend-Nachricht) läuft im Cache ab (TTL erreicht). In diesem Moment treffen viele gleichzeitige Anfragen ein und gehen alle zur Datenbank, was zu einem plötzlichen Anstieg der Datenbanklast führt.

::: tip 🤔 Hotspot-Invalidierung mit der „Büchersturm"-Analogie
Stell dir vor, die Bibliothek hat ein Exemplar von „Harry Potter" – extrem beliebt, 100 Leute wollen es ausleihen.

**Normalfall**:
- Die Bibliothek legt „Harry Potter" an die Ausleihtheke (Cache)
- Alle nehmen es direkt von der Theke, ohne im Regal zu suchen

**Hotspot-Invalidierung-Szenario**:
- Die Leihfrist an der Theke ist abgelaufen (Buch wurde ins Regal zurückgestellt)
- 100 Leute kommen gleichzeitig und finden es nicht an der Theke
- Alle 100 stürmen zum Regal (Datenbank)
- Der Regalverwalter (Datenbank) wird überrannt

**Problem**: Es geht nicht um „nicht existierende Bücher", sondern darum, dass ein „extrem beliebtes Buch" plötzlich aus dem Cache verschwunden ist, wodurch eine Flut von Anfragen auf die Datenbank trifft.
:::

**Praxisszenarien**:
- Weibo-Trendliste läuft ab, zehntausende Nutzer greifen gleichzeitig zu
- Promi-Klatsch-Cache wird ungültig, Fans stürmen die Seite
- Inventardaten laufen zum Start einer Blitzverkaufs-Aktion ab

**Lösung 1: Mutex-Sperre**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Zuerst Cache prüfen
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // 2. Cache-Miss, verteilte Sperre anfordern
  const lockKey = `lock:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)  // 10 Sekunden Sperre

  if (lock === 'OK') {
    // 3. Sperre erhalten, Datenbank abfragen
    console.log('Sperre erfolgreich, Datenbankabfrage')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    // 4. In Cache schreiben
    await redis.setex(cacheKey, 1800, JSON.stringify(product))

    // 5. Sperre freigeben
    await redis.del(lockKey)
    return product
  } else {
    // 6. Sperre nicht erhalten, 50 ms warten und erneut versuchen
    console.log('Sperre fehlgeschlagen, warte und versuche erneut')
    await new Promise(resolve => setTimeout(resolve, 50))
    return getProduct(productId)  // Rekursiver Wiederholungsversuch
  }
}
```

**Lösung 2: Logischer Ablauf (Logical Expiration)**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Cache prüfen
  const cached = await redis.get(cacheKey)
  if (cached) {
    const data = JSON.parse(cached)

    // 2. Logische Ablaufzeit prüfen
    if (Date.now() < data.expireTime) {
      // Nicht abgelaufen, direkt zurückgeben
      return data.product
    } else {
      // 3. Logisch abgelaufen, Cache asynchron neu aufbauen, alte Daten zurückgeben
      console.log('Logisch abgelaufen, asynchroner Cache-Neuaufbau')
      rebuildCacheAsync(productId)  // Asynchroner Neuaufbau
      return data.product  // Alte Daten zurückgeben
    }
  }

  // 4. Cache existiert nicht (Erstladung), synchron Datenbank abfragen
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 5. In Cache schreiben (mit logischer Ablaufzeit)
  const cacheData = {
    product: product,
    expireTime: Date.now() + 30 * 60 * 1000  // Logischer Ablauf nach 30 Minuten
  }
  await redis.set(cacheKey, JSON.stringify(cacheData))

  return product
}

// Asynchroner Cache-Neuaufbau
async function rebuildCacheAsync(productId) {
  const lockKey = `rebuild:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)

  if (lock === 'OK') {
    console.log('Asynchroner Cache-Neuaufbau gestartet')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    const cacheData = {
      product: product,
      expireTime: Date.now() + 30 * 60 * 1000
    }
    await redis.set(`product:${productId}`, JSON.stringify(cacheData))
    await redis.del(lockKey)
    console.log('Asynchroner Cache-Neuaufbau abgeschlossen')
  }
}
```

### 4.3 Cache Lawine: Massenhafter gleichzeitiger Ablauf

**Problemdefinition**: Viele Cache-Einträge laufen **zum gleichen Zeitpunkt** ab (oder Redis fällt aus), sodass alle Anfragen gleichzeitig bis zur Datenbank durchgehen und diese sofort überlasten.

::: tip 🤔 Cache Lawine mit der „Bibliotheks-Massenrückgabe"-Analogie
Stell dir vor, die „Ausleihtheke" (Cache) der Bibliothek hat 1.000 Bücher.

**Normalfall**:
- Die Rückgabedaten sind gestreut: einige heute, einige morgen, einige übermorgen
- Jeden Tag laufen nur ein paar Dutzend Bücher aus, der Verwalter (Datenbank) kommt problemlos mit

**Cache-Lawine-Szenario**:
- Nach einem Systemneustart setzt der Verwalter alle 1.000 Bücher auf „Rückgabe in 30 Tagen"
- 30 Tage später laufen alle 1.000 Bücher gleichzeitig aus
- 1.000 Leute kommen gleichzeitig zum Ausleihen, finden nichts an der Theke
- Alle 1.000 stürmen zum Regal
- Der Regalverwalter (Datenbank) wird sofort überrannt

**Problem**: Es geht nicht um ein einzelnes Buch, sondern um **massenhaften gleichzeitigen Ablauf**, der die Datenbank sofort überlastet.
:::

**Praxisszenarien**:
- Nach Systemneustart werden alle Caches von Grund auf neu aufgebaut, mit gleicher TTL (z. B. 30 Minuten)
- Geplante Tasks aktualisieren Caches im Batch mit identischer Ablaufzeit
- Cache-Dienst (Redis) fällt aus oder Netzwerkpartition tritt auf

**Lösung 1: Zufällige TTL**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // Entscheidend: Zufallswert zur Basis-TTL (30 Minuten) addieren (±5 Minuten)
  const baseTTL = 1800  // 30 Minuten
  const randomOffset = Math.floor(Math.random() * 600) - 300  // -5 bis +5 Minuten
  const finalTTL = baseTTL + randomOffset

  console.log(`Cache-TTL: ${finalTTL} Sekunden (${Math.floor(finalTTL / 60)} Minuten)`)
  await redis.setex(cacheKey, finalTTL, JSON.stringify(product))

  return product
}
```

**Lösung 2: Cache-Warmup (Cache Preheating)**

```javascript
// Beim Systemstart aktiv Hot Data in den Cache laden
async function cacheWarmup() {
  console.log('Cache-Warmup gestartet...')

  // 1. Die 1.000 beliebtesten Produkte abfragen (nach Zugriffen sortiert)
  const hotProducts = await db.query(`
    SELECT * FROM products
    ORDER BY view_count DESC
    LIMIT 1000
  `)

  // 2. Batch in Redis schreiben
  for (const product of hotProducts) {
    const cacheKey = `product:${product.id}`
    const ttl = 1800 + Math.floor(Math.random() * 600)  // 30 Minuten ± 5 Minuten
    await redis.setex(cacheKey, ttl, JSON.stringify(product))
  }

  console.log(`Cache-Warmup abgeschlossen, ${hotProducts.length} beliebte Produkte geladen`)
}

// Beim Anwendungsstart ausführen
cacheWarmup()
```

**Lösung 3: Circuit Breaker (Degradierung)**

```javascript
// Circuit Breaker zum Schutz der Datenbank verwenden
const CircuitBreaker = require('opossum')

// Circuit Breaker konfigurieren
const dbQueryBreaker = new CircuitBreaker(
  async (productId) => {
    return await db.query('SELECT * FROM products WHERE id = ?', [productId])
  },
  {
    timeout: 3000,  // 3 Sekunden Timeout
    errorThresholdPercentage: 50,  // Auslösen bei > 50 % Fehlerrate
    resetTimeout: 30000  // Nach 30 Sekunden Wiederherstellung versuchen
  }
)

// Fallback nach Auslösung
dbQueryBreaker.fallback(() => {
  console.log('Datenbank-Circuit-Breaker ausgelöst, degradierte Daten zurückgeben')
  return {
    id: productId,
    name: 'Dienst ausgelastet, bitte später erneut versuchen',
    status: 'degraded'
  }
})

async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // Datenbank über Circuit Breaker abfragen
  const product = await dbQueryBreaker.fire(productId)

  if (product.status === 'degraded') {
    return product  // Degradierte Daten zurückgeben
  }

  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  return product
}
```

👇 **Selbst ausprobieren**:
Die folgende Demo vergleicht die Szenarien und Lösungen der drei Cache-Probleme Penetration, Hotspot-Invalidierung und Lawine:

<CacheProblemsDemo />

---

## 5. Cache-Konsistenzstrategien: Ansatz für Cache und Datenbank synchron bleiben

Der Cache ist von Natur aus eine Kopie der Daten. Zwischen Kopie und Originaldaten (Datenbank) besteht zwangsläufig ein Zeitfenster der Inkonsistenz. Wie man dieses Zeitfenster kontrolliert, ist die zentrale Herausforderung des Cache-Designs.

### 5.1 Warum können Cache und Datenbank inkonsistent sein

::: tip 🤔 Inkonsistenz mit der „Haftnotiz und Buch"-Analogie
Stell dir vor, auf deiner Haftnotiz steht: „Ming's Telefon: 123456" – eine Kopie deines Adressbuchs (Datenbank).

**Inkonsistenz-Szenario**:
- Du aktualisierst das Adressbuch und änderst Mings Nummer auf „7654321"
- Aber du vergisst, die Haftnotiz zu aktualisieren
- Beim nächsten Nachschlagen siehst du auf der Haftnotiz immer noch die alte Nummer „123456"

**Problem**: Haftnotiz (Cache) und Adressbuch (Datenbank) sind inkonsistent.

**Ursache**: Die Originaldaten wurden aktualisiert, aber die Kopie wurde nicht synchron aktualisiert. In Computersystemen liegt das daran, dass „Datenbank aktualisieren" und „Cache aktualisieren" zwei unabhängige Operationen sind, zwischen denen ein Zeitfenster liegt, das von anderen Operationen gestört werden kann.
:::

**Praktisches Nebenläufigkeitsszenario**:

| Zeit | Thread A (Alter aktualisieren) | Thread B (Benutzer abfragen) | Datenbank | Cache |
|------|---------------------|------------------|--------|------|
| T1 | Beginnt DB-Update | - | age=20 | age=20 |
| T2 | DB auf age=25 aktualisiert | Fragt Cache ab, Treffer age=20 | age=25 | age=20 ❌ |
| T3 | Löscht Cache | - | age=25 | - |
| T4 | - | - | age=25 | Lädt age=25 aus DB ✅ |

**Problem**: Zum Zeitpunkt T2 liest Thread B den alten Wert 20 aus dem Cache, während die Datenbank bereits 25 enthält. Das ist **Cache-Inkonsistenz**.

### 5.2 Best Practice: Erst Datenbank aktualisieren, dann Cache löschen

::: tip 🤔 Warum „löschen" statt „aktualisieren"?
Du fragst dich vielleicht: Warum nicht direkt den Cache „aktualisieren", sondern ihn „löschen"?

**Probleme beim Cache-Aktualisieren**:
- Bei parallelen Updates könnte Thread A zuerst den Cache aktualisieren, Thread B dann die Datenbank, aber der Cache wird nicht aktualisiert
- Die Kosten für die Cache-Aktualisierung können hoch sein (z. B. wenn Daten aus mehreren Tabellen aggregiert werden müssen)
- Wenn die Daten nach der Aktualisierung wieder gelöscht werden, war die Arbeit umsonst

**Vorteile des Cache-Löschens**:
- Beim nächsten Zugriff werden automatisch die neuesten Daten aus der Datenbank geladen (Lazy Loading)
- Vermeidet Dirty Data durch parallele Updates
- Einfach und zuverlässig, industrieweit als Best Practice anerkannt
:::

**Standardablauf**:

```javascript
// Produktinformationen aktualisieren
async function updateProduct(productId, updateData) {
  // 1. Erst die Datenbank aktualisieren
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 2. Dann den Cache löschen (nicht aktualisieren!)
  await redis.del(`product:${productId}`)

  // 3. Bei der nächsten Abfrage: Cache-Miss, neueste Daten automatisch aus DB laden
  console.log('Update abgeschlossen, Cache gelöscht')
}
```

::: details Warum „Erst DB aktualisieren, dann Cache löschen" die optimale Strategie ist
Vergleich der drei Update-Strategien:

**Strategie 1: Erst Cache, dann DB aktualisieren** ❌ Nicht empfohlen
```javascript
// Problem: Wenn DB-Update fehlschlägt, Cache = neu, DB = alt → inkonsistent
await redis.set('product:1', newProduct)  // Cache-Update erfolgreich
await db.query('UPDATE products SET ...')  // DB-Update fehlgeschlagen!
// Ergebnis: Cache ist neu, DB ist alt, dauerhaft inkonsistent!
```

**Strategie 2: Erst Cache löschen, dann DB aktualisieren** ❌ Nicht empfohlen
```javascript
// Problem: Zwischen Löschen und Aktualisieren könnte ein anderer Thread alte Daten in den Cache laden
await redis.del('product:1')  // Cache gelöscht
// Jetzt fragt Thread B ab, findet nichts im Cache, lädt aus DB (noch alter Wert), schreibt in Cache
await db.query('UPDATE products SET ...')  // DB aktualisieren
// Ergebnis: Cache ist alt, DB ist neu, inkonsistent!
```

**Strategie 3: Erst DB aktualisieren, dann Cache löschen** ✅ Empfohlen
```javascript
// Vorteil: DB-Update erwirbt Zeilensperre, andere Threads müssen warten, vermeidet Dirty Data
await db.query('UPDATE products SET ...')  // DB aktualisieren (erwirbt Zeilensperre)
await redis.del('product:1')  // Cache löschen
// Selbst wenn Cache-Löschung fehlschlägt, führt die nächste Abfrage nur zum DB-Lesen, kein dauerhafter Dirty Data
```

**Warum ist Strategie 3 optimal?**
1. **Datenbank-Sperrschutz**: Update-Operation erwirbt Zeilensperre, andere Lese-/Schreiboperationen müssen warten
2. **Fehlertoleranz bei Cache-Löschung**: Selbst wenn Cache-Löschung fehlschlägt, wird nur beim nächsten Lesen die DB abgefragt, keine Dirty Data
3. **Einfach und zuverlässig**: Keine zusätzliche komplexe Logik nötig
:::

### 5.3 Verzögerte doppelte Löschung: Konsistenzgarantie für Extremszenarien

**Szenario**: In hochparallelen Szenarien kann selbst bei „Erst DB aktualisieren, dann Cache löschen" eine minimale Inkonsistenz-Wahrscheinlichkeit bestehen. Die verzögerte doppelte Löschung maximiert die Konsistenz durch zweimaliges Löschen.

**Ablauf**:
```
1. Cache löschen
2. Datenbank aktualisieren
3. Eine Weile warten (z. B. 500 ms)
4. Cache erneut löschen
```

```javascript
async function updateProduct(productId, updateData) {
  const cacheKey = `product:${productId}`

  // 1. Erstes Löschen des Caches
  await redis.del(cacheKey)

  // 2. Datenbank aktualisieren
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 3. 500 ms warten (andere Threads ihre Abfragen abschließen lassen)
  await new Promise(resolve => setTimeout(resolve, 500))

  // 4. Zweites Löschen des Caches (von anderen Threads möglicherweise geladene alte Daten löschen)
  await redis.del(cacheKey)

  console.log('Verzögerte doppelte Löschung abgeschlossen, Daten synchronisiert')
}
```

**Vergleich der drei Konsistenzstrategien**:

| Strategie | Konsistenzniveau | Leistungseinfluss | Komplexität | Geeignete Szenarien |
|------|-----------|---------|--------|---------|
| **Erst DB, dann Cache löschen** | Eventual Consistency (Inkonsistenzfenster < 100 ms) | Gering | Gering | Die meisten Szenarien, als Standard empfohlen |
| **Verzögerte doppelte Löschung** | Starke Eventual Consistency (Inkonsistenzfenster < 10 ms) | Mittel (500 ms Verzögerung) | Mittel | Szenarien mit hohen Konsistenzanforderungen (z. B. Finanzen, Inventar) |
| **Erst Cache löschen, dann DB** | Schwach (großes Inkonsistenzfenster) | Gering | Gering | ❌ Nicht empfohlen, anfällig für Inkonsistenzen |

👇 **Selbst ausprobieren**:
Die folgende Demo vergleicht die Effekte der drei Konsistenzstrategien. Klicke auf „Daten aktualisieren", um die Konsistenzänderungen zwischen Cache und Datenbank zu beobachten:

<CacheConsistencyDemo />

---

## 6. Praxis: Ein vollständiges Cache-System aufbauen

Nach all diesen Prinzipien schauen wir uns einen echten Fall an: Wie man ein vollständiges Cache-System für eine E-Commerce-Produktdetailseite entwirft.

### 6.1 Geschäftsszenario-Analyse

**Anforderung**: Nutzer rufen die Produktdetailseite auf, die grundlegende Produktinformationen, Preis, Inventar, Bewertungen usw. anzeigen muss.

**Merkmale**:
- **Leselastig**: 100 Abfragen, 1 Update (Lese-/Schreibverhältnis 100:1)
- **Hotspot-Konzentration**: 20 % der Produkte generieren 80 % des Traffics
- **Komplexe Daten**: Grundlegende Produktinformationen + Preis + Inventar + Bewertungsaggregationen
- **Konsistenzanforderungen**: Preis und Inventar stark konsistent, andere eventual consistent

**Leistungsziele**:
- P99-Antwortzeit < 100 ms (99 % der Anfragen werden innerhalb von 100 ms beantwortet)
- Datenbank-QPS-Spitze < 5.000
- Cache-Trefferquote > 95 %

### 6.2 Architekturdesign

**Multi-Level-Cache-Architektur**:

```
Nutzeranfrage
  ↓
CDN-Cache (statische Ressourcen: Bilder, CSS, JS)
  ↓ Miss
Nginx lokaler Cache (Produktbasisinfo-Aggregation)
  ↓ Miss
Anwendungsserver
  ↓
  ├─ L1: Lokaler Cache (Caffeine, beliebte Produkte)
  │   ↓ Miss
  ├─ L2: Redis-Cache (alle Produktdaten)
  │   ↓ Miss
  └─ L3: MySQL-Datenbank (vollständige Daten)
```

### 6.3 Kernimplementierung

**Vollständige Multi-Level-Cache-Implementierung (vereinfacht)** :

```javascript
const caffeine = require('caffeine')

// L1: Lokaler Cache (30 Sekunden Ablaufzeit)
const localCache = new caffeine.Cache({
  max: 1000,
  ttl: 30,
})

// Produktdetails abrufen (Multi-Level-Cache)
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // L1: Lokaler Cache (ca. 0,1 ms)
  const localCached = localCache.get(cacheKey)
  if (localCached) {
    console.log('L1-Treffer')
    return localCached
  }

  // L2: Redis-Cache (ca. 1 ms)
  const redisCached = await redis.get(cacheKey)
  if (redisCached) {
    console.log('L2-Treffer, fülle L1 auf')
    const product = JSON.parse(redisCached)
    localCache.set(cacheKey, product)
    return product
  }

  // L3: Datenbank (ca. 10 ms, mit verteilter Sperre gegen Hotspot-Invalidierung)
  const lockKey = `lock:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)

  if (lock === 'OK') {
    console.log('L3-Treffer, Datenbankabfrage')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    if (product) {
      // In Redis schreiben (30 Minuten + zufällige TTL)
      const ttl = 1800 + Math.floor(Math.random() * 600) - 300
      await redis.setex(cacheKey, ttl, JSON.stringify(product))
      // Lokalen Cache auffüllen
      localCache.set(cacheKey, product)
    }

    await redis.del(lockKey)
    return product
  } else {
    // Sperre nicht erhalten, Warten und Wiederholungsversuch
    await new Promise(resolve => setTimeout(resolve, 50))
    return getProduct(productId)
  }
}

// Produktinformationen aktualisieren (Erst DB, dann Cache löschen)
async function updateProduct(productId, updateData) {
  const cacheKey = `product:${productId}`

  // 1. Datenbank aktualisieren
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 2. Lokalen Cache löschen
  localCache.del(cacheKey)

  // 3. Redis-Cache löschen
  await redis.del(cacheKey)

  console.log('Update abgeschlossen, Cache gelöscht')
}
```

👇 **Selbst ausprobieren**:
Die folgende Demo zeigt den vollständigen Arbeitsablauf eines Multi-Level-Cache-Systems. Klicke auf „Produkt abfragen", um zu beobachten, wie die Anfrage durch die verschiedenen Cache-Ebenen fließt:

<EcommerceCacheArchitectureDemo />

---

## 7. Zusammenfassung und Lernpfad

### 7.1 Rückblick auf die Kernkonzepte

| Konzept | Ein-Satz-Erklärung | Gelöstes Problem | Praxis-Tipp |
|--------|-----------|-----------|----------|
| **Cache Hit** | Daten im Cache gefunden | 10–100× Leistungssteigerung | Trefferquote-Ziel > 95 % |
| **Cache Penetration** | Abfrage nicht existierender Daten, jedes Mal DB | DB durch bösartige Abfragen überlastet | Bloom-Filter + Null-Objekt-Caching |
| **Hotspot-Invalidierung** | Heiße Daten laufen ab, viele Anfragen treffen DB | Plötzlicher DB-Lastanstieg | Mutex-Sperre + Logischer Ablauf |
| **Cache Lawine** | Massenhafter gleichzeitiger Ablauf | DB wird überrannt | Zufällige TTL + Cache-Warmup |
| **Multi-Level-Cache** | Lokaler Cache + Redis + Datenbank | Extreme Leistungsoptimierung | L1-Trefferquote 70 %, L2 Redis 25 % |
| **Cache-Konsistenz** | Cache und DB synchron halten | Datenkorrektheit | Erst DB, dann Cache löschen |
| **Verzögerte doppelte Löschung** | Vor und nach Update je einmal Cache löschen | Konsistenz in Extremszenarien | 500 ms warten, dann erneut löschen |

### 7.2 Lernpfad-Empfehlung

**Phase 1: Prinzipien verstehen (1–2 Tage)**
- Die Essenz des Cachings verstehen (Datenkopien, Speicher gegen Geschwindigkeit tauschen)
- Kernkonzepte wie Cache-Trefferquote, TTL, Verdrängung verstehen
- Leistungsunterschiede verschiedener Speichermedien kennen (RAM vs. Festplatte)

**Phase 2: Grundlagen beherrschen (2–3 Tage)**
- Redis für Caching nutzen lernen (SET, GET, SETEX Befehle)
- Einfache Cache-Lese-/Schreiblogik implementieren (erst Cache, bei Miss dann DB)
- Verstehen, warum man beim Update den Cache löscht statt ihn zu aktualisieren

**Phase 3: Klassische Probleme lösen (1 Woche)**
- Cache Penetration lösen: Bloom-Filter oder Null-Objekt-Caching implementieren
- Hotspot-Invalidierung lösen: Mutex-Sperre oder logischen Ablauf implementieren
- Cache Lawine lösen: Zufällige TTL und Cache-Warmup implementieren

**Phase 4: Multi-Level-Caching (1–2 Wochen)**
- Lokalen Cache einführen (Caffeine/Guava)
- Zwei-Ebenen-Architektur mit lokalem Cache + Redis entwerfen
- Konsistenzprobleme bei Multi-Level-Caching behandeln

**Phase 5: Produktionsreife Praxis (fortlaufend)**
- Vollständiges Cache-System für Produktdetailseiten entwerfen
- Monitoring aufbauen (Cache-Trefferquote, Antwortzeit)
- Lasttests und Leistungsoptimierung durchführen

::: info 💡 Zum Schluss
Caching ist das Fundament hochparalleler Systeme. Von Taobaos Produktdetailseiten über Weibos Trendlisten bis hin zu WeChats Moments und Douyins Video-Feeds – hinter jedem hochperformanten System steht eine sorgfältig entworfene Cache-Architektur.

Caching zu verstehen bedeutet nicht nur, eine Technologie zu lernen, sondern die architektonische Denkweise zu erfassen: **Speicher gegen Geschwindigkeit tauschen, Primärdaten durch Kopien schützen**. Wenn du Caching wirklich beherrschst, wird deine Systemleistung von „funktioniert" zu „funktioniert gut" und schließlich zu „exzellent" aufsteigen.

Ich hoffe, dieser Artikel hilft dir, ein vollständiges Verständnis von Cache-Systemen aufzubauen. Wenn du in deinen Projekten auf Leistungsprobleme stößt, wirst du hoffentlich denken: „Kann ich das mit Caching lösen?"
:::