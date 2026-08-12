---
title: 'Encontrar oportunidades de IA en flujos de trabajo reales'
description: 'Más de sesenta informes y casos de producto ayudan a estudiar usos de IA que ya existen en empresas y en la vida diaria.'
---

# Encontrar oportunidades de IA en flujos de trabajo reales

Muchas recopilaciones de «IA por sectores» parecen abundantes: finanzas, salud, educación, fabricación y una docena de ideas bajo cada título. Sin embargo, no explican a quién entrevistar, qué datos conectar, qué paso sustituir ni quién pagaría por el resultado.

El problema es que **un sector no es un caso de uso**. «IA + salud» solo define un territorio. «Después de la consulta, el médico dedica diez minutos a completar la historia; el sistema redacta una nota desde la conversación y el médico la aprueba» sí es un flujo que se puede investigar, diseñar y probar.

Este apéndice revisa más de sesenta informes de consultoría, estudios sectoriales y casos directos de producto. En vez de enumerar todos los sectores, selecciona trabajos empresariales y momentos de consumo que ya se utilizan y cuyo valor se puede localizar. Úsalo como mapa para encontrar preguntas que merecen entrevistas, no como una idea de negocio terminada.

<div class="research-note">
  <div>
    <span class="research-note__eyebrow">Recuerda esta frase</span>
    <strong>En empresa, busca un bloqueo en el flujo; en consumo, un momento que se repite durante el día.</strong>
  </div>
  <p>El primero debe aclarar quién trabaja, qué sistemas intervienen y quién responde. El segundo debe explicar por qué la persona vuelve y qué paso elimina la IA frente a búsqueda, plantillas o servicio humano.</p>
</div>

## Primero distingue empresa y consumo

### Empresa: se paga por un resultado

Una empresa rara vez compra «poder conversar». Compra menos tiempo de gestión, menos retrabajo, más estabilidad normativa o más ventas. Un caso investigable debe decir quién lo hace cada día, de dónde llega el material, en qué sistema se escribe el resultado y quién responde por un error.

En la encuesta de Deloitte a 2.773 responsables, solo una parte pequeña de los experimentos llegó a escala. Accenture revisó más de 2.000 proyectos y también encontró pocas organizaciones con valor empresarial general. El obstáculo suele ser la entrada en el flujo completo, no la capacidad de responder del modelo. [Deloitte: State of Generative AI in the Enterprise](https://www2.deloitte.com/us/en/pages/about-deloitte/articles/press-releases/state-of-generative-ai.html) · [Accenture: Making Reinvention Real with Gen AI](https://www.accenture.com/us-en/insights/consulting/making-reinvention-real-with-gen-ai)

### Consumo: se paga por un momento más sencillo

Un producto de consumo no necesita conectar diez sistemas, pero la persona puede cerrar la aplicación en cualquier momento. Los buenos usos aparecen al preparar un viaje, comparar artículos, practicar conversación, crear un cartel o ordenar facturas. Primero completan una tarea y después aprenden preferencias.

En la encuesta de Capgemini a 12.000 consumidores, la IA generativa ya participaba en el descubrimiento y la comparación de productos. QuestMobile también observa en China el paso desde el chat aislado a búsqueda, productividad, imagen y música. La oportunidad está en conectar la conversación con la siguiente acción. [Capgemini: What Matters to Today's Consumer 2025](https://www.capgemini.com/insights/research-library/top-consumer-trends-in-2025/) · [QuestMobile: informe móvil de primavera de 2025](https://www.questmobile.cn/research/report/1919961024158601218/)

## Empresa: ocho trabajos que ya están ocurriendo

Cada apartado parte de un puesto concreto. Antes de copiar un producto, observa por qué el trabajo era lento, qué paso tomó la IA y qué tuvo que conservar una persona.

### 1. Atención al cliente no es responder: es terminar el caso

<figure class="product-shot">
  <a href="https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/klarna.webp" alt="Klarna AI Assistant con aplazamiento, atención multilingüe y explicación de reembolso" loading="lazy" />
  </a>
  <figcaption><strong>Klarna AI Assistant:</strong> no se limita a decir «contacta con una persona»; abre la acción de aplazamiento y desglosa el reembolso. La IA útil encuentra el pedido y continúa la gestión.</figcaption>
</figure>

**Quién lo hace:** agentes, responsables de equipo y operaciones posventa.

Ante «¿por qué no llega mi reembolso?», el agente verifica identidad, consulta pedido, pago y logística, explica la norma y quizá crea un ticket. La parte lenta no es la respuesta educada, sino reunir contexto entre sistemas.

Klarna gestiona reembolsos, devoluciones e idiomas; ResultsCX enlaza voz, consulta de cuenta y API internas. El valor está en **consultar estado → aplicar reglas → registrar → escalar cuando toca**, no en una FAQ. [Caso Klarna](https://openai.com/index/klarna/) · [Caso ResultsCX](https://aws.amazon.com/solutions/case-studies/resultscx/) · [Salesforce: State of Service 2025](https://www.salesforce.com/news/stories/state-of-service-report-announcement-2025/)

Una primera versión puede empezar después de la conversación humana: redactar resumen, intención, norma y siguiente acción para que el agente lo apruebe antes de escribir el ticket. Así se mide tiempo sin ceder permisos de reembolso al modelo.

<div class="scene-check">
  <span>Preguntas útiles</span>
  <p>¿Entre qué pantallas cambia más el agente? ¿Qué preguntas repetidas requieren acciones distintas según el pedido? ¿Al transferir un caso se pregunta todo de nuevo?</p>
</div>

### 2. Ventas no necesita más texto, sino saber con quién hablar y de qué

<figure class="product-shot">
  <a href="https://openai.com/index/morgan-stanley/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/morgan-stanley.webp" alt="Interfaz interna Morgan Stanley AI@MS Assistant" loading="lazy" />
  </a>
  <figcaption><strong>Morgan Stanley AI@MS Assistant:</strong> los asesores consultan documentos y estado de casos. También aparece «solo uso interno» y la verificación humana. Es una entrada de búsqueda dentro del puesto, no un chat que decide por el asesor.</figcaption>
</figure>

**Quién lo hace:** ventas B2B, cuentas, preventa y dirección comercial.

Después de una reunión hay que actualizar CRM, ordenar decisores y objeciones, buscar casos, escribir seguimiento y decidir cuándo contactar. Las pruebas están dispersas entre grabaciones, chat, correo y notas, y el CRM queda anticuado.

McKinsey recorre prospección, preparación, comunicación, propuesta, cierre y renovación. Morgan Stanley tampoco sustituye decisiones de inversión; recupera conocimiento interno y convierte reuniones en notas y tareas. [McKinsey: Unlocking Gen AI in B2B Sales](https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/unlocking-profitable-b2b-growth-through-gen-ai) · [Caso Morgan Stanley](https://openai.com/index/morgan-stanley/)

La primera versión puede resolver los quince minutos posteriores: extraer objetivos, objeciones, compromisos y siguiente paso, redactar un correo modificable y completar campos del CRM. Mide integridad y rapidez, no palabras generadas.

### 3. El conocimiento empresarial debe indicar qué regla se aplica esta vez

<figure class="product-shot">
  <a href="https://www.notion.com/help/guides/find-answers-and-generate-reports-with-enterprise-search" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/notion-enterprise-search.png" alt="Interfaz Notion Enterprise Search" loading="lazy" />
  </a>
  <figcaption><strong>Notion Enterprise Search:</strong> una pregunta busca en Notion y Slack y permite cambiar entre Ask, Research y Build. Lo importante son fuentes y permisos existentes, no subir un único PDF.</figcaption>
</figure>

**Quién lo hace:** consultoría, operaciones, RR. HH., finanzas, soporte de TI y nuevas incorporaciones.

Las respuestas existen, pero están repartidas entre normas, manuales, correos, vídeos y proyectos. «¿Puede recibir reembolso este cliente?» necesita regla vigente, condiciones y fuente, no cualquier archivo con la palabra reembolso.

Sun Life atiende más de diez mil consultas internas por semana; Morgan Stanley amplió su material buscable a unos cien mil documentos. Notion coloca búsqueda, reuniones y acción en el mismo espacio. El núcleo es permiso, versión, cita y retroalimentación. [Sun Life Asks](https://aws.amazon.com/solutions/case-studies/sun-life-case-study/) · [Descripción de Notion AI](https://www.notion.com/help/notion-ai-faqs)

No conectes toda la empresa primero. Elige devoluciones o soporte de TI, con muchas preguntas y límites claros. Cada respuesta cita el original; cuando no exista, lo reconoce y añade la pregunta a la lista de material pendiente.

### 4. Finanzas, legal y cumplimiento: leer y redactar, pero no firmar

<figure class="product-shot">
  <a href="https://mena.thomsonreuters.com/en/products-services/legal/cocounsel.html" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/cocounsel.jpg" alt="Thomson Reuters CoCounsel para contratos e investigación" loading="lazy" />
  </a>
  <figcaption><strong>Thomson Reuters CoCounsel:</strong> muestra progreso de redacción e investigación y abre el borrador en Word. La IA lee, busca fundamento y redacta; el profesional revisa y termina en su documento habitual.</figcaption>
</figure>

**Quién lo hace:** análisis financiero, impuestos, legal, compras y cumplimiento.

Contratos, facturas, estados, políticas, auditorías y diligencia parecen similares pero difieren. La IA sirve para extraer, comparar, clasificar, buscar y redactar, pero la decisión final debe volver al original y tener una persona responsable.

La encuesta de Thomson Reuters de 2025 registra más uso en investigación, resumen, contratos y declaraciones. Contract Companion de Moderna resume contratos; OpenAI y PwC tratan conciliación, alertas y agentes financieros entre sistemas. [Thomson Reuters: 2025 Generative AI in Professional Services](https://www.thomsonreuters.com/en-us/posts/technology/genai-professional-services-report-2025/) · [Caso Moderna](https://openai.com/index/moderna/) · [OpenAI × PwC: flujos de CFO](https://openai.com/index/openai-pwc-finance-collaboration/)

Un equipo pequeño puede revisar pago, renovación, indemnización y datos en contratos de proveedor, con cita y explicación. Demuestra omisiones, tiempo y precisión antes de prometer «departamento legal de IA».

### 5. Desarrollo de software: el valor aparece en el repositorio

<figure class="product-shot">
  <a href="https://github.blog/changelog/2024-10-29-github-copilot-code-review-in-github-com-private-preview/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/github-copilot-review.webp" alt="GitHub Copilot revisando un Pull Request" loading="lazy" />
  </a>
  <figcaption><strong>GitHub Copilot Code Review:</strong> la observación se fija a una línea y puede incluir un cambio aplicable. La persona revisa diferencias, agrupa o rechaza. El valor vive en el Pull Request, no en otro chat.</figcaption>
</figure>

**Quién lo hace:** desarrollo, pruebas, operaciones y seguridad.

El tiempo se consume entendiendo código antiguo, añadiendo pruebas, leyendo registros, revisando cambios y conociendo repositorios. En el experimento controlado de GitHub, Copilot aceleró una tarea; en equipos reales importan más el contexto, las normas y las pruebas. [Estudio de productividad de GitHub Copilot](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/) · [Informe posterior de GitHub](https://github.blog/wp-content/uploads/2023/06/Sea-Change-in-Software-Dev.pdf)

Una herramienta interna puede empezar en un CI fallido: leer error y cambios, localizar causas, proponer arreglo y preparar parche revisable. Debe ejecutar pruebas, mostrar diferencias y aceptar revisión, no enviar directamente a producción.

### 6. Fabricación y servicio de campo: unir equipo, manual y orden de trabajo

<figure class="product-shot">
  <a href="https://blog.siemens.com/2026/02/the-digital-enterprise-and-the-synthesis-of-industrial-ai-digital-twin-and-data/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/siemens-industrial-copilot.jpg" alt="Siemens Engineering Copilot junto a TIA Portal" loading="lazy" />
  </a>
  <figcaption><strong>Siemens Engineering Copilot:</strong> Copilot y TIA Portal están abiertos juntos. El asistente ve proyecto, estructura y documentación actuales, no responde sin contexto a «por qué falló la máquina».</figcaption>
</figure>

**Quién lo hace:** operadores, mantenimiento, servicio de campo e ingeniería de proceso.

Cuando una máquina para, quizá solo se vea un código. La respuesta está en cientos de páginas, piezas e historial, mientras la pérdida crece por minuto. Después de reparar también hay que redactar un informe entendible y archivable.

Siemens Industrial Copilot explica equipos, recupera fundamentos y ayuda a programar automatización. Otra prueba convierte notas breves de más de 1,4 millones de órdenes anuales en informes coherentes. Deloitte señala contexto y calidad de datos como barreras. [Siemens Industrial Copilot](https://news.microsoft.com/source/emea/features/how-ai-is-helping-siemens-and-thyssenkrupp-bridge-skilling-gaps-in-manufacturing/) · [Caso de informes Siemens](https://www.microsoft.com/en/customers/story/19736-siemens-ag-germany-dynamics-365-field-service) · [Deloitte: 2025 Smart Manufacturing Survey](https://www2.deloitte.com/us/en/insights/industry/manufacturing/2025-smart-manufacturing-survey.html)

Empieza con un tipo de equipo, no con «predecir toda la fábrica»: identifica código, busca manual e historial, propone orden de comprobación y redacta informe final. Cada sugerencia muestra fuente y puede marcarse como inútil.

### 7. En salud, empieza por documentación y coordinación, no por una demo diagnóstica

<figure class="product-shot">
  <a href="https://www.abridge.com/product" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/abridge-note.webp" alt="Abridge enlazando nota clínica y conversación" loading="lazy" />
  </a>
  <figcaption><strong>Abridge:</strong> la nota generada vuelve a la conversación correspondiente. Lo importante no es escribir rápido, sino que el médico pueda rastrear, modificar y aprobar cada registro.</figcaption>
</figure>

**Quién lo hace:** médicos, enfermería, historias, seguros y servicio al paciente.

Gran parte de la carga está fuera del diagnóstico: notas, derivación, autorización, reclamaciones y comunicación. Los usos cercanos de McKinsey se concentran en resumen, prestaciones, rechazos, alta y operaciones, no en diagnóstico autónomo. [McKinsey: Tackling Healthcare's Biggest Burdens with Generative AI](https://www.mckinsey.com/industries/healthcare/our-insights/tackling-healthcares-biggest-burdens-with-generative-ai)

Abridge crea un borrador estructurado desde la conversación y el médico lo confirma. El límite borrador–revisión–historia reduce documentación sin cambiar la responsabilidad clínica. [Caso de Abridge](https://www.abridge.com/press-release/abridge-hartford-healthcare) · [McKinsey: Generative AI in Healthcare](https://www.mckinsey.com/industries/healthcare/our-insights/generative-ai-in-healthcare-current-trends-and-future-outlook)

Sin socio clínico, datos y cumplimiento, no empieces por diagnóstico. Investiga servicios de menor riesgo, como convertir instrucciones de preparación en pasos o ayudar a ordenar llamadas, siempre con revisión institucional.

### 8. Comercio y contenidos: un recurso debe recorrer muchos canales

<figure class="product-shot">
  <a href="https://www.canva.com/newsroom/news/magic-studio/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/canva-magic-switch.png" alt="Canva Magic Switch para cambiar tamaño, traducir y convertir" loading="lazy" />
  </a>
  <figcaption><strong>Canva Magic Switch:</strong> un diseño aprobado cambia de tamaño, idioma o tipo de documento. Es el trabajo frecuente de convertir un recurso en muchas versiones.</figcaption>
</figure>

**Quién lo hace:** comercio electrónico, marca, diseño, producto y localización.

Publicar un producto requiere interpretar datos, escribir por canal, tratar imágenes, adaptar tamaños, traducir, comprobar expresiones y actualizar. Mucho tiempo se va en mover material y revisar coherencia.

Deloitte sitúa personalización, operaciones, suministro y marketing entre los usos de IA. Canva adapta tamaño e idioma y Firefly une generación, edición y recursos. La IA no sustituye el criterio de marca: reduce trabajo mecánico de versiones. [Deloitte: 2025 Retail Industry Outlook](https://www.deloitte.com/us/en/insights/industry/retail-distribution/retail-distribution-industry-outlook-2025.html) · [Canva Magic Studio](https://www.canva.com/newsroom/news/magic-studio/) · [Adobe Firefly](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

Una primera versión sirve a un canal y un producto: redacta la ficha desde datos, verifica campos, tamaño y expresiones y deja publicar a operaciones. Recibirá mejor respuesta que un «asistente universal».

## Consumo: siete momentos en que la persona abre el producto

El error más fácil es poner siete prompts en el mismo chat. Estos productos funcionan porque detrás de la conversación hay artículos, cursos, viajes, lienzo, música o datos financieros que permiten continuar.

### 1. «Reduce mis opciones»: búsqueda, comparación y compra

<figure class="product-shot product-shot--mobile">
  <a href="https://www.aboutamazon.com/news/retail/amazon-rufus" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/amazon-rufus.webp" alt="Asistente de compra Amazon Rufus" loading="lazy" />
  </a>
  <figcaption><strong>Amazon Rufus:</strong> aparece bajo el buscador y trata comparaciones, Prime Day y relojes de sueño. Continúa hacia productos reales, no solo consejos generales.</figcaption>
</figure>

Quien compra una cámara, carrito o calzado de lluvia no necesita más fichas, sino convertir condiciones vagas en opciones comparables. Rufus combina catálogo, reseñas y preguntas; Capgemini y Adobe observan IA en descubrimiento y consulta previa. [Amazon Rufus](https://www.aboutamazon.com/news/retail/amazon-rufus) · [Adobe: 2025 AI and Digital Trends](https://business.adobe.com/content/dam/dx/us/en/resources/digital-trends-report-2025/2025_Digital_Trends_Report.pdf)

Investiga una categoría difícil, no «compras con IA». Un inquilino que compra proyector combina distancia, luz diurna, ruido y presupuesto. Muestra fundamento, datos ausentes y productos reales, no una conclusión inventada.

### 2. «No quiero veinte pestañas»: viaje y cambios sobre la marcha

<figure class="product-shot">
  <a href="https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/expedia-chatgpt.jpg" alt="Planificador conversacional de Expedia" loading="lazy" />
  </a>
  <figcaption><strong>Planificación conversacional de Expedia:</strong> se comparan Maui y Kauai para una luna de miel y se guardan hoteles en Trips. El círculo se cierra cuando el chat llega a guardado, itinerario y reserva.</figcaption>
</figure>

Planear un viaje cruza destino, fecha, transporte, horarios, presupuesto y acompañantes. Expedia conecta conversación con hoteles guardados, precios y reserva. El valor no es un texto bonito, sino un itinerario guardable, comprobable y comprable. [Planificación de Expedia](https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/) · [Caso de servicio Expedia](https://www.expedia.com/newsroom/expedia-group-sets-the-standard-with-ai-powered-service-agent/)

Un inicio menor sería «medio día con niños» o «ruta nocturna tras un concierto». Tiempo, precios y horarios deben venir de interfaces fiables y mostrar su actualización.

### 3. «Quiero practicar, no solo escuchar»: aprendizaje y respuesta

<figure class="product-shot product-shot--portrait">
  <a href="https://blog.duolingo.com/duolingo-max/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/duolingo-roleplay.webp" alt="Duolingo Max practicando un pedido en un café de París" loading="lazy" />
  </a>
  <figcaption><strong>Duolingo Max Roleplay:</strong> no dice «habla francés», sino «pide en un café de París». Escena, papel, meta y recompensa permiten practicar inmediatamente.</figcaption>
</figure>

La IA hace disponible una etapa antes cara: practicar en cualquier momento y recibir comentario sobre este intento. Duolingo usa juego de rol y vídeo; Khanmigo guía con preguntas y pistas en vez de entregar respuestas. [Duolingo Max](https://blog.duolingo.com/duolingo-max/) · [Khan Academy: Khanmigo](https://2023-2024.annualreport.khanacademy.org/khanmigo)

El producto puede atender una acción: entrevista, inglés oral, objeción comercial o defensa. La respuesta debe citar la frase y dar una mejora ejecutable para el siguiente intento.

### 4. «Dame un borrador que pueda cambiar»: creación personal

<figure class="product-shot">
  <a href="https://firefly.adobe.com/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/adobe-firefly.webp" alt="Espacio de generación de Adobe Firefly" loading="lazy" />
  </a>
  <figcaption><strong>Adobe Firefly:</strong> contiene modelo, proporción, tipo, intensidad, referencia y varios resultados, no solo un prompt. Un producto creativo necesita controles para seguir editando.</figcaption>
</figure>

En invitaciones, fotos de segunda mano, portadas o carteles, el lienzo vacío y el programa complejo son una barrera. Canva reúne generación, recorte, expansión, tamaño y traducción; Firefly continúa entre imagen, vídeo, audio y vector. [Canva Magic Studio](https://www.canva.com/newsroom/news/magic-studio/) · [Lanzamiento de Adobe Firefly](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

Ofrece control, no solo «generar de nuevo». Define el resultado —fotos de vivienda, portada de pódcast, cartel en tres tamaños— y permite bloquear texto, personas y colores.

### 5. «¿Qué falló esta vez?»: explicación personalizada

<figure class="product-shot">
  <a href="https://blog.duolingo.com/duolingo-max/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/duolingo-explain.jpg" alt="Explicación de error en Duolingo Max" loading="lazy" />
  </a>
  <figcaption><strong>Explain My Answer:</strong> cita la respuesta, explica por qué vestidos exige gustan y deja pedir ejemplos. Atiende el momento «¿por qué me equivoqué?» en vez de empezar otra lección.</figcaption>
</figure>

La misma respuesta requiere explicaciones distintas para principiante y experto. Explain My Answer parte del error recién cometido y ya conoce pregunta, respuesta y progreso. [Duolingo: Explain My Answer](https://blog.duolingo.com/explain-my-answer-now-free/)

También sirve para postura deportiva, cámara, ajedrez o instrumento: toma una actuación real y señala una mejora. «Consejo personalizado» sin datos personales suele ser contenido general con otro nombre.

### 6. «No solo recomiendes: recuérdame»: música y experiencias continuas

<figure class="product-shot product-shot--mobile">
  <a href="https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/spotify-ai-dj.jpg" alt="Reproductor Spotify AI DJ" loading="lazy" />
  </a>
  <figcaption><strong>Spotify AI DJ:</strong> es una entrada continua en inicio, unida a canciones y controles. Se apoya en historial, catálogo y acción de reproducir, no solo en una voz de presentador.</figcaption>
</figure>

AI DJ selecciona música por historial y une la experiencia con una voz persistente. Lo difícil de copiar es el dato de preferencias, los derechos y la reproducción, no el tono. [Spotify AI DJ](https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/) · [Deloitte: 2025 Digital Media Trends](https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html)

También hay continuidad en correr, cocinar o leer antes de dormir. Ajusta la próxima sesión con elecciones pasadas y facilita la corrección sin fingir conocer mejor a la persona.

### 7. «Convierte una regla compleja en mi siguiente paso»: finanzas y trámites

<figure class="product-shot product-shot--portrait">
  <a href="https://turbotax.intuit.com/personal-taxes/mobile-apps/turbotax/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/intuit-assist.jpg" alt="Intuit Assist comparando créditos fiscales en TurboTax" loading="lazy" />
  </a>
  <figcaption><strong>Intuit Assist en TurboTax:</strong> compara créditos de este año y el anterior y plantea «qué otros puedo solicitar». La base son los datos propios y la tarea actual.</figcaption>
</figure>

Impuestos, crédito, seguros y facturas tienen reglas complejas, material disperso y pasos distintos. Intuit Assist usa datos existentes de TurboTax, Credit Karma y QuickBooks para explicar y actuar, no para acompañar. [Intuit Assist](https://www.intuit.com/intuitassist/)

El riesgo es mayor. La primera versión puede hacer listas, explicar conceptos, clasificar facturas y recordar trámites, separando hechos, cálculos y sugerencias. Declaraciones, inversión o seguro requieren confirmación y acceso profesional.

## Dónde encontrar tu propia dirección empresarial o de consumo

Los casos enseñan la forma, no invitan a cambiar el nombre del sector. Tu dirección suele estar entre personas, materiales y hábitos accesibles. La búsqueda empresarial y la de consumo empiezan de forma distinta.

### Empresa: sigue un puesto hasta el final

El material empresarial no dice «oportunidad de negocio». Aparece en vacantes, compras, manuales, reseñas y proyectos. Elige un puesto concreto —comercio exterior, atención de inmueble, recepción clínica o mantenimiento— y sigue su trabajo.

<div class="idea-routes">
  <div class="idea-route idea-route--b">
    <span>Dónde buscar flujos empresariales</span>
    <ul>
      <li><strong>Empleo:</strong> responsabilidades, sistemas, tablas e informes diarios.</li>
      <li><strong>Licitaciones y compras:</strong> problemas pagados, criterios de aceptación y límites.</li>
      <li><strong>Reseñas de software:</strong> busca en G2, Capterra, tiendas y foros «exportar a Excel» y «rellenar a mano».</li>
      <li><strong>Casos e informes anuales:</strong> combina empresa con transformación, eficiencia o servicio para encontrar presupuesto.</li>
      <li><strong>Material real:</strong> tickets, presupuestos, listas, mensajes y formación están más cerca del producto que un informe.</li>
    </ul>
  </div>
  <div class="idea-route idea-route--c">
    <span>Búsquedas directas</span>
    <p><code>flujo diario técnico mantenimiento</code></p>
    <p><code>atención inmobiliaria licitación automatización filetype:pdf</code></p>
    <p><code>site:g2.com field service software reviews</code></p>
    <p><code>customer support workflow pain points report</code></p>
    <p><code>sector transformación digital caso informe anual</code></p>
  </div>
</div>

Si te interesa el comercio exterior, no busques solo «IA + exportación». Anota respuesta a consultas, presupuesto, especificación, entrega y aduana desde ofertas de empleo; después revisa un presupuesto real y malas reseñas. Quizá convenga «preparar un presupuesto para confirmar desde precios históricos y parámetros» y no un asistente universal.

### Consumo: recorre un día y busca fricción repetida

La búsqueda empieza cuando alguien saca el móvil. Piensa en buscar, comparar, registrar, practicar, esperar y compartir. ¿Qué ocurre cada semana? ¿Qué se resuelve mal con capturas, notas, favoritos o grupos?

<div class="idea-routes">
  <div class="idea-route idea-route--c">
    <span>Dónde buscar momentos de consumo</span>
    <ul>
      <li><strong>App Store y Android:</strong> reseñas de una a tres estrellas, funciones ausentes, cobro y abandono.</li>
      <li><strong>Redes y Reddit:</strong> busca «cómo», «hay una herramienta» y «recomienda»; los comentarios añaden restricciones.</li>
      <li><strong>Product Hunt y listas:</strong> qué acción pequeña resolvió el producto y qué se pide después.</li>
      <li><strong>Tendencias y tráfico:</strong> Google Trends, QuestMobile, iResearch e informes para confirmar hábito duradero.</li>
      <li><strong>Tus fotos y favoritos:</strong> muchas capturas, guías nunca reabiertas y texto copiado son flujos sin terminar.</li>
    </ul>
  </div>
  <div class="idea-route idea-route--b">
    <span>Búsquedas directas</span>
    <p><code>site:reddit.com "I wish there was an app"</code></p>
    <p><code>viajar con niños planificar demasiado difícil</code></p>
    <p><code>aplicación presupuesto difícil reseñas</code></p>
    <p><code>Product Hunt AI language learning</code></p>
    <p><code>crecimiento usuarios aplicaciones IA informe</code></p>
  </div>
</div>

Si viajas, no construyas enseguida un «itinerario de IA». Descubre por qué se guardan diez guías: cierre inesperado, una persona mayor que debe caminar menos o una vuelta segura tras un concierto. Elige un momento repetido para crear una herramienta que se abre, no un artículo generado.

### No escribas código al encontrar material

Conserva tres pruebas: un documento que muestre el flujo, el mismo problema contado por tres personas y una alternativa por la que alguien ya paga o pierde tiempo. Después dedica sesenta minutos a concretarlo.

<div class="fieldwork">
  <div class="fieldwork__step"><b>01</b><span>Nombra una persona</span><p>En empresa, un puesto; en consumo, una situación vital. «Usuario empresarial» y «joven» no bastan.</p></div>
  <div class="fieldwork__step"><b>02</b><span>Observa una aparición</span><p>Consigue tabla, grabación, reseña o acción real y localiza el bloqueo exacto.</p></div>
  <div class="fieldwork__step"><b>03</b><span>Encuéntralo tres veces</span><p>La misma dificultad debe venir de tres personas o fuentes, no de una queja llamativa.</p></div>
  <div class="fieldwork__step"><b>04</b><span>Toma solo un paso</span><p>Define entrada, salida, revisor y métrica antes de decidir si la IA encaja.</p></div>
</div>

Finalmente, escribe una frase que otra persona pueda imaginar:

> Cuando **quién** vive **qué momento**, hoy utiliza **qué materiales o apaño** para completar **qué tarea**. Primero dejaré a la IA realizar **un paso**, hará que **quién** lo confirme y mediré **qué cambio** para saber si aporta valor.

Ejemplo empresarial:

> Cuando el operario de la línea ve el error E37, consulta manual en papel y órdenes antiguas. El sistema encuentra la sección y tres comprobaciones para ese modelo; un técnico las confirma. La prueba mide el tiempo medio de parada.

Ejemplo de consumo:

> Cuando una familia visita un museo, combina publicaciones, mapas y reseñas. El producto prepara tres horas según edad y tiempo, cita horarios y precios y añade al calendario tras la confirmación.

Solo con este grado de concreción existe una idea que se puede entrevistar, prototipar y probar en pequeño.

## Fuentes

Se enumeran **67 fuentes**. El texto prioriza informes con método claro y casos directos; los informes bursátiles chinos sirven para observar intereses comerciales, no para convertir una opinión de inversión en demanda. Los casos de proveedores deben contrastarse con entrevistas y datos reales.

<details class="source-group">
<summary>1. Adopción general y valor empresarial (15)</summary>

1. [McKinsey：The Economic Potential of Generative AI](https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier)
2. [McKinsey：The State of AI 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)
3. [PwC：2025 Global AI Jobs Barometer](https://www.pwc.com/gx/en/issues/c-suite-insights/the-leadership-agenda/AI-jobs-barometer.html)
4. [PwC：Global Workforce Hopes and Fears Survey 2025](https://www.pwc.com/gr/en/publications/specific-to-all-industries-index/hopes-and-fears-2025.html)
5. [Deloitte：State of Generative AI in the Enterprise](https://www2.deloitte.com/us/en/pages/about-deloitte/articles/press-releases/state-of-generative-ai.html)
6. [Microsoft：2025 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born)
7. [IBM：5 Trends for 2025](https://www.ibm.com/thought-leadership/institute-business-value/en-us/report/business-trends-2025)
8. [IBM：2025 CDO Study](https://www.ibm.com/thought-leadership/institute-business-value/en-us/report/2025-cdo)
9. [Cisco：2025 AI Readiness Index](https://www.cisco.com/c/m/en_us/solutions/ai/readiness-index/realizing-the-value-of-ai.html)
10. [EY：2025 AI Pulse Survey](https://www.ey.com/en_us/insights/emerging-technologies/pulse-ai-survey)
11. [Accenture：Reinventing Enterprise Models in the Age of Gen AI](https://www.accenture.com/us-en/insights/artificial-intelligence/ai-investments)
12. [Accenture：Making Reinvention Real with Gen AI](https://www.accenture.com/us-en/insights/consulting/making-reinvention-real-with-gen-ai)
13. [OpenAI：The State of Enterprise AI 2025](https://openai.com/business/guides-and-resources/the-state-of-enterprise-ai-2025-report/)
14. [中国信通院：《人工智能发展报告（2024 年）》](https://hrssit.cn/Uploads/file/20241217/1734400434600250.pdf)
15. [CNNIC：《生成式人工智能应用发展报告（2025）》](https://www3.cnnic.cn/n4/2025/1021/c88-11391.html)

</details>

<details class="source-group">
<summary>2. Sectores, puestos y flujos empresariales (24)</summary>

16. [McKinsey：Unlocking Profitable B2B Growth Through Gen AI](https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/unlocking-profitable-b2b-growth-through-gen-ai)
17. [McKinsey：Capturing the Full Value of Generative AI in Banking](https://www.mckinsey.com/industries/financial-services/our-insights/capturing-the-full-value-of-generative-ai-in-banking)
18. [McKinsey：The AI-powered Bank—Customer Care](https://www.mckinsey.com/industries/financial-services/our-insights/the-ai-powered-bank-rewiring-for-excellence-in-customer-care)
19. [McKinsey：The Future of AI in Insurance](https://www.mckinsey.com/industries/financial-services/our-insights/the-future-of-ai-in-the-insurance-industry)
20. [McKinsey：Tackling Healthcare’s Biggest Burdens with Generative AI](https://www.mckinsey.com/industries/healthcare/our-insights/tackling-healthcares-biggest-burdens-with-generative-ai)
21. [McKinsey：Generative AI in Healthcare](https://www.mckinsey.com/industries/healthcare/our-insights/generative-ai-in-healthcare-current-trends-and-future-outlook)
22. [Deloitte：2025 Manufacturing Industry Outlook](https://www.deloitte.com/us/en/insights/industry/manufacturing-industrial-products/manufacturing-industry-outlook/2025.html)
23. [Deloitte：2025 Smart Manufacturing Survey](https://www2.deloitte.com/us/en/insights/industry/manufacturing/2025-smart-manufacturing-survey.html)
24. [Deloitte：2025 Retail Industry Outlook](https://www.deloitte.com/us/en/insights/industry/retail-distribution/retail-distribution-industry-outlook-2025.html)
25. [Deloitte：2025 Global Health Care Outlook](https://www.deloitte.com/content/dam/assets-zone1/tw/en/docs/industries/life-sciences-health-care/2025/2025-healthcare-outlook-en.pdf)
26. [Accenture：Commercial Banking Trends 2024](https://www.accenture.com/content/dam/accenture/final/accenture-com/document-2/Accenture-Commercial-Banking-Trends-2024.pdf)
27. [Accenture：Banking Trends 2026](https://www.accenture.com/us-en/insights/banking/accenture-banking-trends-2026)
28. [Thomson Reuters：2025 Generative AI in Professional Services](https://www.thomsonreuters.com/en-us/posts/technology/genai-professional-services-report-2025/)
29. [Salesforce：State of Service 2025](https://www.salesforce.com/news/stories/state-of-service-report-announcement-2025/)
30. [Salesforce：State of Sales 2026](https://www.salesforce.com/en/wp-content/uploads/sites/4/documents/reports/sales/salesforce-state-of-sales-report-2026.pdf)
31. [Adobe：2025 AI and Digital Trends](https://business.adobe.com/content/dam/dx/us/en/resources/digital-trends-report-2025/2025_Digital_Trends_Report.pdf)
32. [Adobe：2025 Content Creation and Management](https://business.adobe.com/content/dam/dx/us/en/resources/reports/content-management-digital-trends/2025-ai-and-digital-trends-content-creation-and-management.pdf)
33. [艾瑞咨询：《2025 年中国企业级 AI 应用行业研究报告》](https://www.bsia.org.cn/site/content/31686.html)
34. [GitHub：Quantifying Copilot’s Impact on Developer Productivity](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/)
35. [Siemens × Microsoft：Industrial Copilot](https://news.microsoft.com/source/2024/10/24/siemens-and-microsoft-scale-industrial-ai/)
36. [Abridge：Hartford HealthCare Ambient AI 案例](https://www.abridge.com/press-release/abridge-hartford-healthcare)
37. [AWS：Sun Life 内部知识助手](https://aws.amazon.com/solutions/case-studies/sun-life-case-study/)
38. [AWS：ResultsCX 客服自动化](https://aws.amazon.com/solutions/case-studies/resultscx/)
39. [AWS：Sanofi 企业 AI 助手](https://aws.amazon.com/solutions/case-studies/sanofi-bedrock-case-study/)

</details>

<details class="source-group">
<summary>3. Productos implantados y casos empresariales (10)</summary>

40. [OpenAI：Morgan Stanley](https://openai.com/index/morgan-stanley/)
41. [OpenAI：Klarna](https://openai.com/index/klarna/)
42. [OpenAI：Moderna](https://openai.com/index/moderna/)
43. [OpenAI：BBVA](https://openai.com/index/bbva-2025/)
44. [OpenAI × PwC：Reimagining the Office of the CFO](https://openai.com/index/openai-pwc-finance-collaboration/)
45. [Microsoft：Siemens 现场服务报告](https://www.microsoft.com/en/customers/story/19736-siemens-ag-germany-dynamics-365-field-service)
46. [AWS：Legal & General 文档处理](https://aws.amazon.com/solutions/case-studies/aws-innovator-legal-and-general/)
47. [AWS × Infosys：医疗保险客服助手](https://aws.amazon.com/blogs/apn/how-infosys-built-aws-generative-ai-based-assistant-for-a-healthcare-payer-company/)
48. [Notion：Notion AI 功能说明](https://www.notion.com/help/notion-ai-faqs)
49. [Canva：Magic Studio](https://www.canva.com/newsroom/news/magic-studio/)

</details>

<details class="source-group">
<summary>4. Consumidores y productos (13)</summary>

50. [Capgemini：What Matters to Today’s Consumer 2025](https://www.capgemini.com/insights/research-library/top-consumer-trends-in-2025/)
51. [Accenture：Me, My Brand and AI](https://www.accenture.com/us-en/insights/consulting/me-my-brand-ai-new-world-consumer-engagement)
52. [Deloitte：2025 Digital Media Trends](https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html)
53. [QuestMobile：2025 中国移动互联网春季报告](https://www.questmobile.cn/research/report/1919961024158601218/)
54. [QuestMobile：2025 年 8 月 AI 应用行业报告](https://www.questmobile.com.cn/research/report/1967853261412208641/)
55. [艾瑞咨询：《2025 年中国 AI 类 App 流量分析报告》](https://www.etc.org.cn/UserFiles/Article/file/6388341575962762472758248.pdf)
56. [Amazon：Rufus 购物助手](https://www.aboutamazon.com/news/retail/amazon-rufus)
57. [Expedia：对话式旅行规划](https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/)
58. [Duolingo：Duolingo Max](https://blog.duolingo.com/duolingo-max/)
59. [Khan Academy：Khanmigo](https://2023-2024.annualreport.khanacademy.org/khanmigo)
60. [Spotify：AI DJ](https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/)
61. [Intuit：Intuit Assist](https://www.intuit.com/intuitassist/)
62. [Adobe：Firefly](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

</details>

<details class="source-group">
<summary>5. Perspectiva de firmas bursátiles chinas (5)</summary>

63. [华鑫证券：WAIC 大会强供给，AI 应用商业化如何解](https://pdf.dfcfw.com/pdf/H3_AP202507291717868704_1.pdf)
64. [国信证券：人工智能专题——AI Agent](https://pdf.dfcfw.com/pdf/H3_AP202503121644302597_1.pdf)
65. [东吴证券：2025 年 AI 应用渗透趋势](https://pdf.dfcfw.com/pdf/H301_AP202501021641518997_1.pdf)
66. [中银证券：“人工智能+”应用与平台](https://pdf.dfcfw.com/pdf/H3_AP202510201765533690_1.pdf)
67. [AIGC 行业深度：算力、模型与应用的创新融合](https://pdf.dfcfw.com/pdf/H3_AP202411151640914780_1.pdf)

</details>

<p class="source-footnote">Fuentes consultadas y organizadas en agosto de 2026. Los porcentajes dependen de la muestra, la región y la definición del proveedor; no sustituyen entrevistas ni pruebas con el público objetivo.</p>

<style scoped>
.research-note {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 24px;
  margin: 32px 0 42px;
  padding: 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background:
    radial-gradient(circle at 8% 12%, color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent), transparent 34%),
    var(--vp-c-bg-soft);
}

.research-note__eyebrow {
  display: block;
  margin-bottom: 10px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .12em;
}

.research-note strong {
  display: block;
  font-size: 21px;
  line-height: 1.5;
}

.research-note p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.8;
}

.scene-check {
  margin: 24px 0 38px;
  padding: 18px 20px;
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 0 12px 12px 0;
  background: var(--vp-c-bg-soft);
}

.scene-check span {
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
}

.scene-check p {
  margin: 6px 0 0;
}

.product-shot {
  margin: 20px 0 30px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 14px 38px color-mix(in srgb, var(--vp-c-text-1) 8%, transparent);
}

.product-shot a {
  display: block;
  background: #f5f5f3;
}

.product-shot img {
  display: block;
  width: 100%;
  max-height: 520px;
  object-fit: contain;
}

.product-shot--portrait img {
  max-height: 560px;
}

.product-shot--mobile img {
  max-height: 520px;
}

.product-shot figcaption {
  padding: 14px 17px 16px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.75;
}

.product-shot figcaption strong {
  color: var(--vp-c-text-1);
}

.idea-routes {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(240px, .75fr);
  gap: 14px;
  margin: 24px 0 28px;
}

.idea-route {
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
}

.idea-route--b {
  background: color-mix(in srgb, var(--vp-c-brand-soft) 58%, var(--vp-c-bg));
}

.idea-route--c {
  background: var(--vp-c-bg-soft);
}

.idea-route > span {
  display: block;
  margin-bottom: 12px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
}

.idea-route ul {
  margin: 0;
  padding-left: 20px;
}

.idea-route li {
  margin: 10px 0;
}

.idea-route p {
  margin: 8px 0;
}

.idea-route code {
  white-space: normal;
  word-break: break-word;
}

.fieldwork {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin: 28px 0 34px;
}

.fieldwork__step {
  min-height: 150px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.fieldwork__step b {
  display: block;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  letter-spacing: .1em;
}

.fieldwork__step span {
  display: block;
  margin-top: 12px;
  font-size: 18px;
  font-weight: 700;
}

.fieldwork__step p {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
}

.source-group {
  margin: 12px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.source-group summary {
  padding: 16px 18px;
  cursor: pointer;
  font-weight: 700;
}

.source-group ol {
  margin: 0;
  padding: 0 22px 18px 44px;
}

.source-group li {
  margin: 8px 0;
}

.source-footnote {
  margin-top: 18px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

@media (max-width: 720px) {
  .research-note,
  .idea-routes,
  .fieldwork {
    grid-template-columns: 1fr;
  }

  .research-note {
    padding: 22px;
  }

  .fieldwork__step {
    min-height: auto;
  }
}
</style>
