<script setup>
import { computed, ref } from 'vue'
import { useI18n } from '../../../composables/useI18n.js'
import { productDiscoveryLocale } from '../../../locales/product-discovery/index.js'

const { t, messages } = useI18n(productDiscoveryLocale)
const statements = computed(() => messages.value.interview.statements)

const answers = ref({})
const score = computed(() => Object.entries(answers.value).filter(([index, value]) => statements.value[index].evidence === value).length)
const answered = computed(() => Object.keys(answers.value).length)

function choose(index, value) {
  answers.value = { ...answers.value, [index]: value }
}
</script>

<template>
  <section class="lab" :aria-label="t('interview.ariaLabel')">
    <header class="lab-header">
      <div>
        <span class="eyebrow">{{ t('common.exercise') }}</span>
        <h3>{{ t('interview.title') }}</h3>
        <p>{{ t('interview.description') }}</p>
      </div>
      <div class="score"><strong>{{ score }}</strong><span>/ {{ answered }} {{ t('interview.correctCount') }}</span></div>
    </header>

    <div class="statement-list">
      <article v-for="(item, index) in statements" :key="item.text" :class="['statement', { resolved: answers[index] !== undefined }]">
        <div class="number">{{ String(index + 1).padStart(2, '0') }}</div>
        <div class="content">
          <p>{{ item.text }}</p>
          <div class="choices" role="group" :aria-label="t('interview.judgeStatement', { number: index + 1 })">
            <button type="button" :class="{ selected: answers[index] === true }" @click="choose(index, true)">{{ t('interview.evidence') }}</button>
            <button type="button" :class="{ selected: answers[index] === false }" @click="choose(index, false)">{{ t('interview.opinion') }}</button>
          </div>
          <div v-if="answers[index] !== undefined" :class="['feedback', answers[index] === item.evidence ? 'correct' : 'wrong']" aria-live="polite">
            <strong>{{ answers[index] === item.evidence ? t('interview.correct') : t('interview.incorrect') }}</strong>
            {{ item.note }}
          </div>
        </div>
      </article>
    </div>

    <footer><b>{{ t('interview.criterionLabel') }}</b>{{ t('interview.criterion') }}</footer>
  </section>
</template>

<style scoped>
.lab { margin:28px 0 36px; overflow:hidden; border:1px solid var(--vp-c-divider); border-radius:12px; background:var(--vp-c-bg); }
.lab-header { display:flex; justify-content:space-between; gap:20px; padding:22px 24px; border-bottom:1px solid var(--vp-c-divider); }
.eyebrow { color:var(--vp-c-brand-1); font-size:12px; font-weight:800; letter-spacing:.1em; }.lab h3 { margin:6px 0 4px; border:0; font-size:20px; }.lab-header p { margin:0; color:var(--vp-c-text-2); font-size:14px; }
.score { display:grid; align-content:center; min-width:88px; text-align:center; }.score strong { color:var(--vp-c-text-1); font-size:30px; line-height:1; }.score span { margin-top:5px; color:var(--vp-c-text-3); font-size:11px; }
.statement-list { display:grid; gap:0; padding:0 24px 22px; }.statement { display:grid; grid-template-columns:40px 1fr; gap:13px; padding:18px 0; border-bottom:1px solid var(--vp-c-divider); background:var(--vp-c-bg); }.statement.resolved { border-bottom-color:var(--vp-c-divider); }
.number { padding-top:4px; color:var(--vp-c-text-3); font-size:12px; font-weight:800; }.content p { margin:0 0 12px; color:var(--vp-c-text-1); font-weight:650; line-height:1.6; }
.choices { display:flex; gap:8px; }.choices button { min-width:62px; padding:6px 12px; border:1px solid var(--vp-c-divider); border-radius:6px; color:var(--vp-c-text-2); background:transparent; cursor:pointer; font-size:13px; font-weight:650; }.choices button.selected { border-color:var(--vp-c-brand-1); color:var(--vp-c-brand-1); background:color-mix(in srgb, var(--vp-c-brand-1) 6%, var(--vp-c-bg)); }
.feedback { margin-top:12px; padding:10px 12px; border-left:2px solid currentColor; font-size:13px; line-height:1.55; }.feedback strong { margin-right:6px; }.feedback.correct { color:#17734d; background:color-mix(in srgb, #22a06b 6%, var(--vp-c-bg)); }.feedback.wrong { color:#8a5a14; background:color-mix(in srgb, #f59e0b 6%, var(--vp-c-bg)); }
footer { padding:15px 26px 18px; border-top:1px solid var(--vp-c-divider); color:var(--vp-c-text-2); font-size:13px; line-height:1.6; } footer b { color:var(--vp-c-text-1); }
@media (max-width:640px) { .lab-header { padding:19px 18px; }.score { min-width:68px; }.statement-list { padding:0 18px 18px; }.statement { grid-template-columns:32px 1fr; }.choices { flex-wrap:wrap; } footer { padding:14px 18px 17px; } }
</style>
