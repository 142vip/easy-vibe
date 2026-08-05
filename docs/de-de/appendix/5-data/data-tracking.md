# Data Tracking: Datenerfassung

::: tip 🎯 In diesem Kapitel behandeltes Problem
**Woher wissen wir, was Nutzer in unserer Anwendung tun?**

Stellen Sie sich vor, Sie betreiben ein kleines Café. Sie können hinter der Theke stehen und jeden Kunden direkt beobachten: Wie lange schauen sie sich die Speisekarte an? Welches Getränk bestellen sie? Zögern sie und gehen dann ohne Bestellung?

Wenn Ihr „Geschäft" aber eine mobile App oder Website ist, können Sie die Nutzeraktionen nicht direkt sehen. Dann benötigen Sie eine technische Lösung, die an den wichtigsten Stellen der Anwendung „Meldpunkte" platziert und automatisch jede Nutzeraktion für Sie aufzeichnet. Das ist **Event Tracking**.

Der Begriff „Tracking" klingt sehr professionell, aber die Kernidee ist einfach: **An den Stellen, an denen Nutzer möglicherweise agieren, einen „Recorder" platzieren und aufzeichnen, was die Nutzer tun.**

Dieses Kapitel erklärt den Prozess in vier Schritten:

1. **Erfassungsmethode wählen** — Entscheidung, wo Recorder platziert werden und wie
2. **Datenformat entwerfen** — Festlegen, welche Informationen jeder Datensatz enthalten soll
3. **Übertragung und Zwischenspeicherung** — Daten sicher vom Nutzergerät an den Server senden
4. **Bereinigung und Laden** — Daten ordnen, Duplikate und Fehler entfernen und in die Datenbank schreiben
:::

---

## 1. Erfassungsmethode wählen — Wo platziert man die Recorder

**Ziel**: Festlegen, mit welcher Methode die Nutzeraktionen aufgezeichnet werden sollen.

Ein Beispiel: Der Produktmanager möchte wissen, „wie viele Nutzer auf den Kaufen-Button geklickt haben". Um diese Frage zu beantworten, muss der Entwickler im Code des „Kaufen-Buttons" eine Aufzeichnungslogik hinzufügen — jedes Mal, wenn ein Nutzer auf diesen Button klickt, wird automatisch ein Datensatz erzeugt.

Doch hier gibt es eine Entscheidung: Sollen wir **nur an wichtigen Stellen Recorder platzieren** (z. B. nur „Kaufen" und „Registrieren" aufzeichnen) oder **überall Recorder platzieren** (jeden Klick, jede Wischgeste, jede Verweildauer aufzeichnen)?

Verschiedene Entscheidungen führen zu unterschiedlichen Tracking-Ansätzen.

<DataTrackingDemo tab="methods" />

**💡 Die drei gängigsten Tracking-Methoden**

In der Branche gibt es drei gängige Tracking-Ansätze, jeder mit eigenen Vor- und Nachteilen:

**Methode 1: Code-basiertes Tracking (Code Tracking) — Manuelle, präzise Aufzeichnung**

Der Entwickler gibt im Code manuell an: Wenn der Nutzer eine bestimmte Aktion ausführt, wird ein Datensatz erzeugt.

Als Vergleich: Das ist, als würde man an der Kasse des Cafés eine eigene Person einsetzen, die nur aufschreibt, „wer was gekauft hat und wie viel bezahlt hat". Die aufgezeichneten Informationen sind sehr detailliert und präzise.

- *Vorteil*: Sehr detaillierte Geschäftsinformationen können erfasst werden, z. B. welchen Gutschein der Nutzer verwendet hat oder wie hoch das Kontoguthaben ist
- *Nachteil*: Für jeden neuen Meldpunkt muss der Entwickler Code schreiben, testen und eine neue Version veröffentlichen — ein langer Prozess

**Methode 2: Visuelles Tracking (Visual Tracking) — Per Klickauswahl aufzeichnen**

Kein Code erforderlich. Das System bietet ein visuelles Tool, mit dem Betriebsmitarbeiter direkt auf der App-Oberfläche die zu überwachenden Buttons oder Bereiche „auswählen" und das System beginnt automatisch mit der Aufzeichnung.

Als Vergleich: Das ist, als würde man auf dem CCTV-Bild des Cafés mit der Maus den „Kassenbereich" markieren und das System automatisch beginnt, die Personenfrequenz in diesem Bereich zu zählen.

- *Vorteil*: Keine Entwicklerbeteiligung erforderlich; Betriebsmitarbeiter können es selbst konfigurieren — sehr effizient
- *Nachteil*: Es können nur Oberflächenaktionen wie „was hat der Nutzer geklickt" erfasst werden; tiefergehende Geschäftsdaten wie „Bestellsumme" können nicht aufgezeichnet werden

**Methode 3: Vollautomatisches Tracking (Auto Tracking) — Alles automatisch aufzeichnen**

Ein SDK (eine Art „Werkzeugkasten") wird in die App integriert und zeichnet automatisch alle Nutzeraktionen auf: jeden Klick, jede Wischgeste, die Verweildauer auf jeder Seite.

Als Vergleich: Das ist, als würde man in jeder Ecke des Cafés Kameras installieren, die jede Bewegung der Kunden aufzeichnen.

- *Vorteil*: Keine Aktion wird verpasst — maximale Abdeckung
- *Nachteil*: Die Datenmenge ist enorm, und vieles davon ist nutzlose Information (z. B. unbewusstes Wischen), die anschließend mit großem Aufwand gefiltert und bereinigt werden muss

**Schritt-Zusammenfassung**: Nach der Wahl der Tracking-Methode verfügt die App über die Fähigkeit, „Nutzeraktionen aufzuzeichnen".

**Doch ein neues Problem**: Der Recorder kann zwar Nutzeraktionen erfassen, aber wenn jeder Recorder ein anderes Format verwendet (z. B. einer schreibt „userID", ein anderer „Benutzer-ID", ein dritter zeichnet es gar nicht auf), ist eine einheitliche Analyse später nicht möglich. Deshalb müssen wir im nächsten Schritt ein einheitliches Aufzeichnungsformat festlegen.

---

## 2. Datenformat entwerfen — Was sollte jeder Datensatz enthalten

**Voraussetzung**: Wir haben die Tracking-Methode gewählt (z. B. Code-Tracking) und die App kann Nutzeraktionen erfassen.

**Ziel dieses Schritts**: Eine einheitliche „Aufzeichnungsvorlage" definieren, damit alle Tracking-Datensätze ein konsistentes Format haben.

**Warum ist ein einheitliches Format nötig?** Stellen Sie sich vor: Im Café zeichnen drei Angestellte gleichzeitig die Verkaufszahlen auf. Der eine schreibt „Max hat einen Bubble Tea für 5 Euro gekauft", der andere schreibt „5, Tee, Bubble", der dritte schreibt „1× Bubble Tea". Am Monatsende sind diese Aufzeichnungen völlig unterschiedlich formatiert, und die Zusammenfassung wird zur Qual. Deshalb brauchen wir ein einheitliches „Aufzeichnungsformular", das festlegt, welche Felder jeder Datensatz enthalten muss.

<DataTrackingDemo tab="model" />

**💡 Kernprinzip: Die 4W1H-Aufzeichnungsvorlage**

Unabhängig davon, welche Aktion aufgezeichnet wird, muss jeder Datensatz die folgenden fünf Fragen beantworten (kurz 4W1H):

**Who — Wer hat es getan?**

Wir müssen wissen, von welchem Nutzer dieser Datensatz erzeugt wurde.

- Wenn der Nutzer eingeloggt ist, verwenden wir seine Account-ID (z. B. `user_id: "max123"`)
- Wenn der Nutzer nicht eingeloggt ist, verwenden wir die eindeutige Gerätekennung (z. B. die Geräteseriennummer des Handys), um zumindest unterscheiden zu können, dass „dies die Aktionen auf demselben Gerät sind"

**When — Wann wurde es getan?**

Die genaue Zeit der Aktion wird bis auf die Millisekunde aufgezeichnet.

Hier gibt es ein Detail: Wenn Ihre App internationale Nutzer hat, dann unterscheiden sich 15 Uhr deutscher Zeit und 15 Uhr New Yorker Zeit um 6 Stunden. Um Verwirrung zu vermeiden, werden alle Zeiten einheitlich in UTC (koordinierte Weltzeit) konvertiert.

**Where & How — In welcher Umgebung wurde es getan?**

Dieser Teil zeichnet die Geräte- und Netzwerkumgebung zum Zeitpunkt der Nutzeraktion auf und wird als **gemeinsame Attribute** bezeichnet. Sie heißen „gemeinsam", weil diese Informationen unabhängig von der Nutzeraktion automatisch beigefügt werden. Zum Beispiel:

- Gerätemodell: iPhone 15 / Samsung Galaxy S24
- Netzwerktyp: WiFi / 5G / 4G
- App-Version: v1.2.3
- Betriebssystem: iOS 18 / Android 15

Der Wert dieser Informationen: Wenn ein Fehler nur auf einem bestimmten Gerätemodell auftritt, können die gemeinsamen Attribute helfen, das Problem schnell einzugrenzen.

**What — Was genau wurde getan?**

Dieser Teil zeichnet die spezifischen Geschäftsdetails der Aktion auf und wird als **benutzerdefinierte Attribute** bezeichnet. Unterschiedliche Aktionen erfordern unterschiedliche Informationen. Zum Beispiel:

- Nutzer klickt auf „In den Warenkorb": Produktname, Produktpreis und Menge müssen aufgezeichnet werden
- Nutzer schließt Zahlung ab: Bestellsumme, Zahlungsmethode und Gutscheincode müssen aufgezeichnet werden

**Schritt-Zusammenfassung**: Mit der 4W1H-Vorlage wandeln wir jede Nutzeraktion in einen Datensatz mit einheitlichem Format um. In der technischen Implementierung wird dieser Datensatz üblicherweise im JSON-Format gespeichert (JSON ist ein universelles Datenformat; die interaktive Komponente oben zeigt, wie es aussieht).

**Doch ein weiteres Problem**: Das Datenformat ist nun einheitlich, aber wenn die Nutzerzahl groß ist (z. B. während einer Werbeaktion können pro Sekunde Zehntausende von Datensätzen entstehen), kann das Nutzergerät nicht bei jedem Datensatz sofort eine Übertragung starten — das wäre zu batterie- und datenintensiv, und der Server könnte es auch nicht bewältigen. Deshalb müssen wir im nächsten Schritt eine intelligentere Übertragungsmethode entwerfen.

---

## 3. Übertragung und Zwischenspeicherung — Wie kommen die Daten sicher zum Server

**Voraussetzung**: Jede Nutzeraktion wurde als JSON-Datensatz mit einheitlichem Format aufgezeichnet.

**Ziel dieses Schritts**: Diese Daten zuverlässig vom Nutzergerät (oder Browser) an unseren Server übertragen — auch bei schlechter Netzwerkverbindung ohne Datenverlust.

**Warum nicht sofort senden?** Wenn bei jedem erzeugten Datensatz sofort eine Netzwerkanfrage gesendet wird, ist das so, als würde man nach jedem geschriebenen Brief zur Post rennen — extrem ineffizient. Sinnvoller ist es, mehrere Briefe zu sammeln und auf einmal abzugeben.

<DataTrackingDemo tab="pipeline" />

**💡 Kernprinzip: Die drei Sicherungsmechanismen der Datenübertragung**

Die Daten müssen vom Nutzergerät zum Server drei Sicherungsmechanismen durchlaufen, die sowohl Effizienz als auch Datenverlust-Sicherheit gewährleisten:

**Erste Sicherung: Sammeln und dann senden (Batch-Aggregation)**

Das SDK (Tracking-Werkzeugkasten) sendet nicht jeden Datensatz sofort nach der Erzeugung, sondern speichert ihn vorübergehend im Gerätespeicher. Wenn eine bestimmte Anzahl gesammelt wurde (z. B. 30 Datensätze) oder eine bestimmte Zeit überschritten wurde (z. B. 5 Sekunden), wird das gesamte Paket auf einmal gesendet.

Als Vergleich: Sie schicken nicht nach jedem Online-Kauf einzeln ein Paket, sondern sammeln mehrere und verschicken sie zusammen — das spart Zeit und Mühe. Für das Handy bedeutet dies weniger Netzwerkanfragen und damit Strom- und Datenvolumen-Ersparnis.

**Zweite Sicherung: Auch offline sicher (lokale Speicherung)**

Im Aufzug oder U-Bahn-Tunnel verliert das Handy häufig das Netzwerksignal. Wenn die Daten nur im Arbeitsspeicher (RAM) liegen, sind sie weg, sobald der Nutzer die App schließt.

Deshalb speichert das SDK die noch nicht gesendeten Daten im lokalen Speicher des Geräts (ähnlich wie einen Brief erst einmal in eine Schublade zu legen). Sobald die Netzwerkverbindung wiederhergestellt ist, werden diese Daten automatisch nachgesendet. So gehen auch bei kurzzeitiger Offline-Phase keine Daten verloren.

**Dritte Sicherung: Den Server nicht überlasten (Message Queue)**

Nachdem die Daten den Server erreicht haben, werden sie nicht direkt in die Datenbank geschrieben. Warum? Weil bei Spitzenzeiten wie Werbeaktionen unter Umständen Zehntausende von Datensätzen pro Sekunde gleichzeitig einströmen, was die Datenbank zum Absturz bringen könnte, wenn sie diese Last direkt verarbeiten müsste.

Die Lösung ist ein „Puffer" dazwischen, technisch als **Message Queue** bezeichnet (ein gängiges Tool ist Kafka). Sie funktioniert wie das Nummerziehungssystem in einem Restaurant: Zu Stoßzeiten warten die Kunden (Daten) zuerst in einer Schlange, während die Küche (Datenbank) in ihrem eigenen Tempo Bestellung für Bestellung abarbeitet und nicht von der gleichzeitig einströmenden Flut an Bestellungen überwältigt wird.

**Schritt-Zusammenfassung**: Durch „Sammeln und senden → Offline-Localspeicher → Message-Queue-Pufferung" sind die Daten sicher auf dem Server angekommen.

**Doch ein weiteres Problem**: Da nach einer Neuverbindung Daten automatisch nachgesendet werden, kann derselbe Datensatz möglicherweise zweimal gesendet worden sein. Wenn das nicht behandelt wird und die Daten so in die Datenbank gelangen, kommt es zu Duplikaten (z. B. wird eine 100-Euro-Bestellung als zwei Bestellungen gezählt, und der Umsatz ist künstlich aufgebläht). Deshalb müssen wir im nächsten Schritt die Daten „bereinigen".

---

## 4. Bereinigung und Laden — Daten ordnen und „schmutzige Daten" entfernen

**Voraussetzung**: Die Daten sind über die Übertragungspipeline sicher auf dem Server angekommen.

**Ziel dieses Schritts**: Bevor die Daten offiziell in die Datenbank geschrieben werden, eine „Gesundheitsprüfung" durchführen — Duplikate entfernen, formatfehlerhafte Datensätze korrigieren und sicherstellen, dass die endgültig gespeicherten Daten sauber und korrekt sind.

**Warum ist eine Bereinigung nötig?** Wie wenn Sie einen Paketkarton erhalten und überprüfen: Ist etwas doppelt geliefert worden? Ist etwas Falsches dabei? Ist eine Verpackung beschädigt? Bei Daten ist es genauso — vor dem Speichern in der Datenbank müssen sie zuerst geprüft und aufbereitet werden.

Dieser Prozess wird technisch als **ETL** bezeichnet, eine Abkürzung aus drei englischen Wörtern:
- **E**xtract (Extrahieren): Daten aus der Message Queue entnehmen
- **T**ransform (Transformieren): Datenformate prüfen und korrigieren
- **L**oad (Laden): Bereinigte Daten in die Datenbank schreiben

<DataTrackingDemo tab="overview" />

**💡 Kernprinzip: Die zwei Schlüsselaktionen der Datenbereinigung**

**Aktion 1: Deduplizierung — Doppelte Datensätze entfernen**

Wie oben erwähnt, sendet das SDK nach einer Neuverbindung Daten automatisch erneut, was dazu führen kann, dass derselbe Datensatz mehrfach gesendet wurde. Wie erkennt man Duplikate?

Die Methode ist einfach: Beim Verpacken der Daten auf der Client-Seite erhält jeder Datensatz eine weltweit eindeutige ID (genannt `dedup_id`, ähnlich wie eine Paketsendungsnummer). Der Server prüft vor dem Speichern, ob diese ID bereits existiert — wenn ja, ist es ein Duplikat und wird verworfen.

**Aktion 2: Validierung und Formatstandardisierung — Nicht-standardisierte Datensätze korrigieren**

Die App wird ständig aktualisiert, und die Tracking-Codes verschiedener Versionen können leichte Unterschiede aufweisen. Zum Beispiel:

- Die alte Version nannte das Nutzer-ID-Feld `userId`, die neue Version verwendet `user_id`
- Bei einigen Datensätzen ist der Zeitstempel offensichtlich unplausibel (z. B. 1970)
- Einige Feldwerte sind nicht interpretierbar

In diesem Schritt schreibt das System Transformationsregeln, um diese Probleme einheitlich zu behandeln: Inkonsistente Feldnamen werden standardisiert, Datensätze mit anormalen Zeitstempeln werden verworfen, und nicht interpretierbare Werte werden als `unknown` markiert.

**Schritt-Zusammenfassung**: Nach Deduplizierung und Formatvalidierung werden die Daten in sauberer und einheitlicher Form in das **Data Warehouse** geschrieben (eine speziell für die Speicherung und Analyse großer Datenmengen optimierte Datenbank; gängige Beispiele sind ClickHouse, Hive). Datenanalysten können diese Daten dann direkt mit SQL-Abfragen abfragen und zuverlässige Analyseergebnisse erhalten.

---

## Rückblick auf den gesamten Prozess

Hier ist die Zusammenfassung des vierstufigen Prozesses vom Tracking bis zum Laden:

| Schritt | Was getan wurde | Was erreicht wurde | Verbleibendes Problem |
|------|----------|-----------|-------------|
| **1. Erfassungsmethode wählen** | Entscheidung, wie Nutzeraktionen aufgezeichnet werden | Die App verfügt über Aufzeichnungsfähigkeit | Die Datenformate der verschiedenen Recorder sind nicht einheitlich |
| **2. Datenformat entwerfen** | Einheitliches Aufzeichnungsformat mit der 4W1H-Vorlage | Jeder Datensatz ist ein standardisiertes JSON | Bei hoher Nutzerzahl ist Einzelsendung nicht machbar |
| **3. Übertragung und Zwischenspeicherung** | Batch-Sendung, Offline-Speicherung, Queue-Pufferung | Daten sind sicher auf dem Server angekommen | Neuversuch kann zu Daten-Duplikaten führen |
| **4. Bereinigung und Laden** | Deduplizierung, Validierung, Formatstandardisierung | ✅ Saubere Daten im Data Warehouse gespeichert | — |

---

## Fazit

Wenn ein Nutzer in einer App auf einen Button klickt, ist es an der Oberfläche nur eine momentane Aktion. Doch im Hintergrund läuft bereits eine vollständige Daten-Pipeline:

1. Der Tracking-Code erfasst diesen Klick und erzeugt einen Standarddatensatz nach der 4W1H-Vorlage
2. Der Datensatz wird lokal auf dem Gerät zwischengespeichert und als Batch an den Server gesendet
3. Der Server nimmt die Daten über eine Message Queue stabil entgegen und führt Deduplizierung und Formatvalidierung durch
4. Schließlich wird ein sauberer, korrekter Datensatz in das Data Warehouse geschrieben

Das ist der vollständige Prozess des Event Trackings. Er wandelt die verstreuten, unsichtbaren Verhaltensweisen der Nutzer in abfragbare, analysierbare strukturierte Daten um. Produktmanager können erkennen, welche Funktionen die Nutzer mögen und wo sie abbrechen; Betriebsmitarbeiter können die Wirkung von Kampagnen bewerten; und Entwickler können feststellen, in welcher Version ein Problem aufgetreten ist.

Dieses System aus „Erfassung → Modellierung → Übertragung → Bereinigung" ist die Grundinfrastruktur für datengetriebene Entscheidungsfindung.
