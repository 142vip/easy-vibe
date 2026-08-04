<script setup>
import RelatedArticlesSection from '../../../../.vitepress/theme/components/RelatedArticlesSection.vue'
import { relatedArticlesMap } from '../../../../.vitepress/theme/data/relatedArticles'
</script>

# Cloud VPS Deployment: Publish Your Local Project to the Internet

Getting a project running locally onto the public internet so anyone can visit it via a URL — this is a skill every vibecoding developer must master. Many beginners think deployment is hard, but in 2026 there are more options than ever: from one-click PaaS platforms to budget VPS servers for a few dollars a month, and even completely free options.

This chapter aims to help you **choose the right deployment method and get your project online with AI assistance**. You don't need to memorize every command — just understand the core workflow and let AI handle the specifics.

---

# 0. Choose Wisely: Deployment Platform Decision Tree

Before picking a platform, answer three questions:

1. **Does your project need to run 24/7?**
   - No (responds only when visited, e.g. docs, blogs, static sites) → **Static hosting / PaaS**
   - Yes (cron jobs, crawlers, Telegram/Discord bots, WebSocket services) → **Always-on PaaS or VPS**

2. **Do you need a GPU?**
   - No (just calling OpenAI/Anthropic APIs) → Regular platforms work
   - Yes (running open-source models, generating images/video) → **GPU cloud platforms** (Modal, Replicate, Lambda Labs)

3. **Where are your users primarily located?**
   - Global / US/EU → Vercel / Railway / Fly.io / AWS
   - China mainland → Chinese clouds (Alibaba Cloud / Tencent Cloud) or Cloudflare (fast in China)
   - Both → Use CDN, deploy China-facing assets on Chinese cloud, global on AWS with GeoDNS

```
What type of project are you deploying?
│
├─ Pure frontend static site (Vite/React/Vue build output)
│   ├─ Completely free → Cloudflare Pages (unlimited bandwidth) / GitHub Pages
│   ├─ Next.js project → Vercel (official platform, best DX)
│   └─ China users primarily → Cloudflare Pages or domestic OSS+CDN
│
├─ Backend API, doesn't need to be always-on (request-triggered)
│   ├─ Node.js/Python API → Vercel Functions / Cloudflare Workers
│   └─ Full-stack frameworks (Next.js/Nuxt/SvelteKit) → Vercel
│
├─ Needs always-on process (Bot, cron, WebSocket)
│   ├─ Don't want to manage servers → Railway / Render / Fly.io
│   ├─ Full control & cost savings → Buy a VPS (DigitalOcean / Vultr / Hetzner / AWS EC2)
│   └─ China-facing projects → Tencent Cloud Lighthouse / Alibaba Cloud ECS
│
├─ Need to run AI models / GPU
│   ├─ Inference API → Modal / Replicate / Hugging Face Inference
│   ├─ Training/Fine-tuning → Modal / Lambda Labs
│   └─ China GPU → AutoDL / Alibaba Cloud PAI
│
└─ Large production projects
    └─ AWS/GCP + Kubernetes (hire DevOps or let AI write Terraform)
```

---

# 1. Free/Low-Cost Deployment Platforms in Detail (No Server Needed)

For most personal projects, demos, and portfolios, you **don't need to buy a server at all**. This section covers the most popular free/low-cost platforms with how to sign up, how to use them, and their gotchas.

## 1.1 Vercel — First Choice for Next.js / Frontend

**Website:** https://vercel.com

**Best for:** Next.js projects, React/Vue frontends, full-stack apps with Serverless Functions, AI chatbots (fast response time)

**How to use:**
1. Sign up with your GitHub account
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Vercel auto-detects your framework (Next.js/Vite/React etc.), fill in environment variables
5. Click "Deploy" — your site is live in 1-2 minutes at `xxx.vercel.app`

**Free tier (Hobby plan):**
- 100 GB bandwidth/month
- 100 hours build time/month
- Serverless Function execution time **10 seconds** (the most critical limit!)
- Auto HTTPS, global CDN, PR preview links

**Paid (Pro, $20/month):**
- Function timeout extended to 60-300s
- 1 TB bandwidth
- Team collaboration features

**⚠️ Key limitations beginners hit:**
- **10-second function timeout** on free tier: AI API calls exceeding 10s will disconnect. Pro tier $20/mo extends to 60s, 300s costs extra
- **No always-on processes**: No cron, no WebSocket long-polling, no permanently running bots
- **Cold starts**: Functions unused for a while will be slow on first request
- **AI project costs**: Streaming AI responses consumes bandwidth; heavy traffic can push Pro bills to $200/month

**Verdict:** Vercel is the smoothest experience for deploying frontend pages, docs, and quick demos. But for always-on agents or long-running AI calls — don't use Vercel.

## 1.2 Cloudflare Pages — Unlimited Bandwidth, Fast Globally

**Website:** https://pages.cloudflare.com

**Best for:** Static sites, bandwidth-heavy projects, global audiences, Edge Functions

**Free tier:**
- **Unlimited bandwidth** (the biggest selling point!)
- 500 builds/month
- Unlimited requests
- Cloudflare Workers: 100,000 requests/day
- 300+ edge locations worldwide, decent speed even in China

**How to use:**
1. Sign up for a free Cloudflare account
2. Go to Workers & Pages → Create → Pages → Connect to Git
3. Select your repo, set build command (Vite: `npm run build`, output dir: `dist`)
4. Click Save and Deploy

**Bonus: Workers AI:** Cloudflare also offers running open-source AI models (Llama 3, Mistral, Stable Diffusion) on edge nodes, with 10,000 neurons/day free. Great for running small models without relying on OpenAI APIs.

**Verdict:** Best choice for static sites, especially projects with global audiences. Unlimited bandwidth is a killer feature.

## 1.3 Railway — Best Experience for Backend Services (Always-On)

**Website:** https://railway.app

**Best for:** Always-on backend services, Node.js/Python/Go APIs, Discord/Telegram bots, full-stack projects needing databases

**How to use:**
1. Sign up with GitHub
2. New Project → Deploy from GitHub repo (or pick a template)
3. Railway auto-detects your project type, installs deps, builds, and starts
4. One-click add PostgreSQL/Redis/MySQL/MongoDB databases
5. Auto-generated domain, or bind your custom domain

**Pricing:**
- New users get **$5 trial credit** (not permanently free)
- Usage-based billing after that, starts ~$5/month (minimum spec always-on service + DB)
- Sleeps after 5 min idle (during free trial); no sleep after paying

**Verdict:** Railway has the best experience for deploying backend APIs, bots, and full-stack apps needing databases — auto-deploy from GitHub, built-in databases, logs and monitoring all included.

## 1.4 Fly.io — Truly 24/7 Free Containers

**Website:** https://fly.io

**Best for:** Low-latency globally distributed services, wanting a **truly free 24/7** container, accepting a slight learning curve

**Free tier:**
- 3 micro shared VMs (micro-1x, 256MB RAM)
- **No runtime limit** (no sleeping like Render)
- 160 GB outbound traffic/month
- 3 GB persistent volumes
- 30+ global datacenter regions
- GPU support (A100/H100)

**How to use:**
1. Sign up requires credit card (won't be charged, identity verification)
2. Install flyctl CLI
3. Write a `fly.toml` config in your project (AI can generate this)
4. `fly launch` → auto-builds Docker image, allocates IP, deploys
5. `fly deploy` to update, `fly logs` to view logs

**Verdict:** If you need a **truly 24/7 free container** for a bot/API/cron job, Fly.io is the best free option. Trade-off is learning flyctl commands and Docker basics.

## 1.5 Render — 750 Hours Free But Sleeps

**Website:** https://render.com

**Best for:** Learning phase, personal projects, projects that don't mind cold starts

**Free tier:**
- Web Service: 750 hours/month (one instance runs continuously)
- PostgreSQL: free for 90 days (⚠️ DB gets deleted after!)
- Static sites: completely free, 100 GB bandwidth

**⚠️ Key issue:**
- **Sleeps after 15 minutes of inactivity**, cold start takes 10-30 seconds (bad UX)
- Free database deleted after 90 days — remember to back up!

**Verdict:** Good for dev/testing/school projects, but don't put production user-facing projects on the free tier. Paid starts at $7/month to disable sleeping.

## 1.6 Other Notable Platforms

| Platform | Type | Free Tier | Highlights |
|----------|------|-----------|------------|
| **GitHub Pages** | Static hosting | Unlimited (100GB soft limit) | Easiest: push to GitHub, it goes live |
| **Hugging Face Spaces** | AI apps | Free CPU small instance | Dedicated to AI demos (Gradio/Streamlit) |
| **Modal** | AI/Serverless GPU | $30/month credit | Python functions-as-a-service, GPU cold start <4s |
| **Replicate** | AI model hosting | Pay per call | Turn models into APIs without infra management |
| **Denoland Deploy** | Deno/Edge | 100k requests/day free | Deno official platform, native TypeScript |
| **Netlify** | Static hosting | 100GB bandwidth/month | Rich plugin ecosystem |
| **Supabase** | BaaS | 500MB DB free | Open-source Firebase alternative, Postgres+Auth+Storage |
| **Neon** | Serverless Postgres | 500MB free | Branchable databases for Serverless |
| **Upstash** | Serverless Redis | 10k commands/day free | Request-based Redis for Serverless |

---

# 2. Buying a Cloud VPS: AWS Walkthrough

If you need full control over the server environment, run custom services, or PaaS doesn't cover your needs, it's time to buy your own cloud server. This section walks through AWS (the most widely used global cloud platform), and also covers alternatives like DigitalOcean, Vultr, and Hetzner.

## 2.1 AWS Free Tier — Free for 12 Months

AWS offers new users a 12-month Free Tier that's perfect for learning and personal projects. Here's what's included:

| Service | Free Tier Allocation |
|---------|---------------------|
| **EC2** | 750 hours/month of t2.micro or t3.micro (one instance running 24/7) |
| **S3** | 5GB standard storage |
| **RDS** | 750 hours/month db.t2.micro/db.t3.micro + 20GB storage |
| **Lambda** | 1 million requests/month + 3.2 million seconds compute |
| **CloudFront** | 50GB egress + 2 million requests/month |
| **CloudWatch** | 10 custom metrics + 1GB log ingestion |
| **DynamoDB** | 25GB storage + 2.5 million read/write capacity units |

**⚠️ Important:** Free Tier expires 12 months after sign-up, after which you'll be charged standard rates. Always set up billing alerts (Billing Dashboard → Budgets) to avoid surprise charges. Destroy resources you're not using!

### How to create an EC2 instance (AWS VPS):

1. **Sign up** at https://aws.amazon.com/ with email and credit card
2. Go to **EC2 Dashboard** → **Launch Instances**
3. **Step 1: Choose an Amazon Machine Image (AMI)**
   - Select **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type** (64-bit x86) — this is the most beginner-friendly option
4. **Step 2: Choose Instance Type**
   - Select **t2.micro** (free tier eligible, 1 vCPU, 1GB RAM)
5. **Step 3: Configure Instance Details**
   - Keep defaults (1 instance, default VPC)
6. **Step 4: Add Storage**
   - Default 8GB gp2 root volume is enough for starters
7. **Step 5: Add Tags** (optional, for organization)
8. **Step 6: Configure Security Group** (⚠️ CRITICAL — this is your firewall)
   - Create a new security group
   - Add rules:
     - Type: **SSH**, Port: 22, Source: **My IP** (only your IP can SSH)
     - Type: **HTTP**, Port: 80, Source: **Anywhere (0.0.0.0/0)**
     - Type: **HTTPS**, Port: 443, Source: **Anywhere**
9. **Step 7: Review and Launch**
10. **Key Pair**: When prompted, create a new key pair (e.g. `my-aws-key.pem`), download it, and store it safely. **You cannot download it again!**
11. Click **Launch Instances** → wait 2-5 minutes for it to start

### Connecting to your EC2 instance:

```bash
# On your local Mac/Linux terminal
chmod 400 my-aws-key.pem  # Set correct permissions (required!)
ssh -i my-aws-key.pem ubuntu@YOUR_PUBLIC_IP
# e.g. ssh -i my-aws-key.pem ubuntu@54.123.45.67

# On Windows use PuTTY (convert .pem to .ppk) or Windows Terminal with OpenSSH
```

**Get your public IP:** Go to EC2 Dashboard → Instances → Select your instance → Look for "Public IPv4 address" in the details.

## 2.2 DigitalOcean — Great Documentation for Beginners

**Website:** https://www.digitalocean.com

**Pricing:** Droplets start at $4/month (512MB RAM, 10GB SSD, 500GB bandwidth)

**Why choose DO:** Their documentation (called "community tutorials") is legendary — almost any Linux/server question has a well-written DO tutorial. Their interface is clean and beginner-friendly.

**How to use:**
1. Sign up (credit card or PayPal, $2 minimum deposit via PayPal)
2. Click "Create" → "Droplets"
3. Choose Ubuntu 22.04, $4/month basic plan, pick a datacenter close to your users (NYC, SFO, London, Singapore, etc.)
4. Add your SSH public key (recommended) or set a root password
5. Click "Create Droplet" — ready in ~1 minute
6. Connect via: `ssh root@YOUR_DROPLET_IP`

## 2.3 Vultr — Hourly Billing, Lots of Locations

**Website:** https://www.vultr.com

**Pricing:** Regular Cloud Compute starts at $5/month (1 vCPU, 1GB RAM, 25GB SSD, 1TB bandwidth)

**Why choose Vultr:** Pay by the hour (you can spin up a server for 10 minutes to test something, then destroy it and pay cents), 30+ global locations, and they have affordable GPU instances if you need that later.

## 2.4 Hetzner — Best Value for Long-Term Projects

**Website:** https://www.hetzner.com/cloud

**Pricing:** CX11 starts at €3.49/month (1 vCPU, 2GB RAM, 20GB SSD, 20TB traffic!)

**Why choose Hetzner:** Best price-to-performance ratio in Europe, extremely stable network. Great for long-running production projects. The tradeoff is datacenters are in Germany/Finland/US (no Asia locations).

## 2.5 VPS Provider Quick Comparison

| Provider | Starting Price | Best For | Free Trial |
|----------|---------------|----------|-----------|
| **AWS EC2** | Free tier for 12 months, then ~$10/month | Learning AWS, enterprise integration | 12 months Free Tier |
| **DigitalOcean** | $4/month | Beginners, great docs | $200 credit for 60 days (new users) |
| **Vultr** | $5/month ($2.50 for IPv6-only) | Hourly testing, many regions | $100 credit for 30 days |
| **Hetzner** | €3.49/month | Best value long-term projects | €20 credit |
| **Linode (Akamai)** | $5/month | Established, reliable | $100 credit for 60 days |

---

# 3. Server Initial Setup (Ubuntu 22.04)

Once you've SSH'd into your server, the first thing is to update the system and install basic tools. You can **copy the prompt below to your AI assistant** and let it generate the exact commands you need:

> "I just set up a new Ubuntu 22.04 server and want to deploy a [Node.js/Python/...] project. Give me the complete initialization commands including: system update, create a non-root sudo user, configure SSH key auth, install Node.js 20, install Nginx, install Docker, configure basic ufw firewall."

A typical initial setup:

```bash
# 1. Update system and install basic tools
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git vim ufw build-essential

# 2. Create a regular user (don't always use root!)
sudo adduser yourname
sudo usermod -aG sudo yourname

# 3. Install Node.js (use nvm, NOT apt)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
node -v  # verify

# 4. Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
# Visit http://YOUR-IP in browser, should see Nginx welcome page

# 5. Install Docker (if using containers)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker yourname  # run Docker without sudo
# Log out and back in for this to take effect
docker --version

# 6. Configure firewall
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

## 3.1 Configuring Security Group / Firewall (VERY IMPORTANT!)

On AWS this is done via **Security Groups** (in the EC2 console). On DigitalOcean/Vultr it's in their dashboard firewall settings. On Ubuntu you also need `ufw`.

**Open these ports at minimum:**

| Port | Purpose | Recommendation |
|------|---------|---------------|
| **22** | SSH | Required; restrict to your IP if possible |
| **80** | HTTP | Required for web |
| **443** | HTTPS | Required for secure web |
| **3000-3999** | Node.js dev ports | Open temporarily for debugging, close after deployment |

> ⚠️ **#1 beginner mistake:** The app is running but you can't access it. 90% of the time it's because the security group/firewall isn't allowing that port.

---

# 4. Three Typical Deployment Scenarios

## 4.1 Scenario 1: Deploy a Static Frontend (Vite/React/Vue)

After `npm run build`, you get a `dist/` folder with pure HTML/CSS/JS files.

**Get code to the server:**

```bash
# Option A: rsync from local machine
rsync -avz --exclude=node_modules ./dist/ yourname@YOUR-IP:/var/www/myapp/

# Option B: git clone on server (recommended, easier updates)
cd /var/www
sudo git clone https://github.com/YOUR_USER/YOUR_REPO.git myapp
cd myapp
npm install
npm run build
```

**Configure Nginx:**

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
        try_files $uri $uri/ /index.html;  # SPA routing fallback
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 4.2 Scenario 2: Deploy a Node.js Backend (Express/Fastify/NestJS)

Use **PM2** to keep the app running in the background:

```bash
npm install -g pm2
cd /path/to/your/app
npm install
npm run build  # if TypeScript
pm2 start dist/main.js --name "myapp"
pm2 startup && pm2 save  # auto-start on boot
pm2 logs myapp  # view logs
```

**Nginx reverse proxy:**

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

## 4.3 Scenario 3: Docker Compose Full-Stack Deploy

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

Run with: `docker compose up -d`

---

# 5. Domain & HTTPS

## 5.1 Buy a Domain & Set DNS

Register a domain via Namecheap, Cloudflare Registrar, GoDaddy, or AWS Route 53. In your domain's DNS settings, add **A records**:

| Type | Host | Value |
|------|------|-------|
| A | @ | Your server IP |
| A | www | Your server IP |
| A | api | Your server IP (for backend) |

## 5.2 One-Click HTTPS with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
# Choose option 2 (Redirect) to auto-redirect HTTP to HTTPS
sudo certbot renew --dry-run  # test auto-renewal
```

---

# 6. Cloud Provider Services Deep Dive (Beyond VPS)

When you log into AWS Console (or any cloud dashboard), you'll see dozens of services with cryptic names (EC2, S3, RDS, ELB, VPC…). This section explains the most common ones and when to use them, **using AWS as the primary example** (the concepts map directly to other clouds).

## 6.1 Cloud Architecture Overview

A typical web application running on the cloud looks like this:

```
User → CloudFront (CDN) → ALB (Load Balancer) → EC2 (Your App Server)
                              │                     │
                              │                     ├── S3 (images/files)
                              │                     ├── RDS (database)
                              │                     └── ElastiCache (Redis)
                              │
                              └── ECS/EKS (containers, advanced)
                              
         └── Route 53 (DNS) → maps your domain to CloudFront/ALB
             + ACM (SSL certs) → HTTPS encryption
```

Let's go through each service.

## 6.2 Compute: Where Your Code Runs

### EC2 (Elastic Compute Cloud) — The VPS

This is the "cloud server" we've been using. It's a virtual machine you can SSH into, install anything on, and configure however you want.

- **Alibaba Cloud:** ECS
- **Tencent Cloud:** CVM / Lighthouse
- **DigitalOcean:** Droplet
- **Hetzner:** Cloud Server

**When to use:** When you need full control, custom software, always-on processes.

### Lambda — Serverless Functions

Upload code snippets without managing servers. Pay per invocation and execution time. Runs only when triggered.

- **Alibaba Cloud:** Function Compute
- **Tencent Cloud:** SCF (Serverless Cloud Function)
- **GCP:** Cloud Functions

**When to use:** Occasional tasks (webhook handlers, image processing, scheduled jobs), APIs with spiky traffic. **Not for** always-on processes like WebSocket bots.

### ECS/EKS — Container Orchestration

If your project uses Docker and grows to multiple containers/services, use Kubernetes for orchestration.

- **AWS ECS:** Amazon's simpler container service
- **AWS EKS:** Managed Kubernetes
- **Alibaba Cloud:** ACK
- **Tencent Cloud:** TKE
- **Google Cloud:** GKE

**When to use:** Multi-service microservice architectures, auto-scaling, team projects. Most personal projects won't need this — a VPS + Docker Compose is enough.

## 6.3 Storage: Where Files and Data Live

### S3 (Simple Storage Service) ⭐ Most Used

**This is the most common service beyond servers**, used for storing images, videos, PDFs, static site assets, backups, and more. **Never store user-uploaded files on your server's local disk!** They'll be lost if you rebuild/migrate/resize the server.

- **Alibaba Cloud:** OSS (Object Storage Service)
- **Tencent Cloud:** COS (Cloud Object Storage)
- **Google Cloud:** GCS (Google Cloud Storage)
- **Alternative:** Cloudflare R2 (zero egress fees — great deal!)

**Free tier:** AWS S3 gives 5GB standard storage for 12 months under Free Tier. Alibaba Cloud OSS gives new users 5GB for 6 months. Cloudflare R2 has a permanent free tier with 10GB storage.

**What you can do with S3:**
- Store user uploads (avatars, images, attachments, product photos)
- Host static websites (upload your `dist/` folder, enable "Static website hosting")
- Backup database exports
- Pair with CloudFront CDN for fast global downloads
- Generate pre-signed URLs for sharing private files

**How to use S3 (AWS Console walkthrough):**

1. Go to **S3 Dashboard** → **Create bucket**
2. Enter a **globally unique** bucket name (e.g. `myapp-images`)
3. Choose an AWS Region (e.g. us-east-1 for US East)
4. **Object Ownership:** Select "ACLs enabled" → "Bucket owner preferred" (simpler for public access)
5. **Uncheck** "Block all public access" if you want public images (read the warning, only uncheck for public content)
6. Leave other settings default → Click **Create bucket**
7. Click your bucket → **Upload** → Select files
8. After upload, each file gets a URL like `https://myapp-images.s3.us-east-1.amazonaws.com/avatar.jpg`
9. Use that URL directly in your frontend `<img src="...">`

**Using S3 with code (Node.js example, ask AI to write the full logic):**

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
    ACL: "public-read" // make file publicly accessible
  }));
  return `https://myapp-images.s3.us-east-1.amazonaws.com/${filename}`;
}
```

> ⚠️ **Critical Security Note:** AWS Access Keys are like your S3 password. **Never hardcode them in frontend code or commit to Git!** Store them in environment variables or use IAM roles. If keys leak, disable them immediately in IAM console.

### EBS (Elastic Block Store) — Virtual Hard Drives

Block storage volumes attached to EC2 instances (like your computer's hard drive). EC2 instances come with a root volume (8-60GB typically); buy additional EBS volumes when you need more space.

- **Alibaba Cloud:** Cloud Disk (ESSD/SSD)
- **Tencent Cloud:** CBS (Cloud Block Storage)

**When to use:** Extra disk space for your server, data that needs to persist independently of the EC2 instance lifecycle.

### EFS (Elastic File System) — Shared File Storage

A network file system that multiple EC2 instances can mount simultaneously. Good for sharing uploaded files across multiple web servers.

- **Alibaba Cloud:** NAS
- **Tencent Cloud:** CFS

Most small projects don't need this — a single server + S3 is enough.

## 6.4 Databases: Structured Data Storage

### RDS (Relational Database Service) ⭐ Common

**Don't run your production database on the same VPS!** While technically possible (we did this earlier in the Docker Compose example), for production use a managed database: automated backups, high availability, monitoring, and one-click scaling.

- **Alibaba Cloud:** RDS
- **Tencent Cloud:** TDSQL-C / CDB
- **Google Cloud:** Cloud SQL

**Supported engines:** MySQL, PostgreSQL, MariaDB, SQL Server, Oracle, and Amazon Aurora (MySQL/PostgreSQL-compatible, cloud-optimized).

**Free tier:** AWS RDS gives 750 hours/month of db.t2.micro or db.t3.micro + 20GB storage for 12 months.

**How to set up RDS (AWS):**

1. Go to **RDS** → **Create database**
2. Select **Standard create** → Engine: **MySQL 8.0** or PostgreSQL
3. Templates: **Free tier** (to stay within free allocation)
4. Set DB instance identifier, master username, master password
5. Instance configuration: **db.t3.micro** (free tier)
6. Storage: 20GB gp2 (free tier eligible)
7. Connectivity: Select the **same VPC** as your EC2 instance
8. **Public access:** No (only allow access from within VPC)
9. VPC Security Group: Create new, or select existing that allows port 5432/3306 from your EC2 security group
10. Click **Create database** → wait ~5-10 minutes
11. Once available, get the **Endpoint** (looks like `mydb.xxxxx.us-east-1.rds.amazonaws.com:3306`)
12. Update your app's `DATABASE_URL` to point to this endpoint, and add your EC2 security group to the RDS security group's inbound rules

> 💡 **vibecoding tip:** Tell AI "I have an AWS RDS PostgreSQL instance at [endpoint], with user [username], help me write connection code and migration scripts for [my project]."

### ElastiCache — Managed Redis/Memcached

In-memory caching for hot data (reducing DB queries), session/token storage, message queues, leaderboards, etc.

- **Alibaba Cloud:** ApsaraDB for Redis
- **Tencent Cloud:** TencentDB for Redis
- **Alternative:** Upstash (Serverless Redis, free tier available)

For small projects you can just run `sudo apt install redis-server` on your VPS; use managed Redis for production/high availability.

## 6.5 Networking: Faster, Safer Access

### CloudFront — CDN (Content Delivery Network) ⭐ Common

Caches your static assets (images, CSS, JS, video) at edge locations worldwide so users get content from the nearest node.

- **Alibaba Cloud:** CDN / DCDN
- **Tencent Cloud:** CDN / EdgeOne
- **Google Cloud:** Cloud CDN
- **Free alternative:** Cloudflare CDN (free plan includes unlimited bandwidth)

**When to use:**
- Sites with images/video/large files
- Users spread across different regions
- Reducing bandwidth costs on your origin server
- Cloudflare Pages essentially = CDN + static hosting

**How to configure CloudFront:**
1. CloudFront console → **Create distribution**
2. Origin domain: select your S3 bucket or your EC2 ALB
3. Default cache behavior: Redirect HTTP to HTTPS
4. Create distribution → wait ~5-15 minutes to deploy
5. Point your domain's DNS to the CloudFront distribution domain name (e.g. `dxxx.cloudfront.net`) via a CNAME record

### ELB (Elastic Load Balancing)

Distributes incoming traffic across multiple EC2 instances, automatically removing unhealthy instances.

- **ALB (Application Load Balancer):** Layer 7 (HTTP/HTTPS), path-based routing, most common for web apps
- **NLB (Network Load Balancer):** Layer 4 (TCP/UDP), ultra-low latency
- **GLB (Gateway Load Balancer):** For network virtual appliances
- **Alibaba Cloud:** SLB / ALB
- **Tencent Cloud:** CLB

Single-server projects don't need this. Use it when you scale to multiple backend servers.

### Route 53 — DNS Service

Translates domain names to IP addresses. Most domain registrars include free DNS, but Route 53 is deeply integrated with AWS.

- **Alibaba Cloud:** Alibaba Cloud DNS
- **Tencent Cloud:** DNSPod
- **Free alternative:** Cloudflare DNS (one of the fastest globally, completely free)

**Common DNS record types:**

| Type | Purpose | Example |
|------|---------|---------|
| **A** | Domain → IPv4 address | `@ → 54.123.45.67` |
| **AAAA** | Domain → IPv6 address | `@ → 2600:xxxx::` |
| **CNAME** | Domain → another domain (used for CDN) | `static → dxxx.cloudfront.net` |
| **MX** | Mail server (needed for business email) | - |
| **TXT** | Arbitrary text (domain verification, SPF/DKIM) | - |

### ACM (AWS Certificate Manager) — Free SSL Certificates

AWS provides free SSL/TLS certificates that auto-renew when used with CloudFront or ALB. Just request a certificate, validate via DNS or email, and attach it to your distribution/load balancer.

- **Alibaba Cloud:** Free SSL Certificates
- **Tencent Cloud:** Free SSL Certificates
- **Universal free option:** Certbot + Let's Encrypt (the method we showed in Section 5, 90-day auto-renewal)

### VPC (Virtual Private Cloud)

An isolated virtual network on AWS where your EC2, RDS, and other resources live. New accounts get a default VPC. Advanced usage (public/private subnet separation, NAT gateways) requires deeper study.

## 6.6 Other Common Services

### Domain Registration

- **Global:** Namecheap, Cloudflare Registrar (free WHOIS privacy), GoDaddy
- **AWS:** Route 53 (also does registration)
- **China:** Alibaba Cloud Wanwang, Tencent Cloud DNSPod (required for ICP filing)

### SES (Simple Email Service) — Sending Emails

Don't run your own mail server (you'll likely end up in spam). Use a professional email service.

- **AWS SES**, SendGrid, Mailgun, Resend
- **China:** Alibaba Cloud Direct Mail, Tencent SES
- Uses: verification emails, notifications, marketing emails

### SNS (Simple Notification Service) — SMS/Push Notifications

For SMS, mobile push notifications. Twilio is the popular global alternative for SMS.

### CloudWatch — Monitoring & Logging

Monitor EC2 CPU/memory/disk, view application logs, set up alerts (high CPU, service down).

- **Alibaba Cloud:** Cloud Monitor + SLS (Log Service)
- **Tencent Cloud:** Cloud Monitor + CLS
- **Beginner alternative:** PM2's built-in monitoring + Uptime Kuma (open-source, one Docker container to run)

### S3 Advanced: Image Processing / Lambda Triggers

S3 can automatically trigger Lambda functions when files are uploaded. For example, when a user uploads a large photo, a Lambda function can resize it into thumbnails automatically. In China, Alibaba OSS has built-in image processing (append `?x-oss-process=image/resize,w_300` to URLs) and Tencent COS has Cloud Infinite (CI) for similar features.

## 6.7 Cloud Service Mapping: AWS ↔ Chinese Clouds ↔ Alternatives

Quick reference for finding equivalent services:

| Category | AWS | Alibaba Cloud | Tencent Cloud | Free/Budget Alternative |
|----------|-----|--------------|---------------|------------------------|
| Cloud Servers | EC2 | ECS | CVM / Lighthouse | DigitalOcean / Vultr / Hetzner |
| Object Storage | S3 | OSS | COS | Cloudflare R2 (zero egress) |
| Relational DB | RDS | RDS | TDSQL-C/CDB | Supabase / Neon |
| Redis Cache | ElastiCache | ApsaraDB Redis | TencentDB Redis | Upstash |
| CDN | CloudFront | CDN/DCDN | CDN/EdgeOne | Cloudflare CDN (free) |
| Load Balancer | ALB/NLB | SLB/ALB | CLB | Nginx self-hosted / Caddy |
| Serverless | Lambda | Function Compute | SCF | Cloudflare Workers |
| Containers/K8s | ECS/EKS | ACK | TKE | Fly.io / Railway |
| DNS | Route 53 | Alibaba Cloud DNS | DNSPod | Cloudflare DNS (free) |
| SSL Certs | ACM (free) | Free certs | Free certs | Let's Encrypt (free) |
| Email | SES | Direct Mail | SES | Resend / SendGrid free tier |
| SMS | SNS | SMS | SMS | Twilio |
| Monitoring | CloudWatch | Cloud Monitor | Cloud Monitor | Uptime Kuma (self-hosted) |
| AI/ML APIs | Bedrock | Tongyi Qianwen/Bailian | Hunyuan/TI | OpenAI / Anthropic API |
| Domain Registration | Route 53 | Wanwang | DNSPod | Namecheap / Cloudflare |

## 6.8 Common Beginner Questions

**Q: Should I use cloud managed services or self-host everything on a VPS?**

- **Personal projects / learning:** Self-host on VPS (Docker Compose everything) — cheaper and you learn more.
- **Production with real users:** Use managed services for databases and object storage (auto-backup, stability), app can stay on VPS.
- **Well-funded/team projects:** Use cloud managed services as much as possible — spend time on business logic, not ops.

**Q: How do I use the AWS Free Tier without getting charged?**

1. Always launch **t2.micro/t3.micro** instances (marked "Free tier eligible")
2. Set up a **Billing Alarm** for $0 or $1 (Billing Dashboard → Budgets → Create budget)
3. **Terminate/delete** resources when done: EC2 instances, RDS databases, S3 buckets, EBS volumes, Elastic IPs
4. Note that EBS volumes and Elastic IPs **continue charging even when the instance is stopped** if not deleted
5. Check the Billing Dashboard monthly

**Q: AWS vs other VPS providers?**

- Learning AWS ecosystem / preparing for cloud jobs → Use AWS Free Tier
- Quick deployment, simple projects, lowest cost → DigitalOcean ($4/mo) or Hetzner (€3.49/mo)
- Hourly testing → Vultr (per-hour billing, destroy anytime)
- AI/GPU workloads → Modal or Lambda Labs
- Completely free, 24/7 container → Fly.io free tier

---

# 7. AI Agent-Specific Deployment Platforms

If you're deploying AI Agents (not just regular web apps), there are platforms specifically designed for AI workloads:

## 7.1 Modal — Serverless GPU for Python AI/ML

**Website:** https://modal.com

**Best for:** Python AI projects needing GPU inference, scheduled jobs, batch data processing

**Features:**
- Define functions with Python decorators, `modal deploy` for one-command deployment
- GPU container cold start ~1 second, billed per millisecond
- Built-in scheduling, secrets management, shared storage
- Free plan includes $30/month credit (enough for most personal projects)
- Only supports Python

```python
import modal
app = modal.App("my-ai-agent")

@app.function(gpu="A10G", timeout=300)
def run_agent(prompt: str):
    # Run your AI model/agent here
    return result
```

## 7.2 Hugging Face Spaces — First Choice for AI Demos

**Website:** https://huggingface.co/spaces

**Best for:** Quickly showcasing AI demos (Gradio/Streamlit UI), open-source model display

**Features:**
- Free small CPU instances; GPU available paid
- Supports Gradio, Streamlit, Docker
- Active community; every Space has public code and discussions
- One-click fork of others' Spaces to modify

## 7.3 Replicate — Turn Models into APIs

**Website:** https://replicate.com

**Best for:** Turning AI models into callable HTTP APIs without managing servers

Push your model, Replicate packages it into an HTTP API, charges per call. Great for publishing fine-tuned models.

## 7.4 Lambda Labs — On-Demand GPU Instances

**Website:** https://lambdalabs.com

**Best for:** GPU-intensive training and inference at lower cost than AWS/GCP GPU instances. A100, H100, A10 available on-demand.

---

# 8. 🎯 Vibecoding Deployment Workflow: Let AI Be Your DevOps

This is the most important mindset for vibecoding-era deployment: **You don't need to memorize every command — AI is your DevOps assistant.**

## 8.1 Two AI Collaboration Modes

**Mode 1: Generate scripts locally, execute manually**

Tell your AI coding assistant (Claude Code, Trae Solo, Cursor):

> "I want to deploy [project description] to [platform/server]. Generate:
> 1. Complete step-by-step deployment checklist
> 2. All needed config files (Nginx, PM2, Dockerfile, docker-compose)
> 3. A deploy.sh deployment script
> 4. Environment variable checklist"

Then just execute what AI generates.

**Mode 2: AI SSHs directly to your server (even easier)**

Claude Code supports remote SSH operations:

```bash
claude
# Tell it:
# "SSH into root@MY-IP and deploy /root/myapp, configure Nginx + HTTPS + PM2"
```

AI will automatically check the environment, install missing dependencies, pull code, build, configure, and verify — all without you typing commands manually.

> ⚠️ **Safety reminders:**
> - Practice on a test server first to confirm AI won't make destructive changes
> - Back up important data regularly
> - Give AI a least-privilege user (don't give root; a sudo user is fine, but watch commands)
> - Before AI runs dangerous commands, review what it's about to do

## 8.2 Universal Deployment Prompt Template

No matter which platform/server you choose, fill this out and send it to AI for a complete actionable plan:

```
Help me deploy a project with the following info:

[DEPLOYMENT TARGET]
- Platform/Server: [Vercel / Railway / Fly.io / Ubuntu 22.04 VPS / AWS EC2 / ...]
- Server IP (if VPS): xxx.xxx.xxx.xxx
- Already configured: [SSH key login / Docker installed / Nginx installed / ...]

[PROJECT INFO]
- Project type: [Next.js 14 / Vite+React / Node.js Express / Python FastAPI / ...]
- Code location: GitHub repo https://github.com/xxx/xxx
- Tech stack: Node.js 20 + PostgreSQL 16 + Redis 7
- Start command: npm run start
- Listens on port: 3000
- Environment variables: DATABASE_URL=xxx, JWT_SECRET=xxx, OPENAI_API_KEY=xxx

[DOMAIN]
- Domain: mydomain.com
- DNS already pointing to server: Yes/No
- Need HTTPS: Yes/No

[REQUIREMENTS]
1. Complete steps (list local vs server operations separately)
2. Provide all config files
3. Tell me how to verify successful deployment
4. List common gotchas and troubleshooting steps
```

## 8.3 AI-Assisted Troubleshooting Workflow

When things break:

1. **Check logs first:**
   - Nginx: `sudo tail -50 /var/log/nginx/error.log`
   - PM2: `pm2 logs myapp`
   - Docker: `docker compose logs app`
   - systemd: `sudo journalctl -u myapp -n 50`

2. **Copy the full error to AI** with context:
   > "Deploying Node.js to Ubuntu, getting 502 Bad Gateway. Nginx error log: [paste]. Config: [paste]. PM2 status: [paste]. Help me debug."

3. **Common issues quick reference:**
   - **502 Bad Gateway:** Backend not running, wrong port, incorrect proxy_pass
   - **Can't access IP:** Security group not allowing port, ufw blocking, Nginx not started
   - **Refresh gives 404:** Nginx missing `try_files` for SPA routing
   - **Static assets 404:** Wrong root path, file permissions
   - **HTTPS cert fails:** Domain not pointing to server, port 80 blocked
   - **PM2 keeps restarting:** Code bug causing crash, check `pm2 logs`
   - **Vercel Function timeout:** Over 10s limit — switch to Fly.io/Railway/VPS for long-running tasks
   - **Railway/Render 503:** Service sleeping or credits exhausted
   - **AWS EC2 connection refused:** Security group missing SSH rule or wrong port

---

# 9. Post-Deployment Tips

## 9.1 File Transfer

```bash
# Local → Server
scp ./file.zip yourname@IP:/home/yourname/
scp -r ./dir yourname@IP:/home/yourname/

# Server → Local
scp yourname@IP:/home/yourname/file.zip ./

# rsync (incremental sync, recommended for deployment)
rsync -avz --exclude=node_modules --exclude=.git ./project/ yourname@IP:/var/www/project/
```

## 9.2 One-Command Update Script

Create `deploy.sh` on your server:

```bash
#!/bin/bash
set -e
cd /path/to/project
git pull origin main
npm install
npm run build
pm2 restart myapp
echo "✅ Deployment complete!"
```

Updates are just `bash deploy.sh`. For full automation, set up GitHub Actions (ask AI to write the CI/CD config) so code pushes to main deploy automatically.

## 9.3 Security Hardening Checklist

Ask AI to generate a complete hardening script, which typically includes:
- Disable password login, use SSH keys only
- Change default SSH port (22 → something else)
- Install fail2ban (auto-ban brute force IPs)
- Enable automatic security updates: `sudo apt install unattended-upgrades`
- Never commit secrets/.env to Git
- Schedule regular database backups to S3

---

# 10. Chapter Summary

**Deployment Options Summary:**

| Scenario | Recommended | Cost | Difficulty |
|----------|------------|------|-----------|
| Pure frontend/docs | Cloudflare Pages / Vercel / GitHub Pages | Free | ⭐ |
| Next.js full-stack (fast response) | Vercel | Free / $20/mo | ⭐ |
| Backend API / Bot (always-on) | Railway / Fly.io (free) / VPS | $0-10/mo | ⭐⭐ |
| Full-stack (full control) | DigitalOcean / Vultr / AWS EC2 + Docker | $4-10/mo | ⭐⭐⭐ |
| AI Agent demos | Hugging Face Spaces | Free | ⭐ |
| AI GPU inference | Modal (global) | $0-30/mo credit | ⭐⭐ |
| Production with users | AWS/Azure/GCP managed services | Varies | ⭐⭐⭐ |

**Remember the 5 core steps:**
1. **Pick a platform** → Based on your project type (use the table above)
2. **Get code there** → git push / rsync / GitHub auto-deploy
3. **Set up environment** → Install Node.js/Nginx/Docker (or platform handles it)
4. **Keep it running** → PM2 / Docker / systemd
5. **Domain + HTTPS** → DNS records + Certbot / ACM

**Vibecoding mindset:**
1. Understand *what* needs to be done, not every command
2. Describe requirements clearly to AI — it gives complete solutions
3. Understand what AI is doing, confirm key steps
4. When errors happen, paste logs to AI — it diagnoses 90% of issues
5. Back up important data, use least privilege

Deploy once and you'll realize — getting online isn't that hard. 🎯

---

<RelatedArticlesSection
  :articles="relatedArticlesMap['en/stage-2/backend/cloud-server-deployment']"
  title="Related Articles"
  description="Continue learning the engineering skills around deployment."
/>
