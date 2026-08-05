# Frontend-Projektarchitektur: Grundlagen

::: tip 🎯 Kernfrage
**Von einfachen HTML-Seiten bis hin zu komplexen Enterprise-Anwendungen: Wie waehlt man die richtige Architektur fuer unterschiedliche Projektgroessen?** Das ist wie die Frage: Vom Single-Apartment bis zum grossen Einkaufszentrum — wie entwirft man unterschiedliche Raumlayouts nach Bedarf? Eine gute Architektur sollte mit dem Projekt wachsen und nicht von Anfang an ueberdimensioniert sein.
:::

---

## 1. Architekturevolution: Vom Einfachen zum Komplexen

### 1.1 Ueberblick ueber drei Komplexitaetsstufen

Die Architektur eines Frontend-Projekts sollte zur Projektkomplexitaet passen. Wir unterteilen Projekte anhand der beiden Dimensionen **technische Komplexitaet** und **Nutzerzahl** in drei Stufen:

| Stufe | Tech-Stack | Nutzerzahl | Typische Szenarien | Kernanliegen |
|-------|-----------|------------|---------------------|--------------|
| **Einsteiger** | HTML/CSS/JS | Einzelperson/Kleinteam | Persoenlicher Blog, Landingpage, einfache Tools | Schneller Launch, einfache Wartung |
| **Fortgeschritten** | Vue/React + Build-Tools | KMU | Verwaltungssysteme, E-Commerce-Frontend, SaaS | Komponentenwiederverwendung, Zustandsverwaltung |
| **Enterprise** | Framework + Micro-Frontend/SSR | Grosse Anwendungen | Grosse Plattformen, komplexe Business-Systeme | Performance-Optimierung, Teamzusammenarbeit, Skalierbarkeit |

::: tip 💡 Wie waehlen?
**Nicht ueberdimensionieren!** Viele Projekte starten mit einfachem HTML und fuegen nach und nach Frameworks und Tools hinzu, wenn die Anforderungen wachsen.

- Persoenliches Projekt → Einsteigerstufe
- Startup-MVP → Einsteiger- oder Fortgeschrittenenstufe
- Unternehmensverwaltungssystem → Fortgeschrittenenstufe
- Grosse Internetplattform → Enterprise-Stufe
:::

---

## 2. Einsteigerstufe: HTML/CSS/JS-Projekte

### 2.1 Anwendungsszenarien

- Persoenlicher Blog, Lebenslauf-Seite
- Produkt-Landingpage
- Einfache Tool-Seiten (Rechner, Konverter usw.)
- Prototyp-Validierung, schnelle Demos

### 2.2 Empfohlene Verzeichnisstruktur

```
my-simple-project/
├── index.html              # Startseite
├── about.html              # Ueber-Seite (falls vorhanden)
├── css/
│   ├── reset.css           # CSS-Reset
│   ├── variables.css       # CSS-Variablen (Farben, Schriften usw.)
│   ├── components.css      # Komponenten-Styles (Buttons, Karten usw.)
│   └── main.css            # Haupt-Stylesheet
├── js/
│   ├── utils.js            # Hilfsfunktionen
│   ├── api.js              # Einfache API-Aufrufe
│   └── main.js             # Hauptlogik
├── assets/
│   ├── images/             # Bildressourcen
│   └── fonts/              # Schriftdateien
└── README.md               # Projektbeschreibung
```

### 2.3 Code-Organisationsprinzipien

**HTML**: Semantische Tags, klare Struktur

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mein persoenlicher Blog</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <header class="site-header">
    <nav class="main-nav">
      <a href="index.html">Startseite</a>
      <a href="about.html">Ueber</a>
    </nav>
  </header>

  <main class="content">
    <article class="blog-post">
      <h1>Artikeltitel</h1>
      <p>Artikelinhalt...</p>
    </article>
  </main>

  <footer class="site-footer">
    <p>&copy; 2024 Mein Blog</p>
  </footer>

  <script src="js/utils.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

**CSS**: CSS-Variablen zur Themenverwaltung

```css
/* variables.css */
:root {
  --primary-color: #3498db;
  --text-color: #333;
  --bg-color: #fff;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --font-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* components.css - Wiederverwendbare Komponenten-Styles */
.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: 4px;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
}

.card {
  padding: var(--spacing-md);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

**JavaScript**: Modulare Organisation (mit ES6-Modulen oder einfacher Aufteilung)

```javascript
// utils.js
const utils = {
  // DOM-Manipulation vereinfacht
  $(selector) {
    return document.querySelector(selector);
  },

  // Einfaches Debounce
  debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  // LocalStorage-Wrapper
  storage: {
    get(key) {
      return JSON.parse(localStorage.getItem(key) || 'null');
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};

// main.js
document.addEventListener('DOMContentLoaded', () => {
  // Seiteninitialisierungslogik
  initNavigation();
  loadBlogPosts();
});
```

### 2.4 Best Practices

✅ **Empfohlen**:
- Semantische HTML-Tags verwenden
- CSS-Variablen fuer Farben und Abstaende nutzen
- Bilder komprimieren und Lazy Loading einsetzen
- Grundlegende SEO-Meta-Tags hinzufuegen

❌ **Vermeiden**:
- Inline-Styles (`style="..."`)
- Globale Variablenverschmutzung
- Duplizierter Code (Copy & Paste)

---

## 3. Fortgeschrittenenstufe: Vue/React-Framework-Projekte

### 3.1 Anwendungsszenarien

- Unternehmensverwaltungssysteme (ERP, CRM, OA)
- E-Commerce-Frontend/Backend
- SaaS-Anwendungen
- Web-Anwendungen mit komplexen Interaktionen

### 3.2 Empfohlene Vue-Projektstruktur

```
my-vue-project/
├── public/                     # Statische Ressourcen
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/                 # Styles, Bilder, Schriften
│   │   ├── styles/
│   │   │   ├── variables.scss
│   │   │   ├── mixins.scss
│   │   │   └── global.scss
│   │   └── images/
│   ├── components/             # Gemeinsame Komponenten
│   │   ├── common/             # Global gemeinsam (Button, Modal usw.)
│   │   │   ├── Button/
│   │   │   │   ├── index.vue
│   │   │   │   └── Button.scss
│   │   │   └── Modal/
│   │   └── business/           # Geschaeftskomponenten (UserCard usw.)
│   ├── views/                  # Seitenkomponenten
│   │   ├── Home/
│   │   ├── User/
│   │   │   ├── List.vue
│   │   │   └── Detail.vue
│   │   └── Product/
│   ├── router/                 # Router-Konfiguration
│   │   └── index.js
│   ├── stores/                 # Pinia/Vuex-Zustandsverwaltung
│   │   ├── user.js
│   │   └── app.js
│   ├── services/               # API-Services
│   │   ├── request.js          # axios-Wrapper
│   │   ├── user.js
│   │   └── product.js
│   ├── utils/                  # Hilfsfunktionen
│   │   ├── format.js
│   │   ├── validate.js
│   │   └── storage.js
│   ├── composables/            # Composable-Funktionen
│   │   ├── useAuth.js
│   │   └── useLoading.js
│   ├── constants/              # Konstantendefinitionen
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── tests/                      # Testdateien
├── .env                        # Umgebungsvariablen
├── vite.config.js
├── package.json
└── README.md
```

### 3.3 Empfohlene React-Projektstruktur

```
my-react-project/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/             # Gemeinsame Komponenten
│   │   │   ├── Button/
│   │   │   │   ├── index.jsx
│   │   │   │   └── Button.module.css
│   │   │   └── Modal/
│   │   └── business/           # Geschaeftskomponenten
│   ├── pages/                  # Seitenkomponenten
│   │   ├── Home/
│   │   ├── User/
│   │   └── Product/
│   ├── hooks/                  # Custom Hooks
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── services/               # API-Services
│   │   ├── api.js
│   │   └── userService.js
│   ├── store/                  # Redux/Zustand-Zustandsverwaltung
│   │   ├── slices/
│   │   └── index.js
│   ├── utils/
│   ├── constants/
│   ├── App.jsx
│   └── main.jsx
├── tests/
└── package.json
```

### 3.4 Erklaerung wichtiger Konzepte

#### Komponenten-Designprinzipien

**Single Responsibility**: Eine Komponente macht nur eine Sache

```vue
<!-- ❌ Schlechtes Beispiel: Komponente macht zu viel -->
<template>
  <div>
    <form @submit="handleSubmit">
      <!-- Formularinhalt -->
    </form>
    <table>
      <!-- Datentabelle -->
    </table>
    <div class="charts">
      <!-- Statistik-Diagramme -->
    </div>
  </div>
</template>

<!-- ✅ Gutes Beispiel: In unabhaengige Komponenten aufteilen -->
<template>
  <div>
    <UserForm @submit="fetchData" />
    <UserTable :data="users" />
    <UserStats :data="users" />
  </div>
</template>
```

#### Zustandsverwaltungsstrategie

| Zustandstyp | Speicherort | Beispiel |
|------------|-------------|----------|
| **Globaler Zustand** | Pinia/Redux | Benutzerinformationen, Login-Status, Theme-Einstellungen |
| **Seitenzustand** | Seitenkomponente | Listenabfragebedingungen, Paginierung |
| **Komponentenzustand** | Komponentenintern | Formulareingaben, Modal anzeigen/verstecken |
| **Serverzustand** | TanStack Query/SWR | Serverdaten, Cache |

#### Wahl der Verzeichnisorganisation

**Methode 1: Nach Typ organisieren (fuer kleine Projekte)**

```
src/
├── components/     # Alle Komponenten
├── views/          # Alle Seiten
├── stores/         # Alle Zustaende
└── services/       # Alle Services
```

**Methode 2: Nach Feature organisieren (fuer mittelgrosse bis grosse Projekte)**

```
src/
├── features/
│   ├── auth/       # Der gesamte Code der Auth-Funktion
│   ├── user/       # Der gesamte Code der User-Funktion
│   └── product/    # Der gesamte Code der Produkt-Funktion
├── shared/         # Gemeinsame Ressourcen
└── App.vue
```

::: tip 💡 Wie waehlen?
- Projektseiten < 10 → Nach Typ organisieren
- Projektseiten > 20 → Nach Feature organisieren
- Team > 5 Personen → Nach Feature organisieren, erleichtert parallele Entwicklung
:::

---

## 4. Enterprise-Stufe: Grosse Anwendungsarchitektur

### 4.1 Anwendungsszenarien

- Grosse Internetplattformen (E-Commerce, Social, Content-Plattformen)
- Komplexe Enterprise-Anwendungen
- Projekte mit Multi-Team-Zusammenarbeit
- Projekte mit extrem hohen Anforderungen an Performance und Wartbarkeit

### 4.2 Micro-Frontend-Architektur

Wenn ein Projekt eine gewisse Groesse erreicht und ein einzelnes Codebasis schwer zu warten ist, kann eine **Micro-Frontend**-Architektur in Betracht gezogen werden.

```
Grosse E-Commerce-Plattform/
├── Basis-App (Hauptrahmen)
│   ├── Obere Navigation
│   ├── Seitenmenue
│   ├── User-Center-Einstieg
│   └── Sub-App-Container
├── Produkt-Sub-App (Unabhaengig deployed)
│   ├── Produktliste
│   ├── Produktdetail
│   └── Produktverwaltung
├── Bestell-Sub-App (Unabhaengig deployed)
│   ├── Warenkorb
│   ├── Bestellliste
│   └── Zahlungsprozess
├── Benutzer-Sub-App (Unabhaengig deployed)
│   ├── Persoenlicher Bereich
│   ├── Lieferadressen
│   └── Gutscheine
└── Marketing-Sub-App (Unabhaengig deployed)
    ├── Aktionsseiten
    ├── Gutscheinverteilung
    └── Punkte-Shop
```

**Vorteile von Micro-Frontends**:
- Team-Autonomie: Jede Sub-App wird unabhaengig entwickelt und deployed
- Technologieunabhaengigkeit: Verschiedene Teams koennen verschiedene Frameworks nutzen
- Inkrementelles Upgrade: Altsysteme koennen schrittweise refaktoriert werden

### 4.3 Enterprise-Verzeichnisstruktur

```
enterprise-project/
├── apps/                       # Micro-Frontend-Sub-Apps
│   ├── main/                   # Basis-App
│   ├── product/
│   ├── order/
│   └── user/
├── packages/                   # Gemeinsame Pakete (Monorepo)
│   ├── ui-components/          # Gemeinsame Komponentenbibliothek
│   ├── utils/                  # Hilfsfunktionen
│   ├── constants/              # Konstantendefinitionen
│   └── types/                  # TypeScript-Typen
├── shared/                     # Gemeinsame Konfigurationen
│   ├── eslint-config/
│   ├── ts-config/
│   └── vite-config/
├── docs/                       # Projektdokumentation
├── scripts/                    # Build-Skripte
└── package.json
```

### 4.4 Performance-Optimierungsarchitektur

Grosse Anwendungen muessen auf Performance-Optimierung achten:

```
Performance-Optimierungsstrategie/
├── Build-Time-Optimierung
│   ├── Code-Splitting
│   ├── Lazy Loading fuer Routen
│   ├── Tree Shaking
│   └── Ressourcenkomprimierung
├── Runtime-Optimierung
│   ├── Virtual Scrolling (lange Listen)
│   ├── Lazy Loading fuer Bilder
│   ├── Bedarfsgerechtes Komponenten-Rendering
│   └── Cache-Strategie
└── Netzwerkoptimierung
    ├── CDN-Beschleunigung
    ├── HTTP-Caching
    ├── Ressourcen-Preloading
    └── Service Worker
```

### 4.5 SSR/SSG-Architektur

Fuer Szenarien, die SEO oder First-Paint-Performance erfordern:

| Loesung | Anwendungsszenario | Repraesentative Frameworks |
|---------|-------------------|---------------------------|
| **SSR** | SEO erforderlich, schnelles erstes Rendern | Next.js, Nuxt.js |
| **SSG** | Statischer Inhalt, seltene Aktualisierungen | Astro, VitePress |
| **Hybrid** | Teilweise statisch, teilweise dynamisch | Next.js (ISR) |

---

## 5. Architekturwahl nach Nutzerzahl

### 5.1 Einzelperson/Kleinteam (Tagesaktive Nutzer < 1.000)

**Merkmale**: Schnelle Iteration, begrenzte Ressourcen, schnelle Anforderungsaenderungen

**Empfohlene Architektur**:
- Tech-Stack: Vue 3 + Vite oder React + Vite
- Zustandsverwaltung: Pinia oder Zustand (leichtgewichtig)
- UI-Bibliothek: Element Plus / Ant Design
- Deployment: Vercel / Netlify / Cloud-Server

**Verzeichnisstruktur**: Einfach nach Typ organisiert

### 5.2 Mittleres Unternehmen (Tagesaktive Nutzer 1k-100k)

**Merkmale**: Komplexe Geschaeftsprozesse, Teamzusammenarbeit, Stabilitaet erforderlich

**Empfohlene Architektur**:
- Tech-Stack: Vue 3 + TypeScript oder React + TypeScript
- Zustandsverwaltung: Pinia + Composable-Funktionen oder Redux Toolkit
- UI-Bibliothek: Eigene Komponentenbibliothek + Geschaeftskomponentenbibliothek
- Tests: Unit-Tests + E2E-Tests
- Deployment: CI/CD-Pipeline + Docker

**Verzeichnisstruktur**: Nach Feature organisiert, Standards etablieren

### 5.3 Grosse Plattform (Tagesaktive Nutzer > 100k)

**Merkmale**: Hohe Parallelitaet, Multi-Team-Zusammenarbeit, langfristige Wartung

**Empfohlene Architektur**:
- Tech-Stack: React/Vue + TypeScript (Strict Mode)
- Architektur: Micro-Frontend + Monorepo
- Zustandsverwaltung: Feingranulare Zustandsverwaltung + Server-State-Caching
- Performance: SSR/SSG + CDN + Edge Computing
- Monitoring: Frontend-Monitoring + Fehlerverfolgung + Performance-Analyse

**Verzeichnisstruktur**: Monorepo + Micro-Frontend

---

## 6. Architektur-Evolutions-Roadmap

### 6.1 Evolutionsbeispiel: Vom Blog zur Plattform

```
Phase 1: Persoenlicher Blog (HTML/CSS/JS)
    ↓ Anforderung: Admin-Backend noetig
Phase 2: Admin-Backend hinzugefuegt (Vue/React + einfache Struktur)
    ↓ Anforderung: Benutzersystem, Kommentarfunktion
Phase 3: Funktionsmodularisierung (nach Feature organisiert)
    ↓ Anforderung: Multi-Team-Zusammenarbeit, unabhaengiges Deployment
Phase 4: Micro-Frontend-Architektur (Monorepo)
```

### 6.2 Wann sollte die Architektur aktualisiert werden

| Signal | Beschreibung | Empfehlung |
|--------|-------------|------------|
| Build-Zeit > 5 Minuten | Projekt zu gross | Code-Splitting, Micro-Frontend |
| Haeufige Konflikte bei mehreren Personen | Zusammenarbeit schwierig | Nach Feature organisieren, Module aufteilen |
| Eine Aenderung bricht mehrere Stellen | Starke Kopplung | Refactoring, Tests verstaerken |
| First-Paint > 3 Sekunden | Performance-Problem | Lazy Loading, SSR, Optimierung |
| Neue Mitglieder brauchen lange zum Einarbeiten | Struktur unuebersichtlich | Dokumentation, Standards, Refactoring |

---

## 7. Zusammenfassung

::: tip 💡 Kerngedanke
**Es gibt keine Silberkugel fuer Architektur — was passt, ist das Beste.**

- **Kleine Projekte** nicht ueberdimensionieren — HTML/CSS/JS reicht aus
- **Mittlere Projekte** Standards etablieren — Komponentenisierung, Modularisierung
- **Grosse Projekte** Micro-Frontend, Performance-Optimierung und Teamzusammenarbeit beruecksichtigen

**Merken Sie sich diese Punkte**:
1. **Iterative Evolution**: Einfach beginnen, mit den Anforderungen wachsen
2. **Einheitliche Konventionen**: Naming, Struktur, Code-Stil konsistent halten
3. **Dokumentation zuerst**: Architekturentscheidungen dokumentieren fuer Wissenstransfer
4. **Regelmaessiges Refactoring**: Technische Schulden rechtzeitig abbauen

**Endziel**: Den Code wie einen gut organisierten Raum gestalten — gross oder klein, immer effizient funktionierend.
:::

---

## Referenzressourcen

- [Vue Style Guide](https://vuejs.org/style-guide/)
- [React Projektstruktur-Empfehlungen](https://react.dev/learn/thinking-in-react)
- [Bulletproof React - Architektur-Leitfaden](https://github.com/alan2207/bulletproof-react)
- [Feature Sliced Design](https://feature-sliced.design/)
- [Micro-Frontend-Architektur](https://micro-frontends.org/)
