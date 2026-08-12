# Anfänger I: Im AI-Zeitalter reicht es zu sprechen, um programmieren zu können

Dies ist ein **auf Projekt-Based Learning basierendes** Lern-Tutorial. Wir ermutigen dich, den Schritten zu folgen und die Ergebnisse zu reproduzieren.
Keine Sorge vor Fehlern oder Änderungen – wir glauben immer an dich. Bitte behalte Folgendes im Gedächtnis:

<div style="text-align: center;">
<div style="display: inline-block; padding: 8px 20px; border-radius: 8px; border: 1px dashed #FFB6C1; background: linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%); margin: 12px 0;">
  <span style="font-size: 15px; font-weight: 500; color: #666;">Fertigstellen ist wichtiger als Perfektion</span>
</div>
</div>

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const duration = 'Etwa <strong>4 Stunden</strong>, in mehreren Sitzungen abschließbar'
const relatedArticles =
  relatedArticlesMap['de-de/stage-1/ai-capabilities-through-games'] ?? []
</script>

## Kapitelübersicht

<ChapterIntroduction :duration="duration" :tags="['Konversationelles AI-Programmieren', 'AI-native Mini-Spiele', 'Snake-Spiel-Praxis']" coreOutput="AI-native Snake + eigenes Mini-Spiel" expectedOutput="1 lauffähige AI-native Snake + (optional) 1 selbst erstelltes AI-native Mini-Spiel oder Demo">

Wenn du **überhaupt nicht programmieren kannst** oder nur ein wenig davon verstehst, ist dieses Kapitel genau für dich gemacht. Wir beginnen mit den Grundlagen: AI durch **Gespräche** Code schreiben zu lassen – ohne Syntax auswendig zu lernen, ohne Umgebungen einzurichten, und alles läuft direkt im Browser.

Du wirst **dein erstes lauffähiges Programm** selbst bauen – eine Snake, die „Wörter frisst, Gedichte schreibt und malt". Durch diese praktische Übung wirst du erleben, wie sich AI-Programmieren wirklich anfühlt: Nicht dass AI dein Denken ersetzt, sondern dass du deine Ideen aussprichst und AI sie umsetzt.

Alle Kreationen beginnen bei 0 und werden zu 1. Wir freuen uns, dir Selbstvertrauen und Professionalität zu vermitteln. Für dich gilt: **Ausführungsfähigkeit is all you need**.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Herausforderungen & Chancen', description: 'Neue Möglichkeiten für normale Menschen' },
      { title: 'Fähigkeiten erkunden', description: '60-Sekunden-Schnellstart' },
      { title: 'Native Praxis', description: 'AI-native Snake bauen' },
      { title: 'Kreativer Ausbau', description: 'Weitere Spiele entwickeln' }
    ]" />
  </ClientOnly>
</div>

## 1. Herausforderungen und Chancen für normale Menschen

Viele Menschen haben den Kopf voller Produktideen: ein kleines Tool zur Budgetverwaltung, eine Webseite, die das Wachstum des Kindes dokumentiert, oder sogar ein kleines Spiel. Aber sobald sie an Code oder Programmierer denken, werden sie sofort abgeschreckt.

Seit dem Aufkommen von AI gibt es erstmals eine völlig neue Möglichkeit für normale Menschen: Du musst nicht programmieren können, du musst nur lernen, AI klar zu sagen, was du willst. Daten von GitHub Copilot [zeigen](https://www.wearetenet.com/blog/github-copilot-usage-data-statistics), dass über 15 Millionen Entwickler AI-gestütztes Programmieren nutzen und im Durchschnitt 46% des Codes von AI generiert wird! Bei Java-Projekten liegt dieser Anteil bei 61%.

<el-card shadow="hover" style="margin: 20px 0; border-radius: 12px;">
  <template #header>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 20px;">🚀</span>
      <span style="font-weight: bold; font-size: 16px;">Effizienz- und Adaptionssteigerung</span>
    </div>
  </template>
  
  <el-row :gutter="20" style="margin-bottom: 24px;">
    <el-col :span="6" :xs="12">
      <div style="text-align: center; padding: 10px;">
        <div style="color: #409EFF; font-size: 24px; font-weight: bold;">55%</div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">Geschwindigkeitssteigerung</div>
      </div>
    </el-col>
    <el-col :span="6" :xs="12">
      <div style="text-align: center; padding: 10px;">
        <div style="color: #67C23A; font-size: 24px; font-weight: bold;">2.4 <span style="font-size: 14px;">Tage</span></div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">Aufgabendauer (vorher 9.6 Tage)</div>
      </div>
    </el-col>
    <el-col :span="6" :xs="12">
      <div style="text-align: center; padding: 10px;">
        <div style="color: #E6A23C; font-size: 24px; font-weight: bold;">81%</div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">Ersttags-Installationsrate</div>
      </div>
    </el-col>
    <el-col :span="6" :xs="12">
      <div style="text-align: center; padding: 10px;">
        <div style="color: #F56C6C; font-size: 24px; font-weight: bold;">96%</div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">Vorschlagsannahmerate</div>
      </div>
    </el-col>
  </el-row>

  <div style="line-height: 1.8; color: #606266;">
    Was wirklich begeistert, ist der Sprung in der Effizienz: Die Geschwindigkeit bei der Aufgabenerledigung stieg um <b>55%</b>. Was früher 9,6 Tage brauchte, ist jetzt in <b>2,4 Tagen</b> erledigt. Dieser sichtbare Effizienzgewinn zeigt, dass AI nicht mehr nur ein „optionales Werkzeug" ist, sondern zu einem unverzichtbaren Programmierassistenten im Entwicklungsprozess wird. Die Adaptionsraten bestätigen dies: Am Tag der Zugangsgewährung installierten <b>81%</b> der Entwickler sofort und begannen es zu nutzen; davon <b>96%</b> übernahmen noch am selben Tag AI-generierte Codevorschläge. Mit anderen Worten: Entwickler integrierten AI fast sofort in ihre tägliche Arbeit.
  </div>
</el-card>

Für normale Menschen ist dieser Trend noch bedeutsamer: Wenn selbst professionelle Programmierer stark auf AI angewiesen sind, um Code zu schreiben, **warum sollten wir, die nicht programmieren können, nicht direkt mit AI sprechen, um unsere Ideen umzusetzen?**

Das Ziel dieses Kurses ist es, dir eine neue Fähigkeit beizubringen: Anwendungen durch natürliche Sprachgespräche zu erstellen. Wir bringen dir bei, wie du mit AI in der Sprache des Computers kommunizierst und wie du AI dazu bringst, die Ideen in deinem Kopf in echte, nutzbare Produkte zu verwandeln.

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="1" :items="[
      { title: 'Herausforderungen & Chancen', description: 'Neue Möglichkeiten für normale Menschen' },
      { title: 'Fähigkeiten erkunden', description: '60-Sekunden-Schnellstart' },
      { title: 'Native Praxis', description: 'AI-native Snake bauen' },
      { title: 'Kreativer Ausbau', description: 'Weitere Spiele entwickeln' }
    ]" />
  </ClientOnly>
</div>

## 2. Wie weit kann AI dich bringen?

In diesem Abschnitt diskutieren wir nur eine Frage: Wenn du überhaupt nicht programmieren kannst, wieweit kann die heutige AI dich bringen?

Grob gesagt kannst du die Fähigkeiten aktueller Modelle so verstehen: Sie können **einfache interne Tools**, **Daten-Visualisierungs-Dashboards** und einige **leichte Mini-Spiele** entwickeln. Diese Fähigkeiten reichen für **eigene Tools** und für die **Validierung von Anforderungen aus der Perspektive eines Produktmanagers** völlig aus. Um jedoch per Knopfdruck ein **marktreifes, ausgereiftes Produkt** zu generieren, ist in der Regel immer noch menschliche Arbeit bei der **Prozessgestaltung**, **Detailoptimierung** und fortlaufenden Verbesserung nötig.

Schauen wir uns als Nächstes am Beispiel des Snake-Spiels an, wieweit AI-Programmieren tatsächlich gehen kann.

### 2.1 Ein Snake-Spiel in 60 Sekunden

Öffne zunächst die experimentelle Webseite [z.ai](https://chat.z.ai/), die im Tutorial verwendet wird. `z.ai` ist eine von Zhipu AI (einem der führenden chinesischen Sprachmodellunternehmen) entwickelte AI-Plattform, deren Kernfunktionen von Zhipus selbstentwickelter GLM-Serie bereitgestellt werden. Die Plattform integriert mehrere AI-Funktionen, darunter Folien-Generierung, Poster-Design und Full-Stack-Entwicklung. In diesem Tutorial konzentrieren wir uns auf die Nutzung des Full-Stack-Entwicklungsmoduls.

::: details 💡 Was ist das neue Paradigma „Programmieren im Browser"?

Früher erforderte die Entwicklung einer Webanwendung:
- Installation einer Programmierumgebung (z. B. Python, Node.js)
- Einrichtung eines Code-Editors
- Erlernen von Sprachen wie HTML/CSS/JavaScript
- Bewältigung von Abhängigkeiten und Fehlern

Heute reicht es mit AI-Programmierplattformen aus:
- Browser öffnen, Webseite aufrufen
- Gewünschte Funktionen in natürlicher Sprache beschreiben
- AI generiert automatisch Code und zeigt Echtzeitvorschau

Dieses Paradigma „Gespräch als Programmierung" verwandelt das Programmieren vom „Code schreiben" zum „Anforderungen beschreiben". Du musst dich nicht um technische Details kümmern, sondern musst AI nur klar sagen, was du willst, und es verwandelt deine Ideen in lauffähige Programme. Das ist das neue Paradigma des Programmierens im AI-Zeitalter – **Vibe Coding**.
:::

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/index-2026-01-07-18-25-03.png)

Gib nach der Eingabe unserer einfachen Anforderung auf **Full-Stack-Entwicklung** klicken, kannst du den kompletten Erstellungsprozess der Webseite in Echtzeit beobachten. Normalerweise reicht die Zeit für eine Tasse Kaffee, und die Webseite ist automatisch fertig!

```
Erstelle ein Snake-Spiel für mich:
1. Steuerung der Schlange mit Pfeiltasten
2. Die Schlange wird nach dem Fressen von Nahrung länger und der Punktestand erhöht sich
3. Das Spiel endet bei Kollision mit Wänden oder dem eigenen Körper
4. Es sollte Start- und Neustart-Buttons geben
5. Die Oberfläche soll übersichtlich und ansprechend sein
```

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/index-2026-01-07-18-34-03.png)

Nach der Generierung siehst du rechts eine durchblätterbare Weboberfläche. Du kannst nach oben und unten scrollen, um den Seiteninhalt zu betrachten, oder oben auf die 🧭 -Schaltfläche klicken, um in den Vollbildmodus zu wechseln.

> Von links nach rechts oben: Pfeil-Schaltfläche öffnet die Seitenleiste mit dem Gesprächsverlauf, Stift-Schaltfläche für einen neuen Dialog, Kreisschaltfläche aktualisiert die Seite, Kompass-Schaltfläche schaltet in den Vollbildmodus, Download-Schaltfläche lädt das Projekt herunter, <>-Schaltfläche schaltet zur Code-Ansicht, Publish-Schaltfläche veröffentlicht das Projekt.

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/index-2026-01-07-18-35-11.webp)

Wenn du den Quellcode der Webseite anzeigen möchtest, klicke auf das Code-Symbol oben rechts, um den vollständigen Code zu sehen.

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image7.png)

::: tip 🌐 Entdecke weitere AI-Programmierwerkzeuge

Neben z.ai empfehlen wir dir, auch folgende hervorragende AI-Programmierplattformen auszuprobieren:

| Werkzeug | Adresse | Merkmale |
|------|------|------|
| **Kimi Code** | [kimi.com/code/console](https://kimi.com/code/console) | KI-Programmierassistent von Moonshot AI mit terminalbasiertem Kimi Code CLI und VS-Code-Erweiterung, basierend auf dem auf Programmierung spezialisierten Modell Kimi K2.7 Code, kompatibel mit Claude Code, Roo Code usw. |
| **Google AI Studio** (empfohlen) | [aistudio.google.com/apps](https://aistudio.google.com/apps) | Offizielles Google-Produkt, unterstützt Gemini-Modelle, geeignet für schnelle Prototypenentwicklung |
| **Figma Make** | [figma.com/make](https://www.figma.com/make) | Tiefe Integration mit Designwerkzeugen, geeignet für Designer zur schnellen Erstellung interaktiver Prototypen |
| **Coze** | [coze.com](https://www.coze.cn) | AI-Bot-Plattform von ByteDance, bietet No-Code-Visuellerstellung. Tiefe Integration mit nationalen Modellen wie Doubao und Kimi, unterstützt Plugin-Marktplatz, geplante Aufgaben und Multi-Kanal-Publishing |
| **v0.dev** | [v0.dev](https://v0.dev) | AI-UI-Generierungstool von Vercel, generiert lauffähige React-Komponenten-Code aus Beschreibungen |
| **Bolt.new** | [bolt.new](https://bolt.new) | AI-Full-Stack-Entwicklungsplattform von StackBlitz, generiert und deployt komplette Webanwendungen |
| **Lovable** | [lovable.dev](https://lovable.dev) | Spezialisiert auf hochwertige React-Anwendungen, unterstützt GitHub-Integration und One-Click-Deployment |
| **Replit Agent** | [replit.com](https://replit.com) | Online IDE mit integriertem AI-Programmierassistenten, unterstützt mehrere Sprachen und Echtzeit-Zusammenarbeit |

Für einen detaillierten Vergleich und Tutorial zu Web-Programmierwerkzeugen siehe unsere Ergänzungslektüre: [Vergleich von 7 Vibe-Coding-Plattformen](../../stage-1/appendix-articles/example0-1/vibe-coding-tools-snake-game-tutorial.md)
:::

### 2.2 Was kann und was kann konversationelles Programmieren?

Dieser Abschnitt konzentriert sich auf eine konkrete Frage: Wenn du dich nur auf konversationelle AI verlässt und keinen Code schreibst, wieweit kann es die Dinge vorantreiben?

Auf Erfahrungsebene lautet eine relativ stabile Schlussfolgerung: Es kann dir helfen, etwas „kleines, aber Vollständiges" zu erstellen, aber „wann ist es genug" musst du bei jedem Schritt selbst entscheiden.

#### Besser bei „kleinen und klaren" Anwendungen

Aus dem vorherigen Snake-Beispiel hast du bereits ein typisches Muster gesehen:
Solange du die Oberfläche und Interaktion klar beschreiben kannst, kann AI normalerweise innerhalb weniger Gesprächsrunden eine vollständige Webseite erstellen, die sich öffnen, anklicken und spielen lässt.

Solche Aufgaben haben oft gemeinsame Merkmale:

- Klaren Umfang: eine Webseite, ein einfaches internes Tool, ein kleines Spielprinzip
- Sichtbare Ergebnisse: Du kannst sofort im Browser überprüfen, ob es wie erwartet funktioniert
- Direkte Fehlerbehebung: Bei Problemen kannst du in nachfolgenden Gesprächen spezifische Phänomene beschreiben und Korrekturen anfordern (durch Kopieren von Fehlern oder Screenshots)

Innerhalb dieser Grenzen kannst du konversationelle AI als einen „Hilfsentwickler mit guter Ausführung" betrachten. Du musst nur in jeder Runde die Anforderungen in natürlicher Sprache verfeinern und korrigieren, um schnell einen brauchbaren Prototyp zu erhalten.

**Erfolgsquote von AI bei kleinen Projekten:**
<el-progress :percentage="90" :stroke-width="15" status="success" striped striped-flow />

#### Große Projekte brauchen eine „Prozessperspektive"

Sobald du den Bereich „klein und klar" verlässt und erwartest, dass AI mit wenigen Gesprächsrunden ein komplexes System End-to-End erstellt, wirst du schnell an Grenzen stoßen. Große Projekte müssen Backends anbinden, Datenbanken verbinden, Drittanbieterdienste integrieren und betreffen Berechtigungen, Sicherheit, Nebenläufigkeit und viele Geschäftsregeln – das Ziel ist die Lieferung eines kompletten Systems, nicht einer einzigen Webseite.

In diesem Fall ist es vernünftiger, nicht alle Anforderungen auf einmal an AI zu werfen, sondern zuerst einen klaren Gesamtprozess zu skizzieren: Was sind die Schlüsselschritte, was sind die Eingaben, Ausgaben und Zustandsänderungen bei jedem Schritt, und welche Knoten sind am empfindlichsten für Leistung und Sicherheit. Basierend auf diesem Prozessdiagramm kannst du relativ unabhängige Schritte herauslösen und der konversationellen AI zur Generierung von Schnittstellen, Modulen, Skripten und Tests übergeben.

Nach aktueller Leistungsfähigkeit ist AI besser darin, einzelne kleine Schritte zu beschleunigen, während du (oder dein Team) entscheidest, wie die Schritte aufgeteilt und verknüpft werden, sowie für die endgültige Architektur, Systemintegration und den Betrieb verantwortlich bist.

#### Der Unterschied zwischen „können schreiben" und „brauchbar sein"

Auf den ersten Blick scheint AI alles zu können, aber wie brauchbar sind diese Dinge wirklich, und wieweit? Wie sollten wir das einordnen?

Eine hilfreiche Faustregel:

::: warning ⚠️ Leitfaden für Anwendungsszenarien

- **Prototyp / Demo / internes Tool**: Sehr geeignet, um von AI die erste Version erstellen zu lassen, dann selbst Details zu iterieren.
- **Große Produkte für echte Nutzer**: Erfordert normalerweise langfristiges Engagement von Ingenieuren in Architektur, Abstraktion, Leistung und Wartung.
- **Stark sicherheits- oder compliancekritische Systeme** (z. B. Zahlung, Risikokontrolle, Medizin): In der aktuellen Phase sollte man nicht „generieren und sofort live schalten"; es muss strenge Prüf- und Testprozesse geben.
  :::

Heutzutage kannst du AI relativ beruhigt als effizienten Partner für Demos und interne Tools betrachten:
Solange du bereit bist, mehr zu testen, mehr zu iterieren und ein paar Runden „Hier stimmt etwas nicht, bitte korrigiere es und erkläre warum" zu spielen, ist die Qualität auf Prototyp- und Tool-Ebene normalerweise ausreichend und hat praktischen Wert.

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="2" :items="[
      { title: 'Herausforderungen & Chancen', description: 'Neue Möglichkeiten für normale Menschen' },
      { title: 'Fähigkeiten erkunden', description: '60-Sekunden-Schnellstart' },
      { title: 'Native Praxis', description: 'AI-native Snake bauen' },
      { title: 'Kreativer Ausbau', description: 'Weitere Spiele entwickeln' }
    ]" />
  </ClientOnly>
</div>

## 3. Praxis: Deine erste AI-native Anwendung

Kommen wir zum praktischen Teil. Im vorherigen Abschnitt haben wir mit AI schnell einen spielbaren Snake-Prototyp erstellt und grob verstanden, was AI kann und was nicht. Als Nächstes lernen wir, wie man mit grundlegenden **Vibe Coding**-Techniken eine **moderne** AI-native Snake erstellt. Wir lassen die Schlange Textzeichen statt Bohnen fressen. Am Ende soll das Spiel basierend auf den gefressenen Textzeichen ein Gedicht und ein Bild generieren.
Durch dieses praktische Beispiel verstehst du den Kern des neuen Programmierparadigmas: Wie man Anforderungen klar in natürlicher Sprache ausdrückt.

### 3.1 AI-native Snake

Am Anfang können wir auf die einfachste Weise mit dem großen Modell sprechen, was uns hilft, schnell einen Produktprototyp zu erhalten. Gib einfach im Chat ein:

> **💡 Beispiel-Prompt:** Erstelle ein Snake-Spiel für mich
>
> ![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image12.webp)

> **💡 Beispiel-Prompt:** Erstelle ein Snake-Spiel, das Folgendes unterstützen soll:
>
> 1. Ich kann verschiedene Wörter fressen, die in einer Box gesammelt werden
>    ![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image13.webp)

> **💡 Beispiel-Prompt:** Erstelle ein Snake-Spiel, das Folgendes unterstützen soll:
>
> 1. Ich kann verschiedene Wörter fressen, die in einer Box gesammelt werden
> 2. Wenn die Schlange 8 Wörter gefressen hat, soll das LLM basierend auf diesen Wörtern ein Gedicht erstellen; wir können das Gedicht nach Bedarf neu mischen.
> 3. Nach Abschluss des Gedichts wird automatisch ein Bild basierend auf dem Gedicht erstellt.
>
> ![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image14.webp)

Beachte, dass während der Entwicklung Probleme auftreten können, bei denen zum Beispiel das Klicken auf einen Button keine Reaktion zeigt, Fehler bei der Nutzung von Funktionen auftreten, Funktionen nicht wie erwartet arbeiten oder die Frontend-Oberfläche nicht dem erwarteten Design entspricht.

In diesem Fall müssen wir das Modell weiter fragen, um diese unerwarteten Probleme zu beheben.

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image15.webp)

### 3.2 Neue Funktionen zum Spiel hinzufügen

Nachdem die Grundfunktionen fertig sind, können wir versuchen, unserem Programm einige neue Extras hinzuzufügen! Wenn du das Fressen von Wörtern oder Zeichen zu langweilig findest, kannst du die Schlange Wörter in verschiedenen Farben fressen lassen und entsprechend die Farbe der Schlange ändern.

Du kannst auch Spezialeffekte für den „Fress"-Vorgang hinzufügen oder magische Wörter einführen, die Effekte auslösen – zum Beispiel die Geschwindigkeit oder Größe der Schlange erhöhen. Eine andere Idee ist, bei jedem gefressenen Wort ein Gedicht und ein Bild generieren zu lassen, anstatt bis zu acht Wörtern zu warten.

Wenn das zu anspruchsvoll klingt, kannst du das Sprachmoduell direkt um Hilfe bitten! Es kann kreative Vorschläge machen, um dein Spiel interessanter zu gestalten. Probier es aus!

```
1. „Wörter erschließen Welten"-Mechanismus
   Funktion: Nachdem die Schlange ein Wort gefressen hat, generiert das Bildmodell sofort ein kleines Kunstwerk für dieses Wort, das sich nach und nach zu einer einzigartigen, vom Spieler geschaffenen Panoramaansicht zusammensetzt – „malend und dichtend" beim Spielen.

2. „Gedicht-Puzzle"-Gameplay
   Funktion: Jedes gefressene Wort veranlasst das LLM, eine Gedichtzeile zu generieren, und das Bildmodell erstellt eine Illustration; am Ende einer Runde fügt sich alles wie ein Puzzle zu einem AI-kollaborativen Gedicht und Bild zusammen.

3. „Magische Wörter" & „Story-Verzweigungen"
   Funktion: Beim Fressen magischer Wörter wie „Wind", „Nacht" oder „Traum" ändert das LLM das Szenenthema und schaltet den Bildstil auf Nacht-, Sturm- oder Traumatmosphäre um; die verschiedenen gefressenen Wörter lassen die AI-generierte Geschichte ständig weiterentwickeln.

4. „Echtzeit-Interaktionsgenerierung"
   Funktion: Pro gefressenem Wort generiert das LLM einen Dialog oder eine Beschreibung, sodass NPCs im Spiel „sprechen" können und sich die Umgebung entsprechend verändert; auch das Aussehen der Schlange und die Hindernisse ändern sich je nach gefressenen Wörtern.

5. „Satz-Snake"-Herausforderung
   Funktion: Umgekehrter Modus – das LLM gibt eine Gedichtzeile oder ein Rätsel vor, und der Spieler führt die Schlange, um die Wörter in der richtigen Reihenfolge zu fressen und den Satz zu rekonstruieren; falsch gefressene Wörter lösen über das Bildmodell lustige, künstlerische Konsequenzen aus.

6. „Themen-Level" & „Stilauswahl"
   Funktion: Zu Beginn wählt der Spieler ein Thema wie „Märchen", „Sci-Fi" oder „Tang-Gedichte", und LLM und Bildmodell passen Wortwahl, Gedichtstil und Bildgestaltung entsprechend an, sodass jeder Durchlauf frisch wirkt.

7. „Live-Zusammenarbeit"
   Funktion: Beim Fressen eines besonderen Wortes fordert das LLM den Spieler auf, einen Satz einzugeben oder einen Stil zu wählen, und generiert dann passende Verse und Illustrationen – eine echte Mensch-AI-Zusammenarbeit.

8. „Wachsende Geschichte"
   Funktion: Während die Schlange weiter wächst, schreibt das LLM das Geschichtsgedicht fort, und das Bildmodell generiert ein langes Panorama-Bild, sodass der Spieler „Schreiben, Malen und Spielen" gleichzeitig erlebt.

```

Darüber hinaus können wir das LLM bitten, projektweite Prompts für uns zu generieren. Im vorherigen Abschnitt haben wir nur selbst den Prompt für das Snake-Spiel geschrieben. Lass uns jetzt versuchen, das Modell einen Prompt mit einem Gesamtframework und Implementierungspfad generieren zu lassen (du kannst das direkt mit z.ai machen).

Wenn du lernen möchtest, bessere Prompts zu schreiben, siehe das [Prompt-Engineering-Appendix](/zh-cn/appendix/8-artificial-intelligence/prompt-engineering).

> Ich möchte, dass AI ein Web-Snake-Spiel generiert. Ich brauche einen umfassenderen Prompt, damit das Ergebnis beeindruckender und interessanter wird. Bitte generiere einen entsprechenden Prompt. Das aktuelle Ziel ist: ein Snake-Spiel zu generieren, das die Funktion des Fressens verschiedener Wörter zur Gedichtgenerierung implementieren soll und ein Bildgenerierungsmodul enthalten sollte.

Die Antwort von z.ai wird ungefähr so aussehen:

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image56.webp)

Wir können diesen Prompt verwenden, um das Projekt im Full-Stack-Modus neu zu generieren:

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image57.webp)

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image58.webp)

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="3" :items="[
      { title: 'Herausforderungen & Chancen', description: 'Neue Möglichkeiten für normale Menschen' },
      { title: 'Fähigkeiten erkunden', description: '60-Sekunden-Schnellstart' },
      { title: 'Native Praxis', description: 'AI-native Snake bauen' },
      { title: 'Kreativer Ausbau', description: 'Weitere Spiele entwickeln' }
    ]" />
  </ClientOnly>
</div>

### 3.3 Versuche, andere Mini-Spiele zu erstellen

Neben dem Snake-Spiel können wir der Fantasie freien Lauf lassen.

Erschaffe alles, was du willst, versuche sogar, alles kaputt zu machen! Und dann fang von vorne an!

1. AI-Kunstgalerie-Plattform: Hilf mir, eine Online-Galerie zu bauen, in der Nutzer AI-generierte Kunstwerke hochladen, durchstöbern, liken und kommentieren können, mit Übersicht nach Stilen sortiert.
2. Retro-Spiele-Archiv: Hilf mir, eine Website zu bauen, die klassischen Spielen Tribut zollt, mit Spielgeschichte, Spielanleitungen und einigen direkt online spielbaren Retro-Minispielen.
3. Tracker für nachhaltigen Lebensstil: Hilf mir, ein CO₂-Fußabdruck-Tracking-Tool zu bauen, das nach Eingabe des Alltagsverhaltens automatisch den CO₂-Ausstoß schätzt und Umwelttipps sowie wöchentliche Challenges bietet.
4. Virtueller Küchenassistent: Hilf mir, einen AI-Kochassistenten zu bauen, der bei Eingabe der zu Hause vorhandenen Zutaten Rezepte empfiehlt und Schritt-für-Schritt-Kochanleitungen gibt.
5. Underground-Musik-Entdeckungsplattform: Hilf mir, eine Musik-Streaming-Website zu bauen, die unabhängige und aufstrebende Künstler in den Fokus rückt und das Erstellen von Playlists sowie Kommentar-Interaktion unterstützt.
6. Minimalistisches Aufgabenverwaltungssystem: Hilf mir, ein Aufgabenverwaltungstool im minimalistischen Stil zu bauen, das das Erstellen von Aufgaben, das Festlegen von Prioritäten, Drag-and-Drop-Sortierung und die Anzeige des Fortschritts unterstützt.
7. Sci-Fi-Schreibwerkstatt: Hilf mir, eine Sci-Fi-Schreibplattform zu bauen, die Worldbuilding-Vorlagen, Charakter-Profilkarten und Story-Outline-Werkzeuge bereitstellt, damit Autoren ihre Settings aufbauen können.
8. Persönlicher Wissensgraph: Hilf mir, ein visuelles Notiz-Tool zu bauen, das verstreute Ideen in Knoten verwandelt und zusammenhängende Inhalte mit Verbindungslinien zu einem Wissensnetz verknüpft.
9. Virtueller Pflanzengarten: Hilf mir, eine Pflanzen-Enzyklopädie-Website zu bauen, die Bebilderungen und Informationen zu verschiedenen Pflanzen enthält und in der Nutzer eigene virtuelle Pflanzen pflanzen und beim Wachsen beobachten können.
10. Programmier-Challenge-Arena: Hilf mir, eine Online-Programmierwettbewerbsplattform zu bauen, die Algorithmusaufgaben verschiedener Schwierigkeitsgrade, einen Online-Code-Editor, automatische Bewertung und eine Rangliste bietet.

Und noch mehr... Wenn du gerne spielst, lass uns gemeinsam versuchen, Spiele zu erschaffen!

1. 3D-Open-World-RPG: Hilf mir, ein frei erkundbares 3D-Open-World-Spiel mit Tag-Nacht-Zyklus, Wetterwechseln, Quest-System und Charakterentwicklung zu bauen.
2. Ego-Shooter (FPS)-Arena: Hilf mir, ein schnelles Multiplayer-FPS-Spiel zu bauen, das Team-Deathmatch, Capture the Flag, mehrere Spielmodi und mehrere Karten unterstützt.
3. AI-Schach und Mehrspieler: Hilf mir, eine Schachplattform zu bauen, auf der man sowohl gegen AI-Gegner verschiedener Schwierigkeitsgrade als auch online gegen echte Spieler antreten kann.
4. Mahjong-Online-Mehrspieler: Hilf mir, ein traditionelles Mahjong-Spiel zu bauen, das mehrere Regelwerke, private Räume und automatische Punktezählung unterstützt.
5. Rundenbasiertes Strategiespiel: Hilf mir, ein rundenbasiertes Strategiespiel auf einer Rasterkarte mit Einheitenbewegung, Angriff, Upgrade und Nebel des Krieges zu bauen.
6. Zeitfahr-Rennspiel: Hilf mir, ein 3D-Rennspiel mit Fokus auf Zeitfahr-Gameplay zu bauen, das mehrere Strecken, Fahrzeug-Tuning und Geister-Replays unterstützt.
7. Kartenspiel (Deck-Building): Hilf mir, ein Kartenspiel zu bauen, in dem Spieler Karten sammeln, frei Decks bauen und an Ranglisten-Kämpfen teilnehmen können.
8. Battle Royale (Top-Down 2D): Hilf mir, ein Top-Down-2D-Battle-Royale-Spiel mit Schrumpfzone, zufälliger Beute und Solo-/Team-Modus zu bauen.
9. Horror-Überlebensspiel (Ego-Perspektive): Hilf mir, ein Horror-Überlebensspiel in der Ego-Perspektive zu bauen, mit Fokus auf Ressourcenmanagement, dem Schleichen an Gegnern vorbei und der Suche nach einem Fluchtweg.
10. Musik-Rhythmus-Spiel (3D): Hilf mir, ein 3D-Musik-Rhythmus-Spiel zu bauen, bei dem Noten im Takt der Musik von weitem heranfliegen und der Spieler sie zum richtigen Zeitpunkt trifft, um Punkte zu erzielen.

### 3.4 Handverlesene Fälle aus dem Netz: Was andere mit AI gebaut haben

An diesem Punkt fragst du dich vielleicht immer noch: Snake ist doch nur ein Einstiegsbeispiel – kann AI wirklich komplexere Spiele bauen?

Die Antwort ist ja. Im Folgenden findest du **8** handverlesene, öffentlich zugängliche Fallbeispiele aus dem Netz – von Sammlungen klassischer Arcade-Spiele und 2048-artigen Puzzles über Nachbauten von *Minecraft* und *Super Mario* bis hin zu einem 3D-Spiel und einer offiziellen Spielplattform des chinesischen LLM Kimi. Manche dieser Entwickler sind Programmierer, andere völlige Anfänger ohne Vorkenntnisse – aber allen gemeinsam ist: **Sie haben AI per Dialog den Großteil des Codes schreiben lassen**.

#### 🕹️ Fall 1: An einem Nachmittag 10 klassische Arcade-Spiele nachgebaut (WotAI Games)

[WotAI Games](https://games.wotai.co/) ist eine Sammlung von Browserspielen, die komplett von Grund auf mit Claude Code (Vibe Coding) entwickelt wurde und **keine Spielengine verwendet**. Per Dialog ließ man AI in einem Rutsch 10 klassische Arcade-Spiele nachbauen: Pac-Man, Tetris, Space Invaders, Snake, Flappy Bird, Breakout, Galaga, Frogger, Doodle Jump und Sudoku. Jedes Spiel ist direkt online spielbar und bringt ein eigenes Ranglistensystem mit.

![Startseite von WotAI Games – Sammlung von 10 klassischen Arcade-Spielen](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-wotai-games.png)

![Tetris (WotAI Games, per Vibe Coding generiert)](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-wotai-tetris.png)

![Pac-Man (WotAI Games, per Vibe Coding generiert)](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-wotai-pacman.png)

> 🔗 Online spielen: [games.wotai.co](https://games.wotai.co/) ｜ Entwicklungs-Rückblick: [We vibe coded 10 classic arcade games with Claude Code](https://wotai.co/blog/wotai-games-vibe-coded-arcade-classics)

#### 🌸 Fall 2: Ein Anfänger ohne Vorkenntnisse baut in 2 Stunden ein 2048-artiges Spiel (Blooming Garden)

Der japanische Entwickler [in0ho1no](https://github.com/in0ho1no), der überhaupt nicht programmieren kann, hat mit Claude rein über Dialoge (Vibe Coding) in **etwa 2 Stunden** das 2048-artige „Pflanzengarten"-Spiel [Blooming Garden](https://in0ho1no.github.io/2025-adhoc-blooming-garden/) gebaut: Pflanzen gleicher Art fusionieren und upgraden, prächtige Blüteffekte, Partikel-Animationen, Rangliste, Soundeffekte, Handy-Anpassung … Alle diese Funktionen wurden rein über natürliche Sprachdialoge umgesetzt – ohne eine einzige von Hand geschriebene Codezeile.

![Blooming Garden Pflanzensynthese-Spiel (100 % AI-generiert)](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-blooming-garden.webp)

> 🔗 Online spielen: [in0ho1no.github.io/2025-adhoc-blooming-garden](https://in0ho1no.github.io/2025-adhoc-blooming-garden/) ｜ Quellcode: [github.com/in0ho1no/2025-adhoc-blooming-garden](https://github.com/in0ho1no/2025-adhoc-blooming-garden)

#### 🌍 Fall 3: Ein Designer baut mit AI ein online spielbares 3D-Mehrspieler-Spiel (Planet Jumper)

Der Designer [Ricardo de Zoete (Hammy)](https://x.com/RicardoDeZoete) hat mit der AI von OpenAI rein über Dialoge (Vibe Coding) auf Basis von three.js [Planet Jumper](https://gamesbyhammy.cloud/play/planetjumper) gebaut – ein **3D-Mehrspieler-Platformer**: Auf der Oberfläche eines kleinen kugelförmigen Planeten rennen, sprinten und springen und dabei sogar online gegen Fremde antreten. Systeme wie kugelförmige Schwerkraft, Online-Synchronisation und Sprunggefühl sind alles andere als einfach und wurden komplett per Prompt „herausgeplaudert".

![Planet Jumper 3D-Mehrspieler-Platformer (per Vibe Coding generiert)](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-planet-jumper.webp)

> 🔗 Online spielen: [gamesbyhammy.cloud/play/planetjumper](https://gamesbyhammy.cloud/play/planetjumper) ｜ Ausführliche Vorstellung: [Planet Jumper: A Vibe-Coded Three.js Multiplayer Platformer](https://www.webgpu.com/showcase/planet-jumper-threejs-multiplayer/)

#### 🎮 Fall 4: Eine Person hat mit Vibe Coding 100 Browserspiele gebaut (2026)

Im Juli 2026 hat der Entwickler [wangzifan396-wzf](https://github.com/wangzifan396-wzf) aus der chinesischen Community [mini-browser-games](https://github.com/wangzifan396-wzf/mini-browser-games) als Open Source veröffentlicht – **100 Browser-Minispiele, die eine einzelne Person mit Vibe Coding gebaut und kontinuierlich verfeinert hat**. Alle sind abhängigkeitsfreie einzelne HTML-Dateien, die man per Doppelklick starten kann. Die Spielarten decken Action, Strategie, Tower Defense, Management, Kartenspiele, Physik, Logik, Rennspiele, Rhythmus, Brettspiele und Puzzles ab; viele davon erreichen bereits produktionsreife Tiefe mit Mehr-Kapitel-Kampagnen, Aufbausystemen und geräteübergreifender Synchronisierung per Speichercode. Das gesamte Projekt ist unter der MIT-Lizenz open source, und der Online-Katalog lässt sich direkt durchspielen.

![Online-Katalog der 100 Browserspiele (Open-Source-Vibe-Coding-Projekt von 2026)](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-100-games.png)

![„Neon 2048": Expedition mit sechs Kapiteln und 18 Knoten + mehrere Modi und Werkzeugsysteme](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-100-games-neon2048.webp)

> 🔗 Online-Katalog: [wangzifan396-wzf.github.io/mini-browser-games](https://wangzifan396-wzf.github.io/mini-browser-games/) ｜ Quellcode: [github.com/wangzifan396-wzf/mini-browser-games](https://github.com/wangzifan396-wzf/mini-browser-games) ｜ Entstehungs-Rückblick: [Ich habe mit Vibe Coding 100 Browserspiele gebaut und alle als Open Source veröffentlicht](https://blog.csdn.net/m0_74023007/article/details/162945755)

#### ⛏️ Fall 5: Ein Minecraft-Nachbau für die Neffen des Entwicklers (CraftMine, 2026)

Im Februar 2026 hat der Entwickler [Trent Sterling](https://tront.xyz/blog/posts/craftmine/), weil seine Neffen *Minecraft* spielen wollten, aber keine Originalversion besaßen, einfach eine leere HTML-Datei geöffnet und mit Claude Code rein über Dialoge [CraftMine](https://tront.xyz/craftmine/) gebaut – einen **6.820 Zeilen umfassenden Einzeldatei**-Nachbau von *Minecraft* für den Browser: 46 Blockarten (zusätzlich 21 DOOM-Höllen-Themenblöcke), 36 Kreaturen (vom Huhn bis zum Titan-Boss mit 300 HP), 19 Waffen (inklusive BFG 9000), 5 Biome, Tag-Nacht-Zyklus und sogar **P2P-Mehrspieler**. Es gibt keinen Build-Schritt – Webseite öffnen und losspielen.

![CraftMine: Minecraft-Nachbau, 6.820 Zeilen in einer einzigen Datei (per Vibe Coding generiert)](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-craftmine.png)

> 🔗 Online spielen: [tront.xyz/craftmine](https://tront.xyz/craftmine/) ｜ Entwicklungs-Rückblick: [CraftMine: A 6,820-line vibe-coded Minecraft clone in one HTML file](https://tront.xyz/blog/posts/craftmine/)

#### 🍄 Fall 6: Ein Super Mario mit in Echtzeit AI-generierten unendlichen Leveln (2026)

Im März 2026 hat ein Entwickler die Open-Source-Version von *Super Mario* mit den Modellen von OpenAI kombiniert und daraus [AI Super Mario](https://supermario.leanmcp.live/) gebaut: Du kannst sowohl die klassischen Original-Level spielen als auch AI **in Echtzeit neue Level generieren** lassen – im „Unendlichkeitsmodus" erzeugt AI während des Voranschreitens dynamisch brandneue Szenen und Gegner; im Test ließ es sich 45 Minuten am Stück spielen. Du kannst sogar direkt im Spiel per Text AI bitten, Gegner hinzuzufügen, Plattformen zu platzieren oder das Thema zu ändern.

![AI Super Mario: drei Spielmodi – Klassik, AI-Level und Unendlichkeitsmodus](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-ai-mario-menu.png)

![Mario-Spielbildschirm mit in Echtzeit von AI generierten Leveln](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-ai-mario-gameplay.png)

> 🔗 Online spielen: [supermario.leanmcp.live](https://supermario.leanmcp.live/) ｜ Ausführliche Vorstellung: [OpenAI and Idiomorph Power Infinite Mario Level Generation in Browser](https://www.thenextgentechinsider.com/pulse/openai-and-idiomorph-power-infinite-mario-level-generation-in-browser)

#### 🇨🇳 Fall 7: Ein Prompt genügte dem chinesischen LLM Kimi K3 für ein 3D-Spiel (2026)

Im Juli 2026 hat der Entwickler [Dr. Josh Simmons](https://www.drjoshcsimmons.com/writing/kimi-k3-built-the-game-i-still-had-to-play-it) dem chinesischen LLM **Kimi K3** nur einen einzigen Prompt geschickt und es daraufhin ein spielbares Ego-3D-Spiel bauen lassen: Datenkerne in einer prozedural generierten Serveranlage sammeln, patrouillierenden Drohnen ausweichen und mit dem Frachtaufzug drei Stockwerke nach unten fahren. Das gesamte Spiel war nach einer einzigen Generierung spielbar; nach zwei Dialogrunden zum Beheben von zwei Bugs ließ es sich problemlos durchspielen – für insgesamt etwa **2 US-Dollar**.

![Das 3D-Serveranlagen-Spiel, das Kimi K3 aus einem einzigen Prompt generiert hat](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-kimi-k3-game.png)

> 🔗 Online spielen: [kimi-test-theta.vercel.app](https://kimi-test-theta.vercel.app/) ｜ Quellcode: [github.com/jcpsimmons/kimi-test](https://github.com/jcpsimmons/kimi-test) ｜ Entwickler-Rückblick: [Kimi K3 Built the Game. I Still Had to Play It.](https://www.drjoshcsimmons.com/writing/kimi-k3-built-the-game-i-still-had-to-play-it)

#### 🎯 Fall 8: K399, die offizielle Spieleplattform von Kimi – dutzende AI-Spiele direkt online spielbar (2026)

Am 17. Juli 2026 veröffentlichte Moonshot AI das Modell Kimi K3 und brachte zeitgleich die Browserspiele-Plattform [K399](https://www.k399.games/) online – dutzende Spiele dort wurden alle mit dem K3-Modell erstellt und sind mit einem Klick spielbar. Die Bandbreite reicht von 3D-Shootern, Musikspielen, Side-Scrolling-Action und Hof-Intrigen-AVGs über 3D-Puzzles bis hin zu Open-World-Spielen: Neben Nachbauten klassischer Gameplay-Konzepte wie *The Legend of Zelda*, *Black Myth: Wukong*, *Bubble Land* und *Vampire Survivors* gibt es auch Originale, deren Fertigstellungstiefe weit über Demos hinausgeht, etwa *Pioneer Practice Ground* (ein 3D-FPS mit Bewegen, Springen, Rutschen, Zielen und Schießen), das Open-World-Spiel *SpiderPunk* und das Hof-Intrigen-AVG *Fengque Shen Gong* mit einer Hauptstory über fünf Kapitel, acht Nebensträngen und 32 Zufallsereignissen.

![K399-Plattformoberfläche – K3 Game Arcade, Spieleliste mit einem Klick spielbar](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-k399-platform-live.png)

![SpiderPunk, ein Open-World-Spiel auf K399: zwischen Cyberpunk-Hochhäusern an Spinnenseilen schwingen (mit K3-Modell generiert, echtes Gameplay)](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-k399-spiderpunk.webp)

> 🔗 Online spielen: [k399.games](https://www.k399.games/) (K3 Game Arcade, mit einem Klick spielbar) ｜ Ausführliche Vorstellung: [Ein ehemaliger miHoYo-Manager stößt dazu – das gerade angesagteste AI-Unternehmen hat plötzlich dutzende Spiele gemacht](https://eu.36kr.com/zh/p/3906895998178441) ｜ [Kimi K3: Wer wird nervös?](https://36kr.com/p/3905392402748801)

Wenn du dir diese Fälle anschaust, wirst du feststellen: **Snake ist nur die Spitze des Eisbergs der AI-Programmierfähigkeiten**. Ob klassische Arcade-Spiele, 2048-Puzzles, 3D-Spiele, Nachbauten von *Minecraft* und *Super Mario*, Sammlungen von hunderten Spielen oder sogar die offizielle Spieleplattform eines chinesischen LLM – solange du deine Ideen klar beschreiben kannst und bereit bist, sie in mehreren Dialogrunden zu verfeinern, kann AI sie für dich von 0 auf 1 umsetzen. Als Nächstes bist du an der Reihe!

## 📚 Assignment

<StageAssignmentCard title="Deine ersten KI-nativen Minispiele fertigstellen">

<p>
    In diesem Abschnitt hast du den kompletten Prozess von „Gespräch-generiertes Snake" bis zum „Verständnis des AI-native Mini-Spiel-Design-Gedankens" durchlaufen. Die folgende Aufgabe hilft dir, dieses Verständnis in echte Fähigkeiten umzuwandeln.
  </p>

  <ol>
    <li>
      <strong>Reproduziere das AI-native Snake-Spiel vollständig</strong>
      <ul>
        <li>Mindestens implementiert: Die Schlange kann sich bewegen, nach dem Fressen von „Nahrung" ändern sich Länge und Punktestand, Kollision mit Wänden oder dem eigenen Körper beendet das Spiel.</li>
        <li>Während der Reproduktion übe, Fehlerphänomene + Fehlermeldungen + relevante Code-Snippets zusammen an AI zu übergeben und es um Korrektur im „Anfängermodus" zu bitten.</li>
      </ul>
    </li>
    <li>
      <strong>(Optional) Erstelle 1 AI-native Mini-Spiel oder Demo</strong>
      <ul>
        <li>Kann jedes leichte Gameplay rund um Text, Bilder, Musik oder Rhythmus sein, z. B. „Wörter fressen und Gedichte schreiben", „Rhythmus-Tippen", „Generatives Endless Runner" etc.</li>
        <li>Der Fokus liegt nicht auf aufwendiger Grafik, sondern darauf, dass du klar sagen kannst: Wobei hat AI konkret geholfen, und welches „schwer manuell Machbare oder Umständliche" es gelöst hat.</li>
      </ul>
    </li>
  </ol>

  <p>
    Das ist das komplette Tutorial! Du brauchst möglicherweise <strong>4 Stunden</strong>, um alle Inhalte abzuschließen und dein eigenes Snake-Spiel zu bauen. Keine Eile – erkunde, experimentiere und genieße den Prozess. Wenn du auf Konzepte stößt, die du nicht verstehst, schau in den Anhang unten.
  </p>

</StageAssignmentCard>

## Anhang

<el-card id="appendix-nav" shadow="hover" style="margin-top: 24px; margin-bottom: 24px; border-left: 5px solid #67C23A;">
  <div style="font-weight: bold; margin-bottom: 8px;">Anhang-Navigation</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    Hier sind einige grundlegende Konzepte zu diesem Kapitel: Wenn du beim Lernen auf Fragen wie „Was ist Frontend?" oder „Was genau ist Vibe Coding?" stößt, kannst du jederzeit hier nachschlagen.
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <a href="#appendix-1" style="text-decoration: none; color: inherit;"><b>Anhang 1: Brauchen wir Frontend-Entwicklungswissen?</b></a><br/>
      <span style="font-size: 12px; color: #909399">Verstehe die Rolle des Frontends in einer Anwendung und was „sichtbar" bedeutet.</span>
    </el-col>
    <el-col :span="12">
      <a href="#appendix-2" style="text-decoration: none; color: inherit;"><b>Anhang 2: Was genau ist Vibe Coding</b></a><br/>
      <span style="font-size: 12px; color: #909399">Verstehe den Kerngedanken des „konversationellen Entwickelns" und wie man mit AI zusammenarbeitet.</span>
    </el-col>
  </el-row>
  <el-row :gutter="16" style="margin-top: 10px;">
    <el-col :span="12">
      <a href="#appendix-3" style="text-decoration: none; color: inherit;"><b>Anhang 3: Modellkontext</b></a><br/>
      <span style="font-size: 12px; color: #909399">Verstehe Konzepte wie „Kontextlänge", die oft gehört aber leicht verwechselt werden.</span>
    </el-col>
    <el-col :span="12">
      <a href="#appendix-4" style="text-decoration: none; color: inherit;"><b>Anhang 4: Instruction-Following-Fähigkeit</b></a><br/>
      <span style="font-size: 12px; color: #909399">Verstehe, warum Modelle manchmal „nicht zuhören", und wie man klarer schreibt.</span>
    </el-col>
  </el-row>
  <div style="margin-top: 12px; font-size: 12px; color: #909399;">
    Tipp: Du kannst mit Ctrl/⌘+F nach Stichwörten suchen oder unverständliche Abschnitte an AI kopieren, um sie im „komplett für Anfänger verständlichen" Modus erklären zu lassen.
  </div>
</el-card>

## <span id="appendix-1">[Anhang 1: Brauchen wir Frontend-Entwicklungswissen?](#appendix-nav)</span>

::: tip 💡 Ein Satz zusammengefasst
Du musst nicht programmieren können, aber Grundkenntnisse helfen dir, Anforderungen besser an AI zu beschreiben.
:::

<el-row :gutter="16" style="margin: 20px 0;">
  <el-col :span="12" :xs="24" style="margin-bottom: 16px;">
    <el-card shadow="hover" style="border-radius: 12px; height: 100%;">
      <template #header>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">👁️</span>
          <span style="font-weight: bold;">Frontend</span>
          <el-tag type="success" size="small">Sichtbar</el-tag>
        </div>
      </template>
      <div style="color: #606266; line-height: 1.8;">
        Alles, was Nutzer <strong>sehen und anklicken</strong> können
        <ul style="margin: 12px 0; padding-left: 20px;">
          <li>Webseiten-Titel, Text, Bilder</li>
          <li>Schaltflächen, Eingabefelder, Dropdown-Menüs</li>
          <li>Spieloberfläche, Animationen</li>
        </ul>
      </div>
    </el-card>
  </el-col>
  <el-col :span="12" :xs="24" style="margin-bottom: 16px;">
    <el-card shadow="hover" style="border-radius: 12px; height: 100%;">
      <template #header>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">⚙️</span>
          <span style="font-weight: bold;">Backend</span>
          <el-tag type="info" size="small">Unsichtbar</el-tag>
        </div>
      </template>
      <div style="color: #606266; line-height: 1.8;">
        Datenverarbeitung auf dem Server
        <ul style="margin: 12px 0; padding-left: 20px;">
          <li>Nutzerpunktestand-Speicherung</li>
          <li>Login-Authentifizierung</li>
          <li>Level-Inhaltsvergabe</li>
        </ul>
      </div>
    </el-card>
  </el-col>
</el-row>

### Frontend-Dreiercombo

Stell dir eine Webseite als ein Haus vor. Drei Arten von „Code" kümmern sich jeweils um eine Sache:

- **HTML**: bestimmt, **was** auf der Seite ist — wie zuerst den Hausplan zeichnen
- **CSS**: bestimmt, **wie es aussieht** — wie Wände streichen und Möbel stellen
- **JavaScript**: bestimmt, **wie es reagiert** — wie ein Lichtschalter: drücken und das Licht geht an

### Wie wird Code zur Seite?

Der Browser **baut das Gerüst mit HTML, dekoriert mit CSS und schaltet den Strom mit JavaScript ein** — drei Schritte, fertig ist die Seite.

### Was sind dann React und Vue?

Sie sind **„Fertigbau-Werkzeuge" für komplexe Seiten** — schneller und zuverlässiger. Du musst sie nicht lernen, nur wissen, dass sie Helfer sind.

### Im Vibe Coding

**Kein Code schreiben, nur beschreiben.** Sprich einfach normal mit AI, zum Beispiel:

> „Erstelle mit React eine Bestenliste-Seite: rechts die Punkteliste, bei Klick auf eine Zeile werden unten die Spielerdetails angezeigt, im minimalistischen modernen Stil."

Mehr dazu: [Web-Basics-Appendix](/zh-cn/appendix/3-browser-and-frontend/javascript-deep-dive) und [Frontend-Evolutionsgeschichte-Appendix](/zh-cn/appendix/3-browser-and-frontend/frontend-frameworks).

## <span id="appendix-2">[Anhang 2: Was genau ist Vibe Coding](#appendix-nav)</span>

> 💡 Was ist Vibe Coding? Der Informatiker [Andrej Karpathy](https://karpathy.ai/) (Mitbegründer von OpenAI, ehemaliger AI-Chef bei Tesla) prägte im Februar 2025 den Begriff **Vibe Coding**. Dieser Begriff beschreibt eine Programmiermethode, die auf LLMs basiert und **es Programmierern ermöglicht, lauffähigen Code durch natürliche Sprachbeschreibungen statt manuelles Codieren zu generieren.**

![1767350588191](../../../zh-cn/stage-1/ai-capabilities-through-games/images/1767350588191.webp)

Wörtlich verstanden kann Vibe Coding als „Entwicklung durch Sprechen" verstanden werden. Der Kernwandel besteht darin: Du musst nicht mehr selbst Code Zeile für Zeile schreiben, Syntax nachschlagen und Bugs beheben; stattdessen beschreibst du in natürlicher Sprache, was du willst, z. B.:

„Ich brauche eine Login-Seite mit Eingabefeld für Handynummer und Bestätigungscode."
„Nach erfolgreichem Login Weiterleitung zur Startseite mit Benutzername oben rechts."
„Ein einfaches Snake-Minispiel mit Tastatursteuerung."

Große Sprachmodelle (LLM) übersetzen solche Beschreibungen automatisch in wirklich lauffähigen Code und generieren die entsprechende Seiten, Logik und Datenstrukturen. Nachdem du das Ergebnis gesehen hast, kannst du mit natürlicher Sprache Änderungswünsche äußern, z. B. „Button etwas größer", „Hintergrund dunkler", „Punktestand speichern und Bestenliste anzeigen", und AI passt die Implementierung weiter an.

In diesem Modus musst du nicht erst eine Programmiersprache lernen, um Code zu schreiben; stattdessen konzentrierst du dich darauf: klar zu beschreiben, was getan werden soll, das Ergebnis zu beurteilen und neue Änderungen vorzuschlagen. AI übernimmt die Umsetzung dieser übergeordneten Ideen in konkrete Implementierung und reduziert so mechanische, repetitive Codierungsarbeit erheblich.

Für weitere Details zu Vibe Coding siehe: [https://www.ibm.com/think/topics/vibe-coding](https://www.ibm.com/think/topics/vibe-coding)

Für mehr von Karpathys Gedanken siehe: [https://karpathy.bearblog.dev/blog/](https://karpathy.bearblog.dev/blog/)

### Wie man sich als Vibe-Coding-Meister ausgibt

In der Praxis werden beim echten Vibe Coding oft keine komplexen Prompts verwendet. Vielleicht brauchst du am Anfang einen konkreten, etwas komplexen Prompt für das gesamte Programm, aber danach genügen oft einfache Prompts wie diese:

```
"Es gibt einen Bug im Code, bitte beheben."
"Ich will keinen Teil-Code, gib mir den kompletten korrigierten Code."
"Dein Code hat immer noch Probleme."
"Bitte korrigiere erneut und gib den vollständigen korrigierten Code."
"Es lief vorhin, warum geht es jetzt nicht mehr?"
"Hast du mich nicht verstanden? Ändere nicht meinen ursprünglichen Code."
"Füge keine Debugging-Funktionen hinzu."
"Tu nichts, was ich nicht verlangt habe."
"Wo ist die Funktion, die ich verlangt habe?"
"Verstehst du nicht, was ich sage?"
"Ich brauche nur eine Funktion."
"Ich habe dir gesagt, meinen vorherigen Code zu beachten."
"Bitte füge keine unnötigen Kommentare hinzu."
"Bitte ändere nicht die grundlegende Logik meines ursprünglichen Codes."
"Hilf mir, den Code zu ändern."
"Ändere basierend auf meinem Code..."
"Ändere nicht meine Variablennamen!!!"
"Ändere nicht die ursprünglichen Funktionsnamen!"
"Rühr nicht an meinen Variablen."
"Füge keine zusätzlichen Funktionen hinzu."
"Generiere nicht nur ein Gerüst, sondern vollständigen Code."
```

Das mag übertrieben klingen, aber in der Praxis sind das genau die Prompts, die wir täglich verwenden können. Wegen der **Kontextlängenbegrenzung** großer Sprachmodelle oder weil ihre **Instruction-Following-Fähigkeit** nicht immer stark ist, kann das Modell Inhalte vergessen, die früher im Gespräch besprochen wurden. Beim Vibe Coding bevorzugen wir Modelle mit langem Kontext und starker Instruction-Following-Fähigkeit; wir können dies anhand von Rankings oder Metriken beurteilen.

Alternativ neigen Modelle dazu, im Stil ihrer Trainingsdaten zu antworten. Manche sprechen sehr formell, andere mögen viele Verzierungen, und einige Modelle mögen es, viele Kommentare oder unnötige Module im Code hinzuzufügen.

## <span id="appendix-3">[Anhang 3: Modellkontext](#appendix-nav)</span>

Modellkontext kann als das Kurzzeitgedächtnis von AI verstanden werden. Er bezieht sich auf alle Textinhalte, die das Modell in einer einzelnen Konversation oder Aufgabe „sehen" und „erinnern" kann, einschließlich deiner vorherigen Fragen, Systemanweisungen, relevante Materialien usw.

Gerade wegen des Kontexts kann AI verstehen, dass du eine Frage stellst, die sich auf frühere Inhalte bezieht, und kann runde für runde, scheinbar kohärente natürliche Gespräche führen. Ohne Kontext würde jede deiner Aussagen im Modell wie eine völlig neue Frage wirken, und es könnte nicht wissen, was du zuvor gesagt hast.

Jedes Modell hat seine eigene effektive Kontextlänge (Context Window). Diese wird normalerweise in Token (grob als „Wortfragmente") gemessen; aktuell liegen die meisten Modelle zwischen 32k und 128k Token. Je länger der Kontext, desto mehr kann das Modell „lesen", z. B.:

- Einmal eine längere Arbeit oder einen Bericht lesen
- In einem Gespräch mehrere Quellen und Fälle referenzieren
- Das Modell komplexe Diskussionsergebnisse aus früheren Runden merken lassen

Wenn deine Eingabe die Kontextbegrenzung des Modells erreicht oder überschreitet, treten häufig folgende Phänomene auf:

- Das Modell beginnt, Details oder Schlüsselinformationen aus längeren Texten zu vergessen
- Im weiteren Verlauf des Gesprächs weicht das Thema vom ursprünglichen Ziel ab
- Zwischen verschiedenen Fragen zum selben Material sind die referenzierten Inhalte inkonsistent

Diese Phänomene bedeuten nicht, dass das Modell plötzlich „dümmer" wird, sondern sind natürliche Folgen, wenn die Kontextkapazität erschöpft oder fast erschöpft ist.

In der Praxis wünscht man sich sowohl einen möglichst langen Kontext als auch das Bewusstsein:
- Je länger der Kontext, desto mehr Rechenressourcen werden verbraucht
- Die entsprechenden Aufrufkosten steigen ebenfalls

Daher muss man bei der Entwicklung von AI-Anwendungen eine Balance finden zwischen dem, was das Modell sehen kann, und der Kostenkontrolle sowie Effizienzsteigerung. Zum Beispiel:
- Informationen, die langfristig erhalten bleiben müssen, werden aufbereitet, bevor sie dem Modell übergeben werden
- Unnötige Details werden nicht immer wieder unverändert in den Kontext gestopft
- Externe Wissensdatenbanken übergeben „langfristiges Gedächtnis" an das System, anstatt es in den Modellkontext zu quetschen

## <span id="appendix-4">[Anhang 4: Instruction-Following-Fähigkeit](#appendix-nav)</span>

Die Instruction-Following-Fähigkeit bezieht sich darauf: Ob das Modell nach dem Verstehen deiner Anweisung in der Lage ist, diese korrekt und vollständig auszuführen. Sie umfasst nicht nur die Beantwortung von Fragen, sondern auch die Ausführung von Aufgaben im angegebenen Format, Stil und mit den angegebenen Schritten.

Zum Beispiel sind folgende Anweisungen mit klaren Anforderungen:

- Fasse diesen Artikel in drei Hauptpunkte zusammen
- Schreibe eine höfliche Antwort-E-Mail im formellen Stil
- Übersetze dieses Wort ins Englische und bilde jeweils einen Beispielsatz
- Extrahiere Autor, Datum und Hauptereignis aus dem Artikel

Ein Modell mit starker Instruction-Following-Fähigkeit hat normalerweise folgende Eigenschaften:

- Ausgabe in der geforderten Menge  
  Wenn drei Hauptpunkte gefordert werden, werden nicht fünf geliefert.
- Abdeckung aller angegebenen Elemente  
  Wenn Autor, Datum und Ereignis gefordert werden, wird keines davon weggelassen.
- Einhaltung des angegebenen Formats und Stils  
  Wenn ein formeller Stil gefordert wird, wird keine zu umgangssprachliche Antwort geliefert.
- Keine unnötigen zusätzlichen Erweiterungen  
  Wenn nur Übersetzung und Beispielsatz gefordert werden, wird kein großer irrelevanter Erklärungsblock ausgegeben.

In der Praxis ist eine starke Instruction-Following-Fähigkeit aus folgenden Gründen sehr wichtig:

- Verbesserte Stabilität: Bei gleicher Anweisung sind Ausgabestruktur und Verhaltensmuster über verschiedene Zeitpunkte und bei mehrfacher Ausführung konsistenter, ohne willkürliche Ergänzungen
- Verbesserte Reproduzierbarkeit: Wenn du einen Prompt in ein Produkt oder einen Prozess integrierst, kannst du erwarten, wie das Modell grob antwortet, was Testen und Iteration erleichtert
- Einfachere Systemintegration: Wenn die Modellausgabe dem erwarteten Format entspricht, ist die automatische Anbindung an Backend-Programme, Workflows oder andere Tools einfacher

Daher sollte man bei der Auswahl und Bewertung eines großen Sprachmodells neben Intelligenz und Wissensabdeckung besonders auf seine Instruction-Following-Fähigkeit achten. Für industrielle Anwendungen ist oft wichtiger, ob es stabil und korrekt Anweisungen ausführen kann, als gelegentlich eine beeindruckende Antwort zu liefern.

<RelatedArticlesSection
  title="Weiterlernen"
  description="Von der spielerischen Erfahrung ausgehend, empfehlen wir dir, zur lokalen Entwicklung und Produktpraxis überzugehen."
  :items="relatedArticles"
/>
---
title: 'Anfaenger 1: Im KI-Zeitalter reicht Reden zum Programmieren'
description: 'Baue eine AI-native Snake-Variante per Dialog und uebertrage den Workflow auf dein eigenes Mini-Spiel oder Demo.'
---
