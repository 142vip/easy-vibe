# Fundamentals of Linux

::: tip Foreword
**In the world of servers, Linux is the undisputed star.** Over 90% of servers worldwide run Linux — from WeChat to Google Search, Linux powers it all behind the scenes. For developers, mastering Linux basics is not optional — it's a requirement.
:::

**What will you learn from this article?**

After completing this chapter, you will gain:

- **File system**: Understand the Linux directory structure and the "everything is a file" philosophy
- **Common commands**: Master core commands for file operations, text processing, and process management
- **Permission model**: Understand users, groups, and permissions
- **Shell basics**: Learn about pipes, redirection, environment variables, and other core Shell concepts
- **Practical skills**: Learn log inspection, process troubleshooting, network diagnostics, and other ops fundamentals

| Chapter | Content | Core Concepts |
|---------|---------|---------------|
| **Chapter 1** | File System | Directory structure, everything is a file |
| **Chapter 2** | Common Commands | Files, text, processes, networking |
| **Chapter 3** | Permission Model | Users, groups, rwx, sudo |
| **Chapter 4** | Shell Basics | Pipes, redirection, variables, scripts |
| **Chapter 5** | Practical Scenarios | Log troubleshooting, performance diagnostics |

---

## 1. File System: Everything Is a File

One of Linux's most fundamental philosophies is that **everything is a file**. Regular files are files, directories are files, hard drives are files, even network connections and process information are files. This unified abstraction lets you use the same set of tools (read, write, permission control) to operate on virtually all system resources.

<LinuxFileSystemDemo />

### Directory Structure Cheat Sheet

Think of the Linux file system as an upside-down tree:

```
/                    ← Root directory (tree root)
├── home/            ← Users' home (your files live here)
├── etc/             ← Configuration files (the system's "settings panel")
├── var/             ← Variable data (logs, cache)
├── usr/             ← User-installed programs
├── tmp/             ← Temporary files (gone after reboot)
├── proc/            ← Process info (virtual, no disk usage)
├── dev/             ← Device files (hard drives, terminals)
├── bin/             ← Basic commands (ls, cp, mv)
├── sbin/            ← System admin commands (requires root)
├── opt/             ← Third-party software
└── root/            ← root user's home directory
```

### Two Types of Paths

| Type | Format | Example | Description |
|------|--------|---------|-------------|
| Absolute path | Starts from `/` | `/home/alice/code/app.js` | Starts from root, unambiguous |
| Relative path | Starts from current directory | `./code/app.js` or `../config` | `.` is current directory, `..` is parent |

::: tip The Power of "Everything Is a File"
Want to check CPU info? Read a file: `cat /proc/cpuinfo`
Want to check memory usage? Read a file: `cat /proc/meminfo`
Want to generate random numbers? Read a file: `cat /dev/urandom`
Want to discard output? Write to a file: `echo "no thanks" > /dev/null`

No special API needed — reading and writing files is enough. This is the elegance of Unix philosophy.
:::

---

## 2. Common Commands

Linux commands follow a consistent format: `command [options] [arguments]`. For example, in `ls -la /home`, `ls` is the command, `-la` is the option, and `/home` is the argument.

<LinuxCommandDemo />

### Top 10 Most Used Commands

If you can only remember 10 commands, remember these:

| Command | Purpose | Memory Tip |
|---------|---------|------------|
| `ls` | List files | list |
| `cd` | Change directory | change directory |
| `cat` | View file contents | concatenate |
| `grep` | Search text | global regular expression print |
| `find` | Find files | just "find" |
| `ps` | View processes | process status |
| `tail -f` | Watch logs in real-time | View file "tail", -f means follow |
| `chmod` | Change permissions | change mode |
| `curl` | Send HTTP requests | client URL |
| `ssh` | Remote login | secure shell |

### The Art of Combining Commands

Linux's power lies not in individual commands, but in **command composition**. By connecting multiple simple commands with pipes `|`, you can solve complex problems:

```bash
# Find the top 5 processes by CPU usage
ps aux --sort=-%cpu | head -6

# Count the most frequent error types in logs
grep "ERROR" app.log | awk '{print $4}' | sort | uniq -c | sort -rn | head -10

# Find files larger than 100MB
find / -size +100M -type f 2>/dev/null

# Monitor errors in logs in real-time
tail -f /var/log/app.log | grep --color "ERROR"
```

::: tip Unix Philosophy
"Do one thing, and do it well." Each command handles only one function; complex operations are achieved through pipe composition. That's why Linux commands are so compact — they're building blocks, not Swiss Army knives.
:::

---

## 3. Permission Model

Linux is a multi-user system, and the permission model is the foundation of security. Every file has three sets of permissions controlling what **Owner**, **Group**, and **Others** can do.

### Reading `ls -l` Output

```bash
$ ls -l app.js
-rwxr-xr-- 1 alice developers 2048 Jan 15 10:30 app.js
│├──┤├──┤├──┤   │     │          │
│ │   │   │     │     │          └── File size
│ │   │   │     │     └── Group
│ │   │   │     └── Owner
│ │   │   └── Others permission: r-- (read-only)
│ │   └── Group permission: r-x (read + execute)
│ └── Owner permission: rwx (read + write + execute)
└── File type: - regular file, d directory, l link
```

### Three Permission Operations

| Permission | Letter | Number | Meaning for Files | Meaning for Directories |
|------------|--------|--------|-------------------|------------------------|
| Read | `r` | 4 | View file contents | List directory contents (ls) |
| Write | `w` | 2 | Modify file contents | Create/delete files in directory |
| Execute | `x` | 1 | Run programs/scripts | Enter directory (cd) |

<LinuxPermissionsDemo />

### Numeric Permission Quick Calculation

Three numbers represent Owner, Group, and Others permissions respectively. Each number is the sum of r(4) + w(2) + x(1):

```
chmod 755 script.sh
  7 = rwx (4+2+1)  → Owner: read + write + execute
  5 = r-x (4+0+1)  → Group: read + execute
  5 = r-x (4+0+1)  → Others: read + execute
```

| Common Permission | Meaning | Typical Use |
|-------------------|---------|-------------|
| `644` | rw-r--r-- | Regular files (owner writable, others read-only) |
| `755` | rwxr-xr-x | Executable files / directories |
| `600` | rw------- | Private files (like SSH keys) |
| `777` | rwxrwxrwx | Everyone can read, write, execute (dangerous, avoid) |

### sudo: Temporarily Gain Superuser Privileges

Regular users have limited permissions. Some operations require root privileges. `sudo` lets you execute commands as root temporarily:

```bash
# Regular user cannot modify system configuration
$ vim /etc/nginx/nginx.conf
# Permission denied

# Use sudo to temporarily elevate privileges
$ sudo vim /etc/nginx/nginx.conf
# Enter your password, then you can edit

# Switch to root user (use with caution)
$ sudo su -
```

::: warning Principle of Least Privilege
Never use `chmod 777` to solve permission problems — that's like removing the door lock. The correct approach is to figure out who needs what permissions and grant them precisely. Similarly, don't operate as root long-term; use `sudo` only when necessary.
:::

---

## 4. Shell Basics

The Shell is the "translator" between you and the Linux kernel. You type commands, and the Shell interprets and passes them to the kernel for execution. The most common shells are **Bash** (default on most Linux distributions) and **Zsh** (default on macOS).

### Pipes and Redirection

These are the two most powerful Shell features:

| Symbol | Name | Function | Example |
|--------|------|----------|---------|
| `|` | Pipe | Pass output of one command as input to another | `cat log \| grep ERROR` |
| `>` | Output redirect | Write output to file (overwrite) | `echo "hello" > file.txt` |
| `>>` | Append redirect | Append output to end of file | `echo "world" >> file.txt` |
| `<` | Input redirect | Read input from file | `wc -l < file.txt` |
| `2>` | Error redirect | Write errors to file | `cmd 2> error.log` |
| `2>&1` | Merge output | Merge errors with standard output | `cmd > all.log 2>&1` |

### Environment Variables

Environment variables are "global configuration" in the Shell that affect command behavior:

```bash
# View all environment variables
env

# View a specific variable
echo $PATH
echo $HOME

# Set temporarily (only in current Shell)
export API_KEY="abc123"

# Set permanently (write to config file)
echo 'export API_KEY="abc123"' >> ~/.bashrc
source ~/.bashrc   # Apply config immediately
```

| Common Variable | Meaning | Example Value |
|-----------------|---------|---------------|
| `$PATH` | Command search paths | `/usr/local/bin:/usr/bin:/bin` |
| `$HOME` | User home directory | `/home/alice` |
| `$USER` | Current username | `alice` |
| `$PWD` | Current working directory | `/var/log` |
| `$SHELL` | Current shell | `/bin/bash` |

### Shell Scripting Primer

Writing multiple commands into a file creates a Shell script. It's the starting point for automated operations:

```bash
#!/bin/bash
# deploy.sh - Simple deployment script

APP_DIR="/opt/myapp"
LOG_FILE="/var/log/deploy.log"

echo "$(date) - Starting deployment..." >> $LOG_FILE

# Pull latest code
cd $APP_DIR && git pull origin main

# Install dependencies
npm install --production

# Restart service
pm2 restart myapp

echo "$(date) - Deployment complete" >> $LOG_FILE
```

```bash
# Give script execute permission and run it
chmod +x deploy.sh
./deploy.sh
```

::: tip Script Debugging Tips
Add `set -ex` at the beginning of scripts: `-e` makes the script exit immediately on error (instead of continuing), and `-x` prints each executed command (helpful for troubleshooting). These two options are almost standard in production scripts.
:::

---

## 5. Practical Scenarios

Now that the theory is covered, let's look at some practical scenarios you'll encounter most often in development.

### 5.1 Log Troubleshooting

When a service has issues, the first instinct should be to check logs. Here are common log troubleshooting techniques:

```bash
# 1. Follow logs in real-time (most common)
tail -f /var/log/app/error.log

# 2. Search for errors in a specific time range
grep "2024-01-15 14:" error.log | grep "ERROR"

# 3. Count errors per hour
grep "ERROR" app.log | awk '{print substr($1,1,13)}' | uniq -c

# 4. View last 100 lines of log
tail -100 app.log

# 5. Search across multiple log files
grep -r "OutOfMemory" /var/log/app/
```

### 5.2 Process Troubleshooting

Application freeze, CPU spike, memory leak — these all require starting from the process level:

```bash
# View processes with highest CPU usage
ps aux --sort=-%cpu | head -10

# View processes with highest memory usage
ps aux --sort=-%mem | head -10

# Find a specific process
ps aux | grep "node"

# View detailed process info (including threads)
top -Hp <PID>

# View files opened by a process
lsof -p <PID>

# Gracefully terminate a process (SIGTERM)
kill <PID>

# Force kill (SIGKILL, last resort)
kill -9 <PID>
```

### 5.3 Network Diagnostics

Service unreachable? First determine if it's a network issue or an application issue:

```bash
# Test if target is reachable
ping -c 4 google.com

# Check if a port is open
telnet db-server 3306
# Or use nc
nc -zv db-server 3306

# View ports listening on this machine
ss -tlnp
# Or
netstat -tlnp

# DNS resolution check
dig api.example.com
nslookup api.example.com

# Test HTTP endpoint
curl -v http://localhost:3000/health

# View network connection statistics
ss -s
```

### 5.4 Disk Space Troubleshooting

Full disk is one of the most common production issues:

```bash
# View partition usage
df -h

# Find the largest directories
du -sh /* 2>/dev/null | sort -rh | head -10

# Drill down into large directories
du -sh /var/log/* | sort -rh | head -10

# Find large files (>100MB)
find / -type f -size +100M 2>/dev/null | head -20

# Clean up common space hogs
# Clean old logs
sudo journalctl --vacuum-size=500M
# Clean unused Docker images
docker system prune -a
```

::: tip Production Troubleshooting Mantra
**"First logs, second processes, third network, fourth disk."** 90% of production issues can be traced to their root cause through these four steps. Once it becomes a habit, your troubleshooting efficiency will improve dramatically.
:::

---

## Summary

Linux is an essential skill for developers. Mastering the basics is enough to handle most daily development and operations scenarios.

Key takeaways from this chapter:

1. **Everything is a file**: Linux uses file abstraction to unify access to hardware, processes, networking, and other resources
2. **Command composition**: Individual commands are simple; true power comes from combining them with pipes `|`
3. **Permission model**: Owner/Group/Others x Read/Write/Execute, set quickly with numbers (like 755)
4. **Shell basics**: Pipes, redirection, environment variables, and scripts are the building blocks of automation
5. **Practical troubleshooting**: Logs -> Processes -> Network -> Disk — four steps to diagnose most production issues

## Further Reading

- [Linux Man Pages](https://man7.org/linux/man-pages/) - Official Linux man pages documentation
- [The Linux Command Line](https://linuxcommand.org/tlcl.php) - Free introductory book on the Linux command line
- [Linux Journey](https://linuxjourney.com/) - Interactive Linux learning website
- [explainshell.com](https://explainshell.com/) - Enter a command and it automatically explains each parameter
