# Sieben AI-Programmier-Tools im Vergleich

## Kapitel&uuml;bersicht

Angesichts der schillernden Auswahl an AI-Programmier-Tools: Welches ist das richtige f&uuml;r Sie? Dieses Kapitel vergleicht 7 g&auml;ngige Web Vibe Coding Plattformen wie Lovable, Replit, Z.ai usw. anhand einer einheitlichen Praxisaufgabe &ndash; der Entwicklung eines "Snake + AI-Poesie"-Spiels. Wir vergleichen sie aus mehreren Dimensionen wie Anf&auml;ngerfreundlichkeit, Code-Kontrollierbarkeit und Bereitstellungskomfort, um Ihnen bei der schnellen Auswahl des besten Entwicklungstools zu helfen.

---

# 1. Snake-Spiel mit Vibe Coding erstellen: Vollst&auml;ndiges Praxis-Tutorial

Dieser Artikel stellt eine neue Softwareentwicklungspraxis vor &ndash; "Vibe Coding", die KI nutzt, um den Anwendungsentwicklungsprozess zu beschleunigen.

Als N&auml;chstes werden wir nacheinander die Kernkonzepte von Vibe Coding vorstellen, erkl&auml;ren, was ein AI Agent ist, und praktische Methoden zum Schreiben von Prompts geben. Schlie&szlig;lich werden wir durch eine vollst&auml;ndige Praxis das "Snake"-Spiel von Grund auf erstellen und mehrere g&auml;ngige Vibe Coding Plattformen im Detail vergleichen, um Ihnen bei der Auswahl der besten Tool-Kombination zu helfen.

## Was Sie lernen werden:

- **Was ist Vibe Coding**: Definition, Workflow und wichtigste Vorteile verstehen.
- **Die Rolle von AI Agents**: Arbeitsweise von AI Agents und Unterschiede zu traditionellen Programmen verstehen.
- **Wie man gute Prompts schreibt**: Klare, spezifische Prompt-Formulierungen f&uuml;r bessere Ergebnisse beherrschen.
- **Vibe Coding Tools**: Eine Reihe g&auml;ngiger AI-Programmier- und Design-Plattformen kennenlernen.
- **Plattform-Vergleich**: Bewertung und Vergleich der Vor- und Nachteile von 7 verschiedenen AI Agent Plattformen aus der Perspektive von Einsteigern.
- **UI / UX Tools**: Lernen, wie man Figma, Mastergo und andere UI/UX-Tools in den gesamten Workflow integriert.

## 1. Einleitung

In den bisherigen Kursen haben wir stets das Full-Stack-Entwicklungsmodell von z.ai f&uuml;r Programmieraufgaben verwendet.

Haben wir uns jedoch jemals gefragt: Sein Kern ist eigentlich der "AI Agent" (anders als gew&ouml;hnliche Chat-KI und viel intelligenter)? Denn es kommuniziert nicht nur mit Ihnen, sondern kann auch denken (wenn Sie ihm eine Aufgabe geben, plant es zun&auml;chst) und proaktiv handeln (z.B. Web-Suche aufrufen, Computerbefehle ausf&uuml;hren, Webseiten &ouml;ffnen). Wir werden sp&auml;ter darauf zur&uuml;ckkommen.

## 1. Was ist Vibe Coding?

Vibe Coding ist eine neue Softwareentwicklungsmethode, die KI nutzt, um den Anwendungsentwicklungsprozess zu beschleunigen. Es ist kein Ersatz f&uuml;r traditionelle Programmierung, sondern ein "konversationelleres" Programmiermodell. Dieses Konzept wurde vom AI-Forscher Andrej Karpathy vorgeschlagen: In diesem Workflow schreiben Entwickler nicht mehr Zeile f&uuml;r Zeile Code selbst, sondern steuern haupts&auml;chlich AI Agents, um Anwendungen zu generieren, zu optimieren und zu debuggen.

Die Kernidee von Vibe Coding ist der &Uuml;bergang von **"code-first"** zu **"intent-first"**. Sie m&uuml;ssen nicht mehr ab der ersten Codezeile planen, sondern beschreiben das gew&uuml;nschte Ergebnis in nat&uuml;rlicher Sprache.

Ein typischer Vibe Coding-Workflow ist ein iterativer Kreislauf:

- **Ziel beschreiben**: Zun&auml;chst mit einem Satz oder Absatz beschreiben, was Sie implementieren m&ouml;chten, z.B.: "Ein einfaches Snake-Spiel mit Python-Backend, das Gedichte generieren kann."
- **AI generiert Code**: Der AI Agent analysiert Ihre Anforderungen, generiert eine erste Codeversion mit grundlegender Struktur, Frontend-Seiten und Backend-Logik.
- **Ausf&uuml;hren und beobachten**: Den generierten Code ausf&uuml;hren, pr&uuml;fen, ob er wie erwartet funktioniert, und dabei Bugs oder Schw&auml;chen entdecken.
- **Feedback geben und iterieren**: Bei Fehlern oder unbefriedigenden Ergebnissen im Dialog weiter instruieren, z.B.: "Die Schlange bewegt sich zu langsam, mach sie schneller" oder "Der API Key in der `.env`-Datei wird nicht richtig gelesen, bitte den Backend-Code reparieren."
- **Obige Schritte wiederholen**: Kontinuierlich im Kreislauf "Beschreiben &rarr; Generieren &rarr; Ausf&uuml;hren &rarr; Feedback" iterieren, bis die Anwendung zufrieden stellend ist.

### Die wichtigsten Vorteile von Vibe Coding:

- **Einstiegsh&uuml;rde senken**: Auch Designer, Gr&uuml;nder und Studierende ohne Programmiererfahrung k&ouml;nnen durch nat&uuml;rliche Sprache an der Anwendungsentwicklung teilnehmen.
- **Schnelle Prototypen**: Die Zeit von der Idee zum MVP (Minimum Viable Product) wird drastisch verk&uuml;rzt.
- **Effizienz steigern**: Automatische Erledigung gro&szlig;er Mengen repetitiver, mechanischer Codierungsarbeit (wie Boilerplate-Code), sodass Entwickler sich auf Architektur-Design und Probleabstraktion konzentrieren k&ouml;nnen.
- **Experimentieren f&ouml;rdern**: Ermutigt zu schnellem Ergebnis und kontinuierlicher Verbesserung, was das Ausprobieren neuer Ideen und Funktionen erleichtert.

## 2. Was sind Vibe Coding Online-Plattformen (Web-based)?

In diesem Praxis-Test werden Sie feststellen, dass die von uns bewerteten Tools in zwei Kategorien eingeteilt werden: **Web-based (Online-Plattformen)** und **IDE (lokale Entwicklungsumgebungen)**.

Obwohl beide im Kern AI-gest&uuml;tzt Code schreiben, gibt es gewaltige Unterschiede in der Nutzererfahrung und den Anwendungsszenarien:

### Vibe Coding Online-Plattformen (Web-based)

**Repr&auml;sentative Tools:** Lovable, Replit, Z.ai, v0

Das ist wie ein "Ready-to-move-in"-Hotelapartment.

- **Keine Umgebungskonfiguration n&ouml;tig**: Sie m&uuml;ssen sich nicht um Python-Umgebung, Node.js-Version oder Abh&auml;ngigkeitsinstallation k&uuml;mmern. Browser &ouml;ffnen, URL eingeben, direkt loslegen.
- **Ein-Klick-Vorschau und Bereitstellung**: Nach der Codegenerierung zeigt die Plattform das Ergebnis automatisch in einem Seitenfenster an. Wenn fertig, einen Klick, um einen Link zu generieren und mit Freunden zu teilen.
- **Geeignete Szenarien:**
  - **Schnelle Ideenvalidierung (MVP)**: Eine Idee im Kopf, mal eine halbe Stunde ausprobieren.
  - **Einsteiger**: Komplett frei von komplexen Umgebungsfehlern, nur die Freude an AI-Programmierung erleben.
  - **Leichtgewichtige Anwendungen**: Eine einfache Tool-Webseite, ein kleines Spiel oder eine pers&ouml;nliche Pr&auml;sentationsseite.

### AI IDE (Lokale Entwicklungsumgebung)

**Repr&auml;sentative Tools:** Cursor, Trae, VS Code + AI-Plugin

Das ist wie ein "voll ausgestattetes" Eigenheim.

- **Starke lokale F&auml;higkeiten**: L&auml;uft auf Ihrem Computer, hat direkten Zugriff auf alle Ihre lokalen Dateien und nutzt die Rechenleistung Ihres Computers.
- **Nahtlose professionelle Workflow-Integration**: Geeignet f&uuml;r gro&szlig;e Projekte, freie Plugin-Installation, Verbindung zu lokalen Datenbanken, komplexes Debugging.
- **Geeignete Szenarien:**
  - **Professionelle Projektentwicklung**: Langfristig zu wartende, strukturell komplexe kommerzielle Projekte.
  - **Tiefe Anpassung**: Extreme Code-Kontrolle oder tiefe Integration mit bestehendem lokalem Workflow (wie Git, Docker).
  - **Datenschutz**: Code komplett lokal, besser konform zu Sicherheitsrichtlinien mancher Unternehmen.

**Zusammenfassend:** Wenn Sie gerade erst mit AI-Programmierung beginnen oder nur schnell etwas Kleines ausprobieren wollen, sind **Online-Plattformen** der perfekte Startpunkt. Wenn Sie professioneller Entwickler sind oder das Projekt immer komplexer wird, bietet eine **lokale IDE** eine h&ouml;here Obergrenze.

---

## 3. Was ist ein AI Agent?

### Was ist ein AI Agent?

Ein AI Agent ist ein Softwaresystem, das seine Umgebung wahrnehmen, Entscheidungen treffen und autonom handeln kann, um bestimmte Ziele zu erreichen. Im Vergleich zu traditioneller Software, die festen Anweisungen folgt und einen einzigen Prozessablauf hat, sind AI Agents flexibler und anpassungsf&auml;higer.

Hier sind einige Schl&uuml;sseleigenschaften, die AI Agents von traditionellen Programmen unterscheiden:

- **Autonomie**: AI Agents haben hohe Unabh&auml;ngigkeit. Traditionelle Programme m&uuml;ssen meist Schritt f&uuml;r Schritt von Menschen ausgel&ouml;st werden, w&auml;hrend ein Agent basierend auf seinem Ziel selbst entscheiden kann, was er als N&auml;chstes tun soll.
- **Wahrnehmung und Ged&auml;chtnis**: Agents sammeln Daten aus der Umgebung (z.B. API-Antworten, Sensordaten, Nutzereingaben) und behalten Kontext durch "Ged&auml;chtnis", um Erfahrung in sp&auml;teren Aktionen wiederzuverwenden und die Leistung kontinuierlich zu verbessern.
- **Rationalit&auml;t und Zielorientierung**: Agents analysieren und planen um ein gegebenes Ziel herum und w&auml;hlen die geeignete Aktionssequenz, um h&ouml;here "Leistungskennzahlen" zu verfolgen.
- **Werkzeugnutzung**: Ein Hauptmerk moderner AI Agents ist die F&auml;higkeit, externe Tools aufzurufen und nicht auf "Textgenerierung" beschr&auml;nkt zu bleiben. Sie k&ouml;nnen z.B. Webseiten durchsuchen, Code ausf&uuml;hren, Datenbanken abfragen, E-Mails senden &ndash; ein Gehirn, das "Tools orchestriert".

Man kann es sich so vorstellen:

- Ein **traditionelles Programm** ist wie ein Taschenrechner. Man gibt Zahlen und Operatoren ein, es rechnet nur, wenn man den Knopf dr&uuml;ckt.
- Ein **AI-Assistent** ist wie ein menschlicher Assistent. Man bittet ihn "Finde Restaurants in meiner N&auml;he", er gibt Suchergebnisse und listet Optionen auf, aber die Entscheidung trifft am Ende man selbst.
- Ein **AI Agent** ist eher wie ein automatisiertes Forschungsteam. Man gibt nur ein hochrangiges Ziel (z.B. "Plane eine Japanreise f&uuml;r mich"), und es zerlegt die Aufgabe, recherchiert online, bucht Fl&uuml;ge und Hotels (per API), erstellt einen Zeitplan und liefert das Ergebnis &ndash; fast ohne dass Sie sich um Details k&uuml;mmern m&uuml;ssen.

---

# 2. Zum Thema Prompt-Schreiben

## 1. Prompt am besten auf einmal oder in mehreren Schritten schreiben?

Viele sind versucht, in einem einzigen Prompt "eine vollst&auml;ndige Full-Stack-Anwendung" zu beschreiben. Tats&auml;chlich sind die aktuellen Tools bereits leistungsstark genug, um m&ouml;glicherweise auf einmal ein einigerma&szlig;en akzeptables Ergebnis zu liefern. Insgesamt ist es jedoch oft besser, die Arbeit in kleine Schritte zu unterteilen und phasenweise zu iterieren, um nicht in einer "nicht mehr &auml;nderbaren" Sackgasse zu landen.

> **Kleiner Tipp:** Anstatt "alles auf einmal" zu erwarten, lieber das gro&szlig;e Ziel in ausf&uuml;hrbare kleine To-dos aufteilen.
> Zum Beispiel: Nicht direkt "build me a Snake game" sagen, sondern aufteilen in:
> "1. Zun&auml;chst ein Snake-Spiel-Frontend erstellen",
> "2. Dann ein Backend zur Punkteaufzeichnung implementieren",
> "3. Schlie&szlig;lich Frontend und Backend verbinden".
> So kann AI Ihre Anforderungen genauer verstehen und zuverl&auml;ssigere Ergebnisse liefern.

## 2. Je klarer, desto besser

- In Vibe Coding sind Ihre geschriebenen Prompts genauso wichtig wie Ihr geschriebener Code. Je klarer und spezifischer der Prompt, desto n&auml;her ist das Ergebnis an dem, was Sie sich vorstellen.
- Ziel und Einschr&auml;nkungen von Anfang an klar formulieren, reduziert sp&auml;tere &Auml;nderungen, was nicht nur Zeit spart, sondern auch Kontingent und Kosten.

---

# 3. Tool-&Uuml;bersicht (Vibe Coding / UIUX Tools)

## 1. AI Agent Plattformen

| **Name** | **Plattform** |
| --- | --- |
| **[Lovable](https://lovable.dev/)** | Web-based |
| **[Cursor](https://cursor.com/cn/agents)** | PC |
| **[Z.ai](https://chat.z.ai/)** | Web-based |
| **[Replit](https://replit.com/~)** | Web-based |
| **[Minimax](https://agent.minimaxi.com/)** | Web-based |
| **[Trae](https://www.trae.ai/)** | PC |
| **[V0](https://v0.app/)** | Web-based |

## 2. AI UIUX Plattformen

| **Name** | **Plattform** |
| --- | --- |
| **[Mastergo](https://mastergo.com/)** | Web-based |
| **[Figma](https://www.figma.com/)** | Web-based, PC-Plugin |

---

# 4. Praxis-Tutorial (Vibe Coding + UI Kombination)

1. Geben Sie im Chat-Fenster der Vibe Coding Plattform Ihre Programmbeschreibung ein.
   Beispiel:

   > Bitte erstellen Sie eine einfache Snake-Webanwendung mit Frontend und Backend.
   >
   > 1. Frontend
   >
   > - Seite 1: Spiel-Seite
   >   - Tastatursteuerung der Schlangenbewegung.
   >   - Die Schlange frisst keine Nahrung, sondern englische W&ouml;rter.
   >   - Seitenleiste zeigt gesammelte W&ouml;rter und deren Anzahl.
   >   - Nach Spielende bleiben gesammelte W&ouml;rter erhalten und werden im n&auml;chsten Spiel fortgesetzt.
   > - Seite 2: Gedicht-Seite (Make Poem)
   >   - Dieselbe Wortliste wie auf der Spiel-Seite anzeigen (Datenkonsistenz).
   >   - Einen Button zum Senden der aktuell gesammelten W&ouml;rter an das Backend zur Generierung eines Gedichts.
   >   - Nach Gedichtgenerierung die verwendeten W&ouml;rter aus der Liste entfernen oder deren Z&auml;hler verringern.
   >
   > * Einfache Navigation zum Wechseln zwischen Game und Make Poem.
   > * Sicherstellen, dass gesammelte W&ouml;rter auf beiden Seiten sichtbar sind.
   >
   > 2. Backend
   >
   > - Backend-Schnittstelle bereitstellen, die gesammelte W&ouml;rter empf&auml;ngt und ein Gedicht zur&uuml;ckgibt.
   > - DeepSeek API zur Gedichtgenerierung verwenden.
   > - API Key in `.env`-Datei speichern und in `.gitignore` ignorieren.

2. DeepSeek API Key eingeben. (Erh&auml;ltlich unter [https://platform.deepseek.com/](https://platform.deepseek.com/))
   1. Der API Key des LLM wird verwendet, um gro&szlig;e Modelle in Ihrem eigenen Projekt aufzurufen. Da es sich um sensible Informationen handelt, die nicht &ouml;ffentlich sein d&uuml;rfen, muss er separat in einer Konfigurationsdatei gespeichert werden.
      **Warum eine `.env`-Datei verwenden und sie nicht auf GitHub hochladen?**
   - Die `.env`-Datei dient speziell zur Speicherung von **Schl&uuml;sseln oder Passw&ouml;rtern** (z.B. DeepSeek API Key).
   - Wenn diese Datei auf GitHub hochgeladen wird, kann jeder Ihren Schl&uuml;ssel sehen und missbrauchen.
   - Aus Sicherheitsgr&uuml;nden m&uuml;ssen wir `.env` in der `.gitignore`-Datei deklarieren, damit Git sie nicht verfolgt.
   - So kann Ihr Projekt diese Schl&uuml;ssel lokal weiterhin nutzen, ohne sie im Repository preiszugeben.

3. Nachdem das Ergebnis angezeigt wurde, k&ouml;nnen Sie bei Fehlern oder gew&uuml;nschten &Auml;nderungen Ihre &Auml;nderungsw&uuml;nsche direkt im Chat-Fenster eingeben.
4. Wenn Sie mit dem Seitendesign unzufrieden sind, k&ouml;nnen Sie das Interface auch in Figma oder Mastergo neu gestalten und die Designideen an den Agent zur&uuml;ckmelden.

- **Beispiel**

> Bitte entwerfen Sie eine **zweiseitige Web-Anwendung** namens _Word-Snake_.
>
> - **Game-Seite:**
> - Schlange wird per Tastatur gesteuert.
> - Die Schlange frisst englische W&ouml;rter statt normale Nahrung.
> - Rechtes Panel zeigt gesammelte W&ouml;rter und deren Anzahl.
> - Nach Spielende wird der Wortbestand nicht gel&ouml;scht, sondern im n&auml;chsten Spiel weiterverwendet.
> - **Make Poem-Seite:**
> - Denselben gemeinsamen Wortbestand anzeigen.
> - Nutzer w&auml;hlt einige W&ouml;rter aus und klickt auf **Generate Poem**-Button.
> - Diese W&ouml;rter an das Backend senden, das DeepSeek API generiert ein Gedicht.
> - Nach Gedichtgenerierung die verwendeten W&ouml;rter aus dem Bestand l&ouml;schen oder verringern.
> - **Navigation:** Einfacher Tab oder Top-Men&uuml; zum Wechseln zwischen den beiden Seiten.
> - **Gemeinsamer Zustand:** Sicherstellen, dass gesammelte W&ouml;rter auf beiden Seiten stets synchron sichtbar sind.

- **Ergebnis-Beispiel**

![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image1.png)![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image2.webp)

---

# 5. AI Agent Plattform-Vergleich (Wie man die beste Kombination f&uuml;r einfache Projekte w&auml;hlt)

Verschiedene Vibe Coding Plattformen haben unterschiedliche St&auml;rken und Workflows. Wir haben denselben "Snake-Spiel mit DeepSeek API"-Anforderungssatz auf mehreren Plattformen getestet und aus der Perspektive von Einsteigern bewertet. Hier ist die Zusammenfassung.

## 1. Vergleichskriterien

1. **Ziel**
   Ein Snake-Web-App mit DeepSeek API integrieren.
2. **Spieldetails**
   1. Das Spiel generiert Gedichte &uuml;ber die DeepSeek LLM API.
   2. Die Schlange frisst englische W&ouml;rter; gesammelte W&ouml;rter bleiben nach Spielende erhalten und werden im n&auml;chsten Spiel weiterverwendet. Gleiche W&ouml;rter k&ouml;nnen mehrfach gesammelt und separat gez&auml;hlt werden.
   3. Wenn ein Gedicht generiert wird, werden die verwendeten W&ouml;rter aus dem Bestand entfernt.

3. **Must-Haves**
   1. Eine lauff&auml;hige Frontend-Seite mit Snake-Spiel (Tastatursteuerung, Canvas-Rendering).
   2. Wort-Sammelmechanismus (W&ouml;rter erscheinen auf dem Brett, Schlange frisst sie, Seitenleiste-Liste wird aktualisiert).
   3. Persistenz des Wortbestands &uuml;ber mehrere Spielrunden.
   4. Backend mit DeepSeek API (ohne API Key zun&auml;chst ein Mock-Gedicht zur&uuml;ckgeben).
   5. "Gedicht generieren"-Button: Klick ruft Backend auf, zeigt Gedicht, aktualisiert Wortbestand basierend auf Nutzung.
   6. `.env`-Unterst&uuml;tzung f&uuml;r API Key und `.gitignore` zur Vermeidung von Schl&uuml;ssellecks.

4. **Nice-to-Haves**
   1. Nutzer kann ausw&auml;hlen, welche W&ouml;rter f&uuml;r das Gedicht verwendet werden.
   2. Nutzerfreundliche Erfahrung (z.B. klare Wortliste in der Seitenleiste, gutes Layout im Gedicht-Bereich).
   3. Kommentare im Code f&uuml;r Einsteiger, die die Schl&uuml;ssellogik erkl&auml;ren.

## 2. Codierungsergebnis-Vergleich

### 1. Lovable (Web-based)

- **Plattform-Typ:** Web
- **Haupteigenschaften und Workflow:** Lovable macht Integration und Zusammenarbeit gut, automatisiert Initialisierungen wie die Verbindung mit Supabase-Datenbank und macht den Projektaufbau sehr reibungslos. Sie beschreiben einfach die Projektanforderungen, und der Agent verbindet alle Dienste und erstellt die Grundstruktur.
- **Geeignete Nutzer:** F&uuml;r Einsteiger, die zum ersten Mal Vibe Coding ausprobieren, ist Lovable eine sehr freundliche Wahl. Es vereinfacht die Komplexit&auml;t der Mehrdienst-Verkettung und l&auml;sst Sie sich auf Prompts und Iterationen konzentrieren statt auf Umgebungskonfiguration. Dank hoher Automatisierung erhalten Sie schnell einen lauff&auml;higen Prototyp.
- **Prompt-Prozess:**
  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image3.webp)
- **Snake-Spiel-Ergebnis:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image4.webp)![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image5.webp)

- **Preis:** Relativ teuer, aber mit einer Uni-E-Mail k&ouml;nnen Sie durch Studenten-Verifizierung den halben Preis erhalten.
  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image6.webp)

### 2. Cursor (IDE)

- **Plattform-Typ:** Desktop-Anwendung (PC)
- **Haupteigenschaften und Workflow:** Cursor ist eine propriet&auml;re IDE mit integrierten AI-F&auml;higkeiten, unterst&uuml;tzt Windows, macOS und Linux. Es baut Codegenerierung, intelligentes Umschreiben und Codebasis-Abfrage direkt in die Entwicklungsumgebung ein. Im Vergleich zu Web-Tools ist es n&auml;her an der traditionellen lokalen Entwicklungserfahrung. Da es eine lokale Umgebung ist, variieren die Konfigurationen verschiedener Computer, was gelegentlich zu umgebungsbezogenen Problemen f&uuml;hren kann. Der Vorteil: Das Projekt ist lokal, keine zus&auml;tzte Download- oder Laufzeitumgebung n&ouml;tig, Cursor erledigt viele m&uuml;hsame Schritte f&uuml;r Sie.
- **Geeignete Nutzer:** F&uuml;r Nutzer mit gewissen Programmierkenntnissen ist Cursor eine sehr leistungsstarke und vertraute Umgebung. F&uuml;r absolute Einsteiger ohne Vorkenntnisse ist die Lernkurve jedoch steiler, da man selbst Projektstruktur, Abh&auml;ngigkeitsmanagement und Dateiorganisation verstehen muss. Besser geeignet f&uuml;r Entwickler, die AI-Unterst&uuml;tzung in ihren traditionellen Codierungs-Workflow integrieren wollen.
- **Prompt-Prozess:**
  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image7.webp)
- **Snake-Spiel-Ergebnis:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image8.webp)![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image9.webp)

- **Preis:**
  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image10.webp)

### 3. Z.ai (Web-based)

- **Plattform-Typ:** Web
- **Haupteigenschaften und Workflow:** Z.ai ist relativ direkt zu bedienen, aber eine offensichtliche Herausforderung ist: Sie m&uuml;ssen den generierten Code **manuell kopieren und einf&uuml;gen**. Die Plattform selbst hat kein Echtzeit-Vorschaufenster, sodass man die Code-Ausf&uuml;hrung nicht sofort sehen kann.
- **Geeignete Nutzer:** Diese Plattform erfordert einen "hands-on" Ansatz. Fehlende Automatisierung bedeutet, dass Sie direkt mit dem Code arbeiten m&uuml;ssen, was f&uuml;r Leute, die AI-Outputs tief verstehen wollen, eine Art Training ist. H&auml;ufiges Kopieren und Einf&uuml;gen bringt jedoch Effizienzprobleme und Fehler Risiken mit sich. Besser geeignet f&uuml;r Leute, die "rohe AI-Code-Outputs" sehen wollen, nicht f&uuml;r diejenigen, die ein One-Click-Erlebnis suchen.
- **Prompt-Prozess:**
  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image11.webp)
- **Snake-Spiel-Ergebnis:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image12.png)![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image13.png)

- **Preis:**
  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image14.webp)

### 4. Replit (Web-based)

- **Plattform-Typ:** Web
- **Haupteigenschaften und Workflow:** Replit ist eine All-in-One Online-Entwicklungs- und Bereitstellungsumgebung. Im Browser k&ouml;nnen Sie Code schreiben, Programme ausf&uuml;hren und eine Online-Zugriffs-URL generieren. Vor dem Codieren zeigt es einen klaren Aktionsplan; au&szlig;erdem gibt es einen visuellen Editor, in dem Sie direkt im Vorschaufenster die UI &auml;ndern k&ouml;nnen, und der Quellcode wird automatisch synchronisiert. So k&ouml;nnen Sie jederzeit &uuml;berpr&uuml;fen, ob die AI-Ausgabe Ihren Erwartungen entspricht, und die Anzahl der Hin- und Her-Korrekturen erheblich reduzieren.

  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image15.webp)

- **Geeignete Nutzer:** Replit ist sehr einsteigerfreundlich. Es vereinfacht den vollst&auml;ndigen Kreislauf von der Codierung bis zur Bereitstellung, ohne zus&auml;tzte Server- oder Hosting-Konfiguration. Die Kollaborationsfunktion ist ebenfalls stark, ideal f&uuml;r Gruppenprojekte unter Kommilitonen oder Remote-Hilfe.
- **Prompt-Prozess:** W&auml;hrend des Aufbaus verstand die AI die Anforderungen nicht sofort; es dauerte etwa 3 Iterationsrunden, bis das Ergebnis zufriedenstellend war.
  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image16.webp)
- **Snake-Spiel-Ergebnis:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image17.webp)![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image18.webp)

- **Preis:**
  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image19.webp)

### 5. Minimax (Web-based)

- **Plattform-Typ:** Web
- **Haupteigenschaften und Workflow:** Minimax ben&ouml;tigt bei der Aufgabenausf&uuml;hrung oft l&auml;nger. Der Prozess umfasst h&auml;ufig: AI entdeckt und repariert automatisch Fehler, daher kann der gesamte Prozess langsam oder etwas m&uuml;hsam sein. In diesem Projekt erstellt der Agent zun&auml;chst einen detaillierten Plan und baut dann Schritt f&uuml;r Schritt Backend, Datenbank und Frontend-Logik auf.
- **Geeignete Nutzer:** Da es automatisch Tests ausf&uuml;hrt und Fehler repariert, sind Zeit- und Token-Verbrauch hoch, aber man kann klar sehen, wie AI Probleme lokalisiert und l&ouml;st, was aus Lernperspektive sehr wertvoll ist.
- **Prompt-Prozess:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image20.webp)![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image21.webp)![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image22.webp)![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image23.webp)

- **Snake-Spiel-Ergebnis:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image24.webp)![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image25.webp)

- **Preis:** Die kostenlose Version kann bei komplexen Projekten wahrscheinlich nicht vollst&auml;ndig durchlaufen, daher wird ein kostenpflichtiges Upgrade empfohlen, um sicherzustellen, dass das Projekt vollst&auml;ndig erstellt werden kann.
  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image26.webp)

### 6. Trae (IDE)

- **Plattform-Typ:** Desktop-Anwendung (PC)
- **Haupteigenschaften und Workflow:** Als Desktop-Anwendung hat Trae gegen&uuml;ber Web-Tools normalerweise Vorteile bei Leistung und Reaktionsgeschwindigkeit. Es erfordert jedoch Download und Installation, was f&uuml;r einige Nutzer eine etwas h&ouml;here Einstiegsh&uuml;rde darstellt. Da es eine lokale Umgebung ist, bringen unterschiedliche Computerkonfigurationen und Abh&auml;ngigkeitsumgebungen eine gewisse Unsicherheit mit sich. Der Vorteil: Trae hilft Ihnen, Projekterstellung und Laufzeitkonfiguration lokal abzuschlie&szlig;en; Sie k&ouml;nnen direkt auf Ihrem Rechner entwickeln und debuggen.
- **Geeignete Nutzer:** Besser geeignet f&uuml;r Nutzer, die langfristig Vibe Coding-Projekte betreiben und ein spezielles Desktop-Tool verwenden m&ouml;chten. F&uuml;r Gelegenheitsnutzer ist es m&ouml;glicherweise nicht die leichteste Wahl.
- **Prompt-Prozess:**
  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image27.webp)
- **Snake-Spiel-Ergebnis:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image28.webp)![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image29.webp)

- **Preis:** Preis relativ g&uuml;nstig, selbst die kostenlose Version reicht f&uuml;r qualitativ gute kleine Projekte.
  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image30.webp)

### 7. V0 (Web-based)

- **Plattform-Typ:** Web
- **Haupteigenschaften und Workflow:** V0 ist ein Tool von Vercel, das sich auf die Generierung von React-UI-Komponenten konzentriert. Es zeichnet sich durch die Erzeugung hochwertiger, produktionsreifer Oberfl&auml;chen aus. In der Praxis kann man jedoch auf Probleme sto&szlig;en wie "Code-Ansicht schwer zu finden" oder "keine klare Angabe, wo der API Key konfiguriert werden sollte".
- **Geeignete Nutzer:** V0 ist sehr geeignet f&uuml;r Studierende oder Designer, die sich auf Frontend und UI/UX-Design konzentrieren. Es ist jedoch keine vollst&auml;ndige Full-Stack-L&ouml;sung; Sie ben&ouml;tigen weiterhin andere Plattformen f&uuml;r Backend-Logik und API-Integration. Wenn Ihr Ziel "ein komplettes Projekt in einem Durchgang" ist, ist es m&ouml;glicherweise nicht die beste Erstwahl.
- **Prompt-Prozess:**
  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image31.webp)

  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image32.webp)

- **Snake-Spiel-Ergebnis:**
  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image33.png)![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image34.webp)
- **Preis:** Kostenlose Nutzer k&ouml;nnen etwa 4-5 einfache Projekte erstellen.
  ![](../../../../zh-cn/stage-1/appendix-articles/example0-1/images/image35.webp)

## 3. Plattform-Gesamtvergleich

| **Plattform** | **Bewertung** | **Plattform** | **Anmerkungen** |
| --- | --- | --- | --- |
| **[Lovable](https://lovable.dev/)** | Sehr freundlich f&uuml;r AI-Programmier-Einsteiger, einfacher Einstieg, reibungslose Erfahrung, ideal als Erstwahl. | Web-based | Automatisiert Supabase- und andere Dienstverbindungen, reduziert Konfigurationsaufwand. |
| **[Cursor](https://cursor.com/cn/agents)** | Geeignet f&uuml;r Nutzer mit Entwicklungserfahrung, steigert Produktivit&auml;t und Code-Qualit&auml;t erheblich. | PC | Erfordert gewisse Programmierkenntnisse, lokales Umfeld erfordert eigenes Verst&auml;ndnis von Projektstruktur und Abh&auml;ngigkeiten. |
| **[Z.ai](https://chat.z.ai/)** | Besser geeignet f&uuml;r Nutzer mit Programmierkenntnissen, die AI-Code-Output-Details direkt untersuchen wollen. | Web-based | Kein Vorschaufenster, Ergebnispr&uuml;fung m&uuml;hsam; Code manuell kopieren, Ordner und Dateien manuell erstellen und Service manuell starten. |
| **[Replit](https://replit.com/~)** | Empfohlen f&uuml;r Nutzer, die Ideen schnell zu zug&auml;nglichen Online-Services machen wollen. | Web-based | All-in-One Online-Entwicklung und -Bereitstellung, unterst&uuml;tzt Kollaboration und bietet visuellen Editor. |
| **[Minimax](https://agent.minimaxi.com/)** | Geeignet f&uuml;r Leute, die den gesamten AI-Fehlererkennungs- und -Reparaturprozess sehen und daraus lernen wollen, aber insgesamt langsamer und token-intensiv. | Web-based | L&auml;ngerer Gesamtprozess, AI f&uuml;hrt mehrfach automatisch Tests aus und repariert Fehler. |
| **[Trae](https://www.trae.ai/)** | F&uuml;r Nutzer mit Programmiererfahrung, die Desktop-IDE + AI Agent kombinieren wollen, ein leistungsstarkes Effizienz-Tool. | PC | Lokale Installation und Umgebungskonfiguration erforderlich, aber bessere Leistung, geeignet f&uuml;r langfristige Vibe Coding-Projekte. |
| **[V0](https://v0.app/)** | Optimiert f&uuml;r Nicht-Entwickler, die schnell React-UI erstellen wollen, geeignet f&uuml;r Frontend-/Design-orientierte Studierende. | Web-based | Fokussiert auf React-UI-Generierung, muss mit anderen Plattformen f&uuml;r Backend und vollst&auml;ndigen App-Aufbau kombiniert werden. |
---
title: 'Vergleich von 7 KI-Programmiertools'
description: 'Praxisnaher Vergleich von Web-Vibe-Coding-Plattformen mit einer einheitlichen Aufgabe: Bedienbarkeit, Code-Kontrolle und Deployment.'
---
