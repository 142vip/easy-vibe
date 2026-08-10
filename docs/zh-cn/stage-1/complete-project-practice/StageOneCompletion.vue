<script setup>
import { onBeforeUnmount, ref } from 'vue'

const isCelebrating = ref(false)
const celebrationRound = ref(0)
const confettiColors = ['#ffd166', '#7ce8c3', '#8eb8ff', '#ff8fab', '#ffffff', '#c7a6ff']
const confetti = Array.from({ length: 56 }, (_, index) => ({
  id: index,
  color: confettiColors[index % confettiColors.length],
  left: `${2 + ((index * 37) % 96)}%`,
  drift: `${-90 + ((index * 53) % 181)}px`,
  delay: `${(index % 14) * 0.07}s`,
  duration: `${1.75 + (index % 7) * 0.13}s`,
  width: `${6 + (index % 3) * 2}px`,
}))

const fireworkBursts = [
  { id: 1, left: '16%', top: '24%', color: '#ffd166', delay: '0.05s', distance: '116px' },
  { id: 2, left: '82%', top: '22%', color: '#7ce8c3', delay: '0.26s', distance: '125px' },
  { id: 3, left: '10%', top: '63%', color: '#ff8fab', delay: '0.48s', distance: '105px' },
  { id: 4, left: '89%', top: '66%', color: '#8eb8ff', delay: '0.67s', distance: '112px' },
  { id: 5, left: '34%', top: '14%', color: '#c7a6ff', delay: '0.82s', distance: '92px' },
  { id: 6, left: '67%', top: '79%', color: '#ffd166', delay: '0.98s', distance: '98px' },
]

const fireworkRays = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  angle: `${index * (360 / 14)}deg`,
}))

let celebrationTimer

function celebrate() {
  window.clearTimeout(celebrationTimer)
  celebrationRound.value += 1
  isCelebrating.value = true
  celebrationTimer = window.setTimeout(() => {
    isCelebrating.value = false
  }, 2800)
}

onBeforeUnmount(() => window.clearTimeout(celebrationTimer))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isCelebrating"
      :key="celebrationRound"
      class="celebration-overlay"
      aria-hidden="true"
    >
      <div class="overlay-glow" />

      <div
        v-for="burst in fireworkBursts"
        :key="burst.id"
        class="firework"
        :style="{
          left: burst.left,
          top: burst.top,
          '--firework-color': burst.color,
          '--firework-delay': burst.delay,
          '--firework-distance': burst.distance,
        }"
      >
        <i
          v-for="ray in fireworkRays"
          :key="ray.id"
          :style="{ '--firework-angle': ray.angle }"
        />
      </div>

      <div class="fullscreen-confetti">
        <i
          v-for="piece in confetti"
          :key="piece.id"
          :style="{
            left: piece.left,
            width: piece.width,
            background: piece.color,
            '--confetti-drift': piece.drift,
            '--confetti-delay': piece.delay,
            '--confetti-duration': piece.duration,
          }"
        />
      </div>

      <div class="celebration-toast">
        <span>🥂</span>
        <strong>干杯！第一阶段完成</strong>
        <small>这是你的第一件真实作品</small>
      </div>
    </div>
  </Teleport>

  <div class="stage-finale">
    <button class="celebration-launch" type="button" @click="celebrate">
      <span class="launch-icon" aria-hidden="true">🥂</span>
      <span class="launch-copy">
        <small>STAGE 1 完成礼</small>
        <strong>完成了，碰个杯！</strong>
        <em>点击放一场全屏礼花</em>
      </span>
      <span class="launch-action">
        {{ isCelebrating ? '正在庆祝' : '开始庆祝' }}
        <i aria-hidden="true">→</i>
      </span>
    </button>

    <p class="celebration-status" aria-live="polite">
      {{ isCelebrating ? '干杯！你完成了第一阶段。' : '' }}
    </p>

    <section class="stage-completion" aria-label="第一阶段已完成">
      <div class="completion-badge">第一阶段 · 已完成</div>
      <div class="completion-icon" aria-hidden="true">🏆</div>

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
  </div>
</template>

<style scoped>
.stage-finale {
  margin: 56px 0 22px;
}

.celebration-launch {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 16px;
  padding: 17px 19px;
  overflow: hidden;
  border: 1px solid rgba(255, 206, 92, 0.92);
  border-radius: 22px;
  color: #2f2450;
  background:
    radial-gradient(circle at 12% 0%, rgba(255, 255, 255, 0.8), transparent 28%),
    linear-gradient(120deg, #ffe58a 0%, #ffc868 48%, #ff9b72 100%);
  box-shadow:
    0 18px 38px rgba(209, 117, 49, 0.23),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.celebration-launch::after {
  position: absolute;
  right: -28px;
  bottom: -48px;
  width: 150px;
  height: 150px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  border-radius: 50%;
  box-shadow:
    0 0 0 22px rgba(255, 255, 255, 0.1),
    0 0 0 44px rgba(255, 255, 255, 0.06);
  content: '';
  pointer-events: none;
}

.celebration-launch:hover {
  transform: translateY(-3px);
  box-shadow:
    0 24px 48px rgba(209, 117, 49, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.celebration-launch:focus-visible {
  outline: 4px solid rgba(255, 157, 68, 0.28);
  outline-offset: 4px;
}

.launch-icon {
  position: relative;
  z-index: 1;
  display: grid;
  width: 62px;
  height: 62px;
  flex: 0 0 62px;
  place-items: center;
  border: 1px solid rgba(80, 47, 77, 0.13);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.48);
  box-shadow: 0 10px 22px rgba(132, 75, 50, 0.12);
  font-size: 32px;
}

.launch-copy {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.launch-copy small {
  color: rgba(64, 40, 73, 0.65);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.launch-copy strong {
  margin-top: 2px;
  font-size: 21px;
  line-height: 1.35;
}

.launch-copy em {
  margin-top: 2px;
  color: rgba(64, 40, 73, 0.65);
  font-size: 13px;
  font-style: normal;
}

.launch-action {
  position: relative;
  z-index: 1;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  padding: 10px 14px;
  border: 1px solid rgba(64, 40, 73, 0.15);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.58);
  font-size: 13px;
  font-weight: 800;
}

.launch-action i {
  font-style: normal;
  transition: transform 0.2s ease;
}

.celebration-launch:hover .launch-action i {
  transform: translateX(3px);
}

.celebration-status {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.stage-completion {
  position: relative;
  overflow: hidden;
  margin-top: 16px;
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

.completion-icon {
  display: grid;
  width: 68px;
  height: 68px;
  margin: 20px auto 12px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 15px 32px rgba(7, 13, 36, 0.24);
  font-size: 34px;
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

.celebration-overlay {
  position: fixed;
  z-index: 9999;
  inset: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at center, rgba(68, 45, 118, 0.26), transparent 44%),
    rgba(8, 12, 32, 0.18);
  pointer-events: none;
  animation: overlay-fade 2.8s ease both;
}

.overlay-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(78vw, 820px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 217, 119, 0.2), transparent 64%);
  transform: translate(-50%, -50%);
  animation: glow-pulse 1.2s ease-out both;
}

.firework {
  position: absolute;
  width: 6px;
  height: 6px;
}

.firework::after {
  position: absolute;
  inset: -9px;
  border: 2px solid var(--firework-color);
  border-radius: 50%;
  content: '';
  opacity: 0;
  animation: firework-ring 1.15s ease-out var(--firework-delay) both;
}

.firework i {
  position: absolute;
  top: 0;
  left: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--firework-color);
  box-shadow: 0 0 12px var(--firework-color);
  opacity: 0;
  animation: firework-spark 1.25s cubic-bezier(0.15, 0.7, 0.25, 1)
    var(--firework-delay) both;
}

.fullscreen-confetti {
  position: absolute;
  inset: 0;
}

.fullscreen-confetti i {
  position: absolute;
  top: -24px;
  height: 15px;
  border-radius: 2px;
  opacity: 0;
  animation: fullscreen-confetti-fall var(--confetti-duration) linear var(--confetti-delay)
    forwards;
}

.celebration-toast {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  width: min(88vw, 430px);
  flex-direction: column;
  align-items: center;
  padding: 25px 28px 23px;
  border: 1px solid rgba(255, 255, 255, 0.34);
  border-radius: 26px;
  color: #fff;
  background: rgba(26, 29, 65, 0.84);
  box-shadow:
    0 28px 80px rgba(4, 6, 24, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-align: center;
  backdrop-filter: blur(16px);
  transform: translate(-50%, -50%);
  animation: toast-pop 2.7s cubic-bezier(0.2, 0.8, 0.25, 1) both;
}

.celebration-toast span {
  font-size: 48px;
  line-height: 1;
}

.celebration-toast strong {
  margin-top: 13px;
  font-size: 24px;
}

.celebration-toast small {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
}

@keyframes overlay-fade {
  0% {
    opacity: 0;
  }

  10%,
  82% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes glow-pulse {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes firework-spark {
  0% {
    opacity: 0;
    transform: rotate(var(--firework-angle)) translateX(0) scale(0.2);
  }

  12% {
    opacity: 1;
  }

  75% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: rotate(var(--firework-angle)) translateX(var(--firework-distance)) scale(0.25);
  }
}

@keyframes firework-ring {
  0% {
    opacity: 0.9;
    transform: scale(0.25);
  }

  100% {
    opacity: 0;
    transform: scale(8);
  }
}

@keyframes fullscreen-confetti-fall {
  0% {
    opacity: 0;
    transform: translate3d(0, -4vh, 0) rotate(0deg);
  }

  10% {
    opacity: 1;
  }

  100% {
    opacity: 0.85;
    transform: translate3d(var(--confetti-drift), 108vh, 0) rotate(680deg);
  }
}

@keyframes toast-pop {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.56);
  }

  15% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.04);
  }

  22%,
  82% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.06);
  }
}

@media (max-width: 640px) {
  .stage-finale {
    margin-top: 40px;
  }

  .celebration-launch {
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px;
    border-radius: 20px;
  }

  .launch-icon {
    width: 56px;
    height: 56px;
    flex-basis: 56px;
    font-size: 29px;
  }

  .launch-copy strong {
    font-size: 19px;
  }

  .launch-action {
    width: 100%;
    justify-content: center;
    margin-left: 0;
  }

  .stage-completion {
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

  .celebration-toast {
    padding: 22px 18px 20px;
    border-radius: 22px;
  }

  .celebration-toast strong {
    font-size: 21px;
  }

  .firework:nth-of-type(5),
  .firework:nth-of-type(6) {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .celebration-launch,
  .completion-next,
  .launch-action i,
  .celebration-overlay,
  .overlay-glow,
  .firework::after,
  .firework i,
  .fullscreen-confetti i,
  .celebration-toast {
    animation: none !important;
    transition: none !important;
  }

  .firework,
  .fullscreen-confetti {
    display: none;
  }

  .celebration-overlay,
  .celebration-toast {
    opacity: 1;
  }
}
</style>
