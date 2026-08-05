# Dateispeicherung: Speichersysteme

::: tip Vorwort
**Ein Benutzer lädt ein Profilbild hoch, du speicherst es im `/uploads`-Verzeichnis des Servers — und dann ist die Serverfestplatte voll, oder du fügst einen zweiten Server hinzu, und der Benutzer findet sein Bild mal da, mal nicht.** Dateispeicherung scheint einfach, ist aber in verteilten Umgebungen ein ernstzunehmendes Architekturproblem. Objektspeicher ist die Standardantwort des Internetzeitalters auf dieses Problem.
:::

**Was wirst du in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels wirst du Folgendes erhalten:

- **Speichertypen-Kenntnisse**: Den Unterschied zwischen Blockspeicher, Dateispeicher und Objektspeicher und ihre Anwendungsszenarien verstehen
- **Kernkonzepte des Objektspeichers**: Bucket, Object, Key, Pre-signed URL und andere Kernkonzepte beherrschen
- **Upload-Strategien**: Die Auswahl zwischen Client-Direktupload und Server-Relay beherrschen
- **CDN-Beschleunigungsprinzipien**: Verstehen, wie CDN die weltweite Verteilung statischer Ressourcen beschleunigt
- **Best Practices**: Dateibenennung, Zugriffskontrolle, Lebenszyklusverwaltung und andere Praxistipps beherrschen

| Kapitel | Inhalt | Kernkonzept |
|-----|------|---------|
| **Kapitel 1** | Speichertypen-Vergleich | Blockspeicher, Dateispeicher, Objektspeicher |
| **Kapitel 2** | Kernkonzepte des Objektspeichers | Bucket, Object, Key, Metadaten |
| **Kapitel 3** | Datei-Upload-Strategien | Client-Direktupload, Pre-signed URL |
| **Kapitel 4** | CDN-Beschleunigung | Edge-Knoten, Cache-Strategien, Origin-Pull |
| **Kapitel 5** | Best Practices | Benennungskonventionen, Berechtigungen, Lebenszyklus |

---

## 0. Übersicht: Motivation von man Dateien nicht lokal auf dem Server speichern sollte

Zu Beginn eines Projekts ist es die intuitivste Lösung, vom Benutzer hochgeladene Dateien in einem lokalen Serververzeichnis zu speichern. Mit dem Projektwachstum treten jedoch eine Reihe von Problemen auf:

- **Begrenzter Speicherplatz**: Die Serverfestplatte wird immer voll, Erweiterung ist aufwändig
- **Keine Freigabe zwischen Servern**: Bei Lastverteilung können Benutzeranfragen verschiedene Server erreichen, und die Datei wird nicht gefunden
- **Kein Backup**: Wenn der Server ausfällt, sind die Dateien weg
- **Kein CDN**: Weltweite Nutzer greifen auf denselben Server zu, was langsam ist

::: tip Der Kernwert des Objektspeichers
Objektspeicher (wie AWS S3, Alibaba Cloud OSS) löst all diese Probleme: **unbegrenzte Kapazität, weltweiter Zugriff, automatische Backups, native CDN-Unterstützung**. Er ist der De-facto-Standard für die Dateispeicherung in Internetanwendungen geworden.
:::

---

## 1. Speichertypen-Vergleich: Block, Datei, Objekt

In der Computerwelt gibt es drei hauptsächliche Speicherarten, die Probleme auf unterschiedlichen Ebenen lösen.

<FileStorageTypeDemo />

| Dimension | Blockspeicher | Dateispeicher | Objektspeicher |
|------|--------|---------|---------|
| Dateneinheit | Festgroße Blöcke | Datei + Verzeichnis | Objekt (Key-Value) |
| Zugriffsprotokoll | iSCSI/FC | NFS/SMB | HTTP REST API |
| Performance | Höchste (Millisekunden) | Mittel | Niedriger (aber ausreichend) |
| Skalierbarkeit | Begrenzt | Mittel | Nahezu unbegrenzt |
| Kosten | Höchste | Mittel | Niedrigste |
| Typisches Szenario | Datenbank | Gemeinsame Dateien | Bilder/Videos/Backups |

::: tip Einfache Eselsbrücke
- **Blockspeicher** ist wie eine Festplatte — für Datenbanken
- **Dateispeicher** ist wie ein Netzwerk-Shared-Folder — für Konfigurationsfreigabe zwischen Servern
- **Objektspeicher** ist wie ein Cloud-Drive — für von Benutzern hochgeladene Bilder und Videos
:::

---

## 2. Kernkonzepte des Objektspeichers

Das Datenmodell des Objektspeichers ist sehr einfach: Ein **Bucket** ist der Container, ein **Object** ist die Datei, und jedes Objekt wird durch einen eindeutigen **Key** identifiziert.

```
my-app-bucket/                    ← Bucket
├── avatars/user-123.jpg          ← Object Key
├── avatars/user-456.png          ← Object Key
├── reports/2024/q1-report.pdf    ← Object Key ("Verzeichnis" ist nur ein Key-Präfix)
└── uploads/temp/file.zip         ← Object Key
```

| Konzept | Beschreibung | Beispiel |
|------|------|------|
| Bucket | Speichercontainer, global eindeutiger Name | `my-app-prod`, `company-assets` |
| Object | Die gespeicherte Datei selbst + Metadaten | Ein Bild, ein PDF |
| Key | Der eindeutige Identifikator des Objekts | `avatars/user-123.jpg` |
| Metadaten | Zusätzliche Informationen zum Objekt | Content-Type, benutzerdefinierte Tags |
| ACL | Access Control List | public-read, private |
| Pre-signed URL | Zeitlich begrenzter autorisierter Zugriffslink | Upload-/Download-Link mit 15 Minuten Gültigkeit |

::: tip Objektspeicher hat keine echten "Verzeichnisse"
`avatars/user-123.jpg` — das `avatars/` ist kein Verzeichnis, sondern nur ein Präfix des Keys. Der Objektspeicher ist flach strukturiert: Alle Objekte befinden sich auf derselben Ebene. Die in der Konsole angezeigten "Ordner" sind lediglich eine visuelle Gruppierung nach Präfix.
:::

---

## 3. Datei-Upload-Strategien: Wer lädt die Datei hoch

Für den Datei-Upload gibt es zwei gängige Ansätze: Server-Relay und Client-Direktupload. In den meisten Szenarien ist **Client-Direktupload** die bessere Wahl.

<FileUploadFlowDemo />

::: tip Vorteile des Client-Direktuploads
1. **Server-Bandbreite sparen**: Die Datei durchläuft nicht deinen Server, sondern geht direkt zum OSS
2. **Timeouts vermeiden**: Große Datei-Uploads lösen keine Nginx/Gateway-Timeouts aus
3. **Serverlast senken**: Der Server muss nur Anmeldeinformationen ausstellen, keine Datei-Streams verarbeiten
4. **Fortsetzbare Uploads unterstützen**: OSS unterstützt nativ Multipart-Uploads, das Frontend kann Upload-Fortsetzung implementieren

Implementierungsschritte: Frontend fordert vom Backend eine Pre-signed URL an → Frontend lädt mit dieser URL direkt zum OSS hoch → OSS benachrichtigt das Backend per Callback
:::

---

## 4. CDN-Beschleunigung: Schnelle Zugriffe für weltweite Nutzer

Wenn deine Nutzer weltweit verteilt sind, ist das Herunterladen von Dateien von einem einzigen Ursprungsserver langsam. Ein CDN (Content Delivery Network) cached die Dateien durch weltweit verteilte Edge-Knoten in der Nähe der Nutzer und reduziert so die Zugriffslatenz erheblich.

<CDNAccelerationDemo />

| CDN-Konzept | Beschreibung |
|---------|------|
| Edge-Knoten | Weltweit verteilte Cache-Server |
| Origin-Pull | Wenn der Edge-Knoten keinen Cache hat, wird die Datei vom Ursprungsserver angefordert |
| Cache-Hit-Rate | Anteil der Anfragen, die direkt von Edge-Knoten beantwortet werden — je höher, desto besser |
| TTL | Cache-Gültigkeitsdauer; nach Ablauf muss neu vom Ursprung geladen werden |
| Cache-Invalidierung | Aktives Löschen des Edge-Caches, damit neue Dateien wirksam werden |

::: tip CDN Best Practices
- **Hash im Dateinamen**: `logo.a3f2b1.png` statt `logo.png`, sodass bei Dateiaktualisierungen keine Cache-Invalidierung nötig ist
- **Sinnvolle TTL setzen**: Statische Ressourcen (JS/CSS/Bilder) lange TTL (1 Jahr), HTML kurze TTL (5 Minuten)
- **Gzip/Brotli-Kompression aktivieren**: Textressourcen werden nach Kompression um 60-80% kleiner
:::

---

## 5. Best Practices

| Praxis | Beschreibung | Beispiel |
|------|------|------|
| Key-Benennungskonventionen | Aussagekräftige Präfixe zur Organisation | `{type}/{date}/{uuid}.{ext}` |
| Hotspot-Keys vermeiden | Nicht mit inkrementellen Zahlen beginnen | UUID oder Hash-Präfix verwenden |
| Minimale Berechtigungen | Bucket standardmäßig private | Nur für Dateien, die öffentlich sein müssen, public-read setzen |
| Lebenszyklusregeln | Automatische Bereinigung abgelaufener Dateien | Temporäre Dateien nach 7 Tagen automatisch löschen |
| CORS-Konfiguration | Client-Direktupload erfordert CORS-Konfiguration | Eigene Domäne für PUT/POST erlauben |
| Serverseitige Verschlüsselung | SSE für sensible Dateien aktivieren | SSE-S3 oder SSE-KMS |

---

## Zusammenfassung

Dateispeicherung ist ein Grundproblem, dem jede Webanwendung begegnet. Objektspeicher ist mit seiner unbegrenzten Kapazität, niedrigen Kosten und hohen Verfügbarkeit zur Standardwahl für Internetanwendungen geworden.

Wichtige Erkenntnisse dieses Kapitels:

1. **Drei Speichertypen**: Blockspeicher für Datenbanken, Dateispeicher für Freigabe, Objektspeicher für Benutzerdateien
2. **Objektspeicher-Modell**: Bucket + Key + Object, flache Struktur, HTTP-API-Zugriff
3. **Client-Direktupload**: Pre-signed URL-Ansatz, Dateien durchlaufen nicht den Server, effizient und ressourcenschonend
4. **CDN-Beschleunigung**: Edge-Caching + Dateiname-Hash für schnellen weltweiten Zugriff
5. **Sicherheit und Verwaltung**: Minimale Berechtigungen, Lebenszyklusregeln, serverseitige Verschlüsselung

## Weiterführende Literatur

- [AWS S3 Entwicklerhandbuch](https://docs.aws.amazon.com/s3/) - Die Referenzdokumentation für Objektspeicher
- [Alibaba Cloud OSS Best Practices](https://help.aliyun.com/document_detail/31853.html) - Der am häufigsten genutzte Objektspeicher in China
- [MinIO Dokumentation](https://min.io/docs/minio/linux/index.html) - Open-Source S3-kompatibler Objektspeicher
- [Cloudflare R2](https://developers.cloudflare.com/r2/) - Objektspeicher ohne Egress-Gebühren
- [Pre-signed URL erklärt](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) - Der Kernmechanismus für Client-Direktuploads
