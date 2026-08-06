# Frontend-Framework: Kernprinzipien

> 💡 **Lernleitfaden**: Dieser Artikel beantwortet eine grundlegende Frage — **Was machen Frontend-Frameworks (Vue, React, Svelte etc.) eigentlich?** Wenn du nur HTML, CSS und ein wenig JavaScript gelernt hast, ist das völlig in Ordnung — wir fangen ganz von vorne an.

Bevor wir beginnen, stelle sicher, dass du diese beiden Grundkonzepte kennst. Wenn du dir unsicher bist, lies zuerst die entsprechenden Kapitel:

- **HTML**: Das Skelett einer Webseite, das definiert, welche Elemente auf der Seite vorhanden sind (Überschriften, Absätze, Buttons, Bilder …). Siehe [HTML- und CSS-Layout](./html-css-layout.md).
- **JavaScript**: Die Programmiersprache, die Webseiten „lebendig" macht — sie kann Seiteninhalte ändern und auf Benutzeraktionen reagieren. Siehe [JavaScript Deep Dive](./javascript-deep-dive.md).

Ein weiteres Konzept wird später häufig auftauchen, daher hier zunächst eine vollständige Erklärung.

### Überblick über das DOM

DOM steht für Document Object Model, auf Deutsch „Dokumentobjektmodell".

Wenn du eine Webseite im Browser öffnest, liest der Browser als Erstes den HTML-Code. Danach zeigt der Browser die Seite nicht direkt mit dem HTML-Text an, sondern wandelt den HTML-Code zunächst **in eine baumartige Struktur um** und speichert sie im Arbeitsspeicher. Dieser Baum wird DOM-Baum genannt.

Jeder Knoten (Node) im Baum entspricht einem Tag im HTML. Die Verschachtelungsbeziehungen zwischen den Tags werden im DOM-Baum zu Eltern-Kind-Beziehungen.

👇 **Probier es selbst aus**:
Bewege die Maus über den HTML-Code auf der linken Seite — der entsprechende Knoten im DOM-Baum rechts wird hervorgehoben. Umgekehrt funktioniert es genauso. Jede HTML-Tag-Zeile entspricht einem Knoten im DOM-Baum.

<WhatIsDomDemo />

**Warum sollte man das DOM verstehen?** Weil JavaScript Seiten verändert, indem es diesen DOM-Baum manipuliert — Knoten hinzufügen, Knoten löschen, Knoteninhalte ändern. Und die Kernaufgabe von Frontend-Frameworks besteht darin, diese DOM-Operationen für dich zu automatisieren. Wir werden später immer wieder auf das DOM zurückkommen — es zu verstehen ist die Grundlage, um die Prinzipien von Frameworks zu begreifen.

---

## 0. Einleitung: Überblick über Frontend-Frameworks

Erklären wir zunächst das Wort „Framework". In der Programmierung ist ein **Framework** ein Satz bereits geschriebener Code und Regeln, der vorgibt, wie dein Code organisiert und ausgeführt werden soll. Du schreibst Code nach seinen Vorgaben, und es übernimmt eine Menge sich wiederholender, mühsamer Low-Level-Arbeit für dich.

Ein **Frontend-Framework** ist ein Framework, das speziell darauf ausgerichtet ist, **Web-Benutzeroberflächen zu erstellen**. Die derzeit gängigsten sind Vue, React, Svelte und Angular.

Welches Problem lösen sie also für dich? Die folgenden drei Karten fassen die Kernlogik zusammen:

<FrameworkMotivationDemo />

Im Folgenden gehen wir Schritt für Schritt ins Detail, beginnend mit den grundlegendsten Fragen.

---

## 1. Das Kernproblem: Die Daten haben sich geändert — was passiert mit der Oberfläche

### 1.1 Zuerst klären, was „Daten" und „Oberfläche" sind

In jeder Webanwendung existieren zwei Dinge gleichzeitig:

- **Daten (Data / State)**: Die intern im Programm gespeicherten Informationen. Zum Beispiel „im Warenkorb sind 3 Artikel", „der Benutzername ist Max Mustermann", „der zweite Tab ist gerade ausgewählt". Diese Daten befinden sich in JavaScript-Variablen und sind für den Benutzer unsichtbar.
- **Oberfläche (UI)**: Das, was der Benutzer auf dem Bildschirm sieht. Zum Beispiel zeigt die Seite „Warenkorb (3)" an, „Willkommen, Max Mustermann", der zweite Tab ist hervorgehoben. Das sind die visuellen Effekte, die durch HTML-Elemente dargestellt werden.

**Es gibt eine Entsprechung zwischen Daten und Oberfläche**: Wenn die Daten „3 Artikel" lauten, sollte die Oberfläche „3" anzeigen. Wenn sich die Daten auf „4 Artikel" ändern, sollte die Oberfläche ebenfalls auf „4" wechseln.

Die Frage ist: **Wer ist dafür verantwortlich, dass dieses „Mit-Ändern" passiert?**

👇 **Probier es per Klick aus**:
Klicke auf den Button „Artikel hinzufügen" und achte darauf: Die Daten (links) haben sich bereits geändert, aber die Oberfläche (rechts) wurde nicht aktualisiert — sie sind „entkoppelt". Klicke dann auf „Oberfläche synchronisieren", um manuell zu korrigieren.

<DataUIGapDemo />

### 1.2 Warum ändert sich die Oberfläche nicht automatisch, wenn sich eine JavaScript-Variable ändert

Das ist der Punkt, der für absolute Anfänger am verwirrendsten ist. Wir erklären das zugrunde liegende Prinzip Schritt für Schritt.

In JavaScript ist eine Variable ein Speicherplatz, der Daten aufnimmt. Wenn du `count = count + 1` ausführst, macht die JavaScript-Engine etwas sehr Einfaches: Sie ändert den Wert an der Speicherstelle `count` von 3 auf 4. **Danach ist der Vorgang abgeschlossen — es passiert nichts weiter.**

Der auf der Seite angezeigte Inhalt (z. B. der DOM-Knoten `<span>3</span>`) befindet sich in einem völlig anderen Speicherbereich. Wenn die JavaScript-Engine die Variable ändert, weiß sie überhaupt nicht, dass es auf der Seite einen DOM-Knoten gibt, der den Wert dieser Variable anzeigt — und es gibt auch keinen Mechanismus, der das überprüft.

Der eigentliche Grund ist also: **JavaScript-Variablen und DOM-Knoten sind zwei unabhängige Speicherbereiche, zwischen denen es keinerlei automatische Verknüpfung gibt.** Das Ändern einer Variable verändert nur den Speicher der Variable — der Speicher des DOM-Knotens wird in keiner Weise beeinflusst.

```javascript
let count = 3

// Auf der Seite gibt es einen DOM-Knoten, der den Wert von count anzeigt:
// <span id="counter">3</span>

count = 4
// Was hat die JavaScript-Engine getan?
//   → Den Wert der Variable count im Speicher von 3 auf 4 geändert
//   → Fertig. Das war's.
// Im <span> auf der Seite steht immer noch "3"
```

Wenn du möchtest, dass die Anzeige auf der Seite ebenfalls zu „4" wird, musst du **zusätzlichen Code schreiben**, der manuell den entsprechenden DOM-Knoten findet und seinen Inhalt ändert:

```javascript
count = 4  // Schritt 1: Variable ändern

// Schritt 2: Das musst du selbst schreiben — DOM-Knoten finden und seinen Text auf den neuen Wert setzen
document.getElementById('counter').textContent = count
```

Wenn der Wert von `count` an 5 verschiedenen Stellen auf der Seite angezeigt wird (Warenkorb-Anzahl, Artikelliste, Gesamtpreis, Zwischensumme, Statusmeldung), musst du 5 solcher Code-Blöcke schreiben. **Wenn du auch nur einen einzigen vergisst, zeigt diese Stelle weiterhin den alten Wert an — und der Benutzer sieht falsche Informationen.**

### 1.3 Was das Framework macht Eine automatische Verbindung in zwei Schritten


Dass ein Framework automatisch synchronisieren kann, beruht auf **zwei zusammenwirkenden Schritten** — beide sind unverzichtbar.

**Schritt 1: Du registrierst im Template, welche Stellen diese Variable anzeigen sollen**

Im HTML-Template des Frameworks verwendest du die Syntax `{{ count }}`, um zu markieren: „Hier soll der Wert von count angezeigt werden":

```html
<!-- Vue-Template -->
<span>Warenkorb: {{ count }} Artikel</span>    <!-- Stelle A: Ich möchte count anzeigen -->
<span>Gesamtpreis: {{ count * 99 }} €</span>   <!-- Stelle B: Ich verwende count ebenfalls -->
<span>{{ count > 5 ? 'Zu viele' : 'Normal' }}</span>  <!-- Stelle C: Ich verwende count auch -->
```

Wenn das Framework die Seite zum ersten Mal rendert, zeichnet es diese „Registrierungsbeziehung" auf: **Die Stellen A, B und C hängen alle von count ab**.

**Schritt 2: Das Framework überwacht die Variable — ändert sie sich, wird die Registrierungstabelle geprüft und automatisch aktualisiert**

Das Framework verwendet den in JavaScript eingebauten `Proxy`-Mechanismus, um deine Variable zu „umhüllen" und sie zu einer „überwachten Variable" zu machen. Wenn du diese Variable änderst, macht der Proxy beim Zuweisen heimlich etwas zusätzlich: Er benachrichtigt das Framework, dass „count sich geändert hat". Das Framework prüft daraufhin die Registrierungstabelle aus Schritt 1 und aktualisiert alle drei Stellen A, B und C.

```
Natives JS:
  Du schreibst HTML → <span id="counter">3</span> (keine Verbindung zur Variable)
  Du änderst die Variable → count = 4 → Fertig, die Oberfläche reagiert nicht
  Du korrigierst manuell → document.getElementById('counter').textContent = 4 → Oberfläche wird erst jetzt aktualisiert

Vue-Framework:
  Du schreibst Template → <span>{{ count }}</span> (Framework merkt sich: diese Stelle hängt von count ab)
  Du änderst die Variable → count = 4 → Proxy fängt ab → benachrichtigt Framework → Framework prüft Registrierungstabelle → aktualisiert A/B/C automatisch
```

Deshalb können „nur Frameworks automatisch synchronisieren" — zwischen nativem HTML-`<span>` und JS-Variablen gibt es keinerlei Verbindung. Erst die Template-Syntax des Frameworks (`{{ }}`) stellt diese Verbindung her. Du schreibst `{{ count }}`, damit das Framework weiß, dass hier count angezeigt werden soll; nur dann kann das Framework diese Stelle präzise finden und aktualisieren, wenn count sich ändert.

👇 **Probier es per Klick aus**:
Wähle zuerst „Natives JavaScript", klicke auf „Ausführen" und beobachte — die Variable ändert sich, aber die Oberfläche bleibt unverändert. Du musst jede Stelle einzeln manuell synchronisieren. Wechsle dann zu „Mit Framework", klicke erneut auf „Ausführen" — die Variable ändert sich, das Framework führt alle Schritte automatisch aus, und die Oberfläche reagiert sofort.

<WhyNoAutoSyncDemo />

### 1.4 Vergleich: Manuelle Synchronisation vs. automatische Synchronisation in der Praxis

Nachdem wir das Prinzip verstanden haben, schauen wir uns an, wie groß der Unterschied zwischen manueller und automatischer Synchronisation in einem etwas komplexeren Szenario ist.

👇 **Probier es per Klick aus**:
Links siehst du die „manuelle Synchronisation" ohne Framework — jeder Anzeigebereich muss einzeln über den „Synchronisieren"-Button aktualisiert werden. Rechts siehst du die „automatische Synchronisation" mit Framework — du klickst nur auf „Artikel hinzufügen", und alle Anzeigebereiche werden automatisch aktualisiert. Versuche links, einen Bereich bewusst nicht zu synchronisieren, und schau, was passiert.

<ManualVsAutoSyncDemo />

**Das ist der grundlegende Existenzgrund von Frontend-Frameworks: JavaScript-Variablen die Fähigkeit zu geben, „bei Änderung automatisch die Oberfläche zu aktualisieren", und damit die Fehler durch manuelle Synchronisation zu beseitigen.**

---

## 2. Der Kerngedanke von Frameworks: Die Oberfläche mit Daten beschreiben

### 2.1 Der Unterschied zwischen beiden Schreibweisen

Nachdem wir den Wert der „automatischen Synchronisation" verstanden haben, schauen wir uns an, wie Frameworks das konkret umsetzen.

In der Zeit vor Frameworks (z. B. mit jQuery) sah der Code so aus — du sagst dem Browser Schritt für Schritt, was er tun soll:

```javascript
// Schritt 1: Finde das Element mit der id 'counter' auf der Seite
var element = document.getElementById('counter')
// Schritt 2: Ändere den Textinhalt dieses Elements auf den neuen Wert
element.textContent = '4'
// Schritt 3: Finde ein anderes Element und ändere es ebenfalls
document.getElementById('total').textContent = '396 €'
// Schritt 4: Wenn die Anzahl größer als 5 ist, muss auch die Statusmeldung geändert werden …
```

Diese Schreibweise nennt man **imperativ** — du „befiehlst" dem Browser, Operationen Schritt für Schritt auszuführen.

Mit einem Framework sieht der Code so aus — du beschreibst nur, „wie die Oberfläche aussehen soll":

```html
<!-- Es ist mir egal, wie dieser Wert auf der Seite aktualisiert wird -->
<!-- Ich sage nur: Hier soll der Wert von count angezeigt werden -->
<span>{{ count }}</span>
<span>Gesamtpreis: {{ count * 99 }} €</span>
<span v-if="count > 5">Zu viele Artikel!</span>
```

Diese Schreibweise nennt man **deklarativ** — du „deklarierst" den endgültigen Zustand der Oberfläche. Wie dieser Zustand erreicht wird, übernimmt das Framework selbst.

### 2.2 Die Kernformel: UI = f(State)

Alle modernen Frontend-Frameworks — ob Vue, React oder Svelte — folgen demselben Kerngedanken, der sich in einer Formel ausdrücken lässt:

> **UI = f(State)**

Diese Formel bedeutet:

- **State (Zustand)**: Die Daten deiner Anwendung. Das sind die Variablen in JavaScript: wie viele Artikel im Warenkorb sind, ob der Benutzer eingeloggt ist, welche Seite gerade aktiv ist …
- **f (Funktion)**: Der Rendering-Mechanismus des Frameworks. Er weiß, wie man Daten in eine Oberfläche umwandelt.
- **UI (Oberfläche)**: Das Endergebnis, das der Benutzer auf dem Bildschirm sieht.

**Bedeutung**: Bei gegebenen Daten (State) ergibt sich durch die Verarbeitung des Frameworks (f) deterministisch die entsprechende Oberfläche (UI). Ändern sich die Daten, ändert sich die Oberfläche mit. Der Entwickler muss sich nur um die Daten kümmern, nicht darum, wie die Oberfläche aktualisiert wird.

👇 **Probier es per Klick aus**:
Ändere die Daten (State) auf der linken Seite und beobachte, wie die Oberfläche (UI) auf der rechten Seite automatisch folgt. Das ist die anschauliche Umsetzung von `UI = f(State)`.

<DeclarativeFormulaDemo />

### 2.3 Warum ist deklarativ besser als imperativ

Die Vorteile der deklarativen Schreibweise:

| Vergleichsdimension | Imperativ (ohne Framework) | Deklarativ (mit Framework) |
| :--- | :--- | :--- |
| **Code-Menge** | Für jedes Update muss konkreter Operationscode geschrieben werden | Template wird nur einmal geschrieben, Framework verarbeitet automatisch |
| **Fehlerwahrscheinlichkeit** | Leicht, eine Aktualisierung an einer Stelle zu übersehen | Framework garantiert, dass alle Stellen aktualisiert werden |
| **Lesbarkeit** | Code ist mit vielen DOM-Operationen durchmischt | Code beschreibt klar die Oberflächenstruktur |
| **Wartungsaufwand** | Eine Funktionsänderung erfordert Änderungen an vielen Stellen | Nur die Datenlogik muss geändert werden, Oberfläche folgt automatisch |

Kurz gesagt: Deklarativ ermöglicht es dir, dich auf die „Geschäftslogik" (wie sich Daten ändern) zu konzentrieren, ohne dich um die sich wiederholende und fehleranfällige Aufgabe „Wie aktualisiere ich die Oberfläche?" kümmern zu müssen.

---

## 3. Reaktive Systeme: Ansatz für weiß das Framework, dass sich Daten geändert haben

### 3.1 Was bedeutet „reaktiv"

Bisher hieß es: „Daten ändern sich, Oberfläche aktualisiert sich automatisch". Aber es gibt ein technisches Problem: **JavaScript selbst hat nicht die Fähigkeit, „andere automatisch zu benachrichtigen, wenn eine Variable geändert wird"**.

Wenn du `count = 4` schreibst, ändert JavaScript lediglich den Wert von `count` von 3 auf 4 — es sagt niemandem automatisch Bescheid. Ein Framework braucht einen Mechanismus, um zu „entdecken", dass du Daten geändert hast.

**Reaktivität (Reactivity)** ist der Oberbegriff für diesen Mechanismus: Wenn sich Daten ändern, kann das System die Änderung automatisch wahrnehmen und die entsprechenden Aktualisierungsoperationen ausführen.

### 3.2 Drei verschiedene Implementierungsansätze

Verschiedene Frameworks verwenden unterschiedliche technische Ansätze, um Reaktivität zu implementieren. Das ist auch der grundlegendste Unterschied zwischen Vue, React und Svelte.

**Ansatz 1: Proxy-Interception (Vues Vorgehen)**

Vue verwendet den in JavaScript eingebauten `Proxy`-Mechanismus. Ein `Proxy` kann automatisch einen von dir festgelegten Code ausführen, wenn eine Eigenschaft eines Objekts gelesen oder geändert wird.

Vue umhüllt dein Datenobjekt mit einem `Proxy`. Wenn du `count = 4` ausführst, fängt der `Proxy` diesen Schreibzugriff ab und benachrichtigt Vue: „Der Wert von count hat sich geändert". Daraufhin aktualisiert Vue alle Teile der Oberfläche, die `count` verwenden.

Als Entwickler musst du nichts Zusätzliches tun — du weist einfach direkt zu, und Vue erkennt es automatisch.

**Ansatz 2: Expliziter Aufruf (Reacts Vorgehen)**

React verwendet keinen `Proxy`. Es verlangt, dass du Daten ausschließlich über eine spezielle Funktion änderst:

```javascript
// Reacts Schreibweise
const [count, setCount] = useState(0)

// Du kannst nicht direkt count = 4 schreiben (React würde es nicht bemerken)
// Du musst setCount aufrufen:
setCount(4)
```

Nur wenn du `setCount()` aufrufst, weiß React, dass sich Daten geändert haben, und aktualisiert die Oberfläche. Wenn du direkt `count = 4` schreibst, bemerkt React überhaupt nichts — die Oberfläche wird nicht aktualisiert.

Dieser Ansatz ist „expliziter" — jede Datenänderung teilst du dem Framework aktiv mit, es gibt keine unbeabsichtigten Aktualisierungen.

**Ansatz 3: Compiler-Analyse (Sveltes Vorgehen)**

Svelte verfolgt einen völlig anderen Weg. Es besitzt einen Compiler, der deinen Quellcode analysiert, bevor er ausgeführt wird.

Wenn der Compiler eine Zuweisung wie `count += 1` in deinem Code sieht, fügt er automatisch hinter dieser Codezeile einen Abschnitt ein, der die Oberfläche über die Änderung benachrichtigt. Das bedeutet, dass die „Benachrichtigung" bereits vom Compiler im Voraus eingeplant wurde, wenn der Code ausgeführt wird.

Dein Code sieht aus wie eine gewöhnliche JavaScript-Zuweisung, aber der kompilierte Code enthält zusätzliche Logik zur Aktualisierung der Oberfläche.

👇 **Probier es per Klick aus**:
Wähle verschiedene Framework-Tabs aus, klicke auf „Daten ändern" und beobachte, welche Schritte jedes Framework „unter der Haube" durchläuft, um Datenänderungen zu erkennen und die Oberfläche zu aktualisieren.

<ReactivityMechanismDemo />

### 3.3 Vergleich der drei Ansätze

| Vergleichsdimension | Vue (Proxy) | React (expliziter Aufruf) | Svelte (Compiler) |
| :--- | :--- | :--- | :--- |
| **Schreibweise für Entwickler** | Direkte Zuweisung `count = 4` | Muss `setCount(4)` verwenden | Direkte Zuweisung `count = 4` |
| **Zeitpunkt der Änderungserkennung** | Automatisch zur Laufzeit abgefangen | Entwickler benachrichtigt aktiv | Benachrichtigungscode wird zur Compile-Zeit eingefügt |
| **Laufzeit-Overhead** | Proxy hat geringen Interception-Overhead | setState-Scheduling hat geringen Overhead | Nahezu kein zusätzlicher Overhead |
| **Debugging-Aufwand** | Mittel | Datenfluss klar, relativ einfach | Erfordert Verständnis des kompilierten Codes |
| **Geeignete Szenarien** | Entwicklereffizienz und natürliche Schreibweise | Vorhersagbarer Datenfluss | Maximale Laufzeitleistung |

Keiner der drei Ansätze ist absolut besser oder schlechter. Vue fühlt sich am natürlichsten an beim Schreiben, React bietet den kontrollierbarsten Datenfluss, und Svelte hat die beste Laufzeitleistung. Welches man wählt, hängt von den konkreten Projektanforderungen ab.

---

## 4. Komponenten: Die Oberfläche in wiederverwendbare Bausteine zerlegen

### 4.1 Warum aufteilen

Eine vollständige Webseite kann eine Navigationsleiste, eine Seitenleiste, einen Inhaltsbereich, ein Suchfeld, Benutzeravatare, verschiedene Buttons … enthalten. Wenn der gesamte Code in einer einzigen Datei stünde, wäre diese Datei extrem lang und sehr schwer zu warten.

**Komponenten (Components)** bedeuten, die Oberfläche in unabhängige kleine Bausteine zu zerlegen, wobei jeder Baustein seine eigenen Daten, seine eigene Oberfläche und seine eigene Logik verwaltet.

Zum Beispiel kann eine E-Commerce-Seite in folgende Komponenten zerlegt werden:

- `NavBar`-Komponente: Zuständig für die obere Navigationsleiste
- `SearchBox`-Komponente: Zuständig für das Suchfeld
- `ProductCard`-Komponente: Zuständig für eine Produktkarte
- `ShoppingCart`-Komponente: Zuständig für den Warenkorb

Jede Komponente ist unabhängig. `ProductCard` muss nicht wissen, welchen Code `NavBar` enthält — sie muss sich nur um sich selbst kümmern.

### 4.2 Drei Vorteile von Komponenten

**Vorteil 1: Wiederverwendung.** Eine einmal geschriebene `ProductCard`-Komponente kann 100-mal auf der Seite verwendet werden — jedes Mal mit anderen Produktdaten, und es werden unterschiedliche Produktkarten gerendert. Man muss keinen HTML-Code 100-mal kopieren und einfügen.

**Vorteil 2: Kapselung.** Die Daten und die Logik innerhalb einer Komponente sind unabhängig. Änderungen am Code der `SearchBox`-Komponente beeinflussen nicht die `ProductCard`-Komponente. Bei Teamarbeit können verschiedene Personen gleichzeitig an verschiedenen Komponenten arbeiten, ohne sich gegenseitig zu behindern.

**Vorteil 3: Wartbarkeit.** Wenn ein Feature ein Problem hat, kannst du direkt die entsprechende Komponente finden und beheben, ohne in einer mehrere tausend Zeilen langen Datei suchen zu müssen.

👇 **Probier es per Klick aus**:
Klicke links auf einen Komponentennamen, um den entsprechenden Bereich auf der Seite anzuzeigen. Beachte: Dieselbe `ProductCard`-Komponente wird mehrfach wiederverwendet und zeigt jedes Mal andere Daten an.

<ComponentTreeDemo />

### 4.3 Wie sieht eine Komponente im Code aus

Am Beispiel von Vue besteht eine Komponente aus einer `.vue`-Datei mit drei Teilen:

```html
<!-- ProductCard.vue -->
<template>
  <!-- Hier steht die HTML-Struktur — das „Aussehen" der Komponente -->
  <div class="card">
    <h3>{{ name }}</h3>
    <p>Preis: {{ price }} €</p>
    <button @click="addToCart">In den Warenkorb</button>
  </div>
</template>

<script setup>
// Hier steht die JavaScript-Logik — das „Verhalten" der Komponente
const props = defineProps(['name', 'price'])

function addToCart() {
  // Logik für „In den Warenkorb"
}
</script>

<style scoped>
/* Hier stehen die CSS-Stile — das „Styling" der Komponente */
.card {
  border: 1px solid #ccc;
  padding: 16px;
}
</style>
```

Die Verwendung dieser Komponente ist wie die Nutzung eines benutzerdefinierten HTML-Tags:

```html
<!-- Die ProductCard-Komponente an anderer Stelle verwenden -->
<ProductCard name="Kabellose Kopfhörer" price="299" />
<ProductCard name="Mechanische Tastatur" price="599" />
<ProductCard name="Monitor" price="1999" />
```

Drei Codezeilen rendern drei verschiedene Produktkarten.

---

## 5. Die Kosten von DOM-Operationen: Motivation von nehmen Frameworks so viel Aufwand auf sich

### 5.1 Was sind DOM-Operationen

Das DOM wurde bereits erwähnt — die baumartige Datenstruktur, die der Browser aus dem HTML generiert. **DOM-Operationen** bedeuten, diesen Knotenbaum mit JavaScript zu verändern: z. B. einen Text ändern, ein Element hinzufügen, ein Element löschen oder einen Stil verändern.

Diese Operationen sind an sich nicht kompliziert, aber der Browser muss nach einer DOM-Operation viel zusätzliche Arbeit leisten, damit die Anzeige auf dem Bildschirm aktualisiert wird:

1. **Stile neu berechnen**: Müssen sich die CSS-Stile dieses Knotens und seiner Kindknoten ändern?
2. **Neu layouten (Layout / Reflow)**: Die Positionen und Größen aller Elemente auf der Seite müssen neu berechnet werden. Denn die Änderung eines Elements kann die Position anderer Elemente beeinflussen.
3. **Neu zeichnen (Paint)**: Die berechneten Inhalte auf den Bildschirm zeichnen.

Jeder dieser drei Schritte verursacht Rechenaufwand. Wenn dein Code häufig DOM-Operationen auslöst, führt der Browser diese Schritte immer wieder aus, und die Seite wird ruckelig.

👇 **Probier es per Klick aus**:
Beobachte den Zeitvergleich zwischen direkten DOM-Operationen und gebündelten DOM-Operationen. Wenn die Anzahl der Änderungen zunimmt, steigt die Dauer bei „Einzeln bearbeiten" drastisch an.

<DomOperationCostDemo />

### 5.2 Wie lösen Frameworks dieses Problem

Da direkte DOM-Manipulation teuer ist, versuchen Frameworks, **die Anzahl der DOM-Operationen zu reduzieren**. Es gibt zwei konkrete Strategien:

**Strategie 1: Virtuelles DOM + Differenzvergleich (Vorgehen von Vue und React)**

Das virtuelle DOM (Virtual DOM) ist ein JavaScript-Objekt, dessen Struktur eins zu eins dem echten DOM-Baum entspricht. Es existiert jedoch nur im Arbeitsspeicher und löst kein Layout und kein Zeichnen im Browser aus.

Wenn sich Daten ändern, läuft der Verarbeitungsprozess des Frameworks wie folgt ab:

1. Ein neuer „virtueller DOM-Baum" wird als JavaScript-Objekt erstellt, der beschreibt, wie die Oberfläche nach der Datenänderung aussehen soll
2. Dieser neue Baum wird mit dem alten Baum verglichen (dieser Vorgang heißt **Diff**, Differenzvergleich), um herauszufinden, welche Knoten sich geändert haben
3. Nur die tatsächlich geänderten Teile werden auf das echte DOM angewendet (dieser Vorgang heißt **Patch**, also Reparatur)

Auf diese Weise ist die Anzahl der endgültigen Operationen am echten DOM immer minimal, egal wie sich die Daten ändern.

👇 **Probier es per Klick aus**:
Klicke auf „Daten ändern" und beobachte, wie das virtuelle DOM den alten und den neuen Baum vergleicht und die geänderten Knoten findet. Achte auf das „echte DOM" ganz rechts — nur die tatsächlich geänderten Teile blinken auf.

<VirtualDomDiffDemo />

**Strategie 2: Präzise Lokalisierung zur Compile-Zeit (Sveltes Vorgehen)**

Svelte verwendet kein virtuelles DOM. Sein Compiler analysiert bereits beim Schreiben des Codes: „Wenn `count` sich ändert, muss das `<span>`-Element in Zeile 3 aktualisiert werden". Zur Laufzeit wird direkt dieses Element angesteuert und aktualisiert, ohne dass alter und neuer Baum verglichen werden müssen.

Dieser Ansatz überspringt den Diff-Schritt und ist theoretisch leistungsfähiger. Er hängt jedoch von der Analysefähigkeit des Compilers ab — der Compiler muss intelligent genug sein, um alle zu aktualisierenden Stellen korrekt zu identifizieren.

---

## 6. Laufzeit vs. Compile-Zeit: Der zentrale Trade-off im Framework-Design

### 6.1 Zwei Phasen

Frontend-Code durchläuft vom Schreiben bis zur endgültigen Ausführung im Browser zwei Phasen:

- **Compile-Zeit (Compile-time / Build-time)**: Dein Quellcode wird von Build-Tools (wie Vite, Webpack) verarbeitet und in Code umgewandelt, den der Browser direkt ausführen kann. Dieser Prozess findet auf deinem Rechner statt, bevor der Benutzer die Webseite öffnet.
- **Laufzeit (Runtime)**: Der umgewandelte Code wird im Browser des Benutzers ausgeführt. Die Kernlogik des Frameworks (wie der Diff des virtuellen DOM, das Tracking der Reaktivität) arbeitet in dieser Phase.

### 6.2 Arbeitsverteilung der Frameworks in diesen beiden Phasen

Verschiedene Frameworks verteilen unterschiedlich viel Arbeit auf diese beiden Phasen, was ihre Leistungsmerkmale und Bundle-Größe bestimmt:

- **React**: Der Großteil der Arbeit findet zur Laufzeit statt. Erstellung des virtuellen DOM, Diff und Patch geschehen alle im Browser. Der Vorteil ist hohe Flexibilität; der Preis ist, dass der gesamte Laufzeitcode des Frameworks (ca. 40 KB) an den Browser gesendet werden muss.
- **Vue**: Hybrider Ansatz. Das Template wird zur Compile-Zeit optimiert (der Compiler markiert, welche Knoten statisch sind und sich nicht ändern), aber die endgültige Aktualisierung der Oberfläche erfolgt weiterhin über das virtuelle DOM zur Laufzeit. Laufzeitcode ca. 30 KB.
- **Svelte**: Der Großteil der Arbeit findet zur Compile-Zeit statt. Der Compiler analysiert deinen Code und generiert direkt präzise DOM-Update-Anweisungen. Zur Laufzeit ist fast kein Framework-Code vorhanden — das endgültige Bundle enthält nur deinen eigenen Geschäftscode. Kleinste Bundle-Größe.

👇 **Probier es per Klick aus**:
Klicke auf verschiedene Framework-Tabs, um ihre Position auf dem Spektrum „Laufzeit ↔ Compile-Zeit" sowie ihre jeweiligen Trade-offs bei Bundle-Größe, Laufzeitleistung und Entwicklungserfahrung zu sehen.

<FrameworkSpectrumDemo />

### 6.3 Branchentrend

Die Entwicklungsrichtung der Frameworks war in den letzten Jahren sehr deutlich: **Immer mehr Arbeit wird von der Laufzeit in die Compile-Zeit verlagert.** Denn Berechnungen zur Compile-Zeit beanspruchen keine Geräteressourcen des Benutzers und beeinträchtigen nicht die Ladegeschwindigkeit der Seite.

- **Vue** entwickelt den Vapor Mode, der das virtuelle DOM überspringen und direkt zur Compile-Zeit DOM-Operationscode generieren kann
- **React** hat den React Compiler vorgestellt, der das Re-Rendering-Verhalten von Komponenten zur Compile-Zeit automatisch optimiert
- **Svelte 5** hat das Runes-System eingeführt, das die Analysefähigkeit zur Compile-Zeit weiter verbessert

---

## 7. Zusammenfassung

Rückblick auf die Kernpunkte dieses Artikels:

**Das grundlegende Problem, das Frontend-Frameworks lösen**: Wenn sich Daten in einer Anwendung ändern, die Oberfläche automatisch, effizient und zuverlässig zu aktualisieren, ohne dass der Entwickler manuell das DOM bedienen muss.

**Der gemeinsame Kerngedanke, dem sie folgen**: UI = f(State) — die Oberfläche ist eine Funktion der Daten. Der Entwickler muss sich nur um Datenänderungen kümmern, das Framework ist dafür verantwortlich, diese Änderungen in der Oberfläche widerzuspiegeln.

**Ihre zentralen technischen Unterschiede**:

| Technischer Aspekt | Bedeutung |
| :--- | :--- |
| **Reaktives System** | Wie das Framework Datenänderungen erkennt. Vue nutzt Proxy-Interception, React verwendet explizite setState-Aufrufe, Svelte setzt auf Compiler-Analyse. |
| **Virtuelles DOM** | Vue und React simulieren den DOM-Baum mit einem JavaScript-Objekt und finden durch Vergleich von altem und neuem Baum (Diff) die minimale Aktualisierungsmenge, um echte DOM-Operationen zu reduzieren. |
| **Komponentisierung** | Die Oberfläche wird in unabhängige, wiederverwendbare Bausteine zerlegt, wobei jede Komponente ihre eigenen Daten und ihre eigene Oberfläche verwaltet. |
| **Compile-Zeit-Optimierung** | Analyse und Optimierung werden bereits in der Build-Phase vorgenommen, um den Rechenaufwand zur Laufzeit zu reduzieren. Svelte geht hier am weitesten. |

**In einem Satz**: Die wesentliche Aufgabe von Frontend-Frameworks ist es, den Synchronisationsprozess „von Daten zur Oberfläche" zu übernehmen, sodass Entwickler nur noch über die Datenlogik nachdenken müssen und die Oberfläche nicht mehr manuell bedienen müssen.

---

## Glossar

| Englischer Begriff | Deutsche Übersetzung | Erklärung |
| :--- | :--- | :--- |
| **Framework** | Framework | Ein Satz vorgefertigter Code und Regeln, der Entwicklern die grundlegende Struktur und häufig verwendete Funktionen für eine Anwendung bereitstellt. |
| **DOM** | Dokumentobjektmodell | Die baumartige Datenstruktur, die der Browser aus dem HTML generiert. JavaScript manipuliert sie, um die Seite zu verändern. |
| **Virtual DOM** | Virtuelles DOM | Simulation des DOM-Baums durch ein JavaScript-Objekt; durch den Diff-Algorithmus wird der minimale Update-Pfad gefunden, um die Anzahl echter DOM-Operationen zu reduzieren. |
| **State** | Zustand | Die Daten in der Anwendung, z. B. Benutzerinformationen, Warenkorbinhalt, aktueller Seitenzustand usw. |
| **Reactivity** | Reaktivität | Wenn sich Daten ändern, kann das System dies automatisch erkennen und die entsprechenden Aktualisierungsoperationen der Oberfläche ausführen. |
| **Proxy** | Proxy | Ein in JavaScript eingebauter Mechanismus, der Lese- und Schreibzugriffe auf ein Objekt abfangen kann. Vue 3 verwendet ihn zur Umsetzung der Reaktivität. |
| **Component** | Komponente | Ein unabhängiger, wiederverwendbarer Oberflächencode-Block, der seine eigene HTML-Struktur, JavaScript-Logik und CSS-Stile enthält. |
| **Declarative** | Deklarativ | Ein Programmierparadigma: Du beschreibst, „welches Endergebnis du haben möchtest", und das Framework entscheidet, wie es umgesetzt wird. |
| **Imperative** | Imperativ | Ein Programmierparadigma: Du sagst dem Programm Schritt für Schritt, „wie es etwas konkret tun soll". |
| **Diff** | Differenzvergleich | Vergleich von altem und neuem virtuellem DOM-Baum, um herauszufinden, welche Knoten sich geändert haben. |
| **Patch** | Patch / Reparatur | Die durch Diff gefundenen Änderungen auf das echte DOM anwenden. |
| **Compile-time** | Compile-Zeit | Der Zeitraum, in dem der Code während der Build-Phase verarbeitet wird, bevor der Benutzer die Webseite öffnet. |
| **Runtime** | Laufzeit | Der Zeitraum, in dem der Code im Browser des Benutzers ausgeführt wird. |
| **Compiler** | Compiler | Ein Programm, das Quellcode in eine andere Form von Code umwandelt. Der Svelte-Compiler wandelt `.svelte`-Dateien in effizientes JavaScript um. |

