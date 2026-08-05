# Introducción a SSH y autenticación por clave

> 💡 **Guía de aprendizaje**: ¿Escribes la contraseña cada vez que haces `git push`? ¿Al conectarte por SSH siempre aparece "Permission denied"? Este capítulo te explica en 5 minutos el原理 de la autenticación por clave SSH, y cómo configurar acceso sin contraseña a GitHub y servidores con un solo comando.

---

## 0. Seguramente has tenido estas experiencias

- `git push` muestra repetidamente la ventana de contraseña, muy molesto
- La conexión SSH al servidor falla, no sabes qué son `id_rsa` e `id_ed25519`
- Has oído hablar de "clave pública" y "clave privada", pero no tienes claro cuál se comparte y cuál se guarda

**La contradicción central**: Las contraseñas son inseguras y molestas. Las claves SSH resuelven simultáneamente la seguridad y la comodidad.

---

## 1. Contraseña vs Clave: Motivación de claves son mejores

👇 Pruébalo: Compara la diferencia entre login con contraseña y login con clave

<SSHAuthDemo />

::: tip 💡 Resumen en una frase
Login con contraseña = enviar la contraseña cada vez para que el otro lado la verifique (puede ser interceptada);
Login con clave = demostrar que "tengo la llave" sin necesidad de mostrarla (la clave privada nunca se transmite).
:::

---

## 2. Cifrado asimétrico: Clave pública y clave privada

Las claves SSH se basan en **cifrado asimétrico**, generando dos llaves a la vez:

| | Clave privada (Private Key) | Clave pública (Public Key) |
|---|---|---|
| **Ubicación** | Tu ordenador `~/.ssh/id_ed25519` | Servidor/GitHub |
| **¿Se puede compartir?** | ❌ Nunca | ✅ Libremente |
| **Función** | Firmar (demostrar identidad) | Verificar (comprobar identidad) |
| **Analogía** | La llave | La cerradura |

### Tipos de clave comunes

| Tipo | Comando | Recomendación | Observaciones |
|---|---|---|---|
| **Ed25519** | `ssh-keygen -t ed25519` | ⭐⭐⭐ | La más reciente, rápida y segura |
| **RSA** | `ssh-keygen -t rsa -b 4096` | ⭐⭐ | Buena compatibilidad, pero más lenta |
| **ECDSA** | `ssh-keygen -t ecdsa` | ⭐ | Generalmente no recomendada |

---

## 3. Práctica: Generar y configurar claves SSH

### 3.1 Generar un par de claves

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

Tras ejecutarlo, te preguntará:
- **Ruta del archivo**: Pulsa Enter para usar la ruta por defecto `~/.ssh/id_ed25519`
- **Frase de contraseña**: Puedes añadir protección extra (o dejarla vacía)

### 3.2 Añadir la clave pública a GitHub

```bash
# 1. Copiar el contenido de la clave pública
cat ~/.ssh/id_ed25519.pub | pbcopy  # macOS
cat ~/.ssh/id_ed25519.pub | xclip   # Linux

# 2. Abrir GitHub → Settings → SSH and GPG keys → New SSH key
# 3. Pegar la clave pública y guardar

# 4. Probar la conexión
ssh -T git@github.com
# Si funciona verás: Hi username! You've been authenticated...
```

### 3.3 Añadir la clave pública al servidor

```bash
# Método 1: ssh-copy-id (recomendado)
ssh-copy-id user@your-server

# Método 2: Copia manual
cat ~/.ssh/id_ed25519.pub | ssh user@server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

## 4. SSH Config: Adiós a los comandos largos

Configura alias en `~/.ssh/config`, configuras una vez y disfrutas para siempre:

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

Resultado tras la configuración:

| Antes | Después |
|---|---|
| `ssh -i ~/.ssh/id_ed25519 deploy@192.168.1.100` | `ssh dev` |
| Tienes que recordar la IP y el usuario cada vez | Solo recuerda el alias |

---

## 5. Solución de problemas comunes

| Problema | Causa | Solución |
|---|---|---|
| `Permission denied (publickey)` | La clave pública no se ha añadido al servidor | `ssh-copy-id user@server` |
| `WARNING: UNPROTECTED PRIVATE KEY FILE` | Los permisos del archivo de clave privada son demasiado amplios | `chmod 600 ~/.ssh/id_ed25519` |
| `Could not resolve hostname` | Error en la configuración de SSH Config | Revisa el formato de `~/.ssh/config` |
| GitHub sigue pidiendo contraseña | Estás usando HTTPS en lugar de SSH | Usa `git@github.com:user/repo.git` |

---

## 6. Resumen

::: tip 📚 Puntos clave
1. **Clave > Contraseña**: La clave privada nunca se transmite, mucho más segura que una contraseña
2. **Recomendado Ed25519**: El algoritmo de claves más moderno, rápido y seguro
3. **La clave pública se comparte libremente, la privada nunca se filtra**: Recuerda esta regla de oro
4. **SSH Config**: Configura un alias una vez, después `ssh alias` conecta con un solo comando
5. **GitHub/GitLab**: Tras añadir la clave pública, `git push/pull` ya no necesita contraseña
:::

**Siguiente paso**:
- [Principios de puertos y localhost](./ports-localhost) - Entender los fundamentos de la conexión en red
- [Introducción a las variables de entorno y PATH](./environment-path) - Entender la configuración del sistema
