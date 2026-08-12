---
title: نشر مشروع Vibe Coding على ModelScope
description: دليل كامل لنشر HTML أو نواتج Vue وReact وVite باستخدام Skill الرسمي وStatic Studio.
---

# نشر مشروع Vibe Coding على ModelScope

بعد أن تعمل الصفحة على جهازك، تحتاج إلى عنوان يستطيع الأصدقاء أو الزملاء أو المستخدمون الحقيقيون فتحه.

يمكنك استئجار خادم وإعداد النطاق وHTTPS والنشر بنفسك. في هذا الدرس سنقلل أعمال التشغيل وننشر الموقع في **ModelScope Studio**.

ModelScope مجتمع مفتوح المصدر أطلقته Alibaba بالتعاون مع لجنة تطوير المصادر المفتوحة في CCF. وإلى جانب أكثر من 200 ألف نموذج مفتوح المصدر و30 ألف مجموعة بيانات، يوفر المجتمع **Studios** لعرض التطبيقات. يمنحك Studio عنوانًا مجانيًا قابلًا للمشاركة دون أن تتعلم إدارة الخوادم أولًا.

> راجعنا هذا الدليل مع الواجهة الحالية وSkills الرسمية ووثائق الأوامر في **11 أغسطس 2026**. قد تتغير أماكن الأزرار، لكن المسار يبقى: إنشاء Static Studio، رفع ناتج البناء، النشر، ثم اختبار الرابط.

إلى جانب Gradio وStreamlit وDocker، يدعم Studio نوع `static` للمواقع المبنية مسبقًا. إذا كان الناتج `index.html` وCSS وJavaScript وصورًا، فاختر هذا النوع.

سيكون العنوان المنشور قريبًا من:

```text
https://modelscope.cn/studios/اسمك/اسم-studio
```

## اختر طريقة النشر المناسبة

| المشروع | نوع Studio | التحضير |
| --- | --- | --- |
| HTML وCSS وJavaScript | **Static** | جهز الملفات، ولا حاجة إلى بناء |
| Vue أو React أو Vite أو Svelte | **Static** | ابنِ محليًا وانشر محتويات `dist` أو `build` فقط |
| Gradio | Gradio | جهز `app.py` و`requirements.txt` |
| Streamlit | Streamlit | جهز ملف البدء والاعتماديات |
| خلفية أو حزم نظام خاصة | Docker | اكتب Dockerfile واجعل الخدمة تستمع إلى المنفذ المطلوب |

يركز هذا الفصل على الخيارين الأولين. **لا ترفع مصدر Vue أو React بوصفه موقع Static.** متصفح الزائر لن يشغّل `npm install` أو `npm run build`.

## الطريقة الموصى بها: Skill الرسمي

تحافظ ModelScope على [Skills رسمية](https://github.com/modelscope/modelscope-skills).

| Skill | الوظيفة | وقت الاستخدام |
| --- | --- | --- |
| `ms-hub` | مدخل موحد للمستودعات والنماذج والبيانات وStudios وMCP وSkills Center | أول اتصال والعمليات العامة |
| `ms-studio-deploy` | كشف المشروع وإنشاء Studio ومزامنة Git والنشر والسجلات وتشخيص الأخطاء | **الخيار الأول لنشر موقع محلي أو تحديثه** |

يتعرف `ms-studio-deploy` إلى `static` عندما يوجد `index.html` في الجذر. لا يشغّل Static Studio الأمر `npm run build`، لذلك ابنِ مشاريع الأطر محليًا.

### ثبّت Skills

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

إذا لم يتضمن الأمر `skills`، استخدم المثبت الرسمي:

```bash
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-hub
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-studio-deploy
```

تثبّت Skills عادة في `~/.agents/skills/`. افتح بعدها جلسة جديدة في Codex أو Cursor أو Claude Code أو أداة متوافقة لتحديث القائمة.

### انشر باستخدام Skill

بحسب [دليل `ms-studio-deploy` الرسمي](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)، جهز ثلاثة أشياء:

1. ثبّت Skill وافتح جلسة Agent جديدة.
2. افتح مجلد النشر، وضع `index.html` مباشرة في الجذر.
3. اضبط ModelScope Access Token على الجهاز.

احصل على الرمز من صفحة [Access Tokens](https://modelscope.cn/my/myaccesstoken) واضبطه في الطرفية:

```bash
export MODELSCOPE_API_KEY="رمزك"
```

في HTML البسيط افتح مجلد الموقع مباشرة. في Vue أو React أو Vite ابنِ أولًا ثم ادخل إلى الناتج:

```bash
npm run build
cd dist
```

ينشئ Vite عادة `dist`. إذا أنشأت أداتك `build` فافتحه بدلًا منه، ثم افتح المجلد في أداة تدعم Agent Skills.

#### أقصر طلب

```text
استخدم Skill باسم ms-studio-deploy لنشر هذا الموقع في Static Studio على ModelScope. أرسل لي العنوان بعد أن يعمل.
```

يفحص Skill ملف `index.html` وتسجيل الدخول. وإذا احتاج إلى Studio جديد سيسأل عن الاسم والظهور. ابدأ بالوضع الخاص.

ويمكنك تقديم الشروط دفعة واحدة:

```text
استخدم Skill باسم ms-studio-deploy لنشر هذا المجلد في Static Studio على موقع ModelScope الصيني.
سمِّ Studio باسم my-portfolio واجعله خاصًا أولًا. افحص الحالة والسجلات بعد النشر.
إذا فشل، أصلح السبب الوارد في السجلات، وانشر من جديد، ثم أعد العنوان العامل.
```

#### ما الذي ستفعله أداة AI؟

```text
كشف المشروع → اختيار الموقع الصيني أو الدولي → قراءة الحساب
→ إنشاء Studio أو إعادة استخدامه → فحص الملفات الحساسة → المزامنة إلى master
→ بدء النشر → فحص الحالة والسجلات → التشخيص والإصلاح → إعادة العنوان
```

اختبر في الوضع الخاص أولًا ثم اجعله عامًا. لا يحتاج الموقع Static إلى عتاد مدفوع. وإذا احتاج نوع آخر إلى مورد مدفوع، فعلى Skill طلب موافقتك الصريحة.

يُستخدم الرمز للـAPI وGit push. لا تضعه في الواجهة أو README أو الطلب أو لقطة مشتركة.

## المسار اليدوي: الخطوة 0 — جهز الموقع

استخدام Skill أسهل، لكن المسار اليدوي يشرح واجهة Studio ويفيد عندما لا تتوفر أداة Agent.

### الحالة A: HTML بسيط

يجب أن يكون `index.html` في جذر المحتوى المنشور:

```text
my-site/
├── index.html
├── styles.css
├── app.js
└── images/
    └── cover.jpg
```

اختبر عبر HTTP قبل النشر:

```bash
cd my-site
python3 -m http.server 8000
```

افتح `http://localhost:8000`. النقر المزدوج على `index.html` لا يكفي؛ إذ يتعامل `file://` وHTTP بطريقة مختلفة مع الوحدات وCORS والمسارات.

### الحالة B: Vue وReact وVite وما شابه

```bash
npm install
npm run build
```

| الأداة | مجلد الناتج المعتاد |
| --- | --- |
| Vite / Vue + Vite / React + Vite | `dist/` |
| Create React App | `build/` |
| Vue CLI | `dist/` |

انشر **محتوى** الناتج حتى يظهر `index.html` مباشرة في جذر Studio.

```text
صحيح: index.html
خطأ: dist/index.html
```

إذا أعادت ملفات CSS أو JavaScript أو الصور خطأ 404، جرّب قاعدة نسبية في Vite:

```js
// vite.config.js / vite.config.ts
export default {
  base: './'
}
```

ابنِ من جديد. قد لا يعيد المضيف الثابت جميع المسارات إلى `index.html`؛ ويمكن لتطبيق SPA استخدام مسار Hash مثل `/#/about`.

## المسار اليدوي: الخطوة 1 — افتح Studio وسجّل الدخول

افتح [ModelScope Studio](https://modelscope.cn/studios). يعرض أعلى الصفحة مسار الإنشاء والبناء والنشر والمشاركة.

![صفحة ModelScope Studio مع مراحل الإنشاء والنشر](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

اختر الإنشاء أو افتح [إنشاء Studio](https://modelscope.cn/studios/create). لا يشارك الموقع الصيني `modelscope.cn` والدولي `modelscope.ai` الحساب أو الرمز أو المحتوى.

## المسار اليدوي: الخطوة 2 — أدخل المعلومات الأساسية

![نموذج المالك والاسم والترخيص والظهور والوصف](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

1. **المالك أو المنظمة:** يحدد جزء المالك في العنوان.
2. **الاسم:** استخدم أحرفًا صغيرة وأرقامًا وشرطات مثل `my-portfolio`.
3. **اسم العرض والوصف:** اكتبهما بلغة يفهمها الزائر.
4. **الظهور:** ابدأ خاصًا ثم اجعله عامًا بعد الاختبار.
5. **الترخيص:** اختره وفق المشروع.

أكد المعلومات وانتظر فتح Studio.

## المسار اليدوي: الخطوة 3 — ارفع الملفات

في Static Studio يعمل، يظهر `index.html` و`README.md` مباشرة في الجذر.

![صفحة ملفات Static Studio وindex.html في الجذر](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

ارفع `index.html` وCSS وJavaScript والصور من **Files**. لا تضعها داخل مجلد إضافي باسم `dist` أو `build` أو المشروع.

الرفع اليدوي مناسب للملفات القليلة. عند كثرة الملفات أو التحديثات استخدم `ms-studio-deploy` لمزامنة Git.

## المسار اليدوي: الخطوة 4 — اختر Static في إعدادات النشر

بعد رفع الملفات، افتح إعدادات النشر في Studio واختر **Static** لنوع SDK. يناسب Static موقع HTML جاهزًا، وتظهر في المنطقة نفسها خيارات Gradio وStreamlit وDocker.

![اختيار Static في إعدادات النشر](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

تأكد مرة أخرى من وجود `index.html` في جذر المستودع، ثم احفظ إعدادات النشر.

> إذا احتاج الموقع إلى قاعدة بيانات أو مفتاح سري أو حسابات خادمية، فليس ثابتًا بحتًا. استخدم Gradio أو Streamlit أو Docker أو خلفية منفصلة. المفتاح المكتوب في JavaScript الأمامي لا يبقى سريًا.

## المسار اليدوي: الخطوة 5 — انتظر النشر واختبر

يبدأ النشر عادة بعد حفظ الإعدادات. إن لم يبدأ، اختر النشر أو إعادة التشغيل. عندما يصبح عاملًا افتح:

```text
https://modelscope.cn/studios/اسمك/اسم-studio
```

- هل تفتح الصفحة الرئيسية؟
- هل تعمل CSS وJavaScript والصور؟
- هل تظهر أخطاء 404 أو CORS أو JavaScript في وحدة التحكم؟
- هل يعمل الموقع بعرض الهاتف؟
- هل يفتح Studio العام في نافذة غير مسجلة الدخول؟

اختبره خاصًا أولًا، ثم اجعله عامًا وكرر الاختبار دون تسجيل الدخول.

## المسار اليدوي: الخطوة 6 — حدّث الموقع

بعد تعديل المصدر، اختبر محليًا وابنِ من جديد. استبدل في **Files** الملفات القديمة بمحتوى `dist` أو `build` الجديد ثم أعد النشر.

```text
تعديل المصدر → اختبار محلي → إعادة البناء → استبدال ملفات Studio
→ إعادة النشر → فحص العنوان النهائي
```

لا ترفع `node_modules` أو إعدادات التطوير أو المشروع المصدري الكامل. مع التحديثات الكثيرة ارجع إلى Skill.

## استخدم Skill أيضًا لحل الأخطاء

<ModelScopeTroubleshooter />

## المصادر

- [ModelScope Studio](https://modelscope.cn/studios) (الواجهة والصور راجعت في 2026-08-11)
- [لقاء مطوري ModelScope](https://community.modelscope.cn/683562c6870cef7360622f7f.html)
- [تعليمات `ms-hub` الرسمية](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-hub/SKILL.md)
- [Skill الرسمي `ms-studio-deploy`](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)
- [عميل ModelScope Hub](https://github.com/modelscope/modelscope_hub)
- [مثال Static Studio عام](https://modelscope.cn/studios/studio-demo-station/funasr-demo-static-multiple/summary)
