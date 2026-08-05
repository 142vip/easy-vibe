# Modell-Finetuning und -Bereitstellung

::: tip Vorwort
**Große Modelle sind leistungsstark, aber sie verstehen dein Geschäft nicht.** GPT-4 kann Gedichte schreiben und programmieren, aber es kennt weder die Produktterminologie deines Unternehmens noch die Fachstandards deiner Branche. Fine-Tuning ist der Prozess, der ein allgemeines großes Modell dein Fachwissen „lehrt" – wie eine Einarbeitungsschulung für einen vielseitigen Generalisten, um ihn zu einem Fachexperten für dein Gebiet zu machen.
:::

**Was lernst du in diesem Artikel?**

Nach diesem Kapitel wirst du:

- **Prozessverständnis**: Die vollständige Fine-Tuning-Pipeline von der Datenvorbereitung bis zum Produktivbetrieb des Modells beherrschen
- **Data Engineering**: Die Formatanforderungen und Qualitätsstandards für Fine-Tuning-Daten verstehen
- **Effizientes Fine-Tuning**: Das Prinzip und die Vorteile parameter-effizienter Techniken wie LoRA verstehen
- **Modellkompression**: Beherrschen, wie Quantisierungstechniken große Modelle auf Consumer-Hardware lauffähig machen
- **Deployment-Praxis**: Die gängigen Architekturen und Auswahlstrategien für Modell-Services kennen

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | Fine-Tuning-Pipeline | Daten → Training → Evaluierung → Deployment |
| **Kapitel 2** | Trainingsdaten | Datenformat, Qualitätskontrolle |
| **Kapitel 3** | LoRA Fine-Tuning | Low-Rank-Adaptation, parameter-effizient |
| **Kapitel 4** | Modellquantisierung | FP16, INT8, INT4 |
| **Kapitel 5** | Modell-Deployment | Inferenzservice, API-Gateway |

---

## 0. Panorama: Notwendigkeit des Fine-Tunings

Das Training großer Sprachmodelle gliedert sich in zwei Phasen: **Pre-Training** und **Fine-Tuning**. Pre-Training erlernt die Sprachfähigkeit aus riesigen allgemeinen Datenmengen, Fine-Tuning erlernt Fachkompetenz aus aufgabenspezifischen Daten.

Eine Analogie: Pre-Training ist wie ein Studium – Allgemeinwissen lernen, von allem ein bisschen; Fine-Tuning ist wie eine Einarbeitungsschulung – Fachkompetenzen für eine konkrete Position erlernen.

::: tip Wann braucht man Fine-Tuning?
- **Spezifisches Ausgabeformat**: Das Modell muss konsistent in einem festen JSON-Format antworten
- **Fachwissen**: Medizinische, juristische, finanzielle Fachbegriffe und Standards
- **Sprachstil-Transfer**: Das Modell soll mit einem bestimmten Tonfall und Stil antworten (z. B. Kundenservice-Skripte)
- **Nischensprachen-Unterstützung**: Die Leistung des Modells in einer bestimmten Sprache verbessern
- **Kostenoptimierung**: Große Modellaufrufe durch Fine-Tuning kleiner Modelle ersetzen und Inferenzkosten senken
:::

---

## 1. Fine-Tuning-Pipeline: Die vollständige Reise von Daten zum Produktivbetrieb

Fine-Tuning ist kein „Daten ins Modell werfen und fertig". Es ist ein strenger Engineering-Prozess, bei dem jedes Glied das Endergebnis beeinflusst.

<FinetuningPipelineDemo />

::: tip Die fünf Phasen des Fine-Tunings
1. **Datenvorbereitung**: Trainingsdaten sammeln, bereinigen und annotieren – der zeitaufwendigste, aber auch kritischste Schritt
2. **Modellauswahl**: Ein geeignetes Basismodell (Base Model) wählen, z. B. Llama 3, Qwen, Mistral
3. **Trainingskonfiguration**: Hyperparameter wie Lernrate, Batch-Größe, Epochenanzahl einstellen
4. **Trainingsausführung**: Das Training auf GPU ausführen, Loss-Kurve und Evaluierungsmetriken überwachen
5. **Evaluierung und Produktivbetrieb**: Auf dem Testset evaluieren, nach Bestehen als API-Service bereitstellen
:::

| Phase | Zentrale Aktionen | Häufige Fallstricke |
|------|---------|---------|
| Datenvorbereitung | Bereinigen, Deduplizieren, Formatieren | Schlechte Datenqualität führt dazu, dass das Modell „Falsches lernt" |
| Modellauswahl | Fähigkeiten des Basismodells bewerten | Modell zu groß → nicht trainierbar, zu klein → schlechte Ergebnisse |
| Trainingskonfiguration | Hyperparameter anpassen | Zu hohe Lernrate führt zu katastrophalem Vergessen |
| Trainingsausführung | Loss und Metriken überwachen | Overfitting, Training konvergiert nicht |
| Evaluierung und Produktivbetrieb | A/B-Tests, graduelle Einführung | Testset-Leakage führt zu überhöhten Evaluierungswerten |

---

## 2. Trainingsdaten: Die Obergrenze der Fine-Tuning-Effektivität

Beim Fine-Tuning gibt es ein altes Sprichwort: **„Garbage in, garbage out"**. Die Qualität der Trainingsdaten bestimmt direkt die Obergrenze der Fine-Tuning-Effektivität. 100 qualitativ hochwertige Datenpunkte übertreffen oft 10.000 minderwertige.

<TrainingDataDemo />

::: tip Drei gängige Formate für Fine-Tuning-Daten
1. **Instruktionsformat (Instruction)**: Das meistgenutzte Format mit drei Feldern: instruction (Anweisung), input (Eingabe), output (erwartete Ausgabe). Geeignet, um das Modell zu trainieren, Anweisungen zu befolgen.
2. **Dialogformat (Chat)**: Mehrrunden-Dialogform mit einer Nachrichtenliste aus system-, user- und assistant-Rollen. Geeignet zum Trainieren von Chatbots.
3. **Vervollständigungsformat (Completion)**: Einfache Prompt-Completion-Paare, geeignet für Textgenerierung, Code-Vervollständigung und ähnliche Szenarien.
:::

| Datenqualitätsdimension | Beschreibung | Prüfmethode |
|------------|------|---------|
| Korrektheit | Antworten müssen fehlerfrei sein | Manuelle Prüfung, Expertenvalidierung |
| Konsistenz | Antwortstil bei ähnlichen Fragen einheitlich | Stichprobenvergleich |
| Diversität | Ausreichend viele Szenarien und Varianten abdecken | Verteilung der Fragetypen statistisch erfassen |
| Deduplizierung | Vermeidung von Overfitting durch doppelte Samples | Text-Deduplizierung, semantische Deduplizierung |
| Datenmenge | Üblicherweise reichen 500–5.000 qualitativ hochwertige Daten | Mit wenigen beginnen, schrittweise erhöhen |

---

## 3. LoRA: Mit 1 % der Parameter 90 % der Wirkung erzielen

Volles Fine-Tuning (Full Fine-Tuning) erfordert die Aktualisierung aller Parameter des Modells – bei einem 70B-Modell bedeutet das Hunderte GB VRAM und enorme GPU-Rechenleistung. Für die meisten Teams ist das unrealistisch.

LoRA (Low-Rank Adaptation) bietet eine elegante Lösung: **Die ursprünglichen Modellparameter werden eingefroren, nur ein kleiner Satz neu hinzugefügter niedrigrangiger Matrizen wird trainiert**. Diese Matrizen umfassen typischerweise nur 0,1 %–1 % der Parameter des Originalmodells, erreichen aber nahezu die Wirkung des vollen Fine-Tunings.

<LoRADemo />

::: tip Der Kerngedanke von LoRA
Die Gewichtsmatrix W des Originalmodells ist eine riesige Matrix (z. B. 4096x4096). LoRA modifiziert W nicht direkt, sondern fügt einen „Bypass" hinzu: W' = W + BA, wobei B und A zwei kleine Matrizen sind (z. B. 4096x8 und 8x4096). Beim Training werden nur B und A aktualisiert, das ursprüngliche W bleibt unverändert.
- **Rang (Rank)**: Je größer der r-Wert, desto stärker die Ausdrucksfähigkeit, aber auch desto mehr Parameter. Üblicherweise reicht r=8–64
- **Merge-Deployment**: Nach dem Training kann BA in W integriert werden, sodass bei der Inferenz kein zusätzlicher Overhead entsteht
:::

| Fine-Tuning-Methode | Trainierbare Parameter | VRAM-Bedarf | Trainingsgeschwindigkeit | Effektivität |
|---------|-----------|---------|---------|------|
| Volles Fine-Tuning | 100 % | Extrem hoch | Langsam | Am besten |
| LoRA | 0,1 %–1 % | Niedrig | Schnell | Nahezu voll |
| QLoRA | 0,1 %–1 % | Noch niedriger | Mittel | Etwas unter LoRA |
| Prompt Tuning | < 0,01 % | Extrem niedrig | Sehr schnell | Begrenzt |

---

## 4. Modellquantisierung: Das große Modell „abspecken"

Ein 70B-Modell benötigt bei FP32-Speicherung (32-Bit-Gleitkomma) 280 GB VRAM – ohne mehrere Top-GPUs ist es nicht lauffähig. Quantisierungstechniken reduzieren das Modellvolumen durch geringere numerische Präzision und machen große Modelle auf Consumer-Hardware nutzbar.

<ModelQuantizationDemo />

::: tip Der zentrale Trade-off der Quantisierung
Quantisierung ist im Kern ein Trade-off **Präzision gegen Speicherplatz**. FP32 → FP16 ist nahezu verlustfrei, INT8 hat minimale Verluste, INT4 zeigt einen spürbaren, aber meist akzeptablen Qualitätsabfall. Entscheidend ist, den optimalen Balancepunkt für dein Szenario zu finden.
- **FP16 (halbe Genauigkeit)**: Halbes Volumen, nahezu keine Qualitätseinbußen, Standard für Training und Inferenz
- **INT8 (8-Bit-Ganzzahl)**: Volumen nochmals halbiert, sehr geringe Qualitätsverluste, geeignet für die meisten Inferenzszenarien
- **INT4 (4-Bit-Ganzzahl)**: Volumen nur 1/8 von FP32, gewisse Qualitätsverluste, geeignet für ressourcenbeschränkte Szenarien
:::

| Präzision | Bytes pro Parameter | Volumen 70B-Modell | Qualitätsverlust | Einsatzszenario |
|------|-----------|-------------|---------|---------|
| FP32 | 4 Bytes | ~280 GB | Keiner | Trainings-Baseline |
| FP16 | 2 Bytes | ~140 GB | Nahezu keiner | Standard-Training und -Inferenz |
| INT8 | 1 Byte | ~70 GB | Sehr gering | Produktionsinferenz |
| INT4 | 0,5 Bytes | ~35 GB | Akzeptabel | Edge-Geräte, lokales Deployment |

---

## 5. Modell-Deployment: Vom Labor in die Produktionsumgebung

Das Modell ist trainiert, quantisiert und komprimiert – der letzte Schritt ist, es als aufrufbaren Service bereitzustellen. Modell-Deployment ist nicht nur „das Modell zum Laufen bringen", sondern umfasst auch Parallelverarbeitung, Lastverteilung, Kostenkontrolle und weitere Engineering-Herausforderungen.

<ModelServingDemo />

::: tip Drei gängige Deployment-Ansätze
1. **API-Anbieter**: APIs von OpenAI, Anthropic und anderen Anbietern direkt nutzen. Null Betriebsaufwand, Abrechnung pro Token, geeignet für schnelle Validierung und kleine bis mittlere Nutzung.
2. **Selbst gehosteter Inferenzservice**: Mit Frameworks wie vLLM, TGI auf eigenen GPU-Servern bereitstellen. Kosten kontrollierbar, Daten bleiben im eigenen Netzwerk, geeignet für Szenarien mit Datenschutzanforderungen oder hohem Aufrufvolumen.
3. **Serverless-Inferenz**: Plattformen wie AWS SageMaker, Replicate nutzen, Abrechnung pro Anfrage, automatische Skalierung. Geeignet für Szenarien mit stark schwankendem Traffic.
:::

| Deployment-Ansatz | Kostenmodell | Latenz | Betriebskomplexität | Einsatzszenario |
|---------|---------|------|-----------|---------|
| API-Anbieter | Pro Token | Mittel | Null | Schnelle Prototypen, kleine/mittlere Skalierung |
| vLLM Selbst-Deployment | GPU-Mietkosten | Niedrig | Hoch | Große Skalierung, datenschutzsensitiv |
| Serverless | Pro Anfrage | Höher bei Kaltstart | Niedrig | Stark schwankender Traffic |
| Edge-Deployment | Einmalige Hardware-Investition | Extrem niedrig | Mittel | Offline-Szenarien, IoT |

---

## Zusammenfassung

Modell-Fine-Tuning und Deployment sind die entscheidenden Schritte, um ein großes Modell vom „Allzweckwerkzeug" zum „Fachassistenten" zu machen. Von der Datenvorbereitung bis zum Produktivbetrieb erfordert jeder Schritt Engineering-Denken und -Praxis.

Rückblick auf die Kernpunkte dieses Kapitels:

1. **Fine-Tuning ist Einarbeitungsschulung**: Das allgemeine Modell lernt domänenspezifisches Wissen und Verhaltensmuster
2. **Datenqualität bestimmt die Obergrenze**: 100 qualitativ hochwertige Datenpunkte schlagen 10.000 minderwertige
3. **LoRA ist der Effizienzkönig**: Mit weniger als 1 % der Parameter nahezu die Wirkung des vollen Fine-Tunings erzielen
4. **Quantisierung ist das Deployment-Werkzeug**: INT4-Quantisierung macht 70B-Modelle auf einer einzelnen Karte lauffähig
5. **Deployment-Ansatz je nach Umgebung**: Schnelle Validierung per API, große Skalierung per Selbst-Deployment, schwankender Traffic per Serverless

## Weiterführende Literatur

- [Hugging Face PEFT Dokumentation](https://huggingface.co/docs/peft) - Offizielle Dokumentation zur parameter-effizienten Fine-Tuning-Bibliothek
- [vLLM Dokumentation](https://docs.vllm.ai/) - Hochleistungs-LLM-Inferenz-Engine
- [Unsloth](https://github.com/unslothai/unsloth) - 2x beschleunigtes LoRA-Fine-Tuning-Framework
- [GGUF Formatbeschreibung](https://github.com/ggerganov/ggml/blob/master/docs/gguf.md) - Von llama.cpp verwendetes quantisiertes Modellformat
- [OpenAI Fine-Tuning Guide](https://platform.openai.com/docs/guides/fine-tuning) - Offizieller Fine-Tuning-Leitfaden von OpenAI