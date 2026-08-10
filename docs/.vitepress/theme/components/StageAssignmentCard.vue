<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  eyebrow: {
    type: String,
    default: '动手练习'
  }
})
</script>

<template>
  <section class="assignment-card" :aria-label="title">
    <header class="assignment-header">
      <span class="assignment-mark" aria-hidden="true">🎯</span>
      <div>
        <span class="assignment-eyebrow">{{ eyebrow }}</span>
        <h3>{{ title }}</h3>
      </div>
    </header>

    <div class="assignment-body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.assignment-card {
  position: relative;
  overflow: hidden;
  margin: 22px 0 34px;
  border: 1px solid
    color-mix(in srgb, var(--vp-c-brand-1) 24%, var(--vp-c-divider));
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--vp-c-brand-1) 13%, transparent),
      transparent 34%
    ),
    var(--vp-c-bg-soft);
  box-shadow: 0 16px 40px rgba(30, 42, 72, 0.08);
}

.assignment-card::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--vp-c-brand-1),
    color-mix(in srgb, var(--vp-c-brand-1) 45%, #24b47e)
  );
  content: '';
}

.assignment-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 23px 26px 19px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.assignment-mark {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border: 1px solid
    color-mix(in srgb, var(--vp-c-brand-1) 22%, var(--vp-c-divider));
  border-radius: 14px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, var(--vp-c-bg));
  box-shadow: 0 8px 20px
    color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent);
  font-size: 21px;
}

.assignment-eyebrow {
  display: block;
  margin-bottom: 3px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.assignment-header h3 {
  margin: 0;
  border: 0;
  color: var(--vp-c-text-1);
  font-size: 20px;
  line-height: 1.4;
}

.assignment-body {
  padding: 22px 26px 25px;
}

.assignment-body :deep(> p:first-child) {
  margin: 0 0 18px;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.8;
}

.assignment-body :deep(> ol),
.assignment-body :deep(> ul) {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  counter-reset: assignment-step;
}

.assignment-body :deep(> ol > li),
.assignment-body :deep(> ul > li) {
  position: relative;
  margin: 0;
  padding: 14px 16px 14px 52px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: color-mix(in srgb, var(--vp-c-bg) 92%, transparent);
  color: var(--vp-c-text-1);
  line-height: 1.7;
  list-style: none;
}

.assignment-body :deep(> ol > li) {
  counter-increment: assignment-step;
}

.assignment-body :deep(> ol > li::before),
.assignment-body :deep(> ul > li::before) {
  position: absolute;
  top: 13px;
  left: 14px;
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(
    145deg,
    var(--vp-c-brand-1),
    color-mix(in srgb, var(--vp-c-brand-1) 62%, #24b47e)
  );
  box-shadow: 0 5px 12px
    color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent);
  font-size: 12px;
  font-weight: 700;
}

.assignment-body :deep(> ol > li::before) {
  content: counter(assignment-step);
}

.assignment-body :deep(> ul > li::before) {
  content: '✓';
}

.assignment-body :deep(> ol > li > strong),
.assignment-body :deep(> ul > li > strong) {
  display: block;
  margin-bottom: 4px;
  color: var(--vp-c-text-1);
  font-size: 15px;
}

.assignment-body :deep(li ul) {
  margin: 7px 0 0;
  padding-left: 18px;
  color: var(--vp-c-text-2);
}

.assignment-body :deep(li ul li) {
  margin: 4px 0;
}

.assignment-body :deep(> p:last-child:not(:first-child)) {
  margin: 16px 0 0;
  padding: 12px 14px;
  border-left: 3px solid #24a36f;
  border-radius: 0 10px 10px 0;
  background: color-mix(in srgb, #24a36f 8%, var(--vp-c-bg));
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

@media (max-width: 640px) {
  .assignment-card {
    margin: 18px 0 28px;
    border-radius: 17px;
  }

  .assignment-header {
    align-items: flex-start;
    padding: 20px 18px 17px;
  }

  .assignment-mark {
    width: 40px;
    height: 40px;
    flex-basis: 40px;
    border-radius: 12px;
    font-size: 19px;
  }

  .assignment-header h3 {
    font-size: 18px;
  }

  .assignment-body {
    padding: 18px;
  }

  .assignment-body :deep(> ol > li),
  .assignment-body :deep(> ul > li) {
    padding: 13px 13px 13px 48px;
  }

  .assignment-body :deep(> ol > li::before),
  .assignment-body :deep(> ul > li::before) {
    left: 12px;
  }
}
</style>
