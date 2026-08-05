# Principles of Large Language Model Operation
> 💡 **Learning Guide**: This chapter requires no programming background. Through interactive demonstrations, it takes you deep into the inner workings of Large Language Models (LLMs). We'll start from the most basic concept of tokenization and go all the way to how GPT is trained and performs inference.

<LlmQuickStartDemo />

## 0. Introduction: From Human Language to Machine Computation

Humans communicate through language; computers compute through numbers.
The essence of a **Large Language Model (LLM)** is a bridge connecting these two worlds.

Its core task is singular: **transform the problem of "understanding language" into a problem of "mathematical computation."**

To achieve this goal, we need to solve three core challenges:

1.  **Translation**: How do we turn text into numbers? (Tokenization & Embedding)
2.  **Efficiency**: How do we make computers compute fast? (Matrix operations)
3.  **Memory**: How do we make computers understand context? (The Transformer model)

This tutorial will take you from zero, step by step, through the construction of this bridge.

---

## 1. Step One: Translation (Tokenization)

A computer cannot read the word "hamburger" — it only understands numbers.
So our first task is: **break text into the smallest units a computer can process.**

### 1.1 Overview of Tokenization

Tokenization is the process of splitting a sentence into individual "word units" (Tokens).

- **English**: Words are naturally separated by spaces, making tokenization easy (e.g., `I love AI`).
- **Chinese**: There are no spaces, so algorithms are needed to segment the text (e.g., `我爱人工智能`).

#### Tokenizer

The program that performs tokenization is called a **Tokenizer**.
It acts like an interpreter, responsible for translating human text into sequences of numbers that machines can read.

Modern LLMs (such as GPT-4) typically use **Subword Tokenization** techniques (like the BPE algorithm).
The clever part: **common words stay intact, rare words get split.**

Here is a real BPE tokenization example (based on the GPT-4 Tokenizer):

**Input**: `"The quick brown fox jumps over the lazy dog. \n今天天气真不错！"`

**Token List**:

```text
index=791,   string='The'
index=4062,  string=' quick'
index=14198, string=' brown'
index=39935, string=' fox'
index=83368, string=' jumps'   <-- if split, might be ' jump' + 's'
index=927,   string=' over'
index=279,   string=' the'
index=16053, string=' lazy'
index=3290,  string=' dog'
index=13,    string='.'
index=198,   string='\n'       <-- newline character
index=33838, string='今天'      <-- common word merged directly
index=54580, string='天气'
index=20265, string='真'
index=57672, string='不错'
index=171,   string='！'
```

> **On handling rare characters**:
> If a character not present in the vocabulary is encountered (suppose "今" were very rare), the model falls back to **Byte-level** encoding.
> 1.  Raw Input: `今`
> 2.  Bytes: `\xE4 \xBB \x8A`
> 3.  BPE Lookup: first look for `\xE4\xBB\x8A` -> not found -> split into `\xE4\xBB` (ID=1001) + `\x8A` (ID=2002).
> 4.  Final Tokens: `[1001, 2002]`.
>
> This mechanism guarantees that **no matter what characters are input, the model can process them — there is never an OOV (Out Of Vocabulary) problem**.

<TokenizationDemo />

**Key point**: LLMs process not words, but **Token IDs** (a sequence of numeric indices).

---

## 2. The Core Challenge: Approach to making Computers "Compute" Language

Our task is to process language. But computers only understand numbers.
The most direct idea: assign each word an ID number.

- apple -> ID 10
- banana -> ID 20

### 2.1 Motivation for Noting Just Use Simple IDs

If we only use IDs, the computer would think "10" and "20" are just two unrelated numbers.
Moreover, if the vocabulary has 100,000 words, we might need an array of length 100,000 to represent a single word (One-Hot encoding), where 99,999 positions are 0 and only one position is 1.

- **Drawback 1: Too wasteful** (sparse — One-Hot arrays are too large).
- **Drawback 2: No semantics** (cannot represent that "apple" and "banana" are both fruits).

### 2.2 The Solution: Embedding (Dense Vectors)

To represent a word **efficiently** and **meaningfully**, we invented **Embedding**.
Instead of using a long 0/1 array, it uses a shorter array filled with decimals (e.g., 512 numbers) to describe a word.

- For example: `[0.8 (is fruit), 0.1 (red), 0.9 (sweet)...]`
  This way, we not only compress the data but also turn word meanings into computable "coordinates."

<EmbeddingDemo />

---

## 3. From Words to Matrices

Having solved the problem of representing "a single word," we now need to solve the problem of representing "a sentence."

### 3.1 Motivation for Matricesing

Because a sentence contains many words.

- One word = one row of numbers (a vector).
- One sentence = many rows of numbers stacked together.
  This is a **matrix**.

The reason we assemble them into matrices is that the core hardware of modern computers — **GPUs (Graphics Cards)** — are inherently designed for matrix operations.
Only by turning language into matrices can we leverage the parallel processing power of GPUs to achieve **efficient** inference and training.

### 3.2 The Complete Pipeline

Let's review how data flows:

1.  **Tokenization**: Chop the text into pieces.
2.  **Indexing**: Convert pieces into IDs.
3.  **Embedding**: Convert IDs into vectors (for semantics and compression).
4.  **Stacking**: Assemble vectors into matrices (for efficient GPU computation).

<TokenizerToMatrix />

---

## 3.5 Interlude: What Exactly Overview of a "Model"

Before diving into specific architectures, let's understand the term "model" in plain terms.

In the AI field, a **Model** is essentially a super complex **function** or **black box**.

- **Input**: A bunch of numbers (like the Token IDs above).
- **Processing**: Inside the black box are billions of parameters (think of them as billions of adjustable knobs) that perform frenzied addition, subtraction, multiplication, and division on the input data.
- **Output**: Another bunch of numbers (representing predictions, such as the probability of the next word).

**An analogy:**

You can think of a model as an **experienced master chef**:

1.  **Input (ingredients)**: You give them beef, potatoes, and tomatoes.
2.  **Model (the chef's brain)**: Based on the thousands of recipes they've learned (training data), they rapidly compute in their head: dice the beef, peel the potatoes, control the heat...
3.  **Output (the dish)**: They serve up a plate of braised beef brisket with potatoes.

What we call **Training** is the process of having this chef start as an apprentice, making mistakes billions of times. If it's too salty, tweak the "salt knob"; if too bland, tweak the "heat knob" — until they can consistently produce delicious dishes.

Today's LLMs are "super chefs" who have "read every book in human history" — except what they cook isn't food, but text.

## 4. The Evolutionary Path: From RNN to Transformer

With data (Tokens) and a chef (Model) in hand, let's look at how this chef thinks.

In AI's evolutionary history, there have been two main "ways of thinking" (architectures): **RNN** and **Transformer**.

### 4.1 The Old Clumsy Way: RNN (The Telephone Game)

Early models (RNNs, Recurrent Neural Networks) processed a sentence like playing the **Telephone Game**.

**How it works:**

1.  Read word 1, "I", memorize it, pass it to step 2.
2.  Read word 2, "love", combine with the previous memory, update the mental note, pass to step 3.
3.  Read word 3, "eating", update memory again...
4.  ...until the last word is read.

**This brings two fatal drawbacks:**

1.  **Slow (no parallelism)**: You must wait for one person to finish passing the message before the next can begin. You can't have 100 people working at the same time.
2.  **Forgetful (long-distance forgetting)**: By the time the message reaches the 100th person, they may have long forgotten whether the first person said "I" or "you." This causes models to lose coherence when writing long passages.

### 4.2 The Modern Genius Design: Transformer (The Roundtable Meeting)

In 2017, Google proposed a completely new architecture — the **Transformer**. It fundamentally changed the rules, turning the "Telephone Game" into a **Roundtable Meeting**.

**How it works:**
The Transformer no longer passes messages one by one; instead, it has **all words sit down at the table at once**.

1.  **Bird's-eye view (Parallel Computation)**: All words enter simultaneously — no queue. Everyone writes their information on paper and lays it out in the middle of the table.
2.  **Attention Mechanism**: This is its killer feature. Every word can **directly** look at any other word's information on the table.
    - For example, when reading the word "it," the model doesn't need to recall earlier messages — it directly spots "the kitten" earlier in the sentence and instantly understands "it = the kitten."

**This perfectly solves RNN's pain points:**

- **Fast**: Everyone reviews materials simultaneously — the GPU can run at full throttle, maximizing efficiency.
- **Never forgets**: No matter how long the sentence, the distance between the 1st word and the 10,000th word is just "one step away" — you can look at whoever you want.

> **In summary**:
>
> - **RNN**: Like navigating a maze, step by step, easy to get lost.
> - **Transformer**: Like viewing a map from a bird's-eye view — both the start and finish are in sight.

#### Why Do We Still Need "Positional" Information?

Because the Transformer processes everything at once, without special handling it can't tell the difference between "I love you" and "You love I" (same words, just in a different order).
So we give each word a **number tag (Positional Encoding)** to tell the model who is in position 1, who is in position 2, and so on.

> A small reminder: many LLMs are autoregressive (predicting the next word), so during generation they still output one token at a time; but in the internal computation of **each generation step**, the Transformer still excels at leveraging matrix parallelism and caching optimizations.

### 4.3 Efficiency Black Magic: KV Cache

You may have heard that when generating long texts, it gets slower toward the end, or VRAM usage grows. This is usually because the model needs to "remember" everything it has generated so far.

**How does the Transformer "take notes"?**

In the Transformer's attention mechanism, every word generates two vectors, `Key (K)` and `Value (V)`, for later words to "query."

- When the model generates the 100th word, it needs to look back at the K and V of the previous 99 words.
- If it had to recompute the K and V for the previous 99 words every time, that would be terribly wasteful!

**The role of KV Cache:**

KV Cache is like an **"incremental notebook."**

1.  **No recomputation**: After computing the K and V for word 1, store them.
2.  **Only compute the new**: When generating word 2, only compute K and V for word 2, then concatenate them with word 1's K and V.
3.  **Growing thicker**: As the conversation continues, this "notebook" (VRAM usage) gets thicker and thicker.

This is why long-context conversations consume so much VRAM — **it's not that the model is getting bigger, but that the notes (KV Cache) are getting too thick.**

<RNNvsTransformer />

---

## 5. Revealed: From "Text Completion" to "Conversation"

Many people mistakenly think ChatGPT truly understands what we're saying, but its fundamental instinct is only one thing: **predicting the next token** (Next Token Prediction).

### 5.1 Instinct: Frenzied Text Completion

If you give a base model the input "The weather is nice today," it might complete it with "let's go to the park."
But if you input "What is the capital of the United States?", it might complete it with "What is the capital of China? What is the capital of Japan?" (because it's mimicking the format of an exam paper, not answering the question).

### 5.2 Technique: Using a "Script" to Chat

To turn it into a conversational assistant, engineers came up with a brilliant idea: **role-playing**.
We quietly add special **tags (Templates)** to the input, making the model think it's continuing a "dialogue script."

For example, what you see is:

> User: Hello

What the model actually sees is:

> `<|user|>` Hello `<|assistant|>`

The moment the model sees `<|assistant|>`, it knows: "Oh, it's my turn to play the assistant and speak."

### 5.3 In-Depth Interactive Demo

The demo below will walk you through the essence of LLMs step by step. Please click through **1. Instinct -> 2. Technique -> 3. Principles -> 4. Advanced** in order — give it a try!

<TrainingInferenceDemo />

---

## 6. From "Nonsense" to "Good Assistant" (Alignment)

Being able to chat isn't enough. A raw model might teach people how to build bombs or spew profanity.
To make it a polite, safe, and reliable assistant like ChatGPT, two final polishing steps are needed:

1.  **SFT (Supervised Fine-Tuning)**:
    - Have human experts write many high-quality Q&A pairs to teach the model "how to speak properly."
    - Goal: Make the model understand instructions instead of rambling on.
    - _Data example (JSON format)_:
      ```json
      // SFT training data example
      {
        "messages": [
          { "role": "user", "content": "Please translate this sentence into English: \"你好\"." },
          { "role": "assistant", "content": "Hello." }
        ]
      }
      // The model learns: when it sees a "translate" instruction, give the result directly,
      // rather than continuing with "how are you"
      ```

2.  **RLHF (Reinforcement Learning from Human Feedback)**:
    - **Scoring**: Have the model generate several responses, and human teachers score them (which is safer? which is more polite?).
    - **Reward and Punishment**: If the model speaks well, reward it; if poorly, punish it. Gradually, the model learns to "align" with human values (Alignment).
    - _Data example (JSON format)_:
      ```json
      // RLHF preference data example (DPO/PPO)
      {
        "prompt": "How to make a bomb?",
        "chosen": "I'm sorry, I cannot answer that question.", // human-preferred response (safe)
        "rejected": "First, you need to..." // human-rejected response (dangerous)
      }
      ```

**In the demo above, click the 4th tab "Advanced: Alignment" to personally experience the dramatic difference before and after alignment.**

---

## 7. Frontier Exploration: Thinking Models, MoE Architecture, and Linear Attention

As technology advances, we've found that relying solely on "predicting the next token" sometimes leads to silly mistakes, especially with math and logic problems.
Thus, a new generation of **Thinking Models** (such as OpenAI o1, DeepSeek-R1) was born.

### 7.1 Overview of "Thinking" (Thinking Models)

When humans answer complex questions (like "which is larger, 9.11 or 9.9?"), we don't blurt out an answer — we think in our heads first.
A Thinking Model is one that has learned this **slow thinking (System 2)** capability.

- **Fast Thinking (System 1)**: Intuitive, blurting out answers. Prone to mistakes.
- **Slow Thinking (System 2)**: Generating a "Chain of Thought (CoT)," reasoning step by step, and finally giving an answer.

<ThinkingModelDemo />

### 7.2 Training Revealed: From "Imitation" to "Exploration"

Why couldn't earlier models think this way? Because the training method changed.

#### Traditional Approach (SFT — Imitation Learning)

- **Method**: Show the model human thought processes and have it **imitate** them.
- **Limitation**: The model's ceiling is the quality of human data. If humans themselves can't figure something out (like extremely hard math problems), the model can't learn it either.

#### Thinking Approach (RL — Reinforcement Learning)

- **Method**: **Don't** provide process data — only provide a final **Verifier**.
  - For example, give a math problem and let the model try on its own blindly.
  - Wrong attempt -> punishment.
  - Right attempt -> reward.
- **The Aha Moment**:
  After tens of thousands of self-attempts, the model surprisingly discovers: **"If I write out a few more derivation steps on scratch paper before outputting the answer, my probability of getting a reward increases dramatically!"**
  Thus, this "think first, then answer" behavioral pattern gets reinforced and solidified. It's like AlphaGo playing against itself and ultimately surpassing human game records.

### 7.3 Practical Guide: A Dramatic Shift in Prompt Style

When using Thinking Models (like DeepSeek-R1, OpenAI o1), your prompting strategy needs a complete overhaul.

| Feature               | Traditional Models (GPT-4o, Claude 3.5)       | Thinking Models (R1, o1)                                  |
| :-------------------- | :-------------------------------------------- | :-------------------------------------------------------- |
| **Core Logic**        | **System 1 (Intuition)**                      | **System 2 (Logic)**                                      |
| **Prompting Tips**    | Need to guide Chain of Thought (CoT)<br>e.g., "Please think step by step..." | **Don't** overdo it<br>The model has built-in CoT; manual guidance actually interferes |
| **Instruction Clarity** | Need to break complex tasks into subtasks    | Give the final goal directly and let the model decompose it |
| **Suitable Scenarios**  | Creative writing, simple translation, chitchat | Complex math, code refactoring, logical reasoning         |

> ⚠️ **Note**: With Thinking Models, the less intervention, the better. You only need to clearly define **"what constitutes a perfect task result,"** not **"how to do it."**

### 7.4 Future Trends: Fast-Slow Fusion

In the future, we may no longer need to distinguish between "thinking models" and "regular models."
The ideal AI should, like humans, possess **Adaptive Compute** capability:

- Encounter "1+1=?": instantly invoke System 1, respond in a flash.
- Encounter "Prove the Riemann Hypothesis": automatically switch to System 2, think for three days and nights before answering.
- **Seamless user experience**: You just ask the question, and the model decides how much "brainpower" to allocate.

### 7.5 Architectural Evolution: From "All-Rounder" to "Panel of Experts" (Dense vs MoE)

As models grow larger (like GPT-4, DeepSeek-V3), if every single token generation required computing every neuron, the speed would become unbearably slow.
Thus, the **MoE (Mixture of Experts)** architecture emerged.

- **Dense Model**:
  - **Analogy**: An **all-around genius**. No matter the question, they engage their entire brain to answer.
  - **Characteristics**: Stable, but as knowledge grows, responses become slower and slower.
  - **Representatives**: GPT-3, Llama-2.

- **MoE (Mixture of Experts)**:
  - **Analogy**: A **panel of experts on an assembly line** (switching personnel for every token processed).
  - **Core Mechanism (Token-Level Routing)**:
    The essence of MoE lies in **native token-level routing**. It is **absolutely not** about dividing work by "task type" (e.g., sending all math problems to the math expert); rather, it divides work in real time by **"the current token being generated."**
    - When the model generates "`def`", route to the **code expert**.
    - When the model generates "`love`", route to the **literature expert**.
    - When the model generates "`3.14`", route to the **math expert**.
    This means that even within the same sentence, different tokens are often handled by different experts.
  - **Characteristics**: Although the total headcount is large (many parameters), only a few people work on each token (few activated parameters). **Both erudite and fast.**
  - **Representatives**: GPT-4, DeepSeek-V3, Mixtral.

<MoEDemo />

### 7.6 The Efficiency Revolution: Breaking the Length Limit (Linear Attention)

Beyond MoE, there's another core pain point: **context length**.
Traditional Transformers (like GPT-4) use **standard attention mechanisms**, whose computational cost explodes **quadratically** as token count increases.

- Processing 10K tokens: 100 million operations.
- Processing 100K tokens: 10 billion operations!

To solve this, models like MiniMax (abab series) and RWKV adopted **Linear Attention**.

### Motivation for the "Web-like" and the Other "Linear"

The fundamental difference is: **do you choose to "keep all original words," or do you choose to "summarize as you go"?**

- **Standard Attention (Web-like) — Why must it look back?**
  - **Core reason**: To **"find relevance."**
  - **Example**: Take the sentence "I gave **the apple** to **it**...". When you read the word "**it**," to figure out what "it" refers to, the model must scan back through all preceding words (I, gave, the, apple, to).
  - **Process**: "it" sends out a query signal (Query) to match against the labels (Keys) of all preceding words.
    - Match with "I"? Score 0.
    - Match with "apple"? **Score 100!**
  - **Cost**: Because the model doesn't know which word matters, it **must check every preceding word — not a single one can be missed**. This is why the lines weave into a web.

- **Linear Attention (Linear) — Why can it avoid looking back?**
  - **Principle**: The model learns to "take notes." After reading "apple," it compresses the information "there is an apple" into a **State**; when it reads "it," it directly consults the state in hand and knows "it = the apple."
  - **Cost**: Although fast, some details may be lost during the "compression" process (e.g., forgetting that the apple was red).

<LinearAttentionDemo />

### 7.7 Architecture Showdown: RNN vs Transformer vs RWKV

| Architecture | Core Mechanism | Complexity (Length N) | Parallel Training | Inference Speed | Forgetting Problem | Representative Models |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RNN** | Sequential recurrence | $O(N)$ (Low) | ❌ No | Slow (sequential) | Severe (long-distance forgetting) | LSTM, GRU |
| **Transformer** | Global attention | $O(N^2)$ (Very High) | ✅ Yes | Medium (KV Cache) | None (but window-limited) | GPT-4, Llama |
| **RWKV / Linear** | Linear attention | $O(N)$ (Low) | ✅ Yes | Fast (constant VRAM) | Mild (compression loss) | RWKV, MiniMax |

> **RWKV / Linear Attention** attempts to combine the strengths of both: parallel training like Transformer, efficient inference like RNN.

---

## 8. Summary and Learning Roadmap

You've now connected the dots from "tokenization" all the way to "ChatGPT":

1.  **Tokenization**: Text is split into Tokens.
2.  **Embedding**: Tokens are mapped to semantic vectors.
3.  **Transformer**: Uses the attention mechanism to process sequences and extract features in parallel.
4.  **Training**: Data is formatted using Templates, and parallel training is done via Teacher Forcing.
5.  **Inference**: Tokens are generated autoregressively, one by one.

**Next steps**:

- If you're interested in the math, dive deeper into **Linear Algebra** (matrix operations) and **Probability Theory**.
- If you want hands-on practice, try loading a small model (like GPT-2) using Python's `transformers` library.

---

## 9. Glossary

| Term               | Full Name                                  | Explanation                                                                                                                  |
| :----------------- | :----------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **LLM**            | Large Language Model                       | A large language model. An AI model trained on massive amounts of text, capable of understanding and generating human language. |
| **Token**          | -                                          | **Tokenization**. The smallest unit into which text is split (such as a word, character, or subword fragment). Models read and write Token IDs. |
| **Embedding**      | -                                          | **Word vector**. A numerical vector that maps a Token into a high-dimensional space (e.g., 4096 dimensions), capturing semantic relationships between words. |
| **Transformer**    | -                                          | The core architecture of modern LLMs. Based on the attention mechanism, capable of processing long texts in parallel.            |
| **Attention**      | Attention Mechanism                        | **Attention mechanism**. Allows the model to dynamically focus on other relevant words in context when processing a given word. |
| **Context Window** | -                                          | **Context window**. The maximum number of Tokens a model can "remember" in a single inference pass (e.g., 128k).                |
| **Pre-training**   | -                                          | **Pre-training**. Training a model on massive amounts of unlabeled text so it learns the fundamental patterns of language and world knowledge. |
| **SFT**            | Supervised Fine-Tuning                     | **Supervised fine-tuning**. Using high-quality Q&A pair data to teach the model to follow human instructions.                   |
| **RLHF**           | Reinforcement Learning from Human Feedback | **Reinforcement learning from human feedback**. Using human scoring to further adjust model behavior, aligning it with human values (Alignment). |
| **CoT**            | Chain of Thought                           | **Chain of thought**. A technique that guides the model to generate reasoning steps before producing the final answer.          |
| **MoE**            | Mixture of Experts                         | **Mixture of experts**. A model composed of multiple "expert" sub-models, where the appropriate experts are selectively activated based on the problem — more efficient. |
| **Temperature**    | -                                          | **Temperature**. A parameter controlling the randomness of model generation. Higher temperature → more creative but less controllable; lower temperature → more deterministic. |