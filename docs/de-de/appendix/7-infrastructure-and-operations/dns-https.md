# DNS und HTTPS: Netzwerkprotokolle

::: tip Vorwort
**Wenn du `www.google.com` in den Browser eingibst und Enter draeuckst - was passiert dahinter?** Diese scheinbar einfache Aktion umfasst Domain-Aufloesung, DNS-Abfragen, TLS-Verschluesselungs-Handshake und eine Reihe praezise koordinierter Prozesse. Diese Mechanismen zu verstehen ist Pflicht fuer jeden Entwickler - sie bestimmen direkt, ob deine Website erreichbar ist und ob Daten abgefangen werden koennen.
:::

**Was wirst du in diesem Artikel lernen?**

Nach diesem Kapitel wirst du Folgendes koennen:

- **DNS-Prinzipien**: Den kompletten Prozess verstehen, wie Domainnamen in IP-Adressen uebersetzt werden
- **Datensatztypen**: Die Verwendung von A, CNAME, MX und anderen haeufigen DNS-Eintraegen beherrschen
- **HTTPS-Mechanismen**: Verstehen, wie der TLS-Handshake eine sichere Verbindung herstellt
- **Zertifikatsketten**: Die Vertrauenskette digitaler Zertifikate und Verifikationsmechanismen kennenlernen
- **Sicherheitsbewusstsein**: Verstehen, warum HTTPS die Mindestanforderung des modernen Webs ist

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | DNS-Aufloesung | Rekursive Abfrage, iterative Abfrage |
| **Kapitel 2** | DNS-Eintraege | A, CNAME, MX, TXT |
| **Kapitel 3** | HTTPS und TLS | Handshake-Prozess, verschluesselte Kommunikation |
| **Kapitel 4** | Zertifikats-Vertrauenskette | CA, Root-Zertifikat, Intermediate-Zertifikat |
| **Kapitel 5** | HTTP vs HTTPS | Klartext vs Verschluesselung, Sicherheitsvergleich |

---

## 0. Ueberblick: Vom Domainnamen zur sicheren Verbindung

Die Kommunikation im Internet basiert auf IP-Adressen (wie 142.250.80.46), aber Menschen koennen sich diese Zahlen nicht merken. Deshalb wurde das **Domain Name System (DNS)** erfunden - das "Telefonbuch" des Internets, das menschenlesbare Domainnamen in maschinenlesbare IP-Adressen uebersetzt.

Aber nur den Server zu finden reicht nicht. Wenn die Kommunikationsinhalte im Klartext uebertragen werden, kann jeder Mann in der Mitte abhoeren oder deine Daten manipulieren. **HTTPS** loest dieses Problem - es fuegt HTTP eine TLS-Verschluesselungsschicht hinzu und gewaehrleistet Vertraulichkeit und Integritaet der Daten waehrend der Uebertragung.

::: tip Ein vollstaendiger Webseiten-Zugriff
1. **Domain-Aufloesung**: Der Browser fragt DNS "Wie lautet die IP von www.google.com?", DNS antwortet "142.250.80.46"
2. **TCP-Verbindung**: Der Browser baut einen TCP-Three-Way-Handshake mit dem Server auf
3. **TLS-Handshake**: Beide Seiten einigen sich auf Verschluesselungsalgorithmen, verifizieren Zertifikate und tauschen Schluessel aus
4. **Verschluesselte Kommunikation**: Alle HTTP-Daten werden ueber den verschluesselten Kanal uebertragen
:::

---

## 1. DNS-Aufloesung: Das "Telefonbuch" des Internets

DNS (Domain Name System) funktioniert wie das Nachschlagen in einem Telefonbuch: Du kennst den Namen (Domain), musst aber die Telefonnummer (IP-Adresse) herausfinden. Das "Telefonbuch" des Internets ist jedoch kein einzelnes Buch, sondern ein hierarchisches verteiltes System.

<DnsResolutionDemo />

::: tip Die vier Schritte der DNS-Aufloesung
1. **Browser-Cache**: Zunaechst den lokalen Cache pruefen - wenn diese Domain kuerzlich besucht wurde, wird die gecachte IP direkt verwendet
2. **Rekursiver Resolver**: Bei Cache-Miss wird die Anfrage an den ISP-Rekursiv-Resolver gesendet (z. B. 8.8.8.8)
3. **Stufenweise Abfrage**: Der rekursive Resolver fragt der Reihe nach: Root-Nameserver -> Top-Level-Domain-Server (.com) -> Autoritativer Nameserver (google.com)
4. **Ergebnis zurueckgeben**: Der autoritative Server gibt die finale IP zurueck, der Resolver cacht das Ergebnis und gibt es an den Browser zurueck
:::

| Ebene | Server | Verantwortung | Anzahl |
|------|-------|------|------|
| Root-Domain | Root Server | Kennt alle Top-Level-Domain-Adressen | 13 Gruppen weltweit |
| Top-Level-Domain | TLD Server | Verwaltet .com, .de, .org etc. | Eine Gruppe pro Endung |
| Autoritative Domain | Authoritative | Speichert konkrete DNS-Eintraege | Mindestens 2 pro Domain |
| Rekursiver Resolver | Resolver | Fuehrt die komplette Abfrage fuer den Nutzer durch | ISP oder oeffentliches DNS |

---

## 2. DNS-Eintragstypen: Die "Konfigurationstabelle" hinter Domainnamen

DNS macht mehr als nur Domainnamen in IP-Adressen zu uebersetzen. Ueber verschiedene Arten von DNS-Eintraegen kannst du E-Mail-Zustellung, Domain-Weiterleitungen, Service-Discovery und andere Verhalten steuern. Diese Eintragstypen zu verstehen ist die Grundlage fuer die Domainkonfiguration und die Fehlerbehebung bei Netzwerkproblemen.

<DnsRecordTypeDemo />

| Eintragstyp | Zweck | Beispiel |
|---------|------|---------|
| A | Domain -> IPv4-Adresse | `example.com -> 93.184.216.34` |
| AAAA | Domain -> IPv6-Adresse | `example.com -> 2606:2800:220:1:...` |
| CNAME | Domain -> Andere Domain (Alias) | `www.example.com -> example.com` |
| MX | E-Mail-Server festlegen | `example.com -> mail.example.com` |
| TXT | Textinformationen speichern | SPF-Verifikation, Domain-Inhaberschaftsverifikation |
| NS | Autoritativen Nameserver festlegen | `example.com -> ns1.example.com` |

::: tip DNS-Konfiguration in der Praxis
- **Website bereitstellen**: A-Eintrag auf Server-IP setzen oder CNAME auf CDN-Domain
- **E-Mail konfigurieren**: MX-Eintrag auf Mailserver, TXT-Eintrag fuer SPF/DKIM Anti-Spam
- **Domain-Inhaberschaft verifizieren**: Cloud-Anbieter verlangen einen spezifischen TXT-Eintrag als Beweis
- **Load Balancing**: Mehrere A-Eintraege fuer dieselbe Domain, DNS-Round-Robin verteilt den Traffic
:::

---

## 3. HTTPS und TLS: Den Daten eine "Schutzweste" anziehen

Das HTTP-Protokoll uebertraegt Daten im Klartext - wie eine Postkarte, die der Brieftraeger (Mittelsmann) frei lesen kann. HTTPS fuegt HTTP eine TLS-Verschluesselungsschicht (Transport Layer Security) hinzu, was bedeutet, dass die Postkarte in einen versiegelten Umschlag gesteckt wird.

Der TLS-Handshake ist der entscheidende Schritt zum Aufbau einer sicheren Verbindung. Vor der eigentlichen Datenuebertragung werden Authentifizierung und Schluesselaustausch durchgefuehrt.

<HttpsHandshakeDemo />

::: tip Kernschritte des TLS 1.3-Handshakes
1. **Client Hello**: Der Client sendet eine Liste unterstuetzter Verschluesselungsalgorithmen und eine Zufallszahl
2. **Server Hello**: Der Server waehlt den Verschluesselungsalgorithmus, gibt das digitale Zertifikat und eine Zufallszahl zurueck
3. **Zertifikatsverifikation**: Der Client prueft die Vertrauenswuerdigkeit des Server-Zertifikats (CA-Signatur, Gueltigkeitsdauer, Domain-Matching)
4. **Schluesselaustausch**: Beide Seiten einigen sich ueber den ECDHE-Algorithmus auf einen gemeinsamen Schluessel (der Schluessel selbst wird nicht ueber das Netzwerk uebertragen)
5. **Verschluesselte Kommunikation**: Alle weiteren Daten werden mit dem ausgehandelten symmetrischen Schluessel verschluesselt uebertragen
:::

| Eigenschaft | TLS 1.2 | TLS 1.3 |
|------|---------|---------|
| Handshake-Round-Trips | 2-RTT | 1-RTT (erste Verbindung) / 0-RTT (Wiederaufnahme) |
| Schluesselaustausch | RSA oder ECDHE | Nur ECDHE (Forward Secrecy) |
| Verschluesselungsalgorithmen | Viele aeltere Algorithmen unterstuetzt | Nur sichere Algorithmen |
| Performance | Langsamer | Schneller |

---

## 4. Zertifikats-Vertrauenskette: Motivation von sollte man dieser Website vertrauen

Der kritischste Schritt im TLS-Handshake ist die "Zertifikatsverifikation". Woher weiss der Browser, ob das Zertifikat einer Website echt ist und nicht von einem Angreifer gefaelscht wurde? Die Antwort ist die **Zertifikats-Vertrauenskette** - ein mehrstufiges Beglaubigungssystem.

<CertificateChainDemo />

::: tip Die dreistufige Struktur der Zertifikats-Vertrauenskette
1. **Root-Zertifikat (Root CA)**: Von einer vertrauenswuerdigen Zertifizierungsstelle ausgestellt, vorinstalliert in Betriebssystem und Browser. Dies ist der "Anker" des Vertrauens.
2. **Intermediate-Zertifikat (Intermediate CA)**: Von der Root-CA ausgestellt, zur Ausstellung von End-Zertifikaten. Die Root-CA stellt keine Website-Zertifikate direkt aus - zur sicherheitstechnischen Isolierung.
3. **End-Zertifikat (Leaf Certificate)**: Das Zertifikat, das deine Website tatsaechlich verwendet, von der Intermediate-CA ausgestellt. Enthaelt Domain, oeffentlichen Schluessel, Gueltigkeitsdauer etc.
:::

| Zertifikatstyp | Verifikationsstufe | Ausstellungszeit | Anwendungsfall |
|---------|---------|---------|---------|
| DV (Domain-Validierung) | Nur Domain-Inhaberschaft | Minuten | Persoenliche Websites, Blogs |
| OV (Organisations-Validierung) | Organisationsidentitaet verifiziert | Tage | Unternehmens-Websites |
| EV (Erweiterte Validierung) | Strenge Organisationspruefung | Wochen | Banken, Finanzinstitute |
| Wildcard-Zertifikat | Deckt alle Subdomains ab | Je nach Typ | Mehrere Subdomains |

---

## 5. HTTP vs HTTPS: Motivation von Verschluesselung die Mindestanforderung ist

2024 wurde mehr als 95% des weltweiten Web-Traffics ueber HTTPS uebertragen. Chrome markiert HTTP-Websites mit der Warnung "Nicht sicher", und Suchmaschinen stufen HTTP-Websites schlechter ein. HTTPS ist keine "Option" mehr, sondern die Mindestanforderung des modernen Webs.

<DnsHttpsComparisonDemo />

| Dimension | HTTP | HTTPS |
|------|------|-------|
| Datenuebertragung | Klartext, abhoerbar | Verschluesselt, nicht abhoerbar |
| Authentifizierung | Keine, Serveridentitaet nicht bestätigt | Ja, Server wird ueber Zertifikat verifiziert |
| Datenintegritaet | Kein Schutz, manipulierbar | Geschuetzt, Manipulation wird erkannt |
| Port | 80 | 443 |
| SEO-Auswirkung | Schlechteres Suchranking | Besseres Suchranking |
| Browser-Anzeige | Warnung "Nicht sicher" | Schloss-Symbol |

::: tip Kostenloses HTTPS-Zertifikat
**Let's Encrypt** ist eine kostenlose, automatisierte Zertifizierungsstelle, die es jeder Website ermoeglicht, ohne Kosten HTTPS zu aktivieren. Mit dem Certbot-Tool kann man Zertifikate per Knopfdruck beantragen und automatisch verlaengern. Die meisten Cloud-Plattformen und CDN-Anbieter bieten ebenfalls kostenlose SSL-Zertifikate an.
:::

---

## Zusammenfassung

Domainnamen, DNS und HTTPS sind die drei Saeulen der Internet-Infrastruktur. DNS ermoeglicht uns den Zugriff auf Websites ueber menschenlesbare Namen, HTTPS stellt sicher, dass die Kommunikation sicher und vertrauenswuerdig ist.

Die wichtigsten Punkte dieses Kapitels:

1. **DNS ist ein hierarchisches System**: Root-Domain -> Top-Level-Domain -> Autoritative Domain, stufenweise Abfrage mit Cache-Beschleunigung
2. **Eintragstypen haben verschiedene Zwecke**: A-Eintrag zeigt auf IP, CNAME fuer Aliase, MX fuer E-Mail, TXT fuer Verifikation
3. **TLS-Handshake etabliert Vertrauen**: Zertifikatsverifikation + Schluesselaustausch, TLS 1.3 benoetigt nur 1-RTT
4. **Zertifikats-Vertrauenskette**: Root-CA -> Intermediate-CA -> End-Zertifikat, mehrstufige Beglaubigung
5. **HTTPS ist die Mindestanforderung**: Kostenlose Zertifikate (Let's Encrypt) machen Verschluesselung zugaenglich

## Weiterfuehrende Literatur

- [How DNS Works](https://howdns.works/) - DNS-Prinzipien als Comic erklaert
- [Let's Encrypt Dokumentation](https://letsencrypt.org/docs/) - Leitfaden fuer kostenlose SSL-Zertifikate
- [Cloudflare Learning Center](https://www.cloudflare.com/learning/dns/what-is-dns/) - Tutorials zu DNS und Netzwerksicherheit
- [TLS 1.3 RFC 8446](https://datatracker.ietf.org/doc/html/rfc8446) - TLS 1.3 Protokollspezifikation
- [SSL Labs](https://www.ssllabs.com/ssltest/) - Online-Test der HTTPS-Konfigurationsqualitaet einer Website
