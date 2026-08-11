<template>
  <figure class="release-pipeline" aria-labelledby="pipeline-title">
    <figcaption>
      <span>从代码到商店</span>
      <strong id="pipeline-title">每一步都在回答一个不同的问题</strong>
    </figcaption>

    <div class="pipeline-grid">
      <article v-for="(item, index) in steps" :key="item.title">
        <div class="step-top">
          <span class="step-number">{{ index + 1 }}</span>
          <span class="step-icon" aria-hidden="true">{{ item.icon }}</span>
        </div>
        <h3>{{ item.title }}</h3>
        <b>{{ item.question }}</b>
        <p>{{ item.description }}</p>
        <code>{{ item.example }}</code>
      </article>
    </div>

    <p class="pipeline-note">
      <span aria-hidden="true">💡</span>
      能生成安装包，只完成了第一步。没有正式签名的包很难获得用户和系统信任，也不能稳定更新。
    </p>
  </figure>
</template>

<script setup>
const steps = [
  {
    icon: '📦',
    title: '打包',
    question: '交付文件是什么？',
    description: '把源码和资源编译成用户或商店可以接收的文件。',
    example: '.aab · .msix · .app',
  },
  {
    icon: '🔏',
    title: '签名',
    question: '是谁发布的？',
    description: '用证书或密钥证明发布身份，并让旧用户能够继续升级。',
    example: '证书 · keystore · Developer ID',
  },
  {
    icon: '🚚',
    title: '分发',
    question: '用户从哪里获得？',
    description: '选择应用商店、官网、测试渠道或企业设备管理。',
    example: 'Store · 官网 · TestFlight',
  },
  {
    icon: '✅',
    title: '审核',
    question: '是否符合平台规则？',
    description: '平台检查程序、隐私、支付、内容和商店资料。',
    example: '资料检查 · 安全检查 · 人工审核',
  },
]
</script>

<style scoped>
.release-pipeline {
  margin: 24px 0 34px;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background:
    radial-gradient(circle at 0 0, color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent), transparent 34%),
    var(--vp-c-bg-soft);
}

figcaption {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 17px;
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

.pipeline-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

article {
  position: relative;
  min-width: 0;
  padding: 15px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 13px;
  background: var(--vp-c-bg);
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

article:not(:last-child)::after {
  position: absolute;
  z-index: 2;
  top: 47px;
  right: -9px;
  display: grid;
  width: 18px;
  height: 18px;
  place-items: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  content: '›';
  font-size: 16px;
}

article:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 45%, var(--vp-c-divider));
  box-shadow: 0 10px 24px rgba(25, 32, 54, 0.08);
}

.step-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.step-number {
  display: grid;
  width: 23px;
  height: 23px;
  place-items: center;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}

.step-icon {
  font-size: 24px;
}

h3 {
  margin: 13px 0 2px;
  border: 0;
  color: var(--vp-c-text-1);
  font-size: 16px;
}

b {
  display: block;
  margin-bottom: 8px;
  color: var(--vp-c-brand-1);
  font-size: 11px;
}

article p {
  min-height: 56px;
  margin: 0 0 11px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.55;
}

code {
  display: block;
  overflow: hidden;
  padding: 7px 8px;
  border-radius: 7px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pipeline-note {
  display: flex;
  gap: 8px;
  margin: 12px 0 0;
  padding: 11px 13px;
  border: 1px dashed color-mix(in srgb, var(--vp-c-brand-1) 32%, var(--vp-c-divider));
  border-radius: 10px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 5%, var(--vp-c-bg));
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.55;
}

@media (max-width: 820px) {
  .pipeline-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  article::after {
    display: none !important;
  }
}

@media (max-width: 520px) {
  .release-pipeline {
    padding: 16px;
  }

  .pipeline-grid {
    grid-template-columns: 1fr;
  }

  article p {
    min-height: 0;
  }
}
</style>
