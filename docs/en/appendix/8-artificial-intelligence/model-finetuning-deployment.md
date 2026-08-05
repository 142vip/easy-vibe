# An Introduction to Model Fine-Tuning and Deployment

::: tip Preface
**Large models are powerful, but they don't understand your business.** GPT-4 can write poetry and code, but it doesn't know your company's product terminology or your industry's professional standards. Fine-tuning is the process of making a general-purpose large model "learn" your professional knowledge — like giving a knowledgeable generalist on-the-job training to become your domain expert.
:::

**What will you learn from this article?**

After completing this chapter, you will gain:

- **Process understanding**: Master the complete fine-tuning pipeline from data preparation to model deployment
- **Data engineering**: Understand the format requirements and quality standards for fine-tuning data
- **Efficient fine-tuning**: Understand the principles and advantages of parameter-efficient fine-tuning techniques like LoRA
- **Model compression**: Master how quantization techniques enable large models to run on consumer hardware
- **Deployment practices**: Understand mainstream architectures and selection strategies for model serving

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Fine-tuning Pipeline | Data → Training → Evaluation → Deployment |
| **Chapter 2** | Training Data | Data formats, quality control |
| **Chapter 3** | LoRA Fine-tuning | Low-rank adaptation, parameter efficiency |
| **Chapter 4** | Model Quantization | FP16, INT8, INT4 |
| **Chapter 5** | Model Deployment | Inference serving, API gateway |

---

## 0. Overview: Motivation for Fining -tuning Needed

Large language model training is divided into two phases: **pre-training** and **fine-tuning**. Pre-training learns language capabilities from massive general data, while fine-tuning learns specialized capabilities from task-specific data.

To use an analogy: pre-training is like going to college — learning general knowledge and understanding a bit of everything; fine-tuning is like onboarding training — learning professional skills for a specific position.

::: tip When Do You Need Fine-tuning?
- **Specific output formats**: When you need the model to consistently output in a fixed JSON format
- **Professional domain knowledge**: Terminology and standards in medical, legal, financial, and other domains
- **Language style transfer**: Making the model respond in a specific tone or style (e.g., customer service scripts)
- **Niche language support**: Improving model performance on specific languages
- **Cost optimization**: Using a fine-tuned small model to replace large model API calls, reducing inference costs
:::

---

## 1. Fine-tuning Pipeline: The Complete Journey from Data to Production

Fine-tuning is not just "throwing data at a model and calling it done." It's a rigorous engineering process where every step affects the final result.

<FinetuningPipelineDemo />

::: tip Five Stages of Fine-tuning
1. **Data Preparation**: Collect, clean, and annotate training data — this is the most time-consuming and critical step
2. **Model Selection**: Choose an appropriate base model, such as Llama 3, Qwen, or Mistral
3. **Training Configuration**: Set hyperparameters like learning rate, batch size, and number of epochs
4. **Training Execution**: Run training on GPUs, monitoring loss curves and evaluation metrics
5. **Evaluation and Deployment**: Evaluate performance on a test set, then deploy as an API service if it passes
:::

| Stage | Key Actions | Common Pitfalls |
|------|---------|---------|
| Data Preparation | Clean, deduplicate, format | Poor data quality leads to the model "learning bad habits" |
| Model Selection | Evaluate base model capabilities | Model too large to train, or too small for good results |
| Training Configuration | Adjust hyperparameters | Learning rate too high causes catastrophic forgetting |
| Training Execution | Monitor loss and metrics | Overfitting, training not converging |
| Evaluation and Deployment | A/B testing, gradual rollout | Test set leakage leading to inflated evaluation metrics |

---

## 2. Training Data: The Ceiling of Fine-tuning Performance

There's an old saying in fine-tuning: **"Garbage in, garbage out."** The quality of training data directly determines the upper limit of fine-tuning effectiveness. 100 high-quality data points often outperform 10,000 low-quality ones.

<TrainingDataDemo />

::: tip Three Common Fine-tuning Data Formats
1. **Instruction Format**: The most commonly used format, containing three fields: instruction, input, and expected output. Suitable for training models to follow instructions.
2. **Chat Format**: Multi-turn conversation format containing message lists for system, user, and assistant roles. Suitable for training chatbots.
3. **Completion Format**: Simple prompt-completion pairs, suitable for text generation, code completion, and similar scenarios.
:::

| Data Quality Dimension | Description | Verification Method |
|------------|------|---------|
| Accuracy | Answers must be correct | Manual review, expert verification |
| Consistency | Similar questions have consistent response styles | Sample comparison checks |
| Diversity | Cover enough scenarios and variations | Statistical distribution of question types |
| Deduplication | Avoid duplicate samples causing overfitting | Text deduplication, semantic deduplication |
| Data Volume | Usually 500~5000 high-quality data points suffice | Start small, gradually increase |

---

## 3. LoRA: Achieving 90% of Results with 1% of Parameters

Full fine-tuning requires updating all model parameters — for a 70B parameter model, this means needing hundreds of GB of VRAM and massive GPU computing power. For most teams, this is impractical.

LoRA (Low-Rank Adaptation) provides an elegant solution: **freeze the original model parameters and only train a small set of newly added low-rank matrices.** These matrices typically have only 0.1%~1% of the original model's parameters but can achieve results close to full fine-tuning.

<LoRADemo />

::: tip LoRA's Core Idea
The original model's weight matrix W is a huge matrix (e.g., 4096×4096). LoRA doesn't directly modify W but adds a "bypass" alongside it: W' = W + BA, where B and A are two small matrices (e.g., 4096×8 and 8×4096). During training, only B and A are updated while the original W remains unchanged.
- **Rank (r)**: Higher r values mean stronger expressiveness but more parameters. Usually r=8~64 is sufficient
- **Merge for deployment**: After training, BA can be merged back into W for zero additional overhead during inference
:::

| Fine-tuning Method | Trainable Parameters | VRAM Requirement | Training Speed | Effect |
|---------|-----------|---------|---------|------|
| Full Fine-tuning | 100% | Extremely high | Slow | Best |
| LoRA | 0.1%~1% | Low | Fast | Close to full |
| QLoRA | 0.1%~1% | Lower | Medium | Slightly below LoRA |
| Prompt Tuning | < 0.01% | Extremely low | Very fast | Limited |

---

## 4. Model Quantization: Slimming Down Large Models

A 70B parameter model stored in FP32 (32-bit floating point) requires 280GB of VRAM — impossible to run without several top-tier GPUs. Quantization technology compresses model size by reducing numerical precision, enabling large models to run on consumer hardware.

<ModelQuantizationDemo />

::: tip The Core Trade-off of Quantization
Quantization is fundamentally a **precision-for-space** trade-off. FP32 → FP16 is nearly lossless, INT8 has minor loss, and INT4 has noticeable but usually acceptable quality degradation. The key is finding the optimal balance point for your scenario.
- **FP16 (half precision)**: Halves the size with almost no quality loss; the default choice for training and inference
- **INT8 (8-bit integer)**: Halves the size again with minimal quality loss; suitable for most inference scenarios
- **INT4 (4-bit integer)**: Only 1/8 of FP32 size with some quality loss; suitable for resource-constrained scenarios
:::

| Precision | Bytes Per Parameter | 70B Model Size | Quality Loss | Applicable Scenario |
|------|-----------|-------------|---------|---------|
| FP32 | 4 bytes | ~280 GB | None | Training baseline |
| FP16 | 2 bytes | ~140 GB | Nearly none | Standard training and inference |
| INT8 | 1 byte | ~70 GB | Very small | Production inference |
| INT4 | 0.5 bytes | ~35 GB | Acceptable | Edge devices, local deployment |

---

## 5. Model Deployment: From Lab to Production

The model is trained, quantized and compressed — the final step is deploying it as a callable service. Model deployment isn't just about "running the model"; it also involves engineering issues like concurrency handling, load balancing, and cost control.

<ModelServingDemo />

::: tip Three Mainstream Deployment Solutions
1. **API Service Providers**: Use APIs from OpenAI, Anthropic, and other providers directly. Zero operations, pay per token, suitable for rapid validation and small-to-medium scale usage.
2. **Self-hosted Inference**: Deploy on your own GPU servers using frameworks like vLLM or TGI. Controllable costs, data stays on-premises, suitable for scenarios with privacy requirements or large-scale calls.
3. **Serverless Inference**: Use platforms like AWS SageMaker or Replicate, pay per request with automatic scaling. Suitable for scenarios with fluctuating traffic.
:::

| Deployment Solution | Cost Model | Latency | Operations Complexity | Applicable Scenario |
|---------|---------|------|-----------|---------|
| API Service Provider | Pay per token | Medium | Zero | Rapid prototyping, small-to-medium scale |
| vLLM Self-deployment | GPU rental costs | Low | High | Large-scale, privacy-sensitive |
| Serverless | Pay per request | Higher cold start | Low | Fluctuating traffic |
| Edge Deployment | One-time hardware cost | Very low | Medium | Offline scenarios, IoT |

---

## Summary

Model fine-tuning and deployment are critical steps in transforming large models from "general-purpose tools" to "professional assistants." From data preparation to model deployment, every step requires engineering thinking and practice.

Key takeaways from this chapter:

1. **Fine-tuning is onboarding training**: Making general-purpose models learn domain-specific knowledge and behavioral patterns
2. **Data quality determines the ceiling**: 100 high-quality data points beat 10,000 low-quality ones
3. **LoRA is the efficiency champion**: Achieving near full fine-tuning results with less than 1% of parameters
4. **Quantization is a deployment enabler**: INT4 quantization makes running 70B models on a single GPU possible
5. **Deployment solutions vary by scenario**: Use APIs for rapid validation, self-deployment for large scale, and serverless for fluctuating traffic

## Further Reading

- [Hugging Face PEFT Documentation](https://huggingface.co/docs/peft) - Official documentation for parameter-efficient fine-tuning library
- [vLLM Documentation](https://docs.vllm.ai/) - High-performance LLM inference engine
- [Unsloth](https://github.com/unslothai/unsloth) - 2x accelerated LoRA fine-tuning framework
- [GGUF Format Specification](https://github.com/ggerganov/ggml/blob/master/docs/gguf.md) - Quantized model format used by llama.cpp
- [OpenAI Fine-tuning Guide](https://platform.openai.com/docs/guides/fine-tuning) - OpenAI's official fine-tuning guide
