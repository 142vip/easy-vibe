# Principes : Concurrence et programmation asynchrone
> 💡 **Guide d'apprentissage** : La programmation concurrente est le "talon d'Achille" de nombreux ingénieurs backend — ils sont mis en difficulté lors des entretiens, rencontrent des bugs en production, et manquent d'idées pour l'optimisation des performances. Ce chapitre s'articule autour d'une question centrale : **lorsque 100 000 utilisateurs sollicitent votre service simultanément, votre code va-t-il planter ?**

Avant de commencer, il est conseillé de consolider deux "briques fondamentales" :

- **Qu'est-ce que le CPU, la mémoire et les E/S** : si vous n'êtes pas familier avec ces concepts de base, vous pouvez d'abord revoir les connaissances fondamentales des systèmes d'exploitation.
- **Qu'est-ce que le blocage/non-blocage** : si vous n'êtes pas encore familier avec les concepts de synchrone/asynchrone, vous pouvez d'abord en faire l'expérience par la programmation pratique.

---

## 0. Introduction : pourquoi votre service se "fige" lors des pics de trafic

<ProcessThreadCoroutineDemo />

Beaucoup de développeurs rencontrent des situations similaires dans la pratique :

- Le service répond rapidement en test local, mais devient "saccadé comme un diaporama" une fois en ligne ;
- Vous avez acheté un serveur avec une configuration élevée, mais l'utilisation du CPU ne monte jamais ;
- Lors des pics de promotion, le service subit un "effondrement en cascade", obligeant à la dégradation ou au disjoncteur.

Intuitivement, on pense que : **"le serveur n'est pas assez puissant"**.
Mais la plupart du temps, le problème ne réside pas dans le fait que le matériel n'est "pas assez rapide", mais dans le fait que nous **n'avons pas bien conçu le modèle de concurrence**.

**Contradiction centrale** :
- Sans traitement concurrent : les requêtes des utilisateurs s'accumulent en file d'attente, l'expérience est désastreuse ;
- Avec un multithreading mal maîtrisé : compétition de verrous, surcoût des changements de contexte, les performances chutent au contraire.

Face à ces défis, se contenter d'"ajouter des machines" ne suffit plus. Nous avons besoin d'une méthode systématique de conception concurrente, qui garantit à la fois les performances et la stabilité dans les scénarios de haute concurrence. C'est précisément ce que ce chapitre tente de résoudre.

---

## 1. Concepts fondamentaux : processus, threads, coroutines, quelles différences

### 1.1 L'analogie du restaurant

Imaginez que vous gérez un restaurant et devez servir de nombreux clients simultanément :

| Concept | Analogie du restaurant | Signification technique |
| :--- | :--- | :--- |
| **Processus (Process)** | **Une succursale indépendante du restaurant** | Dispose d'un espace mémoire indépendant et de ressources allouées, c'est l'unité de base d'allocation des ressources du système d'exploitation. Un processus qui plante n'affecte pas les autres processus. |
| **Thread (Thread)** | **Un cuisinier dans la succursale** | C'est l'unité de base d'ordonnancement du CPU, partage l'espace mémoire du processus. Les threads d'un même processus peuvent partager des données, mais le plantage d'un thread peut entraîner le plantage de tout le processus. |
| **Coroutine (Coroutine)** | **Le "don d'ubiquité" du cuisinier** | Thread léger en espace utilisateur, ordonnancé par le programme lui-même plutôt que par le système d'exploitation. Le surcoût de commutation est extrêmement faible, on peut en créer des millions. |

### 1.2 Comparaison approfondie : les différences essentielles entre les trois

<ProcessIsolationDemo />

#### Processus : le "conteneur" d'isolation des ressources

**Caractéristiques principales** :
- **Forte isolation** : chaque processus possède un espace d'adressage virtuel indépendant
- **Surcoût élevé** : la création/commutation nécessite l'intervention du système d'exploitation, prend environ 1-10 ms
- **Communication complexe** : la communication inter-processus (IPC) nécessite des mécanismes spéciaux (pipes, files de messages, mémoire partagée, etc.)

**Scénarios adaptés** :
- Services nécessitant une forte isolation (comme les onglets de navigateur, les programmes sandbox)
- Services déployés avec un mélange de langages
- Unités de service nécessitant un redémarrage/mise à jour indépendant

#### Thread : la "cavalerie légère" à mémoire partagée

<ThreadSchedulingDemo />

**Caractéristiques principales** :
- **Mémoire partagée** : les threads d'un même processus partagent le segment de code, le segment de données, le tas
- **Espace de pile indépendant** : chaque thread possède sa propre pile (généralement environ 1 Mo)
- **Commutation relativement rapide** : la commutation de thread prend environ 1-10 μs, soit 1000 fois plus rapide que le processus
- **Synchronisation nécessaire** : les données partagées nécessitent une protection par verrou

**Scénarios adaptés** :
- Tâches intensives en CPU (calcul, traitement d'images)
- Tâches concurrentes nécessitant le partage de nombreuses données
- Tâches de fond sensibles à la latence

#### Coroutine : le "thread vert" en espace utilisateur

<CoroutineLightweightDemo />

**Caractéristiques principales** :
- **Ordonnancement en espace utilisateur** : ordonnancé par le programme/bibliothèque d'exécution, sans passer par le système d'exploitation
- **Extrêmement légère** : la pile de coroutine ne fait généralement que quelques Ko, on peut en créer des millions
- **Commutation extrêmement rapide** : la commutation de coroutine prend environ 100 ns, soit 100 fois plus rapide que le thread
- **Non préemptive** : la coroutine cède volontairement le CPU (multitâche coopératif)

**Scénarios adaptés** :
- Services à haute concurrence intensive en E/S (serveurs web, passerelles)
- Scénarios nécessitant de maintenir un grand nombre de connexions persistantes (messagerie instantanée, serveurs de jeux)
- Traitement de données en flux, pipelines de traitement

---

## 2. Étude de cas : les "douleurs de la concurrence" lors d'une grande promotion e-commerce

### 2.1 Leçons douloureuses : l'évolution du "mono-machine" au "distribué"

Examinons l'histoire réelle de l'évolution d'un système e-commerce :

#### Étape 1 : l'ère mono-machine (1000 utilisateurs actifs par jour)

```python
# Application Flask simple
from flask import Flask

app = Flask(__name__)

@app.route('/order')
def create_order():
    # Vérifier le stock
    stock = db.query("SELECT stock FROM products WHERE id=1")
    if stock > 0:
        # Déduire le stock
        db.execute("UPDATE products SET stock = stock - 1 WHERE id=1")
        # Créer la commande
        db.execute("INSERT INTO orders ...")
        return "Order created!"
    return "Out of stock!"

# Lancement : flask run
```

**Problèmes** :
- Processus unique, thread unique, ne peut traiter qu'une seule requête à la fois
- La déduction du stock n'est pas verrouillée, ce qui entraîne des surventes en concurrence
- Le nombre de connexions à la base de données est limité, le pool de connexions est rapidement épuisé

#### Étape 2 : l'ère multi-processus (10 000 utilisateurs actifs par jour)

```python
# Déploiement multi-processus avec Gunicorn
gunicorn -w 4 -k sync app:app

# 4 processus worker, chaque processus traite les requêtes indépendamment
```

**Nouveaux problèmes** :
- 4 processus vérifient le stock simultanément, tous voient stock=1, tous déduisent avec succès, 3 surventes !
- Nécessité d'introduire un verrou distribué

```python
import redis

# Utilisation du verrou distribué Redis
lock = redis_client.lock("stock_lock", timeout=10)
if lock.acquire():
    try:
        stock = db.query("SELECT stock FROM products WHERE id=1")
        if stock > 0:
            db.execute("UPDATE products SET stock = stock - 1 WHERE id=1")
    finally:
        lock.release()
```

#### Étape 3 : l'ère des coroutines (100 000 utilisateurs actifs par jour)

```python
# Utilisation de FastAPI + asyncio
from fastapi import FastAPI
import asyncio

app = FastAPI()

async def check_stock(product_id: int) -> int:
    # Requête asynchrone à la base de données, sans blocage
    result = await db.fetch_one(
        "SELECT stock FROM products WHERE id = :id",
        {"id": product_id}
    )
    return result["stock"]

@app.get("/order")
async def create_order(product_id: int):
    # Vérification concurrente du stock et des informations utilisateur
    stock_task = check_stock(product_id)
    user_task = get_user_info(request.user_id)

    stock, user = await asyncio.gather(stock_task, user_task)

    if stock > 0:
        # Déduction asynchrone du stock
        await db.execute(
            "UPDATE products SET stock = stock - 1 WHERE id = :id",
            {"id": product_id}
        )
        return {"status": "success"}

    return {"status": "out_of_stock"}

# Lancement : uvicorn main:app --workers 4
# Chaque worker peut traiter des milliers de coroutines concurrentes
```

**Avantages** :
- Un seul thread peut traiter des milliers de connexions concurrentes
- Cède le CPU lors des opérations d'E/S, sans bloquer les autres requêtes
- Empreinte mémoire extrêmement faible, adapté aux scénarios de haute concurrence avec connexions persistantes

### 2.2 Tableau comparatif de l'évolution du modèle de concurrence

| Étape | Modèle de concurrence | Utilisateurs actifs supportés | Problème central | Solution |
| :--- | :--- | :--- | :--- | :--- |
| **Monolithique** | Processus unique, thread unique | 1K | Impossible de traiter en concurrence | Introduction du multi-processus |
| **Multi-processus** | Multi-processus synchrone | 10K | Concurrence de données, survente | Verrou distribué |
| **Multi-thread** | Multi-thread + verrous | 50K | Surcoût de commutation de contexte, interblocage | Pool de threads, files sans verrou |
| **Coroutine** | E/S asynchrones | 100K+ | Complexité du code, débogage difficile | Encapsulation par framework, traçage distribué |
| **Hybride** | Multi-processus + coroutines | 1000K+ | Complexité architecturale | Gouvernance de services, élasticité |

---

## 3. Principes approfondis : fonctionnement des différents modèles de concurrence

### 3.1 Modèle processus : isolation et communication

#### Mécanisme d'isolation mémoire

<ProcessIsolationDemo />

Chaque processus possède un espace d'adressage virtuel indépendant :

```
Mémoire virtuelle du processus A    Mémoire virtuelle du processus B
+----------------+                  +----------------+
|  Espace noyau  |                  |  Espace noyau  |  <-- Partagé (lecture seule)
|  (partagé)     |                  |  (partagé)     |
+----------------+                  +----------------+
|  Espace pile   |                  |  Espace pile   |  <-- Indépendant
|  (croît vers   |                  |  (croît vers   |
|   le bas)      |                  |   le bas)      |
+----------------+                  +----------------+
|  Espace tas    |                  |  Espace tas    |  <-- Indépendant
|  (croît vers   |                  |  (croît vers   |
|   le haut)     |                  |   le haut)     |
+----------------+                  +----------------+
|  Segment       |                  |  Segment       |  <-- Indépendant
|  données       |                  |  données       |
|  (.bss/.data)  |                  |  (.bss/.data)  |
+----------------+                  +----------------+
|  Segment       |                  |  Segment       |  <-- Indépendant
|  code (.text)  |                  |  code (.text)  |
+----------------+                  +----------------+
```

#### Modes de communication inter-processus (IPC)

| Mode | Principe | Vitesse | Scénario adapté |
| :--- | :--- | :--- | :--- |
| **Pipe (Tube)** | Tampon noyau, flux unidirectionnel | Moyenne | Communication entre processus parent/enfant |
| **File de messages** | Liste chaînée de messages dans le noyau | Moyenne | Transmission de messages asynchrones |
| **Mémoire partagée** | Mapping du même bloc de mémoire physique | La plus rapide | Partage de grandes quantités de données |
| **Sémaphore** | Compteur noyau | - | Synchronisation et exclusion mutuelle |
| **Socket** | Pile de protocoles réseau | Lente | Communication inter-machine |
| **Signal** | Interruption logicielle | - | Notification d'événements |

### 3.2 Modèle thread : ordonnancement et synchronisation

#### Principe d'ordonnancement des threads

<ThreadSchedulingDemo />

Fonctionnement de base de l'ordonnanceur de threads du système d'exploitation :

```
File d'attente prête               En cours d'exécution           File d'attente bloquée
+--------+                          +--------+                     +--------+
| Thread B|  <-- Fin du quantum     | Thread A|  <-- Requête E/S   | Thread C|
| Thread D|                         | (actif) |                    | Thread E|
| Thread F|                         +--------+                     | (bloqué)|
+--------+                                                        +--------+
    |                                                                  |
    v                                                                  v
L'ordonnanceur choisit le prochain                         Retour à la file prête
à exécuter selon la priorité                               quand l'E/S est terminée
```

#### Mécanismes courants de synchronisation des threads

| Mécanisme | Principe | Avantages | Inconvénients |
| :--- | :--- | :--- | :--- |
| **Mutex (Verrou d'exclusion mutuelle)** | État binaire, accès exclusif | Implémentation simple | Performances médiocres en cas de forte compétition |
| **RWLock (Verrou lecture-écriture)** | Lecture partagée, écriture exclusive | Efficace quand lectures > écritures | Implémentation complexe, risque de famine en écriture |
| **Spinlock (Verrou par attente active)** | Attente active, ne libère pas le CPU | Efficace quand l'attente est courte | Gaspillage de CPU quand l'attente est longue |
| **Variable de condition** | Attente d'une condition spécifique | Évite l'attente active | Doit être utilisé avec un verrou |
| **Sémaphore (Semaphore)** | Compteur contrôlant le nombre d'accès | Contrôle le nombre de tâches concurrentes | Facile à mal utiliser |
| **Opération atomique** | Atomicité au niveau instruction CPU | Sans verrou, performance maximale | Ne peut opérer que sur des types de données simples |
| **File sans verrou** | Implémentée par opération CAS | Excellentes performances en haute concurrence | Implémentation complexe, problème ABA |

### 3.3 Modèle coroutine : ordonnancement en espace utilisateur

<CoroutineLightweightDemo />

#### Avantages fondamentaux de la coroutine

```
Multithreading traditionnel      vs        Modèle coroutine

+------------+                             +------------+
|  Thread 1   |                            |  Boucle     |
| (pile 1Mo) |                            |  d'événements|
+------------+                             | (ordonnanceur)|
     |                                      +------------+
     v                                           |
+------------+                                    v
|  Thread 2   |                            +------------+
| (pile 1Mo) |                            |  Coroutine A|
+------------+                             | (pile qq Ko)|
     |                                      +------------+
     v                                           |
+------------+                                    v
|  Thread 3   |                            +------------+
| (pile 1Mo) |                            |  Coroutine B|
+------------+                             | (pile qq Ko)|
                                           +------------+

Surcoût : N Mo                               Surcoût : N Ko
Création : ~10 μs                           Création : ~100 ns
Commutation : ~1 μs                         Commutation : ~100 ns
```

#### Mécanisme de fonctionnement d'async/await

<AsyncAwaitDemo />

```python
import asyncio

async def fetch_data(url):
    # Au await, la coroutine se suspend et cède le CPU
    response = await aiohttp.get(url)
    # Une fois l'E/S terminée, la boucle d'événements réveille la coroutine,
    # l'exécution reprend ici
    return response.json()

async def main():
    # Créer 3 tâches coroutines
    tasks = [
        fetch_data("https://api1.example.com"),
        fetch_data("https://api2.example.com"),
        fetch_data("https://api3.example.com")
    ]
    # Exécution concurrente, durée totale ≈ la requête la plus lente
    results = await asyncio.gather(*tasks)
    return results

# Lancer la boucle d'événements
asyncio.run(main())
```

**Flux d'exécution** :

```
Chronologie ---------------------------------------------------------------->

Coroutine A: [Prép. requête]--[await suspendu]=======[Réponse reçue]--[Traitement]
                              |
Coroutine B:                  [Prép. requête]--[await suspendu]=======[Réponse]--[Traitement]
                                                |
Coroutine C:                                    [Prép. requête]--[await suspendu]=======[Réponse]
                                                                 |
                                                                 v
                                                        Toutes les E/S terminées

Légende : [ ] = exécution CPU, === = attente E/S, | = commutation de coroutine
```

### 3.4 Boucle d'événements : le "cœur" des coroutines

<EventLoopDemo />

La boucle d'événements est le mécanisme central d'ordonnancement des coroutines :

```python
import selectors
import heapq

class EventLoop:
    def __init__(self):
        self.selector = selectors.DefaultSelector()
        self.ready = []  # File d'attente prête
        self.scheduled = []  # File de tâches planifiées
        self.current = None

    def run(self):
        while True:
            # 1. Traiter les tâches planifiées
            now = time.time()
            while self.scheduled and self.scheduled[0][0] <= now:
                _, callback = heapq.heappop(self.scheduled)
                self.ready.append(callback)

            # 2. Attendre les événements E/S
            timeout = 0 if self.ready else 0.1
            events = self.selector.select(timeout)

            for key, mask in events:
                callback = key.data
                self.ready.append(callback)

            # 3. Exécuter les callbacks prêts
            while self.ready:
                callback = self.ready.popleft()
                callback()
```

### 3.5 Concurrence vs Parallélisme : ce n'est pas la même chose

<ConcurrentVsParallelDemo />

| Concept | Anglais | Signification | Analogie | Condition requise |
| :--- | :--- | :--- | :--- | :--- |
| **Concurrence** | Concurrency | Plusieurs tâches s'exécutent en alternance, progressent simultanément au niveau macro | Une personne prépare plusieurs plats en alternance | Un seul cœur CPU suffit |
| **Parallélisme** | Parallelism | Plusieurs tâches s'exécutent véritablement en même temps | Plusieurs personnes préparent différents plats simultanément | Plusieurs cœurs CPU ou plusieurs machines |

**Illustration** :

```
CPU monocœur - Concurrence (Concurrent)
Temps →  1    2    3    4    5    6    7    8
Tâche A: [Exéc][Exéc]      [Exéc][Exéc]
Tâche B:      [Exéc][Exéc]      [Exéc][Exéc]

Deux tâches s'exécutent en alternance, progressent "simultanément" au niveau macro

========================================

CPU multicœur - Parallélisme (Parallel)
Temps →  1    2    3    4    5    6    7    8
Cœur 1: [Tâche A][Tâche A][Tâche A][Tâche A]
Cœur 2: [Tâche B][Tâche B][Tâche B][Tâche B]

Deux tâches s'exécutent véritablement "en même temps"

========================================

En réalité, c'est souvent : Concurrence + Parallélisme
Temps →  1    2    3    4    5    6    7    8
Cœur 1: [A1][A1][B1][B1][C1][C1][D1][D1]
Cœur 2: [A2][A2][B2][B2][C2][C2][D2][D2]

Plusieurs tâches sont d'abord ordonnancées de manière concurrente sur différents cœurs,
puis exécutées en parallèle sur ces cœurs
```

---

## 4. Pratique : Goroutines Go et threads verts

### 4.1 La philosophie de concurrence de Go

<GoroutineGreenThreadDemo />

La philosophie de conception de la concurrence en Go : **ne pas communiquer en partageant la mémoire, mais partager la mémoire en communiquant**.

```go
package main

import (
    "fmt"
    "time"
)

// Producteur
func producer(ch chan<- int, id int) {
    for i := 0; i < 5; i++ {
        fmt.Printf("Producer %d sending: %d\n", id, i)
        ch <- i  // Envoyer des données au channel
        time.Sleep(100 * time.Millisecond)
    }
}

// Consommateur
func consumer(ch <-chan int, id int) {
    for val := range ch {  // Recevoir des données du channel
        fmt.Printf("Consumer %d received: %d\n", id, val)
    }
}

func main() {
    // Créer un channel avec buffer
    ch := make(chan int, 10)

    // Lancer 2 goroutines productrices
    for i := 0; i < 2; i++ {
        go producer(ch, i)
    }

    // Lancer 2 goroutines consommatrices
    for i := 0; i < 2; i++ {
        go consumer(ch, i)
    }

    // Attendre un moment
    time.Sleep(3 * time.Second)
    close(ch)
}
```

### 4.2 Ordonnanceur de Goroutines : le modèle GMP

L'ordonnanceur de Go adopte le modèle GMP :

| Composant | Signification | Rôle |
| :--- | :--- | :--- |
| **G (Goroutine)** | Coroutine | Tâche à exécuter, légère (pile de 2 Ko, extensible dynamiquement) |
| **M (Machine)** | Thread système | Support d'exécution réel de G, correspondance 1:1 avec le thread noyau |
| **P (Processor)** | Processeur logique | Contexte d'ordonnancement, contient la file de G exécutables, nombre par défaut égal au nombre de cœurs CPU |

**Flux d'ordonnancement** :

```
File globale
+----------------+
|  G1  |  G2  |  G3  |
+----------------+

File locale de P0       File locale de P1       File locale de P2       File locale de P3
+----------+            +----------+            +----------+            +----------+
| G4 | G5  |            | G6 | G7  |            | G8 | G9  |            | G10| G11 |
+----------+            +----------+            +----------+            +----------+
    |                       |                       |                       |
    v                       v                       v                       v
+----------+            +----------+            +----------+            +----------+
|    M0    |            |    M1    |            |    M2    |            |    M3    |
| (Thread  |            | (Thread  |            | (Thread  |            | (Thread  |
|   OS)    |            |   OS)    |            |   OS)    |            |   OS)    |
+----------+            +----------+            +----------+            +----------+

Stratégie d'ordonnancement :
1. Chaque P maintient une file locale de G, réduisant la compétition de verrous
2. P prend G dans la file locale et le confie à M pour exécution
3. Quand la file locale est vide, "vole" la moitié des G d'un autre P (Work Stealing)
4. La file globale sert de secours, vérifiée périodiquement
```

---

## 5. Templates de code pratiques

### 5.1 Template Python asyncio pour haute concurrence

```python
import asyncio
import aiohttp
from typing import List, Dict
import time

class AsyncHTTPClient:
    """Client HTTP haute performance basé sur asyncio"""

    def __init__(self, max_connections: int = 100, timeout: int = 30):
        self.timeout = aiohttp.ClientTimeout(total=timeout)
        # Limiter le nombre de connexions concurrentes pour éviter de surcharger le service cible
        connector = aiohttp.TCPConnector(
            limit=max_connections,
            limit_per_host=10,  # Limite de connexions par domaine
            enable_cleanup_closed=True,
            force_close=True,
        )
        self.session = aiohttp.ClientSession(
            connector=connector,
            timeout=self.timeout,
        )

    async def fetch(self, url: str, method: str = 'GET', **kwargs) -> Dict:
        """Envoyer une requête unique"""
        try:
            async with self.session.request(method, url, **kwargs) as response:
                return {
                    'url': url,
                    'status': response.status,
                    'data': await response.text(),
                    'error': None
                }
        except asyncio.TimeoutError:
            return {'url': url, 'status': None, 'data': None, 'error': 'Timeout'}
        except Exception as e:
            return {'url': url, 'status': None, 'data': None, 'error': str(e)}

    async def fetch_many(self, urls: List[str], concurrency: int = 10) -> List[Dict]:
        """Récupérer plusieurs URLs en concurrence, avec limite de concurrence"""
        semaphore = asyncio.Semaphore(concurrency)

        async def fetch_with_limit(url):
            async with semaphore:
                return await self.fetch(url)

        # Exécuter toutes les requêtes en concurrence
        tasks = [fetch_with_limit(url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)

    async def close(self):
        await self.session.close()


# Exemple d'utilisation
async def main():
    client = AsyncHTTPClient(max_connections=50)

    # Liste d'URLs à récupérer
    urls = [
        "https://api.github.com/users/github",
        "https://api.github.com/users/google",
        "https://api.github.com/users/microsoft",
        # ... plus d'URLs
    ] * 10  # Simuler 300 requêtes

    start = time.time()
    results = await client.fetch_many(urls, concurrency=20)
    elapsed = time.time() - start

    # Statistiques
    success = sum(1 for r in results if r.get('status') == 200)
    failed = len(results) - success

    print(f"Total requêtes : {len(results)}")
    print(f"Succès : {success}, Échecs : {failed}")
    print(f"Durée : {elapsed:.2f}s")
    print(f"QPS : {len(results)/elapsed:.1f}")

    await client.close()

if __name__ == "__main__":
    asyncio.run(main())
```

### 5.2 Template Go pour service haute concurrence

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"runtime"
	"time"

	"golang.org/x/sync/errgroup"
)

// Structures Request/Response
type OrderRequest struct {
	UserID    int64   `json:"user_id"`
	ProductID int64   `json:"product_id"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

type OrderResponse struct {
	OrderID   int64   `json:"order_id"`
	Status    string  `json:"status"`
	Total     float64 `json:"total"`
	CreatedAt string  `json:"created_at"`
}

// Simulation d'opération base de données
type Database struct {
	orders map[int64]*OrderResponse
	mutex  chan struct{}
}

func NewDatabase() *Database {
	db := &Database{
		orders: make(map[int64]*OrderResponse),
		mutex:  make(chan struct{}, 1), // Simuler un mutex
	}
	return db
}

func (db *Database) CreateOrder(ctx context.Context, req *OrderRequest) (*OrderResponse, error) {
	// Acquérir le verrou
	select {
	case db.mutex <- struct{}{}:
		defer func() { <-db.mutex }()
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	// Simuler la latence de l'opération base de données
	select {
	case <-time.After(50 * time.Millisecond):
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	order := &OrderResponse{
		OrderID:   time.Now().UnixNano(),
		Status:    "created",
		Total:     req.Price * float64(req.Quantity),
		CreatedAt: time.Now().Format(time.RFC3339),
	}
	db.orders[order.OrderID] = order
	return order, nil
}

// Handler HTTP
type Handler struct {
	db *Database
}

func NewHandler(db *Database) *Handler {
	return &Handler{db: db}
}

func (h *Handler) CreateOrder(w http.ResponseWriter, r *http.Request) {
	// Définir le timeout de la requête
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()

	var req OrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	order, err := h.db.CreateOrder(ctx, &req)
	if err != nil {
		if err == context.DeadlineExceeded {
			http.Error(w, "Request timeout", http.StatusGatewayTimeout)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(order)
}

func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	info := map[string]interface{}{
		"status":    "ok",
		"goroutine": runtime.NumGoroutine(),
		"cpu":       runtime.NumCPU(),
		"version":   runtime.Version(),
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(info)
}

// Exemple de traitement par lots
func BatchProcess(ctx context.Context, items []int) ([]int, error) {
	g, ctx := errgroup.WithContext(ctx)
	g.SetLimit(10) // Limiter la concurrence à 10

	results := make([]int, len(items))

	for i, item := range items {
		i, item := i, item // Éviter le piège de closure
		g.Go(func() error {
			select {
			case <-ctx.Done():
				return ctx.Err()
			default:
				// Simuler un traitement
				time.Sleep(100 * time.Millisecond)
				results[i] = item * 2
				return nil
			}
		})
	}

	if err := g.Wait(); err != nil {
		return nil, err
	}
	return results, nil
}

func main() {
	// Initialiser la base de données
	db := NewDatabase()

	// Créer le handler
	handler := NewHandler(db)

	// Configurer les routes
	mux := http.NewServeMux()
	mux.HandleFunc("/order", handler.CreateOrder)
	mux.HandleFunc("/health", handler.Health)

	// Créer le serveur
	server := &http.Server{
		Addr:         ":8080",
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	fmt.Println("Server starting on :8080")
	fmt.Printf("Go version: %s\n", runtime.Version())
	fmt.Printf("CPU cores: %d\n", runtime.NumCPU())

	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
```

---

## 6. Tableau récapitulatif comparatif

### 6.1 Comparaison des concepts fondamentaux

| Caractéristique | Processus | Thread | Coroutine |
| :--- | :--- | :--- | :--- |
| **Ordonnanceur** | Système d'exploitation | Système d'exploitation | Programme utilisateur / runtime |
| **Surcoût de commutation** | ~1-10 ms | ~1-10 μs | ~100 ns |
| **Empreinte mémoire** | ~10 Mo+ | ~1 Mo | ~2 Ko |
| **Mode de communication** | IPC | Mémoire partagée | Mémoire partagée / Channel |
| **Besoin de synchronisation** | Non nécessaire | Verrou nécessaire | Verrou nécessaire / coopératif |
| **Impact d'un plantage** | Processus concerné uniquement | Tout le processus | Contrôlable |
| **Scénario adapté** | Forte isolation, multi-tenant | Intensif CPU | Intensif E/S |
| **Langages typiques** | Tous les langages | Tous les langages | Go, Python, JS, Rust |

### 6.2 Guide de choix du modèle de concurrence

| Scénario | Modèle recommandé | Raison |
| :--- | :--- | :--- |
| Passerelle de services web | Coroutine + E/S asynchrones | Haute concurrence de connexions, faible empreinte mémoire |
| Service de communication temps réel | Coroutine + connexions persistantes | Maintien de nombreuses connexions WebSocket |
| Pipeline de traitement de données | Multi-processus + coroutines | Exploitation multicœur, E/S non bloquantes |
| Calcul scientifique | Multi-thread / multi-processus | Intensif CPU, nécessite le calcul parallèle |
| Architecture microservices | Multi-processus + coroutines | Isolation entre services, haute concurrence interne |
| Systèmes embarqués | Coroutine / thread unique | Ressources limitées, ordonnancement déterministe |

### 6.3 Tableau des correspondances terminologiques

| Terme anglais | Correspondance chinoise | Explication |
| :--- | :--- | :--- |
| **Process** | 进程 | Unité de base d'allocation des ressources du système d'exploitation, espace mémoire indépendant |
| **Thread** | 线程 | Unité de base d'ordonnancement du CPU, partage l'espace mémoire du processus |
| **Coroutine** | 协程 | Thread léger en espace utilisateur, ordonnancé par le programme |
| **Concurrency** | 并发 | Plusieurs tâches exécutées en alternance, progressent simultanément au niveau macro |
| **Parallelism** | 并行 | Plusieurs tâches véritablement exécutées simultanément, nécessite le support multicœur |
| **Context Switch** | 上下文切换 | Processus de passage du CPU d'une tâche à une autre |
| **Blocking I/O** | 阻塞 I/O | Le thread est suspendu en attendant la fin de la requête E/S |
| **Non-blocking I/O** | 非阻塞 I/O | Retour immédiat après la requête E/S, sans attendre le résultat |
| **Async I/O** | 异步 I/O | L'achèvement de l'E/S est notifié à l'appelant par callback ou mécanisme de notification |
| **Event Loop** | 事件循环 | Mécanisme d'ordonnancement des coroutines, écoute et distribue continuellement les événements |
| **Goroutine** | Go 协程 | Implémentation de thread léger en Go |
| **Channel** | 通道 | Mécanisme de communication entre coroutines en Go |
| **Mutex** | 互斥锁 | Primitive de synchronisation pour protéger les ressources partagées |
| **Semaphore** | 信号量 | Contrôle le nombre de threads accédant simultanément à une ressource |
| **Deadlock** | 死锁 | Plusieurs threads attendent mutuellement la libération de ressources, provoquant un blocage permanent |
| **Race Condition** | 竞态条件 | Plusieurs threads accèdent simultanément aux données partagées, rendant le résultat indéterminé |
| **Thread Pool** | 线程池 | Groupe de threads pré-créés et réutilisés pour réduire le surcoût de création/destruction |
| **Work Stealing** | 工作窃取 | Un thread inactif "vole" des tâches dans la file d'un thread occupé pour les exécuter |
| **Zero-copy** | 零拷贝 | Transfert de données entre espace noyau et espace utilisateur sans copie CPU |
| **C10K Problem** | C10K 问题 | Défi de traiter 10 000 connexions simultanément sur une seule machine |
| **C10M Problem** | C10M 问题 | Défi ultime de traiter 10 millions de connexions simultanément sur une seule machine |

---

## 7. En conclusion

### 7.1 Les règles d'or de la programmation concurrente

1. **Ne pas optimiser prématurément** : faites d'abord fonctionner le code correctement, puis envisagez l'optimisation des performances
2. **Éviter l'état partagé** : "ne pas communiquer en partageant la mémoire, mais partager la mémoire en communiquant"
3. **Exposer les erreurs le plus tôt possible** : les bugs de concurrence sont souvent difficiles à reproduire, il faut les exposer autant que possible lors de la phase de test
4. **Limiter le nombre de tâches concurrentes** : la concurrence illimitée équivaut à l'absence de protection, utilisez des sémaphores ou des pools de connexions
5. **Surveillance et observabilité** : un système concurrent doit avoir une surveillance complète pour localiser rapidement les problèmes

### 7.2 Feuille de route d'apprentissage

```
Étape 1 : Compréhension fondamentale
    ├── Comprendre les concepts de base processus/thread
    ├── Apprendre les primitives de synchronisation (verrous, sémaphores, variables de condition)
    └── Écrire des programmes multithread simples

Étape 2 : Approfondissement des principes
    ├── Comprendre le modèle mémoire et la visibilité
    ├── Apprendre la programmation sans verrou et les opérations atomiques
    ├── Comprendre les pools de threads et le work stealing
    └── Analyser les interblocages et les conditions de concurrence

Étape 3 : Applications avancées
    ├── Maîtriser les coroutines et la programmation asynchrone
    ├── Apprendre les modèles de concurrence de Go/Python/Rust
    ├── Comprendre la concurrence dans les systèmes distribués
    └── Optimisation des performances et planification de capacité

Étape 4 : Niveau expert
    ├── Concevoir des architectures de systèmes hautement concurrents
    ├── Résoudre des bugs de concurrence complexes
    ├── Développer des frameworks de programmation concurrente
    └── Partager et diffuser les connaissances sur la concurrence
```

Nous espérons que ce guide vous aidera à construire une compréhension systématique de la programmation concurrente. Rappelez-vous, **la concurrence n'est pas une fin, mais un moyen** — le véritable objectif est de construire des services performants et hautement disponibles. Comprenez les principes, choisissez le bon modèle, écrivez du bon code, et vous irez loin sur le chemin de la concurrence.