---
title: 'Ajouter des fonctions d’IA à un prototype'
description: 'Partez des prompts, de la documentation officielle et de la console du service pour ajouter du texte, de la vision, de l’image, de la voix et de la vidéo à un prototype web.'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'
import AiCapabilityGuide from '../../../zh-cn/stage-1/integrating-ai-capabilities/AiCapabilityGuide.vue'
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'

const duration = 'Environ <strong>1 à 2 jours</strong>'
const relatedArticles =
  relatedArticlesMap['fr-fr/stage-1/integrating-ai-capabilities'] ?? []
</script>

# Ajouter des fonctions d’IA à un prototype


## Présentation du chapitre

<ChapterIntroduction :duration="duration" :tags="['Prompts', 'Documentation d’API', 'Console de service', 'Multimodal']" coreOutput="Ajouter une ou deux véritables fonctions d’IA au prototype" expectedOutput="Un prototype web capable d’appeler un service de texte, d’image, de voix ou de vidéo">

Le prototype du chapitre précédent permet déjà de vérifier la structure des pages et le parcours d’utilisation, mais ses résultats viennent encore de données simulées. Dans ce chapitre, nous relions l’une de ses actions principales à un véritable service d’IA.

Intégrer l’IA ne consiste pas simplement à copier du code d’API. Il faut traiter trois sujets ensemble : **décrire correctement la tâche, lire la documentation officielle et placer l’appel de manière sûre dans le parcours produit.**

Nous commencerons par une méthode commune, puis nous aborderons le texte, la compréhension et la génération d’images, la voix et la vidéo. Les noms de modèles et les écrans des consoles évoluent. Les exemples servent donc à comprendre la structure ; pour une intégration réelle, copiez l’identifiant du modèle et les paramètres depuis la documentation actuelle du service.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Définir la tâche', description: 'Préparer le prompt métier' },
      { title: 'Lire la documentation', description: 'Trouver l’API et ses paramètres' },
      { title: 'Réaliser l’intégration', description: 'Faire un appel sécurisé' },
      { title: 'Étendre les modalités', description: 'Image, voix et vidéo' }
    ]" />
  </ClientOnly>
</div>

## 1. Choisir la fonction à connecter

L’atelier de contenu e-commerce du chapitre précédent possède déjà des informations produit et un bouton « Générer le texte ». Le résultat est encore simulé : nous allons d’abord faire fonctionner ce bouton pour de vrai.

Le parcours est simple. La personne saisit le nom du produit, sa matière et ses atouts, clique sur le bouton et reçoit un texte commercial. L’entrée et la sortie étant du texte, il nous faut un modèle de génération de texte.

Une autre fonction demanderait une autre capacité. Par exemple :

- reconnaître la couleur et le style d’une photo nécessite la compréhension d’images ;
- créer une affiche à partir des données produit nécessite la génération d’images ;
- transformer un enregistrement en compte rendu exige d’abord une transcription, puis un modèle de texte pour l’organiser ;
- transformer un article en audio nécessite la synthèse vocale ;
- animer une photo produit nécessite la génération vidéo à partir d’une image.

Avant de choisir un service, regardez de nouveau la page : que fournit la personne et que veut-elle voir à la fin ? Ces deux réponses permettent généralement de choisir entre texte, image, voix et vidéo.

<AiCapabilityGuide />

### 1.1 Une fonction peut comporter plusieurs étapes

Toutes les fonctions ne tiennent pas dans un modèle et une seule requête. « Importer une photo et produire des arguments » exige d’abord de comprendre le produit, puis de rédiger à partir du résultat. « Répondre à partir des documents de l’entreprise » exige aussi de trouver le passage pertinent avant de construire la réponse.

Ne partez pas du nom des modèles. Suivez les actions : quelle étape comprend un contenu existant, laquelle en crée un nouveau, laquelle ne fait que chercher des informations ? En cas de besoin, enchaînez deux ou trois capacités.

L’IA ne prend en charge que les étapes qui lui conviennent. La connexion, le paiement, l’enregistrement de fichiers et la navigation suivent des règles explicites et restent du ressort du programme classique.

![Page réelle où l’image du produit est comprise avant de générer sa description](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-35-41.webp)

*Dans ce prototype, la page identifie d’abord le produit. La personne valide les informations avant de générer une description et des arguments encore modifiables.*

### 1.2 Ce qu’il faut chercher dans la console

Après avoir choisi la génération de texte, ouvrez une plateforme telle que DeepSeek, SiliconFlow, Volcengine Ark ou MiniMax. La plateforme fournit le compte, la facturation et le point d’accès ; le modèle sélectionné traite la requête.

Pour la première intégration, ne parcourez pas tous les menus. Trouvez simplement :

1. une **API Key** permettant à l’application d’appeler le service ;
2. le **Model ID** à utiliser ;
3. l’exemple curl ou JavaScript minimal de la documentation officielle ;
4. le quota, le prix et les limites d’appel.

L’application envoie les données produit au modèle par une **API**. Un **SDK** JavaScript ou Python peut également être utilisé : il enveloppe simplement le code de la requête. La phrase « rédige un titre et des arguments à partir de ces données » dans la requête est le prompt envoyé au modèle.

Le nom de la plateforme, le Model ID et l’adresse de l’API sont trois choses différentes. Utilisez l’adresse et l’identifiant de l’exemple officiel, pas l’URL de la démonstration en ligne.

### 1.3 Remettre à plus tard les API encore inutiles

La console peut aussi afficher Embedding, Rerank, Function Calling, OCR et modération. Embedding et Rerank servent aux bases de connaissances, OCR à lire des PDF ou des reçus, Function Calling à utiliser une recherche ou une base de données.

Il n’est pas nécessaire de tout apprendre maintenant. Connectez une API directement utile à la page, puis revenez à la bonne documentation lorsque le produit aura un nouveau besoin.

## 2. Tester d’abord le résultat

Avant d’écrire du code, essayez le modèle dans l’espace de test de la plateforme. Nous ne vérifions pas seulement qu’il « sait rédiger », mais qu’il renvoie le format dont la page a besoin.

### 2.1 La personne exprime simplement son besoin

Dans l’espace de test, saisissez une demande comme le ferait une vraie personne :

```text
Je veux publier un sac à dos léger pour les trajets quotidiens,
en nylon noir et destiné à un usage journalier.
Rédige un titre court et trois arguments de vente.
```

Une fois la page construite, la personne n’aura peut-être même plus à composer ce paragraphe. Elle remplira le nom, la matière et la couleur puis cliquera. Le programme ajoutera les règles fixes : ne pas inventer de prix ni de ventes, garder un titre court et respecter un format donné.

Si la page affiche séparément titre, résumé et arguments, le programme peut demander les champs JSON `title`, `summary` et `selling_points`. La saisie reste naturelle tandis que la page lit le résultat de façon stable.

Essayez plusieurs produits et omettez volontairement un champ pour voir si le modèle invente l’information. Si le format varie, corrigez les consignes fixes du programme au lieu d’imposer aux personnes d’apprendre à rédiger des prompts.

### 2.2 Relier l’API à la page

La documentation fournit généralement un exemple curl, JavaScript ou Python. Donnez cet exemple à l’IDE avec IA en décrivant la fonction souhaitée.

```text
Ajoute un bouton « Générer le texte » à la page du produit.

Au clic, envoie les informations du produit à l’API ci-dessous,
puis affiche le texte généré dans la page.

Ne place pas l’API Key dans le navigateur. Affiche aussi l’attente et les erreurs.
Une fois terminé, indique la configuration nécessaire et comment lancer et tester la page.

Exemple officiel de l’API :
<coller un exemple curl ou SDK sans véritable clé>
```

Avec l’emplacement de la page et l’exemple officiel, l’IDE ne devine pas le format de l’API. Vérifiez d’abord qu’une requête répond correctement. Pour l’image, la voix ou la vidéo, remplacez ensuite la description et l’exemple.

## 3. Envoyer la première requête depuis l’exemple officiel

Après le test du prompt, ouvrez Quick Start ou API Reference. La première requête demande seulement quatre informations : l’adresse, la place de l’API Key, la valeur de `model` et l’exemple minimal.

Copiez l’exemple officiel curl, JavaScript ou Python et ne changez que le Model ID et le contenu de test. Obtenez une réponse normale dans le terminal avant d’intégrer le code au projet. En cas d’échec dans la page, vous saurez au moins que le compte, la clé et le modèle fonctionnent.

Examinez aussi la réponse. Le texte se trouve souvent dans un champ JSON, une image peut renvoyer une URL, l’audio des données binaires, et la vidéo commence souvent par un identifiant de tâche. La page doit suivre la réponse réelle.

### 3.1 Se faire aider par l’IA pour lire une longue documentation

Il n’est pas nécessaire de tout lire. Donnez à l’IDE le lien consulté et demandez-lui uniquement les éléments de la première requête.

```text
Lis cette documentation d’API : <lien>

Je veux l’appeler en JavaScript. Donne-moi l’exemple le plus simple,
l’emplacement de l’API Key et de model, et la façon de lire le résultat.
Utilise uniquement les paramètres documentés sur cette page.
```

## 4. Première visite de la console

La création des clés, le choix du modèle et la consultation de l’usage se font généralement dans la console. Les noms de menus changent, mais le travail reste similaire.

### 4.1 Créer la clé et confirmer l’arrivée de la requête

L’API Key est l’identifiant utilisé par l’application. Stockez-la dans une variable d’environnement locale ; ne la placez ni dans une capture, ni dans une conversation, ni dans le code du navigateur. En cas de fuite possible, révoquez-la et créez-en une autre.

Après la première requête, ouvrez Usage ou Billing et cherchez un nouvel enregistrement. Vous y trouverez aussi le solde et le quota. En cas d’échec, distinguez un code qui n’envoie rien, un refus de la plateforme et un compte sans quota.

![Page Usage de DeepSeek montrant le solde, les dépenses mensuelles et la tendance des appels](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-13-57-41.webp)

*La page Usage de DeepSeek affiche le volume, le coût et le solde.*

Conservez le Request ID ou Trace ID présent dans une erreur. Il permet de retrouver la requête précise parmi de nombreux appels simultanés.

### 4.2 Choisir un modèle et copier son nom exact

Le catalogue indique les modèles de texte, d’image, de voix et de vidéo actuellement disponibles. Ouvrez le détail et copiez le Model ID utilisé dans le code ; il peut différer du nom affiché.

![Catalogue SiliconFlow filtrable par texte, image, vidéo et voix](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-05-04.webp)

*Le catalogue SiliconFlow permet de filtrer les capacités.*

Certaines plateformes demandent de choisir une Region ou de créer un Deployment avant de fournir Base URL et Endpoint. Suivez alors le guide rapide et ne prenez pas l’URL de la console pour celle de l’API.

![Accès rapide Volcengine Ark présentant l’API Key et les étapes de test](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-23-13-01.webp)

*Volcengine Ark réunit création de clé, choix du modèle et exemple exécutable.*

### 4.3 Limites d’usage et tâches longues

RPM et TPM désignent le nombre de requêtes et de tokens autorisés par minute. L’image, la voix et la vidéo peuvent aussi limiter la Concurrency, soit le nombre de travaux simultanés. Un dépassement renvoie généralement `429` : attendez avant de réessayer au lieu de cliquer sans cesse.

Une tâche longue comme la vidéo renvoie d’abord un Task ID. Le programme interroge sa progression ou utilise un Callback/Webhook pour prévenir le serveur. Le File ID ou l’URL temporaire peuvent expirer ; avant la mise en ligne, décidez si le fichier doit être copié dans votre propre stockage.

La documentation présente aussi `max_tokens`, `temperature` et `stream`. Gardez les valeurs officielles dans la première version. Changez `max_tokens` si la sortie est coupée et activez `stream` pour un affichage progressif. Ne modifiez pas tout en même temps.

## 5. Intégrer l’exemple officiel à la page

Quand l’exemple du terminal fonctionne, procédez dans cet ordre :

1. placez la clé dans `.env.local` ou un fichier exclu de Git ;
2. appelez le modèle depuis un serveur ou une Serverless Function ;
3. faites appeler votre route `/api/...` par la page, sans clé tierce dans le navigateur ;
4. ajoutez au bouton les états attente, réussite et échec ;
5. vérifiez l’appel réel dans Usage.

```text
Page du navigateur
    │ envoie seulement les données métier
    ▼
Votre route /api ── lit l’API Key dans l’environnement serveur
    │
    ▼
Service d’IA ── renvoie texte, JSON, fichier ou task_id
```

::: warning Protéger l’API Key
N’écrivez pas une API Key dans du code Vue, React ou HTML exécuté par le navigateur. Même préfixée par `VITE_` ou `NEXT_PUBLIC_`, elle peut se retrouver dans les fichiers publics. En production, appelez le modèle depuis un backend, une Serverless Function ou une passerelle protégée.
:::

### 5.1 Certaines API ne répondent pas immédiatement

Un texte court, la compréhension d’image et une transcription courte répondent souvent en une requête. Une conversation ou la voix en direct peuvent arriver en streaming et s’afficher progressivement.

La génération d’images et de vidéos est souvent asynchrone : la première requête ne renvoie que `task_id`, puis il faut consulter l’état en attente, en traitement, réussi ou échoué. Cela peut prendre des dizaines de secondes ; la page ne doit pas rester sur un chargement immobile.

## 6. Commencer par la génération de texte

La [documentation de l’API DeepSeek](https://api-docs.deepseek.com/) propose une interface compatible avec des SDK courants. Les modèles évoluent : copiez l’identifiant actuel depuis la [liste des modèles](https://api-docs.deepseek.com/api/list-models).

Envoyez d’abord une requête curl avec les mêmes données produit que dans l’espace de test.

```bash
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DEEPSEEK_API_KEY}" \
  -d '{
    "model": "deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "Renvoyez un JSON avec title, summary et selling_points. selling_points contient trois éléments. N’inventez ni prix, ni ventes, ni effets."},
      {"role": "user", "content": "Je veux publier un sac à dos de trajet en nylon noir. Rédigez un titre court, une introduction et trois arguments."}
    ],
    "stream": false
  }'
```

Configurez la clé dans une variable d’environnement et lancez la commande. Lorsqu’elle fonctionne, donnez le même exemple et le prompt de la section 2 à l’IDE. Gardez un bouton et un produit fixe dans la première version, puis reliez le formulaire complet.

### Tester avec deux produits

Changez le nom, la matière et la couleur. Si chaque résultat correspond à sa saisie et s’affiche correctement, l’intégration minimale fonctionne. Supprimez ensuite un champ pour vérifier que le modèle n’invente pas de prix, d’effet ou de ventes. Une mauvaise clé temporaire permet aussi de tester l’erreur.

Enfin, vérifiez les appels dans Usage. Un texte visible ne prouve pas qu’il vient de l’API : d’anciennes données simulées peuvent donner le même résultat.

## 7. Comprendre les images avec Qwen3-VL

Un modèle visuel reçoit une image et une question. Demandez les informations utiles à la page ; « que contient cette image ? » produit souvent une description trop générale.

```text
Observe cette photo de produit. Indique l’objet, sa couleur principale,
les matières et les détails visibles, ainsi que le texte présent dans l’image.

Signale ce qui est illisible. N’invente ni marque, ni prix, ni ventes.
Rends le résultat en JSON pour que je puisse l’afficher dans la page.
```

Le [catalogue SiliconFlow](https://cloud.siliconflow.cn/models) permet de filtrer les modèles visuels actuels. Nous utilisons `Qwen/Qwen3-VL-8B-Instruct` pour montrer la structure ; confirmez le Model ID avant l’exécution.

```python
import base64
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SILICONFLOW_API_KEY"],
    base_url="https://api.siliconflow.cn/v1"
)

with open("product.jpg", "rb") as image_file:
    image_data = base64.b64encode(image_file.read()).decode("utf-8")

response = client.chat.completions.create(
    model="Qwen/Qwen3-VL-8B-Instruct",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Renvoyez en JSON la catégorie, la couleur, les matières et la structure visibles, ainsi que le texte de l’image. N’inventez rien d’illisible."},
            {"type": "image_url", "image_url": {
                "url": f"data:image/jpeg;base64,{image_data}"
            }}
        ]
    }]
)
```

![Connexion d’une API de compréhension d’image dans l’IDE](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-34-36.webp)

*Faire valider les informations reconnues avant de générer le texte final aide à repérer les erreurs.*

## 8. Générer et modifier des images produit

[Seedream](https://seed.bytedance.com/en/blog/deeper-thinking-more-accurate-generation-introducing-seedream-5-0-lite) génère une image depuis du texte ou modifie une référence. Pour un produit, il faut éviter une belle image où l’objet lui-même a changé : précisez donc les éléments à conserver.

```text
Transforme le sac à dos noir de l’image de référence en affiche verticale.
Place-le au centre d’une surface gris clair, avec une lumière douce et de l’espace pour un titre.
N’ajoute ni texte, ni logo, ni prix et ne change pas les fermetures, les bretelles ou les poches.
```

Après la première génération, examinez d’abord les déformations du produit, puis le fond et la composition. N’accumulez pas de nombreux mots de style dès le départ.

Copiez le Model ID et la requête minimale actuels dans la [console Volcengine Ark](https://www.volcengine.com/experience/ark?launch=seedream). Ne conservez pas indéfiniment un numéro de version trouvé dans un tutoriel.

```bash
curl -X POST https://ark.cn-beijing.volces.com/api/v3/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ARK_API_KEY}" \
  -d '{
    "model": "<copiez le Model ID actuel depuis la console>",
    "prompt": "Transformez le sac à dos noir de référence en affiche verticale sobre. N’ajoutez ni texte, ni logo, ni prix et ne changez pas sa structure.",
    "image": ["https://example.com/product-reference.png"],
    "response_format": "url",
    "stream": false,
    "watermark": false
  }'
```

![Résultat de la génération d’image intégrée au produit](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-23-21-13.webp)

Les URL d’images peuvent expirer. Un prototype peut les afficher directement ; un produit doit décider, selon les conditions du service, de les copier dans son stockage et enregistrer prompt, version du modèle et date.

## 9. Reconnaissance et synthèse vocales sont deux API

- **ASR / STT** transforme la voix ou un fichier audio en texte.
- **TTS** transforme un texte en voix écoutable.

Entrées, sorties et interactions diffèrent. Ne les regroupez pas derrière un bouton vague « API vocale ».

### 9.1 De la voix au texte : importer un fichier et recevoir la transcription

La [documentation de transcription SiliconFlow](https://docs.siliconflow.cn/cn/api-reference/audio/create-audio-transcriptions) importe le fichier en `multipart/form-data`, et non en JSON.

```bash
curl --request POST \
  --url https://api.siliconflow.cn/v1/audio/transcriptions \
  -H "Authorization: Bearer ${SILICONFLOW_API_KEY}" \
  -F "file=@meeting.mp3" \
  -F "model=FunAudioLLM/SenseVoiceSmall"
```

```text
Ajoute un bouton « Importer et transcrire » à la page actuelle.

Après l’import d’un fichier mp3, m4a ou wav, appelle l’API ci-dessous depuis le serveur
et place le texte renvoyé dans un champ modifiable.
Conserve l’API Key dans une variable d’environnement et permets de réessayer après une erreur.

Exemple officiel :
<coller l’exemple curl ci-dessus>
```

### 9.2 La synthèse vocale peut renvoyer de l’audio plutôt que du JSON

La [documentation MiniMax T2A HTTP](https://platform.minimax.io/docs/api-reference/speech-t2a-http) fournit une synthèse synchrone. L’exemple actuel utilise `speech-2.8-hd` ; vérifiez le modèle et la voix sur la plateforme.

Préparez nombres, sigles et pauses pour l’oral avant de choisir voix, vitesse, volume, émotion et format. N’envoyez pas une page entière contenant Markdown, URL et libellés de boutons.

```bash
curl --request POST \
  --url https://api.minimax.io/v1/t2a_v2 \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "speech-2.8-hd",
    "text": "Voici un extrait audio de la présentation du produit.",
    "stream": false,
    "output_format": "hex",
    "language_boost": "auto",
    "voice_setting": {
      "voice_id": "<copiez voice_id depuis la liste des voix>",
      "speed": 1,
      "vol": 1,
      "pitch": 0
    },
    "audio_setting": {
      "sample_rate": 32000,
      "bitrate": 128000,
      "format": "mp3",
      "channel": 1
    }
  }'
```

Une page audio a aussi besoin de lecture, arrêt, nouvelle génération et téléchargement. Le TTS en streaming passe par WebSocket ou HTTP en streaming et joue les fragments à leur arrivée.

::: warning Voix et vie privée
Avant l’envoi d’un enregistrement, expliquez son usage, sa durée de conservation et sa suppression. Le clonage vocal exige l’accord explicite du propriétaire de la voix. N’utilisez pas d’enregistrement d’autrui ou d’une personnalité sans provenance claire.
:::

## 10. Génération vidéo : créer une tâche puis attendre

La vidéo utilise généralement une API asynchrone. Le [guide MiniMax](https://platform.minimax.io/docs/guides/video-generation) décrit trois étapes : créer une tâche et recevoir `task_id`, interroger son état pour obtenir `file_id`, puis demander l’adresse de téléchargement.

### 10.1 Décrire aussi l’évolution de la scène

Un prompt vidéo doit préciser la position initiale, l’ordre du mouvement, la caméra et la durée.

```text
Montre ce sac à dos noir pendant six secondes sur un présentoir gris clair.
La caméra passe lentement de face vers la droite, puis se rapproche légèrement.
Garde un format vertical. Ne change pas le sac et n’ajoute ni personne, ni texte, ni logo.
```

S’il y a beaucoup d’actions, commencez par un plan et un mouvement principal. Tourner, ouvrir, zoomer et changer de scène à la fois rend la forme du produit plus difficile à conserver.

### 10.2 Création et consultation sont deux requêtes

```bash
# Étape 1 : créer la tâche
curl --request POST \
  --url https://api.minimax.io/v1/video_generation \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "MiniMax-Hailuo-2.3",
    "prompt": "Montrez un sac à dos noir sur un présentoir gris clair. La caméra passe de face vers la droite puis se rapproche. Ne changez pas le sac et n’ajoutez ni personne, ni texte, ni logo.",
    "duration": 6,
    "resolution": "1080P"
  }'

# Étape 2 : consulter avec le task_id renvoyé
curl --request GET \
  --url "https://api.minimax.io/v1/query/video_generation?task_id=<TASK_ID>" \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}"
```

La page doit afficher `Preparing`, `Queueing`, `Processing`, `Success` et `Fail`. Définissez l’intervalle et l’arrêt. En production, `callback_url` permet à la plateforme de prévenir le serveur.

::: warning Vidéo et ressources de personnes réelles
Pour des photos ou voix de personnes, des marques ou des œuvres protégées, confirmez les autorisations et les règles de la plateforme. Certains services demandent une vérification du visage, un enregistrement des ressources ou une modération ; ces étapes ne doivent pas être contournées dans le navigateur.
:::

## 11. Diagnostiquer les problèmes courants

| Symptôme | Première vérification |
| --- | --- |
| `401 / 403` | Clé, autorisations et en-tête d’authentification |
| `404` | Base URL, Endpoint et Model ID actuels |
| `429` | RPM, TPM, concurrence et niveau du compte |
| `400` | Paramètres requis, format, JSON et taille |
| `5xx / timeout` | État du service, délai et stratégie de reprise |
| Toujours en attente | Concurrence, interrogation, quota et charge |
| Réussite sans contenu | Chemin du champ, binaire et URL temporaire expirée |
| Fonctionne en local, échoue en ligne | Variables, CORS, délai Serverless et réseau régional |

Conservez l’heure, le type de requête, le statut HTTP et le Request ID ou Trace ID. N’écrivez pas dans les journaux l’API Key, un enregistrement complet ou des données métier sensibles.

## 12. 📚 Exercice du chapitre

<StageAssignmentCard title="Ajouter une fonction d’IA à votre prototype">

  <p>Choisissez un bouton qui a réellement besoin d’IA. Une seule capacité suffit à la première version ; texte, image, voix et vidéo ne doivent pas être intégrés ensemble.</p>

  <ol>
    <li>Trouvez le Model ID actuel et l’exemple minimal dans la documentation officielle.</li>
    <li>Donnez l’exemple à l’IDE avec IA et reliez-le au bouton.</li>
    <li>Placez l’API Key dans une variable serveur et ajoutez attente et erreur.</li>
    <li>Effectuez un véritable appel puis confirmez son arrivée dans Usage ou les journaux.</li>
  </ol>

  <p>Conservez une capture et expliquez en une phrase ce que l’IA apporte à la personne sur cette page. Vérifiez les autorisations avant d’utiliser l’image, la voix ou le contenu d’une autre personne.</p>
</StageAssignmentCard>

## Étape suivante

Le prochain chapitre replace ces capacités dans un parcours produit complet. Nous ajouterons données, états et retours pour transformer un appel isolé en prototype utilisable de façon répétée.

<RelatedArticlesSection
  title="Articles associés"
  description="Passez d’une fonction d’IA à un parcours produit complet."
  :items="relatedArticles"
/>
