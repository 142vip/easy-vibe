# Teststrategien: Qualitätsicherung

::: tip Vorwort
**Ist Ihr Code wirklich „ohne Probleme"?** Nach jeder Codeänderung manuell alles durchklicken — bei kleinen Projekten geht das noch. Aber wenn der Code auf zehntausende Zeilen anwächst und das Team auf über zehn Personen erweitert wird, wird „manuell durchklicken" zur Katastrophe.

Dieses Kapitel hilft Ihnen, die Kernstrategien des Softwaretestens zu verstehen und ein systematisches Qualitätsdenken aufzubauen — von der Testpyramide bis zu TDD.
:::

**Was werden Sie in diesem Artikel lernen?**

| Kapitel | Inhalt | Kernkonzept |
|-----|------|---------|
| **Kapitel 1** | Testpyramide | Ebenen und Verhältnisse von Tests |
| **Kapitel 2** | Unit-Testing in der Praxis | Wie man einen guten Test schreibt |
| **Kapitel 3** | TDD-getriebene Entwicklung | Der Rot-Grün-Refactoring-Zyklus |
| **Kapitel 4** | Teststrategie-Auswahl | Strategien für verschiedene Szenarien |

Nach diesem Kapitel werden Sie verstehen, wie Sie die passende Teststrategie für Ihr Projekt wählen, wertvolle Tests schreiben und die Code-Designqualität durch TDD verbessern können.

---

## 0. Überblick: Notwendigkeit automatisierter Tests

Stellen Sie sich vor, Sie sind Bauingenieur. Nach jeder Planänderung würden Sie nicht selbst alle Stockwerke hochklettern, um die Struktursicherheit zu prüfen — Sie würden sich auf ein **automatisiertes Prüfsystem** verlassen. Softwaretests sind das „Strukturprüfsystem" der Code-Welt.

::: tip Der Wert automatisierter Tests
- **Regressionschutz**: Bei Änderung von Feature A automatisch prüfen, ob B, C, D beeinträchtigt sind
- **Refactoring-Vertrauen**: Bei getestetem Code kann man beruhigt refaktorieren
- **Lebendige Dokumentation**: Gute Tests sind die beste Gebrauchsanleitung
- **Schnelles Feedback**: In Sekunden wissen, ob der Code korrekt ist — statt erst nach dem Deployment Probleme zu entdecken
:::

---

## 1. Testpyramide: Ebenen und Verhältnisse von Tests

### 1.1 Die dreistufige Pyramide

Die von Mike Cohn vorgeschlagene Testpyramide ist das klassische Modell der Teststrategie. Sie besagt: **Verschiedene Testtypen sollten in unterschiedlichen Mengenverhältnissen vorliegen.**

Klicken Sie mit der folgenden interaktiven Komponente auf jede Ebene der Pyramide, um die Merkmale der jeweiligen Testebene zu verstehen:

<TestPyramidDemo />

### 1.2 Warum eine Pyramidenform

Die Pyramidenform spiegelt einen Kern-Kompromiss wider: **Geschwindigkeit versus Realitätsnähe**.

- **Untere Ebene (Unit-Tests)**: Sehr schnell, die meisten Tests, niedrigste Kosten — aber sie verifizieren nur einzelne Bauteile
- **Mittlere Ebene (Integrationstests)**: Mittlere Geschwindigkeit, angemessene Anzahl — sie verifizieren die Zusammenarbeit der Bauteile
- **Obere Ebene (E2E-Tests)**: Am nächsten am echten Nutzer, aber langsam, hohe Wartungskosten, anfällig für Umgebungsprobleme

> **Anti-Pattern: Die Eiswaffel** — Wenn Ihr Projekt die meisten E2E-Tests und die wenigsten Unit-Tests hat, haben Sie eine umgekehrte „Eiswaffel". Das bedeutet: Die Test-Suite läuft langsam, scheitert häufig und ist extrem teuer in der Wartung.

---

## 2. Unit-Testing in der Praxis

### 2.1 Was ist ein guter Unit-Test

Gute Unit-Tests folgen dem **FIRST**-Prinzip:

| Prinzip | Bedeutung | Beschreibung |
|------|------|------|
| **F**ast | Schnell | In Millisekunden fertig, Entwickler führen sie gerne häufig aus |
| **I**ndependent | Unabhängig | Tests hängen nicht voneinander ab, einzeln ausführbar |
| **R**epeatable | Wiederholbar | Gleiche Ergebnisse in jeder Umgebung |
| **S**elf-validating | Selbstvalidierend | Klares Pass/Fail-Ergebnis, kein menschliches Urteil nötig |
| **T**imely | Rechtzeitig | Tests zeitgleich mit (oder vor) dem Code schreiben |

### 2.2 Die Struktur von Tests: Das AAA-Muster

Jeder Test sollte eine klare dreiteilige Struktur haben:

```javascript
test('sollte den Preis inklusive Steuer korrekt berechnen', () => {
  // Arrange (Vorbereiten) — Testdaten einrichten
  const price = 100
  const taxRate = 0.13

  // Act (Ausführen) — Zu testende Funktion aufrufen
  const result = calculateTotalWithTax(price, taxRate)

  // Assert (Behaupten) — Ergebnis überprüfen
  expect(result).toBe(113)
})
```

### 2.3 Was testen? Was nicht testen

**Was getestet werden sollte:**
- Kern-Geschäftslogik (Preisberechnung, Berechtigungsprüfung, Datentransformation)
- Randbedingungen (Null-Werte, Null, negative Zahlen, sehr große Zahlen)
- Fehlerbehandlungspfade

**Was nicht getestet werden muss:**
- Interne Implementierung von Drittanbieter-Bibliotheken
- Einfache Getter/Setter
- Framework-Eigene Funktionalität (z. B. das Reaktivitätssystem von Vue)

---

## 3. TDD: Testgetriebene Entwicklung

### 3.1 Der Rot-Grün-Refactoring-Zyklus

Der Kern von TDD (Test-Driven Development) ist ein einfacher Zyklus: **Zuerst den Test schreiben, dann die Implementierung, zuletzt refaktorieren.**

Erleben Sie den vollständigen TDD-Zyklus interaktiv mit der folgenden Komponente:

<TDDCycleDemo />

### 3.2 Die drei Regeln von TDD

1. **Keinen Produktionscode schreiben, außer um einen fehlschlagenden Test zu bestehen**
2. **Nur gerade genug Testcode schreiben, um den Test scheitern zu lassen** (Kompilierungsfehler zählt auch als Scheitern)
3. **Nur gerade genug Produktionscode schreiben, um den Test zu bestehen**

### 3.3 Der wahre Wert von TDD

Der Wert von TDD liegt nicht nur darin, „zuerst Tests zu schreiben", sondern darin, dass es Sie **zwingt, über das Schnittstellendesign nachzudenken**. Wenn Sie zuerst Tests schreiben, denken Sie aus der Perspektive des „Nutzers": Welche Parameter sollte diese Funktion empfangen? Welches Ergebnis sollte sie zurückgeben? Das führt natürlich zu einem besseren API-Design.

::: tip TDD ist kein Silberpfeil
TDD eignet sich für logikintensiven Code (Algorithmen, Geschäftsregeln, Datentransformation), aber bei UI-Layouts oder explorativen Prototypen kann erzwungenes TDD die Entwicklung eher bremsen. Entscheidend ist, die Idee zu verstehen und sie flexibel anzuwenden.
:::

---

## 4. Teststrategie-Auswahl

### 4.1 Test-Schwerpunkte nach Projekttyp

| Projekttyp | Test-Schwerpunkt | Empfohlenes Verhältnis |
|----------|----------|----------|
| **Utility-Bibliothek/SDK** | Hauptsächlich Unit-Tests | 90 % Unit + 10 % Integration |
| **API-Dienst** | Hauptsächlich Integrationstests | 30 % Unit + 60 % Integration + 10 % E2E |
| **Web-Anwendung** | Ausgewogene Verteilung | 50 % Unit + 30 % Integration + 20 % E2E |
| **MVP/Prototyp** | E2E für kritische Pfade | Nur wenige Kern-Tests |

### 4.2 Gängige Test-Tools

| Tool | Typ | Einsatzbereich |
|------|------|----------|
| **Vitest** | Unit/Integration | Erste Wahl für Vite-Projekte, Jest-API-kompatibel |
| **Jest** | Unit/Integration | Am beliebtesten im Node.js-Ökosystem |
| **Playwright** | E2E | Browserübergreifend, von Microsoft |
| **Cypress** | E2E | Gutes Entwicklererlebnis, einfaches Debugging |
| **Testing Library** | Komponententests | UI-Komponenten aus Nutzerperspektive testen |

---

## 5. AI-Unterstützung: Testeffizienz mit großen Sprachmodellen steigern

Große Sprachmodelle sind im Testbereich bereits sehr leistungsstark — sie können Ihnen beim Generieren von Testfällen, beim Finden von Randbedingungen und beim Schreiben von komplettem Testcode helfen.

### 5.1 Unit-Tests generieren

> **Prompt**:
> ```
> Bitte schreiben Sie Unit-Tests für die folgende Funktion mit dem Vitest-Framework:
> 1. Folgen Sie dem AAA-Muster (Arrange-Act-Assert)
> 2. Decken Sie Normalfälle, Randbedingungen und Fehlerpfade ab
> 3. Jeder Testfall soll eine klare deutsche Beschreibung haben
>
> [Funktionscode einfügen]
> ```

### 5.2 Randbedingungen entdecken

> **Prompt**:
> ```
> Analysieren Sie die folgende Funktion und listen Sie alle möglichen Randbedingungen
> und extremen Eingabeszenarien auf, einschließlich: Null-Werte, Null, negative Zahlen,
> sehr große Zahlen, Sonderzeichen, Nebenläufigkeitssituationen etc.
> Beschreiben Sie für jedes Szenario das erwartete Verhalten und mögliche Risiken.
>
> [Funktionscode einfügen]
> ```

### 5.3 Tests aus Anforderungen generieren (TDD-Unterstützung)

> **Prompt**:
> ```
> Ich möchte ein Warenkorbmodul implementieren. Anforderungen:
> - Artikel hinzufügen, entfernen, Menge ändern
> - Gesamtpreis automatisch berechnen (inklusive Rabatt)
> - Fehlermeldung bei unzureichendem Bestand
>
> Bitte schreiben Sie nach dem TDD-Ansatz zuerst Testfälle (ohne Implementierung),
> verwenden Sie Vitest und decken Sie alle Kernszenarien ab.
> ```

::: tip AI-Verwendungshinweis
Überprüfen Sie, ob die von der KI generierten Test-Assertions sinnvoll sind — vermeiden Sie unnötige Tests wie `expect(true).toBe(true)`. Ein guter Test sollte tatsächlich scheitern, wenn der Code Fehler enthält.
:::

---

## 6. Zusammenfassung

1. **Testpyramide**: Unten viele, oben wenige — Geschwindigkeit und Realitätsnähe ausbalancieren
2. **Unit-Tests**: Dem FIRST-Prinzip und dem AAA-Muster folgen, Kernlogik testen
3. **TDD**: Rot-Grün-Refactoring-Zyklus, Tests treiben das Design
4. **Strategieauswahl**: Passende Testverhältnisse nach Projekttyp und -phase wählen

::: tip Schlussgedanke
Tests sind keine Belastung, sondern ein **Beschleuniger**. Kurzfristig kostet das Schreiben von Tests zwar Zeit; langfristig spart es unzählige Stunden für manuelle Prüfungen, die Untersuchung von Regressionsbugs und nächtliche Notfallreparaturen. Gute Tests geben Ihnen das Selbstvertrauen, sagen zu können: **„Ändern Sie ruhig — die Tests werden uns sagen, ob etwas nicht stimmt."**
:::

---

## Weiterführende Literatur

- **Klassisches Buch**: Kent Becks „Test-Driven Development" ist das Ursprungswerk des TDD.
- **Praktischer Leitfaden**: Versuchen Sie, mit Vitest Tests für ein kleines Projekt zu schreiben und den gesamten Testprozess von null an zu erleben.
- **Testmuster**: Verstehen Sie die Unterschiede und Einsatzszenarien von Mock, Stub und Spy.
- **Continuous Integration**: Integrieren Sie Tests in Ihre CI/CD-Pipeline, damit sie bei jedem Commit automatisch ausgeführt werden.
