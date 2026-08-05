# Principios de identidad y gestión de accesos en la nube
> **Guía de aprendizaje**: La ingeniería de prompts resuelve "cómo expresarse con claridad", la gestión de permisos de cuentas en la nube resuelve "quién puede hacer qué". Este capítulo se centra en una pregunta: **en el mundo cloud, ¿cómo autorizar convenientemente sin entregar las llaves a quien no debe?**

Antes de comenzar, se recomienda repasar dos conceptos básicos:

- **Qué es un Token**: Puedes consultar la sección "Tokenización y Token" en [Introducción a los grandes modelos de lenguaje](../8-artificial-intelligence/llm-principles.md).
- **Qué es un Prompt**: Si aún no estás familiarizado con la estructura básica de System / User / Assistant, puedes consultar [Ingeniería de prompts](../8-artificial-intelligence/prompt-engineering/).

---

## 0. Introducción: Motivación de "pisamos minas" nada más empezar en la nube

<IamRamComparisonDemo />

Mucha gente se encuentra con situaciones similares cuando empieza a usar servicios cloud:

- Por comodidad, escriben la AccessKey directamente en el código y la suben a GitHub;
- Dan permisos de "administrador" a todos los empleados, y alguien borra accidentalmente la base de datos de producción;
- Tras la entrega del proyecto, no saben quién tiene las contraseñas de los empleados que ya se fueron;
- Saben que deberían activar MFA, pero les parece "molesto" y lo van dejando.

Intuitivamente, podríamos pensar: **"Estos empleados no tienen suficiente conciencia de seguridad"**.

Pero la mayoría de las veces, el problema no está en las personas, sino en **no haber establecido un sistema correcto de gestión de permisos**.

<IntroProblemReasonSolution />

Ante estos desafíos, simplemente "tener cuidado" ya no funciona. Necesitamos una metodología sistemática de gestión de permisos, que es exactamente lo que **IAM (Identity and Access Management, gestión de identidad y acceso)** intenta resolver.

---

## 1. Introducción a IAM/RAM Empecemos con el "sistema de control de acceso"

### 1.1 Analogía: el control de acceso inteligente de una empresa

Imagina que tu empresa se muda a un nuevo edificio de oficinas:

| Escenario | Sin IAM | Con IAM |
| :--------- | :----------------------------- | :------------------------------------------- |
| Nuevo empleado | Le das una llave maestra que abre todas las puertas | Le das una tarjeta de acceso que solo abre las puertas de su área |
| Empleado que se va | La llave se pierde y no sabes quién la tiene | Desactivas inmediatamente su tarjeta de acceso, todas las puertas se cierran |
| Personal externo | Le prestas la llave por unos días | Emites una tarjeta temporal que caduca en 3 días |
| Visitante | La recepción le da una llave | Emites un código de visitante de un solo uso, solo para la sala de reuniones |

**IAM (Identity and Access Management, gestión de identidad y acceso)** es como este "sistema de control de acceso inteligente":

- **Identidad (Identity)**: ¿Quién? Empleados, personal externo, visitantes, aplicaciones
- **Acceso (Access)**: ¿A qué puertas puede entrar? ¿Qué operaciones puede realizar?
- **Gestión (Management)**: Cómo emitir llaves, cómo recuperarlas, cómo auditar registros

### 1.2 AWS IAM vs Alibaba Cloud RAM

<IamRamComparisonDemo />

Diferentes proveedores cloud tienen sus propias implementaciones de IAM:

| Proveedor cloud | Nombre del servicio | Conceptos centrales |
| :--------- | :----------------------------------- | :------------------------ |
| **AWS** | IAM (Identity and Access Management) | User, Group, Role, Policy |
| **Alibaba Cloud** | RAM (Resource Access Management) | 用户、用户组、角色、策略 |
| **Tencent Cloud** | CAM (Cloud Access Management) | 用户、用户组、角色、策略 |
| **Huawei Cloud** | IAM | 用户、用户组、委托、策略 |
| **Azure** | Azure AD + RBAC | User, Group, Role, RBAC |

Aunque los nombres difieren, **los conceptos centrales son los mismos**:

- **Usuario (User)**: Representa a una persona o aplicación concreta
- **Grupo (Group)**: Gestión por lotes de permisos para un conjunto de usuarios
- **Rol (Role)**: Define un conjunto de permisos que pueden ser "asumidos"
- **Política (Policy)**: Las reglas de permisos concretas (permitir/denegar qué)

---

## 2. Usuarios, grupos, roles: Selección para usar

### 2.1 Diferencias entre los tres tipos de "identidad"

<IdentityProviderDemo />

Usando una analogía de oficina:

| Concepto | Analogía | Caso de uso | Características |
| :------------------ | :----------------------------- | :------------------- | :--------------------------------- |
| **Usuario (User)** | Empleado fijo, con su propio puesto y tarjeta de acceso | Miembros estables del equipo a largo plazo | Tiene credenciales permanentes (contraseña, AK/SK) |
| **Grupo (Group)** | Departamento, como "Departamento técnico", "Ventas" | Gestión por lotes de permisos | No puede iniciar sesión, es solo un contenedor de permisos |
| **Rol (Role)** | Credencial temporal de visitante, tarjeta temporal de externo | Autorización temporal, acceso entre cuentas | No tiene credenciales permanentes, obtiene credenciales temporales mediante "asumir rol" |

### 2.2 Caso real: evolución de permisos en una startup

**Fase 1: Equipo fundador (2-3 personas)**

```
Problema: Usar la cuenta root directamente, porque es "más fácil"
Riesgo: La cuenta root tiene todos los permisos, si se filtra toda la cuenta queda comprometida
```

**Fase 2: Expansión del equipo (5-10 personas)**

```
Mejora: Crear IAM User para cada persona, asignar permisos diferentes
Problema:
- El operador Wang se fue, ¿en qué servidores están sus AK/SK?
- El nuevo frontend necesita permisos de solo lectura en S3, el backend necesita permisos RDS, configurar manualmente uno por uno es muy tedioso
```

**Fase 3: Formalización (10-30 personas)**

```
Mejora:
1. Crear IAM Groups por roles:
   - Developers: lectura/escritura en S3, EC2, RDS
   - DevOps: permisos completos, pero requiere MFA
   - ReadOnly: ver todos los recursos, sin modificar
   - QAs: acceso a recursos del entorno de pruebas

2. Usar IAM Role:
   - Instancias EC2 usan Instance Profile, sin AK/SK en el servidor
   - Acceso entre cuentas con Role Assume, sin compartir AK/SK
   - CI/CD usa OIDC Federation, sin credenciales a largo plazo
```

**Fase 4: Multi-cuenta / Nivel empresarial (30+ personas)**

```
Arquitectura:
- Master Account: solo para gestionar facturación y estructura organizativa
- Audit Account: recopila logs de todas las cuentas
- Dev Account: entorno de desarrollo
- Staging Account: entorno de pruebas
- Prod Account: entorno de producción, permisos más estrictos

Flujo de permisos:
- Desarrolladores solo tienen permisos de lectura en Dev por defecto
- Para modificar producción, solicitan Assume a un Role temporal en Prod
- Todas las operaciones Assume se registran en CloudTrail, auditoría periódica
```

---

## 3. Roles y políticas: el "alma" de la gestión de permisos

### 3.1 La esencia del rol: confianza + permisos

<RolePolicyDemo />

Un IAM Role tiene dos componentes principales:

1. **Política de confianza (Trust Policy)**: ¿Quién puede asumir este rol?
2. **Política de permisos (Permission Policy)**: ¿Qué puede hacer después de asumirlo?

Usando una analogía teatral:

| Concepto | Analogía | Explicación |
| :-------------------- | :--------------------- | :----------------------------------------------------------------------------------------- |
| **Role (Rol)** | "Hamlet" en la obra | Define qué obra representar (permisos) |
| **Trust Policy** | El director dice "quién puede interpretar a Hamlet" | Puede ser "actores de esta compañía" (usuarios de la cuenta), "actores prestados de otra compañía" (entre cuentas), "invitado especial" (IdP externo) |
| **Permission Policy** | El contenido de la obra | Qué puede hacer Hamlet: decir diálogos, luchar, enloquecer (permisos específicos) |
| **Assume Role** | El actor sube al escenario | Xiao Li es seleccionado por el director para interpretar a Hamlet, al subir al escenario obtiene todos los permisos definidos en la obra |
| **Credenciales temporales** | El pase de actuación | Xiao Li obtiene un "pase temporal de actuación" que expira cuando termina la función |

### 3.2 Política (Policy): la "sintaxis" de los permisos

<PermissionHierarchyDemo />

Una IAM Policy es un documento JSON que define "quién puede hacer qué operaciones sobre qué recursos".

**Ejemplo completo de Policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadWrite",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::my-app-bucket/*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": "ap-northeast-1"
        },
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        }
      }
    },
    {
      "Sid": "DenySensitiveData",
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::my-app-bucket/sensitive/*"
    }
  ]
}
```

**Explicación de campos clave**:

| Campo | Significado | Ejemplo |
| :------------ | :--------------------------------- | :----------------------- |
| **Version** | Versión de sintaxis de la Policy | "2012-10-17" |
| **Statement** | Array de declaraciones de permisos, puede contener múltiples reglas | [...] |
| **Sid** | ID de declaración, opcional, para identificar la regla | "AllowS3ReadWrite" |
| **Effect** | Efecto: Allow (permitir) o Deny (denegar) | "Allow" |
| **Action** | Operaciones permitidas/denegadas, soporta comodines | "s3:GetObject", "s3:\*" |
| **Resource** | Recurso afectado, identificado por ARN | "arn:aws:s3:::bucket/\*" |
| **Condition** | Opcional, solo se aplica bajo condiciones específicas | Restricción de región, requisito de MFA, etc. |

### 3.3 Prioridad de permisos: Deny > Allow > Denegación por defecto

La lógica de evaluación de permisos de IAM se resume en una frase: **un Deny explícito siempre gana, sin Allow se deniega**.

El flujo de evaluación es:

```
1. Primero verificar si hay una política de Deny
   ├─ Hay Deny → Denegar (independientemente de si hay Allow)
   └─ No hay Deny → Continuar verificando

2. Luego verificar si hay una política de Allow
   ├─ Hay Allow → Permitir
   └─ No hay Allow → Denegar (principio de denegación por defecto)
```

**Caso práctico: Proteger datos sensibles**

```json
// Política 1: Permisos normales para desarrolladores
{
  "Effect": "Allow",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/*"
}

// Política 2: Proteger directorio sensible (incluso si el desarrollador tiene s3:*, no puede acceder)
{
  "Effect": "Deny",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/sensitive/*"
}
```

**Puntos clave**:

- Aunque el desarrollador tiene permisos Allow de `s3:*`
- El directorio sensible tiene una regla Deny explícita
- Deny tiene mayor prioridad, por lo que el desarrollador no puede acceder a datos sensibles
- Incluso si el desarrollador es administrador, este Deny sigue vigente (excepto la cuenta root)

---

## 4. Claves de acceso (AK/SK): una "llave" que debe custodiarse con cuidado

### 4.1 Introducción a AK/SK

<AccessKeyManagementDemo />

La Access Key (clave de acceso) es una credencial a largo plazo proporcionada por servicios cloud para llamadas API programáticas. Consta de dos partes:

| Componente | Nombre | Función | Analogía |
| :-------------------- | :----------- | :------------------------- | :--------- |
| **Access Key ID** | ID de clave de acceso | Identifica quién eres (similar al nombre de usuario) | Número de tarjeta bancaria |
| **Secret Access Key** | Clave de acceso secreta | Demuestra que eres tú (similar a la contraseña) | PIN de la tarjeta bancaria |

### 4.2 Motivación de AK/SK es un "artículo de alto riesgo"

**Caso real: La lección de una startup**

Xiao Li es un nuevo ingeniero backend en una startup. Su primera semana, su tarea era depurar una función de subida de archivos.

```python
# Código de Xiao Li (¡tiene serios problemas de seguridad!)
import boto3

# Para facilitar la depuración, escribe AK/SK directamente en el código
s3 = boto3.client(
    's3',
    aws_access_key_id='AKIAIOSFODNN7EXAMPLE',
    aws_secret_access_key='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region_name='ap-northeast-1'
)

def upload_file(file_path, bucket_name, object_name):
    s3.upload_file(file_path, bucket_name, object_name)
    print(f"Archivo subido a s3://{bucket_name}/{object_name}")

# Prueba de subida
upload_file('./test.jpg', 'my-company-bucket', 'uploads/test.jpg')
```

**Lo que ocurrió una semana después**:

1. Xiao Li sube el código a GitHub (incluyendo AK/SK)
2. El código en GitHub es escaneado por crawlers, AK/SK se extraen
3. El atacante usa estas credenciales para crear numerosas instancias EC2 para minar criptomonedas
4. Al final del mes llega la factura: gasto adicional de 12.000 dólares
5. La auditoría descubre la filtración de AK/SK, Xiao Li es citado a una reunión...

**¿Qué nos enseña este caso?**

| Práctica incorrecta | Práctica correcta |
| :-------------------------- | :----------------------------------------------- |
| Codificar AK/SK en el código | Usar IAM Role, dejar que el programa obtenga credenciales temporales automáticamente |
| Subir AK/SK al repositorio Git | Usar `.gitignore` para ignorar archivos de configuración, usar servicios de gestión de secretos |
| No rotar AK/SK durante mucho tiempo | Rotar AK/SK periódicamente, usar credenciales temporales en lugar de credenciales a largo plazo |
| Asignar permisos excesivos a AK/SK | Seguir el principio de mínimo privilegio, conceder solo los permisos necesarios |

### 4.3 Guía de uso seguro de AK/SK

**Escenario 1: Desarrollo local**

```bash
# Práctica correcta: Usar AWS CLI para configurar credenciales, sin escribirlas en el código
aws configure
# Luego seguir las instrucciones para introducir Access Key ID y Secret Access Key
# Esta información se guarda en ~/.aws/credentials, con permisos 600

# En el código no se necesita ninguna configuración de credenciales
import boto3
s3 = boto3.client('s3')  # Lee automáticamente de ~/.aws/credentials
```

**Escenario 2: Servidor/EC2**

```python
# Práctica correcta: Usar IAM Instance Profile
# 1. Crear un IAM Role, adjuntar los permisos necesarios (como S3ReadOnly)
# 2. Crear un Instance Profile, asociar este Role
# 3. Al iniciar EC2, seleccionar este Instance Profile

# En el código no se necesitan credenciales
import boto3
s3 = boto3.client('s3')  # Obtiene credenciales temporales automáticamente del servicio de metadatos de EC2

# Las credenciales temporales se rotan automáticamente, sin preocuparse por la expiración
```

**Escenario 3: Pipeline CI/CD**

```yaml
# Práctica correcta: Usar OIDC Federation (OpenID Connect)
# Ejemplo con GitHub Actions:

# 1. En AWS crear OIDC Identity Provider, confiando en GitHub
# 2. Crear un IAM Role con política de confianza que permita al repositorio específico de GitHub asumirlo
# 3. Configurar en GitHub Actions

name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Clave: permitir solicitar token OIDC
      contents: read
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
          aws-region: ap-northeast-1
          # Nota: ¡Aquí no hay Access Key! Se usan credenciales temporales

      - name: Deploy
        run: aws s3 sync ./build s3://my-bucket/
```

**Resumen: Niveles de seguridad en el uso de AK/SK**

| Nivel de seguridad | Enfoque | Escenario aplicable | Nivel de riesgo |
| :------- | :-------------------------- | :------------------------ | :------- |
| Máximo | Usar IAM Role (sin credenciales a largo plazo) | EC2, Lambda, ECS, CI/CD | Muy bajo |
| Alto | Usar OIDC Federation | GitHub Actions, GitLab CI | Bajo |
| Medio | Usar servicio de gestión de secretos | Desarrollo local, equipos pequeños | Medio |
| Bajo | Usar variables de entorno | Prototipado rápido, proyectos personales | Alto |
| Muy bajo | Codificar en el código | No recomendado en ningún escenario | Muy alto |

---

## 5. Autenticación multifactor (MFA): añadir un "candado" a tu cuenta

### 5.1 Introducción a MFA

<MfaSecurityDemo />

MFA (Multi-Factor Authentication, autenticación multifactor), también llamada 2FA (Two-Factor Authentication, autenticación de dos factores), es un mecanismo de seguridad que requiere que los usuarios proporcionen **dos o más** tipos diferentes de factores de autenticación al iniciar sesión:

| Tipo de factor | Qué es | Ejemplo |
| :------------------------- | :----------------- | :------------- |
| **Factor de conocimiento** (algo que sabes) | Información que solo el usuario conoce | Contraseña, PIN |
| **Factor de posesión** (algo que tienes) | Dispositivo físico que posee el usuario | Teléfono, clave de hardware |
| **Factor biométrico** (algo que eres) | Características biométricas del usuario | Huella dactilar, reconocimiento facial |

### 5.2 Motivación de MFA es tan importante

**Los datos reales te dan la respuesta**:

| Tipo de ataque | Tasa de éxito sin MFA | Tasa de éxito con MFA |
| :----------------------- | :------------------ | :------------------------------ |
| Adivinación de contraseña / fuerza bruta | Alta | Muy baja (necesita un segundo factor) |
| Ataque de phishing para obtener contraseña | Alta | Muy baja (la página de phishing no puede obtener el código MFA) |
| Filtración de contraseñas (de otros sitios) | Alta | Muy baja (desconoce el segundo factor) |

**Informe de seguridad de Microsoft (2020)**: Activar MFA puede bloquear el **99,9%** de los ataques automatizados.

### 5.3 MFA en práctica: Activar MFA para la cuenta root de AWS

**Paso 1: Iniciar sesión en la consola de AWS**

1. Inicia sesión con el correo y contraseña de la cuenta root
2. En la esquina superior derecha, haz clic en tu nombre de cuenta y selecciona "Security Credentials"

**Paso 2: Activar MFA**

1. Encuentra la sección "Multi-factor authentication (MFA)"
2. Haz clic en "Assign MFA device"
3. Selecciona el tipo de dispositivo MFA (recomendado "Authenticator app")

**Paso 3: Configurar MFA virtual**

1. Instala Google Authenticator o Microsoft Authenticator en tu teléfono
2. Escanea el código QR o introduce la clave manualmente
3. Introduce el código de 6 dígitos que muestra la App (introduce dos consecutivos, ya que el código se actualiza cada 30 segundos)

**¡Listo!** Tu cuenta root ahora tiene protección MFA.

---

## 6. Acceso entre cuentas: Enfoque de "visitar" de forma segura

### 6.1 Motivación de acceso entre cuentas

<CrossAccountAccessDemo />

A medida que crece el negocio, muchas empresas adoptan una **arquitectura multi-cuenta** para aislar diferentes entornos:

| Tipo de cuenta | Uso | Requisitos de permisos |
| :------------------ | :--------------------- | :----------------- |
| **Master Account** | Gestión organizativa, liquidación de facturas | Casi sin uso |
| **Security Audit** | Recopilación centralizada de logs de todas las cuentas | Solo lectura en otras cuentas |
| **Shared Services** | Recursos compartidos (repositorio de imágenes, etc.) | Otras cuentas acceden solo lectura |
| **Development** | Entorno de desarrollo | Permisos completos para desarrolladores |
| **Staging** | Entorno de pruebas/pre-producción | Permisos para testers |
| **Production** | Entorno de producción | Restricción estricta, requiere aprobación |

**Problema: ¿Cómo permite que la EC2 de Production extraiga imágenes del repositorio de Shared Services?**

- Solución A: Escribir AK/SK en los datos de usuario de Production (¡peligro! Riesgo de filtración de AK/SK)
- Solución B: Usar Role Assume entre cuentas (¡recomendado! Credenciales temporales, rotación automática)

### 6.2 Principio de Role Assume entre cuentas

```
Cuenta A (Production)                    Cuenta B (Shared Services)
    |                                           |
    |  1. Solicitar Assume Role                |
    |  "Quiero asumir ECRReadRole de cuenta B" |
    |------------------------------------------>|
    |                                           |
    |                    2. Verificar política de confianza |
    |                    "¿Puede la cuenta A asumirme?"      |
    |                                           |
    |  3. Devolver credenciales temporales      |
    |  AccessKeyId, SecretKey, SessionToken    |
    |<------------------------------------------|
    |                                           |
    |  4. Usar credenciales temporales para acceder a ECR |
    |  docker pull cuentaB.dkr.ecr...           |
    ```

**Puntos clave**:

- Las credenciales temporales tienen validez de 1 hora por defecto, máximo configurable a 12 horas
- No es necesario almacenar credenciales a largo plazo en el código
- La política de confianza puede limitar quién puede asumir el rol (como especificar cuenta, ID externo)

### 6.3 Práctica: Configurar acceso ECR entre cuentas

**Escenario**: La EC2 de la cuenta Production necesita extraer imágenes Docker de la cuenta Shared Services.

**Paso 1: Crear IAM Role en la cuenta Shared Services**

1. Inicia sesión en la consola AWS de Shared Services
2. Ve a IAM -> Roles -> Create role
3. Selecciona "Another AWS account"
4. Introduce el Account ID de Production
5. Opcional: Marca "Require external ID" e introduce una cadena aleatoria (mayor seguridad)
6. Adjunta permisos: AmazonEC2ContainerRegistryReadOnly
7. Nombra el Role: CrossAccountECRReadRole

**Paso 2: Obtener el ARN del Role**

Tras la creación, copia el ARN del Role:

```
arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole
```

**Paso 3: Configurar instancia EC2 en la cuenta Production**

Método A: Usar Instance Profile (recomendado)

1. Crear IAM Role en Production (para EC2)
2. Política de confianza: confiar en el servicio EC2
3. Política de permisos: permitir Assume del Role entre cuentas

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole"
    }
  ]
}
```

4. Crear Instance Profile, asociar este Role
5. Al iniciar EC2, seleccionar este Instance Profile

Método B: Assume Role dinámico en los datos de usuario de EC2

```bash
#!/bin/bash
# Instalar AWS CLI
yum install -y aws-cli

# Assume Role entre cuentas
CREDS=$(aws sts assume-role \
  --role-arn arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole \
  --role-session-name EC2PullSession)

# Extraer credenciales temporales
export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r '.Credentials.SessionToken')

# Iniciar sesión en ECR
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com

# Extraer imagen
docker pull SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/my-app:latest
```

**Paso 4: Probar acceso entre cuentas**

En la EC2 de Production, ejecuta:

```bash
# Probar si puede hacer Assume Role
aws sts get-caller-identity
# Debería mostrar: arn:aws:sts::PRODUCTION_ACCOUNT_ID:assumed-role/CrossAccountECRReadRole/EC2PullSession

# Probar si puede listar repositorios ECR de Shared Services
aws ecr describe-repositories --registry-id SHARED_SERVICES_ACCOUNT_ID
```

**¡Listo!** Ahora la EC2 de Production puede extraer imágenes de Shared Services de forma segura, sin compartir credenciales a largo plazo.

---

## 7. Práctica: Construir un sistema de permisos seguro

### 7.1 Construir la arquitectura de permisos desde cero

<BestPracticesDemo />

Supongamos que eres el responsable técnico de una startup de 10 personas y necesitas diseñar la arquitectura de permisos AWS desde cero. Estos son los pasos recomendados:

**Fase 1: Protección de la cuenta root (Día 1)**

```
Objetivo: Proteger la cuenta root, la cuenta más importante

1. Activar MFA para la cuenta root (obligatorio)
   - Recomendado MFA hardware (YubiKey) o Google Authenticator

2. Crear cuenta de administrador IAM
   - Nombre de usuario: admin (o tu nombre)
   - Permisos: AdministratorAccess (pero se irán restringiendo)
   - Activar MFA

3. Eliminar la Access Key de la cuenta root (si se creó)
   - La cuenta root nunca debería tener AK/SK

4. Configurar alertas de uso de la cuenta root
   - Usar CloudWatch + SNS, enviar email/SMS cuando la cuenta root inicie sesión
```

**Fase 2: Agrupación de permisos del equipo (Semana 1)**

```
Objetivo: Agrupar a los miembros del equipo, gestionar permisos por lotes

1. Analizar roles del equipo:
   - Backend (2 personas)
   - Frontend (1 persona)
   - Mobile (1 persona)
   - Product Manager (1 persona)
   - Diseñador (1 persona)
   - Fundadores/Administradores (3 personas)

2. Crear IAM Groups:

   Group: Developers
   ├── Miembros: todos los desarrolladores (backend, frontend, mobile)
   ├── Permisos:
   │   ├── EC2: iniciar, detener, ver (pero no eliminar instancias de otros)
   │   ├── S3: lectura/escritura en buckets del entorno de desarrollo
   │   ├── RDS: solo lectura (no puede modificar la base de datos de producción)
   │   └── CloudWatch: ver logs
   └── Restricción: solo operar en la región ap-northeast-1

   Group: ProductTeam
   ├── Miembros: Product Manager, diseñador
   ├── Permisos:
   │   ├── S3: solo lectura (ver archivos de datos)
   │   ├── CloudWatch Dashboard: ver gráficos de monitorización
   │   └── Cost Explorer: ver facturación (pero no modificar)
   └── Restricción: solo lectura, no puede modificar ningún recurso

   Group: Administrators
   ├── Miembros: fundadores, responsable técnico
   ├── Permisos: AdministratorAccess
   └── Requisito: debe usar MFA para operar

3. Crear IAM User para cada persona y añadir al Group correspondiente
   - No adjuntar permisos directamente a individuos, gestionar todo a través de Groups
   - Activar MFA (obligatorio)
```

**Fase 3: Optimización de permisos a nivel de aplicación (Semanas 2-4)**

```
Objetivo: Permitir que las aplicaciones accedan de forma segura a los recursos AWS

1. Instancias EC2 usan Instance Profile
   - Ya no se configuran AK/SK en el servidor
   - Crear IAM Role, adjuntar permisos necesarios (como lectura/escritura S3)
   - Crear Instance Profile, asociar este Role
   - Al iniciar EC2, seleccionar este Instance Profile
   - En el código de la aplicación usar boto3 directamente, sin configurar credenciales

2. Si es imprescindible usar AK/SK (integración con terceros)
   - Usar AWS Secrets Manager para almacenar AK/SK
   - La aplicación lee de Secrets Manager al inicio
   - Configurar rotación periódica (90 días)
   - Monitorear el uso de AK/SK

3. Configurar CloudTrail para registrar todas las llamadas API
   - Crear un bucket S3 separado para almacenar logs
   - Configurar validación de archivos de log (prevenir manipulación)
   - Configurar notificaciones SNS para eventos críticos (como uso de cuenta root, cambios de políticas)
```

**Fase 4: Endurecimiento de seguridad (continuo)**

```
Objetivo: Establecer monitorización y mejora continua de seguridad

1. Activar AWS Config
   - Monitorear cambios en la configuración de recursos
   - Verificar cumplimiento (como si los security groups tienen 0.0.0.0/0 abierto)

2. Activar IAM Access Analyzer
   - Analizar continuamente las políticas de recursos
   - Identificar acceso externo (como si un bucket S3 es público)

3. Auditoría periódica de la configuración IAM
   - Revisión mensual de IAM Users y Roles no utilizados
   - Verificar el uso de Access Keys
   - Validar que la composición de los Groups es adecuada

4. Establecer un proceso de respuesta a incidentes de seguridad
   - Si se detecta filtración de AK/SK: eliminar inmediatamente, rotar, auditar el alcance del impacto
   - Si se detectan llamadas API anómalas: investigar inmediatamente, restringir permisos
```

---

## 8. Errores comunes y guía para evitarlos

### 8.1 Los diez anti-patrones de IAM

| # | Anti-patrón | Por qué es malo | Práctica correcta |
| :-- | :--------------------------- | :--------------------------------------------- | :----------------------------------------------- |
| 1 | Usar la cuenta root para operaciones diarias | La cuenta root tiene todos los permisos, si se filtra no se puede limitar el daño | Crear cuenta de administrador IAM, usar la cuenta root solo cuando sea necesario |
| 2 | Dar AdministratorAccess a todos | Viola el principio de mínimo privilegio, aumenta el riesgo de errores y amenazas internas | Agrupar por roles, conceder solo los permisos necesarios |
| 3 | Codificar AK/SK en el código | AK/SK pueden filtrarse fácilmente a través de GitHub, y son difíciles de rotar | Usar IAM Role, variables de entorno o servicios de gestión de secretos |
| 4 | No rotar AK/SK durante mucho tiempo | Aumenta la ventana de exposición si las credenciales se filtran | Establecer una política de rotación de 90 días, o mejor, usar credenciales temporales |
| 5 | Ignorar MFA | Si la contraseña se filtra, la cuenta queda comprometida inmediatamente | Activar MFA para todos los usuarios IAM, especialmente los de alto privilegio |
| 6 | No usar CloudTrail | No se puede auditar quién hizo qué, no se puede rastrear el origen tras un incidente | Activar CloudTrail, almacenar logs en una cuenta de auditoría independiente |
| 7 | IAM Policy demasiado permisiva | Como `Resource: "*"` o `Action: "*"`, aumenta la superficie de ataque | Especificar claramente el ARN del recurso y las Actions concretas |
| 8 | No limpiar IAM Users de empleados que se van | Las cuentas zombie pueden convertirse en puertas traseras | Establecer un proceso de baja, desactivar y eliminar IAM Users inmediatamente |
| 9 | No usar IAM Access Analyzer | No se pueden detectar políticas de recursos excesivamente permisivas (como buckets S3 públicos) | Activar IAM Access Analyzer, verificar periódicamente el acceso externo |
| 10 | No validar Policies en el entorno de pruebas | Aplicar Policies directamente en producción puede causar interrupciones del servicio | Usar IAM Policy Simulator para probar, validar primero en el entorno de pruebas |

---

## 9. Tabla de terminología

| Término en inglés | Traducción al español | Explicación |
| :--------------------------------------- | :-------------- | :----------------------------------------- |
| **IAM (Identity and Access Management)** | Gestión de identidad y acceso | Servicio que gestiona identidades de usuarios y permisos de acceso en servicios cloud |
| **RAM (Resource Access Management)** | Gestión de acceso a recursos | Nombre del servicio IAM de Alibaba Cloud |
| **Root Account** | Cuenta root | La cuenta de propietario creada al registrar la cuenta cloud, con los permisos más altos |
| **IAM User** | Usuario IAM / Subcuenta | Identidad secundaria creada por la cuenta root, para operaciones diarias |
| **IAM Role** | Rol IAM | Portador de permisos temporal, sin credenciales a largo plazo, necesita ser "asumido" |
| **IAM Policy** | Política IAM | Definición de reglas de permisos en formato JSON |
| **ARN** | Nombre de recurso de Amazon | Identificador único global de recursos |
| **AK/SK** | Clave de acceso / Clave secreta | Credenciales para acceso programático a APIs cloud |
| **STS** | Servicio de token de seguridad | Servicio que proporciona credenciales de seguridad temporales |
| **MFA** | Autenticación multifactor | Método de autenticación que requiere dos o más factores |
| **SSO** | Single Sign-On | Método de autenticación donde un inicio de sesión permite acceder a múltiples sistemas |
| **ExternalId** | ID externo | Identificador de seguridad utilizado para prevenir ataques de proxy confuso |
| **CloudTrail** | Servicio de auditoría cloud | Servicio de logs que registra todas las llamadas API y operaciones en la cuenta cloud |

---

## Resumen: Principios centrales de la gestión de permisos de cuentas cloud

La gestión de permisos de cuentas cloud no se logra de una vez, sino que debe evolucionar continuamente según el tamaño del equipo y las necesidades del negocio:

1. **Fase inicial** (1-10 personas):
   - Proteger la cuenta root (MFA + no usar para operaciones diarias)
   - Crear cuenta de administrador IAM
   - Agrupación básica (Developers, Admins)

2. **Fase de crecimiento** (10-50 personas):
   - Agrupación detallada de permisos (frontend, backend, operaciones, producto, etc.)
   - Usar IAM Role en lugar de AK/SK
   - Activar auditoría CloudTrail
   - Auditoría periódica de permisos

3. **Fase madura** (50+ personas / multi-cuenta):
   - Arquitectura multi-cuenta (Dev, Staging, Prod separados)
   - Cuenta centralizada de auditoría de logs
   - Auditoría automatizada de permisos y alertas
   - Proceso completo de solicitud y aprobación de permisos

**Recuerda tres principios fundamentales**:

1. **Principio de mínimo privilegio**: Conceder solo los permisos necesarios, no dar AdministratorAccess
2. **No usar credenciales a largo plazo**: Priorizar IAM Role y credenciales temporales, evitar filtraciones de AK/SK
3. **Activar MFA**: Especialmente para la cuenta root y cuentas de alto privilegio, es la medida de seguridad más eficaz

---

> **Lecturas adicionales**:
>
> - [Documentación oficial de AWS IAM](https://docs.aws.amazon.com/iam/)
> - [Documentación oficial de Alibaba Cloud RAM](https://www.aliyun.com/product/ram)
> - [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
