---
title: 'Gute Ideen finden - Von Nutzerbedürfnissen zu zahlungsbereiten Kunden'
description: 'Lernen Sie, wie Sie aus alltäglichen Schmerzpunkten Geschäftschancen entdecken, beherrschen Sie systematische Methoden der Bedarfsanalyse und verwandeln Sie gewöhnliche Ideen in Produktkonzepte, für die Nutzer zu zahlen bereit sind.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
const duration = 'Etwa <strong>3 Stunden</strong>'
</script>

# Anfänger II: Gute Ideen finden

## Kapitelübersicht

<ChapterIntroduction :duration="duration" :tags="['Bedarfserkennung', 'Produktdenken', 'Nutzeranalyse', 'Geschäftsmodell']" coreOutput="3 validierte Produktkonzepte" expectedOutput="Umsetzbare Gründungs-/Produktrichtung">

Wir haben gelernt, mit AI IDE Dinge zu erstellen, aber es gibt eine grundlegendere Frage: <strong>Was erstellen?</strong>

Viele wollen sofort „ein AI-Tool" oder „eine Social Platform" entwickeln, aber das Ergebnis ist ein Produkt, das niemand nutzt. Wo liegt das Problem? <strong>Der echte Bedarf wurde nicht gefunden.</strong>

Die noch härtere Realität: <strong>Viele Produkte lösen zwar Probleme, aber Nutzer sind einfach nicht bereit zu bezahlen.</strong>

In diesem Kapitel lernen wir anhand der Geschichte von Xiao Ming, wie man Produktrichtungen findet, die es wert sind, umgesetzt zu werden.

Nach Abschluss dieses Kapitels werden Sie über eine <strong>vollständige Methodik zur Ideenfindung</strong> sowie 3 validierte Produktkonzepte verfügen.

</ChapterIntroduction>


<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Schritt 1', description: 'Beurteilungskriterien aufbauen' },
      { title: 'Schritt 2', description: 'Alltägliche Schmerzpunkte entdecken' },
      { title: 'Schritt 3', description: 'Zielgruppen horizontal aufteilen' },
      { title: 'Schritt 4', description: 'Szenarien vertikal vertiefen' },
      { title: 'Schritt 5', description: 'Bedarfswahrheit validieren' },
      { title: 'Schritt 6', description: 'Produktkonzept polieren' }
    ]" />
  </ClientOnly>
</div>

## Schritt 1: Beurteilungskriterien aufbauen —— Welche Bedürfnisse Nutzer zum Bezahlen bewegen

::: warning Warum ist dieses Kapitel so wichtig?

Manche finden es vielleicht seltsam: „Ist das nicht ein Kurs über Vibe Coding? Warum zuerst ‚Bedarfsfindung' lernen? Kann man nicht einfach direkt mit dem Code anfangen?"

Natürlich bringen viele Programmierkurse Ihnen direkt Projekte bei: eine Todo-Liste, einen Taschenrechner, einen persönlichen Blog... Diese Projekte helfen Ihnen zwar, Syntax und Tools zu beherrschen, aber das Problem ist:

<strong>Falsche Richtung heißt: Je tiefer, desto falscher.</strong>

Stellen Sie sich vor:
- Sie verbringen zwei Wochen mit einem „Kalender-Management-System", aber es gibt bereits 100 bessere auf dem Markt
- Sie erstellen eine „Kalorien-Foto-Berechnung", aber Nutzer deinstallieren sie nach einmaliger Nutzung
- Sie bauen ein „persönliches Haushaltsbuch", aber nicht einmal Sie selbst nutzen es regelmäßig

Diese Projekte können Sie nicht in Ihren Lebenslauf aufnehmen, weil <strong>sie keine echten Probleme lösen und keinen echten Wert schaffen</strong>.

Noch härter: Wenn wir schon Zeit investieren, warum nicht bessere Ergebnisse anstreben?

Da Vibe Coding uns ermöglicht, Ideen schnell in Produkte umzusetzen, sollten wir auch lernen, <strong>Ideen zu finden, die es wert sind, umgesetzt zu werden</strong>. Mit einem Ansatz, der nah an der Praxis ist, trainieren wir uns – nicht „Übungsprojekte", sondern „Produkte, die Leute nutzen wollen".

Deshalb lernen wir zuerst „gute Ideen finden".

---

**Meine persönliche Meinung:** Zeit ist sehr kostbar. **Wenn wir es tun, dann machen wir es richtig.** Warum sonst nicht einfach spielen? Als Verantwortung werde ich mein Bestes tun, um Sie zu unterstützen.

Auch wenn niemand glaubt, dass Sie es gut machen kann, werde ich fest daran glauben, dass Sie Ihr Bestes geben. Mit Vibe Coding Produkte entwickeln – versuchen Sie herauszufinden, wie weit Sie kommen können!

:::


---

## Einstieg: Die Geschichte des Indie-Entwicklers Xiao Ming

Xiao Ming ist Programmierer seit drei Jahren. Eines Tages kam ihm die Idee: Eine Fitness-APP entwickeln, die Nutzern hilft, Trainingspläne zu erstellen und Trainingsdaten aufzuzeichnen. Diese Idee machte ihn sehr aufgeregt; er glaubte, endlich ein Projekt gefunden zu haben, das er umsetzen konnte.

Im folgenden Jahr investierte Xiao Ming fast seine gesamte Freizeit. Er entwickelte eine funktionsreiche APP – Kursmodul, Check-in-System, Community-Funktion, Datenanalyse, alles war vorhanden. Das Interface sah auch ganz gut aus, zumindest seiner Meinung nach.

Am Launch-Tag war Xiao Ming voller Erwartungen. Er gab viel Geld für Werbung aus und im ersten Monat wurde die APP 50.000 Mal heruntergeladen. Das klingt nach einem guten Start, oder?

Aber bald traten Probleme auf. Nutzer luden die APP herunter, nutzten sie einmal und deinstallierten sie. Die 7-Tage-Retention lag bei nur 5%. Er integrierte mehrere kostenpflichtige Funktionen, aber fast kein Nutzer war bereit zu bezahlen. Noch frustrierender: Keep, Bohee Health, FitTime und andere etablierte Produkte hatten mehr Funktionen, besseren Inhalt – warum sollten Nutzer zu seiner APP wechseln?

Nach einem Jahr hatte Xiao Ming 200.000 Yuan verloren.

Er saß vor dem Computer, sah die düsteren Backend-Daten und stellte sich nur eine Frage: Meine APP ist doch ganz gut – warum nutzt sie niemand? Und warum will niemand dafür bezahlen?

<figure class="idea-field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Woman_stretching_in_a_gym_while_holding_her_phone.jpg" target="_blank" rel="noopener noreferrer">
    <img src="/images/finding-great-idea/fitness-phone-context.jpg" alt="Eine Frau dehnt sich im Fitnessstudio und hält dabei ihr Smartphone" loading="lazy" />
  </a>
  <figcaption><strong>Zuerst die Situation beobachten, dann die Funktion wählen.</strong> Das Smartphone ist beim Training bereits vorhanden. Das beweist jedoch nicht, dass eine weitere Fitness-App gebraucht wird. Wir müssen noch verstehen, warum es benutzt wird und an welcher Stelle die bisherige Vorgehensweise scheitert. Foto: Shixart1985, CC BY 2.0.</figcaption>
</figure>



Xiao Mings Scheitern lag nicht an mangelnden technischen Fähigkeiten und auch nicht daran, dass das Produkt schlecht war. Ehrlich gesagt: Seine APP hatte viele Funktionen und ein ansprechendes Interface.

**Das Problem lag am Startpunkt.**

Er hatte nie die grundlegendste Frage gestellt: Brauchen die Nutzer das wirklich?

Er sah, dass der Fitness-APP-Markt riesig war und Keep mit Milliarden bewertet wurde, und hielt es für eine gute Gelegenheit. Aber er hatte einige Dinge nicht geklärt: Warum brauchen Nutzer eine weitere Fitness-APP? Was ist meine Differenzierung gegenüber Keep? Sind die Nutzer bereit, dafür zu bezahlen?

**Falsche Richtung: Je tiefer, desto falscher.** Er verbrachte ein Jahr damit, eine falsche Richtung immer weiter zu perfektionieren – und entfernte sich nur immer weiter vom Erfolg.


::: tip Was wir in diesem Kapitel tun

Lassen Sie uns Xiao Mings Fall gemeinsam analysieren. Schauen wir, wo genau das Problem lag, und finden wir dann Produktrichtungen, für die Nutzer wirklich zu zahlen bereit sind.

Wir gehen in drei Akten vor:

**Akt 1: Echte Bedürfnisse finden** —— Klären, welche Art von Bedürfnissen Nutzer zum Bezahlen bewegen

**Akt 2: Gute Ideen entdecken** —— Lernen, aus gewöhnlichen Gedanken wertvolle Geschäftschancen zu heben

**Akt 3: Mit AI verfeinern** —— Ideen mit AI in umsetzbare Produktlösungen verwandeln

:::
---

## Akt 1: Echte Bedürfnisse finden

Xiao Ming war frustriert, aber er gab nicht auf. Er begann, über eine Frage nachzudenken: Welche Art von Bedürfnissen bringt Nutzer dazu zu bezahlen?

### Xiao Mings Verwirrung: Warum zahlen Nutzer nicht?

Er suchte mehrere Freunde auf, die seine APP genutzt hatten, um ihre ehrliche Meinung zu hören.

Freund A sagte: „Deine APP ist ganz gut, aber ich nutze bereits Keep. Warum sollte ich wechseln?"

Freund B sagte: „Du willst, dass ich jedes Training aufzeichne. Das ist zu mühsam, ich bin zu faul dafür."

Freund C sagte direkter: „Die kostenlosen Funktionen reichen mir. Warum sollte ich bezahlen?"

Diese Antworten ließen Xiao Ming plötzlich erkennen, wo das Problem lag.

**Erstes Problem: Nutzer wechseln nicht, weil die bestehende Lösung bereits gut genug ist.** Keep und andere etablierte Produkte haben bereits umfassende Funktionen und die Nutzer haben sich an Gewohnheiten gewöhnt. Die Wechselkosten sind hoch. Warum sollten Nutzer zu einem ähnlichen Produkt wechseln?

**Zweites Problem: Nutzer sind nicht bereit, Gewohnheiten zu ändern.** Training aufzuzeichnen ist für Nutzer zu mühsam. Wenn ein Produkt den Nutzer verlangt, mehr als 3 Gewohnheiten zu ändern, wird es wahrscheinlich scheitern.

**Drittes Problem: Es gibt zu viele kostenlose Alternativen.** Die Funktionen sind zu generisch, haben keinen einzigartigen Wert, und Nutzer finden keinen Grund zu bezahlen.

### Was sind echte Bedürfnisse?

Xiao Ming begann, erfolgreiche Produkte zu studieren, die Nutzer zum Bezahlen bewegen. Er entdeckte eine Gemeinsamkeit: Diese Produkte lösten keine „Ich finde es nützlich"-Bedürfnisse, sondern Bedürfnisse, für die Nutzer zu zahlen, ihr Verhalten zu ändern und Unannehmlichkeiten in Kauf zu nehmen bereit waren.

Mit anderen Worten: **Echte Bedürfnisse werden durch die Füße der Nutzer bestätigt, nicht von Produktmanagern ausgedacht.**

### Fallstudie: Produkte, die Nutzer zum Bezahlen bewegen

Xiao Ming untersuchte mehrere erfolgreiche Beispiele, um zu verstehen, welche Schmerzpunkte sie genau trafen.

#### Meicaiwang: Kleinen Restaurant-Besitzern eine gute Nachtruhe ermöglichen

Oberflächlich betrachtet macht Meicaiwang etwas sehr Einfaches: Restaurants beim Gemüsekauf helfen. Aber wenn man genauer hinsieht, warum nutzen Restaurant-Besitzer es?

Weil kleine Restaurant-Besitzer täglich um 4 Uhr morgens aufstehen müssen, um zum Großmarkt zu gehen – sehr anstrengend und oft übervorteilt. Meicaiwang tut nicht einfach „E-Commerce-Gemüseverkauf", sondern restrukturiert die gesamte Lieferkette, damit Restaurant-Besitzer besser schlafen können.

Je schmerzhafter der Schmerzpunkt, desto stärker die Zahlungsbereitschaft. Die eingesparte Zeit und Energie sind wertvoller als das gesparte Gemüse-Geld.

<figure class="idea-field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Haikou_wholesale_vegetable_market_-_06.JPG" target="_blank" rel="noopener noreferrer">
    <img src="/images/finding-great-idea/haikou-wholesale-market.jpg" alt="Ein Gemüse-Großmarkt in Haikou" loading="lazy" />
  </a>
  <figcaption><strong>Beschaffung ist mehr als eine Bestellung.</strong> Das Foto zeigt einen Gemüse-Großmarkt in Haikou. Anfahrt, Auswahl, Transport und Rückweg gehören zur selben Aufgabe. Erst der vollständige Ablauf zeigt, welchen Aufwand ein Produkt tatsächlich reduziert. Foto: Anna Frodesiak, CC0.</figcaption>
</figure>

#### Xiaohongshu: Entscheidungsschwierigkeiten lösen

Oberflächlich ist Xiaohongshu „Einkaufs-Erfahrungen im Ausland teilen". Aber warum sind Nutzer bereit, Zeit damit zu verbringen, Notizen zu lesen?

Weil Nutzer angesichts einer Flut von Produkten nicht wissen, was sich zu kaufen lohnt und was nicht. Sie brauchen eine vertrauenswürdige Person, die ihnen beim Filtern hilft, Zeit spart und Fehler vermeidet.

Xiaohongshu löst tatsächlich zwei tiefe Schmerzpunkte: Entscheidungsschwierigkeiten und Vertrauensmangel. Nutzer sind bereit, für „Zeit sparen" und „Fehler vermeiden" zu bezahlen. Deshalb konnte Xiaohongshu erfolgreich werden.

---

Nach diesen Fallstudien hatte Xiao Ming eine wichtige Entdeckung gemacht.

Nutzer bezahlen nie für „Funktionen", sondern für „Angst lösen" und „Unsicherheit beseitigen". Meicaiwang löst die Angst kleiner Restaurant-Besitzer vor der Mühsal des frühen Einkaufs, Xiaohongshu löst die Angst der Nutzer vor Fehlkäufen.

**Angst treibt Zahlungen an, Unsicherheit treibt Handlungen an.**

### Die drei Ebenen von Bedürfnissen: Schmerzpunkte, Freude-Punkte und Juckpunkte

Xiao Ming entdeckte bei weiteren Untersuchungen, dass Nutzerbedürfnisse in drei Typen unterteilt werden können:

::: tip Schmerzpunkte (Pain Point) —— Angstgetrieben

**Essenz:** Probleme, die Nutzer gerade durchmachen und die Schmerz, Angst oder Unbequemlichkeit verursachen. Wenn sie nicht gelöst werden, fühlt es sich sehr schlecht an – es kann sogar Überleben oder Sicherheit gefährden.

**Beispiele:**
- Diabetiker wissen nicht, wie viele Kohlenhydrate den Blutzucker in die Höhe treiben (Angst: Gesundheitsgefahr)
- Kleine Restaurant-Besitzer stehen um 4 Uhr morgens auf, um zum Großmarkt zu gehen (Angst: Mühsal beim Überleben)

**Kern:** Nutzer sind bereit dafür zu bezahlen, weil es „sehr weh tut", wenn es ungelöst bleibt.

:::

::: tip Freude-Punkte (Delight Point) —— Sofortige Befriedigung

**Essenz:** Nutzer haben ein Bedürfnis, das sofort befriedigt werden kann und sofortige Freude erzeugt.

**Beispiele:**
- Essensbestellung in 30 Minuten geliefert (sofortige Hunger-Befriedigung)
- Ein-Klick-generierte ansprechende PPT (Zeit- und Energieersparnis als Freude-Erlebnis)

**Kern:** Nutzer „Freude" zu bereiten ist der Schlüssel zur Retention, aber allein als Zahlungspunkt weniger stark.
:::

::: tip Juckpunkte (Itch Point) —— Virtuelles Selbstbild

**Essenz:** Nutzer möchten besser, cooler, raffinierter werden, aber es ist nicht zwingend erforderlich. Wenn es erfüllt wird, sind sie glücklich; wenn nicht, ist es auch okay.

**Beispiele:**
- Tägliche Trinkwassermenge aufzeichnen (vorgestelltes diszipliniertes Leben)
- Fotos mit AI-Kunstfiltern versehen (vorgestellter künstlerischer Geschmack)

**Kern:** Die Zahlungsbereitschaft für „Juckpunkte" ist geringer, weil es auch ohne Lösung in Ordnung ist.

:::

Wie sieht die richtige Prioritätsreihenfolge aus? Ein guter Rat lautet: Schmerzpunkte > Freude-Punkte > Juckpunkte

Warum?

1. **Schmerzpunkte sind Überlebensbedürfnisse:** Wenn sie nicht gelöst werden, ist es unerträglich (oder bedrohlich), Nutzer müssen zahlen. Es ist ein „Schmerzmittel".
2. **Freude-Punkte sind sofortige Belohnungen:** Wenn Nutzer sich freuen, kommen sie wieder. Es ist „Heroin" (positiv gemeinte Suchtmechanismen).
3. **Juckpunkte sind Wunscherfüllungen:** Optional, am leichtesten wegzulassen. Es sind „Vitamine" oder „Luxusgüter".

**Schlüsselerkenntnis:** Der Fehler vieler Produktmanager besteht darin, Juckpunkte-Produkte wie Schmerzpunkte zu vermarkten.

Zum Beispiel: „Wasser aufzeichnen macht Sie gesünder" – Wasser trinken ist zwar gesund, aber ohne Aufzeichnung ist man nicht ungesund. Hier wird ein Juckpunkt als Schmerzpunkt verpackt, und Nutzer werden nicht darauf anspringen.

### Die 5-Schritte-Methode zur Validierung echter Bedürfnisse

Xiao Ming dachte: **Wenn ich eine Idee habe, wie kann ich schnell beurteilen, ob sie investitionswürdig ist?**

Er erlernte die von Produktmanagern häufig verwendete 5-Schritte-Beurteilungsmethode (Details siehe Anhang A):

1. **Schritt 1: Direkt mit echten Nutzern sprechen, ihre aktuellen Vorgehensweisen verstehen**

   Finden Sie 10 Zielgruppen-Nutzer. Fragen Sie: „Wie lösen Sie dieses Problem aktuell?" Wenn Nutzer bereits eine Methode verwenden, besteht das Problem tatsächlich. Wenn Nutzer sagen, es muss nicht gelöst werden, ist es möglicherweise kein echtes Bedürfnis.

2. **Schritt 2: Die bestehenden Alternativen der Nutzer analysieren und Ihre Vorteile finden**

   Nutzer verwenden möglicherweise andere Produkte, Excel, ihr Gedächtnis, oder sie ertragen das Problem einfach. Sie müssen herausfinden, welche Nachteile diese Lösungen haben. Ihr Produkt muss deutlich besser sein, damit Nutzer wechseln wollen.

<figure class="idea-field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Project_User_Experience_Testing_(9719939867).jpg" target="_blank" rel="noopener noreferrer">
    <img src="/images/finding-great-idea/ux-test-researcher-participant.jpg" alt="Ein Forscher und ein Testteilnehmer probieren eine Website aus" loading="lazy" />
  </a>
  <figcaption><strong>Aussagen und Handlungen werden getrennt geprüft.</strong> Das Foto dokumentiert einen User-Experience-Test: Ein Forscher und ein Teilnehmer probieren gemeinsam eine Website aus. Interviews zeigen die übliche Vorgehensweise; ein Nutzungstest zeigt, an welcher Stelle jemand tatsächlich stoppt. Foto: Samuel Mann, CC BY 2.0.</figcaption>
</figure>

3. **Schritt 3: Testen, ob Nutzer für Ihr Produkt bezahlen wollen**

   Machen Sie Vorverkäufe oder nehmen Sie Anzahlungen. Erfassen Sie den Anteil der Nutzer, die bereit sind, Anzahlung zu leisten (je früher Sie Geld verdienen, desto eher ist das Bedürfnis echt):
   - Über 10%: Bedürfnis ist echt, investitionswürdig
   - 5% bis 10%: Bedürfnis existiert, muss aber noch geschliffen werden
   - Unter 5%: Bedürfnis besteht möglicherweise nicht

4. **Schritt 4: Abschätzen, wie groß dieser Markt ist und ob sich damit Geld verdienen lässt**

   Berechnen Sie drei Zahlen: Gesamtzahl der Ziel-Nutzer × Zahlungsbereitschaft × Durchschnittseinkommen pro Nutzer. Multiplizieren Sie diese, um die Marktgröße zu erhalten. Wenn der Markt zu klein ist, lohnt es sich möglicherweise nicht.

5. **Schritt 5: Überlegen, welchen Burggraben Ihr Produkt hat, um Nachahmung zu verhindern**

   Berücksichtigen Sie diese Barrieren: Technische Schwierigkeit, Netzwerkeffekt, Marke, Kostenvorteil. Diese helfen Ihnen, langfristig wettbewerbsfähig zu bleiben.

**Zusammenfassung dieses Aktes: Xiao Mings Erkenntnisse**

1. **Kriterien für echte Bedürfnisse**
   - Das wichtigste Kriterium ist, dass Nutzer bereit sind zu bezahlen.
   - Nutzer sind bereit, dafür ihr Verhalten zu ändern.
   - Ohne Lösung erleiden Nutzer erhebliche Verluste.

2. **Falsche Bedürfnisse vermeiden**
   - Juckpunkte sind keine Schmerzpunkte und können nicht als echte Bedürfnisse behandelt werden.
   - Der Markt ist zu klein, um ein Geschäftsmodell zu tragen.
   - Die Lösung ist komplizierter als das Problem, Nutzer werden aufgeben.

3. **Prioritätsreihenfolge**
   - Die tatsächliche Priorität lautet: Schmerzpunkte > Freude-Punkte > Juckpunkte.

**Output dieses Aktes**
- Ich verstehe, was echte Bedürfnisse sind.
- Ich habe die dreistufige Klassifizierung von Bedürfnissen gelernt: Schmerzpunkte, Freude-Punkte, Juckpunkte.
- Ich habe die 5-Schritte-Beurteilungsmethode zur Validierung von Bedürfnissen gelernt.

---

## Akt 2: Gute Ideen entdecken

Xiao Ming weiß jetzt, was echte Bedürfnisse sind, aber er weiß immer noch nicht, wo er anfangen soll. Man kann doch nicht einfach ein Bedürfnis aus dem Nichts erfinden?

Er beschloss, bei dem anzufangen, was ihm am vertrautesten ist – bei den Menschen und Dingen um ihn herum.

### Von sich ausgehend: Xiao Mings Schwester

Xiao Ming dachte an seine Schwester. Sie hatte gerade ein Kind bekommen und beschwerte sich ständig, keine Zeit zum Trainieren zu haben, die Pfunde am Bauch nicht loszuwerden und sehr angespannt zu sein.

Eines Tages fragte er sie: „Wie löst du aktuell dein Fitness-Problem?"

Seine Schwester seufzte: „Ich trainiere mit Keep, aber die Übungen sind für den Körper nach der Entbindung nicht geeignet, danach tut der Rücken noch mehr weh. Ins Fitnessstudio gehen? Niemand passt auf das Baby auf. Personal Trainer buchen? 300 bis 500 Yuan pro Stunde, zu teuer. Alleine trainieren? Angst vor Verletzungen."

Nachdem Xiao Ming das gehört hatte, dachte er, dass dies das echte Bedürfnis sein könnte, das er gesucht hatte.

Die Probleme seiner Schwester waren tatsächlich sehr konkret: Zeit ist fragmentiert, sie muss auf das Baby aufpassen, hat keine zusammenhängende Zeit zum Trainieren; körperliche Einschränkungen, Rectus-Diastase (gerissene Bauchmuskeln), Beckenboden-Schwäche, kein intensives Training möglich; psychische Anspannung, veränderte Figur, Angst, dass ihr Mann sie nicht mehr attraktiv findet, soziale Unsicherheit; Informationschaos, zu viele Online-Infos, keine Ahnung, welche Übungen postpartal geeignet sind; und Einsamkeit, niemand versteht ihre Situation, fehlende Gleichgesinnte.

Das sind alles echte Schmerzpunkte, keine „schön-wäre"-Juckpunkte.

<figure class="idea-field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Post_Pregnancy_Pt_Class_DVIDS301829.jpg" target="_blank" rel="noopener noreferrer">
    <img src="/images/finding-great-idea/post-pregnancy-training.jpg" alt="Ein Kurs für körperliches Training nach der Schwangerschaft" loading="lazy" />
  </a>
  <figcaption><strong>Postpartales Training hat eigene Rahmenbedingungen.</strong> Das Foto zeigt einen Kurs zur körperlichen Rückkehr nach der Schwangerschaft. Trainingsaufbau und Verletzungsprävention werden gemeinsam behandelt; Stufen, Bewegungseinschränkungen und fachliche Anleitung müssen daher gesondert untersucht werden. Foto: Staff Sgt. Orly N. Tyrell / U.S. Air Force, gemeinfrei.</figcaption>
</figure>

---

### Horizontale Aufteilung: Bedürfnisse unterschiedlicher Zielgruppen

Xiao Ming erkannte, dass die Idee „Fitness-APP" zu allgemein war. Er wollte allen beim Trainieren helfen, aber das Problem war, dass die Bedürfnisse aller unterschiedlich sind.

Er machte eine horizontale Aufteilung und teilte „Personen, die trainieren wollen" in mehrere Gruppen (detaillierte Methode siehe Anhang B):

Fitness- und Muskelaufbau-Interessierte müssen ihre Proteinaufnahme genau berechnen, manuelle Aufzeichnung ist zu mühsam, ihre Zahlungsbereitschaft ist hoch, sie streben nach Effizienz. Diabetiker müssen Kohlenhydrate streng kontrollieren, aber beim Essen außerhaus ist das schwer abzuschätzen – das ist ein Muss, sie sind zahlungsbereit, die Wiederholungsrate ist hoch. Mütter nach der Entbindung möchten ihre Figur zurückbekommen, haben aber keine Zeit für Berechnungen, brauchen einfache Lösungen, sind zeitkritisch, brauchen eine All-in-One-Lösung. Takeaway-Esser essen jeden Tag außerhaus und wissen nicht, wie viele Kalorien sie konsumieren – das ist ein häufiges Szenario, aber die Zahlungsbereitschaft ist mittel. Studierende brauchen effiziente Lernwerkzeuge, wissen aber nicht, welche – das ist ein Muss, aber der durchschnittliche Umsatz pro Nutzer ist niedrig.

Xiao Ming wählte die Zielgruppe „Mütter nach der Entbindung". Warum?

Erstens: Er selbst kennt den Nutzer – seine Schwester ist eine postpartale Mutter, er versteht die Schmerzpunkte dieser Gruppe von Natur aus. Zweitens: Die Schmerzpunkte sind sehr stark – die Angst nach der Entbindung ist real, kein „schön-wäre"-Juckpunkt. Drittens: Starke Zahlungsbereitschaft – Mütter sind bereit, Geld für die Rückgewinnung ihrer Figur auszugeben. Viertens: Relativ wenig Konkurrenz – es gibt auf dem Markt kein speziell auf postpartale Mütter zugeschnittenes Produkt.

::: tip Die Segmentierungslogik des Produktmanagers

Warum ist die Segmentierung von Zielgruppen so wichtig?

Weil Allzweck-Tools schwer gewinnen können. Große Plattformen haben den „Allzweck"-Markt bereits besetzt, Sie können sie funktional kaum übertreffen. Die Bedürfnisse von Nischengruppen sind schmerzhafter – für postpartale Mütter ist Fitness ein Muss, für normale Fitness-Interessierte nur „hätte ich auch gerne". Eine kleine Gruppe gut zu bedienen, ist einfacher für den Aufbau von Reputation als alle zufriedenzustellen. Die Schmerzpunkte von Nischengruppen sind konkreter, und sie sind eher bereit, für Lösungen zu bezahlen.

:::

---

### Vertikale Vertiefung: Das vollständige Nutzer-Szenario

Nachdem er die Zielgruppe gefunden hatte, blieb Xiao Ming nicht bei der einzigen Funktion „postpartales Training" stehen. Er wollte das vollständige Nutzer-Szenario besser verstehen (detaillierte Methode siehe Anhang C).

Er beobachtete einen Tag im Leben seiner Schwester.

Um 6 Uhr morgens war das Baby gerade eingeschlafen, seine Schwester hatte 30 Minuten frei. Sie wollte trainieren, aber hatte Angst, das Baby aufzuwecken, und wusste nicht, welche Übungen sicher waren.

Um 10 Uhr morgens hielt seine Schwester das Baby im Arm und wiegte es in den Schlaf, der Rücken tat ihr weh. Sie wollte etwas Rückbildungs-Training machen, aber ihre Hände waren besetzt.

Um 15 Uhr schlief das Baby, seine Schwester wollte trainieren. Aber ihr Körper war sehr müde, sie wusste nicht, ob sie noch trainieren konnte.

Um 20 Uhr abends hatte seine Schwester endlich Zeit, aber war sehr angespannt. Sie sah sich im Spiegel an und dachte, ihr Leben sei ruiniert, blätterte heimlich durch alte Fotos und weinte.

Xiao Ming erkannte, dass der Schmerzpunkt seiner Schwester nicht „keine Fitnesskurse" war, sondern „die Angst und Unsicherheit der postpartalen Erholung".

<figure class="idea-field-figure idea-field-figure--portrait idea-field-figure--artifact">
  <a href="https://commons.wikimedia.org/wiki/File:Beispiel_Customer_Journey_Map.jpg" target="_blank" rel="noopener noreferrer">
    <img src="/images/finding-great-idea/customer-journey-work.jpg" alt="Eine handgefertigte Customer-Journey-Map" loading="lazy" />
  </a>
  <figcaption><strong>Die Situation entlang der Zeit rekonstruieren.</strong> Dies ist eine handgefertigte Customer-Journey-Map. Sie ordnet Erlebnisse am Morgen, tagsüber und am Abend auf einer Zeitachse. Die Karte selbst ist jedoch kein Nutzerbeleg; jede Schlussfolgerung braucht weiterhin Interviews oder Beobachtungen als Grundlage. Werk: Anakin Schoeber, CC BY-SA 4.0.</figcaption>
</figure>

---

::: info Das Szenario-Denken des Produktmanagers

Viele glauben, Schmerzpunkte seien Funktionsanforderungen – das stimmt nicht. Schmerzpunkte sind Emotionen im Szenario kombiniert mit Zahlungsbereitschaft.

Wenn eine postpartale Mutter vor dem Spiegel steht und ihre veränderte Figur sieht, ist der eigentliche Schmerzpunkt nicht „ich weiß nicht, wie ich trainieren soll", sondern Angst – Sorge, dass sich der Körper nicht gut erholt und Folgeschäden bleiben; Anspannung – beim Anblick im Spiegel das Gefühl, das Leben sei ruiniert; Hilflosigkeit – nicht zu wissen, wo man anfangen soll, ohne Anleitung; Einsamkeit – andere erholen sich schnell, aber ich brauche so lange.

Gute Produktdesign lösen Emotionen, nicht nur Funktionen. Hinter Emotionen steckt die Motivation der Nutzer zu bezahlen.

:::
---

### Wert-Rekonstruktion: Von „Fitness-APP" zu „Postpartale Erholungs-Assistentin"

Basierend auf der obigen Analyse entwarf Xiao Ming das Produkt neu.

::: tip Rekonstruiertes Produktkonzept: „Postpartale Erholungs-Assistentin"

**Kernpositionierung:** Nicht nur ein Fitness-Tool, sondern die „persönliche Reha-Trainerin + psychologische Begleiterin" für postpartale Mütter

**Kernfunktionen:**
1. **Fragmentiertes Training:**
   - Nur 10-15 Minuten pro Einheit
   - Auch trainieren, wenn das Baby schläft
   - Übungen, die „auch mit Baby auf dem Arm" machbar sind

2. **Postpartale Spezialkurse:**
   - Nach postpartaler Phase gestaffelt (0-3 Monate, 3-6 Monate, über 6 Monate)
   - Spezielles Training für Rectus-Diastase und Beckenboden-Rehabilitation
   - Jede Übung hat „postpartale Hinweise"

3. **AI-Bewegungskorrektur:**
   - Handycam erkennt Bewegungen
   - Echtzeit-Hinweise wie „Knie zu weit gebeugt", „Rücken gerade halten"
   - Vermeidung von Verletzungen durch falsche Ausführung

4. **Psychologische Unterstützungs-Community:**
   - Private Community nur für postpartale Mütter
   - Fortschritte teilen, sich gegenseitig ermutigen
   - Professionelle psychologische Berater als Mitglieder

5. **Personalisierte Pläne:**
   - Angepasst an Entbindungsart (natürliche Geburt/Kaiserschnitt) und körperlichen Zustand
   - Berücksichtigung der besonderen Bedürfnisse in der Stillzeit

**Geschäftsmodell:**
- Basiskurse kostenlos
- Premium-Kurse: 99 Yuan/Monat (inklusive AI-Bewegungskorrektur, personalisierter Plan)
- 1-zu-1-Personal Training: 299 Yuan/Monat (Online-Betreuung)
- Community-Mitgliedschaft: 199 Yuan/Jahr (inklusive psychologischer Unterstützung, Experten-Fragen)

**Wettbewerbsbarrieren:**
- Professionalität: Zusammenarbeit mit postpartalen Reha-Einrichtungen, medizinische Rückendeckung
- Community-Bindung: Starke emotionale Verbindungen unter postpartalen Müttern
- Datenakkumulation: Je mehr Körperdaten der Nutzer, desto präzisere Pläne

**Marktgröße:**
- Etwa 10 Millionen Neugeborene pro Jahr in China
- Postpartaler Reha-Markt: ca. 50 Milliarden Yuan
- Ziel: 1% der postpartalen Mütter bedienen = 100.000 Nutzer
- ARPU (Average Revenue Per User): 500 Yuan/Jahr
- Potentieller Umsatz: 50 Millionen Yuan/Jahr

:::

Vergleich zwischen der ursprünglichen Idee und dem rekonstruierten Konzept:

| Dimension | Ursprüngliche Idee | Rekonstruiert |
|-----------|-------------------|---------------|
| Zielgruppe | Alle Fitness-Interessierten (breit und allgemein) | Postpartale Mütter (präzise) |
| Gelöstes Problem | Training aufzeichnen (Juckpunkt) | Postpartale Erholungsangst (Schmerzpunkt) |
| Wettbewerbsbarriere | Technologie (leicht kopierbar) | Professionalität + Community + Daten |
| Zahlungsbereitschaft | Niedrig (viele kostenlose Alternativen) | Hoch (Muss-Bedarf + emotionaler Wert) |
| Erweiterungspotenzial | Begrenzt | Erweiterbar auf Schwangerschaft, Familienplanung |

**Das ist die Evolution von „einer Funktion" zu „einem Produkt, für das Nutzer bezahlen".**

---

### Weitere Beispiele: Von gewöhnlichen Ideen zu guten Ideen

Xiao Ming fand diese Methode sehr nützlich. Er analysierte mit der gleichen Methode noch einige andere Beispiele, um zu prüfen, ob sie allgemein anwendbar ist (detaillierte Fälle siehe Anhang D).

#### Beispiel 1: Von „Kalorienmessung" zu „Zucker-Krankensicheres Essen"

Die gewöhnliche Idee ist, Lebensmittel per Foto zu erkennen und Kalorien zu berechnen, um Diät-Interessierte bei der Ernährungskontrolle zu helfen. Das Problem ist, dass es bereits etablierte Produkte wie Bohee Health und MyFitnessPal auf dem Markt gibt.

Xiao Ming segmentierte horizontal und fand, dass die Gruppe der Diabetiker sehr interessant ist: Sie müssen Kohlenhydrate streng kontrollieren, aber beim Essen außerhaus ist das schwer abzuschätzen. Er vertiefte ihre Szenarien: Vor dem Essen wissen sie nicht, ob ein Gericht sicher ist, Sorge vor Blutzucker-Anstieg; während des Essens benötigen sie Echtzeit-Erinnerungen „Sie haben bereits so viele Kohlenhydrate gegessen"; nach dem Essen müssen sie den Blutzuckerverlauf aufzeichnen und den Zusammenhang mit der Ernährung sehen.

Das rekonstruierte Produkt heißt „Zucker-Krankensicheres Essen", positioniert als „Ernährungs-Sicherheitsassistent" für Diabetiker.

---

#### Beispiel 2: Von „Nachrichten-Assistent" zu „Investitions-Recherche-Offizier"

Die gewöhnliche Idee ist, Nachrichten verschiedener Plattformen zu aggregieren, damit man sie nicht einzeln öffnen muss. Aber Toutiao, Tencent News und andere haben das bereits gut gemacht.

Xiao Ming segmentierte horizontal und fand, dass Finanzanalysten besondere Bedürfnisse haben: Sie müssen Branchen-Updates verfolgen, aber die Informationen sind zu verstreut. Er vertiefte ihre Szenarien: Morgens die overnight US-Aktien-Entwicklung und Wechselkursschwankungen beobachten; vormittags Bekanntmachungen und Branchen-Nachrichten der Portfoliounternehmen verfolgen; nachmittags potenzielle Anlageziele recherchieren, viel Brancheninformation benötigt.

Das rekonstruierte Produkt heißt „Investitions-Recherche-Offizier", positioniert als „Informations-Radar und Entscheidungsassistent" für Finanzfachleute.

---

#### Beispiel 3: Von „Campus-Zweitmarkt-Plattform" zu „Absolventen-Aufräum-Assistent"

Die gewöhnliche Idee ist eine Campus-Zweitmarkt-Handelsplattform. Aber Xianyu und Zhuanzhuan haben das bereits gut gemacht.

Xiao Ming segmentierte horizontal und fand, dass Absolventen besondere Bedürfnisse haben: Zu viele Dinge, einzeln zu verkaufen ist zu mühsam. Er vertiefte ihre Szenarien: Eine Woche vor dem Abschluss müssen sie den Campus verlassen, keine Zeit zum langsamen Verkaufen; sie wissen nicht, wer ihre Dinge braucht; Verhandeln, Übergabe, Zahlungseingang – zu umständlich.

Das rekonstruierte Produkt heißt „Absolventen-Aufräum-Assistent", positioniert als „Vermögensverwalter für den Auszug".

---

### Zusammenfassung dieses Aktes: Xiao Mings Erkenntnisse

Durch Akt 2 verstand Xiao Ming:

**1. Von sich ausgehend**
- Sie selbst sind Nutzer und verstehen die Schmerzpunkte dieser Gruppe von Natur aus
- Hobbys sind der beste Ausgangspunkt, Leidenschaft ist der beste Antrieb

**2. Zielgruppen horizontal aufteilen**
- Bedienen Sie nicht „alle", finden Sie „die am stärksten betroffene Gruppe"
- Je feiner die Segmentierung, desto größer die Chance, desto stärker die Zahlungsbereitschaft

**3. Szenarien vertikal vertiefen**
- Beschreiben Sie die vollständige Nutzer-Reise: Vor der Nutzung, während der Nutzung, nach der Nutzung
- Finden Sie emotionale Berührungspunkte: Angst, Anspannung, Hilflosigkeit, Einsamkeit...

**4. Wert-Rekonstruktion**
- Von „Funktion" aufwerten zu „Lösung"
- Von „Tool" aufwerten zu „Assistentin/Verwalterin/Begleiterin"

---

📦 **Output dieses Aktes:**
- Eine präzise Zielgruppe gefunden (postpartale Mütter)
- Das vollständige Szenario und die echten Emotionen der Nutzer verstanden
- Das Produktkonzept rekonstruiert, mit klarer Differenzierungspositionierung

---

## Akt 3: Mit AI verfeinern

Xiao Ming hat jetzt eine klare Produktrichtung: Postpartale Erholungs-Assistentin. Aber er weiß immer noch nicht genau, wie er vorgehen soll, wo er anfangen soll und wie hoch der technische Aufwand ist.

Er beschloss, AI zu nutzen, um sein Produktkonzept zu verfeinern und seine Idee in einen ausführbaren Plan zu verwandeln.

### Runde 1: Die ursprüngliche Idee vorbringen

Xiao Ming teilte AI seine Idee mit: „Ich möchte eine postpartale Erholungs-Assistenten-APP entwickeln, die postpartalen Müttern hilft, ihre Figur zurückzubekommen. Aber ich mache mir Sorgen über den technischen Aufwand, besonders bei der AI-Bewegungskorrektur – kann ich das als Einzelperson schaffen?"

---

### Runde 2: AI hilft bei der MVP-Planung

AI antwortete: „Gute Frage! Lassen Sie uns eine MVP-Planung (Minimum Viable Product) erstellen."

AI schlug vor, in drei Phasen vorzugehen. Phase 1 ist 1-2 Monate, Ziel ist die Bedarfsvalidierung. Keine APP, erst einmal ein WeChat-Mini-Programm, das nur postpartale Spezialkurse (Videos) und eine Check-in-Community bietet. Bewegungsanleitung manuell bereitstellen – Nutzer laden Videos hoch, Trainer antworten. Ziel ist zu validieren, ob postpartale Mütter bereit sind zu bezahlen.

Phase 2 ist 3-6 Monate, wenn Phase 1 erfolgreich validiert wurde, werden Kernfunktionen hinzugefügt. AI-Bewegungskorrektur entwickeln, mit fertigen SDKs wie Baidu Human Body Detection. Personalisierte Pläne hinzufügen, Community-Funktionen optimieren.

Phase 3 ist 6-12 Monate, Skalierung. Eigenständige APP entwickeln, mit postpartalen Reha-Einrichtungen zusammenarbeiten, auf Schwangerschaft und Familienplanung erweitern.

Zur technischen Umsetzung schlug AI vor, für die AI-Bewegungskorrektur fertige AI-Fähigkeiten wie Baidu- oder Tencent-APIs zu nutzen, ohne von Grund auf zu entwickeln, was die Kosten senkt. Anfangs ein hybrides Modell aus menschlicher und AI-Betreuung, schrittweise übergehen.

Die Startkosten: Mini-Programm-Entwicklung 10.000-20.000 Yuan (Outsourcing) oder selbst mit AI IDE; Content-Erstellung in Zusammenarbeit mit postpartalen Reha-Trainer; Vermarktung über Mami-Gruppen und Xiaohongshu.

Die Validierungskennzahlen: Erster Monat 100 Nutzer, 10% Conversion-Rate. Wenn erreicht, ist das Bedürfnis echt, weiter investieren; wenn nicht, rechtzeitig anpassen.

<figure class="idea-field-figure idea-field-figure--artifact">
  <a href="https://commons.wikimedia.org/wiki/File:UX_prototyping_4.jpg" target="_blank" rel="noopener noreferrer">
    <img src="/images/finding-great-idea/app-prototype-user-test.jpg" alt="Eine Teilnehmerin bedient einen Prototyp einer mobilen App" loading="lazy" />
  </a>
  <figcaption><strong>Den Prototyp in die Hände der Teilnehmer geben.</strong> Das Foto dokumentiert einen Test eines mobilen App-Prototyps. Wo jemand stoppt, welche Fragen entstehen und ob die Nutzung fortgesetzt wird, macht aus einem MVP-Plan ein überprüfbares Ergebnis. Foto: Luthienrecanto, CC BY-SA 4.0.</figcaption>
</figure>

---

### Runde 3: Xiao Ming äußert Bedenken

Xiao Ming dachte nach und fragte: „Ich mache mir Sorgen um die Content-Erstellung. Postpartale Reha-Kurse brauchen professionelle Anleitung, ich habe keinen medizinischen Hintergrund – wie kann ich die Kursqualität garantieren?"

---

### Runde 4: AI bietet Lösungen

AI antwortete: „Das ist eine Sorge vieler technisch orientierter Gründer, aber es gibt Lösungen."

Lösung 1: Zusammenarbeit mit Fachleuten. Finden Sie postpartale Reha-Trainer, Ärzte aus klinischen Ernährungsabteilungen; Sie stellen Technologie und Produkt, sie stellen professionellen Content. Ein Aufteilungsmodell ist möglich.

Lösung 2: Integration bestehender qualitativ hochwertiger Inhalte. Anfangs können öffentliche postpartale Reha-Videos von YouTube, Bilibili usw. verwendet werden. Eigenständige Inhaltsprüfung und Zusammenstellung, später dann Original-Inhalte erstellen.

Lösung 3: Nutzer-generierte Inhalte. Erfahrene Mütter ermutigen, ihre eigenen Erholungsmethoden zu teilen; mit Community-Voting qualitativ hochwertige Inhalte filtern, schrittweise ein Content-Ökosystem aufbauen.

AI empfahl, zuerst Lösung 1 zu verwenden. Konkrete Vorgehensweise: 2-3 postpartale Reha-Trainer finden, mit ihnen über Zusammenarbeit sprechen; Sie entwickeln das Produkt, sie stellen Kurse. Umsatzaufteilung: Sie bekommen 70%, sie 30%. So wird sowohl die Content-Qualität gesichert als auch die Kosten gesenkt. Vorabkosten für Kurserstellung: 0 Yuan mit Aufteilungsmodell, Sie müssen nur Entwicklungszeit und Vermarktungskosten investieren.

**Mein Vorschlag: Zuerst Lösung 1 verwenden**

Konkrete Vorgehensweise:
1. 2-3 postpartale Reha-Trainer finden
2. Mit ihnen über Zusammenarbeit sprechen: Sie entwickeln das Produkt, sie stellen Kurse
3. Umsatzaufteilung: Sie bekommen 70%, sie 30%
4. So wird sowohl die Content-Qualität gesichert als auch die Kosten gesenkt

**Vorabkosten:**
- Kurserstellung: 0 Yuan (mit Aufteilungsmodell)
- Sie müssen nur Entwicklungszeit und Vermarktungskosten investieren

:::
---

### Runde 5: Xiao Ming fragt nach Vermarktung

Xiao Ming hatte noch eine letzte Sorge: „Werden die Vermarktungskosten sehr hoch? Wie findet man die Zielgruppe der postpartalen Mütter?"

---

### Runde 6: AI bietet Vermarktungsstrategie

AI antwortete: „Die Zielgruppe der postpartalen Mütter ist eigentlich leicht zu finden, die Vermarktungskosten können sehr niedrig sein."

Am meisten empfohlen wird Xiaohongshu. Suchen Sie nach Keywords wie „postpartale Erholung", „Rectus-Diastase" und finden Sie relevante Blogger, kontaktieren Sie sie per Direktnachricht. Tauschen Sie Vermarktung gegen „1 Monat kostenlose Testversion" – Kosten fast 0.

Zweitens: Mami-Gruppen. Suchen Sie nach WeChat-Gruppen, QQ-Gruppen, treten Sie im Namen von „postpartale Erholung Erfahrungsaustausch" bei, teilen Sie nützliche Inhalte, keine direkte Werbung, schrittweise Vertrauensaufbau.

Außerdem: Zusammenarbeit mit Krankenhäusern (Gynäkologie/Entbindungsabteilung), kostenlose postpartale Erholungsberatung anbieten, Flyer im Krankenhaus verteilen – Kosten sind nur die Druckkosten von einigen hundert Yuan. Oder Zusammenarbeit mit Baby-Geschäften, Werbematerialien platzieren, Testkarten beim Kauf von Baby-Produkten verschenken – Kosten sind nur die Herstellung der Testkarten.

Validierungskennzahlen: Erster Monat 100 Nutzer, 10 zahlende Nutzer (10% Conversion-Rate), Gesamtvermarktungskosten unter 1.000 Yuan, Akquisitionskosten unter 10 Yuan pro Nutzer. Wenn diese Kennzahlen erreicht werden, ist das Bedürfnis echt und man kann weiter investieren.

---

### Fazit: Xiao Ming hat einen klaren Plan

Nach 6 Runden von Gesprächen hatte Xiao Ming endlich einen klaren Plan.

Phase 1 ist 1-2 Monate: Ein WeChat-Mini-Programm erstellen, mit 2-3 postpartalen Reha-Trainer zusammenarbeiten (Aufteilungsmodell), nur postpartale Spezialkurse (Videos) und Check-in-Community anbieten, Bewegungsanleitung manuell bereitstellen. Ziel: 100 Nutzer, 10% Conversion-Rate.

Phase 2 ist 3-6 Monate: Wenn Phase 1 erfolgreich validiert wurde, weiter investieren. AI-Bewegungskorrektur hinzufügen, personalisierte Pläne hinzufügen, Community-Funktionen optimieren.

Phase 3 ist 6-12 Monate: Eigenständige APP entwickeln, mit postpartalen Reha-Einrichtungen zusammenarbeiten, auf Schwangerschaft und Familienplanung erweitern.

Die Startkosten sind sehr niedrig: Entwicklung selbst mit AI IDE (0 Yuan), Content mit Trainern aufteilen (vorab 0 Yuan), Vermarktung über Xiaohongshu und Mami-Gruppen (unter 1.000 Yuan). Gesamtkosten unter 1.000 Yuan.

---

### Die 5-Schritte-Methode der AI-Verfeinerung

Durch diesen Fall fasste Xiao Ming einen Standardprozess für AI-Gespräche zusammen (Details siehe Anhang E).

**Schritt 1: Die ursprüngliche Idee vorbringen.** Beschreiben Sie Ihre erste Idee, auch wenn sie noch grob ist. Sagen Sie AI Ihre Bedenken, z.B. starker Wettbewerb, unklare Differenzierung usw.

**Schritt 2: AI bei der MVP-Planung helfen lassen.** Was sollte das Minimum Viable Product enthalten? In wie vielen Phasen? Was ist das Ziel jeder Phase? Ist der technische Aufwand hoch?

**Schritt 3: Ihre Bedenken äußern.** Technischer Aufwand? Content-Erstellungskosten? Vermarktungskosten? Schwierigkeit der Nutzergewinnung? Sagen Sie AI alle Ihre Sorgen.

**Schritt 4: AI Lösungen anbieten lassen.** AI gibt konkrete Vorschläge zu Ihren Bedenken. Mehrere Lösungen vergleichen, die beste auswählen. Kosten schätzen.

**Schritt 5: Den Plan finalisieren.** Einen klaren Aktionsplan zusammenstellen, Validierungskennzahlen setzen. Wenn nicht erreicht, rechtzeitig anpassen.

**Prompt-Vorlage:**
```
Ich möchte ein [Produktkonzept] entwickeln,
aber ich mache mir Sorgen über [Ihre Bedenken].
Bitte helfen Sie mir:
1. Ein MVP zu planen
2. Konkrete Vorschläge zur technischen Umsetzung zu geben
3. Die Kosten zu schätzen
4. Validierungskennzahlen zu setzen
```

---

### Zusammenfassung dieses Aktes: Xiao Mings Erkenntnisse

Durch Akt 3 verstand Xiao Ming drei Dinge.

**Erstens: Produktkonzepte durch AI-Gespräche verfeinern.** Erwarten Sie nicht die perfekte Antwort in einem Gespräch, iterieren Sie über mehrere Runden. Sagen Sie AI Ihre Beobachtungen, Erlebnisse, Feedback von Menschen um Sie herum. Wenn AIs Vorschläge unvernünftig sind, weisen Sie darauf hin. Am Ende muss es auf einen konkreten Aktionsplan hinauslaufen.

**Zweitens: Kernprinzipien des MVP.** Minimierung, nur die Kernfunktionen umsetzen. Validierbarkeit, schnell prüfen, ob das Bedürfnis echt ist. Niedrige Kosten, mit minimalen Kosten validieren.

**Drittens: Validierungskennzahlen.** Conversion-Rate über 10%: Bedürfnis ist echt, investitionswürdig. Conversion-Rate 5-10%: Bedürfnis existiert, muss aber geschliffen werden. Conversion-Rate unter 5%: Bedürfnis besteht nicht, rechtzeitig anpassen.

---

📦 **Output dieses Kapitels:**
- Ein klarer MVP-Plan
- Kenntnis des technischen Umsetzungswegs
- Validierungskennzahlen festgelegt

---

## Schlussakt: Ihre Aktion

### Merkspruch

**Eine Person, eine Sache, ein Einstiegspunkt – horizontal teilen, vertikal graben, Schmerzpunkte finden, mit AI verfeinern, in 5 Schritten validieren, dann handeln**

**Erklärung:**
- **Eine Person:** Von sich selbst ausgehend, Sie verstehen diese Gruppe von Natur aus
- **Eine Sache:** Auf eine konkrete Sache fokussieren, nicht zu viel wollen
- **Ein Einstiegspunkt:** Den Einstiegspunkt finden, je feiner desto besser
- **Horizontal teilen:** Zielgruppen horizontal aufteilen, Nutzer mit höchster Zahlungsbereitschaft finden
- **Vertikal graben:** Szenarien vertikal vertiefen, die vollständige Nutzer-Reise verstehen
- **Mit AI verfeinern:** Produktkonzept durch AI-Gespräche verfeinern
- **In 5 Schritten validieren:** Mit der 5-Schritte-Methode die Echtheit des Bedürfnisses validieren

---

## 📚 Kapitelaufgabe

<StageAssignmentCard title="Ein kleines Ärgernis in eine Produktidee verwandeln">

Wählen Sie ein kleines Ärgernis aus Ihrem Alltag und erweitern Sie es mit der Methode dieses Kapitels:

::: tip Übungsaufgabe

**1. Beschreiben Sie dieses Ärgernis** (1 Satz)
- Beispiel: „Ich möchte eine Haushalts-APP entwickeln, die Nutzern hilft, Ausgaben aufzuzeichnen"

**2. Horizontal aufteilen: Finden Sie 3 Gruppen mit möglicherweise unterschiedlichen Bedürfnissen**
- Beispiel: Kleine Unternehmensgründer, Eltern von Auslandsstudenten, Freiberufler

**3. Wählen Sie eine Gruppe und vertikal vertiefen: Beschreiben Sie ihr vollständiges Szenario und echte Emotionen**
- Beispiel: Szenario der Eltern von Auslandsstudenten – möchten wissen, wie viel ihr Kind im Ausland ausgibt, aber das Kind sagt es nicht

**4. Rekonstruieren Sie das Produktkonzept: Evolution von „einer Funktion" zu „einer Lösung"**
- Beispiel: „Studienfinanz-Verwalter" – nicht nur Buchführung, sondern Eltern haben den „Überblick" über die Ausgaben ihres Kindes im Ausland

**5. Bewerten Sie Ihre Idee mit der Validierungs-Checkliste** (siehe Anhang F)

**Teilen Sie Ihre Analyse in der Community und diskutieren Sie mit anderen Lernenden!**

:::
---

</StageAssignmentCard>

## Anhang: SOP-Methodik

### Anhang A: Die 5-Schritte-Beurteilungsmethode der Bedarfsanalyse

Wenn Sie eine Idee haben, wie können Sie schnell beurteilen, ob sie investitionswürdig ist?

**Schritt 1: Nutzervalidierung —— 10 Zielgruppen-Nutzer finden**

**Nicht fragen:** „Würden Sie mein Produkt nutzen?" (Falsch-Positiv-Rate 90%)

**Fragen Sie stattdessen:**
1. „Wie lösen Sie dieses Problem aktuell?" (Echtes Verhalten verstehen)
2. „Wie oft hat Sie dieses Problem in der letzten Woche geplagt?" (Häufigkeit verstehen)
3. „Wie viel Geld/Zeit haben Sie bereits investiert, um es zu lösen?" (Zahlungsbereitschaft verstehen)
4. „Wenn es eine Lösung gäbe, aber Sie müssten Ihre Gewohnheiten ändern – wären Sie bereit?" (Änderungskosten verstehen)

**Beurteilungskriterien:**
- Wenn mehr als 3 Nutzer sagen „Ich ärgere mich täglich darüber" – möglicherweise ein Schmerzpunkt
- Wenn Nutzer sagen „Interessant, aber ich habe es nicht eilig" – wahrscheinlich ein Juckpunkt
- Wenn Nutzer sagen „Ich nutze aktuell XX dafür, bin aber nicht zufrieden" – Chance vorhanden

**Schlüsselquestion:** Welche Methode nutzen Nutzer aktuell, um dieses Problem zu lösen?

| Art der Alternative | Beschreibung | Chance |
|---------------------|-------------|--------|
| **Keine Alternative** | Nutzer ertragen es still | Große Chance, aber Marktbildung nötig |
| **Sehr umständliche Methode** | Excel, manuell, Zusammenarbeit mehrerer Personen | Gute Chance, Nutzer sehnen sich nach einer besseren Lösung |
| **Mehrere Tools zusammengestellt** | Tool A + Tool B + Tool C | Gute Chance, Integration hat Wert |
| **Etabliertes Produkt** | Aber Nutzer unzufrieden | Chance vorhanden, aber Differenzierung nötig |
| **Etabliertes Produkt** | Nutzer sehr zufrieden | Sehr kleine Chance, außer disruptive Innovation |

::: tip Was ist „disruptive Innovation"?

**Einfache Definition:** Nicht das Produkt besser machen, sondern auf einfachere/günstigere Weise eine zuvor vernachlässigte Nutzergruppe bedienen.

**Beispiele:**
- Traditionelle Handys → Smartphones (nicht mehr Funktionen, sondern völlig andere Interaktionsweise)
- Traditionelle Taxis → Didi (nicht bessere Autos, sondern Taxi-Rufen jederzeit und überall)
- Traditionelle Buchhandlungen → E-Books (nicht mehr Bücher, sondern einfacheres Mitführen und Kaufen)

**Kern:** Disruptive Innovation beginnt oft beim „unteren Markt" oder bei „neuen Nutzergruppen" und erodiert schrittweise nach oben.

:::

**Fälle:**
- Diabetiker kontrollieren aktuell mit „Erfahrung + Raten" ihre Ernährung (sehr umständliche Methode) – große Chance
- Normale Abnehm-Interessierte nutzen Bohee Health (etabliertes Produkt, mittlere Zufriedenheit) – Chance für Nische
- Studierende nutzen WeChat-Gruppen für Zweitmarkt-Handel (mehrere Tools zusammengestellt) – Chance für Integration

**Die effektivste Methode: Vorverkauf oder Anzahlung**

**Vorgehensweise:**
1. Erstellen Sie eine einfache Landingpage, die Ihr Produktkonzept beschreibt
2. Platzieren Sie einen „Vorverkauf"- oder „Reservierung"-Button
3. Sehen Sie, wie viele Leute bereit sind zu bezahlen (auch wenn es nur 1 Yuan ist)

**Beurteilungskriterien:**
- Nutzer, die Anzahlung zahlen wollen > 10%: Bedürfnis ist echt, investitionswürdig
- Nutzer, die Anzahlung zahlen wollen 5-10%: Bedürfnis existiert, muss aber geschliffen werden
- Nutzer, die Anzahlung zahlen wollen < 5%: Bedürfnis besteht nicht, oder Produktkonzept hat Probleme

**Hinweis:** Viele sagen „Ich würde es kaufen", aber nur die, die tatsächlich Geld bezahlen, sind Ihre Ziel-Nutzer.

**Einfache Formel:**
```
Potentielle Marktgröße = Anzahl der Ziel-Nutzer × Zahlungsbereitschaft × Durchschnittseinkommen pro Nutzer
```

**Fall: Campus-Zweitmarkt-Handelsplattform**
- Ziel-Nutzer: 40 Millionen Studierende in China
- Mit Zweitmarkt-Bedarf: 50% = 20 Millionen
- Bereit, eine Plattform zu nutzen: 10% = 2 Millionen
- Jahres-Handelsfrequenz: 2
- Plattform-Provision: 5%
- Durchschnittlicher Umsatz pro Nutzer: 100 Yuan
- Potentielle Marktgröße = 2 Millionen × 2 × 100 × 5% = 20 Millionen Yuan/Jahr

**Beurteilungskriterien:**
- Marktgröße > 1 Milliarde Yuan: Großer Markt, investitionswürdig
- Marktgröße 100 Millionen bis 1 Milliarde Yuan: Mittelgroßer Markt, machbar, aber klare Decke
- Marktgröße < 100 Millionen Yuan: Nischenmarkt, geeignet als Nebenprojekt oder „klein aber fein"

**Schlüsselquestion:** Wenn das Produkt erfolgreich ist, was passiert bei Nachahmung?

**Häufige Burggraben-Typen:**

| Burggraben-Typ | Beschreibung | Beispiel |
|---------------|-------------|----------|
| **Netzwerkeffekt** | Mehr Nutzer = größerer Produktwert | WeChat, Didi |
| **Datenakkumulation** | Mehr Daten = präzisere Algorithmen | Toutiao, TikTok |
| **Markenbekanntheit** | Besetzung im Nutzer-Bewusstsein | Coca-Cola, Nike |
| **Skaleneffekt** | Größere Skala = niedrigere Kosten | JD Logistics, Amazon |
| **Technologie-Patente** | Kerntechnologie-Barriere | Huawei, DJI |
| **Wechselkosten** | Hohe Migrationskosten für Nutzer | Unternehmenssoftware, Betriebssysteme |

**Realität für Frühphasen-Projekte:**
- Die meisten Frühphasen-Projekte haben keinen offensichtlichen Burggraben
- Aber das ist nicht schlimm, das Wichtigste ist <strong>schnell zu sein</strong>
- Erst den Markt besetzen, dann Barrieren aufbauen

---

### Anhang B: Methode der horizontalen Zielgruppenaufteilung

Versuchen Sie nicht, „alle XX-Nutzer" zu bedienen, sondern finden Sie <strong>eine spezifische Gruppe</strong>, deren Bedürfnisse schmerzhafter und konkreter sind.

**Schritt 1: Alle möglichen Segment-Gruppen auflisten**

Listen Sie für Ihr Produktkonzept alle möglichen Gruppen auf.

**Schritt 2: Den Geschäftswert jeder Gruppe bewerten**

| Bewertungsdimension | Beschreibung |
|--------------------|-------------|
| Schmerzpunkt-Intensität | Ist das Bedürfnis dieser Gruppe ein Schmerzpunkt oder ein Juckpunkt? |
| Zahlungsbereitschaft | Wie viel sind sie bereit für eine Lösung zu bezahlen? |
| Marktgröße | Wie viele Personen gehören dieser Gruppe an? |
| Wettbewerbsintensität | Sind bestehende Lösungen zufriedenstellend? |
| Ihr Verständnis der Gruppe | Verstehen Sie diese Gruppe? Haben Sie Zugang zu ihr? |

**Schritt 3: Eine Gruppe für die tiefe Analyse auswählen**

Wählen Sie eine Gruppe mit:
- Den schmerzhaftesten Schmerzpunkten
- Der stärksten Zahlungsbereitschaft
- Die Sie am besten verstehen
- Relativ wenig Konkurrenz

::: tip Segmentierungsbeispiel

**Produktkonzept:** Haushalts-APP

| Segment-Gruppe | Schmerzpunkt | Zahlungsbereitschaft | Marktgröße | Wettbewerbsintensität |
|---------------|-------------|---------------------|-----------|---------------------|
| Gewöhnliche Angestellte | Aufzeichnung ist mühsam | Niedrig | Groß | Hoch |
| Kleine Unternehmensgründer | Private/Unternehmensausgaben vermischt | Hoch | Mittel | Mittel |
| Freiberufler | Instabiles Einkommen, Cashflow-Vorhersage nötig | Hoch | Mittel | Mittel |
| Eltern von Auslandsstudenten | Möchten wissen, wie viel das Kind ausgibt, aber das Kind sagt es nicht | Hoch | Klein | Niedrig |

**Auswahl:** Eltern von Auslandsstudenten (schmerzhaftester Schmerzpunkt, hohe Zahlungsbereitschaft, relativ wenig Konkurrenz)

:::
---

### Anhang C: Methode der vertikalen Szenariovertiefung

Nachdem Sie die Zielgruppe gefunden haben, bleiben Sie nicht bei einer einzigen Funktion stehen, sondern verstehen Sie das <strong>vollständige Szenario</strong> der Nutzer.

**Schritt 1: Einen Tag im Leben des Nutzers beschreiben**

Von morgens bis abends, beschreiben Sie das vollständige Szenario des Nutzers bei der Nutzung Ihres Produkts.

**Schritt 2: Die Schmerzpunkte jedes Szenarios analysieren**

In jedem Szenario: Auf welches Problem stößt der Nutzer? Welche Emotionen hat er?

**Schritt 3: Emotionale Berührungspunkte finden**

Angst, Anspannung, Hilflosigkeit, Einsamkeit, Wut, Reue...

**Schritt 4: Wert rekonstruieren**

Basierend auf Szenario und Emotionen den Produktwert rekonstruieren.

::: tip Vertiefungsbeispiel

**Gruppe:** Postpartale Mütter

| Zeit | Szenario | Schmerzpunkt | Emotion |
|------|---------|-------------|---------|
| 6 Uhr morgens | Baby gerade eingeschlafen, 30 Minuten frei | Weiß nicht, welche Übungen sicher sind | Angst |
| 10 Uhr morgens | Baby auf dem Arm, Rücken tut weh | Hände besetzt, möchte Rückbildungs-Training machen | Anspannung |
| 15 Uhr | Baby schläft, möchte trainieren | Körper sehr müde, weiß nicht, ob trainieren noch möglich ist | Hilflosigkeit |
| 20 Uhr abends | Endlich frei | Sieht sich im Spiegel an, fühlt, das Leben sei ruiniert | Depression |
| Langfristig | Niemand versteht es | Fühlt, nur sie selbst leide so | Einsamkeit |

**Wert-Rekonstruktion:** Von „Fitness-Tool" aufwerten zu „Reha-Trainerin + psychologische Begleiterin"

:::
---

### Anhang D: Weitere Beispiele von gewöhnlichen Ideen zu guten Ideen

#### Beispiel 1: Von „Haushalts-APP" zu „Studienfinanz-Verwalter"

**Gewöhnliche Idee:** Automatische Haushalts-APP, verbindet Bankkarten und klassifiziert Ausgaben automatisch

**Problem:** Es gibt bereits Sui Shou Ji, Wacai, Alipay-Kontoauszüge...

**Horizontale Aufteilung:**
- Eltern von Auslandsstudenten: Möchten wissen, wie viel ihr Kind im Ausland ausgibt, ob es das Budget übersteigt

**Vertikale Vertiefung:**
- Der Schmerzpunkt ist nicht „Buchführung", sondern <strong>„Kontrollverlust"</strong> – man weiß nicht, wie viel das Kind ausgibt und wofür
- Szenario: Jeden Monat die Kreditkartenabrechnung sehen, aber das Kind sagt nie freiwillig, wofür es das Geld ausgegeben hat

**Rekonstruiert:** „Studienfinanz-Verwalter" – nicht nur Buchführung, sondern Eltern haben den „Überblick" über die Ausgaben ihres Kindes im Ausland

**Kernfunktionen:**
- Echtzeit-Synchronisation der Ausgaben des Kindes
- Budget-Überschreitungs-Warnung
- Monatlicher Ausgaben-Analyse-Bericht
- Vergleich mit gleichartigen Studierenden („Ihr Kind gibt 20% mehr als der Durchschnitt aus")

---

#### Beispiel 2: Von „Pomodoro-Tool" zu „Remote-Arbeits-Nachweis"

**Gewöhnliche Idee:** Pomodoro-APP, hilft Nutzern sich zu konzentrieren

**Problem:** Smartphones haben bereits Bildschirmzeit, Forest, Pomodoro ToDo...

**Horizontale Aufteilung:**
- Remote-Arbeiter: Müssen dem Chef beweisen „Ich arbeite wirklich"

**Vertikale Vertiefung:**
- Der Schmerzpunkt ist nicht „mangelnde Konzentration", sondern <strong>„Vertrauenskrise"</strong> – der Chef sieht mich nicht, wie beweise ich, dass ich arbeite?
- Szenario: Nach Feierabend fragt der Chef „Wie war die Arbeit heute?", und man kann es nicht beweisen

**Rekonstruiert:** „Remote-Arbeits-Nachweis" – Remote-Arbeitern helfen, Vertrauen zum Arbeitgeber aufzubauen

**Kernfunktionen:**
- Automatische Arbeitszeiterfassung
- Produktivitätsbericht
- Bildschirmaktivitäts-Zusammenfassung (datenschutzfreundlich)
- Automatisch generierter „Arbeitsbericht" jeden Tag, an den Vorgesetzten gesendet

---

#### Beispiel 3: Von „Gebrauchtbücher-Handel" zu „Bilderbuch-Bibliothek"

**Gewöhnliche Idee:** Gebrauchtbücher-Handelsplattform

**Problem:** Duozhuayu, Xianshu, Kongfuzi Old Book Network...

**Horizontale Aufteilung:**
- Mütter: Kinder-Bilderbücher nach dem Lesen ungenutzt, aber neu kaufen ist teuer

**Vertikale Vertiefung:**
- Der Schmerzpunkt ist nicht „Bücher sind teuer", sondern <strong>„kurze Lebensdauer von Bilderbüchern"</strong> – Bücher, die das Kind mit 3 Jahren liest, liest es mit 4 Jahren nicht mehr
- Szenario: Zuhause sind Bilderbücher vollgestapelt, das Kind liest sie nicht mehr, aber wegzuwerfen wäre schade

**Rekonstruiert:** „Bilderbuch-Bibliothek nach Hause" – keine Gebrauchtbücher verkaufen, sondern „Nutzungsrechte-Miete" für Bilderbücher anbieten

**Kernfunktionen:**
- Bilderbuch-Abo (monatlich 5 altersgerechte Bilderbücher, nach dem Lesen zurücksenden und neue bekommen)
- Lese-Fortschritts-Tracking
- Altersgerechte Empfehlungen
- Hygiene-Garantie

---

### Anhang E: Die 5-Schritte-Methode der AI-Verfeinerung von Produktkonzepten

Durch mehrere AI-Gesprächsrunden eine gewöhnliche Idee schrittweise in ein umsetzbares, präzises Produktkonzept verwandeln.

**Vorgehen:**
- Beschreiben Sie Ihre erste Idee (auch wenn sie noch grob ist)
- Sagen Sie AI Ihre Bedenken (starker Wettbewerb, unklare Differenzierung usw.)

**Prompt:**
```
Ich möchte ein [Produktkonzept] entwickeln,
aber ich habe festgestellt [Problem/Bedenken].
```

**Vorgehen:**
- AI bitten, einen Minimum Viable Product-Plan zu erstellen
- Technischen Aufwand und Kosten diskutieren
- Validierungskennzahlen setzen

**Prompt:**
```
Bitte helfen Sie mir:
1. Ein MVP zu planen
2. Konkrete Vorschläge zur technischen Umsetzung zu geben
3. Die Kosten zu schätzen
4. Validierungskennzahlen zu setzen
```

**Vorgehen:**
- Technischer Aufwand?
- Content-Erstellungskosten?
- Vermarktungskosten?
- Schwierigkeit der Nutzergewinnung?

**Prompt:**
```
Ich mache mir Sorgen über:
1. [Bedenken 1]
2. [Bedenken 2]
3. [Bedenken 3]
```

**Vorgehen:**
- Konkrete Vorschläge zu Ihren Bedenken
- Mehrere Lösungen vergleichen, die beste auswählen
- Kosten schätzen

**Prompt:**
```
Bitte geben Sie mir konkrete Lösungen für meine Bedenken.
```

**Vorgehen:**
- Einen klaren Aktionsplan zusammenstellen
- Validierungskennzahlen setzen
- Wenn nicht erreicht, rechtzeitig anpassen

**Prompt:**
```
Bitte helfen Sie mir, einen klaren Aktionsplan zusammenzustellen.
```

::: tip Wichtige Techniken

- **Mehrere Runden:** Erwarten Sie nicht die perfekte Antwort in einem Gespräch, iterieren Sie über mehrere Runden
- **Informationen bereitstellen:** Sagen Sie AI Ihre Beobachtungen, Erlebnisse, Feedback von Menschen um Sie herum
- **AI hinterfragen:** Wenn AIs Vorschläge unvernünftig sind, weisen Sie darauf hin
- **Fokus auf Umsetzung:** Am Ende muss es auf einen konkreten Aktionsplan hinauslaufen

:::
---

### Anhang F: Bedarfsvalidierungs-Checkliste

Bevor Sie Zeit in die Entwicklung investieren, validieren Sie Ihre Idee mit der folgenden Checkliste – <strong>die Kernfrage ist: Sind Nutzer bereit, dafür zu bezahlen?</strong>

::: tip Bedarfsvalidierungs-Checkliste

**1. Klarheit der Nutzer-Persona**
- ☐ Können Sie die Ziel-Nutzer in einem Satz beschreiben?
- ☐ Können Sie sagen, was ihre aktuelle Alternative ist?
- ☐ Können Sie konkrete Details ihres Nutzungsszenarios beschreiben?
- ☐ Hat diese Gruppe Kaufkraft?

**2. Bewertung der Schmerzpunkt-Intensität**
- ☐ Was kostet es Nutzer aktuell, dieses Problem zu lösen? (Zeit/Geld/Energie)
- ☐ Welche Folgen hat es, wenn das Problem nicht gelöst wird?
- ☐ Suchen Nutzer bereits nach Lösungen?
- ☐ Wie viel sind Nutzer bereit, für die Lösung zu bezahlen?

**3. Differenzierung der Lösung**
- ☐ Was ist Ihr Vorteil gegenüber bestehenden Lösungen?
- ☐ Ist dieser Vorteil ausreichend, um Nutzer zum Wechseln zu bewegen?
- ☐ Ist es für große Plattformen schwierig, Ihre Funktion zu kopieren?
- ☐ Ist Ihre Differenzierung ausreichend, um Nutzer-Zahlungen zu rechtfertigen?

**4. Machbarkeit des Geschäftsmodells**
- ☐ Sind Nutzer bereit zu bezahlen? Wie viel? (Muss getestet werden!)
- ☐ Wie hoch sind voraussichtlich die Akquisitionskosten?
- ☐ Kann der Lifetime Value (LTV) der Nutzer die Akquisitionskosten (CAC) decken?
- ☐ Gibt es andere Monetarisierungswege? (Werbung, Premium-Services, B2B usw.)

**5. Schnelle Validierungsmöglichkeit**
- ☐ Kann mit minimalen Kosten (1-2 Wochen) ein testbares Prototyp erstellt werden?
- ☐ Können 10 Ziel-Nutzer für Interviews gefunden werden?
- ☐ Kann ein Experiment zur Validierung der Kernhypothese designt werden?
- ☐ Können Nutzer eine Anzahlung leisten, um die Zahlungsbereitschaft zu validieren?

:::

<strong>Fragen Sie nicht „Würden Sie dieses Produkt nutzen?"</strong> – Diese Frage erzeugt nur falsch-positive Antworten.

<strong>Fragen Sie stattdessen:</strong>
- „Wie lösen Sie dieses Problem aktuell?" (Echtes Verhalten verstehen)
- „Wie oft hat Sie dieses Problem in der letzten Woche geplagt?" (Häufigkeit verstehen)
- „Wenn es eine Lösung gäbe, aber Sie müssten Ihre aktuellen Gewohnheiten ändern – wären Sie bereit?" (Änderungskosten verstehen)
- „Wenn es XX Yuan kosten würde, würden Sie es kaufen?" (Zahlungsbereitschaft verstehen)

**Die beste Validierung:** Nutzer eine Anzahlung leisten lassen. Viele sagen, sie würden bezahlen, aber nur die, die tatsächlich Geld hinlegen, sind Ihre Ziel-Nutzer.

**Schlüsselkennzahlen:**
- Anteil der Nutzer, die Anzahlung zahlen wollen > 10%: Bedürfnis ist echt, investitionswürdig
- Anteil der Nutzer, die Anzahlung zahlen wollen 5-10%: Bedürfnis existiert, muss aber geschliffen werden
- Anteil der Nutzer, die Anzahlung zahlen wollen < 5%: Bedürfnis besteht nicht, oder Produktkonzept hat Probleme

---

## Kapitelzusammenfassung

In diesem Kapitel haben wir anhand der Geschichte von Xiao Ming gelernt, Produktideen aus der Perspektive eines Produktmanagers zu betrachten – <strong>der Kern dreht sich immer um: Sind Nutzer bereit, dafür zu bezahlen?</strong>

::: info Kernpunkte

**1. Die drei Kriterien für echte Bedürfnisse:**
- Nutzer sind bereit dafür zu bezahlen (wichtigstes Kriterium)
- Nutzer sind bereit dafür ihr Verhalten zu ändern
- Ohne Lösung erleiden Nutzer erhebliche Verluste

**2. Der Weg von einer gewöhnlichen Idee zu einem Produkt, für das Nutzer bezahlen:**
- <strong>Horizontal aufteilen:</strong> Eine spezifische Zielgruppe finden, je feiner die Segmentierung, desto stärker die Zahlungsbereitschaft
- <strong>Vertikal vertiefen:</strong> Das vollständige Szenario verstehen, Emotionen lösen, nicht nur Funktionen
- <strong>Wert-Rekonstruktion:</strong> Vom Tool zur Lösung evoluieren, einen Grund für Zahlungen schaffen

**3. Fallen falscher Bedürfnisse vermeiden:**
- Pseudo-Schmerzpunkte lösen (Juckpunkte statt Schmerzpunkte)
- Marktgröße zu klein, um ein Geschäftsmodell zu tragen
- Lösung komplizierter als das Problem

**4. Methoden zur Validierung der Zahlungsbereitschaft:**
- 10 Ziel-Nutzer für tiefe Interviews finden
- Nutzer eine Anzahlung leisten lassen, um echte Bereitschaft zu validieren
- Erst ab einem Anteil > 10% zahlungsbereiter Nutzer ist es investitionswürdig

**5. Produktkonzepte durch AI-Gespräche verfeinern:**
- Mehrere Runden iterieren, kontinuierlich optimieren
- Fokus auf Umsetzung, auf einen Aktionsplan kommen
- Validierungskennzahlen setzen, rechtzeitig anpassen

:::

**Merken Sie sich:** Gute Produktmanager erfinden keine Bedürfnisse aus dem Nichts, sondern entdecken die <strong>übersehenen, unterschätzten und falsch befriedigten</strong> echten Bedürfnisse und finden Wege, wie Nutzer bereit sind, dafür zu bezahlen.

Im nächsten Kapitel werden wir mit validierten Ideen lernen, wie man sie mit AI IDE in interaktive Produktprototypen verwandelt.
