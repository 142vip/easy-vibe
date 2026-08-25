---
title: 'Find AI Opportunities in Real Workflows'
description: 'Use more than sixty consulting, industry-research, and product cases to examine AI applications already appearing in business and everyday life.'
---

# Find AI Opportunities in Real Workflows

Many “AI industry use-case collections” look impressive: finance, healthcare, education, manufacturing, then a dozen ideas under each heading. Yet when it is time to build, they do not tell you whom to interview, which data to connect, which step to replace, or who would pay for the result.

The problem is that **an industry is not a use case**. “AI + healthcare” is only a territory. “After a consultation, a physician spends ten minutes finishing the clinical note; the system drafts it from the conversation and the physician approves it” is a workflow that can be researched, designed, and tested.

This appendix takes that second approach. We reviewed more than sixty reports and first-party product cases. Rather than listing every industry, we selected business and consumer workflows that are already in use and whose value can be located. Treat this as a map for finding questions worth interviewing about—not as a ready-made startup answer.

<div class="research-note">
  <div>
    <span class="research-note__eyebrow">Keep this sentence in mind</span>
    <strong>For businesses, look for a blockage in a workflow. For consumers, look for a moment that keeps returning during the day.</strong>
  </div>
  <p>The first requires a clear worker, systems, handoffs, and owner. The second requires a reason to return and one step that AI removes compared with search, templates, or a human service.</p>
</div>

## First, distinguish business and consumer products

### Business: a company pays for an outcome

A company rarely buys “a chatbot” by itself. It buys shorter handling time, less rework, steadier compliance, or more sales. A researchable business workflow should answer at least four questions: who performs it every day, where the material comes from, which system receives the result, and who owns a mistake.

This is why many pilots never expand. Deloitte's survey of 2,773 business leaders found that only a limited share of generative-AI experiments reach scale, and Accenture's review of more than 2,000 projects found that relatively few organizations produce enterprise-wide value. The difficulty is often not whether a model can answer, but whether it participates in a complete workflow. [Deloitte: State of Generative AI in the Enterprise](https://www2.deloitte.com/us/en/pages/about-deloitte/articles/press-releases/state-of-generative-ai.html) · [Accenture: Making Reinvention Real with Gen AI](https://www.accenture.com/us-en/insights/consulting/making-reinvention-real-with-gen-ai)

### Consumer: a person pays for an easier moment

A consumer product does not need ten enterprise integrations, but the person can close it at any time. Strong consumer uses appear at a recognizable moment: preparing a trip, comparing products, practising speech, making a poster, or sorting bills. They complete one task first and learn preferences over time.

In Capgemini's survey of 12,000 consumers, generative AI had already entered product discovery and comparison. QuestMobile likewise found that AI in China was moving from standalone chat products into search, productivity, imaging, and music. The opportunity is not only another chat box, but a conversation connected to the next action. [Capgemini: What Matters to Today's Consumer 2025](https://www.capgemini.com/insights/research-library/top-consumer-trends-in-2025/) · [QuestMobile: 2025 China Mobile Internet Spring Report](https://www.questmobile.cn/research/report/1919961024158601218/)

## Business: eight workflows already happening

Each section begins with a specific role. Do not copy the product name first. Ask why the old work was slow, which step AI took over, and what still had to remain with a person.

### 1. Customer service is not answering a question; it is finishing the case

<figure class="product-shot">
  <a href="https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/klarna.webp" alt="Klarna AI Assistant interfaces for payment extension, multilingual support, and refund explanation" loading="lazy" />
  </a>
  <figcaption><strong>Klarna AI Assistant:</strong> the left side does not merely say “contact an agent”; it opens the payment-extension action. The right side itemizes a refund. Useful service AI finds the order and carries the action forward.</figcaption>
</figure>

**Who does the work:** frontline agents, team leads, and after-sales operations.

When a customer asks why a refund has not arrived, an agent verifies identity, checks order, payment, and logistics systems, explains the rule, and may create a ticket. The slow part is not the polite sentence; it is collecting context across systems.

Klarna's assistant handles refunds, returns, and multilingual support. ResultsCX connects voice routing, account lookup, and backend APIs. Both show that value comes from **finding status → applying the rule → recording the action → escalating when necessary**, not from an FAQ. [Klarna case](https://openai.com/index/klarna/) · [ResultsCX case](https://aws.amazon.com/solutions/case-studies/resultscx/) · [Salesforce: State of Service 2025](https://www.salesforce.com/news/stories/state-of-service-report-announcement-2025/)

A first version can begin after the human conversation: draft a summary, identify intent, retrieve the relevant policy and suggest the next action, then let the agent approve it before writing the ticket. This reveals time saved without giving refund authority to a model.

<div class="scene-check">
  <span>Questions worth asking</span>
  <p>Which pages do agents switch between most? Which repeated questions require different actions for different order states? When a case is transferred, does the next agent ask everything again?</p>
</div>

### 2. Sales does not lack copy; it lacks the right next conversation

<figure class="product-shot">
  <a href="https://openai.com/index/morgan-stanley/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/morgan-stanley.webp" alt="Internal Morgan Stanley AI@MS Assistant interface" loading="lazy" />
  </a>
  <figcaption><strong>Morgan Stanley AI@MS Assistant:</strong> advisers can look up account-opening documents and case status. The page also says “internal use only” and requires human verification. It is a retrieval entry embedded in the workstation, not a chatbot making decisions for an adviser.</figcaption>
</figure>

**Who does the work:** B2B salespeople, account managers, solution consultants, and sales leaders.

After a meeting, a salesperson updates the CRM, identifies decision-makers and objections, finds a relevant case, writes a follow-up email, and decides when to contact the customer. The evidence is scattered across recordings, chat, email, and private notes, so the CRM is often stale.

McKinsey maps generative AI across the B2B sales cycle: prospecting, meeting preparation, communication, proposal, closing, and renewal. Morgan Stanley's adviser tools do not make investment decisions; they retrieve internal knowledge and turn meetings into notes and tasks. [McKinsey: Unlocking Gen AI in B2B Sales](https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/unlocking-profitable-b2b-growth-through-gen-ai) · [Morgan Stanley case](https://openai.com/index/morgan-stanley/)

A first version can handle the fifteen minutes after a meeting: extract goals, objections, commitments, and next steps, draft an editable email, and fill the CRM fields. Measure CRM completeness and follow-up time, not the number of generated words.

### 3. A company knowledge base must answer which rule applies this time

<figure class="product-shot">
  <a href="https://www.notion.com/help/guides/find-answers-and-generate-reports-with-enterprise-search" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/notion-enterprise-search.webp" alt="Notion Enterprise Search interface" loading="lazy" />
  </a>
  <figcaption><strong>Notion Enterprise Search:</strong> one question can search Notion and Slack, and the user can switch among Ask, Research, and Build. An enterprise assistant connects existing sources and permissions; it is not merely a place to upload one PDF.</figcaption>
</figure>

**Who does the work:** consultants, operations, HR, finance, IT support, and new employees.

Answers already exist inside most companies, but are scattered across policies, manuals, old email, training videos, and previous projects. “Can this customer receive a refund?” requires the current rule, its conditions, and its source—not any document containing the word refund.

Sun Life's internal assistant handles more than ten thousand employee queries a week. Morgan Stanley expanded searchable internal material to about one hundred thousand documents. Notion brings enterprise search, meeting notes, and action into the same workspace. The core is permission, version, citation, and feedback, not “upload a PDF and chat.” [Sun Life Asks](https://aws.amazon.com/solutions/case-studies/sun-life-case-study/) · [Notion AI overview](https://www.notion.com/help/notion-ai-faqs)

Do not connect the whole company first. Select a team with many questions and a clear boundary, such as returns policy or IT support. Every answer should cite its source; missing answers should be admitted and added to a material backlog.

### 4. Finance, legal, and compliance: read and draft, but do not sign

<figure class="product-shot">
  <a href="https://mena.thomsonreuters.com/en/products-services/legal/cocounsel.html" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/cocounsel.webp" alt="Thomson Reuters CoCounsel contract drafting and research interface" loading="lazy" />
  </a>
  <figcaption><strong>Thomson Reuters CoCounsel:</strong> progress for drafting and research appears on the left, then the draft opens in Word. AI reads, finds support, and drafts; professionals review and finish the work in a familiar document.</figcaption>
</figure>

**Who does the work:** financial analysts, tax, legal, procurement, and compliance teams.

These roles see many similar-looking but different contracts, invoices, statements, policies, audit papers, and due-diligence files. AI can extract, compare, classify, retrieve, and draft, but a final judgment must return to the source and have a responsible reviewer.

Thomson Reuters' 2025 survey reports rising generative-AI use in legal, tax, and risk work, including research, document summaries, contract drafting, and filing preparation. Moderna's Contract Companion gives employees a contract summary; OpenAI and PwC discuss finance agents for reconciliation, risk signals, and cross-system workflows. [Thomson Reuters: 2025 Generative AI in Professional Services](https://www.thomsonreuters.com/en-us/posts/technology/genai-professional-services-report-2025/) · [Moderna case](https://openai.com/index/moderna/) · [OpenAI × PwC: CFO workflows](https://openai.com/index/openai-pwc-finance-collaboration/)

A small team can start with one document and one rule set: check payment, renewal, indemnity, and data clauses in supplier contracts, with quotations and risk explanations. Prove omission rate, review time, and citation accuracy before claiming to offer an “AI legal department.”

### 5. Software development: value appears in the repository

<figure class="product-shot">
  <a href="https://github.blog/changelog/2024-10-29-github-copilot-code-review-in-github-com-private-preview/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/github-copilot-review.webp" alt="GitHub Copilot reviewing code in a pull request" loading="lazy" />
  </a>
  <figcaption><strong>GitHub Copilot Code Review:</strong> when Copilot is assigned as a reviewer, comments attach to exact lines and can include a proposed change. A developer still inspects the diff, batches, or rejects it. The value is inside the pull request, not another chat window.</figcaption>
</figure>

**Who does the work:** developers, testers, operations, and security engineers.

Time is spent understanding old code, adding tests, reading logs, reviewing changes, and learning unfamiliar repositories. In GitHub's controlled experiment, participants using Copilot completed a specified task faster. In a real team, however, repository context, engineering rules, and passing tests matter much more than the ability to produce code. [GitHub Copilot productivity study](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/) · [GitHub follow-up report](https://github.blog/wp-content/uploads/2023/06/Sea-Change-in-Software-Dev.pdf)

A useful internal tool can begin with a failed CI run: read the error and relevant changes, locate likely causes, suggest a fix, and prepare a patch for review. It must run tests, show the diff, and accept review rather than pushing directly to production.

### 6. Manufacturing and field service: make equipment, manuals, and work orders speak together

<figure class="product-shot">
  <a href="https://blog.siemens.com/2026/02/the-digital-enterprise-and-the-synthesis-of-industrial-ai-digital-twin-and-data/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/siemens-industrial-copilot.webp" alt="Siemens Engineering Copilot beside TIA Portal" loading="lazy" />
  </a>
  <figcaption><strong>Siemens Engineering Copilot:</strong> Copilot and TIA Portal are open side by side. The assistant sees the current automation project, equipment structure, and engineering documents instead of answering a context-free question about why a machine failed.</figcaption>
</figure>

**Who does the work:** equipment operators, maintenance engineers, field-service staff, and process engineers.

When a machine stops, the operator may see only an error code. The answer is buried in hundreds of pages of manuals, parts lists, and repair history while losses accumulate by the minute. After the repair, the field engineer still has to write a report that the customer can read and the company can archive.

Siemens Industrial Copilot is used to explain equipment, retrieve maintenance support, and assist automation programming. Another Siemens trial turns brief engineer notes from more than 1.4 million annual work orders into consistent customer reports. Deloitte's manufacturing survey also identifies data quality and equipment context as major barriers. [Siemens Industrial Copilot](https://news.microsoft.com/source/emea/features/how-ai-is-helping-siemens-and-thyssenkrupp-bridge-skilling-gaps-in-manufacturing/) · [Siemens field-report case](https://www.microsoft.com/en/customers/story/19736-siemens-ag-germany-dynamics-365-field-service) · [Deloitte: 2025 Smart Manufacturing Survey](https://www2.deloitte.com/us/en/insights/industry/manufacturing/2025-smart-manufacturing-survey.html)

A good starting point is one equipment type, not “predict the whole factory”: identify an error code, retrieve its manual pages and previous work orders, and propose a diagnostic sequence. After repair, turn the notes into a report. Show evidence for every suggestion and let the engineer mark it unhelpful.

### 7. In healthcare, start with documentation and coordination—not a diagnostic demo

<figure class="product-shot">
  <a href="https://www.abridge.com/product" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/abridge-note.webp" alt="Abridge linking a clinical note to its original conversation" loading="lazy" />
  </a>
  <figcaption><strong>Abridge:</strong> the generated clinical note appears above the matching clinician-patient conversation. Linked Evidence returns to the original words. The important part is not fast writing, but a physician who can trace, edit, and approve every entry.</figcaption>
</figure>

**Who does the work:** physicians, nurses, records teams, insurance reviewers, and patient-service staff.

Much of healthcare's burden lies outside diagnosis: documentation, referral, authorization, claims, and patient communication. McKinsey's near-term examples focus heavily on summaries, benefit questions, denial explanations, discharge instructions, and back-office work rather than autonomous diagnosis. [McKinsey: Tackling Healthcare's Biggest Burdens with Generative AI](https://www.mckinsey.com/industries/healthcare/our-insights/tackling-healthcares-biggest-burdens-with-generative-ai)

Ambient systems such as Abridge draft structured notes from the consultation and let the physician approve them. This draft–review–write-back boundary reduces paperwork without changing clinical accountability. [Abridge health-system case](https://www.abridge.com/press-release/abridge-hartford-healthcare) · [McKinsey: Generative AI in Healthcare](https://www.mckinsey.com/industries/healthcare/our-insights/generative-ai-in-healthcare-current-trends-and-future-outlook)

Without a clinical partner, suitable data, and compliance expertise, do not start with diagnosis. Study lower-risk patient service, such as converting preparation instructions into a step-by-step checklist or helping staff organize calls, subject to institutional review.

### 8. Retail and content operations: one asset must travel through many channels

<figure class="product-shot">
  <a href="https://www.canva.com/newsroom/news/magic-studio/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/canva-magic-switch.webp" alt="Canva Magic Switch menu for resizing, translation, and document conversion" loading="lazy" />
  </a>
  <figcaption><strong>Canva Magic Switch:</strong> the same approved design can be resized, translated, or turned into a document. This is the frequent content-team task of turning one accepted asset into versions for many channels.</figcaption>
</figure>

**Who does the work:** e-commerce operations, brand marketing, design, merchandising, and localization teams.

A product launch is not just one paragraph. Teams interpret product data, write titles and selling points for different channels, process images, adapt dimensions, translate, check prohibited terms, and update after feedback. Much time goes to moving material and checking consistency.

Deloitte's retail outlook lists personalization, merchandising, supply chain, and marketing among AI applications. Canva Magic Switch adapts content to sizes and languages, while Adobe Firefly combines generation, editing, and production assets. AI does not replace brand judgment; it reduces the mechanical work of producing versions. [Deloitte: 2025 Retail Industry Outlook](https://www.deloitte.com/us/en/insights/industry/retail-distribution/retail-distribution-industry-outlook-2025.html) · [Canva Magic Studio](https://www.canva.com/newsroom/news/magic-studio/) · [Adobe Firefly](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

A first version can serve one channel and one product type: draft a detail page from structured data, check required fields, dimensions, and prohibited claims, then let an operator publish. It will receive more useful feedback than a “universal marketing assistant.”

## Consumer: seven moments when people open the product themselves

The easiest consumer mistake is to put seven prompts behind the same chat box. The products below work because the conversation connects to products, courses, trips, a canvas, music, or financial data, letting the person continue the task.

### 1. “Reduce my choices”: search, comparison, and purchase

<figure class="product-shot product-shot--mobile">
  <a href="https://www.aboutamazon.com/news/retail/amazon-rufus" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/amazon-rufus.webp" alt="Amazon Rufus shopping assistant" loading="lazy" />
  </a>
  <figcaption><strong>Amazon Rufus:</strong> the entry point sits beneath Amazon search, and the sample questions are shopping tasks: compare tablecloths, prepare for Prime Day, and find a watch for sleep tracking. It connects the answer to real products rather than offering generic advice.</figcaption>
</figure>

Someone buying a camera, stroller, or rainy-day commuter shoe does not lack product pages; they lack a way to turn vague conditions into comparable choices. Rufus combines the catalog, reviews, and Q&A, while Capgemini and Adobe both observe consumers using AI for discovery, comparison, and pre-sale advice. [Amazon Rufus](https://www.aboutamazon.com/news/retail/amazon-rufus) · [Adobe: 2025 AI and Digital Trends](https://business.adobe.com/content/dam/dx/us/en/resources/digital-trends-report-2025/2025_Digital_Trends_Report.pdf)

Research a difficult product category, not the phrase “AI shopping assistant.” A renter choosing a projector must combine throw distance, daylight brightness, noise, and budget. Show comparison evidence, missing information, and real products instead of an invented expert conclusion.

### 2. “I do not want twenty tabs”: travel planning and live changes

<figure class="product-shot">
  <a href="https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/expedia-chatgpt.webp" alt="Expedia conversational trip-planning interface" loading="lazy" />
  </a>
  <figcaption><strong>Expedia conversational planning:</strong> a user begins by comparing Maui and Kauai for a honeymoon, then saves hotel suggestions directly to Trips. The loop closes when conversation becomes a saved itinerary and booking action.</figcaption>
</figure>

Trip planning repeatedly combines destination, dates, transport, opening hours, budget, and companion preferences. Expedia connects open conversation to saved hotels, prices, and booking. Travel AI is valuable when advice becomes an itinerary that can be saved, checked, and purchased—not when it writes a pretty guide. [Expedia conversational planning](https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/) · [Expedia AI service case](https://www.expedia.com/newsroom/expedia-group-sets-the-standard-with-ai-powered-service-agent/)

A smaller opening might be “half a day in one city with children” or “a safe route after a concert.” Live facts need reliable APIs, and weather, prices, and opening hours need update timestamps.

### 3. “Let me practise, not just listen”: learning and feedback

<figure class="product-shot product-shot--portrait">
  <a href="https://blog.duolingo.com/duolingo-max/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/duolingo-roleplay.webp" alt="Duolingo Max role-play exercise in a Paris café" loading="lazy" />
  </a>
  <figcaption><strong>Duolingo Max Roleplay:</strong> the exercise is not “chat in French” but the concrete job of ordering in a Paris café. Scene, role, goal, and reward are prepared, so the learner can practise immediately.</figcaption>
</figure>

Generative AI makes a formerly expensive step available at any time: practise and receive feedback on this attempt. Duolingo Max uses role-play and video calls for language practice; Khanmigo emphasizes questions and hints rather than handing over the answer. [Duolingo Max](https://blog.duolingo.com/duolingo-max/) · [Khan Academy: Khanmigo](https://2023-2024.annualreport.khanacademy.org/khanmigo)

A product can serve one practice action: an interview answer, spoken English, a sales objection, or a thesis defense. Feedback should quote the actual answer and propose one executable change for the next attempt, not offer generic praise.

### 4. “Give me a first draft I can change”: personal creation

<figure class="product-shot">
  <a href="https://firefly.adobe.com/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/adobe-firefly.webp" alt="Adobe Firefly text-to-image workspace" loading="lazy" />
  </a>
  <figcaption><strong>Adobe Firefly:</strong> the real interface contains model, aspect ratio, content type, visual intensity, references, and several results—not only a prompt box. A creative product gives people controls for the next edit instead of one “generate again” button.</figcaption>
</figure>

For a birthday invitation, second-hand product photo, short-video cover, or club poster, the blank canvas and complex software are often the largest barrier. Canva places generation, background removal, expansion, resizing, and translation in the canvas; Firefly lets creators continue among image, video, audio, and vector assets. [Canva Magic Studio](https://www.canva.com/newsroom/news/magic-studio/) · [Adobe Firefly launch](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

Offer control, not only “generate again.” A useful opening has a defined artifact: property photos, a podcast cover, or three sizes of an event poster. Let the user lock text, people, and brand colors while AI changes one area.

### 5. “What was wrong this time?”: personalized explanation

<figure class="product-shot">
  <a href="https://blog.duolingo.com/duolingo-max/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/duolingo-explain.webp" alt="Duolingo Max Explain My Answer interface" loading="lazy" />
  </a>
  <figcaption><strong>Explain My Answer:</strong> the screen quotes the learner's answer, explains why plural vestidos takes gustan, and allows another example. It meets the exact moment “why was my answer wrong?” instead of restarting a general grammar lesson.</figcaption>
</figure>

The same answer needs a different explanation for a beginner and an expert. Explain My Answer starts from the mistake just made. This feels more natural than a separate general Q&A because the system already knows the question, answer, and learning progress. [Duolingo: Explain My Answer](https://blog.duolingo.com/explain-my-answer-now-free/)

The same pattern applies to exercise form, camera settings, a chess review, or music practice: capture one real performance, then identify the most valuable correction. “Personalized advice” without personal input is usually generic content with a name added.

### 6. “Do not just recommend—remember”: music and continuing experiences

<figure class="product-shot product-shot--mobile">
  <a href="https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/spotify-ai-dj.webp" alt="Spotify AI DJ player" loading="lazy" />
  </a>
  <figcaption><strong>Spotify AI DJ:</strong> DJ is a persistent home-screen playback entry connected directly to tracks and controls. It relies on listening history, Spotify's catalog, and the next playback action—not just a generated presenter voice.</figcaption>
</figure>

Spotify AI DJ does more than generate an introduction. It selects music from long-term listening history and joins the experience with a continuing voice. Preference data, content rights, and the playback action are harder to copy than the DJ's tone. [Spotify AI DJ](https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/) · [Deloitte: 2025 Digital Media Trends](https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html)

Other continuing moments include running, cooking, and bedtime reading. The product should adjust the next session from past choices and make correction easy rather than pretending to know the person better than they do.

### 7. “Turn a complex rule into my next step”: personal finance and life administration

<figure class="product-shot product-shot--portrait">
  <a href="https://turbotax.intuit.com/personal-taxes/mobile-apps/turbotax/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/intuit-assist.jpg" alt="Intuit Assist comparing two years of tax credits in TurboTax" loading="lazy" />
  </a>
  <figcaption><strong>Intuit Assist in TurboTax:</strong> rather than discussing tax from nothing, it compares this year's and last year's credit amounts and offers next questions such as other credits the person may claim. The foundation is personal data and the current task.</figcaption>
</figure>

Tax, credit, insurance, and bills share complex rules, scattered documents, and different next steps for each person. Intuit Assist appears inside TurboTax, Credit Karma, and QuickBooks to combine existing financial data with explanations and actions—not to provide companionship. [Intuit Assist](https://www.intuit.com/intuitassist/)

These products also carry more risk. A first version is better suited to document checklists, concept explanations, bill classification, and reminders, with facts, estimates, and suggestions clearly distinguished. Tax filing, investments, or insurance choices require user confirmation and access to professional support.

## Where to find your own business or consumer direction

The cases above teach what a use case looks like; they are not instructions to swap the industry name. Your direction is usually hidden among people, materials, and habits you can reach. Business and consumer research begin differently.

### Business: follow one role through the whole job

Business material rarely says “this is a startup opportunity.” It appears as job descriptions, procurement documents, operating manuals, software reviews, and project cases. Choose a specific role—export coordinator, property-service agent, clinic receptionist, or maintenance technician—and follow the work.

<div class="idea-routes">
  <div class="idea-route idea-route--b">
    <span>Where to look for business workflows</span>
    <ul>
      <li><strong>Job sites:</strong> learn daily responsibilities, systems, forms, and reports.</li>
      <li><strong>Tenders and procurement notices:</strong> see what companies pay to solve; acceptance criteria and boundaries are often explicit.</li>
      <li><strong>Software reviews:</strong> read low ratings on G2, Capterra, app stores, and forums for “still export to Excel” and “manually fill this every time.”</li>
      <li><strong>Company cases and annual reports:</strong> search a company with digital transformation, efficiency, or customer service to find funded projects.</li>
      <li><strong>Real work material:</strong> old tickets, quotations, checklists, help messages, and training files are often closer to a product entry point than an industry report.</li>
    </ul>
  </div>
  <div class="idea-route idea-route--c">
    <span>Queries you can use directly</span>
    <p><code>maintenance technician daily workflow</code></p>
    <p><code>property customer service tender automation filetype:pdf</code></p>
    <p><code>site:g2.com field service software reviews</code></p>
    <p><code>customer support workflow pain points report</code></p>
    <p><code>industry digital transformation case annual report</code></p>
  </div>
</div>

If export trade interests you, do not search only “AI + export.” Read coordinator vacancies and record inquiry response, quotation, specification checks, delivery reminders, and customs paperwork. Then inspect a real quotation and poor reviews of cross-border software. The strongest opening may be “after an English inquiry arrives, draft a quotation for confirmation from historical prices and product parameters,” not a universal export assistant.

### Consumer: follow a day and find repeated friction

Consumer research begins when someone reaches for a phone. Think through searching, comparing, recording, practising, waiting, and sharing. What happens every week? What is currently patched together with screenshots, notes, bookmarks, or group chat?

<div class="idea-routes">
  <div class="idea-route idea-route--c">
    <span>Where to look for consumer moments</span>
    <ul>
      <li><strong>App Store and Android stores:</strong> read one- to three-star reviews for missing features, payment drop-offs, and reasons for abandonment.</li>
      <li><strong>Social platforms and Reddit:</strong> search “how do I,” “is there a tool,” and “recommendation”; comments often add the real constraint.</li>
      <li><strong>Product Hunt and rankings:</strong> see which small action a new product solves and what reviewers want it to do next.</li>
      <li><strong>Trend and traffic reports:</strong> use Google Trends, QuestMobile, iResearch, and annual reports to confirm a durable group behavior.</li>
      <li><strong>Your own photos and bookmarks:</strong> repeated screenshots, unopened guides, and copied text are unfinished workflows.</li>
    </ul>
  </div>
  <div class="idea-route idea-route--b">
    <span>Queries you can use directly</span>
    <p><code>site:reddit.com "I wish there was an app"</code></p>
    <p><code>travel with children planning too hard</code></p>
    <p><code>budgeting app difficult reviews</code></p>
    <p><code>Product Hunt AI language learning</code></p>
    <p><code>AI application user growth report</code></p>
  </div>
</div>

If you travel often, do not immediately build an “AI itinerary.” Find why people save ten guides: a restaurant may close unexpectedly, an older companion needs fewer steps, or a concert ends late. Select one recurring moment so the product becomes a tool people open rather than a generated article.

### Do not write code as soon as you find material

Keep at least three kinds of evidence: a document that reveals the workflow, the same difficulty mentioned by three people, and an alternative for which someone already pays or spends time. Then spend sixty minutes making the idea concrete.

<div class="fieldwork">
  <div class="fieldwork__step"><b>01</b><span>Name one person</span><p>For business, state a role. For consumer, state a life situation. “Enterprise users” and “young people” are too broad.</p></div>
  <div class="fieldwork__step"><b>02</b><span>Observe one occurrence</span><p>Obtain a form, screen recording, poor review, or real operation and locate the exact blockage.</p></div>
  <div class="fieldwork__step"><b>03</b><span>Find it three times</span><p>The same problem should come from three people or sources, not one entertaining complaint.</p></div>
  <div class="fieldwork__step"><b>04</b><span>Take one step only</span><p>Define input, output, reviewer, and metric before deciding whether AI is suitable.</p></div>
</div>

Finally, describe the direction in one sentence that another person can picture:

> When **who** encounters **which moment**, they currently use **which materials or workaround** to complete **which job**. I will first let AI handle **one step**, have **whom** approve the result, and use **which change** to judge its value.

A business example:

> When a packaging-line operator sees error E37, they search a paper manual and old work orders. The system retrieves the relevant section and three diagnostic steps for that equipment model, and a maintenance engineer approves them. The pilot measures average downtime.

A consumer example:

> When a parent visits a museum with a child at the weekend, they currently assemble a route from public posts, maps, and reviews. The product creates a three-hour plan for the child's age and available time, cites opening hours and prices, and adds it to the calendar after the parent approves it.

Once your idea is this concrete, you have something that can be interviewed, prototyped, and tried with a small group.

## Sources

The list contains **67 sources**. The main text prioritizes reports with clear research methods and first-party cases. Brokerage reports are used to observe commercial themes in China, not as proof of user demand. Vendor cases may have a marketing perspective and should be checked against interviews and real operating data.

<details class="source-group">
<summary>1. Overall adoption and enterprise value (15)</summary>

1. [McKinsey：The Economic Potential of Generative AI](https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier)
2. [McKinsey：The State of AI 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)
3. [PwC：2025 Global AI Jobs Barometer](https://www.pwc.com/gx/en/issues/c-suite-insights/the-leadership-agenda/AI-jobs-barometer.html)
4. [PwC：Global Workforce Hopes and Fears Survey 2025](https://www.pwc.com/gr/en/publications/specific-to-all-industries-index/hopes-and-fears-2025.html)
5. [Deloitte：State of Generative AI in the Enterprise](https://www2.deloitte.com/us/en/pages/about-deloitte/articles/press-releases/state-of-generative-ai.html)
6. [Microsoft：2025 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born)
7. [IBM：5 Trends for 2025](https://www.ibm.com/thought-leadership/institute-business-value/en-us/report/business-trends-2025)
8. [IBM：2025 CDO Study](https://www.ibm.com/thought-leadership/institute-business-value/en-us/report/2025-cdo)
9. [Cisco：2025 AI Readiness Index](https://www.cisco.com/c/m/en_us/solutions/ai/readiness-index/realizing-the-value-of-ai.html)
10. [EY：2025 AI Pulse Survey](https://www.ey.com/en_us/insights/emerging-technologies/pulse-ai-survey)
11. [Accenture：Reinventing Enterprise Models in the Age of Gen AI](https://www.accenture.com/us-en/insights/artificial-intelligence/ai-investments)
12. [Accenture：Making Reinvention Real with Gen AI](https://www.accenture.com/us-en/insights/consulting/making-reinvention-real-with-gen-ai)
13. [OpenAI：The State of Enterprise AI 2025](https://openai.com/business/guides-and-resources/the-state-of-enterprise-ai-2025-report/)
14. [CAICT: Artificial Intelligence Development Report (2024)](https://hrssit.cn/Uploads/file/20241217/1734400434600250.pdf)
15. [CNNIC: Generative AI Application Development Report (2025)](https://www3.cnnic.cn/n4/2025/1021/c88-11391.html)

</details>

<details class="source-group">
<summary>2. Business industries, roles, and workflows (24)</summary>

16. [McKinsey：Unlocking Profitable B2B Growth Through Gen AI](https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/unlocking-profitable-b2b-growth-through-gen-ai)
17. [McKinsey：Capturing the Full Value of Generative AI in Banking](https://www.mckinsey.com/industries/financial-services/our-insights/capturing-the-full-value-of-generative-ai-in-banking)
18. [McKinsey：The AI-powered Bank—Customer Care](https://www.mckinsey.com/industries/financial-services/our-insights/the-ai-powered-bank-rewiring-for-excellence-in-customer-care)
19. [McKinsey：The Future of AI in Insurance](https://www.mckinsey.com/industries/financial-services/our-insights/the-future-of-ai-in-the-insurance-industry)
20. [McKinsey：Tackling Healthcare’s Biggest Burdens with Generative AI](https://www.mckinsey.com/industries/healthcare/our-insights/tackling-healthcares-biggest-burdens-with-generative-ai)
21. [McKinsey：Generative AI in Healthcare](https://www.mckinsey.com/industries/healthcare/our-insights/generative-ai-in-healthcare-current-trends-and-future-outlook)
22. [Deloitte：2025 Manufacturing Industry Outlook](https://www.deloitte.com/us/en/insights/industry/manufacturing-industrial-products/manufacturing-industry-outlook/2025.html)
23. [Deloitte：2025 Smart Manufacturing Survey](https://www2.deloitte.com/us/en/insights/industry/manufacturing/2025-smart-manufacturing-survey.html)
24. [Deloitte：2025 Retail Industry Outlook](https://www.deloitte.com/us/en/insights/industry/retail-distribution/retail-distribution-industry-outlook-2025.html)
25. [Deloitte：2025 Global Health Care Outlook](https://www.deloitte.com/content/dam/assets-zone1/tw/en/docs/industries/life-sciences-health-care/2025/2025-healthcare-outlook-en.pdf)
26. [Accenture：Commercial Banking Trends 2024](https://www.accenture.com/content/dam/accenture/final/accenture-com/document-2/Accenture-Commercial-Banking-Trends-2024.pdf)
27. [Accenture：Banking Trends 2026](https://www.accenture.com/us-en/insights/banking/accenture-banking-trends-2026)
28. [Thomson Reuters：2025 Generative AI in Professional Services](https://www.thomsonreuters.com/en-us/posts/technology/genai-professional-services-report-2025/)
29. [Salesforce：State of Service 2025](https://www.salesforce.com/news/stories/state-of-service-report-announcement-2025/)
30. [Salesforce：State of Sales 2026](https://www.salesforce.com/en/wp-content/uploads/sites/4/documents/reports/sales/salesforce-state-of-sales-report-2026.pdf)
31. [Adobe：2025 AI and Digital Trends](https://business.adobe.com/content/dam/dx/us/en/resources/digital-trends-report-2025/2025_Digital_Trends_Report.pdf)
32. [Adobe：2025 Content Creation and Management](https://business.adobe.com/content/dam/dx/us/en/resources/reports/content-management-digital-trends/2025-ai-and-digital-trends-content-creation-and-management.pdf)
33. [iResearch: 2025 China Enterprise AI Application Industry Research Report](https://www.bsia.org.cn/site/content/31686.html)
34. [GitHub：Quantifying Copilot’s Impact on Developer Productivity](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/)
35. [Siemens × Microsoft：Industrial Copilot](https://news.microsoft.com/source/2024/10/24/siemens-and-microsoft-scale-industrial-ai/)
36. [Abridge: Hartford HealthCare Ambient AI case study](https://www.abridge.com/press-release/abridge-hartford-healthcare)
37. [AWS: Sun Life internal knowledge assistant](https://aws.amazon.com/solutions/case-studies/sun-life-case-study/)
38. [AWS: ResultsCX customer-service automation](https://aws.amazon.com/solutions/case-studies/resultscx/)
39. [AWS: Sanofi enterprise AI assistant](https://aws.amazon.com/solutions/case-studies/sanofi-bedrock-case-study/)

</details>

<details class="source-group">
<summary>3. Deployed products and enterprise cases (10)</summary>

40. [OpenAI：Morgan Stanley](https://openai.com/index/morgan-stanley/)
41. [OpenAI：Klarna](https://openai.com/index/klarna/)
42. [OpenAI：Moderna](https://openai.com/index/moderna/)
43. [OpenAI：BBVA](https://openai.com/index/bbva-2025/)
44. [OpenAI × PwC：Reimagining the Office of the CFO](https://openai.com/index/openai-pwc-finance-collaboration/)
45. [Microsoft: Siemens field-service report](https://www.microsoft.com/en/customers/story/19736-siemens-ag-germany-dynamics-365-field-service)
46. [AWS: Legal & General document processing](https://aws.amazon.com/solutions/case-studies/aws-innovator-legal-and-general/)
47. [AWS × Infosys: healthcare insurance customer-service assistant](https://aws.amazon.com/blogs/apn/how-infosys-built-aws-generative-ai-based-assistant-for-a-healthcare-payer-company/)
48. [Notion: Notion AI feature guide](https://www.notion.com/help/notion-ai-faqs)
49. [Canva：Magic Studio](https://www.canva.com/newsroom/news/magic-studio/)

</details>

<details class="source-group">
<summary>4. Consumer products and behavior (13)</summary>

50. [Capgemini：What Matters to Today’s Consumer 2025](https://www.capgemini.com/insights/research-library/top-consumer-trends-in-2025/)
51. [Accenture：Me, My Brand and AI](https://www.accenture.com/us-en/insights/consulting/me-my-brand-ai-new-world-consumer-engagement)
52. [Deloitte：2025 Digital Media Trends](https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html)
53. [QuestMobile: 2025 China Mobile Internet Spring Report](https://www.questmobile.cn/research/report/1919961024158601218/)
54. [QuestMobile: August 2025 AI Application Industry Report](https://www.questmobile.com.cn/research/report/1967853261412208641/)
55. [iResearch: 2025 China AI App Traffic Analysis Report](https://www.etc.org.cn/UserFiles/Article/file/6388341575962762472758248.pdf)
56. [Amazon: Rufus shopping assistant](https://www.aboutamazon.com/news/retail/amazon-rufus)
57. [Expedia: conversational trip planning](https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/)
58. [Duolingo：Duolingo Max](https://blog.duolingo.com/duolingo-max/)
59. [Khan Academy：Khanmigo](https://2023-2024.annualreport.khanacademy.org/khanmigo)
60. [Spotify：AI DJ](https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/)
61. [Intuit：Intuit Assist](https://www.intuit.com/intuitassist/)
62. [Adobe：Firefly](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

</details>

<details class="source-group">
<summary>5. Chinese brokerage research (5)</summary>

63. [China Fortune Securities: commercializing AI applications after WAIC](https://pdf.dfcfw.com/pdf/H3_AP202507291717868704_1.pdf)
64. [Guosen Securities: AI special report—AI Agents](https://pdf.dfcfw.com/pdf/H3_AP202503121644302597_1.pdf)
65. [Soochow Securities: AI application adoption trends in 2025](https://pdf.dfcfw.com/pdf/H301_AP202501021641518997_1.pdf)
66. [BOC International: “AI+” applications and platforms](https://pdf.dfcfw.com/pdf/H3_AP202510201765533690_1.pdf)
67. [AIGC industry report: integrating compute, models, and application innovation](https://pdf.dfcfw.com/pdf/H3_AP202411151640914780_1.pdf)

</details>

<p class="source-footnote">Sources were retrieved and organized in August 2026. Percentages depend on samples, regions, and vendor definitions and cannot replace interviews and trial data from your target users.</p>

<style scoped>
.research-note {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 24px;
  margin: 32px 0 42px;
  padding: 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background:
    radial-gradient(circle at 8% 12%, color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent), transparent 34%),
    var(--vp-c-bg-soft);
}

.research-note__eyebrow {
  display: block;
  margin-bottom: 10px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .12em;
}

.research-note strong {
  display: block;
  font-size: 21px;
  line-height: 1.5;
}

.research-note p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.8;
}

.scene-check {
  margin: 24px 0 38px;
  padding: 18px 20px;
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 0 12px 12px 0;
  background: var(--vp-c-bg-soft);
}

.scene-check span {
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
}

.scene-check p {
  margin: 6px 0 0;
}

.product-shot {
  margin: 20px 0 30px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 14px 38px color-mix(in srgb, var(--vp-c-text-1) 8%, transparent);
}

.product-shot a {
  display: block;
  background: #f5f5f3;
}

.product-shot img {
  display: block;
  width: 100%;
  max-height: 520px;
  object-fit: contain;
}

.product-shot--portrait img {
  max-height: 560px;
}

.product-shot--mobile img {
  max-height: 520px;
}

.product-shot figcaption {
  padding: 14px 17px 16px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.75;
}

.product-shot figcaption strong {
  color: var(--vp-c-text-1);
}

.idea-routes {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(240px, .75fr);
  gap: 14px;
  margin: 24px 0 28px;
}

.idea-route {
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
}

.idea-route--b {
  background: color-mix(in srgb, var(--vp-c-brand-soft) 58%, var(--vp-c-bg));
}

.idea-route--c {
  background: var(--vp-c-bg-soft);
}

.idea-route > span {
  display: block;
  margin-bottom: 12px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
}

.idea-route ul {
  margin: 0;
  padding-left: 20px;
}

.idea-route li {
  margin: 10px 0;
}

.idea-route p {
  margin: 8px 0;
}

.idea-route code {
  white-space: normal;
  word-break: break-word;
}

.fieldwork {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin: 28px 0 34px;
}

.fieldwork__step {
  min-height: 150px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.fieldwork__step b {
  display: block;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  letter-spacing: .1em;
}

.fieldwork__step span {
  display: block;
  margin-top: 12px;
  font-size: 18px;
  font-weight: 700;
}

.fieldwork__step p {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
}

.source-group {
  margin: 12px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.source-group summary {
  padding: 16px 18px;
  cursor: pointer;
  font-weight: 700;
}

.source-group ol {
  margin: 0;
  padding: 0 22px 18px 44px;
}

.source-group li {
  margin: 8px 0;
}

.source-footnote {
  margin-top: 18px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

@media (max-width: 720px) {
  .research-note,
  .idea-routes,
  .fieldwork {
    grid-template-columns: 1fr;
  }

  .research-note {
    padding: 22px;
  }

  .fieldwork__step {
    min-height: auto;
  }
}
</style>
