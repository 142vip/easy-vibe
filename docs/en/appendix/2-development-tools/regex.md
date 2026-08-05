# Fundamentals of Regular Expressions

> 💡 **Learning Guide**: Regular expressions look like gibberish? They're actually just a mini "language for describing text patterns." This chapter takes you from zero to understanding the core ideas of regex, and teaches you to solve 80% of text search and validation problems with just a few key symbols.

---

## 0. Motivation for needing Regular Expressions

Imagine these scenarios:
- Finding all IP addresses in a large log file
- Validating whether a user's email format is correct
- Replacing all date formats in text from `2024/01/15` to `2024-01-15`
- Extracting all links from a webpage's source code

**Using plain string search?** You'd need a ton of `if-else` logic.
**Using regular expressions?** One pattern gets it done.

---

## 1. Regex Quick Start: Up and Running in Three Minutes

👇 Try it out: Enter a regular expression and see matching results in real time.

<RegexDemo />

::: tip 💡 One-Sentence Summary
Regular expressions = **using special symbols to describe "what kind of text you want to find."** `\d` represents digits, `+` represents one or more, so `\d+` means "one or more digits."
:::

---

## 2. Core Concepts: Building Blocks You Combine

The essence of regex is combining **three types of building blocks** to create the pattern you want:

### 2.1 Block One: Character Classes (What Characters to Match)

| Syntax | Meaning | Example |
|---|---|---|
| `.` | Any character | `a.c` → abc, a1c, a c |
| `\d` | Digit [0-9] | `\d\d` → 42, 99 |
| `\w` | Letter/digit/underscore | `\w+` → hello, user_1 |
| `\s` | Whitespace character | Matches spaces, tabs |
| `[abc]` | Any one in the set | `[aeiou]` → vowels |
| `[^abc]` | Not in the set | `[^0-9]` → non-digit characters |

### 2.2 Block Two: Quantifiers (How Many Times to Match)

| Syntax | Meaning | Example |
|---|---|---|
| `*` | 0 or more times | `ab*` → a, ab, abbb |
| `+` | 1 or more times | `ab+` → ab, abbb (doesn't match a) |
| `?` | 0 or 1 time | `colou?r` → color, colour |
| `{3}` | Exactly 3 times | `\d{3}` → 123 |
| `{2,4}` | 2 to 4 times | `\d{2,4}` → 12, 1234 |

### 2.3 Block Three: Position and Grouping

| Syntax | Meaning | Example |
|---|---|---|
| `^` | Start of line | `^Hello` → lines starting with Hello |
| `$` | End of line | `end$` → lines ending with end |
| `\b` | Word boundary | `\bcat\b` → cat (doesn't match catch) |
| `(...)` | Capturing group | `(\d+)-(\d+)` → captures separately |
| `a\|b` | Or | `cat\|dog` → cat or dog |

---

## 3. Practice: Common Validation Patterns

### 3.1 Email Validation

```
[\w.+-]+@[\w-]+\.[\w.]+
```

Breakdown:
- `[\w.+-]+` — username part (letters, digits, dots, plus, hyphens)
- `@` — literal @
- `[\w-]+` — domain part
- `\.` — escaped dot
- `[\w.]+` — top-level domain

### 3.2 Phone Number Validation (China)

```
1[3-9]\d{9}
```

Breakdown:
- `1` — starts with 1
- `[3-9]` — second digit is 3-9
- `\d{9}` — followed by 9 digits

### 3.3 Password Strength Check

```
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$
```

Breakdown:
- `(?=.*[a-z])` — at least one lowercase letter (lookahead assertion)
- `(?=.*[A-Z])` — at least one uppercase letter
- `(?=.*\d)` — at least one digit
- `.{8,}` — total length at least 8 characters

---

## 4. Using Regular Expressions in Code

### JavaScript

```javascript
const text = 'Contact: 13812345678 or 15099887766'
const regex = /1[3-9]\d{9}/g
const phones = text.match(regex)
// ['13812345678', '15099887766']

// Replace
text.replace(/\d{4}(?=\d{4}$)/, '****')
// Hide the middle four digits of the phone number

// Validate
/^[\w.+-]+@[\w-]+\.[\w.]+$/.test('user@example.com')
// true
```

### Python

```python
import re

text = 'Price is 99 yuan, discount 20 yuan'
numbers = re.findall(r'\d+', text)
# ['99', '20']

# Replace
re.sub(r'\d+', 'X', text)
# 'Price is X yuan, discount X yuan'

# Group capture
match = re.search(r'(\d+)-(\d+)', '2024-01-15')
match.group(1)  # '2024'
match.group(2)  # '01'
```

---

## 5. Greedy vs. Lazy: A Key Difference

```
Text: <b>hello</b> and <b>world</b>
```

| Pattern | Match Result | Explanation |
|---|---|---|
| `<b>.*</b>` | `<b>hello</b> and <b>world</b>` | Greedy: match as much as possible |
| `<b>.*?</b>` | `<b>hello</b>` | Lazy: match as little as possible |

::: tip 💡 Remember
The default is greedy mode. Add `?` after a quantifier to switch to lazy mode. Most of the time, you want lazy mode.
:::

---

## 6. Summary

::: tip 📚 Key Takeaways
1. **Regex = a mini language for describing text patterns**, used for searching, matching, and replacing
2. **Three types of building blocks**: character classes (what to match) + quantifiers (how many times) + position/grouping
3. **\d \w \s** are the three most commonly used character classes, covering digits, word characters, and whitespace
4. **No need to write from scratch**: common scenarios have mature regex patterns you can reuse
5. **Greedy vs. Lazy**: default is greedy (match more), add `?` for lazy (match less)
:::

**Next Steps**:
- [An Introduction to Environment Variables and PATH](./environment-path) - Understanding system configuration
- [SSH and Key Authentication](./ssh-authentication) - Secure remote server connections
