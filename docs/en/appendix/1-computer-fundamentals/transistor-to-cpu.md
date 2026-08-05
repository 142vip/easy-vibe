# Digital Circuit Basics: From Transistors to CPU

::: tip Preface
**How does a computer "think"?** You probably know the CPU is the computer's "brain," but how does this brain actually work? How does it go from a pile of metal and plastic to a smart device that can execute programs and process data? This chapter takes you from the most fundamental transistors, step by step, to understand the principles behind CPU construction.
:::

**What will you learn from this article?**

After completing this chapter, you will gain:

- **Terminology understanding**: When hearing "CPU clock speed," "multi-core," or "instruction set," you won't be confused — you'll understand the physical principles behind them
- **Code execution perspective**: See how a line of code goes through fetch, decode, execute, and write-back to ultimately become pixels on screen
- **Abstraction layer thinking**: Understand how each layer provides services to the layer above while hiding the complexity of the layer below
- **Foundation for further learning**: Build a foundation for computer architecture, embedded development, and performance optimization

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Transistors | Switches of the digital world |
| **Chapter 2** | Logic Gates | Physical implementation of Boolean operations |
| **Chapter 3** | Functional Units | Adders, registers, multiplexers |
| **Chapter 4** | CPU Core | Fetch, decode, execute, write-back |

---

## 0. Big Picture: From Sand to Intelligence

In exploring the底层 of computers, one fundamental question often arises: **where does the "thinking" ability of modern computers actually come from?**

If we peel away a computer's shiny casing, we typically see just a pile of metal, plastic, and silicon wafers. They have no life of their own, understand no mathematics, and know nothing of intelligence. But when electrical current flows through them, everything begins to operate. Ultimately, it all stems from one deceptively simple physical abstraction: **the switch**.

Imagine a switch that controls a light bulb. Press it and the light turns on, representing "1"; release it and the light turns off, representing "0." If we had billions of such switches and could make **the output of one switch control another switch**, thereby combining them into an incredibly complex logical network, what would happen?

The answer is a universal computing platform capable of executing arbitrary logic. The key to understanding computer systems lies in "abstraction." Like building blocks, we control underlying complexity through layered encapsulation. Here are the four core levels from sand to intelligence:

::: tip Layer-by-Layer Breakdown: From Sand to Intelligence
- **Layer 1: Transistors (tens of billions)**
  These are the底层 "switches." Modern CPUs primarily use MOSFETs (Metal-Oxide-Semiconductor Field-Effect Transistors). Applying voltage to the gate allows current to flow between source and drain. This is the physical starting point of "using electricity to control electricity." The core problem it solves: **how to use one electrical signal to control another electrical signal?**

- **Layer 2: Logic Gates (billions)**
  When we connect specific transistors in series or parallel, a remarkable transformation occurs — circuits become mathematics. For example, an AND gate requires both inputs to be 1 for the output to be 1. This constitutes a mapping of Boolean algebra onto physical circuits. The core problem it solves: **how to transform physical on/off states into logical operations based on 0s and 1s?**

- **Layer 3: Functional Units (hundreds)**
  By assembling basic logic gates, we can build computing modules with specific purposes. Adders handle arithmetic, multiplexers control data flow, and registers give circuits the ability to remember. The core problem it solves: **how to construct machines capable of performing addition calculations and remembering states?**

- **Layer 4: CPU Core (1-128 cores)**
  This is the command center of the entire microarchitecture. When you write a line of code, the various components inside the CPU work in coordination billions of times per second, executing the entire process of fetch, decode, execute, and write-back. The core problem it solves: **how to make all modules work in unison to automatically execute a specified program sequence?**
:::

---

## 1. Transistors: Switches of the Digital World

Let's start from the microscopic world. The component below demonstrates the basic principles of a transistor. Try operating it and observe how current flows:

<TransistorDemo />

### 1.1 Transistor Overview

::: tip Concept Introduction
In engineering, a **transistor** is a semiconductor device that changed the course of human history. In the context of digital circuits, we can directly abstract it as a perfect "switch."

Why do we need transistors? Think of a water faucet in daily life. You turn the valve with your hand, and water flows out. **A transistor is essentially a nanoscale water faucet:**
- The **source** and **drain** are like the two ends of a water pipe.
- The **gate** is the valve that controls the water flow.

The key difference is: we don't turn the switch by hand, but with **voltage signals**. When one switch can be controlled by electrical signals produced by another switch, we've crossed the enormous chasm from "manual intervention" to "automatic computation."
:::

### 1.2 Representing Binary with Transistors

You might ask: what does the computer's so-called "only understanding 0s and 1s" actually look like in the physical world? Are there really tiny 0s and 1s flowing through chips?

Of course not. It all relies on human-defined **abstraction conventions**. We abandon the obsession with continuous analog signals and set two extreme thresholds:

- We define **high voltage (e.g., 3.3V or 1.0V)** as logical **1** (True).
- We define **low voltage (near 0V)** as logical **0** (False).

This is the so-called digital abstraction: we take the noisy analog world and cleanly slice it into crisp 0s and 1s. When the gate receives high voltage, the transistor conducts — the switch is closed; when the gate receives low voltage, the switch opens.

### 1.3 The Evolution of Transistor Counts

A single transistor can only control on/off, which seems incredibly insignificant. But what if we combine billions of such switches? Look at the table below reflecting Moore's Law to understand the development of modern chips.

| Milestone | Processor Chip | Transistor Count | Process Node | Historical Significance |
| -------- | ---------------- | ---------- | -------- | ---------------------- |
| 1971 | Intel 4004 | 2,300 | 10μm | Dawn of the microprocessor |
| 1993 | Intel Pentium | 3.1 million | 800nm | PCs become universal |
| 2006 | Intel Core 2 Duo | 291 million | 65nm | Multi-core architecture goes mainstream |
| 2020 | Apple M1 | 16 billion | 5nm | Mobile architecture revolution feeds back to desktop |
| 2023 | Apple M3 Max | 92 billion | 3nm | Approaching the physical limits of atoms |

> **Deep dive: What is "3nm"?**
> When we hear about 5nm or 3nm in the news, imagine how incredibly tiny that is. A silicon atom has a diameter of about 0.2 nanometers. So at the 3nm process node, the most critical structures of a transistor are only a few dozen atoms wide! This means we're building humanity's largest computing fortresses at the very edge of where quantum mechanics takes effect.

---

## 2. Logic Gates: Computing with Switches

### 2.1 From Transistors to Logic Gates

As mentioned earlier, a single transistor is just a simple control over current flow. But when you arrange multiple transistors in specific patterns, physics transforms into mathematical logic. In this new dimension, we no longer talk about cumbersome voltages and currents, but directly about pure logical "true" (1) and "false" (0).

Please experience the effect of combining switches through the logic gate demo below:

<LogicGateDemo />

### 2.2 Basic Logic Gates

In our computer architecture, there are several fundamental logic gates. All supercomputers are built from these building blocks:

- **AND Gate**:
  - **Rule**: Output is 1 only when all inputs are 1.
  - **Intuitive understanding**: Connect two transistors **in series**. Current can only pass through if both barriers are opened simultaneously. Like opening a bank vault — both the manager and supervisor must insert their keys at the same time.

- **OR Gate**:
  - **Rule**: Output is 1 if at least one input is 1.
  - **Intuitive understanding**: Connect two transistors **in parallel**. With multiple parallel channels, as long as one path is open, current can flow through.

- **NOT Gate (Inverter)**:
  - **Rule**: Input 1 always outputs 0; input 0 always outputs 1.
  - **Intuitive understanding**: A gate specifically designed to flip states, also a key defense line frequently used in circuit design for signal shaping.

- **XOR Gate (Exclusive OR)**:
  - **Rule**: Output is exactly 1 when the two inputs are **different**.
  - **Intuitive understanding**: You can think of it as a precision machine for "detecting differences." This is our secret weapon for performing binary addition in circuits.

### 2.3 Implementing Addition with Logic Gates

If the logic gates introduced above can only perform simple conditional judgments, how does a computer actually do mathematical operations?

<BinaryAdditionRulesDemo />

Therefore, by combining an XOR gate (responsible for computing the current bit) and an AND gate (responsible for computing the carry), we get a circuit that can perform single-digit addition. This is the most basic **half adder**.

<HalfAdderDemo />

But the half adder has a fatal flaw: physically, it **has only two input ports (A and B)**.

Imagine performing decimal column addition (e.g., `19 + 22`):
- **Ones digit**: `9 + 2 = 11`. Only two numbers need to be added; write `1`, carry `1`. This is exactly two inputs — a half adder handles it perfectly.
- **Tens digit**: Not only do we need to compute `1 + 2`, but we also need to **add the "carry 1" passed from the ones digit** (i.e., `1 + 2 + 1 = 4`). This means in multi-digit addition, except for the rightmost digit, all other digits are actually adding **three numbers** together!

Because the half adder has no third input port to accept the "carry-in from the lower digit," it can't be used for any digit except the rightmost one. To solve this problem, we need a **full adder** that can accept three signals:

<FullAdderDemo />

By cascading multiple full adders, multi-digit addition can be accomplished:

<AdderChainDemo />

::: tip Core Analysis: Decomposing the Adder
To handle more complex numbers in the real world, adders need to be assembled like building blocks:

1. **Half Adder**: It can handle adding two single-digit numbers (the combination of XOR and AND gates described above). It computes the sum and carry bits but can't accept a carry-in from a lower position.

2. **Full Adder**: In multi-digit calculations, intermediate digits need to add A and B together plus handle the carry-in from the lower position. Incorporating the lower carry into the logic creates a full adder.

3. **Ripple Carry Adder**: To handle 32-bit or 64-bit numbers, simply cascade dozens of full adders together. The carry signal ripples from the lower bits to the higher bits like a wave, completing addition of any size.
:::

Want to understand the complete process from logic gates to multi-digit addition all at once? Try this comprehensive demo:

<CompleteAdderDemo />

---

## 3. Functional Units: Combining Logic Gates

Now, with our building blocks made of logic gates in hand, we can leap to a higher level of abstraction. Computing addition alone is not enough. We package groups of logic gates and assemble them into modules with specific functions. These modules are collectively called **functional units**.

### 3.1 Common Functional Modules

When designing a CPU, there are time-tested classic prefabricated modules:

| Module | Core Mission | Internal Logic Nature | Real-life Analogy |
| -------------- | ------------------------------------ | ------------------------------------ | -------------------- |
| **Adder** | Engine for all types of arithmetic operations | High-level bit-wise cascading of full adders | A tireless abacus |
| **Multiplexer (MUX)** | Controls data flow paths, implementing one-of-many selection | Cleverly combines AND gates as switches, OR gates for aggregation | Precision railroad switch |
| **Decoder** | Decodes and translates external binary instructions | Gate arrays that precisely light up specific outputs based on input states | Code-breaking translator |
| **Flip-Flop** | Breaks through the ephemeral nature of electrical signals to record history | Subtle cross-feedback loops forming bistable modes | A seesaw that holds its state |

To intuitively experience how these functional units work, you can operate the component below to view the internal logic of a **multiplexer** and a **decoder**:

<FunctionalUnitDemo />

Please explore the most fascinating part through the component below — **how memory emerges from nothing**:

<RegisterDemo />

### 3.2 Registers: Data Storage Units

Beyond computation, computers also need the ability to remember data long-term or temporarily. If a computer loses memory of the previous second during computation, no complex calculation is possible. The computer must have some means of preserving past states. This ability primarily relies on a circuit structure called a **flip-flop**.

::: tip Deep Understanding: Memory Is Essentially a Loop
In most logic circuits, signal flow is forward (feedforward). To produce sustained "memory," early pioneers came up with a brilliant design: feed the output signal back to the input.

It's like an ingeniously balanced seesaw with two stable resting points. Without external disturbance, thanks to its closed-loop design, it permanently stays in either the "left-high-right-low" state (e.g., representing 0) or the opposite state (representing 1). Even fleeting state changes get permanently "locked in" by the closed loop.

When we arrange 32 or 64 of these flip-flops in a neat row and apply a unified, powerful clock frequency signal to command them to act in unison, a **register** is born. It resides at the heart of the CPU system, serving as ultra-fast "scratch paper" that silently safeguards every one of your critical real-time variables.
:::

Please experience the process of breaking and restoring the closed loop through the interactive demo below:

<FlipFlopDemo />

---

## 4. CPU Architecture: From Functional Units to Processor

With various computing modules and memory components designed, it's now time for the core integration phase. How do we combine these modules to make them into a central processing unit (CPU) that can automatically execute instructions?

### 4.1 Core CPU Components

If we view the CPU as a machine with clear division of labor, each unit has its irreplaceable position:

- **Arithmetic Logic Unit (ALU)**: The "worker" unit responsible for executing addition, subtraction, multiplication, division, and various logical operations.
- **Register File**: Temporary drawers on the workbench — very small capacity but extremely fast, used for storing urgent parameters currently being computed.
- **Internal Bus**: The conveyor belt within the system, responsible for transporting data and signals between modules.
- **Control Unit**: The commander-in-chief. Its mission is to read instructions composed of 0s and 1s from memory, parse what should be done, and transmit specific control signals to other modules, directing them to perform their duties.

<MinCpuDemo />

### 4.2 CPU Instruction Execution Flow

No matter how complex the high-level programming language you write, it ultimately becomes a series of底层 instructions in memory. The process of executing any instruction essentially repeats these four typical steps:

1. **Fetch**: Following the current program execution cursor address, reach into the relatively slow cache and forcefully pull the next binary "instruction" into the core.
2. **Decode**: The command brain immediately analyzes: is this command asking me to move memory, or to call the adder for a computation? Immediately connect and activate the required circuits.
3. **Execute**: The instruction dispatch reaches a workshop like the ALU. The machines roar into action, going all out for hardcore logical operations.
4. **Write Back**: The moment of crystallization — carefully write the newly obtained answer to a specific register or back to the broader memory.

Click "Clock Pulse" below to observe how instructions are decomposed and executed step by step in this cycle, and which hardware modules are involved:

<CpuArchitectureDemo />

::: tip The Pursuit of Extreme Efficiency: Pipelining
If we had to wait for one instruction to complete all four steps before starting the next, efficiency would clearly be too low.

Just like a factory assembly line, chip engineers introduced **instruction pipelining**. This means when the first circuit section is "executing" instruction A, the preceding circuits aren't idle — they're "decoding" instruction B, or even "fetching" instruction C in advance. Through this parallel overlapping approach, CPU execution efficiency is greatly improved.
:::

---

## 5. Summary: Crossing Abstraction Layers

Looking back on this journey, we've experienced the most core layers of abstraction in computer architecture. This is the complete path from底层 physical materials to a universal computing platform:

1. **Macroscopic physics: Sand (silicon dioxide crystals)**
   → *After human smelting, slicing, toxic gas etching, and other demanding processes*
2. **Microscopic physics: Massive arrays of transistor switches** (using micro-electricity to control micro-electricity)
   → *After sleepless wiring by engineering masters, achieving astonishing digital abstraction constraints*
3. **Digital algebra: AND / OR / NOT logic gate systems**
   → *Ruthlessly eliminating errors, deriving basic behaviors from perfect truth tables*
4. **Microarchitecture modules: Functional unit building block sets (adders and other components)**
   → *Adding system life rhythms and memory characteristics, evolving into complete functional bodies*
5. **Complex system architecture: Vast and exquisite CPU combined arrays**
   → *Opening the door to the virtual application world for developers worldwide*
6. **Millions of application kingdoms: Algorithms, system-level software, and the blooming internet universe**

The most fascinating aspect of computer science is that **each layer of encapsulation perfectly hides the complex details of the layer below.** As a software developer, when you write `salary = base + bonus`, you don't need to think about electron drift or current flow inside half adders. Similarly, chip hardware designers don't need to worry about what software their chip will run in the future.

It is this extreme layer decoupling and highly independent black-box encapsulation that together nurtured and paved the way for the carnival of modern technology.

::: tip Ultimate Reflection
**Ultimately, so-called computing power is nothing more than the transformation of massive switch reconfigurations within a confined space; accompanied by the rhythm of the clock, completing complex computations on this tiny silicon chip.**

"Quantitative change ultimately triggers a qualitative leap" — this phrase is continuously validated in computer architecture. When we tap our keyboards and gaze at our screens, we can try to imagine: deep within the incredibly microscopic silicon substrate, billions of tiny transistors are at this very moment straining to perform precise coordination in the flash of electric light. This is perhaps the most unique beauty of computer science.
:::

---

## Further Reading

If you're full of curiosity about底层 technology, you can explore the following directions:
- **Classic textbook**: *Computer Organization and Design (The Hardware/Software Interface)* is an excellent reference for studying architecture in depth.
- **Digital logic simulation**: Try using logic simulation software or basic components to build a simple 8-bit adder or simulator hands-on.
- **Architecture frontiers**: Learn about how multi-level caches mitigate the "memory wall" problem, the principles of out-of-order instruction execution, and GPU's special computing mechanisms.
- **Low-level and assembly language**: Try learning some basic assembly language to understand how high-level languages are ultimately transformed into hexadecimal instructions executable by machines.
