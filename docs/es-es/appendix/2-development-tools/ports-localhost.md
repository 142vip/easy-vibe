# Principios de puertos y localhost

> 💡 **Guía de aprendizaje**: Cuando ejecutas `npm run dev` y aparece `http://localhost:5173` en la terminal, ¿te has preguntado qué es `localhost`? ¿Y `5173`? ¿Por qué a veces aparece un error `EADDRINUSE`? Este capítulo explica de una vez estos conceptos que ves todos los días en desarrollo pero que rara vez se profundizan.

Antes de empezar, te recomendamos repasar dos conceptos básicos:

- **Redes**: Si no tienes claros los conceptos de IP y HTTP, puedes consultar [Fundamentos de informática - Comunicación de red](../1-computer-fundamentals/network-fundamentals.md).
- **Terminal**: Si no estás familiarizado con la línea de comandos, consulta [Introducción a la línea de comandos y scripts de Shell](./command-line-shell.md).

---

## 0. Introducción: Introducción a realmente ese `localhost:5173` que ves todos los días

<DevServerFlowDemo />

La vida diaria de todo desarrollador gira en torno a esta línea de salida:

```
➜  Local:   http://localhost:5173/
```

Pero, ¿has pensado que en esta breve línea se esconden varios conceptos clave:

- **http://** → Protocolo de comunicación (en qué "idioma" hablar)
- **localhost** → Dirección de destino (a quién buscar)
- **:5173** → Número de puerto (una vez encontrado, a qué puerta llamar)

Entender estas tres cosas te permitirá comprender el 90% de los problemas de red en entornos de desarrollo. Vamos a desglosarlos uno por uno.

---

## 1. Introducción a puerto (IP es el edificio, el puerto es el número de habitación)

### 1.1 Una analogía intuitiva

Imagina que un servidor es un edificio:

- La **dirección IP** (como `192.168.1.100`) es la dirección del edificio — te dice "a qué edificio ir".
- El **número de puerto** (como `:80`) es el número de habitación — te dice "a qué habitación entrar".

Un edificio puede tener simultáneamente un restaurante (hab. 80), una cafetería (hab. 443) y una oficina (hab. 22). Igualmente, un ordenador puede ejecutar simultáneamente un servidor web, una base de datos y un servicio SSH, cada uno en un puerto diferente.

👇 **Pruébalo**:
Haz clic en las "placas de habitación" de abajo para simular una conexión a diferentes puertos. Observa qué sucede cuando un puerto está "abierto" (un programa escuchando) y cuando está "cerrado".

<PortAnalogyDemo />

### 1.2 Rango de valores de los puertos

Un número de puerto es un entero entre **0 y 65535** (65 536 puertos en total). Se dividen en tres rangos:

| Rango | Intervalo | Uso | Ejemplo |
| :--- | :--- | :--- | :--- |
| **Puertos de sistema** | 0 – 1023 | Reservados para protocolos estándar; usuarios normales no pueden usarlos libremente | 80 (HTTP), 443 (HTTPS), 22 (SSH) |
| **Puertos registrados** | 1024 – 49151 | Para aplicaciones comunes registradas | 3306 (MySQL), 5432 (PostgreSQL), 6379 (Redis) |
| **Puertos dinámicos** | 49152 – 65535 | Asignados temporalmente por el sistema operativo | El navegador usa uno aleatorio como puerto origen al hacer peticiones |

> ¿Por qué tu servidor de desarrollo prefiere 3000, 5173, 8080? Porque todos están en el rango de "puertos registrados": no necesitan permisos de administrador para escuchar y es poco probable que entren en conflicto con servicios del sistema.

### 1.3 Referencia rápida de puertos comunes en desarrollo

👇 **Pruébalo**:
Introduce un número de puerto o nombre de servicio para buscar; haz clic en cualquier fila para ver un ejemplo de uso.

<CommonPortsDemo />

---

## 2. Introducción a localhost (Encontrarse a uno mismo)

### 2.1 El concepto central de "loopback"

`localhost` es un nombre de dominio especial que siempre apunta a **tu propio ordenador**.

Cuando escribes `http://localhost:3000` en el navegador, ocurre lo siguiente:

1. El navegador pregunta al sistema: "¿Cuál es la IP de `localhost`?"
2. El sistema responde directamente: "`127.0.0.1`" (no necesita consultar DNS)
3. El paquete se envía a `127.0.0.1`, pero **no sale realmente del ordenador**
4. El sistema, a través de la "interfaz de loopback", hace **rebotar** el paquete de vuelta
5. El programa que escucha en el puerto 3000 recibe la petición y devuelve la respuesta

**Todo el proceso no pasa por cables de red, ni por routers, ni necesita conexión a Internet.**

👇 **Pruébalo**:
Haz clic en "Enviar petición" y observa el recorrido completo del paquete. Luego haz clic en las "tarjetas de disfraz" para conocer las diferentes formas de escribir localhost y sus diferencias.

<LocalhostLoopbackDemo />

### 2.2 `localhost` vs `127.0.0.1` vs `0.0.0.0`

Estos tres conceptos suelen confundirse, pero sus significados son completamente distintos:

| Escritura | Significado | Quién puede acceder |
| :--- | :--- | :--- |
| `localhost` / `127.0.0.1` | Dirección de loopback, solo el ordenador local | Solo tu propio ordenador |
| `0.0.0.0` | Escuchar en todas las interfaces de red | Ordenador local + otros dispositivos en la red local |
| `192.168.x.x` | IP de la red local | Dispositivos en la red local |

**En la práctica**:

```bash
# Solo tú puedes acceder (seguro, ideal para desarrollo)
npm run dev -- --host localhost

# Tu teléfono también puede acceder (ideal para depuración móvil)
npm run dev -- --host 0.0.0.0
```

> Muchos frameworks (como Vite, Next.js) escuchan en `localhost` por defecto, por lo que tu teléfono no puede acceder aunque esté en la misma WiFi. ¿Quieres depurar desde el móvil? Añade el parámetro `--host`.

---

## 3. Conflictos de puertos: el problema más común en desarrollo

### 3.1 Motivación de producen conflictos

**Un puerto solo puede ser escuchado por un programa en cada momento.** Es como una habitación que solo puede alojar a una familia.

Si intentas iniciar un segundo servicio en el mismo puerto, verás este clásico error:

```
Error: listen EADDRINUSE :::3000
```

Traducido: **"La habitación 3000 ya está ocupada, ¡no puedes entrar!"**

Escenarios de conflicto comunes:
- El servidor de desarrollo anterior no se cerró correctamente y sigue ejecutándose en segundo plano
- Dos proyectos diferentes usan el mismo puerto por defecto
- Un servicio del sistema ya ocupa el puerto que quieres

👇 **Pruébalo**:
Intenta iniciar servicios varias veces en el simulador de abajo. Cuando haya conflicto, compara las diferentes formas de manejarlo entre "inicio directo" e "inicio inteligente".

<PortConflictDemo />

### 3.2 Diagnóstico y solución

Cuando hay un conflicto de puertos, el proceso de diagnóstico es muy fijo:

**macOS / Linux:**
```bash
# Paso 1: Ver quién ocupa el puerto 3000
lsof -i :3000

# Paso 2: Con el PID, forzar la terminación
kill -9 <PID>
```

**Windows:**
```bash
# Paso 1: Ver quién ocupa el puerto 3000
netstat -ano | findstr :3000

# Paso 2: Terminar el proceso
taskkill /PID <PID> /F
```

> Muchos frameworks modernos (Vite, Create React App, etc.) preguntan automáticamente "¿Quieres cambiar de puerto?" cuando hay conflicto. Pero entender los principios subyacentes te ayudará a resolver más rápido esos casos en que el framework no puede ayudarte.

---

## 4. La "política del mismo origen" y CORS en desarrollo

### 4.1 Introducción a "origen"

El navegador tiene un mecanismo de seguridad llamado **política del mismo origen (Same-Origin Policy)**: solo cuando **protocolo, dominio y puerto** coinciden exactamente, se considera el "mismo origen".

| Dirección A | Dirección B | ¿Mismo origen? | Razón |
| :--- | :--- | :--- | :--- |
| `http://localhost:5173` | `http://localhost:5173/about` | ✅ Mismo origen | Protocolo, dominio y puerto iguales |
| `http://localhost:5173` | `http://localhost:3000` | ❌ Distinto origen | **Puerto diferente** (5173 vs 3000) |
| `http://localhost:5173` | `https://localhost:5173` | ❌ Distinto origen | **Protocolo diferente** (http vs https) |

### 4.2 Motivación de separación frontend/backend inevitablemente encuentra CORS

Cuando la arquitectura de tu proyecto es:

```
Frontend (Vite)  →  http://localhost:5173
Backend (Express) →  http://localhost:3000
```

La página frontend se carga desde `:5173` y luego usa `fetch('/api/users')` para pedir la API en `:3000` — ¡**los puertos son diferentes, se activa la restricción CORS**!

**Dos soluciones comunes:**

**Solución 1: Configurar CORS en el backend**
```javascript
// Backend Express
app.use(cors({ origin: 'http://localhost:5173' }))
```

**Solución 2: Configurar proxy en el frontend (recomendado)**
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```

El principio del proxy: el servidor de desarrollo de Vite "reenvía" las peticiones por ti. El navegador cree que se comunica con `:5173` (mismo origen), pero en realidad Vite las reenvía en secreto a `:3000`.

---

## 5. Diagnóstico práctico: los tres problemas más comunes

👇 **Pruébalo**:
Selecciona un problema que hayas tenido y sigue los pasos. Cada paso se puede ejecutar para ver la salida.

<PortTroubleshootDemo />

---

## 6. Tabla de términos

| Término en inglés | Traducción | Explicación |
| :--- | :--- | :--- |
| **Port** | Puerto | Número entre 0 y 65535 que distingue diferentes servicios de red en una misma máquina. Cada servicio "escucha" un puerto, esperando conexiones de clientes. |
| **localhost** | Host local | Nombre de dominio especial que siempre apunta al ordenador local (127.0.0.1). Permite acceder a servicios locales sin conexión a Internet. |
| **Loopback Interface** | Interfaz de loopback | Interfaz de red virtual del sistema operativo. Los paquetes enviados a 127.0.0.1 no salen del ordenador, sino que "rebotan" a través de esta interfaz. |
| **EADDRINUSE** | Dirección ya en uso | Error de Node.js / del sistema que indica que el puerto que quieres escuchar ya lo usa otro programa. |
| **CORS** | Recursos de Origen Cruzado | Mecanismo de seguridad del navegador. Cuando la página frontend intenta pedir una API de origen diferente (protocolo/dominio/puerto), el backend debe dar permiso explícito. |
| **Same-Origin Policy** | Política del mismo origen | La piedra angular de la seguridad del navegador: solo permite comunicación libre entre peticiones del mismo protocolo, dominio y puerto, bloqueando la lectura de datos entre orígenes diferentes. |
| **Proxy** | Proxy | En el entorno de desarrollo, el servidor proxy reenvía peticiones al backend en lugar del navegador, eludiendo las restricciones del mismo origen. |
| **0.0.0.0** | Todas las interfaces | Cuando un servicio escucha en 0.0.0.0, acepta conexiones desde cualquier interfaz de red (local, red local, etc.). |
| **Well-known Ports** | Puertos conocidos | Nombre colectivo de los puertos 0–1023, reservados para protocolos estándar como HTTP (80), HTTPS (443), SSH (22). |
| **PID** | ID de proceso | Número único que el sistema operativo asigna a cada programa en ejecución, para gestionar y terminar procesos. |
| **lsof** | Listar archivos abiertos | Comando de macOS/Linux para ver qué proceso ocupa un puerto (`lsof -i :puerto`). |
| **HMR** | Reemplazo de Módulos en Caliente | Función del servidor de desarrollo: al modificar código, el navegador se actualiza automáticamente sin necesidad de refrescar manualmente. Funciona internamente mediante WebSocket. |

---

## Resumen

Los puertos y localhost son los conceptos más básicos y frecuentes en el entorno de desarrollo:

- **Puerto** = "Número de habitación" para distinguir servicios en una máquina (0–65535)
- **localhost** = Dirección especial para "encontrarse a uno mismo" (127.0.0.1); los datos no salen del ordenador
- **Conflicto de puertos** significa esencialmente "una habitación solo puede tener una placa"
- **CORS** significa esencialmente "puerto diferente = origen diferente", requiere CORS o un proxy para resolverse

Recuerda estas cuatro frases y podrás diagnosticar rápidamente la mayoría de los problemas de red en tu entorno de desarrollo.
