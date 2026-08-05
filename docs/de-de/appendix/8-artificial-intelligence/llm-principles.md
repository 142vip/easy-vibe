# LLM-Prinzipien: Sprachmodellgrundlagen
> 💡 **Lernleitfaden**: Dieses Kapitel setzt keine Programmierkenntnisse voraus. Durch interaktive Demos lernst du die grundlegende Funktionsweise von Large Language Models (LLMs) kennen – von der einfachen Tokenisierung bis hin zum Training und zur Inferenz von GPT.

<LlmQuickStartDemo />

## 0. Einleitung: Von menschlicher Sprache zur maschinellen Berechnung

Menschen kommunizieren mit Sprache, Computer rechnen mit Zahlen.
Das Wesen eines **Large Language Models (LLM)** ist eine Brücke zwischen diesen beiden Welten.

Seine Kernaufgabe ist nur eine: **Das Problem des „Sprachverstehens" in ein Problem der „mathematischen Berechnung" zu verwandeln.**

Um dieses Ziel zu erreichen, müssen drei zentrale Herausforderungen gelöst werden:

1.  **Übersetzung**: Wie verwandelt man Text in Zahlen? (Tokenisierung & Embedding)
2.  **Effizienz**: Wie bringt man den Computer dazu, schnell zu rechnen? (Matrixoperationen)
3.  **Gedächtnis**: Wie bringt man dem Computer bei, Kontext zu verstehen? (Transformer-Modell)

Dieses Tutorial führt dich Schritt für Schritt von Grund auf durch den Aufbau dieser Brücke.

---

## 1. Schritt 1: Übersetzung (Tokenisierung)

Der Computer kann die Zeichen „Hamburger" nicht lesen – er kennt nur Zahlen.
Deshalb ist unsere erste Aufgabe: **Text in die kleinsten Einheiten zu zerlegen, die der Computer verstehen kann.**

### 1.1 Was ist Tokenisierung

Tokenisierung bedeutet, einen ganzen Satz in einzelne „Worteinheiten" (Token) zu zerlegen.

- **Englisch**: Hat von Natur aus Leerzeichen, daher leicht zu tokenisieren (z. B. `I love AI`).
- **Chinesisch**: Hat keine Leerzeichen, daher werden Algorithmen zur Segmentierung benötigt (z. B. `我爱人工智能`).

#### Tokenizer (Der Übersetzer)

Das Programm, das die Tokenisierung durchführt, nennen wir **Tokenizer**.
Es fungiert wie ein Übersetzer, der menschliche Sprache in eine maschinenlesbare Zahlenfolge umwandelt.

Moderne LLMs (wie GPT-4) verwenden in der Regel **Subword-Tokenisierung** (wie den BPE-Algorithmus).
Das Clevere daran: **Häufige Wörter bleiben ganz, seltene Wörter werden zerlegt.**

Hier ein echtes Beispiel für BPE-Tokenisierung (basierend auf dem GPT-4-Tokenizer):

**Input**: `"The quick brown fox jumps over the lazy dog. \n今天天气真不错！"`

**Token-Liste**:

```text
index=791,   string='The'
index=4062,  string=' quick'
index=14198, string=' brown'
index=39935, string=' fox'
index=83368, string=' jumps'   <-- Falls zerlegt, könnte es ' jump' + 's' sein
index=927,   string=' over'
index=279,   string=' the'
index=16053, string=' lazy'
index=3290,  string=' dog'
index=13,    string='.'
index=198,   string='\n'       <-- Zeilenumbruch
index=33838, string='今天'      <-- Häufige Wörter direkt zusammengeführt
index=54580, string='天气'
index=20265, string='真'
index=57672, string='不错'
index=171,   string='！'
```

> **Zum Umgang mit seltenen Zeichen**:
> Trifft der Model auf ein unbekanntes Zeichen, das nicht in seinem Vokabular steht (angenommen, „今" sei sehr selten), fällt es auf die **Byte-Ebene** zurück.
> 1.  Roheingabe: `今`
> 2.  Bytes: `\xE4 \xBB \x8A`
> 3.  BPE-Suche: Zuerst wird `\xE4\xBB\x8A` gesucht -> nicht gefunden -> aufgeteilt in `\xE4\xBB` (ID=1001) + `\x8A` (ID=2002).
> 4.  Endgültige Token: `[1001, 2002]`.
>
> Dieser Mechanismus stellt sicher, dass **das Modell jede beliebige Eingabe verarbeiten kann und niemals ein OOV-Problem (Out Of Vocabulary) auftritt**.

<TokenizationDemo />

**Kernpunkt**: LLMs verarbeiten keine Wörter, sondern **Token-IDs** (eine Reihe numerischer Indizes).

---

## 2. Das Kernproblem: Ansatz für bringt man den Computer dazu, Sprache zu „berechnen"

Unsere Aufgabe ist es, Sprache zu verarbeiten. Aber Computer verstehen nur Zahlen.
Die naheliegendste Idee: Jedem Wort eine Nummer (ID) zuweisen.

- Apfel -> ID 10
- Banane -> ID 20

### 2.1 Warum nicht einfach IDs verwenden

Wenn wir nur IDs verwenden, würde der Computer „10" und „20" als zwei völlig zusammenhangslose Zahlen betrachten.
Zudem bräuchten wir bei einem Vokabular von 100.000 Wörtern ein 100.000 Elemente langes Array, um ein einzelnes Wort darzustellen (One-Hot-Kodierung) – 99.999 Positionen wären Nullen, nur eine einzige wäre 1.

- **Nachteil 1: Zu verschwenderisch** (dünnbesetzt, One-Hot-Arrays sind zu groß).
- **Nachteil 2: Keine Semantik** (es kann nicht ausgedrückt werden, dass „Apfel" und „Banane" beides Obstsorten sind).

### 2.2 Die Lösung: Embedding (dichte Vektoren)

Um ein Wort **effizient** und **bedeutungstragend** darzustellen, haben wir das **Embedding** erfunden.
Statt eines langen 0/1-Arrays wird ein kürzeres Array mit Dezimalzahlen (z. B. 512 Zahlen) verwendet, um ein Wort zu beschreiben.

- Zum Beispiel: `[0.8 (ist Obst), 0.1 (rot), 0.9 (süß)...]`
  So komprimieren wir nicht nur die Daten, sondern verwandeln die Wortbedeutung in berechenbare „Koordinaten".

<EmbeddingDemo />

---

## 3. Vom Wort zur Matrix

Nachdem das Problem der Darstellung „eines Wortes" gelöst ist, folgt die Darstellung „eines Satzes".

### 3.1 Warum eine Matrix

Weil ein Satz viele Wörter enthält.

- Ein Wort = eine Zahlenzeile (Vektor).
- Ein Satz = viele übereinander gestapelte Zahlenzeilen.
  Das ist eine **Matrix**.

Der Grund, warum wir Matrizen bilden, ist, dass die Kernhardware moderner Computer – die **GPU (Grafikkarte)** – von Natur aus für Matrixoperationen ausgelegt ist.
Nur indem wir Sprache in Matrizen umwandeln, können wir die parallele Rechenleistung der GPU nutzen und eine **effiziente** Inferenz und Training erreichen.

### 3.2 Die vollständige Pipeline

Rückblick auf den Datenfluss:

1.  **Tokenisierung**: Den Text zerkleinern.
2.  **Indizierung**: Die Fragmente in IDs umwandeln.
3.  **Embedding**: Die IDs in Vektoren umwandeln (für Semantik und Kompression).
4.  **Stapeln**: Die Vektoren zu einer Matrix zusammenfügen (für effiziente GPU-Berechnung).

<TokenizerToMatrix />

---

## 3.5 Exkurs: Überblick über genau ist ein „Modell"

Bevor wir uns die konkrete Architektur ansehen, wollen wir den Begriff „Modell" anschaulich verstehen.

Im KI-Bereich ist ein **Modell** im Grunde eine extrem komplexe **Funktion** oder eine **Blackbox**.

- **Eingabe**: Ein Haufen Zahlen (z. B. die oben genannten Token-IDs).
- **Verarbeitung**: In der Blackbox befinden sich Milliarden von Parametern (man kann sie sich als Abermilliarden Einstellknöpfe vorstellen), die mit den Eingabedaten wilde Additionen, Subtraktionen, Multiplikationen und Divisionen durchführen.
- **Ausgabe**: Ein anderer Haufen Zahlen (der das Vorhersageergebnis darstellt, z. B. die Wahrscheinlichkeit für das nächste Wort).

**Eine Analogie:**

Du kannst dir das Modell wie einen **erfahrenen Meisterkoch** vorstellen:

1.  **Eingabe (Zutaten)**: Du gibst ihm Rindfleisch, Kartoffeln und Tomaten.
2.  **Modell (Das Gehirn des Kochs)**: Basierend auf Tausenden von Rezepten, die er gelernt hat (Trainingsdaten), berechnet er blitzschnell im Kopf: Rindfleisch würfeln, Kartoffeln schälen, Hitze kontrollieren …
3.  **Ausgabe (Gericht)**: Am Ende serviert er einen Teller geschmorte Rinderbrust mit Kartoffeln.

Das sogenannte **Training** bedeutet, diesen Koch als Lehrling anfangen und ihn unzählige Male durch Versuch und Irrtum üben zu lassen. Ist es zu salzig, wird der „Salz-Knopf" justiert; ist es zu fade, wird der „Hitze-Knopf" angepasst – bis er zuverlässig köstliche Gerichte zubereiten kann.

Die heutigen LLMs sind Super-Köche, die „sämtliche Bücher der Menschheit gelesen" haben – nur dass sie keine Gerichte kochen, sondern Text.

## 4. Der evolutionäre Weg: Von RNN zu Transformer

Nachdem wir die Daten (Token) und den Koch (Modell) haben, stellt sich die Frage, wie dieser Koch eigentlich denkt.

In der KI-Evolutionsgeschichte gibt es hauptsächlich zwei „Denkweisen" (Architekturen): **RNN** und **Transformer**.

### 4.1 Die alte, holprige Methode: RNN (Stille-Post-Spiel)

Frühe Modelle (RNN, Recurrent Neural Networks) verarbeiteten einen Satz wie das Spiel **Stille Post**.

**Funktionsweise:**

1.  Lies das 1. Wort „Ich", merke es dir, gib es an Schritt 2 weiter.
2.  Lies das 2. Wort „mag", kombiniere es mit der vorherigen Erinnerung, aktualisiere die Information und gib sie an Schritt 3 weiter.
3.  Lies das 3. Wort „essen", aktualisiere die Erinnerung erneut …
4.  … bis das letzte Wort gelesen ist.

**Das führt zu zwei fatalen Nachteilen:**

1.  **Langsam (keine Parallelisierung)**: Jeder muss warten, bis der Vordermann seine Information weitergegeben hat. 100 Leute können nicht gleichzeitig arbeiten.
2.  **Vergesslich (Langstrecken-Gedächtnisverlust)**: Wenn die Nachricht bei der 100. Person ankommt, hat sie vielleicht schon längst vergessen, ob die erste Person „Ich" oder „Du" gesagt hat. Das führt dazu, dass Modelle bei langen Texten den roten Faden verlieren.

### 4.2 Das geniale moderne Design: Transformer (Runder Tisch)

2017 stellte Google eine völlig neue Architektur vor – den **Transformer**. Er veränderte die Spielregeln grundlegend und machte aus dem „Stille-Post-Spiel" eine **Gesprächsrunde am runden Tisch**.

**Funktionsweise:**
Der Transformer gibt die Information nicht mehr nacheinander weiter, sondern **lässt alle Wörter gleichzeitig am Tisch Platz nehmen**.

1.  **Gott-Perspektive (Parallele Berechnung)**: Alle Wörter treten gleichzeitig ein, ohne Schlange zu stehen. Jeder schreibt seine Information auf einen Zettel und legt ihn in die Tischmitte.
2.  **Aufmerksamkeitsmechanismus (Attention)**: Das ist die Geheimwaffe. Jedes Wort kann **direkt** auf die Information jedes anderen Wortes am Tisch schauen.
    - Wenn zum Beispiel das Wort „es" gelesen wird, muss das Modell sich nicht an frühere Weitergaben erinnern, sondern sieht direkt das vorherige Wort „die Katze" und versteht sofort: „es = die Katze".

**Das löst die Schwachstellen des RNN perfekt:**

- **Schnell**: Alle schauen gleichzeitig auf die Unterlagen, die GPU kann mit voller Leistung arbeiten – extrem effizient.
- **Nichts vergessen**: Egal wie lang der Satz ist, das 1. und das 10.000. Wort sind nur „einen Schritt" voneinander entfernt – jedes Wort kann jedes andere direkt ansehen.

> **Zusammengefasst**:
>
> - **RNN**: Wie ein Labyrinth, Schritt für Schritt, man verirrt sich leicht.
> - **Transformer**: Wie eine Karte aus der Gott-Perspektive, Start und Ziel sind auf einen Blick zu erfassen.

#### Motivation von brauchen wir trotzdem „Positions"-Informationen

Weil der Transformer alles „auf einmal" verarbeitet, könnte er ohne spezielle Behandlung den Unterschied zwischen „Ich liebe dich" und „Dich liebe ich" nicht erkennen (gleiche Wörter, nur andere Reihenfolge).
Deshalb geben wir jedem Wort eine **Nummernkarte (Positionskodierung)**, die dem Modell sagt, wer an 1. und wer an 2. Stelle steht.

> Kleiner Hinweis: Viele LLMs sind autoregressiv (sie sagen das nächste Wort voraus), daher geben sie bei der Generierung immer noch Token für Token aus; aber **bei jedem Generierungsschritt** kann der Transformer intern dennoch Matrix-Parallelität und Caching-Optimierung besser nutzen.

### 4.3 Effizienz-Blackbox: KV-Cache

Du hast vielleicht gehört, dass die Generierung langer Texte zum Ende hin langsamer wird oder mehr VRAM verbraucht. Das liegt meist daran, dass sich das Modell an alle zuvor generierten Inhalte „erinnern" muss.

**Wie macht sich der Transformer „Notizen"?**

Im Aufmerksamkeitsmechanismus des Transformers erzeugt jedes Wort zwei Vektoren – `Key (K)` und `Value (V)` – die von nachfolgenden Wörtern für „Abfragen" genutzt werden.

- Wenn das Modell das 100. Wort generiert, muss es auf die K und V der vorherigen 99 Wörter zurückschauen.
- Würde es jedes Mal die K und V der 99 Wörter neu berechnen, wäre das enorme Verschwendung!

**Die Rolle des KV-Cache:**

KV-Cache funktioniert wie ein **„inkrementelles Notizbuch"**.

1.  **Nichts neu berechnen**: Nach der Berechnung von K und V des 1. Worts werden sie gespeichert.
2.  **Nur Neues berechnen**: Beim Generieren des 2. Worts werden nur K und V des 2. Worts berechnet und dann mit den K, V des 1. Worts zusammengeführt.
3.  **Immer größer werdend**: Mit fortschreitendem Dialog wird dieses „Notizbuch" (VRAM-Belegung) immer dicker.

Das ist der Grund, warum lange Kontext-Dialoge (Long Context) so viel VRAM verbrauchen – **nicht weil das Modell größer wird, sondern weil die Notizen (KV-Cache) zu umfangreich werden.**

<RNNvsTransformer />

---

## 5. Enthüllt: Vom „Weiterschreiben" zum „Dialog"

Viele glauben fälschlicherweise, dass ChatGPT wirklich versteht, was wir sagen. Aber sein Instinkt ist nur einer: **Das nächste Wort erraten** (Next Token Prediction).

### 5.1 Instinkt: Wildes Weiterschreiben

Wenn du dem Basismodell (Base Model) eingibst: „Das Wetter ist heute schön", könnte es weiterschreiben mit: „Lass uns in den Park gehen."
Aber wenn du eingibst: „Was ist die Hauptstadt der USA?", könnte es weiterschreiben mit: „Was ist die Hauptstadt von China? Was ist die Hauptstadt von Japan?" (weil es das Format eines Fragenkatalogs imitiert, anstatt die Frage zu beantworten).

### 5.2 Trick: Mit einem „Drehbuch" einen Dialog führen

Um es zu einem Dialog-Assistenten zu machen, haben sich Ingenieure eine geniale Methode ausgedacht: **Rollenspiel**.
Wir fügen der Eingabe für das Modell heimlich spezielle **Tags (Template)** hinzu, sodass das Modell denkt, es schreibe ein „Dialog-Drehbuch" weiter.

Du siehst zum Beispiel:

> User: Hallo

Was das Modell tatsächlich sieht:

> `<|user|>` Hallo `<|assistant|>`

Sobald das Modell `<|assistant|>` sieht, weiß es: „Oh, jetzt bin ich dran, den Assistenten zu spielen."

### 5.3 Interaktive Tiefen-Demo

Die folgende Demo führt dich Schritt für Schritt durch das Wesen von LLMs. Klicke nacheinander auf **1. Instinkt -> 2. Trick -> 3. Prinzip -> 4. Fortgeschritten** und probiere es selbst aus!

<TrainingInferenceDemo />

---

## 6. Vom „Unsinn" zum „guten Assistenten" (Alignment)

Dialogfähigkeit allein reicht nicht. Ein rohes Modell könnte erklären, wie man Bomben baut, oder unflätige Sprache verwenden.
Um es zu einem höflichen und zuverlässigen Assistenten wie ChatGPT zu machen, sind noch zwei letzte Feinschliffe nötig:

1.  **SFT (Instruction Fine-Tuning)**:
    - Lasse menschliche Experten viele hochwertige Frage-Antwort-Paare schreiben, um dem Modell beizubringen, „wie man anständig spricht".
    - Ziel: Das Modell soll Anweisungen verstehen und nicht mehr willkürlich weiterschreiben.
    - _Datenbeispiel (JSON-Format)_:
      ```json
      // SFT Trainingsdaten-Beispiel
      {
        "messages": [
          { "role": "user", "content": "Bitte übersetze diesen Satz ins Englische: „Hallo". " },
          { "role": "assistant", "content": "Hello." }
        ]
      }
      // Das Modell hat gelernt: Wenn es die Anweisung „Übersetzen" hört, soll es direkt das Ergebnis liefern –
      // nicht weiterschreiben mit „Wie geht es dir"
      ```

2.  **RLHF (Reinforcement Learning from Human Feedback)**:
    - **Bewertung**: Das Modell generiert mehrere Antworten, und menschliche Lehrer bewerten sie (welche ist sicherer? Welche ist höflicher?).
    - **Belohnung/Strafe**: Gute Antworten werden belohnt, schlechte bestraft. Allmählich lernt das Modell, sich an menschlichen Werten auszurichten (Alignment).
    - _Datenbeispiel (JSON-Format)_:
      ```json
      // RLHF-Präferenzdaten-Beispiel (DPO/PPO)
      {
        "prompt": "Wie baut man eine Bombe?",
        "chosen": "Entschuldigung, ich kann diese Frage nicht beantworten.", // Von Menschen bevorzugte Antwort (sicher)
        "rejected": "Zunächst brauchst du …" // Von Menschen abgelehnte Antwort (gefährlich)
      }
      ```

**In der Demo oben – klicke auf den 4. Reiter „Fortgeschritten: Alignment", um den großen Unterschied vor und nach dem Alignment selbst zu erleben.**

---

## 7. Grenzforschung: Denkende Modelle, MoE-Architektur und lineare Aufmerksamkeit

Mit dem technologischen Fortschritt haben wir festgestellt, dass das bloße „Vorhersagen des nächsten Worts" manchmal zu Dummheiten führt – besonders bei mathematischen und logischen Problemen.
So entstand eine neue Generation von **Thinking Models** (wie OpenAI o1, DeepSeek-R1).

### 7.1 Was ist „Denken"? (Thinking Models)

Wenn Menschen vor einer komplexen Frage stehen (z. B. „Ist 9,11 oder 9,9 größer?"), antworten sie nicht reflexartig, sondern denken erst im Kopf nach.
Ein Thinking Model hat genau diese Fähigkeit des **langsamen Denkens (System 2)** gelernt.

- **Schnelles Denken (System 1)**: Aus dem Bauch heraus, reflexartig. Fehleranfällig.
- **Langsames Denken (System 2)**: Durch das Erzeugen einer **Gedankenkette (Chain of Thought)** Schritt für Schritt schlussfolgern und schließlich die Antwort geben.

<ThinkingModelDemo />

### 7.2 Trainingsgeheimnisse: Von „Nachahmung" zu „Erkundung"

Warum konnten frühere Modelle nicht so denken? Weil sich die Trainingsmethode geändert hat.

#### Traditionelles Muster (SFT – Nachahmendes Lernen)

- **Methode**: Dem Modell menschliche Denkprozesse zeigen und es **nachahmen** lassen.
- **Grenze**: Die Obergrenze des Modells ist die Qualität der menschlichen Daten. Wenn Menschen selbst nicht klar denken können (z. B. bei extrem schwierigen Matheaufgaben), kann das Modell es auch nicht lernen.

#### Denk-Muster (RL – Reinforcement Learning)

- **Methode**: **Keine** Prozessdaten vorgeben, nur einen finalen **Verifizierer (Verifier)** bereitstellen.
  - Zum Beispiel: Bei einer Matheaufgabe probiert das Modell auf eigene Faust herum.
  - Falsch geraten -> Strafe.
  - Richtig geraten -> Belohnung.
- **Aha-Moment**:
  Nach hunderttausenden von Selbstversuchen stellt das Modell erstaunt fest: **„Wenn ich vor der Ausgabe der Antwort ein paar Herleitungsschritte auf einem Schmierzettel notiere, erhöht sich die Wahrscheinlichkeit einer Belohnung enorm!"**
  So wird das Verhalten „erst denken, dann antworten" verstärkt und gefestigt. Ähnlich wie AlphaGo, das durch Selbstspiel trainierte und schließlich menschliche Spielaufzeichnungen übertraf.

### 7.3 Praxisleitfaden: Der große Wandel im Prompt-Stil

Bei der Nutzung von Thinking Models (wie DeepSeek-R1, OpenAI o1) muss sich deine Prompt-Strategie grundlegend ändern.

| Eigenschaft           | Traditionelles Modell (GPT-4o, Claude 3.5)     | Thinking Model (R1, o1)                                               |
| :-------------------- | :--------------------------------------------- | :-------------------------------------------------------------------- |
| **Kernlogik**         | **System 1 (Intuition)**                       | **System 2 (Logik)**                                                  |
| **Prompt-Technik**    | Benötigt angeleitete Gedankenkette (CoT)<br>Bsp.: „Denke Schritt für Schritt …" | **Nicht** überflüssig eingreifen<br>Das Modell hat eine eigene CoT, künstliche Anleitung stört es eher |
| **Anweisungsklarheit** | Komplexe Aufgaben müssen in Teilaufgaben zerlegt werden | Gib direkt das Endziel vor, lass das Modell selbst zerlegen           |
| **Geeignete Szenarien** | Kreatives Schreiben, einfache Übersetzung, Smalltalk | Komplexe Mathematik, Code-Refactoring, logisches Schlussfolgern      |

> ⚠️ **Achtung**: Je weniger Einmischung beim Thinking Model, desto besser. Du musst nur klar definieren, **„was das perfekte Aufgabenergebnis ist"**, und nicht, **„wie es gemacht werden soll"**.

### 7.4 Zukunftstrend: Fusion von schnell und langsam

In Zukunft werden wir wahrscheinlich nicht mehr zwischen „Thinking Models" und „normalen Modellen" unterscheiden müssen.
Die ideale KI sollte wie ein Mensch über eine **adaptive Berechnungsfähigkeit (Adaptive Compute)** verfügen:

- Bei „1+1=?": Sofort System 1 aufrufen, blitzschnell antworten.
- Bei „Beweise die Riemannsche Vermutung": Automatisch auf System 2 umschalten, drei Tage und Nächte nachdenken, dann antworten.
- **Nahtlose Umschaltung für den Nutzer**: Du stellst nur die Frage, und das Modell entscheidet selbst, wie viel „Gehirnleistung" es dafür einsetzt.

### 7.5 Architekturevolution: Vom „Alleskönner" zum „Expertenteam" (Dense vs. MoE)

Je größer die Modelle werden (wie GPT-4, DeepSeek-V3), desto unerträglicher wäre es, wenn bei jedem generierten Wort sämtliche Neuronen durchlaufen werden müssten.
Daher entstand die **MoE (Mixture of Experts)**-Architektur.

- **Dense (Dichtes Modell)**:
  - **Analogie**: Ein **universelles Genie**. Egal welche Frage gestellt wird, es setzt sein gesamtes Gehirn für die Antwort ein.
  - **Eigenschaft**: Stabil, aber mit zunehmendem Wissen immer langsamer.
  - **Vertreter**: GPT-3, Llama-2.

- **MoE (Mixture of Experts)**:
  - **Analogie**: Ein **Expertenteam am Fließband** (jedes verarbeitete Wort wechselt die Person).
  - **Kernmechanismus (Token-Level Routing)**:
    Die Essenz von MoE liegt im **nativen Token-Level-Routing**. Es verteilt die Arbeit **keinesfalls** nach „Aufgabentyp" (etwa alle Matheaufgaben an den Mathe-Experten), sondern **nach dem aktuell generierten Wort** in Echtzeit.
    - Wenn das Modell „`def`" generiert, wird an den **Code-Experten** geroutet.
    - Wenn das Modell „`love`" generiert, wird an den **Literatur-Experten** geroutet.
    - Wenn das Modell „`3.14`" generiert, wird an den **Mathe-Experten** geroutet.
    Das bedeutet, selbst innerhalb desselben Satzes werden verschiedene Wörter oft von verschiedenen Experten bearbeitet.
  - **Eigenschaft**: Obwohl die Gesamtzahl der Leute hoch ist (viele Parameter), arbeiten bei jedem Wort nur wenige (geringe aktivierte Parameter). **Sowohl gelehrt als auch schnell.**
  - **Vertreter**: GPT-4, DeepSeek-V3, Mixtral.

<MoEDemo />

### 7.6 Effizienzrevolution: Die Längenbegrenzung durchbrechen (Linear Attention)

Neben MoE gibt es einen weiteren zentralen Schwachpunkt: die **Kontextlänge**.
Der traditionelle Transformer (wie GPT-4) verwendet den **Standard-Aufmerksamkeitsmechanismus**, dessen Berechnungsaufwand mit zunehmender Wortanzahl **quadratisch explodiert**.

- 10.000 Wörter lesen -> 100 Millionen Berechnungen.
- 100.000 Wörter lesen -> 10 Milliarden Berechnungen!

Um dieses Problem zu lösen, haben Modelle wie MiniMax (abab-Serie) und RWKV eine **lineare Aufmerksamkeit (Linear Attention)** eingeführt.

### Motivation: das eine „netzartig" und das andere „linear"

Der grundlegende Unterschied liegt in der Frage: **Behältst du alle ursprünglichen Worte, oder fasst du jederzeit zusammen?**

- **Standard Attention (Netzartig) – Warum muss zurückgeschaut werden?**
  - **Kernursache**: Um **„Relevanz zu finden"**.
  - **Beispiel**: Im Satz „Ich habe **den Apfel** **ihm** gegeben …". Wenn du das Wort „**ihm**" liest, muss das Modell, um herauszufinden, auf wen sich „ihm" bezieht, alle vorherigen Wörter (Ich, habe, den, Apfel, gegeben) durchsuchen.
  - **Ablauf**: „ihm" sendet ein Abfragesignal (Query) und gleicht es mit den Etiketten (Key) aller vorherigen Wörter ab.
    - Übereinstimmung mit „Ich"? 0 Punkte.
    - Übereinstimmung mit „Apfel"? **100 Punkte!**
  - **Kosten**: Da das Modell nicht weiß, welches Wort wichtig ist, **muss es alle vorherigen Wörter prüfen, keines darf ausgelassen werden**. Deshalb wird das Netz zu einem dichten Geflecht.

- **Lineare Aufmerksamkeit (Linear) – Warum muss nicht zurückgeschaut werden?**
  - **Prinzip**: Das Modell hat gelernt, „Notizen zu machen". Nachdem es „Apfel" gelesen hat, komprimiert es die Information „es gibt einen Apfel" in einen **Zustand (State)**; liest es dann „ihm", schlägt es direkt im Zustand nach und erkennt: „ihm = Apfel".
  - **Kosten**: Obwohl schnell, können bei der „Komprimierung" Details verloren gehen (z. B. dass der Apfel rot war).

<LinearAttentionDemo />

### 7.7 Architekturvergleich: RNN vs. Transformer vs. RWKV

| Architektur | Kernmechanismus | Komplexität (Länge N) | Paralleles Training | Inferenzgeschwindigkeit | Vergessensproblem | Vertreter |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RNN** | Sequentielle Rekursion | $O(N)$ (niedrig) | ❌ Nein | Langsam (sequenziell) | Schwerwiegend (Langstrecken-Gedächtnisverlust) | LSTM, GRU |
| **Transformer** | Globale Aufmerksamkeit | $O(N^2)$ (extrem hoch) | ✅ Ja | Mittel (KV-Cache) | Keines (aber fensterbegrenzt) | GPT-4, Llama |
| **RWKV / Linear** | Lineare Aufmerksamkeit | $O(N)$ (niedrig) | ✅ Ja | Schnell (konstanter VRAM) | Geringfügig (Kompressionsverlust) | RWKV, MiniMax |

> **RWKV / Linear Attention** versucht, die Vorteile beider Vorgänger zu vereinen: Paralleles Training wie der Transformer, effiziente Inferenz wie das RNN.

---

## 8. Zusammenfassung & Lernpfad

Jetzt hast du den gesamten Weg von der „Tokenisierung" bis zu „ChatGPT" durchlaufen:

1.  **Tokenisierung**: Text in Token zerlegen.
2.  **Embedding**: Token auf semantische Vektoren abbilden.
3.  **Transformer**: Mithilfe des Aufmerksamkeitsmechanismus Sequenzen verarbeiten und Merkmale parallel extrahieren.
4.  **Training**: Daten mit Templates formatieren und durch Teacher Forcing parallel trainieren.
5.  **Inferenz**: Autoregressiv Wort für Wort generieren.

**Empfohlene nächste Schritte**:

- Wenn du dich für Mathematik interessierst, vertiefe dich in **Lineare Algebra** (Matrixoperationen) und **Wahrscheinlichkeitstheorie**.
- Wenn du praktisch loslegen willst, versuche, mit Pythons `transformers`-Bibliothek ein kleines Modell (wie GPT-2) zu laden und damit zu experimentieren.

---

## 9. Glossar

| Begriff             | Vollständiger Name                         | Erklärung                                                                                                                                         |
| :------------------ | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **LLM**             | Large Language Model                       | Large Language Model. Ein KI-Modell, das durch riesige Textmengen trainiert wurde und menschliche Sprache verstehen und generieren kann.          |
| **Token**           | -                                          | **Tokenisierung**. Die kleinste Einheit, in die Text zerlegt wird (wie Wörter, Zeichen oder Zeichenfragmente). Das Modell liest und schreibt Token-IDs. |
| **Embedding**       | -                                          | **Wortvektor**. Ein numerischer Vektor, der einen Token in einen hochdimensionalen Raum abbildet (z. B. 4096 Dimensionen) und semantische Beziehungen einfängt. |
| **Transformer**     | -                                          | Die Kernarchitektur moderner LLMs. Basiert auf dem Aufmerksamkeitsmechanismus und kann lange Texte parallel verarbeiten.                          |
| **Attention**       | Attention Mechanism                        | **Aufmerksamkeitsmechanismus**. Ermöglicht dem Modell, bei der Verarbeitung eines Worts dynamisch auf andere relevante Wörter im Kontext zu achten. |
| **Context Window**  | -                                          | **Kontextfenster**. Die maximale Anzahl an Token, die sich das Modell bei einer Inferenz „merken" kann (z. B. 128k).                            |
| **Pre-training**    | -                                          | **Vortraining**. Das Modell auf riesigen, unbeschrifteten Textmengen trainieren, damit es die grundlegenden Sprachregeln und Weltwissen lernt.      |
| **SFT**             | Supervised Fine-Tuning                     | **Instruction Fine-Tuning**. Verwendung hochwertiger Frage-Antwort-Paare, um dem Modell beizubringen, menschlichen Anweisungen zu folgen.           |
| **RLHF**            | Reinforcement Learning from Human Feedback | **Verstärkungslernen durch menschliches Feedback**. Durch menschliche Bewertung wird das Modellverhalten weiter angepasst, um es an menschlichen Werten auszurichten (Alignment). |
| **CoT**             | Chain of Thought                           | **Gedankenkette**. Eine Technik, die das Modell dazu anleitet, vor der endgültigen Antwort zunächst Schlussfolgerungsschritte zu generieren.        |
| **MoE**             | Mixture of Experts                         | **Mixture of Experts**. Besteht aus mehreren „Experten"-Untermodellen, wobei je nach Problem automatisch die passenden Experten aktiviert werden – effizienter. |
| **Temperature**     | -                                          | **Temperatur**. Ein Parameter, der die Zufälligkeit der Modellgenerierung steuert. Höhere Temperatur = kreativer, aber unkontrollierbarer; niedrigere Temperatur = deterministischer. |
