# Domänenspezifische Sprachen: DSL-Grundlagen

::: tip Vorwort
In einem realen Fall baute Ingenieur Armin in seinem neuen Unternehmen mit KI eine Infrastrukturdienstleistung mit insgesamt ca. 40.000 Zeilen Code (Go + YAML + Pulumi + SDK-Klebe-Code), wobei über 90% von KI generiert wurden. In diesem Fall tauchten viele Begriffe auf, die Anfängern nicht vertraut sind: YAML, Pulumi, HCL, Lua, SDK-Klebe-Code... Sie sind weder Python noch JavaScript, aber in Backend-Projekten allgegenwärtig. Dieser Artikel führt diese Technologien systematisch aus einer einheitlichen Perspektive ein: **Domänenspezifische Sprachen (DSL)**.
:::

**Lernziele dieses Artikels**

In der Backend-Entwicklung gibt es neben der mit allgemeinen Programmiersprachen (Python, Go, Java usw.) geschriebenen Geschäftslogik eine Vielzahl von **unterschiedlich verwendeten, unterschiedlich syntaktischen Dateien und Code, die nicht zu den allgemeinen Programmiersprachen gehören**. Sie haben einen gemeinsamen Überbegriff: **DSL (Domain-Specific Language, domänenspezifische Sprache)**.

Nach Abschluss dieses Artikels wirst du in der Lage sein:

- Den wesentlichen Unterschied zwischen DSL und allgemeinen Programmiersprachen (GPL) zu verstehen
- Das Klassifikationssystem von DSL zu beherrschen: Daten-Serialisierungsformate, eingebettete Skriptsprachen, Infrastrukturdefinitionssprachen
- Die Anwendungsszenarien von Datenformaten wie XML, JSON, YAML, TOML, CSV, Protobuf zu unterscheiden
- Den Designzweck von eingebetteten Skriptsprachen wie Lua zu verstehen
- Die Prinzipien und Unterschiede von Terraform (HCL) und Pulumi zu erklären
- Die Funktionsweise der OpenAPI-Spezifikation und der automatischen SDK-Generierung zu verstehen
- Zu beurteilen, welche Arten von Code sich für die KI-generierung eignen

| Kapitel | Thema | Kernkonzept |
|-----|------|---------|
| **Kapitel 1** | DSL-Überblick | Definition von DSL vs. GPL, Klassifikationssystem und Panorama |
| **Kapitel 2** | Daten-Serialisierungsformate | XML, JSON, YAML, TOML, CSV, Protobuf usw. |
| **Kapitel 3** | Eingebettete Skriptsprachen | Designphilosophie und typische Anwendungen von Lua und anderen Sprachen |
| **Kapitel 4** | Infrastructure as Code | Prinzipien und Vergleich von Terraform (HCL), Pulumi |
| **Kapitel 5** | Klebe-Code und SDK-Generierung | OpenAPI-Spezifikation und automatische Client-Code-Generierung |
| **Kapitel 6** | KI und DSL | Warum KI besonders gut darin ist, DSL-Code zu generieren |

---

## 1. DSL-Überblick: Eine andere Welt jenseits der allgemeinen Sprachen

### 1.1 Was ist eine DSL

**DSL (Domain-Specific Language, domänenspezifische Sprache)** ist eine Sprache, die für ein bestimmtes Gebiet oder eine bestimmte Aufgabe entwickelt wurde. Das Gegenteil ist die **GPL (General-Purpose Language, allgemeine Programmiersprache)** wie Python, Java, Go, C++ usw. — sie wurden entwickelt, um beliebige Rechenprobleme zu lösen.

Der Kernunterschied zwischen beiden:

| Dimension | GPL (Allgemeine Programmiersprache) | DSL (Domänenspezifische Sprache) |
|------|-------------------|-------------------|
| **Designziel** | Beliebige Rechenprobleme lösen | Probleme eines bestimmten Bereichs lösen |
| **Ausdrucksumfang** | Turing-vollständig, kann theoretisch alles berechnen | Der Ausdrucksumfang ist bewusst eingeschränkt |
| **Lernkosten** | Höher, erfordert Verständnis des gesamten Sprachsystems | Niedriger, nur die Konzepte des jeweiligen Bereichs verstehen |
| **Typische Vertreter** | Python, Java, Go, C++, JavaScript | SQL, HTML/CSS, Reguläre Ausdrücke, YAML, HCL |

Du verwendest bereits längst DSLs:

- **SQL** ist eine DSL für den Bereich der Datenbankabfragen — du verwendest `SELECT * FROM users WHERE age > 18` zur Datenabfrage statt in Python eine manuelle Iterationslogik zu schreiben
- **HTML/CSS** sind DSLs für den Bereich der Webseitenstruktur und -gestaltung — du beschreibst Seiten mit Tags und Attributen statt in C++ Pixel zu manipulieren
- **Reguläre Ausdrücke** sind eine DSL für den Bereich der Textmustererkennung — du verwendest `\d{3}-\d{4}` zur Telefondarstellung statt manuelle Zeichenvergleichsschleifen zu schreiben

### 1.2 Klassifikation von DSLs

DSLs können nach ihrer "Turing-Vollständigkeit" in zwei Hauptkategorien unterteilt werden:

**Externe DSL (External DSL)**

Besitzen eine unabhängige Syntax und einen eigenen Parser und sind an keine allgemeine Programmiersprache gebunden. Der vom Benutzer geschriebene Code wird von einem speziellen Interpreter oder Compiler verarbeitet.

- Rein datenbeschreibend: JSON, YAML, XML, TOML, CSV, Protobuf (enthalten keine Logik)
- Abfrage-/Operationstyp: SQL, GraphQL, Reguläre Ausdrücke (begrenzte Logikfähigkeit)
- Domänenmodellierung: HCL (Terraform), Dockerfile, Nginx-Konfigurationssyntax (deklarative Beschreibung des Zustands eines bestimmten Bereichs)

**Interne DSL (Internal DSL / Embedded DSL)**

Existieren innerhalb einer allgemeinen Programmiersprache und nutzen die Syntax der Hostsprache, um domänenspezifische Ausdrucksweisen zu konstruieren. Der Code selbst ist gültiger Code der Hostsprache, liest sich aber wie eine spezielle Sprache.

- Pulumi (geschrieben in TypeScript/Python/Go, aber die API liest sich wie deklarative Konfiguration)
- Ruby on Rails-Routendefinitionen (`get '/users', to: 'users#index'`, gültiger Ruby-Code, liest sich aber wie Konfiguration)
- Assertion-Syntax in Test-Frameworks (`expect(value).toBe(42)`, gültiges JavaScript, liest sich aber wie natürliche Sprache)

### 1.3 Panorama der DSLs in Backend-Projekten

In einem typischen Backend-Projekt begegnest du folgenden Arten von DSLs:

```
DSL in Backend-Projekten
├── Daten-Serialisierungsformate (Datenstrukturen beschreiben)
│   ├── Textformate: JSON, YAML, XML, TOML, CSV, INI
│   └── Binärformate: Protobuf, MessagePack, Avro, BSON
├── Eingebettete Skriptsprachen (programmierbare Konfigurationsschicht)
│   ├── Lua (Spiel-Engines, Nginx, Redis)
│   ├── GDScript (Godot-Engine)
│   └── Jsonnet (Konfigurationsvorlagen-Generierung)
├── Infrastruktur- und Betriebs-DSL (deklarative Beschreibung des Systemzustands)
│   ├── HCL (Terraform)
│   ├── Dockerfile / Docker Compose YAML
│   └── Nginx / Apache-Konfigurationssyntax
└── Schnittstellenbeschreibungssprachen (API-Verträge beschreiben)
    ├── OpenAPI / Swagger
    ├── Protocol Buffers (.proto-Dateien)
    └── GraphQL Schema
```

Wenn du dieses Panorama verstanden hast, werden die folgenden Kapitel jeden Zweig im Detail entfalten.

---

## 2. Daten-Serialisierungsformate: Strukturierte Daten mit Text beschreiben

### 2.1 Was ist Daten-Serialisierung

**Serialisierung (Serialization)** ist der Prozess der Umwandlung von Datenstrukturen im Arbeitsspeicher (Objekte, Dictionaries, Arrays usw.) in ein speicherbares oder übertragbares Text-/Bytestromformat. Die Rückwandlung aus Text-/Bytestrom in Datenstrukturen im Arbeitsspeicher wird als **Deserialisierung (Deserialization)** bezeichnet.

Daten-Serialisierungsformate sind die grundlegendste Art von DSL — sie gehören zu den rein datenbeschreibenden externen DSLs, besitzen keine Logikfähigkeiten und beschreiben nur statisch, "welche Werte vorhanden sind".

### 2.2 Warum werden diese Formate benötigt

Angenommen, du entwickelst einen Backend-Service mit der Datenbankadresse `localhost:5432`. Wenn du diese Adresse fest im Quellcode hinterlegst, funktioniert das bei der lokalen Entwicklung problemlos. Bei der Bereitstellung in der Produktionsumgebung ändert sich die Datenbankadresse jedoch zu `db.prod.company.com:5432`, und du musst den Quellcode ändern und neu kompilieren.

Die gängige Praxis im Engineering ist: **Veränderliche Parameter aus dem Code herauslösen und in separaten Konfigurationsdateien speichern.** Das Programm liest die Konfigurationsdatei beim Start und entscheidet anhand der Werte über sein Verhalten.

Neben der Konfiguration werden Daten-Serialisierungsformate auch weit verbreitet eingesetzt für: Datenaustausch zwischen Systemen (API-Anfragen/-Antworten), persistente Datenspeicherung, sprachübergreifende Kommunikation usw.

### 2.3 Menschenlesbare Textformate

Im Folgenden werden die im Engineering gebräuchlichsten Text-Serialisierungsformate in chronologischer Reihenfolge vorgestellt.

**INI**

Das älteste Konfigurationsformat, ursprünglich aus Windows-Systemen. Einfache Struktur aus Sektionen (sections) und Schlüssel-Wert-Paaren:

```ini
[database]
host = localhost
port = 5432

[server]
debug = true
```

Der Vorteil ist die hohe Lesbarkeit. Die Einschränkung liegt darin, dass keine verschachtelten Strukturen und Array-Typen unterstützt werden und komplexe Konfigurationen nicht abgebildet werden können. Hauptsächlich noch in Legacy-Systemen und einigen Linux-Konfigurationen (wie `php.ini`, `my.cnf`) anzutreffen.

**CSV**

**CSV (Comma-Separated Values, kommagetrennte Werte)** ist das einfachste Tabellendatenformat:

```csv
name,age,city
Anna,30,Berlin
Bob,25,München
```

Jede Zeile ist ein Datensatz, Felder werden durch Kommas getrennt. CSV wird weit verbreitet für Daten-Import/-Export, Tabellenkalkulationsaustausch und Datenanalyse-Pipelines. Die Einschränkung: Es können nur flache zweidimensionale Tabellen abgebildet werden, verschachtelte Strukturen werden nicht unterstützt und es gibt keine Typinformationen (alle Werte sind Strings).

**XML**

**XML (eXtensible Markup Language, erweiterbare Auszeichnungssprache)** wurde 1998 eingeführt und war lange der dominante Standard für den Datenaustausch:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
  <database>
    <host>localhost</host>
    <port>5432</port>
  </database>
  <server>
    <debug>true</debug>
    <allowed_origins>
      <origin>https://example.com</origin>
      <origin>https://app.example.com</origin>
    </allowed_origins>
  </server>
</config>
```

XML ist sehr ausdrucksstark und unterstützt Verschachtelung, Attribute, Namespaces, Schema-Validierung und andere fortgeschrittene Funktionen. Die Syntax ist jedoch冗长 — viele öffnende und schließende Tags führen zu einem niedrigen Signal-Rausch-Verhältnis, und das manuelle Schreiben und Lesen ist wenig angenehm.

XML wird in folgenden Bereichen weiterhin intensiv genutzt:
- Java-Ökosystem (Mavens `pom.xml`, Spring-Konfiguration, Android-Layout-Dateien)
- Unternehmenskritische Web-Services (SOAP-Protokoll)
- Büro-Dokumentformate (`.docx`, `.xlsx` sind im Wesentlichen ZIP-komprimierte XML-Dateisammlungen)
- RSS/Atom-Feeds, SVG-Vektorgrafiken

**JSON**

**JSON (JavaScript Object Notation)** wurde 2001 eingeführt und hat XML aufgrund seiner Einfachheit schnell als De-facto-Standard für den Web-API-Datenaustausch abgelöst:

```json
{
  "database": {
    "host": "localhost",
    "port": 5432
  },
  "server": {
    "debug": true
  }
}
```

Vorteile sind die klare Struktur und native Parsing-Unterstützung in fast allen Programmiersprachen. Der Hauptnachteil ist, dass **Kommentare nicht unterstützt werden** und die vielen Klammern und Anführungszeichen beim manuellen Schreiben fehleranfällig sind. JSON ist auch das Standardformat für Frontend-Projektkonfigurationen (`package.json`, `tsconfig.json`).

**YAML**

**YAML (YAML Ain't Markup Language)** wurde ebenfalls 2001 eingeführt und ist heute das am weitesten verbreitete Konfigurationsformat im Backend- und DevOps-Bereich. Docker Compose, Kubernetes, GitHub Actions und andere Tools verwenden YAML:

```yaml
# Datenbankkonfiguration
database:
  host: localhost
  port: 5432

# Serverkonfiguration
server:
  debug: true
  allowed_origins:
    - https://example.com
    - https://app.example.com
```

Vorteile: Unterstützt Kommentare, einfache Syntax, kann komplexe Verschachtelungen ausdrücken. Nachteil: **Hängt von Einrückungen ab**, um Hierarchiebeziehungen darzustellen, und Einrückungsfehler führen zu Parsing-Fehlern — das ist das häufigste Problem für Anfänger.

> Ergänzung: Der vollständige Name "YAML Ain't Markup Language" ist ein rekursives Akronym.

**TOML**

**TOML (Tom's Obvious Minimal Language)** wurde 2013 eingeführt und wird vom Rust-Paketmanager Cargo und Pythons `pyproject.toml` verwendet:

```toml
[database]
host = "localhost"
port = 5432

[server]
debug = true
allowed_origins = [
  "https://example.com",
  "https://app.example.com"
]
```

TOML versucht, die Einfachheit von INI mit der Ausdrucksstärke von YAML zu verbinden und gleichzeitig die durch Einrückungssensibilität verursachten Probleme zu vermeiden.

### 2.4 Binäre Serialisierungsformate

Die oben genannten Formate sind alle menschenlesbar. In Szenarien mit höheren Performance- und Größenanforderungen gibt es zudem **binäre Serialisierungsformate** — sie opfern Lesbarkeit für geringeres Volumen und schnellere Parsing-Geschwindigkeit.

| Format | Entwickler | Merkmale | Typisches Einsatzszenario |
|------|-------|------|------------|
| **Protocol Buffers (Protobuf)** | Google | Erfordert vordefinierte `.proto`-Schema-Datei, stark typisiert, extrem kleines Volumen | gRPC-Kommunikation, Google-interne Dienste, hochperformante Mikrodienste |
| **MessagePack** | Community | Binärversion von JSON, kein Schema erforderlich | Redis-internes Encoding, sprachübergreifende Hochleistungskommunikation |
| **Avro** | Apache | Unterstützt Schema-Evolution, geeignet für Big-Data-Szenarien | Hadoop / Kafka-Ökosystem-Datenserialisierung |
| **BSON** | MongoDB | Binäre JSON-Erweiterung, unterstützt mehr Datentypen | MongoDB-internes Speicherformat |

Am Beispiel von Protocol Buffers muss zunächst ein Schema definiert werden:

```protobuf
// user.proto
syntax = "proto3";

message User {
  string name = 1;
  int32 age = 2;
  string email = 3;
}
```

Anschließend generiert der Compiler (`protoc`) automatisch Serialisierungs-/Deserialisierungscode für verschiedene Sprachen. Dieses Muster der "Schema-zuerst-definieren, dann-Code-generieren" entspricht dem unten vorgestellten Ansatz der OpenAPI-SDK-Generierung.

### 2.5 Vollständiger Vergleich

| Format | Typ | Einführungsjahr | Lesbarkeit | Kommentare unterstützt | Typisches Einsatzszenario |
|------|------|---------|--------|---------|------------|
| **INI** | Text | 1980er | Hoch | Ja | Systemkonfiguration, Legacy-Projekte |
| **CSV** | Text | 1972 | Hoch | Nein | Daten-Import/-Export, Tabellenaustausch |
| **XML** | Text | 1998 | Mittel | Ja | Java-Ökosystem, Unternehmenskritische Web-Services, Dokumentformate |
| **JSON** | Text | 2001 | Hoch | Nein | Web-API-Datenaustausch, Frontend-Konfiguration |
| **YAML** | Text | 2001 | Hoch | Ja | Docker, K8s, CI/CD, Backend-Service-Konfiguration |
| **TOML** | Text | 2013 | Hoch | Ja | Rust / Python-Projektkonfiguration |
| **Protobuf** | Binär | 2008 | Keine | — | gRPC, hochperformante Mikrodienst-Kommunikation |
| **MessagePack** | Binär | 2008 | Keine | — | Hochperformante sprachübergreifende Kommunikation |
| **Avro** | Binär | 2009 | Keine | — | Hadoop / Kafka Big-Data-Pipelines |
| **BSON** | Binär | 2009 | Keine | — | MongoDB-interne Speicherung |

**Kernpunkte**: Die wesentliche Funktion all dieser Formate ist dieselbe — **strukturierte Daten in eine speicherbare, übertragbare Form umzuwandeln**. Textformate priorisieren menschliche Lesbarkeit und einfache Bearbeitung; Binärformate priorisieren Parsing-Performance und Übertragungsvolumen. Die Wahl des Formats hängt von der Abwägung der Anforderungen im spezifischen Szenario ab.


---

## 3. Eingebettete Skriptsprachen: Die programmierbare Konfigurationsschicht

### 3.1 Begriffsbestimmung

Python, JavaScript, Go und andere Sprachen sind allgemeine Programmiersprachen (General-Purpose Language), die eigenständig laufen und vollständige Anwendungen erstellen können.

Davon unterschieden gibt es eine Kategorie von Sprachen, die **speziell dafür entwickelt wurden, in andere Host-Programme eingebettet zu werden** und dem Host-Programm programmierbare Erweiterungsmöglichkeiten zu bieten. Diese Sprachen werden als **eingebettete Skriptsprachen (Embedded Scripting Language)** bezeichnet.

Sie lösen ein Kernproblem: **Wenn die Ausdrucksstärke statischer Konfigurationsdateien (YAML/JSON) nicht ausreicht und bedingte Logik, Schleifen usw. benötigt werden, wie kann man dynamisches Verhalten implementieren, ohne den Quellcode des Host-Programms zu ändern?**

### 3.2 Lua: Die repräsentativste eingebettete Skriptsprache

Lua (portugiesisch für "Mond") ist eine äußerst leichte Skriptsprache, deren gesamter Interpreter nach der Kompilierung nur wenige hundert KB groß ist. Ihr Designziel ist nicht der eigenständige Betrieb, sondern die Funktion als einbettbare Erweiterungsschicht.

Typische Anwendungsszenarien von Lua:

- **Spiel-Engines**: Das Plugin-System von World of Warcraft, die Spielskripte von Roblox verwenden alle Lua. Die Spiel-Engine implementiert Kern-Rendering und Physik-Berechnungen in C/C++ und überlässt häufig geänderte Teile wie Level-Logik und NPC-Dialoge den Lua-Skripten. So können Designer Spielinhalte ändern, ohne die Engine neu kompilieren zu müssen.

- **Web-Server**: OpenResty bettet Lua in Nginx ein und ermöglicht es Betriebsmannschaften, Anfrage-Filterung, Rate-Limiting und Authentifizierung mit Lua-Skripten zu implementieren, ohne den C-Quellcode von Nginx zu ändern.

- **Datenbanken**: Redis unterstützt das Senden von Lua-Skripten zur serverseitigen Ausführung für Verbundoperationen, die Atomizitätsgarantien erfordern (wie "erst lesen, dann schreiben").

Hier ein Beispiel für ein Lua-Skript, das in Nginx (OpenResty) eingebettet ist:

```lua
-- Funktion: Token-Authentifizierung für den Pfad /api/secret
local uri = ngx.var.uri
local token = ngx.req.get_headers()["Authorization"]

if uri == "/api/secret" and token ~= "Bearer my-secret-token" then
    ngx.status = 403
    ngx.say("Access denied")
    return ngx.exit(403)
end
```

### 3.3 Weitere eingebettete Skriptsprachen

| Sprache | Host-Umgebung | Typischer Verwendungszweck |
|------|---------|---------|
| **Lua** | Spiel-Engines, Nginx (OpenResty), Redis | Spiellogik, Gateway-Richtlinien, Cache-Operationen |
| **VimScript / Lua** | Vim / Neovim-Editor | Editor-Plugin-Entwicklung |
| **Emacs Lisp** | Emacs-Editor | Editor-Verhaltensanpassung |
| **GDScript** | Godot-Spiel-Engine | Spiellogik-Skripte |
| **Jsonnet** | Kubernetes-Ökosystem / Konfigurationsgenerierungstools | Vorlagenbasierte Generierung großer Mengen ähnlicher JSON/YAML-Konfigurationen |

**Kernpunkte**: Eingebettete Skriptsprachen in der DSL-Klassifikation befinden sich in der **Grenzzone zwischen interner DSL und externer DSL** — sie sind eigenständige Sprachen (mit eigener Syntax und eigenem Interpreter), aber ihr Designziel ist die Einbettung in Host-Programme, nicht der eigenständige Aufbau von Anwendungen. Sie füllen die Lücke zwischen "statischen Konfigurationsdateien" (rein datenbeschreibende DSL) und "allgemeinen Programmiersprachen" (GPL): Wenn Konfigurationen Logik ausdrücken müssen (bedingte Anweisungen, Schleifen, Funktionsaufrufe), ist die Einbettung einer leichten Skriptsprache die Standardlösung im Engineering.


---

## 4. Infrastructure as Code

### 4.1 Was ist "Infrastruktur"

Im Backend-Engineering bezeichnet "Infrastruktur" (Infrastructure) die zugrundeliegenden Ressourcen, von denen das Funktionieren einer Anwendung abhängt:

- Rechenressourcen: Server (virtuelle Maschinen oder Container)
- Datenspeicherung: Datenbankinstanzen, Objektspeicher-Buckets
- Netzwerk: Firewall-Regeln, Load Balancer, DNS-Konfiguration
- Middleware: Nachrichtenwarteschlangen, Cache-Cluster

Im Zeitalter des Cloud Computing werden diese Ressourcen über die Konsolen der Cloud-Anbieter (wie AWS, Alibaba Cloud, Tencent Cloud) in grafischen Oberflächen erstellt und verwaltet.

### 4.2 Grenzen der manuellen Verwaltung

Die manuelle Bedienung über die Konsole ist in kleinen Projekten machbar, aber mit wachsendem Projektumfang zeigen sich folgende Probleme:

1. **Nicht wiederholbar**: Operationsschritte werden nicht dokumentiert, dieselbe Umgebung kann nicht exakt reproduziert werden
2. **Nicht auditierbar**: Es ist nicht nachvollziehbar, "wer wann was geändert hat"
3. **Nicht kollaborativ**: Operationsprozesse können nicht in die Versionskontrolle einbezogen werden, kein Code-Review möglich
4. **Fehleranfällig**: Manuelle Eingriffe bergen in Produktionsumgebungen das Risiko von Fehlbedienungen

Die Kernidee von **Infrastructure as Code (IaC)** lautet: **Infrastrukturressourcen deklarativ mit Code definieren, um Versionskontrolle, automatische Ausführung und wiederholbare Bereitstellung zu ermöglichen.**

### 4.3 Terraform

Terraform ist das derzeit am weitesten verbreitete IaC-Tool, entwickelt von HashiCorp. Es verwendet die spezielle Sprache **HCL (HashiCorp Configuration Language)**.

Terraform verfolgt einen **deklarativen** Ansatz: Der Benutzer beschreibt den gewünschten Endzustand, und Terraform berechnet automatisch die erforderlichen Operationen vom aktuellen Zustand zum Zielzustand.

```hcl
# Einen Cloud-Server definieren
resource "aws_instance" "my_server" {
  ami           = "ami-0c55b159cbfafe1f0"  # Betriebssystem-Image
  instance_type = "t3.micro"               # Instanz-Spezifikation

  tags = {
    Name = "my-first-server"
  }
}

# Eine PostgreSQL-Datenbankinstanz definieren
resource "aws_db_instance" "my_database" {
  engine         = "postgres"
  instance_class = "db.t3.micro"
  username       = "admin"
  password       = "please-use-secrets-manager"
}
```

Ausführungsprozess:

```bash
terraform plan    # Vorschau der auszuführenden Änderungen
terraform apply   # Bestätigen und ausführen, automatische Ressourcenerstellung in der Cloud-Plattform
```

### 4.4 Pulumi

Pulumi bietet einen anderen Ansatz: **Direkte Verwendung allgemeiner Programmiersprachen (TypeScript, Python, Go usw.) zur Definition der Infrastruktur**, anstatt eine spezielle HCL-Syntax zu lernen.

Dieselbe Serverdefinition mit Pulumi + TypeScript:

```typescript
import * as aws from "@pulumi/aws";

const server = new aws.ec2.Instance("my-server", {
    ami: "ami-0c55b159cbfafe1f0",
    instanceType: "t3.micro",
    tags: { Name: "my-first-server" },
});

const bucket = new aws.s3.Bucket("my-bucket", {
    acl: "private",
});

export const serverIp = server.publicIp;
```

Da eine allgemeine Programmiersprache verwendet wird, können Entwickler Schleifen, bedingte Anweisungen, Funktionsabstraktionen und andere Sprachfunktionen für komplexe Infrastrukturlogik nutzen.

### 4.5 Vergleich zwischen Terraform und Pulumi

| Dimension | Terraform | Pulumi |
|------|-----------|--------|
| **Sprache** | HCL (spezielle Sprache) | TypeScript / Python / Go und andere allgemeine Sprachen |
| **Lernkosten** | HCL-Syntax muss gelernt werden | Bereits beherrschte Programmiersprachen nutzbar, niedrigere Lernkosten |
| **Community-Ökosystem** | Sehr ausgereift, fast alle Cloud-Anbieter abgedeckt | Schnell wachsend, aber kleiner als Terraform |
| **Einsatzszenario** | Infrastrukturverwaltung unter Führung von Betriebsmannschaften | Entwicklergetriebene Projekte, die komplexe Logik benötigen |
| **Eignung für KI-Code-Generierung** | Hoch (festes Muster) | Sehr hoch (im Wesentlichen allgemeiner Programmiersprachen-Code) |

**Kernpunkte**: HCL in IaC-Tools ist eine typische externe DSL — sie hat eine unabhängige Syntax und einen eigenen Parser, speziell für die deklarative Beschreibung von Infrastrukturzuständen. Pulumi hingegen verfolgt die Strategie einer internen DSL — die Syntax einer allgemeinen Programmiersprache wird verwendet, um domänenspezifische Konzepte auszudrücken. Beide haben dasselbe Ziel (Infrastrukturverwaltung von manueller Bedienung zu codegesteuerter Verwaltung), aber unterschiedliche Wege (spezielle Sprache vs. allgemeine Sprache). Der Code kann in die Git-Versionskontrolle einbezogen, im Team reviewed, automatisch ausgeführt und zurückgerollt werden.


---

## 5. Klebe-Code und automatische SDK-Generierung

### 5.1 Was ist Klebe-Code

In der Softwaretechnik bezeichnet **Klebe-Code (Glue Code)** Code, der selbst keine Geschäftslogik enthält, sondern nur der Verbindung zweier Systeme oder Module dient.

Typischer Klebe-Code umfasst:

- HTTP-Anfrage-Code, der beim Frontend-Aufruf von Backend-APIs geschrieben wird (URL-Zusammenstellung, Request-Header-Setzung, Response-Parsing)
- HTTP-Client-Code, der geschrieben wird, wenn Backend-Service A die Schnittstelle von Service B aufruft
- Schnittstellen-Adaptercode zwischen verschiedenen Programmiersprachen

Dieser Code zeichnet sich durch folgende Merkmale aus: **Hochgradig wiederholend, festes Muster, aber nicht weglassbar.**

### 5.2 OpenAPI-Spezifikation und automatische Codegenerierung

Da Klebe-Code ein stark musterbasiertes Merkmal aufweist, ist die Lösung im Engineering: **Zuerst die API-Schnittstelle in einem Standardformat beschreiben und dann mit Tools automatisch den Client-Code generieren.**

Die **OpenAPI-Spezifikation** (früher Swagger) ist der Branchenstandard zur Beschreibung von REST-APIs. Sie verwendet YAML- oder JSON-Format zur präzisen Definition von Pfaden, Parametern, Anfrage- und Antwortstrukturen einer API:

```yaml
openapi: 3.0.0
info:
  title: E-Mail-Service-API
  version: 1.0.0

paths:
  /emails:
    post:
      summary: E-Mail senden
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                to:
                  type: string
                  example: "user@example.com"
                subject:
                  type: string
                body:
                  type: string
      responses:
        '200':
          description: Erfolgreich gesendet
```

Basierend auf dieser Spezifikationsdatei können mit Tools wie `openapi-generator` automatisch Client-SDKs für verschiedene Sprachen generiert werden:

- **Python**: `client.emails.send(to="user@example.com", subject="Hallo", body="Inhalt")`
- **TypeScript**: `client.emails.send({ to: "user@example.com", subject: "Hallo", body: "Inhalt" })`
- **Go**: `client.Emails.Send(ctx, &SendEmailRequest{To: "user@example.com", ...})`

Das generierte SDK kapselt alle Details der HTTP-Anfrage, sodass der Aufrufer sich nicht um URL-Pfade, Anfragemethoden, Serialisierungsformate und andere Implementierungsdetails kümmern muss.

### 5.3 Armins Fall neu interpretiert

Kehren wir zum Eingangsbeispiel dieses Artikels zurück — nun lassen sich die einzelnen Bestandteile präzise verstehen:

| Bestandteil | Natur | Beschreibung |
|---------|------|------|
| **Go** | Geschäftslogik-Code | Kernfunktionalität des E-Mail-Sende-/Empfangsdienstes |
| **YAML** | Konfigurationsdatei | Service-Konfiguration, CI/CD-Pipeline-Definitionen, OpenAPI-Spezifikationsdatei |
| **Pulumi** | Infrastruktur-Code | Definition von Cloud-Ressourcen (Server, Datenbanken, Netzwerk) in Go/TypeScript |
| **SDK-Klebe-Code** | Automatisch generierte Client-Bibliothek | Automatisch aus der OpenAPI-Spezifikation generierte Python- und TypeScript-SDKs |

Davon gehören YAML-Konfiguration, Pulumi-Ressourcendefinitionen und SDK-Klebe-Code zu den drei stark musterbasierten, durch explizite Spezifikationen eingeschränkten Codearten — genau der Bereich, in dem KI-Codegenerierung am stärksten ist. Daher ist die Aussage "40.000 Zeilen Code, davon 90% von KI generiert" plausibel.


---

## 6. KI und DSL

### 6.1 Analyse der Eignung von KI-Codegenerierung

| Merkmalsdimension | Geeignet für KI-Generierung | Nicht geeignet für KI-Generierung |
|---------|-------------|---------------|
| **Mustergrad** | Hohe Wiederholung, feste Vorlagen vorhanden | Erfordert kreatives Design, ohne Präzedenz |
| **Spezifikationsbindung** | Explizites Schema oder Syntaxspezifikation vorhanden | Anforderungen vage, Grenzen unklar |
| **Kontextabhängigkeit** | Lokal konsistent, einzelne Definitionen hängen nicht vom globalen Verständnis ab | Erforderliches Verständnis der Architekturabsichten des gesamten Systems |
| **Verifizierbarkeit** | Kann durch Tools automatisch validiert werden (z. B. `terraform validate`) | Nur durch menschliches Urteil über Designangemessenheit verifizierbar |

Die vier in diesem Artikel vorgestellten Technologiekategorien — Konfigurationsdateien, eingebettete Skripte, IaC-Code, SDK-Klebe-Code — weisen alle die Merkmale der linken Spalte auf. Dies erklärt, warum KI in diesen Bereichen deutlich bessere Codegenerierungsergebnisse erzielt als bei Geschäftslogik-Code.

### 6.2 Bewertungsrahmen

Bei der Beurteilung, ob ein bestimmter Code für die KI-Generierung geeignet ist, können die folgenden drei Kriterien herangezogen werden:

1. **Gibt es eine bestehende Spezifikation oder ein Schema?** — Vorhanden → KI-freundlich
2. **Handelt es sich um ein stark wiederholtes Muster?** — Ja → KI-freundlich
3. **Kann das Generierungsergebnis durch Tools automatisch verifiziert werden?** — Ja → KI-freundlich

Code, der alle drei Kriterien erfüllt (wie SDK-Generierung aus OpenAPI-Spezifikationen, Terraform-Massendefinition gleichartiger Ressourcen), kann in hohem Maß auf KI-Generierung vertraut werden. Code, der keines der Kriterien erfüllt (wie das Design eines neuen Protokolls für verteilte Konsistenz), muss weiterhin von Ingenieuren selbst erstellt werden.

---

## 7. Glossar

| Begriff | Vollständige Bezeichnung | Definition |
|------|------------|------|
| **DSL** | Domain-Specific Language / domänenspezifische Sprache | Eine für einen bestimmten Bereich entworfene Sprache, im Gegensatz zu allgemeinen Programmiersprachen |
| **GPL** | General-Purpose Language / allgemeine Programmiersprache | Programmiersprache, die beliebige Rechenprobleme lösen kann, wie Python, Java, Go |
| **Externe DSL** | External DSL | Domänenspezifische Sprache mit unabhängiger Syntax und eigenem Parser, wie SQL, HCL, YAML |
| **Interne DSL** | Internal DSL / Embedded DSL | In einer allgemeinen Programmiersprache eingebettet, nutzt die Hostsyntax für domänenspezifische Ausdrücke, wie Pulumi |
| **Daten-Serialisierung** | Data Serialization | Prozess der Umwandlung von Datenstrukturen im Arbeitsspeicher in ein speicherbares oder übertragbares Format |
| **INI** | Initialization | Das älteste Schlüssel-Wert-Konfigurationsformat, ursprünglich aus Windows |
| **CSV** | Comma-Separated Values | Reines Text-Tabellenformat mit kommagetrennten Feldern |
| **XML** | eXtensible Markup Language | Tag-basiertes Textdatenformat, ausdrucksstark aber冗长 |
| **JSON** | JavaScript Object Notation | Leichtgewichtiges Datenaustauschformat basierend auf Schlüssel-Wert-Paaren, De-facto-Standard für Web-APIs |
| **YAML** | YAML Ain't Markup Language | Einrückungsbasiertes Konfigurationsdateiformat, weit verbreitet im Backend- und DevOps-Bereich |
| **TOML** | Tom's Obvious Minimal Language | Konfigurationsformat mit expliziter Syntax, häufig im Rust- und Python-Ökosystem |
| **Protobuf** | Protocol Buffers | Von Google entwickeltes binäres Serialisierungsformat, erfordert vordefiniertes Schema, klein und schnell |
| **MessagePack** | — | JSON-ähnliches binäres Serialisierungsformat, kein Schema erforderlich |
| **Lua** | — | Leichtgewichtige eingebettete Skriptsprache, häufig in Spiel-Engines, Web-Servern und Datenbank-Erweiterungen |
| **IaC** | Infrastructure as Code / Infrastruktur als Code | Engineering-Praxis der Definition und Verwaltung von Cloud-Computing-Ressourcen durch Code |
| **Terraform** | — | Von HashiCorp entwickeltes IaC-Tool, verwendet die deklarative HCL-Sprache |
| **HCL** | HashiCorp Configuration Language | Die von Terraform verwendete spezielle Konfigurationssprache |
| **Pulumi** | — | IaC-Tool, das allgemeine Programmiersprachen unterstützt |
| **OpenAPI** | — | Branchenstandard-Spezifikation zur Beschreibung von REST-API-Schnittstellen (früher Swagger) |
| **SDK** | Software Development Kit / Software-Entwicklungskit | Client-Bibliothek, die API-Aufrufdetails kapselt |
| **Klebe-Code** | Glue Code | Adapter-Code ohne Geschäftslogik, nur zur Verbindung zweier Systeme |

---

## Zusammenfassung

In der Backend-Entwicklung gibt es eine große Menge an Nicht-Geschäftslogik-Code. Sie haben einen gemeinsamen Oberbegriff: **DSL (domänenspezifische Sprache)** — eine für einen bestimmten Bereich entworfene Sprache im Gegensatz zu allgemeinen Programmiersprachen.

Die in diesem Artikel vorgestellten DSLs lassen sich in vier Kategorien einteilen:

1. **Daten-Serialisierungsformate** (XML / JSON / YAML / TOML / CSV / Protobuf usw.) — Rein datenbeschreibende externe DSLs, die strukturierte Daten in eine speicherbare, übertragbare Form umwandeln
2. **Eingebettete Skriptsprachen** (Lua usw.) — Positionieren sich zwischen Konfiguration und allgemeiner Sprache und bieten dem Host-Programm programmierbare Erweiterungsmöglichkeiten
3. **Infrastrukturdefinitionssprachen** (HCL / Dockerfile usw.) — Deklarative externe DSLs, die den gewünschten Systemzustand beschreiben; Pulumi erreicht dasselbe Ziel mit dem Ansatz einer internen DSL
4. **Schnittstellenbeschreibungssprachen und Klebe-Code-Generierung** (OpenAPI / .proto) — Durch Spezifikationsbeschreibung automatisch Verbindung-Code zwischen Systemen generieren

Wenn du das DSL-Klassifikations-Framework verstanden hast, kannst du bei Begegnung mit den verschiedenen Arten von "Code, der nicht wie Code aussieht" in Backend-Projekten schnell deren Natur erkennen: Zu welcher Art von DSL gehört er, welches Problem aus welchem Bereich löst er und warum wird er nicht mit einer allgemeinen Programmiersprache geschrieben.

Gleichzeitig sind DSL-Codes aufgrund ihrer stark musterbasierten, spezifikationsgetriebenen und automatisch verifizierbaren Merkmale der derzeit effektivste Anwendungsbereich für KI-Codegenerierungstechnologie.
