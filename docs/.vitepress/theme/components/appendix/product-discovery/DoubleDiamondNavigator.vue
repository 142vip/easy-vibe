<script setup>
import { computed, ref } from 'vue'
import { useI18n } from '../../../composables/useI18n.js'
import { productDiscoveryLocale } from '../../../locales/product-discovery/index.js'

const { t, messages } = useI18n(productDiscoveryLocale)
const stages = computed(() => messages.value.doubleDiamond.stages)

const active = ref(0)
const current = computed(() => stages.value[active.value])
</script>

<template>
  <section class="lab" :aria-label="t('doubleDiamond.ariaLabel')">
    <header>
      <span class="eyebrow">{{ t('doubleDiamond.eyebrow') }}</span>
      <h3>{{ t('doubleDiamond.title') }}</h3>
      <p>{{ t('doubleDiamond.description') }}</p>
    </header>

    <div class="process">
      <div class="process-graphic" aria-hidden="true">
        <svg viewBox="0 0 800 170" preserveAspectRatio="none">
          <path class="problem-line" d="M 12 85 L 205 18 L 394 85 L 205 152 Z" />
          <path class="solution-line" d="M 406 85 L 595 18 L 788 85 L 595 152 Z" />
          <line x1="400" y1="12" x2="400" y2="158" />
        </svg>
        <span class="problem-label">{{ t('doubleDiamond.problemSpace') }}</span>
        <span class="solution-label">{{ t('doubleDiamond.solutionSpace') }}</span>
      </div>

      <div class="stage-list" aria-label="Discover Define Develop Deliver">
        <button
          v-for="(stage, index) in stages"
          :key="stage.key"
          type="button"
          :class="{ active: active === index }"
          @click="active = index"
        >
          <span>{{ stage.number }}</span>
          <b>{{ stage.key }}</b>
          <small>{{ stage.cn }} · {{ stage.mode }}</small>
        </button>
      </div>
    </div>

    <div class="detail">
      <div class="detail-top">
        <span>{{ current.mode }}</span><strong>{{ current.question }}</strong>
      </div>
      <div class="detail-grid">
        <div><small>{{ t('doubleDiamond.doNow') }}</small><p>{{ current.action }}</p></div>
        <div><small>{{ t('doubleDiamond.output') }}</small><p>{{ current.output }}</p></div>
        <div class="avoid"><small>{{ t('doubleDiamond.avoid') }}</small><p>{{ current.avoid }}</p></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lab { margin:28px 0 36px; overflow:hidden; border:1px solid var(--vp-c-divider); border-radius:12px; background:var(--vp-c-bg); }
.lab header { padding:22px 24px 18px; border-bottom:1px solid var(--vp-c-divider); }
.eyebrow { color:var(--vp-c-brand-1); font-size:12px; font-weight:800; letter-spacing:.1em; }
.lab h3 { margin:6px 0 4px; border:0; font-size:20px; }
.lab header p { margin:0; color:var(--vp-c-text-2); font-size:14px; }
.process { padding:22px 24px 0; }
.process-graphic { position:relative; height:150px; }
.process-graphic svg { width:100%; height:132px; overflow:visible; }
.process-graphic path { fill:none; stroke-width:2; vector-effect:non-scaling-stroke; }
.problem-line { stroke:var(--vp-c-brand-1); }
.solution-line { stroke:color-mix(in srgb,var(--vp-c-brand-1) 48%,var(--vp-c-text-2)); }
.process-graphic line { stroke:var(--vp-c-divider); stroke-width:1; stroke-dasharray:4 5; vector-effect:non-scaling-stroke; }
.problem-label,.solution-label { position:absolute; bottom:0; color:var(--vp-c-text-3); font-size:11px; font-weight:700; letter-spacing:.08em; }
.problem-label { left:21%; }
.solution-label { right:21%; }
.stage-list { display:grid; grid-template-columns:repeat(4,1fr); margin-top:12px; border-top:1px solid var(--vp-c-divider); border-bottom:1px solid var(--vp-c-divider); }
.stage-list button { display:grid; grid-template-columns:28px 1fr; gap:2px 8px; padding:14px 12px; border:0; border-right:1px solid var(--vp-c-divider); color:var(--vp-c-text-2); background:transparent; cursor:pointer; text-align:left; }
.stage-list button:last-child { border-right:0; }
.stage-list button > span { grid-row:1 / 3; color:var(--vp-c-text-3); font-size:11px; font-weight:800; letter-spacing:.08em; }
.stage-list button b { font-size:13px; }
.stage-list button small { font-size:11px; }
.stage-list button.active { box-shadow:inset 0 -2px var(--vp-c-brand-1); color:var(--vp-c-text-1); background:var(--vp-c-bg-soft); }
.stage-list button.active > span { color:var(--vp-c-brand-1); }
.detail { margin:22px 24px 24px; overflow:hidden; border:1px solid var(--vp-c-divider); border-radius:8px; background:var(--vp-c-bg); }
.detail-top { display:flex; align-items:center; gap:14px; padding:14px 16px; border-bottom:1px solid var(--vp-c-divider); }
.detail-top span { min-width:64px; color:var(--vp-c-brand-1); font-size:11px; font-weight:750; }
.detail-top strong { font-size:16px; }
.detail-grid { display:grid; grid-template-columns:1.2fr 1fr 1fr; }
.detail-grid > div { padding:15px 16px; border-right:1px solid var(--vp-c-divider); }
.detail-grid > div:last-child { border:0; }
.detail-grid small { color:var(--vp-c-text-3); font-size:11px; font-weight:750; }
.detail-grid p { margin:5px 0 0; font-size:13px; line-height:1.65; }
.avoid { background:var(--vp-c-bg-soft); }
@media (max-width:720px) {
  .lab header { padding:19px 18px 16px; }
  .process { padding:18px 18px 0; }
  .process-graphic { height:125px; }
  .process-graphic svg { height:108px; }
  .stage-list { grid-template-columns:1fr 1fr; }
  .stage-list button:nth-child(2) { border-right:0; }
  .stage-list button:nth-child(-n+2) { border-bottom:1px solid var(--vp-c-divider); }
  .detail { margin:18px; }
  .detail-top { align-items:flex-start; flex-direction:column; gap:6px; }
  .detail-grid { grid-template-columns:1fr; }
  .detail-grid > div { border-right:0; border-bottom:1px solid var(--vp-c-divider); }
}
</style>
