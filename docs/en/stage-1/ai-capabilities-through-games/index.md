---
title: 'Beginner 1: In The AI Era, Talking Is Programming'
description: 'Build an AI-native snake game through conversation, then generalize the workflow to create your own mini game or demo.'
---

# Primary 1: AI Era, If You Can Speak, You Can Code

This is a **project-based learning** tutorial. We encourage you to follow the steps one by one and try to reproduce the results.
Don't worry about making mistakes or modifying the content. We always believe you can do it. Please always remember:

<div style="text-align: center;">
<div style="display: inline-block; padding: 8px 20px; border-radius: 8px; border: 1px dashed #FFB6C1; background: linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%); margin: 12px 0;">
  <span style="font-size: 15px; font-weight: 500; color: #666;">Completion is more important than perfection 🐣</span>
</div>
</div>

<script setup>
const duration = 'Approx. <strong>4 hours</strong>, can be completed in multiple sessions'
</script>

## Chapter Outline

<ChapterIntroduction :duration="duration" :tags="['Conversational AI Programming', 'AI-Native Mini-Games', 'Snake Game Practice']" coreOutput="AI-Native Snake + Custom Mini-Game" expectedOutput="1 playable AI-native Snake game + (Optional) 1 custom AI-native mini-game or Demo of your choice">

If you <strong>don't know how to program at all</strong>, or only know the basics, this chapter is for you. We will start from the very beginning: using <strong>conversations</strong> to have AI write code for you, without needing to memorize syntax or set up environments. It will run right in your browser.

You will personally create <strong>your first running program</strong>—a Snake game that can "eat words, write poems, and draw". Through this practical exercise, you will experience what AI programming is really like: AI is not replacing your thinking, but rather, you speak your ideas, and AI helps you implement them.

All creation starts from 0 to 1. We are glad to pass each bit of confidence and professionalism to you. For you, <strong>execution is all you need</strong>.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Dilemmas & Opportunities', description: 'New possibilities for coding' },
      { title: 'Capability Exploration', description: '60-second speed development' },
      { title: 'Native Practice', description: 'Build an AI-native Snake' },
      { title: 'Extended Creation', description: 'Create other games' }
    ]" />
  </ClientOnly>
</div>

## 1. Dilemmas and Opportunities for Ordinary People

Many people have a bunch of product ideas in their heads: a small tool to help manage finances, a webpage to record a child's growth, or even a mini-game. But the thought of having to write code or find a programmer often discourages them directly.

After the emergence of AI, for the first time, ordinary people have a completely new possibility: you don't need to know how to write code, you just need to learn how to clearly tell AI what you want. [Data from GitHub Copilot](https://www.wearetenet.com/blog/github-copilot-usage-data-statistics) shows that over 15 million developers are using AI-assisted programming, with an average of 46% of code being AI-generated! In Java projects, this proportion can reach 61%.

<el-card shadow="hover" style="margin: 20px 0; border-radius: 12px;">
  <template #header>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 20px;">🚀</span>
      <span style="font-weight: bold; font-size: 16px;">Leaps in Efficiency and Adoption</span>
    </div>
  </template>
  
  <el-row :gutter="20" style="margin-bottom: 24px;">
    <el-col :span="6" :xs="12">
      <div style="text-align: center; padding: 10px;">
        <div style="color: #409EFF; font-size: 24px; font-weight: bold;">55%</div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">Speed Increase</div>
      </div>
    </el-col>
    <el-col :span="6" :xs="12">
      <div style="text-align: center; padding: 10px;">
        <div style="color: #67C23A; font-size: 24px; font-weight: bold;">2.4 <span style="font-size: 14px;">Days</span></div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">Task Time (from 9.6)</div>
      </div>
    </el-col>
    <el-col :span="6" :xs="12">
      <div style="text-align: center; padding: 10px;">
        <div style="color: #E6A23C; font-size: 24px; font-weight: bold;">81%</div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">Day-1 Install Rate</div>
      </div>
    </el-col>
    <el-col :span="6" :xs="12">
      <div style="text-align: center; padding: 10px;">
        <div style="color: #F56C6C; font-size: 24px; font-weight: bold;">96%</div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">Suggestion Adoption</div>
      </div>
    </el-col>
  </el-row>

  <div style="line-height: 1.8; color: #606266;">
    What is truly exciting is the leap in efficiency: developers' task completion speed increased by <b>55%</b>. Code that originally took 9.6 days to deliver can now be done in just <b>2.4 days</b>. This visible improvement shows that AI is no longer just an "optional feature" but is becoming an indispensable assistant in the development workflow. The adoption rate data confirms this: on the day they granted access, <b>81%</b> of developers installed and started using it immediately; among them, <b>96%</b> started adopting the AI's code suggestions that same day. In other words, developers almost instantly integrated AI into their daily coding routines.
  </div>
</el-card>

For ordinary people, this trend is even more significant: if professional programmers are relying heavily on AI to write code, **why can't those of us who don't know how to program communicate directly with AI to realize our ideas**?

The goal of this course is to help you practice a new skill: building apps through natural language conversations. We will teach you how to communicate with AI using computer language and how to let AI turn the ideas in your head into real, usable products.

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="1" :items="[
      { title: 'Dilemmas & Opportunities', description: 'New possibilities' },
      { title: 'Capability Exploration', description: '60-second speed' },
      { title: 'Native Practice', description: 'Build AI-native Snake' },
      { title: 'Extended Creation', description: 'Create other games' }
    ]" />
  </ClientOnly>
</div>

## 2. To What Extent Can AI Help You?

In this section, we only discuss one question: if you completely don't know how to write code, to what extent can today's AI help you?

Roughly speaking, you can understand current LLM capabilities as: competent in developing **simple internal tools**, **data visualization dashboards**, and some **lightweight mini-games**. These are generally sufficient for making **tools for personal use** or validating requirements from a **product manager's perspective**. But to generate a **commercially mature product** with one click, it still typically requires manual, continuous polishing of **process design** and **details**.

Next, let's take Snake as an example and see exactly what AI programming can achieve.

### 2.1 Build a Snake Game in 60 Seconds

First, please open the experimental site used in the course, [z.ai](https://chat.z.ai/). `z.ai` is an AI platform developed by Zhipu AI (one of China's leading LLM companies), powered by their proprietary GLM models. This platform includes various features, such as slideshow generation, poster design, and full-stack development. In this tutorial, we will focus on its full-stack development module.

::: details 💡 What is the "programming right on the web" paradigm?

In the past, developing a web app required:
- Installing programming environments (Node.js, Python, etc.)
- Configuring code editors
- Learning HTML/CSS/JavaScript
- Dealing with dependencies and errors

Now, with AI coding platforms, you only need to:
- Open your browser and visit the site
- Describe your desired features in natural language
- Have AI instantly generate the code and let you preview the result live

This "conversation as programming" paradigm changes coding from "writing instructions" to "describing requirements". You don't need to care about low-level technical details; just clearly state what you want. This is the new programming paradigm of the AI era—**Vibe Coding**.
:::

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/index-2026-01-07-18-25-03.png)

Input our simple requirement and click the **Full-stack Development** button. You can watch the webpage being built in real time. Usually, it takes just the time to brew a coffee!

```
Help me create a Snake game:
1. Control snake movement with arrow keys
2. When it eats food, it gets longer and the score increases
3. Hitting walls or itself results in Game Over
4. Include Start and Restart buttons
5. The UI should be clean and elegant
```

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/index-2026-01-07-18-34-03.png)

Once generated, you will see a browsable webpage UI on the right. Scroll around or click the 🧭 button at the top to view it in full screen.

> The buttons at the top from left to right are: Arrow button expands chat history, Pencil button to start a new chat, Refresh icon to rebuild the page, Compass icon to toggle fullscreen, Download button to download the project, <> button to view code, and Publish button to publish it.

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/index-2026-01-07-18-35-11.png)

If you'd like to check the webpage's source code, click the code icon in the top right to view the entire codebase.

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image7.png)

::: tip 🌐 Explore More AI Programming Tools

Besides z.ai, we also recommend trying out these excellent AI programming platforms:

| Tool | Link | Features |
|------|------|----------|
| **Kimi Code** | [kimi.com/code/console](https://kimi.com/code/console) | Moonshot AI's AI coding assistant, offering a terminal-based Kimi Code CLI and a VS Code extension, powered by the code-specialized Kimi K2.7 Code model, and compatible with Claude Code, Roo Code, and other tools |
| **Google AI Studio** (Recommended)| [aistudio.google.com/apps](https://aistudio.google.com/apps) | Official tool from Google, powered by Gemini, great for rapid prototyping |
| **Figma Make** | [figma.com/make](https://www.figma.com/make) | Deeply integrated with design tools, ideal for interactive prototypes |
| **Coze** | [coze.com](https://www.coze.cn) | AI bot platform by ByteDance, zero-code visual building |
| **v0.dev** | [v0.dev](https://v0.dev) | AI generation for React components from Vercel |
| **Bolt.new** | [bolt.new](https://bolt.new) | AI full-stack development capable of generating deployed apps |
| **Lovable** | [lovable.dev](https://lovable.dev) | High-quality React app generation |
| **Replit Agent**| [replit.com](https://replit.com) | Online IDE integrated with AI |

For more comparisons, view the appendix: [Comparison of 7 AI Programming Tools](../../stage-1/appendix-articles/example0-1/vibe-coding-tools-snake-game-tutorial.md)
:::

### 2.2 What Conversational Programming Can and Cannot Do

This section focuses on a specific question: When relying exclusively on conversational AI and writing no code at all, how far can you push a project?
In terms of experience, a fairly consistent conclusion is: It can help you complete a "small but complete" thing, but determining "how much is enough" still requires your personal decision on every detailed step.

#### Excels at "Small and Clear" Apps

From the Snake game example, you already saw a typical pattern:
As long as you can clearly describe the UI and interaction, AI can often piece together a fully functional, clickable webpage in just a few rounds of conversations.

Such tasks often share a few characteristics:

- Clear scope: one page, a simple internal tool, a small game mechanic.
- Visible results: you immediately see if it works as expected.
- Direct debugging: you can point out errors and ask for corrections easily.

Within these boundaries, you can view the AI as a highly capable "junior assistant".

**AI's success rate in handling small-scale tasks:**
<el-progress :percentage="90" :stroke-width="15" status="success" striped striped-flow />

#### Large Projects Require a "Process Perspective"

Once it exceeds the small and clear scope, relying purely on conversational requests to build complex systems end-to-end will quickly hit ceilings. Large projects deal with backend databases, third-party services, authentication, permissions, edge cases, state management, etc.

In these situations, the logical approach is to define a clear process flowchart and break it into segments to be handled individually.

#### The Difference Between Generating and Validating

Just because AI wrote it doesn't mean it's ready for a commercial launch! Always validate AI-generated code, especially in secure systems.

::: warning ⚠️ Usage Guidelines
- **Prototypes/Tools/Demos**: Highly suitable for early stage builds iterations.
- **Large consumer-facing products**: Usually needs developers for architecture.
- **High-security systems**: Not suitable to deploy immediately. Needs stringent checks.
:::

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="2" :items="[
      { title: 'Dilemmas', description: 'New possibilities' },
      { title: 'Basic Ability', description: '60-second speed' },
      { title: 'Native Practice', description: 'Build AI-native Snake' },
      { title: 'Extended', description: 'Create other games' }
    ]" />
  </ClientOnly>
</div>

## 3. Hands-on: Your First AI Native Application

Let's do some hands-on work. We'll add some native AI integration elements into our game.

### 3.1 AI-Native Snake

You can simply provide these prompts:

> **💡 Example Prompt:** Build me a Snake game.
>
> ![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image12.png)

> **💡 Example Prompt:** Build me a Snake game that supports:
> 1. Eating different words and placing them in a collection box.
>
> ![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image13.png)

> **💡 Example Prompt:** Build a Snake game that supports:
> 1. I can eat distinct words, collected in a box.
> 2. When eating 8 words, the LLM generates a poem using them.
> 3. An image generation API is called right after the poem is composed.
>
> ![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image14.png)

If you face any issues, just screenshot the error or tell the bot what's wrong and it will iterate the changes.

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image15.png)

### 3.2 Add New Features to the Game

After completing the basic functionality, we can try adding some new twists to our program! If you find the process of the snake eating words or characters a bit boring, you can have the snake eat words of different colors and change the snake's color accordingly.

You can also add special effects to the "eating" process, or introduce magic words that trigger special effects—like increasing the snake's speed or size. Another idea is to have the model generate a poem and an image every time the snake eats a word, instead of waiting until it eats eight.

If these feel challenging, you can ask the language model directly for help! It can provide creative suggestions to make your game more fun. Give it a try!

```
1. "Word Unlocks World" Mechanic
   Feature: After the snake eats a word, the image model instantly generates a small artwork for that word, gradually piecing together a unique panorama created by the player—painting and "writing poetry" as you play.

2. "Poetry Puzzle" Gameplay
   Feature: Each word the snake eats triggers the LLM to generate a line of poetry and the image model to generate an illustration, which combine like puzzle pieces into an AI-collaborative poem and painting at the end of the round.

3. "Magic Words" & "Story Branches"
   Feature: Eating magic words like "wind", "night", or "dream" makes the LLM change the scene's theme, switching the image style to nighttime, stormy, or dreamlike atmospheres; the different words the player eats also keep the AI-generated story evolving.

4. "Real-time Interactive Generation"
   Feature: Each word eaten makes the LLM generate a line of dialogue or description, so NPCs in the game can "speak" and the environment changes accordingly; the snake's appearance and obstacles also change based on the words eaten.

5. "Sentence Snake" Challenge
   Feature: Reverse mode—the LLM gives a line of poetry or a riddle, and the player guides the snake to eat words in order to reconstruct the sentence; eating the wrong word triggers the image model to generate funny, artistic consequences.

6. "Themed Levels" & "Style Selection"
   Feature: At the start of the game, the player chooses a theme (e.g., "fairy tale", "sci-fi", "Tang poetry"), and the LLM and image model adjust the words, poetic style, and visuals to match, making every run feel fresh.

7. "Live Co-creation"
   Feature: When a special word is eaten, the LLM prompts the player to input a phrase or choose a style, then generates matching verses and illustrations, making it a true human-AI co-creation.

8. "A Growing Story"
   Feature: As the snake keeps growing, the LLM continues writing the story-poem, and the image model generates a long panoramic scroll, letting the player experience "writing, painting, and playing" all at once.
```

Additionally, we can also ask the LLM to generate project-level prompts for you directly. In the previous section, we only wrote the Snake game prompt ourselves. Now let's try having the LLM generate a prompt with an overall framework and implementation path (you can generate it directly with z.ai).

If you want to learn how to write better prompts, check out the [Prompt Engineering Appendix](/zh-cn/appendix/8-artificial-intelligence/prompt-engineering).

> I want AI to generate a web-based Snake game and need a more complete prompt to make the result more impressive and fun. Please generate the corresponding prompt. The current goal is: generate a Snake game that implements the function of eating different words to generate poetry, and should include an image generation module.

z.ai's response will look like this:

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image56.png)

We can use this prompt to regenerate the project in full-stack development mode:

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image57.png)

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image58.png)

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="3" :items="[
      { title: 'Dilemmas', description: 'New possibilities' },
      { title: 'Basic Ability', description: '60-second speed' },
      { title: 'Native Practice', description: 'Build AI-native Snake' },
      { title: 'Extended', description: 'Create other games' }
    ]" />
  </ClientOnly>
</div>

### 3.3 Try Making Other Mini-Games

Beyond Snake, we can let our imagination run wild.

Create anything we want to create, and even try to mess everything up! Then start over!

1. AI Art Gallery Platform: Help me build an online gallery where users can upload, browse, like, and comment on AI-generated artworks, with category-based browsing.
2. Retro Game Archive: Help me build a website paying tribute to classic games, featuring game history, gameplay guides, and a few classic retro mini-games that can be played online directly.
3. Sustainable Living Tracker: Help me build a carbon footprint tracker where users fill in their daily activities to get an automatic carbon emission estimate, along with eco tips and weekly challenges.
4. Virtual Kitchen Assistant: Help me build an AI cooking assistant where users enter the ingredients they have at home and get recipe recommendations with step-by-step cooking instructions.
5. Underground Music Discovery Platform: Help me build a music streaming website that highlights indie and emerging artists, supporting playlist creation and community comments.
6. Minimalist Task Management System: Help me build a minimalist task management tool that supports creating tasks, setting priorities, drag-and-drop sorting, and viewing completion progress.
7. Sci-Fi Writing Workshop: Help me build a sci-fi writing platform that provides world-building templates, character profile cards, and story outline tools to help authors build their settings.
8. Personal Knowledge Graph: Help me build a visual note-taking tool that turns scattered ideas into nodes and connects related content into a knowledge web.
9. Virtual Botanical Garden: Help me build a plant encyclopedia website featuring illustrated profiles of various plants, where users can also plant their own virtual plants and watch them grow.
10. Programming Challenge Arena: Help me build an online programming contest platform with algorithm problems of different difficulty levels, an online code editor, automatic judging, and leaderboards.

And... if you enjoy playing games, let's try creating games together!

1. 3D Open World RPG: Help me build a freely explorable 3D open-world game with a day-night cycle, dynamic weather, quest systems, and character growth.
2. First-Person Shooter (FPS) Arena: Help me build a fast-paced multiplayer FPS game supporting team deathmatch, capture the flag, multiple game modes, and multiple maps.
3. AI Chess and Multiplayer: Help me build a chess platform where I can play against AI at different difficulty levels and also match with real players online.
4. Mahjong Online Multiplayer: Help me build a traditional Mahjong game that supports multiple rule sets, private rooms, and automatic scoring.
5. Turn-Based Strategy Game: Help me build a grid-map-based turn-based strategy game with unit movement, attacking, upgrading, and fog of war.
6. Time Trial Racing Game: Help me build a 3D racing game focused on time trial gameplay, supporting multiple tracks, car customization, and ghost replays.
7. Card Battle Game (Deck Building): Help me build a card battle game where players can collect cards, freely build decks, and compete in ranked matches.
8. Battle Royale (Top-Down 2D): Help me build a top-down 2D battle royale game with a shrinking zone, random loot, and solo/squad modes.
9. Horror Survival Game (First-Person): Help me build a first-person horror survival game focused on resource management, sneaking past enemies, and finding a way to escape.
10. Music Rhythm Game (3D): Help me build a 3D music rhythm game where notes fly in from a distance to the beat of the music and players hit them at the right moment to score.

### 3.4 Curated Cases from Around the Web: What Others Have Built with AI

At this point, you might still be thinking: Snake is just an introductory example—can AI really build more complex games?

The answer is yes. Below are **8** curated real-world cases from across the web—from collections of classic arcade games and 2048-style puzzles, to recreations of *Minecraft* and *Super Mario*, and even a 3D game and an official game platform made by the Chinese LLM Kimi. Some of these developers are professional programmers, while others had zero programming experience at all, but they all share one thing in common: **they had AI write most of the code through conversation**.

#### 🕹️ Case 1: 10 Classic Arcade Games Recreated in an Afternoon (WotAI Games)

[WotAI Games](https://games.wotai.co/) is a collection of browser games built entirely from scratch with Claude Code (Vibe Coding), **without using any game engine**. Through conversation, they had AI recreate 10 classic arcade games in one go: Pac-Man, Tetris, Space Invaders, Snake, Flappy Bird, Breakout, Galaxian, Frogger, Doodle Jump, and Sudoku. Each one can be played online directly, and it even comes with a built-in leaderboard system.

![WotAI Games homepage—a collection of 10 classic arcade games](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-wotai-games.png)

![Tetris (WotAI Games, generated with Vibe Coding)](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-wotai-tetris.png)

![Pac-Man (WotAI Games, generated with Vibe Coding)](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-wotai-pacman.png)

> 🔗 Play online: [games.wotai.co](https://games.wotai.co/) ｜ Dev retrospective: [We vibe coded 10 classic arcade games with Claude Code](https://wotai.co/blog/wotai-games-vibe-coded-arcade-classics)

#### 🌸 Case 2: A Complete Beginner Made a 2048-Style Game in 2 Hours (Blooming Garden)

Japanese developer [in0ho1no](https://github.com/in0ho1no), who knew absolutely nothing about programming, used Claude through pure conversation (Vibe Coding) to build the 2048-style "flower garden" game [Blooming Garden](https://in0ho1no.github.io/2025-adhoc-blooming-garden/) in **about 2 hours**: merging identical plants to upgrade them, gorgeous blooming effects, particle animations, leaderboards, sound effects, mobile adaptation... All of these features were completed through natural language conversation, without writing a single line of code by hand.

![Blooming Garden plant-matching game (100% AI-generated)](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-blooming-garden.png)

> 🔗 Play online: [in0ho1no.github.io/2025-adhoc-blooming-garden](https://in0ho1no.github.io/2025-adhoc-blooming-garden/) ｜ Source code: [github.com/in0ho1no/2025-adhoc-blooming-garden](https://github.com/in0ho1no/2025-adhoc-blooming-garden)

#### 🌍 Case 3: A Designer Used AI to Build a 3D Online Multiplayer Game (Planet Jumper)

Designer [Ricardo de Zoete (Hammy)](https://x.com/RicardoDeZoete) used OpenAI's AI through pure conversation (Vibe Coding) on top of three.js to build [Planet Jumper](https://gamesbyhammy.cloud/play/planetjumper)—a **3D multiplayer platformer**: run, dash, and jump across the surface of a small spherical planet, competing online against strangers in the same arena. Systems that are far from simple—spherical gravity, networked synchronization, and jump feel—were all "chatted" into existence with prompts.

![Planet Jumper 3D multiplayer platformer (generated with Vibe Coding)](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-planet-jumper.png)

> 🔗 Play online: [gamesbyhammy.cloud/play/planetjumper](https://gamesbyhammy.cloud/play/planetjumper) ｜ Detailed write-up: [Planet Jumper: A Vibe-Coded Three.js Multiplayer Platformer](https://www.webgpu.com/showcase/planet-jumper-threejs-multiplayer/)

#### 🎮 Case 4: One Person Built 100 Browser Games with Vibe Coding (2026)

In July 2026, Chinese community developer [wangzifan396-wzf](https://github.com/wangzifan396-wzf) open-sourced [mini-browser-games](https://github.com/wangzifan396-wzf/mini-browser-games)—**100 browser mini-games built and continuously polished by one person with Vibe Coding**, all as zero-dependency single HTML files that run with a double-click. The gameplay spans action, strategy, tower defense, management, card games, physics, deduction, racing, rhythm, board games, and puzzle genres, and quite a few of them have already reached full product-level depth with multi-chapter campaigns, progression systems, and save-code cross-device sync. The entire project is open-sourced under the MIT license, and the online catalog lets you start playing right away.

![Online catalog of 100 browser games (a Vibe Coding open-source project from 2026)](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-100-games.png)

![Neon 2048: a six-chapter, 18-node expedition + multiple modes and a tool system](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-100-games-neon2048.png)

> 🔗 Online catalog: [wangzifan396-wzf.github.io/mini-browser-games](https://wangzifan396-wzf.github.io/mini-browser-games/) ｜ Source code: [github.com/wangzifan396-wzf/mini-browser-games](https://github.com/wangzifan396-wzf/mini-browser-games) ｜ Creation retrospective: [I Built 100 Browser Games with Vibe Coding and Open-Sourced All of Them](https://blog.csdn.net/m0_74023007/article/details/162945755)

#### ⛏️ Case 5: A Minecraft Remake Made for the Creator's Nephews (CraftMine, 2026)

In February 2026, developer [Trent Sterling](https://tront.xyz/blog/posts/craftmine/) wanted to let his nephews play *Minecraft*, but they didn't own the official game, so he simply opened a blank HTML file and used Claude Code through pure conversation to build [CraftMine](https://tront.xyz/craftmine/)—a **6,820-line, single-file** web-based *Minecraft* remake: 46 block types (plus 21 DOOM hell-themed blocks), 36 creatures (from chickens to a Titan boss with 300 HP), 19 weapons (including the BFG 9000), 5 biomes, a day-night cycle, and even **P2P multiplayer**. There's no build step—open the webpage and play.

![CraftMine: a Minecraft remake, 6,820 lines in a single file (generated with Vibe Coding)](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-craftmine.png)

> 🔗 Play online: [tront.xyz/craftmine](https://tront.xyz/craftmine/) ｜ Dev retrospective: [CraftMine: A 6,820-line vibe-coded Minecraft clone in one HTML file](https://tront.xyz/blog/posts/craftmine/)

#### 🍄 Case 6: A Super Mario with AI-Generated Infinite Levels in Real Time (2026)

In March 2026, a developer combined an open-source version of *Super Mario* with OpenAI's models to build [AI Super Mario](https://supermario.leanmcp.live/): you can play the classic original levels, or let AI **generate new levels in real time**—in "Infinite Mode", AI dynamically generates brand-new scenes and enemies as you advance, and in testing it could be played continuously for 45 minutes. You can even type text directly in the game to ask AI to add enemies, place platforms, or change the theme.

![AI Super Mario: three ways to play—classic, AI levels, and infinite mode](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-ai-mario-menu.png)

![Mario gameplay with levels generated in real time by AI](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-ai-mario-gameplay.png)

> 🔗 Play online: [supermario.leanmcp.live](https://supermario.leanmcp.live/) ｜ Detailed write-up: [OpenAI and Idiomorph Power Infinite Mario Level Generation in Browser](https://www.thenextgentechinsider.com/pulse/openai-and-idiomorph-power-infinite-mario-level-generation-in-browser)

#### 🇨🇳 Case 7: One Prompt Made the Chinese LLM Kimi K3 Build a 3D Game (2026)

In July 2026, developer [Dr. Josh Simmons](https://www.drjoshcsimmons.com/writing/kimi-k3-built-the-game-i-still-had-to-play-it) sent just one prompt to the Chinese LLM **Kimi K3**, and it built a playable first-person 3D game: collect data cores in a procedurally generated server facility, dodge patrolling drones, and take a freight elevator down three floors. The entire game was playable in a single generation, and after two rounds of conversation to fix two bugs, it could be completed smoothly—all for about **2 US dollars**.

![The 3D server-facility game generated by Kimi K3 from a single prompt](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-kimi-k3-game.png)

> 🔗 Play online: [kimi-test-theta.vercel.app](https://kimi-test-theta.vercel.app/) ｜ Source code: [github.com/jcpsimmons/kimi-test](https://github.com/jcpsimmons/kimi-test) ｜ Dev retrospective: [Kimi K3 Built the Game. I Still Had to Play It.](https://www.drjoshcsimmons.com/writing/kimi-k3-built-the-game-i-still-had-to-play-it)

#### 🎯 Case 8: K399, Kimi's Official Game Platform—Dozens of AI Games to Play Online (2026)

On July 17, 2026, Moonshot AI released the Kimi K3 model and, at the same time, launched the browser game platform [K399](https://www.k399.games/)—where dozens of games were all made with the K3 model and can be played with one click. The genres span 3D shooters, rhythm games, side-scrolling action, court-intrigue AVGs, 3D puzzles, and even open-world games: alongside works that recreate classic gameplay like *The Legend of Zelda*, *Black Myth: Wukong*, *Bubble Land*, and *Vampire Survivors*, there are also original games far beyond demo-level completeness, such as *Pioneer Practice Ground* (a 3D FPS with movement, jumping, sliding, aiming, and shooting), the open-world *SpiderPunk*, and the court-intrigue AVG *Fengque Shen Gong* with a five-chapter main story, eight side quests, and 32 random events.

![K399 platform interface—K3 Game Arcade, click any game to play instantly](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-k399-platform-live.png)

![SpiderPunk, an open-world game on K399: swinging between cyberpunk skyscrapers on spider webs (generated by the K3 model, actual gameplay footage)](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-k399-spiderpunk.png)

> 🔗 Play online: [k399.games](https://www.k399.games/) (K3 Game Arcade, play with one click) ｜ Detailed write-up: [A Former miHoYo Executive Joined, and the Hottest AI Company Suddenly Made Dozens of Games](https://eu.36kr.com/zh/p/3906895998178441) ｜ [Kimi K3: Who's Getting Nervous?](https://36kr.com/p/3905392402748801)

After seeing these cases, you'll realize: **Snake is just the tip of the iceberg when it comes to AI programming**. Whether it's classic arcade games, 2048 puzzles, 3D games, recreations of *Minecraft* and *Super Mario*, collections of a hundred games, or even an official game platform from a Chinese LLM, as long as you can clearly describe your ideas and are willing to polish them through multiple rounds of conversation, AI can help you build them from 0 to 1. Next up, it's your turn!

## 📚 Assignment

<el-card id="assignment-card" shadow="hover" style="margin: 20px 0; border-radius: 12px;">
  <template #header>
    <div style="font-weight: bold; font-size: 16px;">🎯 Chapter Assignment: Build Your First AI-Native Mini-Games</div>
  </template>

  <p>
    In this section, you've followed the steps to experience the complete process from "conversational Snake generation" to "understanding AI-native game design thinking." The following assignments will help you turn this understanding into real skills.
  </p>

  <ol>
    <li>
      <strong>Fully Reproduce the AI-Native Snake Game</strong>
      <ul>
        <li>At minimum, implement: the snake can move, eating "food" changes its length and score, and hitting walls or itself ends the game.</li>
        <li>During reproduction, practice sending the error description + error message + key code snippets all at once to the AI, asking it to fix things in "beginner mode."</li>
      </ul>
    </li>
    <li>
      <strong>(Optional) Create 1 Original AI-Native Mini-Game or Demo</strong>
      <ul>
        <li>It can be any lightweight gameplay involving text, images, music, rhythm, etc., such as "eat words to write poems," "rhythm clicking," "generative runner," etc.</li>
        <li>The focus isn't on flashy graphics, but on being able to clearly articulate: what specifically did AI help with here, and what "hard-to-do-manually or tedious" part did it solve.</li>
      </ul>
    </li>
  </ol>

  <p>
    That's the complete tutorial! You may need about <strong>4 hours</strong> to finish all the content and build your own Snake game. Don't rush—explore, experiment, and enjoy the process. If you encounter concepts you don't quite understand along the way, we recommend checking the relevant sections in the appendix below.
  </p>
</el-card>

## Appendix

<el-card id="appendix-nav" shadow="hover" style="margin-top: 24px; margin-bottom: 24px; border-left: 5px solid #67C23A;">
  <div style="font-weight: bold; margin-bottom: 8px;">Appendix Navigation</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    Here we've compiled some foundational concepts related to this chapter: if you encounter questions like "what is frontend?" or "what exactly does Vibe Coding mean?" during your learning, you can always come back here to look them up.
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <a href="#appendix-1" style="text-decoration: none; color: inherit;"><b>Appendix 1: Do We Need Frontend Knowledge?</b></a><br/>
      <span style="font-size: 12px; color: #909399">Understand where frontend fits in the overall application, and know which parts are "visible."</span>
    </el-col>
    <el-col :span="12">
      <a href="#appendix-2" style="text-decoration: none; color: inherit;"><b>Appendix 2: What Exactly is Vibe Coding</b></a><br/>
      <span style="font-size: 12px; color: #909399">Understand the core idea of "conversational development" and how to collaborate with AI.</span>
    </el-col>
  </el-row>
  <el-row :gutter="16" style="margin-top: 10px;">
    <el-col :span="12">
      <a href="#appendix-3" style="text-decoration: none; color: inherit;"><b>Appendix 3: Model Context</b></a><br/>
      <span style="font-size: 12px; color: #909399">Understand commonly heard but easily confused concepts like "context length."</span>
    </el-col>
    <el-col :span="12">
      <a href="#appendix-4" style="text-decoration: none; color: inherit;"><b>Appendix 4: Instruction Following</b></a><br/>
      <span style="font-size: 12px; color: #909399">Learn why models sometimes "don't understand" and how to write clearer instructions.</span>
    </el-col>
  </el-row>
  <div style="margin-top: 12px; font-size: 12px; color: #909399;">
    Tip: You can press Ctrl/⌘+F to search for keywords, or copy confusing paragraphs to AI and ask it to explain again in a way "a complete beginner can understand."
  </div>
</el-card>

## <span id="appendix-1">[Appendix 1: Do We Need Frontend Knowledge?](#appendix-nav)</span>

::: tip 💡 One-line Summary
You don't need to write code, but understanding the basic concepts helps you describe requirements to AI more effectively.
:::

<el-row :gutter="16" style="margin: 20px 0;">
  <el-col :span="12" :xs="24" style="margin-bottom: 16px;">
    <el-card shadow="hover" style="border-radius: 12px; height: 100%;">
      <template #header>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">👁️</span>
          <span style="font-weight: bold;">Frontend</span>
          <el-tag type="success" size="small">Visible</el-tag>
        </div>
      </template>
      <div style="color: #606266; line-height: 1.8;">
        Everything users can <strong>see and click</strong>
        <ul style="margin: 12px 0; padding-left: 20px;">
          <li>Page titles, text, images</li>
          <li>Buttons, input fields, dropdown menus</li>
          <li>Game interfaces, animation effects</li>
        </ul>
      </div>
    </el-card>
  </el-col>
  <el-col :span="12" :xs="24" style="margin-bottom: 16px;">
    <el-card shadow="hover" style="border-radius: 12px; height: 100%;">
      <template #header>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">⚙️</span>
          <span style="font-weight: bold;">Backend</span>
          <el-tag type="info" size="small">Invisible</el-tag>
        </div>
      </template>
      <div style="color: #606266; line-height: 1.8;">
        Data processing running on the server
        <ul style="margin: 12px 0; padding-left: 20px;">
          <li>User score storage</li>
          <li>Login account verification</li>
          <li>Level content distribution</li>
        </ul>
      </div>
    </el-card>
  </el-col>
</el-row>

### The Frontend Trio

Think of a webpage as a house. Three types of "code" each handle one thing:

- **HTML**: decides **what's on** the page — like drawing the house blueprint first
- **CSS**: decides **how it looks** — like painting walls and arranging furniture
- **JavaScript**: decides **how it reacts** — like a light switch: press it and the light turns on

### How Does Code Become a Page?

The browser **builds the frame with HTML, decorates with CSS, and switches on the power with JavaScript** — three steps, and there's your webpage.

### So What Are React and Vue?

They're **"prefab tools" for building complex pages** — faster and more reliable. You don't need to learn them; just know they're helpers.

### In Vibe Coding

**No code writing, just describing.** Talk to AI in plain language, for example:

> "Use React to make a leaderboard page, with a score list on the right. Clicking a row shows player details below. Clean, modern style."

To learn more, check out the [Web Basics Appendix](/zh-cn/appendix/3-browser-and-frontend/javascript-deep-dive) and the [Frontend Evolution Appendix](/zh-cn/appendix/3-browser-and-frontend/frontend-frameworks).

## <span id="appendix-2">[Appendix 2: What Exactly is Vibe Coding](#appendix-nav)</span>

> 💡 What is Vibe Coding? Computer scientist [Andrej Karpathy](https://karpathy.ai/) (one of the co-founders of OpenAI, former head of AI at Tesla) coined the term **vibe coding** in February 2025. This concept refers to a coding methodology that relies on LLMs, **allowing programmers to generate working code by providing natural language descriptions instead of manually writing code.**

![1767350588191](../../../zh-cn/stage-1/ai-capabilities-through-games/images/1767350588191.png)

Literally, Vibe Coding can be understood as a way of "developing by talking." The core change is: you no longer need to write code line by line, look up syntax, or debug yourself. Instead, you directly describe what you want in natural language, for example:

"I need a login page with a phone number input field and a verification code input field."
"After successful login, redirect to the homepage and display the username in the top right corner."
"Give me a simple Snake game that can be controlled with keyboard arrow keys."

The Large Language Model (LLM) will automatically translate these descriptions into real, runnable code and generate the corresponding pages, logic, and data structures. After you see the results, you can propose modifications in natural language, such as "make the button bigger," "change the background to dark," "record scores and display a leaderboard," and the AI will continue adjusting the implementation according to your requirements.

In this mode, you don't need to learn a programming language first before writing code. Instead, you focus your main energy on: clearly stating what you want to do, judging "what's wrong" after seeing the results, and then proposing new modifications. AI handles turning these high-level ideas into concrete implementations, significantly reducing mechanical, repetitive coding work.

You can click here to learn more about vibe coding: [https://www.ibm.com/think/topics/vibe-coding](https://www.ibm.com/think/topics/vibe-coding)

You can click here to see more of Karpathy's shared content: [https://karpathy.bearblog.dev/blog/](https://karpathy.bearblog.dev/blog/)

### How to Pretend You're a Vibe Coding Master

In practice, during real vibe coding, we usually don't use many complex prompts. Perhaps we need a specific and moderately complex prompt for the entire program at the beginning, but after that, at each step, you may only need prompts like these:

```
"There's a bug in the code, please fix it."
"I don't want partial code, give me the complete modified code."
"Your code still has problems."
"Please modify again and give me the complete corrected code."
"It was working before, why isn't it working now?"
"Did you not understand what I meant? Don't change my original code."
"Don't add any debugging features."
"Don't do things I didn't ask you to do."
"Where is the feature I asked you to implement?"
"Can you not understand what I'm saying?"
"I only want one function."
"I told you to refer to my previous code."
"Please don't add unnecessary comments."
"Please don't modify the basic logic of my original code."
"Help me modify the code."
"Modify based on my code..."
"Don't change my variable names!!!"
"Don't change the original function names!"
"Don't mess with my variables."
"Don't add extra features."
"Don't just generate a skeleton, generate the complete code."
```

This may sound a bit exaggerated, but in reality, these are the prompts we might use in daily work. Due to the **context length limitations** of large language models, or sometimes because their **instruction following ability** isn't very strong, models may forget content discussed earlier in the conversation. In vibe coding, we tend to use models with long context and strong instruction following ability. We can judge whether a model is good through rankings or metrics of these two aspects.

Alternatively, due to the style of training datasets, large models tend to respond in the style of their training data. For example, some speak very seriously, some like to add lots of embellishments, and some models like to add lots of comments or unnecessary modules to code.

## <span id="appendix-3">[Appendix 3: Model Context](#appendix-nav)</span>

Model context can be understood as AI's short-term memory. It refers to all the text content that the model can "see" and "remember" during a single conversation or task, including your previous questions, system-provided instructions, relevant materials, etc.

It is precisely because of context that AI can understand you're continuing from previous content, enabling round after round of coherent, natural conversation. Without context, every sentence you say would appear to the model as a completely new question—it wouldn't know what you said before, and there would be no way to continue a conversation.

Each model has its own effective context length (context window). This length is usually measured in tokens (which can be roughly understood as units of "word fragments"), and most mainstream models currently range from 32k to 128k tokens. The longer the context, the more content the model can "read" at once, for example:

- Reading an entire lengthy paper or report in one go
- Referencing multiple materials and cases in the same conversation
- Having the model remember conclusions from complex discussions several rounds ago

When your input approaches or exceeds the model's context limit, some common phenomena often appear:

- The model starts forgetting details or key information from earlier in the long text
- As the conversation progresses, the topic gradually drifts from the original goal
- Across different Q&As about the same material, the referenced content becomes inconsistent

These phenomena don't mean the model suddenly "got dumber"—they are natural results of the context capacity being used up or nearly used up.

In practical use, we want the context to be as long as possible, while also being aware that:

- The longer the context, the more computing resources it consumes
- The corresponding API costs (fees) also increase accordingly

Therefore, when designing AI applications, you need to balance letting the model see enough information with controlling costs and improving efficiency. For example:

- Distill information that truly needs long-term retention before feeding it to the model
- Avoid stuffing detail information that's no longer needed into the context repeatedly
- Use external knowledge bases and similar approaches to hand "long-term memory" to the system rather than forcing it into the model's context

## <span id="appendix-4">[Appendix 4: Instruction Following](#appendix-nav)</span>

Instruction following refers to: after the model understands your instructions, whether it can accurately and completely execute according to your requirements. This includes not only answering questions, but also completing tasks in specified formats, styles, and steps.

For example, the following are all instructions with clear requirements for the model:

- Summarize this article into three key points
- Write a reply email in a formal, polite tone
- Translate this word into English and create an example sentence for each
- Extract the author, time, and main events from the article

A model with strong instruction following ability typically has these characteristics:

- Outputs content in the required quantity
  For example, if asked to summarize three key points, it won't give five.
- Covers all specified elements
  For example, if asked to extract author, time, and events, it won't omit any of them.
- Follows the specified format and tone
  For example, if asked to use a formal tone, it won't output overly colloquial responses.
- Doesn't make unnecessary additional extensions
  For example, if only asked to translate and create sentences, it won't output a large paragraph of unrelated explanations.

In practical applications, strong instruction following ability is very important for these reasons:

- Improved stability: The same instruction produces more consistent output structure and behavior patterns across different times and multiple runs, less likely to go off-script
- Improved reproducibility: When you configure a prompt into a product or workflow, you can predict roughly how the model will respond, making testing and iteration easier
- Easier system integration: When model output conforms to expected formats, it's easier to automatically interface with backend programs, workflows, or other tools

Therefore, when selecting and evaluating a large language model, in addition to focusing on whether it's smart and has broad knowledge coverage, you also need to pay special attention to its instruction following ability. For industrial-grade applications, being able to stably and accurately execute instructions is often more important than occasionally giving a stunning answer.
