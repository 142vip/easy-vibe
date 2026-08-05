# An Introduction to Package Managers

> 💡 **Learning Guide**: You don't have to reinvent the wheel when writing code — 99% of the functionality you need has already been written and published online by someone else. A **package manager** is the tool that helps you find, download, and manage these "ready-made parts." This chapter revolves around one core question: **how to make code dependencies reproducible, collaborative, and maintainable?**

---

## 0. Motivation for Definitelying Need a Package Manager

Imagine you want to write a Node.js program that makes HTTP requests. There are two paths:

- **Method A (manual)**: Implement TCP connections, HTTP protocol parsing, redirect handling, timeout mechanisms yourself... probably thousands of lines of code, months of debugging.
- **Method B (package manager)**: `npm install axios`, done in ten seconds with one line of code.

A package manager is essentially an **"app store" for code**. It helps you:

1. Find libraries published by others in a central repository (Registry)
2. Automatically download and install them into your project
3. Handle the libraries that your libraries depend on (dependencies of dependencies)
4. Record the exact versions you're using so team collaboration doesn't break

---

## 1. Package Managers Across Language/System Ecosystems

Different programming languages and operating systems have their own ecosystem toolchains, but the underlying logic is exactly the same.

👇 **Try it out**: Select an ecosystem you're familiar with and explore its mainstream package management tools.

<PackageManagerOverviewDemo />

### 1.1 Placement of Packagesing Come From — The Registry

Every ecosystem has a central repository behind it that stores all downloadable packages:

| Ecosystem | Registry | Package Count |
| :--- | :--- | :--- |
| JavaScript | [npmjs.com](https://npmjs.com) | 2 million+ |
| Python | [pypi.org](https://pypi.org) | 500K+ |
| Rust | [crates.io](https://crates.io) | 150K+ |
| Go | [pkg.go.dev](https://pkg.go.dev) | 500K+ |
| macOS/Linux Tools | [formulae.brew.sh](https://formulae.brew.sh) | 7,000+ |
| Windows Software | [winget.run](https://winget.run) / [chocolatey.org](https://chocolatey.org) | Tens of thousands |

### 1.2 JavaScript's Big Three: npm vs yarn vs pnpm

Similar functionality, with differences mainly in **speed and disk usage**:

```text
Disk usage: pnpm (hard link sharing) < yarn PnP (zero node_modules) < npm (full copy)
Install speed: pnpm ≈ yarn > npm
Usage: npm (most universal) > pnpm (recommended for new projects) > yarn (some teams)
```

**Recommendation**: Use `pnpm` for new projects, stick with the existing tool for existing projects, and don't switch casually.

### 1.3 Windows's Big Three: winget vs Chocolatey vs Scoop

| | winget | Chocolatey | Scoop |
| :--- | :--- | :--- | :--- |
| **Official backing** | Microsoft official | Third-party | Third-party |
| **Requires admin** | Partially needed | Yes | **Not needed** |
| **Best for** | Daily software installation | Enterprise batch deployment | Dev tool management |
| **Package count** | Many, growing fast | Most (10,000+) | Focused on dev tools |

**Recommendation**: Use `winget` for daily use, `scoop` for dev tools, `Chocolatey` for enterprise automation.

---

## 2. Installing Packages — What Happens Behind the Scenes

After typing `npm install axios`, the command line goes quiet for a few seconds, and then it's done. What exactly happened during those seconds?

👇 **Try it out**: Select a package, click "Run," and observe the full installation process.

<PackageInstallDemo />

### 2.1 The Four Stages Explained

**① Dependency Resolution**

The package manager first "understands" what you want to install. Take `axios` as an example — it itself depends on packages like `follow-redirects`, `form-data`, etc., which also need to be installed. This process is called **building the dependency tree**.

**② Fetch**

Download all needed packages from the Registry (compressed `.tgz` archives). Smart package managers will:
- Download multiple packages in parallel instead of waiting one by one
- Check the local cache first — if there's a hit, skip the network

**③ Link**

Extract the downloaded packages into the `node_modules/` directory and set up the reference relationships.

**④ Write Lockfile**

Write the **exact version numbers** from this installation into `package-lock.json` (or `yarn.lock` / `pnpm-lock.yaml`).

### 2.2 Most Common Commands Cheat Sheet

```bash
# ── JavaScript (npm) ──────────────────────────────────
npm install              # Install all dependencies per package.json
npm install axios        # Install a new package (production dependency)
npm install -D jest      # Install a dev dependency (only used during development)
npm install -g tsx       # Global install (available in any directory)
npm uninstall axios      # Uninstall a package
npm update               # Upgrade all packages to latest compatible versions
npm run build            # Run scripts defined in package.json
npx create-react-app .   # Run temporarily without installing to project

# ── Python (pip) ──────────────────────────────────────
pip install requests           # Install a package
pip install requests==2.28.0   # Install a specific version
pip freeze > requirements.txt  # Export current dependency list
pip install -r requirements.txt # Install from a list

# ── Rust (cargo) ──────────────────────────────────────
cargo add serde    # Add a dependency (auto-updates Cargo.toml)
cargo build        # Build the project
cargo test         # Run tests
cargo run          # Run the project

# ── Go (go mod) ───────────────────────────────────────
go get github.com/gin-gonic/gin  # Add a dependency
go mod tidy                      # Clean up dependencies (remove extras, add missing)
go build ./...                   # Build

# ── Windows (winget) ──────────────────────────────────
winget install Git.Git           # Install software
winget upgrade --all             # Update all installed software
```

### 2.3 Overview of npm scripts

The `scripts` field in `package.json` is npm's built-in **task runner**:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "jest",
    "lint": "eslint src/"
  }
}
```

Running: `npm run dev`, `npm run build`. Benefits:
- **Unified entry point**: Team members don't need to memorize underlying tool commands
- **Auto environment setup**: Running automatically adds `node_modules/.bin` to PATH, so locally installed tools are directly usable

---

## 3. Global vs Local Installation

This is one of the most confusing concepts for beginners.

### 3.1 The Difference

```bash
npm install axios        # Local install: into ./node_modules/, only available in current project
npm install -g typescript  # Global install: into system directory, available in any project/directory
```

| | Local Install | Global Install |
| :--- | :--- | :--- |
| **Location** | `./node_modules/` | System-level directory (e.g., `/usr/local/lib/`) |
| **Best for** | Project dependency libraries (axios, vue, react) | CLI tools (tsc, eslint, create-react-app) |
| **Version isolation** | Each project has independent versions ✅ | One version shared across the machine ⚠️ |
| **Team consistency** | Lockfile ensures consistency ✅ | Different people may have different versions ⚠️ |

### 3.2 The Golden Rule

> **Library dependencies (axios, lodash, vue) should always be installed locally;
> CLI tools (tsc, eslint) should preferably be installed locally too, invoked with `npx`.**

**Why are CLI tools also recommended for local installation?**

Suppose you globally installed `eslint@8`, but Project A needs the new rules from `eslint@9` — you'd have to switch back and forth between global and project versions. Install `eslint` locally and invoke it with `npx eslint .`, so each project can independently configure its own version.

### 3.3 npx — Run Temporarily, Don't Pollute the Environment

`npx` is npm's built-in package runner that lets you **run a package without installing it**:

```bash
# Run create-vue without installing it, to initialize a project
npx create-vue my-project

# Run prettier without installing it, to format files
npx prettier --write src/

# Force a specific version (ignoring any installed version)
npx typescript@5.4 tsc --version
```

Python's `uvx` and Rust's `cargo run` also provide similar "run temporarily" capabilities:

```bash
uvx ruff check .       # Python: temporarily run the ruff checker
cargo install ripgrep  # Rust: install globally, becomes system command rg
```

---

## 4. The Secret of Version Numbers — Semantic Versioning

In `package.json`, you'll see entries like:

```json
{
  "dependencies": {
    "axios": "^1.6.8",
    "typescript": "~5.4.0"
  }
}
```

What do `^` and `~` mean here?

👇 **Try it out**: Hover over the parts of a version number to understand their meaning; click range operators to see which versions are accepted.

<DependencyTreeDemo />

### 4.1 Motivation for Noting Pin the Version

| Approach | Pros | Cons |
| :--- | :--- | :--- |
| `"axios": "1.6.8"` (exact pin) | Fully predictable | Security patches can't auto-update |
| `"axios": "^1.6.8"` (compatible range, recommended) | Auto-get bug fixes and new features | Rarely may introduce minor incompatibilities |
| `"axios": "*"` (any version) | Always latest | Major version upgrades can completely break code |

**Best practice**: Declare ranges with `^` + pin actual versions with a lockfile — use both together.

### 4.2 Overview of Dependency Hell

When you depend on 50 packages, and each of those depends on several more, the "dependency tree" can have hundreds of nodes. If two of your dependencies need **incompatible versions of the same library**, you have a "dependency conflict."

How different ecosystems solve this:
- **npm v3+**: Same major version hoisted to top level and shared; different major versions each get their own copy
- **pnpm**: Hard links + strict isolation, fundamentally preventing "phantom dependencies" (packages you can use without declaring)
- **cargo (Rust)**: Language-level enforcement that each package can only depend on the same version, completely avoiding conflicts
- **go mod (Go)**: Minimum Version Selection (MVS) strategy, choosing the lowest version that satisfies all constraints

---

## 5. Lockfiles — The Cornerstone of Team Collaboration

### 5.1 Motivation for needing a Lockfile

Suppose `package.json` says `"axios": "^1.6.0"`:

- You install today → gets `1.6.8`
- Your teammate installs tomorrow → might get `1.7.0` (released last night)
- CI server next week → might get `1.7.1`

Same code, three different results. A **lockfile** records the exact version of every package, so everyone installs identically.

| Scenario | Command | Behavior |
| :--- | :--- | :--- |
| Dev environment sync | `npm install` | References lockfile, doesn't upgrade versions |
| CI / production deploy | `npm ci` | **Strictly** follows lockfile; errors if there's a discrepancy |
| Active version upgrade | `npm update` | Upgrades within allowed range, updates lockfile |

### 5.2 Should Lockfiles Be Committed to Git

**Applications must commit; libraries published to npm may not.**

- ✅ **Web apps, backend services**: Must commit to ensure deployment and dev environments are identical
- ❌ **npm-published libraries**: Usually not committed; library users have their own lockfiles
- ✅ **Python projects**: `requirements.txt` itself acts as a lockfile and should be committed
- ✅ **Go projects**: `go.sum` must be committed for integrity verification

---

## 6. Python Virtual Environments

Python has a concept that requires special attention: **virtual environments (venv)**.

**Why are they needed?**

Python installs packages **globally** by default. Your Project A needs `requests==2.28`, and Project B needs `requests==2.31` — they'll conflict.

**Solution**: Create an independent virtual environment for each project so they don't interfere with each other.

```bash
# 1. Create a virtual environment (run in project root directory)
python -m venv .venv

# 2. Activate the virtual environment
source .venv/bin/activate        # macOS / Linux
.venv\Scripts\activate           # Windows (Command Prompt CMD)
.venv\Scripts\Activate.ps1       # Windows (PowerShell)

# 3. After activation, pip install only affects the current virtual environment, not the global one
pip install requests

# 4. Exit the virtual environment
deactivate
```

> ⚠️ **Common Windows issue**: PowerShell blocks script execution by default. First run:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

**Modern alternatives**:
- `conda create -n myproject python=3.11` — even manages the Python version itself
- `uv venv && source .venv/bin/activate` — written in Rust, creates blazingly fast

**Should `.venv` be committed to Git?**

No! `.venv` is generated locally and should be added to `.gitignore`. Use `requirements.txt` or `pyproject.toml` to describe dependencies.

---

## 7. Common Issues Cheat Sheet

**Q: Should `node_modules` be committed to Git?**

No! It's typically hundreds of MB and should be added to `.gitignore`. With `package-lock.json`, anyone can quickly rebuild it with `npm install`.

**Q: Installation fails / getting weird errors?**

```bash
# Clear cache, delete old installation, start fresh
npm cache clean --force
rm -rf node_modules package-lock.json   # macOS/Linux
rmdir /s /q node_modules && del package-lock.json  # Windows CMD
npm install
```

**Q: Installation is too slow?**

```bash
# Switch to a domestic mirror (recommended to write to .npmrc file, don't pollute global config)
echo "registry=https://registry.npmmirror.com" > .npmrc

# pip can also configure mirrors
pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple
```

**Q: How to handle package security vulnerabilities?**

```bash
npm audit          # Scan for known vulnerabilities
npm audit fix      # Auto-fix compatible vulnerabilities
npm audit fix --force  # Force upgrade (may be breaking, use with caution)
```

**Q: How to tell if a package is trustworthy?**

Check on [npmjs.com](https://npmjs.com) or [bundlephobia.com](https://bundlephobia.com):
- Weekly downloads (higher is more trustworthy)
- Last update time (be cautious if not updated in 2+ years)
- Number of dependencies (more dependencies = more risk)
- GitHub Stars and issue activity

**Q: Where does winget install software on Windows?**

winget installs to system directories (requires admin) or `%LOCALAPPDATA%\Microsoft\WindowsApps` by default. Scoop installs all software uniformly in `%USERPROFILE%\scoop\apps\`, making it easy to manage and migrate.

---

## 8. Terminology Reference

| English Term | Chinese Translation | Explanation |
| :--- | :--- | :--- |
| **Package** | 包 / 库 | Code modules written and published by others |
| **Registry** | 注册表 / 仓库 | The central storage server for all packages (e.g., npmjs.com) |
| **Dependency** | 依赖 | Other packages your project needs to run |
| **devDependency** | 开发依赖 | Packages only needed during development (test frameworks, build tools, etc.) |
| **Lockfile** | 锁文件 | Records exact version numbers, ensuring environment consistency |
| **SemVer** | 语义化版本 | MAJOR.MINOR.PATCH version naming convention |
| **node_modules** | 模块目录 | The directory where npm-installed packages are actually stored |
| **venv** | 虚拟环境 | An isolated sandbox for Python project packages |
| **tarball** | 压缩包 | The distribution format of packages, usually `.tgz` files |
| **Hoisting** | 提升 | npm lifts sub-dependencies to the top level to avoid duplicate installations |
| **Phantom Dependency** | 幽灵依赖 | Packages that can be used without being declared in config (pnpm prevents this) |
| **npx** | — | npm's built-in package runner, runs packages temporarily without installing |
| **go.sum** | — | Go module hash verification file, prevents dependency tampering |
| **Crate** | — | The unit name for "packages" in the Rust ecosystem |
| **winget** | — | Windows' official package manager (built into Windows 10/11) |

---

## Summary: The Essence of Package Managers

Remember the core with these four points:

1. **Package manager = app store**: Helps you find, install, and manage code parts so you don't reinvent the wheel.
2. **Lockfile = team contract**: Pins exact versions, making "it works on my machine" a thing of the past.
3. **Semantic versioning = communication language**: `^` safely gets updates; when MAJOR changes, be careful.
4. **Local > Global**: Install project dependencies locally whenever possible; use `npx` / `uvx` for temporary tool runs to keep your environment clean.
