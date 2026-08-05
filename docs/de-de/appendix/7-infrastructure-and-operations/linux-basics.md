# Linux-Grundlagen: Betriebssystem

::: tip Vorwort
**In der Welt der Server ist Linux der absolute Protagonist.** Mehr als 90% aller Server weltweit laufen mit Linux - von dem WeChat, das du taeglich nutzt, bis zur Google-Suche, alles wird von Linux unterstuetzt. Als Entwickler ist Linux-Kenntnis keine Option, sondern Pflicht.
:::

**Was wirst du in diesem Artikel lernen?**

Nach diesem Kapitel wirst du Folgendes koennen:

- **Dateisystem**: Die Verzeichnisstruktur von Linux und die Philosophie "alles ist eine Datei" verstehen
- **Haeufige Befehle**: Dateioperationen, Textverarbeitung, Prozessverwaltung und andere Kernbefehle beherrschen
- **Berechtigungsmodell**: Die Konzepte von Benutzern, Gruppen und Berechtigungen verstehen
- **Shell-Grundlagen**: Pipes, Umleitung, Umgebungsvariablen und weitere Shell-Kernkonzepte kennenlernen
- **Praktische Faehigkeiten**: Log-Analyse, Prozess-Diagnose, Netzwerk-Fehlerbehebung und weitere Betriebs-Grundlagen erlernen

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | Dateisystem | Verzeichnisstruktur, alles ist eine Datei |
| **Kapitel 2** | Haeufige Befehle | Dateien, Text, Prozesse, Netzwerk |
| **Kapitel 3** | Berechtigungsmodell | Benutzer, Gruppen, rwx, sudo |
| **Kapitel 4** | Shell-Grundlagen | Pipes, Umleitung, Variablen, Skripte |
| **Kapitel 5** | Praktische Szenarien | Log-Analyse, Performance-Diagnose |

---

## 1. Dateisystem: Alles ist eine Datei

Eine der Kernphilosophien von Linux ist: **Alles ist eine Datei**. Normale Dateien sind Dateien, Verzeichnisse sind Dateien, Festplatten sind Dateien, sogar Netzwerkverbindungen und Prozessinformationen sind Dateien. Diese einheitliche Abstraktion ermoeglicht es, fast alle Systemressourcen mit denselben Werkzeugen zu bedienen (lesen, schreiben, Berechtigungen steuern).

<LinuxFileSystemDemo />

### Verzeichnisstruktur - Kurzuebersicht

Das Linux-Dateisystem kann man sich als einen auf den Kopf gestellten Baum vorstellen:

```
/                    <- Root-Verzeichnis (Wurzel)
├── home/            <- Benutzer-Verzeichnisse (deine Dateien liegen hier)
├── etc/             <- Konfigurationsdateien (das "Einstellungsfeld" des Systems)
├── var/             <- Variable Daten (Logs, Cache)
├── usr/             <- Vom Benutzer installierte Programme
├── tmp/             <- Temporaere Dateien (nach Neustart weg)
├── proc/            <- Prozessinformationen (virtuell, belegt keinen Speicher)
├── dev/             <- Geraetedateien (Festplatten, Terminals)
├── bin/             <- Grundlegende Befehle (ls, cp, mv)
├── sbin/            <- Systemverwaltungsbefehle (erfordert root)
├── opt/             <- Drittanbieter-Software
└── root/            <- Home-Verzeichnis des root-Benutzers
```

### Zwei Arten von Pfaden

| Typ | Format | Beispiel | Beschreibung |
|------|------|------|------|
| Absoluter Pfad | Beginnt bei `/` | `/home/alice/code/app.js` | Vom Root-Verzeichnis aus, eindeutig |
| Relativer Pfad | Vom aktuellen Verzeichnis | `./code/app.js` oder `../config` | `.` ist das aktuelle Verzeichnis, `..` das uebergeordnete |

::: tip Die Macht von "Alles ist eine Datei"
CPU-Informationen moechten? Datei lesen: `cat /proc/cpuinfo`
Speicherverbrauch moechten? Datei lesen: `cat /proc/meminfo`
Zufallszahlen generieren? Datei lesen: `cat /dev/urandom`
Ausgabe verwerfen? Datei schreiben: `echo "no thanks" > /dev/null`

Keine spezielle API noetig - Dateien lesen und schreiben genuegt. Das ist die Eleganz der Unix-Philosophie.
:::

---

## 2. Haeufige Befehle

Linux-Befehle folgen einem einheitlichen Format: `Befehl [Optionen] [Parameter]`. Zum Beispiel bei `ls -la /home` ist `ls` der Befehl, `-la` die Option und `/home` der Parameter.

<LinuxCommandDemo />

### Die 10 wichtigsten Befehle

Wenn du dir nur 10 Befehle merken kannst, dann diese:

| Befehl | Zweck | Eselsbruecke |
|------|------|----------|
| `ls` | Dateien auflisten | list |
| `cd` | Verzeichnis wechseln | change directory |
| `cat` | Datei anzeigen | concatenate |
| `grep` | Text suchen | global regular expression print |
| `find` | Dateien finden | einfach find |
| `ps` | Prozesse anzeigen | process status |
| `tail -f` | Logs in Echtzeit anzeigen | Datei-"Ende" anzeigen, -f steht fuer follow |
| `chmod` | Berechtigungen aendern | change mode |
| `curl` | HTTP-Anfragen senden | client URL |
| `ssh` | Remote-Login | secure shell |

### Die Kunst der Befehlskombination

Die Staerke von Linux liegt nicht in einzelnen Befehlen, sondern in der **Kombination von Befehlen**. Mit Pipes `|` koennen mehrere einfache Befehle verkettet werden, um komplexe Probleme zu loesen:

```bash
# Die 5 Prozesse mit dem hoechsten CPU-Verbrauch finden
ps aux --sort=-%cpu | head -6

# Die haeufigsten Fehlertypen im Log zaehlen
grep "ERROR" app.log | awk '{print $4}' | sort | uniq -c | sort -rn | head -10

# Dateien groesser als 100 MB finden
find / -size +100M -type f 2>/dev/null

# Fehler im Log in Echtzeit ueberwachen
tail -f /var/log/app.log | grep --color "ERROR"
```

::: tip Unix-Philosophie
"Mache eine Sache, und mache sie gut." Jeder Befehl ist nur fuer eine Funktion verantwortlich. Durch Kombination mit Pipes werden komplexe Operationen realisiert. Deshalb sind Linux-Befehle kurz und praegnant - sie sind Bausteine, kein Schweizer Taschenmesser.
:::

---

## 3. Berechtigungsmodell

Linux ist ein Mehrbenutzer-System, und das Berechtigungsmodell ist das Fundament der Sicherheit. Jede Datei hat drei Berechtigungsgruppen, die kontrollieren, was der **Eigentuemer (Owner)**, die **Gruppe (Group)** und **Andere (Others)** tun duerfen.

### Die Ausgabe von `ls -l` verstehen

```bash
$ ls -l app.js
-rwxr-xr-- 1 alice developers 2048 Jan 15 10:30 app.js
|├──┤├──┤├──┤   │     │          │
| │   │   │     │     │          └── Dateigroesse
| │   │   │     │     └── Gruppe
| │   │   │     └── Eigentuefaer
| │   │   └── Berechtigungen fuer Andere: r-- (nur Lesen)
| │   └── Gruppenberechtigungen: r-x (Lesen + Ausfuehren)
| └── Eigentuefaer-Berechtigungen: rwx (Lesen + Schreiben + Ausfuehren)
└── Dateityp: - Normale Datei, d Verzeichnis, l Link
```

### Drei Berechtigungsoperationen

| Berechtigung | Buchstabe | Zahl | Bedeutung fuer Dateien | Bedeutung fuer Verzeichnisse |
|------|------|------|-------------|-------------|
| Lesen | `r` | 4 | Dateiinhalt anzeigen | Verzeichnisinhalt auflisten (ls) |
| Schreiben | `w` | 2 | Dateiinhalt aendern | Dateien im Verzeichnis erstellen/loeschen |
| Ausfuehren | `x` | 1 | Programm/Skript ausfuehren | Verzeichnis betreten (cd) |

<LinuxPermissionsDemo />

### Numerische Berechtigungen schnell berechnen

Drei Zahlen repraesentieren die Berechtigungen von Owner, Group und Others. Jede Zahl ist die Summe aus r(4) + w(2) + x(1):

```
chmod 755 script.sh
  7 = rwx (4+2+1)  -> Eigentuefaer: Lesen + Schreiben + Ausfuehren
  5 = r-x (4+0+1)  -> Gruppe: Lesen + Ausfuehren
  5 = r-x (4+0+1)  -> Andere: Lesen + Ausfuehren
```

| Haeufige Berechtigung | Bedeutung | Typische Verwendung |
|---------|------|---------|
| `644` | rw-r--r-- | Normale Dateien (Eigentuefaer darf schreiben, andere nur lesen) |
| `755` | rwxr-xr-x | Ausfuehrbare Dateien/Verzeichnisse |
| `600` | rw------- | Vertrauliche Dateien (z. B. SSH-Schluessel) |
| `777` | rwxrwxrwx | Jeder darf alles (gefaehrlich, vermeiden!) |

### sudo: Temporaer Superuser-Rechte erlangen

Normale Benutzer haben eingeschraenkte Rechte. Manche Operationen erfordern root-Berechtigungen. `sudo` ermoeglicht es, Befehle temporaer als root auszufuehren:

```bash
# Normaler Benutzer kann Systemkonfiguration nicht aendern
$ vim /etc/nginx/nginx.conf
# Permission denied

# Mit sudo temporaer erhoehen
$ sudo vim /etc/nginx/nginx.conf
# Nach Eingabe des Passworts kann bearbeitet werden

# Zum root-Benutzer wechseln (mit Vorsicht verwenden)
$ sudo su -
```

::: warning Prinzip der minimalen Berechtigungen
Verwende niemals `chmod 777` als Loesung fuer Berechtigungsprobleme - das entspricht dem Ausbau des Tuerschlosses. Die richtige Vorgehensweise: Herausfinden, wer welche Berechtigungen braucht, und diese praezise gewaehren. Ebenso sollte man nicht dauerhaft als root arbeiten, sondern `sudo` nur bei Bedarf nutzen.
:::

---

## 4. Shell-Grundlagen

Die Shell ist der "Dolmetscher" zwischen dir und dem Linux-Kernel. Du gibst Befehle ein, die Shell interpretiert sie und leitet sie an den Kernel weiter. Die haeufigsten Shells sind **Bash** (Standard auf den meisten Linux-Distributionen) und **Zsh** (Standard auf macOS).

### Pipes und Umleitung

Das sind die zwei maechtigsten Features der Shell:

| Symbol | Name | Funktion | Beispiel |
|------|------|------|------|
| `|` | Pipe | Ausgabe des vorherigen Befehls als Eingabe des naechsten verwenden | `cat log | grep ERROR` |
| `>` | Ausgabeumleitung | Ausgabe in Datei schreiben (ueberschreiben) | `echo "hello" > file.txt` |
| `>>` | Anhaengenumleitung | Ausgabe am Dateiende anhaengen | `echo "world" >> file.txt` |
| `<` | Eingabeumleitung | Eingabe aus Datei lesen | `wc -l < file.txt` |
| `2>` | Fehlerumleitung | Fehlermeldung in Datei schreiben | `cmd 2> error.log` |
| `2>&1` | Ausgabe zusammenfuehren | Fehler- und Standardausgabe kombinieren | `cmd > all.log 2>&1` |

### Umgebungsvariablen

Umgebungsvariablen sind die "globalen Konfigurationen" der Shell und beeinflussen das Verhalten von Befehlen:

```bash
# Alle Umgebungsvariablen anzeigen
env

# Eine bestimmte Variable anzeigen
echo $PATH
echo $HOME

# Temporaer setzen (nur in der aktuellen Shell gueltig)
export API_KEY="abc123"

# Dauerhaft setzen (in Konfigurationsdatei schreiben)
echo 'export API_KEY="abc123"' >> ~/.bashrc
source ~/.bashrc   # Konfiguration sofort wirksam machen
```

| Haeufige Variable | Bedeutung | Beispielwert |
|---------|------|--------|
| `$PATH` | Suchpfade fuer Befehle | `/usr/local/bin:/usr/bin:/bin` |
| `$HOME` | Benutzer-Home-Verzeichnis | `/home/alice` |
| `$USER` | Aktueller Benutzername | `alice` |
| `$PWD` | Aktuelles Arbeitsverzeichnis | `/var/log` |
| `$SHELL` | Aktuell verwendete Shell | `/bin/bash` |

### Shell-Skript-Einfuehrung

Mehrere Befehle in eine Datei schreiben ergibt ein Shell-Skript. Es ist der Einstieg in die automatisierte Systemadministration:

```bash
#!/bin/bash
# deploy.sh - Ein einfaches Deployment-Skript

APP_DIR="/opt/myapp"
LOG_FILE="/var/log/deploy.log"

echo "$(date) - Deployment starten..." >> $LOG_FILE

# Neuesten Code herunterladen
cd $APP_DIR && git pull origin main

# Abhaengigkeiten installieren
npm install --production

# Service neu starten
pm2 restart myapp

echo "$(date) - Deployment abgeschlossen" >> $LOG_FILE
```

```bash
# Skript ausfuehrbar machen und starten
chmod +x deploy.sh
./deploy.sh
```

::: tip Skript-Debugging-Tipp
Am Anfang des Skripts `set -ex` hinzufuegen: `-e` laesst das Skript bei Fehlern sofort abbrechen (statt weiterzumachen), `-x` gibt jeden ausgefuehrten Befehl aus (erleichtert die Fehlersuche). Diese beiden Optionen sind in Produktivskripten quasi Standard.
:::

---

## 5. Praktische Szenarien

Die Theorie ist abgeschlossen. Nun zu einigen der haeufigsten Praxis-Szenarien in der Entwicklung.

### 5.1 Log-Analyse

Wenn ein Service Probleme hat, ist die erste Reaktion: Logs pruefen. Hier sind die haeufigsten Muster fuer die Log-Analyse:

```bash
# 1. Logs in Echtzeit verfolgen (am haeufigsten verwendet)
tail -f /var/log/app/error.log

# 2. Fehler in einem bestimmten Zeitraum suchen
grep "2024-01-15 14:" error.log | grep "ERROR"

# 3. Fehler pro Stunde zaehlen
grep "ERROR" app.log | awk '{print substr($1,1,13)}' | uniq -c

# 4. Die letzten 100 Zeilen des Logs anzeigen
tail -100 app.log

# 5. In mehreren Log-Dateien suchen
grep -r "OutOfMemory" /var/log/app/
```

### 5.2 Prozess-Diagnose

Anwendungen haengen, CPU steigt rasant, Speicherlecks - all diese Probleme muessen auf Prozessebene analysiert werden:

```bash
# Prozesse mit dem hoechsten CPU-Verbrauch anzeigen
ps aux --sort=-%cpu | head -10

# Prozesse mit dem hoechsten Speicherverbrauch anzeigen
ps aux --sort=-%mem | head -10

# Einen bestimmten Prozess suchen
ps aux | grep "node"

# Detaillierte Prozessinformationen anzeigen (inklusive Threads)
top -Hp <PID>

# Offene Dateien eines Prozesses anzeigen
lsof -p <PID>

# Prozess elegant beenden (SIGTERM)
kill <PID>

# Prozess erzwungen beenden (SIGKILL, letztes Mittel)
kill -9 <PID>
```

### 5.3 Netzwerk-Diagnose

Service nicht erreichbar? Zunaechst klaeren: Netzwerkproblem oder Anwendungsproblem?

```bash
# Erreichbarkeit testen
ping -c 4 google.com

# Pruefen, ob ein Port offen ist
telnet db-server 3306
# oder mit nc
nc -zv db-server 3306

# Lokal abhoerte Ports anzeigen
ss -tlnp
# oder
netstat -tlnp

# DNS-Aufloesung pruefen
dig api.example.com
nslookup api.example.com

# HTTP-Endpunkt testen
curl -v http://localhost:3000/health

# Netzwerkverbindungsstatistik anzeigen
ss -s
```

### 5.4 Festplattenplatz-Analyse

Eine volle Festplatte ist einer der haeufigsten Ausfaelle im Produktivbetrieb:

```bash
# Partitionsauslastung anzeigen
df -h

# Die groessten Verzeichnisse finden
du -sh /* 2>/dev/null | sort -rh | head -10

# Weiter eingrenzen
du -sh /var/log/* | sort -rh | head -10

# Grosse Dateien finden (>100 MB)
find / -type f -size +100M 2>/dev/null | head -20

# Haeufige Speicherfresser aufraeumen
# Alte Logs bereinigen
sudo journalctl --vacuum-size=500M
# Unbenutzte Docker-Images entfernen
docker system prune -a
```

::: tip Produktiv-Faustregel
**"Erst Logs, dann Prozesse, dann Netzwerk, dann Festplatte."** 90% aller Produktivprobleme lassen sich mit diesen vier Schritten auf die Ursache zurueckfuehren. Wenn man sich diese Reihenfolge angewoehnt hat, steigt die Analyse-Effizienz massiv.
:::

---

## Zusammenfassung

Linux ist eine unverzichtbare Faehigkeit fuer Entwickler. Die Beherrschung der Grundlagen reicht aus, um die meisten taeglichen Entwicklungs- und Betriebsszenarien zu bewaeltigen.

Die wichtigsten Punkte dieses Kapitels:

1. **Alles ist eine Datei**: Linux nutzt die Datei-Abstraktion fuer einen einheitlichen Zugriff auf Hardware, Prozesse, Netzwerke und andere Ressourcen
2. **Befehlskombination**: Einzelne Befehle sind einfach, aber durch Pipes `|` kombiniert entfalten sie ihre wahre Kraft
3. **Berechtigungsmodell**: Owner/Group/Others x Read/Write/Execute, mit Zahlen (z. B. 755) schnell einstellen
4. **Shell-Grundlagen**: Pipes, Umleitung, Umgebungsvariablen und Skripte sind das Fundament der Automatisierung
5. **Praktische Fehlerbehebung**: Logs -> Prozesse -> Netzwerk -> Festplatte, vier Schritte zur Lokalisierung der meisten Produktivprobleme

## Weiterfuehrende Literatur

- [Linux Man Pages](https://man7.org/linux/man-pages/) - Offizielle Linux-Befehlsreferenz
- [The Linux Command Line](https://linuxcommand.org/tlcl.php) - Kostenloses Einsteigerbuch fuer die Linux-Kommandozeile
- [Linux Journey](https://linuxjourney.com/) - Interaktive Linux-Lernplattform
- [explainshell.com](https://explainshell.com/) - Befehl eingeben und automatisch die Bedeutung jedes Parameters erklaert bekommen
