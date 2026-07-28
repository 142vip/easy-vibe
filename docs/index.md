---
layout: home
---

<script setup>
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

const WELCOME_SEEN_KEY = 'easy-vibe-welcome-seen'

onMounted(() => {
  // Language map: browser language code -> site path
  const langMap = {
    'zh': '/zh-cn/',
    'zh-cn': '/zh-cn/',
    'zh-tw': '/zh-tw/',
    'zh-hk': '/zh-tw/',
    'en': '/en/',
    'en-us': '/en/',
    'en-gb': '/en/',
    'ja': '/ja-jp/',
    'ja-jp': '/ja-jp/',
    'ko': '/ko-kr/',
    'ko-kr': '/ko-kr/',
    'es': '/es-es/',
    'es-es': '/es-es/',
    'fr': '/fr-fr/',
    'fr-fr': '/fr-fr/',
    'de': '/de-de/',
    'de-de': '/de-de/',
    'ar': '/ar-sa/',
    'ar-sa': '/ar-sa/',
    'vi': '/vi-vn/',
    'vi-vn': '/vi-vn/'
  }

  // Get browser language
  const browserLang = navigator.language.toLowerCase()
  const browserLangShort = browserLang.split('-')[0]

  // Resolve target language
  let targetLang = langMap[browserLang] || langMap[browserLangShort]

  // Fallback when no match
  if (!targetLang) {
    targetLang = '/zh-cn/'
  }

  const targetPath = withBase(targetLang)
  let hasSeenWelcome = false
  try {
    hasSeenWelcome = window.localStorage.getItem(WELCOME_SEEN_KEY) === '1'
  } catch {
    hasSeenWelcome = false
  }

  if (!hasSeenWelcome) {
    window.location.replace(
      withBase(`/welcome?next=${encodeURIComponent(targetPath)}`)
    )
    return
  }

  // Redirect immediately without rendering content.
  // Use withBase to handle base path (see config.mjs).
  window.location.replace(targetPath)
})
</script>
