# Cloud-Plattformen: Infrastruktur-Übersicht
> **Lernleitfaden**: Cloud-Service-Anbieter sind keine "Websites zum Mieten von Servern", sondern eine Infrastruktur, die Rechenleistung wie Wasser oder Strom bereitstellt. Dieses Kapitel dreht sich um eine Kernfrage: **Wie versteht und nutzt man Cloud-Services von Grund auf?** Wir verwenden reale Szenarien, lebendige Analogien und praktische Schritte, um dir eine vollstaendige kognitive Landkarte der Cloud-Services zu erstellen.

Bevor du beginnst, solltest du Folgendes kennen:

- **Grundlegende Netzwerkkonzepte**: Wenn IP-Adressen, Ports und Domainnamen noch neu fuer dich sind, lies zunaechst [Netzwerkgrundlagen](/de-de/appendix/1-computer-fundamentals/computer-networks)
- **Was ist eine API**: Wenn APIs noch unbekannt sind, schau dir [API-Einfuehrung](/de-de/appendix/4-server-and-backend/api-intro) an

---

## 0. Einleitung: Motivation von kaufen immer weniger Unternehmen eigene Server

Stell dir folgendes Szenario vor:

Xiao Ming gruendet 2010 ein Unternehmen und moechte eine Website erstellen. Was erlebt er?

Er kauft zunaechst fuer 2.000 Euro einen Dell-Server, kontaktiert dann ein Rechenzentrum und zahlt 300 Euro monatlich fuer das Housing. Danach installiert er selbst Linux, konfiguriert die Umgebung und muss sich auch noch um Hardware-Probleme kuemmern - kaputte Festplatten selbst austauschen, ueberhitzte Geraete selbst beheben. Das Schlimmste: Wenn ploetzlich viele Nutzer kommen und das System ueberlastet ist, muss er einen neuen Server kaufen. Ein Jahr spaeter hat Xiao Ming 5.000 Euro ausgegeben, die Serverauslastung liegt aber nur bei 10%.

Xiao Hongs Unternehmen startet 2024. Wie geht sie vor?

Sie oeffnet die Website des Cloud-Anbieters, registriert ein Konto und erstellt mit ein paar Klicks einen Cloud-Server - in 2 Minuten erledigt. Sie zahlt nur, was sie nutzt. Mehr Traffic? Ein Klick zum Upgrade. Eine US-Niederlassung eröffnen? Einfach eine andere Region auswaehlen. Nach einem Monat hat Xiao Hong 50 Euro ausgegeben, die Serverauslastung liegt bei 80%.

**Intuitiv wuerde man denken: "Cloud-Services sind einfach gemietete Server."**

Doch die Essenz von Cloud-Services reicht weit darueber hinaus - es ist eine **Revolution der Rechenleistung**.

Frueher mussten Unternehmen den langwierigen Prozess durchlaufen: Server kaufen, Rechenzentrum finden, Betriebssystem installieren, sich um Hardware kuemmern und bei Traffic-Spitzen hilflos sein. Heute reicht es, ein Konto zu registrieren, ein paar Klicks zu machen, nach Bedarf zu zahlen, automatisch zu skalieren und weltweit zu deployen. Dieser Wandel ist vergleichbar mit dem Uebergang vom eigenen Brunnen zum Wasserhahn mit fliessendem Wasser.

---

## 1. Was sind Cloud-Service-Anbieter

### 1.1 Rechenleistung wie ein Wasserversorger

Die Essenz von Cloud-Service-Anbietern ist, **Rechenleistung, Speicherfaehigkeit und Netzwerkfaehigkeit als standardisierte Dienste zu verpacken** und sie - wie ein Wasserversorgungsunternehmen Wasser oder ein Stromversorger Strom - ueber das Internet den Nutzern zur Verfuegung zu stellen.

Das Clevere an diesem Modell ist die **bedarfsgerechte Nutzung**. Man muss nicht im Voraus grosse Mengen an Hardware kaufen, sondern zahlt nur fuer die tatsaechliche Nutzung. Mehr Ressourcen benoetigt? Ein Klick genuegt. Einige Dienste werden sogar sekundengenau abgerechnet - aeusserst flexibel. Cloud-Anbieter haben Rechenzentren in dutzenden Laendern, sodass man Anwendungen weltweit bereitstellen kann. Alle Vorgaenge sind Self-Service, 24 Stunden am Tag verfuegbar, ohne manuelle Genehmigungen.

### 1.2 Unterschied zwischen Cloud-Services und traditionellem Hosting

Traditionelles IDC-Hosting ist wie ein eigener Generator. Man muss zunaechst Hardware (Server) kaufen, dann einen Platz dafuer finden (Rechenzentrums-Housing) und selbst warten (Betriebssystem installieren, Hardware reparieren). Wenn die Leistung nicht mehr ausreicht, muss man einen weiteren Generator kaufen. Dieser Prozess kann Tage bis Wochen dauern. Die Kosten sind fix, unabhaengig davon, ob man nutzt oder nicht.

Cloud-Services sind wie der Anschluss ans Stromnetz. Man braucht keinen Generator, nur ein Stromkabel (Konto registrieren) und zahlt nach Verbrauch. Mehr Leistung noetig? Einen groesseren Tarif auswaehlen - in Minuten erledigt. Die Kosten sind variabel: Man zahlt nur, was man verbraucht. Der Cloud-Anbieter ist fuer die gesamte Hardware-Wartung verantwortlich, man konzentriert sich ausschliesslich auf das eigene Geschaeft.

### 1.3 Public Cloud, Private Cloud und Hybrid Cloud

Wie Restaurants verschiedene Geschaeftsmodelle haben, gibt es auch drei Arten von Cloud-Services.

**Public Cloud** ist wie ein oeffentliches Restaurant - jeder kann es nutzen, Ressourcen werden geteilt. AWS, Alibaba Cloud und Azure sind Public Clouds, geeignet fuer die meisten Unternehmen und Privatpersonen. Dies ist der Schwerpunkt dieses Buches, da es die haeufigste und lernfreundlichste Variante ist.

**Private Cloud** ist wie eine Privatkueche - selbst aufgebaut, exklusive Ressourcen. OpenStack und VMware sind typische Vertreter, geeignet fuer grosse Unternehmen, Behoerden und Banken mit extrem hohen Datensicherheitsanforderungen.

**Hybrid Cloud** ist eine Kombination aus beiden: Ein Teil der Workloads laeuft in der Public Cloud, ein anderer in der Private Cloud. Alle Anbieter haben entsprechende Loesungen, geeignet fuer Szenarien, die sowohl Compliance als auch Elastizitaet erfordern.

**Probiere es aus**:
Klicke auf die Service-Karten unten, um die sechs Kernkategorien von Cloud-Services zu erkunden.

<CloudServicesOverview />

---

## 2. Welche bekannten Cloud-Service-Anbieter gibt es

### 2.1 Die internationalen Grossen Drei: AWS, Azure, Google Cloud

Auf dem weltweiten Cloud-Service-Markt dominieren drei Anbieter.

**AWS (Amazon Web Services)** wurde 2006 von Amazon als Cloud-Service gestartet und ist mit rund 32% weltweiter Marktanteil die Nummer eins. Es ist wie das "Kaufhaus" der Cloud-Welt: Die breiteste Dienstvielfalt mit ueber 200 Services, die ausgereiftesten und stabilsten Funktionen, die umfangreichste Dokumentation und Community. Die Preise sind zwar comparatively hoch, aber das Preis-Leistungs-Verhaeltnis ist ausgezeichnet - besonders geeignet fuer international taetige Unternehmen, Startups und grosse Internetunternehmen.

**Microsoft Azure** wurde 2010 als Cloud-Service von Microsoft gestartet und haelt mit rund 23% den zweiten Platz weltweit. Sein groesster Vorteil ist die tiefe Integration mit Windows und Office, umfangreiche Unternehmenskunden, starke Hybrid-Cloud-Faehigkeiten und besondere Freundlichkeit gegenueber .NET-Entwicklern. Wenn dein Unternehmen bereits den Microsoft-Technologie-Stack nutzt, ist Azure die nahezuliegende Wahl.

**Google Cloud Platform (GCP)** wurde 2011 als Cloud-Service von Google gestartet und belegt mit rund 10% den dritten Platz weltweit. Es fuehrt bei Kubernetes, Datenanalyse und KI, hat starke technologische Innovationskraft und ist vergleichsweise guenstig. Der Marktanteil ist jedoch kleiner und das Oekosystem weniger ausgereift als bei den beiden Erstplatzierten. Geeignet fuer technologiegetriebene Unternehmen, containerisierte Anwendungen und KI-Projekte.

### 2.2 Die chinesischen Grossen Drei: Alibaba Cloud, Tencent Cloud, Huawei Cloud

Auf dem chinesischen Cloud-Service-Markt gibt es ebenfalls drei wichtige Anbieter.

**Alibaba Cloud** wurde 2009 als Cloud-Computing-Abteilung von Alibaba gegruendet und ist mit rund 40% Marktfuehrer in China. Als der aelteste und ausgereifteste Cloud-Anbieter Chinas bietet Alibaba Cloud eine umfassende Dienstpalette, tiefe technische Erfahrung aus E-Commerce und dem Double-Eleven-Einkaufsfest. Die Preise sind vergleichsweise hoch, aber Stabilitaet und funktionale Vollstaendigkeit sind erstklassig - besonders geeignet fuer chinesische Unternehmen und E-Commerce-Projekte.

**Tencent Cloud** wurde 2013 als Cloud-Service-Abteilung von Tencent gegruendet und haelt in China rund 15% Marktanteil. Es ist stark bei Gaming, Audio/Video, guter Integration mit dem WeChat- und QQ-Oekosystem und relativ guenstigen Preisen. Wenn du Gaming-, Social- oder Live-Streaming-Projekte entwickelst, ist Tencent Cloud eine gute Wahl.

**Huawei Cloud** wurde 2015 als Cloud-Service-Abteilung von Huawei gegruendet und haelt in China rund 10% Marktanteil. Es hat starke Hardware-Expertise, umfangreiche Regierungs- und Unternehmenskunden, hohe Sicherheit und Compliance sowie innovative KI-Chips (Ascend). Geeignet fuer Regierungsprojekte, grosse staatliche Unternehmen und die Fertigungsindustrie.

### 2.3 Wie waehlt man den richtigen Cloud-Anbieter

Die Wahl des Cloud-Anbieters ist wie die Wahl einer Wohnung - Standort, Preis und Ausstattung muessen beruecksichtigt werden.

**Zunaechst den Zielmarkt betrachten**. Wo sind die Nutzer hauptsaechlich? Wenn in China, waehle Alibaba Cloud oder Tencent Cloud; wenn im Ausland, waehle AWS oder Azure; bei globalem Geschaeft einen Anbieter mit breiter geografischer Abdeckung.

**Dann den Technologie-Stack betrachten**. Welche Technologien werden verwendet? Microsoft-Technologie -> Azure; Kubernetes und Big Data -> Google Cloud; Allgemeine Szenarien -> AWS als sichere Wahl.

**Dann die Kosten**. Fuer kleine Projekte koennen guenstigere Anbieter wie Tencent Cloud oder UCloud gewaehlt werden; fuer grosse Produktionsumgebungen die Gesamtkosten betrachten - AWS kann langfristig guenstiger sein.

**Schliesslich das Oekosystem**. Wenn bereits andere Dienste wie GitHub oder Office 365 genutzt werden, ist ein Anbieter aus demselben Oekosystem bequemer.

Praxisempfehlung: Anfaenger oder kleine Projekte waehlen Alibaba Cloud oder Tencent Cloud wegen der deutschen Dokumentation und des lokalen Supports; internationale Projekte waehlen AWS als ausgereifteste Loesung mit bester globaler Abdeckung; grosse Unternehmen benoetigen moeglicherweise eine Multi-Cloud-Strategie mit verschiedenen Clouds fuer unterschiedliche Workloads.

---

## 3. Wie nutzt man Cloud-Services in der Praxis

### 3.1 Der komplette Prozess von der Registrierung bis zum Going Live

Der erste Schritt ist die Kontoregistrierung. Dieser Prozess ist wie das Eroeffnen eines Bankkontos - deine Identitaet muss verifiziert werden. Die Website des Cloud-Anbieters oeffnen, auf "Kostenlos registrieren" klicken, E-Mail und Passwort eingeben, Telefonnummer verifizieren, Ausweis oder Unternehmensdokumente fuer die Identitaetspruefung hochladen und schliesslich die Zahlungsmethode hinterlegen. Der gesamte Prozess dauert etwa 10 bis 20 Minuten.

Nach der Registrierung solltest du einige Kernkonzepte kennen. **Region (Region)** ist der Standort des Cloud-Rechenzentrums, z. B. Europa (Frankfurt), US-Ost (Virginia), Asien-Pazifik (Singapur). Die Regel: Je naeher an den Nutzern, desto besser - geringere Latenz. **Verfuegbarkeitszone (Availability Zone, AZ)** sind mehrere Rechenzentren innerhalb einer Region, die voneinander isoliert sind und die Verfuegbarkeit erhoehen. Faellt eine AZ aus, koennen die anderen weiterarbeiten. **Instanz (Instance)** ist ein virtueller Server, z. B. ein 2-Kern-4G-Cloud-Server, der stunden- oder monatsbasiert abgerechnet wird.

### 3.2 Den ersten Cloud-Server erstellen

Die Erstellung eines Cloud-Servers ist wie die Konfiguration eines Computers - aber ueber eine Webseite. Zunaechst das Bezahlmodell auswaehlen: Fuer Testumgebungen nutztman Pay-as-you-go, fuer dauerhaften Betrieb monatliche oder jaehrliche Abrechnung. Dann die Region waehlen - die naechstgelegene, z. B. Europa-Frankfurt. Bei der Instanzgroesse reichen 2 Kerne und 4 GB fuer Testumgebungen. Als Image das Betriebssystem auswaehlen, z. B. Ubuntu 22.04. 40 GB Systemfestplatte, Standard-VPC-Netzwerk und nutzungsabhaengige Bandbreitenabrechnung sind kostenguenstig. Schliesslich das Root-Passwort setzen und sicher speichern. Der gesamte Prozess dauert etwa 5 Minuten, die Instanz ist nach 1 bis 2 Minuten einsatzbereit.

**Probiere es aus**:
Waehle eine Konfiguration und vergleiche Preise und Anwendungsbereiche verschiedener Instanztypen.

<ComputeInstanceDemo />

### 3.3 Mit dem Cloud-Server verbinden und eine Anwendung bereitstellen

Fuer die Verbindung mit einem Linux-Server wird SSH empfohlen. Passwort-Login: `ssh root@server-ip`, dann das Passwort eingeben. Schluessel-Login ist sicherer: `ssh -i dein-key.pem root@server-ip`.

Nach der Verbindung kannst du die Anwendung bereitstellen. Zunaechst das System aktualisieren: Ubuntu mit `sudo apt update && sudo apt upgrade -y`. Dann notwendige Software installieren, z. B. Node.js. Anschliessend den Code hochladen, entweder per Git oder SCP. Schliesslich Abhaengigkeiten installieren und die Anwendung starten.

### 3.4 Haeufige Anwendungsbereiche

**Einen persoenlichen Blog hosten** erfordert einen Cloud-Server und eine Domain. 1 Kern, 2 GB RAM reichen aus, Kosten ca. 5 bis 10 Euro monatlich. Der Technologie-Stack kann Nginx mit statischen Dateien oder WordPress sein.

**Ein API-Backend bereitstellen** benoetigt einen Cloud-Server und eine Datenbank. Ab 2 Kernen und 4 GB RAM, Kosten ca. 20 bis 50 Euro monatlich. Der Technologie-Stack kann Node.js oder Python mit MySQL oder PostgreSQL sein.

**Bilder oder Videos speichern** wird mit Object Storage empfohlen, abgerechnet nach Speichervolumen und Traffic. Die Kosten betragen wenige Euro bis einige Hundert Euro monatlich. Der Vorteil: Keine eigene Festplatte noetig, automatische Backups und moegliche CDN-Beschleunigung.

**Probiere es aus**:
Lerne verschiedene Arten von Cloud-Speicherdiensten und deren Anwendungsbereiche kennen.

<StorageTypeDemo />

---

## 4. Wie kauft man API-Zugriffe und nutzt sie

### 4.1 Abrechnungsmodelle von Cloud-Services

Cloud-Services bieten verschiedene Abrechnungsmodelle - das Verstaendnis davon kann viel Geld sparen.

**Pay-as-you-go** ist wie der Kauf von Einzelfahrscheinen - man zahlt nur, was man nutzt. Geeignet fuer Testumgebungen und Projekte mit unregelmässigem Traffic. Cloud-Server werden stundenweise abgerechnet, Object Storage nach GB plus Anzahl der Anfragen, KI-APIs nach Anzahl der Aufrufe.

**Monatliche/jaehrliche Abrechnung oder Reserved Instances** ist wie eine Monats- oder Jahreskarte - man verpflichtet sich zu einer bestimmten Nutzungsdauer und erhaelt einen Rabatt, normalerweise 30% bis 60% Ersparnis. Geeignet fuer dauerhaft betriebene Produktionsumgebungen. Beispiel: Ein 2-Kern-4G-Server kostet mit Pay-as-you-go 20 Euro monatlich, mit einer Jahresbindung nur 14 Euro monatlich.

**Spot-Instanzen** sind wie Wartelisten-Tickets - sehr guenstig, bis zu 90% Ersparnis, koennen aber zwangsweise zurueckgezogen werden. Geeignet fuer Batch-Verarbeitung und fehlertolerante Aufgaben wie Datenverarbeitung oder Rendering. Das Risiko: Bei Ressourcenknappheit kann der Cloud-Anbieter die Instanz jederzeit zurueckziehen.

**Serverless nach Anzahl der Aufrufe** ist wie ein Taxi - man kuemmert sich nicht um den Server, nur um die Anzahl der Aufrufe. Die Abrechnung erfolgt nach Anzahl der Aufrufe plus Rechenzeit plus Traffic. Geeignet fuer API-Endpunkte und Event-getriebene Aufgaben. Beispiel: Bei AWS Lambda sind die ersten 1 Million Aufrufe monatlich kostenlos.

**Probiere es aus**:
Nutze den Preisrechner, um die Kostenunterschiede verschiedener Abrechnungsmodelle zu vergleichen.

<PricingCalculator />

### 4.2 Der komplette Prozess zum Kauf von API-Zugriffen

Am Beispiel des Aufrufs einer KI-API (z. B. Tongyi Qianwen) besteht der Prozess aus vier Schritten.

**Schritt 1: Service aktivieren**. Die KI-Plattform des Cloud-Anbieters oeffnen, den gewuenschten Service finden, auf "Sofort aktivieren" oder "Kostenlos testen" klicken - etwa 2 Minuten.

**Schritt 2: API-Key abrufen**. In die API-Key-Verwaltung der Konsole gehen, "API-Key erstellen" klicken, den Key kopieren und sicher speichern. Wichtiger Hinweis: Der API-Key wird nur einmal angezeigt - sofort speichern!

**Schritt 3: Berechtigungen konfigurieren**. In die Zugriffssteuerung (RAM/IAM) gehen, einen Benutzer oder eine Rolle mit nur den benoetigten Berechtigungen erstellen - z. B. nur die KI-API aufrufen, aber keine Server loeschen. Das ist das Prinzip der minimalen Rechte.

**Schritt 4: Testaufruf**. Mit Python oder JavaScript den ersten API-Aufruf durchfuehren und pruefen, ob die API ordnungsgemaess funktioniert.

---

## 5. Praxis: Eine Website von Grund auf bereitstellen

### 5.1 Szenario und Loesungswahl

Angenommen, du bist ein Frontend-Entwickler und moechtest einen persoenlichen Blog bereitstellen. Die Anforderungen: Statische Website (HTML/CSS/JS), eigene Domain, schnelle globale Zugriffsgeschwindigkeit, moeglichst geringe Kosten.

Es gibt drei Loesungsmoeglichkeiten. Cloud-Server: Mittlere Kosten, mittlere Komplexitaet, geeignet wenn Backend-Services benoetigt werden. Object Storage plus CDN: Niedrige Kosten, geringe Komplexitaet, ideal fuer rein statische Websites - unsere Empfehlung. Serverless: Sehr niedrige Kosten, mittlere Komplexitaet, geeignet fuer dynamische Inhalte.

Die Empfehlung fuer Object Storage plus CDN begruendet sich durch: Niedrigste Kosten (moeglicherweise kostenlos), einfachste Konfiguration und schnellste Ladezeiten (CDN-Beschleunigung).

**Probiere es aus**:
Folge den Schritten, um den kompletten Bereitstellungsprozess zu erkunden.

<DeployWorkflowDemo />

### 5.2 Implementierungsschritte

**Schritt 1: Website-Dateien vorbereiten**. Eine einfache index.html erstellen:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Mein Blog</title>
</head>
<body>
  <h1>Willkommen auf meinem Blog</h1>
  <p>Das ist mein erster Artikel.</p>
</body>
</html>
```

**Schritt 2: Object Storage Bucket erstellen**. In der Cloud-Konsole anmelden, Object Storage (OSS/S3) finden, "Bucket erstellen" klicken. Name konfigurieren (z. B. my-blog-2024, global eindeutig), Region auswaehlen (die naechstgelegene), Zugriffsberechtigungen auf "Oeffentlich lesbar" setzen (die Website muss zugaenglich sein).

**Schritt 3: Dateien hochladen**. In den Bucket wechseln, "Datei hochladen" klicken, index.html auswaehlen und den Upload abwarten.

**Schritt 4: Statisches Website-Hosting konfigurieren**. In die Bucket-Einstellungen gehen, "Statische Seiten" oder "Website-Hosting" finden, die Funktion aktivieren, die Standard-Startseite auf index.html setzen und die Konfiguration speichern.

**Schritt 5: Eigene Domain binden (optional)**. Domain kaufen, CNAME-Eintrag auf die Bucket-Domain setzen, im Bucket die eigene Domain binden und HTTPS konfigurieren.

**Schritt 6: CDN konfigurieren (empfohlen)**. CDN-Service aktivieren, die Beschleunigungsdomain hinzufuegen, die Ursprungsseite (den Bucket) auswaehlen und auf die Aktivierung des CDN warten (Minuten bis Stunden).

### 5.3 Kostenschaetzung

Monatliche Kostenschaetzung: Object Storage 0 bis 5 Euro (nach Speichervolumen abgerechnet), CDN-Traffic 0 bis 10 Euro (nach Traffic abgerechnet, mit kostenlosem Kontingent), Domain 0,50 bis 1 Euro (jaehrlich umgerechnet). Gesamt: 0,50 bis 16 Euro monatlich, kleine Websites koennen komplett kostenlos sein.

---

## 6. Zusammenfassung und naechste Schritte

### 6.1 Zusammenfassung der Kernpunkte

Die Essenz von Cloud-Services laesst sich wie folgt zusammenfassen: Cloud-Anbieter sind Wasserversorger fuer Rechenleistung und bieten bedarfsgerechte Nutzung, weltweite Bereitstellung und Self-Service. Der Nutzungsprozess: Anbieter auswaehlen, Konto registrieren, Ressourcen erstellen, Berechtigungen konfigurieren, Kosten ueberwachen.

Entscheidende Punkte: Die Anbieterwahl richtet sich nach Markt, Technologie-Stack und Kosten; das Abrechnungsmodell wird zwischen Pay-as-you-go, Reservierung und Serverless abgewogen; bei den Berechtigungen gilt das Prinzip der minimalen Rechte, MFA aktivieren und regelmaessig auditieren; die Kostenkontrolle erfordert Nutzungsueberwachung, Rabatte nutzen und unnoetige Ressourcen freigeben.

### 6.2 Empfohlener Lernpfad

Woche 1: Theoretische Grundlagen, Cloud-Service-Grundkonzepte verstehen, ein Cloud-Konto registrieren, den ersten Cloud-Server erstellen. Woche 2: Praktische Uebung, eine statische Website bereitstellen, Domain und CDN konfigurieren, grundlegende Linux-Befehle lernen. Woche 3: Fortgeschrittene Faehigkeiten, einschliesslich Berechtigungsverwaltung (IAM), Monitoring und Alarmierung, Kostenoptimierung. Woche 4: Projektpraxis, eine vollstaendige Anwendung bereitstellen, Datenbank und Speicher konfigurieren, automatische Skalierung implementieren.

### 6.3 Empfohlene Ressourcen

Offizielle Dokumentation: Alibaba Cloud Dokumentationszentrum, AWS Dokumentation, Tencent Cloud Dokumentation. Lernplattformen: Alibaba Cloud University, AWS Free Tier, Tencent Cloud Lab. Community-Ressourcen: Cloud Native Community, Serverless Community, InfoQ Cloud Computing Kolumne.

---

## 7. Glossar

| Englischer Begriff | Deutsche Uebersetzung | Erklaerung |
| :--- | :--- | :--- |
| **Cloud Provider** | Cloud-Service-Anbieter | Unternehmen, das Cloud-Computing-Dienste anbietet, z. B. AWS, Alibaba Cloud |
| **Region** | Region | Die geografische Region, in der sich das Rechenzentrum befindet |
| **Availability Zone** | Verfuegbarkeitszone | Ein unabhaengiges Rechenzentrum innerhalb einer Region |
| **Instance** | Instanz | Ein virtueller Server |
| **Image/AMI** | Image | Vorkonfiguriertes Betriebssystem-Template |
| **VPC** | Virtual Private Cloud | Isolierte virtuelle Netzwerkumgebung |
| **IAM/RAM** | Identitaets- und Zugriffsverwaltung | Berechtigungsverwaltungssystem |
| **User** | Benutzer | Eine konkrete Identitaet |
| **Group** | Benutzergruppe | Eine Gruppe von Benutzern |
| **Role** | Rolle | Temporaere Identitaet |
| **Policy** | Richtlinie | Ein JSON-Dokument, das Berechtigungen definiert |
| **API Key** | API-Schluessel | Credentials fuer API-Aufrufe |
| **AccessKey** | Zugriffsschluessel | Credentials fuer programmgesteuerten Zugriff (ID + Secret) |
| **MFA** | Multi-Faktor-Authentifizierung | Login-Methode mit Passwort plus Verifizierungscode |
| **CDN** | Content Delivery Network | Globaler Beschleunigungsdienst, der statische Ressourcen cacht |
| **OSS/S3** | Object Storage | Dienst zum Speichern von Dateien |
| **ECS/EC2** | Cloud-Server | Virtueller Server-Dienst |
| **RDS** | Relationale Datenbank als Service | Verwaltete Datenbank |
| **Serverless** | Serverlos | Computing-Modell ohne Serververwaltung |
| **Pay-as-you-go** | Nutzungsbasierte Abrechnung | Bezahlen, was man nutzt |
| **Reserved Instance** | Reservierte Instanz | Monatliche/jaehrliche Abrechnung |
| **Spot Instance** | Spot-Instanz | Guenstige, aber moeglicherweise zurueckziehbare Instanz |
