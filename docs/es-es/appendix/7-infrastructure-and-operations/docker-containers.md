# Introducción a la contenedorización con Docker

::: tip Prefacio
**"Funciona en mi máquina" es la excusa más clásica de los desarrolladores, y Docker hace que esta excusa desaparezca por completo.** La tecnología de contenedores empaqueta una aplicación y todas sus dependencias en una unidad estandarizada, garantizando que se ejecute de manera consistente en cualquier entorno. Es la piedra angular de la entrega de software moderno.
:::

**¿Qué aprenderás en este artículo?**

Después de completar este capítulo, obtendrás:

- **Conceptos centrales**: comprender los tres conceptos fundamentales: imagen, contenedor y registro
- **Comparación de arquitecturas**: entender la diferencia esencial entre contenedores y máquinas virtuales
- **Habilidades prácticas**: dominar la escritura de Dockerfiles y los comandos más utilizados
- **Fundamentos de orquestación**: aprender a gestionar aplicaciones multisericio con Docker Compose
- **Mejores prácticas**: conocer optimización de imágenes, endurecimiento de seguridad y otras prácticas de nivel productivo

| Capítulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capítulo 1** | Por qué se necesitan contenedores | Consistencia del entorno, eficiencia de recursos, entrega estandarizada |
| **Capítulo 2** | Conceptos centrales | Imagen, contenedor, registro, Dockerfile |
| **Capítulo 3** | Ciclo de vida de Docker | Escribir, construir, pushear, ejecutar, gestionar |
| **Capítulo 4** | Docker Compose | Orquestación multisericio, redes, volúmenes de datos |
| **Capítulo 5** | Mejores prácticas | Optimización de imágenes, seguridad, construcción en múltiples etapas |

---

## 1. Motivación: contenedores

Antes de la aparición de los contenedores, desplegar una aplicación requería instalar manualmente el entorno de ejecución, configurar variables de entorno y resolver conflictos de dependencias en el servidor. Las diferencias entre entornos (desarrollo, pruebas, producción) eran un caldo de cultivo para bugs.

<DockerArchitectureDemo />

### Qué problemas resuelven los contenedores

| Problema | Enfoque tradicional | Enfoque con contenedores |
|------|---------|---------|
| Inconsistencia del entorno | "Funciona en mi máquina" | Empaquetar todas las dependencias, consistente en todas partes |
| Conflictos de dependencias | App A necesita Node 14, App B necesita Node 18 | Cada contenedor tiene su propio entorno aislado |
| Desperdicio de recursos | Cada VM necesita un SO completo | Comparte el kernel, consumo a nivel de MB |
| Despliegue lento | Instalación y configuración manual | Un solo comando `docker run` |
| Difícil de escalar | Crear nueva VM, instalar entorno, desplegar | Iniciar nuevos contenedores en segundos |

::: tip La esencia de los contenedores
Un contenedor no es una máquina virtual ligera. Su esencia es un **proceso aislado**. El kernel de Linux implementa los contenedores mediante dos mecanismos:
- **Namespace**: aísla la visibilidad de los procesos (PID, red, sistema de archivos, etc.)
- **Cgroups**: limita el uso de recursos de los procesos (CPU, memoria, IO)

Los procesos dentro de un contenedor no son fundamentalmente diferentes de los procesos ordinarios del host, simplemente están "encerrados en una habitación que no puede ver el exterior".
:::

---

## 2. Conceptos centrales

El mundo de Docker gira en torno a tres conceptos fundamentales: Imagen (Image), Contenedor (Container) y Registro (Registry).

| Concepto | Analogía | Descripción |
|------|------|------|
| Imagen (Image) | Clase / Plantilla | Plantilla de solo lectura que contiene código, entorno de ejecución, librerías y configuración |
| Contenedor (Container) | Instancia / Objeto | Instancia en ejecución de una imagen, con lectura/escritura y ciclo de vida independiente |
| Registro (Registry) | Tienda de aplicaciones | Servicio para almacenar y distribuir imágenes (Docker Hub, ACR, ECR) |
| Dockerfile | Receta / Plano | Archivo de texto que define cómo construir una imagen |
| Volumen (Volume) | Disco duro externo | Persistencia de datos, los datos no se pierden al eliminar el contenedor |

### Estructura en capas de las imágenes

Las imágenes de Docker están compuestas por múltiples capas de solo lectura (Layer), cada instrucción del Dockerfile crea una capa:

```
┌─────────────────────────┐
│  CMD ["node", "app.js"] │  ← Capa de comando de inicio
├─────────────────────────┤
│  COPY . /app            │  ← Capa de código de la aplicación (cambia frecuentemente)
├─────────────────────────┤
│  RUN npm install        │  ← Capa de instalación de dependencias (cambia ocasionalmente)
├─────────────────────────┤
│  FROM node:18-alpine    │  ← Capa de imagen base (cambia raramente)
└─────────────────────────┘
```

::: tip ¿Por qué es importante la estructura en capas?
Docker almacena en caché cada capa. Si una capa no ha cambiado, se reutiliza la caché durante la construcción. Por lo tanto, en el Dockerfile debes colocar las **instrucciones que cambian con menor frecuencia al principio** (como instalar dependencias) y las **que cambian con mayor frecuencia al final** (como copiar código). De esta manera, la mayoría de las construcciones aprovecharán la caché y serán mucho más rápidas.
:::

---

## 3. Ciclo de vida de Docker

Desde la escritura del Dockerfile hasta la ejecución del contenedor, el flujo de trabajo de Docker es una línea de producción clara y definida.

<DockerLifecycleDemo />

### Referencia rápida de instrucciones del Dockerfile

| Instrucción | Función | Ejemplo |
|------|------|------|
| `FROM` | Especifica la imagen base | `FROM node:18-alpine` |
| `WORKDIR` | Establece el directorio de trabajo | `WORKDIR /app` |
| `COPY` | Copia archivos a la imagen | `COPY package.json ./` |
| `RUN` | Ejecuta comandos durante la construcción | `RUN npm install` |
| `ENV` | Establece variables de entorno | `ENV NODE_ENV=production` |
| `EXPOSE` | Declara un puerto (solo documentación) | `EXPOSE 3000` |
| `CMD` | Comando de inicio del contenedor | `CMD ["node", "app.js"]` |
| `ENTRYPOINT` | Punto de entrada del contenedor (difícil de sobrescribir) | `ENTRYPOINT ["nginx"]` |

---

## 4. Docker Compose: orquestación multisericio

Los proyectos reales generalmente necesitan más de un contenedor. Una aplicación web puede necesitar: servidor de aplicaciones + base de datos + Redis + Nginx. Docker Compose define y gestiona múltiples contenedores con un solo archivo YAML.

### Ejemplo de docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret

  redis:
    image: redis:7-alpine

volumes:
  db-data:
```

### Conceptos centrales de Compose

| Concepto | Descripción | Ejemplo |
|------|------|------|
| services | Define cada servicio de contenedor | app, db, redis |
| volumes | Volúmenes de datos persistentes | db-data guarda los archivos de la base de datos |
| networks | Red personalizada (se crea automáticamente por defecto) | Los servicios se acceden mutuamente por nombre de servicio |
| depends_on | Dependencia de orden de inicio | app depende de db y redis |
| environment | Variables de entorno | Contraseña de base de datos, dirección de conexión |

::: tip Descubrimiento de servicios
En Docker Compose, el nombre del servicio es el nombre del host. El contenedor app puede acceder directamente a la base de datos usando `db:5432` y a Redis usando `redis:6379`, sin necesidad de conocer la dirección IP. Esto es gracias al DNS integrado de Docker.
:::

---

## 5. Mejores prácticas

### 5.1 Construcción en múltiples etapas (Multi-stage Build)

La construcción en múltiples etapas es una herramienta poderosa para optimizar el tamaño de las imágenes. La etapa de construcción instala todas las herramientas y dependencias, mientras que la etapa final solo conserva los archivos necesarios en tiempo de ejecución.

```dockerfile
# Etapa de construcción
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa de ejecución
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 5.2 Lista de optimización de imágenes

| Elemento de optimización | Qué hacer | Efecto |
|--------|------|------|
| Elegir imagen base pequeña | Usar `alpine` en lugar de `ubuntu` | Imagen de ~200MB a ~50MB |
| Combinar instrucciones RUN | Conectar múltiples comandos con `&&` | Reducir capas de la imagen |
| Usar .dockerignore | Excluir node_modules, .git, etc. | Acelerar la construcción, reducir contexto |
| Construcción en múltiples etapas | Separar entornos de construcción y ejecución | La imagen final no contiene herramientas de construcción |
| Fijar número de versión | `node:18.17-alpine` en lugar de `node:latest` | Construcciones reproducibles |

### 5.3 Prácticas de seguridad

| Práctica | Descripción |
|------|------|
| No ejecutar como root | `USER node` especifica un usuario no root |
| Escanear vulnerabilidades | `docker scout` o Trivy para escanear imágenes |
| Privilegios mínimos | Instalar solo los paquetes necesarios, sin herramientas de depuración |
| No codificar secretos | Usar variables de entorno o Docker Secrets |
| Actualizar la imagen base regularmente | Corregir vulnerabilidades de seguridad oportunamente |

---

## Resumen

La contenerización con Docker es la infraestructura de entrega de software moderno; comprenderla es crucial para cualquier desarrollador.

Repaso de los puntos clave de este capítulo:

1. **Contenedores vs máquinas virtuales**: los contenedores comparten el kernel del host, son más ligeros y rápidos, pero el aislamiento es ligeramente inferior al de las VM
2. **El trío central**: imagen (plantilla), contenedor (instancia), registro (distribución)
3. **Dockerfile**: construcción en capas, aprovechar la caché, instrucciones que cambian poco al principio
4. **Docker Compose**: definir aplicaciones multisericio con YAML, el nombre del servicio es el nombre del host
5. **Prácticas de producción**: construcción en múltiples etapas para reducir tamaño, imagen base alpine, ejecutar como no root

## Lecturas complementarias

- [Documentación oficial de Docker](https://docs.docker.com/) - La referencia más autorizada
- [Docker Getting Started](https://docs.docker.com/get-started/) - Tutorial oficial para principiantes
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) - Guía oficial de mejores prácticas
- [Documentación de Docker Compose](https://docs.docker.com/compose/) - Referencia completa de Compose
