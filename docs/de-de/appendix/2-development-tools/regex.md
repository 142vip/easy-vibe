# Reguläre Ausdrücke: Mustererkennung

> 💡 **Lernleitfaden**: Sehen reguläre Ausdrücke für dich wie eine Geheimsprache aus? In Wirklichkeit sind sie nur eine Minisprache zur Beschreibung von Textmustern. Dieses Kapitel führt dich von Grund auf in die Kernideen der regulären Ausdrücke ein und zeigt dir, wie du mit wenigen Schlüsselsymbolen 80 % aller Textsuchen- und Validierungsprobleme löst.

---

## 0. Wozu brauchst du reguläre Ausdrücke

Stell dir folgende Szenarien vor:
- Aus einem riesigen Logfile alle IP-Adressen herausfiltern
- Prüfen, ob eine vom Benutzer eingegebene E-Mail-Adresse dem richtigen Format entspricht
- Alle Datumsformate im Text von `2024/01/15` auf `2024-01-15` ändern
- Aus dem Quellcode einer Webseite alle Links extrahieren

**Mit normaler Zeichensuche?** Du müsstest eine Menge `if-else`-Logik schreiben.
**Mit regulären Ausdrücken?** Ein einziges Muster erledigt das.

---

## 1. Regex-Einsteiger: In drei Minuten loslegen

👇 Probiere es aus: Gib einen regulären Ausdruck ein und sieh die Treffer in Echtzeit

<RegexDemo />

::: tip 💡 In einem Satz erklärt
Reguläre Ausdrücke = **Beschreibe mit Spezialsymbolen, nach welchem Textmuster du suchst**. `\d` steht für eine Ziffer, `+` für eine oder mehrere – also bedeutet `\d+` „eine oder mehrere Ziffern".
:::

---

## 2. Kernkonzepte: Ansatz für ein Baukastensystem kombinieren

Das Wesen der regulären Ausdrücke besteht darin, aus **drei Bausteintypen** das gewünschte Muster zusammenzusetzen:

### 2.1 Baustein 1: Zeichenklassen (welche Zeichen matchen)

| Syntax | Bedeutung | Beispiel |
|---|---|---|
| `.` | Beliebiges Zeichen | `a.c` → abc, a1c, a c |
| `\d` | Ziffer [0-9] | `\d\d` → 42, 99 |
| `\w` | Buchstabe/Ziffer/Unterstrich | `\w+` → hello, user_1 |
| `\s` | Whitespace | Matcht Leerzeichen, Tab |
| `[abc]` | Ein Zeichen aus der Menge | `[aeiou]` → Vokale |
| `[^abc]` | Kein Zeichen aus der Menge | `[^0-9]` → Nicht-Ziffern |

### 2.2 Baustein 2: Quantoren (wie oft matchen)

| Syntax | Bedeutung | Beispiel |
|---|---|---|
| `*` | 0 oder mehrmals | `ab*` → a, ab, abbb |
| `+` | 1 oder mehrmals | `ab+` → ab, abbb (nicht a) |
| `?` | 0 oder 1 Mal | `colou?r` → color, colour |
| `{3}` | Genau 3 Mal | `\d{3}` → 123 |
| `{2,4}` | 2 bis 4 Mal | `\d{2,4}` → 12, 1234 |

### 2.3 Baustein 3: Positionen und Gruppen

| Syntax | Bedeutung | Beispiel |
|---|---|---|
| `^` | Zeilenanfang | `^Hello` → Zeilen, die mit Hello beginnen |
| `$` | Zeilenende | `end$` → Zeilen, die mit end enden |
| `\b` | Wortgrenze | `\bcat\b` → cat (nicht catch) |
| `(...)` | Capture-Gruppe | `(\d+)-(\d+)` → getrennt erfassen |
| `a\|b` | Oder | `cat\|dog` → cat oder dog |

---

## 3. Praxis: Gängige Validierungsmuster

### 3.1 E-Mail-Validierung

```
[\w.+-]+@[\w-]+\.[\w.]+
```

Aufschlüsselung:
- `[\w.+-]+` — Benutzernamen-Teil (Buchstaben, Ziffern, Punkt, Plus, Bindestrich)
- `@` — Literales @-Zeichen
- `[\w-]+` — Domainnamen-Teil
- `\.` — Escaped Punkt
- `[\w.]+` — Top-Level-Domain

### 3.2 Mobiltelefonnummer-Validierung (China)

```
1[3-9]\d{9}
```

Aufschlüsselung:
- `1` — Beginnt mit 1
- `[3-9]` — Zweite Ziffer ist 3–9
- `\d{9}` — Gefolgt von 9 Ziffern

### 3.3 Passwortstärke-Prüfung

```
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$
```

Aufschlüsselung:
- `(?=.*[a-z])` — Mindestens ein Kleinbuchstabe (Lookahead-Assertion)
- `(?=.*[A-Z])` — Mindestens ein Großbuchstabe
- `(?=.*\d)` — Mindestens eine Ziffer
- `.{8,}` — Gesamtlänge mindestens 8 Zeichen

---

## 4. Reguläre Ausdrücke im Code verwenden

### JavaScript

```javascript
const text = 'Kontakt: 13812345678 oder 15099887766'
const regex = /1[3-9]\d{9}/g
const phones = text.match(regex)
// ['13812345678', '15099887766']

// Ersetzen
text.replace(/\d{4}(?=\d{4}$)/, '****')
// Mittlere vier Ziffern der Mobilnummer verbergen

// Validieren
/^[\w.+-]+@[\w-]+\.[\w.]+$/.test('user@example.com')
// true
```

### Python

```python
import re

text = 'Preis 99 Yuan, Rabatt 20 Yuan'
numbers = re.findall(r'\d+', text)
# ['99', '20']

# Ersetzen
re.sub(r'\d+', 'X', text)
# 'Preis X Yuan, Rabatt X Yuan'

# Gruppen erfassen
match = re.search(r'(\d+)-(\d+)', '2024-01-15')
match.group(1)  # '2024'
match.group(2)  # '01'
```

---

## 5. Greedy vs. Lazy: Ein entscheidender Unterschied

```
Text: <b>hello</b> und <b>world</b>
```

| Muster | Treffer | Erklärung |
|---|---|---|
| `<b>.*</b>` | `<b>hello</b> und <b>world</b>` | Greedy: matcht so viel wie möglich |
| `<b>.*?</b>` | `<b>hello</b>` | Lazy: matcht so wenig wie möglich |

::: tip 💡 Merke
Standardmäßig ist der Modus greedy. Durch Anhängen von `?` an einen Quantor wird er lazy. In den meisten Fällen benötigst du den Lazy-Modus.
:::

---

## 6. Zusammenfassung

::: tip 📚 Kernpunkte
1. **Regex = Minisprache zur Beschreibung von Textmustern** zum Suchen, Matchen, Ersetzen
2. **Drei Bausteintypen**: Zeichenklassen (was matchen) + Quantoren (wie oft) + Position/Gruppierung
3. **\d \w \s** sind die drei meistgenutzten Zeichenklassen – sie decken Ziffern, Wortzeichen und Whitespace ab
4. **Du musst nicht von Grund auf neu schreiben**: Für gängige Szenarien existieren bewährte Regex-Muster, die du wiederverwenden kannst
5. **Greedy vs. Lazy**: Standard greedy (matcht viel), mit `?` wird es lazy (matcht wenig)
:::

**Nächste Lernschritte**:
- [Umgebung und Pfad: Systemkonfiguration](./environment-path) - Systemkonfiguration verstehen
- [SSH und Schlüsselauthentifizierung](./ssh-authentication) - Sichere Verbindung zu Remote-Servern