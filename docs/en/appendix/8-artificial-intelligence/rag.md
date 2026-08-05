# Principles of RAG: Retrieval-Augmented Generation

::: tip Preface
**Why does ChatGPT sometimes "make things up with confidence"?** Large language models derive their knowledge from training data, but training data has a cutoff date and doesn't include your company's internal documents. RAG (Retrieval-Augmented Generation) is the core technology that solves this problem — letting AI "look up references" before answering.
:::

**What will you learn from this article?**

After completing this chapter, you will gain:

- **Core concept understanding**: Know what RAG is, why it's needed, and how it solves the "hallucination" problem of large models
- **Complete workflow understanding**: Master the end-to-end process from document loading, chunking, vectorization to retrieval and generation
- **Technology selection ability**: Understand the pros and cons of different chunking strategies and retrieval methods, and make choices based on scenarios
- **Architecture evolution perspective**: Understand RAG's evolution from Naive to Advanced to Modular
- **Practical decision-making ability**: Know when to use RAG and when to use fine-tuning

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | RAG Basic Workflow | Indexing, Retrieval, Generation stages |
| **Chapter 2** | Text Chunking Strategies | Fixed chunking, semantic chunking, recursive chunking |
| **Chapter 3** | Retrieval Techniques | Vector retrieval, keyword retrieval, hybrid retrieval |
| **Chapter 4** | Architecture Evolution | Naive RAG → Advanced RAG → Modular RAG |
| **Chapter 5** | RAG vs Fine-tuning | Comparison of applicable scenarios |

---

## 0. Overview: Motivation for Larging Models Need to "Look Up References"

Imagine you're a knowledgeable professor who has read countless books. But if someone asks you "what were yesterday's sales figures," you certainly can't answer — because that information isn't in the books you've read.

Large language models face exactly the same dilemma:

- **Knowledge has a cutoff date**: GPT-4's training data has a cutoff point, so it doesn't know what happened after that
- **Lacks private knowledge**: Your company's internal documents, product manuals, and customer data have never been seen by the model
- **Prone to hallucination**: When the model is uncertain about an answer, it tends to "fabricate" a plausible-looking response

::: tip RAG's Core Idea
RAG's solution is very intuitive: **Before letting the model answer, first help it find relevant reference materials.** It's like an open-book exam — you don't need to memorize everything; you just need to know where to find it and how to look.

RAG = Retrieval + Augmented + Generation
:::

---

## 1. RAG Basic Workflow: Indexing, Retrieval, Generation

RAG's workflow can be divided into two phases: **offline indexing** and **online querying**.

The offline phase is like a library's cataloging work — classifying, numbering, and shelving all books for easy future retrieval. The online phase is the process of a reader coming to the library to look up information — finding relevant books based on a question and then synthesizing the information to provide an answer.

<RAGPipelineDemo />

::: tip Three Core Stages
1. **Indexing Stage**: Load, clean, and chunk original documents, then convert them into vectors through an embedding model and store them in a vector database. This is a one-time preparation step.
2. **Retrieval Stage**: When a user asks a question, convert the question into a vector as well and search for the most similar document chunks in the vector database.
3. **Generation Stage**: Combine the retrieved document chunks with the user's question into a Prompt, and pass it to the large model to generate the final answer.
:::

| Stage | Input | Output | Key Technology |
|------|------|------|---------|
| Indexing | Original documents | Vector database | Text chunking, embedding model |
| Retrieval | User question | Top-K document chunks | Vector similarity, reranking |
| Generation | Question + context | Final answer | Prompt engineering, LLM |

---

## 2. Text Chunking: Fitting the Elephant into the Refrigerator

Text chunking is the most easily overlooked yet most impactful step in RAG. Why is chunking needed? Because large models have limited context windows, and we can't stuff an entire book in. More importantly, **chunking quality directly determines retrieval quality**.

Imagine looking for a specific piece of knowledge in a book at the library. If the entire book is one "chunk," finding it is useless — you'd still have to flip through the whole book. But if it's chunked by chapter or even paragraph, you can precisely locate the content you need.

<ChunkingStrategyDemo />

::: tip Choosing a Chunking Strategy
- **Fixed-size chunking**: Split by character count or token count — simple but may break semantics
- **Recursive chunking**: First split by paragraphs; if paragraphs are too long, split by sentences — preserves semantic integrity
- **Semantic chunking**: Use embedding models to detect semantic boundaries, splitting where similarity drops sharply
- **Document structure chunking**: Use structural information like Markdown headings and HTML tags for chunking

There is no "best" chunking strategy, only the one most suitable for your data. Generally, start with recursive chunking, chunk size 200-500 tokens, overlap 10-20%.
:::

---

## 3. Retrieval Techniques: Approach to finding the Most Relevant Content

After chunking is complete, the next key question is: **When a user asks a question, how do you find the most relevant chunks from thousands of document segments?**

This is like searching for books in a huge library. You can search by book title keywords (keyword retrieval), describe what you want and let the librarian help (semantic retrieval), or best of all, combine both approaches (hybrid retrieval).

<RetrievalDemo />

| Retrieval Method | Principle | Advantages | Disadvantages |
|---------|------|------|------|
| Keyword Retrieval (BM25) | Based on term frequency and inverse document frequency | Exact matching, fast | Cannot understand semantics, fails with synonyms |
| Vector Retrieval | Based on cosine similarity of embedding vectors | Understands semantics, supports fuzzy matching | Less sensitive to proper nouns |
| Hybrid Retrieval | Fuses keyword and vector retrieval results | Balances precision and semantics | Requires weight tuning, higher complexity |

::: tip Reranking
After retrieving candidate documents, a "reranking" step is usually needed. Initial retrieval focuses on recall (try not to miss anything), while reranking focuses on precision (put the most relevant at the top). Common reranking models include Cohere Rerank and BGE Reranker, which use cross-encoders to finely score query-document pairs.
:::

---

## 4. Architecture Evolution: From Simple to Intelligent

RAG technology has gone through three generations of evolution in just two years, with each generation solving the pain points of the previous one.

<RAGArchitectureDemo />

::: tip Comparison of Three RAG Generations
- **Naive RAG (2023)**: The most basic "index → retrieve → generate" workflow. Simple to implement but limited effectiveness. Issues include: unstable retrieval quality, inability to handle complex queries, and easy introduction of noisy context.
- **Advanced RAG (2024)**: Built on top of Naive RAG with added query rewriting, hybrid retrieval, reranking, context compression, and other optimization steps, significantly improving retrieval precision and generation quality.
- **Modular RAG (2025)**: Decomposes RAG into pluggable modules, supporting routing decisions, adaptive retrieval, self-reflection, and other advanced capabilities. Can dynamically select the optimal processing workflow based on query type.
:::

---

## 5. RAG vs Fine-tuning: Selection of Choose

When you want a large model to master domain-specific knowledge, there are usually two paths: RAG and fine-tuning. They are not mutually exclusive but complementary.

To use an analogy: **Fine-tuning is like sending a student to training classes**, internalizing knowledge into their brain; **RAG is like giving a student reference books** that they can consult during exams. Both approaches have their pros and cons; the key is your specific needs.

<RAGvsFineTuningDemo />

| Dimension | RAG | Fine-tuning |
|------|-----|------|
| Knowledge Updates | Real-time updates; just modify documents | Requires retraining |
| Cost | Low (no GPU training needed) | High (requires training resources) |
| Explainability | High (traceable sources) | Low (knowledge internalized in weights) |
| Applicable Scenarios | Knowledge base Q&A, document retrieval | Style transfer, specific task optimization |
| Hallucination Control | Better (has reference basis) | General (may still hallucinate) |

::: tip Practical Advice
In most scenarios, **try RAG first**. RAG's advantages include: no training required, real-time knowledge updates, and traceable answer sources. Only consider fine-tuning when you need to change the model's "behavioral patterns" (such as output format, language style, or reasoning approach). The strongest solution is often a **RAG + fine-tuning** combination.
:::

---

## Summary

RAG is currently one of the most practical technologies for putting large models into production. Its core value lies in: making model answers verifiable, knowledge updateable in real-time, and hallucination effectively controlled.

Key takeaways from this chapter:

1. **The core problem RAG solves**: Outdated model knowledge, lack of private data, and tendency to hallucinate
2. **Three-stage workflow**: Indexing (offline preparation) → Retrieval (online search) → Generation (comprehensive answer)
3. **Chunking is foundational**: Chunking quality directly determines retrieval quality; choosing the right chunking strategy is crucial
4. **Retrieval is key**: Hybrid retrieval + reranking is currently the best-performing combination
5. **Architecture is evolving**: From Naive RAG to Modular RAG, systems are becoming increasingly intelligent and flexible
6. **RAG and fine-tuning are complementary**: Try RAG first in most scenarios; consider fine-tuning when you need to change model behavior

## Further Reading

- [LangChain RAG Tutorial](https://python.langchain.com/docs/tutorials/rag/) - Practical guide for the most popular RAG framework
- [LlamaIndex Documentation](https://docs.llamaindex.ai/) - A framework focused on RAG, providing rich data connectors
- [RAG Survey Paper](https://arxiv.org/abs/2312.10997) - Comprehensive survey of RAG technology
- [Chunking Strategies](https://www.pinecone.io/learn/chunking-strategies/) - Pinecone's detailed guide on chunking strategies
- [Vector Database Comparison](https://superlinked.com/vector-db-comparison) - Feature comparison of mainstream vector databases
