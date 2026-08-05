# HTML/CSS-Layout: Gestaltungsgrundlagen
::: tip 🎯 Kernfrage
**Wie werden Webseiten eigentlich erstellt? Warum enthalten manche Webseiten nur Text, während andere sich wie Anwendungen verhalten und interaktiv sind?** Diese Frage führt zu den drei Grundpfeilern der Webentwicklung und hilft dir, die Struktur hinter jeder Webseite zu verstehen.
:::

---

## 1. Was sind HTML, CSS und JavaScript

### 1.1 Von statischen Webseiten zu dynamischen Anwendungen

Stell dir ein **Plakat** auf der Straße vor. Du kannst es nur ansehen, aber nicht damit interagieren – das Plakat ändert seinen Inhalt nicht, nur weil du es ansiehst, und es zeigt auch keine zusätzlichen Informationen an, wenn du auf eine Stelle tippst.

Frühe Webseiten waren genau solche „elektronischen Plakate": nur lesbar, nicht veränderbar, mit festem Inhalt.

Moderne Webseiten sind jedoch völlig anders. Sie funktionieren wie **Desktop-Anwendungen**:

- Du kannst klicken, ziehen, eingeben und hochladen
- Die Seite verändert sich in Echtzeit basierend auf deinen Aktionen
- Sie können komplexe Aufgaben wie Software erledigen (z. B. Online-Videobearbeitung)

**Der Hauptgrund für diesen Wandel sind die drei Grundpfeiler der Webtechnologie: HTML + CSS + JavaScript**.

### 1.2 Eine Metapher: Ein Haus bauen

| Technologie    | 🏠 Haus-Metapher                        | Tatsächliche Funktion           | Konkretes Beispiel                                  |
| -------------- | --------------------------------------- | ------------------------------- | --------------------------------------------------- |
| **HTML**       | Die **Struktur und Materialien**        | Definiert Inhalt und Hierarchie | Das ist eine Wand, das ist ein Fenster, das ist ein Raum |
| **CSS**        | Die **Renovierung und das Aussehen**    | Steuert Stil und Layout         | Die Wand blau streichen, das Fenster nach Osten setzen, den Boden fliesen |
| **JavaScript** | Die **Elektrik und intelligenten Systeme** | Macht die Seite interaktiv und logisch | Schalter drücken → Licht an, Tür öffnen → Vorhänge gehen automatisch auf |

::: tip 💡 Die Beziehung der drei

**HTML → CSS**: Zuerst muss das Haus stehen, dann kann renoviert werden. HTML ist die Basis, CSS die Verschönerung.

**HTML + CSS → JavaScript**: Zuerst müssen Haus und Renovierung da sein, dann können smarte Systeme installiert werden. JavaScript erweckt die „tote" Seite zum Leben.

**Kerngedanke**: Jede der drei Technologien hat ihre eigene Aufgabe, keine ist verzichtbar. Eine Seite nur mit HTML ist hässlich, eine Seite mit HTML+CSS ist nicht interaktiv, nur mit allen dreien entstehen Webanwendungen wie die Web-Version von WeChat oder Taobao.
:::

### 1.3 Selbst ausprobieren

👇 Die folgende Demo zeigt, wie HTML/CSS/JavaScript zusammenarbeiten:

<WebTechTriad />

---

## 2. HTML: Das Skelett der Webseite

### 2.1 Warum brauchen wir HTML

Vor der Einführung von HTML bestanden die Inhalte im Internet nur aus **reinem Text**. So wie dieser Text hier – ohne Formatierung, ohne Hierarchie, ohne Links.

Was ist das Problem mit reinem Text?

- ❌ **Keine Hierarchie darstellbar**: Man kann nicht unterscheiden, was eine Überschrift, was Fließtext und was eine Anmerkung ist
- ❌ **Maschinen verstehen es nicht**: Suchmaschinen und Screenreader (für Blinde) können den Inhalt nicht verstehen
- ❌ **Keine Interaktion**: Keine Links, keine Buttons, keine Eingabefelder

**HTML (HyperText Markup Language)** wurde genau dafür geschaffen. Es verwendet „Tags" (Markierungen), um die Bedeutung von Inhalten zu kennzeichnen, damit der Browser weiß, „was das ist".

### 2.2 Wie sieht HTML-Code aus

Die Grundeinheit von HTML ist der „Tag". Tags werden in spitze Klammern `< >` gesetzt und treten meist paarweise auf:

```html
<h1>Das ist eine Überschrift</h1>
<p>Das ist ein Absatz</p>
<a href="url">Das ist ein Link</a>
```

**Schlüsselkonzepte**:

| Konzept | Erklärung | Beispiel |
|---------|-----------|----------|
| **Tag** | Markierung in spitzen Klammern | `<h1>`, `</h1>` |
| **Element** | Tag + Inhalt als Ganzes | `<h1>Überschrift</h1>` |
| **Attribut** | Zusätzliche Information im Tag | `href="url"`, `class="card"` |
| **Verschachtelung** | Tags innerhalb von Tags | `<div><p>Text</p></div>` |

### 2.3 Wie liest man HTML-Code

::: tip 🎯 Für absolute Anfänger: Code lesen lernen

Viele Anfänger sind von den ganzen `<xxx>` überfordert. Dabei gibt es für HTML-Code eine **bewährte Methode**:

**Schritt 1: Die „äußerste Schicht" finden**

```html
<div class="card">        ← Das ist ein Container, der Inhalt enthält
  <h2>Überschrift</h2>
  <p>Beschreibungstext</p>
</div>
```

**Schritt 2: Den Tag-Namen lesen und die Bedeutung erraten**

| Tag-Name | Merkhilfe | Was kommt hinein |
|----------|-----------|-------------------|
| `<div>`  | Große Box | Beliebig, zum Gruppieren |
| `<span>` | Kleine Box | Textfragmente, zum Markieren |
| `<p>`    | Absatz | Ein Textabsatz |
| `<h1>`-`<h6>` | Überschrift | Überschriftentext, je kleiner die Zahl, desto wichtiger |
| `<a>`    | Anker/Link | Klickbare Inhalte, die woanders hinführen |
| `<img>`  | Bild | Kein Inhalt, nutzt `src` als Verweis auf das Bild |
| `<button>` | Button | Klickbarer Text / Icon |
| `<input>` | Eingabefeld | Kein Inhalt, dient der Benutzereingabe |

**Schritt 3: Auf `class` und `id` achten**

```html
<div class="user-card" id="user-123">
```

- `class="user-card"` → Der „Typ" dieses Elements, CSS kann es darüber gruppiert ansprechen
- `id="user-123"` → Die „Personalausweisnummer" dieses Elements, einzigartige Kennung

**Schritt 4: Einrückung zeigt die Hierarchie**

```html
<body>
  <header>           ← Einrückung zeigt: header ist Kind von body
    <nav>            ← nav ist Kind von header
      <a>Start</a>   ← a ist Kind von nav
    </nav>
  </header>
</body>
```
:::

### 2.4 Häufig verwendete HTML-Tags auf einen Blick

**Strukturelle Tags** (definieren das Seiten-Skelett):

```html
<h1>Das ist eine Überschrift erster Ordnung</h1>
<h2>Das ist eine Überschrift zweiter Ordnung</h2>
<p>Das ist ein Absatz</p>
<div>Das ist ein Container (zum Gruppieren)</div>
<span>Das ist ein Inline-Container (zum Markieren von Text)</span>
```

**Links und Medien** (bereichern die Seite):

```html
<a href="https://example.com">Hier klicken zum Navigieren</a>
<img src="photo.jpg" alt="Bildbeschreibung" />
<video src="movie.mp4" controls></video>
```

**Formulare** (zum Sammeln von Benutzereingaben):

```html
<form>
  <input type="text" placeholder="Benutzername eingeben" />
  <input type="password" placeholder="Passwort eingeben" />
  <button type="submit">Anmelden</button>
</form>
```

**Semantische Tags** (HTML5-Neuerung, machen die Seitenbedeutung klarer):

```html
<header>Seitenkopf</header>
<nav>Navigationsleiste</nav>
<main>Hauptinhaltsbereich</main>
<article>Ein Artikel</article>
<aside>Seitenleiste</aside>
<footer>Seitenfuß</footer>
```

::: tip 💡 Warum semantische Tags verwenden?

`<div class="header">` und `<header>` sehen optisch gleich aus – warum sollte man letzteres verwenden?

1. **SEO-freundlich**: Suchmaschinen können die Seitenstruktur besser verstehen
2. **Barrierefreiheit**: Screenreader können schnell Bereiche wie „Navigation" oder „Hauptinhalt" finden
3. **Code-Lesbarkeit**: Man sieht `<header>` und weiß sofort, dass es der Kopfbereich ist

**Wann verwendet man `div`?** Wenn es keinen passenden semantischen Tag gibt. Zum Beispiel für einen rein dekorativen Container.
:::

### 2.5 Wie merkt man sich so viele HTML-Tags

::: tip 🎯 Anfängerfrage

„Es gibt über hundert HTML-Tags – wie soll man sich die alle merken?"

**Die Antwort: Du musst sie nicht alle kennen.** In der Praxis werden 90 % der Fälle mit etwa 20 Tags abgedeckt.
:::

#### Nach Verwendungszweck gruppiert merken

**I. Seitenstruktur (das Skelett zeichnen)**

| Tag | Merkhilfe | Verwendung |
|-----|-----------|------------|
| `<header>` | Kopf | Kopfbereich einer Seite oder eines Abschnitts |
| `<nav>` | Navigation | Navigationslink-Bereich |
| `<main>` | Hauptteil | Hauptinhalt der Seite (nur einer pro Seite) |
| `<article>` | Artikel | Eigenständiger Inhaltsblock (bleibt auch alleinstehend sinnvoll) |
| `<section>` | Abschnitt | Thematisch zusammenhängende Inhaltsgruppe |
| `<aside>` | Seitenbereich | Seitenleiste, ergänzende Inhalte |
| `<footer>` | Fuß | Fußbereich einer Seite oder eines Abschnitts |

**Merkhilfe**: Stell dir eine Zeitung vor – mit Kopfzeile (header), Inhaltsverzeichnis (nav), Haupttext (main/article), Kolumne (aside), Fußzeile (footer).

**II. Inhaltsmarkierung (klarmachen, was etwas ist)**

| Tag | Merkhilfe | Verwendung |
|-----|-----------|------------|
| `<h1>`-`<h6>` | Überschrift 1-6 | Überschriftenhierarchie, h1 ist am größten und wichtigsten |
| `<p>` | Absatz | Ein Textabsatz |
| `<ul>`/`<ol>`/`<li>` | Ungeordnete/Geordnete/Listeneintrag | Listen |
| `<a>` | Anker | Link, zum Navigieren |
| `<img>` | Bild | Bild |
| `<video>`/`<audio>` | Video/Audio | Multimedia |
| `<strong>`/`<em>` | Fett/Kursiv | Semantische Hervorhebung |

**Merkhilfe**: `<a>` steht für „anchor" (Anker) – wie ein Schiff, das an einem Ort ankert, so „verankert" ein Link zu einer anderen Seite.

**III. Formulare und Interaktion (Benutzereingaben sammeln)**

| Tag | Merkhilfe | Verwendung |
|-----|-----------|------------|
| `<form>` | Formular | Formular-Container |
| `<input>` | Eingabe | Verschiedene Eingabefelder (`type` bestimmt die Art) |
| `<textarea>` | Textbereich | Mehrzeilige Texteingabe |
| `<select>`/`<option>` | Auswahl/Option | Dropdown-Auswahl |
| `<button>` | Button | Schaltfläche |
| `<label>` | Beschriftung | Erklärender Text für Eingabefelder |

**Merkhilfe**: Das `type`-Attribut von `<input>` bestimmt sein Aussehen:
- `type="text"` → Textfeld
- `type="password"` → Passwortfeld
- `type="email"` → E-Mail-Feld
- `type="checkbox"` → Checkbox
- `type="radio"` → Radio-Button

**IV. Container (zum Gruppieren)**

| Tag | Merkhilfe | Verwendung |
|-----|-----------|------------|
| `<div>` | Große Box | Block-Container, nimmt eine ganze Zeile ein |
| `<span>` | Kleine Box | Inline-Container, nur so breit wie der Inhalt |

**Merkhilfe**: div = Division (Bereich), span = Spanne. `div` teilt große Bereiche auf, `span` markiert Textfragmente.

#### Überblick über tun bei unbekannten Tags

**Methode 1: Das englische Wort erraten**

Viele Tags sind Abkürzungen englischer Wörter:
- `<abbr>` = abbreviation (Abkürzung)
- `<blockquote>` = block quote (Blockzitat)
- `<caption>` = caption (Beschriftung)
- `<figcaption>` = figure caption (Bildunterschrift)

**Methode 2: MDN nachschlagen**

Die [MDN HTML-Element-Referenz](https://developer.mozilla.org/de/docs/Web/HTML/Element) enthält detaillierte Beschreibungen aller Tags.

**Methode 3: KI fragen**

> „Was bedeutet der `<dl>`-Tag in HTML? Wann verwendet man ihn?"

#### Tags nicht auswendig lernen müssen

**Der echte Arbeitsablauf sieht so aus**:

1. Du weißt, du brauchst einen „Container" → schreibst `<div>`
2. Später fällt dir auf, das ist ein „Navigationsbereich" → änderst zu `<nav>`
3. Noch später: Es ist ein „eigenständiger Artikel" → änderst zu `<article>`

**Erst schreiben, dann Semantik optimieren**. Tags können jederzeit geändert werden – du musst nicht von Anfang an das perfekte Tag wählen.

---

## 3. CSS: Die Haut der Webseite

### 3.1 Warum brauchen wir CSS

Stell dir vor, du ziehst in einen **Rohbau**: Wände, Fenster, Türen sind da, bewohnbar, aber:

- Die Wände sind grauer Beton, nicht schön
- Steckdosen und Schalter sind willkürlich platziert, nicht ansehnlich
- Keine Möbel, das Leben ist unbequem

Eine Webseite nur mit HTML ist genau so: Inhalte und Struktur sind da, aber sie ist **hässlich**, **chaotisch** und **benutzerunfreundlich**.

CSS (Cascading Style Sheets) ist das „Renovierungsteam" der Webseite. Es verändert nicht die HTML-Struktur (reißt keine Wände ein, ändert keine Türen), sondern kümmert sich nur um:

- 🎨 **Wände streichen**: Farben, Hintergründe ändern
- 🖼️ **Bilder aufhängen**: Rahmen, Schatten, abgerundete Ecken hinzufügen
- 🪑 **Möbel aufstellen**: Layout, Abstände, Ausrichtung anpassen

### 3.2 Wie sieht CSS-Code aus

CSS-Code hat ein festes Format:

```css
Selektor {
  Eigenschaft: Wert;
  Eigenschaft: Wert;
}
```

**Drei Schreibweisen**:

```html
<!-- Methode 1: Inline-Styles (für schnelle Tests) -->
<div style="color: red;">Roter Text</div>

<!-- Methode 2: Interne Styles (in der HTML-Datei) -->
<style>
  .red-text { color: red; }
</style>

<!-- Methode 3: Externe Styles (eigenständige CSS-Datei, empfohlen) -->
<link rel="stylesheet" href="styles.css" />
```

### 3.3 Wie liest man CSS-Code

::: tip 🎯 Für absolute Anfänger: CSS lesen lernen

**Schritt 1: Auf den Selektor schauen – „Wen renovieren wir?"**

| Selektor | Schreibweise | Bedeutung |
|----------|-------------|-----------|
| Tag-Selektor | `p { }` | Alle `<p>`-Tags |
| Klassen-Selektor | `.card { }` | Alle Elemente mit `class="card"` |
| ID-Selektor | `#header { }` | Das einzige Element mit `id="header"` |
| Nachfahren-Selektor | `.card h2 { }` | Alle `<h2>` innerhalb von `.card` |
| Kombinierter Selektor | `.card, .box { }` | `.card` oder `.box` – beide |

**Schritt 2: Auf die Eigenschaft schauen – „Was wird renoviert?"**

| Eigenschafts-Kategorie | Häufige Eigenschaften | Wirkung |
|------------------------|----------------------|---------|
| Text | `color`, `font-size`, `font-weight` | Farbe, Größe, Stärke |
| Hintergrund | `background`, `background-color` | Hintergrundfarbe, -bild |
| Rahmen | `border`, `border-radius` | Rahmenlinie, abgerundete Ecken |
| Abstände | `margin`, `padding` | Außenabstand, Innenabstand |
| Layout | `display`, `flex`, `grid` | Anordnungsweise |

**Schritt 3: Auf den Wert schauen – „Wie wird renoviert?"**

```css
.card {
  width: 300px;        /* Feste Breite */
  padding: 16px;       /* Innenabstand 16 Pixel */
  border-radius: 8px;  /* Abgerundete Ecken 8 Pixel */
  background: #fff;    /* Weißer Hintergrund */
}
```

**Häufige Einheiten**:
- `px`: Pixel, feste Größe
- `%`: Prozent, relativ zum Elternelement
- `rem`: Relativ zur Schriftgröße des Wurzelelements
- `vw/vh`: Relativ zur Viewport-Breite/-Höhe
:::

### 3.4 Selektorspezifität

Wenn ein Element von mehreren Selektoren gleichzeitig angesprochen wird – wer gewinnt?

```html
<p class="highlight" id="special">Welche Farbe hat dieser Text?</p>
```

```css
p { color: red; }             /* Spezifität: 1 */
.highlight { color: yellow; } /* Spezifität: 10 */
#special { color: blue; }     /* Spezifität: 100 */
```

**Antwort**: Blau. Der ID-Selektor hat die höchste Spezifität, dann der Klassen-Selektor, der Tag-Selektor ist am niedrigsten.

**Inline-Styles** (im `style`-Attribut) haben die Spezifität 1000 – die höchste!

### 3.5 Das Box-Modell: Motivation von stimmt die Breite nicht

::: tip 🎯 Echte Situation

Du erstellst eine Webseite mit drei Karten nebeneinander, jede 300px breit, der Container insgesamt 900px. Du schreibst:

```css
.card { width: 300px; }
```

Ergebnis: **Die dritte Karte rutscht in die nächste Zeile!**

**Warum?** Weil `width: 300px` nur die Inhaltsbreite ist – du hast `padding` und `border` vergessen. Wenn die Karte `padding: 20px` und `border: 1px` hat, ist die tatsächliche Breite 342px, drei Karten sind 1026px – das sprengt den Container!
:::

Jedes HTML-Element wird in CSS als „Box" betrachtet, die aus vier Schichten besteht. Stell dir vor, du **packst ein Paket**: Der Inhalt ist die Ware, `padding` ist die Luftpolsterfolie, `border` ist der Karton, `margin` ist der Abstand zwischen den Kartons.

👇 **Selbst ausprobieren**: Ziehe die Regler, um die Schichtgrößen anzupassen und das Box-Modell zu beobachten:

<CssBoxModel />

**Lösung**:

```css
.box {
  box-sizing: border-box;  /* width enthält jetzt padding und border */
  width: 200px;
  padding: 10px;
  border: 5px;
}
```

So ist `width: 200px` die endgültige Breite, und `padding` sowie `border` werden „hineingequetscht".

### 3.6 Flexbox: Ansatz für richtet man Elemente automatisch aus

Flexbox ist die am häufigsten verwendete Layout-Methode im modernen CSS. Es ordnet Elemente automatisch an und richtet sie aus – wie Bücher, die sich in einem Regal von selbst ausrichten.

👇 **Selbst ausprobieren**: Wechsle Richtung und Ausrichtung und beobachte, wie sich die Boxen anordnen:

<CssFlexbox />

**Flex-Kernkonzepte**:

| Eigenschaft | Wirkung | Häufige Werte |
|-------------|---------|---------------|
| `display: flex` | Aktiviert Flex-Layout | - |
| `flex-direction` | Hauptachsen-Richtung | `row` (horizontal), `column` (vertikal) |
| `justify-content` | Ausrichtung auf der Hauptachse | `flex-start`, `center`, `space-between` |
| `align-items` | Ausrichtung auf der Querachse | `stretch`, `center`, `flex-start` |
| `flex-wrap` | Umbruch | `nowrap`, `wrap` |
| `gap` | Abstand zwischen Elementen | `10px`, `1rem` |

### 3.7 CSS-Präprozessoren: SCSS/SASS und LESS

::: tip 🎯 Echte Situation

Du hast ein Projekt geschrieben, die CSS-Datei ist 2000 Zeilen lang. Später willst du die Themenfarbe ändern und stellst fest:

- Die Hauptfarbe `#3b82f6` kommt 50-mal vor
- Um eine Farbe zu ändern, musst du global suchen und ersetzen – und hoffen, nichts zu übersehen
- Selektoren wie `.nav .nav-list .nav-item .nav-link` sind lang und schwer zu warten

**CSS-Präprozessoren** lösen genau diese Probleme. Sie machen CSS „programmierbar": mit Variablen, Verschachtelung und wiederverwendbarem Code.
:::

#### 3.7.1 Was sind CSS-Präprozessoren

**Einfach erklärt**: Ein Präprozessor ist eine Art „schlaueres CSS". Du schreibst Styles mit einer mächtigeren Syntax, und er **kompiliert** sie in normales CSS, das der Browser versteht.

**Warum verwenden?**

| Schmerzpunkt | Natives CSS | Präprozessor |
|--------------|-------------|--------------|
| Farben wiederholen sich | Überall kopieren und einfügen | Variable definieren, eine Änderung wirkt global |
| Zu tief verschachtelte Selektoren | Lange Zeichenketten schreiben | Verschachtelungssyntax, Hierarchie auf einen Blick |
| Gleiche Styles wiederholt schreiben | Kopieren und einfügen | Mixins, Wiederverwendung wie Funktionen |

#### 3.7.2 Vergleich der drei großen Präprozessoren

| Eigenschaft | Natives CSS | **SCSS/SASS** | **LESS** |
|-------------|-------------|---------------|----------|
| **Variablen-Schreibweise** | `--primary` | `$primary` | `@primary` |
| **Verschachtelung** | ❌ Nicht unterstützt | ✅ Unterstützt | ✅ Unterstützt |
| **Mixins (Code-Wiederverwendung)** | ❌ Nicht unterstützt | ✅ `@mixin` | ✅ `.mixin()` |
| **Lernaufwand** | Einfach | Mittel | Mittel |
| **Verbreitung** | - | ⭐⭐⭐ Am beliebtesten | ⭐⭐ Beliebt |

**Einfach gemerkt**:
- **SCSS**: Verwendet `$`, wird von Bootstrap 5 genutzt, bestes Ökosystem
- **LESS**: Verwendet `@`, konsistent mit CSS `@media`-Syntax, leicht zu lernen

#### 3.7.3 Kernfunktionen im Vergleich

##### 1. Variablen: Eine Änderung, globale Wirkung

**Szenario**: Die Themenfarbe `#3b82f6` wird an 20 Stellen verwendet und soll auf Rot geändert werden.

<Tabs>
<TabItem label="Natives CSS">

```css
/* 20 Stellen zu ändern, leicht was zu übersehen */
.button { background: #3b82f6; }
.link { color: #3b82f6; }
.border { border-color: #3b82f6; }
```

</TabItem>
<TabItem label="SCSS">

```scss
$primary: #3b82f6;

.button { background: $primary; }
.link { color: $primary; }
.border { border-color: $primary; }
/* Nur $primary ändern – fertig */
```

</TabItem>
<TabItem label="LESS">

```less
@primary: #3b82f6;

.button { background: @primary; }
.link { color: @primary; }
.border { border-color: @primary; }
/* Nur @primary ändern – fertig */
```

</TabItem>
</Tabs>

##### 2. Verschachtelung: Hierarchie auf einen Blick

**Szenario**: Die Navigationsleiste hat eine mehrschichtige Struktur.

<Tabs>
<TabItem label="Natives CSS">

```css
/* Lange Zeichenkette, Hierarchie schwer erkennbar */
.navbar .nav-list .nav-item .nav-link { }
.navbar .nav-list .nav-item .nav-link:hover { }
```

</TabItem>
<TabItem label="SCSS">

```scss
.navbar {
  .nav-list {
    .nav-item {
      .nav-link {
        &:hover { }  /* & steht für den Eltern-Selektor */
      }
    }
  }
}
```

</TabItem>
<TabItem label="LESS">

```less
.navbar {
  .nav-list {
    .nav-item {
      .nav-link {
        &:hover { }
      }
    }
  }
}
```

</TabItem>
</Tabs>

##### 3. Mixins: Code-Snippets wiederverwenden

**Szenario**: Mehrere Buttons brauchen alle den „zentriert"-Style.

<Tabs>
<TabItem label="Natives CSS">

```css
/* 3-mal kopieren und einfügen */
.btn-primary {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-secondary {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

</TabItem>
<TabItem label="SCSS">

```scss
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary { @include center; }
.btn-secondary { @include center; }
```

</TabItem>
<TabItem label="LESS">

```less
.center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary { .center(); }
.btn-secondary { .center(); }
```

</TabItem>
</Tabs>

#### 3.7.4 Wie wählt man aus

| Situation | Empfehlung |
|-----------|------------|
| Gerade am Lernen, kleines Projekt | **Natives CSS** (erst die Grundlagen festigen) |
| Projekt verwendet Bootstrap 5 | **SCSS** (Bootstrap-Quellcode ist SCSS) |
| Team ist mit `@`-Syntax vertraut | **LESS** (konsistent mit CSS `@media`-Syntax) |
| Komplexe Logik nötig (Schleifen, Bedingungen) | **SCSS** (leistungsfähiger) |

#### 3.7.5 Im Projekt verwenden

**Vite-Projekt (am einfachsten)**:

```bash
# Sass installieren
npm install -D sass

# Direkt .scss- oder .less-Dateien verwenden
```

::: tip 💡 Tipps für Einsteiger

1. **Erst natives CSS lernen**: Präprozessoren sind nur „syntaktischer Zucker", ohne CSS-Grundlagen wird es nur chaotischer
2. **Bei kleinen Projekten nicht erzwingen**: Weniger als 200 Zeilen CSS – schreib direkt CSS, das ist einfacher
3. **Mit SCSS anfangen**: Die Syntax ist fast identisch mit CSS, nur mit `$`-Variablen zusätzlich
4. **Nicht zu tief verschachteln**: Mehr als 3 Ebenen machen den Code schwer wartbar
:::

#### 3.7.6 Dateistruktur verschiedener Technologie-Stacks im Vergleich

**Dasselbe Projekt, unterschiedliche Technologie-Stacks – wie unterscheiden sich die Dateistrukturen?**

<Tabs>
<TabItem label="Natives HTML + CSS">

```
my-website/
├── index.html              # Seitenstruktur
├── about.html
├── css/
│   ├── reset.css           # Reset-Styles
│   ├── layout.css          # Layout-Styles
│   ├── components.css      # Komponenten-Styles
│   └── style.css           # Haupt-Styles (kann tausende Zeilen haben)
├── js/
│   └── main.js
└── images/
    └── logo.png
```

**Merkmale**:
- CSS ist in einer oder wenigen Dateien zentralisiert
- Um Styles zu ändern, muss man zwischen HTML und CSS hin- und herwechseln
- Styles können sich leicht gegenseitig überschreiben

</TabItem>
<TabItem label="Vue + natives CSS">

```
src/
├── components/             # Komponenten-Ordner
│   ├── Button/
│   │   ├── Button.vue      # Template + Styles + Logik
│   │   └── Button.test.js
│   ├── Header/
│   │   └── Header.vue
│   └── Footer/
│       └── Footer.vue
├── views/                  # Seiten-Ordner
│   ├── Home.vue
│   └── About.vue
├── App.vue                 # Wurzelkomponente
└── main.js                 # Einstiegspunkt
```

**Button.vue – innere Struktur**:
```vue
<template>
  <button class="btn">Klicken</button>
</template>

<script>
export default { name: 'Button' }
</script>

<style scoped>              <!-- scoped: Styles wirken nur auf diese Komponente -->
.btn { background: #3b82f6; }
</style>
```

</TabItem>
<TabItem label="Vue + SCSS">

```
src/
├── assets/
│   └── styles/
│       ├── _variables.scss     # Variablen: Farben, Abstände usw.
│       ├── _mixins.scss        # Mixins: wiederverwendbare Code-Blöcke
│       ├── _functions.scss     # Funktionen: Farbberechnungen usw.
│       └── global.scss         # Globaler Styles-Einstieg
├── components/
│   ├── Button/
│   │   └── Button.vue          # In der Komponente: @import für Variablen
│   └── Card/
│       └── Card.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js
```

**_variables.scss**:
```scss
$primary: #3b82f6;
$secondary: #64748b;
$spacing-sm: 8px;
$spacing-md: 16px;
```

**Button.vue**:
```vue
<style scoped lang="scss">
@import '@/assets/styles/variables';

.btn {
  background: $primary;      // Variable verwenden
  padding: $spacing-md;
}
</style>
```

</TabItem>
<TabItem label="Vue + Tailwind CSS">

```
src/
├── components/
│   ├── Button.vue          # Kein style-Block nötig
│   ├── Card.vue
│   └── Header.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js

# Konfigurationsdateien (Wurzelverzeichnis)
tailwind.config.js          # Themen-Konfiguration
tailwind.css                # Basis-Styles-Einstieg
```

**Button.vue** (ohne style-Block):
```vue
<template>
  <button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
    Klicken
  </button>
</template>
```

**Merkmale**:
- Keine separaten Style-Dateien
- Klassenname = Style (`bg-blue-500` = blauer Hintergrund)
- Konfiguration zentral in `tailwind.config.js`

</TabItem>
</Tabs>

**Kernunterschiede zusammengefasst**:

| Technologie-Stack | Position der Style-Dateien | Themen-Verwaltung | Code-Wiederverwendung |
|-------------------|---------------------------|-------------------|----------------------|
| Natives HTML+CSS | Zentral in `css/`-Ordner | Suchen und Ersetzen | Kopieren und Einfügen |
| Vue + CSS | Verteilt in `.vue`-Komponenten | Suchen und Ersetzen | Kopieren und Einfügen |
| Vue + SCSS | In Komponenten + `styles/`-Shared-Dateien | Variablen zentral verwalten | Mixins zur Wiederverwendung |
| Vue + Tailwind | Keine (in Klassennamen) | `tailwind.config.js` | Klassen-Kombination |

### 3.8 Wie merkt man sich so viele CSS-Eigenschaften

::: tip 🎯 Anfängerfrage

„Es gibt hunderte CSS-Eigenschaften – wie soll man sich die alle merken?"

**Die Antwort: Nach Verwendungszweck gruppieren, die Kern-Eigenschaften merken, den Rest bei Bedarf nachschlagen.**
:::

#### Nach Verwendungszweck gruppiert merken

**I. Text & Typografie (wie Text aussieht)**

| Eigenschaft | Merkhilfe | Häufige Werte |
|-------------|-----------|---------------|
| `color` | Farbe | `red`, `#fff`, `rgb(0,0,0)` |
| `font-size` | Schriftgröße | `16px`, `1rem`, `1.5em` |
| `font-weight` | Schriftstärke | `normal`, `bold`, `100`-`900` |
| `font-family` | Schriftart | `"Arial"`, `sans-serif` |
| `line-height` | Zeilenhöhe | `1.5`, `24px` |
| `text-align` | Textausrichtung | `left`, `center`, `right` |
| `text-decoration` | Textdekoration | `none`, `underline`, `line-through` |

**Merkhilfe**: Stell dir vor, du formatierst in Word – Farbe ändern, Größe, Fett, Schriftart, Zeilenabstand, Ausrichtung, Unterstreichung.

**II. Box-Modell (wie viel Platz ein Element einnimmt)**

| Eigenschaft | Merkhilfe | Häufige Werte |
|-------------|-----------|---------------|
| `width`/`height` | Breite/Höhe | `100px`, `50%`, `100vw` |
| `padding` | Innenabstand | `10px`, `10px 20px` |
| `margin` | Außenabstand | `10px`, `auto` (zum Zentrieren) |
| `border` | Rahmen | `1px solid #ccc` |
| `border-radius` | Abgerundete Ecken | `4px`, `50%` (Kreis) |
| `box-sizing` | Box-Modell | `border-box` (empfohlen) |

**Merkhilfe**: `padding` ist der „Innen"-Abstand (vom Inhalt zum Rahmen), `margin` ist der „Außen"-Abstand (vom Rahmen zu anderen Elementen).

**Kurzschreibweise**:
```css
/* Vier Werte: oben rechts unten links (im Uhrzeigersinn) */
padding: 10px 20px 15px 25px;

/* Zwei Werte: oben/unten links/rechts */
padding: 10px 20px;

/* Ein Wert: alle vier Richtungen gleich */
padding: 10px;
```

**III. Hintergrund & Rahmen (wie das Element aussieht)**

| Eigenschaft | Merkhilfe | Häufige Werte |
|-------------|-----------|---------------|
| `background` | Hintergrund | `#fff`, `url(bg.jpg)`, `linear-gradient(...)` |
| `background-color` | Hintergrundfarbe | `#fff`, `rgba(0,0,0,0.5)` |
| `background-image` | Hintergrundbild | `url(photo.jpg)` |
| `background-size` | Hintergrundgröße | `cover`, `contain`, `100%` |
| `background-position` | Hintergrundposition | `center`, `top left` |
| `box-shadow` | Box-Schatten | `0 2px 10px rgba(0,0,0,0.1)` |
| `opacity` | Transparenz | `0`-`1` (0 = vollständig transparent) |

**Merkhilfe**: `background` ist eine Kurzschreibweise, die mehrere Werte auf einmal setzt:
```css
background: #fff url(bg.jpg) no-repeat center/cover;
/*          Farbe Bild       Keine Wiederholung  Position/Größe */
```

**IV. Layout (wie Elemente angeordnet werden)**

| Eigenschaft | Merkhilfe | Häufige Werte |
|-------------|-----------|---------------|
| `display` | Anzeigemodus | `block`, `inline`, `flex`, `grid`, `none` |
| `position` | Positionierung | `static`, `relative`, `absolute`, `fixed`, `sticky` |
| `top`/`right`/`bottom`/`left` | Vier Richtungen | `10px`, `50%` (mit `position` verwenden) |
| `z-index` | Stapelreihenfolge | Je höher die Zahl, desto weiter oben |
| `float` | Umfließen | `left`, `right` (veraltete Methode, nicht empfohlen) |
| `overflow` | Überlauf-Verhalten | `visible`, `hidden`, `scroll`, `auto` |

**`position`-Merkhilfe**:
- `static`: Standard, normaler Fluss
- `relative`: Relativ zur eigenen ursprünglichen Position versetzt
- `absolute`: Relativ zum nächsten positionierten Vorfahren positioniert
- `fixed`: Relativ zum Viewport positioniert (bleibt auch beim Scrollen)
- `sticky`: Bleibt nach Erreichen einer bestimmten Scroll-Position haften

**V. Flexbox-Layout (das eindimensionale Layout-Wunderwerkzeug)**

| Eigenschaft | Merkhilfe | Wirkung |
|-------------|-----------|---------|
| `display: flex` | Flex aktivieren | Container wird zum Flex-Container |
| `flex-direction` | Richtung | `row` (horizontal), `column` (vertikal) |
| `justify-content` | Hauptachsen-Ausrichtung | Wie Elemente auf der Hauptachse verteilt werden |
| `align-items` | Querachsen-Ausrichtung | Wie Elemente auf der Querachse ausgerichtet werden |
| `flex-wrap` | Umbruch | `nowrap`, `wrap` |
| `gap` | Abstand | Abstand zwischen Elementen |
| `flex` | Flexibilität | Dehnungsverhältnis der Kindelemente |

**Merkhilfe**:
- `justify` = Ausrichtung → Hauptachsen-Ausrichtung
- `align` = Ausrichtung → Querachsen-Ausrichtung

**VI. Animation & Übergänge (wie sich Elemente bewegen)**

| Eigenschaft | Merkhilfe | Häufige Werte |
|-------------|-----------|---------------|
| `transition` | Übergang | `all 0.3s ease` |
| `transform` | Transformation | `translate(10px)`, `rotate(45deg)`, `scale(1.1)` |
| `animation` | Animation | `fadeIn 1s ease forwards` |

**Kurzschreibweise**:
```css
/* transition: Eigenschaft Dauer Timing-Funktion Verzögerung */
transition: all 0.3s ease 0s;

/* transform kann mehrere Transformationen kombinieren */
transform: translateX(10px) rotate(45deg) scale(1.1);
```

#### Überblick über tun bei unbekannten Eigenschaften

**Methode 1: Das englische Wort erraten**

Viele Eigenschaften sind englische Wörter oder Abkürzungen:
- `margin` = Rand, Spielraum
- `padding` = Polsterung, Füllung
- `border` = Grenze, Rand
- `visibility` = Sichtbarkeit
- `cursor` = Mauszeiger

**Methode 2: Nach Szenario assoziieren**

Wenn du einen bestimmten Effekt erzielen willst, denk an „Schlüsselwörter":

| Ich möchte... | Mögliche Eigenschaften |
|---------------|------------------------|
| Farbe ändern | `color`, `background-color`, `border-color` |
| Größe ändern | `width`, `height`, `font-size` |
| Position ändern | `margin`, `position`, `top/left` |
| Abstände ändern | `padding`, `margin`, `gap` |
| Element verstecken | `display: none`, `visibility: hidden`, `opacity: 0` |
| Zentrieren | `margin: auto`, `text-align: center`, `justify-content: center` |
| Abgerundete Ecken | `border-radius` |
| Schatten hinzufügen | `box-shadow`, `text-shadow` |
| Animation hinzufügen | `transition`, `animation` |

**Methode 3: MDN nachschlagen oder KI fragen**

Die [MDN CSS-Referenz](https://developer.mozilla.org/de/docs/Web/CSS/Reference) enthält detaillierte Beschreibungen aller Eigenschaften.

> „Wie kann ich in CSS Text auf eine Zeile beschränken und den Überlauf mit Auslassungspunkten anzeigen?"

**Methode 4: Mit den Entwicklertools „abschauen"**

Wenn dir ein Effekt auf einer Webseite gefällt:
1. Rechtsklick → „Untersuchen"
2. Element auswählen, Styles-Panel ansehen
3. CSS-Eigenschaften direkt kopieren

#### Eigenschaften nicht auswendig lernen müssen

**Der echte Arbeitsablauf sieht so aus**:

1. Du weißt, du willst „zentrieren" → suchst nach „CSS zentrieren"
2. Kopierst den Code, passt die Werte an
3. Durch Wiederholung merkst du es dir irgendwann

**Empfohlener Lernpfad**:

1. **Zuerst das Box-Modell beherrschen**: `width`, `height`, `padding`, `margin`, `border`
2. **Dann Flexbox beherrschen**: `display: flex`, `justify-content`, `align-items`
3. **Dann Positionierung beherrschen**: `position`, `top/left`, `z-index`
4. **Zuletzt Animation lernen**: `transition`, `transform`, `animation`

Andere Eigenschaften bei Bedarf nachschlagen – durch häufige Nutzung merkt man sie sich von selbst.

---

## 4. JavaScript: Das Gehirn der Webseite

### 4.1 Warum brauchen wir JavaScript

Eine Webseite nur mit HTML + CSS ist wie eine **Schaufensterpuppe**:

- ✅ Sieht gut aus (CSS)
- ✅ Struktur ist klar (HTML)
- ❌ Aber wenn du mit ihr sprichst, antwortet sie nicht
- ❌ Du drückst einen Knopf – nichts passiert

**JavaScript** verwandelt die Webseite von einer „Schaufensterpuppe" in einen „echten Menschen":

- ✅ Knopf drücken → Benachrichtigung erscheint
- ✅ Text eingeben → Format wird in Echtzeit geprüft
- ✅ Seite scrollen → mehr Inhalte werden geladen
- ✅ Formular absenden → „Wird gesendet..." erscheint

### 4.2 Wie sieht JavaScript-Code aus

**Fähigkeit 1: Daten merken** (Variablen)

```javascript
let userName = 'Max'
let isLoggedIn = true
let cartCount = 5
```

**Fähigkeit 2: Dinge wiederholen** (Funktionen)

```javascript
function sayHello(name) {
  return 'Hallo, ' + name + '!'
}

console.log(sayHello('Max'))  // Ausgabe: Hallo, Max!
```

**Fähigkeit 3: Auf Ereignisse reagieren** (Event-Listener)

```javascript
button.addEventListener('click', function() {
  alert('Der Button wurde geklickt!')
})
```

**Fähigkeit 4: Die Seite verändern** (DOM-Manipulation)

```javascript
document.getElementById('title').textContent = 'Neuer Titel'
document.getElementById('box').style.background = 'red'
```

### 4.3 Wie liest man JavaScript-Code

::: tip 🎯 Für absolute Anfänger: JS-Code lesen lernen

**Schritt 1: Variablen finden – „Was wird gemerkt?"**

```javascript
const API_URL = 'https://api.example.com'  // Konstante, ändert sich nicht
let count = 0                                // Variable, ändert sich
const user = { name: 'Max', age: 25 }       // Objekt, mehrere Daten
const items = ['Apfel', 'Banane', 'Orange']  // Array, Listendaten
```

**Schritt 2: Funktionen finden – „Was kann getan werden?"**

```javascript
// Der Funktionsname verrät meist den Zweck
function handleClick() { }      // Klick verarbeiten
function fetchData() { }        // Daten abrufen
function validateForm() { }     // Formular validieren
```

**Schritt 3: Ereignisse finden – „Wann wird es ausgelöst?"**

```javascript
button.addEventListener('click', handleClick)     // Beim Klicken
input.addEventListener('input', validateForm)     // Beim Eingeben
window.addEventListener('scroll', loadMore)       // Beim Scrollen
```

**Schritt 4: DOM-Operationen finden – „Was wurde verändert?"**

```javascript
element.textContent = 'Neuer Inhalt'     // Text ändern
element.classList.add('active')          // CSS-Klasse hinzufügen
element.style.display = 'none'           // Element ausblenden
parent.appendChild(child)                // Element hinzufügen
```
:::

### 4.4 DOM: Ansatz für manipuliert JavaScript die Seite

Nachdem der Browser den HTML-Code gelesen hat, behandelt er ihn nicht als bloße Zeichenkette, sondern zeichnet ihn im Speicher als „Baum":

```
Document (Dokument)
    ↓
<html>
    ├─<head>
    │   └─<title>Meine Webseite</title>
    └─<body>
        ├─<h1>Willkommen</h1>
        └─<div class="card">
            ├─<img src="photo.jpg">
            └─<p>Ein Textabsatz</p>
```

Dieser Baum heißt **DOM-Baum**. Jedes HTML-Tag ist ein „Knoten" in diesem Baum.

**Wie findet man Knoten?**

```javascript
// Nach ID suchen (am schnellsten, eindeutig)
const element = document.getElementById('header')

// Nach Selektor suchen (am häufigsten verwendet)
const element = document.querySelector('.card h2')    // Erstes finden
const elements = document.querySelectorAll('button')  // Alle finden

// Nach Beziehung suchen
element.parentNode           // Elternknoten finden
element.children             // Kindknoten finden
element.nextElementSibling   // Nächstes Geschwisterelement finden
```

**Performance-Warnung**: DOM-Operationen sind **teuer**. Bei jeder DOM-Änderung muss der Browser das Layout neu berechnen und neu zeichnen.

```javascript
// ❌ Ineffizient: 1000-mal schleifen, jedes Mal DOM manipulieren
for (let i = 0; i < 1000; i++) {
  document.body.appendChild(createDiv())
}

// ✅ Effizient: Erst zusammenbauen, dann auf einmal einfügen
const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  fragment.appendChild(createDiv())
}
document.body.appendChild(fragment)
```

Genau deshalb wurden moderne Frameworks wie **Vue / React** entwickelt: Sie arbeiten mit einem „virtuellen DOM" im Speicher, berechnen die minimale Änderungsmenge und manipulieren das echte DOM erst ganz zum Schluss.

👇 **Selbst ausprobieren**: Grundlegende DOM-Operationen:

<DomManipulator />

### 4.5 ECMAScript: Die Versionsentwicklung von JavaScript

**ECMAScript** ist die „Standard-Spezifikation" von JavaScript. Browser-Hersteller implementieren ihre JavaScript-Engines nach diesem Standard.

#### Motivation von gibt es Versionsnummern

JavaScript ist nicht unveränderlich. Jedes Jahr kommen neue Funktionen hinzu und Probleme werden behoben. Die Versionsnummer sagt dir: „Welche Funktionen unterstützt dieser Browser?"

#### Wichtige Versionen im Überblick

| Version | Jahr | Kernfunktionen | Welches Problem wird gelöst |
|---------|------|----------------|---------------------------|
| **ES5** | 2009 | Strict Mode, `forEach`/`map`/`filter` | Sprachstandardisierung, Array-Methoden |
| **ES6/ES2015** | 2015 | `let/const`, Pfeilfunktionen, `class`, `Promise`, Module | Das größte Update, Startpunkt des modernen JS |
| **ES2016** | 2016 | `includes()`, `**`-Potenzoperator | Kleines Update |
| **ES2017** | 2017 | `async/await`, `Object.entries()` | Asynchroner Code wird lesbarer |
| **ES2018** | 2018 | `...` Spread-Operator, `Promise.finally()` | Objekt- und Async-Erweiterungen |
| **ES2020** | 2020 | Optional Chaining `?.`, Nullish Coalescing `??`, `BigInt` | Sicherer Zugriff auf verschachtelte Eigenschaften |
| **ES2021** | 2021 | `replaceAll()`, logische Zuweisung `??=` | String- und Zuweisungs-Erweiterungen |
| **ES2022** | 2022 | Top-level `await`, `.at()`-Index | Einfacheres asynchrones Laden von Modulen |

#### Die am häufigsten verwendete ES6+-Syntax

**1. `let` und `const` statt `var`**

```javascript
// ❌ Alte Schreibweise: var hat Hoisting, führt leicht zu Bugs
var name = 'Max'
if (true) {
  var name = 'Moritz'  // Überschreibt das äußere name
}
console.log(name)  // 'Moritz', nicht das erwartete Ergebnis

// ✅ Neue Schreibweise: let hat Block-Scope
let name = 'Max'
if (true) {
  let name = 'Moritz'  // Nur innerhalb dieses if-Blocks gültig
}
console.log(name)  // 'Max', wie erwartet

// ✅ const: Nach Deklaration nicht neu zuweisbar
const PI = 3.14159
PI = 3  // Fehler! Verhindert versehentliche Änderungen
```

**2. Pfeilfunktionen: Kompaktere Funktionssyntax**

```javascript
// ❌ Alte Schreibweise
const add = function(a, b) {
  return a + b
}

// ✅ Neue Schreibweise
const add = (a, b) => a + b

// this in Pfeilfunktionen bindet den äußeren Scope
const obj = {
  name: 'Max',
  // ❌ Normale Funktion: this zeigt auf den Aufrufer
  oldWay: function() {
    setTimeout(function() {
      console.log(this.name)  // undefined
    }, 100)
  },
  // ✅ Pfeilfunktion: this erbt von obj
  newWay: function() {
    setTimeout(() => {
      console.log(this.name)  // 'Max'
    }, 100)
  }
}
```

**3. Destrukturierung: Daten aus Objekten/Arrays extrahieren**

```javascript
// Objekt-Destrukturierung
const user = { name: 'Max', age: 25, city: 'Berlin' }
const { name, age } = user  // Direkt extrahieren
console.log(name)  // 'Max'

// Array-Destrukturierung
const colors = ['rot', 'grün', 'blau']
const [first, second] = colors
console.log(first)  // 'rot'

// Funktionsparameter-Destrukturierung
function greet({ name, age }) {
  console.log(`${name} ist ${age} Jahre alt`)
}
greet(user)  // 'Max ist 25 Jahre alt'
```

**4. Template-Strings: Kein mühsames String-Verknüpfen mehr**

```javascript
// ❌ Alte Schreibweise: Ein Haufen Anführungszeichen und Pluszeichen
const msg = 'Benutzer ' + name + ' ist ' + age + ' Jahre alt'

// ✅ Neue Schreibweise: Backticks + ${}
const msg = `Benutzer ${name} ist ${age} Jahre alt`

// Unterstützt auch mehrzeilige Strings
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>Alter: ${age}</p>
  </div>
`
```

**5. `async/await`: Asynchronen Code wie synchronen schreiben**

```javascript
// ❌ Callback-Hölle
fetchUser(function(user) {
  fetchOrders(user.id, function(orders) {
    fetchDetails(orders[0].id, function(details) {
      console.log(details)
    })
  })
})

// ✅ async/await
async function getUserData() {
  const user = await fetchUser()
  const orders = await fetchOrders(user.id)
  const details = await fetchDetails(orders[0].id)
  console.log(details)
}
```

**6. Optional Chaining `?.` und Nullish Coalescing `??`**

```javascript
const user = {
  name: 'Max',
  address: {
    city: 'Berlin'
  }
}

// ❌ Alte Schreibweise: Schicht für Schicht prüfen
const street = user && user.address && user.address.street
const streetName = street !== undefined ? street : 'Unbekannt'

// ✅ Neue Schreibweise: Optional Chaining + Nullish Coalescing
const streetName = user?.address?.street ?? 'Unbekannt'
```

::: tip 💡 Wie erkennt man, welche Features der Browser unterstützt?

1. **Kompatibilitätstabelle prüfen**: [caniuse.com](https://caniuse.com/) – Feature-Namen eingeben
2. **Build-Tools verwenden**: Babel kann neue Syntax in alten Browser-kompatiblen Code umwandeln
3. **Zielgruppe kennen**: Wenn nur moderne Browser unterstützt werden müssen, können die meisten ES6+-Features direkt verwendet werden
:::

### 4.6 TypeScript: Typsicherheit für JavaScript

#### Motivation von brauchen wir TypeScript

**Szenario 1: Unklare Funktionsparametertypen**

```javascript
// JavaScript
function calculateTotal(price, quantity) {
  return price * quantity
}

calculateTotal(100, 5)      // 500 ✅
calculateTotal('100', 5)    // '1005' ❌ String-Verkettung, keine Multiplikation
calculateTotal(100, '5')    // 500 ✅ aber nur Glück
```

JavaScript sagt dir nicht, dass der Parametertyp falsch ist – das Problem zeigt sich erst zur Laufzeit.

**Szenario 2: Tippfehler bei Objekteigenschaften**

```javascript
// JavaScript
const user = {
  name: 'Max',
  age: 25
}

console.log(user.nmae)  // undefined, Tippfehler aber kein Fehler
```

**TypeScript löst diese Probleme**:

```typescript
// TypeScript
interface User {
  name: string
  age: number
}

function greet(user: User) {
  console.log(`Hallo, ${user.name}`)
  console.log(user.nmae)  // ❌ Kompilierfehler: Eigenschaft 'nmae' existiert nicht
}

greet({ name: 'Max', age: 25 })        // ✅
greet({ name: 'Max', age: '25' })      // ❌ Kompilierfehler: age sollte number sein
greet({ name: 'Max' })                 // ❌ Kompilierfehler: age fehlt
```

#### Kernkonzepte von TypeScript

**1. Grundtypen**

```typescript
let name: string = 'Max'
let age: number = 25
let isActive: boolean = true
let anyValue: any = 'Kann beliebiger Typ sein'  // Nicht empfohlen, verliert Sinn der Typ-Prüfung
```

**2. Interfaces: Objektstruktur definieren**

```typescript
interface Product {
  id: number
  name: string
  price: number
  discount?: number  // Optionale Eigenschaft
  readonly createdAt: Date  // Schreibgeschützte Eigenschaft
}

const product: Product = {
  id: 1,
  name: 'iPhone 15',
  price: 6999,
  createdAt: new Date()
}
```

**3. Typ-Aliase (Type)**

```typescript
type ID = string | number  // Union-Typ
type Status = 'pending' | 'approved' | 'rejected'  // Literal-Typ

function updateStatus(id: ID, status: Status) {
  // ...
}

updateStatus(1, 'approved')      // ✅
updateStatus('abc', 'pending')   // ✅
updateStatus(1, 'processing')    // ❌ 'processing' ist kein gültiger Status
```

**4. Generics: Wiederverwendbare Typen**

```typescript
// Ohne Generics: Für jeden Typ eine eigene Funktion
function getFirstNumber(arr: number[]): number {
  return arr[0]
}
function getFirstString(arr: string[]): string {
  return arr[0]
}

// Mit Generics: Eine Funktion für alles
function getFirst<T>(arr: T[]): T {
  return arr[0]
}

getFirst([1, 2, 3])        // Gibt number zurück
getFirst(['a', 'b', 'c'])  // Gibt string zurück
```

#### TypeScript vs JavaScript im Vergleich

| Eigenschaft | JavaScript | TypeScript |
|-------------|------------|------------|
| Typ-Prüfung | Fehler erst zur Laufzeit | Fehler schon beim Kompilieren |
| IDE-Unterstützung | Einfache Hinweise | Intelligente Autovervollständigung, Refactoring, Zur Definition springen |
| Lernkurve | Einfach | Typsystem muss gelernt werden |
| Einsatzgebiet | Kleine Projekte, Prototypen | Große Projekte, Teamarbeit |
| Ausführung | Browser führt direkt aus | Muss zu JavaScript kompiliert werden |

#### TypeScript in der Praxis

```typescript
// API-Antwort-Typdefinition
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface User {
  id: number
  name: string
  email: string
}

// Typisierte API-Anfrage
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// Bei Verwendung zeigt die IDE alle Eigenschaften an
fetchUser(1).then(res => {
  console.log(res.data.name)   // ✅ IDE Auto-Vervollständigung
  console.log(res.data.nmae)   // ❌ Kompilierfehler
})
```

::: tip 💡 Tipps für Einsteiger

1. **Erst JavaScript lernen**: TypeScript ist eine Obermenge von JS – ohne JS-Kenntnisse wird TS sehr mühsam
2. **Bei kleinen Projekten nicht TS erzwingen**: Typdefinitionen erhöhen die Code-Menge, einfache Projekte werden dadurch komplexer
3. **Mit JSDoc anfangen**: In JS-Dateien `/** @type {User} */`-Kommentare schreiben, um Typhinweise zu bekommen
4. **`any` ist ein Kompromiss, keine Lösung**: Bei Typ-Problemen erst eine Lösung suchen, nicht direkt `any` verwenden
:::

### 4.7 Die moderne JavaScript-Entwicklungs-Toolchain

::: tip 🎯 Warum braucht man eine Toolchain?

Der Browser versteht nur HTML/CSS/JS. Aber in der modernen Entwicklung verwenden wir:

- **TypeScript**: Der Browser versteht es nicht, muss zu JS kompiliert werden
- **SCSS/Less**: Der Browser versteht es nicht, muss zu CSS kompiliert werden
- **Module**: `import/export` muss in eine Datei gebündelt werden
- **Neue Syntax**: ES6+ muss in Code für ältere Browser transpiliert werden

Die Toolchain wandelt den „Entwicklungscode" in „Browser-fähigen Code" um.
:::

**Kernwerkzeuge**:

| Werkzeug | Funktion | Analogie |
|----------|----------|----------|
| **Node.js** | JavaScript-Laufzeitumgebung | Ermöglicht JS außerhalb des Browsers |
| **npm/yarn/pnpm** | Paketmanager | Fertige Code-Bibliotheken herunterladen |
| **Vite/Webpack** | Build-Tool | Quellcode in browser-fähigen Code bündeln |
| **Babel** | Compiler | Neue Syntax in alte Syntax umwandeln |
| **ESLint** | Code-Prüfung | Code-Probleme und Stil-Inkonsistenzen finden |

**Ein typischer Entwicklungsablauf**:

```bash
# 1. Projekt initialisieren
npm create vite@latest my-app -- --template vue-ts

# 2. Abhängigkeiten installieren
cd my-app
npm install

# 3. Entwicklungsmodus (Hot Reload)
npm run dev

# 4. Produktions-Build erstellen
npm run build
```

---

## 5. Das Zusammenspiel der drei Technologien

### 5.1 Aufgabenverteilung im Vergleich

| Rolle | Zuständig für | Nicht zuständig für | Typisches Beispiel |
|-------|--------------|--------------------|--------------------|
| **HTML** | Definiert Struktur und Semantik | Kein Styling/Interaktion | `<section><h1>Titel</h1></section>` |
| **CSS** | Steuert Aussehen und Layout | Keine Logik/Daten | `.card { background: white; }` |
| **JavaScript** | Behandelt Interaktion und Logik | Keine Strukturdefinition | `button.onclick = () => alert()` |

### 5.2 Ein vollständiges Beispiel für das Zusammenspiel

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* CSS: Macht die Karte ansehnlich */
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
    }
    .card button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <!-- HTML: Definiert die Karten-Struktur -->
  <div class="card">
    <h2 id="title">Klick den Button</h2>
    <button id="btn">Klick mich</button>
  </div>

  <script>
    // JavaScript: Macht den Button klickbar
    const btn = document.getElementById('btn')
    const title = document.getElementById('title')

    btn.addEventListener('click', function() {
      title.textContent = 'Geklickt!'
      alert('Titel wurde geändert')
    })
  </script>
</body>
</html>
```

---

## 6. Was tun bei unbekanntem Code

### 6.1 KI fragen

> „Was bedeutet der `<aside>`-Tag in HTML? Wann verwendet man ihn?"
>
> „Welchen Effekt hat `position: sticky` in CSS?"

### 6.2 MDN nachschlagen

[MDN Web Docs](https://developer.mozilla.org/) ist die maßgebliche Web-Technologie-Dokumentation. Bei unbekannten Tags, Eigenschaften oder Methoden einfach direkt suchen.

### 6.3 Browser-Entwicklertools

1. Rechtsklick auf ein Seitenelement → „Untersuchen"
2. Im **Elements**-Panel die HTML-Struktur sehen
3. Im **Styles**-Panel die CSS-Styles sehen
4. Im **Console**-Panel JS-Code ausführen

### 6.4 Häufige CSS-Eigenschaften auf einen Blick

| Das siehst du | Das bedeutet es |
|---------------|-----------------|
| `display: flex` | Aktiviert Flexbox-Layout |
| `position: absolute` | Absolute Positionierung |
| `z-index: 100` | Stapelreihenfolge, höhere Zahl = weiter oben |
| `overflow: hidden` | Überlauf ausblenden |
| `cursor: pointer` | Mauszeiger als Hand |
| `transition: all 0.3s` | Animierter Übergang |
| `box-sizing: border-box` | `width` enthält `padding` und `border` |

---

## 7. Glossar

| Begriff | Englisch | Einfach erklärt |
|---------|----------|-----------------|
| **HTML** | HyperText Markup Language | Hypertext-Auszeichnungssprache, beschreibt die Webseitenstruktur mit Tags |
| **CSS** | Cascading Style Sheets | Kaskadierende Stylesheets, steuern Farben, Layout, Animationen |
| **JavaScript** | JavaScript | Die Programmiersprache der Webseite, zuständig für Interaktion und Logik |
| **DOM** | Document Object Model | Dokument-Objekt-Modell, stellt die Seite als Objektbaum dar |
| **Flexbox** | Flexible Box Layout | Ein eindimensionales Layout-Schema, einfach auszurichten und zu verteilen |
| **Box-Modell** | CSS Box Model | Die Schichten eines Elements vom Inhalt bis zum Außenabstand |
| **SCSS** | Sassy CSS | CSS-Präprozessor, unterstützt Variablen, Verschachtelung, Mixins |
| **TypeScript** | TypeScript | Obermenge von JavaScript, fügt ein Typsystem hinzu |
| **ES6** | ECMAScript 2015 | Eine wichtige JavaScript-Version mit vielen neuen Syntax-Features |
| **Semantisch** | Semantic HTML | Verwendung bedeutungstragender Tags (z. B. `header`) statt `div` |
| **Responsive** | Responsive Design | Design, das sich automatisch an verschiedene Bildschirmgrößen anpasst |

---

## Zusammenfassung

Jetzt weißt du: **HTML definiert das Skelett, CSS ist für das Aussehen zuständig, JavaScript verleiht die Seele**.

Diese drei sind die Grundpfeiler der Webentwicklung. Wenn du sie verstehst, kannst du:

- Den Quellcode jeder Webseite lesen (Rechtsklick → „Seitenquelltext anzeigen")
- Fremde Webseiten verändern (Browser DevTools → Elements)
- Mit dem Lernen von Frontend-Frameworks (Vue/React) beginnen – sie alle basieren auf diesen dreien

**Nächste Schritte**:

- Wenn du schnell Webseiten erstellen willst, lerne **Vue** oder **React**
- Wenn du CSS vertiefen willst, lerne **Flexbox** und **Grid**-Layout
- Wenn du deine Code-Qualität verbessern willst, lerne **TypeScript**