---
title: Website auf ModelScope veröffentlichen
description: Veröffentliche statische HTML-, Vue-, React- oder Vite-Seiten mit ModelScope Studio und dem offiziellen Deployment-Skill.
---

# Website auf ModelScope veröffentlichen

Wenn die Seite lokal funktioniert, brauchst du eine Adresse, die andere öffnen können. In diesem Anhang veröffentlichen wir sie über **ModelScope Studio**, ohne zuerst einen eigenen Server einzurichten.

## 1. Festlegen, was veröffentlicht wird

| Projekt | Studio-Typ | Vorbereitung |
| --- | --- | --- |
| HTML, CSS und JavaScript | Static | Webdateien mit `index.html` im Stammverzeichnis |
| Vue, React, Vite oder Svelte | Static | Inhalt von `dist` oder `build` nach dem Build |
| Gradio oder Streamlit | Passender Typ | Python-Einstieg und Abhängigkeiten |
| Backend oder besondere Systempakete | Docker | Dockerfile und startbarer Dienst |

Bei Framework-Projekten veröffentlichst du das **Build-Ergebnis**, nicht den Quellordner.

## 2. Offiziellen Deployment-Skill verwenden

Die [offiziellen ModelScope Skills](https://github.com/modelscope/modelscope-skills) enthalten `ms-studio-deploy`. Er erkennt das Projekt, erstellt das Studio, synchronisiert Dateien, stellt bereit und prüft Protokolle.

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

Hole ein Token unter [Access Tokens](https://modelscope.cn/my/myaccesstoken) und bewahre es nur lokal auf. Schreibe es nicht in die Webseite, README oder Screenshots.

Für Vite zuerst bauen:

```bash
npm run build
cd dist
```

Öffne den Ausgabeordner im KI-Werkzeug und sage:

```text
Veröffentliche diesen Ordner mit dem ms-studio-deploy Skill in einem Static Studio auf ModelScope. Sende mir den Link, wenn er funktioniert.
```

## 3. Manuell über die Webseite veröffentlichen

Öffne [ModelScope Studio](https://modelscope.cn/studios) und melde dich an.

![Startseite von ModelScope Studio](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

Trage unter [Studio erstellen](https://modelscope.cn/studios/create) Besitzer, Namen, Beschreibung und Sichtbarkeit ein.

![Formular zum Erstellen eines Studios](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

Wähle **Static** als SDK-Typ.

![Auswahl des Typs Static](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

Öffne danach die Dateiseite und lade `index.html`, CSS, JavaScript und Bilder hoch. `index.html` muss direkt im Stammverzeichnis liegen, nicht in einem zusätzlichen `dist`-Ordner.

![Dateien eines Static Studios](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

Speichere und warte auf die Bereitstellung. Prüfe über den endgültigen Link Startseite, Stile, Bilder, mobile Breite und Browserkonsole. Ein öffentliches Studio sollte auch abgemeldet öffnen.

## 4. Aktualisieren und Fehler beheben

Nach Änderungen lokal testen, neu bauen, veröffentlichte Dateien ersetzen und erneut bereitstellen.

- Stile oder Bilder fehlen: Pfade und Vites `base` prüfen;
- Route liefert nach Neuladen 404: Hash-Router erwägen;
- nur Dateiliste sichtbar: `index.html` im Stammverzeichnis prüfen;
- geheimer API-Schlüssel nötig: nicht im Frontend speichern, sondern ein Backend verwenden.

Offizielle Quellen: [ModelScope Studio](https://modelscope.cn/studios), [ModelScope Skills](https://github.com/modelscope/modelscope-skills) und [`ms-studio-deploy`](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md).
