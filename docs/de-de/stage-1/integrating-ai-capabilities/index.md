---
title: 'KI-Funktionen in einen Prototyp integrieren'
description: 'Von Prompts, offizieller Dokumentation und Dienstkonsole bis zu Text-, Bild-, Sprach- und Videofunktionen in einem Webprototyp.'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'
import AiCapabilityGuide from '../../../zh-cn/stage-1/integrating-ai-capabilities/AiCapabilityGuide.vue'
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'

const duration = 'Etwa <strong>1–2 Tage</strong>'
const relatedArticles =
  relatedArticlesMap['de-de/stage-1/integrating-ai-capabilities'] ?? []
</script>

# KI-Funktionen in einen Prototyp integrieren


## Einführung

<ChapterIntroduction :duration="duration" :tags="['Prompts', 'API-Dokumentation', 'Dienstkonsole', 'Multimodal']" coreOutput="Ein bis zwei echte KI-Funktionen in den Prototyp integrieren" expectedOutput="Ein Webprototyp, der Text-, Bild-, Sprach- oder Videodienste aufruft">

Im Prototyp aus dem vorherigen Kapitel lassen sich Seitenaufbau und Bedienablauf bereits prüfen. Die generierten Ergebnisse stammen jedoch noch aus Testdaten. In diesem Kapitel verbinden wir eine zentrale Aktion mit einem echten KI-Dienst.

Eine KI-Integration besteht nicht nur aus kopiertem API-Code. Drei Fragen gehören zusammen: **Wie beschreiben wir die Aufgabe, wie lesen wir die offizielle Dokumentation und wie bauen wir den Aufruf sicher in den Produktablauf ein?**

Zuerst lernen wir eine allgemeine Methode, anschließend betrachten wir Text, Bildverständnis, Bilderzeugung, Sprache und Video. Modellnamen und Konsolen ändern sich. Die Beispiele erklären deshalb die Struktur; bei der eigenen Integration müssen Modell-ID und Parameter aus der aktuellen offiziellen Dokumentation übernommen werden.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Aufgabe klären', description: 'Fachlichen Prompt vorbereiten' },
      { title: 'Dokumentation lesen', description: 'API und Parameter finden' },
      { title: 'Integration abschließen', description: 'Sicheren Aufruf ausführen' },
      { title: 'Modalitäten erweitern', description: 'Bild, Sprache und Video' }
    ]" />
  </ClientOnly>
</div>

## 1. Die zu integrierende Funktion festlegen

Der E-Commerce-Arbeitsbereich aus dem vorherigen Kapitel enthält bereits Produktdaten und eine Schaltfläche „Text erzeugen“. Das Ergebnis ist noch simuliert. Zuerst lassen wir diese Schaltfläche wirklich arbeiten.

Der Ablauf ist einfach: Eine Person trägt Produktname, Material und Vorteile ein, klickt und erhält einen Produkttext. Eingabe und Ausgabe sind Text, also benötigen wir ein Textgenerierungsmodell.

Bei einer anderen Seitenfunktion ändert sich die benötigte Fähigkeit:

- Farbe und Form in einem Produktfoto erkennen: Bildverständnis.
- Aus Produktdaten ein Poster erstellen: Bilderzeugung.
- Eine Aufnahme als Protokoll aufbereiten: erst Sprache in Text umwandeln, dann mit einem Textmodell ordnen.
- Einen Artikel hörbar machen: Text-to-Speech.
- Ein Produktfoto bewegen: Bild-zu-Video-Generierung.

Prüfe vor der Integration noch einmal die Seite: Was gibt die Person ein und was möchte sie am Ende sehen? Daraus lässt sich meist direkt ableiten, ob Text, Bild, Sprache oder Video benötigt wird.

<AiCapabilityGuide />

### 1.1 Eine Funktion kann aus mehreren Schritten bestehen

Nicht jede Funktion lässt sich mit einem Modell und einer Anfrage erledigen. „Produktfoto hochladen und Vorteile erzeugen“ bedeutet zuerst, das Produkt zu verstehen und anschließend aus dem Ergebnis Text zu schreiben. „Fragen anhand von Unternehmensunterlagen beantworten“ verlangt zuerst die passenden Stellen und danach die formulierte Antwort.

Beginne die Zerlegung nicht mit Modellnamen. Folge dem Bedienablauf: Welcher Schritt versteht vorhandene Inhalte, welcher erzeugt neue und welcher sucht nur Informationen? Bei Bedarf werden zwei oder drei Fähigkeiten nacheinander verbunden.

KI übernimmt nur passende Aufgaben. Anmeldung, Zahlung, Dateispeicherung und Navigation folgen festen Regeln und werden weiterhin mit normaler Programmlogik umgesetzt.

![Reale Seite, auf der ein Produktbild vor der Beschreibung verstanden wird](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-35-41.webp)

*In diesem Prototyp wird das Produktbild zuerst ausgewertet. Nach der Bestätigung entstehen eine bearbeitbare Beschreibung und Verkaufsargumente.*

### 1.2 Was in der Dienstkonsole gesucht wird

Für Textgenerierung öffnen wir beispielsweise DeepSeek, SiliconFlow, Volcengine Ark oder MiniMax. Die Plattform stellt Konto, Abrechnung und Zugang bereit; das ausgewählte Modell verarbeitet die Anfrage.

Für die erste Integration genügen vier Punkte:

1. Eine **API Key** für den Aufruf erstellen.
2. Die gewünschte **Model ID** notieren.
3. In der offiziellen Dokumentation das kleinste curl- oder JavaScript-Beispiel finden.
4. Kontingent, Preis und Aufrufgrenzen prüfen.

Die Anwendung sendet Produktdaten über eine **API** an das Modell. Ein JavaScript- oder Python-**SDK** kann ebenfalls verwendet werden; es kapselt lediglich den Anfragecode. Der Satz „Erzeuge aus diesen Produktdaten einen Titel und Vorteile“ innerhalb der Anfrage ist der Prompt.

Plattformname, Model ID und API-Adresse sind nicht dasselbe. Verwende Adresse und ID aus dem offiziellen Codebeispiel und nicht die URL der Online-Demo.

### 1.3 Unbekannte APIs zunächst zurückstellen

Die Konsole kann auch Embedding, Rerank, Function Calling, OCR und Inhaltsmoderation anbieten. Embedding und Rerank dienen Wissensdatenbanken, OCR liest PDF-Dateien oder Belege und Function Calling verbindet Suche oder Datenbanken.

Das muss nicht alles sofort gelernt werden. Integriere zuerst eine API, die direkt zur Seitenfunktion gehört, und lies die weitere Dokumentation erst bei einem konkreten Bedarf.

## 2. Zuerst das Ergebnis ausprobieren

Bevor API-Code entsteht, wird das Modell in der Online-Testumgebung ausprobiert. Entscheidend ist nicht nur, ob es Text schreiben kann, sondern ob es das von der Seite benötigte Format liefert.

### 2.1 Nutzende beschreiben einfach ihr Ziel

Beginne wie eine reale Person:

```text
Ich möchte einen leichten Pendler-Rucksack aus schwarzem Nylon anbieten.
Er ist für den täglichen Arbeitsweg gedacht.
Schreibe einen kurzen Produkttitel und drei Verkaufsargumente.
```

In der fertigen Seite muss niemand diesen Absatz formulieren. Produktname, Material und Farbe werden in Felder eingetragen; das Programm ergänzt feste Regeln: keine Preise oder Verkaufszahlen erfinden, den Titel kurz halten und ein vorgegebenes Format liefern.

Wenn Titel, Zusammenfassung und Vorteile getrennt dargestellt werden, kann das Programm die JSON-Felder `title`, `summary` und `selling_points` verlangen. Die Eingabe bleibt natürlich, während die Seite das Ergebnis zuverlässig lesen kann.

Teste mehrere Produkte und lasse absichtlich ein Feld leer. Erfindet das Modell fehlende Angaben, müssen die festen Programmanweisungen verbessert werden – nicht die Nutzenden zu Prompt-Fachleuten gemacht werden.

### 2.2 Die API mit der Seite verbinden

Offizielle Dokumentationen enthalten meist ein curl-, JavaScript- oder Python-Beispiel. Gib es zusammen mit der gewünschten Funktion an die KI-IDE.

```text
Füge der Produktdetailseite eine Schaltfläche „Text erzeugen“ hinzu.

Beim Klick sollen die aktuellen Produktdaten an die folgende API gesendet
und der erzeugte Text auf der Seite angezeigt werden.

Lege die API Key nicht im Browser ab. Zeige Warten und Fehler verständlich an.
Nenne anschließend die nötige Konfiguration und den Start- und Testablauf.

Offizielles API-Beispiel:
<curl- oder SDK-Beispiel ohne echten Schlüssel einfügen>
```

Mit Seitenposition und offiziellem Beispiel muss die IDE das API-Format nicht erraten. Zuerst wird eine erfolgreiche Anfrage geprüft; für Bild, Sprache oder Video werden später Funktionsbeschreibung und Beispiel ausgetauscht.

## 3. Die erste Anfrage nach offiziellem Beispiel senden

Öffne nach dem Prompt-Test Quick Start oder API Reference. Für den ersten Aufruf werden nur Zieladresse, Position der API Key, Wert von `model` und kleinstes Beispiel benötigt.

Kopiere das offizielle curl-, JavaScript- oder Python-Beispiel und ändere nur Model ID und Testinhalt. Erhalte im Terminal eine normale Antwort, bevor der Code ins Projekt wandert. Bei einem späteren Seitenfehler ist dann bekannt, dass Konto, Schlüssel und Modell funktionieren.

Untersuche auch die Antwort: Text liegt häufig in einem JSON-Feld, Bilder liefern eine URL, Audio kann binär sein und Video gibt oft zuerst eine Aufgabennummer zurück. Die Seite muss zur tatsächlichen Antwort passen.

### 3.1 Lange Dokumentation mit KI lesen

Eine lange API-Dokumentation muss nicht vollständig gelesen werden. Gib der KI-IDE den aktuellen Link und lass nur die Angaben für den ersten Aufruf suchen.

```text
Lies diese API-Dokumentation: <Link>

Ich möchte die API mit JavaScript aufrufen. Zeige das einfachste Beispiel,
die Stellen für API Key und model sowie den Zugriff auf das Ergebnis.
Verwende ausschließlich dokumentierte Parameter.
```

## 4. Der erste Besuch in der Dienstkonsole

Schlüssel, Modellauswahl und Verbrauch befinden sich meist in der Konsole. Die Menünamen unterscheiden sich, die Aufgaben kaum.

### 4.1 Schlüssel erstellen und Eingang der Anfrage prüfen

Die API Key ist der Berechtigungsnachweis der Anwendung. Speichere sie in einer lokalen Umgebungsvariable, nie in Screenshots, Chats oder Frontend-Code. Bei möglicher Offenlegung wird sie sofort widerrufen und neu erstellt.

Öffne nach der ersten Anfrage Usage oder Billing und suche einen neuen Eintrag. Dort stehen auch Guthaben und Quota. Bei Fehlern wird geprüft, ob der Code nichts gesendet hat, die Plattform ablehnte oder kein Kontingent mehr vorhanden ist.

![DeepSeek-Usage-Seite mit Guthaben, Monatskosten und Aufruftrend](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-13-57-41.webp)

*Die Usage-Seite von DeepSeek zeigt Aufrufmenge, Kosten und Guthaben.*

Eine Request ID oder Trace ID aus der Fehlermeldung sollte aufbewahrt werden. Damit lässt sich der konkrete Aufruf in den Protokollen finden.

### 4.2 Modell auswählen und exakten Aufrufnamen kopieren

Der Modellkatalog zeigt verfügbare Text-, Bild-, Sprach- und Videomodelle. Öffne die Details und kopiere die Model ID für den Code; sie kann vom sichtbaren Namen abweichen.

![SiliconFlow-Katalog mit Filtern für Text, Bild, Video und Sprache](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-05-04.webp)

*Der SiliconFlow-Katalog lässt sich nach Fähigkeit filtern.*

Manche Plattformen verlangen Region oder Deployment, bevor Base URL und Endpoint erscheinen. Folge dann dem Schnellstart und verwende nicht die Konsolen-URL als API-Adresse.

![Volcengine-Ark-Schnellzugriff mit API Key und Testschritten](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-23-13-01.webp)

*Volcengine Ark bündelt Schlüsselerstellung, Modellauswahl und ausführbares Beispiel.*

### 4.3 Nutzungslimits und lange Aufgaben

RPM und TPM sind erlaubte Anfragen und Tokens pro Minute. Bild-, Sprach- und Videodienste begrenzen möglicherweise auch die Concurrency, also parallele Aufgaben. Bei Überschreitung folgt meist `429`; warte vor einem erneuten Versuch, statt ständig zu klicken.

Lange Aufgaben wie Videos liefern zunächst eine Task ID. Das Programm fragt den Fortschritt ab oder verwendet Callback/Webhook zur Benachrichtigung des Servers. File ID oder temporäre URL können ablaufen; für den Betrieb muss entschieden werden, ob die Datei in eigenen Speicher kopiert wird.

Parameter wie `max_tokens`, `temperature` und `stream` bleiben in der ersten Version auf den offiziellen Werten. `max_tokens` wird nur bei abgeschnittener Ausgabe geändert, `stream` nur für schrittweise Anzeige.

## 5. Das offizielle Beispiel in die Seite übernehmen

Nach einem erfolgreichen Terminaltest geht es in dieser Reihenfolge weiter:

1. Schlüssel in `.env.local` oder einer nicht in Git gespeicherten Datei ablegen.
2. Modell vom Server oder einer Serverless Function aufrufen.
3. Seite die eigene Route `/api/...` statt den Drittanbieter-Schlüssel aufrufen lassen.
4. Warten, Erfolg und Fehler am Button anzeigen.
5. In Usage den echten Aufruf bestätigen.

```text
Browserseite
    │ sendet nur Fachdaten
    ▼
Eigene /api-Route ── liest API Key aus der Serverumgebung
    │
    ▼
KI-Dienst ── liefert Text, JSON, Datei oder task_id
```

::: warning API Key schützen
Eine API Key gehört nicht in Vue-, React- oder HTML-Frontend-Code. Auch Variablen mit `VITE_` oder `NEXT_PUBLIC_` können in öffentlichen Browserdateien landen. Beim öffentlichen Betrieb ruft ein Backend, eine Serverless Function oder ein geschütztes Gateway das Modell auf.
:::

### 5.1 Manche APIs antworten nicht sofort

Kurzer Text, Bildverständnis und kurze Transkription kommen häufig in einer Anfrage zurück. Gespräche oder Echtzeitsprache können gestreamt und während des Empfangs angezeigt werden.

Bild- und Videogenerierung laufen oft asynchron: Zuerst kommt nur `task_id`, anschließend wird Warteschlange, Verarbeitung, Erfolg oder Fehler abgefragt. Das kann viele Sekunden dauern; eine unveränderte Ladeanzeige reicht nicht.

## 6. Zuerst Textgenerierung verbinden

Die [DeepSeek-API-Dokumentation](https://api-docs.deepseek.com/) bietet eine Textschnittstelle für verbreitete SDKs. Modelle ändern sich; kopiere die aktuelle ID aus der [Modellliste](https://api-docs.deepseek.com/api/list-models).

Sende zunächst mit curl dieselben Produktdaten wie im Onlinetest.

```bash
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DEEPSEEK_API_KEY}" \
  -d '{
    "model": "deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "Liefere JSON mit title, summary und selling_points. selling_points enthält drei Einträge. Erfinde keine Preise, Verkaufszahlen oder Wirkungen."},
      {"role": "user", "content": "Ich möchte einen schwarzen Nylon-Pendler-Rucksack anbieten. Schreibe einen kurzen Titel, eine Einführung und drei Verkaufsargumente."}
    ],
    "stream": false
  }'
```

Setze die Umgebungsvariable und führe den Befehl aus. Nach einer normalen Antwort erhält die KI-IDE dasselbe Beispiel und die Anweisung aus Abschnitt 2. Die erste Version braucht nur eine Schaltfläche und feste Produktdaten; danach folgt das vollständige Formular.

### Mit zwei Produkten testen

Ändere Name, Material und Farbe. Stimmen beide Ergebnisse zur Eingabe und werden richtig angezeigt, funktioniert die minimale Integration. Entferne anschließend ein Feld und prüfe erfundene Preise, Wirkungen oder Verkaufszahlen. Mit einer vorübergehend falschen Key lässt sich die Fehlermeldung testen.

Bestätige zum Schluss die Aufrufe in Usage. Sichtbarer Text beweist keinen API-Aufruf; übrig gebliebene Testdaten können genauso aussehen.

## 7. Bildverständnis am Beispiel Qwen3-VL

Ein visuelles Modell erhält Bild und Frage. Frage gezielt nach den Seitendaten; „Was ist auf diesem Bild?“ liefert meist eine zu allgemeine Beschreibung.

```text
Untersuche dieses Produktfoto. Nenne den Gegenstand, die Hauptfarbe,
sichtbare Materialien und Bauteile sowie Text im Bild.

Kennzeichne Unklares. Errate weder Marke, Preis noch Verkaufszahlen.
Gib JSON zurück, damit ich das Ergebnis auf der Seite anzeigen kann.
```

Im [SiliconFlow-Modellkatalog](https://cloud.siliconflow.cn/models) lassen sich aktuelle visuelle Modelle filtern. Hier erklärt `Qwen/Qwen3-VL-8B-Instruct` die Eingabestruktur; prüfe vor dem Lauf die aktuelle Model ID.

```python
import base64
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SILICONFLOW_API_KEY"],
    base_url="https://api.siliconflow.cn/v1"
)

with open("product.jpg", "rb") as image_file:
    image_data = base64.b64encode(image_file.read()).decode("utf-8")

response = client.chat.completions.create(
    model="Qwen/Qwen3-VL-8B-Instruct",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Gib Kategorie, Farbe, sichtbare Materialien und Struktur sowie Bildtext als JSON zurück. Errate nichts Unklares."},
            {"type": "image_url", "image_url": {
                "url": f"data:image/jpeg;base64,{image_data}"
            }}
        ]
    }]
)
```

![Einbindung der Bildverständnis-API in der KI-IDE](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-34-36.webp)

*Wenn Nutzende erkannte Produktdaten vor der Texterzeugung bestätigen, fallen Fehler leichter auf.*

## 8. Produktbilder erzeugen und bearbeiten

[Seedream](https://seed.bytedance.com/en/blog/deeper-thinking-more-accurate-generation-introducing-seedream-5-0-lite) erzeugt Bilder aus Text oder bearbeitet eine Vorlage. Bei Produktbildern müssen nicht nur Hintergrund, Aufbau und Licht, sondern auch unveränderliche Produktdetails beschrieben werden.

```text
Gestalte aus dem schwarzen Rucksack im Referenzbild ein vertikales Produktposter.
Stelle ihn mittig auf eine hellgraue Fläche, mit weichem Licht und Platz für einen Titel.
Füge keinen Text, kein Logo und keinen Preis hinzu und ändere Reißverschlüsse, Träger und Taschen nicht.
```

Prüfe im ersten Ergebnis vor Hintergrund und Komposition, ob das Produkt verformt wurde. Beginne nicht mit einer langen Liste von Stilwörtern.

Kopiere aktuelle Model ID und Minimalanfrage aus der [Volcengine-Ark-Konsole](https://www.volcengine.com/experience/ark?launch=seedream). Verwende nicht dauerhaft die Versionsnummer eines Tutorials.

```bash
curl -X POST https://ark.cn-beijing.volces.com/api/v3/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ARK_API_KEY}" \
  -d '{
    "model": "<aktuelle Bild-Model-ID aus der Konsole kopieren>",
    "prompt": "Gestalte aus dem schwarzen Referenzrucksack ein schlichtes vertikales Produktposter. Füge keinen Text, kein Logo und keinen Preis hinzu und ändere die Produktstruktur nicht.",
    "image": ["https://example.com/product-reference.png"],
    "response_format": "url",
    "stream": false,
    "watermark": false
  }'
```

![In das Produkt integrierte Bilderzeugung](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-23-21-13.webp)

Bild-URLs können ablaufen. Ein Prototyp kann sie direkt zeigen; für den Betrieb muss nach den Dienstbedingungen über eigenen Speicher entschieden und Prompt, Modellversion und Zeit protokolliert werden.

## 9. Spracherkennung und Sprachsynthese sind getrennte APIs

- **ASR / STT** wandelt Sprache oder Audiodateien in Text um.
- **TTS** verwandelt Text in abspielbare Sprache.

Eingaben, Ausgaben und Bedienung unterscheiden sich. Beide gehören nicht hinter eine unklare Schaltfläche „Sprach-API“.

### 9.1 Sprache zu Text: Audio hochladen und Transkript erhalten

Die [SiliconFlow-Transkriptionsdokumentation](https://docs.siliconflow.cn/cn/api-reference/audio/create-audio-transcriptions) lädt Dateien mit `multipart/form-data` statt JSON hoch.

```bash
curl --request POST \
  --url https://api.siliconflow.cn/v1/audio/transcriptions \
  -H "Authorization: Bearer ${SILICONFLOW_API_KEY}" \
  -F "file=@meeting.mp3" \
  -F "model=FunAudioLLM/SenseVoiceSmall"
```

```text
Füge der Seite eine Schaltfläche „Aufnahme hochladen und transkribieren“ hinzu.

Nach dem Hochladen einer mp3-, m4a- oder wav-Datei soll der Server die folgende API aufrufen
und den zurückgegebenen Text in ein bearbeitbares Feld setzen.
Lege die API Key in einer Umgebungsvariable ab und ermögliche einen neuen Versuch nach Fehlern.

Offizielles Beispiel:
<obiges curl-Beispiel einfügen>
```

### 9.2 Text-to-Speech kann Audio statt JSON liefern

Die [MiniMax-T2A-HTTP-Dokumentation](https://platform.minimax.io/docs/api-reference/speech-t2a-http) bietet synchrone Sprachsynthese. Das aktuelle Beispiel verwendet `speech-2.8-hd`; Modell und Stimme werden auf der Plattform geprüft.

Zahlen, Abkürzungen und Pausen werden für das Vorlesen vorbereitet, danach folgen Stimme, Tempo, Lautstärke, Emotion und Format. Eine ganze Seite mit Markdown, URLs und Schaltflächentext gehört nicht unverändert in die Sprachausgabe.

```bash
curl --request POST \
  --url https://api.minimax.io/v1/t2a_v2 \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "speech-2.8-hd",
    "text": "Dies ist eine Hörprobe der Produktbeschreibung.",
    "stream": false,
    "output_format": "hex",
    "language_boost": "auto",
    "voice_setting": {
      "voice_id": "<voice_id aus der Stimmenliste kopieren>",
      "speed": 1,
      "vol": 1,
      "pitch": 0
    },
    "audio_setting": {
      "sample_rate": 32000,
      "bitrate": 128000,
      "format": "mp3",
      "channel": 1
    }
  }'
```

Eine Audioseite benötigt auch Wiedergabe, Stopp, Neuerzeugung und Download. Streaming-TTS nutzt WebSocket oder Streaming-HTTP und spielt eintreffende Teile ab.

::: warning Stimme und Privatsphäre
Vor dem Hochladen einer Aufnahme werden Zweck, Aufbewahrungsdauer und Löschung erklärt. Stimmenklonen verlangt die ausdrückliche Zustimmung der betroffenen Person. Aufnahmen anderer oder bekannter Personen mit unklarer Herkunft dürfen nicht verwendet werden.
:::

## 10. Videogenerierung: Aufgabe erstellen und Ergebnis abwarten

Video-APIs arbeiten meist asynchron. Die [MiniMax-Videoanleitung](https://platform.minimax.io/docs/guides/video-generation) beschreibt drei Schritte: Aufgabe erstellen und `task_id` erhalten, Status bis `file_id` abfragen und Downloadadresse abrufen.

### 10.1 Auch die Veränderung der Szene beschreiben

Ein Video-Prompt enthält Ausgangsposition, Bewegungsfolge, Kamerarichtung und Dauer.

```text
Zeige diesen schwarzen Rucksack sechs Sekunden lang auf einem hellgrauen Podest.
Die Kamera bewegt sich langsam von vorn nach rechts und anschließend etwas näher heran.
Das Video bleibt vertikal. Verändere den Rucksack nicht und füge keine Person, keinen Text und kein Logo hinzu.
```

Bei vielen Aktionen wird mit einer Einstellung und einer Hauptbewegung begonnen. Drehen, Öffnen, Zoomen und Szenenwechsel zugleich erschweren eine gleichbleibende Produktform.

### 10.2 Erstellen und Abfragen sind zwei Anfragen

```bash
# Schritt 1: Aufgabe erstellen
curl --request POST \
  --url https://api.minimax.io/v1/video_generation \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "MiniMax-Hailuo-2.3",
    "prompt": "Zeige einen schwarzen Rucksack auf einem hellgrauen Podest. Die Kamera bewegt sich von vorn nach rechts und etwas näher heran. Verändere den Rucksack nicht und füge keine Person, keinen Text und kein Logo hinzu.",
    "duration": 6,
    "resolution": "1080P"
  }'

# Schritt 2: Status mit der erhaltenen task_id abfragen
curl --request GET \
  --url "https://api.minimax.io/v1/query/video_generation?task_id=<TASK_ID>" \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}"
```

Die Seite zeigt mindestens `Preparing`, `Queueing`, `Processing`, `Success` und `Fail`. Abfrageintervall und Ende werden festgelegt; im Betrieb kann `callback_url` den Server benachrichtigen.

::: warning Video und Material realer Personen
Bei Fotos oder Stimmen realer Personen, Marken und geschütztem Material sind Einwilligung und Plattformregeln zu prüfen. Gesichtsnachweis, Materialregistrierung oder Moderation sind keine Schritte, die im Browser umgangen werden dürfen.
:::

## 11. Häufige Probleme einordnen

| Symptom | Zuerst prüfen |
| --- | --- |
| `401 / 403` | Schlüssel, Berechtigung und Authentifizierungs-Header |
| `404` | Aktuelle Base URL, Endpoint und Model ID |
| `429` | RPM, TPM, Parallelität und Kontostufe |
| `400` | Pflichtwerte, Dateiformat, JSON-Struktur und Größe |
| `5xx / timeout` | Dienststatus, Zeitlimit und Wiederholung |
| Dauerhaft in Warteschlange | Parallelität, Statusabfrage, Kontingent und Last |
| Erfolg ohne Inhalt | Antwortpfad, Binärdaten und abgelaufene URL |
| Lokal erfolgreich, online nicht | Variablen, CORS, Serverless-Zeitlimit und Regionsnetz |

Für die Fehlersuche werden Zeitpunkt, Anfragetyp, HTTP-Status und Request ID oder Trace ID gespeichert. API Key, vollständige Nutzeraufnahmen und sensible Geschäftsdaten gehören nicht in Protokolle.

## 12. 📚 Aufgabe des Kapitels

<StageAssignmentCard title="Eine KI-Funktion in den Prototyp integrieren">

  <p>Wähle eine Schaltfläche, die wirklich KI benötigt. Für die erste Version genügt eine Fähigkeit; Text, Bild, Sprache und Video müssen nicht gemeinsam umgesetzt werden.</p>

  <ol>
    <li>Aktuelle Model ID und Minimalbeispiel in der offiziellen Dokumentation finden.</li>
    <li>Beispiel an die KI-IDE geben und mit der Schaltfläche verbinden.</li>
    <li>API Key in einer Servervariable speichern und Warten und Fehler anzeigen.</li>
    <li>Einen echten Aufruf ausführen und in Usage oder den Protokollen bestätigen.</li>
  </ol>

  <p>Speichere eine Bildschirmaufnahme und erkläre in einem Satz, was die KI auf dieser Seite für die Person erledigt. Vor fremden Bildern, Stimmen oder Personenmaterial muss die Nutzungserlaubnis geklärt sein.</p>
</StageAssignmentCard>

## Nächster Schritt

Im nächsten Kapitel kehren diese Funktionen in einen vollständigen Produktablauf zurück. Daten, Zustände und Rückmeldungen machen aus einem einzelnen API-Aufruf einen wiederholt nutzbaren Prototyp.

<RelatedArticlesSection
  title="Verwandte Artikel"
  description="Von einer KI-Funktion zum vollständigen Produktablauf."
  :items="relatedArticles"
/>
