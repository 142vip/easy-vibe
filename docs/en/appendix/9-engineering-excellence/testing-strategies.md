# An Introduction to Testing Strategies

::: tip Preface
**Is your code really "bug-free"?** After every code change, you manually click through to see if anything broke — this works when the project is small. But when the codebase grows to tens of thousands of lines and the team expands to a dozen people, "clicking around manually" becomes a disaster.

This chapter helps you understand the core strategies of software testing, from the test pyramid to TDD, building a systematic quality assurance mindset.
:::

**What will you learn in this article?**

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Test pyramid | Levels and ratios of testing |
| **Chapter 2** | Unit testing in practice | How to write a good test |
| **Chapter 3** | TDD-driven development | The Red-Green-Refactor cycle |
| **Chapter 4** | Choosing a testing strategy | Approaches for different scenarios |

After reading this chapter, you will understand how to choose appropriate testing strategies for your projects, write valuable tests, and improve code design quality through TDD.

---

## 0. The Big Picture: Motivation for Automateding Testing

Imagine you're a structural engineer. After every blueprint revision, you don't personally climb every floor to check if the structure is safe — you rely on an **automated inspection system**. Software testing is the "structural inspection system" of the code world.

::: tip The Value of Automated Testing
- **Regression Protection**: When you modify feature A, automatically check if features B, C, and D are affected
- **Refactoring Confidence**: With test coverage, you can refactor with confidence
- **Living Documentation**: Good tests are the best usage manual
- **Rapid Feedback**: Know in seconds if the code is correct, rather than discovering issues after deployment
:::

---

## 1. The Test Pyramid: Levels and Ratios of Testing

### 1.1 The Three-Layer Pyramid

The test pyramid proposed by Mike Cohn is a classic model for testing strategy. It tells us: **different types of tests should have different quantity ratios**.

Use the interactive component below — click on each layer of the pyramid to learn about its characteristics:

<TestPyramidDemo />

### 1.2 Motivation for a Pyramid Shape

The pyramid shape reflects a core tradeoff: **the balance between speed and realism**.

- **Bottom layer (Unit Tests)**: Extremely fast, most numerous, lowest cost, but only verify individual parts
- **Middle layer (Integration Tests)**: Moderate speed, moderate quantity, verify how parts work together
- **Top layer (E2E Tests)**: Closest to real users, but slow, high maintenance cost, prone to environment-related failures

> **Anti-pattern: The Ice Cream Cone** — If your project has the most E2E tests and the fewest unit tests, you have an inverted "ice cream cone." This means your test suite runs slowly, fails frequently, and has extremely high maintenance costs.

---

## 2. Unit Testing in Practice

### 2.1 What Makes a Good Unit Test

Good unit tests follow the **FIRST** principles:

| Principle | Meaning | Description |
|------|------|------|
| **F**ast | Fast | Completes in milliseconds; developers are willing to run them frequently |
| **I**ndependent | Independent | Tests don't depend on each other; each can run independently |
| **R**epeatable | Repeatable | Same results in any environment |
| **S**elf-validating | Self-validating | Clear pass/fail result; no human judgment needed |
| **T**imely | Timely | Written at the same time as — or before — the code |

### 2.2 Test Structure: The AAA Pattern

Every test should have a clear three-part structure:

```javascript
test('should correctly calculate price with tax', () => {
  // Arrange — set up test data
  const price = 100
  const taxRate = 0.13

  // Act — call the function under test
  const result = calculateTotalWithTax(price, taxRate)

  // Assert — verify the result
  expect(result).toBe(113)
})
```

### 2.3 What to Test? What Not to Test

**Should test:**
- Core business logic (price calculations, permission checks, data transformations)
- Edge cases (null, zero, negative numbers, extremely large numbers)
- Error handling paths

**Don't need to test:**
- Internal implementations of third-party libraries
- Simple getters/setters
- Framework features (e.g., Vue's reactivity system)

---

## 3. TDD: Test-Driven Development

### 3.1 The Red-Green-Refactor Cycle

The core of TDD (Test-Driven Development) is a simple cycle: **write a test first, then write the implementation, then refactor**.

Use the interactive component below to experience the complete TDD cycle:

<TDDCycleDemo />

### 3.2 The Three Rules of TDD

1. **Don't write any production code except to make a failing test pass**
2. **Write only enough of a test to demonstrate a failure** (compilation errors count as failures)
3. **Write only enough production code to pass the test**

### 3.3 The True Value of TDD

The value of TDD goes beyond "writing tests first" — it **forces you to think about interface design**. When you write a test first, you think from the "user's" perspective: what parameters should this function accept? What should it return? This naturally leads to better API design.

::: tip TDD Is Not a Silver Bullet
TDD is well-suited for logic-heavy code (algorithms, business rules, data transformations), but for UI layout, exploratory prototypes, and similar scenarios, forcing TDD can actually slow you down. The key is to understand its principles and apply them flexibly.
:::

---

## 4. Choosing a Testing Strategy

### 4.1 Testing Focus by Project Type

| Project Type | Testing Focus | Recommended Ratio |
|----------|----------|----------|
| **Utility Library / SDK** | Primarily unit tests | 90% unit + 10% integration |
| **API Service** | Primarily integration tests | 30% unit + 60% integration + 10% E2E |
| **Web Application** | Balanced distribution | 50% unit + 30% integration + 20% E2E |
| **MVP / Prototype** | Critical path E2E | A small number of core tests is sufficient |

### 4.2 Common Testing Tools

| Tool | Type | Use Case |
|------|------|----------|
| **Vitest** | Unit/Integration | First choice for Vite projects; compatible with Jest API |
| **Jest** | Unit/Integration | Most popular in the Node.js ecosystem |
| **Playwright** | E2E | Cross-browser; developed by Microsoft |
| **Cypress** | E2E | Great developer experience; easy debugging |
| **Testing Library** | Component testing | Test UI components from the user's perspective |

---

## 5. AI-Powered: Using LLMs to Improve Testing Efficiency

LLMs are already very capable in the testing domain — they can help you generate test cases, discover edge cases, and even write complete test code.

### 5.1 Generating Unit Tests

> **Prompt**:
> ```
> Please write unit tests for the following function using the Vitest framework:
> 1. Follow the AAA pattern (Arrange-Act-Assert)
> 2. Cover the happy path, edge cases, and error paths
> 3. Each test case should have a clear description
>
> [Paste your function code]
> ```

### 5.2 Discovering Edge Cases

> **Prompt**:
> ```
> Analyze the following function and list all possible edge cases and
> extreme input scenarios, including: null, zero, negative numbers,
> extremely large numbers, special characters, concurrency situations, etc.
> For each scenario, describe the expected behavior and potential risks.
>
> [Paste your function code]
> ```

### 5.3 Generating Tests from Requirements (TDD Assistance)

> **Prompt**:
> ```
> I want to implement a shopping cart module with these requirements:
> - Add items, remove items, modify quantities
> - Automatically calculate total price (with discounts)
> - Show error when stock is insufficient
>
> Following TDD methodology, first write test cases (no implementation),
> using Vitest, covering all core scenarios.
> ```

::: tip AI Usage Advice
Always check that AI-generated test assertions are meaningful — avoid useless tests like `expect(true).toBe(true)`. Good tests should actually fail when the code is wrong.
:::

---

## 6. Summary

1. **Test Pyramid**: More at the bottom, fewer at the top; balance speed with realism
2. **Unit Tests**: Follow FIRST principles and AAA pattern; test core logic
3. **TDD**: Red-Green-Refactor cycle; use tests to drive design
4. **Strategy Selection**: Choose appropriate testing ratios based on project type and stage

::: tip Final Thought
Testing is not a burden — it's an **accelerator**. In the short term, writing tests does take extra time; in the long term, it saves countless hours of manual verification, regression bug investigation, and late-night emergency fixes. Good tests give you the confidence to say: **"Go ahead and make changes — the tests will tell us if anything is wrong."**
:::

---

## Further Reading

- **Classic Book**: Kent Beck's *Test-Driven Development* is the foundational work on TDD.
- **Practical Guide**: Try writing tests for a small project with Vitest to experience the testing process from scratch.
- **Testing Patterns**: Learn the differences and use cases for Mock, Stub, and Spy.
- **Continuous Integration**: Integrate tests into your CI/CD pipeline so they run automatically with every commit.
