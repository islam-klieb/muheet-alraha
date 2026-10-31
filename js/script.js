/* =====================================================================
   script.js
   1) CONFIG: بياناتك وإعدادات التتبع (غيّرها هنا فقط)
   2) باقي الكود: ربط الأزرار + تتبع التحويلات + بانر الموافقة
   - data-wa   => زر واتساب      - data-call => زر اتصال
   - data-mail => بريد           - data-show => يطبع قيمة من CONFIG
   ===================================================================== */
const CONFIG = {
  whatsapp: "966552375111",   // رقم واتساب دولي بدون + أو أصفار (966 ثم الرقم بدون الصفر)
  phone:    "+966552375111",  // رقم الاتصال
  email:    "info@example.com",
  city:     "حائل، المملكة العربية السعودية",
  address:  "2898 شارع الأمير سعود بن عبدالمحسن آل سعود، حي النقرة، حائل 81461",
  /* مواعيد العمل بالدقائق من منتصف الليل (0 = الأحد ... 6 = السبت). مثال: 570 = 9:30 ص ، 960 = 4:00 م */
  hours: { 0:[[570,720],[960,1170]], 1:[[570,720],[960,1170]], 2:[[570,720],[960,1170]], 3:[[570,720],[960,1170]],
           4:[[570,720],[960,1200]], 5:[], 6:[[990,1230]] },
  social:   { x:"https://x.com/MktbAlslhany", instagram:"", tiktok:"https://www.tiktok.com/@muheetalrahah" },   // روابط حساباتك (فارغ = يختفي الزر)
  waText:   "السلام عليكم، أرغب في الاستفسار عن خدمات الاستقدام لدى محيط الراحة",

  /* ---------- التتبع والإعلانات ----------
     اترك أي معرّف فارغاً "" ولن يُحمَّل. استخدم إما gtm (جوجل تاج مانجر) أو المعرّفات المباشرة، ليس الاثنين معاً. */
  tracking: {
    ga4:        "",   // Google Analytics 4  مثال: "G-XXXXXXXXXX"
    adsId:      "",   // Google Ads          مثال: "AW-123456789"
    gtm:        "",   // Google Tag Manager  مثال: "GTM-XXXXXXX"
    metaPixel:  "",   // Meta (فيسبوك/إنستجرام) Pixel ID
    tiktokPixel:"",   // TikTok Pixel ID
    snapPixel:  "",   // Snapchat Pixel ID
    /* تحويلات جوجل أدس: انسخ "send_to" من إعداد التحويل. مثال: "AW-123456789/AbCdEfGhIjK" */
    adsConversions: { whatsapp:"", call:"", email:"" },
    requireConsent: true,           // true = لا يعمل التتبع إلا بعد موافقة الزائر (مُوصى به)
    appendSourceToWhatsApp: true    // يضيف مصدر الحملة لآخر رسالة واتساب: [ref: google/cpc/اسم_الحملة]
  }
};

(function(){
  var C=CONFIG, T=C.tracking||{}, q=function(s){return document.querySelectorAll(s)};

  /* ---------- 1) التقاط مصدر الزيارة (UTM / gclid) ---------- */
  var utm={};
  try{
    var sp=new URLSearchParams(location.search);
    ["utm_source","utm_medium","utm_campaign","utm_term","gclid","fbclid","ttclid","ScCid"].forEach(function(k){var v=sp.get(k);if(v)utm[k]=v});
    if(Object.keys(utm).length) sessionStorage.setItem("utm",JSON.stringify(utm));
    else utm=JSON.parse(sessionStorage.getItem("utm")||"{}");
  }catch(e){}
  function refTag(){
    if(!T.appendSourceToWhatsApp) return "";
    var s=utm.utm_source||(utm.gclid?"google":utm.fbclid?"meta":utm.ttclid?"tiktok":utm.ScCid?"snapchat":"");
    if(!s) return "";
    return "\n\n[ref: "+[s,utm.utm_medium,utm.utm_campaign].filter(Boolean).join("/")+"]";
  }

  /* ---------- 2) إرسال حدث تحويل (ضغطة واتساب/اتصال/إيميل) لكل المنصات المفعّلة ---------- */
  function where(el){var s=el.closest("section,header,footer,nav");return s?(s.id||String(s.className).split(" ")[0]||s.tagName.toLowerCase()):"page"}
  function track(kind,el,x){
    var loc=where(el), p={method:kind,location:loc};
    if(x) for(var k in x) p[k]=x[k];
    try{
      if(window.gtag){
        gtag("event","generate_lead",p);
        var l=T.adsConversions&&T.adsConversions[kind]; if(l) gtag("event","conversion",{send_to:l});
      }
      if(window.dataLayer){var o={event:"lead_"+kind,lead_method:kind,lead_location:loc};if(x)for(var j in x)o["lead_"+j]=x[j];dataLayer.push(o)}
      if(window.fbq) fbq("track","Contact",p);
      if(window.ttq) ttq.track("Contact");
      if(window.snaptr) snaptr("track","CUSTOM_EVENT_1");
    }catch(e){}
  }

  /* ---------- 3) ربط الأزرار ---------- */
  q("[data-wa]").forEach(function(e){e.addEventListener("click",function(ev){
    ev.preventDefault(); track("whatsapp",e);
    window.open("https://wa.me/"+C.whatsapp+"?text="+encodeURIComponent(C.waText+refTag()),"_blank","noopener");
  })});
  /* نموذج الطلب السريع في الهيرو: يبني رسالة واتساب من الخدمة والجنسية المختارتين */
  var rs=document.getElementById("req-send");
  if(rs){rs.addEventListener("click",function(){
    var sv=document.querySelector('input[name="svc"]:checked'), nt=document.getElementById("req-nat");
    var svc=sv?sv.value:"", nat=nt?nt.value:"";
    var msg="السلام عليكم، أرغب في عرض سعر لخدمة: "+svc+(nat?"\nالجنسية المفضلة: "+nat:"")+refTag();
    track("whatsapp",rs,{service:svc,nationality:nat||"any"});
    window.open("https://wa.me/"+C.whatsapp+"?text="+encodeURIComponent(msg),"_blank","noopener");
  })}
  q("[data-call]").forEach(function(e){
    if(e.tagName==="A") e.setAttribute("href","tel:"+C.phone);
    e.addEventListener("click",function(ev){track("call",e); if(e.tagName!=="A"){ev.preventDefault();location.href="tel:"+C.phone}});
  });
  q("[data-mail]").forEach(function(e){e.setAttribute("href","mailto:"+C.email);e.addEventListener("click",function(){track("email",e)})});
  q("[data-show]").forEach(function(e){e.textContent=C[e.dataset.show]||""});
  q("[data-social]").forEach(function(e){var u=C.social&&C.social[e.dataset.social];if(u){e.href=u;e.target="_blank";e.rel="noopener"}else{e.remove()}});
  var y=document.getElementById("year"); if(y) y.textContent=new Date().getFullYear();

  /* مواعيد العمل: تمييز اليوم الحالي + شارة مفتوح/مغلق (بتوقيت السعودية) */
  (function(){
    var tbs=document.querySelectorAll(".js-open"); if(!tbs.length||!C.hours) return;
    var n=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Riyadh"})), d=n.getDay(), t=n.getHours()*60+n.getMinutes();
    var open=(C.hours[d]||[]).some(function(r){return t>=r[0]&&t<r[1]});
    tbs.forEach(function(tb){tb.hidden=false; tb.className="open-badge js-open "+(open?"on":"off"); tb.textContent=open?"مفتوح الآن":"مغلق الآن"});
    var row=document.querySelector('.hrs tr[data-d="'+d+'"]'); if(row) row.classList.add("today");
  })();

  /* قائمة الجوال */
  var b=document.getElementById("burger"),m=document.getElementById("mmenu");
  if(b&&m){
    b.addEventListener("click",function(){var o=m.classList.toggle("open");b.setAttribute("aria-expanded",o)});
    m.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){m.classList.remove("open")})});
  }
  /* تمييز القسم الحالي في القائمة */
  var links=document.querySelectorAll(".menu a");
  if(links.length&&"IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){links.forEach(function(l){l.classList.toggle("on",l.getAttribute("href")==="#"+x.target.id)})}})},{rootMargin:"-45% 0px -50% 0px"});
    links.forEach(function(l){var h=l.getAttribute("href");if(h&&h.charAt(0)==="#"){var t=document.querySelector(h);if(t)io.observe(t)}});
  }

  /* ---------- 4) تحميل أدوات التتبع (بعد تحميل الصفحة حتى لا تبطّئها) ---------- */
  var anyId=T.ga4||T.adsId||T.gtm||T.metaPixel||T.tiktokPixel||T.snapPixel, loaded=false;
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}}
  function loadJs(src){var s=document.createElement("script");s.async=true;s.src=src;document.head.appendChild(s)}
  function loadTrackers(){
    if(loaded||!anyId) return; loaded=true;
    window.dataLayer=window.dataLayer||[];
    if(T.gtm){
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i;f.parentNode.insertBefore(j,f)})(window,document,"script","dataLayer",T.gtm);
    } else if(T.ga4||T.adsId){
      window.gtag=function(){dataLayer.push(arguments)};
      gtag("js",new Date());
      loadJs("https://www.googletagmanager.com/gtag/js?id="+(T.ga4||T.adsId));
      if(T.ga4) gtag("config",T.ga4);
      if(T.adsId) gtag("config",T.adsId);
    }
    if(T.metaPixel){
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
      fbq("init",T.metaPixel); fbq("track","PageView");
    }
    if(T.tiktokPixel){
      !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=r+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load(T.tiktokPixel);ttq.page()}(window,document,"ttq");
    }
    if(T.snapPixel){
      (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s="script",r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u)})(window,document,"https://sc-static.net/scevent.min.js");
      snaptr("init",T.snapPixel); snaptr("track","PAGE_VIEW");
    }
  }
  function afterLoad(f){ if(document.readyState==="complete") setTimeout(f,800); else addEventListener("load",function(){setTimeout(f,800)}); }

  /* ---------- 5) بانر الموافقة ---------- */
  if(anyId){
    var st=T.requireConsent?store("consent"):"yes";
    if(st==="yes") afterLoad(loadTrackers);
    else if(st!=="no"){
      var bn=document.getElementById("consent");
      if(bn){
        bn.hidden=false;
        document.getElementById("consent-yes").addEventListener("click",function(){store("consent","yes");bn.hidden=true;loadTrackers()});
        document.getElementById("consent-no").addEventListener("click",function(){store("consent","no");bn.hidden=true});
      }
    }
  }
})();
