# Browser als Betriebssystem: Rendering-Prinzipien
::: tip 🎯 Kernfrage
**Warum sind manche Webseiten flüssig wie Seide, während andere wie eine PowerPoint-Präsentation ruckeln?** Wie verwandelt der Browser einen Haufen HTML-, CSS- und JavaScript-Code in die Webseite, die du vor dir siehst? Dieses Kapitel führt dich tief in die „Werkstatt" des Browsers, damit du seinen Arbeitsablauf verstehst und leistungsfähigere Webseiten schreiben kannst.
:::

**Was lernst du in diesem Artikel?**

| Kapitel | Inhalt | Was du danach kannst |
|-----|------|-----------|
| **Kapitel 1** | Warum die Rendering-Pipeline verstehen | Die Notwendigkeit von Performance-Optimierung verstehen |
| **Kapitel 2** | Die fünf Phasen der Rendering-Pipeline | Den grundlegenden Rendering-Ablauf des Browsers beherrschen |
| **Kapitel 3** | DOM- und CSSOM-Baum aufbauen | Verstehen, wie HTML und CSS geparst werden |
| **Kapitel 4** | Render-Baum aufbauen | Wissen, welche Elemente gerendert werden |
| **Kapitel 5** | Layout und Reflow | Teure Layout-Berechnungen vermeiden |
| **Kapitel 6** | Paint und Repaint | Unnötige Paint-Operationen reduzieren |
| **Kapitel 7** | Compositing und GPU-Beschleunigung | GPU für flüssigere Animationen nutzen |
| **Kapitel 8** | Event Loop | Den Ausführungsmechanismus von JavaScript verstehen |
| **Kapitel 9** | Performance-Optimierung in der Praxis | Gängige Performance-Optimierungstechniken beherrschen |

Jedes Kapitel beginnt mit dem „Verstehen des Prinzips" – du musst keinen Optimierungscode auswendig schreiben können. Wenn du auf Performance-Probleme stößt, kannst du jederzeit hierher zurückkommen und nachschlagen.

---

## 1. Warum die „Rendering-Pipeline" verstehen

### 1.1 Von „es läuft" zu „es läuft schnell": Der Fortschrittspfad der Frontend-Entwicklung

Als wir anfingen, Frontend zu lernen, ging es uns nur darum, ob der Code „läuft" – die Seite wird angezeigt, Buttons sind klickbar, das war schon ein Erfolg. Aber wenn Projekte wachsen und Nutzer mehr werden, stellt man schnell eine harte Realität fest: **Dieselbe Funktion – die Seite des einen läuft seidenweich, die des anderen ruckelt so sehr, dass Nutzer die Maus gegen die Wand werfen wollen.**

Es ist wie beim Autofahren lernen. Anfänger kümmern sich nur darum, „ob das Auto fährt", aber erfahrene Fahrer achten darauf, „wann man schalten, wann man bremsen und wie man am sparsamsten fahren sollte". Der Browser ist dein „Auto" – wenn du seine „Arbeitsweise" verstehst, kannst du schnell und geschmeidig fahren.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🐢 Anfänger-Denken (nur auf Funktionalität fokussiert)**
- Hauptsache, die Seite wird angezeigt
- Ruckeln ist das Problem des Browsers
- Performance-Optimierung ist etwas für später

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Fortgeschrittenes Denken (auf User Experience fokussiert)**
- Flüssigkeit ist der Kern der User Experience
- Den Arbeitsablauf des Browsers verstehen
- Schon beim Coden an Performance denken

</div>
</div>

**Die Rendering-Pipeline zu verstehen, ist der entscheidende Schritt von „es läuft" zu „es läuft schnell".**

### 1.2 Eine wahre Geschichte: Motivation von wurde es nach der „Optimierung" noch langsamer

::: warning Zhangs Performance-Falle
Zhang ist Frontend-Ingenieur bei einem E-Commerce-Unternehmen und für die Optimierung der Produktdetailseite verantwortlich. Die Seite war beim Anzeigen von Produktinformationen extrem langsam, die Nutzer beschwerten sich ständig.

Zhang dachte: „Die Seite ruckelt wahrscheinlich, weil das DOM zu groß ist. Ich verstecke die Elemente erst mit `display:none`, nehme die Änderungen vor und zeige sie dann wieder an – dann rendert der Browser doch nicht ständig neu?"

Also schrieb er diesen Code:

```javascript
// Deine vermeintliche „Optimierung"
const container = document.getElementById('list')
container.style.display = 'none'  // Erst verstecken, dann wird doch nicht gerendert?

for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'  // Zufällige Breite
  container.appendChild(item)
}

container.style.display = 'block'  // Am Ende anzeigen, alles auf einmal rendern
```

Nach dem Test stellte sich heraus: Die Seite war **noch langsamer**! Zhang war verblüfft: Er hatte doch „optimiert" – warum wurde es noch schlimmer?

Später schaute sich der Frontend-Leiter den Code an und wies auf das Problem hin: **Obwohl die Elemente versteckt sind, löst jede Änderung von `style.width` dennoch die Stilberechnung und Layout-Markierung des Browsers aus – der Browser hat im Hintergrund massiv unnötige Arbeit geleistet.**

Der richtige Ansatz ist, `DocumentFragment` zu verwenden, um Operationen im Speicher zu sammeln und am Ende alles auf einmal ins DOM einzufügen – das löst nur ein einziges Rendering aus.
:::

::: info 💡 Kernbotschaft
Wenn du den Arbeitsablauf des Browsers nicht verstehst, könntest du „schlau sein wollen" und eine Menge „Optimierungscode" schreiben, der die Performance letztendlich verschlechtert. **Wenn du die Rendering-Pipeline verstehst, weißt du, welche Operationen teuer und welche günstig sind – und vermeidest so, an der falschen Stelle Kraft zu verschwenden.**
:::

---

## 2. Kernkonzept: Überblick über ist die „Rendering-Pipeline"

::: tip 🤔 Was ist „Rendering"?
**Rendering** ist vereinfacht gesagt der Prozess, bei dem der Browser Code in die Webseite „zeichnet", die du siehst.

Du kannst es dir wie eine **Druckerei vorstellen, die ein Buch druckt**:
- **HTML** = Manuskriptinhalt (Text, Bilder, Kapitel)
- **CSS** = Layoutanforderungen (Schriftgröße, Farbe, Abstände)
- **JavaScript** = Dynamische Änderungen (der Autor ändert kurzfristig das Manuskript, passt das Layout an)

Nachdem der Browser diese „Materialien" erhalten hat, durchlaufen sie mehrere „Arbeitsschritte", bevor schließlich die Webseite „gedruckt" wird, die du siehst. Diese Abfolge von Arbeitsschritten ist die **Rendering-Pipeline**.
:::

Um dir das Verständnis zu erleichtern, verwenden wir eine **Bäckerei** als Metapher für den Rendering-Prozess des Browsers.

### 2.1 Die Rendering-Pipeline mit einer Bäckerei-Metapher verstehen

Stell dir vor, du betreibst eine Bäckerei und musst jeden Tag verschiedene Brote für deine Kunden herstellen. Die dabei anfallenden Arbeitsschritte ähneln erstaunlich dem Rendering-Prozess des Browsers:

| Phase | 🥖 Bäckerei-Metapher | Was der Browser tatsächlich tut | Konkretes Beispiel |
|------|-------------|--------------|----------|
| **1. Zutaten vorbereiten** | Zutatenliste ordnen (Mehl, Eier, Sahne...) | **DOM-Baum aufbauen**: HTML in eine Baumstruktur parsen | Du schreibst `<div><p>Hello</p></div>`, der Browser parst es zum Baum `div→p→"Hello"` |
| **2. Rezept vorbereiten** | Rezeptkarten ordnen (Zutatenverhältnisse für jedes Brot) | **CSSOM-Baum aufbauen**: CSS in einen Regelbaum parsen | Du schreibst `.title { color: red }`, der Browser merkt sich: „`.title`-Text ist rot" |
| **3. Plan erstellen** | Anhand von Zutaten und Rezepten entscheiden, welche Brote heute gebacken werden | **Render-Baum aufbauen**: DOM und CSSOM zusammenführen, nur sichtbare Elemente behalten | `<script>`-Tags werden nicht angezeigt, sind also nicht im Render-Baum |
| **4. Platzieren** | Brote in die Vitrine legen, Position für jedes Brot bestimmen | **Layout**: Größe und Position jedes Elements berechnen | Berechnet: „Dieses div ist 200px breit, 100px hoch, an Position (50, 50) am Bildschirm" |
| **5. Dekorieren** | Brote mit Ei bestreichen, Sesam streuen, Sahne spritzen | **Paint**: Farbe, Rahmen, Schatten usw. der Elemente „malen" | Den „roten Text" tatsächlich auf den Bildschirm malen |
| **6. Zusammenstellen** | Alle Brote übereinanderschichten, schön anrichten | **Composite**: Mehrere Ebenen zum endgültigen Bild zusammenfügen | GPU fügt Hintergrundebene, Textebene, Bildebene zu einem vollständigen Bild zusammen |

::: tip 📊 Was siehst du in dieser Tabelle?
Lass uns die Tabelle Zeile für Zeile durchgehen und jede Phase der Rendering-Pipeline verstehen:

**Phase 1–2 (Vorbereitung)**: Der Browser „versteht" zuerst deinen Code. HTML und CSS werden getrennt geparst, weil sie unterschiedliche Aufgaben haben – HTML bestimmt „welchen Inhalt", CSS bestimmt „wie es aussieht".

**Phase 3 (Zusammenführung)**: Warum „zusammenführen"? Weil nicht alle HTML-Elemente angezeigt werden (z.B. `<head>`, `<script>`). Der Browser muss die „sichtbaren Elemente" mit „ihren Stilen" kombinieren, um einen „Bauplan" zu erstellen.

**Phase 4–5 (Zeichenphase)**: Layout ist „Position berechnen", Paint ist „Farbe auftragen". Layout-Änderungen (z.B. Breitenänderung) führen zu Paint, aber Paint-Änderungen (z.B. Farbänderung) führen nicht zu Layout.

**Phase 6 (Compositing)**: Die „Magie" moderner Browser. Der traditionelle Weg ist „alles auf einmal malen" (CPU, langsam), der moderne Weg ist „in Ebenen zeichnen + GPU-Compositing" (schnell). Deshalb sind `transform`-Animationen flüssiger als `width`-Animationen.
:::

### 2.2 Die fünf Phasen der Rendering-Pipeline

<RenderingPipelineDemo />

---

## 3. Phase 1: DOM-Baum und CSSOM-Baum aufbauen

### 3.1 Warum „in einen Baum" umwandeln

::: tip 🤔 Was ist das DOM?
**DOM (Document Object Model)** ist eine Baumstruktur, in die der Browser das HTML-Dokument umwandelt, damit JavaScript einfach auf Seitenelemente zugreifen kann.

Du kannst es dir wie einen **Stammbaum** vorstellen:
- Ganz oben der „Vorfahre" (`<html>`)
- Darunter die „Kinder" (`<body>`, `<head>`)
- Darunter die „Enkel" (`<div>`, `<p>`, `<span>`)

**Warum in einen Baum umwandeln?** Weil eine Baumstruktur sehr praktisch zum „Suchen" und „Ändern" ist. Wenn du z.B. „alle Elemente mit der Klasse `title`" finden willst, kann der Browser schnell im Baum suchen, anstatt in einem unübersichtlichen Textwust zu stöbern.
:::

Wenn der Browser das HTML erhält, zeigt er es nicht sofort an, sondern muss es erst „verstehen". Dieser Prozess läuft in drei Schritten ab:

**Schritt 1: Lexikalische Analyse – den Code in „Wörter" zerlegen**

```html
<div class="container">
  <p>Hello World</p>
</div>
```

Der Browser sieht diesen Code und „zerlegt" ihn zuerst:
- `<div>` → „Start-Tag div"
- `class="container"` → „Attribut class, Wert container"
- `<p>` → „Start-Tag p"
- `Hello World` → „Textinhalt"
- `</p>` → „End-Tag p"
- `</div>` → „End-Tag div"

**Schritt 2: Syntaxanalyse – die „Wörter" zu „Knoten" zusammensetzen**

Der Browser setzt diese „Wörter" gemäß den HTML-Regeln zu „Knoten" zusammen:
- Elementknoten: `<div>`, `<p>`
- Attributknoten: `class="container"`
- Textknoten: `"Hello World"`

**Schritt 3: Baum aufbauen – „Eltern-Kind-Beziehungen" herstellen**

Schließlich baut der Browser anhand der Verschachtelung der Tags eine Baumstruktur auf:

```
Document (Wurzelknoten)
└── html
    └── body
        └── div.class = "container"
            └── p
                └── "Hello World"
```

### 3.2 CSSOM-Baum: Das „Regelhandbuch" der Stile

::: tip 🤔 Was ist das CSSOM?
**CSSOM (CSS Object Model)** ist eine Baumstruktur, in die der Browser die CSS-Regeln umwandelt. Sie dient zur Berechnung des endgültigen Stils jedes Elements.

Du kannst es dir wie einen **Kleidungsratgeber** vorstellen:
- Obere Regeln (z.B. die Schriftart von body) beeinflussen untere (alle Kindelemente)
- Bei Konflikten (z.B. mehrere Regeln für dasselbe Element mit unterschiedlichen Farben) wird nach „Priorität" entschieden
- Am Ende wird berechnet, welche „Kleidung" jedes Element tragen soll
:::

Der Aufbau des CSSOM ähnelt dem des DOM, mit einem entscheidenden Unterschied: **CSS ist „vererbbar" und „kaskadierend"**.

::: details CSSOM-Aufbauprozess anzeigen
**Ursprüngliches CSS:**
```css
body {
  font-size: 16px;
  color: #333;
}

.container {
  width: 100%;
  color: red;  /* überschreibt die color von body */
}

.container p {
  font-weight: bold;
}
```

**Aufgebauter CSSOM-Baum:**
```
StyleSheet
├── body
│   ├── font-size: 16px
│   └── color: #333
└── .container
    ├── width: 100%
    ├── color: red  (höhere Priorität, überschreibt color von body)
    └── p
        └── font-weight: bold
```
:::

### 3.3 Häufige Fallstricke: Motivation von mein CSS „nicht wirkt"

**Falle 1: Konflikte bei der CSS-Selektor-Gewichtung**

::: details Häufigen Fehler anzeigen
```css
/* Dein CSS */
#header { color: red; }      /* ID-Selektor, Gewicht 100 */
.title { color: blue; }     /* Klassen-Selektor, Gewicht 10 */

/* HTML */
<div id="header" class="title">Welche Farbe hat dieser Text?</div>
```

Du denkst, es ist blau, aber es ist **rot**. Denn die Gewichtung des ID-Selektors (100) ist höher als die des Klassen-Selektors (10).
:::

**Falle 2: HTML-Tags nicht geschlossen – der Browser „repariert automatisch"**

::: details Anzeigen, wie der Browser fehlerhaftes HTML repariert
```html
<!-- Dein HTML -->
<div>
  <p>Das ist ein Text
</div>

<!-- Nach der Reparatur durch den Browser -->
<div>
  <p>Das ist ein Text</p>  <!-- Der Browser schließt das Tag automatisch -->
</div>
```

Der Browser ist sehr „tolerant" und repariert deine Fehler automatisch. Aber diese Toleranz hat ihren Preis – der Browser muss zusätzlich rechnen, um deine Absicht zu erraten, was **die Performance beeinträchtigt**.
:::

<DomToRenderTreeDemo />

---

## 4. Phase 2: Render-Baum aufbauen

### 4.1 Warum brauchen wir einen „Render-Baum"

Du fragst dich vielleicht: **„Wir haben doch schon den DOM-Baum und den CSSOM-Baum – warum noch einen Render-Baum? Können wir nicht direkt das DOM verwenden?"**

Die Antwort: **Der DOM-Baum enthält zu viele „unnütze" Informationen.**

Zum Beispiel dieses HTML:

```html
<html>
<head>
  <title>Seitentitel</title>
  <style>/* CSS-Code */</style>
  <script>/* JavaScript-Code */</script>
</head>
<body>
  <div class="container">
    <p>Sichtbarer Inhalt</p>
  </div>
  <div style="display: none">
    <p>Versteckter Inhalt (display:none)</p>
  </div>
</body>
</html>
```

**Der DOM-Baum enthält alle Elemente**:
- `<head>`, `<title>`, `<style>`, `<script>` (diese werden nicht angezeigt)
- Das `display: none`-div (wird auch nicht angezeigt)

Aber **der Render-Baum enthält nur die Elemente, die „auf den Bildschirm gemalt werden sollen"**:
- Entfernt `<head>` und seine Kindelemente
- Entfernt das `display: none`-div

### 4.2 Regeln für den Aufbau des Render-Baums

Beim Aufbau des Render-Baums folgt der Browser bestimmten Regeln:

| Szenario | Behandlung | Beispiel | Performance-Auswirkung |
|------|---------|------|----------|
| `display: none` | **Vollständig ausgeschlossen** aus dem Render-Baum | Element und seine Kinder sind unsichtbar | ✅ Reduziert Rendering-Aufwand |
| `visibility: hidden` | **Im Render-Baum enthalten**, aber nicht gezeichnet | Nimmt Platz ein, ist aber vollständig transparent | ⚠️ Layout-Berechnung weiterhin nötig |
| `opacity: 0` | **Im Render-Baum enthalten**, aber transparent | Interaktiv (klickbar), aber unsichtbar | ⚠️ Layout-Berechnung weiterhin nötig |
| Außerhalb des Viewports | **Im Render-Baum enthalten**, vorerst nicht gezeichnet | Wird erst beim Scrollen in den Viewport gezeichnet | ⚠️ Aber immer noch im Render-Baum |

::: tip 📊 Was siehst du in dieser Tabelle?
**Wichtige Erkenntnis**: `display: none` ist die einzige Möglichkeit, „wirklich Performance zu sparen", denn das Element ist vollständig aus dem Render-Baum entfernt – der Browser führt dafür keinerlei Layout- und Paint-Arbeit aus.

`visibility: hidden` und `opacity: 0` sind zwar „unsichtbar", befinden sich aber weiterhin im Render-Baum. Der Browser muss ihr Layout trotzdem berechnen (sie nehmen Platz ein). Wenn du „verstecken möchtest, ohne das Layout zu beeinflussen" (z.B. für Ein-/Ausblendanimationen), verwende `opacity`; wenn du „vollständig verstecken und keinen Platz beanspruchen" möchtest, verwende `display: none`.
:::

### 4.3 Häufiger Fallstrick: Motivation von ruckelt die Seite trotz display:none

::: danger ❌ Häufiges Missverständnis: Zu glauben, dass display:none-Elemente „nicht existieren"
Viele denken, dass ein Element nach dem Setzen von `display: none` „verschwindet" und keinerlei Performance-Auswirkungen mehr hat. Das ist **falsch**!

Obwohl das Element mit `display: none` nicht im Render-Baum ist, muss der Browser bei Änderungen seiner Eigenschaften über JavaScript dennoch:
1. **Stile neu berechnen** (CSS-Regeln abgleichen)
2. **Änderungen verfolgen** (für zukünftige Anzeige vorbereiten)

Sieh dir dieses „Optimierungs"-Beispiel an:
:::

::: details Code der „wirkungslosen Optimierung" anzeigen
```javascript
// ❌ Deine vermeintliche „Optimierung": erst verstecken, dann ändern, dann anzeigen
const container = document.getElementById('list')
container.style.display = 'none'

// Wildes DOM-Manipulieren
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'  // Breite ändern!
  item.textContent = `Item ${i}`
  container.appendChild(item)
}

container.style.display = 'block'

// Problem: Jede Änderung von style.width zwingt den Browser,
// Stile neu zu berechnen – selbst wenn das Element display:none ist!
```

**✅ Der richtige Optimierungsansatz:**
```javascript
// DocumentFragment für Batch-Operationen verwenden
const container = document.getElementById('list')
const fragment = document.createDocumentFragment()  // Virtueller Container

// Alle Operationen im Speicher-Fragment durchführen
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'
  item.textContent = `Item ${i}`
  fragment.appendChild(item)  // Beeinflusst das echte DOM nicht
}

// Alles auf einmal ins echte DOM einfügen, löst nur ein Rendering aus
container.appendChild(fragment)
```
:::

---

## 5. Phase 3: Layout und Reflow

### 5.1 Was ist „Layout"

::: tip 🤔 Was ist Layout?
**Layout**, auch **Reflow** genannt, ist der Prozess, bei dem der Browser für jedes Element im Render-Baum berechnet, „an welcher Position es sich befindet und wie viel Platz es einnimmt".

Du kannst es dir wie einen **Innenarchitekten vorstellen, der einen Raum ausmisst**:
- Zuerst Länge und Breite jedes Raums messen
- Entscheiden, wo die Möbel stehen sollen
- Die Koordinaten jedes Möbelstücks berechnen

**Warum ist Layout „teuer"?** Weil die Änderung eines Elements andere Elemente beeinflussen kann. Wenn du z.B. ein div breiter machst, könnte das benachbarte div nach unten geschoben werden, was eine Neuberechnung der gesamten Seite auslöst.
:::

### 5.2 Die „Minenfelder", die Reflow auslösen

Hier sind die häufigsten Operationen, die Reflow auslösen – **zum Nachschlagen und Merken empfohlen**:

| Kategorie | Eigenschaft/Operation | Performance-Auswirkung | Alternative |
|------|----------|----------|----------|
| **Größe** | `width`, `height`, `min/max-width/height` | 💀💀💀 | `transform: scale()` verwenden |
| **Position** | `top`, `right`, `bottom`, `left` | 💀💀💀 | `transform: translate()` verwenden |
| **Abstände** | `margin`, `padding` | 💀💀 | `transform` oder `gap` verwenden |
| **Rahmen** | `border-width` | 💀💀 | Häufige Änderungen vermeiden |
| **Inhalt** | Textänderungen, Bildladen | 💀💀 | Platz reservieren, Layout-Thrashing vermeiden |
| **Schrift** | `font-size`, `line-height` | 💀💀💀 | Häufige Änderungen vermeiden |
| **Anzeige** | `display`-Wert ändern | 💀💀💀 | `visibility` oder `opacity` verwenden (wenn vollständiges Verstecken nicht nötig) |
| **Abfrage** | `offsetWidth`, `offsetHeight` usw. | 💀💀💀💀💀 | **Batch-Lesen, Layout-Thrashing vermeiden** |

::: tip 📊 Was siehst du in dieser Tabelle?
**Wichtige Erkenntnisse**:
1. **Geometrieeigenschaften (Breite, Höhe, Position) sind am teuersten**: Sie lösen eine vollständige Layout-Berechnung aus
2. **Abfrage-Eigenschaften sind gefährlicher als Änderungen**: Das Lesen von `offsetWidth` erzwingt ein **synchrones Layout** (siehe Abschnitt 5.4)
3. **transform und opacity sind am performantesten**: Sie lösen keinen Reflow aus, sondern nur Compositing
:::

### 5.3 Häufiger Fallstrick: Motivation von ruckelt meine Animation wie eine PowerPoint

**Falle: Animation mit width**

::: details Performance-schlechten Animationscode anzeigen
```css
/* ❌ Schlechte Animation: löst Reflow aus */
.box {
  width: 100px;
  transition: width 0.3s;
}

.box:hover {
  width: 200px;  /* Breitenänderung löst Reflow aus! */
}
```

Jedes Einzelbild der Animation löst Reflow aus, der Browser muss:
1. Breite neu berechnen
2. Position neu berechnen (kann andere Elemente beeinflussen)
3. Neu zeichnen

**✅ Gute Animation: transform verwenden**
```css
/* ✅ Gute Animation: löst nur Compositing aus */
.box {
  width: 100px;
  transform: scaleX(1);
  transition: transform 0.3s;
}

.box:hover {
  transform: scaleX(2);  /* Skalierung löst keinen Reflow aus! */
}
```

`transform` wird direkt von der GPU verarbeitet, löst keinen Reflow und kein Repaint aus – die Animation läuft seidenweich.
:::

### 5.4 Performance-Killer: Forced Synchronous Layout

::: danger 💀 Das gefährlichste Performance-Problem: Layout Thrashing
**Forced Synchronous Layout**, auch **Layout Thrashing** genannt, ist das häufigste und zugleich schwerwiegendste Performance-Problem.

Die Ursache: **Wenn JavaScript Layout-Eigenschaften liest (wie `offsetWidth`), muss der Browser die Layout-Berechnung sofort ausführen, um einen genauen Wert zurückgeben zu können.**

Wenn du „abwechselnd liest und schreibst", zwingst du den Browser zu einem „Layout → Lesen → Layout → Lesen"-Teufelskreis.
:::

::: details Code für Layout Thrashing anzeigen
```javascript
// ❌ Extrem schlecht: abwechselndes Lesen und Schreiben führt zu Layout Thrashing
const elements = document.querySelectorAll('.item')

for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight  // Lesen → erzwingt Layout
  elements[i].style.width = (height * 2) + 'px'  // Schreiben → markiert Reflow nötig
  // Das Lesen im nächsten Durchlauf erzwingt wieder Layout... Teufelskreis!
}

// Bei 100 Elementen wird 100-mal die Layout-Berechnung ausgelöst!
```

**✅ Der richtige Optimierungsansatz: Lesen und Schreiben trennen**
```javascript
const elements = document.querySelectorAll('.item')

// Schritt 1: Batch-Lesen (alles zuerst lesen)
const heights = []
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight)  // Löst nur ein Layout aus
}

// Schritt 2: Batch-Schreiben (alles danach schreiben)
requestAnimationFrame(() => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.width = (heights[i] * 2) + 'px'  // Löst nur einen Reflow aus
  }
})
```
:::

<LayoutReflowDemo />

---

## 6. Phase 4: Paint und Repaint

### 6.1 Was ist „Paint"

::: tip 🤔 Was ist Paint?
**Paint** ist der Prozess, bei dem der Browser die „layout-berechneten" Elemente tatsächlich auf den Bildschirm „malt".

Du kannst es dir wie das **Streichen eines Zimmers** vorstellen:
- Layout-Phase = Maße nehmen, Linien ziehen
- Paint-Phase = tatsächlich streichen, tapezieren

**Paint ist nicht so teuer wie Layout, aber auch nicht billig.** Häufiges Paint-Neuzeichnen beeinträchtigt die Performance, besonders bei komplexen Elementen (Schatten, Verläufe usw.).
:::

### 6.2 Signale, die Repaint auslösen

Im Gegensatz zu Reflow betrifft Repaint nur Änderungen des „Aussehens", nicht der „Geometrie":

| Kategorie | Eigenschaft | Performance-Auswirkung | Anmerkung |
|------|------|----------|------|
| **Farbe** | `color`, `background-color` | 💀 | Der häufigste Repaint-Auslöser |
| **Hintergrund** | `background-image`, `background-position` | 💀💀 | Bilder sind langsamer als Farben |
| **Rahmen** | `border-color`, `border-style` | 💀 | Ändert Rahmenfarbe/-stil |
| **Text** | `text-decoration`, `text-shadow` | 💀💀 | Schatten ist langsamer als reiner Text |
| **Box-Schatten** | `box-shadow` | 💀💀💀 | Komplexe Schatten sind sehr langsam |
| **Abrundung** | `border-radius` | 💀 | Ändert den Abrundungsradius |
| **Transparenz** | `opacity` | ✅ | **Spezialfall: löst kein Repaint aus, nur Compositing** |

::: tip 📊 Was siehst du in dieser Tabelle?
**Wichtige Erkenntnis**: `opacity` ist speziell! Genau wie `transform` löst es kein Repaint aus, sondern direkt die Compositing-Phase. Deshalb sind Ein-/Ausblendanimationen mit `opacity` am performantesten.

Außerdem: **Schatten und Verläufe sind teurer als Repaint**, weil sie komplexe Pixelberechnungen erfordern. Wenn deine Seite viele `box-shadow` hat, erwäge die Verwendung von Pseudo-Elementen oder Bildern als Ersatz.
:::

### 6.3 Häufiger Fallstrick: Motivation von ruckelt mein Hover-Effekt

**Falle: Hover-Animation mit box-shadow**

::: Details Performance-schlechten Hover-Effekt anzeigen
```css
/* ❌ Schlechter Hover-Effekt: box-shadow-Animation ist sehr langsam */
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);  /* Schatten ist sehr langsam! */
}
```

`box-shadow` erfordert pixelweise Berechnung, die Animation ruckelt.

**✅ Guter Ansatz: transform oder Pseudo-Elemente verwenden**
```css
/* ✅ Guter Hover-Effekt: transform verwenden */
.card {
  transform: translateY(0);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);  /* Schatten nur beim Hover ändern, nicht animieren */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
```
:::

<PaintLayerDemo />

---

## 7. Phase 5: Compositing und GPU-Beschleunigung

### 7.1 Was ist „Compositing"

::: tip 🤔 Was ist Compositing?
**Compositing** ist die „Magie" moderner Browser. Es teilt verschiedene Teile der Seite in mehrere **Ebenen (Layers)** auf und nutzt dann die **GPU (Grafikprozessor)**, um sie parallel zum endgültigen Bild zusammenzusetzen.

Du kannst es dir wie **Photoshop-Ebenen** vorstellen:
- Traditioneller Weg = alles auf einer Ebene zeichnen (CPU seriell, langsam)
- Compositing-Weg = in Ebenen zeichnen, am Ende zusammenfügen (GPU parallel, schnell)

**Warum ist Compositing schnell?** Weil die GPU auf parallele Aufgaben wie „Bildkomposition" spezialisiert ist – dutzende Male schneller als die CPU.
:::

### 7.2 Welche Elemente werden in eine „Composite-Ebene" hochgestuft

Der Browser stuft bestimmte Elemente automatisch in unabhängige Composite-Ebenen hoch. Hier sind die häufigsten Auslöser:

| Auslöser | CSS-Eigenschaft/Wert | Performance-Auswirkung | Hinweise |
|---------|-----------|----------|----------|
| **3D-Transformation** | `transform: translate3d()`, `rotate3d()` | ✅✅✅ | Beste Animationsperformance |
| **Hardwarebeschleunigungs-Hack** | `transform: translateZ(0)` | ✅✅ | Umgangssprachlich „GPU-Beschleunigung erzwingen" |
| **Transparenz-Animation** | `opacity`-Änderung (mit Animation) | ✅✅✅ | Löst kein Repaint aus |
| **Fixe Positionierung** | `position: fixed` | ✅ | Vermeidet wiederholtes Layout beim Scrollen |
| **Will-Change** | `will-change: transform, opacity` | ✅✅ | Erstellt Ebene im Voraus, auf Speicher achten |
| **Canvas/WebGL** | `<canvas>`, WebGL-Inhalt | ✅✅ | Natürlich in eigener Ebene |
| **Video** | `<video>` | ✅✅ | Eigene Ebene, verhindert gegenseitige Beeinflussung |

::: tip 📊 Was siehst du in dieser Tabelle?
**Wichtige Erkenntnis**: `transform` und `opacity` sind die performantesten Animationseigenschaften, weil sie weder Reflow noch Repaint auslösen, sondern direkt Compositing. Deshalb sagen Performance-Optimierungsleitfäden immer: „Verwende transform und opacity für Animationen."

Aber Achtung: **Jede Composite-Ebene belegt GPU-Speicher**. Der Missbrauch von `translateZ(0)` führt zu einer Speicherexplosion (siehe Abschnitt 7.4).
:::

### 7.3 Häufiger Fallstrick: Zu viele Composite-Ebenen machen es noch langsamer

::: danger 💀 Die Falle der Überoptimierung
Manche hören „GPU-Beschleunigung ist schnell" und fügen allen Elementen `transform: translateZ(0)` hinzu – mit dem Ergebnis, dass die Seite noch langsamer wird.

**Ursache des Problems**:
Jede Composite-Ebene muss eine „Textur" (Bitmap) im GPU-Speicher ablegen, was Speicher belegt. Bei 100 Composite-Ebenen auf einer Seite kann der GPU-Speicher überlaufen, was auf Low-End-Geräten zu Abstürzen oder Degradierung auf CPU-Rendering führt.
:::

::: details Code der „Überoptimierung" anzeigen
```css
/* ❌ Falscher Ansatz: Allen Elementen GPU-Beschleunigung geben */
.card { transform: translateZ(0); }
.button { transform: translateZ(0); }
.icon { transform: translateZ(0); }
/* ... 100 Elemente alle mit ... */

/* Ergebnis: GPU-Speicher explodiert, Seite friert ein */
```

**✅ Richtiger Ansatz: Gezielt einsetzen**
```css
/* Strategie 1: Nur für Elemente, die tatsächlich Animation benötigen */
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);  /* Erstellt automatisch Composite-Ebene */
}

/* Strategie 2: will-change verwenden, um den Browser vorzuwarnen */
.card {
  will-change: transform;  /* Ebene im Voraus erstellen */
}

/* Strategie 3: Nach der Animation entfernen */
.card:not(:hover) {
  will-change: auto;  /* GPU-Speicher freigeben */
}
```
:::

<CompositeDemo />

---

## 8. Event Loop: JavaScripts „Multitasking-Trick"

::: tip 🤔 Was ist der Event Loop?
**Event Loop** ist der Mechanismus, mit dem JavaScript „Asynchronität" implementiert. Da JavaScript **single-threaded** ist (kann immer nur eine Sache gleichzeitig tun), aber dennoch Benutzerklicks, Netzwerkanfragen, Timer und andere Aufgaben verarbeiten muss, braucht es ein „Planungssystem" zur Verwaltung dieser Aufgaben.

Du kannst es dir wie ein **Paketverteilzentrum** vorstellen:
- **Call Stack (Aufrufstapel)** = Das Paket, das gerade bearbeitet wird
- **Web APIs** = Externe Partnerlager (Timer, Netzwerkanfragen usw.)
- **Callback Queue (Rückrufwarteschlange)** = Das Regal mit wartenden Paketen
- **Event Loop** = Der Sortierroboter (prüft ständig, „ob die nächste Aufgabe bearbeitet werden kann")
:::

### 8.1 Macro Tasks und Micro Tasks

Das frühe JavaScript hatte nur eine Aufgabenwarteschlange. Mit zunehmender Komplexität der asynchronen Programmierung führten die Browser zwei Arten von Aufgaben ein:

| Typ | Häufige Quellen | Priorität | Ausführungszeitpunkt |
|------|---------|--------|----------|
| **Macro Task** | `setTimeout`/`setInterval`, I/O-Operationen, UI-Rendering | Niedrig | Eine pro Event-Loop-Zyklus |
| **Micro Task** | `Promise.then`, `MutationObserver` | Hoch | Nach Ende der aktuellen Macro Task sofort alle Micro Tasks leeren |

**Die „Eselsbrücke" für die Ausführungsreihenfolge**:

```
1. Aktuelle Macro Task ausführen (z.B. das gesamte <script>)
2. Alle während der Ausführung entstandenen Micro Tasks ausführen (Promise.then usw.)
   ↳ Micro Tasks können neue Micro Tasks erzeugen, alle werden geleert
3. Bei Bedarf UI-Rendering durchführen (Reflow/Repaint)
4. Nächste Event-Loop-Runde starten, nächste Macro Task ausführen
```

### 8.2 Häufiger Fallstrick: Ist Promise wirklich schneller als setTimeout

::: danger ❌ Häufiges Missverständnis: setTimeout(fn, 0) wird „sofort" ausgeführt
Viele denken, `setTimeout(fn, 0)` bedeutet „sofort nach 0 Millisekunden ausführen". Das ist ein **falsches** Verständnis.

Tatsächlich bedeutet `setTimeout(fn, 0)`: **„Warte mindestens 0 Millisekunden und füge den Callback dann der Macro-Task-Warteschlange hinzu"**. Aber er muss warten, bis der aktuelle Call Stack geleert, die Micro-Task-Warteschlange geleert und eventuelles UI-Rendering abgeschlossen ist.
:::

::: details Ausführungsreihenfolge anzeigen
```javascript
console.log('1. Start')

setTimeout(() => {
  console.log('2. setTimeout callback')
}, 0)

Promise.resolve().then(() => {
  console.log('3. Promise.then')
})

console.log('4. End')

// Deine erwartete Ausgabereihenfolge:
// 1. Start
// 4. End
// 2. setTimeout callback  ← setTimeout(0) ist doch sofort?
// 3. Promise.then

// Tatsächliche Ausgabereihenfolge:
// 1. Start
// 4. End
// 3. Promise.then         ← Promise.then wird vor setTimeout ausgeführt!
// 2. setTimeout callback
```

**Ablaufdiagramm:**
```
Call Stack                    Macro-Task-Warteschlange        Micro-Task-Warteschlange
                              [setTimeout callback]           [Promise.then callback]

1. console.log('1. Start')
   → Ausgabe: 1. Start

2. setTimeout(fn, 0)
   → Callback in Macro-Task-Warteschlange ← [setTimeout callback]

3. Promise.resolve().then()
   → Callback in Micro-Task-Warteschlange                      ← [Promise.then callback]

4. console.log('4. End')
   → Ausgabe: 4. End

5. Call Stack geleert, Micro-Task-Warteschlange prüfen
   → Promise.then-Callback gefunden
   → Ausführen: console.log('3. Promise.then')
   → Ausgabe: 3. Promise.then

6. Micro-Task-Warteschlange geleert
   → Eventuell UI-Rendering (wenn Änderungen vorliegen)

7. Macro-Task-Warteschlange prüfen
   → setTimeout-Callback gefunden
   → Ausführen: console.log('2. setTimeout callback')
   → Ausgabe: 2. setTimeout callback
```
:::

::: tip 💡 Kernbotschaft
**Micro Tasks sind „dringlicher" als Macro Tasks.** Wenn du möchtest, dass eine Operation „nach dem aktuellen Codeblock, aber vor dem UI-Update" so schnell wie möglich ausgeführt wird, verwende `Promise.then` oder `queueMicrotask`.

`setTimeout(0)` garantiert keine sofortige Ausführung – es wird mindestens verzögert, bis der aktuelle Call Stack und die Micro-Task-Warteschlange geleert sind.
:::

<JSEventLoopDemo />

<MacroMicroTaskDemo />

---

## 9. Performance-Optimierung in der Praxis: Lass deine Webseite „fliegen"

Nachdem du den Arbeitsablauf der Rendering-Pipeline verstanden hast, schauen wir uns an, wie man optimiert. Hier sind die fünf praktischsten Optimierungstechniken.

### 9.1 Goldene Regel: Forced Synchronous Layout vermeiden

**Problem**: Abwechselndes Lesen und Schreiben von Layout-Eigenschaften führt zu Layout Thrashing.

::: details Vergleich vor und nach der Optimierung anzeigen
```javascript
// ❌ Extrem schlecht: abwechselndes Lesen und Schreiben führt zu Layout Thrashing
for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight  // Lesen → erzwingt Layout
  elements[i].style.height = (height * 2) + 'px'  // Schreiben → markiert Reflow nötig
  // Das Lesen im nächsten Durchlauf erzwingt wieder Layout... Teufelskreis!
}

// ✅ Extrem gut: erst alles lesen, dann alles schreiben
// Schritt 1: Batch-Lesen
const heights = []
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight)
}

// Schritt 2: Batch-Schreiben
requestAnimationFrame(() => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.height = (heights[i] * 2) + 'px'
  }
})
```
:::

### 9.2 transform und opacity für Animationen verwenden

**Problem**: Animationen mit `width`, `height`, `left`, `top` lösen Reflow aus.

::: details Vergleich vor und nach der Optimierung anzeigen
```css
/* ❌ Schlechte Animation: löst Reflow aus */
.box {
  transition: width 0.3s, left 0.3s;
}
.box.moving {
  width: 200px;
  left: 100px;
}

/* ✅ Gute Animation: löst nur Compositing aus */
.box {
  transition: transform 0.3s;
}
.box.moving {
  transform: translateX(100px) scaleX(2);
}
```
:::

### 9.3 Virtual Scrolling: Große Datenlisten bewältigen

**Problem**: Wenn die Anzahl der Listenelemente Tausende erreicht, führen zu viele DOM-Knoten zu Performance-Problemen.

**Kerngedanke**: Nur die sichtbaren Listenelemente innerhalb des Viewports rendern (plus einen kleinen Puffer). Die Anzahl der DOM-Knoten bleibt konstant, unabhängig von der Gesamtdatenmenge.

<RenderingPerformanceDemo />

::: details Implementierung von Virtual Scrolling anzeigen
```vue
<template>
  <div class="virtual-list" @scroll="handleScroll">
    <!-- Platzhalter-Element, spannt die Scrollbar auf -->
    <div class="phantom" :style="{ height: totalHeight + 'px' }"></div>

    <!-- Tatsächlich gerenderte Listenelemente -->
    <div class="content" :style="{ transform: `translateY(${offsetY}px)` }">
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="item"
        :style="{ height: itemHeight + 'px' }"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: Array,
  itemHeight: { type: Number, default: 50 }
})

const scrollTop = ref(0)
const buffer = 5  // Puffermenge

// Wie viele Elemente im sichtbaren Bereich angezeigt werden können
const visibleCount = computed(() => 10)

// Startindex
const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - buffer)
)

// Endindex
const endIndex = computed(() =>
  Math.min(props.items.length, startIndex.value + visibleCount.value + buffer * 2)
)

// Aktuell sichtbare Daten
const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value)
)

// Gesamthöhe
const totalHeight = computed(() => props.items.length * props.itemHeight)

// Versatz
const offsetY = computed(() => startIndex.value * props.itemHeight)

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}
</script>
```
:::

### 9.4 Debounce und Throttle: Ereignisauslösefrequenz reduzieren

**Problem**: Häufig ausgelöste Ereignisse (wie scroll, resize) führen zu Performance-Problemen.

::: details Implementierung von Debounce und Throttle anzeigen
```javascript
// Debounce: Verzögerte Ausführung, bei erneutem Auslösen innerhalb der Verzögerungszeit wird der Timer zurückgesetzt
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Throttle: Ausführung in festen Zeitintervallen
function throttle(fn, interval) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// Anwendungsbeispiele
window.addEventListener('scroll', debounce(handleScroll, 200))
window.addEventListener('resize', throttle(handleResize, 100))
```
:::

### 9.5 Lazy Loading: Unkritische Ressourcen verzögert laden

**Problem**: Zu viele Ressourcen beim initialen Seitenaufruf laden, was die Seite langsam macht.

::: details Implementierung von Lazy Loading anzeigen
```javascript
// Lazy Loading für Bilder
const lazyImages = document.querySelectorAll('img[data-src]')

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src  // Echtes Bild laden
      img.removeAttribute('data-src')
      observer.unobserve(img)  // Beobachtung beenden
    }
  })
})

lazyImages.forEach(img => imageObserver.observe(img))
```
:::

---

## 10. Performance-Probleme, die du jetzt erkennen können solltest

Nachdem du die Rendering-Pipeline des Browsers verstanden hast, solltest du folgende häufige Performance-Probleme erkennen können:

| Problemcode | Das Problem | Wie du es der KI beschreibst |
|---------|---------|-------------|
| `element.style.width = ...` | Häufige Breitenänderung in einer Schleife | „Hier werden mehrere Reflows ausgelöst, bitte transform oder Batch-Verarbeitung verwenden" |
| `height = element.offsetHeight` | Layout-Eigenschaft sofort nach dem Schreiben lesen | „Das ist Forced Synchronous Layout, bitte Lese- und Schreiboperationen trennen" |
| `element.className = ...` | Häufige class-Änderung löst Stilneuberechnung aus | „classList.add/remove verwenden, um Stilberechnungen zu reduzieren" |
| Animation mit `width`/`left` | Löst Reflow und Repaint aus, schlechte Performance | „Auf transform und opacity für Animationen umstellen" |
| Allen Elementen `translateZ(0)` geben | Missbrauch von GPU-Beschleunigung führt zu Speicherexplosion | „GPU-Beschleunigung nur für Elemente aktivieren, die Animation benötigen" |
| 10.000 Listenelemente alle rendern | Zu viele DOM-Knoten verursachen Ruckeln | „Virtual Scrolling implementieren, nur den sichtbaren Bereich rendern" |
| DOM-Operationen direkt im scroll-Event | Zu hohe Auslösefrequenz verursacht Ruckeln | „Mit requestAnimationFrame oder Throttle optimieren" |
| `box-shadow` als Hover-Animation | Komplexe Schattenberechnung ist sehr langsam | „transform oder Pseudo-Elemente verwenden, Schattenanimation vermeiden" |

**Wenn du die „häufigen Fallstricke" in jedem Kapitel aufmerksam gelesen hast, beherrschst du auch diese Kernkonzepte:**

- **Fünf Phasen der Rendering-Pipeline**: DOM/CSSOM → Render-Baum → Layout → Paint → Composite
- **Reflow vs. Repaint**: Reflow ist am teuersten (Geometrieänderung), Repaint an zweiter Stelle (Aussehensänderung)
- **Forced Synchronous Layout**: Abwechselndes Lesen und Schreiben führt zu Layout Thrashing – muss getrennt werden
- **GPU-Beschleunigung**: transform und opacity werden von der GPU verarbeitet, beste Performance
- **Event Loop**: JavaScript ist single-threaded, implementiert Asynchronität über Aufgabenwarteschlangen

Diese Konzepte helfen dir, Performance-Engpässe schnell zu lokalisieren.

::: info 💡 So sprichst du mit der KI, wenn du auf Performance-Probleme stößt
- „Animation ruckelt, prüfe, ob Reflow oder Repaint ausgelöst wird"
- „Scroll-Performance schlecht, eventuell Throttle oder requestAnimationFrame nötig"
- „Bei großen Datenmengen ruckelt die Liste, Virtual Scrolling nötig"
- „Häufige Stiländerungen verursachen Performance-Probleme, bitte mit transform optimieren"
:::

---

## 11. Fazit: Das Wesen der Rendering-Pipeline-Optimierung

Aus diesem Artikel können wir folgende Kernschlussfolgerungen ziehen:

**Aus der Praxis**: Es geht nicht darum, so viel wie möglich zu optimieren, sondern so **treffsicher** wie möglich. Wenn du die Rendering-Pipeline des Browsers verstehst, weißt du, wo du ansetzen und wo du loslassen musst.

**Aus der Kostenperspektive**:
- Der Großteil der Performance-Verschwendung stammt vom **häufigen abwechselnden Lesen und Schreiben** von Layout-Eigenschaften – das muss durch Trennung von Lesen und Schreiben sowie Batch-Verarbeitung gelöst werden
- Komplexe Animationseffekte, die Reflow und Repaint auslösen, liegen oft an der Verwendung der **„falschen Eigenschaften"** – sie müssen durch `transform` und `opacity` ersetzt werden
- Bei der Darstellung großer Datenlisten reicht das reine virtuelle DOM nicht mehr aus – es muss mit Techniken wie **Virtual Scrolling** kombiniert werden

**Das Ziel ist: Unter den gegebenen Browser- und Hardware-Bedingungen für jeden Rendering-Schritt einen klaren Performance-Gewinn zu erzielen.**

---

## 12. Glossar

| Englischer Begriff | Deutsche Übersetzung | Erklärung |
| :--- | :--- | :--- |
| **DOM** | Document Object Model | Die Baumstruktur, die der Browser durch Parsen des HTML-Dokuments erstellt. JavaScript kann über die DOM-API auf Seitenelemente zugreifen |
| **CSSOM** | CSS Object Model | Die Baumstruktur, die der Browser durch Parsen von CSS erstellt. Wird mit dem DOM kombiniert, um den endgültigen Stil zu berechnen |
| **Render Tree** | Render-Baum | Entsteht durch Zusammenführung von DOM- und CSSOM-Baum, enthält nur sichtbare Knoten. Dient als Grundlage für Layout-Berechnung und Paint |
| **Layout** | Layout | Der Prozess der Berechnung der geometrischen Informationen (Position, Größe) jedes Knotens im Render-Baum. Auch Reflow genannt |
| **Reflow** | Reflow | Wenn sich geometrische Eigenschaften wie Größe oder Position eines Elements ändern, muss der Browser das Layout neu berechnen |
| **Paint** | Paint | Der Prozess des Zeichnens der Elementstile (Farbe, Hintergrund, Rahmen usw.) nach der Layout-Berechnung auf den Bildschirm |
| **Repaint** | Repaint | Wenn sich Aussehens-Eigenschaften eines Elements (z.B. Farbe, Hintergrund) ändern, ohne die Geometrie zu beeinflussen, wird eine Paint-Aktualisierung ausgelöst |
| **Composite** | Compositing | Der Prozess der Zusammenführung mehrerer Paint-Ebenen (Layers) zum endgültigen Bildschirmbild, wird normalerweise auf der GPU ausgeführt |
| **Layer** | Ebene/Composite-Ebene | Eine unabhängige Zeichenoberfläche, die der Browser zur Rendering-Optimierung erstellt. Kann einzeln transformiert und zusammengesetzt werden |
| **Event Loop** | Event Loop | Der asynchrone Ausführungsmechanismus von JavaScript, zuständig für die Planung der Ausführung von Macro Tasks und Micro Tasks |
| **Call Stack** | Call Stack | Die Datenstruktur, die die aktuell ausgeführten JavaScript-Funktionen aufzeichnet |
| **Macro Task** | Macro Task | Aufgabentyp mit niedrigerer Priorität im Event Loop, z.B. setTimeout, setInterval, I/O-Operationen |
| **Micro Task** | Micro Task | Aufgabentyp mit höherer Priorität im Event Loop, z.B. Promise.then, MutationObserver |
| **Forced Synchronous Layout** | Forced Synchronous Layout | Performance-Problem, bei dem abwechselndes Lesen und Schreiben von Layout-Eigenschaften in JavaScript den Browser zur sofortigen Layout-Berechnung zwingt |
| **Layout Thrashing** | Layout Thrashing | Das Phänomen des drastischen Performance-Abfalls durch häufiges Forced Synchronous Layout |
| **Virtual Scrolling** | Virtual Scrolling | Technik, bei der nur die sichtbaren Listenelemente im Viewport gerendert werden. Dient zur Performance-Optimierung großer Datenlisten |
| **RAF** | requestAnimationFrame | Browser-API zur Ausführung von animationsbezogenem JavaScript-Code vor dem nächsten Repaint |