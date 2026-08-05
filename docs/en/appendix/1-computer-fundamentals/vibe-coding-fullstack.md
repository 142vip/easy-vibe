# Full-Stack Development: An Introduction — A Computer Map for the Vibe Coding Era

::: tip Preface
**What is Vibe Coding?** Simply put, it's "writing code with natural language" — you describe what you want in Chinese or English, and AI generates the code for you. This has completely changed the rules of the software development game.

But here's a key question: **AI can help you write code, but AI can't think for you.** You still need to know "what to write," "why to write it this way," and "how to judge if it's correct." This is exactly the foundational cognitive framework this chapter will help you build.
:::

**What will you learn from this article?**

After completing this chapter, you will gain:

- **Domain overview**: Know what frontend, backend, AI algorithms, and other directions each do
- **Technology selection ability**: Make rational judgments when facing "what language/framework to learn"
- **Clear growth path**: Understand the skill progression from zero-experience to a 3-5 year engineer
- **Vibe Coding mindset**: Understand which abilities become more important in the AI-assisted era

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Computer Domain Overview | Frontend, backend, mobile, AI, DevOps |
| **Chapter 2** | What Is Frontend | The user-facing interface layer |
| **Chapter 3** | What Is Backend | Behind-the-scenes server logic |
| **Chapter 4** | Programming Language Landscape | Tools for communicating with computers |
| **Chapter 5** | Full-Stack Engineer | A versatile developer covering both frontend and backend |
| **Chapter 6** | AI Algorithm Engineer | Making machines learn to think |
| **Chapter 7** | Growth Path | Roadmap from beginner to expert |

---

## 0. Vibe Coding: A New Paradigm for Software Development

### 0.1 Vibe Coding Overview

Imagine software development in the past:

<VibeCodingFlowDemo />

**Core shift**: From "how to write code" to "how to describe requirements."

### 0.2 Core Skills in the Vibe Coding Era

<DeveloperSkillShiftDemo />

::: tip Key Insight
AI can help you write code, but the following abilities are irreplaceable by AI:
- **Judgment**: Knowing whether AI-generated code is correct and good
- **Architecture thinking**: Knowing how to design systems and divide modules
- **Domain knowledge**: Understanding business logic and knowing "what to build"
- **Debugging ability**: Knowing where to investigate when problems arise
:::

---

## 1. Computer Domain Overview

Before diving into each direction, let's first build a holistic understanding.

<ComputerFieldMapDemo />

### 1.1 Role Division by Domain: A Restaurant Analogy

Think of a software system as a **restaurant**:

| Domain | Restaurant Role | What They Do | Output |
|-----|---------|--------|--------|
| **Frontend** | Decor + Menu + Waiter | Everything users can see and interact with | Webpages, mini-programs, app interfaces |
| **Backend** | Kitchen + Warehouse | Process business logic and store data | APIs, databases, server programs |
| **Mobile** | Takeout Window | Mobile app experience | iOS/Android Apps |
| **AI/Algorithms** | R&D Department | Make the system "smart" | Recommendation models, image recognition, intelligent chat |
| **DevOps** | Property Management + Security | Ensure stable system operation | Deployment scripts, monitoring systems, security protection |
| **Data Engineering** | Finance + Analysts | Data collection, storage, analysis | Data pipelines, reports, dashboards |

### 1.2 Tech Stack Overview by Domain

Don't be intimidated by these terms — this is just to give you exposure:

| Domain | Core Languages | Common Frameworks/Tools | Typical Output |
|-----|---------|--------------|---------|
| Frontend | JavaScript, TypeScript | React, Vue, CSS | Webpages, admin dashboards |
| Backend | Node.js, Go, Java, Python | Express, Gin, Spring | API services |
| Mobile | Swift, Kotlin, Dart | SwiftUI, Jetpack, Flutter | Mobile apps |
| AI/Algorithms | Python | PyTorch, TensorFlow | Models, algorithms |
| DevOps | Shell, Python | Docker, Kubernetes | Deployment solutions |

::: tip Advice for Beginners
Don't try to learn everything at once. Pick one direction to go deep first, establish a "base camp," then expand horizontally. Full-stack doesn't mean "knowing a little about everything" — it means "having one core strength while being functional in other areas."
:::

---

## 2. Frontend Overview

### 2.1 One-Sentence Definition

**Frontend = everything the user can directly see, click, and interact with.**

When you open a webpage:
- Page layout, colors, fonts → Frontend
- Animation effects after clicking a button → Frontend
- Form inputs and data display → Frontend
- How the page adapts to mobile screens → Frontend

### 2.2 The Frontend Trio

<FrontendTriadDemo />

**Using "house renovation" as an analogy:**

| Technology | Renovation Role | Responsibility |
|-----|---------|------|
| **HTML** | House structure | Where walls are, where doors are, how rooms are divided |
| **CSS** | Decorative style | Wall colors, furniture arrangement, lighting effects |
| **JavaScript** | Smart home | Light switches, automatic curtains, security system |

### 2.3 Purpose of Frontend Frameworks

You can write webpages with plain HTML/CSS/JS, so why learn frameworks like React and Vue?

<FrontendFrameworkDemo />

**Core reason**: When pages become complex (like Taobao or WeChat web version), directly manipulating page elements one by one becomes very messy. Frameworks help you "manage complexity."

### 2.4 A Day in the Life of a Frontend Engineer

```
9:00  Review design mockups, understand feature requirements
10:00 Write component code with React/Vue
12:00 Lunch break
14:00 Work with backend on API integration, debug data display
16:00 Fix bugs, optimize page performance
18:00 Code review, discuss technical solutions with the team
```

---

## 3. Backend Overview

### 3.1 One-Sentence Definition

**Backend = the logic users can't see but that powers the entire system.**

When you place an online order:
- Verifying your username and password → Backend
- Checking product inventory → Backend
- Calculating discounted prices → Backend
- Generating the order and processing payment → Backend
- Notifying the warehouse to ship → Backend

### 3.2 Core Backend Responsibilities

<BackendCoreDemo />

**Using "restaurant kitchen" as an analogy:**

| Backend Responsibility | Kitchen Analogy | Details |
|---------|---------|---------|
| **API Design** | Menu design | Define "what dishes users can order" and "how to order" |
| **Business Logic** | Cooking process | Process orders, calculate prices, verify permissions |
| **Data Storage** | Warehouse management | Store data in databases, query data |
| **Performance Optimization** | Kitchen efficiency | Caching, async processing, load balancing |
| **Security** | Food safety | Prevent SQL injection, access control |

### 3.3 Backend Language Selection

| Language | Characteristics | Best For |
|-----|------|---------|
| **Node.js** | Frontend-friendly, JavaScript full-stack | Small-to-medium projects, rapid prototyping |
| **Go** | High performance, strong concurrency | High-concurrency services, microservice architecture |
| **Java** | Mature ecosystem, enterprise-grade | Large enterprise systems, banking |
| **Python** | Clean syntax, great AI ecosystem | Data processing, AI services |

::: tip Beginner Advice
If you already know JavaScript (frontend basics), Node.js is the most natural backend entry point. One language for both frontend and backend.
:::

### 3.4 A Day in the Life of a Backend Engineer

```
9:00  Review API requirement documents
10:00 Design database table structures
11:00 Write API endpoint code
14:00 Work with frontend on integration, fix API issues
16:00 Optimize slow queries, handle production issues
18:00 Code review, write technical documentation
```

---

## 4. Programming Language Concepts: Paradigms, Evolution, and Selection

### 4.1 Programming Languages Overview

**Programming languages = the bridge between humans and computers.**

Computers only understand 0s and 1s, while humans prefer natural language. Programming languages are the middle layer:
- Humans write code in programming languages (more understandable than 0/1)
- Computers translate programming languages into machine instructions

### 4.2 Language Classification

<ProgrammingLanguageMapDemo />

**By execution method:**

| Type | Principle | Representative Languages | Characteristics |
|-----|------|---------|------|
| **Compiled** | Translate to machine code first, then run | C, C++, Go, Rust | Fast execution, slow compilation |
| **Interpreted** | Translate and run simultaneously | Python, JavaScript, Ruby | Fast development, slow execution |
| **Bytecode** | Compromise approach | Java, Kotlin, C# | Balances performance and development efficiency |

**By type system:**

| Type | Characteristics | Representative Languages |
|-----|------|---------|
| **Static typing** | Variable types determined at compile time | Java, TypeScript, Go |
| **Dynamic typing** | Variable types determined at runtime | Python, JavaScript, Ruby |
| **Strong typing** | Strict type checking, no auto-conversion | Python, Java |
| **Weak typing** | Loose type checking, auto-conversion | JavaScript, PHP |

### 4.3 Language Selection Guidance

<LanguageSelectionDemo />

::: tip Selection Principles
There is no "best language," only the "most suitable language for the scenario." Beginner recommendations:
1. **Learn one language deeply first**: Build programming thinking
2. **Then learn a second one for comparison**: Understand language design differences
3. **Learn on demand**: Choose based on project requirements
:::

---

## 5. Full-Stack Engineer: Mastering Both Frontend and Backend

### 5.1 Full-Stack Overview

**A full-stack engineer = someone who can independently complete both frontend and backend development.**

<FullstackSkillDemo />

### 5.2 Advantages of Full-Stack

| Advantage | Description |
|-----|------|
| **Independent project completion** | From requirements to deployment, done by one person |
| **Low communication overhead** | No back-and-forth between frontend and backend teams |
| **Broad technical vision** | Understand how the entire system works |
| **Startup-friendly** | Rapidly validate ideas, build MVPs |

### 5.3 Challenges of Full-Stack

| Challenge | Description |
|-----|------|
| **Depth vs breadth** | Easy to become "jack of all trades, master of none" |
| **Fast technology evolution** | Both frontend and backend technologies evolve rapidly |
| **Scattered focus** | Need to stay current across multiple domains simultaneously |

### 5.4 Full-Stack Growth Advice

```
Stage 1: Establish a base camp
└── Pick one direction to go deep (recommend starting with frontend or backend)
└── Reach the level of independently completing projects

Stage 2: Expand horizontally
└── Learn the basics of the other direction
└── Be able to complete simple full-stack projects

Stage 3: Integrate and master
└── Understand how frontend and backend collaborate
└── Be able to design complete technical architectures

Stage 4: Continuous refinement
└── Maintain depth in one area
└── Keep other areas at a "functional" level
```

---

## 6. AI Algorithm Engineer: Making Machines Learn to Think

### 6.1 AI Engineer vs Traditional Developer

<AIvsTraditionalDemo />

| Dimension | Traditional Development | AI Algorithm Engineer |
|-----|---------|--------------|
| **Core task** | Implement deterministic business logic | Train models, optimize algorithms |
| **Mindset** | "If A, then execute B" | "Let machines learn patterns from data" |
| **Code output** | Feature modules, systems | Models, training scripts |
| **Debugging method** | Breakpoints, logging | Review metrics, tune hyperparameters |
| **Success criteria** | Correct functionality, no bugs | Accuracy and recall meet targets |

### 6.2 AI Engineer Skill Tree

```
AI Engineer (2025)
    │
    ├── Foundational Skills
    │   ├── Python (primary language)
    │   ├── Data Processing (Pandas, NumPy)
    │   └── Basic Math Intuition (linear algebra, probability & statistics)
    │
    ├── Large Model Applications (hottest direction)
    │   ├── Prompt Engineering
    │   ├── RAG (Retrieval-Augmented Generation)
    │   ├── AI Agents (letting AI complete tasks autonomously)
    │   ├── Function Calling / MCP (letting AI call external tools)
    │   └── Fine-tuning & Deployment (LoRA, vLLM)
    │
    ├── Generative AI (GenAI)
    │   ├── Text Generation (GPT, Claude, Gemini)
    │   ├── Image Generation (Stable Diffusion, Midjourney, FLUX)
    │   ├── Video Generation (Sora, Kling)
    │   └── Multimodal (text + image + audio)
    │
    └── Traditional Machine Learning (still important)
        ├── Supervised Learning (classification, regression)
        ├── Deep Learning Frameworks (PyTorch)
        └── Model Evaluation & Optimization
```

### 6.3 A Day in the Life of an AI Engineer

```
9:00  Review model training results, analyze metrics
10:00 Data preprocessing, clean training data
12:00 Lunch break
14:00 Adjust model architecture, try new approaches
16:00 Run experiments, compare results from different approaches
18:00 Write experiment reports, discuss next steps with the team
```

### 6.4 AI Engineers in the Vibe Coding Era

How AI-assisted development impacts AI engineers:

| Change | Description |
|-----|------|
| **Code generation** | AI can generate training scripts and data processing code |
| **Paper reading** | AI can summarize key points of research papers |
| **Experiment logging** | AI can help organize experiment results |
| **What doesn't change** | Understanding of problems, judgment of results, direction-setting |

---

## 7. Growth Path: From Beginner to Expert

### 7.1 3-5 Year Growth Roadmap

<CareerPathDemo />

### 7.2 Skill Requirements at Each Stage

| Stage | Duration | Core Skills | Typical Output |
|-----|------|---------|---------|
| **Beginner** | 0-1 year | Master one language + basic tools | Can complete simple feature modules |
| **Intermediate** | 1-2 years | Proficient in one tech stack + engineering practices | Can independently complete medium projects |
| **Senior** | 2-3 years | Deep expertise in one area + architecture skills | Can design system solutions |
| **Staff** | 3-5 years | Technical depth + business understanding + team collaboration | Can lead large projects |

### 7.3 Learning Strategy in the Vibe Coding Era

<LearningStrategyDemo />

::: tip Core Advice
1. **Fundamentals matter more than tools**: Language features, data structures, and algorithmic thinking are the foundation
2. **Practice matters more than theory**: Building projects is the best way to learn
3. **Thinking matters more than memorization**: Understanding "why" is more valuable than remembering "how"
4. **AI is a tool, not a crutch**: Use AI to accelerate learning, don't use AI to replace thinking
:::

---

## 8. Summary: Core Competitiveness in the Vibe Coding Era

Looking back at this chapter, we've built a holistic understanding of the computer field:

1. **Domain division**: Frontend, backend, mobile, AI, DevOps, data — each has its own focus
2. **Technology selection**: There's no best technology, only the most suitable technology for the scenario
3. **Growth path**: Go deep first, then broad; establish a base camp before expanding horizontally
4. **AI era**: AI can help you write code, but it can't think for you

### Three Layers of Ability in the Vibe Coding Era

```
┌─────────────────────────────────────────┐
│  Layer 3: Judgment (AI can't replace)    │
│  - Knowing what is correct               │
│  - Knowing what is good                  │
│  - Knowing which direction to go         │
├─────────────────────────────────────────┤
│  Layer 2: Architecture Thinking (AI assists) │
│  - System design ability                 │
│  - Module division ability               │
│  - Technology selection ability          │
├─────────────────────────────────────────┤
│  Layer 1: Code Implementation (AI excels) │
│  - Syntax writing                        │
│  - API calls                             │
│  - Common pattern implementation         │
└─────────────────────────────────────────┘
```
