---
title: 'Projet complet : de l’idée à une création aboutie'
description: 'Utilisez votre prototype avec IA du début à la fin, faites-le essayer par une autre personne et corrigez les problèmes observés.'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
import ProductFinishMap from '../../../zh-cn/stage-1/complete-project-practice/ProductFinishMap.vue'
import StageOneCompletion from '../../../zh-cn/stage-1/complete-project-practice/StageOneCompletion.vue'

const duration = 'Environ <strong>2 à 3 jours</strong>'
const relatedArticles =
  relatedArticlesMap['fr-fr/stage-1/complete-project-practice'] ?? []
</script>

# Projet complet : de l’idée à une création aboutie

<ProductJourney current="finish" />

## Ce que nous allons faire

<ChapterIntroduction :duration="duration" :tags="['Parcours complet', 'Expérience produit', 'Test utilisateur', 'Présentation']" coreOutput="Un produit IA qu’une autre personne peut utiliser sans aide" expectedOutput="Une application web testée puis améliorée avec un véritable utilisateur">

Dans les chapitres précédents, nous sommes partis d’une idée, avons construit un prototype interactif, puis fait fonctionner la capacité IA de la page.

Vous savez déjà quoi saisir et où cliquer. Une personne qui ouvre la page pour la première fois risque de ne pas trouver la première étape. Si aucun résultat n’apparaît immédiatement après un clic, elle peut même penser que la page est en panne.

Nous n’ajouterons pas de nouvelle fonction dans ce chapitre. Nous utiliserons le produit du début à la fin, corrigerons les endroits où l’on peut rester bloqué, puis le confierons à une autre personne. Vous obtiendrez enfin une création que vous pourrez partager sereinement.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'L’utiliser soi-même', description: 'Aller du début au résultat' },
      { title: 'Corriger les blocages', description: 'Attente, résultat et échec' },
      { title: 'Le faire essayer', description: 'Observer avant d’aider' },
      { title: 'Préparer et partager', description: 'Rendre la création compréhensible' }
    ]" />
  </ClientOnly>
</div>

<ProductFinishMap />

## 1. Utilisez le produit du début à la fin

Ne vous précipitez pas sur la connexion, le travail en équipe ou les tableaux de données. Ouvrez le produit actuel et utilisez-le comme le ferait un nouvel utilisateur, de la première page jusqu’au résultat. Toute étape qui exige encore votre explication doit être améliorée.

Dans notre espace de création de contenus e-commerce, un parcours complet ressemble à ceci :

> Une personne chargée des opérations ajoute une image de produit, complète les informations nécessaires, génère un premier brouillon illustré, vérifie le résultat, puis le copie ou l’enregistre pour le modifier et le publier.

Il suffit pour l’instant de réussir ce petit parcours. Connexion, droits d’équipe et publication officielle pourront attendre un besoin réel.

### 1.1 Suivez l’ordre réel des actions

Oubliez un instant le code et les composants. Suivez les actions de l’utilisateur :

1. Ouvrir la page et comprendre ce que l’outil peut faire.
2. Ajouter une image et renseigner les données nécessaires, comme le nom et la matière.
3. Cliquer sur « Générer le texte » et voir que la page traite la demande.
4. Vérifier le titre et les arguments proposés par l’IA, puis modifier ou régénérer si nécessaire.
5. Copier, télécharger ou enregistrer temporairement le résultat et terminer la tâche.

À la fin, demandez-vous : la personne avancerait-elle si je n’étais pas à côté ? Notez la gestion d’équipe et les tableaux complexes, mais ne les construisez pas maintenant s’ils ne servent pas ce parcours.

::: tip Quelle taille donner à cette version ?
Si vous pouvez expliquer la tâche en une phrase et que l’autre personne commence en quelques minutes, le périmètre est généralement correct.
:::

### 1.2 Recommencez avec une page vide

Après un temps de développement, la page conserve souvent des données de test et un ancien résultat. On oublie alors ce qu’un nouvel utilisateur découvre réellement. Ouvrez une fenêtre privée ou effacez les données locales et recommencez.

Testez seulement trois situations :

1. **Ouvrir à vide :** cliquez sans rien saisir et vérifiez que la page indique les informations manquantes.
2. **Générer normalement :** ajoutez une image, lancez la génération et vérifiez l’attente ainsi que la prochaine action après le résultat.
3. **Provoquer un échec :** ajoutez un fichier non accepté ou faites échouer la requête ; les données doivent rester et un nouvel essai doit être possible.

Notez les blocages. Nous les corrigerons dans la section suivante.

Un IDE avec IA peut inspecter le code, mais il ne remplace pas la manipulation réelle :

```text
Ne modifie pas encore le code.

Examine le projet actuel selon cette tâche utilisateur :
ajouter une image de produit, renseigner les informations nécessaires,
générer le texte, vérifier le résultat, puis le copier ou l’enregistrer.

Indique les pages et fichiers concernés
ainsi que les endroits où ce parcours pourrait s’interrompre.
```

L’IDE peut repérer du code suspect. Vous devez encore utiliser la page vous-même pour savoir si elle est claire.

## 2. Corrigez les endroits où l’on se bloque facilement

Après un parcours complet, les problèmes apparaissent souvent à quatre moments : à l’ouverture, pendant l’attente de l’IA, après le résultat et lors d’un échec. Une conception complexe n’est pas nécessaire. La personne doit simplement comprendre ce qui se passe et ce qu’elle peut faire ensuite.

### 2.1 La première action est-elle claire ?

Une page vide ne devrait pas contenir uniquement un champ. Ajoutez une courte explication, un exemple ou une indication sur les formats et tailles d’image acceptés près de la zone d’envoi.

Si le formulaire comporte beaucoup de champs, gardez ceux dont le résultat a vraiment besoin. Nom, image et caractéristiques principales peuvent être obligatoires ; marque, lien et réglages fins peuvent aller dans « Plus d’options ». Une première utilisation ne doit pas commencer par un long formulaire.

### 2.2 La page réagit-elle après le clic ?

Une requête IA peut durer plusieurs secondes. Après le clic, le bouton doit afficher « Génération » et empêcher momentanément les envois répétés. Les informations saisies ne doivent pas disparaître, ni la page sauter vers un résultat vide.

![État d’attente pendant la génération du contenu](../../../zh-cn/stage-1/building-prototype/images/index-2026-01-14-15-50-05.png)

*Une animation complexe est inutile. Montrer que le travail a commencé tout en conservant les saisies et la position de la page évite déjà la plupart des confusions.*

Si une image ou une vidéo passe par une file, vous pouvez afficher « En attente » puis « Génération ». N’inventez pas de pourcentage précis si l’API ne fournit pas réellement la progression.

### 2.3 Que peut-on faire après le résultat ?

La réponse de l’IA n’est pas la fin du parcours. Il faut souvent vérifier les faits, corriger les mots et emporter le résultat dans l’étape suivante. La zone de résultat doit proposer au moins une action : modifier, copier, télécharger ou régénérer.

![Page de résultat après connexion de la compréhension d’image et de la génération](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-35-41.png)

*L’image envoyée reste visible au-dessus du résultat. La personne peut comparer le texte à l’original au lieu d’accepter une seule réponse du modèle.*

Si le modèle ne peut pas confirmer une information, signalez-la pour qu’elle soit complétée ou supprimée. Cela correspond mieux au travail réel qu’un paragraphe présenté comme une « réponse finale ».

### 2.4 Peut-on continuer après un échec ?

Une coupure réseau, une limite atteinte ou un fichier non accepté peuvent faire échouer la requête. N’affichez pas forcément tout le message technique, mais précisez que l’opération n’a pas abouti et permettez de réessayer ou de modifier les données.

Par exemple :

- **Format non accepté :** listez les formats disponibles et permettez de choisir un autre fichier.
- **Information obligatoire manquante :** placez le message près du champ, pas seulement « Paramètres invalides ».
- **Service IA temporairement indisponible :** conservez les données et proposez « Générer à nouveau ».
- **Résultat insatisfaisant :** laissez modifier les données et recommencer sans repartir de zéro.

Si une actualisation ferait perdre un long formulaire, utilisez LocalStorage pour garder temporairement le brouillon. Enregistrez uniquement les données ordinaires nécessaires à la reprise ; jamais de clé API, de vraies données client ou de fichier sensible dans le navigateur.

Transmettez les problèmes à l’IDE dans une demande ciblée :

```text
Vérifie le parcours « ajouter une image et générer du texte »
à quatre moments : début, attente, réussite et échec.

Corrige d’abord les problèmes qui empêchent de continuer :
- les champs obligatoires n’ont pas de message clair ;
- le bouton peut être cliqué plusieurs fois pendant la requête ;
- un échec efface les informations ;
- le résultat ne permet ni modification, ni copie, ni nouvelle génération.

Avant toute modification, indique les fichiers concernés.
Après la modification, donne une procédure de test manuel.
```

## 3. Faites essayer le produit par une autre personne

À force de regarder sa propre page, toutes les actions paraissent évidentes. Une personne extérieure au développement trouve souvent en quelques minutes ce que nous n’avions jamais remarqué.

Choisissez si possible une personne susceptible d’utiliser l’outil. Pour ce produit, quelqu’un ayant géré une boutique ou préparé des fiches produits convient bien. Sinon, un ami qui n’a jamais vu la page fera déjà un bon test.

### 3.1 Donnez seulement l’objectif

Au début du test, expliquez uniquement la tâche :

> Utilise cet outil pour générer un titre et des arguments à partir de cette image. Vérifie le contenu, puis copie la version que tu continuerais à modifier.

Observez avant de dire où cliquer. Notez les pauses, les retours, les clics répétés et les questions. Une explication immédiate masque un problème que la page devrait résoudre.

Une ou deux personnes suffisent déjà à révéler des difficultés évidentes. Aucun rapport formel n’est nécessaire : notez simplement où elles se sont arrêtées.

Si elles ne bougent pas après l’ouverture, ajoutez une phrase d’explication. Si elles cliquent plusieurs fois sur « Générer », clarifiez l’attente. Si elles hésitent après le résultat, ajoutez modification ou copie. Si elles doivent tout ressaisir après une erreur, conservez le contenu et proposez de réessayer.

### 3.2 Discutez après l’utilisation

Une fois la tâche terminée ou abandonnée, posez ces questions :

1. Quelle étape a été la plus incertaine ?
2. Quelles parties du résultat seraient utilisées directement, et lesquelles seraient toujours modifiées ?
3. Pour la même tâche, utiliseriez-vous à nouveau cet outil ? Pourquoi ?

Ne demandez pas uniquement « Était-ce facile ? ». Un « c’était bien » poli guide peu les changements. Les gestes et exemples précis sont plus utiles.

::: warning Lorsque vous utilisez de vrais contenus
Les images, enregistrements ou documents du testeur peuvent contenir des informations professionnelles. Expliquez vers quel type de service IA ils partent, évitez les données client non autorisées et supprimez les fichiers devenus inutiles après le test.
:::

## 4. Corrigez le blocage, puis recommencez

Le test peut produire une longue liste de problèmes. Ne les corrigez pas tous. Commencez par ce qui empêche d’achever la tâche ou rend le résultat peu fiable.

Suivez cet ordre :

1. **Tâche impossible à terminer :** bouton inactif, requête en échec ou résultat impossible à récupérer.
2. **Résultat peu fiable :** informations inventées, impossibles à vérifier ou sources nécessaires absentes.
3. **Action facile à mal comprendre :** point de départ ou état actuel peu clair.
4. **Effort trop important :** étapes répétées, données perdues ou attente sans retour.
5. **Style et nouvelles fonctions :** finition visuelle et souhaits qui ne bloquent pas la tâche centrale.

Choisissez un à trois points importants. Après les avoir corrigés, refaites le parcours. Si possible, invitez la même personne à revenir. Le changement est utile seulement si le blocage d’origine a disparu.

### 4.1 Donnez à l’IDE une observation précise

Ne dites pas seulement « optimise la page ». Décrivez ce que vous avez observé :

```text
Tâche : ajouter une image de produit et générer trois arguments.

Problème observé :
Deux testeurs ont cliqué plusieurs fois sur « Générer » parce que la page
n’indiquait pas clairement que la requête avait commencé.
Cela a créé des tâches en double.

Modifie la page actuelle :
1. Désactive le bouton au début et affiche « Génération ».
2. Rétablis-le après la réussite ou l’échec.
3. Conserve les informations déjà saisies.
4. Explique comment tester manuellement les clics répétés et l’échec.
```

Une demande précise limite les changements hors sujet et vous dit exactement quoi vérifier ensuite.

### 4.2 Reprenez le parcours depuis le début

Corriger un endroit peut en affecter un autre. Avant de partager, essayez quatre cas :

- une entrée normale avec toutes les informations ;
- un champ obligatoire vide ;
- une requête en échec ou expirée ;
- la modification, la copie ou la nouvelle génération après le résultat.

Si le produit conserve les brouillons, actualisez aussi la page. Vérifiez la nouvelle fonction et assurez-vous que le parcours d’origine n’est pas cassé.

## 5. Préparez la création pour le partage

La création ne fait plus que « fonctionner sur votre ordinateur ». Une autre personne l’a utilisée, et vous avez corrigé un problème réel. Préparez maintenant l’accès et l’explication pour la montrer plus largement.

### 5.1 Expliquez-la en une minute

Vous pouvez suivre cet ordre :

1. **Qui rencontre quel problème :** une personne chargée d’un site marchand doit sans cesse organiser images et arguments lors d’un premier brouillon.
2. **Comment le produit l’aide :** elle ajoute une image et quelques données et obtient un contenu qu’elle peut encore modifier.
3. **Quelles capacités IA sont utilisées :** compréhension d’image et génération de texte.
4. **Comment la tâche se termine :** ajouter, générer, vérifier, modifier et copier.
5. **Ce qui a changé après le test :** une attente visible et la conservation des données après un échec, par exemple.

Faites comprendre la création avant d’énumérer frameworks et modèles.

### 5.2 Préparez ce dont l’autre personne a besoin

Avant le partage, rassemblez trois éléments :

1. **Une application exécutable :** donnez un lien ; si elle n’est pas déployée, indiquez la commande de démarrage et l’adresse.
2. **Une vidéo de 30 à 60 secondes :** montrez une tâche complète de l’entrée au résultat, et non une succession rapide d’écrans.
3. **Une page de présentation :** utilisateur cible, problème, parcours, capacité IA, un retour réel et la modification réalisée.

Si l’accès distant est encore impossible, une exécution locale et une vidéo constituent déjà un résultat Stage 1. L’important est que quelqu’un comprenne la création et voie que le parcours central s’achève réellement.

### 5.3 Continuer cette création ou en commencer une autre ?

Vous pouvez poursuivre l’espace de contenus e-commerce ou appliquer la méthode aux comptes rendus de réunion, à l’audio, à l’apprentissage ou à un outil métier. Le [guide des scénarios IA](../appendix-industry-scenarios/index.md) vous aidera à explorer d’autres directions.

Ne changez pas de sujet uniquement pour paraître original. Un petit problème venu de vos études, de votre travail ou de votre vie, testé et corrigé avec une personne réelle, est plus convaincant qu’une page riche en fonctions que personne n’a utilisée.

### Avant l’envoi

Ouvrez une dernière fois le lien et faites tout le parcours. Vérifiez que quelqu’un d’autre peut l’ouvrir, que l’IA renvoie un résultat et qu’aucune clé API n’apparaît sur la page ou les captures. Si vous avez utilisé les images, sons ou documents d’autrui, vérifiez aussi l’autorisation.

## 6. 📚 Travail à rendre

<StageAssignmentCard title="Terminez et publiez votre création Stage 1">

  <p>N’ajoutez plus de fonction. Préparez la création actuelle et confiez-la réellement à une personne.</p>

  <ol>
    <li>
      <strong>L’utiliser une fois du début à la fin</strong>
      <ul>
        <li>Commencer par l’ouverture de la page et continuer jusqu’à obtenir, modifier ou enregistrer le résultat.</li>
      </ul>
    </li>
    <li>
      <strong>La faire essayer par une personne</strong>
      <ul>
        <li>Ne pas expliquer l’interface d’abord ; observer l’arrêt et corriger un problème.</li>
      </ul>
    </li>
    <li>
      <strong>Partager la création</strong>
      <ul>
        <li>Préparer un lien ou des instructions, une vidéo de 30 à 60 secondes et une courte présentation.</li>
      </ul>
    </li>
  </ol>

  <p>Stage 1 est réellement terminé lorsqu’une autre personne peut ouvrir la création et accomplir une utilisation sans aide.</p>
</StageAssignmentCard>

## Étape suivante

Vous avez maintenant suivi un parcours complet : partir d’un problème réel, limiter la première version, construire un prototype, connecter l’IA, puis améliorer le produit après l’essai d’un utilisateur.

Dans Stage 2, nous aborderons bases de données, comptes, paiements, déploiement et ingénierie frontend/backend plus complète. Ces outils permettront de servir davantage d’utilisateurs et de vraies données, mais le point de départ restera le même : terminer d’abord une tâche utile.

<RelatedArticlesSection
  title="Poursuivre l’apprentissage"
  description="Après Stage 1, continuez avec les contenus d’ingénierie ci-dessous."
  :items="relatedArticles"
/>

<StageOneCompletion />
