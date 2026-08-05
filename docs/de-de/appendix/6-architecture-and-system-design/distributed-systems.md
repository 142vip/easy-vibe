# Verteilte Systeme: Kernprinzipien

::: tip Einleitung
**Wenn eine Maschine nicht mehr ausreicht, fangen die Probleme erst richtig an.** Verteilte Systeme sind das Fundament des modernen Internets — von WeChat-Nachrichten bis hin zu Taobao-Bestellungen, im Hintergrund arbeiten Hunderte von Maschinen zusammen. Aber „verteilt" ist kein kostenloses Mittagessen. Es bringt eine Reihe von Herausforderungen mit sich, die in Einzelplatzsystemen nie auftreten.
:::

**Was werden Sie in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels werden Sie Folgendes beherrschen:

- **Kerntheorem**: Das CAP-Theorem und seine Auswirkungen auf das Systemdesign verstehen
- **Konsistenzmodelle**: Starke Konsistenz, EVENTUELLE Konsistenz und kausale Konsistenz unterscheiden
- **Acht Herausforderungen**: Die zentralen Probleme verteilter Systeme beherrschen
- **Konsensalgorithmen**: Die Grundideen von Paxos, Raft und weiteren Konsensprotokollen kennenlernen
- **Praktische Muster**: Vertrautheit mit 2PC, Saga, CRDT und anderen gängigen Lösungsmustern

| Kapitel | Inhalt | Kernkonzepte |
|---------|--------|--------------|
| **Kapitel 1** | Warum verteilte Systeme? | Skalierbarkeit, Verfügbarkeit, geografische Verteilung |
| **Kapitel 2** | CAP-Theorem | Konsistenz, Verfügbarkeit, Partitionstoleranz |
| **Kapitel 3** | Konsistenzmodelle | Stark konsistent, eventual konsistent, kausal konsistent |
| **Kapitel 4** | Acht Herausforderungen | Netzwerk, Uhren, Partitionen, Split-Brain usw. |
| **Kapitel 5** | Konsensalgorithmen | Paxos, Raft, ZAB |
| **Kapitel 6** | Verteilte Transaktionen | 2PC, Saga, TCC |

---

## 0. Übersicht: Motivation von verteilte Systeme

Einzelplatzsysteme sind einfach und zuverlässig, haben jedoch drei unüberwindbare Engpässe:

| Engpass | Beschreibung | Lösung durch verteilte Systeme |
|---------|-------------|-------------------------------|
| Leistungsgrenze | Einzelne Maschine hat physikalische Grenzen bei CPU, Speicher und Festplatte | Horizontale Skalierung: Mehrere Maschinen teilen sich die Last |
| Single Point of Failure | Fällt eine Maschine aus, fällt der gesamte Dienst aus | Redundante Replika: Mehrere Maschinen als Backup |
| Geografische Latenz | Nutzer sind weltweit verteilt, eine Maschine kann nur an einem Standort stehen | Mehrstandortbereitstellung: Nutzer werden lokal bedient |

::: tip Der Preis verteilter Systeme
Verteilte Systeme lösen die oben genannten Probleme, führen jedoch neue Komplexität ein: unzuverlässiges Netzwerk, nicht synchronisierte Uhren, Teilausfälle, Datenkonsistenz ... Genau diese „Herausforderungen" werden in diesem Artikel behandelt.

**Peter Deutschs acht Irrtümer der verteilten Berechnung** zeigen uns, dass folgende Annahmen in verteilten Umgebungen alle falsch sind:
1. Das Netzwerk ist zuverlässig
2. Die Latenz ist null
3. Die Bandbreite ist unendlich
4. Das Netzwerk ist sicher
5. Die Topologie ändert sich nicht
6. Es gibt nur einen Administrator
7. Die Übertragungskosten sind null
8. Das Netzwerk ist homogen
:::

---

## 1. CAP-Theorem: Das „Unmögliche-Dreieck" verteilter Systeme

Im Jahr 2000 stellte Eric Brewer die CAP-Vermutung auf (später als Theorem bewiesen): Ein verteiltes System kann höchstens zwei der folgenden drei Eigenschaften gleichzeitig erfüllen.

| Eigenschaft | Bedeutung | Alltagserklärung |
|-------------|-----------|------------------|
| **C**onsistency (Konsistenz) | Alle Knoten sehen zu jedem Zeitpunkt dieselben Daten | An jedem Geldautomaten sehen Sie denselben Kontostand |
| **A**vailability (Verfügbarkeit) | Jede Anfrage erhält eine fehlerfreie Antwort | Das System kann Ihnen immer antworten, nie „Dienst nicht verfügbar" |
| **P**artition tolerance (Partitionstoleranz) | Das System funktioniert auch bei Netzwerkpartition weiter | Selbst wenn einige Kabel durchtrennt sind, funktioniert das System noch |

<CAPTheoremDemo />

### Motivation: zwei

In einer verteilten Umgebung sind Netzwerkpartitionen (P) unvermeidbar — Glasfaserkabel werden durchtrennt, Switches fallen aus, Rechenzentren verlieren die Netzverbindung. Daher ist P ein Muss, die eigentliche Entscheidung liegt zwischen C und A:

- **CP wählen**: Bei Partitionierung unsichere Anfragen ablehnen, Datenkorrektheit gewährleisten → geeignet für Finanzen, Bestandsverwaltung
- **AP wählen**: Bei Partitionierung weiterarbeiten, aber Daten können vorübergehend inkonsistent sein → geeignet für Soziales, Inhalte

::: tip CAP ist nicht schwarz-weiß
Reale Systeme sind nicht einfach „CP oder AP". Viele Systeme treffen bei verschiedenen Operationen unterschiedliche Entscheidungen — beispielsweise kann dieselbe Datenbank Leseoperationen als AP gestalten (veraltete Daten zulassen) und Schreiboperationen als CP (Mehrheitsbestätigung verlangen).
:::

---

## 2. Konsistenzmodelle: Der „Strengheitsgrad" der Datensynchronisation

Konsistenz ist kein Schalter (vorhanden oder nicht), sondern ein Spektrum. Verschiedene Konsistenzmodelle treffen unterschiedliche Kompromisse zwischen „Korrektheit" und „Leistung".

<ConsistencyModelsDemo />

### Vergleich der Konsistenzmodelle

| Modell | Garantie | Latenz | Anwendungsbereich |
|--------|-----------|--------|-------------------|
| Starke Konsistenz | Gelesener Wert ist immer der zuletzt geschriebene | Hoch (Warten auf Synchronisation) | Banküberweisungen, Bestandsabzug |
| Eventuelle Konsistenz | Alle Replika werden schließlich konsistent, aber zwischendurch können veraltete Werte gelesen werden | Niedrig (Schreibvorgang kehrt sofort zurück) | Soziale Aktivitäten, DNS |
| Kausale Konsistenz | Kausal zusammenhängende Operationen sind in ihrer Reihenfolge garantiert | Mittel | Kommentarantworten, kollaboratives Bearbeiten |
| Lineare Konsistenz | Alle Operationen wirken so, als würden sie auf einer einzelnen Maschine in Reihenfolge ausgeführt | Höchste | Verteilte Sperren, Leader-Wahl |
| Sitzungskonsistenz | Innerhalb derselben Sitzung wird garantiert die eigenen Schreibvorgänge zu lesen | Niedrig-Mittel | Persönliche Nutzerdaten |

::: tip „Read Your Own Writes"-Konsistenz
Die häufigste praktische Anforderung ist: Nachdem ein Nutzer seine eigenen Daten geändert hat, kann er die Aktualisierung sofort sehen (andere Nutzer können sie etwas später sehen). Dies wird als „Read Your Own Writes"-Konsistenz bezeichnet und ist eine praktische Erweiterung der eventualen Konsistenz.
:::

---

## 3. Acht Herausforderungen: Das „Minenfeld" verteilter Systeme

Die Komplexität verteilter Systeme entsteht nicht durch ein einzelnes Problem, sondern durch das Zusammenspiel mehrerer Probleme. Im Folgenden die acht wichtigsten Herausforderungen.

<DistributedChallengesDemo />

### Zusammenhänge zwischen den Herausforderungen

Diese acht Herausforderungen sind nicht isoliert, sie hängen zusammen:

- **Unzuverlässiges Netzwerk** → führt zu **Netzwerkpartitionen** → löst **CAP-Kompromisse** aus
- **Nicht synchronisierte Uhren** → führt zu **Schwierigkeiten bei der Ereignissortierung** → beeinflusst **Datenkonsistenz**
- **Teilausfälle** → können zu **Split-Brain** führen → erfordern **Konsensalgorithmen** zur Lösung
- **Datenkonsistenz** → erfordert **verteilt Transaktionen** → diese werden jedoch von **unzuverlässigem Netzwerk** beeinflusst

::: tip Es gibt keine Silberkugel
Verteilte Systeme haben keine „perfekte" Lösung, nur „geeignete" Kompromisse. Die Natur dieser Herausforderungen zu verstehen, ist entscheidend, um beim Systemdesign die richtigen Abwägungen zu treffen.
:::

---

## 4. Konsensalgorithmen: Ansatz für mehrere Maschinen sich „einig" werden

Konsensalgorithmen sind der Kern verteilter Systeme — sie lösen das Problem: Wie kommen mehrere Knoten über einen Wert überein, selbst wenn einige Knoten ausfallen oder Netzwerkverzögerungen auftreten?

### 4.1 Paxos

Von Leslie Lamport 1990 vorgeschlagen, ist es der erste mathematisch bewiesene Konsensalgorithmus.

| Rolle | Verantwortung |
|-------|---------------|
| Proposer | Stellt einen Vorschlag (Wert) vor |
| Acceptor | Stimmt über die Annahme oder Ablehnung des Vorschlags ab |
| Learner | Lernt den endgültig gewählten Wert |

**Zweiphasenablauf**:
1. **Prepare-Phase**: Der Proposer sendet eine Vorschlagsnummer, der Acceptor verspricht, keine Vorschläge mit kleinerer Nummer mehr zu akzeptieren
2. **Accept-Phase**: Der Proposer sendet den konkreten Wert, bei Annahme durch die Mehrheit der Acceptoren wird der Vorschlag angenommen

::: tip Das Problem mit Paxos
Paxos ist zwar korrekt, aber berüchtigt dafür, schwer verständlich und zu implementieren zu sein. Lamports eigener Aufsatz verwendete eine griechische Parlamentsanalogie, die noch mehr Menschen verwirrt hat.
:::

### 4.2 Raft: Für Verständlichkeit geschaffen

2014 stellte Diego Ongaro Raft vor, mit dem Ziel, ein „leicht verständliches Paxos" zu schaffen. Es zerlegt das Konsensproblem in drei Teilprobleme:

| Teilproblem | Beschreibung |
|-------------|-------------|
| Leader-Wahl | Ein Leader wird im Cluster gewählt, alle Schreibvorgänge laufen über den Leader |
| Log-Replikation | Der Leader repliziert das Operationsprotokoll auf alle Follower |
| Sicherheit | Garantiert, dass commitierte Protokolleinträge nicht überschrieben werden |

**Der Kernablauf von Raft**:
1. Beim Clusterstart sind alle Knoten Follower
2. Wenn ein Follower länger keinen Leader-Herzschlag erhält, wird er zum Candidate und initiiert eine Wahl
3. Der Candidate, der die Mehrheit der Stimmen erhält, wird der neue Leader
4. Der Leader nimmt Client-Anfragen an und commitiert den Log, nachdem er auf die Mehrheit der Knoten repliziert wurde

### 4.3 Vergleich der Konsensalgorithmen

| Algorithmus | Vorgeschlagen | Verständlichkeit | Verwendete Systeme |
|-------------|--------------|-----------------|-------------------|
| Paxos | 1990 | Schwer | Google Chubby |
| Raft | 2014 | Leicht | etcd, Consul, TiKV |
| ZAB | 2011 | Mittel | ZooKeeper |
| EPaxos | 2013 | Schwer | Vorwiegend akademische Forschung |

---

## 5. Verteilte Transaktionen: Knotenübergreifendes „Alles oder Nichts"

Transaktionen in Einzelplatzdatenbanken lassen sich mit lokalen Sperren und Logs als ACID umsetzen. Wenn jedoch ein Geschäftsvorgang mehrere Services/Datenbanken umfasst, wie wird dann die Atomarität gewährleistet?

### 5.1 Zweiphasencommit (2PC)

Das klassischste Protokoll für verteilte Transaktionen, in zwei Phasen unterteilt:

| Phase | Aktion des Koordinators | Aktion der Teilnehmer |
|-------|------------------------|----------------------|
| Prepare | Fragt alle Teilnehmer „Kann committet werden?" | Führt Operation aus, aber ohne Commit, antwortet mit Ja/Nein |
| Commit | Wenn alle Ja, sendet Commit | Offizielles Commit; bei einem Nein, alle Rollback |

**Probleme von 2PC**:
- **Blockierung**: Wenn der Koordinator nach Prepare ausfällt, warten die Teilnehmer unbegrenzt
- **Single Point of Failure**: Der Koordinator ist ein Single Point, fällt er aus, bleibt die Transaktion stecken
- **Schlechte Leistung**: Mehrere Netzwerkroundtrips erforderlich, lange Sperrhaltung

### 5.2 Saga-Muster

Saga zerlegt eine große Transaktion in mehrere lokale Transaktionen, von denen jede einen entsprechenden Kompensationsvorgang hat. Wenn ein Schritt fehlschlägt, werden die Kompensationen in umgekehrter Reihenfolge ausgeführt.

**Saga-Beispiel für eine E-Commerce-Bestellung**:

| Schritt | Vorwärtsoperation | Kompensationsoperation |
|---------|-------------------|----------------------|
| T1 | Bestellung erstellen (ausstehend) | Bestellung stornieren |
| T2 | Bestand abziehen | Bestand wiederherstellen |
| T3 | Guthaben abziehen | Guthaben zurückerstatten |
| T4 | Bestellung bestätigen (bezahlt) | — |

Wenn T3 (Guthaben abziehen) fehlschlägt: C2 ausführen (Bestand wiederherstellen) → C1 (Bestellung stornieren).

**Zwei Orchestrierungsansätze**:
- **Choreography**: Jeder Service lauscht auf Ereignisse und entscheidet selbst über den nächsten Schritt. Einfach, aber der globale Zustand ist schwer nachzuverfolgen
- **Orchestration**: Ein zentraler Koordinator steuert den Ablauf. Klar, aber der Koordinator ist ein Single Point

### 5.3 TCC (Try-Confirm-Cancel)

TCC ist eine Implementierung von 2PC auf Geschäftsebene, die jede Operation in drei Phasen unterteilt:

| Phase | Beschreibung | Beispiel (Bestand abziehen) |
|-------|-------------|---------------------------|
| Try | Ressourcen reservieren, aber nicht wirklich ausführen | 10 Einheiten einfrieren (verfügbarer Bestand -10, eingefrorener Bestand +10) |
| Confirm | Ausführung bestätigen, reservierte Ressourcen verbrauchen | Eingefrorener Bestand -10 (tatsächlicher Abzug) |
| Cancel | Reservierung stornieren, Ressourcen freigeben | Eingefrorener Bestand -10, verfügbarer Bestand +10 (Wiederherstellung) |

### 5.4 Vergleich der drei Ansätze

| Ansatz | Konsistenz | Leistung | Komplexität | Anwendungsbereich |
|--------|-----------|----------|-------------|-------------------|
| 2PC | Stark konsistent | Niedrig | Mittel | Datenbankübergreifende Transaktionen auf Datenbankebene |
| Saga | Eventual konsistent | Hoch | Hoch | Langlaufende Geschäftsprozesse (Bestellungen, Logistik) |
| TCC | Eventual konsistent | Mittel | Am höchsten | Finanzszenarien mit hoher Zuverlässigkeit |

::: tip Empfehlungen für die Praxis
- Wenn eine Einzelplatzdatenbank-Transaktion ausreicht, keine verteilten Transaktionen verwenden
- Für die meisten Geschäftsszenarien reicht Saga + Nachrichtenwarteschlange
- TCC eignet sich für Finanzszenarien mit höchsten Konsistenzanforderungen, ist aber sehr aufwendig in der Entwicklung
- 2PC eignet sich für automatische Verarbeitung durch Datenbank-Middleware (z. B. ShardingSphere)
:::

---

## Zusammenfassung

Verteilte Systeme sind die Infrastruktur des modernen Internets, aber ihre Komplexität übersteigt die von Einzelplatzsystemen bei weitem. Diese Herausforderungen zu verstehen dient nicht dazu, sie zu „lösen" (viele sind fundamental), sondern um beim Systemdesign die richtigen Kompromisse zu treffen.

Rückblick auf die wichtigsten Punkte dieses Kapitels:

1. **CAP-Theorem**: Netzwerkpartitionen sind unvermeidbar, die eigentliche Entscheidung ist ein Kompromiss zwischen Konsistenz und Verfügbarkeit
2. **Konsistenzmodelle**: Von starker Konsistenz bis eventualer Konsistenz ist es ein Spektrum, die Wahl richtet sich nach den geschäftlichen Anforderungen
3. **Acht Herausforderungen**: Unzuverlässiges Netzwerk, nicht synchronisierte Uhren, Netzwerkpartitionen, Split-Brain usw. hängen zusammen
4. **Konsensalgorithmen**: Raft ist der derzeit praktischste Konsensalgorithmus, etcd/Consul basieren darauf
5. **Verteilte Transaktionen**: Saga eignet sich für die meisten Szenarien, TCC für Finanzszenarien, 2PC für die Datenbankebene

## Weiterführende Literatur

- [Designing Data-Intensive Applications](https://dataintensive.net/) - Martin Kleppmanns Klassiker zu verteilten Systemen
- [The Raft Consensus Algorithm](https://raft.github.io/) - Offizielle Raft-Visualisierungsdemonstration
- [CAP Twelve Years Later](https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/) - Brewers Neubetrachtung von CAP
- [Jepsen](https://jepsen.io/) - Korrektheitstest-Framework für verteilte Systeme
- [Patterns of Distributed Systems](https://martinfowler.com/articles/patterns-of-distributed-systems/) - Martin Fowlers Sammlung verteilter Systemmuster
