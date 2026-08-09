---
title: 'Referencia de escenarios de aplicacion de IA (B2B y B2C)'
description: 'Este documento recopila las aplicaciones de los modelos LLM en escenarios empresariales B2B y de consumo B2C. B2B cubre 19 industrias incluyendo manufactura, servicio al cliente, educacion, salud y finanzas; B2C cubre 16 escenarios de consumo incluyendo estilo de vida, compania emocional, entretenimiento y crecimiento personal, proporcionando una referencia completa para desarrolladores de aplicaciones de IA.'
---

<script setup>
import { computed, ref } from 'vue'

const duration = 'Aprox. <strong>6 horas</strong>'

const interestPoint = ref('')
const purpose = ref('')

// Grupo de temas por industria
const topicPool = {
  'manufacturing': [
    { title: 'Plataforma de diseño asistido por IA para exteriores de autobuses de nueva energía', desc: 'Diseño conceptual de exteriores basado en modelos de generación de imágenes' },
    { title: 'Asistente inteligente de diseño y revisión de planos técnicos', desc: 'Construcción de una base de conocimiento de normativas de diseño empresarial mediante tecnología RAG' },
    { title: 'Generación y gestión automatizada de documentación técnica', desc: 'Generación automática de especificaciones de productos y manuales de operación basada en LLM' },
    { title: 'Asistente de generación automática de informes de inspección de equipos de producción', desc: 'Descripción por voz del estado del equipo, generación estructurada de informes de inspección' },
    { title: 'Asistente de preguntas y respuestas sobre diagnóstico de fallos en equipos industriales', desc: 'Construcción de una base de conocimiento vectorial basada en casos históricos de fallos' }
  ],
  'customer-service': [
    { title: 'Sistema de respuesta automática y generación de tickets de servicio al cliente multicanal inteligente', desc: 'Integración de mensajes multicanal, LLM comprende la intención y genera respuestas' },
    { title: 'Asistente de prospección y seguimiento de clientes potenciales', desc: 'Análisis de registros de conversaciones históricas para identificar clientes con alta intención de compra' },
    { title: 'Sistema inteligente de búsqueda y respuestas del conocimiento interno empresarial', desc: 'Construcción de una base de conocimiento vectorial basada en documentos internos' },
    { title: 'Herramienta de resumen inteligente de conversaciones y generación de tickets de servicio', desc: 'Generación automática de resúmenes de sesión y extracción de información clave' },
    { title: 'Sistema de base de conocimiento de guiones de ventas destacados del servicio al cliente', desc: 'Análisis de casos exitosos para extraer plantillas de guiones ganadores' }
  ],
  'education': [
    { title: 'Sistema de planificación de rutas de aprendizaje de idiomas personalizado y tutoría inteligente', desc: 'Evaluación del nivel del aprendiz, planificación de tareas de estudio diarias' },
    { title: 'Plataforma de elaboración automatizada de planes de clase y recomendación de recursos educativos', desc: 'Generación de estructura de planes de clase según el programa de estudios' },
    { title: 'Sistema de corrección automatizada de tareas y análisis diagnóstico del rendimiento', desc: 'Corrección automática de preguntas subjetivas y generación de sugerencias de corrección' },
    { title: 'Construcción de modelos de competencias laborales y mapas de aprendizaje', desc: 'Análisis de descripciones de puestos para extraer requisitos de competencias' },
    { title: 'Práctica conversacional individualizada de idiomas extranjeros en escenarios simulados', desc: 'LLM asume diferentes roles para practicar conversaciones orales' }
  ],
  'programming': [
    { title: 'Asistente de autocompletado de código inteligente y reparación automática de bugs', desc: 'Plugin de IDE que ofrece sugerencias de autocompletado en tiempo real' },
    { title: 'Plataforma de construcción de aplicaciones low-code y automatización de flujos', desc: 'Descripción de requisitos en lenguaje natural, conversión a configuración low-code' },
    { title: 'Sistema de generación de casos de prueba unitarios', desc: 'Análisis AST del código fuente, generación de casos de prueba con condiciones límite' },
    { title: 'Herramienta de análisis inteligente de código y migración entre lenguajes', desc: 'Análisis de la calidad del código y sugerencias de optimización' },
    { title: 'Herramienta de generación automática de código de interfaz de usuario (UI)', desc: 'Reconocimiento de imágenes de diseño, generación de CSS responsivo' }
  ],
  'healthcare': [
    { title: 'Asistente inteligente de interpretación de informes de análisis clínicos', desc: 'OCR identifica indicadores clave, interpretación de valores anómalos' },
    { title: 'Experto en consultas de salud basado en tecnología de búsqueda de conocimiento', desc: 'Construcción de un grafo de conocimiento médico, búsqueda RAG para generar respuestas' },
    { title: 'Plataforma de análisis de decisión de datos de investigación clínica', desc: 'Integración de datos EMR, asistencia en la generación de código de análisis estadístico' },
    { title: 'Herramienta de generación automática de informes de imágenes médicas', desc: 'Descripción de características de imágenes, generación automática de informes estructurados' },
    { title: 'Asistente inteligente de recordatorio de medicación para enfermedades crónicas', desc: 'Generación de recordatorios de medicación personalizados, verificación de contraindicaciones' }
  ],
  'security': [
    { title: 'Motor de detección y reparación de vulnerabilidades de seguridad en código', desc: 'Escaneo SAST del código, análisis de principios de vulnerabilidad' },
    { title: 'Sistema inteligente de identificación e interceptación de correos de phishing generados por IA', desc: 'Análisis del contenido del correo, identificación de correos de phishing generados por IA' },
    { title: 'Asistente de generación automática de informes diarios de operaciones de seguridad', desc: 'Resumen de registros, extracción automática de eventos clave' },
    { title: 'Asistente de generación inteligente de informes de pruebas de penetración', desc: 'Generación automática de informes basada en descripciones de vulnerabilidades' },
    { title: 'Asistente de consulta y análisis inteligente de inteligencia sobre amenazas', desc: 'Conexión con múltiples fuentes de inteligencia sobre amenazas, interpretación del contenido' }
  ],
  'finance': [
    { title: 'Asistente de generación inteligente de informes de debida diligencia crediticia', desc: 'Entrada de datos financieros, generación automática de informes de debida diligencia crediticia' },
    { title: 'Asesor inteligente de gestión de patrimonio bancario privado', desc: 'Análisis del perfil de riesgo del cliente, generación de recomendaciones de asignación de activos' },
    { title: 'Asistente de generación inteligente y verificación de cumplimiento de prospectos de IPO', desc: 'Plantillas modulares, llenado automático de descripciones del negocio' },
    { title: 'Sistema de generación automática de informes financieros y alerta de anomalías operativas', desc: 'Generación automática de análisis financiero y discusión de la dirección' },
    { title: 'Entrenador de guiones de venta inteligente para agentes de seguros', desc: 'Simulación de conversaciones, evaluación de la conformidad y persuasión de los guiones' }
  ],
  'enterprise': [
    { title: 'Plataforma de revisión de cumplimiento y sugerencias de modificación de contratos empresariales en todo su ciclo de vida', desc: 'Comparación de cláusulas con bases de datos normativas, generación de informes de cumplimiento' },
    { title: 'Transcripción por voz de reuniones de ventas y recomendación de guiones', desc: 'Transcripción ASR, análisis de conversaciones y recomendación de guiones ganadores' },
    { title: 'Sistema inteligente de generación y diseño de contenido de marketing', desc: 'Generación de textos de marketing y extracción de puntos de venta' },
    { title: 'Plataforma de análisis de publicidad de la competencia', desc: 'Recopilación de anuncios de la competencia, análisis de estrategias de publicación' },
    { title: 'Sistema de análisis inteligente de temas populares y recomendación de contenido', desc: 'Análisis de tendencias populares y recomendación de ángulos temáticos' }
  ],
  'content': [
    { title: 'Plataforma de asistencia creativa para contenido de cine y televisión y novelas', desc: 'Proporciona sinopsis, desarrollo de personajes, generación de diálogos' },
    { title: 'Asistente de redacción inteligente de historias de marca y artículos de relaciones públicas', desc: 'Entrada de palabras clave de marca, generación de textos en múltiples estilos' },
    { title: 'Sistema de gestión de transmisión en vivo e interacción de avatares digitales virtuales', desc: 'Imagen digital + voz TTS + diálogo LLM' },
    { title: 'Generación de guiones de videos cortos y edición inteligente', desc: 'Generación de guiones y storyboards de videos cortos' },
    { title: 'Sistema inteligente de generación y diseño de contenido de marketing', desc: 'Generación de textos de marketing y extracción de puntos de venta' }
  ],
  'government': [
    { title: 'Sistema de navegación por voz inteligente y despacho automático de la línea de servicio ciudadano 12345', desc: 'Reconocimiento de voz, comprensión de solicitudes y despacho inteligente' },
    { title: 'Robot de guía inteligente y respuestas sobre políticas para oficinas de servicios gubernamentales', desc: 'Búsqueda RAG en base de conocimiento gubernamental' },
    { title: 'Plataforma de emparejamiento inteligente y envío preciso de políticas de beneficio empresarial', desc: 'Perfil empresarial con emparejamiento automático de políticas aplicables' },
    { title: 'Asistente de pre-revisión inteligente y verificación de cumplimiento de materiales administrativos', desc: 'Reconocimiento OCR y extracción de información clave' },
    { title: 'Plataforma de identificación inteligente y gestión de despacho de eventos urbanos en cuadrícula', desc: 'Identificación del tipo de evento y despacho' }
  ],
  'legal': [
    { title: 'Agent de detección de riesgos y vulnerabilidades en contratos con un clic', desc: 'Identificación de problemas potenciales comparando con listas de verificación de riesgos' },
    { title: 'Asesor de evaluación inteligente por IA de la tasa de éxito en casos similares', desc: 'Extracción de características del caso, búsqueda y emparejamiento de casos similares' },
    { title: 'Radar de monitoreo en tiempo real de cambios legislativos y análisis de impacto empresarial', desc: 'Análisis del contenido modificado y evaluación del impacto empresarial' },
    { title: 'Herramienta de redacción automática AIGC de cartas de abogado', desc: 'Entrada de declaración de hechos, generación de cartas de abogado estandarizadas' },
    { title: 'Plugin de explicación en lenguaje sencillo de cláusulas legales complejas', desc: 'Generación de explicaciones fáciles de entender' }
  ],
  'travel': [
    { title: 'Generador de itinerarios automáticos basado en AIGC para viajeros perezosos', desc: 'Generación de planes de itinerario diario' },
    { title: 'Robot de predicción de tendencias de precios de vuelos y hoteles y bloqueo automático de precios bajos', desc: 'Modelo ML de predicción de tendencias de precios' },
    { title: 'Sistema de pre-revisión inteligente de documentos de visa y asistencia de llenado automatizado', desc: 'Verificación de integridad de información mediante OCR' },
    { title: 'Asistente de traducción por voz en tiempo real y traducción visual de menús para viajes al extranjero', desc: 'Traducción de voz sin conexión, OCR de imágenes de menús' },
    { title: 'Asistente de generación automática de diarios de viaje ilustrados y textos para redes sociales', desc: 'Extracción de información de fotos, generación de textos de diarios de viaje' }
  ],
  'emotion': [
    { title: 'Compañero virtual de compañía profunda 24 horas basado en modelos LLM', desc: 'Sistema de memoria que almacena el historial de conversaciones' },
    { title: 'Asesor de IA de reconocimiento emocional multimodal y orientación psicológica', desc: 'Análisis de tono de voz + reconocimiento de emociones en texto' },
    { title: 'Avatar digital de entrenamiento cognitivo y recuperación de memorias para personas con Alzheimer', desc: 'Juegos cognitivos de entrenamiento, fotografías antiguas que activan recuerdos' },
    { title: 'Entrenador de práctica social simulada con AIGC para personas con ansiedad social', desc: 'Simulación de escenarios sociales virtuales' },
    { title: 'Asistente de monitoreo del estado de ánimo las 24 horas y motivación emocional positiva con IA', desc: 'Análisis de tendencias emocionales y generación de contenido motivacional' }
  ],
  'entertainment': [
    { title: 'Motor de toma de decisiones autónoma para NPC de juegos de mundo abierto impulsado por LLM', desc: 'Árbol de comportamiento del NPC integrado con toma de decisiones LLM' },
    { title: 'Herramienta de deducción de tramas AIGC y asistencia de control de DM para juegos de misterio inmersivos', desc: 'Las elecciones de los jugadores activan ramas de la historia' },
    { title: 'Modificador generativo de finales de novelas interactivas', desc: 'Las elecciones del lector influyen en la dirección de la trama' },
    { title: 'Análisis visual CV y comentarista inteligente por IA de partidas de esports', desc: 'Análisis en tiempo real de la pantalla del juego' },
    { title: 'Sistema de generación automática de audiolibros con síntesis TTS multicolor', desc: 'Asignación de personajes del texto, generación de voces personalizadas' }
  ],
  'ecommerce': [
    { title: 'Herramienta de producción masiva de páginas de detalles de productos AIGC con alta tasa de conversión', desc: 'Generación de textos de puntos de venta y descripciones de escenarios' },
    { title: 'Fábrica de generación de videos de prueba de vestir y exhibición de modelos virtuales con IA', desc: 'Generación de efectos de prueba de vestir en modelos virtuales' },
    { title: 'Asistente de traducción y pulido localizado multilingüe con LLM para comercio electrónico transfronterizo', desc: 'Traducción multilingüe de descripciones de productos' },
    { title: 'Sistema de transmisión en vivo con avatares digitales AIGC las 24 horas', desc: 'Imagen digital + generación de guiones en tiempo real' },
    { title: 'Motor de análisis de tendencias de mercado por IA y predicción de productos exitosos', desc: 'Análisis de tendencias populares, recomendaciones de selección de productos' }
  ],
  'energy': [
    { title: 'Asesor de análisis del comportamiento de consumo eléctrico doméstico y estrategias de ahorro energético con IA', desc: 'Análisis de patrones de consumo, generación de recomendaciones de ahorro' },
    { title: 'Sistema de reconocimiento visual CV por dron de defectos en paneles fotovoltaicos', desc: 'Inspección con dron, análisis de imágenes termoinfrarrojas' },
    { title: 'Agente de predicción de tendencias de precios de mercado eléctrico al contado y estrategia automática de ganancias con IA', desc: 'Modelo de predicción de precios, generación de estrategias' },
    { title: 'Asistente de cálculo automático de emisiones de carbono en toda la cadena empresarial y generación de informes ESG con IA', desc: 'Cálculo de factores de emisión de carbono, generación de informes ESG' },
    { title: 'Sistema de predicción de carga ante clima extremo y comando de despacho de emergencia de la red eléctrica con IA', desc: 'Modelo de predicción de carga, generación de estrategias de despacho' }
  ],
  'av-media': [
    { title: 'Herramienta de identificación por IA de fragmentos destacados y edición automática de videos cortos a partir de videos largos', desc: 'Análisis del contenido del video, identificación de fotogramas clave' },
    { title: 'Asistente de separación inteligente de ruido de fondo y mejora de voz por IA en video', desc: 'Modelo de separación de audio, eliminación de ruido de fondo' },
    { title: 'Estación de trabajo de restauración 4K y colorización inteligente por IA de material audiovisual antiguo', desc: 'Modelo de superresolución de video, colorización automática por IA' },
    { title: 'Sistema de doblaje TTS de texto a voz de nivel realista y control emocional', desc: 'Modelo TTS multicolor, control emocional' },
    { title: 'Asistente de transcripción inteligente por IA y extracción de tareas pendientes de grabaciones de reuniones', desc: 'Separación y transcripción de voz en reuniones multilingües' }
  ],
  'ai-marketing': [
    { title: 'Motor de redacción automática AIGC de textos virales para Xiaohongshu (RED)', desc: 'Generación de textos de recomendación, optimización de emoji' },
    { title: 'Herramienta de diseño inteligente de pósters de marketing y adaptación a múltiples tamaños', desc: 'Emparejamiento inteligente de plantillas de pósters' },
    { title: 'Plataforma de generación creativa AIGC de LOGO de marca y construcción del sistema de identidad visual (VI)', desc: 'Generación creativa de LOGO, generación de normativas VI' },
    { title: 'Asistente de seguimiento de tendencias populares por IA y generación creativa de marketing oportunista', desc: 'Análisis de ángulos de marketing, generación de propuestas creativas' },
    { title: 'Asistente de generación creativa AIGC de guiones de videos cortos y guía de storyboards', desc: 'Generación de guiones y storyboards, sugerencias de filmación' }
  ],
  'data-intelligence': [
    { title: 'Herramienta de generación automática de sentencias SQL a partir de lenguaje natural', desc: 'Conversión de consultas en lenguaje natural a SQL' },
    { title: 'Sistema inteligente de inventario y clasificación de activos de datos empresariales', desc: 'Recopilación de metadatos, clasificación automática' },
    { title: 'Motor de detección automática de anomalías de calidad de datos y sugerencias de reparación', desc: 'Motor de reglas + modelos ML para detección de anomalías' },
    { title: 'Asistente de generación inteligente de informes y configuración de visualización', desc: 'Generación conversacional de configuraciones de informes' },
    { title: 'Asistente inteligente de preguntas y respuestas sobre definiciones de indicadores de datos', desc: 'Construcción de base de conocimiento basada en documentos de definición de indicadores' }
  ]
}

// Tabla de mapeo predefinida de recomendaciones
const recommendationMap = {
  // Punto de interés: Contenido creativo
  'creative-content': {
    'increase-efficiency': ['content', 'av-media', 'ai-marketing', 'entertainment'],
    'reduce-cost': ['content', 'ecommerce', 'ai-marketing'],
    'improve-experience': ['entertainment', 'emotion', 'travel', 'content'],
    'innovate-business': ['ai-marketing', 'content', 'av-media', 'entertainment']
  },
  // Punto de interés: Servicios técnicos
  'tech-service': {
    'increase-efficiency': ['programming', 'enterprise', 'data-intelligence', 'customer-service'],
    'reduce-cost': ['programming', 'enterprise', 'manufacturing'],
    'improve-experience': ['customer-service', 'enterprise', 'programming'],
    'innovate-business': ['data-intelligence', 'programming', 'security', 'enterprise']
  },
  // Punto de interés: Inteligencia de datos
  'data-intel': {
    'increase-efficiency': ['data-intelligence', 'finance', 'enterprise', 'manufacturing'],
    'reduce-cost': ['data-intelligence', 'manufacturing', 'energy'],
    'improve-experience': ['data-intelligence', 'customer-service', 'ecommerce'],
    'innovate-business': ['data-intelligence', 'finance', 'security', 'ai-marketing']
  },
  // Punto de interés: Servicio al usuario
  'user-service': {
    'increase-efficiency': ['customer-service', 'ecommerce', 'travel', 'enterprise'],
    'reduce-cost': ['customer-service', 'ecommerce', 'enterprise'],
    'improve-experience': ['customer-service', 'emotion', 'travel', 'ecommerce', 'entertainment'],
    'innovate-business': ['ecommerce', 'travel', 'emotion', 'entertainment']
  },
  // Punto de interés: Soluciones sectoriales
  'industry-solution': {
    'increase-efficiency': ['manufacturing', 'healthcare', 'finance', 'government'],
    'reduce-cost': ['manufacturing', 'energy', 'enterprise', 'finance'],
    'improve-experience': ['healthcare', 'education', 'government', 'travel'],
    'innovate-business': ['finance', 'security', 'legal', 'healthcare', 'government']
  }
}

const interestOptions = [
  { label: 'Generación de contenido creativo', value: 'creative-content', desc: 'Textos, imágenes, videos y otros contenidos creativos' },
  { label: 'Herramientas de servicios técnicos', value: 'tech-service', desc: 'Herramientas de desarrollo, automatización, asistencia de código' },
  { label: 'Análisis de inteligencia de datos', value: 'data-intel', desc: 'Análisis de datos, predicción, toma de decisiones inteligente' },
  { label: 'Experiencia de servicio al usuario', value: 'user-service', desc: 'Atención al cliente, marketing, experiencia de usuario' },
  { label: 'Soluciones sectoriales', value: 'industry-solution', desc: 'Aplicaciones profundas en industrias específicas' }
]

const purposeOptions = [
  { label: 'Mejorar la eficiencia', value: 'increase-efficiency', desc: 'Automatización, aceleración de procesos' },
  { label: 'Reducir costos', value: 'reduce-cost', desc: 'Reducción de personal, optimización de recursos' },
  { label: 'Mejorar la experiencia', value: 'improve-experience', desc: 'Satisfacción del usuario, calidad del servicio' },
  { label: 'Innovación empresarial', value: 'innovate-business', desc: 'Nuevos productos, nuevos modelos' }
]

const industries = [
  { key: 'manufacturing', name: 'Industria manufacturera', anchor: '#_1-industria-manufacturera' },
  { key: 'customer-service', name: 'Servicio al cliente inteligente', anchor: '#_2-servicio-al-cliente-inteligente' },
  { key: 'education', name: 'Sector educativo', anchor: '#_3-sector-educativo' },
  { key: 'programming', name: 'Programación inteligente', anchor: '#_4-programación-inteligente' },
  { key: 'healthcare', name: 'Sector salud', anchor: '#_5-sector-salud' },
  { key: 'security', name: 'Ciberseguridad', anchor: '#_6-ciberseguridad' },
  { key: 'finance', name: 'Gestión financiera, seguros y banca', anchor: '#_7-gestión-financiera-seguros-y-banca' },
  { key: 'enterprise', name: 'Servicios empresariales', anchor: '#_8-servicios-empresariales' },
  { key: 'content', name: 'Producción y gestión de contenido', anchor: '#_9-producción-y-gestión-de-contenido' },
  { key: 'government', name: 'Administración pública inteligente', anchor: '#_10-administración-pública-inteligente' },
  { key: 'legal', name: 'Asuntos legales y gestión de contratos', anchor: '#_11-asuntos-legales-y-gestión-de-contratos' },
  { key: 'travel', name: 'Turismo y servicios de viaje', anchor: '#_12-turismo-y-servicios-de-viaje' },
  { key: 'emotion', name: 'Acompañamiento emocional', anchor: '#_13-acompañamiento-emocional' },
  { key: 'entertainment', name: 'Entretenimiento y ocio', anchor: '#_14-entretenimiento-y-ocio' },
  { key: 'ecommerce', name: 'Servicios de comercio electrónico', anchor: '#_15-servicios-de-comercio-electrónico' },
  { key: 'energy', name: 'Energía', anchor: '#_16-energía' },
  { key: 'av-media', name: 'Audio y video', anchor: '#_17-audio-y-video' },
  { key: 'ai-marketing', name: 'Marketing con IA', anchor: '#_18-marketing-con-ia' },
  { key: 'data-intelligence', name: 'Inteligencia de datos', anchor: '#_19-inteligencia-de-datos' }
]

// Calcular resultados de recomendación - extracción aleatoria del grupo de temas
const recommendationTopics = computed(() => {
  if (!interestPoint.value || !purpose.value) return []
  
  const keys = recommendationMap[interestPoint.value]?.[purpose.value] || []
  const topics = []
  
  // Extraer 1-2 temas aleatoriamente de cada industria recomendada
  keys.forEach(key => {
    const industry = industries.find(item => item.key === key)
    const industryTopics = topicPool[key] || []
    
    if (industry && industryTopics.length > 0) {
      // Extraer 1-2 temas aleatoriamente
      const count = Math.floor(Math.random() * 2) + 1
      const shuffled = [...industryTopics].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(count, shuffled.length))
      
      selected.forEach(topic => {
        topics.push({
          ...topic,
          industryKey: key,
          industryName: industry.name,
          industryAnchor: industry.anchor
        })
      })
    }
  })
  
  // Ordenar aleatoriamente y limitar el total
  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

// Obtener descripción de la selección actual
const currentSelection = computed(() => {
  const interest = interestOptions.find(i => i.value === interestPoint.value)
  const pur = purposeOptions.find(p => p.value === purpose.value)
  return {
    interest: interest?.label || '',
    purpose: pur?.label || ''
  }
})

const scrollToAnchor = (anchor) => {
  // Retraso del desplazamiento para asegurar la actualización del DOM
  setTimeout(() => {
    // Intentar encontrar por ID (soporta múltiples formatos)
    let element = document.querySelector(anchor)
    
    // Si no se encuentra, intentar otros formatos de ID posibles
    if (!element) {
      // Intentar quitar el prefijo de guion bajo
      const altAnchor = anchor.replace('#_', '#')
      element = document.querySelector(altAnchor)
    }
    
    // Si aún no se encuentra, buscar por texto del título
    if (!element) {
      // Extraer el nombre de la industria del ancla
      const anchorText = decodeURIComponent(anchor.replace('#', '').replace(/^_/, ''))
      const headings = document.querySelectorAll('h2, h3')
      
      for (let heading of headings) {
        const headingText = heading.textContent.trim()
        // Coincidencia exacta o por inclusión
        const cleanHeading = headingText.replace(/^\d+\.\s*/, '')
        if (cleanHeading === anchorText || headingText.includes(anchorText)) {
          element = heading
          break
        }
      }
    }
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      // Resaltar la sección de destino
      element.style.backgroundColor = '#f0f9ff'
      element.style.transition = 'background-color 0.3s'
      element.style.padding = '8px'
      element.style.borderRadius = '4px'
      setTimeout(() => {
        element.style.backgroundColor = ''
        element.style.padding = ''
      }, 2000)
    }
  }, 100)
}

const resetSelection = () => {
  interestPoint.value = ''
  purpose.value = ''
}

// ---- C 端场景变量 ----
const cDuration = 'aprox. <strong>4 horas</strong>'

const vibePoint = ref('')
const feeling = ref('')

// Pool de temas por escenario: énfasis en sensación, ambiente y sugestión psicológica
const cTopicPool = {
  'lifestyle': [
    { title: 'Asistente de despertar con ritual matutino', desc: 'Genera rituales matutinos según clima, agenda y ánimo para empezar bien cada día' },
    { title: 'Creador de ambiente para vivir solo', desc: 'Diseña ambientes domésticos para quienes viven solos, con sugerencias de luz, música y aromas' },
    { title: 'Generador de planes reparadores de fin de semana en casa', desc: 'Recomienda la combinación perfecta según el ánimo: película + snacks + ambientación' },
    { title: 'Radio calmante antes de dormir', desc: 'Genera historias suaves y meditaciones guiadas como una radio privada para conciliar el sueño' },
    { title: 'Capturador de inspiración estética cotidiana', desc: 'Descubre belleza en lo cotidiano y genera sugerencias estéticas con sentido de ritual' }
  ],
  'emotion': [
    { title: 'Confidente nocturno', desc: 'Un espacio emocional disponible 24 horas, sin juicio, para recibir cualquier preocupación' },
    { title: 'Acompañante para sanar una ruptura', desc: 'Ofrece compañía amable, consejos de recuperación y salida emocional durante una ruptura' },
    { title: 'Coach de respiración contra la ansiedad', desc: 'Percibe la ansiedad y guía ejercicios de respiración y mindfulness' },
    { title: 'Mentor para reconstruir la confianza', desc: 'Ayuda a reconstruir identidad y valor personal con diálogo positivo y sugestión psicológica' },
    { title: 'Interpretación inteligente del diario emocional', desc: 'Analiza diarios emocionales, encuentra patrones y ofrece ideas y consejos cálidos' }
  ],
  'entertainment': [
    { title: 'DM inmersivo para juegos de misterio', desc: 'Actúa como anfitrión, crea suspense y hace avanzar la trama' },
    { title: 'NPC con alma en juegos de mundo abierto', desc: 'NPC con personalidad que recuerda historias del jugador y genera vínculos emocionales reales' },
    { title: 'Generación de podcasts personalizados', desc: 'Genera podcasts exclusivos según intereses, con naturalidad de conversación entre amigos' },
    { title: 'Equipo de ambiente para concierto virtual', desc: 'Crea sensación de directo en conciertos online con interacción, apoyo y ambiente en tiempo real' },
    { title: 'Compañero de cocreación de novela interactiva', desc: 'Crea historias junto con lectores; cada elección cambia el rumbo del mundo' }
  ],
  'growth': [
    { title: 'Testigo del crecimiento personal', desc: 'Registra la trayectoria de crecimiento y ofrece ánimo y revisión en hitos importantes' },
    { title: 'Coach gamificado de hábitos', desc: 'Convierte la formación de hábitos en una aventura divertida' },
    { title: 'Emparejador de compañeros para aprender habilidades', desc: 'Encuentra compañeros afines para supervisarse y compartir avances' },
    { title: 'Descubridor diario de pequeñas alegrías', desc: 'Ayuda a descubrir pequeños momentos bellos y cultivar gratitud y optimismo' },
    { title: 'Simulador de experiencias de vida', desc: 'Simula decisiones vitales y explora posibilidades de vidas paralelas' }
  ],
  'social': [
    { title: 'Generador de temas rompehielos', desc: 'Ofrece temas interesantes en situaciones sociales para reducir incomodidad y acercar personas' },
    { title: 'Redactor de ambiente para publicaciones sociales', desc: 'Genera textos con estilo según fotos y estado de ánimo' },
    { title: 'Planificador de ambiente para citas', desc: 'Diseña una experiencia completa de cita: lugar, conversación y sorpresa' },
    { title: 'Animador de reuniones remotas', desc: 'Activa reuniones online con juegos e interacción guiada' },
    { title: 'Asistente de gestión de energía social', desc: 'Ayuda a personas introvertidas a gestionar energía y encontrar un ritmo social cómodo' }
  ],
  'creative': [
    { title: 'Kit de emergencia contra el bloqueo creativo', desc: 'Aporta chispas inesperadas cuando aparece el bloqueo creativo' },
    { title: 'Guía de exploración del estilo personal', desc: 'Ayuda a descubrir un estilo propio, desde la ropa hasta la expresión' },
    { title: 'Asesor estético para journaling y diarios', desc: 'Sugiere maquetación, paletas y contenido creativo para diarios' },
    { title: 'Guía de composición y ambiente fotográfico', desc: 'Ofrece consejos de foto y edición según escena y sensación buscada' },
    { title: 'Emparejador de música y estado de ánimo', desc: 'Recomienda la combinación musical perfecta según ánimo y contexto' }
  ],
  'travel': [
    { title: 'Guía para paseos urbanos', desc: 'Explora la ciudad como una persona local y descubre lugares ocultos' },
    { title: 'Generador de diario emocional de viaje', desc: 'Convierte fotos y emociones de viaje en relatos y recuerdos bellos' },
    { title: 'Acompañante para viajar en solitario', desc: 'Ofrece compañía, consejos y seguridad para viajar solo' },
    { title: 'Vista previa del ambiente del destino', desc: 'Permite sentir el destino antes de salir y entrar en ambiente' },
    { title: 'Guía de ambiente para fotografía de viaje', desc: 'Ayuda a tomar fotos con historia según escena y luz' }
  ],
  'health': [
    { title: 'Activador de motivación deportiva', desc: 'Da el empujón justo cuando no apetece moverse' },
    { title: 'Cocina de inspiración saludable', desc: 'Genera recetas saludables y reparadoras según ánimo e ingredientes' },
    { title: 'Optimizador de ambiente para dormir mejor', desc: 'Crea un entorno de sueño de calidad desde lo ambiental hasta lo psicológico' },
    { title: 'Guía de conciencia corporal', desc: 'Guía la atención hacia señales del cuerpo y fortalece la conexión cuerpo-mente' },
    { title: 'Recordatorio de autocuidado', desc: 'Recuerda detenerse y cuidarse en medio del ajetreo' }
  ],
  'learning': [
    { title: 'Guía gamificada de exploración del conocimiento', desc: 'Convierte el aprendizaje aburrido en una aventura de exploración' },
    { title: 'Compañero situacional para aprender idiomas', desc: 'Interpreta roles distintos para aprender idioma de forma natural en diálogos' },
    { title: 'Asistente para satisfacer la curiosidad', desc: 'Responde ideas curiosas y alimenta la curiosidad por el mundo' },
    { title: 'Inspirador de notas de lectura', desc: 'Ayuda a ordenar reflexiones de lectura y encontrar nuevos ángulos' },
    { title: 'Creador de ambiente para compartir conocimiento', desc: 'Convierte lo aprendido en contenido interesante para compartir' }
  ],
  'relationship': [
    { title: 'Coach de comunicación para relaciones íntimas', desc: 'Ayuda a expresar emociones difíciles y mejorar relaciones cercanas' },
    { title: 'Asistente de cuidado familiar', desc: 'Recuerda cuidar a la familia y ofrece sugerencias de interacción cálida' },
    { title: 'Creador de ambiente para mantener amistades', desc: 'Ayuda a sostener amistades a distancia y crear temas comunes' },
    { title: 'Planificador de confesiones y sorpresas', desc: 'Diseña sorpresas y momentos románticos memorables para personas importantes' },
    { title: 'Guía para suavizar conflictos', desc: 'Ofrece consejos y frases para aliviar tensiones relacionales' }
  ],
  'pet': [
    { title: 'Diario antropomórfico de mascotas', desc: 'Genera diarios desde la perspectiva de la mascota y registra momentos cálidos' },
    { title: 'Intérprete del comportamiento animal', desc: 'Interpreta lenguaje conductual y profundiza el vínculo con la mascota' },
    { title: 'Planificador de tiempo de calidad con mascotas', desc: 'Diseña actividades creativas para interactuar y fortalecer el afecto' },
    { title: 'Generador de historias conmemorativas de mascotas', desc: 'Convierte fotos y recuerdos de la mascota en historias cálidas' },
    { title: 'Guía tranquila para nuevos cuidadores', desc: 'Ofrece compañía y orientación amable a nuevos dueños de mascotas' }
  ],
  'finance': [
    { title: 'Asistente de conciencia emocional del consumo', desc: 'Detecta emociones detrás de compras impulsivas y construye una visión saludable del consumo' },
    { title: 'Motivación visual para metas de ahorro', desc: 'Convierte metas de ahorro en progreso visual hacia sueños' },
    { title: 'Aprendizaje ligero de finanzas personales', desc: 'Enseña finanzas de manera ligera y entretenida' },
    { title: 'Aliviador de ansiedad financiera', desc: 'Ofrece apoyo emocional y consejos prácticos ante presión financiera' },
    { title: 'Juego de inversión de bajo monto', desc: 'Permite experimentar la inversión de forma gamificada y con menor barrera de entrada' }
  ],
  'career': [
    { title: 'Acompañante para la confusión profesional', desc: 'Escucha, explora y orienta durante etapas de duda profesional' },
    { title: 'Activador de sentido de logro laboral', desc: 'Ayuda a descubrir valor y sentido en el trabajo y reavivar entusiasmo' },
    { title: 'Asistente de ambiente social en el trabajo', desc: 'Propone temas ligeros y consejos de interacción para el entorno laboral' },
    { title: 'Generador de inspiración para proyectos paralelos', desc: 'Activa ideas de side projects según intereses y habilidades' },
    { title: 'Estación de confianza antes de entrevistas', desc: 'Ofrece preparación psicológica y ánimo antes de entrevistas' }
  ],
  'home': [
    { title: 'Diseñador de ambiente para el hogar', desc: 'Diseña ambientes domésticos según estado de ánimo y estación' },
    { title: 'Guía de transformación estacional del hogar', desc: 'Renueva la decoración por temporada para mantener frescura' },
    { title: 'Magia para espacios pequeños', desc: 'Hace que los espacios pequeños se sientan cómodos y cálidos' },
    { title: 'Creador de rituales domésticos', desc: 'Crea rituales para actividades cotidianas del hogar' },
    { title: 'Acompañamiento psicológico para decluttering', desc: 'Ofrece apoyo psicológico y consejos de decisión al ordenar objetos' }
  ],
  'food': [
    { title: 'Cocina reparadora para comer a solas', desc: 'Diseña comidas sencillas y reconfortantes para quienes viven solos' },
    { title: 'Diseño de ambiente para mesas festivas', desc: 'Diseña mesas con ritual para días especiales' },
    { title: 'Emparejador de cocina y estado de ánimo', desc: 'Recomienda alimentos y preparaciones según el ánimo actual' },
    { title: 'Generador de confianza para principiantes en cocina', desc: 'Ofrece ánimo cálido y recetas sencillas a quienes empiezan desde cero' },
    { title: 'Guía de ambiente para fotografía gastronómica', desc: 'Hace que la comida casera también se vea apetecible en fotos' }
  ],
  'fashion': [
    { title: 'Mood board del outfit de hoy', desc: 'Genera inspiración de vestimenta según clima, ocasión y ánimo' },
    { title: 'Estilista de armario cápsula', desc: 'Crea infinitas combinaciones con prendas limitadas' },
    { title: 'Viaje de exploración del estilo personal', desc: 'Ayuda a descubrir y construir un estilo personal único' },
    { title: 'Creativo para reinventar ropa antigua', desc: 'Da nueva inspiración para combinar ropa antigua' },
    { title: 'Asesor de look para ocasiones especiales', desc: 'Diseña looks que den confianza para momentos importantes' }
  ]
}

// Mapa predefinido de recomendaciones según ambiente y sensación
const cRecommendationMap = {
  // Ambiente: reparador
  'healing': {
    'relax': ['emotion', 'lifestyle', 'health', 'home'],
    'inspire': ['creative', 'growth', 'learning', 'entertainment'],
    'connect': ['relationship', 'social', 'pet', 'emotion'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Ambiente: crecimiento
  'growth': {
    'relax': ['growth', 'learning', 'creative', 'health'],
    'inspire': ['career', 'learning', 'creative', 'growth'],
    'connect': ['social', 'relationship', 'career', 'learning'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Ambiente: social
  'social': {
    'relax': ['social', 'pet', 'food', 'home'],
    'inspire': ['social', 'creative', 'entertainment', 'travel'],
    'connect': ['relationship', 'social', 'pet', 'travel'],
    'escape': ['social', 'travel', 'entertainment', 'creative']
  },
  // Ambiente: exploración
  'explore': {
    'relax': ['travel', 'creative', 'lifestyle', 'food'],
    'inspire': ['travel', 'creative', 'learning', 'entertainment'],
    'connect': ['travel', 'social', 'relationship', 'pet'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Ambiente: cotidiano
  'daily': {
    'relax': ['lifestyle', 'home', 'health', 'emotion'],
    'inspire': ['creative', 'food', 'fashion', 'home'],
    'connect': ['relationship', 'social', 'pet', 'lifestyle'],
    'escape': ['entertainment', 'creative', 'travel', 'lifestyle']
  }
}

const vibeOptions = [
  { label: 'Reparador', value: 'healing', desc: 'Cálido, calmante, sanador' },
  { label: 'Crecimiento', value: 'growth', desc: 'Progreso, avance, transformación' },
  { label: 'Social', value: 'social', desc: 'Conexión, compartir, interacción' },
  { label: 'Exploración', value: 'explore', desc: 'Curiosidad, aventura, descubrimiento' },
  { label: 'Cotidiano', value: 'daily', desc: 'Sencillo, real, presente' }
]

const feelingOptions = [
  { label: 'Quiero relajarme', value: 'relax', desc: 'Aliviar presión, despejar la mente' },
  { label: 'Busco inspiración', value: 'inspire', desc: 'Activar creatividad, encontrar ideas' },
  { label: 'Deseo conexión', value: 'connect', desc: 'Conectar con personas, resonar emocionalmente' },
  { label: 'Escapar por un momento', value: 'escape', desc: 'Salir de la realidad, vivir inmersión' }
]

const scenarios = [
  { key: 'lifestyle', name: 'Estilo de vida', anchor: '#_1-estilo-de-vida' },
  { key: 'emotion', name: 'Acompañamiento emocional', anchor: '#_2-acompañamiento-emocional' },
  { key: 'entertainment', name: 'Entretenimiento y ocio', anchor: '#_3-entretenimiento-y-ocio' },
  { key: 'growth', name: 'Crecimiento personal', anchor: '#_4-crecimiento-personal' },
  { key: 'social', name: 'Interacción social', anchor: '#_5-interacción-social' },
  { key: 'creative', name: 'Expresión creativa', anchor: '#_6-expresión-creativa' },
  { key: 'travel', name: 'Exploración de viajes', anchor: '#_7-exploración-de-viajes' },
  { key: 'health', name: 'Salud física y mental', anchor: '#_8-salud-física-y-mental' },
  { key: 'learning', name: 'Exploración del conocimiento', anchor: '#_9-exploración-del-conocimiento' },
  { key: 'relationship', name: 'Gestión de relaciones', anchor: '#_10-gestión-de-relaciones' },
  { key: 'pet', name: 'Acompañamiento de mascotas', anchor: '#_11-acompañamiento-de-mascotas' },
  { key: 'finance', name: 'Salud financiera', anchor: '#_12-salud-financiera' },
  { key: 'career', name: 'Desarrollo profesional', anchor: '#_13-desarrollo-profesional' },
  { key: 'home', name: 'Espacio del hogar', anchor: '#_14-espacio-del-hogar' },
  { key: 'food', name: 'Cocina y gastronomía', anchor: '#_15-cocina-y-gastronomía' },
  { key: 'fashion', name: 'Estilo y vestimenta', anchor: '#_16-estilo-y-vestimenta' }
]

// Calcula recomendaciones tomando elementos aleatorios del pool de temas
const cRecommendationTopics = computed(() => {
  if (!vibePoint.value || !feeling.value) return []
  
  const keys = cRecommendationMap[vibePoint.value]?.[feeling.value] || []
  const topics = []
  
  // Toma aleatoriamente 1-2 temas de cada escenario recomendado
  keys.forEach(key => {
    const scenario = scenarios.find(item => item.key === key)
    const scenarioTopics = cTopicPool[key] || []
    
    if (scenario && scenarioTopics.length > 0) {
      // Toma aleatoriamente 1-2 temas
      const count = Math.floor(Math.random() * 2) + 1
      const shuffled = [...scenarioTopics].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(count, shuffled.length))
      
      selected.forEach(topic => {
        topics.push({
          ...topic,
          scenarioKey: key,
          scenarioName: scenario.name,
          scenarioAnchor: scenario.anchor
        })
      })
    }
  })
  
  // Orden aleatorio y límite total
  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

// Obtiene la descripción de la selección actual
const cCurrentSelection = computed(() => {
  const vibe = vibeOptions.find(i => i.value === vibePoint.value)
  const feel = feelingOptions.find(p => p.value === feeling.value)
  return {
    vibe: vibe?.label || '',
    feeling: feel?.label || ''
  }
})

const cScrollToAnchor = (anchor) => {
  // Retrasa el desplazamiento para asegurar que el DOM esté actualizado
  setTimeout(() => {
    // Intenta buscar por ID (soporta varios formatos)
    let element = document.querySelector(anchor)
    
    // Si no se encuentra, prueba otros formatos posibles
    if (!element) {
      // Intenta quitar el prefijo de guion bajo
      const altAnchor = anchor.replace('#_', '#')
      element = document.querySelector(altAnchor)
    }
    
    // Si aún no se encuentra, busca por texto del encabezado
    if (!element) {
      // Extrae el nombre del escenario desde el ancla
      const anchorText = decodeURIComponent(anchor.replace('#', '').replace(/^_/, ''))
      const headings = document.querySelectorAll('h2, h3')
      
      for (let heading of headings) {
        const headingText = heading.textContent.trim()
        // Coincidencia exacta o parcial
        const cleanHeading = headingText.replace(/^\d+\.\s*/, '')
        if (cleanHeading === anchorText || headingText.includes(anchorText)) {
          element = heading
          break
        }
      }
    }
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      // Resalta el bloque de destino
      element.style.backgroundColor = '#fdf2f8'
      element.style.transition = 'background-color 0.3s'
      element.style.padding = '8px'
      element.style.borderRadius = '4px'
      setTimeout(() => {
        element.style.backgroundColor = ''
        element.style.padding = ''
      }, 2000)
    }
  }, 100)
}

const cResetSelection = () => {
  vibePoint.value = ''
  feeling.value = ''
}
</script>

# Referencia de escenarios de aplicacion de IA (B2B y B2C)

<Tabs>
<TabItem label="B2B Industrial">

## Guía del capítulo

<ChapterIntroduction :duration="duration" :tags="['Aplicaciones B2B', 'Aplicaciones industriales', 'Escenarios de IA', 'Referencia de implementación', 'Soluciones sectoriales']" coreOutput="Conocer más de 15 escenarios de aplicación B2B por industria" expectedOutput="Encontrar la dirección de proyecto adecuada para clientes empresariales">

Este documento recopila las <strong>aplicaciones prácticas de los modelos LLM en escenarios empresariales B2B</strong>. A diferencia del enfoque B2C centrado en la experiencia del usuario y las emociones, los productos B2B se centran más en <strong>resolver necesidades reales del negocio, mejorar la eficiencia y reducir costos</strong>. Cada escenario cuenta con <strong>viabilidad real de implementación</strong>, abarcando desde el <strong>análisis de requisitos hasta la implementación técnica</strong>, sirviendo como referencia para desarrolladores de aplicaciones de IA orientadas a clientes empresariales.

</ChapterIntroduction>

## Selección rápida de dirección sectorial

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #409EFF;">
  <div style="font-weight: 600; margin-bottom: 8px;">Encuentra el escenario de aplicación adecuado para ti</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    Selecciona tu área de interés y el objetivo que deseas alcanzar. El sistema recomendará escenarios sectoriales relevantes. Haz clic en las etiquetas para saltar al capítulo correspondiente.
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="interestPoint" placeholder="Seleccionar área de interés" style="width: 100%;">
        <el-option 
          v-for="item in interestOptions" 
          :key="item.value" 
          :label="item.label" 
          :value="item.value">
          <div style="display: flex; flex-direction: column;">
            <span>{{ item.label }}</span>
            <span style="font-size: 12px; color: #909399;">{{ item.desc }}</span>
          </div>
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-select v-model="purpose" placeholder="Seleccionar objetivo" style="width: 100%;">
        <el-option 
          v-for="item in purposeOptions" 
          :key="item.value" 
          :label="item.label" 
          :value="item.value">
          <div style="display: flex; flex-direction: column;">
            <span>{{ item.label }}</span>
            <span style="font-size: 12px; color: #909399;">{{ item.desc }}</span>
          </div>
        </el-option>
      </el-select>
    </el-col>
  </el-row>
  
  <!-- Visualización de resultados de recomendación - formato de tabla -->
  <div v-if="recommendationTopics.length > 0" style="margin-top: 16px;">
    <div style="font-weight: 600; margin-bottom: 10px; color: #409EFF;">
      Se recomiendan {{ recommendationTopics.length }} escenarios de aplicación para ti
      <span style="font-weight: normal; color: #909399; font-size: 13px; margin-left: 8px;">
        ({{ currentSelection.interest }} + {{ currentSelection.purpose }})
      </span>
    </div>
    <el-table 
      :data="recommendationTopics" 
      style="width: 100%; cursor: pointer;"
      @row-click="(row) => scrollToAnchor(row.industryAnchor)"
      highlight-current-row>
      <el-table-column prop="title" label="Escenario de aplicación" min-width="300">
        <template #default="scope">
          <div style="font-weight: 500; color: #303133;">{{ scope.row.title }}</div>
          <div style="font-size: 12px; color: #909399; margin-top: 4px;">{{ scope.row.desc }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="industryName" label="Industria" width="180" align="center">
        <template #default="scope">
          <el-tag type="info" effect="light" size="small">{{ scope.row.industryName }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px; font-size: 12px; color: #909399;">
      Haz clic en cualquier fila de la tabla para saltar al capítulo de la industria correspondiente
    </div>
  </div>
  
  <!-- Mensaje cuando la selección está incompleta -->
  <div v-else-if="!interestPoint || !purpose" style="margin-top: 14px; color: #909399; font-size: 13px;">
    <span v-if="!interestPoint && !purpose">Selecciona un área de interés y un objetivo</span>
    <span v-else-if="!interestPoint">Selecciona un área de interés</span>
    <span v-else>Selecciona un objetivo</span>
  </div>
  
  <!-- Botón de restablecimiento -->
  <div v-if="interestPoint || purpose" style="margin-top: 12px;">
    <el-button size="small" @click="resetSelection">Restablecer selección</el-button>
  </div>
</el-card>

## Introducción rápida a las industrias

### Tecnologías principales

En el desarrollo de aplicaciones de IA, las direcciones tecnológicas comunes incluyen:

1. **LLM (Grandes modelos de lenguaje)**: Especializados en procesar tareas de lenguaje natural, como diálogo, generación de texto, resumen, traducción, etc., adecuados para construir aplicaciones de atención al cliente inteligente, creación de contenido, preguntas y respuestas de conocimiento.
2. **VLM (Modelos de lenguaje visual)**: Combinan comprensión visual y capacidades lingüísticas, permitiendo descripción de imágenes, preguntas y respuestas visuales, generación de contenido multimodal, etc., aplicables a escenarios como análisis de imágenes médicas, control de calidad industrial y diseño creativo.
3. **GenAI (IA generativa)**: Incluye generación de texto, generación de imágenes (como Stable Diffusion, DALL·E), generación de video, etc., capaz de generar contenido creativo rápidamente, aplicable a áreas como diseño asistido, producción de materiales de marketing y educación.

### Estrategia de selección

Los aprendices pueden elegir la dirección de aplicación adecuada según las siguientes dimensiones:

1. **Orientación por interés**: Priorizar la industria o dirección tecnológica que más les interese para mantener la motivación de aprendizaje. Por ejemplo:
   - Interés en diseño creativo: probar aplicaciones de producción de contenido o diseño industrial
   - Interés en desafíos técnicos: probar aplicaciones en ciberseguridad o sector salud
   - Interés en impacto social: probar aplicaciones en administración pública inteligente o educación

2. **Adaptación sectorial**: Combinar el trasfondo sectorial propio o las ventajas de recursos para elegir escenarios:
   - Profesionales de la industria manufacturera: considerar primero aplicaciones de fabricación industrial o servicios empresariales
   - Educadores: priorizar aplicaciones del sector educativo o producción de contenido
   - Profesionales de la salud: explorar aplicaciones del sector salud o gestión de la salud

3. **Dificultad técnica**: Elegir el nivel adecuado de complejidad según la base técnica propia:
   - Nivel inicial: servicio al cliente inteligente, creación de contenido, sistemas simples de preguntas y respuestas
   - Nivel intermedio: control de calidad industrial, análisis de imágenes médicas, asistente de código inteligente
   - Nivel profesional: control de riesgos financieros, ciberseguridad, aplicaciones multimodales complejas

## 1. Industria manufacturera 

Los escenarios de la industria manufacturera se centran principalmente en tres direcciones: asistencia al diseño, optimización de la producción y mantenimiento inteligente. Las aplicaciones comunes incluyen la utilización de IA para asistir el diseño de productos, la revisión automatizada de planos, la generación inteligente de documentación técnica, el diagnóstico de fallos en equipos industriales, etc., capaces de mejorar significativamente la eficiencia del diseño y reducir los costos de mantenimiento.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Plataforma de diseño asistido por IA para exteriores de autobuses de nueva energía | Diseño conceptual de exteriores basado en modelos de generación de imágenes, combinado con LLM para verificación de normativas de diseño e iteración creativa; integración de renderizado 3D con Three.js |
| 2 | Asistente inteligente de diseño y revisión de planos técnicos | Construcción de una base de conocimiento de normativas de diseño empresarial mediante tecnología RAG, DALL·E genera imágenes de referencia para facilitar la comprensión; integración con API de CAD para análisis automatizado de planos |
| 3 | Generación y gestión automatizada de documentación técnica | Generación automática de especificaciones de productos y manuales de operación a partir de la base de datos del producto mediante LLM, ChromaDB almacena documentos históricos para búsqueda inteligente |
| 4 | Asistente de generación automática de informes de inspección de equipos de producción | El personal de inspección describe el estado del equipo por voz, LLM genera informes de inspección estructurados; asociación automática con registros históricos de fallos |
| 5 | Sistema inteligente de despacho y planificación de rutas para carretillas elevadoras en fábrica | LLM analiza tareas de pedidos y ubicaciones del almacén, combinado con API de mapas para generar el plan de despacho óptimo |
| 6 | Almacén de datos basado en recuperación de información LLM | Tecnología Text-to-SQL para convertir lenguaje natural en consultas a bases de datos, Superset para visualización de resultados; Doris o ClickHouse como motor OLAP |
| 7 | Asistente de preguntas y respuestas sobre diagnóstico de fallos en equipos industriales | Construcción de una base de conocimiento vectorial basada en casos históricos de fallos, LLM proporciona recomendaciones de diagnóstico y soluciones según la descripción del fallo |
| 8 | Generación inteligente de informes de control de calidad y clasificación de defectos en producción | OCR identifica defectos en fotografías de control de calidad, LLM genera informes de control de calidad estructurados; clasificación automática de tipos y gravedad de defectos |
| 9 | Asistente inteligente de inventario y generación de informes de recuento | Ingreso de datos de recuento, LLM compara automáticamente con el inventario del sistema y genera informe de diferencias; alerta de inventario anómalo |
| 10 | Sistema inteligente de preguntas y respuestas sobre optimización de procesos de producción | Construcción de base de conocimiento RAG basada en documentos de procesos de producción, LLM proporciona recomendaciones de optimización según problemas de producción |

## 2. Servicio al cliente inteligente

Los escenarios de servicio al cliente inteligente se centran en la mejora de la eficiencia del servicio al cliente y la optimización de la experiencia del usuario. Las aplicaciones típicas abarcan la integración multicanal, la generación de respuestas inteligentes, el análisis de emociones de los clientes, el procesamiento automatizado de tickets, etc., ayudando a las empresas a lograr servicio al cliente 24/7.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Sistema de respuesta automática y generación de tickets de servicio al cliente multicanal inteligente | Integración de mensajes de múltiples canales (WeChat, APP, sitio web, etc.), LLM comprende la intención y genera respuestas creando tickets automáticamente; uso de LangChain para construir el flujo de conversación, MySQL para almacenar datos de tickets |
| 2 | Asistente de prospección y seguimiento de clientes potenciales | LLM analiza registros históricos de conversaciones de servicio al cliente, identifica características de clientes con alta intención de compra y los puntúa; sistema de recomendación combinado con algoritmos de filtrado colaborativo |
| 3 | Sistema inteligente de búsqueda y respuestas del conocimiento interno empresarial | Construcción de base de conocimiento vectorial basada en Confluence y documentos internos, LLM combinado con tecnología RAG para generar respuestas |
| 4 | Sistema de encuestas de satisfacción del cliente y gestión de mejora del servicio | LLM analiza automáticamente el contenido de las conversaciones de servicio al cliente para clasificación de sentimientos y puntuación de satisfacción; informes BI muestran los resultados del análisis |
| 5 | Herramienta de resumen inteligente de conversaciones y generación de tickets de servicio | Tras finalizar la conversación, LLM genera automáticamente un resumen de la sesión y extrae información clave; llenado automático de campos del ticket |
| 6 | Asistente de detección automática de conformidad de guiones de servicio al cliente | El agente ingresa el contenido de respuesta, LLM detecta en tiempo real la conformidad del guion y palabras sensibles; proporciona sugerencias de modificación |
| 7 | Herramienta de resumen automático y clasificación de tickets de servicio al cliente | LLM genera resúmenes y clasificación automática de etiquetas a partir de registros de conversaciones largas; Elasticsearch soporta búsqueda de texto completo en tickets |
| 8 | Herramienta de monitoreo de emociones del cliente y alerta de anomalías | Análisis en tiempo real de características de tono de voz y emociones en texto, LLM identifica emociones anómalas y activa alertas; notificaciones de alerta por WebSocket |
| 9 | Sistema de base de conocimiento de guiones ganadores del servicio al cliente | LLM analiza casos de conversación excelentes de agentes, extrae plantillas de guiones ganadores; sistema de recomendación sugiere guiones en tiempo real según el contexto de la conversación |
| 10 | Asistente de análisis de contenido de llamadas salientes y control de calidad | Tras la transcripción de grabaciones de llamadas salientes, LLM analiza el contenido de la conversación para extraer información clave; generación automática de informes de control de calidad y sugerencias de mejora |

## 3. Sector educativo

Los escenarios del sector educativo buscan lograr una enseñanza personalizada y una gestión educativa inteligente. Las aplicaciones centrales incluyen planificación inteligente de rutas de aprendizaje, corrección automatizada de tareas, generación de planes de clase, análisis del rendimiento académico, etc., promoviendo la optimización de la asignación de recursos educativos y la enseñanza adaptada a las capacidades de cada estudiante.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Sistema de planificación de rutas de aprendizaje de idiomas personalizado y tutoría inteligente | LLM evalúa el nivel actual del aprendiz, planifica tareas de estudio diarias según los objetivos de aprendizaje; algoritmo de recomendación combinado con grafo de conocimiento para recomendar recursos de aprendizaje |
| 2 | Plataforma de elaboración automatizada de planes de clase y recomendación de recursos educativos | LLM genera la estructura del plan de clase y el diseño didáctico según el programa de estudios; base de conocimiento vectorial almacena planes de clase y materiales de calidad, soportando búsqueda por palabras clave y recomendaciones similares |
| 3 | Sistema de corrección automatizada de tareas y análisis diagnóstico del rendimiento | LLM corrige automáticamente preguntas subjetivas y genera sugerencias de corrección, el grafo de conocimiento identifica los puntos débiles de conocimiento del estudiante |
| 4 | Construcción de modelos de competencias laborales y mapas de aprendizaje | LLM analiza las descripciones de puestos para extraer requisitos de competencias, construyendo perfiles de competencias laborales; generación de mapas de aprendizaje personalizados según las brechas identificadas |
| 5 | Sistema de construcción del currículo escolar y herramientas de elaboración de materiales didácticos | LLM analiza las características de la escuela y las necesidades de los estudiantes, genera la estructura del currículo escolar; integración con API de generación de PPT para crear automáticamente materiales |
| 6 | Práctica conversacional individualizada de idiomas extranjeros en escenarios simulados | LLM asume diferentes roles para practicar conversaciones orales, ASR reconoce la pronunciación y la puntúa; TTS genera ejemplos de pronunciación estándar |
| 7 | Plataforma de recomendación basada en big data para selección de carreras universitarias y orientación profesional | LLM analiza información del estudiante como puntuaciones, clasificaciones e intereses, combinado con datos de admisión para recomendar universidades y carreras |
| 8 | Asistente de programación para niños | LLM explica la lógica del código y proporciona orientación de programación, soportando alternancia entre lenguajes por bloques y Python |
| 9 | Herramienta de generación automática de mapas mentales de conceptos y recomendación de rutas de aprendizaje | Ingreso del tema del curso, LLM genera automáticamente mapas mentales de conceptos; recomendación del siguiente contenido de estudio según el progreso |
| 10 | Motor de calificación y corrección automatizada de redacciones en chino e inglés | LLM califica desde múltiples dimensiones (temática, estructura, lenguaje, diversidad) y genera comentarios; comparación con redacciones modelo destacadas |

## 4. Programación inteligente

Los escenarios de programación inteligente buscan mejorar la eficiencia del desarrollo y la calidad del código. Las aplicaciones típicas incluyen autocompletado inteligente de código, reparación automática de bugs, generación automatizada de pruebas, conversión de código, etc., permitiendo a los desarrolladores centrarse en la lógica del negocio en lugar de tareas de codificación repetitivas.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Asistente de autocompletado de código inteligente y reparación automática de bugs | Modelo de código ajustado basado en CodeLlama, plugin de IDE que ofrece sugerencias de autocompletado en tiempo real; LLM analiza el stack de errores para localizar automáticamente bugs y generar código de corrección |
| 2 | Plataforma de construcción de aplicaciones low-code y automatización de flujos | El usuario describe los requisitos en lenguaje natural, LLM los convierte en configuración low-code o framework de código |
| 3 | Sistema de generación de casos de prueba unitarios | Análisis AST del código fuente para extraer la lógica de funciones, LLM genera casos de prueba con condiciones límite y escenarios de excepción; integración con Jest/Pytest para ejecutar pruebas |
| 4 | Herramienta de análisis inteligente de código y migración entre lenguajes | Análisis de la estructura del código basado en Tree-sitter, LLM analiza la calidad del código y proporciona sugerencias de optimización; combinación con motor de reglas para conversión entre lenguajes |
| 5 | Herramienta de generación automática de sentencias SQL a partir de lenguaje natural | LLM convierte consultas en lenguaje natural a SQL, soportando uniones complejas de múltiples tablas y consultas de agregación |
| 6 | Plataforma de pruebas automatizadas de API y generación de documentación | LLM analiza comentarios del código y definiciones de interfaces, genera automáticamente casos de prueba y documentación de API; integración con Postman para ejecución de pruebas |
| 7 | Herramienta inteligente de grabación y mantenimiento de scripts de pruebas UI | Plugin del navegador que graba las operaciones del usuario, LLM analiza la intención de las operaciones para generar scripts de prueba; IA repara localizadores obsoletos |
| 8 | Análisis de registros del sistema y localización de fallos | ELK Stack recopila datos de registros, LLM analiza registros anómalos para extraer información clave y localizar la causa raíz; recomendación de soluciones de reparación |
| 9 | Herramienta de generación automática de código de interfaz de usuario (UI) | Imágenes de diseño reconocidas por OCR para identificar la estructura de layout, LLM genera CSS responsivo y código de componentes; integración con TailwindCSS para soportar múltiples frameworks de estilos |
| 10 | Asistente de diseño inteligente y modelado de estructura de base de datos | Documentos de requisitos del negocio ingresados a LLM, generación automática de diagramas ER y estructuras de tablas; soporte de exportación de scripts DDL para MySQL/PostgreSQL |

## 5. Sector salud

Los escenarios del sector salud buscan mejorar la eficiencia diagnóstica y la calidad de los servicios médicos. Las aplicaciones comunes incluyen generación automatizada de historiales clínicos, preguntas y respuestas sobre conocimiento médico, análisis asistido de imágenes, soporte a la investigación farmacológica, etc., promoviendo la transformación inteligente del sector de la salud.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Asistente inteligente de interpretación de informes de análisis clínicos | Carga de imágenes de informes de análisis, OCR identifica indicadores clave, LLM interpreta valores anómalos y genera explicaciones en lenguaje sencillo |
| 2 | Experto en consultas de salud basado en tecnología de búsqueda de conocimiento | Construcción de un grafo de conocimiento médico (ICD-10, prospectos de medicamentos, guías clínicas), búsqueda RAG para generar respuestas |
| 3 | Plataforma de análisis de decisión de datos de investigación clínica | Integración de datos EMR y resultados de análisis, LLM asiste en la generación de código de análisis estadístico y gráficos de visualización; soporte para estudios de cohorte y análisis de supervivencia |
| 4 | Sistema inteligente de generación de preguntas de examen médico y análisis de errores | Ingreso de capítulos de libros de texto y puntos de conocimiento, LLM genera preguntas de práctica y explicaciones; registro automático de errores y generación de análisis de puntos débiles |
| 5 | Experto en preguntas y respuestas del grafo de conocimiento del proceso completo de investigación farmacológica | Construcción de un grafo de conocimiento fármaco-diana-enfermedad, LLM responde preguntas relacionadas con investigación; soporte para búsqueda bibliográfica y recomendación de protocolos experimentales |
| 6 | Asistente inteligente de preguntas y respuestas sobre prospectos de medicamentos | Carga de imágenes de prospectos o ingreso del nombre del medicamento, LLM responde preguntas sobre dosificación, efectos adversos, precauciones, etc. |
| 7 | Asistente de generación de artículos de divulgación sobre enfermedades | Ingreso del nombre de la enfermedad y la audiencia, LLM genera artículos de divulgación accesibles; soporte de múltiples versiones (versión para pacientes/versión para familiares) |
| 8 | Herramienta de generación automática de informes de imágenes médicas | El radiólogo describe las características de las imágenes, LLM genera automáticamente un informe estructurado; soporte de plantillas para tipos comunes de exámenes |
| 9 | Asistente de generación y archivo inteligente de registros quirúrgicos | Grabación por voz de pasos clave durante la cirugía, LLM genera registros quirúrgicos estructurados; asociación automática con códigos quirúrgicos |
| 10 | Asistente inteligente de recordatorio de medicación para enfermedades crónicas | El paciente ingresa su lista de medicamentos, LLM genera recordatorios de medicación personalizados; soporte de verificación de contraindicaciones y preguntas y respuestas interactivas |

## 6. Ciberseguridad

Los escenarios de ciberseguridad se centran en la protección de seguridad y el control de riesgos. Las aplicaciones centrales abarcan detección de vulnerabilidades, análisis de inteligencia sobre amenazas, identificación de correos de phishing, respuesta a incidentes de seguridad, etc., construyendo un sistema integral de protección de seguridad inteligente para las empresas.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Motor de detección y reparación de vulnerabilidades de seguridad en código | Herramienta de análisis estático de código (SAST) escanea el código, LLM analiza los principios de las vulnerabilidades y genera sugerencias de reparación; integración con pipeline CI/CD |
| 2 | Sistema inteligente de identificación e interceptación de correos de phishing generados por IA | LLM analiza el contenido del correo, las características del remitente y la seguridad de los enlaces, identifica correos de phishing generados por IA; integración con la pasarela de correo para interceptar en tiempo real |
| 3 | Asistente de generación automática de informes diarios de operaciones de seguridad | Resumen de registros de dispositivos de seguridad, LLM extrae automáticamente eventos clave y genera informes diarios; marcado highlight de eventos anómalos |
| 4 | Asistente inteligente de preguntas y respuestas de la base de conocimiento de seguridad | Construcción de base de conocimiento vectorial basada en documentos de seguridad y la base CVE, LLM responde preguntas sobre técnicas de seguridad y procedimientos de respuesta |
| 5 | Asistente de generación inteligente de informes de pruebas de penetración | Tras completar la prueba de penetración, LLM genera automáticamente el informe según la descripción de vulnerabilidades; generación masiva de sugerencias de reparación |
| 6 | Protección contra código malicioso y monitoreo de cumplimiento de privacidad | Análisis en sandbox del comportamiento de archivos sospechosos, LLM identifica características maliciosas y genera firmas; escaneo de identificación de datos privados |
| 7 | Herramienta de generación de listas de verificación de configuración de seguridad | Ingreso del tipo de sistema objetivo, LLM genera listas de verificación de configuración de seguridad; soporte de estándares como MLPS 2.0, CIS, etc. |
| 8 | Asistente de consulta y análisis inteligente de inteligencia sobre amenazas | Conexión con múltiples fuentes de inteligencia sobre amenazas (código abierto, comerciales), LLM interpreta la inteligencia y la relaciona con los activos empresariales; recomendación de estrategias de protección |
| 9 | Asistente de generación de informes de revisión post-incidente de seguridad | Tras un incidente de seguridad, LLM genera automáticamente un informe de revisión según la línea de tiempo; análisis de causa raíz y sugerencias de mejora |
| 10 | Centro de monitoreo y alerta temprana de inteligencia sobre amenazas global | Rastreo web de información de seguridad global y divulgación de vulnerabilidades, LLM extrae información clave y evalúa el impacto; notificaciones de alerta por correo/SMS |

## 7. Gestión financiera, seguros y banca

Los escenarios del sector financiero se centran en el control de riesgos y la inteligencia empresarial. Las aplicaciones típicas incluyen evaluación de riesgos crediticios, asesor de gestión patrimonial, generación de informes financieros, monitoreo contra el blanqueo de capitales, etc., mejorando la eficiencia operativa y la capacidad de gestión de riesgos de las instituciones financieras.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Asistente de generación inteligente de informes de debida diligencia crediticia | Ingreso de información básica de la empresa y datos financieros, LLM genera automáticamente el informe de debida diligencia crediticia; marcado automático de puntos de riesgo |
| 2 | Asesor inteligente de gestión de patrimonio bancario privado | LLM analiza el perfil de riesgo y los objetivos financieros del cliente, genera recomendaciones de asignación de activos; integración con productos financieros y base de fondos |
| 3 | Asistente de generación inteligente y verificación de cumplimiento de prospectos de IPO | Plantillas modulares del prospecto de oferta, LLM llena automáticamente la descripción del negocio y los factores de riesgo; motor de reglas de verificación de cumplimiento para comprobar la consistencia entre secciones |
| 4 | Sistema de generación automática de informes financieros y alerta de anomalías operativas | Recopilación automática de datos del sistema financiero, LLM genera la sección de análisis financiero y discusión de la dirección; reglas de alerta para indicadores anómalos |
| 5 | Asistente de extracción de información y preguntas y respuestas sobre facturas y recibos financieros | Carga de imágenes de facturas, OCR reconoce la información, LLM responde preguntas relacionadas con los documentos; soporte para facturas de IVA, billetes de tren, etc. |
| 6 | Asistente de búsqueda inteligente y preguntas y respuestas sobre casos regulatorios | Construcción de base de conocimiento basada en casos de sanciones regulatorias, LLM responde preguntas de cumplimiento y proporciona referencias de casos |
| 7 | Entrenador inteligente de guiones para agentes de seguros | LLM asume el papel de diferentes tipos de clientes para simular conversaciones, evalúa la conformidad y la persuasión del guion del agente; análisis de transcripción de grabaciones |
| 8 | Plataforma de análisis de cláusulas de pólizas de seguros y comparación con la competencia | Análisis estructurado de cláusulas, LLM genera resúmenes de puntos destacados y precauciones |
| 9 | Servicio de reconocimiento de emociones en conversaciones con clientes | Reconocimiento de emociones por voz combinado con detección de conformidad del guion, retroalimentación en tiempo real de sugerencias de mejora para el agente |
| 10 | Asistente de consulta inteligente del progreso de reclamaciones de seguros y diálogo | El usuario ingresa el número de póliza o de denuncia, LLM consulta el progreso de la reclamación y responde preguntas relacionadas |

## 8. Servicios empresariales

Los escenarios de servicios empresariales buscan mejorar la eficiencia operativa y el nivel de gestión organizacional. Las aplicaciones comunes incluyen gestión de relaciones con clientes, predicción de ventas, monitoreo de reputación, gestión inteligente de RRHH, etc., ayudando a las empresas a lograr su transformación digital.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Plataforma de análisis de retención de clientes y alerta temprana de pérdida | Recopilación de datos de comportamiento mediante tracking de usuarios, modelo ML predice la probabilidad de pérdida, LLM genera sugerencias de retención |
| 2 | Plataforma de prospección y correo de marketing B2B | Filtrado de clientes objetivo a partir de datos empresariales, LLM genera contenido de marketing personalizado; integración con plataforma de envío masivo de correos |
| 3 | Plataforma de monitoreo de pipeline de ventas y predicción de resultados | Recopilación automática de datos de CRM, LLM analiza el embudo de ventas y predice el cumplimiento de objetivos; alertas de anomalías para los gerentes |
| 4 | Radar de monitoreo de reputación de marca y alerta temprana de crisis | Recopilación de datos de opinión pública de toda la web (redes sociales, noticias, foros), LLM analiza sentimientos y tendencias de propagación; alertas de crisis |
| 5 | Asistente inteligente de redacción de correos profesionales y gestión de la comunicación emocional | Comprensión del contexto del correo, LLM genera borradores de correos profesionales; análisis de emociones con retroalimentación de sugerencias de mejora |
| 6 | Sistema de análisis inteligente de currículums y emparejamiento con puestos | Análisis de PDF de currículums para extraer información clave, LLM empareja con puestos adecuados y genera sugerencias de entrevista; integración con sistemas ATS |
| 7 | Guía de incorporación y asistente de preguntas y respuestas para nuevos empleados | Búsqueda RAG en base de conocimiento de documentos de incorporación, LLM responde preguntas frecuentes de los nuevos empleados |
| 8 | Plataforma de retroalimentación de desempeño y gestión de objetivos OKR | Recopilación de datos del sistema OKR, LLM analiza el cumplimiento de objetivos y genera sugerencias de retroalimentación; recopilación de feedback 360° |
| 9 | Registro inteligente de reuniones y gestión de tareas pendientes | Transcripción de grabaciones de reuniones, LLM extrae puntos clave de discusión y tareas pendientes; creación automática de tareas en el sistema de gestión |
| 10 | Reconocimiento de facturas y procesamiento automatizado de reembolsos | OCR reconoce la información de las facturas, verificación automática de autenticidad y cumplimiento de políticas de reembolso; integración con el sistema financiero |

## 9. Producción y gestión de contenido

Los escenarios de producción y gestión de contenido se centran en la generación creativa y la gestión de tráfico. Las aplicaciones centrales incluyen creación de textos, producción de videos cortos, transmisión en vivo con avatares digitales, optimización SEO, etc., ayudando a las empresas a mejorar la eficiencia de producción de contenido y las tasas de conversión de marketing.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Plataforma de asistencia creativa para contenido de cine y televisión y novelas | LLM proporciona asistencia creativa como sinopsis, desarrollo de personajes, generación de diálogos; mapas mentales para visualizar la estructura de la historia |
| 2 | Asistente de redacción inteligente de historias de marca y artículos de relaciones públicas | Ingreso de palabras clave de marca e información del producto, LLM genera versiones de textos en múltiples estilos; integración con API de pruebas A/B |
| 3 | Sistema de gestión de transmisión en vivo e interacción de avatares digitales virtuales | Modelado de imagen digital + voz TTS + diálogo LLM, respuesta en tiempo real a los comentarios de los espectadores; integración con transmisión OBS |
| 4 | Generación de guiones de videos cortos y edición inteligente | LLM genera guiones y storyboards de videos cortos, Sora/Runway genera fragmentos de video; herramienta de edición los ensambla automáticamente |
| 5 | Transcripción por voz de reuniones de ventas y recomendación de guiones | Transcripción ASR de llamadas telefónicas, LLM analiza la conversación y recomienda guiones ganadores; integración con sistema CRM |
| 6 | Sistema inteligente de generación y diseño de contenido de marketing | Ingreso de información del producto, LLM genera textos de marketing y extracción de puntos de venta; integración con plantillas de Canva/Gaoding |
| 7 | Sistema de monitoreo en tiempo real del ROI de publicidad multicanal y optimización de estrategias | Integración con APIs de plataformas publicitarias para recopilar datos, LLM analiza el rendimiento y genera sugerencias de optimización; alertas de anomalías |
| 8 | Análisis de palabras clave de motores de búsqueda y análisis de tráfico | Recopilación de datos de Baidu Index, 5118, LLM analiza tendencias y competitividad de palabras clave; recomendación de temas de contenido |
| 9 | Plataforma de análisis de publicidad de la competencia | API de plataformas de datos de terceros para recopilar anuncios de la competencia, LLM analiza estrategias de publicación y características creativas |
| 10 | Sistema de análisis inteligente de temas populares y recomendación de contenido de toda la web | Recopilación de datos de tendencias de Weibo, listas populares de Douyin, LLM analiza tendencias y recomienda ángulos temáticos; programación calendario de contenido |

## 10. Administración pública inteligente

Los escenarios de administración pública inteligente buscan mejorar la eficiencia del servicio gubernamental y la capacidad de gobernanza. Las aplicaciones típicas incluyen navegación inteligente de líneas de servicio gubernamental, preguntas y respuestas sobre políticas, optimización de trámites administrativos, gestión de eventos urbanos, etc., promoviendo la construcción del gobierno digital.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Sistema de navegación por voz inteligente y despacho automático de la línea de servicio ciudadano 12345 | Reconocimiento de voz de las llamadas de los ciudadanos, LLM comprende la solicitud y la despacha inteligentemente al departamento correspondiente; flujo automático de tickets |
| 2 | Robot de guía inteligente y respuestas sobre políticas para oficinas de servicios gubernamentales | Búsqueda RAG en base de conocimiento gubernamental, LLM responde sobre procedimientos y políticas; integración con sistema de turnos |
| 3 | Plataforma de emparejamiento inteligente y envío preciso de políticas de beneficio empresarial | Análisis estructurado de políticas, perfil empresarial con emparejamiento automático de políticas aplicables; recordatorios por SMS/correo |
| 4 | Asistente de pre-revisión inteligente y verificación de cumplimiento de materiales administrativos | Reconocimiento OCR de materiales y extracción de información clave, LLM verifica la integridad y conformidad de los documentos |
| 5 | Sistema de detección de comportamiento anómalo en videovigilancia de seguridad pública | Análisis en tiempo real de flujos de video, modelo CV detecta comportamientos anómalos (peleas, caídas, etc.); notificaciones de alerta |
| 6 | Plataforma de identificación inteligente y gestión de despacho de eventos urbanos en cuadrícula | Recopilación de datos de percepción urbana (IoT, cámaras), LLM identifica el tipo de evento y lo despacha |
| 7 | Sistema de análisis big data de opinión pública y alerta temprana de riesgos sociales | Análisis fusionado de múltiples fuentes de datos (línea de servicio gubernamental, opinión pública en internet, encuestas comunitarias); LLM identifica puntos calientes de riesgo |
| 8 | Plataforma de digitalización y archivo inteligente de registros gubernamentales | OCR reconoce el contenido textual de los archivos, LLM extrae información clave y los clasifica automáticamente; soporte de búsqueda de texto completo |
| 9 | Plataforma de comando de emergencia y despacho inteligente de recursos de rescate para eventos públicos | Recopilación de información del evento, LLM genera el plan de respuesta de emergencia; algoritmo de optimización de despacho de recursos |
| 10 | Sistema de monitoreo en cuadrícula de contaminación ambiental atmosférica y localización precisa de fuentes | Recopilación de datos de sensores de calidad del aire, modelo CV identifica fuentes de contaminación; LLM analiza tendencias de contaminación y rastrea el origen |

## 11. Asuntos legales y gestión de contratos

Los escenarios de asuntos legales se centran en la mejora de la eficiencia de los servicios legales y la gestión de cumplimiento. Las aplicaciones comunes incluyen revisión de contratos, análisis de casos, monitoreo regulatorio, generación de documentos legales, etc., proporcionando herramientas inteligentes para los profesionales del derecho.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Agent de detección de riesgos y vulnerabilidades en contratos con un clic | Análisis estructurado del texto del contrato, LLM identifica problemas potenciales comparando con la lista de verificación de riesgos; marcado de cláusulas de alto riesgo |
| 2 | Plataforma de revisión de cumplimiento y sugerencias de modificación de contratos empresariales en todo su ciclo de vida | Comparación de cláusulas contractuales con la base de datos normativa, LLM genera informes de cumplimiento; seguimiento de sugerencias de modificación |
| 3 | Asesor de evaluación inteligente por IA de la tasa de éxito en casos similares | Extracción de características del caso, búsqueda y emparejamiento de casos similares; LLM analiza los factores que influyen en el éxito |
| 4 | Radar de monitoreo en tiempo real de cambios legislativos y análisis de impacto empresarial | Actualización en tiempo real de la base de datos legislativa, LLM analiza el contenido modificado y evalúa el impacto empresarial; notificaciones de alerta |
| 5 | Herramienta de redacción automática AIGC de cartas de abogado | Ingreso de la declaración de hechos, LLM genera plantillas de cartas de abogado estandarizadas; verificación de elementos y cumplimiento normativo |
| 6 | Grabadora de transcripción en tiempo real de juicios y extracción automatizada de puntos de controversia | Transcripción ASR de grabaciones de juicios, LLM extrae puntos de controversia y argumentos clave; marcado de marcas de tiempo |
| 7 | Sistema de monitoreo automatizado de infracciones de propiedad intelectual y obtención de pruebas blockchain de toda la web | Monitoreo de infracciones en plataformas de comercio electrónico y redes sociales; recopilación y almacenamiento automático de evidencia |
| 8 | Agent de verificación de consistencia de datos clave y alerta temprana de riesgos en prospectos de IPO basado en LLM | Comparación de datos entre múltiples secciones del prospecto, LLM identifica inconsistencias y anomalías en los datos; marcado de riesgos |
| 9 | Plugin de explicación en lenguaje sencillo de cláusulas legales complejas | Selección de disposiciones legales, LLM genera explicaciones fáciles de entender |
| 10 | Sistema de organización inteligente y visualización de la cadena de pruebas de un caso | Carga de materiales probatorios, LLM analiza las relaciones entre pruebas y la línea de tiempo |

## 12. Turismo y servicios de viaje

Los escenarios de turismo y viajes buscan mejorar la experiencia de viaje y la comodidad del servicio. Las aplicaciones centrales incluyen planificación inteligente de itinerarios, predicción de precios, tours virtuales, servicios de traducción, etc., haciendo que los viajes sean más agradables y sin complicaciones.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Generador de itinerarios automáticos basado en AIGC para viajeros perezosos | Ingreso de preferencias del usuario (días, presupuesto, intereses), LLM genera planes de itinerario diario; API de atracciones para obtener horarios y precios de entradas |
| 2 | Robot de predicción de tendencias de precios de vuelos y hoteles de toda la web y bloqueo automático de precios bajos | Recopilación de datos de precios de plataformas OTA, modelo ML predice tendencias de precios; alertas de monitoreo de precios |
| 3 | Asesor de reorganización de itinerarios entre aerolíneas y recomendación de planes de emergencia tras cancelación de vuelos | Monitoreo del estado de vuelos, LLM analiza planes de itinerario alternativos; comparación de precios entre aerolíneas |
| 4 | Sistema de pre-revisión inteligente de documentos de visa y asistencia de llenado automatizado | Carga de fotos de documentos, verificación de integridad de información mediante OCR; llenado automático de formularios |
| 5 | Asistente de traducción por voz en tiempo real y traducción visual de menús para viajes al extranjero | Modelo de traducción por voz sin conexión, OCR de imágenes de menús para reconocimiento y traducción |
| 6 | Analizador de guía para evitar hoteles problemáticos basado en reseñas reales de big data | Recopilación de datos de reseñas de hoteles, LLM extrae palabras clave de reseñas positivas y negativas |
| 7 | Plataforma de vista previa inmersiva en VR y selección virtual de habitaciones en el destino | Recopilación de imágenes panorámicas 360°, tecnología VR para vista previa inmersiva; recorrido virtual de habitaciones |
| 8 | Asistente de generación automática de diarios de viaje ilustrados y textos para redes sociales a partir de huellas de viaje | Extracción de información de fecha y lugar de las fotos, LLM genera textos de diarios de viaje; composición con plantillas |
| 9 | Plataforma de recopilación automática de facturas de viajes de negocios y gestión de reembolsos conforme a normativa | Integración con API de plataformas de viajes, recopilación automática de información de facturas; verificación de cumplimiento |
| 10 | Predicción en tiempo real de congestión de visitantes y navegación con rutas de visita en horarios no pico | Recopilación de datos de flujo de visitantes en atracciones, modelo ML predice períodos de congestión; recomendación de horarios no pico |

## 13. Acompañamiento emocional

Los escenarios de acompañamiento emocional se centran en la salud mental y el consuelo emocional. Las aplicaciones típicas incluyen compañeros virtuales, consultas emocionales, entrenamiento cognitivo, orientación psicológica, etc., proporcionando acompañamiento y apoyo las 24 horas del día.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Compañero virtual de compañía profunda 24 horas basado en modelos LLM | Sistema de memoria que almacena el historial de conversaciones, LLM genera respuestas personalizadas; módulo de apoyo emocional |
| 2 | Asesor de IA de reconocimiento emocional multimodal y orientación psicológica | Análisis de tono de voz + reconocimiento de emociones en texto, LLM genera sugerencias de orientación; alerta de intervención en crisis |
| 3 | Avatar digital de entrenamiento cognitivo y recuperación de memorias para personas con Alzheimer | Juegos cognitivos (memoria, cálculo, lenguaje) para entrenamiento; fotografías antiguas/canciones antiguas que activan recuerdos |
| 4 | Entrenador de práctica social simulada con AIGC para personas con ansiedad social | Simulación de escenarios sociales virtuales, LLM asume diferentes roles; sugerencias de habilidades sociales |
| 5 | Generador personalizado de cuentos para dormir para niños con IA generativa | Los padres ingresan el tema y las preferencias, LLM genera cuentos personalizados; generación de música de fondo |
| 6 | Sistema de restauración digital de vidas de seres queridos fallecidos y diálogo trans temporal con LLM | Entrenamiento de modelo personalizado con datos vitales (voz, textos); generación de conversaciones con memoria |
| 7 | Chatbot empático de espejo de personalidad basado en datos MBTI con IA | Ingreso de resultados de tests MBTI, LLM genera análisis de personalidad y respuestas empáticas; recomendaciones de compatibilidad de personalidad |
| 8 | Asistente de monitoreo del estado de ánimo las 24 horas y motivación emocional positiva con IA | Registro diario del estado de ánimo, LLM analiza tendencias y genera contenido motivacional; envío de recordatorios positivos |
| 9 | Refugio anónimo de desahogo para adolescentes con protección de privacidad con IA | Entrada anónima de desahogo, LLM proporciona escucha y sugerencias; alerta por palabras sensibles |
| 10 | Sistema de crianza de mascotas virtuales con IA y capacidad de evolución autónoma | Entrenamiento de modelo de personalidad de mascota, crecimiento y evolución a través de interacción conversacional; sistema de vestuario virtual |

## 14. Entretenimiento y ocio

Los escenarios de entretenimiento y ocio buscan ofrecer una rica experiencia de entretenimiento digital. Las aplicaciones comunes incluyen toma de decisiones inteligente de NPC en juegos, asistencia en juegos de misterio, creación de contenido, procesamiento de audio y video, etc., satisfaciendo las diversas necesidades de entretenimiento de los usuarios.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Motor de toma de decisiones autónoma para NPC de juegos de mundo abierto impulsado por LLM | Árbol de comportamiento del NPC integrado con toma de decisiones LLM, sistema de diálogo genera interacciones personalizadas; motor de comportamiento |
| 2 | Herramienta de deducción de tramas AIGC y asistencia de control de DM para juegos de misterio inmersivos | Las elecciones de los jugadores activan ramas de la historia, LLM genera lógica deductiva; generación automática de tarjetas de pistas |
| 3 | Modificador generativo de finales de novelas interactivas | Las elecciones del lector influyen en la dirección de la trama, LLM genera múltiples ramas de finales |
| 4 | Estación de trabajo de generación automática AIGC de modelos 3D de personajes de anime | Texto descriptivo genera bocetos de personajes, herramientas de modelado 3D crean automáticamente los modelos; renderizado de texturas y materiales |
| 5 | Análisis visual CV y comentarista inteligente por IA de partidas de esports | Análisis en tiempo real de la pantalla del juego, identificación de momentos clave; LLM genera textos de comentario |
| 6 | Motor de algoritmo de recomendación de contenido humorístico personalizado | Perfil de intereses del usuario, emparejamiento y recomendación de contenido humorístico |
| 7 | Software de corrección de afinación por IA y embellecimiento vocal para karaoke | Procesamiento de reducción de ruido y mejora de voz; algoritmo de corrección de afinación por IA |
| 8 | Herramienta de extracción por IA y edición de tramas específicas de personajes en series y películas | Análisis del contenido del video, extracción de fragmentos relacionados con personajes; edición automática |
| 9 | Sistema de generación automática de audiolibros con síntesis TTS multicolor | Asignación de personajes del texto, generación de voces personalizadas; adición de música de fondo y efectos de sonido |
| 10 | Entrenador de revisión y juego de ajedrez y juegos de mesa con aprendizaje por refuerzo | Análisis de partidas, simulación de oponentes con IA; generación de sugerencias de revisión |

## 15. Servicios de comercio electrónico

Los escenarios de servicios de comercio electrónico se centran en la eficiencia operativa y la mejora de la conversión. Las aplicaciones centrales incluyen generación de contenido de productos, transmisión en vivo de ventas, servicio al cliente, análisis de precios, etc., ayudando a los comerciantes a lograr una operación inteligente.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Herramienta de producción masiva de páginas de detalles de productos AIGC con alta tasa de conversión | Ingreso de información del producto, LLM genera textos de puntos de venta y descripciones de escenarios; generación de imágenes de fondo |
| 2 | Fábrica de generación de videos de prueba de vestir y exhibición de modelos virtuales con IA para moda | Procesamiento de fotos planas de ropa, generación de efectos de prueba de vestir en modelos virtuales; videos de exhibición desde múltiples ángulos |
| 3 | Asistente de traducción y pulido localizado multilingüe con LLM para comercio electrónico transfronterizo | Traducción multilingüe de descripciones de productos, pulido de adaptación cultural; interfaces de publicación en múltiples plataformas |
| 4 | Robot de análisis de sentimientos de clientes y respuesta inteligente basado en NLP | Análisis de sentimientos en conversaciones de consultas, generación automática de respuestas de consuelo; clasificación de reseñas positivas y negativas |
| 5 | Sistema de transmisión en vivo con avatares digitales AIGC las 24 horas | Imagen digital + generación de guiones en tiempo real, invocación en tiempo real de información de productos; respuestas interactivas a comentarios |
| 6 | Plugin de comparación de precios por IA y predicción de tendencias de productos similares de toda la web | Rastreo de precios en plataformas de comercio electrónico, visualización de comparación de precios; predicción de tendencias de precios |
| 7 | Plataforma de selección inteligente por IA de fotos de reseñas de clientes y síntesis de videos cortos | Puntuación de calidad de fotos de reseñas de clientes, recomendación automática de contenido de calidad; síntesis con plantillas de videos cortos |
| 8 | Análisis por voz en tiempo real de conversaciones de ventas y recomendación de guiones ganadores basado en LLM | Transcripción ASR de llamadas, detección de conformidad de guiones en tiempo real; recomendación de guiones |
| 9 | Motor de análisis de tendencias de mercado por IA y predicción de productos exitosos | Recopilación y análisis de datos de redes sociales y comercio electrónico, LLM identifica tendencias populares; recomendaciones de selección de productos |
| 10 | Sistema de agrupación por IA de perfiles de usuarios de tráfico privado y operación de precisión | Análisis de agrupación de datos de comportamiento de usuarios, generación de etiquetas de perfiles; activación de marketing automatizado |

## 16. Energía

Los escenarios del sector energético buscan lograr una gestión inteligente y la transición verde de la industria energética. Las aplicaciones típicas incluyen análisis de consumo eléctrico, detección de equipos, cálculo de emisiones de carbono, optimización de despacho, etc., promoviendo la operación eficiente de los sistemas energéticos.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Asesor de análisis del comportamiento de consumo eléctrico doméstico y estrategias de ahorro energético con IA | Recopilación de datos de medidores inteligentes, análisis de patrones de consumo; LLM genera recomendaciones de ahorro energético |
| 2 | Sistema de reconocimiento visual CV por dron de defectos en paneles fotovoltaicos | Inspección con dron, análisis de imágenes termoinfrarrojas; detección y marcado de defectos |
| 3 | Agente de predicción de tendencias de precios de mercado eléctrico al contado y estrategia automática de ganancias con IA | Recopilación de datos del mercado eléctrico, modelo de predicción de precios; generación y ejecución de estrategias de trading |
| 4 | Sistema de evaluación de salud no destructiva por IA y alerta temprana de riesgo de fuga térmica de baterías de almacenamiento | Monitoreo de datos operativos de baterías, modelo de evaluación de salud; alertas de riesgo |
| 5 | Asistente de cálculo automático de emisiones de carbono en toda la cadena empresarial y generación de informes ESG con IA | Recopilación de datos de consumo energético, cálculo de factores de emisión de carbono; generación automática de informes ESG |
| 6 | Sistema de predicción de carga ante clima extremo y comando de despacho de emergencia de la red eléctrica con IA | Integración de datos meteorológicos, modelo de predicción de carga; generación de estrategias de despacho |
| 7 | Guardián de reconocimiento por video por IA y alerta de comportamientos indebidos en gasolineras | Análisis de videovigilancia, detección de comportamientos indebidos (hablar por teléfono, fumar, etc.); notificaciones de alerta |
| 8 | Sistema de monitoreo por ondas acústicas por IA y localización precisa de fugas en oleoductos y gasoductos de gran longitud | Recopilación de datos de sensores acústicos, modelo de detección de fugas; cálculo de algoritmos de localización |
| 9 | Sistema de agregación de recursos de plantas virtuales y toma de decisiones de trading eléctrico por IA | Conexión de recursos distribuidos, optimización de despacho agregado; ejecución de estrategias de trading |
| 10 | Seguimiento por IA de la ubicación de personal en minas y alerta de intrusión en zonas peligrosas | Localización UWB/Bluetooth, seguimiento de trayectoria del personal; vallas electrónicas en zonas peligrosas |

## 17. Audio y video

Los escenarios de audio y video se centran en la producción de contenido y el procesamiento de medios. Las aplicaciones comunes incluyen edición de video, síntesis de voz, generación de subtítulos, restauración de video, etc., mejorando la eficiencia y calidad de la producción de contenido audiovisual.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Herramienta de identificación por IA de fragmentos destacados y edición automática de videos cortos a partir de videos largos | Análisis del contenido del video, identificación de fotogramas clave; edición automática de fragmentos destacados |
| 2 | Asistente de separación inteligente de ruido de fondo y mejora de voz por IA en video | Modelo de separación de audio, eliminación de ruido de fondo; procesamiento de mejora de voz |
| 3 | Estación de trabajo de restauración 4K y colorización inteligente por IA de material audiovisual antiguo | Modelo de superresolución de video, restauración de calidad de material antiguo; colorización automática por IA |
| 4 | Sistema de doblaje TTS de texto a voz de nivel realista y control emocional | Modelo TTS multicolor, generación con control emocional; exportación de audio |
| 5 | Herramienta de reconocimiento automático ASR de voz de video y generación de subtítulos bilingües | Reconocimiento de voz para generar subtítulos, traducción a múltiples idiomas; superposición de subtítulos bilingües |
| 6 | Motor de eliminación inteligente por IA de objetos innecesarios en la imagen del video | Seguimiento de objetivos en video, eliminación y reparación de objetos; procesamiento de consistencia entre fotogramas |
| 7 | Compositor automático AIGC de música de fondo sin derechos de autor | Modelo de generación musical, control de estilo y emoción; detección de derechos de autor |
| 8 | Software de clonación de timbre de voz por IA y conversión de voz para personas específicas | Entrenamiento de modelo de timbre con pocas muestras de voz; procesamiento de cambio de voz |
| 9 | Plataforma de conversión de guiones a storyboards con un clic y generación de videos de previsualización dinámica por IA | Análisis de guiones para generar storyboards, IA genera videos de previsualización |
| 10 | Asistente de transcripción inteligente por IA y extracción de tareas pendientes de grabaciones de reuniones | Separación y transcripción de voz en reuniones de múltiples participantes, LLM extrae tareas pendientes; marcado de marcas de tiempo |

## 18. Marketing con IA

Los escenarios de marketing con IA buscan mejorar la eficiencia del marketing y la producción creativa. Las aplicaciones centrales incluyen generación de textos, diseño de pósters, seguimiento de tendencias, análisis de la competencia, etc., ayudando a las empresas a lograr un marketing preciso y la difusión de marca.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Motor de redacción automática AIGC de textos virales para Xiaohongshu (RED) | Ingreso del tema, LLM genera textos de recomendación; optimización de emoji y etiquetas de temas |
| 2 | Herramienta de diseño inteligente de pósters de marketing y adaptación a múltiples tamaños | Ingreso del texto, emparejamiento inteligente de plantillas de pósters y exportación en múltiples tamaños |
| 3 | Plataforma de generación creativa AIGC de LOGO de marca y construcción del sistema de identidad visual (VI) | Ingreso de palabras clave de marca, generación creativa de LOGO; generación de normativas VI |
| 4 | Asistente de seguimiento de tendencias populares por IA y generación creativa de marketing oportunista | Recopilación de datos de tendencias, LLM analiza ángulos de marketing; generación de propuestas creativas |
| 5 | Monitor en tiempo real del ROI de publicidad y asistente de puja presupuestaria por IA | Integración con datos de plataformas publicitarias, modelo de análisis de rendimiento; optimización de estrategias de puja |
| 6 | Analizador profundo de estrategias de marketing de la competencia y generador semanal de informes por IA | Recopilación y análisis de contenido de la competencia, extracción de estrategias; generación automática de informes semanales |
| 7 | Diseño inteligente de palabras clave de motores de búsqueda y redacción masiva de artículos para generar tráfico | Análisis de palabras clave, generación masiva de artículos; sugerencias de optimización SEO |
| 8 | Experto en redacción por IA de correos de marketing personalizados para cada usuario | Datos de perfiles de usuarios, generación de contenido personalizado; pruebas A/B |
| 9 | Radar de monitoreo de reputación de marca de toda la web y alerta temprana de crisis de opinión pública por IA | Recopilación de datos de opinión pública de toda la web, análisis de sentimientos; notificaciones de alerta de crisis |
| 10 | Asistente de generación creativa AIGC de guiones de videos cortos y guía de storyboards | Ingreso del tema, generación de guiones y storyboards; guía de sugerencias de filmación |

## 19. Inteligencia de datos

Los escenarios de inteligencia de datos se centran en el análisis de datos y la extracción de valor. Las aplicaciones típicas incluyen consultas en lenguaje natural, generación de visualizaciones, gobernanza de datos, construcción de grafos de conocimiento, etc., ayudando a las empresas a lograr un soporte para la toma de decisiones basada en datos.

| N.º | Nombre del escenario de aplicación | Referencia de implementación |
| :--: | --- | --- |
| 1 | Motor de consulta en lenguaje natural basado en Text-to-SQL | Conversión de lenguaje natural a consultas SQL, visualización de resultados |
| 2 | BI conversacional: generar gráficos de visualización con una frase | Descripción de necesidades de datos, generación automática de gráficos; soporte de cambio entre múltiples tipos de gráficos |
| 3 | Herramienta de reconocimiento de tablas Excel a partir de capturas de pantalla con un clic | Carga de capturas de pantalla, VLM reconoce la estructura de la tabla y los datos; exportación a archivo Excel |
| 4 | Herramienta de reconocimiento por IA de tablas a partir de imágenes y capturas de pantalla para Excel | OCR de imágenes para reconocer la estructura de la tabla, exportación de datos a Excel |
| 5 | Construcción automatizada de grafos de conocimiento de datos heterogéneos multifuente | Conexión de múltiples fuentes de datos, extracción de entidades y relaciones; almacenamiento en base de datos de grafos |
| 6 | Asistente de interpretación inteligente y análisis de tendencias de informes de datos | Carga de imágenes de informes de datos o ingreso de datos, VLM interpreta el contenido de los gráficos y analiza tendencias |
| 7 | Asistente de interpretación inteligente de estructura de tablas de base de datos y generación de ejemplos de consultas | Ingreso de nombre de tabla o descripción de campos, LLM genera descripción de la tabla y sentencias SQL de ejemplo |
| 8 | Alineación inteligente de datos maestros empresariales y eliminación de duplicados por IA | Emparejamiento de datos maestros multifuente, identificación de registros duplicados; configuración de reglas de fusión |
| 9 | Herramienta de conversión inteligente de documentos de requisitos de datos a casos de prueba | Ingreso de descripción de requisitos de datos, LLM genera escenarios de prueba y casos de validación |
| 10 | Asistente inteligente de preguntas y respuestas sobre definiciones de indicadores de datos | Construcción de base de conocimiento basada en documentos de definición de indicadores, LLM responde preguntas sobre definiciones de indicadores, lógica de cálculo, etc. |

</TabItem>
<TabItem label="B2C Consumo">

## Introducción del capítulo

<ChapterIntroduction :duration="cDuration" :tags="['Aplicaciones B2C', 'Estilo de vida', 'Experiencia emocional', 'Creación de ambiente']" coreOutput="Descubrir más de 15 inspiraciones de escenarios de vida" expectedOutput="Encontrar una dirección de producto que emocione a los usuarios">

Este documento resume <strong>direcciones creativas de aplicación de modelos LLM en escenarios de consumo B2C</strong>. A diferencia de los productos B2B, que se centran en eficiencia y puntos de dolor, los productos B2C se enfocan más en <strong>crear sensaciones, sugestiones psicológicas y ambiente</strong>, para que el usuario obtenga resonancia emocional y una experiencia agradable.

</ChapterIntroduction>

## Selección rápida de ambiente

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #ec4899;">
  <div style="font-weight: 600; margin-bottom: 8px;">Encuentra la inspiración que te toca</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    Elige el ambiente que quieres y tu sensación actual. El sistema recomendará escenarios relacionados; haz clic en una etiqueta para saltar a la sección correspondiente.
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="vibePoint" placeholder="Elige tipo de ambiente" style="width: 100%;">
        <el-option
          v-for="item in vibeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <div style="font-weight: 500;">{{ item.label }}</div>
          <div style="font-size: 12px; color: #909399;">{{ item.desc }}</div>
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-select v-model="feeling" placeholder="Elige tu sensación actual" style="width: 100%;">
        <el-option
          v-for="item in feelingOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <div style="font-weight: 500;">{{ item.label }}</div>
          <div style="font-size: 12px; color: #909399;">{{ item.desc }}</div>
        </el-option>
      </el-select>
    </el-col>
  </el-row>
  
  <div v-if="cRecommendationTopics.length > 0" style="margin-top: 16px;">
    <div style="font-weight: 600; margin-bottom: 12px; color: #ec4899;">
      Escenarios recomendados para {{ cCurrentSelection.vibe }} × {{ cCurrentSelection.feeling }}:
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      <el-tag
        v-for="topic in cRecommendationTopics"
        :key="topic.title"
        type="danger"
        effect="light"
        style="cursor: pointer; margin-bottom: 4px;"
        @click="cScrollToAnchor(topic.scenarioAnchor)"
      >
        {{ topic.title }}
      </el-tag>
    </div>
    <el-button type="text" size="small" @click="cResetSelection" style="margin-top: 8px;">
      Elegir de nuevo
    </el-button>
  </div>
</el-card>

---

## 1. Estilo de vida

> 💡 **Idea central**: convertir la rutina cotidiana en una experiencia con rituales y crear belleza en los detalles

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Asistente de despertar con ritual matutino | Integra API de clima y datos de calendario; un LLM genera planes matutinos personalizados; reproduce música a medida con altavoces inteligentes y enciende las luces gradualmente |
| 2 | Creador de ambiente para vivir solo | Se conecta a dispositivos de hogar inteligente (luces, audio, difusor); el LLM ajusta parámetros según la hora y el estado de ánimo; aprende preferencias para optimizar continuamente |
| 3 | Generador de planes reparadores para quedarse en casa el fin de semana | Se conecta a APIs de streaming para obtener listas de contenido y combina historial de preferencias para proponer película + comida + ambientación |
| 4 | Radio calmante antes de dormir | Usa TTS para generar historias suaves, mezcla ruido blanco y reduce el volumen gradualmente; ajusta el contenido según datos de sueño |
| 5 | Capturador de inspiración estética cotidiana | Analiza fotos del entorno mediante reconocimiento de imagen, genera sugerencias estéticas con LLM y recomienda contenido al estilo Pinterest/Xiaohongshu |

---

## 2. Acompañamiento emocional

> 💡 **Idea central**: aceptación y compañía incondicionales, como un contenedor amable para las emociones

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Confidente nocturno | Cifrado de extremo a extremo para proteger la privacidad; análisis emocional con LLM; memoria de largo plazo para guardar historias del usuario y acompañamiento en diálogos continuos |
| 2 | Acompañante para sanar una ruptura | Algoritmo de identificación de etapas emocionales; apoyo por fases (desahogo → descarga → reconstrucción); recuperación RAG sobre una base de conocimiento psicológica |
| 3 | Coach de respiración contra la ansiedad | Entrada de datos de biosensores (ritmo cardiaco/respiración), monitoreo en tiempo real del nivel de ansiedad, guía de respiración por voz y relajación muscular progresiva |
| 4 | Mentor para reconstruir la confianza | Marco conversacional de psicología positiva; registro y retroalimentación sobre pequeños logros; técnicas de reestructuración cognitiva para cambiar el diálogo interno negativo |
| 5 | Interpretación inteligente del diario emocional | Modelo NLP de reconocimiento emocional, análisis de series temporales para detectar patrones; visualización del mapa emocional y alertas predictivas |

---

## 3. Entretenimiento y ocio

> 💡 **Idea central**: crear experiencias inmersivas para que el entretenimiento sea un refugio emocional

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | DM inmersivo para juegos de misterio | El LLM genera ramificaciones de trama en tiempo real, usa síntesis de voz para interpretar NPC, ajusta dificultad y ritmo según la reacción de los jugadores; renderizado de escenas AR/VR |
| 2 | NPC con alma en juegos de mundo abierto | Base de datos de memoria a largo plazo para historial de interacción; diálogos personalizados con LLM; computación afectiva para respuestas emocionales creíbles |
| 3 | Generación de podcasts personalizados | Crea contenido exclusivo según el grafo de intereses del usuario; TTS clona voces preferidas; interacción en tiempo real para responder preguntas de oyentes |
| 4 | Equipo de ambiente para concierto virtual | Renderizado de avatares, interacción en tiempo real con mensajes, varitas luminosas y objetos de apoyo virtuales; audio espacial para sensación de presencia |
| 5 | Compañero de cocreación de novela interactiva | El LLM genera trama en tiempo real; las elecciones del usuario cambian la historia; múltiples finales y relaciones dinámicas entre personajes |

---

## 4. Crecimiento personal

> 💡 **Idea central**: crecer no es una penitencia, sino un viaje interesante de autodescubrimiento

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Testigo del crecimiento personal | Línea de tiempo visual para mostrar el progreso; marcado automático de hitos; comparativas de "mi yo de antes" frente a "mi yo actual" |
| 2 | Coach gamificado de hábitos | Mecánicas de juego (experiencia, niveles, insignias), clasificaciones sociales y coach de IA con rol narrativo, por ejemplo "mentor de aventuras" |
| 3 | Emparejador de compañeros para aprender habilidades | Algoritmo de matching por intereses y metas de aprendizaje, comunidades de grupos de estudio y mecanismo de registro con supervisión mutua |
| 4 | Descubridor diario de pequeñas alegrías | Reconocimiento de imágenes para encontrar momentos bonitos; guía de gratitude journal; revisión semanal de momentos positivos |
| 5 | Simulador de experiencias de vida | Simula resultados de decisiones con tramas ramificadas, compara vidas paralelas y visualiza consecuencias |

---

## 5. Interacción social

> 💡 **Idea central**: hacer que socializar sea ligero y natural, encontrando formas cómodas de conexión

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Generador de temas rompehielos | Recomendación inteligente de temas según ocasión y participantes; análisis de conversación en tiempo real para sugerir continuidad; rescate en momentos incómodos |
| 2 | Redactor de ambiente para publicaciones sociales | Análisis de imágenes, textos en varios estilos con LLM (artístico/humorístico/profundo); recomendación inteligente de emojis y maquetación |
| 3 | Planificador de ambiente para citas | Genera planes de cita según intereses de ambas partes; recomienda restaurantes/actividades y temas de conversación; alertas de clima y tráfico |
| 4 | Animador de reuniones remotas | Biblioteca de juegos online, generador de actividades rompehielos, ruleta de temas; fondos virtuales y filtros para reforzar el ambiente |
| 5 | Asistente de gestión de energía social | Evalúa el desgaste tras actividades sociales, sugiere recuperación (actividades en solitario) y planifica inteligentemente el calendario social |

---

## 6. Expresión creativa

> 💡 **Idea central**: todas las personas tienen creatividad; solo necesita despertarse

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Kit de emergencia contra el bloqueo creativo | Algoritmo de asociaciones entre dominios, generación de estímulos aleatorios, biblioteca de prompts creativos y herramienta de expansión tipo mapa mental |
| 2 | Guía de exploración del estilo personal | Análisis de imagen para reconocer el estilo actual; recomendaciones de tendencias; prueba virtual de ropa/maquillaje; línea de evolución del estilo |
| 3 | Asesor estético para journaling y diarios | Recomendación de plantillas de maquetación, generación de paletas, sugerencias decorativas, reconocimiento de escritura manual y embellecimiento de contenido |
| 4 | Guía de composición y ambiente fotográfico | Reconocimiento de escena, sugerencias de composición, filtros recomendados, ajuste inteligente de parámetros de edición y ruta de aprendizaje fotográfico |
| 5 | Emparejador de música y estado de ánimo | Análisis emocional de música, detección del estado de ánimo, listas personalizadas e historias/contexto de las canciones |

---

## 7. Exploración de viajes

> 💡 **Idea central**: viajar no es solo ver paisajes, sino sentir distintas formas de vida

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Guía para paseos urbanos | Agrega contenido de expertos locales, recomienda lugares poco conocidos, ofrece navegación AR, traducción en tiempo real y explicación por voz |
| 2 | Generador de diario emocional de viaje | Clasifica y selecciona fotos automáticamente, genera relatos de viaje con LLM, marca ubicaciones en una línea de tiempo y crea videos con un clic |
| 3 | Acompañante para viajar en solitario | Compartición de ubicación en tiempo real, alertas de seguridad, contactos de emergencia locales, guía de IA por voz y comunidad para viajeros solos |
| 4 | Vista previa del ambiente del destino | Panoramas VR/360°, simulación de sonidos y aromas locales, contexto cultural y experiencia virtual de "probar vivir allí" |
| 5 | Guía de ambiente para fotografía de viaje | Recordatorios de hora dorada, líneas de composición, puntos fotográficos locales y sugerencias de color grading |

---

## 8. Salud física y mental

> 💡 **Idea central**: la salud no es una meta, sino una forma amable de cuidarse

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Activador de motivación deportiva | Recomienda tipos de ejercicio según el estado del usuario, ofrece microejercicios de 5 minutos, retos gamificados y registro social de actividad |
| 2 | Cocina de inspiración saludable | Reconocimiento de ingredientes en la nevera, recetas personalizadas, análisis nutricional y guía de cocina paso a paso |
| 3 | Optimizador de ambiente para dormir mejor | Analiza datos de sueño, genera rituales nocturnos, sugiere mejoras ambientales (temperatura/humedad/luz) y ofrece despertar inteligente |
| 4 | Guía de conciencia corporal | Meditación de escaneo corporal, relación entre emociones y partes del cuerpo, ejercicios de conexión cuerpo-mente y visualización de biofeedback |
| 5 | Recordatorio de autocuidado | Monitorea intensidad de trabajo, recuerda descansos, sugiere microcuidados (beber agua/estirar/respirar) y registra autocuidado |

---

## 9. Exploración del conocimiento

> 💡 **Idea central**: aprender es una aventura interminable, y la curiosidad es la mejor maestra

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Guía gamificada de exploración del conocimiento | Visualiza mapas de conceptos, rutas de aprendizaje por niveles, sistema de insignias y mentor de IA con rol narrativo |
| 2 | Compañero situacional para aprender idiomas | El LLM interpreta distintos roles en conversaciones, corrige pronunciación, explica contexto cultural y simula situaciones inmersivas |
| 3 | Asistente para satisfacer la curiosidad | Conexión a Wikipedia/grafos de conocimiento, explicación simple de conceptos complejos, recomendaciones relacionadas y registro de curiosidades |
| 4 | Inspirador de notas de lectura | Analiza libros, extrae y relaciona ideas, recomienda ángulos de reflexión, plantillas y embellecimiento de notas |
| 5 | Creador de ambiente para compartir conocimiento | Genera tarjetas de conocimiento, optimiza copy para compartir, mejora visuales y ofrece retroalimentación de datos sociales |

---

## 10. Gestión de relaciones

> 💡 **Idea central**: las buenas relaciones requieren atención, y atenderlas no tiene por qué ser complicado

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Coach de comunicación para relaciones íntimas | Genera plantillas de expresión emocional, guía comunicación no violenta, ofrece frases para resolver conflictos y evalúa salud relacional |
| 2 | Asistente de cuidado familiar | Recordatorios de fechas importantes (cumpleaños/aniversarios), sugerencias de mensajes afectivos, actividades familiares y creación de álbum familiar |
| 3 | Creador de ambiente para mantener amistades | Registro de interacciones con amigos, temas comunes recomendados, organización de reuniones remotas y generación de línea de tiempo de recuerdos |
| 4 | Planificador de confesiones y sorpresas | Genera planes personalizados de sorpresa, recomienda regalos, sugiere frases románticas, cronograma y recordatorios |
| 5 | Guía para suavizar conflictos | Frases para bajar la intensidad emocional, guía para ponerse en el lugar del otro, pasos de reconciliación y seguimiento de reparación |

---

## 11. Acompañamiento de mascotas

> 💡 **Idea central**: las mascotas son familia, y su compañía merece ser registrada y valorada

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Diario antropomórfico de mascotas | Analiza comportamiento, genera diarios en primera persona, añade imágenes automáticamente y crea un "muro social" para la mascota |
| 2 | Intérprete del comportamiento animal | Analiza videos de comportamiento, alerta sobre salud, ofrece consejos de entrenamiento y base de conocimiento por raza |
| 3 | Planificador de tiempo de calidad con mascotas | Recomienda actividades, tutoriales de juguetes DIY, lugares pet-friendly y matching social para mascotas |
| 4 | Generador de historias conmemorativas de mascotas | Selecciona fotos y videos, genera historias en línea de tiempo, añade música y crea álbumes/videos conmemorativos automáticamente |
| 5 | Guía tranquila para nuevos cuidadores | Guía de cuidado por etapas, respuestas a problemas frecuentes, manejo de emergencias y comunidad de apoyo para principiantes |

---

## 12. Salud financiera

> 💡 **Idea central**: la libertad financiera no es el objetivo; la salud financiera sí

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Asistente de conciencia emocional del consumo | Analiza registros de gasto, relaciona emociones y consumo, alerta sobre compras impulsivas y propone satisfacciones alternativas |
| 2 | Motivación visual para metas de ahorro | Visualiza progreso, renderiza escenas de sueños, celebra hitos y gamifica el hábito de ahorrar |
| 3 | Aprendizaje ligero de finanzas personales | Entrega conocimiento fragmentado, casos situacionales, preguntas interactivas, pruebas y certificados |
| 4 | Aliviador de ansiedad financiera | Evalúa salud financiera, ofrece técnicas de gestión del estrés, planes de pequeños pasos y apoyo psicológico financiero |
| 5 | Juego de inversión de bajo monto | Simulación de inversión virtual, educación de riesgos, juego de portafolio y guía hacia inversión real de bajo monto |

---

## 13. Desarrollo profesional

> 💡 **Idea central**: la carrera profesional no es una vía fija, sino un territorio abierto para explorar

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Acompañante para la confusión profesional | Evaluación de intereses, inventario de habilidades, recomendaciones de información sectorial y conversaciones con mentor profesional |
| 2 | Activador de sentido de logro laboral | Registro de resultados, extracción de valor, visualización de logros y recopilación de feedback positivo de colegas/clientes |
| 3 | Asistente de ambiente social en el trabajo | Recomendación de temas profesionales, técnicas de networking, eventos del sector y optimización de contenido en LinkedIn |
| 4 | Generador de inspiración para proyectos paralelos | Matching entre habilidades, intereses y demanda de mercado; casos de side projects, guía de inicio y comunidad |
| 5 | Estación de confianza antes de entrevistas | Entrevistas simuladas, preparación de preguntas frecuentes, técnicas de confianza y sugerencias de imagen |

---

## 14. Espacio del hogar

> 💡 **Idea central**: el hogar no es solo un lugar donde vivir, sino un refugio para la mente

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Diseñador de ambiente para el hogar | Analiza fotos del espacio, recomienda estilos, muebles/decoración y previsualización AR |
| 2 | Guía de transformación estacional del hogar | Recomienda temas por temporada, organización y exhibición, decoración festiva y listas de compra |
| 3 | Magia para espacios pequeños | Algoritmos de optimización espacial, muebles multifuncionales, técnicas de orden y trucos de ampliación visual |
| 4 | Creador de rituales domésticos | Diseño de rituales cotidianos (mañana/noche/fin de semana), recordatorios de ejecución y feedback sobre efecto |
| 5 | Acompañamiento psicológico para decluttering | Evalúa valor emocional de objetos, guía pasos de descarte, ofrece apoyo psicológico y recomienda canales de donación/reciclaje |

---

## 15. Cocina y gastronomía

> 💡 **Idea central**: la comida es el lenguaje del amor, y cocinar es una forma de expresarlo

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Cocina reparadora para comer a solas | Reconocimiento de ingredientes en la nevera, recetas sencillas, guía paso a paso y estética de emplatado individual |
| 2 | Diseño de ambiente para mesas festivas | Menús temáticos, propuestas de montaje de mesa, técnicas de ambientación y optimización de experiencia de invitados |
| 3 | Emparejador de cocina y estado de ánimo | Algoritmo emoción-comida, recetas para regulación emocional, recomendación de comfort food y guía terapéutica de cocina |
| 4 | Generador de confianza para principiantes en cocina | Recetas ultrafáciles, técnicas de rescate ante errores, frases de confianza y progresión gradual de dificultad |
| 5 | Guía de ambiente para fotografía gastronómica | Consejos de emplatado, uso de luz natural, ángulos de captura, filtros y sugerencias de postproducción |

---

## 16. Estilo y vestimenta

> 💡 **Idea central**: vestirse es autoexpresión, y el estilo es la manifestación externa de lo interior

| N.º | Escenario de aplicación | Funcionalidad del escenario |
| :--: | ------------ | ------------ |
| 1 | Mood board del outfit de hoy | Recomendaciones combinando clima, ocasión y estado de ánimo; prueba virtual, inspiración de conjuntos y gestión del armario |
| 2 | Estilista de armario cápsula | Inventario del armario, combinaciones de prendas, planes de múltiples usos y sugerencias de compra para cubrir vacíos |
| 3 | Viaje de exploración del estilo personal | Test de estilo, recomendación de referentes, ruta de evolución y construcción de confianza |
| 4 | Creativo para reinventar ropa antigua | Inspiración para transformar ropa, nuevas combinaciones, detalles con accesorios y moda sostenible |
| 5 | Asesor de look para ocasiones especiales | Interpretación del dress code, generación de propuestas, consejos de maquillaje/peinado y coordinación general |

---

## Principios centrales para diseñar productos B2C

### 1. De "función" a "sensación"

Los productos B2B se preguntan "qué problema resuelve esta función"; los productos B2C se preguntan "qué sensación aporta esta función".

| Pensamiento B2B | Pensamiento B2C |
|---------|---------|
| Mejorar la eficiencia | Ahorrar tiempo para hacer lo que gusta |
| Reducir costes | Hacer que cada euro valga la pena |
| Resolver puntos de dolor | Crear experiencias agradables |
| Funcionalidad completa | Sensación bien lograda |

### 2. Tres niveles para crear ambiente

**Nivel sensorial**: diseño visual, auditivo y táctil
- Colores cálidos
- Sonidos relajantes
- Animaciones fluidas

**Nivel emocional**: resonancia y guía emocional
- Comprender el estado de ánimo del usuario
- Ofrecer apoyo emocional
- Crear emociones positivas

**Nivel de significado**: reconocimiento de valor y pertenencia
- Hacer que el usuario se sienta comprendido
- Crear sentido de pertenencia
- Dar significado a la acción

### 3. El poder de la sugestión psicológica

El copy y el diseño de un producto B2C siempre transmiten sugestiones psicológicas:

- **Sugestión positiva**: "ya lo estás haciendo bien", "ve despacio, no pasa nada"
- **Sugestión de pertenencia**: "muchas personas sienten lo mismo", "no estás solo"
- **Sugestión de crecimiento**: "cada intento es progreso", "estás mejorando"

### 4. Ayudar al usuario a ser una mejor versión de sí mismo

Los mejores productos B2C no cambian al usuario; le ayudan a convertirse en la persona que quiere ser.

- No es "deberías...", sino "puedes..."
- No es "tienes que...", sino "si quieres..."
- No es "aún no eres suficiente...", sino "ya has..."

---

> 🌟 **Recuerda**: los usuarios B2C no compran funciones, sino sensaciones; no compran herramientas, sino compañía; no compran servicios, sino comprensión.

</TabItem>
</Tabs>
