---
title: 'Mit Jobs to Be Done herausfinden, was Nutzer wirklich erreichen wollen'
description: 'Ein Einf&uuml;hrungsartikel zu Jobs to Be Done f&uuml;r Einsteiger. Verstehen Sie, dass Nutzer keine Funktionen kaufen, sondern in bestimmten Szenarien Ihr Produkt "einstellen", um einen Fortschritt zu erzielen. Lernen Sie, mit JTBD Produktrichtungen, Interviewfragen und AI-Prompts zu strukturieren.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
const duration = 'Etwa <strong>1,5 Stunden</strong>'
</script>

# Mit Jobs to Be Done herausfinden, was Nutzer wirklich erreichen wollen

<a id="top-jtbd"></a>

## Kapitel&uuml;bersicht

<ChapterIntroduction
  :duration="duration"
  :tags="['JTBD', 'Nutzerbed&uuml;rfnisse', 'Produktdenken', 'Bedarfserkenntnis']"
  coreOutput="1 JTBD-Satz, der einem echten Bedarf n&auml;her kommt"
  expectedOutput="Eine vage Idee zu einem konkreteren Nutzerszenario und einer MVP-Richtung verdichten k&ouml;nnen"
>

Viele Anf&auml;nger machen bei der Produktentwicklung am h&auml;ufigsten den Fehler, ihre gesamte Aufmerksamkeit auf "Welche Funktionen will ich bauen" zu richten. Man sieht, dass andere intelligente Kategorisierung haben, man will auch welche; man sieht, dass andere automatische Zusammenfassung haben, man will auch welche; man sieht, dass andere Agenten, Multimodalit&auml;t und Workflows gebaut haben, man f&uuml;hlt sich auch nicht zur&uuml;ckbleiben.

In der Realit&auml;t entscheiden sich Nutzer aber selten deshalb f&uuml;r ein Produkt, weil "der Funktionsname cool klingt". Vielmehr m&ouml;chten sie in einem bestimmten Moment etwas voranbringen und "stellen" ad hoc ein Werkzeug, einen Service oder sogar eine Person ein, die ihnen bei diesem Schritt hilft.

Genau das ist es, was die **Jobs to Be Done (JTBD)** -Methode uns verdeutlichen will: **Nutzer kaufen nicht die Funktion an sich, sondern stellen eine L&ouml;sung ein, die ihnen hilft, einen Fortschritt zu erzielen.**

Dieser Artikel f&uuml;hrt Sie in verst&auml;ndlicher Sprache durch JTBD und macht es zu einem Analysewerkzeug, das Sie direkt bei der Entwicklung von AI-Anwendungen einsetzen k&ouml;nnen.

</ChapterIntroduction>

::: info Minimales SOP
**Ziel**: Nach dem Lesen wissen Sie besser, wie Sie eine vage Idee in einen Satz mit echtem Nutzerszenario verdichten, anstatt nur eine Sammlung von Funktionsnamen im Kopf zu haben.

**Aktionspunkte**: 1 vage Idee aufschreiben, 3 potenzielle Nutzer nach "Wie haben Sie das letzte Mal damit umgebracht" fragen und dann zu 1 JTBD-Satz zusammenfassen.

**Ergebnis**: Sie erhalten eine klarere Bedarfshypothese und wissen, was in der ersten Version priorit&auml;r gel&ouml;st werden sollte.

**Stichwortspr&uuml;nge**: [Was ist JTBD](#jtbd-what) &middot; [Ein-Satz-Formel](#jtbd-formula) &middot; [Wie AI Ihnen hilft](#jtbd-ai)
:::

## Was Sie lernen werden

1. Was Jobs to Be Done ist und warum es n&auml;her an echten Bed&uuml;rfnissen liegt als "Funktions-Brainstorming"
2. Wie man unterscheidet zwischen "Funktionen, die Nutzer sagen zu wollen" und "was Nutzer wirklich erreichen wollen"
3. Wie man mit einer einfachen Vorlage eine vage Idee in Szenario, Ausl&ouml;ser, Hindernis und Erfolgskriterium zerlegt
4. Wie man JTBD bei AI-Produkten, Interview-Fragen und Prompt-Strukturierung anwendet

<a id="jtbd-what"></a>
## [1. Was ist Jobs to Be Done?](#top-jtbd)

Jobs to Be Done wird oft als **JTBD** abgek&uuml;rzt. Die Kernidee dahinter h&auml;ngt mit dem klassischen Ausdruck zusammen, den Clayton Christensens Team verbreitet hat: **Nutzer "stellen" ein Produkt ein, um etwas zu erledigen.**

Dieses "Etwas" ist keine oberfl&auml;chliche Aktion auf einer To-do-Liste, sondern ein **Fortschritt**, den der Nutzer f&uuml;r seinen Zustand anstrebt. Zum Beispiel:

- Nicht "Ich brauche ein AI-Protokoll-Tool", sondern "Ich m&ouml;chte innerhalb von 10 Minuten nach einem Meeting die wichtigsten Punkte, Aufgaben und Verantwortlichen zusammenfassen, anstatt mich auf Erinnerung zu verlassen"
- Nicht "Ich brauche eine Haushaltsbuch-App", sondern "Ich m&ouml;chte wissen, wohin mein Geld geht, damit ich am Monatsende nicht mehr &auml;ngstlich bin"
- Nicht "Ich brauche einen Lebenslauf-Optimierer", sondern "Ich m&ouml;chte zuversichtlicher einen ansehnlichen Lebenslauf verschicken, ohne bei jeder Bewerbung zu zweifeln, dass er schlecht geschrieben ist"

Deshalb konzentriert sich **JTBD nicht darauf, wie das Produkt aussieht, sondern darauf, warum der Nutzer es in diesem Moment braucht.**

Das erkl&auml;rt auch, warum viele scheinbar unterschiedliche Produkte tats&auml;chlich um denselben Job konkurrieren. Wenn ein Nutzer "auf dem Arbeitsweg weniger gelangweilt sein" m&ouml;chte, k&ouml;nnte er Kurzvideos, Podcasts, Spiele, Chats oder sogar Nickerchen einsetzen. Wenn ein Nutzer "ein langes PDF schnell verstehen" m&ouml;chte, k&ouml;nnte er AI-Zusammenfassungs-Tools, Praktikanten, Kollegen, sich selbst durchbei&szlig;en oder es erst einmal liegen lassen.

Mit dieser Perspektive werden Sie feststellen, dass Ihre wahren Konkurrenten oft nicht nur "eine andere App, die wie Ihre aussieht" sind, sondern **alle akzeptablen Alternativl&ouml;sungen, die dem Nutzer aktuell zur Verf&uuml;gung stehen.**

## 2. Worin unterscheidet sich JTBD von Personas und Funktionslisten?

Viele Einsteiger beginnen die Bedarfsanalyse mit Personas: 25 Jahre alt, weiblich, Gro&szlig;stadt, B&uuml;roangestellte, mag Effizienz-Tools, offen f&uuml;r neue Produkte. Diese Informationen sind nicht ganz nutzlos, aber sie **erkl&auml;ren oft nicht, warum eine Person in diesem Moment handelt.**

JTBD interessiert sich eher f&uuml;r folgende Fragen:

- In welchem Szenario hat er beschlossen, nach einer L&ouml;sung zu suchen?
- Was genau hat ihn blockiert?
- Was m&ouml;chte er zum n&auml;chsten Schritt voranbringen?
- Mit welchem behelfsm&auml;&szlig;igen Ansatz h&auml;lt er sich aktuell &uuml;ber Wasser?
- Welches Ergebnis w&uuml;rde ihn das Gef&uuml;hl haben lassen: "Es hat sich gelohnt"

Mit anderen Worten: **Personas beschreiben eher, wer dieser Mensch ungef&auml;hr ist; JTBD beschreibt eher, was dieser Mensch jetzt wirklich erreichen will.**

Gleichzeitig f&uuml;hren Funktionslisten oft in die Irre. Nutzer sagen: "Ich will Word-Export", "Ich will AI-Umschreibung", "Ich will Spracheingabe". Das sind alles oberfl&auml;chliche &Auml;u&szlig;erungen. JTBD fragt weiter:

- Warum ben&ouml;tigen Sie jetzt Word-Export und nicht PDF?
- M&ouml;chten Sie umschreiben, weil der Stil schlecht ist, oder weil Sie verschiedene Zielgruppen ansprechen m&uuml;ssen?
- M&ouml;chten Sie Spracheingabe, weil Sie nicht tippen m&ouml;chten, oder weil Sie h&auml;ufig unterwegs, beim Autofahren oder direkt nach Meetings aufzeichnen?

Oft ist **eine Funktion nur eine vorl&auml;ufige &Uuml;bersetzung eines Jobs.** Wenn Sie nur Funktionen sammeln, machen Sie leicht ein Produkt, das "alles aufstapelt, was Nutzer sagen". Wenn Sie den dahinterliegenden Job erkennen, haben Sie eher die Chance, eine wirklich handliche und wettbewerbsf&auml;hige L&ouml;sung zu entwickeln.

## 3. Ein Beispiel, das auch Einsteiger verstehen

Lassen Sie uns zun&auml;chst nicht an komplexe AI-Produkte denken, sondern mit einem Alltagsbeispiel beginnen.

Angenommen, jemand hat morgens vor dem Verlassen des Hauses keine Zeit zum Fr&uuml;hst&uuml;ck und kauft oft ein Sandwich und Kaffee am U-Bahn-Eingang. Oberfl&auml;chlich betrachtet "kauft" er ein Fr&uuml;hst&uuml;ck. Mit der JTBD-Perspektive k&ouml;nnte das, was er wirklich erreichen will, jedoch sein:

- An einem morgendlichen Tag in Eile mit minimalem geistigen Aufwand eine Mahlzeit organisieren
- Sicherstellen, dass er vor der Ankunft im B&uuml;ro nicht hungrig wird
- Sein Arbeitsweg-Tempo nicht durch Fr&uuml;hst&uuml;ck beeintr&auml;chtigen

In diesem Fall stellt der Nutzer nicht "eine bestimmte Sandwich-Marke" ein, sondern eine L&ouml;sung, die ihm hilft, seinen Morgen reibungslos zu gestalten. Wenn der nahe gelegene Supermarkt schneller, n&auml;her und zuverl&auml;ssiger ist, k&ouml;nnte er sofort wechseln.

Diesen Logik auf AI-Produkte &uuml;bertragen, wird es noch offensichtlicher.

Wenn Sie beispielsweise ein "AI-Meeting-Protokoll-Tool" entwickeln m&ouml;chten, w&uuml;rden Sie auf Funktionsebene leicht dar&uuml;ber nachdenken:

- Audio-Upload unterst&uuml;tzen
- Sprecher-Trennung integrieren
- Markdown-Export anbieten
- Automatische Aufgaben generieren

Das alles ist nicht falsch, aber noch nicht ausreichend. Mit JTBD eine Ebene tiefer gefragt, k&ouml;nnte der Nutzer Folgendes wirklich erreichen wollen:

- Innerhalb von 10 Minuten nach dem Meeting die Diskussionsergebnisse an nicht anwesende Personen weiterleiten
- Aufgaben, Verantwortliche und Fristen sauber extrahieren, damit das Team nicht aus dem Ged&auml;chtnis zusammenarbeiten muss
- Die Zeit f&uuml;r wiederholtes Zusammenfassen von Meeting-Inhalten reduzieren und Energie f&uuml;r Entscheidungen und Fortschritt aufwenden

Sobald der Job klar formuliert ist, ergeben sich viele Funktionspriorit&auml;ten automatisch. Vielleicht ist das Wichtigste in der ersten Version nicht "12 Exportformate unterst&uuml;tzen", sondern:

- Protokollstruktur muss klar genug sein
- Aufgabenerkennung muss zuverl&auml;ssig sein
- Freigabelink muss bequem sein
- Ergebnisse m&uuml;ssen direkt an das Team weitergeleitet werden k&ouml;nnen

Das ist der Wert von JTBD: **Es hilft Ihnen, von "Welche F&auml;higkeiten will ich aufstapeln" zur&uuml;ckzukehren zu "Welchen Fortschritt will ich dem Nutzer erm&ouml;glichen".**

## 4. Eine n&uuml;tzliche JTBD-Vorlage

Wenn Sie Einsteiger sind, m&uuml;ssen Sie JTBD zun&auml;chst nicht zu akademisch betrachten. Konzentrieren Sie sich auf die 5 wichtigsten Elemente.

### 4.1 Szenario

In welchem Moment und in welcher Umgebung denkt der Nutzer an dieses Produkt?

- Nach einem Meeting
- Wenn der Chef spontan Material anfordert
- Abends bei der Vorbereitung einer Bewerbung
- Am Monatsende, wenn das Geld wieder nicht reicht

**Ein Bedarf ohne Szenario ist meist noch nicht echt genug.**

### 4.2 Ausl&ouml;ser

Was bringt ihn dazu, sofort nach einer L&uuml;sung zu suchen?

- Von langen Dokumenten &uuml;berw&auml;ltigt und wei&szlig; nicht, wo man anfangen soll
- Morgen muss Material abgegeben werden, heute erst gemerkt, dass das Format chaotisch ist
- Gerade vom Chef nach dem Fortschritt gefragt und bemerkt, dass man nicht klar zusammengefasst hat
- M&ouml;chte kontinuierlich aufzeichnen, aber handschriftlich, kopieren und zusammenstellen ist zu aufwendig

Ausl&ouml;ser sind oft emotional aufgeladen. Diese Emotion ist wichtig, denn sie bestimmt, warum der Nutzer in diesem Moment handelt.

### 4.3 Gew&uuml;nschter Fortschritt

Er will nicht nur "eine Aktion ausf&uuml;hren", sondern sich in einen neuen Zustand bringen:

- Von Chaos zu Klarheit
- Von Angst zu Sicherheit
- Von Aufschieben zu Aufbrechen
- Von Ineffizienz zu Leichtigkeit
- Von Unklarheit zu direkter Lieferung

In diesem Schritt ist das Wort "Fortschritt" entscheidend. Denn viele kaufen nicht das Werkzeug, sondern die **Zustandsver&auml;nderung.**

### 4.4 Aktuelle Alternativl&ouml;sung

Wie macht er es ohne Ihr Produkt?

- Manuell kopieren und einf&uuml;gen
- Mit Excel oder Notizen k&auml;mpfen
- Kollegen um Hilfe bitten
- Aufschieben
- Zwischen mehreren Tools hin- und herwechseln

Wer die Alternative ist, das ist Ihre echte Wettbewerbsumgebung.

### 4.5 Erfolgskriterium

Wann gilt das Problem als wirklich gel&ouml;st?

- Innerhalb von 10 Minuten ein teilbares Ergebnis erhalten
- Ohne gr&ouml;&szlig;ere Nachbearbeitung an andere versenden k&ouml;nnen
- Keine wichtigen Punkte &uuml;bersehen, keine Fehler machen, nichts vergessen
- Beim ersten Mal wissen, wie es weitergeht

Wenn Sie nicht einmal sagen k&ouml;nnen, "wie der Nutzer beurteilt, ob es sich gelohnt hat", ist die Richtung wahrscheinlich noch nicht ausreichend konvergiert.

<a id="jtbd-formula"></a>
## [5. Eine direkt anwendbare Ein-Satz-Formel](#top-jtbd)

Wenn Sie eine Produktrichtung strukturieren m&ouml;chten, k&ouml;nnen Sie zun&auml;chst diese sehr praktische Formel verwenden:

> Wenn __________, m&ouml;chte ich __________, um __________.
> Aktuell kann ich __________ nur m&uuml;hsam nutzen, um dieses Ziel zu erreichen.

Beispiel:

> Wenn ich nach einem informationsreichen Projektmeeting fertig bin, m&ouml;chte ich schnell ein Protokoll mit Aufgaben, Verantwortlichen und Fristen erhalten, um sofort mein Team zu informieren und die Umsetzung voranzutreiben.
> Aktuell kann ich nur durch eigene Erinnerung, Durchsuchen von Chat-Verl&auml;ufen und manuelle Zusammenstellung m&uuml;hsam dieses Ziel erreichen.

Ein weiteres Beispiel:

> Wenn ich mich auf eine neue Stelle bewerbe, m&ouml;chte ich schnell meine bisherigen Erfahrungen in eine Version umschreiben, die besser zur Stelle passt, um zuversichtlicher einen ansehnlichen Lebenslauf verschicken zu k&ouml;nnen.
> Aktuell kann ich nur durch wiederholtes Kopieren des alten Lebenslaufs und manuelles &Auml;ndern der Formulierungen m&uuml;hsam dieses Ziel erreichen, und am Ende bin ich immer unsicherer.

Wenn Sie einen Satz auf diese Klarheitsstufe bringen k&ouml;nnen, wird das darauf folgende Seitendesign, die Prompt-Gestaltung und die Priorisierung von Funktionen deutlich einfacher.

## 6. Bei AI-Produkten: Drei Job-Ebenen besonders beachten

Viele AI-Produkte wirken in Funktionsdemonstrationen beeindruckend, k&ouml;nnen Nutzer nach dem echten Launch jedoch nicht halten. Der h&auml;ufige Grund: Nur die oberfl&auml;chliche Aktion wurde gel&ouml;st, nicht der tiefere Job.

Sie k&ouml;nnen einen Job grob in drei Ebenen unterteilen:

### 6.1 Funktionsebene

Was ist die oberfl&auml;chlichste Aufgabe?

- Dokumente zusammenfassen
- Texte umschreiben
- Aufgaben extrahieren
- Bilder generieren

Das ist die Ebene, die Nutzer am leichtesten aussprechen.

### 6.2 Emotionale Ebene

Welche Unannehmlichkeit m&ouml;chte der Nutzer reduzieren oder welches Gef&uuml;hl gewinnen?

- Nicht so in Panik sein wollen
- Nicht unprofessionell wirken wollen
- Nicht jedes Mal bei null anfangen wollen
- Mehr Kontrolle haben wollen

Viel Zahlungsbereitschaft h&auml;ngt tats&auml;chlich stark mit der emotionalen Ebene zusammen.

### 6.3 Soziale Ebene

Wie m&ouml;chte der Nutzer in den Augen anderer erscheinen?

- Zuverl&auml;ssiger wirken
- Im Team besser organisiert erscheinen
- Vor Kunden professioneller auftreten
- Auf Social-Media-Plattformen besser ausdr&uuml;cken k&ouml;nnen

Wenn Sie nur die Funktionsebene bedienen, ist das Produkt leicht ersetzbar; wenn Sie gleichzeitig die emotionale und soziale Ebene verstehen, finden Sie eher einen wirklich klebrigen Wert.

## 7. JTBD umgekehrt zur Produktrichtungsfilterung nutzen

Manchmal haben Sie noch kein Produkt, sondern 3 bis 5 Ideen und wissen nicht, welche Sie umsetzen sollen. JTBD eignet sich hervorragend als Filter.

Nehmen Sie jede Idee und stellen Sie sich 5 Fragen:

1. Ist das Szenario, das dieser Idee entspricht, konkret genug?
2. Nutzt der Nutzer bereits eine behelfsm&auml;&szlig;ige L&ouml;sung?
3. Ist der Schmerz dieses Jobs stark genug oder h&auml;ufig genug?
4. Wenn ich es gut mache, wird der Nutzer merklich "eine Zustandsverbesserung" sp&uuml;ren?
5. Kann die erste Version nur um den wichtigsten Schritt dieses Jobs herum eine sehr kleine, aber n&uuml;tzliche Version sein?

Wenn eine Richtung am Ende nur "klingt interessant" ist, aber keine klaren Ausl&ouml;ser, Alternativl&ouml;sungen und Erfolgskriterien formuliert werden kann, ist sie wahrscheinlich eher eine vage Inspiration als eine ausgereifte Richtung.

## 8. Interview-Fragen, die Sie direkt verwenden k&ouml;nnen

Viele beginnen eine Umfrage mit: "Welche Funktionen m&ouml;chten Sie?" Diese Frage liefert leicht oberfl&auml;chliche Antworten.

JTBD eignet sich besser f&uuml;r folgende Fragen:

- Wann hatten Sie das letzte Mal dieses Problem?
- Was haben Sie damals getan und warum sind Sie h&auml;ngengeblieben?
- Wie haben Sie es schlie&szlig;lich gel&ouml;st?
- Was war in diesem Prozess das Nervigste, Langsamste oder Beunruhigendste?
- Wenn es ein Tool g&auml;be, das Ihnen hilft: Welches Ergebnis w&uuml;rde Sie wirklich &uuml;berzeugen?
- Welche Alternativmethoden haben Sie ausprobiert und warum waren sie nicht gut genug?

Diese Frageweise hat einen Vorteil: Sie bringt das Gespr&auml;ch zur&uuml;ck zu echten Erlebnissen, anstatt bei imagin&auml;ren Pr&auml;ferenzen zu bleiben.

## 9. AI nutzen, um JTBD-Analyse durchzuf&uuml;hren

JTBD wurde nicht von AI erfunden, aber AI eignet sich hervorragend, um JTBD zu ordnen und zu destillieren.

Wenn Sie beispielsweise 5 bis 10 Nutzer-Feedbacks gesammelt haben, k&ouml;nnen Sie diese dem Modell geben und es bitten, nach folgender Struktur zusammenzufassen:

```text
Bitte spiele die Rolle eines Produktforschungsassistenten.
Ich werde dir einige Nutzer-Originalzitate geben. Bitte gib zun&auml;chst keine Funktionsvorschl&auml;ge,
sondern ordne sie nach dem Jobs-to-Be-Done-Framework:

1. In welchem Szenario befindet sich der Nutzer
2. Was ist das ausl&ouml;sende Ereignis f&uuml;r seine Handlung
3. Welchen Fortschritt m&ouml;chte er wirklich erreichen
4. Was ist die aktuelle Alternativl&ouml;sung
5. Welches Erfolgskriterium ist ihm am wichtigsten
6. Welche Emotionsw&ouml;rter tauchen in diesen Feedbacks wiederholt auf

Fasse abschlie&szlig;end diese Inhalte in 3 priorisierte JTBD-Hypothesen zusammen.
```

Wenn Sie bereits eine Idee haben, k&ouml;nnen Sie AI auch beim ersten Konvergierungsschritt unterst&uuml;tzen:

```text
Ich m&ouml;chte [Ihre Produktidee] entwickeln.
Bitte gib mir nicht direkt eine Funktionsliste, sondern analysiere sie mit der Jobs-to-Be-Done-Methode:

1. Welche konkreten Szenarien k&ouml;nnte dieses Produkt bedienen
2. Was ist der Kern-Job, den der Nutzer in jedem Szenario erreichen will
3. Welche bestehenden Alternativl&ouml;sungen gibt es
4. Welcher Job eignet sich am besten als MVP-Startpunkt und warum
5. Formuliere den empfohlenen Job als klaren JTBD-Satz
```

Der Vorteil: Sie werden nicht sofort von AI zu "50 Funktionen brainstormen" gedr&auml;ngt, sondern kl&auml;ren zun&auml;chst die Richtung.

## 10. Die 4 h&auml;ufigsten Fehler von Einsteigern

### 10.1 Den Job als Funktionsnamen formulieren

"AI-Zusammenfassung", "Intelligente Kategorisierung", "Automatische Generierung" sind keine Jobs, sondern nur m&ouml;gliche Implementierungsweisen.

### 10.2 Die Zielgruppe zu weit formulieren

"Alle B&uuml;roangestellten", "Alle Studierenden", "Alle Gr&uuml;nder" sind meist zu allgemein. Je allgemeiner, desto schwerer erkennen Sie echte Szenarien.

### 10.3 Nur h&ouml;ren, was Nutzer sagen, nicht beobachten, was Nutzer tun

Nutzer beschreiben, was sie wollen, aber ihre wahren Priorit&auml;ten verstecken sich oft darin, wie sie aktuell improvisieren.

### 10.4 Von Anfang an eine komplette Plattform bauen wollen

Die richtige Herangehensweise an JTBD ist meist nicht "Ich baue eine All-in-One-Plattform", sondern zun&auml;chst den wichtigsten Schritt in einem Szenario ins Visier zu nehmen und ihn sehr handlich zu machen.

## 11. Zusammenfassung

Der wertvollste Beitrag von Jobs to Be Done besteht nicht darin, Ihnen ein neues Schlagwort zu geben, sondern Ihnen zu helfen, die Perspektive zu wechseln: **Nicht auf Produktfunktionen starren, sondern darauf, was Nutzer voranbringen m&ouml;chten.**

Wenn Sie anfangen, sich wiederholt zu fragen:

- In welchem Szenario stellen Nutzer dieses Produkt ein
- Wo genau h&auml;ngen sie fest
- Mit welcher Methode k&auml;mpfen sie sich aktuell durch
- Wie &auml;ndert sich ihr Zustand, wenn das Problem gel&ouml;st ist

werden Sie feststellen, dass viele urspr&uuml;nglich vage Ideen pl&ouml;tzlich klar werden und viele urspr&uuml;nglich beeindruckende Funktionen pl&ouml;tzlich weniger wichtig sind.

Bei der Produktentwicklung, besonders bei AI-Produkten, ist das Schlimmste, sich von Anfang an in der Pr&auml;sentation von F&auml;higkeiten zu verlieren. JTBD hilft Ihnen, die Aufmerksamkeit auf das wirklich Wichtige zur&uuml;ckzulenken: **Warum Nutzer Sie brauchen und welchen Fortschritt Sie ihnen erm&ouml;glichen.**

<a id="jtbd-ai"></a>
## [12. Wie Sie AI nutzen k&ouml;nnen, um JTBD zu praktizieren](#top-jtbd)

JTBD wurde nicht von AI erfunden, aber AI eignet sich hervorragend als Forschungsassistent, Ordnungsassistent und Gegen&uuml;ber in dieser Methode. Der Schl&uuml;ssel: **AI beim Ordnen und Erweitern helfen lassen, nicht Nutzer f&uuml;r Sie erfinden lassen.**

Sie k&ouml;nnen es so einsetzen:

### 12.1 AI helfen lassen, vage Ideen in JTBD-Hypothesen umzuschreiben

Wenn Sie nur eine vage Beschreibung im Kopf haben, wie "Ich m&ouml;chte ein Tool entwickeln, das Studierenden bei der Praktikumssuche hilft", k&ouml;nnen Sie zun&auml;chst AI bitten, es in m&ouml;gliche Jobs aufzuteilen:

```text
Ich habe eine vage Produktidee: [Ihre Idee]
Bitte gib mir nicht direkt eine Funktionsliste, sondern analysiere sie mit der Jobs-to-Be-Done-Methode:
1. Welche konkreten Szenarien k&ouml;nnten entsprechen
2. Welchen Fortschritt wollen Nutzer in jedem Szenario wirklich erreichen
3. Welche Alternativl&ouml;sungen k&ouml;nnten es geben
4. Welcher Job eignet sich am besten f&uuml;r ein MVP
Formuliere abschlie&szlig;end jeden Job als klaren JTBD-Satz.
```

Sie k&ouml;nnen die Eingabe auch sehr anf&auml;ngerhaft formulieren:

```text
Ich m&ouml;chte etwas entwickeln, das Studierenden bei der Praktikumssuche hilft.
Ich kann noch nicht genau sagen, was es sein soll. Hilf mir herauszufinden, was Nutzer wirklich erreichen wollen.
```

AI k&ouml;nnte folgende n&uuml;tzliche Ausgabe liefern:

```text
M&ouml;gliche JTBD-Richtungen:

1. Wenn ich mich zum ersten Mal auf ein Praktikum bewerbe, m&ouml;chte ich schnell wissen, welche Unterlagen ich zuerst vorbereiten sollte,
damit ich nicht wegen Informationschaos meine Bewerbung aufschiebe.

2. Wenn ich eine Praktikumsstelle sehe, m&ouml;chte ich schnell beurteilen k&ouml;nnen, ob es sich lohnt, mich zu bewerben,
damit ich nicht zu viel Zeit auf ungeeignete Stellen verschwende.

3. Wenn ich mit der Bewerbung beginne, m&ouml;chte ich meinen bestehenden Lebenslauf in eine Version umschreiben, die besser zur Stelle passt,
damit ich schneller abschicken und die Erfolgsquote erh&ouml;hen kann.
```

Der Wert dieser Ausgabe liegt darin, Ihre urspr&uuml;nglich sehr allgemeine Idee in mehrere richtungen&auml;here Szenarien aufzuteilen.

### 12.2 AI beim Ordnen von Interview-Originalzitaten helfen lassen

Wenn Sie bereits mehrere Nutzer-Interviews durchgef&uuml;hrt haben, k&ouml;nnen Sie die Interviewaufzeichnungen an AI &uuml;bergeben und sie bitten, wiederkehrende Szenarien, Ausl&ouml;ser, Alternativl&ouml;sungen und Erfolgskriterien zu destillieren.

```text
Hier sind die Originalzitate von 5 Nutzern.
Bitte gib zun&auml;chst keine L&ouml;sungsvorschl&auml;ge, sondern ordne sie nach dem JTBD-Framework:
1. In welchem Szenario befindet sich der Nutzer
2. Was ist das ausl&ouml;sende Ereignis f&uuml;r seine Handlung
3. Welchen Fortschritt m&ouml;chte er wirklich erreichen
4. Was ist die aktuelle Alternativl&ouml;sung
5. Welches Erfolgskriterium ist ihm am wichtigsten
6. Welche Informationen tauchen bei mehreren Nutzern wiederholt auf
Fasse abschlie&szlig;end in 3 priorisierte JTBD-Hypothesen zusammen.
```

Eine sehr einfache Eingabe k&ouml;nnte so aussehen:

```text
Ich habe 3 Personen gefragt, sie sagten ungef&auml;hr Folgendes:

1. Jedes Mal, wenn ich mich auf ein Praktikum bewerbe, muss ich meinen Lebenslauf neu anpassen. Das ist extrem nervig.
2. Was ich eigentlich am meisten f&uuml;rchte, ist, nicht zu wissen, ob ich es richtig mache.
3. Ich lasse derzeit &auml;ltere Kommilitonen gegenlesen, aber es ist mir peinlich, st&auml;ndig um Gef&auml;lligkeiten zu bitten.

Hilf mir herauszufinden, was sie wirklich erreichen wollen.
```

AI k&ouml;nnte ausgeben:

```text
Zusammenfassung:

- Gemeinsames Szenario: Vor der Praktikumsbewerbung muss der Lebenslauf bearbeitet werden
- Gemeinsame Schwierigkeit: Nicht wissen, wie man es "gut genug" macht
- Aktuelle Alternativl&ouml;sung: &Auml;ltere Kommilitonen bitten, selbstst&auml;ndig wiederholt &uuml;berarbeiten
- M&ouml;glicher JTBD:
  Wenn ich mich auf ein Praktikum bewerbe, m&ouml;chte ich schneller beurteilen k&ouml;nnen, ob mein Lebenslauf abschickbereit ist,
  damit ich nicht st&auml;ndig im "Noch ein bisschen &uuml;berarbeiten" festh&auml;nge und ihn nie verschicke.
```

Diese Ausgabe ist sehr n&uuml;tzlich, denn sie hilft, aus verstreuten Originalzitaten etwas herauszudestillieren, das eher einem "Bedarf" entspricht.

### 12.3 AI eine leichte Webrecherche durchf&uuml;hren lassen

Bevor Sie mit umfangreichen Interviews beginnen, k&ouml;nnen Sie AI zun&auml;chst einen leichten Scan externer Informationen durchf&uuml;hren lassen:

- Wie wird in &ouml;ffentlichen Foren oder Communitys &uuml;ber dieses Problem geklagt
- Welche Probleme l&ouml;sen bestehende Produkte haupts&auml;chlich
- Was ist die h&auml;ufigste Alternativl&ouml;sung der Nutzer
- Was wird in Bewertungen am meisten gelobt und kritisiert

Diese Recherche kann echte Nutzer-Interviews nicht ersetzen, eignet sich aber gut als Aufw&auml;rm&uuml;bung in der Discover-Phase, um zun&auml;chst eine Problemlandkarte zu erstellen.

Ein einfacher Prompt k&ouml;nnte lauten:

```text
Bitte recherchiere f&uuml;r mich:
"Was sind die h&auml;ufigsten Schmerzpunkte beim Umschreiben von Lebensl&auml;ufen und Bewerben f&uuml;r Praktika bei Studierenden?"
Konzentriere dich auf das, was Leute in &ouml;ffentlichen Foren, Erfahrungsberichten und Bewerbungs-Communitys selbst sagen.
Fasse es in 5 h&auml;ufigsten Problemen zusammen.
```

AI k&ouml;nnte ausgeben:

```text
H&auml;ufigste Schmerzpunkte:

1. Nicht wissen, welche Erfahrungen im Lebenslauf stehen sollten
2. Nicht wissen, wie man f&uuml;r verschiedene Stellen anpasst
3. Nach vielen &Uuml;berarbeitungen immer noch unsicher, ob es gut genug ist
4. Keine zuverl&auml;ssige Person zum Gegenlesen finden
5. Komplexer Bewerbungsprozess, der zum Aufschieben verleitet
```

Diese Art von Ausgabe kann nicht als endg&uuml;ltige Schlussfolgerung dienen, hilft aber zu entscheiden, welche Art von Problem priorisiert interviewt werden sollte.

### 12.4 AI als "Gegenspieler" fungieren lassen

Oft sind wir zu sehr mit unseren eigenen Ideen verbunden. Sie k&ouml;nnen AI gezielt als kritischen Gegen&uuml;ber einsetzen, der Sie zwingt, das Problem klarer zu formulieren:

```text
Bitte spiele die Rolle eines sehr strengen Produktforschungsberaters.
Hier ist meine JTBD-Hypothese: [Ihre Hypothese]
Kritisiere sie aus folgenden Perspektiven:
1. Ist dieses Szenario zu weit gefasst
2. Wurde dieser Job als Funktion statt als echter Fortschritt formuliert
3. Ist die Alternativl&ouml;sung zu schwach
4. Ist das Erfolgskriterium unklar
5. Was ist das gr&ouml;&szlig;te Risiko, das bei dieser Hypothese validiert werden muss
```

Der Vorteil: Sie erkennen schneller, ob Sie sich auf den Bedarf oder nur auf Ihre bevorzugte L&ouml;sung konzentrieren.

## Assignments

<StageAssignmentCard title="Beschreibe, was der Nutzer wirklich erledigen möchte">

Bitte bearbeiten Sie die folgenden Aufgaben basierend auf dem obigen Inhalt:

1. W&auml;hlen Sie eine Produktidee, an die Sie k&uuml;rzlich gedacht haben, und formulieren Sie sie mit einer JTBD-Formel klar
2. Erg&auml;nzen Sie diese Idee mit den 5 Elementen: Szenario, Ausl&ouml;ser, Fortschritt, Alternativl&ouml;sung, Erfolgskriterium
3. Finden Sie 3 potenzielle Nutzer und fragen Sie mindestens einmal: "Wann hatten Sie das letzte Mal dieses Problem?"
4. &Uuml;bergeben Sie die Interview-Originalzitate an AI und fassen Sie sie in 3 priorisierte JTBD-Hypothesen zusammen

</StageAssignmentCard>

## Weiterf&uuml;hrende Literatur

- [Christensen Institute: Jobs to Be Done](https://www.christenseninstitute.org/theory/jobs-to-be-done/)
- [Harvard Business School Online: What Is Jobs to Be Done?](https://online.hbs.edu/blog/post/jobs-to-be-done)
- [Intercom: Jobs-to-be-Done: A framework for customer needs](https://www.intercom.com/blog/jobs-to-be-done-framework/)
- [Mural: Jobs to Be Done framework guide](https://www.mural.co/blog/jobs-to-be-done-framework)
