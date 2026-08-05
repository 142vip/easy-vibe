# Introduction : Ajustement fin et déploiement de modèles

::: tip Préface
**Les grands modèles sont puissants, mais ils ne comprennent pas votre métier.** GPT-4 peut écrire des poèmes et programmer, mais il ne connaît pas la terminologie produit de votre entreprise ni les normes professionnelles de votre secteur. Le fine-tuning (ajustement fin) est le processus qui permet à un grand modèle généraliste d'« apprendre » vos connaissances spécialisées — comme former un érudit généraliste à un poste spécifique pour en faire un expert de votre domaine.
:::

**Qu'allez-vous apprendre dans cet article ?**

Après avoir étudié ce chapitre, vous obtiendrez :

- **Connaissance du pipeline** : maîtriser le pipeline complet de fine-tuning, de la préparation des données à la mise en ligne du modèle
- **Ingénierie des données** : comprendre les exigences de format et les normes de qualité des données de fine-tuning
- **Fine-tuning efficace** : comprendre les principes et les avantages des techniques de fine-tuning à efficacité paramétrique comme LoRA
- **Compression de modèle** : maîtriser comment les techniques de quantification permettent aux grands modèles de fonctionner sur du matériel grand public
- **Pratiques de déploiement** : comprendre les architectures courantes de service de modèles et les stratégies de choix

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Pipeline de fine-tuning | Données → Entraînement → Évaluation → Déploiement |
| **Chapitre 2** | Données d'entraînement | Format des données, contrôle qualité |
| **Chapitre 3** | Fine-tuning LoRA | Adaptation à faible rang, efficacité paramétrique |
| **Chapitre 4** | Quantification de modèle | FP16, INT8, INT4 |
| **Chapitre 5** | Déploiement de modèle | Service d'inférence, passerelle API |

---

## 0. Vue d'ensemble : pourquoi le fine-tuning est-il nécessaire

L'entraînement des grands modèles de langage se divise en deux phases : **le pré-entraînement** et **le fine-tuning**. Le pré-entraînement consiste à apprendre les capacités linguistiques sur des données générales massives, le fine-tuning consiste à apprendre des compétences spécialisées sur des données de tâches spécifiques.

Pour faire une analogie : le pré-entraînement, c'est comme aller à l'université — apprendre des connaissances générales, savoir un peu de tout ; le fine-tuning, c'est comme la formation à l'embauche — apprendre des compétences professionnelles pour un poste spécifique.

::: tip Quand faut-il faire du fine-tuning ?
- **Format de sortie spécifique** : nécessité que le modèle produise toujours un format JSON fixe
- **Connaissances de domaine spécialisé** : terminologie et normes professionnelles dans les domaines médical, juridique, financier, etc.
- **Transfert de style linguistique** : faire répondre le modèle avec un ton et un style spécifiques (comme les scripts de service client)
- **Support de langues rares** : améliorer les performances du modèle sur une langue spécifique
- **Optimisation des coûts** : remplacer les appels à un grand modèle par un petit modèle fine-tuné pour réduire les coûts d'inférence
:::

---

## 1. Pipeline de fine-tuning : le parcours complet des données à la mise en ligne

Le fine-tuning n'est pas « jeter les données au modèle et c'est fini ». C'est un processus d'ingénierie rigoureux, où chaque étape influence le résultat final.

<FinetuningPipelineDemo />

::: tip Les cinq phases du fine-tuning
1. **Préparation des données** : collecter, nettoyer, annoter les données d'entraînement — l'étape la plus chronophage et la plus cruciale
2. **Sélection du modèle** : choisir le modèle de base approprié (Base Model), comme Llama 3, Qwen, Mistral
3. **Configuration de l'entraînement** : définir les hyperparamètres tels que le taux d'apprentissage, la taille de batch, le nombre d'époques
4. **Exécution de l'entraînement** : exécuter l'entraînement sur GPU, surveiller la courbe de loss et les métriques d'évaluation
5. **Évaluation et mise en ligne** : évaluer les performances sur l'ensemble de test, puis déployer comme service API après validation
:::

| Phase | Actions clés | Pièges courants |
|------|---------|---------|
| Préparation des données | Nettoyage, déduplication, formatage | Une mauvaise qualité de données fait « mal apprendre » le modèle |
| Sélection du modèle | Évaluer les capacités du modèle de base | Modèle trop grand impossible à entraîner, trop petit résultats médiocres |
| Configuration de l'entraînement | Ajuster les hyperparamètres | Taux d'apprentissage trop élevé causant un oubli catastrophique |
| Exécution de l'entraînement | Surveiller la loss et les métriques | Surapprentissage, non-convergence de l'entraînement |
| Évaluation et mise en ligne | A/B testing, déploiement progressif | Fuite de l'ensemble de test gonflant artificiellement l'évaluation |

---

## 2. Données d'entraînement : le plafond de verre du fine-tuning

Il y a un vieux dicton en fine-tuning : **« Garbage in, garbage out »**. La qualité des données d'entraînement détermine directement le plafond des résultats du fine-tuning. 100 exemples de haute qualité donnent souvent de meilleurs résultats que 10 000 exemples de mauvaise qualité.

<TrainingDataDemo />

::: tip Les trois formats courants de données de fine-tuning
1. **Format Instruction** : le format le plus utilisé, contenant trois champs : instruction (instruction), input (entrée), output (sortie attendue). Adapté pour entraîner le modèle à suivre des instructions.
2. **Format Chat (dialogue)** : sous forme de dialogue multi-tours, contenant une liste de messages avec les rôles system, user, assistant. Adapté pour entraîner des chatbots.
3. **Format Completion (complétion)** : simple paire prompt-completion, adapté pour la génération de texte, la complétion de code, etc.
:::

| Dimension de qualité | Description | Méthode de vérification |
|------------|------|---------|
| Exactitude | Les réponses doivent être correctes et sans erreur | Revue humaine, validation par expert |
| Cohérence | Style de réponse cohérent pour des questions similaires | Échantillonnage et comparaison |
| Diversité | Couvrir suffisamment de scénarios et de variantes | Statistiques sur la distribution des types de questions |
| Déduplication | Éviter les échantillons en double qui causent du surapprentissage | Déduplication textuelle, déduplication sémantique |
| Volume de données | Généralement 500 à 5000 exemples de haute qualité suffisent | Commencer par un petit volume, augmenter progressivement |

---

## 3. LoRA : obtenir 90 % des résultats avec 1 % des paramètres

Le fine-tuning complet (Full Fine-tuning) nécessite de mettre à jour tous les paramètres du modèle — pour un modèle de 70B de paramètres, cela signifie des centaines de Go de mémoire GPU et une puissance de calcul GPU massive. Pour la plupart des équipes, ce n'est pas réaliste.

LoRA (Low-Rank Adaptation) offre une solution élégante : **geler les paramètres du modèle original et n'entraîner qu'un petit ensemble de nouvelles matrices à faible rang**. Ces matrices ne représentent généralement que 0,1 % à 1 % des paramètres du modèle original, mais atteignent des résultats proches du fine-tuning complet.

<LoRADemo />

::: tip L'idée centrale de LoRA
La matrice de poids originale W du modèle est une matrice énorme (par exemple 4096x4096). LoRA ne modifie pas directement W, mais ajoute un « bypass » à côté : W' = W + BA, où B et A sont deux petites matrices (par exemple 4096x8 et 8x4096). Pendant l'entraînement, seuls B et A sont mis à jour, W reste inchangé.
- **Rang (Rank)** : plus la valeur r est grande, plus la capacité expressive est forte, mais plus le nombre de paramètres est élevé. Généralement r=8~64 suffit
- **Fusion pour le déploiement** : après l'entraînement, BA peut être fusionné dans W, sans surcoût à l'inférence
:::

| Méthode de fine-tuning | Paramètres entraînables | Besoin en mémoire GPU | Vitesse d'entraînement | Résultat |
|---------|-----------|---------|---------|------|
| Fine-tuning complet | 100 % | Très élevé | Lent | Meilleur |
| LoRA | 0,1 %~1 % | Faible | Rapide | Proche du complet |
| QLoRA | 0,1 %~1 % | Encore plus faible | Moyen | Légèrement inférieur à LoRA |
| Prompt Tuning | < 0,01 % | Très faible | Très rapide | Limité |

---

## 4. Quantification de modèle : faire maigrir les grands modèles

Un modèle de 70B de paramètres, stocké en FP32 (flottant 32 bits), nécessite 280 Go de mémoire GPU — impossible à faire tourner sans plusieurs GPU haut de gamme. La technique de quantification (Quantization) compresse le volume du modèle en réduisant la précision numérique, permettant aux grands modèles de fonctionner sur du matériel grand public.

<ModelQuantizationDemo />

::: tip Le compromis central de la quantification
La quantification est essentiellement un compromis **précision contre espace**. FP32 → FP16 est quasi sans perte, INT8 a une légère perte, INT4 a une baisse de qualité notable mais généralement acceptable. L'essentiel est de trouver le point d'équilibre optimal pour votre scénario.
- **FP16 (demi-précision)** : volume divisé par deux, qualité quasi sans perte, choix par défaut pour l'entraînement et l'inférence
- **INT8 (entier 8 bits)** : volume encore divisé par deux, perte de qualité très faible, convient à la plupart des scénarios d'inférence
- **INT4 (entier 4 bits)** : volume réduit à 1/8 du FP32, perte de qualité modérée, convient aux scénarios avec ressources limitées
:::

| Précision | Octets par paramètre | Volume modèle 70B | Perte de qualité | Scénario applicable |
|------|-----------|-------------|---------|---------|
| FP32 | 4 octets | ~280 Go | Aucune | Référence d'entraînement |
| FP16 | 2 octets | ~140 Go | Quasi aucune | Entraînement et inférence standards |
| INT8 | 1 octet | ~70 Go | Très faible | Inférence en production |
| INT4 | 0,5 octet | ~35 Go | Acceptable | Appareils edge, déploiement local |

---

## 5. Déploiement de modèle : du laboratoire à l'environnement de production

Le modèle est entraîné, quantifié et compressé, la dernière étape est de le déployer comme un service appelable. Le déploiement de modèle n'est pas seulement « faire tourner le modèle », cela implique aussi la gestion de la concurrence, l'équilibrage de charge, le contrôle des coûts et d'autres problèmes d'ingénierie.

<ModelServingDemo />

::: tip Trois solutions de déploiement principales
1. **Fournisseur d'API** : utiliser directement les API de fournisseurs comme OpenAI, Anthropic. Zéro opération, facturation au token, adapté à la validation rapide et à l'utilisation à petite et moyenne échelle.
2. **Service d'inférence auto-hébergé** : déployer sur ses propres serveurs GPU avec des frameworks comme vLLM, TGI. Coût contrôlable, données ne quittent pas le domaine, adapté aux scénarios avec exigences de confidentialité ou appels à grande échelle.
3. **Inférence Serverless** : utiliser des plateformes comme AWS SageMaker, Replicate, facturation à la requête, scaling automatique. Adapté aux scénarios avec trafic fluctuant.
:::

| Solution de déploiement | Modèle de coût | Latence | Complexité d'exploitation | Scénario applicable |
|---------|---------|------|-----------|---------|
| Fournisseur d'API | Facturation au token | Moyenne | Zéro | Prototypage rapide, petite/moyenne échelle |
| Déploiement vLLM | Location GPU | Faible | Élevée | Grande échelle, sensibilité confidentialité |
| Serverless | Facturation à la requête | Démarrage à froid élevé | Faible | Trafic fluctuant |
| Déploiement edge | Investissement matériel unique | Très faible | Moyenne | Scénarios hors ligne, IoT |

---

## Résumé

Le fine-tuning et le déploiement de modèles sont les étapes clés pour transformer un grand modèle d'« outil généraliste » en « assistant spécialisé ». De la préparation des données à la mise en ligne du modèle, chaque étape exige une pensée et des pratiques d'ingénierie.

Récapitulatif des points clés de ce chapitre :

1. **Le fine-tuning est une formation à l'embauche** : faire apprendre au modèle généraliste les connaissances et les modèles de comportement d'un domaine spécifique
2. **La qualité des données détermine le plafond** : 100 exemples de haute qualité valent mieux que 10 000 exemples de mauvaise qualité
3. **LoRA est le champion de l'efficacité** : obtenir des résultats proches du fine-tuning complet avec moins de 1 % des paramètres
4. **La quantification est l'arme du déploiement** : la quantification INT4 rend possible l'exécution d'un modèle 70B sur une seule carte
5. **La solution de déploiement dépend du contexte** : API pour la validation rapide, auto-hébergement pour la grande échelle, Serverless pour les fluctuations

## Lectures complémentaires

- [Documentation Hugging Face PEFT](https://huggingface.co/docs/peft) - Documentation officielle de la bibliothèque de fine-tuning à efficacité paramétrique
- [Documentation vLLM](https://docs.vllm.ai/) - Moteur d'inférence LLM haute performance
- [Unsloth](https://github.com/unslothai/unsloth) - Framework de fine-tuning LoRA avec accélération 2x
- [Spécification du format GGUF](https://github.com/ggerganov/ggml/blob/master/docs/gguf.md) - Format de modèle quantifié utilisé par llama.cpp
- [Guide de fine-tuning OpenAI](https://platform.openai.com/docs/guides/fine-tuning) - Guide officiel de fine-tuning OpenAI