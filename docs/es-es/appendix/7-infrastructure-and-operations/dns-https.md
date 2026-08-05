# Principios de DNS de dominio y HTTPS

::: tip Prefacio
**Cuando escribes `www.google.com` en tu navegador y presionas Enter, ¿qué sucede detrás de escena?** Esta acción aparentemente simple implica una serie de procesos de colaboración que incluyen resolución de nombres de dominio, consultas DNS, cifrado TLS y más. Comprender estos mecanismos es esencial para cualquier desarrollador: determina directamente si tu sitio web puede ser visitado y si tus datos pueden ser interceptados.
:::

**¿Qué aprenderás en este artículo?**

Después de completar este capítulo, obtendrás:

- **Principios de DNS**: comprender el proceso completo de cómo los nombres de dominio se traducen a direcciones IP
- **Tipos de registros**: dominar los usos de los registros DNS comunes como A, CNAME, MX, etc.
- **Mecanismo HTTPS**: comprender cómo el handshake TLS establece una conexión segura
- **Sistema de certificados**: conocer la cadena de confianza de los certificados digitales y el mecanismo de verificación
- **Conciencia de seguridad**: entender por qué HTTPS es un requisito mínimo de la Web moderna

| Capítulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capítulo 1** | Resolución DNS | Consulta recursiva, consulta iterativa |
| **Capítulo 2** | Registros DNS | A, CNAME, MX, TXT |
| **Capítulo 3** | HTTPS y TLS | Proceso de handshake, comunicación cifrada |
| **Capítulo 4** | Cadena de confianza de certificados | CA, certificado raíz, certificado intermedio |
| **Capítulo 5** | HTTP vs HTTPS | Texto plano vs cifrado, comparación de seguridad |

---

## 0. Panorama general: del nombre de dominio a la conexión segura

La comunicación en Internet se basa en direcciones IP (como 142.250.80.46), pero los humanos no pueden recordar estos números. Por eso inventamos el **Sistema de Nombres de Dominio (DNS)**, la "agenda telefónica" de Internet, que traduce los nombres de dominio legibles por humanos en direcciones IP legibles por máquinas.

Pero poder encontrar el servidor no es suficiente. Si el contenido de la comunicación se transmite en texto plano, cualquier intermediario puede interceptar o alterar tus datos. **HTTPS** resuelve este problema: añade una capa de cifrado TLS sobre HTTP, garantizando la confidencialidad e integridad de los datos durante la transmisión.

::: tip Una visita web completa
1. **Resolución de nombre de dominio**: el navegador pregunta al DNS "¿cuál es la IP de www.google.com?", el DNS responde "142.250.80.46"
2. **Conexión TCP**: el navegador establece un handshake TCP de tres vías con el servidor
3. **Handshake TLS**: ambas partes negocian algoritmos de cifrado, verifican certificados e intercambian claves
4. **Comunicación cifrada**: todos los datos HTTP se transmiten a través del canal cifrado
:::

---

## 1. Resolución DNS: la "agenda telefónica" de Internet

El principio de funcionamiento de DNS (Domain Name System) es como buscar en una agenda telefónica: conoces el nombre de la persona (nombre de dominio) y necesitas encontrar su número de teléfono (dirección IP). Pero la "agenda telefónica" de Internet no es un solo libro, sino un sistema distribuido y jerárquico.

<DnsResolutionDemo />

::: tip Los cuatro pasos de la resolución DNS
1. **Caché del navegador**: primero busca en la caché local; si ya has visitado este dominio antes, usa la IP en caché directamente
2. **Resolvedor recursivo**: si no está en la caché, la solicitud se envía al resolvedor recursivo del ISP (como 8.8.8.8)
3. **Consulta jerárquica**: el resolvedor recursivo pregunta sucesivamente al servidor raíz → servidor TLD (.com) → servidor autoritativo (google.com)
4. **Retorno del resultado**: el servidor autoritativo devuelve la IP final, el resolvedor recursivo almacena en caché el resultado y lo devuelve al navegador
:::

| Nivel | Servidor | Responsabilidad | Cantidad |
|------|-------|------|------|
| Raíz | Root Server | Conoce las direcciones de todos los TLD | 13 grupos globally |
| TLD | TLD Server | Administra .com, .cn, .org, etc. | Un grupo por sufijo |
| Autoritativo | Authoritative | Almacena los registros DNS de dominios específicos | Al menos 2 por dominio |
| Resolvedor recursivo | Resolver | Realiza todo el proceso de consulta en nombre del usuario | ISP o DNS público |

---

## 2. Tipos de registros DNS: la "tabla de configuración" detrás de los dominios

DNS no solo traduce nombres de dominio a direcciones IP. A través de diferentes tipos de registros DNS, puedes controlar la entrega de correo, redirecciones de dominios, descubrimiento de servicios y más. Comprender estos tipos de registros es fundamental para configurar dominios y solucionar problemas de red.

<DnsRecordTypeDemo />

| Tipo de registro | Uso | Ejemplo |
|---------|------|------|
| A | Dominio → dirección IPv4 | `example.com → 93.184.216.34` |
| AAAA | Dominio → dirección IPv6 | `example.com → 2606:2800:220:1:...` |
| CNAME | Dominio → otro dominio (alias) | `www.example.com → example.com` |
| MX | Especifica el servidor de correo | `example.com → mail.example.com` |
| TXT | Almacena información de texto | Verificación SPF, verificación de propiedad del dominio |
| NS | Especifica el servidor DNS autoritativo | `example.com → ns1.example.com` |

::: tip Configuración DNS en escenarios reales
- **Desplegar un sitio web**: añade un registro A que apunte a la IP del servidor, o un CNAME que apunte al dominio del CDN
- **Configurar correo electrónico**: añade un registro MX que apunte al servidor de correo, y un registro TXT para configurar SPF/DKIM contra el spam
- **Verificar la propiedad del dominio**: el proveedor de servicios en la nube te pedirá que añadas un registro TXT específico para demostrar que posees el dominio
- **Balanceo de carga**: configura múltiples registros A para el mismo dominio, el DNS distribuye el tráfico por turnos
:::

---

## 3. HTTPS y TLS: poniento un "chaleco antibalas" a los datos

El protocolo HTTP transmite datos en texto plano, como enviar una postal donde el cartero (intermediario) puede leer el contenido libremente. HTTPS añade una capa de cifrado TLS (Transport Layer Security) sobre HTTP, equivalente a meter la postal en un sobre sellado.

El handshake TLS es el paso clave para establecer una conexión segura. Antes de transmitir datos formalmente, completa la autenticación de identidad y la negociación de claves.

<HttpsHandshakeDemo />

::: tip Pasos clave del handshake TLS 1.3
1. **Client Hello**: el cliente envía una lista de algoritmos de cifrado compatibles y un número aleatorio
2. **Server Hello**: el servidor selecciona el algoritmo de cifrado, devuelve el certificado digital y un número aleatorio
3. **Verificación del certificado**: el cliente verifica si el certificado del servidor es confiable (verifica la firma de la CA, la validez, la coincidencia del dominio)
4. **Intercambio de claves**: ambas partes negocian una clave compartida mediante el algoritmo ECDHE (la clave en sí no se transmite por la red)
5. **Comunicación cifrada**: todos los datos posteriores se transmiten cifrados con la clave simétrica negociada
:::

| Característica | TLS 1.2 | TLS 1.3 |
|------|---------|---------|
| Viajes de ida y vuelta del handshake | 2-RTT | 1-RTT (primera vez) / 0-RTT (reanudación) |
| Intercambio de claves | RSA o ECDHE | Solo ECDHE (seguridad hacia adelante) |
| Algoritmos de cifrado | Soporta muchos algoritmos antiguos | Solo conserva algoritmos seguros |
| Rendimiento | Más lento | Más rápido |

---

## 4. Cadena de confianza de certificados: Motivación de confiar en este sitio web

El paso más crítico en el handshake TLS es la "verificación del certificado". ¿Cómo determina el navegador que el certificado de un sitio web es auténtico y no una falsificación de un atacante? La respuesta es la **cadena de confianza de certificados**, un sistema de respaldo de confianza en capas.

<CertificateChainDemo />

::: tip Estructura de tres niveles de la cadena de confianza
1. **Certificado raíz (Root CA)**: emitido por una Autoridad Certificadora de confianza, preinstalado en sistemas operativos y navegadores. Este es el "ancla" de confianza.
2. **Certificado intermedio (Intermediate CA)**: emitido por la CA raíz, utilizado para emitir certificados finales. La CA raíz no emite certificados de sitios web directamente por razones de aislamiento de seguridad.
3. **Certificado final (Leaf Certificate)**: el certificado que tu sitio web utiliza realmente, emitido por la CA intermedia, contiene información como el dominio, la clave pública y la fecha de validez.
:::

| Tipo de certificado | Nivel de verificación | Velocidad de emisión | Escenario de uso |
|---------|---------|---------|---------|
| DV (Validación de dominio) | Solo verifica la propiedad del dominio | Minutos | Sitios personales, blogs |
| OV (Validación de organización) | Verifica la identidad de la organización | Días | Sitios web corporativos |
| EV (Validación extendida) | Verificación estricta de la organización | Semanas | Bancos, instituciones financieras |
| Certificado comodín | Cubre todos los subdominios | Depende del tipo | Escenarios con múltiples subdominios |

---

## 5. HTTP vs HTTPS: Motivación de cifrado es el requisito mínimo

En 2024, más del 95% del tráfico web global ya se transmite a través de HTTPS. El navegador Chrome marca los sitios HTTP con una advertencia de "No seguro", y los motores de búsqueda también reducen el ranking de los sitios HTTP. HTTPS ya no es una "opción", sino un requisito mínimo de la Web moderna.

<DnsHttpsComparisonDemo />

| Dimensión | HTTP | HTTPS |
|------|------|-------|
| Transmisión de datos | Texto plano, puede ser interceptado | Cifrado, no puede ser interceptado |
| Autenticación | Ninguna, no se puede verificar la identidad del servidor | Sí, verifica el servidor mediante certificados |
| Integridad de datos | Sin protección, puede ser alterado | Con protección, la alteración es detectada |
| Puerto | 80 | 443 |
| Impacto SEO | Ranking de búsqueda reducido | Bonificación en ranking de búsqueda |
| Indicador del navegador | Muestra advertencia "No seguro" | Muestra icono de candado |

::: tip Obtener certificados HTTPS gratuitos
**Let's Encrypt** es una autoridad certificadora gratuita y automatizada que permite a cualquier sitio web habilitar HTTPS sin costo. Junto con la herramienta Certbot, puedes solicitar y renovar automáticamente certificados con un solo comando. La mayoría de las plataformas en la nube y proveedores de CDN también ofrecen certificados SSL gratuitos.
:::

---

## Resumen

Los nombres de dominio, DNS y HTTPS son los tres pilares de la infraestructura de Internet. DNS nos permite acceder a sitios web usando nombres legibles por humanos, y HTTPS garantiza que el proceso de comunicación sea seguro y confiable.

Repaso de los puntos clave de este capítulo:

1. **DNS es un sistema jerárquico**: dominio raíz → TLD → dominio autoritativo, consulta por niveles, acelerada por caché
2. **Los tipos de registros tienen usos distintos**: el registro A apunta a una IP, CNAME crea un alias, MX gestiona el correo, TXT se usa para verificación
3. **El handshake TLS establece confianza**: verificación de certificados + negociación de claves, TLS 1.3 solo necesita 1-RTT
4. **Cadena de confianza de certificados**: CA raíz → CA intermedia → certificado final, respaldo en capas
5. **HTTPS es el requisito mínimo**: los certificados gratuitos (Let's Encrypt) hacen que el cifrado no tenga barreras

## Lecturas complementarias

- [How DNS Works](https://howdns.works/) - Explicación del funcionamiento de DNS en formato cómic
- [Documentación de Let's Encrypt](https://letsencrypt.org/docs/) - Guía para solicitar certificados SSL gratuitos
- [Cloudflare Learning Center](https://www.cloudflare.com/learning/dns/what-is-dns/) - Tutoriales de DNS y seguridad de red
- [TLS 1.3 RFC 8446](https://datatracker.ietf.org/doc/html/rfc8446) - Especificación del protocolo TLS 1.3
- [SSL Labs](https://www.ssllabs.com/ssltest/) - Prueba en línea de la calidad de configuración HTTPS de un sitio web
