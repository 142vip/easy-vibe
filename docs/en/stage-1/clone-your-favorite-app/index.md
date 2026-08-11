---
title: 'Clone from a Screenshot: Your First Imitation Exercise'
description: 'Follow a classroom-style exercise that turns one product screenshot into a working webpage or mini-game.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'

const duration = 'About <strong>2 hours</strong>'
</script>

# Clone from a Screenshot: Your First Imitation Exercise

In the previous lesson, we asked AI to write a program from one sentence. This time we will begin with something easier to see: **choose a screenshot you like and ask AI to build from it**.

A screenshot already shows the colors, spacing, buttons, and overall layout. Your job is to decide what kind of working page you want it to become.

## What you will make

<ChapterIntroduction :duration="duration" :tags="['Screenshot', 'AI coding', 'Beginner practice']" coreOutput="One small project" expectedOutput="A webpage or mini-game that opens and responds to input">

You will choose one real product or game screenshot, give it to Trae, and make a small project that runs in the browser. We will first get a visible result, then improve one clear problem at a time.

</ChapterIntroduction>

## 1. Choose one small target

For a first exercise, one screen is enough. Pick one of these:

- a product landing page with a heading, image, and button;
- a SaaS dashboard with navigation, cards, and charts;
- a small game with movement or one simple objective.

Choose a screenshot whose main content is easy to recognize. Keep the original image so you can place it beside your result later.

## 2. Follow the first example

The reference below comes from Framer. Its navigation, large title, purple landscape, and small controls are all visible in one frame.

![Framer page used as the classroom reference](../../../zh-cn/stage-1/clone-your-favorite-app/images/framer-official-interface.jpg)

_Reference: [Framer Website Builder](https://www.framer.com/solutions/website-builder/)_

Create an empty folder, open it in Trae, and drag the screenshot into the chat. Then say:

```text
Build a webpage that looks like this image. Open it for me when it is ready.
```

Wait until Trae finishes creating and starting the files. This is the page produced during the lesson:

![Website generated and run from the Framer reference](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-wishlabs.gif)

Do not inspect every line of code yet. First check three visible facts: the page opens, the main content appears, and the layout resembles the reference.

If the heading is too small, make one short request:

```text
Make the heading in the center larger.
```

Reload the page and compare again. This rhythm—look, describe one problem, and check again—is the main exercise.

## 3. Make your own version

Open another empty folder and repeat the same steps with your screenshot:

1. Drag the image into Trae.
2. Check that the image appears in the message.
3. Ask Trae to build the page.
4. Let Trae start it, then open the result yourself.

You can begin with:

```text
Build a webpage based on this image. Open it when it is ready.
```

If you only want the visual style, add:

```text
Use the style of the image, but replace its name and content with something new.
```

## 4. Try a dashboard or a game

The same method works beyond landing pages.

### A SaaS dashboard

Linear's dashboard has a clear left navigation area and a main area for cards and charts.

![Linear dashboard reference](../../../zh-cn/stage-1/clone-your-favorite-app/images/linear-official-dashboard.png)

_Reference: [Linear Dashboards](https://linear.app/docs/dashboards)_

The prompt used in class was:

```text
Build a dashboard like this one. Use sample data for now.
```

The generated project could already switch sections and display cards and charts:

![Dashboard generated and run in class](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-linear-dashboard.gif)

### A block game

The next reference is a Minecraft scene.

![Minecraft Creative Mode reference](../../../zh-cn/stage-1/clone-your-favorite-app/images/minecraft-official-creative-mode.png)

_Reference: [Minecraft example on Microsoft Learn](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108)_

For a simple 2D version, say:

```text
Build a block game like this. Let the character move and place blocks.
```

![2D block game generated and run in class](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-block-game.gif)

If you want a first-person world, say **3D** explicitly:

```text
Build a 3D block game like this. Let me walk, look around, and place blocks.
```

![3D block game generated and run in class](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-3d-block-game.gif)

2D is easier to finish. Choose 3D only when moving forward and backward inside the world is part of your goal.

## 5. Improve one problem at a time

The first version does not need to be perfect. Point to the most obvious problem and describe it in ordinary language:

```text
The top card is too tall. Make it shorter.
```

```text
This button does nothing. Please fix it.
```

```text
This is the current result. Compare it with the reference and fix the biggest difference.
```

After each change, reopen the page and test it yourself. Avoid listing five unrelated problems in one message, because you will not know which change caused the result.

## 6. Check the finished exercise

Before submitting, verify the actual page rather than only looking at a screenshot:

- it still opens after a refresh;
- another person can tell whether it is a website, dashboard, or game;
- the main button or game control works;
- a narrower window does not make the text and images overlap badly.

<StageAssignmentCard title="Build your own page from one screenshot">

  <p>Choose one webpage or game image and ask AI to reproduce only that screen.</p>

  <ol>
    <li>Keep the reference screenshot.</li>
    <li>Generate the first version, then improve one visible problem.</li>
    <li>Save a screenshot of the revised result.</li>
  </ol>

  <p>Present the reference and your result side by side, and explain the one change you made.</p>
</StageAssignmentCard>

## What to remember

The workflow is short: choose a screenshot, give it to AI, describe the page in one sentence, and improve whatever looks wrong. The image explains how the product should look; your words explain what it should do. Once the first version runs, each new observation becomes the next small step.
