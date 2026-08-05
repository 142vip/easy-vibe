# Principles of AI Agent Protocols: MCP and A2A

::: tip The Core Question
**How do AI Agents "talk" to the external world?** Just as the internet needs the HTTP protocol, AI Agents also need standardized communication protocols. This chapter introduces the two most mainstream Agent protocols: MCP and A2A, which respectively solve the problems of AI-to-tool and Agent-to-Agent communication.
:::

---

## 0. Overview of a Protocol

In computing, a **protocol** is a set of standardized rules and conventions that enable different systems and programs to "understand" and "communicate" with each other.

### 0.1 Motivation for needing Protocols

Imagine this scenario: you send a package to a friend and need to write the address. If everyone wrote addresses in a different format, the courier wouldn't be able to deliver anything. A protocol is the standard that defines "how to write an address" — province, city, district, street, house number. Write it this way, and anyone can understand it.

The same goes for computers. For two programs to communicate, they must agree on:
- What is the data format? (JSON? Binary?)
- How to establish a connection? (Handshake process)
- What to do when errors occur? (Error handling)

### 0.2 Common Protocols in Computing

| Protocol | Purpose | You Use It Every Day |
|----------|---------|----------------------|
| **HTTP** | Web page transfer protocol | Opening web pages in a browser |
| **HTTPS** | Encrypted HTTP | Online banking, payment pages |
| **TCP/IP** | Internet foundation protocol | All network communication |
| **DNS** | Domain name resolution | Translating `google.com` into an IP address |
| **SMTP** | Email sending protocol | Sending emails |
| **WebSocket** | Bidirectional real-time communication | Chat apps, online games |
| **SSH** | Secure remote login | Connecting to servers |
| **FTP** | File transfer protocol | Uploading/downloading files |

These protocols form the cornerstone of the internet. Without them, you couldn't browse the web, send emails, or watch videos.

### 0.3 The Value of Protocols

The core value of protocols lies in **standardization** and **interoperability**:

- **Standardization**: Everyone follows the same set of rules, reducing communication overhead
- **Interoperability**: Systems from different vendors and tech stacks can integrate seamlessly

For example, the HTTP protocol allows Chrome to access Nginx servers, and enables a Python crawler to fetch data from a Java website. Chrome and Nginx don't need to "know" each other — they just need to both follow the HTTP protocol.

### 0.4 AI Agents Need Protocols Too

For AI Agents to actually "get work done," they need to:
- Call external tools (check the weather, send emails, query databases)
- Collaborate with other Agents (divide work to complete complex tasks)

This requires standardized protocols that define "how AI invokes tools" and "how Agents communicate with each other." This is where **MCP** and **A2A** come from.

---

## 1. The Layers of Agent Protocols

Before diving into specific protocols, let's look at the communication layers in the Agent ecosystem:

| Layer | Protocol | Problem Solved | Analogy |
|-------|----------|---------------|---------|
| **1** | Function Call | How AI calls local functions | The brain issuing commands |
| **2** | **MCP** | How AI connects to external tools and data sources | USB-C connector |
| **3** | **A2A** | How Agents collaborate and communicate | WeChat Work |

::: tip Reading This Table Line by Line
**Layer 1 (Function Call)**: This is the most fundamental capability of large models — triggering function execution by outputting structured data (JSON). It's the foundation of "protocols," but is more of a capability than a formal standard.

**Layer 2 (MCP)**: Model Context Protocol, released by Anthropic in November 2024. It standardizes how AI connects to external tools and data sources, just as USB-C unified charging ports across all kinds of devices.

**Layer 3 (A2A)**: Agent-to-Agent Protocol, released by Google in April 2025. It enables different Agents to discover, communicate with, and collaborate with each other, just as WeChat Work lets colleagues send tasks and chat.
:::

This chapter focuses on the two formal protocols at layers 2 and 3: MCP and A2A.

---

## 2. MCP (Model Context Protocol)

### 2.1 Basic Protocol Information

| Item | Details |
|------|---------|
| **Full Name** | Model Context Protocol |
| **Proposed By** | Anthropic |
| **Release Date** | November 25, 2024 |
| **Official Documentation** | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| **License** | MIT License |
| **GitHub** | [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol) |

::: tip Why Is It Called "Context Protocol"?
**Context** is key to how large models understand tasks. The core idea behind MCP is: **enabling AI to dynamically obtain the context information it needs**, rather than stuffing everything into the Prompt.

For example, when AI needs to read a file, you don't need to copy and paste the file content — it can access the file system directly through MCP.
:::

### 2.2 Background of Its Release

In 2024, with the release of Claude 3.5 Sonnet, Anthropic identified a problem: **every tool required separate integration**.

Imagine:
- You want AI to read a GitHub repo → write GitHub integration code
- You want AI to query a database → write database integration code
- You want AI to operate on the file system → write file system integration code

Each integration requires writing similar code repeatedly: authentication, error handling, data transformation…

Anthropic wrote in their official blog:
> "We're introducing the Model Context Protocol (MCP), an open protocol that standardizes how applications provide context to LLMs."

**Core goal**: Let tool developers write code once, and have it usable by all MCP-compatible AI applications.

### 2.3 Overview of MCP

<McpVisualDemo />

**Three Core Capabilities**:

| Capability | Description | Example |
|-----------|-------------|---------|
| **Tools** | Functions AI can invoke | Check weather, send email |
| **Resources** | Data AI can read | File contents, database records |
| **Prompts** | Predefined prompt templates | Code review template, writing template |

### 2.4 Internal Implementation of MCP

<McpDetailedDemo />

### 2.5 An Analogy: The USB-C Connector

MCP is like the **USB-C connector**:

- **Before**: Every device had its own charging port (round, flat, magnetic…)
- **Now**: USB-C unifies charging and data transfer across all devices
- **MCP**: Unifies how AI connects to all tools

Tool developers only need to implement an MCP Server once, and all MCP-compatible AI applications (Claude, Cursor, Windsurf, etc.) can use it directly.

### 2.6 Typical MCP Use Cases

| Scenario | Description | Example |
|----------|-------------|---------|
| **Local File Operations** | Let AI read/modify local files | Read codebases, analyze log files |
| **Database Queries** | Let AI query databases directly | SQL queries, data analysis |
| **API Calls** | Let AI call third-party services | GitHub API, Slack, email |
| **Dev Tool Integration** | Let AI use development tools | Git operations, terminal commands |

**Real-World Examples**:
- **Cursor/Windsurf**: Connect to file system, Git, and terminal via MCP
- **Claude Desktop**: Connect to note-taking apps and email clients via MCP
- **Automation Scripts**: Let AI execute automated tasks (backups, deployments, data sync)

---

## 3. A2A (Agent-to-Agent Protocol)

### 3.1 Basic Protocol Information

| Item | Details |
|------|---------|
| **Full Name** | Agent-to-Agent Protocol |
| **Proposed By** | Google |
| **Release Date** | April 9, 2025 |
| **Official Documentation** | [google.github.io/A2A](https://google.github.io/A2A) |
| **License** | Apache 2.0 |
| **GitHub** | [github.com/google/A2A](https://github.com/google/A2A) |

::: tip Why Was It Proposed by Google?
Google announced A2A at Cloud Next 2025, closely tied to its enterprise AI strategy.

Google believes that the future of enterprise AI is not a single super Agent, but **multiple specialized Agents collaborating** — some responsible for data analysis, some for code generation, some for document processing.

These Agents need a standardized way to communicate with each other, and A2A was born.
:::

### 3.2 Background of Its Release

MCP solved the problem of "how AI connects to tools," but another question remained: **how do multiple Agents collaborate?**

Imagine this scenario:
- Agent A is a "requirements analysis expert"
- Agent B is a "code generation expert"
- Agent C is a "testing expert"

A user says: "Help me develop a login feature"

Agent A analyzes the requirements and needs to delegate the task to Agent B; Agent B writes the code and needs Agent C to test it. How do they communicate with each other?

Google wrote in their official blog:
> "A2A is an open protocol that enables AI agents to communicate with each other, facilitating collaboration across different frameworks and vendors."

**Core goal**: Enable Agents built by different vendors and frameworks to collaborate seamlessly.

### 3.3 Overview of A2A

<A2AVisualDemo />

**Three Core Concepts**:

| Concept | Description | Analogy |
|---------|-------------|---------|
| **Agent Card** | Describes an Agent's capabilities | Employee badge |
| **Task** | A unit of work to be executed | Work ticket |
| **Message** | Communication content between Agents | Chat history |

### 3.4 Internal Implementation of A2A

<A2ADetailedDemo />

### 3.5 An Analogy: WeChat Work

A2A is like **WeChat Work**:

- **Agent Card**: Everyone's business card, showing name, department, and responsibilities
- **Assigning Tasks**: @someone, delegating a task
- **Chat Communication**: Communicate anytime during task execution
- **Task Tracking**: See the progress and status of tasks

Different Agents are like different colleagues — A2A enables them to collaborate on complex projects.

### 3.6 Typical A2A Use Cases

| Scenario | Description | Example |
|----------|-------------|---------|
| **Software Development** | Multi-Agent collaboration on development tasks | Requirements → Code → Testing → Deployment |
| **Enterprise Workflows** | Agents from different departments collaborating | HR Agent + Finance Agent + Legal Agent |
| **Intelligent Customer Service** | Multiple specialized Agents dividing work | Reception → Answers → Transfer → Records |
| **Data Analysis** | Multiple Agents collaborating on data analysis | Collection → Cleaning → Analysis → Visualization → Reporting |

**Real-World Examples**:
- **Google Agent Space**: Multiple Agents within an enterprise collaborating on documents, emails, and schedules
- **Software Dev Team**: Requirements Agent → Code Agent → Testing Agent → Deployment Agent
- **Intelligent Customer Service**: Reception Agent → Specialist Agent → Human Transfer Agent

---

## 4. MCP vs A2A: Comparison and Relationship

### 4.1 Core Differences

| Dimension | MCP | A2A |
|-----------|-----|-----|
| **Proposed By** | Anthropic (2024.11) | Google (2025.04) |
| **Positioning** | AI-to-tool connection | Agent-to-Agent collaboration |
| **Communication Scope** | Client-Server | Peer-to-Peer |
| **Data Format** | JSON-RPC 2.0 | HTTP + JSON |
| **Analogy** | USB-C connector | WeChat Work |

### 4.2 Relationship Between the Two

MCP and A2A are **not competitors, but complements**:

<ProtocolComparisonDemo />

### 4.3 Approach to choosing

| Scenario | Choice |
|----------|--------|
| Let AI call local functions or tools | Function Call |
| Use third-party tools (databases, APIs, file systems) | MCP |
| Build a multi-Agent collaboration system | A2A |
| Need both tool integration and multi-Agent collaboration | MCP + A2A |

---

## 5. Future Trends for Protocols

### 5.1 Ecosystem Development

**MCP Ecosystem** (as of early 2025):
- Official servers provided: File System, SQLite, Git, PostgreSQL, etc.
- Community-contributed servers: Slack, Notion, Figma, Stripe, etc.
- Applications supporting MCP: Claude Desktop, Cursor, Windsurf, Zed, etc.

**A2A Ecosystem** (newly released):
- Google's own Agent products are the first to support it
- The open-source community is developing SDKs in various languages
- Enterprise applications are under exploration

### 5.2 The Standardization Process

Agent protocols are currently in a "Warring States" period:
- MCP and A2A are the two most mainstream
- There are other emerging protocols like ANP, AGP, etc.
- They may converge or unify in the future

An analogy to the development of the internet:
- Early days: various LAN protocols coexisted
- Later: TCP/IP became the standard
- Now: Agent protocols may also move toward unification

---

## 6. Summary

::: tip Key Takeaways
| Protocol | One-Line Takeaway | Release Date | Proposed By | Use Case |
|----------|-------------------|--------------|-------------|----------|
| **MCP** | The "USB-C" for AI connecting to tools | 2024.11 | Anthropic | Tool integration, data source connection |
| **A2A** | The "WeChat Work" for Agent collaboration | 2025.04 | Google | Multi-Agent collaboration, task delegation |

**Key Insights**:
1. MCP solves the problem of "how AI acquires external capabilities"
2. A2A solves the problem of "how multiple AIs collaborate"
3. The two are complementary and may be used together in the future
4. Choose the protocol based on the specific scenario — there is no silver bullet
:::

---

## References

1. **MCP Official Documentation**: [modelcontextprotocol.io](https://modelcontextprotocol.io)
2. **MCP GitHub**: [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)
3. **Anthropic Announcement Blog**: "Introducing the Model Context Protocol" (2024-11-25)
4. **A2A Official Documentation**: [google.github.io/A2A](https://google.github.io/A2A)
5. **A2A GitHub**: [github.com/google/A2A](https://github.com/google/A2A)
6. **Google Cloud Blog**: "Announcing the Agent-to-Agent Protocol" (2025-04-09)