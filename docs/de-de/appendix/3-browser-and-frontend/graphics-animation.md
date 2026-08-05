# Grafik und Animation: Rendering-Techniken

::: tip 🎯 Kernfrage
Fruehere Webseiten konnten nur trockene Texte und Bilder anzeigen. Wenn Sie aber ein Breakout-Spiel, brillante dynamische Effekte oder frei ziehbare Datenberichte erstellen mochten, reicht `<div>` allein bei weitem nicht aus. Deshalb wurde **Canvas (Leinwand)** geboren.

Dieser Guide fuhrt Sie vom Zeichnen der ersten Linie bis hin zur eigenhandigen Erstellung eines Partikel-Engines, der im Browser mit fliessenden 60 Bildern pro Sekunde lauft.
:::

---

## 1. Was ist Canvas

Wenn fruehe Webseiten statische Modelle aus **Legosteinen** (HTML-Tags) waren, dann ist das HTML5-`<canvas>`-Tag, als wuerde man Ihnen ein riesiges **digitales Blankopapier** ueberreichen und Ihnen einen per Code gesteuerten **Pinsel** in die Hand druecken — der Rest liegt ganz bei Ihnen.

Die Zeichnung darin hat keine Tag-Struktur. Was Sie mit dem Pinsel auftragen, wird sobald es auftraegt zur reinsten **„Pixel-Farbe"**.

### 1.1 Canvas vs. SVG: Zwei Kuenstler verschiedener Schulen

In der Frontend-Grafikwelt hat Canvas einen Erzrivalen namens **SVG**. Sie reprasentieren zwei grundverschiedene Malphilosophien:

- **Canvas (Bitmap-Malplatte):**
  - **Prinzip**: Wie echtes Malen auf Papier — ein paar Pinselstriche werden zu einer Farbmasse (Pixeln).
  - **Vorteil**: Der Computer muss nur „Farbe auf den Bildschirm spruhen" — die Leistung geht durch die Decke! Kann gleichzeitig Tausende springende und funkelnde Partikel zeichnen.
  - **Nachteil**: Nach dem Zeichnen kann man nicht einzeln rueckgaengig machen (keine DOM-Knoten-Auswahl), und beim Vergroessern entsteht eine pixelige Verschwoemmung.
- **SVG (Vektorgrafik-Zusammenbau):**
  - **Prinzip**: Wie eine PPT-Praesentation. Sie zeichnen einen Kreis, und es wird eine unabhaengige Tag-„Kreisentitaet" auf der Flaecherzeugt.
  - **Vorteil**: Ob 100-fach oder 100.000-fach vergrossert — immer gestochen scharf. Jede Form ist ein unabhaengiger DOM-Knoten, dessen Farbe Sie jederzeit mit CSS und JS aendern oder Klick-Ereignisse binden koennen.
  - **Nachteil**: Wenn Sie versuchen, Zehntausende Objekte herumfliegen zu lassen, friert der schwere DOM-Baum und die Layout-Engine den Browser direkt ein.

**🎮 Kurze Zusammenfassung: Dynamische Spiele und coole Partikeleffekte mit Canvas; prazise Logos und interaktive Diagramme mit SVG.**

---

## 2. Der erste Strich: Das intuitionwidrige Koordinatensystem verstehen

### 2.1 Warum ist oben und unten bei diesem Papier vertauscht

Bevor Sie den Pinsel ansetzen, muessen Sie verstehen, dass das Lineal in Canvas umgekehrt ist. Im traditionellen Mathe-Koordinatensystem liegt der Nullpunkt in der Mitte, und nach oben wird es groesser. Aber im Bereich der Computerbildschirmanzeige liegt der „Ursprung (0, 0)" bei fast allen Geraeten in der **oberen linken Ecke des Bildschirms**. Nach rechts wird die X-Achse groesser — kein Problem — aber **nach unten wird die Y-Achse groesser**.

**Kernprinzipien des Canvas-Koordinatensystems:**
- **Grundeinheit:** Pixel (px), 1:1-Entsprechung mit physischen Bildschirmpixeln.
- **X-Achse:** Rechts ist die positive Richtung, von `0` bis `canvas.width`.
- **Y-Achse:** Unten ist die positive Richtung, von `0` bis `canvas.height`.

👇 Ziehen Sie den kleinen Punkt unten, um den Koordinatenursprung und die Richtung in der Computergrafik intuitiv zu spueren:

<CoordinateSystemDemo />

### 2.2 Gewuerz fuer Ihren magischen Pinsel

Mit dem Koordinatensystem koennen wir den Pinsel herbeirufen (im Code `Context` oder `ctx` genannt). Wie beim Malen mit einer echten Palette folgt das API-Design von Canvas perfekt den drei Schritten des physischen Malens:

1. **Farbe mischen (State)**: `fillStyle` fuer Fuellfarbe, `strokeStyle` fuer Strichfarbe.
2. **Form bilden (Path)**: Ueberlegen, ob Sie eine Linie (`lineTo`), einen Kreis (`arc`) oder ein Rechteck (`rect`) zeichnen moechten.
3. **Minimalistischer Pinselstrich (Render)**: Entscheiden, ob intern gefuellt (`fill()`) oder die Kante nachgezeichnet wird (`stroke()`).

Da Canvas eine reine Bitmap-Leinwand ist, gilt „was gezeichnet ist, ist gezeichnet" — sobald Sie etwas gemalt haben, trocknet es sofort zu Pixeln und kann nicht mehr als unabhaengiges Objekt rueckgaengig gemacht werden.

👇 Probieren Sie in der folgenden Demo verschiedene Formen und Farben aus und sehen Sie, wie der Hintergrundcode die obigen „drei Schritte" ausfuehrt:

<CanvasBasicsDemo />

---

## 3. Das Daumenkino: Ansatz für man Bewegung butterweich hinbekommt

Da Canvas einmal ausgefuellt zu permanenten Pixeln wird, wie werden dann die auf den ganzen Bildschirm verteilten Charaktere in verschiedenen HTML5-Browsergames erzeugt?

Die Antwort ist: **„Ihre Augen tauschen"**. Das Prinzip ist identisch mit dem Daumenkino oder Filmstreifen.

1. **Tafel abwischen (Clear)**: Mit `clearRect()` den gesamten Inhalt der Leinwand rueckhaltslos loeschen.
2. **Neue Position berechnen (Update)**: Die X-Koordinate des Charakters heimlich um 2 Pixel nach vorne verschieben.
3. **Neu zeichnen (Render)**: Den Charakter an der neuen Position nochmal zeichnen.
4. **Endlose Schleife (Loop)**: Kombiniert mit dem im Browser eingebauten, extrem praezisen Metronom `requestAnimationFrame`. Es wiederholt diese drei Aktionen mit der Bildwiederholfrequenz des Displays (normalerweise 60-mal pro Sekunde, also 60 FPS).

Da das menschliche Auge von Natur aus einen „Nachbildeffekt" hat, sehen Sie bei 60-mal pro Sekunde [Loeschen -> Aktualisieren -> Neuzeichnen] kein flackerndes schwarzes Brett, sondern eine seidig glaettende Animation.

👇 Passen Sie in der Demo unten die Abspielgeschwindigkeit an und beobachten Sie, wie die Verschiebung jedes Einzelbilds zu einer fliessenden Bewegung zusammengefuegt wird:

<AnimationLoopDemo />

---

## 4. Blindenfuehlung: Ansatz für macht man Klick-Interaktion in Canvas

Da die Canvas-Leinwand fuer den Browser nur ein strukturoses „Farbtuch" ist, koennen Sie bei einem auf der Leinwand mit `arc()` gezeichneten Monster nicht auf traditionellem Weg wie mit `document.getElementById` darauf zugreifen, um „Klick auf Monster zieht Lebenspunkte ab" zu implementieren. In der HTML-Struktur gibt es nur das starre `<canvas>`-Tag mit 600 Pixel Breite.

Das ist das klassischste Problem der Grafikprogrammierung: **Kollisionserkennung (Collision Detection) und Ereignisdelegation**.

Da der Browser nur weiss, dass Ihre Maus auf die Bildschirmkoordinaten `(x, y)` des Canvas geklickt hat, muessen Sie selbst mit Geometrie auf Mittelschulniveau zurueckrechnen:
- **Fuer Kreise:** Mit dem Satz des Pythagoras den Abstand zwischen `Mausklickposition` und `Kreismittelpunkt` berechnen — wenn der Abstand kleiner als der Radius ist, wurde „getroffen".
- **Fuer Rechtecke:** Pruefen, ob das geklickte `x` innerhalb der linken und rechten Grenze des Rechtecks liegt und gleichzeitig `y` innerhalb der oberen und unteren Grenze.

Unabhaengig davon, wie viele Elemente sich auf Ihrer Leinwand befinden, werden Maus-Hover- oder Klick-Ereignisse immer an den einzigen Container Canvas gebunden — das ist die ultimative „Ereignisdelegation".

👇 Versuchen Sie unten, die Maus (Klicken, Ziehen, Hover) oder Tastatur (Pfeiltasten zum Bewegen) zu verwenden, um die Low-Level-Interaktionslogik des „manuellen Abstands-Berechnens" zu erfahren:

<EventHandlingDemo />

---

## 5. Rechenleistung befreien: Partikelsystem und visuelle Magie

An diesem Punkt, wenn wir „Koordinatensystem", „Animationschleife" und „Farbe und Form" zusammenfuehren und die Anzahl auf Hunderte oder Tausende winzige Fragmente steigern, haben Sie die ultimative Waffe zur visuellen Explosion gemeistert: das **Partikelsystem (Particle System)**.

Die Kernidee ist extrem einfach und wirkungsvoll:
1. Ein riesiges Array erstellen, das mit Hunderten unabhaengigen „Partikelobjekten" gefuellt ist.
2. Jedes Objekt hat seinen eigenen Lebenszyklus (`life`), Beschleunigung (`vx/vy`) und Gravitationsdaempfung (`gravity`).
3. Bei jedem `requestAnimationFrame`-Trigger diese Hunderte von Partikeln durchlaufen, aktualisieren und rendern, dann leise die „toten" (Lebensdauer aufgebraucht/vom Bildschirm verschwunden) Partikel entfernen.

Ihr Browser kann im Handumdrehen zu einer Fabrik werden, die Feuerwerk, Schneesturm und Explosionen erzeugt.

👇 Klicken Sie auf verschiedene Effekte, passen Sie Schwerkraft und Partikelanzahl an und beobachten Sie, wie einfachste physikalisch-mathematische Formeln komplexe kollektive visuelle Effekte erzeugen:

<ParticleSystemDemo />

---

## 6. FPS-Ehre wahren: Ansatz für umgeht man den ueberhitzten CPU

Tausende Objekte sechzigmal pro Sekunde zu berechnen und neu zu zeichnen, ist extrem leistungsintensiv. Ohne Systematik wird Ihr Computerluefter bald durchdrehen.

Hier sind die „Schutztechniken", die echte Engine-Profis nutzen, um die Bildrate zu retten:

1. **Teilweise Tafel abwischen (Dirty Rect / Schmutziges Rechteck):**
   Wenn ein Charakter ueber eine weite Steppe rennt, loeschen Sie auf keinen Fall bei jedem Frame die gesamte Steppe mit `clearRect`! Nur das kleine Fleckchen, ueber das der Charakter gelaufen ist, mit dem „kleinen Schwamm" abwischen und neu zeichnen — die Leistung steigt exponentiell.

2. **Hintergrund-Doppelgaenger-Magie (Offscreen-Canvas):**
   Wenn der Hintergrund ein sternklarer Himmel mit verschiedenen komplexen und praechtigen Gebirgszuegen ist, ist es unklug, ihn jedes Mal in Echtzeit zu rendern. Wir erstellen normalerweise heimlich einen unsichtbaren `<canvas>` im Speicher und zeichnen ihn dort einmal exakt. Bei allen folgenden Frame-Aktualisierungen muss nur dieses fertige „statische Negativ" ueber `drawImage()` aufkopiert werden, was massiv Grundberechnungen spart.

3. **Pinsel stapelweise waschen (Batching):**
   Von Rot auf Blau in der Palette zu wechseln, ist auf unterster Ebene teuer. Wenn 1000 rote und 1000 blaue Kreise kreuz und quer auf der Leinwand verteilt sind: Die schnellste Methode ist, zuerst die rote Farbe vorzubereiten, alle roten Kreise zu zeichnen, dann auf blaue Farbe zu wechseln und alle blauen Kreise zu zeichnen. Das ist die Idee des beruehmten Batch-Renderings.

👇 Ziehen Sie die Objektanzahl auf ueber 3000, sehen Sie zu, wie die Webseite in den Abgrund der Ruckler stuerzt, und schalten Sie dann nacheinander die „Optimierungstechniken" unten rechts ein, um die echte Bildratenrettung mit eigenen Augen zu erleben:

<PerformanceDemo />

---

## 7. Fachbegriffe Zusammenfassung

| Begriff | Einfache Erklaerung |
| --- | --- |
| **Canvas** | Die von HTML5 bereitgestellte 2D-Leinwand. Extrem schnelles Zeichnen, aber nach dem Fertigstellen werden die Pixel zu Farbe und koennen nicht mehr ueber DOM-Operationen bearbeitet werden. |
| **SVG** | Vektorgrafik. Wird beim Vergroessern nie unscharf, und jede Form ist ein unabhaengiges Tag-Element, das einfach mit CSS-Stilen und Interaktionen versehen werden kann. |
| **Context (ctx)** | Ihr beantragter „2D-Magiepinsel" zum Mischen von Farben, Festlegen von Formen und Zeichnen verschiedener Spezialeffekte. |
| **requestAnimationFrame** | Das im Browser eingebaute, goettliche Metronom, das Callbacks streng nach der Bildwiederholfrequenz des Displays ausfuehrt — die erste Wahl fuer butterweiche Animationen. |
| **FPS (Frame Rate)** | Bildrate. 60 FPS bedeutet, dass der Browser eine Sekunde lang 60-mal die Leinwand nahtlos abwischt und 60 neue Bilder zeichnet. |
| **Dirty Rect (Schmutziges Rechteck)**** | Nur in dem winzigen Bereich, in dem sich etwas geaendert hat, praezise loeschen und neu zeichnen, um die Leistung kraftvoll zu erhalten. |
| **Offscreen-Canvas** | Die im Speicher versteckte „Schatten-Leinwand". Extrem komplexe, aber unbewegliche Hintergruende werden vorab gezeichnet und spaeter als statische Textur wiederverwendet. |

> Von einer einfachen Linie bis hin zu einem grandiosen Partikel-Engine-System — jeder Effekt, der wie Magie aussieht, ist nichts weiter als ein Zyklus aus Koordinatenberechnung und Neuzeichnen mit 60-mal pro Sekunde.
