<template>
  <section class="journey-demo" aria-labelledby="journey-title">
    <header class="demo-header">
      <div>
        <span class="demo-kicker">互动演示</span>
        <h2 id="journey-title">从黑屏到网页</h2>
        <p>每一步都接着上一步，只解决眼前的一个问题。</p>
      </div>
      <button v-if="step > 0" class="reset-link" @click="reset">↺ 重新开始</button>
    </header>

    <div class="phase-bar" aria-label="四个阶段">
      <div
        v-for="(phase, index) in phases"
        :key="phase.name"
        :class="['phase-item', { active: currentPhase === index, done: currentPhase > index }]"
      >
        <span class="phase-dot">{{ currentPhase > index ? '✓' : phase.icon }}</span>
        <span>{{ phase.name }}</span>
      </div>
    </div>

    <div class="computer">
      <div class="monitor">
        <div :class="['screen', `screen-${step}`]">
          <div v-if="step === 0" class="off-screen">
            <span class="off-icon">○</span>
            <strong>电脑还没有开机</strong>
          </div>

          <div v-else-if="step === 1" class="hardware-flow">
            <div class="hardware-node node-power">
              <span class="node-icon">⚡</span>
              <b>通电</b>
            </div>
            <span class="energy-link link-1"><i></i></span>
            <div class="hardware-node node-cpu">
              <span class="node-icon chip-icon" aria-hidden="true">
                <svg viewBox="0 0 64 64">
                  <g class="chip-pins">
                    <path d="M15 7v8M25 7v8M39 7v8M49 7v8M15 49v8M25 49v8M39 49v8M49 49v8" />
                    <path d="M7 15h8M7 25h8M7 39h8M7 49h8M49 15h8M49 25h8M49 39h8M49 49h8" />
                  </g>
                  <rect class="chip-body" x="14" y="14" width="36" height="36" rx="6" />
                  <rect class="chip-core" x="22" y="22" width="20" height="20" rx="3" />
                  <path class="chip-path" d="M18 32h7m14 0h7M32 18v7m0 14v7" />
                </svg>
              </span>
              <b>CPU 执行</b>
            </div>
            <span class="energy-link link-2"><i></i></span>
            <div class="hardware-node node-uefi">
              <span class="node-icon firmware-icon" aria-hidden="true">
                <svg viewBox="0 0 64 64">
                  <rect class="board" x="8" y="10" width="48" height="44" rx="6" />
                  <path class="board-path" d="M15 20h10l5 5m19-5h-8l-5 5M15 44h10l5-5m19 5h-8l-5-5" />
                  <circle cx="15" cy="20" r="2" /><circle cx="49" cy="20" r="2" />
                  <circle cx="15" cy="44" r="2" /><circle cx="49" cy="44" r="2" />
                  <rect class="firmware-chip" x="24" y="23" width="16" height="18" rx="3" />
                  <path class="firmware-mark" d="M32 27v6m-4-3 4 4 4-4" />
                </svg>
              </span>
              <b>UEFI 查找</b>
            </div>
            <span class="energy-link link-3"><i></i></span>
            <div class="hardware-node node-disk">
              <span class="node-icon">💾</span>
              <b>系统盘</b>
            </div>
          </div>

          <div v-else-if="step === 2" class="transfer-scene">
            <div class="storage-card"><span>💾</span><b>系统盘</b><small>kernel</small></div>
            <div class="loader-track"><span>引导程序</span><i>→</i></div>
            <div class="ram-card"><b>内存 RAM</b><span>内核</span></div>
          </div>

          <div v-else-if="step === 3" class="kernel-scene">
            <div class="kernel-core"><span>⚙</span><b>内核</b></div>
            <div class="kernel-service service-memory">内存管理</div>
            <div class="kernel-service service-driver">设备驱动</div>
            <div class="kernel-service service-file">文件系统</div>
            <div class="kernel-service service-process">进程调度</div>
          </div>

          <div v-else-if="step === 4" class="desktop-screen">
            <div class="desktop-title">系统服务就绪 · 桌面启动</div>
            <div class="desktop-icons">
              <div class="desktop-app browser-app"><span>🌐</span><b>浏览器</b></div>
              <div class="desktop-app muted-app"><span>📁</span><b>文件</b></div>
              <div class="desktop-app muted-app"><span>⚙️</span><b>设置</b></div>
            </div>
            <div class="taskbar"><span>⌘</span><span class="taskbar-hint">现在可以启动用户程序了</span></div>
          </div>

          <div v-else-if="step === 5" class="launch-scene">
            <div class="program-file"><span>🌐</span><b>浏览器程序</b><small>磁盘里的文件</small></div>
            <div class="launch-arrow"><span>打开</span><i>→</i></div>
            <div class="os-card"><span>⚙</span><b>操作系统</b><small>收到启动请求</small></div>
          </div>

          <div v-else-if="step === 6" class="process-scene">
            <div class="memory-map">
              <b>进程的内存空间</b>
              <span class="memory-code">程序代码</span>
              <span class="memory-lib">动态库</span>
              <span class="memory-heap">堆</span>
              <span class="memory-stack">栈</span>
            </div>
            <div class="process-side">
              <span class="pid-badge">PID 4321</span>
              <b>创建主线程</b>
              <small>调度器把它交给 CPU</small>
              <span class="cpu-mini">CPU ▶</span>
            </div>
          </div>

          <div v-else-if="step === 7" class="browser-parts">
            <div class="browser-shell"><span class="window-dots"><i></i><i></i><i></i></span><b>浏览器窗口</b></div>
            <div class="process-row">
              <span><b>主进程</b><small>窗口与标签页</small></span>
              <span><b>网络服务</b><small>收发数据</small></span>
              <span><b>渲染进程</b><small>生成页面</small></span>
            </div>
          </div>

          <div v-else-if="step === 8" class="url-scene">
            <div class="url-parts"><span>https</span><span>example.com</span><span>/page</span></div>
            <div class="dns-line"><b>DNS</b><span>example.com</span><i>→</i><span>93.184.216.34</span></div>
          </div>

          <div v-else-if="step === 9" class="connection-scene">
            <div class="endpoint"><span>🌐</span><b>浏览器</b></div>
            <div class="handshake"><span>TCP 建立连接</span><i>→</i><span class="lock">🔒 TLS 加密</span></div>
            <div class="endpoint"><span>🖥️</span><b>服务器</b></div>
          </div>

          <div v-else-if="step === 10" class="http-scene">
            <div class="http-side"><span>🌐</span><b>浏览器</b></div>
            <div class="http-lines">
              <span class="request-line"><code>GET /page</code><i>→</i></span>
              <span class="response-line"><i>←</i><code>200 OK · HTML</code></span>
            </div>
            <div class="http-side"><span>🖥️</span><b>服务器</b></div>
          </div>

          <div v-else-if="step === 11" class="resource-scene">
            <div class="html-card">HTML</div>
            <div class="resource-arrows">↗<br />→<br />↘</div>
            <div class="resource-list"><span>CSS</span><span>JavaScript</span><span>图片 / 字体</span></div>
          </div>

          <div v-else-if="step === 12" class="render-scene">
            <div class="render-input"><span>HTML<br /><b>DOM</b></span><span>CSS<br /><b>CSSOM</b></span></div>
            <i>→</i>
            <div class="render-stage"><span>布局</span><span>绘制</span><span>合成</span></div>
            <i>→</i>
            <div class="pixels">像素</div>
          </div>

          <div v-else class="website-screen">
            <div class="browser-topbar">
              <span class="window-dots"><i></i><i></i><i></i></span>
              <div class="address-bar loaded"><span>https://example.com/page</span><span class="secure-mark">✓</span></div>
            </div>
            <div class="mini-site">
              <div class="site-confetti"><i></i><i></i><i></i><i></i></div>
              <span class="site-badge">完成</span>
              <strong>网页出现了！</strong>
              <div class="site-cards"><span>HTML</span><span>CSS</span><span>JS</span></div>
            </div>
          </div>
        </div>
        <div class="monitor-chin"><span></span></div>
      </div>
      <div class="monitor-stand"></div>
    </div>

    <div class="step-caption" aria-live="polite">
      <span v-if="step > 0" class="step-number">{{ String(step).padStart(2, '0') }} / 13</span>
      <strong>{{ currentLesson.title }}</strong>
      <small>{{ currentLesson.note }}</small>
    </div>

    <div class="demo-action">
      <button v-if="step < lessons.length - 1" :class="['main-action', { 'power-action': step === 0 }]" @click="next">
        <span v-if="step === 0">⏻</span>{{ currentLesson.action }}
      </button>
      <button v-else class="main-action" @click="reset">↺ 再看一次</button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const step = ref(0)

const phases = [
  { name: '硬件', icon: '⚡' },
  { name: '系统', icon: '▦' },
  { name: '浏览器', icon: '◎' },
  { name: '网页', icon: '🌐' }
]

const lessons = [
  { phase: -1, title: '电脑还没有开机', note: 'CPU 没有开始取指，内存里也没有操作系统。', action: '按下电源' },
  { phase: 0, title: 'UEFI 找到了系统盘', note: 'CPU 正在执行固件代码，但内核仍然只是磁盘里的文件。', action: '把内核装入内存 →' },
  { phase: 1, title: '内核进入内存', note: '代码已经就位，但 CPU 还在执行引导程序。下一步要交出控制权。', action: '跳到内核入口 →' },
  { phase: 1, title: '内核接管计算机', note: '内核先准备内存、调度、驱动和文件系统，桌面才能启动。', action: '启动系统服务与桌面 →' },
  { phase: 1, title: '桌面准备完成', note: '系统已经能启动应用，但浏览器仍然只是磁盘里的程序文件。', action: '请求打开浏览器 →' },
  { phase: 2, title: '找到了浏览器程序', note: '操作系统读懂了这个文件的结构，但它还没有成为运行中的程序。', action: '创建进程并映射内存 →' },
  { phase: 2, title: '浏览器进程已经创建', note: '代码、动态库、堆和栈有了位置；主线程还在等待 CPU。', action: '让 CPU 执行浏览器 →' },
  { phase: 2, title: '浏览器窗口出现', note: '浏览器已经运行。输入网址后，主进程先要弄清楚你想访问哪里。', action: '拆解网址并查询地址 →' },
  { phase: 3, title: '找到了服务器地址', note: 'DNS 把域名变成了 IP，但浏览器还没有和服务器说上话。', action: '建立连接 →' },
  { phase: 3, title: '通信通道已经建立', note: '现在数据可以可靠、安全地传送，浏览器才能说明自己想要什么。', action: '发送 HTTP 请求 →' },
  { phase: 3, title: '服务器返回 HTML', note: '页面的入口文档到了，但它引用的 CSS、JavaScript 和图片还没有到齐。', action: '继续加载页面资源 →' },
  { phase: 3, title: '页面资源已经到齐', note: '这些内容仍然是代码和数据，屏幕还不知道该画什么。', action: '交给渲染进程 →' },
  { phase: 3, title: '渲染进程生成画面', note: 'DOM、样式、布局和绘制已经完成，最后把合成结果送到屏幕。', action: '显示网页 →' },
  { phase: 3, title: '网页出现', note: '这不是一次跳跃，而是前面十二步依次接力的结果。', action: '' }
]

const currentLesson = computed(() => lessons[step.value])
const currentPhase = computed(() => currentLesson.value.phase)

function next() {
  if (step.value < lessons.length - 1) step.value += 1
}

function reset() {
  step.value = 0
}
</script>

<style scoped>
.journey-demo {
  margin: 24px 0 36px;
  padding: 24px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  container-type: inline-size;
}

.demo-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.demo-kicker {
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
}

.demo-header h2 {
  margin: 5px 0 0;
  border: 0;
  font-size: 24px;
}

.demo-header p {
  margin: 5px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.reset-link {
  padding: 4px;
  border: 0;
  color: var(--vp-c-text-3);
  background: none;
  font-size: 12px;
  cursor: pointer;
}

.reset-link:hover { color: var(--vp-c-brand-1); }

.phase-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.phase-item {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--vp-c-text-3);
  font-size: 11px;
  font-weight: 650;
}

.phase-dot {
  display: grid;
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  place-items: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  background: var(--vp-c-bg);
  font-size: 10px;
}

.phase-item.active { color: var(--vp-c-text-1); }
.phase-item.active .phase-dot {
  border-color: var(--vp-c-brand-1);
  color: white;
  background: var(--vp-c-brand-1);
}
.phase-item.done .phase-dot { border-color: #10b981; color: #047857; background: #d1fae5; }

.computer { max-width: 520px; margin: 0 auto; }
.monitor {
  overflow: hidden;
  border: 7px solid #252b36;
  border-bottom-width: 0;
  border-radius: 16px 16px 0 0;
  background: #252b36;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
}

.screen {
  position: relative;
  min-height: 290px;
  overflow: hidden;
  border-radius: 9px 9px 0 0;
}

.screen-0 { display: grid; place-items: center; background: #090d14; }
.off-screen { display: flex; align-items: center; flex-direction: column; gap: 12px; color: #64748b; }
.off-icon { font-size: 34px; font-weight: 200; }
.off-screen strong { font-size: 14px; }

.screen-1 {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e2e8f0;
  background: radial-gradient(circle at 50% 45%, #1e293b, #080c13 70%);
}

.hardware-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92%;
}

.hardware-node {
  display: flex;
  align-items: center;
  flex: 0 0 68px;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  animation: node-on 0.35s ease forwards;
}
.hardware-node b { color: #cbd5e1; font-size: 11px; font-weight: 650; }
.node-icon {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border: 1px solid #475569;
  border-radius: 13px;
  background: #111827;
  font-size: 24px;
}
.node-icon svg { width: 44px; height: 44px; }
.chip-icon svg { overflow: visible; }
.chip-pins,
.chip-path { fill: none; stroke: #fdba74; stroke-linecap: round; stroke-width: 2; }
.chip-body { fill: #431407; stroke: #fb923c; stroke-width: 2; }
.chip-core { fill: #fb923c; }
.chip-path { stroke: #fed7aa; stroke-width: 1.5; }
.firmware-icon svg { overflow: visible; }
.board { fill: #2e1065; stroke: #a78bfa; stroke-width: 2; }
.board-path { fill: none; stroke: #8b5cf6; stroke-linecap: round; stroke-width: 2; }
.firmware-icon circle { fill: #ddd6fe; }
.firmware-chip { fill: #7c3aed; stroke: #ddd6fe; stroke-width: 1.5; }
.firmware-mark { fill: none; stroke: white; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2; }
.node-power .node-icon {
  border-color: #fbbf24;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.25);
}
.node-cpu { animation-delay: 0.35s; }
.node-cpu .node-icon {
  border-color: #fb923c;
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.24);
}
.node-uefi { animation-delay: 0.75s; }
.node-uefi .node-icon {
  border-color: #a78bfa;
  color: #c4b5fd;
  box-shadow: 0 0 20px rgba(167, 139, 250, 0.22);
}
.node-disk { animation-delay: 1.15s; }
.node-disk .node-icon {
  border-color: #34d399;
  box-shadow: 0 0 20px rgba(52, 211, 153, 0.2);
}
.energy-link {
  position: relative;
  width: 38px;
  height: 2px;
  overflow: hidden;
  background: #334155;
}
.energy-link i {
  position: absolute;
  top: -2px;
  left: -8px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 8px #fbbf24;
  animation: energy-move 0.7s linear forwards;
}
.link-2 i {
  background: #fb923c;
  box-shadow: 0 0 8px #fb923c;
  animation-delay: 0.4s;
}
.link-3 i {
  background: #a78bfa;
  box-shadow: 0 0 8px #a78bfa;
  animation-delay: 0.8s;
}

.screen-2,
.screen-3 {
  display: grid;
  place-items: center;
  color: #e2e8f0;
  background: radial-gradient(circle at 50% 45%, #1e293b, #080c13 72%);
}

.transfer-scene,
.launch-scene,
.connection-scene,
.http-scene,
.resource-scene,
.render-scene {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88%;
}

.storage-card,
.ram-card,
.program-file,
.os-card {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 118px;
  height: 112px;
  flex-direction: column;
  border: 1px solid #475569;
  border-radius: 14px;
  background: #111827;
}
.storage-card > span,
.program-file > span,
.os-card > span { font-size: 28px; }
.storage-card b,
.ram-card b,
.program-file b,
.os-card b { margin-top: 6px; font-size: 12px; }
.storage-card small,
.program-file small,
.os-card small { margin-top: 3px; color: #94a3b8; font-size: 9px; }
.storage-card small { padding: 3px 8px; border-radius: 4px; color: #86efac; background: #052e16; font-family: var(--vp-font-family-mono); }
.ram-card { gap: 8px; border-color: #60a5fa; }
.ram-card span { width: 72px; padding: 12px 0; border-radius: 7px; color: #dbeafe; background: #1d4ed8; text-align: center; font-size: 11px; font-weight: 800; }
.loader-track,
.launch-arrow { display: flex; align-items: center; flex: 1; flex-direction: column; color: #fbbf24; }
.loader-track span,
.launch-arrow span { font-size: 9px; font-weight: 700; }
.loader-track i,
.launch-arrow i { margin-top: 4px; font-size: 30px; font-style: normal; }

.kernel-scene { position: relative; width: 330px; height: 220px; }
.kernel-core {
  position: absolute;
  top: 72px;
  left: 120px;
  display: grid;
  width: 90px;
  height: 78px;
  place-items: center;
  border: 1px solid #60a5fa;
  border-radius: 18px;
  color: #dbeafe;
  background: #1e3a8a;
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.3);
}
.kernel-core span { font-size: 25px; line-height: 1; }
.kernel-core b { font-size: 12px; }
.kernel-service { position: absolute; padding: 7px 10px; border: 1px solid #334155; border-radius: 8px; color: #cbd5e1; background: #111827; font-size: 10px; }
.kernel-service::after { position: absolute; width: 36px; height: 1px; background: #475569; content: ''; }
.service-memory { top: 15px; left: 17px; }
.service-memory::after { top: 38px; left: 73px; transform: rotate(28deg); }
.service-driver { top: 15px; right: 17px; }
.service-driver::after { top: 38px; right: 73px; transform: rotate(-28deg); }
.service-file { bottom: 13px; left: 17px; }
.service-file::after { bottom: 38px; left: 73px; transform: rotate(-28deg); }
.service-process { right: 17px; bottom: 13px; }
.service-process::after { right: 73px; bottom: 38px; transform: rotate(28deg); }

.screen-4 {
  color: white;
  background: linear-gradient(145deg, #2563eb, #7c3aed 62%, #db2777);
}
.desktop-title { padding: 16px 18px; font-size: 12px; font-weight: 700; opacity: 0.8; }
.desktop-icons { display: flex; gap: 18px; padding: 25px; }
.desktop-app {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 6px;
  width: 72px;
  padding: 10px 6px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: white;
  background: transparent;
}
.desktop-app span { font-size: 34px; }
.desktop-app b { font-size: 11px; font-weight: 600; }
.browser-app { border-color: rgba(255, 255, 255, 0.4); background: rgba(255, 255, 255, 0.1); }
.muted-app { opacity: 0.65; }
.taskbar {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 38px;
  padding: 0 14px;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(10px);
}
.taskbar-hint { font-size: 10px; opacity: 0.75; }

.screen-5,
.screen-6,
.screen-7 {
  display: grid;
  place-items: center;
  color: #e2e8f0;
  background: linear-gradient(145deg, #172554, #312e81 58%, #4c1d95);
}
.program-file { border-color: #60a5fa; }
.os-card { border-color: #a78bfa; }
.process-scene { display: flex; align-items: center; justify-content: center; gap: 36px; width: 88%; }
.memory-map { display: flex; width: 150px; overflow: hidden; flex-direction: column; border: 1px solid #64748b; border-radius: 10px; background: #0f172a; }
.memory-map b { padding: 8px; color: #cbd5e1; font-size: 10px; text-align: center; }
.memory-map span { padding: 6px 10px; border-top: 1px solid rgba(255, 255, 255, 0.09); font-size: 9px; }
.memory-code { color: #fed7aa; background: rgba(249, 115, 22, 0.16); }
.memory-lib { color: #ddd6fe; background: rgba(139, 92, 246, 0.16); }
.memory-heap { color: #bfdbfe; background: rgba(59, 130, 246, 0.15); }
.memory-stack { color: #bbf7d0; background: rgba(34, 197, 94, 0.15); }
.process-side { display: flex; align-items: center; flex-direction: column; color: #e2e8f0; text-align: center; }
.pid-badge { padding: 4px 8px; border-radius: 999px; color: #c4b5fd; background: #4c1d95; font-family: var(--vp-font-family-mono); font-size: 9px; }
.process-side b { margin-top: 14px; font-size: 13px; }
.process-side small { max-width: 130px; margin-top: 5px; color: #a5b4fc; font-size: 9px; }
.cpu-mini { margin-top: 18px; padding: 8px 12px; border: 1px solid #fb923c; border-radius: 8px; color: #fed7aa; background: #431407; font-size: 11px; font-weight: 800; }
.browser-parts { width: 88%; }
.browser-shell { display: flex; align-items: center; gap: 12px; height: 44px; padding: 0 14px; border-radius: 10px 10px 4px 4px; color: #334155; background: #f8fafc; }
.browser-shell b { margin-left: auto; font-size: 11px; }
.process-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 18px; }
.process-row > span { display: flex; min-height: 82px; align-items: center; justify-content: center; flex-direction: column; border: 1px solid rgba(196, 181, 253, 0.35); border-radius: 10px; background: rgba(15, 23, 42, 0.55); text-align: center; }
.process-row b { color: #ddd6fe; font-size: 10px; }
.process-row small { margin-top: 5px; color: #a5b4fc; font-size: 8px; }

.screen-8,
.screen-9,
.screen-10,
.screen-11,
.screen-12,
.screen-13 {
  display: grid;
  place-items: center;
  color: #0f172a;
  background: linear-gradient(180deg, #eff6ff, #fff);
}
.url-scene { width: 88%; }
.url-parts { display: grid; grid-template-columns: 72px 1.4fr 1fr; overflow: hidden; border: 1px solid #bfdbfe; border-radius: 10px; font-family: var(--vp-font-family-mono); font-size: 11px; }
.url-parts span { padding: 12px 9px; border-right: 1px solid #bfdbfe; background: white; text-align: center; }
.url-parts span:first-child { color: #047857; background: #ecfdf5; }
.url-parts span:nth-child(2) { color: #1d4ed8; background: #eff6ff; }
.url-parts span:last-child { border: 0; color: #7c3aed; background: #f5f3ff; }
.dns-line { display: flex; align-items: center; justify-content: center; gap: 9px; margin-top: 28px; color: #475569; font-family: var(--vp-font-family-mono); font-size: 9px; }
.dns-line b { padding: 6px 9px; border-radius: 6px; color: white; background: #2563eb; }
.dns-line i { color: #2563eb; font-size: 20px; font-style: normal; }
.connection-scene { gap: 18px; }
.endpoint { display: flex; align-items: center; flex-direction: column; gap: 8px; }
.endpoint span { display: grid; width: 62px; height: 62px; place-items: center; border: 1px solid #bfdbfe; border-radius: 16px; background: white; font-size: 27px; }
.endpoint b { font-size: 10px; }
.handshake { display: flex; align-items: center; width: 180px; flex-direction: column; color: #2563eb; }
.handshake > span { padding: 5px 9px; border-radius: 999px; background: #dbeafe; font-size: 9px; font-weight: 700; }
.handshake i { margin: 5px 0; font-size: 26px; font-style: normal; }
.handshake .lock { color: #047857; background: #d1fae5; }
.http-scene { gap: 15px; }
.http-side { display: flex; align-items: center; flex-direction: column; gap: 5px; }
.http-side span { font-size: 30px; }
.http-side b { font-size: 9px; }
.http-lines { display: flex; width: 240px; flex-direction: column; gap: 17px; }
.http-lines span { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.http-lines code { padding: 7px 9px; border-radius: 6px; font-size: 9px; }
.http-lines i { color: #2563eb; font-size: 21px; font-style: normal; }
.request-line code { color: #1d4ed8; background: #dbeafe; }
.response-line code { color: #047857; background: #d1fae5; }
.html-card { display: grid; width: 105px; height: 120px; place-items: center; border: 1px solid #fb923c; border-radius: 12px; color: #c2410c; background: #fff7ed; font-family: var(--vp-font-family-mono); font-size: 15px; font-weight: 800; }
.resource-arrows { margin: 0 25px; color: #60a5fa; font-size: 21px; line-height: 1.8; }
.resource-list { display: flex; flex-direction: column; gap: 10px; }
.resource-list span { min-width: 105px; padding: 8px 12px; border: 1px solid #bfdbfe; border-radius: 8px; color: #1d4ed8; background: white; font-family: var(--vp-font-family-mono); font-size: 9px; text-align: center; }
.render-scene { gap: 15px; }
.render-scene > i { color: #60a5fa; font-size: 24px; font-style: normal; }
.render-input { display: flex; flex-direction: column; gap: 8px; }
.render-input span { min-width: 75px; padding: 7px; border: 1px solid #bfdbfe; border-radius: 7px; background: white; font-size: 8px; text-align: center; }
.render-input b { color: #1d4ed8; font-size: 10px; }
.render-stage { display: flex; overflow: hidden; flex-direction: column; border: 1px solid #c4b5fd; border-radius: 8px; }
.render-stage span { padding: 7px 14px; border-bottom: 1px solid #ddd6fe; color: #6d28d9; background: #f5f3ff; font-size: 9px; }
.render-stage span:last-child { border: 0; }
.pixels { display: grid; width: 70px; height: 70px; place-items: center; border-radius: 10px; color: white; background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); font-size: 10px; font-weight: 800; box-shadow: 0 8px 20px rgba(124, 58, 237, 0.22); }

.browser-topbar {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 12px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}
.window-dots { display: flex; gap: 4px; }
.window-dots i { width: 7px; height: 7px; border-radius: 50%; background: #cbd5e1; }
.window-dots i:first-child { background: #fb7185; }
.window-dots i:nth-child(2) { background: #fbbf24; }
.window-dots i:nth-child(3) { background: #4ade80; }
.address-bar {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
  height: 30px;
  padding-left: 12px;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #475569;
  background: white;
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
}
.address-bar span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.address-bar.loaded { border-color: #86efac; }
.secure-mark { margin-right: 10px; margin-left: auto; color: #16a34a; font-weight: 800; }

.mini-site {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 242px;
  flex-direction: column;
  color: #0f172a;
  background: linear-gradient(180deg, #eff6ff, white);
}
.site-badge { padding: 4px 9px; border-radius: 999px; color: #047857; background: #d1fae5; font-size: 10px; font-weight: 800; }
.mini-site strong { margin-top: 9px; font-size: 25px; }
.site-cards { display: flex; gap: 8px; margin-top: 14px; }
.site-cards span {
  display: grid;
  width: 70px;
  height: 34px;
  place-items: center;
  border: 1px solid #bfdbfe;
  border-radius: 7px;
  color: #3b82f6;
  background: white;
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 800;
}
.site-confetti i { position: absolute; width: 7px; height: 7px; border-radius: 2px; background: #f59e0b; }
.site-confetti i:nth-child(1) { top: 35px; left: 20%; transform: rotate(20deg); }
.site-confetti i:nth-child(2) { top: 58px; right: 18%; background: #3b82f6; transform: rotate(50deg); }
.site-confetti i:nth-child(3) { bottom: 48px; left: 14%; background: #ec4899; transform: rotate(70deg); }
.site-confetti i:nth-child(4) { right: 25%; bottom: 30px; background: #10b981; }

.monitor-chin { display: grid; height: 26px; place-items: center; background: #252b36; }
.monitor-chin span { width: 5px; height: 5px; border-radius: 50%; background: #475569; }
.monitor-stand { width: 110px; height: 16px; margin: 0 auto; border-radius: 0 0 45px 45px; background: #343b48; }

.step-caption { display: grid; max-width: 520px; min-height: 60px; margin: 14px auto 0; grid-template-columns: auto 1fr; column-gap: 10px; }
.step-caption strong { align-self: end; color: var(--vp-c-text-1); font-size: 14px; }
.step-caption small { grid-column: 2; margin-top: 2px; color: var(--vp-c-text-3); font-size: 11px; line-height: 1.45; }
.step-number { align-self: end; color: var(--vp-c-brand-1); font-family: var(--vp-font-family-mono); font-size: 10px; font-weight: 800; }
.demo-action { display: flex; min-height: 42px; align-items: center; justify-content: center; margin-top: 8px; }
.main-action {
  min-width: 170px;
  padding: 10px 16px;
  border: 0;
  border-radius: 999px;
  color: white;
  background: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 7px 18px color-mix(in srgb, var(--vp-c-brand-1) 28%, transparent);
}
.main-action:hover { transform: translateY(-1px); }
.power-action { background: #f97316; box-shadow: 0 7px 18px rgba(249, 115, 22, 0.28); }
.power-action span { margin-right: 5px; font-size: 17px; }

@keyframes node-on {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes energy-move {
  from { left: -8px; opacity: 0; }
  25% { opacity: 1; }
  to { left: calc(100% + 2px); opacity: 1; }
}
@container (max-width: 520px) {
  .journey-demo { padding: 18px 14px; }
  .phase-bar { grid-template-columns: repeat(2, 1fr); row-gap: 10px; }
  .screen { min-height: 250px; }
  .hardware-flow { width: 98%; }
  .hardware-node { flex-basis: 54px; }
  .node-icon { width: 44px; height: 44px; font-size: 19px; }
  .node-icon svg { width: 36px; height: 36px; }
  .energy-link { width: 18px; }
  .desktop-icons { gap: 8px; padding: 20px 10px; }
  .storage-card,
  .ram-card,
  .program-file,
  .os-card { width: 94px; height: 105px; }
  .loader-track i,
  .launch-arrow i { font-size: 22px; }
  .process-scene { gap: 16px; }
  .memory-map { width: 125px; }
  .process-row { gap: 5px; }
  .process-row > span { min-height: 75px; padding: 0 3px; }
  .url-parts { grid-template-columns: 62px 1.4fr 0.9fr; }
  .connection-scene { gap: 10px; }
  .handshake { width: 130px; }
  .http-lines { width: 170px; }
  .resource-arrows { margin: 0 12px; }
  .render-scene { gap: 8px; }
  .render-scene > i { font-size: 18px; }
  .demo-header h2 { font-size: 22px; }
  .reset-link { display: none; }
  .site-cards span { width: 55px; }
}

@media (prefers-reduced-motion: reduce) {
  .hardware-node,
  .energy-link i,
  .browser-app { animation: none; opacity: 1; }
}
</style>
