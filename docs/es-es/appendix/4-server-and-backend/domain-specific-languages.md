# Principios de los lenguajes de dominio específico (DSL)

::: tip Prefacio
En un caso real, el ingeniero Armin construyó un conjunto de servicios de infraestructura en su nueva empresa utilizando IA, con un total de aproximadamente 40 000 líneas de código (Go + YAML + Pulumi + código de pegamento SDK), de las cuales más del 90% fue generado por IA. En este caso aparecen muchos términos con los que un principiante no está familiarizado: YAML, Pulumi, HCL, Lua, código de pegamento SDK… No son Python ni JavaScript, pero están en todas partes en los proyectos backend. Este artículo presenta sistemáticamente estas tecnologías desde una perspectiva unificada: los **Lenguajes de Dominio Específico (DSL)**.
:::

**Objetivos de aprendizaje de este artículo**

En el desarrollo backend, además del código de lógica de negocio escrito en lenguajes de propósito general (Python, Go, Java, etc.), existe una gran cantidad de archivos y código con **propósitos y sintaxis diversos, pero que no pertenecen a ningún lenguaje de programación de propósito general**. Todos comparten un concepto superior: **DSL (Domain-Specific Language, Lenguaje de Dominio Específico)**.

Al finalizar este artículo, serás capaz de:

- Comprender la diferencia esencial entre los DSL y los lenguajes de propósito general (GPL)
- Dominar el sistema de clasificación de los DSL: formatos de serialización de datos, lenguajes de scripting embebidos, lenguajes de definición de infraestructura
- Distinguir los escenarios de aplicación de formatos de datos como XML, JSON, YAML, TOML, CSV y Protobuf
- Entender el propósito de diseño de lenguajes de scripting embebidos como Lua
- Explicar los principios y diferencias entre Terraform (HCL) y Pulumi
- Comprender cómo funciona la especificación OpenAPI y la generación automática de SDKs
- Juzgar qué tipos de código son adecuados para ser generados por IA

| Capítulo | Tema | Conceptos clave |
|-----|------|---------|
| **Capítulo 1** | Panorama general de los DSL | Definición de DSL vs GPL, sistema de clasificación y vista panorámica |
| **Capítulo 2** | Formatos de serialización de datos | XML, JSON, YAML, TOML, CSV, Protobuf, etc. |
| **Capítulo 3** | Lenguajes de scripting embebidos | Filosofía de diseño y aplicaciones típicas de Lua y otros lenguajes |
| **Capítulo 4** | Infraestructura como código | Principios y comparación de Terraform (HCL) y Pulumi |
| **Capítulo 5** | Código de pegamento y generación de SDKs | Especificación OpenAPI y generación automática de código cliente |
| **Capítulo 6** | La relación entre IA y DSL | Por qué la IA es especialmente buena generando código DSL |

---

## 1. Panorama general de los DSL: Otro mundo más allá de los lenguajes de propósito general

### 1.1 Introducción a DSL

Un **DSL (Domain-Specific Language, Lenguaje de Dominio Específico)** es un lenguaje diseñado para un dominio o tarea específica. Su contraparte es el **GPL (General-Purpose Language, Lenguaje de Programación de Propósito General)**, como Python, Java, Go, C++, etc., que están diseñados para resolver cualquier problema computacional.

Diferencias fundamentales:

| Dimensión | GPL (Lenguaje de propósito general) | DSL (Lenguaje de dominio específico) |
|------|-------------------|-------------------|
| **Objetivo de diseño** | Resolver cualquier problema computacional | Resolver problemas de un dominio específico |
| **Alcance expresivo** | Turing completo, teóricamente puede calcular cualquier cosa | Generalmente limitado intencionalmente en su alcance expresivo |
| **Costo de aprendizaje** | Alto, requiere comprender un sistema de lenguaje completo | Bajo, solo requiere comprender los conceptos del dominio |
| **Representantes típicos** | Python, Java, Go, C++, JavaScript | SQL, HTML/CSS, expresiones regulares, YAML, HCL |

De hecho, ya has estado usando DSL:

- **SQL** es un DSL para consultas de bases de datos — usas `SELECT * FROM users WHERE age > 18` para consultar datos, en lugar de escribir lógica de recorrido manual en Python
- **HTML/CSS** es un DSL para la estructura y estilos de páginas web — describes la página con etiquetas y atributos, en lugar de manipular píxeles con C++
- **Las expresiones regulares** son un DSL para el emparejamiento de patrones de texto — usas `\d{3}-\d{4}` para coincidir con números de teléfono, en lugar de escribir bucles de comparación de caracteres

### 1.2 Clasificación de los DSL

Los DSL se pueden clasificar en dos grandes categorías según si poseen completitud de Turing:

**DSL Externos (External DSL)**

Tienen una sintaxis y un analizador independientes, sin depender de ningún lenguaje de programación de propósito general. El código escrito por el usuario es procesado por un intérprete o compilador dedicado.

- Tipo de descripción de datos pura: JSON, YAML, XML, TOML, CSV, Protobuf (no contienen ninguna lógica)
- Tipo de consulta/operación: SQL, GraphQL, expresiones regulares (capacidad lógica limitada)
- Tipo de modelado de dominio: HCL (Terraform), Dockerfile, sintaxis de configuración de Nginx (describen declarativamente el estado de un dominio específico)

**DSL Internos (Internal DSL / Embedded DSL)**

Residen dentro de un lenguaje de programación de propósito general, utilizando la sintaxis del lenguaje anfitrión para construir expresiones específicas del dominio. El código en sí es código legal del lenguaje anfitrión, pero se lee como un lenguaje especializado.

- Pulumi (escrito en TypeScript/Python/Go, pero con una API diseñada para parecer configuración declarativa)
- Definiciones de rutas en Ruby on Rails (`get '/users', to: 'users#index'`, código Ruby legal, pero se lee como configuración)
- Sintaxis de aserciones en frameworks de testing (`expect(value).toBe(42)`, JavaScript legal, pero se lee como lenguaje natural)

### 1.3 Panorama de los DSL en proyectos backend

En un proyecto backend típico, encontrarás las siguientes categorías de DSL:

```
DSL en proyectos backend
├── Formatos de serialización de datos (describen estructuras de datos)
│   ├── Formatos de texto: JSON, YAML, XML, TOML, CSV, INI
│   └── Formatos binarios: Protobuf, MessagePack, Avro, BSON
├── Lenguajes de scripting embebidos (capa de configuración programable)
│   ├── Lua (motores de juegos, Nginx, Redis)
│   ├── GDScript (motor Godot)
│   └── Jsonnet (generación de plantillas de configuración)
├── DSL de infraestructura y operaciones (describen declarativamente el estado del sistema)
│   ├── HCL (Terraform)
│   ├── Dockerfile / Docker Compose YAML
│   └── Sintaxis de configuración de Nginx / Apache
└── Lenguajes de descripción de interfaces (describen contratos de API)
    ├── OpenAPI / Swagger
    ├── Protocol Buffers (archivos .proto)
    └── GraphQL Schema
```

Con esta vista panorámica, los capítulos siguientes desarrollarán cada rama.

---

## 2. Formatos de serialización de datos: Describir datos estructurados con texto

### 2.1 Introducción a serialización de datos

La **serialización (Serialization)** es el proceso de convertir estructuras de datos en memoria (objetos, diccionarios, arrays, etc.) en un flujo de texto o bytes que se pueda almacenar o transmitir. A la inversa, la restauración de un flujo de texto/bytes a una estructura de datos en memoria se denomina **deserialización (Deserialization)**.

Los formatos de serialización de datos son la categoría más básica de los DSL — pertenecen al tipo de DSL externo de descripción de datos pura, sin ninguna capacidad lógica, y solo se encargan de describir estáticamente "cuál es el valor".

### 2.2 Motivación de estos formatos

Supón que desarrollas un servicio backend con la dirección de base de datos `localhost:5432`. Si codificas esta dirección directamente en el código fuente, funciona en desarrollo local, pero al desplegar en producción, la dirección de la base de datos cambia a `db.prod.company.com:5432`, y necesitarías modificar el código fuente y recompilar.

La práctica habitual en ingeniería es: **separar los parámetros variables del código y almacenarlos en archivos de configuración independientes.** El programa lee el archivo de configuración al iniciarse y decide su comportamiento según los valores contenidos.

Además de la configuración, los formatos de serialización de datos se utilizan ampliamente en: intercambio de datos entre sistemas (solicitudes/respuestas de API), almacenamiento persistente de datos, comunicación entre lenguajes, entre otros escenarios.

### 2.3 Formatos de texto legibles por humanos

A continuación se presentan los formatos de serialización de texto más comunes en ingeniería, en orden histórico.

**INI**

El formato de configuración más antiguo, originado en sistemas Windows. De estructura simple, compuesto por secciones (section) y pares clave-valor:

```ini
[database]
host = localhost
port = 5432

[server]
debug = true
```

Su ventaja es la alta legibilidad. Su limitación es que no soporta estructuras anidadas ni tipos de array, por lo que no puede expresar configuraciones complejas. Actualmente aparece principalmente en sistemas heredados y algunas configuraciones de Linux (como `php.ini`, `my.cnf`).

**CSV**

**CSV (Comma-Separated Values, Valores Separados por Comas)** es el formato de datos tabulares más simple:

```csv
name,age,city
Alice,30,Beijing
Bob,25,Shanghai
```

Cada línea es un registro y los campos se separan por comas. CSV se usa ampliamente en importación/exportación de datos, intercambio de hojas de cálculo y pipelines de análisis de datos. Su limitación es que solo puede representar tablas bidimensionales planas, no soporta estructuras anidadas y carece de información de tipos (todos los valores son cadenas).

**XML**

**XML (eXtensible Markup Language, Lenguaje de Marcado Extensible)** nació en 1998 y fue en su día el estándar dominante para el intercambio de datos:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
  <database>
    <host>localhost</host>
    <port>5432</port>
  </database>
  <server>
    <debug>true</debug>
    <allowed_origins>
      <origin>https://example.com</origin>
      <origin>https://app.example.com</origin>
    </allowed_origins>
  </server>
</config>
```

XML tiene un gran poder expresivo, soportando anidamiento, atributos, espacios de nombres, validación mediante Schema y otras características avanzadas. Sin embargo, su sintaxis es verbosa — la gran cantidad de etiquetas de apertura y cierre resulta en una baja relación señal-ruido, haciendo que la escritura y lectura manual sea una experiencia deficiente.

XML sigue siendo ampliamente utilizado en los siguientes ámbitos:
- Ecosistema Java (`pom.xml` de Maven, configuración de Spring, archivos de layout de Android)
- Servicios web empresariales (protocolo SOAP)
- Formatos de documentos ofimáticos (`.docx`, `.xlsx` son esencialmente colecciones de archivos XML comprimidos en ZIP)
- Fuentes RSS/Atom, gráficos vectoriales SVG

**JSON**

**JSON (JavaScript Object Notation)** nació en 2001 y, debido a su simplicidad, reemplazó rápidamente a XML como el estándar de facto para el intercambio de datos en APIs web:

```json
{
  "database": {
    "host": "localhost",
    "port": 5432
  },
  "server": {
    "debug": true
  }
}
```

Su ventaja es una estructura clara, con soporte de análisis nativo en casi todos los lenguajes de programación. Su principal desventaja es que **no soporta comentarios**, y la abundancia de llaves y comillas lo hace propenso a errores al escribirlo manualmente. JSON es también el formato estándar para la configuración de proyectos frontend (`package.json`, `tsconfig.json`).

**YAML**

**YAML (YAML Ain't Markup Language)** también nació en 2001 y es actualmente el formato de configuración más utilizado en el ámbito del backend y DevOps. Herramientas como Docker Compose, Kubernetes y GitHub Actions utilizan YAML:

```yaml
# Configuración de base de datos
database:
  host: localhost
  port: 5432

# Configuración del servidor
server:
  debug: true
  allowed_origins:
    - https://example.com
    - https://app.example.com
```

Sus ventajas son el soporte de comentarios, una sintaxis concisa y la capacidad de expresar estructuras anidadas complejas. Su desventaja es que **depende de la indentación para representar relaciones jerárquicas**, y un error de indentación provoca fallos de análisis — este es el problema más común entre los principiantes.

> Nota: El nombre completo de YAML, "YAML Ain't Markup Language", es un acrónimo recursivo.

**TOML**

**TOML (Tom's Obvious Minimal Language)** nació en 2013 y es adoptado por el gestor de paquetes Cargo de Rust y `pyproject.toml` de Python:

```toml
[database]
host = "localhost"
port = 5432

[server]
debug = true
allowed_origins = [
  "https://example.com",
  "https://app.example.com"
]
```

TOML intenta combinar la simplicidad de INI con el poder expresivo de YAML, evitando al mismo tiempo los problemas de sensibilidad a la indentación.

### 2.4 Formatos de serialización binarios

Los formatos anteriores son todos texto legible por humanos. En escenarios con mayores exigencias de rendimiento y tamaño, existe otra categoría de **formatos de serialización binarios** — sacrifican la legibilidad a cambio de un menor tamaño y una mayor velocidad de análisis.

| Formato | Desarrollador | Características | Escenarios de uso típicos |
|------|-------|------|------------|
| **Protocol Buffers (Protobuf)** | Google | Requiere un archivo de Schema `.proto` predefinido, fuertemente tipado, tamaño extremadamente reducido | Comunicación gRPC, servicios internos de Google, microservicios de alto rendimiento |
| **MessagePack** | Comunidad | Similar a una versión binaria de JSON, no requiere Schema | Codificación interna de Redis, comunicación de alto rendimiento entre lenguajes |
| **Avro** | Apache | Soporta evolución de Schema, adecuado para escenarios de big data | Serialización de datos en ecosistema Hadoop / Kafka |
| **BSON** | MongoDB | Extensión binaria de JSON, soporta más tipos de datos | Formato de almacenamiento interno de MongoDB |

Tomando Protocol Buffers como ejemplo, primero se debe definir el Schema:

```protobuf
// user.proto
syntax = "proto3";

message User {
  string name = 1;
  int32 age = 2;
  string email = 3;
}
```

Luego, mediante el compilador (`protoc`), se genera automáticamente el código de serialización/deserialización para cada lenguaje. Este patrón de "primero definir el Schema, luego generar el código" es consistente con la idea de generación de SDKs a partir de OpenAPI que se presentará más adelante.

### 2.5 Comparación completa

| Formato | Tipo | Año de origen | Legibilidad | Soporta comentarios | Escenarios de uso típicos |
|------|------|---------|--------|---------|------------|
| **INI** | Texto | Años 80 | Alta | ✅ | Configuración del sistema, proyectos heredados |
| **CSV** | Texto | 1972 | Alta | ❌ | Importación/exportación de datos, intercambio de tablas |
| **XML** | Texto | 1998 | Media | ✅ | Ecosistema Java, servicios web empresariales, formatos de documentos |
| **JSON** | Texto | 2001 | Alta | ❌ | Intercambio de datos en APIs web, configuración frontend |
| **YAML** | Texto | 2001 | Alta | ✅ | Docker, K8s, CI/CD, configuración de servicios backend |
| **TOML** | Texto | 2013 | Alta | ✅ | Configuración de proyectos Rust / Python |
| **Protobuf** | Binario | 2008 | Nula | — | gRPC, comunicación en microservicios de alto rendimiento |
| **MessagePack** | Binario | 2008 | Nula | — | Comunicación de alto rendimiento entre lenguajes |
| **Avro** | Binario | 2009 | Nula | — | Pipelines de big data Hadoop / Kafka |
| **BSON** | Binario | 2009 | Nula | — | Almacenamiento interno de MongoDB |

**Punto clave**: La función esencial de todos estos formatos es la misma — **convertir datos estructurados a una forma almacenable y transmisible**. Los formatos de texto priorizan la legibilidad humana y la facilidad de edición; los formatos binarios priorizan el rendimiento de análisis y el volumen de transmisión. La elección del formato depende del equilibrio de requisitos del escenario concreto.


---

## 3. Lenguajes de scripting embebidos: La capa de configuración programable

### 3.1 Definición del concepto

Python, JavaScript, Go y otros lenguajes son lenguajes de programación de propósito general (General-Purpose Language), que pueden ejecutarse de forma independiente y construir aplicaciones completas.

En contraste, existe otra categoría de lenguajes **diseñados específicamente para incrustarse y ejecutarse dentro de otros programas anfitriones**, proporcionando capacidades de extensión programables al programa anfitrión. Estos lenguajes se denominan **lenguajes de scripting embebidos (Embedded Scripting Language)**.

El problema central que resuelven es: **cuando el poder expresivo de los archivos de configuración estáticos (YAML/JSON) no es suficiente y se necesita introducir lógica como condiciones y bucles, cómo lograr un comportamiento dinámico sin modificar el código fuente del programa anfitrión.**

### 3.2 Lua: El lenguaje de scripting embebido más representativo

Lua (que significa "luna" en portugués) es un lenguaje de scripting extremadamente ligero, cuyo intérprete completo ocupa solo unos cientos de KB tras la compilación. Su objetivo de diseño no es la ejecución independiente, sino servir como una capa de extensión incrustable.

Escenarios de aplicación típicos de Lua:

- **Motores de juegos**: El sistema de complementos de "World of Warcraft" y los scripts de juegos de "Roblox" utilizan Lua. El motor del juego implementa el renderizado central y los cálculos físicos en C/C++, delegando las partes que cambian con frecuencia — como la lógica de niveles y los diálogos de NPC — a scripts Lua. Así, los diseñadores de contenido pueden modificar el juego sin recompilar el motor.

- **Servidores web**: OpenResty incrusta Lua dentro de Nginx, permitiendo al personal de operaciones implementar lógica de filtrado de solicitudes, limitación de tasa, autenticación, etc., mediante scripts Lua, sin necesidad de modificar el código fuente en C de Nginx.

- **Bases de datos**: Redis permite enviar scripts Lua al servidor para su ejecución, utilizados para implementar operaciones compuestas que requieren garantías de atomicidad (como "leer y luego escribir").

A continuación, un ejemplo de script Lua incrustado en Nginx (OpenResty):

```lua
-- Función: Autenticar por token el acceso a la ruta /api/secret
local uri = ngx.var.uri
local token = ngx.req.get_headers()["Authorization"]

if uri == "/api/secret" and token ~= "Bearer my-secret-token" then
    ngx.status = 403
    ngx.say("Access denied")
    return ngx.exit(403)
end
```

### 3.3 Otros lenguajes de scripting embebidos

| Lenguaje | Entorno anfitrión | Usos típicos |
|------|---------|---------|
| **Lua** | Motores de juegos, Nginx (OpenResty), Redis | Lógica de juegos, políticas de gateway, operaciones de caché |
| **VimScript / Lua** | Editor Vim / Neovim | Desarrollo de complementos para editores |
| **Emacs Lisp** | Editor Emacs | Personalización del comportamiento del editor |
| **GDScript** | Motor de juegos Godot | Scripts de lógica de juego |
| **Jsonnet** | Ecosistema Kubernetes / Herramientas de generación de configuración | Generación con plantillas de grandes volúmenes de configuraciones JSON/YAML similares |

**Punto clave**: Los lenguajes de scripting embebidos, dentro de la clasificación de DSL, se sitúan en la **frontera entre DSL internos y DSL externos** — son lenguajes independientes (con su propia sintaxis e intérprete), pero su objetivo de diseño es ejecutarse incrustados en un programa anfitrión, no construir aplicaciones de forma independiente. Rellenan el vacío entre los "archivos de configuración estáticos" (DSL de descripción de datos pura) y los "lenguajes de programación de propósito general" (GPL): cuando la configuración necesita expresar lógica (condiciones, bucles, llamadas a funciones), incrustar un lenguaje de scripting ligero es la solución estándar en ingeniería.


---

## 4. Infraestructura como Código (Infrastructure as Code)

### 4.1 Introducción a "infraestructura"

En la ingeniería backend, la "infraestructura" (Infrastructure) se refiere a los recursos subyacentes de los que depende la ejecución de una aplicación:

- Recursos de computación: servidores (máquinas virtuales o contenedores)
- Almacenamiento de datos: instancias de bases de datos, buckets de almacenamiento de objetos
- Redes: reglas de firewall, balanceadores de carga, configuración de DNS
- Middleware: colas de mensajes, clústeres de caché

En la era de la computación en la nube, estos recursos se crean y gestionan a través de las consolas gráficas de los proveedores de servicios cloud (como AWS, Alibaba Cloud, Tencent Cloud).

### 4.2 Limitaciones de la gestión manual

Operar manualmente a través de la consola es viable en proyectos pequeños, pero a medida que crece la escala del proyecto, surgen los siguientes problemas:

1. **Irrepetible**: Los pasos de operación no quedan registrados, siendo imposible reproducir con precisión el mismo entorno
2. **No auditable**: No se puede rastrear "quién modificó qué configuración en qué momento"
3. **No colaborativo**: El proceso de operación no puede integrarse en control de versiones ni someterse a revisión de código
4. **Propenso a errores**: La operación manual en entornos de producción conlleva riesgos de errores operativos

La idea central de **Infraestructura como Código (Infrastructure as Code, IaC)** es: **usar código para definir declarativamente los recursos de infraestructura, dotándolos de control de versiones, ejecución automatizada y capacidad de despliegue repetible.**

### 4.3 Terraform

Terraform es la herramienta de IaC más utilizada actualmente, desarrollada por HashiCorp. Utiliza el lenguaje dedicado **HCL (HashiCorp Configuration Language)**.

Terraform adopta un paradigma **declarativo**: el usuario describe el estado final deseado y Terraform calcula automáticamente las operaciones necesarias para pasar del estado actual al estado objetivo.

```hcl
# Definir un servidor en la nube
resource "aws_instance" "my_server" {
  ami           = "ami-0c55b159cbfafe1f0"  # Imagen del sistema operativo
  instance_type = "t3.micro"               # Tipo de instancia

  tags = {
    Name = "my-first-server"
  }
}

# Definir una instancia de base de datos PostgreSQL
resource "aws_db_instance" "my_database" {
  engine         = "postgres"
  instance_class = "db.t3.micro"
  username       = "admin"
  password       = "please-use-secrets-manager"
}
```

Flujo de ejecución:

```bash
terraform plan    # Previsualizar los cambios a ejecutar
terraform apply   # Confirmar y ejecutar, creando automáticamente los recursos en la plataforma cloud
```

### 4.4 Pulumi

Pulumi ofrece otro enfoque: **usar directamente lenguajes de programación de propósito general (TypeScript, Python, Go, etc.) para definir la infraestructura**, en lugar de aprender la sintaxis dedicada de HCL.

La misma definición de servidor, expresada con Pulumi + TypeScript:

```typescript
import * as aws from "@pulumi/aws";

const server = new aws.ec2.Instance("my-server", {
    ami: "ami-0c55b159cbfafe1f0",
    instanceType: "t3.micro",
    tags: { Name: "my-first-server" },
});

const bucket = new aws.s3.Bucket("my-bucket", {
    acl: "private",
});

export const serverIp = server.publicIp;
```

Al usar un lenguaje de programación de propósito general, los desarrolladores pueden aprovechar bucles, condicionales, abstracciones funcionales y otras características del lenguaje para manejar lógica compleja de infraestructura.

### 4.5 Comparación entre Terraform y Pulumi

| Dimensión | Terraform | Pulumi |
|------|-----------|--------|
| **Lenguaje** | HCL (lenguaje dedicado) | TypeScript / Python / Go y otros lenguajes de propósito general |
| **Costo de aprendizaje** | Requiere aprender la sintaxis de HCL | Utiliza lenguajes de programación ya conocidos, menor costo de aprendizaje |
| **Ecosistema comunitario** | Muy maduro, cubre casi todos los proveedores cloud | Creciendo rápidamente, pero menor escala que Terraform |
| **Escenarios aplicables** | Gestión estandarizada de infraestructura liderada por equipos de operaciones | Proyectos liderados por desarrolladores, escenarios que requieren lógica compleja |
| **Adecuación para generación de código por IA** | Alta (patrones fijos) | Muy alta (esencialmente código de lenguaje de propósito general) |

**Punto clave**: HCL en las herramientas de IaC es un DSL externo típico — tiene una sintaxis y un analizador independientes, diseñado específicamente para describir declarativamente el estado de la infraestructura. Pulumi, por otro lado, adopta la estrategia de DSL interno — utilizando la sintaxis de un lenguaje de propósito general para expresar conceptos específicos del dominio. Ambos comparten el mismo objetivo (transformar la gestión de infraestructura de operación manual a dirigida por código), pero toman caminos diferentes (lenguaje dedicado vs lenguaje de propósito general). El código puede incluirse en control de versiones Git, someterse a revisión de equipo, ejecutarse y revertirse automáticamente.


---

## 5. Código de pegamento y generación automática de SDKs

### 5.1 Introducción a código de pegamento

En ingeniería de software, el **código de pegamento (Glue Code)** se refiere al código que no contiene lógica de negocio en sí mismo y solo sirve para conectar dos sistemas o módulos.

Ejemplos típicos de código de pegamento:

- Código de solicitudes HTTP escrito en el frontend para llamar a las APIs del backend (construcción de URLs, configuración de cabeceras, análisis de respuestas)
- Código de cliente HTTP escrito cuando el servicio backend A llama a la interfaz del servicio B
- Código de adaptación de interfaces entre diferentes lenguajes de programación

La característica de este tipo de código es: **altamente repetitivo, de patrones fijos, pero ineludible.**

### 5.2 Especificación OpenAPI y generación automática de código

Dado que el código de pegamento tiene características altamente patronizadas, la solución de la industria de la ingeniería es: **primero describir la interfaz API con un formato estándar, luego usar herramientas para generar automáticamente el código cliente.**

La **especificación OpenAPI** (anteriormente Swagger) es el estándar de la industria para describir APIs REST. Utiliza formato YAML o JSON para definir con precisión las rutas, parámetros, cuerpos de solicitud y estructuras de respuesta de la API:

```yaml
openapi: 3.0.0
info:
  title: API del servicio de correo
  version: 1.0.0

paths:
  /emails:
    post:
      summary: Enviar correo
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                to:
                  type: string
                  example: "user@example.com"
                subject:
                  type: string
                body:
                  type: string
      responses:
        '200':
          description: Envío exitoso
```

Basándose en este archivo de especificación, herramientas como `openapi-generator` pueden generar automáticamente SDKs cliente en múltiples lenguajes:

- **Python**: `client.emails.send(to="user@example.com", subject="Hi", body="Hello")`
- **TypeScript**: `client.emails.send({ to: "user@example.com", subject: "Hi", body: "Hello" })`
- **Go**: `client.Emails.Send(ctx, &SendEmailRequest{To: "user@example.com", ...})`

El SDK generado encapsula todos los detalles de las solicitudes HTTP, de modo que quien lo invoca no necesita preocuparse por la ruta URL, el método de solicitud, el formato de serialización u otros aspectos de bajo nivel.

### 5.3 Reinterpretando el caso de Armin

Volviendo al caso del principio del artículo, ahora podemos entender con precisión cada componente:

| Componente | Naturaleza | Descripción |
|---------|------|------|
| **Go** | Código de lógica de negocio | Implementación de la funcionalidad principal del servicio de envío/recepción de correos |
| **YAML** | Archivos de configuración | Configuración del servicio, definición de pipelines CI/CD, archivo de especificación OpenAPI |
| **Pulumi** | Código de infraestructura | Definición de recursos cloud (servidores, bases de datos, redes) con Go/TypeScript |
| **Código de pegamento SDK** | Librerías cliente autogeneradas | SDKs Python y TypeScript generados automáticamente a partir de la especificación OpenAPI |

De estos, la configuración YAML, las definiciones de recursos Pulumi y el código de pegamento SDK pertenecen a categorías altamente patronizadas, con restricciones de especificación claras — precisamente el ámbito donde la capacidad de generación de código por IA es más fuerte. Por lo tanto, que "el 90% de las 40 000 líneas de código fueran generadas por IA" es razonable.


---

## 6. La relación entre IA y DSL

### 6.1 Análisis de aplicabilidad de la generación de código por IA

| Dimensión | Adecuado para generación por IA | No adecuado para generación por IA |
|---------|-------------|---------------|
| **Grado de patronización** | Altamente repetitivo, existen plantillas fijas | Requiere diseño creativo, sin precedentes |
| **Restricciones de especificación** | Existe un esquema o especificación sintáctica clara | Requisitos difusos, límites poco claros |
| **Dependencia de contexto** | Localmente autocontenido, una definición no depende de la comprensión global | Requiere entender la intención arquitectónica de todo el sistema |
| **Verificabilidad** | Puede ser validado automáticamente por herramientas (ej. `terraform validate`) | Solo puede depender del juicio humano sobre la adecuación del diseño |

Las cuatro categorías de tecnología presentadas en este artículo — archivos de configuración, scripts embebidos, código IaC, código de pegamento SDK — poseen todas las características de la columna izquierda. Esto explica por qué la IA tiene un rendimiento significativamente mejor en la generación de código en estos ámbitos que en el código de lógica de negocio.

### 6.2 Marco de evaluación

Para juzgar si un determinado fragmento de código es adecuado para ser generado por IA, se pueden consultar los siguientes tres criterios:

1. **¿Existe una especificación o esquema predefinido?** — Si existe, es amigable para la IA
2. **¿Pertenece a un patrón masivamente repetitivo?** — Si es así, es amigable para la IA
3. **¿El resultado generado puede ser verificado automáticamente por herramientas?** — Si puede, es amigable para la IA

El código que cumple los tres criterios (como generar SDKs a partir de especificaciones OpenAPI, definir recursos homogéneos en lote con Terraform) puede depender en gran medida de la generación por IA. El código que no cumple ninguno de los tres (como diseñar un nuevo protocolo de consenso distribuido) aún requiere ser completado por ingenieros.

---

## 7. Glosario de términos

| Término | Nombre completo / en español | Definición |
|------|------------|------|
| **DSL** | Domain-Specific Language / Lenguaje de Dominio Específico | Lenguaje diseñado para un dominio específico, en contraposición a los lenguajes de propósito general |
| **GPL** | General-Purpose Language / Lenguaje de Propósito General | Lenguaje de programación capaz de resolver cualquier problema computacional, como Python, Java, Go |
| **DSL Externo** | External DSL | Lenguaje de dominio específico con sintaxis y analizador independientes, como SQL, HCL, YAML |
| **DSL Interno** | Internal DSL / Embedded DSL | Expresión específica de dominio que reside dentro de un lenguaje de propósito general, utilizando la sintaxis del anfitrión, como Pulumi |
| **Serialización de datos** | Data Serialization | Proceso de convertir estructuras de datos en memoria a un formato almacenable o transmisible |
| **INI** | Initialization | El formato de configuración de pares clave-valor más antiguo, originado en sistemas Windows |
| **CSV** | Comma-Separated Values / Valores Separados por Comas | Formato tabular de texto plano con campos separados por comas |
| **XML** | eXtensible Markup Language / Lenguaje de Marcado Extensible | Formato de datos de texto basado en etiquetas, gran poder expresivo pero sintaxis verbosa |
| **JSON** | JavaScript Object Notation | Formato ligero de intercambio de datos basado en pares clave-valor, estándar de facto en APIs web |
| **YAML** | YAML Ain't Markup Language | Formato de archivos de configuración basado en indentación, ampliamente usado en backend y DevOps |
| **TOML** | Tom's Obvious Minimal Language | Formato de configuración con sintaxis explícita, común en los ecosistemas Rust y Python |
| **Protobuf** | Protocol Buffers | Formato de serialización binario desarrollado por Google, requiere Schema predefinido, tamaño reducido y alta velocidad |
| **MessagePack** | — | Formato de serialización binario similar a JSON, no requiere Schema |
| **Lua** | — | Lenguaje de scripting embebido ligero, comúnmente usado en motores de juegos, servidores web y extensiones de bases de datos |
| **IaC** | Infrastructure as Code / Infraestructura como Código | Práctica de ingeniería para definir y gestionar recursos de computación en la nube mediante código |
| **Terraform** | — | Herramienta de IaC desarrollada por HashiCorp, utiliza el lenguaje declarativo HCL |
| **HCL** | HashiCorp Configuration Language | Lenguaje de configuración dedicado utilizado por Terraform |
| **Pulumi** | — | Herramienta de IaC que soporta lenguajes de programación de propósito general |
| **OpenAPI** | — | Especificación estándar de la industria para describir interfaces de APIs REST (anteriormente Swagger) |
| **SDK** | Software Development Kit / Kit de Desarrollo de Software | Librería cliente que encapsula los detalles de invocación de una API |
| **Código de pegamento** | Glue Code | Código de adaptación sin lógica de negocio, utilizado únicamente para conectar dos sistemas |

---

## Resumen

En la ingeniería backend existe una gran cantidad de código que no es de lógica de negocio. Todos comparten un concepto superior: **DSL (Lenguaje de Dominio Específico)** — lenguajes diseñados para dominios específicos, en contraposición a los lenguajes de programación de propósito general.

Los DSL presentados en este artículo se pueden agrupar en cuatro categorías:

1. **Formatos de serialización de datos** (XML / JSON / YAML / TOML / CSV / Protobuf, etc.) — DSL externos de descripción de datos pura, que convierten datos estructurados a una forma almacenable y transmisible
2. **Lenguajes de scripting embebidos** (Lua, etc.) — a medio camino entre la configuración y los lenguajes de propósito general, proporcionan capacidad de extensión programable al programa anfitrión
3. **Lenguajes de definición de infraestructura** (HCL / Dockerfile, etc.) — DSL externos declarativos que describen el estado deseado del sistema; Pulumi logra el mismo objetivo mediante un enfoque de DSL interno
4. **Lenguajes de descripción de interfaces y generación de código de pegamento** (OpenAPI / .proto) — generan automáticamente código de conexión entre sistemas a partir de descripciones de especificaciones

Una vez comprendido este marco de clasificación de los DSL, al enfrentarte a los diversos tipos de "código que no parece código" en los proyectos backend, podrás identificar rápidamente su naturaleza: a qué categoría de DSL pertenece, qué problema de dominio resuelve y por qué no se escribe en un lenguaje de programación de propósito general.

Al mismo tiempo, dado que el código DSL posee características de alta patronización, estar dirigido por especificaciones y ser verificable automáticamente, constituye actualmente el ámbito de aplicación más efectivo de la tecnología de generación de código por IA.