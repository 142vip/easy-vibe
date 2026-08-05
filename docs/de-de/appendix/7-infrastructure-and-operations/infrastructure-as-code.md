# Infrastructure as Code: Automatisierung

::: tip Vorwort
**Hast du schon diesen Albtraum erlebt: Der Online-Server ist ausgefallen, aber niemand erinnert sich an die urspruengliche Konfiguration?** Manuelle Server-Anmeldung, Befehle aus dem Gedaechtnis eintippen und hoffen, dass man sich nicht vertippt - das ist der Alltag des traditionellen Betriebs. Infrastructure as Code (IaC) hat all das grundlegend veraendert: Infrastruktur mit Code definieren und verwalten, sodass Serverkonfiguration wie Software versionskontrolliert, reproduzierbar und auditierbar wird.
:::

**Was wirst du in diesem Artikel lernen?**

Nach diesem Kapitel wirst du Folgendes koennen:

- **Kernkonzepte**: Verstehen, was IaC ist und warum es das Fundament des modernen Betriebs bildet
- **Workflow-Kompetenz**: Den vierstufigen Terraform-Prozess Write -> Plan -> Apply -> Destroy beherrschen
- **Tool-Auswahl**: Die Vor- und Nachteile von Terraform, Pulumi, CloudFormation und anderen Mainstream-Tools kennenlernen
- **Risikobewusstsein**: Die Gefahren und Erkennungsmethoden von Configuration Drift verstehen
- **Best Practices**: Die engineering-gemaesse Verwaltung von IaC-Projekten beherrschen

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | IaC-Konzept | Manueller Betrieb vs. codebasierte Verwaltung |
| **Kapitel 2** | Terraform-Workflow | Write -> Plan -> Apply |
| **Kapitel 3** | Tool-Vergleich | Terraform, Pulumi, CDK |
| **Kapitel 4** | Configuration Drift | Erkennung, Praevention, Behebung |
| **Kapitel 5** | Best Practices | Modularisierung, State-Management, CI/CD |

---

## 0. Ueberblick: Motivation von braucht auch Infrastruktur "Quellcode"

Stell dir vor, du bist ein Koch. Wenn du jedes Gericht nach Gefuehl zubereitest - heute ein Loeffel Salz, morgen zwei - wird der Geschmack nie konstant sein. Wenn du aber das Rezept aufschreibst - genau bis auf die Grammzahl jedes Gewuerzs - kann jeder denselben Geschmack reproduzieren.

Das Infrastrukturmanagement steht vor demselben Problem. Die Konfiguration eines Servers kann Betriebssystem, Netzwerkregeln, Sicherheitsgruppen, Speicher-Volumes, Umgebungsvariablen und dutzende weitere Parameter umfassen. Manuelle Konfiguration ist nicht nur fehleranfaellig, sondern auch **nicht reproduzierbar, nicht auditierbar und nicht rollbar**.

::: tip Der Kernwert von IaC
- **Reproduzierbar**: Derselbe Code liefert egal wie oft er ausgefuehrt wird dasselbe Ergebnis (Idempotenz)
- **Versionskontrolle**: Infrastrukturaenderungen werden ueber Git verwaltet - wer hat was geaendert und warum ist auf einen Blick sichtbar
- **Auditierbar**: Alle Aenderungen sind dokumentiert und erfuellen Compliance-Anforderungen
- **Automatisierbar**: Automatische Bereitstellung ueber CI/CD-Pipelines eliminiert manuelle Risiken
- **Teamfaehig**: Teammitglieder pruefen Infrastrukturaenderungen ueber Pull Requests, genauso wie Code-Reviews
:::

---

## 1. IaC-Konzept: Von "manuellen Klicks" zur "codebasierten Deklaration"

Traditioneller Betrieb funktioniert so: Auf der Cloud-Plattform-Konsole einloggen, manuell Server erstellen, Netzwerke konfigurieren und Sicherheitsgruppen einrichten. Bei wenigen Servern ist das noch machbar, aber bei dutzenden oder hunderten Servern wird es zum Albtraum.

Der Kerngedanke von IaC: **Den gewuenschten Infrastrukturzustand mit deklarativem Code beschreiben und Tools automatisch umsetzen lassen.** Man muss dem Tool nicht sagen "erst VPC erstellen, dann Subnetz, dann Sicherheitsgruppe" (imperativ), sondern nur sagen "Ich moechte eine solche Netzwerkumgebung" (deklarativ) - das Tool berechnet automatisch die erforderlichen Schritte.

<IaCConceptDemo />

| Dimension | Manueller Betrieb | Infrastructure as Code |
|------|---------|--------------|
| Vorgehensweise | Auf Konsole einloggen und klicken | Codedateien schreiben |
| Reproduzierbarkeit | Abhaengig von Dokumentation und Gedaechtnis | Code als Dokumentation, 100% reproduzierbar |
| Aenderungsverfolgung | Keine oder unvollstaendige Aufzeichnung | Git-Versionskontrolle, vollstaendige Historie |
| Zusammenarbeit | Muendliche Kommunikation, Dokumentenuebergabe | Pull-Request-Reviews |
| Rollback-Faehigkeit | Manuelle Rueckgaengigmachung | git revert + erneutes apply |
| Konsistenz | Grosse Unterschiede zwischen Umgebungen | Dev/Test/Prod identisch |

::: tip Deklarativ vs. Imperativ
- **Deklarativ**: Beschreibt "was ich will", das Tool berechnet automatisch "wie". Terraform und CloudFormation nutzen diesen Ansatz. Vorteil: gute Idempotenz, Nachteil: eingeschraenkte Flexibilitaet.
- **Imperativ**: Beschreibt "wie es gemacht wird", Schritt fuer Schritt ausfuehren. Ansible und Shell-Skripte nutzen diesen Ansatz. Vorteil: flexibel, Nachteil: Idempotenz schwerer zu garantieren.
- **Hybrid**: Pulumi und AWS CDK nutzen allgemeine Programmiersprachen und kombinieren deklaratives State-Management mit imperativer Flexibilitaet.
:::

---

## 2. Terraform-Workflow: Write -> Plan -> Apply

Terraform ist das aktuell populaerste IaC-Tool, entwickelt von HashiCorp. Sein Workflow ist klar und intuitiv, aufgeteilt in vier Phasen - wie bei der Softwareentwicklung "kodieren -> pruefen -> bereitstellen -> aufraeumen".

<TerraformWorkflowDemo />

::: tip Der vierstufige Workflow
1. **Write (Schreiben)**: Infrastrukturdefinitionen in HCL (HashiCorp Configuration Language) schreiben (.tf-Dateien). Gewuenschte Ressourcen deklarieren: Server, Datenbanken, Netzwerke etc.
2. **Plan (Planen)**: `terraform plan` ausfuehren. Terraform vergleicht den aktuellen Zustand mit dem Zielzustand und erstellt einen "Ausfuehrungsplan" - es zeigt, welche Ressourcen es erstellen, aendern oder loeschen wird. Das ist das Sicherheitsnetz zur Bestaetigung der Aenderungen vor der eigentlichen Ausfuehrung.
3. **Apply (Anwenden)**: Nach Bestaetigung des Plans `terraform apply` ausfuehren. Terraform erstellt oder aendert Ressourcen gemaess dem Plan. Nach Abschluss wird der aktuelle Zustand in der State-Datei (terraform.tfstate) gespeichert.
4. **Destroy (Zerstoeren)**: Wenn nicht mehr benoetigt, `terraform destroy` ausfuehren, um alle Ressourcen zu bereinigen und unnoetige Kosten zu vermeiden.
:::

| Befehl | Funktion | Aendert Infrastruktur? | Anwendungsfall |
|------|------|----------------|---------|
| `terraform init` | Projekt initialisieren, Provider herunterladen | Nein | Erstmalige Nutzung oder neuer Provider |
| `terraform plan` | Aenderungen vorschauen, Ausfuehrungsplan erstellen | Nein | Vor jeder Aenderung zwingend ausfuehren |
| `terraform apply` | Aenderungen ausfuehren, Ressourcen erstellen/aendern | Ja | Nach Bestaetigung des Plans ausfuehren |
| `terraform destroy` | Alle Ressourcen zerstoeren | Ja | Testumgebung aufraeumen, Service einstellen |
| `terraform state` | State-Datei anzeigen/verwalten | Je nach Operation | State-Migration, Ressourcen-Import |

---

## 3. Tool-Vergleich: Das passende IaC-Tool auswaehlen

Im IaC-Bereich gibt es verschiedene Tools mit unterschiedlichen Schwerpunkten. Bei der Auswahl muessen Technologie-Stack des Teams, Cloud-Plattform und Projektgroesse beruecksichtigt werden. Es gibt kein "bestes" Tool - nur das am besten zum eigenen Szenario passende.

<IaCToolComparisonDemo />

| Tool | Sprache | Cloud-Unterstuetzung | Lernkurve | Anwendungsfall |
|------|------|-----------|---------|---------|
| Terraform | HCL | Multi-Cloud (AWS/Azure/GCP) | Mittel | Multi-Cloud, Team-Zusammenarbeit |
| Pulumi | Python/TS/Go | Multi-Cloud | Niedrig (vertraute Programmiersprache) | Entwicklerfreundlich, komplexe Logik |
| AWS CloudFormation | JSON/YAML | Nur AWS | Mittel | Reine AWS-Umgebung |
| AWS CDK | Python/TS/Java | Nur AWS | Niedrig | AWS + Programmiersprachen-Praeferenz |
| Ansible | YAML | Multi-Cloud + Bare Metal | Niedrig | Konfigurationsmanagement, Hybrid-Umgebungen |

::: tip Wie waehlen?
- **Startup / Single-Cloud**: CloudFormation (AWS) oder das native Tool der jeweiligen Plattform - beste Oekosystem-Integration
- **Multi-Cloud / Mittelgrosse bis grosse Teams**: Terraform - groesste Community, reichhaltigste Provider, leichteste Rekrutierung
- **Entwickler-getriebene Teams**: Pulumi oder CDK - Infrastructure mit vertrauten Programmiersprachen schreiben, gute IDE-Unterstuetzung
- **Konfigurationsmanagement erforderlich**: Ansible - spezialisiert auf serverinterne Konfiguration (Software-Installation, Konfigurationsdateien aendern)
:::

---

## 4. Configuration Drift: Die stille Zeitbombe

Configuration Drift ist der unauffaelligste Feind in der IaC-Praxis. Er bezeichnet die **allmaehliche Abweichung zwischen dem tatsaechlichen Infrastrukturzustand und dem im Code definierten Zustand**.

Wie entsteht diese Abweichung? Jemand hat "schnell" ein Produktionsproblem behoben, indem er manuell auf der Konsole die Sicherheitsgruppenregeln geaendert hat; jemand hat zum Debuggen temporaer die Konfiguration eines Servers erhoeht, aber vergessen, sie zurueckzusetzen. Diese "kleinen Aenderungen" addieren sich im Laufe der Zeit und fuehren dazu, dass Code und reale Umgebung drastisch voneinander abweichen.

<ConfigDriftDemo />

::: tip Gefahren von Configuration Drift
1. **Nicht reproduzierbar**: Die im Code beschriebene Umgebung stimmt nicht mit der tatsaechlichen Umgebung ueberein - beim Erstellen neuer Umgebungen gibt es Probleme
2. **Rollback schlaegt fehl**: Man glaubt, ein Rollback auf die vorherige Version wuerde alles wiederherstellen, aber die Umgebung wurde bereits manuell geaendert
3. **Sicherheitsrisiko**: Manuell geoeffnete Ports oder gelockerte Berechtigungen koennen vergessen werden und werden zum Angriffsvektor
4. **Audit unbrauchbar**: Compliance-Audits basieren auf Code, aber der Code spiegelt nicht den tatsaechlichen Zustand wider
:::

| Praeventivmassnahme | Beschreibung |
|---------|------|
| Manuelle Aenderungen verbieten | Ueber IAM-Policies die Berechtigungen fuer Konsolenoperationen einschraenken |
| Regelmaessige Drift-Erkennung | Regelmassig `terraform plan` ausfuehren, um Abweichungen zu pruefen |
| Automatische Korrektur | Bei Drift-Erkennung automatisch apply ausfuehren, um Konsistenz wiederherzustellen |
| Aenderungsaudit | CloudTrail und andere Audit-Logs aktivieren, alle Aenderungsquellen rueckverfolgbar machen |

---

## 5. Best Practices: IaC-Projekte nachhaltig weiterentwickeln

IaC-Code braucht wie Anwendungscode gute Engineering-Praktiken, um wartbar zu bleiben. Ohne Struktur wird IaC-Code mit wachsender Infrastruktur zu einer weiteren Form von "Technikschuld".

<IaCBestPracticeDemo />

::: tip Sechs Kern-Best Practices
1. **Modularisierung**: Wiederverwendbare Infrastruktur als Module abstrahieren (z. B. VPC-Modul, Datenbank-Modul), um Copy-and-Paste zu vermeiden. Wie beim Schreiben von Funktionen: einmal definieren, mehrfach aufrufen.
2. **Umgebungs-Isolation**: Dev, Test und Prod nutzen separate State-Dateien und Variablen-Dateien, isoliert ueber Workspaces oder Verzeichnisstruktur.
3. **Remote-State-Management**: State-Dateien (tfstate) in einem Remote-Backend (S3 + DynamoDB) speichern, das Teamarbeit und State-Locking unterstuetzt und parallele Konflikte vermeidet.
4. **Sensible Informationen verwalten**: Passwoerter, Schluessel und andere vertrauliche Daten nicht im Code speichern, sondern mit Vault, AWS Secrets Manager und anderen Tools verwalten.
5. **CI/CD-Integration**: `terraform plan` in den PR-Prozess integrieren, `apply` automatisch ueber die Pipeline ausfuehren - keine manuellen lokalen Operationen mehr.
6. **Code-Reviews**: Infrastrukturaenderungen muessen wie Anwendungscode geprueft werden, insbesondere bei Aenderungen an Sicherheitsgruppen und IAM-Policies.
:::

---

## Zusammenfassung

Infrastructure as Code ist das Fundament des modernen Cloud-Native-Betriebs. Es verwandelt "nicht beschreibbare manuelle Operationen" in "versionskontrollierbaren Code" und macht das Infrastrukturmanagement von einer "Kunst" zu einer "Ingenieurwissenschaft".

Die wichtigsten Punkte dieses Kapitels:

1. **Essenz von IaC**: Den erwarteten Infrastrukturzustand mit Code deklarieren, Tools automatisch umsetzen lassen
2. **Terraform-Workflow**: Write -> Plan -> Apply in drei Schritten, Plan als Sicherheitsnetz
3. **Tool-Auswahl**: Multi-Cloud -> Terraform, Single-Cloud -> native Tools, Entwickler-Teams -> Pulumi
4. **Configuration Drift**: Das unauffaelligste Risiko, das durch Prozesse und Tools doppelt abgesichert werden muss
5. **Engineering-gemaesse Verwaltung**: Modularisierung, Umgebungs-Isolation, Remote-State, CI/CD-Integration sind unverzichtbar

## Weiterfuehrende Literatur

- [Terraform Offizielles Tutorial](https://developer.hashicorp.com/terraform/tutorials) - Terraform von Grund auf lernen
- [Pulumi Dokumentation](https://www.pulumi.com/docs/) - Infrastruktur mit Programmiersprachen schreiben
- [AWS CDK Workshop](https://cdkworkshop.com/) - Praxis-Tutorial fuer AWS CDK
- [Infrastructure as Code (O'Reilly)](https://www.oreilly.com/library/view/infrastructure-as-code/9781098114664/) - Das Standardwerk zum Thema IaC
- [Spacelift Blog](https://spacelift.io/blog) - IaC-Best-Practices und Branchentrends
