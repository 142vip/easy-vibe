# Principes : DNS, noms de domaine et HTTPS

::: tip Avant-propos
**Lorsque vous saisissez `www.google.com` dans votre navigateur et appuyez sur Entrée, que se passe-t-il réellement ?** Cette action en apparence simple implique une série de processus complexes : résolution de nom de domaine, requêtes DNS, négociation TLS, etc. Comprendre ces mécanismes est un prérequis indispensable pour tout développeur — cela détermine directement si votre site est accessible et si vos données sont protégées contre les interceptions.
:::

**Que allez-vous apprendre dans cet article ?**

À l'issue de ce chapitre, vous maîtriserez :

- **Principes du DNS** : comprendre le processus complet de traduction d'un nom de domaine en adresse IP
- **Types d'enregistrements** : connaître les usages des enregistrements DNS courants (A, CNAME, MX, etc.)
- **Mécanisme HTTPS** : comprendre comment la négociation TLS établit une connexion sécurisée
- **Chaîne de certificats** : découvrir la chaîne de confiance des certificats numériques et le mécanisme de vérification
- **Conscience sécuritaire** : comprendre pourquoi HTTPS est une exigence fondamentale du Web moderne

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Résolution DNS | Requête récursive, requête itérative |
| **Chapitre 2** | Enregistrements DNS | A, CNAME, MX, TXT |
| **Chapitre 3** | HTTPS et TLS | Processus de négociation, communication chiffrée |
| **Chapitre 4** | Chaîne de confiance des certificats | CA, certificat racine, certificat intermédiaire |
| **Chapitre 5** | HTTP vs HTTPS | Texte clair vs chiffré, comparaison de sécurité |

---

## 0. Vue d'ensemble : du nom de domaine à la connexion sécurisée

Les communications sur Internet reposent sur des adresses IP (comme 142.250.80.46), mais les humains ne peuvent pas mémoriser ces nombres. C'est pourquoi le **système de noms de domaine (DNS)** a été inventé — l'« annuaire téléphonique » d'Internet, qui traduit les noms de domaine lisibles par l'homme en adresses IP lisibles par la machine.

Mais pouvoir trouver le serveur ne suffit pas. Si les communications transitent en clair, tout intermédiaire peut intercepter ou altérer vos données. **HTTPS** résout précisément ce problème — il ajoute une couche de chiffrement TLS au-dessus de HTTP, garantissant la confidentialité et l'intégrité des données pendant le transit.

::: tip Une visite web complète
1. **Résolution de nom de domaine** : le navigateur demande au DNS « Quelle est l'IP de www.google.com ? », le DNS répond « 142.250.80.46 »
2. **Connexion TCP** : le navigateur établit un triple handshake TCP avec le serveur
3. **Négociation TLS** : les deux parties conviennent des algorithmes de chiffrement, vérifient le certificat et échangent les clés
4. **Communication chiffrée** : toutes les données HTTP transitent par un canal chiffré
:::

---

## 1. Résolution DNS : l'« annuaire téléphonique » d'Internet

Le fonctionnement du DNS (Domain Name System) s'apparente à la consultation d'un annuaire téléphonique : vous connaissez le nom de votre correspondant (le nom de domaine) et vous devez trouver son numéro de téléphone (l'adresse IP). Mais l'« annuaire » d'Internet n'est pas un seul livre — c'est un système distribué et hiérarchique.

<DnsResolutionDemo />

::: tip Les quatre étapes de la résolution DNS
1. **Cache du navigateur** : on consulte d'abord le cache local ; si ce domaine a déjà été visité, on utilise l'IP en cache
2. **Résolveur récursif** : en cas d'absence dans le cache, la requête est envoyée au résolveur récursif du FAI (par exemple 8.8.8.8)
3. **Requête hiérarchique** : le résolveur interroge successivement le serveur racine → le serveur de domaine de premier niveau (.com) → le serveur de nom faisant autorité (google.com)
4. **Retour du résultat** : le serveur faisant autorité retourne l'IP finale, le résolveur met en cache le résultat et le transmet au navigateur
:::

| Niveau | Serveur | Rôle | Nombre |
|------|-------|------|------|
| Racine | Root Server | Connaît les adresses de tous les TLD | 13 groupes dans le monde |
| TLD | TLD Server | Gère .com, .cn, .org, etc. | Un groupe par suffixe |
| Faisant autorité | Authoritative | Stocke les enregistrements DNS des domaines spécifiques | Au moins 2 par domaine |
| Résolveur récursif | Resolver | Effectue l'ensemble de la requête pour l'utilisateur | FAI ou DNS public |

---

## 2. Types d'enregistrements DNS : la « table de configuration » derrière les noms de domaine

Le DNS ne se contente pas de traduire les noms de domaine en adresses IP. Grâce aux différents types d'enregistrements DNS, vous pouvez contrôler la livraison des e-mails, les redirections de domaine, la découverte de services et bien plus encore. Comprendre ces types d'enregistrements est la base de la configuration de domaines et du dépannage réseau.

<DnsRecordTypeDemo />

| Type d'enregistrement | Usage | Exemple |
|---------|------|------|
| A | Nom de domaine → adresse IPv4 | `example.com → 93.184.216.34` |
| AAAA | Nom de domaine → adresse IPv6 | `example.com → 2606:2800:220:1:...` |
| CNAME | Nom de domaine → un autre nom de domaine (alias) | `www.example.com → example.com` |
| MX | Désigne le serveur de messagerie | `example.com → mail.example.com` |
| TXT | Stocke des informations textuelles | Vérification SPF, preuve de propriété du domaine |
| NS | Désigne le serveur de nom faisant autorité | `example.com → ns1.example.com` |

::: tip Configuration DNS en situation réelle
- **Déployer un site web** : ajouter un enregistrement A pointant vers l'IP du serveur, ou un CNAME pointant vers le domaine CDN
- **Configurer la messagerie** : ajouter un enregistrement MX pointant vers le serveur de messagerie, un enregistrement TXT pour configurer SPF/DKIM anti-spam
- **Vérifier la propriété d'un domaine** : le fournisseur cloud vous demande d'ajouter un enregistrement TXT spécifique pour prouver que vous possédez ce domaine
- **Équilibrage de charge** : configurer plusieurs enregistrements A pour un même domaine, le DNS distribue le trafic par rotation
:::

---

## 3. HTTPS et TLS : mettre un « gilet pare-balles » aux données

Le protocole HTTP transmet les données en clair — comme envoyer une carte postale que le facteur (l'intermédiaire) peut lire à sa guise. HTTPS ajoute une couche de chiffrement TLS (Transport Layer Security) au-dessus de HTTP, ce qui revient à glisser la carte postale dans une enveloppe scellée.

La négociation TLS est l'étape clé pour établir une connexion sécurisée. Avant de transmettre des données, elle effectue l'authentification et la négociation des clés.

<HttpsHandshakeDemo />

::: tip Étapes clés de la négociation TLS 1.3
1. **Client Hello** : le client envoie la liste des algorithmes de chiffrement pris en charge et un nombre aléatoire
2. **Server Hello** : le serveur sélectionne l'algorithme de chiffrement, retourne le certificat numérique et un nombre aléatoire
3. **Vérification du certificat** : le client vérifie la fiabilité du certificat serveur (vérifie la signature CA, la date de validité, la correspondance du domaine)
4. **Échange de clés** : les deux parties négocient une clé partagée via l'algorithme ECDHE (la clé elle-même n'est pas transmise sur le réseau)
5. **Communication chiffrée** : toutes les données ultérieures sont chiffrées avec la clé symétrique négociée
:::

| Caractéristique | TLS 1.2 | TLS 1.3 |
|------|---------|---------|
| Allers-retours de négociation | 2-RTT | 1-RTT (première fois) / 0-RTT (reprise) |
| Échange de clés | RSA ou ECDHE | Uniquement ECDHE (sécurité anticipée) |
| Algorithmes de chiffrement | Prend en charge de nombreux anciens algorithmes | Uniquement les algorithmes sécurisés |
| Performance | Plus lent | Plus rapide |

---

## 4. Chaîne de confiance des certificats : pourquoi faire confiance à ce site

L'étape la plus critique de la négociation TLS est la « vérification du certificat ». Comment le navigateur détermine-t-il qu'un certificat de site est authentique et non forgé par un attaquant ? La réponse réside dans la **chaîne de confiance des certificats** — un système de confiance reposant sur des niveaux de cautionnement successifs.

<CertificateChainDemo />

::: tip La structure à trois niveaux de la chaîne de confiance
1. **Certificat racine (Root CA)** : émis par une autorité de certification de confiance, préinstallé dans les systèmes d'exploitation et les navigateurs. C'est l'« ancre » de la confiance.
2. **Certificat intermédiaire (Intermediate CA)** : émis par le CA racine, utilisé pour émettre les certificats finaux. Le CA racine n'émet pas directement les certificats de site web, par isolation de sécurité.
3. **Certificat terminal (Leaf Certificate)** : le certificat effectivement utilisé par votre site web, émis par le CA intermédiaire, contenant le domaine, la clé publique, la date de validité, etc.
:::

| Type de certificat | Niveau de vérification | Délai d'émission | Cas d'utilisation |
|---------|---------|---------|---------|
| DV (Validation de domaine) | Vérifie uniquement la propriété du domaine | En quelques minutes | Sites personnels, blogs |
| OV (Validation d'organisation) | Vérifie l'identité de l'organisation | Quelques jours | Sites d'entreprise |
| EV (Validation étendue) | Vérification stricte de l'organisation | Quelques semaines | Banques, institutions financières |
| Certificat générique | Couvre tous les sous-domaines | Selon le type | Scénarios multi-sous-domaines |

---

## 5. HTTP vs HTTPS : pourquoi le chiffrement est un minimum absolu

En 2024, plus de 95 % du trafic web mondial transitait déjà via HTTPS. Le navigateur Chrome affiche un avertissement « Non sécurisé » pour les sites HTTP, et les moteurs de recherche pénalisent le classement des sites HTTP. HTTPS n'est plus une « option », mais une exigence fondamentale du Web moderne.

<DnsHttpsComparisonDemo />

| Dimension | HTTP | HTTPS |
|------|------|-------|
| Transmission des données | En clair, pouvant être interceptée | Chiffrée, indéchiffrable |
| Authentification | Aucune, impossible de confirmer l'identité du serveur | Oui, vérification du serveur via certificat |
| Intégrité des données | Non protégée, pouvant être altérée | Protégée, toute altération est détectée |
| Port | 80 | 443 |
| Impact SEO | Classement réduit | Bonus de classement |
| Comportement du navigateur | Affiche l'avertissement « Non sécurisé » | Affiche l'icône de cadenas |

::: tip Obtenir gratuitement un certificat HTTPS
**Let's Encrypt** est une autorité de certification gratuite et automatisée qui permet à tout site web d'activer HTTPS sans aucun coût. Associé à l'outil Certbot, vous pouvez demander et renouveler automatiquement les certificats en une seule commande. La plupart des plateformes cloud et des fournisseurs CDN proposent également des certificats SSL gratuits.
:::

---

## Résumé

Les noms de domaine, le DNS et HTTPS sont les trois piliers de l'infrastructure Internet. Le DNS nous permet d'accéder aux sites web via des noms lisibles par l'homme, et HTTPS garantit que les communications sont sécurisées et fiables.

Passons en revue les points clés de ce chapitre :

1. **Le DNS est un système hiérarchique** : racine → TLD → faisant autorité, requête niveau par niveau, accélérée par le cache
2. **Les types d'enregistrements ont chacun leur usage** : l'enregistrement A pointe vers une IP, le CNAME crée un alias, le MX gère la messagerie, le TXT sert à la vérification
3. **La négociation TLS établit la confiance** : vérification de certificat + négociation de clés, TLS 1.3 ne nécessite qu'un 1-RTT
4. **La chaîne de confiance des certificats** : CA racine → CA intermédiaire → certificat terminal, cautionnement niveau par niveau
5. **HTTPS est un minimum absolu** : les certificats gratuits (Let's Encrypt) rendent le chiffrement accessible à tous

## Pour aller plus loin

- [How DNS Works](https://howdns.works/) - Explication du fonctionnement du DNS sous forme de bande dessinée
- [Documentation Let's Encrypt](https://letsencrypt.org/docs/) - Guide de demande de certificats SSL gratuits
- [Cloudflare Learning Center](https://www.cloudflare.com/learning/dns/what-is-dns/) - Tutoriels sur le DNS et la sécurité réseau
- [TLS 1.3 RFC 8446](https://datatracker.ietf.org/doc/html/rfc8446) - Spécification du protocole TLS 1.3
- [SSL Labs](https://www.ssllabs.com/ssltest/) - Test en ligne de la qualité de la configuration HTTPS d'un site
