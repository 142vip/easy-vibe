# Principes : Communication temps réel : Polling, SSE, WebSocket

::: tip Guide principal
**Comment le navigateur realise-t-il les mises a jour de donnees en temps reel ?**
Le protocole HTTP traditionnel est base sur un modele `` requete-reponse '', ou le client doit initier activement une requete pour que le serveur puisse renvoyer des donnees. Si nous devons implementer des scenarios en temps reel tels que des salons de discussion ou la diffusion de cours boursiers, ce modele est confronte a des defis.

Ce chapitre presente les trois principales technologies frontend pour la communication de donnees en temps reel : le polling court (Polling), les Server-Sent Events (SSE) et le WebSocket full-duplex, tout en explorant leurs principes et cas d'utilisation.
:::

---

## 1. Les limites du HTTP traditionnel

Le protocole HTTP a ete concu a l'origine pour la recherche de documents et se caracterise par son caractere **sans etat (Stateless)** et son **initiation unilaterale par le client** :
1. Le client initie une requete HTTP.
2. Le serveur traite la requete et renvoie une reponse.
3. Une fois la tache terminee, la connexion est generalement liberee (bien que HTTP/1.1 prenne en charge la reutilisation des connexions persistantes, le modele requete-reponse au niveau metier reste inchang).

Dans ce mode, le serveur ne peut pas notifier activement les clients en attente des changements d'etat. Pour obtenir les donnees les plus recentes, il faut trouver d'autres solutions d'architecture technique.

---

## 2. Le polling court (Polling)

La solution la plus directe est le **polling court**. Le client utilise un minuteur (comme `setInterval`) pour envoyer automatiquement des requetes HTTP au serveur a intervalles fixes, demandant si de nouvelles donnees sont arrivees.

<PollingDemo />

**Caracteristiques techniques et limites :**
- **Avantages** : le mecanisme d'implementation est extremement simple et repose entierement sur le protocole HTTP standard et les technologies AJAX/Fetch.
- **Inconvenients** : peut generer des surcharges reseau et un gaspillage de ressources considerables. La plupart du temps, la reponse du serveur peut etre `` pas de nouvelles donnees ''. Que des donnees soient presentes ou non, chaque requete doit transporter des en-tetes HTTP complets (Headers, Cookies, etc.), ce qui, dans des scenarios a forte concurrence, conduit a une occupation massive des ressources reseau par des requetes depourvues de sens.

---

## 3. Les Server-Sent Events (SSE)

Pour reduire le cout de l'etablissement frequent de connexions HTTP, les **Server-Sent Events (SSE)** offrent une architecture legere de diffusion de flux de donnees unidirectionnel.

SSE est construit sur le protocole HTTP. Apres que le client a initie une requete HTTP contenant un en-tete special (`Accept: text/event-stream`), le serveur maintient la connexion TCP sous-jacente ouverte lors du renvoi de la reponse. Par la suite, le serveur peut pousser en continu des donnees au format texte vers le client via ce canal persistant.

<SSEDemo />

**Caracteristiques techniques et limites :**
- **Avantages** : connexion persistante avec un faible cout reseau ; le navigateur prend nativement en charge le mecanisme de reconnexion automatique en cas de deconnexion ; tres adapte a la transmission **unidirectionnelle** de donnees en flux du serveur vers le client (par exemple, la sortie caractere par caractere des grands modeles de langage, la diffusion de cours de bourse en temps reel).
- **Inconvenients** : le canal de communication est unidirectionnel. Si le client doit envoyer des commandes de controle ou transmettre de nouvelles donnees au serveur, il doit etablir une requete HTTP normale supplementaire.

---

## 4. WebSocket : protocole de communication full-duplex

Lorsque les scenarios d'application impliquent des interactions bidirectionnelles a haute frequence (comme les jeux d'action en ligne multijoueurs, l'edition collaborative de documents de precision), nous avons besoin d'une technologie capable a la fois de reduire les couts de communication et de realiser une veritable communication duplex — **WebSocket**.

WebSocket est un protocole de communication reseau independant. Il utilise ingenieusement le protocole HTTP pour etablir la connexion initiale :
1. **Phase de negociation (handshake)** : le client envoie une requete HTTP speciale declarant souhaiter effectuer une mise a niveau vers un nouveau protocole (avec l'en-tete `Upgrade: websocket`).
2. **Transmutation de la connexion** : si le serveur prend en charge et accepte ce protocole, il repond avec le code d'etat `101 Switching Protocols`.
3. **Liberte totale** : a ce stade, la mission normative du HTTP est terminee et la connexion TCP sous-jacente est transferee au protocole WebSocket. Par la suite, le client et le serveur jouissent de droits de communication full-duplex (Full-Duplex) egaux et peuvent a tout moment envoyer et recevoir des trames de donnees au format minimaliste.

<WebSocketDemo />

**Caracteristiques techniques et limites :**
- **Avantages** : prend en charge la veritable communication bidirectionnelle en temps reel ; les informations d'en-tete des trames de donnees sont extremement petites, offrant une faible latence de communication et un debit eleve ; prend en charge la transmission de donnees binaires natives (ArrayBuffer).
- **Inconvenients** : complexite d'architecture et de developpement plus elevee ; la maintenance de connexions persistantes a longue duree impose des exigences d'ingenierie plus strictes en matiere d'architecture systeme cote serveur, de strategie d'equilibrage de charge et de conception de la surveillance par battement cardiaque (heartbeat).

---

## 5. Resume : comparaison des choix technologiques

| Dimension | Polling court (Polling) | Server-Sent Events (SSE) | WebSocket |
| :--- | :--- | :--- | :--- |
| **Direction de communication** | Le client interroge activement (unidirectionnel) | Le serveur pousse en continu activement (unidirectionnel) | Le client et le serveur ont des droits d'emission/reception egaux (bidirectionnel full-duplex) |
| **Protocole sous-jacent** | HTTP standard | HTTP standard | Protocole WebSocket independent (base sur TCP) |
| **Cout des donnees** | Tres eleve (inclut les en-tetes HTTP complets) | Faible | Extremement faible (en-tetes de trames de donnees minimalistes) |
| **Scenarios d'application typiques** | Verification reguliere de l'etat d'achevement des taches asynchrones backend | Sortie de flux unidirectionnel de dialogues avec les grands modeles de langage, diffusion de nouvelles ou de notifications systeme | Signalisation audio/vido en temps reel, jeux en ligne multijoueurs, tableaux blancs collaboratifs et edition |

En ingenierie pratique, les developpeurs doivent, en fonction des exigences specifiques du scenario metier en matiere de temps reel et de frequence d'interaction bidirectionnelle, trouver un equilibre entre la complexite de maintenance du systeme et l'efficacite de communication, et choisir la pile technologique la plus adaptee.
