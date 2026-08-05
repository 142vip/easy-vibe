# Introducción a la automatización CI/CD
::: tip 🎯 Pregunta central
**El código funciona perfectamente en local, ¿cómo hacer que todo el mundo pueda acceder a él?**
:::

---

## 1. Motivación de poner un servicio en línea

Imagina que preparas una mesa llena de platos deliciosos en tu casa. Pero el problema es que solo tu familia puede probarlos. Los vecinos, el portero, los desconocidos... nadie más puede disfrutarlos.

¿Qué hacer? Necesitas **llevar la comida a un restaurante**. Eso es exactamente lo que significa "poner un servicio en línea": trasladar el código que has escrito desde tu ordenador personal a un "ordenador público" que está encendido 24/7. Así, cualquiera con acceso a internet podrá visitar tu sitio web.

<DeploymentOverviewDemo />

Poner un servicio en línea implica muchos pasos. Igual que abrir un restaurante no es solo sacar los platos, también necesitas alquilar un local, decorarlo, obtener licencias, contratar personal, etc. Con el desarrollo web ocurre lo mismo. Desde el código hasta que el usuario puede acceder al sitio web, hay muchos pasos intermedios: construcción, despliegue, configuración de red, seguridad, etc.

A continuación, desglosaré todo el proceso. Cada paso se explicará con detalle. Garantizo que incluso alguien sin experiencia previa podrá entenderlo.

---

## 2. Construcción: convertir el código en un "artefacto de compilación portátil"

### 2.1 Motivación de construir

Los principiantes suelen preguntar: si el código ya está listo, ¿por qué no se puede poner directamente en el servidor para que los usuarios accedan?

Para responder, primero hay que entender qué formato tiene tu código. Puedes estar usando frameworks como Vue, React, Express, Koa, etc. Estos frameworks tienen algo en común: **no están diseñados para que el navegador o el servidor los usen directamente**.

Por ejemplo, cuando escribes código Vue, ¿usas etiquetas como `<template>` y `<script setup>`? Esta sintaxis solo la entiende Vue. El navegador no la comprende en absoluto. El navegador solo reconoce tres lenguajes: HTML (estructura de la página), CSS (estilos de la página) y JavaScript (lógica de la página). La sintaxis de componentes Vue es como un jeroglífico para el navegador, completamente incomprensible.

Por eso, antes de poner el código en el servidor, hay que hacer algo importante: **traducirlo a un lenguaje que el navegador pueda entender**. Este proceso de traducción se llama "construcción" (Build).

### 2.2 Introducción a exactamente la construcción

La construcción no es solo traducción. También realiza muchas optimizaciones para que el sitio web funcione más rápido y consuma menos recursos. Veamos en detalle qué hace:

**Paso 1: Resolución de dependencias**

Al escribir código, utilizas varias librerías de terceros. Como Vue, Vue Router, Axios, Vite, etc. Es imposible que los usuarios las descarguen de npm cada vez. Sería demasiado lento. La herramienta de construcción analiza el código, encuentra todas las dependencias y las "empaqueta" juntas.

**Paso 2: Compilación y transformación**

Este es el paso central. Compila los componentes Vue a HTML y JavaScript. Compila SASS/LESS a CSS. Transforma la nueva sintaxis ES6+ a código ES5 más compatible. Tras este paso, el código pasa de "formato legible por desarrolladores" a "formato ejecutable por máquinas".

**Paso 3: Minificación y ofuscación**

La minificación elimina todos los espacios, saltos de línea y comentarios. Cambia los nombres de variables de palabras a letras individuales. Por ejemplo, `userName` se convierte en `a`, `calculateTotalPrice` se convierte en `b`. Así el tamaño del archivo se reduce drásticamente y los usuarios pueden descargarlo más rápido. El código ofuscado es prácticamente ilegible para humanos, lo que también aporta cierta "protección del código".

**Paso 4: División del código**

Puede que hayas escrito 10 páginas. Cada página tiene su propio código. Pero el usuario puede que solo visite una de ellas. ¿Por qué debería descargar el código de las otras 9? La herramienta de construcción divide el código en múltiples fragmentos. El usuario descarga solo el código de la página que visita. Esto es "carga bajo demanda" y mejora enormemente la velocidad de la primera visita.

**Paso 5: Generación de hashes**

Este es un paso muy importante pero que muchos pasan por alto. Tras la construcción, los nombres de archivo toman un formato como `app.abc123.js` o `vendor.def456.css`. La cadena alfanumérica final se llama "hash".

La función del hash es: cuando el código cambia, el valor del hash también cambia. El navegador sabe que "este archivo ha cambiado, hay que descargarlo de nuevo". Los archivos que no cambian, el navegador sigue usando la caché. Así se garantiza que los usuarios vean el código más reciente y se aproveche la caché para mejorar la velocidad.

<DeploymentBuildDemo />

### 2.3 Enfoque para ejecutar la construcción

La mayoría de proyectos frontend modernos ya tienen la herramienta de construcción configurada. Solo necesitas recordar un comando:

```bash
# Si usas npm
npm run build

# Si usas yarn
yarn build

# Si usas pnpm
pnpm build
```

Tras ejecutarlo, ve a la raíz del proyecto y busca una carpeta llamada `dist` (a veces también `build` o `.output`). Dentro están todos los archivos construidos. Estos son los archivos finales que se subirán al servidor. No necesitan ninguna modificación adicional. Solo hay que copiarlos al servidor.

### 2.4 Qué hay en los artefactos de construcción

Al abrir la carpeta dist, verás principalmente tres tipos de archivos:

- **Archivos HTML**: normalmente `index.html`. Es el archivo de entrada. El navegador lo carga primero.
- **Archivos JS**: todo el código JavaScript. Puede ser uno o varios.
- **Archivos CSS**: todos los estilos. Pueden estar inline en el HTML o como archivos CSS independientes.

Si es un proyecto backend más complejo (como Node.js), el artefacto de construcción puede ser un archivo ejecutable o una imagen Docker. Pero el principio es el mismo: transformar el código en un formato que el servidor pueda ejecutar directamente.

---

## 3. Servidor: encontrar una "casa" que nunca cierra

### 3.1 Introducción a exactamente un servidor

Mucha gente, al oír "servidor" por primera vez, piensa que es algún dispositivo misterioso y sofisticado. En realidad no es tan complicado. **Un servidor es un ordenador**. Un ordenador que nunca se apaga y que siempre está conectado a internet.

Alguien podría preguntar: ¿no tengo ya un ordenador en casa? ¿Por qué gastar dinero en alquilar un servidor?

Buena pregunta. Vamos a analizarlo:

Primero, tu ordenador de casa no puede estar encendido 24 horas. Tienes que salir, dormir, y a veces se cuelga o se reinicia. Pero un servidor es diferente. Está diseñado específicamente para esto. Puede funcionar 365 días al año sin parar. El sitio web siempre está accesible.

Segundo, tu conexión doméstica tampoco es suficiente. La velocidad de subida del broadband doméstico suele ser lenta. Además, la IP del broadband doméstico es dinámica. Hoy es una IP, mañana puede ser otra. No sirve para alojar un sitio web. Los servidores usan redes de alta velocidad de centros de datos. IP fija, velocidad muy rápida.

Tercero, tu ordenador de casa no tiene una "IP pública". ¿Qué es una IP pública? Es una dirección única en todo el mundo. Solo con esta dirección, otros pueden encontrar tu ordenador en internet. La IP de tu ordenador de casa normalmente solo funciona dentro de tu red local. La gente de fuera no puede encontrarte. Los servidores son diferentes. Tienen una IP pública fija. Todo el mundo puede encontrarlos a través de esa IP.

<DeploymentServerDemo />

### 3.2 Enfoque de elegir un servidor

Para elegir un servidor, hay tres indicadores principales: **núcleos de CPU**, **memoria RAM** y **espacio en disco**. Cuanto más altos sean estos indicadores, mejor será el rendimiento del servidor y más caro será.

Para un principiante, no hace falta comprar una configuración muy cara. Recuerda esta regla sencilla:

- **Proyectos personales, aprendizaje**: 1 núcleo y 2 GB de RAM son suficientes. Unos decenas de yuanes al mes.
- **Proyectos comerciales pequeños**: 2 núcleos y 4 GB de RAM. Puede soportar de miles a decenas de miles de visitas diarias.
- **Proyectos medianos**: 4 núcleos y 8 GB o superior. Necesita un equipo profesional de operaciones.

Otro aspecto a considerar: **la ubicación**. Si tus usuarios están principalmente en China, compra servidores nacionales (Alibaba Cloud, Tencent Cloud) para mayor velocidad de acceso. Si tus usuarios están principalmente en el extranjero, compra servidores internacionales (AWS, Google Cloud, DigitalOcean), o servidores en Hong Kong. Rápidos y sin necesidad de registro ICP.

### 3.3 Nacional o extranjero

Esta es una pregunta muy importante. Mucha gente no lo piensa al principio y luego tiene problemas.

**Ventajas de comprar servidores nacionales**: velocidad rápida, baja latencia. Desventaja: necesitas hacer el registro ICP (presentar la información del sitio web para su revisión por las autoridades competentes). Suele tardar de una semana a un mes. Además, los servidores nacionales son relativamente más caros.

**Ventajas de comprar servidores extranjeros**: no necesitas registro ICP. Lo compras y listo para usar. El precio también puede ser más barato. Desventaja: la velocidad de acceso para usuarios en China continental puede ser más lenta. Si el datacenter está en Hong Kong o Singapur será mucho mejor.

Recomendación: si es un proyecto personal o un sitio web de demostración, compra un servidor en Hong Kong o el extranjero. Te ahorras los trámites del registro ICP. Si es un proyecto comercial formal que necesita operar a largo plazo, compra servidores nacionales. Haz el registro ICP correctamente, te ahorrarás muchos problemas en el futuro.

### 3.4 Comparativa de principales proveedores cloud

| Proveedor | Público objetivo | Características | Precio para nuevos usuarios |
|------|---------|------|-----------|
| Alibaba Cloud | Negocios en China | Líder del mercado, ecosistema completo | Desde decenas a poco más de 100 yuanes el primer año |
| Tencent Cloud | Mini programas, juegos | Buen soporte para desarrollo cloud de mini programas | Grandes descuentos el primer año |
| Huawei Cloud | Usuarios empresariales | Primera opción para proyectos gubernamentales | Precio relativamente alto |
| DigitalOcean | Desarrolladores | Sencilillo y fácil de usar, precios transparentes | Desde $4/mes |
| Vercel | Proyectos frontend | Sin configuración, deploy automático con push | Capacidad gratuita suficiente |

Para principiantes, lo más recomendable son las ofertas para estudiantes o nuevos usuarios de **Alibaba Cloud** o **Tencent Cloud**. Normalmente solo cuestan decenas de yuanes al año. Excelente relación calidad-precio. Si es un proyecto puramente frontend y quieres evitar complicaciones, también puedes usar **Vercel** o **Netlify**. Ni siquiera necesitas comprar un servidor. Solo sube el código y se despliega automáticamente.

### 3.5 Qué hacer después de recibir el servidor

Después de comprar el servidor, recibirás un correo electrónico con información importante:

- **Dirección IP**: una secuencia de números como `123.45.67.89`. Es la dirección del servidor en internet.
- **Nombre de usuario**: normalmente `root` (cuenta de administrador).
- **Contraseña**: la contraseña inicial, o un enlace para establecerla.

Con esta información, puedes iniciar sesión remotamente en el servidor usando **SSH (Secure Shell)** para configurarlo. SSH es como enviar un comando remoto cifrado al servidor, permitiéndote operar un servidor lejano desde tu propio ordenador.

El comando para iniciar sesión es:

```bash
ssh root@123.45.67.89
# Tras pulsar Enter te pedirá la contraseña. Introduce la contraseña correcta y habrás iniciado sesión.
```

Una vez iniciada sesión, entrarás en la interfaz de línea de comandos del servidor. Es similar a abrir una ventana de terminal en tu propio ordenador. Puedes instalar software, crear carpetas, modificar configuraciones. Todo funciona igual que en local.

---

## 4. Despliegue: mudar el código a la "casa"

### 4.1 Introducción a despliegue

Despliegue es, después de alquilar el servidor (la casa), mover el código (el equipaje y los muebles) y abrir las puertas para empezar a funcionar.

Específicamente, el despliegue incluye los siguientes pasos:

1. **Subir el código al servidor**: transferir los artefactos de construcción desde el ordenador local al servidor.
2. **Instalar dependencias**: el servidor puede no tener los paquetes necesarios. Hay que instalarlos.
3. **Configurar variables de entorno**: como contraseñas de base de datos, claves API y otra información sensible.
4. **Iniciar el servicio**: hacer que la aplicación se ejecute y empiece a escuchar las peticiones de los usuarios.

Estos cuatro pasos suenan complicados, pero en realidad no son tan difíciles. A continuación se detalla cómo hacer cada uno.

<DeploymentServerDemo />

### 4.2 Enfoque de subir el código al servidor

**Método 1: Subida por FTP/SFTP**

Es la forma más intuitiva. Como usar un disco en la nube. Arrastras los archivos al servidor. Puedes descargar un software gratuito llamado **FileZilla** en tu ordenador. Introduce la IP del servidor, nombre de usuario y contraseña. Podrás gestionar los archivos del servidor como si fueran archivos locales.

**Método 2: Git pull**

Es el método más recomendado. Primero crea un repositorio de código en GitHub, GitLab o Gitee. Sube el código a la nube. Luego usa el comando `git clone` en el servidor para descargar el código.

La ventaja es: para actualizar el código, solo necesitas ejecutar `git pull` en el servidor. No tienes que subir archivos manualmente cada vez. Además, el código está seguro en la nube. Aunque reinstales el servidor, no hay problema.

**Método 3: Despliegue automático con CI/CD**

Es el método más profesional y el más recomendado. Configurando CI/CD (Integración Continua/Despliegue Continuo), solo necesitas subir el código a GitHub. El sistema CI/CD se encarga automáticamente de: descargar el código → instalar dependencias → construir → desplegar. Ni siquiera necesitas iniciar sesión en el servidor. Todo se hace automáticamente.

### 4.3 Pasos concretos del despliegue

Supongamos que usamos el método más sencillo: despliegue manual con Git. Veamos el proceso paso a paso:

**Paso 1: Conectar al servidor**

```bash
ssh root@123.45.67.89
```

**Paso 2: Instalar el software necesario**

Si es un proyecto Node.js, primero hay que instalar Node.js:

```bash
# Ejemplo para sistema Ubuntu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

**Paso 3: Descargar el código**

```bash
# Crear el directorio para el sitio web
mkdir -p /var/www/my-website
cd /var/www/my-website

# Clonar el repositorio (necesitas haber creado el repositorio en GitHub antes)
git clone https://github.com/tu-usuario/tu-repo.git .
```

**Paso 4: Instalar dependencias y construir**

```bash
# Instalar dependencias del proyecto
npm install

# Construir el proyecto (genera el directorio dist)
npm run build
```

**Paso 5: Iniciar el servicio con PM2**

¿Por qué usar PM2? Es una herramienta de gestión de procesos. Permite que el sitio web se ejecute continuamente en segundo plano. Incluso si el servidor se reinicia, se iniciará automáticamente.

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar el sitio web (suponiendo que el archivo de entrada es index.js)
pm2 start index.js

# Configurar inicio automático al arrancar
pm2 startup
pm2 save
```

**Paso 6: Configurar el proxy inverso de Nginx**

Las aplicaciones Node.js suelen ejecutarse en puertos como 3000 o 8080. Pero los usuarios acceden por el puerto 80 (puerto por defecto de HTTP). Necesitamos Nginx para reenviar las peticiones del puerto 80 al puerto de la aplicación.

```bash
# Instalar Nginx
sudo apt install -y nginx

# Crear archivo de configuración de Nginx
sudo nano /etc/nginx/sites-available/my-website
```

En el editor que se abre, escribe la siguiente configuración:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    # Archivos estáticos (artefactos de construcción) se devuelven directamente
    location / {
        root /var/www/my-website/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Las peticiones API se reenvían al backend Node.js
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

Después de guardar y salir, activa esta configuración:

```bash
# Activar la configuración
sudo ln -s /etc/nginx/sites-available/my-website /etc/nginx/sites-enabled/

# Verificar si hay errores en la configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

Ahora, al visitar `http://example.com` (recuerda configurar la resolución DNS del dominio a la IP de este servidor), deberías poder ver el sitio web.

---

## 5. Dominio y DNS: ponerle un buen nombre al sitio web

### 5.1 Motivación de comprar un dominio

Teniendo la IP del servidor, ¿por qué还需要 comprar un dominio?

Piensa en ello. ¿Recordar una secuencia de números como `123.45.67.89` no es difícil? ¿No es fácil equivocarse? Pero recordar nombres como `baidu.com` o `taobao.com` ¿no es mucho más fácil?

El dominio es el nombre del sitio web. Fácil de recordar, profesional, y también refleja la imagen de marca. Imagina decirle a alguien "visita mi sitio web, la IP es 123.45.67.89", comparado con "visita misitioincreible.com". ¿Cuál suena mejor?

<DeploymentDnsDemo />

### 5.2 Introducción a DNS

Bien. Ahora has comprado un dominio. Por ejemplo `mi-sitio-increible.com`. Pero surge el problema: los ordenadores solo entienden direcciones IP. No entienden el lenguaje humano "mi-sitio-increible.com".

Aquí es donde entra DNS. DNS significa "Domain Name System" (Sistema de Nombres de Dominio). Se puede entender como una "agenda telefónica" gigante que se encarga de traducir los nombres de dominio fáciles de recordar en direcciones IP que los ordenadores pueden entender.

Cuando escribes `mi-sitio-increible.com` en el navegador y pulsas Enter, esto es lo que ocurre en segundo plano:

1. El navegador pregunta a DNS: "hey, ¿cuál es la dirección IP de mi-sitio-increible.com?"
2. DNS busca en la "agenda telefónica" y responde al navegador: "su IP es 123.45.67.89"
3. El navegador usa esa dirección IP para encontrar el servidor y enviar la petición

Todo este proceso suele tardar solo unas decenas de milisegundos. El usuario no se da cuenta.

### 5.3 Enfoque para configurar DNS

La configuración de DNS se puede hacer normalmente en dos lugares:

**Método 1: Configurar en el proveedor donde compraste el dominio**

Configura los registros DNS donde compraste el dominio. El tipo de registro más común es el **registro A**:

- **Tipo de registro**: A
- **Registro de host**: normalmente `@` (representa el dominio en sí, como mi-sitio-increible.com) o `www` (representa www.mi-sitio-increible.com)
- **Valor del registro**: la dirección IP del servidor, como `123.45.67.89`

**Método 2: Usar un servicio DNS de terceros**

Muchos profesionales no usan el DNS que viene con el proveedor del dominio. En su lugar, usan servicios DNS profesionales como Cloudflare, Alibaba Cloud DNSPod o Tencent Cloud DNS. Estos servicios suelen ser más estables, con resolución más rápida. Además incluyen funciones adicionales como CDN y protección DDoS.

### 5.4 Cuánto tarda en surtir efecto DNS

Esta es una pregunta que mucha gente se hace. La respuesta es: **depende. Normalmente entre unos minutos y 24 horas**.

Tras modificar el DNS, todos los servidores DNS del mundo necesitan sincronizar este cambio. Es como tirar una piedra al océano. Las olas tardan en llegar a la orilla lejana. Algunos servidores DNS se actualizan rápido, en minutos. Otros son más lentos y pueden tardar mucho.

Puedes verificar si DNS ha surtido efecto con el siguiente comando:

```bash
# Windows
ping tu-dominio

# Mac/Linux
ping tu-dominio
```

Si el ping funciona y muestra la IP del servidor, significa que DNS ya ha surtido efecto.

---

## 6. HTTPS: instalar un "candado" en el sitio web

### 6.1 Diferencia entre HTTP y HTTPS

Puede que hayas notado que algunas direcciones web empiezan por `http://` y otras por `https://`. Esa "s" es muy importante. Significa "Seguro" (Secure).

**HTTP (HyperText Transfer Protocol)** es el protocolo utilizado para transmitir páginas web. Se puede entender como el camión que transporta datos. Pero este camión es **transparente**. Todo lo que lleva dentro puede ser visto por cualquiera. En un sitio HTTP, las contraseñas y la información personal que introduces pueden ser interceptadas por cualquier intermediario durante la transmisión.

**HTTPS (HTTP Secure)** añade al camión un **contenedor sellado** con una llave. Solo el emisor y el receptor tienen la llave. Aunque alguien intercepte el envío, no podrá entender su contenido. Esto es la transmisión cifrada.

<DeploymentHttpsDemo />

### 6.2 Motivación de HTTPS

Primera razón: **seguridad**. Sin HTTPS, las contraseñas que los usuarios introducen en el sitio se transmiten en texto plano. Cualquier persona con conocimientos técnicos puede interceptarlas. Hoy en día, ¿quién se atrevería a usar un sitio sin HTTPS?

Segunda razón: **advertencias del navegador**. Ahora Chrome, Edge y otros navegadores principales muestran una advertencia de "inseguro" para sitios sin HTTPS. Cuando los usuarios ven el icono de advertencia, se van inmediatamente. Ni hablar de registrarse o pagar.

Tercera razón: **SEO**. Google, Baidu y otros buscadores dan prioridad a sitios HTTPS. El posicionamiento SEO será mejor.

### 6.3 Enfoque de obtener un certificado HTTPS

Antes, los certificados HTTPS eran caros. Costaban cientos o incluso miles de yuanes al año. Ahora las cosas han mejorado. Existe una organización llamada **Let's Encrypt** que proporciona certificados SSL/TLS completamente gratuitos. Y la comunidad tiene muchas herramientas automáticas para ayudarte a instalarlos y renovarlos.

**Método 1: Usar Certbot (recomendado)**

Certbot es una herramienta que solicita y configura automáticamente certificados de Let's Encrypt. Muy sencilla:

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Solicitar certificado y configurar Nginx en un solo paso
sudo certbot --nginx -d example.com -d www.example.com
```

Durante el proceso te hará algunas preguntas. Como el correo electrónico (para recordarte la renovación del certificado). Tras responder, el certificado se configura automáticamente. Al visitar el sitio web verás un pequeño candado en la barra de direcciones.

El certificado es válido por 90 días. Pero Certbot configurará una tarea programada para renovarlo automáticamente. Básicamente, no tienes que preocuparte por ello.

**Método 2: Usar Cloudflare**

Si usas el servicio DNS de Cloudflare, no necesitas configurar el certificado HTTPS tú mismo. Cloudflare proporciona automáticamente soporte HTTPS para tu dominio. Y hasta se encarga de la renovación cada 90 días.

### 6.4 Qué cambia después de configurar HTTPS

Después de configurar HTTPS, el acceso de los usuarios pasa de `http://example.com` a `https://example.com`. Este cambio aporta una serie de garantías de seguridad:

1. **Transmisión cifrada**: toda la comunicación entre el usuario y el servidor está cifrada.
2. **Autenticación de identidad**: el certificado puede demostrar "realmente soy este sitio web". Previene sitios de phishing.
3. **Integridad de los datos**: permite detectar si los datos han sido alterados.

---

## 7. CI/CD: deja que el robot trabaje por ti

### 7.1 Introducción a CI/CD

CI/CD es la abreviatura de dos términos: **C**ontinuous **I**ntegration (Integración Continua) y **C**ontinuous **D**eployment (Despliegue Continuo). Se puede entender como un sistema robótico que trabaja automáticamente por ti.

Sin CI/CD, cada vez que querías lanzar una nueva función, el proceso era así:

1. Abrir el ordenador, iniciar sesión en GitHub
2. Descargar el código más reciente
3. Ejecutar tests para ver si hay bugs
4. Construir el proyecto manualmente
5. Iniciar sesión en el servidor
6. Descargar el código más reciente
7. Instalar dependencias
8. Construir el proyecto
9. Reiniciar el servicio

Estos 9 pasos había que hacerlos manualmente cada vez que se publicaba. ¿No es tedioso? Y es muy fácil olvidar algún paso. Como olvidar ejecutar los tests, olvidar reiniciar el servicio, etc.

Con CI/CD, el proceso queda así:

1. Subir el código a GitHub con push
2. Tomar un té y esperar
3. (El robot completa automáticamente los 9 pasos anteriores)
4. El sitio web se actualiza automáticamente

<DeploymentCicdDemo />

Esta es la magia de CI/CD: **solo necesitas subir el código. Todo lo demás se hace automáticamente**.

### 7.2 Flujo de trabajo de CI/CD

Un flujo de CI/CD típico es así:

**Paso 1: Envío de código (Push)**

Has terminado de desarrollar una nueva función. Haces push del código a GitHub.

**Paso 2: CI se activa (Integración Continua)**

GitHub detecta el cambio en el código y notifica al sistema CI (GitHub Actions, GitLab CI, etc.) para que empiece a trabajar.

**Paso 3: Instalación de dependencias y tests**

El sistema CI arranca un ordenador virtual. En él:
- Instala todas las dependencias del proyecto
- Ejecuta los tests para asegurarse de que no hay bugs
- Construye el proyecto, generando los artefactos

Si los tests fallan, CI envía una notificación por correo electrónico. El despliegue se detiene. No se desplegará código problemático en el entorno de producción.

**Paso 4: CD se ejecuta (Despliegue Continuo)**

Después de que todos los tests pasen, el sistema CI:
- Se conecta al servidor por SSH
- Descarga el código más reciente
- Instala dependencias
- Construye el proyecto
- Reinicia el servicio

Todo el proceso puede tardar solo unos minutos. Completamente automático.

### 7.3 Enfoque para configurar GitHub Actions

GitHub Actions es la función CI/CD integrada de GitHub. No requiere pago adicional (la cuota gratuita es suficiente para proyectos personales). La configuración también es muy sencilla.

Crea un archivo `.github/workflows/deploy.yml` en la raíz del proyecto con la siguiente configuración:

```yaml
name: Deploy to Production

# Condición de activación: cada vez que se sube código a la rama main
on:
  push:
    branches: [main]

# Lista de tareas
jobs:
  # Tarea de despliegue
  deploy:
    # En qué sistema se ejecuta
    runs-on: ubuntu-latest

    # Pasos concretos
    steps:
      # 1. Descargar el código
      - name: Checkout code
        uses: actions/checkout@v3

      # 2. Instalar entorno Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      # 3. Instalar dependencias y construir
      - name: Install and Build
        run: |
          npm ci
          npm run build

      # 4. Desplegar en el servidor
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

Este archivo de configuración le dice a GitHub Actions:

- Se activa cuando hay nuevo código en la rama main
- Ejecuta las tareas en un ordenador Ubuntu
- Primero instala Node.js 18
- Luego instala dependencias y construye el proyecto
- Finalmente se conecta al servidor por SSH y ejecuta una serie de comandos de despliegue

Una vez configurado, cada vez que hagas `git push origin main`, GitHub iniciará automáticamente el despliegue. Muy conveniente.

---

## 8. Monitorización y logs: ser el "guardián" del sitio web

### 8.1 Motivación de monitorizar

Una vez que el sitio web está en línea, en teoría debería funcionar 24/7 sin interrupciones. Pero en el mundo real las cosas no son tan perfectas. Los servidores pueden caerse. La red puede tener problemas. El código puede tener bugs. En un entorno de producción real, puede pasar de todo.

Sin monitorización, solo te enteras cuando un usuario te llama diciendo "el sitio no funciona". Para entonces ya es tarde. Probablemente ya has perdido usuarios.

Con monitorización, puedes:

- **Detectar problemas anticipadamente**: uso de CPU al 90%. Añade un servidor antes.
- **Localizar problemas rápidamente**: el sitio va lento. Revisa la monitorización para ver dónde está el cuello de botella.
- **Tener control**: cuántas visitas hay al día, cuándo es el pico de tráfico.

<DeploymentMonitorDemo />

### 8.2 Qué métricas monitorizar

Las métricas de monitorización más importantes son estas:

| Métrica | Rango normal | Qué hacer si se supera |
|------|---------|-----------|
| Uso de CPU | < 70% | Ampliar la configuración del servidor o optimizar el código |
| Uso de memoria | < 80% | Comprobar si hay fugas de memoria |
| Uso de disco | < 80% | Limpiar logs o archivos innecesarios |
| Disponibilidad del sitio | 100% | Comprobar si el servicio funciona correctamente |
| Tiempo de respuesta | < 2 segundos | Optimizar consultas a la base de datos o añadir caché |
| Tasa de errores | < 1% | Revisar los logs de errores para localizar el problema |

### 8.3 Enfoque para configurar la monitorización

**La solución más sencilla: Uptime Robot**

Regístrate en uptimerobot.com. Añade la URL de tu sitio web. Comprobará automáticamente cada 5 minutos si el sitio funciona correctamente. Si el sitio cae, te enviará un correo electrónico. La versión gratuita permite monitorizar 50 sitios web. Más que suficiente para proyectos personales.

**Solución avanzada: Monitorización de Alibaba Cloud/Tencent Cloud**

Si el servidor está en Alibaba Cloud o Tencent Cloud, ya incluyen funciones de monitorización. Solo necesitas configurar las alertas con los umbrales adecuados.

**Solución profesional: Prometheus + Grafana**

Estas dos son la "navaja suiza" de la monitorización. Funcionalidades muy potentes. Puedes monitorizar cualquier métrica que se te ocurra. Y además crear gráficos de visualización preciosos. Pero la configuración es más compleja. Adecuado para desarrolladores con cierta experiencia.

### 8.4 Logs: Enfoque de investigar cuando hay problemas

La monitorización te dice "el sitio tiene un problema". Pero qué problema exacto y por qué ha ocurrido, necesitas los **logs** para localizarlo.

Los logs son como el "diario" del programa durante su ejecución. Registran todo lo que va pasando:

- Qué usuario accedió a qué página y cuándo
- Cuánto tardó una consulta a la base de datos
- Si ha habido errores y cuál es el mensaje de error

**Uso básico de logs**

Ver los logs de la aplicación en el servidor:

```bash
# Ver los logs de PM2
pm2 logs

# Ver los logs de acceso de Nginx
tail -f /var/log/nginx/access.log

# Ver los logs de errores de Nginx
tail -f /var/log/nginx/error.log
```

**Solución avanzada de logs**

Si el proyecto es más complejo, se recomienda usar herramientas profesionales de recolección de logs:

- **Loki**: gratuito y de código abierto. De la misma familia que Prometheus.
- **ELK (Elasticsearch + Logstash + Kibana)**: muy potente pero de configuración compleja.
- **Sentry**: herramienta especializada en recopilar errores de aplicaciones. Recopila automáticamente la información de los errores.

### 8.5 Alertas: Enfoque de enterarte inmediatamente cuando hay un problema

La monitorización te dice que hay un problema. Pero si no estás mirando el panel de monitorización, ¿qué haces? Aquí es donde necesitas las **alertas**.

Las alertas son notificaciones automáticas que te envía el sistema de monitorización cuando detecta una anomalía, a través de SMS, WeChat, DingTalk, correo electrónico, etc. Puedes configurar diferentes niveles de alerta:

- **Urgente (el sitio está completamente caído)**: SMS + llamada telefónica. Hay que saberlo inmediatamente.
- **Severo (la tasa de errores se dispara)**: mensaje por DingTalk/WeChat. Tratar al verlo.
- **Normal (CPU alta)**: resumen por correo electrónico. Revisar una vez al día.

El principio central de la configuración de alertas es: **alertas por niveles, no te agobies**. Si cada pequeño detalle te envía un SMS, en poco tiempo desactivarás las alertas.

---

## 9. Tabla de consulta rápida de problemas comunes

| Síntoma del problema | Posible causa | Solución |
|---------|---------|---------|
| El sitio no se abre | Dominio sin resolver / Servidor caído / Nginx no iniciado | `ping dominio` para ver si hay conexión; `pm2 list` para ver el estado del servicio; `systemctl status nginx` para ver Nginx |
| La página está en blanco | Ruta incorrecta de los artefactos / Archivos estáticos mal configurados | Comprobar que la ruta root de Nginx apunta al directorio dist |
| 404 Página no encontrada | Ruta mal configurada / Error ortográfico en la ruta | Añadir `try_files $uri $uri/ /index.html` en la configuración de Nginx |
| 502 Bad Gateway | Servicio backend caído / Puerto no abierto | `pm2 list` para ver si el proceso está en ejecución; verificar si el puerto es correcto |
| 403 Forbidden | Permisos incorrectos / Índice de directorio no habilitado | Comprobar permisos de archivos `chmod -R 755`; añadir `autoindex on` en la configuración de Nginx |
| Certificado HTTPS caducado | El certificado no se ha renovado | `certbot renew` para renovar manualmente; verificar la tarea automática de renovación |
| No se ven los cambios tras actualizar | Caché del navegador / Caché de CDN | Ctrl+Shift+R para forzar la recarga; ir a la consola de CDN y "refrescar la caché" |
| El sitio abre muy lento | Ancho de banda insuficiente / Sin caché / Sin CDN | Ampliar el ancho de banda del servidor; configurar caché Redis; integrar CDN |
| No se puede conectar a la base de datos | Base de datos no iniciada / Contraseña incorrecta / Problema de permisos | Comprobar el estado del servicio de base de datos; verificar la información de conexión en la configuración |

---

## Resumen

Poner un servicio en línea es un gran proyecto sistemático. Abarca desde la construcción del código hasta el despliegue en el servidor, desde la configuración de red hasta la protección de seguridad, desde la monitorización y alertas hasta el análisis de logs. Para los principiantes, no es necesario perseguir la perfección desde el principio. Primero pon en marcha una versión mínima viable (MVP). Luego mejórala gradualmente.

Los puntos clave de todo el proceso se pueden resumir así:

### Flujo central

1. **Construcción** → Usar `npm run build` para convertir el código en HTML/CSS/JS que el navegador pueda entender
2. **Despliegue** → Subir los artefactos de construcción al servidor. Configurar proxy inverso con Nginx.
3. **Dominio** → Comprar un dominio y configurar la resolución DNS a la IP del servidor
4. **HTTPS** → Solicitar un certificado gratuito con Let's Encrypt. Proteger la transmisión de datos.
5. **CI/CD** → Configurar despliegue automático. El sitio se actualiza automáticamente después de cada push.
6. **Monitorización** → Configurar monitorización y alertas. Enterarse inmediatamente cuando hay problemas.

### Ruta de aprendizaje recomendada

- **Día 1**: Desplegar una página web estática con Vercel/Netlify. Experimentar la sensación de "código convertido en sitio web".
- **Semana 1**: Alquilar un servidor cloud. Desplegar manualmente un proyecto Node.js. Configurar dominio y HTTPS.
- **Semanas 2-4**: Configurar un flujo CI/CD completo. Establecer un sistema de monitorización y alertas.
- **Aprendizaje continuo**: Aprender containerización con Docker, clusters con Kubernetes, arquitectura de microservicios.

---

## Tabla de consulta rápida de términos

| Término | Inglés | Explicación sencilla |
|------|------|-----------|
| Construcción | Build | Traducir y empaquetar el código fuente en un formato que el navegador pueda ejecutar |
| Despliegue | Deploy | Poner el código en el servidor para que los usuarios puedan acceder |
| Servidor | Server | Un ordenador encendido 24/7 y conectado a internet |
| Dominio | Domain | El nombre fácil de recordar del sitio web (como baidu.com) |
| DNS | Domain Name System | La "agenda telefónica" que traduce dominios en direcciones IP |
| HTTP | HyperText Transfer Protocol | Protocolo de transmisión de páginas web (inseguro, texto plano) |
| HTTPS | HTTP Secure | Protocolo de transmisión cifrado de páginas web (seguro) |
| Nginx | Engine X | Servidor web de alto rendimiento. Usado como proxy inverso. |
| Proxy inverso | Reverse Proxy | El "camarero en la puerta". Reenvía las peticiones al backend. |
| SSH | Secure Shell | Herramienta cifrada para inicio de sesión remoto en servidores |
| CDN | Content Delivery Network | Red de servidores distribuida globalmente. Acelera el acceso. |
| CI/CD | Continuous Integration/Deployment | Pipeline automático. Tras hacer push del código, se testea y despliega automáticamente. |
| SSL/TLS | Secure Sockets Layer / Transport Layer Security | Protocolo de cifrado. Proporciona seguridad a HTTPS. |
| PM2 | Process Manager 2 | Gestor de procesos de Node.js. Mantiene la aplicación en ejecución continua. |
