# Multimodale Modelle: Integration
> 💡 **Lernleitfaden**: Dieses Kapitel erfordert keine tiefgehenden Kenntnisse in Computer Vision. Durch interaktive Demonstrationen verstehen Sie, wie KI „Augen" bekommt. Wir enthüllen die Kernprinzipien hinter Modellen wie GPT-4V und Qwen-VL.

<VlmQuickStartDemo />

## 0. Einleitung: Dem Gehirn Augen geben

In der [Einführung in Large Language Models](./llm-principles.md) haben wir gelernt, dass ein LLM im Wesentlichen ein „Gehirn" ist, das in einer Blackbox eingesperrt ist und die Welt nur durch **Text** verstehen kann.

Die Einführung von **Multimodalen Large Models (VLM)** ist vergleichbar damit, diesem Gehirn ein Paar **Augen** zu geben.

Aber das ist nicht einfach. Denn:

- Das **Gehirn (LLM)** versteht nur **Text** (genauer gesagt Token-IDs).
- Die **Augen (Kamera)** sehen nur **Pixel** (RGB-Farbwerte).

Die Kernaufgabe eines VLM besteht darin, **„Pixelsignale" in „Textsignale" zu übersetzen**, sodass das LLM Bilder genauso einfach versteht wie Text.

---

## 1. Schritt eins: Bilder in „Wörter" verwandeln (Visuelle Tokenisierung)

Stellen Sie sich vor, Sie beschreiben einem Freund am Telefon ein Puzzle. Sie können nicht alles auf einmal sagen, Sie müssen es Stück für Stück beschreiben. Genauso verarbeitet ein Computer Bilder.

### 1.1 Patchify — Visuelle Wörter erstellen

Wir wissen, dass Large Language Models (LLMs) bei der Textverarbeitung Sätze in einzelne Token zerlegen. Wenn ein LLM Bilder „lesen" soll, ist der naheliegendste Ansatz, Bilder in eine tokenähnliche Form zu bringen.

Um dieser „wortlesenden" Natur der Large Models gerecht zu werden, benötigen wir eine Technik, die kontinuierliche zweidimensionale Bilder in diskrete Segmente umwandelt. Dies führt zum Konzept des **Patchify**: Wir zerlegen ein vollständiges 2D-Bild wie einen Tofu-Block in ein festes Raster kleiner Quadrate (Patches genannt).

- **Originalbild** = Ein vollständiger Artikel
- **Patch** = Ein Wort (Token) im Artikel

In der Praxis werden Bilder üblicherweise in feste Größen (z. B. $16 \times 16$ oder $14 \times 14$ Pixel) nahtlos unterteilt. Ein typisches Eingabebild mit $224 \times 224$ Pixeln wird so in $14 \times 14 = 196$ unabhängige Bildquadrate zerlegt.

Durch diesen Vorgang wird das ursprünglich kontinuierliche 2D-Pixel-Array physikalisch in 196 diskrete „visuelle Vokabelhefte" zerschnitten.

> 🕹️ **Interaktive Demo**: Klicken Sie auf die Schaltfläche unten, um zu erleben, wie ein Originalbild durch ein regelmäßiges Raster in einzelne Patches zerlegt wird.

<PatchifyDemo />

### 1.2 Serialisierung (Flatten) — Zu einem Satz anordnen

Nach dem Patchify-Schritt haben wir nun eine $14 \times 14$ zweidimensionale Matrix. Sowohl traditionelle Transformer als auch moderne LLMs akzeptieren jedoch in ihrer zugrunde liegenden Architektur meist nur **eindimensionale Sequenzeingaben** (d. h. eine lineare Datenstruktur, die von links nach rechts angeordnet ist).

Um den Eingabespezifikationen des Large Models zu entsprechen, müssen wir **Serialisierung (Flatten) und lineare Projektion (Linear Projection)** durchführen:
1. **Flatten**: Die mehrzeiligen Bildblöcke werden Ende-an-Ende aneinandergereiht, wodurch die 2D-Matrix zu einer eindimensionalen langen Achse mit reiner Vorwärts-Rückwärts-Reihenfolge „plattgedrückt" wird.
2. **Projektion**: Diese 196 Quadrate sind derzeit noch „rohe" RGB-Pixelhaufen. Wir benötigen ein kleines neuronales Netzwerk (in der Regel eine Fully-Connected-Schicht), um jedes Quadrat zu verarbeiten und jeweils in einen Feature-Vektor fester Länge zu komprimieren und umzuwandeln (z. B. eine Liste von 768 Zahlen).

Nach diesem Schritt wird ein Bild tatsächlich zu einer „visuellen Token-Sequenz" (Visual Token Sequence).

> 🕹️ **Interaktive Demo**: Beobachten Sie die Animation unten, um zu verstehen, wie ein **einzelner Pixelblock (Patch)** durch Matrixtransformation gedehnt und schließlich in einen hochdimensionalen **Vektor** mit reichhaltigen Feature-Dimensionen abgebildet wird.

<LinearProjectionDemo />

---

## 2. Schritt zwei: Artenübergreifende Übersetzung (Projection)

An diesem Punkt wurde das Bild zwar in eine eindimensionale, kontinuierliche Sequenz „visueller Wörter" umgewandelt, aber für das endgültige LLM ist diese Sequenz immer noch ein Haufen unlesbarer Zeichen.

Warum ist sie unlesbar? Weil die **Feature-Räume unterschiedlich** sind (d. h., sie sprechen verschiedene Sprachen).
Der Vision Encoder (z. B. ViT) extrahiert **räumliche Pixel-Features** (er kann Ihnen z. B. nur sagen: „Das ist etwas, das aus vielen gebogenen schwarzen Linien besteht" oder „Hier ist eine große rote Fläche"); das LLM hingegen versteht **tiefe semantische Features** (z. B. konzeptuelle Begriffe wie „Katze", „Bäume", „Gefahr" usw.).

Zwischen diesen beiden völlig unterschiedlichen Diskurssystemen müssen wir eine Brücke bauen — unseren modalitätsübergreifenden Übersetzer: den **Projector (Adapter)**.

### 2.1 Die Rolle des Übersetzers (Latent Space Alignment)

Der akademische Kern des Projectors besteht darin, ein **Alignment im latenten Feature-Raum (Latent Space Alignment)** zu erreichen. Es ist vergleichbar mit einem Simultandolmetscher:

- **Eingabe (Source)**: Die vom ViT ausgegebenen „visuellen Features" (mit Fokus auf Geometrie, Farben, Texturregelmäßigkeiten — kontinuierliche hochdimensionale Feature-Repräsentationen).
- **Verarbeitung (Translation)**: Der Projector nutzt eine neuronale Netzwerkstruktur (einige einfache lineare Transformationsschichten oder komplexe Attention-Schichten), um die mathematische Entsprechung zwischen den beiden Sprachen zu finden.
- **Ausgabe (Target)**: Gibt eine „LLM-Sprache" aus, die vollständig dem Geschmack und den Erwartungen des LLM entspricht (aus Bild-Features umgewandelte äquivalente Text-Embedding-Tokens, die dem Bild dialogfähige Bedeutung verleihen).

Durch diesen Übersetzungsfilter stellt das Large Model erstaunt fest: „Hm? Diese hereinkommende Zahlenfolge — ist das nicht einfach die Art von beschreibenden Wortkombinationen, die ich sonst auch lese!" — und verarbeitet so Bild-Features und natürliche Sprache nahtlos gemeinsam.

<ProjectorDemo />

### 2.2 Verschiedene Übersetzungsschulen

Um diesen „Übersetzungsprozess" des Feature-Alignments schneller und präziser zu gestalten, haben Wissenschaft und Industrie mehrere repräsentative Hardware-Verbindungsdesigns entwickelt:

1.  **Wörtliche Übersetzung (Linear Projection)**:
    - **Ansatz**: Extrem einfach und direkt — verwendet nur eine oder einige Dutzend MLP-Schichten (Multi-Layer Perceptron / Lineare Projektionsschichten) für direkte mathematische Matrixtransformation.
    - **Merkmale**: **Extrem geringer Informationsverlust, bewahrt die ursprünglichen Bilddetails**; Nachteil: Die Hunderte oder Tausende von visuellen Tokens werden ungefiltert an das Sprachmodell weitergegeben, was die nachfolgende Rechenlast explosionsartig erhöht.
    - **Vertreter**: LLaVA-Familie.

2.  **Sinngemäße Übersetzung (Q-Former / Resampler)**:
    - **Ansatz**: Keine direkte Weitergabe, sondern Einführung eines „kleinen Aufklärungsnetzwerks" mit abstrakter Zusammenfassungsfähigkeit als Vermittler. Dieser Zwischenagent erfasst zunächst schnell das gesamte Bild und destilliert einige Dutzend hochverdichtete Kernpunkte heraus.
    - **Merkmale**: **Informationen sind stark komprimiert und aufbereitet, weniger Tokens, deutlich geringere Rechenlast für das LLM**; Nachteil: Bei der Komprimierung können feinste Beobachtungshinweise an den Bildrändern verloren gehen.
    - **Vertreter**: BLIP-2, Gemini (teilweise ähnliche Mechanismen).

3.  **Kompromiss-Ansatz (C-Abstractor / Pooling)**:
    - **Ansatz**: Nutzt Convolutional Pooling oder lokale Region-Neuordnung, um benachbarte $2 \times 2$ oder größere Pixelblöcke zu einer vollständigen Repräsentationseinheit zu komprimieren und zusammenzuführen.
    - **Merkmale**: Reduziert die Token-Länge angemessen, bewahrt aber dennoch teilweise die voneinander abhängigen lokalen und räumlichen Informationen.
    - **Vertreter**: Qwen-VL-Max.

---

## 3. Schritt drei: Zusammensetzen (The Architecture)

Mit den Komponenten und dem Verbindungsstandard schauen wir uns an, wie alles zusammengebaut wird. Die gängigen multimodalen Vision-Language Models (VLMs) folgen grundsätzlich einem einheitlichen **dreistufigen Architekturmodell**.

### 3.1 Die Körperstruktur eines VLM

<ModelArchitectureComparisonDemo />

Ein typisches VLM besteht aus drei Hauptkomponenten, die zusammenarbeiten:

1.  **Das merkmalerkennende „Auge" (Vision Encoder)**:
    - **Funktion**: Als erste Eingangsstufe für Bilder ist es für das Betrachten von Bildern und das Abstrahieren hochdimensionaler visueller Merkmale zuständig.
    - **Auswahl**: Die meisten Anbieter trainieren das Auge nicht von Grund auf, sondern verwenden direkt vortrainierte, ausgereifte Komponenten (wie den Vision Tower von OpenAIs CLIP-Modell oder Googles SigLIP-Modell), die auf Hunderten Millionen von Bild-Text-Paaren trainiert wurden.
    - *Analogie: Dies ist die hochspezialisierte Photorezeptorzellregion der Netzhaut eines biologischen Organismus.*

2.  **Der signalumwandelnde „Sehnerv" (Projector — Modalitätsprojektor)**:
    - **Funktion**: Verbindet den Encoder mit dem Sprach-Backbone und ist für die Kompression der Signaldimensionen, deren Durchleitung und die multimodale semantische Übersetzung zuständig.
    - **Auswahl**: Dies ist der **wichtigste Teil** des gesamten nachfolgenden multimodalen Trainings. Die Parameteranzahl ist meist nicht groß (relativ zum LLM), aber sie entscheidet darüber, ob „Text" und „Bild" einander wirklich verstehen können.
    - *Analogie: Es gleicht dem Sehnervenzentrum, das elektrische Signale umwandelt und an die Großhirnrinde weiterleitet.*

3.  **Die kognitive Engine — das „Gehirn" (LLM Backbone)**:
    - **Funktion**: Übernimmt die abschließende Beobachtung, den Abruf von Allgemeinwissen, tiefgehendes logisches Denken und die Generierung menschenähnlicher Antworten.
    - **Auswahl**: In der Regel werden die intelligentesten Open-Source-LLMs der Branche als Basis verwendet (wie Qwen, Llama 3, Vicuna usw.).
    - *Analogie: Dies ist das Sprach- und Entscheidungszentrum des Gehirns mit einer Wissensdatenbank über die Welt. Es führt höhere kognitive Interpretationen der vom Sehnerv verarbeiteten Signale durch.*

---

## 4. Wie lernt es, Bilder zu sehen? (Training)

Gut, jetzt sind alle Körperteile zusammengenäht. Aber bevor es offiziell in Betrieb geht, befindet sich das frisch zusammengebaute VLM tatsächlich in einem neugeborenenartigen Zustand der „Blindheit und Verwirrung" — denn der neu hinzugefügte Sehnerv (Projector) ist ein unbeschriebenes Blatt voller bedeutungsloser Zufallswerte.

Um diesem zusammengeflickten Monster die Fähigkeit zu geben, Bilder zu beschreiben, hat die Wissenschaft eine effiziente **Zwei-Stufen-Trainingsmethode (Two-Stage Training)** entwickelt.

### Stufe eins: Objekterkennung (Feature Alignment — Vortraining)

Diese Stufe hat die Hauptaufgabe, dem zufällig initialisierten Projector eine erste crossmodale Abbildungsbeziehung beizubringen. Der Prozess ähnelt stark dem Auswendiglernen von Wörtern mit „Lernkarten" bei Babys.

- **Zeigen (Trainingsinput)**: Große Mengen (oft Hunderte Millionen) extrem einfacher gepaarter Bild-Text-Daten mit einem einzelnen markanten Motiv (z. B. ein „Katzen"-Foto auf weißem Hintergrund).
- **Sagen (Zielausgabe)**: Kurze beschreibende Labels („Eine orange Katze").
- **Optimierungsziel**: Den Projector durch Matrixtransformation dazu zu zwingen, die korrespondierenden visuellen Features dieser Katze (nach der Übersetzung) möglichst deckungsgleich mit dem „Katzen"-Token-Vektor der natürlichen Sprache auszurichten.
- **Parameter-Strategie (Freeze Strategy)**: Um die Intelligenz des bestehenden Modells nicht zu zerstören, werden in dieser Phase die Dutzenden oder Hunderte Milliarden Parameter von „Auge" (ViT) und „Gehirn" (LLM) stark **eingefroren (Freeze)** — **nur die wenigen Millionen Parameter des „Sehnervs" (Projector) werden trainiert**.

<FeatureAlignmentDemo />

### Stufe zwei: Dialog (Visual Instruction Tuning)

Während die erste Stufe das Modell nur zu einer Art „Benennmaschine" macht, besteht die Aufgabe der zweiten Stufe darin, seine höhere Intelligenz zu aktivieren, sodass es wirklich kontextbezogen auf komplexe menschliche Anweisungen mit Bild-Text-Kombinationen antworten kann.

- **Zeigen (Trainingsinput)**: Sorgfältig gestaltete, hochwertige Frage-Antwort-Trainingspaare. Zum Beispiel ein komplexes Panoramabild des Stadtverkehrs.
- **Antwort verlangen (Zielausgabe)**: User fragt: „`<Bild>` Trägt der Mann auf dem weißen Fahrrad in der unteren linken Ecke einen Helm?" Assistant antwortet: „Nein, er trägt nichts auf dem Kopf, was im Stadtverkehr sehr gefährlich ist."
- **Optimierungsziel**: Das Large Model soll nicht nur visuelle Hinweise aufnehmen können, sondern auch früher angesammeltes Allgemeinwissen einbeziehen, Textlogik mit multimodalen Repräsentationen vollständig verschmelzen und Schlussfolgerungen ziehen.
- **Parameter-Strategie (Freeze Strategy)**: Der Sehnerv ist jetzt grundsätzlich eingestellt. In dieser Feinabstimmungsphase werden in der Regel einige untere Gewichte des Vision Encoders weiterhin eingefroren, während **LLM und Projector vollständig aufgetaut werden** (oder LoRA verwendet wird) für eine globale, groß angelegte gemeinsame Backpropagation.

<VLMInferenceDemo />

---

## 5. Fortgeschritten: Schärfer sehen (Advanced Tricks)

Obwohl die obige Architektur das anfängliche multimodale Paradigma ermöglichte, litten VLM-Modelle der ersten Generation unter einem äußerst frustrierenden grundlegenden Handicap — **Kurzsichtigkeit (angeborene Sehschwäche)**.

Frühe Vision Encoder wie ViT konnten konstruktionsbedingt nur extrem niedrig aufgelöste Bilder wie $224 \times 224$ oder $336 \times 336$ Pixel verarbeiten. Das ist, als würde man die Welt durch eine verschwommene, minderwertige Retro-Kamera mit ein paar hunderttausend Pixeln betrachten — kleinere Details wie Textschilder verschwimmen vollständig zu Pixelbrei. Selbst das intelligenteste Gehirn kann dann nichts ausrichten — „auch die beste Köchin kann ohne Zutaten nicht kochen".

Um dieses Niedrigauflösungs-Problem zu überwinden, haben führende Modell-Anbieter (wie das Qwen-VL-Team, LLaVA-NeXT usw.) einige äußerst clevere technische Ansätze entwickelt:

### 5.1 Dynamisches hochauflösendes Mapping (Dynamic High-Resolution Mapping)

Wenn die direkte Eingabe eines großen Bildes den Videospeicher sprengt und grobes Verkleinern alle Details vernichtet — wie löst man das? Der aktuelle Ansatz: eine **Dual-Perspektive-Strategie aus „lokaler Nahaufnahme + globaler Vogelperspektive"**.

1. **Gesamtüberblick**: Zuerst wird das riesige hochauflösende Originalbild direkt auf $336 \times 336$ verkleinert und dem Auge für einen ersten Blick zugeführt. So erfasst das Modell die **allgemeine Makro-Layout-Struktur** (Wo ist der Himmel? Wo ist der Boden?).
2. **Vergrößerte Ausschnitte**: Das hochauflösende Originalbild wird in dutzende unabhängige, verlustfreie lokale Nahaufnahme-Ausschnitte (Slices) von $336 \times 336$ zerschnitten.
3. **Einzelscan und räumliches Zusammensetzen**: Der Vision-Engine scannt diese dutzenden verlustfreien Ausschnitte einzeln mit der Lupe, um hochauflösende Details zu sammeln. Anschließend vernäht der Projector die Semantik dieser Detailblöcke wie ein Puzzle mit dem anfänglichen Übersichtskontext.

Das ist vergleichbar damit, ein Übersichtsfoto einer Zeitungsseite mit dem Handy zu machen (um das gesamte Layout zu erfassen) und dann das Handy dicht an die Zeitung zu halten, um dutzende Nahaufnahmen einzelner Absätze aufzunehmen.

### 5.2 Ein von Natur aus größeres Auge (Scaling the Vision Encoder)

Ein anderer Ansatz, der pure brachiale Eleganz demonstriert: Wenn das ursprüngliche Auge angeborene genetische Defekte hat, dann erschaffe ich von Grund auf ein atemberaubendes Super-Auge.

Ein klassisches Beispiel ist das herausragende chinesische Open-Source-Modell **InternVL**. Es verwirft die üblichen kleinen Vision-Modelle und trainiert von Grund auf mit massiven Ressourcen einen seltenen, supermassiven Vision-Encoder mit mehreren Milliarden Parametern (wie InternViT-6B mit 6 Milliarden Parametern) als Frontend-Backbone.
Dank seiner extremen Datenabsorptionsfähigkeit ist es von Natur aus ein „Hubble-Weltraumteleskop", das nativ hochauflösende Eingaben nahtlos unterstützt. Dieses Design reduziert drastisch die komplexen technischen Overheads und das Risiko von Fehlausrichtungen, die durch Bildzerstückelung und -zusammensetzung entstehen, und erreicht direkt eine „alles auf einen Blick"-hochauflösende visuelle Wahrnehmung.

---

## 6. Zusammenfassung

Multimodale Large Models (VLMs) sind keine Magie. Sie tun nur eine Sache:

**Sie übersetzen die „Fremdsprache" Bild in die „Muttersprache" Text und füttern sie dem LLM.**

Wenn Sie das verstanden haben, haben Sie alles über VLMs verstanden.

---

## 7. Glossar

| Begriff       | Vollständiger Name            | Erklärung                                                                                                     |
| :------------ | :---------------------------- | :------------------------------------------------------------------------------------------------------------ |
| **VLM**       | Vision-Language Model         | **Multimodales Large Model**. Eine GPT, die Bilder verstehen kann.                                            |
| **ViT**       | Vision Transformer            | **Vision Model**. Das „Auge" eines VLM, wandelt Pixel in Vektoren um.                                         |
| **Patch**     | -                             | **Bildblock**. In kleine Quadrate zerschnittenes Bild — entspricht „visuellen Wörtern".                        |
| **Projector** | -                             | **Projektor/Übersetzer**. Die Brücke zwischen Auge und Gehirn.                                                |
| **Alignment** | -                             | **Alignment**. Bild- und Text-Features so ausrichten, dass sie sich im selben Raum „gegenseitig verstehen".    |
