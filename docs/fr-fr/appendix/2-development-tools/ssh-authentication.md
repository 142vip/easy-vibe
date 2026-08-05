# Introduction : SSH et authentification par clé

> 💡 **Guide d'apprentissage** : Vous devez saisir votre mot de passe à chaque `git push` ? Vous obtenez toujours "Permission denied" en vous connectant à un serveur ? Ce chapitre vous explique en 5 minutes le principe de l'authentification par clé SSH et comment vous connecter sans mot de passe à GitHub et à vos serveurs.

---

## 0. Vous avez sûrement déjà rencontré ces situations

- `git push` vous demande sans cesse votre mot de passe, ce qui est agaçant
- La connexion SSH au serveur échoue et vous ne savez pas ce que sont `id_rsa` et `id_ed25519`
- Vous avez entendu parler de « clé publique » et « clé privée », mais vous ne savez pas laquelle partager et laquelle garder

**Le problème central** : le mot de passe est à la fois peu sécurisé et peu pratique. Les clés SSH résolvent simultanément les problèmes de sécurité et de commodité.

---

## 1. Mot de passe vs Clé : pourquoi la clé est meilleure

👇 Essayez par vous-même : comparez la connexion par mot de passe et par clé

<SSHAuthDemo />

::: tip 💡 En résumé
Connexion par mot de passe = envoyer le mot de passe à chaque fois pour que l'autre le vérifie (le mot de passe peut être intercepté) ;
Connexion par clé = prouver que « j'ai la clé » sans jamais la montrer (la clé privée n'est jamais transmise).
:::

---

## 2. Chiffrement asymétrique : clé publique et clé privée

Les clés SSH reposent sur le **chiffrement asymétrique**, qui génère deux clés en une seule opération :

| | Clé privée (Private Key) | Clé publique (Public Key) |
|---|---|---|
| **Emplacement** | Votre ordinateur `~/.ssh/id_ed25519` | Serveur / GitHub |
| **Peut-on la partager ?** | ❌ Jamais | ✅ Sans problème |
| **Fonction** | Signer (prouver l'identité) | Vérifier la signature (valider l'identité) |
| **Analogie** | La clé | Le cadenas |

### Types de clés courants

| Type | Commande | Recommandation | Description |
|---|---|---|---|
| **Ed25519** | `ssh-keygen -t ed25519` | ⭐⭐⭐ | Le plus récent, le plus rapide et le plus sécurisé |
| **RSA** | `ssh-keygen -t rsa -b 4096` | ⭐⭐ | Bonne compatibilité, mais plus lent |
| **ECDSA** | `ssh-keygen -t ecdsa` | ⭐ | Généralement déconseillé |

---

## 3. Mise en pratique : générer et configurer une clé SSH

### 3.1 Générer une paire de clés

```bash
ssh-keygen -t ed25519 -C "votre@email.com"
```

Après exécution, il vous sera demandé :
- **Chemin du fichier** : appuyez sur Entrée pour utiliser le chemin par défaut `~/.ssh/id_ed25519`
- **Phrase de passe** : vous pouvez définir une protection supplémentaire (ou laisser vide)

### 3.2 Ajouter la clé publique à GitHub

```bash
# 1. Copier le contenu de la clé publique
cat ~/.ssh/id_ed25519.pub | pbcopy  # macOS
cat ~/.ssh/id_ed25519.pub | xclip   # Linux

# 2. Ouvrir GitHub → Settings → SSH and GPG keys → New SSH key
# 3. Coller la clé publique, enregistrer

# 4. Tester la connexion
ssh -T git@github.com
# Succès : Hi username! You've been authenticated...
```

### 3.3 Ajouter la clé publique au serveur

```bash
# Méthode 1 : ssh-copy-id (recommandé)
ssh-copy-id utilisateur@votre-serveur

# Méthode 2 : copie manuelle
cat ~/.ssh/id_ed25519.pub | ssh utilisateur@serveur "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

## 4. SSH Config : dites adieu aux longues commandes

Configurez des alias dans `~/.ssh/config`, une seule configuration pour une utilisation à vie :

```
Host dev
  HostName 192.168.1.100
  User deploy
  IdentityFile ~/.ssh/id_ed25519

Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
```

Effet après configuration :

| Avant | Après |
|---|---|
| `ssh -i ~/.ssh/id_ed25519 deploy@192.168.1.100` | `ssh dev` |
| Mémoriser l'IP et le nom d'utilisateur à chaque fois | Un seul alias suffit |

---

## 5. Dépannage des problèmes courants

| Problème | Cause | Solution |
|---|---|---|
| `Permission denied (publickey)` | Clé publique non ajoutée au serveur | `ssh-copy-id utilisateur@serveur` |
| `WARNING: UNPROTECTED PRIVATE KEY FILE` | Permissions du fichier de clé privée trop larges | `chmod 600 ~/.ssh/id_ed25519` |
| `Could not resolve hostname` | Erreur dans la configuration SSH Config | Vérifiez le format de `~/.ssh/config` |
| GitHub demande toujours le mot de passe | Vous utilisez HTTPS au lieu de SSH | Passez à `git@github.com:utilisateur/repo.git` |

---

## 6. Résumé

::: tip 📚 Points essentiels
1. **Clé > Mot de passe** : la clé privée n'est jamais transmise, bien plus sécurisé qu'un mot de passe
2. **Recommandation Ed25519** : l'algorithme de clé le plus moderne, rapide et sécurisé
3. **Clé publique partageable, clé privée confidentielle** : retenez cette règle d'or
4. **SSH Config** : configurez un alias une fois, puis connectez-vous en un clic avec `ssh alias`
5. **GitHub/GitLab** : après avoir ajouté votre clé publique, plus besoin de mot de passe pour `git push/pull`
:::

**Prochaines étapes d'apprentissage** :
- [Ports et localhost](./ports-localhost) - Comprendre les bases des connexions réseau
- [Variables d'environnement et PATH](./environment-path) - Comprendre la configuration système