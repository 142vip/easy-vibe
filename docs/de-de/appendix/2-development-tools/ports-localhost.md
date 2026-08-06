# Ports und Localhost: Netzwerkgrundlagen

> 💡 **Lernleitfaden**: Wenn du `npm run dev` ausführst und im Terminal `http://localhost:5173` erscheint, hast du dich dann schon einmal gefragt: Was ist `localhost`? Wofür steht `5173`? Warum meldet es manchmal den Fehler `EADDRINUSE`? Dieses Kapitel erklärt dir diese Konzepte, die dir in der täglichen Entwicklung ständig begegnen, aber über die du selten tiefer nachdenkst, ein für alle Mal.

Bevor du beginnst, empfehle ich dir, diese zwei „Grundbausteine" nachzuholen:

- **Netzwerkgrundlagen**: Wenn du mit IP-Adressen und HTTP noch nicht vertraut bist, lies zuerst [Computergrundlagen – Netzwerkkommunikation](../1-computer-fundamentals/network-fundamentals.md).
- **Terminalgrundlagen**: Wenn du mit der Kommandozeile noch nicht vertraut bist, lies zuerst [Kommandozeile und Shell: Grundlagen](./command-line-shell.md).

---

## 0. Einleitung: Überblick über genau ist das alltägliche `localhost:5173`

<DevServerFlowDemo />

Kein Entwickler kommt an dieser Ausgabezeile vorbei:

```
➜  Local:   http://localhost:5173/
```

Aber hast du dich schon einmal gefragt, dass in dieser kurzen Zeile mehrere Schlüsselkonzepte stecken:

- **http://** -> Kommunikationsprotokoll (in welcher Sprache kommuniziert wird)
- **localhost** -> Zieladresse (mit wem kommuniziert wird)
- **:5173** -> Portnummer (an welche Tür geklopft wird)

Wenn du diese drei Dinge verstehst, verstehst du 90 % aller Netzwerkprobleme in der Entwicklungsumgebung. Lasst sie uns einzeln auseinandernehmen.

---

## 1. Überblick über Port (IP ist das Gebäude, Port ist die Zimmernummer)


### 1.1 Eine intuitive Analogie

Stell dir einen Server als ein großes Gebäude vor:

- Die **IP-Adresse** (z. B. `192.168.1.100`) ist die Hausnummer des Gebäudes – sie sagt dir, „in welches Gebäude".
- Die **Portnummer** (z. B. `:80`) ist die Zimmernummer im Gebäude – sie sagt dir, „in welches Zimmer".

In einem Gebäude kann es gleichzeitig ein Restaurant (Zimmer 80), ein Cafe (Zimmer 443) und ein Buero (Zimmer 22) geben. Genauso kann auf einem Computer gleichzeitig ein Webserver, eine Datenbank und ein SSH-Dienst laufen – jeder auf einem anderen Port.

👇 **Probiere es aus**:
Klicke auf die „Zimmernummern" unten, um Verbindungen zu verschiedenen Ports zu simulieren. Beobachte, was passiert, wenn ein Port „offen" (ein Programm lauscht) oder „geschlossen" ist.

<PortAnalogyDemo />

### 1.2 Wertebereich der Portnummern

Portnummern sind ganze Zahlen zwischen **0 und 65535** (insgesamt 65.536). Diese vielen Ports sind in drei Bereiche unterteilt:

| Bereich | Spanne | Verwendung | Beispiele |
| :--- | :--- | :--- | :--- |
| **System-Ports** | 0 – 1023 | Reserviert für Standardprotokolle, normale Benutzer können sie nicht belegen | 80 (HTTP), 443 (HTTPS), 22 (SSH) |
| **Registrierte Ports** | 1024 – 49151 | Zur Registrierung durch gängige Anwendungen | 3306 (MySQL), 5432 (PostgreSQL), 6379 (Redis) |
| **Dynamische Ports** | 49152 – 65535 | Temporär vom Betriebssystem zugewiesen | Der Browser weist beim Senden einer Anfrage zufällig einen Quellport zu |

> Warum nutzen deine Entwicklungsserver gerne 3000, 5173, 8080? Weil diese alle im Bereich der „registrierten Ports" liegen, keine Administratorrechte zum Lauschen erfordern und gleichzeitig weniger wahrscheinlich mit Systemdiensten kollidieren.

### 1.3 Schnellübersicht gängiger Ports in der Entwicklung

👇 **Probiere es aus**:
Gib eine Portnummer oder einen Dienstnamen für die Suche ein. Klicke auf eine Zeile, um Anwendungsbeispiele anzuzeigen.

<CommonPortsDemo />

---

## 2. Überblick über localhost (Sich selbst finden)


### 2.1 Das Kernkonzept des „Loopbacks"

`localhost` ist ein spezieller Domainname, der immer auf **deinen eigenen Computer** verweist.

Wenn du `http://localhost:3000` in den Browser eingibst, passiert Folgendes:

1. Der Browser fragt das Betriebssystem: „Wie lautet die IP von `localhost`?"
2. Das Betriebssystem antwortet direkt: „`127.0.0.1`" (kein DNS im Internet nötig)
3. Das Datenpaket wird an `127.0.0.1` gesendet, verlässt aber **nie tatsächlich den Rechner**
4. Das Betriebssystem schickt das Datenpaket über das **Loopback-Interface** zurück
5. Das auf Port 3000 lauschende Programm empfängt die Anfrage und sendet die Antwort

**Der gesamte Prozess geht nicht ueber ein Netzwerkkabel, keinen Router und benötigt keine Internetverbindung.**

👇 **Probiere es aus**:
Klicke auf „Anfrage senden", um die vollständige Reise des Datenpakets zu beobachten. Klicke dann auf die „Alias-Karten" unten, um die verschiedenen Schreibweisen und Unterschiede von localhost kennenzulernen.

<LocalhostLoopbackDemo />

### 2.2 `localhost` vs. `127.0.0.1` vs. `0.0.0.0`

Diese drei Konzepte werden oft verwechselt, haben aber völlig unterschiedliche Bedeutungen:

| Schreibweise | Bedeutung | Wer kann zugreifen |
| :--- | :--- | :--- |
| `localhost` / `127.0.0.1` | Loopback-Adresse, nur der eigene Rechner | Nur dein eigener Computer |
| `0.0.0.0` | Lauscht auf allen Netzwerkschnittstellen | Eigener Rechner + andere Geräte im LAN |
| `192.168.x.x` | LAN-IP-Adresse | Geräte im lokalen Netzwerk |

**Praktisches Szenario**:

```bash
# Nur du selbst kannst zugreifen (sicher, geeignet für Entwicklung)
npm run dev -- --host localhost

# Auch das Handy kann zugreifen (geeignet für Mobile-Debugging)
npm run dev -- --host 0.0.0.0
```

> Viele Frameworks (wie Vite, Next.js) lauschen standardmäßig auf `localhost`, sodass dein Handy selbst im gleichen WLAN nicht zugreifen kann. Du willst mit dem Handy debuggen? Füge einfach den Parameter `--host` hinzu.

---

## 3. Portkonflikte: Das häufigste Problem in der Entwicklungsumgebung

### 3.1 Warum kommt es zu Konflikten

**Ein einzelner Port kann zur gleichen Zeit nur von einem Programm belauscht werden.** Genau wie ein Zimmer nur von einer Familie bewohnt werden kann.

Wenn du versuchst, einen zweiten Dienst auf demselben Port zu starten, siehst du diesen klassischen Fehler:

```
Error: listen EADDRINUSE :::3000
```

In menschliche Sprache uebersetzt: **„Zimmer 3000 ist bereits belegt, du kommst nicht rein!"**

Häufige Konfliktszenarien:
- Der vorherige Entwicklungsserver wurde nicht sauber beendet und läuft noch im Hintergrund
- Zwei verschiedene Projekte verwenden denselben Standardport
- Ein Systemdienst belegt bereits den von dir gewünschten Port

👇 **Probiere es aus**:
Versuche, im untenstehenden Simulator mehrmals einen Dienst zu starten. Vergleiche bei einem Portkonflikt die unterschiedlichen Verhaltensweisen von „Direktstart" und „Intelligentem Start".

<PortConflictDemo />

### 3.2 Fehlersuche und Lösung

Wenn du auf einen Portkonflikt stößt, ist der Ablauf zur Fehlersuche immer gleich:

**macOS / Linux:**
```bash
# Schritt 1: Ermitteln, wer Port 3000 belegt
lsof -i :3000

# Schritt 2: PID aus Schritt 1 nehmen und den Prozess hart beenden
kill -9 <PID>
```

**Windows:**
```bash
# Schritt 1: Ermitteln, wer Port 3000 belegt
netstat -ano | findstr :3000

# Schritt 2: Prozess beenden
taskkill /PID <PID> /F
```

> Viele moderne Frameworks (Vite, Create React App usw.) fragen bei Portkonflikten automatisch: „Anderen Port verwenden?" Aber wenn du das zugrunde liegende Prinzip verstehst, kannst du Probleme schneller diagnostizieren, bei denen dir das Framework nicht helfen kann.

---

## 4. Die „Same-Origin Policy" und Cross-Origin in der Entwicklung

### 4.1 Was ist ein „Origin"

Browser haben einen Sicherheitsmechanismus namens **Same-Origin Policy**: Nur wenn **Protokoll, Domain und Port** alle drei vollständig identisch sind, gilt es als „same origin".

| Adresse A | Adresse B | Same Origin? | Grund |
| :--- | :--- | :--- | :--- |
| `http://localhost:5173` | `http://localhost:5173/about` | ✅ Same Origin | Protokoll, Domain, Port alle gleich |
| `http://localhost:5173` | `http://localhost:3000` | ❌ Cross-Origin | **Port unterschiedlich** (5173 vs. 3000) |
| `http://localhost:5173` | `https://localhost:5173` | ❌ Cross-Origin | **Protokoll unterschiedlich** (http vs. https) |

### 4.2 Warum stößt die Trennung von Frontend und Backend zwangsläufig auf Cross-Origin

Wenn deine Projektarchitektur so aussieht:

```
Frontend (Vite)   ->  http://localhost:5173
Backend (Express) ->  http://localhost:3000
```

Die Frontend-Seite wird von `:5173` geladen und verwendet dann `fetch('/api/users')`, um die API unter `:3000` anzufragen – **die Ports sind unterschiedlich, die Cross-Origin-Beschränkung greift!**

**Zwei gängige Lösungen:**

**Lösung 1: CORS im Backend konfigurieren**
```javascript
// Express Backend
app.use(cors({ origin: 'http://localhost:5173' }))
```

**Lösung 2: Proxy im Frontend konfigurieren (empfohlen)**
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```

Das Prinzip des Proxys: Der Vite-Entwicklungsserver leitet deine Anfragen weiter. Der Browser denkt, er kommuniziert mit `:5173` (same origin), tatsächlich leitet Vite die Anfrage im Hintergrund heimlich an `:3000` weiter.

---

## 5. Praktische Fehlersuche: Die drei häufigsten Probleme

👇 **Probiere es aus**:
Wähle ein Problem, das du schon einmal hattest, und folge den Schritten zur Fehlersuche. Jeder Schritt kann durch Klicken auf „Ausführen" angezeigt werden.

<PortTroubleshootDemo />

---

## 6. Begriffsglossar

| Englischer Begriff | Deutsche Entsprechung | Erklärung |
| :--- | :--- | :--- |
| **Port** | Port | Eine Zahl zwischen 0 und 65535 zur Unterscheidung verschiedener Netzwerkdienste auf demselben Rechner. Jeder Dienst „lauscht" auf einem Port und wartet auf Client-Verbindungen. |
| **localhost** | Lokaler Host | Ein spezieller Domainname, der immer auf den eigenen Rechner (127.0.0.1) verweist. Ermöglicht den Zugriff auf lokal laufende Dienste ohne Internetverbindung. |
| **Loopback Interface** | Loopback-Schnittstelle | Die virtuelle Netzwerkschnittstelle des Betriebssystems. Datenpakete an 127.0.0.1 verlassen den Rechner nicht, sondern werden über diese Schnittstelle „zurückgeschickt". |
| **EADDRINUSE** | Adresse bereits verwendet | Ein von Node.js / dem Betriebssystem gemeldeter Fehler: Der gewünschte Port wird bereits von einem anderen Programm belegt. |
| **CORS** | Cross-Origin Resource Sharing | Ein Browser-Sicherheitsmechanismus. Wenn eine Frontend-Seite versucht, eine API mit anderem Origin (Protokoll/Domain/Port) anzufragen, benötigt sie eine ausdrückliche Erlaubnis vom Backend. |
| **Same-Origin Policy** | Same-Origin-Policy | Die Sicherheitsgrundlage des Browsers: Erlaubt nur freie Kommunikation zwischen Anfragen mit gleichem Protokoll, gleicher Domain und gleichem Port – blockiert Cross-Origin-Datenzugriffe. |
| **Proxy** | Proxy | In der Entwicklungsumgebung leitet der Proxy-Server Anfragen stellvertretend für den Browser an das Backend weiter und umgeht so die Same-Origin-Beschränkung. |
| **0.0.0.0** | Alle Schnittstellen | Wenn ein Dienst auf 0.0.0.0 lauscht, akzeptiert er Verbindungen von allen Netzwerkschnittstellen (eigener Rechner, LAN usw.). |
| **Well-known Ports** | Bekannte Ports | Sammelbezeichnung für die Ports 0–1023, reserviert für Standardprotokolle wie HTTP (80), HTTPS (443), SSH (22). |
| **PID** | Prozess-ID | Eine eindeutige Nummer, die das Betriebssystem jedem laufenden Programm zuweist, zur Verwaltung und Beendigung von Prozessen. |
| **lsof** | Liste offener Dateien | macOS/Linux-Befehl, um zu ermitteln, welcher Prozess einen bestimmten Port belegt (`lsof -i :Portnummer`). |
| **HMR** | Hot Module Replacement | Funktion des Entwicklungsservers: Wenn du Code änderst, aktualisiert sich der Browser automatisch, ohne manuelles Neuladen. Benachrichtigt den Browser im Hintergrund per WebSocket. |

---

## Zusammenfassung

Ports und localhost sind die grundlegendsten und häufigsten Konzepte in der Entwicklungsumgebung:

- **Port** = Die „Zimmernummer" zur Unterscheidung verschiedener Dienste auf einem Rechner (0–65535)
- **localhost** = Die spezielle Adresse „sich selbst finden" (127.0.0.1), Daten verlassen den Rechner nicht
- **Portkonflikt** bedeutet im Kern: „Ein Türschild kann nur ein Namensschild tragen"
- **Cross-Origin** bedeutet im Kern: „Unterschiedlicher Port = unterschiedlicher Origin", erfordert CORS oder Proxy zur Lösung

Merke dir diese vier Sätze, und du kannst die meisten Netzwerkprobleme in deiner Entwicklungsumgebung schnell diagnostizieren.