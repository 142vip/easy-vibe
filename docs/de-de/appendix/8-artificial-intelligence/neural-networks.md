# Neuronale Netze: Grundlagen

::: tip Vorwort
**Neuronale Netze sind der Motor der KI-Revolution.** Von ChatGPTs Sprachverständnis bis zur Bilderkennung beim autonomen Fahren – hinter allem stehen neuronale Netze. Das ist keine Magie, sondern ein ausgeklügeltes mathematisches Framework – es „lernt" aus großen Datenmengen die Abbildung von Eingabe auf Ausgabe. Das Grundprinzip zu verstehen hilft dir, KI-Werkzeuge besser zu nutzen und Fehler zu beheben.
:::

**Was lernst du in diesem Artikel?**

Nach diesem Kapitel wirst du:

- **Kernkonzepte**: Die Grundprinzipien von Neuronen, Schichten, Forward Propagation und Backpropagation verstehen
- **Netzwerktypen**: Die Eigenschaften und Einsatzszenarien von CNN, RNN, Transformer und anderen gängigen Architekturen kennen
- **Trainingsprozess**: Verstehen, wie das Modell aus Daten „lernt"
- **Schlüsseltechniken**: Praktische Konzepte wie Overfitting, Lernrate und Regularisierung beherrschen
- **Entwicklungspfad**: Den Evolutionsprozess vom Perzeptron bis zu großen Sprachmodellen kennen

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | Vom Neuron zum Netzwerk | Perzeptron, Aktivierungsfunktion, Forward Propagation |
| **Kapitel 2** | Wie das Netzwerk lernt | Loss-Funktion, Gradientenabstieg, Backpropagation |
| **Kapitel 3** | Gängige Netzwerkarchitekturen | CNN, RNN, Transformer |
| **Kapitel 4** | Die Kunst des Trainings | Overfitting, Regularisierung, Hyperparameter-Tuning |
| **Kapitel 5** | Entwicklungsgeschichte und Zukunft | Vom Perzeptron zu GPT |

---

## 1. Vom Neuron zum Netzwerk

### Einzelnes Neuron

Die kleinste Einheit des neuronalen Netzes ist das **Neuron**. Es simuliert die Arbeitsweise eines biologischen Neurons: Empfängt mehrere Eingangssignale, summiert sie gewichtet und erzeugt über die Aktivierungsfunktion eine Ausgabe.

```
Eingabe x1 -> xw1 -+
Eingabe x2 -> xw2 -+-> Sigma(gewichtete Summe) + b(Bias) -> f(Aktivierungsfunktion) -> Ausgabe
Eingabe x3 -> xw3 -+
```

Mathematischer Ausdruck: **y = f(w1x1 + w2x2 + w3x3 + b)**

<NeuronDemo />

### Aktivierungsfunktion: Motivation von braucht man Nichtlinearität

Ohne Aktivierungsfunktion ware jede Uberlagerung von Neuronen-Schichten letztlich aquivalent zu einer linearen Transformation (Matrixmultiplikation). Die Aktivierungsfunktion fuhrt **Nichtlinearitat** ein und ermoglicht dem Netzwerk, komplexe Muster zu lernen.

| Aktivierungsfunktion | Formel | Eigenschaften | Haufige Verwendung |
|---------|------|------|---------|
| ReLU | max(0, x) | Einfach, effizient, schnelles Training | Standardwahl fur versteckte Schichten |
| Sigmoid | 1/(1+e^(-x)) | Ausgabe 0~1 | Ausgabeschicht fur binare Klassifikation |
| Tanh | (e^x-e^(-x))/(e^x+e^(-x)) | Ausgabe -1~1 | Haufig in RNNs verwendet |
| Softmax | e^xi/Sigma e^xj | Ausgabe als Wahrscheinlichkeitsverteilung | Ausgabeschicht fur Mehrklassen-Klassifikation |

### Vom Neuron zum Netzwerk

Mehrere Neuronen zu **Schichten** organisieren, mehrere Schichten hintereinander schalten – das ergibt ein neuronales Netz:

```
Eingabeschicht       Versteckte Schicht 1  Versteckte Schicht 2  Ausgabeschicht
(Merkmale)           (niedrige Merkmale)   (hohe Merkmale)       (Vorhersage)

 x1 -->  [o o o o] --> [o o o] -->  [o o]
 x2 -->  [o o o o] --> [o o o] -->  Katze/Hund
 x3 -->  [o o o o] --> [o o o]
```

| Konzept | Beschreibung |
|------|------|
| Eingabeschicht | Empfangt Rohdaten (Bildpixel, Textvektoren usw.) |
| Versteckte Schicht | Mittlere Verarbeitungsschicht, je mehr Schichten, desto „tiefer" das Netz (das „Deep" in Deep Learning) |
| Ausgabeschicht | Erzeugt die endgultige Vorhersage (Klassifikationswahrscheinlichkeiten, Regressionswerte usw.) |
| Forward Propagation | Der Prozess, bei dem Daten schichtweise von der Eingabe- zur Ausgabeschicht fließen |

::: tip Warum heisst es „Deep" Learning?
Traditionelles maschinelles Lernen hat meist nur 1-2 Schichten. Wenn die Anzahl der versteckten Schichten auf Dutzende oder sogar Hunderte ansteigt, spricht man von „Deep" Learning. Tiefere Netzwerke konnen abstraktere Merkmale lernen: Schicht 1 lernt Kanten, Schicht 2 Texturen, Schicht 3 Teile, tiefere Schichten lernen „Das ist eine Katze".
:::

---

## 2. Wie das Netzwerk lernt

Das „Lernen" neuronaler Netze ist im Kern ein **Optimierungsproblem**: Finde eine Menge von Gewichten (w) und Bias-Werten (b), sodass die Vorhersage des Netzwerks moglichst nahe an der richtigen Antwort liegt.

### Die drei Trainingsschritte

```
1. Forward Propagation: Daten eingeben, Vorhersage erhalten
2. Loss berechnen: Mit der Loss-Funktion die Abweichung zwischen Vorhersage und tatsachlichem Wert messen
3. Backpropagation: Anhand des Loss den Gradienten jedes Gewichts berechnen, Gewichte aktualisieren
   |
   Obige Schritte wiederholen, bis der Loss klein genug ist
```

### Loss-Funktion: Messen, „wie falsch" die Vorhersage ist

Die Loss-Funktion quantifiziert die Abweichung zwischen Vorhersage und tatsachlichem Wert. Das Trainingsziel ist die Minimierung des Loss.

| Loss-Funktion | Kurzformel | Einsatzszenario |
|---------|---------|---------|
| MSE (Mean Squared Error) | Mittelwert der quadrierten Differenzen | Regression |
| Cross-Entropy | -Sigma y*log(y_hat) | Klassifikation |
| Binary Cross-Entropy | Binarversion der Cross-Entropy | Binare Klassifikation |

### Gradientenabstieg: Den tiefsten Punkt finden

Stell dir vor, du stehst mit verbundenen Augen auf einem Berg und musst zum tiefsten Punkt gelangen. Du kannst nur **die Steigung unter deinen Fussen ertasten und einen Schritt bergab machen**. Das ist Gradientenabstieg.

```
Loss-Wert
  ^
  |    /\
  |   /  \      <- Aktuelle Position
  |  /    \    Pfeil nach unten: entlang des Gradienten absteigen
  | /      \/   <- Lokales Minimum
  |/            \/  <- Globales Minimum
  +-------------> Gewichtswert
```

| Konzept | Beschreibung |
|------|------|
| Gradient | Die partielle Ableitung der Loss-Funktion nach jedem Gewicht, zeigt an, „in welche Richtung angepasst werden muss, um den Loss zu reduzieren" |
| Lernrate | Wie gross jeder Schritt ist. Zu gross: springt uber das Minimum. Zu klein: zu langsame Konvergenz |
| Batch-Grosse | Wie viele Samples pro Gradientenberechnung. Gesamter Datensatz: zu langsam. Einzelnes Sample: zu verrauscht. Mini-Batch: der Kompromiss |

### Backpropagation: Der Triumph der Kettenregel

Backpropagation ist ein effizienter Algorithmus zur Gradientenberechnung. Er nutzt die **Kettenregel** der Analysis und berechnet von der Ausgabeschicht aus schichtweise ruckwarts den Beitrag jedes Gewichts zum Loss.

```
Forward Propagation: Eingabe -> Versteckte Schicht 1 -> Versteckte Schicht 2 -> Ausgabe -> Loss
Backpropagation:     Loss -> Ausgabe -> Versteckte Schicht 2 -> Versteckte Schicht 1 -> Alle Gewichte aktualisieren
```

::: tip Intuitives Verstandnis der Backpropagation
Stell dir das neuronale Netz als Fliessband vor. Ein Produkt (Vorhersage) hat einen Fehler (hoher Loss). Du musst vom letzten Arbeitsschritt aus ruckwarts prufen, wie viel jeder Arbeitsschritt (jede Gewichtsschicht) zum Endfehler beigetragen hat, und dann entsprechend dem Beitrag anpassen. Grosser Beitrag -> starkere Anpassung, kleiner Beitrag -> geringere Anpassung.
:::

---

## 3. Gangige Netzwerkarchitekturen

Verschiedene Datentypen erfordern verschiedene Netzwerkarchitekturen. Die richtige Architektur zu wahlen, halbiert den Aufwand.

<NetworkLayersDemo />

### 3.1 CNN (Convolutional Neural Network)

CNN ist der Konig der Bildverarbeitung. Kerngedanke: Ein kleiner Faltungskern gleitet uber das Bild und extrahiert lokale Merkmale.

```
Eingabebild -> [Faltungsschicht -> Aktivierung -> Pooling] x N -> Vollstandig verbundene Schicht -> Ausgabe
  28x28        Extrahiert Kanten/Texturen/Formen             Klassifikationsergebnis
```

| Eigenschaft | Beschreibung |
|------|------|
| Lokale Verbindungen | Jedes Neuron betrachtet nur einen kleinen Bereich, nicht das gesamte Bild |
| Parameter-Sharing | Derselbe Faltungskern wird auf dem gesamten Bild wiederverwendet, drastische Parameterreduktion |
| Translationsinvarianz | Katze links oder rechts im Bild – beides wird erkannt |
| Hierarchische Merkmale | Flache Schichten lernen Kanten, tiefe Schichten Semantik |

Reprasentative Modelle: LeNet, AlexNet, VGG, ResNet, EfficientNet

### 3.2 RNN (Recurrent Neural Network)

RNNs sind speziell fur **sequenzielle Daten** entwickelt. Ihr versteckter Zustand wird an den nachsten Zeitschritt weitergegeben und verleiht dem Netzwerk ein „Gedachtnis".

```
Zeitschritt t1    Zeitschritt t2    Zeitschritt t3
 "Ich"  -->       "mag"    -->      "Katzen"
  |                |                 |
 [h1]  -->       [h2]    -->       [h3] --> Ausgabe
  ^                ^                 ^
 Versteckter Zustand wird zwischen Zeitschritten weitergegeben (Gedachtnis)
```

| Variante | Gelostes Problem | Kernmechanismus |
|------|-----------|---------|
| Ursprungliches RNN | Grundlegende Sequenzmodellierung | Einfache rekurrente Verbindung |
| LSTM | Verschwindender Gradient bei langen Sequenzen | Forget-Gate, Input-Gate, Output-Gate |
| GRU | LSTM hat zu viele Parameter | Vereinfacht zu Reset-Gate und Update-Gate |
| Bidirektionales RNN | Kann nur die Vergangenheit sehen | Gleichzeitig vorwarts und ruckwarts verarbeiten |

::: tip Der Gating-Mechanismus von LSTM
Die Raffinesse von LSTM liegt in drei „Gates": Das **Forget-Gate** entscheidet, welche alten Erinnerungen verworfen werden, das **Input-Gate**, welche neuen Informationen gespeichert werden, und das **Output-Gate**, welche Inhalte ausgegeben werden. Wie beim Lesen eines Buches: Du merkst dir selektiv die wichtigen Handlungsstrange und vergisst unwichtige Details.
:::

### 3.3 Transformer: Attention ist alles

Das 2017 von Google veroffentlichte Paper "Attention Is All You Need" fuhrte den Transformer ein und veranderte die KI-Welt grundlegend. Es ersetzt die rekurrente Struktur durch den **Self-Attention-Mechanismus** und ist die Grundlage von GPT, BERT, Claude und anderen grossen Modellen.

```
Eingabesequenz -> Embedding + Positionskodierung -> [Multi-Head Attention -> Feedforward] x N -> Ausgabe
                                                         ^
                                            Jedes Wort kann alle anderen „sehen"
```

| Vorteil | Beschreibung |
|------|------|
| Parallele Berechnung | Anders als RNNs muss der Transformer nicht schrittweise verarbeiten, sondern kann die gesamte Sequenz parallel bearbeiten |
| Langdistanzabhangigkeiten | Direkte Verbindung zwischen beliebigen zwei Positionen, unbegrenzt durch Distanz |
| Skalierbarkeit | Je grosser das Modell, je mehr Daten, desto besser die Ergebnisse (Scaling Law) |

**Die Intuition von Self-Attention**: Im Satz „Die Katze sitzt auf der Matte, weil **sie** mude ist" muss „sie" auf „Katze" verweisen, um die Bedeutung zu verstehen. Self-Attention lasst das Modell diese Assoziation lernen – es berechnet fur jedes Wortpaar in der Sequenz einen „Relevanz-Score".

<NetworkArchitectureDemo />

## 4. Die Kunst des Trainings

Eine gute Architektur allein reicht nicht – beim Training lauern viele Fallstricke.

### 4.1 Overfitting vs. Underfitting

| Problem | Symptom | Ursache | Losung |
|------|------|------|---------|
| Overfitting | Trainingsset gut, Testset schlecht | Modell zu komplex, „lernt Antworten auswendig" statt Muster zu erkennen | Regularisierung, Dropout, Data Augmentation, Early Stopping |
| Underfitting | Sowohl Trainingsset als auch Testset schlecht | Modell zu einfach, kann keine Muster lernen | Modellkapazitat erhohen, langer trainieren, bessere Merkmale |

```
Fehler
  ^
  | \  Trainingsfehler         Testfehler  /
  |  \                                   /
  |   \-----------------------/
  |     Underfitting <- Optimaler Punkt -> Overfitting
  +-------------------------------------> Modellkomplexitat
```

### 4.2 Wichtige Hyperparameter

Hyperparameter sind Parameter, die vor dem Training manuell festgelegt werden mussen (nicht vom Modell selbst gelernt):

| Hyperparameter | Funktion | Typischer Bereich | Tuning-Tipp |
|--------|------|---------|---------|
| Lernrate | Schrittweite pro Update | 1e-5 ~ 1e-1 | Wichtigster Hyperparameter, meist ab 1e-3 starten |
| Batch-Grosse | Samples pro Trainingsschritt | 16 ~ 512 | Grosser = stabileres Training, aber mehr VRAM |
| Epochen (Epoch) | Durchlaufe des gesamten Datensatzes | 10 ~ 100+ | Mit Early Stopping kombinieren, aufhoren wenn Validierung stagniert |
| Optimierer | Strategie der Gradientenaktualisierung | Adam, SGD | Adam ist die Standardwahl, SGD+Momentum fur Feintuning |

### 4.3 Regularisierungstechniken

Gangige Mittel gegen Overfitting:

| Technik | Prinzip | Verwendung |
|------|------|---------|
| Dropout | Schaltet wahrend des Trainings zufallig Neuronen ab | Typischerweise p=0.1~0.5 |
| Weight Decay | Fugt dem Loss eine Strafe fur grosse Gewichte hinzu | L2-Regularisierung, lambda=1e-4 |
| Data Augmentation | Zufallige Transformationen der Trainingsdaten (Spiegeln, Zuschneiden, Drehen) | Unverzichtbar fur Bildaufgaben |
| Early Stopping | Training beenden, wenn der Validierungs-Loss nicht mehr sinkt | patience=5~10 |
| Batch Normalization | Standardisiert die Eingangsverteilung jeder Schicht | Beschleunigt Konvergenz, leichter Regularisierungseffekt |

::: tip Erfahrungsregeln fur das Training
1. Zuerst mit kleinem Datensatz den gesamten Ablauf durchlaufen, um Code-Bugs auszuschliessen
2. Von einem vortrainierten Modell aus Fine-Tuning betreiben, nicht von Grund auf trainieren
3. Die Lernrate ist der Hyperparameter, in den sich die meiste Tuning-Zeit lohnt
4. Wenn der Trainings-Loss nicht sinkt: zuerst Daten und Code prufen, dann das Modell hinterfragen
:::

---

## 5. Entwicklungsgeschichte und Zukunft

Die Entwicklung neuronaler Netze durchlief mehrere „Winter" und „Renaissancen", jeder Durchbruch basierte auf entscheidenden technologischen Innovationen.

| Jahr | Meilenstein | Entscheidender Durchbruch |
|------|--------|---------|
| 1958 | Perzeptron | Erstes neuronales Netzwerkmodell, nur lineare Probleme losbar |
| 1986 | Backpropagation-Algorithmus | Ermoglichte das Training mehrschichtiger Netzwerke |
| 1998 | LeNet (CNN) | Faltungsnetzwerke feierten grosse Erfolge bei der Handschrifterkennung |
| 2012 | AlexNet | Tiefe CNNs ubertrafen traditionelle Methoden bei ImageNet deutlich, Deep-Learning-Explosion |
| 2014 | GAN (Generative Adversarial Networks) | Zwei Netzwerke im Wettstreit, realistische Bilderzeugung |
| 2017 | Transformer | "Attention Is All You Need", Attention-Mechanismus ersetzt RNN |
| 2018 | BERT | Pre-Training + Fine-Tuning-Paradigma, NLP-Durchbruch |
| 2020 | GPT-3 | 175 Milliarden Parameter, demonstrierte emergente Fahigkeiten grosser Modelle |
| 2022 | ChatGPT | RLHF-Alignment-Technik, KI erreicht die breite Offentlichkeit |
| 2023+ | Multimodale grosse Modelle | GPT-4V, Claude u. a., verstehen Text und Bilder gleichzeitig |

### Aktuelle Trends

| Richtung | Beschreibung |
|------|------|
| Grosse Modelle (LLM) | Parameterzahlen von Milliarden zu Billionen, emergente Fahigkeiten wie logisches Denken und Programmieren |
| Multimodal | Ein Modell verarbeitet Text, Bilder, Audio, Video |
| Effizientes Fine-Tuning | LoRA, QLoRA und andere Techniken ermoglichen auch normalen Entwicklern das Fine-Tuning grosser Modelle |
| KI-Agent | Grosse Modelle nutzen Werkzeuge, planen Aufgaben und erreichen selbststandig komplexe Ziele |
| Destillation kleiner Modelle | Wissen grosser Modelle zum Trainieren kleiner Modelle nutzen, Deployment auf Endgeraten |

::: tip Was bedeutet das fur Entwickler?
Du musst neuronale Netze nicht von Grund auf trainieren. Moderne KI-Entwicklung bedeutet eher **API-Aufrufe** (wie OpenAI, Claude API) oder **Fine-Tuning vortrainierter Modelle** (z. B. mit Hugging Face). Aber das Verstandnis der zugrunde liegenden Prinzipien hilft dir, Modelle besser auszuwahlen, Prompts zu gestalten und Probleme zu diagnostizieren.
:::

---

## Zusammenfassung

| Kernkonzept | In einem Satz |
|---------|-----------|
| Neuron | Gewichtete Summe + Aktivierungsfunktion, die kleinste Recheneinheit des Netzwerks |
| Forward Propagation | Daten fliessen schichtweise von der Eingabe zur Ausgabe und erzeugen eine Vorhersage |
| Backpropagation | Vom Loss ausgehend schichtweise Gradienten berechnen und Gewichte aktualisieren |
| CNN | Faltungskerne extrahieren lokale Merkmale, erste Wahl fur Bildverarbeitung |
| RNN/LSTM | Rekurrente Verbindungen bewahren das Gedachtnis, fur sequenzielle Daten |
| Transformer | Self-Attention ermoglicht parallele Verarbeitung, Basisarchitektur grosser Modelle |
| Overfitting | Modell „lernt Antworten auswendig", mit Regularisierung, Dropout u. a. verhindern |
| Transfer Learning | Auf den Schultern von Giganten stehen, vortrainierte Modelle per Fine-Tuning fur neue Aufgaben nutzen |

---

## Weiterfuhrende Literatur

- [3Blue1Brown - Neuronale Netze Video-Serie](https://www.3blue1brown.com/topics/neural-networks) — Die anschaulichste visuelle Erklarung
- [Stanford CS231n](http://cs231n.stanford.edu/) — Der klassische Kurs zu Convolutional Neural Networks
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) — Illustrierte Transformer-Architektur
- [Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com/) — Kostenloses Online-Lehrbuch
- [Hugging Face Kurs](https://huggingface.co/learn) — Praktische Ubungen zu Transformern und grossen Modellen