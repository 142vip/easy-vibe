# Fundamentals of Security Thinking: Offense and Defense

::: tip Preface
**Is your website secure?** Many developers think "security is the security team's job" — until their own project gets attacked and user data is leaked. Security is not optional; it's a fundamental skill for every developer.

This chapter helps you build a security mindset and understand the most common web security threats and defense methods.
:::

**What will you learn in this article?**

| Chapter | Content | Core Concepts |
|----- |------|---------|
| **Chapter 1** | Security mindset model | Thinking like an attacker |
| **Chapter 2** | Common web attacks | XSS, SQL Injection, CSRF |
| **Chapter 3** | Defense strategies | Input validation, output encoding, access control |
| **Chapter 4** | Security checklist | Pre-launch security self-audit |

After reading this chapter, you will have basic security awareness and be able to identify and defend against the most common web security threats.

---

## 0. The Big Picture: Why Developers Need to Understand Security

Imagine you built a house — fully functional, beautifully decorated — but forgot to install locks. Security vulnerabilities are the "forgotten locks" of the code world.

::: tip Core Security Principles
- **Least Privilege**: Grant only necessary permissions — not a single bit more
- **Defense in Depth**: Don't rely on a single line of defense; set up multiple layers
- **Never Trust Input**: All data from external sources could be malicious
- **Secure by Default**: Default configurations should be secure, not convenient
:::

---

## 1. Common Web Attacks

Use the interactive component below to understand the three most common web attack principles (for educational purposes only):

<WebSecurityDemo />

### 1.1 XSS (Cross-Site Scripting)

An attacker injects malicious scripts into a web page. When other users visit the page, the script executes in their browser.

```javascript
// Dangerous: directly inserting user input into HTML
element.innerHTML = userInput
// If userInput is <script>malicious code</script>, it will execute

// Safe: use textContent or escaping
element.textContent = userInput
// Or use framework's auto-escaping (Vue's {{ }}, React's JSX)
```

**Defense Essentials**:
- Escape HTML special characters on output (`<`, `>`, `&`, `"`, `'`)
- Use modern frameworks' built-in auto-escaping mechanisms
- Set the `Content-Security-Policy` HTTP header

### 1.2 SQL Injection

An attacker crafts special input to manipulate the logic of SQL queries.

```javascript
// Dangerous: string concatenation for SQL
const query = `SELECT * FROM users WHERE name = '${userInput}'`
// If userInput is ' OR '1'='1, it will return all users

// Safe: use parameterized queries
const query = 'SELECT * FROM users WHERE name = ?'
db.execute(query, [userInput])
```

**Defense Essentials**:
- Always use parameterized queries / prepared statements
- Use ORM frameworks (e.g., Prisma, Sequelize)
- Restrict database account permissions

### 1.3 CSRF (Cross-Site Request Forgery)

An attacker tricks a logged-in user into visiting a malicious page, leveraging the user's login state to send requests.

**Defense Essentials**:
- Use CSRF Tokens
- Check `Referer` / `Origin` headers
- Use POST instead of GET for critical operations
- Set `SameSite` attribute on cookies

---

## 2. Defense Strategies

### 2.1 Input Validation

```javascript
// Whitelist validation: only allow expected formats
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Length limits
function isValidUsername(name) {
  return name.length >= 2 && name.length <= 50
}
```

### 2.2 Sensitive Data Protection

| Data Type | Protection Measures |
|---------|---------|
| Passwords | bcrypt/argon2 hashing, never store in plaintext |
| API keys | Environment variables, never commit to code repositories |
| User data | HTTPS transmission, encrypted storage |
| Session tokens | HttpOnly + Secure + SameSite cookies |

### 2.3 HTTP Security Headers

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
```

---

## 3. Security Checklist

Before going live, use the interactive component below to check your project's security status:

<SecurityChecklistDemo />

### 3.1 Development Phase

- [ ] All user input is validated and escaped
- [ ] Parameterized queries are used, no SQL concatenation
- [ ] Passwords are hashed using algorithms like bcrypt
- [ ] Sensitive configuration is managed through environment variables
- [ ] `.env` file is added to `.gitignore`

### 3.2 Deployment Phase

- [ ] HTTPS is enabled
- [ ] Security HTTP headers are configured
- [ ] Debug mode and verbose error messages are disabled
- [ ] Database uses a least-privilege account
- [ ] Dependencies are regularly updated (`npm audit`)

---

## 4. AI-Powered: Using LLMs to Enhance Security

LLMs can act as your "security consultant" — helping you audit code vulnerabilities and generate security solutions.

### 4.1 Code Security Audit

> **Prompt**:
> ```
> Please perform a security audit on the following code, checking for:
> - XSS vulnerabilities (unescaped user input)
> - SQL injection (string-concatenated queries)
> - CSRF risks (missing token verification)
> - Sensitive data leakage (hardcoded keys, plaintext passwords)
> For each issue, provide risk level, specific location, and remediation.
>
> [Paste your code]
> ```

### 4.2 Generating Security Configurations

> **Prompt**:
> ```
> My project uses Express.js + PostgreSQL and is about to go live.
> Please generate a complete security configuration checklist, including:
> - HTTP security header configuration code
> - CORS configuration
> - Secure database connection settings
> - Environment variable management solution
> Provide ready-to-use code snippets.
> ```

### 4.3 Explaining Vulnerability Principles

> **Prompt**:
> ```
> Explain the complete flow of a CSRF attack with a concrete example:
> 1. How the attacker constructs the malicious page
> 2. Why the browser automatically includes cookies
> 3. How the server defends using CSRF tokens
> Demonstrate the complete attack and defense process with code.
> ```

::: tip AI Usage Advice
AI security audits cannot replace professional security testing. Treat them as a first-pass screening — critical systems still require professional security team audits.
:::

---

## 5. Summary

1. **Security Mindset**: Never trust external input, least privilege, defense in depth
2. **Common Attacks**: XSS, SQL Injection, CSRF are the most frequent web security threats
3. **Defense Strategies**: Input validation, output encoding, parameterized queries, security HTTP headers
4. **Security Habits**: Run through a security checklist before launch, audit dependencies regularly

::: tip Final Thought
Security is not a one-time task but a habit that runs through the entire development process. It's like wearing a seatbelt when driving — not because you expect an accident, but because it's basic safety awareness. **When writing every line of code, ask yourself: what would happen if this input were malicious?**
:::

---

## Further Reading

- **OWASP Top 10**: The top ten web application security risks — every developer should know them.
- **Practical Tools**: Use `npm audit` to check dependency vulnerabilities and ESLint security plugins to check code.
- **Deep Dive**: Learn about HTTPS principles, JWT security practices, and OAuth 2.0 security considerations.
- **Security Community**: Follow security advisories and patch known vulnerabilities promptly.
