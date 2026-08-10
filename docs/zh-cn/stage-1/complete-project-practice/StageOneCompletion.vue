<script setup>
import { onBeforeUnmount, ref } from 'vue'

const isCelebrating = ref(false)
const hasCelebrated = ref(false)
const celebrationRound = ref(0)
const confettiColors = ['#ffd166', '#7ce8c3', '#8eb8ff', '#ff8fab', '#ffffff', '#c7a6ff']
const confetti = Array.from({ length: 88 }, (_, index) => ({
  id: index,
  color: confettiColors[index % confettiColors.length],
  left: `${2 + ((index * 37) % 96)}%`,
  drift: `${-90 + ((index * 53) % 181)}px`,
  delay: `${(index % 18) * 0.055}s`,
  duration: `${2.05 + (index % 7) * 0.1}s`,
  width: `${6 + (index % 3) * 2}px`,
}))

const fireworkBursts = [
  { id: 1, left: '9%', top: '22%', color: '#ffd166', delay: '0.04s', distance: '142px' },
  { id: 2, left: '28%', top: '12%', color: '#c7a6ff', delay: '0.18s', distance: '124px' },
  { id: 3, left: '74%', top: '14%', color: '#7ce8c3', delay: '0.31s', distance: '138px' },
  { id: 4, left: '92%', top: '28%', color: '#8eb8ff', delay: '0.46s', distance: '152px' },
  { id: 5, left: '12%', top: '68%', color: '#ff8fab', delay: '0.63s', distance: '132px' },
  { id: 6, left: '31%', top: '83%', color: '#ffd166', delay: '0.78s', distance: '118px' },
  { id: 7, left: '72%', top: '84%', color: '#ff8fab', delay: '0.93s', distance: '128px' },
  { id: 8, left: '91%', top: '68%', color: '#7ce8c3', delay: '1.08s', distance: '142px' },
  { id: 9, left: '48%', top: '10%', color: '#ffffff', delay: '1.22s', distance: '116px' },
  { id: 10, left: '54%', top: '88%', color: '#8eb8ff', delay: '1.38s', distance: '124px' },
]

const fireworkRays = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  angle: `${index * 20}deg`,
}))

const stars = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${3 + ((index * 47) % 94)}%`,
  top: `${5 + ((index * 31) % 88)}%`,
  size: `${3 + (index % 4) * 2}px`,
  delay: `${(index % 12) * 0.11}s`,
}))

let celebrationTimer

function celebrate() {
  window.clearTimeout(celebrationTimer)
  celebrationRound.value += 1
  isCelebrating.value = true
  hasCelebrated.value = true
  celebrationTimer = window.setTimeout(() => {
    isCelebrating.value = false
  }, 4200)
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
      <div class="celebration-flash" />
      <div class="overlay-glow" />
      <div class="celebration-rays" />
      <i class="ceremony-spotlight spotlight-left" />
      <i class="ceremony-spotlight spotlight-right" />

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

      <div
        class="firework hero-firework"
        :style="{
          '--firework-color': '#ffd166',
          '--firework-delay': '0.16s',
          '--firework-distance': '210px',
        }"
      >
        <i
          v-for="ray in fireworkRays"
          :key="ray.id"
          :style="{ '--firework-angle': ray.angle }"
        />
      </div>

      <div class="starfield">
        <i
          v-for="star in stars"
          :key="star.id"
          :style="{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            '--star-delay': star.delay,
          }"
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
        <b>EASY VIBE · STAGE 1</b>
        <div class="ceremony-emblem" aria-hidden="true">
          <span>🏆</span>
        </div>
        <div class="ceremony-divider" aria-hidden="true">
          <i />
          <span>✦</span>
          <i />
        </div>
        <strong>第一阶段，正式完成</strong>
        <p>你完成了从一个想法到第一件真实作品的旅程</p>
        <small><span aria-hidden="true">🥂</span> 为你的第一件作品干杯</small>
      </div>
    </div>
  </Teleport>

  <div class="stage-finale">
    <button
      class="celebration-launch"
      :class="{ 'is-celebrating': isCelebrating }"
      type="button"
      @click="celebrate"
    >
      <span class="launch-icon" aria-hidden="true">🎉</span>
      <span class="launch-copy">
        <small>STAGE 1 · COMPLETION CEREMONY</small>
        <strong>{{ hasCelebrated ? '再庆祝一次！' : '第一阶段，正式完成' }}</strong>
        <em>{{ hasCelebrated ? '礼花可以再放一次' : '点击开启你的完成仪式' }}</em>
      </span>
      <span class="launch-action">
        {{ isCelebrating ? '仪式进行中' : hasCelebrated ? '再来一次' : '开启仪式' }}
        <i aria-hidden="true">→</i>
      </span>
    </button>

    <p class="celebration-status" aria-live="polite">
      {{ isCelebrating ? '第一阶段完成，庆祝仪式开始。' : '' }}
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
  animation: launch-glow 2.4s ease-in-out infinite;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.celebration-launch.is-celebrating {
  animation: none;
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
    radial-gradient(circle at center, rgba(79, 50, 145, 0.42), transparent 48%),
    rgba(4, 7, 28, 0.44);
  backdrop-filter: blur(1.5px) saturate(1.12);
  pointer-events: none;
  animation: overlay-fade 4.2s ease both;
}

.celebration-overlay::before,
.celebration-overlay::after {
  position: absolute;
  z-index: 4;
  top: 0;
  bottom: 0;
  width: min(17vw, 220px);
  content: '';
  opacity: 0;
  animation: curtain-open 1.1s cubic-bezier(0.2, 0.78, 0.25, 1) both;
  pointer-events: none;
}

.celebration-overlay::before {
  left: 0;
  background: linear-gradient(90deg, rgba(74, 22, 64, 0.82), rgba(120, 46, 83, 0.34), transparent);
  transform-origin: left center;
}

.celebration-overlay::after {
  right: 0;
  background: linear-gradient(-90deg, rgba(74, 22, 64, 0.82), rgba(120, 46, 83, 0.34), transparent);
  transform-origin: right center;
}

.celebration-flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, #fffbd8 0%, #ffd98b 18%, transparent 62%);
  animation: celebration-flash 0.82s ease-out both;
}

.overlay-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(92vw, 980px);
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(255, 239, 170, 0.3), transparent 56%),
    radial-gradient(circle, rgba(151, 112, 255, 0.24), transparent 70%);
  transform: translate(-50%, -50%);
  animation: glow-pulse 1.2s ease-out both;
}

.celebration-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 125vmax;
  height: 125vmax;
  border-radius: 50%;
  background: repeating-conic-gradient(
    from 8deg,
    rgba(255, 233, 154, 0.18) 0deg 2deg,
    transparent 2deg 14deg
  );
  opacity: 0;
  transform: translate(-50%, -50%);
  animation: celebration-rays 3.4s ease-out 0.12s both;
  mask-image: radial-gradient(circle, transparent 0 11%, #000 26%, transparent 74%);
}

.ceremony-spotlight {
  position: absolute;
  z-index: 1;
  top: -16vh;
  width: 34vw;
  height: 108vh;
  background: linear-gradient(180deg, rgba(255, 238, 174, 0.26), transparent 78%);
  clip-path: polygon(45% 0, 55% 0, 100% 100%, 0 100%);
  opacity: 0;
  transform-origin: top center;
  animation: spotlight-enter 3.7s ease-out 0.18s both;
}

.spotlight-left {
  left: 4vw;
  transform: rotate(-17deg);
}

.spotlight-right {
  right: 4vw;
  transform: rotate(17deg);
}

.firework {
  position: absolute;
  z-index: 2;
  width: 6px;
  height: 6px;
}

.hero-firework {
  top: 50%;
  left: 50%;
  z-index: 1;
}

.hero-firework i {
  width: 10px;
  height: 10px;
  box-shadow:
    0 0 12px #fff7ca,
    0 0 24px var(--firework-color);
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
  z-index: 5;
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

.starfield {
  position: absolute;
  z-index: 3;
  inset: 0;
}

.starfield i {
  position: absolute;
  border-radius: 50%;
  background: #fff8c9;
  box-shadow:
    0 0 8px #fff,
    0 0 18px #ffd166;
  opacity: 0;
  animation: star-twinkle 1.35s ease-in-out var(--star-delay) both;
}

.celebration-toast {
  position: absolute;
  z-index: 6;
  top: 50%;
  left: 50%;
  display: flex;
  width: min(90vw, 510px);
  flex-direction: column;
  align-items: center;
  padding: 26px 34px 27px;
  border: 1px solid rgba(255, 218, 119, 0.55);
  border-radius: 28px;
  color: #fff;
  background:
    radial-gradient(circle at 50% 0%, rgba(152, 105, 224, 0.44), transparent 53%),
    linear-gradient(155deg, rgba(40, 30, 87, 0.96), rgba(16, 31, 67, 0.96));
  box-shadow:
    0 0 0 5px rgba(255, 218, 119, 0.07),
    0 0 0 6px rgba(255, 218, 119, 0.18),
    0 0 100px rgba(255, 199, 83, 0.3),
    0 32px 100px rgba(4, 6, 24, 0.62),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-align: center;
  backdrop-filter: blur(16px);
  transform: translate(-50%, -50%);
  animation: toast-pop 4.05s cubic-bezier(0.2, 0.8, 0.25, 1) both;
}

.celebration-toast::before {
  position: absolute;
  inset: 9px;
  border: 1px solid rgba(255, 231, 162, 0.16);
  border-radius: 20px;
  content: '';
  pointer-events: none;
}

.celebration-toast b {
  padding: 5px 11px;
  border: 1px solid rgba(255, 218, 119, 0.35);
  border-radius: 999px;
  color: #ffe9a9;
  background: rgba(255, 214, 104, 0.1);
  font-size: 10px;
  letter-spacing: 0.16em;
}

.ceremony-emblem {
  position: relative;
  display: grid;
  width: 104px;
  height: 104px;
  margin-top: 16px;
  place-items: center;
  border: 1px solid rgba(255, 221, 128, 0.35);
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(255, 223, 135, 0.2), transparent 64%),
    rgba(255, 255, 255, 0.06);
  box-shadow:
    0 0 0 7px rgba(255, 217, 116, 0.05),
    0 14px 36px rgba(4, 8, 30, 0.34);
  animation: emblem-arrive 1s cubic-bezier(0.18, 0.86, 0.3, 1.18) 0.15s both;
}

.ceremony-emblem::before,
.ceremony-emblem::after {
  position: absolute;
  top: 14px;
  width: 34px;
  height: 70px;
  border: 3px solid rgba(255, 218, 114, 0.78);
  content: '';
}

.ceremony-emblem::before {
  left: -20px;
  border-top-color: transparent;
  border-right: 0;
  border-radius: 50% 0 0 50%;
  transform: rotate(-13deg);
}

.ceremony-emblem::after {
  right: -20px;
  border-top-color: transparent;
  border-left: 0;
  border-radius: 0 50% 50% 0;
  transform: rotate(13deg);
}

.ceremony-emblem > span {
  font-size: 48px;
  line-height: 1;
  filter: drop-shadow(0 8px 12px rgba(7, 10, 32, 0.35));
}

.ceremony-divider {
  display: flex;
  width: min(78%, 300px);
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  color: #ffe39a;
}

.ceremony-divider i {
  height: 1px;
  flex: 1;
  background: linear-gradient(90deg, transparent, rgba(255, 224, 143, 0.72));
}

.ceremony-divider i:last-child {
  background: linear-gradient(-90deg, transparent, rgba(255, 224, 143, 0.72));
}

.ceremony-divider span {
  font-size: 13px;
}

.celebration-toast strong {
  margin-top: 14px;
  color: #fff;
  font-size: 28px;
  letter-spacing: 0.03em;
  animation: ceremony-copy-enter 0.75s ease-out 0.55s both;
}

.celebration-toast p {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  line-height: 1.65;
  animation: ceremony-copy-enter 0.75s ease-out 0.76s both;
}

.celebration-toast small {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 18px;
  padding: 7px 12px;
  border: 1px solid rgba(255, 221, 130, 0.24);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.06);
  font-size: 14px;
  animation: ceremony-copy-enter 0.75s ease-out 0.94s both;
}

.celebration-toast small span {
  font-size: 18px;
}

@keyframes launch-glow {
  0%,
  100% {
    box-shadow:
      0 18px 38px rgba(209, 117, 49, 0.23),
      0 0 0 0 rgba(255, 184, 74, 0.32),
      inset 0 1px 0 rgba(255, 255, 255, 0.72);
  }

  50% {
    box-shadow:
      0 22px 46px rgba(209, 117, 49, 0.32),
      0 0 0 7px rgba(255, 184, 74, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.72);
  }
}

@keyframes curtain-open {
  0% {
    opacity: 0.9;
    transform: scaleX(1.65);
  }

  100% {
    opacity: 0.5;
    transform: scaleX(1);
  }
}

@keyframes spotlight-enter {
  0% {
    opacity: 0;
    filter: blur(12px);
  }

  22%,
  82% {
    opacity: 0.78;
    filter: blur(3px);
  }

  100% {
    opacity: 0;
    filter: blur(8px);
  }
}

@keyframes emblem-arrive {
  0% {
    opacity: 0;
    transform: translateY(22px) scale(0.45) rotate(-8deg);
  }

  70% {
    opacity: 1;
    transform: translateY(-3px) scale(1.06) rotate(2deg);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
}

@keyframes ceremony-copy-enter {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
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

@keyframes celebration-flash {
  0% {
    opacity: 0.92;
    transform: scale(0.1);
  }

  28% {
    opacity: 0.5;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(1.35);
  }
}

@keyframes celebration-rays {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(0deg) scale(0.4);
  }

  20% {
    opacity: 0.72;
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(22deg) scale(1);
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

@keyframes star-twinkle {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }

  38% {
    opacity: 1;
    transform: scale(1.7);
  }

  70% {
    opacity: 0.9;
    transform: scale(0.72);
  }

  100% {
    opacity: 0;
    transform: scale(0.1);
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
    padding: 22px 18px 23px;
    border-radius: 22px;
  }

  .celebration-toast strong {
    font-size: 23px;
  }

  .ceremony-emblem {
    width: 88px;
    height: 88px;
  }

  .ceremony-emblem > span {
    font-size: 41px;
  }

  .ceremony-emblem::before,
  .ceremony-emblem::after {
    top: 11px;
    height: 61px;
  }

  .ceremony-spotlight {
    width: 48vw;
  }

  .hero-firework i {
    --firework-distance: 145px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .celebration-launch,
  .completion-next,
  .launch-action i,
  .celebration-overlay,
  .celebration-overlay::before,
  .celebration-overlay::after,
  .celebration-flash,
  .overlay-glow,
  .celebration-rays,
  .ceremony-spotlight,
  .firework::after,
  .firework i,
  .fullscreen-confetti i,
  .starfield i,
  .celebration-toast,
  .ceremony-emblem,
  .celebration-toast strong,
  .celebration-toast p,
  .celebration-toast small {
    animation: none !important;
    transition: none !important;
  }

  .firework,
  .fullscreen-confetti,
  .starfield,
  .celebration-rays,
  .celebration-flash {
    display: none;
  }

  .celebration-overlay,
  .celebration-toast {
    opacity: 1;
  }
}
</style>
