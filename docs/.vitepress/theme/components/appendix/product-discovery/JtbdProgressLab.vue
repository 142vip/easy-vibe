<script setup>
import { computed, ref } from 'vue'
import { useI18n } from '../../../composables/useI18n.js'
import { productDiscoveryLocale } from '../../../locales/product-discovery/index.js'

const { t, messages } = useI18n(productDiscoveryLocale)
const cases = computed(() => messages.value.jtbd.cases)

const active = ref(0)
const current = computed(() => cases.value[active.value])
</script>

<template>
  <section class="lab" :aria-label="t('jtbd.ariaLabel')">
    <header class="lab-header">
      <div>
        <span class="eyebrow">{{ t('common.exercise') }}</span>
        <h3>{{ t('jtbd.title') }}</h3>
      </div>
      <span class="hint">{{ t('jtbd.hint') }}</span>
    </header>

    <div class="case-tabs" role="tablist" :aria-label="t('jtbd.selectScenario')">
      <button
        v-for="(item, index) in cases"
        :key="item.name"
        type="button"
        :class="{ active: active === index }"
        :aria-selected="active === index"
        role="tab"
        @click="active = index"
      >
        <span>{{ item.number }}</span>{{ item.name }}
      </button>
    </div>

    <div class="translation">
      <div class="feature-card">
        <span class="card-label">{{ t('jtbd.productFeature') }}</span>
        <strong>{{ current.feature }}</strong>
        <small>{{ t('jtbd.solutionDescription') }}</small>
      </div>
      <div class="arrow" aria-hidden="true">→
        <small>{{ t('jtbd.turnToJob') }}</small>
      </div>
      <div class="job-card">
        <span class="card-label">{{ t('jtbd.userJob') }}</span>
        <p><b>{{ t('jtbd.situation') }}</b>{{ current.situation }}</p>
        <p><b>{{ t('jtbd.iWant') }}</b>{{ current.progress }}</p>
        <p><b>{{ t('jtbd.soThat') }}</b>{{ current.outcome }}</p>
      </div>
    </div>

    <footer class="workaround">
      <span>{{ t('jtbd.workaround') }}</span>
      <strong>{{ current.workaround }}</strong>
    </footer>
  </section>
</template>

<style scoped>
.lab { margin: 28px 0 36px; overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg); }
.lab-header { display:flex; justify-content:space-between; gap:20px; padding:22px 24px 17px; border-bottom:1px solid var(--vp-c-divider); }
.eyebrow,.card-label { color:var(--vp-c-brand-1); font-size:12px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; }
.lab h3 { margin:6px 0 0; border:0; font-size:20px; line-height:1.45; }
.hint { align-self:center; color:var(--vp-c-text-3); font-size:12px; white-space:nowrap; }
.case-tabs { display:flex; gap:0; padding:0 24px; overflow:auto; border-bottom:1px solid var(--vp-c-divider); }
.case-tabs button { display:flex; align-items:center; gap:8px; padding:13px 16px; border:0; border-bottom:2px solid transparent; color:var(--vp-c-text-2); background:transparent; cursor:pointer; font-weight:650; }
.case-tabs button span { color:var(--vp-c-text-3); font-size:11px; letter-spacing:.08em; }
.case-tabs button.active { border-bottom-color:var(--vp-c-brand-1); color:var(--vp-c-text-1); }
.translation { display:grid; grid-template-columns:minmax(0,.75fr) 72px minmax(0,1.45fr); align-items:center; gap:14px; padding:22px 24px; }
.feature-card,.job-card { min-height:156px; padding:20px; border:1px solid var(--vp-c-divider); border-radius:8px; background:var(--vp-c-bg); }
.feature-card { display:flex; flex-direction:column; justify-content:center; text-align:center; }
.feature-card strong { margin:10px 0 4px; font-size:18px; }
.feature-card small { color:var(--vp-c-text-3); }
.job-card { border-left:3px solid var(--vp-c-brand-1); }
.job-card p { margin:8px 0; line-height:1.7; }
.job-card b { display:inline-block; width:3.2em; color:var(--vp-c-brand-1); }
.arrow { display:grid; place-items:center; color:var(--vp-c-brand-1); font-size:30px; font-weight:300; }
.arrow small { color:var(--vp-c-text-3); font-size:10px; font-weight:600; text-align:center; }
.workaround { display:grid; grid-template-columns:90px 1fr; gap:14px; align-items:start; margin:0 24px 22px; padding:13px 0 0; border-top:1px solid var(--vp-c-divider); }.workaround span { color:var(--vp-c-text-3); font-size:12px; font-weight:700; }.workaround strong { font-size:14px; line-height:1.5; }
@media (max-width:720px) { .lab-header { padding:19px 18px 15px; }.hint { display:none; }.case-tabs { padding:0 10px; }.translation { grid-template-columns:1fr; padding:18px; }.arrow { transform:rotate(90deg); height:42px; }.arrow small { display:none; }.feature-card,.job-card { min-height:auto; }.workaround { margin:0 18px 20px; } }
</style>
