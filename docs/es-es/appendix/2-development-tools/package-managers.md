# Introducción a los gestores de artefactos de compilación

> 💡 **Guía de aprendizaje**: Para escribir código no hace falta reinventar la rueda — el 99% de las funcionalidades ya han sido escritas y publicadas en internet. Un **gestor de paquetes** es la herramienta que te ayuda a encontrar, descargar y gestionar esas "piezas prefabricadas". Este capítulo gira en torno a una pregunta central: **¿cómo hacer que las dependencias de código sean reproducibles, colaborativas y mantenibles?**

---

## 0. Motivación de inevitablemente usarás un gestor de artefactos de compilación

Imagina que quieres escribir un programa Node.js que pueda hacer peticiones HTTP. Tienes dos caminos:

- **Método A (manual)**: Implementar tú mismo la conexión TCP, el análisis del protocolo HTTP, el manejo de redirecciones, el mecanismo de timeout... probablemente miles de líneas de código y meses de depuración.
- **Método B (gestor de paquetes)**: `npm install axios`, en diez segundos y una línea de código.

Un gestor de paquetes es esencialmente la **"tienda de aplicaciones" del código**. Te ayuda a:

1. Encontrar librerías publicadas por otros en un registro central (Registry)
2. Descargarlas e instalarlas automáticamente en tu proyecto
3. Gestionar las dependencias de esas librerías (las dependencias de tus dependencias)
4. Registrar qué versión exacta usas, para que la colaboración en equipo no tenga problemas

---

## 1. Panorama de gestores de artefactos de compilación por ecosistema/lenguaje

Diferentes lenguajes de programación y sistemas operativos tienen sus propias cadenas de herramientas, pero la lógica subyacente es idéntica.

👇 **Pruébalo**: Selecciona el ecosistema que conozcas y explora sus herramientas principales.

<PackageManagerOverviewDemo />

### 1.1 De dónde se descargan los artefactos de compilación — Registry (Registro)

Cada ecosistema tiene un registro central donde se almacenan todos los paquetes descargables:

| Ecosistema | Registro | Número de paquetes |
| :--- | :--- | :--- |
| JavaScript | [npmjs.com](https://npmjs.com) | 2 millones+ |
| Python | [pypi.org](https://pypi.org) | 500 mil+ |
| Rust | [crates.io](https://crates.io) | 150 mil+ |
| Go | [pkg.go.dev](https://pkg.go.dev) | 500 mil+ |
| macOS/Linux herramientas | [formulae.brew.sh](https://formulae.brew.sh) | 7000+ |
| Software Windows | [winget.run](https://winget.run) / [chocolatey.org](https://chocolatey.org) | Decenas de miles |

### 1.2 Comparación de los tres grandes de JavaScript: npm vs yarn vs pnpm

Funcionalidades similares, las diferencias están principalmente en **velocidad y uso de disco**:

```text
Uso de disco: pnpm (hardlinks compartidos) < yarn PnP (cero node_modules) < npm (copia completa)
Velocidad de instalación: pnpm ≈ yarn > npm
Hábito de uso: npm (el más universal) > pnpm (recomendado para nuevos proyectos) > yarn (algunos equipos)
```

**Recomendación**: Usa `pnpm` en proyectos nuevos; mantén la herramienta existente en proyectos ya iniciados, sin cambiar arbitrariamente.

### 1.3 Comparación de los tres grandes de Windows: winget vs Chocolatey vs Scoop

| | winget | Chocolatey | Scoop |
| :--- | :--- | :--- | :--- |
| **Respaldo oficial** | Microsoft oficial | Terceros | Terceros |
| **Requiere admin** | Parcialmente | Sí | **No** |
| **Ideal para** | Instalación de software diario | Despliegue empresarial masivo | Gestión de herramientas de desarrollo |
| **Número de paquetes** | Muchos y creciendo rápido | El mayor (10000+) | Enfocado en herramientas de desarrollo |

**Recomendación**: `winget` para el día a día, `scoop` para herramientas de desarrollo, `Chocolatey` para automatización empresarial.

---

## 2. Instalar un artefacto de compilación — qué pasa por detrás

Escribes `npm install axios`, la línea de comandos se queda quieta unos segundos y luego termina. ¿Qué pasó en esos segundos?

👇 **Pruébalo**: Selecciona un paquete, haz clic en "ejecutar" y observa todo el proceso de instalación.

<PackageInstallDemo />

### 2.1 Las cuatro fases explicadas

**① Resolución de dependencias (Resolve)**

El gestor primero "lee" qué quieres instalar. `axios`, por ejemplo, depende de `follow-redirects`, `form-data`, etc., que también deben instalarse. Este proceso se llama **construir el árbol de dependencias**.

**② Descarga (Fetch)**

Descarga todos los paquetes necesarios desde el Registry (archivos comprimidos `.tgz`). Los gestores inteligentes:
- Descargan varios paquetes en paralelo, en vez de esperar uno por uno
- Primero consultan la caché local; si está, no usan la red

**③ Enlace (Link)**

Descomprime los paquetes descargados y los coloca en el directorio `node_modules/`, resolviendo las relaciones de referencia.

**④ Escritura del lockfile**

Registra los **números de versión exactos** de esta instalación en `package-lock.json` (o `yarn.lock` / `pnpm-lock.yaml`).

### 2.2 Referencia rápida de los comandos más usados

```bash
# ── JavaScript (npm) ──────────────────────────────────
npm install              # Instalar todas las dependencias según package.json
npm install axios        # Instalar un paquete nuevo (dependencia de producción)
npm install -D jest      # Instalar dependencia de desarrollo (solo para desarrollo)
npm install -g tsx       # Instalación global (disponible en cualquier directorio)
npm uninstall axios      # Desinstalar paquete
npm update               # Actualizar todos los paquetes a la última versión compatible
npm run build            # Ejecutar scripts definidos en package.json
npx create-react-app .   # Ejecutar temporalmente, sin instalar en el proyecto

# ── Python (pip) ──────────────────────────────────────
pip install requests           # Instalar paquete
pip install requests==2.28.0   # Instalar versión específica
pip freeze > requirements.txt  # Exportar lista de dependencias actual
pip install -r requirements.txt # Instalar según la lista

# ── Rust (cargo) ──────────────────────────────────────
cargo add serde    # Añadir dependencia (actualiza Cargo.toml automáticamente)
cargo build        # Construir el proyecto
cargo test         # Ejecutar tests
cargo run          # Ejecutar el proyecto

# ── Go (go mod) ───────────────────────────────────────
go get github.com/gin-gonic/gin  # Añadir dependencia
go mod tidy                      # Limpiar dependencias
go build ./...                   # Construir

# ── Windows (winget) ──────────────────────────────────
winget install Git.Git           # Instalar software
winget upgrade --all             # Actualizar todo el software instalado
```

### 2.3 Introducción a npm scripts

En `package.json` hay un campo `scripts`; es el **ejecutor de tareas** integrado en npm:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "jest",
    "lint": "eslint src/"
  }
}
```

Se ejecutan con: `npm run dev`, `npm run build`. Las ventajas:
- **Punto de entrada unificado**: Los miembros del equipo no necesitan recordar los comandos específicos de cada herramienta
- **Configuración automática del entorno**: Al ejecutar, se añade automáticamente `node_modules/.bin` al PATH

---

## 3. Instalación global vs instalación local

Es uno de los conceptos que más confunden a los principiantes.

### 3.1 Diferencias

```bash
npm install axios        # Local: se instala en ./node_modules/, solo el proyecto actual puede usarlo
npm install -g typescript  # Global: se instala en un directorio del sistema, cualquier proyecto/directorio puede usarlo
```

| | Instalación local | Instalación global |
| :--- | :--- | :--- |
| **Ubicación** | `./node_modules/` | Directorio del sistema (ej. `/usr/local/lib/`) |
| **Ideal para** | Librerías de las que depende el proyecto (axios, vue, react) | Herramientas CLI (tsc, eslint, create-react-app) |
| **Aislamiento de versiones** | Cada proyecto tiene su versión independiente ✅ | Una versión compartida en todo el sistema ⚠️ |
| **Consistencia del equipo** | El lockfile garantiza consistencia ✅ | Cada persona puede tener versiones distintas ⚠️ |

### 3.2 La regla de oro

> **Las dependencias de librerías (axios, lodash, vue) siempre se instalan localmente;
> las herramientas CLI (tsc, eslint) preferiblemente se instalan localmente y se invocan con `npx`.**

**¿Por qué se recomienda instalar también las herramientas CLI localmente?**

Si instalas `eslint@8` globalmente, pero el proyecto A necesita las nuevas reglas de `eslint@9`, tendrás que alternar entre versiones globales. Si instalas `eslint` localmente y usas `npx eslint .`, cada proyecto puede configurar su propia versión de forma independiente.

### 3.3 npx — Ejecutar temporalmente sin contaminar el entorno

`npx` es el ejecutor de paquetes integrado en npm que te permite **ejecutar un paquete sin instalarlo**:

```bash
# Sin instalar create-vue, ejecutarlo directamente para iniciar un proyecto
npx create-vue my-project

# Sin instalar prettier, formatear archivos directamente
npx prettier --write src/

# Forzar una versión específica (ignorando la instalada)
npx typescript@5.4 tsc --version
```

Python con `uvx` y Rust con `cargo run` ofrecen capacidades similares de "ejecución temporal":

```bash
uvx ruff check .       # Python: ejecutar ruff checker temporalmente
cargo install ripgrep  # Rust: instalar globalmente, se convierte en el comando rg
```

---

## 4. El secreto de los números de versión — Versionado Semántico

En `package.json` verás algo como:

```json
{
  "dependencies": {
    "axios": "^1.6.8",
    "typescript": "~5.4.0"
  }
}
```

¿Qué significan `^` y `~`?

👇 **Pruébalo**: Pasa el ratón sobre las partes del número de versión para entender sus significados; haz clic en los símbolos de rango para ver qué versiones se aceptan.

<DependencyTreeDemo />

### 4.1 Motivación de fijar la versión exacta

| Enfoque | Ventaja | Desventaja |
| :--- | :--- | :--- |
| `"axios": "1.6.8"` (exacto) | Totalmente predecible | Los parches de seguridad no se actualizan automáticamente |
| `"axios": "^1.6.8"` (rango compatible, recomendado) | Obtiene automáticamente correcciones y nuevas funcionalidades | Rara vez puede introducir pequeñas incompatibilidades |
| `"axios": "*"` (cualquier versión) | Siempre la última | Un cambio de versión mayor puede romper el código por completo |

**Mejor práctica**: Declarar rangos con `^` + lockfile para fijar la versión exacta, usados en combinación.

### 4.2 Introducción a "infierno de las dependencias"

Cuando dependes de 50 paquetes y cada uno depende de varios más, el "árbol de dependencias" puede tener cientos de nodos. Si dos paquetes que usas necesitan **versiones incompatibles de la misma librería**, se produce un "conflicto de dependencias".

Soluciones de cada ecosistema:
- **npm v3+**: Eleva al nivel superior las de misma versión mayor; versiones mayores diferentes se instalan por separado
- **pnpm**: Hardlinks + aislamiento estricto, previniendo "dependencias fantasma" (paquetes no declarados pero disponibles)
- **cargo (Rust)**: A nivel del lenguaje, cada paquete solo puede depender de una versión, evitando conflictos
- **go mod (Go)**: Estrategia de Selección de Versión Mínima (MVS), elige la versión más baja que satisfaga todas las restricciones

---

## 5. El lockfile — La piedra angular de la colaboración en equipo

### 5.1 Motivación de un lockfile

Supongamos que `package.json` dice `"axios": "^1.6.0"`:

- Tú instalas hoy → obtienes `1.6.8`
- Tu compañero instala mañana → podría obtener `1.7.0` (publicado anoche)
- El servidor CI la semana que viene → podría obtener `1.7.1`

Mismo código, tres resultados distintos. El **lockfile** registra la versión exacta de cada paquete; todos instalan según él y obtienen resultados idénticos.

| Escenario | Comando | Comportamiento |
| :--- | :--- | :--- |
| Sincronizar entorno de desarrollo | `npm install` | Respeta el lockfile, no actualiza versiones |
| CI / despliegue en producción | `npm ci` | Instala **estrictamente** según el lockfile; si hay diferencias, da error |
| Actualizar versiones manualmente | `npm update` | Actualiza dentro del rango permitido y actualiza el lockfile |

### 5.2 El lockfile debe subirse a Git

**Las aplicaciones deben subirlo; las librerías publicadas en npm pueden no hacerlo.**

- ✅ **Aplicaciones web, servicios backend**: Deben subirlo para garantizar que desarrollo y producción sean idénticos
- ❌ **Librerías publicadas en npm**: Normalmente no se suben; los usuarios de la librería tienen su propio lockfile
- ✅ **Proyectos Python**: `requirements.txt` ya funciona como lockfile y debe subirse
- ✅ **Proyectos Go**: `go.sum` debe subirse para verificación de integridad

---

## 6. Entornos virtuales de Python

Python tiene un concepto que merece especial atención: el **entorno virtual (venv)**.

**¿Por qué se necesita?**

Python instala paquetes **globalmente** por defecto. Tu proyecto A necesita `requests==2.28`, tu proyecto B necesita `requests==2.31`; ambos entrarán en conflicto.

**Solución**: Crear un entorno virtual independiente para cada proyecto, sin interferencias.

```bash
# 1. Crear entorno virtual (ejecutar en la raíz del proyecto)
python -m venv .venv

# 2. Activar entorno virtual
source .venv/bin/activate        # macOS / Linux
.venv\Scripts\activate           # Windows (CMD)
.venv\Scripts\Activate.ps1       # Windows (PowerShell)

# 3. Tras activar, pip install solo afecta el entorno virtual actual
pip install requests

# 4. Salir del entorno virtual
deactivate
```

> ⚠️ **Problema común en Windows**: PowerShell bloquea la ejecución de scripts por defecto; ejecuta primero:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

**Alternativas modernas**:
- `conda create -n myproject python=3.11` — Gestiona incluso la versión de Python
- `uv venv && source .venv/bin/activate` — Escrito en Rust, velocidad de creación ultrarrápida

**¿Se debe subir `.venv` a Git?**

¡No! `.venv` se genera localmente; debe añadirse a `.gitignore`. Usa `requirements.txt` o `pyproject.toml` para describir las dependencias.

---

## 7. Referencia rápida de preguntas frecuentes

**P: ¿Se debe subir `node_modules` a Git?**

¡No! Suele pesar cientos de MB; debe añadirse a `.gitignore`. Con `package-lock.json`, cualquiera puede reconstruir con `npm install`.

**P: ¿Qué hacer si la instalación falla / aparecen errores extraños?**

```bash
# Limpiar caché, eliminar instalación anterior, reintentar
npm cache clean --force
rm -rf node_modules package-lock.json   # macOS/Linux
rmdir /s /q node_modules && del package-lock.json  # Windows CMD
npm install
```

**P: ¿La instalación es muy lenta?**

```bash
# Cambiar a espejo nacional (recomendado escribir en archivo .npmrc)
echo "registry=https://registry.npmmirror.com" > .npmrc

# pip también puede configurar espejo
pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple
```

**P: ¿Qué hacer si un paquete tiene vulnerabilidades de seguridad?**

```bash
npm audit          # Escanear vulnerabilidades conocidas
npm audit fix      # Corregir automáticamente vulnerabilidades compatibles
npm audit fix --force  # Forzar actualización (puede ser destructivo, usar con cuidado)
```

**P: ¿Cómo saber si un paquete es fiable?**

En [npmjs.com](https://npmjs.com) o [bundlephobia.com](https://bundlephobia.com) consulta:
- Descargas semanales (cuantas más, más fiable)
- Última actualización (más de 2 años sin actualizar, proceder con cautela)
- Número de dependencias (cuantas más, mayor probabilidad de introducir problemas)
- Stars en GitHub y actividad de Issues

**P: ¿Dónde se instala el software de winget en Windows?**

winget instala por defecto en el directorio del sistema (necesita admin) o `%LOCALAPPDATA%\Microsoft\WindowsApps`. Scoop instala todo en `%USERPROFILE%\scoop\apps\`, facilitando la gestión y migración.

---

## 8. Tabla de referencia de términos

| Término en inglés | Traducción | Explicación |
| :--- | :--- | :--- |
| **Package** | Paquete / Librería | Módulo de código escrito y publicado por otros |
| **Registry** | Registro / Repositorio | Servidor centralizado donde se almacenan todos los paquetes (ej. npmjs.com) |
| **Dependency** | Dependencia | Otros paquetes que tu proyecto necesita para funcionar |
| **devDependency** | Dependencia de desarrollo | Paquetes necesarios solo en la fase de desarrollo (frameworks de test, herramientas de build, etc.) |
| **Lockfile** | Archivo de bloqueo | Registra versiones exactas para garantizar consistencia del entorno |
| **SemVer** | Versionado Semántico | Convención de nomenclatura de versiones MAYOR.MENOR.PARCHE |
| **node_modules** | Directorio de módulos | Directorio donde npm almacena realmente los paquetes instalados |
| **venv** | Entorno virtual | Sandbox de aislamiento de paquetes independiente para proyectos Python |
| **tarball** | Archivo comprimido | Formato de distribución de paquetes, generalmente archivo `.tgz` |
| **Hoisting** | Elevación | npm eleva subdependencias al nivel superior para evitar instalación duplicada |
| **Phantom Dependency** | Dependencia fantasma | Paquetes no declarados en el archivo de configuración pero que pueden ser usados (pnpm lo previene) |
| **npx** | — | Ejecutor de paquetes integrado en npm, ejecuta paquetes temporalmente sin instalarlos |
| **go.sum** | — | Archivo de verificación hash de módulos Go, previene alteración de dependencias |
| **Crate** | — | Nombre de la unidad "paquete" en el ecosistema Rust |
| **winget** | — | Gestor de paquetes oficial de Windows (integrado en Windows 10/11) |

---

## Resumen: La esencia de los gestores de artefactos de compilación

Recuerda el núcleo en cuatro frases:

1. **Gestor de paquetes = Tienda de aplicaciones**: Te ayuda a encontrar, instalar y gestionar piezas de código, sin reinventar la rueda.
2. **Lockfile = Contrato de equipo**: Fija versiones exactas, haciendo que "en mi máquina funciona" sea cosa del pasado.
3. **Versionado semántico = Lenguaje de comunicación**: `^` obtiene actualizaciones de forma segura; cuando cambia MAYOR, hay que tener cuidado.
4. **Local > Global**: Las dependencias de proyecto deben instalarse localmente; usa `npx` / `uvx` para herramientas temporales, manteniendo el entorno limpio.
