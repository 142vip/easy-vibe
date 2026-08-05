# An Introduction to CI/CD Automation

::: tip 🎯 Core Question
**Your code runs fine locally, but how do you make it accessible to people around the world?**
:::

---

## 1. Motivation for needing to "Go Live"

Imagine you've cooked a feast at home, and it's delicious. But the problem is, only your family can taste it. Your neighbors, the security guard, strangers — none of them can try it.

What do you do? You need to **bring the food to a restaurant**. That's what "going live" does — it moves the code you wrote from your personal computer to a "public computer" that's always on 24/7. This way, anyone with internet access can visit your website.

<DeploymentOverviewDemo />

Going live involves many steps. Just like opening a restaurant isn't just about serving food — you also need to rent a space, renovate, get permits, hire staff, and so on. The same applies to web development. From code to a website that users can access, there are many steps in between. You need to complete building, deploying, configuring the network, ensuring security, and more.

Below, I'll break down the entire process. Every step will be explained in detail. Even complete beginners with no prior experience will be able to understand.

---

## 2. Building: Turning Code into a "Portable Build Artifact"

### 2.1 Motivation for needing to Build

Beginners often ask: once the code is written, why can't we just put it on a server for users to access?

To answer this question, first understand what format your code is in. You might use frameworks like Vue, React, Express, or Koa. These frameworks share a common characteristic: **they are not meant for direct use by browsers or servers**.

For example, when writing Vue code, don't you use tags like `<template>` and `<script setup>`? Only Vue understands this syntax. Browsers can't make sense of it at all. Browsers only understand three languages: HTML (webpage structure), CSS (webpage styles), and JavaScript (webpage logic). Vue component syntax is like gibberish to browsers — completely incomprehensible.

So before putting the code on a server, there's one important thing you must do: **translate it into a language the browser can understand**. This translation process is called "Build."

### 2.2 What Does Building Actually Do

Building is more than just translation. It also performs many optimizations to make the website run faster and use fewer resources. Let's look at what it specifically does:

**Step 1: Resolve Dependencies**

When writing code, you use various third-party libraries. Like Vue, Vue Router, Axios, Vite, etc. Users can't download these from npm every time — that would be too slow. The build tool analyzes the code, finds all dependencies, and "bundles" them together.

**Step 2: Compile and Transform**

This is the most critical step. It compiles Vue components into HTML and JavaScript. It compiles SASS/LESS into CSS. It converts ES6+ syntax into more compatible ES5 code. After this step, the code goes from "a format developers can read" to "a format machines can execute."

**Step 3: Minification and Obfuscation**

Minification removes all spaces, line breaks, and comments. It renames variables from English words to single letters. For example, `userName` becomes `a`, `calculateTotalPrice` becomes `b`. This dramatically reduces file size, making downloads much faster for users. The obfuscated code is nearly unreadable by humans, which also provides some "code protection."

**Step 4: Code Splitting**

You might have written 10 pages, each with its own code. But a user might only visit one page. Why should they download the code for the other 9 pages? The build tool splits the code into multiple chunks. Users only download the code for the page they visit. This is "lazy loading" and can significantly improve the speed of the first visit.

**Step 5: Generate Hashes**

This is a very important step that many people overlook. After building, file names become something like `app.abc123.js` and `vendor.def456.css`. That alphanumeric string at the end is called a "hash."

The hash works like this: when the code changes in any way, the hash value changes. The browser then knows "this file has changed, I need to re-download it." For unchanged files, the browser continues using the cache without re-downloading. This ensures users always see the latest code while fully utilizing the cache to improve speed.

<DeploymentBuildDemo />

### 2.3 Approach to running a Build

Most modern frontend projects already have build tools configured. Just remember one command:

```bash
# If using npm
npm run build

# If using yarn
yarn build

# If using pnpm
pnpm build
```

After running, look for a `dist` folder in the project root directory (sometimes called `build` or `.output`). It contains all the built files. These are the files that will ultimately be uploaded to the server. No further modifications are needed — just drag them to the server.

### 2.4 What's Inside the Build Output

Open the dist folder and you'll see mainly three types of files:

- **HTML files**: Usually called `index.html`. This is the entry file — the browser loads it first.
- **JS files**: All JavaScript code. There might be one or several.
- **CSS files**: All style code. It might be inline in the HTML or separate CSS files.

For more complex backend projects (like Node.js), the build output might be an executable file or a Docker image. But the principle is the same: turn the code into a form the server can run directly.

---

## 3. Server: Finding a "House" That Never Closes

### 3.1 What Exactly Overview of a Server

Many people think a "server" is some mysterious, high-end device when they first hear about it. It's really not that complicated. **A server is just a computer** — a computer that never shuts down and is always connected to the internet.

You might ask: I already have a computer at home, why would I pay extra to rent a server?

Good question. Let me break it down for you:

First, your home computer can't stay on 24 hours a day. You need to go out, sleep, and occasionally it crashes and restarts. But a server is different — it's specifically built for this purpose. It can run 365 days a year without interruption. The website is always accessible.

Second, your home network isn't good enough either. Home broadband upload speeds are usually slow. And home broadband IPs are dynamic — today it's one IP, tomorrow it might be a different one. It's impossible to use as a website server. Servers use high-speed data center networks with fixed IPs and blazing-fast speeds.

Third, your home computer doesn't have a "public IP." What's a public IP? It's a globally unique address. Only with this address can others find your computer on the internet. Your home computer's IP usually only works within your home network. People outside can't find you at all. A server is different — it has a fixed public IP. People all over the world can find it through this IP.

<DeploymentServerDemo />

### 3.2 Approach to choosing a Server

When choosing a server, look at three main metrics: **CPU cores**, **memory size**, and **disk space**. The higher these three metrics, the better the server performance, and the more expensive it is.

For beginners, there's absolutely no need to buy an expensive configuration. Remember this simple guideline:

- **Personal projects, learning and practice**: 1 core, 2GB memory is sufficient. About a few dozen yuan per month.
- **Small business projects**: 2 cores, 4GB memory. Can handle thousands to tens of thousands of daily visits.
- **Medium projects**: 4 cores, 8GB or higher. Requires a professional operations team.

Another factor to consider: **location**. If your users are mainly in China, buy domestic servers (Alibaba Cloud, Tencent Cloud) for faster access. If users are mainly overseas, buy foreign servers (AWS, Google Cloud, DigitalOcean), or servers in Hong Kong. Fast speed and no ICP filing required.

### 3.3 Domestic or Foreign

This is a very important question. Many people don't think it through at first and run into trouble later.

**Buying domestic servers** means faster speeds and lower latency. The downside is that you need to file for ICP registration (submitting website information to relevant government departments for review). This usually takes one week to one month. And domestic servers are relatively more expensive.

**Buying foreign servers** means no ICP filing is needed. Buy it and use it right away. Prices may also be cheaper. The downside is that users in mainland China may experience slower access. Hong Kong or Singapore data centers are much better in this regard.

The recommendation is: for personal projects and learning/demo websites, buy Hong Kong or overseas servers to skip the ICP filing hassle. For legitimate business projects that need long-term operation, buy domestic servers and file for ICP properly — it will save you a lot of trouble in the long run.

### 3.4 Major Cloud Providers Comparison

| Provider | Best For | Features | New User Price |
|----------|----------|----------|---------------|
| Alibaba Cloud | Domestic business | Largest market share, comprehensive ecosystem | Dozens to over 100 yuan for the first year |
| Tencent Cloud | Mini-programs, gaming | Good cloud development support for mini-programs | Large first-year discounts |
| Huawei Cloud | Enterprise users | Preferred for government and政务 projects | Relatively expensive |
| DigitalOcean | Developers | Simple to use, transparent pricing | From $4/month |
| Vercel | Frontend projects | Zero configuration, push to deploy | Free tier is sufficient |

For beginners, the most recommended options are **Alibaba Cloud** or **Tencent Cloud** student/new user discounts. Usually only a few dozen yuan per year. Excellent value. If you're working on a pure frontend project and want to keep things simple, you can also use **Vercel** or **Netlify** directly. No need to buy a server at all — just push the code and it deploys automatically.

### 3.5 What to Do After Getting a Server

After purchasing a server, you'll receive an email containing several important pieces of information:

- **IP Address**: A string of numbers like `123.45.67.89`. This is the server's address on the internet.
- **Login Username**: Usually `root` (administrator account).
- **Login Password**: Initial password, or a link to set your password.

With this information, you can use **SSH (Secure Shell)** to remotely log into the server and configure it. SSH is like sending an encrypted remote control command to the server, allowing you to operate a server that's far away right from your own computer.

The login command looks like this:

```bash
ssh root@123.45.67.89
# Press Enter and you'll be prompted for the password. Enter the correct password and you're logged in.
```

After logging in successfully, you'll enter the server's command-line interface. It looks similar to opening a terminal window on your own computer. You can install software, create folders, and modify configurations here. Everything works just like on a local computer.

---

## 4. Deployment: Moving Code into the "House"

### 4.1 Overview of Deployment

Deployment is like renting a server (the house) and then moving your code (the furniture) in, opening the door, and starting business.

Specifically, deployment includes the following steps:

1. **Upload code to the server**: Transfer the build output from your local computer to the server.
2. **Install dependencies**: The server might not have the packages the project needs. They need to be installed.
3. **Configure environment variables**: Sensitive information like database passwords and API keys.
4. **Start the service**: Get the application running and start listening for user requests.

These four steps sound complicated, but they're not that hard in practice. Below, I'll walk you through each step in detail.

<DeploymentServerDemo />

### 4.2 Approach to Uploading Code to the Server

**Method 1: FTP/SFTP Upload**

This is the most intuitive method. It's like using cloud storage — drag files to the server. You can download a free program called **FileZilla** on your computer. Enter the server's IP, username, and password, and you can manage server files just like managing local files.

**Method 2: Git Pull**

This is the recommended method. First, create a code repository on GitHub, GitLab, or Gitee. Push the code to the cloud. Then use the `git clone` command on the server to pull the code down.

The benefit is: for subsequent code updates, you just need to run `git pull` on the server. No need to manually upload every time. And the code is safely stored in the cloud — even if the server is reinstalled, it's fine.

**Method 3: CI/CD Automatic Deployment**

This is the most professional method and the one I strongly recommend. By configuring CI/CD (Continuous Integration/Continuous Deployment), you only need to push code to GitHub. The CI/CD system automatically handles the entire process: pulling code → installing dependencies → building → deploying. You don't even need to log into the server. Everything is done automatically.

### 4.3 Specific Deployment Steps

Let's demonstrate the entire process using the simplest method — manual Git deployment:

**Step 1: Connect to the Server**

```bash
ssh root@123.45.67.89
```

**Step 2: Install Necessary Software**

For a Node.js project, you need to install Node.js first:

```bash
# Using Ubuntu system as an example
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

**Step 3: Pull the Code**

```bash
# Create a directory for the website
mkdir -p /var/www/my-website
cd /var/www/my-website

# Clone the code repository (need to create the repository on GitHub first)
git clone https://github.com/your-username/your-repo-name.git .
```

**Step 4: Install Dependencies and Build**

```bash
# Install project dependencies
npm install

# Build the project (generates the dist directory)
npm run build
```

**Step 5: Start the Service with PM2**

Why use PM2? It's a process management tool that keeps the website running in the background. Even if the server restarts, it can automatically start up again.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the website (assuming the entry file is index.js)
pm2 start index.js

# Set up auto-start on boot
pm2 startup
pm2 save
```

**Step 6: Configure Nginx Reverse Proxy**

Node.js applications typically run on ports like 3000 or 8080. But users access port 80 (HTTP default port). You need Nginx to forward requests from port 80 to the application port.

```bash
# Install Nginx
sudo apt install -y nginx

# Create an Nginx configuration file
sudo nano /etc/nginx/sites-available/my-website
```

In the editor that opens, write the following configuration:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    # Static files (build output) returned directly
    location / {
        root /var/www/my-website/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API requests forwarded to Node.js backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

After saving and exiting, enable this configuration:

```bash
# Enable the configuration
sudo ln -s /etc/nginx/sites-available/my-website /etc/nginx/sites-enabled/

# Test the configuration for errors
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

Now visit `http://example.com` (remember to point the domain to this server's IP first), and you should see the website!

---

## 5. Domain Name and DNS: Giving Your Website a Good Name

### 5.1 Motivation for buying a Domain Name

With a server IP, why do you still need to buy a domain name?

Think about it. Memorizing a string of numbers like `123.45.67.89` — isn't that difficult? Isn't it easy to mistype? But remembering names like `baidu.com` or `taobao.com` is much easier, right?

A domain name is your website's name. It's memorable, professional, and can reflect your brand image. Imagine telling someone "visit my website, the IP is 123.45.67.89" versus "visit imcool.com" — which one sounds more legit?

<DeploymentDnsDemo />

### 5.2 Overview of DNS

Okay. Now you've bought a domain name, say `my-awesome-website.com`. But here's the problem: computers only understand IP addresses, not human language like "my-awesome-website.com."

This is where DNS comes in. DNS stands for "Domain Name System." You can think of it as a giant "phonebook" specifically responsible for translating human-friendly domain names into IP addresses that computers can understand.

When you type `my-awesome-website.com` in your browser and press Enter, here's what happens behind the scenes:

1. The browser asks DNS: "Hey, what's the IP address for my-awesome-website.com?"
2. DNS checks the "phonebook" and tells the browser: "Its IP is 123.45.67.89"
3. The browser uses this IP address to find the server and sends the request

The whole process usually takes only tens of milliseconds. Users don't notice it at all.

### 5.3 Approach to configuring DNS

DNS configuration can usually be done in two places:

**Method 1: Configure at the Domain Registrar**

Configure DNS records wherever you bought the domain. The most common record type is the **A Record**:

- **Record Type**: A
- **Host Record**: Usually `@` (representing the domain itself, e.g., my-awesome-website.com) or `www` (representing www.my-awesome-website.com)
- **Record Value**: Server IP address, e.g., `123.45.67.89`

**Method 2: Use a Third-Party DNS Service**

Many professionals don't use the domain registrar's built-in DNS. Instead, they use specialized DNS providers like Cloudflare, Alibaba Cloud DNSPod, or Tencent Cloud DNS. These services are usually more stable, have faster resolution speeds, and come with value-added features like CDN and DDoS protection.

### 5.4 Method for Longing Does DNS Take to Propagate

This is a question many people ask. The answer is: **it varies. Usually from a few minutes to 24 hours.**

After modifying DNS, all DNS servers worldwide need to sync this change. It's like throwing a stone into the ocean — the ripples take time to reach distant shores. Some DNS servers update quickly, taking effect in minutes. Others are slower and may take a long time.

You can use the following commands to check if DNS has propagated:

```bash
# Windows
ping your-domain.com

# Mac/Linux
ping your-domain.com
```

If the ping succeeds and shows the server's IP, DNS has propagated.

---

## 6. HTTPS: Installing a "Lock" on Your Website

### 6.1 The Difference Between HTTP and HTTPS

You may have noticed that some website addresses start with `http://` and others with `https://`. That "s" is important — it stands for "Secure."

**HTTP (HyperText Transfer Protocol)** is the protocol used to transmit web pages. Think of it as a truck that transports data. But this truck is **transparent** — everything inside is visible to everyone. Passwords and personal information entered on an HTTP website can potentially be intercepted by anyone in the middle during transmission.

**HTTPS (HTTP Secure)** adds a **sealed container** to this truck, along with a key. Only the sender and receiver have the key. Even if someone in the middle intercepts it, they can't understand what's inside. This is encrypted transmission.

<DeploymentHttpsDemo />

### 6.2 Motivation for HTTPSing

First reason: **Security**. Without HTTPS, passwords users enter on the website are transmitted in plain text. Anyone with a bit of technical skill can intercept them. These days, who would dare use a website without HTTPS?

Second reason: **Browser Warnings**. Modern browsers like Chrome and Edge now display "Not Secure" warnings for websites without HTTPS. Users see the warning icon and leave immediately — let alone register or make payments.

Third reason: **SEO**. Search engines like Google and Baidu prioritize indexing HTTPS websites. Your SEO results will be better.

### 6.3 Approach to getting an HTTPS Certificate

In the past, HTTPS certificates were expensive, costing hundreds or even thousands of yuan per year. Now there's an organization called **Let's Encrypt** that provides completely free SSL/TLS certificates. And the community has many automated tools to help you install and renew them.

**Method 1: Using Certbot (Recommended)**

Certbot is a tool that automatically applies for and configures Let's Encrypt certificates. It's very simple:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# One-click certificate application and Nginx configuration
sudo certbot --nginx -d example.com -d www.example.com
```

During the process, you'll be asked a few questions, like your email (for certificate expiry reminders). After answering, the certificate is automatically configured. Visit the website and you'll see a small lock icon in the address bar.

The certificate is valid for 90 days, but Certbot will set up an automatic renewal cron job. You basically don't need to worry about it.

**Method 2: Using Cloudflare**

If you use Cloudflare's DNS service, you don't need to configure HTTPS certificates at all. Cloudflare automatically provides HTTPS support for your domain. It even takes care of the 90-day renewal for you.

### 6.4 What Changes After Configuring HTTPS

After configuring HTTPS, user access changes from `http://example.com` to `https://example.com`. This change brings a series of security guarantees:

1. **Encrypted Transmission**: All communication between users and the server is encrypted.
2. **Identity Verification**: The certificate can prove "I really am this website," preventing phishing sites.
3. **Data Integrity**: It can detect whether data has been tampered with.

---

## 7. CI/CD: Letting Robots Do the Work

### 7.1 Overview of CI/CD

CI/CD is an abbreviation of two terms: **C**ontinuous **I**ntegration and **C**ontinuous **D**eployment. You can think of it as a robotic system that does the work for you automatically.

Without CI/CD, every time you want to release a new feature, the process looks like this:

1. Open your computer, log into GitHub
2. Pull the latest code
3. Run tests to check for bugs
4. Manually build the project
5. Log into the server
6. Pull the latest code
7. Install dependencies
8. Build the project
9. Restart the service

These 9 steps need to be done manually every time you release. Annoying, right? And it's easy to miss a step, like forgetting to run tests or forgetting to restart the service.

With CI/CD, the process becomes:

1. Push code to GitHub
2. Have some tea and wait
3. (The robot automatically completes the 9 steps above)
4. The website is automatically updated

<DeploymentCicdDemo />

That's the charm of CI/CD: **just push the code, and everything else is done automatically.**

### 7.2 How CI/CD Works

A typical CI/CD process looks like this:

**Step 1: Code Push**

You've finished developing a new feature. Push the code to GitHub.

**Step 2: CI (Continuous Integration) Triggered**

GitHub detects the code change and notifies the CI system (GitHub Actions, GitLab CI, etc.) to start working.

**Step 3: Install Dependencies and Test**

The CI system launches a virtual machine and on it:
- Installs all the dependencies the project needs
- Runs test code to ensure there are no bugs
- Builds the project to generate the output

If tests fail, CI sends an email notification. This deployment stops. Problematic code won't be deployed to the production environment.

**Step 4: CD (Continuous Deployment) Executed**

After all tests pass, the CI system:
- Connects to the server via SSH
- Pulls the latest code
- Installs dependencies
- Builds the project
- Restarts the service

The whole process might take only a few minutes. All automatic.

### 7.3 Approach to configuring GitHub Actions

GitHub Actions is GitHub's built-in CI/CD feature. No extra cost (the free tier is sufficient for personal projects). And it's very simple to configure.

Create a `.github/workflows/deploy.yml` file in the project root directory and write the following configuration:

```yaml
name: Deploy to Production

# Trigger condition: whenever code is pushed to the main branch
on:
  push:
    branches: [main]

# Job list
jobs:
  # Deploy job
  deploy:
    # What system to run on
    runs-on: ubuntu-latest

    # Specific steps
    steps:
      # 1. Check out code
      - name: Checkout code
        uses: actions/checkout@v3

      # 2. Set up Node.js environment
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      # 3. Install dependencies and build
      - name: Install and Build
        run: |
          npm ci
          npm run build

      # 4. Deploy to server
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/my-website
            git pull origin main
            npm install
            npm run build
            pm2 restart all
```

This configuration file tells GitHub Actions:

- Trigger when there's new code on the main branch
- Execute tasks on an Ubuntu machine
- First install Node.js 18
- Then install dependencies and build the project
- Finally connect to the server via SSH and execute a series of deployment commands

After configuring this, every time you `git push origin main`, GitHub will automatically start the deployment. Very convenient.

---

## 8. Monitoring and Logging: Being the "Night Watchman" for Your Website

### 8.1 Motivation for monitoring

After a website goes live, it should theoretically run 24/7 without interruption. But the real world isn't that perfect. Servers can go down. Networks can hiccup. Code can have bugs. In a real production environment, all kinds of unexpected things can happen.

Without monitoring, you can only wait for users to call and tell you "the website won't open." By then, it's often too late. Users may have already left.

With monitoring, you can:

- **Detect problems early**: CPU usage at 90%? Add servers in advance.
- **Quickly locate problems**: Website slow? Check monitoring to find the bottleneck.
- **Know what's happening**: How many visitors per day, when is traffic highest.

<DeploymentMonitorDemo />

### 8.2 What Metrics to Monitor

The most important monitoring metrics are these:

| Metric | Normal Range | What to Do If Exceeded |
|--------|-------------|----------------------|
| CPU Usage | < 70% | Upgrade server or optimize code |
| Memory Usage | < 80% | Check for memory leaks |
| Disk Usage | < 80% | Clean up logs or unnecessary files |
| Website Availability | 100% | Check if the service is running properly |
| Response Time | < 2 seconds | Optimize database queries or add caching |
| Error Rate | < 1% | Check error logs to locate the problem |

### 8.3 Approach to configuring Monitoring

**Simplest Solution: Uptime Robot**

Register at uptimerobot.com. Add your website URL. It will automatically check every 5 minutes whether your website is working. If the site goes down, it sends you an email notification. The free version can monitor 50 websites — more than enough for personal projects.

**Intermediate Solution: Alibaba Cloud/Tencent Cloud Monitoring**

If your server is on Alibaba Cloud or Tencent Cloud, they have built-in monitoring. Just configure threshold alerts.

**Professional Solution: Prometheus + Grafana**

These two are the "Swiss Army Knife" of the monitoring world. Very powerful. They can monitor any metric you can think of and create beautiful visualizations. But the configuration is relatively complex. Suitable for experienced developers.

### 8.4 Logs: Approach to Investigating Problems

Monitoring tells you "the website has a problem." But what exactly the problem is and why it happened — you need **logs** to figure that out.

Logs are the "diary" of the program. They record everything that happens during the program's execution:

- Which user accessed which page at what time
- How long a database query took
- Whether there were errors and what the error messages were

**Basic Log Usage**

View application logs on the server:

```bash
# View PM2 logs
pm2 logs

# View Nginx access logs
tail -f /var/log/nginx/access.log

# View Nginx error logs
tail -f /var/log/nginx/error.log
```

**Advanced Log Solutions**

For more complex projects, professional log collection tools are recommended:

- **Loki**: Free and open source. From the same team as Prometheus.
- **ELK (Elasticsearch + Logstash + Kibana)**: Powerful but complex to configure.
- **Sentry**: A tool specifically for collecting application errors. Automatically collects error information.

### 8.5 Alerts: Approach to knowing About Problems Immediately

Monitoring tells you there's a problem. But what if you're not staring at the monitoring dashboard? This is where **alerts** come in.

Alerts automatically notify you via SMS, WeChat, DingTalk, email, etc. when the monitoring system detects an anomaly. You can set different alert levels:

- **Critical (website completely down)**: SMS + phone call. Must know immediately.
- **Severe (error rate spike)**: DingTalk/WeChat message. Handle when seen.
- **Normal (CPU slightly high)**: Email summary. Check once a day.

The core principle of alert configuration is: **tiered alerts, don't annoy yourself to death.** If every little thing sends you an SMS, you'll turn off alerts before long.

---

## 9. Common Issues Quick Reference

| Symptom | Possible Cause | Solution |
|---------|---------------|----------|
| Website won't open | Domain not resolved / Server down / Nginx not started | `ping domain` to check connectivity; `pm2 list` to check service status; `systemctl status nginx` for Nginx |
| Blank page | Build output path incorrect / Static files not properly configured | Check Nginx root path points to dist directory |
| 404 Page Not Found | Routes not properly configured / Path typo | Add `try_files $uri $uri/ /index.html` in Nginx config |
| 502 Bad Gateway | Backend service down / Port not open | `pm2 list` to check if process is running; verify port is correct |
| 403 Forbidden | Incorrect permissions / Index directory not enabled | Check file permissions `chmod -R 755`; Add `autoindex on` to Nginx config |
| HTTPS certificate expired | Certificate not renewed | `certbot renew` for manual renewal; check auto-renewal cron job |
| No changes visible after update | Browser cache / CDN cache | Ctrl+Shift+R for hard refresh; Go to CDN console and "purge cache" |
| Website loads slowly | Insufficient bandwidth / No caching / No CDN | Upgrade server bandwidth; Configure Redis caching; Connect CDN |
| Database connection fails | Database not started / Wrong password / Permission issues | Check database service status; Verify connection info in config |

---

## Summary

Going live with a service is a systematic engineering effort. It involves everything from code building to server deployment, from network configuration to security protection, from monitoring and alerting to log analysis. For beginners, there's no need to pursue perfection from the start. First get the minimum viable version (MVP) running, then gradually improve on that foundation.

The key points of the entire process can be summarized as follows:

### Core Process

1. **Build** → Use `npm run build` to turn code into HTML/CSS/JS the browser can understand
2. **Deploy** → Upload build output to the server. Configure Nginx reverse proxy.
3. **Domain** → Purchase a domain and configure DNS resolution to the server IP
4. **HTTPS** → Use Let's Encrypt to apply for a free certificate. Protect data transmission security.
5. **CI/CD** → Configure automated deployment. Code goes live automatically after push.
6. **Monitoring** → Configure monitoring and alerts. Know about problems immediately.

### Learning Path Suggestions

- **Day 1**: Deploy a static webpage with Vercel/Netlify. Experience the feeling of "code becoming a website."
- **Week 1**: Rent a cloud server. Manually deploy a Node.js project. Configure domain and HTTPS.
- **Weeks 2-4**: Configure a complete CI/CD pipeline. Establish monitoring and alerting systems.
- **Ongoing**: Learn Docker containerization, Kubernetes clusters, and microservice architecture.

---

## Glossary

| Term | English | Plain Language Explanation |
|------|---------|--------------------------|
| Build | Build | Translate and package source code into a format the browser can execute |
| Deploy | Deploy | Put code on a server so users can access it |
| Server | Server | A computer that's always on 24/7 and connected to the internet |
| Domain Name | Domain | A memorable name for a website (like baidu.com) |
| DNS | Domain Name System | The "phonebook" that translates domain names into IP addresses |
| HTTP | HyperText Transfer Protocol | Web page transmission protocol (insecure, plain text) |
| HTTPS | HTTP Secure | Encrypted web page transmission protocol (secure) |
| Nginx | Engine X | High-performance web server. Used as a reverse proxy. |
| Reverse Proxy | Reverse Proxy | A "receptionist at the door" that forwards requests to the backend. |
| SSH | Secure Shell | An encrypted tool for remotely logging into servers |
| CDN | Content Delivery Network | A globally distributed server network. Speeds up access. |
| CI/CD | Continuous Integration/Deployment | An automated pipeline. Code is automatically tested and deployed after push. |
| SSL/TLS | Secure Sockets Layer / Transport Layer Security | Encryption protocol. Provides security for HTTPS. |
| PM2 | Process Manager 2 | Node.js process manager. Keeps applications running. |
