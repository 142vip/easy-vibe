<script setup>
import RelatedArticlesSection from '../../../../.vitepress/theme/components/RelatedArticlesSection.vue'
import { relatedArticlesMap } from '../../../../.vitepress/theme/data/relatedArticles'
</script>

# Webseite online bringen (Fortgeschritten): eigener VPS-Server

> 💡 **Was bedeutet "Webseite online bringen"?** Wird auch "Go-Live" oder "Deployment/Veröffentlichung" genannt. Eine Webseite, die du auf deinem eigenen Computer gebaut hast, kann nur von dir geöffnet werden. **Online zu bringen bedeutet, sie auf einem Server abzulegen, der 24/7 läuft, sodass jeder eine URL in seinen Browser eingeben und sie besuchen kann** — genau wie ein Word-Dokument, das nur du lesen kannst, für alle sichtbar wird, sobald du es in einem Blog veröffentlichst; der Unterschied ist, dass du diesmal eine komplette Webseite veröffentlichst.

Im vorherigen Kapitel haben wir den einfachsten Weg der Veröffentlichung kennengelernt — mit One-Click-PaaS-Plattformen wie Vercel oder Zeabur. Dieses Kapitel behandelt den flexibleren Do-it-yourself-Ansatz: **einen eigenen Cloud-Server kaufen, alles von Grund auf einrichten und deine Seite selbst veröffentlichen**. Du lernst, wie du einen Server auswählst, dich mit ihm verbindest, die Umgebung installierst, Nginx konfigurierst, eine Domain anbindest und HTTPS aktivierst. Sobald du das verstanden hast, kann dich keine Plattform mehr einschränken — betreibe, welche Dienste du willst.

---

# 0. Klug entscheiden: Entscheidungsbaum für Deployment-Plattformen

Bevor du eine Plattform wählst, beantworte drei Fragen:

1. **Muss dein Projekt 24/7 laufen?**
   - Nein (reagiert nur bei Besuch, z. B. Doku-Seiten, Blogs, statische Seiten) → **Statisches Hosting / PaaS**
   - Ja (Cron-Jobs, Crawler, Telegram-/Discord-Bots, WebSocket-Dienste) → **Immer aktive PaaS oder VPS**

2. **Brauchst du eine GPU?**
   - Nein (rufst nur OpenAI-/Anthropic-APIs auf) → Normale Plattformen reichen
   - Ja (Open-Source-Modelle ausführen, Bilder/Videos erzeugen) → **GPU-Cloud-Plattformen** (Modal, Replicate, Lambda Labs)

3. **Wo befinden sich deine Nutzer hauptsächlich?**
   - Global / USA-EU → Vercel / Railway / Fly.io / AWS
   - Festland-China → Chinesische Clouds (Alibaba Cloud / Tencent Cloud) oder Cloudflare (in China schnell)
   - Beides → CDN nutzen, China-ausgerichtete Inhalte in der chinesischen Cloud deployen, globale auf AWS mit GeoDNS

Je nach deinen Antworten ergibt sich folgender Entscheidungsbaum:

```
Welchen Projekttyp deployst du?
│
├─ Reines Frontend-Static-Site (Vite/React/Vue-Build-Output)
│   ├─ Komplett kostenlos → Cloudflare Pages (unbegrenzte Bandbreite) / GitHub Pages
│   ├─ Next.js-Projekt → Vercel (offizielle Plattform, beste DX)
│   └─ Hauptsächlich China-Nutzer → Cloudflare Pages oder heimisches OSS+CDN
│
├─ Backend-API, muss nicht dauerhaft laufen (anfragegesteuert)
│   ├─ Node.js/Python-API → Vercel Functions / Cloudflare Workers
│   └─ Full-Stack-Frameworks (Next.js/Nuxt/SvelteKit) → Vercel
│
├─ Braucht dauerhaft laufenden Prozess (Bot, Cron, WebSocket)
│   ├─ Keine Lust, Server zu verwalten → Railway / Render / Fly.io
│   ├─ Volle Kontrolle & Kosten sparen → VPS kaufen (DigitalOcean / Vultr / Hetzner / AWS EC2)
│   └─ China-ausgerichtete Projekte → Tencent Cloud Lighthouse / Alibaba Cloud ECS
│
├─ Muss KI-Modelle/GPU ausführen
│   ├─ Inferenz-API → Modal / Replicate / Hugging Face Inference
│   ├─ Training/Fine-Tuning → Modal / Lambda Labs
│   └─ GPU in China → AutoDL / Alibaba Cloud PAI
│
└─ Große Produktionsprojekte
    └─ AWS/GCP + Kubernetes (DevOps einstellen oder KI Terraform schreiben lassen)
```

---

# 1. Kostenlose/günstige Deployment-Plattformen im Detail (kein Server nötig)

Für die meisten persönlichen Projekte, Demos und Portfolios **brauchst du gar keinen Server zu kaufen**. In diesem Abschnitt stellen wir die beliebtesten kostenlosen bzw. günstigen Plattformen vor — wie du dich anmeldest, wie du sie benutzt und welche Fallstricke es gibt.

## 1.1 Vercel — erste Wahl für Next.js / Frontend

**Website:** https://vercel.com

**Am besten geeignet für:** Next.js-Projekte, React-/Vue-Frontends, Full-Stack-Apps mit Serverless Functions, KI-Chatbots (schnelle Antwortzeiten)

**So verwendest du es:**
1. Melde dich mit deinem GitHub-Konto an
2. Klicke auf "Add New..." → "Project"
3. Wähle dein GitHub-Repository aus
4. Vercel erkennt dein Framework automatisch (Next.js/Vite/React usw.), trage Umgebungsvariablen ein
5. Klicke auf "Deploy" — deine Seite ist in 1-2 Minuten unter `xxx.vercel.app` live

**Kostenlose Stufe (Hobby-Plan):**
- 100 GB Bandbreite/Monat
- 100 Stunden Build-Zeit/Monat
- Serverless-Function-Ausführungszeit **10 Sekunden** (die kritischste Einschränkung!)
- Automatisches HTTPS, globales CDN, PR-Preview-Links

**Bezahlt (Pro, 20 $/Monat):**
- Function-Timeout auf 60-300 s verlängert
- 1 TB Bandbreite
- Team-Kollaborationsfunktionen

**⚠️ Wichtige Einschränkungen, an die Anfänger stoßen:**
- **10-Sekunden-Function-Timeout** in der kostenlosen Stufe: KI-API-Aufrufe, die länger als 10 s dauern, werden abgebrochen. Die Pro-Stufe für 20 $/Monat verlängert auf 60 s, 300 s kosten extra
- **Keine dauerhaft laufenden Prozesse**: kein Cron, kein WebSocket-Long-Polling, keine permanent laufenden Bots
- **Cold Starts**: Funktionen, die eine Weile nicht genutzt wurden, brauchen beim ersten Aufruf länger
- **KI-Projektkosten**: Streaming-KI-Antworten verbrauchen Bandbreite; starker Traffic kann die Pro-Rechnung auf 200 $/Monat treiben

**Fazit:** Vercel bietet das reibungsloseste Erlebnis für das Deployment von Frontend-Seiten, Dokumentationen und schnellen Demos. Aber für dauerhaft laufende Agents oder langlaufende KI-Aufrufe — nimm nicht Vercel.

## 1.2 Cloudflare Pages — unbegrenzte Bandbreite, weltweit schnell

**Website:** https://pages.cloudflare.com

**Am besten geeignet für:** Statische Seiten, bandbreitenintensive Projekte, globales Publikum, Edge Functions

**Kostenlose Stufe:**
- **Unbegrenzte Bandbreite** (das größte Verkaufsargument!)
- 500 Builds/Monat
- Unbegrenzte Anfragen
- Cloudflare Workers: 100.000 Anfragen/Tag
- Über 300 Edge-Standorte weltweit, auch in China ordentliche Geschwindigkeit

**So verwendest du es:**
1. Erstelle ein kostenloses Cloudflare-Konto
2. Gehe zu Workers & Pages → Create → Pages → Connect to Git
3. Wähle dein Repository, lege den Build-Befehl fest (Vite: `npm run build`, Ausgabeverzeichnis: `dist`)
4. Klicke auf Save and Deploy

**Bonus: Workers AI:** Cloudflare bietet außerdem an, Open-Source-KI-Modelle (Llama 3, Mistral, Stable Diffusion) auf Edge-Knoten auszuführen, mit 10.000 Neuronen/Tag kostenlos. Großartig, um kleine Modelle zu betreiben, ohne auf OpenAI-APIs angewiesen zu sein.

**Fazit:** Beste Wahl für statische Seiten, besonders für Projekte mit globalem Publikum. Unbegrenzte Bandbreite ist ein Killer-Feature.

## 1.3 Railway — beste Erfahrung für Backend-Dienste (Always-On)

**Website:** https://railway.app

**Am besten geeignet für:** Dauerhaft laufende Backend-Dienste, Node.js-/Python-/Go-APIs, Discord-/Telegram-Bots, Full-Stack-Projekte mit Datenbanken

**So verwendest du es:**
1. Melde dich mit GitHub an
2. New Project → Deploy from GitHub repo (oder wähle eine Vorlage)
3. Railway erkennt deinen Projekttyp automatisch, installiert Abhängigkeiten, baut und startet
4. PostgreSQL/Redis/MySQL/MongoDB-Datenbanken mit einem Klick hinzufügen
5. Automatisch generierte Domain oder eigene Domain binden

**Preise:**
- Neue Nutzer erhalten **5 $ Testguthaben** (nicht dauerhaft kostenlos)
- Danach nutzungsbasierte Abrechnung, ab ca. 5 $/Monat (Mindestspezifikation Always-On-Dienst + Datenbank)
- Schläft nach 5 Minuten Inaktivität (während des kostenlosen Testzeitraums); nach Zahlung kein Schlafmodus

**Fazit:** Railway bietet die beste Erfahrung für das Deployment von Backend-APIs, Bots und Full-Stack-Apps mit Datenbanken — Auto-Deploy von GitHub, integrierte Datenbanken, Logs und Monitoring inklusive.

## 1.4 Fly.io — wirklich 24/7 kostenlose Container

**Website:** https://fly.io

**Am besten geeignet für:** Latenzarme, weltweit verteilte Dienste; wenn du einen **wirklich kostenlosen 24/7-Container** willst und eine kleine Lernkurve akzeptierst

**Kostenlose Stufe:**
- 3 Micro-Shared-VMs (micro-1x, 256 MB RAM)
- **Keine Laufzeitbegrenzung** (kein Schlafmodus wie bei Render)
- 160 GB ausgehender Traffic/Monat
- 3 GB persistente Volumes
- 30+ globale Rechenzentrumsregionen
- GPU-Support (A100/H100)

**So verwendest du es:**
1. Anmeldung erfordert Kreditkarte (keine Abbuchung, Identitätsprüfung)
2. Installiere die flyctl-CLI
3. Schreibe eine `fly.toml`-Konfiguration in dein Projekt (KI kann das generieren)
4. `fly launch` → baut automatisch ein Docker-Image, vergibt eine IP, deployed
5. `fly deploy` zum Aktualisieren, `fly logs` zum Ansehen der Logs

**Fazit:** Wenn du einen **wirklich 24/7 kostenlosen Container** für einen Bot/API/Cron-Job brauchst, ist Fly.io die beste kostenlose Option. Der Kompromiss: Du musst flyctl-Befehle und Docker-Grundlagen lernen.

## 1.5 Render — 750 Stunden kostenlos, schläft aber

**Website:** https://render.com

**Am besten geeignet für:** Lernphase, persönliche Projekte, Projekte, die Cold Starts nicht stören

**Kostenlose Stufe:**
- Web Service: 750 Stunden/Monat (eine Instanz läuft durchgehend)
- PostgreSQL: 90 Tage kostenlos (⚠️ Datenbank wird danach gelöscht!)
- Statische Seiten: komplett kostenlos, 100 GB Bandbreite

**⚠️ Hauptproblem:**
- **Schläft nach 15 Minuten Inaktivität**, der Cold Start dauert 10-30 Sekunden (schlechte UX)
- Die kostenlose Datenbank wird nach 90 Tagen gelöscht — denk an Backups!

**Fazit:** Gut für Entwicklungs-/Test-/Schulprojekte, aber setze keine produktiven Projekte mit echten Nutzern auf die kostenlose Stufe. Bezahlt ab 7 $/Monat, um den Schlafmodus zu deaktivieren.

## 1.6 Weitere erwähnenswerte Plattformen

| Plattform | Typ | Kostenlose Stufe | Highlights |
|-----------|-----|------------------|------------|
| **GitHub Pages** | Statisches Hosting | Unbegrenzt (100 GB Soft-Limit) | Am einfachsten: Push zu GitHub, dann ist es live |
| **Hugging Face Spaces** | KI-Apps | Kostenlose kleine CPU-Instanz | Speziell für KI-Demos (Gradio/Streamlit) |
| **Modal** | KI/Serverless GPU | 30 $/Monat Guthaben | Python-Functions-as-a-Service, GPU-Cold-Start <4 s |
| **Replicate** | KI-Modell-Hosting | Bezahlung pro Aufruf | Modelle ohne Infrastruktur-Management in APIs verwandeln |
| **Denoland Deploy** | Deno/Edge | 100k Anfragen/Tag kostenlos | Offizielle Deno-Plattform, nativ TypeScript |
| **Netlify** | Statisches Hosting | 100 GB Bandbreite/Monat | Reichhaltiges Plugin-Ökosystem |
| **Supabase** | BaaS | 500 MB Datenbank kostenlos | Open-Source-Firebase-Alternative, Postgres+Auth+Storage |
| **Neon** | Serverless Postgres | 500 MB kostenlos | Branchbare Datenbanken für Serverless |
| **Upstash** | Serverless Redis | 10k Befehle/Tag kostenlos | Anfragebasiertes Redis für Serverless |

---

# 2. Einen Cloud-VPS kaufen: AWS-Schritt-für-Schritt-Anleitung

Wenn du die volle Kontrolle über die Serverumgebung brauchst, eigene Dienste betreiben willst oder PaaS deine Anforderungen nicht abdeckt, ist es Zeit, einen eigenen Cloud-Server zu kaufen. Dieser Abschnitt führt dich durch AWS (die weltweit am häufigsten genutzte globale Cloud-Plattform) und stellt auch Alternativen wie DigitalOcean, Vultr und Hetzner vor.

## 2.1 AWS Free Tier — 12 Monate kostenlos

AWS bietet neuen Nutzern ein 12-monatiges Free Tier, das perfekt zum Lernen und für persönliche Projekte geeignet ist. Das ist enthalten:

| Dienst | Free-Tier-Kontingent |
|--------|----------------------|
| **EC2** | 750 Stunden/Monat t2.micro oder t3.micro (eine Instanz läuft 24/7) |
| **S3** | 5 GB Standardspeicher |
| **RDS** | 750 Stunden/Monat db.t2.micro/db.t3.micro + 20 GB Speicher |
| **Lambda** | 1 Million Anfragen/Monat + 3,2 Millionen Sekunden Rechenzeit |
| **CloudFront** | 50 GB ausgehender Traffic + 2 Millionen Anfragen/Monat |
| **CloudWatch** | 10 benutzerdefinierte Metriken + 1 GB Log-Aufnahme |
| **DynamoDB** | 25 GB Speicher + 2,5 Millionen Lese-/Schreib-Kapazitätseinheiten |

**⚠️ Wichtig:** Das Free Tier läuft 12 Monate nach der Anmeldung ab, danach werden die regulären Preise berechnet. Richte immer Abrechnungsalarme ein (Billing Dashboard → Budgets), um Überraschungen zu vermeiden. Zerstöre Ressourcen, die du nicht mehr nutzt!

### So erstellst du eine EC2-Instanz (AWS VPS):

1. **Registriere dich** unter https://aws.amazon.com/ mit E-Mail und Kreditkarte
2. Gehe zum **EC2 Dashboard** → **Launch Instances**
3. **Schritt 1: Amazon Machine Image (AMI) auswählen**
   - Wähle **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type** (64-Bit-x86) — das ist die anfängerfreundlichste Option
4. **Schritt 2: Instanztyp wählen**
   - Wähle **t2.micro** (Free-Tier-fähig, 1 vCPU, 1 GB RAM)
5. **Schritt 3: Instanzdetails konfigurieren**
   - Standardeinstellungen beibehalten (1 Instanz, Standard-VPC)
6. **Schritt 4: Speicher hinzufügen**
   - Das Standard-Root-Volume von 8 GB gp2 reicht für den Anfang
7. **Schritt 5: Tags hinzufügen** (optional, zur Organisation)
8. **Schritt 6: Security Group konfigurieren** (⚠️ ENTSCHEIDEND — das ist deine Firewall)
   - Erstelle eine neue Security Group
   - Füge Regeln hinzu:
     - Typ: **SSH**, Port: 22, Quelle: **Meine IP** (nur deine IP kann SSH nutzen)
     - Typ: **HTTP**, Port: 80, Quelle: **Überall (0.0.0.0/0)**
     - Typ: **HTTPS**, Port: 443, Quelle: **Überall**
9. **Schritt 7: Überprüfen und starten**
10. **Key Pair**: Erstelle beim Prompt ein neues Key-Pair (z. B. `my-aws-key.pem`), lade es herunter und bewahre es sicher auf. **Du kannst es nicht erneut herunterladen!**
11. Klicke auf **Launch Instances** → warte 2-5 Minuten, bis sie startet

### Verbinden mit deiner EC2-Instanz:

```bash
# Auf deinem lokalen Mac/Linux-Terminal
chmod 400 my-aws-key.pem  # Korrekte Berechtigungen setzen (erforderlich!)
ssh -i my-aws-key.pem ubuntu@YOUR_PUBLIC_IP
# z. B. ssh -i my-aws-key.pem ubuntu@54.123.45.67

# Unter Windows: PuTTY verwenden (.pem in .ppk umwandeln) oder Windows Terminal mit OpenSSH
```

**Öffentliche IP ermitteln:** Gehe zu EC2 Dashboard → Instances → Wähle deine Instanz → Suche nach "Public IPv4 address" in den Details.

## 2.2 DigitalOcean — hervorragende Dokumentation für Anfänger

**Website:** https://www.digitalocean.com

**Preise:** Droplets ab 4 $/Monat (512 MB RAM, 10 GB SSD, 500 GB Bandbreite)

**Warum DO wählen:** Ihre Dokumentation (sogenannte "Community Tutorials") ist legendär — fast jede Linux-/Server-Frage hat ein gut geschriebenes DO-Tutorial. Die Oberfläche ist übersichtlich und anfängerfreundlich.

**So verwendest du es:**
1. Registriere dich (Kreditkarte oder PayPal, mindestens 2 $ Einzahlung via PayPal)
2. Klicke auf "Create" → "Droplets"
3. Wähle Ubuntu 22.04, den Basic-Plan für 4 $/Monat, und ein Rechenzentrum nahe deiner Nutzer (NYC, SFO, London, Singapur usw.)
4. Füge deinen öffentlichen SSH-Schlüssel hinzu (empfohlen) oder setze ein Root-Passwort
5. Klicke auf "Create Droplet" — in ca. 1 Minute fertig
6. Verbinde dich via: `ssh root@YOUR_DROPLET_IP`

## 2.3 Vultr — stündliche Abrechnung, viele Standorte

**Website:** https://www.vultr.com

**Preise:** Reguläre Cloud Compute ab 5 $/Monat (1 vCPU, 1 GB RAM, 25 GB SSD, 1 TB Bandbreite)

**Warum Vultr wählen:** Stündliche Abrechnung (du kannst für 10 Minuten einen Server hochfahren, um etwas zu testen, und ihn dann zerstören — das kostet nur ein paar Cent), über 30 Standorte weltweit, und es gibt erschwingliche GPU-Instanzen, falls du sie später brauchst.

## 2.4 Hetzner — bestes Preis-Leistungs-Verhältnis für langfristige Projekte

**Website:** https://www.hetzner.com/cloud

**Preise:** CX11 ab 3,49 €/Monat (1 vCPU, 2 GB RAM, 20 GB SSD, 20 TB Traffic!)

**Warum Hetzner wählen:** Bestes Preis-Leistungs-Verhältnis in Europa, extrem stabiles Netzwerk. Großartig für langlaufende Produktionsprojekte. Der Kompromiss: Die Rechenzentren stehen in Deutschland/Finnland/USA (keine Standorte in Asien).

## 2.5 VPS-Anbieter im Schnellvergleich

| Anbieter | Einstiegspreis | Am besten geeignet für | Kostenlose Testphase |
|----------|---------------|------------------------|----------------------|
| **AWS EC2** | 12 Monate Free Tier, danach ca. 10 $/Monat | AWS lernen, Unternehmensintegration | 12 Monate Free Tier |
| **DigitalOcean** | 4 $/Monat | Anfänger, tolle Dokumentation | 200 $ Guthaben für 60 Tage (neue Nutzer) |
| **Vultr** | 5 $/Monat (2,50 $ nur IPv6) | Stündliches Testen, viele Regionen | 100 $ Guthaben für 30 Tage |
| **Hetzner** | 3,49 €/Monat | Bestes Preis-Leistungs-Verhältnis für langfristige Projekte | 20 € Guthaben |
| **Linode (Akamai)** | 5 $/Monat | Etabliert, zuverlässig | 100 $ Guthaben für 60 Tage |

---

# 3. Ersteinrichtung des Servers (Ubuntu 22.04)

Sobald du dich per SSH auf deinem Server angemeldet hast, ist das Erste, das System zu aktualisieren und grundlegende Tools zu installieren. Du kannst **die folgende Aufforderung einfach an deinen KI-Assistenten kopieren** und dir von ihm die exakten Befehle generieren lassen:

> "Ich habe gerade einen neuen Ubuntu-22.04-Server eingerichtet und möchte ein [Node.js/Python/...]-Projekt deployen. Gib mir die vollständigen Initialisierungsbefehle, einschließlich: System-Update, einen Nicht-Root-Sudo-Benutzer erstellen, SSH-Schlüssel-Authentifizierung konfigurieren, Node.js 20 installieren, Nginx installieren, Docker installieren, grundlegende ufw-Firewall konfigurieren."

Eine typische Ersteinrichtung:

```bash
# 1. System aktualisieren und grundlegende Tools installieren
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git vim ufw build-essential

# 2. Einen normalen Benutzer anlegen (nicht immer root verwenden!)
sudo adduser yourname
sudo usermod -aG sudo yourname

# 3. Node.js installieren (nvm verwenden, NICHT apt)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
node -v  # überprüfen

# 4. Nginx installieren
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
# Im Browser http://YOUR-IP aufrufen — du solltest die Nginx-Begrüßungsseite sehen

# 5. Docker installieren (falls Container genutzt werden)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker yourname  # Docker ohne sudo ausführen
# Ab- und wieder anmelden, damit die Änderung wirksam wird
docker --version

# 6. Firewall konfigurieren
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

## 3.1 Security Group / Firewall konfigurieren (SEHR WICHTIG!)

Bei AWS erfolgt das über die **Security Groups** (in der EC2-Konsole). Bei DigitalOcean/Vultr über die Firewall-Einstellungen im Dashboard. Unter Ubuntu brauchst du zusätzlich `ufw`.

**Öffne mindestens diese Ports:**

| Port | Zweck | Empfehlung |
|------|-------|------------|
| **22** | SSH | Erforderlich; wenn möglich auf deine IP beschränken |
| **80** | HTTP | Für das Web erforderlich |
| **443** | HTTPS | Für sicheres Web erforderlich |
| **3000-3999** | Node.js-Entwicklungsports | Temporär zum Debuggen öffnen, nach dem Deployment wieder schließen |

> ⚠️ **Anfängerfehler Nr. 1:** Die App läuft, aber du kannst nicht darauf zugreifen. In 90 % der Fälle liegt es daran, dass die Security Group/Firewall diesen Port nicht freigibt.

---

# 4. Drei typische Deployment-Szenarien

## 4.1 Szenario 1: Statisches Frontend deployen (Vite/React/Vue)

Nach `npm run build` erhältst du einen `dist/`-Ordner mit reinen HTML/CSS/JS-Dateien.

**Code auf den Server bringen:**

```bash
# Option A: rsync vom lokalen Rechner
rsync -avz --exclude=node_modules ./dist/ yourname@YOUR-IP:/var/www/myapp/

# Option B: git clone auf dem Server (empfohlen, einfachere Updates)
cd /var/www
sudo git clone https://github.com/YOUR_USER/YOUR_REPO.git myapp
cd myapp
npm install
npm run build
```

**Nginx konfigurieren:**

```bash
sudo vim /etc/nginx/sites-available/myapp
```

```nginx
server {
    listen 80;
    server_name YOUR-IP-OR-DOMAIN;

    root /var/www/myapp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # SPA-Routing-Fallback
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Seite aktivieren:

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 4.2 Szenario 2: Node.js-Backend deployen (Express/Fastify/NestJS)

Nutze **PM2**, um die App im Hintergrund laufen zu lassen:

```bash
npm install -g pm2
cd /path/to/your/app
npm install
npm run build  # falls TypeScript
pm2 start dist/main.js --name "myapp"
pm2 startup && pm2 save  # automatischer Start beim Booten
pm2 logs myapp  # Logs ansehen
```

**Nginx-Reverse-Proxy:**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 4.3 Szenario 3: Docker-Compose-Full-Stack-Deployment

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:pass@db:5432/myapp
    depends_on: [db, redis]
    restart: always

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./frontend/dist:/usr/share/nginx/html
    depends_on: [app]
    restart: always

volumes:
  postgres_data:
```

Start mit: `docker compose up -d`

---

# 5. Domain & HTTPS

## 5.1 Domain kaufen & DNS einrichten

Registriere eine Domain über Namecheap, Cloudflare Registrar, GoDaddy oder AWS Route 53. Füge in den DNS-Einstellungen deiner Domain **A-Records** hinzu:

| Typ | Host | Wert |
|-----|------|------|
| A | @ | Deine Server-IP |
| A | www | Deine Server-IP |
| A | api | Deine Server-IP (für das Backend) |

## 5.2 HTTPS mit einem Klick dank Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
# Option 2 (Redirect) wählen, um HTTP automatisch auf HTTPS umzuleiten
sudo certbot renew --dry-run  # automatische Verlängerung testen
```

---

# 6. Cloud-Anbieter-Dienste im Detail (über den VPS hinaus)

Wenn du dich in der AWS-Konsole (oder einem anderen Cloud-Dashboard) anmeldest, siehst du dutzende Dienste mit kryptischen Namen (EC2, S3, RDS, ELB, VPC …). Dieser Abschnitt erklärt die gängigsten und wann du sie einsetzt, **mit AWS als Hauptbeispiel** (die Konzepte übertragen sich direkt auf andere Clouds).

## 6.1 Überblick über die Cloud-Architektur

Eine typische Webanwendung in der Cloud sieht so aus:

```
Nutzer → CloudFront (CDN) → ALB (Load Balancer) → EC2 (dein App-Server)
                              │                     │
                              │                     ├── S3 (Bilder/Dateien)
                              │                     ├── RDS (Datenbank)
                              │                     └── ElastiCache (Redis)
                              │
                              └── ECS/EKS (Container, fortgeschritten)
                              
         └── Route 53 (DNS) → bildet deine Domain auf CloudFront/ALB ab
             + ACM (SSL-Zertifikate) → HTTPS-Verschlüsselung
```

Schauen wir uns die einzelnen Dienste an.

## 6.2 Compute: Wo dein Code läuft

### EC2 (Elastic Compute Cloud) — der VPS

Das ist der "Cloud-Server", den wir bisher verwendet haben. Es ist eine virtuelle Maschine, in die du per SSH einsteigen, alles installieren und beliebig konfigurieren kannst.

- **Alibaba Cloud:** ECS
- **Tencent Cloud:** CVM / Lighthouse
- **DigitalOcean:** Droplet
- **Hetzner:** Cloud Server

**Wann einsetzen:** Wenn du volle Kontrolle brauchst, eigene Software und dauerhaft laufende Prozesse.

### Lambda — Serverless Functions

Code-Schnipsel hochladen, ohne Server zu verwalten. Bezahlt wird pro Aufruf und Ausführungszeit. Läuft nur, wenn ausgelöst.

- **Alibaba Cloud:** Function Compute
- **Tencent Cloud:** SCF (Serverless Cloud Function)
- **GCP:** Cloud Functions

**Wann einsetzen:** Gelegentliche Aufgaben (Webhook-Handler, Bildverarbeitung, geplante Jobs), APIs mit stoßweisem Traffic. **Nicht** für dauerhaft laufende Prozesse wie WebSocket-Bots.

### ECS/EKS — Container-Orchestrierung

Wenn dein Projekt Docker nutzt und auf mehrere Container/Dienste anwächst, verwende Kubernetes zur Orchestrierung.

- **AWS ECS:** Amazons einfacherer Container-Dienst
- **AWS EKS:** Verwaltetes Kubernetes
- **Alibaba Cloud:** ACK
- **Tencent Cloud:** TKE
- **Google Cloud:** GKE

**Wann einsetzen:** Multi-Service-Mikroservice-Architekturen, automatische Skalierung, Teamprojekte. Die meisten persönlichen Projekte brauchen das nicht — ein VPS + Docker Compose reicht.

## 6.3 Speicher: Wo Dateien und Daten leben

### S3 (Simple Storage Service) ⭐ Am häufigsten genutzt

**Das ist der am häufigsten genutzte Dienst neben Servern** — zum Speichern von Bildern, Videos, PDFs, statischen Website-Assets, Backups und mehr. **Speichere hochgeladene Nutzerdateien niemals auf der lokalen Festplatte deines Servers!** Sie gehen verloren, wenn du den Server neu aufsetzt, migrierst oder vergrößerst.

- **Alibaba Cloud:** OSS (Object Storage Service)
- **Tencent Cloud:** COS (Cloud Object Storage)
- **Google Cloud:** GCS (Google Cloud Storage)
- **Alternative:** Cloudflare R2 (keine Egress-Gebühren — ein Schnäppchen!)

**Kostenlose Stufe:** AWS S3 bietet im Free Tier 12 Monate lang 5 GB Standardspeicher. Alibaba Cloud OSS gibt neuen Nutzern 6 Monate lang 5 GB. Cloudflare R2 hat eine dauerhaft kostenlose Stufe mit 10 GB Speicher.

**Was du mit S3 machen kannst:**
- Nutzer-Uploads speichern (Avatare, Bilder, Anhänge, Produktfotos)
- Statische Websites hosten (deinen `dist/`-Ordner hochladen, "Static website hosting" aktivieren)
- Datenbank-Exporte sichern
- Mit dem CloudFront-CDN für schnelle globale Downloads kombinieren
- Pre-signed URLs erzeugen, um private Dateien zu teilen

**So verwendest du S3 (AWS-Konsolen-Anleitung):**

1. Gehe zum **S3 Dashboard** → **Create bucket**
2. Vergib einen **global eindeutigen** Bucket-Namen (z. B. `myapp-images`)
3. Wähle eine AWS-Region (z. B. us-east-1 für US East)
4. **Object Ownership:** Wähle "ACLs enabled" → "Bucket owner preferred" (einfacher für öffentlichen Zugriff)
5. **Deaktiviere** "Block all public access", wenn du öffentliche Bilder willst (lies die Warnung, nur bei öffentlichen Inhalten deaktivieren)
6. Andere Einstellungen bei Standard lassen → Klicke auf **Create bucket**
7. Klicke auf deinen Bucket → **Upload** → Dateien auswählen
8. Nach dem Upload erhält jede Datei eine URL wie `https://myapp-images.s3.us-east-1.amazonaws.com/avatar.jpg`
9. Verwende diese URL direkt im Frontend `<img src="...">`

**S3 mit Code verwenden (Node.js-Beispiel; lass dir die komplette Logik von KI schreiben):**

```javascript
// npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });

async function uploadFile(buffer, filename, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: "myapp-images",
    Key: filename,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read" // Datei öffentlich zugänglich machen
  }));
  return `https://myapp-images.s3.us-east-1.amazonaws.com/${filename}`;
}
```

> ⚠️ **Kritischer Sicherheitshinweis:** AWS Access Keys sind wie das Passwort für dein S3. **Harte sie niemals in Frontend-Code ein und committe sie nicht in Git!** Speichere sie in Umgebungsvariablen oder nutze IAM-Rollen. Wenn Schlüssel durchsickern, deaktiviere sie sofort in der IAM-Konsole.

### EBS (Elastic Block Store) — virtuelle Festplatten

Block-Speicher-Volumes, die an EC2-Instanzen angehängt werden (wie die Festplatte deines Computers). EC2-Instanzen kommen mit einem Root-Volume (typischerweise 8-60 GB); kaufe zusätzliche EBS-Volumes, wenn du mehr Platz brauchst.

- **Alibaba Cloud:** Cloud Disk (ESSD/SSD)
- **Tencent Cloud:** CBS (Cloud Block Storage)

**Wann einsetzen:** Zusätzlicher Speicherplatz für deinen Server, Daten, die unabhängig vom Lebenszyklus der EC2-Instanz erhalten bleiben müssen.

### EFS (Elastic File System) — gemeinsamer Dateispeicher

Ein Netzwerk-Dateisystem, das mehrere EC2-Instanzen gleichzeitig einhängen können. Gut, um hochgeladene Dateien über mehrere Webserver hinweg zu teilen.

- **Alibaba Cloud:** NAS
- **Tencent Cloud:** CFS

Die meisten kleinen Projekte brauchen das nicht — ein einzelner Server + S3 reicht.

## 6.4 Datenbanken: strukturierte Datenspeicherung

### RDS (Relational Database Service) ⭐ Häufig genutzt

**Betreibe deine Produktionsdatenbank nicht auf demselben VPS!** Obwohl es technisch möglich ist (wie wir es früher im Docker-Compose-Beispiel gemacht haben), nutze für die Produktion eine verwaltete Datenbank: automatische Backups, Hochverfügbarkeit, Monitoring und Skalierung mit einem Klick.

- **Alibaba Cloud:** RDS
- **Tencent Cloud:** TDSQL-C / CDB
- **Google Cloud:** Cloud SQL

**Unterstützte Engines:** MySQL, PostgreSQL, MariaDB, SQL Server, Oracle und Amazon Aurora (MySQL-/PostgreSQL-kompatibel, cloud-optimiert).

**Kostenlose Stufe:** AWS RDS bietet 12 Monate lang 750 Stunden/Monat db.t2.micro oder db.t3.micro + 20 GB Speicher.

**So richtest du RDS ein (AWS):**

1. Gehe zu **RDS** → **Create database**
2. Wähle **Standard create** → Engine: **MySQL 8.0** oder PostgreSQL
3. Vorlagen: **Free tier** (um im kostenlosen Kontingent zu bleiben)
4. Setze DB-Instanzkennung, Master-Benutzername, Master-Passwort
5. Instanzkonfiguration: **db.t3.micro** (Free Tier)
6. Speicher: 20 GB gp2 (Free-Tier-fähig)
7. Konnektivität: Wähle dieselbe **VPC** wie deine EC2-Instanz
8. **Öffentlicher Zugriff:** Nein (nur Zugriff aus der VPC heraus erlauben)
9. VPC Security Group: Neu erstellen oder eine bestehende wählen, die Port 5432/3306 von deiner EC2-Security-Group zulässt
10. Klicke auf **Create database** → warte ca. 5-10 Minuten
11. Sobald verfügbar, hole den **Endpoint** (sieht aus wie `mydb.xxxxx.us-east-1.rds.amazonaws.com:3306`)
12. Aktualisiere die `DATABASE_URL` deiner App auf diesen Endpoint und füge deine EC2-Security-Group zu den eingehenden Regeln der RDS-Security-Group hinzu

> 💡 **Vibecoding-Tipp:** Sage der KI: "Ich habe eine AWS-RDS-PostgreSQL-Instanz unter [Endpoint] mit Benutzer [Benutzername]. Hilf mir, Verbindungscode und Migrationsskripte für [mein Projekt] zu schreiben."

### ElastiCache — verwaltetes Redis/Memcached

In-Memory-Caching für heiße Daten (reduziert Datenbankabfragen), Sitzungs-/Token-Speicherung, Nachrichtenwarteschlangen, Ranglisten usw.

- **Alibaba Cloud:** ApsaraDB for Redis
- **Tencent Cloud:** TencentDB for Redis
- **Alternative:** Upstash (Serverless Redis, kostenlose Stufe verfügbar)

Für kleine Projekte kannst du auf deinem VPS einfach `sudo apt install redis-server` ausführen; für die Produktion/Hochverfügbarkeit verwende verwaltetes Redis.

## 6.5 Netzwerk: schnellerer, sicherer Zugriff

### CloudFront — CDN (Content Delivery Network) ⭐ Häufig genutzt

Cached deine statischen Assets (Bilder, CSS, JS, Video) auf Edge-Standorten weltweit, sodass Nutzer Inhalte vom nächstgelegenen Knoten erhalten.

- **Alibaba Cloud:** CDN / DCDN
- **Tencent Cloud:** CDN / EdgeOne
- **Google Cloud:** Cloud CDN
- **Kostenlose Alternative:** Cloudflare CDN (kostenloser Plan inklusive unbegrenzter Bandbreite)

**Wann einsetzen:**
- Seiten mit Bildern/Videos/großen Dateien
- Nutzer über verschiedene Regionen verteilt
- Reduzierung der Bandbreitenkosten auf deinem Ursprungsserver
- Cloudflare Pages ist im Wesentlichen = CDN + statisches Hosting

**So konfigurierst du CloudFront:**
1. CloudFront-Konsole → **Create distribution**
2. Origin-Domain: Wähle deinen S3-Bucket oder deinen EC2-ALB
3. Standard-Cache-Verhalten: HTTP auf HTTPS umleiten
4. Distribution erstellen → warte ca. 5-15 Minuten auf das Deployment
5. Richte die DNS-Auflösung deiner Domain per CNAME-Eintrag auf den Domainnamen der CloudFront-Distribution (z. B. `dxxx.cloudfront.net`)

### ELB (Elastic Load Balancing)

Verteilt eingehenden Traffic auf mehrere EC2-Instanzen und entfernt automatisch instabile Instanzen.

- **ALB (Application Load Balancer):** Schicht 7 (HTTP/HTTPS), pfadbasiertes Routing, am häufigsten für Web-Apps
- **NLB (Network Load Balancer):** Schicht 4 (TCP/UDP), extrem niedrige Latenz
- **GLB (Gateway Load Balancer):** Für virtuelle Netzwerk-Appliances
- **Alibaba Cloud:** SLB / ALB
- **Tencent Cloud:** CLB

Projekte mit einem einzigen Server brauchen das nicht. Nutze es, wenn du auf mehrere Backend-Server skalierst.

### Route 53 — DNS-Dienst

Übersetzt Domainnamen in IP-Adressen. Die meisten Domain-Registrare bieten kostenloses DNS, aber Route 53 ist tief in AWS integriert.

- **Alibaba Cloud:** Alibaba Cloud DNS
- **Tencent Cloud:** DNSPod
- **Kostenlose Alternative:** Cloudflare DNS (weltweit eine der schnellsten, komplett kostenlos)

**Häufige DNS-Record-Typen:**

| Typ | Zweck | Beispiel |
|-----|-------|----------|
| **A** | Domain → IPv4-Adresse | `@ → 54.123.45.67` |
| **AAAA** | Domain → IPv6-Adresse | `@ → 2600:xxxx::` |
| **CNAME** | Domain → andere Domain (für CDN) | `static → dxxx.cloudfront.net` |
| **MX** | Mailserver (für geschäftliche E-Mails nötig) | - |
| **TXT** | Beliebiger Text (Domain-Verifizierung, SPF/DKIM) | - |

### ACM (AWS Certificate Manager) — kostenlose SSL-Zertifikate

AWS stellt kostenlose SSL/TLS-Zertifikate bereit, die sich bei Verwendung mit CloudFront oder ALB automatisch erneuern. Fordere einfach ein Zertifikat an, validiere es per DNS oder E-Mail und hänge es an deine Distribution bzw. deinen Load Balancer.

- **Alibaba Cloud:** Kostenlose SSL-Zertifikate
- **Tencent Cloud:** Kostenlose SSL-Zertifikate
- **Universelle kostenlose Option:** Certbot + Let's Encrypt (die Methode aus Abschnitt 5, automatische Verlängerung alle 90 Tage)

### VPC (Virtual Private Cloud)

Ein isoliertes virtuelles Netzwerk in AWS, in dem deine EC2-, RDS- und andere Ressourcen leben. Neue Konten erhalten eine Standard-VPC. Fortgeschrittene Nutzung (Trennung öffentlicher/privater Subnetze, NAT-Gateways) erfordert tieferes Studium.

## 6.6 Weitere gängige Dienste

### Domain-Registrierung

- **Global:** Namecheap, Cloudflare Registrar (kostenloser WHOIS-Datenschutz), GoDaddy
- **AWS:** Route 53 (übernimmt auch die Registrierung)
- **China:** Alibaba Cloud Wanwang, Tencent Cloud DNSPod (für die ICP-Anmeldung erforderlich)

### SES (Simple Email Service) — E-Mails versenden

Betreibe keinen eigenen Mailserver (deine E-Mails landen sonst wahrscheinlich im Spam). Nutze einen professionellen E-Mail-Dienst.

- **AWS SES**, SendGrid, Mailgun, Resend
- **China:** Alibaba Cloud Direct Mail, Tencent SES
- Verwendung: Verifizierungs-E-Mails, Benachrichtigungen, Marketing-E-Mails

### SNS (Simple Notification Service) — SMS/Push-Benachrichtigungen

Für SMS und mobile Push-Benachrichtigungen. Twilio ist die beliebte globale Alternative für SMS.

### CloudWatch — Monitoring & Logging

Überwache EC2-CPU/Arbeitsspeicher/Festplatte, sieh dir Anwendungs-Logs an und richte Alarme ein (hohe CPU, Dienst ausgefallen).

- **Alibaba Cloud:** Cloud Monitor + SLS (Log Service)
- **Tencent Cloud:** Cloud Monitor + CLS
- **Anfängeralternative:** PM2s integriertes Monitoring + Uptime Kuma (Open Source, ein Docker-Container zum Ausführen)

### S3 Advanced: Bildverarbeitung / Lambda-Trigger

S3 kann beim Hochladen von Dateien automatisch Lambda-Funktionen auslösen. Wenn ein Nutzer z. B. ein großes Foto hochlädt, kann eine Lambda-Funktion automatisch Miniaturansichten erstellen. In China hat Alibaba OSS eine integrierte Bildverarbeitung (anhängen von `?x-oss-process=image/resize,w_300` an URLs), und Tencent COS bietet Cloud Infinite (CI) für ähnliche Funktionen.

## 6.7 Cloud-Dienst-Zuordnung: AWS ↔ chinesische Clouds ↔ Alternativen

Schnellreferenz zum Finden gleichwertiger Dienste:

| Kategorie | AWS | Alibaba Cloud | Tencent Cloud | Kostenlose/Günstige Alternative |
|-----------|-----|--------------|---------------|--------------------------------|
| Cloud-Server | EC2 | ECS | CVM / Lighthouse | DigitalOcean / Vultr / Hetzner |
| Objektspeicher | S3 | OSS | COS | Cloudflare R2 (keine Egress-Gebühren) |
| Relationale Datenbank | RDS | RDS | TDSQL-C/CDB | Supabase / Neon |
| Redis-Cache | ElastiCache | ApsaraDB Redis | TencentDB Redis | Upstash |
| CDN | CloudFront | CDN/DCDN | CDN/EdgeOne | Cloudflare CDN (kostenlos) |
| Load Balancer | ALB/NLB | SLB/ALB | CLB | Selbst gehostetes Nginx / Caddy |
| Serverless | Lambda | Function Compute | SCF | Cloudflare Workers |
| Container/K8s | ECS/EKS | ACK | TKE | Fly.io / Railway |
| DNS | Route 53 | Alibaba Cloud DNS | DNSPod | Cloudflare DNS (kostenlos) |
| SSL-Zertifikate | ACM (kostenlos) | Kostenlose Zertifikate | Kostenlose Zertifikate | Let's Encrypt (kostenlos) |
| E-Mail | SES | Direct Mail | SES | Resend / SendGrid kostenlose Stufe |
| SMS | SNS | SMS | SMS | Twilio |
| Monitoring | CloudWatch | Cloud Monitor | Cloud Monitor | Uptime Kuma (selbst gehostet) |
| KI/ML-APIs | Bedrock | Tongyi Qianwen/Bailian | Hunyuan/TI | OpenAI / Anthropic API |
| Domain-Registrierung | Route 53 | Wanwang | DNSPod | Namecheap / Cloudflare |

## 6.8 Häufige Anfängerfragen

**F: Sollte ich verwaltete Cloud-Dienste nutzen oder alles selbst auf einem VPS hosten?**

- **Persönliche Projekte / Lernen:** Selbst auf dem VPS hosten (alles mit Docker Compose) — günstiger und du lernst mehr.
- **Produktion mit echten Nutzern:** Verwaltete Dienste für Datenbanken und Objektspeicher nutzen (Auto-Backups, Stabilität), die App kann auf dem VPS bleiben.
- **Gut finanzierte/Team-Projekte:** Verwaltete Cloud-Dienste so weit wie möglich nutzen — Zeit in die Geschäftslogik stecken, nicht ins Betriebsmanagement.

**F: Wie nutze ich das AWS Free Tier, ohne abgerechnet zu werden?**

1. Starte immer **t2.micro/t3.micro**-Instanzen (mit "Free tier eligible" markiert)
2. Richte einen **Billing Alarm** für 0 $ oder 1 $ ein (Billing Dashboard → Budgets → Create budget)
3. **Beende/lösche** Ressourcen, wenn du fertig bist: EC2-Instanzen, RDS-Datenbanken, S3-Buckets, EBS-Volumes, Elastic IPs
4. Beachte: EBS-Volumes und Elastic IPs **laufen auch dann weiter, wenn die Instanz gestoppt ist**, falls du sie nicht löschst
5. Prüfe das Billing Dashboard monatlich

**F: AWS oder andere VPS-Anbieter?**

- AWS-Ökosystem lernen / sich auf Cloud-Jobs vorbereiten → AWS Free Tier nutzen
- Schnelles Deployment, einfache Projekte, niedrigste Kosten → DigitalOcean (4 $/Monat) oder Hetzner (3,49 €/Monat)
- Stündliches Testen → Vultr (stündliche Abrechnung, jederzeit zerstörbar)
- KI/GPU-Workloads → Modal oder Lambda Labs
- Komplett kostenloser 24/7-Container → Fly.io kostenlose Stufe

---

# 7. Deployment-Plattformen speziell für KI-Agents

Wenn du KI-Agents deployst (nicht nur normale Web-Apps), gibt es Plattformen, die speziell für KI-Workloads entwickelt wurden:

## 7.1 Modal — Serverless GPU für Python-KI/ML

**Website:** https://modal.com

**Am besten geeignet für:** Python-KI-Projekte, die GPU-Inferenz, geplante Jobs und Batch-Datenverarbeitung brauchen

**Funktionen:**
- Funktionen mit Python-Dekoratoren definieren, `modal deploy` für Ein-Befehl-Deployment
- GPU-Container-Cold-Start ca. 1 Sekunde, Abrechnung pro Millisekunde
- Integrierte Planung, Geheimnisverwaltung, gemeinsamer Speicher
- Kostenloser Plan inklusive 30 $/Monat Guthaben (für die meisten persönlichen Projekte ausreichend)
- Unterstützt nur Python

```python
import modal
app = modal.App("my-ai-agent")

@app.function(gpu="A10G", timeout=300)
def run_agent(prompt: str):
    # Führe hier dein KI-Modell/deinen Agenten aus
    return result
```

## 7.2 Hugging Face Spaces — erste Wahl für KI-Demos

**Website:** https://huggingface.co/spaces

**Am besten geeignet für:** Schnelles Präsentieren von KI-Demos (Gradio/Streamlit-UI), Open-Source-Modellpräsentation

**Funktionen:**
- Kostenlose kleine CPU-Instanzen; GPU gegen Bezahlung verfügbar
- Unterstützt Gradio, Streamlit, Docker
- Aktive Community; jeder Space hat öffentlichen Code und Diskussionen
- Spaces anderer mit einem Klick forken und anpassen

## 7.3 Replicate — Modelle in APIs verwandeln

**Website:** https://replicate.com

**Am besten geeignet für:** KI-Modelle in aufrufbare HTTP-APIs verwandeln, ohne Server zu verwalten

Lade dein Modell hoch, Replicate verpackt es in eine HTTP-API und berechnet pro Aufruf. Großartig, um feinabgestimmte Modelle zu veröffentlichen.

## 7.4 Lambda Labs — On-Demand-GPU-Instanzen

**Website:** https://lambdalabs.com

**Am besten geeignet für:** GPU-intensives Training und Inferenz zu geringeren Kosten als AWS/GCP-GPU-Instanzen. A100, H100, A10 nach Bedarf verfügbar.

---

# 8. 🎯 Vibecoding-Deployment-Workflow: Lass KI dein DevOps sein

Das ist die wichtigste Denkweise für das Deployment im Vibecoding-Zeitalter: **Du musst dir nicht jeden Befehl merken — KI ist dein DevOps-Assistent.**

## 8.1 Zwei KI-Kollaborationsmodi

**Modus 1: Skripte lokal generieren, manuell ausführen**

Sage deinem KI-Coding-Assistenten (Claude Code, Trae Solo, Cursor):

> "Ich möchte [Projektbeschreibung] auf [Plattform/Server] deployen. Generiere:
> 1. Eine vollständige Schritt-für-Schritt-Deployment-Checkliste
> 2. Alle benötigten Konfigurationsdateien (Nginx, PM2, Dockerfile, docker-compose)
> 3. Ein deploy.sh-Deployment-Skript
> 4. Eine Checkliste der Umgebungsvariablen"

Führe dann einfach aus, was die KI generiert.

**Modus 2: KI verbindet sich direkt per SSH mit deinem Server (noch einfacher)**

Claude Code unterstützt Remote-SSH-Operationen:

```bash
claude
# Sage ihr:
# "Verbinde dich per SSH mit root@MY-IP und deploye /root/myapp, konfiguriere Nginx + HTTPS + PM2"
```

Die KI prüft automatisch die Umgebung, installiert fehlende Abhängigkeiten, zieht den Code, baut, konfiguriert und verifiziert — alles, ohne dass du Befehle manuell tippen musst.

> ⚠️ **Sicherheitshinweise:**
> - Übe zuerst auf einem Testserver, um sicherzustellen, dass die KI keine destruktiven Änderungen vornimmt
> - Sichere wichtige Daten regelmäßig
> - Gib der KI einen Benutzer mit minimalen Rechten (kein root; ein sudo-Benutzer ist ok, aber überwache die Befehle)
> - Bevor die KI gefährliche Befehle ausführt, prüfe, was sie vorhat

## 8.2 Universelle Deployment-Prompt-Vorlage

Egal welche Plattform/welchen Server du wählst — fülle das aus und schicke es an die KI, um einen vollständigen, umsetzbaren Plan zu erhalten:

```
Hilf mir, ein Projekt mit den folgenden Informationen zu deployen:

[DEPLOYMENT-ZIEL]
- Plattform/Server: [Vercel / Railway / Fly.io / Ubuntu 22.04 VPS / AWS EC2 / ...]
- Server-IP (falls VPS): xxx.xxx.xxx.xxx
- Bereits konfiguriert: [SSH-Schlüssel-Login / Docker installiert / Nginx installiert / ...]

[PROJEKTINFORMATIONEN]
- Projekttyp: [Next.js 14 / Vite+React / Node.js Express / Python FastAPI / ...]
- Code-Standort: GitHub-Repository https://github.com/xxx/xxx
- Technologie-Stack: Node.js 20 + PostgreSQL 16 + Redis 7
- Startbefehl: npm run start
- Lauscht auf Port: 3000
- Umgebungsvariablen: DATABASE_URL=xxx, JWT_SECRET=xxx, OPENAI_API_KEY=xxx

[DOMAIN]
- Domain: mydomain.com
- DNS zeigt bereits auf den Server: Ja/Nein
- HTTPS nötig: Ja/Nein

[ANFORDERUNGEN]
1. Vollständige Schritte (lokale Operationen vs. Server-Operationen getrennt auflisten)
2. Alle Konfigurationsdateien bereitstellen
3. Mir sagen, wie ich den Erfolg des Deployments verifiziere
4. Häufige Fallstricke und Fehlerbehebungs-Schritte auflisten
```

## 8.3 KI-gestützter Fehlerbehebungs-Workflow

Wenn etwas kaputtgeht:

1. **Zuerst Logs prüfen:**
   - Nginx: `sudo tail -50 /var/log/nginx/error.log`
   - PM2: `pm2 logs myapp`
   - Docker: `docker compose logs app`
   - systemd: `sudo journalctl -u myapp -n 50`

2. **Kopiere den vollständigen Fehler mit Kontext an die KI:**
   > "Ich deploye Node.js auf Ubuntu und bekomme 502 Bad Gateway. Nginx-Fehlerlog: [einfügen]. Konfiguration: [einfügen]. PM2-Status: [einfügen]. Hilf mir beim Debuggen."

3. **Schnellreferenz für häufige Probleme:**
   - **502 Bad Gateway:** Backend läuft nicht, falscher Port, falsches proxy_pass
   - **Kein Zugriff auf die IP:** Security Group lässt den Port nicht zu, ufw blockiert, Nginx nicht gestartet
   - **Aktualisieren ergibt 404:** Nginx fehlt `try_files` für SPA-Routing
   - **Statische Assets 404:** Falscher Root-Pfad, Dateiberechtigungen
   - **HTTPS-Zertifikat schlägt fehl:** Domain zeigt nicht auf den Server, Port 80 blockiert
   - **PM2 startet immer wieder neu:** Code-Bug verursacht Absturz, `pm2 logs` prüfen
   - **Vercel-Function-Timeout:** Über 10-s-Limit — für langlaufende Aufgaben zu Fly.io/Railway/VPS wechseln
   - **Railway/Render 503:** Dienst schläft oder Guthaben erschöpft
   - **AWS-EC2-Verbindung abgelehnt:** Security Group fehlt die SSH-Regel oder falscher Port

---

# 9. Tipps nach dem Deployment

## 9.1 Dateiübertragung

```bash
# Lokal → Server
scp ./file.zip yourname@IP:/home/yourname/
scp -r ./dir yourname@IP:/home/yourname/

# Server → Lokal
scp yourname@IP:/home/yourname/file.zip ./

# rsync (inkrementelle Synchronisation, für Deployment empfohlen)
rsync -avz --exclude=node_modules --exclude=.git ./project/ yourname@IP:/var/www/project/
```

## 9.2 Ein-Befehl-Update-Skript

Erstelle `deploy.sh` auf deinem Server:

```bash
#!/bin/bash
set -e
cd /path/to/project
git pull origin main
npm install
npm run build
pm2 restart myapp
echo "✅ Deployment abgeschlossen!"
```

Updates sind dann einfach `bash deploy.sh`. Für vollständige Automatisierung richte GitHub Actions ein (lass die KI die CI/CD-Konfiguration schreiben), sodass Code-Pushes auf main automatisch deployed werden.

## 9.3 Security-Härtungs-Checkliste

Lass die KI ein vollständiges Härtungsskript generieren, das typischerweise Folgendes enthält:
- Passwort-Login deaktivieren, nur SSH-Schlüssel verwenden
- Standard-SSH-Port ändern (22 → etwas anderes)
- fail2ban installieren (Brute-Force-IPs automatisch sperren)
- Automatische Sicherheitsupdates aktivieren: `sudo apt install unattended-upgrades`
- Niemals Geheimnisse/.env in Git committen
- Regelmäßige Datenbank-Backups zu S3 planen

---

# 10. Kapitelzusammenfassung

**Zusammenfassung der Deployment-Optionen:**

| Szenario | Empfehlung | Kosten | Schwierigkeit |
|----------|-----------|-------|---------------|
| Reines Frontend/Doku | Cloudflare Pages / Vercel / GitHub Pages | Kostenlos | ⭐ |
| Next.js Full-Stack (schnelle Antwortzeiten) | Vercel | Kostenlos / 20 $/Monat | ⭐ |
| Backend-API/Bot (Always-On) | Railway / Fly.io (kostenlos) / VPS | 0-10 $/Monat | ⭐⭐ |
| Full-Stack (volle Kontrolle) | DigitalOcean / Vultr / AWS EC2 + Docker | 4-10 $/Monat | ⭐⭐⭐ |
| KI-Agent-Demos | Hugging Face Spaces | Kostenlos | ⭐ |
| KI-GPU-Inferenz | Modal (global) | 0-30 $/Monat Guthaben | ⭐⭐ |
| Produktion mit Nutzern | AWS/Azure/GCP verwaltete Dienste | Variiert | ⭐⭐⭐ |

**Denk an die 5 Kernschritte:**
1. **Plattform wählen** → basierend auf deinem Projekttyp (nutze die Tabelle oben)
2. **Code hinschaffen** → git push / rsync / GitHub-Auto-Deploy
3. **Umgebung einrichten** → Node.js/Nginx/Docker installieren (oder die Plattform übernimmt das)
4. **Am Laufen halten** → PM2 / Docker / systemd
5. **Domain + HTTPS** → DNS-Einträge + Certbot / ACM

**Vibecoding-Denkweise:**
1. Verstehe, *was* getan werden muss, nicht jeden Befehl
2. Beschreibe die Anforderungen klar an die KI — sie liefert komplette Lösungen
3. Verstehe, was die KI tut, bestätige die wichtigsten Schritte
4. Bei Fehlern: Logs an die KI einfügen — sie diagnostiziert 90 % der Probleme
5. Sichere wichtige Daten, nutze minimale Berechtigungen

Deploy einmal und du wirst merken — online zu gehen ist gar nicht so schwer. 🎯

---

<RelatedArticlesSection
  :articles="relatedArticlesMap['de-de/stage-2/backend/cloud-server-deployment']"
  title="Verwandte Artikel"
  description="Lerne weiter die Engineering-Fähigkeiten rund um das Deployment."
/>