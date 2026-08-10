<script setup>
const examples = [
  {
    icon: '✍️',
    input: '商品资料',
    capability: '文本生成',
    output: '标题与卖点',
    tone: 'violet'
  },
  {
    icon: '🖼️',
    input: '商品照片',
    capability: '图片理解',
    output: '颜色与款式',
    tone: 'blue'
  },
  {
    icon: '🎙️',
    input: '会议录音',
    capability: '语音转文字',
    output: '文字记录',
    tone: 'orange'
  },
  {
    icon: '🎬',
    input: '商品图片',
    capability: '视频生成',
    output: '商品短片',
    tone: 'green'
  }
]
</script>

<template>
  <figure class="capability-guide" aria-labelledby="capability-guide-title">
    <figcaption class="guide-heading">
      <span class="guide-kicker">从页面功能出发</span>
      <strong id="capability-guide-title">先看用户提供什么，再看页面要返回什么</strong>
    </figcaption>

    <div class="example-grid">
      <article
        v-for="example in examples"
        :key="example.capability"
        class="example-card"
        :class="`is-${example.tone}`"
      >
        <span class="example-icon" aria-hidden="true">{{ example.icon }}</span>
        <div class="example-body">
          <div class="example-route">
            <strong>{{ example.input }}</strong>
            <span class="example-arrow" aria-hidden="true">→</span>
            <strong>{{ example.output }}</strong>
          </div>
          <span class="capability-pill">
            <small>使用</small>
            {{ example.capability }}
          </span>
        </div>
      </article>
    </div>

    <div class="combined-flow" aria-label="商品照片生成卖点的多步骤流程">
      <span class="combined-title">一个功能也可以串起两种能力</span>
      <div class="combined-steps">
        <span>商品照片</span>
        <b aria-hidden="true">→</b>
        <span class="ai-step">图片理解</span>
        <b aria-hidden="true">→</b>
        <span>商品信息</span>
        <b aria-hidden="true">→</b>
        <span class="ai-step">文本生成</span>
        <b aria-hidden="true">→</b>
        <span>卖点文案</span>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.capability-guide {
  margin: 28px 0 34px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background:
    radial-gradient(circle at 8% 0%, rgba(124, 92, 255, 0.13), transparent 34%),
    radial-gradient(circle at 92% 100%, rgba(43, 132, 255, 0.1), transparent 38%),
    var(--vp-c-bg-soft);
  box-shadow: 0 12px 32px rgba(32, 36, 50, 0.06);
}

.guide-heading {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 18px;
}

.guide-heading strong {
  color: var(--vp-c-text-1);
  font-size: 18px;
  line-height: 1.45;
}

.guide-kicker {
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.example-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 11px;
  min-width: 0;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--card-accent) 23%, var(--vp-c-divider));
  border-radius: 13px;
  background: color-mix(in srgb, var(--card-accent) 7%, var(--vp-c-bg));
}

.is-violet {
  --card-accent: #7c5cff;
}

.is-blue {
  --card-accent: #2b84ff;
}

.is-orange {
  --card-accent: #ed8a25;
}

.is-green {
  --card-accent: #27a873;
}

.example-icon {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 9px;
  background: color-mix(in srgb, var(--card-accent) 14%, var(--vp-c-bg));
  font-size: 17px;
}

.example-body {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 7px;
}

.example-route {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 7px;
}

.example-route strong {
  color: var(--vp-c-text-1);
  font-size: 12px;
  line-height: 1.35;
  white-space: nowrap;
}

.example-arrow {
  color: color-mix(in srgb, var(--card-accent) 62%, var(--vp-c-text-3));
  font-size: 13px;
}

.capability-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 999px;
  color: var(--card-accent);
  background: color-mix(in srgb, var(--card-accent) 11%, var(--vp-c-bg));
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.capability-pill small {
  color: var(--vp-c-text-3);
  font-size: 10px;
  font-weight: 500;
}

.combined-flow {
  margin-top: 14px;
  padding: 15px 16px;
  border: 1px dashed color-mix(in srgb, var(--vp-c-brand-1) 36%, var(--vp-c-divider));
  border-radius: 13px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 5%, var(--vp-c-bg));
}

.combined-title {
  display: block;
  margin-bottom: 10px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 600;
}

.combined-steps {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  white-space: nowrap;
  scrollbar-width: thin;
}

.combined-steps span {
  padding: 6px 9px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  box-shadow: 0 2px 8px rgba(32, 36, 50, 0.05);
}

.combined-steps .ai-step {
  color: var(--vp-c-brand-1);
  font-weight: 700;
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, var(--vp-c-bg));
}

.combined-steps b {
  color: var(--vp-c-text-3);
  font-weight: 500;
}

@media (max-width: 760px) {
  .capability-guide {
    padding: 18px;
  }

  .example-grid {
    grid-template-columns: 1fr;
  }

  .combined-steps {
    flex-wrap: wrap;
    overflow: visible;
    white-space: normal;
  }
}

</style>
