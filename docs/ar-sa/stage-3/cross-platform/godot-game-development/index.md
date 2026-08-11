---
title: 'إنشاء ألعاب منصات وPixel Art وثلاثية الأبعاد باستخدام Godot'
description: 'تعلّم Godot عبر ثلاثة نماذج شُغّلت فعليًا ومراجع من ألعاب منشورة.'
---

# إنشاء ألعاب منصات وPixel Art وثلاثية الأبعاد باستخدام Godot

Godot محرك ألعاب مجاني ومفتوح المصدر يجمع المشاهد والفيزياء والتحريك والصوت والبرمجة والتصدير. لا نزعم إكمال ثلاث ألعاب؛ بل نشغّل نموذج منصات 2D وجمع Pixel Art وGreybox ثلاثي الأبعاد.

## 1. أربعة مفاهيم

العقدة تؤدي مهمة واحدة، والمشهد شجرة عقد قابلة لإعادة الاستخدام، والسكريبت يضيف السلوك، وGDScript لغة Godot الأساسية.

![محرر Godot](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-editor-platformer.png)

## 2. لعبة منصات 2D

يوضح Primal Light المنصات والخطر والهدف بصورة سهلة القراءة.

![Primal Light](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-primal-light.webp)

> أنشئ لاعبًا وأرضًا وثلاث منصات وهدفًا واضحًا بأشكال بسيطة.

> أضف الحركة الجانبية والقفز دون قفزة ثانية في الهواء.

![Skyline Courier](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-platformer.png)

## 3. حلقة Pixel Art

يرتب Dome Keeper الموارد والهدف في شاشة صغيرة بوضوح.

![Dome Keeper](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-dome-keeper.webp)

> أنشئ مشهدًا 320 × 180 مع لاعب وغابة وثلاث قطع ومؤشر عدد.

![Lantern Woods](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-pixel.png)

استخدم تكبيرًا صحيحًا حتى لا تصبح البكسلات ضبابية.

## 4. Greybox ثلاثي الأبعاد

يفيد Wrought Flesh في فهم شكل المكان والضوء والتوجيه. يختبر Greybox الحجم والحركة بالصناديق قبل النماذج النهائية.

![Wrought Flesh](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-wrought-flesh.webp)

> أنشئ أرضًا وجدرانًا ولاعبًا وكاميرا ومخرجًا مضيئًا في Greybox صغير.

![Signal Garden](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-3d.png)

## 5. تعديل واحد كل مرة

> أضف الحركة فقط ولا تغيّر المستوى.

> أصلح هذا الخطأ فقط: 【ألصق الخطأ】 واشرح إعادة الاختبار.

## 6. التصدير مرحلة مستقلة

ثبّت Export Templates المطابقة وأنشئ preset. اختبر سطح المكتب على جهاز بلا Godot، والويب عبر خادم أو HTTPS، وAndroid/iOS باستخدام SDK والتوقيع والجهاز.

شُغّلت النماذج الثلاثة على macOS باستخدام Godot 4.7.1. لا نعلن اكتمال تصدير Windows أو Linux أو Web أو Android أو iOS أو أجهزة الألعاب.
