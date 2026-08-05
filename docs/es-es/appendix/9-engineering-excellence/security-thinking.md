# Fundamentos del pensamiento de seguridad y ataque-defensa

::: tip Prefacio
**¿Es segura tu web?** Muchos desarrolladores piensan que "la seguridad es cosa del equipo de seguridad", hasta que su proyecto es atacado y los datos de los usuarios se filtran. La seguridad no es opcional, es una habilidad fundamental de cada desarrollador.

Este capítulo te ayudará a desarrollar un pensamiento de seguridad y a comprender las amenazas web más comunes y sus métodos de defensa.
:::

**¿Qué aprenderás en este artículo?**

| Capítulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capítulo 1** | Modelo de pensamiento de seguridad | Pensar como un atacante |
| **Capítulo 2** | Ataques web comunes | XSS, inyección SQL, CSRF |
| **Capítulo 3** | Estrategias de defensa | Validación de entrada, codificación de salida, control de permisos |
| **Capítulo 4** | Lista de verificación de seguridad | Autoevaluación de seguridad antes del lanzamiento |

Al finalizar este capítulo, tendrás una conciencia de seguridad básica y serás capaz de identificar y defender contra las amenazas de seguridad web más comunes.

---

## 0. Panorama general: Motivación de desarrolladores necesitan entender de seguridad

Imagina que construyes una casa con todas las comodidades y una decoración preciosa, pero olvidas poner cerraduras. Las vulnerabilidades de seguridad son las "cerraduras olvidadas" del mundo del código.

::: tip Principios fundamentales de seguridad
- **Principio de mínimo privilegio**: Concede solo los permisos necesarios, ni uno más
- **Defensa en profundidad**: No dependas de una sola línea de defensa, establece capas múltiples
- **Nunca confíes en la entrada**: Todos los datos provenientes del exterior pueden ser maliciosos
- **Seguridad por defecto**: La configuración predeterminada debe ser segura, no conveniente
:::

---

## 1. Ataques web comunes

A través del siguiente componente interactivo, conoce los principios de los tres ataques web más comunes (solo con fines educativos):

<WebSecurityDemo />

### 1.1 XSS (Cross-Site Scripting)

El atacante inyecta scripts maliciosos en una página web. Cuando otros usuarios la visitan, el script se ejecuta en sus navegadores.

```javascript
// Peligroso: insertar la entrada del usuario directamente en HTML
element.innerHTML = userInput
// Si userInput es <script>código_malicioso</script>, se ejecutará

// Seguro: usar textContent o escapar
element.textContent = userInput
// O usar el escape automático de frameworks ({{ }} de Vue, JSX de React)
```

**Puntos clave de defensa**:
- Escapar los caracteres especiales HTML en la salida (`<`, `>`, `&`, `"`, `'`)
- Usar los mecanismos de escape automático de los frameworks modernos
- Establecer la cabecera HTTP `Content-Security-Policy`

### 1.2 Inyección SQL

El atacante construye una entrada especial para alterar la lógica de una consulta SQL.

```javascript
// Peligroso: concatenación de strings en SQL
const query = `SELECT * FROM users WHERE name = '${userInput}'`
// Si userInput es ' OR '1'='1, devolverá todos los usuarios

// Seguro: usar consultas parametrizadas
const query = 'SELECT * FROM users WHERE name = ?'
db.execute(query, [userInput])
```

**Puntos clave de defensa**:
- Usar siempre consultas parametrizadas / sentencias preparadas
- Usar frameworks ORM (como Prisma, Sequelize)
- Limitar los permisos de la cuenta de base de datos

### 1.3 CSRF (Cross-Site Request Forgery)

El atacante induce a un usuario autenticado a visitar una página maliciosa, aprovechando su sesión activa para enviar solicitudes.

**Puntos clave de defensa**:
- Usar tokens CSRF
- Verificar la cabecera `Referer` / `Origin`
- Usar POST en lugar de GET para operaciones críticas
- Establecer el atributo `SameSite` en las cookies

---

## 2. Estrategias de defensa

### 2.1 Validación de entrada

```javascript
// Validación con lista blanca: solo permitir formatos esperados
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Limitación de longitud
function isValidUsername(name) {
  return name.length >= 2 && name.length <= 50
}
```

### 2.2 Protección de datos sensibles

| Tipo de datos | Medida de protección |
|---------|---------|
| Contraseñas | Hash con bcrypt/argon2, nunca almacenar en texto plano |
| Claves API | Variables de entorno, no subir al repositorio de código |
| Datos de usuarios | Transmisión por HTTPS, almacenamiento cifrado |
| Tokens de sesión | Cookies con HttpOnly + Secure + SameSite |

### 2.3 Cabeceras HTTP de seguridad

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
```

---

## 3. Lista de verificación de seguridad

Antes del lanzamiento, usa el siguiente componente interactivo para verificar la seguridad de tu proyecto:

<SecurityChecklistDemo />

### 3.1 Fase de desarrollo

- [ ] Todas las entradas de usuario están validadas y escapadas
- [ ] Se usan consultas parametrizadas, sin concatenación SQL
- [ ] Las contraseñas están almacenadas con hash (bcrypt u otro algoritmo)
- [ ] La configuración sensible se gestiona mediante variables de entorno
- [ ] El archivo `.env` está incluido en `.gitignore`

### 3.2 Fase de despliegue

- [ ] HTTPS está habilitado
- [ ] Las cabeceras HTTP de seguridad están configuradas
- [ ] El modo debug y los mensajes de error detallados están desactivados
- [ ] La base de datos usa una cuenta con privilegios mínimos
- [ ] Las dependencias se actualizan regularmente (`npm audit`)

---

## 4. Impulso de IA: Mejorar la seguridad con modelos de lenguaje

Los modelos de lenguaje pueden actuar como tu "consultor de seguridad", ayudándote a auditar vulnerabilidades en el código y generar soluciones de seguridad.

### 4.1 Auditoría de seguridad de código

> **Prompt**:
> ```
> Realiza una auditoría de seguridad del siguiente código, verificando si existe:
> - Vulnerabilidades XSS (entrada de usuario sin escapar)
> - Inyección SQL (consultas con concatenación de strings)
> - Riesgos CSRF (falta de verificación de Token)
> - Fuga de datos sensibles (claves codificadas, contraseñas en texto plano)
> Para cada problema, indica el nivel de riesgo, la ubicación específica y la solución.
>
> [Pega tu código]
> ```

### 4.2 Generar configuración de seguridad

> **Prompt**:
> ```
> Mi proyecto usa Express.js + PostgreSQL y está a punto de salir a producción.
> Genera una lista completa de configuración de seguridad que incluya:
> - Código de configuración de cabeceras HTTP de seguridad
> - Configuración CORS
> - Configuración segura de conexión a base de datos
> - Plan de gestión de variables de entorno
> Proporciona fragmentos de código listos para usar.
> ```

### 4.3 Explicar principios de vulnerabilidades

> **Prompt**:
> ```
> Con un ejemplo concreto, explica el flujo completo de un ataque CSRF:
> 1. Cómo construye el atacante una página maliciosa
> 2. Por qué el navegador envía automáticamente las cookies
> 3. Cómo se defiende el servidor con un token CSRF
> Demuestra con código el proceso completo de ataque y defensa.
> ```

::: tip Consejos de uso de IA
La auditoría de seguridad de la IA no puede reemplazar las pruebas de seguridad profesionales. Úsala como un primer filtro; los sistemas críticos aún necesitan auditorías de equipos de seguridad profesionales.
:::

---

## 5. Resumen

1. **Pensamiento de seguridad**: Nunca confiar en entradas externas, mínimo privilegio, defensa en profundidad
2. **Ataques comunes**: XSS, inyección SQL y CSRF son las amenazas de seguridad web más frecuentes
3. **Estrategias de defensa**: Validación de entrada, codificación de salida, consultas parametrizadas, cabeceras HTTP seguras
4. **Hábitos de seguridad**: Pasar por la lista de verificación de seguridad antes de cada lanzamiento, auditar dependencias periódicamente

::: tip Reflexión final
La seguridad no es un trabajo puntual, sino un hábito que permea todo el proceso de desarrollo. Es como abrocharse el cinturón de seguridad al conducir — no porque esperes un accidente, sino porque es una conciencia de seguridad básica. **Al escribir cada línea de código, pregúntate: ¿qué pasaría si esta entrada es maliciosa?**
:::

---

## Lecturas adicionales

- **OWASP Top 10**: La lista de las diez principales riesgos de seguridad en aplicaciones web, que todo desarrollador debería conocer.
- **Herramientas prácticas**: Usa `npm audit` para verificar vulnerabilidades en dependencias, y plugins de ESLint de seguridad para revisar el código.
- **Aprendizaje profundo**: Conoce los principios de HTTPS, las buenas prácticas de seguridad con JWT y las consideraciones de seguridad de OAuth 2.0.
- **Comunidad de seguridad**: Sigue los boletines de seguridad y aplica parches a las vulnerabilidades conocidas de inmediato.
