# An Introduction to Technical Writing

::: tip Preface
**Does anyone read the documentation you write?** Many developers think "if the code works, that's enough — documentation can wait." The result: new hires can't understand the project, API integration relies entirely on verbal communication, and six months later even you've forgotten why you designed it that way.

This chapter helps you master the core methods of technical writing so your documentation is actually read, understood, and useful.
:::

**What will you learn in this article?**

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Document types and structure | How to write different documents |
| **Chapter 2** | Writing principles | Clear, accurate, concise |
| **Chapter 3** | Practical comparisons | Good docs vs. bad docs |
| **Chapter 4** | Document maintenance | Keeping documentation up to date |

After reading this chapter, you will be able to write technical documentation that is well-structured, accurate, and easy to maintain.

---

## 0. The Big Picture: Why Technical Documentation Matters

Code tells the computer "how"; documentation tells people "why." A project without documentation is like an appliance without a manual — it works, but using it is pure guesswork.

::: tip The Value of Good Documentation
- **Reduced Communication Costs**: New team members can onboard independently, reducing repeated explanations
- **Preserved Decision Context**: Recording "why," not just "what"
- **Increased Project Credibility**: Good documentation is the face of an open source project
- **Accelerated Collaboration**: API documentation enables parallel front-end and back-end development
:::

---

## 1. Document Types and Structure

Use the interactive component below to learn the standard structure for different types of documents:

<DocStructureDemo />

### 1.1 Common Document Types

| Document Type | Target Audience | Core Content |
|---------|---------|---------|
| **README** | Everyone | What the project is, how to use it, how to contribute |
| **API Documentation** | API consumers | Endpoints, parameters, responses, error codes |
| **Architecture Docs** | Development team | System design, technology choices, data flow |
| **Changelog** | Users/developers | Version changes, additions/fixes/breaking changes |
| **Contributing Guide** | Contributors | Dev environment, code standards, PR process |

### 1.2 The Golden Structure of a README

A good README should include:

1. **Project name + one-line description**: Let people know what this is in 3 seconds
2. **Quick start**: Run it with minimal steps
3. **Features**: Core selling points
4. **Installation**: Detailed environment requirements and installation steps
5. **Usage examples**: Copy-paste-ready code
6. **Contributing guide**: How to participate
7. **License**: Legal information

---

## 2. Writing Principles

### 2.1 Clarity First

```markdown
<!-- Bad: vague and unclear -->
This function processes data.

<!-- Good: specific and clear -->
Converts raw order data to invoice format, including tax calculation and currency conversion.
```

### 2.2 Audience-Oriented

Before writing documentation, ask: **Who will read this? What information do they need?**

- Writing for beginners: Explain terminology, provide complete examples
- Writing for experienced developers: Get to the point, provide API references
- Writing for non-technical people: Use analogies, avoid jargon

### 2.3 Code Examples Are the Best Documentation

```markdown
<!-- Bad: text description only -->
Call the createUser function, passing in the username and email parameters.

<!-- Good: runnable example -->
const user = await createUser({
  name: 'Zhang San',
  email: 'zhangsan@example.com'
})
// Returns: { id: 'u_123', name: 'Zhang San', createdAt: '2025-01-15' }
```

---

## 3. Practical Comparisons

Use the interactive component below to compare good and bad technical writing:

<TechWritingPracticeDemo />

### 3.1 Commit Message Standards

```
# Bad
fix bug
update code

# Good (Conventional Commits)
fix: resolve login page white screen issue on Safari
feat: support batch export of PDF reports
docs: update example code in API authentication section
```

### 3.2 The Art of Comments

```javascript
// Bad: describes "what" (the code already says this)
// Iterate through the array
for (const item of items) { ... }

// Good: explains "why"
// Iterate in reverse because forward iteration skips the next item when deleting
for (let i = items.length - 1; i >= 0; i--) { ... }
```

---

## 4. Document Maintenance

### 4.1 Docs as Code

Keep documentation and code in the same repository, managed with the same workflow:

- Submit documentation changes alongside code in the same PR
- Use CI to check documentation formatting and link validity
- Update documentation in sync with version releases

### 4.2 Preventing Documentation Rot

| Problem | Solution |
|------|---------|
| Outdated documentation | Force documentation updates with code changes (PR checks) |
| No one maintains it | Assign documentation owners |
| Content duplication | Single source of truth, link to it elsewhere |

---

## 5. AI-Powered: Using LLMs to Improve Documentation Quality

LLMs are almost "naturally gifted" in technical writing — generating documentation, improving expression, and translating content are all strong suits.

### 5.1 Generating API Documentation

> **Prompt**:
> ```
> Based on the following Express route code, generate complete API documentation including:
> - Endpoint path and method
> - Request parameters (path params, query params, request body) and types
> - Success and error response examples
> - curl usage examples
>
> [Paste your route code]
> ```

### 5.2 Improving Technical Writing

> **Prompt**:
> ```
> Please improve the expression of the following technical documentation:
> 1. Use concise and clear language, remove redundant expressions
> 2. Replace passive voice with active voice
> 3. Keep technical terms accurate
> 4. Add necessary code examples
> Preserve the original meaning; only improve the quality of expression.
>
> [Paste your documentation content]
> ```

### 5.3 Generating a README

> **Prompt**:
> ```
> Based on the following project information, generate a high-quality README.md:
> - Project name: [name]
> - One-line description: [description]
> - Tech stack: [list]
> - Core features: [list]
>
> Must include: project introduction, quick start, features,
> installation steps (with code), usage examples, contributing guide, license.
> ```

::: tip AI Usage Advice
Always verify technical details in AI-generated documentation — it may fabricate non-existent API parameters or incorrect return values. Always cross-check against the actual code.
:::

---

## 6. Summary

1. **Type Matching**: Different documents have different structures and writing styles
2. **Clarity First**: Be specific, accurate, and audience-oriented
3. **Example-Driven**: Good code examples are worth a thousand words
4. **Continuous Maintenance**: Treat docs as code, evolving with the project

::: tip Final Thought
Writing documentation is not wasting time — it's **saving future time**. The 30 minutes you spend writing documentation today could save 10 people an hour each. Good documentation is the best investment you can make for your team.
:::

---

## Further Reading

- **Writing Guide**: Google's Technical Writing course is free and practical.
- **Documentation Tools**: VitePress, Docusaurus, GitBook, and other modern documentation frameworks.
- **API Documentation**: The OpenAPI/Swagger specification is the industry standard for API documentation.
- **Practical Advice**: Start by writing a good README for your own project.
