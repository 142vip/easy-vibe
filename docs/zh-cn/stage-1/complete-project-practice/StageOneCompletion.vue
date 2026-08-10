<template>
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
}
</style>
