# An Introduction to Environment Variables and PATH

> 💡 **Learning Guide**: Every time you type `git` or `python` in the terminal, the system has to find where that program is located. Every time your code calls a large model API, the program needs to know which key to use. Both of these tasks rely on the same underlying mechanism — **environment variables**.

---

## 0. Every Program Carries a Set of Configuration

Every running program holds a set of "key=value" configurations called **environment variables**. The program can read these configurations at any time to learn about its current runtime environment.

Click on any variable in the list below to "view" its value in the terminal:

<EnvVarOverviewDemo />

---

## 1. PATH: How Shell Finds the Command You Typed

`PATH` is a special environment variable that stores a list of directory paths (separated by colons). When you type `git`, Shell searches through these directories one by one for an executable file named `git` — stopping as soon as it finds the first match.

```bash
$ echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

Select a command and observe how Shell searches through directories step by step:

<PathSearchDemo />

**Three key rules**:
- Directories listed earlier in PATH have higher priority
- Searching stops at the first match — no further directories are checked
- If none of the directories contain the command → `command not found`

---

## 2. Motivation for needing to Restart the Terminal After Installing a Tool

When you install tools like nvm, Homebrew, or conda, the installation script automatically appends a line to `~/.zshrc` to add its directory to PATH:

```bash
# Content automatically written by the installer (example)
export PATH="/usr/local/opt/python@3.12/bin:$PATH"
```

This line only executes when a **new Shell starts**. Already-open terminal windows are unaffected, so:

```bash
# Take effect immediately without restarting
source ~/.zshrc
```

**Common scenarios with AI development tools**:

```bash
# Ollama / pipx installed but getting "command not found"
which ollama          # Check actual installation location

# pip-installed CLI tool paths (add to PATH)
# macOS: ~/Library/Python/3.x/bin
# Linux: ~/.local/bin
export PATH="$PATH:$HOME/.local/bin"

# Recommended: use pipx to install CLI tools, manages PATH automatically
pipx install aider-chat
```

---

## 3. Variable Scope: Who Can See ThOverview of Variable

Environment variables are not broadcast to all programs — each process holds **its own copy**, inherited from the parent process. Modifying your own copy does not affect the parent process.

The diagram below shows three levels. Export a new variable at the "User Level" and see whether it appears at the "Process Level":

<EnvScopeDemo />

---

## 4. export: Determining Whether Child Processes Can Read a Variable

When setting a variable, including or omitting `export` makes a completely different difference:

<EnvExportDemo />

To make a variable persist across sessions, write the `export` statement into a configuration file:

```bash
# macOS (zsh)
echo 'export MY_VAR="value"' >> ~/.zshrc
source ~/.zshrc       # Takes effect immediately, no need to reopen the terminal

# Linux (bash)
echo 'export MY_VAR="value"' >> ~/.bashrc
source ~/.bashrc
```

---

## 5. API Keys: Never Hardcode Them in Your Source Code

When calling APIs from OpenAI, Anthropic, DeepSeek, and others, your key is essentially your "ID card + credit card." If it leaks, others can spend your quota — and you foot the bill.

The most common mistake is hardcoding the key directly in source code:

<ApiKeyDangerDemo />

---

## 6. Local Development: Managing Keys with .env Files

During local development, store keys in a `.env` file in the project root directory. Your code reads them via the dotenv library. `.env` must be added to `.gitignore` and never committed to Git.

Configure on the left, read on the right — switch languages to see both approaches:

<DotEnvDemo />

---

## 7. Production: Let the Runtime Platform Inject Keys

`.env` is a convenience tool for the development phase. On servers and cloud platforms, the **runtime environment** should be responsible for injecting keys. The code itself should be completely unaware of where the keys are stored:

<ServerSecretDemo />

---

## 8. Practical Troubleshooting

### `command not found`

```bash
# Step 1: Check if it's in PATH
which python3         # If there's output, it was found

# Step 2: Find the program's actual location (macOS)
brew list python | grep bin

# Step 3: Add the directory to PATH
export PATH="/found/path:$PATH"
source ~/.zshrc       # Remember to source after writing to config file
```

### Installed Two Versions, Not Using the One I Want

```bash
which python
# /usr/bin/python ← Old system version, earlier in PATH

# Put the new version's directory at the front of PATH
export PATH="/usr/local/bin:$PATH"

which python
# /usr/local/bin/python ← New version, now takes priority
```

### Variable Is Set, But the Program Can't Read It

| Cause | Solution |
|:---|:---|
| Forgot `export` | Add `export` and try again |
| Modified `~/.zshrc` but it didn't take effect | Run `source ~/.zshrc` |
| Using `.env` but didn't install dotenv | `pip install python-dotenv` / `npm install dotenv` |
| On server, variable only works in SSH session | Use systemd `EnvironmentFile` instead |

---

## Quick Glossary

| Term | Meaning |
|:---|:---|
| **PATH** | A list of directories where Shell searches for executables, colon-separated; order determines priority |
| **export** | Marks a variable as inheritable so child processes automatically get a copy |
| **source** | Re-executes a configuration file in the current Shell, making changes take effect immediately |
| **which** | Shows the executable file path for a command (the result of a PATH search) |
| **.env** | A project-local configuration file for development keys; must be added to `.gitignore` |
| **.env.example** | A template with complete variable names but empty values; safe to commit to Git |
| **chmod 600** | File permission: only the owner can read and write; suitable for protecting key files |
| **Secret Scanner** | GitHub and other platforms automatically scan for leaked keys and notify vendors to revoke them |
