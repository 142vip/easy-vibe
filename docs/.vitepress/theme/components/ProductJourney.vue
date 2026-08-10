<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  current: {
    type: String,
    required: true
  }
})

const steps = [
  { id: 'find', label: '找问题', title: '寻找真实问题', link: '/zh-cn/stage-1/appendix-idea-sources/' },
  { id: 'choose', label: '选方向', title: '筛选值得做的方向', link: '/zh-cn/stage-1/finding-great-idea/' },
  { id: 'understand', label: '懂需求', title: '用 JTBD 看懂真实需求', link: '/zh-cn/stage-1/appendix-jobs-to-be-done/' },
  { id: 'interview', label: '做访谈', title: '用 Mom Test 验证需求', link: '/zh-cn/stage-1/appendix-mom-test/' },
  { id: 'define', label: '定方案', title: '用双钻模型收敛方案', link: '/zh-cn/stage-1/appendix-double-diamond/' },
  { id: 'prototype', label: '做原型', title: '做出可交互原型', link: '/zh-cn/stage-1/building-prototype/' },
  { id: 'ai', label: '接 AI', title: '接入真实 AI 能力', link: '/zh-cn/stage-1/integrating-ai-capabilities/' },
  { id: 'finish', label: '完成作品', title: '打磨并交付完整作品', link: '/zh-cn/stage-1/complete-project-practice/' }
]

const currentIndex = computed(() => steps.findIndex((step) => step.id === props.current))
</script>

<template>
  <nav class="product-journey" aria-label="从问题到作品的学习路径">
    <div class="journey-track">
      <a
        v-for="(step, index) in steps"
        :key="step.id"
        :href="withBase(step.link)"
        :title="step.title"
        class="journey-step"
        :class="{
          'is-active': index === currentIndex,
          'is-complete': index < currentIndex
        }"
        :aria-current="index === currentIndex ? 'step' : undefined"
      >
        <span class="journey-node">{{ index + 1 }}</span>
        <span class="journey-label">{{ step.label }}</span>
      </a>
    </div>
  </nav>
</template>

<style scoped>
.product-journey {
  margin: 14px 0 26px;
  padding: 6px 2px 10px;
  max-width: 100%;
}

.journey-track {
  position: relative;
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  width: 100%;
  min-width: 0;
}

.journey-step {
  position: relative;
  z-index: 0;
  display: flex;
  align-items: center;
  min-width: 0;
  color: var(--vp-c-text-3) !important;
  text-decoration: none !important;
  flex-direction: column;
}

.journey-step::before {
  position: absolute;
  z-index: 0;
  top: 15px;
  right: 50%;
  width: 100%;
  height: 2px;
  background: var(--vp-c-divider);
  content: '';
}

.journey-step:first-child::before {
  display: none;
}

.journey-node {
  position: relative;
  z-index: 1;
  display: grid;
  width: 30px;
  height: 30px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 50%;
  background: var(--vp-c-bg);
  place-items: center;
  font-size: 0.72rem;
  font-weight: 700;
}

.journey-label {
  position: relative;
  z-index: 1;
  margin-top: 8px;
  font-size: 0.76rem;
  font-weight: 600;
  white-space: nowrap;
}

.journey-step.is-complete::before,
.journey-step.is-active::before {
  background: var(--vp-c-brand-soft);
}

.journey-step.is-complete .journey-node {
  border-color: var(--vp-c-brand-soft);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.journey-step.is-active {
  color: var(--vp-c-brand-1) !important;
}

.journey-step.is-active .journey-node {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: white;
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

.journey-step:hover .journey-label {
  color: var(--vp-c-brand-1);
}

@media (max-width: 720px) {
  .product-journey {
    margin-right: -8px;
    margin-left: -8px;
    padding-right: 8px;
    padding-left: 8px;
  }

  .journey-track {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    row-gap: 20px;
  }

  .journey-step:nth-child(5)::before {
    display: none;
  }
}
</style>
