# Docker und Container: Virtualisierung

::: tip Vorwort
**"Es laeuft auf meinem Rechner" ist die klassische Ausrede von Entwicklern - Docker laesst diese Ausrede verschwinden.** Containerisierungstechnologie verpackt eine Anwendung mit all ihren Abhaengigkeiten in eine standardisierte Einheit, die konsistent in jeder Umgebung laeuft. Sie ist das Fundament der modernen Softwarebereitstellung.
:::

**Was wirst du in diesem Artikel lernen?**

Nach diesem Kapitel wirst du Folgendes koennen:

- **Kernkonzepte**: Die drei Kernkonzepte Image, Container und Registry verstehen
- **Architektur-Vergleich**: Den wesentlichen Unterschied zwischen Containern und virtuellen Maschinen begreifen
- **Praktische Faehigkeiten**: Dockerfile-Erstellung und haeufige Befehle beherrschen
- **Orchestrierungs-Grundlagen**: Multi-Service-Anwendungen mit Docker Compose verwalten
- **Best Practices**: Image-Optimierung, Sicherheitsverstaerkung und produktionsreife Praktiken kennenlernen

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | Warum Container? | Umgebungskonsistenz, Ressourceneffizienz, standardisierte Bereitstellung |
| **Kapitel 2** | Kernkonzepte | Image, Container, Registry, Dockerfile |
| **Kapitel 3** | Docker-Lebenszyklus | Schreiben, Bauen, Pushen, Ausfuehren, Verwalten |
| **Kapitel 4** | Docker Compose | Multi-Service-Orchestrierung, Netzwerk, Volumes |
| **Kapitel 5** | Best Practices | Image-Optimierung, Sicherheit, Multi-Stage-Build |

---

## 1. Warum Container

Vor der Containerisierung musste man zum Bereitstellen einer Anwendung auf dem Server manuell die Laufzeitumgebung installieren, Umgebungsvariablen konfigurieren und Abhaengigkeitskonflikte loesen. Unterschiede zwischen Umgebungen (Entwicklung, Test, Produktion) waren eine Brutstaette fuer Bugs.

<DockerArchitectureDemo />

### Welche Probleme loesen Container

| Problem | Traditioneller Ansatz | Container-Ansatz |
|------|---------|---------|
| Inkonsistente Umgebungen | "Bei mir laeufts" | Alle Abhaengigkeiten verpacken, ueberall konsistent |
| Abhaengigkeitskonflikte | App A braucht Node 14, App B braucht Node 18 | Jeder Container hat eine isolierte Umgebung |
| Ressourcenverschwendung | Jede VM ein komplettes Betriebssystem | Kernel geteilt, MB-grosser Overhead |
| Langsames Deployment | Manuelle Installation und Konfiguration | `docker run` - ein Befehl genuegt |
| Schwierige Skalierung | Neue VM, Umgebung einrichten, deployen | Neuen Container in Sekunden starten |

::: tip Die Essenz von Containern
Container sind keine leichtgewichtigen virtuellen Maschinen. Ihre Essenz sind **isolierte Prozesse**. Der Linux-Kernel realisiert Containerisierung durch zwei Mechanismen:
- **Namespaces**: Isolieren die Sichtweise von Prozessen (PID, Netzwerk, Dateisystem etc.)
- **Cgroups**: Beschraenken die Ressourcennutzung von Prozessen (CPU, Speicher, I/O)

Prozesse in einem Container unterscheiden sich nicht wesentlich von gewoehnlichen Prozessen auf dem Host - sie sind nur in einen "Raum eingesperrt, von dem aus man nichts draussen sehen kann".
:::

---

## 2. Kernkonzepte

Die Docker-Welt dreht sich um drei Kernkonzepte: Image, Container und Registry.

| Konzept | Analogie | Beschreibung |
|------|------|------|
| Image (Image) | Klasse / Vorlage | Schreibgeschuetzte Anwendungsvorlage mit Code, Laufzeit, Bibliotheken, Konfiguration |
| Container (Container) | Instanz / Objekt | Laufende Instanz eines Images, les- und schreibbar, eigenstaendiger Lebenszyklus |
| Registry (Registry) | App Store | Dienst zum Speichern und Verteilen von Images (Docker Hub, ACR, ECR) |
| Dockerfile | Rezept / Bauplan | Textdatei, die definiert, wie ein Image erstellt wird |
| Volume (Volume) | Externe Festplatte | Persistente Daten, die beim Loeschen des Containers nicht verloren gehen |

### Der mehrschichtige Aufbau von Images

Docker-Images bestehen aus mehreren schreibgeschuetzten Schichten (Layers). Jede Dockerfile-Anweisung erstellt eine Schicht:

```
┌─────────────────────────┐
│  CMD ["node", "app.js"] │  <- Startbefehl-Schicht
├─────────────────────────┤
│  COPY . /app            │  <- Anwendungscode-Schicht (haeufige Aenderungen)
├─────────────────────────┤
│  RUN npm install        │  <- Abhaengigkeits-Schicht (gelegentliche Aenderungen)
├─────────────────────────┤
│  FROM node:18-alpine    │  <- Basis-Image-Schicht (selten Aenderungen)
└─────────────────────────┘
```

::: tip Warum ist die Schichtung wichtig?
Docker cacht jede Schicht. Wenn sich eine Schicht nicht geaendert hat, wird der Cache beim Bauen direkt wiederverwendet. Daher sollte im Dockerfile **wenig haeufig geaenderte Anweisungen weiter oben** stehen (wie Abhaengigkeits-Installation) und **haeufig geaenderte weiter unten** (wie Code kopieren). So koennen die meisten Builds den Cache nutzen und sind deutlich schneller.
:::

---

## 3. Docker-Lebenszyklus

Von der Dockerfile-Erstellung bis zum laufenden Container ist der Docker-Workflow eine klar strukturierte Pipeline.

<DockerLifecycleDemo />

### Dockerfile-Befehlsreferenz

| Befehl | Funktion | Beispiel |
|------|------|------|
| `FROM` | Basis-Image festlegen | `FROM node:18-alpine` |
| `WORKDIR` | Arbeitsverzeichnis setzen | `WORKDIR /app` |
| `COPY` | Dateien ins Image kopieren | `COPY package.json ./` |
| `RUN` | Befehl beim Bauen ausfuehren | `RUN npm install` |
| `ENV` | Umgebungsvariable setzen | `ENV NODE_ENV=production` |
| `EXPOSE` | Port erklaeren (nur Dokumentation) | `EXPOSE 3000` |
| `CMD` | Container-Startbefehl | `CMD ["node", "app.js"]` |
| `ENTRYPOINT` | Container-Einstiegspunkt (schwer zu ueberschreiben) | `ENTRYPOINT ["nginx"]` |

---

## 4. Docker Compose: Multi-Service-Orchestrierung

Echte Projekte bestehen selten aus nur einem Container. Eine Webanwendung benoetigt moeglicherweise: Anwendungsserver + Datenbank + Redis + Nginx. Docker Compose definiert und verwaltet mehrere Container ueber eine einzige YAML-Datei.

### docker-compose.yml Beispiel

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret

  redis:
    image: redis:7-alpine

volumes:
  db-data:
```

### Kernkonzepte von Compose

| Konzept | Beschreibung | Beispiel |
|------|------|------|
| services | Definiert die einzelnen Container-Dienste | app, db, redis |
| volumes | Persistente Datenvolumes | db-data fuer Datenbankdateien |
| networks | Benutzerdefiniertes Netzwerk (automatisch erstellt) | Services kommunizieren ueber Servicenamen |
| depends_on | Startreihenfolge-Abhaengigkeiten | app haengt von db und redis ab |
| environment | Umgebungsvariablen | Datenbankpasswort, Verbindungsadresse |

::: tip Service Discovery
In Docker Compose ist der Servicename gleichzeitig der Hostname. Der app-Container kann die Datenbank direkt ueber `db:5432` und Redis ueber `redis:6379` ansprechen, ohne die IP-Adresse zu kennen. Das ist dem integrierten DNS von Docker zu verdanken.
:::

---

## 5. Best Practices

### 5.1 Multi-Stage-Build (Mehrstufiger Build)

Der Multi-Stage-Build ist ein leistungsstarkes Werkzeug zur Optimierung der Image-Groesse. In der Build-Phase werden alle Werkzeuge und Abhaengigkeiten installiert, im finalen Stage werden nur die fuer die Laufzeit benoetigten Dateien beibehalten.

```dockerfile
# Build-Phase
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Laufzeit-Phase
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 5.2 Image-Optimierungs-Checkliste

| Optimierung | Vorgehen | Effekt |
|--------|------|------|
| Kleines Basis-Image waehlen | `alpine` statt `ubuntu` | Image von ~200 MB auf ~50 MB reduziert |
| RUN-Befehle zusammenfassen | Mehrere Befehle mit `&&` verbinden | Weniger Image-Schichten |
| .dockerignore verwenden | node_modules, .git etc. ausschliessen | Schnelleres Bauen, kleinerer Kontext |
| Multi-Stage-Build | Build- und Laufzeitumgebung trennen | Keine Build-Tools im finalen Image |
| Versionsnummern fixieren | `node:18.17-alpine` statt `node:latest` | Reproduzierbare Builds |

### 5.3 Sicherheitsmassnahmen

| Massnahme | Beschreibung |
|------|------|
| Nicht als Root ausfuehren | `USER node` fuer nicht-Root-Benutzer |
| Schwachstellen scannen | `docker scout` oder Trivy zum Image-Scanning |
| Minimale Berechtigungen | Nur notwendige Pakete installieren, keine Debug-Tools |
| Keine hartcodierten Secrets | Umgebungsvariablen oder Docker Secrets verwenden |
| Basis-Images regelmaessig aktualisieren | Sicherheitsluecken zeitnah schliessen |

---

## Zusammenfassung

Docker-Containerisierung ist die Infrastruktur der modernen Softwarebereitstellung - sie zu verstehen ist fuer jeden Entwickler unerlaesslich.

Die wichtigsten Punkte dieses Kapitels:

1. **Container vs. VM**: Container teilen sich den Host-Kernel, sind leichter und schneller, aber die Isolierung ist etwas schwaecher als bei VMs
2. **Die drei Kernkomponenten**: Image (Vorlage), Container (Instanz), Registry (Verteilung)
3. **Dockerfile**: Schichtweiser Aufbau, Cache nutzen, seltener geaenderte Anweisungen nach oben
4. **Docker Compose**: Multi-Service-Anwendung per YAML definieren, Servicename als Hostname
5. **Produktionspraktiken**: Multi-Stage-Build fuer kleinere Images, Alpine-Basis-Image, nicht als Root ausfuehren

## Weiterfuehrende Literatur

- [Docker Offizielle Dokumentation](https://docs.docker.com/) - Die autoritativste Referenz
- [Docker Getting Started](https://docs.docker.com/get-started/) - Offizielles Einsteiger-Tutorial
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) - Offizieller Leitfaden fuer Best Practices
- [Docker Compose Dokumentation](https://docs.docker.com/compose/) - Komplette Compose-Referenz
