# Routing und Navigation: Seitensteuerung
::: tip 🎯 Kernfrage
**Warum flackern manche Websites beim Seitenwechsel nicht weiß auf, sondern fühlen sich so flüssig an wie eine App?** Das ist die Magie des Frontend-Routings. Dieses Kapitel führt dich von der traditionellen „Umblätter-Navigation" klassischer Websites in die Welt der „Folienwechsel" von Single-Page-Applications und zeigt, wie Frontend-Routing das Nutzererlebnis auf ein neues Level hebt.
:::

---

## 1. Warum „Frontend-Routing"

### 1.1 Von traditionellen Websites zu Single-Page-Applications: Der qualitative Sprung im Nutzererlebnis

Erinnere dich an das frühe Web-Erlebnis: Jeder Klick auf einen Link war ein vollständiger Seitenwechsel – die Seite wurde weiß, ein Ladebalken drehte sich, die gesamte Seite wurde neu gerendert. Bei langsamer Internetverbindung starrte man sekundenlang auf den Ladebildschirm. Diese Erfahrung wirkt heute veraltet, doch damals war das der Standard.

Die moderne Frontend-Entwicklung hat dieses Modell grundlegend verändert. Mit Frontend-Routing-Techniken wechseln Seiten so flüssig wie in einer mobilen App – kein weißes Flackern, kein Ladebalken, der Nutzer spürt den „Sprung" kaum. Diese Verbesserung ist keine Zauberei, sondern das Verdienst des Frontend-Routing-Systems.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📖 Traditionelle Website (MPA)**
- Klick auf Link → Vollständiger Seiten-Reload
- Jede Seite ist eine eigenständige HTML-Datei
- Der Browser lädt alle Ressourcen jedes Mal neu
- Erlebnis wie „Umblättern", mit spürbarem Seitenwechsel

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📱 Single-Page-Application (SPA)**
- Klick auf Link → Wechsel ohne Reload
- Nur eine einzige HTML-Einstiegsdatei
- Es werden nur die benötigten Daten nachgeladen
- Erlebnis wie eine „Diashow", fließend und natürlich

</div>
</div>

**Das ist das Kernproblem, das „Frontend-Routing" löst: die Anzeige wechseln und die URL synchron aktualisieren – ohne die Seite neu zu laden.**

<RouteMatchingDemo />

### 1.2 Eine wahre Stolperstein-Geschichte: Motivation von du Routing-Modi verstehen musst

Du könntest sagen: „Ich benutze einfach Vue Router oder React Router, konfiguriere es und es funktioniert – warum muss ich die zugrundeliegenden Prinzipien verstehen?" Lass mich eine wahre Geschichte erzählen, und du wirst verstehen, warum dieses Wissen so wichtig ist.

::: warning Xiaos Deployment-Stolperfalle
Xiao Li ist ein Frontend-Neuling, der gerade erst angefangen hat und eine Vue-basierte Single-Page-Application entwickeln sollte. Lokal lief alles einwandfrei, das Routing funktionierte butterweich. Doch nachdem er das Projekt auf den Testserver deployed hatte, tauchte ein Problem auf: Wenn Nutzer direkt eine Route aufriefen (z. B. `example.com/user/123`) oder auf einer Detailseite die Seite aktualisierten, erhielten sie einen **404 Not Found**-Fehler.

Xiao Li war ratlos: Warum funktionierte es lokal, aber nach dem Deployment gab es 404? Er suchte lange nach der Ursache und vermutete sogar ein Server-Konfigurationsproblem.

Schließlich fragte er einen erfahreneren Kollegen, der das Problem sofort erkannte: Xiao Li verwendete den History-Modus, aber der Server hatte keinen Fallback konfiguriert. Wenn ein Nutzer direkt `/user/123` aufruft, sucht der Server nach einer Datei unter diesem Pfad – aber alle Routen der SPA verweisen tatsächlich auf dieselbe `index.html`. Die Lösung ist einfach: Den Server so konfigurieren, dass alle Routen auf `index.html` zurückfallen, damit das Frontend-Routing die weitere Verarbeitung übernimmt.

Xiao Li lernte daraus eine wichtige Lektion: **Wenn du nicht verstehst, wie die Routing-Modi funktionieren und welche Server-Konfiguration sie benötigen, weißt du noch nicht einmal, warum der Fehler auftritt – geschweige denn, wie du ihn beheben kannst.**
:::

::: info 💡 Kernbotschaft
Frontend-Routing ist keine „Blackbox". Wenn du seine Funktionsweise verstehst, kannst du bei Deployment-, Performance- und SEO-Problemen schnell die Ursache finden und präzise lösen. Noch wichtiger: Dieses Wissen hilft dir, bei der Architekturplanung klügere Entscheidungen zu treffen – wann du den Hash-Modus, wann den History-Modus verwendest und wie du häufige Stolperfallen vermeidest.
:::

---

## 2. Kernkonzepte: Route, Modus, Navigation

Bevor wir in die konkrete Implementierung eintauchen, müssen wir einige Kernkonzepte klären. Zum besseren Verständnis nutzen wir eine Bibliotheks-Analogie, um ihre Beziehungen zueinander zu veranschaulichen.

::: tip 🤔 Was haben diese Konzepte mit Routing zu tun?
Route, Modus und Navigation sind die drei Säulen des Frontend-Routing-Systems.

Wenn du Vue Router oder React Router verwendest, übernimmt das Framework für dich:
1. **Routen-Mapping** → Definiert die Zuordnung zwischen URL und Komponente
2. **Modus-Auswahl** → Entscheidet, ob Hash- oder History-Modus verwendet wird
3. **Navigationssteuerung** → Verwaltet Seitenwechsel, Vorwärts-/Rückwärts-Navigation des Browsers

**Wenn du diese drei Konzepte verstehst, weißt du, was das Routing-System eigentlich tut, warum manchmal spezielle Konfiguration nötig ist und warum beim Deployment Probleme auftreten.**
:::

### 2.1 Das Routingsystem mit einer Bibliotheks-Analogie verstehen

Stell dir vor, du suchst ein Buch in einer Bibliothek – dieser Prozess ist dem Frontend-Routing erstaunlich ähnlich:

| Konzept | 📚 Bibliotheks-Analogie | Tatsächliche Funktion | Konkretes Beispiel |
|------|-------------|----------|----------|
| **Route** | Regalnummer und ihre Zuordnung zu Büchern | Definiert die Zuordnung zwischen URL und Seitenkomponente | `/user/123` entspricht der `UserDetail.vue`-Komponente |
| **Router** | Das Leitsystem und der Standortdienst der Bibliothek | Das Kernmodul, das alle Routen verwaltet und Navigation steuert | Vue Router, React Router sind Router |
| **Routing-Modus** | Indexierungsmethode (Karteikarten vs. elektronisches System) | Bestimmt das URL-Format und die zugrundeliegende Implementierung | Hash-Modus verwendet `#`, History-Modus normale Pfade |
| **Navigation** | Von einem Regal zum anderen gehen | Der Wechsel zwischen verschiedenen Seiten | Link-Klick, programmatische Navigation, Browser-Vor-/Zurück |

::: tip 📊 Was kannst du aus dieser Tabelle mitnehmen?
Lass uns die Tabelle Zeile für Zeile durchgehen:

**Route**: Nur eine „Konfiguration", die dem System sagt, „welche URL zu welcher Seite gehört". So wie die Signatur eines Buches zu seinem Standort führt.

**Router**: Der „Manager", der anhand der aktuellen URL die passende Komponente findet und rendert. Wie ein Bibliothekar, der anhand der Signatur das Buch für dich findet.

**Routing-Modus**: Die „Implementierungsart", die bestimmt, wie die URL aussieht und welche Technik dahintersteckt. So wie eine Bibliothek entweder einen Papierkatalog oder ein elektronisches Suchsystem verwenden kann.

**Navigation**: Das „Verhalten", die vom Nutzer ausgelöste Aktion des Seitenwechsels. Wie wenn du in der Bibliothek von Bereich A zu Bereich B gehst.

Es ist wichtig, diese vier zu unterscheiden: **Route ist die statische Konfiguration, Router der dynamische Manager, Modus die technische Wahl, Navigation das Nutzerverhalten.**
:::

### 2.2 Route: Der Mapping-Vertrag zwischen URL und Komponente

Eine Route ist im Wesentlichen ein „Vertrag", der festlegt, welcher Inhalt beim Aufruf einer bestimmten URL angezeigt werden soll. In Vue Router sieht eine typische Routen-Konfiguration so aus:

```javascript
const routes = [
  {
    path: '/',           // URL-Pfad
    component: Home      // Zugehörige Komponente
  },
  {
    path: '/user/:id',   // Dynamische Route mit Parameter
    component: UserDetail,
    children: [          // Verschachtelte Routen
      { path: 'profile', component: UserProfile },
      { path: 'posts', component: UserPosts }
    ]
  }
]
```

**Du fragst dich vielleicht: Warum nicht einfach `<a>`-Tags verwenden, sondern Routen?**

Die Antwort liegt in der Natur der Single-Page-Application: Eine SPA hat nur eine HTML-Seite, alle Seitenwechsel sind tatsächlich Komponenten-Austausch innerhalb derselben Seite. Wenn du ein traditionelles `<a href="/user/123">` verwendest, würde der Browser tatsächlich den Pfad `/user/123` anfordern, was zu einem Seiten-Reload oder 404-Fehler führt. Die Aufgabe des Routings ist es, diese Sprungaktionen abzufangen und Komponenten mit JavaScript dynamisch auszutauschen, um einen Wechsel ohne Reload zu ermöglichen.

::: details 🔧 Gängige Muster der Routen-Konfiguration
**Statische Route** (am einfachsten):
```javascript
{ path: '/home', component: Home }
{ path: '/about', component: About }
```

**Dynamische Route** (mit Parameter):
```javascript
{ path: '/user/:id', component: UserDetail }
// Passt auf /user/123, /user/abc usw.
// In der Komponente über route.params.id abrufbar
```

**Verschachtelte Route** (Eltern-Kind-Beziehung):
```javascript
{
  path: '/user/:id',
  component: UserLayout,    // Elternkomponente
  children: [
    { path: 'profile', component: UserProfile },   // Tatsächlicher Pfad /user/:id/profile
    { path: 'posts', component: UserPosts }        // Tatsächlicher Pfad /user/:id/posts
  ]
}
```

**Wildcard-Route** (404-Seite):
```javascript
{ path: '/:pathMatch(.*)*', component: NotFound }
// Passt auf alle nicht definierten Routen
```
:::

### 2.3 Routing-Modi: Der wesentliche Unterschied zwischen Hash und History

Frontend-Routing hat zwei gängige Implementierungsmodi: Hash-Modus und History-Modus. Sie unterscheiden sich grundlegend in URL-Darstellung, zugrundeliegender Implementierung und Kompatibilität.

::: tip 🤔 Warum braucht es zwei Modi?
Das ist eine Frage der historischen Entwicklung und technischer Abwägungen.

**Hash-Modus** ist die früheste Implementierung von Frontend-Routing und nutzt den Hash-Teil der URL (den Inhalt nach dem `#`). Hash-Änderungen lösen keinen Seiten-Reload aus und bieten hervorragende Kompatibilität (selbst IE8 wird unterstützt).

**History-Modus** ist der „Standardansatz" seit HTML5. Er nutzt die History-API-Methoden `pushState` und `replaceState`, um URLs „normaler" aussehen zu lassen (ohne `#`), erfordert aber serverseitige Konfiguration.

Als Analogie: Der Hash-Modus ist wie ein „Haftnotiz an der Zimmertür" (beeinflusst die Raumstruktur nicht), der History-Modus wie ein „Neunummerieren der Zimmer" (erfordert Aktualisierung des Türschildsystems).
:::

| Eigenschaft | Hash-Modus | History-Modus |
|------|-----------|--------------|
| **URL-Beispiel** | `https://example.com/#/user/123` | `https://example.com/user/123` |
| **Implementierung** | Lauscht auf `hashchange`-Ereignis | Verwendet History API (`pushState`, `replaceState`) |
| **Server-Konfiguration** | Nicht nötig (Hash wird nicht an Server gesendet) | **Muss Fallback auf index.html konfigurieren** |
| **Browser-Kompatibilität** | IE8+ (nahezu alle Browser) | IE10+ (moderne Browser) |
| **SEO-Freundlichkeit** | Schlechter (Suchmaschinen ignorieren Hash oft) | Gut (URL-Struktur ist klar) |
| **Nutzererlebnis** | URL enthält `#`, sieht nach „Anker-Sprung" aus | URL ist sauber, ähnelt traditionellen Websites |
| **Deployment-Aufwand** | Gering, keine spezielle Konfiguration nötig | Hoch, Server muss korrekt konfiguriert werden |

<HashVsHistoryDemo />

::: tip 📊 Was kannst du aus dieser Tabelle mitnehmen?
Lass uns die Tabelle Zeile für Zeile durchgehen:

**URL-Beispiel**: Der Hash-Modus hat ein deutlich sichtbares `#` in der URL, Nutzer erkennen sofort, dass es eine SPA ist; der History-Modus sieht aus wie eine traditionelle Website, wirkt „professioneller".

**Implementierung**: Der Hash-Modus lauscht auf das `hashchange`-Ereignis (wird bei Hash-Änderung ausgelöst); der History-Modus nutzt die HTML5 History API, die einen Seitenwechsel „vortäuschen" kann, ohne tatsächlich neu zu laden.

**Server-Konfiguration**: Das ist die häufigste Stolperfalle! Der Teil nach `#` im Hash-Modus wird nicht an den Server gesendet, der Server muss also nichts über die Routen wissen; im History-Modus wird der vollständige Pfad an den Server gesendet – ist der Server nicht korrekt konfiguriert, gibt es 404.

**SEO-Freundlichkeit**: Suchmaschinen-Crawler führen in der Regel kein JavaScript aus, Hash-Modus-URLs werden möglicherweise ignoriert; History-Modus-URLs haben eine klare Struktur und werden besser indexiert.

**Deployment-Aufwand**: Der Hash-Modus funktioniert „out of the box", der History-Modus erfordert Operations-Know-how (Nginx, Apache usw.). Deshalb verwenden viele persönliche Projekte standardmäßig den Hash-Modus.
:::

---

## 3. Evolutionspfad: Von traditionellen Websites zu modernem Routing

Nach all diesen Konzepten schauen wir uns einen realen Fall an: Wie sich eine E-Commerce-Website schrittweise von einer traditionellen Multi-Page-Application zu modernem SPA-Routing entwickelt hat. Dieser Fall zeigt dir anschaulich, welche Probleme Frontend-Routing löst.

::: tip 📖 Hintergrundwissen: Was sind MPA, SPA und SSR?
Bevor wir in den Fall einsteigen, eine kurze Einführung dieser Begriffe:

- **MPA (Multi-Page Application)**: **Mehrseitenanwendung**, die traditionelle Art der Webentwicklung. Jede Seite ist eine eigenständige HTML-Datei, Seitenwechsel laden die gesamte Seite neu.
- **SPA (Single-Page Application)**: **Einzelseitenanwendung**, der aktuelle Mainstream der Frontend-Welt. Nur ein einziger HTML-Einstiegspunkt, Seitenwechsel erfolgen durch dynamischen Komponentenaustausch via JavaScript, ohne Reload.
- **SSR (Server-Side Rendering)**: **Serverseitiges Rendering**, dabei wird vollständiges HTML auf dem Server generiert. Kombiniert die Vorteile von SPA und MPA: schnelles First Paint, gute SEO.

**Einfach ausgedrückt**: MPA ist wie „bei jedem Umblättern neu zeichnen", SPA wie „auf demselben Blatt radieren und neu zeichnen", SSR wie „das Blatt vorher fertig zeichnen und dir dann geben".
:::

### 3.1 Das Gesamtbild der Evolution

Die folgende Tabelle zeigt die vier Evolutionsstufen von Frontend-Anwendungen und wie sich die Routing-Technik schrittweise entwickelt hat:

| Stufe | Anwendungstyp | Routing-Implementierung | Kernmerkmale | Nutzererlebnis |
|------|---------|---------|---------|---------|
| **Stufe 1: Traditionell** | MPA | Server-seitiges Routing | Jede Seite ist eigenständige HTML-Datei | Jeder Wechsel lädt neu |
| **Stufe 2: Frühe SPA** | SPA (Hash-Modus) | Hash-Routing | URL mit `#`, gute Kompatibilität | Kein Reload, aber URL nicht schön |
| **Stufe 3: Moderne SPA** | SPA (History-Modus) | History-Routing | Schöne URL, braucht Server-Konfiguration | Flüssig, URL wie traditionelle Website |
| **Stufe 4: Hybrides Rendering** | SPA + SSR | Isomorphes Routing | Erstes Rendering serverseitig, danach Frontend-Routing | Schnelles First Paint, gute SEO, flüssig |

::: tip 📊 Was kannst du aus dieser Tabelle mitnehmen?
Lass uns die Tabelle Zeile für Zeile durchgehen:

**Stufe 1 → Stufe 2**: Von „mit Reload" zu „ohne Reload" – ein qualitativer Sprung. Nutzer erleben erstmals das flüssige „App-ähnliche" Gefühl, aber der Preis ist das `#` in der URL, das unprofessionell wirkt.

**Stufe 2 → Stufe 3**: Von „funktioniert" zu „funktioniert gut". Der History-Modus macht URLs sauber und traditionellen Websites ähnlich, aber der Preis ist erhöhte Deployment-Komplexität (Server-Konfiguration nötig).

**Stufe 3 → Stufe 4**: Von „gute UX" zu „gute UX + gute SEO". SSR löst die SEO-Probleme der SPA, auch das First Paint ist schneller, aber die Implementierungskomplexität steigt deutlich.

**Zusammenfassung**: Die Evolution des Frontend-Routings ist nicht nur „schnellere Wechsel", sondern eine **Aufwertung der gesamten Anwendungsarchitektur** – von Server-dominiert zu Frontend-dominiert und schließlich zur Kombination beider. Jeder Schritt balanciert Nutzererlebnis, Entwicklungskosten, SEO und weitere Dimensionen aus.
:::

### 3.2 Stufe 1: Traditionelle Multi-Page-Application – Jedes Mal ein Reload

Warum heißt es „traditionelle Multi-Page-Application"? Weil in dieser Phase jede Seite eine eigenständige HTML-Datei ist und der Browser bei jedem Seitenwechsel alle Ressourcen (HTML, CSS, JS) neu herunterlädt. Das ist die früheste Art der Webentwicklung, und viele traditionelle Websites funktionieren heute noch so.

In dieser Phase nutzte die E-Commerce-Website „BuyMore" eine typische MPA-Architektur:

**Entwicklungsansatz**:
- **Routing-Implementierung**: Server-seitiges Routing, jede Seite entspricht einer HTML-Datei auf dem Server
- **Seitenwechsel**: Verwendung von `<a href="/products/123">`, löst vollständigen Seiten-Reload aus
- **Zustandsverwaltung**: Bei jedem Wechsel gehen vorherige Seitenzustände verloren (Scrollposition, Formularinhalte usw.)

**Merkmale dieser Phase**:
- ✅ **Vorteile**: Einfache Implementierung, suchmaschinenfreundlich (gute SEO), Browser-Navigation funktioniert out of the box
- ❌ **Nachteile**: Jeder Wechsel lädt neu, schlechtes Nutzererlebnis, hohe Serverlast (gleiche Ressourcen werden wiederholt geladen)

::: details Projektstruktur und Ablauf eines Seitenaufrufs
**Projektstruktur** (typische Struktur für Server-seitiges Rendering):
```
server/
├── views/              # HTML-Templates
│   ├── index.html      # Startseiten-Template
│   ├── products.html   # Produktlisten-Template
│   └── product.html    # Produktdetail-Template
├── public/             # Statische Ressourcen
│   ├── css/
│   ├── js/
│   └── images/
└── server.js           # Server-Einstiegspunkt
```

**Ablauf eines Seitenwechsels**:
```
1. Nutzer klickt auf Link <a href="/products/123">
       ↓
2. Browser sendet GET-Anfrage an Server
       ↓
3. Server rendert product.html, fügt Daten ein
       ↓
4. Vollständige HTML-Seite wird zurückgegeben
       ↓
5. Browser parst HTML, lädt CSS/JS, rendert Seite
       ↓
6. Nutzer sieht die Seite (dieser Prozess dauert meist 1-3 Sekunden)
```

**Schmerzpunkte für Nutzer**:
- Nach Klick auf Link erscheint weißer Bildschirm, lange Wartezeit
- Bei jedem Wechsel werden dieselben CSS/JS-Dateien neu geladen
- Browser-Vor-/Zurück lädt die Seite komplett neu
- Komplexe Seitenzustände (Filter, Scrollposition) können nicht erhalten bleiben
:::

Dieser Entwicklungsansatz mag für kleine Websites noch akzeptabel sein, aber mit wachsender Website-Größe und steigenden Nutzererwartungen beeinträchtigen diese Probleme zunehmend die Nutzerbindung und Konversionsrate.

### 3.3 Stufe 2: Frühe Single-Page-Application – Das Zeitalter des Hash-Routings

Als die Probleme der traditionellen Multi-Page-Application unübersehbar wurden, entschied das „BuyMore"-Team, Frontend-Routing einzuführen und auf eine SPA-Architektur umzusteigen. Ein wichtiger Wendepunkt – von „Server-dominiert" zu „Frontend-dominiert".

Doch diese Phase hatte ihren Preis: Das `#` in der URL wirkte unprofessionell und die Suchmaschinen-Indexierung war problematisch.

**Entwicklungsansatz**:
- **Routing-Implementierung**: Hash-Routing, nutzt den `#`-Teil der URL
- **Seitenwechsel**: JavaScript fängt Link-Klicks ab und tauscht Komponenten dynamisch aus
- **Zustandsverwaltung**: Seitenzustand bleibt clientseitig erhalten, kein Neuladen nötig

**Merkmale dieser Phase**:
- ✅ **Vorteile**: Wechsel ohne Reload, flüssiges Nutzererlebnis, geringere Serverlast
- ❌ **Nachteile**: URL mit `#`, SEO-unfreundlich, langsamerer erster Ladevorgang

::: details Implementierung des Hash-Routings
**Projektstruktur** (typische Struktur einer frühen SPA):
```
project/
├── index.html          # Die einzige HTML-Einstiegsdatei
├── css/
│   └── app.css         # Alle Styles in einer Datei gebündelt
├── js/
│   ├── router.js       # Einfache Routing-Implementierung
│   ├── views/          # Seitenkomponenten
│   │   ├── Home.js
│   │   ├── ProductList.js
│   │   └── ProductDetail.js
│   └── app.js          # Anwendungs-Einstiegspunkt
└── server.js           # Einfacher statischer Dateiserver
```

**Hash-Routing Kerncode**:
```javascript
// router.js - Vereinfachte Hash-Router-Implementierung
class HashRouter {
  constructor(routes) {
    this.routes = routes
    this.currentPath = null

    // Auf Hash-Änderungen lauschen
    window.addEventListener('hashchange', () => {
      this.matchRoute()
    })

    // Initialisierung
    this.matchRoute()
  }

  matchRoute() {
    // Aktuellen Hash abrufen (ohne #)
    const hash = window.location.hash.slice(1) || '/'
    const route = this.routes.find(r => r.path === hash)

    if (route) {
      this.render(route.component)
    } else {
      this.render(NotFoundComponent)
    }
  }

  render(component) {
    const app = document.getElementById('app')
    app.innerHTML = component.template()
    component.mount?.(app)
  }

  navigate(path) {
    window.location.hash = path
  }
}

// Verwendung
const router = new HashRouter([
  { path: '/', component: Home },
  { path: '/products', component: ProductList },
  { path: '/products/:id', component: ProductDetail }
])

// Navigation
router.navigate('/products/123')
```

**URL-Format**:
- Startseite: `https://example.com/#/`
- Produktliste: `https://example.com/#/products`
- Produktdetail: `https://example.com/#/products/123`

**Erreichte Verbesserungen**:
1. **Besseres Nutzererlebnis**: Seitenwechsel ohne Reload, flüssig und natürlich
2. **Geringere Serverlast**: HTML/CSS/JS werden nur einmal geladen, danach nur noch Daten
3. **Zustandserhaltung**: Scrollposition, Formularinhalte bleiben beim Seitenwechsel erhalten
4. **Offline-freundlich**: Mit Service Worker ist Offline-Zugriff möglich

**Neue Schmerzpunkte**:
1. **URL nicht schön**: `#` lässt die URL nach „Anker-Sprung" aussehen, unprofessionell
2. **SEO-Probleme**: Suchmaschinen-Crawler ignorieren möglicherweise den Inhalt nach dem Hash, Seiten werden nicht indexiert
3. **Langsamer erster Ladevorgang**: Das gesamte JavaScript muss auf einmal geladen werden, lange Time-to-First-Paint
:::

### 3.4 Stufe 3: Moderne Single-Page-Application – History-Routing wird zum Mainstream

Die Schmerzpunkte des Hash-Routings (unschöne URL, schlechte SEO) beschäftigten Entwickler über Jahre. Mit der Verbreitung von HTML5 und verbesserter Browser-Kompatibilität wurde History-Routing allmählich zum Mainstream.

History-Routing nutzt die HTML5 History API, um URLs „normal" aussehen zu lassen (ohne `#`), erfordert aber serverseitige Konfiguration.

**Entwicklungsansatz**:
- **Routing-Implementierung**: History-Routing, verwendet `pushState` und `replaceState`
- **Routing-Bibliotheken**: Ausgereifte Libraries wie Vue Router, React Router
- **Server-Konfiguration**: Server muss so konfiguriert werden, dass alle Routen auf `index.html` zurückfallen

**Merkmale dieser Phase**:
- ✅ **Vorteile**: Schöne URL, SEO-freundlich, flüssiges Nutzererlebnis
- ❌ **Nachteile**: Deployment erfordert spezielle Konfiguration, Server muss mitspielen

::: details History-Routing Implementierung und Deployment-Konfiguration
**Projektstruktur** (typische Struktur einer modernen SPA):
```
project/
├── public/
│   └── index.html          # Der einzige HTML-Einstiegspunkt
├── src/
│   ├── router/
│   │   └── index.js        # Routen-Konfiguration
│   ├── views/              # Seitenkomponenten
│   │   ├── Home.vue
│   │   ├── ProductList.vue
│   │   └── ProductDetail.vue
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js          # Build-Konfiguration
```

**Vue Router Konfigurationsbeispiel**:
```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),  // History-Modus
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/products', component: () => import('@/views/ProductList.vue') },
    { path: '/products/:id', component: () => import('@/views/ProductDetail.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') }
  ]
})

export default router
```

**URL-Format**:
- Startseite: `https://example.com/`
- Produktliste: `https://example.com/products`
- Produktdetail: `https://example.com/products/123`

**Entscheidend: Nginx-Konfiguration** (muss beim Deployment konfiguriert werden):
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/app;
    index index.html;

    # Entscheidende Konfiguration: Alle Routen zeigen auf index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Warum ist diese Konfiguration nötig?**

```
Szenario: Nutzer ruft direkt https://example.com/products/123 auf

❌ Ohne Konfiguration:
1. Browser sendet Anfrage an Server für /products/123
2. Nginx sucht im Dateisystem nach /products/123
3. Datei nicht gefunden, gibt 404 zurück

✅ Mit try_files-Konfiguration:
1. Browser sendet Anfrage an Server für /products/123
2. Nginx versucht Datei zu finden → existiert nicht
3. Fallback auf /index.html (gemäß try_files-Regel)
4. Browser lädt index.html
5. Vue Router übernimmt, parst /products/123
6. Rendert ProductDetail-Komponente
7. Seite wird normal angezeigt!
```

**Vergleich der Unterschiede zum Hash-Modus**:
| Vergleich | Hash-Modus | History-Modus |
|--------|----------|-------------|
| URL | `/#/products/123` | `/products/123` |
| Server-Konfiguration | Nicht nötig | **Muss konfiguriert werden** |
| Direkter Zugriff | ✅ Funktioniert normal | ❌ Benötigt Server-Unterstützung |
| SEO | ⚠️ Schlechter | ✅ Gut |
:::

### 3.5 Stufe 4: Hybrides Rendering – Die ultimative SPA + SSR Lösung

Als History-Routing ausgereift war, begann das Team, sich tiefergehenden Fragen zu widmen: Wie kann man das flüssige SPA-Erlebnis beibehalten und gleichzeitig die SEO- und First-Paint-Probleme lösen?

Der Kern dieser Phase ist „isomorphes Rendering" – das erste Rendering erfolgt serverseitig (gute SEO, schnelles Laden), die nachfolgende Interaktion über Frontend-Routing (flüssiges Erlebnis).

**Entwicklungsansatz**:
- **Framework-Wahl**: Next.js (React), Nuxt.js (Vue)
- **Rendering-Strategie**: Server-Side Rendering + Client-seitige Hydration
- **Routing-Modus**: History-Modus (Server-seitig bereits konfiguriert)

**Merkmale dieser Phase**:
- ✅ **Vorteile**: Schnelles First Paint, gute SEO, flüssige nachfolgende Interaktion
- ❌ **Nachteile**: Hohe Implementierungskomplexität, benötigt Server-Laufzeitumgebung

::: details Wie hybrides Rendering funktioniert
**Ablauf des Seitenladens**:
```
1. Nutzer ruft /products/123 auf
       ↓
2. Server empfängt Anfrage
       ↓
3. Server rendert ProductDetail-Komponente → generiert vollständiges HTML
       ↓
4. HTML wird an Browser zurückgegeben (enthält vollständigen Inhalt)
       ↓
5. Browser zeigt Inhalt schnell an (schnelles First Paint)
       ↓
6. JavaScript wird geladen, „Hydration" wird ausgeführt
       ↓
7. Nachfolgende Seitenwechsel werden vom Frontend-Routing übernommen (ohne Reload)
```

**Vergleich traditionelles SPA vs. SSR beim First Paint**:

| Vergleich | Traditionelles SPA | SSR |
|--------|---------|-----|
| First Paint Inhalt | Weißer Bildschirm → JS laden → Rendern | Inhalt sofort sichtbar |
| SEO | Crawler sieht möglicherweise keinen Inhalt | Crawler sieht vollständiges HTML |
| Time-to-First-Paint | Langsamer (JS muss geladen werden) | Schneller (HTML enthält bereits Inhalt) |
| Nachfolgende Interaktion | Flüssig (Frontend-Routing) | Flüssig (Frontend-Routing) |
:::

---

## 4. Funktionsweise im Detail: Ansatz für funktioniert Routing

Nachdem wir praktische Fälle betrachtet haben, tauchen wir tiefer in die Funktionsweise des Frontend-Routings ein und verstehen, worin sich Hash- und History-Modus tatsächlich unterscheiden.

<RouterArchitectureDemo />

### 4.1 Funktionsweise des Hash-Modus

Der Kern des Hash-Modus ist die Nutzung des `hash`-Teils der URL (der Inhalt nach dem `#`). Der Hash hat zwei wichtige Eigenschaften:

1. **Hash-Änderungen lösen keinen Seiten-Reload aus**
2. **Hash-Änderungen werden im Browser-Verlauf gespeichert**

Das bedeutet, wir können die URL ohne Seiten-Reload ändern, während die Vorwärts-/Rückwärts-Buttons des Browsers normal funktionieren.

**Ablauf**:

```
Nutzer klickt auf Link <a href="#/user/123">
       ↓
Browser aktualisiert URL (kein Seiten-Reload)
https://example.com/#/user/123
       ↓
Löst hashchange-Ereignis aus
       ↓
Routing-Listener fängt Ereignis ab
       ↓
Parst Hash-Wert → /user/123
       ↓
Vergleicht mit Routen-Konfiguration → findet UserDetail-Komponente
       ↓
Rendert Komponente auf der Seite
```

**Kerncode-Implementierung**:

```javascript
class HashRouter {
  constructor(routes) {
    this.routes = routes

    // Auf Hash-Änderungen lauschen
    window.addEventListener('hashchange', () => {
      this.loadRoute()
    })

    // Initial laden
    this.loadRoute()
  }

  loadRoute() {
    // Aktuellen Hash abrufen, führendes # entfernen
    const hash = window.location.hash.slice(1) || '/'
    const route = this.matchRoute(hash)

    if (route) {
      this.render(route.component)
    }
  }

  matchRoute(path) {
    return this.routes.find(r => r.path === path)
  }

  render(component) {
    document.getElementById('app').innerHTML = component.template()
  }

  push(path) {
    window.location.hash = path
  }
}
```

::: tip 💡 Vorteile des Hash-Modus
- **Gute Kompatibilität**: IE8+ wird unterstützt, funktioniert in nahezu allen Browsern
- **Einfaches Deployment**: Keine Server-Konfiguration nötig, funktioniert out of the box
- **Einfache Implementierung**: Nur auf `hashchange`-Ereignis lauschen
:::

### 4.2 Funktionsweise des History-Modus

Der History-Modus nutzt die HTML5 History API mit Methoden wie `pushState` und `replaceState`, die die URL ändern können, ohne die Seite neu zu laden.

**Kern-API**:

```javascript
// Neuen Verlaufseintrag hinzufügen
history.pushState(state, title, url)
// Beispiel: history.pushState({id: 123}, 'Nutzerdetails', '/user/123')

// Aktuellen Verlaufseintrag ersetzen
history.replaceState(state, title, url)

// Auf Verlaufsänderungen lauschen (Vorwärts-/Rückwärts-Buttons)
window.addEventListener('popstate', (event) => {
  // event.state enthält den bei pushState übergebenen State
})
```

**Ablauf**:

```
Nutzer klickt auf Link <a href="/user/123">
       ↓
JavaScript fängt Klick-Ereignis ab
event.preventDefault()
       ↓
Ruft history.pushState auf
history.pushState({id: 123}, 'Nutzerdetails', '/user/123')
       ↓
URL wird aktualisiert (kein Seiten-Reload)
https://example.com/user/123
       ↓
Route wird abgeglichen und Komponente gerendert
       ↓
Nutzer klickt auf Zurück-Button des Browsers
       ↓
Löst popstate-Ereignis aus
       ↓
Routing-Listener fängt Ereignis ab
       ↓
Rendert entsprechende Komponente basierend auf neuer URL
```

**Kerncode-Implementierung**:

```javascript
class HistoryRouter {
  constructor(routes) {
    this.routes = routes

    // Alle Link-Klicks abfangen
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a')
      if (link && link.getAttribute('href').startsWith('/')) {
        e.preventDefault()
        this.push(link.getAttribute('href'))
      }
    })

    // Auf Browser-Vorwärts-/Rückwärts-Navigation lauschen
    window.addEventListener('popstate', () => {
      this.loadRoute()
    })

    // Initial laden
    this.loadRoute()
  }

  loadRoute() {
    const path = window.location.pathname
    const route = this.matchRoute(path)

    if (route) {
      this.render(route.component)
    }
  }

  push(path) {
    history.pushState({}, '', path)
    this.loadRoute()
  }

  render(component) {
    document.getElementById('app').innerHTML = component.template()
  }
}
```

::: warning ⚠️ Fallstricke des History-Modus
Das größte Problem des History-Modus: **Wenn ein Nutzer direkt eine URL aufruft oder die Seite aktualisiert, sendet der Browser eine Anfrage an den Server**.

Wenn der Server nicht korrekt konfiguriert ist, wird 404 zurückgegeben. Die Lösung besteht darin, den Server so zu konfigurieren, dass alle Routen auf `index.html` zurückfallen und das Frontend-Routing die weitere Verarbeitung übernimmt.
:::

---

## 5. Praxisleitfaden zur Routen-Konfiguration

Genug Theorie – hier sind gängige Routing-Konfigurationsmuster und Best Practices für reale Projekte.

### 5.1 Grundlegende Routen-Konfiguration

::: details Vollständiges Vue Router Konfigurationsbeispiel

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/user/:id',
      name: 'UserDetail',
      component: () => import('@/views/UserDetail.vue'),
      props: true  // Routen-Parameter als props übergeben
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // Scroll-Verhalten: Position beim Zurückkehren beibehalten, sonst nach oben scrollen
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
```

:::

### 5.2 Lazy Loading von Routen: First-Paint-Performance verbessern

Lazy Loading von Routen bedeutet, dass die entsprechende Komponente erst beim Zugriff auf eine Route geladen wird, statt alle Komponenten auf einmal zu laden. Das reduziert die First-Paint-Zeit deutlich.

```javascript
// ❌ Alle Komponenten auf einmal laden (langsames First Paint)
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import User from '@/views/User.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/user', component: User }
]

// ✅ Lazy Loading (schnelles First Paint)
const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/about', component: () => import('@/views/About.vue') },
  { path: '/user', component: () => import('@/views/User.vue') }
]
```

<CodeSplittingDemo />

::: tip 💡 Prinzip des Lazy Loading
Wenn du `import('@/views/Home.vue')` verwendest, packt Webpack/Vite diese Komponente in eine separate Datei. Nur wenn der Nutzer diese Route tatsächlich aufruft, wird die entsprechende Datei heruntergeladen.

Als Analogie: Lazy Loading ist wie „à la carte bestellen", statt alle Gerichte auf einmal auf den Tisch zu stellen. Das reduziert die First-Paint-Zeit und verbessert das Nutzererlebnis.
:::

### 5.3 Routen-Guards: Berechtigungskontrolle und Navigations-Interceptor

Routen-Guards können Logik vor und nach einem Routen-Wechsel ausführen. Häufige Anwendungsfälle sind Berechtigungsprüfung, Seitentitel-Setzung und Daten-Prefetching.

```javascript
// Globaler Before-Guard
router.beforeEach(async (to, from, next) => {
  // Seitentitel setzen
  document.title = to.meta.title || 'My App'

  // Berechtigungsprüfung
  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      next('/login')
      return
    }
  }

  next()
})

// Globaler After-Hook
router.afterEach((to, from) => {
  // Seitenzugriffs-Statistik
  analytics.trackPageView(to.path)
})

// Routen-spezifischer Guard
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true, roles: ['admin'] },
    beforeEnter: (to, from, next) => {
      // Exklusive Logik für diese Route
      if (hasPermission()) {
        next()
      } else {
        next('/403')
      }
    }
  }
]
```

::: tip 💡 Häufige Anwendungsfälle für Routen-Guards
- **Berechtigungsprüfung**: Prüfen, ob der Nutzer Zugriff auf eine Seite hat
- **Seitentitel**: Dynamisches Setzen von document.title
- **Daten-Prefetching**: Daten vor dem Betreten der Seite abrufen
- **Fortschrittsbalken**: Ladebalken beim Seitenwechsel anzeigen
- **Zugriffsstatistik**: Seitenzugriffe erfassen
:::

---

## 6. Häufige Probleme und Lösungen

### 6.1 404 nach Deployment beim Aktualisieren

**Problem**: Lokal läuft alles normal, aber nach dem Deployment auf den Server führt direkter Zugriff auf eine Route oder Seitenaktualisierung zu 404.

**Ursache**: Im History-Modus behandelt der Server die URL als Dateipfad und versucht, sie zu finden – aber alle Routen der SPA verweisen tatsächlich auf `index.html`.

**Lösung**: Server-Fallback konfigurieren.

```nginx
# Nginx-Konfiguration
location / {
    try_files $uri $uri/ /index.html;
}
```

```apache
# Apache-Konfiguration (.htaccess)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 6.2 Routen-Parameter gehen verloren

**Problem**: Nach dem Aktualisieren der Seite gehen die Routen-Parameter `$route.params` verloren.

**Ursache**: Routen-Parameter existieren nur während des Routen-Wechsels, nach dem Aktualisieren müssen sie aus der URL neu geparst werden.

**Lösung**:

```javascript
// ❌ Falscher Ansatz: Parameter nur bei created abrufen
created() {
  const userId = this.$route.params.id
  this.fetchUser(userId)
}

// ✅ Richtiger Ansatz: Auf Routen-Änderungen lauschen
watch: {
  '$route.params.id': {
    immediate: true,
    handler(newId) {
      this.fetchUser(newId)
    }
  }
}
```

### 6.3 Abnormale Scroll-Position beim Seitenwechsel

**Problem**: Nach einem Seitenwechsel wird die Scroll-Position nicht zurückgesetzt, oder beim Zurückkehren wird die vorherige Position nicht beibehalten.

**Lösung**: `scrollBehavior` der Route konfigurieren.

```javascript
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // Beim Zurückkehren Scroll-Position beibehalten
    if (savedPosition) {
      return savedPosition
    }
    // Zu Anker springen
    if (to.hash) {
      return { el: to.hash }
    }
    // Sonst nach oben scrollen
    return { top: 0 }
  }
})
```

---

## 7. Zusammenfassung

Fassen wir die Kernkonzepte des Frontend-Routings in einer Tabelle zusammen:

| Konzept | In einem Satz erklärt | Gelöstes Problem | Typische Lösung |
|------|-----------|-----------|----------|
| **Route** | Zuordnung zwischen URL und Komponente | Unterschiedliche URLs zeigen unterschiedliche Inhalte | Vue Router, React Router |
| **Hash-Modus** | Routing über URL-Hash realisiert | Gute Kompatibilität, einfaches Deployment | Vue Router Hash-Modus |
| **History-Modus** | Routing über History API realisiert | Schöne URL, gute SEO | Vue Router History-Modus |
| **Lazy Loading** | Routen-Komponenten bei Bedarf laden | Reduziert First-Paint-Zeit | `() => import('./Page.vue')` |
| **Routen-Guards** | Hook-Funktionen vor/nach Routen-Wechsel | Berechtigungskontrolle, Daten-Prefetching | `beforeEach`, `beforeEnter` |
| **Dynamische Routen** | Routen mit Parametern | Passt auf eine Klasse von Pfaden statt einzelne | `/user/:id` |

::: info Zum Schluss
Frontend-Routing ist eine der Kerntechnologien moderner Single-Page-Applications. Vom frühen Hash-Modus bis zum heutigen History-Modus hat sich die Routing-Technik kontinuierlich weiterentwickelt, um Nutzern ein flüssigeres Browser-Erlebnis zu bieten.

Wenn du die Prinzipien und Modi des Routings verstehst, kannst du bei Deployment-, Performance- und SEO-Problemen schnell die Ursache finden und präzise lösen. Noch wichtiger: Dieses Wissen hilft dir, bei der Architekturplanung klügere Entscheidungen zu treffen – wann du Hash verwendest, wann History und wie du häufige Stolperfallen vermeidest.

Ich hoffe, dieser Artikel hilft dir, ein umfassendes Verständnis von Frontend-Routing aufzubauen. Wenn du in deinen Projekten auf Routing-Probleme stößt, weißt du, wo du ansetzen, wie du sie lokalisieren und lösen kannst.
:::