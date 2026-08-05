# An Introduction to Context Engineering
> 💡 **Study Guide**: Prompt engineering solves "how to say things clearly"; context engineering solves "how to let the model see the right information at the right time." This chapter revolves around one question: **Within a limited context window, how do you make the model understand you without burning through your budget?**

Before diving in, here are two "foundation bricks" to review:

- **What is a Token**: See the "Tokenization & Tokens" section in [Introduction to Large Language Models](./llm-principles.md).
- **What is a Prompt**: If you're unfamiliar with the basic structure of System / User / Assistant messages, start with [Prompt Engineering](./prompt-engineering/).

---

## 0. Introduction: Motivation for Forgeting Mid-Conversation — and Why Does It Keep Getting More Expensive

<AgentContextFlow />

Many people encounter similar situations when using large language models:

- Mid-conversation, the model suddenly "forgets" key conditions mentioned earlier;
- In long conversations, responses contradict each other, making it hard to maintain a consistent setup;
- As conversation turns pile up, the bill climbs like a taxi meter.

Intuitively, we tend to think: **"This model has a bad memory."**
But most of the time, the problem isn't that the model "can't remember" — it's that we **haven't designed the context it can see properly.**

<IntroProblemReasonSolution />

Faced with these challenges, relying solely on "writing better prompts" falls short. We need a more systematic engineering approach to ensure the model always receives the most critical information — within a limited window and budget. This is exactly what **context engineering** aims to solve.

---

## 1. Overview of "Context Engineering" (Definition + Scenarios)

Let's start with a concise working definition, then look at a few typical scenarios.

> Context engineering is an engineering discipline for building and managing the "information environment" for LLMs. It determines what the model "sees, ignores, and when it sees it," enabling stable task completion within a finite context window.

Simply put, it boils down to three things: organizing information, controlling the window, and managing costs.
Common use cases include:

- Conversational agents and customer service bots
- Code / documentation assistants
- Multi-turn tool calling and long-flow orchestration

Next, we'll start with the "hard-won lessons" of a real team to see how they gradually evolved from "only knowing how to write prompts" to "mastering context engineering."

---

## 2. Starting with "Hard-Won Lessons": Pitfalls the Manus Team Encountered

The case studies in this chapter come from **Manus** (a general-purpose AI Agent).
Unlike ordinary conversations, Manus needs to autonomously plan and invoke tools to complete long tasks (involving dozens or even hundreds of interaction rounds).

This creates a core contradiction:
- **If you don't remember**: critical information is lost, and the task breaks down.
- **If you remember everything**: costs and latency explode, potentially exceeding window limits.

After multiple architectural refactors, the Manus team realized one truth: **Context can't just be "written" — it must be "designed."**

### 2.1 What Did Four Refactors Teach Us

Manus co-founder Ji Yichao shared their "pitfall history":

| Iteration | Problem Encountered | Thinking at the Time | Result |
| :--- | :--- | :--- | :--- |
| **1st** | AI kept forgetting mid-conversation | "Just write more prompts" | Longer prompts, higher costs |
| **2nd** | Important info kept getting squeezed out | "Copy the important stuff multiple times" | Even longer text, even higher costs |
| **3rd** | The bill was shockingly high | "Can we reuse previous computations?" | Found ways to reduce repeated computation costs |
| **4th** | Long documents couldn't be processed | "Can we look things up only when needed?" | Built a "library + on-demand retrieval" solution |

**Core insight**: **It's not about remembering more, but remembering more cleverly.**

### 2.2 Overview of AI's "Memory" Really Like

**Traditional computer memory** = **Hard drive**:
- Large capacity: can store large amounts of data long-term;
- Low cost: storing for a year is relatively cheap;
- Read/write speeds are relatively slow; finding information takes time.

**AI context** = **Small whiteboard**:
- Fast read/write: the model can directly see the entire context in a single call;
- Limited space: once full, old content must be erased;
- Every token written incurs additional computation and cost.

**Manus's lesson**: **Use the whiteboard sparingly and cleverly — don't use it to store an encyclopedia.**

---

## 3. Step 1: Know the Cost — Placement of Every Penny Go

### 3.1 Motivation for starting with Cost

Let's look at how your money is spent during a typical AI conversation:

```
💰 Cost Breakdown (per conversation):
├─ 70% re-reading old content ("What did we just talk about?")
├─ 20% processing new content ("What are you saying now?")
└─ 10% generating a reply ("How should I respond?")
```

**Surprising finding**: **70% of the money is spent having the AI re-read what you've already said!**

### 3.2 Overview of KV Cache (Prefix Reuse)

Before discussing pricing, we need to understand a core technical concept: **KV Cache (Key-Value Cache)**.
Don't be intimidated by the jargon — it's essentially the AI's "short-term memory cheat sheet."

- **Without KV Cache**: The AI has to start reading, understanding, and computing from the first character every time, as if seeing the text for the very first time.
- **With KV Cache**: The AI stores the computation results of parts it has already processed (Pre-fill). Next time, if the opening content hasn't changed, it directly retrieves the memoized result, skipping recomputation.

It's like:
> You walk into an exam room.
> **Scenario A**: Every time, you have to read the entire textbook from cover to cover before starting to answer questions. (Slow, exhausting, expensive)
> **Scenario B**: You've already memorized the textbook content (Cache), so you sit down and start answering immediately. (Fast, effortless, cheap)

In cloud providers' billing tables, **"memorized material" (Cache Hit)** is typically over 90% cheaper than **"new material" (Cache Miss)**.

### 3.3 The Price Gap Between "Memorization" and "Lookup on Demand"

Using Claude as an example:
- **Lookup on demand** (no cache): $3.00 / million tokens
- **From memory** (with cache): $0.30 / million tokens
- **A 10x difference**!

**Manus's practice**: By having the AI "memorize the textbook," they reduced costs from **$0.15 to $0.02** — **saving 87%**!

<ContextWindowVisualizer />

### 3.4 Pitfall Guide: Don't Let Timestamps Destroy Your "Cache"

Many developers habitually put the "current time" as the first line of the System Prompt, thinking it's rigorous.
**But this is one of the biggest anti-patterns in context engineering.**

Imagine this: you've memorized an entire history book (System Prompt), only to have the first line read "the current second."
If that line changes every second, then everything you memorized a second ago becomes invalid — you have to re-memorize it from scratch.

This is the Achilles' heel of **prefix reuse (KV Cache)**: **If the beginning changes, everything after it must be recomputed.**

#### Wrong approach: putting dynamic information first
```text
System: The current time is 2024-01-01 12:00:01. You are an assistant...
(One minute later)
System: The current time is 2024-01-01 12:01:01. You are an assistant...
```
**Consequence**: Although only a few characters changed, because they're at the very beginning, 99% of the subsequent fixed content can't benefit from cache reuse. Every request is as slow and expensive as the first one.

#### Correct approach: separate static from dynamic
```text
System: You are an assistant... (thousands of characters of fixed rules and knowledge base go here)
User: (Pass in the current time via a tool call or user message)
```
**Benefit**: The thousands of characters of rules never change; the AI only needs to "memorize" them once. Subsequent requests directly use cached memory, making them blazing fast.

👇 **Try it yourself**:
Toggle the switch below to enable **"memorization acceleration,"** then click "Send New Request" multiple times.
Observe: when the first block becomes "memorized," what happens to the **Time to First Token (TTFT)**?

<KVCacheDemo />

---

## 4. Step 2: Sliding Window — When "Memory" Becomes "Cost"

As conversations grow longer, the first problem you hit is: **What happens when the window is full?**

### 4.1 Motivation for the "First In, First Out" Break

The simplest memory management is the **Sliding Window**: **new stuff comes in, old stuff goes out.**
It sounds fair, but in real tasks, it's a disaster.

**Scenario replay**:
```text
Conversation log:
[1] User: I'm Zhang San, responsible for the payments system
[2] User: The project uses Go
[3] User: The database is PostgreSQL
...
[20] User: Write an API endpoint for me
```
**Result**: By the time you reach message 20, message 1 ("I'm Zhang San") has already been pushed out of the window. The AI has completely forgotten who you are or what system you're responsible for.

**The core problem**: This strategy treats **critical information** (identity, tech stack) and **filler** ("ok", "got it") as equals — kicking them all out together.

### 4.2 "Middle Amnesia" — Motivation for AIing Always Miss Key Information

Besides "forgetting fast," AI has another quirk: **it also "overlooks" things.**
Research shows: **AI is most sensitive to the beginning and end, and most likely to ignore the middle.** This is the famous **Lost in the Middle** phenomenon.

**U-shaped memory curve**:
```text
Position: Start → Middle → End
Memory:   High  →  Low   → High
```

👇 **Try it yourself**:
1. First, try **"Sliding Window"**: send several messages in the chat box below and see how old conversations are mercilessly "pushed out."
2. Then check **"Lost in the Middle"**: observe — when key information is buried in the middle of a long passage, is the retrieval success rate at its lowest?

<SlidingWindowDemo />
<LostInMiddleDemo />

**Solution**: Place critical information at the **beginning** (system prompt) or the **end** (user query).

---

## 5. Step 3: Selective Retention — Approach to "Pin" Key Information

If "first in, first out" doesn't work, what should we do?
Manus's answer: **Establish an "information hierarchy."**

### 5.1 Motivation for Ranking Information by Importance

Stop treating every piece of information equally — decide what stays and what goes based on importance:

| Tier | Information Type | Treatment | Cost Impact |
| :--- | :--- | :--- | :--- |
| **VIP** | System setup, user identity | **Keep forever** | +15% cost |
| **Important** | Current task objective | **Keep for task duration** | +10% cost |
| **Normal** | Regular conversation history | **Keep last 5 turns** | Baseline cost |
| **Disposable** | Retrievable knowledge | **Look up when needed** | -60% cost |

**Core idea**: **Spend 25% more to retain 90% of critical information.**

### 5.2 The "Pinning" Strategy

Think of the context window as a whiteboard:
- **VIP information**: **Nailed down** at the very top of the whiteboard (System Prompt).
- **Important information**: **Magneted** to the middle of the whiteboard (Context Injection).
- **Regular conversation**: Written on the lower part of the whiteboard; when space runs out, erase the oldest (Sliding Window).

👇 **Try it yourself**:
In the demo below, try "pinning" an important conversation message.
Observe: as you keep chatting, does the pinned information stay in place while unpinned messages get pushed out?

<SelectiveContextDemo />

---

## 6. Step 4: RAG — When "Memory" Needs a "Library"

Sometimes there's simply too much information to process (like hundreds of pages of technical documentation), and the whiteboard can't hold it all. That's when you need an external brain — **RAG (Retrieval-Augmented Generation)**.

### 6.1 Why the "Small Whiteboard" Isn't Enough

When Manus faced millions of words of technical documentation, they compared two approaches:

1.  **Full ingestion**: Stuff everything into the context at once.
    *   **Consequence**: The whiteboard is instantly full, processing is painfully slow, and according to the "Lost in the Middle" theory, the AI can't even remember the middle content.
    *   **Cost**: ~$50 per request, 15-second wait.
2.  **On-demand retrieval (RAG)**: First search the library (database), then copy only the relevant passages onto the whiteboard.
    *   **Consequence**: The whiteboard stays clean; the AI focuses on critical information.
    *   **Cost**: ~$0.50 per request, 2-second wait.

**99% cost savings and 87% time savings!**

### 6.2 Best Practices for "Looking Things Up"

Manus's experience distilled:
*   **How big should each "page" be?** 500-1000 characters works best.
*   **How many "books" to check at once?** 3-5 — more becomes distracting.
*   **How relevant before retrieving?** Similarity > 0.7, to avoid forcing irrelevant content.

👇 **Try it yourself**:
Enter a question in the search box (e.g., "how to reset password") and see how the system pulls only the most relevant snippets from a mountain of documents.

<RAGSimulationDemo />

---

## 7. Step 5: Compression — Approach to writing More Densely on the "Whiteboard"

What if all the information is important, nothing can be deleted, and you don't want to look things up?
Then you have no choice but to **write smaller** — this is **context compression**.

### 7.1 Criteria for Need "Shorthand"
*   Retrieved material is too thick (>2000 characters).
*   Conversation history is too verbose (occupying >80% of whiteboard space).
*   You need a fast answer and don't want the AI wading through walls of text.

### 7.2 Three Levels of "Shorthand"

| Compression Method | Compression Ratio | What's Preserved | Use Case | Cost Savings |
| :--- | :--- | :--- | :--- | :--- |
| **Summarization** | 70% | Main ideas | Quick overview | Save 30% |
| **Key Points** | 50% | Critical points | Structured output | Save 50% |
| **Tabular** | 30% | Core data | Programmatic processing | Save 70% |

👇 **Try it yourself**:
Choose different compression strategies and see how walls of text become shorter and more refined.

<ContextCompressionDemo />

---

## 8. System Integration: Building the AI's "Memory Palace"

So far, we've learned various independent strategies like building blocks:
*   **KV Cache**: Helps us save money (Chapter 3)
*   **Sliding Window**: Helps us free up space (Chapter 4)
*   **Tiered Retention**: Helps us keep the important stuff (Chapter 5)
*   **RAG**: Gives us external brainpower (Chapter 6)

Now it's time to assemble these blocks into a complete castle — what we call Manus's **"Memory Palace."**

### 8.1 Assemble Context Like Building a House

Don't think of context as a messy pile of text; think of it as a layered building. Each floor has its unique function and "rules of residence."

👇 **Try it yourself**:
Click "Start Building" and see how we construct this palace floor by floor.

<MemoryPalaceDemo />

### 8.2 Motivation for This Design So Powerful

The design philosophy of this palace aims to resolve three contradictions:

1.  **Foundation (System Prompt) — Solves the "expensive" problem**
    *   **Contradiction**: System setup (who you are, what the rules are) is the longest part, and has to be sent every time.
    *   **Solution**: Place it at the bottom layer. Using **KV Cache** technology, as long as it doesn't change, the AI can "recite it from memory." For hundreds of subsequent conversation rounds, the computation cost for this part is nearly **$0**.

2.  **Pillars (Task Context) — Solves the "forgetting" problem**
    *   **Contradiction**: As conversations grow long, the AI easily forgets the original task objective (e.g., "write a Snake game").
    *   **Solution**: Use the **tiered retention** strategy to "pin" the task objective on the second layer. No matter how many rounds of conversation, this layer is never deleted, ensuring the AI never loses sight of the original goal.

3.  **Top Floor (Chat & RAG) — Solves the "chaos" problem**
    *   **Contradiction**: There's new conversation and retrieved reference material — mixing them together creates confusion.
    *   **Solution**:
        *   **Living Room (Chat)**: Managed with a **sliding window**, keeping only the most recent 5-10 hot messages.
        *   **Library (RAG)**: Reference material comes and goes, never taking up permanent space.

### 8.3 Real-World Results

After the Manus team deployed this architecture, the results were immediate:

*   **Cost savings**: Because the foundation is "memorized," per-round conversation cost plummeted **84%**.
*   **Speed gains**: The AI no longer reads thousands of characters from scratch every time; average response time dropped from 8 seconds to **2 seconds**.
*   **Accuracy improvement**: Critical information is "nailed down" — the AI never forgets what it's supposed to be doing mid-conversation.

---

## 9. Hands-On Templates: Copy the Homework Directly

To help you intuitively understand how this mechanism works, we've prepared a **full-chain simulation**.

Choose a scenario and click "Next" to see how the **Memory Palace** dynamically retrieves, assembles, and cleans up context in the few seconds between a user query and the AI's response.

<MemoryPalaceActionDemo />

### 📝 Ready-to-Use Practical Designs

If you're designing a system like Manus, don't just focus on how to write prompts — pay more attention to **how the system architecture orchestrates context.**

Below are **system design blueprints** for two classic scenarios, including both **prompt design** and **code logic (pseudocode)**.

#### Scenario 1: Full-Stack Engineer Agent (Long-Term Memory Type)
> **Core challenge**: Long task cycles make it easy to forget the original requirements and project context.
> **Strategy**: System layer (identity) + Task layer (pinned objectives) + Chat layer (sliding window).

**1. System Prompt (Layer 1 & 2)**
```markdown
# Layer 1: Identity Setup (System Prompt) - Never changes, leverages KV Cache
You are a senior full-stack engineer, proficient in Python and Vue3.
Coding style:
- Variable naming strictly follows PEP8
- Critical logic must include comments
- Prioritize existing project utility functions

# Layer 2: Task Pinning (Task Context) - Must not be deleted during the task
Current task: Refactor payment module (payment_module)
Core constraints:
1. Must maintain compatibility with legacy API v1.0
2. Database migration scripts must be idempotent
3. Deadline: This Friday
```

**2. Context Assembly Logic (Pseudocode)**
```python
def build_engineer_context(user_input, chat_history, task_info):
    context = []

    # 1. Foundation layer: Identity setup (leverages KV Cache)
    # This part doesn't change for hundreds of rounds; computation cost is near $0
    context.append(SYSTEM_PROMPT)

    # 2. Pillar layer: Task pinning (Pinned)
    # No matter how long the conversation, this is always inserted after System
    context.append(f"Current task: {task_info}")

    # 3. Retrieval layer: Code snippets (RAG)
    # Search the codebase for relevant code based on the user's question
    relevant_code = search_codebase(user_input)
    if relevant_code:
        context.append(f"Reference code:\n{relevant_code}")

    # 4. Interaction layer: Conversation history (Sliding Window)
    # Only take the last 10 turns to avoid blowing up the context
    recent_chat = chat_history[-10:]
    context.extend(recent_chat)

    # 5. Latest input
    context.append(user_input)

    return context
```

#### Scenario 2: Intelligent Customer Service Agent (Precision Q&A Type)
> **Core challenge**: Cost-sensitive, and absolutely cannot fabricate answers.
> **Strategy**: System layer (strong constraints) + RAG layer (dynamic injection).

**1. System Prompt (Layer 1)**
```markdown
# Layer 1: Identity Setup (System Prompt)
You are a professional e-commerce customer service representative.
Response principles:
1. A warm, professional, and concise tone
2. **Absolutely prohibited** from fabricating facts; only answer based on [Reference Materials]
3. If the materials don't contain an answer, respond directly with "I'm very sorry, I'll need to transfer you to a human agent for this question"
```

**2. Context Assembly Logic (Pseudocode)**
```python
def build_support_context(user_input):
    context = []

    # 1. Foundation layer: Identity setup
    context.append(SYSTEM_PROMPT)

    # 2. Library layer: Dynamic retrieval (RAG)
    # Only in customer service scenarios does RAG take center stage, placed in the middle
    docs = vector_db.search(user_input, top_k=3)

    context.append("【Reference Materials Start】")
    for doc in docs:
        context.append(doc.content)
    context.append("【Reference Materials End】")

    # 3. Interaction layer: Very short history
    # Customer service typically doesn't need long memory; keep the last 3 turns
    context.extend(get_recent_chat(limit=3))

    context.append(user_input)

    return context
```

---

## 10. Glossary

| English Term | Chinese Translation | Explanation |
| :--- | :--- | :--- |
| **Context Window** | 上下文窗口 | The maximum text length a model can process in a single pass (including input and output). Content exceeding this limit is truncated or forgotten. |
| **Token** | 词元 | The smallest unit of text processed by an LLM. Roughly 1 token ≈ 0.75 English words or 0.5 Chinese characters. Both billing and window limits use tokens as the unit. |
| **KV Cache** | KV 缓存 | An inference acceleration technique that caches already-computed attention key-value pairs, avoiding redundant computation on repeated prefixes and significantly reducing latency and cost. |
| **RAG** | 检索增强生成 | Before answering a question, relevant information is retrieved from an external knowledge base and provided as context to the model, reducing hallucination and expanding knowledge boundaries. |
| **Sliding Window** | 滑动窗口 | The most basic context management strategy. Keeps the token count within the window constant; when new content enters, the earliest old content is automatically removed. |
| **Lost in Middle** | 中间迷失 | A limitation of large models. Research shows models remember information at the beginning and end of long contexts best, while easily overlooking information in the middle. |
| **System Prompt** | 系统提示 | Instructions placed at the very beginning of a conversation, used to set the model's identity, behavioral norms, response style, and core tasks. |
| **Few-shot** | 少样本学习 | Providing several "question-answer" examples in the prompt to help the model quickly understand the task pattern and output format. |
| **Chain of Thought** | 思维链 | Guiding the model to output reasoning steps before giving a final answer. This approach significantly improves the model's ability to solve complex logical and mathematical problems. |
| **Hallucination** | 幻觉 | The phenomenon where a model confidently generates information that appears plausible but is actually incorrect or non-existent. |
| **Embedding** | 向量化 | The technique of converting text into high-dimensional numerical vectors. Semantically similar texts are closer in vector space, forming the foundation of semantic search. |
| **Vector DB** | 向量数据库 | A database specifically designed for storing and retrieving vector data. Supports similarity search to quickly find the document fragments that best match a query. |
| **Temperature** | 温度 | A hyperparameter controlling the randomness of model output. Higher values (e.g., 0.8) produce more diverse, creative outputs; lower values (e.g., 0.2) produce more deterministic, precise outputs. |
| **TTFT** | 首字延迟 | Time to First Token — the time elapsed from when a user sends a request to when the model outputs its first token. A key metric for measuring interactive experience. |

---

## Summary: The Essence of Context Engineering

Manus's four refactors taught us:

**From a practical standpoint**: It's not about remembering more, but about remembering with more structure and selectivity.

**From a cost perspective**:
- Most waste comes from redundant computation of fixed prefixes, which must be addressed through prefix stability and caching mechanisms;
- Important information being erroneously discarded often stems from a "one-size-fits-all" sliding window, which must be addressed through information tiering and pinning strategies;
- When facing extremely long documents and knowledge bases, relying solely on expanding the context window is unrealistic — retrieval and compression mechanisms must be combined.

The goal: within a given model and context limit, ensure every token invested serves a clear purpose.