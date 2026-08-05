# Introducción al almacenamiento de archivos y de objetos

::: tip Prólogo
**Un usuario sube una foto de perfil, la guardas en el directorio `/uploads` de tu servidor. Luego el disco del servidor se llena, o añades un segundo servidor y el usuario descubre que su foto a veces aparece y a veces no.** El almacenamiento de archivos parece simple, pero en un entorno distribuido es un problema arquitectónico que requiere atención seria. El almacenamiento de objetos es la respuesta estándar de la era de Internet para resolver este problema.
:::

**¿Qué aprenderás en este artículo?**

Al terminar este capítulo, habrás aprendido:

- **Conocimiento de tipos de almacenamiento**: entenderás las diferencias entre almacenamiento en bloque, de archivos y de objetos, y sus casos de uso
- **Conceptos fundamentales del almacenamiento de objetos**: dominarás conceptos como Bucket, Object, Key, Pre-signed URL
- **Diseño de soluciones de subida**: aprenderás a elegir entre subida directa del cliente y subida a través del servidor
- **Principios de aceleración CDN**: entenderás cómo el CDN acelera la distribución global de recursos estáticos
- **Buenas prácticas**: dominarás técnicas como nomenclatura de archivos, control de permisos y gestión del ciclo de vida

| Capítulo | Contenido | Conceptos clave |
|-----|------|---------|
| **Capítulo 1** | Comparación de tipos de almacenamiento | Almacenamiento en bloque, de archivos, de objetos |
| **Capítulo 2** | Conceptos fundamentales del almacenamiento de objetos | Bucket, Object, Key, metadatos |
| **Capítulo 3** | Soluciones de subida de archivos | Subida directa del cliente, Pre-signed URL |
| **Capítulo 4** | Aceleración CDN | Nodos edge, estrategia de caché, origen |
| **Capítulo 5** | Buenas prácticas | Normas de nomenclatura, permisos, ciclo de vida |

---

## 0. Panorama general: Motivación para archivos en el servidor local

Al empezar un proyecto, guardar los archivos subidos por los usuarios en el directorio local del servidor es lo más intuitivo. Pero a medida que el proyecto crece, te encontrarás con una serie de problemas:

- **Espacio en disco limitado**: el disco del servidor siempre se llena y ampliarlo es complicado
- **Sin compartición entre servidores**: después del balanceo de carga, las peticiones del usuario pueden llegar a diferentes servidores y el archivo no se encuentra
- **Sin backups**: si el servidor se cae, los archivos se pierden
- **Sin CDN**: usuarios de todo el mundo accediendo al mismo servidor, la velocidad es lenta

::: tip El valor central del almacenamiento de objetos
El almacenamiento de objetos (como AWS S3, Alibaba Cloud OSS) resuelve todos estos problemas: **capacidad ilimitada, accesible globalmente, backups automáticos, soporte nativo para CDN**. Se ha convertido en el estándar de facto para almacenar archivos en aplicaciones web.
:::

---

## 1. Comparación de tipos de almacenamiento: bloque, archivo, objeto

En el mundo informático existen tres formas principales de almacenamiento, que resuelven problemas a diferentes niveles.

<FileStorageTypeDemo />

| Dimensión | Almacenamiento en bloque | Almacenamiento de archivos | Almacenamiento de objetos |
|------|--------|---------|---------|
| Unidad de datos | Bloques de tamaño fijo | Archivo + directorio | Objeto (Key-Value) |
| Protocolo de acceso | iSCSI/FC | NFS/SMB | HTTP REST API |
| Rendimiento | Máximo (milisegundos) | Medio | Más bajo (pero suficiente) |
| Escalabilidad | Limitada | Media | Casi ilimitada |
| Coste | Máximo | Medio | Mínimo |
| Caso típico | Bases de datos | Archivos compartidos | Imágenes/vídeos/backups |

::: tip Regla mnemotécnica
- **Almacenamiento en bloque** es como un disco duro: para bases de datos
- **Almacenamiento de archivos** es como una carpeta compartida en red: para compartir configuración entre servidores
- **Almacenamiento de objetos** es como un disco en la nube: para imágenes y vídeos subidos por usuarios
:::

---

## 2. Conceptos fundamentales del almacenamiento de objetos

El modelo de datos del almacenamiento de objetos es muy simple: el **Bucket** es el contenedor, el **Object** es el archivo, y cada objeto se identifica mediante una **Key** única.

```
my-app-bucket/                    ← Bucket
├── avatars/user-123.jpg          ← Object Key
├── avatars/user-456.png          ← Object Key
├── reports/2024/q1-report.pdf    ← Object Key (el "directorio" es solo un prefijo de la Key)
└── uploads/temp/file.zip         ← Object Key
```

| Concepto | Descripción | Ejemplo |
|------|------|------|
| Bucket | Contenedor de almacenamiento, nombre único global | `my-app-prod`, `company-assets` |
| Object | El archivo en sí + metadatos | Una imagen, un PDF |
| Key | Identificador único del objeto | `avatars/user-123.jpg` |
| Metadatos | Información adicional del objeto | Content-Type, etiquetas personalizadas |
| ACL | Lista de control de acceso | public-read, private |
| Pre-signed URL | Enlace de acceso temporal autorizado | Enlace de subida/descarga con validez de 15 minutos |

::: tip El almacenamiento de objetos no tiene "directorios" reales
`avatars/user-123.jpg` — el `avatars/` no es un directorio, es solo un prefijo de la Key. El almacenamiento de objetos tiene estructura plana, todos los objetos están al mismo nivel. Las "carpetas" que muestra la consola son solo un efecto visual de agrupación por prefijo.
:::

---

## 3. Soluciones de subida de archivos: quién sube el archivo

Existen dos enfoques principales para la subida de archivos: a través del servidor y subida directa del cliente. Para la mayoría de los escenarios, la **subida directa del cliente** es la mejor opción.

<FileUploadFlowDemo />

::: tip Ventajas de la subida directa del cliente
1. **Ahorra ancho de banda del servidor**: el archivo no pasa por tu servidor, va directamente al OSS
2. **Evita timeouts**: la subida de archivos grandes no activa los límites de timeout de Nginx/gateway
3. **Reduce la carga del servidor**: el servidor solo necesita emitir credenciales, no procesar streams de archivos
4. **Soporta reanudación**: OSS soporta nativamente la subida por partes, el frontend puede implementar la reanudación

Pasos: el frontend solicita al backend una Pre-signed URL → el frontend usa esa URL para subir directamente al OSS → OSS notifica al backend mediante callback
:::

---

## 4. Aceleración CDN: rápido para usuarios de todo el mundo

Cuando tus usuarios están distribuidos por todo el mundo, descargar archivos desde un único servidor de origen es lento. El CDN (Content Delivery Network) despliega nodos edge globalmente, cacheando los archivos en el nodo más cercano al usuario, reduciendo drásticamente la latencia de acceso.

<CDNAccelerationDemo />

| Concepto CDN | Descripción |
|---------|------|
| Nodo edge | Servidores de caché distribuidos globalmente |
| Origen | Cuando el nodo edge no tiene caché, solicita el archivo al servidor de origen |
| Tasa de acierto de caché | Proporción de peticiones respondidas directamente por el nodo edge, cuanto más alta mejor |
| TTL | Tiempo de validez de la caché, tras expirar se debe volver al origen |
| Purga de caché | Limpiar activamente la caché de los nodos edge para que los nuevos archivos surtan efecto |

::: tip Buenas prácticas de CDN
- **Añadir hash al nombre del archivo**: `logo.a3f2b1.png` en lugar de `logo.png`, así al actualizar el archivo no necesitas purgar la caché
- **Establecer TTL razonable**: recursos estáticos (JS/CSS/imágenes) con TTL largo (1 año), HTML con TTL corto (5 minutos)
- **Activar compresión Gzip/Brotli**: los recursos de texto se comprimen reduciendo su tamaño entre un 60-80%
:::

---

## 5. Buenas prácticas

| Práctica | Descripción | Ejemplo |
|------|------|------|
| Normas de nomenclatura de Keys | Organizar archivos con prefijos significativos | `{type}/{date}/{uuid}.{ext}` |
| Evitar Keys calientes | No empezar con números incrementales | Usar UUID o prefijo hash |
| Principio de mínimo privilegio | Bucket privado por defecto | Solo establecer public-read para archivos que necesiten ser públicos |
| Reglas de ciclo de vida | Limpiar automáticamente archivos caducados | Archivos temporales eliminados automáticamente tras 7 días |
| Configuración CORS | La subida directa del cliente requiere configurar CORS | Permitir PUT/POST desde tu dominio |
| Cifrado del lado del servidor | Activar SSE para archivos sensibles | SSE-S3 o SSE-KMS |

---

## Resumen

El almacenamiento de archivos es un problema fundamental que toda aplicación web debe abordar. El almacenamiento de objetos, con su capacidad ilimitada, bajo coste y alta disponibilidad, se ha convertido en la opción estándar para las aplicaciones web.

Puntos clave de este capítulo:

1. **Tres tipos de almacenamiento**: en bloque para bases de datos, de archivos para compartición, de objetos para archivos de usuario
2. **Modelo de almacenamiento de objetos**: Bucket + Key + Object, estructura plana, acceso mediante HTTP API
3. **Subida directa del cliente**: esquema de Pre-signed URL, el archivo no pasa por el servidor, eficiente y ahorra recursos
4. **Aceleración CDN**: caché en nodos edge + hash en nombres de archivo, rápido para usuarios de todo el mundo
5. **Seguridad y gestión**: principio de mínimo privilegio, reglas de ciclo de vida, cifrado del lado del servidor

## Lecturas adicionales

- [Guía para desarrolladores de AWS S3](https://docs.aws.amazon.com/s3/) - Documentación de referencia del almacenamiento de objetos
- [Buenas prácticas de Alibaba Cloud OSS](https://help.aliyun.com/document_detail/31853.html) - El almacenamiento de objetos más usado en China
- [Documentación de MinIO](https://min.io/docs/minio/linux/index.html) - Almacenamiento de objetos open source compatible con S3
- [Cloudflare R2](https://developers.cloudflare.com/r2/) - Almacenamiento de objetos sin costes de salida
- [Pre-signed URL en detalle](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) - El mecanismo central de la subida directa del cliente