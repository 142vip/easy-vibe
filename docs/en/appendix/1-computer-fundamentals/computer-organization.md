# Computer Organization Principles

::: tip Preface
**After building a CPU from transistors, how do computers form a complete system?** In the previous chapter, we started from transistors and built adders, registers, arithmetic units, and finally assembled the CPU core. But a CPU alone is not enough — it needs to work in coordination with memory and I/O devices, requires buses to connect components, and needs an instruction set to drive operations. This chapter shifts our perspective from inside the CPU to the entire computer system, providing an in-depth understanding of the Von Neumann architecture, instruction sets, storage hierarchy, buses, and I/O principles.
:::

**What will you learn from this article?**

After completing this chapter, you will gain:

- **System perspective**: Understand how CPU, memory, and I/O work together — no longer just an isolated hardware enthusiast
- **Hardware terminology**: Master hardcore concepts like instruction cycles, pipelines, CPI, and cache hit rates
- **Performance thinking**: Understand bottlenecks and optimization approaches in computer organization
- **Foundation for further learning**: Build a professional foundation for operating systems, computer architecture, and embedded development

| Chapter | Content | Core Concepts |
|----- |------|---------|
| **Chapter 1** | Von Neumann Architecture | Stored program, five major components, data path |
| **Chapter 2** | Instruction Set Architecture | Instruction format, addressing modes, CISC vs RISC |
| **Chapter 3** | CPU Control Unit | Control unit, micro-operations, instruction cycle |
| **Chapter 4** | Storage Hierarchy | Cache, main memory, virtual memory, paging |
| **Chapter 5** | Bus and I/O | Bus arbitration, DMA, interrupt mechanism |

---

## 0. Big Picture: Computer Hardware System

In the previous chapter "From Transistors to CPU," we understood how the CPU works internally — from fetch, decode, execute to write-back. But the CPU itself is just an execution unit. To make a computer truly "usable," a series of peripheral components must work together.

<CpuArchitectureDemo />

::: tip Layer-by-Layer Breakdown: Computer Hardware System
- **Layer 1: CPU Core**
  Responsible for instruction execution, including the control unit (issuing control signals) and the arithmetic unit (performing arithmetic and logic operations)

- **Layer 2: Register File**
  High-speed storage units inside the CPU, including general-purpose registers and special-purpose registers (PC, IR, MAR, MDR, etc.)

- **Layer 3: Main Memory**
  Memory for storing programs and data, accessed by the CPU through address and data buses

- **Layer 4: I/O Devices**
  Input and output devices connected to the system bus through I/O controllers

- **Layer 5: System Bus**
  Data channels connecting CPU, memory, and I/O, including address bus, data bus, and control bus
:::

---

## 1. Von Neumann Architecture: The Foundation of Modern Computers

### 1.1 The Stored-Program Principle

In 1945, mathematician John von Neumann proposed the groundbreaking **stored-program** architecture concept. This idea laid the foundation for modern computers.

::: tip Core Concept
**Stored Program**: The program itself, as a special kind of data, is stored in memory just like ordinary data. The CPU can read and execute program instructions stored in memory the same way it reads and writes data.
:::

This means:
- **Early computers**: Programs were implemented through fixed wiring; changing a program required re-soldering circuits
- **Von Neumann architecture**: Programs are stored in memory; changing a program only requires modifying the memory contents

### 1.2 Five Major Components

The Von Neumann architecture divides a computer into five core components:

<RegisterDemo />

| Component | English | Function | Main Composition |
|------|------|------|---------|
| **Arithmetic Unit** | ALU (Arithmetic Logic Unit) | Performs arithmetic and logic operations | Adders, shifters, comparators |
| **Control Unit** | CU (Control Unit) | Directs and coordinates all components | Instruction register, decoder, timing generator |
| **Memory** | Memory | Stores programs and data | Memory Address Register (MAR), Memory Data Register (MDR) |
| **Input Devices** | Input | Information input | Keyboard, mouse, scanner |
| **Output Devices** | Output | Information output | Monitor, printer |

### 1.3 Data Path

The **Data Path** is the route through which data flows between functional components. Inside the CPU, the data path connects:

- Register file
- Arithmetic Logic Unit (ALU)
- Memory Data Register (MDR)

The width of the data path (how many bits can be transferred at once) directly affects computer performance.

### 1.4 The Von Neumann Bottleneck

The Von Neumann architecture has a famous **performance bottleneck**:

> The data transfer speed between CPU and memory is far lower than the CPU's processing speed.

This causes the CPU to frequently be in an idle "waiting for data" state. Many optimization techniques in modern computers revolve around this problem:

| Optimization Technique | Principle |
|---------|------|
| **Cache** | Place small, high-speed storage near the CPU |
| **Instruction Pipeline** | Allow multiple instructions to be in different stages simultaneously |
| **Superscalar** | Issue multiple instructions in the same clock cycle |
| **Multi-core Parallelism** | Multiple CPU cores share computing tasks |

---

## 2. Instruction Set Architecture: The Interface Between CPU and Software

In the previous section, we learned the core idea of the Von Neumann architecture: **programs are stored in memory just like data**. But this raises a key question — what does a "program" stored in memory actually look like? How does the CPU understand it?

The answer is the **Instruction Set Architecture (ISA)**. If the CPU is a service, then the instruction set is its **API documentation** — it defines all the commands the CPU can understand, the format of each command, and the data range each command can operate on. Every line of code you write is ultimately translated by the compiler into a sequence of calls to this "API."

### 2.1 From Code to Instructions: Instruction Encoding and Execution

First, let's establish a holistic understanding: the code you write in an editor and what the CPU actually executes are separated by several layers of translation.

<CodeToInstructionDemo />

This translation chain is key to understanding instruction sets:

| Layer | Content | Who Can Understand It |
|------|------|---------|
| High-level language | `int a = 10 + 5;` | Humans |
| Assembly language | `MOV R1, #10` / `ADD R3, R1, R2` | Humans (with training) |
| Machine code | `0001 0001 0000 1010` | CPU |

::: tip Why Understand This Chain?
- When you see a compilation error, you know it occurred at the "high-level language → assembly" step
- When you see a runtime crash, you know the problem is at the CPU instruction execution stage
- When understanding performance optimization, you know what optimizations the compiler makes during "translation"
- When choosing a CPU architecture (x86 vs ARM), you know the difference is in the "instruction set API"
:::

### 2.2 Instruction Formats

Now that we know code gets translated into instructions, the next question is: **what is the internal structure of an instruction?**

Each machine instruction is essentially a string of binary digits, but it has a strict internal format. The two most core parts are:

- **Opcode**: Tells the CPU "what to do" — add? jump? or read memory?
- **Operand**: Tells the CPU "what to do it to" — which register? which memory address? what constant?

Just as a sentence has a "verb + object" structure, an instruction has an "operation + target" structure:

```
Instruction:  ADD  R3, R1, R2
              ───  ──────────
              Opcode  Operands
              (do addition) (R3 = R1 + R2)
```

Based on the number of operands, instruction formats range from simple to complex in four types:

<InstructionFormatDemo />

| Format | Structure | Example | Use Case |
|------|------|------|---------|
| Zero-address | Opcode only | `RET` (return) | Stack machines; operands implicit at stack top |
| One-address | Opcode + 1 address | `INC R1` (increment R1 by 1) | Single-operand operations |
| Two-address | Opcode + 2 addresses | `MOV R1, R2` | Most common; data transfer and operations |
| Three-address | Opcode + 3 addresses | `ADD R3, R1, R2` | Preserves source operands |

::: tip Why So Many Formats?
This is a **trade-off between space and flexibility**. Zero-address instructions are the shortest (saving memory) but require extra stack operations; three-address instructions are the most flexible (preserving source data) but occupy more bits. Different CPU architectures choose different combinations of instruction formats.
:::

### 2.3 Addressing Modes

An instruction tells the CPU to "do addition," but where are the two numbers for the addition? They might be written directly in the instruction, in a register, or at some memory address. **Addressing modes** are the rules that tell the CPU "where to find the operands."

Using a real-life analogy of "finding someone":

| Addressing Mode | Analogy | Instruction Example | Description |
|---------|---------|------|---------|
| **Immediate addressing** | The person is standing right in front of you | `MOV R1, #100` | Data is written directly in the instruction; fastest |
| **Register addressing** | Call an internal extension to reach a colleague | `MOV R1, R2` | Data is in a CPU register; very fast |
| **Direct addressing** | Know the address, go directly to the door | `MOV R1, [0x1000]` | Memory address is written in the instruction |
| **Indirect addressing** | Ask the front desk "which room is Zhang San in?" | `MOV R1, [R2]` | The register contains an address; requires one extra lookup |
| **Indexed addressing** | "Building 3 + Floor 5" to calculate the room | `MOV R1, [R2+10]` | Base address + offset; used for array access |

<AddressingModeDemo />

::: tip Why So Many Addressing Modes?
Different scenarios require different "find data" strategies:
- **Constant assignment** (`x = 100`) → Immediate addressing; data is right in the instruction
- **Variable operations** (`a + b`) → Register addressing; data already loaded into registers
- **Array access** (`arr[i]`) → Indexed addressing; base address + index offset
- **Pointer operations** (`*ptr`) → Indirect addressing; register holds the address

When you write `arr[i]`, you don't think about addressing modes, but the compiler automatically selects the most appropriate one.
:::

### 2.4 The CPU's Capability List — Instruction Categories

Now that we know instruction formats and addressing modes, the last question is: **what exactly can the CPU do?**

All instructions can be grouped into six categories that cover everything a computer can do:

| Type | What It Does | Representative Instructions | Maps to Your Code |
|------|-------|---------|-------------|
| **Data Transfer** | Move data around | MOV, LOAD, STORE | `let x = y`, function parameter passing |
| **Arithmetic** | Addition, subtraction, multiplication, division | ADD, SUB, MUL, DIV | `a + b`, `count++` |
| **Logic** | Bitwise operations | AND, OR, NOT, XOR | `flags & 0xFF`, permission checks |
| **Shift** | Shift left/right | SHL, SHR | `x << 2` (equivalent to multiplying by 4) |
| **Control Transfer** | Jumps and calls | JMP, CALL, RET | `if`, `for`, function calls |
| **Input/Output** | Communicate with peripherals | IN, OUT | Read keyboard, write to screen |

::: tip A Key Insight
All the code you write — no matter how complex the business logic or how flashy the UI animations — is ultimately broken down into combinations of these six basic operation types. The CPU's "intelligence" lies not in how complex its individual operations are, but in its ability to execute these simple operations billions of times per second.
:::

### 2.5 Two Design Philosophies: CISC vs RISC

There is a fundamental divide in instruction set design: **should each instruction be as powerful as possible, or as simple as possible?**

This divide created two camps that directly affect every device you use today:

<CISCvsRISCDemo />

An analogy to understand this:
- **CISC is like a Swiss Army knife**: One tool integrates scissors, a bottle opener, a screwdriver... lots of functions but each one may not be the best
- **RISC is like a professional tool set**: Each tool does only one thing, but does it fast and well

::: tip Why Does Your Phone Use ARM and Your Computer Use x86?
- **x86 (CISC)** has dominated the PC and server market for 40 years, accumulating a massive software ecosystem. Switching architectures means all software must be recompiled
- **ARM (RISC)** dominates mobile devices thanks to its low-power advantage. Phone batteries are small; every milliwatt counts
- **Apple Silicon** proved that RISC can also deliver high performance — the M-series chips surpassed x86 competitors in both performance and power efficiency
- **RISC-V** is an open-source RISC architecture rapidly rising in IoT, education, and AI chip sectors
:::

---

> **Summary**: The instruction set is the bridge between software and hardware. Your code is translated by the compiler into instructions, which tell the CPU what to do and to whom through opcodes and operands. Addressing modes determine where data comes from. Different instruction set designs (CISC/RISC) determine the CPU's performance characteristics and applicable scenarios.
>
> Now we know the "static structure" of instructions — what they look like and what types exist. The next question is: **how does the CPU execute these instructions step by step internally?** That's the control unit's job.

---

## 3. Control Unit: The CPU's Control Logic

### 3.1 Components of the Control Unit

The control unit is the "brain" of the CPU, responsible for coordinating all components to work according to instruction requirements:

<ControllerDemo />

| Component | Function |
|------|------|
| **Program Counter (PC)** | Stores the address of the next instruction |
| **Instruction Register (IR)** | Stores the currently executing instruction |
| **Instruction Decoder** | Parses the instruction's opcode and operands |
| **Timing Generator** | Generates clock beat signals to control component timing |
| **Micro-operation Sequence Generator** | Generates the series of control signals needed to execute instructions |

<PSWFlagDemo />

### 3.2 Instruction Cycle

The CPU executes an instruction through a complete **instruction cycle**, typically including:

1. **Fetch Cycle**: Read instruction from memory into IR
2. **Decode Cycle**: Parse the instruction's meaning
3. **Execute Cycle**: Perform the operation
4. **Memory Access Cycle**: Access memory if needed
5. **Write-Back Cycle**: Write the result back to a register or memory

### 3.3 Micro-Operations

**Micro-operations** are the most basic operations driven by control signals. For example, the "fetch" phase can be decomposed into the following micro-operations:

| Beat | Micro-Operation | Control Signals |
|------|--------|---------|
| T1 | PC → MAR | PCout, MARin |
| T2 | MEM → MDR | MEMout, MDRin |
| T3 | MDR → IR | MDRout, IRin |
| T4 | PC + 1 → PC | PC+1, PCin |

### 3.4 Hardwired vs. Microprogrammed Control

| Feature | Hardwired Control | Microprogrammed Control |
|------|------------|-------------|
| **Implementation** | Combinational logic circuits | Microinstruction sequences (firmware) |
| **Speed** | Fast | Slightly slower |
| **Design difficulty** | Complex | Simpler |
| **Flexibility** | Poor (changes require circuit redesign) | Good (just modify the microprogram) |
| **Typical applications** | RISC processors | Early CISC processors |

---

## 4. Storage Hierarchy and Cache Principles

### 4.1 Storage Hierarchy Structure

A computer's storage devices form a pyramid structure:

<StorageHierarchyDemo />

| Level | Storage Type | Access Time | Typical Capacity | Location |
|------|---------|---------|---------|------|
| **Registers** | SRAM | <1ns | A few KB | Inside CPU |
| **L1 Cache** | SRAM | ~1ns | 32-64KB | Near CPU core |
| **L2 Cache** | SRAM | ~3-10ns | 256KB-1MB | On CPU chip |
| **L3 Cache** | SRAM | ~10-20ns | 2-16MB | On CPU chip / shared |
| **Main Memory (RAM)** | DRAM | ~50-100ns | 8-64GB | On motherboard |
| **SSD** | Flash | ~10-100μs | 256GB-2TB | On motherboard |
| **HDD** | Magnetic disk | ~5-10ms | 1-10TB | Inside case |

::: tip Analogy for Speed Differences
If CPU accessing L1 cache is like **grabbing a piece of paper from your desk**:
- Accessing main memory → Taking the elevator to a convenience store downstairs to buy paper
- Accessing SSD → Driving to another city to buy paper
- Accessing HDD → Flying to another country to buy paper

The speed difference can be **millions of times**!
:::

### 4.2 Cache Principles

**Cache** is fast storage located between the CPU and main memory. Its core idea is based on two locality principles:

::: tip Locality Principles
- **Temporal locality**: If data was just accessed, it's likely to be accessed again soon
- **Spatial locality**: If data was accessed, nearby data is likely to be accessed too
:::

#### How Cache Works

1. **Hit**: The data the CPU needs is in the cache; read directly
2. **Miss**: The data is not in the cache; must be loaded from main memory

```
Hit rate = Number of hits / Total number of accesses
Average access time = Hit rate × Cache time + (1 - Hit rate) × Memory time
```

<CacheDemo />

### 4.3 Cache Mapping Methods

| Method | Principle | Advantage | Disadvantage |
|------|------|------|------|
| **Direct-mapped** | Each memory block can only go to one fixed location | Simple and fast | High conflict rate |
| **Set-associative** | Each memory block can go to N locations (N-way) | Balances speed and hit rate | More complex implementation |
| **Fully associative** | Any location | Lowest conflict rate | Hardest to implement (requires comparing all tags) |

### 4.4 Virtual Memory

**Virtual memory** is an important abstraction provided by the operating system:

- Each process thinks it has a complete virtual address space
- The operating system translates virtual addresses to physical addresses
- Infrequently used pages can be swapped out to disk (swap space)

::: tip Virtual Memory Analogy
Think of virtual memory as **a hotel managing rooms**:
- You (the process) think the entire building is yours
- In reality, the hotel (OS) only assigns you the rooms you currently need
- Unused rooms get "swapped out" to storage (disk)
- Needed rooms can be "swapped in" at any time
:::

---

## 5. Bus and I/O Systems

### 5.1 System Bus

A **Bus** is the data channel connecting computer components:

<BusSystemDemo />

| Bus Type | Function | Direction | Typical Width |
|------|------|------|---------|
| **Address Bus** | Transfers memory addresses | Unidirectional (CPU→Memory) | 32-bit/64-bit |
| **Data Bus** | Transfers data | Bidirectional | 32-bit/64-bit |
| **Control Bus** | Transfers control signals | Bidirectional | Multiple signal lines |

### 5.2 Bus Arbitration

When multiple devices simultaneously request bus access, an **arbitration** mechanism determines who goes first:

| Arbitration Method | Description |
|---------|------|
| **Centralized arbitration** | A central arbiter makes the decision |
| **Distributed arbitration** | Devices negotiate among themselves |

### 5.3 I/O Device Access Methods

| Method | Principle | Advantage | Disadvantage |
|------|------|------|------|
| **Programmed I/O (Polling)** | CPU polls I/O status | Simple | Low CPU utilization |
| **Interrupt-driven I/O** | I/O device actively notifies CPU when done | CPU can work in parallel | Interrupt handling has overhead |
| **DMA** | I/O device accesses memory directly | CPU not involved at all | Requires a DMA controller |

<IOMethodDemo />

### 5.4 DMA Principles

**DMA (Direct Memory Access)** allows I/O devices to exchange data directly with memory:

<NetworkOverviewDemo />

- **Without DMA**: The CPU participates in the entire data transfer process and can't do anything else
- **With DMA**: The CPU tells the DMA controller "transfer from where to where, how much," then goes to do other tasks. The DMA notifies the CPU when complete

::: tip DMA Analogy
This is like **ordering food delivery**:
- **Without DMA**: You go to the supermarket yourself, buy groceries, go home, wash vegetables, and cook (involved in the entire process)
- **With DMA**: You place an order by phone, and the delivery person brings it straight to your kitchen (someone else handles it; you just "receive the goods" at the end)
:::

### 5.5 Interrupt Mechanism

**Interrupts** are a very important mechanism in computer systems:

1. After an I/O device completes an operation, it sends an **interrupt request** to the CPU
2. The CPU, currently executing an instruction, responds to the interrupt after completing the current instruction
3. The CPU saves its current state and jumps to the interrupt handler
4. After handling is complete, it restores the state and continues execution

---

## 6. CPU Performance Optimization: Pipeline Technology

### 6.1 Instruction Pipeline

**Instruction pipelining** is a parallel technique that maximizes CPU efficiency:

<PipelineDemo />

#### How Pipelining Works

```
Sequential execution (5 instructions, 15 cycles):
Instr 1: IF→ID→EX→MEM→WB
Instr 2:            IF→ID→EX→MEM→WB
Instr 3:                         IF→ID→EX→MEM→WB
...

Pipeline execution (5 instructions, 9 cycles):
Instr 1: IF→ID→EX→MEM→WB
Instr 2:    IF→ID→EX→MEM→WB
Instr 3:       IF→ID→EX→MEM→WB
...
```

Ideally, CPI (cycles per instruction) for N instructions ≈ 1

### 6.2 Pipeline Hazards

While pipelining improves performance, it also introduces **hazard** problems:

| Type | Cause | Solution |
|------|------|---------|
| **Structural hazard** | Hardware resource conflict | Add hardware / stagger execution |
| **Data hazard** | Later instruction needs the result of an earlier one | Data forwarding / bubbles / scheduling |
| **Control hazard** | Branch instructions change execution flow | Delay slots / branch prediction |

---

## 7. Summary: The Computer Execution Model

Let's connect the entire process using professional terminology:

> **After a program starts, the operating system loads the executable file from disk into memory. The CPU's fetch unit (IF) reads instructions from memory into the instruction register (IR) via the address bus. The control unit decodes the instruction (ID), and after identifying the operation type, generates the corresponding control signals. The arithmetic unit (EX) performs arithmetic and logic operations. If memory access is needed, it accesses memory (MEM) via the data bus, and finally the result is written back (WB) to a register or memory. The entire process is driven by the clock, with micro-operation sequences generated by the control unit coordinating all components to work in an orderly manner.**

---

## Further Reading

| Topic | Recommended Resources |
|------|-----------------|
| Computer Architecture | *Computer Organization and Design: The Hardware/Software Interface* - Patterson & Hennessy |
| CPU Microarchitecture | *Computer Systems: A Programmer's Perspective* - Bryant & O'Hallaron |
| Instruction Set Architecture | ARMv8 Architecture Manual, Intel x64 Manual |
| Cache Principles | Cache Coherence Protocol (MESI), Cache Write Policies |
| Operating Systems | Next chapter: "Operating Systems" |

---

## Next Steps

Now that you've mastered the professional knowledge of computer organization, you can continue learning:

- **[Operating Systems](./operating-systems.md)**: Understand how programs run on an operating system, and how processes, threads, and memory management are implemented
- **[Data Encoding, Storage, and Transmission](./data-encoding-storage.md)**: Deepen your understanding of how data is represented in computers
