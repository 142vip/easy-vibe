---
title: Publica tu sitio web en ModelScope
description: Publica sitios estáticos HTML, Vue, React o Vite con ModelScope Studio y su Skill oficial.
---

# Publica tu sitio web en ModelScope

Cuando la página funciona en tu ordenador, necesitas un enlace que puedan abrir otras personas. En este apéndice la publicaremos con **ModelScope Studio**, sin configurar un servidor desde cero.

## 1. Decide qué vas a publicar

| Proyecto | Tipo de Studio | Qué preparar |
| --- | --- | --- |
| HTML, CSS y JavaScript | Static | Archivos web con `index.html` en la raíz |
| Vue, React, Vite o Svelte | Static | El contenido de `dist` o `build` después de compilar |
| Gradio o Streamlit | Tipo correspondiente | Entrada Python y dependencias |
| Backend o dependencias especiales | Docker | Dockerfile y servicio ejecutable |

En un proyecto con framework se publica el **resultado de la compilación**, no la carpeta de código fuente.

## 2. Usa el Skill oficial de despliegue

Los [Skills oficiales de ModelScope](https://github.com/modelscope/modelscope-skills) incluyen `ms-studio-deploy`, que identifica el proyecto, crea el Studio, sincroniza los archivos, despliega y revisa los registros.

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

Obtén un token en [Access Tokens](https://modelscope.cn/my/myaccesstoken) y guárdalo solo en tu equipo. No lo escribas en la web, el README ni una captura.

Para Vite, compila primero:

```bash
npm run build
cd dist
```

Abre la carpeta de salida en tu herramienta de IA y pide:

```text
Usa el Skill ms-studio-deploy para publicar esta carpeta en un Static Studio de ModelScope. Cuando funcione, envíame el enlace.
```

## 3. Publica manualmente desde la web

Abre [ModelScope Studio](https://modelscope.cn/studios) e inicia sesión.

![Página principal de ModelScope Studio](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

En [Crear Studio](https://modelscope.cn/studios/create), completa propietario, nombre, descripción y visibilidad.

![Formulario para crear un Studio](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

Elige **Static** como tipo de SDK.

![Selección del tipo Static](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

Después abre la página de archivos y sube `index.html`, CSS, JavaScript e imágenes. `index.html` debe estar directamente en la raíz, no dentro de otra carpeta `dist`.

![Archivos de un Static Studio](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

Guarda y espera el despliegue. En el enlace final revisa la portada, estilos, imágenes, ancho móvil y consola del navegador. Si es público, pruébalo también sin iniciar sesión.

## 4. Actualiza y resuelve problemas

Tras modificar el proyecto, prueba en local, compila de nuevo, sustituye los archivos publicados y vuelve a desplegar.

- faltan estilos o imágenes: revisa las rutas y `base` de Vite;
- una ruta devuelve 404 al actualizar: considera un router con hash;
- solo aparece una lista de archivos: comprueba `index.html` en la raíz;
- necesitas una clave secreta: no la pongas en el frontend; usa un backend.

Fuentes oficiales: [ModelScope Studio](https://modelscope.cn/studios), [ModelScope Skills](https://github.com/modelscope/modelscope-skills) y [`ms-studio-deploy`](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md).
