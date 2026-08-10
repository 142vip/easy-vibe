<template>
  <figure class="finish-map" aria-labelledby="finish-map-title">
    <figcaption class="map-heading">
      <span>这一章要做什么</span>
      <strong id="finish-map-title">让别人不用你在旁边帮忙，也能把产品用完</strong>
    </figcaption>

    <div class="comparison">
      <section class="comparison-card prototype-card">
        <div class="card-title">
          <span aria-hidden="true">🧪</span>
          <div>
            <small>现在</small>
            <strong>只有自己熟悉的原型</strong>
          </div>
        </div>
        <ul>
          <li>自己知道从哪里开始</li>
          <li>正常输入可以得到结果</li>
          <li>遇到问题时自己会绕过去</li>
        </ul>
      </section>

      <div class="comparison-arrow" aria-hidden="true">→</div>

      <section class="comparison-card product-card">
        <div class="card-title">
          <span aria-hidden="true">🚀</span>
          <div>
            <small>完成后</small>
            <strong>别人也能上手的作品</strong>
          </div>
        </div>
        <ul>
          <li>第一次打开也知道怎样操作</li>
          <li>等待和失败时能看懂发生了什么</li>
          <li>结果可以继续编辑、复制或保存</li>
        </ul>
      </section>
    </div>

    <div class="finish-route" aria-label="把作品整理好的四个步骤">
      <span><b>1</b> 自己用一遍</span>
      <i aria-hidden="true">→</i>
      <span><b>2</b> 把卡点补好</span>
      <i aria-hidden="true">→</i>
      <span><b>3</b> 请别人来试</span>
      <i aria-hidden="true">→</i>
      <span><b>4</b> 整理并分享</span>
    </div>
  </figure>
</template>

<style scoped>
.finish-map {
  margin: 28px 0 36px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background:
    radial-gradient(circle at 4% 0%, rgba(116, 93, 255, 0.13), transparent 34%),
    radial-gradient(circle at 96% 100%, rgba(32, 181, 134, 0.11), transparent 36%),
    var(--vp-c-bg-soft);
  box-shadow: 0 12px 32px rgba(32, 36, 50, 0.06);
}

.map-heading {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 18px;
}

.map-heading span {
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.map-heading strong {
  color: var(--vp-c-text-1);
  font-size: 19px;
  line-height: 1.45;
}

.comparison {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: stretch;
  gap: 14px;
}

.comparison-card {
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
}

.prototype-card {
  border-color: color-mix(in srgb, #795cff 27%, var(--vp-c-divider));
}

.product-card {
  border-color: color-mix(in srgb, #21a779 30%, var(--vp-c-divider));
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.card-title > span {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 11px;
  background: var(--vp-c-bg-soft);
  font-size: 19px;
}

.card-title div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.card-title small {
  color: var(--vp-c-text-3);
  font-size: 10px;
}

.card-title strong {
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1.4;
}

.comparison-card ul {
  margin: 0;
  padding-left: 18px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.8;
}

.comparison-arrow {
  display: grid;
  place-items: center;
  color: var(--vp-c-brand-1);
  font-size: 22px;
}

.finish-route {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-top: 15px;
  padding: 12px 14px;
  border: 1px dashed color-mix(in srgb, var(--vp-c-brand-1) 32%, var(--vp-c-divider));
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 5%, var(--vp-c-bg));
  color: var(--vp-c-text-2);
  font-size: 11px;
}

.finish-route span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.finish-route b {
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: var(--vp-c-brand-1);
  font-size: 10px;
}

.finish-route i {
  color: var(--vp-c-text-3);
  font-style: normal;
}

@media (max-width: 700px) {
  .finish-map {
    padding: 18px;
  }

  .comparison {
    grid-template-columns: 1fr;
  }

  .comparison-arrow {
    height: 14px;
    transform: rotate(90deg);
  }

  .finish-route {
    flex-wrap: wrap;
  }
}
</style>
