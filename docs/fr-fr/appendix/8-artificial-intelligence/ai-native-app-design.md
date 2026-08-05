# Introduction : Conception d'applications natives IA

::: tip Préface
**Pourquoi certains produits IA sont-ils époustouflants alors que d'autres ne sont que des « coquilles autour de ChatGPT » ?** La différence ne réside pas dans la puissance du modèle utilisé, mais dans le fait que le produit soit conçu dès le départ autour des caractéristiques de l'IA. Les applications natives IA ne consistent pas à « ajouter une boîte de dialogue » à une application traditionnelle, mais à repenser l'interaction utilisateur, l'architecture système et la logique produit dans un paradigme entièrement nouveau.
:::

**Qu'allez-vous apprendre dans cet article ?**

Après avoir étudié ce chapitre, vous obtiendrez :

- **Conscience du paradigme** : comprendre la différence essentielle entre les applications natives IA et les applications traditionnelles
- **Principes de conception** : maîtriser les principes fondamentaux de la conception de produits natifs IA
- **Ingénierie de prompt** : comprendre comment concevoir des prompts de haute qualité pour piloter les capacités de l'IA
- **Modes d'interaction** : connaître les nouveaux paradigmes d'interaction utilisateur à l'ère de l'IA
- **Pensée architecturale** : comprendre le flux de traitement des requêtes et l'architecture système des applications IA

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Comparaison architecturale | Applications traditionnelles vs applications natives IA |
| **Chapitre 2** | Principes de conception | Pensée AI-First, conception pour l'incertitude |
| **Chapitre 3** | Ingénierie de prompt | Prompts système, conception de templates |
| **Chapitre 4** | Modes d'interaction | Sortie en streaming, multimodal, Agent |
| **Chapitre 5** | Flux de requêtes | Cycle de vie complet d'une application IA |

---

## 0. Vue d'ensemble : de « ajouter de l'IA » à « natif IA »

Ces dernières années, le parcours d'intégration de l'IA pour de nombreux produits a été le suivant : prendre une application existante, puis ajouter un bouton « Assistant IA » dans un coin. Cette approche, c'est comme monter un moteur sur une calèche — ça peut avancer, mais c'est loin de valoir une voiture conçue dès le départ.

**L'application native IA** est une toute nouvelle mentalité produit : dès la première ligne de code, l'IA est conçue comme une capacité centrale, et non comme une fonctionnalité ajoutée après coup.

::: tip Applications traditionnelles vs applications natives IA
- **Application traditionnelle** : action utilisateur → logique déterministe → résultat déterministe. Chaque clic sur « Valider la commande » suit exactement le même processus.
- **Application native IA** : intention utilisateur → compréhension par l'IA → résultat probabiliste. La même question peut donner une réponse légèrement différente à chaque fois.
- **Changement fondamental** : de « écrire des règles » à « décrire l'intention », du « déterministe » au « probabiliste », de l'« interface de manipulation » à l'« interface de dialogue ».
:::

---

## 1. Comparaison architecturale : deux mondes radicalement différents

L'architecture des applications traditionnelles suit le modèle « requête-réponse » : l'utilisateur clique sur un bouton, le backend exécute une logique déterministe et renvoie un résultat déterministe. Tout le processus est prévisible, testable et reproductible.

Les applications natives IA introduisent un tout nouvel acteur — **le grand modèle de langage**. Il agit comme une « couche intermédiaire intelligente », recevant des entrées en langage naturel et produisant des résultats en langage naturel. Cela entraîne des changements architecturaux fondamentaux.

<AINativeArchDemo />

| Dimension | Application traditionnelle | Application native IA |
|------|---------|------------|
| Mode de saisie | Formulaires, boutons, listes déroulantes | Langage naturel, images, voix |
| Logique de traitement | if-else, moteur de règles | Inférence LLM, pilotée par prompt |
| Caractéristique de sortie | Déterministe, reproductible | Probabiliste, peut varier à chaque fois |
| Latence | Millisecondes | Secondes (nécessite une sortie en streaming) |
| Gestion d'erreurs | Codes d'erreur explicites | Hallucinations, refus de réponse, réponses hors sujet |
| Modèle de coût | Ressources de calcul fixes | Facturation au token, coût très variable |

::: tip Les trois phases de l'évolution architecturale
1. **Amélioré par l'IA** : intégrer des fonctionnalités IA dans une application existante (autocomplétion, recommandations intelligentes)
2. **Collaboratif avec l'IA** : l'IA comme mode d'interaction principal, avec une UI traditionnelle en filet de sécurité (Notion AI, GitHub Copilot)
3. **Natif IA** : tout le produit est construit autour de l'IA, sans IA le produit n'existe pas (ChatGPT, Cursor, Midjourney)
:::

---

## 2. Principes de conception : la « constitution » des produits natifs IA

La conception d'applications natives IA ne peut pas copier les approches de conception logicielle traditionnelles. La nature probabiliste, la latence et l'imprévisibilité de l'IA exigent que nous établissions un ensemble de principes de conception entièrement nouveaux.

<AIDesignPrincipleDemo />

::: tip Les cinq principes fondamentaux de conception
1. **Embrasser l'incertitude** : la sortie de l'IA n'est pas fiable à 100 %, la conception du produit doit prendre en compte le cas où « l'IA peut se tromper ». Fournir des mécanismes d'édition, de réessai et de feedback pour que l'utilisateur garde toujours le contrôle.
2. **Confiance progressive** : ne pas laisser l'IA prendre des décisions à haut risque dès le départ. Établir d'abord la confiance de l'utilisateur dans des scénarios à faible risque, puis étendre progressivement l'autonomie de l'IA.
3. **Transparence et explicabilité** : faire savoir à l'utilisateur ce que fait l'IA et pourquoi. Montrer le processus de raisonnement, citer les sources, indiquer le niveau de confiance.
4. **Collaboration humain-machine** : l'IA ne remplace pas l'humain, elle l'augmente. La meilleure conception est que l'IA fasse le premier jet et que l'humain fasse la révision finale.
5. **Dégradation gracieuse** : lorsque le service IA est indisponible ou que les résultats ne sont pas satisfaisants, le produit doit rester utilisable. Toujours avoir un Plan B.
:::

---

## 3. Ingénierie de prompt : le « langage de programmation » des applications IA

Dans une application traditionnelle, vous utilisez du code pour dire à l'ordinateur quoi faire. Dans une application native IA, vous utilisez des prompts pour dire au modèle quoi faire. **Le prompt est le langage de programmation de l'ère de l'IA** — bien écrit, l'IA est époustouflante ; mal écrit, l'IA raconte n'importe quoi.

<PromptDesignDemo />

::: tip La structure en quatre couches de la conception de prompt
1. **Prompt système (System Prompt)** : définit le rôle, les limites de capacité et les normes de comportement de l'IA. C'est une instruction de niveau « constitutionnel », invisible pour l'utilisateur mais toujours active.
2. **Injection de contexte (Context)** : documents pertinents récupérés via RAG, historique utilisateur, etc., fournissant à l'IA les informations contextuelles nécessaires pour répondre.
3. **Entrée utilisateur (User Message)** : la question ou l'instruction réelle de l'utilisateur.
4. **Contrainte de format de sortie (Format)** : spécifie le format de sortie de l'IA (JSON, Markdown, template spécifique) pour garantir que le résultat puisse être analysé par un programme.
:::

| Technique de prompt | Description | Effet |
|------------|------|------|
| Attribution de rôle | « Tu es un ingénieur frontend senior » | Améliore la qualité des réponses dans le domaine spécialisé |
| Exemples Few-shot | Donner 2-3 exemples d'entrée-sortie | Permet au modèle de comprendre le format et le style attendus |
| Chaîne de pensée (CoT) | « Réfléchis étape par étape » | Améliore la précision du raisonnement complexe |
| Contrainte de sortie | « Réponds au format JSON » | Garantit que la sortie peut être analysée par un programme |
| Instruction négative | « N'invente pas d'informations incertaines » | Réduit les hallucinations et les informations erronées |

---

## 4. Modes d'interaction : l'expérience utilisateur à l'ère de l'IA

Les applications natives IA ont donné naissance à une série de nouveaux modes d'interaction. L'interaction des applications traditionnelles est « cliquer-attendre-voir », tandis que l'interaction des applications IA ressemble davantage à « dialoguer-observer-ajuster ».

<AIUXPatternDemo />

::: tip Les quatre modes d'interaction fondamentaux
1. **Sortie en streaming (Streaming)** : le contenu généré par l'IA s'affiche caractère par caractère, au lieu d'attendre que tout soit généré. Cela réduit considérablement le temps d'attente perçu par l'utilisateur et lui permet de juger si la direction est correcte pendant la génération.
2. **Dialogue multi-tours (Multi-turn)** : conversation continue grâce à la mémoire contextuelle, l'utilisateur peut affiner progressivement ses besoins. Le défi clé est la gestion de la fenêtre de contexte et la compression de l'historique de dialogue.
3. **Interaction multimodale (Multimodal)** : prend en charge le texte, les images, la voix, les fichiers et d'autres modes de saisie, l'IA peut également produire des images, du code, des tableaux et d'autres formats.
4. **Mode Agent (Agentic)** : l'IA ne se contente pas de répondre aux questions, elle planifie et exécute de manière autonome des tâches en plusieurs étapes. L'utilisateur donne un objectif, l'IA décompose les étapes et les exécute une par une.
:::

---

## 5. Flux de requêtes : le cycle de vie complet d'un appel IA

Lorsqu'un utilisateur envoie un message dans une application IA, que se passe-t-il en coulisses ? Comprendre ce flux complet est la base pour construire des applications IA fiables.

<AIAppFlowDemo />

::: tip Les six phases du traitement des requêtes
1. **Prétraitement de l'entrée** : validation de l'entrée utilisateur, audit de sécurité du contenu, anonymisation des informations sensibles
2. **Assemblage du contexte** : concaténation du prompt système, récupération des documents pertinents (RAG), chargement de l'historique de dialogue
3. **Appel au modèle** : envoi du prompt assemblé à l'API LLM, activation de la réponse en streaming
4. **Post-traitement de la sortie** : formatage de la sortie, filtrage de sécurité du contenu, extraction de données structurées
5. **Mise en cache des résultats** : mise en cache des résultats pour les questions fréquentes, réduction des coûts et de la latence
6. **Surveillance et enregistrement** : enregistrement de la consommation de tokens, du temps de réponse, des retours utilisateurs pour une optimisation continue
:::

| Phase | Considérations clés | Problèmes courants |
|------|---------|---------|
| Prétraitement de l'entrée | Protection contre les attaques par injection, limite de longueur | Injection de prompt, jailbreak |
| Assemblage du contexte | Allocation du budget de tokens, priorité des informations | Débordement de contexte, informations clés tronquées |
| Appel au modèle | Gestion des timeouts, stratégie de retry, transmission en streaming | Limitation de débit API, timeout réseau |
| Post-traitement de la sortie | Validation de format, détection d'hallucinations | Format de sortie non conforme aux attentes |
| Stratégie de cache | Cache sémantique vs cache exact | Faible taux de hit du cache |
| Surveillance et alertes | Surveillance des coûts, évaluation de la qualité | Coût des tokens hors de contrôle |

---

## Résumé

La conception d'applications natives IA ne consiste pas simplement à superposer des fonctionnalités IA sur des applications traditionnelles, mais à reconstruire entièrement l'architecture, l'interaction et les pratiques d'ingénierie.

Récapitulatif des points clés de ce chapitre :

1. **Changement architectural** : de la logique déterministe au raisonnement probabiliste, les applications natives IA exigent une toute nouvelle pensée architecturale
2. **Principes de conception** : embrasser l'incertitude, confiance progressive, transparence et explicabilité, collaboration humain-machine, dégradation gracieuse
3. **Le prompt est au cœur** : l'ingénierie de prompt est le « langage de programmation » des applications IA, déterminant directement la qualité du produit
4. **Révolution de l'interaction** : sortie en streaming, dialogue multi-tours, multimodal, mode Agent redéfinissent l'expérience utilisateur
5. **Pensée de bout en bout** : du prétraitement de l'entrée à la surveillance et aux alertes, chaque maillon doit être conçu spécifiquement pour les caractéristiques de l'IA

## Lectures complémentaires

- [Google PAIR Guidelines](https://pair.withgoogle.com/) - Guide de conception IA pour l'interaction humain-machine par Google
- [Guide d'ingénierie de prompt OpenAI](https://platform.openai.com/docs/guides/prompt-engineering) - Meilleures pratiques officielles d'ingénierie de prompt
- [Ingénierie de prompt Anthropic](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering) - Guide de conception de prompt pour Claude
- [Nielsen Norman Group: AI UX](https://www.nngroup.com/topic/artificial-intelligence/) - Recherche sur l'expérience utilisateur IA
- [Building LLM Applications](https://www.oreilly.com/library/view/building-llm-powered/9781835462317/) - Guide pratique pour construire des applications LLM