---
title: 'AI-Anwendungsszenarien-Referenz (B2B & B2C)'
description: 'Dieses Dokument fasst LLM-Anwendungen in B2B-Unternehmens- und B2C-Konsumszenarien zusammen. B2B deckt 19 Branchen ab, darunter Fertigung, Kundenservice, Bildung, Gesundheitswesen und Finanzdienstleistungen; B2C deckt 16 Konsumszenarien ab, darunter Lebensstil, emotionale Begleitung, Unterhaltung und persoenliches Wachstum, und bietet Entwicklern von AI-Anwendungen eine umfassende Referenz.'
---

<script setup>
import { computed, ref } from 'vue'

const duration = 'ca. <strong>6 Stunden</strong>'

const interestPoint = ref('')
const purpose = ref('')

const topicPool = {
  manufacturing: [
    { title: 'AI-gestuetzte Designplattform', desc: 'Konzeptdesign fuer Produktoptik mit Bildgenerierungsmodellen' },
    { title: 'Intelligenter Assistent fuer Zeichnungspruefung', desc: 'Designnormen mit RAG als Wissensbasis nutzbar machen' },
    { title: 'Automatische technische Dokumentation', desc: 'Spezifikationen und Handbuecher mit LLM erzeugen' },
    { title: 'Automatische Anlagen-Inspektionsberichte', desc: 'Sprachbeschreibung in strukturierte Berichte umwandeln' },
    { title: 'Q&A fuer Industrieanlagen-Fehlerdiagnose', desc: 'Historische Fehlerfaelle als Vektor-Wissensbasis nutzen' }
  ],
  'customer-service': [
    { title: 'Multikanal-Kundenservice mit Auto-Antworten', desc: 'Nachrichten verstehen, Antworten erzeugen und Tickets anlegen' },
    { title: 'Lead-Erkennung und Follow-up-Empfehlungen', desc: 'Dialoghistorien analysieren und Kaufabsicht bewerten' },
    { title: 'Interner Wissens-Q&A-Assistent', desc: 'Interne Dokumente als RAG-Wissensbasis erschliessen' },
    { title: 'Gespraechszusammenfassung und Ticket-Erstellung', desc: 'Kerninformationen extrahieren und Felder automatisch fuellen' },
    { title: 'Best-Practice-Skript-Wissensbasis', desc: 'Erfolgreiche Servicefaelle in Skriptvorlagen verdichten' }
  ],
  education: [
    { title: 'Personalisierter Sprachlernpfad', desc: 'Lernniveau einschaetzen und taegliche Aufgaben planen' },
    { title: 'Automatische Unterrichtsentwuerfe', desc: 'Aus Lehrplaenen Unterrichtsrahmen und Ressourcen erzeugen' },
    { title: 'Automatische Korrektur und Lernanalyse', desc: 'Subjektive Aufgaben bewerten und Hinweise geben' },
    { title: 'Kompetenzmodell und Lernlandkarte', desc: 'Stellenanforderungen in Lernpfade uebersetzen' },
    { title: 'Fremdsprachen-Szenariotraining', desc: 'LLM spielt Rollen fuer muendliche Uebungen' }
  ],
  programming: [
    { title: 'Code-Vervollstaendigung und Bug-Fix', desc: 'IDE-Plugin liefert Vorschlaege und Reparaturen' },
    { title: 'Low-Code-App-Bau und Automatisierung', desc: 'Natuerliche Sprache in Low-Code-Konfigurationen umwandeln' },
    { title: 'Unit-Test-Generator', desc: 'Code per AST analysieren und Grenzfaelle erzeugen' },
    { title: 'Code-Analyse und Sprachmigration', desc: 'Qualitaet pruefen und Migrationsvorschlaege geben' },
    { title: 'Frontend-UI-Codegenerierung', desc: 'Designbilder erkennen und responsives CSS erzeugen' }
  ],
  healthcare: [
    { title: 'Intelligente Laborbefund-Interpretation', desc: 'Kennzahlen per OCR erkennen und Auffaelligkeiten erklaeren' },
    { title: 'Gesundheitsberatung mit Wissens-Retrieval', desc: 'Medizinische Wissensgraphen und RAG fuer Antworten nutzen' },
    { title: 'Datenanalyse fuer klinische Forschung', desc: 'EMR-Daten integrieren und Auswertungscode unterstuetzen' },
    { title: 'Automatische Bildbefunde', desc: 'Bildmerkmale in strukturierte Berichte ueberfuehren' },
    { title: 'Medikationsassistent fuer chronische Krankheiten', desc: 'Erinnerungen erzeugen und Kontraindikationen pruefen' }
  ],
  security: [
    { title: 'Code-Sicherheitsluecken erkennen und beheben', desc: 'SAST-Ergebnisse mit LLM erklaeren und Fixes vorschlagen' },
    { title: 'AI-Phishing-Mail-Erkennung', desc: 'Mailinhalte, Absender und Links auf Risiken pruefen' },
    { title: 'Automatische Security-Tagesberichte', desc: 'Logs zusammenfassen und Schluesselereignisse extrahieren' },
    { title: 'Penetrationstest-Berichtsgenerator', desc: 'Schwachstellenbeschreibungen in Berichte umwandeln' },
    { title: 'Threat-Intelligence-Analyse', desc: 'Mehrere Quellen anbinden und Auswirkungen bewerten' }
  ],
  finance: [
    { title: 'Kredit-Due-Diligence-Berichte', desc: 'Finanzdaten analysieren und Risikoberichte erzeugen' },
    { title: 'Private-Banking-Vermoegensberater', desc: 'Risikoprofil analysieren und Allokation empfehlen' },
    { title: 'IPO-Prospekt und Compliance-Pruefung', desc: 'Vorlagen fuellen und Konsistenz pruefen' },
    { title: 'Finanzbericht und Anomaliewarnung', desc: 'Finanzanalyse automatisieren und Abweichungen markieren' },
    { title: 'Training fuer Versicherungsagenten', desc: 'Kundendialoge simulieren und Skripte bewerten' }
  ],
  enterprise: [
    { title: 'Compliance-Pruefung im Vertragslebenszyklus', desc: 'Klauseln mit Regeln vergleichen und Aenderungen vorschlagen' },
    { title: 'Verkaufsgespraech-Transkription', desc: 'ASR nutzen und passende Skripte empfehlen' },
    { title: 'Marketing-Content und Design', desc: 'Verkaufstexte und Kernargumente erzeugen' },
    { title: 'Analyse von Wettbewerber-Werbung', desc: 'Anzeigen sammeln und Platzierungsstrategien auswerten' },
    { title: 'Netzweite Trendanalyse', desc: 'Hot Topics erkennen und Themenwinkel empfehlen' }
  ],
  content: [
    { title: 'Assistenz fuer Film- und Romaninhalte', desc: 'Outline, Figuren und Dialoge erzeugen' },
    { title: 'Markengeschichte und PR-Artikel', desc: 'Markenkeywords in mehrere Textstile uebersetzen' },
    { title: 'Virtueller Avatar fuer Livestreams', desc: 'Digitaler Mensch, TTS und LLM-Dialog kombinieren' },
    { title: 'Short-Video-Skript und Schnitt', desc: 'Skripte, Storyboards und Schnittvorschlaege erzeugen' },
    { title: 'Marketing-Content-System', desc: 'Copy und Selling Points strukturiert generieren' }
  ],
  government: [
    { title: 'Buergerhotline mit Sprachdialog und Dispatch', desc: 'Anliegen erkennen und automatisch weiterleiten' },
    { title: 'Service-Wegweiser und Politik-Q&A', desc: 'Verwaltungswissen per RAG abrufbar machen' },
    { title: 'Foerderpolitik-Matching', desc: 'Unternehmensprofile mit passenden Programmen abgleichen' },
    { title: 'Vorpruefung von Verwaltungsunterlagen', desc: 'Dokumente per OCR erkennen und Vollstaendigkeit pruefen' },
    { title: 'Stadt-Grid-Ereignismanagement', desc: 'Ereignistypen erkennen und Einsatzstellen zuteilen' }
  ],
  legal: [
    { title: 'Agent fuer Vertragsrisiken', desc: 'Klauseln mit Risikolisten vergleichen und markieren' },
    { title: 'AI-Berater fuer Gewinnwahrscheinlichkeit', desc: 'Fallmerkmale extrahieren und aehnliche Faelle finden' },
    { title: 'Monitoring von Gesetzesaenderungen', desc: 'Aenderungen auswerten und Auswirkungen analysieren' },
    { title: 'AIGC-Entwurf fuer Anwaltsschreiben', desc: 'Sachverhalte in standardisierte Schreiben ueberfuehren' },
    { title: 'Rechtsklauseln in Alltagssprache', desc: 'Komplexe Klauseln verstaendlich erklaeren' }
  ],
  travel: [
    { title: 'AIGC-Reisefuehrer-Generator', desc: 'Aus Praeferenzen Tagesplaene erzeugen' },
    { title: 'Flug- und Hotelpreisprognose', desc: 'OTA-Daten sammeln und Preistrends vorhersagen' },
    { title: 'Reiseplan-Reorganisation bei Flugausfall', desc: 'Alternativen analysieren und Notfallplaene empfehlen' },
    { title: 'Visa-Unterlagen-Pruefung', desc: 'Fotos per OCR auswerten und Formulare fuellen' },
    { title: 'Sprach- und Menueuebersetzung auf Reisen', desc: 'Offline-Sprache und Menuebilder uebersetzen' }
  ],
  emotion: [
    { title: 'Virtueller 24-Stunden-Begleiter', desc: 'Gespraechshistorie merken und empathisch antworten' },
    { title: 'Multimodale Emotionserkennung', desc: 'Stimme und Text fuer Unterstuetzung auswerten' },
    { title: 'Kognitives Training fuer Alzheimer', desc: 'Spiele und Erinnerungsimpulse kombinieren' },
    { title: 'Sozialtraining bei sozialer Angst', desc: 'Szenarien simulieren und Tipps geben' },
    { title: 'Stimmungsmonitoring und positive Impulse', desc: 'Trends erkennen und ermutigende Inhalte erzeugen' }
  ],
  entertainment: [
    { title: 'Open-World-NPC-Entscheidungsengine', desc: 'Verhaltensbaeume mit LLM-Entscheidungen kombinieren' },
    { title: 'Murder-Mystery-DM-Assistent', desc: 'Spielerentscheidungen in Handlungszweige uebersetzen' },
    { title: 'Interaktive Romanenden', desc: 'Leserentscheidungen generieren neue Enden' },
    { title: 'E-Sport-Analyse und AI-Kommentar', desc: 'Spielbilder analysieren und Kommentare erzeugen' },
    { title: 'Mehrrollen-TTS-Hoerbuch', desc: 'Textrollen verteilen und Stimmen erzeugen' }
  ],
  ecommerce: [
    { title: 'Produktdetailseiten in hoher Konversion', desc: 'Selling Points und Szenenbeschreibungen erzeugen' },
    { title: 'Virtuelle Kleidermodelle und Try-on', desc: 'Anprobeeffekte und Praesentationsvideos generieren' },
    { title: 'Mehrsprachige E-Commerce-Lokalisierung', desc: 'Produkttexte uebersetzen und kulturell polieren' },
    { title: 'Digitaler Livestream-Verkauf', desc: 'Avatar, Echtzeit-Skript und Produktdaten verbinden' },
    { title: 'Trend-Insight und Bestseller-Prognose', desc: 'Social- und Shopdaten fuer Produktauswahl auswerten' }
  ],
  energy: [
    { title: 'Stromverbrauchsanalyse im Haushalt', desc: 'Verbrauchsmuster erkennen und Sparstrategien ableiten' },
    { title: 'PV-Defekterkennung per Drohne', desc: 'Thermische Bilder analysieren und Defekte markieren' },
    { title: 'Strompreisprognose und Handelsstrategie', desc: 'Preise vorhersagen und Strategien erzeugen' },
    { title: 'CO2-Footprint und ESG-Bericht', desc: 'Emissionsfaktoren berechnen und Berichte erstellen' },
    { title: 'Lastprognose bei Extremwetter', desc: 'Wetterdaten anbinden und Notfalldispatch planen' }
  ],
  'av-media': [
    { title: 'Highlight-Erkennung und Short-Video-Schnitt', desc: 'Keyframes finden und Clips automatisch schneiden' },
    { title: 'Rauschtrennung und Stimmverstaerkung', desc: 'Audio separieren und Sprache verbessern' },
    { title: '4K-Restauration alter Aufnahmen', desc: 'Super-Resolution und Kolorierung einsetzen' },
    { title: 'Realistische TTS-Synchronisation', desc: 'Mehrstimmige TTS mit Emotionssteuerung nutzen' },
    { title: 'Meeting-Transkription und To-do-Extraktion', desc: 'Sprecher trennen und Aufgaben extrahieren' }
  ],
  'ai-marketing': [
    { title: 'Virale Social-Copy mit AIGC', desc: 'Themen, Emojis und Hashtags optimieren' },
    { title: 'Marketing-Poster mit AI-Layout', desc: 'Poster automatisch an Formate anpassen' },
    { title: 'Markenlogo und VI-System', desc: 'Logoideen und visuelle Regeln generieren' },
    { title: 'Trend-Hunting fuer Marketingideen', desc: 'Hot Topics finden und kreative Winkel ableiten' },
    { title: 'Short-Video-Skript und Storyboard', desc: 'Skripte, Shots und Drehhinweise erzeugen' }
  ],
  'data-intelligence': [
    { title: 'Natural-Language-to-SQL', desc: 'Natuerliche Sprache in SQL-Abfragen umwandeln' },
    { title: 'Datenasset-Katalog und Klassifikation', desc: 'Metadaten sammeln und automatisch klassifizieren' },
    { title: 'Datenqualitaets-Anomalien', desc: 'Regeln und ML fuer Erkennung und Reparaturhinweise nutzen' },
    { title: 'Intelligente Berichte und Visualisierung', desc: 'Berichte dialogisch konfigurieren' },
    { title: 'Q&A fuer Datenkennzahlen', desc: 'Kennzahlendefinitionen als Wissensbasis nutzen' }
  ]
}

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
  { label: 'Kreative Inhalte', value: 'creative-content', desc: 'Texte, Bilder, Videos und andere Inhalte' },
  { label: 'Technische Services', value: 'tech-service', desc: 'Entwicklungstools, Automatisierung, Code-Assistenz' },
  { label: 'Datenintelligenz', value: 'data-intel', desc: 'Analyse, Prognose und Entscheidungsunterstuetzung' },
  { label: 'Nutzerservice', value: 'user-service', desc: 'Kundenservice, Marketing und Nutzererlebnis' },
  { label: 'Branchenloesungen', value: 'industry-solution', desc: 'Tiefe Anwendungen fuer konkrete Branchen' }
]

const purposeOptions = [
  { label: 'Effizienz steigern', value: 'increase-efficiency', desc: 'Automatisieren und Prozesse beschleunigen' },
  { label: 'Kosten senken', value: 'reduce-cost', desc: 'Personalaufwand und Ressourcenverbrauch reduzieren' },
  { label: 'Erlebnis verbessern', value: 'improve-experience', desc: 'Servicequalitaet und Zufriedenheit erhoehen' },
  { label: 'Geschaeft erneuern', value: 'innovate-business', desc: 'Neue Produkte und neue Modelle erkunden' }
]

const industries = [
  { key: 'manufacturing', name: 'Industriefertigung', anchor: '#_1-industriefertigung' },
  { key: 'customer-service', name: 'Intelligenter Kundenservice', anchor: '#_2-intelligenter-kundenservice' },
  { key: 'education', name: 'Bildungswesen', anchor: '#_3-bildungswesen' },
  { key: 'programming', name: 'Intelligentes Programmieren', anchor: '#_4-intelligentes-programmieren' },
  { key: 'healthcare', name: 'Gesundheitswesen', anchor: '#_5-gesundheitswesen' },
  { key: 'security', name: 'Cybersicherheit', anchor: '#_6-cybersicherheit' },
  { key: 'finance', name: 'Finanzen und Versicherung', anchor: '#_7-finanzen-und-versicherung' },
  { key: 'enterprise', name: 'Unternehmensservices', anchor: '#_8-unternehmensservices' },
  { key: 'content', name: 'Content-Produktion und Betrieb', anchor: '#_9-content-produktion-und-betrieb' },
  { key: 'government', name: 'Smart Government', anchor: '#_10-smart-government' },
  { key: 'legal', name: 'Recht und Vertragsmanagement', anchor: '#_11-recht-und-vertragsmanagement' },
  { key: 'travel', name: 'Reise und Mobilitaet', anchor: '#_12-reise-und-mobilitaet' },
  { key: 'emotion', name: 'Emotionale Begleitung', anchor: '#_13-emotionale-begleitung' },
  { key: 'entertainment', name: 'Unterhaltung und Freizeit', anchor: '#_14-unterhaltung-und-freizeit' },
  { key: 'ecommerce', name: 'E-Commerce Services', anchor: '#_15-e-commerce-services' },
  { key: 'energy', name: 'Energie', anchor: '#_16-energie' },
  { key: 'av-media', name: 'Audio und Video', anchor: '#_17-audio-und-video' },
  { key: 'ai-marketing', name: 'AI-Marketing', anchor: '#_18-ai-marketing' },
  { key: 'data-intelligence', name: 'Datenintelligenz', anchor: '#_19-datenintelligenz' }
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
        topics.push({
          ...topic,
          industryKey: key,
          industryName: industry.name,
          industryAnchor: industry.anchor
        })
      })
    }
  })

  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

const currentSelection = computed(() => {
  const interest = interestOptions.find(i => i.value === interestPoint.value)
  const pur = purposeOptions.find(p => p.value === purpose.value)
  return {
    interest: interest?.label || '',
    purpose: pur?.label || ''
  }
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
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
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
const cDuration = 'ca. <strong>4 Stunden</strong>'

const vibePoint = ref('')
const feeling = ref('')

// Themenpool pro Szenario: Fokus auf Gefuehl, Atmosphaere und psychologische Suggestion
const cTopicPool = {
  'lifestyle': [
    { title: 'Morgenritual-Aktivierer', desc: 'Erstellt persoenliche Morgenrituale basierend auf Wetter, Terminen und Stimmung' },
    { title: 'Wohlfuehl-Atmosphaere fuer Single-Haushalte', desc: 'Gestaltet Wohlfuehl-Ambiente mit Licht, Musik und Duft-Kombinationen' },
    { title: 'Wochenend-Wellness-Plan-Generator', desc: 'Empfiehlt die perfekte Couch-Kombination: Film + Snacks + Ambiente' },
    { title: 'Einschlaf-Geschichten-Radio', desc: 'Sanfte Geschichten und Meditationsfuehrungen als persoenlicher Begleiter zum Einschlafen' },
    { title: 'Alltagsaesthetik-Inspiration', desc: 'Entdeckt Schoenheit im Alltag und generiert Aesthetik-Tipps und Ritualfuehrer' }
  ],
  'emotion': [
    { title: 'Nachtlicher Zuhoerer', desc: '24/7 verfuegbarer emotionaler Zuhoerer ohne Wertung' },
    { title: 'Trennungs-Begleiter', desc: 'Sanfte Begleitung, Heilungsraete und emotionale Entlastung nach einer Trennung' },
    { title: 'Angstbewaeltigungs-Atemtrainer', desc: 'Erkennt Angst und fuehrt Atemuebungen und Achtsamkeitsmeditation an' },
    { title: 'Selbstvertrauens-Aufbauer', desc: 'Hilft durch positive Dialoge und psychologische Suggestion beim Wiederaufbau von Selbstwert' },
    { title: 'Emotionales Tagebuch-Analyst', desc: 'Analysiert Emotionstagebuecher, erkennt Muster und gibt warme Einblicke' }
  ],
  'entertainment': [
    { title: 'Immersives Murder-Mystery DM', desc: 'Spielt den Spielleiter, erzeugt Spannung und treibt die Handlung voran' },
    { title: 'Open-World-Seelen-NPC', desc: 'NPCs mit Persoenlichkeit, die sich an Spielergeschichten erinnern' },
    { title: 'Personalisierter Podcast-Generator', desc: 'Erstellt eigene Podcasts basierend auf Interessen, natuerlich wie ein Gespraech' },
    { title: 'Virtuelles Konzert-Ambiente', desc: 'Erzeugt Live-Gefuehl bei Online-Konzerten mit Echtzeit-Interaktion' },
    { title: 'Interaktiver Roman-Mitschreiber', desc: 'Erstellt gemeinsam Geschichten, jede Wahl beeinflusst die Handlung' }
  ],
  'growth': [
    { title: 'Persoenlicher Wachstums-Begleiter', desc: 'Dokumentiert Entwicklung, ermutigt und blickt auf wichtige Meilensteine zurueck' },
    { title: 'Gamifizierter Gewohnheits-Coach', desc: 'Verwandelt oede Gewohnheitsbildung in ein spannendes Abenteuerspiel' },
    { title: 'Lernpartner-Vermittlung', desc: 'Findet gleichgesinnte Lernpartner fuer gegenseitige Motivation' },
    { title: 'Taegliche Kleinodes-Entdecker', desc: 'Hilft, kleine Schoenheiten im Alltag zu finden und Dankbarkeit zu kultivieren' },
    { title: 'Lebenssimulator', desc: 'Simuliert verschiedene Lebensentscheidungen und erlebt alternative Wege' }
  ],
  'social': [
    { title: 'Eisbrecher-Thema-Generator', desc: 'Bietet interessante Themen fuer soziale Anlaesse zum Aufbrechen' },
    { title: 'Social-Media-Copywriter', desc: 'Generiert stilvolle Posts basierend auf Fotos und Stimmung' },
    { title: 'Date-Atmosphaere-Planer', desc: 'Plant komplette Date-Ambientes von Ort ueber Themen bis Ueberraschungen' },
    { title: 'Remote-Party-Animator', desc: 'Belebt Online-Geselligkeit mit Spielen und Interaktion' },
    { title: 'Sozialenergie-Manager', desc: 'Hilft Introvertierten, soziale Energie zu managen' }
  ],
  'creative': [
    { title: 'Inspiration-Notfallkit', desc: 'Unerwartete kreative Funken bei Ideenblockaden' },
    { title: 'Personal-Style-Entdecker', desc: 'Hilft, den eigenen einzigartigen Stil zu finden' },
    { title: 'Bullet-Journal-Aesthetik-Berater', desc: 'Bietet Layout-, Farb- und Content-Tipps fuer Buecher und Tagebuecher' },
    { title: 'Fotografie-Kompositions-Leitfaden', desc: 'Gibt Foto- und Bearbeitungstipps basierend auf Szene und gewuenschter Stimmung' },
    { title: 'Stimmungsbasierter Musik-Matcher', desc: 'Empfiehlt die perfekte Musikauswahl fuer aktuelle Stimmung und Szene' }
  ],
  'travel': [
    { title: 'City-Walk-Entdeckerfuehrer', desc: 'Erkunde Staedte wie ein Einheimischer und finde versteckte Orte' },
    { title: 'Reise-Tagebuch-Generator', desc: 'Verwandelt Reisefotos und Stimmungen in schoene Reiseberichte' },
    { title: 'Solo-Reise-Begleiter', desc: 'Bietet Begleitung, Ratschlaege und Sicherheit fuer Alleinreisende' },
    { title: 'Zielort-Atmosphaere-Vorschau', desc: 'Erlebe die Atmosphaere des Reiseziels vorab immersiv' },
    { title: 'Reisefotografie-Stimmungsberater', desc: 'Gibt Anleitung fuer atmosphaerische Reisefotos basierend auf Szene und Licht' }
  ],
  'health': [
    { title: 'Motivations-Aktivierer', desc: 'Gibt genau die richtige Ermutigung wenn man sich nicht bewegen moechte' },
    { title: 'Gesunde-Kueche-Inspiration', desc: 'Generiert gesunde, wohltuende Rezepte basierend auf Stimmung und Zutaten' },
    { title: 'Schlafqualitaet-Optimierer', desc: 'Erstellt umfassend optimale Schlafbedingungen von Umwelt bis Psyche' },
    { title: 'Koerperwahrnehmungs-Leitfaden', desc: 'Lenkt die Aufmerksamkeit auf Koerpersignale und foerdert Koerper-Geist-Verbindung' },
    { title: 'Selbstfuersorge-Erinnerung', desc: 'Erinnert daran, im Alltag innezuhalten und sich selbst zu pflegen' }
  ],
  'learning': [
    { title: 'Gamifizierter Wissens-Explorer', desc: 'Verwandt oedes Lernen in ein spannendes Entdeckungsabenteuer' },
    { title: 'Sprachlern-Szenariopartner', desc: 'Spielt verschiedene Rollen fuer natuerliches Sprachenlernen in Dialogen' },
    { title: 'Neugier-Befriediger', desc: 'Beantwortet wilde Fragen und stillt die Neugier auf die Welt' },
    { title: 'Lesebuch-Inspiration', desc: 'Hilft beim Ordnen von Leseeindruecken und findet neue Perspektiven' },
    { title: 'Wissensvermittlung-Gestalter', desc: 'Verwandelt Gelerntes in interessante Teilen-Inhalte' }
  ],
  'relationship': [
    { title: 'Beziehungs-Kommunikationscoach', desc: 'Hilft, schwierige Gefuehle auszudruecken und Beziehungen zu verbessern' },
    { title: 'Familien-Gedanken-Erinnerung', desc: 'Erinnert daran, sich um Familie zu kuemmern mit herzlichen Interaktions-Tipps' },
    { title: 'Freundschaftspflege-Berater', desc: 'Hilft, Fernfreundschaften zu pflegen und gemeinsame Themen zu finden' },
    { title: 'Liebesgesten- und Ueberraschungsplaner', desc: 'Plant unvergessliche Ueberraschungen und romantische Momente' },
    { title: 'Konfliktdeeskalations-Berater', desc: 'Bietet Ratschlaege und Formulierungen zur Entspannung bei Beziehungskonflikten' }
  ],
  'pet': [
    { title: 'Haustier-Tagebuch', desc: 'Tagebucheintraege aus der Perspektive des Haustiers' },
    { title: 'Haustier-Verhaltensdeuter', desc: 'Entschluesselt die Korpersprache des Haustiers' },
    { title: 'Haustier-Aktivitaeten-Planer', desc: 'Plant kreative Interaktionsaktivitaeten mit dem Haustier' },
    { title: 'Haustier-Gedaechtnis-Geschichten', desc: 'Verwandelt Fotos und Erinnerungen in herzliche Geschichten' },
    { title: 'Neulings-Haustierfuehrer', desc: 'Bietet waerme Begleitung und Anleitung fuer Erst-Haustierbesitzer' }
  ],
  'finance': [
    { title: 'Kaufimpuls-Bewusstsein', desc: 'Erkennt Emotionen hinter Impulskaeufen und foerdert gesunde Konsumgewohnheiten' },
    { title: 'Sparziel-Visualisierer', desc: 'Verwandelt Sparziele in sichtbare Traumfortschritte' },
    { title: 'Finanzwissen-Spaasschule', desc: 'Lerne Finanzwissen auf unterhaltsame Weise' },
    { title: 'Finanzangst-Beruhiger', desc: 'Bietet emotionale Unterstuetzung und praktische Ratschlaege bei Finanzstress' },
    { title: 'Mini-Investment-Experience', desc: 'Spielerischer Einstieg ins Investieren mit niedriger Hemmschwelle' }
  ],
  'career': [
    { title: 'Karriereorientierungs-Begleiter', desc: 'Bietet Zuhoeren, Erkundung und Orientierung in beruflichen Uebergangsphasen' },
    { title: 'Beruflicher Sinn-Aktivierer', desc: 'Hilft, Wert und Bedeutung in der Arbeit zu entdecken' },
    { title: 'Beruflicher Netzwerk-Berater', desc: 'Bietet lockere Themen und Interaktionstipps fuer berufliche Netzwerke' },
    { title: 'Nebenverdienst-Ideengeber', desc: 'Weckt kreative Nebenverdienst-Ideen basierend auf Faehigkeiten und Interessen' },
    { title: 'Vorstellungsgespraech-Confidence-Booster', desc: 'Psychologische Vorbereitung und Motivation vor Vorstellungsgespraechen' }
  ],
  'home': [
    { title: 'Wohnraum-Atmosphaere-Gestalter', desc: 'Designt Wohn-Ambientes basierend auf Stimmung und Jahreszeit' },
    { title: 'Jahreszeiten-Einrichtungsberater', desc: 'Passt die Einrichtung an die Jahreszeiten an fuer Abwechslung' },
    { title: 'Kleine-Raum-Magie', desc: 'Schoene, gemuetliche Atmosphaere auch auf engem Raum' },
    { title: 'Haushaltsritual-Gestalter', desc: 'Verleiht alltaeglichen Haushaltsaktivitaeten Sinn und Ritual' },
    { title: 'Ausmisten-Begleiter', desc: 'Psychologische Unterstuetzung und Entscheidungs Hilfe beim Ausmuellen' }
  ],
  'food': [
    { title: 'Solo-Mahlzeit-Genuss', desc: 'Einfache, wohltuende Rezepte fuer Single-Haushalte' },
    { title: 'Festtisch-Ambiente-Designer', desc: 'Festliche Tischdekorationen fuer besondere Anlaesse' },
    { title: 'Stimmungsbasierter Kuechen-Matcher', desc: 'Empfiehlt Speisen und Zubereitungen passend zur aktuellen Stimmung' },
    { title: 'Kuechenanfaenger-Motivator', desc: 'Waerme Ermutigung und einfache Rezepte fuer Kochanfaenger' },
    { title: 'Food-Fotografie-Ambiente-Guide', desc: 'Macht auch einfache Gerichte fotogen' }
  ],
  'fashion': [
    { title: 'Outfit-Moodboard des Tages', desc: 'Generiert Outfit-Inspiration basierend auf Wetter, Anlass und Stimmung' },
    { title: 'Capsule-Wardrobe-Stylist', desc: 'Unendige Kombinationsmoeglichkeiten mit wenigen Teilen' },
    { title: 'Personal-Style-Reise', desc: 'Hilft, den eigenen einzigartigen Stil zu entdecken und aufzubauen' },
    { title: 'Upcycling-Style-Kreativierer', desc: 'Neue Kombinationsideen fuer vorhandene Kleidung' },
    { title: 'Anlass-Outfit-Berater', desc: 'Selbstbewusste Outfits fuer besondere Anlaesse' }
  ]
}

// Vordefinierte Empfehlungszuordnung nach Atmosphaere und Gefuehl
const cRecommendationMap = {
  // Atmosphaere: heilsam
  'healing': {
    'relax': ['emotion', 'lifestyle', 'health', 'home'],
    'inspire': ['creative', 'growth', 'learning', 'entertainment'],
    'connect': ['relationship', 'social', 'pet', 'emotion'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Atmosphaere: Wachstum
  'growth': {
    'relax': ['growth', 'learning', 'creative', 'health'],
    'inspire': ['career', 'learning', 'creative', 'growth'],
    'connect': ['social', 'relationship', 'career', 'learning'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Atmosphaere: sozial
  'social': {
    'relax': ['social', 'pet', 'food', 'home'],
    'inspire': ['social', 'creative', 'entertainment', 'travel'],
    'connect': ['relationship', 'social', 'pet', 'travel'],
    'escape': ['social', 'travel', 'entertainment', 'creative']
  },
  // Atmosphaere: Entdeckung
  'explore': {
    'relax': ['travel', 'creative', 'lifestyle', 'food'],
    'inspire': ['travel', 'creative', 'learning', 'entertainment'],
    'connect': ['travel', 'social', 'relationship', 'pet'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Atmosphaere: Alltag
  'daily': {
    'relax': ['lifestyle', 'home', 'health', 'emotion'],
    'inspire': ['creative', 'food', 'fashion', 'home'],
    'connect': ['relationship', 'social', 'pet', 'lifestyle'],
    'escape': ['entertainment', 'creative', 'travel', 'lifestyle']
  }
}

const vibeOptions = [
  { label: 'Heilsam', value: 'healing', desc: 'Waerme, Trost, Heilung' },
  { label: 'Wachstum', value: 'growth', desc: 'Fortschritt, Durchbruch, Transformation' },
  { label: 'Sozial', value: 'social', desc: 'Verbindung, Teilen, Interaktion' },
  { label: 'Entdeckung', value: 'explore', desc: 'Neugier, Abenteuer, Finden' },
  { label: 'Alltag', value: 'daily', desc: 'Gewoehnlich, echt, im Moment' }
]

const feelingOptions = [
  { label: 'Entspannen', value: 'relax', desc: 'Stress abbauen, abschalten' },
  { label: 'Inspiration suchen', value: 'inspire', desc: 'Kreativitaet anregen, Impulse erhalten' },
  { label: 'Verbindung wuenschen', value: 'connect', desc: 'Mit Menschen verbinden, emotionale Resonanz' },
  { label: 'Kurz entfliehen', value: 'escape', desc: 'Der Realitaet entfliehen, eintauchen' }
]

const scenarios = [
  { key: 'lifestyle', name: 'Lebensstil', anchor: '#_1-lebensstil' },
  { key: 'emotion', name: 'Emotionale Begleitung', anchor: '#_2-emotionale-begleitung' },
  { key: 'entertainment', name: 'Unterhaltung', anchor: '#_3-unterhaltung' },
  { key: 'growth', name: 'Persoenliches Wachstum', anchor: '#_4-persoenliches-wachstum' },
  { key: 'social', name: 'Soziale Interaktion', anchor: '#_5-soziale-interaktion' },
  { key: 'creative', name: 'Kreativer Ausdruck', anchor: '#_6-kreativer-ausdruck' },
  { key: 'travel', name: 'Reiseerfahrung', anchor: '#_7-reiseerfahrung' },
  { key: 'health', name: 'Koerperliche und geistige Gesundheit', anchor: '#_8-koerperliche-und-geistige-gesundheit' },
  { key: 'learning', name: 'Wissensentdeckung', anchor: '#_9-wissensentdeckung' },
  { key: 'relationship', name: 'Beziehungspflege', anchor: '#_10-beziehungspflege' },
  { key: 'pet', name: 'Haustier-Begleitung', anchor: '#_11-haustier-begleitung' },
  { key: 'finance', name: 'Finanzielle Gesundheit', anchor: '#_12-finanzielle-gesundheit' },
  { key: 'career', name: 'Karriereentwicklung', anchor: '#_13-karriereentwicklung' },
  { key: 'home', name: 'Wohnraum', anchor: '#_14-wohnraum' },
  { key: 'food', name: 'Kulinarik', anchor: '#_15-kulinarik' },
  { key: 'fashion', name: 'Mode und Stil', anchor: '#_16-mode-und-stil' }
]

// Empfehlungen berechnen: zufaellig aus dem Themenpool auswaehlen
const cRecommendationTopics = computed(() => {
  if (!vibePoint.value || !feeling.value) return []
  
  const keys = cRecommendationMap[vibePoint.value]?.[feeling.value] || []
  const topics = []
  
  // Aus jedem empfohlenen Szenario 1-2 Themen zufaellig auswaehlen
  keys.forEach(key => {
    const scenario = scenarios.find(item => item.key === key)
    const scenarioTopics = cTopicPool[key] || []
    
    if (scenario && scenarioTopics.length > 0) {
      // 1-2 Themen zufaellig auswaehlen
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
  
  // Zufaellig sortieren und Gesamtzahl begrenzen
  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

// Beschreibung der aktuellen Auswahl abrufen
const cCurrentSelection = computed(() => {
  const vibe = vibeOptions.find(i => i.value === vibePoint.value)
  const feel = feelingOptions.find(p => p.value === feeling.value)
  return {
    vibe: vibe?.label || '',
    feeling: feel?.label || ''
  }
})

const cScrollToAnchor = (anchor) => {
  // Scrollen verzoegern, damit das DOM aktualisiert ist
  setTimeout(() => {
    // Suche per ID versuchen (unterstuetzt mehrere Formate)
    let element = document.querySelector(anchor)
    
    // Falls nicht gefunden, andere moegliche ID-Formate versuchen
    if (!element) {
      // Unterstrich-Praefix entfernen
      const altAnchor = anchor.replace('#_', '#')
      element = document.querySelector(altAnchor)
    }
    
    // Falls weiter nicht gefunden, per Ueberschriftentext suchen
    if (!element) {
      // Szenarionamen aus dem Anchor extrahieren
      const anchorText = decodeURIComponent(anchor.replace('#', '').replace(/^_/, ''))
      const headings = document.querySelectorAll('h2, h3')
      
      for (let heading of headings) {
        const headingText = heading.textContent.trim()
        // Exakte oder partielle Uebereinstimmung
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
      // Zielabschnitt hervorheben
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

# AI-Anwendungsszenarien-Referenz (B2B & B2C)

<Tabs>
<TabItem label="B2B Branche">

## Kapiteluebersicht

<ChapterIntroduction :duration="duration" :tags="['B2B-Anwendungen', 'Industrie', 'AI-Szenarien', 'Umsetzung', 'Branchenloesungen']" coreOutput="15+ B2B-Branchenszenarien verstehen" expectedOutput="Eine passende Richtung fuer Unternehmenskunden finden">

Dieses Dokument sammelt <strong>praktische LLM-Anwendungen in B2B-Unternehmensszenarien</strong>. Im Unterschied zu B2C-Produkten stehen hier reale Geschaeftsprobleme, Effizienzsteigerung, Kostensenkung und Prozesssicherheit im Vordergrund. Die Beispiele helfen dabei, von der Anforderungsanalyse bis zur technischen Umsetzung konkrete Projektideen zu finden.

</ChapterIntroduction>

## Branchenschnellauswahl

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #409EFF;">
  <div style="font-weight: 600; margin-bottom: 8px;">Passende Anwendungsszenarien finden</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    Waehlen Sie Interessengebiet und Ziel. Das System empfiehlt passende Branchenrichtungen; ein Klick auf eine Zeile springt direkt zum Abschnitt.
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="interestPoint" placeholder="Interessengebiet waehlen" style="width: 100%;">
        <el-option v-for="item in interestOptions" :key="item.value" :label="item.label" :value="item.value">
          <div style="display: flex; flex-direction: column;">
            <span>{{ item.label }}</span>
            <span style="font-size: 12px; color: #909399;">{{ item.desc }}</span>
          </div>
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-select v-model="purpose" placeholder="Ziel waehlen" style="width: 100%;">
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
      Empfohlen: {{ recommendationTopics.length }} Anwendungsszenarien
      <span style="font-weight: normal; color: #909399; font-size: 13px; margin-left: 8px;">
        ({{ currentSelection.interest }} + {{ currentSelection.purpose }})
      </span>
    </div>
    <el-table :data="recommendationTopics" style="width: 100%; cursor: pointer;" @row-click="(row) => scrollToAnchor(row.industryAnchor)" highlight-current-row>
      <el-table-column prop="title" label="Anwendungsszenario" min-width="300">
        <template #default="scope">
          <div style="font-weight: 500; color: #303133;">{{ scope.row.title }}</div>
          <div style="font-size: 12px; color: #909399; margin-top: 4px;">{{ scope.row.desc }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="industryName" label="Branche" width="180" align="center">
        <template #default="scope">
          <el-tag type="info" effect="light" size="small">{{ scope.row.industryName }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px; font-size: 12px; color: #909399;">
      Klicken Sie auf eine Tabellenzeile, um zum passenden Branchenkapitel zu springen.
    </div>
  </div>

  <div v-else-if="!interestPoint || !purpose" style="margin-top: 14px; color: #909399; font-size: 13px;">
    <span v-if="!interestPoint && !purpose">Bitte Interessengebiet und Ziel waehlen.</span>
    <span v-else-if="!interestPoint">Bitte Interessengebiet waehlen.</span>
    <span v-else>Bitte Ziel waehlen.</span>
  </div>

  <div v-if="interestPoint || purpose" style="margin-top: 12px;">
    <el-button size="small" @click="resetSelection">Auswahl zuruecksetzen</el-button>
  </div>
</el-card>

## Branchenschnellvorstellung

### Gängige Technologieauswahl

In AI-Anwendungsprojekten tauchen besonders haeufig drei technische Richtungen auf:

1. **LLM**: gut fuer Sprache, Dialoge, Zusammenfassungen, Textgenerierung, Uebersetzung und Wissens-Q&A.
2. **VLM**: verbindet Bildverstehen und Sprache, etwa fuer Bildbeschreibung, visuelle Q&A, Medizinbilder, Qualitaetspruefung und Design.
3. **GenAI**: erzeugt Texte, Bilder, Audio oder Video und eignet sich fuer Designassistenz, Marketingmaterial, Training und Content-Produktion.

### Auswahlstrategie

Wählen Sie eine Richtung nicht nur nach Trend, sondern nach drei praktischen Kriterien:

1. **Interesse**: Wer sich fuer Design interessiert, kann Content oder Industriedesign testen; wer technische Tiefe sucht, kann Security, Medizin oder Entwicklungswerkzeuge waehlen.
2. **Branchennaehe**: Eigene Ressourcen senken die Einstiegskosten. Fertigung, Bildung, Medizin, Handel oder Verwaltung liefern jeweils andere Daten, Workflows und Fachwoerter.
3. **Schwierigkeit**: Einsteiger starten mit Kundenservice, Content oder einfachen Q&A-Systemen; Fortgeschrittene koennen Qualitaetspruefung, medizinische Bildanalyse oder Code-Assistenz bearbeiten.

## 1. Industriefertigung

Fertigungsszenarien drehen sich um Design, Produktion, Qualitaetspruefung und Wartung. AI kann Informationen strukturieren, wiederkehrende Dokumente erzeugen und Expertenwissen leichter nutzbar machen.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | AI-gestuetzte Designplattform | Bildmodelle erzeugen Konzepte; LLM prueft Designregeln; Three.js zeigt 3D-Ansichten. |
| 2 | Zeichnungspruefungsassistent | CAD-Daten analysieren; RAG greift auf Konstruktionsnormen zu. |
| 3 | Technische Dokumentation | Produktdatenbank plus LLM erzeugt Spezifikationen und Handbuecher. |
| 4 | Anlagen-Inspektionsbericht | Spracheingabe wird transkribiert und als strukturierter Bericht gespeichert. |
| 5 | Stapler-Dispatch und Routenplanung | Auftraege, Lagerorte und Karten-API erzeugen optimale Fahrwege. |
| 6 | Datenabfrage per natuerlicher Sprache | Text-to-SQL fragt OLAP-Systeme wie Doris oder ClickHouse ab. |
| 7 | Fehlerdiagnose-Q&A | Historische Stoerfaelle werden als Vektorwissen abgefragt. |
| 8 | Qualitaetspruefbericht | OCR und CV erkennen Defekte; LLM erzeugt Bericht und Klassifikation. |
| 9 | Inventurassistent | Bestandsdaten werden abgeglichen; Abweichungen und Warnungen entstehen automatisch. |
| 10 | Prozessoptimierungs-Q&A | Produktionswissen wird per RAG erschlossen und in Verbesserungsvorschlaege ueberfuehrt. |

## 2. Intelligenter Kundenservice

Kundenservice profitiert stark von LLM, weil viel Kommunikation, Zusammenfassung, Klassifikation und Wissenssuche anfallen.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Multikanal-Auto-Antworten | Website, App und Messenger anbinden; LLM erkennt Absicht und erstellt Tickets. |
| 2 | Lead-Erkennung | Dialoge analysieren, Kaufabsicht bewerten und Follow-up empfehlen. |
| 3 | Internes Wissens-Q&A | Confluence und Dokumente vektorisieren; RAG erzeugt Antworten. |
| 4 | Zufriedenheitsanalyse | Gespraeche nach Sentiment, Problemtyp und Loesungsstatus auswerten. |
| 5 | Gespraechszusammenfassung | Nach Chatende Zusammenfassung und Ticketfelder automatisch ausfuellen. |
| 6 | Skript-Compliance | Antworten auf verbotene Aussagen und Compliance-Risiken pruefen. |
| 7 | Ticket-Klassifikation | Lange Gespraeche zusammenfassen und mit Tags versehen. |
| 8 | Emotionswarnung | Tonfall und Textsignal auswerten; bei Risiko per WebSocket warnen. |
| 9 | Best-Practice-Skripte | Gute Faelle analysieren und passende Vorlagen im Kontext empfehlen. |
| 10 | Outbound-Qualitaetspruefung | Telefonaufnahmen transkribieren, Kernaussagen extrahieren und QA-Berichte erzeugen. |

## 3. Bildungswesen

AI kann Unterricht individualisieren, Lernstaende erfassen und Lehrkraefte bei Material, Feedback und Verwaltung entlasten.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Personalisierter Lernpfad | Niveau und Ziel analysieren; taegliche Aufgaben und Ressourcen empfehlen. |
| 2 | Unterrichtsentwurf | Lehrplan eingeben; LLM erzeugt Ziele, Ablauf und Materialien. |
| 3 | Korrektur und Lernanalyse | Aufgaben bewerten; Wissensluecken ueber Graphen lokalisieren. |
| 4 | Kompetenzmodell | Stellenanzeigen analysieren und Lernlandkarten ableiten. |
| 5 | Schulcurriculum | Schulprofil und Lernbedarf in Kursrahmen und Folien ueberfuehren. |
| 6 | Fremdsprachenpraxis | LLM spielt Rollen; ASR bewertet Aussprache; TTS liefert Vorbild. |
| 7 | Studien- und Karriereberatung | Punktzahlen, Interessen und Zulassungsdaten kombinieren. |
| 8 | Programmiercoach fuer Kinder | Code erklaeren und zwischen Blocksprache und Python vermitteln. |
| 9 | Wissens-Mindmap | Kursthema in Mindmap und naechste Lernschritte umwandeln. |
| 10 | Essay-Bewertung | Struktur, Sprache und Argumentation bewerten und kommentieren. |

## 4. Intelligentes Programmieren

Entwicklungswerkzeuge sind naheliegende B2B-Szenarien, weil Code, Logs, Tickets und Dokumentation bereits stark strukturiert sind.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Code-Vervollstaendigung und Bug-Fix | IDE-Plugin, Fehlerspur-Analyse und automatische Reparaturvorschlaege. |
| 2 | Low-Code-App-Bau | Natuerliche Sprache in Komponenten, Datenmodelle und Workflows ueberfuehren. |
| 3 | Unit-Test-Generator | AST analysieren und Grenzfaelle fuer Jest oder Pytest erzeugen. |
| 4 | Code-Analyse und Migration | Tree-sitter, Regeln und LLM fuer Qualitaet und Sprachwechsel kombinieren. |
| 5 | Natural-Language-to-SQL | Datenfragen in sichere SQL-Abfragen uebersetzen. |
| 6 | API-Test und Dokumentation | Schnittstellenbeschreibungen in Testfaelle und API-Doku umwandeln. |
| 7 | UI-Testwartung | Browseraktionen aufzeichnen und instabile Selektoren reparieren. |
| 8 | Loganalyse | ELK-Daten auswerten, Ursachen verdichten und Fixes empfehlen. |
| 9 | UI-Codegenerierung | Designbilder per OCR/VLM auswerten und Komponenten erzeugen. |
| 10 | Datenbankschema-Design | Anforderungen in ER-Modelle und DDL-Skripte ueberfuehren. |

## 5. Gesundheitswesen

Gesundheitsszenarien verlangen Fachwissen, Datenschutz und menschliche Pruefung. AI eignet sich vor allem fuer Assistenz, Strukturierung und Erklaerung.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Laborbefund-Interpretation | Berichtsbilder erkennen, Werte extrahieren und Auffaelligkeiten erklaeren. |
| 2 | Gesundheitsberatung mit RAG | Leitlinien, ICD-10 und Arzneimittelinformationen abrufbar machen. |
| 3 | Klinische Forschungsanalyse | EMR-Daten integrieren und Analysecode erzeugen. |
| 4 | Medizinische Uebungsfragen | Lehrbuchkapitel in Aufgaben, Loesungen und Fehleranalysen umwandeln. |
| 5 | Pharma-Forschungs-Q&A | Wirkstoff-, Ziel- und Krankheitsgraph fuer Recherche nutzen. |
| 6 | Arzneimittel-Q&A | Beipackzettel erkennen und Dosierung, Risiken und Hinweise beantworten. |
| 7 | Patientenverstaendliche Artikel | Krankheitsname und Zielgruppe in einfache Texte ueberfuehren. |
| 8 | Bildbefund-Generator | Radiologische Merkmale in strukturierte Berichtsvorlagen schreiben. |
| 9 | OP-Bericht | Sprachaufzeichnungen in codierte, strukturierte OP-Dokumentation ueberfuehren. |
| 10 | Medikations-Erinnerung | Medikamentenliste analysieren und Erinnerungen samt Warnungen erzeugen. |

## 6. Cybersicherheit

Security-Szenarien verbinden Logdaten, Code, Bedrohungswissen und klare Handlungsablaeufe. LLM hilft beim Erklaeren und Priorisieren.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Code-Schwachstellen-Fix | SAST-Ergebnisse erklaeren und Pull-Request-Vorschlaege erzeugen. |
| 2 | Phishing-Erkennung | Mailtext, Sender und Links analysieren und Gateway-Regeln anstossen. |
| 3 | Security-Tagesbericht | Logs zusammenfassen und wichtige Ereignisse hervorheben. |
| 4 | Security-Wissens-Q&A | CVE- und interne Dokumente als RAG-Wissen nutzen. |
| 5 | Penetrationstest-Bericht | Schwachstellen in Berichte und Reparaturhinweise ueberfuehren. |
| 6 | Malware- und Datenschutzmonitoring | Sandboxsignale auswerten und sensible Daten erkennen. |
| 7 | Compliance-Checkliste | Systemtyp in Sicherheitschecklisten nach CIS oder anderen Standards umsetzen. |
| 8 | Threat-Intelligence-Q&A | Externe und interne Quellen verbinden und auf eigene Assets beziehen. |
| 9 | Incident-Postmortem | Zeitlinie, Ursache und Verbesserungen aus Ereignisdaten erzeugen. |
| 10 | Globales Threat-Monitoring | Sicherheitsnews und Disclosure-Daten sammeln, bewerten und melden. |

## 7. Finanzen und Versicherung

Finanzszenarien drehen sich um Risiko, Compliance, Dokumente, Beratung und Berichte. AI sollte hier immer mit Audit- und Review-Prozessen gekoppelt werden.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Kredit-Due-Diligence | Unternehmens- und Finanzdaten in Risikoberichte ueberfuehren. |
| 2 | Vermoegensberatung | Risikopraeferenz und Zielportfolio analysieren. |
| 3 | IPO-Prospekt | Vorlagen fuellen und Datenkonsistenz pruefen. |
| 4 | Finanzbericht | Managementanalyse und Warnungen vor Kennzahlenabweichungen erzeugen. |
| 5 | Beleg-Q&A | Rechnungen per OCR erkennen und Rueckfragen beantworten. |
| 6 | Compliance-Fallrecherche | Straf- und Regulierungsfaelle abrufbar machen. |
| 7 | Versicherungscoach | Kundenszenarien simulieren und Skripte bewerten. |
| 8 | Versicherungsproduktvergleich | Klauseln strukturieren und Unterschiede hervorheben. |
| 9 | Emotionserkennung im Vertrieb | Stimme und Formulierungen fuer Coachinghinweise auswerten. |
| 10 | Schadenstatus-Dialog | Police oder Fallnummer abfragen und Status erklaeren. |

## 8. Unternehmensservices

Unternehmensservices betreffen CRM, HR, Marketing, Meeting-Workflows und interne Verwaltung. Gute Projekte starten meist bei einem konkreten, wiederkehrenden Prozess.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Kundenabwanderungswarnung | Verhalten erfassen, Churn-Risiko modellieren und Rueckgewinnung empfehlen. |
| 2 | B2B-Outreach | Firmendaten filtern und personalisierte E-Mails erzeugen. |
| 3 | Sales-Pipeline-Prognose | CRM-Daten analysieren und Zielerreichung vorhersagen. |
| 4 | Markenmonitoring | Nachrichten und Social Media auswerten und Krisen frueh erkennen. |
| 5 | E-Mail-Assistent | Kontext verstehen und professionelle Antwortentwuerfe erzeugen. |
| 6 | CV-Parsing und Matching | Lebenslaeufe extrahieren und passende Stellen empfehlen. |
| 7 | Onboarding-Q&A | Handbuecher und Prozesse fuer neue Mitarbeiter abrufbar machen. |
| 8 | OKR-Feedback | Zielerreichung analysieren und Feedbackvorschlaege erzeugen. |
| 9 | Meeting-Notizen | Transkription, Entscheidungen und Aufgaben automatisch erfassen. |
| 10 | Rechnungs- und Spesenprozess | OCR, Plausibilitaetspruefung und Finanzsystemanbindung kombinieren. |

## 9. Content-Produktion und Betrieb

Content-Prozesse sind gut geeignet, weil Entwurf, Varianten, Bewertung und Distribution stark wiederholbar sind.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Film- und Romanassistenz | Outline, Figuren, Dialoge und Storystruktur erzeugen. |
| 2 | Markenstory und PR-Text | Markenkeywords in mehrere Versionen fuer A/B-Tests umwandeln. |
| 3 | Virtueller Livestream-Avatar | Avatar, TTS, LLM-Dialog und OBS-Streaming verbinden. |
| 4 | Short-Video-Skript und Schnitt | Skript, Storyboard und Highlight-Clips generieren. |
| 5 | Verkaufsgespraech-Skripte | Telefonaufnahmen analysieren und erfolgreiche Formulierungen empfehlen. |
| 6 | Marketing-Content-System | Produktdaten in Copy, Bilder und Kampagnenvarianten ueberfuehren. |
| 7 | ROI-Monitoring fuer Ads | Plattform-APIs auswerten und Optimierungen vorschlagen. |
| 8 | Keyword- und Traffic-Analyse | Suchdaten analysieren und Content-Themen empfehlen. |
| 9 | Wettbewerber-Werbung | Anzeigen sammeln und Strategien sowie Creatives vergleichen. |
| 10 | Trendanalyse und Redaktionsplan | Hot Topics auswerten und Kalenderplaene erzeugen. |

## 10. Smart Government

Verwaltungsprojekte muessen Verstaendlichkeit, Nachvollziehbarkeit und Sicherheit verbinden. AI kann Buergeranliegen strukturieren und interne Arbeit beschleunigen.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Buergerhotline-Dispatch | Anruf erkennen, Anliegen klassifizieren und an Abteilungen leiten. |
| 2 | Service-Wegweiser | Verwaltungswissen per RAG fuer Verfahren und Politikfragen nutzen. |
| 3 | Foerderpolitik-Matching | Unternehmensprofile mit passenden Programmen abgleichen. |
| 4 | Unterlagen-Vorpruefung | OCR und Regeln pruefen Vollstaendigkeit und Compliance. |
| 5 | Videoanomalie im oeffentlichen Raum | CV erkennt Schlaegerei, Sturz oder andere Risiken. |
| 6 | Stadt-Grid-Dispatch | IoT- und Kameradaten in Ereignistypen und Arbeitsauftraege ueberfuehren. |
| 7 | Oeffentliche Meinung und Risiko | Hotline, Netzbeobachtung und Umfragen zusammen analysieren. |
| 8 | Digitale Archivierung | OCR extrahiert Text; LLM klassifiziert Akten. |
| 9 | Notfallressourcen-Dispatch | Ereignisdaten in Reaktionsplaene und Ressourcenverteilung ueberfuehren. |
| 10 | Umweltmonitoring | Luftsensoren und CV-Quellen auswerten und Trends erklaeren. |

## 11. Recht und Vertragsmanagement

Rechtliche Szenarien profitieren von Dokumentenstrukturierung, Aehnlichkeitssuche und klarer Risikoerklaerung. Fachliche Pruefung bleibt zwingend.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Vertragsrisiko-Agent | Vertragsklauseln gegen Risikolisten pruefen. |
| 2 | Vertragslebenszyklus-Review | Regelwerke vergleichen und Aenderungsvorschlaege verfolgen. |
| 3 | Gewinnwahrscheinlichkeitsanalyse | Fallmerkmale und aehnliche Urteile auswerten. |
| 4 | Gesetzesaenderungsradar | Aenderungen erkennen, zusammenfassen und Auswirkungen melden. |
| 5 | Anwaltsschreiben-Entwurf | Sachverhalte in formale Schreiben und Checklisten ueberfuehren. |
| 6 | Gerichtstranskription | Audio transkribieren und Streitpunkte mit Zeitstempeln extrahieren. |
| 7 | IP-Verletzungsmonitoring | Plattformen beobachten und Beweise sichern. |
| 8 | IPO-Datenkonsistenz | Prospektkapitel vergleichen und Abweichungen markieren. |
| 9 | Klauseln in Alltagssprache | Markierte Rechtsklauseln einfach erklaeren. |
| 10 | Beweisketten-Visualisierung | Materialien hochladen, Beziehungen und Zeitlinien analysieren. |

## 12. Reise und Mobilitaet

Reiseszenarien verbinden Planung, Preise, Uebersetzung, Bewertungen und Echtzeitdaten. AI macht aus vielen kleinen Informationen nutzbare Empfehlungen.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | AIGC-Reisefuehrer | Tage, Budget und Interessen in Reiseplaene umwandeln. |
| 2 | Preisprognose fuer Flug und Hotel | OTA-Daten sammeln, Trends modellieren und Warnungen senden. |
| 3 | Reorganisation bei Flugausfall | Statusdaten pruefen und Alternativrouten empfehlen. |
| 4 | Visa-Unterlagen-Assistent | Dokumente erkennen, Vollstaendigkeit pruefen und Formulare fuellen. |
| 5 | Reiseuebersetzung | Sprache offline uebersetzen und Menuebilder per OCR erklaeren. |
| 6 | Hotelbewertungsanalyse | Bewertungen auswerten und Risiken sowie Vorteile verdichten. |
| 7 | VR-Zielvorschau | 360-Grad-Bilder und virtuelle Zimmerbesichtigung kombinieren. |
| 8 | Reisebericht aus Fotos | Zeit und Ort extrahieren und Social Copy erzeugen. |
| 9 | Geschaeftsreise-Abrechnung | Plattform-APIs und Rechnungen fuer Compliance pruefen. |
| 10 | Besucherflussprognose | Auslastungsdaten modellieren und Routen mit weniger Andrang empfehlen. |

## 13. Emotionale Begleitung

Emotionale AI-Anwendungen verlangen besondere Vorsicht, Datenschutz und klare Eskalationsmechanismen. Sie eignen sich eher als begleitende Assistenz als als Ersatz fuer Fachhilfe.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Virtueller Begleiter | Dialogverlauf speichern und personalisierte Antworten erzeugen. |
| 2 | Emotionserkennung und Beratung | Stimme und Text analysieren; Krisenhinweise erkennen. |
| 3 | Alzheimer-Training | Kognitive Spiele und Erinnerungsmedien kombinieren. |
| 4 | Sozialangst-Coach | Virtuelle soziale Situationen simulieren. |
| 5 | Gute-Nacht-Geschichten fuer Kinder | Thema und Vorlieben in personalisierte Geschichten verwandeln. |
| 6 | Digitale Erinnerungsperson | Vorhandene Texte und Stimmen fuer Erinnerungsdialoge nutzen. |
| 7 | Persoenlichkeitsspiegel | Testdaten in Analyse und empathische Antworten ueberfuehren. |
| 8 | Stimmungsmonitor | Tagebuchdaten auswerten und positive Impulse senden. |
| 9 | Anonyme Jugendberatung | Niedrigschwellige Gespraeche mit Sicherheitswarnungen kombinieren. |
| 10 | Virtuelles Haustier | Persoenlichkeitsmodell und Interaktion wachsen lassen. |

## 14. Unterhaltung und Freizeit

Unterhaltungsszenarien nutzen AI fuer Story, Personalisierung, Audio, Video und Gameplay. Der Kern ist meist ein besseres Erlebnis, nicht nur Automatisierung.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Open-World-NPC-Engine | Verhaltensbaum und LLM-Dialoge verbinden. |
| 2 | Murder-Mystery-DM-Assistent | Entscheidungen in Hinweise, Logik und Zweige ueberfuehren. |
| 3 | Interaktive Romanenden | Leserwahl in alternative Enden umwandeln. |
| 4 | 3D-Charaktergenerierung | Textbeschreibung in Skizze, Modell und Material ueberfuehren. |
| 5 | E-Sport-Kommentator | Spielbild analysieren und Kommentare erzeugen. |
| 6 | Humor-Empfehlung | Nutzerprofil mit passenden Inhalten abgleichen. |
| 7 | AI-Stimmkorrektur | Rauschen reduzieren und Gesangsstimme verbessern. |
| 8 | Serienclip-Extraktion | Figurenbezogene Szenen erkennen und schneiden. |
| 9 | Mehrrollen-Hoerbuch | Rollen verteilen, Stimmen erzeugen und Effekte mischen. |
| 10 | Spielanalyse-Coach | Partien auswerten und Trainingshinweise geben. |

## 15. E-Commerce Services

E-Commerce-Projekte zielen auf schnellere Content-Produktion, bessere Conversion, Kundenservice und Preis- oder Trendanalyse.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Produktdetailseiten-Batchproduktion | Produktdaten in Selling Points, Szenen und Bilder ueberfuehren. |
| 2 | Virtuelles Kleidermodel | Produktbilder in Try-on und Demo-Videos umwandeln. |
| 3 | Mehrsprachige Lokalisierung | Produkttexte uebersetzen und kulturell anpassen. |
| 4 | Sentimentbasierter Kundenbot | Beratungsgespräche analysieren und passende Antworten erzeugen. |
| 5 | Digitaler Livestream-Verkauf | Avatar, Produktdaten und Echtzeitskript verbinden. |
| 6 | Preisvergleichs-Plugin | Preise crawlen, Trends zeigen und Warnungen ausloesen. |
| 7 | Kaeuferbild-Auswahl und Short-Video | UGC bewerten und in Video-Vorlagen einsetzen. |
| 8 | Verkaufsdialog-Analyse | ASR und Compliance-Check mit Skriptempfehlung kombinieren. |
| 9 | Trend- und Bestseller-Prognose | Social- und Shopdaten fuer Produktauswahl analysieren. |
| 10 | Private-Traffic-Cluster | Nutzerverhalten clustern und Marketingautomatisierung ausloesen. |

## 16. Energie

Energieszenarien verbinden Messdaten, Prognosen, Inspektion und Nachhaltigkeitsberichte. AI hilft vor allem bei Analyse und operativer Empfehlung.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Stromverbrauchsanalyse | Smart-Meter-Daten auswerten und Sparhinweise geben. |
| 2 | PV-Defekterkennung | Drohnenbilder und Thermodaten fuer Defektmarkierung nutzen. |
| 3 | Strompreisstrategie | Marktpreise prognostizieren und Handelsstrategie erzeugen. |
| 4 | Batteriegesundheit | Betriebsdaten analysieren und Thermal-Runaway-Risiken warnen. |
| 5 | CO2-Footprint und ESG | Energieverbrauch in Emissionen und Berichte umrechnen. |
| 6 | Netzlast bei Extremwetter | Wetter- und Lastdaten fuer Dispatch-Strategien nutzen. |
| 7 | Tankstellen-Sicherheitsvideo | Riskante Handlungen erkennen und Alarm senden. |
| 8 | Pipeline-Lecksuche | Akustiksensoren analysieren und Leckposition berechnen. |
| 9 | Virtuelles Kraftwerk | Dezentrale Ressourcen buendeln und Handelsentscheidungen unterstuetzen. |
| 10 | Minensicherheit | Standortdaten verfolgen und Sperrzonenalarm ausloesen. |

## 17. Audio und Video

Audio- und Videoszenarien verbessern Produktion, Restauration, Transkription und Wiederverwertung von Medieninhalten.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Highlight-Erkennung | Langvideos analysieren und kurze Clips schneiden. |
| 2 | Rauschtrennung | Audiomodelle entfernen Hintergrund und verstaerken Stimme. |
| 3 | 4K-Restauration | Super-Resolution und Kolorierung fuer alte Aufnahmen nutzen. |
| 4 | TTS-Synchronisation | Mehrere Stimmen und Emotionen generieren. |
| 5 | Bilinguale Untertitel | ASR, Uebersetzung und Untertitel-Overlay kombinieren. |
| 6 | Objektentfernung im Video | Tracking und Inpainting fuer konsistente Frames nutzen. |
| 7 | Lizenzfreie Musik | Musikmodelle erzeugen Stilvarianten und pruefen Rechte. |
| 8 | Stimmklon und Voice Conversion | Wenige Samples fuer personalisierte Stimmen nutzen. |
| 9 | Drehbuch zu Storyboard | Skripte parsen und Vorschauvideos generieren. |
| 10 | Meeting-Transkription | Sprechertrennung, Aufgabenextraktion und Zeitstempel erzeugen. |

## 18. AI-Marketing

AI-Marketing kombiniert Content-Erstellung, Layout, Trendanalyse, Budgetsteuerung und Markenmonitoring.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Virale Social-Copy | Themen in kurze, teilbare Copy mit Hashtags umsetzen. |
| 2 | Posterlayout | Copy und Vorlage in mehrere Formate exportieren. |
| 3 | Markenlogo und VI | Markenkeywords in Logoideen und visuelle Regeln verwandeln. |
| 4 | Trend-Hunting | Hot Topics sammeln und Marketingwinkel ableiten. |
| 5 | ROI- und Budgetsteuerung | Ad-Plattformdaten analysieren und Gebote optimieren. |
| 6 | Wettbewerber-Wochenbericht | Konkurrenzinhalte sammeln, Strategien erkennen und berichten. |
| 7 | SEO-Artikel-Batch | Keywords analysieren und Artikel mit Optimierungshinweisen erzeugen. |
| 8 | Personalisierte Marketingmail | Nutzerprofile in individuelle E-Mails und A/B-Tests uebersetzen. |
| 9 | Markenreputation | Netzweite Stimmung auswerten und Krisenwarnungen senden. |
| 10 | Short-Video-Storyboard | Thema in Skript, Shots und Drehhinweise ueberfuehren. |

## 19. Datenintelligenz

Datenintelligenz macht Daten fuer Fachbereiche nutzbar: Fragen, Visualisierungen, Qualitaet, Governance und Kennzahlendefinitionen.

| Nr. | Anwendungsszenario | Umsetzungsreferenz |
| :--: | --- | --- |
| 1 | Text-to-SQL-Datenabfrage | Natuerliche Sprache in SQL und Visualisierung umwandeln. |
| 2 | Dialogisches BI | Eine Frage erzeugt Diagramme und alternative Darstellungen. |
| 3 | Screenshot zu Excel | Tabellenstrukturen per VLM erkennen und exportieren. |
| 4 | Bild zu Tabelle | OCR erkennt Zellstruktur und Daten. |
| 5 | Wissensgraph aus heterogenen Daten | Entitaeten und Beziehungen extrahieren und speichern. |
| 6 | Berichtserklaerung | Diagramme oder Daten hochladen und Trends erklaeren lassen. |
| 7 | Schema-Q&A | Tabellen und Felder erklaeren und Beispiel-SQL erzeugen. |
| 8 | Master-Data-Deduplizierung | Mehrere Quellen abgleichen und Dubletten zusammenfuehren. |
| 9 | Datenanforderung zu Testfaellen | Anforderungen in Pruefszenarien und Validierungen uebersetzen. |
| 10 | Kennzahlen-Q&A | Definitionen, Berechnungslogik und Abhaengigkeiten abrufbar machen. |

</TabItem>
<TabItem label="B2C Konsum">

## Kapiteluebersicht

<ChapterIntroduction :duration="cDuration" :tags="['C-End-Apps', 'Lebensstil', 'Emotionales Erlebnis', 'Atmosphaere']" coreOutput="15+ Lebensszenario-Inspirationen entdecken" expectedOutput="Produktrichtungen finden, die Nutzer beruehren">

Dieses Dokument fasst <strong>kreative Anwendungsrichtungen von LLM in C-End-Konsumszenarien</strong> zusammen. Anders als B-End-Produkte, die auf Effizienz und Schmerzpunkte fokussieren, legen C-End-Produkte mehr Wert auf <strong>Atmosphaere, psychologische Suggestion und Gefuehlsbetonung</strong>, damit Nutzer emotionale Resonanz und positive Erlebnisse haben.

</ChapterIntroduction>

## Schnellauswahl der Szenario-Atmosphaere

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #ec4899;">
  <div style="font-weight: 600; margin-bottom: 8px;">Finden Sie inspirierende Szenarien</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    Waehlen Sie Ihre gewuenschte Atmosphaere und aktuelle Stimmung - das System empfiehlt passende Szenarien. Klicken Sie auf Tags, um zum entsprechenden Kapitel zu springen.
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="vibePoint" placeholder="Atmosphaere-Typ waehlen" style="width: 100%;">
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
      <el-select v-model="feeling" placeholder="Aktuelle Stimmung waehlen" style="width: 100%;">
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
      Fuer Sie empfohlen {{ cCurrentSelection.vibe }} × {{ cCurrentSelection.feeling }}  Szenarien:
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
      Neu waehlen
    </el-button>
  </div>
</el-card>

---

## 1. Lebensstil

> 💡 **Kernkonzept**：Alltaegliches mit Ritualen versehen und Schoenheit in Details schaffen

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Morgenritual-Aktivierungsassistent | Integriert Wetter-API und Kalenderdaten; LLM generiert persoenliche Morgenplaene; spielt passende Musik ueber Smart Speaker ab und laesst Licht langsam heller werden |
| 2 | Atmosphaeren-Gestalter fuer Single-Haushalte | Bindet Smart-Home-Geraete ein (Licht, Lautsprecher, Duftspender); LLM passt Parameter nach Uhrzeit und Stimmung an; lernt Nutzerpraeferenzen und optimiert laufend |
| 3 | Wochenend-Wellness-Plan-Generator fuer Zuhause | Bindet Streaming-APIs fuer Filmlisten ein und kombiniert Nutzerpraeferenzen zu Film + Essen + Einrichtung |
| 4 | Einschlaf-Radio fuer innere Ruhe | Nutzt TTS fuer sanfte Geschichten, mischt White Noise und laesst die Lautstaerke intelligent abfallen; passt Inhalte anhand von Schlafdaten an |
| 5 | Alltagsaesthetik-Inspirationsfaenger | Analysiert Umgebungsfotos per Bilderkennung, LLM generiert Aesthetik-Tipps; Content-Empfehlungen im Stil von Pinterest/Xiaohongshu |

---

## 2. Emotionale Begleitung

> 💡 **Kernkonzept**：Bedingungslose Annahme und Begleitung als sanfter emotionaler Raum

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Naechtlicher Kummerkasten-Zuhoerer | Ende-zu-Ende-Verschluesselung fuer Privatsphaere; LLM-Emotionsanalyse versteht Gefuehle; Langzeitgedaechtnis speichert Nutzerstories und begleitet in Mehr-Runden-Dialogen |
| 2 | Trennungs-Heilungsbegleiter | Erkennt emotionale Phasen und bietet phasenweise Unterstuetzung (Erzaehlphase -> Entlastungsphase -> Wiederaufbau); RAG-Suche in psychologischer Wissensbasis |
| 3 | Atemcoach gegen Angst | Bindet Biosensordaten ein (Herzrate/Atem); ueberwacht Angstniveau in Echtzeit; fuehrt per Stimme Atemrhythmus und progressive Muskelentspannung an |
| 4 | Mentor zum Wiederaufbau von Selbstvertrauen | Dialograhmen aus positiver Psychologie, dokumentiert kleine Erfolge und gibt Feedback; kognitive Umstrukturierung hilft gegen negative Selbstgespraeche |
| 5 | Intelligente Deutung des Emotionstagebuchs | NLP-Modell zur Emotionserkennung, Zeitreihenanalyse entdeckt Muster; visualisierte Emotionskarte und praediktive Emotionswarnungen |

---

## 3. Unterhaltung

> 💡 **Kernkonzept**：Immersive Erlebnisse schaffen, Unterhaltung als Zufluchtsort der Seele

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Immersiver Murder-Mystery-DM | LLM generiert Handlungszweige in Echtzeit, Sprachsynthese spielt NPCs; Schwierigkeit und Tempo passen sich Spielerreaktionen an; AR/VR-Szenenrendering |
| 2 | Seelenvoller NPC fuer Open-World-Spiele | Langzeitgedaechtnis-Datenbank speichert Spielerinteraktionen, LLM generiert persoenliche Dialoge; Affective Computing gibt NPCs echte emotionale Reaktionen |
| 3 | Personalisierte Podcast-Content-Generierung | Generiert eigene Inhalte anhand des Interessenprofils; TTS klont bevorzugte Stimmen; beantwortet Hoererfragen interaktiv in Echtzeit |
| 4 | Atmosphaeren-Team fuer virtuelle Konzerte | Virtuelle Avatare, Echtzeit-Chat-Interaktion, virtuelle Lightsticks/Fan-Requisiten; raeumliches Audio schafft Live-Gefuehl |
| 5 | Co-Creation-Partner fuer interaktive Romane | LLM generiert Handlung in Echtzeit, Nutzerentscheidungen beeinflussen den Verlauf; mehrere Enden und dynamische Figurenbeziehungen |

---

## 4. Persoenliches Wachstum

> 💡 **Kernkonzept**：Wachstum ist keine Askese, sondern eine spannende Reise der Selbstentdeckung

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Zeuge persoenlichen Wachstums | Visualisiert Wachstumspfade als Timeline, markiert Meilensteine automatisch; Vergleichsbilder zeigen "frueheres Ich" vs. "heutiges Ich" |
| 2 | Gamifizierter Coach fuer Gewohnheitsaufbau | Gamification-Mechaniken (XP, Level, Abzeichen), soziale Ranglisten, AI-Coach-Rollenspiel wie "Abenteuermentor" |
| 3 | Matching fuer Lernpartner | Matching-Algorithmus nach Interessen und Lernzielen, Lerngruppen-Community, gegenseitige Check-ins |
| 4 | Entdecker kleiner taeglicher Gluecksmomente | Bilderkennung entdeckt schoene Alltagsmomente, Gratitude-Journal-Fuehrung, woechentlicher Rueckblick auf schoene Momente |
| 5 | Lebenssimulations-Erlebnis | Mehrzweigige Story simuliert Folgen verschiedener Entscheidungen, Vergleich paralleler Leben; visualisierte Entscheidungsfolgen |

---

## 5. Soziale Interaktion

> 💡 **Kernkonzept**：Soziales natuerlich und entspannt gestalten, komfortable Verbindung finden

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Eisbrecher-Themengenerator | Intelligente Themenempfehlungen nach Anlass und Teilnehmenden, Echtzeit-Gespraechsanalyse fuer Anschlussfragen; Rettungshinweise fuer peinliche Momente |
| 2 | Social-Post-Atmosphaeren-Texter | Analysiert Bildinhalte, LLM generiert Texte in mehreren Stilen (literarisch/humorvoll/tiefgehend); intelligente Emoji- und Layout-Empfehlungen |
| 3 | Date-Atmosphaerenplaner | Generiert Date-Plaene nach Interessen beider Personen, empfiehlt Restaurants/Aktivitaeten und Gespraechsthemen; Wetter- und Verkehrshinweise in Echtzeit |
| 4 | Stimmungsmacher fuer Remote-Treffen | Online-Spielbibliothek, Eisbrecher-Aktivitaetsgenerator, Themenrad; virtuelle Hintergruende und Filter staerken die Atmosphaere |
| 5 | Assistent fuer soziale Energie | Bewertet Energieverbrauch nach sozialen Aktivitaeten, gibt Erholungsvorschlaege (Alleinzeit-Aktivitaeten); intelligente Planung des Sozialkalenders |

---

## 6. Kreativer Ausdruck

> 💡 **Kernkonzept**：Jeder hat Kreativitaet, sie muss nur geweckt werden

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Notfallkit gegen Inspirationsmangel | Cross-Domain-Assoziationsalgorithmus, zufaellige Stimuluswoerter, kreative Prompt-Bibliothek; Mindmap-Tool fuer Ideendivergenz |
| 2 | Guide zur Entdeckung des persoenlichen Stils | Bildanalyse erkennt vorhandenen Stil, empfiehlt Stiltrends, virtuelle Anprobe/Make-up; Timeline der Stilentwicklung |
| 3 | Aesthetikberater fuer Bullet Journals und Tagebuecher | Layout-Vorlagen, Farbpaletten, Deko-Elemente; Handschrifterkennung und Content-Verschoenerung |
| 4 | Fotografie-Kompositions- und Atmosphaeren-Guide | Szenenerkennung und Kompositionsvorschlaege, Filterstil-Empfehlungen, intelligente Anpassung von Bearbeitungsparametern; Lernpfad fuer Fototechnik |
| 5 | Musik-Stimmungs-Matcher | Algorithmus fuer musikalische Emotionsanalyse, Stimmungserkennung, persoenliche Playlists; Musikgeschichten und Hintergrundinfos |

---

## 7. Reiseerkundung

> 💡 **Kernkonzept**：Reisen ist nicht nur Landschaften sehen, sondern verschiedene Lebensweisen erfahren

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | City-Walk-Erkundungsfuehrer | Aggregiert Inhalte lokaler Kenner, empfiehlt Nischenorte, AR-Navigation; Echtzeit-Uebersetzung und Spracherklaerungen |
| 2 | Reise-Stimmungs-Tagebuchgenerator | Automatische Fotoklassifikation und Auswahl, LLM generiert schoene Reiseberichte, Geotag-Timeline; Reisevideo mit einem Klick |
| 3 | Begleitassistent fuer Solo-Reisen | Echtzeit-Positionsfreigabe und Sicherheitshinweise, lokale Notfallkontakte, AI-Reisefuehrer per Stimme; Community fuer Alleinreisende |
| 4 | Atmosphaerenvorschau des Reiseziels | VR/360-Grad-Panorama, Simulation lokaler Geraeusche und Gerueche, kulturelle Hintergruende; virtuelle "Probewohnen"-Erfahrung |
| 5 | Atmosphaerenberatung fuer Reisefotografie | Golden-Hour-Erinnerungen, Kompositionshilfslinien, Empfehlungen lokaler Fotospots; Tipps fuer Farbgrading nach der Aufnahme |

---

## 8. Koerperliche und geistige Gesundheit

> 💡 **Kernkonzept**：Gesundheit ist kein Ziel, sondern sanfte Selbstfuersorge

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Aktivierer fuer Bewegungsmotivation | Empfiehlt passende Sportarten nach Nutzerzustand, Mikro-Workouts (5 Minuten), gamifizierte Sport-Challenges; soziale Sport-Check-ins |
| 2 | Inspirationskueche fuer gesunde Ernaehrung | Erkennt Zutaten im Kuehlschrank, empfiehlt persoenliche Rezepte, analysiert Naehrstoffkombinationen; Step-by-step-Kochanleitung |
| 3 | Atmosphaeren-Optimierer fuer Schlafqualitaet | Analysiert Schlaftracking-Daten, generiert Einschlafrituale, empfiehlt Umweltoptimierung (Temperatur/Luftfeuchte/Licht); intelligentes Wecken |
| 4 | Guide fuer Koerperwahrnehmung | Fuehrt Body-Scan-Meditation an, verbindet Koerperbereiche mit Emotionen, Uebungen fuer Koerper-Geist-Verbindung; Biofeedback-Visualisierung |
| 5 | Erinnerung an Selbstfuersorge | Ueberwacht Arbeitsintensitaet, erinnert regelmaessig an Pausen, empfiehlt Mikro-Selbstfuersorge (Wasser/Stretching/Tiefatmen); Selbstfuersorge-Protokoll |

---

## 9. Wissensentdeckung

> 💡 **Kernkonzept**：Lernen ist ein endloses Abenteuer, Neugier ist der beste Lehrer

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Gamifizierter Guide zur Wissensentdeckung | Visualisiert Wissenspunkte als Karte, Lernpfad mit Leveln, Erfolgsabzeichen; AI-Mentor-Rollenspiel |
| 2 | Szenario-Partner fuer Sprachenlernen | LLM spielt verschiedene Rollen fuer Dialoge, korrigiert Aussprache, erklaert kulturelle Hintergruende; immersive Szenariosimulation |
| 3 | Assistent zur Befriedigung von Neugier | Bindet Wikipedia/Wissensgraphen ein, erklaert komplexe Konzepte verstaendlich, empfiehlt verwandtes Wissen; Neugier-Protokoll |
| 4 | Inspirationsgeber fuer Lesenotizen | Analysiert Buchinhalte, extrahiert und verknuepft Standpunkte, empfiehlt Denkperspektiven; Vorlagen und Verschoenerung fuer Lesenotizen |
| 5 | Atmosphaeren-Gestalter fuer Wissensaustausch | Erstellt automatisch Wissenskarten, optimiert Share-Texte, verbessert Visuals; Datenfeedback fuer Social Sharing |

---

## 10. Beziehungspflege

> 💡 **Kernkonzept**：Gute Beziehungen brauchen Pflege - aber das muss nicht kompliziert sein

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Kommunikationscoach fuer intime Beziehungen | Generiert Vorlagen fuer Gefuehlsausdruck, leitet gewaltfreie Kommunikation an, bietet Formulierungen zur Konfliktloesung; bewertet Beziehungsgesundheit |
| 2 | Erinnerungsassistent fuer Familienfuersorge | Erinnerungen an wichtige Daten (Geburtstage/Jahrestage), Vorschlaege fuer Fuersorgeformulierungen, Familienaktivitaeten; erstellt Familienalben |
| 3 | Atmosphaeren-Gestalter fuer Freundschaftspflege | Protokolliert Freundesinteraktionen, empfiehlt gemeinsame Themen, organisiert Remote-Treffen; Freundschafts-Timeline und Erinnerungsgenerierung |
| 4 | Planer fuer Gestandnisse und Ueberraschungen | Generiert persoenliche Ueberraschungsplaene, empfiehlt Geschenke und romantische Formulierungen; Zeitplan und Erinnerungen fuer die Umsetzung |
| 5 | Guide zur Konfliktentschaerfung | Formulierungen zur emotionalen Abkuehlung, Perspektivwechsel-Anleitung, Schritte zur Versoehnung; Tracking der Beziehungsreparatur |

---

## 11. Haustier-Begleitung

> 💡 **Kernkonzept**：Haustiere sind Familie, ihre Begleitung verdient es, festgehalten zu werden

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Anthropomorphes Haustier-Tagebuch | Analysiert Haustierverhalten, generiert Tagebucheintraege in Ich-Perspektive, ordnet Fotos automatisch zu; Haustier-"Freundeskreis" |
| 2 | Deuter fuer Haustierverhalten | Analysiert Videos von Haustierverhalten, Gesundheitswarnungen, Trainingstipps; Wissensbasis zu Rassemerkmalen |
| 3 | Planer fuer gemeinsame Haustierzeit | Aktivitaetsempfehlungen fuer Haustiere, DIY-Spielzeuganleitungen, haustierfreundliche Orte; Haustier-Social-Matching |
| 4 | Generator fuer Haustier-Erinnerungsgeschichten | Waehlt Fotos und Videos aus, generiert Timeline-Geschichten, kombiniert passende Musik; automatische Erstellung von Erinnerungsalbum/-video |
| 5 | Beruhigender Guide fuer neue Haustierhalter | Phasenweiser Pflegeguide, FAQ, Umgang mit Notfaellen; Community-Support fuer Einsteiger |

---

## 12. Finanzielle Gesundheit

> 💡 **Kernkonzept**：Finanzielle Freiheit ist nicht das Ziel - finanzielle Gesundheit schon

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Assistent fuer Konsum-Emotionsbewusstsein | Analysiert Konsumaufzeichnungen und Emotion-Konsum-Zusammenhaenge, warnt vor Impulskaeufen; empfiehlt alternative Formen der Befriedigung |
| 2 | Visuelle Motivation fuer Sparziele | Visualisiert Ziel-Fortschritt, rendert Traumszenen, feiert Meilensteine; Spiel zum Aufbau von Spargewohnheiten |
| 3 | Finanzwissen leicht gelernt | Liefert Wissen in kleinen Einheiten, szenariobasierte Fallbeispiele, interaktive Q&A; Wissenstests und Zertifikate |
| 4 | Beruhiger fuer Finanzangst | Bewertet finanzielle Gesundheit, Stressmanagement-Techniken, kleine Handlungsplaene; finanzpsychologische Beratung |
| 5 | Spiel fuer Kleininvestment-Erfahrung | Virtuelle Investmentsimulation, Risikoaufklaerung, Portfolio-Spiel; Anleitung zu echten Kleininvestitionen |

---

## 13. Karriereentwicklung

> 💡 **Kernkonzept**：Karriere ist kein Schienenstrang, sondern eine Wildnis zum Erkunden

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Begleiter bei beruflicher Orientierungslosigkeit | Berufliches Interessensassessment, Kompetenzinventar, Brancheninformationen; Dialog mit Karrierementor |
| 2 | Aktivierer fuer berufliches Erfolgserleben | Dokumentiert Arbeitsergebnisse, extrahiert Wert, visualisiert Erfolge; sammelt positives Feedback von Kollegen/Kunden |
| 3 | Assistent fuer Workplace-Social-Atmosphaere | Empfiehlt berufliche Gespraechsthemen, Networking-Techniken, Branchenveranstaltungen; optimiert LinkedIn-Inhalte |
| 4 | Inspirationsgeber fuer Nebenprojekte | Matching von Faehigkeiten, Interessen und Marktnachfrage, Nebenprojekt-Fallbibliothek, Startguide; Side-Project-Community |
| 5 | Confidence-Booster vor Vorstellungsgespraechen | Simulierte Interviews, Vorbereitung haeufiger Fragen, Techniken zur Staerkung von Selbstvertrauen; Image-Tipps |

---

## 14. Wohnraum

> 💡 **Kernkonzept**：Zuhause ist nicht nur ein Wohnort, sondern ein Zufluchtsort der Seele

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Atmosphaeren-Designer fuer Wohnraeume | Analysiert Raumfotos, empfiehlt Stile, Moebel und Dekoration; AR-Vorschau des Effekts |
| 2 | Guide fuer saisonale Wohnraumveraenderung | Empfiehlt saisonale Themen, Aufbewahrungs- und Praesentationsideen, Festtagsdeko; erstellt Einkaufsliste |
| 3 | Magie fuer kleine Wohnungen | Raumoptimierungsalgorithmus, Empfehlungen fuer Multifunktionsmoebel, Aufbewahrungstipps; visuelle Raumvergroesserung |
| 4 | Gestalter von Wohnritualen | Designt Alltagsrituale (Morgen/Abend/Wochenende), erinnert an Ausfuehrung; Feedback zur Ritualwirkung |
| 5 | Psychologische Begleitung beim Ausmisten | Bewertet emotionalen Wert von Gegenstaenden, fuehrt durch Ausmist-Schritte, psychologische Unterstuetzung; Spenden-/Recyclingkanaele |

---

## 15. Kulinarik

> 💡 **Kernkonzept**：Essen ist die Sprache der Liebe, Kochen ist eine Art der Liebeserforschung

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Heilende Solo-Mahlzeiten | Erkennt Kuehlschrankzutaten, empfiehlt einfache Rezepte, Step-by-step-Anleitung; Aesthetik fuer Solo-Plating |
| 2 | Atmosphaerendesign fuer Festtafeln | Festtagsmenues, Tischdeko-Plaene, Atmosphaeren-Tipps; Optimierung der Gaesteerfahrung |
| 3 | Koch-Stimmungs-Matcher | Algorithmus fuer Stimmung-Essen-Zusammenhaenge, Rezepte zur Emotionsregulation, Comfort-Food-Empfehlungen; Kochtherapie-Anleitung |
| 4 | Vertrauensaufbau fuer Kochanfaenger | Supereinfache Rezepte, Rettungstipps bei Fehlern, Formulierungen fuer Selbstvertrauen; schrittweise Steigerung der Schwierigkeit |
| 5 | Atmosphaeren-Guide fuer Food-Fotografie | Plating-Tipps, Nutzung von Naturlicht, Aufnahmewinkel; Filter- und Nachbearbeitungstipps |

---

## 16. Mode und Stil

> 💡 **Kernkonzept**：Mode ist Selbstdarstellung, Stil ist der sichtbare Ausdruck des Inneren

| Nr. | Szenario-Name | Szenario-Funktion |
| :--: | ------------ | ------------ |
| 1 | Outfit-Moodboard des Tages | Kombinierte Empfehlungen nach Wetter/Anlass/Stimmung, virtuelle Anprobe, Styling-Inspiration; Kleiderschrankverwaltung |
| 2 | Capsule-Wardrobe-Stylist | Kleiderschrank-Inventar, Kombinationssets fuer Einzelteile, One-piece-multiple-looks; Einkaufstipps zum Schliessen von Luecken |
| 3 | Reise zur Entdeckung des persoenlichen Stils | Stiltest, Referenz-Icon-Empfehlungen, Pfad der Stilentwicklung; Aufbau von Selbstvertrauen |
| 4 | Kreativer fuer neue Looks aus alter Kleidung | Upcycling-Inspiration, neue Kombinationsweisen, Akzentuierung mit Accessoires; nachhaltige Modephilosophie |
| 5 | Stylingberater fuer besondere Anlaesse | Deutet Dresscodes, generiert Stylingplaene, Make-up- und Frisurvorschlaege; stimmige Gesamtkoordination |

---

## Kernprinzipien fuer C-End-Produktdesign

### 1. Von "Funktion" zu "Gefuehl"

B-End-Produkte fragen: "Welches Problem loest diese Funktion?" C-End-Produkte fragen: "Welches Gefuehl erzeugt diese Funktion?"

| B-End-Denken | C-End-Denken |
|---------|---------|
| Effizienz steigern | Zeit fuer die Dinge sparen, die man liebt |
| Kosten senken | Jeden Cent wertvoll ausgeben |
| Schmerzpunkte loesen | Schoene Erlebnisse schaffen |
| Vollstaendige Funktionalitaet | Stimmung passt |

### 2. Drei Ebenen der Atmosphaere-Gestaltung

**Sinnesebene**: Gestaltung von Sehen, Hoeren und Fuehlen
- Waerme Farben
- Beruhigende Geraeusche
- Fliessende Animationen

**Emotionale Ebene**: Resonanz und Fuehrung von Emotionen
- Die Stimmung des Nutzers verstehen
- Emotionale Unterstuetzung bieten
- Positive Emotionen erzeugen

**Bedeutungsebene**: Anerkennung von Wert und Zugehoerigkeit
- Nutzer fuehlen sich verstanden
- Zugehoerigkeitsgefuehl schaffen
- Handlungen Sinn verleihen

### 3. Die Kraft psychologischer Suggestion

C-End-Produkte vermitteln durch Text und Design psychologische Suggestionen:

- **Positive Suggestion**: "Du machst das schon gut", "Geh langsam vor, das ist in Ordnung"
- **Zugehoerigkeits-Suggestion**: "Viele Menschen fuehlen wie du", "Du bist nicht allein"
- **Wachstums-Suggestion**: "Jeder Versuch ist Fortschritt", "Du wirst besser"

### 4. Nutzer zu einer besseren Version ihrer selbst machen

Die besten C-End-Produkte aendern Nutzer nicht, sondern helfen ihnen, die Person zu werden, die sie sein moechten.

- Nicht "du solltest...", sondern "du kannst..."
- Nicht "du musst...", sondern "wenn du moechtest..."
- Nicht "du bist noch nicht genug...", sondern "du hast bereits..."

---

> 🌟 **Merke**: C-End-Nutzer kaufen keine Funktionen, sondern Gefuehle; keine Werkzeuge, sondern Begleitung; keine Services, sondern Verstaendnis.

</TabItem>
</Tabs>
