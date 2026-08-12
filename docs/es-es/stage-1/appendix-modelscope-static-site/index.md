---
title: Publica tu proyecto de Vibe Coding en ModelScope
description: Guía completa para publicar HTML o el resultado de Vue, React y Vite con el Skill oficial y un Static Studio.
---

# Publica tu proyecto de Vibe Coding en ModelScope

Cuando la página funciona en tu ordenador, hace falta una dirección que puedan abrir amigos, compañeros o usuarios reales.

Puedes alquilar un servidor y configurar dominio, HTTPS y despliegue. En esta lección reduciremos ese trabajo y publicaremos la página en **ModelScope Studio**.

ModelScope nació de la colaboración entre Alibaba y el Comité de Desarrollo de Código Abierto de CCF. Además de más de 200 000 modelos de código abierto y 30 000 conjuntos de datos, ofrece **Studios** para mostrar aplicaciones. Un Studio permite conseguir gratis una dirección compartible sin aprender antes a administrar servidores.

> La guía se comprobó con la interfaz actual, los Skills oficiales y la documentación de comandos el **11 de agosto de 2026**. Los botones pueden moverse, pero el recorrido continúa siendo: crear un Static Studio, subir el resultado compilado, desplegar y probar el enlace.

Además de Gradio, Streamlit y Docker, Studio admite el tipo `static` para sitios ya compilados. Si el resultado final contiene `index.html`, CSS, JavaScript e imágenes, este es el tipo adecuado.

La dirección publicada se parece a:

```text
https://modelscope.cn/studios/tu-usuario/tu-studio
```

## Elige el método adecuado

| Proyecto | Tipo de Studio | Preparación |
| --- | --- | --- |
| HTML, CSS y JavaScript | **Static** | Preparar los archivos; no necesita compilación |
| Vue, React, Vite o Svelte | **Static** | Compilar en local y publicar solo el contenido de `dist` o `build` |
| Gradio | Gradio | Preparar `app.py` y `requirements.txt` |
| Streamlit | Streamlit | Preparar la entrada y las dependencias |
| Backend o paquetes especiales | Docker | Crear un Dockerfile y escuchar en el puerto indicado |

Aquí trabajaremos con las dos primeras opciones. **No subas el código fuente de Vue o React como sitio Static.** El navegador de un visitante no ejecutará `npm install` ni `npm run build`.

## Método recomendado: el Skill oficial

ModelScope mantiene [Skills oficiales](https://github.com/modelscope/modelscope-skills).

| Skill | Función | Cuándo usarlo |
| --- | --- | --- |
| `ms-hub` | Entrada común para repositorios, modelos, datos, Studios, MCP y Skills Center | Primera conexión y operaciones generales |
| `ms-studio-deploy` | Detecta el proyecto, crea el Studio, sincroniza Git, despliega, revisa registros y diagnostica fallos | **Opción preferida para publicar y actualizar una web local** |

`ms-studio-deploy` reconoce como `static` una carpeta con `index.html` en la raíz. Static Studio no ejecuta `npm run build`, así que debes compilar los frameworks en tu equipo.

### Instala los Skills

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

Si el comando no incluye `skills`, usa el instalador oficial:

```bash
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-hub
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-studio-deploy
```

Se instalan normalmente en `~/.agents/skills/`. Después abre una sesión nueva de Codex, Cursor, Claude Code u otra herramienta compatible para actualizar la lista.

### Publica con el Skill

Según la [guía de `ms-studio-deploy`](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md), prepara:

1. El Skill instalado y una sesión nueva del agente.
2. La carpeta que se publicará, con `index.html` directamente en la raíz.
3. Un Access Token de ModelScope configurado en el equipo.

Obtén el token en [Access Tokens](https://modelscope.cn/my/myaccesstoken) y configúralo en la terminal:

```bash
export MODELSCOPE_API_KEY="tu-token"
```

Para HTML abre directamente su carpeta. Para Vue, React o Vite, compila y entra en el resultado:

```bash
npm run build
cd dist
```

Vite suele crear `dist`; si tu herramienta crea `build`, abre esa carpeta. Después ábrela en la herramienta compatible con Agent Skills.

#### La petición más corta

```text
Usa el Skill ms-studio-deploy para publicar este sitio en un Static Studio de ModelScope. Envíame la dirección cuando funcione.
```

El Skill revisa `index.html` y la sesión. Si necesita crear un Studio, preguntará el nombre y la visibilidad. Empieza en privado.

También puedes dar todos los datos:

```text
Usa el Skill ms-studio-deploy para publicar esta carpeta en un Static Studio del sitio chino de ModelScope.
Llama al Studio my-portfolio y déjalo privado al principio. Después revisa el estado y los registros.
Si falla, corrige la causa indicada por los registros, despliega de nuevo y devuelve la dirección que funcione.
```

#### Lo que hará la IA

```text
detectar proyecto → elegir sitio chino o internacional → obtener cuenta
→ crear o reutilizar Studio → revisar archivos sensibles → sincronizar con master
→ iniciar despliegue → revisar estado y registros → diagnosticar y corregir → devolver dirección
```

Comprueba primero en privado y cambia a público cuando todo funcione. Un sitio Static no necesita hardware de pago. Para otros recursos de pago, el Skill debe pedir permiso explícito.

El token sirve para la API y Git push. No lo pongas en el frontend, README, petición ni captura compartida.

## Ruta manual: Paso 0 — prepara el sitio

El Skill es más cómodo, pero la ruta manual ayuda a entender Studio y funciona cuando la herramienta de agente no está disponible.

### Caso A: HTML sencillo

`index.html` debe estar en la raíz de lo que vas a publicar:

```text
my-site/
├── index.html
├── styles.css
├── app.js
└── images/
    └── cover.jpg
```

Pruébalo mediante HTTP antes de publicar:

```bash
cd my-site
python3 -m http.server 8000
```

Abre `http://localhost:8000`. Hacer doble clic en `index.html` no basta: `file://` y HTTP tratan de forma distinta módulos, CORS y rutas.

### Caso B: Vue, React, Vite y similares

```bash
npm install
npm run build
```

| Herramienta | Salida habitual |
| --- | --- |
| Vite / Vue + Vite / React + Vite | `dist/` |
| Create React App | `build/` |
| Vue CLI | `dist/` |

Publica el **contenido** de la salida para que `index.html` quede en la raíz del Studio.

```text
Correcto: index.html
Incorrecto: dist/index.html
```

Si CSS, JavaScript o imágenes devuelven 404, prueba una base relativa en Vite:

```js
// vite.config.js / vite.config.ts
export default {
  base: './'
}
```

Vuelve a compilar. Un host estático puede no redirigir todas las rutas a `index.html`; para una SPA puedes usar rutas con hash como `/#/about`.

## Ruta manual: Paso 1 — entra en Studio

Abre [ModelScope Studio](https://modelscope.cn/studios). La parte superior muestra el recorrido de crear, construir, publicar y compartir.

![Inicio de ModelScope Studio con el proceso de creación y publicación](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

Pulsa crear o abre [Crear Studio](https://modelscope.cn/studios/create). El sitio chino `modelscope.cn` y el internacional `modelscope.ai` no comparten cuenta, token ni contenido.

## Ruta manual: Paso 2 — completa la información básica

![Formulario con propietario, nombre, licencia, visibilidad y descripción](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

1. **Propietario u organización:** define la parte del propietario en la dirección.
2. **Nombre:** usa minúsculas, números y guiones, por ejemplo `my-portfolio`.
3. **Nombre visible y descripción:** escribe para el visitante.
4. **Visibilidad:** comienza privado y hazlo público después de revisar.
5. **Licencia:** elige según el proyecto.

Confirma y espera a que se abra el Studio.

## Ruta manual: Paso 3 — sube los archivos

En un Static Studio activo, `index.html` y `README.md` aparecen directamente en la raíz.

![Archivos de Static Studio con index.html en la raíz](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

Sube `index.html`, CSS, JavaScript e imágenes desde **Files**. No los envuelvas en otra carpeta `dist`, `build` o de proyecto.

La subida manual sirve para pocos archivos. Con muchos archivos o cambios frecuentes, usa `ms-studio-deploy` para sincronizar Git.

## Ruta manual: Paso 4 — selecciona Static en la configuración de despliegue

Después de subir los archivos, abre la configuración de despliegue del Studio y selecciona **Static** como tipo de SDK. Static está pensado para sitios HTML ya preparados; en la misma zona también aparecen Gradio, Streamlit y Docker.

![Selección de Static en la configuración de despliegue](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

Comprueba de nuevo que `index.html` esté en la raíz del repositorio y guarda la configuración de despliegue.

> Si la web necesita base de datos, una clave secreta o cálculo de servidor, no es puramente estática. Usa Gradio, Streamlit, Docker o un backend aparte. Una clave escrita en JavaScript del frontend no puede mantenerse secreta.

## Ruta manual: Paso 5 — espera el despliegue y revisa

Guardar la configuración suele iniciar el despliegue. Si no ocurre, usa desplegar, reiniciar o volver a ejecutar. Cuando esté activo, abre:

```text
https://modelscope.cn/studios/tu-usuario/tu-studio
```

- ¿Abre la portada?
- ¿Cargan CSS, JavaScript e imágenes?
- ¿Hay errores 404, CORS o JavaScript en la consola?
- ¿Funciona con ancho móvil?
- ¿Un Studio público abre en una ventana sin sesión?

Revisa primero el Studio privado, después hazlo público y repite la prueba sin sesión.

## Ruta manual: Paso 6 — actualiza el sitio

Tras modificar el código, prueba en local y compila de nuevo. Sustituye en **Files** los archivos anteriores por el nuevo contenido de `dist` o `build` y vuelve a desplegar.

```text
cambiar código → probar en local → compilar → sustituir archivos del Studio
→ desplegar de nuevo → revisar la dirección final
```

No subas `node_modules`, configuración de desarrollo ni el proyecto fuente completo. Si hay muchas actualizaciones, vuelve al Skill.

## Usa el Skill también para resolver fallos

<ModelScopeTroubleshooter />

## Fuentes

- [ModelScope Studio](https://modelscope.cn/studios) (interfaz e imágenes comprobadas el 11-08-2026)
- [Encuentro de desarrolladores ModelScope](https://community.modelscope.cn/683562c6870cef7360622f7f.html)
- [Instrucciones oficiales de `ms-hub`](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-hub/SKILL.md)
- [Skill oficial `ms-studio-deploy`](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)
- [Cliente ModelScope Hub](https://github.com/modelscope/modelscope_hub)
- [Ejemplo público de Static Studio](https://modelscope.cn/studios/studio-demo-station/funasr-demo-static-multiple/summary)
