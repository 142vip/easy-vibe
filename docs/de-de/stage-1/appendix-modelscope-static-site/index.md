---
title: Dein Vibe-Coding-Projekt auf ModelScope veröffentlichen
description: Vollständige Anleitung zum Veröffentlichen von HTML sowie Vue-, React- und Vite-Builds mit offiziellem Skill und Static Studio.
---

# Dein Vibe-Coding-Projekt auf ModelScope veröffentlichen

Wenn die Seite lokal funktioniert, brauchst du eine Adresse, die Freunde, Mitschüler oder echte Nutzer öffnen können.

Du könntest einen Server mieten und Domain, HTTPS und Deployment selbst einrichten. In dieser Lektion sparen wir diesen Betriebsaufwand und veröffentlichen die Seite in **ModelScope Studio**.

ModelScope wurde von Alibaba zusammen mit dem CCF-Komitee für Open-Source-Entwicklung ins Leben gerufen. Neben mehr als 200.000 Open-Source-Modellen und 30.000 Datensätzen bietet die Plattform **Studios** zur Präsentation von Anwendungen. Mit einem Studio erhältst du kostenlos eine teilbare Adresse, ohne zuerst Serververwaltung zu lernen.

> Diese Anleitung wurde am **11. August 2026** anhand der aktuellen Oberfläche, offiziellen Skills und Befehlsdokumentation geprüft. Schaltflächen können sich verschieben; der Ablauf bleibt: Static Studio erstellen, Build-Ausgabe hochladen, bereitstellen und Link prüfen.

Neben Gradio, Streamlit und Docker unterstützt Studio den Typ `static` für bereits gebaute Websites. Besteht das Ergebnis aus `index.html`, CSS, JavaScript und Bildern, ist dieser Typ richtig.

Die veröffentlichte Adresse sieht ähnlich aus:

```text
https://modelscope.cn/studios/dein-name/dein-studio
```

## Die richtige Veröffentlichungsart wählen

| Projekt | Studio-Typ | Vorbereitung |
| --- | --- | --- |
| HTML, CSS und JavaScript | **Static** | Dateien vorbereiten, kein Build nötig |
| Vue, React, Vite oder Svelte | **Static** | Lokal bauen und nur den Inhalt von `dist` oder `build` veröffentlichen |
| Gradio | Gradio | `app.py` und `requirements.txt` vorbereiten |
| Streamlit | Streamlit | Einstieg und Abhängigkeiten vorbereiten |
| Backend oder besondere Systempakete | Docker | Dockerfile erstellen und am verlangten Port lauschen |

Dieses Kapitel behandelt die ersten beiden Varianten. **Lade Vue- oder React-Quellcode nicht als Static-Seite hoch.** Der Browser eines Besuchers führt weder `npm install` noch `npm run build` aus.

## Empfehlung: mit dem offiziellen Skill veröffentlichen

ModelScope pflegt [offizielle Skills](https://github.com/modelscope/modelscope-skills).

| Skill | Aufgabe | Verwendung |
| --- | --- | --- |
| `ms-hub` | Gemeinsamer Zugang zu Repositories, Modellen, Daten, Studios, MCP und Skills Center | Erste Verbindung und allgemeine Vorgänge |
| `ms-studio-deploy` | Projekterkennung, Studio-Erstellung, Git-Synchronisierung, Deployment, Protokolle und Diagnose | **Bevorzugt für Veröffentlichung und Aktualisierung lokaler Websites** |

`ms-studio-deploy` erkennt `static`, wenn `index.html` im Stammverzeichnis liegt. Ein Static Studio führt kein `npm run build` aus; baue Framework-Projekte daher lokal.

### Skills installieren

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

Fehlt der Unterbefehl `skills`, verwende das offizielle Installationsskript:

```bash
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-hub
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-studio-deploy
```

Die Skills werden normalerweise unter `~/.agents/skills/` installiert. Öffne danach eine neue Sitzung in Codex, Cursor, Claude Code oder einem anderen kompatiblen Werkzeug.

### Mit dem Skill veröffentlichen

Nach der [offiziellen Anleitung für `ms-studio-deploy`](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md) brauchst du:

1. Den installierten Skill und eine neu gestartete Agent-Sitzung.
2. Den zu veröffentlichenden Ordner mit `index.html` direkt im Stammverzeichnis.
3. Ein lokal konfiguriertes ModelScope Access Token.

Hole das Token auf der Seite [Access Tokens](https://modelscope.cn/my/myaccesstoken) und setze es im Terminal:

```bash
export MODELSCOPE_API_KEY="dein-token"
```

Bei einfachem HTML öffnest du den Webordner direkt. Bei Vue, React oder Vite baust du zuerst und wechselst in die Ausgabe:

```bash
npm run build
cd dist
```

Vite erzeugt meist `dist`. Erzeugt dein Werkzeug `build`, öffne diesen Ordner im Agent-Skills-fähigen Werkzeug.

#### Die kürzeste Anweisung

```text
Veröffentliche diese Website mit dem ms-studio-deploy Skill in einem Static Studio auf ModelScope. Sende mir die Adresse, sobald sie funktioniert.
```

Der Skill prüft `index.html` und die Anmeldung. Muss er ein Studio erstellen, fragt er nach Name und Sichtbarkeit. Beginne privat.

Du kannst auch alle Bedingungen nennen:

```text
Veröffentliche diesen Ordner mit dem ms-studio-deploy Skill in einem Static Studio auf der chinesischen ModelScope-Seite.
Nenne das Studio my-portfolio und lasse es zunächst privat. Prüfe anschließend Status und Protokolle.
Wenn es fehlschlägt, behebe die Ursache aus den Protokollen, stelle erneut bereit und gib die funktionierende Adresse zurück.
```

#### Was die KI danach ausführt

```text
Projekt erkennen → chinesische oder internationale Seite wählen → Konto lesen
→ Studio erstellen oder wiederverwenden → sensible Dateien prüfen → nach master synchronisieren
→ Deployment starten → Status und Protokolle prüfen → diagnostizieren und reparieren → Adresse zurückgeben
```

Prüfe zuerst privat und schalte danach öffentlich. Eine Static-Seite braucht keine kostenpflichtige Hardware. Für kostenpflichtige Ressourcen anderer Typen muss der Skill ausdrücklich um Erlaubnis bitten.

Das Token dient API-Anmeldung und Git push. Schreibe es nicht in Frontend, README, Anweisung oder teilbare Bilder.

## Manuell: Schritt 0 — Website vorbereiten

Der Skill ist bequemer. Der manuelle Weg erklärt die Studio-Oberfläche und hilft, wenn kein Agent-Werkzeug verfügbar ist.

### Fall A: einfaches HTML

`index.html` muss im Stammverzeichnis des veröffentlichten Inhalts liegen:

```text
my-site/
├── index.html
├── styles.css
├── app.js
└── images/
    └── cover.jpg
```

Teste vor der Veröffentlichung über HTTP:

```bash
cd my-site
python3 -m http.server 8000
```

Öffne `http://localhost:8000`. Ein Doppelklick auf `index.html` reicht nicht: `file://` und HTTP behandeln Module, CORS und Pfade unterschiedlich.

### Fall B: Vue, React, Vite und ähnliche

```bash
npm install
npm run build
```

| Werkzeug | Übliche Ausgabe |
| --- | --- |
| Vite / Vue + Vite / React + Vite | `dist/` |
| Create React App | `build/` |
| Vue CLI | `dist/` |

Veröffentliche den **Inhalt** der Ausgabe, sodass `index.html` direkt im Studio-Stamm liegt.

```text
Richtig: index.html
Falsch:  dist/index.html
```

Liefert CSS, JavaScript oder Bild 404, versuche eine relative Basis in Vite:

```js
// vite.config.js / vite.config.ts
export default {
  base: './'
}
```

Baue erneut. Ein statischer Host leitet nicht immer jede Route nach `index.html`; eine SPA kann Hash-Routen wie `/#/about` nutzen.

## Manuell: Schritt 1 — Studio öffnen und anmelden

Öffne [ModelScope Studio](https://modelscope.cn/studios). Oben wird der Weg von Erstellen und Aufbauen bis Veröffentlichen und Teilen gezeigt.

![ModelScope-Studio-Startseite mit dem Ablauf bis zur Veröffentlichung](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

Wähle Erstellen oder öffne [Studio erstellen](https://modelscope.cn/studios/create). Die chinesische Seite `modelscope.cn` und die internationale Seite `modelscope.ai` teilen weder Konto, Token noch Inhalt.

## Manuell: Schritt 2 — Grundinformationen eintragen

![Formular mit Besitzer, Name, Lizenz, Sichtbarkeit und Beschreibung](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

1. **Besitzer oder Organisation:** bestimmt den Besitzerteil der Adresse.
2. **Name:** Kleinbuchstaben, Zahlen und Bindestriche verwenden, etwa `my-portfolio`.
3. **Anzeigename und Beschreibung:** für Besucher verständlich schreiben.
4. **Sichtbarkeit:** zunächst privat, nach Prüfung öffentlich.
5. **Lizenz:** passend zum Projekt wählen.

Bestätige und warte, bis das Studio geöffnet wird.

## Manuell: Schritt 3 — Dateien hochladen

In einem aktiven Static Studio liegen `index.html` und `README.md` direkt im Stammverzeichnis.

![Dateiseite eines Static Studios mit index.html im Stammverzeichnis](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

Lade `index.html`, CSS, JavaScript und Bilder unter **Files** hoch. Lege sie nicht in einen zusätzlichen Ordner `dist`, `build` oder Projekt.

Manuelles Hochladen reicht für wenige Dateien. Bei vielen Dateien oder häufigen Änderungen verwende `ms-studio-deploy` zur Git-Synchronisierung.

## Manuell: Schritt 4 — Static in den Deployment-Einstellungen wählen

Öffne nach dem Hochladen die Deployment-Einstellungen des Studios und wähle **Static** als SDK-Typ. Static ist für eine vorbereitete HTML-Website vorgesehen; im selben Bereich stehen auch Gradio, Streamlit und Docker zur Auswahl.

![Auswahl von Static in den Deployment-Einstellungen](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

Prüfe erneut, dass `index.html` im Stammverzeichnis des Repositorys liegt, und speichere die Deployment-Einstellungen.

> Braucht die Seite Datenbank, geheimen API-Schlüssel oder Serverberechnung, ist sie nicht rein statisch. Nutze Gradio, Streamlit, Docker oder ein getrenntes Backend. Ein Schlüssel im Frontend-JavaScript bleibt nicht geheim.

## Manuell: Schritt 5 — Deployment abwarten und prüfen

Das Speichern der Einstellungen startet meist das Deployment. Andernfalls wähle Bereitstellen, Neustarten oder Erneut ausführen. Sobald es läuft, öffne:

```text
https://modelscope.cn/studios/dein-name/dein-studio
```

- Öffnet die Startseite?
- Laden CSS, JavaScript und Bilder?
- Zeigt die Konsole 404-, CORS- oder JavaScript-Fehler?
- Funktioniert die Seite bei mobiler Breite?
- Öffnet ein öffentliches Studio in einem abgemeldeten Fenster?

Prüfe zuerst privat, schalte dann öffentlich und teste erneut ohne Anmeldung.

## Manuell: Schritt 6 — Website aktualisieren

Nach Änderungen lokal testen und neu bauen. Ersetze unter **Files** die alten Dateien durch den neuen Inhalt aus `dist` oder `build` und stelle erneut bereit.

```text
Quellcode ändern → lokal testen → neu bauen → Studio-Dateien ersetzen
→ erneut bereitstellen → endgültige Adresse prüfen
```

Lade weder `node_modules`, Entwicklungs-Konfiguration noch das vollständige Quellprojekt hoch. Bei häufigen Updates nutze den Skill.

## Skill auch zur Fehlerbehebung verwenden

<ModelScopeTroubleshooter />

## Quellen

- [ModelScope Studio](https://modelscope.cn/studios) (Oberfläche und Bilder am 11.08.2026 geprüft)
- [ModelScope-Entwicklertreffen](https://community.modelscope.cn/683562c6870cef7360622f7f.html)
- [Offizielle `ms-hub`-Anleitung](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-hub/SKILL.md)
- [Offizieller `ms-studio-deploy` Skill](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)
- [ModelScope Hub Client](https://github.com/modelscope/modelscope_hub)
- [Öffentliches Static-Studio-Beispiel](https://modelscope.cn/studios/studio-demo-station/funasr-demo-static-multiple/summary)
