# Data Governance: Datenverwaltung

::: tip Vorwort
**Sind Sie schon einmal in folgende Situation geraten: Die Zahlen im Bericht stimmen nicht mit dem tatsächlichen Geschäft überein, die Informationen desselben Nutzers sind in zwei Systemen unterschiedlich, oder die Analyseergebnisse sind wegen fehlerhafter Daten völlig unzuverlässig?** Data Governance ist der systematische Ansatz zur Lösung dieser Probleme. Im Zeitalter der „datengetriebenen Entscheidungsfindung" bestimmt die Datenqualität direkt die Entscheidungsqualität — Garbage In, Garbage Out.
:::

**Was werden Sie in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels werden Sie Folgendes erworben haben:

- **Datenqualitätsdimensionen**: Die sechs Qualitätsdimensionen wie Vollständigkeit, Genauigkeit, Konsistenz usw. verstehen
- **Data-Governance-System**: Das Governance-Framework von Organisation, Prozessen bis Technologie kennenlernen
- **Datenherkunft (Data Lineage)**: Die全程-Verfolgung von der Quelle bis zum Verbrauch beherrschen
- **Metadatenmanagement**: Die Bedeutung von „Daten über Daten" verstehen
- **Daten-Schichtenarchitektur**: Das DWH-Schichtenmodell ODS → DWD → DWS → ADS beherrschen
- **Praktische Fähigkeiten**: Wissen, wie man Data Governance in Projekten umsetzt

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | Datenqualitätsdimensionen | Vollständigkeit, Genauigkeit, Konsistenz, Aktualität |
| **Kapitel 2** | Data-Governance-Framework | Organisation, Prozesse, Technologie, Kultur |
| **Kapitel 3** | Datenherkuntsverfolgung | Auswirkungsanalyse, Problemuntersuchung, Compliance-Audit |
| **Kapitel 4** | Metadatenmanagement | Technische Metadaten, Geschäfts-Metadaten, operative Metadaten |
| **Kapitel 5** | Daten-Schichtenarchitektur | ODS, DWD, DWS, ADS |
| **Kapitel 6** | Governance-Tools und Praxis | Great Expectations, dbt, DataHub |

---

## 0. Gesamtbild: Motivation von wird Data Governance benötigt

Data Governance ist kein technisches Problem, sondern ein **Management-Problem**. Es beantwortet die Kernfrage: **Wer ist für die Daten verantwortlich? Was sind die Standards für Daten? Wie wird sichergestellt, dass die Daten kontinuierlich vertrauenswürdig bleiben?**

Stellen Sie sich ein Unternehmen mit 100 Datentabellen vor, die von verschiedenen Teams verwaltet werden, ohne einheitliche Namenskonventionen, kein Datenwörterbuch und keine Qualitätsprüfungen. Das Ergebnis: Dieselbe Kennzahl „monatlich aktive Nutzer" wird von der Marketingabteilung mit 5 Millionen und von der Produktabteilung mit 3 Millionen berechnet — weil die Definition unterschiedlich ist.

::: tip Die vier Säulen der Data Governance
1. **Organisation**: Die Rollen und Verantwortlichkeiten von Data Ownern und Data Stewards klar definieren
2. **Prozesse**: Standardisierte Prozesse für Datenintegration, -änderung und -abschaffung etablieren
3. **Technologie**: Tools für Datenqualitätsmonitoring, Metadatenmanagement und Lineage-Tracking einsetzen
4. **Kultur**: Das gesamte Unternehmen davon überzeugen, dass „Daten ein Vermögenswert" sind und kein „Nebenprodukt"
:::

---

## 1. Die sechs Dimensionen der Datenqualität

Datenqualität ist kein vages Konzept, sondern kann anhand von sechs konkreten Dimensionen gemessen werden. Jede Dimension hat eine klare Definition und Nachweismethoden.

<DataQualityDemo />

| Dimension | Definition | Nachweismethode | Häufige Probleme |
|------|------|---------|---------|
| Vollständigkeit | Fehlen Daten? | Nullwert-Rate prüfen | Pflichtfelder leer, verknüpfte Daten fehlen |
| Genauigkeit | Sind die Daten korrekt? | Regelprüfung, Stichprobenabgleich | Negative Beträge, ungültiges Datum |
| Konsistenz | Stimmen Daten aus verschiedenen Quellen überein? | Systemübergreifender Vergleich | Nutzername in CRM und Bestellsystem unterschiedlich |
| Aktualität | Werden die Daten rechtzeitig aktualisiert? | Aktualisierungszeitpunkt prüfen | Bestandsdaten verzögert, Preise nicht synchronisiert |
| Eindeutigkeit | Gibt es doppelte Datensätze? | Duplikatsprüfung | Derselbe Nutzer hat sich zweimal registriert |
| Gültigkeit | Entspricht die Form den Regeln? | Regex-/Bereichsvalidierung | E-Mail-Format fehlerhaft, Alter ist negativ |

::: tip Die 1-10-100-Regel der Datenqualität
- **1 Einheit**: Validierung am Daten-Input, um fehlerhafte Daten fernzuhalten
- **10 Einheiten**: Bereits vorhandene fehlerhafte Daten im Data Warehouse bereinigen
- **100 Einheiten**: Verlust durch fehlerhafte Entscheidungen aufgrund fehlerhafter Daten

Je früher Datenqualitätsprobleme erkannt und behoben werden, desto geringer sind die Kosten.
:::

---

## 2. Data-Governance-Framework: Management über den gesamten Lebenszyklus

Data Governance ist kein einmaliges Projekt, sondern ein kontinuierlicher Prozess über den gesamten Datenlebenszyklus. Von der Datenerstellung bis zur Löschung muss jede Phase klare Standards und Verantwortliche haben.

<DataGovernanceFrameworkDemo />

| Phase | Kernergebnis | Schlüsselrolle |
|------|---------|---------|
| Standards definieren | Datenwörterbuch, Namenskonventionen, Klassifizierungs- und Einstufungsstandards | Datenarchitekt |
| Erfassung und Integration | Integrationsrichtlinien, Validierungsregeln, Lineage-Dokumentation | Daten-Ingenieur |
| Speicherung und Verwaltung | Schichtenmodell, Berechtigungs-Matrix, Lebenszyklusrichtlinien | DBA / Plattform-Ingenieur |
| Nutzung und Verbrauch | Datenkatalog, Maskierungsregeln, Qualitätsberichte | Datenanalyst / Fachbereich |
| Archivierung und Löschung | Archivierungsstrategie, Löschungsprotokolle, Audit-Logs | Security & Compliance-Team |

## 2. Data-Governance-Framework

Data Governance lässt sich nicht durch den Kauf eines Tools lösen; es erfordert ein vollständiges Framework. Das in der Branche am häufigsten verwendete Referenz-Framework ist DAMA-DMBOK (Data Management Body of Knowledge).

| Governance-Bereich | Kerninhalt | Schlüsselergebnis |
|---------|---------|---------|
| Datenarchitektur | Datenmodelle, Datenflüsse und Speicherstrategien definieren | Datenarchitekturdiagramm, ER-Diagramm |
| Datenstandards | Einheitliche Namenskonventionen, Kodierungsregeln und Kennzahlendefinitionen | Datenwörterbuch, Kennzahlenkatalog |
| Datenqualität | Qualitätsregeln, Monitoring-Alerts und Korrekturprozesse etablieren | Qualitätsberichte, SLA-Dashboard |
| Datensicherheit | Klassifizierung, Zugriffskontrolle, Maskierung und Verschlüsselung | Sicherheitsrichtlinie, Audit-Logs |
| Masterdatenmanagement | Einheitliche „Goldene Datensätze" für Kern-Entitäten wie Kunden, Produkte | Masterdaten-Hub |
| Datenlebenszyklus | Den gesamten Prozess von der Erstellung über die Archivierung bis zur Löschung verwalten | Aufbewahrungsrichtlinien, Archivierungsregeln |

::: tip Das Reifegradmodell der Data Governance
- **Stufe 1 - Initial**: Keine einheitlichen Standards, jedes Team arbeitet isoliert
- **Stufe 2 - Repeatable**: Grundlegende Standarddokumente vorhanden, aber inkonsequente Umsetzung
- **Stufe 3 - Defined**: Einheitliche Governance-Prozesse und Tools, die meisten Teams halten sich daran
- **Stufe 4 - Managed**: Quantitative Qualitätskennzahlen und automatisiertes Monitoring vorhanden
- **Stufe 5 - Optimized**: Kontinuierliche Verbesserung, Data Governance ist in den täglichen Entwicklungsprozess integriert
:::

---

## 3. Datenherkunft: Woher kommen die Daten, wohin gehen sie

Data Lineage dokumentiert den vollständigen Transformationspfad der Daten von der Quelle bis zum endgültigen Verbrauch. Es ist wie ein „Stammbaum" der Daten, der es Ihnen ermöglicht, die Herkunft und Verbindung jedes einzelnen Datenwerts zurückzuverfolgen.

<DataLineageDemo />

Data Lineage hat in der Praxis drei zentrale Anwendungsszenarien:

| Szenario | Problem | Wie Lineage hilft |
|------|------|------------|
| Auswirkungsanalyse | Wenn ich ein Feld in der Nutzertabelle ändere, welche Downstream-Berichte sind betroffen? | Alle Abhängigkeiten der Lineage nach unten verfolgen |
| Ursachenanalyse | Der heutige GMV-Bericht zeigt anomale Daten — in welchem Schritt liegt das Problem? | Jeden Schritt der Lineage nach oben zurückverfolgen |
| Compliance-Audit | Durch welche Systeme ist die Handynummer des Nutzers gegangen? Sind alle maskiert? | Die vollständige Journey sensibler Felder verfolgen |

::: tip Zwei Methoden der Lineage-Erfassung
- **Aktive Erfassung**: SQL-Anweisungen und ETL-Konfigurationen parsen, um Tabellen-/Feld-Lineage-Beziehungen automatisch zu extrahieren
- **Passive Erfassung**: Über Hooks die Ausführungspläne von Abfragemotoren (z. B. Hive, Spark) abfangen und Lineage in Echtzeit aufzeichnen

Gängige Tools wie Apache Atlas, DataHub und OpenLineage unterstützen alle die automatisierte Lineage-Erfassung.
:::

---

## 4. Metadatenmanagement: „Daten über Daten"

Metadaten (Metadata) sind Daten über Daten. Wenn die Daten der Inhalt eines Buches sind, dann sind die Metadaten das Inhaltsverzeichnis, der Autor, das Veröffentlichungsdatum und die ISBN-Nummer des Buches. Ohne Metadaten sind Daten nur ein unverständlicher Haufen aus Zahlen und Zeichenketten.

| Metadatentyp | Beschreibung | Beispiel |
|-----------|------|------|
| Technische Metadaten | Physische Speicherinformationen der Daten | Tabellenname, Feldtyp, Partitionierung, Speicherort |
| Geschäfts-Metadaten | Die geschäftliche Bedeutung der Daten | Deutscher Feldname, Geschäftsdefinition, Berechnungsformel |
| Operative Metadaten | Der Betriebszustand der Daten | ETL-Laufzeit, Datenmenge, Aktualisierungsfrequenz |

::: tip Die Bedeutung des Datenwörterbuchs
Das Datenwörterbuch ist das grundlegendste Ergebnis des Metadatenmanagements. Ein gutes Datenwörterbuch sollte Folgendes enthalten:
- **Feldname**: Englischer und deutscher Name
- **Datentyp**: VARCHAR(50), INT, DATETIME usw.
- **Geschäftsdefinition**: Was stellt dieses Feld dar? Wie wird es berechnet?
- **Wertebereich**: Was sind gültige Werte? Sind Nullwerte erlaubt?
- **Verantwortlicher**: Wer pflegt dieses Feld? Wen kontaktieren bei Fragen?

Ohne Datenwörterbuch kann es für neue Mitarbeiter eine Woche dauern, die Bedeutung einer Tabelle zu verstehen; mit einem Datenwörterbuch reichen 10 Minuten.
:::

---

## 5. Daten-Schichtenarchitektur: ODS → DWD → DWS → ADS

Ein Data Warehouse schlichtet nicht alle Daten auf einem Haufen, sondern speichert sie nach **Verarbeitungsgrad** in Schichten. Jede Schicht hat klar definierte Verantwortlichkeiten; obere Schichten hängen von unteren ab und veredeln die Daten schrittweise von Rohdaten zu geschäftsverwertbaren Daten.

| Schicht | Vollständiger Name | Verantwortung | Datenmerkmale |
|------|------|------|---------|
| ODS | Operational Data Store | Geschäftliche Datenbanken 1:1 synchronisiert | Am rohesten, unbearbeitet |
| DWD | Data Warehouse Detail | Bereinigung, Standardisierung, Deduplizierung | Saubere Detaildatensätze |
| DWS | Data Warehouse Summary | Thematische Aggregation (Tag/Woche/Monat) | Vorberechnete aggregierte Kennzahlen |
| ADS | Application Data Service | Auf spezifische Berichte/APIs ausgerichtet | Direkt nutzbare Ergebnisdaten |

::: tip Warum Schichtenbildung?
- **Wiederverwendung**: Die DWD-Schicht wird einmal bereinigt und von allen oberen Schichten gemeinsam genutzt — doppelte Bereinigung wird vermieden
- **Entkopplung**: Änderungen an der Geschäftsdatenbank-Tabellenstruktur betreffen nur die ODS-Schicht und schlagen nicht auf Berichte durch
- **Performance**: Die DWS-Schicht ist voraggregiert; Berichtsabfragen lesen direkt, ohne Echtzeitberechnung
- **Rückverfolgbarkeit**: Jede Schicht bleibt erhalten; bei Problemen kann schichtweise untersucht werden
:::

---

## 6. Governance-Tools und Praxis

| Tool | Positionierung | Kernfähigkeiten | Anwendungsszenarien |
|------|------|---------|---------|
| Great Expectations | Datenqualität | Deklarative Datenvalidierungsregeln, automatische Qualitätsberichte | Python-Datenpipelines |
| dbt | Datentransformation | SQL-modellbasierte Entwicklung, integrierte Tests und Dokumentationsgenerierung | DWH-Modellierung |
| DataHub | Metadatenmanagement | Datenkatalog, Lineage-Tracking, Data Discovery | Enterprise Data Governance |
| Apache Atlas | Metadatenmanagement | Lineage-Tracking im Hadoop-Ökosystem | Big-Data-Plattformen |
| OpenMetadata | Metadatenmanagement | Open-Source-Datenkatalog, unterstützt verschiedene Datenquellen | Kleine und mittlere Teams |
| Amundsen | Data Discovery | Suchbasierte Datenentdeckungsplattform | Daten-Demokratisierung |

::: tip Governance-Pfad von Null
Wenn Ihr Team noch keine Data Governance hat, empfehlen wir die Umsetzung in dieser Reihenfolge:
1. **Zuerst ein Datenwörterbuch erstellen**: Die Bedeutung der vorhandenen Tabellen und Felder dokumentieren (selbst in Excel)
2. **Qualitätsprüfungen hinzufügen**: Grundlegende Nullwert- und Bereichsprüfungen in wichtige Datenpipelines einbauen
3. **Kennzahlendefinitionen vereinheitlichen**: Die Berechnungsformeln für Kernkennzahlen wie „DAU", „MAU", „GMV" vereinheitlichen
4. **Tools einführen**: Wenn die Kosten der manuellen Verwaltung zu hoch werden, Tools wie DataHub oder dbt einführen
5. **Prozesse etablieren**: Datenänderungen erfordern Reviews; Qualitätsprobleme haben SLAs und Alerts
:::

---

## Zusammenfassung

Data Governance ist das systematische Engineering, das Daten von „nutzbar" zu „gut nutzbar, vertrauenswürdig und rückverfolgbar" macht. Es ist kein einmaliges Projekt, sondern ein kontinuierlicher Betriebsprozess.

Die wichtigsten Erkenntnisse dieses Kapitels im Rückblick:

1. **Sechs Qualitätsdimensionen**: Vollständigkeit, Genauigkeit, Konsistenz, Aktualität, Eindeutigkeit, Gültigkeit
2. **Vier Governance-Säulen**: Organisation, Prozesse, Technologie, Kultur — keine darf fehlen
3. **Datenherkunft (Lineage)**: Die Herkunft und den Fluss der Daten nachverfolgen und Auswirkungsanalysen sowie Problemuntersuchungen unterstützen
4. **Metadatenmanagement**: Das Datenwörterbuch ist das grundlegendste und wichtigste Governance-Ergebnis
5. **Schichtenarchitektur**: ODS → DWD → DWS → ADS — Datenwert wird Schicht für Schicht veredelt
6. **Schrittweise Umsetzung**: Mit dem Datenwörterbuch beginnen und schrittweise Tools und Prozesse einführen

## Weiterführende Literatur

- [DAMA-DMBOK](https://www.dama.org/cpages/body-of-knowledge) - Data Management Body of Knowledge, die „Bibel" der Data Governance
- [DataHub](https://datahubproject.io/) - Open-Source-Metadatenmanagement-Plattform von LinkedIn
- [Great Expectations](https://greatexpectations.io/) - Python-Datenqualitäts-Framework
- [dbt](https://www.getdbt.com/) - Datentransformationstool mit integrierten Tests und Dokumentation
- [Apache Atlas](https://atlas.apache.org/) - Metadaten-Governance-Framework für das Hadoop-Ökosystem
- [The Data Warehouse Toolkit](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/) - Kimballs Klassiker zur DWH-Modellierung
