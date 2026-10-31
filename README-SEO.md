# دليل الرفع والسيو والإعلانات — محيط الراحة

## نشر الموقع على GitHub Pages (Live Demo)
1. أنشئ مستودعاً **عاماً** جديداً على GitHub، ولا تضف إليه README أو ملفاتاً مبدئية.
2. من PowerShell داخل مجلد الموقع نفّذ الأوامر التالية بعد استبدال `USERNAME` و`REPOSITORY`:
   ```powershell
   git init
   git add .
   git commit -m "Publish website"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPOSITORY.git
   git push -u origin main
   ```
3. في GitHub افتح **Settings → Pages**، واجعل **Build and deployment → Source** على **GitHub Actions**.
4. انتظر نجاح مهمة **Deploy site to GitHub Pages** من تبويب **Actions**. رابط العرض سيكون:
   `https://USERNAME.github.io/REPOSITORY/`
   (إذا كان اسم المستودع `USERNAME.github.io` فالرابط يكون `https://USERNAME.github.io/`).

ملف GitHub Actions ينسخ ملفات الموقع اللازمة وينشرها تلقائياً مع كل دفع إلى `main` أو `master`. كما يضبط روابط الدومين وملفات SEO تلقائياً على رابط Pages، ويهيئ الروابط في صفحة 404 لتعمل داخل المستودع. هذه الخطوات مستقلة عن إعدادات Hostinger أدناه.

قبل مشاركة العرض، استبدل `info@example.com` ببريدك الحقيقي في `index.html` و`js/script.js`؛ البريد الحالي تجريبي.

## 1) استبدل القيم المتبقية عند النشر على Hostinger
في VS Code استخدم Ctrl+Shift+H ثم Replace All في كل الملفات:
| ابحث عن | استبدله بـ |
|---|---|
| `YOUR-DOMAIN.com` | دومينك الحقيقي (بدون https) |
| `info@example.com` | إيميلك |

تم ضبط رقم الجوال والواتساب (+966552375111) وعنوان المقر في حائل. المتبقي: `email` في `js/script.js` وفي `index.html`، وروابط السوشيال، ومواعيد العمل.

## 2) الرفع على هوستنجر
1. hPanel ← الملفات ← File Manager ← `public_html` وارفع **محتويات** الفولدر (index.html و css و js و images و باقي الملفات) وليس الفولدر نفسه.
2. تأكد من ظهور ملف `.htaccess` (فعّل Show Hidden Files).
3. من hPanel فعّل شهادة SSL المجانية لدومينك، ثم افتح الموقع على https.
4. بعد أي تعديل على css أو js غيّر رقم `?v=1` إلى `?v=2` في index.html.

## 3) السيو (محرّكات البحث)
- أضف الموقع في **Google Search Console** (نوع Domain) وانسخ كود التوثيق في الهيد (سطر `google-site-verification` معلّق جاهز)، ثم أرسل `https://دومينك/sitemap.xml`.
- أنشئ **ملف نشاط تجاري على Google Business Profile** بنفس الاسم والرقم والعنوان تماماً: أهم عامل للظهور المحلي.
- اختبر الصفحة في: PageSpeed Insights و Rich Results Test (للبيانات المنظمة) وانظر هل الأسئلة الشائعة تُقرأ.
- موجود جاهزاً: العنوان والوصف، canonical، hreflang ar-SA، Open Graph/Twitter، صورة المشاركة، Schema (EmploymentAgency, Service, FAQPage, WebSite)، robots.txt، sitemap.xml، manifest، صفحة 404، ضغط وتخزين مؤقت.
- لو غيّرت الأسئلة أو الخدمات في الصفحة، حدّث كتلة JSON-LD في الهيد لتطابقها (جوجل يشترط تطابق المحتوى).
- أضف صوراً حقيقية بنصوص بديلة (alt) تصف المحتوى، ونصوصاً تحتوي كلمات يبحث بها عملاؤك (مثل: استقدام عاملة منزلية، سائق خاص).

## 4) إعلانات جوجل أدس وباقي المنصات
في `js/script.js` داخل `tracking` ضع المعرّفات فقط وسيعمل كل شيء:
- `ga4` (Google Analytics) و`adsId` (Google Ads) **أو** `gtm` (تاج مانجر) — واحد منهما وليس الاثنين.
- `metaPixel` و`tiktokPixel` و`snapPixel`.
- **التحويلات**: أنشئ في جوجل أدس تحويلين (Conversion actions) واحد للواتساب وآخر للاتصال، وانسخ قيمة `send_to` (مثل `AW-123/AbC`) إلى `adsConversions`.
- كل ضغطة على واتساب/اتصال/إيميل تُرسَل تلقائياً كحدث `generate_lead` (مع مكان الزر) وكحدث Contact في ميتا وتيك توك وسناب.
- رسالة الواتساب تنتهي تلقائياً بـ `[ref: google/cpc/اسم_الحملة]` ليعرف فريق المبيعات مصدر العميل (عطّلها بـ `appendSourceToWhatsApp:false`).
- ضع في رابط الإعلان علامات الحملة: `?utm_source=google&utm_medium=cpc&utm_campaign=اسم&utm_term={keyword}`.
- بانر الموافقة يعمل تلقائياً عند وجود أي معرّف ويؤخّر التتبع لحين الموافقة (`requireConsent`). لو تريد التتبع دون بانر ضعها `false` (راجع مستشارك القانوني).

## 5) سياسات الإعلانات (لتجنّب رفض الحملة)
- لا تكتب ادعاءات غير مثبتة: «الأفضل/رقم 1»، أرقام عملاء، ترخيص أو اعتماد، تقييمات، أسعار أو مدد التزام بها.
- اجعل الإعلان متطابقاً مع الصفحة (نفس الخدمة والنص).
- صفحة الخصوصية موجودة (`privacy-policy.html`)، وبيانات التواصل ظاهرة في الصفحة.
- راجع نص الخصوصية مع مستشار قانوني وحدّثه حسب الأدوات المفعّلة.
