---
title: 'Publier et distribuer l’application terminée'
description: 'Du build Release et de la signature aux tests, à la revue, au déploiement progressif et aux mises à jour.'
---

# Publier et distribuer l’application terminée

Une application qui tourne sur votre ordinateur n'est pas encore un produit installable en sécurité.

> Choisir le canal → fixer l'identité → construire Release → signer → tester → préparer la fiche → soumettre → déployer progressivement → surveiller et mettre à jour

## 1. Distinguer paquet, signature, distribution et revue

Le paquet est l'installateur, la signature prouve l'éditeur et protège les mises à jour, la distribution livre le fichier et la revue contrôle les règles de la plateforme.

## 2. Organiser propriété et identité

L'organisation doit contrôler comptes, email, domaine, cloud, certificats et paiements avec double authentification. Ne changez pas après publication le package Android ni le Bundle ID Apple. Augmentez le numéro de build à chaque envoi.

## 3. Préparer un vrai Release

Il ne doit pas appeler localhost, une base de test ou contenir des secrets serveur. Créez icône, captures réelles, description, support, confidentialité et notes de revue depuis le build candidat. Permissions, SDK, déclaration de boutique et politique de confidentialité doivent correspondre.

## 4. Canaux de publication

Android envoie généralement un `.aab` signé à Google Play en commençant par un test interne. iOS passe par App Store Connect, Xcode Archive, TestFlight et la revue.

Windows utilise MSIX dans Microsoft Store ou un installateur signé sur le site. macOS hors boutique exige Developer ID et notarisation. Linux propose Flathub, Snap, AppImage, `.deb`, `.rpm`.

Web/PWA se publie en HTTPS avec DNS, certificat, variables de production, 404, hors ligne, Manifest, Service Worker, monitoring et sauvegarde.

## 5. Revue et déploiement progressif

Crashes propres à Release, compte de revue inutilisable, confidentialité incorrecte, bouton inachevé, permissions excessives et ressources sans licence sont fréquents.

> Voici le message de revue : 【colle-le】. Identifie la règle et le comportement à modifier, sans deviner.

Test développeur, interne, petite bêta, revue, faible pourcentage puis totalité : cette progression réduit le risque. Signature, confidentialité, surveillance et rollback font partie du produit.
