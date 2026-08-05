# Datenbanken: Grundlagen
::: tip 🎯 Kernfrage
**Warum braucht Ihre Excel-Abfrage 10 Sekunden, während die Shopping-Suche nur 0,01 Sekunden benötigt?** Wenn Daten von „einigen Tausend" auf „eine Milliarde" anwachsen und von „Einzelplatznutzung" auf „Millionen gleichzeitiger Zugriffe", reicht Excel nicht mehr aus. Datenbanken wurden genau für dieses Problem entwickelt — sie sind das „Super-Excel" zur Verarbeitung riesiger Datenmengen und hoher Parallelität. Dieses Kapitel führt Sie von Null an in die Kernprinzipien von Datenbanken ein.
:::

---

## 1. Warum „Datenbanken"

### 1.1 Vom kleinen Buchladen zum Online-Marktplatz: Die Evolution der Datenmenge

Stellen Sie sich vor, Sie betreiben eine kleine Buchhandlung und verkaufen täglich ein paar Bücher. Sie notieren in einem Notizbuch:

```
2024-01-15: Max hat „Hundert Jahre Einsamkeit" gekauft, 59 Euro
2024-01-16: Anna hat „Das Leben" gekauft, 39 Euro
```

Das Notizbuch reicht völlig aus. Aber wenn Ihr Buchladen zu einem „Amazon" wird und täglich eine Million Bestellungen eingehen, entstehen Probleme:

- **Datenmenge**: Nicht Dutzende, sondern Hunderte Millionen Zeilen
- **Parallele Zugriffe**: Nicht eine Person fragt ab, sondern Millionen gleichzeitig
- **Datenverknüpfungen**: Bestellungen sind mit Nutzern, Produkten, Lagerbestand und Logistik verknüpft — komplexe Beziehungen müssen effizient verwaltet werden
- **Datensicherheit**: Ein Stromausfall darf nicht alle Bestellungen löschen

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📓 Excel/Notizbuch**
- Geeignet für Einzelpersonen oder kleine Teams
- Datenmenge: Tausend bis Zehntausend Zeilen
- Einzelnutzer, sequenzieller Zugriff
- Manuelle Suche, langsam

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🗄️ Datenbank**
- Geeignet für Enterprise-Anwendungen
- Datenmenge: Hunderte Millionen und mehr
- Millionen gleichzeitige Online-Zugriffe
- Abfragegeschwindigkeit im Millisekundenbereich

</div>
</div>

**Das ist das Problem, das „Datenbanken" lösen: Wie speichert man riesige Datenmengen effizient, fragt sie schnell ab und verwaltet sie sicher?**

### 1.2 Eine wahre Geschichte: Motivation von man Nutzerdaten nicht in Excel speichern sollte

Sie könnten sagen: „Mein Projekt hat nur ein paar Zehntausend Nutzer — da reicht Excel doch, oder?" Lassen Sie mich eine wahre Geschichte erzählen.

::: warning Kleins Gründungs-Fiasko
Klein gründete eine Social-App. Anfangs gab es nicht viele Nutzer, also speicherte er die Nutzerdaten (Name, Telefonnummer, Registrierungsdatum usw.) in Excel. Jeden Tag exportierte er die Daten, um das Nutzerwachstum auszuwerten — alles lief normal.

Als die Nutzerzahl 100.000 überschritt, begannen die Probleme:
- Excel brauchte 5 Minuten zum Öffnen
- Die Filterung nach „Nutzer aus Berlin" ließ das Programm einfrieren
- Einmal wurde die Excel-Datei beschädigt und Tausende Nutzerdaten waren unwiederbringlich verloren

Am kritischsten war: Er wollte die Funktion „Alle Bestellungen eines Nutzers anzeigen" implementieren — aber Nutzerdaten und Bestellungen lagen in verschiedenen Excel-Tabellen, also musste er manuell kopieren und einfügen, was jedes Mal eine halbe Stunde dauerte.

Er fragte einen erfahrenen Kollegen um Rat. Der sah es sich an und lachte: „Was du brauchst, ist keine Excel-Datei, sondern eine Datenbank."

Nach dem Wechsel zur Datenbank änderte sich alles:
- Die Abfrage „Nutzer aus Berlin" dauerte nur noch 0,01 Sekunden
- Nutzer und Bestellungen wurden über „Beziehungen" automatisch verknüpft — eine einzige SQL-Anweisung reichte
- Automatische Daten-Backups — keine Angst mehr vor Dateibeschädigung

Klein begriff eine Wahrheit: **Wenn die Datenmenge klein ist, funktioniert alles; aber wenn die Daten wachsen, wird Excel zur Katastrophe.**
:::

::: info 💡 Kern-Erkenntnis
Eine Datenbank ist kein „komplizierteres Excel", sondern folgt einem völlig anderen Designansatz:
- **Excel**: Entworfen für kleine Daten und Einzelplatznutzung
- **Datenbank**: Entworfen für große Daten, hohe Parallelität und komplexe Verknüpfungen

Die Wahl des richtigen Werkzeugs kann die Systemleistung um das Tausendfache steigern.
:::

---

## 2. Kernkonzepte: Tabelle, Zeile, Spalte, Primärschlüssel

::: tip 🤔 Was haben diese Konzepte mit Datenbanken zu tun?
Tabellen, Zeilen, Spalten und Primärschlüssel sind die „Bausteine" von Datenbanken.

Stellen Sie sich vor, Sie bauen ein Haus:
- **Tabelle** = ein Raum (speichert eine Art von Daten)
- **Zeile** = eine Kiste im Raum (ein vollständiger Datensatz)
- **Spalte** = das Etikett auf der Kiste (Name, Alter usw.)
- **Primärschlüssel** = die eindeutige Nummer der Kiste (niemals doppelt)

Wenn Sie diese Grundkonzepte verstehen, wissen Sie, wie Daten organisiert sind.
:::

Bevor wir tiefer in Datenbanken einsteigen, müssen wir diese Kernkonzepte klären. Wir verwenden die Bibliotheksmetapher als Vergleich.

### 2.1 Die Bibliotheksmetapher: Datenbankstruktur verstehen

Stellen Sie sich vor, Sie betreten eine Bibliothek. Die Organisation dort ist erstaunlich ähnlich wie in einer Datenbank:

| Konzept | 📚 Bibliotheksmetapher | Tatsächliche Funktion | Konkretes Beispiel |
|------|-------------|----------|----------|
| **Datenbank (Database)** | Die gesamte Bibliothek | Container für alle Daten | Datenbank einer E-Commerce-Website |
| **Tabelle (Table)** | Ein Bücherregal | Sammlung derselben Art von Daten | Nutzertabelle, Produkttabelle, Bestelltabelle |
| **Spalte (Column)** | Das Etikett auf dem Buchrücken | Attribute (Felder) der Daten | Name, Alter, Telefonnummer |
| **Zeile (Row)** | Jedes Buch im Regal | Ein konkreter Daten-Datensatz | „Max, 25 Jahre, Berlin" |
| **Primärschlüssel (Primary Key)** | Die ISBN-Nummer jedes Buches | Eindeutige ID für jede Zeile | user_id = 1001 |

**Ein konkretes Beispiel**: Nutzertabelle (users)

| user_id (Primärschlüssel) | name | age | city | email |
|:-------------:|------|-----|------|-------|
| 1001 | Max | 25 | Berlin | max@example.com |
| 1002 | Anna | 30 | München | anna@example.com |
| 1003 | Tom | 28 | Berlin | tom@example.com |

- **Tabelle**: `users` (speichert alle Nutzerdaten)
- **Spalten**: `user_id`, `name`, `age`, `city`, `email` (Attribute jedes Nutzers)
- **Zeilen**: Jede Zeile ist ein Nutzer (z. B. „Max, 25 Jahre, Berlin")
- **Primärschlüssel**: `user_id` (1001, 1002, 1003 — niemals doppelt)

### 2.2 Primärschlüssel (Primary Key): Die „Eindeutiger Bezeichnernummer" der Daten

::: tip 📖 Was ist ein Primärschlüssel?
Der **Primärschlüssel** ist die eindeutige Kennung jeder Zeile in einer Tabelle — wie die Personalausweisnummer.

**Wesentliche Merkmale**:
- **Eindeutigkeit**: Niemals doppelt (keine zwei Personen haben dieselbe Ausweisnummer)
- **Nicht leer**: Muss einen Wert haben (es gibt keinen Menschen „ohne Personalausweisnummer")
- **Unveränderlichkeit**: Einmal festgelegt, wird er nicht geändert (Ihre Ausweisnummer ändert sich nicht)

**Gängige Methoden**:
- Auto-Inkrement-Ganzzahlen verwenden: 1, 2, 3, 4...
- UUID (Universally Unique Identifier) verwenden: `550e8400-e29b-41d4-a716-446655440000`
:::

Warum braucht man einen Primärschlüssel? Stellen Sie sich eine Welt ohne Primärschlüssel vor:

**Szenario**: Sie möchten das Alter von „Max" ändern, aber es gibt drei „Max" in der Tabelle. Welchen soll das System ändern?

```sql
-- Ohne Primärschlüssel: Das ändert alle namens „Max" gleichzeitig!
UPDATE users SET age = 26 WHERE name = 'Max';

-- Mit Primärschlüssel: Präzise Änderung
UPDATE users SET age = 26 WHERE user_id = 1001;
```

**Die goldene Regel des Primärschlüssels**: Jede Tabelle sollte einen Primärschlüssel haben, und er sollte niemals geändert werden.

### 2.3 Fremdschlüssel (Foreign Key): Die Brücke zwischen Tabellen

Das ist der Schlüssel, warum Datenbanken mächtiger als Excel sind — **Tabellen können miteinander in Beziehung gesetzt werden**.

::: tip 📖 Was ist ein Fremdschlüssel?
Ein **Fremdschlüssel** ist eine Spalte, die auf den Primärschlüssel einer anderen Tabelle verweist und Beziehungen zwischen Tabellen herstellt.

**Einfach gesagt**:
- Primärschlüssel = meine Personalausweisnummer
- Fremdschlüssel = die Personalausweisnummer, die ich von jemand anderem referenziere

**Ein Beispiel**: Das Feld `user_id` in der Bestelltabelle ist ein Fremdschlüssel, der auf den Primärschlüssel der Nutzertabelle verweist.
:::

Ein konkretes Beispiel:

**Nutzertabelle (users)**:

| user_id (Primärschlüssel) | name | phone |
|:-------------:|------|-------|
| 1001 | Max | 0151xxx |
| 1002 | Anna | 0170xxx |

**Bestelltabelle (orders)**:

| order_id (Primärschlüssel) | product_name | price | user_id (Fremdschlüssel) |
|:--------------:|-------------|-------|:-------------:|
| 5001 | iPhone 15 | 5999 | 1001 |
| 5002 | MacBook | 14999 | 1001 |
| 5003 | AirPods | 1999 | 1002 |

**Wichtiges Verständnis**:
- `user_id = 1001` in der Bestelltabelle verweist auf `user_id = 1001` (Max) in der Nutzertabelle
- Wenn Sie fragen „Wer hat Bestellung 5001 getätigt?", sucht die Datenbank automatisch in der Nutzertabelle nach dem Nutzer mit `user_id = 1001`

**Vorteile**:
- **Keine Datenredundanz**: Selbst wenn Max 100 Artikel kauft, stehen seine Informationen nur einmal in der Nutzertabelle
- **Einfache Wartung**: Wenn Max seine Telefonnummer ändert, muss nur die Nutzertabelle aktualisiert werden; alle Bestellungen verweisen automatisch auf die neue Nummer
- **Flexible Abfragen**: Komplexe Fragen wie „Wie viel hat jeder Nutzer insgesamt ausgegeben?" lassen sich leicht beantworten

<DatabaseRelationDemo />

---

## 3. Wie spricht man mit einer Datenbank? SQL-Einführung und Praxis

Sie können eine Datenbank nicht einfach mit der Maus „anklicken" (es gibt zwar grafische Tools, aber diese wandeln die Klicks im Hintergrund in Befehle um). Sie benötigen eine spezielle Sprache, um die Datenbank zu steuern.

Diese Sprache heißt **SQL (Structured Query Language, strukturierte Abfragesprache)**.

Die gute Nachricht: SQL ist dem natürlichen Englisch sehr ähnlich und liest sich fast wie gesprochene Sprache.

### 3.1 Die Kernoperationen von SQL: CRUD

Meistens reicht es, vier Operationen zu beherrschen, die in der Branche als **CRUD** bezeichnet werden:

| Operation | Englisch | SQL-Schlüsselwort | Anschauliche Erklärung |
|------|------|------------|----------|
| **C**reate | Erstellen | `INSERT` | Einen neuen Datensatz hinzufügen |
| **R**ead | Lesen | `SELECT` | Daten abfragen |
| **U**pdate | Aktualisieren | `UPDATE` | Daten ändern |
| **D**elete | Löschen | `DELETE` | Daten entfernen |

::: tip 📊 Was zeigt die Tabelle?
Diese vier Operationen decken alle Datenverarbeitungsszenarien ab:
- **Create**: Wenn ein Nutzer sich registriert, wird ein neuer Nutzerdatensatz eingefügt
- **Read**: Wenn ein Nutzer sich einloggt, werden Benutzername und Passwort abgefragt
- **Update**: Wenn ein Nutzer sein Profil bearbeitet, werden die Daten in der Tabelle aktualisiert
- **Delete**: Wenn ein Nutzer sein Konto löscht, werden die Nutzerdaten entfernt

Wenn Sie diese vier beherrschen, haben Sie 80 % der alltäglichen SQL-Operationen drauf.
:::

### 3.2 Daten abfragen (SELECT): Die am häufigsten verwendete Datenbankoperation

Abfragen sind die wichtigste Funktion von Datenbanken und der Schlüssel zur Leistungsoptimierung.

**Beispiel 1**: Alle Nutzer aus Berlin finden

```sql
SELECT name, age FROM users WHERE city = 'Berlin';
```

**Wort-für-Wort-Verständnis**:
- `SELECT name, age`: Die Spalten name und age auswählen
- `FROM users`: Aus der Tabelle users
- `WHERE city = 'Berlin'`: Unter der Bedingung, dass city gleich „Berlin" ist

**Ergebnis**:

| name | age |
|------|-----|
| Max | 25 |
| Tom | 28 |

**Beispiel 2**: Produkte mit einem Preis zwischen 5000 und 15000 finden

```sql
SELECT name, price FROM products
WHERE price BETWEEN 5000 AND 15000;
```

**Beispiel 3**: Unscharfe Suche (Nutzer finden, deren Name „Ma" enthält)

```sql
SELECT name FROM users WHERE name LIKE '%Ma%';
```

::: warning ⚠️ Performance-Falle: LIKE-Verwendung
`LIKE '%Ma%'` führt zu einem **Full Table Scan** und ist bei großen Datenmengen sehr langsam.

**Optimierungsempfehlung**:
- ❌ Nicht `LIKE '%Ma%'` verwenden (% vorne und hinten)
- ✅ `LIKE 'Ma%'` ist akzeptabel (nur hinten %)

Denn `LIKE 'Ma%'` kann einen Index nutzen, während `LIKE '%Ma%'` keinen Index verwenden kann.
:::

### 3.3 Daten einfügen (INSERT): Neue Datensätze hinzufügen

**Beispiel**: Einen neuen Nutzer hinzufügen

```sql
INSERT INTO users (user_id, name, age, city, email)
VALUES (1004, 'Lisa', 35, 'Hamburg', 'lisa@example.com');
```

**Wort-für-Wort-Verständnis**:
- `INSERT INTO users`: In die Tabelle users einfügen
- `(user_id, name, age, city, email)`: Die einzufügenden Spalten angeben
- `VALUES (1004, 'Lisa', ...)`: Die entsprechenden Werte

**Batch-Einfügen** (effizienter):

```sql
INSERT INTO users (name, age, city) VALUES
('Felix', 25, 'Berlin'),
('Sophie', 28, 'München'),
('Paul', 30, 'Hamburg');
```

### 3.4 Daten aktualisieren (UPDATE): Datensätze ändern

**Beispiel**: Das Alter aller Berliner Nutzer um 1 erhöhen

```sql
UPDATE users SET age = age + 1 WHERE city = 'Berlin';
```

::: danger ❌ Sehr gefährlich: Die WHERE-Klausel nicht vergessen!
Wenn Sie die `WHERE`-Klausel vergessen, werden **alle Zeilen** geändert!

```sql
-- Gefährlich! Das ändert das Alter aller Nutzer auf 26
UPDATE users SET age = 26;

-- Richtig: Nur den Nutzer mit user_id = 1001 ändern
UPDATE users SET age = 26 WHERE user_id = 1001;
```

**Wahre Lektion**: 2012 hat ein Ingenieur bei einem bekannten Unternehmen die WHERE-Klausel vergessen, wodurch in der Produktionsumgebung Millionen von Nutzerdaten fehlerhaft aktualisiert wurden. Das System war 4 Stunden lang ausgefallen, mit enormen Verlusten.
:::

### 3.5 Daten löschen (DELETE): Datensätze entfernen

**Beispiel**: Den Nutzer mit user_id = 1004 löschen

```sql
DELETE FROM users WHERE user_id = 1004;
```

::: danger ❌ Doppelt gefährlich: DELETE braucht WHERE erst recht!
```sql
-- Gefährlich! Löscht alle Daten der gesamten Tabelle!
DELETE FROM users;

-- Richtig: Nur die angegebene Zeile löschen
DELETE FROM users WHERE user_id = 1004;
```

**Best Practices**:
1. Vor dem Löschen mit SELECT die Daten bestätigen
2. In wichtigen Systemen „Soft Deletes" verwenden (ein `is_deleted`-Feld zum Markieren hinzufügen)
3. Vor Operationen in der Produktionsumgebung immer Daten sichern
:::

### 3.6 Multi-Tabellen-Abfragen (JOIN): Der magische Moment der Datenbank

Erinnern Sie sich an die „Fremdschlüssel", die wir besprochen haben? Die größte Stärke von SQL ist die Fähigkeit, mehrere verknüpfte Tabellen in einer einzigen Abfrage zu durchsuchen.

**Szenario**: „Alle Produkte, die Max gekauft hat" abfragen

Wir haben drei Tabellen:

**Nutzertabelle (users)**:
| user_id | name |
|---------|------|
| 1001 | Max |

**Produkttabelle (products)**:
| product_id | name | price |
|------------|------|-------|
| 201 | iPhone 15 | 5999 |
| 202 | MacBook | 14999 |

**Bestelltabelle (orders)**:
| order_id | user_id | product_id | quantity |
|----------|---------|------------|----------|
| 5001 | 1001 | 201 | 1 |
| 5002 | 1001 | 202 | 2 |

**SQL-Abfrage**:

```sql
SELECT u.name, p.name AS product_name, p.price, o.quantity
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN products p ON o.product_id = p.product_id
WHERE u.name = 'Max';
```

**Ergebnis**:

| name | product_name | price | quantity |
|------|--------------|-------|----------|
| Max | iPhone 15 | 5999 | 1 |
| Max | MacBook | 14999 | 2 |

**Den JOIN-Prozess verstehen**:
1. `FROM orders o`: Mit der Bestelltabelle beginnen
2. `JOIN users u ON o.user_id = u.user_id`: Die Nutzertabelle über user_id verknüpfen
3. `JOIN products p ON o.product_id = p.product_id`: Die Produkttabelle über product_id verknüpfen
4. `WHERE u.name = 'Max'`: Nur Max' Bestellungen filtern

<SqlPlaygroundDemo />

---

## 4. Warum sind Datenbanken so schnell? Das Geheimnis der Indizes

Das ist der faszinierendste Teil von Datenbanken und gleichzeitig die am häufigsten gestellte Frage in Vorstellungsgesprächen.

Wenn Sie in Excel „alle Personen mit Nachnamen Ma" suchen, muss Excel von der ersten bis zur letzten Zeile scannen. Das ist ein **Full Table Scan** — je mehr Daten, desto langsamer.

In einer Datenbank hingegen dauert die Suche selbst bei 1 Milliarde Zeilen nur wenige Millisekunden.

**Das Geheimnis heißt: Index (Index).**

### 4.1 Intuitives Verständnis: Die Inspiration des Wörterbuchs

Stellen Sie sich vor, Sie müssen in einem 1000-seitigen Buch ohne Inhaltsverzeichnis ein Wort finden. Was tun Sie?

**Sie können nur Seite für Seite blättern** — das ist der Full Table Scan, durchschnittlich 500 Seiten.

Aber was wäre, wenn das Buch ein **Alphabet-Index** hätte?

Sie suchen das Wort „Datenbank":
1. Zum Index blättern und den Bereich mit „D" finden
2. Im „D"-Bereich nach „a" suchen
3. Der Index sagt Ihnen: auf Seite 256

Sie finden es mit nur 3 Nachschlägen! Das ist die **Indexsuche**.

**Der Index einer Datenbank ist wie das Inhaltsverzeichnis eines Buches**:
- Ohne Index: Zeilenweiser Scan (1 Milliarde Zeilen = mehrere Minuten)
- Mit Index: Direktsprung (1 Milliarde Zeilen = 3 Disk-I/Os = wenige Millisekunden)

### 4.2 Full Table Scan vs. Indexsuche: Geschwindigkeitsvergleich

Angenommen, wir haben eine Nutzertabelle mit 10 Millionen Einträgen.

**Szenario**: Den Nutzer mit `user_id = 5,555,555` finden

| Methode | Prozess | Zu prüfende Zeilen | Geschätzte Dauer |
|------|------|----------------|----------|
| **Full Table Scan** | Von Zeile 1 beginnend, Zeile für Zeile prüfen | Durchschnittlich 5 Millionen Zeilen | 5-30 Sekunden |
| **Indexsuche** | Den Indexbaum prüfen und direkt zur Zielposition springen | 3-4 Vergleiche | 0,003 Sekunden |

**Geschwindigkeitsunterschied: Mehrere tausendfach!**

::: tip 💡 Kern-Erkenntnis
Indizes sind kein Wundermittel; sie haben ihren Preis:
- **Speicherbedarf**: Indizes benötigen zusätzlichen Speicherplatz
- **Langsamere Schreibvorgänge**: Bei jedem INSERT/UPDATE/DELETE muss auch der Index aktualisiert werden

**Wann sollte man einen Index erstellen?**
- Bei Spalten, die häufig in Abfragen verwendet werden (WHERE-, JOIN-Bedingungen)
- Bei großen Datenmengen (wenige Tausend Zeilen brauchen keinen Index)

**Wann sollte man keinen Index erstellen?**
- Bei Spalten, die selten abgefragt werden
- Bei Spalten, die häufig aktualisiert werden
- Bei kleinen Tabellen
:::

### 4.3 Die zugrundeliegende Datenstruktur: B+ Baum

Echte Indizes sind keine einfachen „alphabetischen Listen", sondern eine sorgfältig entworfenen Datenstruktur namens **B+ Baum (B+ Tree)**.

::: tip 📖 Was ist ein B+ Baum?
Der **B+ Baum** ist eine „flache, breite" baumförmige Datenstruktur:

- **Flach**: Von der Wurzel bis zum Blatt gibt es normalerweise nur 3-4 Ebenen
- **Breit**: Jeder Knoten kann mehrere Hundert Schlüsselwerte speichern

**Warum „flach und breit "?**

Daten werden auf der Festplatte gespeichert, und jeder Festplatten-Lesezugriff (I/O) ist extrem langsam (Tausende Mal langsamer als der Arbeitsspeicher). Das Designziel des B+ Baums ist es, **die Anzahl der Festplatten-I/Os zu minimieren**.

- 3-4 Ebenen Höhe = maximal 3-4 Festplatten-Lesezugriffe
- Jede Ebene speichert große Datenmengen = stellt sicher, dass der Baum nicht zu hoch wird
:::

**Ein konkretes Beispiel**:

Angenommen, jeder Knoten eines B+ Baums kann 1000 Schlüsselwerte speichern:

- **Wurzelknoten**: 1000 Schlüsselwerte → zeigt auf 1000 Kindknoten
- **Mittlere Knoten**: Jeder speichert 1000 Schlüsselwerte → zeigt auf 1000 Blattknoten
- **Blattknoten**: Jeder speichert 1000 echte Daten

**Gesamtdatenmenge** = 1000 × 1000 × 1000 = **1 Milliarde Datensätze**

**Baumhöhe** = **3 Ebenen**

Das bedeutet: Um einen beliebigen Datensatz unter 1 Milliarde Datensätzen zu finden, werden nur **3 Festplatten-I/Os** benötigt!

Das ist das Geheimnis, warum Datenbankabfragen so extrem schnell sind.

<BPlusTreeDemo />

---

## 5. Transaktionen: Ansatz für verhindert man Datenverlust und Daten-Chaos

Stellen Sie sich die Ticketsituation zur Feiertagssaison vor:

- Zeit T1: Nutzer A fragt ab und sieht „Zug G1234 hat noch 1 Ticket"
- Zeit T2: Nutzer B fragt ebenfalls ab und sieht auch „noch 1 Ticket"
- Zeit T3: Nutzer A klickt auf „Kaufen"; das System zieht den Bestand ab und verkauft das Ticket an A
- Zeit T4: Nutzer B klickt auf „Kaufen" — ohne Schutzmechanismus zieht das System den Bestand erneut ab und verkauft dasselbe Ticket auch an B!

Das ist ein klassisches **Parallelitätskonflikt**-Problem.

### 5.1 Was ist eine Transaktion (Transaction)

Eine **Transaktion** ist eine Gruppe von Datenbankoperationen, die **entweder alle erfolgreich sind oder alle fehlschlagen** — es gibt keinen Zustand „halb ausgeführt".

::: tip 🤖 Ein Beispiel aus dem Alltag
**Banküberweisung** ist eine typische Transaktion:

1. Konto A wird um 100 Euro belastet
2. Konto B werden 100 Euro gutgeschrieben

Was passiert, wenn Schritt 1 gelingt, aber Schritt 2 fehlschlägt (z. B. durch Stromausfall)?
- **Ohne Transaktion**: Das Geld von Konto A ist weg, Konto B hat keins erhalten — das Geld ist spurlos verschwunden
- **Mit Transaktion**: Das System erkennt, dass Schritt 2 fehlgeschlagen ist, und macht Schritt 1 automatisch rückgängig (Rollback). Beide Konten kehren in den Ursprungszustand zurück

Das ist die **Atomizität** von Transaktionen: Alles oder Nichts.
:::

### 5.2 Die vier Eigenschaften von Transaktionen (ACID)

Transaktionen haben vier Eigenschaften, die als **ACID** abgekürzt werden:

| Eigenschaft | Englisch | Bedeutung | Beispiel bei der Banküberweisung |
|------|------|------|--------------|
| **A**tomicity | Atomizität | Alles oder Nichts | Belastung und Gutschrift müssen beide erfolgreich sein; es darf nicht nur belastet werden ohne Gutschrift |
| **C**onsistency | Konsistenz | Daten bleiben immer in einem gültigen Zustand | Vor und nach der Überweisung muss die Gesamtsumme beider Konten unverändert bleiben |
| **I**solation | Isolation | Mehrere Transaktionen beeinflussen sich nicht gegenseitig | Während A überweist, sieht B entweder den „Vorher"- oder den „Nachher"-Saldo, aber keinen Zwischenzustand |
| **D**urability | Dauerhaftigkeit | Einmal committet, sind die Daten dauerhaft gespeichert | Nach erfolgreicher Überweisung bleibt der Kontostand auch bei Stromausfall unverändert |

::: tip 📊 Was zeigt die Tabelle?
Diese vier Eigenschaften garantieren die Datensicherheit:

- **Atomizität**: Verhindert „halb ausgeführt" (Geld belastet, aber nicht gutgeschrieben)
- **Konsistenz**: Verhindert unlogische Daten (Gesamtsumme ändert sich nach der Überweisung)
- **Isolation**: Verhindert Parallelitätskonflikte (zwei Personen ändern gleichzeitig dieselben Daten)
- **Dauerhaftigkeit**: Verhindert Datenverlust (Commit übersteht Stromausfall)

Ohne diese Garantien könnte ein Bankensystem überhaupt nicht betrieben werden.
:::

### 5.3 Isolationsstufen von Transaktionen: Sicherheit vs. Leistung

Theoretisch wünschen wir uns vollständig isolierte Transaktionen. Aber **vollständige Isolation = extrem schlechte Leistung** (da viel gelockt werden muss und andere Transaktionen warten müssen).

Daher bieten Datenbanken vier **Isolationsstufen** an:

| Isolationsstufe | Dirty Read | Non-repeatable Read | Phantom Read | Leistung | Anwendungsszenario |
|----------|------|------------|------|------|----------|
| **Read Uncommitted** | Möglich | Möglich | Möglich | Am schnellsten | Kaum verwendet (Daten können falsch sein) |
| **Read Committed** | Nicht möglich | Möglich | Möglich | Schnell | Normale Geschäftsprozesse (Oracle-Standard) |
| **Repeatable Read** | Nicht möglich | Nicht möglich | Möglich | Mittel | Banküberweisungen (MySQL-Standard) |
| **Serializable** | Nicht möglich | Nicht möglich | Nicht möglich | Am langsamsten | Extrem strenge Szenarien (selten verwendet) |

::: tip 📖 Was bedeuten die drei „Read"-Arten?
- **Dirty Read**: Daten gelesen, die eine andere Transaktion noch nicht committet hat (könnten zurückgerollt werden, Daten ungenau)
- **Non-repeatable Read**: In derselben Transaktion wird derselbe Datensatz zweimal gelesen, aber mit unterschiedlichem Ergebnis (von einer anderen Transaktion geändert)
- **Phantom Read**: In derselben Transaktion werden zwei Abfragen ausgeführt, aber die Anzahl der Ergebniszeilen ist unterschiedlich (eine andere Transaktion hat Daten eingefügt/gelöscht)

**Alltägliche Beispiele** (Kontostand prüfen):
- **Dirty Read**: Sie sehen einen Kontostand von 1000 Euro, aber die andere Transaktion wird zurückgerollt — tatsächlich sind es nur 100 Euro
- **Non-repeatable Read**: Beim ersten Mal sehen Sie 1000 Euro, beim zweiten Mal nur noch 800 Euro (wurde belastet)
- **Phantom Read**: Beim ersten Mal sehen Sie 5 Transaktionen, beim zweiten Mal 6 (eine neue wurde hinzugefügt)
:::

<TransactionACIDDemo />

---

## 6. Leistungsoptimierung: Praxistipps, die Abfragen 1000x schneller machen

Jetzt verstehen Sie die Kernkonzepte von Indizes und Transaktionen. In echten Projekten können Sie jedoch auf verschiedene Performance-Probleme stoßen.

Dieser Abschnitt bietet **direkt umsetzbare Optimierungsstrategien**.

### 6.1 Leitfaden zur Vermeidung von Index-Fallen

::: warning ⚠️ Häufiger Fehler: Wenn Indizes nicht greifen
Oft haben Sie einen Index erstellt, aber die Abfrage ist trotzdem langsam — weil der Index **nicht verwendet wird**.

**Häufige Ursachen für nicht genutzte Indizes**:
1. Funktionen auf Index-Spalten angewendet
2. Implizite Typkonvertierung
3. LIKE-Abfrage beginnt mit %
4. OR-Bedingungen (in bestimmten Fällen)
5. Zusammengesetzter Index erfüllt nicht die Leftmost-Prefix-Regel
:::

**Falle 1: Funktionen auf Index-Spalten**

```sql
-- ❌ Falsch: Funktion auf Index-Spalte verhindert Indexnutzung
SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- ✅ Richtig: Als Bereichsabfrage umschreiben, Index kann genutzt werden
SELECT * FROM users
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
```

**Falle 2: Implizite Typkonvertierung**

```sql
-- Angenommen user_id ist vom Typ int
-- ❌ Falsch: String übergeben, führt zu impliziter Konvertierung, Index kann nicht genutzt werden
SELECT * FROM users WHERE user_id = '123';

-- ✅ Richtig: Den entsprechenden Typ übergeben
SELECT * FROM users WHERE user_id = 123;
```

**Falle 3: LIKE beginnt mit %**

```sql
-- ❌ Falsch: Beginnt mit %, Index kann nicht genutzt werden
SELECT * FROM users WHERE name LIKE '%Max%';

-- ✅ Richtig: Mit festem Präfix beginnen, Index kann genutzt werden
SELECT * FROM users WHERE name LIKE 'Max%';

-- ✅ Oder Volltextindex verwenden (für Textsuche geeignet)
SELECT * FROM users WHERE MATCH(name) AGAINST('Max');
```

### 6.2 SQL-Optimierung — Praxistemplates

**Template 1: Paginierungsoptimierung (Deep-Pagination-Problem)**

::: details Problem und Lösung anzeigen
```sql
-- ❌ Problem: Bei großem OFFSET wird die Abfrage immer langsamer
SELECT * FROM orders
ORDER BY created_at DESC
LIMIT 10 OFFSET 1000000;

-- ✅ Optimierung 1: Den Zeitstempel der letzten Abfrage als Cursor verwenden
SELECT * FROM orders
WHERE created_at < '2024-01-15 12:00:00'
ORDER BY created_at DESC
LIMIT 10;

-- ✅ Optimierung 2: Primärschlüssel-Bereichsabfrage verwenden
SELECT * FROM orders
WHERE order_id > 1000000
ORDER BY order_id
LIMIT 10;
```
:::

**Template 2: Batch-Einfüge-Optimierung**

```sql
-- ❌ Ineffizient: Mehrere Einzel-Einfügungen (mehrere Netzwerk-Roundtrips)
INSERT INTO users (name, age) VALUES ('Max', 25);
INSERT INTO users (name, age) VALUES ('Anna', 30);
INSERT INTO users (name, age) VALUES ('Tom', 28);

-- ✅ Effizient: Ein einzelnes SQL-Statement für Batch-Einfügung (nur ein Netzwerk-Roundtrip)
INSERT INTO users (name, age) VALUES
('Max', 25),
('Anna', 30),
('Tom', 28);
```

**Template 3: SELECT * vermeiden**

```sql
-- ❌ Ineffizient: Alle Spalten zurückgeben (inklusive unnötiger großer Felder)
SELECT * FROM users WHERE user_id = 1;

-- ✅ Effizient: Nur die benötigten Spalten zurückgeben
SELECT user_id, name, email FROM users WHERE user_id = 1;
```

### 6.3 Strategien für hohe Parallelität

| Szenario | Problem | Lösung |
|------|------|----------|
| **Hotspot-Daten** | Eine Zeile wird häufig gelesen/geschrieben, führt zu Lock-Konkurrenz | Cache (Redis) + Read/Write-Splitting |
| **Flash-Sale** | Plötzlich hohe Parallelität bei Bestandsreduzierung | Optimistisches Locking + Bestandsvorladen + Message Queue für Peak-Shaving |
| **Slow Queries** | Komplexe Abfragen bremsen die Datenbank aus | Index-Optimierung + Abfrage-Aufteilung + Read/Write-Splitting |
| **Verbindungserschöpfung** | Zu viele parallele Anfragen erschöpfen den Connection Pool | Connection-Pool-Optimierung + Rate-Limiting + Service-Degradation |

::: tip 💡 Kern-Erkenntnis
Die Grundprinzipien der Leistungsoptimierung:
1. **Zuerst messen, dann optimieren**: Mit `EXPLAIN` den Abfrageplan analysieren und den echten Engpass finden
2. **Indizes zuerst**: 80 % der Performance-Probleme lassen sich durch Index-Optimierung lösen
3. **Datenbanklast reduzieren**: Wenn ein Cache möglich ist, Cache verwenden; wenn asynchron möglich ist, asynchron arbeiten
4. **Teile und herrsche**: Große Tabellen in kleine aufteilen, große Abfragen in kleine aufteilen
:::

<QueryOptimizationDemo />

---

## 7. Zusammenfassung und Lernpfad

Lassen Sie uns die Kernkonzepte von Datenbanken in einer Tabelle rekapitulieren:

| Konzept | Erklärung in einem Satz | Gelöstes Problem | Kernpunkt |
|------|-----------|-----------|--------|
| **Tabelle, Zeile, Spalte** | Die Organisation der Daten | Wie strukturierte Daten gespeichert werden | Tabelle = Excel-Arbeitsblatt, Zeile = Datensatz, Spalte = Feld |
| **Primärschlüssel** | Eindeutige Kennung jeder Zeile | Wie man eine bestimmte Zeile präzise findet | Eindeutig, nicht leer, unveränderlich |
| **Fremdschlüssel** | Die Brücke zwischen Tabellen | Wie man Daten unterschiedlicher Tabellen verknüpft | Verweist auf den Primärschlüssel einer anderen Tabelle |
| **SQL** | Die Sprache, um mit der Datenbank zu sprechen | Wie man Daten einfügt, abfragt, ändert und löscht | SELECT, INSERT, UPDATE, DELETE |
| **Index** | Datenstruktur zur Beschleunigung von Abfragen | Wie man Daten schnell findet | B+ Baum, reduziert Disk-I/O |
| **Transaktion** | Mechanismus zur Gewährleistung der Datensicherheit | Wie man Parallelitätskonflikte und Datenverlust verhindert | ACID: Atomizität, Konsistenz, Isolation, Dauerhaftigkeit |

::: info Zum Schluss
Datenbanken sind ein tiefgründiges und umfangreiches Thema; dieser Artikel ist nur eine Einführung. Wenn Sie tiefer einsteigen möchten, empfehlen wir folgenden Lernpfad:

**Nächste Schritte**:
1. **Praktische Übungen**: MySQL oder PostgreSQL installieren, Tabellen erstellen, Daten einfügen und SQL-Abfragen schreiben
2. **ORM-Frameworks**: Lernen, wie man Datenbanken im Code verwendet (z. B. SQLAlchemy, Prisma, TypeORM)
3. **Index-Optimierung**: Zusammengesetzte Indizes, Covering Index, Index Pushdown und andere fortgeschrittene Themen vertiefen
4. **Transaktions-Prinzipien**: MVCC (Multi-Version Concurrency Control), Locking-Mechanismen und die Implementierung von Isolationsstufen verstehen
5. **Verteilte Datenbanken**: Sharding, Read/Write-Splitting, Master-Slave-Replikation und andere Architekturkonzepte lernen

Denken Sie daran: **Theorie + Praxis = wahre Meisterschaft**.
:::
