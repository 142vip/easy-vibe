# Umgebung und Pfad: Systemkonfiguration

> 💡 **Lernleitfaden**: Jedes Mal, wenn Sie im Terminal `git` oder `python` eingeben, muss das System suchen, wo sich dieses Programm befindet. Jedes Mal, wenn Ihr Code eine Large-Language-Model-API aufruft, muss das Programm wissen, welcher Schlussel verwendet werden soll. Hinter beiden Aufgaben steckt derselbe Mechanismus — **Umgebungsvariablen**.

---

## 0. Jedes Programm tragt eine Reihe von Konfigurationen bei sich

Jedes laufende Programm halt einen Satz von "Schlussel=Wert"-Konfigurationen, die als **Umgebungsvariablen** bezeichnet werden. Das Programm kann diese Konfigurationen jederzeit lesen, um die aktuelle Ausfuhrungsumgebung zu erfahren.

Klicken Sie auf eine beliebige Variable in der Liste unten, um ihren Wert im Terminal zu "betrachten":

<EnvVarOverviewDemo />

---

## 1. PATH: Ansatz für die Shell Ihre eingegebenen Befehle findet

`PATH` ist eine besondere Umgebungsvariable, die eine Reihe von Verzeichnispfaden (doppelpunktgetrennt) speichert. Wenn Sie `git` eingeben, durchsucht die Shell diese Verzeichnisse in der angegebenen Reihenfolge nach einer ausfuhrbaren Datei namens `git` — sie stoppt beim ersten Treffer.

```bash
$ echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

Wahlen Sie einen Befehl und beobachten Sie, wie die Shell Verzeichnis fur Verzeichnis sucht:

<PathSearchDemo />

**Drei Schlusselregeln**:
- Je weiter vorne ein Verzeichnis im PATH steht, desto hoher die Prioritat
- Beim ersten Treffer wird gestoppt, die Suche wird nicht fortgesetzt
- Keines der Verzeichnisse enthalt den Befehl → `command not found`

---

## 2. Warum muss das Terminal nach der Installation eines Tools neu gestartet werden

Bei der Installation von Tools wie nvm, Homebrew oder conda fugt das Installationsskript automatisch eine Zeile zu `~/.zshrc` hinzu, um sein eigenes Verzeichnis zum PATH hinzuzufugen:

```bash
# Vom Installationsskript automatisch geschriebener Inhalt (Beispiel)
export PATH="/usr/local/opt/python@3.12/bin:$PATH"
```

Diese Codezeile wird nur beim **Start einer neuen Shell** ausgefuhrt. Bereits geoffnete Terminalfenster sind davon nicht betroffen, deshalb:

```bash
# Auch ohne Neustart sofort wirksam
source ~/.zshrc
```

**Haufige Situationen mit KI-Entwicklungstools**:

```bash
# Ollama / pipx zeigen nach der Installation command not found
which ollama          # Tatsachlichen Installationsort finden

# Pfad der per pip installierten CLI-Tools (zum PATH hinzufugen)
# macOS: ~/Library/Python/3.x/bin
# Linux: ~/.local/bin
export PATH="$PATH:$HOME/.local/bin"

# Empfohlen: CLI-Tools mit pipx installieren, verwaltet PATH automatisch
pipx install aider-chat
```

---

## 3. Gultigkeitsbereich von Variablen: Wer kann diese Variable sehen

Umgebungsvariablen werden nicht an alle Programme gesendet — jeder Prozess halt eine **eigene Kopie**, die vom Elternprozess geerbt wurde. Änderungen an der eigenen Kopie beeinflussen den Elternprozess nicht.

Das folgende Diagramm zeigt drei Ebenen. Exportieren Sie eine neue Variable auf der "Benutzerebene" und prufen Sie, ob sie auf der "Prozessebene" erscheint:

<EnvScopeDemo />

---

## 4. export: Bestimmt, ob ein Kindprozess diese Variable lesen kann

Beim Setzen einer Variablen ist es ein grundlegend anderer Vorgang, ob Sie `export` hinzufugen oder nicht:

<EnvExportDemo />

Damit eine Variable sitzungsuebergreifend dauerhaft erhalten bleibt, schreiben Sie den `export`-Befehl in eine Konfigurationsdatei:

```bash
# macOS (zsh)
echo 'export MY_VAR="value"' >> ~/.zshrc
source ~/.zshrc       # Sofort wirksam, kein Terminalneustart notig

# Linux (bash)
echo 'export MY_VAR="value"' >> ~/.bashrc
source ~/.bashrc
```

---

## 5. API-Schlussel: Durfen niemals im Code stehen

Beim Aufruf von APIs wie OpenAI, Anthropic oder DeepSeek ist der Schlussel Ihr "Ausweis + Kreditkarte". Wird er geleakt, konnen andere Ihr Kontingent aufbrauchen — die Kosten tragen Sie.

Der haufigste Fehler ist, den Schlussel direkt im Code zu hinterlegen:

<ApiKeyDangerDemo />

---

## 6. Lokale Entwicklung: Schlussel mit .env-Dateien verwalten

Bei der lokalen Entwicklung speichern Sie Schlussel in einer `.env`-Datei im Projektverzeichnis. Der Code liest sie uber die dotenv-Bibliothek ein. `.env` muss zwingend zu `.gitignore` hinzugefugt und nicht in Git committet werden.

Schreiben Sie links die Konfiguration und lesen Sie sie rechts — wechseln Sie die Sprache, um zwei verschiedene Schreibweisen zu sehen:

<DotEnvDemo />

---

## 7. Produktionsumgebung: Die Laufzeitumgebung Schlussel injizieren lassen

`.env` ist ein Hilfsmittel fur die Entwicklungsphase. Auf Servern und Cloud-Plattformen sollte die **Laufzeitumgebung** fur die Injektion der Schlussel verantwortlich sein — der Code selbst sollte nicht wissen, wo die Schlussel gespeichert sind:

<ServerSecretDemo />

---

## 8. Praktische Fehlerbehebung

### `command not found`

```bash
# Schritt 1: Prufen, ob im PATH vorhanden
which python3         # Ausgabe vorhanden = gefunden

# Schritt 2: Tatsachlichen Programmstandort finden (macOS)
brew list python | grep bin

# Schritt 3: Verzeichnis zum PATH hinzufugen
export PATH="/gefundener/pfad:$PATH"
source ~/.zshrc       # Nach dem Schreiben in die Konfigurationsdatei source ausfuhren
```

### Zwei Versionen installiert, aber nicht die gewunschte wird verwendet

```bash
which python
# /usr/bin/python ← Alte Systemversion, weiter vorne im PATH

# Neues Verzeichnis an den Anfang des PATH setzen
export PATH="/usr/local/bin:$PATH"

which python
# /usr/local/bin/python ← Neue Version, jetzt priorisiert
```

### Variable ist eindeutig gesetzt, aber das Programm liest sie nicht

| Ursache | Losung |
|:---|:---|
| `export` vergessen | `export` hinzufugen und erneut versuchen |
| `~/.zshrc` geandert, aber nicht wirksam | `source ~/.zshrc` |
| `.env` verwendet, aber dotenv nicht installiert | `pip install python-dotenv` / `npm install dotenv` |
| Auf dem Server nur in der SSH-Sitzung gultig | Stattdessen systemd `EnvironmentFile` verwenden |

---

## Glossar

| Begriff | Bedeutung |
|:---|:---|
| **PATH** | Speichert die Liste der Verzeichnisse, in denen die Shell nach ausfuhrbaren Dateien sucht, doppelpunktgetrennt, Reihenfolge bestimmt die Prioritat |
| **export** | Markiert eine Variable als vererbbar, Kindprozesse erhalten beim Start automatisch eine Kopie |
| **source** | Fuhrt eine Konfigurationsdatei in der aktuellen Shell erneut aus, um Änderungen sofort zu ubernehmen |
| **which** | Zeigt den Pfad zur ausfuhrbaren Datei eines Befehls an (Ergebnis der PATH-Suche) |
| **.env** | Lokale Projektkonfigurationsdatei, speichert Entwicklungsschlussel, muss zwingend zu `.gitignore` hinzugefugt werden |
| **.env.example** | Vorlage mit vollstandigen Variablennamen aber leeren Werten, kann sicher in Git committet werden |
| **chmod 600** | Dateiberechtigung: Nur der Eigentumer darf lesen und schreiben, geeignet zum Schutz von Schlusseldateien |
| **Secret Scanner** | AutomatischeScan-Funktion auf Plattformen wie GitHub, die Schlussel-Lecks erkennt und den Anbieter zur Sperrung benachrichtigt |
