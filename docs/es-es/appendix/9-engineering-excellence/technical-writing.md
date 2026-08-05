# Introducción a la escritura de documentación técnica

::: tip Prefacio
**¿Alguien lee la documentación que escribes?** Muchos desarrolladores piensan que "si el código funciona, la documentación ya vendrá después". El resultado: los recién llegados no entienden el proyecto, la integración de APIs depende completamente de la comunicación verbal, y medio año después ni tú recuerdas por qué lo diseñaste así.

Este capítulo te ayudará a dominar los métodos clave de la escritura de documentación técnica, para que tu documentación sea realmente leída, comprendida y útil.
:::

**¿Qué aprenderás en este artículo?**

| Capítulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capítulo 1** | Tipos y estructura de documentación | Cómo escribir diferentes tipos de documentos |
| **Capítulo 2** | Principios de escritura | Claro, preciso, conciso |
| **Capítulo 3** | Comparación práctica | Buena documentación vs. mala documentación |
| **Capítulo 4** | Mantenimiento de documentación | Mantener la documentación actualizada |

Al finalizar este capítulo, serás capaz de escribir documentación técnica con estructura clara, contenido preciso y fácil de mantener.

---

## 0. Panorama general: Motivación de importante la documentación técnica

El código le dice a la computadora "cómo hacerlo", la documentación le dice a las personas "por qué se hizo así". Un proyecto sin documentación es como un electrodoméstico sin manual de instrucciones — funciona, pero usarlo es pura suposición.

::: tip El valor de una buena documentación
- **Reduce costes de comunicación**: Los recién llegados pueden aprender por sí solos, reduciendo respuestas repetitivas
- **Preserva el contexto de las decisiones**: Registra el "por qué", no solo el "qué"
- **Mejora la credibilidad del proyecto**: Una buena documentación es la carta de presentación de un proyecto open source
- **Acelera la colaboración**: La documentación de APIs permite el desarrollo paralelo de frontend y backend
:::

---

## 1. Tipos y estructura de documentación

A través del siguiente componente interactivo, conoce la estructura estándar de diferentes tipos de documentación:

<DocStructureDemo />

### 1.1 Tipos de documentación comunes

| Tipo de documento | Público objetivo | Contenido central |
|---------|---------|---------|
| **README** | Todos | Qué es el proyecto, cómo usarlo, cómo contribuir |
| **Documentación de API** | Consumidores de la API | Endpoints, parámetros, respuestas, códigos de error |
| **Documentación de arquitectura** | Equipo de desarrollo | Diseño del sistema, selección tecnológica, flujo de datos |
| **Registro de cambios** | Usuarios/desarrolladores | Cambios por versión, novedades/correcciones/cambios disruptivos |
| **Guía de contribución** | Contribuidores | Entorno de desarrollo, convenciones de código, proceso de PR |

### 1.2 La estructura ideal de un README

Un buen README debería incluir:

1. **Nombre del proyecto + descripción en una frase**: Que en 3 segundos se sepa qué es
2. **Inicio rápido**: Los mínimos pasos para ejecutarlo
3. **Características**: Los puntos clave
4. **Instalación**: Requisitos detallados del entorno y pasos de instalación
5. **Ejemplos de uso**: Código que se pueda copiar y pegar
6. **Guía de contribución**: Cómo participar
7. **Licencia**: Información legal

---

## 2. Principios de escritura

### 2.1 Claridad ante todo

```markdown
<!-- Mal: vago e impreciso -->
Esta función procesa los datos.

<!-- Bien: específico y claro -->
Transforma los datos de pedidos brutos al formato de factura, incluyendo el cálculo de impuestos y la conversión de moneda.
```

### 2.2 Orientado al lector

Antes de escribir documentación, pregúntate: **¿Quién leerá este documento? ¿Qué información necesitan?**

- Para principiantes: Explica la terminología, proporciona ejemplos completos
- Para desarrolladores experimentados: Ve al grano, proporciona referencias de API
- Para no técnicos: Usa analogías, evita la jerga

### 2.3 Los ejemplos de código son la mejor documentación

```markdown
<!-- Mal: solo descripción textual -->
Llama a la función createUser, pasando el nombre de usuario y el email como parámetros.

<!-- Bien: proporciona un ejemplo ejecutable -->
const user = await createUser({
  name: 'Zhang San',
  email: 'zhangsan@example.com'
})
// Retorna: { id: 'u_123', name: 'Zhang San', createdAt: '2025-01-15' }
```

---

## 3. Comparación práctica

A través del siguiente componente interactivo, compara la buena y mala escritura técnica:

<TechWritingPracticeDemo />

### 3.1 Convención de Commit Messages

```
# Mal
fix bug
update code

# Bien (Conventional Commits)
fix: corrige la pantalla blanca de la página de login en Safari
feat: soporta la exportación masiva de informes en formato PDF
docs: actualiza el código de ejemplo en la sección de autenticación de la API
```

### 3.2 El arte de los comentarios

```javascript
// Mal: describe "qué hace" (el código ya lo dice)
// Recorrer el array
for (const item of items) { ... }

// Bien: explica "por qué"
// Recorrer en orden inverso, porque al eliminar elementos en orden normal se saltaría el siguiente
for (let i = items.length - 1; i >= 0; i--) { ... }
```

---

## 4. Mantenimiento de documentación

### 4.1 Documentación como código

Gestiona la documentación y el código en el mismo repositorio, con el mismo flujo de trabajo:

- Los cambios de documentación se envían junto con el código en un PR
- CI verifica el formato de la documentación y la validez de los enlaces
- La documentación se actualiza sincrónicamente con cada release

### 4.2 Evitar la podredumbre de la documentación

| Problema | Solución |
|------|---------|
| Documentación desactualizada | Forzar la actualización de la documentación con los cambios de código (verificación en PR) |
| Sin mantenimiento | Asignar responsables de documentación |
| Contenido duplicado | Fuente única de información, enlazar desde otros lugares |

---

## 5. Impulso de IA: Mejorar la calidad de la documentación con modelos de lenguaje

Los modelos de lenguaje son casi "dotados por naturaleza" en el campo de la escritura técnica — generar documentación, mejorar la expresión y traducir contenido son sus puntos fuertes.

### 5.1 Generar documentación de API

> **Prompt**:
> ```
> A partir del siguiente código de rutas Express, genera documentación completa de la API, incluyendo:
> - Ruta del endpoint y método HTTP
> - Parámetros de la solicitud (parámetros de ruta, query params, cuerpo) y sus tipos
> - Ejemplos de respuestas exitosas y de error
> - Ejemplo de llamada con curl
>
> [Pega el código de tus rutas]
> ```

### 5.2 Mejorar la escritura técnica

> **Prompt**:
> ```
> Mejora la expresión del siguiente documento técnico con estos requisitos:
> 1. Lenguaje conciso y claro, eliminando expresiones redundantes
> 2. Usar voz activa en lugar de pasiva
> 3. Mantener la precisión de la terminología técnica
> 4. Añadir ejemplos de código cuando sea necesario
> Mantener el significado original, solo mejorar la calidad de la expresión.
>
> [Pega el contenido de tu documentación]
> ```

### 5.3 Generar un README

> **Prompt**:
> ```
> A partir de la siguiente información del proyecto, genera un README.md de alta calidad:
> - Nombre del proyecto: [nombre]
> - Descripción en una frase: [descripción]
> - Stack tecnológico: [listar]
> - Funcionalidades principales: [listar]
>
> Debe incluir: Introducción, inicio rápido, características,
> pasos de instalación (con código), ejemplos de uso, guía de contribución, licencia.
> ```

::: tip Consejos de uso de IA
Verifica que los detalles técnicos de la documentación generada por IA sean correctos — puede inventar parámetros de API inexistentes o valores de retorno incorrectos. Siempre verifica contra el código real.
:::

---

## 6. Resumen

1. **Tipo adecuado**: Diferentes tipos de documentación tienen diferentes estructuras y enfoques
2. **Claridad ante todo**: Específico, preciso, orientado al lector
3. **Ejemplos como motor**: Un buen ejemplo de código vale más que mil palabras
4. **Mantenimiento continuo**: Documentación como código, evolucionando junto con el proyecto

::: tip Reflexión final
Escribir documentación no es perder el tiempo, sino **ahorrar tiempo en el futuro**. Los 30 minutos que inviertes hoy pueden ahorrarle 1 hora a 10 personas. La buena documentación es la mejor inversión para el equipo.
:::

---

## Lecturas adicionales

- **Guía de escritura**: El curso gratuito de Technical Writing de Google es práctico y útil.
- **Herramientas de documentación**: VitePress, Docusaurus, GitBook y otros frameworks modernos de documentación.
- **Documentación de APIs**: La especificación OpenAPI/Swagger es el estándar de la industria para documentación de APIs.
- **Consejo práctico**: Empieza escribiendo un buen README para tu propio proyecto.
