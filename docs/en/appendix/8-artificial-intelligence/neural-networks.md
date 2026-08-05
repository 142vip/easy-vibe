# Fundamentals of Neural Networks and Deep Learning

::: tip Preface
**Neural networks are the engine of the AI revolution.** From ChatGPT's language understanding to image recognition in autonomous driving, neural networks are what's working behind the scenes. It's not magic — it's an elegant mathematical framework that "learns" the mapping from input to output through large amounts of data. Understanding the fundamentals will help you use and debug AI tools more effectively.
:::

**What will you learn in this article?**

After completing this chapter, you'll gain:

- **Core concepts**: Understand the basic principles of neurons, layers, forward propagation, and backpropagation
- **Network types**: Learn the characteristics and suitable use cases of mainstream architectures like CNN, RNN, and Transformer
- **Training process**: Understand how models "learn" from data
- **Key techniques**: Master practical concepts like overfitting, learning rate, and regularization
- **Development history**: Understand the evolution from the Perceptron to large language models

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | From Neuron to Network | Perceptron, activation functions, forward propagation |
| **Chapter 2** | How Networks Learn | Loss functions, gradient descent, backpropagation |
| **Chapter 3** | Mainstream Network Architectures | CNN, RNN, Transformer |
| **Chapter 4** | The Art of Training | Overfitting, regularization, hyperparameter tuning |
| **Chapter 5** | Development History and Frontiers | From Perceptron to GPT |

---

## 1. From Neuron to Network

### A Single Neuron

The smallest unit of a neural network is the **neuron**. It mimics how biological neurons work: receiving multiple input signals, computing a weighted sum, and producing an output through an activation function.

```
Input x1 ──→ ×w1 ──┐
Input x2 ──→ ×w2 ──┼──→ Σ(weighted sum) + b(bias) ──→ f(activation function) ──→ Output
Input x3 ──→ ×w3 ──┘
```

Mathematical expression: **y = f(w₁x₁ + w₂x₂ + w₃x₃ + b)**

<NeuronDemo />

### Activation Functions: Why Nonlinearity Matters

Without activation functions, no matter how many layers of neurons you stack, the result is always equivalent to a single linear transformation (matrix multiplication). Activation functions introduce **nonlinearity**, enabling the network to learn complex patterns.

| Activation Function | Formula | Characteristics | Common Use Cases |
|---------|------|------|---------|
| ReLU | max(0, x) | Simple, efficient, fast training | Default choice for hidden layers |
| Sigmoid | 1/(1+e⁻ˣ) | Output range 0~1 | Binary classification output layer |
| Tanh | (eˣ-e⁻ˣ)/(eˣ+e⁻ˣ) | Output range -1~1 | Commonly used in RNNs |
| Softmax | eˣᵢ/Σeˣⱼ | Outputs a probability distribution | Multi-class classification output layer |

### From Neuron to Network

Organize multiple neurons into **layers**, and connect multiple layers in sequence to form a neural network:

```
Input Layer      Hidden Layer 1        Hidden Layer 2        Output Layer
(features)       (extracts low-level   (extracts high-level   (prediction)
                  features)             features)

 x1 ──→  [○ ○ ○ ○] ──→ [○ ○ ○] ──→  [○ ○]
 x2 ──→  [○ ○ ○ ○] ──→ [○ ○ ○] ──→  Cat/Dog
 x3 ──→  [○ ○ ○ ○] ──→ [○ ○ ○]
```

| Concept | Description |
|------|------|
| Input Layer | Receives raw data (image pixels, text vectors, etc.) |
| Hidden Layer | Intermediate processing layers; more layers means a "deeper" network (the "deep" in deep learning) |
| Output Layer | Produces the final prediction (classification probabilities, regression values, etc.) |
| Forward Propagation | The process of data flowing from the input layer to the output layer, layer by layer |

::: tip Why is it called "Deep" Learning?
Traditional machine learning typically uses only 1–2 layers. When the number of hidden layers increases to dozens or even hundreds, it's called "deep" learning. Deeper networks can learn more abstract features: the first layer learns edges, the second layer learns textures, the third layer learns parts, and deeper layers learn "this is a cat."
:::

---

## 2. How Networks Learn

The "learning" in neural networks is essentially an **optimization problem**: find a set of weights (w) and biases (b) such that the network's predictions are as close as possible to the correct answers.

### The Three-Step Training Loop

```
1. Forward propagation: Feed input data, get predictions
2. Compute loss: Use a loss function to measure the gap between predictions and true values
3. Backpropagation: Calculate the gradient of each weight based on the loss, then update weights
   ↓
Repeat the above steps until the loss is sufficiently small
```

### Loss Functions: Measuring "How Wrong You Are"

A loss function quantifies the gap between predicted and true values. The goal of training is to minimize the loss.

| Loss Function | Formula Summary | Use Case |
|---------|---------|---------|
| MSE (Mean Squared Error) | Mean of squared differences between predictions and true values | Regression problems |
| Cross-Entropy | -Σ y·log(ŷ) | Classification problems |
| Binary Cross-Entropy | Binary version of cross-entropy | Binary classification problems |

### Gradient Descent: Finding the Lowest Point

Imagine you're standing on a mountain, blindfolded, and need to walk to the lowest point. All you can do is **feel the slope under your feet, then take a step downhill**. This is gradient descent.

```
Loss
  ↑
  │    ╱╲
  │   ╱  ╲      ← Current position
  │  ╱    ╲    ↙ Descend along gradient direction
  │ ╱      ╲╱   ← Local minimum
  │╱            ╲╱  ← Global minimum
  └──────────────→ Weight value
```

| Concept | Description |
|------|------|
| Gradient | The partial derivative of the loss function with respect to each weight, indicating "which direction to adjust to reduce the loss" |
| Learning Rate | How far to step each time. Too large and you'll overshoot the minimum; too small and convergence is too slow |
| Batch Size | How many samples to use for each gradient calculation. Full batch is too slow, single sample is too noisy, mini-batch is the compromise |

### Backpropagation: The Triumph of the Chain Rule

Backpropagation is an efficient algorithm for calculating gradients. It leverages the **chain rule** from calculus, starting from the output layer and working backward layer by layer to compute each weight's contribution to the loss.

```
Forward propagation: Input → Hidden Layer 1 → Hidden Layer 2 → Output → Loss
Backpropagation:    Loss → Output → Hidden Layer 2 → Hidden Layer 1 → Update all weights
```

::: tip Intuition for Backpropagation
Think of a neural network as an assembly line. When a product (prediction) has a problem (large loss), you need to trace back from the final step, checking how much each step (each layer's weights) contributed to the problem, then adjust proportionally. Those that contributed more get adjusted more; those that contributed less get adjusted less.
:::

---

## 3. Mainstream Network Architectures

Different types of data require different network architectures. Choosing the right architecture gets you twice the results with half the effort.

<NetworkLayersDemo />

### 3.1 CNN (Convolutional Neural Network)

CNN is the king of image processing. The core idea: slide small convolution kernels across the image to extract local features.

```
Input image → [Convolution → Activation → Pooling] × N → Fully Connected Layer → Output
  28×28      Extract edges/textures/shapes                   Classification result
```

| Feature | Description |
|------|------|
| Local Connectivity | Each neuron only looks at a small patch, not the entire image |
| Parameter Sharing | The same convolution kernel is reused across the entire image, drastically reducing parameters |
| Translation Invariance | A cat on the left or right side of the image can still be recognized |
| Hierarchical Features | Shallow layers learn edges, deep layers learn semantics |

Representative models: LeNet, AlexNet, VGG, ResNet, EfficientNet

### 3.2 RNN (Recurrent Neural Network)

RNN is designed for **sequential data**. Its hidden state is passed to the next time step, giving the network a form of "memory."

```
Time step t1    Time step t2    Time step t3
  "I"   ──→    "like"  ──→    "cats"
   ↓             ↓             ↓
  [h1]  ──→    [h2]   ──→    [h3] ──→ Output
   ↑             ↑             ↑
 Hidden state passes between time steps (memory)
```

| Variant | Problem Solved | Core Mechanism |
|------|-----------|---------|
| Vanilla RNN | Basic sequence modeling | Simple recurrent connections |
| LSTM | Vanishing gradients in long sequences | Forget gate, input gate, output gate |
| GRU | LSTM has too many parameters | Simplified to reset gate and update gate |
| Bidirectional RNN | Can only see the past | Processes forward and backward simultaneously |

::: tip LSTM's Gating Mechanism
The elegance of LSTM lies in its three "gates": the **forget gate** decides which old memories to discard, the **input gate** decides which new information to store, and the **output gate** decides what to output. It's like reading a book — you selectively remember important plot points and forget irrelevant details.
:::

### 3.3 Transformer: Attention Is All You Need

In 2017, Google published the paper "Attention Is All You Need," proposing the Transformer, which fundamentally transformed the AI field. It replaces recurrent structures with the **self-attention mechanism** and serves as the foundation for large models like GPT, BERT, and Claude.

```
Input sequence → Embedding + Positional Encoding → [Multi-Head Attention → Feed-Forward Network] × N → Output
                                                           ↑
                                          Every token can "see" every other token
```

| Advantage | Description |
|------|------|
| Parallel Computation | Unlike RNNs that must process sequentially, Transformers can process the entire sequence in parallel |
| Long-Range Dependencies | Direct connections between any two positions, regardless of distance |
| Scalability | The larger the model and the more data, the better the performance (Scaling Law) |

**Intuition for self-attention**: When reading the sentence "The cat sat on the mat because **it** was tired," "it" needs to attend to "cat" to understand the meaning. Self-attention lets the model learn this kind of association — computing a "relevance score" for every pair of tokens in the sequence.

<NetworkArchitectureDemo />

## 4. The Art of Training

Having a good architecture isn't enough — there are many pitfalls to avoid during training.

### 4.1 Overfitting vs. Underfitting

| Problem | Symptoms | Cause | Solutions |
|------|------|------|---------|
| Overfitting | Good performance on training set, poor on test set | Model is too complex, "memorizing answers" rather than learning patterns | Regularization, Dropout, data augmentation, early stopping |
| Underfitting | Poor performance on both training and test sets | Model is too simple, unable to learn patterns | Increase model capacity, train longer, better features |

```
Error
  ↑
  │ ╲  Training error          Test error  ╱
  │  ╲                                    ╱
  │   ╲─────────────────╱
  │    Underfitting ← Sweet spot → Overfitting
  └──────────────────────────→ Model complexity
```

### 4.2 Key Hyperparameters

Hyperparameters are parameters that must be set manually before training (not learned by the model):

| Hyperparameter | Role | Common Range | Tuning Advice |
|--------|------|---------|---------|
| Learning Rate | Step size for each update | 1e-5 ~ 1e-1 | The most important hyperparameter; usually start from 1e-3 |
| Batch Size | Number of samples per training step | 16 ~ 512 | Larger batches are more stable but require more VRAM |
| Epochs | Number of passes through the entire dataset | 10 ~ 100+ | Use with early stopping; stop when validation performance no longer improves |
| Optimizer | Gradient update strategy | Adam, SGD | Adam is the default choice; SGD + momentum for fine-tuning |

### 4.3 Regularization Techniques

Common methods for preventing overfitting:

| Technique | Principle | Usage |
|------|------|---------|
| Dropout | Randomly deactivate some neurons during training | Typically p=0.1~0.5 |
| Weight Decay | Add a penalty on weight magnitude to the loss function | L2 regularization, λ=1e-4 |
| Data Augmentation | Apply random transformations to training data (flip, crop, rotate) | Essential for image tasks |
| Early Stopping | Stop training when validation loss stops decreasing | patience=5~10 |
| Batch Normalization | Normalize the input distribution of each layer | Accelerates convergence, has a mild regularization effect |

::: tip Rules of Thumb for Training
1. First, run through the entire pipeline on a small dataset to confirm there are no code bugs
2. Start by fine-tuning an existing pre-trained model rather than training from scratch
3. The learning rate is the hyperparameter most worth your time to tune
4. If the training loss isn't decreasing, check your data and code first before doubting the model
:::

---

## 5. Development History and Frontiers

The development of neural networks has gone through several "winters" and "renaissances," with each breakthrough driven by key technological innovations.

| Era | Milestone | Key Breakthrough |
|------|--------|---------|
| 1958 | Perceptron | The first neural network model; could only handle linear problems |
| 1986 | Backpropagation Algorithm | Made training multi-layer networks possible |
| 1998 | LeNet (CNN) | Convolutional networks achieved great success on handwritten digit recognition |
| 2012 | AlexNet | Deep CNNs crushed traditional methods on ImageNet; deep learning explosion |
| 2014 | GAN (Generative Adversarial Network) | Two networks trained adversarially, capable of generating realistic images |
| 2017 | Transformer | "Attention Is All You Need"; attention mechanism replaced RNNs |
| 2018 | BERT | Pre-training + fine-tuning paradigm; NLP breakthroughs across the board |
| 2020 | GPT-3 | 175 billion parameters, demonstrating emergent capabilities of large models |
| 2022 | ChatGPT | RLHF alignment technique; AI entered public consciousness |
| 2023+ | Multimodal Large Models | GPT-4V, Claude, etc.; understanding both text and images simultaneously |

### Current Trends

| Direction | Description |
|------|------|
| Large Language Models (LLMs) | Parameter counts from hundreds of millions to trillions; emergent abilities in reasoning, coding, etc. |
| Multimodal | A single model handling text, images, audio, and video |
| Efficient Fine-Tuning | Techniques like LoRA and QLoRA enable ordinary developers to fine-tune large models |
| AI Agents | Enabling large models to use tools, plan tasks, and autonomously complete complex goals |
| Small Model Distillation | Using knowledge from large models to train smaller models for on-device deployment |

::: tip Takeaways for Developers
You don't need to train neural networks from scratch. Modern AI development is more about **calling APIs** (like OpenAI or Claude API) or **fine-tuning pre-trained models** (e.g., using Hugging Face). But understanding the underlying principles helps you choose models more wisely, design better prompts, and diagnose problems more effectively.
:::

---

## Summary

| Core Concept | One-Sentence Summary |
|---------|-----------|
| Neuron | Weighted sum + activation function; the smallest computational unit of a network |
| Forward Propagation | Data flows from input layer to output layer, producing a prediction |
| Backpropagation | Starting from the loss, compute gradients layer by layer and update weights |
| CNN | Convolution kernels extract local features; the go-to for image processing |
| RNN/LSTM | Recurrent connections maintain memory; for processing sequential data |
| Transformer | Self-attention with parallel processing; the foundational architecture of large models |
| Overfitting | Model "memorizes answers"; prevent with regularization, Dropout, etc. |
| Transfer Learning | Stand on the shoulders of giants; fine-tune pre-trained models for new tasks |

---

## Further Reading

- [3Blue1Brown - Neural Networks Video Series](https://www.3blue1brown.com/topics/neural-networks) — The most intuitive visual explanations
- [Stanford CS231n](http://cs231n.stanford.edu/) — Classic convolutional neural networks course
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) — Visual guide to the Transformer architecture
- [Fundamentals of Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com/) — Free online textbook
- [Hugging Face Course](https://huggingface.co/learn) — Hands-on practice with Transformers and large models