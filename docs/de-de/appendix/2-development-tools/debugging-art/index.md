# Debugging-Lernpfad: Übersicht

::: tip 💡 Kernfunktion
Die Browser-Entwicklertools (DevTools) sind das "Rontgengerat" und der "Operationstisch" der Frontend-Entwicklung. Sie ermoglichen es Ihnen, das Skept (HTML), die Haut (CSS) und das Nervensystem (JavaScript) einer Webseite zu durchleuchten und diese in Echtzeit zu bearbeiten und zu debuggen.
:::

## 1. Was sind DevTools

**DevTools** sind eine in modernen Browsern (Chrome, Edge, Firefox, Safari usw.) integrierte Sammlung von Web-Entwicklungs- und Debugging-Werkzeugen. Fur Entwickler sind sie naher an der "Wahrheit" als der Code-Editor, denn **sie zeigen, wie der Code im Browser tatsachlich ausgefuhrt wird**.

**Wie offnet man DevTools?**

- **Tastaturkurzel**: `F12` oder `Strg + Umschalt + I` (Mac: `Cmd + Option + I`)
- **Maus**: Auf einem beliebigen Element der Webseite **rechtsklicken** und **"Untersuchen (Inspect)"** wahlen.
- **Menu**: Browser-Menü oben rechts -> Weitere Tools -> Entwicklertools.

---

## 2. Interaktive Demo: DevTools-Simulator

Damit Sie schnell in die Praxis kommen konnen, haben wir ein simuliertes DevTools-Panel erstellt, das die Debugging-Oberflache von Chrome nachbildet.
**Klicken Sie unten auf die Schaltflache "▶ Gefuhrte Tour starten" und folgen Sie dem Cursor, um die Funktionen der einzelnen Bereiche kennenzulernen.**

<ClientOnly>
  <BrowserDevToolsDemo />
</ClientOnly>

### 2.1 Fortgeschrittene Demo: Webseite in Echtzeit bearbeiten (Live Edit)

Eine der starksten Funktionen von DevTools ist die **Echtzeit-Bearbeitung**. Die folgende Demo enthalt eine "virtuelle Webseite" (oben) und "DevTools" (unten).

**Versuchen Sie Folgendes:**

1.  Klicken Sie im unteren Elements-Panel auf ein `h1`- oder `button`-Element im DOM-Baum.
2.  Andern Sie im rechten Styles-Panel einen Attributwert in `element.style` (z.B. `color` auf `red` setzen).
3.  Beobachten Sie, wie sich die virtuelle Webseite oben **in Echtzeit verandert**.

<ClientOnly>
  <BrowserDevToolsLiveDemo />
</ClientOnly>

### 2.2 Praxis-Herausforderung: Echten Webseitentext andern

Da Sie nun die Technik der Stilanderung beherrschen, machen wir etwas Spannenderes — **die Webseite, die Sie gerade sehen, direkt bearbeiten!**

1.  **Echte DevTools offnen**: Drucken Sie `F12` (oder rechtsklicken Sie auf diesen Text -> "Untersuchen" wahlen).
2.  **Element lokalisieren**: Im Elements-Panel sehen Sie eine hervorgehobene Codezeile — das ist genau der Text, den Sie gerade angeklickt haben.
3.  **Inhalt andern**: **Doppelklicken** Sie auf den schwarzen Textteil dieser Zeile, andern Sie ihn in "**Ich bin ein Hacker!**" und drucken Sie die Eingabetaste.
4.  **Wunder erleben**: Sehen Sie! Hat sich der Text auf der Webseite verandert?

::: info 🤔 Warum ist alles nach dem Aktualisieren verschwunden?
Sie wurden feststellen, dass nach dem Aktualisieren der Seite alle Änderungen verschwunden sind und die Webseite wieder im Originalzustand erscheint.

Das liegt daran, dass die Änderungen in DevTools nur im **lokalen Speicher Ihres Browsers** stattfinden.

- Wenn Sie eine Webseite besuchen, ladet der Browser den HTML-Code von einem **entfernten Server** herunter und rendert ihn lokal.
- Sie andern nur die **lokale Kopie** und haben keine Berechtigung, den **Quellcode** auf dem Server zu andern.
- Daher ruft der Browser bei jedem Aktualisieren den neuesten (unveranderten) Code vom Server ab, und alles wird wiederhergestellt.
  :::

---

## 3. Kernpanels im Detail

### 3.1 Elements (Elemente-Panel)

<ClientOnly>
  <DevToolsElementsDemo />
</ClientOnly>

**Funktion**: HTML und CSS der Seite anzeigen und in Echtzeit bearbeiten.

- **Links (DOM-Baum)**: Zeigt die HTML-Struktur der Webseite. Sie konnen Tags oder Text per Doppelklick bearbeiten oder Knoten per Drag & Drop verschieben.
- **Rechts (Styles)**: Zeigt die CSS-Stile des ausgewahlten Elements. Sie konnen Styles aktivieren/deaktivieren, um Änderungen zu sehen, oder Werte direkt bearbeiten (z.B. Farben, Abstande).
- **Anwendungsszenarien**:
  - "Warum ist dieser Button nicht ausgerichtet?" -> CSS-Stile prufen.
  - "Ich mochte ausprobieren, ob diese Uberschrift in Rot besser aussieht." -> In Styles direkt `color: red` andern.

### 3.2 Console (Konsolen-Panel)

<ClientOnly>
  <DevToolsConsoleDemo />
</ClientOnly>

**Funktion**: Logs anzeigen, JavaScript-Code ausfuhren.

- **Log-Ausgabe**: `console.log()`-Nachrichten, Warnungen (gelb) und Fehler (rot) werden hier angezeigt.
- **Interaktive Umgebung**: Sie konnen hier beliebigen JS-Code eingeben und sofort ausfuhren. Beispielsweise erzeugt die Eingabe von `alert('Hello')` ein Popup, und `document.body.style.background = 'red'` andert den Hintergrund in Rot.
- **Anwendungsszenarien**:
  - "Warum reagiert der Button-Klick nicht?" -> Prufen, ob rote Fehlermeldungen vorhanden sind.
  - "Den Ruckgabewert einer JS-Funktion prufen." -> Direkt in der Konsole ausfuhren und testen.

### 3.3 Network (Netzwerk-Panel)

<ClientOnly>
  <DevToolsNetworkDemo />
</ClientOnly>

**Funktion**: Alle Netzwerkanfragen uberwachen.

- **Listenansicht**: Zeigt alle geladenen Ressourcen (HTML, CSS, JS, Bilder, API-Anfragen).
- **Anfragedetails**: Klicken Sie auf eine beliebige Anfragezeile, um das Detailpanel auf der rechten Seite zu offnen:
  - **Headers (Kopfzeilen)**: Anfrage- und Antwortheader prufen (z.B. `Content-Type`).
  - **Response (Antwort)**: Vom Server zuruckgegebene Rohdaten (JSON, HTML-Code usw.) anzeigen.
  - **Preview (Vorschau)**: Antworten in einem lesbareren Format vorschauen.
- **Schlusselmetiken**:
  - **Status**: Statuscode (200 Erfolg, 404 nicht gefunden, 500 Serverfehler).
  - **Type**: Ressourcentyp (fetch/xhr steht fur API-Anfragen).
  - **Time**: Ladedauer.
- **Anwendungsszenarien**:
  - "Ist die API ausgefallen?" -> Prufen, ob die API-Anfrage rot mit 500 ist.
  - "Warum lud die Seite so langsam?" -> Herausfinden, welches Bild oder welche Datei die langsamste Ladezeit hat.

### 3.4 Sources (Quellcode-Panel)

<ClientOnly>
  <DevToolsSourcesDemo />
</ClientOnly>

**Funktion**: Quellcode anzeigen, JavaScript debuggen.

- **Breakpoint-Debugging**: Auf die Zeilennummer klicken, um einen "Breakpoint" zu setzen. Wenn der Code diese Zeile erreicht, **pausiert** er und Sie konnen die aktuellen Variablenwerte prufen und den Code schrittweise ausfuhren.
- **Anwendungsszenarien**:
  - "Wo ist die Code-Logik falsch?" -> Breakpoint setzen, den Code Schritt fur Schritt verfolgen und prufen, ob die Variablenwerte den Erwartungen entsprechen.

### 3.5 Application (Anwendungs-Panel)

<ClientOnly>
  <DevToolsApplicationDemo />
</ClientOnly>

**Funktion**: Browserspeicher anzeigen und verwalten.

- **Storage**:
  - **Local Storage**: Persistent gespeicherte Daten.
  - **Session Storage**: Sitzungsbasierter Speicher (verschwindet beim Schliessen des Tabs).
  - **Cookies**: Kleine Textdaten fur die Authentifizierung usw.
- **Anwendungsszenarien**:
  - "Login-Status zurucksetzen" -> Cookies oder Token im Local Storage loschen.
  - "Gepufferte Daten anzeigen" -> Prufen, was im Local Storage gespeichert ist.

---

## 4. Praxistipps

1.  **Mobilmodus-Debugging**: Klicken Sie auf das "Handy-Symbol" 📱 oben links in den DevTools, um verschiedene Handymodelle (iPhone, Pixel usw.) mit unterschiedlichen Bildschirmgroßen zu simulieren und das responsive Verhalten der Webseite zu testen.
2.  **Erzwungene Zustande**: Rechtsklicken Sie im Elements-Panel auf ein Element, wahlen Sie `Force state` -> `:hover`, um das Element im Hover-Zustand zu halten und das Styling bei Maus-Hover einfach zu debuggen.
3.  **Knoten-Screenshot**: Wahlen Sie einen Knoten im Elements-Panel aus, drucken Sie `Strg + Umschalt + P` (Mac: `Cmd + Umschalt + P`), um das Befehlsmenü zu offnen, geben Sie `screenshot` ein und wahlen Sie `Capture node screenshot`, um den DOM-Knoten direkt als Bild zu speichern.

::: warning ⚠️ Hinweis
Alle Änderungen in DevTools (HTML, CSS, JS) sind **temporär** und gelten nur fur die aktuelle Browsersitzung. Sobald Sie die Seite aktualisieren, gehen alle Änderungen verloren. Fur dauerhafte Änderungen mussen Sie die Quellcode-Dateien bearbeiten.
:::
