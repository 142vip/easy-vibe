# An Introduction to SSH and Key Authentication

> 💡 **Learning Guide**: Tired of entering your password every time you `git push`? Getting "Permission denied" when connecting to a server? This chapter takes 5 minutes to explain how SSH key authentication works and how to set up password-free login to GitHub and servers with a single command.

---

## 0. You've Definitely Encountered These Situations

- `git push` keeps popping up a password prompt — super annoying
- SSH connection to a server fails, and you don't know what `id_rsa` and `id_ed25519` are
- You've heard of "public keys" and "private keys" but aren't sure which one to share and which to keep

**The core problem**: passwords are both insecure and inconvenient. SSH keys solve both security and convenience at the same time.

---

## 1. Password vs. Key: Why Keys Are Better

👇 Try it out: Compare the difference between password login and key login

<SSHAuthDemo />

::: tip 💡 One-Sentence Summary
Password login = sending the password each time for the other side to verify (the password could be intercepted);
Key login = proving "I have the key" without showing the key to anyone (the private key is never transmitted).
:::

---

## 2. Asymmetric Encryption: Public Key and Private Key

SSH keys are based on **asymmetric encryption**, generating two keys at once:

| | Private Key | Public Key |
|---|---|---|
| **Stored on** | Your computer `~/.ssh/id_ed25519` | Server / GitHub |
| **Can you share it?** | ❌ Never | ✅ Share freely |
| **Function** | Sign (prove identity) | Verify signature (confirm identity) |
| **Analogy** | Key | Lock |

### Common Key Types

| Type | Command | Recommendation | Notes |
|---|---|---|---|
| **Ed25519** | `ssh-keygen -t ed25519` | ⭐⭐⭐ | Newest, fastest, most secure |
| **RSA** | `ssh-keygen -t rsa -b 4096` | ⭐⭐ | Good compatibility, but slower |
| **ECDSA** | `ssh-keygen -t ecdsa` | ⭐ | Generally not recommended |

---

## 3. Hands-on: Generating and Configuring SSH Keys

### 3.1 Generate a Key Pair

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

After running, you'll be prompted for:
- **File path**: Press Enter to use the default path `~/.ssh/id_ed25519`
- **Passphrase**: You can set additional protection (or leave it empty)

### 3.2 Add the Public Key to GitHub

```bash
# 1. Copy the public key content
cat ~/.ssh/id_ed25519.pub | pbcopy  # macOS
cat ~/.ssh/id_ed25519.pub | xclip   # Linux

# 2. Open GitHub → Settings → SSH and GPG keys → New SSH key
# 3. Paste the public key and save

# 4. Test the connection
ssh -T git@github.com
# Success message: Hi username! You've been authenticated...
```

### 3.3 Add the Public Key to a Server

```bash
# Method 1: ssh-copy-id (recommended)
ssh-copy-id user@your-server

# Method 2: Manual copy
cat ~/.ssh/id_ed25519.pub | ssh user@server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

## 4. SSH Config: Say Goodbye to Long Commands

Configure aliases in `~/.ssh/config` — set it up once and benefit forever:

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

After configuration:

| Before | After |
|---|---|
| `ssh -i ~/.ssh/id_ed25519 deploy@192.168.1.100` | `ssh dev` |
| Memorize IP and username every time | Just remember one alias |

---

## 5. Common Issue Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| `Permission denied (publickey)` | Public key not added to server | `ssh-copy-id user@server` |
| `WARNING: UNPROTECTED PRIVATE KEY FILE` | Private key file permissions too broad | `chmod 600 ~/.ssh/id_ed25519` |
| `Could not resolve hostname` | SSH Config misconfigured | Check `~/.ssh/config` format |
| GitHub still asks for password | Using HTTPS instead of SSH | Switch to `git@github.com:user/repo.git` |

---

## 6. Summary

::: tip 📚 Key Takeaways
1. **Keys > Passwords**: Private keys are never transmitted, making them far more secure than passwords
2. **Ed25519 recommended**: The most modern key algorithm — fast and highly secure
3. **Share public keys freely, never leak private keys**: Remember this golden rule
4. **SSH Config**: Set up aliases once, then `ssh alias` connects instantly
5. **GitHub/GitLab**: After adding your public key, `git push/pull` never requires a password again
:::

**Next Steps**:
- [Principles of Ports and Localhost](./ports-localhost) - Understanding the basics of network connections
- [An Introduction to Environment Variables and PATH](./environment-path) - Understanding system configuration
