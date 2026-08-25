---
title: 'Double-Diamond-Modell: Erst das Richtige tun, dann die Dinge richtig tun'
description: 'Ein Einf&uuml;hrungsartikel zum Double-Diamond-Modell f&uuml;r Einsteiger. Verstehen Sie die vier Phasen Discover, Define, Develop und Deliver und vermeiden Sie es, voreilig Prototypen zu erstellen, bevor das Problem klar ist.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
</script>

# Double-Diamond-Modell

<a id="top-dd"></a>

Nach der Bedarfsanalyse und den Nutzerinterviews liegt meist viel Material vor: Erfahrungen verschiedener Nutzer, Schw&auml;chen bestehender Werkzeuge und mehrere denkbare Verbesserungsrichtungen. Je mehr Material zusammenkommt, desto schwieriger wird die Auswahl.

Wer „das Problem verstehen“ und „eine L&ouml;sung entwerfen“ nicht trennt, sucht leicht schon w&auml;hrend der Interviews nach Begr&uuml;ndungen f&uuml;r die eigene Lieblingsfunktion. Das Double-Diamond-Modell trennt beide Arbeiten durch zweimaliges Divergieren und Konvergieren.

Dieses Kapitel stellt die vier Phasen Discover, Define, Develop und Deliver vor und erl&auml;utert ihre jeweiligen Eingaben, Ergebnisse und typischen Fehler.

<a id="dd-what"></a>
## [1. Zweimal divergieren und konvergieren](#top-dd)

Das vom britischen **Design Council** verbreitete Double-Diamond-Modell stellt Problem- und L&ouml;sungsraum als zwei aufeinanderfolgende Diamanten dar.

Warum "Diamanten"? Weil jeder Diamant zwei entgegengesetzte, aber gleicherma&szlig;en wichtige Aktionen enth&auml;lt:

- **Divergieren**: Zun&auml;chst den Horizont erweitern und mehr M&ouml;glichkeiten betrachten
- **Konvergieren**: Dann den Bereich verengen, Entscheidungen treffen und Priorit&auml;ten setzen

Der gesamte Prozess besteht aus vier Schritten:

1. **Discover**: Nutzer, Probleme, Umfeld und Markt umfassend verstehen
2. **Define**: Aus den vielen Informationen das wirklich l&ouml;swerte Kernproblem herausfiltern
3. **Develop**: Mehrere L&ouml;sungsans&auml;tze um das Kernproblem divergieren
4. **Deliver**: Ausw&auml;hlen, Prototypen erstellen, testen und die geeignetste L&ouml;sung liefern

Wenn man diese vier Schritte auf einen einpr&auml;gsamen Satz komprimiert:

- **Erster Diamant**: Zun&auml;chst kl&auml;ren, welches Problem &uuml;berhaupt gel&ouml;st werden soll
- **Zweiter Diamant**: Dann entscheiden, mit welchem Ansatz es gel&ouml;st werden soll

Die ersten beiden Phasen bearbeiten den Problemraum, die letzten beiden den L&ouml;sungsraum.

<figure class="field-figure field-figure--diagram">
  <a href="https://www.designcouncil.org.uk/resources/framework-for-innovation/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/design-council-double-diamond-wide.png" alt="Offizielle Double-Diamond-Grafik des Design Council mit Discover, Define, Develop und Deliver" loading="lazy" />
  </a>
  <figcaption><strong>Zuerst das Originalbild:</strong> Der linke Diamant &ouml;ffnet sich in Discover und verengt sich in Define; der rechte &ouml;ffnet sich erneut in Develop und verengt sich in Deliver. Der Design Council betont zugleich, dass dies kein linearer Prozess ist, den man nur einmal durchl&auml;uft. Zeigen Tests ein Problem, kann das Team in eine fr&uuml;here Phase zur&uuml;ckkehren. Quelle: <a href="https://www.designcouncil.org.uk/resources/framework-for-innovation/" target="_blank" rel="noreferrer">Design Council</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.</figcaption>
</figure>

## 2. Warum Problem und L&ouml;sung getrennt werden sollten

Der typische Rhythmus von Einsteigern bei der Produktentwicklung sieht oft so aus:

- Eine Idee kommt auf
- Man findet die Richtung toll
- Sofort Prototypen zeichnen
- Beim Erstellen werden es immer mehr Funktionen
- Am Ende wei&szlig; man nicht mehr, welches Problem man eigentlich l&ouml;st

Der Wert des Double-Diamond-Modells liegt nicht darin, den Prozess komplizierter zu machen, sondern darin, **"das Problem verstehen" und "die L&ouml;sung entwerfen" voneinander zu trennen**.

Das klingt banal, ist aber in der Praxis &auml;u&szlig;erst wichtig. Denn viele gescheiterte Produkte scheitern nicht an mangelndem Engagement, sondern daran, dass:

- Das falsche Problem gew&auml;hlt wurde
- Die Nutzer missverstanden wurden
- Zu fr&uuml;h eine L&ouml;sung festgelegt wurde
- Viel Zeit in Detailveredelung investiert wurde, ohne die Richtung zu validieren

Das Double-Diamond-Modell erinnert Sie st&auml;ndig daran:

- Nicht davon ausgehen, dass das Problem bereits gekl&auml;rt ist, nur weil die Idee naheliegt
- Nicht davon ausgehen, dass die L&ouml;sung es wert ist, umgesetzt zu werden, nur weil sie machbar ist
- Nicht davon ausgehen, dass die Nutzer sie wirklich brauchen, nur weil der Prototyp komplett aussieht

<a id="dd-first"></a>
## [3. Erster Diamant: der Problemraum](#top-dd)

Der erste Diamant konzentriert sich auf **das Problem selbst**, nicht auf die L&ouml;sung.

Man kann ihn in einem Satz zusammenfassen: **Nicht sofort loslegen, sondern zuerst kl&auml;ren, ob es sich &uuml;berhaupt lohnt.**

### 3.1 Discover: Zun&auml;chst den Problemraum &ouml;ffnen

Die Kernaufgabe der Discover-Phase ist **umfassende Recherche, keine schnellen Schl&uuml;sse**.

Typische T&auml;tigkeiten in diesem Schritt:

- Beobachten, wie Nutzer in echten Szenarien agieren
- Potenzielle Nutzer interviewen und herausfinden, wann sie zuletzt ein Problem hatten
- Beobachten, wie sie sich aktuell behelfen
- Wettbewerbs- und Alternativl&ouml;sungen analysieren
- Markt-, Prozess-, Restriktions- und Wertsch&ouml;pfungsinformationen sammeln

Viele glauben, Discover bedeute einfach "mehr Material lesen". Wichtiger ist jedoch: **Sie m&uuml;ssen Menschen und Szenarien verstehen, nicht nur Informationen sammeln.**

Wenn Sie beispielsweise ein Tool entwickeln m&ouml;chten, das "AI beim Erstellen von Meeting-Protokollen hilft", sollten Sie in der Discover-Phase vor allem Folgendes kl&auml;ren:

- Was Nutzer nach Meetings am meisten belastet
- Ist das Aufzeichnen das Problem, das Zusammenfassen oder das Weiterleiten
- Schreiben sie selbst, lassen sie Praktikanten schreiben, h&ouml;ren sie Aufnahmen ab oder verzichten sie ganz auf Protokolle
- Welche Meeting-Szenarien Protokolle am meisten ben&ouml;tigen und welche &uuml;berhaupt nicht

Das wichtigste Ziel dieses Schritts ist nicht, eine Antwort zu finden, sondern **nicht zu fr&uuml;h zu glauben, man h&auml;tte bereits die Antwort.**

<figure class="field-figure">
  <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/creative-commons-design-workshop.jpg" alt="Workshop zur Usability-Forschung von Creative Commons mit nach Interviewfragen geordneten Notizzetteln" loading="lazy" />
  </a>
  <figcaption><strong>Echtes Discover-Material ist unordentlich.</strong> Das Creative-Commons-Team f&uuml;hrte 2018 81 Interviews und wertete 36 weitere bestehende Interviews aus. Jedes Blatt steht f&uuml;r eine Frage, die Notizzettel halten Antworten fest, Punkte markieren Vergleiche. Zun&auml;chst bleiben die Unterschiede sichtbar, statt das Material vorschnell auf eine Antwort zu reduzieren. Foto und Fallstudie: <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">Creative Commons</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.</figcaption>
</figure>

### 3.2 Define: Aus den Informationen das Kernproblem destillieren

Wenn Discover das &Ouml;ffnen des Horizonts ist, ist Define das Einengen.

In der Define-Phase geht es nicht darum, alle Beobachtungen zu behalten, sondern zu fragen:

- Welches Problem ist wirklich am wichtigsten und sollte zuerst gel&ouml;st werden
- Welches Problem am h&auml;ufigsten auftritt, am schmerzhaftesten ist und den gr&ouml;&szlig;ten Wert bietet
- Auf welches Szenario wir uns in der ersten Version konzentrieren sollten

Der Kern dieses Schritts besteht darin, ein breites Thema auf eine klare Problemdefinition zu verdichten.

Vielleicht sagen Sie zun&auml;chst:

> Ich m&ouml;chte ein AI-Tool entwickeln, das die Meeting-Effizienz steigert.

In der Define-Phase k&ouml;nnte eine bessere Formulierung lauten:

> Wir l&ouml;sen zun&auml;chst das Problem, dass Projektteams nach 30 bis 60 Minuten dauernden Kooperationsmeetings nicht in der Lage sind, innerhalb von 10 Minuten ein Protokoll mit Aufgaben, Verantwortlichen und Fristen zu erstellen.

Jetzt wird das Problem konkreter:

- Wer sind die Nutzer
- Was ist das Szenario
- Wo liegt der Engpass
- Was ist das Erfolgskriterium

Das Wesen von Define ist: **Von "es gibt viele Probleme" konvergieren zu "welches Problem l&ouml;sen wir diesmal zuerst".**

<figure class="field-figure">
  <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/creative-commons-research-synthesis.jpg" alt="Creative-Commons-Team beim Ordnen, Clustern und Markieren von Interviewnotizen" loading="lazy" />
  </a>
  <figcaption><strong>Define bedeutet nicht, den angenehmsten Satz auszuw&auml;hlen.</strong> Im selben Projekt wurden 117 Interviews zusammengef&uuml;hrt, geclustert und auf wiederkehrende Muster untersucht; daraus entstanden 9 Erkenntnisse. Freir&auml;ume, Gruppen und Farben zeigen den Zwischenschritt von Rohantworten zu Themen und Priorit&auml;ten. Foto und Fallstudie: <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">Creative Commons</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.</figcaption>
</figure>

## 4. Zweiter Diamant: der L&ouml;sungsraum

Erst wenn der erste Diamant abgeschlossen ist, sollten Sie in den zweiten Diamanten eintreten. Denn jetzt l&ouml;sen Sie keine vage Richtung mehr, sondern ein konkretes, bereits eingegrenztes Problem.

### 4.1 Develop: L&ouml;sungsans&auml;tze um das Kernproblem divergieren

Der Fokus der Develop-Phase liegt auf **der Exploration mehrerer m&ouml;glicher L&ouml;sungen f&uuml;r dasselbe Problem**.

Beachten Sie: Diese Divergenz unterscheidet sich von der Discover-Phase.

- Die Divergenz in Discover erforscht den Problemraum
- Die Divergenz in Develop erforscht den L&ouml;sungsraum

Beim Meeting-Protokoll-Beispiel k&ouml;nnten Sie in der Develop-Phase Folgendes in Betracht ziehen:

- Web-Tool oder Meeting-Plugin
- Hochgeladene Audioaufzeichnung nachtr&auml;glich verarbeiten oder Echtzeit-Mitschrift
- Nur Zusammenfassung oder Fokus auf Aufgabenextraktion
- Pers&ouml;nliche Effizienz oder Team-Synchronisation betonen
- Freie Bearbeitung f&uuml;r Nutzer oder direkte strukturierte Vorlage ausgeben

Dieser Schritt eignet sich gut f&uuml;r Brainstorming und die Zusammenarbeit im Team.

Aber es gibt eine Voraussetzung: **Alle L&ouml;sungen m&uuml;ssen demselben definierten Problem dienen.**
Wenn das Problem nicht klar definiert ist, wird Develop schnell wieder zu einem ungeordneten Sammelsurium von Funktionen.

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_1.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/develop-idea-board.jpg" alt="Ideenwand aus einem Design-Thinking-Workshop von Wikimedia Deutschland" loading="lazy" />
  </a>
  <figcaption><strong>Develop h&auml;lt zun&auml;chst mehrere Antworten offen.</strong> Diese Tafel stammt aus einem Design-Thinking-Workshop von Wikimedia Deutschland. Ideen liegen nach Themen verteilt und sind noch nicht zu einer Funktionsliste verdichtet. Der Wert der Divergenz liegt nicht in der Zahl der Zettel, sondern darin, vor der Auswahl tats&auml;chlich verschiedene Wege zu vergleichen. Foto: <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_1.jpg" target="_blank" rel="noreferrer">Corinna Schuster (WMDE) / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</figcaption>
</figure>

### 4.2 Deliver: L&ouml;sung ausw&auml;hlen, Prototyp erstellen, testen und liefern

Deliver ist die Konvergenzphase im zweiten Diamanten.

Jetzt geht es nicht mehr darum, weiter nachzudenken, sondern zu entscheiden:

- Welcher Ansatz passt am besten zur aktuellen Phase
- Welche Version am kleinsten, aber am n&uuml;tzlichsten ist
- Welche Funktionen zuerst entwickelt werden m&uuml;ssen und welche sp&auml;ter kommen k&ouml;nnen
- Wie man Prototypen erstellt, testet und in kleinem Rahmen validiert

Viele glauben, Deliver bedeute einfach "launch". Genauer gesagt bedeutet es: **Eine L&ouml;sung in etwas &Uuml;berpr&uuml;fbares, Validierbares und Iterierbares verwandeln.**

Das kann sein:

- Ein Low-Fidelity-Flussdiagramm
- Ein Figma-Prototyp
- Ein lauff&auml;higer MVP
- Ein kleiner Nutzer-Test
- Eine iterative Version nach echtem Feedback

Der Fokus von Deliver liegt nicht auf "perfekter Auslieferung", sondern darauf, **die L&ouml;sung so schnell wie m&ouml;glich in einer realen Umgebung zu validieren.**

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:TestingPaperPrototype.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/paper-prototype-test.jpg" alt="Eine Person schreibt in ein Eingabefeld eines Papierprototyps" loading="lazy" />
  </a>
  <figcaption><strong>Testbar hei&szlig;t nicht fertig programmiert.</strong> Bei einem Papierprototyp werden Oberfl&auml;chen auf Papier gezeichnet; Teilnehmende tippen und schreiben darauf, Forschende legen die n&auml;chste Seite vor. Damit lassen sich Ablauf, Texte und Reihenfolge pr&uuml;fen, ohne erst wochenlang eine wom&ouml;glich falsche Richtung zu implementieren. Foto: <a href="https://commons.wikimedia.org/wiki/File:TestingPaperPrototype.jpg" target="_blank" rel="noreferrer">d_jan / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>.</figcaption>
</figure>

## 5. Die vier Phasen im Vergleich

Nachdem wir die vier Phasen einzeln betrachtet haben, stellt die folgende Grafik sie in einem Prozess gegen&uuml;ber. W&auml;hlen Sie eine Phase und vergleichen Sie Arbeit, Ergebnis und die Dinge, die vorerst nicht anstehen.

<DoubleDiamondNavigator />

<!--

Wenn Sie die vier Phasen immer wieder durcheinanderbringen, merken Sie sich einfach diese Version:

| Phase | Was Sie tun | Schl&uuml;sselw&ouml;rter | Typische Ergebnisse |
| --- | --- | --- | --- |
| Discover | Problem verstehen | Recherche, Beobachtung, Interviews, Informationssammlung | Nutzererkenntnisse, Szenarienotizen, Problemliste |
| Define | Problem definieren | Destillieren, Fokussieren, Priorisieren, Problem umformulieren | Problemdefinition, Priorit&auml;ten, MVP-Ansatz |
| Develop | L&ouml;sungen erkunden | Brainstorming, Vergleichen, Co-Kreation, Prototyp-Ideen | L&ouml;sungsliste, Flussskizzen, Prototyp-Richtung |
| Deliver | L&ouml;sung validieren | Prototyp, Testen, Iterieren, Ausliefern | Prototyp, Test-Feedback, optimierte Version |

Noch kompakter:

- **Discover / Define**: "Die richtigen Dinge tun"
- **Develop / Deliver**: "Die Dinge richtig tun"
-->

## 6. Die h&auml;ufigsten Missverst&auml;ndnisse zum Double-Diamond-Modell

### 6.1 Direkt zu Deliver springen, ohne Discover

Das ist der h&auml;ufigste Fehler. Viele beginnen sofort mit dem Zeichnen von Prototypen, dem Schreiben von PRDs, dem Anbinden von Modellen und dem Erstellen von Seiten, sobald sie eine Idee haben.

Das Problem ist nicht, dass Sie nicht flei&szlig;ig genug arbeiten, sondern dass Sie m&ouml;glicherweise nicht einmal best&auml;tigt haben, ob sich das Problem &uuml;berhaupt zu l&ouml;sen lohnt.

### 6.2 Lange Discover-Phase, aber nie Define

Ein anderer Extremfall: st&auml;ndig recherchieren, Material lesen, Interviews f&uuml;hren, aber sich nicht trauen zu konvergieren.

Das Double-Diamond-Modell soll Sie nicht endlos divergieren lassen, sondern erinnert Sie: Nach der Divergenz m&uuml;ssen Sie in die Entscheidungs- und Priorisierungsphase &uuml;bergehen.

### 6.3 Nach Define das Problem heimlich &auml;ndern

Viele Teams &auml;ndern in der Develop-Phase die Problemdefinition, weil ein bestimmter Ansatz einfacher umsetzbar ist.

Das ist gef&auml;hrlich. Denn Sie l&ouml;sen m&ouml;glicherweise gar kein Problem, sondern suchen nur Rechtfertigungen f&uuml;r Ihren bevorzugten Ansatz.

### 6.4 Deliver als "kompletter Launch" missverstehen

Deliver bedeutet nicht, dass das fertige Produkt komplett sein muss. Oft ist ein testbarer Prototyp oder eine kleine Nutzererprobung bereits ein gutes Deliverable.

## 7. Wie das Double-Diamond-Modell bei AI-Produkten eingesetzt wird

AI-Produkte neigen besonders zur "F&auml;higkeiten zuerst"-Falle, weil die Modellf&auml;higkeiten so verlockend aussehen. Man m&ouml;chte direkt dar&uuml;ber nachdenken:

- Soll ich multimodal integrieren
- Soll ich einen Agenten erstellen
- Soll ich einen Workflow hinzuf&uuml;gen
- Soll ich Sprache, Bilder oder Websuche anbinden

Das Double-Diamond-Modell zwingt Sie jedoch, zuerst zu fragen:

- Wo genau h&auml;ngen die Nutzer fest
- Muss dieses Problem zwingend mit AI gel&ouml;st werden
- Wenn man keine AI verwendet, was genau ist am aktuellen Ansatz am schlechtesten
- Wenn AI hinzugef&uuml;gt wird, was ist der zentrale Fortschritt

Das hilft Ihnen, eine h&auml;ufige Situation zu vermeiden: **Starke F&auml;higkeiten, schwacher Wert.**

Ein praktischer Ablauf:

1. In der Discover-Phase beobachten, wie Nutzer Aufgaben aktuell erledigen
2. In der Define-Phase das schmerzhafteste Szenario als klare Problemdefinition formulieren
3. In der Develop-Phase vergleichen, welche AI-F&auml;higkeiten am besten zu diesem Problem passen
4. In der Deliver-Phase eine Minimalversion erstellen und von echten Nutzern testen lassen

## 8. Eine direkt anwendbare Double-Diamond-Vorlage

Wenn Sie an Ihrem eigenen Produkt arbeiten, k&ouml;nnen Sie in dieser Reihenfolge vorgehen:

### Discover

- Wer sind die Nutzer, die ich beobachte?
- Wann hatten sie zuletzt dieses Problem?
- Wie l&ouml;sen sie es derzeit?
- Was sie am meisten nervt, am langsamsten ist und sie am wenigsten beruhigt?

### Define

- Welches dieser Probleme ist am wertvollsten und sollte zuerst gel&ouml;st werden?
- Welches Szenario ist am h&auml;ufigsten oder am kritischsten?
- Wen und was bedienen wir in der ersten Version ausschlie&szlig;lich?
- Wie &auml;ndert sich der Nutzerstatus, wenn das Problem erfolgreich gel&ouml;st ist?

### Develop

- Welche m&ouml;glichen L&ouml;sungen gibt es f&uuml;r dieses Problem?
- Welche L&ouml;sungen sind am leichtesten, am schnellsten und am einfachsten zu validieren?
- Was muss zwingend gemacht werden, was kann sp&auml;ter erfolgen?

### Deliver

- Was ist das Minimalste, das wir liefern k&ouml;nnen, um diese Richtung zu validieren?
- Ist es ein Flussdiagramm, ein Prototyp oder ein MVP?
- Wen m&uuml;ssen wir zum Testen einladen?
- Wie entscheiden wir nach dem Test, ob wir weitermachen, &auml;ndern oder abbrechen?

<figure class="field-figure field-figure--portrait">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_Gruppenarbeit_2.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/wmde-group-workshop.jpg" alt="Teilnehmende eines Design-Thinking-Workshops von Wikimedia Deutschland entwickeln gemeinsam L&ouml;sungen" loading="lazy" />
  </a>
  <figcaption><strong>Develop bedeutet, Ideen sichtbar und vergleichbar zu machen.</strong> Die Teilnehmenden schneiden, ordnen und bauen gemeinsam, statt auf die eine perfekte Idee zu warten. Foto: Corinna Schuster (WMDE), <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</figcaption>
</figure>

## 9. Ein Beispiel, das auch Einsteiger verstehen

Angenommen, Sie m&ouml;chten ein AI-Tool entwickeln, "das Hochschulabsolventen bei der Vorbereitung von Lebensl&auml;ufen f&uuml;r Bewerbungen hilft".

Viele w&uuml;rden sofort in den zweiten Diamanten springen und &uuml;ber Folgendes nachdenken:

- Ein-Klick-Versch&ouml;nerung
- Intelligentes Umschreiben
- Automatisches JD-Matching
- Generierung von Selbstvorstellungen

Nach dem Double-Diamond-Modell w&auml;re ein besserer Prozess:

### Erster Diamant

**Discover**

- Mit frischen Absolventen dar&uuml;ber sprechen, wann sie zuletzt einen Lebenslauf ge&auml;ndert haben
- Beobachten, wie sie ihren alten Lebenslauf in eine neue Version umwandeln
- Verstehen, ob sie am meisten von "nicht wissen, was sie schreiben sollen", "nicht wissen, wie sie &auml;ndern sollen" oder "nicht beurteilen k&ouml;nnen, ob es gut genug ist" betroffen sind

**Define**

- Zu einer spezifischeren Problemdefinition konvergieren:
- Nicht "Studierende k&ouml;nnen keine Lebensl&auml;ufe erstellen"
- Sondern "Studierende bei der ersten Bewerbung um ein Praktikum k&ouml;nnen ihre bisherigen Erfahrungen nicht in Formulierungen umwandeln, die zur Stellenbeschreibung passen, und verz&ouml;gern deshalb ihre Bewerbung"

### Zweiter Diamant

**Develop**

- Mehrere L&ouml;sungsans&auml;tze erw&auml;gen: Vorlagenbibliothek, AI-Umschreibung, Stellenvergleich, Lebenslauf-Bewertung, Fallbeispiele

**Deliver**

- Erste Version nur: "Erfahrungs-Bullet-Points basierend auf der Stellenbeschreibung umschreiben"
- 5 Studierenden zum Test geben und pr&uuml;fen, ob sie schneller die erste Version ihres Lebenslaufs einreichen

Sie werden feststellen: Wenn der erste Diamant gr&uuml;ndlich bearbeitet wurde, wird der zweite viel klarer.

<figure class="field-figure field-figure--artifact">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_Prototyp_Mitmach-O-Mat.png" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/wmde-workshop-prototype.png" alt="Handgezeichneter Mitmach-O-Mat-Prototyp aus einem Wikimedia-Deutschland-Workshop" loading="lazy" />
  </a>
  <figcaption><strong>Ein Prototyp muss zun&auml;chst nur eine Frage beantworten.</strong> Begr&uuml;&szlig;ung, Schaltfl&auml;che und ein kurzer Hinweis reichen bereits, um zu beobachten, ob Teilnehmende den n&auml;chsten Schritt verstehen. Prototyp: Corinna Schuster / WMDE, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</figcaption>
</figure>

<a id="dd-ai"></a>
## [10. Wie Sie AI nutzen k&ouml;nnen, um den Double-Diamond-Prozess zu durchlaufen](#top-dd)

Das Double-Diamond-Modell ist kein AI-Tool, aber AI eignet sich hervorragend als "Beschleuniger" in den vier Phasen. Der Schl&uuml;ssel liegt nicht darin, AI f&uuml;r Sie entscheiden zu lassen, sondern darin, sie zu nutzen, um Ihren Horizont zu erweitern, Informationen zu ordnen, L&ouml;sungen zu vergleichen und Validierungsmaterial zu erstellen.

### 10.1 In der Discover-Phase: AI f&uuml;r eine erste Informationsgrundlage nutzen

Vor offiziellen Interviews und Recherche k&ouml;nnen Sie AI zun&auml;chst einen leichten Problemaufkl&auml;rungsscan durchf&uuml;hren lassen:

- Welche g&auml;ngigen Alternativl&ouml;sungen gibt es auf dem Markt
- Worauf Nutzer in &ouml;ffentlichen Communitys am h&auml;ufigsten klagen
- In welchen Szenarien und bei welchen Zielgruppen dieses Problem auftritt
- Was bestehende Produkte &uuml;bersehen

Dieser Schritt kann echte Recherche nicht ersetzen, eignet sich aber gut, um schnell eine Problem-Landkarte zu erstellen.

Ein einfacher Einsteiger-Prompt k&ouml;nnte lauten:

```text
Ich m&ouml;chte ein Tool entwickeln, das Studierenden beim Umschreiben von Lebensl&auml;ufen hilft.
Bitte schlage nicht sofort Funktionen vor, sondern zeige zuerst, welche Schwierigkeiten in diesem Problem am h&auml;ufigsten auftreten.
```

AI k&ouml;nnte ausgeben:

```text
Erste Problem-Landkarte:

1. Man wei&szlig; nicht, welche Erfahrungen man erw&auml;hnen sollte
2. Man wei&szlig; nicht, wie man den Lebenslauf auf eine bestimmte Stelle anpasst
3. Nach vielen &Uuml;berarbeitungen ist man sich immer noch nicht sicher, ob es gut genug ist
4. Man braucht jemanden zum Gegenlesen, m&ouml;chte aber nicht st&auml;ndig um Gef&auml;lligkeiten bitten
5. Wegen der Unsicherheit verschobt man den Lebenslauf immer wieder
```

Diese Ausgabe soll Ihnen nicht die Entscheidung abnehmen, sondern Ihnen den schnelleren Einstieg in Discover erm&ouml;glichen.

### 10.2 In der Define-Phase: AI beim Konvergieren der Problemdefinition unterst&uuml;tzen

Nachdem man viele Informationen gesammelt hat, ist das Schwierigste oft, das Problem in einen wirklich klaren Satz zu verdichten. Sie k&ouml;nnen Ihre Recherche-Notizen an AI &uuml;bergeben und sie bitten, daraus mehrere Problemdefinitionen zu komprimieren:

```text
Hier sind die Nutzer-Feedbacks und Recherche-Notizen, die ich in der Discover-Phase gesammelt habe:
[Inhalt einf&uuml;gen]

Bitte hilf mir bei drei Dingen:
1. Die h&auml;ufigsten Problemmuster zusammenfassen
2. Nach H&auml;ufigkeit, Schmerzintensit&auml;t und Validierbarkeit 3 priorisierte Probleme identifizieren
3. Jedes Problem als konkrete Problemdefinition formulieren
```

So kommen Sie leichter in die Define-Phase, anstatt im Zustand "es gibt so viele Probleme" stecken zu bleiben.

Sie k&ouml;nnen die Eingabe auch sehr einfach formulieren:

```text
Die Probleme, die ich bisher gesammelt habe:
1. Man wei&szlig; nicht, was man im Lebenslauf schreiben soll
2. Man wei&szlig; nicht, wie man ihn anpasst
3. Man hat nie das Gef&uuml;hl, er sei gut genug, und traut sich nicht, ihn abzuschicken

Bitte sage mir, welches Problem sich am besten f&uuml;r die erste Version eignet.
```

AI k&ouml;nnte ausgeben:

```text
Empfohlenes Priorit&auml;tsproblem:

"Studierende bei ihrer ersten Praktikumsbewerbung sind sich nicht sicher, ob ihr Lebenslauf bereit zum Abschicken ist, &uuml;berarbeiten ihn endlos und verschoben die Bewerbung."

Gr&uuml;nde:
1. Dieses Problem ist konkreter
2. Es erkl&auml;rt das Verschleppungsverhalten
3. Es ist einfacher, eine kleine Version zur Validierung zu entwerfen
```

Diese Art von Ausgabe ist sehr n&uuml;tzlich, denn sie hilft, aus einer Vielzahl vager Probleme eine Definition herauszudestillieren, die als MVP-Startpunkt dienen kann.

### 10.3 In der Develop-Phase: AI nutzen, um mehrere L&ouml;sungen zu divergieren

Viele verharren nach der Problemdefinition auf dem ersten L&ouml;sungsansatz, der ihnen in den Sinn kommt. AI eignet sich hervorragend daf&uuml;r, Sie zur Divergenz zu zwingen:

```text
Ich habe ein Kernproblem definiert: [Ihre Problemdefinition]
Bitte gib mir nicht sofort eine Endl&ouml;sung, sondern schlage aus folgenden Perspektiven jeweils 2-3 L&ouml;sungsrichtungen vor:
1. Das leichtgewichtigste MVP
2. Der am besten zur Bedarfsvalidierung geeignete Ansatz
3. Der erfahrungssteigernde Ansatz
4. Ein Ansatz ohne AI
5. Ein Ansatz mit AI
Vergleiche schlie&szlig;lich die Vorteile, Risiken und Validierungskosten jedes Ansatzes.
```

So werden Sie nicht zu fr&uuml;h auf einen einzigen Ansatz festgelegt.

Ein einfacher Prompt k&ouml;nnte lauten:

```text
Meine aktuelle Problemdefinition lautet:
"Studierende sind sich nicht sicher, ob ihr Lebenslauf abschickbereit ist, und verschoben ihn deshalb st&auml;ndig."

Bitte schlage mir 4 verschiedene L&ouml;sungsans&auml;tze vor, nicht nur einen.
```

AI k&ouml;nnte ausgeben:

```text
Ansatz 1: Checkliste f&uuml;r abschickbereite Lebensl&auml;ufe
Ansatz 2: Gezieltes Umschreiben basierend auf der Stellenbeschreibung
Ansatz 3: Lebenslauf hochladen und Risikohinweise erhalten
Ansatz 4: Hervorragende Beispiele zum Vergleich zeigen
```

Jetzt k&ouml;nnen Sie leichter "L&ouml;sungen vergleichen", anstatt von Anfang an nur auf AI-Umschreibung zu starren.

### 10.4 In der Deliver-Phase: AI beim Generieren von Prototyp-Text und Testmaterial unterst&uuml;tzen

Wenn Sie in die Deliver-Phase eintreten, ist AI hervorragend daf&uuml;r geeignet, folgende Aufgaben zu beschleunigen:

- Seitentexte f&uuml;r Low-Fidelity-Prototypen generieren
- Nutzer-Testskripte erstellen
- Mehrere vergleichbare Versionen von &Uberschriften, Buttons und Beschreibungen erstellen
- Feedback und Problemlisten nach Tests zusammenfassen

Beispielsweise k&ouml;nnten Sie AI bitten, ein 20-min&uuml;tiges Nutzer-Testskript zu erstellen oder 5 Nutzer-Feedbacks in "weitermachen / Richtung &auml;ndern / pausieren" zu kategorisieren.

Ein minimaler Prompt k&ouml;nnte lauten:

```text
Ich habe einen einfachen Prototyp erstellt:
Der Nutzer l&auml;dt einen Lebenslauf hoch und das System zeigt an, welche Stellen noch nicht bewerbungstauglich sind.

Bitte generiere ein 15-min&uuml;tiges Nutzer-Testskript.
```

AI k&ouml;nnte ausgeben:

```text
15-min&uuml;tiges Testskript:

1. Bitte den Nutzer zun&auml;chst, seine letzte Lebenslauferfahrung zu beschreiben
2. Den Nutzer den Lebenslauf selbstst&auml;ndig hochladen lassen
3. Beobachten, ob er die Feedback-Ergebnisse versteht
4. Fragen: Welche Hinweise waren am hilfreichsten, welche verwirrend
5. Fragen: W&uuml;rden Sie das Tool vor der n&auml;chsten Bewerbung erneut nutzen
```

Diese Art von Ausgabe ist sehr praktisch, denn sie hilft, von "Ich habe den Prototyp fertig" zu "Wie teste ich als N&auml;chstes" zu gelangen.

### 10.5 AI als "Phasen-W&auml;chter" einsetzen

Das h&auml;ufigste Problem beim Double-Diamond-Modell ist, dass Menschen Phasen &uuml;berspringen. Sie k&ouml;nnen AI direkt als W&auml;chter fungieren lassen, der Sie erinnert, wo Sie sich gerade befinden:

```text
Bitte spiele die Rolle eines Produktprozess-Coachs.
Hier ist mein aktueller Projektstatus: [Ihre Beschreibung]
Bitte beurteile, ob ich mich eher in Discover, Define, Develop oder Deliver befinde.
Und sage mir:
1. Ob ich zu fr&uuml;h in die n&auml;chste Phase gesprungen bin
2. Welche Aktion in der aktuellen Phase am wichtigsten nachzuholen ist
3. Welche Dinge ich jetzt noch nicht tun sollte
```

Das ist besonders hilfreich f&uuml;r Einsteiger, da man leicht dazu neigt, "Prototypen zu zeichnen, bevor man das Problem durchdacht hat".

## 11. Zusammenfassung

Die gr&ouml;&szlig;te St&auml;rke des Double-Diamond-Modells liegt darin, ein Chaos in vier klarere Aktionen zu zerlegen:

- Erst divergieren, um das Problem zu verstehen
- Dann konvergieren, um das Problem zu definieren
- Dann divergieren, um L&ouml;sungen zu erkunden
- Schlie&szlig;lich konvergieren, um die L&ouml;sung zu liefern

Es macht Sie nicht langsamer, sondern hilft Ihnen, **viele Umwege zu vermeiden, die besch&auml;ftigt aussehen, aber in die falsche Richtung f&uuml;hren.**

Besonders in der AI-&Auml;ra, in der das Erstellen von Dingen immer schneller wird, ist das Double-Diamond-Modell sogar noch wichtiger. Denn wenn "etwas zu bauen" immer einfacher wird, wird die wirklich seltene F&auml;higkeit: **L&ouml;sen Sie ein Problem, das es wert ist, gel&ouml;st zu werden, und tun Sie es auf angemessene Weise.**

Merken Sie sich nur diesen einen Satz:

**Erst die richtigen Dinge tun, dann die Dinge richtig tun.**

## 12. Aufgaben

<StageAssignmentCard title="Deine Idee mit dem Double Diamond ordnen">

Bitte bearbeiten Sie die folgenden Aufgaben basierend auf dem obigen Inhalt:

1. W&auml;hlen Sie eine Produktidee, an der Sie k&uuml;rzlich gedacht haben, und erstellen Sie einen Entwurf f&uuml;r die vier Schritte Discover, Define, Develop, Deliver
2. In der Define-Phase: Zwingen Sie sich, das Problem auf einen konkreten Satz zu verdichten
3. In der Develop-Phase: Listen Sie mindestens 3 verschiedene L&ouml;sungsans&auml;tze auf, anstatt nur den ersten Gedanken zu verfolgen
4. In der Deliver-Phase: Beschreiben Sie eine minimale validierbare Version, die Sie innerhalb einer Woche liefern k&ouml;nnen

</StageAssignmentCard>

## Weiterf&uuml;hrende Literatur

Dieser Artikel bezieht sich haupts&auml;chlich auf die offiziellen Materialien des Design Council zum Double Diamond. Hier sind empfehlenswerte weiterf&uuml;hrende Quellen:

- [Design Council: The Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/)
- [Design Council: Framework for Innovation](https://www.designcouncil.org.uk/our-work/skills-learning/tools-frameworks/framework-for-innovation-design-councils-evolved-double-diamond/)
- [Design Council: History of the Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/history-of-the-double-diamond/)

<style scoped>
.field-figure { margin: 24px 0 32px; overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); }
.field-figure > a { display: block; background: #f4f4f1; }
.field-figure img { display: block; width: 100%; max-height: 520px; object-fit: contain; }
.field-figure--diagram img { max-height: 580px; padding: 18px; }
.field-figure figcaption { padding: 13px 16px 15px; border-top: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); font-size: 13px; line-height: 1.75; }
.field-figure figcaption strong { color: var(--vp-c-text-1); }
</style>
