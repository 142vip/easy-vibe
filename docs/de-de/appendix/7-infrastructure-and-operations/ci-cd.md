# CI/CD: Automatisierte Auslieferung
::: tip 🎯 Kernfrage
**Der Code laeuft lokal einwandfrei - wie macht man ihn fuer die ganze Welt zugaenglich?**
:::

---

## 1. Warum muss man einen Dienst "online stellen"

Stell dir vor, du hast zu Hause ein grossartiges Essen gekocht. Das Problem: Nur deine Familie kann es geniessen. Nachbarn, Bekannte, Fremde - sie alle kommen nicht in den Genuss.

Was also tun? Du musst **das Essen in ein Restaurant bringen**. Genau das bedeutet "Dienst online stellen" - deinen Code vom persoenlichen Computer auf einen oeffentlich zugaenglichen Rechner zu uebertragen, der 24 Stunden am Tag, 7 Tage die Woche laeuft. So kann jeder mit Internetzugang auf deine Website zugreifen.

<DeploymentOverviewDemo />

Die Online-Stellung eines Dienstes umfasst viele Schritte. Wie beim Eroeffnen eines Restaurants geht es nicht nur ums Servieren - du musst eine Lokalitaet mieten, einrichten, Genehmigungen einholen, Personal einstellen. Aehnlich ist es bei der Webentwicklung. Vom Code bis zur zugaenglichen Website liegen viele Schritte: Build, Deployment, Netzwerkkonfiguration, Sicherheit und mehr.

Im Folgenden wird der gesamte Prozess Schritt fuer Schritt erklaert, so dass auch komplette Anfaenger alles verstehen koennen.

---

## 2. Build: Aus Code wird ein "transportables Build-Artefakt"

### 2.1 Warum muss man bauen

Anfaenger fragen oft: Der Code ist fertig - warum kann man ihn nicht direkt auf den Server legen?

Um das zu beantworten, muss man zuerst verstehen, in welchem Format dein Code vorliegt. Du verwendest vielleicht Frameworks wie Vue, React, Express oder Koa. Diese haben eines gemeinsam: **Sie sind nicht direkt fuer Browser oder Server geeignet.**

Ein Beispiel: Wenn du Vue-Code schreibst, verwendest du Tags wie `<template>` oder `<script setup>`. Diese Syntax kennt nur Vue. Der Browser versteht sie nicht. Browser kennen nur drei Sprachen: HTML (Struktur), CSS (Styling) und JavaScript (Logik). Vue-Komponentensyntax ist fuer den Browser wie eine Fremdsprache.

Bevor der Code auf den Server kommt, muss etwas Wichtiges geschehen: **Uebersetzung in eine Sprache, die der Browser versteht.** Dieser Uebersetzungsprozess heisst "Build" (Erstellen).

### 2.2 Was genau passiert beim Build

Build bedeutet nicht nur Uebersetzung. Es werden auch viele Optimierungen durchgefuehrt, damit die Website schneller und ressourcenschonender laeuft. Hier sind die Details:

**Schritt 1: Abhaengigkeiten aufloesen**

Beim Schreiben von Code verwendet man verschiedene Drittanbieter-Bibliotheken wie Vue, Vue Router, Axios oder Vite. Diese koennen nicht jedes Mal vom Nutzer heruntergeladen werden - das waere zu langsam. Das Build-Tool analysiert den Code, findet alle Abhaengigkeiten und "packt" sie zusammen.

**Schritt 2: Kompilierung und Umwandlung**

Das ist der wichtigste Schritt. Vue-Komponenten werden in HTML und JavaScript kompiliert. SASS/LESS wird in CSS kompiliert. ES6+-Syntax wird in besser kompatible ES5-Syntax umgewandelt. Nach diesem Schritt liegt der Code im "maschinell ausfuehrbaren Format" vor.

**Schritt 3: Minifizierung und Verschleierung**

Bei der Minifizierung werden alle Leerzeichen, Zeilenumbrueche und Kommentare entfernt. Variablennamen werden von englischen Woertern auf einzelne Buchstaben gekuerzt. Aus `userName` wird `a`, aus `calculateTotalPrice` wird `b`. Dadurch wird die Dateigroesse deutlich reduziert und der Download erfolgt schneller. Der verschleierte Code ist fuer Menschen kaum lesbar - was auch einen gewissen "Quellcodeschutz" bietet.

**Schritt 4: Code-Splitting**

Vielleicht hast du 10 Seiten geschrieben, jede mit eigenem Code. Aber Nutzer besuchen vielleicht nur eine Seite. Warum sollen sie den Code der anderen 9 Seiten herunterladen? Das Build-Tool teilt den Code in mehrere kleine Bloecke auf. Der Nutzer laedt nur den Code der Seite, die er besucht. Das nennt man "Lazy Loading" und beschleunigt den ersten Besuch erheblich.

**Schritt 5: Hash-Generierung**

Das ist ein sehr wichtiger, aber oft uebersehener Schritt. Nach dem Build heissen die Dateien beispielsweise `app.abc123.js` oder `vendor.def456.css`. Die angehaengte alphanumerische Zeichenkette heisst "Hash".

Der Zweck des Hashes: Wenn sich der Code aendert, aendert sich auch der Hash-Wert. Der Browser weiss dann: "Diese Datei hat sich geaendert, sie muss neu heruntergeladen werden." Unveraenderte Dateien werden weiter aus dem Cache geladen. So sehen Nutzer immer den neuesten Code, waehrend der Cache optimal genutzt wird.

<DeploymentBuildDemo />

### 2.3 Wie fuehrt man einen Build durch

Die meisten modernen Frontend-Projekte haben bereits ein Build-Tool konfiguriert. Man muss sich nur einen Befehl merken:

```bash
# Mit npm
npm run build

# Mit yarn
yarn build

# Mit pnpm
pnpm build
```

Nach der Ausfuehrung suche im Projektverzeichnis nach einem Ordner namens `dist` (manchmal auch `build` oder `.output`). Dort befinden sich alle fertiggestellten Dateien. Diese Dateien muessen nur noch auf den Server uebertragen werden - keine weiteren Aenderungen noetig.

### 2.4 Was befindet sich im Build-Artefakt

Oeffnet man den dist-Ordner, findet man hauptsaechlich drei Dateitypen:

- **HTML-Dateien**: Meist `index.html`. Das ist die Einstiegsdatei, die der Browser zuerst laedt.
- **JS-Dateien**: Der gesamte JavaScript-Code. Es koennen eine oder mehrere sein.
- **CSS-Dateien**: Alle Stildefinitionen. Entweder inline im HTML oder als separate CSS-Dateien.

Bei komplexeren Backend-Projekten (z. B. Node.js) kann das Build-Artefakt eine ausfuehrbare Datei oder ein Docker-Image sein. Das Prinzip bleibt gleich: Den Code in ein Format umwandeln, das der Server direkt ausfuehren kann.

---

## 3. Server: Ein "Haus", das nie schliesst

### 3.1 Was ist eigentlich ein Server

Viele stellen sich bei "Server" etwas Hochkomplexes vor. Dabei ist es ganz einfach: **Ein Server ist ein Computer.** Ein Computer, der nie heruntergefahren wird und immer mit dem Internet verbunden ist.

Man koennte fragen: Ich habe doch einen Computer zu Hause. Warum sollte ich zusaetzlich Geld fuer einen Server ausgeben?

Gute Frage. Hier die Analyse:

Erstens: Dein heimischer Computer kann nicht 24 Stunden laufen. Du gehst aus, schlaefst, und manchmal stuerzt er ab. Ein Server hingegen ist dafuer gemacht, 365 Tage im Jahr ununterbrochen zu laufen. Die Website ist immer zugaenglich.

Zweitens: Deine Internetverbindung reicht nicht aus. Heimische Breitbandanschluesse haben oft langsame Upload-Geschwindigkeiten. Zudem aendert sich die IP-Adresse bei privaten Anschluessen regelmaessig. Heute ist es diese IP, morgen eine ganz andere. Das funktioniert nicht als Webserver. Server in Rechenzentren nutzen Hochgeschwindigkeitsnetzwerke mit festen IP-Adressen.

Drittens: Dein Computer hat keine "oeffentliche IP". Was bedeutet das? Eine weltweit eindeutige Adresse. Nur damit koennen andere deinen Computer im Internet finden. Die IP deines Heimcomputers funktioniert normalerweise nur im lokalen Netzwerk. Von aussen ist er nicht erreichbar. Ein Server hingegen hat eine feste oeffentliche IP, ueber die ihn weltweit jeder finden kann.

<DeploymentServerDemo />

### 3.2 Wie waehlt man einen Server

Bei der Serverwahl geht es um drei Kennzahlen: **CPU-Kerne**, **Arbeitsspeicher (RAM)** und **Festplattenplatz**. Je hoeher diese Werte, desto leistungsfaehiger der Server - und desto teurer.

Als Einsteiger brauchst du keine teure Konfiguration:

- **Persoenliche Projekte, Lernzwecke**: 1 Kern, 2 GB RAM reichen aus. Etwa einige Dutzend Euro im Monat.
- **Kleine kommerzielle Projekte**: 2 Kerne, 4 GB RAM. Kann taeglich einige Tausend bis Zehntausend Besucher verarbeiten.
- **Mittlere Projekte**: 4 Kerne, 8 GB oder mehr. Erfordert bereits ein professionelles Betriebsteam.

Ein weiterer wichtiger Faktor: **Standort**. Wenn die Nutzer hauptsaechlich in China sind, waehle einen chinesischen Server (Alibaba Cloud, Tencent Cloud) fuer schnelle Zugriffszeiten. Wenn die Nutzer im Ausland sind, waehle einen internationalen Server (AWS, Google Cloud, DigitalOcean) oder einen Server in Hongkong - schnell und ohne ICP-Registrierung.

### 3.3 Inland oder Ausland

Das ist eine wichtige Frage, die viele anfaenglich nicht bedenken.

**Inlaendische Server** sind schnell mit niedriger Latenz. Der Nachteil: Es ist eine ICP-Registrierung (Beian) erforderlich, die ein bis vier Wochen dauern kann. Inlaendische Server sind oft etwas teurer.

**Auslaendische Server** erfordern keine Registrierung und sind sofort nutzbar. Sie koennen guenstiger sein. Der Nachteil: Der Zugriff aus China kann langsamer sein. Mit Servern in Hongkong oder Singapur ist es jedoch deutlich besser.

Empfehlung: Fuer persoenliche Projekte oder Lern-Websites waehle Server in Hongkong oder im Ausland. Fuer geschaeftliche Projekte, die dauerhaft betrieben werden, waehle inlaendische Server mit ordnungsgemaesser Registrierung.

### 3.4 Vergleich der wichtigsten Cloud-Anbieter

| Anbieter | Zielgruppe | Besonderheiten | Neukundenpreise |
|------|---------|------|-----------|
| Alibaba Cloud | China-Geschaeft | Marktfuehrer in China, vollstaendiges Oekosystem | Erstes Jahr ab einigen Dutzend Euro |
| Tencent Cloud | Mini-Programme, Spiele | Gute Integration mit WeChat | Starke Neukundenrabatte |
| Huawei Cloud | Unternehmenskunden | Bevorzugt fuer Regierungsprojekte | Hoeherer Preis |
| DigitalOcean | Entwickler | Einfach, transparente Preise | Ab $4/Monat |
| Vercel | Frontend-Projekte | Keine Konfiguration, Push-to-Deploy | Kostenlose Kontingente ausreichend |

Fuer Anfaenger besonders empfohlen: **Alibaba Cloud** oder **Tencent Cloud** mit Studenten- bzw. Neukundenangeboten - oft nur einige Dutzend Euro pro Jahr. Fuer reine Frontend-Projekte bietet sich **Vercel** oder **Netlify** an - nicht einmal einen Server mieten, einfach den Code pushen und alles wird automatisch bereitgestellt.

### 3.5 Was tun nach dem Erhalt des Servers

Nach dem Kauf erhaeltst du eine E-Mail mit folgenden wichtigen Informationen:

- **IP-Adresse**: Eine Zahlenfolge wie `123.45.67.89`. Das ist die "Hausnummer" des Servers im Internet.
- **Benutzername**: Meist `root` (das Administrator-Konto).
- **Passwort**: Das Initialpasswort oder ein Link zum Setzen des Passworts.

Mit diesen Informationen kannst du dich per **SSH (Secure Shell)** remote auf dem Server anmelden. SSH ist wie ein verschluesselter Fernsteuerungsbefehl, mit dem du einen entfernten Server von deinem eigenen Computer aus bedienst.

Der Login-Befehl sieht so aus:

```bash
ssh root@123.45.67.89
# Nach dem Druecken der Eingabetaste wird das Passwort abgefragt. Nach Eingabe des korrekten Passworts bist du angemeldet.
```

Nach erfolgreichem Login befindest du dich in der Kommandozeile des Servers. Es sieht aehnlich aus wie ein Terminalfenster auf deinem eigenen Computer. Du kannst hier Software installieren, Ordner erstellen, Konfigurationen aendern - alles wie auf deinem lokalen Rechner.

---

## 4. Deployment: Den Code ins "Haus" einziehen lassen

### 4.1 Was ist Deployment

Deployment bedeutet: Nachdem der Server gemietet ist (das Haus), wird der Code (das Mobel) eingefuegt und die Tuer fuer den Betrieb geoefnet.

Konkret umfasst Deployment folgende Schritte:

1. **Code auf den Server hochladen**: Das Build-Artefakt vom lokalen Rechner auf den Server uebertragen.
2. **Abhaengigkeiten installieren**: Auf dem Server fehlen moeglicherweise die benoetigten Pakete.
3. **Umgebungsvariablen konfigurieren**: Datenbankpasswoerter, API-Schluessel und andere vertrauliche Informationen.
4. **Dienst starten**: Die Anwendung starten und beginnen, Benutzeranfragen entgegenzunehmen.

Diese vier Schritte klingen kompliziert, sind aber in der Praxis gut machbar. Im Folgenden wird jeder Schritt im Detail erklaert.

<DeploymentServerDemo />

### 4.2 Wie laedt man den Code auf den Server hoch

**Methode 1: FTP/SFTP-Upload**

Das ist die einfachste Methode. Aehnlich wie bei einer Cloud-Speicher-App ziehst du Dateien auf den Server. Lade die kostenlose Software **FileZilla** herunter, gib IP, Benutzername und Passwort des Servers ein, und du kannst die Serverdateien genauso verwalten wie lokale Dateien.

**Methode 2: Git Pull**

Dies ist die empfohlene Methode. Erstelle ein Repository auf GitHub, GitLab oder Gitee. Pushe den Code in die Cloud. Verwende dann auf dem Server den Befehl `git clone`, um den Code herunterzuladen.

Der Vorteil: Bei Updates genuegt es, auf dem Server `git pull` auszufuehren. Kein manuelles Hochladen noetig. Ausserdem ist der Code sicher in der Cloud gespeichert - selbst bei einer Neuinstallation des Servers geht nichts verloren.

**Methode 3: CI/CD-Automatisches Deployment**

Das ist die professionellste und am dringendsten empfohlene Methode. Durch die Konfiguration von CI/CD (Continuous Integration / Continuous Deployment) genuegt es, den Code auf GitHub zu pushen. Das CI/CD-System erledigt automatisch: Code ziehen -> Abhaengigkeiten installieren -> Builden -> Deployen. Du musst dich nicht einmal auf dem Server anmelden. Alles passiert vollautomatisch.

### 4.3 konkrete Schritte des Deployments

Angenommen, wir verwenden die einfachste Methode - manuelles Git-Deployment. Schritt fuer Schritt:

**Schritt 1: Mit dem Server verbinden**

```bash
ssh root@123.45.67.89
```

**Schritt 2: Notwendige Software installieren**

Bei einem Node.js-Projekt muss zunaechst Node.js installiert werden:

```bash
# Beispiel fuer Ubuntu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

**Schritt 3: Code herunterladen**

```bash
# Verzeichnis fuer die Website erstellen
mkdir -p /var/www/my-website
cd /var/www/my-website

# Code-Repository klonen (Repository muss zuvor auf GitHub erstellt werden)
git clone https://github.com/dein-benutzername/dein-repo-name.git .
```

**Schritt 4: Abhaengigkeiten installieren und bauen**

```bash
# Projektabhaengigkeiten installieren
npm install

# Projekt bauen (dist-Verzeichnis erstellen)
npm run build
```

**Schritt 5: Dienst mit PM2 starten**

Warum PM2? Es ist ein Prozessverwaltungstool, das die Website im Hintergrund laufen laesst. Selbst bei einem Serverneustart wird der Dienst automatisch wieder gestartet.

```bash
# PM2 global installieren
sudo npm install -g pm2

# Website starten (Einstiegsdatei sei index.js)
pm2 start index.js

# Autostart einrichten
pm2 startup
pm2 save
```

**Schritt 6: Nginx Reverse Proxy konfigurieren**

Node.js-Anwendungen laufen normalerweise auf Port 3000 oder 8080. Nutzer greifen aber ueber Port 80 zu (HTTP-Standardport). Nginx wird verwendet, um Anfragen von Port 80 an den Anwendungsport weiterzuleiten.

```bash
# Nginx installieren
sudo apt install -y nginx

# Nginx-Konfigurationsdatei erstellen
sudo nano /etc/nginx/sites-available/my-website
```

In dem sich oeffnenden Editor folgende Konfiguration einfuegen:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    # Statische Dateien (Build-Artefakte) direkt zurueckgeben
    location / {
        root /var/www/my-website/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API-Anfragen an das Node.js-Backend weiterleiten
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Nach dem Speichern und Beenden die Konfiguration aktivieren:

```bash
# Konfiguration aktivieren
sudo ln -s /etc/nginx/sites-available/my-website /etc/nginx/sites-enabled/

# Konfiguration auf Fehler pruefen
sudo nginx -t

# Nginx neu starten
sudo systemctl restart nginx
```

Nun sollte die Website unter `http://example.com` erreichbar sein (vorausgesetzt, die Domain ist bereits auf diese Server-IP geroutet)!

---

## 5. Domain und DNS: Der Website einen guten Namen geben

### 5.1 Warum eine Domain kaufen

Mit der Server-IP - warum noch eine Domain kaufen?

Ueberleg mal: Sich eine Zahlenfolge wie `123.45.67.89` zu merken - ist das nicht schwierig? Vertippt man sich nicht leicht? Aber Namen wie `google.com` oder `amazon.de` lassen sich viel leichter merken.

Eine Domain ist der Name der Website. Gut merkbar, professionell und spiegelt die Markenidentitaet wider. Was klingt besser: "Besuche meine Website unter der IP 123.45.67.89" oder "Besuche mein-projekt.de"?

<DeploymentDnsDemo />

### 5.2 Was ist DNS

Gut. Du hast eine Domain gekauft, z. B. `my-awesome-website.com`. Aber hier ist das Problem: Computer verstehen nur IP-Adressen, keine menschlichen Namen wie "my-awesome-website.com".

Hier kommt DNS ins Spiel. DNS steht fuer "Domain Name System". Man kann es sich als ein riesiges "Telefonbuch" vorstellen, das menschenlesbare Domainnamen in maschinenlesbare IP-Adressen uebersetzt.

Wenn du `my-awesome-website.com` in den Browser eingibst und Enter draeuckst, passiert Folgendes:

1. Der Browser fragt DNS: "Hey, wie lautet die IP-Adresse von my-awesome-website.com?"
2. DNS schlägt im "Telefonbuch" nach und antwortet: "Die IP ist 123.45.67.89"
3. Der Browser verwendet diese IP-Adresse, findet den Server und sendet die Anfrage

Der gesamte Prozess dauert normalerweise nur wenige Millisekunden und ist fuer den Nutzer nicht spuerbar.

### 5.3 Wie konfiguriert man DNS

Die DNS-Konfiguration kann an zwei Stellen vorgenommen werden:

**Methode 1: Beim Domain-Anbieter konfigurieren**

Dort, wo die Domain gekauft wurde, werden die DNS-Eintraege konfiguriert. Der haeufigste Eintragstyp ist der **A-Eintrag**:

- **Eintragstyp**: A
- **Host-Eintrag**: Meist `@` (steht fuer die Domain selbst, z. B. my-awesome-website.com) oder `www` (steht fuer www.my-awesome-website.com)
- **Eintragswert**: Die Server-IP-Adresse, z. B. `123.45.67.89`

**Methode 2: Einen Drittanbieter-DNS-Dienst nutzen**

Viele Profis nutzen nicht den DNS des Domain-Anbieters, sondern professionelle DNS-Dienste wie Cloudflare, Alibaba Cloud DNSPod oder Tencent Cloud DNS. Diese Dienste sind stabiler, schneller und bieten zusaetzliche Funktionen wie CDN und DDoS-Schutz.

### 5.4 Wie lange dauert es, bis DNS aenderungen wirksam werden

Das ist eine haeufig gestellte Frage. Die Antwort: **Es variiert. Meist einige Minuten bis 24 Stunden.**

Nach einer DNS-Aenderung muessen alle DNS-Server weltweit diese Aenderung synchronisieren. DNS-Aenderungen muessen von allen DNS-Servern weltweit synchronisiert werden - wie ein Stein, der ins Wasser geworfen wird und dessen Wellen Zeit brauchen, um sich auszubreiten. Manche DNS-Server aktualisieren schnell, andere benoetigen laenger.

Mit folgendem Befehl kann geprueft werden, ob DNS bereits wirksam ist:

```bash
# Windows
ping deine-domain.de

# Mac/Linux
ping deine-domain.de
```

Wenn der Ping erfolgreich ist und die IP des Servers anzeigt, ist DNS wirksam.

---

## 6. HTTPS: Ein "Schloss" fuer die Website

### 6.1 Der Unterschied zwischen HTTP und HTTPS

Vielleicht ist aufgefallen: Manche Webadressen beginnen mit `http://`, andere mit `https://`. Das "s" ist wichtig. Es steht fuer "Secure" (Sicher).

**HTTP (HyperText Transfer Protocol)** ist das Protokoll zur Uebertragung von Webseiten. Man kann es sich als Lastwagen vorstellen, der Daten transportiert. Aber dieser Lastwagen ist **transparent** - alle koennen sehen, was darin enthalten ist. Passwoerter und persoenliche Daten, die auf einer HTTP-Website eingegeben werden, koennen von jedem Zwischenmann abgefangen werden.

**HTTPS (HTTP Secure)** gibt diesem Lastwagen einen **versiegelten Container** mit einem Schluessel. Nur Absender und Empfaenger haben den Schluessel. Selbst wenn jemand die Sendung abfaengt, kann er den Inhalt nicht lesen. Das ist verschluesselte Uebertragung.

<DeploymentHttpsDemo />

### 6.2 Warum HTTPS

Erstens: **Sicherheit**. Ohne HTTPS werden Passwoerter im Klartext uebertragen. Jeder mit etwas technischem Wissen kann sie abfangen. Wer wuerde heutzutage noch eine Website ohne HTTPS nutzen?

Zweitens: **Browser-Warnungen**. Moderne Browser wie Chrome und Edge zeigen bei Websites ohne HTTPS die Warnung "Nicht sicher" an. Nutzer sehen das Warnsymbol und verlassen die Seite sofort.

Drittens: **SEO**. Suchmaschinen wie Google priorisieren HTTPS-Websites in den Suchergebnissen.

### 6.3 Wie erhaelt man ein HTTPS-Zertifikat

Frueher waren HTTPS-Zertifikate teuer - Hunderte bis Tausende Euro pro Jahr. Heute gibt es **Let's Encrypt**, eine Organisation, die kostenlose SSL/TLS-Zertifikate anbietet. Zudem gibt es viele automatisierte Tools fuer die Installation und Erneuerung.

**Methode 1: Certbot verwenden (empfohlen)**

Certbot ist ein Tool zur automatischen Beantragung und Konfiguration von Let's Encrypt-Zertifikaten:

```bash
# Certbot installieren
sudo apt install -y certbot python3-certbot-nginx

# Zertifikat mit einem Befehl beantragen und Nginx konfigurieren
sudo certbot --nginx -d example.com -d www.example.com
```

Waehrend der Ausfuehrung werden einige Fragen gestellt, z. B. die E-Mail-Adresse (fuer Ablaufbenachrichtigungen). Danach ist das Zertifikat automatisch konfiguriert. Beim Besuch der Website erscheint ein kleines Schloss-Symbol in der Adressleiste.

Das Zertifikat ist 90 Tage gueltig. Certbot richtet jedoch automatisch einen Cron-Job zur Verlaengerung ein. Du musst dich nicht darum kuemmern.

**Methode 2: Cloudflare verwenden**

Wenn du den DNS-Dienst von Cloudflare nutzt, musst du HTTPS gar nicht selbst konfigurieren. Cloudflare stellt automatisch HTTPS fuer deine Domain bereit und kuemmert sich auch um die 90-taegige Erneuerung.

### 6.4 Was aendert sich nach der HTTPS-Konfiguration

Nach der HTTPS-Konfiguration aendert sich der Zugriff von `http://example.com` zu `https://example.com`. Diese Aenderung bringt eine Reihe von Sicherheitsvorteilen:

1. **Verschluesselte Uebertragung**: Die gesamte Kommunikation zwischen Nutzer und Server ist verschluesselt.
2. **Identitaetspruefung**: Das Zertifikat beweist "Ich bin wirklich diese Website" und schuetzt vor Phishing.
3. **Datenintegritaet**: Es kann erkannt werden, ob Daten manipuliert wurden.

---

## 7. CI/CD: Den Roboter fuer dich arbeiten lassen

### 7.1 Was ist CI/CD

CI/CD steht fuer **C**ontinuous **I**ntegration (Continuous Integration) und **C**ontinuous **D**eployment (Continuous Deployment). Man kann es sich als ein automatisiertes Robotersystem vorstellen.

Ohne CI/CD sah der Prozess fuer jedes neue Feature so aus:

1. Computer einschalten, bei GitHub anmelden
2. Neuesten Code herunterladen
3. Tests ausfuehren, auf Bugs pruefen
4. Projekt manuell bauen
5. Auf dem Server anmelden
6. Neuesten Code herunterladen
7. Abhaengigkeiten installieren
8. Projekt bauen
9. Dienst neu starten

9 Schritte, die bei jedem Release manuell durchgefuehrt werden muessen. Nervig, oder? Und es ist leicht, einen Schritt zu vergessen - z. B. die Tests auszufuehren oder den Dienst neu zu starten.

Mit CI/CD sieht der Prozess so aus:

1. Code auf GitHub pushen
2. Einen Kaffee trinken
3. (Der Roboter erledigt automatisch die obigen 9 Schritte)
4. Die Website hat sich automatisch aktualisiert

<DeploymentCicdDemo />

Das ist die Magie von CI/CD: **Einfach den Code pushen - alles andere passiert automatisch.**

### 7.2 Der CI/CD-Workflow

Ein typischer CI/CD-Prozess sieht so aus:

**Schritt 1: Code-Commit (Push)**

Nach Abschluss der Entwicklung eines neuen Features wird der Code auf GitHub gepusht.

**Schritt 2: CI-Ausloesung (Continuous Integration)**

GitHub erkennt die Codeaenderung und benachrichtigt das CI-System (GitHub Actions, GitLab CI etc.), um die Arbeit zu beginnen.

**Schritt 3: Abhaengigkeiten installieren und testen**

Das CI-System startet einen virtuellen Computer und fuehrt Folgendes aus:
- Installation aller Projektabhaengigkeiten
- Ausfuehrung der Testprgramme, um Bugs zu finden
- Build des Projekts, um das Artefakt zu erstellen

Wenn die Tests fehlschlagen, sendet CI eine E-Mail-Benachrichtigung. Das Deployment wird gestoppt. Fehlerhafter Code wird nicht in die Produktionsumgebung gebracht.

**Schritt 4: CD-Ausfuehrung (Continuous Deployment)**

Nachdem alle Tests bestanden wurden:
- SSH-Verbindung zum Server herstellen
- Neuesten Code herunterladen
- Abhaengigkeiten installieren
- Projekt bauen
- Dienst neu starten

Der gesamte Prozess dauert oft nur wenige Minuten. Vollautomatisch.

### 7.3 Wie konfiguriert man GitHub Actions

GitHub Actions ist die in GitHub integrierte CI/CD-Funktion. Keine zusaetzlichen Kosten (das kostenlose Kontingent reicht fuer persoenliche Projekte). Die Konfiguration ist sehr einfach.

Erstelle im Projektverzeichnis die Datei `.github/workflows/deploy.yml` mit folgendem Inhalt:

```yaml
name: Deploy to Production

# Ausloesebedingung: Bei jedem Code-Push auf den main-Branch
on:
  push:
    branches: [main]

# Job-Liste
jobs:
  # Deploy-Job
  deploy:
    # Auf welchem System ausgefuehrt wird
    runs-on: ubuntu-latest

    # Konkrete Schritte
    steps:
      # 1. Code auschecken
      - name: Checkout code
        uses: actions/checkout@v3

      # 2. Node.js-Umgebung einrichten
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      # 3. Abhaengigkeiten installieren und bauen
      - name: Install and Build
        run: |
          npm ci
          npm run build

      # 4. Auf dem Server bereitstellen
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/my-website
            git pull origin main
            npm install
            npm run build
            pm2 restart all
```

Diese Konfigurationsdatei teilt GitHub Actions mit:

- Wird bei neuem Code auf dem main-Branch ausgeloest
- Wird auf einem Ubuntu-Rechner ausgefuehrt
- Zunaechst Node.js 18 installieren
- Dann Abhaengigkeiten installieren und das Projekt bauen
- Schliesslich per SSH eine Reihe von Deployment-Befehlen auf dem Server ausfuehren

Nach der Konfiguration wird bei jedem `git push origin main` das Deployment automatisch gestartet. Sehr praktisch.

---

## 8. Monitoring und Logs: Der "Waechter" der Website

### 8.1 Warum Monitoring

Nach dem Online-Stellen sollte die Website theoretisch ununterbrochen laufen. In der Praxis ist das jedoch nicht der Fall. Server koennen ausfallen, Netzwerke koennen stoeren, Code kann Bugs enthalten. In einer echten Produktionsumgebung kann alles Moegliche passieren.

Ohne Monitoring erfaehrst du erst davon, wenn Nutzer anrufen und sagen: "Die Website ist nicht erreichbar." Dann ist es oft schon zu spaet - Nutzer sind moeglicherweise bereits abgewandert.

Mit Monitoring kannst du:

- **Probleme fruehzeitig erkennen**: CPU-Auslastung bei 90%? Rechtzeitig Server hinzufuegen.
- **Probleme schnell lokalisieren**: Website langsam? Monitoring zeigt, wo der Engpass liegt.
- **Den Ueberblick behalten**: Wie viele Besucher pro Tag, wann ist der Besucherhoehepunkt?

<DeploymentMonitorDemo />

### 8.2 Welche Metriken ueberwachen

Die wichtigsten Monitoring-Metriken:

| Metrik | Normalbereich | Was tun bei Ueberschreitung |
|------|---------|-----------|
| CPU-Auslastung | < 70% | Serverkonfiguration upgraden oder Code optimieren |
| Speicherauslastung | < 80% | Auf Speicherlecks pruefen |
| Festplattenauslastung | < 80% | Logs oder unnuetze Dateien bereinigen |
| Website-Erreichbarkeit | 100% | Pruefen, ob der Dienst ordnungsgemaess laeuft |
| Antwortzeit | < 2 Sekunden | Datenbankabfragen optimieren oder Caching einfuegen |
| Fehlerrate | < 1% | Fehlerlogs pruefen, um das Problem zu lokalisieren |

### 8.3 Wie konfiguriert man Monitoring

**Einfachste Loesung: Uptime Robot**

Auf uptimerobot.com registrieren, Website-URL hinzufuegen. Es prueft automatisch alle 5 Minuten, ob die Website erreichbar ist. Bei Ausfall wird eine E-Mail gesendet. Die kostenlose Version kann 50 Websites ueberwachen - fuer persoenliche Projekte mehr als ausreichend.

**Erweiterte Loesung: Alibaba Cloud / Tencent Cloud Monitoring**

Wenn der Server bei Alibaba Cloud oder Tencent Cloud gehostet ist, ist Monitoring bereits integriert. Nur Schwellenwert-Alarme konfigurieren.

**Professionelle Loesung: Prometheus + Grafana**

Das sind das "Schweizer Taschenmesser" der Ueberwachung. Extrem leistungsfaehig, kann jede erdenkliche Metrik ueberwachen und wunderschoene Visualisierungen erstellen. Die Konfiguration ist jedoch komplexer und erfordert etwas Erfahrung.

### 8.4 Logs: Ansatz für findet man die Ursache eines Problems

Monitoring sagt dir: "Die Website hat ein Problem." Aber was genau das Problem ist und warum es auftritt, muss mit **Logs** herausgefunden werden.

Logs sind das "Tagebuch" des Programms. Sie dokumentieren alles waehrend der Laufzeit:

- Welcher Nutzer hat wann welche Seite besucht
- Wie lange eine Datenbankabfrage gedauert hat
- Ob Fehler aufgetreten sind und welche Fehlermeldung ausgegeben wurde

**Grundlegende Log-Nutzung**

Auf dem Server die Anwendungs-Logs anzeigen:

```bash
# PM2-Logs anzeigen
pm2 logs

# Nginx-Zugriffslog anzeigen
tail -f /var/log/nginx/access.log

# Nginz-Fehlerlog anzeigen
tail -f /var/log/nginx/error.log
```

**Erweiterte Log-Loesungen**

Bei komplexeren Projekten werden professionelle Log-Sammlungstools empfohlen:

- **Loki**: Kostenlos und Open Source, aus der gleichen Familie wie Prometheus.
- **ELK (Elasticsearch + Logstash + Kibana)**: Leistungsfaehig, aber komplex in der Einrichtung.
- **Sentry**: Spezialisiert auf das Sammeln von Anwendungsfehlern. Erfasst automatisch Fehlerinformationen.

### 8.5 Alarmierung: Ansatz für erfaehrt man sofort von Problemen

Monitoring zeigt dir, dass es ein Problem gibt. Aber wenn man nicht staendig auf das Dashboard schaut? Hier kommt **Alarmierung** ins Spiel.

Alarmierung bedeutet: Wenn das Monitoringsystem eine Anomalie erkennt, wird automatisch per SMS, E-Mail, Messenger etc. benachrichtigt. Verschiedene Alarmstufen koennen eingerichtet werden:

- **Kritisch (Website komplett ausgefallen)**: SMS + Anruf. Muss sofort bekannt sein.
- **Schwerwiegend (Fehlerrate steigt rasant)**: Messenger-Nachricht. Bei Seen bearbeiten.
- **Normal (CPU etwas hoch)**: E-Mail-Zusammenfassung. Einmal taeglich pruefen.

Das Kernprinzip der Alarmkonfiguration: **Abgestufte Alarmierung - sich nicht selbst nerven.** Wenn jede Kleinigkeit eine SMS ausgeloest, wird man die Alarmierung bald abschalten.

---

## 9. Schnellreferenz fuer haeufige Probleme

| Problem | Moegliche Ursache | Loesung |
|---------|---------|---------|
| Website nicht erreichbar | Domain nicht aufgeloest / Server ausgefallen / Nginx nicht gestartet | `ping domain.de` pruefen; `pm2 list` fuer Dienststatus; `systemctl status nginx` fuer Nginx |
| Leere Seite | Build-Artefakt-Pfad falsch / Statische Dateien nicht korrekt konfiguriert | Nginx root-Pfad pruefen, ob er auf dist-Verzeichnis zeigt |
| 404 Seite nicht gefunden | Routing nicht korrekt konfiguriert / Pfad-Tippfehler | `try_files $uri $uri/ /index.html` zur Nginx-Konfiguration hinzufuegen |
| 502 Bad Gateway | Backend-Dienst ausgefallen / Port nicht geoeffnet | `pm2 list` pruefen, ob der Prozess laeuft; Port pruefen |
| 403 Forbidden | Falsche Berechtigungen / Verzeichnis-Index deaktiviert | Dateiberechtigungen `chmod -R 755` pruefen; `autoindex on` in Nginx-Konfiguration |
| HTTPS-Zertifikat abgelaufen | Zertifikat nicht erneuert | `certbot renew` fuer manuelle Erneuerung; Automatischen Cron-Job pruefen |
| Nach Update keine Aenderung sichtbar | Browser-Cache / CDN-Cache | Strg+Shift+R fuer hartes Neuladen; CDN-Konsole "Cache invalidieren" |
| Website sehr langsam | Bandbreite unzureichend / Kein Caching / Kein CDN | Server-Bandbreite upgraden; Redis-Caching konfigurieren; CDN einbinden |
| Datenbankverbindung fehlgeschlagen | Datenbank nicht gestartet / Passwort falsch / Berechtigungsproblem | Datenbank-Dienststatus pruefen; Verbindungsinformationen in der Konfiguration pruefen |

---

## Zusammenfassung

Die Online-Stellung eines Dienstes ist ein umfassendes Projekt. Es reicht von der Code-Erstellung ueber Server-Deployment, Netzwerkkonfiguration und Sicherheit bis hin zu Monitoring, Alarmierung und Log-Analyse. Fuer Anfaenger ist es nicht noetig, von Anfang an Perfektion anzustreben. Zunaechst die minimale funktionsfaehige Version (MVP) zum Laufen bringen und dann schrittweise verbessern.

Die Kernpunkte des gesamten Prozesses lassen sich wie folgt zusammenfassen:

### Kernprozess

1. **Build** -> Mit `npm run build` den Code in HTML/CSS/JS umwandeln, die der Browser versteht
2. **Deployment** -> Build-Artefakte auf den Server laden und mit Nginx als Reverse Proxy konfigurieren
3. **Domain** -> Domain kaufen und DNS auf Server-IP konfigurieren
4. **HTTPS** -> Kostenloses Zertifikat von Let's Encrypt fuer sichere Datenuebertragung
5. **CI/CD** -> Automatisiertes Deployment konfigurieren; nach Push automatisch online
6. **Monitoring** -> Ueberwachung und Alarmierung konfigurieren; bei Problemen sofort Bescheid wissen

### Empfohlener Lernpfad

- **Tag 1**: Eine statische Webseite mit Vercel/Netlify bereitstellen. Das Gefuehl erleben: "Code wird zur Website."
- **Woche 1**: Einen Cloud-Server mieten, manuell ein Node.js-Projekt bereitstellen, Domain und HTTPS konfigurieren.
- **Woche 2-4**: Einen vollstaendigen CI/CD-Prozess einrichten, Monitoring- und Alerting-System aufbauen.
- **Fortlaufend**: Docker-Containerisierung, Kubernetes-Cluster und Microservice-Architektur lernen.

---

## Glossar

| Begriff | Englisch | Erklaerung |
|------|------|-----------|
| Build | Build | Quellcode in ein ausfuehrbares Format uebersetzen und verpacken |
| Deployment | Deploy | Code auf einen Server laden, damit Nutzer zugreifen koennen |
| Server | Server | Ein 24/7 laufender, internetverbundener Computer |
| Domain | Domain | Der gut merkbare Name einer Website (z. B. google.com) |
| DNS | Domain Name System | Das "Telefonbuch", das Domains in IP-Adressen uebersetzt |
| HTTP | HyperText Transfer Protocol | Web-Uebertragungsprotokoll (unsicher, Klartext) |
| HTTPS | HTTP Secure | Verschluesseltes Web-Uebertragungsprotokoll (sicher) |
| Nginx | Engine X | Hochleistungs-Webserver, hauefig als Reverse Proxy eingesetzt |
| Reverse Proxy | Reverse Proxy | Ein "Tuersteher", der Anfragen an das Backend weiterleitet |
| SSH | Secure Shell | Verschluesseltes Werkzeug fuer Remote-Login auf Servern |
| CDN | Content Delivery Network | Weltweit verteiltes Servernetzwerk fuer schnelleren Zugriff |
| CI/CD | Continuous Integration/Deployment | Automatisierte Pipeline: Nach Push wird automatisch getestet und bereitgestellt |
| SSL/TLS | Secure Sockets Layer / Transport Layer Security | Verschluesselungsprotokolle, die HTTPS Sicherheit bieten |
| PM2 | Process Manager 2 | Node.js-Prozessmanager, der Anwendungen dauerhaft am Laufen haelt |
