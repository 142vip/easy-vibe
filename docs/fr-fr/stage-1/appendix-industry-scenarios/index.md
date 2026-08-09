---
title: 'Référence des scénarios d''application IA (B2B et B2C)'
description: 'Ce document recense les applications des modèles LLM dans les scénarios d''entreprise B2B et de consommation B2C. B2B couvre 19 industries dont la fabrication, le service client, l''éducation, la santé et la finance ; B2C couvre 16 scénarios de consommation dont le style de vie, l''accompagnement émotionnel, les loisirs et le développement personnel, offrant une référence complète aux développeurs d''applications IA.'
---

<script setup>
import { computed, ref } from 'vue'

const duration = 'Environ <strong>6 heures</strong>'

const interestPoint = ref('')
const purpose = ref('')

// Pool de sujets par industrie
const topicPool = {
  'manufacturing': [
    { title: "Plateforme d'aide au design extérieur de bus électriques par IA", desc: "Conception de design conceptuel basée sur des modèles de génération d'images" },
    { title: "Assistant intelligent de conception et vérification de plans", desc: "Construction d'une base de connaissances de normes de conception d'entreprise via RAG" },
    { title: "Génération automatique et gestion de documentation technique", desc: "Génération automatique de spécifications produit et de manuels d'utilisation basée sur LLM" },
    { title: "Assistant de génération automatique de rapports d'inspection d'équipements", desc: "Description vocale de l'état des équipements, génération structurée de rapports d'inspection" },
    { title: "Assistant Q&R de diagnostic de pannes d'équipements industriels", desc: "Construction d'une base de connaissances vectorielle basée sur les historiques de pannes" }
  ],
  'customer-service': [
    { title: "Système de réponse automatique multicanal et génération de tickets", desc: "Intégration multi-canal, LLM compréhend l'intention et génère la réponse" },
    { title: "Assistant de prospection et suivi de prospects potentiels", desc: "Analyse des historiques de conversations pour identifier les prospects à forte intention" },
    { title: "Système de recherche intelligente et Q&R de connaissances internes", desc: "Construction d'une base de connaissances vectorielle à partir de documents internes" },
    { title: "Outil de résumé intelligent de conversations et génération de tickets", desc: "Génération automatique de résumés de session et extraction d'informations clés" },
    { title: "Système de recommandation de scripts de service client", desc: "Analyse des cas exemplaires, extraction de modèles de scripts performants" }
  ],
  'education': [
    { title: "Planification de parcours d'apprentissage linguistique personnalisé et système de tutorat intelligent", desc: "Évaluation du niveau de l'apprenant, planification des tâches quotidiennes" },
    { title: "Plateforme de création automatique de plans de cours et de ressources pédagogiques", desc: "Génération de cadres de plans de cours basée sur le programme" },
    { title: "Système de correction automatique et diagnostic de résultats scolaires", desc: "Correction automatique de questions ouvertes et génération de suggestions" },
    { title: "Construction de modèles de compétences et cartographie d'apprentissage", desc: "Analyse des descriptions de postes pour extraire les compétences requises" },
    { title: "Pratique orale de langues en scénarios individuels", desc: "LLM joue différents rôles pour des dialogues oraux" }
  ],
  'programming': [
    { title: "Assistant de complétion de code et correction automatique de bugs", desc: "Plugin IDE fournissant des suggestions de complétion en temps réel" },
    { title: "Plateforme de construction low-code et automatisation de processus", desc: "Description en langage naturel convertie en configuration low-code" },
    { title: "Système de génération de tests unitaires", desc: "Analyse AST du code source, génération de tests aux limites" },
    { title: "Outil d'analyse de code et migration entre langages", desc: "Analyse de la qualité du code et suggestions d'optimisation" },
    { title: "Outil de génération automatique de code UI frontend", desc: "Reconnaissance d'images de maquettes, génération de CSS responsive" }
  ],
  'healthcare': [
    { title: "Assistant intelligent d'interprétation de rapports médicaux", desc: "OCR pour identifier les indicateurs clés, interpréter les valeurs anormales" },
    { title: "Conseiller en santé basé sur la recherche documentaire", desc: "Construction d'un graphe de connaissances médicales, réponses par RAG" },
    { title: "Plateforme d'analyse décisionnelle de données de recherche clinique", desc: "Intégration de données EMR, assistance à la génération de code d'analyse statistique" },
    { title: "Outil de génération automatique de rapports d'imagerie médicale", desc: "Description des caractéristiques d'imagerie, génération automatique de rapports structurés" },
    { title: "Assistant intelligent de rappels médicamenteux pour maladies chroniques", desc: "Génération de rappels personnalisés, vérification des contre-indications" }
  ],
  'security': [
    { title: "Moteur de détection et correction de vulnérabilités de code", desc: "Analyse SAST du code, analyse des principes de vulnérabilité" },
    { title: "Système de détection et interception de phishing par IA", desc: "Analyse du contenu des e-mails, identification des tentatives de phishing générées par IA" },
    { title: "Assistant de génération automatique de rapports quotidiens de sécurité", desc: "Consolidation des journaux, extraction automatique des événements clés" },
    { title: "Assistant de génération intelligente de rapports de tests de pénétration", desc: "Génération automatique de rapports basée sur les descriptions de vulnérabilités" },
    { title: "Assistant de recherche et d'analyse de renseignements sur les menaces", desc: "Connexion à des sources multiples de renseignements sur les menaces" }
  ],
  'finance': [
    { title: "Assistant intelligent de génération de rapports de due diligence", desc: "Saisie de données financières, génération automatique de rapports de due diligence" },
    { title: "Conseiller intelligent en gestion de patrimoine bancaire privé", desc: "Analyse du profil de risque du client, génération de suggestions d'allocation d'actifs" },
    { title: "Assistant de génération et vérification de conformité de prospectus IPO", desc: "Modèles modulaires, remplissage automatique des descriptions commerciales" },
    { title: "Système de génération automatique de rapports financiers et d'alertes d'anomalies", desc: "Génération automatique d'analyses financières et de discussions de la direction" },
    { title: "Assistant de simulation de scripts pour agents d'assurance", desc: "Simulation de dialogues, évaluation de la conformité et de la force de persuasion" }
  ],
  'enterprise': [
    { title: "Plateforme de vérification de conformité et suggestions de modification pour le cycle de vie des contrats", desc: "Comparaison des clauses avec le référentiel réglementaire, génération de rapports de conformité" },
    { title: "Transcription vocale de ventes et recommandation de scripts", desc: "Transcription ASR, analyse des conversations et recommandation de scripts performants" },
    { title: "Système de génération intelligente de contenu marketing", desc: "Génération de textes marketing et extraction de points de vente" },
    { title: "Plateforme d'analyse des dépenses publicitaires des concurrents", desc: "Collecte des publicités concurrentes, analyse des stratégies de diffusion" },
    { title: "Système d'analyse et de recommandation de sujets tendances", desc: "Analyse des tendances et recommandation d'angles de sujets" }
  ],
  'content': [
    { title: "Plateforme d'aide à la création de contenu pour films et romans", desc: "Fourniture de synopsis, développement de personnages, génération de dialogues" },
    { title: "Assistant intelligent de rédaction d'histoires de marque et de RP", desc: "Saisie de mots-clés de marque, génération de textes multi-styles" },
    { title: "Système de gestion d'interaction et de diffusion en direct par avatar numérique", desc: "Avatar numérique + synthèse vocale TTS + dialogue LLM" },
    { title: "Génération de scripts vidéo courts et montage intelligent", desc: "Génération de scripts et storyboards pour vidéos courtes" },
    { title: "Système de génération intelligente de contenu marketing", desc: "Génération de textes marketing et extraction de points de vente" }
  ],
  'government': [
    { title: "Système de navigation vocale intelligente et de répartition automatique pour la ligne d'assistance 12345", desc: "Reconnaissance vocale, compréhension des demandes et répartition intelligente" },
    { title: "Robot d'accueil et de questions-réponses sur les services administratifs", desc: "Recherche RAG dans la base de connaissances gouvernementales" },
    { title: "Plateforme de correspondance et de diffusion ciblée de politiques de soutien aux entreprises", desc: "Appariement automatique des profils d'entreprises avec les politiques applicables" },
    { title: "Assistant de pré-examen des documents administratifs et de vérification de conformité", desc: "OCR et extraction d'informations clés" },
    { title: "Plateforme d'identification et de gestion des événements urbains", desc: "Identification du type d'événement et répartition" }
  ],
  'legal': [
    { title: "Agent de détection de risques contractuels en un clic", desc: "Identification des problèmes potentiels par comparaison avec une liste de contrôle" },
    { title: "Conseiller IA d'évaluation du taux de succès de litiges similaires", desc: "Extraction de caractéristiques de cas, recherche et correspondance de cas similaires" },
    { title: "Radar de surveillance en temps réel des changements législatifs", desc: "Analyse des modifications et évaluation de l'impact commercial" },
    { title: "Outil AIGC de rédaction automatique de lettres de mise en demeure", desc: "Saisie des faits, génération de modèles de lettres de mise en demeure normalisées" },
    { title: "Plugin de traduction en langage simple de clauses juridiques complexes", desc: "Génération d'explications accessibles" }
  ],
  'travel': [
    { title: "Générateur d'itinéraires paresseux basé sur l'AIGC", desc: "Génération d'itinéraires quotidiens" },
    { title: "Robot de prédiction de tendances de prix de vols et d'hôtels et verrouillage automatique des prix bas", desc: "Modèle ML de prédiction des tendances de prix" },
    { title: "Système de pré-examen des documents de visa et d'aide au remplissage automatique", desc: "Vérification OCR de l'exhaustivité des informations" },
    { title: "Assistant de traduction vocale en temps réel et de visualisation de menus en voyage", desc: "Traduction vocale hors ligne, OCR de photos de menus" },
    { title: "Assistant de génération de récits de voyage et de posts sociaux à partir de traces de voyage", desc: "Extraction d'informations de photos, génération de textes de récits" }
  ],
  'emotion': [
    { title: "Compagnon virtuel d'accompagnement profond 24h/24 basé sur les LLM", desc: "Système de mémorisation stockant l'historique des conversations" },
    { title: "Conseiller AI de reconnaissance émotionnelle multimodale et d'accompagnement psychologique", desc: "Analyse du ton vocal + reconnaissance émotionnelle textuelle" },
    { title: "Agent numérique de rééducation cognitive et de stimulation mnésique pour personnes atteintes de la maladie d'Alzheimer", desc: "Jeux cognitifs, stimulation par vieilles photos" },
    { title: "Coach de simulation sociale AIGC pour personnes souffrant d'anxiété sociale", desc: "Simulation de scénarios sociaux virtuels" },
    { title: "Assistant de suivi d'humeur 24h/24 et de motivation positive par IA", desc: "Analyse des tendances d'humeur et génération de contenu motivant" }
  ],
  'entertainment': [
    { title: "Moteur de décision autonome de PNJ pour jeux en monde ouvert basé sur les LLM", desc: "Arbre de comportement des PNJ fusionné avec les décisions LLM" },
    { title: "Outil AIGC de progression narrative et d'assistance MJ pour murder games immersifs", desc: "Choix des joueurs déclenchant des branches narratives" },
    { title: "Modificateur génératif de fins pour fiction interactive", desc: "Les choix des lecteurs influencent le cours de l'histoire" },
    { title: "Analyste visuel CV et commentateur intelligent de parties esport", desc: "Analyse en temps réel du gameplay" },
    { title: "Système de génération automatique de livres audio multi-voix par TTS", desc: "Attribution de rôles textuels, génération de voix personnalisées" }
  ],
  'ecommerce': [
    { title: "Outil de production en masse de fiches produit à fort taux de conversion par AIGC", desc: "Génération de textes vendeurs et de descriptions de scènes" },
    { title: "Usine de génération de vidéos d'essayage virtuel par IA pour vêtements", desc: "Génération d'essayages virtuels" },
    { title: "Assistant de traduction et d'adaptation multilingue LLM pour e-commerce transfrontalier", desc: "Traduction multilingue de descriptions de produits" },
    { title: "Système de live shopping 24h/24 par avatar numérique AIGC", desc: "Avatar numérique + génération de scripts en temps réel" },
    { title: "Moteur de détection de tendances et de prédiction de produits populaires par IA", desc: "Analyse des tendances, suggestions de sélection" }
  ],
  'energy': [
    { title: "Analyse IA des comportements de consommation domestique et conseiller en économie d'énergie", desc: "Analyse des modes de consommation, génération de conseils d'économie" },
    { title: "Système de détection CV de défauts de panneaux photovoltaïques par drone", desc: "Inspection par drone, analyse d'images thermoinfrarouges" },
    { title: "Agent de prédiction de tendances de prix de l'énergie et de stratégie automatique de profit", desc: "Modèle de prédiction des prix, génération de stratégies" },
    { title: "Assistant IA de comptabilisation automatique des émissions carbone et de génération de rapports ESG", desc: "Calcul des facteurs d'émission, génération de rapports ESG" },
    { title: "Système IA de prévision de charge en conditions météorologiques extrêmes et de commande d'urgence", desc: "Modèle de prévision de charge, génération de stratégies d'ordonnancement" }
  ],
  'av-media': [
    { title: "Outil IA d'identification de moments forts et de montage automatique de vidéos longues", desc: "Analyse du contenu vidéo, identification des images clés" },
    { title: "Assistant IA de séparation intelligente du bruit de fond et d'amélioration vocale", desc: "Modèle de séparation audio, suppression du bruit de fond" },
    { title: "Station de restauration 4K et colorisation IA pour images anciennes", desc: "Modèle de super-résolution, colorisation automatique" },
    { title: "Système de doublage TTS de qualité professionnelle et contrôle des émotions", desc: "Modèle TTS multi-voix, contrôle émotionnel" },
    { title: "Assistant de transcription intelligente et d'extraction de TODO à partir d'enregistrements de réunions", desc: "Séparation et transcription vocale de réunions multi-participants" }
  ],
  'ai-marketing': [
    { title: "Moteur AIGC de rédaction automatique de posts viraux pour Xiaohongshu", desc: "Génération de posts sponsorisés, optimisation d'emojis" },
    { title: "Outil IA de mise en page de supports marketing et d'adaptation multi-tailles", desc: "Association intelligente de modèles de supports" },
    { title: "Plateforme AIGC de création de logos et de construction de charte VI", desc: "Génération créative de logos, génération de normes VI" },
    { title: "Assistant de suivi des tendances et de génération d'idées marketing opportunistes", desc: "Analyse des angles marketing, génération de concepts créatifs" },
    { title: "Outil AIGC de génération de scripts vidéo courts et d'aide au storyboard", desc: "Génération de scripts et de storyboards, conseils de tournage" }
  ],
  'data-intelligence': [
    { title: "Outil de génération automatique de requêtes SQL en langage naturel", desc: "Conversion de requêtes en langage naturel en SQL" },
    { title: "Système intelligent d'inventaire et de classification des actifs de données d'entreprise", desc: "Collecte de métadonnées, classification automatique" },
    { title: "Moteur de détection automatique et de suggestions de correction d'anomalies de données", desc: "Moteur de règles + modèle ML de détection d'anomalies" },
    { title: "Assistant de génération et de configuration de rapports intelligents", desc: "Génération conversationnelle de configurations de rapports" },
    { title: "Assistant Q&R intelligent sur les indicateurs de données", desc: "Construction d'une base de connaissances à partir de documents de définition d'indicateurs" }
  ]
}

// Table de correspondance des recommandations
const recommendationMap = {
  'creative-content': {
    'increase-efficiency': ['content', 'av-media', 'ai-marketing', 'entertainment'],
    'reduce-cost': ['content', 'ecommerce', 'ai-marketing'],
    'improve-experience': ['entertainment', 'emotion', 'travel', 'content'],
    'innovate-business': ['ai-marketing', 'content', 'av-media', 'entertainment']
  },
  'tech-service': {
    'increase-efficiency': ['programming', 'enterprise', 'data-intelligence', 'customer-service'],
    'reduce-cost': ['programming', 'enterprise', 'manufacturing'],
    'improve-experience': ['customer-service', 'enterprise', 'programming'],
    'innovate-business': ['data-intelligence', 'programming', 'security', 'enterprise']
  },
  'data-intel': {
    'increase-efficiency': ['data-intelligence', 'finance', 'enterprise', 'manufacturing'],
    'reduce-cost': ['data-intelligence', 'manufacturing', 'energy'],
    'improve-experience': ['data-intelligence', 'customer-service', 'ecommerce'],
    'innovate-business': ['data-intelligence', 'finance', 'security', 'ai-marketing']
  },
  'user-service': {
    'increase-efficiency': ['customer-service', 'ecommerce', 'travel', 'enterprise'],
    'reduce-cost': ['customer-service', 'ecommerce', 'enterprise'],
    'improve-experience': ['customer-service', 'emotion', 'travel', 'ecommerce', 'entertainment'],
    'innovate-business': ['ecommerce', 'travel', 'emotion', 'entertainment']
  },
  'industry-solution': {
    'increase-efficiency': ['manufacturing', 'healthcare', 'finance', 'government'],
    'reduce-cost': ['manufacturing', 'energy', 'enterprise', 'finance'],
    'improve-experience': ['healthcare', 'education', 'government', 'travel'],
    'innovate-business': ['finance', 'security', 'legal', 'healthcare', 'government']
  }
}

const interestOptions = [
  { label: 'Création de contenu', value: 'creative-content', desc: 'Textes, images, vidéos et autres contenus créatifs' },
  { label: 'Outils techniques', value: 'tech-service', desc: 'Outils de développement, automatisation, assistance au code' },
  { label: 'Analyse de données', value: 'data-intel', desc: 'Analyse de données, prévision, décision intelligente' },
  { label: 'Expérience utilisateur', value: 'user-service', desc: 'Service client, marketing, expérience utilisateur' },
  { label: 'Solutions sectorielles', value: 'industry-solution', desc: 'Applications approfondies dans des secteurs spécifiques' }
]

const purposeOptions = [
  { label: 'Améliorer l\'efficacité', value: 'increase-efficiency', desc: 'Automatisation, accélération des processus' },
  { label: 'Réduire les coûts', value: 'reduce-cost', desc: 'Réduction de la main-d\'œuvre, optimisation des ressources' },
  { label: 'Améliorer l\'expérience', value: 'improve-experience', desc: 'Satisfaction client, qualité de service' },
  { label: 'Innovation commerciale', value: 'innovate-business', desc: 'Nouveaux produits, nouveaux modèles' }
]

const industries = [
  { key: 'manufacturing', name: 'Industrie manufacturière', anchor: '#_1-industrie-manufacturiere' },
  { key: 'customer-service', name: 'Service client intelligent', anchor: '#_2-service-client-intelligent' },
  { key: 'education', name: 'Éducation', anchor: '#_3-education' },
  { key: 'programming', name: 'Programmation intelligente', anchor: '#_4-programmation-intelligente' },
  { key: 'healthcare', name: 'Santé', anchor: '#_5-sante' },
  { key: 'security', name: 'Cybersécurité', anchor: '#_6-cybersecurite' },
  { key: 'finance', name: 'Finance, banque et assurance', anchor: '#_7-finance-banque-et-assurance' },
  { key: 'enterprise', name: 'Services d\'entreprise', anchor: '#_8-services-dentreprise' },
  { key: 'content', name: 'Production et exploitation de contenu', anchor: '#_9-production-et-exploitation-de-contenu' },
  { key: 'government', name: 'Administration publique intelligente', anchor: '#_10-administration-publique-intelligente' },
  { key: 'legal', name: 'Affaires juridiques et gestion contractuelle', anchor: '#_11-affaires-juridiques-et-gestion-contractuelle' },
  { key: 'travel', name: 'Tourisme et voyages', anchor: '#_12-tourisme-et-voyages' },
  { key: 'emotion', name: 'Accompagnement émotionnel', anchor: '#_13-accompagnement-emotionnel' },
  { key: 'entertainment', name: 'Loisirs et divertissement', anchor: '#_14-loisirs-et-divertissement' },
  { key: 'ecommerce', name: 'E-commerce', anchor: '#_15-e-commerce' },
  { key: 'energy', name: 'Énergie', anchor: '#_16-energie' },
  { key: 'av-media', name: 'Audiovisuel', anchor: '#_17-audiovisuel' },
  { key: 'ai-marketing', name: 'Marketing IA', anchor: '#_18-marketing-ia' },
  { key: 'data-intelligence', name: 'Intelligence de données', anchor: '#_19-intelligence-de-donnees' }
]

const recommendationTopics = computed(() => {
  if (!interestPoint.value || !purpose.value) return []
  const keys = recommendationMap[interestPoint.value]?.[purpose.value] || []
  const topics = []
  keys.forEach(key => {
    const industry = industries.find(item => item.key === key)
    const industryTopics = topicPool[key] || []
    if (industry && industryTopics.length > 0) {
      const count = Math.floor(Math.random() * 2) + 1
      const shuffled = [...industryTopics].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(count, shuffled.length))
      selected.forEach(topic => {
        topics.push({ ...topic, industryKey: key, industryName: industry.name, industryAnchor: industry.anchor })
      })
    }
  })
  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

const currentSelection = computed(() => {
  const interest = interestOptions.find(i => i.value === interestPoint.value)
  const pur = purposeOptions.find(p => p.value === purpose.value)
  return { interest: interest?.label || '', purpose: pur?.label || '' }
})

const scrollToAnchor = (anchor) => {
  setTimeout(() => {
    let element = document.querySelector(anchor)
    if (!element) {
      const altAnchor = anchor.replace('#_', '#')
      element = document.querySelector(altAnchor)
    }
    if (!element) {
      const anchorText = decodeURIComponent(anchor.replace('#', '').replace(/^_/, ''))
      const headings = document.querySelectorAll('h2, h3')
      for (let heading of headings) {
        const headingText = heading.textContent.trim()
        const cleanHeading = headingText.replace(/^\d+\.\s*/, '')
        if (cleanHeading === anchorText || headingText.includes(anchorText)) {
          element = heading
          break
        }
      }
    }
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      element.style.backgroundColor = '#f0f9ff'
      element.style.transition = 'background-color 0.3s'
      element.style.padding = '8px'
      element.style.borderRadius = '4px'
      setTimeout(() => { element.style.backgroundColor = ''; element.style.padding = '' }, 2000)
    }
  }, 100)
}

const resetSelection = () => {
  interestPoint.value = ''
  purpose.value = ''
}

// ---- C 端场景变量 ----
const cDuration = 'Environ <strong>4 heures</strong>'

const vibePoint = ref('')
const feeling = ref('')

// Pool de thèmes pour chaque scénario - accent sur les sensations, l'ambiance, les suggestions psychologiques
const cTopicPool = {
  'lifestyle': [
    { title: 'Assistant de réveil rituel matinal', desc: 'Générer un rituel matinal personnalisé selon la météo, l\'agenda et l\'humeur, pour bien commencer chaque journée' },
    { title: 'Créateur d\'ambiance pour célibataires', desc: 'Concevoir des solutions d\'ambiance intérieure pour les personnes vivant seules : éclairage, musique, diffuseur d\'huiles essentielles' },
    { title: 'Générateur de programme cocooning week-end', desc: 'Recommander la combinaison parfaite selon l\'humeur du moment : film + snacks + décoration d\'ambiance' },
    { title: 'Radio apaisante du soir', desc: 'Générer des histoires douces, des guidages de méditation, une radio personnelle pour s\'endormir' },
    { title: 'Chasseur d\'inspiration esthétique du quotidien', desc: 'Découvrir la beauté dans les petites choses du quotidien, générer des suggestions esthétiques et des guides rituels' }
  ],
  'emotion': [
    { title: 'Confident nocturne', desc: 'Réceptacle émotionnel disponible 24h/24, accueillant sans jugement toutes les confidences' },
    { title: 'Accompagnateur de guérison post-rupture', desc: 'Offrir une présence douce, des conseils de guérison et un exutoire émotionnel pendant les moments difficiles' },
    { title: 'Coach de respiration anti-anxiété', desc: 'Percevoir l\'anxiété, guider des exercices de respiration et de méditation en pleine conscience' },
    { title: 'Mentor de reconstruction de la confiance en soi', desc: 'Aider à reconstruire l\'estime de soi et le sentiment de valeur grâce à des dialogues positifs et des suggestions psychologiques' },
    { title: 'Analyse intelligente du journal émotionnel', desc: 'Analyser le journal émotionnel, découvrir les schémas émotionnels, offrir des perspectives chaleureuses et des conseils' }
  ],
  'entertainment': [
    { title: 'Maître du jeu immersif (murder mystery)', desc: 'Jouer le rôle du maître du jeu, créer une ambiance mystérieuse, faire avancer l\'intrigue' },
    { title: 'NPC sensible dans un monde ouvert', desc: 'Des NPC avec une vraie personnalité, qui se souviennent de l\'histoire du joueur et créent des liens émotionnels authentiques' },
    { title: 'Génération de contenu podcast personnalisé', desc: 'Générer un podcast exclusif selon les centres d\'intérêt, aussi naturel qu\'une conversation entre amis' },
    { title: 'Équipe d\'ambiance pour concert virtuel', desc: 'Créer une atmosphère live pour les concerts en ligne : interactions en temps réel, soutien, rendu d\'ambiance' },
    { title: 'Partenaire de co-création de fiction interactive', desc: 'Co-créer une histoire avec le lecteur, chaque choix influence la direction du monde narratif' }
  ],
  'growth': [
    { title: 'Témoin de croissance personnelle', desc: 'Enregistrer les trajectoires de développement, offrir encouragements et rétrospectives aux moments clés' },
    { title: 'Coach ludifié de formation d\'habitudes', desc: 'Transformer la formation d\'habitudes ennuyeuses en une aventure ludique' },
    { title: 'Appariement de partenaires d\'apprentissage', desc: 'Trouver des partenaires d\'apprentissage partageant les mêmes centres d\'intérêt, s\'encourager mutuellement et partager les progrès' },
    { title: 'Découvreur de petites joies quotidiennes', desc: 'Aider à découvrir les petites beautés de la vie, cultiver la gratitude et un état d\'esprit positif' },
    { title: 'Simulateur d\'expériences de vie', desc: 'Simuler différents choix de vie, explorer les possibilités d\'une réalité parallèle' }
  ],
  'social': [
    { title: 'Générateur de sujets brise-glace', desc: 'Fournir des sujets intéressants lors d\'événements sociaux, dissiper la gêne et rapprocher les gens' },
    { title: 'Styliste d\'ambiance pour publications sociales', desc: 'Générer des textes élégants pour les réseaux sociaux à partir de photos et de l\'humeur' },
    { title: 'Planificateur d\'ambiance pour rendez-vous', desc: 'Concevoir un plan d\'ambiance complet pour les rendez-vous : lieu, sujets de conversation et surprises' },
    { title: 'Animateur de réunions à distance', desc: 'Animer les réunions en ligne, organiser des jeux et guider les interactions' },
    { title: 'Assistant de gestion d\'énergie sociale', desc: 'Aider les introvertis à gérer leur énergie sociale et à trouver un rythme social confortable' }
  ],
  'creative': [
    { title: 'Kit d\'urgence anti-panne d\'inspiration', desc: 'Fournir des étincelles d\'inspiration inattendues en cas de blocage créatif' },
    { title: 'Guide d\'exploration du style personnel', desc: 'Aider à découvrir un style personnel unique, du vestimentaire à l\'expression' },
    { title: 'Consultant esthétique pour journal et bulletins', desc: 'Fournir des suggestions esthétiques de mise en page, couleurs et contenu créatif' },
    { title: 'Guide d\'ambiance photographique', desc: 'Fournir des conseils de photographie et de retouche selon le contexte et l\'ambiance souhaitée' },
    { title: 'Adaptateur musique-humeur', desc: 'Recommander la combinaison musicale parfaite selon l\'humeur et le contexte du moment' }
  ],
  'travel': [
    { title: 'Guide d\'exploration urbaine à pied', desc: 'Explorer la ville comme un local, découvrir des lieux cachés et authentiques' },
    { title: 'Génération de journal de voyage émotionnel', desc: 'Transformer les photos et sentiments de voyage en un récit de voyage poétique et des souvenirs' },
    { title: 'Compagnon pour voyageurs solitaires', desc: 'Offrir compagnie, conseils et sentiment de sécurité aux voyageurs solo' },
    { title: 'Aperçu d\'ambiance de destination', desc: 'Vivre une expérience immersive de la destination avant le départ, se mettre dans l\'ambiance' },
    { title: 'Guide d\'ambiance photographique de voyage', desc: 'Guider pour prendre des photos de voyage pleines d\'histoires selon le contexte et la lumière' }
  ],
  'health': [
    { title: 'Réveilleur de motivation sportive', desc: 'Offrir juste ce qu\'il faut d\'encouragement et de motivation quand l\'envie de bouger n\'est pas là' },
    { title: 'Cuisine inspiration alimentation saine', desc: 'Générer des recettes saines réconfortantes selon l\'humeur et les ingrédients disponibles' },
    { title: 'Optimisateur d\'ambiance pour la qualité du sommeil', desc: 'Créer une ambiance de sommeil optimale de l\'environnement au psychologique' },
    { title: 'Guide de perception corporelle', desc: 'Guider l\'attention sur les signaux du corps, établir la connexion corps-esprit' },
    { title: 'Assistant rappel de self-care', desc: 'Rappeler de s\'arrêter dans l\'agitation et de prendre soin de soi' }
  ],
  'learning': [
    { title: 'Guide ludifié d\'exploration des savoirs', desc: 'Transformer l\'apprentissage de connaissances ennuyeuses en une aventure d\'exploration amusante' },
    { title: 'Partenaire de scénarios d\'apprentissage linguistique', desc: 'Jouer différents rôles, acquérir naturellement la langue dans des dialogues situationnels' },
    { title: 'Assistant de satisfaction de la curiosité', desc: 'Répondre à toutes sortes d\'idées farfelues, satisfaire la curiosité pour le monde' },
    { title: 'Stimulateur d\'inspiration pour notes de lecture', desc: 'Aider à organiser les réflexions de lecture, découvrir de nouveaux angles de pensée' },
    { title: 'Créateur d\'ambiance pour le partage de connaissances', desc: 'Transformer les connaissances acquises en contenus de partage intéressants' }
  ],
  'relationship': [
    { title: 'Coach de communication en couple', desc: 'Aider à exprimer les émotions difficiles à dire, améliorer les relations intimes' },
    { title: 'Assistant rappel d\'attention familiale', desc: 'Rappeler de prendre soin de sa famille, fournir des suggestions d\'interactions chaleureuses' },
    { title: 'Mainteneur d\'ambiance d\'amitié', desc: 'Aider à entretenir les amitiés à distance, créer des sujets de conversation communs' },
    { title: 'Planificateur de déclarations et surprises', desc: 'Planifier des moments inoubliables et romantiques pour les personnes importantes' },
    { title: 'Guide d\'apaisement des conflits', desc: 'Fournir des conseils et des formulations pour apaiser l\'ambiance lors de tensions relationnelles' }
  ],
  'pet': [
    { title: 'Journal anthropomorphique de l\'animal', desc: 'Générer un journal du point de vue de l\'animal, enregistrer les moments chaleureux avec le maître' },
    { title: 'Interprète du comportement animal', desc: 'Décoder le langage comportemental de l\'animal, approfondir le lien avec lui' },
    { title: 'Planificateur de moments complicité animal', desc: 'Concevoir des activités créatives pour interagir avec l\'animal, renforcer la complicité' },
    { title: 'Générateur d\'histoires souvenir animalières', desc: 'Transformer les photos et souvenirs de l\'animal en histoires chaleureuses' },
    { title: 'Guide rassurant pour nouveaux maîtres', desc: 'Offrir une présence chaleureuse et des conseils aux nouveaux propriétaires d\'animaux' }
  ],
  'finance': [
    { title: 'Assistant de conscience émotionnelle des dépenses', desc: 'Percevoir les émotions derrière les achats impulsifs, construire une vision saine de la consommation' },
    { title: 'Motivation visuelle des objectifs d\'épargne', desc: 'Transformer les objectifs d\'épargne en progression visuelle de rêves' },
    { title: 'Apprendre la gestion financière facilement', desc: 'Apprendre les connaissances financières de manière légère et amusante' },
    { title: 'Apaisseur d\'anxiété financière', desc: 'Offrir soutien émotionnel et conseils pratiques face à la pression financière' },
    { title: 'Jeu d\'expérience d\'investissement à petit montant', desc: 'Découvrir l\'investissement par le jeu, baisser la barrière d\'entrée' }
  ],
  'career': [
    { title: 'Compagnon de doute professionnel', desc: 'Offrir écoute, exploration et suggestions d\'orientation pendant les périodes de doute professionnel' },
    { title: 'Réveilleur de sentiment d\'accomplissement au travail', desc: 'Aider à découvrir la valeur et le sens dans le travail, raviver l\'enthousiasme' },
    { title: 'Assistant d\'ambiance sociale au travail', desc: 'Fournir des sujets de conversation légers et des suggestions d\'interaction pour le networking professionnel' },
    { title: 'Stimulateur d\'idées d\'activité secondaire', desc: 'Stimuler des idées créatives d\'activité parallèle selon les centres d\'intérêt et compétences' },
    { title: 'Station-service de confiance avant entretien', desc: 'Offrir préparation psychologique et encouragement avant un entretien' }
  ],
  'home': [
    { title: 'Designer d\'ambiance d\'espace intérieur', desc: 'Concevoir des solutions d\'ambiance intérieure selon l\'humeur et la saison' },
    { title: 'Guide de transformation saisonnière du logement', desc: 'Changer la décoration intérieure au fil des saisons, garder un sentiment de fraîcheur' },
    { title: 'Magie des petits espaces', desc: 'Créer une ambiance chaleureuse et confortable même dans les petits espaces' },
    { title: 'Créateur de rituels du quotidien à la maison', desc: 'Créer des rituels pour les activités domestiques quotidiennes' },
    { title: 'Compagnon psychologique du désencombrement', desc: 'Offrir soutien psychologique et conseils de décision lors du tri des affaires' }
  ],
  'food': [
    { title: 'Cuisine réconfortante pour une personne', desc: 'Concevoir des solutions culinaires simples et réconfortantes pour les personnes vivant seules' },
    { title: 'Design d\'ambiance de table de fête', desc: 'Concevoir une mise en table rituelle pour les occasions spéciales' },
    { title: 'Adaptateur cuisine-humeur', desc: 'Recommander des aliments et recettes adaptés selon l\'humeur du moment' },
    { title: 'Constructeur de confiance pour débutants en cuisine', desc: 'Offrir encouragements chaleureux et recettes simples aux cuisiniers débutants' },
    { title: 'Guide d\'ambiance photographie culinaire', desc: 'Faire en sorte que même les plats maison rendent irrésistiblement bien en photo' }
  ],
  'fashion': [
    { title: 'Mood board de tenue du jour', desc: 'Générer des inspirations de tenues selon la météo, l\'occasion et l\'humeur' },
    { title: 'Styliste de garde-robe capsule', desc: 'Créer des combinaisons infinies avec un nombre limité de pièces' },
    { title: 'Voyage d\'exploration du style personnel', desc: 'Aider à découvrir et construire un style personnel unique' },
    { title: 'Créatif de relookage vestimentaire', desc: 'Offrir de nouvelles inspirations d\'association pour les vêtements existants' },
    { title: 'Consultant look pour occasions spéciales', desc: 'Concevoir des tenues qui inspirent confiance pour les événements importants' }
  ]
}

// Table de correspondance de recommandations prédéfinie - basée sur l'ambiance et les sensations
const cRecommendationMap = {
  // Point d'ambiance : Guérison
  'healing': {
    'relax': ['emotion', 'lifestyle', 'health', 'home'],
    'inspire': ['creative', 'growth', 'learning', 'entertainment'],
    'connect': ['relationship', 'social', 'pet', 'emotion'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Point d'ambiance : Croissance
  'growth': {
    'relax': ['growth', 'learning', 'creative', 'health'],
    'inspire': ['career', 'learning', 'creative', 'growth'],
    'connect': ['social', 'relationship', 'career', 'learning'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Point d'ambiance : Social
  'social': {
    'relax': ['social', 'pet', 'food', 'home'],
    'inspire': ['social', 'creative', 'entertainment', 'travel'],
    'connect': ['relationship', 'social', 'pet', 'travel'],
    'escape': ['social', 'travel', 'entertainment', 'creative']
  },
  // Point d'ambiance : Exploration
  'explore': {
    'relax': ['travel', 'creative', 'lifestyle', 'food'],
    'inspire': ['travel', 'creative', 'learning', 'entertainment'],
    'connect': ['travel', 'social', 'relationship', 'pet'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Point d'ambiance : Quotidien
  'daily': {
    'relax': ['lifestyle', 'home', 'health', 'emotion'],
    'inspire': ['creative', 'food', 'fashion', 'home'],
    'connect': ['relationship', 'social', 'pet', 'lifestyle'],
    'escape': ['entertainment', 'creative', 'travel', 'lifestyle']
  }
}

const vibeOptions = [
  { label: 'Guérison', value: 'healing', desc: 'Chaleur, apaisement, réconfort' },
  { label: 'Croissance', value: 'growth', desc: 'Progrès, percée, transformation' },
  { label: 'Social', value: 'social', desc: 'Connexion, partage, interaction' },
  { label: 'Exploration', value: 'explore', desc: 'Curiosité, aventure, découverte' },
  { label: 'Quotidien', value: 'daily', desc: 'Ordinaire, authentique, ici et maintenant' }
]

const feelingOptions = [
  { label: 'Envie de se détendre', value: 'relax', desc: 'Relâcher la pression, se vider l\'esprit' },
  { label: 'Chercher l\'inspiration', value: 'inspire', desc: 'Stimuler la créativité, trouver l\'élan' },
  { label: 'Besoin de connexion', value: 'connect', desc: 'Se connecter aux autres, résonance émotionnelle' },
  { label: 'S\'évader un moment', value: 'escape', desc: 'Échapper à la réalité, immersion totale' }
]

const scenarios = [
  { key: 'lifestyle', name: 'Style de vie', anchor: '#_1-style-de-vie' },
  { key: 'emotion', name: 'Accompagnement émotionnel', anchor: '#_2-accompagnement-emotionnel' },
  { key: 'entertainment', name: 'Divertissement et loisirs', anchor: '#_3-divertissement-et-loisirs' },
  { key: 'growth', name: 'Développement personnel', anchor: '#_4-developpement-personnel' },
  { key: 'social', name: 'Interactions sociales', anchor: '#_5-interactions-sociales' },
  { key: 'creative', name: 'Expression créative', anchor: '#_6-expression-creative' },
  { key: 'travel', name: 'Voyage et exploration', anchor: '#_7-voyage-et-exploration' },
  { key: 'health', name: 'Santé physique et mentale', anchor: '#_8-sante-physique-et-mentale' },
  { key: 'learning', name: 'Exploration des savoirs', anchor: '#_9-exploration-des-savoirs' },
  { key: 'relationship', name: 'Entretien des relations', anchor: '#_10-entretien-des-relations' },
  { key: 'pet', name: 'Compagnie animulaire', anchor: '#_11-compagnie-animulaire' },
  { key: 'finance', name: 'Santé financière', anchor: '#_12-sante-financiere' },
  { key: 'career', name: 'Développement professionnel', anchor: '#_13-developpement-professionnel' },
  { key: 'home', name: 'Espace intérieur', anchor: '#_14-espace-interieur' },
  { key: 'food', name: 'Gastronomie et cuisine', anchor: '#_15-gastronomie-et-cuisine' },
  { key: 'fashion', name: 'Style vestimentaire', anchor: '#_16-style-vestimentaire' }
]

// Calculer les résultats de recommandation - tirer au hasard depuis le pool de thèmes
const cRecommendationTopics = computed(() => {
  if (!vibePoint.value || !feeling.value) return []
  
  const keys = cRecommendationMap[vibePoint.value]?.[feeling.value] || []
  const topics = []
  
  // Tirer au hasard 1-2 thèmes de chaque scénario recommandé
  keys.forEach(key => {
    const scenario = scenarios.find(item => item.key === key)
    const scenarioTopics = cTopicPool[key] || []
    
    if (scenario && scenarioTopics.length > 0) {
      // Tirer au hasard 1-2 thèmes
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
  
  // Trier aléatoirement et limiter le nombre total
  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

// Obtenir la description de la sélection actuelle
const cCurrentSelection = computed(() => {
  const vibe = vibeOptions.find(i => i.value === vibePoint.value)
  const feel = feelingOptions.find(p => p.value === feeling.value)
  return {
    vibe: vibe?.label || '',
    feeling: feel?.label || ''
  }
})

const cScrollToAnchor = (anchor) => {
  // Retarder le défilement pour s'assurer que le DOM est mis à jour
  setTimeout(() => {
    // Essayer de trouver par ID (prend en charge plusieurs formats)
    let element = document.querySelector(anchor)
    
    // Si non trouvé, essayer d'autres formats d'ID possibles
    if (!element) {
      // Essayer sans le préfixe underscore
      const altAnchor = anchor.replace('#_', '#')
      element = document.querySelector(altAnchor)
    }
    
    // Si toujours pas trouvé, chercher par texte de titre
    if (!element) {
      // Extraire le nom du scénario depuis l'ancre
      const anchorText = decodeURIComponent(anchor.replace('#', '').replace(/^_/, ''))
      const headings = document.querySelectorAll('h2, h3')
      
      for (let heading of headings) {
        const headingText = heading.textContent.trim()
        // Correspondance exacte ou partielle
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
      // Mettre en surbrillance le paragraphe cible
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

# Référence des scénarios d'application IA (B2B et B2C)

<Tabs>
<TabItem label="B2B Industrie">

## Introduction du chapitre

<ChapterIntroduction :duration="duration" :tags="['Applications B2B', 'Applications industrielles', 'Scénarios IA', 'Références de mise en œuvre', 'Solutions sectorielles']" coreOutput="Découvrir plus de 15 scénarios d'application B2B" expectedOutput="Trouver une direction de projet adaptée aux clients professionnels">

Ce document recense les <strong>applications concrètes des modèles LLM dans les scénarios d'entreprise B2B</strong>. Contrairement aux applications B2C centrées sur l'expérience utilisateur et l'émotion, les produits B2B mettent l'accent sur la <strong>résolution de besoins métier réels, l'amélioration de l'efficacité et la réduction des coûts</strong>. Chaque scénario présente une <strong>faisabilité de mise en œuvre concrète</strong>, couvrant une démarche complète de <strong>l'analyse des besoins à l'implémentation technique</strong>, destinée aux développeurs d'applications IA pour les clients professionnels.

</ChapterIntroduction>

## Sélection rapide par secteur

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #409EFF;">
  <div style="font-weight: 600; margin-bottom: 8px;">Trouvez votre scénario d'application</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    Sélectionnez votre domaine d'intérêt et votre objectif, le système recommandera les scénarios pertinents. Cliquez sur un tag pour accéder au chapitre correspondant.
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="interestPoint" placeholder="Sélectionnez un domaine d'intérêt" style="width: 100%;">
        <el-option v-for="item in interestOptions" :key="item.value" :label="item.label" :value="item.value">
          <div style="display: flex; flex-direction: column;">
            <span>{{ item.label }}</span>
            <span style="font-size: 12px; color: #909399;">{{ item.desc }}</span>
          </div>
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-select v-model="purpose" placeholder="Sélectionnez un objectif" style="width: 100%;">
        <el-option v-for="item in purposeOptions" :key="item.value" :label="item.label" :value="item.value">
          <div style="display: flex; flex-direction: column;">
            <span>{{ item.label }}</span>
            <span style="font-size: 12px; color: #909399;">{{ item.desc }}</span>
          </div>
        </el-option>
      </el-select>
    </el-col>
  </el-row>
  
  <div v-if="recommendationTopics.length > 0" style="margin-top: 16px;">
    <div style="font-weight: 600; margin-bottom: 10px; color: #409EFF;">
      {{ recommendationTopics.length }} scénarios d'application recommandés
      <span style="font-weight: normal; color: #909399; font-size: 13px; margin-left: 8px;">
        ({{ currentSelection.interest }} + {{ currentSelection.purpose }})
      </span>
    </div>
    <el-table :data="recommendationTopics" style="width: 100%; cursor: pointer;" @row-click="(row) => scrollToAnchor(row.industryAnchor)" highlight-current-row>
      <el-table-column prop="title" label="Scénario d'application" min-width="300">
        <template #default="scope">
          <div style="font-weight: 500; color: #303133;">{{ scope.row.title }}</div>
          <div style="font-size: 12px; color: #909399; margin-top: 4px;">{{ scope.row.desc }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="industryName" label="Secteur" width="180" align="center">
        <template #default="scope">
          <el-tag type="info" effect="light" size="small">{{ scope.row.industryName }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px; font-size: 12px; color: #909399;">
      💡 Cliquez sur n'importe quelle ligne du tableau pour accéder au chapitre correspondant
    </div>
  </div>
  
  <div v-else-if="!interestPoint || !purpose" style="margin-top: 14px; color: #909399; font-size: 13px;">
    <span v-if="!interestPoint && !purpose">💡 Veuillez sélectionner un domaine d'intérêt et un objectif</span>
    <span v-else-if="!interestPoint">💡 Veuillez sélectionner un domaine d'intérêt</span>
    <span v-else>💡 Veuillez sélectionner un objectif</span>
  </div>
  
  <div v-if="interestPoint || purpose" style="margin-top: 12px;">
    <el-button size="small" @click="resetSelection">Réinitialiser</el-button>
  </div>
</el-card>

## Présentation rapide des secteurs

### Choix technologique courant

En développement d'applications IA, les directions technologiques courantes incluent :

1. **LLM (grands modèles de langage)** : compétents pour les tâches en langage naturel telles que la conversation, la génération de texte, le résumé, la traduction, etc., adaptés à la construction d'applications de service client, de création de contenu et de Q&R.
2. **VLM (modèles vision-langage)** : combinent la compréhension visuelle et les capacités linguistiques pour la description d'images, la réponse aux questions visuelles, la génération de contenu multimodal, etc.
3. **GenAI (IA générative)** : inclut la génération de texte, d'images (Stable Diffusion, DALL·E), de vidéos, etc., permettant de créer rapidement du contenu créatif.

### Stratégie de sélection

Les apprenants peuvent choisir leur direction en fonction des dimensions suivantes :

1. **Orienté par l'intérêt** : prioriser les secteurs ou directions techniques qui vous intéressent.
2. **Adaptation sectorielle** : tirer parti de votre expérience professionnelle ou de vos ressources.
3. **Difficulté technique** : choisir en fonction de votre niveau technique.

## 1. Industrie manufacturière 

Les scénarios de l'industrie manufacturière s'articulent autour de trois axes principaux : l'aide à la conception, l'optimisation de la production et la maintenance intelligente.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Plateforme d'aide au design extérieur de bus électriques par IA | Génération de designs conceptuels, vérification des normes via LLM, intégration Three.js pour le rendu 3D |
| 2 | Assistant intelligent de conception et vérification de plans | Base de connaissances RAG des normes de conception, API CAD pour l'analyse automatique des plans |
| 3 | Génération automatique et gestion de documentation technique | Génération automatique de spécifications et manuels à partir de la base de données produit, stockage vectoriel ChromaDB |
| 4 | Assistant de génération automatique de rapports d'inspection d'équipements | Description vocale de l'état des équipements, génération structurée de rapports par LLM, association automatique des historiques de pannes |
| 5 | Système intelligent de planification et d'ordonnancement pour chariots industriels | LLM analyse les commandes et les positions d'entrepôt, génération de plans d'ordonnancement optimaux via API cartographiques |
| 6 | Entrepôt de données basé sur LLM et recherche en langage naturel | Conversion Text-to-SQL, visualisation Superset, moteur OLAP Doris ou ClickHouse |
| 7 | Assistant Q&R de diagnostic de pannes d'équipements industriels | Base de connaissances vectorielle construite à partir d'historiques de pannes, suggestions de diagnostic par LLM |
| 8 | Génération intelligente de rapports de contrôle qualité et classification de défauts | OCR pour identifier les défauts, génération structurée de rapports par LLM, classification automatique des types de défauts |
| 9 | Assistant intelligent d'inventaire et génération de rapports d'inventaire | Saisie des données d'inventaire, comparaison automatique avec le stock système, alertes sur les écarts |
| 10 | Système Q&R intelligent d'optimisation de processus de fabrication | Base de connaissances RAG construite à partir de documents de processus, suggestions d'optimisation par LLM |

## 2. Service client intelligent

Les scénarios de service client se concentrent sur l'amélioration de l'efficacité et l'optimisation de l'expérience utilisateur.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Système de réponse automatique multicanal et génération de tickets | Intégration multi-canal (WeChat, APP, site web), compréhension LLM des intentions, création automatique de tickets, construction du flux conversationnel via LangChain, stockage MySQL |
| 2 | Assistant de prospection et suivi de prospects potentiels | Analyse LLM des historiques de conversations, identification et scoring des prospects à forte intention, système de recommandation avec filtrage collaboratif |
| 3 | Système de recherche intelligente et Q&R de connaissances internes | Base de connaissances vectorielle construite à partir de Confluence et documents internes, réponses LLM via RAG |
| 4 | Système d'enquête de satisfaction et d'amélioration du service | Analyse LLM du contenu des conversations pour la classification émotionnelle et le scoring de satisfaction, rapports BI |
| 5 | Outil de résumé intelligent de conversations et génération de tickets | Résumé automatique de session après clôture de la conversation, extraction d'informations clés, remplissage automatique des champs du ticket |
| 6 | Assistant de détection automatique de conformité des scripts de service | Détection en temps réel de la conformité des réponses du service client, identification des mots sensibles, suggestions de modification |
| 7 | Outil de résumé automatique et classification de tickets de service | Résumé automatique et étiquetage de longues conversations par LLM, recherche plein texte via Elasticsearch |
| 8 | Outil de surveillance émotionnelle des clients et alertes d'anomalies | Analyse en temps réel des caractéristiques vocales et du sentiment textuel, alertes LLM sur les émotions anormales, notifications WebSocket |
| 9 | Système de recommandation de scripts de service client performants | Analyse LLM des conversations exemplaires, extraction de modèles de scripts performants, recommandation contextuelle en temps réel |
| 10 | Assistant d'analyse de contenu et de contrôle qualité pour appels sortants | Transcription ASR des appels sortants, analyse de contenu par LLM, génération automatique de rapports de contrôle et suggestions d'amélioration |

## 3. Éducation

Les scénarios éducatifs visent à réaliser un enseignement personnalisé et une gestion éducative intelligente.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Planification de parcours d'apprentissage linguistique personnalisé et système de tutorat intelligent | Évaluation LLM du niveau de l'apprenant, planification quotidienne des tâches d'apprentissage, algorithme de recommandation combinant graphe de connaissances |
| 2 | Plateforme de création automatique de plans de cours et de ressources pédagogiques | Génération LLM de cadres de plans de cours et de conceptions pédagogiques, stockage vectoriel de plans de cours et supports, recherche par mots-clés et recommandation de similarité |
| 3 | Système de correction automatique et diagnostic de résultats scolaires | Correction automatique LLM de questions ouvertes avec suggestions, localisation des lacunes via graphe de connaissances |
| 4 | Construction de modèles de compétences et cartographie d'apprentissage | Analyse LLM des descriptions de postes pour extraire les compétences, construction de profils de compétences, génération de cartes d'apprentissage personnalisées |
| 5 | Outil de construction de programmes scolaires et de création de supports de cours | Analyse LLM des caractéristiques de l'école et des besoins des élèves, génération de cadres de programmes scolaires, intégration d'API de génération PPT |
| 6 | Pratique orale de langues en scénarios individuels | LLM joue différents rôles pour des dialogues oraux, reconnaissance ASR de la prononciation et notation, synthèse TTS de la prononciation standard |
| 7 | Plateforme de recommandation et d'orientation universitaire basée sur le big data | Analyse LLM des scores, classements et intérêts des candidats, recommandation d'établissements et de filières basée sur les données d'admission |
| 8 | Assistant de code pour l'initiation à la programmation des enfants | Explication LLM de la logique du code et guidance de programmation, support commutation bloc-langage et Python |
| 9 | Outil de génération automatique de cartes mentales de connaissances et recommandation de parcours | Saisie d'un sujet de cours, génération automatique de cartes mentales par LLM, recommandation du contenu suivant en fonction de la progression |
| 10 | Moteur de notation et de correction automatique de compositions en chinois et anglais | Scoring multidimensionnel par LLM (structure, langue, diversité) et génération d'annotations, comparaison avec des modèles de compositions |

## 4. Programmation intelligente

Les scénarios de programmation intelligente visent à améliorer l'efficacité du développement et la qualité du code.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Assistant de complétion de code et correction automatique de bugs | Complétion de code en temps réel via plugin IDE basé sur un modèle CodeLlama fine-tuné, analyse LLM des piles d'erreur pour localiser les bugs et générer le code correctif |
| 2 | Plateforme de construction low-code et automatisation de processus | Description en langage naturel convertie par LLM en configuration low-code ou en squelette de code |
| 3 | Système de génération de tests unitaires | Analyse AST du code source pour extraire la logique des fonctions, LLM génère des tests aux limites et aux scénarios d'exception, intégration Jest/Pytest |
| 4 | Outil d'analyse de code et migration entre langages | Analyse de la structure du code via Tree-sitter, suggestions d'optimisation par LLM, migration entre langages via moteur de règles |
| 5 | Outil de génération automatique de requêtes SQL en langage naturel | Conversion LLM de requêtes en langage naturel en SQL, support des jointures multi-tables et des agrégations |
| 6 | Plateforme de tests API automatisés et génération de documentation | Analyse LLM des commentaires de code et des définitions d'API, génération automatique de tests et de documentation API, intégration Postman |
| 7 | Outil de capture et de maintenance intelligente de scripts de tests UI | Plugin navigateur pour capturer les trajectoires utilisateur, LLM analyse l'intention et génère des scripts de test, correction par IA des localisateurs obsolètes |
| 8 | Analyse de journaux système et localisation de pannes | Collecte de journaux via ELK Stack, analyse LLM des journaux anormaux pour extraire les informations clés et identifier la cause racine, suggestions de correction |
| 9 | Outil de génération automatique de code UI frontend | Reconnaissance OCR de la structure de mise en page des maquettes, génération par LLM de CSS responsive et de composants, intégration TailwindCSS |
| 10 | Assistant intelligent de conception et de modélisation de structures de bases de données | Saisie des documents de besoins métier, génération automatique de diagrammes ER et de structures de tables, support d'export vers MySQL/PostgreSQL |

## 5. Santé

Les scénarios de santé visent à améliorer l'efficacité du diagnostic et la qualité des services médicaux.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Assistant intelligent d'interprétation de rapports médicaux | Upload de photos de rapports médicaux, OCR pour identifier les indicateurs clés, interprétation LLM des valeurs anormales et génération d'explications accessibles |
| 2 | Conseiller en santé basé sur la recherche documentaire | Construction d'un graphe de connaissances médicales (CIM-10, notices de médicaments, guides de diagnostic), réponses par RAG |
| 3 | Plateforme d'analyse décisionnelle de données de recherche clinique | Intégration de données EMR et de résultats de laboratoire, assistance LLM à la génération de code d'analyse statistique et de visualisations |
| 4 | Outil de génération automatique de rapports d'imagerie médicale | Description des caractéristiques d'imagerie par le radiologue, génération automatique de rapports structurés par LLM, support de modèles pour les types d'examens courants |
| 5 | Génération intelligente et résolution automatique de questions d'examens médicaux | Saisie de chapitres et de points de connaissances, génération LLM d'exercices et d'explications, archivage automatique des erreurs et analyse des lacunes |
| 6 | Assistant Q&R intelligent sur les notices de médicaments | Upload de photos ou saisie de noms de médicaments, réponses LLM sur le dosage, les effets secondaires et les précautions |
| 7 | Assistant de génération d'articles de vulgarisation médicale | Saisie de noms de maladies et de publics cibles, génération LLM d'articles vulgarisés, support de versions multiples (patient/famille) |
| 8 | Outil de génération automatique de rapports d'imagerie médicale | Description des caractéristiques d'imagerie par le radiologue, génération automatique de rapports structurés par LLM, support de modèles pour les types d'examens courants |
| 9 | Assistant de génération et d'archivage de comptes rendus opératoires | Saisie vocale des étapes clés pendant l'opération, génération structurée de comptes rendus par LLM, association automatique des codes opératoires |
| 10 | Assistant intelligent de rappels médicamenteux pour maladies chroniques | Saisie de la liste des médicaments du patient, génération LLM de rappels personnalisés, vérification des contre-indications et Q&R interactif |

## 6. Cybersécurité

Les scénarios de cybersécurité se concentrent sur la protection et la gestion des risques.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Moteur de détection et correction de vulnérabilités de code | Analyse statique du code (SAST), analyse LLM des principes de vulnérabilité et génération de suggestions de correction, intégration au pipeline CI/CD |
| 2 | Système de détection et interception de phishing par IA générative | Analyse LLM du contenu des e-mails, des caractéristiques de l'expéditeur et de la sécurité des liens, identification du phishing généré par IA, interception en temps réel via la passerelle de messagerie |
| 3 | Assistant de génération automatique de rapports quotidiens de sécurité | Consolidation des journaux des équipements de sécurité, extraction automatique des événements clés par LLM, marquage highlight des événements anormaux |
| 4 | Assistant Q&R intelligent sur les connaissances en sécurité | Base de connaissances vectorielle construite à partir de documents de sécurité et de la base CVE, réponses LLM sur les techniques de sécurité et les recommandations de traitement |
| 5 | Assistant de génération intelligente de rapports de tests de pénétration | Après les tests de pénétration, génération automatique de rapports par LLM basée sur les descriptions de vulnérabilités, génération en masse de suggestions de correction |
| 6 | Protection contre le code malveillant et surveillance de la conformité à la vie privée | Analyse en bac à sable des comportements des fichiers suspects, identification par LLM des caractéristiques malveillantes et génération de signatures, scan d'identification des données privées |
| 7 | Outil de génération de listes de contrôle de conformité de la configuration de sécurité | Saisie du type de système cible, génération LLM de listes de contrôle, support des normes telles que la protection classifiée 2.0 et CIS |
| 8 | Assistant de recherche et d'analyse de renseignements sur les menaces | Connexion à des sources multiples de renseignements (open source, commerciaux), interprétation LLM des renseignements et corrélation avec les actifs de l'entreprise, recommandation de stratégies de protection |
| 9 | Assistant de génération de rapports post-incident de sécurité | Après un incident de sécurité, génération automatique de rapports post-mortem par LLM basée sur la chronologie, analyse de la cause racine et suggestions d'amélioration |
| 10 | Centre de surveillance et d'alerte sur les menaces mondiales | Collecte de données de sécurité et de divulgations de vulnérabilités via scraping, extraction LLM des informations clés et évaluation de l'impact, alertes par e-mail/SMS |

## 7. Finance, banque et assurance

Les scénarios financiers s'articulent autour du contrôle des risques et de l'intelligence métier.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Assistant intelligent de génération de rapports de due diligence de crédit | Saisie des informations de base et des données financières de l'entreprise, génération automatique de rapports de due diligence, marquage automatique des points de risque |
| 2 | Conseiller intelligent en gestion de patrimoine bancaire privé | Analyse LLM du profil de risque et des objectifs financiers du client, génération de suggestions d'allocation d'actifs, connexion aux produits de gestion de patrimoine et aux fonds |
| 3 | Assistant de génération et de vérification de conformité de prospectus IPO | Modèles modulaires de prospectus, remplissage automatique par LLM des descriptions commerciales et des facteurs de risque, vérification de cohérence par moteur de règles |
| 4 | Système de génération automatique de rapports financiers et d'alertes d'anomalies | Collecte automatique des données du système financier, génération LLM d'analyses financières et de discussions de la direction, alertes sur les indicateurs anormaux |
| 5 | Assistant d'extraction d'informations de justificatifs et Q&R | Upload de photos de factures, reconnaissance OCR des informations, réponses LLM aux questions liées aux justificatifs, support de factures de TVA, reçus de train, etc. |
| 6 | Assistant de recherche et Q&R de jurisprudence | Base de connaissances construite à partir de sanctions réglementaires, réponses LLM aux questions de conformité et références de cas |
| 7 | Assistant de simulation de scripts pour agents d'assurance | LLM joue différents types de clients pour des dialogues simulés, évaluation de la conformité et de la force de persuasion des scripts, analyse de transcriptions d'enregistrements |
| 8 | Plateforme d'analyse de clauses de polices d'assurance et comparaison des concurrents | Analyse structurée des clauses, génération LLM de résumés des points forts et des points d'attention |
| 9 | Service de reconnaissance émotionnelle dans les conversations clients | Reconnaissance émotionnelle vocale combinée à la détection de conformité des scripts, feedback en temps réel à l'agent pour amélioration |
| 10 | Assistant intelligent de suivi et de Q&R de progression de sinistres | Saisie du numéro de police ou de déclaration de sinistre par l'utilisateur, consultation LLM de la progression du sinistre et réponses aux questions liées |

## 8. Services d'entreprise

Les scénarios de services d'entreprise visent à améliorer l'efficacité opérationnelle et le niveau de management.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Plateforme d'analyse de rétention et d'alerte de churn | Collecte de données comportementales via tracking, modèle ML de prédiction du churn, génération LLM de suggestions de rétention |
| 2 | Plateforme de prospection et marketing par e-mail pour prospects B2B | Filtrage des données commerciales pour identifier les cibles, génération LLM de contenu marketing personnalisé, connexion à une plateforme d'envoi groupé |
| 3 | Plateforme de suivi du pipeline commercial et de prévision de performance | Collecte automatique de données CRM, analyse LLM de l'entonnoir des ventes et prévision des objectifs, alertes push aux managers |
| 4 | Radar de surveillance de l'e-réputation de marque et d'alerte de crise | Collecte de données d'opinion sur tout le web (réseaux sociaux, actualités, forums), analyse LLM du sentiment et des tendances de propagation, alertes de crise |
| 5 | Assistant de rédaction intelligente d'e-mails professionnels et de gestion émotionnelle | Compréhension contextuelle des e-mails, génération LLM de brouillons professionnels, feedback d'analyse émotionnelle |
| 6 | Système d'analyse intelligente de CV et de correspondance postes | Analyse PDF des CV pour extraire les informations clés, correspondance LLM avec les postes appropriés et génération de suggestions d'entretien, intégration ATS |
| 7 | Assistant d'accueil et Q&R pour les nouveaux employés | Recherche RAG dans la base de connaissances des documents d'intégration, réponses LLM aux questions fréquentes des nouveaux employés |
| 8 | Plateforme de feedback sur la performance et gestion OKR | Collecte de données OKR, analyse LLM de l'avancement des objectifs et génération de suggestions de feedback, collecte de feedback 360° |
| 9 | Prise de notes intelligentes de réunions et gestion des TODO | Transcription des enregistrements de réunions, extraction LLM des points clés et des TODO, création automatique de tâches dans le système de gestion |
| 10 | Reconnaissance de factures et traitement automatique de remboursements | Reconnaissance OCR des informations de factures, vérification automatique de l'authenticité et de la conformité des remboursements, connexion au système financier |

## 9. Production et exploitation de contenu

Les scénarios de production et d'exploitation de contenu se concentrent sur la création et le trafic.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Plateforme d'aide à la création de contenu pour films et romans | Assistance LLM à la création : synopsis, développement de personnages, génération de dialogues ; visualisation de la structure narrative en carte mentale |
| 2 | Assistant intelligent de rédaction d'histoires de marque et de RP | Saisie de mots-clés de marque et d'informations produit, génération LLM de plusieurs versions stylistiques de textes ; intégration de tests A/B |
| 3 | Système de gestion d'interaction et de diffusion en direct par avatar numérique | Modélisation d'avatar + synthèse vocale TTS + dialogue LLM, réponse en temps réel aux commentaires en direct ; intégration OBS pour la diffusion |
| 4 | Génération de scripts vidéo courts et montage intelligent | Génération LLM de scripts et de storyboards, Sora/Runway pour les extraits vidéo ; assemblage automatique par l'outil de montage |
| 5 | Transcription vocale de ventes et recommandation de scripts | Transcription ASR des appels téléphoniques, analyse LLM des conversations et recommandation de scripts performants ; intégration CRM |
| 6 | Système de génération intelligente de contenu marketing | Saisie des informations produit, génération LLM de textes marketing et d'extraction de points de vente ; intégration de modèles Canva/Gaoding Design |
| 7 | Système de surveillance en temps réel du ROI des publicités et d'optimisation stratégique | Connexion API aux plateformes publicitaires pour collecter les données, analyse LLM de l'efficacité et génération de suggestions d'optimisation, alertes sur les anomalies |
| 8 | Analyse de mots-clés et de trafic des moteurs de recherche | Collecte de données Baidu Index et 5118, analyse LLM des tendances des mots-clés et de la compétitivité, recommandation de sujets |
| 9 | Plateforme d'analyse des dépenses publicitaires des concurrents | Collecte de données publicitaires via API de plateformes tierces, analyse LLM des stratégies de diffusion et des caractéristiques créatives |
| 10 | Système d'analyse intelligente des tendances et de recommandation de sujets | Collecte de données de tendances (Recherche Weibo, classement Douyin), analyse LLM des tendances et recommandation d'angles de sujets ; planification de contenu calendaire |

## 10. Administration publique intelligente

Les scénarios d'administration publique visent à améliorer l'efficacité des services publics et la capacité de gouvernance.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Système de navigation vocale intelligente et de répartition automatique pour la ligne 12345 | Reconnaissance vocale des appels des citoyens, compréhension LLM des demandes et répartition automatique vers le service compétent ; circulation automatique des tickets |
| 2 | Robot d'accueil et de questions-réponses sur les services administratifs | Recherche RAG dans la base de connaissances gouvernementales, réponses LLM aux procédures et questions de politique ; connexion au système de prise de numéro |
| 3 | Plateforme de correspondance et de diffusion ciblée de politiques de soutien aux entreprises | Analyse structurée des politiques, correspondance automatique des profils d'entreprises avec les politiques applicables ; rappels par SMS/e-mail |
| 4 | Assistant de pré-examen des documents administratifs et de vérification de conformité | OCR des documents et extraction d'informations clés, vérification LLM de l'exhaustivité et de la conformité des documents |
| 5 | Système de détection de comportements anormaux par vidéo surveillance publique | Analyse en temps réel des flux vidéo, détection CV de comportements anormaux (bagarres, chutes) ; alertes push |
| 6 | Plateforme d'identification intelligente d'événements urbains et de gestion de dispatch | Collecte de données urbaines (IoT, caméras), identification LLM du type d'événement et répartition |
| 7 | Système d'analyse multidimensionnelle d'opinion publique et d'alertes de risques | Fusion de données multi-sources (ligne 12345, opinion en ligne, visites de terrain), identification LLM des points chauds de risque |
| 8 | Plateforme de numérisation, d'identification intelligente et d'archivage de dossiers administratifs | OCR du contenu textuel des archives, extraction LLM des informations clés et classification automatique ; support de recherche plein texte |
| 9 | Plateforme de commande d'urgence et de distribution de ressources de secours | Collecte d'informations sur les événements, génération LLM de plans de réponse d'urgence ; optimisation algorithmique de la distribution des ressources |
| 10 | Système de surveillance en grille de la pollution atmosphérique et de traçabilité de la source | Collecte de données des capteurs de qualité de l'air, modèle CV d'identification des sources de pollution ; analyse LLM des tendances de pollution et traçabilité |

## 11. Affaires juridiques et gestion contractuelle

Les scénarios juridiques se concentrent sur l'amélioration de l'efficacité des services juridiques et la gestion de la conformité.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Agent de détection de risques contractuels en un clic | Analyse structurée des textes contractuels, identification par LLM des problèmes potentiels par comparaison avec une liste de contrôle ; marquage des clauses à haut risque |
| 2 | Plateforme de vérification de conformité et de suggestions de modification pour le cycle de vie des contrats | Comparaison des clauses avec la base de données réglementaire, génération LLM de rapports de conformité ; suivi des suggestions de modification |
| 3 | Conseiller AI d'évaluation du taux de succès de litiges similaires | Extraction de caractéristiques de cas, recherche et correspondance de cas similaires ; analyse LLM des facteurs influençant le succès |
| 4 | Radar de surveillance en temps réel des changements législatifs et d'analyse d'impact | Mise à jour en temps réel de la base de données juridique, analyse LLM des modifications et évaluation de l'impact commercial ; alertes push |
| 5 | Outil AIGC de rédaction automatique de lettres de mise en demeure | Saisie des faits, génération LLM de modèles de lettres de mise en demeure normalisées ; vérification des éléments et conformité |
| 6 | Enregistreur de transcription en temps réel et extraction automatique des points litigieux | Transcription ASR des audiences, extraction LLM des points litigieux et des arguments clés ; annotation de timestamps |
| 7 | Système de surveillance automatique de violations de propriété intellectuelle et de preuves blockchain | Surveillance des violations de propriété intellectuelle sur les plateformes e-commerce et les réseaux sociaux ; collecte automatique de preuves |
| 8 | Agent de vérification de cohérence et d'alerte de risques pour les prospectus IPO | Comparaison de données multi-chapitres des prospectus, identification LLM des incohérences et des anomalies de données ; marquage des risques |
| 9 | Plugin de traduction en langage simple de clauses juridiques complexes | Sélection de clauses juridiques, génération LLM d'explications accessibles |
| 10 | Système intelligent de structuration et de visualisation de chaînes de preuves | Upload de documents de preuves, analyse LLM des relations entre les preuves et de la chronologie |

## 12. Tourisme et voyages

Les scénarios de tourisme visent à améliorer l'expérience de voyage et la commodité.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Générateur d'itinéraires paresseux basé sur l'AIGC | Saisie des préférences (durée, budget, intérêts), génération LLM d'itinéraires quotidiens ; API de lieux touristiques pour les horaires et les billets |
| 2 | Robot de prédiction de tendances de prix de vols et d'hôtels et verrouillage automatique des prix bas | Collecte de données de prix des OTA, modèle ML de prédiction des tendances ; alertes de surveillance des prix |
| 3 | Conseiller en recomposition d'itinéraire inter-compagnies et suggestions de plans de secours après annulation de vol | Surveillance de l'état des vols, analyse LLM de plans de rechange ; comparaison multi-compagnies |
| 4 | Système de pré-examen des documents de visa et d'aide au remplissage automatique | Photos des documents uploadées, vérification OCR de l'exhaustivité des informations ; remplissage automatique des formulaires |
| 5 | Assistant de traduction vocale en temps réel et de visualisation de menus pour voyages à l'étranger | Modèle de traduction vocale hors ligne, OCR de photos de menus et traduction |
| 6 | Analyseur de commentaires d'hôtels basé sur le big data pour éviter les mauvaises surprises | Collecte de données de commentaires d'hôtels, extraction LLM des mots-clés positifs et négatifs |
| 7 | Plateforme de prévisualisation immersive en VR et sélection interactive de chambres | Collecte de panoramas à 360°, prévisualisation immersive en VR ; visite virtuelle des chambres |
| 8 | Assistant de génération de récits de voyage et de posts sociaux à partir de traces de voyage | Extraction d'informations de lieu et de date à partir des photos, génération LLM de textes de récits ; modèles de mise en page |
| 9 | Plateforme de collecte et de gestion de justificatifs de frais de déplacement professionnels | Connexion API aux plateformes de voyages d'affaires, collecte automatique de justificatifs ; vérification de conformité |
| 10 | Navigation prédictive de la congestion touristique et planification d'itinéraires hors pointe | Collecte de données de fréquentation touristique, modèle ML de prédiction des périodes de pointe ; recommandation d'horaires hors pointe |

## 13. Accompagnement émotionnel

Les scénarios d'accompagnement émotionnel se concentrent sur la santé mentale et le soutien affectif.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Compagnon virtuel d'accompagnement profond 24h/24 basé sur les LLM | Système de mémorisation stockant l'historique des conversations, génération LLM de réponses personnalisées ; module de soutien émotionnel |
| 2 | Conseiller AI de reconnaissance émotionnelle multimodale et de soutien psychologique | Analyse du ton vocal + reconnaissance émotionnelle textuelle, génération LLM de conseils de soutien ; alerte d'intervention en crise |
| 3 | Agent numérique de rééducation cognitive et de stimulation mnésique pour personnes atteintes de la maladie d'Alzheimer | Jeux cognitifs (mémoire, calcul, langage) ; stimulation par vieilles photos/vieilles chansons |
| 4 | Coach de simulation sociale AIGC pour personnes souffrant d'anxiété sociale | Simulation de scénarios sociaux virtuels, LLM jouant différents rôles ; suggestions de techniques sociales |
| 5 | Machine à histoires personnalisées générative pour enfants par IA | Saisie par les parents du thème et des préférences, génération LLM d'histoires personnalisées ; génération de musique de fond |
| 6 | Système de résurrection numérique et de dialogue inter-temporel via LLM pour les défunts | Entraînement d'un modèle personnalisé à partir de données (voix, textes) du défunt ; génération de dialogues mémoriels |
| 7 | Robot de chat empathique basé sur les données MBTI | Saisie des résultats du test MBTI, génération LLM d'analyse de personnalité et de réponses empathiques ; recommandation de correspondances de personnalité |
| 8 | Assistant de suivi d'humeur 24h/24 et de motivation positive par IA | Enregistrement quotidien de l'état émotionnel, analyse LLM des tendances et génération de contenu motivant ; rappels positifs push |
| 9 | Arbre à confidences pour adolescents avec respect de la vie privée | Entrée anonyme pour la confidence, LLM fournit écoute et conseils ; alerte sur les mots sensibles |
| 10 | Système d'animaux de compagnie virtuels à évolution autonome | Entraînement d'un modèle de personnalité de l'animal, interaction et croissance évolutives ; système de personnalisation virtuelle |

## 14. Loisirs et divertissement

Les scénarios de loisirs visent à offrir une expérience de divertissement numérique riche.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Moteur de décision autonome de PNJ pour jeux en monde ouvert basé sur les LLM | Arbre de comportement des PNJ fusionné avec les décisions LLM, système de dialogue pour des interactions personnalisées ; moteur de comportement |
| 2 | Outil AIGC de progression narrative et d'assistance MJ pour murder games immersifs | Les choix des joueurs déclenchent des branches narratives, génération LLM de logique déductive ; génération automatique de cartes d'indices |
| 3 | Modificateur génératif de fins pour fiction interactive | Les choix des lecteurs influencent le cours de l'histoire, génération LLM de multiples branches de fins |
| 4 | Station de travail AIGC de modélisation 3D de personnages de style anime | Description textuelle pour générer des croquis de personnages, modélisation 3D automatique ; rendu de textures |
| 5 | Analyste visuel CV et commentateur intelligent de parties esport | Analyse en temps réel du gameplay, identification des moments clés ; génération LLM de commentaires de match |
| 6 | Moteur de recommandation algorithmique de contenu humoristique | Profilage d'intérêts des utilisateurs, correspondance et recommandation de contenu humoristique |
| 7 | Logiciel d'optimisation vocale et d'embellissement de chant KTV | Traitement de réduction du bruit et d'amélioration vocale ; algorithme IA d'optimisation vocale |
| 8 | Outil d'extraction et de montage intelligent de scènes par personnage de séries | Analyse du contenu vidéo, extraction de séquences par personnage ; montage automatique |
| 9 | Système de génération automatique de livres audio multi-voix par TTS | Attribution de rôles textuels, génération de voix personnalisées ; ajout de musique de fond et d'effets sonores |
| 10 | Coach d'analyse et de révision de parties de jeux de société basé sur l'apprentissage par renforcement | Analyse de parties, simulation d'adversaire par IA ; génération de suggestions de révision |

## 15. E-commerce

Les scénarios d'e-commerce se concentrent sur l'efficacité opérationnelle et l'amélioration des taux de conversion.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Outil de production en masse de fiches produit à fort taux de conversion par AIGC | Saisie d'informations produit, génération LLM de textes vendeurs et de descriptions de scènes ; génération d'images de fond |
| 2 | Usine de génération de vidéos d'essayage virtuel par IA pour vêtements | Traitement de photos de vêtements à plat, génération d'essayages virtuels ; vidéos multi-angles |
| 3 | Assistant de traduction et d'adaptation multilingue LLM pour e-commerce transfrontalier | Traduction multilingue de descriptions de produits, adaptation culturelle ; interfaces de publication multi-plateformes |
| 4 | Robot d'analyse de sentiment client basé sur le NLP et réponse intelligente | Analyse de sentiment des conversations de conseil, génération automatique de réponses apaisantes ; classification des avis positifs/négatifs |
| 5 | Système de live shopping 24h/24 par avatar numérique AIGC | Avatar numérique + génération de scripts en temps réel, appel en temps réel aux informations produit ; interaction avec les commentaires en direct |
| 6 | Plugin IA de comparaison de prix et de prédiction de tendances pour les produits similaires sur tout le web | Scraping de prix sur les plateformes e-commerce, tableaux comparatifs ; prédiction des tendances de prix |
| 7 | Plateforme de filtrage intelligent de photos de clients et de synthèse de vidéos courtes | Scoring de qualité des photos des clients, recommandation automatique des contenus de qualité ; synthèse de modèles de vidéos courtes |
| 8 | Analyse en temps réel de conversations de vente et recommandation de scripts performants basée sur LLM | Transcription ASR des appels, détection en temps réel de la conformité des scripts ; recommandation de scripts |
| 9 | Moteur de détection de tendances du marché et de prédiction de produits populaires par IA | Collecte et analyse de données de réseaux sociaux et d'e-commerce, détection LLM des tendances et points chauds ; suggestions de sélection de produits |
| 10 | Système de segmentation d'utilisateurs par IA et d'exploitation fine basé sur les données comportementales | Analyse par clustering de données comportementales, génération de tags de profils ; déclenchement automatisé du marketing |

## 16. Énergie

Les scénarios énergétiques visent à réaliser une gestion intelligente et une transition verte du secteur de l'énergie.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Analyse IA des comportements de consommation domestique et conseiller en économie d'énergie | Collecte de données des compteurs intelligents, analyse des modes de consommation ; génération LLM de conseils d'économie |
| 2 | Système de détection CV de défauts de panneaux photovoltaïques par drone | Inspection par drone, analyse d'images thermoinfrarouges ; détection et annotation de défauts |
| 3 | Agent de prédiction de tendances de prix de l'énergie et de stratégie automatique de profit | Collecte de données du marché de l'énergie, modèle de prédiction des prix ; génération de stratégies et exécution de transactions |
| 4 | Système de détection non destructive de la santé des batteries et d'alerte sur les risques de surchauffe | Surveillance des données de fonctionnement des batteries, modèle d'évaluation de la santé ; alertes push sur les risques |
| 5 | Assistant IA de comptabilisation automatique des émissions carbone et de génération de rapports ESG | Collecte de données de consommation d'énergie, calcul des facteurs d'émission ; génération automatique de rapports ESG |
| 6 | Système IA de prévision de charge en conditions météorologiques extrêmes et de commande d'urgence | Connexion aux données météorologiques, modèle de prévision de charge ; génération de stratégies d'ordonnancement |
| 7 | Gardien IA de détection de violations dans les stations-service et alerte | Analyse vidéo des stations-service, détection de violations (appels téléphoniques, tabagisme) ; alertes push |
| 8 | Système IA de surveillance par ondes acoustiques et de localisation précise de fuites d'oléoducs | Collecte de données de capteurs acoustiques, modèle de détection de fuites ; calcul de localisation |
| 9 | Système d'agrégation de ressources virtuelles et de prise de décision de trading d'électricité par IA | Connexion de ressources distribuées, optimisation de l'ordonnancement agrégé ; exécution de stratégies de trading |
| 10 | Suivi IA de la position des personnes dans les mines et alerte d'intrusion dans les zones dangereuses | Localisation UWB/BLE, suivi des trajectoires de personnes ; barrières électroniques pour les zones dangereuses |

## 17. Audiovisuel

Les scénarios audiovisuels se concentrent sur la production et le traitement des médias.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Outil IA d'identification de moments forts et de montage automatique de vidéos longues | Analyse du contenu vidéo, identification des images clés ; montage automatique des moments forts |
| 2 | Assistant IA de séparation intelligente du bruit de fond et d'amélioration vocale | Modèle de séparation audio, suppression du bruit de fond ; amélioration vocale |
| 3 | Station de restauration 4K et de colorisation IA pour images anciennes | Modèle de super-résolution, restauration de la qualité des images anciennes ; colorisation automatique |
| 4 | Système de doublage TTS de qualité professionnelle et contrôle des émotions | Modèle TTS multi-voix, contrôle émotionnel ; export audio |
| 5 | Outil de reconnaissance vocale ASR automatique et génération de sous-titres bilingues | Reconnaissance vocale pour génération de sous-titres, traduction multilingue ; superposition de sous-titres bilingues |
| 6 | Moteur IA d'effacement intelligent d'objets superflus dans les vidéos | Suivi de cibles vidéo par modèle de suivi d'objets, suppression et restauration par frames ; gestion de la cohérence inter-frames |
| 7 | Compositeur automatique de musique de fond sans droits d'auteur par AIGC | Modèle de génération musicale, contrôle des émotions et du style ; détection des droits d'auteur |
| 8 | Logiciel de clonage et de conversion vocale par IA pour voix de personnalités spécifiques | Entraînement d'un modèle de voix avec peu d'échantillons ; traitement de conversion vocale |
| 9 | Plateforme de conversion de scripts en storyboards et génération de vidéos de prévisualisation par IA | Analyse de scripts pour génération de storyboards, génération LLM de vidéos de prévisualisation |
| 10 | Assistant de transcription intelligente de réunions et d'extraction de TODO à partir d'enregistrements | Séparation et transcription vocale de réunions multi-participants, extraction LLM des TODO ; annotation de timestamps |

## 18. Marketing IA

Les scénarios de marketing IA visent à améliorer l'efficacité marketing et la production créative.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Moteur AIGC de rédaction automatique de posts viraux pour Xiaohongshu | Saisie de sujets, génération LLM de posts sponsorisés ; optimisation d'emojis et de tags de sujets |
| 2 | Outil IA de mise en page de supports marketing et d'adaptation multi-tailles | Saisie de textes, association intelligente de modèles de supports et export multi-tailles |
| 3 | Plateforme AIGC de création de logos et de construction de charte VI | Saisie de mots-clés de marque, génération créative de logos ; génération de normes VI |
| 4 | Assistant de suivi des tendances et de génération d'idées marketing opportunistes par IA | Collecte de données de tendances, analyse LLM des angles marketing ; génération de concepts créatifs |
| 5 | Gestionnaire de budget publicitaire et système deenchères IA en temps réel | Connexion aux données des plateformes publicitaires, modèle d'analyse d'efficacité ; optimisation des stratégies d'enchères |
| 6 | Analyseur approfondi des stratégies marketing des concurrents et générateur de rapports hebdomadaires par IA | Collecte et analyse de contenu des concurrents, extraction de stratégies ; génération automatique de rapports hebdomadaires |
| 7 | Planification de mots-clés SEO et rédaction en masse d'articles par IA | Analyse de mots-clés, génération en masse d'articles ; suggestions d'optimisation SEO |
| 8 | Expert en rédaction d'e-mails marketing personnalisés un-à-un | Données de profils d'utilisateurs, génération de contenu personnalisé ; tests A/B |
| 9 | Radar de surveillance de la réputation de marque sur tout le web et alerte de crise IA | Collecte de données d'opinion sur tout le web, analyse de sentiment ; alertes push en cas de crise |
| 10 | Outil AIGC de génération de scripts vidéo courts et d'aide au storyboard | Saisie de sujets, génération de scripts et de storyboards ; conseils de tournage |

## 19. Intelligence de données

Les scénarios d'intelligence de données se concentrent sur l'analyse et la valorisation des données.

| # | Scénario d'application | Référence d'implémentation |
|---|---|---|
| 1 | Moteur de recherche en langage naturel basé sur le Text-to-SQL | Conversion de requêtes en langage naturel en SQL, visualisation des résultats |
| 2 | BI conversationnel : génération de graphiques en une phrase | Description des besoins en données, génération automatique de graphiques ; support de la bascule entre plusieurs types de graphiques |
| 3 | Outil de reconnaissance de tableaux à partir de captures d'écran | Upload de captures d'écran, reconnaissance VLM de la structure et des données du tableau ; export en fichier Excel |
| 4 | Outil IA de reconnaissance de tableaux à partir d'images et de captures d'écran | Reconnaissance OCR de la structure des tableaux à partir d'images, export des données en Excel |
| 5 | Construction automatisée de graphes de connaissances à partir de données multi-sources | Connexion multi-sources, extraction d'entités et de relations ; stockage en base de données de graphes |
| 6 | Assistant intelligent d'interprétation de rapports de données et d'analyse de tendances | Upload d'images ou saisie de données de rapports de données, interprétation VLM des graphiques et analyse de tendances |
| 7 | Assistant d'interprétation de structures de tables de bases de données et de génération de requêtes exemple | Saisie de noms de tables ou de descriptions de champs, génération LLM de descriptions de tables et de requêtes SQL exemple |
| 8 | Alignement intelligent et déduplication IA des données maîtresses d'entreprise | Correspondance multi-sources de données maîtresses, identification des enregistrements en double ; configuration de règles de fusion |
| 9 | Outil de conversion de spécifications de données en scénarios de test | Saisie de descriptions de besoins en données, génération LLM de scénarios de test et de cas de validation |
| 10 | Assistant Q&R intelligent sur les indicateurs de données | Construction d'une base de connaissances à partir de documents de définition d'indicateurs, réponses LLM sur la portée et la logique de calcul des indicateurs |

</TabItem>
<TabItem label="B2C Consommation">

## Introduction du chapitre

<ChapterIntroduction :duration="cDuration" :tags="['Applications B2C', 'Style de vie', 'Expérience émotionnelle', 'Création d\'ambiance']" coreOutput="Découvrir plus de 15 inspirations de scénarios de vie" expectedOutput="Trouver une direction de produit qui touche les utilisateurs">

Ce document recense les <strong>directions d'application créatives des grands modèles LLM dans les scénarios de consommation B2C</strong>. Contrairement au B2B qui se concentre sur l'efficacité et les points de douleur, les produits B2C accordent davantage d'importance à la <strong>création de sensations, aux suggestions psychologiques et à l'ambiance</strong>, permettant aux utilisateurs de ressentir une résonance émotionnelle et une expérience agréable lors de l'utilisation.

</ChapterIntroduction>

## Sélection rapide d'ambiance de scénario

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #ec4899;">
  <div style="font-weight: 600; margin-bottom: 8px;">Trouvez l'inspiration de scénario qui vous touche</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    Choisissez l'ambiance souhaitée et votre sensation du moment, le système recommandera des directions de scénarios pertinentes. Cliquez sur un tag pour accéder au chapitre correspondant.
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="vibePoint" placeholder="Choisir le type d'ambiance" style="width: 100%;">
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
      <el-select v-model="feeling" placeholder="Choisir votre sensation" style="width: 100%;">
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
      Scénarios recommandés pour vous : {{ cCurrentSelection.vibe }} x {{ cCurrentSelection.feeling }}
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
      Rechoisir
    </el-button>
  </div>
</el-card>

---

## 1. Style de vie

> 💡 **Concept clé** : Donner un sens rituel au quotidien ordinaire, créer de la beauté dans les détails

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Assistant de réveil rituel matinal | Intégration de l'API météo, des données du calendrier, le LLM génère un programme matinal personnalisé ; couplé à un enceinte intelligente pour une musique sur mesure, éclairage intelligent avec réveil progressif |
| 2 | Créateur d'ambiance pour célibataires | Connexion aux appareils domotiques (éclairage, enceinte, diffuseur), le LLM ajuste automatiquement les paramètres selon l'heure/l'humeur ; apprentissage continu des préférences utilisateur |
| 3 | Générateur de programme cocooning week-end | Connexion aux API de plateformes de streaming pour les programmes, génération de combinaisons film + gastronomie + décoration basées sur les préférences historiques |
| 4 | Radio apaisante du soir | Synthèse vocale TTS pour générer des histoires douces, algorithme de mixage de bruits blancs, volume décroissant intelligent ; ajustement du contenu selon les données de sommeil |
| 5 | Chasseur d'inspiration esthétique du quotidien | Reconnaissance d'image analysant les photos d'environnement, le LLM génère des suggestions esthétiques ; recommandations de contenu style Pinterest/Xiaohongshu |

---

## 2. Accompagnement émotionnel

> 💡 **Concept clé** : Accueil inconditionnel et présence, devenir un doux contenant pour les émotions

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Confident nocturne | Chiffrement de bout en bout garantissant la confidentialité, analyse émotionnelle par LLM, mémoire à long terme des histoires utilisateur, conversation multi-tours pour un accompagnement continu |
| 2 | Accompagnateur de guérison post-rupture | Algorithme d'identification du stade émotionnel, soutien différencié par phase (expression -> libération -> reconstruction) ; base de connaissances psychologiques avec recherche RAG |
| 3 | Coach de respiration anti-anxiété | Intégration de données de capteurs biométriques (fréquence cardiaque/respiration), monitoring en temps réel du niveau d'anxiété ; guidage vocal du rythme respiratoire, instructions de relaxation musculaire progressive |
| 4 | Mentor de reconstruction de la confiance en soi | Cadre de dialogue de psychologie positive, enregistrement et retour des petites réussites ; techniques de restructuration cognitive pour changer les autodialogues négatifs |
| 5 | Analyse intelligente du journal émotionnel | Modèle NLP de reconnaissance émotionnelle, analyse de séries temporelles pour découvrir les schémas émotionnels ; visualisation du spectre émotionnel, alertes prédictives |

---

## 3. Divertissement et loisirs

> 💡 **Concept clé** : Créer des expériences immersives, faire du divertissement un refuge pour l'âme

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Maître du jeu immersif (murder mystery) | Le LLM génère en temps réel des branches narratives, synthèse vocale pour incarner les NPC, ajustement dynamique de la difficulté et du rythme selon les réactions ; rendu de scènes AR/VR |
| 2 | NPC sensible dans un monde ouvert | Base de données de mémoire à long terme stockant l'historique des interactions, dialogues personnalisés générés par LLM ; calcul émotionnel pour des réactions émotionnelles authentiques des NPC |
| 3 | Génération de contenu podcast personnalisé | Contenu exclusif basé sur le graphe d'intérêts, clonage vocal TTS de la voix préférée ; interaction en temps réel avec les questions des auditeurs |
| 4 | Équipe d'ambiance pour concert virtuel | Rendu d'avatars, interactions de commentaires en temps réel, bâtons lumineux virtuels/accessoires de soutien ; audio spatial pour une sensation de live |
| 5 | Partenaire de co-création de fiction interactive | Le LLM génère l'intrigue en temps réel, les choix utilisateur influencent le déroulement ; fins multiples, développement dynamique des relations entre personnages |

---

## 4. Développement personnel

> 💡 **Concept clé** : La croissance n'est pas une ascèse, c'est un voyage fascinant de découverte de soi

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Témoin de croissance personnelle | Visualisation chronologique de la trajectoire de croissance, marquage automatique des jalons ; comparatifs « moi d'avant » vs « moi d'aujourd'hui » |
| 2 | Coach ludifié de formation d'habitudes | Mécanismes de ludification (points d'expérience, niveaux, badges), classement social, rôle de coach IA (ex. « mentor de l'aventure ») |
| 3 | Appariement de partenaires d'apprentissage | Algorithme de matching basé sur les intérêts et objectifs, communautés d'apprentissage, mécanisme de suivi mutuel |
| 4 | Découvreur de petites joies quotidiennes | Reconnaissance d'image pour détecter les beaux moments, guidage de journal de gratitude, rétrospective hebdomadaire des moments agréables |
| 5 | Simulateur d'expériences de vie | Simulation narrative multi-branches des conséquences de différents choix, comparaison de vies parallèles ; visualisation des conséquences des décisions |

---

## 5. Interactions sociales

> 💡 **Concept clé** : Rendre les interactions sociales légères et naturelles, trouver un mode de connexion confortable

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Générateur de sujets brise-glace | Recommandation intelligente de sujets basée sur le contexte et les participants, analyse de conversation en temps réel pour suggestions de prolongation ; sauvetage des moments gênants |
| 2 | Styliste d'ambiance pour publications sociales | Analyse du contenu image, génération de textes multi-styles (littéraire/humoristique/profond) ; recommandation intelligente d'emojis et de mise en forme |
| 3 | Planificateur d'ambiance pour rendez-vous | Génération de plans de rendez-vous basés sur les intérêts communs, recommandations de restaurants/activités, suggestions de sujets de conversation ; rappels météo et trafic en temps réel |
| 4 | Animateur de réunions à distance | Bibliothèque de jeux en ligne, générateur d'activités brise-glace, roue de sujets ; fonds virtuels et filtres pour renforcer l'ambiance |
| 5 | Assistant de gestion d'énergie sociale | Évaluation de la dépense énergétique après les activités sociales, suggestions de récupération (activités en solitaire) ; planification intelligente du calendrier social |

---

## 6. Expression créative

> 💡 **Concept clé** : Chacun a de la créativité, il suffit juste de l'éveiller

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Kit d'urgence anti-panne d'inspiration | Algorithme d'association trans-domaines, génération de stimuli aléatoires, bibliothèque de prompts créatifs ; outil de divergence d'idées en carte mentale |
| 2 | Guide d'exploration du style personnel | Analyse d'image pour identifier le style existant, recommandation de tendances, essayage virtuel/makeup ; timeline d'évolution du style |
| 3 | Consultant esthétique pour journal et bulletins | Recommandation de modèles de mise en page, génération de palettes de couleurs, suggestions d'éléments décoratifs ; reconnaissance d'écriture manuscrite et embellissement |
| 4 | Guide d'ambiance photographique | Identification de scène et suggestions de composition, recommandation de filtres, ajustement intelligent des paramètres de retouche ; parcours d'apprentissage de la photographie |
| 5 | Adaptateur musique-humeur | Algorithme d'analyse émotionnelle musicale, reconnaissance de l'humeur utilisateur, génération de playlists personnalisées ; histoires et contexte musical |

---

## 7. Voyage et exploration

> 💡 **Concept clé** : Voyager, ce n'est pas seulement voir des paysages, c'est aussi ressentir des modes de vie différents

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Guide d'exploration urbaine à pied | Agrégation de contenus d'initiés locaux, recommandation de lieux insolites, navigation AR ; traduction et commentaire vocal en temps réel |
| 2 | Génération de journal de voyage émotionnel | Tri et sélection automatiques des photos, génération de récits de voyage poétiques par LLM, timeline géolocalisée ; vidéo de voyage en un clic |
| 3 | Compagnon pour voyageurs solitaires | Partage de localisation en temps réel et alertes de sécurité, contacts d'urgence locaux, guide vocal IA ; communauté de voyageurs solo |
| 4 | Aperçu d'ambiance de destination | Aperçu VR/360°, simulation des sons et odeurs locaux, présentation du contexte culturel ; expérience de « test d'hébergement » virtuel |
| 5 | Guide d'ambiance photographique de voyage | Rappel de l'heure dorée, lignes de composition, points de prise de vue typiques ; suggestions de style d'étalonnage en post-production |

---

## 8. Santé physique et mentale

> 💡 **Concept clé** : La santé n'est pas un objectif, c'est un doux acte de self-care

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Réveilleur de motivation sportive | Recommandation intelligente du type d'exercice selon l'état utilisateur, options de micro-exercices (5 minutes), défis sportifs ludifiés ; check-in sportif social |
| 2 | Cuisine inspiration alimentation saine | Identification des ingrédients du frigo, recommandation de recettes personnalisées, analyse nutritionnelle ; guide de cuisson étape par étape |
| 3 | Optimisateur d'ambiance pour la qualité du sommeil | Analyse des données de monitoring du sommeil, génération de rituels du coucher, conseils d'optimisation de l'environnement (température/humidité/lumière) ; réveil intelligent |
| 4 | Guide de perception corporelle | Guidage de méditation de scan corporel, associations émotionnelles des parties du corps, exercices de connexion corps-esprit ; biofeedback visualisé |
| 5 | Assistant rappel de self-care | Monitoring de l'intensité de travail, rappels réguliers de pause, suggestions de micro-activités de soin (boire/s'étirer/respirer profondément) ; journal de self-care |

---

## 9. Exploration des savoirs

> 💡 **Concept clé** : Apprendre est une aventure sans fin, la curiosité est le meilleur des professeurs

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Guide ludifié d'exploration des savoirs | Visualisation cartographique des connaissances, parcours d'apprentissage en mode « niveau », système de badges de réussite ; jeu de rôle de tuteur IA |
| 2 | Partenaire de scénarios d'apprentissage linguistique | Le LLM joue différents rôles dans des dialogues, correction de prononciation, présentation du contexte culturel ; simulation immersive de scénarios |
| 3 | Assistant de satisfaction de la curiosité | Connexion Wikipédia/graphes de connaissances, vulgarisation de concepts complexes, recommandation de savoirs connexes ; journal de curiosité |
| 4 | Stimulateur d'inspiration pour notes de lecture | Analyse du contenu du livre, extraction et mise en relation d'idées, recommandation d'angles de réflexion ; modèles et embellissement de notes de lecture |
| 5 | Créateur d'ambiance pour le partage de connaissances | Génération automatique de fiches de connaissances, optimisation des textes de partage, embellissement visuel ; retour sur les données de partage social |

---

## 10. Entretien des relations

> 💡 **Concept clé** : Les bonnes relations demandent de l'attention, et l'attention n'a pas besoin d'être compliquée

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Coach de communication en couple | Génération de modèles d'expression émotionnelle, guidage en communication non violente, formulations de résolution de conflits ; évaluation de la santé relationnelle |
| 2 | Assistant rappel d'attention familiale | Rappels des dates importantes (anniversaires/commémorations), suggestions de messages attentionnés, recommandations d'activités familiales ; album familial généré |
| 3 | Mainteneur d'ambiance d'amitié | Historique des interactions entre amis, recommandation de sujets communs, organisation de réunions à distance ; timeline et souvenirs d'amitié |
| 4 | Planificateur de déclarations et surprises | Génération de plans de surprises personnalisés, recommandation de cadeaux, suggestions de formulations romantiques ; planning d'exécution et rappels |
| 5 | Guide d'apaisement des conflits | Formulations de désamorçage émotionnel, guidage de changement de perspective, suggestions d'étapes de réconciliation ; suivi de réparation relationnelle |

---

## 11. Compagnie animulaire

> 💡 **Concept clé** : Les animaux de compagnie sont des membres de la famille, leur présence mérite d'être enregistrée et chérie

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Journal anthropomorphique de l'animal | Analyse du comportement animal, génération de journal à la première personne, illustration automatique des photos ; « fil social » de l'animal |
| 2 | Interprète du comportement animal | Analyse vidéo du comportement animal, alertes sanitaires, conseils d'éducation ; base de connaissances des caractéristiques de race |
| 3 | Planificateur de moments complicité animal | Recommandations d'activités avec l'animal, tutoriels de jouets DIY, lieux accueillants pour animaux ; matchmaking social animal |
| 4 | Générateur d'histoires souvenir animalières | Sélection de photos et vidéos, génération d'histoires chronologiques, accompagnement musical ; album/vidéo souvenir auto-généré |
| 5 | Guide rassurant pour nouveaux maîtres | Guide d'entretien par étapes, FAQ, gestion des urgences ; communauté de soutien pour débutants |

---

## 12. Santé financière

> 💡 **Concept clé** : La liberté financière n'est pas l'objectif, la santé financière l'est

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Assistant de conscience émotionnelle des dépenses | Analyse des relevés de dépenses, corrélation émotions-dépenses, alertes anti-achats impulsifs ; suggestions de satisfactions alternatives |
| 2 | Motivation visuelle des objectifs d'épargne | Visualisation de la progression vers l'objectif, rendu de scènes de rêve, célébration des jalons ; jeu de formation d'habitudes d'épargne |
| 3 | Apprendre la gestion financière facilement | Envoi de connaissances fragmentées, enseignement par scénarios, quiz interactifs ; tests et certificats de connaissances |
| 4 | Apaisseur d'anxiété financière | Évaluation de la santé financière, techniques de gestion du stress, plans d'action progressifs ; conseil psychologique financier |
| 5 | Jeu d'expérience d'investissement à petit montant | Simulation d'investissement virtuel, éducation aux risques, jeu de portefeuille d'investissement ; guidage vers le micro-investissement réel |

---

## 13. Développement professionnel

> 💡 **Concept clé** : La carrière n'est pas une voie ferrée, c'est un champ ouvert à explorer

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Compagnon de doute professionnel | Tests d'intérêts professionnels, inventaire des compétences, recommandation d'informations sectorielles ; dialogue avec un mentor de carrière |
| 2 | Réveilleur de sentiment d'accomplissement au travail | Enregistrement des réalisations professionnelles, extraction de la valeur, visualisation des succès ; collecte de retours positifs collègues/clients |
| 3 | Assistant d'ambiance sociale au travail | Recommandations de sujets professionnels, techniques de networking, événements sectoriels ; optimisation de contenu LinkedIn |
| 4 | Stimulateur d'idées d'activité secondaire | Matching compétences-intérêts-demande du marché, bibliothèque de cas de side projects, guide de démarrage ; communauté d'échange |
| 5 | Station-service de confiance avant entretien | Simulation d'entretien, préparation aux questions courantes, techniques de renforcement de la confiance ; conseils d'image |

---

## 14. Espace intérieur

> 💡 **Concept clé** : La maison n'est pas seulement un lieu de résidence, c'est le refuge de l'âme

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Designer d'ambiance d'espace intérieur | Analyse de photos d'espace, recommandations de style, suggestions mobilier/décoration ; prévisualisation AR |
| 2 | Guide de transformation saisonnière du logement | Thèmes saisonniers, suggestions de rangement et de mise en valeur, plans de décoration festive ; génération de liste de courses |
| 3 | Magie des petits espaces | Algorithme d'optimisation spatiale, mobilier multifonction, techniques de rangement ; astuces d'agrandissement visuel |
| 4 | Créateur de rituels du quotidien à la maison | Design de rituels quotidiens (matin/soir/week-end), rappels d'exécution ; retour sur les effets des rituels |
| 5 | Compagnon psychologique du désencombrement | Évaluation de la valeur émotionnelle des objets, guidage étape par étape du tri, soutien psychologique ; recommandation de canaux de don/recyclage |

---

## 15. Gastronomie et cuisine

> 💡 **Concept clé** : La nourriture est un langage d'amour, cuisiner est une façon d'exprimer l'amour

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Cuisine réconfortante pour une personne | Identification des ingrédients du frigo, recettes simples, guide étape par étape ; esthétique de dressage solo |
| 2 | Design d'ambiance de table de fête | Menu thématique festif, plan de mise en table, techniques d'ambiance ; optimisation de l'expérience des convives |
| 3 | Adaptateur cuisine-humeur | Algorithme d'association humeur-aliment, recettes de régulation émotionnelle, recommandations de comfort food ; guidage de guérison par la cuisine |
| 4 | Constructeur de confiance pour débutants en cuisine | Recettes ultra-simples, astuces de sauvetage des ratés, formulations de renforcement de la confiance ; progression graduelle de difficulté |
| 5 | Guide d'ambiance photographie culinaire | Suggestions de dressage, utilisation de la lumière naturelle, guidage des angles de prise de vue ; filtres et retouches recommandés |

---

## 16. Style vestimentaire

> 💡 **Concept clé** : S'habiller, c'est s'exprimer ; le style est la manifestation extérieure de l'intérieur

| N° | Nom du scénario | Fonctionnalité du scénario |
| :--: | ------------ | ------------ |
| 1 | Mood board de tenue du jour | Recommandation combinée météo/occasion/humeur, essayage virtuel, inspiration de looks ; gestion de garde-robe |
| 2 | Styliste de garde-robe capsule | Inventaire de la garde-robe, combinaisons de pièces, programmes une pièce-multi looks ; conseils d'achat (combler les lacunes) |
| 3 | Voyage d'exploration du style personnel | Test de style, recommandation d'icônes de référence, parcours d'évolution stylistique ; construction de la confiance |
| 4 | Créatif de relookage vestimentaire | Inspirations de transformation de vêtements anciens, nouvelles associations, techniques d'accessoirisation ; mode durable |
| 5 | Consultant look pour occasions spéciales | Décryptage du dress code, génération de plans de tenue, suggestions coiffure et maquillage ; coordination de l'ensemble |

---

## Principes fondamentaux pour la conception de produits B2C

### 1. De la « fonctionnalité » au « ressenti »

Les produits B2B se demandent « quel problème cette fonctionnalité résout-elle », les produits B2C se demandent « quel ressenti cette fonctionnalité procure-t-elle ».

| Pensée B2B | Pensée B2C |
|---------|---------|
| Améliorer l'efficacité | Gagner du temps pour faire ce qu'on aime |
| Réduire les coûts | Faire en sorte que chaque euro en vaille la peine |
| Résoudre les points de douleur | Créer des expériences agréables |
| Fonctionnalité complète | Le ressenti est au rendez-vous |

### 2. Les trois niveaux de la création d'ambiance

**Niveau sensoriel** : conception visuelle, auditive et tactile
- Couleurs chaleureuses
- Sons apaisants
- Animations fluides

**Niveau émotionnel** : résonance et guidage des émotions
- Comprendre l'humeur de l'utilisateur
- Offrir un soutien émotionnel
- Créer des émotions positives

**Niveau de sens** : adhésion aux valeurs et sentiment d'appartenance
- Faire sentir à l'utilisateur qu'il est compris
- Créer un sentiment d'appartenance
- Donner du sens aux actions

### 3. La puissance de la suggestion psychologique

Le texte et le design des produits B2C transmettent tous des suggestions psychologiques :

- **Suggestions positives** : « Tu fais déjà du bon travail », « Prends ton temps, ce n'est pas grave »
- **Suggestions d'appartenance** : « Beaucoup de gens sont comme toi », « Tu n'es pas seul(e) »
- **Suggestions de croissance** : « Chaque essai est un progrès », « Tu deviens meilleur(e) »

### 4. Permettre aux utilisateurs de devenir la meilleure version d'eux-mêmes

Le meilleur produit B2C ne change pas l'utilisateur, il l'aide à devenir la personne qu'il souhaite être.

- Pas « tu devrais... », mais « tu peux... »
- Pas « tu dois... », mais « si tu le souhaites... »
- Pas « tu n'es pas encore assez... », mais « tu es déjà... »

---

> 🌟 **Rappelez-vous** : les utilisateurs B2C n'achètent pas des fonctionnalités, ils achètent des sensations ; pas des outils, mais de la compagnie ; pas des services, mais de la compréhension.

</TabItem>
</Tabs>
