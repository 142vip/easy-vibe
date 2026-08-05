# RAG: Retrieval-Augmented Generation

::: tip Vorwort
**Warum „halluziniert" ChatGPT manchmal überzeugend?** Das Wissen großer Sprachmodelle stammt aus Trainingsdaten, aber diese haben ein Stichtagsdatum und enthalten nicht die internen Dokumente deines Unternehmens. RAG (Retrieval-Augmented Generation) ist die Kerntechnologie, die dieses Problem löst – sie lässt die KI erst „nachschlagen", bevor sie antwortet.
:::

**Was lernst du in diesem Artikel?**

Nach diesem Kapitel wirst du:

- **Kernkonzepte verstehen**: Verstehen, was RAG ist, warum es nötig ist und wie es das „Halluzinations"-Problem großer Modelle löst
- **Vollständigen Prozess kennen**: Den End-to-End-Workflow vom Dokumentenladen über Chunking und Vektorisierung bis hin zur Abfrage und Generierung beherrschen
- **Technologieauswahl-Fähigkeit**: Die Vor- und Nachteile verschiedener Chunking-Strategien und Abfragemethoden verstehen und szenariobasiert wählen können
- **Architekturevolution verstehen**: Den Evolutionspfad von Naive RAG über Advanced RAG bis zu Modular RAG begreifen
- **Praktische Entscheidungskompetenz**: Wissen, wann RAG und wann Fine-Tuning einzusetzen ist

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | RAG-Grundprozess | Indizierung, Abfrage, Generierung – drei Phasen |
| **Kapitel 2** | Text-Chunking-Strategien | Fixes Chunking, semantisches Chunking, rekursives Chunking |
| **Kapitel 3** | Abfragetechniken | Vektorsuche, Schlüsselwortsuche, hybride Suche |
| **Kapitel 4** | Architekturevolution | Naive RAG → Advanced RAG → Modular RAG |
| **Kapitel 5** | RAG vs. Fine-Tuning | Vergleich der Einsatzszenarien beider Ansätze |

---

## 0. Panorama: Motivation von große Modelle „nachschlagen" müssen

Stell dir vor, du bist ein belesener Professor, der unzählige Bücher gelesen hat. Aber wenn dich jemand fragt: „Wie hoch waren die Verkaufszahlen von gestern?", kannst du nicht antworten – weil diese Informationen nicht in den Büchern stehen, die du gelesen hast.

Große Sprachmodelle stehen vor demselben Dilemma:

- **Wissen hat ein Stichtagsdatum**: Die Trainingsdaten von GPT-4 enden zu einem bestimmten Zeitpunkt, danach liegende Ereignisse kennt es nicht
- **Kein privates Wissen**: Die internen Dokumente, Produkthandbücher und Kundendaten deines Unternehmens hat das Modell nie gesehen
- **Neigung zu Halluzinationen**: Wenn das Modell unsicher ist, tendiert es dazu, eine plausibel klingende Antwort zu „erfinden"

::: tip Der Kerngedanke von RAG
Die Lösung von RAG ist sehr intuitiv: **Lass das Modell relevante Referenzmaterialien finden, bevor es antwortet**. Wie eine Open-Book-Prüfung – du musst nicht alles Wissen im Kopf haben, sondern nur wissen, wo du suchen und wie du finden kannst.

RAG = Retrieval (Abrufen) + Augmented (Anreicherung) + Generation (Generierung)
:::

---

## 1. RAG-Grundprozess: Indizierung, Abfrage, Generierung

Der RAG-Workflow kann in zwei Phasen unterteilt werden: **Offline-Indizierung** und **Online-Abfrage**.

Die Offline-Phase ist wie die Katalogisierung in einer Bibliothek – alle Bücher klassifizieren, nummerieren und einordnen, um späteres Suchen zu erleichtern. Die Online-Phase ist der Prozess, bei dem Leser in die Bibliothek kommen, um Material zu suchen – relevante Bücher zu einer Frage finden und dann die Informationen zu einer Antwort synthetisieren.

<RAGPipelineDemo />

::: tip Drei Kernphasen
1. **Indizierungsphase (Indexing)**: Rohdokumente laden, bereinigen, chunkieren, dann durch ein Embedding-Modell in Vektoren umwandeln und in einer Vektordatenbank speichern. Dies ist eine einmalige Vorbereitungsarbeit.
2. **Abfragephase (Retrieval)**: Wenn ein Benutzer fragt, wird auch die Frage in einen Vektor umgewandelt und in der Vektordatenbank nach den ähnlichsten Dokumentfragmenten gesucht.
3. **Generierungsphase (Generation)**: Die abgerufenen Dokumentfragmente werden zusammen mit der Benutzerfrage zu einem Prompt kombiniert und dem großen Modell zur Generierung der endgültigen Antwort übergeben.
:::

| Phase | Eingabe | Ausgabe | Schlüsseltechnologien |
|------|------|------|---------|
| Indizierung | Rohdokumente | Vektordatenbank | Text-Chunking, Embedding-Modell |
| Abfrage | Benutzerfrage | Top-K Dokumentfragmente | Vektor-Ähnlichkeit, Reranking |
| Generierung | Frage + Kontext | Endgültige Antwort | Prompt Engineering, LLM |

---

## 2. Text-Chunking: Den Elefanten in den Kühlschrank bekommen

Text-Chunking ist der am meisten unterschätzte, aber für die Effektivität entscheidendste Schritt in RAG. Warum ist Chunking nötig? Weil das Kontextfenster großer Modelle begrenzt ist – wir können nicht ein ganzes Buch hineinstopfen. Und noch wichtiger: **Die Qualität des Chunkings bestimmt direkt die Qualität der Abfrage**.

Stell dir vor, du suchst in einer Bibliothek nach einem bestimmten Wissenspunkt in einem Buch. Wenn das ganze Buch ein einziger „Chunk" wäre, ist der Abruf nutzlos – du musst immer noch das ganze Buch durchblättern. Wenn aber nach Kapiteln oder sogar Absätzen gechunkt wird, kannst du genau die benötigten Inhalte finden.

<ChunkingStrategyDemo />

::: tip Auswahl der Chunking-Strategie
- **Fixes Chunking**: Nach Zeichen- oder Tokenanzahl zerschneiden – einfach, aber kann Semantik zerstören
- **Rekursives Chunking**: Erst nach Absätzen, dann nach Sätzen zerschneiden – erhält semantische Integrität
- **Semantisches Chunking**: Mit Embedding-Modellen semantische Grenzen beurteilen, an Ähnlichkeitssprüngen schneiden
- **Strukturbasiertes Chunking**: Markdown-Überschriften, HTML-Tags und andere Strukturinformationen nutzen

Es gibt keine „beste" Chunking-Strategie, nur die für deine Daten am besten geeignete. Allgemein empfohlen: mit rekursivem Chunking beginnen, Chunk-Größe 200–500 Tokens, Überlappung 10–20 %.
:::

---

## 3. Abfragetechniken: Ansatz für findet man die relevantesten Inhalte

Nach dem Chunking stellt sich die nächste Schlüsselfrage: **Ein Benutzer stellt eine Frage – wie findet man aus Tausenden von Dokumentfragmenten die relevantesten?**

Das ist wie die Suche nach einem Buch in einer riesigen Bibliothek. Du kannst nach Titel-Schlüsselwörtern suchen (Schlüsselwortsuche), du kannst beschreiben, was du suchst, und den Bibliothekar bitten, es zu finden (semantische Suche), und am besten kombinierst du beide Ansätze (hybride Suche).

<RetrievalDemo />

| Abfrageart | Prinzip | Vorteile | Nachteile |
|---------|------|------|------|
| Schlüsselwortsuche (BM25) | Basierend auf Worthäufigkeit und inverser Dokumenthäufigkeit | Präzise Treffer, schnell | Versteht keine Semantik, Synonyme fallen aus |
| Vektorsuche | Basierend auf Kosinus-Ähnlichkeit von Embedding-Vektoren | Versteht Semantik, unterstützt Fuzzy-Matching | Unempfindlich für Eigennamen |
| Hybride Suche | Fusioniert Schlüsselwort- und Vektorsuchergebnisse | Kombiniert Präzision und Semantik | Erfordert Gewichtungsabstimmung, hohe Komplexität |

::: tip Reranking
Nach der Abfrage von Kandidaten-Dokumenten ist meist ein Reranking-Schritt erforderlich. Die initiale Abfrage strebt nach Recall (möglichst nichts übersehen), das Reranking nach Precision (die relevantesten Ergebnisse nach vorne). Gängige Reranking-Modelle sind Cohere Rerank, BGE Reranker usw. Sie verwenden Cross-Encoder, um Query-Dokument-Paare fein zu bewerten.
:::

---

## 4. Architekturevolution: Von einfach zu intelligent

Die RAG-Technologie hat in nur zwei Jahren drei Generationen der Evolution durchlaufen, wobei jede Generation die Schwachstellen der vorherigen adressiert.

<RAGArchitectureDemo />

::: tip Vergleich der drei RAG-Architekturgenerationen
- **Naive RAG (2023)**: Der grundlegendste „Indizierung → Abfrage → Generierung"-Workflow, einfach zu implementieren, aber begrenzt effektiv. Probleme: instabile Abfragequalität, keine Handhabung komplexer Queries, neigt dazu, verrauschten Kontext einzuführen.
- **Advanced RAG (2024)**: Erweitert Naive RAG um Query-Rewriting, hybride Suche, Reranking, Kontextkompression und andere Optimierungsschritte, wodurch Abfragepräzision und Generierungsqualität deutlich verbessert werden.
- **Modular RAG (2025)**: Zerlegt RAG in austauschbare Module, unterstützt Routing-Entscheidungen, adaptive Abfrage, Selbstreflexion und andere fortgeschrittene Fähigkeiten. Kann den optimalen Verarbeitungsablauf dynamisch je nach Query-Typ wählen.
:::

---

## 5. RAG vs. Fine-Tuning: Welches soll man wählen

Wenn du einem großen Modell Wissen in einem bestimmten Bereich beibringen willst, gibt es normalerweise zwei Wege: RAG und Fine-Tuning. Sie schließen sich nicht gegenseitig aus, sondern ergänzen sich.

Eine Analogie: **Fine-Tuning ist wie ein Schüler, der einen Kurs besucht** – das Wissen wird im Gehirn verinnerlicht; **RAG ist wie ein Schüler, der ein Nachschlagewerk bekommt** – er kann während der Prüfung darin blättern. Beide Methoden haben Vor- und Nachteile, entscheidend sind deine konkreten Anforderungen.

<RAGvsFineTuningDemo />

| Dimension | RAG | Fine-Tuning |
|------|-----|------|
| Wissensaktualisierung | Echtzeit, einfach Dokumente ändern | Erfordert erneutes Training |
| Kosten | Niedrig (kein GPU-Training nötig) | Hoch (erfordert Trainingsressourcen) |
| Nachvollziehbarkeit | Hoch (Quellen rückverfolgbar) | Niedrig (Wissen in Gewichten internalisiert) |
| Einsatzszenarien | Wissensdatenbank-Q&A, Dokumentensuche | Stiltransfer, aufgabenspezifische Optimierung |
| Halluzinationskontrolle | Besser (mit Referenzbasis) | Mittel (Halluzinationen möglich) |

::: tip Praxistipp
In den meisten Szenarien: **erst RAG ausprobieren**. Die Vorteile von RAG: kein Training nötig, Wissen in Echtzeit aktualisierbar, Antworten quellen-rückverfolgbar. Nur wenn du das „Verhaltensmuster" des Modells ändern musst (z. B. Ausgabeformat, Sprachstil, Denkweise), solltest du Fine-Tuning in Betracht ziehen. Die stärkste Lösung ist oft die Kombination **RAG + Fine-Tuning**.
:::

---

## Zusammenfassung

RAG ist eine der praktischsten Technologien, um große Modelle in die Praxis zu bringen. Sein Kernwert liegt darin, dass die Antworten des Modells belegbar sind, das Wissen in Echtzeit aktualisiert werden kann und Halluzinationen wirksam kontrolliert werden.

Rückblick auf die Kernpunkte dieses Kapitels:

1. **Das Kernproblem, das RAG löst**: Veraltetes Wissen großer Modelle, fehlende private Daten, Neigung zu Halluzinationen
2. **Drei-Phasen-Workflow**: Indizierung (Offline-Vorbereitung) → Abfrage (Online-Suche) → Generierung (Synthetisierte Antwort)
3. **Chunking ist die Basis**: Die Chunking-Qualität bestimmt direkt die Abfragequalität, die Wahl der richtigen Chunking-Strategie ist entscheidend
4. **Abfrage ist der Schlüssel**: Hybride Suche + Reranking ist derzeit die effektivste Kombination
5. **Die Architektur entwickelt sich weiter**: Von Naive RAG zu Modular RAG werden Systeme zunehmend intelligenter und flexibler
6. **RAG und Fine-Tuning ergänzen sich**: In den meisten Szenarien erst RAG versuchen, Fine-Tuning nur bei Verhaltensänderung des Modells

## Weiterführende Literatur

- [LangChain RAG Tutorial](https://python.langchain.com/docs/tutorials/rag/) - Praktischer Leitfaden für das beliebteste RAG-Framework
- [LlamaIndex Dokumentation](https://docs.llamaindex.ai/) - Auf RAG spezialisiertes Framework mit vielfältigen Datenkonnektoren
- [RAG Survey Paper](https://arxiv.org/abs/2312.10997) - Umfassende RAG-Technologieübersicht
- [Chunking Strategies](https://www.pinecone.io/learn/chunking-strategies/) - Detaillierte Erklärung der Chunking-Strategien von Pinecone
- [Vektordatenbank-Vergleich](https://superlinked.com/vector-db-comparison) - Funktionsvergleich gängiger Vektordatenbanken