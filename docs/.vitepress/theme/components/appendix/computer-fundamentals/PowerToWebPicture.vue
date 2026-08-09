<template>
  <figure class="process-picture" :aria-label="alt">
    <div class="picture-window">
      <img
        :src="imageSrc"
        :alt="alt"
        loading="lazy"
        decoding="async"
        :style="{ transform: `translateY(-${panel * (100 / 3)}%)` }"
      />
    </div>
  </figure>
</template>

<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  strip: { type: String, required: true },
  panel: { type: Number, required: true },
  alt: { type: String, default: '' }
})

const imageSrc = computed(() => withBase(`/images/power-to-web/${props.strip}-strip.png`))
</script>

<style scoped>
.process-picture {
  margin: 20px 0 28px;
}

.picture-window {
  position: relative;
  overflow: hidden;
  aspect-ratio: 2 / 1;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: #f8ede0;
  box-shadow: 0 10px 26px rgba(71, 45, 22, 0.08);
}

.picture-window img {
  display: block;
  width: 100%;
  max-width: none;
  height: auto;
  margin: 0;
}

@media (max-width: 640px) {
  .process-picture {
    margin: 16px 0 24px;
  }

  .picture-window {
    border-radius: 12px;
  }
}
</style>
