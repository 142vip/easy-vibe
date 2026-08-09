<template>
  <section class="fault-finder" aria-labelledby="fault-finder-title">
    <header class="finder-header">
      <span class="finder-kicker">故障定位器</span>
      <h3 id="fault-finder-title">网页没出来，先看它停在哪一棒</h3>
      <p>点一下你看到的现象。绿色是已经走通的路，橙色是应该先检查的地方。</p>
    </header>

    <div class="scene-picker">
      <strong>事情发生在什么时候？</strong>
      <div class="scene-tabs" role="group" aria-label="选择故障发生阶段">
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          :class="['scene-tab', { active: selectedCategory === category.id }]"
          :aria-pressed="selectedCategory === category.id"
          @click="selectCategory(category.id)"
        >
          <span aria-hidden="true">{{ category.icon }}</span>
          {{ category.label }}
        </button>
      </div>

      <div class="symptom-list" role="group" aria-label="选择看到的现象">
        <button
          v-for="symptom in visibleSymptoms"
          :key="symptom.id"
          type="button"
          :class="['symptom-button', { active: selectedId === symptom.id }]"
          :aria-pressed="selectedId === symptom.id"
          @click="selectedId = symptom.id"
        >
          {{ symptom.label }}
        </button>
      </div>
    </div>

    <div class="finder-legend" aria-hidden="true">
      <span><i class="legend-dot done">✓</i> 已经走通</span>
      <span><i class="legend-dot suspect">!</i> 先查这里</span>
    </div>

    <div class="diagnosis" aria-live="polite">
      <ol class="route" aria-label="从开机到网页的检查路径">
        <li v-for="(checkpoint, index) in checkpoints" :key="checkpoint.label" :class="['milestone', statusFor(index)]">
          <span class="milestone-rail" aria-hidden="true">
            <i class="milestone-dot">{{ statusFor(index) === 'done' ? '✓' : statusFor(index) === 'suspect' ? '!' : checkpoint.icon }}</i>
            <i v-if="index < checkpoints.length - 1" class="milestone-line"></i>
          </span>
          <span class="milestone-label">{{ checkpoint.label }}</span>
        </li>
      </ol>

      <div class="diagnosis-copy">
        <span class="result-kicker">接力棒停在</span>
        <h4>{{ current.stopTitle }}</h4>
        <p class="result-explain">{{ current.explain }}</p>

        <div class="evidence-block">
          <span class="block-icon" aria-hidden="true">✓</span>
          <div>
            <strong>已经可以确定</strong>
            <ul>
              <li v-for="item in current.proof" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>

        <div class="check-block">
          <span class="block-icon" aria-hidden="true">⌕</span>
          <div>
            <strong>先检查</strong>
            <ul>
              <li v-for="item in current.check" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const categories = [
  { id: 'power', label: '按下电源后', icon: '⏻' },
  { id: 'system', label: '进入系统时', icon: '▣' },
  { id: 'browser', label: '打开浏览器时', icon: '◎' },
  { id: 'network', label: '访问网站时', icon: '↗' },
  { id: 'page', label: '打开页面时', icon: '✦' }
]

const checkpoints = [
  { label: '供电', icon: '⚡' },
  { label: 'UEFI', icon: '▦' },
  { label: '引导程序', icon: '↧' },
  { label: '内核', icon: '⚙' },
  { label: '桌面', icon: '▣' },
  { label: '浏览器', icon: '◎' },
  { label: '找到地址', icon: '⌖' },
  { label: '建立连接', icon: '↔' },
  { label: 'HTTP 回应', icon: '⇄' },
  { label: '页面资源', icon: '◆' },
  { label: '画面', icon: '✦' }
]

const symptoms = [
  {
    id: 'no-power',
    category: 'power',
    label: '完全没有灯和风扇',
    doneThrough: -1,
    suspects: [0],
    stopTitle: '第一棒还没开始：供电',
    explain: '灯和风扇都没动，CPU 多半还没有开始执行。现在查系统文件或网络没有意义。',
    proof: ['还不能确认主板已经得到稳定供电'],
    check: ['插座与电源线', '主机电源开关', '主板供电接口']
  },
  {
    id: 'self-test',
    category: 'power',
    label: '停在开机自检画面',
    doneThrough: 0,
    suspects: [1],
    stopTitle: '硬件已经通电，卡在固件检查',
    explain: '能出现自检画面，说明电源和 CPU 已经开始工作；问题发生在 UEFI 检查硬件时。',
    proof: ['主板已经通电', 'CPU 已经开始执行固件代码'],
    check: ['内存是否插牢', '硬盘是否被识别', '屏幕上的自检报码']
  },
  {
    id: 'no-boot-device',
    category: 'power',
    label: 'No bootable device',
    doneThrough: 1,
    suspects: [2],
    stopTitle: 'UEFI 没找到能继续启动的程序',
    explain: '这句话是 UEFI 显示的，所以 CPU 和 UEFI 都已经运行。它只是没有找到下一棒。',
    proof: ['CPU 已经执行', 'UEFI 已经完成了大部分硬件初始化'],
    check: ['启动顺序', 'EFI 系统分区', '系统盘是否存在']
  },
  {
    id: 'bootloader-stuck',
    category: 'system',
    label: '看到引导画面，系统进不去',
    doneThrough: 2,
    suspects: [3],
    stopTitle: '引导程序已运行，内核没有正常接棒',
    explain: 'UEFI 已经找到了启动项，引导程序也出现了。现在应该把注意力放到内核文件和启动参数。',
    proof: ['UEFI 找到了启动项', '引导程序已经获得 CPU'],
    check: ['内核文件', '启动参数', '系统分区']
  },
  {
    id: 'kernel-error',
    category: 'system',
    label: '内核报错或蓝屏',
    doneThrough: 2,
    suspects: [3],
    stopTitle: '内核拿到了 CPU，但启动过程中出错',
    explain: '能看到内核错误，说明前面的供电、UEFI 和引导程序都已经完成了交接。',
    proof: ['内核代码已经开始执行', '启动盘和引导链路已经走通'],
    check: ['错误码或内核日志', '设备驱动', '内存与硬盘状态']
  },
  {
    id: 'no-desktop',
    category: 'system',
    label: '系统启动，但桌面不出现',
    doneThrough: 3,
    suspects: [4],
    stopTitle: '内核已经工作，桌面这一棒没完成',
    explain: '系统能启动，说明内核和一部分系统服务已经运行；无需回头检查 UEFI。',
    proof: ['内核已经接管硬件', '文件系统和部分服务已经启动'],
    check: ['登录服务', '图形服务', '显卡驱动']
  },
  {
    id: 'browser-no-response',
    category: 'browser',
    label: '点击浏览器毫无反应',
    doneThrough: 4,
    suspects: [5],
    stopTitle: '桌面正常，浏览器没有成功启动',
    explain: '你已经能点击图标，说明操作系统和桌面都在工作。故障范围从“整台电脑”缩小到了“这个程序”。',
    proof: ['桌面与文件系统正常', '点击事件已经交给操作系统'],
    check: ['浏览器程序文件', '执行权限', '程序是否适合当前系统']
  },
  {
    id: 'browser-crash',
    category: 'browser',
    label: '浏览器打开后立刻闪退',
    doneThrough: 4,
    suspects: [5],
    stopTitle: '浏览器进程开始了，但没能继续运行',
    explain: '窗口闪现过，说明操作系统至少创建了进程。接下来要查程序运行时需要的东西。',
    proof: ['浏览器进程至少已经开始创建', '桌面和程序启动链路可用'],
    check: ['动态库', '浏览器配置', '崩溃日志']
  },
  {
    id: 'dns-failure',
    category: 'network',
    label: 'IP 能访问，域名不能访问',
    doneThrough: 5,
    suspects: [6],
    stopTitle: '浏览器能联网，但名字没有变成地址',
    explain: '用 IP 能打开，说明浏览器和基本网络不一定有问题；差别只剩下 DNS 查询。',
    proof: ['浏览器可以发送网络请求', '到目标网络的基本路径可用'],
    check: ['DNS 缓存', 'DNS 服务器', '域名记录']
  },
  {
    id: 'connection-refused',
    category: 'network',
    label: 'Connection refused',
    doneThrough: 6,
    suspects: [7],
    stopTitle: '已经找到目标，但端口没人接',
    explain: '对方电脑明确拒绝连接，通常说明地址已经找到，只是这个端口没有程序监听。',
    proof: ['目标地址已经确定', '请求已经到达能作出拒绝的一端'],
    check: ['服务器程序是否启动', '端口号是否正确', '服务监听地址']
  },
  {
    id: 'connection-timeout',
    category: 'network',
    label: 'Connection timed out',
    doneThrough: 6,
    suspects: [7],
    stopTitle: '请求发出去了，但迟迟没有回应',
    explain: '浏览器知道要去哪里，却没有等到连接结果。问题多半在去服务器的路上或服务器本身。',
    proof: ['浏览器已经得到目标地址', '操作系统已经尝试建立连接'],
    check: ['路由是否可达', '防火墙是否丢弃请求', '服务器是否在线']
  },
  {
    id: 'certificate-warning',
    category: 'network',
    label: '出现证书警告',
    doneThrough: 6,
    suspects: [7],
    stopTitle: 'TCP 通常已连接，安全身份检查没通过',
    explain: '浏览器已经联系到服务器，才有机会看到它的证书。现在不用先查 DNS。',
    proof: ['服务器地址已经找到', 'TCP 通常已经建立连接'],
    check: ['证书中的域名', '证书有效期', '证书签发链']
  },
  {
    id: 'not-found',
    category: 'page',
    label: '页面显示 404',
    doneThrough: 7,
    suspects: [8],
    stopTitle: '已经走到服务器，只是路径不存在',
    explain: '404 不是“网络没通”。浏览器已经联系到服务器，服务器也成功回了一句话：这里没有这个页面。',
    proof: ['DNS 大概率已经完成', '连接已经建立', 'HTTP 请求和回应都已经到达'],
    check: ['网址路径是否写对', '服务器路由', '页面文件是否存在']
  },
  {
    id: 'asset-not-found',
    category: 'page',
    label: 'CSS、JS 或图片 404',
    doneThrough: 8,
    suspects: [9],
    stopTitle: '主页面到了，某个配套资源没找到',
    explain: '浏览器只有读到 HTML，才知道还要请求哪些 CSS、JavaScript 和图片。主入口不用从头重查。',
    proof: ['主 HTML 已经到达浏览器', '浏览器已经开始解析资源地址'],
    check: ['资源路径', '构建产物中是否有该文件', '部署后的基础路径']
  },
  {
    id: 'white-screen',
    category: 'page',
    label: '主 HTML 是 200，但页面白屏',
    doneThrough: 8,
    suspects: [9, 10],
    stopTitle: '入口 HTML 已到，后半段还没完成',
    explain: '200 只证明入口文档成功返回。脚本、接口、样式或渲染仍然可能在后面出错。',
    proof: ['HTTP 入口请求已经成功', '服务器返回了浏览器能读取的内容'],
    check: ['开发者工具 Console 的报错', 'CSS、JS 和接口请求', '内容是否被样式隐藏']
  }
]

const selectedCategory = ref('page')
const selectedId = ref('not-found')

const visibleSymptoms = computed(() => symptoms.filter((symptom) => symptom.category === selectedCategory.value))
const current = computed(() => symptoms.find((symptom) => symptom.id === selectedId.value) || symptoms[0])

function selectCategory(categoryId) {
  selectedCategory.value = categoryId
  selectedId.value = symptoms.find((symptom) => symptom.category === categoryId).id
}

function statusFor(index) {
  if (current.value.suspects.includes(index)) return 'suspect'
  if (index <= current.value.doneThrough) return 'done'
  return 'waiting'
}
</script>

<style scoped>
.fault-finder {
  margin: 24px 0 32px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
}

.finder-header {
  padding: 24px 26px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.finder-kicker,
.result-kicker {
  display: block;
  margin-bottom: 5px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.finder-header h3,
.diagnosis-copy h4 {
  margin: 0;
  border: 0;
  line-height: 1.35;
}

.finder-header h3 {
  font-size: 22px;
}

.finder-header p {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.scene-picker {
  padding: 20px 26px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.scene-picker > strong {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
}

.scene-tabs,
.symptom-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.scene-tab,
.symptom-button {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    color 0.18s ease,
    background 0.18s ease;
}

.scene-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 6px 11px;
  border-radius: 9px;
  font-size: 13px;
}

.scene-tab:hover,
.symptom-button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.scene-tab.active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-weight: 700;
}

.symptom-list {
  margin-top: 12px;
}

.symptom-button {
  flex: 1 1 160px;
  min-height: 42px;
  padding: 8px 12px;
  border-radius: 10px;
  text-align: left;
  line-height: 1.45;
}

.symptom-button.active {
  border-color: var(--vp-c-warning-1);
  color: var(--vp-c-text-1);
  background: var(--vp-c-warning-soft);
  box-shadow: inset 3px 0 0 var(--vp-c-warning-1);
  font-weight: 700;
}

.finder-legend {
  display: flex;
  gap: 18px;
  padding: 14px 26px 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.finder-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  display: inline-grid;
  width: 18px;
  height: 18px;
  place-items: center;
  border-radius: 50%;
  color: white;
  font-style: normal;
  font-weight: 800;
}

.legend-dot.done {
  background: var(--vp-c-green-1);
}

.legend-dot.suspect {
  background: var(--vp-c-warning-1);
}

.diagnosis {
  display: grid;
  grid-template-columns: minmax(150px, 0.72fr) minmax(0, 1.6fr);
  gap: 28px;
  padding: 18px 26px 26px;
}

.route {
  margin: 0;
  padding: 2px 0;
  list-style: none;
}

.milestone {
  display: grid;
  grid-template-columns: 32px 1fr;
  min-height: 42px;
  color: var(--vp-c-text-3);
}

.milestone-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.milestone-dot {
  z-index: 1;
  display: grid;
  width: 26px;
  height: 26px;
  flex: 0 0 26px;
  place-items: center;
  border: 2px solid var(--vp-c-divider);
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
}

.milestone-line {
  width: 2px;
  min-height: 16px;
  flex: 1;
  background: var(--vp-c-divider);
}

.milestone-label {
  padding: 3px 0 10px 8px;
  font-size: 13px;
  line-height: 1.35;
}

.milestone.done {
  color: var(--vp-c-green-1);
}

.milestone.done .milestone-dot {
  border-color: var(--vp-c-green-1);
  color: white;
  background: var(--vp-c-green-1);
}

.milestone.done .milestone-line {
  background: var(--vp-c-green-1);
}

.milestone.done .milestone-label,
.milestone.suspect .milestone-label {
  color: var(--vp-c-text-1);
  font-weight: 700;
}

.milestone.suspect .milestone-dot {
  border-color: var(--vp-c-warning-1);
  color: white;
  background: var(--vp-c-warning-1);
  box-shadow: 0 0 0 5px var(--vp-c-warning-soft);
}

.diagnosis-copy {
  align-self: start;
  padding-top: 1px;
}

.diagnosis-copy h4 {
  font-size: 20px;
}

.result-explain {
  margin: 10px 0 18px;
  color: var(--vp-c-text-2);
  line-height: 1.75;
}

.evidence-block,
.check-block {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 10px;
  padding: 14px;
  border-radius: 12px;
}

.evidence-block {
  background: var(--vp-c-green-soft);
}

.check-block {
  margin-top: 10px;
  background: var(--vp-c-warning-soft);
}

.block-icon {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border-radius: 50%;
  font-size: 15px;
  font-weight: 800;
}

.evidence-block .block-icon {
  color: var(--vp-c-green-1);
  background: var(--vp-c-bg);
}

.check-block .block-icon {
  color: var(--vp-c-warning-1);
  background: var(--vp-c-bg);
}

.evidence-block strong,
.check-block strong {
  font-size: 14px;
}

.evidence-block ul,
.check-block ul {
  margin: 6px 0 0;
  padding-left: 18px;
}

.evidence-block li,
.check-block li {
  margin: 3px 0;
  font-size: 13px;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .fault-finder {
    margin-inline: -2px;
    border-radius: 14px;
  }

  .finder-header,
  .scene-picker {
    padding: 18px;
  }

  .finder-header h3 {
    font-size: 20px;
  }

  .scene-tab {
    flex: 1 1 calc(50% - 8px);
    justify-content: center;
  }

  .symptom-button {
    flex-basis: 100%;
  }

  .finder-legend {
    padding: 14px 18px 0;
  }

  .diagnosis {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
    padding: 18px;
  }

  .route {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .milestone {
    display: flex;
    min-height: 34px;
    align-items: center;
    gap: 7px;
  }

  .milestone-rail {
    display: block;
  }

  .milestone-line {
    display: none;
  }

  .milestone-label {
    padding: 0;
  }
}
</style>
