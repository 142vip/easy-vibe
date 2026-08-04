<script setup>
import RelatedArticlesSection from '../../../../.vitepress/theme/components/RelatedArticlesSection.vue'
import { relatedArticlesMap } from '../../../../.vitepress/theme/data/relatedArticles'
</script>

# 云服务器部署：把本地项目发布到公网

在 [上一章](./../zeabur-deployment/) 我们讲了用 Zeabur/Vercel/CloudBase 这类 **PaaS 平台**一键部署——它足够简单，适合快速上线演示项目。但当你需要更灵活的控制（比如自定义运行环境、部署特殊服务、长期跑脚本、配置反向代理、节省成本），**买一台自己的云服务器（VPS）** 仍然是 vibecoding 开发者的必备技能。

这一章我们聚焦一个目标：**借助 AI 的帮助，把本地跑通的项目完整部署到一台云服务器上，让公网用户能通过域名访问它**。你不需要成为运维专家，只需要理解核心流程，把具体命令交给 Claude Code、Trae Solo 或其他 CLI Agent 去执行。

---

# 1. 为什么需要自己的云服务器？

先对比一下两种部署方式：

| 维度 | PaaS 平台（Zeabur/Vercel） | 自己买云服务器（VPS） |
|------|--------------------------|----------------------|
| **上手难度** | ⭐ 极低，连仓库即部署 | ⭐⭐⭐ 需要懂基础 Linux |
| **灵活性** | 有限，只能跑平台支持的服务 | 完全控制，可以跑任何东西 |
| **成本** | 免费额度够个人用；超出后贵 | 入门款约 30-100 元/月，长期更划算 |
| **适合场景** | 前端静态站、标准 Web 应用 | 定制化服务、长时间运行的脚本、私有项目、AI Agent 常驻、学习运维 |
| **运维负担** | 平台托管，无需操心 | 需要自己管理，但 AI 可以帮你 |

**什么时候需要自己买服务器？**

- 你想部署一个 24 小时在线的 AI Agent / 爬虫 / 自动化脚本
- 你的项目需要自定义配置（特殊的数据库版本、自建对象存储、WebSocket 长连接）
- 项目需要长期运行，算下来 PaaS 付费方案比服务器更贵
- 想真正理解「网站是怎么跑起来的」，建立工程直觉
- 国内访问要求备案、需要国内节点

> 💡 **vibecoding 时代的新变化**：过去部署服务器是后端工程师的「专属技能」，现在你只需要能描述清楚「我要做什么」，AI 可以帮你写出所有需要的命令和配置文件。你要做的是**理解流程、判断对错、必要时人工介入**。

---

# 2. 准备工作：买服务器 & 首次连接

## 2.1 选购云服务器

主流云厂商都有入门款，选择你顺手的即可：

| 厂商 | 入门产品 | 适合人群 | 备注 |
|------|---------|---------|------|
| **阿里云** | ECS 突发性能实例 t6 | 国内用户，需要备案 | 新用户常有低价活动 |
| **腾讯云** | 轻量应用服务器 | 新手友好 | 自带应用镜像，开箱即用 |
| **华为云** | HECS 耀云服务器 | 企业/对稳定性要求高 | - |
| **AWS** | EC2 / Lightsail | 海外项目、全球化业务 | 免费套餐可用 1 年 |
| **Vultr / DigitalOcean / Hetzner** | 常规 VPS | 海外节点，价格透明 | 按小时计费，随时销毁 |
| **雨云 / RackNerd** | 低价 VPS | 练手、非核心项目 | 性价比极高，年付几十元 |

**新手选购建议：**
- **地域**：面向国内用户选国内节点（需备案）；面向海外或不想备案选香港/新加坡/日本节点
- **配置**：1 核 2G 内存起步足够跑 Node.js/Python 项目+MySQL/Redis；如果要跑 AI 模型需要 GPU
- **系统**：**Ubuntu 22.04 LTS** 是最稳妥的选择（AI 训练数据最多，遇到问题最容易搜到答案）
- **带宽**：3-5 Mbps 足够个人项目起步
- **时长**：新用户优惠可以买 1 年；先买 1 个月试水也行

购买完成后，你会拿到：
- **公网 IP 地址**（比如 `123.45.67.89`）
- **登录用户名**（Ubuntu 默认是 `root` 或 `ubuntu`）
- **登录密码** 或 **SSH 密钥**（强烈推荐用密钥）

## 2.2 第一次 SSH 连接服务器

买好服务器后，第一步是从本地电脑通过 SSH 连接上去。

**如果你用 macOS / Linux：** 直接打开终端，输入：

```bash
ssh root@你的服务器IP
# 例如：ssh root@123.45.67.89
```

**如果你用 Windows：** 推荐用 Windows Terminal + 内置 OpenSSH，或使用 PowerToys 终端；也可以用 Xshell、FinalShell 等图形化工具。

第一次连接会提示：

```
The authenticity of host '123.45.67.89 (123.45.67.89)' can't be established.
ED25519 key fingerprint is SHA256:xxxxxx.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

输入 `yes` 回车，然后输入密码（或自动使用密钥）。看到类似这样的提示符，就说明登录成功了：

```
Welcome to Ubuntu 22.04.3 LTS!
root@your-server:~#
```

> 🎯 **AI 辅助提示**：如果你连不上服务器，直接把报错信息复制给 Claude Code 或 Trae Solo：「我 ssh root@xxx 连接不上，报错是 xxx，帮我排查」。AI 会从网络、安全组、防火墙、密钥权限等角度一步步帮你找原因。

## 2.3 配置安全组（非常重要！）

云厂商默认会关闭大部分端口，你需要在**控制台的「安全组」/「防火墙」**里放行你需要的端口：

| 端口 | 用途 | 建议 |
|------|------|------|
| **22** | SSH 登录 | 必开，建议限制为自己的 IP |
| **80** | HTTP 访问 | 开，用于网页访问 |
| **443** | HTTPS 访问 | 开，用于加密网页访问 |
| **3000-3999** | Node.js 开发端口 | 调试时临时开，部署完关闭 |
| **8080** | 常见备用端口 | 按需 |

> ⚠️ 安全组是云厂商层面的防火墙，和服务器内部的 `ufw`/`iptables` 是两层。两者都需要放行才能访问。**新手最常见的坑就是程序跑起来了但访问不到，90% 是安全组没开端口。**

---

# 3. 服务器基础环境配置

登录服务器后，第一件事是更新系统并安装基础工具。你可以**直接把下面这段话复制给你的 AI 编程助手**，让它帮你判断需要装什么：

> 「我刚买了一台 Ubuntu 22.04 的云服务器，打算部署一个 Node.js + PostgreSQL 的 Web 应用，帮我写出完整的初始化命令，包括：更新系统、创建非 root 用户、配置 SSH 密钥登录、安装 Node.js 20、安装 Nginx、安装 PostgreSQL、配置基础防火墙 ufw。」

下面是一个典型的初始化流程，供你参考理解。

## 3.1 更新系统 & 安装基础工具

```bash
# 更新软件包列表
apt update && apt upgrade -y

# 安装常用工具
apt install -y curl wget git vim ufw build-essential
```

## 3.2 创建普通用户（安全最佳实践）

不要一直用 `root` 用户操作，创建一个普通用户并赋予 sudo 权限：

```bash
# 创建用户（替换 yourname 为你喜欢的名字）
adduser yourname

# 加入 sudo 组
usermod -aG sudo yourname

# 测试切换到新用户
su - yourname
```

## 3.3 安装 Node.js（推荐用 nvm）

**不要直接 `apt install nodejs`**，那样装的版本通常很旧。用 nvm 管理版本：

```bash
# 安装 nvm（以最新版为准，可以让 AI 帮你找最新安装命令）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 重新加载 shell 配置
source ~/.bashrc

# 安装 Node.js 20 LTS
nvm install 20

# 验证
node -v  # v20.x.x
npm -v
```

## 3.4 安装 Nginx（Web 服务器/反向代理）

```bash
apt install -y nginx

# 启动 Nginx 并设置开机自启
systemctl start nginx
systemctl enable nginx

# 验证：浏览器访问 http://你的服务器IP，应该看到 Nginx 欢迎页
```

## 3.5 配置基础防火墙 ufw

```bash
# 允许 SSH
ufw allow ssh

# 允许 HTTP 和 HTTPS
ufw allow http
ufw allow https

# 启用防火墙
ufw enable

# 查看状态
ufw status
```

---

# 4. 三种常见部署场景

配置好基础环境后，我们来看三种典型的部署方式，从简单到复杂。

## 4.1 场景一：部署纯前端静态站点（Vite/React/Vue 构建产物）

这是最简单的情况。比如你本地用 Vite 写了一个前端项目，`npm run build` 后会生成一个 `dist/` 目录，里面是纯 HTML/CSS/JS 文件。

**本地操作：把代码传到服务器**

最直接的方式是用 `scp` 或 `rsync`：

```bash
# 在本地电脑执行（不是服务器上！）
# 把 dist 目录传到服务器的 /var/www/myapp 目录
rsync -avz ./dist/ yourname@你的服务器IP:/var/www/myapp/
```

或者先把代码推到 GitHub，再在服务器上 `git clone`：

```bash
# 在服务器上执行
cd /var/www
git clone https://github.com/你的用户名/你的仓库.git myapp
cd myapp
npm install
npm run build
# 构建产物在 dist/ 目录
```

**配置 Nginx 托管静态文件：**

```bash
# 创建 Nginx 配置文件
sudo vim /etc/nginx/sites-available/myapp
```

写入以下内容（路径按你的实际情况修改）：

```nginx
server {
    listen 80;
    server_name 你的服务器IP;  # 后续换成域名

    root /var/www/myapp/dist;
    index index.html;

    # 前端路由（React/Vue Router 的 history 模式需要）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

启用配置并重载 Nginx：

```bash
# 创建软链接启用站点
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/

# 测试配置是否正确
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

现在浏览器访问 `http://你的服务器IP`，应该能看到你的网站了！

## 4.2 场景二：部署 Node.js 后端服务（Express/Koa/Fastify/NestJS）

Node.js 后端需要持续运行在服务器上，监听某个端口（比如 3000）。关键问题是：**如何让它在后台持续运行，即使关闭 SSH 也不停止？崩溃了能自动重启？**

**方案一：用 PM2（最常用，新手推荐）**

```bash
# 全局安装 PM2
npm install -g pm2

# 进入项目目录
cd /path/to/your/nodejs-app

# 安装依赖
npm install

# 构建（如果是 TypeScript 项目）
npm run build

# 启动应用（假设入口是 dist/main.js 或 app.js）
pm2 start dist/main.js --name "myapp"

# 查看运行状态
pm2 status
pm2 logs myapp

# 设置开机自启
pm2 startup
pm2 save
```

**方案二：用 systemd（更底层，推荐生产环境）**

创建服务文件：

```bash
sudo vim /etc/systemd/system/myapp.service
```

写入：

```ini
[Unit]
Description=My Node.js App
After=network.target

[Service]
Type=simple
User=yourname
WorkingDirectory=/path/to/your/nodejs-app
ExecStart=/usr/bin/node dist/main.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000
# 如果有 .env 文件
EnvironmentFile=/path/to/your/nodejs-app/.env

[Install]
WantedBy=multi-user.target
```

启动并设置自启：

```bash
sudo systemctl daemon-reload
sudo systemctl start myapp
sudo systemctl enable myapp
sudo systemctl status myapp
```

**用 Nginx 反向代理到 Node 服务：**

后端服务跑在 `localhost:3000`，我们让 Nginx 监听 80 端口，把请求转发过去：

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
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 4.3 场景三：前后端一起部署（全栈应用）

对于前后端分离的全栈项目（比如前端 React + 后端 Express + 数据库 PostgreSQL），典型的架构是：

```
                    ┌─────────────────────┐
   用户请求 ──────►  │   Nginx (80/443)    │
                    │  反向代理 + 静态托管  │
                    └─────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼                               ▼
   ┌─────────────────────┐       ┌─────────────────────┐
   │ 前端静态文件          │       │ 后端 API 服务        │
   │ /var/www/frontend   │       │ localhost:3000 (PM2) │
   └─────────────────────┘       └──────────┬──────────┘
                                            │
                                            ▼
                                 ┌─────────────────────┐
                                 │ 数据库 PostgreSQL    │
                                 │ localhost:5432      │
                                 └─────────────────────┘
```

一份完整的 Nginx 配置示例：

```nginx
# 前端（主域名）
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 后端 API（子域名）
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

> 💡 **AI 辅助提示**：把你的项目结构（比如「前端是 Next.js 14 App Router，后端是 NestJS，数据库用 PostgreSQL，还有一个 Redis 做缓存」）告诉 AI，让它帮你生成一份完整的 Nginx 配置 + PM2 配置 + 环境变量建议。

---

# 5. 域名 & HTTPS（让网站更专业）

## 5.1 购买域名 & 解析

在阿里云/腾讯云/Namecheap/Cloudflare 等平台购买一个域名（通常几十元/年），然后在域名控制台添加 **A 记录**，把域名指向你的服务器 IP：

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| A | @ | 你的服务器IP（yourdomain.com） |
| A | www | 你的服务器IP（www.yourdomain.com） |
| A | api | 你的服务器IP（api.yourdomain.com） |

DNS 解析生效通常需要几分钟到几小时。可以用 `ping yourdomain.com` 验证是否解析成功。

## 5.2 一键配置 HTTPS（Let's Encrypt）

有了域名后，用 Certbot 一键申请免费的 SSL 证书并自动配置 Nginx：

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 自动为 Nginx 配置 HTTPS（会自动修改配置文件）
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# 按照提示操作，会问你是否要把 HTTP 自动跳转到 HTTPS，选 2（Redirect）即可

# 测试自动续期（证书 90 天有效，certbot 会自动续期）
sudo certbot renew --dry-run
```

配置完成后，访问 `https://yourdomain.com` 就可以看到小锁标志了！

---

# 6. 用 Docker 一键部署（进阶推荐）

如果你不想在服务器上直接装 Node.js/Nginx/数据库等各种环境，**Docker** 是更好的选择——它把你的应用和所有依赖打包在一个「容器」里，在任何装了 Docker 的机器上都能一键运行。

## 6.1 安装 Docker

```bash
# 一键安装 Docker（官方脚本）
curl -fsSL https://get.docker.com | sh

# 把当前用户加入 docker 组（免 sudo）
sudo usermod -aG docker yourname
# 重新登录后生效

# 验证
docker --version
docker compose version
```

## 6.2 写一个 Dockerfile

在项目根目录创建 `Dockerfile`，告诉 Docker 如何构建你的应用镜像。可以直接让 AI 帮你写：

> 「我的项目是 Node.js 20 + Express + PostgreSQL，入口是 src/app.js，帮我写一个适合生产环境的 Dockerfile 和 .dockerignore」

一个典型的 Node.js 项目 Dockerfile：

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production=false
COPY . .
RUN npm run build

# 运行阶段
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## 6.3 用 docker-compose 编排多个服务

对于需要同时跑前端+后端+数据库的全栈项目，用 `docker-compose.yml` 可以一键启动所有服务：

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: always

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: password
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
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - app
    restart: always

volumes:
  postgres_data:
```

启动所有服务：

```bash
docker compose up -d    # 后台启动
docker compose logs -f  # 查看日志
docker compose ps       # 查看状态
docker compose down     # 停止所有服务
```

---

# 7. 🎯 Vibecoding 部署实战：全程让 AI 帮你搞定

这才是本章的核心：**在 AI 时代，你不需要记住上面所有命令**。你需要的是一套高效的「AI 协作部署流程」，让 AI 当你的运维助手，你当决策者。

## 7.1 推荐工具：Claude Code / Trae Solo / Cursor + SSH

这些 AI 编程助手都支持**直接在你的服务器上执行命令**。最舒服的流程是：

**方式一：本地开发，AI 帮你生成部署脚本**

1. 本地项目跑通后，告诉 AI：「我要把这个项目部署到 Ubuntu 22.04 服务器上，服务器 IP 是 xxx，我已经配好 SSH 密钥登录。帮我生成：
   - 一份完整的部署步骤清单
   - Nginx 配置文件
   - PM2 ecosystem 配置文件
   - 必要的环境变量检查清单
   - 部署脚本 deploy.sh」

2. AI 会给你生成好所有文件，你只需要在本地执行 `scp` 或 `git push`，然后到服务器上运行 `bash deploy.sh`。

**方式二：让 AI 直接登录服务器操作（更省事）**

Claude Code 支持通过 SSH 在远程服务器上工作。你只需要：

```bash
# 在本地启动 Claude Code，让它通过 SSH 连接服务器
claude
# 然后告诉它：
# 「通过 SSH 连接到 root@我的服务器IP，帮我部署 /root/myapp 这个 Node.js 项目，
#   配置 Nginx 反向代理，用 PM2 守护进程，并配置 HTTPS 证书」
```

AI 会：
1. SSH 到你的服务器
2. 检查环境（Node.js/Nginx/PM2 是否安装）
3. 自动执行缺失的安装
4. 拉取最新代码，安装依赖，构建
5. 配置 Nginx 并测试
6. 配置 PM2 启动
7. 申请 SSL 证书
8. 最后访问验证

你只需要在关键步骤确认，遇到错误时 AI 会自己查日志、排错、重试。

> ⚠️ **安全提醒**：让 AI 直接 SSH 到生产服务器很方便，但建议：
> - **先在测试服务器上练手**，确认 AI 不会误删数据
> - **重要数据定期备份**
> - 给 AI 的用户权限要最小化（不要直接给 root，可以给 sudo 权限但要留意命令）
> - AI 执行危险命令（`rm -rf`、`DROP TABLE`、改防火墙）之前让它先告诉你准备做什么

## 7.2 万能部署 Prompt 模板

当你不知道怎么跟 AI 描述你的需求时，用这个模板：

```
帮我部署一个项目到我的云服务器，信息如下：

【服务器信息】
- 系统：Ubuntu 22.04 LTS
- IP：xxx.xxx.xxx.xxx
- 已配置：SSH 密钥登录（用户 ubuntu，有 sudo 权限）
- 已安装：Docker、Nginx

【项目信息】
- 项目类型：[Node.js Express / Next.js / Python FastAPI / 纯前端静态站 / ...]
- 代码位置：GitHub 仓库 https://github.com/xxx/xxx （或本地路径 ~/myapp）
- 技术栈：Node.js 20 + PostgreSQL 16 + Redis 7
- 启动命令：npm run start
- 监听端口：3000
- 需要的环境变量：DATABASE_URL、JWT_SECRET、OPENAI_API_KEY

【域名】
- 域名：mydomain.com
- 已解析到服务器 IP
- 需要 HTTPS

【要求】
1. 给出完整的步骤（包括需要在本地和服务器上分别执行的命令）
2. 提供 Nginx 配置文件
3. 提供进程守护方案（PM2 或 systemd 或 docker-compose）
4. 配置 HTTPS
5. 最后告诉我如何验证部署成功
6. 列出常见的坑和排查方法
```

把这个填好给 AI，它会给你一份可执行的方案。遇到问题时，**把报错原文复制给 AI**，它能定位 90% 的问题。

## 7.3 AI 辅助排错流程

部署出问题时不要慌，按照这个流程走：

1. **先看日志**：
   - Nginx 错误日志：`sudo tail -50 /var/log/nginx/error.log`
   - 应用日志（PM2）：`pm2 logs myapp`
   - 应用日志（systemd）：`sudo journalctl -u myapp -n 50`
   - Docker 日志：`docker compose logs app`

2. **把报错信息完整复制给 AI**，加上上下文：
   > 「我在部署 Node.js 项目到 Ubuntu 服务器，访问网站显示 502 Bad Gateway，Nginx 错误日志显示如下：[粘贴日志]，我的 Nginx 配置是：[粘贴配置]，PM2 状态是：[粘贴 pm2 status 输出]，帮我排查原因并给出修复命令。」

3. **AI 给出修复命令后**，先看一眼大致合理再执行（比如不要执行来源不明的 `curl | bash`）。

4. **常见问题清单**（也可以直接问 AI）：
   - **502 Bad Gateway**：后端服务没启动、端口不对、Nginx proxy_pass 地址错误
   - **无法访问 IP**：安全组没开端口、ufw 防火墙没放行、Nginx 没启动
   - **前端页面刷新 404**：Nginx 没配 `try_files`，前端路由 history 模式需要 fallback 到 index.html
   - **静态资源 404**：root 路径配错、文件权限问题（Nginx 用户读不到文件）
   - **API 请求跨域**：后端没配 CORS、或 Nginx 反向代理没带正确的 Host 头
   - **HTTPS 证书申请失败**：域名没解析到服务器 IP、80 端口被占用、防火墙没开 80
   - **PM2 进程频繁重启**：代码有 bug 启动就崩；用 `pm2 logs` 看错误
   - **服务器内存不够**：加 swap 分区，或升级服务器配置

---

# 8. 部署后的小知识

## 8.1 文件传输：本地 ↔ 服务器

```bash
# 本地上传到服务器
scp ./local-file.zip yourname@server-ip:/home/yourname/

# 本地整个目录
scp -r ./local-dir yourname@server-ip:/home/yourname/

# 服务器下载到本地
scp yourname@server-ip:/home/yourname/file.zip ./

# rsync（更高效，支持增量同步，推荐用于部署）
rsync -avz --exclude=node_modules --exclude=.git ./project/ yourname@server-ip:/var/www/project/
```

## 8.2 快速更新代码

每次更新代码后都要手动拉取、构建、重启太麻烦，写一个简单的部署脚本：

```bash
#!/bin/bash
# deploy.sh - 放在服务器项目目录下
set -e

echo "📦 拉取最新代码..."
git pull origin main

echo "📦 安装依赖..."
npm install --production=false

echo "🔨 构建..."
npm run build

echo "🔄 重启服务..."
pm2 restart myapp

echo "✅ 部署完成！"
```

以后更新只需要：

```bash
cd /path/to/project && bash deploy.sh
```

更进一步可以配置 **GitHub Actions 自动部署**：代码 push 到 main 分支后，自动 SSH 到服务器执行部署脚本。这也可以让 AI 帮你写 CI/CD 配置文件。

## 8.3 备份与安全

- **定期备份数据库**：写个 cron 定时任务每天自动导出数据库到对象存储
- **禁用密码登录，只用 SSH 密钥**：更安全
- **修改 SSH 默认端口**（22 → 其他端口）：减少暴力扫描
- **安装 fail2ban**：自动封禁多次尝试登录的 IP
- **不要把 .env、密钥硬编码在代码里**：用环境变量
- **定期更新系统**：`apt update && apt upgrade -y`

这些配置都可以告诉 AI，让它帮你生成完整的加固脚本。

---

# 9. 本章小结

把本地项目部署到云服务器，核心流程其实就 5 步：

1. **买服务器** → 选 Ubuntu 22.04，拿到 IP
2. **SSH 连上去** → 配基础环境（Node.js/Nginx/Docker）
3. **把代码传上去** → git clone 或 rsync
4. **跑起来** → pm2 / docker compose / systemd 守护进程
5. **配 Nginx + 域名 + HTTPS** → 反向代理 + Let's Encrypt 证书

记住这几个核心概念：
- **SSH**：安全连接远程服务器的方式
- **Nginx**：Web 服务器，负责接客（监听 80/443）+ 带路（反向代理到后端）+ 托管静态文件
- **PM2/systemd/Docker**：让程序在后台持续运行，崩溃自动重启
- **安全组/防火墙**：控制哪些端口可以访问
- **DNS + SSL**：域名解析 + HTTPS 加密

**vibecoding 的关键心法：你不需要记住所有命令。** 你要做的是：
1. 理解「需要做什么」（上面 5 步）
2. 能把需求清楚地描述给 AI
3. 看得懂 AI 给的方案大致在做什么
4. 遇到报错会复制日志给 AI，让它帮你排查
5. 保持备份和安全意识

这一章的配套 AI Prompt 可以直接复用——当你真的要部署项目时，把「7.2 万能部署 Prompt 模板」填好发给你的 AI 编程助手，从 0 到上线的完整命令、配置、排错清单都会给你生成好。

部署一次，你就会发现：原来「上线」也没那么难。🎯

---

<RelatedArticlesSection
  :articles="relatedArticlesMap['zh-cn/stage-2/backend/cloud-server-deployment']"
  title="相关文章"
  description="继续学习部署前后的工程化技能。"
/>
