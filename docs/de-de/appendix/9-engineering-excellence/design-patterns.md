# Design Patterns: Entwurfsmuster

::: tip Vorwort
**Warum ist Ihr Code immer „funktional, aber unordentlich"?** Sie kennen vielleicht diese Situation: Wenn sich die Anforderungen ändern, muss der Code massiv geändert werden; wenn Sie eine Logik wiederverwenden wollen, stellen Sie fest, dass sie mit anderem Code verflochten ist. Entwurfsmuster sind die von Experten zusammengeellten „Code-Organisationsmuster", die Ihnen helfen, flexiblen und wartbaren Code zu schreiben.

Dieses Kapitel hilft Ihnen, die praktischsten Entwurfsmuster zu verstehen — nicht auswendig zu lernen, sondern zu verstehen, „welches Muster in welcher Situation".
:::

**Was werden Sie in diesem Artikel lernen?**

| Kapitel | Inhalt | Kernkonzept |
|-----|------|---------|
| **Kapitel 1** | Was sind Entwurfsmuster | Wesen und Klassifikation von Mustern |
| **Kapitel 2** | Erzeugungsmuster | Wie man Objekte elegant erstellt |
| **Kapitel 3** | Strukturmuster | Wie man Codestruktur organisiert |
| **Kapitel 4** | Verhaltensmuster | Wie man Interaktionen zwischen Objekten verwaltet |

Nach diesem Kapitel werden Sie die am häufigsten verwendeten Entwurfsmuster beherrschen und in der Lage sein, passende Einsatzszenarien in realen Projekten zu erkennen und flexibel anzuwenden.

---

## 0. Überblick: Das Wesen von Entwurfsmustern

Stellen Sie sich vor, Sie lernen Kochen. Sie können jedes Mal von Grund auf experimentieren oder klassische Rezepte lernen — Rezepte schränken Ihre Kreativität nicht ein, sondern lassen Sie auf den Schultern von Experten stehen. Entwurfsmuster sind die „klassischen Rezepte" der Programmierwelt.

::: tip Der Wert von Entwurfsmustern
- **Gemeinsame Sprache**: Wenn Sie sagen „Hier verwenden wir das Beobachter-Muster", versteht das Team sofort Ihre Entwurfsabsicht
- **Erfahrungsweitergabe**: Sie müssen nicht die gleichen Fehler machen wie Ihre Vorgänger
- **Flexible Erweiterung**: Gute Muster erfordern bei Änderungen nur kleine Modifikationen statt großer Umbauten
:::

Durch die folgende interaktive Komponente können Sie die Klassifikation und Verwendung gängiger Entwurfsmuster durchblättern:

<DesignPatternCatalogDemo />

---

## 1. Erzeugungsmuster: Ansatz für man Objekte elegant erstellt

### 1.1 Singleton-Muster (Singleton)

**Szenario**: Nur eine Instanz weltweit benötigt, z. B. Konfigurationsmanager, Logger, Datenbankverbindungspool.

```javascript
class ConfigManager {
  static instance = null

  static getInstance() {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  constructor() {
    this.config = {}
  }
}

// Egal wie oft aufgerufen, immer dieselbe Instanz
const a = ConfigManager.getInstance()
const b = ConfigManager.getInstance()
console.log(a === b) // true
```

### 1.2 Fabrik-Muster (Factory)

**Szenario**: Unterschiedliche Objekttypen je nach Bedingung erstellen, ohne dass der Aufrufer die konkreten Erstellungsdetails kennen muss.

```javascript
function createNotification(type, message) {
  switch (type) {
    case 'email':
      return { send: () => console.log(`E-Mail senden: ${message}`) }
    case 'sms':
      return { send: () => console.log(`SMS senden: ${message}`) }
    case 'push':
      return { send: () => console.log(`Push-Benachrichtigung: ${message}`) }
    default:
      throw new Error(`Unbekannter Benachrichtigungstyp: ${type}`)
  }
}

// Der Aufrufer muss die konkrete Implementierung nicht kennen
const notification = createNotification('email', 'Hallo')
notification.send()
```

---

## 2. Strukturmuster: Ansatz für man Codestruktur organisiert

### 2.1 Adapter-Muster (Adapter)

**Szenario**: Zwei inkompatible Interfaces benötigen einen „Adapterstecker". Zum Beispiel, wenn das Datenformat einer alten API nicht mit dem Format übereinstimmt, das eine neue Komponente erwartet.

```javascript
// Format der alten API
const oldApi = {
  getUserInfo: () => ({ user_name: 'Max', user_age: 25 })
}

// Adapter: In neues Format umwandeln
function adaptUser(oldUser) {
  return { name: oldUser.user_name, age: oldUser.user_age }
}

const user = adaptUser(oldApi.getUserInfo())
// { name: 'Max', age: 25 }
```

### 2.2 Dekorator-Muster (Decorator)

**Szenario**: Einem Objekt neue Funktionen hinzufügen, ohne den bestehenden Code zu ändern. Wie eine Handyhülle — die Handyfunktionen bleiben gleich, aber es gibt zusätzlichen Schutz.

```javascript
// Basis-Log-Funktion
function log(message) {
  console.log(message)
}

// Dekorieren: Zeitstempel hinzufuegen
function withTimestamp(fn) {
  return (message) => fn(`[${new Date().toISOString()}] ${message}`)
}

// Dekorieren: Log-Level hinzufuegen
function withLevel(fn, level) {
  return (message) => fn(`[${level}] ${message}`)
}

const enhancedLog = withTimestamp(withLevel(log, 'INFO'))
enhancedLog('Dienst erfolgreich gestartet')
// [2025-01-15T10:30:00.000Z] [INFO] Dienst erfolgreich gestartet
```

---

## 3. Verhaltensmuster: Ansatz für man Interaktionen zwischen Objekten verwaltet

### 3.1 Beobachter-Muster (Observer)

**Szenario**: Wenn sich der Zustand eines Objekts ändert, müssen andere Objekte automatisch benachrichtigt werden. Zum Beispiel: Nach einer Benutzerbestellung müssen gleichzeitig eine E-Mail gesendet, der Bestand reduziert und ein Log-Eintrag erstellt werden.

```javascript
class EventEmitter {
  constructor() {
    this.listeners = {}
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(callback)
  }

  emit(event, data) {
    (this.listeners[event] || []).forEach(cb => cb(data))
  }
}

const bus = new EventEmitter()
bus.on('order:created', (order) => console.log('Bestaetigungs-E-Mail senden', order.id))
bus.on('order:created', (order) => console.log('Bestand reduzieren', order.id))
bus.emit('order:created', { id: 'ORD-001' })
```

### 3.2 Strategie-Muster (Strategy)

**Szenario**: Dieselbe Operation hat mehrere Algorithmen/Strategien, die zur Laufzeit gewechselt werden müssen. Zum Beispiel: verschiedene Sortiermethoden, verschiedene Preisberechnungsregeln.

```javascript
const pricingStrategies = {
  normal: (price) => price,
  vip: (price) => price * 0.8,
  svip: (price) => price * 0.6
}

function calculatePrice(price, memberLevel) {
  const strategy = pricingStrategies[memberLevel] || pricingStrategies.normal
  return strategy(price)
}

calculatePrice(100, 'vip')  // 80
calculatePrice(100, 'svip') // 60
```

Erleben Sie die Auswirkungen verschiedener Entwurfsmuster interaktiv mit der folgenden Komponente:

<PatternPlaygroundDemo />

---

## 4. Wie wählt man Entwurfsmuster aus

| Problem | Empfohlenes Muster | Kernidee |
|-------------|---------|---------|
| Nur eine Instanz weltweit benötigt | Singleton | Instanzanzahl kontrollieren |
| Unterschiedliche Objekte je nach Bedingung erstellen | Fabrik | Erstellungslogik kapseln |
| Inkompatible Interfaces konvertieren | Adapter | Konvertierungsschicht einwickeln |
| Dynamisch Funktionen hinzufuegen | Dekorator | Schichtweise verstaerken |
| Zustandsänderung an mehrere Stellen melden | Beobachter | Publish-Subscribe zur Entkopplung |
| Mehrere Algorithmen zur Laufzeit wechseln | Strategie | Algorithmen als Objekte kapseln |

::: tip Kernprinzip
Entwurfsmuster sind nicht „je mehr, desto besser". **Über-engineering** ist genauso schlecht wie **kein Engineering**. Verwenden Sie Muster nur dort, wo wirklich Flexibilität benötigt wird. Für einfache Probleme einfache Lösungen. Denken Sie an das KISS-Prinzip: Keep It Simple, Stupid.
:::

---

## 5. AI-Unterstützung: Entwurfsmuster mit großen Sprachmodellen lernen und anwenden

Große Sprachmodelle können Ihnen helfen, Szenarien zu identifizieren, in denen Entwurfsmuster anwendbar sind, und konkrete Refactoring-Vorschläge zu machen.

### 5.1 Anwendbare Muster identifizieren

> **Prompt**:
> ```
> Analysieren Sie den folgenden Code und prüfen Sie, ob es Stellen gibt,
> die mit Entwurfsmustern verbessert werden könnten.
> Wenn ja, bitte angeben:
> 1. Das Problem im aktuellen Code
> 2. Welches Entwurfsmuster empfohlen wird
> 3. Ein Codebeispiel nach dem Refactoring
> 4. Warum dieses Muster für dieses Szenario geeignet ist
>
> [Fügen Sie Ihren Code ein]
> ```

### 5.2 Muster anhand konkreter Szenarien lernen

> **Prompt**:
> ```
> Demonstrieren Sie anhand eines realen Szenarios „Lieferbestellsystem"
> die Anwendung folgender Entwurfsmuster:
> - Fabrikmuster: Erstellen verschiedener Bestelltypen
> - Beobachtermuster: Benachrichtigung bei Bestellstatusänderungen
> - Strategiemuster: Unterschiedliche Lieferkostenberechnungsregeln
>
> Verwenden Sie JavaScript-Codebeispiele. Zeigen Sie bei jedem Muster zuerst
> das Problem ohne Muster und dann die Verbesserung mit Muster.
> ```

### 5.3 Beurteilen, ob über-engineering vorliegt

> **Prompt**:
> ```
> Überprüfen Sie den folgenden Code und beurteilen Sie, ob ein Problem
> mit Über-engineering vorliegt. Gibt es unnötige Abstraktionen,
> ungenutzte Entwurfsmuster oder verfrühte Optimierungen?
> Wenn ja, schlagen Sie unter dem KISS-Prinzip Vereinfachungen vor.
>
> [Fügen Sie Ihren Code ein]
> ```

::: tip AI-Verwendungshinweis
Lassen Sie die AI Entwurfsmuster anhand Ihnen vertrauter Geschäftsszenarien erklären — das ist viel effektiver als abstrakte UML-Diagramme. Aber beachten Sie: Die AI neigt dazu, komplexere Lösungen vorzuschlagen. Sie müssen selbst beurteilen, ob diese wirklich benötigt werden.
:::

---

## 6. Zusammenfassung

1. **Erzeugungsmuster**: Lösen das Problem „wie man Objekte erstellt" und machen den Erstellungsprozess flexibler
2. **Strukturmuster**: Lösen das Problem „wie man Code organisiert" und machen die Struktur klarer
3. **Verhaltensmuster**: Lösen das Problem „wie Objekte interagieren" und ermöglichen lockerere Kopplung
4. **Flexibel einsetzen**: Nach dem tatsächlichen Szenario auswählen, nicht Muster um der Muster willen verwenden

::: tip Schlussgedanke
Das Wesen von Entwurfsmustern ist das **Management von Veränderung**. Ein gutes Design macht die sich ändernden Teile leicht modifizierbar und die gleichbleibenden Teile stabil. Wenn Sie Code schreiben, fragen Sie sich: „Wenn sich die Anforderungen ändern, wie viele Stellen muss ich anpassen?" — Wenn die Antwort „viele Stellen" lautet, könnte ein Entwurfsmuster helfen.
:::

---

## Weiterführende Literatur

- **Klassisches Buch**: GoF „Entwurfsmuster: Elemente wiederverwendbarer objektorientierter Software" ist das Ursprungswerk der Entwurfsmuster.
- **Moderne Perspektive**: In JavaScript werden viele Muster dank Sprachmerkmalen (Closures, Higher-Order Functions) prägnanter.
- **Praxistipp**: Verstehen Sie zuerst das Problem, dann betrachten Sie Muster. Suchen Sie nicht mit dem Hammer nach Nägeln.
- **Weiterführendes Lernen**: Lernen Sie die SOLID-Prinzipien kennen — sie sind die Leitprinzipien hinter Entwurfsmustern.
