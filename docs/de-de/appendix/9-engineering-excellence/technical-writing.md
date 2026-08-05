# Technisches Schreiben: Dokumentationsprinzipien

::: tip Vorwort
**Liest überhaupt jemand Ihre Dokumentation?** Viele Entwickler denken: „Solange der Code funktioniert, kann die Dokumentation warten." Das Ergebnis: Neue Mitarbeiter verstehen das Projekt nicht, API-Integrationen funktionieren nur über mündliche Absprachen, und nach einem halben Jahr hat man selbst vergessen, warum man etwas so entworfen hat.

Dieses Kapitel vermittelt Ihnen die Kernmethoden der technischen Dokumentation, damit Ihre Dokumente wirklich gelesen, verstanden und genutzt werden.
:::

**Was werden Sie in diesem Artikel lernen?**

| Kapitel | Inhalt | Kernkonzept |
|-----|------|---------|
| **Kapitel 1** | Dokumenttypen und Struktur | Unterschiedliche Dokumentationsarten |
| **Kapitel 2** | Schreibprinzipien | Klar, präzise, prägnant |
| **Kapitel 3** | Praxisvergleich | Gute vs. schlechte Dokumentation |
| **Kapitel 4** | Dokumentationspflege | Dokumentation aktuell halten |

Nach diesem Kapitel werden Sie in der Lage sein, gut strukturierte, inhaltlich präzise und leicht wartbare technische Dokumentation zu erstellen.

---

## 0. Überblick: Bedeutung der technischen Dokumentation

Code sagt dem Computer „wie", Dokumentation sagt den Menschen „warum". Ein Projekt ohne Dokumentation ist wie ein Haushaltsgerät ohne Bedienungsanleitung — man kann es benutzen, aber man muss alles erraten.

::: tip Der Wert guter Dokumentation
- **Kommunikationskosten senken**: Neue Mitarbeiter können sich selbst einarbeiten, weniger wiederholte Fragen
- **Entscheidungskontext bewahren**: Das „Warum" festhalten, nicht nur das „Was"
- **Projektglaubwürdigkeit steigern**: Gute Dokumentation ist das Aushängeschild von Open-Source-Projekten
- **Zusammenarbeit beschleunigen**: API-Dokumentation ermöglicht parallele Frontend- und Backend-Entwicklung
:::

---

## 1. Dokumenttypen und Struktur

Verstehen Sie mit der folgenden interaktiven Komponente die Standardstruktur verschiedener Dokumenttypen:

<DocStructureDemo />

### 1.1 Häufige Dokumenttypen

| Dokumenttyp | Zielgruppe | Kerninhalt |
|---------|---------|---------|
| **README** | Alle | Was ist das Projekt, wie nutzt man es, wie trägt man bei |
| **API-Dokumentation** | Schnittstellennutzer | Endpunkte, Parameter, Antworten, Fehlercodes |
| **Architekturdokumentation** | Entwicklungsteam | Systemdesign, Technologieauswahl, Datenfluss |
| **Changelog** | Nutzer/Entwickler | Versionsänderungen, Neuheiten/Fixes/Breaking Changes |
| **Contributing Guide** | Beitragende | Entwicklungsumgebung, Code-Standards, PR-Prozess |

### 1.2 Die goldene README-Struktur

Eine gute README sollte Folgendes enthalten:

1. **Projektname + Ein-Satz-Beschreibung**: In 3 Sekunden verstehen, worum es geht
2. **Schnellstart**: Mit den wenigsten Schritten zum Laufen bringen
3. **Funktionsmerkmale**: Die Kernverkauspunkte
4. **Installation**: Detaillierte Systemanforderungen und Installationsschritte
5. **Verwendungsbeispiele**: Kopierfähiger Code
6. **Beitragsleitfaden**: Wie man mitmacht
7. **Lizenz**: Rechtliche Informationen

---

## 2. Schreibprinzipien

### 2.1 Klarheit zuerst

```markdown
<!-- Schlecht: Unklar -->
Diese Funktion verarbeitet Daten.

<!-- Gut: Konkret und klar -->
Wandelt Rohbestelldaten in das Rechnungsformat um, inklusive Steuerberechnung und Währungsumrechnung.
```

### 2.2 Leserorientierung

Bevor Sie schreiben, fragen Sie sich: **Wer wird dieses Dokument lesen? Welche Informationen benötigen sie?**

- Für Anfänger schreiben: Fachbegriffe erklären, vollständige Beispiele geben
- Für erfahrene Entwickler schreiben: Gleich zum Punkt, API-Referenz bieten
- Für Nicht-Techniker schreiben: Analysen verwenden, Fachjargon vermeiden

### 2.3 Codebeispiele sind die beste Dokumentation

```markdown
<!-- Schlecht: Nur Textbeschreibung -->
Rufen Sie die createUser-Funktion auf und übergeben Sie Benutzername und E-Mail.

<!-- Gut: Ausführbares Beispiel -->
const user = await createUser({
  name: 'Max Mustermann',
  email: 'max@example.com'
})
// Rückgabe: { id: 'u_123', name: 'Max Mustermann', createdAt: '2025-01-15' }
```

---

## 3. Praxisvergleich

Vergleichen Sie mit der folgenden interaktiven Komponente gute und schlechte technische Schreibweise:

<TechWritingPracticeDemo />

### 3.1 Commit-Message-Konventionen

```
# Schlecht
fix bug
update code

# Gut (Conventional Commits)
fix: Behebt weißen Bildschirm auf der Anmeldeseite in Safari
feat: Unterstützt Batch-Export von PDF-Berichten
docs: Aktualisiert Beispielcode im API-Authentifizierungsabschnitt
```

### 3.2 Die Kunst des Kommentierens

```javascript
// Schlecht: Beschreibt „was" (der Code sagt es schon)
// Array durchlaufen
for (const item of items) { ... }

// Gut: Erklärt „warum"
// Rückwärts durchlaufen, da beim Löschen vorwärts das nächste Element übersprungen wird
for (let i = items.length - 1; i >= 0; i--) { ... }
```

---

## 4. Dokumentationspflege

### 4.1 Docs as Code

Dokumentation und Code im selben Repository verwalten, mit demselben Workflow:

- Dokumentationsänderungen zusammen mit Code als PR einreichen
- CI prüft Dokumentationsformat und Link-Gültigkeit
- Bei Release die Dokumentation synchron aktualisieren

### 4.2 Dokumentationsfäulnis vermeiden

| Problem | Lösung |
|------|---------|
| Veraltete Dokumentation | Dokumentationsupdate bei Codeänderung erzwingen (PR-Checks) |
| Niemand pflegt | Dokumentationsverantwortliche benennen |
| Duplizierte Inhalte | Single Source of Truth, andere Stellen verlinken |

---

## 5. AI-Unterstützung: Dokumentationsqualität mit großen Sprachmodellen verbessern

Große Sprachmodelle sind auf dem Gebiet der technischen Schreibweise geradezu „talentiert" — Dokumentation generieren, Ausdrücke verbessern, Inhalte übersetzen gehören zu ihren Stärken.

### 5.1 API-Dokumentation generieren

> **Prompt**:
> ```
> Generieren Sie basierend auf dem folgenden Express-Route-Code eine vollständige API-Dokumentation:
> - Endpunktpfad und Methode
> - Anfrageparameter (Pfadparameter, Query-Parameter, Request-Body) und Typen
> - Erfolgs- und Fehler-Antwortbeispiele
> - Aufrufbeispiel mit curl
>
> [Routen-Code einfügen]
> ```

### 5.2 Technisches Schreiben verbessern

> **Prompt**:
> ```
> Bitte verbessern Sie die Ausdrucksweise der folgenden technischen Dokumentation:
> 1. Sprache klar und prägnant, redundante Formulierungen entfernen
> 2. Aktiv statt Passiv verwenden
> 3. Fachbegriffe präzise beibehalten
> 4. Notwendige Codebeispiele hinzufügen
> Nur die Ausdrucksqualität verbessern, den ursprünglichen Sinn beibehalten.
>
> [Dokumentationsinhalt einfügen]
> ```

### 5.3 README generieren

> **Prompt**:
> ```
> Generieren Sie basierend auf den folgenden Projektinformationen eine hochwertige README.md:
> - Projektname: [Name]
> - Ein-Satz-Beschreibung: [Beschreibung]
> - Technologie-Stack: [auflisten]
> - Kernfunktionen: [auflisten]
>
> Folgendes soll enthalten sein: Projektbeschreibung, Schnellstart, Funktionsmerkmale,
> Installationsschritte (mit Code), Verwendungsbeispiele, Beitragsleitfaden, Lizenz.
> ```

::: tip AI-Verwendungshinweis
KI-generierte Dokumentation muss auf technische Genauigkeit überprüft werden — sie könnte nicht existierende API-Parameter oder falsche Rückgabewerte erfinden. Immer mit dem tatsächlichen Code abgleichen.
:::

---

## 6. Zusammenfassung

1. **Typzuordnung**: Verschiedene Dokumenttypen haben unterschiedliche Strukturen und Schreibweisen
2. **Klarheit zuerst**: Konkret, präzise, leserorientiert
3. **Beispielgetrieben**: Ein gutes Codebeispiel sagt mehr als tausend Worte
4. **Kontinuierliche Pflege**: Docs as Code, gemeinsam mit dem Projekt weiterentwickeln

::: tip Schlussgedanke
Dokumentation zu schreiben ist keine Zeitverschwendung, sondern **eine Investition in die Zukunft**. 30 Minuten Dokumentation heute können 10 Personen jeweils eine Stunde sparen. Gute Dokumentation ist die beste Investition in Ihr Team.
:::

---

## Weiterführende Literatur

- **Schreibleitfaden**: Googles Technical-Writing-Kurs ist kostenlos und sehr praxisnah.
- **Dokumentationstools**: Moderne Dokumentationsframeworks wie VitePress, Docusaurus, GitBook.
- **API-Dokumentation**: Die OpenAPI/Swagger-Spezifikation ist der Branchenstandard für API-Dokumentation.
- **Praxistipp**: Beginnen Sie damit, ein gute README für Ihr eigenes Projekt zu schreiben.
