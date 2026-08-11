<script setup>
import { computed, ref } from 'vue'

const active = ref(0)

const stages = [
  {
    number: '01',
    icon: '🖼️',
    name: '一个网页',
    short: '把想法变得可见',
    example: '会议助手介绍页',
    canDo: '展示产品、填写表单、播放交互演示',
    missing: '数据刷新后消失，功能仍以演示为主',
    next: '部署成链接，请一个陌生人独立打开',
    color: '#6d7cff',
  },
  {
    number: '02',
    icon: '⚙️',
    name: '真正的程序',
    short: '让用户完成任务',
    example: '可登录的会议管理工具',
    canDo: '保存会议、编辑待办、跨设备继续使用',
    missing: '任务仍需要用户一步步手动操作',
    next: '把一条核心流程做到稳定、可发布',
    color: '#17a673',
  },
  {
    number: '03',
    icon: '✨',
    name: 'AI 原生产品',
    short: '让软件参与完成任务',
    example: '会议执行助手',
    canDo: '理解目标、查找信息、创建待办草稿',
    missing: '需要持续评估结果，并控制行动边界',
    next: '从只读工具和人工确认开始增加自主性',
    color: '#e8793e',
  },
]

const current = computed(() => stages[active.value])
</script>

<template>
  <figure class="journey" aria-labelledby="journey-title">
    <figcaption>
      <span>同一个想法的三个版本</span>
      <strong id="journey-title">从展示会议助手，到让 AI 真正推进会议</strong>
    </figcaption>

    <div class="stage-tabs" role="tablist" aria-label="创作者成长阶段">
      <button
        v-for="(stage, index) in stages"
        :key="stage.name"
        :class="{ active: active === index }"
        :style="{ '--stage-color': stage.color }"
        type="button"
        role="tab"
        :aria-selected="active === index"
        @click="active = index"
      >
        <small>{{ stage.number }}</small>
        <span aria-hidden="true">{{ stage.icon }}</span>
        <b>{{ stage.name }}</b>
        <em>{{ stage.short }}</em>
      </button>
    </div>

    <section class="stage-detail" :style="{ '--stage-color': current.color }" aria-live="polite">
      <div class="detail-heading">
        <span aria-hidden="true">{{ current.icon }}</span>
        <div>
          <small>这一版是</small>
          <strong>{{ current.example }}</strong>
        </div>
      </div>

      <dl>
        <div>
          <dt>已经能够</dt>
          <dd>{{ current.canDo }}</dd>
        </div>
        <div>
          <dt>还缺什么</dt>
          <dd>{{ current.missing }}</dd>
        </div>
        <div class="next-action">
          <dt>下一步</dt>
          <dd>{{ current.next }}</dd>
        </div>
      </dl>
    </section>
  </figure>
</template>

<style scoped>
.journey {
  margin: 24px 0 34px;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background:
    radial-gradient(circle at 0 0, color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent), transparent 35%),
    var(--vp-c-bg-soft);
}

figcaption {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 18px;
}

figcaption span {
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

figcaption strong {
  color: var(--vp-c-text-1);
  font-size: 18px;
}

.stage-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stage-tabs button {
  display: grid;
  min-width: 0;
  padding: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 13px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.stage-tabs button:hover {
  transform: translateY(-2px);
  border-color: var(--stage-color);
}

.stage-tabs button.active {
  border-color: var(--stage-color);
  box-shadow: 0 8px 22px color-mix(in srgb, var(--stage-color) 18%, transparent);
}

.stage-tabs small {
  color: var(--stage-color);
  font-size: 10px;
  font-weight: 800;
}

.stage-tabs span {
  margin: 8px 0 5px;
  font-size: 23px;
}

.stage-tabs b {
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.stage-tabs em {
  margin-top: 3px;
  color: var(--vp-c-text-3);
  font-size: 11px;
  font-style: normal;
}

.stage-detail {
  margin-top: 12px;
  padding: 17px;
  border-left: 4px solid var(--stage-color);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.detail-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 13px;
}

.detail-heading > span {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 11px;
  background: color-mix(in srgb, var(--stage-color) 12%, var(--vp-c-bg));
  font-size: 21px;
}

.detail-heading div {
  display: flex;
  flex-direction: column;
}

.detail-heading small,
dt {
  color: var(--vp-c-text-3);
  font-size: 10px;
}

.detail-heading strong {
  color: var(--vp-c-text-1);
  font-size: 15px;
}

dl {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin: 0;
}

dl > div {
  padding: 11px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}

dt {
  margin-bottom: 4px;
  font-weight: 700;
}

dd {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.55;
}

.next-action {
  border-color: color-mix(in srgb, var(--stage-color) 32%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--stage-color) 6%, var(--vp-c-bg));
}

@media (max-width: 700px) {
  .journey {
    padding: 16px;
  }

  .stage-tabs {
    grid-template-columns: 1fr;
  }

  .stage-tabs button {
    grid-template-columns: auto auto 1fr;
    align-items: center;
    column-gap: 8px;
  }

  .stage-tabs span {
    margin: 0;
  }

  .stage-tabs em {
    grid-column: 3;
  }

  dl {
    grid-template-columns: 1fr;
  }
}
</style>
