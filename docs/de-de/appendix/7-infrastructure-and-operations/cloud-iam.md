# Cloud-IAM: Zugriffsverwaltung
> **Lernleitfaden**: Prompt-Engineering loest das Problem "wie man etwas klar ausdrueckt", Cloud-Zugriffsverwaltung loest das Problem "wer was tun darf". Dieses Kapitel dreht sich um eine Frage: **Wie kann man in der Cloud bequem Berechtigungen erteilen, ohne die Schluessel an die Falschen zu geben?**

Bevor du beginnst, solltest du zwei Grundlagen auffrischen:

- **Was ist ein Token**: Lies zunaechst den Abschnitt "Tokenization & Token" in [Einfuehrung in grosse Sprachmodelle](../8-artificial-intelligence/llm-principles.md).
- **Was ist ein Prompt**: Wenn dir die Grundstruktur von System / User / Assistant noch nicht vertraut ist, lies zunaechst [Prompt-Engineering](../8-artificial-intelligence/prompt-engineering/).

---

## 0. Einleitung: Motivation von man schon am ersten Tag in der Cloud "auf die Nase faellt"

<IamRamComparisonDemo />

Viele machen aehnliche Erfahrungen, wenn sie zum ersten Mal Cloud-Dienste nutzen:

- Aus Bequemlichkeit den AccessKey direkt im Code gespeichert und auf GitHub gepusht
- Allen Mitarbeitern "Administratorrechte" gegeben, und dann hat jemand versehentlich die Produktionsdatenbank geloescht
- Nach Projektuebergabe weiss niemand, wer noch die Zugangsdaten ehemaliger Mitarbeiter hat
- Von MFA gehoert, aber es als "zu umstaendlich" empfunden und nie aktiviert

Intuitiv wuerde man denken: **"Diese Mitarbeiter haben nicht genug Sicherheitsbewusstsein."**

Meistens liegt das Problem jedoch nicht bei den Menschen, sondern bei einem **fehlenden Berechtigungsmanagementsystem**.

<IntroProblemReasonSolution />

Angesichts dieser Herausforderungen reicht "einfach vorsichtig sein" nicht mehr aus. Wir brauchen eine systematische Methodik fuer das Berechtigungsmanagement - genau das Problem, das **IAM (Identity and Access Management)** zu loesen versucht.

---

## 1. Überblick über IAM/RAM Vom "Zugangskontrollsystem" erzaehlt


### 1.1 Analogie: Das intelligente Zutrittssystem des Bueros

Stell dir vor, dein Unternehmen zieht in ein neues Buerogebaeude:

| Szenario | Ohne IAM | Mit IAM |
| :--------- | :----------------------------- | :------------------------------------------- |
| Neuer Mitarbeiter | Ihm einen Masterkey geben, der alle Tueren oeffnet | Ihm eine Zugangskarte geben, die nur seine Abteilung oeffnet |
| Mitarbeiter verlaesst das Unternehmen | Schluessel ist weg, niemand weiss, wer ihn hat | Seine Zugangskarte sofort im System deaktivieren - alle Tueren bleiben verschlossen |
| Externe Mitarbeiter | Den Schluessel fuer ein paar Tage leihen | Eine temporäre Zugangskarte ausstellen, die nach 3 Tagen automatisch ablaeuft |
| Besucher | Empfang gibt einen Schluessel | Einen einmaligen Besucherausstellungscode, der nur fuer den Konferenzraum gueltig ist |

**IAM (Identity and Access Management)** funktioniert wie dieses "intelligente Zutrittssystem":

- **Identitaet (Identity)**: Wer? Mitarbeiter, Externe, Besucher, Anwendungen
- **Zugriff (Access)**: Welche Tueren koennen geoeffnet werden? Welche Aktionen sind erlaubt?
- **Verwaltung (Management)**: Wie Schluessel verteilen, wie sie einsammeln, wie Protokolle fuehren

### 1.2 AWS IAM vs. Alibaba Cloud RAM

<IamRamComparisonDemo />

Verschiedene Cloud-Anbieter haben ihre eigenen IAM-Implementierungen:

| Cloud-Anbieter | Dienstname | Kernkonzepte |
| :--------- | :----------------------------------- | :------------------------ |
| **AWS** | IAM (Identity and Access Management) | User, Group, Role, Policy |
| **Alibaba Cloud** | RAM (Resource Access Management) | Benutzer, Benutzergruppe, Rolle, Richtlinie |
| **Tencent Cloud** | CAM (Cloud Access Management) | Benutzer, Benutzergruppe, Rolle, Richtlinie |
| **Huawei Cloud** | IAM | Benutzer, Benutzergruppe, Delegation, Richtlinie |
| **Azure** | Azure AD + RBAC | User, Group, Role, RBAC |

Obwohl die Namen unterschiedlich sind, sind **die Kernkonzepte identisch**:

- **Benutzer (User)**: Repraesentiert eine konkrete Person oder Anwendung
- **Benutzergruppe (Group)**: Verwaltung von Berechtigungen fuer eine Gruppe von Benutzern
- **Rolle (Role)**: Definiert eine Reihe von Berechtigungen, die "angenommen" werden koennen
- **Richtlinie (Policy)**: Konkrete Berechtigungsregeln (erlauben/verbieten was)

---

## 2. Benutzer, Gruppen, Rollen: Überblick über sollte man verwenden

### 2.1 Der Unterschied zwischen drei "Identitaeten"

<IdentityProviderDemo />

Vergleich mit einem Bueroszenario:

| Konzept | Analogie | Anwendungsbereich | Besonderheit |
| :------------------ | :----------------------------- | :------------------- | :--------------------------------- |
| **Benutzer (User)** | Festangestellter mit eigenem Arbeitsplatz und Zugangskarte | Dauerhafte, stabile Teammitglieder | Hat permanente Anmeldeinformationen (Passwort, AK/SK) |
| **Benutzergruppe (Group)** | Abteilung, z. B. "Technik", "Vertrieb" | Massenverwaltung von Berechtigungen | Kann sich nicht anmelden, ist nur ein Berechtigungscontainer |
| **Rolle (Role)** | Temporaere Besucherkarte, externe Mitarbeiterkarte | Temporaere Berechtigung, kontouebergreifender Zugriff | Keine permanenten Anmeldeinformationen, erhaelt temporaere Credentials durch "Rolle annehmen" |

### 2.2 Praxisbeispiel: Die Berechtigungsevolution eines Startups

**Phase 1: Gruenderteam (2-3 Personen)**

```
Problem: Direkter Login mit dem Root-Konto, weil es "bequemer" ist
Risiko: Das Root-Konto hat alle Berechtigungen - bei Kompromittierung ist das gesamte Konto ruiniert
```

**Phase 2: Teamwachstum (5-10 Personen)**

```
Verbesserung: IAM-User fuer jeden erstellen, unterschiedliche Berechtigungen zuweisen
Problem:
- Betriebstechniker Xiao Wang hat das Unternehmen verlassen - auf welchen Servern liegen seine AK/SK noch?
- Der neue Frontend-Entwickler braucht S3-Lesezugriff, der Backend-Entwickler braucht RDS-Berechtigungen - manuelle Einrichtung ist muehsam
```

**Phase 3: Standardisierung (10-30 Personen)**

```
Verbesserung:
1. IAM-Gruppen nach Rollen erstellen:
   - Developers (Entwicklung): S3, EC2, RDS Lesen/Schreiben
   - DevOps (Betrieb): Volle Berechtigungen, aber MFA erforderlich
   - ReadOnly (Nur Lesen): Alle Ressourcen anzeigen, keine Aenderungen
   - QAs (Tests): Zugriff auf Testumgebungsressourcen

2. IAM-Rollen verwenden:
   - EC2-Instanzen nutzen Instance Profile, keine AK/SK mehr auf Servern
   - Kontouebergreifender Zugriff ueber Role Assume, keine gemeinsamen AK/SK
   - CI/CD nutzt OIDC Federation, keine Speicherung langfristiger Credentials
```

**Phase 4: Mehrere Konten / Enterprise-Level (30+ Personen)**

```
Architektur:
- Master Account (Hauptkonto): Nur fuer Rechnungsverwaltung und Organisationsstruktur, keine Ressourcen
- Audit Account (Audit-Konto): Sammelt Logs aller Konten
- Dev Account (Entwicklungskonto): Entwicklungsumgebung
- Staging Account (Pre-Release-Konto): Testumgebung
- Prod Account (Produktionskonto): Produktionsumgebung, strengste Berechtigungen

Berechtigungsfluss:
- Entwickler haben standardmaessig nur Lesezugriff auf das Dev-Konto
- Bei Aenderungen an der Produktionsumgebung: Ticket einreichen fuer temporaere Assume-Rolle im Prod-Konto
- Alle Assume-Operationen werden von CloudTrail protokolliert und regelmaessig auditiert
```

---

## 3. Rollen und Richtlinien: Die "Seele" des Berechtigungsmanagements

### 3.1 Die Essenz einer Rolle: Vertrauen + Berechtigungen

<RolePolicyDemo />

Eine IAM-Rolle besteht aus zwei Kernkomponenten:

1. **Vertrauensrichtlinie (Trust Policy)**: Wer darf diese Rolle annehmen?
2. **Berechtigungsrichtlinie (Permission Policy)**: Was darf man tun, nachdem man die Rolle angenommen hat?

Analogie mit einem Theaterstueck:

| Konzept | Analogie | Erklaerung |
| :-------------------- | :--------------------- | :----------------------------------------------------------------------------------------- |
| **Role (Rolle)** | "Hamlet" im Drehbuch | Definiert, welches Stueck gespielt wird (Berechtigungen) |
| **Trust Policy** | Der Regisseur sagt, "wer Hamlet spielen darf" | Koennte "Schauspieler dieser Truppe" (eigene Kontobenutzer), "ausgeliehene Schauspieler einer anderen Truppe" (kontouebergreifend) oder "Gastauftritte" (externer IdP) sein |
| **Permission Policy** | Der Inhalt des Stuecks | Was Hamlet tun kann: Text sprechen, fechten, wahnsinnig werden (konkrete Berechtigungen) |
| **Assume Role** | Der Schauspieler betritt die Buehne | Xiao Li wurde vom Regisseur als Hamlet ausgewaehlt und hat nach dem Betreten der Buehne alle im Drehbuch definierten Berechtigungen |
| **Temporaere Credentials** | Die Auftrittserlaubnis | Xiao Li erhaelt eine "temporaere Auftrittserlaubnis", die nach der Vorstellung ablaeuft |

### 3.2 Policy (Richtlinie): Die "Grammatik" der Berechtigungen

<PermissionHierarchyDemo />

Eine IAM-Policy ist ein JSON-Dokument, das definiert "wer welche Aktionen an welchen Ressourcen ausfuehren darf".

**Ein vollstaendiges Policy-Beispiel**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadWrite",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::my-app-bucket/*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": "ap-northeast-1"
        },
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        }
      }
    },
    {
      "Sid": "DenySensitiveData",
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::my-app-bucket/sensitive/*"
    }
  ]
}
```

**Erklaerung der Schluesselfelder**:

| Feld | Bedeutung | Beispiel |
| :------------ | :--------------------------------- | :----------------------- |
| **Version** | Policy-Syntaxversion | "2012-10-17" |
| **Statement** | Array von Berechtigungserklaerungen, kann mehrere Regeln enthalten | [...] |
| **Sid** | Anweisungs-ID, optional, zur Identifizierung dieser Regel | "AllowS3ReadWrite" |
| **Effect** | Wirkung: Allow (erlauben) oder Deny (verbieten) | "Allow" |
| **Action** | Erlaubte/verbotene Aktionen, Wildcards werden unterstuetzt | "s3:GetObject", "s3:\*" |
| **Resource** | Betroffene Ressourcen, identifiziert durch ARN | "arn:aws:s3:::bucket/\*" |
| **Condition** | Optional, wird nur unter bestimmten Bedingungen wirksam | Regionseinschraenkung, MFA-Anforderung etc. |

### 3.3 Berechtigungsprioritaet: Deny > Allow > Standardmaessig verweigern

Die Berechtigungsauswertung von IAM laesst sich in einem Satz zusammenfassen: **Explizites Deny gewinnt immer, ohne Allow wird standardmaessig verweigert.**

Der Auswertungsprozess:

```
1. Zunaechst pruefen, ob eine Deny-Policy vorliegt
   ├─ Deny vorhanden → Verweigern (unabhaengig von Allow)
   └─ Kein Deny → Weiter pruefen

2. Dann pruefen, ob eine Allow-Policy vorliegt
   ├─ Allow vorhanden → Erlauben
   └─ Kein Allow → Verweigern (Standard-Verweigerungsprinzip)
```

**Praxisbeispiel: Schuetze vertrauliche Daten**

```json
// Policy 1: Normale Berechtigungen fuer Entwickler
{
  "Effect": "Allow",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/*"
}

// Policy 2: Schuetze vertrauliche Verzeichnisse (auch wenn Entwickler s3:* haben)
{
  "Effect": "Deny",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/sensitive/*"
}
```

**Wichtige Punkte**:

- Entwickler haben zwar eine Allow-Berechtigung fuer `s3:*`
- Aber fuer vertrauliche Verzeichnisse existiert ein explizites Deny
- Deny hat hoehere Prioritaet, daher koennen Entwickler nicht auf vertrauliche Daten zugreifen
- Selbst wenn der Entwickler Administrator ist, bleibt dieses Deny wirksam (ausser beim Root-Konto)

---

## 4. Zugriffsschluessel (AK/SK): Ein Schluessel, der sorgfaeltig aufbewahrt werden muss

### 4.1 Was ist AK/SK

<AccessKeyManagementDemo />

Access Keys (Zugriffsschluessel) sind langfristige Anmeldeinformationen, die von Cloud-Diensten fuer programmgesteuerte API-Aufrufe bereitgestellt werden. Sie bestehen aus zwei Teilen:

| Bestandteil | Name | Funktion | Analogie |
| :-------------------- | :----------- | :------------------------- | :--------- |
| **Access Key ID** | Zugriffsschluessel-ID | Identifiziert wer du bist (aehnlich einem Benutzernamen) | Kontonummer |
| **Secret Access Key** | Geheimer Zugriffsschluessel | Beweist dass du es bist (aehnlich einem Passwort) | PIN |

### 4.2 Warum sind AK/SK "hochriskante Gegenstaende"

**Praxisbeispiel: Die Lektion eines Startups**

Xiao Li ist ein neuer Backend-Entwickler bei einem Startup. In seiner ersten Woche soll er eine Datei-Upload-Funktion debuggen.

```python
# Xiao Lis Code (ernsthaftes Sicherheitsproblem!)
import boto3

# Zur Erleichterung des Debuggens: AK/SK direkt im Code
s3 = boto3.client(
    's3',
    aws_access_key_id='AKIAIOSFODNN7EXAMPLE',
    aws_secret_access_key='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region_name='ap-northeast-1'
)

def upload_file(file_path, bucket_name, object_name):
    s3.upload_file(file_path, bucket_name, object_name)
    print(f"Datei hochgeladen nach s3://{bucket_name}/{object_name}")

# Test-Upload
upload_file('./test.jpg', 'my-company-bucket', 'uploads/test.jpg')
```

**Was eine Woche spaeter passierte**:

1. Xiao Li pusht den Code auf GitHub (einschliesslich AK/SK)
2. Der Code auf GitHub wird von einem Crawler gescannt, AK/SK werden extrahiert
3. Ein Angreifer nutzt diese Credentials, um zahlreiche EC2-Instanzen zum Krypto-Mining zu erstellen
4. Am Monatsende: Zusatzkosten von 12.000 USD
5. Bei der Audit wird der AK/SK-Leck entdeckt, Xiao Li wird zu einem Gespraech bestellt...

**Was lehrt uns dieses Beispiel?**

| Falsche Vorgehensweise | Richtige Vorgehensweise |
| :-------------------------- | :----------------------------------------------- |
| AK/SK im Code hartcodieren | IAM-Rollen verwenden, damit das Programm automatisch temporaere Credentials erhaelt |
| AK/SK in ein Git-Repository einchecken | `.gitignore` fuer Konfigurationsdateien nutzen und Secret-Management-Dienste verwenden |
| Langfristig denselben AK/SK ohne Rotation verwenden | Regelmassig AK/SK rotieren und temporaere Credentials statt langfristiger verwenden |
| AK/SK mit zu grossen Berechtigungen versehen | Prinzip der minimalen Rechte befolgen, nur notwendige Berechtigungen gewaehren |

### 4.3 Sicherheitsleitfaden fuer AK/SK

**Szenario 1: Lokale Entwicklung**

```bash
# Richtige Vorgehensweise: AWS CLI fuer Credentials konfigurieren, nicht im Code
aws configure
# Dann Access Key ID und Secret Access Key eingeben
# Diese werden in ~/.aws/credentials gespeichert, Berechtigungen auf 600 setzen

# Im Code sind keine Credentials noetig
import boto3
s3 = boto3.client('s3')  # Liest automatisch aus ~/.aws/credentials
```

**Szenario 2: Server/EC2**

```python
# Richtige Vorgehensweise: IAM Instance Profile verwenden
# 1. IAM-Rolle erstellen, benoetigte Berechtigungen anhaengen (z. B. S3ReadOnly)
# 2. Instance Profile erstellen und mit der Rolle verknuepfen
# 3. Beim Start von EC2 dieses Instance Profile auswaehlen

# Im Code sind ueberhaupt keine Credentials noetig
import boto3
s3 = boto3.client('s3')  # Erhaelt automatisch temporaere Credentials vom EC2-Metadatendienst

# Temporaere Credentials werden automatisch rotiert, keine Sorge vor Ablauf
```

**Szenario 3: CI/CD-Pipeline**

```yaml
# Richtige Vorgehensweise: OIDC Federation (OpenID Connect)
# Beispiel mit GitHub Actions:

# 1. OIDC Identity Provider in AWS erstellen, der GitHub vertraut
# 2. IAM-Rolle erstellen, deren Vertrauensrichtlinie bestimmten GitHub-Repos erlaubt, sie anzunehmen
# 3. In GitHub Actions konfigurieren

name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Wichtig: OIDC-Token-Anfrage erlauben
      contents: read
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
          aws-region: ap-northeast-1
          # Hinweis: Kein Access Key! Vollstaendig mit temporaeren Credentials

      - name: Deploy
        run: aws s3 sync ./build s3://my-bucket/
```

**Zusammenfassung: Sicherheitsebenen der AK/SK-Verwendung**

| Sicherheitsebene | Vorgehensweise | Anwendungsbereich | Risikolevel |
| :------- | :-------------------------- | :------------------------ | :------- |
| Hoechste | IAM-Rolle verwenden (keine langfristigen Credentials) | EC2, Lambda, ECS, CI/CD | Sehr niedrig |
| Hoch | OIDC Federation verwenden | GitHub Actions, GitLab CI | Niedrig |
| Mittel | Secret-Management-Dienst verwenden | Lokale Entwicklung, kleine Teams | Mittel |
| Niedrig | Umgebungsvariablen verwenden | Schnelle Prototypen, persoenliche Projekte | Hoch |
| Sehr niedrig | Im Code hartcodieren | In keinem Szenario empfohlen | Sehr hoch |

---

## 5. Multi-Faktor-Authentifizierung (MFA): Ein zusaetzliches "Schloss" fuer dein Konto

### 5.1 Was ist MFA

<MfaSecurityDemo />

MFA (Multi-Faktor-Authentifizierung), auch 2FA (Zwei-Faktor-Authentifizierung) genannt, ist ein Sicherheitsmechanismus, der Benutzer bei der Anmeldung verpflichtet, **zwei oder mehr** verschiedene Authentifizierungsfaktoren anzugeben:

| Faktortyp | Was es ist | Beispiele |
| :------------------------- | :----------------- | :------------- |
| **Wissensfaktor** (Was weisst du) | Informationen, die nur der Benutzer kennt | Passwort, PIN |
| **Besitzfaktor** (Was hast du) | Physische Geraete im Besitz des Benutzers | Smartphone, Hardware-Key |
| **Biometriefaktor** (Wer bist du) | Biometrische Merkmale des Benutzers | Fingerabdruck, Gesichtserkennung |

### 5.2 Warum ist MFA so wichtig

**Reale Zahlen geben die Antwort**:

| Angriffsmethode | Erfolgsquote ohne MFA | Erfolgsquote mit MFA |
| :----------------------- | :------------------ | :------------------------------ |
| Passwort-Raten/Brute-Force | Hoch | Sehr niedrig (zweiter Faktor fehlt) |
| Phishing-Angriffe zum Passwort-Diebstahl | Hoch | Sehr niedrig (Phishing-Seite kann MFA-Code nicht erhalten) |
| Passwort-Lecks (von anderen Websites) | Hoch | Sehr niedrig (zweiter Faktor fehlt) |

**Microsoft Security Report (2020)**: MFA kann **99,9%** aller automatisierten Angriffe blockieren.

### 5.3 MFA in der Praxis: MFA fuer das AWS-Root-Konto aktivieren

**Schritt 1: Bei der AWS-Konsole anmelden**

1. Mit Root-Konto-E-Mail und Passwort anmelden
2. Oben rechts auf den Kontonamen klicken, "Security Credentials" auswaehlen

**Schritt 2: MFA aktivieren**

1. Den Bereich "Multi-factor authentication (MFA)" finden
2. "Assign MFA device" klicken
3. MFA-Geraetetyp auswaehlen ("Authenticator app" empfohlen)

**Schritt 3: Virtuelles MFA konfigurieren**

1. Google Authenticator oder Microsoft Authenticator auf dem Smartphone installieren
2. QR-Code scannen oder Schluessel manuell eingeben
3. Den 6-stelligen Code aus der App eingeben (zwei Codes hintereinander eingeben, da der Code alle 30 Sekunden aktualisiert wird)

**Fertig!** Dein Root-Konto ist jetzt durch MFA geschuetzt.

---

## 6. Kontoübergreifender Zugriff: Ansatz für man sicher "zu Besuch" geht

### 6.1 Warum ist kontoübergreifender Zugriff noetig

<CrossAccountAccessDemo />

Mit dem Wachstum des Unternehmens nutzen viele Firmen eine **Multi-Konto-Architektur** zur Isolierung verschiedener Umgebungen:

| Kontotyp | Zweck | Berechtigungsanforderung |
| :------------------ | :--------------------- | :----------------- |
| **Master Account** | Organisationsverwaltung, Abrechnung | Kaum Nutzung |
| **Security Audit** | Zentrale Erfassung aller Konto-Logs | Lesezugriff auf andere Konten |
| **Shared Services** | Gemeinsame Ressourcen (Image-Registries etc.) | Andere Konten haben nur Lesezugriff |
| **Development** | Entwicklungsumgebung | Entwickler haben volle Berechtigungen |
| **Staging** | Test-/Pre-Release-Umgebung | Tester-Berechtigungen |
| **Production** | Produktionsumgebung | Streng limitiert, Genehmigung erforderlich |

**Frage: Wie laesst die EC2 im Production-Konto Images aus dem Shared Services-Konto abrufen?**

- Loesung A: AK/SK in die Benutzerdaten von Production schreiben (Gefaehrlich! AK/SK-Leck-Risiko)
- Loesung B: Kontouebergreifenden Role Assume verwenden (Empfohlen! Temporaere Credentials, automatische Rotation)

### 6.2 Prinzip des kontoübergreifenden Role Assume

```
Konto A (Production)                    Konto B (Shared Services)
    |                                           |
    |  1. Assume Role anfragen                  |
    |  "Ich moechte die ECRReadRole von Konto B annehmen" |
    |------------------------------------------>|
    |                                           |
    |                    2. Vertrauensrichtlinie pruefen |
    |                    "Darf Konto A mich annehmen?" |
    |                                           |
    |  3. Temporaere Credentials zurueckgeben   |
    |  AccessKeyId, SecretKey, SessionToken    |
    |<------------------------------------------|
    |                                           |
    |  4. Temporaere Credentials fuer ECR-Zugriff verwenden |
    |  docker pull kontoB.dkr.ecr...            |
```

**Wichtige Punkte**:

- Temporaere Credentials sind standardmaessig 1 Stunde gueltig, maximal 12 Stunden konfigurierbar
- Keine langfristigen Credentials im Code gespeichert
- Die Vertrauensrichtlinie kann einschraenken, wer die Rolle annehmen darf (z. B. bestimmte Konten, bestimmte externe IDs)

### 6.4 Praxis: Kontoübergreifenden ECR-Zugriff konfigurieren

**Szenario**: Die EC2 im Production-Konto muss Docker-Images aus dem Shared Services-Konto abrufen.

**Schritt 1: IAM-Rolle im Shared Services-Konto erstellen**

1. In der AWS-Konsole des Shared Services-Kontos anmelden
2. IAM -> Roles -> Create role
3. "Another AWS account" auswaehlen
4. Account-ID des Production-Kontos eingeben
5. Optional: "Require external ID" aktivieren und eine zufaellige Zeichenkette eingeben (erhoeht die Sicherheit)
6. Berechtigung anhaengen: AmazonEC2ContainerRegistryReadOnly
7. Rolle benennen: CrossAccountECRReadRole

**Schritt 2: Role-ARN abrufen**

Nach der Erstellung den ARN der Rolle kopieren:

```
arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole
```

**Schritt 3: EC2-Instanz im Production-Konto konfigurieren**

Methode A: Instance Profile verwenden (empfohlen)

1. IAM-Rolle im Production-Konto erstellen (fuer EC2)
2. Vertrauensrichtlinie: Vertraut dem EC2-Dienst
3. Berechtigungsrichtlinie: Assume der kontoübergreifenden Rolle erlauben

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole"
    }
  ]
}
```

4. Instance Profile erstellen und mit dieser Rolle verknuepfen
5. Beim Start von EC2 dieses Instance Profile auswaehlen

Methode B: Dynamisches Assume Role in den EC2-Benutzerdaten

```bash
#!/bin/bash
# AWS CLI installieren
yum install -y aws-cli

# Kontouebergreifende Rolle annehmen
CREDS=$(aws sts assume-role \
  --role-arn arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole \
  --role-session-name EC2PullSession)

# Temporaere Credentials extrahieren
export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r '.Credentials.SessionToken')

# Bei ECR anmelden
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com

# Image abrufen
docker pull SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/my-app:latest
```

**Schritt 4: Kontouebergreifenden Zugriff testen**

Auf der EC2 im Production-Konto ausfuehren:

```bash
# Testen, ob Role Assume moeglich ist
aws sts get-caller-identity
# Sollte anzeigen: arn:aws:sts::PRODUCTION_ACCOUNT_ID:assumed-role/CrossAccountECRReadRole/EC2PullSession

# Testen, ob ECR-Repositories des Shared Services-Kontos aufgelistet werden koennen
aws ecr describe-repositories --registry-id SHARED_SERVICES_ACCOUNT_ID
```

**Fertig!** Die EC2 im Production-Konto kann nun sicher Images aus dem Shared Services-Konto abrufen, ohne langfristige Credentials zu teilen.

---

## 7. Praxis: Ein sicheres Berechtigungssystem aufbauen

### 7.1 Berechtigungsarchitektur von Grund auf neu erstellen

<BestPracticesDemo />

Angenommen, du bist der technische Leiter eines 10-Personen-Startups und musst die AWS-Berechtigungsarchitektur von Grund auf entwerfen. Hier sind die empfohlenen Implementierungsschritte:

**Phase 1: Root-Konto-Schutz (Tag 1)**

```
Ziel: Das Root-Konto schuetzen - das wichtigste Konto

1. MFA fuer Root-Konto aktivieren (Pflicht)
   - Hardware-MFA (YubiKey) oder Google Authenticator empfohlen

2. IAM-Administratorkonto erstellen
   - Benutzername: admin (oder dein Name)
   - Berechtigungen: AdministratorAccess (wird spaeter eingeschraenkt)
   - MFA aktivieren

3. Access Key des Root-Kontos loeschen (falls erstellt)
   - Das Root-Konto sollte niemals AK/SK haben

4. Nutzungswarnung fuer Root-Konto konfigurieren
   - CloudWatch + SNS: E-Mail/SMS bei Root-Konto-Login
```

**Phase 2: Team-Berechtigungsgruppierung (Woche 1)**

```
Ziel: Teammitglieder in Gruppen einteilen und Berechtigungen massenweise verwalten

1. Teamrollen analysieren:
   - Backend-Entwicklung (2 Personen)
   - Frontend-Entwicklung (1 Person)
   - Mobile-Entwicklung (1 Person)
   - Produktmanager (1 Person)
   - Designer (1 Person)
   - Gruender/Administratoren (3 Personen)

2. IAM-Gruppen erstellen:

   Group: Developers
   ├── Mitglieder: Alle Entwickler (Backend, Frontend, Mobile)
   ├── Berechtigungen:
   │   ├── EC2: Starten, Stoppen, Anzeigen (aber keine fremden Instanzen loeschen)
   │   ├── S3: Lesen/Schreiben im Entwicklungsumgebungs-Bucket
   │   ├── RDS: Nur Lesezugriff (keine Aenderungen an der Produktionsdatenbank)
   │   └── CloudWatch: Logs anzeigen
   └── Einschraenkung: Nur Region ap-northeast-1

   Group: ProductTeam
   ├── Mitglieder: Produktmanager, Designer
   ├── Berechtigungen:
   │   ├── S3: Nur Lesen (Datendateien anzeigen)
   │   ├── CloudWatch Dashboard: Monitoring-Diagramme anzeigen
   │   └── Cost Explorer: Rechnungen anzeigen (aber nicht aendern)
   └── Einschraenkung: Nur Lesezugriff, keine Ressourcen aendern

   Group: Administrators
   ├── Mitglieder: Gruender, Technischer Leiter
   ├── Berechtigungen: AdministratorAccess
   └── Anforderung: MFA muss fuer Aktionen verwendet werden

3. IAM-User fuer jede Person erstellen und der entsprechenden Gruppe hinzufuegen
   - Keine direkten Berechtigungen fuer Einzelpersonen, immer ueber Gruppen verwalten
   - MFA aktivieren (Pflicht)
```

**Phase 3: Optimierung der Anwendungsebene (Woche 2-4)**

```
Ziel: Anwendungen sicheren Zugriff auf AWS-Ressourcen gewaehren

1. EC2-Instanzen nutzen Instance Profile
   - Keine AK/SK mehr auf Servern konfigurieren
   - IAM-Rolle erstellen, benoetigte Berechtigungen anhaengen (z. B. S3 Lesen/Schreiben)
   - Instance Profile erstellen und mit Rolle verknuepfen
   - Beim Start von EC2 dieses Instance Profile auswaehlen
   - Im Anwendungscode direkt boto3 verwenden, ohne Credentials zu konfigurieren

2. Falls AK/SK zwingend erforderlich (Drittanbieter-Integration)
   - AWS Secrets Manager fuer AK/SK verwenden
   - Beim Start der Anwendung aus Secrets Manager lesen
   - Regelmaessige Rotation einrichten (90 Tage)
   - Nutzung von AK/SK ueberwachen

3. CloudTrail fuer alle API-Aufrufe konfigurieren
   - Separaten S3-Bucket fuer Logs erstellen
   - Log-Datei-Ueberpruefung aktivieren (Manipulationsschutz)
   - SNS-Benachrichtigung fuer kritische Ereignisse (z. B. Root-Konto-Nutzung, Policy-Aenderungen)
```

**Phase 4: Sicherheitsverstaerkung (fortlaufend)**

```
Ziel: Kontinuierliches Sicherheitsmonitoring und Verbesserung aufbauen

1. AWS Config aktivieren
   - Ressourcenkonfigurationsaenderungen ueberwachen
   - Compliance pruefen (z. B. ob Sicherheitsgruppen 0.0.0.0/0 geoeffnet haben)

2. IAM Access Analyzer aktivieren
   - Ressourcen-Policies kontinuierlich analysieren
   - Externen Zugriff identifizieren (z. B. ob S3-Bucket oeffentlich ist)

3. Regelmaessige IAM-Konfigurationspruefung
   - Monatliche Ueberpruefung ungenutzter IAM-User und Rollen
   - Access Key-Nutzung pruefen
   - Gruppenmitgliedschaften auf Plausibilitaet pruefen

4. Sicherheitsincident-Response-Prozess etablieren
   - Bei AK/SK-Leck: Sofort loeschen, rotieren, Auswirkungen auditieren
   - Bei ungewoehnlichen API-Aufrufen: Sofort untersuchen, Berechtigungen einschraenken
```

---

## 8. Haeufige Missverstaendnisse und Vermeidungsstrategien

### 8.1 Die zehn IAM-Anti-Patterns

| # | Anti-Pattern | Warum schlecht | Richtige Vorgehensweise |
| :-- | :--------------------------- | :--------------------------------------------- | :----------------------------------------------- |
| 1 | Root-Konto fuer taegliche Operationen verwenden | Root-Konto hat alle Berechtigungen, bei Kompromittierung kann der Schaeden nicht begrenzt werden | IAM-Administratorkonto erstellen, Root-Konto nur bei Bedarf verwenden |
| 2 | Allen AdministratorAccess geben | Verletzt das Prinzip der minimalen Rechte, erhoeht das Risiko von Fehlern und Insider-Bedrohungen | Nach Rollen gruppieren, nur notwendige Berechtigungen gewaehren |
| 3 | AK/SK im Code hartcodieren | AK/SK koennen ueber GitHub geleakt werden und sind schwer zu rotieren | IAM-Rollen, Umgebungsvariablen oder Secret-Management-Dienste verwenden |
| 4 | AK/SK langfristig nicht rotieren | Erhoeht das Risikozeitfenster bei geleakten Credentials | 90-Tage-Rotationsrichtlinie oder besser: temporaere Credentials verwenden |
| 5 | MFA ignorieren | Nach Passwort-Leck ist das Konto sofort kompromittiert | MFA fuer alle IAM-Benutzer aktivieren, insbesondere fuer hochprivilegierte Benutzer |
| 6 | CloudTrail nicht verwenden | Keine Audit-Moeglichkeit, wer was getan hat; nach Vorfällen keine Rueckverfolgung | CloudTrail aktivieren und Logs in einem separaten Audit-Konto speichern |
| 7 | IAM-Policy zu grosszuegig | Z. B. `Resource: "*"`, `Action: "*"`, vergrössert die Angriffsflaeche | Ressourcen-ARN und konkrete Actions explizit angeben |
| 8 | IAM-User ehemaliger Mitarbeiter nicht bereinigen | Zombie-Konten koennen zu Hintertueren werden | Offboarding-Prozess etablieren, IAM-User sofort deaktivieren und loeschen |
| 9 | IAM Access Analyzer nicht verwenden | Kann zu grosszuegige Ressourcen-Policies nicht erkennen (z. B. oeffentliche S3-Buckets) | IAM Access Analyzer aktivieren, regelmaessig externen Zugriff pruefen |
| 10 | Policy nicht in Testumgebung validieren | Direkte Anwendung in der Produktion kann zu Dienstunterbrechungen fuehren | IAM Policy Simulator zum Testen verwenden, zunaechst in Testumgebung validieren |

---

## 9. Glossar

| Englischer Begriff | Deutsche Uebersetzung | Erklaerung |
| :--------------------------------------- | :-------------- | :----------------------------------------- |
| **IAM (Identity and Access Management)** | Identitaets- und Zugriffsverwaltung | Cloud-Dienst zur Verwaltung von Benutzeridentitaeten und Zugriffsberechtigungen |
| **RAM (Resource Access Management)** | Ressourcenzugriffsverwaltung | Bezeichnung des IAM-Dienstes bei Alibaba Cloud |
| **Root Account** | Root-Konto | Das bei der Registrierung erstellte Besitzerkonto mit hoechsten Berechtigungen |
| **IAM User** | IAM-Benutzer/Subkonto | Vom Root-Konto erstellte Unteridentitaet fuer den taeglichen Gebrauch |
| **IAM Role** | IAM-Rolle | Temporaere Berechtigungsinstanz ohne langfristige Credentials, muss "angenommen" werden |
| **IAM Policy** | IAM-Richtlinie | Im JSON-Format definierte Berechtigungsregeln |
| **ARN** | Amazon-Ressourcenname | Global eindeutiger Ressourcenbezeichner |
| **AK/SK** | Zugriffsschluessel/Geheimer Schluessel | Credentials fuer den programmatischen Zugriff auf Cloud-APIs |
| **STS** | Security Token Service | Dienst zur Bereitstellung temporaerer Sicherheitsanmeldeinformationen |
| **MFA** | Multi-Faktor-Authentifizierung | Authentifizierungsmethode mit zwei oder mehr Faktoren |
| **SSO** | Single Sign-On | Authentifizierungsmethode, bei der ein Login Zugriff auf mehrere Systeme gewaehrt |
| **ExternalId** | Externe ID | Sicherheitsbezeichner zur Verhinderung von Confused-Deputy-Angriffen |
| **CloudTrail** | Cloud-Audit-Dienst | Protokolliert alle API-Aufrufe und Aktionen im Cloud-Konto |

---

## Zusammenfassung: Die Kernprinzipien der Cloud-Zugriffsverwaltung

Cloud-Zugriffsverwaltung ist kein einmaliger Akt, sondern muss sich mit der Teamgroesse und den geschaeftlichen Anforderungen kontinuierlich weiterentwickeln:

1. **Startphase** (1-10 Personen):
   - Root-Konto schuetzen (MFA + nicht fuer taegliche Operationen verwenden)
   - IAM-Administratorkonto erstellen
   - Grundlegende Gruppierung (Developers, Admins)

2. **Wachstumsphase** (10-50 Personen):
   - Verfeinerte Berechtigungsgruppierung (Frontend, Backend, Betrieb, Produkt etc.)
   - IAM-Rollen statt AK/SK verwenden
   - CloudTrail-Audit aktivieren
   - Regelmaessige Berechtigungspruefung

3. **Reifephase** (50+ Personen / mehrere Konten):
   - Multi-Konto-Architektur (Dev, Staging, Prod getrennt)
   - Zentrales Log-Audit-Konto
   - Automatisierte Berechtigungspruefung und Alarmierung
   - Ausgereifter Berechtigungsantrag- und Genehmigungsprozess

**Drei Kernprinzipien merken**:

1. **Prinzip der minimalen Rechte**: Nur notwendige Berechtigungen gewaehren, kein AdministratorAccess
2. **Keine langfristigen Credentials**: IAM-Rollen und temporaere Credentials bevorzugen, AK/SK-Lecks vermeiden
3. **MFA aktivieren**: Insbesondere fuer Root-Konto und hochprivilegierte Konten - die wirksamste Sicherheitsmassnahme

---

> **Weiterfuehrende Literatur**:
>
> - [AWS IAM Offizielle Dokumentation](https://docs.aws.amazon.com/iam/)
> - [Alibaba Cloud RAM Offizielle Dokumentation](https://www.aliyun.com/product/ram)
> - [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

