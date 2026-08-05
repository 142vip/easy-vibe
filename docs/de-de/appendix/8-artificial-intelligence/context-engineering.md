# Context Engineering: Kontextgestaltung
> 💡 **Lernleitfaden**: Prompt Engineering beantwortet die Frage „Wie formuliere ich klar?“, Context Engineering beantwortet die Frage „Wie sorge ich dafür, dass das Modell zur richtigen Zeit die richtigen Informationen sieht?“. Dieses Kapitel dreht sich um eine zentrale Frage: **Wie können wir innerhalb eines begrenzten Kontextfensters das Modell dazu bringen, uns zu verstehen, ohne das Budget zu sprengen?**

Bevor wir beginnen, empfehlen wir dir, zwei Grundlagen aufzufrischen:

- **Was ist ein Token**: Lies zuerst den Abschnitt „Tokenisierung & Token“ in [Einführung in Large Language Models](./llm-principles.md).
- **Was ist ein Prompt**: Wenn du mit der grundlegenden Struktur von System / User / Assistant noch nicht vertraut bist, wirf zuerst einen Blick auf [Prompt Engineering](./prompt-engineering/).

---

## 0. Einleitung: Motivation von vergisst das Modell mitten im Gespräch alles – und warum wird es immer teurer

<AgentContextFlow />

Viele Anwender erleben im Umgang mit Large Language Models ähnliche Situationen:

- Mitten im Gespräch „vergisst“ das Modell plötzlich zuvor genannte Schlüsselbedingungen;
- In langen Dialogen widersprechen sich die Antworten gegenseitig, und es ist schwer, eine konsistente Vorgabe beizubehalten;
- Je mehr Gesprächsrunden, desto höher die Rechnung – wie bei einem Taxameter.

Intuitiv würden wir denken: **„Das Modell hat ein schlechtes Gedächtnis.“**
Doch in den meisten Fällen liegt das Problem nicht daran, dass das Modell „nichts behalten kann“, sondern daran, dass wir **den Kontext, den es sehen kann, nicht gut genug gestaltet haben**.

<IntroProblemReasonSolution />

Angesichts dieser Herausforderungen reicht es nicht mehr aus, sich allein auf „gut geschriebene Prompts“ zu verlassen. Wir brauchen einen systematischeren, ingenieurmäßigen Ansatz, um dem Modell innerhalb eines begrenzten Fensters und Budgets stets die wichtigsten Informationen bereitzustellen. Genau das versucht **Context Engineering** zu lösen.

---

## 1. Was ist „Context Engineering“? (Definition & Szenarien)

Zunächst eine kurze Arbeitsdefinition, dann einige typische Szenarien.

> Context Engineering ist eine ingenieurmäßige Methode zum Aufbau und zur Verwaltung der „Informationsumgebung“ eines LLMs. Sie bestimmt, was das Modell „sieht, ignoriert und wann es etwas sieht“, um Aufgaben innerhalb eines begrenzten Kontextfensters zuverlässig zu erfüllen.

Vereinfacht kann man es sich als drei Aufgaben vorstellen: Informationen ordnen, das Fenster kontrollieren und Kosten managen.
Typische Einsatzszenarien sind:

- Konversationelle Agenten und Kundenservice-Bots
- Code- / Dokumentations-Assistenten
- Mehrschrittige Tool-Aufrufe und langlaufende Prozessketten

Als Nächstes beginnen wir mit den praktischen Erfahrungen eines echten Teams und sehen, wie sie sich Schritt für Schritt von „nur Prompts schreiben“ zu „Context Engineering betreiben“ entwickelt haben.

---

## 2. Praxiserfahrungen: Die Fehler, aus denen das Manus-Team gelernt hat

Das Fallbeispiel dieses Kapitels stammt von **Manus** (einem universellen AI-Agenten).
Anders als bei normalen Gesprächen muss Manus autonom planen und Werkzeuge aufrufen, um lange Aufgaben zu erledigen (mit Dutzenden oder sogar Hunderten von Interaktionsrunden).

Daraus ergibt sich ein zentraler Widerspruch:
- **Nichts aufzeichnen**: Wichtige Informationen gehen verloren, die Aufgabe wird unterbrochen.
- **Alles aufzeichnen**: Kosten und Latenz explodieren und können sogar das Fensterlimit überschreiten.

Das Manus-Team hat mehrere Architektur-Revisionen hinter sich und musste eine wichtige Lektion lernen: **Kontext kann man nicht einfach nur „schreiben“, man muss ihn „gestalten“.**

### 2.1 Was haben uns vier Refactorings gelehrt

Manus-Mitbegründer Ji Yichao hat ihre Fehlergeschichte geteilt:

| Phase | Aufgetretenes Problem | Damaliger Gedanke | Ergebnis |
| :--- | :--- | :--- | :--- |
| **Erste** | Die KI vergaß mitten im Gespräch Dinge | „Schreib einfach mehr Prompts“ | Immer länger, immer teurer |
| **Zweite** | Wichtige Infos wurden ständig verdrängt | „Kopier das Wichtige mehrfach“ | Noch längerer Text, noch höhere Kosten |
| **Dritte** | Erschreckend hohe Rechnungen | „Können wir frühere Berechnungen wiederverwenden?“ | Weg gefunden, um Kosten für wiederholte Berechnungen zu senken |
| **Vierte** | Lange Dokumente nicht verarbeitbar | „Können wir bei Bedarf nachschlagen?“ | Lösung mit „Bibliothek + On-Demand-Abruf“ entwickelt |

**Kernerkenntnis**: **Es geht nicht darum, sich möglichst viel zu merken, sondern möglichst geschickt.**

### 2.2 Womit ist das „Gedächtnis“ der KI eigentlich vergleichbar

**Herkömmlicher Arbeitsspeicher** = **Festplatte**:
- Große Kapazität: kann große Datenmengen langfristig speichern;
- Geringe Kosten: ein Jahr Speicherung kostet wenig;
- Relativ langsame Lese-/Schreibgeschwindigkeit, das Auffinden von Informationen braucht Zeit.

**KI-Kontext** = **Tafel**:
- Schnelles Lesen/Schreiben: Das Modell kann den gesamten Kontext auf einmal sehen;
- Begrenzte Kapazität: Wenn voll, muss Altes gelöscht werden;
- Jeder geschriebene Token verursacht zusätzliche Berechnungs- und Kostenaufwände.

**Manus' Erfahrung**: **Die Tafel muss sparsam und geschickt genutzt werden – nicht als Enzyklopädie.**

---

## 3. Schritt 1: Kosten verstehen – Wohin fließt dein Geld

### 3.1 Warum zuerst die Kosten betrachten

Schauen wir uns an, wie dein Geld bei einer typischen KI-Konversation ausgegeben wird:

```
💰 Kostenzusammensetzung (eine Konversation):
├─ 70% Alte Inhalte erneut lesen („Worüber haben wir gerade gesprochen?“)
├─ 20% Neue Inhalte verarbeiten („Was wird jetzt gesagt?“)
└─ 10% Antwort generieren („Wie antworte ich?“)
```

**Überraschende Erkenntnis**: **70 % des Geldes wird dafür ausgegeben, dass die KI deine vorherigen Nachrichten erneut liest!**

### 3.2 Was ist KV Cache? (Prefix-Wiederverwendung)

Bevor wir über Preise sprechen, müssen wir ein zentrales technisches Konzept verstehen: **KV Cache (Key-Value Cache)**.
Lass dich vom Fachbegriff nicht abschrecken – es ist im Grunde das „Kurzzeitgedächtnis-Schnellnachschlagewerk“ der KI.

- **Ohne KV Cache**: Die KI muss jedes Mal, als sähe sie den Text zum ersten Mal, vom ersten Wort an neu lesen, verstehen und berechnen.
- **Mit KV Cache**: Die KI speichert die Berechnungsergebnisse der bereits gesehenen Teile (Pre-fill). Wenn sich der Anfang beim nächsten Mal nicht ändert, ruft sie die gespeicherten Ergebnisse direkt ab, ohne neu rechnen zu müssen.

Das ist vergleichbar mit:
> Du gehst in eine Prüfung.
> **Fall A**: Du musst jedes Mal das gesamte Lehrbuch von vorne durchlesen, bevor du antworten kannst. (langsam, anstrengend, teuer)
> **Fall B**: Du hast den Lehrbuchinhalt bereits auswendig gelernt (Cache) und beantwortest die Fragen direkt. (schnell, einfach, günstig)

In den Preistabellen der Cloud-Anbieter ist der **„auswendig gelernte Stoff“ (Cache Hit)** in der Regel über 90 % günstiger als der **„neu gelesene Stoff“ (Cache Miss)**.

### 3.3 Der Preisunterschied: „Auswendig gelernt“ vs. „Nachschlagen“

Am Beispiel von Claude:
- **Nachschlagen** (kein Cache): 3,00 $ / Mio. Tokens
- **Auswendig gelernt** (mit Cache): 0,30 $ / Mio. Tokens
- **Faktor 10 Unterschied**!

**Manus' Praxis**: Indem sie die KI Dinge „auswendig lernen“ ließen, senkten sie die Kosten von **0,15 $ auf 0,02 $** – eine Ersparnis von **87 %**!

<ContextWindowVisualizer />

### 3.4 Fallstricke: Lass den Zeitstempel nicht deinen Cache zerstören

Viele Entwickler schreiben die „aktuelle Uhrzeit“ gewohnheitsmäßig an den Anfang des System Prompts, weil sie das für sorgfältig halten.
**Das ist jedoch eines der größten Anti-Patterns im Context Engineering.**

Stell dir vor: Du hast ein ganzes Geschichtsbuch (System Prompt) auswendig gelernt, aber in der ersten Zeile steht „die aktuelle Sekunde“.
Wenn sich diese Zeile jede Sekunde ändert, ist alles, was du in der vorherigen Sekunde gelernt hast, sofort wertlos – du musst alles von vorne lernen.

Das ist die Achillesferse der **Prefix-Wiederverwendung (KV Cache)**: **Sobald sich der Anfang ändert, muss alles danach neu berechnet werden.**

#### Schlechtes Beispiel: Dynamische Informationen an den Anfang
```text
System: Es ist jetzt 2024-01-01 12:00:01. Du bist ein Assistent...
(Eine Minute später)
System: Es ist jetzt 2024-01-01 12:01:01. Du bist ein Assistent...
```
**Konsequenz**: Obwohl sich nur wenige Zeichen geändert haben, können wegen der Position am Anfang die nachfolgenden 99 % des festen Inhalts den Cache nicht nutzen. Jede Anfrage ist so langsam und teuer wie die erste.

#### Richtiger Ansatz: Dynamisches von Statischem trennen
```text
System: Du bist ein Assistent... (hier stehen tausende Zeichen an festen Regeln und Wissensdatenbanken)
User: (aktuelle Uhrzeit wird hier per Tool-Aufruf oder Nutzernachricht übergeben)
```
**Vorteil**: Die tausenden Zeichen an Regeln am Anfang bleiben unverändert, die KI muss sie nur einmal „lernen“. Folgende Anfragen greifen direkt auf das Gedächtnis zu – extrem schnell.

👇 **Probier es selbst aus**:
Klicke auf den Schalter unten, um die **„Auswendiglern-Beschleunigung“** zu aktivieren, und klicke dann mehrmals auf „Neue Anfrage senden“.
Beobachte, was mit der **Antwortzeit (TTFT)** passiert, wenn der erste Inhaltsblock auf „auswendig gelernt“ gesetzt ist.

<KVCacheDemo />

---

## 4. Schritt 2: Sliding Window – Wenn „Gedächtnis“ zu „Kosten“ wird

Je länger das Gespräch wird, desto eher stellt sich die Frage: **Was tun, wenn das Fenster voll ist?**

### 4.1 Warum „First In, First Out“ problematisch ist

Die einfachste Gedächtnisverwaltung ist das **Sliding Window**: **Neues kommt rein, Altes fliegt raus.**
Das klingt fair, ist aber in der Praxis eine Katastrophe.

**Szenario**:
```text
Gesprächsverlauf:
[1] Nutzer: Ich bin Zhang San, zuständig für das Zahlungssystem
[2] Nutzer: Das Projekt wird in Go entwickelt
[3] Nutzer: Die Datenbank ist PostgreSQL
...
[20] Nutzer: Schreib mir eine API
```
**Ergebnis**: Wenn die 20. Nachricht erreicht ist, wurde die 1. Nachricht („Ich bin Zhang San“) bereits aus dem Fenster verdrängt. Die KI hat völlig vergessen, wer du bist und für welches System du zuständig bist.

**Der Kern des Problems**: Diese Strategie behandelt **wichtige Informationen** (Identität, Tech-Stack) und **Füllmaterial** („Okay“, „Verstanden“) gleich – beide werden gleichermaßen hinausgeworfen.

### 4.2 „Lost in the Middle“ – Warum die KI Schlüsselinformationen übersieht

Neben dem „schnellen Vergessen“ hat die KI noch eine weitere Eigenart: **Sie „überliest“ auch Dinge**.
Die Forschung zeigt: **Die KI reagiert am sensibelsten auf Anfang und Ende, die Mitte wird am leichtesten übersehen**. Das ist das bekannte **Lost in the Middle**-Phänomen.

**U-förmige Gedächtniskurve**:
```text
Position: Anfang → Mitte → Ende
Gedächtnis: Hoch  → Niedrig → Hoch
```

👇 **Probier es selbst aus**:
1. Probiere zuerst das **„Sliding Window“**: Sende im Chatfenster unten mehrere Nachrichten und beobachte, wie alte Gespräche gnadenlos „hinausgedrängt“ werden.
2. Dann schau dir den **„Lost in the Middle“**-Effekt an: Beobachte, ob die Abruf-Erfolgsquote am niedrigsten ist, wenn die Schlüsselinformation mitten im Text versteckt ist.

<SlidingWindowDemo />
<LostInMiddleDemo />

**Lösung**: Platziere Schlüsselinformationen am **Anfang** (System Prompt) oder am **Ende** (Nutzerfrage).

---

## 5. Schritt 3: Selektives Behalten – Wie „heftet“ man Schlüsselinformationen an

Wenn „First In, First Out“ nicht zuverlässig ist, was tun wir dann?
Manus' Antwort: **Ein „Informations-Hierarchiesystem“ aufbauen.**

### 5.1 Warum Informationen nach Wichtigkeit einstufen

Statt alle Informationen gleich zu behandeln, entscheiden wir über ihre Verweildauer basierend auf ihrer Wichtigkeit:

| Stufe | Informationstyp | Behandlung | Kostenauswirkung |
| :--- | :--- | :--- | :--- |
| **VIP** | Systemvorgaben, Nutzeridentität | **Dauerhaft behalten** | +15 % Kosten |
| **Wichtig** | Aktuelles Aufgabenziel | **Für die Dauer der Aufgabe behalten** | +10 % Kosten |
| **Normal** | Normaler Gesprächsverlauf | **Letzte 5 Runden behalten** | Basiskosten |
| **Verzichtbar** | Abrufbares Wissen | **Nur bei Bedarf nachschlagen** | -60 % Kosten |

**Kerngedanke**: **Mit 25 % Kostensteigerung 90 % der Schlüsselinformationen erhalten.**

### 5.2 Die „Anheft“-Strategie

Stell dir das Kontextfenster wie eine Tafel vor:
- **VIP-Informationen**: Mit Nägeln **fest an den oberen Rand** der Tafel geheftet (System Prompt).
- **Wichtige Informationen**: Mit Magneten **in der Mitte** der Tafel befestigt (Context Injection).
- **Normale Gespräche**: In die untere Hälfte der Tafel geschrieben, bei Bedarf wird Altes gelöscht (Sliding Window).

👇 **Probier es selbst aus**:
Versuche in der folgenden Demo, eine wichtige Gesprächsnachricht „anzuheften“.
Beobachte: Bleibt die angeheftete Information erhalten, während nicht angeheftete verdrängt werden, wenn du weiter chattest?

<SelectiveContextDemo />

---

## 6. Schritt 4: RAG – Wenn das „Gedächtnis“ eine „Bibliothek“ braucht

Manchmal gibt es zu viele Informationen (z. B. hunderte Seiten technischer Dokumentation), als dass sie auf die Tafel passen würden. Dann brauchen wir ein externes Gehirn – **RAG (Retrieval Augmented Generation)**.

### 6.1 Warum die „Tafel“ nicht ausreicht

Als Manus auf millionen Token umfassende technische Dokumentationen traf, verglich das Team zwei Ansätze:

1.  **Alles reinschreiben**: Alle Inhalte auf einmal in den Kontext stopfen.
    *   **Konsequenz**: Die Tafel ist sofort voll, die Verarbeitung extrem langsam, und laut der „Lost in the Middle“-Theorie kann sich die KI den Mittelteil gar nicht merken.
    *   **Kosten**: ca. 50 $/Vorgang, 15 Sekunden Wartezeit.
2.  **On-Demand-Abruf (RAG)**: Erst in der Bibliothek (Datenbank) nachschlagen und nur die relevanten Abschnitte auf die Tafel schreiben.
    *   **Konsequenz**: Die Tafel bleibt übersichtlich, die KI fokussiert sich auf Schlüsselinformationen.
    *   **Kosten**: ca. 0,50 $/Vorgang, 2 Sekunden Wartezeit.

**99 % Kosten gespart, 87 % Zeit gespart!**

### 6.2 Best Practices für das „Nachschlagen“

Manus' Erfahrungen zusammengefasst:
*   **In welche Stücke zerteilt man jedes Buch?** 500–1000 Zeichen funktionieren am besten.
*   **Wie viele Bücher auf einmal durchsuchen?** 3–5, mehr führt zu Ablenkung.
*   **Ab welcher Relevanz nachschlagen?** Ähnlichkeit > 0,7, um das Erzwingen irrelevanter Inhalte zu vermeiden.

👇 **Probier es selbst aus**:
Gib eine Frage in das Suchfeld ein (z. B. „Wie setze ich mein Passwort zurück?“) und beobachte, wie das System aus einem großen Dokumentenstapel nur die relevantesten Treffer findet.

<RAGSimulationDemo />

---

## 7. Schritt 5: Komprimierung – Wie macht man die „Tafel“ dichter beschreibbar

Was, wenn alle Informationen wichtig sind, nicht gelöscht werden können und wir auch nicht nachschlagen wollen?
Dann bleibt nur: **kleiner schreiben** – das ist **Kontextkomprimierung**.

### 7.1 Wann braucht man „Verkürzung“
*   Abgerufenes Material ist zu umfangreich (> 2000 Wörter).
*   Der Gesprächsverlauf ist zu ausschweifend (> 80 % der Tafelfläche belegt).
*   Eine schnelle Antwort ist nötig, ohne dass die KI lange Texte lesen muss.

### 7.2 Die drei Stufen der „Verkürzung“

| Komprimierungsart | Kompressionsrate | Was bleibt erhalten | Geeignetes Szenario | Einsparung |
| :--- | :--- | :--- | :--- | :--- |
| **Zusammenfassend** | 70 % | Hauptaussage | Schnelles Verständnis | 30 % Ersparnis |
| **Stichpunktartig** | 50 % | Kernpunkte | Strukturierte Ausgabe | 50 % Ersparnis |
| **Tabellarisch** | 30 % | Kerndaten | Programmverarbeitung | 70 % Ersparnis |

👇 **Probier es selbst aus**:
Wähle verschiedene Komprimierungsstrategien und beobachte, wie lange Texte kürzer und prägnanter werden.

<ContextCompressionDemo />

---

## 8. Systemintegration: Der „Gedächtnispalast“ der KI

Bisher haben wir Baustein für Baustein verschiedene Einzelstrategien kennengelernt:
*   **KV Cache**: Hilft uns, Geld zu sparen (Kapitel 3)
*   **Sliding Window**: Hilft uns, Platz zu schaffen (Kapitel 4)
*   **Priorisiertes Behalten**: Hilft uns, Wichtiges festzuhalten (Kapitel 5)
*   **RAG**: Hilft uns, externes Wissen einzubinden (Kapitel 6)

Jetzt ist es an der Zeit, diese Bausteine zu einer vollständigen Burg zusammenzufügen – Manus' **„Gedächtnispalast“**.

### 8.1 Kontext zusammenbauen wie ein Haus

Betrachte den Kontext nicht als einen Haufen wirren Textes, sondern als ein geschichtetes Gebäude. Jede Ebene hat ihre eigene Funktion und ihre „Bewohnungsregeln“.

👇 **Probier es selbst aus**:
Klicke auf „Baubeginn“ und beobachte, wie wir diesen Palast Schicht für Schicht errichten.

<MemoryPalaceDemo />

### 8.2 Warum ist dieses Design das stärkste

Die Designphilosophie dieses Palastes zielt darauf ab, drei grundlegende Widersprüche zu lösen:

1.  **Fundament (System Prompt) — Löst das Problem „teuer“**
    *   **Widerspruch**: Die Systemvorgaben (Wer bist du, welche Regeln gelten) sind am längsten, müssen aber jedes Mal mitgesendet werden.
    *   **Lösung**: Als unterste Schicht platziert, nutzt sie die **KV Cache**-Technologie. Solange sie unverändert bleibt, kann die KI sie „auswendig“. Für hunderte Folge-Gesprächsrunden liegen die Berechnungskosten dieses Teils bei nahezu **0**.

2.  **Säulen (Task Context) — Löst das Problem „vergessen“**
    *   **Widerspruch**: Bei langen Dialogen vergisst die KI leicht das ursprüngliche Aufgabenziel (z. B. „Schreibe ein Snake-Spiel“).
    *   **Lösung**: Die **Priorisierungsstrategie** nutzen, um das Aufgabenziel in der zweiten Schicht „anzuheften“. Egal wie viele Runden, diese Schicht wird nie gelöscht – die KI vergisst nie ihre eigentliche Aufgabe.

3.  **Dachgeschoss (Chat & RAG) — Löst das Problem „Chaos“**
    *   **Widerspruch**: Neue Gespräche und abgerufenes Material kommen zusammen und stiften Verwirrung.
    *   **Lösung**:
        *   **Wohnzimmer (Chat)**: Mit **Sliding Window** verwaltet, nur die letzten 5–10 aktuellen Nachrichten behalten.
        *   **Bibliothek (RAG)**: Material wird nach Gebrauch entfernt, belegt keinen dauerhaften Platz.

### 8.3 Praxisergebnisse

Nachdem das Manus-Team diese Architektur live geschaltet hatte, waren die Ergebnisse sofort sichtbar:

*   **Geld gespart**: Weil das Fundament „auswendig gelernt“ wurde, sanken die Kosten pro Gesprächsrunde drastisch um **84 %**.
*   **Schneller geworden**: Die KI muss nicht mehr jedes Mal tausende Zeichen von vorne lesen – die durchschnittliche Antwortzeit sank von 8 Sekunden auf **2 Sekunden**.
*   **Präziser geworden**: Schlüsselinformationen sind „festgenagelt“, die KI vergisst mitten im Gespräch nie mehr, wofür sie eigentlich zuständig ist.

---

## 9. Praxisvorlagen: Direkt übernehmen

Damit du intuitiver verstehst, wie dieser Mechanismus funktioniert, haben wir eine **vollständige End-to-End-Simulation** vorbereitet.

Wähle ein Szenario und klicke auf „Nächster Schritt“, um zu sehen, wie der **Gedächtnispalast** in den wenigen Sekunden zwischen Nutzerfrage und KI-Antwort dynamisch Kontext abruft, zusammensetzt und bereinigt.

<MemoryPalaceActionDemo />

### 📝 Direkt einsetzbare Praxis-Designs

Wenn du ein Manus-ähnliches System entwerfen möchtest, achte nicht nur darauf, wie der Prompt geschrieben ist, sondern vor allem darauf, **wie die Systemarchitektur den Kontext orchestriert**.

Hier sind die **Systemdesign-Blaupausen** für zwei klassische Szenarien, die sowohl **Prompt-Design** als auch **Code-Logik (Pseudocode)** enthalten.

#### Szenario 1: Full-Stack-Ingenieur-Agent (Langzeitgedächtnis-Typ)
> **Kernherausforderung**: Lange Aufgabenzyklen, bei denen die ursprünglichen Anforderungen und der Projektkontext leicht vergessen werden.
> **Lösungsstrategie**: System-Ebene (Identität) + Task-Ebene (Ziele fixiert) + Chat-Ebene (Sliding Window).

**1. System Prompt (Layer 1 & 2)**
```markdown
# Layer 1: Identitätsvorgabe (System Prompt) - unveränderlich, nutzt KV Cache
Du bist ein erfahrener Full-Stack-Ingenieur, versiert in Python und Vue3.
Code-Stil:
- Variablennamen strikt nach PEP8
- Kritische Logik muss kommentiert sein
- Vorrangig vorhandene Hilfsfunktionen des Projekts nutzen

# Layer 2: Aufgabenfixierung (Task Context) - darf während der Aufgabe nicht gelöscht werden
Aktuelle Aufgabe: Refactoring des Zahlungsmoduls (payment_module)
Kernbeschränkungen:
1. Muss kompatibel zur alten API v1.0 sein
2. Datenbank-Migrationsskripte müssen idempotent sein
3. Frist: diesen Freitag
```

**2. Kontext-Zusammenstellungslogik (Pseudocode)**
```python
def build_engineer_context(user_input, chat_history, task_info):
    context = []

    # 1. Fundament-Ebene: Identitätsvorgabe (KV Cache nutzen)
    # Dieser Teil bleibt über hunderte Runden unverändert, Rechenkosten nahezu 0
    context.append(SYSTEM_PROMPT)

    # 2. Säulen-Ebene: Aufgabenfixierung (Pinned)
    # Egal wie lang der Dialog, dieser Teil wird immer nach dem System Prompt eingefügt
    context.append(f"Aktuelle Aufgabe: {task_info}")

    # 3. Abruf-Ebene: Code-Ausschnitte (RAG)
    # Durchsuche die Codebasis basierend auf der Nutzerfrage
    relevant_code = search_codebase(user_input)
    if relevant_code:
        context.append(f"Referenzcode:\n{relevant_code}")

    # 4. Interaktions-Ebene: Gesprächsverlauf (Sliding Window)
    # Nur die letzten 10 Runden behalten, um Kontextüberlauf zu vermeiden
    recent_chat = chat_history[-10:]
    context.extend(recent_chat)

    # 5. Neueste Eingabe
    context.append(user_input)

    return context
```

#### Szenario 2: Intelligenter Kundenservice-Agent (Präzise-Antwort-Typ)
> **Kernherausforderung**: Kostensensitiv, und es darf auf keinen Fall Unsinn erzählt werden.
> **Lösungsstrategie**: System-Ebene (starke Einschränkungen) + RAG-Ebene (dynamische Injektion).

**1. System Prompt (Layer 1)**
```markdown
# Layer 1: Identitätsvorgabe (System Prompt)
Du bist ein professioneller E-Commerce-Kundendienstmitarbeiter.
Antwortprinzipien:
1. Freundlicher, professioneller und knapper Ton
2. **Strengstens verboten**, Fakten zu erfinden – antworte nur basierend auf [Referenzmaterial]
3. Wenn das Material keine Antwort enthält, antworte direkt: „Es tut mir sehr leid, ich muss diese Frage an einen menschlichen Kollegen weiterleiten.“
```

**2. Kontext-Zusammenstellungslogik (Pseudocode)**
```python
def build_support_context(user_input):
    context = []

    # 1. Fundament-Ebene: Identitätsvorgabe
    context.append(SYSTEM_PROMPT)

    # 2. Bibliotheks-Ebene: Dynamischer Abruf (RAG)
    # Im Kundenservice-Szenario ist RAG die Hauptrolle, platziert in der Mitte
    docs = vector_db.search(user_input, top_k=3)

    context.append("【Referenzmaterial Anfang】")
    for doc in docs:
        context.append(doc.content)
    context.append("【Referenzmaterial Ende】")

    # 3. Interaktions-Ebene: Sehr kurzer Verlauf
    # Kundenservice braucht meist kein langes Gedächtnis, die letzten 3 Runden reichen
    context.extend(get_recent_chat(limit=3))

    context.append(user_input)

    return context
```

---

## 10. Glossar

| Englischer Begriff | Deutsche Übersetzung | Erklärung |
| :--- | :--- | :--- |
| **Context Window** | Kontextfenster | Die maximale Textlänge, die das Modell auf einmal verarbeiten kann (inklusive Ein- und Ausgabe). Inhalte, die das Limit überschreiten, werden abgeschnitten oder vergessen. |
| **Token** | Token | Die kleinste Verarbeitungseinheit von Text eines LLMs. Typischerweise entspricht 1 Token etwa 0,75 englischen Wörtern oder 0,5 chinesischen Schriftzeichen. Sowohl Abrechnung als auch Fensterbeschränkung basieren auf dieser Einheit. |
| **KV Cache** | KV-Cache | Eine Inferenzbeschleunigungstechnik, die bereits berechnete Attention-Key-Value-Paare zwischenspeichert, um wiederholte Berechnungen für unveränderte Präfixe zu vermeiden und so Latenz und Kosten deutlich zu senken. |
| **RAG** | Retrieval Augmented Generation | Vor der Beantwortung einer Frage werden relevante Informationen aus einer externen Wissensdatenbank abgerufen und als Kontext bereitgestellt, um Halluzinationen zu reduzieren und Wissensgrenzen zu erweitern. |
| **Sliding Window** | Gleitfenster | Die grundlegendste Kontextverwaltungsstrategie. Hält die Token-Anzahl im Fenster konstant und entfernt automatisch die ältesten Inhalte, wenn neue hinzukommen. |
| **Lost in the Middle** | Lost in the Middle | Eine Einschränkung großer Modelle. Studien zeigen, dass Modelle Informationen am Anfang und Ende eines langen Kontexts am besten behalten, während sie den mittleren Teil am ehesten übersehen. |
| **System Prompt** | System-Prompt | Die Anweisung am Anfang eines Gesprächs, die Identität, Verhaltensregeln, Antwortstil und Kernaufgabe des Modells festlegt. |
| **Few-shot** | Few-Shot Learning | Bereitstellung einiger „Frage-Antwort“-Beispiele im Prompt, um dem Modell zu helfen, Aufgabenmuster und Ausgabeformate schnell zu verstehen. |
| **Chain of Thought** | Chain of Thought (Gedankenkette) | Das Modell wird angeleitet, vor der endgültigen Antwort zuerst die Denkschritte auszugeben. Diese Methode verbessert die Fähigkeit des Modells bei komplexen logischen und mathematischen Problemen erheblich. |
| **Hallucination** | Halluzination | Das Phänomen, dass das Modell überzeugt scheinbar plausible, aber tatsächlich falsche oder nicht existierende Informationen generiert. |
| **Embedding** | Vektorisierung | Technik zur Umwandlung von Text in hochdimensionale numerische Vektoren. Semantisch ähnliche Texte liegen im Vektorraum näher beieinander – die Grundlage der semantischen Suche. |
| **Vector DB** | Vektordatenbank | Eine speziell für die Speicherung und Abfrage von Vektordaten entwickelte Datenbank. Unterstützt die schnelle Ähnlichkeitssuche nach den am besten passenden Dokumentfragmenten. |
| **Temperature** | Temperatur | Ein Hyperparameter zur Steuerung der Zufälligkeit der Modellausgabe. Höhere Werte (z. B. 0,8) erzeugen vielfältigere, kreativere Ausgaben; niedrigere Werte (z. B. 0,2) erzeugen deterministischere, präzisere Ausgaben. |
| **TTFT** | Time to First Token | Die Zeit vom Senden der Nutzeranfrage bis zur Ausgabe des ersten Tokens durch das Modell – eine Schlüsselkennzahl für die Interaktionserfahrung. |

---

## Zusammenfassung: Die Essenz von Context Engineering

Manus' vier Refactorings lehren uns:

**Aus der Praxis**: Es geht nicht darum, sich möglichst viel zu merken, sondern möglichst strukturiert und selektiv.

**Aus der Kostenperspektive**:
- Die meiste Verschwendung entsteht durch wiederholte Berechnung unveränderter Präfixe – sie muss durch Präfix-Stabilität und Caching-Mechanismen gelöst werden;
- Dass wichtige Informationen versehentlich gelöscht werden, liegt oft an der „Gleichbehandlung“ durch das Sliding Window – es braucht Informationshierarchie und Anheft-Strategien;
- Bei sehr langen Dokumenten und Wissensdatenbanken ist es nicht realistisch, nur das Kontextfenster zu vergrößern – Abruf- und Komprimierungsmechanismen müssen integriert werden.

Das Ziel ist: Jeder investierte Token soll innerhalb des gegebenen Modell- und Kontextlimits einen klaren Zweck erfüllen.
