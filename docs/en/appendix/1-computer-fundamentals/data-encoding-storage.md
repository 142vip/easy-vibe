# Data Representation Principles: Encoding, Storage, and Transmission

::: tip Preface
When you send a photo to a friend, post a WeChat message, or download a multi-GB game, how does that information travel across half the globe and appear intact on your screen? This chapter revolves around a question that often puzzles beginners: **Why did my received file turn into garbled text?** Following this question, we'll thoroughly uncover the three foundational pillars of computing: **encoding, storage, and transmission**.
:::

**What will you learn from this article?**

After completing this chapter, you will gain:

- **Garbled text troubleshooting**: When encountering "file opens as garbled text," you'll be able to analyze the cause from an encoding perspective rather than simply assuming "the file is corrupted"
- **Cross-platform awareness**: When handling data exchange, you'll know why encoding formats and byte order matter
- **Encoding worldview**: Understand how computers represent everything in the world using 0s and 1s — from text to images to complex objects
- **Foundation for further learning**: Build a foundation for network protocols, file formats, and serialization technologies

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Character Encoding | ASCII, UTF-8, GBK |
| **Chapter 2** | Data Storage | Binary, byte order |
| **Chapter 3** | Data Transmission | Serialization, compression |

Before we begin, we need to clarify a physical fact that beginners often overlook:

Computers are actually extremely "rigid." They don't recognize Chinese characters, don't understand colors, and can't comprehend Jay Chou's songs.

At their lowest level, they consist of countless tiny semiconductor switches, and **they can only repeatedly determine "on (1)" or "off (0)."**

Since computers only understand 0s and 1s, how do we make them display colorful images and complex text?

The answer is: **we create a "codebook."**

We agree with the computer: if the underlying electrical signal sends `01000001`, it should draw the English letter `A` on screen; if it sends another signal sequence, it should display the color red.

This **process of creating and using a codebook for back-and-forth translation is called "Encoding."**

Once you understand the logical starting point that "everything in a computer is essentially code," you can instantly understand the most common spooky phenomenon — garbled text — and how it's produced.

---

## 0. Introduction: The Significance of Data Representation

Imagine you receive an important document from a colleague. You double-click to open it, and it's full of strange text like "浣犲ソ" or "ä½ å¥½."

Your first instinct is probably: was the file corrupted during transmission? Was there packet loss?

But in reality, the vast majority of so-called "file corruption" has only one true cause — **your computer "used the wrong reading rules."**

**Try it out below**:

Try switching between different "decoding codebooks" in the simulator below to read the same underlying byte sequence.

<GarbledTextDemo />

**Core Insight: Mismatched Codebooks**

Bytes (sequences of 0s and 1s) have no inherent meaning on their own. It's the **encoding rules** devised by humans that give them meaning.

This is like a string of Morse code "dit dit dah." If you look it up in a Chinese telegraph codebook, it's one character; if you look it up in a US military codebook, it's a different character.

**The sender used the UTF-8 codebook to translate Chinese characters into numbers and sent them to you. If you insist on using the GBK codebook to interpret those numbers, what you get is of course all garbled text.**

To thoroughly understand why undamaged data becomes garbled, we need to understand the complete chain of data processing. That is, the "life cycle" of data: **encoding**, **storage**, **transmission**.

---

## 1. Data Encoding: The Digital Representation of Everything

Simply put:

> **Data encoding** is the creation of a "bidirectional translation dictionary" that maps the diverse and complex information of the real world (text, colors, sounds) into the 0s and 1s that computers can understand.

### 1.1 Turning Text into Numbers: From ASCII to Unicode

Every time we type in WeChat, with each key press, the computer is secretly doing one thing: **table lookup and replacement.**

**Phase 1: ASCII's Small World**

When computers were first invented, Americans thought the world only had 26 English letters, digits, and some punctuation marks, so they created a very thin codebook called **ASCII**.

It defined only 128 symbols, such as specifying that the number `65` represents the uppercase letter `A`. Since there are so few characters, the space of **1 byte (equal to 8 bits)** can accommodate 256 variations — more than enough.

**Phase 2: The Warring States Period of Encodings**

But later, computers went global. People realized: **Chinese has tens of thousands of characters, Japanese has kana — 1 byte simply can't hold them all!**

So China created the GBK codebook (using 2 bytes to store one Chinese character), Japan created Shift_JIS... the world descended into chaos. A webpage made in China, when sent to an American client whose computer didn't have the GBK dictionary, would open as garbled text.

**Phase 3: The Unification of Unicode**

Finally, the great minds of the computing world sat down together and said: "Let's stop doing our own thing. Let's create a super dictionary that includes every symbol on Earth!" This is the famous **Unicode**. It assigns a unique number to every character in the world — even every Emoji you use daily.

And **UTF-8**, which you've probably heard of, is currently the most popular "storage rule" for the Unicode dictionary. Its cleverest feature is being **variable-length**: English characters use only 1 byte, Chinese characters use 3 bytes, making it very space-efficient.

**Try it out below**:

Type any mix of Chinese, English, or Emoji in the input box below (e.g., `你好 Hello`), and see how the computer "looks up the table" to allocate storage space.

<CharacterEncodingExplorer />

**Surprising discoveries**:

- An English letter takes only **1 byte** in UTF-8.
- A typical Chinese character takes **3 bytes**.
- An Emoji (🎉) requires **4 bytes**!

> **Fun fact**: Why do many people feel that sending a text message of the same length allows much more English text than Chinese? Because in the underlying electrical signal sequence, the physical size of Chinese characters is three times that of English!

### 1.2 Multimedia Data Encoding

Text can be looked up in a table, but what about the Mona Lisa's smile or Jay Chou's singing? How do they become 0s and 1s?

The method is the same: **slicing and mapping.**

* **Image encoding**:
  Zoom into a photo infinitely, and it's actually composed of millions of tiny glowing squares (pixels). We just need to assign a number to each color (e.g., `#FF0000` for red), then store the numbers for millions of squares. The photo becomes numbers.

  **Try it out below**: Hover over the small squares on the left canvas to see how image colors map to hexadecimal codes.
  <ImageEncodingDemo />

* **Audio encoding**:
  Sound is essentially vibrations of air. If we measure the height of this wave 44,100 times per second (sampling) and record the height values, the continuous sound wave becomes a discrete array of numbers.

  **Try it out below**: Drag the slider to see how a continuous analog sound wave gets "sliced" into digital audio.
  <AudioEncodingDemo />

---

## 2. Data Storage: Persistence Before Transmission

After data is encoded and ready to be sent to someone else, it must first be placed on the computer's physical media. This brings up an unavoidable hardware law.

You might think: **"Since everything needs to be stored, why not just store everything in the fastest read/write location?"**

However, in the hardware world, there's an eternal curse of not being able to have your cake and eat it too: **faster storage media are typically more expensive to manufacture and have smaller capacities.**

To get the fastest possible computer operation with the least money, computer scientists designed the **storage hierarchy** (also known as the storage pyramid).

**Try it out below**:

Click on different levels of the pyramid to see how modern computers carefully manage costs.

<StoragePyramidDemo />

**Core Insight: The Operating System's Porter Philosophy**

There is no perfect storage device. Therefore, the operating system (like Windows, macOS) acts like an extremely clever, tireless warehouse manager:

1. It stuffs massive amounts of movies and games into the slow but large (and cheap) warehouse — **SSD or HDD**.
2. When you want to play a game, it quickly moves the relevant high-resolution texture files from the hard drive to the extremely fast but capacity-limited workbench — **RAM**.
3. When you close the game, it clears the RAM to make room on the workbench for other files.

> **Aha moment**: When you play a large open-world game and encounter long black screens during scene transitions (loading screens), it's essentially because the hard drive warehouse is too slow. The porter (the OS) is working frantically to move the next map's data to the RAM workbench.

---

## 3. Data Transmission: Cross-Device Data Transfer

After data is encoded and stored in memory, the next step is sending it to your friend.

> **Data transmission** is the process of sending electrical signals (or optical signals) representing 0s and 1s through network cables, fiber optics, or radio waves, accurately from one machine to another.

### 3.1 Hardware and LAN Transmission: The Physical Limit of a Wire

Inside a computer case, or between two computers that are very close together, we face a **pure physical challenge**.

Many people's first idea is: "One wire sends one signal at a time, so if I connect 8 wires in parallel, won't the speed be 8 times faster?"
This was the thinking behind the **parallel transmission** used in early hard drive connections.

However, today's phone Type-C ports, external USB connections, and internal PCIe interfaces on motherboards all use **serial transmission** (with only one main channel sending data).

**Try it out below**:
Compare the animations of serial and parallel transmission.

<DataTransmissionDemo />

**Why did "one small road" beat the "eight-lane highway"?**

At low speeds, 8 wires are indeed better. But when we need to send billions of signals per second, problems arise:
The weak currents on parallel wires create strong electromagnetic interference with each other (crosstalk). Moreover, you simply cannot guarantee that 8 signals sent simultaneously from the transmitter will all arrive at the finish line at **exactly the same time**. If even one wire is slightly slower due to impurities and resistance, the 8 bits combined into one byte are completely scrambled.

So rather than spending a fortune trying to equalize 8 race tracks, it's better to pour all technical resources into 1 race car and push it to light speed. This is the physical truth behind serial interfaces' dominance.

### 3.2 WAN and Internet Transmission: The Art of Loss-Proof Delivery Across Oceans

What if your data isn't going to a graphics card one inch away inside the case, but to a server in the United States on the other side of the ocean?

A single continuous wire is impossible. Data must traverse fiber optic cables, submarine stations, and countless aging routers. At this point, the challenge is no longer physical limits but **fault-tolerance and preservation**.

When you send a 1GB large video via WeChat, the underlying logic is much like an international move — you can't just throw the entire container at the postal service.

1. **Packetization**: The network slices the video into tens of thousands of envelope-sized "packets" (typically 1500 bytes each).
2. **Checksum**: To prevent a submarine fiber optic cable from being bitten by a shark, causing a `0` in some packet to flip to a `1`, the system calculates a "fingerprint code" using a complex mathematical formula and attaches it to the envelope before sending.
3. **TCP Retransmission and Acknowledgment**: The recipient receives the envelope and verifies the fingerprint code themselves. If it doesn't match (damaged en route), or if the sequence number jumps from 31 to 33 (packet loss), they shout across the network: **"I didn't receive #32, please resend #32!"**

Thanks to this extremely rigorous packet-slicing and verification mechanism called **TCP (Transmission Control Protocol)** at the lowest level, even if you download a WeChat file in a basement or on highly unstable WiFi for half an hour, the moment the download completes, the file is guaranteed to be 100% intact with 0 corruption.

---

## 4. Case Study: End-to-End Pipeline from Image Capture to Network Sharing

Earlier, we covered "how to translate into numbers (encoding)," "where to store it (storage)," and "how to complete the journey intact (transmission)" as separate modules.

Now let's put these building blocks together and immersively watch an incredibly ordinary everyday operation: **taking a photo that automatically backs up to the cloud.**

In the one second after you press the shutter, an incredibly grand digital war has already erupted inside your phone.

**Try it out below**:

Click "Execute this step" to track the thrilling complete life journey of this data.

<PhotoUploadJourneyDemo />

---

## 5. Terminology Reference

When reading other documentation, you may encounter the following jargon. Here's a quick reference table:

| Term / Abbreviation | Description |
| :--- | :--- |
| **Bit (b)** | The smallest unit in the computing world — can only be 0 or 1. |
| **Byte (B)** | 8 Bits bundled together make one Byte. It's the most basic unit of measurement for file size. |
| **Character Set** | Like a "dictionary's table of contents" — specifies that a certain character exists, without defining exactly how it's stored on disk. |
| **Encoding** | The specific "storage rules" that determine which bytes correspond to a character in the dictionary (e.g., UTF-8). |
| **RAM** | Extremely fast workspace that clears when power is lost. Your phone's 8G/16G RAM refers to this. |
| **SSD** | The modern computer's warehouse for permanent data storage, based on flash memory chips, tens of times faster than old mechanical hard drives. |
| **Serial / Parallel** | Serial is one channel with data racing through in single file; parallel is multiple channels advancing side by side (but not suitable for extremely high frequencies). |
| **Checksum** | A verification code attached during data transmission. The recipient calculates it, and if it matches what's written on the package, the data is intact. |
| **TCP** | The cornerstone protocol of the internet. Responsible for slicing large files, adding sequence numbers, and retransmitting lost packets to ensure data is delivered 100% intact. |

---

## Summary

The many questions raised at the beginning of this article — now you have the answers from a system-level perspective:

- **Why does the same file become garbled when you receive it?**
  The data isn't corrupted — your reading software just picked the wrong codebook (an encoding issue).

- **Why are most cables behind computers now a single small Type-C, yet faster than the wide cables from before?**
  Because before it was several horse carts running in parallel and easily colliding (parallel), and now it's a bullet train racing at top speed on a dedicated track (serial).

- **Why do large games have long black loading screens when switching scenes?**
  Because they need to frantically move massive files of dozens of GB from the slow hard drive (storage area) to the fast but expensive RAM (core workspace).

The essence of computers is actually very simple:

**It's simply a machine that excels at "converting" all light, shadow, and text (encoding), "storing" them on some silicon chip (storage), and then "mailing" them out as chopped-up electrical pulses (transmission).**

Once you understand this cyclical process, you truly hold the key to unlocking the door to the fundamental principles of computing.
