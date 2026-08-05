# An Introduction to Command Line and Shell Scripts

> 💡 **Learning Guide**: This chapter aims to provide readers with zero prior experience a systematic understanding of how the terminal (Terminal) works. No computer science background is required — we will use interactive demonstrations to explain the terminal's operating mechanisms step by step.

## 0. Quick Start: Approach to opening the Terminal

Before you start learning, you first need to find it. The terminal comes pre-installed on every operating system — you don't need to install any additional software to use it.

::: info 🖥️ How to Open on Different Systems

** macOS (Mac)**

1. Press `Command (⌘) + Space` to open Spotlight Search.
2. Type `Terminal`.
3. Press Enter, and you'll see a window with white text on black (or black text on white).

**🪟 Windows**

- **Method 1 (CMD)**: Press `Win + R`, type `cmd`, and press Enter. This is the oldest command line.
- **Method 2 (PowerShell)**: Press `Win + R`, type `powershell`, and press Enter. This is a more modern and powerful terminal.
- _Tip: Either works for simple tasks, but PowerShell or WSL (Windows Subsystem for Linux) is recommended for development._

**🐧 Linux**

- The shortcut is usually `Ctrl + Alt + T`.
- Or search for `Terminal` in the application menu.

:::

### 0.1 Hands-on Lab: Try It Yourself

Practice makes perfect. Before diving into dry theory, let's get a feel for "typing commands" firsthand.

> 💡 **Tip**: For safety and convenience, we recommend using the **web simulator** below. If you're confident, you can also open your computer's real terminal using the method from Chapter 0 and follow along (the experience is the same).

In this exercise, you will learn to:

1. **View files**: Learn to use `ls` or `dir` to see what's in the current directory.
2. **Create and navigate**: Learn to use `mkdir` to create new folders and `cd` to enter them like a portal.
3. **Create files**: Learn to quickly create a new file using commands.
4. **Install software**: Experience the thrill of installing a Python library or system software with a single line of code.
5. **Delete and clean up**: Learn how to delete unwanted files (use with caution!).
6. **Ask AI for help**: This is the most important one! When you forget a command, learn to ask AI: "How do I delete a file on Mac?" — it will give you the answer directly.

_Please select your operating system below, then follow the guided steps to begin:_

<TerminalHandsOn />

### 0.2 Motivation for Giving Up the Mouse (Motivation for Giving Up the Mouse)

You might ask: _"Graphical interfaces (GUIs) are so easy to use — just click with the mouse. Why bother typing complex commands into a black-and-white window?"_

This isn't about "acting like a hacker." It's because in certain situations, **language (commands) is more powerful than gestures (mouse clicks)**.

#### 1. The Mouse Struggles with "Batch Operations" and "Logic"

- **GUI (mouse)**: Good for "click what you see." If you want to delete one photo, right-clicking is quick. But if you want to "delete all photos taken in 2023 that are larger than 5MB and in PNG format," the mouse can't help — you'd have to manually filter for ages.
- **CLI (commands)**: Good for "describing what you want to do." The above requirement only needs one line of command, and the computer will automatically find and process matching files — even if there are 10,000 of them.

#### 2. Commands Can Be Recorded and Reused

- **GUI**: Configuring an environment requires dozens of menu clicks. When you switch to a new computer, you have to re-do everything from memory — and it's easy to miss steps.
- **CLI**: You can write all commands into a file (a script). Next time, just run that file and the computer will reproduce your operations with **zero errors**. This is the foundation of "automation."

#### 3. The Only Option for Remote Control

- **GUI**: Transmitting visuals is like watching HD video — it requires very high bandwidth. If the network is even slightly slow, the mouse stutters and becomes unusable.
- **CLI**: Only plain text is transmitted — just a few dozen characters. Even in a remote mountain area with poor signal, you can smoothly control a data center server on the other side of the planet.

**Summary**: GUI is for **exploration** (browsing the web, viewing images), CLI is for **production** (development, operations, batch processing). As developers, we use the terminal because it is **more precise, more controllable, and more efficient**.

## 1. Concept Definition: Overview of a Terminal

_Different operating systems have different-looking terminals, and **different command syntax**. Click the buttons below to switch views — notice how macOS, Windows, and Linux use different commands (e.g., `dir` vs `ls`) to do the same thing:_

<TerminalOSDemo />

Before graphical user interfaces (GUIs) became widespread, the terminal was the primary way humans interacted with computers. Even today, it remains the most precise and efficient tool for developers to control a computer.

<TerminalDefinition />

At its core, a terminal is a **character stream input/output environment**:

- **Input**: Send instructions via the keyboard (character signals).
- **Output**: Display text feedback on a screen grid.

It doesn't handle complex graphics, images, or video — it focuses on **text-based interaction**.

## 2. Core Architecture: The Art of Decoupling (The Big Picture)

Before diving deeper, consider this question: **Does the terminal window itself actually understand what you're saying?**

In reality, the terminal is like a **display that only relays messages**. When you type the `date` command, the terminal doesn't know it means "show the date" — it just packages those 4 letters and sends them to the real boss behind the scenes: **the Shell**.

The Shell is the "brain" that can understand your commands and direct the computer to do the work.

To understand how they work together, let's look at these three components with clear roles. The best analogy for understanding their relationship is that of a **web browser** and a **web server**.

### 2.1 Role Division

- **🖥️ Terminal — Like the "Browser"**
  - **Responsibility**: It only handles **input** (relaying your keystrokes to the other party) and **display** (rendering the characters sent back on screen).
  - **Characteristic**: It has **no intelligence of its own** and doesn't understand what `ls` or `cd` means. It's like the Chrome browser — whether you visit Baidu or Google, it just renders the page.
  - _Common terminals_: Windows CMD/PowerShell window, macOS Terminal.app, VS Code's built-in terminal.

- **🧠 Shell — Like the "Web Server"**
  - **Responsibility**: It's the logical brain. It runs in the background, **receiving** the command strings you send, **parsing** their meaning, and then **directing** the operating system to execute them.
  - **Characteristic**: It's invisible and intangible, communicating only through text streams.
  - _Common Shells_: Bash, Zsh, Fish, PowerShell.

- **⚙️ Kernel — The "Grand Manager" Behind the Scenes**
  - **Responsibility**: The core of the operating system — only it can directly control hardware (read/write disks, allocate memory, control the CPU).
  - **Relationship**: The Shell is the kernel's "secretary," translating your human language into something the kernel can understand.

### 2.2 Motivation for separating Them (Replaceability)

Because the **display layer** (terminal) and the **logic layer** (Shell) are completely separate, they can be freely combined:

- **Change the "skin"**: On macOS, you can use the built-in Terminal, download iTerm2, or use VS Code's terminal. They look different but all connect to the same Shell (zsh), so the commands are identical.
- **Change the "brain"**: In the same terminal window, you can switch from bash to zsh, or to a Python interactive session. The terminal hasn't changed, but the logic processing commands has.

### 2.3 Interaction Flow: The Vanishing Keystroke

You might think: _"I press 'a' on the keyboard, and the terminal draws 'a' on the screen."_
**Wrong!** The real process works like this (called **Echo**):

1. **Press 'a'**: The keyboard signal is sent to the terminal.
2. **Send signal**: The terminal sends the encoding of 'a' to the Shell.
3. **Shell processes it**: The Shell receives 'a', finds no issue, and sends 'a' back to the terminal unchanged.
4. **Display character**: The terminal receives the 'a' sent back by the Shell and only then draws it on screen.

> 💡 **Mini experiment**: Some commands (like when entering a password) disable the Shell's echo function. At that point, you press keys and the terminal sends them to the Shell, but the Shell **doesn't send anything back**, so the screen stays blank. This is a privacy protection measure.

**One-sentence summary of the flow**:
You type in the terminal ➡️ signal goes to the Shell ➡️ Shell sends it back unchanged (you see the characters) and interprets it ➡️ Shell directs the kernel to do the work.

_The demo below illustrates this process. Watch the "wall" between the Shell and kernel, and how characters travel back and forth:_

<ArchitectureDemo />

## 3. Visual Model: The Grid System

Unlike modern graphical interfaces that use "pixels," the terminal's display foundation is the **character grid (Character Grid)**.
The terminal screen is divided into rows and columns, and each cell is called a **cell (Cell)**.

### 3.1 Cell Composition

Each cell is the smallest unit of terminal display, containing two types of core information:

1. **Glyph**: The actual displayed character (e.g., `A`, `中`, `$`).
2. **Attributes**: The character's styling (e.g., foreground color, background color, bold, underline).

When you resize the terminal window, you're essentially changing the grid's **rows** and **columns**.

_Try interacting with the area below and observe how the grid carries characters:_

<TerminalGrid />

### 3.2 Style Inspection

The terminal cannot display images — all "interfaces" are achieved through combinations of character colors and styles.

_Click on the cells below to see the style attributes behind each one:_

<CellInspector />

## 4. Communication Protocol: Escape Sequences

You might wonder: if the terminal only transmits text, how are colored text, moving cursors, and screen clearing achieved?

The answer is **escape sequences (Escape Sequences)**.
These are special character instructions (usually starting with the `ESC` character). When the terminal receives these characters, it **doesn't display them on screen** but instead interprets them as **control commands**.

For example:

- Regular character `A` → draw A on screen.
- Sequence `\033[31m` → **command**: set subsequent text color to red.
- Sequence `\033[2J` → **command**: clear the screen.

This is like an agreement with a friend: if I speak normally, you write it down; if I raise my left hand (equivalent to `ESC`), the next sentence is a command, not content.

_Click the "play" button below to watch the terminal process the character stream one by one and identify hidden commands:_

<EscapeParserDemo />

_The component below shows more types of escape sequences and their rendering effects:_

<EscapeSequences />

## 5. Input Mechanism: Byte Stream

The input process is often misunderstood. When you press a key, the terminal doesn't directly "draw" the character on screen — it performs an **encoding transmission**.

1. **Key capture**: The terminal captures your physical key press.
2. **Encoding conversion**: Converts the key press into a specific **byte sequence**.
   - Pressing `a` → sends byte `a`.
   - Pressing `Up Arrow` → sends sequence `^[[A`.
3. **Send**: Sends the byte stream to the Shell or the currently running program.

**Key point**: All key presses (including function keys and mouse clicks) are **byte data** at the transmission level.

_Try pressing keys below and observe how your input is converted to underlying data:_

<InputVisualizer />

## 6. Running Modes: Typewriter vs. Game Console (Cooked vs. Raw Mode)

The terminal has two very different "personalities." Understanding this helps you see why **typing commands** and **playing Snake** in the terminal are completely different experiences.

- **Cooked Mode — Like a Typewriter**
  - This is the default mode.
  - **Behavior**: Characters you type are **temporarily held** by the terminal until you press Enter.
  - **Benefit**: This gives you a chance to correct mistakes. Made a typo? Press Backspace to delete and retype — the program never knows you made a mistake.
  - _Use case: Typing everyday commands (like `ls`, `cd`)._

- **Raw Mode — Like a Game Controller**
  - This is the "expert" mode.
  - **Behavior**: Every key you press (including arrow keys, Ctrl combinations) is **instantly** sent to the program with no buffering.
  - **Benefit**: The program can respond to your actions in real time.
  - _Use case: Playing terminal games (like Snake), using the Vim editor (a keyboard-only editor)._

_Click the buttons below to switch modes and experience the different "feel" of "writing a letter" vs "playing a game":_

<CookedRawDemo />

## 7. Process Control: Signals

Pressing `Ctrl+C` in the terminal usually stops a program. This isn't achieved by sending characters — it triggers a **signal (Signal)**.

Signals are an operating system-level notification mechanism used to tell a program that a specific event has occurred.

- **Ctrl+C** → sends `SIGINT` (Interrupt): notifies the program "please interrupt the current operation."
- **Ctrl+Z** → sends `SIGTSTP` (Suspend): notifies the program "please pause and suspend to background."

This mechanism bypasses the standard data input channel, ensuring users retain control even when a program is frozen.

<SignalsDemo />

## 8. Advanced Application: Full-screen Interfaces & Buffers

Have you noticed that when you edit a file with `vim` or check system status with `htop`, they take over the entire screen? And when you exit, the screen instantly returns to its previous state with all your command history intact?

This is because the terminal has two "canvases" that switch back and forth:

- **Primary Buffer — Like a Scratchpad**
  - You write a line, the system responds with a line.
  - When it's full, it scrolls — everything you wrote before is still there.
  - _Used for: Everyday command typing._

- **Alternate Buffer — Like a Blackboard**
  - The program wipes the blackboard clean and draws on it (full-screen display).
  - No matter what's drawn, it never affects the scratchpad on your desk.
  - When you exit the program, it's like putting the blackboard away — you're back to your scratchpad.
  - _Used for: Vim, Nano, games, and other full-screen software._

_Click the button below to experience how the "scratchpad" and "blackboard" switch instantly:_

<BufferSwitchDemo />

---

## 9. Summary

The terminal is not a mysterious black box — it's a standardized text interaction interface.

- **Display**: Based on grids and characters.
- **Control**: Based on escape sequences.
- **Interaction**: Based on input/output streams and signals.

By understanding these underlying principles, you no longer need to blindly memorize commands — you can truly understand the logical flow behind every keystroke.

## Appendix: Common Terminology (Vocabulary)

| Term | English | Explanation |
| :--- | :------ | :---------- |
| **Terminal** | Terminal | The window program responsible for display and input (front-end). |
| **Shell** | Shell | The program responsible for parsing commands and executing logic (back-end). |
| **CLI** | Command Line Interface | A text-based interaction method. |
| **TUI** | Text User Interface | A pseudo-graphical interface built with characters in the terminal. |
| **Escape Sequence** | Escape Sequence | Special character instructions used to control terminal cursor, colors, etc. |
| **Standard Input/Output** | Stdin/Stdout | Standard channels for programs to receive and output data. |

## References

- [How Terminals Work](https://how-terminals-work.vercel.app/): The structure and demonstrations in this article are deeply inspired by this project. If you want to dive deeper into engineering implementation details, we highly recommend reading the original tutorial.
