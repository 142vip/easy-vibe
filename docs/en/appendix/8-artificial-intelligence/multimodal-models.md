# Principles of Multimodal Models: Vision, Audio, and Video
> 💡 **Learning Guide**: This chapter requires no deep background in computer vision. Through interactive demonstrations, you'll understand how AI gains the ability to "see." We'll uncover the core principles behind models like GPT-4V and Qwen-VL.

<VlmQuickStartDemo />

## 0. Introduction: Giving the Brain a Pair of Eyes

In [Introduction to Large Language Models](./llm-principles.md), we learned that an LLM is essentially a "brain" locked in a black box, able to understand the world only through **text**.

The emergence of **Vision-Language Models (VLMs)** is like giving that brain a pair of **eyes**.

But this is no simple feat, because:

- The **brain (LLM)** only understands **text** (specifically, token IDs).
- The **eyes (camera)** see **pixels** (RGB color values).

The core task of a VLM is to **translate "pixel signals" into "text signals"** so that the LLM finds interpreting an image as natural as reading an article.

---

## 1. 视觉分词：图像转词嵌入（Visual Tokenization）

Imagine you're describing a jigsaw puzzle to a friend over the phone. You can't describe it all at once — you have to go piece by piece.
Computers "see" images the same way.

### 1.1 Patchify — Creating Visual Words

We know that when a Large Language Model (LLM) processes text, it breaks sentences into individual tokens. If you want an LLM to "read" an image, the most intuitive approach is to turn the image into something resembling tokens.

To accommodate the LLM's habit of "reading words," we need a technique that converts a continuous two-dimensional image into discrete fragments. This is where **Patchify** comes in: we take a complete 2D image and slice it, like cutting tofu, into a grid of fixed small squares (called Patches).

- **Original image** = a complete article
- **Image patch** = a word (token) in the article

In engineering practice, we typically slice an image by a fixed size (e.g., $16 \times 16$ or $14 \times 14$ pixels) without overlap. For example, a common $224 \times 224$ input image, once sliced, becomes $14 \times 14 = 196$ independent image patches.
Through this operation, what was a continuous 2D pixel array is physically carved into 196 discrete "visual vocabulary entries."

> 🕹️ **Interactive Demo**: Click the button below to see how an original image is sliced into individual patches by a regular grid.

<PatchifyDemo />

### 1.2 Flatten — Lining Them Up into a Sentence

After the previous slicing step, we now have a $14 \times 14$ 2D grid on hand. However, both traditional Transformers and modern LLMs fundamentally accept only **one-dimensional sequence input** (a linear data structure arranged left to right).

To comply with the LLM's input specification, we must perform **Flattening and Linear Projection**:
1. **Flatten**: Concatenate the rows of image patches end to end, collapsing the 2D matrix into a single 1D sequence.
2. **Projection**: These 196 patches are still just "raw meat" — stacks of RGB pixel values. We use a small neural network (typically a fully connected layer) to process each patch, compressing and transforming it into a fixed-length feature vector (e.g., a list of 768 numbers).

After this step, an image is truly transformed into a "visual token sequence."

> 🕹️ **Interactive Demo**: Watch the animation below to see how **a raw pixel patch** undergoes matrix transformation and is ultimately mapped into a high-dimensional **vector** packed with rich feature dimensions.

<LinearProjectionDemo />

---

## 2. 跨模态投影（Projection）

At this point, although the image has been converted into a one-dimensional sequence of "visual words," this sequence is still an unreadable mess to the LLM.

Why can't the LLM understand it? Because the **feature spaces differ** (they speak different languages).
The vision encoder (e.g., ViT) extracts **spatial pixel features** (e.g., it can only tell you "this is something made of many curved black lines" or "there's a large red area here"); whereas the LLM internally understands **deep semantic features** (e.g., the concepts of "cat," "tree," "danger," etc.).

Between these two completely different semantic systems, we need to build a bridge — our cross-modal translator: the **Projector (Adapter)**.

### 2.1 The Role of the Translator (Latent Space Alignment)

The academic essence of the Projector is achieving **Latent Space Alignment**. Think of it as a simultaneous interpreter in real life:

- **Input (Source)**: The "visual features" spit out by ViT (focusing on continuous high-dimensional representations of geometry, color, and texture patterns).
- **Processing (Translation)**: The Projector uses a neural network structure (which could be a few simple linear transformation layers or complex attention layers) to find the mathematical correspondence between the two languages.
- **Output (Target)**: Outputs "LLM language" that fully matches the LLM's expectations (text-equivalent embedding tokens transformed from image features, endowing the image with conversational meaning).

Through this layer of translation filtering, the LLM will be pleasantly surprised to find: "Huh? This string of numbers coming in — isn't that just the kind of descriptive word combinations I usually read?" — and thus seamlessly processes image features alongside natural language.

<ProjectorDemo />

### 2.2 Different Schools of Translation

To make this "translation process" of feature alignment faster and more accurate, academia and industry have developed several representative hardware connection design approaches:

1.  **Literal Translation (Linear Projection)**:
    - **Approach**: Brutally simple — uses only a single layer or a few MLP / linear projection layers for direct mathematical matrix transformation.
    - **Characteristics**: **Extremely low information loss, preserving the image's original details**; the downside is that all the hundreds or thousands of visual tokens from slicing are fed to the LLM without filtering, causing a massive increase in subsequent computation.
    - **Representative**: LLaVA series.

2.  **Free Translation (Q-Former / Resampler)**:
    - **Approach**: Instead of passing everything through verbatim, introduces a "small scout network" with abstract summarization capability in the middle. This intermediary first quickly scans and understands the entire image, then distills dozens of highly condensed core points.
    - **Characteristics**: **Information is highly condensed and refined, with fewer tokens, greatly saving the LLM's reasoning compute**; the downside is that extremely subtle observational clues at the edges of the original image may be lost during distillation.
    - **Representative**: BLIP-2, Gemini (partially similar mechanisms).

3.  **The Middle Way (C-Abstractor / Pooling)**:
    - **Approach**: Uses convolutional pooling or local region reorganization to compress and merge adjacent $2 \times 2$ or larger pixel blocks into a single unified representation unit.
    - **Characteristics**: Reasonably compresses token sequence length while still preserving some interdependent local and spatial awareness.
    - **Representative**: Qwen-VL-Max.

---

## 3. 多模态架构组装

With the components and interface standards in place, let's look at how everything fits together. Mainstream multimodal Vision-Language Models (VLMs) almost all follow a unified **"three-stage" architectural pattern**.

### 3.1 The Anatomy of a VLM

<ModelArchitectureComparisonDemo />

A typical VLM entity operates through the coordinated effort of three major components:

1.  **Feature-Perception "Eyes" (Vision Encoder)**:
    - **Function**: Serves as the first checkpoint for image input — responsible for looking at the image and abstracting high-dimensional visual features.
    - **Selection**: Most vendors don't train the eyes from scratch; instead, they directly borrow mature components pre-trained on hundreds of millions of image-text paired datasets (such as OpenAI's CLIP vision tower or Google's SigLIP model).
    - *Analogy: This is the highly specialized retinal photoreceptor region of a biological organism.*

2.  **Signal-Conversion "Optic Nerve" (Projector — Modality Projector)**:
    - **Function**: Bridges the encoder and the language backbone — responsible for signal dimension compression, interfacing, and multimodal semantic translation.
    - **Selection**: This is the **top priority** in subsequent multimodal system training. Its own parameter count is typically small (relative to the LLM), but it determines whether "text" and "image" can truly understand each other.
    - *Analogy: It's like the optic nerve hub responsible for converting and transmitting electrical signals to the cerebral cortex.*

3.  **Cognitive Engine "Brain" (LLM Backbone)**:
    - **Function**: Handles the final observation, commonsense invocation, deep logical reasoning, and human-like response generation.
    - **Selection**: Typically uses the most intelligent open-source LLMs available as the mounting point (e.g., Qwen, Llama 3, Vicuna, etc.).
    - *Analogy: This is the brain's language and decision-making center equipped with a world knowledge base — it makes high-level cognitive judgments based on the processed signals transmitted by the optic nerve.*

---

## 4. Method for learning to See (Training)

Alright, now the body parts are stitched together. But before it can go live, a freshly assembled VLM is actually in a newborn-like state of "blindness and chaos" — because the newly added optic nerve (Projector) is a blank slate filled with meaningless random values.

To endow this Frankenstein creation with the ability to describe images, the scientific community has distilled an efficient **"Two-Stage Training"** protocol.

### Stage One: Object Recognition (Feature Alignment — Pre-training)

In this stage, the main task is to help the random Projector establish an initial cross-modal mapping relationship. The process is much like teaching an infant to memorize words using flashcards.

- **What it sees (Training Input)**: Massive batches (often hundreds of millions) of minimal paired image-text examples featuring a single prominent subject (e.g., a photo of a "cat" on a white background).
- **What it's told (Target Output)**: Short descriptive labels ("an orange cat").
- **Optimization Objective**: Force the Projector to learn, through matrix transformations, to align the visual features of this cat (after translation) as closely as possible with the token vector for "cat" in natural language.
- **Parameter Control (Freeze Strategy)**: To avoid damaging the original model's intelligence, researchers heavily **freeze** the billions of parameters in the "eyes" (ViT) and "brain" (LLM) during this stage, **only enabling training for the "optic nerve" (Projector) itself**, which has just a few million parameters.

<FeatureAlignmentDemo />

### Stage Two: Conversation (Visual Instruction Tuning)

If Stage One only turns the model into a label-reading machine, Stage Two's task is to activate its higher intelligence — enabling it to truly answer complex human instructions that combine text and images based on context.

- **What it sees (Training Input)**: Carefully designed high-quality Q&A training pairs. For example, a complex panoramic view of city traffic.
- **What it's asked to answer (Target Output)**: User asks: "`<image>` Is the man riding the white bicycle in the lower-left corner wearing a helmet?" Assistant answers: "No, he has nothing on his head — that's very dangerous behavior in the city."
- **Optimization Objective**: Enable the LLM not only to receive visual cues but also to integrate its accumulated commonsense knowledge, thoroughly merging textual logic with multimodal representations to perform reasoning.
- **Parameter Control (Freeze Strategy)**: At this point, the optic nerve is basically tuned. During this fine-tuning stage, a portion of the vision encoder's bottom-layer weights typically remain frozen, while **both the LLM and Projector are fully unfrozen** (or configured with LoRA) for global, large-scale joint backpropagation tuning.

<VLMInferenceDemo />

---

## 5. Advanced: Seeing More Clearly (Advanced Tricks)

While the above architecture established the initial multimodal paradigm, first-generation VLM models suffered from a very frustrating fundamental flaw — **nearsightedness (congenital vision deficiency)**.

Early vision encoders like ViT, due to historical design reasons, could inherently only process extremely low-resolution, tiny images such as $224 \times 224$ or $336 \times 336$. It's like being forced to observe the world through a blurry, low-quality retro webcam with a few hundred thousand pixels — any slightly small detail like text on a sign would completely blur into a blob of pixels. No matter how smart the brain is, "you can't make bricks without straw."

To overcome this low-resolution affliction, cutting-edge model developers (such as the Qwen-VL team, LLaVA-NeXT, etc.) have employed some remarkably clever engineering techniques:

### 5.1 Dynamic High-Resolution Mapping

If feeding a large image directly causes VRAM to explode, and crudely shrinking it loses all detail — how do we solve this? The current solution is a **"local close-up + global bird's-eye view" dual-perspective strategy**.

1. **Global Overview**: First, shrink the massive original high-resolution image down to $336 \times 336$ and let the eyes take a glance. This lets the model grasp the **overall macro layout structure** (where is the sky? where is the ground?).
2. **Slice and Zoom**: Slice the high-resolution original into dozens of independent, lossless $336 \times 336$ local close-up patches (Slices).
3. **One-by-One Inspection and Spatial Reassembly**: Have the vision engine scan each of these dozens of lossless slices with a magnifying glass, collecting high-definition details. Then, the Projector stitches the semantics of these detail patches together with the initial overview context like assembling a puzzle.

This approach is akin to taking a panoramic photo of a newspaper with your phone (to see the overall layout), then holding the phone close to the newspaper to capture dozens of close-up shots of individual paragraphs.

### 5.2 Swapping in Naturally Bigger Eyes (Scaling the Vision Encoder)

Another approach that embodies pure brute-force aesthetics is: since the original eyes have inherent genetic defects, I'll forge a stunning super-eye from scratch.

A classic representative is the outstanding open-source model **InternVL**. It abandoned the commonly used small-scale vision models and, from the ground up, independently trained a rare, ultra-large vision encoder backbone with billions of parameters (e.g., the 6-billion-parameter InternViT-6B) using massive resources.
With its extraordinary data absorption capacity, it is natively born as a "Hubble Space Telescope" that supports seamless high-resolution input. This design greatly reduces the complex engineering overhead and feature misalignment risks introduced by slicing and stitching, directly achieving "see everything at a glance" high-definition visual perception.

---

## 6. Summary

There's no magic in Vision-Language Models (VLMs). They do exactly one thing:

**Translate the "foreign language" of images into the "native language" of text, and then feed it to the LLM.**

Once you understand this, you understand everything about VLMs.

---

## 7. Glossary

| Term          | Full Name             | Explanation                                                              |
| :------------ | :-------------------- | :----------------------------------------------------------------------- |
| **VLM**       | Vision-Language Model | **Vision-Language Model**. A GPT that can understand images.             |
| **ViT**       | Vision Transformer    | **Vision model**. The "eyes" of a VLM, responsible for turning pixels into vectors. |
| **Patch**     | -                     | **Image patch**. The small squares an image is sliced into — the equivalent of "visual words." |
| **Projector** | -                     | **Projector / Translator**. The bridge connecting the eyes and the brain. |
| **Alignment** | -                     | **Alignment**. Making image features and text features "mutually intelligible" within the same space. |