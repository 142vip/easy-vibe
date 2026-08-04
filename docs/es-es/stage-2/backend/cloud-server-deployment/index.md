<script setup>
import RelatedArticlesSection from '../../../../.vitepress/theme/components/RelatedArticlesSection.vue'
import { relatedArticlesMap } from '../../../../.vitepress/theme/data/relatedArticles'
</script>

# Publica tu sitio web (avanzado): prepara tu propio VPS y despliega

> 💡 **¿Qué significa "publicar un sitio web en Internet"?** También se llama "salir a producción" o "desplegar/publicar". Un sitio web que construiste en tu propio ordenador solo puede abrirlo tú. **Publicarlo en Internet significa colocarlo en un servidor que funciona las 24 horas, para que cualquier persona pueda escribir una URL en su navegador y visitarlo** — igual que un documento de Word que solo tú puedes leer se vuelve visible para todos cuando lo publicas en un blog; la diferencia es que esta vez estás publicando un sitio web completo.

En el capítulo anterior aprendimos la forma más fácil de publicar: usar plataformas PaaS de un clic como Vercel o Zeabur. Este capítulo trata el enfoque más flexible y de "hazlo tú mismo": **comprar tu propio servidor en la nube, configurarlo todo desde cero y publicar tu sitio por tu cuenta**. Aprenderás a elegir un servidor, conectarte a él, instalar el entorno, configurar Nginx, asociar un dominio y activar HTTPS. Cuando entiendas todo esto, ninguna plataforma podrá limitarte: ejecuta los servicios que quieras.

---

# 0. Elige con criterio: árbol de decisión de plataformas de despliegue

Antes de elegir una plataforma, responde tres preguntas:

1. **¿Tu proyecto necesita funcionar las 24 horas?**
   - No (responde solo cuando lo visitan, p. ej. documentación, blogs, sitios estáticos) → **Alojamiento estático / PaaS**
   - Sí (tareas programadas, rastreadores, bots de Telegram/Discord, servicios WebSocket) → **PaaS siempre activo o VPS**

2. **¿Necesitas una GPU?**
   - No (solo llamas a las APIs de OpenAI/Anthropic) → Las plataformas normales funcionan
   - Sí (ejecutar modelos de código abierto, generar imágenes/vídeos) → **Plataformas en la nube con GPU** (Modal, Replicate, Lambda Labs)

3. **¿Dónde se encuentran principalmente tus usuarios?**
   - Global / EE. UU. / UE → Vercel / Railway / Fly.io / AWS
   - China continental → Nubes chinas (Alibaba Cloud / Tencent Cloud) o Cloudflare (rápido en China)
   - Ambos → Usa un CDN, despliega los activos orientados a China en una nube china y los globales en AWS con GeoDNS

```
¿Qué tipo de proyecto vas a desplegar?
│
├─ Sitio estático de frontend puro (salida de compilación de Vite/React/Vue)
│   ├─ Completamente gratis → Cloudflare Pages (ancho de banda ilimitado) / GitHub Pages
│   ├─ Proyecto Next.js → Vercel (plataforma oficial, mejor DX)
│   └─ Usuarios principalmente en China → Cloudflare Pages o OSS+CDN nacional
│
├─ API de backend, no necesita estar siempre activa (activada por solicitudes)
│   ├─ API Node.js/Python → Vercel Functions / Cloudflare Workers
│   └─ Frameworks full-stack (Next.js/Nuxt/SvelteKit) → Vercel
│
├─ Necesita proceso siempre activo (Bot, cron, WebSocket)
│   ├─ No quieres gestionar servidores → Railway / Render / Fly.io
│   ├─ Control total y ahorro de costes → Compra un VPS (DigitalOcean / Vultr / Hetzner / AWS EC2)
│   └─ Proyectos orientados a China → Tencent Cloud Lighthouse / Alibaba Cloud ECS
│
├─ Necesitas ejecutar modelos de IA / GPU
│   ├─ API de inferencia → Modal / Replicate / Hugging Face Inference
│   ├─ Entrenamiento / Fine-tuning → Modal / Lambda Labs
│   └─ GPU en China → AutoDL / Alibaba Cloud PAI
│
└─ Proyectos grandes de producción
    └─ AWS/GCP + Kubernetes (contrata DevOps o deja que la IA escriba Terraform)
```

---

# 1. Plataformas de despliegue gratuitas/de bajo coste en detalle (sin necesidad de servidor)

Para la mayoría de proyectos personales, demos y portafolios, **no necesitas comprar un servidor en absoluto**. Esta sección cubre las plataformas gratuitas/de bajo coste más populares: cómo registrarte, cómo usarlas y sus trampas.

## 1.1 Vercel — Primera opción para Next.js / Frontend

**Sitio web:** https://vercel.com

**Ideal para:** proyectos Next.js, frontends React/Vue, aplicaciones full-stack con Serverless Functions, chatbots de IA (tiempo de respuesta rápido)

**Cómo usarlo:**
1. Regístrate con tu cuenta de GitHub
2. Haz clic en "Add New..." → "Project"
3. Selecciona tu repositorio de GitHub
4. Vercel detecta automáticamente tu framework (Next.js/Vite/React, etc.); completa las variables de entorno
5. Haz clic en "Deploy" — tu sitio estará en línea en 1-2 minutos en `xxx.vercel.app`

**Plan gratuito (Hobby):**
- 100 GB de ancho de banda/mes
- 100 horas de compilación/mes
- Tiempo de ejecución de Serverless Function **10 segundos** (¡el límite más crítico!)
- HTTPS automático, CDN global, enlaces de vista previa para PR

**De pago (Pro, $20/mes):**
- Tiempo de espera de las funciones ampliado a 60-300 s
- 1 TB de ancho de banda
- Funciones de colaboración en equipo

**⚠️ Limitaciones clave con las que tropiezan los principiantes:**
- **Tiempo de espera de 10 segundos en las funciones** en el plan gratuito: las llamadas a APIs de IA que superen los 10 s se desconectarán. El plan Pro ($20/mes) lo amplía a 60 s; 300 s cuesta extra
- **Sin procesos siempre activos**: no hay cron, no hay long-polling de WebSocket, no hay bots funcionando permanentemente
- **Arranques en frío**: las funciones que llevan un tiempo sin usarse tardan en la primera solicitud
- **Costes de proyectos de IA**: las respuestas de IA en streaming consumen ancho de banda; el tráfico elevado puede disparar la factura Pro hasta $200/mes

**Veredicto:** Vercel es la experiencia más fluida para desplegar páginas de frontend, documentación y demos rápidas. Pero para agentes siempre activos o llamadas de IA de larga duración — no uses Vercel.

## 1.2 Cloudflare Pages — Ancho de banda ilimitado, rápido en todo el mundo

**Sitio web:** https://pages.cloudflare.com

**Ideal para:** sitios estáticos, proyectos con mucho ancho de banda, audiencias globales, Edge Functions

**Plan gratuito:**
- **Ancho de banda ilimitado** (¡el mayor argumento de venta!)
- 500 compilaciones/mes
- Solicitudes ilimitadas
- Cloudflare Workers: 100 000 solicitudes/día
- Más de 300 ubicaciones perimetrales en todo el mundo, velocidad decente incluso en China

**Cómo usarlo:**
1. Crea una cuenta gratuita de Cloudflare
2. Ve a Workers & Pages → Create → Pages → Connect to Git
3. Selecciona tu repositorio, configura el comando de compilación (Vite: `npm run build`, directorio de salida: `dist`)
4. Haz clic en Save and Deploy

**Extra: Workers AI:** Cloudflare también ofrece ejecutar modelos de IA de código abierto (Llama 3, Mistral, Stable Diffusion) en nodos perimetrales, con 10 000 neuronas/día gratis. Ideal para ejecutar modelos pequeños sin depender de las APIs de OpenAI.

**Veredicto:** La mejor opción para sitios estáticos, especialmente proyectos con audiencias globales. El ancho de banda ilimitado es una función matadora.

## 1.3 Railway — Mejor experiencia para servicios backend (siempre activos)

**Sitio web:** https://railway.app

**Ideal para:** servicios backend siempre activos, APIs Node.js/Python/Go, bots de Discord/Telegram, proyectos full-stack que necesitan bases de datos

**Cómo usarlo:**
1. Regístrate con GitHub
2. New Project → Deploy from GitHub repo (o elige una plantilla)
3. Railway detecta automáticamente el tipo de tu proyecto, instala dependencias, compila y arranca
4. Añade bases de datos PostgreSQL/Redis/MySQL/MongoDB con un clic
5. Dominio generado automáticamente, o asocia tu dominio personalizado

**Precios:**
- Los nuevos usuarios reciben **$5 de crédito de prueba** (no es gratis para siempre)
- Después, facturación según uso, desde ~$5/mes (servicio siempre activo con especificaciones mínimas + base de datos)
- Se duerme después de 5 min de inactividad (durante la prueba gratuita); sin sueño después de pagar

**Veredicto:** Railway tiene la mejor experiencia para desplegar APIs backend, bots y aplicaciones full-stack que necesitan bases de datos — auto-despliegue desde GitHub, bases de datos integradas, registros y monitorización, todo incluido.

## 1.4 Fly.io — Contenedores gratis 24/7 de verdad

**Sitio web:** https://fly.io

**Ideal para:** servicios distribuidos globalmente con baja latencia, que quieren un contenedor **realmente gratis 24/7** y aceptan una pequeña curva de aprendizaje

**Plan gratuito:**
- 3 VMs compartidas micro (micro-1x, 256MB de RAM)
- **Sin límite de tiempo de ejecución** (no se duerme como Render)
- 160 GB de tráfico saliente/mes
- 3 GB de volúmenes persistentes
- Más de 30 regiones de centros de datos en el mundo
- Soporte de GPU (A100/H100)

**Cómo usarlo:**
1. El registro requiere tarjeta de crédito (no se cobra, es verificación de identidad)
2. Instala la CLI de flyctl
3. Escribe un archivo de configuración `fly.toml` en tu proyecto (la IA puede generarlo)
4. `fly launch` → compila automáticamente la imagen Docker, asigna IP, despliega
5. `fly deploy` para actualizar, `fly logs` para ver los registros

**Veredicto:** Si necesitas un **contenedor realmente gratis 24/7** para un bot/API/tarea programada, Fly.io es la mejor opción gratuita. La contrapartida es aprender los comandos de flyctl y lo básico de Docker.

## 1.5 Render — 750 horas gratis, pero se duerme

**Sitio web:** https://render.com

**Ideal para:** fase de aprendizaje, proyectos personales, proyectos a los que no les importa el arranque en frío

**Plan gratuito:**
- Web Service: 750 horas/mes (una instancia se ejecuta de forma continua)
- PostgreSQL: gratis durante 90 días (⚠️ ¡después se elimina la base de datos!)
- Sitios estáticos: completamente gratis, 100 GB de ancho de banda

**⚠️ Problema clave:**
- **Se duerme después de 15 minutos de inactividad**, el arranque en frío tarda 10-30 segundos (mala experiencia de usuario)
- La base de datos gratuita se elimina después de 90 días — ¡recuerda hacer copias de seguridad!

**Veredicto:** Bueno para proyectos de desarrollo/pruebas/escolares, pero no pongas proyectos de producción orientados al usuario en el plan gratuito. El plan de pago empieza en $7/mes para desactivar el sueño.

## 1.6 Otras plataformas destacables

| Plataforma | Tipo | Cuota gratuita | Aspectos destacados |
|----------|------|-----------|------------|
| **GitHub Pages** | Alojamiento estático | Ilimitado (límite flexible de 100GB) | Lo más fácil: haz push a GitHub y se publica |
| **Hugging Face Spaces** | Apps de IA | Instancia CPU pequeña gratis | Dedicada a demos de IA (Gradio/Streamlit) |
| **Modal** | GPU Serverless de IA | $30/mes de crédito | Funciones Python como servicio, arranque en frío de GPU <4s |
| **Replicate** | Alojamiento de modelos de IA | Pago por llamada | Convierte modelos en APIs sin gestionar infraestructura |
| **Denoland Deploy** | Deno/Edge | 100k solicitudes/día gratis | Plataforma oficial de Deno, TypeScript nativo |
| **Netlify** | Alojamiento estático | 100GB de ancho de banda/mes | Rico ecosistema de plugins |
| **Supabase** | BaaS | 500MB de BD gratis | Alternativa open-source a Firebase, Postgres+Auth+Storage |
| **Neon** | Postgres Serverless | 500MB gratis | Bases de datos ramificables para Serverless |
| **Upstash** | Redis Serverless | 10k comandos/día gratis | Redis basado en solicitudes para Serverless |

---

# 2. Comprar un VPS en la nube: guía paso a paso de AWS

Si necesitas control total sobre el entorno del servidor, ejecutar servicios personalizados, o PaaS no cubre tus necesidades, es hora de comprar tu propio servidor en la nube. Esta sección recorre AWS (la plataforma en la nube global más utilizada) y también cubre alternativas como DigitalOcean, Vultr y Hetzner.

## 2.1 AWS Free Tier — Gratis durante 12 meses

AWS ofrece a los nuevos usuarios un Free Tier de 12 meses perfecto para aprender y para proyectos personales. Esto es lo que incluye:

| Servicio | Asignación del Free Tier |
|---------|---------------------|
| **EC2** | 750 horas/mes de t2.micro o t3.micro (una instancia funcionando 24/7) |
| **S3** | 5GB de almacenamiento estándar |
| **RDS** | 750 horas/mes de db.t2.micro/db.t3.micro + 20GB de almacenamiento |
| **Lambda** | 1 millón de solicitudes/mes + 3,2 millones de segundos de cómputo |
| **CloudFront** | 50GB de salida + 2 millones de solicitudes/mes |
| **CloudWatch** | 10 métricas personalizadas + 1GB de ingesta de registros |
| **DynamoDB** | 25GB de almacenamiento + 2,5 millones de unidades de capacidad de lectura/escritura |

**⚠️ Importante:** el Free Tier expira 12 meses después del registro, tras lo cual se te cobrarán las tarifas estándar. Configura siempre alertas de facturación (Billing Dashboard → Budgets) para evitar cargos sorpresa. ¡Destruye los recursos que no uses!

### Cómo crear una instancia EC2 (VPS de AWS):

1. **Regístrate** en https://aws.amazon.com/ con correo electrónico y tarjeta de crédito
2. Ve a **EC2 Dashboard** → **Launch Instances**
3. **Paso 1: Elige una Amazon Machine Image (AMI)**
   - Selecciona **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type** (x86 de 64 bits) — es la opción más amigable para principiantes
4. **Paso 2: Elige el tipo de instancia**
   - Selecciona **t2.micro** (elegible para el plan gratuito, 1 vCPU, 1GB de RAM)
5. **Paso 3: Configura los detalles de la instancia**
   - Mantén los valores por defecto (1 instancia, VPC por defecto)
6. **Paso 4: Añade almacenamiento**
   - El volumen raíz por defecto de 8GB gp2 es suficiente para empezar
7. **Paso 5: Añade etiquetas (Tags)** (opcional, para organización)
8. **Paso 6: Configura el Security Group** (⚠️ CRÍTICO — es tu cortafuegos)
   - Crea un nuevo grupo de seguridad
   - Añade reglas:
     - Tipo: **SSH**, Puerto: 22, Origen: **My IP** (solo tu IP puede usar SSH)
     - Tipo: **HTTP**, Puerto: 80, Origen: **Anywhere (0.0.0.0/0)**
     - Tipo: **HTTPS**, Puerto: 443, Origen: **Anywhere**
9. **Paso 7: Revisa y lanza**
10. **Key Pair**: cuando se te pida, crea un nuevo par de claves (p. ej. `my-aws-key.pem`), descárgalo y guárdalo en un lugar seguro. **¡No podrás descargarlo de nuevo!**
11. Haz clic en **Launch Instances** → espera 2-5 minutos a que arranque

### Conectarse a tu instancia EC2:

```bash
# En tu terminal local de Mac/Linux
chmod 400 my-aws-key.pem  # Establece los permisos correctos (¡obligatorio!)
ssh -i my-aws-key.pem ubuntu@YOUR_PUBLIC_IP
# p. ej. ssh -i my-aws-key.pem ubuntu@54.123.45.67

# En Windows usa PuTTY (convierte .pem a .ppk) o Windows Terminal con OpenSSH
```

**Obtén tu IP pública:** ve a EC2 Dashboard → Instances → Selecciona tu instancia → busca "Public IPv4 address" en los detalles.

## 2.2 DigitalOcean — Excelente documentación para principiantes

**Sitio web:** https://www.digitalocean.com

**Precios:** los Droplets empiezan en $4/mes (512MB de RAM, 10GB SSD, 500GB de ancho de banda)

**Por qué elegir DO:** su documentación (llamada "community tutorials") es legendaria — casi cualquier duda sobre Linux/servidores tiene un tutorial bien escrito de DO. Su interfaz es limpia y amigable para principiantes.

**Cómo usarlo:**
1. Regístrate (tarjeta de crédito o PayPal, depósito mínimo de $2 por PayPal)
2. Haz clic en "Create" → "Droplets"
3. Elige Ubuntu 22.04, plan básico de $4/mes, elige un centro de datos cerca de tus usuarios (NYC, SFO, London, Singapore, etc.)
4. Añade tu clave pública SSH (recomendado) o establece una contraseña de root
5. Haz clic en "Create Droplet" — listo en ~1 minuto
6. Conéctate con: `ssh root@YOUR_DROPLET_IP`

## 2.3 Vultr — Facturación por horas, muchas ubicaciones

**Sitio web:** https://www.vultr.com

**Precios:** Cloud Compute normal empieza en $5/mes (1 vCPU, 1GB de RAM, 25GB SSD, 1TB de ancho de banda)

**Por qué elegir Vultr:** se paga por horas (puedes levantar un servidor durante 10 minutos para probar algo, destruirlo y pagar céntimos), más de 30 ubicaciones globales, y tienen instancias GPU asequibles por si las necesitas más adelante.

## 2.4 Hetzner — La mejor relación calidad-precio para proyectos a largo plazo

**Sitio web:** https://www.hetzner.com/cloud

**Precios:** CX11 empieza en €3,49/mes (1 vCPU, 2GB de RAM, 20GB SSD, ¡20TB de tráfico!)

**Por qué elegir Hetzner:** la mejor relación precio-rendimiento de Europa, red extremadamente estable. Ideal para proyectos de producción de larga duración. La contrapartida es que los centros de datos están en Alemania/Finlandia/EE. UU. (sin ubicaciones en Asia).

## 2.5 Comparación rápida de proveedores de VPS

| Proveedor | Precio inicial | Ideal para | Prueba gratuita |
|----------|---------------|----------|-----------|
| **AWS EC2** | Plan gratuito durante 12 meses, luego ~$10/mes | Aprender AWS, integración empresarial | 12 meses de Free Tier |
| **DigitalOcean** | $4/mes | Principiantes, gran documentación | $200 de crédito durante 60 días (nuevos usuarios) |
| **Vultr** | $5/mes ($2.50 solo IPv6) | Pruebas por horas, muchas regiones | $100 de crédito durante 30 días |
| **Hetzner** | €3,49/mes | Proyectos a largo plazo con mejor valor | €20 de crédito |
| **Linode (Akamai)** | $5/mes | Consolidado, fiable | $100 de crédito durante 60 días |

---

# 3. Configuración inicial del servidor (Ubuntu 22.04)

Una vez que te has conectado por SSH a tu servidor, lo primero es actualizar el sistema e instalar las herramientas básicas. Puedes **copiar el mensaje de abajo a tu asistente de IA** y dejar que genere los comandos exactos que necesitas:

> "Acabo de configurar un nuevo servidor Ubuntu 22.04 y quiero desplegar un proyecto [Node.js/Python/...]. Dame los comandos completos de inicialización, incluyendo: actualización del sistema, crear un usuario sudo no root, configurar la autenticación por clave SSH, instalar Node.js 20, instalar Nginx, instalar Docker y configurar el cortafuegos básico ufw."

Una configuración inicial típica:

```bash
# 1. Actualiza el sistema e instala las herramientas básicas
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git vim ufw build-essential

# 2. Crea un usuario normal (¡no uses siempre root!)
sudo adduser yourname
sudo usermod -aG sudo yourname

# 3. Instala Node.js (usa nvm, NO apt)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
node -v  # verifica

# 4. Instala Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
# Visita http://YOUR-IP en el navegador; deberías ver la página de bienvenida de Nginx

# 5. Instala Docker (si usas contenedores)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker yourname  # ejecuta Docker sin sudo
# Cierra sesión y vuelve a entrar para que surta efecto
docker --version

# 6. Configura el cortafuegos
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

## 3.1 Configurar el Security Group / cortafuegos (¡MUY IMPORTANTE!)

En AWS esto se hace mediante **Security Groups** (en la consola de EC2). En DigitalOcean/Vultr está en la configuración del cortafuegos de su panel. En Ubuntu también necesitas `ufw`.

**Abre como mínimo estos puertos:**

| Puerto | Propósito | Recomendación |
|------|---------|---------------|
| **22** | SSH | Obligatorio; restringe a tu IP si es posible |
| **80** | HTTP | Obligatorio para la web |
| **443** | HTTPS | Obligatorio para la web segura |
| **3000-3999** | Puertos de desarrollo de Node.js | Ábrelos temporalmente para depurar, ciérralos después del despliegue |

> ⚠️ **Error nº 1 de principiantes:** la aplicación está funcionando pero no puedes acceder a ella. El 90 % de las veces es porque el security group/cortafuegos no permite ese puerto.

---

# 4. Tres escenarios típicos de despliegue

## 4.1 Escenario 1: Desplegar un frontend estático (Vite/React/Vue)

Después de `npm run build`, obtienes una carpeta `dist/` con archivos HTML/CSS/JS puros.

**Lleva el código al servidor:**

```bash
# Opción A: rsync desde tu máquina local
rsync -avz --exclude=node_modules ./dist/ yourname@YOUR-IP:/var/www/myapp/

# Opción B: git clone en el servidor (recomendado, actualizaciones más fáciles)
cd /var/www
sudo git clone https://github.com/YOUR_USER/YOUR_REPO.git myapp
cd myapp
npm install
npm run build
```

**Configura Nginx:**

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
        try_files $uri $uri/ /index.html;  # respaldo de enrutado SPA
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Habilita el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 4.2 Escenario 2: Desplegar un backend Node.js (Express/Fastify/NestJS)

Usa **PM2** para mantener la aplicación funcionando en segundo plano:

```bash
npm install -g pm2
cd /path/to/your/app
npm install
npm run build  # si usas TypeScript
pm2 start dist/main.js --name "myapp"
pm2 startup && pm2 save  # arranque automático al iniciar el sistema
pm2 logs myapp  # ver los registros
```

**Proxy inverso con Nginx:**

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

## 4.3 Escenario 3: Despliegue full-stack con Docker Compose

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

Ejecútalo con: `docker compose up -d`

---

# 5. Dominio y HTTPS

## 5.1 Compra un dominio y configura el DNS

Registra un dominio a través de Namecheap, Cloudflare Registrar, GoDaddy o AWS Route 53. En la configuración de DNS de tu dominio, añade **registros A**:

| Tipo | Host | Valor |
|------|------|-------|
| A | @ | La IP de tu servidor |
| A | www | La IP de tu servidor |
| A | api | La IP de tu servidor (para el backend) |

## 5.2 HTTPS con un clic mediante Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
# Elige la opción 2 (Redirect) para redirigir automáticamente HTTP a HTTPS
sudo certbot renew --dry-run  # prueba la renovación automática
```

---

# 6. Inmersión en los servicios de los proveedores en la nube (más allá del VPS)

Cuando inicias sesión en la consola de AWS (o en cualquier panel de una nube), verás decenas de servicios con nombres crípticos (EC2, S3, RDS, ELB, VPC…). Esta sección explica los más comunes y cuándo usarlos, **usando AWS como ejemplo principal** (los conceptos se trasladan directamente a otras nubes).

## 6.1 Panorama de la arquitectura en la nube

Una aplicación web típica que se ejecuta en la nube se ve así:

```
Usuario → CloudFront (CDN) → ALB (Balanceador de carga) → EC2 (Tu servidor de aplicaciones)
                              │                     │
                              │                     ├── S3 (imágenes/archivos)
                              │                     ├── RDS (base de datos)
                              │                     └── ElastiCache (Redis)
                              │
                              └── ECS/EKS (contenedores, avanzado)

         └── Route 53 (DNS) → asigna tu dominio a CloudFront/ALB
             + ACM (certificados SSL) → cifrado HTTPS
```

Repasemos cada servicio.

## 6.2 Cómputo: dónde se ejecuta tu código

### EC2 (Elastic Compute Cloud) — El VPS

Este es el "servidor en la nube" que hemos estado usando. Es una máquina virtual a la que puedes conectarte por SSH, instalar cualquier cosa y configurarla como quieras.

- **Alibaba Cloud:** ECS
- **Tencent Cloud:** CVM / Lighthouse
- **DigitalOcean:** Droplet
- **Hetzner:** Cloud Server

**Cuándo usarlo:** cuando necesitas control total, software personalizado, procesos siempre activos.

### Lambda — Funciones Serverless

Sube fragmentos de código sin gestionar servidores. Se paga por invocación y por tiempo de ejecución. Solo se ejecuta cuando se activa.

- **Alibaba Cloud:** Function Compute
- **Tencent Cloud:** SCF (Serverless Cloud Function)
- **GCP:** Cloud Functions

**Cuándo usarlo:** tareas ocasionales (manejadores de webhooks, procesamiento de imágenes, trabajos programados), APIs con tráfico irregular. **No para** procesos siempre activos como bots WebSocket.

### ECS/EKS — Orquestación de contenedores

Si tu proyecto usa Docker y crece hasta tener múltiples contenedores/servicios, usa Kubernetes para la orquestación.

- **AWS ECS:** el servicio de contenedores más simple de Amazon
- **AWS EKS:** Kubernetes gestionado
- **Alibaba Cloud:** ACK
- **Tencent Cloud:** TKE
- **Google Cloud:** GKE

**Cuándo usarlo:** arquitecturas de microservicios con varios servicios, autoescalado, proyectos de equipo. La mayoría de proyectos personales no lo necesitarán — un VPS + Docker Compose es suficiente.

## 6.3 Almacenamiento: dónde viven los archivos y los datos

### S3 (Simple Storage Service) ⭐ El más utilizado

**Es el servicio más común más allá de los servidores**, se usa para almacenar imágenes, vídeos, PDFs, activos de sitios estáticos, copias de seguridad y más. **¡Nunca guardes archivos subidos por los usuarios en el disco local de tu servidor!** Se perderán si reconstruyes/migras/cambias el tamaño del servidor.

- **Alibaba Cloud:** OSS (Object Storage Service)
- **Tencent Cloud:** COS (Cloud Object Storage)
- **Google Cloud:** GCS (Google Cloud Storage)
- **Alternativa:** Cloudflare R2 (cero tarifas de salida — ¡gran oferta!)

**Plan gratuito:** AWS S3 da 5GB de almacenamiento estándar durante 12 meses dentro del Free Tier. Alibaba Cloud OSS da a los nuevos usuarios 5GB durante 6 meses. Cloudflare R2 tiene un plan gratuito permanente con 10GB de almacenamiento.

**Lo que puedes hacer con S3:**
- Guardar subidas de usuarios (avatares, imágenes, adjuntos, fotos de productos)
- Alojar sitios web estáticos (sube tu carpeta `dist/`, activa "Static website hosting")
- Hacer copias de seguridad de exportaciones de bases de datos
- Combinarlo con el CDN de CloudFront para descargas globales rápidas
- Generar URLs prefirmadas para compartir archivos privados

**Cómo usar S3 (guía paso a paso en la consola de AWS):**

1. Ve a **S3 Dashboard** → **Create bucket**
2. Introduce un nombre de bucket **globalmente único** (p. ej. `myapp-images`)
3. Elige una Región de AWS (p. ej. us-east-1 para el este de EE. UU.)
4. **Object Ownership:** selecciona "ACLs enabled" → "Bucket owner preferred" (más simple para el acceso público)
5. **Desmarca** "Block all public access" si quieres imágenes públicas (lee el aviso; solo desmárcalo para contenido público)
6. Deja el resto de ajustes por defecto → Haz clic en **Create bucket**
7. Haz clic en tu bucket → **Upload** → Selecciona los archivos
8. Tras la subida, cada archivo obtiene una URL como `https://myapp-images.s3.us-east-1.amazonaws.com/avatar.jpg`
9. Usa esa URL directamente en tu frontend `<img src="...">`

**Usar S3 con código (ejemplo en Node.js; pide a la IA que escriba la lógica completa):**

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
    ACL: "public-read" // hace que el archivo sea accesible públicamente
  }));
  return `https://myapp-images.s3.us-east-1.amazonaws.com/${filename}`;
}
```

> ⚠️ **Nota de seguridad crítica:** las AWS Access Keys son como la contraseña de tu S3. **Nunca las codifiques en el código del frontend ni las subas a Git.** Guárdalas en variables de entorno o usa roles IAM. Si las claves se filtran, desactívalas inmediatamente en la consola de IAM.

### EBS (Elastic Block Store) — Discos duros virtuales

Volúmenes de almacenamiento en bloque conectados a las instancias EC2 (como el disco duro de tu ordenador). Las instancias EC2 vienen con un volumen raíz (normalmente 8-60GB); compra volúmenes EBS adicionales cuando necesites más espacio.

- **Alibaba Cloud:** Cloud Disk (ESSD/SSD)
- **Tencent Cloud:** CBS (Cloud Block Storage)

**Cuándo usarlo:** espacio de disco extra para tu servidor, datos que necesitan persistir independientemente del ciclo de vida de la instancia EC2.

### EFS (Elastic File System) — Almacenamiento de archivos compartido

Un sistema de archivos de red que varias instancias EC2 pueden montar simultáneamente. Bueno para compartir archivos subidos entre varios servidores web.

- **Alibaba Cloud:** NAS
- **Tencent Cloud:** CFS

La mayoría de proyectos pequeños no lo necesitan — un solo servidor + S3 es suficiente.

## 6.4 Bases de datos: almacenamiento de datos estructurados

### RDS (Relational Database Service) ⭐ Común

**No ejecutes tu base de datos de producción en el mismo VPS.** Aunque técnicamente es posible (lo hicimos antes en el ejemplo de Docker Compose), para producción usa una base de datos gestionada: copias de seguridad automáticas, alta disponibilidad, monitorización y escalado con un clic.

- **Alibaba Cloud:** RDS
- **Tencent Cloud:** TDSQL-C / CDB
- **Google Cloud:** Cloud SQL

**Motores compatibles:** MySQL, PostgreSQL, MariaDB, SQL Server, Oracle y Amazon Aurora (compatible con MySQL/PostgreSQL, optimizada para la nube).

**Plan gratuito:** AWS RDS da 750 horas/mes de db.t2.micro o db.t3.micro + 20GB de almacenamiento durante 12 meses.

**Cómo configurar RDS (AWS):**

1. Ve a **RDS** → **Create database**
2. Selecciona **Standard create** → Motor: **MySQL 8.0** o PostgreSQL
3. Plantillas: **Free tier** (para mantenerse dentro de la asignación gratuita)
4. Establece el identificador de la instancia de BD, el nombre de usuario maestro y la contraseña maestra
5. Configuración de la instancia: **db.t3.micro** (plan gratuito)
6. Almacenamiento: 20GB gp2 (elegible para el plan gratuito)
7. Conectividad: selecciona la **misma VPC** que tu instancia EC2
8. **Acceso público:** No (solo permite el acceso desde dentro de la VPC)
9. Security Group de la VPC: crea uno nuevo, o selecciona uno existente que permita el puerto 5432/3306 desde tu security group de EC2
10. Haz clic en **Create database** → espera ~5-10 minutos
11. Cuando esté disponible, obtén el **Endpoint** (parece `mydb.xxxxx.us-east-1.rds.amazonaws.com:3306`)
12. Actualiza el `DATABASE_URL` de tu aplicación para que apunte a este endpoint, y añade tu security group de EC2 a las reglas de entrada del security group de RDS

> 💡 **Consejo vibecoding:** dile a la IA "Tengo una instancia de AWS RDS PostgreSQL en [endpoint], con el usuario [username], ayúdame a escribir el código de conexión y los scripts de migración para [mi proyecto]."

### ElastiCache — Redis/Memcached gestionado

Caché en memoria para datos calientes (reduce las consultas a la base de datos), almacenamiento de sesiones/tokens, colas de mensajes, clasificaciones (leaderboards), etc.

- **Alibaba Cloud:** ApsaraDB for Redis
- **Tencent Cloud:** TencentDB for Redis
- **Alternativa:** Upstash (Redis Serverless, con plan gratuito)

Para proyectos pequeños puedes simplemente ejecutar `sudo apt install redis-server` en tu VPS; usa Redis gestionado para producción/alta disponibilidad.

## 6.5 Redes: acceso más rápido y seguro

### CloudFront — CDN (Content Delivery Network) ⭐ Común

Almacena en caché tus activos estáticos (imágenes, CSS, JS, vídeo) en ubicaciones perimetrales de todo el mundo para que los usuarios obtengan el contenido del nodo más cercano.

- **Alibaba Cloud:** CDN / DCDN
- **Tencent Cloud:** CDN / EdgeOne
- **Google Cloud:** Cloud CDN
- **Alternativa gratuita:** Cloudflare CDN (el plan gratuito incluye ancho de banda ilimitado)

**Cuándo usarlo:**
- Sitios con imágenes/vídeos/archivos grandes
- Usuarios repartidos en diferentes regiones
- Reducir los costes de ancho de banda en tu servidor de origen
- Cloudflare Pages es esencialmente = CDN + alojamiento estático

**Cómo configurar CloudFront:**
1. Consola de CloudFront → **Create distribution**
2. Dominio de origen: selecciona tu bucket S3 o tu ALB de EC2
3. Comportamiento de caché por defecto: redirige HTTP a HTTPS
4. Crea la distribución → espera ~5-15 minutos a que se despliegue
5. Apunta el DNS de tu dominio al nombre de dominio de la distribución de CloudFront (p. ej. `dxxx.cloudfront.net`) mediante un registro CNAME

### ELB (Elastic Load Balancing)

Distribuye el tráfico entrante entre varias instancias EC2, eliminando automáticamente las instancias no saludables.

- **ALB (Application Load Balancer):** Capa 7 (HTTP/HTTPS), enrutado por ruta, el más común para aplicaciones web
- **NLB (Network Load Balancer):** Capa 4 (TCP/UDP), latencia ultrabaja
- **GLB (Gateway Load Balancer):** para appliances virtuales de red
- **Alibaba Cloud:** SLB / ALB
- **Tencent Cloud:** CLB

Los proyectos de un solo servidor no lo necesitan. Úsalo cuando escales a varios servidores backend.

### Route 53 — Servicio DNS

Traduce nombres de dominio a direcciones IP. La mayoría de registradores de dominios incluyen DNS gratuito, pero Route 53 está profundamente integrado con AWS.

- **Alibaba Cloud:** Alibaba Cloud DNS
- **Tencent Cloud:** DNSPod
- **Alternativa gratuita:** Cloudflare DNS (uno de los más rápidos del mundo, completamente gratis)

**Tipos de registros DNS comunes:**

| Tipo | Propósito | Ejemplo |
|------|---------|---------|
| **A** | Dominio → dirección IPv4 | `@ → 54.123.45.67` |
| **AAAA** | Dominio → dirección IPv6 | `@ → 2600:xxxx::` |
| **CNAME** | Dominio → otro dominio (se usa para CDN) | `static → dxxx.cloudfront.net` |
| **MX** | Servidor de correo (necesario para el correo de empresa) | - |
| **TXT** | Texto arbitrario (verificación de dominio, SPF/DKIM) | - |

### ACM (AWS Certificate Manager) — Certificados SSL gratuitos

AWS ofrece certificados SSL/TLS gratuitos que se renuevan automáticamente cuando se usan con CloudFront o ALB. Solo tienes que solicitar un certificado, validarlo por DNS o correo, y asociarlo a tu distribución/balanceador de carga.

- **Alibaba Cloud:** Certificados SSL gratuitos
- **Tencent Cloud:** Certificados SSL gratuitos
- **Opción gratuita universal:** Certbot + Let's Encrypt (el método que mostramos en la Sección 5, renovación automática de 90 días)

### VPC (Virtual Private Cloud)

Una red virtual aislada en AWS donde viven tus EC2, RDS y otros recursos. Las cuentas nuevas obtienen una VPC por defecto. El uso avanzado (separación de subredes públicas/privadas, NAT gateways) requiere un estudio más profundo.

## 6.6 Otros servicios comunes

### Registro de dominios

- **Global:** Namecheap, Cloudflare Registrar (privacidad WHOIS gratuita), GoDaddy
- **AWS:** Route 53 (también hace registros)
- **China:** Alibaba Cloud Wanwang, Tencent Cloud DNSPod (necesario para el registro ICP)

### SES (Simple Email Service) — Envío de correos

No montes tu propio servidor de correo (probablemente acabarás en el spam). Usa un servicio de correo profesional.

- **AWS SES**, SendGrid, Mailgun, Resend
- **China:** Alibaba Cloud Direct Mail, Tencent SES
- Usos: correos de verificación, notificaciones, correos de marketing

### SNS (Simple Notification Service) — Notificaciones SMS/Push

Para SMS y notificaciones push móviles. Twilio es la alternativa global popular para SMS.

### CloudWatch — Monitorización y registro

Monitorea CPU/memoria/disco de EC2, ve los registros de la aplicación, configura alertas (CPU alta, servicio caído).

- **Alibaba Cloud:** Cloud Monitor + SLS (Log Service)
- **Tencent Cloud:** Cloud Monitor + CLS
- **Alternativa para principiantes:** la monitorización integrada de PM2 + Uptime Kuma (open-source, un solo contenedor Docker)

### S3 Avanzado: procesamiento de imágenes / disparadores Lambda

S3 puede activar automáticamente funciones Lambda cuando se suben archivos. Por ejemplo, cuando un usuario sube una foto grande, una función Lambda puede redimensionarla y generar miniaturas automáticamente. En China, Alibaba OSS tiene procesamiento de imágenes integrado (añade `?x-oss-process=image/resize,w_300` a las URLs) y Tencent COS tiene Cloud Infinite (CI) para funciones similares.

## 6.7 Mapa de servicios en la nube: AWS ↔ Nubes chinas ↔ Alternativas

Referencia rápida para encontrar servicios equivalentes:

| Categoría | AWS | Alibaba Cloud | Tencent Cloud | Alternativa gratuita/de bajo coste |
|----------|-----|--------------|---------------|------------------------|
| Servidores en la nube | EC2 | ECS | CVM / Lighthouse | DigitalOcean / Vultr / Hetzner |
| Almacenamiento de objetos | S3 | OSS | COS | Cloudflare R2 (cero salida) |
| Base de datos relacional | RDS | RDS | TDSQL-C/CDB | Supabase / Neon |
| Caché Redis | ElastiCache | ApsaraDB Redis | TencentDB Redis | Upstash |
| CDN | CloudFront | CDN/DCDN | CDN/EdgeOne | Cloudflare CDN (gratis) |
| Balanceador de carga | ALB/NLB | SLB/ALB | CLB | Nginx autoalojado / Caddy |
| Serverless | Lambda | Function Compute | SCF | Cloudflare Workers |
| Contenedores/K8s | ECS/EKS | ACK | TKE | Fly.io / Railway |
| DNS | Route 53 | Alibaba Cloud DNS | DNSPod | Cloudflare DNS (gratis) |
| Certificados SSL | ACM (gratis) | Certificados gratis | Certificados gratis | Let's Encrypt (gratis) |
| Correo | SES | Direct Mail | SES | Plan gratuito de Resend / SendGrid |
| SMS | SNS | SMS | SMS | Twilio |
| Monitorización | CloudWatch | Cloud Monitor | Cloud Monitor | Uptime Kuma (autoalojado) |
| APIs de IA/ML | Bedrock | Tongyi Qianwen/Bailian | Hunyuan/TI | API de OpenAI / Anthropic |
| Registro de dominios | Route 53 | Wanwang | DNSPod | Namecheap / Cloudflare |

## 6.8 Preguntas frecuentes de principiantes

**P: ¿Debo usar servicios gestionados en la nube o autoalojar todo en un VPS?**

- **Proyectos personales / aprendizaje:** autoalojar en un VPS (todo con Docker Compose) — más barato y aprendes más.
- **Producción con usuarios reales:** usa servicios gestionados para bases de datos y almacenamiento de objetos (copia de seguridad automática, estabilidad); la aplicación puede quedarse en el VPS.
- **Proyectos con financiación/equipo:** usa servicios gestionados en la nube siempre que puedas — dedica tiempo a la lógica de negocio, no a las operaciones.

**P: ¿Cómo uso el Free Tier de AWS sin que me cobren?**

1. Lanza siempre instancias **t2.micro/t3.micro** (marcadas como "Free tier eligible")
2. Configura una **Billing Alarm** de $0 o $1 (Billing Dashboard → Budgets → Create budget)
3. **Termina/elimina** los recursos al terminar: instancias EC2, bases de datos RDS, buckets S3, volúmenes EBS, IPs elásticas
4. Ten en cuenta que los volúmenes EBS y las IPs elásticas **siguen cobrando incluso cuando la instancia está detenida** si no se eliminan
5. Revisa el Billing Dashboard mensualmente

**P: ¿AWS u otros proveedores de VPS?**

- Aprender el ecosistema de AWS / prepararse para trabajos en la nube → Usa el Free Tier de AWS
- Despliegue rápido, proyectos simples, coste mínimo → DigitalOcean ($4/mes) o Hetzner (€3,49/mes)
- Pruebas por horas → Vultr (facturación por horas, destruye cuando quieras)
- Cargas de trabajo de IA/GPU → Modal o Lambda Labs
- Contenedor completamente gratis 24/7 → plan gratuito de Fly.io

---

# 7. Plataformas de despliegue específicas para agentes de IA

Si vas a desplegar agentes de IA (no solo aplicaciones web normales), hay plataformas diseñadas específicamente para cargas de trabajo de IA:

## 7.1 Modal — GPU Serverless para Python IA/ML

**Sitio web:** https://modal.com

**Ideal para:** proyectos Python de IA que necesitan inferencia con GPU, trabajos programados, procesamiento de datos por lotes

**Características:**
- Define funciones con decoradores de Python, `modal deploy` para desplegar con un solo comando
- Arranque en frío del contenedor GPU de ~1 segundo, facturado por milisegundo
- Programación integrada, gestión de secretos, almacenamiento compartido
- El plan gratuito incluye $30/mes de crédito (suficiente para la mayoría de proyectos personales)
- Solo admite Python

```python
import modal
app = modal.App("my-ai-agent")

@app.function(gpu="A10G", timeout=300)
def run_agent(prompt: str):
    # Ejecuta aquí tu modelo/agente de IA
    return result
```

## 7.2 Hugging Face Spaces — Primera opción para demos de IA

**Sitio web:** https://huggingface.co/spaces

**Ideal para:** mostrar rápidamente demos de IA (interfaz Gradio/Streamlit), exhibición de modelos de código abierto

**Características:**
- Instancias CPU pequeñas gratuitas; GPU disponible de pago
- Compatible con Gradio, Streamlit, Docker
- Comunidad activa; cada Space tiene código público y debates
- Fork de los Spaces de otros con un clic para modificarlos

## 7.3 Replicate — Convierte modelos en APIs

**Sitio web:** https://replicate.com

**Ideal para:** convertir modelos de IA en APIs HTTP invocables sin gestionar servidores

Sube tu modelo, Replicate lo empaqueta en una API HTTP y cobra por llamada. Ideal para publicar modelos fine-tuned.

## 7.4 Lambda Labs — Instancias GPU bajo demanda

**Sitio web:** https://lambdalabs.com

**Ideal para:** entrenamiento e inferencia intensivos en GPU a menor coste que las instancias GPU de AWS/GCP. A100, H100, A10 disponibles bajo demanda.

---

# 8. 🎯 Flujo de trabajo de despliegue vibecoding: deja que la IA sea tu DevOps

Esta es la mentalidad más importante para el despliegue en la era del vibecoding: **no necesitas memorizar cada comando — la IA es tu asistente de DevOps.**

## 8.1 Dos modos de colaboración con la IA

**Modo 1: Generar scripts localmente, ejecutarlos manualmente**

Dile a tu asistente de programación con IA (Claude Code, Trae Solo, Cursor):

> "Quiero desplegar [descripción del proyecto] en [plataforma/servidor]. Genera:
> 1. Una lista de verificación completa de despliegue paso a paso
> 2. Todos los archivos de configuración necesarios (Nginx, PM2, Dockerfile, docker-compose)
> 3. Un script de despliegue deploy.sh
> 4. Una lista de verificación de variables de entorno"

Luego solo ejecuta lo que la IA genera.

**Modo 2: La IA se conecta por SSH directamente a tu servidor (aún más fácil)**

Claude Code admite operaciones SSH remotas:

```bash
claude
# Dile:
# "SSH a root@MY-IP y despliega /root/myapp, configura Nginx + HTTPS + PM2"
```

La IA comprobará automáticamente el entorno, instalará las dependencias que falten, traerá el código, compilará, configurará y verificará — todo sin que tengas que escribir comandos manualmente.

> ⚠️ **Recordatorios de seguridad:**
> - Practica primero en un servidor de pruebas para confirmar que la IA no hará cambios destructivos
> - Haz copias de seguridad de los datos importantes con regularidad
> - Dale a la IA un usuario con privilegios mínimos (no le des root; un usuario sudo está bien, pero vigila los comandos)
> - Antes de que la IA ejecute comandos peligrosos, revisa lo que va a hacer

## 8.2 Plantilla universal de mensaje de despliegue

No importa qué plataforma/servidor elijas, rellena esto y envíalo a la IA para obtener un plan completo y accionable:

```
Ayúdame a desplegar un proyecto con la siguiente información:

[OBJETIVO DEL DESPLIEGUE]
- Plataforma/Servidor: [Vercel / Railway / Fly.io / Ubuntu 22.04 VPS / AWS EC2 / ...]
- IP del servidor (si es VPS): xxx.xxx.xxx.xxx
- Ya configurado: [Acceso por clave SSH / Docker instalado / Nginx instalado / ...]

[INFORMACIÓN DEL PROYECTO]
- Tipo de proyecto: [Next.js 14 / Vite+React / Node.js Express / Python FastAPI / ...]
- Ubicación del código: repositorio de GitHub https://github.com/xxx/xxx
- Stack tecnológico: Node.js 20 + PostgreSQL 16 + Redis 7
- Comando de inicio: npm run start
- Escucha en el puerto: 3000
- Variables de entorno: DATABASE_URL=xxx, JWT_SECRET=xxx, OPENAI_API_KEY=xxx

[DOMINIO]
- Dominio: mydomain.com
- DNS ya apuntando al servidor: Sí/No
- ¿Necesita HTTPS?: Sí/No

[REQUISITOS]
1. Pasos completos (indica por separado las operaciones locales y las del servidor)
2. Proporciona todos los archivos de configuración
3. Dime cómo verificar que el despliegue ha tenido éxito
4. Enumera las trampas habituales y los pasos de resolución de problemas
```

## 8.3 Flujo de trabajo de resolución de problemas asistido por IA

Cuando algo se rompe:

1. **Revisa primero los registros:**
   - Nginx: `sudo tail -50 /var/log/nginx/error.log`
   - PM2: `pm2 logs myapp`
   - Docker: `docker compose logs app`
   - systemd: `sudo journalctl -u myapp -n 50`

2. **Copia el error completo a la IA** con contexto:
   > "Desplegando Node.js en Ubuntu, recibo 502 Bad Gateway. Registro de errores de Nginx: [pega]. Configuración: [pega]. Estado de PM2: [pega]. Ayúdame a depurar."

3. **Referencia rápida de problemas comunes:**
   - **502 Bad Gateway:** el backend no está en ejecución, puerto equivocado, proxy_pass incorrecto
   - **No se puede acceder a la IP:** el security group no permite el puerto, ufw bloqueando, Nginx no iniciado
   - **Al refrescar da 404:** a Nginx le falta `try_files` para el enrutado SPA
   - **Los activos estáticos dan 404:** ruta raíz incorrecta, permisos de archivos
   - **El certificado HTTPS falla:** el dominio no apunta al servidor, puerto 80 bloqueado
   - **PM2 se reinicia continuamente:** error de código que provoca el cierre, revisa `pm2 logs`
   - **Timeout de función de Vercel:** supera el límite de 10 s — cambia a Fly.io/Railway/VPS para tareas de larga duración
   - **Railway/Render 503:** el servicio está dormido o se han agotado los créditos
   - **AWS EC2 conexión rechazada:** falta la regla SSH en el security group o puerto equivocado

---

# 9. Consejos post-despliegue

## 9.1 Transferencia de archivos

```bash
# Local → Servidor
scp ./file.zip yourname@IP:/home/yourname/
scp -r ./dir yourname@IP:/home/yourname/

# Servidor → Local
scp yourname@IP:/home/yourname/file.zip ./

# rsync (sincronización incremental, recomendado para el despliegue)
rsync -avz --exclude=node_modules --exclude=.git ./project/ yourname@IP:/var/www/project/
```

## 9.2 Script de actualización con un solo comando

Crea `deploy.sh` en tu servidor:

```bash
#!/bin/bash
set -e
cd /path/to/project
git pull origin main
npm install
npm run build
pm2 restart myapp
echo "✅ ¡Despliegue completado!"
```

Las actualizaciones son simplemente `bash deploy.sh`. Para automatización completa, configura GitHub Actions (pide a la IA que escriba la configuración CI/CD) para que los pushes de código a main se desplieguen automáticamente.

## 9.3 Lista de verificación de endurecimiento de seguridad

Pide a la IA que genere un script completo de endurecimiento, que normalmente incluye:
- Desactivar el acceso por contraseña, usar solo claves SSH
- Cambiar el puerto SSH por defecto (22 → otro)
- Instalar fail2ban (prohíbe automáticamente las IPs de fuerza bruta)
- Activar las actualizaciones de seguridad automáticas: `sudo apt install unattended-upgrades`
- Nunca subir secretos/.env a Git
- Programar copias de seguridad periódicas de la base de datos a S3

---

# 10. Resumen del capítulo

**Resumen de opciones de despliegue:**

| Escenario | Recomendado | Coste | Dificultad |
|----------|------------|------|-----------|
| Frontend/documentación puros | Cloudflare Pages / Vercel / GitHub Pages | Gratis | ⭐ |
| Next.js full-stack (respuesta rápida) | Vercel | Gratis / $20/mes | ⭐ |
| API backend / Bot (siempre activo) | Railway / Fly.io (gratis) / VPS | $0-10/mes | ⭐⭐ |
| Full-stack (control total) | DigitalOcean / Vultr / AWS EC2 + Docker | $4-10/mes | ⭐⭐⭐ |
| Demos de agentes de IA | Hugging Face Spaces | Gratis | ⭐ |
| Inferencia GPU de IA | Modal (global) | $0-30/mes de crédito | ⭐⭐ |
| Producción con usuarios | Servicios gestionados de AWS/Azure/GCP | Variable | ⭐⭐⭐ |

**Recuerda los 5 pasos clave:**
1. **Elige una plataforma** → según el tipo de tu proyecto (usa la tabla de arriba)
2. **Lleva el código allí** → git push / rsync / auto-despliegue de GitHub
3. **Configura el entorno** → instala Node.js/Nginx/Docker (o la plataforma se encarga)
4. **Mantenlo funcionando** → PM2 / Docker / systemd
5. **Dominio + HTTPS** → registros DNS + Certbot / ACM

**Mentalidad vibecoding:**
1. Entiende *qué* hay que hacer, no cada comando
2. Describe los requisitos con claridad a la IA — ella da soluciones completas
3. Entiende lo que hace la IA, confirma los pasos clave
4. Cuando aparezcan errores, pega los registros a la IA — ella diagnostica el 90 % de los problemas
5. Haz copias de seguridad de los datos importantes, usa privilegios mínimos

Despliega una vez y te darás cuenta — salir a Internet no es tan difícil. 🎯

---

<RelatedArticlesSection
  :articles="relatedArticlesMap['es-es/stage-2/backend/cloud-server-deployment']"
  title="Artículos relacionados"
  description="Continúa aprendiendo las habilidades de ingeniería en torno al despliegue."
/>
