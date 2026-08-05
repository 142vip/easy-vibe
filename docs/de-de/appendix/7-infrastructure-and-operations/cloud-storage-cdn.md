# Cloud-Speicher und CDN: Bereitstellung
> **Lernleitfaden**: Dieser Artikel fuehrt dich durch eine komplette Kette - vom Datei-Upload bis zum Download durch den Nutzer. Du wirst sehen, wie Object Storage wie ein "intelligentes Lager" unzaehlige Dateien verwaltet, wie CDN wie ein "Paketverteilnetz" Inhalte bis vor die Haustuer des Nutzers liefert und welche "Fallen" auf dem Weg warten. Grundkenntnisse zu HTTP-Anfragen und DNS-Aufloesung werden empfohlen.

Bevor du beginnst, solltest du folgende Grundlagen auffrischen:

- **HTTP-Anfragen-Prozess**: Lies [Was passiert, wenn man eine URL in den Browser eingibt](./web-basics/url-to-browser.md), um die komplette Anfragekette zu verstehen.
- **DNS-Aufloesung**: Wenn dir Domain-Aufloesung noch nicht vertraut ist, schau dir die Diagramme unter [DNS-Abfrage-Prozess](./deployment/dns-flow.md) an.

---

## 0. Einleitung: Upload und Download Performance

Stell dir vor: Du laedst in einer Bild-Community ein 10-MB-Foto hoch und wartest eine halbe Minute, bis es fertig ist. Dein Freund in Berlin klickt auf Download und braucht nur 2 Sekunden. Warum ist dasselbe File beim Upload und Download so unterschiedlich schnell?

Oder: Dein E-Commerce-Shop hat am Black Friday einen Ansturm auf die Produktdetailseiten - der Server gibt auf. Ist die Bandbreite zu gering? Oder liegt es an der Architektur?

Die Antworten auf all diese Fragen verstecken sich in dem "Traumpaar" **Object Storage** und **CDN**.

---

## 1. Object Storage: Dein "intelligentes Cloud-Lager"

### 1.1 Was ist Object Storage

Traditionelle Dateisysteme sind wie dein Kleiderschrank: Kleidung wird nach "Oberteile/Hosen/Roecke" hierarchisch einsortiert. Um ein Hemd zu finden, oeffnest du den Schrank -> Oberteile -> Hemden-Fach. Dieses "hierarchisch verschachtelte" Modell wird extrem unhandlich, wenn die Dateianzahl explodiert.

Object Storage ist wie moderne Lagerlogistik: Jedes Paket hat eine eindeutige "Sendungsnummer" (Objektschluessel). Du nennst einfach die Nummer, und der Lager-Roboter holt das Paket aus Millionen von anderen praezise heraus.

<ObjectStorageDemo />

**Kernunterschiede**:

| Dimension | Traditionelles Dateisystem | Object Storage |
| :----------- | :--------------------- | :---------------------- |
| **Organisation** | Hierarchischer Verzeichnisbaum | Flache Schluessel-Wert-Paare |
| **Zugriffsprotokoll** | POSIX (lokale Dateioperationen) | HTTP/REST API |
| **Skalierbarkeit** | Begrenzte Einzelkapazitaet | Nahezu unbegrenzte horizontale Skalierung |
| **Metadaten** | Grundlegende Attribute (Groesse, Zeitstempel) | Reichhaltige benutzerdefinierte Metadaten |
| **Typische Szenarien** | Lokale Buerodokumente | Bilder/Video/Backups/Statische Ressourcen |

### 1.2 Kernkonzepte von Object Storage

#### Bucket: Deine "Lagerabteilung"

Ein Bucket ist der Container der obersten Ebene im Object Storage, vergleichbar mit einem eigenen Namespace. Alle Objekte muessen in einem Bucket gespeichert werden.

**Namensregeln** (am Beispiel von Alibaba Cloud OSS):

- Global eindeutig: Darf bei allen Nutzern des Cloud-Anbieters nicht doppelt vorkommen
- Nur Kleinbuchstaben, Zahlen und Bindestriche
- Muss mit Kleinbuchstabe oder Zahl beginnen und enden
| Laenge zwischen 3 und 63 Zeichen

**Praxistipp**: Ein Team hat dutzende Buckets nach Geschaeftsbereichen erstellt - die Monatsrechnung war ein Schock: Jeder Bucket hat Mindestspeichergebuehren und Anfragegebuehren. Empfehlung: Buckets nach "Umgebung+Zweck" planen, z. B. `prod-static-assets`, `dev-backup-archive`.

#### Objekt: Dein "Datenpaket"

Ein Objekt ist die Grundeinheit des Speichers und besteht aus drei Teilen:

1. **Schluessel (Key)**: Die eindeutige ID des Objekts, vergleichbar mit der "Sendungsnummer"
   - Beispiel: `images/avatar/2024/user123.jpg`
   - Sieht zwar aus wie ein Pfad, ist aber im Grunde nur eine Zeichenkette

2. **Daten (Data)**: Der Inhalt des Objekts selbst
   - Kann beliebige Binaerdaten sein
   - Groessenbeschraenkung haengt vom Cloud-Anbieter ab (meist max. 5 TB pro Objekt)

3. **Metadaten (Metadata)**: Zusaetzliche Informationen ueber das Objekt
   - System-Metadaten: Content-Type, ETag, Last-Modified etc.
   - Benutzerdefinierte Metadaten: z. B. `x-oss-meta-owner`, `x-oss-meta-project`

#### Zugriffskontrolle: Wer darf an mein "Lager"

Object Storage bietet mehrstufige Berechtigungskontrolle:

| Ebene | Kontrollmethode | Typische Szenarien |
| :----------- | :------------------------ | :------------------------------ |
| **Bucket-Ebene** | Bucket Policy (Ressourcenrichtlinie) | Allen externen Zugriff verbieten, nur bestimmte IPs erlauben |
| **Objekt-Ebene** | ACL (Access Control List) | Oeffentliche Bilder, private Dokumente |
| **Temporaere Autorisierung** | STS (Security Token Service) | Frontend-Direct-Upload, Mobile-Upload |

**Sicherheitsregel**: Niemals AccessKey ID und AccessKey Secret im Frontend-Code hinterlegen! Die korrekte Vorgehensweise: Das Frontend fordert beim Backend temporaere STS-Credentials an, das Backend verifiziert die Identitaet und gibt temporaere Credentials mit Ablaufzeit zurueck.

---

## 2. CDN: Dein "globales Build-Artefaktnetzwerk"

### 2.1 Warum braucht man CDN

Stell dir vor, du betreibst einen Online-Shop mit Servern in Muenchen. Jetzt greift ein Nutzer in Berlin auf deine Bilder zu:

- **Ohne CDN**: Die Anfrage geht von Berlin -> Hannover -> Kassel -> Wuerzburg -> Nuernberg -> Augsburg -> Muenchen. Ueber 600 km, hin und zurueck mehr als 1200 km. Allein die Netzwerkuebertragung dauert dutzende Millisekunden - bei Netzwerkstau noch schlimmer.

- **Mit CDN**: Die Anfrage geht von Berlin direkt zum Berliner CDN-Knoten (moeglicherweise direkt im Berliner Rechenzentrum). Die Distanz schrumpft von 600 km auf 20 km, die Latenz von 50 ms auf 5 ms.

Das ist der Kernwert von CDN: **Inhalte naeher zum Nutzer bringen**.

<CdnAccelerationDemo />

### 2.2 Kernarchitektur von CDN

#### Edge-Knoten: Die "Build-Artefaktstation" in Deiner Naehe

Edge-Knoten sind die Ebene im CDN-Netzwerk, die den Nutzern am naechsten ist. Sie werden typischerweise in Rechenzentren von Internet-Providern, Internet-Knoten grosser Staedte und wichtigen Verkehrsknotenpunkten eingesetzt.

#### Ursprungsserver: Das "Hauptlager" der Inhalte

Der Ursprungsserver (Origin) ist die Quelle, von der CDN Inhalte abruft. Dies kann Object Storage (OSS/COS/S3), ein eigener Server (ECS/physikalisch) oder ein Load Balancer (SLB/CLB) sein.

#### Mittelschicht-Knoten: Das "Regionale Verteilzentrum"

Zwischen Edge-Knoten und Ursprungsserver hat CDN typischerweise eine oder mehrere Mittelschichten:

- **Aggregationsknoten**: Fuegen die Ursprungsanfragen mehrerer Edge-Knoten zusammen, um die Last auf dem Ursprungsserver zu reduzieren
- **Regionalzentren**: Verantwortlich fuer die Inhaltsverteilung und Steuerung einer Grossregion

### 2.3 Der komplette CDN-Beschleunigungs-Prozess

Lass uns eine echte Nutzeranfrage verfolgen:

<CachePolicyDemo />

**Schritt 1: DNS-Aufloesung** (Intelligente Steuerung)

```
Nutzer gibt ein: cdn.example.com/image.jpg
↓
DNS-Server gibt zurueck: Berliner CDN-Knoten-IP (1.2.3.4)
```

Hier ist der Schluessel das **intelligente DNS**: Basierend auf dem Provider, dem Standort und der Knotenauslastung des Nutzers wird die optimale CDN-Knoten-IP zurueckgegeben.

**Schritt 2: Edge-Knoten-Suche** (Cache-Treffer?)

```
Anfrage erreicht Berliner CDN-Knoten (1.2.3.4)
↓
Knoten prueft lokalen Cache:
├─ Treffer? Inhalt direkt zurueckgeben
└─ Kein Treffer? Naechsten Schritt ausfuehren
```

**Schritt 3: Ursprungsabfrage** (Schicht fuer Schicht nach oben)

```
Edge-Knoten ohne Treffer
↓
Anfrage an Eltern-Knoten (z. B. Regionales Zentrum)
├─ Eltern-Knoten Treffer? Inhalt zurueckgeben
└─ Eltern-Knoten ohne Treffer? Weiter nach oben
    ↓
    Anfrage an Ursprungsserver
    ↓
    Ursprungsserver gibt Inhalt zurueck
```

**Schritt 4: Cachen und Zurueckgeben** (Beim naechsten Mal schneller)

```
Inhalt wird ueber die Kette zurueckgegeben
↓
Jede Schicht cacht eine Kopie
↓
Schliesslich beim Nutzer angekommen
```

So kann beim naechsten Mal, wenn ein Nutzer dieselbe Datei anfordert, der Inhalt direkt vom Edge-Knoten geliefert werden - "sofort geladen".

---

## 3. Vom Upload zum Zugriff: Komplette Kettenanalyse

### 3.1 Drei Upload-Methoden

<UploadProcessDemo />

#### Methode 1: Client -> Server -> Object Storage (Klassisches Modell)

```
Browser -> Dein Backend-Server -> Object Storage
```

**Vorteile**:

- Einfache Implementierung, gut kontrollierbar
- Dateivalidierung und Formatkonvertierung im Backend moeglich
- Sensible Operationen koennen geloggt und berechtigungsgeprueft werden

**Nachteile**:

- **Doppelte Bandbreite**: Nutzer-Upload belegt einmal, Server-Weiterleitung noch einmal
- **Hohe Serverlast**: Grosse Dateien beanspruchen viel Speicher und CPU
- **Langsamer Upload**: Eine zusaetzliche Zwischenstufe bedeutet laengere gefuehlte Upload-Zeit

**Anwendungsfall**: Kleine Dateien (<10 MB), Backend-Verarbeitung erforderlich (z. B. Bildkomprimierung, Wasserzeichen), interne Managementsysteme.

#### Methode 2: Client direkter Upload zu Object Storage (Modern, empfohlen)

```
Browser ──────→ Object Storage
        ↑
        Backend stellt nur temporaere Credentials aus
```

**Vorteile**:

- **Schneller Upload**: Keine Zwischenstufe, schnellste gefuehlte Geschwindigkeit
- **Geringere Serverlast**: Nur Credential-Ausstellung, kein Dateistream-Handling
- **Bandbreite gespart**: Nur ein Upload-Traffic
- **Hohe Sicherheit**: Temporaere Credentials haben Ablaufzeit, begrenztes Schadenspotential bei Leck

**Nachteile**:

- Etwas komplexere Implementierung, STS- und Signaturmechanismus verstehen
- Frontend muss Multipart-Upload und Wiederaufnahme-Logik behandeln
| CORS-Konfiguration erforderlich

**Anwendungsfall**: Grosse Datei-Uploads, User-Generated Content (UGC), hochparallele Uploads.

#### Methode 3: Multipart-Upload + Wiederaufnahme (Pflicht fuer grosse Dateien)

```
10 GB Videodatei
↓
In 1000 Teile zu je 10 MB aufteilen
↓
Parallel hochladen (gleichzeitig 5 Teile)
↓
Verbindungsabbruch! 600 Teile bereits hochgeladen
↓
Netzwerk wiederhergestellt, ab Teil 601 fortsetzen
↓
Alle Teile hochgeladen, "Zusammenfuehrungs"-Anfrage senden
```

**Warum Multipart-Upload?**

| Szenario | Ohne Multipart | Mit Multipart |
| :----------- | :---------------------- | :------------------- |
| **Netzwerk-Schwankungen** | 99% hochgeladen, Abbruch -> alles neu | Nur fehlgeschlagene Teile neu hochladen |
| **Upload-Geschwindigkeit** | Single-Thread, langsam | Multi-Thread parallel, schnell |
| **Speicherverbrauch** | Gesamte Datei puffern | Nur aktuellen Teil puffern |
| **Fortschrittsanzeige** | Nur 0% und 100% | Genaue Fortschrittsanzeige pro Teil |

---

## 4. Traffic-Steuerung: Nutzer zum "naechstgelegenen" Knoten leiten

<TrafficSchedulingDemo />

### 4.1 Intelligentes DNS-Routing

Traditionelle DNS-Aufloesung:

```
Nutzer fragt: Wie lautet die IP von cdn.example.com?
DNS antwortet: 1.2.3.4 (statisch)
```

Intelligente DNS-Aufloesung:

```
Nutzer (Berlin, Provider A) fragt: Wie lautet die IP von cdn.example.com?
Intelligentes DNS: Ich pruefe... Berliner CDN-Knoten fuer Provider A ist 1.2.3.4

Nutzer (Muenchen, Provider B) fragt: Wie lautet die IP von cdn.example.com?
Intelligentes DNS: Muenchner CDN-Knoten fuer Provider B ist 5.6.7.8
```

### 4.2 HTTP DNS und direkte IP-Verbindung

Traditionelles DNS hat ein Problem: **DNS-Hijacking und Aufloesungsverzoegerung**.

**HTTP-DNS-Loesung**:

```
Client -> System-DNS umgehen -> Direkt beim HTTP-DNS-Dienst anfragen (z. B. 1.1.1.1:80)
         ↓
    Optimale IP-Liste zurueckgeben (mit Gewichtung)
         ↓
    Client waehlt beste IP basierend auf Netzwerkqualitaet
```

Vorteile:

- Hijacking-Schutz: Kein Provider-DNS
- Praeziser: Kann nach Client-Netzwerkqualitaet waehlen
| Echtzeit: Schnellerer Failover

---

## 5. HTTPS-Optimierung: Balance zwischen Sicherheit und Performance

<HttpsOptimizationDemo />

### 5.1 Warum ist HTTPS auf CDN wichtig

**Szenarien-Vergleich**:

```
Ohne HTTPS:
Nutzer ruft http://cdn.example.com/image.jpg auf
↓
Browser zeigt "Nicht sicher" in der Adressleiste
↓
Einige Browser/APPs blockieren den Zugriff direkt
↓
SEO-Ranking sinkt
```

```
Mit HTTPS:
Nutzer ruft https://cdn.example.com/image.jpg auf
↓
Browser zeigt gruenes Schloss-Symbol
↓
HTTP/2 Multiplexing wird aktiv
↓
Leistung + Sicherheit gleichzeitig verbessert
```

---

## 6. Zugriffsanalyse: CDN-Reports richtig lesen

<AccessAnalyticsDemo />

### 6.1 Kernmetriken erklaert

#### Bandbreite (Bandwidth)

```
Definition: Datenmenge pro Zeiteinheit
Einheit: bps (Bits pro Sekunde), Mbps, Gbps

CDN-Bandbreite = Summe des ausgehenden Traffics aller Edge-Knoten
```

#### QPS (Queries Per Second)

```
Definition: Anfragen pro Sekunde

CDN-QPS = Gesamtzahl der HTTP-Anfragen pro Sekunde ueber alle Edge-Knoten

Hinweis: Hohe QPS bedeutet nicht hohe Bandbreite
- Kleine-Dateien-Szenario: Hohe QPS, niedrige Bandbreite
- Grosse-Dateien-Szenario: Niedrige QPS, hohe Bandbreite
```

#### Trefferquote (Hit Ratio)

```
Definition: Anteil der Anfragen, die auf Edge-Knoten getroffen werden

Berechnung:
Trefferquote = (Treffer / Gesamtanfragen) x 100%

Branchenstandard:
- Bilder/Video/JS/CSS: > 95%
- HTML-Seiten: 50-80% (je nach Aktualisierungshaeufigkeit)
- API-Endpunkte: Ueblicherweise nicht gecacht oder sehr niedrig
```

---

## 7. Praxishandbuch: Image-Beschleunigung von Grund auf

### 7.1 Geschaeftsszenario

Angenommen, du bist der Technische Leiter einer Bild-Community mit folgenden Herausforderungen:

- **Nutzer-Uploads**: Nutzer laden taeglich 1 Million Bilder hoch (durchschnittlich 2 MB/Bild)
- **Nutzer-Zugriffe**: Taeglich 50 Millionen Bildaufrufe
- **Nutzerverteilung**: Nutzer ueber ganz Europa verteilt, einige internationale Zugriffe
- **Performance-Anforderung**: Bildladezeit < 500 ms
- **Budget**: Moeglichst unter 500 Euro monatlich

### 7.2 Architekturdesign

```
                         ┌──────────────────────────────────────┐
                         │           Nutzer-Upload-Prozess          │
                         └──────────────────────────────────────┘

   Nutzer-Browser                                    Backend-Service                      Object Storage
       │                                            │                            │
       │  1. Upload-Credentials anfragen              │                            │
       │───────────────────────────────────────────>│                            │
       │                                            │                            │
       │                                            │  2. STS temporaere Credentials anfragen   │
       │                                            │───────────────────────────>│
       │                                            │                            │
       │                                            │  3. STS-Credentials zurueckgeben         │
       │                                            │<───────────────────────────│
       │                                            │                            │
       │  4. Upload-Credentials zurueckgeben (inkl. STS)                        │
       │<───────────────────────────────────────────│                            │
       │                                            │                            │
       │  5. Datei direkt hochladen (mit STS-Signatur)                          │
       │──────────────────────────────────────────────────────────────────────>│
       │                                            │                            │
       │  6. Upload-Ergebnis zurueckgeben (URL, ETag etc.)                       │
       │<──────────────────────────────────────────────────────────────────────│
       │                                            │                            │
       │  7. Backend ueber abgeschlossenen Upload informieren (in DB speichern)   │
       │───────────────────────────────────────────>│                            │
```

### 7.4 Kostenkontrolle

#### Spartipps in der Praxis

**Tipp 1: Speicherstufen, automatisches Lebenszyklus-Management**

```yaml
# Lebenszyklus-Regel-Beispiel
rules:
  - id: image-lifecycle
    prefix: uploads/
    transitions:
      # Nach 7 Tagen: Infrequent-Access-Speicher, 30% sparen
      - days: 7
        storageClass: IA
      # Nach 90 Tagen: Archiv-Speicher, 70% sparen
      - days: 90
        storageClass: Archive
    # Nach 3 Jahren automatisch loeschen
    expiration:
      days: 1095
```

**Tipp 2: CDN-Trefferquote erhoehen, Ursprungsabfragen reduzieren**

```
Was bedeutet eine Erhoehung der Trefferquote von 90% auf 95%?

Annahme:
- Taeglicher Traffic: 10 TB
- Trefferquote 90%: 1 TB Ursprungsabfrage
- Trefferquote 95%: 0,5 TB Ursprungsabfrage

Einsparung bei Ursprungstraffic: 0,5 TB/Tag x 0,15 Euro/GB x 30 Tage = 2.250 Euro/Monat
```

**Tipp 3: Komprimierung und Formatoptimierung**

```
Bildoptimierungs-Strategie:
├─ Originalbilder im Object Storage (nicht direkt oeffentlich)
├─ CDN-Bildverarbeitung aktivieren:
│   ├── Automatische Formatkonvertierung: JPEG -> WebP/AVIF (30-50% Einsparung)
│   ├── Automatische Qualitaetskomprimierung: Visuell verlustfrei (20-40% Einsparung)
│   ├── Groessenanpassung: Passende Groesse je nach Geraet
│   └─ Progressive Laden: Zunaechst unscharf, dann scharf
└─ Ergebnis: Bandbreitenkosten um 50-70% reduziert
```

---

## 8. Zusammenfassung: Die goldene Regel von Object Storage + CDN

### 8.1 Architektur-Design-Prinzipien

**Prinzip 1: Trennung von dynamischen und statischen Inhalten**

```
Dynamische Inhalte (API, HTML) -> Ursprungsserver oder Edge-Functions
Statische Inhalte (Bilder, JS, CSS, Video) -> CDN + Object Storage
```

**Prinzip 2: Naehe zum Nutzer**

```
Wo die Nutzer sind, dorthin werden die Inhalte gecacht
→ CDN-Anbieter mit breiter Abdeckung waehlen
→ Intelligentes DNS-Routing aktivieren
→ Wichtige Inhalte vorab预热 (Preheating)
```

**Prinzip 3: Mehrschichtiges Caching**

```
Lokaler Browser-Cache (staerkste)
    ↓
CDN Edge-Knoten-Cache (mittel)
    ↓
CDN Mittelschicht/Regional-Knoten (Fallback)
    ↓
Object Storage/Ursprungsserver (letze Verteidigungslinie)
```

### 8.2 Vermeidungs-Checkliste

**Bucket-Benennung und Berechtigungen**

- [ ] Bucket-Name global eindeutig, nicht bereits belegt
- [ ] Private Dateien nicht auf "oeffentlich lesbar" setzen
- [ ] AccessKey nicht im Frontend-Code, STS-Temporaere Credentials verwenden
- [ ] Serverseitige Verschluesselung (SSE) fuer vertrauliche Daten aktivieren

**CDN-Cache-Konfiguration**

- [ ] HTML-Dateien TTL nicht zu lang (empfohlen < 5 Minuten)
- [ ] JS/CSS mit Hash im Dateinamen verwenden, TTL auf 1 Jahr setzen
- [ ] Cache-Key vernuenftig konfigurieren, keine variablen Nutzerdaten einbeziehen
- [ ] Nach wichtigen Updates: Cache invalidieren oder预热 (Preheating)

**HTTPS-Sicherheit**

- [ ] Zertifikate nicht ablaufen lassen, automatische Verlaengerung einrichten
- [ ] Minimale TLS-Version 1.2 empfohlen
- [ ] HSTS aktivieren, Downgrade-Angriffe verhindern
- [ ] Sensible Cookies mit Secure und HttpOnly markieren

**Kostenkontrolle**

- [ ] Bandbreiten-Cap-Alarming aktivieren, anomalen Traffic verhindern
- [ ] Infrequent/Archive-Speicher haben Mindestspeicherdauer und Fruehloeschgebuehren
- [ ] Ursprungstraffic ist auch teuer - CDN-Trefferquote erhoehen
- [ ] Regulaer Zugriffs-Logs analysieren und veraltete Ressourcen aufraeumen

---

## 9. Praktische Code-Templates

### 9.1 Frontend-Direct-Upload zu Object Storage (JavaScript)

```javascript
/**
 * Object Storage Direct-Upload-Toolkit
 * Unterstuetzt: Alibaba Cloud OSS, Tencent Cloud COS, AWS S3
 */
class DirectUploader {
  constructor(config) {
    this.provider = config.provider // 'oss' | 'cos' | 's3'
    this.region = config.region
    this.bucket = config.bucket
    this.getCredentials = config.getCredentials // Funktion zum Abrufen temporaerer Credentials
  }

  /**
   * STS temporaere Credentials abrufen
   */
  async fetchCredentials() {
    const credentials = await this.getCredentials()
    return {
      accessKeyId: credentials.accessKeyId,
      accessKeySecret: credentials.accessKeySecret,
      sessionToken: credentials.securityToken || credentials.sessionToken,
      expiration: credentials.expiration
    }
  }

  /**
   * Einzeldatei-Upload (kleine Dateien < 100 MB)
   */
  async upload(file, options = {}) {
    const credentials = await this.fetchCredentials()
    const fileKey = this._generateFileKey(file, options.directory)

    const formData = new FormData()
    const formFields = this._buildFormFields(credentials, fileKey, file.type, options)
    Object.entries(formFields).forEach(([key, value]) => {
      formData.append(key, value)
    })
    formData.append('file', file)

    const uploadUrl = this._getUploadUrl()
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      signal: options.signal
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${response.status} ${errorText}`)
    }

    return {
      url: this._getFileUrl(fileKey),
      key: fileKey,
      etag: response.headers.get('ETag'),
      size: file.size
    }
  }

  /**
   * Dateispeicherpfad generieren
   */
  _generateFileKey(file, directory = '') {
    const date = new Date()
    const datePath = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
    const random = Math.random().toString(36).substring(2, 10)
    const ext = file.name.split('.').pop() || 'bin'
    const key = directory
      ? `${directory}/${datePath}/${random}.${ext}`
      : `${datePath}/${random}.${ext}`
    return key
  }

  _getUploadUrl() {
    switch (this.provider) {
      case 'oss':
        return `https://${this.bucket}.oss-${this.region}.aliyuncs.com`
      case 'cos':
        return `https://${this.bucket}.cos.${this.region}.myqcloud.com`
      case 's3':
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com`
      default:
        throw new Error('Unknown provider')
    }
  }

  _getFileUrl(key) {
    return `https://${this.bucket}.${this.provider === 'oss' ? 'oss' : 'cos'}-${this.region}.${
      this.provider === 'oss'
        ? 'aliyuncs.com'
        : this.provider === 'cos'
          ? 'myqcloud.com'
          : 'amazonaws.com'
    }/${key}`
  }

  _buildFormFields(credentials, fileKey, fileType, options) {
    return {}
  }
}

// Verwendungsbeispiel
const uploader = new DirectUploader({
  provider: 'oss',
  region: 'eu-central-1',
  bucket: 'myapp-images-prod',
  getCredentials: async () => {
    const res = await fetch('/api/upload/credentials')
    return res.json()
  }
})

// Kleine Datei hochladen
async function uploadAvatar(file) {
  try {
    const result = await uploader.upload(file, {
      directory: 'avatars',
      onProgress: (progress) => {
        console.log(`Upload-Fortschritt: ${progress.percent}%`)
      }
    })
    console.log('Upload erfolgreich:', result.url)
    return result
  } catch (error) {
    console.error('Upload fehlgeschlagen:', error)
    throw error
  }
}
```

### 9.2 Backend fuer temporaere Credentials (Node.js/Express)

```javascript
/**
 * Object Storage STS temporaere Credentials Service
 */
const express = require('express')
const STS = require('ali-oss').STS
const router = express.Router()

const config = {
  oss: {
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    region: 'oss-eu-central-1',
    bucket: 'myapp-images-prod',
    roleArn: process.env.OSS_STS_ROLE_ARN
  }
}

/**
 * STS temporaere Credentials abrufen (Alibaba Cloud OSS)
 * POST /api/upload/credentials
 */
router.post('/credentials', async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const date = new Date()
    const prefix = `uploads/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${userId}/`

    const sts = new STS({
      accessKeyId: config.oss.accessKeyId,
      accessKeySecret: config.oss.accessKeySecret
    })

    const result = await sts.assumeRole(
      config.oss.roleArn,
      {
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'oss:PutObject',
              'oss:InitiateMultipartUpload',
              'oss:UploadPart',
              'oss:CompleteMultipartUpload',
              'oss:AbortMultipartUpload',
              'oss:ListParts'
            ],
            Resource: [`acs:oss:*:*:${config.oss.bucket}/${prefix}*`]
          }
        ],
        Version: '1'
      },
      3600,
      'web-upload-session-' + Date.now()
    )

    res.json({
      success: true,
      data: {
        credentials: {
          accessKeyId: result.credentials.AccessKeyId,
          accessKeySecret: result.credentials.AccessKeySecret,
          sessionToken: result.credentials.SecurityToken,
          expiration: result.credentials.Expiration
        },
        config: {
          provider: 'oss',
          region: config.oss.region,
          bucket: config.oss.bucket,
          endpoint: `https://${config.oss.bucket}.${config.oss.region}.aliyuncs.com`,
          prefix: prefix,
          maxSize: 100 * 1024 * 1024,
          allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4']
        }
      }
    })
  } catch (error) {
    console.error('Get credentials failed:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get upload credentials',
      message: error.message
    })
  }
})

module.exports = router
```

---

## 10. Glossar

| Englischer Begriff | Deutsche Uebersetzung | Erklaerung |
| :------------------------- | :---------------- | :--------------------------------------------------------------------------------------------------- |
| **Object Storage** | Object Storage | Eine Datenspeicher-Architektur, die Daten als Objekte verwaltet, nicht als Dateisystem-Hierarchie. |
| **Bucket** | Bucket | Der Container der obersten Ebene im Object Storage. |
| **Object** | Objekt | Die Grundeinheit des Object Storage mit Daten, Metadaten und eindeutigem Schluessel. |
| **CDN** | Content Delivery Network | Ein weltweites Netzwerk aus Edge-Knoten, das Website-Inhalte naeher zum Nutzer cacht. |
| **Edge Node** | Edge-Knoten | Cache-Server im CDN, der Nutzern direkt Inhalte liefert. |
| **Origin** | Ursprungsserver | Die Quelle, von der CDN Inhalte abruft. |
| **Cache Hit** | Cache-Treffer | Angeforderter Inhalt ist bereits auf dem CDN-Edge-Knoten vorhanden. |
| **Cache Miss** | Cache-Fehltreffer | Edge-Knoten hat den Inhalt nicht, muss ihn vom Ursprung abrufen. |
| **Hit Ratio** | Trefferquote | Anteil der Cache-Treffer an allen Anfragen. |
| **TTL** | Time To Live | Gueltigkeitsdauer der Inhalte im CDN-Cache. |
| **Back to Source** | Ursprungsabfrage | Der Prozess, bei dem ein CDN-Edge-Knoten Inhalte vom Ursprungsserver abruft. |
| **Purge/Refresh** | Cache-Invalidierung | Erzwingt, dass CDN-Cache ungueltig wird und neue Inhalte vom Ursprung abgerufen werden. |
| **Preheat** |预热 (Preheating) | Vorab-Uebertragung von Inhalten auf CDN-Knoten vor dem offiziellen Release. |
| **CORS** | Cross-Origin Resource Sharing | Browser-Sicherheitsmechanismus zur Steuerung des Ressourcenzugriffs ueber verschiedene Origins. |
| **STS** | Security Token Service | Dienst zur Ausstellung temporaerer Zugangs-Credentials. |
| **Multipart Upload** | Multipart-Upload | Aufteilung grosser Dateien in mehrere Teile fuer parallelen Upload mit Wiederaufnahme-Unterstuetzung. |

---

## Zusammenfassung: Die goldene Regel von Object Storage + CDN

1. **Upload direkt zum Object Storage**: Grosse Dateien mit Multipart, Sicherheit mit STS
2. **Mehrschichtiges Caching**: Browser -> CDN -> Ursprungsserver, Schicht fuer Schicht
3. **Naehe zum Nutzer**: Intelligentes DNS + weltweite Knotenabdeckung
4. **Sicherheit nie vernachlaessigen**: HTTPS + Hotlink-Schutz + Zugriffskontrolle
5. **Kosten kontrollieren**: Trefferquote, Bandbreite, Speicherstufen kontinuierlich optimieren

Diese Architektur traegt den Grossteil des statischen Ressourcenzugriffs im Internet. Wer sie versteht, versteht das Fundament der modernen Web-Performance-Optimierung.
