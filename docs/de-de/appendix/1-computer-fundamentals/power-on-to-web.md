# Panorama des Computersystems: Vom Booten bis zum Webzugriff

::: tip Einleitung
Hast du dich jemals gefragt, was zwischen dem Drücken des Power-Knopfes deines Computers und dem Moment, in dem du eine Webseite im Browser siehst, tatsächlich passiert?

Dieser Prozess gleicht einem **Staffellauf** – die Hardware wird mit Strom versorgt und weckt die Firmware, die Firmware führt ihre Prüfungen durch und übergibt an das Betriebssystem, das Betriebssystem bereitet die Umgebung vor, damit der Browser gestartet werden kann, und der Browser greift schließlich über das Netzwerk auf einen entfernten Server zu, um die Webseite abzurufen. Jeder Schritt **hängt vom erfolgreichen Abschluss des vorherigen Schrittes ab** – wenn ein Staffelstab fallen gelassen wird, können die nachfolgenden Schritte nicht ausgeführt werden.

Das Verständnis dieser vollständigen Kette hilft dir, ein ganzheitliches Verständnis von Computersystemen aufzubauen – ein unverzichtbarer Schritt auf dem Weg zum Full-Stack-Entwickler.
:::

**Was wirst du lernen?**

Dieser Artikel führt dich in der tatsächlichen zeitlichen Reihenfolge durch fünf Phasen vom Drücken des Power-Knopfes bis zum Anzeigen einer Webseite:

1. **Hardware-Start** (Abschnitt 1) → Wie der Strom die CPU aufweckt
2. **Firmware-Selbsttest** (Abschnitt 2) → Wie BIOS/UEFI die Hardware prüft und das Boot-Gerät findet
3. **Betriebssystem-Start** (Abschnitt 3) → Wie der Kernel geladen wird und der Desktop erscheint
4. **Browser-Start** (Abschnitt 4) → Wie eine Anwendung vom Betriebssystem gestartet wird
5. **Netzwerkanfrage** (Abschnitt 5) → Die vollständige Netzwerkreise vom Eingeben der URL bis zur Darstellung der Seite

Jeder Schritt baut auf dem vorherigen auf – keiner kann übersprungen werden.

---

## 1. Power-Knopf drücken: Das Erwachen der Hardware

### 1.1 Stromversorgung startet

Wenn du den Power-Knopf drückst, beginnt das **Netzteil (PSU)** zu arbeiten und wandelt Wechselstrom (220 V) in Gleichstrom (12 V, 5 V, 3,3 V usw.) um, um die verschiedenen Hardware-Komponenten mit Strom zu versorgen.

```
Power-Knopf → Netzteil (PSU) → Gleichstrom-Ausgabe → Versorgung der Mainboard-Komponenten
```

### 1.2 Mainboard-Chipsatz wird aktiviert

Sobald die Stromversorgung stabil ist, beginnt der **Mainboard-Chipsatz** zu arbeiten. Er fungiert als „Chef-Dispatcher" des Computers und koordiniert die verschiedenen Hardware-Komponenten.

### 1.3 CPU-Reset

Nachdem die CPU das Reset-Signal empfangen hat, löscht sie alle internen Register und Caches und beginnt mit der Ausführung von Befehlen ab einer vordefinierten Adresse. Diese Adresse zeigt normalerweise auf den **BIOS/UEFI**-Chip.

<PowerOnDemo />

---

> **Erster Staffelstab übergeben** ⛳ An diesem Punkt ist die Arbeit auf Hardware-Ebene abgeschlossen: Das Netzteil hat Wechselstrom in stabilen Gleichstrom umgewandelt, der Mainboard-Chipsatz wurde aktiviert und koordiniert die Komponenten, und die CPU hat ihren Reset abgeschlossen, die Register geleert und ist bereit, den ersten Befehl auszuführen.
>
> Aber wohlgemerkt – die CPU ist in diesem Moment wie ein „Neugeborenes, das gerade die Augen geöffnet hat". Sie kann zwar Befehle ausführen, weiß aber nichts über ihre Umgebung: Wie viel Arbeitsspeicher ist im Computer verbaut? Funktioniert die Grafikkarte? Wo ist die Festplatte? Von welchem Gerät soll das Betriebssystem gestartet werden? Diese Fragen kann die CPU nicht selbst beantworten.
>
> Daher ist der erste Befehl, den die CPU nach dem Reset ausführt, ein Sprung zu einer **festen Speicheradresse** – diese Adresse zeigt auf den fest verlöteten BIOS/UEFI-Firmware-Chip auf dem Mainboard. Von diesem Moment an geht die Kontrolle von der reinen Hardware auf die Firmware über. Die Aufgabe von BIOS/UEFI ist klar: **Alle Hardware-Komponenten auf ihre Funktionsfähigkeit prüfen, dann das Betriebssystem finden und starten**. Das ist der zweite Staffelstab dieser Stafette.

## 2. BIOS/UEFI: Der Hardware-Selbsttest

<BiosUefiInteractiveDemo />

---

> **Zweiter Staffelstab übergeben** ⛳ BIOS/UEFI hat seine drei Aufgaben erfolgreich erfüllt: Durch den POST-Selbsttest wurde bestätigt, dass Arbeitsspeicher, Grafikkarte, Tastatur und andere Hardware einwandfrei funktionieren; die Betriebsmodi der Hardware wurden initialisiert; und der Boot-Sektor auf der Festplatte wurde gemäß der Boot-Reihenfolge gefunden.
>
> Aber die Rolle von BIOS/UEFI endet hier – es ist im Wesentlichen ein „Untersuchungsarzt + Dispatcher". Es kann prüfen, ob die Hardware gesund ist, und entscheiden, von welchem Gerät gebootet wird, aber es kann keine Dateien verwalten, keine Anwendungen ausführen und keinen schönen Desktop anzeigen. Diese komplexen Aufgaben erfordern eine leistungsfähigere Software – das **Betriebssystem**.
>
> Die Übergabe erfolgt ganz konkret: BIOS/UEFI liest den Bootloader-Code aus dem ersten Sektor der Festplatte (dem Boot-Sektor), lädt ihn in den Arbeitsspeicher und lässt die CPU zu diesem Code springen, um ihn auszuführen. Von diesem Moment an geht die Kontrolle offiziell von der Firmware an den Bootloader des Betriebssystems über. Der Bootloader lädt Schritt für Schritt den Betriebssystem-Kernel, startet die Systemdienste und bringt schließlich den vertrauten Desktop zur Anzeige. Der komplexeste Abschnitt dieser Kette beginnt.

## 3. Betriebssystem-Start: Vom Kernel zum Desktop

<OSBootInteractiveDemo />

---

> **Dritter Staffelstab übergeben** ⛳ Das Betriebssystem ist vollständig gestartet und der Desktop wird angezeigt. Rückblick auf das, was dieser Abschnitt geleistet hat: Der Bootloader hat den Kernel von der Festplatte gelesen, der Kernel hat die Kontrolle über CPU und Arbeitsspeicher übernommen, die Systemdienste wurden nacheinander gestartet (Netzwerk, Audio, Sicherheitscenter …), und schließlich hat die grafische Oberfläche den Desktop gerendert.
>
> In diesem Moment gleicht das Betriebssystem einem Gebäude, in dem Wasser, Strom und Hausverwaltung bereits funktionieren – das **Prozessmanagement** ist dafür zuständig, jedem Bewohner (Programm) einen Raum zuzuweisen, die **Speicherverwaltung** verteilt den Platz, das **Dateisystem** verwaltet die Lagerräume, und der **Netzwerkprotokoll-Stack** ist für die externe Kommunikation verantwortlich. Diese „öffentlichen Dienste" sind die Infrastruktur, auf der alle Anwendungen aufbauen – ohne sie könnte kein Programm gestartet werden.
>
> Jetzt möchtest du ins Internet, also doppelklickst du auf das Browser-Symbol auf dem Desktop. Hinter dieser einfachen Aktion führt das Betriebssystem eine Reihe von Arbeiten aus: Es sucht den Speicherort der ausführbaren Browser-Datei auf der Festplatte, erstellt einen eigenen Prozess dafür, weist Speicherplatz zu, lädt den Programmcode … Das ist die direkte Umsetzung der „Prozessmanagement"-Fähigkeit des Betriebssystems. Schauen wir uns als Nächstes an, wie der Browser gestartet wird.

## 4. Browser öffnen: Der Start einer Anwendung

### 4.1 Der Startvorgang einer Anwendung

Wenn du auf das Browser-Symbol doppelklickst, führt das Betriebssystem folgende Schritte aus:

1. **Ausführbare Datei suchen**: Anhand der Dateizuordnung die `.exe`-Datei (Windows) oder die ausführbare Datei des Browsers finden
2. **Prozess erstellen**: Einen neuen **Prozess** für den Browser anlegen
3. **Programm laden**: Den Browser-Code von der Festplatte in den Arbeitsspeicher laden
4. **Initialisierung**: Den Haupt-Thread, die Rendering-Engine, die Netzwerk-Engine usw. des Browsers starten

```
Browser-Startvorgang:
┌─────────────────────────────────────┐
│  1. Doppelklick auf das Symbol      │
│  2. Betriebssystem sucht die        │
│     ausführbare Browser-Datei       │
│  3. Browser-Prozess wird erstellt   │
│  4. Browser-Code wird in den        │
│     Arbeitsspeicher geladen         │
│  5. Module werden initialisiert     │
│     (Rendering, Netzwerk, JS)       │
│  6. Browser-Fenster wird angezeigt  │
└─────────────────────────────────────┘
```

### 4.2 Die Hauptkomponenten eines Browsers

Ein moderner Browser ist ein komplexes „Betriebssystem", das im Wesentlichen aus folgenden Teilen besteht:

| Modul | Funktion |
|-----|------|
| **Benutzeroberfläche** | Adressleiste, Tabs, Lesezeichen usw. |
| **Browser-Engine** | Koordiniert UI und Rendering-Engine |
| **Rendering-Engine** | Parst HTML/CSS und stellt Webseiten dar |
| **JavaScript-Engine** | Führt JavaScript-Code aus |
| **Netzwerkmodul** | Sendet HTTP-Anfragen |
| **UI-Backend** | Zeichnet grundlegende UI-Komponenten |
| **Datenspeicher** | Cookies, LocalStorage usw. |

<BrowserArchitectureDemo />

---

> **Vierter Staffelstab übergeben** ⛳ Der Browser wurde erfolgreich gestartet. Das Betriebssystem hat einen eigenen Prozess dafür erstellt und Speicherplatz zugewiesen. Die verschiedenen Module des Browsers sind ebenfalls initialisiert: Die Rendering-Engine ist bereit, HTML/CSS zu parsen, die JavaScript-Engine kann Skripte ausführen, und das Netzwerkmodul kann Daten senden und empfangen.
>
> Du kannst dir den Browser in diesem Moment wie ein Auto mit laufendem Motor vorstellen – der Motor läuft, das Armaturenbrett leuchtet, das Navigationssystem ist bereit, aber das Auto steht noch still, weil der Fahrer (du) noch nicht gesagt hat, „wohin es gehen soll". Das Browser-Fenster ist jetzt noch leer, der Cursor blinkt in der Adressleiste und wartet auf deine Eingabe.
>
> Wenn du `https://www.example.com` in die Adressleiste eingibst und Enter drückst, beginnt eine Reise durch das gesamte Internet. Das Netzwerkmodul des Browsers übernimmt diese Anfrage: Zuerst wird die Struktur der URL analysiert, dann wird der Domainname per DNS in eine IP-Adresse übersetzt, danach wird über das Netzwerk eine TCP-Verbindung mit dem entfernten Server aufgebaut, ein verschlüsselter Kanal ausgehandelt, die HTTP-Anfrage gesendet, auf die Antwort des Servers gewartet, und schließlich wird der empfangene HTML/CSS/JS-Code an die Rendering-Engine übergeben, um die Webseite darzustellen, die du siehst. Dies ist der Abschnitt mit den meisten Schritten und den vielfältigsten Protokollen in der gesamten Staffelkette – und der Teil, den Webentwickler am besten verstehen müssen.

## 5. URL aufrufen: Der vollständige Ablauf einer Netzwerkanfrage

### 5.1 Überblick über URLs
**URL (Uniform Resource Locator)** ist die Adresse einer Ressource – ähnlich wie eine Postadresse im Alltag dient sie dazu, Ressourcen im Internet zu lokalisieren.

```
Aufbau einer URL:
┌─────────────────────────────────────────────────────────┐
│  https://  │  www.example.com  │  /path/to/page  │ ?query=1 │
│  Protokoll │      Domain       │      Pfad       │  Query   │
└─────────────────────────────────────────────────────────┘
```

- **Protokoll (Protocol)**: Legt fest, wie auf die Ressource zugegriffen wird (http, https, ftp usw.)
- **Domain (Domain)**: Die Adresse des Servers
- **Pfad (Path)**: Der Speicherort der Ressource auf dem Server
- **Query (Query)**: Zusätzliche Parameter

### 5.2 Der vollständige Ablauf eines URL-Aufrufs

Wenn du `https://www.example.com` aufrufst, passiert Folgendes:

<URLRequestDemo />

#### Schritt 1: URL-Analyse

Der Browser **parst zuerst die URL** und extrahiert Protokoll, Domain, Pfad und weitere Informationen.

```
URL-Analyse:
https://www.example.com/index.html
  ↓
Protokoll: https
Domain:    www.example.com
Pfad:      /index.html
```

#### Schritt 2: DNS-Auflösung

Computer greifen über das Netzwerk auf Server zu, aber das Netzwerk verwendet **IP-Adressen** (z. B. 93.184.216.34) anstelle von Domainnamen. Daher muss der Domainname in eine IP-Adresse übersetzt werden – dieser Vorgang heißt **DNS-Auflösung**.

```
DNS-Auflösungsablauf:
┌─────────────────────────────────────────────────────────┐
│  Browser-Cache → hosts-Datei → lokaler DNS-Cache →      │
│  DNS-Server                                             │
└─────────────────────────────────────────────────────────┘

Tatsächlicher Ablauf:
1. Browser prüft seinen Cache (wurde die Adresse kürzlich besucht?)
2. Betriebssystem prüft seinen DNS-Cache
3. Eine Abfrage wird an den DNS-Server gesendet
4. Der DNS-Server gibt die IP-Adresse zurück
```

#### Schritt 3: TCP-Verbindung aufbauen

Nach Erhalt der IP-Adresse baut der Browser eine **TCP-Verbindung** zum Server auf. TCP ist ein Protokoll der Transportschicht, das eine zuverlässige Datenübertragung gewährleistet.

```
TCP-Drei-Wege-Handschlag:
┌─────────────────────────────────────────────────────────┐
│  Client → Server: SYN (Synchronisierungsanfrage)        │
│  Server → Client: SYN-ACK (Bestätigung & Synchron.)     │
│  Client → Server: ACK (Bestätigung)                     │
│                        ↓                                 │
│  Verbindung erfolgreich aufgebaut!                      │
└─────────────────────────────────────────────────────────┘
```

Bei **HTTPS** ist zusätzlich ein **TLS/SSL-Handschlag** erforderlich, um einen verschlüsselten Kanal aufzubauen.

#### Schritt 4: HTTP-Anfrage senden

Nachdem die Verbindung aufgebaut ist, sendet der Browser eine **HTTP-Anfrage** an den Server:

```
HTTP-Anfrageformat:
┌─────────────────────────────────────────────────────────┐
│  GET /index.html HTTP/1.1                               │
│  Host: www.example.com                                  │
│  User-Agent: Mozilla/5.0...                              │
│  Accept: text/html                                      │
│                                                         │
│  (Leerzeile)                                            │
└─────────────────────────────────────────────────────────┘
```

Gängige HTTP-Methoden:

| Methode | Bedeutung | Verwendung |
|-----|------|-----|
| **GET** | Ressource abrufen | Webseiten anzeigen |
| **POST** | Daten übermitteln | Login, Formulare absenden |
| **PUT** | Ressource hochladen | Datei-Upload |
| **DELETE** | Ressource löschen | Daten löschen |

#### Schritt 5: Server verarbeitet die Anfrage

Nachdem der Server (in der Regel ein **Webserver** wie Nginx oder Apache) die Anfrage erhalten hat:

1. **Anfrage analysieren**: Verstehen, was der Client möchte
2. **Geschäftslogik ausführen**: Backend-Programme aufrufen (z. B. Python, Node.js, Java)
3. **Datenbank abfragen**: Die benötigten Daten abrufen
4. **Antwort generieren**: Die Daten in Formate wie HTML, JSON usw. zusammenstellen

```
Server-Verarbeitungsablauf:
┌─────────────────────────────────────────────────────────┐
│  1. Webserver empfängt die Anfrage (Nginx/Apache)       │
│  2. Die passende Handler-Routine anhand des Pfads       │
│     finden                                              │
│  3. Backend-Code ausführen (API, Geschäftslogik)        │
│  4. Bei Bedarf Datenbank abfragen und Daten holen       │
│  5. Antwort zusammenstellen (HTML/JSON/CSS/JS)          │
│  6. HTTP-Antwort zurücksenden                           │
└─────────────────────────────────────────────────────────┘
```

#### Schritt 6: HTTP-Antwort zurücksenden

Der Server sendet eine **HTTP-Antwort** zurück, die einen Statuscode, Antwort-Header und den Antwort-Body enthält:

```
HTTP-Antwortformat:
┌─────────────────────────────────────────────────────────┐
│  HTTP/1.1 200 OK                                        │
│  Content-Type: text/html                                │
│  Content-Length: 1234                                   │
│                                                         │
│  <!DOCTYPE html>                                        │
│  <html>...</html>                                       │
└─────────────────────────────────────────────────────────┘
```

Gängige Statuscodes:

| Statuscode | Bedeutung |
|-------|------|
| **200** | Erfolg |
| **301/302** | Weiterleitung |
| **404** | Ressource nicht gefunden |
| **500** | Serverfehler |

#### Schritt 7: Der Browser rendert die Seite

Nach Erhalt der Antwort beginnt der Browser mit dem **Rendern der Seite**:

<RenderingDemo />

1. **HTML parsen**: Den DOM-Baum aufbauen
2. **CSS parsen**: Stile berechnen und den Render-Baum erstellen
3. **JavaScript ausführen**: Den JS-Code der Seite ausführen
4. **Seite zeichnen**: Den Inhalt auf dem Bildschirm darstellen

```
Browser-Rendering-Prozess:
┌─────────────────────────────────────────────────────────┐
│  1. HTML parsen → DOM-Baum                             │
│  2. CSS parsen → Stilregeln                             │
│  3. DOM + CSS → Render-Baum                            │
│  4. Layout berechnen → Größe und Position jedes        │
│     Elements                                           │
│  5. Zeichnen → Pixel auf dem Bildschirm darstellen      │
│  6. Compositing → Ebenen zusammenführen                 │
└─────────────────────────────────────────────────────────┘
```

---

> **Letzter Staffelstab übergeben** ⛳ Die Webseite wird endlich vor deinen Augen angezeigt! Rückblickend auf diesen letzten Abschnitt – wie viele Schritte er durchlaufen hat: Der Browser hat die URL analysiert und Protokoll und Domain extrahiert, über gestaffelte DNS-Abfragen den Domainnamen in eine IP-Adresse übersetzt, per TCP-Drei-Wege-Handschlag eine zuverlässige Verbindung zum Server aufgebaut, dann per TLS-Handschlag einen verschlüsselten Kanal hergestellt, die HTTP-Anfrage gesendet, woraufhin der Server die Geschäftslogik verarbeitet, die Datenbank abgefragt und die Antwortdaten zusammengestellt hat, und schließlich hat die Rendering-Engine des Browsers das HTML in einen DOM-Baum geparst, CSS in Stilregeln umgewandelt, beides zu einem Render-Baum zusammengeführt, das Layout berechnet und Pixel für Pixel auf dem Bildschirm gezeichnet.
>
> Lass uns nun die Perspektive weiten und das Gesamtbild dieses Staffellaufs von Anfang bis Ende betrachten. Vom Moment des Drückens des Power-Knopfes an gerechnet: Der Strom weckt die Hardware (1. Stab) → Die Firmware prüft die Geräte und findet das Boot-Laufwerk (2. Stab) → Das Betriebssystem startet vollständig vom Kernel bis zum Desktop (3. Stab) → Der Browser wird als Anwendung vom Betriebssystem gestartet (4. Stab) → Die Netzwerkanfrage durchquert das Internet, holt die Daten zurück und rendert sie zur Webseite (5. Stab). Fünf Stäbe greifen ineinander, jeder baut auf den Ergebnissen des vorherigen auf – würde auch nur ein einziges Glied fehlen, könntest du die Webseite vor dir nicht sehen.
>
> Als Nächstes wollen wir diese fünf Phasen mit einem vollständigen Flussdiagramm zusammenführen und ihre Abhängigkeiten visuell darstellen.

## 6. Vollständiger Prozess im Überblick

Fassen wir den gesamten Ablauf zusammen:

<FullProcessDemo />

```
Vollständiger Ablauf vom Power-Knopf bis zum Besuch einer Website:

┌──────────────────────────────────────────────────────────────────┐
│  1. Power-Knopf drücken                                          │
│     └── Stromversorgung → Mainboard aktiviert → CPU-Reset        │
│         → BIOS/UEFI ausführen                                    │
├──────────────────────────────────────────────────────────────────┤
│  2. BIOS/UEFI-Start                                              │
│     └── Hardware-Selbsttest → Boot-Gerät suchen → Bootloader     │
│         laden                                                    │
├──────────────────────────────────────────────────────────────────┤
│  3. Betriebssystem-Start                                         │
│     └── Bootloader → Kernel laden → Dienste starten → Desktop    │
│         anzeigen                                                 │
├──────────────────────────────────────────────────────────────────┤
│  4. Browser öffnen                                               │
│     └── Symbol doppelklicken → Prozess erstellen → Programm      │
│         laden → Fenster anzeigen                                 │
├──────────────────────────────────────────────────────────────────┤
│  5. URL aufrufen                                                 │
│     └── URL-Analyse → DNS-Auflösung → TCP-Verbindung → HTTP-    │
│         Anfrage → Server-Verarbeitung → HTTP-Antwort →           │
│         Browser-Rendering → Webseite anzeigen                    │
└──────────────────────────────────────────────────────────────────┘
```

---

> Wenn du die gesamte Kette betrachtest, wirst du ein interessantes Muster erkennen: Jede Phase löst völlig unterschiedliche Probleme und betrifft völlig unterschiedliche technische Fachgebiete. Der 1. Stab gehört zum Bereich der **Elektrotechnik** – Stromumwandlung, Schaltungsdesign, Signalübertragung; der 2. Stab ist **Firmware-Programmierung** – Hardware direkt mit Low-Level-Code steuern; der 3. Stab ist die Welt der **Betriebssysteme** – Prozess-Scheduling, Speicherverwaltung, Dateisysteme, die Kernthemen der Informatik; der 4. Stab betrifft die **Anwendungsentwicklung** – wie man eine so komplexe Software-Architektur wie einen Browser entwirft; und der 5. Stab umfasst sowohl **Computernetzwerke** als auch **Frontend-Entwicklung** – von Netzwerkprotokollen wie DNS, TCP/IP und HTTP bis hin zur Verarbeitung und Darstellung von HTML/CSS/JS.
>
> Das erklärt auch, warum ein „Full-Stack-Entwickler" ein breites Wissensspektrum benötigt: Jede einzelne Zeile Frontend-Code, die du schreibst, durchläuft letztlich diese gesamte Kette, bevor sie dem Benutzer angezeigt wird. Wenn du jedes Glied dieser Kette verstehst, kannst du bei Problemen schnell eingrenzen – liegt es an der Netzwerkschicht? Am Server? Oder am Browser-Rendering?
>
> Die folgende Wissenslandkarte ordnet diese technischen Fachgebiete und gibt dir Orientierung für dein weiteres Lernen.

## 7. Wissenslandkarte

Die in diesem Kapitel behandelten Wissensgebiete:

```
Computersysteme im Überblick
├── Hardware-Grundlagen
│   ├── Netzteil (PSU)
│   ├── Mainboard-Chipsatz
│   └── CPU
├── BIOS/UEFI
│   ├── POST-Selbsttest
│   ├── Boot-Reihenfolge
│   └── Bootloader
├── Betriebssystem
│   ├── Kernel
│   ├── Systemdienste
│   └── Desktop-Umgebung
├── Anwendungen
│   ├── Prozessmanagement
│   └── Programm laden
└── Netzwerkkommunikation
    ├── DNS-Auflösung
    ├── TCP/IP-Protokoll
    ├── HTTP-Protokoll
    └── Browser-Rendering
```

::: tip Weiterlernen
Wenn du tiefer in ein bestimmtes Thema einsteigen möchtest, kannst du hier weitermachen:

- **Vom Transistor zur CPU**: Die Grundlagen der Computer-Hardware verstehen
- **Betriebssysteme (Prozesse/Speicher/Dateisysteme)**: Betriebssysteme im Detail verstehen
- **Computernetzwerke**: Netzwerkprotokolle im Detail verstehen
:::
