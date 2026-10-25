(function () {
  "use strict";

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));

  const assistantAvatar = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2.8c.8 4.6 2.2 6 6.8 6.8-4.6.8-6 2.2-6.8 6.8-.8-4.6-2.2-6-6.8-6.8 4.6-.8 6-2.2 6.8-6.8Z" fill="currentColor"/><path d="M19 15.2c.4 2.2 1.1 2.9 3.3 3.3-2.2.4-2.9 1.1-3.3 3.3-.4-2.2-1.1-2.9-3.3-3.3 2.2-.4 2.9-1.1 3.3-3.3Z" fill="currentColor" opacity=".65"/></svg>';

  const state = {
    busy: false,
    messages: [],
    activeConversation: null
  };

  const elements = {
    html: document.documentElement,
    chat: $("#chat"),
    welcome: $("#welcome"),
    messages: $("#messages"),
    input: $("#input"),
    composer: $("#composer"),
    sendBtn: $("#sendBtn"),
    historyList: $("#historyList"),
    sidebar: $("#sidebar"),
    scrim: $("#scrim"),
    toast: $("#toast")
  };

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));

  function renderMarkdown(markdown) {
    const blocks = [];
    let source = String(markdown).replace(/```([a-zA-Z0-9+#-]*)\n([\s\S]*?)```/g, (_, language, code) => {
      const index = blocks.length;
      blocks.push(
        '<div class="code-block"><div class="code-head"><span>' +
        escapeHtml(language || "code") +
        '</span><button class="copy-code" type="button">نسخ</button></div><pre><code>' +
        escapeHtml(code.replace(/\n$/, "")) +
        "</code></pre></div>"
      );
      return "\u0000" + index + "\u0000";
    });

    source = escapeHtml(source);
    source = source.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    source = source.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
    source = source.replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>");

    const lines = source.split("\n");
    const output = [];
    let listType = null;
    let paragraph = [];

    const closeList = () => {
      if (listType) {
        output.push("</" + listType + ">");
        listType = null;
      }
    };
    const flushParagraph = () => {
      if (paragraph.length) {
        output.push("<p>" + paragraph.join("<br>") + "</p>");
        paragraph = [];
      }
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
      const unordered = trimmed.match(/^[-•]\s+(.+)$/);
      const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
      const quote = trimmed.match(/^>\s?(.+)$/);

      if (!trimmed) {
        flushParagraph();
        closeList();
        return;
      }
      if (/^\u0000\d+\u0000$/.test(trimmed)) {
        flushParagraph();
        closeList();
        output.push(trimmed);
        return;
      }
      if (heading) {
        flushParagraph();
        closeList();
        const level = heading[1].length + 1;
        output.push("<h" + level + ">" + heading[2] + "</h" + level + ">");
        return;
      }
      if (unordered || ordered) {
        flushParagraph();
        const type = unordered ? "ul" : "ol";
        if (listType !== type) {
          closeList();
          output.push("<" + type + ">");
          listType = type;
        }
        output.push("<li>" + (unordered ? unordered[1] : ordered[1]) + "</li>");
        return;
      }
      if (quote) {
        flushParagraph();
        closeList();
        output.push("<blockquote>" + quote[1] + "</blockquote>");
        return;
      }
      closeList();
      paragraph.push(trimmed);
    });

    flushParagraph();
    closeList();

    return output.join("").replace(/\u0000(\d+)\u0000/g, (_, index) => blocks[Number(index)]);
  }

  function normalize(text) {
    return String(text)
      .toLowerCase()
      .replace(/[\u064B-\u0652\u0640]/g, "")
      .replace(/[إأآٱ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/\s+/g, " ")
      .trim();
  }

  function mathAnswer(text) {
    const match = text.replace(/[×x]/gi, "*").replace(/÷/g, "/").match(/(-?\d[\d\s+\-*/().^%]*)/);
    if (!match) return null;
    const expression = match[1].trim();
    if (!/[+\-*/^%]/.test(expression) || !/\d/.test(expression)) return null;
    if (!/^[\d\s+\-*/().^%]+$/.test(expression)) return null;
    try {
      const value = Function('"use strict";return (' + expression.replace(/\^/g, "**") + ")")();
      if (typeof value !== "number" || !Number.isFinite(value)) return null;
      const rounded = Math.round(value * 1e6) / 1e6;
      return "## النتيجة\n\n`" + expression + " = " + rounded + "`\n\n### كيف وصلت إليها؟\n- طبّقت ترتيب العمليات الحسابية: الأقواس، ثم الأس، ثم الضرب والقسمة، ثم الجمع والطرح.\n- الناتج النهائي هو **" + rounded + "**.\n\nهل تريد شرحًا خطوة بخطوة لطريقة الحل؟";
    } catch (error) {
      return null;
    }
  }

  function generateReply(text) {
    const normalized = normalize(text);
    const math = mathAnswer(text);
    if (math) return math;

    if (/^(اهلا|هلا|مرحبا|السلام عليكم|صباح الخير|مساء الخير|hi|hello|hey)\b/.test(normalized)) {
      return "أهلًا بك! سعيد بوجودك هنا.\n\nأستطيع مساعدتك في:\n- **الكتابة والصياغة**: رسائل، مقالات، منشورات، وسير ذاتية.\n- **التحليل**: قراءة البيانات، تلخيص التقارير، واستخراج القرارات.\n- **البرمجة**: كتابة الكود، شرح الأخطاء، وتحسين الأداء.\n- **الإبداع**: أفكار حملات، أسماء منتجات، وسيناريوهات محتوى.\n\nما الذي تريد أن نبدأ به؟";
    }

    if (/(من انت|من أنت|عرف بنفسك|ماذا تستطيع)/.test(normalized)) {
      return "## أنا ذكاء\n\nمساعد ذكاء اصطناعي عربي مصمم لمساعدتك على التفكير والعمل بشكل أسرع. أعمل بأسلوب حواري واضح، وأقدّم إجابات منظمة قابلة للتنفيذ.\n\n### ما يميزني\n- **فهم عميق للعربية** مع الحفاظ على المصطلحات التقنية.\n- **مخرجات عملية**: خطوات، قوالب، وأمثلة جاهزة.\n- **تنوع المهام**: من كتابة بريد قصير إلى تصميم خطة تسويق كاملة.\n\nاطرح سؤالك مباشرة، أو اختر أحد الاقتراحات في الشاشة الرئيسية.";
    }

    if (/(كود|برمج|برمجه|جافاسكريبت|javascript|python|react|دالة|خوارزم|خطا|bug|api|sql|html|css)/.test(normalized)) {
      return "## حل عملي خطوة بخطوة\n\nسأفترض أنك تريد مثالًا واضحًا يمكنك تجربته فورًا. إليك هيكلًا بسيطًا وقابلًا للتوسع:\n\n```js\nasync function fetchData(url, options = {}) {\n  const response = await fetch(url, {\n    ...options,\n    headers: { \"Content-Type\": \"application/json\", ...options.headers }\n  });\n\n  if (!response.ok) {\n    throw new Error(`Request failed: ${response.status}`);\n  }\n\n  return response.json();\n}\n```\n\n### ما الذي يجعله جيدًا؟\n1. **فصل المسؤوليات**: دالة واحدة تتولى جلب البيانات والتحقق من الاستجابة.\n2. **معالجة الأخطاء**: لا تفترض أن كل طلب سينجح.\n3. **قابلية التوسع**: يمكنك تمرير خيارات إضافية دون تعديل الدالة.\n\n### الخطوة التالية\n- أضف `AbortController` لإنهاء الطلبات الطويلة.\n- أضف إعادة المحاولة مع تأخير متزايد للأخطاء المؤقتة.\n- اكتب اختبارًا يحاكي استجابة ناجحة وأخرى فاشلة.\n\nأرسل لي الكود الحالي أو رسالة الخطأ وسأشخّص المشكلة بدقة.";
    }

    if (/(تسويق|حمله|علامه تجاريه|اعلان|سوق|مبيعات|منتج|اطلاق|إطلاق)/.test(normalized)) {
      return "## خطة تسويق في 30 يومًا\n\n### الأسبوع الأول: التأسيس\n- حدّد الجمهور الأساسي في جملة واحدة: **من هو، وما المشكلة التي يحلها المنتج؟**\n- صغ رسالة قيمة واضحة: النتيجة، الوقت، والدليل.\n- جهّز أصولًا أساسية: صفحة هبوط، شعار، 5 منشورات، وفيديو تعريفي قصير.\n\n### الأسبوع الثاني: الإطلاق التجريبي\n- شغّل حملة إنفاق صغير على قناتين فقط لقياس التفاعل.\n- اجمع 20–30 ملاحظة من المستخدمين الأوائل.\n- حسّن صفحة الهبوط بناءً على أكثر الاعتراضات تكرارًا.\n\n### الأسبوع الثالث: التوسع\n- ضاعف الميزانية على القناة الأعلى كفاءة.\n- أطلق برنامج إحالة بسيطًا: مكافأة للطرفين.\n- انشر 3 قصص نجاح حقيقية بدل الإعلانات المباشرة.\n\n### الأسبوع الرابع: القياس والتحسين\n- راقب **CAC** و**معدل التحويل** و**الاحتفاظ بعد 7 أيام**.\n- أوقف كل قناة تتجاوز تكلفتها الحد المستهدف.\n- وثّق ما نجح في دليل تشغيل قابل للتكرار.\n\n**مؤشر النجاح:** معدل تحويل لا يقل عن 3% وتكلفة اكتساب أقل من 25% من قيمة العميل.\n\nهل تريد أن أحوّل الخطة إلى جدول أسبوعي مفصل مع الميزانية؟";
    }

    if (/(بيانات|تحليل|احصائ|احصاء|مؤشر|تقرير|لوحه|dashboard)/.test(normalized)) {
      return "## إطار لتحليل البيانات\n\n### 1. تحديد السؤال\nابدأ بسؤال واحد قابل للقياس، مثل: **أي شريحة تحقق أعلى إيراد لكل عميل؟**\n\n### 2. تنظيم البيانات\n- نظّف القيم المفقودة والمكررة.\n- وحّد الوحدات والتواريخ.\n- افصل البيانات إلى: عملاء، معاملات، وتسويق.\n\n### 3. التحليل\n- **الاتجاه**: كيف يتغير المؤشر خلال 6–12 شهرًا؟\n- **التوزيع**: هل النتائج مركزة في شريحة صغيرة؟\n- **الارتباط**: ما المتغيرات التي تتحرك معًا؟\n- **السيناريو**: ماذا يحدث إذا انخفض التحويل 10%؟\n\n### 4. المخرجات\n| الأولوية | الفرصة | الأثر المتوقع |\n| --- | --- | --- |\n| عالية | إعادة استهداف العملاء الحاليين | زيادة الإيراد 12–18% |\n| متوسطة | تحسين صفحة الأسعار | رفع التحويل 5–8% |\n| منخفضة | تجربة قناة جديدة | تعلم سريع بتكلفة منخفضة |\n\n**تحذير:** الارتباط لا يعني السببية. تحقق من النتائج بتجربة مضبوطة قبل اتخاذ قرار كبير.\n\nأرفق وصف الأعمدة المتاحة وسأقترح تحليلًا مخصصًا لها.";
    }

    if (/(فكره|افكار|ابداع|محتوي|تصميم|حمله اعلانيه|سوشيال|تيك توك|انستقرام)/.test(normalized)) {
      return "## ست أفكار إبداعية قابلة للتنفيذ\n\n1. **سلسلة «قبل وبعد»**: اعرض تحولًا حقيقيًا في 15 ثانية، مع تعليق صوتي قصير.\n2. **تحدي المستخدم**: اطلب من الجمهور تجربة المنتج بطريقة غير متوقعة وأعد نشر الأفضل.\n3. **وراء الكواليس**: فيديو يومي قصير يظهر كيف يُصنع القرار أو المنتج.\n4. **خبير مقابل مبتدئ**: حوار طريف يشرح قيمة المنتج دون بيع مباشر.\n5. **قالب تفاعلي**: اختبار من 3 أسئلة يوصي بالحل المناسب لكل شخص.\n6. **حملة «خطأ شائع»**: سلسلة تكسر اعتقادًا خاطئًا في مجالك وتقدّم بديلًا عمليًا.\n\n### كيف تختار؟\n- ابدأ بفكرتين فقط لمدة أسبوعين.\n- قِس **معدل الإكمال** و**الحفظ** و**المشاركة**، لا الإعجابات فقط.\n- أعد توزيع أفضل 20% من المحتوى بميزانية مدفوعة.\n\nاختر فكرة وسأكتب لك سيناريو كاملًا: الخطاف، المشاهد، النص، ودعوة الإجراء.";
    }

    if (/(اشرح|شرح|مفهوم|كيف يعمل|ما هو|ما هي|علمني|تعلم)/.test(normalized)) {
      return "## شرح مبسّط\n\nتخيّل أن المفهوم الذي تسأل عنه **فريقًا يحاول حل لغز**. كل عضو يرى جزءًا مختلفًا من الصورة، ويتبادلون الملاحظات حتى تتضح الصورة الكاملة.\n\n### الفكرة الأساسية\n- **المدخلات**: المعلومات الخام التي تصل أولًا.\n- **المعالجة**: اكتشاف الأنماط وربطها بمعرفة سابقة.\n- **المخرجات**: قرار أو إجابة قابلة للاستخدام.\n\n### مثال عملي\nعندما تكتب جملة، لا ينظر النظام إلى الكلمات منفصلة فقط، بل إلى **العلاقة بينها** وسياقها. لذلك يفهم أن «البنك» في جملة مالية يختلف عن «البنك» بجانب النهر.\n\n### تشبيه سريع\n- **الطبقة الأولى** مثل العين: تلتقط التفاصيل.\n- **الطبقة الوسطى** مثل العقل: تربط التفاصيل بمعنى.\n- **الطبقة الأخيرة** مثل اللسان: تصيغ الإجابة.\n\nهل تريد أن أتعمق في الجزء الرياضي، أم تفضّل المزيد من الأمثلة اليومية؟";
    }

    if (/(لخص|تلخيص|ملخص|اختصر)/.test(normalized)) {
      return "## قالب تلخيص احترافي\n\n### الملخص في ثلاث نقاط\n1. **الفكرة المركزية**: ما الرسالة التي يجب أن يخرج بها القارئ؟\n2. **الأدلة**: أهم رقم أو مثال يدعم الفكرة.\n3. **القرار المطلوب**: ما الخطوة التالية ومن المسؤول عنها؟\n\n### نسخة قصيرة\n> اكتب هنا خلاصة لا تتجاوز 60 كلمة، تبدأ بالنتيجة ثم السبب ثم التوصية.\n\n### نسخة تنفيذية\n- **الوضع الحالي:** وصف موجز.\n- **الفرصة:** ما الذي يمكن تحسينه.\n- **التوصية:** إجراء واحد واضح.\n- **المخاطر:** ما قد يعطّل التنفيذ.\n\nأرسل النص الذي تريد تلخيصه وسأعيد صياغته بهذا القالب مع الحفاظ على الأرقام والمصطلحات المهمة.";
    }

    if (/(اكتب|صياغه|رساله|ايميل|بريد|مقال|منشور|سيره)/.test(normalized)) {
      return "## مسودة جاهزة للتعديل\n\n**الموضوع:** تحديث سريع ومقترح للخطوة القادمة\n\nمرحبًا [الاسم]،\n\nأكتب إليك بخصوص [الموضوع]. بعد مراجعة الوضع الحالي، أقترح التركيز على ثلاثة أمور:\n\n1. **توضيح الهدف** في جملة واحدة قابلة للقياس.\n2. **تحديد مسؤول واحد** لكل مهمة وموعد نهائي واضح.\n3. **مراجعة أسبوعية قصيرة** لاتخاذ القرارات بدل تراكمها.\n\nإن كان لديك وقت هذا الأسبوع، أقترح اجتماعًا مدته 20 دقيقة لاعتماد الخطة. سأرسل جدول الأعمال مسبقًا.\n\nمع التقدير،\n[اسمك]\n\n### لماذا تعمل هذه الصياغة؟\n- تبدأ بالسياق قبل الطلب.\n- تحوّل الأفكار إلى خطوات محددة.\n- تنتهي بدعوة إجراء واحدة وواضحة.\n\nأخبرني بالنبرة المطلوبة (رسمية، ودية، تسويقية) وسأعيد كتابتها.";
    }

    if (/(سعر|اسعار|باقات|اشتراك|تكلفه)/.test(normalized)) {
      return "## تفكير في التسعير\n\n### ابدأ بالقيمة لا بالتكلفة\n- ما النتيجة التي يحصل عليها العميل؟\n- كم يوفر من وقت أو مال؟\n- ما البديل الذي يستخدمه اليوم؟\n\n### ثلاثة نماذج شائعة\n- **حسب الاستخدام**: مناسب عندما يزداد استهلاك العميل مع النمو.\n- **حسب المقاعد**: واضح وسهل الفهم للفرق.\n- **حسب القيمة**: يربط السعر بالأثر، ويحتاج قياسًا دقيقًا.\n\n### توصية عملية\nأطلق باقة أساسية واحدة وباقة احترافية واحدة. اجعل الفرق بينهما واضحًا في **نتيجة واحدة**، لا في عشرة خصائص.\n\n**قاعدة:** إذا لم يستطع العميل فهم سبب الفرق بين الباقتين في 10 ثوانٍ، فالتسعير معقد أكثر من اللازم.\n\nهل تريد بناء جدول مقارنة بين الباقات؟";
    }

    const topic = text.trim().replace(/\s+/g, " ").slice(0, 120);
    return "## وجهة نظر أولية\n\nسؤالك عن **«" + topic + "»** يستحق تفكيكًا هادئًا. إليك إطارًا يساعدك على اتخاذ خطوة عملية:\n\n### 1. تحديد النتيجة\nما الشيء المحدد الذي تريد أن يكون مختلفًا بعد أسبوع؟ اكتبه كجملة قابلة للقياس.\n\n### 2. جمع السياق\n- ما المعطيات المؤكدة لديك الآن؟\n- ما الافتراضات التي تحتاج إلى تحقق؟\n- من صاحب القرار ومن المتأثر به؟\n\n### 3. خطة صغيرة\n- اختر إجراءً واحدًا يمكن تنفيذه خلال 48 ساعة.\n- حدّد مؤشرًا واحدًا يدل على النجاح.\n- راجع النتيجة بعد أسبوع وعدّل.\n\n### 4. السؤال الأهم\nما أكبر شيء قد يمنعك من البدء؟ غالبًا تكون الإجابة أوضح من الخطة نفسها.\n\nأضف تفاصيل أكثر عن السياق أو الهدف، وسأحوّل هذا الإطار إلى توصية محددة مع خطوات ومواعيد.";
  }

  function scrollToBottom(behavior) {
    if (!elements.chat) return;
    const distance = elements.chat.scrollHeight - elements.chat.scrollTop - elements.chat.clientHeight;
    if (distance < 220 || behavior === "smooth") {
      elements.chat.scrollTo({ top: elements.chat.scrollHeight, behavior: behavior || "smooth" });
    }
  }

  function hideWelcome() {
    elements.welcome.classList.add("hidden");
  }

  function showWelcome() {
    elements.welcome.classList.remove("hidden");
  }

  function setBusy(busy) {
    state.busy = busy;
    elements.sendBtn.disabled = busy || !elements.input.value.trim();
  }

  function createMessage(role, text) {
    const message = document.createElement("article");
    message.className = "msg " + role;
    const id = "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    message.dataset.id = id;
    message.dataset.raw = text;

    const avatar = document.createElement("span");
    avatar.className = "msg-avatar";
    if (role === "assistant") {
      avatar.innerHTML = assistantAvatar;
    } else {
      avatar.textContent = "أنت";
    }

    const body = document.createElement("div");
    body.className = "msg-body";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    if (role === "assistant") {
      bubble.innerHTML = renderMarkdown(text);
    } else {
      bubble.textContent = text;
    }

    body.appendChild(bubble);

    if (role === "assistant") {
      const actions = document.createElement("div");
      actions.className = "msg-actions";
      actions.innerHTML =
        '<button type="button" data-action="copy" aria-label="نسخ الإجابة"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg></button>' +
        '<button type="button" data-action="regenerate" aria-label="إعادة التوليد"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg></button>' +
        '<button type="button" data-action="like" aria-label="إعجاب"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 10v11H4V10h3Zm0 10h9.2a2 2 0 0 0 2-1.6l1.2-7A2 2 0 0 0 17.4 9H14V5a2 2 0 0 0-2-2l-3 7v10Z"/></svg></button>';
      body.appendChild(actions);
    }

    message.appendChild(avatar);
    message.appendChild(body);
    elements.messages.appendChild(message);

    state.messages.push({ id: id, role: role, text: text });
    return { message: message, bubble: bubble, body: body };
  }

  function addMessage(role, text) {
    hideWelcome();
    const created = createMessage(role, text);
    scrollToBottom("smooth");
    return created;
  }

  function removeMessage(id) {
    const index = state.messages.findIndex((message) => message.id === id);
    if (index >= 0) state.messages.splice(index, 1);
    const node = elements.messages.querySelector('[data-id="' + id + '"]');
    if (node) node.remove();
  }

  function showTyping() {
    hideWelcome();
    const wrapper = document.createElement("article");
    wrapper.className = "msg assistant";
    wrapper.dataset.typing = "true";
    wrapper.innerHTML =
      '<span class="msg-avatar">' + assistantAvatar + "</span>" +
      '<div class="msg-body"><div class="bubble"><span class="typing">ذكاء يفكّر<span class="typing-dots"><i></i><i></i><i></i></span></span></div></div>';
    elements.messages.appendChild(wrapper);
    scrollToBottom("smooth");
    return wrapper;
  }

  function streamText(bubble, text, onDone) {
    let index = 0;
    const step = Math.max(6, Math.ceil(text.length / 70));
    const timer = setInterval(() => {
      index = Math.min(text.length, index + step);
      bubble.innerHTML = renderMarkdown(text.slice(0, index)) + '<span class="cursor"></span>';
      scrollToBottom();
      if (index >= text.length) {
        clearInterval(timer);
        bubble.innerHTML = renderMarkdown(text);
        scrollToBottom("smooth");
        onDone();
      }
    }, 20);
    return timer;
  }

  function replyFor(text) {
    return new Promise((resolve) => {
      const delay = 650 + Math.min(900, text.length * 8);
      setTimeout(() => resolve(generateReply(text)), delay);
    });
  }

  async function sendMessage(text) {
    const value = String(text || "").trim();
    if (!value || state.busy) return;

    state.activeConversation = null;
    $$(".history-item").forEach((item) => item.classList.remove("active"));
    addMessage("user", value);
    elements.input.value = "";
    autoResize();
    setBusy(true);

    const typing = showTyping();
    const answer = await replyFor(value);
    typing.remove();
    const created = addMessage("assistant", answer);
    created.bubble.innerHTML = "";
    streamText(created.bubble, answer, () => setBusy(false));
  }

  function autoResize() {
    elements.input.style.height = "auto";
    elements.input.style.height = Math.min(150, elements.input.scrollHeight) + "px";
    elements.sendBtn.disabled = state.busy || !elements.input.value.trim();
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => elements.toast.classList.remove("show"), 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast("تم نسخ النص")).catch(() => showToast("تعذّر النسخ"));
      return;
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
      showToast("تم نسخ النص");
    } catch (error) {
      showToast("تعذّر النسخ");
    }
    area.remove();
  }

  function toggleSidebar(open) {
    const shouldOpen = typeof open === "boolean" ? open : !elements.sidebar.classList.contains("open");
    elements.sidebar.classList.toggle("open", shouldOpen);
    elements.scrim.hidden = !shouldOpen;
  }

  const conversations = {
    launch: [
      { role: "user", text: "أحتاج خطة إطلاق لمنتج SaaS لإدارة المشاريع خلال 30 يومًا." },
      { role: "assistant", text: "## خطة إطلاق في 30 يومًا\n\n### الأسبوع الأول: التحقق\n- قابل 10 عملاء محتملين واسأل عن آخر مشروع تعطّل لديهم.\n- صغ رسالة قيمة واحدة: **إنجاز المشروع دون اجتماعات يومية**.\n\n### الأسبوع الثاني: الأصول\n- صفحة هبوط بثلاث لقطات من المنتج.\n- فيديو 45 ثانية يشرح المشكلة قبل الحل.\n- قائمة انتظار مع مكافأة إحالة.\n\n### الأسبوع الثالث: الإطلاق\n- أطلق على قناتين: مجتمع مهني وبريد مباشر.\n- قدّم جلسات تأسيس مجانية لأول 20 فريقًا.\n\n### الأسبوع الرابع: التحسين\n- راقب التفعيل خلال 24 ساعة والاحتفاظ بعد 14 يومًا.\n- أوقف القنوات التي تتجاوز تكلفة الاكتساب المستهدفة.\n\n**المؤشر الرئيسي:** 40% من المسجلين ينشئون مشروعًا أول خلال يوم واحد." },
      { role: "user", text: "ما أكبر خطر في هذه الخطة؟" },
      { role: "assistant", text: "أكبر خطر هو **البناء قبل التحقق**. إذا كانت المشكلة ليست مؤلمة بما يكفي، فلن تنقذ الخطة أفضل حملة تسويق.\n\n### كيف تقلّله\n1. اجعل الأسبوع الأول كله مقابلات، بلا تطوير.\n2. اطلب التزامًا صغيرًا قبل الإطلاق: اجتماع، أو قائمة انتظار، أو دفعة مسبقة.\n3. حدّد شرط توقف واضحًا: إذا لم يتحقق 10 التزامات خلال أسبوعين، أعد صياغة العرض." }
    ],
    sales: [
      { role: "user", text: "لدينا بيانات مبيعات شهرية. كيف نعرف أين نركّز؟" },
      { role: "assistant", text: "## قراءة سريعة للبيانات\n\n### ابدأ بثلاثة أسئلة\n1. أي شريحة تحقق أعلى **إيراد لكل عميل**؟\n2. أين تنخفض قيمة السلة مع زيادة عدد الطلبات؟\n3. أي منتج يجذب عملاء عاليي الاحتفاظ؟\n\n### تحليل مقترح\n| الشريحة | الإيراد | هامش الربح | الاحتفاظ |\n| --- | --- | --- | --- |\n| فرق صغيرة | مرتفع | متوسط | مرتفع |\n| أفراد | متوسط | مرتفع | منخفض |\n| مؤسسات | مرتفع | مرتفع | بطيء |\n\n### التوصية\nركّز على **الفرق الصغيرة** لأن دورة البيع أقصر من المؤسسات، والاحتفاظ أعلى من الأفراد. أعد تخصيص 60% من ميزانية الاكتساب لهذه الشريحة لمدة شهرين." },
      { role: "user", text: "وكيف نقيس النجاح؟" },
      { role: "assistant", text: "استخدم ثلاثة مؤشرات فقط:\n\n- **CAC**: تكلفة اكتساب العميل، مقارنة بقيمة العقد السنوي.\n- **Payback**: عدد الأشهر لاستعادة تكلفة الاكتساب.\n- **NRR**: صافي الإيراد المحتفظ به بعد 90 يومًا.\n\n**قاعدة القرار:** إذا تجاوزت فترة الاسترداد 12 شهرًا، أوقف القناة أو أعد تصميم العرض قبل زيادة الإنفاق." }
    ],
    content: [
      { role: "user", text: "أريد أفكارًا لمحتوى يشرح منتجنا دون أن يبدو إعلانًا." },
      { role: "assistant", text: "## محتوى يعلّم ولا يبيع\n\n### سلسلة «خطأ شائع»\nكل منشور يبدأ باعتقاد منتشر، ثم يقدّم تصحيحًا عمليًا. المنتج يظهر كأداة مساعدة، لا كبطل القصة.\n\n### سلسلة «يوم في حياة»\nاعرض كيف يستخدم شخص حقيقي المنتج داخل روتينه اليومي. التفاصيل الصغيرة تصنع المصداقية.\n\n### سلسلة «قرار مقابل قرار»\nقارن بين طريقتين لإنجاز المهمة: يدويًا، ثم بالمنتج. اجعل الفرق ملموسًا بالوقت أو الجهد.\n\n### قالب منشور جاهز\n> **الخطاف:** «معظم الفرق تضيّع 4 ساعات أسبوعيًا في…»\n> **السياق:** لماذا يحدث ذلك.\n> **الحل:** خطوتان يمكن تجربتهما اليوم.\n> **الدعوة:** «جرّب الخطوة الأولى وأخبرنا بالنتيجة.»\n\nابدأ بواحدة فقط، وانشر 4 حلقات، ثم قِس الحفظ والمشاركة قبل التوسع." }
    ],
    neural: [
      { role: "user", text: "اشرح الشبكات العصبية ببساطة." },
      { role: "assistant", text: "## الشبكات العصبية في صورة واحدة\n\nتخيّل فريقًا من الخبراء يمررون ملاحظاتهم لبعضهم البعض. كل خبير ينظر إلى جزء من البيانات، ثم يمرر خلاصة لمن بعده.\n\n### الطبقات\n- **طبقة الإدخال**: تستقبل الأرقام الخام.\n- **الطبقات المخفية**: تكتشف أنماطًا متزايدة التعقيد.\n- **طبقة الإخراج**: تعطي الاحتمال أو القرار النهائي.\n\n### التدريب\n1. يقدّم النموذج توقعًا.\n2. نقارنه بالإجابة الصحيحة.\n3. نحسب الخطأ.\n4. نعدّل الأوزان قليلًا لتقليل الخطأ.\n5. نكرر ملايين المرات.\n\n### مثال\nفي تمييز الصور: الطبقة الأولى ترى الحواف، والوسطى ترى الأشكال، والأخيرة ترى الوجوه. لا أحد برمج «الوجه» مباشرة؛ النموذج تعلّمه من الأمثلة.\n\n**الفكرة الأساسية:** الشبكة ليست قاعدة مكتوبة، بل مجموعة أرقام تتكيف مع البيانات." }
    ]
  };

  function loadConversation(key) {
    const conversation = conversations[key];
    if (!conversation) return;
    state.activeConversation = key;
    elements.messages.innerHTML = "";
    state.messages = [];
    hideWelcome();
    conversation.forEach((entry) => createMessage(entry.role, entry.text));
    $$(".history-item").forEach((item) => item.classList.toggle("active", item.dataset.conversation === key));
    toggleSidebar(false);
    elements.chat.scrollTo({ top: elements.chat.scrollHeight, behavior: "smooth" });
  }

  function resetChat() {
    state.messages = [];
    state.activeConversation = null;
    elements.messages.innerHTML = "";
    showWelcome();
    $$(".history-item").forEach((item) => item.classList.remove("active"));
    elements.input.value = "";
    autoResize();
    elements.chat.scrollTo({ top: 0, behavior: "smooth" });
    elements.input.focus({ preventScroll: true });
    toggleSidebar(false);
  }

  function applyTheme(theme) {
    elements.html.dataset.theme = theme;
    try { localStorage.setItem("zaka-theme", theme); } catch (error) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f4f5fa" : "#0b0d17");
  }

  function bindEvents() {
    elements.composer.addEventListener("submit", (event) => {
      event.preventDefault();
      sendMessage(elements.input.value);
    });

    elements.input.addEventListener("input", autoResize);
    elements.input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        if (!state.busy && elements.input.value.trim()) sendMessage(elements.input.value);
      }
    });

    $$(".suggestion").forEach((suggestion) => {
      suggestion.addEventListener("click", () => {
        const prompt = suggestion.dataset.prompt || "";
        elements.input.value = prompt;
        autoResize();
        sendMessage(prompt);
      });
    });

    $("#newChat").addEventListener("click", resetChat);
    $("#menuBtn").addEventListener("click", () => toggleSidebar());
    elements.scrim.addEventListener("click", () => toggleSidebar(false));

    elements.historyList.addEventListener("click", (event) => {
      const item = event.target.closest("[data-conversation]");
      if (item) loadConversation(item.dataset.conversation);
    });

    $("#themeBtn").addEventListener("click", () => {
      applyTheme(elements.html.dataset.theme === "dark" ? "light" : "dark");
      showToast(elements.html.dataset.theme === "dark" ? "تم تفعيل المظهر الداكن" : "تم تفعيل المظهر الفاتح");
    });

    $("#shareBtn").addEventListener("click", () => copyText(window.location.href));

    $("#modelBtn").addEventListener("click", () => showToast("أنت تستخدم ذكاء 2.0 — أسرع وأدق في المهام الطويلة"));
    $("#upgradeBtn").addEventListener("click", () => showToast("ترقية الخطة ستتوفر قريبًا"));
    $("#userBtn").addEventListener("click", () => showToast("إعدادات الحساب ستتوفر قريبًا"));
    $("#attachBtn").addEventListener("click", () => showToast("إرفاق الملفات سيتوفر قريبًا"));
    $("#micBtn").addEventListener("click", () => showToast("الإدخال الصوتي سيتوفر قريبًا"));

    elements.messages.addEventListener("click", (event) => {
      const copyCode = event.target.closest(".copy-code");
      if (copyCode) {
        const block = copyCode.closest(".code-block");
        const code = block ? block.querySelector("code") : null;
        if (code) copyText(code.textContent);
        return;
      }

      const action = event.target.closest("[data-action]");
      if (!action) return;
      const message = action.closest(".msg");
      if (!message) return;
      const raw = message.dataset.raw || "";

      if (action.dataset.action === "copy") {
        copyText(raw);
        return;
      }
      if (action.dataset.action === "like") {
        action.classList.toggle("liked");
        action.style.color = action.classList.contains("liked") ? "#34d399" : "";
        showToast(action.classList.contains("liked") ? "شكرًا لتقييمك" : "تم إلغاء الإعجاب");
        return;
      }
      if (action.dataset.action === "regenerate") {
        if (state.busy) return;
        const index = state.messages.findIndex((entry) => entry.id === message.dataset.id);
        let prompt = "";
        for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
          if (state.messages[cursor].role === "user") {
            prompt = state.messages[cursor].text;
            break;
          }
        }
        if (!prompt) return;
        removeMessage(message.dataset.id);
        setBusy(true);
        const typing = showTyping();
        replyFor(prompt).then((answer) => {
          typing.remove();
          const created = addMessage("assistant", answer);
          created.bubble.innerHTML = "";
          streamText(created.bubble, answer, () => setBusy(false));
        });
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) toggleSidebar(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") toggleSidebar(false);
    });
  }

  function init() {
    let theme = "dark";
    try {
      const stored = localStorage.getItem("zaka-theme");
      if (stored === "light" || stored === "dark") theme = stored;
    } catch (error) {}
    applyTheme(theme);

    bindEvents();
    autoResize();
    elements.html.dataset.appReady = "true";
    requestAnimationFrame(() => document.body.classList.add("ready"));
  }

  init();
})();
