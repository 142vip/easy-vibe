<script setup>
import { onBeforeUnmount, ref } from 'vue'

const isCelebrating = ref(false)
const celebrationRound = ref(0)
const confettiColors = ['#ffd166', '#7ce8c3', '#8eb8ff', '#ff8fab', '#ffffff']
const confetti = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  color: confettiColors[index % confettiColors.length],
  left: `${8 + ((index * 37) % 84)}%`,
  drift: `${-72 + ((index * 53) % 145)}px`,
  delay: `${(index % 6) * 0.055}s`,
  duration: `${1.15 + (index % 5) * 0.12}s`,
}))

let celebrationTimer

function celebrate() {
  window.clearTimeout(celebrationTimer)
  celebrationRound.value += 1
  isCelebrating.value = true
  celebrationTimer = window.setTimeout(() => {
    isCelebrating.value = false
  }, 1900)
}

onBeforeUnmount(() => window.clearTimeout(celebrationTimer))
</script>

<template>
  <section class="stage-completion" aria-label="第一阶段已完成">
    <div
      v-if="isCelebrating"
      :key="celebrationRound"
      class="confetti-field"
      aria-hidden="true"
    >
      <i
        v-for="piece in confetti"
        :key="piece.id"
        :style="{
          left: piece.left,
          background: piece.color,
          '--confetti-drift': piece.drift,
          '--confetti-delay': piece.delay,
          '--confetti-duration': piece.duration,
        }"
      />
    </div>

    <div class="completion-badge">第一阶段 · 已完成</div>

    <button
      class="celebration-button"
      :class="{ 'is-celebrating': isCelebrating }"
      type="button"
      aria-label="碰个杯，庆祝完成第一阶段"
      @click="celebrate"
    >
      <span :key="celebrationRound" class="celebration-icon" aria-hidden="true">🥂</span>
      <span class="celebration-copy">
        <strong>{{ isCelebrating ? '干杯！第一阶段完成' : '碰个杯，庆祝一下' }}</strong>
        <small>{{ isCelebrating ? '这是你的第一件真实作品' : '点一下' }}</small>
      </span>
    </button>

    <p class="celebration-status" aria-live="polite">
      {{ isCelebrating ? '干杯！你完成了第一阶段。' : '' }}
    </p>

    <h2>你完成了第一阶段</h2>
    <p class="completion-lead">
      从第一次让 AI 写出一个小游戏，到把自己的产品交给别人使用，你已经走完了一次真正的软件创作。
    </p>

    <div class="completion-route" aria-label="第一阶段学习路径">
      <span>找到问题</span>
      <i aria-hidden="true">→</i>
      <span>做出原型</span>
      <i aria-hidden="true">→</i>
      <span>接入 AI</span>
      <i aria-hidden="true">→</i>
      <span>交给用户</span>
    </div>

    <div class="completion-message">
      <strong>你的第一件作品已经可以出发了。</strong>
      <span>它不只是本地 Demo，而是一个被真实的人打开、使用和改进过的产品。</span>
    </div>

    <a class="completion-next" href="../../stage-2/frontend/lovart-assets/">
      继续进入 Stage 2
      <span aria-hidden="true">→</span>
    </a>
  </section>
</template>

<style scoped>
.stage-completion {
  position: relative;
  overflow: hidden;
  margin: 56px 0 22px;
  padding: 42px 34px 38px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 26px;
  color: #fff;
  background:
    radial-gradient(circle at 12% 8%, rgba(137, 108, 255, 0.48), transparent 33%),
    radial-gradient(circle at 90% 86%, rgba(39, 201, 156, 0.3), transparent 34%),
    linear-gradient(145deg, #241c48 0%, #17385a 56%, #155567 100%);
  box-shadow: 0 24px 54px rgba(25, 34, 70, 0.24);
  text-align: center;
}

.stage-completion::before,
.stage-completion::after {
  position: absolute;
  color: rgba(255, 255, 255, 0.2);
  content: '✦';
  font-size: 25px;
}

.confetti-field {
  position: absolute;
  z-index: 3;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.confetti-field i {
  position: absolute;
  top: 24%;
  width: 8px;
  height: 13px;
  border-radius: 2px;
  opacity: 0;
  animation: confetti-fall var(--confetti-duration) cubic-bezier(0.2, 0.7, 0.35, 1)
    var(--confetti-delay) forwards;
}

.stage-completion::before {
  top: 28px;
  left: 10%;
}

.stage-completion::after {
  right: 9%;
  bottom: 74px;
  font-size: 18px;
}

.completion-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 13px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
  color: rgba(255, 255, 255, 0.82);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.celebration-button {
  position: relative;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin: 20px auto 14px;
  padding: 8px 15px 8px 9px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 18px;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 15px 32px rgba(7, 13, 36, 0.24);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.celebration-button:hover {
  border-color: rgba(255, 255, 255, 0.38);
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-2px);
}

.celebration-button:focus-visible {
  outline: 3px solid rgba(255, 214, 102, 0.7);
  outline-offset: 4px;
}

.celebration-icon {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 29px;
  transform-origin: 50% 70%;
}

.celebration-button.is-celebrating .celebration-icon {
  animation: glasses-clink 0.72s cubic-bezier(0.2, 0.85, 0.3, 1.25) both;
}

.celebration-button.is-celebrating::after {
  position: absolute;
  top: 23px;
  left: 33px;
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 223, 128, 0.9);
  border-radius: 50%;
  content: '';
  animation: clink-ring 0.75s ease-out both;
  pointer-events: none;
}

.celebration-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.celebration-copy strong {
  font-size: 14px;
  line-height: 1.35;
}

.celebration-copy small {
  color: rgba(255, 255, 255, 0.62);
  font-size: 11px;
}

.celebration-status {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.stage-completion h2 {
  margin: 0;
  border: 0;
  color: #fff;
  font-size: 30px;
  line-height: 1.35;
}

.completion-lead {
  max-width: 610px;
  margin: 14px auto 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: 16px;
  line-height: 1.8;
}

.completion-route {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 26px auto 0;
}

.completion-route span {
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  font-weight: 600;
}

.completion-route i {
  color: rgba(255, 255, 255, 0.42);
  font-style: normal;
}

.completion-message {
  display: flex;
  max-width: 590px;
  flex-direction: column;
  gap: 5px;
  margin: 26px auto 0;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.completion-message strong {
  color: #fff;
  font-size: 17px;
}

.completion-message span {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.7;
}

.completion-next {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: 24px;
  padding: 11px 18px;
  border-radius: 12px;
  color: #17385a;
  background: #fff;
  box-shadow: 0 10px 24px rgba(7, 13, 36, 0.22);
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.completion-next:hover {
  color: #17385a;
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(7, 13, 36, 0.28);
}

@keyframes glasses-clink {
  0% {
    transform: scale(1) rotate(0deg);
  }

  35% {
    transform: scale(1.24) rotate(-12deg);
  }

  55% {
    transform: scale(1.32) rotate(10deg);
  }

  75% {
    transform: scale(1.18) rotate(-5deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
  }
}

@keyframes clink-ring {
  0% {
    opacity: 0.9;
    transform: scale(0.25);
  }

  100% {
    opacity: 0;
    transform: scale(3.2);
  }
}

@keyframes confetti-fall {
  0% {
    opacity: 0;
    transform: translate3d(0, -18px, 0) rotate(0deg);
  }

  12% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate3d(var(--confetti-drift), 370px, 0) rotate(560deg);
  }
}

@media (max-width: 640px) {
  .stage-completion {
    margin-top: 40px;
    padding: 34px 20px 30px;
    border-radius: 21px;
  }

  .stage-completion h2 {
    font-size: 25px;
  }

  .completion-lead {
    font-size: 15px;
  }

  .completion-route {
    flex-wrap: wrap;
    gap: 8px;
  }

  .completion-route i {
    display: none;
  }

  .completion-route span {
    flex: 1 1 calc(50% - 8px);
  }

  .celebration-button {
    max-width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .celebration-button,
  .completion-next,
  .celebration-icon,
  .confetti-field i,
  .celebration-button::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
