---
title: 'How to Learn This Course'
description: 'Start from zero, learn to find problems, validate demand, build AI products, and deliver them to real users as a product engineer responsible for outcomes.'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const relatedArticles = relatedArticlesMap['en/stage-1/learning-map'] ?? []
</script>

# How to Learn This Course

::: info Special thanks
The core contributors and testers of this course come from **Tsinghua University Shenzhen International Graduate School**. Thank you to the students who kept identifying problems, offering suggestions, and helping revise the material through real study and practice. Their work has made the course clearer, more reliable, and closer to what beginners actually need. [**👉 View the full contributor list**](https://github.com/datawhalechina/easy-vibe#-contributing--contributors)
:::

Building software used to have a high barrier. You had to learn programming languages, development tools, and a great deal of technical knowledge before an idea could become a working program. Large language models and AI coding tools have changed that: people can now describe intentions in natural language and ask AI to generate code, build interfaces, and revise features.

## From Vibe Coding to Building Products

**The term [Vibe Coding](https://www.merriam-webster.com/dictionary/vibe%20coding) appeared on February 2, 2025.** AI researcher Andrej Karpathy used it to describe a new way of programming: people mainly tell AI what they want in natural language, observe the result, and continue the conversation instead of writing, understanding, and managing every line from the beginning.

> **What is Vibe Coding?**
> In simple terms, it is “programming by talking”: describe an idea, let AI generate the program, run it, and keep adjusting it through conversation.

Its first breakthrough was allowing more people to cross the barrier of “I cannot code, so I cannot begin.” Someone with no programming experience can now create a small game, webpage, or demonstrable prototype in a few minutes.

<figure class="concept-illustration">
  <img src="../../../zh-cn/stage-1/learning-map/images/vibe-coding-to-product.webp" alt="A creator uses AI to turn a natural-language idea into a product prototype, gives it to real users, and continues iterating from feedback" loading="lazy">
  <figcaption>Vibe Coding helps you cross the “make it” barrier; building a product means continuing toward real users, feedback, and value.</figcaption>
</figure>

This is a major change: **the way people communicate with computers is expanding from strict programming syntax into natural language.**

But as a working demo becomes easier to make, new questions appear:

- What should we build, rather than merely what can we build?
- Whose problem does it solve, and do those people truly need it?
- How does an AI-generated first version become stable, understandable, and maintainable?
- How do we deliver the product instead of running it only on our own computer?
- How do use, feedback, and payment show that it creates real value?

Vibe Coding does not remove the need to learn. It **changes and raises the requirement**.

If we look only at coding, the goal is to make code run. Building a product means taking responsibility for the entire journey from problem to result:

> **Coding: Can I make it?**<br>
> **Build Product: Is it worth making, who will use it, how will I deliver it, and how will I know it works?**

Vibe Coding is the starting point of this course, not its destination. We will first make something quickly, then learn how to choose a problem, validate demand, design a solution, build a product, meet users, and iterate from results.

::: tip What does this course really develop?
The course is not only about using AI coding tools. It aims to help you become an entry-level **Product Engineer**: someone who can find problems, validate demand, build a product, deliver it to real users, and continue improving it from outcomes.
:::

## Why do we need product engineers now?

Product engineering did not suddenly appear in 2026.

As early as 2018, Intercom used Product Engineer to describe an engineer with product ownership: someone who does more than implement a feature that another person has already designed, and who also understands customers, participates in product decisions, and continually improves what they deliver.

AI has greatly reduced the cost of “making it” and allows engineers to take on work once divided across several roles. With large models and coding agents, one person can more easily cross prototypes, interfaces, frontend and backend, AI integration, testing, and deployment. The job therefore extends beyond “finish the code”: understand users directly, validate solutions, encourage adoption, and take responsibility for business results.

### From participating in a product to owning the result

The following real milestones show this change:

| Time | Company and role | What the role signals |
| --- | --- | --- |
| May 2018 | [Intercom: Product Engineer](https://www.intercom.com/blog/making-the-transition-from-consultant-to-product-engineer/) | Engineers are also product people who understand customers and help decide how the product develops |
| February 2026 | [Hamilton AI: Product Engineer](https://jobs.ashbyhq.com/hamilton-ai/78c69fe9-828d-44b3-abe6-af56a2badf76/) | Talk directly with customers, turn one conversation into a usable product, and validate it with real users |
| June 2026 | [Alma: Product Engineer - AI](https://jobs.ashbyhq.com/tryalma/8021fb35-fc1e-4950-a078-afc0e89d9856) | The same person designs agents, writes backend systems, completes interfaces, and observes how lawyers and clients use them |
| July 2026 | [Harper: Product Engineer](https://jobs.ashbyhq.com/harperinsure/7d678dba-885a-4432-94c7-a9c20852db35) | Work inside sales, support, and underwriting and own business measures such as conversion, not only feature delivery |
| August 2026 | [Paradigm: Product Engineer, Applied AI](https://jobs.ashbyhq.com/Paradigm/b85b9094-2467-4f49-9a36-ca93da34a3f5) | Find problems inside investment, research, and operations teams and build internal and open-source products |
| As of August 2026 | [OpenAI: Forward Deployed Engineer](https://openai.com/careers/forward-deployed-engineer-%28fde%29-seattle-seattle/) | Own discovery, technical planning, system building, and production deployment; measure success by adoption and workflow impact |

<details>
<summary><strong>More real roles across industries</strong></summary>

These examples cover aviation, law, insurance, financial compliance, biomedicine, industry, enterprise services, and AI infrastructure.

| Publication | Company and role | The loop they must complete |
| --- | --- | --- |
| February 2026 | [Sphinx: Product Engineer](https://jobs.ashbyhq.com/Sphinx/08bdb9eb-4b6c-44ab-9615-3bb6b908d008) | Select opportunities from customer conversations, prototype and test quickly, and influence the roadmap with results |
| March 2026 | [Hyperscale: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/hyperscale/950c982f-5fb9-481b-a6ad-808feba76757) | Participate in technical research, proof of concept, on-site delivery, and enterprise sales |
| April 2026 | [Sphere: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/sphere/7b5f39b0-6f3f-4bc4-9469-74ae9722d85a) | Work from customer discovery through deployment and turn customer needs into general product capabilities |
| May 2026 | [Avent: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/avent-industrial-inc/bf8337c2-00cf-4ca7-aa43-b4c29e4b8083) | Understand the customer’s business, write code, integrate systems, and own a successful launch |
| May 2026 | [Tamarind Bio: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/tamarindbio/be678c9b-984e-4a0a-aedc-a87187e18748/) | Cover the first technical conversation, pilot, production deployment, expansion, demos, and sales cycles |
| June 2026 | [Protege: Forward Deployed Engineer, New Verticals](https://jobs.ashbyhq.com/protege/b62ebf3e-e07f-4f67-bc9c-4787f23fe449/) | Build new business directions from early customer needs and turn successful methods into platform capabilities |
| June 2026 | [Dataleap: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/dataleap/6afe756f-fea9-42fc-82ed-621c72a99387/) | Find important workflows inside enterprises, build agents, complete integrations, and teach customers to use them |
| June 2026 | [Collinear AI: Product Engineer](https://jobs.ashbyhq.com/collinear-ai/4d4af6b1-bfc7-4a28-9d86-5bab73e6e396) | Work across backend, frontend, APIs, user experience, testing, and production quality to turn complex AI into a usable product |
| July 2026 | [Restate: Forward Deployed Engineer](https://jobs.ashbyhq.com/restate/c9419551-7f51-4691-8ba9-d80a27f1e284) | Own proof of concept, production readiness, and deployment, then turn one-off delivery into a repeatable pattern |
| As of August 2026 | [Scale AI: Forward Deployed Engineer, GenAI](https://scale.com/careers/4593571005) | Work directly with technical customers, perform end-to-end development and rapid experiments, and influence the roadmap |

</details>

::: details Research dates
This page was compiled on **August 9, 2026**. Dates shown for Ashby roles come from the `publishedAt` field in their public recruitment data; pages without a date use the date this page was checked. Job pages may disappear after a role closes.

These examples are observations from a group of real roles, not a statistical description of the whole labor market. They show an emerging direction in AI-native companies and small product teams, not that every company will remove specialized product, design, engineering, and sales roles.
:::

### How are these roles changing?

- **The starting point changes:** instead of waiting for a written requirement, they enter user and business settings to discover problems.
- **The purpose of a prototype changes:** it is not merely a technical demonstration; it reaches users quickly and tests a judgment.
- **The boundary of engineering changes:** it expands from one technical module to interface, backend, AI, deployment, and user experience.
- **The measure of success changes:** it moves from “the feature shipped” to adoption, saved time, conversion, revenue, and real impact.
- **The relationship with sales changes:** some product engineers join demos, proofs of concept, and customer launches to prove value through technology.

“Knowing how to sell” does not mean everyone must become a traditional salesperson. For a product engineer, it first means being able to find people who may need the product, understand their problem, demonstrate the solution, invite them to use it, and learn whether they will continue using or paying for it.

### How do Product Engineer, FDE, and OPC relate?

These concepts sit on the same capability chain, but they are not the same thing.

| Concept | What it is | Main setting | Scope of responsibility |
| --- | --- | --- | --- |
| **Product Engineer** | A role combining product and engineering | Inside a product team | From problem and solution through release, user feedback, and business measures |
| **FDE (Forward Deployed Engineer)** | Product engineering extended into the customer setting | Enterprise customers, real operations, and production environments | Discovery, proof of concept, integration, deployment, adoption, expansion, and sometimes the sales cycle |
| **OPC (One-Person Company)** | A company operated by one leading individual, not a job title | One person runs a product with AI agents, automation platforms, and external services | Market discovery, product, marketing, sales, delivery, support, and cash flow |

<div class="role-path-figure" role="img" aria-label="The scope expands from building the right product to bringing it into customer operations and running the whole business">
  <div class="role-path-node">
    <strong>Product Engineer</strong>
    <span>Build the right product</span>
  </div>
  <div class="role-path-arrow" aria-hidden="true"></div>
  <div class="role-path-node">
    <strong>FDE</strong>
    <span>Bring the product into customer operations</span>
  </div>
  <div class="role-path-arrow" aria-hidden="true"></div>
  <div class="role-path-node">
    <strong>OPC</strong>
    <span>Run a complete business</span>
  </div>
</div>
<p class="role-path-caption">This is not a career ladder that everyone must climb in order. It shows the different ranges that the same product-engineering capabilities can cover.</p>

Think of them as three expanding circles:

> **Product Engineer: build the right product and make it work**<br>
> **FDE: bring the product into a customer setting and create results**<br>
> **OPC: use the same capabilities to operate a complete business**

#### FDE: engineers enter the customer setting

An FDE is neither an implementation specialist who only installs software nor a presales engineer who only demonstrates it. An FDE at an AI company usually does four things:

1. Find the most valuable problem together with the customer.
2. Quickly build a prototype or proof of concept to show technical and business value.
3. Write production code and connect the solution to real customer data and workflows.
4. Observe adoption and turn repeated needs into general product capabilities.

As of August 2026, OpenAI was recruiting FDEs in multiple countries and cities and described success in terms of production adoption, measurable workflow impact, and field feedback that can change product and model roadmaps. FDE is growing from a special practice in some enterprise software companies into an important way of delivering AI.

#### OPC: one person can have a “digital team”

Here, OPC does not refer only to a legal single-member company. It means a **One-Person Company: a business led by one person who uses software, AI agents, and external infrastructure to perform work that once required a larger team.**

It is not an “unmanned company” operated entirely by AI. The founder must still judge the market, take responsibility, meet users, and make critical decisions. AI behaves more like a digital team that can be assigned work.

This trend did not begin with AI. Independent developer Pieter Levels explains on his website that he has long built and run Nomads.com, Remote OK, Photo AI, Interior AI, and other products by himself. AI can extend this model into design, programming, content, analysis, and support, but real markets still decide whether the products have value. [See Pieter Levels’s project record](https://levels.io/projects/)

In 2025, Microsoft’s Work Trend Index used **Agent Boss** for workers who create, delegate to, and manage AI agents. The report surveyed 31,000 workers in 31 countries, and 81% of leaders expected agents to become moderately or extensively integrated into their AI strategy within 12–18 months. [See the Microsoft 2025 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born)

In June 2025, Wix acquired the natural-language app-development platform Base44 for about $80 million. Base44 is not strictly an OPC, but it shows an important enabling condition: databases, authentication, and deployment—work that once required several roles—are being packaged and automated through conversational products. [See the Wix acquisition announcement](https://www.wix.com/press-room/home/post/wix-further-expands-into-vibe-coding-with-acquisition-of-base44-a-hyper-growth-startup-that-simplif)

The question of when the first one-person unicorn will appear remains a prediction, not an accomplished fact. The more useful reality for beginners is this: **one person can already validate a product faster with less money and a smaller team, and can operate a modest but genuinely profitable business.**

::: tip Why does the course discuss all three paths?
Whether you later join a product team, become an FDE, or try an OPC, the starting point is the same set of product-engineering fundamentals: find a real problem, build the smallest product, deliver it to users, explain its value, and iterate from use and payment.
:::

The course therefore trains one complete product loop rather than several separate job titles:

> **Find a problem → Validate demand → Design a solution → Build the product → Deliver to users → Explain value → Observe results → Continue iterating**

Of course, asking AI to write code is only the first step. A usable product raises more questions:

- How do we get AI to write clean, maintainable code?
- How do we assemble scattered code into a working application?
- How do we put an application online so other people can use it?
- How do we add AI capabilities such as text generation and image understanding?
- How do we know whether users need it and might even pay for it?

You will find answers to these questions throughout the course.

Whether you are a student, teacher, doctor, worker, or someone who knows nothing about technology, you do not need to study programming for years before beginning your first product prototype.

| Your role | How this course can help |
| --- | --- |
| Student | Complete assignments, competitions, and startup projects yourself |
| Professional | Automate repeated work, improve efficiency, and create a side business |
| Product manager / Designer | Turn an idea into a demo and put it in front of users |
| Entrepreneur / Small-business owner | Validate ideas cheaply and make an MVP before building a complete team |
| Teacher / Educator | Create teaching tools, courseware, and automatic exercises |
| Doctor / Lawyer / Specialist | Automate professional workflows and build personal productivity tools |
| Anyone | Use AI to solve a specific problem in life or work |

AI lowers implementation cost, but product value still depends on whether you find a real problem and deliver the solution to users.

## Growth path: from “using AI” to becoming a product engineer

<div class="stage-intro">
  <div class="stage-card">
    <div class="stage-icon">🎮</div>
    <h3>First experience</h3>
    <p class="stage-role">Try AI coding</p>
    <div class="stage-tags">
      <span>Snake game</span>
      <span>Begin from zero</span>
      <span>First Vibe Coding experience</span>
      <span>Generate in minutes</span>
    </div>
  </div>
</div>

<div class="stage-grid">
  <div class="stage-card">
    <div class="stage-icon">🛠️</div>
    <h3>Stage 1</h3>
    <p class="stage-role">Product engineering fundamentals</p>
    <div class="stage-tags">
      <span>AI IDE (Cursor/Claude)</span>
      <span>Demand validation & prototype</span>
      <span>AI capability integration</span>
      <span>Deliver to real users</span>
    </div>
  </div>
  <div class="stage-card">
    <div class="stage-icon">💻</div>
    <h3>Stage 2</h3>
    <p class="stage-role">Full-stack product engineer</p>
    <div class="stage-tags">
      <span>Figma to code</span>
      <span>Supabase database</span>
      <span>Stripe payment integration</span>
      <span>Dify knowledge base</span>
    </div>
  </div>
  <div class="stage-card">
    <div class="stage-icon">🚀</div>
    <h3>Stage 3</h3>
    <p class="stage-role">AI product engineer / Technical lead</p>
    <div class="stage-tags">
      <span>Web / Mini programs / Multiple platforms</span>
      <span>Advanced MCP tools</span>
      <span>RAG & LangGraph</span>
      <span>Advanced engineering thinking</span>
    </div>
  </div>
</div>

<style>
.concept-illustration {
  margin: 24px 0 12px;
}

.concept-illustration img {
  display: block;
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.concept-illustration figcaption,
.role-path-caption {
  margin: 8px 12px 0;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  line-height: 1.6;
  text-align: center;
}

.role-path-figure {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  margin: 24px 0 0;
}

.role-path-node {
  display: flex;
  min-height: 112px;
  padding: 18px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: linear-gradient(145deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.role-path-node strong {
  color: var(--vp-c-brand-1);
  font-size: 1rem;
}

.role-path-node span {
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
}

.role-path-arrow::before {
  color: var(--vp-c-brand-1);
  content: '→';
  font-size: 1.25rem;
  font-weight: 700;
}

.stage-intro {
  margin: 20px auto;
  max-width: 400px;
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.stage-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}

.stage-card:hover {
  transform: translateY(-2px);
  background-color: var(--vp-c-bg-mute);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border-color: var(--vp-c-brand);
}

.stage-icon {
  font-size: 2rem;
  margin-bottom: 8px;
  line-height: 1;
}

.stage-card h3 {
  margin: 0 0 4px 0 !important;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
}

.stage-role {
  margin: 0 0 8px 0 !important;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.stage-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

.stage-tags span {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 3px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.stage-card:hover .stage-tags span {
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-brand-dimm);
  color: var(--vp-c-brand-dark);
}

@media (max-width: 720px) {
  .role-path-figure {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .role-path-node {
    min-height: 88px;
  }

  .role-path-arrow {
    text-align: center;
  }

  .role-path-arrow::before {
    content: '↓';
  }
}
</style>

Following the complete learning path gives you:

- **Vibe Coding ability:** use Vibe Coding thinking and AI tools fluently, guide AI to produce better code, and work faster without memorizing syntax first.
- **Full-stack development skills:** move from interface design to frontend, database design, APIs, local development, and cloud deployment.
- **AI capability integration:** connect multimodal APIs for text, image, and audio, and later build intelligent products with methods such as RAG.
- **Product and operations thinking:** move from user research and demand breakdown through MVP design, iteration, payments, and user management.

# What can you do after the course?

## Stage 1: build your first product prototype

This stage is for complete beginners and for people who know a little code but are not yet confident. You do not study a large body of theory first. You learn to ask AI to write code and fix errors while building.

**After this stage you can:**

- independently complete a web application with an AI coding tool;
- turn a product idea into a clickable, interactive prototype;
- add AI features such as image generation and intelligent conversation;
- investigate and solve errors instead of stopping at the first failure.

In short, you can make something that runs and can be demonstrated to another person.

We begin with a small game, then learn to use an AI coding tool to write code and handle errors. From a simple page, we build an interactive multi-page application, add AI functions, and complete an independent project so an idea has a real chance to reach the world.

# Why train through projects?

> **The challenge of real work**
>
> In a real workplace, you are often given a goal but not a complete document, ready-made framework, or detailed requirements.

> Your supervisor or customer: We need to build xxx and achieve yyy.
>
> Documentation? Existing framework? Detailed specification? Often none of them exists.

Much real work means solving an unfamiliar problem under uncertainty. Requirements are vague, boundaries change, and nobody provides a standard answer. You must research, experiment, prototype, iterate, and finally deliver a solution that runs, works, and can be released.

The course gives you a safe simulation of that experience:

- challenging projects force you to break down problems, design solutions, and find information;
- scaffolding that is not excessively simplified helps you learn to read, understand, and modify a medium-sized codebase;
- the full path from idea to release lets you experience a real product journey from zero to one.

This training can feel difficult in the short term, but it strengthens your ability to handle responsibility, find a way through uncertainty, and turn AI into a real product rather than a demo.

# The art of asking: a fundamental skill in the AI era

Asking questions is a core skill. With the same code and the same error, **how you ask often determines the answer you receive**: a vague discussion or an actionable sequence.

**Build the habit:** treat asking AI as part of development. When you do not understand something or become stuck, ask at once.

## Why is this an essential skill?

- **Real work rarely has complete documentation:** requirements may be unclear, code unfinished, and errors scattered.
- **AI can be a tutor and colleague:** good questions turn it into high-quality pair programming.
- **Communication sets the ceiling:** the more relevant context and output constraints you provide, the more useful the answer becomes.

**Common mistake:** “Why is there an error?” usually produces guesses. Include the context to obtain an executable plan.

## How to give information to AI: screenshot or copy and paste?

Both work, but for different situations:

| Method | Suitable for | Key requirement |
| --- | --- | --- |
| **Copy and paste** | Error stacks, logs, code, configuration, API responses | Include the complete relevant text, not one keyword |
| **Screenshot** | Layout issues, interaction problems, or a missing button in a tool | Capture enough context, mark the important area, and add one sentence |

::: danger ⚠️ Important condition
**Not every AI accepts image input.** Screenshot-based communication requires a multimodal model that can understand images. Examples include Claude, GPT-4V/GPT-4o, Gemini, and some Chinese models such as Qwen and ERNIE Bot.

**If your AI does not accept images**, it cannot read the screenshot. Copy and paste the text instead.
:::

## Prompts that help AI explain well

If you want to learn the answer rather than only receive it, instructions like these improve the explanation:

> **Learning-oriented examples**
>
> - “Explain this concept in five sentences, then ask me a few questions to check my understanding.”
> - “Explain this error in detail. I do not understand why it happened.”

# I have tried for a long time and want to give up

Perhaps the method, not your persistence, needs to change. Do not struggle alone. Talk with the authors and teaching assistants, describe what you tried, where you became stuck, and how you feel. A small change in direction or one missing concept can often help you continue.

# Some parts of the course design feel unreasonable

Please contact the authors, open an issue, or give feedback in the class or community. Tell us what is unclear, what feels poor, and where time was wasted. Honest and specific feedback helps later learners avoid the same problem.

# Reference

- [Nanjing University, Computer Systems Fundamentals course experiments](https://nju-projectn.github.io/ics-pa-gitbook/ics2025/)

<RelatedArticlesSection
  title="What to learn next"
  description="Continue from using AI toward building products."
  :items="relatedArticles"
/>
