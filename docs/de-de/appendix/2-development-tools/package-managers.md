# Paketmanager: Abhängigkeitsverwaltung

> 💡 **Lernleitfaden**: Beim Codieren muss man das Rad nicht neu erfinden — 99 % der Funktionen wurden bereits von jemand anderem geschrieben und im Internet veroffentlicht. Der **Paketmanager** ist das Werkzeug, das Ihnen hilft, diese "fertigen Bauteile" zu finden, herunterzuladen und zu verwalten. Dieses Kapitel dreht sich um eine Kernfrage: **Wie macht man Code-Abhangigkeiten reproduzierbar, kollaborativ und wartbar?**

---

## 0. Warum werden Sie unweigerlich einen Build-Artefaktmanager brauchen

Stellen Sie sich vor, Sie mochten ein Node.js-Programm schreiben, das HTTP-Anfragen sendet. Zwei Wege:

- **Methode A (manuell)**: TCP-Verbindung, HTTP-Protokoll-Analyse, Redirect-Behandlung, Timeout-Mechanismen selbst implementieren... wahrscheinlich Tausende Codezeilen und Monate Debugging.
- **Methode B (Paketmanager)**: `npm install axios`, zehn Sekunden, eine Zeile Code.

Ein Paketmanager ist im Wesentlichen der **"App Store" fur Code**. Er hilft Ihnen:

1. in einem zentralen Repository (Registry) von anderen veroffentlichte Bibliotheken zu finden
2. diese automatisch herunterzuladen und in Ihr Projekt zu installieren
3. die Abhangigkeiten dieser Bibliotheken selbst (Abhangigkeiten von Abhangigkeiten) zu behandeln
4. die von Ihnen verwendete genaue Version zu protokollieren, um Probleme bei der Teamarbeit zu vermeiden

---

## 1. Build-Artefaktmanager der verschiedenen Sprachen/Systeme im Uberblick

Verschiedene Programmiersprachen und Betriebssysteme haben ihre eigenen Okosystem-Toolchains, aber die zugrundeliegende Logik ist identisch.

👇 **Probieren Sie es aus**: Wahlen Sie ein Ihnen vertrautes Okosystem und erkunden Sie seine wichtigsten Paketverwaltungswerkzeuge.

<PackageManagerOverviewDemo />

### 1.1 Quellen für Build-Artefakte — Registry

Hinter jedem Okosystem steht ein zentrales Repository, das alle herunterladbaren Pakete speichert:

| Okosystem | Registry | Anzahl Pakete |
| :--- | :--- | :--- |
| JavaScript | [npmjs.com](https://npmjs.com) | 2 Mio.+ |
| Python | [pypi.org](https://pypi.org) | 500 Tsd.+ |
| Rust | [crates.io](https://crates.io) | 150 Tsd.+ |
| Go | [pkg.go.dev](https://pkg.go.dev) | 500 Tsd.+ |
| macOS/Linux-Tools | [formulae.brew.sh](https://formulae.brew.sh) | 7.000+ |
| Windows-Software | [winget.run](https://winget.run) / [chocolatey.org](https://chocolatey.org) | Zehntausende |

### 1.2 JavaScript-Dreiervergleich: npm vs yarn vs pnpm

Ähnliche Funktionalitat, Unterschiede hauptsachlich bei **Geschwindigkeit und Speicherbedarf**:

```text
Speicherbedarf: pnpm (Hardlinks geteilt) < yarn PnP (kein node_modules) < npm (vollstandige Kopie)
Installationsgeschwindigkeit: pnpm ≈ yarn > npm
Nutzerfahrung: npm (am weitesten verbreitet) > pnpm (fur neue Projekte empfohlen) > yarn (einige Teams)
```

**Empfehlung**: Neue Projekte mit `pnpm`, bestehende Projekte beim bisherigen Tool belassen, nicht grundlos wechseln.

### 1.3 Windows-Dreiervergleich: winget vs Chocolatey vs Scoop

| | winget | Chocolatey | Scoop |
| :--- | :--- | :--- | :--- |
| **Offizielle Unterstutzung** | Microsoft offiziell | Drittanbieter | Drittanbieter |
| **Admin-Rechte erforderlich** | teilweise | Ja | **Nein** |
| **Passendes Szenario** | Alltägliche Software-Installation | Unternehmensweite Massenbereitstellung | Entwicklertools-Verwaltung |
| **Anzahl Pakete** | Viele, schnell wachsend | Am meisten (10.000+) | Fokus auf Entwicklertools |

**Empfehlung**: Alltag `winget`, Entwicklertools `scoop`, Unternehmensautomatisierung `Chocolatey`.

---

## 2. Build-Artefaktinstallation — Was passiert im Hintergrund

Nach der Eingabe von `npm install axios` ist die Kommandozeile einige Sekunden still und dann fertig. Was passiert in diesen Sekunden?

👇 **Probieren Sie es aus**: Wahlen Sie ein Paket, klicken Sie auf "Ausfuhren" und beobachten Sie den gesamten Installationsprozess.

<PackageInstallDemo />

### 2.1 Die vier Phasen im Detail

**① Abhangigkeitsauflosung (Resolve)**

Der Paketmanager liest zunachst, was installiert werden soll. Am Beispiel `axios`: Es hangt selbst von Paketen wie `follow-redirects`, `form-data` usw. ab, die ebenfalls installiert werden mussen. Dieser Prozess heißt **Abhangigkeitsbaum aufbauen**.

**② Herunterladen (Fetch)**

Alle bentigten Pakete werden aus der Registry heruntergeladen (`.tgz`-komprimierte Archive). Ein kluger Paketmanager:
- ladet mehrere Pakete parallel herunter, anstatt sequenziell zu warten
- pruft zuerst den lokalen Cache und vermeidet bei Treffern den Netzwerkzugriff

**③ Verknupfen (Link)**

Die heruntergeladenen Pakete werden entpackt und im Verzeichnis `node_modules/` abgelegt, wobei die Verweisbeziehungen hergestellt werden.

**④ Lockfile schreiben (Lockfile)**

Die **genauen Versionsnummern** dieser Installation werden in `package-lock.json` (oder `yarn.lock` / `pnpm-lock.yaml`) geschrieben.

### 2.2 Haufig verwendete Befehle — Schnellreferenz

```bash
# ── JavaScript (npm) ──────────────────────────────────
npm install              # Alle Abhangigkeiten laut package.json installieren
npm install axios        # Neues Paket installieren (Produktionsabhangigkeit)
npm install -D jest      # Entwicklungsabhangigkeit installieren (nur fur Entwicklung)
npm install -g tsx       # Global installieren (uberall verfugbar)
npm uninstall axios      # Paket deinstallieren
npm update               # Alle Pakete auf neueste kompatible Version aktualisieren
npm run build            # Skript aus package.json scripts ausfuhren
npx create-react-app .   # Einmalig ausfuhren, nicht im Projekt installieren

# ── Python (pip) ──────────────────────────────────────
pip install requests           # Paket installieren
pip install requests==2.28.0   # Bestimmte Version installieren
pip freeze > requirements.txt  # Aktuelle Abhangigkeitsliste exportieren
pip install -r requirements.txt # Gemäß Liste installieren

# ── Rust (cargo) ──────────────────────────────────────
cargo add serde    # Abhangigkeit hinzufugen (aktualisiert automatisch Cargo.toml)
cargo build        # Projekt erstellen
cargo test         # Tests ausfuhren
cargo run          # Projekt ausfuhren

# ── Go (go mod) ───────────────────────────────────────
go get github.com/gin-gonic/gin  # Abhangigkeit hinzufugen
go mod tidy                      # Abhangigkeiten bereinigen (Uberflussige entfernen, fehlende erganzen)
go build ./...                   # Erstellen

# ── Windows (winget) ──────────────────────────────────
winget install Git.Git           # Software installieren
winget upgrade --all             # Alle installierten Programme aktualisieren
```

### 2.3 Was sind npm scripts

In `package.json` gibt es ein Feld `scripts` — das ist der in npm integrierte **Task-Runner**:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "jest",
    "lint": "eslint src/"
  }
}
```

Ausfuhren mit: `npm run dev`, `npm run build`. Vorteile:
- **Einheitlicher Einstiegspunkt**: Teammitglieder mussen sich keine spezifischen Befehle der zugrundeliegenden Tools merken
- **Automatische Umgebungskonfiguration**: Bei der Ausfuhrung wird `node_modules/.bin` automatisch zum PATH hinzugefugt

---

## 3. Globale vs. lokale Installation

Eines der verwirrendsten Konzepte fur Anfanger.

### 3.1 Der Unterschied

```bash
npm install axios        # Lokal: in ./node_modules/, nur fur das aktuelle Projekt
npm install -g typescript  # Global: im Systemverzeichnis, fur alle Projekte/Verzeichnisse
```

| | Lokale Installation | Globale Installation |
| :--- | :--- | :--- |
| **Speicherort** | `./node_modules/` | Systemverzeichnis (z.B. `/usr/local/lib/`) |
| **Geeignet fur** | Projektabhangigkeiten (axios, vue, react) | CLI-Tools (tsc, eslint, create-react-app) |
| **Versionsisolierung** | Jedes Projekt eigene Version ✅ | Systemweit eine Version ⚠️ |
| **Teamkonsistenz** | Lockfile gewahrleistet Konsistenz ✅ | Verschiedene Versionen pro Person ⚠️ |

### 3.2 Die goldene Regel

> **Bibliotheksabhangigkeiten (axios, lodash, vue) immer lokal installieren;
> CLI-Tools (tsc, eslint) bevorzugt lokal installieren und mit `npx` aufrufen.**

**Warum auch fur CLI-Tools lokale Installation empfohlen wird?**

Angenommen, Sie haben global `eslint@8` installiert, aber Projekt A bentigt die neuen Regeln von `eslint@9`. Sie mussten dann zwischen globaler und Projektebene hin- und herschalten. Wenn Sie `eslint` lokal installieren und mit `npx eslint .` aufrufen, kann jedes Projekt seine eigene Version unabhangig konfigurieren.

### 3.3 npx — Einmalig ausfuhren ohne Umweltverschmutzung

`npx` ist der in npm integrierte Paket-Runner, mit dem Sie ein Paket **ohne Installation direkt ausfuhren** konnen:

```bash
# create-vue nicht installieren, direkt ausfuhren um Projekt zu initialisieren
npx create-vue my-project

# prettier nicht installieren, direkt Dateien formatieren
npx prettier --write src/

# Bestimmte Version erzwingen (installierte ignorieren)
npx typescript@5.4 tsc --version
```

Auch Pythons `uvx` und Rusts `cargo run` bieten ahnliche "Einmal-Ausfuhrung"-Fahigkeiten:

```bash
uvx ruff check .       # Python: ruff-Checker einmalig ausfuhren
cargo install ripgrep  # Rust: global installieren, wird zum Systembefehl rg
```

---

## 4. Das Geheimnis der Versionsnummern — Semantische Versionierung

In Ihrer `package.json` sehen Sie vielleicht Folgendes:

```json
{
  "dependencies": {
    "axios": "^1.6.8",
    "typescript": "~5.4.0"
  }
}
```

Was bedeuten `^` und `~`?

👇 **Probieren Sie es aus**: Fahren Sie mit der Maus uber die verschiedenen Teile der Versionsnummer, um deren Bedeutung zu verstehen; klicken Sie auf Bereichssymbole, um zu sehen, welche Versionen akzeptiert werden.

<DependencyTreeDemo />

### 4.1 Warum nicht die Version komplett fixieren

| Vorgehen | Vorteile | Nachteile |
| :--- | :--- | :--- |
| `"axios": "1.6.8"` (exakt fixiert) | Vollerheb vorhersagbar | Sicherheitspatches werden nicht automatisch aktualisiert |
| `"axios": "^1.6.8"` (kompatibler Bereich, empfohlen) | Automatisch Bugfixes und neue Features erhalten | Selten kleine Inkompatibilitaten moglich |
| `"axios": "*"` (beliebige Version) | Immer die neueste | Hauptversions-Upgrades konnen Code vollstandig zerstoren |

**Best Practice**: Bereich mit `^` deklarieren + tatsachliche Version mit Lockfile fixieren — beides kombiniert verwenden.

### 4.2 Was ist die "Abhangigkeitsholle"

Wenn Sie von 50 Paketen abhangen und jedes Paket wieder von mehreren Paketen abhangt, kann der "Abhangigkeitsbaum" Hunderte von Knoten haben. Wenn zwei Pakete, von denen Sie abhangen, **inkompatible Versionen derselben Bibliothek** bentigen, entsteht ein "Abhangigkeitskonflikt".

Losungen der verschiedenen Okosysteme:
- **npm v3+**: Gleiche Hauptversion wird auf oberster Ebene gemeinsam genutzt, verschiedene Hauptversionen separat installiert
- **pnpm**: Hardlinks + strikte Isolierung, verhindert grundlegend "Phantomabhangigkeiten" (nicht deklarierte, aber nutzbare Pakete)
- **cargo (Rust)**: Auf Sprachebene erzwingt, dass jedes Paket nur von derselben Version abhangen darf — Konflikte komplett ausgeschlossen
- **go mod (Go)**: Strategie der minimalen Versionsauswahl (MVS), die niedrigste Version, die alle Einschrankungen erfullt

---

## 5. Lockfile — Das Fundament der Teamarbeit

### 5.1 Warum wird ein Lockfile bentigt

Angenommen, in `package.json` steht `"axios": "^1.6.0"`:

- Sie installieren heute → `1.6.8`
- Kollege installiert morgen → moglicherweise `1.7.0` (gestern Nacht veroffentlicht)
- CI-Server nachste Woche → moglicherweise `1.7.1`

Derselbe Code, drei verschiedene Ergebnisse. Das **Lockfile** protokolliert die genaue Version jedes Pakets. Wenn sich alle daran halten, sind die Ergebnisse identisch.

| Szenario | Befehl | Verhalten |
| :--- | :--- | :--- |
| Entwicklungsumgebung synchronisieren | `npm install` | Orientiert sich am Lockfile, keine Versions-Upgrades |
| CI / Produktionsbereitstellung | `npm ci` | **Streng** nach Lockfile installieren; bei Abweichung sofort Fehler |
| Aktives Versions-Upgrade | `npm update` | Upgrade im erlaubten Bereich, Lockfile aktualisieren |

### 5.2 Soll das Lockfile in Git committet werden

**Anwendungen mussen committet werden; auf npm veroffentlichte Bibliotheken mussen nicht.**

- ✅ **Web-Anwendungen, Backend-Dienste**: Mussen committet werden, um sicherzustellen, dass Bereitstellungs- und Entwicklungsumgebung identisch sind
- ❌ **Auf npm veroffentlichte Bibliotheken**: Normalerweise nicht committen; Nutzer der Bibliothek haben eigene Lockfiles
- ✅ **Python-Projekte**: `requirements.txt` fungiert selbst als Lockfile, sollte committet werden
- ✅ **Go-Projekte**: `go.sum` muss committet werden, fur die Integritatsprufung

---

## 6. Python Virtuelle Umgebungen

Python hat ein Konzept, das besondere Beachtung erfordert: **Virtuelle Umgebungen (venv)**.

**Warum bentigt?**

Python installiert Pakete standardmaßig **global**. Ihr Projekt A bentigt `requests==2.28`, Projekt B bentigt `requests==2.31` — beides steht im Konflikt.

**Losung**: Fur jedes Projekt eine unabhangige virtuelle Umgebung erstellen, die sich nicht gegenseitig beeinflussen.

```bash
# 1. Virtuelle Umgebung erstellen (im Projektstammverzeichnis ausfuhren)
python -m venv .venv

# 2. Virtuelle Umgebung aktivieren
source .venv/bin/activate        # macOS / Linux
.venv\Scripts\activate           # Windows (Eingabeaufforderung CMD)
.venv\Scripts\Activate.ps1       # Windows (PowerShell)

# 3. Nach der Aktivierung betrifft pip install nur die aktuelle virtuelle Umgebung
pip install requests

# 4. Virtuelle Umgebung verlassen
deactivate
```

> ⚠️ **Haufiges Windows-Problem**: PowerShell verbietet standardmaßig die Skriptausfuhrung. Zunachst ausfuhren:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

**Moderne Alternativen**:
- `conda create -n myproject python=3.11` — verwaltet sogar die Python-Version
- `uv venv && source .venv/bin/activate` — in Rust geschrieben, Erstellung extrem schnell

**Soll `.venv` in Git committet werden?**

Nein! `.venv` wird lokal generiert und sollte zu `.gitignore` hinzugefugt werden. Verwenden Sie `requirements.txt` oder `pyproject.toml`, um Abhangigkeiten zu beschreiben.

---

## 7. Haufige Fragen — Schnellreferenz

**F: Soll `node_modules` in Git committet werden?**

Nein! Es ist normalerweise mehrere hundert MB groß und sollte zu `.gitignore` hinzugefugt werden. Mit `package-lock.json` kann jeder schnell mit `npm install` neu erstellen.

**F: Installation fehlgeschlagen / seltsame Fehlermeldung?**

```bash
# Cache leeren, alte Installation entfernen, neu starten
npm cache clean --force
rm -rf node_modules package-lock.json   # macOS/Linux
rmdir /s /q node_modules && del package-lock.json  # Windows CMD
npm install
```

**F: Installationsgeschwindigkeit zu langsam?**

```bash
# Auf nationalen Mirror wechseln (empfohlen: in .npmrc-Datei schreiben)
echo "registry=https://registry.npmmirror.com" > .npmrc

# pip kann ebenfalls einen Mirror konfiguriert werden
pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple
```

**F: Wie mit Sicherheitslucken in Paketen umgehen?**

```bash
npm audit          # Bekannte Lucken scannen
npm audit fix      # Kompatible Lucken automatisch beheben
npm audit fix --force  # Erzwungenes Upgrade (moglicherweise destruktiv, mit Vorsicht verwenden)
```

**F: Wie erkenne ich, ob ein Paket vertrauenswurdig ist?**

Auf [npmjs.com](https://npmjs.com) oder [bundlephobia.com](https://bundlephobia.com) prufen:
- Wochenliche Downloads (hoch = glaubwurdiger)
- Letzte Aktualisierung (vorsichtig bei > 2 Jahre ohne Update)
- Anzahl der Abhangigkeiten (mehr Abhangigkeiten = hoheres Risikopotenzial)
- GitHub Stars und Issues-Aktivitat

**F: Wo ist die mit winget installierte Software unter Windows?**

winget installiert standardmaßig in Systemverzeichnisse (erfordert Admin-Rechte) oder `%LOCALAPPDATA%\Microsoft\WindowsApps`. Scoop-installierte Software wird einheitlich in `%USERPROFILE%\scoop\apps\` gespeichert, was die Verwaltung und Migration erleichtert.

---

## 8. Glossar

| Englischer Begriff | Deutsche Übersetzung | Erklarung |
| :--- | :--- | :--- |
| **Package** | Paket / Bibliothek | Ein von jemand anderem geschriebenes und veroffentlichtes Codemodul |
| **Registry** | Registry / Repositorium | Zentraler Speicherserver fur alle Pakete (z.B. npmjs.com) |
| **Dependency** | Abhangigkeit | Andere Pakete, die Ihr Projekt zum Ausfuhren bentigt |
| **devDependency** | Entwicklungsabhangigkeit | Pakete, die nur wahrend der Entwicklung bentigt werden (Test-Frameworks, Build-Tools usw.) |
| **Lockfile** | Lockfile | Protokolliert genaue Versionsnummern, gewahrleistet Umgebungskonsistenz |
| **SemVer** | Semantische Versionierung | MAJOR.MINOR.PATCH Versionsbenennungskonvention |
| **node_modules** | Modulverzeichnis | Verzeichnis, in dem die von npm installierten Pakete tatsachlich liegen |
| **venv** | Virtuelle Umgebung | Unabhangiges Paket-Isolationssandbox fur Python-Projekte |
| **tarball** | Komprimiertes Archiv | Verteilungsformat von Paketen, normalerweise `.tgz`-Datei |
| **Hoisting** | Hochziehen | npm zieht Unterabhangigkeiten auf die oberste Ebene, um Doppelinstallationen zu vermeiden |
| **Phantom Dependency** | Phantomabhangigkeit | Pakete, die nicht in der Konfigurationsdatei deklariert sind, aber dennoch verwendet werden konnen (pnpm verhindert dies) |
| **npx** | — | Integrierter Paket-Runner von npm, fuhrt Pakete temporar aus ohne Installation |
| **go.sum** | — | Hash-Prufdatei des Go-Moduls, verhindert Manipulation von Abhangigkeiten |
| **Crate** | — | Die Bezeichnung fur "Paket" im Rust-Okosystem |
| **winget** | — | Offizieller Windows-Paketmanager (in Windows 10/11 integriert) |

---

## Zusammenfassung: Das Wesen des Build-Artefaktmanagers

Vier Satze zum Merken:

1. **Paketmanager = App Store**: Hilft Ihnen, Code-Bauteile zu finden, zu installieren und zu verwalten, ohne das Rad neu zu erfinden.
2. **Lockfile = Teamvertrag**: Fixiert genaue Versionen und macht "Bei mir funktioniert's" zur Geschichte.
3. **Semantische Versionierung = Kommunikationssprache**: `^` bringt sicher Updates, bei MAJOR-Änderungen Vorsicht geboten.
4. **Lokal > Global**: Projektabhangigkeiten moglichst lokal installieren, Tools mit `npx` / `uvx` temporar ausfuhren, die Umgebung sauber halten.
