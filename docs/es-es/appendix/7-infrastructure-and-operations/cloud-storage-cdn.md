# Principios de almacenamiento de objetos y CDN
> 💡 **Guía de estudio**: Este artículo te llevará a través de un flujo completo: desde la subida de archivos hasta la descarga del usuario. Verás cómo el almacenamiento de objetos gestiona archivos masivos como un "almacén inteligente", cómo CDN entrega el contenido a la puerta del usuario como una "red de mensajería", y qué "trampas" te esperan en el camino. Se recomienda tener conocimientos básicos de solicitudes HTTP y resolución DNS.

Antes de empezar, te sugerimos repasar algunos "ladrillos básicos":

- **Flujo de solicitudes HTTP**: Puedes leer primero [Qué sucede después de ingresar una URL en el navegador](./web-basics/url-to-browser.md) para entender el flujo completo de una solicitud.
- **Principios de resolución DNS**: Si no estás familiarizado con la resolución de dominios, puedes consultar primero la parte ilustrada de [Flujo de consulta DNS](./deployment/dns-flow.md).

---

## 0. Introducción: Motivación de subida y descarga de archivos es tan "lenta"

Imagina esta escena: subes una foto HD de 10 MB en una comunidad de imágenes y tardas medio minuto en completar la subida; mientras que tu amigo en Pekín la descarga en solo 2 segundos. ¿Por qué la misma imagen tiene una experiencia de subida y descarga tan diferente?

O piensa en esto: tu sitio de comercio electrónico lanza una campaña en el Día del Soltero, la página de detalles del producto recibe repentinamente millones de visitas y el servidor simplemente "colapsa". ¿Es por falta de ancho de banda? ¿O hay un problema en el diseño de la arquitectura?

La respuesta a estas preguntas está en la "pareja dorada" formada por el **almacenamiento de objetos** y el **CDN**.

---

## 1. Almacenamiento de Objetos: Tu "Almacén Inteligente en la Nube"

### 1.1 Introducción a almacenamiento de objetos

El sistema de archivos tradicional es como tu armario: la ropa se organiza por capas de "camisas/pantalones/faldas", y para encontrar una camisa tienes que abrir el armario → sección de camisas → estante de camisas. Este modelo de "anidamiento jerárquico" se vuelve extremadamente engorroso cuando el número de archivos explota.

El almacenamiento de objetos es como la logística de almacenamiento moderna: cada paquete tiene un "número de seguimiento" único (clave de objeto), y solo necesitas proporcionar ese número para que el robot del almacén lo recupere con precisión entre millones de paquetes.

<ObjectStorageDemo />

**Resumen de diferencias clave**:

| Dimensión              | Sistema de archivos tradicional | Almacenamiento de objetos        |
| :--------------------- | :------------------------------ | :------------------------------- |
| **Organización**       | Árbol de directorios jerárquico | Pares clave-valor planos         |
| **Protocolo de acceso**| POSIX (operaciones locales)     | HTTP/REST API                    |
| **Escalabilidad**      | Limitada por capacidad de máquina| Escalado horizontal casi ilimitado|
| **Metadatos**          | Atributos básicos (tamaño, hora)| Metadatos personalizados ricos   |
| **Casos típicos**      | Documentos de oficina locales   | Imágenes/vídeos/copias de seguridad/recursos estáticos |

### 1.2 Conceptos clave del almacenamiento de objetos

#### Bucket: Tu "partición de almacén"

El bucket es el contenedor de nivel superior del almacenamiento de objetos, equivalente a un espacio de nombres independiente. Todos los objetos deben residir en un bucket.

**Reglas de nomenclatura** (usando Alibaba Cloud OSS como ejemplo):

- Único globalmente: no puede repetirse entre todos los usuarios del proveedor cloud
- Solo puede contener letras minúsculas, números y guiones
- Debe comenzar y terminar con una letra minúscula o número
- Longitud entre 3 y 63 caracteres

**Lección práctica**: Un equipo creó docenas de buckets por línea de negocio y al recibir la factura mensual se sorprendieron: cada bucket tiene un costo mínimo de almacenamiento y solicitudes. Recomendación: planifica los buckets por combinación de "entorno + propósito", por ejemplo `prod-static-assets`, `dev-backup-archive`.

#### Objeto (Object): Tu "paquete de datos"

El objeto es la unidad básica de almacenamiento y se compone de tres partes:

1. **Clave (Key)**: El identificador único del objeto, equivalente a un "número de seguimiento"
   - Ejemplo: `images/avatar/2024/user123.jpg`
   - Aunque parece una ruta, esencialmente es solo una cadena

2. **Datos (Data)**: El contenido del objeto en sí
   - Puede ser cualquier dato binario
   - El límite de tamaño depende del proveedor cloud (generalmente hasta 5 TB por objeto)

3. **Metadatos (Metadata)**: Información adicional que describe el objeto
   - Metadatos del sistema: Content-Type, ETag, Last-Modified, etc.
   - Metadatos personalizados: como `x-oss-meta-owner`, `x-oss-meta-project`

#### Control de acceso: ¿Quién puede tocar mi "almacén"?

El almacenamiento de objetos ofrece múltiples capas de control de permisos:

| Nivel          | Método de control               | Caso típico                                      |
| :------------- | :------------------------------ | :----------------------------------------------- |
| **Nivel bucket**   | Bucket Policy (política de recursos) | Bloquear todo acceso externo, solo permitir IPs específicas |
| **Nivel objeto**   | ACL (Lista de control de acceso)    | Imágenes públicas, documentos privados                |
| **Autorización temporal** | STS (Servicio de tokens de seguridad) | Subida directa desde frontend, subida desde móvil      |

**Línea roja de seguridad**: ¡Nunca escribas AccessKey ID y AccessKey Secret en el código del frontend! La práctica correcta es: el frontend solicita credenciales STS temporales a tu backend, y el backend devuelve credenciales temporales con tiempo de expiración después de verificar la identidad.

---

## 2. CDN: Tu "Red Global de Mensajería"

### 2.1 Motivación de CDN

Imagina que tienes una tienda online con el servidor en Shenzhen. Ahora un usuario en Pekín accede a tus imágenes:

- **Sin CDN**: La solicitud va de Pekín → Hebei → Henan → Hubei → Hunan → Guangdong → Shenzhen, recorriendo más de 2000 km, ida y vuelta más de 4000 km. Solo la transmisión de red toma decenas de milisegundos, y es peor con congestión de red.

- **Con CDN**: La solicitud va directamente de Pekín al nodo CDN de Pekín (posiblemente en la sala de servidores de China Unicom en Pekín), la distancia se reduce de 2000 km a 20 km, y la latencia de 50 ms a 5 ms.

Este es el valor central del CDN: **acercar el contenido al usuario**.

<CdnAccelerationDemo />

### 2.2 Arquitectura central del CDN

#### Nodos edge: La "estación de mensajería" más cercana al usuario

Los nodos edge son la capa más cercana al usuario en la red CDN, generalmente desplegados en:

- Salas de servidores de operadores (China Unicom/Telecom/Mobile)
- Centros de intercambio de Internet en grandes ciudades
- Centros de transporte importantes

**Distribución de los principales nodos CDN en China**:

- Ciudades de primer nivel: Pekín, Shanghái, Guangzhou, Shenzhen
- Ciudades de segundo nivel: Hangzhou, Nanjing, Chengdu, Wuhan, Xi'an
- Internacional: Hong Kong, Singapur, Tokio, Silicon Valley, Frankfurt

<EdgeNodeDistributionDemo />

#### Origen: El "almacén central" del contenido

El origen es el lugar donde el CDN obtiene el contenido mediante "back-to-source", que puede ser:

- Almacenamiento de objetos (OSS/COS/S3)
- Servidor propio (ECS/máquina física)
- Balanceador de carga (SLB/CLB)

**Configuraciones clave**:

- **HOST de origen**: El dominio/IP que usa el nodo CDN para acceder al origen
- **Protocolo de origen**: HTTP o HTTPS
- **Puerto de origen**: 80, 443 o puerto personalizado

#### Nodos de capa intermedia: "Centro de distribución regional"

Entre los nodos edge y el origen, el CDN suele tener una o más capas de nodos intermedios:

- **Nodos de agregación**: Agregan las solicitudes de múltiples nodos edge para reducir la presión en el origen
- **Centros regionales**: Responsables de la distribución y programación de contenido en una región

Ventajas de esta arquitectura en capas:

1. **Reduce la presión en el origen**: 1000 solicitudes de nodos edge pueden generar solo 10 solicitudes al origen
2. **Mejora la tasa de aciertos**: El contenido popular se intercepta en la capa intermedia sin necesidad de ir al origen
3. **Aislamiento de fallos**: Si un enlace falla, se puede cambiar automáticamente a otra ruta

### 2.3 Flujo completo de aceleración CDN

Sigamos una solicitud real de usuario:

<CachePolicyDemo />

**Paso 1: Resolución DNS** (programación inteligente)

```
Usuario ingresa: cdn.example.com/image.jpg
↓
El servidor DNS devuelve: IP del nodo CDN de China Unicom Pekín (1.2.3.4)
```

La clave aquí es el **DNS inteligente**: según el operador del usuario, la ubicación geográfica y la carga del nodo, devuelve la IP del nodo CDN óptimo.

**Paso 2: Búsqueda en nodo edge** (¿acierto de caché?)

```
La solicitud llega al nodo CDN de China Unicom Pekín (1.2.3.4)
↓
El nodo verifica la caché local:
├─ ¿Acierto? Devuelve el contenido directamente ✓
└─ ¿Fallo? Continúa al siguiente paso
```

**Paso 3: Back-to-source** (subiendo capa por capa)

```
Nodo edge: fallo de caché
↓
Solicita al nodo padre (ej: centro regional del norte de China)
├─ ¿Nodo padre acierta? Devuelve contenido
└─ ¿Nodo padre falla? Continúa hacia arriba
    ↓
    Solicita al origen
    ↓
    El origen devuelve el contenido
```

**Paso 4: Cachear y devolver** (más rápido la próxima vez)

```
El contenido vuelve por la cadena
↓
Cada nodo de capa almacena una copia en caché
↓
Finalmente llega al usuario
```

Así, la próxima vez que un usuario solicite el mismo archivo, se devolverá directamente desde el nodo edge, logrando una "apertura instantánea".

---

## 3. De la subida al acceso: Análisis del flujo completo

### 3.1 Tres formas de subir archivos

<UploadProcessDemo />

#### Método 1: Cliente → Servidor → Almacenamiento de objetos (modo tradicional)

```
Navegador → Tu servidor backend → Almacenamiento de objetos
```

**Flujo**:

1. El usuario selecciona el archivo y hace clic en subir
2. El archivo se sube primero a tu servidor backend
3. Después de recibir el archivo completo, el backend lo reenvía al almacenamiento de objetos
4. Se devuelve el resultado de la subida al usuario

**Ventajas**:

- Implementación simple, fácil de controlar tanto en frontend como backend
- Se puede validar el archivo y convertir formatos en el backend
- Las operaciones sensibles pueden registrarse en logs y verificar permisos

**Desventajas**:

- **Doble consumo de ancho de banda**: La subida del usuario consume ancho de banda una vez, y el reenvío del servidor consume otra
- **Alta presión en el servidor**: Archivos grandes ocupan mucha memoria y CPU
- **Subida lenta**: Añade un paso intermedio, el usuario percibe un tiempo de subida más largo

**Casos de uso**: Archivos pequeños (<10 MB), necesidad de procesamiento en backend (compresión de imágenes, marcas de agua), sistemas de gestión interna.

#### Método 2: Cliente sube directamente al almacenamiento de objetos (recomendación moderna)

```
Navegador ──────→ Almacenamiento de objetos
        ↑
        El backend solo emite credenciales temporales
```

**Flujo**:

1. El usuario selecciona el archivo, el frontend solicita primero "credenciales de subida" al backend
2. El backend verifica la identidad del usuario y solicita credenciales **STS temporales** al servicio de almacenamiento (con tiempo de expiración)
3. El backend devuelve las credenciales temporales al frontend
4. El frontend usa las credenciales para **subir el archivo directamente al almacenamiento de objetos**
5. El almacenamiento de objetos devuelve el resultado de la subida y el frontend notifica al backend "subida completada"

**Ventajas**:

- **Subida rápida**: Sin pasos intermedios, la velocidad percibida por el usuario es la más rápida
- **Baja presión en el servidor**: Solo procesa la emisión de credenciales, no el flujo de archivos
- **Ahorro de ancho de banda**: Solo un flujo de subida
- **Alta seguridad**: Las credenciales temporales tienen expiración, el impacto de una filtración es limitado

**Desventajas**:

- Implementación algo más compleja, requiere entender STS y mecanismos de firma
- El frontend necesita manejar lógica de carga por partes, reanudación, etc.
- Se necesita configurar CORS (Cross-Origin Resource Sharing)

**Casos de uso**: Subida de archivos grandes, contenido generado por usuarios (UGC), negocios que requieren alta concurrencia de subidas.

#### Método 3: Carga por partes + Reanudación (imprescindible para archivos grandes)

```
Archivo de video de 10 GB
↓
Se divide en 1000 partes de 10 MB
↓
Subida paralela (5 partes simultáneas)
↓
¡Se corta la red! 600 partes ya subidas
↓
Se restaura la red, continúa desde la parte 601
↓
Todas las partes subidas, se inicia la solicitud de "combinación"
```

**¿Por qué se necesita la carga por partes?**

| Escenario            | Sin partes                       | Con partes                    |
| :------------------- | :------------------------------- | :---------------------------- |
| **Fluctuación de red** | 99% subido, se corta la red, todo se reenvía | Solo se reenvían las partes fallidas |
| **Velocidad de subida** | Un solo hilo, lento              | Múltiples hilos en paralelo, rápido |
| **Uso de memoria**   | Necesita cachear todo el archivo | Solo cachea la parte actual   |
| **Progreso**         | Solo 0% y 100%                   | Progreso preciso por cada parte |

**Especificaciones de partes por proveedor cloud**:

| Proveedor           | Tamaño máximo por parte | Máximo de partes | Tamaño mínimo por parte |
| :------------------ | :---------------------- | :--------------- | :---------------------- |
| **Alibaba Cloud OSS** | 100 MB                  | 10000            | 100 KB                  |
| **Tencent Cloud COS** | 5 GB                    | 10000            | 1 MB                    |
| **AWS S3**          | 5 GB                    | 10000            | 5 MB (recomendado)      |
| **Qiniu**           | 100 MB                  | 10000            | 4 MB                    |

### 3.2 Estrategias de back-to-source del CDN en detalle

<CachePolicyDemo />

#### ¿Qué es "back-to-source"?

Los nodos edge del CDN cachean el contenido del origen, pero cuando:

- El contenido solicitado por el usuario se **accede por primera vez**
- El contenido en caché ha **expirado (TTL vencido)**
- La caché se **refresca/precalienta manualmente**

El nodo CDN necesita solicitar el contenido más reciente al **origen**, este proceso se llama "back-to-source".

#### Los tres modos de back-to-source

| Modo                       | Principio                          | Caso de uso                       | Pros y contras                        |
| :------------------------- | :--------------------------------- | :-------------------------------- | :------------------------------------ |
| **Back-to-source directo** | Nodo CDN → Origen                  | Origen con IP pública y tráfico bajo | Simple y directo, pero alta presión en origen |
| **Origen intermedio**      | Nodo CDN → Capa intermedia → Origen| Sitios grandes, arquitectura multicapa | Reduce presión en origen, arquitectura compleja |
| **OSS/COS como origen**    | Nodo CDN → Almacenamiento de objetos| Recursos estáticos, imágenes, vídeos | Mejor práctica, bajo costo, buen rendimiento |

#### Configuración práctica de back-to-source

**Escenario 1: Almacenamiento de objetos como origen (recomendado)**

```
Usuario accede: cdn.example.com/images/photo.jpg
                    ↓
            Nodo edge CDN (Pekín)
                    ↓
            Fallo de caché, back-to-source al origen
                    ↓
            Origen: bucket-name.oss-cn-beijing.aliyuncs.com
                    ↓
            Devuelve la imagen, CDN cachea y responde al usuario
```

Elementos clave de configuración:

- **Tipo de origen**: Dominio OSS/COS u origen personalizado
- **Protocolo de origen**: HTTP o HTTPS (se recomienda HTTPS)
- **HOST de origen**: Cabecera Host usada al acceder al origen
- **SNI de origen**: Indicación de nombre de servidor para back-to-source HTTPS

**Escenario 2: Balanceo de carga con múltiples orígenes**

Cuando un solo origen no soporta la presión de back-to-source, se pueden configurar múltiples orígenes:

```
Nodo edge CDN
    ├─ Origen A (peso 50%)
    ├─ Origen B (peso 30%)
    └─ Origen C (peso 20%)
```

Modo principal/respaldo:

```
Nodo edge CDN
    ├─ Origen principal A (todo el tráfico cuando está sano)
    └─ Origen de respaldo B (conmutación cuando falla el principal)
```

#### Ancho de banda de back-to-source vs ancho de banda CDN

Aquí hay un concepto que se confunde fácilmente:

| Indicador                  | Definición                             | Relación de facturación                         |
| :------------------------- | :------------------------------------- | :---------------------------------------------- |
| **Ancho de banda descendente CDN** | Tráfico del nodo CDN al usuario        | Costo CDN facturado generalmente por tráfico    |
| **Ancho de banda de back-to-source** | Tráfico del origen al nodo CDN         | Generalmente costo de tráfico saliente del origen |

**Consejos para ahorrar**:

- Mejora la tasa de aciertos del CDN (más solicitudes aciertan en caché, menos back-to-source)
- Establece tiempos de caché (TTL) razonables
- Usa la función de precalentamiento para cachear contenido popular antes del acceso del usuario
- Activa "seguir 301/302" para evitar redirecciones innecesarias en back-to-source

### 3.3 Configuración de estrategias de caché

<CachePolicyDemo />

#### Clave de caché (Cache Key): Determina qué cuenta como "el mismo archivo"

¿Cómo determina el CDN si dos solicitudes deben devolver la misma copia en caché? Mediante la **clave de caché**.

**La clave de caché predeterminada generalmente incluye**:

- Ruta URL (sin parámetros de consulta)
- Por ejemplo: `/images/photo.jpg`

**Escenario problemático**:

```
Usuario A solicita: /images/photo.jpg?w=100&h=100  (miniatura 100x100)
Usuario B solicita: /images/photo.jpg?w=800&h=600  (imagen grande 800x600)
```

Si la clave de caché solo incluye la ruta, dos imágenes de diferentes tamaños se considerarían el mismo archivo, causando confusión.

**Solución: Reglas personalizadas de clave de caché**

| Regla                          | Ejemplo                       | Efecto                                 |
| :----------------------------- | :---------------------------- | :------------------------------------- |
| **Conservar parámetros específicos** | Conservar `w`, `h`            | Diferentes tamaños se cachean por separado |
| **Conservar todos los parámetros**   | Conservar todos               | Coincidencia completamente exacta      |
| **Ignorar parámetros específicos**   | Ignorar `token`, `timestamp`  | URLs con timestamp pueden acertar en caché |
| **Incluir cabeceras de solicitud**   | Incluir `Accept-Language`     | Diferentes idiomas devuelven diferente contenido |

**Ejemplo de configuración práctica** (Alibaba Cloud CDN):

```
Regla de clave de caché:
- Ruta URL: /images/*
- Conservar parámetros de consulta: w, h, format
- Ignorar parámetros de consulta: token, timestamp, utm_source
```

#### Tiempo de caché (TTL): El equilibrio de la "frescura" del contenido

El TTL (Time To Live) determina cuánto tiempo se cachea el contenido en los nodos CDN. Si es demasiado corto, hay más back-to-source y más costo; si es demasiado largo, los usuarios ven contenido desactualizado después de una actualización.

**Recomendaciones de TTL por tipo de archivo**:

| Tipo de archivo | TTL recomendado                   | Razón                                          |
| :-------------- | :-------------------------------- | :--------------------------------------------- |
| Páginas HTML    | 0-5 minutos                       | Contenido se actualiza frecuentemente, necesita tiempo real |
| Archivos JS/CSS | 1 año (con hash en nombre de archivo) | El contenido no cambia, si cambia el nombre la caché se invalida |
| Imágenes/Vídeos | 7-30 días                         | Baja frecuencia de actualización, caché a largo plazo |
| Archivos de fuentes | 1 año                         | Casi nunca cambian                             |
| Respuestas API  | 0-5 minutos (según negocio)       | Alta exigencia de actualidad de datos          |

**Mejores prácticas de ingeniería frontend con CDN**:

```javascript
// configuración de webpack/vite
output: {
  filename: 'js/[name]-[contenthash:8].js',
  chunkFilename: 'js/[name]-[contenthash:8].chunk.js',
}
```

Nombre de archivo generado: `app-a3f2b1c9.js`

- Cambio de contenido → cambio de hash → nueva URL → invalidación natural de caché
- Contenido sin cambios → mismo hash → misma URL → acierto de caché a largo plazo

#### Refresco y precalentamiento de caché

**Refresco manual (escenarios de emergencia)**:

Cuando actualizas el contenido del origen pero la caché CDN aún no ha expirado, los usuarios siguen viendo contenido antiguo:

| Tipo de refresco     | Efecto                                    | Tiempo       | Caso de uso         |
| :------------------- | :---------------------------------------- | :----------- | :------------------ |
| **Refresco de URL**  | Invalidar caché de una URL específica     | 5-10 minutos | Actualizar un solo archivo |
| **Refresco de directorio** | Invalidar caché de todo un directorio | 10-30 minutos | Actualización por lotes |
| **Refresco completo** | Invalidar toda la caché del dominio     | 30+ minutos  | Rollback de emergencia |

**Aviso importante**: El refresco solo invalida la caché, la siguiente solicitud hará back-to-source para obtener el nuevo contenido. No hagas refrescos masivos en horas pico, o podrías saturar el origen.

**Precalentamiento (optimización proactiva)**:

El refresco es reactivo (el contenido ya se actualizó), el precalentamiento es proactivo (cachear por adelantado).

```
Escenario: Mañana a las 10 AM se publicará un artículo viral

Esta noche envías la solicitud de precalentamiento:
- URL: https://cdn.example.com/articles/artículo-viral.html
- Alcance del precalentamiento: Todos los nodos edge del país

Efecto:
Mañana a las 10 AM cuando los usuarios accedan, el contenido ya estará esperando en los nodos edge
→ Cero latencia de back-to-source, experiencia de apertura instantánea
```

---

## 4. Programación de tráfico: Que el usuario acceda al nodo "más cercano"

<TrafficSchedulingDemo />

### 4.1 Programación DNS inteligente

Resolución DNS tradicional:

```
Usuario pregunta: ¿Cuál es la IP de cdn.example.com?
DNS responde: 1.2.3.4 (fija)
```

Resolución DNS inteligente:

```
Usuario (China Unicom Pekín) pregunta: ¿Cuál es la IP de cdn.example.com?
DNS inteligente: Déjame ver... El nodo CDN de China Unicom Pekín es 1.2.3.4

Usuario (Telecom Shanghái) pregunta: ¿Cuál es la IP de cdn.example.com?
DNS inteligente: El nodo CDN de Telecom Shanghái es 5.6.7.8
```

**Dimensiones de programación**:
| Dimensión | Descripción | Efecto |
| :--- | :--- | :--- |
| **Ubicación geográfica** | Asignación por provincia/ciudad/país | Acceso cercano, menor latencia |
| **Operador** | China Unicom/Telecom/Mobile/BGP | Transmisión en el mismo operador, evita redes cruzadas |
| **Carga del nodo** | CPU/ancho de banda/QPS en tiempo real | Evitar nodos sobrecargados |
| **Salud del nodo** | Sondear disponibilidad | Excluir automáticamente nodos fallidos |
| **Factor de costo** | Diferencias en precio de ancho de banda | Equilibrio entre rendimiento y costo |

### 4.2 HTTP DNS y conexión IP directa

El DNS tradicional tiene un problema: **secuestro de DNS y latencia de resolución**.

**Solución HTTP DNS**:

```
Cliente → Omite el DNS del sistema → Pregunta directamente al servicio HTTP DNS (ej: 223.5.5.5:80)
         ↓
    Devuelve lista de IPs óptimas (con pesos)
         ↓
    El cliente selecciona la IP óptima según la calidad de red detectada
```

Ventajas:

- Anti-secuestro: No usa el DNS del operador
- Más preciso: Puede elegir IP según la calidad de red del cliente
- Tiempo real: Conmutación por fallo más rápida

**Recomendaciones prácticas**:

- Apps móviles: se recomienda encarecidamente implementar HTTP DNS
- Web: puede usar la programación CNAME proporcionada por el CDN
- Negocios críticos: pueden hacer redundancia multi-IP (un dominio devuelve múltiples IPs)

---

## 5. Optimización HTTPS: Equilibrio entre seguridad y rendimiento

<HttpsOptimizationDemo />

### 5.1 Motivación de importante HTTPS en CDN

**Comparación de escenarios**:

```
Sin HTTPS:
Usuario accede a http://cdn.example.com/image.jpg
↓
La barra de direcciones del navegador muestra "No seguro"
↓
Algunos navegadores/APP bloquean directamente el acceso
↓
El ranking SEO disminuye
```

```
Con HTTPS:
Usuario accede a https://cdn.example.com/image.jpg
↓
El navegador muestra el icono de candado verde
↓
La multiplexación HTTP/2 entra en efecto
↓
Mejora tanto el rendimiento como la seguridad
```

### 5.2 Puntos clave de configuración HTTPS en CDN

#### Gestión de certificados

| Solución                   | Descripción                     | Costo              | Caso de uso              |
| :------------------------- | :------------------------------ | :----------------- | :----------------------- |
| **Certificado gratuito del proveedor** | Proporcionado por Alibaba/Tencent Cloud | Gratis             | Dominio único, inicio rápido |
| **Let's Encrypt**          | Certificado gratuito comunitario | Gratis             | Despliegue automatizado  |
| **Certificado comercial DV/OV/EV** | Symantec, GeoTrust, etc.        | Cientos a decenas de miles de CNY/año | Nivel empresarial, barra verde |
| **Certificado wildcard**   | \*.example.com                  | Miles de CNY/año   | Múltiples subdominios    |

**Recomendaciones prácticas**:

- Entorno de prueba: Let's Encrypt o certificado gratuito del proveedor cloud
- Entorno de producción: Certificado wildcard (más cómodo) o certificado OV de dominio único (más barato)
- Atención a la fecha de expiración del certificado, configurar recordatorios de renovación automática

#### Configuración de optimización HTTPS

**Selección de versión TLS**:

```
Configuración recomendada: Solo TLS 1.2 y TLS 1.3
Configuración compatible: TLS 1.1 + TLS 1.2 + TLS 1.3 (compatible con navegadores antiguos)
```

**Suites de cifrado**:

```
Recomendado: Intercambio de claves ECDHE + cifrado AES-GCM
Deshabilitar: DES, RC4, MD5, SHA1
```

**OCSP Stapling**:

```
Función: El nodo CDN obtiene proactivamente el estado de revocación del certificado
Efecto: Reduce el tiempo de validación del cliente en 200-500 ms
Recomendación: Definitivamente activar
```

**Reutilización de sesión TLS**:

```
Reutilización de Session ID: El cliente trae el Session ID anterior, el servidor restaura la sesión
Reutilización de Session Ticket: El servidor cifra el estado de la sesión y lo envía al cliente, que lo devuelve después
Efecto: Evita el handshake TLS completo, ahorra 1-RTT
```

### 5.3 HTTP/2 y HTTP/3 en CDN

**Multiplexación HTTP/2**:

```
HTTP/1.1:
Solicitud 1 (index.html) ────────────────→
Respuesta 1 ←──────────────────────────────
Solicitud 2 (style.css) ─────────────────→
Respuesta 2 ←──────────────────────────────
Solicitud 3 (script.js) ─────────────────→
Respuesta 3 ←──────────────────────────────
(Serial, una termina y empieza la siguiente)

HTTP/2:
Solicitud 1 ──→
Solicitud 2 ──→   Combinadas en una conexión TCP, tramas entrelazadas
Solicitud 3 ──→
Respuesta 1 ←──   Devueltas en streaming por prioridad
Respuesta 2 ←──
Respuesta 3 ←──
(Paralelo, una conexión multiplexada)
```

**Server Push de HTTP/2**:

```
Escenario: El usuario solicita index.html, que referencia style.css y script.js

Modo tradicional:
1. El usuario descarga index.html
2. Al analizar descubre que necesita style.css y script.js
3. Envía dos solicitudes más para obtenerlos

HTTP/2 Push:
1. El usuario solicita index.html
2. El nodo CDN devuelve index.html y proactivamente envía style.css y script.js
3. Cuando el usuario analiza el HTML, los recursos ya están en caché

Nota: El push debe usarse con moderación, demasiado desperdicia ancho de banda, muy poco no tiene efecto
```

**HTTP/3 (QUIC)**:

```
Problema de HTTP/2: Basado en TCP, bloqueo de cabecera de línea
→ Un paquete TCP perdido, toda la conexión espera la retransmisión

Solución de HTTP/3: Basado en QUIC (transporte fiable sobre UDP)
→ Cada flujo es independiente, el bloqueo de un flujo no afecta a otros
→ Migración de conexión: Cambio de WiFi a 4G, la conexión no se interrumpe
→ Handshake 0-RTT: Incluso en la primera visita se puede establecer conexión rápidamente

Estado actual: En 2024 los principales CDN ya soportan HTTP/3, se recomienda activarlo
```

---

## 6. Análisis de acceso: Entendiendo tus informes CDN

<AccessAnalyticsDemo />

### 6.1 Interpretación de indicadores clave

#### Ancho de banda (Bandwidth)

```
Definición: Cantidad de datos transmitidos por unidad de tiempo
Unidad: bps (bits por segundo), Mbps, Gbps

Ancho de banda CDN = Suma del tráfico saliente de todos los nodos edge

Atención para distinguir:
- Ancho de banda facturado: Generalmente facturado por percentil 95 o pico diario
- Ancho de banda real: Velocidad de transmisión en tiempo real
```

**Relación entre ancho de banda y tráfico**:

```
1 Mbps de ancho de banda sostenido durante 1 hora = 450 MB de tráfico
(Cálculo: 1.000.000 bps × 3600s ÷ 8 ÷ 1024 ÷ 1024 ≈ 429 MB)
```

#### QPS (Queries Per Second)

```
Definición: Consultas/solicitudes por segundo

CDN QPS = Total de solicitudes HTTP procesadas por segundo por todos los nodos edge

Nota: Un QPS alto no significa ancho de banda alto
- Escenario de archivos pequeños: QPS muy alto, ancho de banda bajo
- Escenario de archivos grandes: QPS bajo, ancho de banda muy alto
```

#### Tasa de aciertos (Hit Ratio)

```
Definición: Proporción de solicitudes que aciertan en el nodo edge CDN respecto al total

Fórmula de cálculo:
Tasa de aciertos = (Número de aciertos / Total de solicitudes) × 100%
o
Tasa de aciertos = (1 - Tráfico de back-to-source / Tráfico total saliente) × 100%

Estándares de la industria:
- Imágenes/Vídeos/JS/CSS: > 95%
- Páginas HTML: 50-80% (según frecuencia de actualización)
- Interfaces API: Generalmente no se cachean o muy bajo
```

**Causas comunes de baja tasa de aciertos**:

| Causa                    | Síntoma                          | Solución                                  |
| :----------------------- | :------------------------------- | :---------------------------------------- |
| TTL demasiado corto      | TTL de solo unos minutos         | Ajustar TTL según tipo de archivo         |
| Parámetros de consulta variables | URL con número aleatorio         | Configurar ignorar parámetros específicos |
| Configuración incorrecta de clave de caché | Se distingue lo que no debería | Optimizar reglas de clave de caché        |
| Contenido actualizado frecuentemente | Archivos frecuentemente sobrescritos | Usar números de versión o hash en nombre de archivo |
| Muchos primeros accesos  | Contenido nuevo o nodos nuevos   | Precalentar por adelantado                |

### 6.2 Análisis de logs y resolución de problemas

#### Interpretación de campos de logs CDN

Un log de acceso CDN típico contiene los siguientes campos:

```
Hora | IP del cliente | Método HTTP | URL | Código de estado HTTP | Tamaño de respuesta | Estado de caché | Tiempo de respuesta | Referer | User-Agent

Ejemplo:
2024-01-15 14:32:01 | 114.114.114.114 | GET | https://cdn.example.com/images/photo.jpg | 200 | 153600 | HIT | 23 | https://example.com/ | Mozilla/5.0...
```

Explicación de campos clave:

| Campo            | Descripción          | Valor de análisis                                     |
| :--------------- | :------------------- | :---------------------------------------------------- |
| `cache_status`   | Estado de caché      | HIT (acierto), MISS (fallo), EXPIRED (expirado)       |
| `response_time`  | Tiempo de respuesta (ms) | Evaluar experiencia de usuario, >500 ms necesita optimización |
| `http_status`    | Código de estado HTTP | Investigar errores 404/500                           |
| `bytes_sent`     | Bytes enviados       | Estadísticas de ancho de banda                        |

#### Resolución de problemas comunes

**Problema 1: El usuario reporta acceso lento**

Pasos de investigación:

```
1. Revisar response_time en logs
   - Si es alto (>500 ms): Verificar si es MISS de caché o lentitud del origen

2. Revisar cache_status
   - HIT: Acierto de caché, la lentitud puede ser por archivo muy grande o problema del nodo
   - MISS: Fallo de caché, necesita optimizar estrategia de caché o tasa de aciertos

3. Revisar distribución de IPs de clientes
   - Lentitud en ciertas regiones: Puede ser alta carga del nodo o cobertura insuficiente
```

**Problema 2: La caché no funciona, siempre hace back-to-source**

Lista de verificación:

```
□ ¿La cabecera de respuesta del origen tiene Cache-Control: no-cache / private?
□ ¿La URL contiene parámetros aleatorios (como ?_=123456)?
□ ¿La configuración de clave de caché es correcta?
□ ¿El TTL es demasiado corto?
□ ¿Está acertando en caché local del navegador en lugar del CDN?
```

**Problema 3: Costo disparado**

Direcciones de investigación:

```
1. Revisar detalle de facturación
   - Costo alto de tráfico CDN: Verificar si hay archivos grandes accedidos frecuentemente o hotlinking
   - Costo alto de tráfico de back-to-source: Verificar si la tasa de aciertos cayó repentinamente
   - Costo alto de número de solicitudes: Verificar si hay ataques CC o crawlers

2. Revisar logs de acceso
   - ¿Hay muchas solicitudes 404? (posible escaneo o error de configuración)
   - ¿Referer anómalo? (determinar si hay hotlinking)

3. Configuración de seguridad
   - Activar anti-hotlinking (lista blanca de Referer)
   - Activar lista negra/blanca de IPs
   - Configurar protección CC
```

---

## 7. Caso práctico: Construir una solución de aceleración de imágenes desde cero

### 7.1 Escenario de negocio

Supón que eres el responsable técnico de una comunidad de imágenes y enfrentas los siguientes desafíos:

- **Subida de usuarios**: Los usuarios suben 1 millón de imágenes al día (promedio 2 MB/imagen)
- **Acceso de usuarios**: 50 millones de solicitudes de visualización de imágenes al día
- **Distribución de acceso**: Usuarios en todo el país, algunos accesos desde el extranjero
- **Requisito de rendimiento**: Tiempo de carga de imágenes < 500 ms
- **Presupuesto de costo**: Intentar mantenerlo dentro de 50,000 CNY al mes

### 7.2 Diseño de arquitectura

```
                         ┌──────────────────────────────────────┐
                         │           Flujo de subida del usuario           │
                         └──────────────────────────────────────┘

   Navegador del usuario                          Servidor backend                      Almacenamiento de objetos
       │                                            │                            │
       │  1. Solicitar credenciales de subida       │                            │
       │───────────────────────────────────────────>│                            │
       │                                            │                            │
       │                                            │  2. Solicitar credenciales STS temporales │
       │                                            │───────────────────────────>│
       │                                            │                            │
       │                                            │  3. Devolver credenciales STS          │
       │                                            │<───────────────────────────│
       │                                            │                            │
       │  4. Devolver credenciales de subida (con STS)              │
       │<───────────────────────────────────────────│                            │
       │                                            │                            │
       │  5. Subir archivo directamente (usando firma STS)          │
       │──────────────────────────────────────────────────────────────────────>│
       │                                            │                            │
       │  6. Devolver resultado de subida (URL, ETag, etc.)           │
       │<──────────────────────────────────────────────────────────────────────│
       │                                            │                            │
       │  7. Notificar al backend subida completada (guardar en BD)        │
       │───────────────────────────────────────────>│                            │


                         ┌──────────────────────────────────────┐
                         │           Flujo de acceso del usuario            │
                         └──────────────────────────────────────┘

   Navegador del usuario    Resolución DNS         Nodo CDN              Almacenamiento de objetos (origen)
       │                     │                     │                     │
       │  1. Solicitar URL de imagen                │                     │
       │────────────────────────────────────────>│                     │
       │                     │                     │                     │
       │                     │  2. Consulta DNS     │                     │
       │                     │────────────────────>│                     │
       │                     │                     │                     │
       │                     │  3. Devolver IP del nodo óptimo │                     │
       │                     │<────────────────────│                     │
       │                     │                     │                     │
       │  4. Conectar al nodo CDN                  │                     │
       │────────────────────────────────────────>│                     │
       │                     │                     │                     │
       │                     │  5. Verificar caché  │                     │
       │                     │                     ├─ ¿Acierto? Devolver directo     │
       │                     │                     └─ ¿Fallo? Continuar        │
       │                     │                     │                     │
       │                     │                     │  6. Back-to-source       │
       │                     │                     │──────────────────>│
       │                     │                     │                     │
       │                     │                     │  7. Devolver archivo       │
       │                     │                     │<──────────────────│
       │                     │                     │                     │
       │                     │  8. Cachear y responder      │                     │
       │<────────────────────────────────────────│                     │
```

### 7.3 Configuraciones clave en detalle

#### Configuración de almacenamiento de objetos

**Planificación de buckets**:

```
 Bucket: myapp-images-prod
 ├─ Estructura de directorios:
 │   ├─ uploads/           # Imágenes originales subidas por usuarios
 │   │   ├─ 2024/01/15/user123-abc.jpg
 │   │   └─ 2024/01/15/user456-def.png
 │   ├─ thumbnails/        # Miniaturas
 │   │   ├─ small/         # 100x100
 │   │   ├─ medium/        # 400x300
 │   │   └─ large/         # 800x600
 │   └─ processed/         # Imágenes procesadas (con marca de agua, etc.)
 │
 ├─ Permisos de acceso:
 │   ├─ Directorio de originales: Privado (acceso con firma requerido)
 │   ├─ Directorio de miniaturas: Lectura pública
 │   └─ CORS: Permitir acceso desde *.myapp.com
 │
 └─ Política de ciclo de vida:
     ├─ 7 días después de subir: Almacenamiento de baja frecuencia (ahorra 40% del costo)
     ├─ 90 días después de subir: Almacenamiento de archivo (ahorra 70% del costo)
     └─ 3 años después de subir: Eliminación automática (o transferir a almacenamiento frío más barato)
```

**Configuración CORS**:

```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://myapp.com</AllowedOrigin>
    <AllowedOrigin>https://www.myapp.com</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <ExposeHeader>ETag</ExposeHeader>
    <ExposeHeader>x-oss-request-id</ExposeHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
```

#### Configuración de aceleración CDN

**Configuración de estrategia de caché**:

```
Regla global predeterminada:
├─ Clave de caché: Ruta URL + conservar parámetros de consulta w, h, format
├─ TTL predeterminado: 7 días
└─ HOST de origen: Seguimiento automático

Desglose por tipo de archivo:
├─ *.html:
│   ├─ TTL: 5 minutos
│   └─ Priorizar lectura desde caché en memoria
│
├─ *.js, *.css:
│   ├─ TTL: 1 año
│   └─ Ignorar parámetros de consulta (porque los nombres de archivo tienen hash)
│
├─ *.jpg, *.png, *.gif, *.webp:
│   ├─ TTL: 30 días
│   ├─ Conservar parámetros de consulta (w, h, format para recorte dinámico)
│   └─ Activar optimización automática de compresión de imágenes
│
└─ /api/*:
    ├─ TTL: 0 (sin caché)
    └─ Back-to-source directo
```

**Configuración de optimización HTTPS**:

```
Configuración de certificado:
├─ Tipo de certificado: Certificado wildcard *.myapp.com
├─ Método de despliegue: Subir desde la consola CDN, renovación automática
└─ Certificado de respaldo: Certificado EV para el dominio principal (muestra barra de direcciones verde)

Configuración TLS:
├─ Versión TLS mínima: 1.2 (equilibrio entre compatibilidad y seguridad)
├─ Versión TLS máxima: 1.3
├─ Suites de cifrado: Solo habilitar suites de cifrado fuerte
├─ OCSP Stapling: Activado
├─ Reutilización de sesión TLS: Activar Session Ticket
└─ HSTS: Activado (max-age=31536000)

HTTP/2 y HTTP/3:
├─ HTTP/2: Activado (multiplexación, compresión de cabeceras)
├─ HTTP/2 Server Push: Activar según necesidad (se recomienda Preload como alternativa)
└─ HTTP/3 (QUIC): Activado (función experimental, aumentar tráfico gradualmente)
```

### 7.4 Estrategia de control de costos

#### Análisis de composición de costos

```
Composición mensual de costos CDN + Almacenamiento de objetos:

Parte CDN:
├─ Costo de tráfico descendente (la mayor parte, ~60%)
│   ├─ China continental: 0.15-0.30 CNY/GB
│   ├─ Región Asia-Pacífico: 0.40-0.80 CNY/GB
│   └─ Europa/América: 0.30-0.60 CNY/GB
│
├─ Costo por número de solicitudes (parte menor, ~5%)
│   ├─ HTTP: 0.01-0.05 CNY/10,000 solicitudes
│   └─ HTTPS: 0.05-0.15 CNY/10,000 solicitudes (por el consumo de recursos del handshake TLS)
│
├─ Costo de pico de ancho de banda (método de facturación opcional)
│   └─ Facturación por percentil 95: Adecuado para escenarios con tráfico fluctuante
│
└─ Costo de funciones de valor añadido (~5%)
    ├─ Gestión de certificados HTTPS
    ├─ Protección WAF
    ├─ Envío de logs en tiempo real
    └─ Scripts/funciones edge

Parte de almacenamiento de objetos:
├─ Costo de capacidad de almacenamiento (~15%)
│   ├─ Almacenamiento estándar: 0.12-0.15 CNY/GB/mes
│   ├─ Almacenamiento de baja frecuencia: 0.08-0.10 CNY/GB/mes
│   └─ Almacenamiento de archivo: 0.03-0.05 CNY/GB/mes
│
├─ Costo de solicitudes (~5%)
│   ├─ PUT: 0.01-0.05 CNY/10,000 solicitudes
│   └─ GET: 0.005-0.01 CNY/10,000 solicitudes
│
├─ Costo de recuperación de datos (baja frecuencia/archivo)
│   └─ Cargo adicional por eliminación anticipada o recuperación
│
└─ Costo de tráfico saliente de back-to-source (~10%)
    └─ Costo de tráfico de back-to-source desde CDN al almacenamiento de objetos
```

#### Consejos prácticos para ahorrar

**Consejo 1: Almacenamiento por niveles, gestión automática del ciclo de vida**

```yaml
# Ejemplo de reglas de ciclo de vida
rules:
  - id: image-lifecycle
    prefix: uploads/
    transitions:
      # Después de 7 días, cambiar a almacenamiento de baja frecuencia, ahorra 30% de costo
      - days: 7
        storageClass: IA
      # Después de 90 días, cambiar a almacenamiento de archivo, ahorra 70% de costo
      - days: 90
        storageClass: Archive
    # Eliminar automáticamente después de 3 años
    expiration:
      days: 1095
```

**Consejo 2: Mejorar la tasa de aciertos del CDN, reducir back-to-source**

```
¿Qué significa mejorar la tasa de aciertos del 90% al 95%?

Suponiendo:
- Tráfico diario: 10 TB
- Tasa de aciertos 90%: back-to-source 1 TB
- Tasa de aciertos 95%: back-to-source 0.5 TB

Ahorro en tráfico de back-to-source: 0.5 TB/día × 0.15 CNY/GB × 30 días = 2,250 CNY/mes
```

**Consejo 3: Compresión y optimización de formato**

```
Plan de optimización de imágenes:
├─ Imágenes originales almacenadas en almacenamiento de objetos (no expuestas directamente)
├─ Activar procesamiento de imágenes en CDN:
│   ├─ Conversión automática de formato: JPEG → WebP/AVIF (ahorra 30-50%)
│   ├─ Compresión automática de calidad: Compresión visualmente sin pérdidas (ahorra 20-40%)
│   ├─ Tamaño adaptativo: Devolver tamaño adecuado según dispositivo
│   └─ Carga progresiva: Primero borroso, luego nítido
└─ Efecto: Costo de ancho de banda reducido en 50-70%
```

**Consejo 4: Límite de pico de ancho de banda y alertas**

```yaml
# Configuración de límite de ancho de banda
bandwidth_cap:
  daily_limit: 500 # Mbps, si el pico diario supera, desactivar CDN automáticamente
  monthly_limit: 10000 # GB, si el tráfico mensual supera, desactivar

  # Umbrales de alerta
  alerts:
    - threshold: 70% # Alerta al alcanzar el 70%
      channels: [sms, email]
    - threshold: 90% # Llamar al alcanzar el 90%
      channels: [phone]
```

---

## 8. Conclusión: Las reglas de oro de Almacenamiento de Objetos + CDN

### 8.1 Principios de diseño de arquitectura

**Principio 1: Separación de contenido dinámico y estático**

```
Contenido dinámico (API, HTML) → Usar origen o funciones edge
Contenido estático (imágenes, JS, CSS, vídeos) → Usar CDN + Almacenamiento de objetos
```

**Principio 2: Servicio cercano**

```
Donde esté el usuario, allí se cachea el contenido
→ Elegir un proveedor CDN con amplia cobertura
→ Activar programación DNS inteligente
→ Precalentar contenido importante por adelantado
```

**Principio 3: Caché en capas**

```
Caché local del navegador (la más fuerte)
    ↓
Caché de nodo edge CDN (segunda más fuerte)
    ↓
Capa intermedia CDN / Nodo regional (respaldo)
    ↓
Almacenamiento de objetos / Origen (última defensa)
```

**Principio 4: Equilibrio entre costo y experiencia**

```
Almacenamiento por niveles: Datos calientes en almacenamiento estándar, datos fríos en archivo
Estrategia de caché: Contenido de alta frecuencia con TTL largo, baja frecuencia con TTL corto
Optimización de compresión: Formato WebP/AVIF, compresión de calidad inteligente
Monitorización y alertas: Configurar límite de ancho de banda, prevenir tráfico anómalo
```

### 8.2 Lista de verificación para evitar trampas

**Nomenclatura y permisos de buckets**

- [ ] El nombre del bucket es globalmente único, evitar que esté ocupado
- [ ] No configurar archivos privados como lectura pública
- [ ] No escribir AccessKey en el código frontend, usar credenciales temporales STS
- [ ] Activar cifrado del lado del servidor (SSE) para proteger datos sensibles

**Configuración de caché CDN**

- [ ] El TTL de archivos HTML no debe ser demasiado largo (recomendado < 5 minutos)
- [ ] JS/CSS usar nombres de archivo con hash, TTL configurado a 1 año
- [ ] La clave de caché debe ser razonable, no incluir variables como información de usuario
- [ ] Después de actualizaciones importantes, recordar refrescar caché o precalentar

**Seguridad HTTPS**

- [ ] El certificado no debe expirar, configurar renovación automática
- [ ] Versión TLS mínima recomendada: 1.2
- [ ] Activar HSTS para prevenir ataques de downgrade
- [ ] Cookies sensibles configurar Secure y HttpOnly

**Control de costos**

- [ ] Activar alertas de límite de ancho de banda, prevenir tráfico anómalo
- [ ] El almacenamiento de baja frecuencia/archivo tiene tiempo mínimo y cargo por eliminación anticipada, prestar atención a las reglas
- [ ] El tráfico de back-to-source también es caro, esforzarse por mejorar la tasa de aciertos CDN
- [ ] Analizar periódicamente los logs de acceso, limpiar recursos zombis

---

## 9. Plantillas de código prácticas

### 9.1 Subida directa al almacenamiento de objetos desde frontend (JavaScript)

```javascript
/**
 * Clase de utilidad para subida directa a almacenamiento de objetos
 * Compatible con: Alibaba Cloud OSS, Tencent Cloud COS, AWS S3
 */
class DirectUploader {
  constructor(config) {
    this.provider = config.provider // 'oss' | 'cos' | 's3'
    this.region = config.region
    this.bucket = config.bucket
    this.getCredentials = config.getCredentials // Función para obtener credenciales temporales
  }

  /**
   * Obtener credenciales temporales STS
   */
  async fetchCredentials() {
    // Solicitar credenciales temporales al backend
    const credentials = await this.getCredentials()
    return {
      accessKeyId: credentials.accessKeyId,
      accessKeySecret: credentials.accessKeySecret,
      sessionToken: credentials.securityToken || credentials.sessionToken,
      expiration: credentials.expiration
    }
  }

  /**
   * Generar firma de subida (para cálculo de firma en frontend)
   */
  generateSignature(credentials, fileKey, fileType, options = {}) {
    const timestamp = new Date().toISOString()
    const date = timestamp.slice(0, 10).replace(/-/g, '')

    // Los algoritmos de firma varían ligeramente según el proveedor
    switch (this.provider) {
      case 'oss':
        return this._ossSignature(credentials, fileKey, date, options)
      case 'cos':
        return this._cosSignature(credentials, fileKey, date, options)
      case 's3':
        return this._s3Signature(credentials, fileKey, date, options)
      default:
        throw new Error('Unknown provider')
    }
  }

  /**
   * Subida de un solo archivo (archivos pequeños < 100 MB)
   */
  async upload(file, options = {}) {
    const credentials = await this.fetchCredentials()
    const fileKey = this._generateFileKey(file, options.directory)

    const formData = new FormData()

    // Construir campos del formulario (los nombres de campos varían según el proveedor)
    const formFields = this._buildFormFields(
      credentials,
      fileKey,
      file.type,
      options
    )
    Object.entries(formFields).forEach(([key, value]) => {
      formData.append(key, value)
    })

    formData.append('file', file)

    // Enviar solicitud de subida
    const uploadUrl = this._getUploadUrl()
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      // Para archivos grandes, puede ser necesario un timeout más largo
      signal: options.signal // Soporta AbortController para cancelar subida
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${response.status} ${errorText}`)
    }

    return {
      url: this._getFileUrl(fileKey),
      key: fileKey,
      etag: response.headers.get('ETag'),
      size: file.size
    }
  }

  /**
   * Subida por partes (archivos grandes > 100 MB)
   */
  async multipartUpload(file, options = {}) {
    const partSize = options.partSize || 10 * 1024 * 1024 // Por defecto 10 MB/parte
    const parallel = options.parallel || 3 // Por defecto 3 concurrentes

    const credentials = await this.fetchCredentials()
    const fileKey = this._generateFileKey(file, options.directory)

    // 1. Inicializar subida por partes
    const uploadId = await this._initMultipartUpload(
      credentials,
      fileKey,
      file.type
    )

    // 2. Calcular partes
    const parts = []
    const totalParts = Math.ceil(file.size / partSize)
    for (let i = 0; i < totalParts; i++) {
      const start = i * partSize
      const end = Math.min(start + partSize, file.size)
      parts.push({
        number: i + 1,
        start,
        end,
        blob: file.slice(start, end)
      })
    }

    // 3. Subir partes (con control de concurrencia y reanudación)
    const uploadedParts = []
    const failedParts = []

    // Soporte para reanudación: verificar qué partes ya se han subido
    if (options.resume) {
      const existingParts = await this._listParts(
        credentials,
        fileKey,
        uploadId
      )
      for (const part of existingParts) {
        uploadedParts.push(part)
      }
    }

    // Filtrar partes no subidas
    const pendingParts = parts.filter(
      (p) => !uploadedParts.some((up) => up.partNumber === p.number)
    )

    // Subida concurrente
    const uploadPart = async (part) => {
      try {
        const etag = await this._uploadPart(
          credentials,
          fileKey,
          uploadId,
          part
        )
        return { partNumber: part.number, etag }
      } catch (error) {
        failedParts.push({ part, error })
        throw error
      }
    }

    // Usar Promise.all para controlar concurrencia
    const chunks = []
    for (let i = 0; i < pendingParts.length; i += parallel) {
      chunks.push(pendingParts.slice(i, i + parallel))
    }

    for (const chunk of chunks) {
      const results = await Promise.allSettled(chunk.map(uploadPart))
      for (const result of results) {
        if (result.status === 'fulfilled') {
          uploadedParts.push(result.value)
        }
      }
    }

    // Verificar si todas las partes se subieron correctamente
    if (uploadedParts.length !== totalParts) {
      throw new Error(
        `Upload incomplete: ${uploadedParts.length}/${totalParts} parts uploaded`
      )
    }

    // 4. Completar subida por partes (combinar partes)
    await this._completeMultipartUpload(
      credentials,
      fileKey,
      uploadId,
      uploadedParts
    )

    return {
      url: this._getFileUrl(fileKey),
      key: fileKey,
      size: file.size,
      parts: totalParts
    }
  }

  /**
   * Generar ruta de almacenamiento del archivo
   */
  _generateFileKey(file, directory = '') {
    const date = new Date()
    const datePath = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
    const random = Math.random().toString(36).substring(2, 10)
    const ext = file.name.split('.').pop() || 'bin'
    const key = directory
      ? `${directory}/${datePath}/${random}.${ext}`
      : `${datePath}/${random}.${ext}`
    return key
  }

  // ============ Métodos específicos de cada proveedor ============

  _getUploadUrl() {
    switch (this.provider) {
      case 'oss':
        return `https://${this.bucket}.oss-${this.region}.aliyuncs.com`
      case 'cos':
        return `https://${this.bucket}.cos.${this.region}.myqcloud.com`
      case 's3':
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com`
      default:
        throw new Error('Unknown provider')
    }
  }

  _getFileUrl(key) {
    return `https://${this.bucket}.${this.provider === 'oss' ? 'oss' : 'cos'}-${this.region}.${
      this.provider === 'oss'
        ? 'aliyuncs.com'
        : this.provider === 'cos'
          ? 'myqcloud.com'
          : 'amazonaws.com'
    }/${key}`
  }

  // Métodos de firma, subida por partes, etc. de cada proveedor... (implementar según necesidades reales)
  _buildFormFields(credentials, fileKey, fileType, options) {
    // Lógica de construcción de campos de formulario de cada proveedor
    // Implementar según la documentación específica del proveedor
    return {}
  }

  async _initMultipartUpload(credentials, fileKey, fileType) {
    // Lógica de inicialización de subida por partes de cada proveedor
    return 'upload-id'
  }

  async _uploadPart(credentials, fileKey, uploadId, part) {
    // Lógica de subida de partes de cada proveedor
    return 'etag'
  }

  async _completeMultipartUpload(credentials, fileKey, uploadId, parts) {
    // Lógica de finalización de subida por partes de cada proveedor
  }

  async _listParts(credentials, fileKey, uploadId) {
    // Lógica de listado de partes subidas de cada proveedor
    return []
  }
}

// Ejemplo de uso
const uploader = new DirectUploader({
  provider: 'oss',
  region: 'cn-beijing',
  bucket: 'myapp-images-prod',
  getCredentials: async () => {
    // Solicitar credenciales temporales al backend
    const res = await fetch('/api/upload/credentials')
    return res.json()
  }
})

// Subida de archivos pequeños
async function uploadAvatar(file) {
  try {
    const result = await uploader.upload(file, {
      directory: 'avatars',
      onProgress: (progress) => {
        console.log(`Progreso de subida: ${progress.percent}%`)
      }
    })
    console.log('Subida exitosa:', result.url)
    return result
  } catch (error) {
    console.error('Error de subida:', error)
    throw error
  }
}

// Subida de archivos grandes por partes
async function uploadVideo(file) {
  try {
    const result = await uploader.multipartUpload(file, {
      directory: 'videos',
      partSize: 10 * 1024 * 1024, // 10 MB por parte
      parallel: 3, // 3 concurrentes
      resume: true, // Soporte para reanudación
      onProgress: (progress) => {
        console.log(
          `Progreso de subida: ${progress.percent}%, subido ${progress.loaded}/${progress.total}`
        )
      },
      onPartComplete: (part) => {
        console.log(`Parte ${part.number} subida completada`)
      }
    })
    console.log('Subida exitosa:', result.url)
    return result
  } catch (error) {
    console.error('Error de subida:', error)
    // Aquí se puede implementar lógica de reintento o guardar información de punto de interrupción
    throw error
  }
}
```

### 9.2 Servicio de credenciales temporales en backend (Node.js/Express)

```javascript
/**
 * Servicio de credenciales temporales STS para almacenamiento de objetos
 * Compatible con: Alibaba Cloud OSS, Tencent Cloud COS, AWS S3
 */
const express = require('express')
const STS = require('ali-oss').STS // Alibaba Cloud
// const COS = require('cos-nodejs-sdk-v5') // Tencent Cloud
const router = express.Router()

// Configuración
const config = {
  // Configuración de Alibaba Cloud OSS
  oss: {
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    region: 'oss-cn-beijing',
    bucket: 'myapp-images-prod',
    // ARN del rol STS (necesita ser creado en la consola RAM)
    roleArn: process.env.OSS_STS_ROLE_ARN
  }
}

/**
 * Obtener credenciales temporales STS (Alibaba Cloud OSS)
 * POST /api/upload/credentials
 */
router.post('/credentials', async (req, res) => {
  try {
    // 1. Verificar identidad del usuario (implementar según necesidades reales)
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 2. Generar prefijo de ruta de archivo único (para aislamiento de permisos)
    const date = new Date()
    const prefix = `uploads/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${userId}/`

    // 3. Crear cliente STS
    const sts = new STS({
      accessKeyId: config.oss.accessKeyId,
      accessKeySecret: config.oss.accessKeySecret
    })

    // 4. Solicitar credenciales temporales
    const result = await sts.assumeRole(
      config.oss.roleArn,
      {
        // Policy para limitar el alcance de permisos (principio de mínimo privilegio)
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'oss:PutObject',
              'oss:InitiateMultipartUpload',
              'oss:UploadPart',
              'oss:CompleteMultipartUpload',
              'oss:AbortMultipartUpload',
              'oss:ListParts'
            ],
            Resource: [`acs:oss:*:*:${config.oss.bucket}/${prefix}*`]
          }
        ],
        Version: '1'
      },
      3600, // Validez de credenciales: 1 hora
      'web-upload-session-' + Date.now()
    )

    // 5. Devolver credenciales y configuración
    res.json({
      success: true,
      data: {
        // Credenciales temporales STS
        credentials: {
          accessKeyId: result.credentials.AccessKeyId,
          accessKeySecret: result.credentials.AccessKeySecret,
          sessionToken: result.credentials.SecurityToken,
          expiration: result.credentials.Expiration
        },
        // Configuración de subida
        config: {
          provider: 'oss',
          region: config.oss.region,
          bucket: config.oss.bucket,
          endpoint: `https://${config.oss.bucket}.${config.oss.region}.aliyuncs.com`,
          prefix: prefix, // Prefijo de ruta de archivo
          // Restricciones de seguridad
          maxSize: 100 * 1024 * 1024, // Máximo 100 MB
          allowedTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4'
          ]
        }
      }
    })
  } catch (error) {
    console.error('Get credentials failed:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get upload credentials',
      message: error.message
    })
  }
})

/**
 * Callback de notificación: El frontend notifica al backend después de completar la subida
 * POST /api/upload/callback
 */
router.post('/callback', async (req, res) => {
  try {
    const { key, etag, size, mimeType, originalName } = req.body
    const userId = req.user?.id

    // 1. Verificar si el archivo existe
    // 2. Guardar información del archivo en la base de datos
    const fileRecord = await db.files.create({
      userId,
      key,
      etag,
      size,
      mimeType,
      originalName,
      url: `https://cdn.example.com/${key}`,
      createdAt: new Date()
    })

    // 3. Procesamiento asíncrono: generar miniaturas, extraer metadatos, revisión de contenido, etc.
    await processFileAsync(fileRecord)

    res.json({
      success: true,
      data: {
        fileId: fileRecord.id,
        url: fileRecord.url,
        size: fileRecord.size
      }
    })
  } catch (error) {
    console.error('Upload callback failed:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to process uploaded file'
    })
  }
})

module.exports = router
```

### 9.3 Anti-hotlinking y configuración de seguridad

```javascript
/**
 * Ejemplo de configuración de anti-hotlinking y seguridad CDN
 */

// 1. Anti-hotlinking por Referer (evitar que otros sitios enlacen directamente tus recursos)
const refererConfig = {
  // Modo lista blanca: Solo permitir acceso desde los siguientes Referer
  allowList: [
    '*.myapp.com', // Sitio principal
    '*.myapp.cn', // Sitio nacional
    'localhost:*', // Desarrollo local
    '127.0.0.1:*'
  ],

  // Modo lista negra (opcional): Prohibir los siguientes Referer
  blockList: [
    '*. competitor.com', // Competidores
    'spam-site.com'
  ],

  // Manejo de Referer vacío: Si se permite acceso directo (escribir URL en la barra del navegador)
  allowEmptyReferer: false // Producción recomendado false, pruebas puede ser true
}

// 2. Autenticación de URL (anti-hotlinking más seguro, con timestamp y firma)
class URLAuth {
  constructor(config) {
    this.key = config.key // Clave de autenticación, solo se guarda en el servidor
    this.expireTime = config.expireTime || 3600 // Validez por defecto 1 hora
  }

  /**
   * Generar URL con autenticación
   * @param {string} url - URL original, ej: https://cdn.example.com/images/photo.jpg
   * @param {number} expireIn - Validez (segundos)
   * @returns {string} URL con parámetros de autenticación
   */
  sign(url, expireIn = this.expireTime) {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const timestamp = Math.floor(Date.now() / 1000) + expireIn

    // Construir cadena de firma (el formato varía según el proveedor, este es un ejemplo genérico)
    const signStr = `${pathname}-${timestamp}-${this.key}`
    const signature = this._md5(signStr)

    // Añadir parámetros de autenticación
    urlObj.searchParams.set('sign', signature)
    urlObj.searchParams.set('t', timestamp.toString())

    return urlObj.toString()
  }

  /**
   * Verificar firma de URL (usar en el edge CDN o en el origen)
   */
  verify(url) {
    const urlObj = new URL(url)
    const signature = urlObj.searchParams.get('sign')
    const timestamp = parseInt(urlObj.searchParams.get('t'))
    const pathname = urlObj.pathname

    // Verificar si ha expirado
    if (timestamp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'URL expired' }
    }

    // Verificar firma
    const signStr = `${pathname}-${timestamp}-${this.key}`
    const expectedSign = this._md5(signStr)

    if (signature !== expectedSign) {
      return { valid: false, error: 'Invalid signature' }
    }

    return { valid: true }
  }

  _md5(str) {
    // En proyectos reales usar crypto-js u otra biblioteca MD5
    // Esto es solo un ejemplo
    return require('crypto').createHash('md5').update(str).digest('hex')
  }
}

// Ejemplo de uso
const auth = new URLAuth({
  key: 'your-secret-key-only-known-by-server',
  expireTime: 3600 // Validez de 1 hora
})

// El servidor genera URL con firma
const signedUrl = auth.sign(
  'https://cdn.example.com/private/document.pdf',
  7200
)
// Resultado: https://cdn.example.com/private/document.pdf?sign=xxxxx&t=1699123456

// El edge CDN o el origen verifica
const result = auth.verify(signedUrl)
if (!result.valid) {
  // Devolver 403 Forbidden
}

// 3. Lista blanca/negra de IPs
const ipConfig = {
  // Solo permitir IPs específicas (adecuado para sistemas internos)
  whiteList: [
    '192.168.1.0/24', // Segmento de red interna
    '10.0.0.0/8'
  ],

  // Prohibir IPs específicas (bloquear atacantes)
  blackList: ['1.2.3.4', '5.6.7.8']
}

// 4. Lista blanca/negra de UA (User-Agent)
const uaConfig = {
  // Prohibir crawlers/herramientas de descarga
  blackList: [
    'Wget',
    'curl',
    'python-requests',
    'Scrapy',
    'AhrefsBot',
    'SemrushBot'
  ],

  // Solo permitir navegadores (modo estricto)
  whiteList: [
    'Mozilla/*', // Navegadores modernos
    'AppleWebKit/*'
  ]
}
```

---

## 10. Glosario de términos

| Término en inglés          | Traducción al español         | Explicación                                                                                                 |
| :------------------------- | :---------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **Object Storage**         | Almacenamiento de objetos     | Arquitectura de almacenamiento que gestiona datos como objetos en lugar de una jerarquía de sistema de archivos. Adecuado para imágenes, vídeos, copias de seguridad y otros datos no estructurados. |
| **Bucket**                 | Bucket (contenedor)           | Contenedor de nivel superior en el almacenamiento de objetos, usado para organizar y aislar datos. Cada bucket tiene su propio control de permisos y configuración. |
| **Object**                 | Objeto                       | Unidad básica del almacenamiento de objetos, compuesta por los datos en sí, metadatos y una clave única global. |
| **CDN**                    | Red de distribución de contenido | Content Delivery Network, acelera el acceso desplegando nodos edge globalmente y cacheando el contenido cerca del usuario. |
| **Edge Node**              | Nodo edge                    | Servidores de caché desplegados en diversas ubicaciones en la red CDN, que proporcionan servicio de contenido directamente a los usuarios. |
| **Origin**                 | Origen                       | Servidor del que el CDN obtiene contenido mediante back-to-source, puede ser almacenamiento de objetos, ECS o servidor propio. |
| **Cache Hit**              | Acierto de caché             | El contenido solicitado ya existe en el nodo edge CDN, se devuelve directamente sin back-to-source. |
| **Cache Miss**             | Fallo de caché               | El nodo edge no tiene el contenido solicitado, necesita back-to-source. |
| **Hit Ratio**              | Tasa de aciertos             | Proporción de aciertos de caché respecto al total de solicitudes. Cuanto mayor es, menos back-to-source y menor costo. |
| **TTL**                    | Tiempo de vida (Time To Live) | Período de validez del contenido en caché en el nodo CDN. Al expirar, necesita nuevo back-to-source. |
| **Back to Source**         | Back-to-source               | Proceso en el que el nodo edge CDN solicita contenido al origen. |
| **Purge/Refresh**          | Refrescar caché              | Forzar la invalidación de la caché CDN para que la siguiente solicitud obtenga el contenido más reciente del origen. |
| **Preheat**                | Precalentamiento             | Enviar proactivamente contenido a los nodos CDN antes de la publicación oficial para que el primer acceso ya acierte en caché. |
| **CORS**                   | Intercambio de recursos de origen cruzado | Cross-Origin Resource Sharing, mecanismo de seguridad del navegador que controla el acceso a recursos entre diferentes dominios. |
| **Referer**                | Referer (página de origen)   | Campo de cabecera HTTP que indica desde qué página se originó la solicitud. Usado para anti-hotlinking. |
| **STS**                    | Servicio de tokens de seguridad | Security Token Service, servicio que emite credenciales de acceso temporales, usado en escenarios de subida directa desde frontend. |
| **Multipart Upload**       | Subida por partes            | Dividir archivos grandes en múltiples partes para subida paralela, con soporte para reanudación, mejorando eficiencia y fiabilidad. |
| **ETag**                   | Etiqueta de entidad          | Cabecera de respuesta HTTP usada para identificar una versión específica de un recurso, comúnmente usada para validación de caché. |
| **S3 API**                 | API compatible con S3        | Especificación API de almacenamiento de objetos de AWS S3, compatible con la mayoría de proveedores cloud. |
| **Canonical Query String** | Cadena de consulta canónica  | Parte de la cadena de firma, usada para calcular la firma de solicitud y garantizar que la solicitud no sea manipulada. |

---

## Resumen: Las reglas de oro de Almacenamiento de Objetos + CDN

1. **Subida directa**: Archivos grandes con partes, seguridad con STS
2. **Caché en capas**: Navegador -> CDN -> Origen, caché en cada capa
3. **Servicio cercano al usuario**: DNS inteligente + cobertura global de nodos
4. **Seguridad sin descuidos**: HTTPS + anti-hotlinking + control de acceso
5. **Monitoreo de costos**: Tasa de aciertos, ancho de banda, almacenamiento por niveles, optimización continua

Esta arquitectura sostiene la gran mayoría del acceso a recursos estáticos en Internet. Entenderla es entender la base de la optimización del rendimiento web moderno.
