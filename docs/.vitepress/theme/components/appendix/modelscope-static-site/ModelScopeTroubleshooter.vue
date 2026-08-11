<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const problems = [
  {
    id: 'blank',
    badge: '404',
    title: '页面 404 或空白',
    cause: '发布目录选错，或创空间仓库根目录没有 index.html。',
    action: '检查当前发布目录和远端文件结构，修正后重新同步并部署。',
    prompt:
      '请使用 ms-studio-deploy 检查当前创空间为什么出现 404 或空白页。确认仓库根目录是否有 index.html，修正发布目录后重新同步、部署，并把最终链接发给我。'
  },
  {
    id: 'assets',
    badge: 'CSS',
    title: '样式、脚本或图片丢失',
    cause: '静态资源使用了错误的绝对路径，构建后的请求返回 404。',
    action: '检查资源请求和构建配置，必要时修正 Vite base 后重新构建。',
    prompt:
      "请使用 ms-studio-deploy 排查当前 Static 创空间的样式、脚本或图片为什么加载失败。检查资源 404 和构建路径；如果是 Vite base 配置问题，请修复、重新构建并部署。"
  },
  {
    id: 'route',
    badge: 'SPA',
    title: '刷新子页面后 404',
    cause: '单页应用使用 History 路由，但静态托管没有对应的回退规则。',
    action: '确认路由方式，适合时改为 Hash 路由并重新构建。',
    prompt:
      '请检查当前网页是否因为 SPA History 路由导致刷新子页面 404。适合的话改为 Hash 路由，然后重新构建，并使用 ms-studio-deploy 更新创空间。'
  },
  {
    id: 'stale',
    badge: '↻',
    title: '部署后还是旧页面',
    cause: '远端 master 没有更新，或者新提交没有触发重新部署。',
    action: '核对远端提交和部署状态，重新同步并触发部署。',
    prompt:
      '请使用 ms-studio-deploy 检查为什么创空间仍然显示旧页面。核对远端 master 的最新提交和部署状态，重新同步、部署，并确认最终页面已经更新。'
  },
  {
    id: 'git',
    badge: 'Git',
    title: '代码同步被拒绝',
    cause: '远端已经有 README 等提交，本地历史与远端历史不同。',
    action: '安全获取并合并远端 master，再正常推送；禁止强制覆盖。',
    prompt:
      '请使用 ms-studio-deploy 处理当前创空间的 Git 同步冲突。获取并合并远端 master，保留需要的网页文件，不要强制推送，成功后继续部署。'
  },
  {
    id: 'cors',
    badge: 'API',
    title: 'API 请求被浏览器拦截',
    cause: '后端没有允许当前来源，或者页面与接口混用了 HTTP 和 HTTPS。',
    action: '定位失败请求；服务端配置 CORS，并统一使用 HTTPS。',
    prompt:
      '请排查当前网页的 API 请求为什么被浏览器拦截。检查 CORS、请求来源和 HTTP/HTTPS 混用；说明需要修改的后端配置。修复网页后，再使用 ms-studio-deploy 重新发布。'
  },
  {
    id: 'secret',
    badge: 'Key',
    title: '前端暴露了 API Key',
    cause: '静态网页代码会完整下载到访客浏览器，前端无法保存秘密。',
    action: '立即作废密钥，把敏感调用迁移到后端；不要继续发布泄露版本。',
    prompt:
      '当前静态网页可能暴露了 API Key。请先停止发布并定位泄露位置，告诉我需要立即作废哪些密钥，再把敏感调用迁移到后端。确认源码不含秘密后，才使用 ms-studio-deploy 重新发布。'
  },
  {
    id: 'sdk',
    badge: 'SDK',
    title: '创空间一直启动失败',
    cause: '空间可能误选为 Gradio、Streamlit 或 Docker，而不是 Static。',
    action: '检查 sdk_type，改为 static；必要时创建正确类型的新空间。',
    prompt:
      '请使用 ms-studio-deploy 检查当前创空间的 SDK 类型和运行状态。网页应使用 static；如果类型错误，请修正或创建正确的 Static 创空间，然后重新同步并部署。'
  }
]

const selectedId = ref(problems[0].id)
const copied = ref(false)
let copiedTimer

const current = computed(
  () => problems.find((problem) => problem.id === selectedId.value) || problems[0]
)

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(current.value.prompt)
    copied.value = true
    window.clearTimeout(copiedTimer)
    copiedTimer = window.setTimeout(() => {
      copied.value = false
    }, 1800)
  } catch {
    copied.value = false
  }
}

onBeforeUnmount(() => window.clearTimeout(copiedTimer))
</script>

<template>
  <section class="troubleshooter" aria-labelledby="ms-troubleshooter-title">
    <header class="hero">
      <span class="eyebrow">ms-studio-deploy · 排障助手</span>
      <h3 id="ms-troubleshooter-title">网页哪里不对？</h3>
      <p>选择最接近的现象，复制提示词交给 AI；Skill 会继续检查、修复和部署。</p>
    </header>

    <div class="workspace">
      <div class="symptom-list" aria-label="选择故障现象">
        <button
          v-for="problem in problems"
          :key="problem.id"
          type="button"
          class="symptom-button"
          :class="{ active: selectedId === problem.id }"
          :aria-pressed="selectedId === problem.id"
          @click="selectedId = problem.id"
        >
          <span class="badge">{{ problem.badge }}</span>
          <span>{{ problem.title }}</span>
        </button>
      </div>

      <div class="diagnosis" aria-live="polite">
        <div class="diagnosis-title">
          <span class="large-badge">{{ current.badge }}</span>
          <div>
            <span class="label">当前现象</span>
            <strong>{{ current.title }}</strong>
          </div>
        </div>

        <div class="fact-grid">
          <article>
            <span class="label">最可能的原因</span>
            <p>{{ current.cause }}</p>
          </article>
          <article>
            <span class="label">Skill 会怎么处理</span>
            <p>{{ current.action }}</p>
          </article>
        </div>

        <div class="prompt-card">
          <div class="prompt-heading">
            <span class="label">直接发给 AI</span>
            <button type="button" class="copy-button" @click="copyPrompt">
              {{ copied ? '已复制' : '复制提示词' }}
            </button>
          </div>
          <p>{{ current.prompt }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.troubleshooter {
  margin: 1rem 0 1.5rem;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg);
  box-shadow: 0 12px 32px rgb(15 23 42 / 7%);
}

.hero {
  padding: 1.35rem 1.5rem 1.2rem;
  color: #fff;
  background:
    radial-gradient(circle at 92% -30%, rgb(255 255 255 / 28%), transparent 45%),
    linear-gradient(120deg, #6246d9, #2563eb);
}

.eyebrow {
  display: inline-flex;
  padding: 0.2rem 0.55rem;
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 999px;
  background: rgb(255 255 255 / 12%);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.hero h3 {
  margin: 0.65rem 0 0.25rem;
  border: 0;
  color: #fff;
  font-size: 1.35rem;
  line-height: 1.35;
}

.hero p {
  margin: 0;
  color: rgb(255 255 255 / 82%);
  font-size: 0.9rem;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(180px, 0.82fr) minmax(0, 1.65fr);
  min-height: 430px;
}

.symptom-list {
  display: grid;
  align-content: start;
  gap: 0.45rem;
  padding: 1rem;
  border-right: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.symptom-button {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.62rem 0.7rem;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.82rem;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;
  transition: 160ms ease;
}

.symptom-button:hover {
  border-color: var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.symptom-button.active {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 38%, transparent);
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, var(--vp-c-bg));
  color: var(--vp-c-brand-1);
  font-weight: 650;
}

.symptom-button:focus-visible,
.copy-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.badge,
.large-badge {
  display: inline-grid;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 7px;
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-weight: 800;
}

.badge {
  width: 2.15rem;
  height: 1.7rem;
  border: 1px solid var(--vp-c-divider);
  font-size: 0.67rem;
}

.diagnosis {
  padding: 1.25rem;
}

.diagnosis-title {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.large-badge {
  width: 3.2rem;
  height: 3.2rem;
  background: color-mix(in srgb, var(--vp-c-brand-1) 11%, var(--vp-c-bg));
  font-size: 0.82rem;
}

.label {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--vp-c-text-3);
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.diagnosis-title strong {
  color: var(--vp-c-text-1);
  font-size: 1.05rem;
}

.fact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin: 1rem 0;
}

.fact-grid article {
  padding: 0.9rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.fact-grid p,
.prompt-card p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.84rem;
  line-height: 1.65;
}

.prompt-card {
  padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 32%, var(--vp-c-divider));
  border-radius: 11px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 6%, var(--vp-c-bg));
}

.prompt-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.65rem;
}

.prompt-heading .label {
  margin: 0;
  color: var(--vp-c-brand-1);
}

.copy-button {
  padding: 0.38rem 0.65rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 7px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 720px) {
  .hero {
    padding: 1.1rem;
  }

  .workspace {
    display: block;
  }

  .symptom-list {
    grid-template-columns: 1fr 1fr;
    border-right: 0;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .symptom-button {
    align-items: flex-start;
    padding: 0.55rem;
    font-size: 0.76rem;
  }

  .diagnosis {
    padding: 1rem;
  }

  .fact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 440px) {
  .symptom-list {
    grid-template-columns: 1fr;
  }
}
</style>
