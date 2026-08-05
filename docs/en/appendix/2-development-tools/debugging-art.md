# Principles of Debugging

::: tip Foreword
**The code is done, you run it, and it throws an error — now what?** Many beginners get stuck at this point, staring at the screen not knowing what to do. Debugging is one of the most core skills in programming — arguably even more important than writing code itself. Writing code only accounts for about 30% of development time; the remaining 70% is spent understanding problems, locating bugs, and verifying fixes.
:::

**What will you learn in this article?**

After completing this chapter, you will gain:

- **Debugging mindset**: Build a systematic approach to problem locating — no more "guessing blindly"
- **Error reading ability**: Understand error messages and quickly locate problems from stack traces
- **Classic debugging methods**: Master techniques like binary search debugging, rubber duck debugging, and minimal reproduction
- **Tool proficiency**: Understand when to use breakpoint debugging, log debugging, network debugging
- **AI-assisted debugging**: Learn to use AI to accelerate debugging without becoming dependent on it

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Reading Error Messages | Error types, stack traces |
| **Chapter 2** | Classic Debugging Methods | Binary search, rubber duck, minimal reproduction |
| **Chapter 3** | Debugging Toolbox | Breakpoints, logging, network capture |
| **Chapter 4** | Debugging in the AI Era | AI assistance + human judgment |
| **Chapter 5** | Debugging Mindset and Habits | Defensive programming, debug logs |

---

## 0. The Big Picture: Debugging Is a Scientific Method

Debugging is not about "getting lucky" — it's a rigorous scientific process. The methodology physicists use in experiments applies perfectly to debugging:

1. **Observe the phenomenon**: What went wrong with the program? What error did it throw?
2. **Form a hypothesis**: What might be causing it?
3. **Design an experiment**: How can you verify this hypothesis?
4. **Verify the conclusion**: If the hypothesis is correct, fix it; if not, try another hypothesis

::: tip The Golden Rules of Debugging
- **Reproduce first, then fix**: If you can't reliably reproduce a bug, you won't know if your fix actually worked
- **Change only one variable at a time**: If you change multiple things simultaneously, you won't know which change solved the problem
- **Trust evidence, not intuition**: The place where you think "it can't possibly be the problem" is often exactly where the problem is
- **What changed recently?**: 80% of bugs are introduced by recent changes
:::

---

## 1. Reading Error Messages: Errors Are Clues, Not Enemies

The most common beginner mistake: panicking when seeing an error, immediately closing or ignoring it. In reality, **error messages are the program telling you what went wrong** — they are your best friends.

### 1.1 The Three Types of Errors

| Type | When It Appears | Example | Difficulty |
|-----|------------|------|---------|
| **Syntax Error** | Before the code even runs | Missing bracket, misspelled keyword | Easiest to fix |
| **Runtime Error** | Code crashes at a specific line | Accessing an undefined variable, division by zero | Medium difficulty |
| **Logic Error** | Code runs but produces wrong results | Wrong calculation formula, reversed conditional logic | Hardest to detect |

### 1.2 How to Read an Error Stack Trace

Using JavaScript as an example, here's a typical error message:

```
TypeError: Cannot read properties of undefined (reading 'name')
    at getUserName (app.js:15:23)
    at handleClick (app.js:42:10)
    at HTMLButtonElement.<anonymous> (app.js:58:5)
```

**Read from top to bottom**:

1. **First line**: Error type + error description → `TypeError`, attempting to read the `name` property of `undefined`
2. **Second line**: The function and location where the error occurred → `getUserName` function, `app.js` line 15, column 23
3. **Subsequent lines**: The call chain → Who called this function? `handleClick` → button click event

::: tip Stack Trace Reading Mnemonic
**Read top-down for the cause, bottom-up for the origin.** The first line tells you "what went wrong," the last line tells you "where it started."
:::

### 1.3 Common Error Types Quick Reference

| Error Name | Meaning | Common Causes |
|---------|------|---------|
| `SyntaxError` | Syntax error | Mismatched brackets, missing commas |
| `TypeError` | Type error | Operating on `undefined`/`null` |
| `ReferenceError` | Reference error | Using an undeclared variable |
| `RangeError` | Range error | Array out of bounds, too deep recursion |
| `NetworkError` | Network error | API request failed, CORS issues |
| `404 Not Found` | Resource not found | Wrong URL, file deleted |
| `500 Internal Server Error` | Server internal error | Backend code crash |

### 1.4 Python Error Messages Comparison

Python's stack trace is the opposite of JavaScript — **read from bottom to top**:

```python
Traceback (most recent call last):
  File "main.py", line 10, in <module>
    result = calculate(data)
  File "main.py", line 5, in calculate
    return data["price"] * data["quantity"]
KeyError: 'quantity'
```

**The last line** is the actual error cause: `KeyError: 'quantity'` — the dictionary doesn't have the key `quantity`.

::: tip Different Languages, Same Approach
Regardless of the language, error messages contain three key pieces of information: **what went wrong** (error type), **where it went wrong** (file and line number), **why it went wrong** (error description). Learn to extract these three pieces of information, and you can read error messages in any language.
:::

---

## 2. Classic Debugging Methods: Wisdom From Experience

These methods require no tools at all — just your brain. They are the foundation of all advanced debugging techniques.

### 2.1 Binary Search Debugging

**Core idea**: Narrow the problem scope by half, then half again, until you find the root cause.

**Scenario**: The code is long and you don't know which section has the problem.

**Steps**:

1. Add a `console.log` (or `print`) in the middle of the code
2. If the error occurs before the midpoint → the problem is in the first half
3. If the error occurs after the midpoint → the problem is in the second half
4. Repeat this process on the problematic half

```
100 lines of code with a bug
    ↓ Add log at line 50
Problem is in lines 50-100
    ↓ Add log at line 75
Problem is in lines 50-75
    ↓ Add log at line 62
Problem is in lines 60-62!
```

::: tip The Power of Binary Search
100 lines of code: at most 7 attempts (log₂100 ≈ 7) to locate the specific line. Even 1000 lines only need 10 attempts.
:::

### 2.2 Rubber Duck Debugging

**Core idea**: Explain the problem line by line to someone else (or a rubber duck). While explaining, you'll often discover the issue yourself.

**Why does it work?** Because "writing code" and "explaining code" use different parts of your brain. When you're forced to verbally describe each step of the logic, assumptions you "thought were correct" get exposed.

**How to practice**:

1. Open the problematic code
2. Explain line by line: "What does this line do? Why is it done this way?"
3. When you say "Hmm, this should be... wait a minute" — that's often where the bug is

### 2.3 Minimal Reproduction

**Core idea**: Simplify a complex problem to the minimum — keep only the code needed to trigger the bug.

**Why it matters**:

- In complex systems, bugs can be "masked" by other code
- Minimal reproduction eliminates interfering factors, making the problem obvious at a glance
- It also makes it easier to ask others for help — nobody wants to read your 500 lines of code

**Steps**:

1. Create a new empty file
2. Copy only the code related to the problem
3. Gradually remove code until deleting any single line makes the bug disappear
4. What remains is the root cause of the bug

### 2.4 Regression Method (Git Bisect)

**Core idea**: If the code "used to work and now it's broken," find which commit introduced the problem.

```bash
# Git's built-in binary search tool
git bisect start
git bisect bad          # Mark the current version as having the bug
git bisect good abc123  # Mark a known-good older version
# Git automatically checks out the middle commit; you test and tell it good or bad
# Repeat a few times to find the commit that introduced the bug
```

::: tip Debugging Method Selection Guide
| Situation | Recommended Method |
|-----|---------|
| Don't know which section of code has the error | Binary search |
| Logic looks correct but results are wrong | Rubber duck |
| Bug in a complex system | Minimal reproduction |
| "It was working fine and suddenly broke" | Regression / Git Bisect |
:::

---

## 3. Debugging Toolbox: The Right Tool Doubles Your Efficiency

Methods are the foundation, but the right tools can multiply your debugging speed.

### 3.1 console.log / print: Simple Yet Powerful

**Best for**: Quickly checking variable values, confirming which code path was executed.

```javascript
// JavaScript
console.log('Function called with params:', data)
console.log('Calculation result:', result)
console.table(arrayData)  // Display arrays/objects in table format
```

```python
# Python
print(f"Current value: {value}")
print(f"Type: {type(data)}")  # Check data types
```

**Advanced techniques**:

| Method | Purpose |
|-----|------|
| `console.log()` | Standard output |
| `console.warn()` | Yellow warning — easy to find in large logs |
| `console.error()` | Red error |
| `console.table()` | Display arrays and objects in table format |
| `console.time()` / `console.timeEnd()` | Measure code execution time |
| `console.trace()` | Print the call stack |

### 3.2 Breakpoint Debugging: Step Through Every Line

**Best for**: Complex logic that requires tracking the code execution process step by step.

**In the browser** (Chrome DevTools):

1. Open Developer Tools (F12) → Sources panel
2. Find the source file, click a line number to set a breakpoint
3. Trigger the relevant action — code will pause at the breakpoint
4. Use control buttons to step through:
   - **Continue** (F8): Run to the next breakpoint
   - **Step Over** (F10): Execute the current line without entering function bodies
   - **Step Into** (F11): Enter function bodies
   - **Step Out** (Shift+F11): Exit the current function

**In VS Code**:

1. Click to the left of a line number to set a breakpoint (red dot)
2. Press F5 to start debugging
3. View all variable values in the "Variables" panel
4. Add expressions you care about in the "Watch" panel

::: tip Breakpoints vs console.log
**console.log** is great for quick verification — use it and delete it. **Breakpoint debugging** is for deep analysis of complex logic. They complement each other rather than replace one another.
:::

### 3.3 Network Debugging: Frontend-Backend Issues

**Best for**: The page displays incorrectly, but you're not sure if it's a frontend problem or bad data from the backend.

**Chrome DevTools → Network Panel**:

| What to Check | What Problems You Can Discover |
|---------|--------------|
| **Status Code** | 404 (wrong URL), 500 (server crash), 403 (no permission) |
| **Request Parameters** | Is the data sent from the frontend correct? |
| **Response Data** | Is the data format returned by the backend correct? |
| **Request Timing** | Which API is too slow and dragging down the page |
| **Request Headers** | Is the Token included? Is Content-Type correct? |

**Debugging mnemonic**: Check the status code first, then request parameters, then response data.

### 3.4 Debugging Tool Selection Quick Reference

| Problem Type | Recommended Tool |
|---------|---------|
| Variable values are wrong | console.log / breakpoints |
| Logic execution order is wrong | Breakpoint debugging |
| API request failed | Network panel |
| Page styling is wrong | Elements panel (inspect CSS) |
| Performance issues | Performance panel / console.time |
| Memory leaks | Memory panel |

---

## 4. Debugging in the AI Era: Let AI Be Your Assistant

AI tools (ChatGPT, Claude, Cursor, etc.) can greatly accelerate debugging — but only if you know how to use them properly.

### 4.1 Overview of AI Good At

| AI Is Good At | AI Is Not Good At |
|--------|----------|
| Explaining what error messages mean | Understanding your business logic |
| Providing solutions for common problems | Judging which solution fits your project best |
| Generating debugging code snippets | Reproducing bugs that only occur in specific environments |
| Analyzing potential issues in code | Understanding complex system context |

### 4.2 How to Ask AI the Right Questions

**Bad question**:
> "My code has an error, can you help me look at it?"

**Good question**:
> "I'm writing a form component in React, and when submitting I get `TypeError: Cannot read properties of undefined (reading 'email')`. Here's the relevant code: [paste code]. I've confirmed the API returns the correct data format, so the issue is likely in the frontend data processing."

**Question template**:

```
1. What I'm doing: [context]
2. Expected behavior: [what should happen]
3. Actual behavior: [what actually happens]
4. Error message: [complete error]
5. Relevant code: [paste code]
6. What I've already tried: [what I ruled out]
```

### 4.3 Pitfalls of AI Debugging

::: warning Three Pitfalls of AI Debugging
1. **AI may "confidently make things up"**: The solution AI provides might look reasonable but could be completely wrong. Always verify yourself.
2. **AI doesn't know your context**: It doesn't know your project structure, dependency versions, or runtime environment. You need to provide sufficient context.
3. **Over-reliance on AI degrades your debugging skills**: If you throw every error at AI, you'll never learn to debug on your own. Try analyzing the problem yourself for 5 minutes before asking AI.
:::

### 4.4 The Best Combination: AI + Human Judgment

```
Encounter a Bug
  ↓
Step 1: Read the error message yourself (1 minute)
  ↓
Step 2: Form your own hypothesis (2 minutes)
  ↓
Step 3: Quickly test the hypothesis (2 minutes)
  ↓
Still stuck? → Send the error + code + your analysis to AI
  ↓
AI gives suggestions → You judge if they're reasonable → Verify
```

---

## 5. Debugging Mindset and Habits: From "Firefighting" to "Fire Prevention"

The best debugging is not needing to debug at all. Building good habits can reduce bugs at the source.

### 5.1 Defensive Programming

**Core idea**: When writing code, assume "everything could go wrong" and build safeguards in advance.

```javascript
// Bad: Assumes data definitely exists
const name = data.user.name

// Good: Defensive approach
const name = data?.user?.name ?? 'Unknown User'
```

```python
# Bad: Assumes the file can always be opened
content = open('config.json').read()

# Good: Defensive approach
try:
    content = open('config.json').read()
except FileNotFoundError:
    print("Config file not found, using default configuration")
    content = '{}'
```

### 5.2 Writing Good Logs

Logs are key to "post-mortem debugging." In production environments, you can't set breakpoints — you can only rely on logs.

| Log Level | Purpose | Example |
|---------|------|------|
| **DEBUG** | Detailed info during development | Variable values, function parameters |
| **INFO** | Normal business flow | "User login successful", "Order created" |
| **WARN** | Non-blocking but noteworthy | "Cache miss", "Retry attempt 2" |
| **ERROR** | Something went wrong, needs handling | "Database connection failed", "API timeout" |

::: tip Standards for Good Logs
A good log entry should answer: **when**, **where**, **what happened**, and **what the key data is**.
```
[2025-01-15 14:30:22] [ERROR] [OrderService] Failed to create order
  User ID: 12345, Product ID: 67890, Reason: Insufficient stock
```
:::

### 5.3 Debugging Checklist

When you encounter a bug, troubleshoot in this order:

1. **Read the error message**: Error type, file, line number
2. **What changed recently?**: Use `git diff` to see recent changes
3. **Can you reproduce it?**: Find stable reproduction steps
4. **Narrow the scope**: Use binary search or minimal reproduction to pinpoint
5. **Form and verify hypotheses**: Change only one variable at a time
6. **Regression test after fixing**: Ensure the fix didn't introduce new problems

### 5.4 Common Beginner Debugging Traps

| Trap | Correct Approach |
|-----|---------|
| Start modifying code without reading the error | Read the complete error message first |
| Change multiple things at once | Change one thing, verify, then change the next |
| Commit without testing after changes | Run tests after every modification |
| Only test on your own machine | Consider different environments (browsers, OS, network) |
| Don't clean up console.log after debugging | Delete all debug code before committing |
| Restart/reinstall whenever there's a problem | Understand the root cause first; restarting is only a temporary fix |

---

## 6. Summary

Debugging is a craft that requires deliberate practice. Let's review the core takeaways:

1. **Debugging is a scientific method**: Observe → Hypothesize → Experiment → Verify — not luck
2. **Error messages are friends**: Learn to extract "what, where, why" from errors
3. **Classic methods never go out of style**: Binary search, rubber duck, and minimal reproduction are the foundation of all debugging
4. **Use the right tool for the right scenario**: console.log for quick checks, breakpoints for deep analysis, Network panel for API issues
5. **AI is an assistant, not a crutch**: Analyze on your own first, then let AI assist, then verify yourself
6. **Prevention beats firefighting**: Defensive programming and good logging habits reduce bugs at the source

::: tip Remember This
**Every bug is a learning opportunity.** Each bug you fix builds your "pattern recognition" ability — the next time you encounter a similar problem, you'll locate the cause faster.
:::

---

## Further Reading

- [Chrome DevTools Official Documentation](https://developer.chrome.com/docs/devtools/) — Complete guide to browser debugging tools
- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging) — VS Code breakpoint debugging tutorial
- [How to Debug Anything](https://www.debuggingbook.org/) — Systematic debugging methodology
