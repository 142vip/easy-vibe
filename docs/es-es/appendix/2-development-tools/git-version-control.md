# Principios del control de versiones con Git

> 💡 **Guía de aprendizaje**: Este capítulo está escrito específicamente para personas que nunca han usado Git. No vamos a empezar haciéndote memorizar comandos, sino a entender primero "¿qué problema te ayuda a resolver Git?", y luego conectarás los comandos y conceptos paso a paso. Al terminar, deberías poder realizar de forma independiente: commits locales, crear ramas y hacer push a GitHub.

---

## 0. Primero una pregunta: has vivido estas pesadillas

**Escenario uno: el infierno de las versiones**

Escribes un artículo o código, llegas a la mitad y te das cuenta de que te has equivocado. Quieres volver a la versión de hace tres días, pero no la encuentras.

```
proyecto_v1.zip
proyecto_v2_modificado.zip
proyecto_v3_version_final.zip
proyecto_v3_version_final_la_buena.zip
proyecto_v3_version_final_ya_no_lo_cambio_mas.zip
```

Cada vez que guardas una copia nueva, el disco se vuelve más caótico y no recuerdas qué cambió en cada versión.

**Escenario dos: la pesadilla de la colaboración**

Tú y tu compañero modificáis el mismo archivo al mismo tiempo:
- Tú cambiaste la línea 10, añadiendo la funcionalidad de login
- Tu compañero cambió la línea 10, corrigiendo un bug
- Os enviáis el código por correo electrónico, y al fusionar, los cambios de uno sobrescriben los del otro
- Nadie sabe qué fragmento de código es el correcto

**Escenario tres: sin "pastilla de arrepentimiento"**

Despliegas código nuevo en producción y aparece un bug. Necesitas volver urgentemente a la última versión estable, pero no sabes cómo revertir y solo puedes buscar desesperadamente una copia de seguridad.

---

**Git nació precisamente para resolver estos tres problemas.**

Git es un **sistema de control de versiones** (Version Control System). Su esencia es: **registrar cada operación de "guardado" que realizas, formando una línea temporal completa del historial, permitiéndote volver a cualquier punto en cualquier momento.**

Sin exagerar, Git es una de las herramientas más importantes del desarrollo de software moderno. Casi todas las empresas y todos los proyectos de código abierto lo usan.

---

## 1. Git y GitHub son lo mismo

Muchos principiantes confunden estos dos conceptos. Vamos a aclarar:

| | Git | GitHub |
| :--- | :--- | :--- |
| **Qué es** | Una herramienta de control de versiones que se ejecuta en tu ordenador | Un sitio web que almacena repositorios Git (en la nube) |
| **Dónde está** | Tu ordenador local | En Internet |
| **¿Se puede usar de forma independiente?** | ✅ Sí, solo gestiona el historial local | ❌ Necesita usarse junto con Git |
| **Analogía** | Tu diario personal | Un disco en la nube para guardar el diario |

En resumen: **Git es la herramienta, GitHub es el servicio de alojamiento.** Así como Word es la herramienta y OneDrive es la nube; se usan juntos, pero no son lo mismo.

Además de GitHub, existen servicios similares como GitLab, Gitee (nacional), etc.

---

## 2. Concepto central: las tres áreas

Este es el diseño más importante de todo Git. Si entiendes estas tres áreas, entenderás el alma de Git.

Git divide el estado de tus archivos en tres capas:

**Directorio de trabajo (Working Directory)**
Es tu **carpeta normal**, todos los archivos que ves y estás editando están aquí. Puedes modificar lo que quieras; Git detectará qué has cambiado, pero no registrará nada.

**Área de preparación (Staging Area / Index)**
Es una **estación de tránsito de "pre-commit"**. Puedes "poner" los archivos del directorio de trabajo que quieres guardar en el área de preparación, como si metieras paquetes en una caja de envío — aún no se han enviado, pero ya has elegido qué enviar.

**Repositorio (Repository)**
Es el **archivo permanente del historial**, oculto en la carpeta `.git`. Cada vez que ejecutas `git commit`, el contenido del área de preparación se sella en el repositorio, formando un registro histórico inmutable.

👇 **Pruébalo**: Haz clic en los botones de comando en secuencia y observa cómo los archivos fluyen entre las tres áreas.

<GitCommitFlow />

### Motivación de enfoque de "dos pasos" (add + commit)

Muchos principiantes preguntan: ¿por qué no se puede guardar con un solo clic y hay que hacer primero `add` y luego `commit`?

**Porque en el desarrollo real, a menudo no quieres confirmar todos los cambios a la vez.**

Ejemplo: hoy has modificado 5 archivos:
- `login.js`: completaste la funcionalidad de login (quieres confirmar)
- `style.css`: ajustaste los estilos de la página de login (quieres confirmar)
- `debug.log`: salida de depuración temporal (**no** quieres confirmar)
- `experiment.js`: una nueva función en prueba, aún sin terminar (**no** quieres confirmar)
- `todo.txt`: tus notas personales (**no** quieres confirmar)

Sin el área de preparación, tendrías que confirmar los 5 archivos (historial desordenado) o no confirmar ninguno.

Con el área de preparación, puedes controlar con precisión: `git add login.js style.css`, poniendo solo estos dos archivos en la caja, y luego `commit`. Este commit registrará claramente "funcionalidad de login completada".

---

## 3. Primer uso de Git: inicialización y flujo de trabajo básico

### 3.1 Instalación e inicialización

Después de instalar Git (macOS lo incluye, en Windows descárgalo de git-scm.com), abre la terminal y ve a la carpeta de tu proyecto:

```bash
# Inicializar un repositorio Git en la carpeta actual
git init

# Git creará una carpeta oculta .git, todo el historial se almacena ahí
# Salida: Initialized empty Git repository in .../tu-proyecto/.git/
```

La primera vez que lo uses, necesitas decirle a Git quién eres (esta información se adjunta a cada commit):

```bash
git config --global user.name "Tu nombre"
git config --global user.email "tu@email.com"
```

### 3.2 Flujo de trabajo diario: guardar en tres pasos

Después de inicializar, el 90% de las operaciones del desarrollo diario es repetir estos tres pasos:

**Primer paso: ver el estado**

```bash
git status
```

Este es el comando que más usarás, sin excepción. Te dice:
- En qué rama estás
- Qué archivos han sido modificados (rojo = no preparados)
- Qué archivos están en el área de preparación (verde = preparados, esperando commit)

**Segundo paso: poner archivos en el área de preparación**

```bash
# Añadir un solo archivo
git add login.js

# Añadir varios archivos
git add login.js style.css

# Añadir todos los archivos modificados en la carpeta actual (el . significa "todos")
git add .
```

> ⚠️ Error común de principiantes: `git add .` es muy práctico, pero añadirá todas las modificaciones, incluyendo archivos temporales que no quieres confirmar. Acostúmbrate a hacer add preciso, o usa `.gitignore` para excluir los archivos que no quieres rastrear (se explicará más adelante).

**Tercer paso: commit, con una descripción**

```bash
git commit -m "feat: añadir funcionalidad de login de usuario"
```

El contenido entre comillas después de `-m` se llama **commit message** (mensaje de commit). Está escrito para tu yo futuro y tus compañeros; debe ser significativo.

### 3.3 Enfoque para escribir un Commit Message profesional

```bash
# ❌ Escritura inútil — no sabes qué se hizo al leerlo
git commit -m "update"
git commit -m "fix"
git commit -m "cambié algunas cosas"

# ✅ Buena escritura: tipo + dos puntos + descripción en una frase
git commit -m "feat: añadir funcionalidad de login de usuario"
git commit -m "fix: corregir pantalla blanca en iOS Safari"
git commit -m "docs: actualizar instrucciones de despliegue en README"
git commit -m "refactor: dividir UserService en módulo independiente"
git commit -m "style: unificar sangría de código a 2 espacios"
```

**Significado de los prefijos comunes:**

| Prefijo | Significado |
| :--- | :--- |
| `feat:` | Nueva funcionalidad (feature) |
| `fix:` | Corrección de bug |
| `docs:` | Cambios en documentación |
| `style:` | Ajustes de formato (no afectan la funcionalidad) |
| `refactor:` | Refactorización de código (funcionalidad igual, estructura mejorada) |
| `chore:` | Relacionado con construcción, herramientas, dependencias |
| `test:` | Relacionado con pruebas |

Adquiere este hábito y, meses después, al revisar el historial, sabrás de un vistazo qué hizo cada commit. Esto es especialmente importante en la colaboración en equipo.

### 3.4 Ver el historial

```bash
# Formato detallado (información completa de cada commit)
git log

# Formato conciso (una línea por commit, recomendado para uso diario)
git log --oneline

# Ejemplo de salida:
# a1b2c3d (HEAD -> main) feat: añadir funcionalidad de login de usuario
# 9f3e1b2 init: inicialización del proyecto
```

---

## 4. Universos paralelos: las ramas (Branch)

Las **ramas** son la funcionalidad más potente y a la vez más confusa de Git para los principiantes. Pero una vez la entiendas, descubrirás que el diseño es muy elegante.

### 4.1 Introducción a rama Entiéndela como "universos paralelos"

Imagina que juegas un RPG con una decisión clave:
- Opción A: desafiarte al gran jefe final (desarrollar nueva funcionalidad)
- Opción B: mantener la estabilidad actual (la línea principal no cambia)

Si haces la opción A directamente en el guardado principal y fallas, todo el progreso se arruina.

Pero si **copias el guardado** y desafías al jefe en la copia:
- ¿Ganaste? Fusiona los resultados de la copia con el guardado principal
- ¿Perdiste? El guardado principal no se ha visto afectado; borra la copia y vuelve a intentarlo

**Las ramas de Git son exactamente este mecanismo de "guardado copia".**

En Git, la rama `main` (o `master`) es tu "guardado principal", que siempre debe mantenerse estable. Cuando vayas a desarrollar una nueva funcionalidad, creas una rama nueva desde main, desarrollas y pruebas allí, y al terminar la fusionas de vuelta con main.

### 4.2 Demostración visual de ramas

👇 **Pruébalo**: Haz clic en los botones de comando en secuencia y observa cómo el diagrama de ramas se bifurca, se extiende y finalmente se fusiona. Presta especial atención a la posición de la etiqueta HEAD — siempre apunta a "dónde estás ahora".

<GitBranchVisual />

### 4.3 Operaciones con ramas en detalle

**Crear y cambiar a una nueva rama:**

```bash
# Método 1: crear primero, luego cambiar (dos pasos)
git branch feature-login      # Crear rama
git checkout feature-login    # Cambiar a ella

# Método 2: en un solo paso (recomendado)
git checkout -b feature-login

# Salida: Switched to a new branch 'feature-login'
```

Después de crear la rama, el prompt de tu línea de comandos mostrará el nombre de la rama actual, por ejemplo:
```
user@mac ~/proyecto (feature-login) $
```

**Ver todas las ramas:**

```bash
git branch

# Salida (* indica la rama actual):
# * feature-login
# main
```

**Desarrollar normalmente en la rama:**

```bash
# En la rama feature-login, cambiar código, add, commit — exactamente igual que siempre
git add login.js
git commit -m "feat: añadir estructura HTML del formulario de login"

git add login.js api.js
git commit -m "feat: completar integración con API de login"
```

Estos commits solo existen en la rama `feature-login`; la rama `main` no sabe nada de lo que has hecho.

**Volver a la rama principal y fusionar:**

```bash
# Volver a main
git checkout main

# Fusionar todos los cambios de feature-login
git merge feature-login

# Tras la fusión, puedes eliminar la rama (opcional)
git branch -d feature-login
```

### 4.4 Criterios para crear una rama

| Escenario | Recomendación | Razón |
| :--- | :--- | :--- |
| Desarrollar una nueva funcionalidad | ✅ Crear rama | No afecta a la línea principal hasta completarla; puedes abandonarla en cualquier momento |
| Corregir un bug urgente en producción | ✅ Crear rama `hotfix-xxx` desde main | Fusionar directamente tras la corrección sin introducir funcionalidades incompletas |
| Desarrollar en paralelo con compañeros | ✅ Cada uno en su rama | Sin interferencias; fusión unificada mediante Pull Request al terminar |
| Solo corregir un error tipográfico | ❌ Directamente en main | Riesgo mínimo, no hace falta crear una rama |

### 4.5 Estrategia de ramas común en equipos

En proyectos reales, los equipos suelen acordar la nomenclatura y el uso de las ramas:

| Nombre de rama | Uso | Características |
| :--- | :--- | :--- |
| `main` / `master` | Código estable de producción | Solo puede entrar código que haya pasado las pruebas; no se puede hacer push directamente |
| `dev` / `develop` | Rama de integración diaria | Todas las ramas de funcionalidad se fusionan aquí primero; tras pasar las pruebas, sube a main |
| `feature/xxx` | Desarrollo de funcionalidades específicas | Ej.: `feature/user-login`; se fusiona con dev al completarse |
| `hotfix/xxx` | Correcciones urgentes | Se crea desde main; tras la corrección se fusiona directamente con main y dev |

---

## 5. Colaboración con el equipo: el repositorio remoto

Hasta ahora, todo lo que has aprendido son operaciones **locales** de Git — todo el historial está en tu ordenador. Para compartir código con tus compañeros, necesitas un **repositorio remoto**, como GitHub o GitLab.

### 5.1 Cómo funciona el repositorio remoto

El repositorio remoto funciona como un **"guardado público" compartido del equipo**:

- Cada persona escribe código y hace commit localmente
- Al terminar, hace `push` (sube) al repositorio remoto
- Los compañeros hacen `pull` (descargan) el contenido más reciente del repositorio remoto a su máquina local
- Así el código de todos se mantiene sincronizado

👇 **Pruébalo**: Haz clic en los comandos en secuencia para experimentar el flujo completo desde la asociación del repositorio remoto, push y pull de las actualizaciones de tus compañeros.

<GitSyncDemo />

### 5.2 Primer push de un proyecto a GitHub

**Paso 1**: Crea un nuevo repositorio en GitHub (haz clic en + en la esquina superior derecha → New repository), sin marcar las opciones de inicialización.

**Paso 2**: Vuelve a la terminal local y asocia el repositorio remoto:

```bash
# Asocia el repositorio local con el de GitHub
# "origin" es el alias del repositorio remoto, un nombre convencional (se puede cambiar, pero no es necesario)
git remote add origin https://github.com/tu-usuario/tu-repo.git

# Confirmar la asociación
git remote -v
# Salida:
# origin https://github.com/tu-usuario/tu-repo.git (fetch)
# origin https://github.com/tu-usuario/tu-repo.git (push)
```

**Paso 3**: Sube el contenido local al remoto:

```bash
# Primer push; -u significa "en adelante, git push enviará por defecto a la rama main de origin"
git push -u origin main

# En adelante, cada push solo necesita:
git push
```

### 5.3 Comandos de colaboración diaria

**Push (has hecho cambios y quieres que tus compañeros los vean):**
```bash
git push
```

**Pull (tus compañeros han hecho cambios y necesitas sincronizar):**
```bash
git pull
```

`git pull` es en realidad la combinación de dos comandos:
1. `git fetch`: descarga primero los últimos commits del repositorio remoto
2. `git merge`: fusiona el contenido descargado con tu rama actual

**Primera vez que obtienes un proyecto de otra persona en GitHub:**
```bash
# Copia todo el repositorio remoto a local (solo necesitas hacerlo una vez)
git clone https://github.com/alguien/algun-proyecto.git

# clone establece automáticamente la asociación remota; después usa push/pull directamente
```

### 5.4 Dirección de push y pull

```
Tu ordenador (repositorio local)  ←→  GitHub (repositorio remoto)

git push:  Local → Remoto   (has hecho cambios, los subes para tus compañeros)
git pull:  Remoto → Local   (tus compañeros han hecho cambios, los descargas)
git clone: Remoto → Local   (primera copia completa del repositorio)
```

> **Mejor práctica**: Haz `git pull` cada día antes de empezar a trabajar, para obtener el código más reciente; y `git push` al final del día o al completar una funcionalidad, para hacer una copia de seguridad y que tus compañeros vean tu progreso.

---

## 6. Avanzado: resolver conflictos

Los conflictos son inevitables en la colaboración, pero tampoco son tan terroríficos.

### 6.1 Enfoque de producen los conflictos

Cuando tú y tu compañero **modificáis la misma línea del mismo archivo**, al fusionar, Git no sabe qué versión usar y se produce un conflicto.

Ejemplo:
- En `login.js`, línea 5, escribiste: `const timeout = 3000`
- Tu compañero, en la misma línea, escribió: `const timeout = 5000`
- Al hacer `git pull` o `git merge`, Git detecta la contradicción y se "pausa" diciéndote: no sé cuál usar; decídete tú.

### 6.2 Qué aspecto tiene un archivo en conflicto

Git inserta marcas especiales en las zonas del conflicto:

```javascript
function login() {
  const url = '/api/login'

 <<<<<<< HEAD
  const timeout = 3000   // Tu versión
 =======
  const timeout = 5000   // Versión de tu compañero
 >>>>>>> feature/update-timeout

  return fetch(url, { timeout })
}
```

- Entre `<<<<<<< HEAD` y `=======`: contenido de tu rama actual
- Entre `=======` y `>>>>>>> xxx`: contenido que se está fusionando

### 6.3 Enfoque para resolver un conflicto

**Primer paso**: Abre el archivo en conflicto y busca todas las marcas `<<<<<<<` (normalmente VS Code y otros editores las resaltan automáticamente)

**Segundo paso**: Decide qué fragmento de código mantener, edita el archivo manualmente y elimina todas las marcas (`<<<<<<<`, `=======`, `>>>>>>>`).

Por ejemplo, si decides usar 5000 (versión del compañero):
```javascript
function login() {
  const url = '/api/login'
  const timeout = 5000   // Adoptar la modificación del compañero
  return fetch(url, { timeout })
}
```

**Tercer paso**: Vuelve a hacer commit

```bash
# Marcar el conflicto como resuelto
git add login.js

# Completar el commit de fusión (Git generará automáticamente el mensaje)
git commit
```

### 6.4 Buenas prácticas para reducir conflictos

- **Haz pull con frecuencia**: Sincroniza el código más reciente antes de empezar a trabajar, reduciendo la situación de "ir muy por detrás"
- **Commits pequeños y frecuentes**: No escribas código durante una semana y hagas un commit masivo; los commits frecuentes facilitan detectar y resolver conflictos
- **Aislamiento por ramas**: Diferentes funcionalidades en diferentes ramas, reduciendo la competencia sobre la misma línea de código
- **Comunicación**: Antes de modificar archivos compartidos (como `config.js`), avisa a tus compañeros

---

## 7. Referencia rápida de comandos

<GitCommandCheatsheet />

---

## 8. Práctica: flujo completo para unirse a un proyecto de equipo

Este es el flujo de operación estándar cuando te unes a un equipo o proyecto nuevo; puedes copiarlo directamente:

```bash
# ① Primer día: clonar el proyecto en local (solo una vez)
git clone https://github.com/team/project.git
cd project

# ② Cada día al empezar: primero pull del código más reciente
git pull origin main

# ③ Crear tu rama de funcionalidad (no modifiques directamente main)
git checkout -b feature/user-profile

# ④ Desarrollo normal... escribes código...

# ⑤ Tras completar una pequeña funcionalidad, haz commit inmediatamente (no lo acumules)
git add src/UserProfile.vue
git commit -m "feat: completar funcionalidad de subida de avatar"

git add src/UserProfile.vue src/api/user.js
git commit -m "feat: completar API de edición de perfil de usuario"

# ⑥ Subir tu rama al remoto para que tus compañeros la vean
git push origin feature/user-profile

# ⑦ Crear un Pull Request (PR) en GitHub, solicitando la fusión con main
# (Este paso se hace en la web de GitHub)

# ⑧ Esperar el Code Review de tus compañeros, modificar según el feedback, y seguir con commit + push

# ⑨ Tras fusionar el PR, volver a main, actualizar local, eliminar la rama de funcionalidad
git checkout main
git pull
git branch -d feature/user-profile
```

---

## 9. .gitignore: qué archivos no deberían ser rastreados

Hay archivos que **no quieres** confirmar en el repositorio Git, como:
- `node_modules/`: dependencias, muy grandes, se pueden regenerar con `npm install`
- `.env`: archivo de variables de entorno que puede contener contraseñas de bases de datos y claves API; **nunca debe subirse a un repositorio público**
- `*.log`: archivos de registro
- `.DS_Store`: archivo oculto generado automáticamente por macOS
- `dist/`, `build/`: artefactos de compilación, se pueden reconstruir

Crea un archivo `.gitignore` en la raíz del proyecto con las reglas de los archivos que no quieres rastrear:

```gitignore
# Dependencias
node_modules/

# Variables de entorno (¡importante! las contraseñas no deben subirse)
.env
.env.local

# Artefactos de compilación
dist/
build/

# Archivos de sistema
.DS_Store
Thumbs.db

# Registros
*.log
```

GitHub tiene plantillas de .gitignore para varios lenguajes y frameworks: [github.com/github/gitignore](https://github.com/github/gitignore)

---

## Tabla de referencia rápida de términos

| Término | Inglés | Explicación |
| :--- | :--- | :--- |
| **Repositorio** | Repository (Repo) | Base de datos que almacena todo el historial de versiones del proyecto, en la carpeta `.git` |
| **Commit** | Commit | Un registro completo de versión, como un punto de guardado en un juego, con descripción y marca de tiempo |
| **Rama** | Branch | Línea de desarrollo independiente, como una línea temporal paralela, sin afectarse mutuamente |
| **Fusionar** | Merge | Integrar los cambios de una rama en otra |
| **Conflicto** | Conflict | La misma línea de código modificada por varias personas; Git no sabe cuál usar y requiere resolución manual |
| **Preparar** | Stage / Index | La operación de poner modificaciones en la lista de "listas para commit" |
| **Remoto** | Remote | Copia del repositorio en la nube (GitHub / GitLab / Gitee) |
| **Clonar** | Clone | Copiar todo un repositorio remoto completo al local |
| **Push** | Push | Subir los commits locales al repositorio remoto |
| **Pull** | Pull | Descargar y fusionar el contenido más reciente del remoto al local |
| **HEAD** | HEAD | Puntero a la rama/commit actual, indicando "dónde estás ahora" |
| **origin** | origin | Alias predeterminado del repositorio remoto (nombre convencional) |
| **stash** | Stash | Guardar temporalmente cambios sin commit; útil para cambiar de tarea |
| **PR / MR** | Pull Request / Merge Request | Solicitud para fusionar tu rama con la rama principal; suele requerir revisión de compañeros |
