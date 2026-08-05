# Git-Versionskontrolle: Prinzipien

> 💡 **Lernleitfaden**: Dieses Kapitel ist fur alle geschrieben, die noch nie Git verwendet haben. Wir lassen Sie nicht sofort Befehle auswendig lernen, sondern klaren zuerst, "welches Problem Git eigentlich fur Sie lost", bevor wir Befehle und Konzepte Schritt fur Schritt verknupfen. Nach dem Lesen sollten Sie in der Lage sein, lokal zu committen, Branches zu erstellen und zu GitHub zu pushen.

---

## Typische Szenarien und Schmerzpunkte

**Szenario 1: Versionsholle**

Sie schreiben eine Arbeit oder Code, merken zur Halfte, dass etwas falsch ist, und mochten zur Version von vor drei Tagen zuruckkehren — aber sie ist bereits verschwunden.

```
Projekt_v1.zip
Projekt_v2_bearbeitet.zip
Projekt_v3_final.zip
Projekt_v3_final_wirklich_final.zip
Projekt_v3_final_echt_letztmalig.zip
```

Bei jedem neuen Exemplar wird die Festplatte chaotischer, und Sie konnen sich nicht mehr erinnern, was in welcher Version geandert wurde.

**Szenario 2: Zusammenarbeits-Albtraum**

Sie und Ihr Teamkollege bearbeiten gleichzeitig dieselbe Datei:
- Sie andern Zeile 10 und fugen eine Login-Funktion hinzu
- Ihr Kollege andert Zeile 10 und behebt einen Bug
- Sie schicken sich den Code per E-Mail, und beim Zusammenfuhren wird die Änderung des einen von der des anderen uberschrieben
- Niemand weiss, welcher Code der richtige ist

**Szenario 3: Keine "Bereuhen-Pille"**

Sie haben neuen Code in der Produktionsumgebung bereitgestellt, aber es gibt einen Bug. Sie mochten dringend auf die letzte stabile Version zuruckkehren — aber Sie wissen nicht wie und suchen panisch nach einem Backup.

---

**Git wurde genau geschaffen, um diese drei Probleme zu losen.**

Git ist ein **Versionskontrollsystem** (Version Control System). Sein Wesen: **Es zeichnet jeden Ihrer "Speichern"-Vorgange auf und erstellt eine vollstandige historische Zeitlinie, die es Ihnen ermoglicht, jederzeit zu jedem historischen Punkt zuruckzukehren.**

Ohne Ubertreibung ist Git eines der wichtigsten Werkzeuge der modernen Softwareentwicklung. Fast alle Unternehmen und alle Open-Source-Projekte nutzen es.

---

## 1. Überblick: Git vs. GitHub

Viele Anfanger verwechseln diese beiden Konzepte. Klaren wir das zunachst:

| | Git | GitHub |
| :--- | :--- | :--- |
| **Was ist es** | Ein Versionskontrollwerkzeug, das auf Ihrem Computer lauft | Eine Website zum Hosten von Git-Repositories (Cloud) |
| **Wo ist es** | Auf Ihrem lokalen Computer | Im Internet |
| **Selbststandig nutzbar** | ✅ Ja, verwaltet nur lokale Historie | ❌ Muss zusammen mit Git verwendet werden |
| **Analogie** | Ihr lokales Tagebuch | Der Cloud-Speicher fur Ihr Tagebuch |

Kurz gesagt: **Git ist das Werkzeug, GitHub ist der Hosting-Dienst.** So wie Word das Werkzeug und OneDrive die Cloud ist — beides wird zusammen verwendet, ist aber nicht dasselbe.

Neben GitHub gibt es ahnliche Dienste wie GitLab, Gitee (inlandisch) usw.

---

## 2. Kernkonzept: Die drei Bereiche

Dies ist das wichtigste Design in ganz Git. Wenn Sie diese drei Bereiche verstehen, verstehen Sie die Seele von Git.

Git teilt den Zustand Ihrer Dateien in drei Ebenen:

**Arbeitsverzeichnis (Working Directory)**
Das ist Ihr **normaler Ordner**. Alle Dateien, die Sie gerade sehen und bearbeiten, befinden sich hier. Sie konnen nach Belieben andern — Git merkt, was Sie geandert haben, nimmt aber keine Aufzeichnung vor.

**Staging-Bereich (Staging Area / Index)**
Das ist eine **"Vorbereitungs-Committ"-Zwischenstation**. Sie konnen Dateien aus dem Arbeitsverzeichnis, die Sie speichern mochten, in den Staging-Bereich "legen" — wie wenn Sie Pakete in eine Versandbox legen: noch nicht abgeschickt, aber bereits ausgewahlt, was verschickt werden soll.

**Repository (Repository)**
Das ist der **permanent gespeicherte Historienspeicher**, versteckt im Ordner `.git`. Jedes Mal, wenn Sie `git commit` ausfuhren, wird der Inhalt des Staging-Bereichs im Repository versiegelt und bildet einen unveranderlichen Historieneintrag.

👇 **Probieren Sie es aus**: Klicken Sie die Befehlsschaltflachen nacheinander und beobachten Sie, wie Dateien zwischen den drei Bereichen wandern.

<GitCommitFlow />

### Motivation: "Zweischritt" (add + commit)

Viele Anfanger fragen: Warum nicht einfach mit einem Klick speichern, statt zuerst `add` und dann `commit`?

**Weil Sie in der realen Entwicklung oft nicht alle Änderungen auf einmal committen mochten.**

Beispiel: Sie haben heute 5 Dateien geandert:
- `login.js`: Login-Funktion abgeschlossen (mochte committen)
- `style.css`: Login-Seitenstil angepasst (mochte committen)
- `debug.log`: Temporare Debug-Ausgabe (**mochte NICHT committen**)
- `experiment.js`: Neue Funktion im Test, noch nicht fertig (**mochte NICHT committen**)
- `todo.txt`: Ihre personlichen Notizen (**mochte NICHT committen**)

Ohne Staging-Bereich mussten Sie entweder alle 5 Dateien committen (unubersichtliche Commit-Historie) oder keine einzige.

Mit dem Staging-Bereich konnen Sie prazise steuern: `git add login.js style.css` legt nur diese beiden Dateien in die Versandbox, dann `commit`, und dieser Commit zeichnet klar "Login-Funktion abgeschlossen" auf.

---

## 3. Git zum ersten Mal verwenden: Initialisierung und grundlegender Workflow

### 3.1 Installation und Initialisierung

Nach der Installation von Git (macOS vorinstalliert, Windows: Download von git-scm.com) offnen Sie das Terminal und navigieren Sie zu Ihrem Projektordner:

```bash
# Ein Git-Repository im aktuellen Ordner initialisieren
git init

# Git erstellt einen versteckten .git-Ordner; alle Historie wird darin gespeichert
# Ausgabe: Initialized empty Git repository in .../your-project/.git/
```

Beim ersten Mal mussen Sie Git auch mitteilen, wer Sie sind (diese Informationen werden an jeden Commit angehangt):

```bash
git config --global user.name "Ihr Name"
git config --global user.email "ihre@email.com"
```

### 3.2 Täglicher Workflow: Drei Schritte zum Speichern

Nach der Initialisierung bestehen 90 % der taglichen Entwicklungsarbeit aus der Wiederholung dieser drei Schritte:

**Schritt 1: Status prufen**

```bash
git status
```

Das ist der am haufigsten verwendete Befehl. Er sagt Ihnen:
- Auf welchem Branch Sie sich befinden
- Welche Dateien geandert wurden (rot = nicht gestagt)
- Welche Dateien im Staging-Bereich sind (grun = gestagt, wartend auf Commit)

**Schritt 2: Dateien in den Staging-Bereich legen**

```bash
# Einzelne Datei hinzufugen
git add login.js

# Mehrere Dateien hinzufugen
git add login.js style.css

# Alle geanderten Dateien im aktuellen Ordner hinzufugen (. bedeutet "alles")
git add .
```

> ⚠️ Haufiger Anfangerfehler: `git add .` ist sehr praktisch, fugt aber auch alle Änderungen hinzu, einschließlich temporarer Dateien, die Sie nicht committen mochten. Gewohnen Sie sich an, prazise zu adden, oder verwenden Sie `.gitignore`, um Dateien auszuschließen, die nicht verfolgt werden sollen (wird spater erklart).

**Schritt 3: Committen und eine Beschreibung schreiben**

```bash
git commit -m "feat: Benutzer-Login-Funktion hinzufugen"
```

Der Text in den Anfuhrungszeichen nach `-m` heißt **Commit Message** (Commit-Beschreibung). Diese ist fur das zukunftige Ich und Ihre Teamkollegen gedacht — schreiben Sie sie aussagekraftig.

### 3.3 Wie schreibt man professionelle Commit Messages

```bash
# ❌ Nutzlose Schreibweise — man sieht nicht, was gemacht wurde
git commit -m "update"
git commit -m "fix"
git commit -m "einige Dinge geandert"

# ✅ Gute Schreibweise: Typ + Doppelpunkt + Ein-Satz-Beschreibung
git commit -m "feat: Benutzer-Login-Funktion hinzufugen"
git commit -m "fix: Weißer Bildschirm auf der Startseite in iOS Safari behoben"
git commit -m "docs: Bereitstellungsanleitung im README aktualisiert"
git commit -m "refactor: UserService in unabhangiges Modul aufgeteilt"
git commit -m "style: Code-Einruckung auf 2 Leerzeichen vereinheitlicht"
```

**Bedeutung der haufigen Prafixe:**

| Prafix | Bedeutung |
| :--- | :--- |
| `feat:` | Neue Funktion (feature) |
| `fix:` | Bug-Fix |
| `docs:` | Dokumentationsanderung |
| `style:` | Code-Formatanpassung (keine Funktionsauswirkung) |
| `refactor:` | Code-Refactoring (Funktion bleibt gleich, Struktur optimiert) |
| `chore:` | Build, Werkzeuge, Abhangigkeiten |
| `test:` | Testbezogen |

Wenn Sie sich diese Gewohnheit aneignen, konnen Sie Monate spater auf einen Blick sehen, was jeder Commit getan hat. Das ist besonders wichtig in der Teamarbeit.

### 3.4 Historie anzeigen

```bash
# Detailliertes Format (vollstandige Informationen zu jedem Commit)
git log

# Kompaktes Format (eine Zeile pro Commit, fur tagliche Nutzung empfohlen)
git log --oneline

# Beispielausgabe:
# a1b2c3d (HEAD -> main) feat: Benutzer-Login-Funktion hinzufugen
# 9f3e1b2 init: Projekt initialisiert
```

---

## 4. Paralleluniversum: Branches (Branch)

**Branches** sind die starkste, aber auch fur Anfanger verwirrendste Funktion von Git. Wenn Sie sie jedoch einmal verstanden haben, werden Sie feststellen, dass dieses Design sehr elegant ist.

### 4.1 Was ist ein Branch? Mit "Paralleluniversen" verstehen

Stellen Sie sich vor, Sie spielen ein Rollenspiel mit einer wichtigen Entscheidung:
- Wahl A: Den großen Boss herausfordern (neue Funktion entwickeln)
- Wahl B: Die aktuelle Situation stabil halten (Hauptlinie bleibt unverandert)

Wenn Sie direkt im Hauptspielstand Wahl A treffen und scheitern, ist der gesamte Spielfortschritt zerstort.

Aber wenn Sie **eine Kopie des Spielstands** erstellen und in der Kopie den Boss herausfordern:
- Gewonnen? Die Errungenschaften der Kopie in den Hauptspielstand ubernehmen
- Verloren? Der Hauptspielstand ist unberuhrt — Kopie loschen und neu versuchen

**Git-Branches sind genau dieser "Kopie-Spielstand"-Mechanismus.**

In Git ist der `main`- (oder `master`-) Branch Ihr "Hauptspielstand", der immer stabil und nutzbar bleiben muss. Wenn Sie eine neue Funktion entwickeln wollen, erstellen Sie von main einen neuen Branch, entwickeln und testen dort und mergen nach Abschluss zuruck in main.

### 4.2 Visuelle Branch-Demo

👇 **Probieren Sie es aus**: Klicken Sie die Befehlsschaltflachen nacheinander und beobachten Sie, wie das Branch-Diagramm unten abzweigt, wachst und sich schließlich vereint. Achten Sie besonders auf die Position des HEAD-Labels — es zeigt immer an, "wo Sie sich gerade befinden".

<GitBranchVisual />

### 4.3 Branch-Operationen im Detail

**Neuen Branch erstellen und wechseln:**

```bash
# Methode 1: Zuerst erstellen, dann wechseln (zwei Schritte)
git branch feature-login      # Branch erstellen
git checkout feature-login    # Wechseln

# Methode 2: In einem Schritt (empfohlen)
git checkout -b feature-login

# Ausgabe: Switched to a new branch 'feature-login'
```

Nach dem Erstellen eines Branches zeigt Ihre Eingabeaufforderung den aktuellen Branchnamen, z.B.:
```
user@mac ~/project (feature-login) $
```

**Alle Branches anzeigen:**

```bash
git branch

# Ausgabe (* markiert den aktuellen Branch):
# * feature-login
#   main
```

**Normal auf dem Branch entwickeln:**

```bash
# Auf dem feature-login-Branch: Code andern, add, commit — ganz wie sonst
git add login.js
git commit -m "feat: HTML-Struktur des Login-Formulars hinzugefugt"

git add login.js api.js
git commit -m "feat: Login-API-Anbindung abgeschlossen"
```

Diese Commits existieren nur auf dem `feature-login`-Branch — der `main`-Branch weiss nichts davon.

**Zuruck zum Haupt-Branch wechseln und mergen:**

```bash
# Zuruck zu main
git checkout main

# Alle Änderungen von feature-login mergen
git merge feature-login

# Nach dem Merge kann der Branch geloscht werden (optional)
git branch -d feature-login
```

### 4.4 Wann sollte man einen Branch erstellen

| Situation | Empfehlung | Grund |
| :--- | :--- | :--- |
| Neue Funktion entwickeln | ✅ Branch erstellen | Beeinflusst die Hauptlinie nicht bis zum Abschluss; jederzeit abbruchbar |
| Dringenden Produktions-Bug beheben | ✅ `hotfix-xxx`-Branch von main | Nach dem Fix direkt mergen und bereitstellen, ohne unfertige Funktionen |
| Parallel mit Kollegen entwickeln | ✅ Jeweils eigene Branches | Keine gegenseitige Beeintrachtigung; nach Abschluss uber Pull Request zusammenfuhren |
| Nur einen Tippfehler korrigieren | ❌ Direkt auf main andern | Extrem geringes Risiko, kein Branch notig |

### 4.5 Haufige Branch-Strategien in Teams

In echten Projekten vereinbart das Team in der Regel Namensgebung und Zweck von Branches:

| Branchname | Zweck | Eigenschaft |
| :--- | :--- | :--- |
| `main` / `master` | Stabiler Code fur die Produktion | Nur getesteter Code darf hinein; kein direkter Push |
| `dev` / `develop` | Taglicher Integrations-Branch | Alle Feature-Branches werden zuerst hierhin gemergt; nach Test auf main |
| `feature/xxx` | Spezifische Funktionsentwicklung | Z.B. `feature/user-login`; nach Abschluss in dev mergen |
| `hotfix/xxx` | Dringende Fehlerbehebung | Von main erstellt; nach Fix direkt in main und dev mergen |

---

## 5. Zusammenarbeit mit Kollegen: Remote-Repository

Bis jetzt haben Sie nur **lokale** Git-Operationen gelernt — die gesamte Historie ist nur auf Ihrem eigenen Computer gespeichert. Um Code mit Kollegen zu teilen, benotigen Sie ein **Remote-Repository**, also einen Cloud-Speicher wie GitHub oder GitLab.

### 5.1 Funktionsweise des Remote-Repositorys

Das Remote-Repository kann als **"gemeinsamer Spielstand" des Teams** verstanden werden:

- Jeder schreibt lokal Code und committet
- Nach Abschluss wird mit `push` (hochladen) das Remote-Repository aktualisiert
- Kollegen machen `pull` (herunterladen), um die neuesten Inhalte in ihr Lokal zu ubernehmen
- So bleibt der Code aller synchron

👇 **Probieren Sie es aus**: Klicken Sie die Befehle nacheinander und erleben Sie den gesamten Ablauf vom Verknupfen des Remote-Repositorys uber Push bis zum Pull von Kollegen-Updates.

<GitSyncDemo />

### 5.2 Projekt zum ersten Mal auf GitHub pushen

**Schritt 1**: Auf GitHub ein neues Repository erstellen (oben rechts auf + → New repository), keine Initialisierungsoptionen aktivieren.

**Schritt 2**: Zuruck zum lokalen Terminal und das Remote-Repository verknupfen:

```bash
# Lokales Repository mit dem GitHub-Repository verknupfen
# "origin" ist der Alias fur das Remote-Repository, der konventionsgemasse Name (kann geandert werden, ist aber nicht notig)
git remote add origin https://github.com/Benutzername/Repositoryname.git

# Erfolgreiche Verknupfung bestatigen
git remote -v
# Ausgabe:
# origin  https://github.com/Benutzername/Repositoryname.git (fetch)
# origin  https://github.com/Benutzername/Repositoryname.git (push)
```

**Schritt 3**: Lokale Inhalte zum Remote pushen:

```bash
# Erster Push; -u bedeutet "bei zukunftigen git push standardmaßig auf den main-Branch von origin pushen"
git push -u origin main

# Danach genügt bei jedem Push:
git push
```

### 5.3 Befehle fur die tagliche Zusammenarbeit

**Pushen (Sie haben etwas geandert und mochten es fur Kollegen sichtbar machen):**
```bash
git push
```

**Pullen (Kollegen haben etwas geandert und Sie mochten synchronisieren):**
```bash
git pull
```

`git pull` ist eigentlich eine Kombination aus zwei Befehlen:
1. `git fetch`: Die neuesten Commit-Datensatze vom Remote-Repository herunterladen
2. `git merge`: Die heruntergeladenen Inhalte in den aktuellen Branch mergen

**Zum ersten Mal ein Projekt von GitHub erhalten:**
```bash
# Das gesamte Remote-Repository lokal kopieren (nur einmal notig)
git clone https://github.com/jemand/irgendein-projekt.git

# clone stellt automatisch die Verbindung zum Remote her; danach genugen push/pull
```

### 5.4 Richtung von Push und Pull

```
Ihr Computer (lokales Repository)  ←→  GitHub (Remote-Repository)

git push:  Lokal → Remote   (Sie haben etwas geandert, fur Kollegen hochladen)
git pull:  Remote → Lokal   (Kollegen haben etwas geandert, zu Ihnen herunterladen)
git clone: Remote → Lokal   (Erstmaliges vollstandiges Kopieren des gesamten Repositorys)
```

> **Best Practice**: Vor Arbeitsbeginn jedes Tages `git pull` fur den neuesten Code; nach Feierabend oder Abschluss einer Funktion `git push` fur zeitnahe Backup und Sichtbarkeit fur Kollegen.

---

## 6. Fortgeschritten: Konflikte losen

Konflikte sind in der Zusammenarbeit unvermeidbar, aber auch nicht so schlimm.

### 6.1 Wie entstehen Konflikte

Wenn Sie und ein Kollege **gleichzeitig dieselbe Zeile in derselben Datei andern**, weiß Git beim Mergen nicht, welche Version verwendet werden soll, und es entsteht ein Konflikt.

Beispiel:
- Sie haben in `login.js` Zeile 5 geschrieben: `const timeout = 3000`
- Ihr Kollege hat gleichzeitig in derselben Zeile geschrieben: `const timeout = 5000`
- Bei `git pull` oder `git merge` entdeckt Git diesen Widerspruch und "pausiert": Es teilt Ihnen mit, dass es nicht entscheiden kann — Sie mussen die Wahl treffen.

### 6.2 Wie sieht eine Konfliktdatei aus

Git fugt an den Konfliktstellen spezielle Markierungen ein:

```javascript
function login() {
  const url = '/api/login'

 <<<<<<< HEAD
  const timeout = 3000   // Ihre Version
 =======
  const timeout = 5000   // Version des Kollegen
 >>>>>>> feature/update-timeout

  return fetch(url, { timeout })
}
```

- Zwischen `<<<<<<< HEAD` und `=======`: Inhalt Ihres aktuellen Branches
- Zwischen `=======` und `>>>>>>> xxx`: Inhalt, der gemerged werden soll

### 6.3 Wie lost man Konflikte

**Schritt 1**: Die Konfliktdatei offnen und alle `<<<<<<<`-Markierungen finden (meistens heben Editoren wie VS Code diese automatisch hervor)

**Schritt 2**: Entscheiden, welcher Code beibehalten werden soll, und die Datei manuell bearbeiten, alle Markierungssymbole loschen (`<<<<<<<`, `=======`, `>>>>>>>`).

Beispiel: Entscheidung fur 5000 (Version des Kollegen):
```javascript
function login() {
  const url = '/api/login'
  const timeout = 5000   // Änderung des Kollegen ubernehmen
  return fetch(url, { timeout })
}
```

**Schritt 3**: Erneut committen

```bash
# Konflikt als gelost markieren
git add login.js

# Merge-Commit abschließen (Git generiert automatisch eine Merge-Commit-Nachricht)
git commit
```

### 6.4 Gute Gewohnheiten zur Konfliktreduzierung

- **Haufig pullen**: Vor Arbeitsbeginn den neuesten Code synchronisieren, um ein "zu weit Zuruckbleiben" zu vermeiden
- **Kleine Commits**: Nicht eine Woche Code auf einmal committen; haufige kleine Commits erleichtern das Erkennen und Losen von Konflikten
- **Branch-Isolierung**: Verschiedene Funktionen in verschiedenen Branches, um Konkurrenz um dieselbe Zeile zu reduzieren
- **Kommunikation**: Vor Änderungen an gemeinsamen Dateien (z.B. `config.js`) Kollegen informieren

---

## 7. Befehls-Schnellreferenz

<GitCommandCheatsheet />

---

## 8. Praxis: Kompletter Ablauf zum Beitritt zu einem Teamprojekt

Dies ist der Standardablauf, wenn Sie einem neuen Team oder Projekt beitreten — direkt kopierbar:

```bash
# ① Tag 1: Projekt lokal klonen (nur einmal)
git clone https://github.com/team/project.git
cd project

# ② Täglicher Arbeitsbeginn: Zunachst neuesten Code pullen
git pull origin main

# ③ Eigenen Feature-Branch erstellen (nicht direkt auf main andern!)
git checkout -b feature/user-profile

# ④ Normal entwickeln... Code schreiben...

# ⑤ Nach Abschluss eines kleinen Funktionspunkts sofort committen (nicht sammeln)
git add src/UserProfile.vue
git commit -m "feat: Benutzer-Profilbild-Upload-Funktion abgeschlossen"

git add src/UserProfile.vue src/api/user.js
git commit -m "feat: Benutzer-Profilbearbeitungs-API-Anbindung abgeschlossen"

# ⑥ Eigenen Branch auf Remote pushen, damit Kollegen ihn sehen konnen
git push origin feature/user-profile

# ⑦ Auf GitHub einen Pull Request (PR) erstellen und Merge in main beantragen
# (Dieser Schritt wird auf der GitHub-Webseite durchgefuhrt)

# ⑧ Auf Code-Review der Kollegen warten, nach Feedback andern, weiter commit + push

# ⑨ Nach PR-Merge zuruck zu main, lokal aktualisieren, Feature-Branch loschen
git checkout main
git pull
git branch -d feature/user-profile
```

---

## 9. .gitignore: Welche Dateien sollten nicht verfolgt werden

Einige Dateien sollten Sie **nicht** in das Git-Repository committen:
- `node_modules/`: Abhangigkeiten, sehr groß, mit `npm install` regenerierbar
- `.env`: Umgebungsvariablendatei, enthalt moglicherweise Datenbankpassworter, API-Keys — **niemals in offentliche Repositories hochladen**
- `*.log`: Log-Dateien
- `.DS_Store`: Von macOS automatisch generierte versteckte Datei
- `dist/`, `build/`: Build-Artefakte, erneut erstellbar

Erstellen Sie eine `.gitignore`-Datei im Projektverzeichnis und tragen Sie die Regeln fur nicht zu verfolgende Dateien ein:

```gitignore
# Abhangigkeiten
node_modules/

# Umgebungsvariablen (wichtig! Passworter durfen nicht committet werden)
.env
.env.local

# Build-Artefakte
dist/
build/

# Systemdateien
.DS_Store
Thumbs.db

# Logs
*.log
```

GitHub bietet .gitignore-Vorlagen fur verschiedene Sprachen und Frameworks: [github.com/github/gitignore](https://github.com/github/gitignore)

---

## Glossar

| Begriff | Englisch | Erklarung |
| :--- | :--- | :--- |
| **Repository** | Repository (Repo) | Datenbank mit der gesamten Versionshistorie des Projekts, im Ordner `.git` |
| **Commit** | Commit | Ein vollstandiger Versionsdatensatz, wie ein Spielstand, mit Beschreibung und Zeitstempel |
| **Branch** | Branch | Unabhangige Entwicklungslinie, wie parallele Zeitlinien, die sich nicht beeinflussen |
| **Merge** | Merge | Änderungen eines Branches in einen anderen integrieren |
| **Konflikt** | Conflict | Dieselbe Codezeile wurde von mehreren Personen geandert; Git weiß nicht, welche Version nehmen; manuelle Losung erforderlich |
| **Stagen** | Stage / Index | Änderungen in die "Commit-vorbereiten"-Liste aufnehmen |
| **Remote** | Remote | Cloud-Kopie des Repositories (GitHub / GitLab / Gitee) |
| **Klonen** | Clone | Das gesamte Remote-Repository vollstandig lokal kopieren |
| **Pushen** | Push | Lokale Commits in das Remote-Repository hochladen |
| **Pullen** | Pull | Neueste Remote-Inhalte herunterladen und lokal mergen |
| **HEAD** | HEAD | Zeiger auf den aktuellen Branch/Commit, zeigt "wo Sie sich gerade befinden" |
| **origin** | origin | Standardalias fur das Remote-Repository (konventionsgemasser Name) |
| **stash** | Stash | Noch nicht committete Änderungen temporar speichern; nutzlich beim Aufgabenwechsel |
| **PR / MR** | Pull Request / Merge Request | Anforderung, Ihren Branch in den Hauptbranch zu mergen; meist mit Team-Review |
