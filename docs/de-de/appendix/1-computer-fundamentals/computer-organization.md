# Prinzipien des Computeraufbaus

::: tip Vorwort
**Wie wird aus dem CPU ein vollständiges Computersystem?** Im vorherigen Kapitel haben wir vom Transistor ausgehend Addierer, Register, Rechenwerke konstruiert und schließlich den CPU-Kern zusammengesetzt. Doch der CPU allein reicht nicht — er muss mit Speicher und I/O-Geräten zusammenarbeiten, Bussysteme verbinden die Komponenten und ein Befehlssystem steuert alles an. In diesem Kapitel wechseln wir von der CPU-internen Perspektive zur Systemsicht und vertiefen unser Verständnis der Von-Neumann-Architektur, des Befehlssystems, der Speicherhierarchie sowie von Bus und I/O.
:::

**Was werden Sie in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels werden Sie Folgendes gewonnen haben:

- **Systemperspektive**: Verstehen, wie CPU, Speicher und I/O zusammenarbeiten — kein isolierter Hardware-Enthusiast mehr
- **Hardware-Fachbegriffe**: Befehlszyklus, Pipeline, CPI, Cache-Trefferquote und weitere harte Konzepte beherrschen
- **Performance-Denken**: Engpässe und Optimierungsmaßnahmen in der Computerarchitektur verstehen
- **Grundlage für Weiteres**: Professionelle Basis für Betriebssysteme, Rechnerarchitektur und Embedded-Entwicklung

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | Von-Neumann-Architektur | Speicherprogrammkonzept, fünf Hauptkomponenten, Datenpfad |
| **Kapitel 2** | Befehlssystem | Befehlsformat, Adressierungsarten, CISC vs. RISC |
| **Kapitel 3** | CPU-Steuereinheit | Steuerwerk, Mikrooperationen, Befehlszyklus |
| **Kapitel 4** | Speicherhierarchie | Cache, Hauptspeicher, Virtueller Speicher, Paging |
| **Kapitel 5** | Bus und I/O | Bus-Arbitrierung, DMA, Interrupt-Mechanismus |

---

## 0. Übersicht: Das Computer-Hardwaresystem

Im vorherigen Kapitel „Vom Transistor zum CPU" haben wir verstanden, wie der CPU intern arbeitet — vom Holen, Dekodieren, Ausführen bis zum Zurückschreiben. Aber der CPU selbst ist nur eine Ausführungseinheit. Damit der Computer wirklich „nutzbar" wird, braucht es die Zusammenarbeit mehrerer Peripheriekomponenten.

<CpuArchitectureDemo />

::: tip Schichtweiser Aufbau: Das Computer-Hardwaresystem
- **Schicht 1: CPU-Kern**
  Verantwortlich für die Befehlsausführung, bestehend aus der Steuereinheit (Steuerungssignale) und dem Rechenwerk (arithmetisch-logische Operationen)

- **Schicht 2: Registersatz**
  Hochgeschwindigkeitsspeicher innerhalb des CPU, einschließlich Universalregister und Sonderregister (PC, IR, MAR, MDR usw.)

- **Schicht 3: Hauptspeicher**
  Speicher für Programme und Daten, den der CPU über Adressbus und Datenbus anspricht

- **Schicht 4: I/O-Geräte**
  Ein-/Ausgabegeräte, die über I/O-Controller mit dem Systembus verbunden sind

- **Schicht 5: Systembus**
  Datenpfad, der CPU, Speicher und I/O verbindet, einschließlich Adressbus, Datenbus und Steuerbus
:::

---

## 1. Von-Neumann-Architektur: Speicherprogrammkonzept und Datenpfad

### 1.1 Das Speicherprogrammkonzept

1945 schlug der Mathematiker John von Neumann die bahnbrechende **Speicherprogramm-(Stored-program)-Architektur** vor. Dieses Konzept legte den Grundstein für alle modernen Computer.

::: tip Kernkonzept
**Speicherprogramm**: Das Programm selbst wird als besondere Art von Daten genauso wie normale Daten im Speicher abgelegt. Der CPU kann die im Speicher befindlichen Programmbefehle genauso lesen und ausführen, wie er Daten liest und schreibt.
:::

Das bedeutet:
- **Frühe Computer**: Programme waren durch feste Verdrahtung realisiert; Programmänderungen erforderten neues Löten der Schaltungen
- **Von-Neumann-Architektur**: Programme sind im Speicher abgelegt; zur Programmänderung genügt die Änderung des Speicherinhalts

### 1.2 Die fünf Hauptkomponenten

Die Von-Neumann-Architektur gliedert den Computer in fünf Kernkomponenten:

<RegisterDemo />

| Komponente | Englisch | Funktion | Hauptbestandteile |
|------|------|------|---------|
| **Rechenwerk** | ALU (Arithmetic Logic Unit) | Ausführung arithmetischer und logischer Operationen | Addierer, Schieberegister, Vergleicher |
| **Steuerwerk** | CU (Control Unit) | Koordiniert alle Komponenten | Befehlsregister, Dekoder, Taktgenerator |
| **Speicherwerk** | Memory | Speichert Programme und Daten | Speicheradressregister (MAR), Speicherdatenregister (MDR) |
| **Eingabewerk** | Input | Informationseingabe | Tastatur, Maus, Scanner |
| **Ausgabewerk** | Output | Informationsausgabe | Bildschirm, Drucker |

### 1.3 Datenpfad

Der **Datenpfad (Data Path)** ist die Route, auf der Daten zwischen den einzelnen Funktionseinheiten fließen. Innerhalb des CPU verbindet der Datenpfad:

- Registersatz
- Arithmetisch-logische Einheit (ALU)
- Speicherdatenregister (MDR)

Die Breite des Datenpfads (wie viele Bits auf einmal übertragen werden können) beeinflusst direkt die Leistung des Computers.

### 1.4 Der Von-Neumann-Flaschenhals

Die Von-Neumann-Architektur hat einen berühmten **Leistungsengpass**:

> Die Datenübertragungsrate zwischen CPU und Speicher ist deutlich langsamer als die Verarbeitungsgeschwindigkeit des CPU.

Dadurch befindet sich der CPU oft im Leerlauf und „wartet auf Daten". Viele Optimierungstechniken moderner Computer drehen sich um dieses Problem:

| Optimierungstechnik | Prinzip |
|---------|------|
| **Cache** | Kleiner, schneller Speicher in CPU-Nähe |
| **Befehls-Pipeline** | Mehrere Befehle befinden sich gleichzeitig in verschiedenen Stufen |
| **Superskalar** | Mehrere Befehle pro Taktzyklus ausgeben |
| **MehrCore-Parallelität** | Mehrere CPU-Kerne teilen sich die Rechenaufgaben |

---

## 2. Befehlssystem: Die Schnittstelle zwischen CPU und Software

Im vorherigen Abschnitt haben wir das Kernkonzept der Von-Neumann-Architektur kennengelernt: **Programme und Daten werden gleichermaßen im Speicher abgelegt**. Das wirft eine Schlüsselfrage auf — wie sieht das im Speicher abgelegte „Programm" eigentlich aus? Wie kann der CPU es verstehen?

Die Antwort ist das **Befehlssystem (Instruction Set Architecture, ISA)**. Vergleicht man den CPU mit einem Dienst, dann ist das Befehlssystem seine **API-Dokumentation** — es definiert alle Befehle, die der CPU versteht, das Format jedes Befehls und den Datenbereich, den die Befehle ansprechen können. Jede Codezeile, die Sie schreiben, wird vom Compiler in eine Aufrufsequenz dieser „API" übersetzt.

### 2.1 Vom Code zum Befehl: Übersetzungsablauf
Lassen Sie uns zunächst ein Gesamtbild gewinnen: Der Code, den Sie in Ihrem Editor schreiben, und das, was der CPU tatsächlich ausführt, sind durch mehrere Übersetzungsschichten getrennt.

<CodeToInstructionDemo />

Diese Übersetzungskette ist der Schlüssel zum Verständnis des Befehlssystems:

| Schicht | Inhalt | Wer es versteht |
|------|------|---------|
| Hochsprache | `int a = 10 + 5;` | Menschen |
| Assemblersprache | `MOV R1, #10` / `ADD R3, R1, R2` | Menschen (mit Training) |
| Maschinencode | `0001 0001 0000 1010` | CPU |

::: tip Warum diese Kette verstehen?
- Bei Compilerfehlern wissen Sie, dass der Fehler im Schritt „Hochsprache → Assembler" auftrat
- Bei Laufzeitabstürzen wissen Sie, dass das Problem in der Befehlsausführung durch den CPU liegt
- Bei Performance-Optimierung verstehen Sie, welche Optimierungen der Compiler bei der „Übersetzung" vornimmt
- Bei der Wahl der CPU-Architektur (x86 vs. ARM) wissen Sie, dass der Unterschied im „Befehlssatz-API" liegt
:::

### 2.2 Überblick über Befehlsformate
Nun wissen wir, dass Code in Befehle übersetzt wird. Die nächste Frage: **Wie ist ein Befehl intern strukturiert?**

Jeder Maschinenbefehl ist im Kern eine Binärzahl, hat aber ein strenges internes Format. Die zwei wichtigsten Teile:

- **Operationscode (Opcode)**: Teilt dem CPU mit, „was zu tun ist" — Addieren? Springen? Speicher lesen?
- **Operanden**: Teilen dem CPU mit, „mit wem" — welches Register? Welche Speicheradresse? Welche Konstante?

Wie ein Satz eine „Verb + Objekt"-Struktur hat, hat ein Befehl eine „Operation + Ziel"-Struktur:

```
Befehl:  ADD  R3, R1, R2
         ───  ──────────
         Opcode  Operanden
         (Addition) (R3 = R1 + R2)
```

Je nach Anzahl der Operanden werden Befehlsformate in vier Arten unterteilt:

<InstructionFormatDemo />

| Format | Struktur | Beispiel | Verwendung |
|------|------|------|---------|
| Null-Adresse | Nur Opcode | `RET` (Rücksprung) | Stapelrechner, Operanden implizit auf dem Stack |
| Ein-Adresse | Opcode + 1 Adresse | `INC R1` (R1 um 1 erhöhen) | Ein-Operanden-Operationen |
| Zwei-Adressen | Opcode + 2 Adressen | `MOV R1, R2` | Am häufigsten, Datentransfer und Operationen |
| Drei-Adressen | Opcode + 3 Adressen | `ADD R3, R1, R2` | Quelloperanden bleiben erhalten |

::: tip Warum gibt es so viele Formate?
Es handelt sich um einen **Kompromiss zwischen Platz und Flexibilität**. Null-Adressen-Befehle sind am kürzesten (Speicherersparnis), erfordern aber zusätzliche Stack-Operationen; Drei-Adressen-Befehle sind am flexibelsten (Quelldaten bleiben erhalten), belegen aber mehr Bits. Verschiedene CPU-Architekturen wählen unterschiedliche Kombinationen von Befehlsformaten.
:::

### 2.3 Überblick über Adressierungsarten
Der Befehl teilt dem CPU mit, „addiere", aber wo sind die beiden Summanden? Sie können direkt im Befehl stehen, in einem Register oder an einer Speicheradresse. **Adressierungsarten** sind die Regeln, die dem CPU sagen, „wo die Operanden zu finden sind".

Alltagsanalogie „Jemanden finden":

| Adressierungsart | Analogie | Befehlsbeispiel | Erklärung |
|---------|------|---------|------|
| **Sofortige Adressierung** | Die Person steht direkt vor Ihnen | `MOV R1, #100` | Daten stehen direkt im Befehl, am schnellsten |
| **Register-Adressierung** | Kollegen über interne Durchwahl anrufen | `MOV R1, R2` | Daten im CPU-internen Register, sehr schnell |
| **Direkte Adressierung** | Hausnummer kennen und direkt hingehen | `MOV R1, [0x1000]` | Speicheradresse im Befehl angegeben |
| **Indirekte Adressierung** | An der Rezeption fragen „In welchem Zimmer ist Max?" | `MOV R1, [R2]` | Register enthält Adresse, zusätzliche Abfrage nötig |
| **Indizierte Adressierung** | „Gebäude 3 + 5. Stock" ergibt das Zimmer | `MOV R1, [R2+10]` | Basisadresse + Offset, für Array-Zugriff |

<AddressingModeDemo />

::: tip Warum so viele Adressierungsarten?
Verschiedene Szenarien erfordern verschiedene „Daten-Finden"-Strategien:
- **Konstantenzuweisung** (`x = 100`) → sofortige Adressierung, Daten sind im Befehl
- **Variablenoperation** (`a + b`) → Register-Adressierung, Daten bereits ins Register geladen
- **Array-Zugriff** (`arr[i]`) → indizierte Adressierung, Basisadresse + Index-Offset
- **Zeigeroperation** (`*ptr`) → indirekte Adressierung, Register enthält Adresse

Wenn Sie `arr[i]` schreiben, denken Sie nicht an Adressierungsarten, aber der Compiler wählt automatisch die passendste Methode.
:::

### 2.4 Überblick über Befehlsklassifikation
Nachdem wir Befehlsformate und Adressierungsarten kennen, die letzte Frage: **Was genau kann der CPU tun?**

Alle Befehle lassen sich in sechs Hauptkategorien einteilen, die alles abdecken, was ein Computer tun kann:

| Typ | Was er tut | Repräsentative Befehle | Entspricht Ihrem Code |
|------|-------|---------|-------------|
| **Datentransfer** | Daten bewegen | MOV, LOAD, STORE | `let x = y`, Funktionsparameter |
| **Arithmetische Operationen** | Grundrechenarten | ADD, SUB, MUL, DIV | `a + b`, `count++` |
| **Logische Operationen** | Bit-Manipulation | AND, OR, NOT, XOR | `flags & 0xFF`, Berechtigungsprüfung |
| **Schiebeoperationen** | Links/rechts schieben | SHL, SHR | `x << 2` (entspricht Multiplikation mit 4) |
| **Steuerungsübertragung** | Sprung und Aufruf | JMP, CALL, RET | `if`, `for`, Funktionsaufruf |
| **Ein-/Ausgabe** | Kommunikation mit Peripherie | IN, OUT | Tastatur lesen, Bildschirm schreiben |

::: tip Eine wesentliche Erkenntnis
Jeglicher Code, den Sie schreiben — egal wie komplexe Geschäftslogik, wie spektakuläre UI-Animationen — wird letztlich in Kombinationen dieser sechs Grundoperationen zerlegt. Die „Intelligenz" des CPU liegt nicht darin, Komplexes zu tun, sondern diese einfachen Operationen mit Milliarden von Ausführungen pro Sekunde zu wiederholen.
:::

### 2.5 Zwei Designphilosophien: CISC vs. RISC
Beim Entwurf von Befehlssystemen gibt es eine grundlegende Richtungsentscheidung: **Jeden Befehl so mächtig wie möglich machen oder so einfach wie möglich?**

Diese Entscheidung hat zwei Lager hervorgebracht, die jedes Gerät beeinflussen, das Sie heute verwenden:

<CISCvsRISCDemo />

Eine Analogie zum Verständnis:
- **CISC wie ein Schweizer Taschenmesser**: Ein Messer mit Schere, Flaschenöffner, Schraubenzieher... viele Funktionen, aber nicht jede ist optimal
- **RISC wie ein professionelles Werkzeugset**: Jedes Werkzeug macht nur eine Sache, aber dafür schnell und gut

::: tip Warum verwendet Ihr Smartphone ARM und Ihr PC x86?
- **x86 (CISC)** dominiert den PC- und Servermarkt seit 40 Jahren mit einem riesigen Software-Ökosystem. Architekturwechsel bedeutet Neukompilierung aller Software
- **ARM (RISC)** dominiert mit seinem niedrigen Stromverbrauch die Mobilgeräte. Handy-Akkus sind klein, jedes Milliwatt zählt
- **Apple Silicon** hat bewiesen, dass RISC auch Höchstleistung kann — die M-Serie übertrifft x86-Konkurrenten gleichzeitig bei Leistung und Stromverbrauch
- **RISC-V** ist eine Open-Source-RISC-Architektur, die in IoT, Bildung und AI-Chips rasant wächst
:::

---

> **Zusammenfassung**: Das Befehlssystem ist die Brücke zwischen Software und Hardware. Ihr Code wird vom Compiler in Befehle übersetzt, Befehle teilen dem CPU über Opcode und Operanden mit, was zu tun ist und mit wem, und die Adressierungsart bestimmt, woher die Daten kommen. Unterschiedliche Befehlssatz-Designs (CISC/RISC) bestimmen die Leistungsmerkmale und Anwendungsszenarien des CPU.
>
> Nun kennen wir die „statische Struktur" der Befehle — wie sie aussehen und welche Typen es gibt. Die nächste Frage: **Wie führt der CPU diese Befehle Schritt für Schritt intern aus?** Das ist die Aufgabe der Steuereinheit.

---

## 3. Steuereinheit: Befehlszyklus und Mikrooperationen

### 3.1 Aufbau der Steuereinheit

Die Steuereinheit ist das „Gehirn" des CPU und koordiniert alle Komponenten gemäß den Befehlsanforderungen:

<ControllerDemo />

| Komponente | Funktion |
|------|------|
| **Programmzähler (PC)** | Speichert die Adresse des nächsten Befehls |
| **Befehlsregister (IR)** | Speichert den aktuell ausgeführten Befehl |
| **Befehlsdecoder** | Analysiert Opcode und Operanden des Befehls |
| **Taktgenerator** | Erzeugt Taktsignale zur Steuerung des Timings aller Komponenten |
| **Mikrooperations-Sequenzgenerator** | Erzeugt die zur Befehlsausführung erforderliche Reihe von Steuersignalen |

<PSWFlagDemo />

### 3.2 Befehlszyklus

Der CPU durchläuft zur Ausführung eines Befehls einen vollständigen **Befehlszyklus**, der in der Regel umfasst:

1. **Holzyklus (Fetch)**: Befehl aus dem Speicher in das IR laden
2. **Dekodierzyklus (Decode)**: Bedeutung des Befehls analysieren
3. **Ausführungszyklus (Execute)**: Operation durchführen
4. **Speicherzugriffszyklus (Memory Access)**: Bei Speicherbedarf auf Speicher zugreifen
5. **Rückschreibzyklus (Write Back)**: Ergebnis in Register oder Speicher zurückschreiben

### 3.3 Mikrooperationen

**Mikrooperationen** sind die grundlegendsten, durch Steuersignale angetriebenen Operationen. Beispielsweise kann die „Hol"-Phase in folgende Mikrooperationen zerlegt werden:

| Takt | Mikrooperation | Steuersignale |
|------|--------|---------|
| T1 | PC → MAR | PCout, MARin |
| T2 | MEM → MDR | MEMout, MDRin |
| T3 | MDR → IR | MDRout, IRin |
| T4 | PC + 1 → PC | PC+1, PCin |

### 3.4 Hardwired vs. Mikroprogrammierte Steuereinheit

| Eigenschaft | Hardwired-Steuerung | Mikroprogrammierte Steuerung |
|------|------------|-------------|
| **Implementierung** | Kombinatorische Logikschaltung | Mikrobefehlssequenz (Firmware) |
| **Geschwindigkeit** | Schnell | Etwas langsamer |
| **Entwurfsaufwand** | Komplex | Einfacher |
| **Flexibilität** | Gering (Änderung erfordert Neuentwurf) | Hoch (nur Mikroprogramm ändern) |
| **Typische Anwendung** | RISC-Prozessoren | Frühe CISC-Prozessoren |

---

## 4. Speicherhierarchie: Cache und virtueller Speicher

### 4.1 Speicherhierarchie-Struktur

Die Speichergeräte des Computers bilden eine Pyramidenstruktur:

<StorageHierarchyDemo />

| Schicht | Speichertyp | Zugriffszeit | Typische Kapazität | Position |
|------|---------|---------|---------|------|
| **Register** | SRAM | <1 ns | Wenige KB | CPU-intern |
| **L1-Cache** | SRAM | ~1 ns | 32-64 KB | Nahe dem CPU-Kern |
| **L2-Cache** | SRAM | ~3-10 ns | 256 KB-1 MB | Im CPU-Chip |
| **L3-Cache** | SRAM | ~10-20 ns | 2-16 MB | Im CPU-Chip / geteilt |
| **Hauptspeicher (RAM)** | DRAM | ~50-100 ns | 8-64 GB | Auf dem Mainboard |
| **SSD** | Flash | ~10-100 μs | 256 GB-2 TB | Auf dem Mainboard |
| **HDD** | Magnetplatte | ~5-10 ms | 1-10 TB | Im Gehäuse |

::: tip Analogie der Geschwindigkeitsunterschiede
Wenn der Zugriff des CPU auf den L1-Cache **ein Papier vom Schreibtisch nehmen** entspricht:
- Hauptspeicher-Zugriff → mit dem Aufzug in den Keller fahren und im Laden Papier kaufen
- SSD-Zugriff → mit dem Auto in eine andere Stadt fahren und Papier kaufen
- HDD-Zugriff → mit dem Flugzeug in ein anderes Land fliegen und Papier kaufen

Die Geschwindigkeitsunterschiede können ** Millionenfach** sein!
:::

### 4.2 Cache-Prinzip

Der **Cache** ist ein schneller Zwischenspeicher zwischen CPU und Hauptspeicher. Sein Kernprinzip beruht auf zwei Lokalitätsprinzipien:

::: tip Lokalitätsprinzipien
- **Zeitliche Lokalität**: Wenn auf ein Datenwort gerade zugegriffen wurde, wird es wahrscheinlich bald wieder benötigt
- **Räumliche Lokalität**: Wenn auf ein Datenwort zugegriffen wurde, werden wahrscheinlich auch benachbarte Daten bald benötigt
:::

#### Funktionsweise des Cache

1. **Treffer (Hit)**: Die vom CPU angeforderten Daten sind im Cache — direkt lesen
2. **Fehlzugriff (Miss)**: Daten nicht im Cache — aus dem Hauptspeicher laden

```
Trefferquote = Trefferanzahl / Gesamtzugriffe
Durchschnittliche Zugriffszeit = Trefferquote × Cache-Zeit + (1-Trefferquote) × Speicher-Zeit
```

<CacheDemo />

### 4.3 Cache-Abbildungsverfahren

| Verfahren | Prinzip | Vorteil | Nachteil |
|------|------|------|------|
| **Direkte Abbildung** | Jeder Speicherblock kann nur an eine feste Position | Einfach und schnell | Hohe Konfliktquote |
| **Mengenassoziativ** | Jeder Speicherblock kann an N Positionen (N-way) | Balance zwischen Geschwindigkeit und Trefferquote | Komplexere Implementierung |
| **Vollassoziativ** | Beliebige Position | Niedrigste Konfliktquote | Schwer zu implementieren (alle Tags vergleichen) |

### 4.4 Virtueller Speicher

**Virtueller Speicher** ist eine wichtige Abstraktion des Betriebssystems:

- Jeder Prozess glaubt, über einen vollständigen virtuellen Adressraum zu verfügen
- Das Betriebssystem übersetzt virtuelle in physische Adressen
- Selten genutzte Seiten können auf die Festplatte ausgelagert werden (Auslagerungsspace)

::: tip Analogie für virtuellen Speicher
Stellen Sie sich den virtuellen Speicher als **Hotel-Zimmerverwaltung** vor:
- Sie (der Prozess) glauben, das ganze Gebäude gehört Ihnen
- In Wirklichkeit weist das Hotel (das OS) Ihnen nur die aktuell benötigten Zimmer zu
- Unbewohnte Zimmer werden ins Lager (Festplatte) „ausgelagert"
- Benötigte Zimmer können jederzeit „eingelagert" werden
:::

---

## 5. Bus und I/O: Systembus, DMA und Interrupts

### 5.1 Systembus

Der **Bus** ist der Datenkanal, der die Computerkomponenten verbindet:

<BusSystemDemo />

| Bus-Typ | Funktion | Richtung | Typische Breite |
|---------|------|------|---------|
| **Adressbus** | Speicheradresse übertragen | Unidirektional (CPU→Speicher) | 32 Bit / 64 Bit |
| **Datenbus** | Daten übertragen | Bidirektional | 32 Bit / 64 Bit |
| **Steuerbus** | Steuersignale übertragen | Bidirektional | Mehrere Signalleitungen |

### 5.2 Bus-Arbitrierung

Wenn mehrere Geräte gleichzeitig den Bus anfordern, entscheidet ein **Arbitrierungsmechanismus**, wer zuerst drankommt:

| Arbitrierungsverfahren | Beschreibung |
|---------|------|
| **Zentrale Arbitrierung** | Ein zentraler Arbiter entscheidet einheitlich |
| **Dezentrale Arbitrierung** | Die Geräte einigen sich selbst |

### 5.3 I/O-Geräte-Zugriffsmethoden

| Methode | Prinzip | Vorteil | Nachteil |
|------|------|------|------|
| **Programmgesteuertes Polling** | CPU fragt I/O-Status zyklisch ab | Einfach | Geringe CPU-Auslastung |
| **Interrupt-Verfahren** | I/O benachrichtigt CPU nach Abschluss | CPU kann parallel arbeiten | Interrupt-Behandlung kostet Overhead |
| **DMA** | I/O-Gerät greift direkt auf Speicher zu | CPU völlig unbeteiligt | DMA-Controller erforderlich |

<IOMethodDemo />

### 5.4 DMA-Prinzip

**DMA (Direct Memory Access)** ermöglicht I/O-Geräten den direkten Datenaustausch mit dem Speicher:

<NetworkOverviewDemo />

- **Ohne DMA**: CPU ist am gesamten Datentransfer beteiligt und kann nichts anderes tun
- **Mit DMA**: CPU teilt dem DMA-Controller mit „von wo nach wo, wie viel übertragen", führt dann andere Aufgaben aus; der DMA benachrichtigt den CPU nach Abschluss

::: tip DMA-Analogie
Das ist wie **Essen bestellen**:
- **Ohne DMA**: Sie gehen selbst zum Supermarkt, kaufen ein, bringen alles nach Hause, waschen und kochen (voller Einsatz)
- **Mit DMA**: Sie bestellen per Telefon und der Lieferant bringt alles direkt in die Küche (jemand anderes erledigt es, Sie müssen nur „empfangen")
:::

### 5.5 Interrupt-Mechanismus

**Interrupts** sind ein sehr wichtiger Mechanismus im Computersystem:

1. Das I/O-Gerät sendet nach Abschluss eine **Interrupt-Anfrage** an den CPU
2. Der CPU beendet den aktuellen Befehl und antwortet dann auf den Interrupt
3. Der CPU sichert seinen Zustand und springt zur Interrupt-Behandlungsroutine
4. Nach Abschluss wird der Zustand wiederhergestellt und die Ausführung fortgesetzt

---

## 6. CPU-Leistungsoptimierung: Pipeline-Technik

### 6.1 Befehls-Pipeline

Die **Befehls-Pipeline** ist eine Paralleltechnik zur Maximierung der CPU-Effizienz:

<PipelineDemo />

#### Funktionsweise der Pipeline

```
Sequentielle Ausführung (5 Befehle, 15 Zyklen):
Befehl1: IF→ID→EX→MEM→WB
Befehl2:            IF→ID→EX→MEM→WB
Befehl3:                         IF→ID→EX→MEM→WB
...

Pipeline-Ausführung (5 Befehle, 9 Zyklen):
Befehl1: IF→ID→EX→MEM→WB
Befehl2:    IF→ID→EX→MEM→WB
Befehl3:       IF→ID→EX→MEM→WB
...
```

Im Idealfall gilt für N Befehle: CPI (Zyklen pro Befehl) ≈ 1

### 6.2 Pipeline-Gefahren

Pipelines können die Leistung steigern, bringen aber auch **Gefahren (Hazards)** mit sich:

| Typ | Ursache | Lösung |
|------|------|---------|
| **Struktur-Gefahr** | Hardware-Ressourcenkonflikt | Zusätzliche Hardware / zeitversetzte Ausführung |
| **Daten-Gefahr** | Späterer Befehl braucht Ergebnis eines früheren | Daten-Forwarding / Bubbles / Scheduling |
| **Kontroll-Gefahr** | Sprungbefehl ändert den Ausführungsfluss | Verzögerungsslots / Sprungvorhersage |

---

## 7. Zusammenfassung: Wie läuft ein Computer

Lassen Sie uns den gesamten Ablauf mit Fachbegriffen verknüpfen:

> **Nach Programmstart lädt das Betriebssystem die ausführbare Datei vom Datenträger in den Hauptspeicher. Die Hol-Einheit des CPU (IF) liest über den Adressbus den Befehl aus dem Speicher in das Befehlsregister (IR). Die Steuereinheit dekodiert den Befehl (ID), identifiziert die Operationsart und erzeugt entsprechende Steuersignale. Das Rechenwerk (EX) führt die arithmetisch-logische Operation aus; bei Speicherbedarf wird über den Datenbus auf den Speicher zugegriffen (MEM); das Ergebnis wird schließlich in ein Register oder den Speicher zurückgeschrieben (WB). Der gesamte Prozess wird vom Takt gesteuert, und die von der Steuereinheit erzeugte Mikrooperations-Sequenz koordiniert alle Komponenten in geordneter Zusammenarbeit.**

---

## Weiterführende Literatur

| Thema | Empfohlene weiterführende Inhalte |
|------|-----------------|
| Rechnerarchitektur | „Computer Organization and Design: The Hardware/Software Interface" - Patterson & Hennessy |
| CPU-Mikroarchitektur | „Computer Systems: A Programmer's Perspective" - Bryant & O'Hallaron |
| Befehlssatz-Architektur | ARMv8 Architecture Reference Manual, Intel x64 Manual |
| Cache-Prinzipien | Cache-Kohärenzprotokoll (MESI), Cache-Schreibstrategien |
| Betriebssysteme | Nachfolgendes Kapitel „Betriebssysteme" |

---

## Nächste Schritte

Nun haben Sie die professionellen Grundlagen der Computerarchitektur gemeistert. Als Nächstes können Sie lernen:

- **[Betriebssysteme](./operating-systems.md)**: Verstehen, wie Programme auf dem Betriebssystem laufen, wie Prozesse, Threads und Speicherverwaltung implementiert werden
- **[Datencodierung, Speicherung und Übertragung](./data-encoding-storage.md)**: Tiefes Verständnis der Datenrepräsentation im Computer
