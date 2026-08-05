# SSH-Authentifizierung: Sichere Kommunikation

> 💡 **Lernleitfaden**: Du musst bei jedem `git push` ein Passwort eingeben? Server-Verbindungen scheitern ständig mit „Permission denied"? Dieses Kapitel erklärt dir in 5 Minuten das Prinzip der SSH-Schlüsselauthentifizierung und wie du dich ohne Passwort bei GitHub und Servern anmelden kannst.

---

## 0. Diese Szenarien hast du sicher schon erlebt

- Bei `git push` erscheint immer wieder die Passwortabfrage – lästig und zeitaufwendig
- Die SSH-Verbindung zum Server schlägt fehl und du weißt nicht, was `id_rsa` oder `id_ed25519` bedeuten
- Du hast von „Public Key" und „Private Key" gehört, weißt aber nicht, welchen du weitergibst und welchen du behältst

**Das Kernproblem**: Passwörter sind unsicher und umständlich. SSH-Schlüssel lösen beide Probleme gleichzeitig – Sicherheit und Komfort.

---

## 1. Passwort vs. Schlüssel: Vorteile der Schlüsselauthentifizierung

👇 Probiere es aus: Vergleiche den Passwort-Login mit dem Schlüssel-Login

<SSHAuthDemo />

::: tip 💡 In einem Satz
Passwort-Login = Jedes Mal das Passwort zur Prüfung übertragen (Passwort kann abgefangen werden);
Schlüssel-Login = Beweisen, dass man den Schlüssel besitzt, ohne ihn zu zeigen (der private Schlüssel wird niemals übertragen).
:::

---

## 2. Asymmetrische Verschlüsselung: Public Key und Private Key

SSH-Schlüssel basieren auf **asymmetrischer Verschlüsselung** und erzeugen zwei Schlüssel:

| | Private Key | Public Key |
|---|---|---|
| **Speicherort** | Dein Rechner `~/.ssh/id_ed25519` | Server/GitHub |
| **Darf man weitergeben?** | ❌ Niemals | ✅ Immer |
| **Funktion** | Signieren (Identität beweisen) | Verifizieren (Identität prüfen) |
| **Analog** | Schlüssel | Schloss |

### Gängige Schlüsseltypen

| Typ | Befehl | Empfehlung | Beschreibung |
|---|---|---|---|
| **Ed25519** | `ssh-keygen -t ed25519` | ⭐⭐⭐ | Neueste, schnellste und sicherste Methode |
| **RSA** | `ssh-keygen -t rsa -b 4096` | ⭐⭐ | Gute Kompatibilität, aber langsamer |
| **ECDSA** | `ssh-keygen -t ecdsa` | ⭐ | Generell nicht empfohlen |

---

## 3. Praxis: SSH-Schlüssel erstellen und konfigurieren

### 3.1 Schlüsselpaar generieren

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

Nach der Ausführung wirst du gefragt:
- **Dateipfad**: Einfach Enter drücken, um den Standardpfad `~/.ssh/id_ed25519` zu verwenden
- **Passphrase**: Kann einen zusätzlichen Schutz festlegen (kann auch leer gelassen werden)

### 3.2 Public Key zu GitHub hinzufügen

```bash
# 1. Inhalt des Public Keys kopieren
cat ~/.ssh/id_ed25519.pub | pbcopy  # macOS
cat ~/.ssh/id_ed25519.pub | xclip   # Linux

# 2. GitHub öffnen → Settings → SSH and GPG keys → New SSH key
# 3. Public Key einfügen, speichern

# 4. Verbindung testen
ssh -T git@github.com
# Bei Erfolg: Hi username! You've been authenticated...
```

### 3.3 Public Key zum Server hinzufügen

```bash
# Methode 1: ssh-copy-id (empfohlen)
ssh-copy-id user@your-server

# Methode 2: Manuell kopieren
cat ~/.ssh/id_ed25519.pub | ssh user@server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

## 4. SSH Config: Schluss mit langen Befehlen

Konfiguriere Aliase in `~/.ssh/config` – einmal einrichten, dauerhaft profitieren:

```
Host dev
  HostName 192.168.1.100
  User deploy
  IdentityFile ~/.ssh/id_ed25519

Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
```

Das Ergebnis nach der Konfiguration:

| Vorher | Nachher |
|---|---|
| `ssh -i ~/.ssh/id_ed25519 deploy@192.168.1.100` | `ssh dev` |
| Jedes Mal IP und Benutzernamen merken | Ein Alias reicht |

---

## 5. Häufige Probleme und ihre Lösungen

| Problem | Ursache | Lösung |
|---|---|---|
| `Permission denied (publickey)` | Public Key nicht zum Server hinzugefügt | `ssh-copy-id user@server` |
| `WARNING: UNPROTECTED PRIVATE KEY FILE` | Berechtigungen der Private-Key-Datei zu weit | `chmod 600 ~/.ssh/id_ed25519` |
| `Could not resolve hostname` | SSH Config fehlerhaft | `~/.ssh/config` Format überprüfen |
| GitHub fragt immer noch nach Passwort | HTTPS statt SSH verwendet | Wechsel zu `git@github.com:user/repo.git` |

---

## 6. Zusammenfassung

::: tip 📚 Kernpunkte
1. **Schlüssel > Passwort**: Der private Schlüssel wird niemals übertragen – deutlich sicherer als Passwörter
2. **Ed25519 empfohlen**: Der modernste Schlüsselalgorithmus – schnell und hochsicher
3. **Public Key beliebig weitergeben, Private Key niemals preisgeben**: Das ist die eiserne Regel
4. **SSH Config**: Einmal Aliase einrichten, danach per `ssh alias` in einer Zeile verbinden
5. **GitHub/GitLab**: Nach dem Hinzufügen des Public Keys erfordern `git push/pull` nie wieder ein Passwort
:::

**Nächste Lernschritte**:
- [Ports und Localhost: Netzwerkgrundlagen](./ports-localhost) - Die Grundlagen der Netzwerkverbindung verstehen
- [Umgebung und Pfad: Systemkonfiguration](./environment-path) - Systemkonfiguration verstehen