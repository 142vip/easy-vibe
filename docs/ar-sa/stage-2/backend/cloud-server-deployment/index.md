<script setup>
import RelatedArticlesSection from '../../../../.vitepress/theme/components/RelatedArticlesSection.vue'
import { relatedArticlesMap } from '../../../../.vitepress/theme/data/relatedArticles'
</script>

# انشر موقعك على الإنترنت (متقدم): جهّز خادم VPS خاصًا بك

> 💡 **ماذا يعني "نشر موقع على الإنترنت"؟** يُسمى أيضًا "الظهور على الإنترنت" أو "النشر/الإصدار". الموقع الذي بنيته على جهازك الخاص لا يمكن فتحه إلا بواسطتك. **النشر يعني وضعه على خادم يعمل على مدار الساعة، بحيث يمكن لأي شخص كتابة عنوان URL في متصفحه وزيارته** — تمامًا مثل مستند Word لا يقرأه إلا أنت، يصبح مرئيًا للجميع بمجرد نشره في مدونة؛ الفرق هنا أنك تنشر موقعًا كاملًا.

في الفصل السابق تعلمنا أسهل طريقة للنشر — باستخدام منصات PaaS بنقرة واحدة مثل Vercel أو Zeabur. يغطي هذا الفصل النهج الأكثر مرونة والذي يعتمد على الجهد الذاتي: **اشترِ خادمك السحابي الخاص، وجهّز كل شيء من الصفر، وانشر موقعك بنفسك**. ستتعلم كيفية اختيار خادم، والاتصال به، وتثبيت البيئة، وتكوين Nginx، وربط اسم نطاق، وتفعيل HTTPS. بمجرد أن تفهم هذا، لن تحدّك أي منصة — شغّل أي خدمات تريدها.

---

# 0. اختر بحكمة: شجرة قرارات منصة النشر

قبل اختيار منصة، أجب عن ثلاثة أسئلة:

1. **هل يحتاج مشروعك إلى العمل على مدار الساعة (24/7)؟**
   - لا (يستجيب فقط عند الزيارة، مثل المستندات والمدونات والمواقع الثابتة) → **استضافة ثابتة / PaaS**
   - نعم (مهام cron، أدوات الزحف، بوتات Telegram/Discord، خدمات WebSocket) → **PaaS دائم التشغيل أو VPS**

2. **هل تحتاج إلى وحدة معالجة رسومية (GPU)؟**
   - لا (فقط استدعاء واجهات OpenAI/Anthropic) → المنصات العادية كافية
   - نعم (تشغيل نماذج مفتوحة المصدر، توليد الصور/الفيديو) → **منصات سحابية بوحدات GPU** (Modal، Replicate، Lambda Labs)

3. **أين يتواجد مستخدموك بشكل أساسي؟**
   - عالمي / أمريكا وأوروبا → Vercel / Railway / Fly.io / AWS
   - البر الصيني الرئيسي → السحب الصينية (Alibaba Cloud / Tencent Cloud) أو Cloudflare (سريع في الصين)
   - كلاهما → استخدم CDN، وانشر الأصول الموجهة للصين على سحابة صينية، والأصول العالمية على AWS مع DNS جغرافي (GeoDNS)

```
What type of project are you deploying?
│
├─ Pure frontend static site (Vite/React/Vue build output)
│   ├─ Completely free → Cloudflare Pages (unlimited bandwidth) / GitHub Pages
│   ├─ Next.js project → Vercel (official platform, best DX)
│   └─ China users primarily → Cloudflare Pages or domestic OSS+CDN
│
├─ Backend API, doesn't need to be always-on (request-triggered)
│   ├─ Node.js/Python API → Vercel Functions / Cloudflare Workers
│   └─ Full-stack frameworks (Next.js/Nuxt/SvelteKit) → Vercel
│
├─ Needs always-on process (Bot, cron, WebSocket)
│   ├─ Don't want to manage servers → Railway / Render / Fly.io
│   ├─ Full control & cost savings → Buy a VPS (DigitalOcean / Vultr / Hetzner / AWS EC2)
│   └─ China-facing projects → Tencent Cloud Lighthouse / Alibaba Cloud ECS
│
├─ Need to run AI models / GPU
│   ├─ Inference API → Modal / Replicate / Hugging Face Inference
│   ├─ Training/Fine-tuning → Modal / Lambda Labs
│   └─ China GPU → AutoDL / Alibaba Cloud PAI
│
└─ Large production projects
    └─ AWS/GCP + Kubernetes (hire DevOps or let AI write Terraform)
```

---

# 1. منصات النشر المجانية/منخفضة التكلفة بالتفصيل (بدون الحاجة إلى خادم)

بالنسبة لمعظم المشاريع الشخصية والعروض التجريبية ومعارض الأعمال، **لست بحاجة إلى شراء خادم إطلاقًا**. يغطي هذا القسم أشهر المنصات المجانية/منخفضة التكلفة، مع طريقة التسجيل وطريقة الاستخدام وأبرز المزالق.

## 1.1 Vercel — الخيار الأول لـ Next.js / الواجهات الأمامية

**الموقع:** https://vercel.com

**الأنسب لـ:** مشاريع Next.js، وواجهات React/Vue الأمامية، والتطبيقات الكاملة مع دوال Serverless، وروبوتات الدردشة بالذكاء الاصطناعي (استجابة سريعة)

**طريقة الاستخدام:**
1. سجّل بحساب GitHub الخاص بك
2. انقر على "Add New..." → "Project"
3. اختر مستودع GitHub الخاص بك
4. يكتشف Vercel تلقائيًا إطار عملك (Next.js/Vite/React إلخ)، واملأ متغيرات البيئة
5. انقر على "Deploy" — يصبح موقعك مباشرًا خلال 1-2 دقيقة على `xxx.vercel.app`

**الحصة المجانية (خطة Hobby):**
- 100 جيجابايت نطاق ترددي/شهر
- 100 ساعة بناء/شهر
- مدة تنفيذ دوال Serverless **10 ثوانٍ** (الحد الأكثر أهمية!)
- HTTPS تلقائي، وشبكة CDN عالمية، وروابط معاينة لكل PR

**النسخة المدفوعة (Pro، 20$ شهريًا):**
- تمديد مهلة الدوال إلى 60-300 ثانية
- نطاق ترددي 1 تيرابايت
- ميزات التعاون الجماعي

**⚠️ أهم القيود التي يواجهها المبتدئون:**
- **مهلة الدالة 10 ثوانٍ** في الحصة المجانية: استدعاءات واجهات الذكاء الاصطناعي التي تتجاوز 10 ثوانٍ ستنقطع. خطة Pro (20$ شهريًا) تمددها إلى 60 ثانية، و300 ثانية بتكلفة إضافية
- **لا توجد عمليات دائمة التشغيل**: لا cron، ولا WebSocket طويل المدى، ولا بوتات تعمل باستمرار
- **البدء البارد**: الدوال غير المستخدمة لفترة ستكون بطيئة عند أول طلب
- **تكاليف مشاريع الذكاء الاصطناعي**: استجابات الذكاء الاصطناعي المتدفقة تستهلك النطاق الترددي؛ وحركة المرور الكثيفة قد ترفع فواتير Pro إلى 200$ شهريًا

**الخلاصة:** Vercel هو الخيار الأكثر سلاسة لنشر صفحات الواجهة الأمامية والمستندات والعروض السريعة. لكن بالنسبة للوكلاء دائمي التشغيل أو استدعاءات الذكاء الاصطناعي الطويلة — لا تستخدم Vercel.

## 1.2 Cloudflare Pages — نطاق ترددي غير محدود وسرعة عالمية

**الموقع:** https://pages.cloudflare.com

**الأنسب لـ:** المواقع الثابتة، والمشاريع ذات الاستهلاك العالي للنطاق الترددي، والجمهور العالمي، ودوال Edge Functions

**الحصة المجانية:**
- **نطاق ترددي غير محدود** (أكبر نقطة بيع!)
- 500 عملية بناء/شهر
- طلبات غير محدودة
- Cloudflare Workers: 100,000 طلب/يوم
- أكثر من 300 موقع حافة حول العالم، وأداء مقبول حتى في الصين

**طريقة الاستخدام:**
1. سجّل حساب Cloudflare مجانيًا
2. انتقل إلى Workers & Pages → Create → Pages → Connect to Git
3. اختر مستودعك، واضبط أمر البناء (Vite: `npm run build`، ومجلد الإخراج: `dist`)
4. انقر على Save and Deploy

**مكافأة: Workers AI:** تقدم Cloudflare أيضًا تشغيل نماذج ذكاء اصطناعي مفتوحة المصدر (Llama 3، Mistral، Stable Diffusion) على عُقد الحافة، مع 10,000 خلية عصبية/يوم مجانًا. مثالي لتشغيل نماذج صغيرة دون الاعتماد على واجهات OpenAI.

**الخلاصة:** الخيار الأفضل للمواقع الثابتة، خاصة المشاريع ذات الجمهور العالمي. النطاق الترددي غير المحدود ميزة قاتلة.

## 1.3 Railway — أفضل تجربة لخدمات الواجهة الخلفية (دائمة التشغيل)

**الموقع:** https://railway.app

**الأنسب لـ:** خدمات الواجهة الخلفية دائمة التشغيل، وواجهات Node.js/Python/Go، وبوتات Discord/Telegram، والمشاريع الكاملة التي تحتاج قواعد بيانات

**طريقة الاستخدام:**
1. سجّل بحساب GitHub
2. New Project → Deploy from GitHub repo (أو اختر قالبًا)
3. يكتشف Railway نوع مشروعك تلقائيًا، ويثبّت الاعتماديات، ويبني، ويشغّل
4. أضف قواعد بيانات PostgreSQL/Redis/MySQL/MongoDB بنقرة واحدة
5. اسم نطاق مُنشأ تلقائيًا، أو اربط اسم النطاق المخصص الخاص بك

**التسعير:**
- يحصل المستخدمون الجدد على **رصيد تجريبي 5$** (ليس مجانيًا بشكل دائم)
- فوترة حسب الاستخدام بعد ذلك، تبدأ من ~5$/شهر (خدمة دائمة التشغيل بأدنى المواصفات + قاعدة بيانات)
- ينام بعد 5 دقائق من الخمول (أثناء الفترة التجريبية المجانية)؛ لا ينام بعد الدفع

**الخلاصة:** يقدم Railway أفضل تجربة لنشر واجهات API الخلفية والبوتات والتطبيقات الكاملة التي تحتاج قواعد بيانات — نشر تلقائي من GitHub، وقواعد بيانات مدمجة، وسجلات ومراقبة شاملة.

## 1.4 Fly.io — حاويات مجانية تعمل 24/7 حقًا

**الموقع:** https://fly.io

**الأنسب لـ:** الخدمات الموزعة عالميًا ذات زمن الاستجابة المنخفض، لمن يريد **حاوية مجانية حقًا تعمل 24/7** ويقبل منحنى تعلم بسيطًا

**الحصة المجانية:**
- 3 أجهزة افتراضية مشتركة صغيرة (micro-1x، 256MB رام)
- **بدون حد زمني للتشغيل** (لا ينام مثل Render)
- 160 جيجابايت حركة مرور صادرة/شهر
- 3 جيجابايت وحدات تخزين دائمة
- أكثر من 30 منطقة مراكز بيانات عالمية
- دعم GPU (A100/H100)

**طريقة الاستخدام:**
1. التسجيل يتطلب بطاقة ائتمان (لن يتم الخصم، للتحقق من الهوية)
2. ثبّت أداة سطر الأوامر flyctl
3. اكتب ملف إعداد `fly.toml` في مشروعك (يمكن للذكاء الاصطناعي توليده)
4. `fly launch` → يبني صورة Docker تلقائيًا، ويخصص IP، وينشر
5. `fly deploy` للتحديث، و`fly logs` لعرض السجلات

**الخلاصة:** إذا كنت تحتاج **حاوية مجانية تعمل 24/7 حقًا** لبوت/API/مهمة cron، فإن Fly.io هو أفضل خيار مجاني. الثمن هو تعلم أوامر flyctl وأساسيات Docker.

## 1.5 Render — 750 ساعة مجانية لكنها تنام

**الموقع:** https://render.com

**الأنسب لـ:** مرحلة التعلم، والمشاريع الشخصية، والمشاريع التي لا تمانع البداية الباردة

**الحصة المجانية:**
- خدمة الويب: 750 ساعة/شهر (مثيل واحد يعمل باستمرار)
- PostgreSQL: مجاني لمدة 90 يومًا (⚠️ تُحذف قاعدة البيانات بعد ذلك!)
- المواقع الثابتة: مجانية تمامًا، 100 جيجابايت نطاق ترددي

**⚠️ المشكلة الرئيسية:**
- **ينام بعد 15 دقيقة من عدم النشاط**، والبداية الباردة تستغرق 10-30 ثانية (تجربة سيئة للمستخدم)
- قاعدة البيانات المجانية تُحذف بعد 90 يومًا — تذكر أن تأخذ نسخًا احتياطية!

**الخلاصة:** جيد لمشاريع التطوير/الاختبار/الدراسة، لكن لا تضع مشاريع إنتاجية موجهة للمستخدمين على الحصة المجانية. النسخة المدفوعة تبدأ من 7$/شهر لإيقاف النوم.

## 1.6 منصات أخرى جديرة بالذكر

| المنصة | النوع | الحصة المجانية | أبرز المزايا |
|----------|------|-----------|------------|
| **GitHub Pages** | استضافة ثابتة | غير محدود (حد مرن 100GB) | الأسهل: ادفع إلى GitHub، فيظهر الموقع مباشرة |
| **Hugging Face Spaces** | تطبيقات الذكاء الاصطناعي | مثيل صغير مجاني بوحدة CPU | مخصص لعروض الذكاء الاصطناعي (Gradio/Streamlit) |
| **Modal** | GPU Serverless للذكاء الاصطناعي | رصيد 30$/شهر | دوال Python كخدمة، بداية GPU باردة أقل من 4 ثوانٍ |
| **Replicate** | استضافة نماذج الذكاء الاصطناعي | الدفع حسب الاستدعاء | تحويل النماذج إلى واجهات API دون إدارة بنية تحتية |
| **Denoland Deploy** | Deno/Edge | 100k طلب/يوم مجانًا | المنصة الرسمية لـ Deno، مع دعم TypeScript أصلي |
| **Netlify** | استضافة ثابتة | 100GB نطاق ترددي/شهر | نظام إضافات غني |
| **Supabase** | BaaS | 500MB قاعدة بيانات مجانًا | بديل مفتوح المصدر لـ Firebase، Postgres+Auth+Storage |
| **Neon** | Postgres Serverless | 500MB مجانًا | قواعد بيانات قابلة للتفرع للبيئات Serverless |
| **Upstash** | Redis Serverless | 10k أمر/يوم مجانًا | Redis مبني على الطلبات للبيئات Serverless |

---

# 2. شراء خادم VPS سحابي: دليل AWS خطوة بخطوة

إذا كنت تحتاج إلى تحكم كامل في بيئة الخادم، أو تشغيل خدمات مخصصة، أو كانت منصات PaaS لا تغطي احتياجاتك، فقد حان الوقت لشراء خادمك السحابي الخاص. يشرح هذا القسم AWS (منصة السحابة العالمية الأكثر استخدامًا)، ويغطي أيضًا البدائل مثل DigitalOcean و Vultr و Hetzner.

## 2.1 الحصة المجانية من AWS — مجانية لمدة 12 شهرًا

تقدم AWS للمستخدمين الجدد حصة مجانية لمدة 12 شهرًا مثالية للتعلم والمشاريع الشخصية. إليك ما تشمله:

| الخدمة | الحصة المجانية |
|---------|---------------------|
| **EC2** | 750 ساعة/شهر من t2.micro أو t3.micro (مثيل واحد يعمل 24/7) |
| **S3** | 5 جيجابايت تخزين قياسي |
| **RDS** | 750 ساعة/شهر db.t2.micro/db.t3.micro + 20 جيجابايت تخزين |
| **Lambda** | مليون طلب/شهر + 3.2 مليون ثانية حوسبة |
| **CloudFront** | 50 جيجابايت حركة خروج + 2 مليون طلب/شهر |
| **CloudWatch** | 10 مقاييس مخصصة + 1 جيجابايت استيعاب سجلات |
| **DynamoDB** | 25 جيجابايت تخزين + 2.5 مليون وحدة قراءة/كتابة |

**⚠️ مهم:** تنتهي الحصة المجانية بعد 12 شهرًا من التسجيل، وبعدها ستُفوتر بالأسعار القياسية. اضبط دائمًا تنبيهات الفوترة (Billing Dashboard → Budgets) لتجنب الرسوم المفاجئة. دمّر الموارد التي لا تستخدمها!

### كيفية إنشاء مثيل EC2 (VPS في AWS):

1. **سجّل** على https://aws.amazon.com/ بالبريد الإلكتروني وبطاقة الائتمان
2. انتقل إلى **لوحة EC2** → **Launch Instances**
3. **الخطوة 1: اختر صورة أمازون للآلة (AMI)**
   - اختر **Ubuntu Server 22.04 LTS (HVM)، SSD Volume Type** (64-bit x86) — وهذا هو الخيار الأسهل للمبتدئين
4. **الخطوة 2: اختر نوع المثيل**
   - اختر **t2.micro** (مؤهل للحصة المجانية، 1 vCPU، 1GB رام)
5. **الخطوة 3: إعداد تفاصيل المثيل**
   - أبقِ الإعدادات الافتراضية (مثيل واحد، VPC افتراضي)
6. **الخطوة 4: إضافة التخزين**
   - حجم الجذر الافتراضي 8GB gp2 كافٍ للبداية
7. **الخطوة 5: إضافة العلامات (Tags)** (اختياري، للتنظيم)
8. **الخطوة 6: إعداد مجموعة الأمان** (⚠️ حرجة — هذه هي جدار الحماية الخاص بك)
   - أنشئ مجموعة أمان جديدة
   - أضف قواعد:
     - النوع: **SSH**، المنفذ: 22، المصدر: **IP الخاص بي** (فقط عنوان IP الخاص بك يستطيع SSH)
     - النوع: **HTTP**، المنفذ: 80، المصدر: **الكل (0.0.0.0/0)**
     - النوع: **HTTPS**، المنفذ: 443، المصدر: **الكل**
9. **الخطوة 7: المراجعة والإطلاق**
10. **مفتاح الوصول (Key Pair)**: عند الطلب، أنشئ زوج مفاتيح جديدًا (مثل `my-aws-key.pem`)، ونزّله، وخزّنه بأمان. **لا يمكنك تنزيله مرة أخرى!**
11. انقر على **Launch Instances** → انتظر 2-5 دقائق حتى يبدأ

### الاتصال بمثيل EC2 الخاص بك:

```bash
# على محطة Mac/Linux المحلية
chmod 400 my-aws-key.pem  # ضبط الصلاحيات الصحيحة (مطلوب!)
ssh -i my-aws-key.pem ubuntu@YOUR_PUBLIC_IP
# مثال: ssh -i my-aws-key.pem ubuntu@54.123.45.67

# على Windows استخدم PuTTY (حوّل .pem إلى .ppk) أو Windows Terminal مع OpenSSH
```

**احصل على عنوان IP العام الخاص بك:** انتقل إلى لوحة EC2 → Instances → اختر مثيلك → ابحث عن "Public IPv4 address" في التفاصيل.

## 2.2 DigitalOcean — توثيق ممتاز للمبتدئين

**الموقع:** https://www.digitalocean.com

**التسعير:** تبدأ Droplets من 4$/شهر (512MB رام، 10GB SSD، 500GB نطاق ترددي)

**لماذا تختار DO:** توثيقها (الذي يُسمى "الدروس المجتمعية") أسطوري — تقريبًا أي سؤال عن Linux/الخوادم لديه درس مكتوب جيدًا على DO. واجهتهم نظيفة وصديقة للمبتدئين.

**طريقة الاستخدام:**
1. سجّل (بطاقة ائتمان أو PayPal، إيداع أدنى 2$ عبر PayPal)
2. انقر على "Create" → "Droplets"
3. اختر Ubuntu 22.04، والخطة الأساسية 4$/شهر، واختر مركز بيانات قريبًا من مستخدميك (NYC، SFO، London، Singapore، إلخ)
4. أضف مفتاح SSH العام الخاص بك (موصى به) أو عيّن كلمة مرور للجذر
5. انقر على "Create Droplet" — جاهز خلال ~دقيقة واحدة
6. اتصل عبر: `ssh root@YOUR_DROPLET_IP`

## 2.3 Vultr — فوترة بالساعة ومواقع كثيرة

**الموقع:** https://www.vultr.com

**التسعير:** تبدأ الحوسبة السحابية العادية من 5$/شهر (1 vCPU، 1GB رام، 25GB SSD، 1TB نطاق ترددي)

**لماذا تختار Vultr:** الدفع بالساعة (يمكنك تشغيل خادم لمدة 10 دقائق لاختبار شيء ما ثم تدميره ودفع سنتات)، وأكثر من 30 موقعًا عالميًا، ولديهم مثيلات GPU ميسورة التكلفة إذا احتجتها لاحقًا.

## 2.4 Hetzner — أفضل قيمة للمشاريع طويلة الأمد

**الموقع:** https://www.hetzner.com/cloud

**التسعير:** يبدأ CX11 من 3.49€/شهر (1 vCPU، 2GB رام، 20GB SSD، 20TB حركة مرور!)

**لماذا تختار Hetzner:** أفضل نسبة سعر إلى أداء في أوروبا، وشبكة مستقرة للغاية. مثالي للمشاريع الإنتاجية طويلة الأمد. المقابل أن مراكز البيانات في ألمانيا/فنلندا/الولايات المتحدة (لا توجد مواقع آسيوية).

## 2.5 مقارنة سريعة لمزودي VPS

| المزود | سعر البداية | الأفضل لـ | الفترة التجريبية المجانية |
|----------|---------------|----------|-----------|
| **AWS EC2** | حصة مجانية 12 شهرًا، ثم ~10$/شهر | تعلم AWS، والتكامل المؤسسي | حصة مجانية 12 شهرًا |
| **DigitalOcean** | 4$/شهر | المبتدئون، توثيق ممتاز | رصيد 200$ لمدة 60 يومًا (للمستخدمين الجدد) |
| **Vultr** | 5$/شهر (2.50$ لـ IPv6 فقط) | الاختبار بالساعة، مناطق متعددة | رصيد 100$ لمدة 30 يومًا |
| **Hetzner** | 3.49€/شهر | أفضل قيمة للمشاريع طويلة الأمد | رصيد 20€ |
| **Linode (Akamai)** | 5$/شهر | راسخ وموثوق | رصيد 100$ لمدة 60 يومًا |

---

# 3. الإعداد الأولي للخادم (Ubuntu 22.04)

بمجرد دخولك إلى الخادم عبر SSH، أول شيء هو تحديث النظام وتثبيت الأدوات الأساسية. يمكنك **نسخ المطالبة أدناه إلى مساعد الذكاء الاصطناعي الخاص بك** والسماح له بتوليد الأوامر الدقيقة التي تحتاجها:

> "لقد جهزت للتو خادم Ubuntu 22.04 جديدًا وأريد نشر مشروع [Node.js/Python/...]. أعطني أوامر التهيئة الكاملة بما في ذلك: تحديث النظام، إنشاء مستخدم sudo غير الجذر، إعداد مصادقة مفتاح SSH، تثبيت Node.js 20، تثبيت Nginx، تثبيت Docker، وتكوين جدار حماية ufw أساسي."

إعداد أولي نموذجي:

```bash
# 1. تحديث النظام وتثبيت الأدوات الأساسية
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git vim ufw build-essential

# 2. إنشاء مستخدم عادي (لا تستخدم الجذر دائمًا!)
sudo adduser yourname
sudo usermod -aG sudo yourname

# 3. تثبيت Node.js (استخدم nvm، وليس apt)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
node -v  # تحقق من الإصدار

# 4. تثبيت Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
# قم بزيارة http://YOUR-IP في المتصفح، يجب أن ترى صفحة ترحيب Nginx

# 5. تثبيت Docker (إذا كنت تستخدم الحاويات)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker yourname  # لتشغيل Docker بدون sudo
# سجّل الخروج ثم الدخول مرة أخرى لتفعيل هذا التغيير
docker --version

# 6. تكوين جدار الحماية
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

## 3.1 تكوين مجموعة الأمان / جدار الحماية (مهم جدًا!)

على AWS يتم ذلك عبر **مجموعات الأمان** (في لوحة EC2). على DigitalOcean/Vultr يكون في إعدادات جدار الحماية بلوحة التحكم الخاصة بهم. على Ubuntu تحتاج أيضًا إلى `ufw`.

**افتح هذه المنافذ على الأقل:**

| المنفذ | الغرض | التوصية |
|------|---------|---------------|
| **22** | SSH | مطلوب؛ قيّده على عنوان IP الخاص بك إن أمكن |
| **80** | HTTP | مطلوب للويب |
| **443** | HTTPS | مطلوب للويب الآمن |
| **3000-3999** | منافذ تطوير Node.js | افتحها مؤقتًا للتصحيح، وأغلقها بعد النشر |

> ⚠️ **خطأ المبتدئ رقم 1:** التطبيق يعمل لكنك لا تستطيع الوصول إليه. في 90% من الحالات السبب هو أن مجموعة الأمان/جدار الحماية لا تسمح بذلك المنفذ.

---

# 4. ثلاثة سيناريوهات نشر نموذجية

## 4.1 السيناريو 1: نشر واجهة أمامية ثابتة (Vite/React/Vue)

بعد `npm run build`، تحصل على مجلد `dist/` يحتوي ملفات HTML/CSS/JS نقية.

**انقل الكود إلى الخادم:**

```bash
# الخيار أ: rsync من الجهاز المحلي
rsync -avz --exclude=node_modules ./dist/ yourname@YOUR-IP:/var/www/myapp/

# الخيار ب: git clone على الخادم (موصى به، تحديثات أسهل)
cd /var/www
sudo git clone https://github.com/YOUR_USER/YOUR_REPO.git myapp
cd myapp
npm install
npm run build
```

**تكوين Nginx:**

```bash
sudo vim /etc/nginx/sites-available/myapp
```

```nginx
server {
    listen 80;
    server_name YOUR-IP-OR-DOMAIN;

    root /var/www/myapp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # احتياطي توجيه SPA
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

فعّل الموقع:

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 4.2 السيناريو 2: نشر واجهة خلفية Node.js (Express/Fastify/NestJS)

استخدم **PM2** لإبقاء التطبيق يعمل في الخلفية:

```bash
npm install -g pm2
cd /path/to/your/app
npm install
npm run build  # إذا كنت تستخدم TypeScript
pm2 start dist/main.js --name "myapp"
pm2 startup && pm2 save  # بدء التشغيل التلقائي عند الإقلاع
pm2 logs myapp  # عرض السجلات
```

**وكيل عكسي عبر Nginx:**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 4.3 السيناريو 3: نشر حزمة كاملة عبر Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:pass@db:5432/myapp
    depends_on: [db, redis]
    restart: always

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./frontend/dist:/usr/share/nginx/html
    depends_on: [app]
    restart: always

volumes:
  postgres_data:
```

شغّله بالأمر: `docker compose up -d`

---

# 5. اسم النطاق و HTTPS

## 5.1 شراء اسم نطاق وضبط DNS

سجّل اسم نطاق عبر Namecheap أو Cloudflare Registrar أو GoDaddy أو AWS Route 53. في إعدادات DNS لاسم النطاق، أضف **سجلات A**:

| النوع | المضيف | القيمة |
|------|------|-------|
| A | @ | عنوان IP لخادمك |
| A | www | عنوان IP لخادمك |
| A | api | عنوان IP لخادمك (للواجهة الخلفية) |

## 5.2 HTTPS بنقرة واحدة مع Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
# اختر الخيار 2 (Redirect) لإعادة توجيه HTTP إلى HTTPS تلقائيًا
sudo certbot renew --dry-run  # اختبار التجديد التلقائي
```

---

# 6. نظرة متعمقة على خدمات موفري السحابة (ما بعد VPS)

عندما تسجل الدخول إلى لوحة AWS (أو أي لوحة تحكم سحابية)، سترى عشرات الخدمات بأسماء غامضة (EC2، S3، RDS، ELB، VPC...). يشرح هذا القسم أكثرها شيوعًا ومتى تستخدمها، **مع استخدام AWS كمثال أساسي** (المفاهيم تنطبق مباشرة على السحب الأخرى).

## 6.1 نظرة عامة على البنية السحابية

تطبيق ويب نموذجي يعمل على السحابة يبدو هكذا:

```
User → CloudFront (CDN) → ALB (Load Balancer) → EC2 (Your App Server)
                              │                     │
                              │                     ├── S3 (images/files)
                              │                     ├── RDS (database)
                              │                     └── ElastiCache (Redis)
                              │
                              └── ECS/EKS (containers, advanced)
                              
         └── Route 53 (DNS) → maps your domain to CloudFront/ALB
             + ACM (SSL certs) → HTTPS encryption
```

دعنا نستعرض كل خدمة.

## 6.2 الحوسبة: حيث يعمل كودك

### EC2 (Elastic Compute Cloud) — الـ VPS

هذا هو "الخادم السحابي" الذي استخدمناه. إنه جهاز افتراضي يمكنك الدخول إليه عبر SSH، وتثبيت أي شيء عليه، وتهيئته كيفما شئت.

- **Alibaba Cloud:** ECS
- **Tencent Cloud:** CVM / Lighthouse
- **DigitalOcean:** Droplet
- **Hetzner:** Cloud Server

**متى تستخدمه:** عندما تحتاج تحكمًا كاملًا، أو برامج مخصصة، أو عمليات دائمة التشغيل.

### Lambda — الدوال بدون خادم (Serverless)

ارفع مقتطفات الكود دون إدارة الخوادم. ادفع حسب الاستدعاء ووقت التنفيذ. يعمل فقط عند التشغيل.

- **Alibaba Cloud:** Function Compute
- **Tencent Cloud:** SCF (Serverless Cloud Function)
- **GCP:** Cloud Functions

**متى تستخدمه:** المهام العرضية (معالجات webhook، معالجة الصور، المهام المجدولة)، وواجهات API ذات حركة المرور المتقطعة. **ليس مناسبًا** للعمليات دائمة التشغيل مثل بوتات WebSocket.

### ECS/EKS — تنسيق الحاويات

إذا كان مشروعك يستخدم Docker ونما إلى حاويات/خدمات متعددة، استخدم Kubernetes للتنسيق.

- **AWS ECS:** خدمة الحاويات الأبسط من أمازون
- **AWS EKS:** Kubernetes مُدار
- **Alibaba Cloud:** ACK
- **Tencent Cloud:** TKE
- **Google Cloud:** GKE

**متى تستخدمه:** معماريات الخدمات الدقيقة متعددة الخدمات، والتوسع التلقائي، والمشاريع الجماعية. معظم المشاريع الشخصية لن تحتاجه — خادم VPS + Docker Compose كافٍ.

## 6.3 التخزين: أين تعيش الملفات والبيانات

### S3 (خدمة التخزين البسيط) ⭐ الأكثر استخدامًا

**هذه هي الخدمة الأكثر شيوعًا بعد الخوادم**، وتُستخدم لتخزين الصور والفيديوهات وملفات PDF وأصول المواقع الثابتة والنسخ الاحتياطية وغير ذلك. **لا تخزّن ملفات المستخدمين المرفوعة على القرص المحلي لخادمك!** ستُفقد إذا أعدت بناء الخادم أو نقلته أو غيّرت حجمه.

- **Alibaba Cloud:** OSS (Object Storage Service)
- **Tencent Cloud:** COS (Cloud Object Storage)
- **Google Cloud:** GCS (Google Cloud Storage)
- **بديل:** Cloudflare R2 (بدون رسوم خروج — صفقة رائعة!)

**الحصة المجانية:** تمنح AWS S3 تخزينًا قياسيًا 5 جيجابايت لمدة 12 شهرًا ضمن الحصة المجانية. تمنح Alibaba Cloud OSS المستخدمين الجدد 5 جيجابايت لمدة 6 أشهر. لدى Cloudflare R2 حصة مجانية دائمة مع تخزين 10 جيجابايت.

**ما يمكنك فعله بـ S3:**
- تخزين رفع المستخدمين (الصور الرمزية، الصور، المرفقات، صور المنتجات)
- استضافة مواقع ثابتة (ارفع مجلد `dist/`، وفعّل "استضافة المواقع الثابتة")
- نسخ احتياطية لتصدير قواعد البيانات
- الدمج مع CDN الخاص بـ CloudFront لتنزيلات عالمية سريعة
- توليد روابط موقعة مسبقًا لمشاركة الملفات الخاصة

**طريقة استخدام S3 (دليل لوحة AWS):**

1. انتقل إلى **لوحة S3** → **Create bucket**
2. أدخل اسم دلو **فريدًا عالميًا** (مثل `myapp-images`)
3. اختر منطقة AWS (مثل us-east-1 لشرق الولايات المتحدة)
4. **ملكية الكائنات:** اختر "ACLs enabled" → "Bucket owner preferred" (أبسط للوصول العام)
5. **ألغِ تحديد** "Block all public access" إذا أردت صورًا عامة (اقرأ التحذير، ألغِ التحديد فقط للمحتوى العام)
6. أبقِ الإعدادات الأخرى افتراضية → انقر على **Create bucket**
7. انقر على دلوك → **Upload** → اختر الملفات
8. بعد الرفع، يحصل كل ملف على عنوان URL مثل `https://myapp-images.s3.us-east-1.amazonaws.com/avatar.jpg`
9. استخدم هذا العنوان مباشرة في واجهتك الأمامية `<img src="...">`

**استخدام S3 مع الكود (مثال Node.js، اطلب من الذكاء الاصطناعي كتابة المنطق الكامل):**

```javascript
// npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });

async function uploadFile(buffer, filename, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: "myapp-images",
    Key: filename,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read" // اجعل الملف متاحًا للعموم
  }));
  return `https://myapp-images.s3.us-east-1.amazonaws.com/${filename}`;
}
```

> ⚠️ **ملاحظة أمنية حرجة:** مفاتيح وصول AWS تشبه كلمة مرور S3 الخاصة بك. **لا تضعها أبدًا في كود الواجهة الأمامية أو ترفعها إلى Git!** خزّنها في متغيرات البيئة أو استخدم أدوار IAM. إذا تسربت المفاتيح، عطّلها فورًا في لوحة IAM.

### EBS (Elastic Block Store) — الأقراص الصلبة الافتراضية

وحدات تخزين على مستوى الكتل تُلحق بمثيلات EC2 (مثل القرص الصلب في جهازك). تأتي مثيلات EC2 مع وحدة تخزين جذر (عادة 8-60 جيجابايت)؛ اشترِ وحدات EBS إضافية عندما تحتاج مساحة أكبر.

- **Alibaba Cloud:** Cloud Disk (ESSD/SSD)
- **Tencent Cloud:** CBS (Cloud Block Storage)

**متى تستخدمه:** مساحة قرص إضافية لخادمك، وبيانات تحتاج إلى البقاء مستقلة عن دورة حياة مثيل EC2.

### EFS (Elastic File System) — تخزين ملفات مشترك

نظام ملفات شبكي يمكن لمثيلات EC2 متعددة تركيبه في نفس الوقت. جيد لمشاركة الملفات المرفوعة بين خوادم ويب متعددة.

- **Alibaba Cloud:** NAS
- **Tencent Cloud:** CFS

معظم المشاريع الصغيرة لا تحتاجه — خادم واحد + S3 كافٍ.

## 6.4 قواعد البيانات: تخزين البيانات المنظمة

### RDS (خدمة قواعد البيانات العلائقية) ⭐ شائعة

**لا تشغّل قاعدة بيانات الإنتاج على نفس خادم VPS!** رغم أن هذا ممكن تقنيًا (فعلنا ذلك سابقًا في مثال Docker Compose)، استخدم للإنتاج قاعدة بيانات مُدارة: نسخ احتياطية تلقائية، وتوفر عالٍ، ومراقبة، وتوسيع بنقرة واحدة.

- **Alibaba Cloud:** RDS
- **Tencent Cloud:** TDSQL-C / CDB
- **Google Cloud:** Cloud SQL

**المحركات المدعومة:** MySQL، PostgreSQL، MariaDB، SQL Server، Oracle، و Amazon Aurora (متوافق مع MySQL/PostgreSQL، مُحسّن للسحابة).

**الحصة المجانية:** تمنح AWS RDS 750 ساعة/شهر من db.t2.micro أو db.t3.micro + 20 جيجابايت تخزين لمدة 12 شهرًا.

**طريقة إعداد RDS (AWS):**

1. انتقل إلى **RDS** → **Create database**
2. اختر **Standard create** → المحرك: **MySQL 8.0** أو PostgreSQL
3. القوالب: **Free tier** (للبقاء ضمن الحصة المجانية)
4. عيّن معرّف مثيل قاعدة البيانات، واسم المستخدم الرئيسي، وكلمة المرور الرئيسية
5. إعداد المثيل: **db.t3.micro** (مؤهل للحصة المجانية)
6. التخزين: 20 جيجابايت gp2 (مؤهل للحصة المجانية)
7. الاتصال: اختر **نفس VPC** الخاص بمثيل EC2 الخاص بك
8. **الوصول العام:** لا (اسمح بالوصول فقط من داخل VPC)
9. مجموعة أمان VPC: أنشئ جديدة، أو اختر مجموعة موجودة تسمح بالمنفذ 5432/3306 من مجموعة أمان EC2 الخاصة بك
10. انقر على **Create database** → انتظر ~5-10 دقائق
11. بمجرد توفره، احصل على **الـ Endpoint** (يبدو مثل `mydb.xxxxx.us-east-1.rds.amazonaws.com:3306`)
12. حدّث `DATABASE_URL` في تطبيقك ليُشير إلى هذا الـ Endpoint، وأضف مجموعة أمان EC2 الخاصة بك إلى قواعد الدخول لمجموعة أمان RDS

> 💡 **نصيحة vibecoding:** أخبر الذكاء الاصطناعي "لدي مثيل AWS RDS PostgreSQL في [endpoint]، مع المستخدم [username]، ساعدني في كتابة كود الاتصال وبرامج الترحيل لمشروع [my project]."

### ElastiCache — Redis/Memcached مُدار

تخزين مؤقت في الذاكرة للبيانات الساخنة (تقليل استعلامات قاعدة البيانات)، وتخزين الجلسات/الرموز، وطوابير الرسائل، ولوحات المتصدرين، إلخ.

- **Alibaba Cloud:** ApsaraDB for Redis
- **Tencent Cloud:** TencentDB for Redis
- **بديل:** Upstash (Redis Serverless، حصة مجانية متاحة)

للمشاريع الصغيرة يمكنك ببساطة تشغيل `sudo apt install redis-server` على VPS الخاص بك؛ واستخدم Redis مُدارًا للإنتاج/التوفر العالي.

## 6.5 الشبكات: وصول أسرع وأكثر أمانًا

### CloudFront — CDN (شبكة توصيل المحتوى) ⭐ شائعة

يخزّن أصولك الثابتة (الصور، CSS، JS، الفيديو) مؤقتًا في مواقع الحافة حول العالم بحيث يحصل المستخدمون على المحتوى من أقرب عقدة.

- **Alibaba Cloud:** CDN / DCDN
- **Tencent Cloud:** CDN / EdgeOne
- **Google Cloud:** Cloud CDN
- **بديل مجاني:** Cloudflare CDN (الخطة المجانية تشمل نطاقًا تردديًا غير محدود)

**متى تستخدمه:**
- المواقع التي تحتوي صورًا/فيديو/ملفات كبيرة
- مستخدمون موزعون على مناطق مختلفة
- تقليل تكاليف النطاق الترددي على خادمك الأصلي
- Cloudflare Pages أساسًا = CDN + استضافة ثابتة

**طريقة تكوين CloudFront:**
1. لوحة CloudFront → **Create distribution**
2. Origin domain: اختر دلو S3 الخاص بك أو ALB الخاص بـ EC2
3. سلوك التخزين المؤقت الافتراضي: إعادة توجيه HTTP إلى HTTPS
4. أنشئ التوزيع → انتظر ~5-15 دقيقة للنشر
5. وجّه DNS لاسم نطاقك إلى اسم مجال توزيع CloudFront (مثل `dxxx.cloudfront.net`) عبر سجل CNAME

### ELB (Elastic Load Balancing) — موازن التحميل

يوزع حركة المرور الواردة على مثيلات EC2 متعددة، ويزيل المثيلات غير الصحية تلقائيًا.

- **ALB (Application Load Balancer):** الطبقة 7 (HTTP/HTTPS)، توجيه قائم على المسار، الأكثر شيوعًا لتطبيقات الويب
- **NLB (Network Load Balancer):** الطبقة 4 (TCP/UDP)، زمن استجابة منخفض للغاية
- **GLB (Gateway Load Balancer):** للأجهزة الافتراضية الشبكية
- **Alibaba Cloud:** SLB / ALB
- **Tencent Cloud:** CLB

المشاريع ذات الخادم الواحد لا تحتاجه. استخدمه عندما تتوسع إلى خوادم خلفية متعددة.

### Route 53 — خدمة DNS

يحوّل أسماء النطاقات إلى عناوين IP. معظم مسجلي النطاقات يشملون DNS مجانيًا، لكن Route 53 متكامل بعمق مع AWS.

- **Alibaba Cloud:** Alibaba Cloud DNS
- **Tencent Cloud:** DNSPod
- **بديل مجاني:** Cloudflare DNS (من الأسرع عالميًا، مجاني تمامًا)

**أنواع سجلات DNS الشائعة:**

| النوع | الغرض | مثال |
|------|---------|---------|
| **A** | النطاق → عنوان IPv4 | `@ → 54.123.45.67` |
| **AAAA** | النطاق → عنوان IPv6 | `@ → 2600:xxxx::` |
| **CNAME** | النطاق → نطاق آخر (يُستخدم لـ CDN) | `static → dxxx.cloudfront.net` |
| **MX** | خادم البريد (مطلوب للبريد التجاري) | - |
| **TXT** | نص عشوائي (التحقق من النطاق، SPF/DKIM) | - |

### ACM (AWS Certificate Manager) — شهادات SSL مجانية

توفر AWS شهادات SSL/TLS مجانية تتجدد تلقائيًا عند استخدامها مع CloudFront أو ALB. فقط اطلب شهادة، وتحقق عبر DNS أو البريد الإلكتروني، وأرفقها بالتوزيع/موازن التحميل الخاص بك.

- **Alibaba Cloud:** شهادات SSL مجانية
- **Tencent Cloud:** شهادات SSL مجانية
- **خيار مجاني شامل:** Certbot + Let's Encrypt (الطريقة التي عرضناها في القسم 5، تجديد تلقائي كل 90 يومًا)

### VPC (Virtual Private Cloud) — السحابة الخاصة الافتراضية

شبكة معزولة على AWS حيث تعيش مثيلات EC2 و RDS والموارد الأخرى. يحصل الحساب الجديد على VPC افتراضي. الاستخدام المتقدم (فصل الشبكات الفرعية العامة/الخاصة، بوابات NAT) يتطلب دراسة أعمق.

## 6.6 خدمات شائعة أخرى

### تسجيل النطاقات

- **عالميًا:** Namecheap، Cloudflare Registrar (خصوصية WHOIS مجانية)، GoDaddy
- **AWS:** Route 53 (يقوم بالتسجيل أيضًا)
- **الصين:** Alibaba Cloud Wanwang، Tencent Cloud DNSPod (مطلوب لـ ICP)

### SES (Simple Email Service) — إرسال البريد الإلكتروني

لا تشغّل خادم بريد خاص بك (غالبًا سينتهي بك الأمر في البريد العشوائي). استخدم خدمة بريد احترافية.

- **AWS SES**، SendGrid، Mailgun، Resend
- **الصين:** Alibaba Cloud Direct Mail، Tencent SES
- الاستخدامات: رسائل التحقق، الإشعارات، رسائل التسويق

### SNS (Simple Notification Service) — إشعارات SMS/دفع

للرسائل النصية وإشعارات الدفع للجوال. Twilio هو البديل العالمي الشهير للرسائل النصية.

### CloudWatch — المراقبة والسجلات

راقب CPU/الذاكرة/القرص لمثيلات EC2، واعرض سجلات التطبيق، وأعد تنبيهات (ارتفاع CPU، توقف الخدمة).

- **Alibaba Cloud:** Cloud Monitor + SLS (Log Service)
- **Tencent Cloud:** Cloud Monitor + CLS
- **بديل للمبتدئين:** مراقبة PM2 المدمجة + Uptime Kuma (مفتوح المصدر، حاوية Docker واحدة لتشغيله)

### S3 المتقدم: معالجة الصور / مشغلات Lambda

يمكن لـ S3 تشغيل دوال Lambda تلقائيًا عند رفع الملفات. على سبيل المثال، عندما يرفع مستخدم صورة كبيرة، يمكن لدالة Lambda تغيير حجمها إلى صور مصغرة تلقائيًا. في الصين، لدى Alibaba OSS معالجة صور مدمجة (أضف `?x-oss-process=image/resize,w_300` إلى عناوين URL) ولدى Tencent COS خدمة Cloud Infinite (CI) لميزات مشابهة.

## 6.7 خريطة تطابق الخدمات السحابية: AWS ↔ السحب الصينية ↔ البدائل

مرجع سريع لإيجاد الخدمات المكافئة:

| الفئة | AWS | Alibaba Cloud | Tencent Cloud | البديل المجاني/الميسور |
|----------|-----|--------------|---------------|------------------------|
| الخوادم السحابية | EC2 | ECS | CVM / Lighthouse | DigitalOcean / Vultr / Hetzner |
| تخزين الكائنات | S3 | OSS | COS | Cloudflare R2 (بدون رسوم خروج) |
| قاعدة البيانات العلائقية | RDS | RDS | TDSQL-C/CDB | Supabase / Neon |
| تخزين Redis المؤقت | ElastiCache | ApsaraDB Redis | TencentDB Redis | Upstash |
| CDN | CloudFront | CDN/DCDN | CDN/EdgeOne | Cloudflare CDN (مجاني) |
| موازن التحميل | ALB/NLB | SLB/ALB | CLB | Nginx ذاتي الاستضافة / Caddy |
| Serverless | Lambda | Function Compute | SCF | Cloudflare Workers |
| الحاويات/K8s | ECS/EKS | ACK | TKE | Fly.io / Railway |
| DNS | Route 53 | Alibaba Cloud DNS | DNSPod | Cloudflare DNS (مجاني) |
| شهادات SSL | ACM (مجاني) | شهادات مجانية | شهادات مجانية | Let's Encrypt (مجاني) |
| البريد الإلكتروني | SES | Direct Mail | SES | Resend / حصة SendGrid المجانية |
| SMS | SNS | SMS | SMS | Twilio |
| المراقبة | CloudWatch | Cloud Monitor | Cloud Monitor | Uptime Kuma (ذاتي الاستضافة) |
| واجهات AI/ML | Bedrock | Tongyi Qianwen/Bailian | Hunyuan/TI | OpenAI / Anthropic API |
| تسجيل النطاقات | Route 53 | Wanwang | DNSPod | Namecheap / Cloudflare |

## 6.8 أسئلة المبتدئين الشائعة

**س: هل أستخدم الخدمات السحابية المُدارة أم أستضيف كل شيء بنفسي على VPS؟**

- **المشاريع الشخصية / التعلم:** استضف بنفسك على VPS (كل شيء عبر Docker Compose) — أرخص وتتعلم أكثر.
- **الإنتاج مع مستخدمين حقيقيين:** استخدم الخدمات المُدارة لقواعد البيانات وتخزين الكائنات (نسخ احتياطي تلقائي، استقرار)، ويمكن أن يبقى التطبيق على VPS.
- **المشاريع الممولة جيدًا/الجماعية:** استخدم الخدمات السحابية المُدارة قدر الإمكان — اقضِ وقتك في منطق الأعمال، لا في التشغيل.

**س: كيف أستخدم الحصة المجانية من AWS دون أن يُفرض عليّ الدفع؟**

1. شغّل دائمًا مثيلات **t2.micro/t3.micro** (الموسومة "Free tier eligible")
2. أعد **تنبيه فوترة** بقيمة 0$ أو 1$ (Billing Dashboard → Budgets → Create budget)
3. **أنهِ/احذف** الموارد عند الانتهاء: مثيلات EC2، وقواعد بيانات RDS، ودلاء S3، ووحدات EBS، وعناوين IP المرنة
4. لاحظ أن وحدات EBS وعناوين IP المرنة **تستمر في التحصيل حتى عند إيقاف المثيل** إذا لم تُحذف
5. تحقق من لوحة الفوترة شهريًا

**س: AWS مقابل مزودي VPS الآخرين؟**

- تعلم نظام AWS البيئي / الاستعداد لوظائف السحابة → استخدم الحصة المجانية من AWS
- نشر سريع، مشاريع بسيطة، أقل تكلفة → DigitalOcean (4$/شهر) أو Hetzner (3.49€/شهر)
- الاختبار بالساعة → Vultr (فوترة بالساعة، دمره في أي وقت)
- أعباء عمل AI/GPU → Modal أو Lambda Labs
- حاوية مجانية تمامًا تعمل 24/7 → الحصة المجانية من Fly.io

---

# 7. منصات نشر مخصصة لوكلاء الذكاء الاصطناعي

إذا كنت تنشر وكلاء ذكاء اصطناعي (وليس مجرد تطبيقات ويب عادية)، فهناك منصات مصممة خصيصًا لأعباء عمل الذكاء الاصطناعي:

## 7.1 Modal — GPU Serverless للذكاء الاصطناعي/تعلم الآلة في Python

**الموقع:** https://modal.com

**الأنسب لـ:** مشاريع الذكاء الاصطناعي في Python التي تحتاج استدلال GPU، والمهام المجدولة، ومعالجة البيانات الدفعية

**الميزات:**
- عرّف الدوال بمزخرفات Python، و`modal deploy` لنشر بأمر واحد
- بداية باردة لحاويات GPU ~ثانية واحدة، فوترة بالمللي ثانية
- جدولة مدمجة، وإدارة أسرار، وتخزين مشترك
- الخطة المجانية تشمل رصيد 30$/شهر (كافٍ لمعظم المشاريع الشخصية)
- يدعم Python فقط

```python
import modal
app = modal.App("my-ai-agent")

@app.function(gpu="A10G", timeout=300)
def run_agent(prompt: str):
    # شغّل نموذج/وكيل الذكاء الاصطناعي هنا
    return result
```

## 7.2 Hugging Face Spaces — الخيار الأول لعروض الذكاء الاصطناعي

**الموقع:** https://huggingface.co/spaces

**الأنسب لـ:** عرض عروض الذكاء الاصطناعي بسرعة (واجهة Gradio/Streamlit)، وعرض النماذج مفتوحة المصدر

**الميزات:**
- مثيلات CPU صغيرة مجانية؛ GPU متاح بالدفع
- يدعم Gradio و Streamlit و Docker
- مجتمع نشط؛ كل Space لديه كود عام ومناقشات
- انسخ Spaces الآخرين بنقرة واحدة للتعديل

## 7.3 Replicate — حوّل النماذج إلى واجهات API

**الموقع:** https://replicate.com

**الأنسب لـ:** تحويل نماذج الذكاء الاصطناعي إلى واجهات HTTP قابلة للاستدعاء دون إدارة الخوادم

ادفع نموذجك، وتقوم Replicate بتغليفه في واجهة HTTP ويُحصّل لكل استدعاء. رائع لنشر النماذج المضبوطة بدقة.

## 7.4 Lambda Labs — مثيلات GPU عند الطلب

**الموقع:** https://lambdalabs.com

**الأنسب لـ:** التدريب والاستدلال المكثف بوحدات GPU بتكلفة أقل من مثيلات GPU في AWS/GCP. A100 و H100 و A10 متاحة عند الطلب.

---

# 8. 🎯 سير عمل نشر Vibecoding: اجعل الذكاء الاصطناعي مهندس التشغيل الخاص بك

هذه هي أهم عقلية لنشر عصر vibecoding: **لست بحاجة إلى حفظ كل أمر — الذكاء الاصطناعي هو مساعد التشغيل لديك.**

## 8.1 وضعان للتعاون مع الذكاء الاصطناعي

**الوضع 1: توليد البرامج النصية محليًا، والتنفيذ يدويًا**

أخبر مساعد البرمجة بالذكاء الاصطناعي (Claude Code، Trae Solo، Cursor):

> "أريد نشر [وصف المشروع] على [المنصة/الخادم]. ولّد:
> 1. قائمة فحص كاملة للنشر خطوة بخطوة
> 2. جميع ملفات الإعداد اللازمة (Nginx، PM2، Dockerfile، docker-compose)
> 3. برنامج نشر deploy.sh
> 4. قائمة فحص متغيرات البيئة"

ثم نفّذ فقط ما يولده الذكاء الاصطناعي.

**الوضع 2: دخول الذكاء الاصطناعي مباشرة إلى خادمك عبر SSH (أسهل)**

يدعم Claude Code عمليات SSH عن بُعد:

```bash
claude
# أخبره:
# "ادخل عبر SSH إلى root@MY-IP وانشر /root/myapp، وكون Nginx + HTTPS + PM2"
```

سيتحقق الذكاء الاصطناعي تلقائيًا من البيئة، ويثبّت الاعتماديات المفقودة، ويسحب الكود، ويبني، ويُكوّن، ويتحقق — كل ذلك دون أن تكتب أوامر يدويًا.

> ⚠️ **تذكيرات السلامة:**
> - تدرّب على خادم اختبار أولاً للتأكد من أن الذكاء الاصطناعي لن يجري تغييرات مدمرة
> - خذ نسخًا احتياطية منتظمة للبيانات المهمة
> - أعطِ الذكاء الاصطناعي مستخدمًا بأقل الصلاحيات (لا تعطه الجذر؛ مستخدم sudo مقبول، لكن راقب الأوامر)
> - قبل أن ينفذ الذكاء الاصطناعي أوامر خطيرة، راجع ما ينوي فعله

## 8.2 قالب مطالبة النشر الشامل

أيًا كانت المنصة/الخادم الذي تختاره، املأ هذا وأرسله إلى الذكاء الاصطناعي للحصول على خطة كاملة قابلة للتنفيذ:

```
Help me deploy a project with the following info:

[DEPLOYMENT TARGET]
- Platform/Server: [Vercel / Railway / Fly.io / Ubuntu 22.04 VPS / AWS EC2 / ...]
- Server IP (if VPS): xxx.xxx.xxx.xxx
- Already configured: [SSH key login / Docker installed / Nginx installed / ...]

[PROJECT INFO]
- Project type: [Next.js 14 / Vite+React / Node.js Express / Python FastAPI / ...]
- Code location: GitHub repo https://github.com/xxx/xxx
- Tech stack: Node.js 20 + PostgreSQL 16 + Redis 7
- Start command: npm run start
- Listens on port: 3000
- Environment variables: DATABASE_URL=xxx, JWT_SECRET=xxx, OPENAI_API_KEY=xxx

[DOMAIN]
- Domain: mydomain.com
- DNS already pointing to server: Yes/No
- Need HTTPS: Yes/No

[REQUIREMENTS]
1. Complete steps (list local vs server operations separately)
2. Provide all config files
3. Tell me how to verify successful deployment
4. List common gotchas and troubleshooting steps
```

## 8.3 سير عمل استكشاف الأخطاء بمساعدة الذكاء الاصطناعي

عندما تتعطل الأشياء:

1. **افحص السجلات أولاً:**
   - Nginx: `sudo tail -50 /var/log/nginx/error.log`
   - PM2: `pm2 logs myapp`
   - Docker: `docker compose logs app`
   - systemd: `sudo journalctl -u myapp -n 50`

2. **انسخ الخطأ الكامل إلى الذكاء الاصطناعي** مع السياق:
   > "أنا أنشر Node.js على Ubuntu وأحصل على 502 Bad Gateway. سجل أخطاء Nginx: [الصق]. الإعداد: [الصق]. حالة PM2: [الصق]. ساعدني في التصحيح."

3. **مرجع سريع للمشكلات الشائعة:**
   - **502 Bad Gateway:** الواجهة الخلفية لا تعمل، أو المنفذ خاطئ، أو proxy_pass غير صحيح
   - **لا يمكن الوصول إلى IP:** مجموعة الأمان لا تسمح بالمنفذ، أو ufw يحظر، أو Nginx لم يبدأ
   - **التحديث يعطي 404:** Nginx يفتقد `try_files` لتوجيه SPA
   - **الأصول الثابتة 404:** مسار الجذر خاطئ، أو صلاحيات الملفات
   - **فشل شهادة HTTPS:** النطاق لا يُشير إلى الخادم، أو المنفذ 80 محظور
   - **PM2 يعيد التشغيل باستمرار:** خطأ في الكود يسبب الانهيار، تحقق من `pm2 logs`
   - **مهلة دالة Vercel:** تجاوزت حد 10 ثوانٍ — انتقل إلى Fly.io/Railway/VPS للمهام الطويلة
   - **Railway/Render 503:** الخدمة نائمة أو نفد الرصيد
   - **رفض اتصال AWS EC2:** مجموعة الأمان تفتقد قاعدة SSH أو المنفذ خاطئ

---

# 9. نصائح ما بعد النشر

## 9.1 نقل الملفات

```bash
# من المحلي إلى الخادم
scp ./file.zip yourname@IP:/home/yourname/
scp -r ./dir yourname@IP:/home/yourname/

# من الخادم إلى المحلي
scp yourname@IP:/home/yourname/file.zip ./

# rsync (مزامنة تدريجية، موصى بها للنشر)
rsync -avz --exclude=node_modules --exclude=.git ./project/ yourname@IP:/var/www/project/
```

## 9.2 برنامج تحديث بأمر واحد

أنشئ `deploy.sh` على خادمك:

```bash
#!/bin/bash
set -e
cd /path/to/project
git pull origin main
npm install
npm run build
pm2 restart myapp
echo "✅ Deployment complete!"
```

التحديثات هي مجرد `bash deploy.sh`. للأتمتة الكاملة، أعد إعداد GitHub Actions (اطلب من الذكاء الاصطناعي كتابة إعداد CI/CD) بحيث تُنشر التغييرات تلقائيًا عند الدفع إلى main.

## 9.3 قائمة فحص تقوية الأمان

اطلب من الذكاء الاصطناعي توليد برنامج تقوية كامل، والذي يتضمن عادةً:
- تعطيل تسجيل الدخول بكلمة المرور، واستخدام مفاتيح SSH فقط
- تغيير منفذ SSH الافتراضي (22 → منفذ آخر)
- تثبيت fail2ban (الحظر التلقائي لعناوين IP التي تحاول اختراق النظام)
- تفعيل التحديثات الأمنية التلقائية: `sudo apt install unattended-upgrades`
- عدم رفع الأسرار/ملفات .env إلى Git أبدًا
- جدولة نسخ احتياطية منتظمة لقاعدة البيانات إلى S3

---

# 10. ملخص الفصل

**ملخص خيارات النشر:**

| السيناريو | الموصى به | التكلفة | الصعوبة |
|----------|------------|------|-----------|
| واجهة أمامية/مستندات فقط | Cloudflare Pages / Vercel / GitHub Pages | مجاني | ⭐ |
| Next.js كامل (استجابة سريعة) | Vercel | مجاني / 20$ شهريًا | ⭐ |
| واجهة خلفية / بوت (دائم التشغيل) | Railway / Fly.io (مجاني) / VPS | 0-10$ شهريًا | ⭐⭐ |
| حزمة كاملة (تحكم كامل) | DigitalOcean / Vultr / AWS EC2 + Docker | 4-10$ شهريًا | ⭐⭐⭐ |
| عروض وكلاء الذكاء الاصطناعي | Hugging Face Spaces | مجاني | ⭐ |
| استدلال AI على GPU | Modal (عالمي) | رصيد 0-30$/شهر | ⭐⭐ |
| إنتاج مع مستخدمين | الخدمات المُدارة من AWS/Azure/GCP | متغير | ⭐⭐⭐ |

**تذكّر الخطوات الخمس الأساسية:**
1. **اختر منصة** → بناءً على نوع مشروعك (استخدم الجدول أعلاه)
2. **انقل الكود إلى هناك** → git push / rsync / نشر GitHub التلقائي
3. **جهّز البيئة** → ثبّت Node.js/Nginx/Docker (أو تتولى المنصة ذلك)
4. **أبقِه يعمل** → PM2 / Docker / systemd
5. **النطاق + HTTPS** → سجلات DNS + Certbot / ACM

**عقلية vibecoding:**
1. افهم *ما* الذي يجب إنجازه، وليس كل أمر
2. صِف المتطلبات بوضوح للذكاء الاصطناعي — سيعطيك حلولًا كاملة
3. افهم ما يفعله الذكاء الاصطناعي، وأكّد الخطوات الأساسية
4. عند حدوث أخطاء، الصق السجلات للذكاء الاصطناعي — سيشخص 90% من المشكلات
5. خذ نسخًا احتياطية للبيانات المهمة، واستخدم أقل الصلاحيات

انشر مرة واحدة وستدرك — أن تصبح متاحًا على الإنترنت ليس بالأمر الصعب. 🎯

---

<RelatedArticlesSection
  :articles="relatedArticlesMap['ar-sa/stage-2/backend/cloud-server-deployment']"
  title="مقالات ذات صلة"
  description="استمر في تعلم المهارات الهندسية حول النشر."
/>
