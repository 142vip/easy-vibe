# Principles of Git Version Control

> 💡 **Learning Guide**: This chapter is written specifically for people who have never used Git. We won't start by making you memorize commands. Instead, we'll first understand "what problem Git is solving for you," and then step-by-step connect commands and concepts. After reading, you should be able to independently: make local commits, create branches, and push to GitHub.

---

## 0. First, a Question: Have You Experienced These Nightmares

**Scenario One: Version Hell**

You're writing a paper or code, and halfway through you realize you made a mistake and want to go back to the version from three days ago — but you can't find it.

```
project_v1.zip
project_v2_revised.zip
project_v3_final.zip
project_v3_final_really_final.zip
project_v3_final_absolutely_no_more_changes.zip
```

Every time you save a new copy, your hard drive gets messier, and you can't even remember which version changed what.

**Scenario Two: Collaboration Nightmare**

You and your teammate both modify the same file:
- You changed line 10, adding a login feature
- Your teammate changed line 10, fixing a bug
- You email code back and forth, and during the merge, one person's changes overwrite the other's
- Nobody knows which code is the correct version in the end

**Scenario Three: No "Undo" Button**

You deployed new code to production, and a bug appears. You want to urgently roll back to the previous stable version — but you don't know how, so you frantically scramble to find backups.

---

**Git was created to solve these three problems.**

Git is a **Version Control System**. Its essence is: **recording every "save" operation you make, forming a complete historical timeline that lets you return to any previous point in history at any time.**

It's no exaggeration to say that Git is one of the most important tools in modern software development. Nearly every company and every open-source project uses it.

---

## 1. Overview of Git and GitHub

Many beginners confuse these two concepts. Let's clarify:

| | Git | GitHub |
| :--- | :--- | :--- |
| **What is it** | A version control tool running on your computer | A website that hosts Git repositories (in the cloud) |
| **Where is it** | Your local computer | On the internet |
| **Can it be used independently** | ✅ Yes, it manages local history only | ❌ Needs to be used with Git |
| **Analogy** | Your local diary notebook | Cloud storage for your diary |

Simply put: **Git is the tool, GitHub is the hosting service.** Just like Word is the tool and OneDrive is cloud storage — they work together but are not the same thing.

Besides GitHub, similar services include GitLab, Gitee (China-based), and others.

---

## 2. Core Concept: The Three Areas

This is the most important design in all of Git. Once you understand these three areas, you understand the soul of Git.

Git divides your file states into three layers:

**Working Directory**
This is your **regular folder** — all the files you can see and are currently editing are here. You can change anything freely; Git will sense what you've changed but won't record anything.

**Staging Area (Index)**
This is a **"pre-commit transit station."** You can "put" files from the working directory that you want to save into the staging area — like putting packages into a shipping box. They haven't been sent out yet, but you've chosen what to send.

**Repository**
This is the **permanent archive of historical records**, hidden inside the `.git` folder. Every time you run `git commit`, the contents of the staging area are sealed into the repository, forming an immutable historical record.

👇 **Try it out**: Click the command buttons in order and observe how files flow between the three areas.

<GitCommitFlow />

### Motivation for the "Two-Step" Process (add + commit)

Many beginners ask: why can't you just save with one click? Why `add` first, then `commit`?

**Because in real-world development, you often don't want to commit all changes together.**

For example: today you modified 5 files:
- `login.js`: completed the login feature (want to commit)
- `style.css`: adjusted the login page styles (want to commit)
- `debug.log`: temporary debug output (**don't** want to commit)
- `experiment.js`: testing a new feature, not finished yet (**don't** want to commit)
- `todo.txt`: your personal notes (**don't** want to commit)

Without a staging area, you'd either commit all 5 files (messy commit history) or commit none of them.

With a staging area, you can precisely control: `git add login.js style.css` — only put these two files into the shipping box, then `commit`. This commit clearly records "login feature completed."

---

## 3. Using Git for the First Time: Initialization and Basic Workflow

### 3.1 Installation and Initialization

After installing Git (macOS comes with it; for Windows, download from git-scm.com), open the terminal and navigate to your project folder:

```bash
# Initialize a Git repository in the current folder
git init

# Git will create a hidden .git folder where all history is stored
# Output: Initialized empty Git repository in .../your-project/.git/
```

The first time you use it, you also need to tell Git who you are (this information will be attached to every commit):

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### 3.2 Daily Workflow: The Three-Step Save

After initialization, 90% of daily development is just repeating these three steps:

**Step 1: Check Status**

```bash
git status
```

This is the command you'll use the most, bar none. It tells you:
- Which branch you're on
- Which files have been modified (red = unstaged)
- Which files are in the staging area (green = staged, ready to commit)

**Step 2: Put Files into the Staging Area**

```bash
# Add a single file
git add login.js

# Add multiple files
git add login.js style.css

# Add all modified files in the current folder (. means "everything")
git add .
```

> ⚠️ Common beginner pitfall: `git add .` is very convenient but adds all changes, including files you may not want to commit. Build the habit of precise adds, or use `.gitignore` to exclude files you don't want to track (covered later).

**Step 3: Commit with a Message**

```bash
git commit -m "feat: add user login feature"
```

The text in quotes after `-m` is called the **commit message**. This is written for your future self and your teammates — make it meaningful.

### 3.3 How to Write Professional Commit Messages

```bash
# ❌ Bad examples — reading them tells you nothing about what was done
git commit -m "update"
git commit -m "fix"
git commit -m "changed some things"

# ✅ Good examples: type + colon + one-sentence description
git commit -m "feat: add user login feature"
git commit -m "fix: fix white screen issue on iOS Safari homepage"
git commit -m "docs: update deployment instructions in README"
git commit -m "refactor: split UserService into independent module"
git commit -m "style: unify code indentation to 2 spaces"
```

**Common prefix meanings:**

| Prefix | Meaning |
| :--- | :--- |
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code formatting (no functional change) |
| `refactor:` | Code refactoring (same functionality, improved structure) |
| `chore:` | Build, tools, dependencies |
| `test:` | Testing related |

Build this habit, and months later when you browse the history, you'll know at a glance what each commit did. This is especially important in team collaboration.

### 3.4 Viewing History

```bash
# Detailed format (full info for each commit)
git log

# Compact format (one line per commit, recommended for daily use)
git log --oneline

# Example output:
# a1b2c3d (HEAD -> main) feat: add user login feature
# 9f3e1b2 init: project initialization
```

---

## 4. Branch Concepts

**Branches** are Git's most powerful — and also most confusing for beginners — feature. But once you understand them, you'll find the design very elegant.

### 4.1 Overview of Branches Understanding Through Branch Isolation

Imagine you're playing an RPG game with a critical choice:
- Choice A: Challenge the final boss (develop a new feature)
- Choice B: Continue stabilizing the current situation (keep the main storyline intact)

If you make Choice A directly on your main save file and fail, your entire game progress is ruined.

But if you **copy your save file** and challenge the boss in the copy:
- Won? Merge the copy's progress back into the main save
- Lost? The main save is completely unaffected — delete the copy and try again

**Git branches are this "copy save" mechanism.**

In Git, the `main` (or `master`) branch is your "main save," which should always remain stable and usable. When you want to develop a new feature, you create a new branch from main, develop and test there, and merge back to main when done.

### 4.2 Branch Visualization Demo

👇 **Try it out**: Click the command buttons in order and observe how the branch graph below forks, extends, and eventually merges. Pay close attention to the HEAD label's position — it always points to "where you currently are."

<GitBranchVisual />

### 4.3 Branch Operations in Detail

**Create and switch to a new branch:**

```bash
# Method 1: Create first, then switch (two steps)
git branch feature-login      # Create branch
git checkout feature-login    # Switch to it

# Method 2: One step (recommended)
git checkout -b feature-login

# Output: Switched to a new branch 'feature-login'
```

After creating a branch, your command prompt will show the current branch name, for example:
```
user@mac ~/project (feature-login) $
```

**View all branches:**

```bash
git branch

# Output (* indicates the current branch):
# * feature-login
#   main
```

**Develop normally on a branch:**

```bash
# On the feature-login branch, modify code, add, commit — exactly the same as usual
git add login.js
git commit -m "feat: add login form HTML structure"

git add login.js api.js
git commit -m "feat: complete login API integration"
```

These commits exist only on the `feature-login` branch. The `main` branch has no idea what you've done.

**Switch back to the main branch and merge:**

```bash
# Switch back to main
git checkout main

# Merge all changes from feature-login
git merge feature-login

# After merging, you can delete the branch (optional)
git branch -d feature-login
```

### 4.4 Criteria for Branch Creation

| Scenario | Recommendation | Reason |
| :--- | :--- | :--- |
| Developing a new feature | ✅ Create a branch | Doesn't affect main line until feature is done; can abandon at any time |
| Fixing an urgent production bug | ✅ Create a `hotfix-xxx` branch from main | Fix and merge directly to production, without bringing in unfinished features |
| Parallel development with teammates | ✅ Each person creates their own branch | No interference; merge via Pull Request when done |
| Fixing a single typo | ❌ Just fix it on main | Very low risk, no need for a separate branch |

### 4.5 Common Team Branching Strategies

In real projects, teams usually agree on branch naming conventions and purposes:

| Branch Name | Purpose | Characteristics |
| :--- | :--- | :--- |
| `main` / `master` | Stable production code | Only tested code can enter; no direct pushes |
| `dev` / `develop` | Daily integration branch | All feature branches merge here first; after testing, goes to main |
| `feature/xxx` | Specific feature development | e.g., `feature/user-login`; merges to dev when complete |
| `hotfix/xxx` | Urgent fixes | Created from main; after fixing, merges directly back to main and dev |

---

## 5. Collaborating with Teammates: Remote Repositories

Everything you've learned so far is about **local** Git operations — all history is stored on your own computer. To share code with teammates, you need a **remote repository**, such as GitHub or GitLab.

### 5.1 How Remote Repositories Work

Think of a remote repository as the **team's "shared save file"**:

- Each person writes code locally and commits
- When done, `push` (upload) to the remote repository
- Teammates `pull` (download) the latest content from the remote to their local machine
- This keeps everyone's code in sync

👇 **Try it out**: Click the commands in order to experience the complete flow from linking a remote repository, pushing, to pulling teammates' updates.

<GitSyncDemo />

### 5.2 Pushing a Project to GitHub for the First Time

**Step 1**: Create a new repository on GitHub (click the + in the upper right corner → New repository). Don't check any initialization options.

**Step 2**: Back in your local terminal, link the remote repository:

```bash
# Link the local repository with the GitHub repository
# "origin" is the remote repository's alias — a conventional name (you can change it, but there's no need)
git remote add origin https://github.com/your-username/your-repo.git

# Confirm the link was successful
git remote -v
# Output:
# origin https://github.com/your-username/your-repo.git (fetch)

# origin https://github.com/your-username/your-repo.git (push)

```

**Step 3**: Push local content to remote:

```bash
# First push. -u means "for future git push, default to origin's main branch"
git push -u origin main

# After that, each push only needs:
git push
```

### 5.3 Daily Collaboration Commands

**Push (you made changes and want teammates to see them):**
```bash
git push
```

**Pull (teammates made changes and you need to sync):**
```bash
git pull
```

`git pull` is actually a combination of two commands:
1. `git fetch`: Download the latest commits from the remote repository
2. `git merge`: Merge the downloaded content into your current branch

**Getting someone else's project from GitHub for the first time:**
```bash
# Copy the entire remote repository to your local machine (only needs to be done once)
git clone https://github.com/someone/some-project.git

# clone automatically sets up the remote link, so you can just push/pull afterwards
```

### 5.4 The Direction of Push and Pull

```
Your Computer (Local Repo)  ←→  GitHub (Remote Repo)

git push:   Local → Remote   (you made changes, upload for teammates)
git pull:   Remote → Local   (teammates made changes, download to your machine)
git clone:  Remote → Local   (first-time full copy of the entire repository)
```

> **Best practice**: `git pull` at the start of each workday to get the latest code; `git push` when finishing work or completing a feature to back up promptly and let teammates see your progress.

---

## 6. Advanced: Resolving Conflicts

Conflicts are inevitable in collaboration, but they're not that scary.

### 6.1 Method for Conflictsing Happen

When you and a teammate **both modify the same line in the same file**, Git doesn't know whose version to use during a merge, so a conflict occurs.

For example:
- You wrote on line 5 of `login.js`: `const timeout = 3000`
- Your teammate simultaneously wrote on the same line: `const timeout = 5000`
- When you `git pull` or `git merge`, Git discovers this contradiction and "pauses" to tell you: I don't know which one to use — you decide.

### 6.2 What Does a Conflicted File Look Like

Git inserts special markers at the conflict location:

```javascript
function login() {
  const url = '/api/login'

 <<<<<<< HEAD
  const timeout = 3000   // Your version
 =======
  const timeout = 5000   // Teammate's version
 >>>>>>> feature/update-timeout

  return fetch(url, { timeout })
}
```

- Between `<<<<<<< HEAD` and `=======`: your current branch's content
- Between `=======` and `>>>>>>> xxx`: the content being merged in

### 6.3 Approach to resolving Conflicts

**Step 1**: Open the conflicted file and find all `<<<<<<<` markers (editors like VS Code will usually highlight them automatically)

**Step 2**: Decide which code to keep, then manually edit the file, removing all marker symbols (`<<<<<<<`, `=======`, `>>>>>>>`).

For example, deciding to use 5000 (teammate's version):
```javascript
function login() {
  const url = '/api/login'
  const timeout = 5000   // Adopt teammate's change
  return fetch(url, { timeout })
}
```

**Step 3**: Commit again

```bash
# Mark the conflict as resolved
git add login.js

# Complete the merge commit (Git will auto-generate a merge commit message)
git commit
```

### 6.4 Good Habits to Reduce Conflicts

- **Pull frequently**: Sync the latest code before starting work to reduce "falling too far behind"
- **Small, frequent commits**: Don't write code for a week before committing once. Frequent small commits make conflicts easier to find and resolve
- **Branch isolation**: Use different branches for different features to reduce competition over the same lines of code
- **Communicate**: Before modifying shared files (like `config.js`), give your teammates a heads-up

---

## 7. Common Command Cheat Sheet

<GitCommandCheatsheet />

---

## 8. Practical: Complete Workflow for Joining a Team Project

This is the standard workflow when you join a new team or project — you can follow it directly:

```bash
# ① Day one: clone the project to your local machine (only once)
git clone https://github.com/team/project.git
cd project

# ② Start of each workday: pull the latest code to ensure yours is up to date
git pull origin main

# ③ Create your own feature branch (don't modify main directly)
git checkout -b feature/user-profile

# ④ Normal development... write code...

# ⑤ After completing a small feature, commit immediately (don't hoard changes)
git add src/UserProfile.vue
git commit -m "feat: complete user avatar upload feature"

git add src/UserProfile.vue src/api/user.js
git commit -m "feat: complete user profile editing API"

# ⑥ Push your branch to remote so teammates can see it
git push origin feature/user-profile

# ⑦ Create a Pull Request (PR) on GitHub, requesting merge into main
# (This step is done on the GitHub website)

# ⑧ Wait for teammates' Code Review, make changes based on feedback, continue committing + pushing

# ⑨ After PR is merged, go back to main, update local, delete the feature branch
git checkout main
git pull
git branch -d feature/user-profile
```

---

## 9. .gitignore: Selection of Files Should Not Be Tracked

Some files you **don't** want to commit to the Git repository, for example:
- `node_modules/`: dependency packages, huge in size, can be regenerated with `npm install`
- `.env`: environment variable file that may contain database passwords, API keys — **absolutely must not be uploaded to public repositories**
- `*.log`: log files
- `.DS_Store`: macOS auto-generated hidden files
- `dist/`, `build/`: build artifacts that can be rebuilt

Create a `.gitignore` file in the project root directory with rules for files you don't want to track:

```gitignore
# Dependencies
node_modules/

# Environment variables (important! passwords must not be committed)
.env
.env.local

# Build output
dist/
build/

# System files
.DS_Store
Thumbs.db

# Logs
*.log
```

GitHub has .gitignore templates for various languages and frameworks: [github.com/github/gitignore](https://github.com/github/gitignore)

---

## Glossary

| Term | English | Explanation |
| :--- | :--- | :--- |
| **Repository** | Repository (Repo) | The database storing all version history of a project, inside the `.git` folder |
| **Commit** | Commit | A complete version record, like a game save point, with a description and timestamp |
| **Branch** | Branch | An independent line of development, like parallel timelines that don't affect each other |
| **Merge** | Merge | Integrating changes from one branch into another |
| **Conflict** | Conflict | When the same line of code is modified by multiple people and Git doesn't know which version to use, requiring manual resolution |
| **Stage** | Stage / Index | The action of putting modifications into the "ready to commit" list |
| **Remote** | Remote | A cloud copy of the repository (GitHub / GitLab / Gitee) |
| **Clone** | Clone | Copying an entire remote repository to your local machine |
| **Push** | Push | Uploading local commits to a remote repository |
| **Pull** | Pull | Downloading the latest content from remote and merging it locally |
| **HEAD** | HEAD | A pointer to the current branch/commit, indicating "where you are now" |
| **origin** | origin | The default alias for a remote repository (a conventional name) |
| **stash** | Stash | Temporarily saving uncommitted changes, useful when switching tasks |
| **PR / MR** | Pull Request / Merge Request | A request to merge your branch into the main branch, usually requiring teammate review |

