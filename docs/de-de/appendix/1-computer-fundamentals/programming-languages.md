# Konzepte von Programmiersprachen: Paradigmen, Evolution und Auswahl

::: tip Vorwort
Warum gibt es so viele Programmiersprachen? Welche sollte man lernen? Dieses Kapitel führt Sie von der „Sprachevolution" über „Programmierparadigmen" bis hin zur „Sprachwahl" und vermittelt ein Gesamtverständnis der Programmiersprachen. **Vorab die Antwort: Es gibt keine beste Sprache, nur die für den Einsatzzweck passende.**
:::

**Was werden Sie in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels werden Sie Folgendes gewonnen haben:

- **Rationale Auswahl**: Bei der Frage „Welche Sprache lernen?" anhand der Projektanforderungen entscheiden können, statt blind Trends zu folgen
- **Paradigmen-Verständnis**: Begreifen, dass „objektorientiert" und „funktionale Programmierung" verschiedene Denkweisen sind, nicht nur Syntaxunterschiede
- **Historische Perspektive**: 70+ Jahre Sprachentwicklung — von handgeschriebenen Nullen und Einsen bis zu natürlichsprachlicher Codegenerierung
- **Grundlage für Weiteres**: Basis für das Verständnis neuer Sprachdesigns und Technologie-Entscheidungen

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | Sprachentwicklung | Von Maschinensprache zu Hochsprachen |
| **Kapitel 2** | Programmierparadigmen | Imperativ, objektorientiert, funktional |
| **Kapitel 3** | Sprachwahl | Szenariobasierte Auswahl |

---

## 0. Wie spricht der Mensch mit dem Computer

Stellen Sie sich vor, Sie müssen mit einem Roboter kommunizieren, der nur Binärcode versteht:

- **Direkt Nullen und Einsen eingeben** — Ursprünglichste Methode, extrem ineffizient, eine falsche 0 als 1 macht alles kaputt (Maschinensprache)
- **Mnemonics verwenden** — `MOV AX, 1` ist viel lesbarer als `10110000 00000001` (Assemblersprache)
- **Natürlichsprachliche Ausdrücke** — `int sum = 1 + 2;` ist direkt menschenlesbar (Hochsprache)

**Programmiersprachen sind die Brücke zwischen Mensch und Computer** und haben sich über 70 Jahre lang stets in Richtung „näher am menschlichen Denken" entwickelt.

---

## 1. Die Evolution der Programmiersprachen

👇 Probieren Sie es aus: Entdecken Sie die Evolution der Programmiersprachen von den 1940er Jahren bis heute

<LanguageMapDemo />

::: tip 💡 Zusammenfassend
Der Entwicklungstrend der Programmiersprachen: **Immer näher am menschlichen Denken, immer sicherer, immer effizienter.** Von handgeschriebenen 0/1 über Assembler-Mnemonics, C's strukturierte Programmierung, Java's Objektorientierung bis hin zu Rust's Speichersicherheit — jede Generation löste die Schmerzpunkte der vorherigen.
:::

---

## 2. Programmierparadigmen: Die Art, über Probleme zu denken

Programmierparadigmen sind keine Sprachfeatures, sondern **Denkweisen** — wie es beim Schreiben Lyrik, Romane und Essays als verschiedene literarische Formen gibt.

### 2.1 Imperativ — Dem Computer Schritt für Schritt sagen, wie es geht"

```c
int sum = 0;
for (int i = 0; i < n; i++) {
    sum += arr[i];
}
```

### 2.2 Objektorientiert — Daten und Verhalten in Objekten kapseln"

```python
class Dog:
    def __init__(self, name):
        self.name = name
    def bark(self):
        print(f"{self.name} says woof!")
```

### 2.3 Funktional — Mit reinen Funktionen kombinieren, keinen Zustand verändern"

```haskell
sum = foldl (+) 0
-- Gleiche Eingabe erzeugt immer gleiche Ausgabe
```

### 2.4 Deklarativ — Nur sagen, was getan werden soll, nicht wie"

```sql
SELECT name FROM users WHERE active = true
-- Die Datenbank entscheidet selbst, wie am schnellsten gesucht wird
```

::: tip 💡 In der Praxis
Die meisten modernen Sprachen sind **Multiparadigmen**. Python unterstützt sowohl objektorientierte als auch funktionale Programmierung; JavaScript ebenso. Strellen Sie sich nicht die Frage „Welches Paradigma ist das beste?", sondern wählen Sie die geeignetste Methode für Ihr Problem.
:::

---

## 3. Typsystem: Statisch/dynamisch und stark/schwach

| | Stark typisiert | Schwach typisiert |
|---|---|---|
| **Statisch** | Java, Rust, TypeScript — am sichersten | C, C++ — effizient, aber Vorsicht geboten |
| **Dynamisch** | Python, Ruby — flexibel und sicher | JavaScript, PHP — flexibel, aber fehleranfällig |

**Schlüsselfrage**: Was ergibt `"1" + 1`?
- **JavaScript (schwach typisiert)**: `"11"` — automatische Typumwandlung
- **Python (stark typisiert)**: `TypeError` — Sie müssen selbst klären

Tiefer einsteigen? → [Einführung in Typsysteme](./type-systems) | [Prinzipien der Kompilierung](./compilers)

---

## 4. Kompiliert vs. Interpretiert

| | Kompiliert | Interpretiert | JIT |
|---|---|---|---|
| **Ablauf** | Erst komplett übersetzen, dann ausführen | Zeilenweise lesen und ausführen | Erst interpretieren, Hotspots kompilieren |
| **Geschwindigkeit** | Am schnellsten | Eher langsam | Mittel |
| **Debugging** | Kompilierung abwarten | Sofortiges Feedback | Sofort + Optimierung |
| **Repräsentativ** | C, Rust, Go | Python, Ruby | Java, JavaScript |

---

## 5. Welche Programmiersprache wählen

### Nach Einsatzgebiet

| Einsatzgebiet | Empfohlene Sprache | Begründung |
|---|---|---|
| **Web-Frontend** | JavaScript, TypeScript | Browser verstehen nur JS |
| **Web-Backend** | Go, Java, Python, Node.js | Ausgereiftes Ökosystem |
| **Mobile Entwicklung** | Swift (iOS), Kotlin (Android) | Offizielle Empfehlung |
| **AI / Daten** | Python | PyTorch, Pandas sind in Python |
| **Systemprogrammierung** | C, Rust | Direkte Hardwarekontrolle |
| **Cloud-Native** | Go, Rust | Docker/K8s sind in Go geschrieben |

### Lernpfad-Empfehlung

1. **Python** — Einfachste Syntax, Einstiegssprache im AI-Zeitalter
2. **JavaScript** — Pflicht für Web-Entwicklung, Frontend und Backend abgedeckt
3. **TypeScript** — JS um ein Typsystem erweitern, statische Typisierung erleben
4. **Go oder Rust** — Kompilierte Sprachen und Low-Level-Konzepte verstehen

---

## 6. Zusammenfassung

::: tip 📚 Kernpunkte
1. **Sprachevolution**: Von Maschinensprache bis Hochsprache — immer näher am menschlichen Denken
2. **Programmierparadigmen**: Imperativ, objektorientiert, funktional, deklarativ — jedes mit eigenen Anwendungsfällen
3. **Typsystem**: Statisch/dynamisch, stark/schwach — beeinflusst Sicherheit und Flexibilität
4. **Ausführungsmodell**: Kompiliert am schnellsten, interpretiert am flexibelsten, JIT kombiniert beides
5. **Keine Silver Bullet**: Die Sprache zum Szenario wählen, nicht die „beste Sprache" suchen
:::

**Nächste Schritte**:
- [Prinzipien der Kompilierung](./compilers) - Kompilierungsprozess und Code-Optimierung vertiefen
- [Einführung in Typsysteme](./type-systems) - Typsysteme und Typsicherheit vertiefen
- [Einführung in Datenstrukturen](./data-structures) - Datenorganisation verstehen
- [Algorithmisches Denken](./algorithm-thinking) - Problemlösungsmethoden lernen
