# Fundamentals of Graphics and Animation: Canvas and Related Technologies

::: tip Core Question

Early web pages could only display plain text and images. But if you want to create a Breakout game, gorgeous dynamic effects, or a freely draggable data report, relying solely on `<div>` is far from enough. That's exactly why **Canvas** was born.

This guide will take you from drawing your first line all the way to building a particle engine that runs smoothly at 60 FPS in the browser.

:::

---

## 1. Overview of Canvas

If early web pages were static models assembled from **LEGO bricks** (HTML tags), then the HTML5 `<canvas>` tag is like handing you a **giant digital canvas**, along with a code-controlled **paintbrush**, and leaving the rest to your creative freedom.

There are no tag structures in the drawings here. Once you paint something with the brush, it immediately becomes pure **"pixel pigment"**.

### 1.1 Canvas vs SVG: Two Different Schools of Artists

In the frontend drawing world, Canvas has a rival called **SVG**. They represent two completely different approaches to drawing:

- **Canvas (Bitmap Drawing Board):**
  - **Principle**: Like actually painting on real paper — a few strokes become a blob of pigment (pixels).
  - **Advantage**: The computer just "splashes paint" onto the screen — performance takes off! Can simultaneously render thousands of bouncing, flashing particles.
  - **Disadvantage**: Once drawn, you can't individually undo anything (can't select via DOM nodes), and zooming in causes mosaic blurriness.
- **SVG (Vector Graphics Assembly):**
  - **Principle**: Like making a PowerPoint. You draw a circle, and it generates an independent "circle entity" tag on the canvas.
  - **Advantage**: Whether zoomed in 100x or 100,000x, it's always razor sharp. Each shape is an independent DOM node — you can change its color with CSS and JS or bind click events at any time.
  - **Disadvantage**: If you try to have tens of thousands of objects flying around, the heavy DOM tree and layout engine will freeze the browser.

**Simple summary: For dynamic games and cool particle effects, use Canvas; for precise logos and interactive charts, use SVG.**

---

## 2. The First Stroke: Understanding the Counter-Intuitive Coordinate System

### 2.1 Motivation for This Paper Upside Down

When you're ready to start drawing, you first need to understand that the ruler in Canvas is inverted. In a traditional math class coordinate system, the zero point is in the center, and values increase as you go up. But in computer screen displays, almost all devices define the "origin (0, 0)" at the **top-left corner of the screen**. Moving right increases the X-axis — no problem there — but **moving down increases the Y-axis**.

**Core Principles of the Canvas Coordinate System:**
- **Native unit**: Pixels (px), corresponding 1:1 to screen physical pixels.
- **X-axis**: Positive direction is right, from `0` to `canvas.width`.
- **Y-axis**: Positive direction is down, from `0` to `canvas.height`.

👇 Drag the small dot below to intuitively feel the coordinate origin and direction in computer graphics:

<CoordinateSystemDemo />

### 2.2 Seasoning Your Magic Paintbrush

With the coordinate system in place, we can summon the paintbrush (called `Context`, or abbreviated `ctx` in code). Just like painting with a real palette, the Canvas API design perfectly follows three steps of physical painting:

1. **Color Mixing (State)**: Set fill color with `fillStyle`, stroke color with `strokeStyle`.
2. **Shaping (Path)**: Decide whether you want to draw a line (`lineTo`), a circle (`arc`), or a rectangle (`rect`).
3. **Minimal Strokes (Render)**: Decide whether to fill the interior (`fill()`) or outline the edges (`stroke()`).

Since Canvas is a pure bitmap canvas with "no regrets once drawn," once you paint, it immediately dries into pixels and cannot be undone as independent objects.

👇 Try selecting different shapes and colors in the demo below to see how the underlying code executes the "three-step" process described above:

<CanvasBasicsDemo />

---

## 3. Flipbook Animation: How to Make Graphics Move Incredibly Smoothly

Since Canvas becomes permanent pixels once filled, how are all those characters running around the screen in HTML5 games made?

The answer is **"tricking your eyes."** This works exactly like flipbooks or film reels.

1. **Erase the Board (Clear)**: Use `clearRect()` to mercilessly clear the entire canvas.
2. **Calculate New Position (Update)**: Sneakily add 2 pixels to the character's X coordinate.
3. **Redraw (Render)**: Paint the character at its new position.
4. **Crazy Loop**: Combine with the browser's built-in precision metronome `requestAnimationFrame`. It repeats these three actions at the display's refresh rate (typically 60 times per second, i.e., 60 FPS).

Due to the human eye's "persistence of vision," during 60 per-second cycles of [Erase -> Update -> Redraw], what you see is not a flickering blackboard but animation smooth as silk.

👇 Adjust the playback speed in the demo below and observe how the displacement of each frame connects into fluid motion:

<AnimationLoopDemo />

---

## 4. Blind Man's Bluff: Approach to handling Click Interactions in Canvas

Because the Canvas is seen by the browser as a "pigment cloth" with no structure. Suppose you draw a monster with `arc()` on the canvas, and you want to implement "click monster to deal damage" — you **simply cannot** use traditional `document.getElementById` to get this monster. Because in the HTML structure, there's only that rigid `<canvas>` tag that's 600 pixels wide.

This is the most classic problem in graphics programming: **Collision Detection and Event Delegation**.

Since the browser only knows your mouse clicked the Canvas screen coordinates `(x, y)`, you need to reverse-calculate using middle school geometry:
- **For circles**: Use the Pythagorean theorem to calculate the distance from the `mouse click point` to the `circle center position`. If the distance is less than the radius, it was "hit."
- **For rectangles**: Check if the clicked `x` is within the rectangle's left and right boundaries, and simultaneously if `y` is within the top and bottom boundaries.

No matter how many elements are on your canvas, mouse hover or click events are always bound to the Canvas as the sole container — this is the ultimate "event delegation."

👇 Try using the mouse (click, drag, hover) or keyboard (arrow keys to move) below to experience this low-level interaction logic of "manually calculating distances":

<EventHandlingDemo />

---

## 5. Liberating Computing Power: Particle Systems and Visual Magic

At this point, when we combine "coordinate systems," "animation loops," and "colors and shapes," and multiply their count to hundreds or thousands of tiny fragments, you've mastered the ultimate visual weapon: **Particle Systems**.

Its core approach is incredibly simple yet effective:
1. Create a massive array filled with hundreds of independent "particle objects."
2. Each object has its own lifecycle (`life`), velocity (`vx/vy`), and gravity damping (`gravity`).
3. Each time `requestAnimationFrame` fires, iterate through and update these hundreds of particles, render them, and silently clean up those that are "dead" (lifetimes exhausted or fallen off screen).

Your browser can instantly become a dream factory producing fireworks, snowstorms, and explosions.

👇 Click different effects, adjust gravity and particle count, and observe how they present complex swarm visuals through the simplest physics and math formulas:

<ParticleSystemDemo />

---

## 6. Guarding FPS Glory: Approach to handling an Overheating CPU

Making thousands of objects calculate and redraw 60 times per second is extremely performance-intensive. Without proper technique, your computer fan will soon take off.

Here are the "body-guard techniques" that real engine experts use to rescue frame rates:

1. **Partial Erasure (Dirty Rectangle):**
   When a character runs across a vast grassland, never `clearRect` the entire grassland every frame! Only use a "small eraser" on the specific small area the character passed through and redraw there — performance immediately skyrockets exponentially.

2. **Behind-the-Scenes Stunt Double (Offscreen Canvas):**
   If the background has a complex starry sky with elaborate mountains, rendering it in real-time every time is foolish. We typically secretly create an invisible `<canvas>` in memory and paint the beautiful background onto it once. In subsequent frame refreshes, we simply use `drawImage()` to paste this composited "static negative" directly, eliminating massive base calculations.

3. **Batch Brush Washing (Batching):**
   Switching from red to blue in the palette is expensive at the low level. If the canvas has 1,000 red circles and 1,000 blue circles scattered alternately, the fastest approach is: prepare the red paint first, iterate and paint all red circles, then switch to blue paint and paint all blue circles. This is the famous Batch Rendering concept.

👇 Pull the object count above 3,000 and watch the webpage plummet into the abyss of lag, then sequentially turn on the "optimization techniques" switches in the bottom right to witness real frame rate rescue firsthand:

<PerformanceDemo />

---

## 7. Terminology Summary

| Term | Plain Explanation |
| --- | --- |
| **Canvas** | The 2D canvas provided by HTML5. Extremely fast rendering, but once drawn, everything becomes pixel pigment — DOM operations cannot manipulate the content. |
| **SVG** | Vector graphics. Never blurs when zoomed, and each shape is an independent tag element that can easily have CSS styles and interactions bound to it. |
| **Context (ctx)** | The "2D magic paintbrush" you requested, used for color mixing, defining shapes, and rendering various special effects. |
| **requestAnimationFrame** | The browser's built-in god-tier metronome that strictly follows the display's refresh rate to execute callbacks — the ultimate choice for creating silky smooth animations. |
| **FPS (Frame Rate)** | Frames per second. 60 FPS means the browser seamlessly erases and redraws the canvas 60 times per second. |
| **Dirty Rectangle** | Precisely erasing and redrawing only within the tiny area where changes occurred, thereby strongly preserving performance. |
| **Offscreen Canvas** | A "shadow canvas" hidden in memory. Pre-paint extremely complex but static scenes, then use them as dead textures for repeated use. |

> From a simple straight line segment to a magnificent particle system engine — all effects that seem like magic are nothing more than 60 coordinate calculations and redraw cycles per second.
