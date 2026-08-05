# Security-Denken: Sicherheitsprinzipien

::: tip Vorwort
**Ist Ihre Website sicher?** Viele Entwickler denken, „Sicherheit ist Sache des Sicherheitsteams", bis das eigene Projekt angegriffen wird und Benutzerdaten geleakt sind. Sicherheit ist keine Option, sondern eine Grundkompetenz jedes Entwicklers.

Dieses Kapitel hilft Ihnen, ein Sicherheitsdenken aufzubauen und die häufigsten Web-Sicherheitsbedrohungen und Abwehrmethoden zu verstehen.
:::

**Was werden Sie in diesem Artikel lernen?**

| Kapitel | Inhalt | Kernkonzept |
|-----|------|---------|
| **Kapitel 1** | Sicherheitsdenkmodell | Wie ein Angreifer denken |
| **Kapitel 2** | Häufige Web-Angriffe | XSS, SQL-Injection, CSRF |
| **Kapitel 3** | Verteidigungsstrategien | Eingabevalidierung, Ausgabe-Kodierung, Zugriffskontrolle |
| **Kapitel 4** | Sicherheits-Checkliste | Sicherheits-Selbstprüfung vor dem Go-Live |

Nach diesem Kapitel werden Sie ein grundlegendes Sicherheitsbewusstsein besitzen und die häufigsten Web-Sicherheitsbedrohungen erkennen und abwehren können.

---

## 0. Überblick: Motivation von müssen Entwickler Sicherheit verstehen

Stellen Sie sich vor, Sie haben ein Haus gebaut — voll funktionsfähig und schön eingerichtet, aber Sie haben vergessen, Schlösser einzubauen. Sicherheitslücken sind die „vergessenen Schlösser" in der Code-Welt.

::: tip Kernprinzipien der Sicherheit
- **Minimalberechtigung**: Nur notwendige Berechtigungen erteilen, nicht mehr
- **Tiefenverteidigung**: Sich nicht auf eine einzige Verteidigungslinie verlassen, sondern mehrschichtig absichern
- **Eingaben niemals vertrauen**: Alle externen Daten können bösartig sein
- **Sichere Voreinstellungen**: Die Standardkonfiguration sollte sicher sein, nicht bequem
:::

---

## 1. Häufige Web-Angriffe

Verstehen Sie mit der folgenden interaktiven Komponente die Prinzipien der drei häufigsten Web-Angriffe (nur zu Bildungszwecken):

<WebSecurityDemo />

### 1.1 XSS (Cross-Site Scripting)

Ein Angreifer injiziert bösartige Skripte in eine Webseite. Wenn andere Benutzer die Seite besuchen, wird das Skript in ihrem Browser ausgeführt.

```javascript
// Gefährlich: Benutzereingabe direkt in HTML einfügen
element.innerHTML = userInput
// Wenn userInput <script>böserCode</script> ist, wird es ausgeführt

// Sicher: textContent verwenden oder escapen
element.textContent = userInput
// Oder das automatische Escaping des Frameworks nutzen (Vues {{ }}, Reacts JSX)
```

**Verteidigungsmaßnahmen**:
- Bei der Ausgabe HTML-Sonderzeichen escapen (`<`, `>`, `&`, `"`, `'`)
- Den automatischen Escaping-Mechanismus moderner Frameworks nutzen
- Den `Content-Security-Policy` HTTP-Header setzen

### 1.2 SQL-Injection

Ein Angreifer manipuliert die Logik einer SQL-Abfrage durch speziell gestaltete Eingaben.

```javascript
// Gefährlich: SQL durch String-Verkettung
const query = `SELECT * FROM users WHERE name = '${userInput}'`
// Wenn userInput ' OR '1'='1 ist, werden alle Benutzer zurückgegeben

// Sicher: Parametrisierte Abfragen verwenden
const query = 'SELECT * FROM users WHERE name = ?'
db.execute(query, [userInput])
```

**Verteidigungsmaßnahmen**:
- Immer parametrisierte Abfragen / Prepared Statements verwenden
- ORM-Frameworks nutzen (z. B. Prisma, Sequelize)
- Datenbankkonto-Berechtigungen einschränken

### 1.3 CSRF (Cross-Site Request Forgery)

Ein Angreifer leitet einen angemeldeten Benutzer auf eine bösartige Seite um und nutzt dessen Anmeldestatus, um Anfragen zu senden.

**Verteidigungsmaßnahmen**:
- CSRF-Token verwenden
- `Referer` / `Origin`-Header prüfen
- Kritische Aktionen mit POST statt GET durchführen
- Cookie `SameSite`-Attribut setzen

---

## 2. Verteidigungsstrategien

### 2.1 Eingabevalidierung

```javascript
// Whitelist-Validierung: Nur erwartete Formate zulassen
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Längenbegrenzung
function isValidUsername(name) {
  return name.length >= 2 && name.length <= 50
}
```

### 2.2 Schutz sensibler Daten

| Datentyp | Schutzmaßnahme |
|---------|---------|
| Passwörter | bcrypt/argon2-Hashing, niemals im Klartext speichern |
| API-Schlüssel | Umgebungsvariablen, nicht ins Code-Repository committen |
| Benutzerdaten | HTTPS-Übertragung, verschlüsselte Speicherung |
| Sitzungs-Token | HttpOnly + Secure + SameSite Cookie |

### 2.3 HTTP-Sicherheitsheader

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
```

---

## 3. Sicherheits-Checkliste

Überprüfen Sie mit der folgenden interaktiven Komponente den Sicherheitsstatus Ihres Projekts:

<SecurityChecklistDemo />

### 3.1 Entwicklungsphase

- [ ] Alle Benutzereingaben sind validiert und escaped
- [ ] Parametrisierte Abfragen werden verwendet, kein SQL-String-Concat
- [ ] Passwörter werden mit bcrypt o. Ä. gehasht gespeichert
- [ ] Sensible Konfigurationen werden über Umgebungsvariablen verwaltet
- [ ] `.env`-Datei wurde zu `.gitignore` hinzugefügt

### 3.2 Bereitstellungsphase

- [ ] HTTPS aktiviert
- [ ] Sicherheits-HTTP-Header konfiguriert
- [ ] Debug-Modus und detaillierte Fehlermeldungen deaktiviert
- [ ] Datenbank verwendet Konto mit minimalen Berechtigungen
- [ ] Abhängigkeiten regelmäßig aktualisieren (`npm audit`)

---

## 4. AI-Unterstützung: Sicherheit mit großen Sprachmodellen verbessern

Große Sprachmodelle können als Ihr „Sicherheitsberater" fungieren und Ihnen bei der Code-Audit und der Erstellung von Sicherheitslösungen helfen.

### 4.1 Code-Sicherheitsaudit

> **Prompt**:
> ```
> Führen Sie ein Sicherheitsaudit für den folgenden Code durch und prüfen Sie auf:
> - XSS-Schwachstellen (nicht escapte Benutzereingaben)
> - SQL-Injection (String-verknüpfte Abfragen)
> - CSRF-Risiken (fehlende Token-Validierung)
> - Sensible Datenlecks (hartkodierte Schlüssel, Klartextpasswörter)
> Geben Sie für jedes Problem die Risikostufe, die genaue Stelle und eine Lösung an.
>
> [Fügen Sie Ihren Code ein]
> ```

### 4.2 Sicherheitskonfiguration generieren

> **Prompt**:
> ```
> Mein Projekt verwendet Express.js + PostgreSQL und wird bald bereitgestellt.
> Bitte generieren Sie eine vollständige Sicherheits-Konfigurationscheckliste mit:
> - HTTP-Sicherheitsheader-Konfigurationscode
> - CORS-Konfiguration
> - Sichere Datenbankverbindungseinstellungen
> - Umgebungsvariablen-Management-Lösung
> Bitte direkt verwendbare Code-Snippets angeben.
> ```

### 4.3 Schwachstellenprinzipien erklären

> **Prompt**:
> ```
> Erklären Sie mit einem konkreten Beispiel den vollständigen Ablauf eines CSRF-Angriffs:
> 1. Wie der Angreifer eine bösartige Seite konstruiert
> 2. Warum der Browser automatisch Cookies mitsendet
> 3. Wie der Server mit CSRF-Token verteidigt
> Demonstrieren Sie den gesamten Angriffs- und Verteidigungsprozess mit Code.
> ```

::: tip AI-Verwendungshinweis
KI-Sicherheitsaudits können professionelle Sicherheitstests nicht ersetzen. Nutzen Sie sie als erste Prüfung — kritische Systeme benötigen weiterhin Audits durch professionelle Sicherheitsteams.
:::

---

## 5. Zusammenfassung

1. **Sicherheitsdenken**: Eingaben niemals vertrauen, Minimalberechtigung, Tiefenverteidigung
2. **Häufige Angriffe**: XSS, SQL-Injection, CSRF sind die häufigsten Web-Sicherheitsbedrohungen
3. **Verteidigungsstrategien**: Eingabevalidierung, Ausgabe-Kodierung, parametrisierte Abfragen, Sicherheits-HTTP-Header
4. **Sicherheitsgewohnheiten**: Vor dem Go-Live die Sicherheits-Checkliste durchgehen, Abhängigkeiten regelmäßig auditen

::: tip Schlussgedanke
Sicherheit ist keine einmalige Arbeit, sondern eine Gewohnheit, die den gesamten Entwicklungsprozess durchzieht. Wie das Anlegen des Sicherheitsgurts beim Autofahren — nicht, weil Sie einen Unfall erwarten, sondern weil es ein grundlegendes Sicherheitsbewusstsein ist. **Fragen Sie sich bei jeder Codezeile: Was passiert, wenn diese Eingabe bösartig ist?**
:::

---

## Weiterführende Literatur

- **OWASP Top 10**: Die Liste der zehn größten Webanwendungs-Sicherheitsrisiken, die jeder Entwickler kennen sollte.
- **Praktische Tools**: Nutzen Sie `npm audit` zur Prüfung von Abhängigkeitslücken und ESLint-Sicherheits-Plugins zur Codeprüfung.
- **Vertiefung**: Verstehen Sie die Prinzipien von HTTPS, JWT-Sicherheitspraktiken und OAuth 2.0-Sicherheitsaspekte.
- **Sicherheits-Community**: Verfolgen Sie Sicherheitsankündigungen und beheben Sie bekannte Schwachstellen zeitnah.
