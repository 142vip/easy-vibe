<script setup>
import { computed, ref } from 'vue'

const active = ref('android-global')

const channels = [
  {
    id: 'android-global',
    icon: '🤖',
    label: 'Android 海外',
    store: 'Google Play',
    package: '已签名的 .aab',
    alternative: '官网 APK、企业 MDM、其他应用商店',
    note: '新应用先走内部或封闭测试，再逐步发布到正式渠道。',
    color: '#22a06b',
  },
  {
    id: 'android-cn',
    icon: '📱',
    label: 'Android 国内',
    store: '手机厂商商店、应用宝等',
    package: '按商店要求提交 APK 或 AAB',
    alternative: '企业 MDM、官网 APK',
    note: '通常需要分别注册渠道，并准备 APP 备案和隐私合规资料。',
    color: '#e67e3f',
  },
  {
    id: 'ios',
    icon: '',
    label: 'iPhone / iPad',
    store: 'App Store',
    package: '通过 Xcode Archive 上传构建',
    alternative: 'TestFlight、Custom Apps、企业分发',
    note: '先在 App Store Connect 创建应用记录，再上传对应 Bundle ID 的构建。',
    color: '#637083',
  },
  {
    id: 'windows',
    icon: '🪟',
    label: 'Windows',
    store: 'Microsoft Store',
    package: 'MSIX，或符合要求的 MSI / EXE',
    alternative: '官网、企业软件中心、包管理器',
    note: '官网发布时，需要自己处理代码签名、下载安全和自动更新。',
    color: '#2587d8',
  },
  {
    id: 'macos',
    icon: '💻',
    label: 'macOS',
    store: 'Mac App Store',
    package: '通过 Xcode Archive 上传构建',
    alternative: '官网提供已签名并公证的 DMG / PKG',
    note: '从官网分发的软件也要签名并经过 Apple 公证。',
    color: '#7967d8',
  },
  {
    id: 'linux',
    icon: '🐧',
    label: 'Linux',
    store: 'Flathub、Snap Store',
    package: 'Flatpak manifest 或 .snap',
    alternative: 'AppImage、.deb、.rpm、自己的软件源',
    note: 'Linux 没有覆盖所有发行版的唯一商店，要根据用户环境选择格式。',
    color: '#c9942e',
  },
  {
    id: 'web',
    icon: '🌐',
    label: 'Web / PWA',
    store: '自己的域名和服务器',
    package: 'HTTPS 网站、Manifest、Service Worker',
    alternative: '也可以进一步提交到部分桌面商店',
    note: '网站部署成功就是主要发布方式，PWA 再增加安装和离线体验。',
    color: '#2a9ba6',
  },
]

const current = computed(() => channels.find((item) => item.id === active.value) ?? channels[0])
</script>

<template>
  <section class="channel-picker" aria-label="选择程序发布平台">
    <div class="platform-list" role="tablist" aria-label="程序平台">
      <button
        v-for="item in channels"
        :key="item.id"
        :class="{ active: active === item.id }"
        :style="{ '--channel-color': item.color }"
        type="button"
        role="tab"
        :aria-selected="active === item.id"
        @click="active = item.id"
      >
        <span aria-hidden="true">{{ item.icon }}</span>
        {{ item.label }}
      </button>
    </div>

    <article class="channel-detail" :style="{ '--channel-color': current.color }" aria-live="polite">
      <header>
        <span class="platform-icon" aria-hidden="true">{{ current.icon }}</span>
        <div>
          <small>{{ current.label }}最常见的公开渠道</small>
          <strong>{{ current.store }}</strong>
        </div>
      </header>

      <div class="channel-fields">
        <div>
          <small>准备什么</small>
          <b>{{ current.package }}</b>
        </div>
        <div>
          <small>还可以怎么发</small>
          <b>{{ current.alternative }}</b>
        </div>
      </div>

      <p><span aria-hidden="true">📌</span>{{ current.note }}</p>
    </article>
  </section>
</template>

<style scoped>
.channel-picker {
  margin: 22px 0 34px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
}

.platform-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.platform-list button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 11px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
  transition: border-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.platform-list button:hover {
  transform: translateY(-1px);
  border-color: var(--channel-color);
}

.platform-list button.active {
  border-color: var(--channel-color);
  background: color-mix(in srgb, var(--channel-color) 10%, var(--vp-c-bg));
  color: var(--vp-c-text-1);
}

.channel-detail {
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--channel-color) 35%, var(--vp-c-divider));
  border-left: 5px solid var(--channel-color);
  border-radius: 13px;
  background: var(--vp-c-bg);
}

header {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 14px;
}

.platform-icon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 12px;
  background: color-mix(in srgb, var(--channel-color) 12%, var(--vp-c-bg-soft));
  font-size: 23px;
}

header div {
  display: flex;
  flex-direction: column;
}

header small,
.channel-fields small {
  color: var(--vp-c-text-3);
  font-size: 10px;
}

header strong {
  color: var(--vp-c-text-1);
  font-size: 18px;
}

.channel-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.channel-fields > div {
  padding: 11px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.channel-fields b {
  display: block;
  margin-top: 4px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.5;
}

.channel-detail p {
  display: flex;
  gap: 7px;
  margin: 11px 0 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.55;
}

@media (max-width: 620px) {
  .channel-picker {
    padding: 15px;
  }

  .platform-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .platform-list button {
    justify-content: flex-start;
    border-radius: 10px;
  }

  .channel-fields {
    grid-template-columns: 1fr;
  }
}
</style>
