# Compiler Principles

::: tip Preface
**When you press the "Run" button, how does your code become the result on screen?** The computer actually can't "understand" any line of code you write — it only recognizes 0s and 1s. The compiler is the "translator" that converts human language into machine language. Understanding compiler principles helps you understand where error messages come from, why some languages are faster than others, and the underlying logic of code optimization.
:::

**What will you learn from this article?**

After completing this chapter, you will gain:

- **Big picture view**: Master the complete compilation pipeline from source code to executable program
- **Lexical analysis**: Understand how compilers break code into tokens
- **Syntax analysis**: Understand the construction of AST (Abstract Syntax Tree)
- **AST visualization**: Intuitively see the tree structure of code
- **Semantic analysis and optimization**: Understand the principles of type checking and code optimization
- **Optimization techniques in practice**: Master core optimizations like constant folding and dead code elimination
- **Execution models**: Distinguish between compiled, interpreted, and JIT execution approaches

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | What Is a Compiler | Translator analogy, compilation pipeline |
| **Chapter 2** | Lexical Analysis | Tokens, lexical rules |
| **Chapter 3** | Syntax Analysis | AST, syntax trees, precedence |
| **Chapter 4** | AST Visualization | Interactive syntax tree, node types |
| **Chapter 5** | Semantic Analysis and Optimization | Type checking, constant folding, dead code elimination |
| **Chapter 6** | Optimization Techniques in Practice | Function inlining, loop hoisting, constant propagation |
| **Chapter 7** | Compiled vs Interpreted vs JIT | Comparison of three execution models |

---

## 0. Big Picture: Compilation Pipeline Overview

Imagine you're a translator tasked with translating a Chinese novel into English. You wouldn't translate word by word literally. Instead, you would:

1. **Identify words** — Break sentences into individual words (lexical analysis)
2. **Understand syntax** — Determine if sentence structure is correct (syntax analysis)
3. **Understand semantics** — Ensure the meaning is coherent and contradiction-free (semantic analysis)
4. **Polish and refine** — Make the translation more natural and fluent (code optimization)
5. **Output the translation** — Write the final English version (code generation)

A compiler does exactly the same thing, except it translates programming languages.

<CompilerAnalogyDemo />

---

## 1. The Compiler's Six-Stage Pipeline

A compiler's work can be divided into six stages, like a factory assembly line where each stage hands off to the next.

<CompilerDemo />

::: tip Compilation Pipeline
1. **Lexical Analysis**: Break source code into tokens (words)
2. **Syntax Analysis**: Organize tokens into a syntax tree (AST)
3. **Semantic Analysis**: Check if types are correct and variables are declared
4. **Intermediate Code Generation (IR Generation)**: Generate platform-independent intermediate representation
5. **Code Optimization**: Make the intermediate code more efficient
6. **Code Generation**: Generate machine code for the target platform
:::

| Stage | Input | Output | Analogy |
|------|------|------|------|
| Lexical Analysis | Source code character stream | Token stream | Break sentences into words |
| Syntax Analysis | Token stream | AST (syntax tree) | Analyze sentence structure |
| Semantic Analysis | AST | Typed AST | Check if the meaning makes sense |
| Intermediate Code | Typed AST | IR | Write a first draft |
| Code Optimization | IR | Optimized IR | Polish and trim |
| Code Generation | Optimized IR | Machine code | Output the final version |

---

## 2. Lexical Analysis: Tokenization of Source Code

Lexical analysis is the first step of compilation. The compiler scans each character of the source code from left to right, combining them into meaningful **tokens**.

<LexerTokenDemo />

Just as your brain automatically combines letters into words when reading an English sentence, the lexer combines characters into tokens:

```
Source code: let x = 10 + 5;

Token stream:
[let]   → Keyword (language reserved word)
[x]     → Identifier (variable name)
[=]     → Operator (assignment)
[10]    → Numeric literal
[+]     → Operator (addition)
[5]     → Numeric literal
[;]     → Separator (statement end)
```

::: tip Five Types of Tokens
- **Keywords**: Special words reserved by the language, such as `let`, `if`, `return`, `function`
- **Identifiers**: Names defined by programmers, such as variable names and function names
- **Literals**: Values written directly in code, such as the number `42` and the string `"hello"`
- **Operators**: Symbols that perform operations, such as `+`, `-`, `=`, `===`
- **Separators**: Symbols that separate code structures, such as `;`, `,`, `(`, `)`
:::

---

## 3. Syntax Analysis: Building the Syntax Tree (AST)

Lexical analysis breaks code into tokens, but tokens are just isolated "words." The task of syntax analysis is to organize these tokens into an **Abstract Syntax Tree (AST)** according to grammar rules — it reflects the structure of the code and operator precedence.

```
Expression: 1 + 2 * 3

Syntax tree:        Why this way?
       +       Because * has higher
      / \      precedence than +,
     1   *     so 2 * 3 groups
        / \    together first
       2   3
```

::: tip The Importance of AST
AST is the "core data structure" of a compiler. Subsequent semantic analysis, optimization, and code generation are all based on it. Modern development tools also heavily use AST:
- **ESLint**: Parses code into AST and checks for rule violations
- **Prettier**: Parses into AST and reformats the output
- **Babel**: Parses AST → transforms → generates compatible code
- **IDE refactoring**: Performs safe variable renaming and function extraction based on AST
:::

| Syntax Structure | Token Sequence | AST Node |
|---------|-----------|---------|
| Variable declaration | `let` `x` `=` `10` | VariableDeclaration → Identifier + Literal |
| Function call | `add` `(` `1` `,` `2` `)` | CallExpression → Identifier + Arguments |
| Conditional statement | `if` `(` `a` `>` `b` `)` | IfStatement → BinaryExpression + Block |

---

## 4. AST Visualization: Intuitive Presentation of Code Structure

Above we described AST structure in text, but "seeing" is more intuitive than "reading." The interactive component below lets you select different expressions and observe their syntax trees in real time.

<ASTVisualizerDemo />

Through visualization, you'll find that the core patterns of AST are actually quite simple:

| Code Structure | AST Root Node | Child Nodes |
|---------|-----------|-------|
| `1 + 2 * 3` | BinaryExpression (+) | Left: NumericLiteral(1), Right: BinaryExpression(*) |
| `let x = 10` | VariableDeclaration | VariableDeclarator → Identifier(x) + NumericLiteral(10) |
| `add(a, b)` | CallExpression | Identifier(add) + Arguments(a, b) |

::: tip AST in Daily Development
You may not have written a compiler directly, but you use AST-based tools every day:
- **ESLint / Prettier**: Parse code into AST for rule checking or reformatting
- **Babel / SWC**: Parse AST → transform syntax → generate compatible code
- **IDE refactoring**: Safe renaming and function extraction based on AST
- **Tree-shaking**: Analyze import/export in AST to remove unused code
:::

---

## 5. Semantic Analysis and Code Optimization

Syntax analysis ensures code is "structurally correct," but structural correctness doesn't mean "semantically correct." Semantic analysis checks whether the meaning of the code is valid, while code optimization makes programs run faster.

<CompilationPracticeDemo />

### 5.1 Semantic Analysis and Type Checking

| Check | Example | Result |
|---------|------|------|
| Type checking | `int x = "hello"` | Type mismatch |
| Scope checking | Using undeclared variable `y` | Variable does not exist |
| Type inference | `1 + 2.0` | Inferred result is float |
| Parameter checking | `add(1, 2, 3)` but function only accepts 2 parameters | Parameter count mismatch |

::: tip Most Errors You See Come from Semantic Analysis
- `TypeError: Cannot read properties of undefined` — Type checking
- `ReferenceError: x is not defined` — Scope checking
- `Expected 2 arguments, but got 3` — Parameter checking
:::

### 5.2 Code Optimization: Equivalent Transformation of Intermediate Representation

Before generating the final code, the compiler applies various optimizations to the intermediate code. These optimizations are transparent to the programmer but can significantly improve performance.

| Optimization Technique | Before | After | Principle |
|---------|-------|-------|------|
| Constant folding | `x = 10 + 5` | `x = 15` | Compute the result at compile time |
| Dead code elimination | `if (false) { ... }` | Removed entirely | Code that will never execute |
| Constant propagation | `x = 15; y = x * 2` | `y = 30` | Replace with known values directly |
| Loop-invariant code motion | Repeatedly computing `len = arr.length` inside a loop | Move outside the loop | Avoid redundant computation |

---

## 6. Optimization Techniques in Practice: How Compilers Make Code Faster

Above we mentioned several optimization technique names. Now let's dive deeper into exactly how compilers do this. The interactive component below demonstrates 5 of the most common compiler optimizations. You can intuitively compare the code before and after optimization.

<CodeOptimizationDemo />

Modern compilers and JIT engines (such as V8, GCC, LLVM) automatically apply dozens of optimizations. As a developer, you don't need to perform these optimizations manually, but understanding them helps you:

- **Write code that's easier to optimize**: For example, using `const` instead of `let` makes it easier for the compiler to apply constant folding
- **Understand performance differences**: Why are small functions faster than large ones? Because the compiler can inline them
- **Avoid "de-optimization"**: Certain coding patterns prevent compiler optimization, such as `eval()` and `with`

| Optimization Technique | Trigger Condition | Performance Impact | What Developers Can Do |
|---------|---------|---------|-------------|
| Constant folding | All constants in an expression | Eliminates runtime computation | Use const declarations more |
| Dead code elimination | Unreachable code or unused results | Reduces code size | Clean up unused code promptly |
| Loop-invariant code motion | Invariant computation inside a loop | Reduces redundant computation | Manual extraction is also a good habit |
| Function inlining | Small functions called frequently | Eliminates call overhead | Keep functions small and focused |
| Constant propagation | Variable values known at compile time | Entire computation chain eliminated | Use constants instead of magic numbers |

---

## 7. Compiled vs Interpreted vs JIT

After writing code, there are three "translation methods" to make it run. Each has its own strengths and weaknesses, directly determining the performance characteristics and use cases of the language.

<CompileVsInterpretDemo />

| Dimension | Compiled | Interpreted | JIT (Just-In-Time) |
|------|-------|-------|------------|
| Process | Fully compile to machine code first, then execute | Translate and execute line by line | Interpret first, then compile hot code |
| Execution speed | Fastest | Slowest | Medium (hot code接近compiled speed) |
| Startup speed | Slow (requires compilation) | Fast (runs directly) | Medium (requires warm-up) |
| Cross-platform | Requires recompilation | Naturally cross-platform | Cross-platform |
| Representative languages | C, Rust, Go | Python, Ruby | JavaScript (V8), Java |

::: tip Why Is JavaScript So Fast?
V8's JIT compiler monitors which code is executed frequently (hot code) and compiles it into highly optimized machine code. So although JavaScript is an "interpreted language," its performance in V8 can approach that of compiled languages. This is also the foundation that enables Node.js to be used on the server side.
:::

---

## Summary

Compiler principles aren't just knowledge for compiler developers. Understanding the compilation process helps you better understand error messages, choose appropriate languages, and write more efficient code.

Review the key points of this chapter:

1. **A compiler is a translator**: Converts human-readable code into machine-executable instructions
2. **Six-stage pipeline**: Lexical analysis → Syntax analysis → Semantic analysis → Intermediate code → Optimization → Code generation
3. **Lexical analysis breaks tokens**: Breaks character streams into meaningful units like keywords, identifiers, and operators
4. **Syntax analysis builds AST**: Organizes tokens into a tree structure according to grammar rules, reflecting operator precedence
5. **Semantic analysis ensures correctness**: Type checking, scope checking — most errors you encounter come from here
6. **Compilers optimize automatically**: Techniques like constant folding, dead code elimination, and function inlining make code automatically faster
7. **Three execution models**: Compiled is fastest, interpreted is most flexible, JIT combines the best of both

## Further Reading

- [AST Explorer](https://astexplorer.net/) - View the AST structure of code online
- [Crafting Interpreters](https://craftinginterpreters.com/) - Build a programming language from scratch (free online book)
- [The Super Tiny Compiler](https://github.com/jamiebuilds/the-super-tiny-compiler) - A super small compiler implemented in JavaScript
- [V8 Blog](https://v8.dev/blog) - V8 engine's JIT compilation technology blog
- [LLVM Official Site](https://llvm.org/) - The most popular compiler infrastructure
