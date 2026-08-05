# Prinzipien der Datendarstellung: Codierung, Speicherung und Übertragung

::: tip Vorwort
Wenn Sie einem Freund ein Foto schicken, eine WeChat-Nachricht senden oder ein mehrere GB großes Spiel herunterladen — wie durchquert diese Information mehr als den halben Erdball und erscheint unversehen auf Ihrem Bildschirm? Dieses Kapitel dreht sich um eine Frage, die Anfänger oft quält: **Warum wird eine empfangene Datei plötzlich zu unverständlichem Zeichensalat?** Entlang dieser Frage werden wir die drei wichtigsten Grundpfeiler der Informatik vollständig enthüllen: **Kodierung, Speicherung und Übertragung**.
:::

**Was werden Sie in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels werden Sie Folgendes gewonnen haben:

- **Fähigkeit zur Fehlersuche bei Zeichensalat**: Wenn eine Datei beim Öffnen nur noch aus unverständlichen Zeichen besteht, können Sie die Ursache aus Kodierungsperspektive analysieren, anstatt einfach anzunehmen, die Datei sei kaputt
- **Plattformübergreifendes Bewusstsein**: Beim Datenaustausch wissen, warum Kodierungsformat und Byte-Reihenfolge wichtig sind
- **Kodierungs-Weltbild**: Verstehen, wie der Computer alles mit 0 und 1 darstellt — von Text über Bilder bis zu komplexen Objekten
- **Grundlage für Weiteres**: Basis für Netzwerkprotokolle, Dateiformate und Serialisierungstechniken

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | Zeichenkodierung | ASCII, UTF-8, GBK |
| **Kapitel 2** | Datenspeicherung | Binärsystem, Byte-Reihenfolge |
| **Kapitel 3** | Datenübertragung | Serialisierung, Komprimierung |

Bevor wir beginnen, müssen wir eine physikalische Tatsache klären, die Anfänger oft übersehen:

Computer sind extrem „stur". Sie verstehen keine chinesischen Schriftzeichen, erkennen keine Farben und können auch nichts mit Liedern anfangen.

Ihre Grundlage besteht aus unzähligen winzigen Halbleiterschaltern, **die immer wieder nur zwischen „Strom an (1)" oder „Strom aus (0)" unterscheiden können**.

Da der Computer nur 0 und 1 kennt, wie bringen wir ihm bei, bunte Bilder und komplexe Schriftzeichen anzuzeigen?

Die Antwort lautet: **Ein „Codebuch" vereinbaren**.

Wir einigen uns mit dem Computer darauf: Wenn die zugrunde liegenden Signale die Folge `01000001` senden, wird auf dem Bildschirm der Buchstabe `A` gezeichnet; bei einer anderen Signalfolge wird Rot angezeigt.

Dieser **Vorgang des Erstellens und Anwendens eines Codebuchs zur gegenseitigen Übersetzung wird als „Kodierung (Encoding)" bezeichnet**.

Versteht man den logischen Ausgangspunkt, dass „alles im Computer im Grunde Code ist", wird sofort klar, wie das im Alltag am häufigsten anzutreffende Gespenst entsteht — Zeichensalat (Mojibake).

---

## 0. Einleitung: Kodierungsinkompatibilitäten und Zeichensalat
Stellen Sie sich vor, Sie erhalten eine wichtige Datei von einem Kollegen, öffnen sie per Doppelklick und sehen nur seltsame Zeichenfolgen wie „浣犲ソ" oder „ä½ å¥½".

Intuitiv denken Sie sicher: Wurde die Datei bei der Übertragung beschädigt? Gingen Datenpakete verloren?

In Wirklichkeit ist die Wahrheit bei der überwältigenden Mehrheit solcher „Dateibeschädigungen" jedoch eine einzige: **Ihr Computer hat die „falsche Leseregel" angewendet**.

Probieren Sie es aus:

Versuchen Sie im folgenden Simulator, verschiedene „Entschlüsselungs-Codebücher" zu wechseln, um dieselbe zugrunde liegende Byte-Sequenz zu lesen.

<GarbledTextDemo />

**Kernerkenntnis: Nicht übereinstimmende Codebücher**

Bytes (Folgen aus 0 und 1) haben an sich keine absolute Bedeutung — erst die von Menschen festgelegten **Kodierungsregeln** verleihen ihnen Bedeutung.

Das ist wie eine Morsecodesequenz „Di-Di-Dah": Wenn Sie im chinesischen Telegrafen-Codebuch nachschlagen, ergibt sich ein Zeichen; schlagen Sie im US-Militärcodebuch nach, ergibt sich ein anderes.

**Der Absender hat die chinesischen Schriftzeichen mit dem UTF-8-Codebuch in Zahlen übersetzt und Ihnen geschickt. Wenn Sie hartnäckig das GBK-Codebuch verwenden, um diese Zahlen zu deuten, ist das Ergebnis natürlich reiner Zeichensalat.**

Um zu verstehen, warum unbeschädigte Daten zu Zeichensalat werden, müssen wir die gesamte Verarbeitungskette der Daten kennen. Das „Leben" der Daten: **Kodierung**, **Speicherung**, **Übertragung**.

---

## 1. Überblick über Datenkodierung (Abbildung der realen Welt auf Zahlen)
Einfach ausgedrückt:

> **Datenkodierung (Encoding)** ist das Erstellen eines „zweisprachigen Wörterbuchs", das die vielfältigen Informationen der realen Welt (Text, Farben, Klänge) in Regeln übersetzt, die der Computer als 0 und 1 verstehen kann.

### 1.1 Text in Zahlen verwandeln: Von ASCII zum Universalcode

Jedes Mal, wenn wir in WeChat eine Nachricht tippen, führt der Computer im Hintergrund unaufhörlich eine Aktion aus: **Tabellennachschlag und Ersetzung**.

**Phase 1: Die kleine Welt von ASCII**

In den frühen Tagen der Computerentwicklung dachten die Amerikaner, die Welt bestünde nur aus 26 Buchstaben, Ziffern und einigen Satzzeichen. Also erstellten sie ein sehr dünnes Codebuch namens **ASCII-Code**.

Es definierte nur 128 Zeichen, beispielsweise dass die Zahl `65` den Großbuchstaben `A` darstellt. Da die Zeichen so wenige waren, reichte **1 Byte (8 Bits)** mit seinen 256 Kombinationsmöglichkeiten locker aus.

**Phase 2: Die Zeit der zersplitterten Kodierungen**

Später verbreiteten sich Computer weltweit. Man stellte fest: **Chinesische Schriftzeichen gibt es zigtausend, Japanisch hat Silbenschriften — das passt alles nicht in 1 Byte!**

Also entwickelte China das GBK-Codebuch (2 Bytes pro Schriftzeichen), Japan erstellte Shift_JIS... die Welt versank im Chaos. Eine in China erstellte Webseite, die an einen amerikanischen Kunden geschickt wurde, konnte auf dessen Computer ohne GBK-Wörterbuch nur als Zeichensalat dargestellt werden.

**Phase 3: Die Vereinigung unter Unicode (Universalcode)**

Schließlich setzten sich die Großen der Computerwelt zusammen und beschlossen: „Lasst uns aufhören, jeder sein eigenes Ding zu machen, und ein supergroßes Wörterbuch erstellen, das jedes Symbol der Erde enthält!" Das ist der berühmte **Unicode (Universalcode)**. Er weist jedem Schriftzeichen der Welt — sogar jedem Emoji-Ausdruck — eine eindeutige Nummer zu.

Und **UTF-8**, das Sie oft hören, ist die derzeit populärste „Speicherregel" für das Unicode-Wörterbuch. Die klügste Eigenschaft: Es ist **variabel lang** — bei englischen Buchstaben nur 1 Byte, bei chinesischen Schriftzeichen 3 Bytes, sehr platzsparend.

Probieren Sie es aus:

Geben Sie unten einige chinesische und englische Zeichen oder Emojis ein (z. B. `你好 Hello 🎉`) und sehen Sie, wie der Computer durch „Tabellennachschlag" Speicherplatz belegt.

<CharacterEncodingExplorer />

**Überraschende Entdeckung**:

- Ein englischer Buchstabe belegt in UTF-8 nur **1 Byte**.
- Ein gewöhnliches chinesisches Schriftzeichen belegt in der Regel **3 Bytes**.
- Ein Emoji-Ausdruck (🎉) benötigt sogar **4 Bytes**!

> **Wussten Sie schon?** Warum können bei gleich langer SMS viel mehr englische als chinesische Zeichen verschickt werden? Weil in der zugrunde liegenden Signalsequenz die physische Größe eines chinesischen Schriftzeichens dreimal so groß ist wie die eines englischen Buchstabens!

### 1.2 Überblick über Bild- und Audiokodierung
Text lässt sich per Tabellennachschlag übersetzen. Aber was ist mit dem Lächeln der Mona Lisa oder einem Song? Wie werden sie zu 0 und 1?

Die Methode ist dieselbe: **Zerstückeln und abbilden**.

* **Bildkodierung**:
  Ein Foto endlos vergrößert besteht eigentlich aus Millionen winziger leuchtender Quadrate (Pixel). Wir ordnen einfach jeder Farbe eine Nummer zu (z. B. `#FF0000` für Rot), speichern die Nummern von Millionen Quadraten, und das Foto wird zur Zahl.

  Probieren Sie es aus: Fahren Sie mit der Maus über die kleinen Kästchen der linken Leinwand und sehen Sie, wie Bildfarben auf Hexadezimalcodes abgebildet werden.
  <ImageEncodingDemo />

* **audiokodierung**:
  Schall ist im Wesentlichen eine Schwingungswelle in der Luft. Wenn wir 44100 Mal pro Sekunde die Höhe dieser Welle messen (Abtastung) und die Höhenwerte aufzeichnen, wird aus der kontinuierlichen Schallwelle ein diskretes Zahlenarray.

  Probieren Sie es aus: Ziehen Sie den Schieberegler und sehen Sie, wie eine kontinuierliche analoge Schallwelle in digitales Audio „zerschnitten" wird.
  <AudioEncodingDemo />

---

## 2. Speicherbrücke: Vor dem Versenden muss die Daten irgendwo abgelegt werden

Nachdem die Daten kodiert sind, sollen sie an jemand anderen geschickt werden. Doch vorher müssen sie auf einem physischen Medium des Computers abgelegt werden. Dabei gibt es ein unvermeidliches Hardware-Gesetz.

Sie denken vielleicht: **„Wenn man sie ohnehin speichern muss, warum nicht alles auf dem schnellsten Speichermedium?"**

In der Hardware-Welt gibt es jedoch einen Fluch: **Je schneller das Speichermedium, desto teurer ist es in der Herstellung und desto geringer ist die Kapazität.**

Um mit möglichst wenig Geld eine möglichst schnell laufende Computererfahrung zu bieten, entwarfen Informatiker die **Speicherhierarchie** (die sogenannte Speicherpyramide).

Probieren Sie es aus:

Klicken Sie auf die verschiedenen Ebenen der Pyramide und sehen Sie, wie ein moderner Computer haushält.

<StoragePyramidDemo />

**Kernerkenntnis: Die Logistik-Philosophie des Betriebssystems**

Es gibt keinen perfekten Speicher. Daher funktioniert das Betriebssystem (wie Windows, macOS) wie ein extrem intelligenter, unermüdlicher Lagerverwalter:

1. Es packt riesige Mengen an Filmen und Spielen in den langsamen, aber großen (günstigen) Lagerraum — **SSD oder Festplatte**.
2. Wenn Sie ein Spiel starten wollen, eilt es, die entsprechenden hochauflösenden Texturdateien von der Festplatte auf den extrem schnellen, aber begrenzten Arbeitstisch — **den Arbeitsspeicher (RAM)** — zu schaffen.
3. Wenn Sie das Spiel beenden, leert es den Arbeitsspeicher und macht Platz für andere Dateien.

> **Erklärung**: Wenn Sie bei einem großen Open-World-Spiel bei Szenenwechseln lange schwarze Bildschirme sieht (Ladebildschirm), liegt das im Wesentlichen daran, dass der Festplatten-Lagerraum zu langsam ist und der Logistiker (das System) verzweifelt die Daten der nächsten Karte auf den Arbeitsspeicher-Arbeitstisch schaufelt.

---

## 3. Überblick über Datenübertragung (Übermittlung der digitalen Signale)
Die Daten sind kodiert und im Arbeitsspeicher abgelegt — jetzt sollen sie an einen Freund geschickt werden.

> **Datenübertragung** ist der Vorgang, bei dem die elektrischen (oder optischen) Signale, die 0 und 1 repräsentieren, über Netzwerkkabel, Glasfaser oder Funkwellen korrekt von einem Gerät zu einem anderen gelangen.

### 3.1 Hardware- und LAN-Übertragung: Die physischen Grenzen eines Kabels

Innerhalb des Gehäuses oder zwischen zwei nah beieinander stehenden Computern stehen wir vor einer **rein physikalischen Herausforderung**.

Viele denken zuerst: „Ein Kabel sendet ein Signal nach dem anderen — wenn ich 8 Kabel parallel lege, ist die Geschwindigkeit 8-mal so hoch!"
Das war die Grundidee der früheren **Parallelübertragung**, die zum Anschluss von Festplatten verwendet wurde.

Heute verwenden jedoch alle Type-C-Anschlüsse von Smartphones, externen USB-Anschlüsse und internen PCIe-Schnittstellen auf dem Mainboard ausschließlich **Serienübertragung (Serial, nur ein Hauptkanal für die Datenübertragung)**.

Probieren Sie es aus:
Vergleichen Sie die Animationen der seriellen und parallelen Übertragung.

<DataTransmissionDemo />

**Warum hat die „einspurige Landstraße" die „achtspurige Autobahn" besiegt?**

Bei niedrigen Geschwindigkeiten sind 8 Kabel tatsächlich überlegen. Doch wenn wir Milliarden von Signalen pro Sekunde senden müssen, treten Probleme auf:
Die schwachen Ströme auf den parallel verlegten Kabeln erzeugen starke elektromagnetische Felder, die sich gegenseitig stören (Crosstalk); und es ist physikalisch unmöglich zu garantieren, dass 8 gleichzeitig gesendete Signale auch **exakt gleichzeitig** am Ziel ankommen. Wenn auch nur ein einziges Kabel aufgrund von Materialverunreinigungen minimal langsamer ist, sind die 8 zu einem Wort zusammengefügten Bits völlig durcheinander.

Anstatt astronomische Summen für die Feinabstimmung von 8 Rennstrecken auszugeben, ist es besser, alle technischen Ressourcen auf ein einziges Rennfahrzeug zu konzentrieren und es auf Lichtgeschwindigkeit zu beschleunigen. Das ist die physikalische Wahrheit hinter dem weltweiten Sieg der seriellen Schnittstellen.

### 3.2 WAN- und Internetübertragung: Die Kunst des verlustfreien Transports über Ozeane hinweg

Was aber, wenn Ihre Daten nicht an eine Grafikkarte einen Zentimeter entfernt im Gehäuse geschickt werden sollen, sondern an einen Server in den USA, auf der anderen Seite des Ozeans?

Ein durchgehendes Kabel ist unmöglich. Die Daten müssen durch Glasfaserkabel, Untersee-Basisstationen und unzählige alte Router. Jetzt geht es nicht mehr um physikalische Grenzen, sondern um die **Herausforderung der Fehlervermeidung und Datensicherung**.

Wenn Sie über WeChat ein 1 GB großes Video senden, ähnelt die zugrunde liegende Logik einem internationalen Umzug — Sie können den gesamten Container nicht einfach der Post übergeben.

1. **Paketierung (Packetization)**: Das Netzwerk schneidet das Video in zehntausende briefumschlaggroße „Datenpakete" (normalerweise 1500 Bytes).
2. **Prüfsumme (Checksum)**: Um zu verhindern, dass ein von einem Hai angebissenes Unterseekabel ein `0` in ein `1` umdreht, berechnet das System vor dem Versand mit einer komplexen mathematischen Formel eine „Prüfsumme" und klebt sie auf den Umschlag.
3. **TCP-Neusendung und Bestätigung**: Der Empfänger nimmt den Umschlag und rechnet die Prüfsumme selbst nach. Stimmt sie nicht (Beschädigung auf dem Weg) oder springt die Sequenznummer von 31 direkt auf 33 (Paketverlust), ruft er über das Netz: **„Ich habe Nummer 32 nicht erhalten, bitte senden Sie Nummer 32 noch einmal!"**

Gerade weil es dieses extrem rigorose Paketierungs- und Abrechnungssystem namens **TCP (Transmission Control Protocol)** auf der untersten Ebene gibt, ist eine per WeChat heruntergeladene Datei — selbst im Keller oder bei extrem instabilem WLAN und selbst nach einer halben Stunde Download — im Moment der Fertigstellung zu 100 % intakt und ohne jegliche Beschädigung.

---

## 4. Praxisbeispiel: Fotoaufnahme bis Cloud-Speicher
Bisher haben wir „Übersetzung in Zahlen (Kodierung)", „Aufbewahrung (Speicherung)" und „Verlustfreier Transport (Übertragung)" separat behandelt.

Nun lassen Sie uns diese Bausteine zusammensetzen und einen alltäglichen Vorgang hautnah miterleben: **Ein Foto aufnehmen und automatisch in der Cloud sichern.**

In der Sekunde, in der Sie den Auslöser drücken, beginnt im Inneren des Smartphones bereits eine epische digitale Schlacht.

Probieren Sie es aus:

Klicken Sie auf „Diesen Schritt ausführen" und verfolgen Sie die abenteuerliche vollständige Lebensreise dieser Daten.

<PhotoUploadJourneyDemo />

---

## 5. Glossar

Wenn Sie andere Dokumente lesen, könnten Sie auf folgenden Fachjargon stoßen. Hier ist eine Schnellreferenztabelle für Sie:

| Begriff / Abkürzung | Deutsche Übersetzung | Einfache Erklärung |
| :--- | :--- | :--- |
| **Bit (b)** | Bit / Stelle | Die kleinste Einheit in der Computerwelt, kann nur 0 oder 1 sein. |
| **Byte (B)** | Byte | 8 Bits zusammengefasst ergeben ein Byte. Die grundlegendste Maßeinheit für Dateigrößen. |
| **Character Set** | Zeichensatz | Wie das „Inhaltsverzeichnis eines Wörterbuchs" — legt fest, dass ein bestimmtes Zeichen existiert, ohne zu definieren, wie es konkret auf der Festplatte gespeichert wird. |
| **Encoding** | Kodierung | Die konkrete „Speicherregel", die bestimmt, welchen Bytes das Zeichen im Wörterbuch entspricht (z. B. UTF-8). |
| **RAM** | Arbeitsspeicher | Ein extrem schneller, aber beim Ausschalten gelöschter Arbeitstisch. Die 8G/16G-Spezifikation Ihres Smartphones bezieht sich darauf. |
| **SSD** | SSD-Festplatte | Das moderne Lager des Computers zur dauerhaften Datenspeicherung, basierend auf Flash-Speicherchips, zig-mal schneller als alte Festplatten. |
| **Serial / Parallel** | Seriell / Parallel | Seriell: Ein Kanal, bei dem die Daten hintereinander flitzen; Parallel: Mehrere Kanäle, die gleichzeitig vorankommen (aber bei sehr hohen Frequenzen ungeeignet). |
| **Checksum** | Prüfsumme | Ein Verify-Code, der bei der Datenübertragung beiliegt. Der Empfänger rechnet ihn nach — stimmt er mit dem auf dem Paket angegebenen überein, ist alles in Ordnung. |
| **TCP** | Transmission Control Protocol | Das Fundament des Internets. Zuständig für das Aufteilen großer Dateien, das Anbringen von Sequenznummern und das erneute Senden verlorener Pakete, um eine 100% korrekte Zustellung zu garantieren. |

---

## Zusammenfassung

Die vielen Fragen, die zu Beginn des Artikels gestellt wurden, können Sie nun aus der Perspektive der Systemgrundlagen beantworten:

- **Warum wird dieselbe Datei bei Ihnen zu Zeichensalat?**
  Die Daten sind nicht beschädigt — Ihre Lesesoftware hat lediglich das falsche Codebuch (Kodierungsproblem) verwendet.

- **Warum sind die meisten Kabel hinter modernen Computern nur ein schmales Type-C-Kabel, das dennoch schneller ist als frühere breite Kabel?**
  Weil früher mehrere Pferdewagen nebeneinander langsam fuhren und leicht kollidierten (Parallelübertragung), während heute ein Hochgeschwindigkeitszug auf einer eigenen Strecke rast (Serienübertragung).

- **Warum gibt es bei großen Spielen lange schwarze Bildschirme beim Laden von Szenen?**
  Weil die oft dutzende GB großen Dateien aus dem langsamen Lager (Festplatte) verzweifelt auf den schnellen, aber teuren Arbeitstisch (Arbeitsspeicher) geschafft werden müssen.

Die Essenz des Computers ist eigentlich sehr schlicht:

**Es ist nichts weiter als eine Maschine, die alle visuellen und textuellen Informationen „übersetzt (kodiert)", auf einem Siliziumchip „aufbewahrt (speichert)" und sie dann in elektrische Impulse zerschnitten „verschickt (überträgt)".**

Wenn Sie diesen sich ewig wiederholenden Kreislauf verstanden haben, halten Sie wirklich den Schlüssel in der Hand, der das Tor zu den Grundlagen der Informatik öffnet.
