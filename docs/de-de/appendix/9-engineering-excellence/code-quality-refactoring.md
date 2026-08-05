# Code-Qualität und Refactoring

::: tip Vorwort
**Code, der funktioniert, reicht das aus?** Sie haben wahrscheinlich schon solchen Code geschrieben: Die Funktion ist implementiert, aber nach zwei Wochen verstehen Sie ihn selbst nicht mehr. Oder ein Teammitglied hat das Unternehmen verlassen und einen Haufen Code hinterlassen, den "nur Gott und er verstehen".

Dieses Kapitel zeigt Ihnen, was guter Code ist, wie Sie schlechten Code erkennen und wie Sie ihn sicher verbessern.
:::

**Was werden Sie in diesem Artikel lernen?**

| Kapitel | Inhalt | Kernkonzept |
|-----|------|---------|
| **Kapitel 1** | Code-Smells | Häufige Probleme erkennen |
| **Kapitel 2** | Refactoring-Techniken | Code sicher verbessern |
| **Kapitel 3** | Code-Review | Qualitätssicherung in der Teamarbeit |
| **Kapitel 4** | Qualitätsmetriken | Code-Gesundheit mit Daten messen |

Nach diesem Kapitel werden Sie in der Lage sein, Code-Probleme zu erkennen, sicher zu refaktorieren und durch Teamarbeit die Code-Qualität kontinuierlich zu verbessern.

---

## 0. Überblick: Der Lebenszyklus von Code

In der Softwareentwicklung gibt es eine oft übersehene Tatsache: **Code wird viel häufiger gelesen als geschrieben.**

Vom Entstehen bis zum Außerdienstnahme durchläuft Code grob folgende Reise:

::: tip Das Leben des Codes
- **Schreibphase**: Der Entwickler erstellt die erste Implementierung, die Funktion funktioniert, die Tests bestehen.
- **Review-Phase**: Teammitglieder lesen den Code und machen Verbesserungsvorschläge.
- **Wartungsphase**: Bugs beheben, Funktionen hinzufügen, neue Anforderungen anpassen — diese Phase macht über 80% des Code-Lebenszyklus aus.
- **Refactoring-Phase**: Wenn der Code schwer zu warten wird, muss die interne Struktur verbessert werden, ohne das externe Verhalten zu ändern.
- **Außerdienstnahme**: Technologie entwickelt sich weiter, alter Code wird durch neue Lösungen ersetzt.
:::

Martin Fowler sagte in seinem Buch „Refactoring": **„Jeder Narr kann Code schreiben, den ein Computer versteht. Nur gute Programmierer können Code schreiben, den Menschen verstehen."**

---

## 1. Code-Smells: Häufige Probleme erkennen

### 1.1 Was sind Code-Smells

Das Konzept der „Code-Smells" wurde von Kent Beck geprägt. Es bezeichnet Merkmale im Code, die **keine Bugs sind, aber auf tieferliegende Designprobleme hinweisen**. Wie ein seltsamer Geruch in einem Raum — er macht Sie nicht sofort krank, zeigt aber, dass irgendwo geputzt werden muss.

Erkennen Sie mit der folgenden interaktiven Komponente die häufigsten Code-Smells:

<CodeSmellDemo />

### 1.2 Liste häufiger Code-Smells

| Code-Smell | Symptom | Gefahr |
|-------|------|------|
| **Zu lange Funktionen** | Funktion länger als 50 Zeilen | Schwer zu verstehen, zu testen und wiederzuverwenden |
| **Magische Zahlen** | Direkt `86400000` im Code | Bedeutung unklar, Änderungen leicht zu übersehen |
| **Duplizierter Code** | Ähnliche Logik an mehreren Stellen | Bei Änderungen müssen mehrere Stellen synchronisiert werden |
| **Zu tiefe Verschachtelung** | Mehr als 3 Ebenen if/for | Logik wie ein Labyrinth, schwer zu verfolgen |
| **Zu lange Parameterlisten** | Funktion mit mehr als 4 Parametern | Schwer aufzurufen, Reihenfolge leicht zu verwechseln |
| **Gott-Klasse** | Eine Klasse/ein Modul macht zu viel | Unklare Zuständigkeiten, Änderung an einer Stelle wirkt sich überall aus |

::: tip Kern-Einblick
Code-Smells sind keine „Fehler", sondern „Signale". Sie sagen Ihnen: Das Design hier könnte verbessert werden müssen. Nicht jeder Code-Smell muss sofort behoben werden, aber Sie müssen in der Lage sein, ihn zu erkennen.
:::

---

## 2. Refactoring-Techniken: Code sicher verbessern

### 2.1 Was ist Refactoring

Die Definition von Refactoring ist sehr präzise: **Die interne Struktur des Codes verbessern, ohne sein externes Verhalten zu ändern.**

Das Schlüsselwort ist „externes Verhalten nicht ändern". Refactoring ist kein Neuschreiben, kein Hinzufügen von Funktionen und kein Beheben von Bugs. Es ist das „Aufräumen" im Codeinneren.

Vergleichen Sie mit der folgenden Komponente die Vorher-Nachher-Änderungen verschiedener Refactoring-Techniken:

<RefactoringDemo />

### 2.2 Gängige Refactoring-Techniken

**Methode extrahieren (Extract Function)**

Dies ist die am häufigsten verwendete Refactoring-Technik. Wenn ein Codeabschnitt mit einem aussagekräftigen Namen zusammengefasst werden kann, sollte er als Funktion extrahiert werden.

```javascript
// Vor dem Refactoring
function printReport(data) {
  // Gesamtpreis berechnen
  let total = 0
  for (const item of data.items) {
    total += item.price * item.qty
  }
  // Ausgabe...
}

// Nach dem Refactoring
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}

function printReport(data) {
  const total = calculateTotal(data.items)
  // Ausgabe...
}
```

**Umbenennen (Rename)**

Gute Namen sind die billigste und wirksamste Dokumentation. Wenn Sie einen Kommentar schreiben müssen, um die Bedeutung einer Variable oder Funktion zu erklären, ist der Name nicht gut genug.

```javascript
// Vor dem Refactoring
const d = new Date() - startTime  // Vergangene Zeit
const arr = users.filter(u => u.a) // Aktive Benutzer

// Nach dem Refactoring
const elapsedMs = new Date() - startTime
const activeUsers = users.filter(user => user.isActive)
```

**Verschachtelte Bedingungen durch Wächterklauseln ersetzen (Replace Nested Conditional with Guard Clauses)**

```javascript
// Vor dem Refactoring
function getPayAmount(employee) {
  if (employee.isSeparated) {
    return { amount: 0 }
  } else {
    if (employee.isRetired) {
      return { amount: employee.pension }
    } else {
      return { amount: employee.salary }
    }
  }
}

// Nach dem Refactoring
function getPayAmount(employee) {
  if (employee.isSeparated) return { amount: 0 }
  if (employee.isRetired) return { amount: employee.pension }
  return { amount: employee.salary }
}
```

::: tip Das Sicherheitsnetz des Refactorings
Das größte Risiko beim Refactoring ist, „dabei versehentlich Bugs einzubauen". Deshalb ist die Voraussetzung für Refactoring **Testabdeckung**. Nach jedem kleinen Refactoring-Schritt die Tests ausführen und sicherstellen, dass sich das Verhalten nicht geändert hat. Bei Code ohne Tests erst Tests schreiben, dann refaktorieren.
:::

---

## 3. Code-Review: Qualitätssicherung in der Teamarbeit

### 3.1 Warum ist Code-Review notwendig

Code-Review ist eines der effektivsten Qualitätssicherungsmittel in einem Team. Sein Wert liegt nicht nur im Finden von Bugs:

- **Wissensaustausch**: Teammitglieder verstehen den Code der anderen und senken den „Bus-Faktor" (Kann das Projekt weiterlaufen, wenn jemand vom Bus angefahren wird?)
- **Einheitlicher Stil**: Durch Reviews werden schrittweise Team-Coding-Standards entwickelt
- **Früherkennung von Designproblemen**: Schwerer zu beheben als Bugs sind schlechte Architekturentscheidungen
- **Gegenseitiges Lernen**: Den Code anderer zu lesen ist ein Abkürzung zur Verbesserung der Programmierfähigkeiten

### 3.2 Was wird reviewed

| Dimension | Fokus |
|------|--------|
| **Korrektheit** | Ist die Logik korrekt? Sind Randbedingungen behandelt? |
| **Lesbarkeit** | Sind die Namen klar? Ist die Struktur verständlich? |
| **Sicherheit** | Gibt es Injektionsrisiken? Sind sensible Daten exponiert? |
| **Performance** | Gibt es offensichtliche Performance-Probleme? N+1-Abfragen? |
| **Tests** | Gibt es entsprechende Tests? Sind die kritischen Pfade abgedeckt? |

### 3.3 Die Etikette des Reviews

Ein gutes Code-Review ist **eine Diskussion über den Code, keine Kritik an der Person**:

- Verwenden Sie „wir" statt „du": ~~„Du hast hier einen Fehler gemacht"~~ → „Hier könnten wir eine Guard Clause verwenden"
- Fragen statt Befehlen: ~~„Ändere das zu const"~~ → „Wird diese Variable später neu zugewiesen? Falls nicht, wäre const sicherer"
- Begründungen geben: Nicht nur sagen „schlecht", sondern „warum es schlecht ist" und „wie es besser sein könnte"

---

## 4. Code-Qualitätsmetriken

### 4.1 Zyklomatische Komplexität

Die Zyklomatische Komplexität (Cyclomatic Complexity) misst die Anzahl der unabhängigen Pfade im Code. Jedes `if`, `for`, `case`, `&&`, `||` erhöht die Komplexität.

| Komplexität | Bewertung | Empfehlung |
|--------|------|------|
| 1-10 | Einfach | Leicht zu verstehen und zu testen |
| 11-20 | Mittel | Aufteilung erwägen |
| 21-50 | Komplex | Refactoring erforderlich |
| 50+ | Nicht wartbar | Dringend refaktorieren |

### 4.2 Code-Abdeckung

Die Code-Abdeckung (Code Coverage) misst, wie viel Prozent des Codes von Tests ausgeführt werden. Häufige Metriken:

- **Zeilenabdeckung**: Anteil der ausgeführten Codezeilen an der Gesamtzahl
- **Verzweigungsabdeckung**: Anteil der ausgeführten Bedingungsverzweigungen an der Gesamtzahl

::: tip Die Abdeckungsfalle
80% Abdeckung bedeutet nicht, dass die Code-Qualität gut ist. Abdeckung sagt Ihnen nur, „welcher Code nicht getestet wurde", nicht ob „die Tests sinnvoll sind". Ein Test mit der Behauptung `expect(true).toBe(true)` erhöht die Abdeckung, hat aber keinen Wert.
:::

### 4.3 Praktische Tools

| Tool | Verwendung |
|------|------|
| **ESLint** | JavaScript/TypeScript statische Analyse |
| **Prettier** | Code-Formatierung, einheitlicher Stil |
| **SonarQube** | Umfassende Code-Qualitätsplattform |
| **Husky** | Git Hooks, automatische Prüfungen vor Commits |

---

## 5. AI-Unterstützung: Große Sprachmodelle für bessere Code-Qualität

Große Sprachmodelle sind im Bereich der Code-Qualität bereits sehr praktisch einsetzbar. Sie können als Ihr „24-Stunden-Online-Code-Reviewer" fungieren.

### 5.1 Code-Smells erkennen

> **Prompt**:
> ```
> Bitte überprüfen Sie den folgenden Code und identifizieren Sie Code-Smells,
> einschließlich, aber nicht beschränkt auf: zu lange Funktionen, magische Zahlen,
> duplizierter Code, zu tiefe Verschachtelung, zu lange Parameterlisten.
> Geben Sie für jedes Problem die genaue Stelle, Problembeschreibung und Verbesserungsvorschläge an.
>
> [Fügen Sie Ihren Code ein]
> ```

### 5.2 Automatisches Refactoring

> **Prompt**:
> ```
> Bitte refaktorieren Sie den folgenden Code mit folgenden Anforderungen:
> 1. Das externe Verhalten nicht ändern
> 2. Techniken wie Funktions-Extraktion und Wächterklauseln verwenden
> 3. Benennung verbessern, magische Zahlen eliminieren
> 4. Die Gründe für jedes Refactoring-Schritt erklären
>
> [Fügen Sie Ihren Code ein]
> ```

### 5.3 Code-Review simulieren

> **Prompt**:
> ```
> Bitte überprüfen Sie diesen Code aus der Perspektive eines Senior-Entwicklers
> und geben Sie Feedback zu folgenden Dimensionen:
> - Korrektheit: Gibt es Bugs in der Logik? Sind Randbedingungen behandelt?
> - Lesbarkeit: Sind die Namen klar? Ist die Struktur verständlich?
> - Performance: Gibt es offensichtliche Performance-Probleme?
> - Sicherheit: Gibt es Injektions- oder Datenleck-Risiken?
> Verwenden Sie einen beratenden Ton und geben Sie Verbesserungsvorschläge.
>
> [Fügen Sie Ihren Code ein]
> ```

::: tip AI-Verwendungshinweis
AI-Refactoring-Vorschläge müssen Sie selbst überprüfen — Tests ausführen, um sicherzustellen, dass sich das Verhalten nicht geändert hat. Betrachten Sie die AI als „einen Kollegen, der Vorschläge macht", nicht als „eine Autorität, der bedingungslos zu vertrauen ist".
:::

---

## 6. Zusammenfassung

Wir haben von der Problemerkennung bis zur Problemlösung ein vollständiges System zur Verbesserung der Code-Qualität aufgebaut:

1. **Erkennen**: Code-Smells wahrnehmen und wissen, wo Verbesserungen nötig sind
2. **Refaktorieren**: Sichere Refactoring-Techniken beherrschen und in kleinen Schritten unter Testschutz verbessern
3. **Zusammenarbeiten**: Durch Code-Reviews als Team gemeinsam die Code-Qualität sichern
4. **Messen**: Die Code-Gesundheit mit objektiven Metriken verfolgen

::: tiepit Schlussgedanke
Code-Qualität ist keine einmalige Arbeit, sondern eine kontinuierliche Gewohnheit. Wie beim Sauberhalten eines Zimmers — nicht erst groß putzen, wenn es nicht mehr auszuhalten ist, sondern jeden Tag ein bisschen aufräumen. Die **Pfadfinderregel** besagt: Hinterlassen Sie den Code etwas sauberer, als Sie ihn vorgefunden haben.
:::

---

## Weiterführende Literatur

- **Klassisches Buch**: Martin Fowlers „Refactoring: Improving the Design of Existing Code" ist die Bibel dieses Fachgebiets.
- **Clean Code**: Robert C. Martins „Clean Code" bietet viele praktische Codierungsprinzipien.
- **Praktische Tools**: Versuchen Sie, ESLint + Prettier + Husky in Ihrem Projekt zu konfigurieren und automatisierte Code-Qualitätssicherung zu erleben.
- **Code-Review**: Googles Code-Review-Leitfaden ist der Branchenstandard und lohnt sich zu studieren.
