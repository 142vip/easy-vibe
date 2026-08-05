# Introduction to Algorithms

::: tip Preface
**How do you solve problems efficiently?** You may have encountered this frustration: for the same problem, someone's code finishes in seconds while another's keeps running for minutes. The difference often comes down to algorithms. This chapter will help you understand the core mindset behind algorithms.
:::

**What will you learn from this article?**

After completing this chapter, you will gain:

- **Problem decomposition skills**: When facing complex problems, you'll think of strategies like divide-and-conquer and recursion instead of jumping straight into writing code
- **Efficiency judgment**: Use Big O notation to determine which solution is more efficient, rather than guessing by feel
- **Complexity awareness**: Estimate data scale and time requirements before writing code, and choose the appropriate algorithmic level
- **Foundation for further learning**: Build a foundation for advanced data structures, distributed systems, and machine learning

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Binary Search | Divide-and-conquer, O(log n) |
| **Chapter 2** | Sorting Algorithms | Bubble sort, quick sort, merge sort |
| **Chapter 3** | Complexity Analysis | Time complexity, space complexity |

---

## 0. Big Picture: Algorithms Overview

Imagine you need to find a word in a dictionary:

- **Method 1**: Start from the first page and flip through one by one (linear search)
- **Method 2**: Locate by first letter, then use binary search (binary search)

Both methods can find the word, but their efficiency is worlds apart. **An algorithm is simply a method for solving a problem.**

<AlgorithmDemo />

**Core metrics of algorithms:**

| Metric | Meaning | Why It Matters |
|------|------|-----------|
| **Time Complexity** | How running time grows as data volume increases | Predicts performance at scale |
| **Space Complexity** | How memory usage grows as data volume increases | Evaluates memory consumption |
| **Correctness** | Whether it always produces correct results | A fundamental requirement for algorithms |

::: tip Line-by-Line Guide to This Table
**Time Complexity**: Described using Big O notation. O(n) means doubling the data doubles the time; O(n²) means doubling the data quadruples the time.

**Space Complexity**: Also uses Big O notation. Some algorithms trade space for time (like hash tables), while others trade time for space (like compression algorithms).

**Correctness**: An algorithm must produce correct results for all possible inputs. Edge cases (empty input, extremely large input) are the most error-prone.
:::

---

## 1. Binary Search: Eliminate Half Each Time

### 1.1 How Binary Search Works

::: tip How Does Binary Search Work?
**Prerequisite**: Data must be sorted

**Process**:
1. Find the middle element
2. If the middle element equals the target, found it!
3. If the target is less than the middle element, continue in the left half
4. If the target is greater than the middle element, continue in the right half
5. Eliminate half each time until found or confirmed not to exist

**Time Complexity**: O(log n)

**Real-life analogy**: The number guessing game. I think of a number from 1-100, you guess the middle each time, and I tell you if it's higher or lower. You can guess it in at most 7 tries (because 2⁷ = 128 > 100).
:::

**Try it out below**:
This demo shows how binary search works. You can choose linear search or binary search to compare:

<SearchAlgorithmDemo />

### 1.2 Time Complexity Analysis of Binary Search

| Data Volume | Linear Search | Binary Search |
|--------|---------|---------|
| 100 | 100 times | 7 times |
| 1,000 | 1,000 times | 10 times |
| 1,000,000 | 1,000,000 times | 20 times |
| 1,000,000,000 | 1,000,000,000 times | 30 times |

::: tip Line-by-Line Guide to This Table
**First column (Data Volume)**: How much data to search through. You can see the data volume growing from 100 to 1 billion (a 10 million-fold increase!)

**Second column (Linear Search)**: The most "basic" method — start from the beginning and check one by one. The number of searches equals the data volume; the larger the data, the more searches needed.

**Third column (Binary Search)**: The smart method — eliminate half each time. The number of searches only depends on the logarithm of the data volume. Even with 1 billion items, you only need 30 searches!

**Comparison conclusion**: When the data volume reaches 1 million, linear search needs 1 million comparisons while binary search only needs 20 — a difference of 50,000 times!
:::

::: tip The Power of Logarithmic Growth
The time complexity of binary search is O(log n), which means:

- 1 billion items: at most 30 searches
- 1 trillion items: at most 40 searches

This is the power of logarithmic growth — when data increases 1000 times, the number of searches only increases by 10.
:::

---

## 2. Sorting: Turning Chaos into Order

### 2.1 Common Sorting Algorithms

| Algorithm | Time Complexity | Characteristics | Use Cases |
|------|-----------|------|---------|
| **Bubble Sort** | O(n²) | Simple but slow | Teaching, small datasets |
| **Selection Sort** | O(n²) | Simple but slow | Small datasets |
| **Insertion Sort** | O(n²) | Fast for nearly sorted data | Small datasets, nearly sorted |
| **Quick Sort** | O(n log n) | Fastest in practice | General-purpose sorting |
| **Merge Sort** | O(n log n) | Stable sort | Scenarios requiring stability |
| **Heap Sort** | O(n log n) | In-place sort | Memory-constrained scenarios |

::: tip Line-by-Line Guide to This Table
**Bubble Sort**: The most basic sorting algorithm, like bubbles rising from the bottom of water. Simple and easy to understand, but the slowest. Suitable for learning sorting concepts, not for practical use.

**Selection Sort**: Each time it selects the smallest element and places it at the front. Also simple, but regardless of whether the data is sorted or not, it performs the same number of comparisons.

**Insertion Sort**: Like organizing cards in your hand while playing poker. Insert each element into the already-sorted portion. Very efficient for nearly sorted data.

**Quick Sort**: The most commonly used sorting algorithm in real-world development. Fastest on average, but worst case (already sorted data) degrades to O(n²).

**Merge Sort**: Uses the "divide and conquer" approach, always O(n log n), but requires extra space. Suitable for scenarios requiring stable sorting.

**Heap Sort**: Sorting using the heap data structure. In-place (no extra space needed), but in practice often slower than quick sort.
:::

### 2.2 Complexity Analysis of Quick Sort

::: tip How Quick Sort Works
**Core idea**: Divide and conquer

1. Select a "pivot" element
2. Place elements smaller than the pivot on the left, larger ones on the right
3. Recursively sort the left and right parts
4. Merge the results

**Why is it fast?**
- After each partition, the pivot element is in its final position
- On average, each partition eliminates about half the elements
- Time complexity O(n log n)

**Real-life analogy**: Organizing a bookshelf. Pull out one book, put thinner books to its left and thicker ones to its right. Then repeat this process for each side.
:::

**Try it out below**:
This demo visualizes sorting algorithms. Generate an array and observe the comparison between bubble sort and quick sort:

<SortingAlgorithmDemo />

---

## 3. Recursion: Calling Yourself

### 3.1 The Essence of Recursion

::: tip What Is Recursion?
**Recursion** is a programming technique where a function calls itself.

**Two key elements**:
1. **Base case**: When should the recursion stop?
2. **Recursive step**: How to break the problem into smaller sub-problems?

**Classic example: Factorial**
```js
function factorial(n) {
  if (n <= 1) return 1        // Base case
  return n * factorial(n - 1) // Recursive step
}
```

**Real-life analogy**: Russian nesting dolls. Open one doll and inside is a smaller one, until you reach the smallest one that can't be opened.
:::

### 3.2 Recursion vs Iteration

| Feature | Recursion | Iteration (Loops) |
|------|------|-------------|
| **Code conciseness** | Usually more concise | May be more complex |
| **Memory consumption** | Higher (call stack) | Lower |
| **Performance** | Slightly slower (function call overhead) | Faster |
| **Use cases** | Tree traversal, divide-and-conquer algorithms | Simple repetitive tasks |

::: tip Line-by-Line Guide to This Table
**Code conciseness**: Recursion usually requires only a few lines to express complex logic (like traversing tree structures), while loops may need more variables and nesting.

**Memory consumption**: Recursion uses a "call stack" to store information at each level, like stacking plates — each recursive call adds another plate. Loops don't have this overhead.

**Performance**: Each function call has overhead (parameter passing, stack operations, etc.), so recursion is usually slower than loops.

**Use cases**: Recursion excels at problems with inherently recursive structures (like file trees, DOM trees); loops excel at simple repetitive operations (like iterating through arrays).
:::

::: warning Pitfalls of Recursion
**Stack overflow**: When recursion goes too deep, the call stack space is exhausted.

**Solutions**:
- Switch to iteration
- Use tail recursion optimization (supported by some languages)
- Limit recursion depth
:::

**Try it out below**:
This demo shows the recursive call process. Observe how a function calls itself:

<RecursiveThinkingDemo />

---

## 4. Greedy Algorithms: Choose the Best at Each Step

### 4.1 The Greedy Approach

::: tip What Is a Greedy Algorithm?
A **greedy algorithm** makes the locally optimal choice at each step, hoping to find a globally optimal solution.

**Applicable conditions**:
1. **Greedy choice property**: Local optimality leads to global optimality
2. **Optimal substructure**: The optimal solution to the problem contains optimal solutions to sub-problems

**Classic example: Coin change**
- Goal: Make a specific amount using the fewest coins
- Greedy strategy: Always pick the largest coin
- Result: 67 yuan = 50 + 10 + 5 + 1 + 1 (5 coins)

**Real-life analogy**: When climbing a mountain, always take the steepest path upward. While you may not reach the highest peak, you'll usually reach a good position.
:::

### 4.2 Limitations of Greedy Algorithms

::: warning Greedy Doesn't Always Find the Optimal Solution
**Counter-example: Coin change**

If coin denominations are [1, 3, 4] and you need to make 6:
- Greedy: 4 + 1 + 1 = 3 coins
- Optimal: 3 + 3 = 2 coins

The greedy algorithm fails here!

**Lesson**: Greedy algorithms are simple and efficient, but they don't always produce optimal solutions. You need to prove the problem satisfies greedy conditions before using one.
:::

**Try it out below**:
This demo shows the practical effects of greedy algorithms. Try different coin combinations and observe the greedy strategy's performance:

<GreedyThinkingDemo />

---

## 5. Algorithm Design Paradigms

| Paradigm | Idea | Typical Algorithms | Applicable Problems |
|------|------|---------|---------|
| **Divide and Conquer** | Break problems into smaller sub-problems | Quick sort, merge sort | Decomposable problems |
| **Greedy** | Choose the best at each step | Minimum spanning tree, Huffman coding | Problems with greedy properties |
| **Dynamic Programming** | Record solutions to sub-problems | Knapsack problem, shortest path | Problems with overlapping sub-problems |
| **Backtracking** | Trial and error; backtrack when stuck | Eight queens, permutations | Search problems |

::: tip Line-by-Line Guide to This Table
**Divide and Conquer**: Break big problems into small ones, solve them separately, then combine. Like cleaning a house — divide it into living room, bedroom, and kitchen, clean each separately, and the whole house is tidy.

**Greedy**: Always pick the best option at the moment, without considering long-term consequences. Like eating your favorite dish first at a meal — may not be the optimal eating strategy, but it's fast.

**Dynamic Programming**: Remember intermediate results to avoid redundant computation. Like taking notes — next time you encounter the same problem, just look up the answer instead of re-deriving it.

**Backtracking**: When you hit a dead end, go back and try another path. Like navigating a maze — when one path doesn't work, return to the last intersection and try another route.
:::

**Try it out below**:
This demo shows the characteristics and application scenarios of different algorithm design paradigms:

<AlgorithmParadigmDemo />

---

## 6. Summary: Core Ideas of Algorithm Design

Let's summarize various algorithmic ideas with analogies:

| Idea | Analogy | Key Takeaway |
|------|------|---------|
| **Binary Search** | Number guessing game | Eliminate half each time |
| **Sorting** | Organizing a bookshelf | Establish order |
| **Recursion** | Russian nesting dolls | Break big into small |
| **Greedy** | Choosing a mountain path | Local optimality |

::: tip Core Insight
**The essence of algorithms is the balance between "efficiency" and "correctness."**

- Good algorithms can improve program efficiency by orders of magnitude
- But over-optimization may introduce complexity
- Ensure correctness first, then pursue efficiency

Understanding algorithmic thinking is more important than memorizing specific algorithms:
- Divide and conquer: Break big problems into small ones
- Greedy: Choose the best at each step
- Dynamic programming: Record solutions to sub-problems
- Backtracking: Trial and error; backtrack when stuck
:::

---

## Further Reading

- **Introduction to Algorithms**: A classic textbook for systematic study of algorithms
- **LeetCode**: Improve your algorithm skills through practice problems
- **Algorithm Visualization**: Intuitively understand algorithm execution processes
- **Competitive Programming**: Learn more advanced algorithmic techniques
