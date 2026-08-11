---
title: 'Cómo estudiar este curso'
description: 'Aprende desde cero a encontrar problemas, validar necesidades, construir productos con IA y entregarlos a usuarios reales como ingeniero de producto responsable de los resultados.'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const relatedArticles = relatedArticlesMap['es-es/stage-1/learning-map'] ?? []
</script>

# Cómo estudiar este curso

::: info Agradecimiento especial
Las personas que más han contribuido y probado este curso proceden de la **Tsinghua University Shenzhen International Graduate School**. Gracias a los estudiantes que, al estudiar y practicar, han señalado problemas, propuesto cambios y participado en las revisiones. Su trabajo ha hecho que el curso sea más claro, fiable y cercano a las necesidades reales de quienes empiezan. [**👉 Ver la lista completa de colaboradores**](https://github.com/datawhalechina/easy-vibe#-contributing--contributors)
:::

Antes era muy difícil crear software. Había que aprender lenguajes de programación, herramientas de desarrollo y muchos conocimientos técnicos antes de convertir una idea en un programa. Los grandes modelos de lenguaje y las herramientas de programación con IA han cambiado esta situación: ahora podemos explicar una intención con lenguaje natural y pedir a la IA que genere código, construya interfaces y modifique funciones.

## De Vibe Coding a construir un producto

**La expresión [Vibe Coding](https://www.merriam-webster.com/dictionary/vibe%20coding) apareció el 2 de febrero de 2025.** El investigador Andrej Karpathy la utilizó para describir una forma nueva de programar: una persona explica con lenguaje natural qué quiere, observa el resultado y continúa conversando y corrigiendo sin escribir, comprender y gestionar desde el principio cada línea de código.

> **¿Qué es Vibe Coding?**
> Dicho de forma sencilla, es «programar hablando»: describes una idea, dejas que la IA genere el programa, lo ejecutas y sigues ajustándolo mediante una conversación.

Su primera gran aportación fue permitir que más personas superaran la barrera de «no sé programar, por eso no puedo empezar». Alguien sin experiencia puede crear en pocos minutos un juego pequeño, una página o un prototipo demostrable.

<figure class="concept-illustration">
  <img src="../../../zh-cn/stage-1/learning-map/images/vibe-coding-to-product.png" alt="Una persona convierte con IA una idea expresada en lenguaje natural en un prototipo, lo entrega a usuarios reales y sigue mejorándolo con sus comentarios" loading="lazy">
  <figcaption>Vibe Coding ayuda a superar la barrera de «hacerlo»; construir un producto exige continuar hacia usuarios reales, comentarios y valor.</figcaption>
</figure>

Es un cambio enorme: **la comunicación entre personas y ordenadores se está ampliando desde la sintaxis estricta hacia el lenguaje natural.**

Pero cuanto más fácil resulta crear una demostración que funciona, más importantes son otras preguntas:

- ¿Qué deberíamos construir, y no solo qué podemos construir?
- ¿A quién resuelve un problema? ¿Esa persona lo necesita de verdad?
- ¿Cómo se convierte la primera versión generada por IA en un producto estable, claro y fácil de mantener?
- ¿Cómo se entrega a los usuarios en lugar de ejecutarlo solo en nuestro ordenador?
- ¿Cómo demuestran el uso, los comentarios y el pago que realmente crea valor?

Vibe Coding no elimina el aprendizaje: **cambia lo que hay que aprender y eleva la exigencia**.

Si solo miramos el código, el objetivo es que se ejecute. Construir un producto significa responder de todo el recorrido desde el problema hasta el resultado:

> **Coding: ¿puedo construirlo?**<br>
> **Build Product: ¿merece la pena, quién lo usará, cómo lo entregaré y cómo sabré que funciona?**

Vibe Coding es el punto de partida del curso, no el final. Primero crearemos algo con rapidez; después aprenderemos a elegir problemas, validar necesidades, diseñar soluciones, construir, conocer usuarios e iterar según los resultados.

::: tip ¿Qué quiere desarrollar realmente el curso?
No se limita a enseñar herramientas de programación con IA. Quiere ayudarte a convertirte en un **ingeniero de producto (Product Engineer)** inicial: alguien que encuentra problemas, valida necesidades, construye un producto, lo entrega a usuarios reales y sigue mejorándolo a partir de los resultados.
:::

## ¿Por qué necesitamos ahora ingenieros de producto?

La ingeniería de producto no apareció de repente en 2026.

Ya en 2018, Intercom utilizó Product Engineer para describir a un ingeniero con responsabilidad sobre el producto: no solo implementa una función diseñada por otros, sino que entiende a los clientes, participa en decisiones y mejora continuamente lo que entrega.

La IA ha reducido mucho el coste de «hacerlo» y permite asumir tareas que antes se repartían entre varios perfiles. Con grandes modelos y agentes de programación, una persona puede abarcar prototipos, interfaces, frontend y backend, integración de IA, pruebas y despliegue. El trabajo se extiende más allá de «terminar el código»: comprender directamente a los usuarios, validar soluciones, promover la adopción y responsabilizarse de resultados de negocio.

### De participar en el producto a responder del resultado

Estos hitos reales muestran el cambio:

| Fecha | Empresa y puesto | Qué indica el puesto |
| --- | --- | --- |
| Mayo de 2018 | [Intercom: Product Engineer](https://www.intercom.com/blog/making-the-transition-from-consultant-to-product-engineer/) | Los ingenieros también piensan en producto, entienden al cliente y ayudan a decidir su evolución |
| Febrero de 2026 | [Hamilton AI: Product Engineer](https://jobs.ashbyhq.com/hamilton-ai/78c69fe9-828d-44b3-abe6-af56a2badf76/) | Hablar directamente con clientes, convertir una conversación en un producto y validarlo con usuarios reales |
| Junio de 2026 | [Alma: Product Engineer - AI](https://jobs.ashbyhq.com/tryalma/8021fb35-fc1e-4950-a078-afc0e89d9856) | La misma persona diseña agentes, escribe el backend, termina la interfaz y observa a abogados y clientes |
| Julio de 2026 | [Harper: Product Engineer](https://jobs.ashbyhq.com/harperinsure/7d678dba-885a-4432-94c7-a9c20852db35) | Entrar en ventas, soporte y seguros y responder de indicadores como la conversión, no solo del lanzamiento |
| Agosto de 2026 | [Paradigm: Product Engineer, Applied AI](https://jobs.ashbyhq.com/Paradigm/b85b9094-2467-4f49-9a36-ca93da34a3f5) | Encontrar problemas en inversión, investigación y operaciones y crear productos internos y abiertos |
| A agosto de 2026 | [OpenAI: Forward Deployed Engineer](https://openai.com/careers/forward-deployed-engineer-%28fde%29-seattle-seattle/) | Responsabilizarse de descubrir el problema, planificar, construir y desplegar; medir por adopción e impacto |

<details>
<summary><strong>Más puestos reales en distintas industrias</strong></summary>

Estos ejemplos proceden de aviación, derecho, seguros, cumplimiento financiero, biomedicina, industria, servicios empresariales e infraestructura de IA.

| Publicación | Empresa y puesto | Recorrido que debe completar |
| --- | --- | --- |
| Febrero de 2026 | [Sphinx: Product Engineer](https://jobs.ashbyhq.com/Sphinx/08bdb9eb-4b6c-44ab-9615-3bb6b908d008) | Elegir oportunidades en conversaciones con clientes, crear prototipos, probarlos e influir en la hoja de ruta |
| Marzo de 2026 | [Hyperscale: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/hyperscale/950c982f-5fb9-481b-a6ad-808feba76757) | Participar en investigación, PoC, implantación y venta empresarial |
| Abril de 2026 | [Sphere: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/sphere/7b5f39b0-6f3f-4bc4-9469-74ae9722d85a) | Ir desde el descubrimiento hasta el despliegue y convertir necesidades en capacidades generales |
| Mayo de 2026 | [Avent: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/avent-industrial-inc/bf8337c2-00cf-4ca7-aa43-b4c29e4b8083) | Comprender el negocio, escribir código, integrar sistemas y responder del lanzamiento del cliente |
| Mayo de 2026 | [Tamarind Bio: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/tamarindbio/be678c9b-984e-4a0a-aedc-a87187e18748/) | Cubrir la primera conversación, piloto, producción, ampliación, demostración y ciclo de ventas |
| Junio de 2026 | [Protege: Forward Deployed Engineer, New Verticals](https://jobs.ashbyhq.com/protege/b62ebf3e-e07f-4f67-bc9c-4787f23fe449/) | Crear líneas de negocio desde necesidades tempranas y convertir lo aprendido en plataforma |
| Junio de 2026 | [Dataleap: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/dataleap/6afe756f-fea9-42fc-82ed-621c72a99387/) | Encontrar flujos importantes, construir agentes, integrar y enseñar a los clientes |
| Junio de 2026 | [Collinear AI: Product Engineer](https://jobs.ashbyhq.com/collinear-ai/4d4af6b1-bfc7-4a28-9d86-5bab73e6e396) | Trabajar entre backend, frontend, API, experiencia, pruebas y calidad en producción |
| Julio de 2026 | [Restate: Forward Deployed Engineer](https://jobs.ashbyhq.com/restate/c9419551-7f51-4691-8ba9-d80a27f1e284) | Responsabilizarse del PoC, la preparación y el despliegue y convertir entregas únicas en métodos repetibles |
| A agosto de 2026 | [Scale AI: Forward Deployed Engineer, GenAI](https://scale.com/careers/4593571005) | Trabajar con clientes técnicos, realizar desarrollo integral y experimentos rápidos e influir en el producto |

</details>

::: details Fechas de la investigación
Esta página se recopiló el **9 de agosto de 2026**. Las fechas de los puestos de Ashby proceden del campo `publishedAt` de sus datos públicos; cuando una página no muestra fecha, se usa el momento de comprobación. Las ofertas pueden desaparecer al cerrarse.

Son observaciones de varios puestos reales, no una estadística de todo el mercado laboral. Sirven para mostrar una tendencia en empresas nativas de IA y equipos pequeños, no para afirmar que todas las empresas eliminarán las especialidades de producto, diseño, ingeniería y ventas.
:::

### ¿Cómo están cambiando estos puestos?

- **Cambia el punto de partida:** ya no se espera un requisito escrito; se entra en el contexto del usuario y del negocio para descubrir el problema.
- **Cambia la función del prototipo:** no solo muestra tecnología; llega pronto a usuarios y sirve para validar una decisión.
- **Cambia el límite de la ingeniería:** pasa de un módulo técnico a interfaz, backend, IA, despliegue y experiencia.
- **Cambia la medida del éxito:** de «la función se publicó» a adopción, ahorro, conversión, ingresos e impacto real.
- **Cambia la relación con ventas:** algunos ingenieros participan en demostraciones, PoC e implantaciones para demostrar valor con tecnología.

«Saber vender» no significa que todo el mundo deba convertirse en vendedor tradicional. Para un ingeniero de producto significa encontrar personas que podrían necesitarlo, entender su problema, mostrar una solución, invitarles a usarla y comprobar si seguirán usándola o pagando.

### ¿Qué relación tienen Product Engineer, FDE y OPC?

Los tres conceptos pertenecen a la misma cadena de capacidades, pero no son lo mismo.

| Concepto | Qué es | Contexto principal | Alcance de la responsabilidad |
| --- | --- | --- | --- |
| **Product Engineer** | Un puesto que combina producto e ingeniería | Dentro de un equipo de producto | Desde problema y solución hasta publicación, comentarios e indicadores |
| **FDE (Forward Deployed Engineer)** | Ingeniería de producto extendida al entorno del cliente | Empresas, operaciones reales y producción | Descubrimiento, PoC, integración, despliegue, adopción, ampliación y a veces ventas |
| **OPC (One-Person Company)** | Una forma de operar una empresa dirigida por una persona, no un cargo | Una persona usa agentes, automatización y servicios externos | Mercado, producto, marketing, ventas, entrega, soporte y flujo de caja |

<div class="role-path-figure" role="img" aria-label="El alcance se amplía desde construir el producto hasta llevarlo al cliente y operar el negocio completo">
  <div class="role-path-node">
    <strong>Product Engineer</strong>
    <span>Construir el producto correcto</span>
  </div>
  <div class="role-path-arrow" aria-hidden="true"></div>
  <div class="role-path-node">
    <strong>FDE</strong>
    <span>Llevar el producto al trabajo del cliente</span>
  </div>
  <div class="role-path-arrow" aria-hidden="true"></div>
  <div class="role-path-node">
    <strong>OPC</strong>
    <span>Operar un negocio completo</span>
  </div>
</div>
<p class="role-path-caption">No es una escalera profesional obligatoria, sino distintos alcances que pueden cubrir las mismas capacidades de ingeniería de producto.</p>

Puedes imaginarlos como tres círculos que crecen:

> **Product Engineer: construir correctamente el producto**<br>
> **FDE: llevarlo al contexto del cliente y producir resultados**<br>
> **OPC: utilizar las mismas capacidades para operar un negocio entero**

#### FDE: el ingeniero entra en el contexto del cliente

Un FDE no es solo una persona de implantación que instala software ni una persona de preventa que hace demostraciones. En una empresa de IA suele hacer cuatro cosas:

1. Encontrar con el cliente el problema de mayor valor.
2. Crear rápidamente un prototipo o PoC para demostrar valor técnico y empresarial.
3. Escribir código de producción y conectar la solución con datos y flujos reales.
4. Observar la adopción y convertir necesidades repetidas en capacidades generales.

A agosto de 2026, OpenAI contrataba FDE en varios países y ciudades y definía el éxito por adopción en producción, impacto medible en flujos y comentarios del terreno capaces de cambiar la hoja de ruta. El FDE se está ampliando desde una práctica especial de algunas empresas de software hasta una forma importante de implantar IA.

#### OPC: una persona puede disponer de un «equipo digital»

Aquí OPC no designa solo una forma jurídica. Significa **One-Person Company: un negocio dirigido por una persona que utiliza software, agentes de IA e infraestructura externa para realizar trabajo que antes exigía un equipo.**

Tampoco es una «empresa sin personas» operada por completo por IA. La persona fundadora todavía debe juzgar el mercado, asumir responsabilidades, hablar con usuarios y tomar decisiones. La IA se parece más a un equipo digital al que se asigna trabajo.

La tendencia no comenzó con la IA. El desarrollador independiente Pieter Levels explica que lleva años construyendo y operando por sí solo Nomads.com, Remote OK, Photo AI e Interior AI. La IA amplía el alcance al diseño, programación, contenidos, análisis y soporte, pero el mercado real sigue validando el valor. [Ver los proyectos de Pieter Levels](https://levels.io/projects/)

En 2025, el Work Trend Index de Microsoft llamó **Agent Boss** a quienes crean, delegan y gestionan agentes de IA. El informe encuestó a 31 000 trabajadores de 31 países y el 81 % de los líderes esperaba integrar agentes de forma moderada o profunda en su estrategia durante los siguientes 12–18 meses. [Ver Microsoft 2025 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born)

En junio de 2025, Wix adquirió por unos 80 millones de dólares la plataforma de desarrollo en lenguaje natural Base44. No es estrictamente una OPC, pero muestra una condición importante: bases de datos, autenticación y despliegue, tareas que requerían varios perfiles, se están empaquetando y automatizando mediante productos conversacionales. [Ver el anuncio de Wix](https://www.wix.com/press-room/home/post/wix-further-expands-into-vibe-coding-with-acquisition-of-base44-a-hyper-growth-startup-that-simplif)

La fecha de la primera empresa unicornio de una sola persona sigue siendo una predicción, no un hecho. Para quien empieza, lo importante es que **una persona ya puede validar más rápido con menos dinero y equipo y operar un negocio pequeño pero realmente rentable**.

::: tip ¿Por qué explica el curso los tres caminos?
Tanto si entras en un equipo, te conviertes en FDE o pruebas una OPC, el punto de partida es el mismo: encontrar un problema real, construir el producto mínimo, entregarlo, explicar su valor e iterar según el uso y el pago.
:::

Por eso el curso entrena un ciclo completo, no varios cargos separados:

> **Encontrar problema → Validar necesidad → Diseñar solución → Construir producto → Entregar a usuarios → Explicar valor → Observar resultados → Seguir iterando**

Pedir a la IA que escriba código es solo el principio. Un producto útil plantea más preguntas:

- ¿Cómo conseguir código limpio y mantenible?
- ¿Cómo reunir código disperso en una aplicación que funciona?
- ¿Cómo publicar la aplicación para que otras personas la usen?
- ¿Cómo integrar texto, imágenes y otras capacidades de IA?
- ¿Cómo saber si la gente lo necesita e incluso pagaría?

El curso responderá estas preguntas paso a paso.

Seas estudiante, docente, profesional sanitario, trabajador o alguien sin conocimientos técnicos, no necesitas estudiar programación durante años antes de empezar tu primer prototipo.

| Tu situación | Cómo puede ayudarte el curso |
| --- | --- |
| Estudiante | Hacer por ti mismo trabajos, concursos y proyectos de emprendimiento |
| Profesional | Automatizar tareas, mejorar la eficiencia y probar una actividad adicional |
| Product manager / Diseñador | Convertir ideas en demostraciones y ponerlas ante usuarios |
| Emprendedor / Pyme | Validar con poco coste antes de formar un equipo completo |
| Docente / Educador | Crear herramientas, materiales y ejercicios automáticos |
| Médico / Abogado / Especialista | Automatizar procesos profesionales y crear herramientas propias |
| Cualquier persona | Resolver con IA un problema concreto de la vida o el trabajo |

La IA reduce el coste de implementación, pero el valor depende de encontrar un problema real y entregar la solución a los usuarios.

## Ruta de crecimiento: de usar IA a ser ingeniero de producto

<div class="stage-intro">
  <div class="stage-card">
    <div class="stage-icon">🎮</div>
    <h3>Primera experiencia</h3>
    <p class="stage-role">Probar la programación con IA</p>
    <div class="stage-tags">
      <span>Juego Snake</span>
      <span>Empezar desde cero</span>
      <span>Primera experiencia Vibe Coding</span>
      <span>Generar en minutos</span>
    </div>
  </div>
</div>

<div class="stage-grid">
  <div class="stage-card">
    <div class="stage-icon">🛠️</div>
    <h3>Stage 1</h3>
    <p class="stage-role">Fundamentos de ingeniería de producto</p>
    <div class="stage-tags">
      <span>AI IDE (Cursor/Claude)</span>
      <span>Validación & prototipo</span>
      <span>Integración de IA</span>
      <span>Entrega a usuarios reales</span>
    </div>
  </div>
  <div class="stage-card">
    <div class="stage-icon">💻</div>
    <h3>Stage 2</h3>
    <p class="stage-role">Ingeniero de producto full stack</p>
    <div class="stage-tags">
      <span>De Figma a código</span>
      <span>Base de datos Supabase</span>
      <span>Pagos con Stripe</span>
      <span>Base de conocimiento Dify</span>
    </div>
  </div>
  <div class="stage-card">
    <div class="stage-icon">🚀</div>
    <h3>Stage 3</h3>
    <p class="stage-role">Ingeniero de producto IA / Responsable técnico</p>
    <div class="stage-tags">
      <span>Web / Mini programs / Multiplataforma</span>
      <span>Herramientas MCP avanzadas</span>
      <span>RAG & LangGraph</span>
      <span>Pensamiento de ingeniería avanzado</span>
    </div>
  </div>
</div>

<style>
.concept-illustration {
  margin: 24px 0 12px;
}

.concept-illustration img {
  display: block;
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.concept-illustration figcaption,
.role-path-caption {
  margin: 8px 12px 0;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  line-height: 1.6;
  text-align: center;
}

.role-path-figure {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  margin: 24px 0 0;
}

.role-path-node {
  display: flex;
  min-height: 112px;
  padding: 18px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: linear-gradient(145deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.role-path-node strong {
  color: var(--vp-c-brand-1);
  font-size: 1rem;
}

.role-path-node span {
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
}

.role-path-arrow::before {
  color: var(--vp-c-brand-1);
  content: '→';
  font-size: 1.25rem;
  font-weight: 700;
}

.stage-intro {
  margin: 20px auto;
  max-width: 400px;
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.stage-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}

.stage-card:hover {
  transform: translateY(-2px);
  background-color: var(--vp-c-bg-mute);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border-color: var(--vp-c-brand);
}

.stage-icon {
  font-size: 2rem;
  margin-bottom: 8px;
  line-height: 1;
}

.stage-card h3 {
  margin: 0 0 4px 0 !important;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
}

.stage-role {
  margin: 0 0 8px 0 !important;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.stage-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

.stage-tags span {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 3px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.stage-card:hover .stage-tags span {
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-brand-dimm);
  color: var(--vp-c-brand-dark);
}

@media (max-width: 720px) {
  .role-path-figure {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .role-path-node {
    min-height: 88px;
  }

  .role-path-arrow {
    text-align: center;
  }

  .role-path-arrow::before {
    content: '↓';
  }
}
</style>

Al completar la ruta obtendrás:

- **Capacidad de Vibe Coding:** usar herramientas de IA con soltura y guiarlas para producir buen código sin memorizar primero toda la sintaxis.
- **Desarrollo full stack:** trabajar desde la interfaz y el frontend hasta bases de datos, API, desarrollo local y despliegue.
- **Integración de IA:** conectar API multimodales de texto, imagen y audio y, más adelante, crear productos con técnicas como RAG.
- **Pensamiento de producto y operación:** aprender investigación, desglose de necesidades, MVP, iteración, pagos y gestión de usuarios.

# ¿Qué podrás hacer al terminar?

## Stage 1: construir tu primer prototipo

Esta etapa sirve para principiantes completos y para quienes saben un poco de código pero aún no tienen confianza. No empezarás con mucha teoría: aprenderás a pedir a la IA que escriba y arregle código mientras construyes.

**Al terminar podrás:**

- completar de forma independiente una aplicación web con una herramienta de IA;
- convertir una idea en un prototipo que se puede pulsar y usar;
- añadir funciones como generación de imágenes o conversación inteligente;
- investigar y resolver errores en vez de detenerte ante el primer fallo.

En resumen, podrás crear algo que funciona y se puede enseñar.

Empezaremos con un juego pequeño, aprenderemos a escribir y corregir con IA, pasaremos de una página simple a una aplicación interactiva, añadiremos funciones de IA y terminaremos un proyecto independiente.

# ¿Por qué entrenar con proyectos?

> **El reto del trabajo real**
>
> En el trabajo suele existir un objetivo, pero no una documentación completa, una estructura preparada ni requisitos detallados.

> Responsable o cliente: necesitamos construir xxx y lograr yyy.
>
> ¿Documentación? ¿Marco existente? ¿Especificación? Muchas veces no hay nada.

Gran parte del trabajo consiste en resolver problemas desconocidos con incertidumbre. Los requisitos son vagos, los límites cambian y no hay una respuesta estándar. Hay que investigar, experimentar, crear prototipos, iterar y entregar una solución que funcione, se pueda usar y publicar.

El curso te ofrece una simulación segura:

- los proyectos difíciles obligan a dividir problemas, diseñar soluciones y buscar información;
- el código no excesivamente simplificado enseña a leer y modificar una base de tamaño medio;
- el camino desde la idea hasta el lanzamiento permite experimentar un producto de cero a uno.

A corto plazo puede resultar duro; a largo plazo mejora tu capacidad de asumir responsabilidades, avanzar con incertidumbre y convertir la IA en un producto real, no en una demostración.

# El arte de preguntar: una habilidad básica de la era de la IA

Preguntar es una habilidad fundamental. Con el mismo código y error, **la forma de preguntar casi decide la respuesta**: una explicación vaga o unos pasos que se pueden ejecutar.

**Crea el hábito:** considera las preguntas a la IA parte del desarrollo. Cuando no entiendas algo o te bloquees, pregunta inmediatamente.

## ¿Por qué es imprescindible?

- **La realidad rara vez tiene documentación completa:** encontramos requisitos poco claros, código a medias y errores dispersos.
- **La IA puede ser docente y compañera:** una buena pregunta la convierte en programación en pareja de calidad.
- **La comunicación fija el límite:** cuanto mejor sea el contexto y las restricciones, más útil será la respuesta.

**Error habitual:** preguntar solo «¿por qué falla?» produce suposiciones. Añade el contexto para recibir un plan ejecutable.

## Cómo dar información a la IA: captura o copiar y pegar

Ambas formas sirven, pero para situaciones distintas:

| Método | Adecuado para | Requisito principal |
| --- | --- | --- |
| **Copiar y pegar** | Errores, registros, código, configuración y respuesta de API | Incluir el contenido completo relacionado, no solo una línea |
| **Captura** | Problemas de interfaz, interacción o botones que no se encuentran | Incluir contexto, marcar la zona importante y añadir una frase |

::: danger ⚠️ Condición importante
**No todas las IA aceptan imágenes.** Las capturas necesitan un modelo multimodal capaz de entenderlas, como Claude, GPT-4V/GPT-4o, Gemini, Qwen o ERNIE Bot.

**Si la IA no admite imágenes**, no reconocerá la captura. Copia y pega el texto.
:::

## Prompts para que la IA explique bien

Si quieres aprender y no solo recibir la respuesta, prueba indicaciones como estas:

> **Ejemplos para aprender**
>
> - «Explica primero este concepto en cinco frases y después hazme preguntas para comprobar si lo entendí.»
> - «Explica con detalle este error; no entiendo por qué ocurrió.»

# Llevo mucho tiempo intentándolo y quiero abandonar

Quizá deba cambiar el método, no tu constancia. No luches solo: habla con autores y docentes, cuenta qué probaste, dónde estás bloqueado y cómo te sientes. Un pequeño cambio de dirección o un concepto que faltaba puede ayudarte a continuar.

# Algunas decisiones del curso no me parecen razonables

Contacta con los autores, abre un issue o comenta en clase o en la comunidad. Explica qué no está claro, qué experiencia es mala y dónde perdiste tiempo. Los comentarios sinceros y concretos ayudan a quienes estudien después.

# Referencia

- [Prácticas de Fundamentos de Sistemas Informáticos de la Universidad de Nankín](https://nju-projectn.github.io/ics-pa-gitbook/ics2025/)

<RelatedArticlesSection
  title="Qué aprender después"
  description="Continúa desde usar IA hasta construir productos."
  :items="relatedArticles"
/>
