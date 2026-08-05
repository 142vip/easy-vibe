# Introduction : Ingénierie de contexte pour LLM
> 💡 **Guide d'apprentissage** : L'ingénierie de prompt résout le problème de « comment s'exprimer clairement », tandis que l'ingénierie de contexte résout celui de « faire en sorte que le modèle voie les bonnes informations au bon moment ». Ce chapitre s'articule autour d'une question : **dans une fenêtre de contexte limitée, comment faire en sorte que le modèle vous comprenne sans faire exploser votre budget ?**

Avant de commencer, nous vous recommandons de consolider deux bases :

- **Qu'est-ce qu'un Token** : lisez d'abord la section « Tokenisation & Tokens » de [Introduction aux Grands Modèles de Langage](./llm-principles.md).
- **Qu'est-ce qu'un Prompt** : si vous n'êtes pas encore familier avec la structure de base System / User / Assistant, consultez d'abord [Ingénierie de Prompt](./prompt-engineering/).

---

## 0. Introduction : Pourquoi le modèle oublie-t-il au fil de la conversation et devient-il de plus en plus cher

<AgentContextFlow />

De nombreux utilisateurs rencontrent des situations similaires en utilisant les grands modèles de langage :

- Au milieu d'une conversation, le modèle « oublie » soudainement les conditions clés mentionnées précédemment ;
- Dans les longues conversations, les réponses se contredisent, rendant difficile le maintien d'un cadre cohérent ;
- Plus les tours de dialogue s'accumulent, plus la facture grimpe comme un compteur de taxi.

Intuitivement, on pense : **« Ce modèle a une mauvaise mémoire »**.
Mais la plupart du temps, le problème ne vient pas du fait que le modèle « ne peut pas se souvenir », mais du fait que nous **n'avons pas conçu correctement le contexte qu'il peut voir**.

<IntroProblemReasonSolution />

Face à ces défis, se contenter de « bien rédiger ses prompts » ne suffit plus. Nous avons besoin d'une approche d'ingénierie plus systématique pour garantir que le modèle reçoive toujours les informations les plus critiques, dans une fenêtre et un budget limités. C'est précisément le problème que tente de résoudre l'**ingénierie de contexte**.

---

## 1. Qu'est-ce que l'« Ingénierie de Contexte » (Définition + Scénarios)

Commençons par une définition opérationnelle succincte, puis examinons quelques scénarios typiques.

> L'ingénierie de contexte est une méthode d'ingénierie qui consiste à construire et gérer « l'environnement informationnel » d'un LLM, en décidant de ce que le modèle « voit, ignore et à quel moment il le voit », afin d'accomplir des tâches de manière stable dans une fenêtre de contexte limitée.

En résumé, on peut la comprendre comme trois actions : organiser l'information, contrôler la fenêtre, gérer les coûts.
Les scénarios courants incluent :

- Agents conversationnels et robots de service client
- Assistants de code / documentation
- Appels d'outils multi-tours et orchestration de longs processus

Voyons maintenant, à partir des « leçons douloureuses » d'une équipe réelle, comment ils sont passés progressivement de « simplement écrire des Prompts » à « maîtriser l'ingénierie de contexte ».

---

## 2. Leçons douloureuses : Les écueils rencontrés par l'équipe Manus

Les cas de ce chapitre proviennent de **Manus** (un Agent IA généraliste).
Contrairement à une conversation ordinaire, Manus doit planifier de manière autonome et appeler des outils pour accomplir des tâches longues (impliquant des dizaines, voire des centaines d'interactions).

Cela crée une contradiction fondamentale :
- **Si on ne mémorise pas** : les informations critiques sont perdues, la tâche est interrompue.
- **Si on mémorise tout** : explosion des coûts et de la latence, dépassant même la limite de la fenêtre.

L'équipe Manus a traversé plusieurs refontes d'architecture avant de comprendre une vérité : **le contexte ne se « rédige » pas, il se « conçoit »**.

### 2.1 Que nous apprennent ces quatre refontes

Ji Yichao, co-fondateur de Manus, a partagé leur historique d'erreurs :

| Étape | Problème rencontré | Réflexion du moment | Résultat |
| :--- | :--- | :--- | :--- |
| **Première** | L'IA oublie au fil de la conversation | « Écrivons plus d'instructions dans le prompt » | Des prompts de plus en plus longs, de plus en plus chers |
| **Deuxième** | Les informations importantes sont évincées | « Dupliquons ce qui est important » | Des textes encore plus longs, des coûts encore plus élevés |
| **Troisième** | La facture devient astronomique | « Peut-on réutiliser les calculs précédents ? » | Découverte d'un moyen de réduire le coût des calculs redondants |
| **Quatrième** | Impossible de traiter les longs documents | « Peut-on chercher seulement au moment du besoin ? » | Mise en place d'une solution « bibliothèque + recherche à la demande » |

**Leçon fondamentale** : **Il ne s'agit pas de se souvenir du maximum, mais de se souvenir intelligemment**.

### 2.2 À quoi ressemble vraiment la « mémoire » de l'IA

**Mémoire d'ordinateur traditionnelle** = **Disque dur** :
- Grande capacité : peut stocker de grandes quantités de données à long terme ;
- Faible coût : stocker pendant un an coûte relativement peu ;
- Vitesse de lecture/écriture relativement lente, la recherche d'informations prend un certain temps.

**Contexte de l'IA** = **Tableau noir** :
- Lecture/écriture rapide : le modèle peut voir tout le contexte en un seul appel ;
- Capacité limitée : une fois plein, il faut effacer l'ancien contenu ;
- Chaque token écrit entraîne des calculs et des coûts supplémentaires.

**Leçon de Manus** : **Le tableau noir doit être utilisé avec parcimonie et astuce, pas pour stocker une encyclopédie**.

---

## 3. Première étape : Comprendre les coûts - Où va chaque centime

### 3.1 Pourquoi commencer par les coûts

Examinons comment votre argent est dépensé lors d'une conversation IA typique :

```
💰 Structure des coûts (une conversation) :
├─ 70 % Relecture de l'ancien contenu (« De quoi parlions-nous ? »)
├─ 20 % Traitement du nouveau contenu (« Qu'est-ce qu'on dit maintenant ? »)
└─ 10 % Génération de la réponse (« Comment répondre ? »)
```

**Constat surprenant** : **70 % de l'argent est dépensé pour faire relire à l'IA ce que vous avez déjà dit !**

### 3.2 Qu'est-ce que le KV Cache (Réutilisation du préfixe)

Avant de parler de prix, comprenons un concept technique clé : le **KV Cache (Cache Clé-Valeur)**.
Ne vous laissez pas intimider par ce terme technique, c'est simplement la « fiche de mémoire à court terme » de l'IA.

- **Sans KV Cache** : l'IA doit, à chaque fois, tout relire, comprendre et calculer depuis le premier mot, comme si elle voyait le texte pour la première fois.
- **Avec KV Cache** : l'IA conserve le résultat des calculs de la partie déjà vue (Pre-fill). La prochaine fois, si le début n'a pas changé, elle accède directement à la mémoire sans recalculer.

C'est comme :
> Vous passez un examen.
> **Scénario A** : vous devez relire tout le manuel depuis le début avant de répondre à chaque question. (Lent, fatigant, coûteux)
> **Scénario B** : vous connaissez le contenu du manuel par cœur (Cache), vous vous asseyez et répondez directement. (Rapide, facile, économique)

Dans la grille tarifaire des fournisseurs cloud, **le « contenu déjà appris » (Cache Hit)** est généralement **plus de 90 % moins cher** que le « contenu nouveau » (Cache Miss).

### 3.3 La différence de prix entre « apprendre par cœur » et « chercher au besoin »

Avec Claude par exemple :
- **Chercher au moment du besoin** (sans cache) : 3,00 $ / million de tokens
- **Déjà appris** (avec cache) : 0,30 $ / million de tokens
- **10 fois moins cher !**

**Pratique de Manus** : en faisant « apprendre par cœur » à l'IA, ils ont réduit le coût de **0,15 $ à 0,02 $**, soit **87 % d'économies !**

<ContextWindowVisualizer />

### 3.4 Guide anti-erreur : ne laissez pas l'horodatage détruire votre « cache »

Beaucoup de développeurs ont l'habitude de mettre « l'heure actuelle » dans la première ligne du System Prompt, pensant que c'est plus rigoureux.
**Mais c'est en réalité l'un des plus grands anti-patterns de l'ingénierie de contexte.**

Imaginez : vous avez mémorisé tout un livre d'histoire (System Prompt), et la première ligne du livre indique « la seconde actuelle ».
Si cette ligne change chaque seconde, alors tout ce que vous avez mémorisé la seconde précédente devient caduc — vous devez tout réapprendre depuis le début.

C'est le point faible de la **réutilisation du préfixe (KV Cache)** : **si le début change, tout ce qui suit doit être recalculé**.

#### Mauvaise pratique : placer les informations dynamiques au début
```text
System: Il est maintenant 2024-01-01 12:00:01. Vous êtes un assistant...
(Une minute plus tard)
System: Il est maintenant 2024-01-01 12:01:01. Vous êtes un assistant...
```
**Conséquence** : bien que seuls quelques caractères aient changé, comme ils se trouvent au début, les 99 % de contenu fixe qui suivent ne peuvent pas bénéficier du cache. Chaque requête est aussi lente et coûteuse que la première.

#### Bonne pratique : séparer le statique du dynamique
```text
System: Vous êtes un assistant... (placez ici des milliers de mots de règles fixes, base de connaissances)
User: (transmettez l'heure actuelle via un appel d'outil ou un message utilisateur ici)
```
**Avantage** : les milliers de mots de règles au début ne changent jamais, l'IA n'a besoin de les « apprendre » qu'une seule fois. Les requêtes suivantes utilisent directement la mémoire, pour une vitesse maximale.

👇 **Essayez par vous-même** :
Cliquez sur l'interrupteur ci-dessous pour activer l'**« accélération par apprentissage »**, puis cliquez plusieurs fois sur « Envoyer une nouvelle requête ».
Observez : quand le premier bloc devient « déjà appris », qu'arrive-t-il au **délai de première token (TTFT)** ?

<KVCacheDemo />

---

## 4. Deuxième étape : Fenêtre glissante - Quand la « mémoire » devient un « coût »

Au fur et à mesure que la conversation s'allonge, le premier problème qui survient est : **que faire quand la fenêtre est pleine ?**

### 4.1 Pourquoi le « premier entré, premier sorti » pose-t-il problème

La gestion de mémoire la plus simple est la **fenêtre glissante (Sliding Window)** : **ce qui est nouveau entre, ce qui est ancien sort**.
Cela semble équitable, mais dans les tâches réelles, c'est une catastrophe.

**Mise en situation** :
```text
Historique de conversation :
[1] Utilisateur : Je suis Jean Dupont, responsable du système de paiement
[2] Utilisateur : Le projet est développé en Go
[3] Utilisateur : La base de données est PostgreSQL
...
[20] Utilisateur : Écris-moi une API
```
**Résultat** : au 20e message, le 1er message « Je suis Jean Dupont » a déjà été évincé de la fenêtre. L'IA a complètement oublié qui vous êtes et quel système vous gérez.

**Le fond du problème** : cette stratégie traite de la même manière les **informations importantes** (identité, stack technique) et le **bruit** (« OK », « Bien reçu »), tout est expulsé ensemble.

### 4.2 « Amnésie du milieu » - Pourquoi l'IA ne voit-elle jamais les informations clés

En plus d'« oublier vite », l'IA a une autre bizarrerie : **elle « rate » aussi des informations**.
Des recherches montrent que : **l'IA est la plus sensible au début et à la fin, et le milieu est le plus facilement ignoré**. C'est le célèbre phénomène de **Lost in the Middle (perte au milieu)**.

**Courbe de mémoire en U** :
```text
Position : Début → Milieu → Fin
Mémoire :  Élevée → Faible → Élevée
```

👇 **Essayez par vous-même** :
1. Testez d'abord la **« fenêtre glissante »** : envoyez plusieurs messages dans la boîte de dialogue ci-dessous et observez comment les anciennes conversations sont impitoyablement « expulsées ».
2. Ensuite, observez le **« lost in the middle »** : quand une information clé est cachée au milieu d'un long paragraphe, le taux de succès de récupération est-il le plus bas ?

<SlidingWindowDemo />
<LostInMiddleDemo />

**Solution** : placez les informations critiques au **début** (prompt système) ou à la **fin** (question utilisateur).

---

## 5. Troisième étape : Rétention sélective - Comment « épingler » les informations clés

Puisque le « premier entré, premier sorti » n'est pas fiable, que faire ?
La réponse de Manus : **établir une « hiérarchie de l'information »**.

### 5.1 Pourquoi classer l'information par niveau

Ne traitez plus chaque information de manière égale, décidez de leur sort en fonction de leur importance :

| Niveau | Type d'information | Traitement | Impact sur le coût |
| :--- | :--- | :--- | :--- |
| **VIP** | Paramètres système, identité utilisateur | **Conservé en permanence** | +15 % de coût |
| **Important** | Objectif de la tâche en cours | **Conservé pendant la durée de la tâche** | +10 % de coût |
| **Normal** | Historique de conversation ordinaire | **Conservé sur les 5 derniers tours** | Coût de référence |
| **Jetable** | Connaissances consultables | **Cherché uniquement au besoin** | -60 % de coût |

**Idée centrale** : **Avec 25 % de coût supplémentaire, obtenir 90 % de rétention des informations clés**.

### 5.2 La stratégie de l'« épingle »

Imaginez la fenêtre de contexte comme un tableau noir :
- **Informations VIP** : fermement **épinglées** en haut du tableau (System Prompt).
- **Informations importantes** : **aimantées** au milieu du tableau (Context Injection).
- **Conversation ordinaire** : écrite dans la partie basse du tableau, effacée lorsque l'espace est plein (Sliding Window).

👇 **Essayez par vous-même** :
Dans la démonstration ci-dessous, essayez d'« épingler » un message important.
Observez : lorsque vous continuez la conversation, les informations épinglées restent-elles toujours présentes, tandis que les autres sont évincées ?

<SelectiveContextDemo />

---

## 6. Quatrième étape : RAG - Quand la « mémoire » a besoin d'une « bibliothèque »

Parfois, le volume d'informations à traiter est trop important (des centaines de pages de documentation technique), le tableau noir ne suffit plus. Il faut alors un cerveau externe — le **RAG (Retrieval-Augmented Generation, Génération Augmentée par Récupération)**.

### 6.1 Pourquoi le « tableau noir » ne suffit-il pas

Face à une documentation technique de plusieurs millions de mots, Manus a comparé deux approches :

1.  **Chargement intégral** : tout le contenu est injecté dans le contexte en une seule fois.
    *   **Conséquence** : le tableau noir est instantanément saturé, le traitement est extrêmement lent, et selon la théorie du « lost in the middle », l'IA ne retient de toute façon pas le contenu du milieu.
    *   **Coût** : environ 50 $/requête, 15 secondes d'attente.
2.  **Recherche à la demande (RAG)** : d'abord chercher dans la bibliothèque (base de données), puis ne copier que les paragraphes pertinents sur le tableau noir.
    *   **Conséquence** : le tableau noir reste propre, l'IA se concentre sur les informations clés.
    *   **Coût** : environ 0,5 $/requête, 2 secondes d'attente.

**99 % d'économies et 87 % de temps gagné !**

### 6.2 Bonnes pratiques pour la « recherche documentaire »

Leçons tirées de l'expérience de Manus :
*   **En quels morceaux découper chaque livre ?** 500-1000 tokens donnent les meilleurs résultats.
*   **Combien de livres consulter à la fois ?** 3 à 5, plus serait contre-productif.
*   **Quel seuil de pertinence pour chercher ?** Similarité > 0,7, pour éviter d'inclure du contenu non pertinent.

👇 **Essayez par vous-même** :
Saisissez une question dans la barre de recherche (par exemple « Comment réinitialiser le mot de passe ») et observez comment le système extrait uniquement les documents les plus pertinents parmi une masse de documents.

<RAGSimulationDemo />

---

## 7. Cinquième étape : Compression - Comment écrire plus dense sur le « tableau noir »

Si toutes les informations sont importantes, qu'on ne peut vraiment pas les supprimer et qu'on ne veut pas chercher ailleurs ?
Il ne reste qu'une solution : **écrire plus petit** — c'est la **compression de contexte**.

### 7.1 Quand a-t-on besoin de « condenser »
*   Les documents récupérés sont trop longs (> 2000 tokens).
*   L'historique de conversation est trop verbeux (occupe > 80 % du tableau noir).
*   On a besoin d'une réponse rapide, on ne veut pas que l'IA lise un roman.

### 7.2 Les trois niveaux de « condensation »

| Méthode de compression | Taux de compression | Ce qui est conservé | Scénario applicable | Économies réalisées |
| :--- | :--- | :--- | :--- | :--- |
| **Résumé** | 70 % | Le sens général | Compréhension rapide | 30 % d'économies |
| **Points clés** | 50 % | Les points essentiels | Sortie structurée | 50 % d'économies |
| **Tableau** | 30 % | Les données essentielles | Traitement par programme | 70 % d'économies |

👇 **Essayez par vous-même** :
Choisissez différentes stratégies de compression et observez comment un long texte devient plus court et plus concis.

<ContextCompressionDemo />

---

## 8. Intégration système : Construire le « Palais de la Mémoire » de l'IA

Jusqu'ici, nous avons appris diverses stratégies indépendantes, comme des briques :
*   **KV Cache** : pour économiser de l'argent (Chapitre 3)
*   **Fenêtre glissante** : pour libérer de l'espace (Chapitre 4)
*   **Rétention par niveau** : pour garder l'essentiel (Chapitre 5)
*   **RAG** : pour ajouter un cerveau externe (Chapitre 6)

Il est maintenant temps d'assembler ces briques pour construire un château complet — ce que nous appelons le **« Palais de la Mémoire »** de Manus.

### 8.1 Assembler le contexte comme on construit une maison

Ne considérez pas le contexte comme un amas de texte désordonné, mais comme un bâtiment à plusieurs étages. Chaque niveau a sa fonction spécifique et ses « règles d'occupation ».

👇 **Essayez par vous-même** :
Cliquez sur « Commencer la construction » et observez comment nous édifions ce palais étage par étage.

<MemoryPalaceDemo />

### 8.2 Pourquoi cette conception est-elle la plus performante

La philosophie de conception de ce palais vise à résoudre trois contradictions :

1.  **Fondations (System Prompt) — Résoudre le problème du « coût »**
    *   **Contradiction** : la configuration système (qui vous êtes, quelles sont les règles) est la plus longue, et doit être envoyée à chaque fois.
    *   **Solution** : placez-la au niveau le plus bas, en utilisant la technologie **KV Cache**. Tant qu'elle n'est pas modifiée, l'IA peut la « réciter par cœur ». Sur des centaines de tours de dialogue, le coût de calcul de cette partie est presque de **0**.

2.  **Piliers (Task Context) — Résoudre le problème de « l'oubli »**
    *   **Contradiction** : quand le dialogue s'allonge, l'IA oublie facilement l'objectif initial de la tâche (par exemple « écrire un jeu Snake »).
    *   **Solution** : utilisez la stratégie de **rétention par niveau** pour « épingler » l'objectif de la tâche au deuxième niveau. Peu importe le nombre de tours de conversation, ce niveau n'est jamais supprimé, garantissant que l'IA ne perde pas de vue sa mission.

3.  **Dernier étage (Chat & RAG) — Résoudre le problème du « désordre »**
    *   **Contradiction** : les nouvelles conversations et les documents recherchés se mélangent, créant de la confusion.
    *   **Solution** :
        *   **Salon (Conversation)** : géré par **fenêtre glissante**, ne gardez que les 5 à 10 derniers messages.
        *   **Bibliothèque (RAG)** : les documents sont utilisés puis évacués, ils n'encombrent pas l'espace.

### 8.3 Résultats concrets

Lorsque l'équipe Manus a mis en ligne cette architecture, les résultats ont été immédiats :

*   **Économies** : comme les fondations sont « apprises par cœur », le coût par tour de conversation a chuté de **84 %**.
*   **Plus rapide** : l'IA n'a plus besoin de relire des milliers de mots à chaque fois, le temps de réponse moyen est passé de 8 secondes à **2 secondes**.
*   **Plus précis** : les informations critiques sont « épinglées », l'IA n'oublie plus jamais son rôle en cours de route.

---

## 9. Templates pratiques : Copiez directement

Pour vous aider à comprendre plus intuitivement comment ce mécanisme fonctionne, nous vous avons préparé une **simulation complète du pipeline**.

Choisissez un scénario, cliquez sur « Étape suivante », et observez comment le **Palais de la Mémoire** récupère, assemble et nettoie dynamiquement le contexte dans les quelques secondes qui séparent la question de l'utilisateur et la réponse de l'IA.

<MemoryPalaceActionDemo />

### 📝 Conceptions pratiques prêtes à l'emploi

Si vous devez concevoir un système similaire à Manus, ne vous concentrez pas uniquement sur la rédaction du Prompt, mais aussi sur **la façon dont l'architecture système orchestre le contexte**.

Voici les **plans de conception système** pour deux scénarios classiques, incluant la **conception du prompt** et la **logique de code (pseudo-code)**.

#### Scénario 1 : Agent Ingénieur Full-Stack (mémoire longue durée)
> **Défi central** : cycle de tâche long, risque d'oublier les besoins initiaux et le contexte du projet.
> **Stratégie** : Couche System (identité) + Couche Task (objectif épinglé) + Couche Chat (fenêtre glissante).

**1. Prompt système (Couches 1 & 2)**
```markdown
# Couche 1 : Définition de l'identité (System Prompt) - Ne change jamais, exploite le KV Cache
Vous êtes un ingénieur full-stack senior, expert en Python et Vue3.
Style de code :
- Nommage des variables strictement conforme à PEP8
- Les logiques clés doivent être commentées
- Utilisez en priorité les fonctions utilitaires existantes du projet

# Couche 2 : Verrouillage de la tâche (Task Context) - Interdiction de supprimer pendant la tâche
Tâche en cours : Refonte du module de paiement (payment_module)
Contraintes fondamentales :
1. Doit être compatible avec l'API héritée v1.0
2. Les scripts de migration de base de données doivent être idempotents
3. Date limite : ce vendredi
```

**2. Logique d'assemblage du contexte (Pseudo-Code)**
```python
def build_engineer_context(user_input, chat_history, task_info):
    context = []

    # 1. Fondations : Définition de l'identité (exploite le KV Cache)
    # Cette partie ne change pas sur des centaines de tours, coût de calcul quasi nul
    context.append(SYSTEM_PROMPT)

    # 2. Piliers : Verrouillage de la tâche (Pinned)
    # Quelle que soit la longueur de la conversation, cette partie est toujours insérée après le System
    context.append(f"Tâche en cours : {task_info}")

    # 3. Couche de recherche : Extraits de code (RAG)
    # Cherche dans la base de code les extraits pertinents selon la question utilisateur
    relevant_code = search_codebase(user_input)
    if relevant_code:
        context.append(f"Code de référence :\n{relevant_code}")

    # 4. Couche d'interaction : Historique de conversation (Sliding Window)
    # Ne garder que les 10 derniers tours pour éviter de saturer le contexte
    recent_chat = chat_history[-10:]
    context.extend(recent_chat)

    # 5. Dernière entrée utilisateur
    context.append(user_input)

    return context
```

#### Scénario 2 : Agent de Service Client Intelligent (réponses précises)
> **Défi central** : sensible aux coûts, et ne doit absolument pas inventer de faits.
> **Stratégie** : Couche System (contraintes fortes) + Couche RAG (injection dynamique).

**1. Prompt système (Couche 1)**
```markdown
# Couche 1 : Définition de l'identité (System Prompt)
Vous êtes un agent de service client e-commerce professionnel.
Principes de réponse :
1. Ton chaleureux, professionnel et concis
2. **Interdiction absolue** d'inventer des faits, répondez uniquement sur la base des [Documents de référence]
3. Si la réponse ne se trouve pas dans les documents, répondez « Je suis désolé, je dois transférer cette question à un agent humain »
```

**2. Logique d'assemblage du contexte (Pseudo-Code)**
```python
def build_support_context(user_input):
    context = []

    # 1. Fondations : Définition de l'identité
    context.append(SYSTEM_PROMPT)

    # 2. Bibliothèque : Recherche dynamique (RAG)
    # Dans le scénario du service client, le RAG est l'acteur principal, placé au milieu
    docs = vector_db.search(user_input, top_k=3)

    context.append("【Début des documents de référence】")
    for doc in docs:
        context.append(doc.content)
    context.append("【Fin des documents de référence】")

    # 3. Couche d'interaction : Historique très court
    # Le service client n'a généralement pas besoin d'une mémoire longue, garder les 3 derniers tours suffit
    context.extend(get_recent_chat(limit=3))

    context.append(user_input)

    return context
```

---

## 10. Tableau des termes

| Terme anglais | Équivalent français | Explication |
| :--- | :--- | :--- |
| **Context Window** | Fenêtre de contexte | Longueur maximale de texte que le modèle peut traiter en une seule fois (entrée et sortie). Le contenu au-delà de cette limite est tronqué ou oublié. |
| **Token** | Token / Jeton | Unité minimale de traitement de texte pour les LLM. Environ 1 Token ≈ 0,75 mot anglais ou 0,5 caractère chinois. La facturation et la limite de fenêtre utilisent cette unité. |
| **KV Cache** | Cache KV | Technique d'accélération d'inférence qui met en cache les paires clé-valeur d'attention déjà calculées, évitant de recalculer les préfixes répétés et réduisant significativement la latence et les coûts. |
| **RAG** | Génération Augmentée par Récupération | Avant de répondre à une question, récupère d'abord des informations pertinentes depuis une base de connaissances externe, les fournit comme contexte au modèle pour réduire les hallucinations et étendre les limites de connaissance. |
| **Sliding Window** | Fenêtre glissante | Stratégie de gestion de contexte la plus basique. Maintient un nombre constant de tokens dans la fenêtre ; quand du nouveau contenu entre, le contenu le plus ancien est automatiquement supprimé. |
| **Lost in Middle** | Perte au milieu | Limitation des grands modèles. Les recherches montrent que le modèle retient le mieux le début et la fin d'un long contexte, et a tendance à ignorer la partie centrale. |
| **System Prompt** | Prompt système | Instruction placée au tout début de la conversation, définissant l'identité, les normes de comportement, le style de réponse et la mission principale du modèle. |
| **Few-shot** | Apprentissage en quelques exemples | Fournir quelques exemples « question-réponse » dans le prompt pour aider le modèle à comprendre rapidement le format de la tâche et la sortie attendue. |
| **Chain of Thought** | Chaîne de raisonnement | Guider le modèle pour qu'il produise d'abord les étapes de raisonnement avant de donner la réponse finale. Cette méthode améliore significativement la capacité du modèle à résoudre des problèmes logiques et mathématiques complexes. |
| **Hallucination** | Hallucination | Phénomène où le modèle génère avec assurance des informations qui semblent plausibles mais sont en réalité erronées ou inexistantes. |
| **Embedding** | Vectorisation / Plongement | Technique de conversion de texte en vecteurs numériques de haute dimension. Les textes sémantiquement similaires sont plus proches dans l'espace vectoriel, ce qui est la base de la recherche sémantique. |
| **Vector DB** | Base de données vectorielle | Base de données spécialisée dans le stockage et la recherche de données vectorielles. Permet de trouver rapidement les extraits de documents les plus pertinents par recherche de similarité. |
| **Temperature** | Température | Hyperparamètre contrôlant l'aléatoire de la sortie du modèle. Une valeur élevée (ex. 0,8) produit des sorties plus diverses et créatives ; une valeur basse (ex. 0,2) produit des sorties plus déterministes et rigoureuses. |
| **TTFT** | Délai au premier token | Time to First Token, c'est-à-dire le temps écoulé entre l'envoi de la requête par l'utilisateur et la sortie du premier token par le modèle. C'est un indicateur clé de l'expérience interactive. |

---

## Résumé : L'essence de l'ingénierie de contexte

Les quatre refontes de Manus nous enseignent :

**Du point de vue pratique** : il ne s'agit pas de se souvenir du maximum, mais de se souvenir de manière structurée et sélective.

**Du point de vue des coûts** :
- La majeure partie du gaspillage provient du calcul répété de préfixes fixes, à résoudre par la stabilité du préfixe et les mécanismes de cache ;
- Les informations importantes supprimées par erreur résultent souvent d'une fenêtre glissante qui « traite tout de la même manière », à résoudre par une hiérarchisation de l'information et une stratégie d'épinglage ;
- Face à des documents et bases de connaissances très volumineux, il n'est pas réaliste de compter uniquement sur l'augmentation de la fenêtre de contexte ; il faut combiner récupération et compression.

L'objectif est : dans les limites du modèle et de la fenêtre de contexte données, faire en sorte que chaque token investi ait une utilité clairement définie.
