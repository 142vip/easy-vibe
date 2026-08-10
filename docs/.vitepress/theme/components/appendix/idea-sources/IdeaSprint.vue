<template>
  <section class="problem-sprint" aria-label="20 分钟灵感线索收集练习">
    <header class="sprint-header">
      <div>
        <p class="eyebrow">20 分钟练习</p>
        <h3>先装满一页线索库</h3>
        <p>只收集原始材料，不分析需求，也不比较方向。</p>
      </div>
      <div class="finish-mark">
        <b>6</b><span>条原始线索</span><i></i><b>2</b><span>个以上来源</span>
      </div>
    </header>

    <div class="timeline" aria-hidden="true">
      <span
        v-for="(step, index) in steps"
        :key="step.time"
        :class="{ reached: index <= activeIndex }"
        :style="{ flexGrow: step.duration }"
      ></span>
    </div>

    <nav class="step-tabs" aria-label="练习步骤">
      <button
        v-for="(step, index) in steps"
        :key="step.time"
        type="button"
        :class="{ active: index === activeIndex }"
        :aria-pressed="index === activeIndex"
        @click="activeIndex = index"
      >
        <small>{{ step.time }}</small>
        <strong>{{ step.tab }}</strong>
      </button>
    </nav>

    <div class="step-panel">
      <div class="panel-heading">
        <span class="step-number">0{{ activeIndex + 1 }}</span>
        <div>
          <p>{{ activeStep.time }}</p>
          <h4>{{ activeStep.title }}</h4>
        </div>
      </div>

      <div class="panel-body">
        <template v-if="activeIndex === 0">
          <p>选一个你已经听得懂的地方：自己的工作、一个兴趣社群、最近的生活经历，或熟悉的小生意。</p>
          <div class="note">这一轮只在一个范围里找，材料会更容易读懂。</div>
        </template>

        <template v-else-if="activeIndex === 1">
          <p>找 6 条材料，至少来自两个地方。可以混合自己的经历、聊天原话、帖子和产品评价。</p>
          <div class="source-counts">
            <span><b>2</b> 自己或身边人</span>
            <span><b>2</b> 公开讨论</span>
            <span><b>2</b> 产品评价或服务</span>
          </div>
          <div class="note">保留原话，不要把它改写成“某某助手”或功能清单。</div>
        </template>

        <template v-else>
          <p>把每条材料的出处补齐，确保过几天还能找到它。到这里不要归类，也不要判断哪条更好。</p>
          <div class="question-row">
            <span>原话或现象</span><span>出现在哪里</span><span>日期</span><span>链接或截图</span>
          </div>
          <div class="template-card">
            <div class="template-lines">
              <span v-for="line in templateLines" :key="line">{{ line }}</span>
            </div>
            <button type="button" @click="copyTemplate">{{ copied ? '已复制' : '复制线索模板' }}</button>
          </div>
        </template>
      </div>

      <footer class="panel-actions">
        <button type="button" :disabled="activeIndex === 0" @click="activeIndex--">上一步</button>
        <span>{{ activeIndex + 1 }} / {{ steps.length }}</span>
        <button type="button" class="next" :disabled="activeIndex === steps.length - 1" @click="activeIndex++">
          下一步
        </button>
      </footer>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const steps = [
  { time: '0～5 分钟', duration: 5, tab: '选现场', title: '选一个熟悉的小范围' },
  { time: '5～15 分钟', duration: 10, tab: '找材料', title: '收集 6 条原始线索' },
  { time: '15～20 分钟', duration: 5, tab: '留出处', title: '补上原话、链接和日期' }
]

const templateLines = [
  '原话或看到的现象：',
  '来自哪里：',
  '发生或记录的日期：',
  '原链接、截图或文件：',
  '当时的简单备注：'
]

const activeIndex = ref(0)
const copied = ref(false)
const activeStep = computed(() => steps[activeIndex.value])

async function copyTemplate() {
  try {
    await navigator.clipboard.writeText(templateLines.join('\n'))
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1600)
  } catch {
    copied.value = false
  }
}
</script>

<style scoped>
.problem-sprint {
  --green: #2f7d5b;
  --green-soft: #e8f4ed;
  margin: 24px 0 36px;
  overflow: hidden;
  color: var(--vp-c-text-1);
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 76%, #75a98c);
  border-radius: 22px;
  background:
    radial-gradient(circle at 94% 0, rgba(241, 185, 91, 0.18), transparent 28%),
    linear-gradient(145deg, var(--vp-c-bg), color-mix(in srgb, var(--vp-c-bg-soft) 88%, #e8f4ed));
  box-shadow: 0 16px 44px rgba(36, 56, 47, 0.08);
}

.sprint-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 30px 22px;
}

.eyebrow,
.panel-heading p {
  margin: 0 0 7px;
  color: var(--green);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.sprint-header h3 {
  margin: 0;
  border: 0;
  font-size: clamp(21px, 3.2vw, 30px);
  line-height: 1.25;
  letter-spacing: -0.025em;
}

.sprint-header > div > p:last-child {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.finish-mark {
  display: grid;
  grid-template-columns: auto auto 1px auto auto;
  align-items: baseline;
  gap: 6px;
  flex: 0 0 auto;
  padding: 12px 14px;
  border-radius: 13px;
  background: color-mix(in srgb, var(--vp-c-bg) 76%, #e8f4ed);
}

.finish-mark b { color: var(--green); font-size: 19px; }
.finish-mark span { color: var(--vp-c-text-2); font-size: 11px; }
.finish-mark i { width: 1px; height: 20px; margin: 0 4px; background: var(--vp-c-divider); }

.timeline { display: flex; gap: 4px; height: 5px; margin: 0 30px; }
.timeline span { flex-basis: 0; border-radius: 99px; background: var(--vp-c-divider); transition: 0.2s; }
.timeline span.reached { background: var(--green); }

.step-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 16px 22px 18px;
}

.step-tabs button {
  padding: 9px 10px;
  color: var(--vp-c-text-2);
  text-align: left;
  border: 1px solid transparent;
  border-radius: 11px;
  background: transparent;
  cursor: pointer;
}

.step-tabs small,
.step-tabs strong { display: block; }
.step-tabs small { font-size: 10px; }
.step-tabs strong { margin-top: 2px; font-size: 12px; }
.step-tabs button:hover { background: var(--vp-c-bg-soft); }
.step-tabs button.active { color: var(--vp-c-text-1); border-color: rgba(47, 125, 91, 0.18); background: var(--green-soft); }

.step-panel {
  margin: 0 14px 14px;
  padding: 22px;
  border-radius: 17px;
  background: var(--vp-c-bg);
  box-shadow: 0 8px 26px rgba(36, 56, 47, 0.06);
}

.panel-heading { display: flex; align-items: center; gap: 13px; padding-bottom: 16px; border-bottom: 1px solid var(--vp-c-divider); }
.step-number { color: var(--green); font-size: 25px; font-weight: 750; letter-spacing: -0.06em; }
.panel-heading h4 { margin: 0; font-size: 19px; }
.panel-body { min-height: 190px; padding: 18px 0 6px; }
.panel-body > p { margin: 0 0 14px; font-size: 14px; line-height: 1.75; }

.note {
  padding: 12px 14px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.7;
  border-left: 3px solid #e4ad52;
  background: var(--vp-c-bg-soft);
}

.source-counts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 9px; margin-bottom: 14px; }
.source-counts span { padding: 10px 12px; font-size: 12px; border: 1px solid var(--vp-c-divider); border-radius: 10px; }
.source-counts b { margin-right: 5px; color: var(--green); font-size: 17px; }

.question-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.question-row span { padding: 7px 10px; font-size: 12px; border: 1px solid rgba(47, 125, 91, 0.2); border-radius: 99px; background: color-mix(in srgb, var(--vp-c-bg) 76%, #e8f4ed); }

.template-card {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  padding: 15px 17px;
  border: 1px solid rgba(47, 125, 91, 0.2);
  border-radius: 13px;
  background: color-mix(in srgb, var(--vp-c-bg) 74%, #e8f4ed);
}

.template-lines { display: grid; gap: 4px; }
.template-lines span { color: var(--vp-c-text-2); font-family: var(--vp-font-family-mono); font-size: 11px; }

.template-card button,
.panel-actions button {
  padding: 7px 11px;
  color: var(--vp-c-text-1);
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  cursor: pointer;
}

.template-card button,
.panel-actions .next { color: white; border-color: var(--green); background: var(--green); }

.panel-actions {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid var(--vp-c-divider);
}

.panel-actions span { color: var(--vp-c-text-3); font-size: 11px; }
.panel-actions button:first-child { justify-self: start; }
.panel-actions button:last-child { justify-self: end; }
.panel-actions button:disabled { opacity: 0.35; cursor: not-allowed; }

@media (max-width: 720px) {
  .problem-sprint { border-radius: 18px; }
  .sprint-header { padding: 23px 19px 19px; }
  .finish-mark { display: none; }
  .timeline { margin: 0 20px; }
  .step-tabs { display: flex; overflow-x: auto; padding: 13px 12px 16px; scrollbar-width: none; }
  .step-tabs::-webkit-scrollbar { display: none; }
  .step-tabs button { flex: 0 0 105px; }
  .step-panel { margin: 0 9px 9px; padding: 18px 15px; }
  .panel-body { min-height: 230px; }
  .source-counts { grid-template-columns: 1fr; }
  .template-card { align-items: stretch; flex-direction: column; }
  .template-card button { align-self: flex-start; }
}
</style>
