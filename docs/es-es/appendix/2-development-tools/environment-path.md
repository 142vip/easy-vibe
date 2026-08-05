# Introducción a las variables de entorno y PATH

> 💡 **Guía de aprendizaje**: Cada vez que escribes `git` o `python` en la terminal, el sistema tiene que buscar dónde está ese programa. Cada vez que tu código llama a la API de un modelo grande de lenguaje, el programa necesita saber qué clave usar. Ambas cosas dependen del mismo mecanismo: las **variables de entorno**.

---

## 0. Cada programa tiene su propio conjunto de configuración

Cada programa en ejecución tiene un conjunto de configuraciones «clave=valor» llamadas **variables de entorno**. El programa puede leer estas configuraciones en cualquier momento para conocer su entorno de ejecución.

Haz clic en cualquier variable de la lista de abajo para "ver" su valor en la terminal:

<EnvVarOverviewDemo />

---

## 1. PATH: Cómo encuentra Shell los comandos que escribes

`PATH` es una variable de entorno especial que almacena una lista de rutas de directorios (separadas por dos puntos). Cuando escribes `git`, Shell recorre estos directorios en orden, buscando un archivo ejecutable llamado `git` — se detiene al encontrar el primero.

```bash
$ echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

Selecciona un comando y observa el proceso de búsqueda directorio por directorio:

<PathSearchDemo />

**Tres reglas clave**:
- Cuanto más al principio esté un directorio en PATH, mayor será su prioridad
- Se detiene al encontrar la primera coincidencia, sin continuar la búsqueda
- Si ningún directorio lo contiene → `command not found`

---

## 2. Motivación para la terminal después de instalar una herramienta

Al instalar herramientas como nvm, Homebrew o conda, el script de instalación añade automáticamente una línea en `~/.zshrc` para incluir su directorio en PATH:

```bash
# Contenido escrito automáticamente por el script de instalación (ejemplo)
export PATH="/usr/local/opt/python@3.12/bin:$PATH"
```

Esta línea solo se ejecuta cuando se **inicia un nuevo Shell**. Las ventanas de terminal ya abiertas no se ven afectadas, por lo que:

```bash
# Sin reiniciar, también puedes hacerlo efectivo inmediatamente
source ~/.zshrc
```

**Situaciones comunes con herramientas de desarrollo con IA**:

```bash
# Ollama / pipx instalados pero dan command not found
which ollama          # Ver la ubicación real de instalación

# Ruta de herramientas CLI instaladas con pip (añadir a PATH)
# macOS: ~/Library/Python/3.x/bin
# Linux: ~/.local/bin
export PATH="$PATH:$HOME/.local/bin"

# Se recomienda usar pipx para instalar herramientas CLI, gestiona PATH automáticamente
pipx install aider-chat
```

---

## 3. Ámbito de las variables Identificación: ver esta variable

Las variables de entorno no se difunden a todos los programas — cada proceso tiene **su propia copia**, heredada del proceso padre. Modificar tu propia copia no afecta al proceso padre.

El siguiente diagrama muestra tres niveles. En el «nivel de usuario», exporta una nueva variable y comprueba si aparece en el «nivel de proceso»:

<EnvScopeDemo />

---

## 4. export: Determina si un proceso hijo puede leer esta variable

Al definir una variable, añadir o no `export` marca una diferencia fundamental:

<EnvExportDemo />

Para que una variable persista entre sesiones, escribe el `export` en un archivo de configuración:

```bash
# macOS (zsh)
echo 'export MY_VAR="value"' >> ~/.zshrc
source ~/.zshrc       # Efectivo inmediatamente, sin reabrir la terminal

# Linux (bash)
echo 'export MY_VAR="value"' >> ~/.bashrc
source ~/.bashrc
```

---

## 5. Claves de API: Nunca las escribas en el código

Al llamar a APIs como OpenAI, Anthropic o DeepSeek, la clave es tu «DNI + tarjeta de crédito». Si se filtra, otros pueden usar tu cuota y tú pagas la factura.

El error más común es escribir la clave directamente en el código:

<ApiKeyDangerDemo />

---

## 6. Desarrollo local: Usa un archivo .env para gestionar las claves

En desarrollo local, coloca las claves en un archivo `.env` en la raíz del proyecto; el código las lee a través de la librería dotenv. `.env` debe añadirse a `.gitignore` y nunca subirse a Git.

Escribe la configuración a la izquierda y léela a la derecha — cambia de lenguaje para ver ambos enfoques:

<DotEnvDemo />

---

## 7. Entorno de producción: Deja que la plataforma inyecte las claves

`.env` es una herramienta de conveniencia para la fase de desarrollo. En servidores y plataformas en la nube, el **entorno de ejecución** debe ser responsable de inyectar las claves; el código en sí no necesita saber dónde se almacenan:

<ServerSecretDemo />

---

## 8. Resolución de problemas práctica

### `command not found`

```bash
# Paso 1: Confirmar si está en PATH
which python3         # Si hay salida, lo encontró

# Paso 2: Encontrar la ubicación real del programa (macOS)
brew list python | grep bin

# Paso 3: Añadir el directorio a PATH
export PATH="/ruta/encontrada:$PATH"
source ~/.zshrc       # Recuerda hacer source después de escribir en el archivo de configuración
```

### Tengo dos versiones instaladas y no usa la que quiero

```bash
which python
# /usr/bin/python ← Versión antigua del sistema, más arriba en PATH

# Pon el directorio de la nueva versión al principio de PATH
export PATH="/usr/local/bin:$PATH"

which python
# /usr/local/bin/python ← Nueva versión, ahora tiene prioridad
```

### La variable está definida pero el programa no la lee

| Causa | Solución |
|:---|:---|
| Olvidaste `export` | Añade `export` y vuelve a probar |
| Modificaste `~/.zshrc` pero no surtió efecto | `source ~/.zshrc` |
| Usas `.env` pero no tienes dotenv instalado | `pip install python-dotenv` / `npm install dotenv` |
| En el servidor solo funciona en la sesión SSH | Usa `EnvironmentFile` de systemd |

---

## Glosario de términos

| Término | Significado |
|:---|:---|
| **PATH** | Almacena la lista de directorios donde Shell busca ejecutables, separados por dos puntos; el orden determina la prioridad |
| **export** | Marca una variable como heredable; los procesos hijos obtienen automáticamente una copia al iniciar |
| **source** | Re-ejecuta un archivo de configuración en el Shell actual, haciendo que los cambios surtan efecto inmediatamente |
| **which** | Muestra la ruta del ejecutable correspondiente a un comando (resultado de la búsqueda en PATH) |
| **.env** | Archivo de configuración local del proyecto, almacena claves de desarrollo; debe añadirse a `.gitignore` |
| **.env.example** | Plantilla con nombres de variables completos y valores vacíos; puede subirse a Git de forma segura |
| **chmod 600** | Permisos de archivo: solo el propietario puede leer y escribir; adecuado para proteger archivos de claves |
| **Secret Scanner** | Escaneo automático de fugas de claves en plataformas como GitHub; notifica a los proveedores para su revocación |
