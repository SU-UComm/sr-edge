import B from"https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";const Xe=typeof window>"u"?{}:window;function zt(e=Xe){return e.document!==void 0}function D(e,t=Xe){if(!zt(t))return null;const{document:n}=t,{cookie:s}=n;if(typeof s!="string")return null;const r=s.split("; ");let i=null;return r.find(a=>{const[o,l]=a.split("=");return o===e&&l!==""&&(i=l),null}),i}const Oe="su-hidden";function Ve(e){const t={external:document.querySelectorAll('[data-audience="external"]'),faculty:document.querySelectorAll('[data-audience="faculty"]'),student:document.querySelectorAll('[data-audience="student"]')};Object.values(t).forEach(n=>{n==null||n.forEach(s=>{s.classList.add(Oe)})}),t[e]&&t[e].forEach(n=>{n.classList.remove(Oe)})}document.addEventListener("DOMContentLoaded",function(){const e=D("preferences_personalisation");Ve(e==="null"||!e?"external":e)});const Qe=typeof window>"u"?{}:window;function Wt(e=Qe){return e.document!==void 0}function xe(e,t="",n=!0,s="",r="/",i=Qe){if(!Wt(i))return;const{document:a}=i,{location:{hostname:o}}=a;let l="";if(s){const d=new Date;d.setTime(d.getTime()+s*24*60*60*1e3),l=`; expires=${d.toUTCString()}`}n===!0?a.cookie=`${e}=${t}${l}; path=${r}; domain=${o}; secure=${n};`:a.cookie=`${e}=${t}${l}; path=${r}; domain=${o};`}async function jt(e,t){return await(await fetch("/__dxp/events/custom",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({source:"custom",action:e,event:{type:t}}),redirect:"follow"}).catch(r=>{throw new Error(r)})).text()}async function ee(e){return await(await fetch("/__dxp/cdp/setConsent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({CDPConsent:e,documentVersion:"1.0"}),redirect:"follow"}).catch(s=>{throw new Error(s)})).text()}function Yt(){const e='[id="light-theme"]',t='[id="dark-theme"]',n='[data-role="su-darkmode-icon-active"]',s='[data-role="su-darkmode-icon-nonactive"]',r=document.querySelector(e),i=document.querySelector(t),a=document.querySelector(n),o=document.querySelector(s),l=document.querySelector("html");if(r&&i){const d=D("preferences_theme");d==="dark"||["",null,void 0,!1].includes(d)&&window.matchMedia("(prefers-color-scheme: dark)").matches?(l.classList.add("su-dark"),a.classList.remove("su-hidden"),o.classList.add("su-hidden"),i.checked=!0,r.checked=!1):(a.classList.add("su-hidden"),o.classList.remove("su-hidden"),l.classList.add("su-light"),r.checked=!0,i.checked=!1),r.addEventListener("keyup",({key:f})=>{[" ","Enter"].includes(f)&&document.querySelector('[data-theme="dark-theme"]').click()}),i.addEventListener("keyup",({key:f})=>{[" ","Enter"].includes(f)&&document.querySelector('[data-theme="light-theme"]').click()}),r.addEventListener("click",()=>{l.classList.remove("su-dark"),l.classList.add("su-light"),a.classList.add("su-hidden"),o.classList.remove("su-hidden"),xe("preferences_theme","light",!0,130)}),i.addEventListener("click",()=>{l.classList.remove("su-light"),l.classList.add("su-dark"),a.classList.remove("su-hidden"),o.classList.add("su-hidden"),xe("preferences_theme","dark",!0,130)}),document.personaChangeEvent=new Event("personaChange")}}class Xt{constructor(t){this.parent=t,this.menuToggle=this.parent.querySelector('[aria-controls="menu"]'),this.searchToggle=this.parent.querySelector('[aria-controls="search"]'),this.preferencesToggle=this.parent.querySelector('[aria-controls="preferences"]'),this.menuCloseToggle=this.parent.querySelectorAll(".report-header__menu-close,.report-header__menu-tray .report-header__overlay"),this.searchCloseToggle=this.parent.querySelectorAll(".report-header__search-close,.report-header__search-tray .report-header__overlay"),this.preferencesCloseToggle=this.parent.querySelectorAll(".report-header__preferences-close,.report-header__preferences-tray .report-header__overlay"),this.handleHeaderScroll(),this.handleHeaderToggles(),this.handleSearchInputs();const n=document.querySelector('[data-role="header-main-nav"]');n&&(n.classList.remove("su-opacity-0"),n.classList.add("su-opacity-1"))}focus(t){if(t.match(/:/g)){const[n,s,r]=t.split(":");document.querySelector(`[data-location="${t}"]`).querySelectorAll(s)[Number(r)].focus();return}document.querySelector(`[data-location="${t}"]`).focus()}handleTab(t){t.addEventListener("keyup",n=>{const{target:s,key:r}=n;if(r!=="Tab")return;const i=s.dataset.tpTo?s.dataset.tpTo:null;i&&this.focus(i)})}handleSearchInputs(){const t=document.querySelectorAll('[data-role="search-query"]'),n=document.querySelectorAll('[data-role="clear-search"]');t.length&&t.forEach((s,r)=>{s.addEventListener("keyup",()=>{s.value!==""?(s.parentNode.classList.add("input-has-value"),n[r].classList.remove("su-hidden")):(s.parentNode.classList.remove("input-has-value"),n[r].classList.add("su-hidden"))})}),n.length&&n.forEach(s=>{s.addEventListener("click",r=>{s.parentNode.parentNode.querySelector(".input-has-value").classList.remove("input-has-value"),s.classList.add("su-hidden")})})}handleHeaderToggles(){this.handleTab(document.querySelector(".report-header__main")),this.menuToggle.addEventListener("click",()=>{const n=this.parent.querySelector("#menu");this.menuToggle.getAttribute("aria-expanded")==="true"?(this.menuToggle.setAttribute("aria-expanded","false"),this.parent.classList.remove("report-header--primary-nav-open"),n.setAttribute("aria-hidden","true"),window.innerWidth<768&&(document.body.style.cssText+="overflow: auto;"),setTimeout(()=>{n.classList.remove("su-hidden"),n.classList.add("su-block")},300)):(n.classList.remove("su-hidden"),window.innerWidth<768&&(document.body.style.cssText+="overflow: hidden;"),setTimeout(()=>{this.menuCloseToggle[1].focus(),this.menuToggle.setAttribute("aria-expanded","true"),this.parent.classList.add("report-header--primary-nav-open"),n.setAttribute("aria-hidden","false")},0))}),this.menuCloseToggle.forEach(n=>{n.addEventListener("click",()=>{const s=this.parent.querySelector("#menu");this.menuToggle.setAttribute("aria-expanded","false"),this.parent.classList.remove("report-header--primary-nav-open"),s.setAttribute("aria-hidden","true"),this.menuToggle.focus(),window.innerWidth<768&&(document.body.style.cssText+="overflow: auto;"),setTimeout(()=>{s.classList.remove("su-block"),s.classList.add("su-hidden")},300)})});const t=document.querySelector('[data-role="search-focus-trap"]');this.searchToggle.addEventListener("click",()=>{const n=this.parent.querySelector("#search");this.searchToggle.getAttribute("aria-expanded")==="true"?(this.searchToggle.setAttribute("aria-expanded","false"),this.parent.classList.remove("report-header--search-open"),n.setAttribute("aria-hidden","true"),setTimeout(()=>{n.classList.add("su-hidden"),n.classList.remove("su-block"),t.classList.add("su-hidden"),t.classList.remove("su-block")},300)):(n.classList.remove("su-hidden"),t.classList.remove("su-hidden"),setTimeout(()=>{this.searchToggle.setAttribute("aria-expanded","true"),this.parent.classList.add("report-header--search-open"),n.setAttribute("aria-hidden","false")},0))}),this.searchCloseToggle.forEach(n=>{const s=this.parent.querySelector("#search");n.addEventListener("click",()=>{const r=this.parent.querySelector("#search");this.searchToggle.setAttribute("aria-expanded","false"),this.parent.classList.remove("report-header--search-open"),r.setAttribute("aria-hidden","true"),setTimeout(()=>{s.classList.remove("su-block"),s.classList.add("su-hidden"),t.classList.remove("su-block"),t.classList.add("su-hidden")},300)})}),this.preferencesToggle.addEventListener("click",()=>{const n=this.parent.querySelector("#preferences");this.preferencesToggle.getAttribute("aria-expanded")==="true"?(this.preferencesToggle.setAttribute("aria-expanded","false"),this.parent.classList.remove("report-header--preferences-open"),n.setAttribute("aria-hidden","true"),window.innerWidth<768&&(document.body.style.cssText+="overflow: auto;"),setTimeout(()=>{n.classList.remove("su-hidden"),n.classList.add("su-block")},300)):(n.classList.remove("su-hidden"),this.preferencesCloseToggle[1].focus(),window.innerWidth<768&&(document.body.style.cssText+="overflow: hidden;"),setTimeout(()=>{this.preferencesToggle.setAttribute("aria-expanded","true"),this.parent.classList.add("report-header--preferences-open"),n.setAttribute("aria-hidden","false")},0))}),this.preferencesCloseToggle.forEach(n=>{n.addEventListener("click",()=>{const s=this.parent.querySelector("#preferences");this.preferencesToggle.setAttribute("aria-expanded","false"),this.parent.classList.remove("report-header--preferences-open"),s.setAttribute("aria-hidden","true"),this.preferencesToggle.focus(),window.innerWidth<768&&(document.body.style.cssText+="overflow: auto;"),setTimeout(()=>{s.classList.remove("su-block"),s.classList.add("su-hidden")},300)})})}handleHeaderScroll(){window.addEventListener("scroll",t=>{const n=this.parent;if(window.scrollY>32){n.classList.add("report-header--collapsed");return}n.classList.remove("report-header--collapsed")})}}class Ke{constructor(t,n){this.url=t,this.type=n,this.assetData="",this.assetIds=[],this.requestProps={}}assets(...t){return this.assetIds=t,this}data(...t){return this.assetData=t.join(","),this}request(t){return this.requestProps=t,this}async fetch(){if(this.type==="MX"){const s=this.assetIds.map(async r=>{const i=`${this.url}/${r}?data=${this.assetData}`;return await(await fetch(i,this.requestProps).catch(l=>{throw new Error(l)})).json()});return Promise.all(s)}return await(await fetch(this.url,this.requestProps).catch(s=>{throw new Error(s)})).json()}}function Je(e){switch(e){case"faculty":return"Faculty/staff";case"student":return"Student";default:return"External"}}async function Qt(e=null,t=""){var s,r,i,a,o,l,d,f;const n=new Ke;if(e&&e.search){let u="",p="";u=`${(s=e.search.endpoint)==null?void 0:s.replace("search.html","search.json")}?profile=${e.search.profile}&collection=${e.search.collection}&query=[taxonomyContentMainTopicId:${e.mainTopicId} taxonomyContentTopicsId:${e.mainTopicId} taxonomyContentSubtopicsId:${e.mainTopicId}]&meta_taxonomyAudienceText=${Je(t)}&query_not=[taxonomyContentTypeId:28210 taxonomyContentTypeId:28216 taxonomyContentTypeId:28201 id:${e.id}]&sort=date&num_ranks=1&log=false`,p=`${(r=e.search.endpoint)==null?void 0:r.replace("search.html","search.json")}?profile=${e.search.profile}&collection=${e.search.collection}&query_not=[taxonomyContentTypeId:28210 taxonomyContentTypeId:28216 taxonomyContentTypeId:28201 id:${e.id}]&sort=date&num_ranks=1&log=false`,e.contentType==="Video"&&(p+="&meta_taxonomyContentTypeId=28207",u+="&meta_taxonomyContentTypeId=28207"),n.url=u;let h=await n.fetch(),c=((o=(a=(i=h.response)==null?void 0:i.resultPacket)==null?void 0:a.results)==null?void 0:o[0])||null;return c||(n.url=p,h=await n.fetch(),c=((f=(d=(l=h.response)==null?void 0:l.resultPacket)==null?void 0:d.results)==null?void 0:f[0])||null),c}return null}function Kt(e,t,n,s="su-hidden"){if(e&&t&&n){const r=n.querySelector('h2[data-story="announcement"]'),i=n.querySelector('h1[data-story="title"]'),a=n.querySelector('a[data-story="link"]');t!=null&&t.contentType&&r&&(r.textContent=t.contentType==="Video"?"Watch next:":"Read next:"),t!=null&&t.title&&i&&(i.textContent=t.title),e!=null&&e.displayUrl&&(e!=null&&e.title)&&a&&(a.textContent=e.title,a.href=e.displayUrl),(t!=null&&t.title||e!=null&&e.displayUrl)&&n.classList.remove(s)}}const Jt='header[data-component="header-component"]',et='section[data-subcomponent="header-cookie-consent-banner"]',F="su-hidden";let U=!1;function te(){const e=document.querySelector(et);e&&e.classList.add(F),e&&e.classList.remove("active")}function e1(){const e=document.querySelector(et);e&&e.classList.remove(F),e&&e.classList.add("active")}function _e(e){const t={external:document.querySelectorAll('[data-audience="external"]'),faculty:document.querySelectorAll('[data-audience="faculty"]'),student:document.querySelectorAll('[data-audience="student"]')},n={student:document.querySelector('button[data-click="student-persona"]'),faculty:document.querySelector('button[data-click="faculty-persona"]')};Object.values(t).forEach(s=>{s==null||s.forEach(r=>{r.classList.add(F)})}),Object.values(n).forEach(s=>{s&&s.setAttribute("aria-pressed","false")}),t[e]&&t[e].forEach(s=>{s.classList.remove(F)}),n[e]&&n[e].setAttribute("aria-pressed","true")}const oe=async(e,t,n=!1)=>{let s=null;!U&&n===!1&&(await ee(1),U=!0,te()),e&&(t===e?s="external":s=e),await jt("persona-selector",s),n===!0&&(await ee(0),U=!1),xe("preferences_personalisation",s,!0,130),t=s,_e(t),document.dispatchEvent(document.personaChangeEvent),window.location.reload()},qe=async e=>{e===!0?(await ee(1),U=!0,te()):(await ee(0),U=!1,te())};document.addEventListener("DOMContentLoaded",function(){const e=document.querySelector('button[data-click="student-persona"]'),t=document.querySelector('button[data-click="faculty-persona"]'),n=typeof window.pageController<"u"?window.pageController:null,s=document.querySelectorAll('a[data-menu="main-nav"]'),r=document.querySelector('[data-current-story="headline"]'),i=document.querySelector(Jt);i&&new Xt(i);let a=null;const o=JSON.parse(D("squiz.cdp.consent")),l=o==null?void 0:o.CDPConsent,d=document.querySelector('button[data-click="clear-preferences"]'),f={};f.pageData=n,f.consentData=o==null?void 0:o.CDPConsent,f.audienceData=D("preferences_personalisation"),(f.audienceData==="null"||!f.audienceData)&&(f.audienceData="external"),window.suHeaderProps=f,Yt(),n&&s&&s.forEach(c=>{(n==null?void 0:n.id)===c.dataset.id&&(c.classList.remove("su-border-transparent"),c.classList.add("!su-text-digital-red su-border-digital-red dark:su-border-dark-mode-red dark:!su-text-dark-mode-red"))}),n!=null&&n.isStory&&(i.classList.add("report-header--story"),(async()=>(a=await Qt(f.pageData,f.audienceData),Kt(a,n,r,F)))()),!l&&l!=0&&e1(),l&&(te(),d&&(d.removeAttribute("disabled"),d.setAttribute("aria-pressed","false"),d.classList.add("su-text-digital-blue"),d.classList.add("dark:su-text-digital-blue-vivid"),d.addEventListener("click",async function(){await oe(null,null,!0)})));const u=document.querySelector('button[data-click="accept-consent"]'),p=document.querySelector('button[data-click="reject-consent"]');u&&u.addEventListener("click",function(){qe(!0)}),p&&p.addEventListener("click",function(){qe(!1)});const h=D("preferences_personalisation");_e(h==="null"||!h?"external":h),e&&e.addEventListener("click",function(){oe("student",h)}),t&&t.addEventListener("click",function(){oe("faculty",h)})});function tt(e){if(!e)return 0;const t=225,n=e.trim().split(/\s+/).length;return Math.ceil(n/t)}function t1(e,t,n,s=()=>{}){const r=e.slides.length;let i=t-r+1;r%n!==0&&(i+=n-r%n);const a=document.createDocumentFragment(),o=e.slides.map(l=>l.outerHTML).join("");for(let l=0;l<i;l++){const d=document.createElement("div");for(d.innerHTML=o;d.firstChild;)d.firstChild.classList.add("swiper-slide-duplicate"),a.appendChild(d.firstChild)}e.wrapperEl.appendChild(a),e.update(),b(e,"",!1),s()}function N(e,t=()=>{}){const{slidesPerView:n,slidesPerGroup:s}=e.params,r=e.slides.length,i=Math.ceil(n+s);r===1&&(e.navigation.nextEl.remove(),e.navigation.prevEl.remove()),r-1<i||r%s!==0?t1(e,i,s,t):(b(e,"",!1),t())}function re(e){const t=e.slides.filter(n=>n.classList.contains("swiper-slide-duplicate")).length;if(t){let n=e.pagination.bullets.length-e.slides.length+t;for(;n>0;){const s=e.pagination.bullets.pop();s&&s.remove(),n--}}}const b=(e,t,n)=>{e.slides.forEach(s=>{if(s.classList.contains("swiper-slide-active")){if(s.removeAttribute("aria-hidden"),s.removeAttribute("inert"),s.setAttribute("tabindex","-1"),t&&n){let r=null;t==="slide"?r=s:r=s.querySelector(t),r&&r.focus()}}else s.setAttribute("aria-hidden","true"),s.setAttribute("inert","true"),s.removeAttribute("tabindex")}),e.pagination.bullets.length>0&&e.pagination.bullets.forEach(s=>{s.classList.contains("swiper-pagination-bullet-active")?s.setAttribute("aria-current","true"):s.removeAttribute("aria-current")})},s1='section[data-component="basic-story-hero"]',n1='span[data-reading="true"]',st="su-hidden",r1='button[data-click="open-modal"]',a1='button[data-dismiss="modal"]',nt='iframe[data-modal="iframe"]';function i1(e){const t=e.querySelector(nt);if(t){const s=t.getAttribute("src").replace("autoplay=0","autoplay=1");t.setAttribute("src",s)}e.classList.remove(st),e.hidden=!1,document.body.style.overflow="hidden"}function le(e){const t=e.querySelector(nt);if(t){const s=t.getAttribute("src").replace("autoplay=1","autoplay=0");t.setAttribute("src",s)}e.classList.add(st),e.hidden=!0,document.body.style.overflow=""}function o1(e){const t=e.querySelectorAll(r1),n=e.querySelectorAll(a1);let s=null;t&&t.forEach(r=>{r&&r.addEventListener("click",function(){const i=r.dataset.modalId;if(s=e.querySelector(`div[data-modal-id="${i}"]`),!s)return;const a=s.querySelector(".su-modal-content");s.dataset.listenerAdded||(a&&s.addEventListener("click",o=>{a.contains(o.target)||le(s)}),s.dataset.listenerAdded="true"),i1(s)})}),n&&n.forEach(r=>{r&&r.addEventListener("click",function(){s&&le(s)})}),document.addEventListener("keydown",function(r){r.key==="Escape"&&s&&le(s)})}function l1(e){var s;const t=e.dataset.uniqueId;if(e.querySelectorAll(".swiper-slide").length>1){let r=!1;const i=new B(`section[data-unique-id="${t}"] .swiper`,{breakpoints:{0:{slidesPerView:1,spaceBetween:0,centeredSlides:!1},768:{slidesPerView:1,spaceBetween:0,centeredSlides:!1},992:{slidesPerView:1,spaceBetween:0,centeredSlides:!1}},slidesPerView:1,loop:!0,keyboard:{enabled:!0,onlyInViewport:!0},a11y:{prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide"},navigation:{nextEl:`section[data-unique-id="${t}"] .component-slider-next`,prevEl:`section[data-unique-id="${t}"] .component-slider-prev`},pagination:{el:`.component-slider-pagination-${t}`,clickable:!0,bulletElement:"button",renderBullet:function(a,o){return`<button ${a===0?'aria-current="true"':""} class="${o}"><span class="sr-only">Slide ${a+1}</span></button>`}},loopAdditionalSlides:0,watchSlidesProgress:!0,on:{init:a=>{N(a),b(a,"",!1)},resize:a=>{N(a)},paginationUpdate:a=>{re(a)}}});document.addEventListener("keydown",function(){r=!0}),document.addEventListener("mousedown",()=>{r=!1}),document.addEventListener("touchstart",()=>{r=!1}),document.addEventListener("pointerdown",()=>{r=!1}),i.on("slideChange",function(){setTimeout(()=>{r?b(i,"slide",!0):b(i,"",!1)},100)})}else(s=e.querySelector(".component-slider-controls"))==null||s.remove()}function c1(e){const t=document.querySelector(".su-page-content"),n=e.querySelector(n1);if(t&&n){const s=tt(t.innerText);n.textContent=s}}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(s1).forEach(e=>{l1(e),o1(e),c1(e)})});const d1='section[data-component="combined-content-grid"]',rt="su-hidden",u1='button[data-click="open-modal"]',f1='button[data-dismiss="modal"]',at='iframe[data-modal="iframe"]';function p1(e){const t=e.querySelector(at),s=t.getAttribute("src").replace("autoplay=0","autoplay=1");t.setAttribute("src",s),e.classList.remove(rt),e.hidden=!1,document.body.style.overflow="hidden"}function ce(e){const t=e.querySelector(at),s=t.getAttribute("src").replace("autoplay=1","autoplay=0");t.setAttribute("src",s),e.classList.add(rt),e.hidden=!0,document.body.style.overflow=""}function h1(e){const t=e.querySelectorAll(u1),n=e.querySelectorAll(f1);let s=null;t&&t.forEach(r=>{r&&r.addEventListener("click",function(){const i=r.dataset.modalId;if(s=e.querySelector(`div[data-modal-id="${i}"]`),!s)return;const a=s.querySelector(".su-modal-content");s.dataset.listenerAdded||(a&&s.addEventListener("click",o=>{a.contains(o.target)||ce(s)}),s.dataset.listenerAdded="true"),p1(s)})}),n&&n.forEach(r=>{r&&r.addEventListener("click",function(){s&&ce(s)})}),document.addEventListener("keydown",function(r){r.key==="Escape"&&s&&ce(s)})}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(d1).forEach(e=>{h1(e)})});const m1='section[data-component="content-carousel"]';function C1(e){var s;const t=e.dataset.uniqueId;if(e.querySelectorAll(".swiper-slide").length>1){let r=!1;const i=new B(`section[data-unique-id="${t}"] .swiper`,{breakpoints:{0:{slidesPerView:1,centeredSlides:!1},768:{slidesPerView:1,centeredSlides:!1},992:{slidesPerView:1,centeredSlides:!1}},slidesPerView:1,variantClassName:"component-slider-single",loop:!0,watchSlidesProgress:!0,spaceBetween:40,keyboard:{enabled:!0,onlyInViewport:!0},a11y:{prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide"},navigation:{nextEl:`section[data-unique-id="${t}"] .component-slider-next`,prevEl:`section[data-unique-id="${t}"] .component-slider-prev`},pagination:{el:`.component-slider-pagination-${t}`,clickable:!0,bulletElement:"button",renderBullet:function(a,o){return`<button ${a===0?'aria-current="true"':""} class="${o}"><span class="sr-only">Slide ${a+1}</span></button>`}},on:{init:a=>{N(a),b(a,"",!1)},resize:a=>{N(a)},paginationUpdate:a=>{re(a)}}});document.addEventListener("keydown",function(){r=!0}),document.addEventListener("mousedown",()=>{r=!1}),document.addEventListener("touchstart",()=>{r=!1}),document.addEventListener("pointerdown",()=>{r=!1}),i.on("slideChange",function(){setTimeout(()=>{r?b(i,"slide",!0):b(i,"",!1)},100)})}else(s=e.querySelector(".component-slider-controls"))==null||s.remove()}function it(){document.querySelectorAll(m1).forEach(e=>{C1(e)})}document.addEventListener("DOMContentLoaded",it);document.addEventListener("livePreviewUpdated",it);const g1='section[data-component="feature-story-hero"]',v1='span[data-reading="true"]';function y1(e){const t=document.querySelector(".su-page-content"),n=e.querySelector(v1);if(t&&n){const s=tt(t.innerText);n.textContent=s}}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(g1).forEach(e=>{y1(e)})});const w1='section[data-component="featured-content"]',ot="su-hidden",L1='button[data-click="open-modal"]',E1='button[data-dismiss="modal"]',lt='iframe[data-modal="iframe"]';function b1(e){const t=e.querySelector(lt),s=t.getAttribute("src").replace("autoplay=0","autoplay=1");t.setAttribute("src",s),e.classList.remove(ot),e.hidden=!1,document.body.style.overflow="hidden"}function de(e){const t=e.querySelector(lt),s=t.getAttribute("src").replace("autoplay=1","autoplay=0");t.setAttribute("src",s),e.classList.add(ot),e.hidden=!0,document.body.style.overflow=""}function S1(e){const t=e.querySelectorAll(L1),n=e.querySelectorAll(E1);let s=null;t&&t.forEach(r=>{r&&r.addEventListener("click",function(){const i=r.dataset.modalId;if(s=e.querySelector(`div[data-modal-id="${i}"]`),!s)return;const a=s.querySelector(".su-modal-content");s.dataset.listenerAdded||(a&&s.addEventListener("click",o=>{a.contains(o.target)||de(s)}),s.dataset.listenerAdded="true"),b1(s)})}),n&&n.forEach(r=>{r&&r.addEventListener("click",function(){s&&de(s)})}),document.addEventListener("keydown",function(r){r.key==="Escape"&&s&&de(s)})}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(w1).forEach(e=>{S1(e)})});const A1='section[data-component="horizontal-video-testimonials"]',ct="su-hidden",x1='button[data-click="open-modal"]',_1='button[data-dismiss="modal"]',dt='iframe[data-modal="iframe"]';function T1(e){const t=e.querySelector(dt);if(t){const n=t.getAttribute("src"),s=n&&n.replace("autoplay=0","autoplay=1");t.setAttribute("src",s)}e.classList.remove(ct),e.hidden=!1,document.body.style.overflow="hidden"}function ue(e){const t=e.querySelector(dt);if(t){const n=t.getAttribute("src"),s=n&&n.replace("autoplay=1","autoplay=0");t.setAttribute("src",s)}e.classList.add(ct),e.hidden=!0,document.body.style.overflow=""}function I1(e){const t=e.querySelectorAll(x1),n=e.querySelectorAll(_1);let s=null;t&&t.forEach(r=>{r&&r.addEventListener("click",function(){const i=r.dataset.modalId;if(s=e.querySelector(`div[data-modal-id="${i}"]`),!s)return;const a=s.querySelector(".su-modal-content");s.dataset.listenerAdded||(a&&s.addEventListener("click",o=>{a.contains(o.target)||ue(s)}),s.dataset.listenerAdded="true"),T1(s)})}),n&&n.forEach(r=>{r&&r.addEventListener("click",function(){s&&ue(s)})}),document.addEventListener("keydown",function(r){r.key==="Escape"&&s&&ue(s)})}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(A1).forEach(e=>{I1(e)})});const k1='section[data-component="image-gallery-modal"]',M1='button[data-click="open-gallery-modal"]',$1='div[data-modal="modal"]',O1='button[data-dismiss="modal"]',ut="su-hidden";let Te;const V1=(e,t)=>{var a;const n='a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])',s=(a=Array.from(t==null?void 0:t.querySelectorAll(n)))==null?void 0:a.filter(o=>!o.hasAttribute("disabled")&&!o.getAttribute("aria-hidden"));if(s.length===0||(e==null?void 0:e.key)!=="Tab")return;const r=s[0],i=s[s.length-1];e.shiftKey&&document.activeElement===r?(e.preventDefault(),i.focus()):!e.shiftKey&&document.activeElement===i&&(e.preventDefault(),r.focus())};function q1(e){e.classList.remove(ut),e.hidden=!1,document.body.style.overflow="hidden",document.addEventListener("keydown",t=>{e&&V1(t,e)})}function fe(e){e.classList.add(ut),e.hidden=!0,document.body.style.overflow=""}function H1(e){const t=e.dataset.modalId;Te=new B(`div[data-modal-id="${t}"] .swiper`,{slidesPerView:1,variantClassName:"component-slider-imagegallery",loop:!0,keyboard:{enabled:!0,onlyInViewport:!0},a11y:{prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide"},navigation:{nextEl:`div[data-modal-id="${t}"] .component-slider-next`,prevEl:`div[data-modal-id="${t}"] .component-slider-prev`},pagination:{el:`.component-slider-pagination-${t}`,clickable:!0,bulletElement:"button",renderBullet:function(n,s){return`<button ${n===0?'aria-current="true"':""} class="${s}"><span class="sr-only">Slide ${n+1}</span></button>`}},watchSlidesProgress:!0,breakpoints:{0:{slidesPerView:1,spaceBetween:0,centeredSlides:!1},768:{slidesPerView:1,spaceBetween:0,centeredSlides:!1},992:{slidesPerView:1,spaceBetween:0,centeredSlides:!1}}})}function N1(e){const t=e.querySelector($1),n=e.querySelector(M1),s=e.querySelector(O1);n&&n.addEventListener("click",function(){const r=t.querySelector(".su-modal-content");t.dataset.listenerAdded||(r&&t.addEventListener("click",i=>{r.contains(i.target)||fe(t)}),t.dataset.listenerAdded="true"),q1(t),H1(t)}),s&&s.addEventListener("click",function(){fe(t),Te.destroy()}),document.addEventListener("keydown",function(r){r.key==="Escape"&&(fe(t),Te.destroy())})}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(k1).forEach(e=>{N1(e)})});const R1='[data-component="interactive-photo-card"]',D1="[data-card-inner]",B1="[data-card-inner-content]";function P1(e){var s;const n=((e.style.transform&&parseInt((s=e.style.transform.match(/rotateY\((\d+)deg\)/))==null?void 0:s[1])||0)+180)%360;e.style.transform=`rotateY(${n}deg)`}function Z1(e){const t=e.querySelector(D1);if(!t){console.error("Could not find card inner element for component");return}t.addEventListener("click",()=>P1(t))}const G1=e=>{e.forEach(t=>{const n=t.getAttribute("aria-hidden")==="true"?"false":"true",s=t.querySelector("button");s&&(s.tabIndex=n==="true"?"-1":""),t.setAttribute("aria-hidden",n)})},U1=e=>{const t=e.querySelectorAll(B1);t.length&&t.forEach(n=>n.addEventListener("click",()=>G1(t)))};function ft(){document.querySelectorAll(R1).forEach(e=>{Z1(e),U1(e)})}document.addEventListener("DOMContentLoaded",ft);document.addEventListener("livePreviewUpdated",ft);function F1({title:e,listMetadata:{assetTypeCode:t,teaserPlain:n,summary:s,image:r,taxonomyContentTypeText:i,contentTopic:a,contentSubtopic:o,taxonomyContentMainTopicText:l,contentCategory:d,featuredVideo:f,taxonomyContentMainTopicLandingPageUrl:u,taxonomyFeaturedUnitLandingPageUrl:p,taxonomyFeaturedUnitText:h,imageAlt:c,authorName:w,authorImage:g,author:v,isTeaser:C,storySource:m,assetHref:S},date:$,liveUrl:O}){const V=w!==void 0?w:v,A=g!==""?g:void 0,I=r&&r!==""?r:null,L=c&&c!==""?c:"",k=f,P=n||s;let q=l;!q&&a&&(q=a instanceof Array?a[0]:a),!q&&o&&(q=o instanceof Array?o[0]:o);const ie=u;let Z=i?i[0]:"";return!Z&&d&&(Z=d instanceof Array?d[0]:d),S&&t[0]==="link"&&(O=S),{title:Array.isArray(e)?e[0]:e,description:Array.isArray(P)?P[0]:P,liveUrl:Array.isArray(O)?O[0]:O,imageUrl:Array.isArray(I)?I[0]:I,imageAlt:Array.isArray(L)?L[0]:L,taxonomy:Array.isArray(q)?q[0]:q,taxonomyUrl:Array.isArray(ie)?ie[0]:ie,type:Array.isArray(Z)?Z[0]:Z,videoUrl:Array.isArray(k)?k[0]:k,date:Array.isArray($)?$[0]:$,authorDisplayName:Array.isArray(V)?V[0]:V,authorAvatar:Array.isArray(A)?A[0]:A,taxonomyFeaturedUnitLandingPageUrl:Array.isArray(p)?p[0]:p,taxonomyFeaturedUnitText:Array.isArray(h)?h[0]:h,isTeaser:Array.isArray(C)?C[0]:C,storySource:Array.isArray(m)?m[0]:m}}function pe(e){if(!e)return null;const t=new Date(e);return`${new Intl.DateTimeFormat("en",{month:"long",day:"numeric",year:"numeric",timeZone:"UTC"}).format(t)}`}function pt(e){return!!e&&!(e!=null&&e.includes("news.stanford.edu"))}const z1=()=>{let e=new Date().getTime(),t=typeof performance<"u"&&performance.now&&performance.now()*1e3||0;return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,n=>{let s=Math.random()*16;return e>0?(s=(e+s)%16|0,e=Math.floor(e/16)):(s=(t+s)%16|0,t=Math.floor(t/16)),(n==="x"?s:s&3|8).toString(16)})},W1=()=>(1e7.toString()+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,e=>(Number(e)^crypto.getRandomValues(new Uint8Array(1))[0]&15>>Number(e)/4).toString(16)),j1=()=>typeof crypto<"u"?W1():z1();async function Y1(e=null,t="",n=null){var r,i,a,o,l,d,f,u,p,h,c,w,g,v,C,m,S,$,O;const s=new Ke;if(e&&((r=e==null?void 0:e.search)!=null&&r.endpoint)){const V=`
            ${(a=(i=e==null?void 0:e.search)==null?void 0:i.endpoint)==null?void 0:a.replace(/\.html/g,".json")}
            ?profile=${(o=e==null?void 0:e.search)==null?void 0:o.profile}
            &collection=${(l=e==null?void 0:e.search)==null?void 0:l.collection}
            &query=[taxonomyContentMainTopicId:${e.mainTopicId} taxonomyContentTopicsId:${e.mainTopicId} taxonomyContentSubtopicsId:${e.mainTopicId}]
            &query_not=[taxonomyContentTypeId:28210 taxonomyContentTypeId:28216 taxonomyContentTypeId:28201 id:${e.id}]
            &meta_taxonomyAudienceText=${Je(t)}&num_ranks=3&sort=date&log=false&meta_isTeaser=false`;let A=V;n&&(n!=null&&n.behavioural)&&(A=`${(f=(d=e==null?void 0:e.search)==null?void 0:d.endpoint)==null?void 0:f.replace(/\.html/g,".json")}
                ?profile=${(u=e==null?void 0:e.search)==null?void 0:u.profile}
                &collection=${(p=e==null?void 0:e.search)==null?void 0:p.collection}${n.partialQuery}&num_ranks=3&log=false&meta_isTeaser=false`),s.url=A.replace(/\n+|\t+| {2,}/g,"");let L=((c=(h=(await s.fetch()).response)==null?void 0:h.resultPacket)==null?void 0:c.results)||null;if(L&&L.length<3&&(s.url=V.replace(/\n+|\t+| {2,}/g,""),L=((g=(w=(await s.fetch()).response)==null?void 0:w.resultPacket)==null?void 0:g.results)||null,L&&L.length<3)){const P=`${(C=(v=e==null?void 0:e.search)==null?void 0:v.endpoint)==null?void 0:C.replace(/\.html/g,".json")}
                    ?profile=${(m=e==null?void 0:e.search)==null?void 0:m.profile}
                    &collection=${(S=e==null?void 0:e.search)==null?void 0:S.collection}&query_not=[taxonomyContentTypeId:28210 taxonomyContentTypeId:28216 taxonomyContentTypeId:28201 id:${e.id}]&num_ranks=3&sort=date&log=false&meta_isTeaser=false`;s.url=P.replace(/\n+|\t+| {2,}/g,""),L=((O=($=(await s.fetch()).response)==null?void 0:$.resultPacket)==null?void 0:O.results)||null}return L}return null}const he={WRAPPER:'[data-role="link-list-wrap"]',TOGGLE:'[data-role="link-drawer-toggle"]',DRAWER:'[data-role="link-drawer"]'},E={ACTIVE:"su-rotate-90",INACTIVE:"su-rotate-[-90deg]",OPEN:"su-h-auto",CLOSED:"su-h-0",VISIBLE:"su-opacity-[1]",HIDDEN:"su-opacity-[0]",NO_STORIES:"su-link-list-no-stories"};function X1(e,t){var s;if(!(((s=e==null?void 0:e.dataset)==null?void 0:s.active)==="true")){e.dataset.active=!0,e.classList.remove(E.INACTIVE),e.classList.add(E.ACTIVE),t.classList.remove(E.CLOSED),t.classList.add(E.OPEN);return}e.dataset.active=!1,e.classList.add(E.INACTIVE),e.classList.remove(E.ACTIVE),t.classList.add(E.CLOSED),t.classList.remove(E.OPEN)}function Q1(e){const t=document.body.getBoundingClientRect().height,n=window.scrollY+window.innerHeight;if(window.scrollY>=Math.round(30/100*document.body.clientHeight)&&n<=t-700){e.classList.remove(E.HIDDEN),e.classList.remove("su-bottom-[-100px]"),e.classList.add(E.VISIBLE),e.classList.add("su-bottom-0");return}e.classList.remove(E.VISIBLE),e.classList.add("su-bottom-[-100px]"),e.classList.add(E.HIDDEN),e.classList.remove("su-bottom-0")}function K1(e,t){return`
        <a href="${t}" class="su-no-underline hocus:su-underline">
            <h3 class="su-text-16 su-font-bold su-m-0 lg:su-text-24 lg:su-leading-[28.8px]">
                ${e}
            </h3>
        </a>
    `}function J1(e,t,n){if(!e.length){t.classList.add(E.NO_STORIES);return}const[s,r,i]=e;n.innerHTML=`
        ${s?`<article class="su-border-b su-border-b-black-20 dark:su-border-b-black-70 su-pb-15 su-mt-[23.65px] lg:su-pb-36">${s}</article>`:""}
        ${r?`<article class="su-border-b dark:su-border-b-black-70 su-border-b-black-20 su-py-15 lg:su-py-36">${r}</article>`:""}
        ${i?`<article class="su-pt-15 lg:su-pt-36">${i}</article>`:""}
    `,t.classList.remove(E.NO_STORIES)}async function es(e,t,n,s,r,i){const o=(await Y1(e,i,t)).map(({title:l,indexUrl:d})=>K1(l,d));J1(o,n,r),ts(n,s,r)}function ts(e,t,n){t.addEventListener("click",function(){X1(t,n)}),window.addEventListener("scroll",function(){Q1(e)})}function ss(e,t,n,s){if(!e||!window.pageController)return;const r=window.pageController,i=r.topicsQuery?r.topicsQuery():null;es(r,i,e,t,n,s)}document.addEventListener("DOMContentLoaded",function(){const e=document.querySelector(he.WRAPPER),t=document.querySelector(he.TOGGLE),n=document.querySelector(he.DRAWER),s=D("preferences_personalisation");ss(e,t,n,s)});const ns='section[data-component="media-carousel"]';function rs(e){const t=e.dataset.uniqueId,n=new B(`section[data-unique-id="${t}"] .swiper`,{breakpoints:{0:{slidesPerView:1.4,spaceBetween:0,centeredSlides:!0,initialSlide:0},768:{slidesPerView:1.1,spaceBetween:0,centeredSlides:!0,initialSlide:0},992:{slidesPerView:1,spaceBetween:0,centeredSlides:!1,initialSlide:0}},slidesPerView:1,variantClassName:"component-slider-single component-slider-peek",loopAdditionalSlides:0,slidesPerGroup:1,watchSlidesProgress:!0,loop:!0,keyboard:{enabled:!0,onlyInViewport:!0},a11y:{prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide"},navigation:{nextEl:`section[data-unique-id="${t}"] .component-slider-next`,prevEl:`section[data-unique-id="${t}"] .component-slider-prev`},pagination:{el:`.component-slider-pagination-${t}`,clickable:!0,bulletElement:"button",renderBullet:function(a,o){return`<button ${a===0?'aria-current="true"':""} class="${o} ${a===0?"swiper-pagination-bullet-active":""}"><span class="sr-only">Slide ${a+1}</span></button>`}},on:{init:a=>{N(a),b(a,"",!1),a.activeIndex===1&&a.slidePrev()},resize:a=>{N(a)},paginationUpdate:a=>{re(a)}}}),s=n.slides.length,r=n.slides.filter(a=>a.classList.contains("swiper-slide-duplicate")).length;if(Math.floor(s-r)>1){let a=!1;document.addEventListener("keydown",function(){a=!0}),document.addEventListener("mousedown",()=>{a=!1}),document.addEventListener("touchstart",()=>{a=!1}),document.addEventListener("pointerdown",()=>{a=!1}),n.on("slideChange",function(){setTimeout(()=>{a?b(n,"h2 a, h3 a, button",!0):b(n,"",!1)},100)})}}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(ns).forEach(e=>{rs(e)})});const as='button[data-role="copy-link"]';function is(e){e.addEventListener("click",function(){navigator.clipboard.writeText(window.location.href).then(()=>{const t=document.querySelector("[data-copy-text]");t.textContent="Copied",setTimeout(()=>{t.textContent="Copy link"},3e3)})})}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(as).forEach(e=>{is(e)})});const os='section[data-component="multicolumn-listing"]',ht="su-hidden",ls='button[data-click="open-modal"]',cs='button[data-dismiss="modal"]',mt='iframe[data-modal="iframe"]';function ds(e){const t=e.querySelector(mt),s=t.getAttribute("src").replace("autoplay=0","autoplay=1");t.setAttribute("src",s),e.classList.remove(ht),e.hidden=!1,document.body.style.overflow="hidden"}function me(e){const t=e.querySelector(mt),s=t.getAttribute("src").replace("autoplay=1","autoplay=0");t.setAttribute("src",s),e.classList.add(ht),e.hidden=!0,document.body.style.overflow=""}function us(e){const t=e.querySelectorAll(ls),n=e.querySelectorAll(cs);let s=null;t&&t.forEach(r=>{r&&r.addEventListener("click",function(){const i=r.dataset.modalId;if(s=e.querySelector(`div[data-modal-id="${i}"]`),!s)return;const a=s.querySelector(".su-modal-content");s.dataset.listenerAdded||(a&&s.addEventListener("click",o=>{a.contains(o.target)||me(s)}),s.dataset.listenerAdded="true"),ds(s)})}),n&&n.forEach(r=>{r&&r.addEventListener("click",function(){s&&me(s)})}),document.addEventListener("keydown",function(r){r.key==="Escape"&&s&&me(s)})}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(os).forEach(e=>{us(e)})});const fs='section[data-component="sidebar-navigation"]',ps='nav[data-nav="nav"]',se="su-hidden",hs='button[data-click="toggle-nav"]',ms="su-bg-digital-red su-text-white dark:su-bg-dark-mode-red dark:aria-expanded:su-text-black-true",Cs='span[data-label="button"]';function Ct(e,t){const n=e.querySelector(Cs),s=e.querySelector('svg[data-icon="bars"]'),r=e.querySelector('svg[data-icon="xmark"]');e.setAttribute("aria-expanded",t.toString()),ms.split(" ").forEach(i=>{e.classList.toggle(i,t)}),s&&(s.classList.toggle(`!${se}`,t),s.hidden=t),r&&(r.classList.toggle(`!${se}`,!t),r.hidden=!t),n&&(n.innerHTML=t?n.getAttribute("data-label-close"):n.getAttribute("data-label-open"))}function He(e,t){e.classList.remove(se),e.hidden=!1,Ct(t,!0)}function z(e,t){e.classList.add(se),e.hidden=!0,Ct(t,!1)}function gs(e){const t=e.querySelector(hs),n=e.querySelector(ps);let s;t&&t.addEventListener("click",function(){const r=t.getAttribute("aria-expanded")==="true";n.dataset.listenerAdded||(document.addEventListener("click",i=>{const a=n.contains(i.target),o=t.contains(i.target);!a&&!o&&z(n,t)}),n.dataset.listenerAdded="true"),r?z(n,t):He(n,t)}),document.addEventListener("keydown",function(r){r.key==="Escape"&&n&&t&&z(n,t)}),window.addEventListener("resize",()=>{clearTimeout(s),s=setTimeout(()=>{window.innerWidth>991?n&&t&&He(n,t):n&&t&&z(n,t)},10)})}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(fs).forEach(e=>{gs(e)})});function W(e,t){e.contentWindow.postMessage(JSON.stringify({method:t}),"*")}function j(e,t){const n=e.querySelector('svg[data-control="play"]'),s=e.querySelector('svg[data-control="pause"]'),r=!t;e.setAttribute("aria-pressed",String(r)),n.classList.toggle("su-hidden",r),n.hidden=r,s.classList.toggle("su-hidden",!r),s.hidden=!r,e.innerHTML=`
    <span class="*:su-size-14 su-flex su-gap-6 su-items-center su-text-14 lg:su-top-0 lg:su-right-0">
        ${n.outerHTML}
        ${s.outerHTML}
        ${r?e.getAttribute("data-label-pause"):e.getAttribute("data-label-play")}
    </span>
  `}const vs='section[data-component="single-image-video"]',ys='iframe[data-role="video-player"]',ws='button[data-role="video-control"]',gt="su-hidden",Ls='button[data-click="open-modal"]',Es='button[data-dismiss="modal"]',vt='iframe[data-modal="iframe"]',bs=(e,t)=>{var a;const n='[data-focus-scope-start="true"], [data-focus-scope-end="true"], a, button, input, textarea, select, details, iframe, [tabindex]:not([tabindex="-1"])',s=(a=Array.from(t==null?void 0:t.querySelectorAll(n)))==null?void 0:a.filter(o=>!o.hasAttribute("disabled")&&!o.getAttribute("aria-hidden"));if(s.length===0||(e==null?void 0:e.key)!=="Tab")return;const r=s[0],i=s[s.length-1];e.shiftKey&&document.activeElement===r?(e.preventDefault(),i.focus()):!e.shiftKey&&document.activeElement===i&&(e.preventDefault(),r.focus())};function Ss(e){const t=e.querySelector(vt),s=t.getAttribute("src").replace("autoplay=0","autoplay=1");t.setAttribute("src",s),e.classList.remove(gt),e.hidden=!1,document.body.style.overflow="hidden",e.querySelector('[data-focus-scope-start="true"]').focus(),document.addEventListener("keydown",r=>{e&&bs(r,e)})}function Ce(e){const t=e.querySelector(vt),s=t.getAttribute("src").replace("autoplay=1","autoplay=0");t.setAttribute("src",s),e.classList.add(gt),e.hidden=!0,document.body.style.overflow=""}function As(e){const t=e.querySelectorAll(Ls),n=e.querySelectorAll(Es);let s=null;t&&t.forEach(r=>{r&&r.addEventListener("click",function(){const i=r.dataset.modalId;if(s=e.querySelector(`div[data-modal-id="${i}"]`),!s)return;const a=s.querySelector(".su-modal-content");s.dataset.listenerAdded||(a&&s.addEventListener("click",o=>{a.contains(o.target)||Ce(s)}),s.dataset.listenerAdded="true"),Ss(s)})}),n&&n.forEach(r=>{r&&r.addEventListener("click",function(){s&&Ce(s)})}),document.addEventListener("keydown",function(r){r.key==="Escape"&&s&&Ce(s)})}function xs(e){const t=e.querySelector(ys),n=e.querySelector(ws);let s=!1;if(!t||!n)return;new IntersectionObserver(i=>{i.forEach(a=>{a.isIntersecting&&!s?(W(t,"play"),j(n,!1)):a.isIntersecting||(W(t,"pause"),j(n,!0))})},{threshold:.5}).observe(t),n.addEventListener("click",()=>{n.getAttribute("aria-pressed")==="true"?(W(t,"pause"),j(n,!0),s=!0):(W(t,"play"),j(n,!1),s=!1)})}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(vs).forEach(e=>{As(e),xs(e)})});const _s='section[data-component="standalone-visual-hero"]',yt="su-hidden",Ts='button[data-click="open-modal"]',Is='button[data-dismiss="modal"]',wt='iframe[data-modal="iframe"]';function ks(e){const t=e.querySelector(wt);if(t){const s=t.getAttribute("src").replace("autoplay=0","autoplay=1");t.setAttribute("src",s)}e.classList.remove(yt),e.hidden=!1,document.body.style.overflow="hidden"}function ge(e){const t=e.querySelector(wt);if(t){const s=t.getAttribute("src").replace("autoplay=1","autoplay=0");t.setAttribute("src",s)}e.classList.add(yt),e.hidden=!0,document.body.style.overflow=""}function Ms(e){const t=e.querySelectorAll(Ts),n=e.querySelectorAll(Is);let s=null;t.forEach(r=>{r.addEventListener("click",function(){const i=r.dataset.modalId;if(s=e.querySelector(`div[data-modal-id="${i}"]`),!s)return;const a=s.querySelector(".su-modal-content");s.dataset.listenerAdded||(a&&s.addEventListener("click",o=>{a.contains(o.target)||ge(s)}),s.dataset.listenerAdded="true"),ks(s)})}),n.forEach(r=>{r.addEventListener("click",function(){s&&ge(s)})}),document.addEventListener("keydown",function(r){r.key==="Escape"&&s&&ge(s)})}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(_s).forEach(e=>{Ms(e)})});const $s='section[data-component="stories-carousel"]',Lt="su-hidden",Os='button[data-click="open-modal"]',Vs='button[data-dismiss="modal"]',Et='iframe[data-modal="iframe"]';function qs(e){const t=e.querySelector(Et),s=t.getAttribute("src").replace("autoplay=0","autoplay=1");t.setAttribute("src",s),e.classList.remove(Lt),e.hidden=!1,document.body.style.overflow="hidden"}function ve(e){const t=e.querySelector(Et),s=t.getAttribute("src").replace("autoplay=1","autoplay=0");t.setAttribute("src",s),e.classList.add(Lt),e.hidden=!0,document.body.style.overflow=""}function Hs(e){const t=e.querySelectorAll(Os),n=e.querySelectorAll(Vs);let s=null;t&&t.forEach(r=>{r&&r.addEventListener("click",function(){const i=r.dataset.modalId;if(s=e.querySelector(`div[data-modal-id="${i}"]`),!s)return;const a=s.querySelector(".su-modal-content");s.dataset.listenerAdded||(a&&s.addEventListener("click",o=>{a.contains(o.target)||ve(s)}),s.dataset.listenerAdded="true"),qs(s)})}),n&&n.forEach(r=>{r&&r.addEventListener("click",function(){s&&ve(s)})}),document.addEventListener("keydown",function(r){r.key==="Escape"&&s&&ve(s)})}let Ne=!1,Re=!1;function Ns(e){const t=e.dataset.uniqueId,n=`section[data-unique-id="${t}"] .swiper`;new B(n,{breakpoints:{0:{slidesPerView:1.5,spaceBetween:40,centeredSlides:!0},768:{slidesPerView:3,spaceBetween:72,centeredSlides:!1},992:{slidesPerView:3,spaceBetween:102,centeredSlides:!1}},slidesPerView:1.5,spaceBetween:40,variantClassName:"component-slider-cards component-slider-peek",loop:!0,keyboard:{enabled:!0,onlyInViewport:!0},a11y:{prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide"},navigation:{nextEl:`section[data-unique-id="${t}"] .component-slider-next`,prevEl:`section[data-unique-id="${t}"] .component-slider-prev`},pagination:{el:`.component-slider-pagination-${t}`,clickable:!0,bulletElement:"button",renderBullet:function(s,r){return`<button ${s===0?'aria-current="true"':""} class="${r}"><span class="sr-only">Slide ${s+1}</span></button>`}},watchSlidesProgress:!0,on:{init:function(){setTimeout(()=>{Re=!0,Ne=!0},500)},slideChange:function(s){const r=document.querySelector(n),i=r.querySelector(".swiper-slide-active");i&&i.removeAttribute("tabindex"),Re&&setTimeout(()=>{const a=r.querySelector(".swiper-slide-active"),o=a.querySelector("h2 a, h3 a, button")?a.querySelector("h2 a, h3 a, button"):(()=>(a.setAttribute("tabindex","-1"),a))();Ne&&o.focus()},300),s.slides.forEach(a=>{a.classList.contains("swiper-slide-visible")?(a.removeAttribute("aria-hidden"),a.removeAttribute("inert")):(a.setAttribute("aria-hidden","true"),a.setAttribute("inert","true"))}),s.pagination.bullets.length>0&&s.pagination.bullets.forEach(a=>{a.classList.contains("swiper-pagination-bullet-active")?a.setAttribute("aria-current","true"):a.removeAttribute("aria-current")})}}})}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll($s).forEach(e=>{Ns(e),Hs(e)})});const Rs='section[data-component="subscribe-to-stanford-report"]';function Ds(e){const t=e.querySelector("form"),n=t.querySelector('input[type="email"]'),s=t.querySelector("#error-container");t.addEventListener("submit",function(r){r.preventDefault();let i="";const a=n.value;if(!a||!a.match(/\w+@\w+\.\w+/)){i='<span id="subscription-error" class="su-block su-text-16 su-font-normal su-text-digital-red-light">Please enter a valid email address.</span>',s.innerHTML=i,n.setAttribute("aria-describedby","subscription-error");return}s.innerHTML="",n.removeAttribute("aria-describedby"),r.target.submit()}),n.addEventListener("keyup",function(){const r=n.value,i=t.querySelector("#error-container");r.match(/\w+@\w+\.\w+/)&&(i.innerHTML="",n.removeAttribute("aria-describedby"))})}function Bs(){document.querySelectorAll(Rs).forEach(e=>{Ds(e)})}typeof document<"u"&&document.addEventListener("DOMContentLoaded",Bs);function Ps({offsetNum:e,pageNumber:t,index:n}){return`
        <button
            data-offset="${e}"
            class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white ${e===t?"su-bg-digital-red su-rounded-[100px] su-text-white":"su-text-black"}"
            ${e===t?"disabled":""}
            type="button"
        >
            ${n}
        </button>
    `}function Zs({pageNumber:e,allResults:t,resultsPerPage:n,paginationRange:s,currentPage:r=1}){const i=Math.ceil(t/n),a=s,o=e-n,l=e+n,d="su-text-black-50",f=[],u=[];for(let C=0;C<i;C++){const m=C*n+1;u.push(m)}let p=[...u],h=[...u];const c=u.indexOf(r),w=Math.floor(a*.5);if((c<w||i===a)&&(p=p.filter((C,m)=>C>r&&m<a),h=h.filter(C=>C<r)),c>=w&&i!==a)if(p=p.filter((C,m)=>C>r&&m<=c+w),p.length===w)h=h.filter((C,m)=>C<r&&m>=c-w);else{const C=p.length?a-p.length:a;h=h.filter((m,S)=>m<r&&S>c-C)}return[...h,r,...p].map(C=>({offset:C,index:u.indexOf(C)+1})).forEach(({offset:C,index:m})=>{f.push(Ps({offsetNum:C,pageNumber:e,index:m}))}),i>1?`<div class="su-mx-auto su-component-container">
                <div class="su-flex su-gap-9 su-items-center su-justify-center su-rs-mt-4 lg:su-rs-mt-7">
                    <button
                        type="button"
                        class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white ${o<1?d:""}"
                        ${o<1?"disabled":""}
                        data-offset="${o<1?1:o}"
                        aria-label="Previous page"
                        title="Previous page"
                    >
                        <svg width='8' height='12' viewBox='0 0 8 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path fill-rule='evenodd' clip-rule='evenodd' d='M7.24855 0.351472C7.71718 0.820101 7.71718 1.5799 7.24855 2.04853L3.29708 6L7.24855 9.95147C7.71718 10.4201 7.71718 11.1799 7.24855 11.6485C6.77992 12.1172 6.02013 12.1172 5.5515 11.6485L0.751496 6.84853C0.282867 6.3799 0.282867 5.6201 0.751496 5.15147L5.5515 0.351472C6.02013 -0.117157 6.77992 -0.117157 7.24855 0.351472Z'/>
                        </svg>
                    </button>

                    ${f.join("")}

                    <button
                    type="button"
                        class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white ${l>u[u.length-1]?d:""}"
                        ${l>u[u.length-1]?"disabled":""}
                        data-offset="${l>u[u.length-1]?u[u.length-1]:l}"
                        aria-label="Next page"
                        title="Next page"
                    >
                        <svg class='su-fill-transparent su-stroke-current' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' aria-hidden='true'>
                            <path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
                        </svg>
                    </button>
                </div>
            </div>`:""}function Gs(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Ie={exports:{}},y={},ke={exports:{}},R={};function bt(){var e={};return e["align-content"]=!1,e["align-items"]=!1,e["align-self"]=!1,e["alignment-adjust"]=!1,e["alignment-baseline"]=!1,e.all=!1,e["anchor-point"]=!1,e.animation=!1,e["animation-delay"]=!1,e["animation-direction"]=!1,e["animation-duration"]=!1,e["animation-fill-mode"]=!1,e["animation-iteration-count"]=!1,e["animation-name"]=!1,e["animation-play-state"]=!1,e["animation-timing-function"]=!1,e.azimuth=!1,e["backface-visibility"]=!1,e.background=!0,e["background-attachment"]=!0,e["background-clip"]=!0,e["background-color"]=!0,e["background-image"]=!0,e["background-origin"]=!0,e["background-position"]=!0,e["background-repeat"]=!0,e["background-size"]=!0,e["baseline-shift"]=!1,e.binding=!1,e.bleed=!1,e["bookmark-label"]=!1,e["bookmark-level"]=!1,e["bookmark-state"]=!1,e.border=!0,e["border-bottom"]=!0,e["border-bottom-color"]=!0,e["border-bottom-left-radius"]=!0,e["border-bottom-right-radius"]=!0,e["border-bottom-style"]=!0,e["border-bottom-width"]=!0,e["border-collapse"]=!0,e["border-color"]=!0,e["border-image"]=!0,e["border-image-outset"]=!0,e["border-image-repeat"]=!0,e["border-image-slice"]=!0,e["border-image-source"]=!0,e["border-image-width"]=!0,e["border-left"]=!0,e["border-left-color"]=!0,e["border-left-style"]=!0,e["border-left-width"]=!0,e["border-radius"]=!0,e["border-right"]=!0,e["border-right-color"]=!0,e["border-right-style"]=!0,e["border-right-width"]=!0,e["border-spacing"]=!0,e["border-style"]=!0,e["border-top"]=!0,e["border-top-color"]=!0,e["border-top-left-radius"]=!0,e["border-top-right-radius"]=!0,e["border-top-style"]=!0,e["border-top-width"]=!0,e["border-width"]=!0,e.bottom=!1,e["box-decoration-break"]=!0,e["box-shadow"]=!0,e["box-sizing"]=!0,e["box-snap"]=!0,e["box-suppress"]=!0,e["break-after"]=!0,e["break-before"]=!0,e["break-inside"]=!0,e["caption-side"]=!1,e.chains=!1,e.clear=!0,e.clip=!1,e["clip-path"]=!1,e["clip-rule"]=!1,e.color=!0,e["color-interpolation-filters"]=!0,e["column-count"]=!1,e["column-fill"]=!1,e["column-gap"]=!1,e["column-rule"]=!1,e["column-rule-color"]=!1,e["column-rule-style"]=!1,e["column-rule-width"]=!1,e["column-span"]=!1,e["column-width"]=!1,e.columns=!1,e.contain=!1,e.content=!1,e["counter-increment"]=!1,e["counter-reset"]=!1,e["counter-set"]=!1,e.crop=!1,e.cue=!1,e["cue-after"]=!1,e["cue-before"]=!1,e.cursor=!1,e.direction=!1,e.display=!0,e["display-inside"]=!0,e["display-list"]=!0,e["display-outside"]=!0,e["dominant-baseline"]=!1,e.elevation=!1,e["empty-cells"]=!1,e.filter=!1,e.flex=!1,e["flex-basis"]=!1,e["flex-direction"]=!1,e["flex-flow"]=!1,e["flex-grow"]=!1,e["flex-shrink"]=!1,e["flex-wrap"]=!1,e.float=!1,e["float-offset"]=!1,e["flood-color"]=!1,e["flood-opacity"]=!1,e["flow-from"]=!1,e["flow-into"]=!1,e.font=!0,e["font-family"]=!0,e["font-feature-settings"]=!0,e["font-kerning"]=!0,e["font-language-override"]=!0,e["font-size"]=!0,e["font-size-adjust"]=!0,e["font-stretch"]=!0,e["font-style"]=!0,e["font-synthesis"]=!0,e["font-variant"]=!0,e["font-variant-alternates"]=!0,e["font-variant-caps"]=!0,e["font-variant-east-asian"]=!0,e["font-variant-ligatures"]=!0,e["font-variant-numeric"]=!0,e["font-variant-position"]=!0,e["font-weight"]=!0,e.grid=!1,e["grid-area"]=!1,e["grid-auto-columns"]=!1,e["grid-auto-flow"]=!1,e["grid-auto-rows"]=!1,e["grid-column"]=!1,e["grid-column-end"]=!1,e["grid-column-start"]=!1,e["grid-row"]=!1,e["grid-row-end"]=!1,e["grid-row-start"]=!1,e["grid-template"]=!1,e["grid-template-areas"]=!1,e["grid-template-columns"]=!1,e["grid-template-rows"]=!1,e["hanging-punctuation"]=!1,e.height=!0,e.hyphens=!1,e.icon=!1,e["image-orientation"]=!1,e["image-resolution"]=!1,e["ime-mode"]=!1,e["initial-letters"]=!1,e["inline-box-align"]=!1,e["justify-content"]=!1,e["justify-items"]=!1,e["justify-self"]=!1,e.left=!1,e["letter-spacing"]=!0,e["lighting-color"]=!0,e["line-box-contain"]=!1,e["line-break"]=!1,e["line-grid"]=!1,e["line-height"]=!1,e["line-snap"]=!1,e["line-stacking"]=!1,e["line-stacking-ruby"]=!1,e["line-stacking-shift"]=!1,e["line-stacking-strategy"]=!1,e["list-style"]=!0,e["list-style-image"]=!0,e["list-style-position"]=!0,e["list-style-type"]=!0,e.margin=!0,e["margin-bottom"]=!0,e["margin-left"]=!0,e["margin-right"]=!0,e["margin-top"]=!0,e["marker-offset"]=!1,e["marker-side"]=!1,e.marks=!1,e.mask=!1,e["mask-box"]=!1,e["mask-box-outset"]=!1,e["mask-box-repeat"]=!1,e["mask-box-slice"]=!1,e["mask-box-source"]=!1,e["mask-box-width"]=!1,e["mask-clip"]=!1,e["mask-image"]=!1,e["mask-origin"]=!1,e["mask-position"]=!1,e["mask-repeat"]=!1,e["mask-size"]=!1,e["mask-source-type"]=!1,e["mask-type"]=!1,e["max-height"]=!0,e["max-lines"]=!1,e["max-width"]=!0,e["min-height"]=!0,e["min-width"]=!0,e["move-to"]=!1,e["nav-down"]=!1,e["nav-index"]=!1,e["nav-left"]=!1,e["nav-right"]=!1,e["nav-up"]=!1,e["object-fit"]=!1,e["object-position"]=!1,e.opacity=!1,e.order=!1,e.orphans=!1,e.outline=!1,e["outline-color"]=!1,e["outline-offset"]=!1,e["outline-style"]=!1,e["outline-width"]=!1,e.overflow=!1,e["overflow-wrap"]=!1,e["overflow-x"]=!1,e["overflow-y"]=!1,e.padding=!0,e["padding-bottom"]=!0,e["padding-left"]=!0,e["padding-right"]=!0,e["padding-top"]=!0,e.page=!1,e["page-break-after"]=!1,e["page-break-before"]=!1,e["page-break-inside"]=!1,e["page-policy"]=!1,e.pause=!1,e["pause-after"]=!1,e["pause-before"]=!1,e.perspective=!1,e["perspective-origin"]=!1,e.pitch=!1,e["pitch-range"]=!1,e["play-during"]=!1,e.position=!1,e["presentation-level"]=!1,e.quotes=!1,e["region-fragment"]=!1,e.resize=!1,e.rest=!1,e["rest-after"]=!1,e["rest-before"]=!1,e.richness=!1,e.right=!1,e.rotation=!1,e["rotation-point"]=!1,e["ruby-align"]=!1,e["ruby-merge"]=!1,e["ruby-position"]=!1,e["shape-image-threshold"]=!1,e["shape-outside"]=!1,e["shape-margin"]=!1,e.size=!1,e.speak=!1,e["speak-as"]=!1,e["speak-header"]=!1,e["speak-numeral"]=!1,e["speak-punctuation"]=!1,e["speech-rate"]=!1,e.stress=!1,e["string-set"]=!1,e["tab-size"]=!1,e["table-layout"]=!1,e["text-align"]=!0,e["text-align-last"]=!0,e["text-combine-upright"]=!0,e["text-decoration"]=!0,e["text-decoration-color"]=!0,e["text-decoration-line"]=!0,e["text-decoration-skip"]=!0,e["text-decoration-style"]=!0,e["text-emphasis"]=!0,e["text-emphasis-color"]=!0,e["text-emphasis-position"]=!0,e["text-emphasis-style"]=!0,e["text-height"]=!0,e["text-indent"]=!0,e["text-justify"]=!0,e["text-orientation"]=!0,e["text-overflow"]=!0,e["text-shadow"]=!0,e["text-space-collapse"]=!0,e["text-transform"]=!0,e["text-underline-position"]=!0,e["text-wrap"]=!0,e.top=!1,e.transform=!1,e["transform-origin"]=!1,e["transform-style"]=!1,e.transition=!1,e["transition-delay"]=!1,e["transition-duration"]=!1,e["transition-property"]=!1,e["transition-timing-function"]=!1,e["unicode-bidi"]=!1,e["vertical-align"]=!1,e.visibility=!1,e["voice-balance"]=!1,e["voice-duration"]=!1,e["voice-family"]=!1,e["voice-pitch"]=!1,e["voice-range"]=!1,e["voice-rate"]=!1,e["voice-stress"]=!1,e["voice-volume"]=!1,e.volume=!1,e["white-space"]=!1,e.widows=!1,e.width=!0,e["will-change"]=!1,e["word-break"]=!0,e["word-spacing"]=!0,e["word-wrap"]=!0,e["wrap-flow"]=!1,e["wrap-through"]=!1,e["writing-mode"]=!1,e["z-index"]=!1,e}function Us(e,t,n){}function Fs(e,t,n){}var zs=/javascript\s*\:/img;function Ws(e,t){return zs.test(t)?"":t}R.whiteList=bt();R.getDefaultWhiteList=bt;R.onAttr=Us;R.onIgnoreAttr=Fs;R.safeAttrValue=Ws;var js={indexOf:function(e,t){var n,s;if(Array.prototype.indexOf)return e.indexOf(t);for(n=0,s=e.length;n<s;n++)if(e[n]===t)return n;return-1},forEach:function(e,t,n){var s,r;if(Array.prototype.forEach)return e.forEach(t,n);for(s=0,r=e.length;s<r;s++)t.call(n,e[s],s,e)},trim:function(e){return String.prototype.trim?e.trim():e.replace(/(^\s*)|(\s*$)/g,"")},trimRight:function(e){return String.prototype.trimRight?e.trimRight():e.replace(/(\s*$)/g,"")}},G=js;function Ys(e,t){e=G.trimRight(e),e[e.length-1]!==";"&&(e+=";");var n=e.length,s=!1,r=0,i=0,a="";function o(){if(!s){var f=G.trim(e.slice(r,i)),u=f.indexOf(":");if(u!==-1){var p=G.trim(f.slice(0,u)),h=G.trim(f.slice(u+1));if(p){var c=t(r,a.length,p,h,f);c&&(a+=c+"; ")}}}r=i+1}for(;i<n;i++){var l=e[i];if(l==="/"&&e[i+1]==="*"){var d=e.indexOf("*/",i+2);if(d===-1)break;i=d+1,r=i+1,s=!1}else l==="("?s=!0:l===")"?s=!1:l===";"?s||o():l===`
`&&o()}return G.trim(a)}var Xs=Ys,Y=R,Qs=Xs;function De(e){return e==null}function Ks(e){var t={};for(var n in e)t[n]=e[n];return t}function St(e){e=Ks(e||{}),e.whiteList=e.whiteList||Y.whiteList,e.onAttr=e.onAttr||Y.onAttr,e.onIgnoreAttr=e.onIgnoreAttr||Y.onIgnoreAttr,e.safeAttrValue=e.safeAttrValue||Y.safeAttrValue,this.options=e}St.prototype.process=function(e){if(e=e||"",e=e.toString(),!e)return"";var t=this,n=t.options,s=n.whiteList,r=n.onAttr,i=n.onIgnoreAttr,a=n.safeAttrValue,o=Qs(e,function(l,d,f,u,p){var h=s[f],c=!1;if(h===!0?c=h:typeof h=="function"?c=h(u):h instanceof RegExp&&(c=h.test(u)),c!==!0&&(c=!1),u=a(f,u),!!u){var w={position:d,sourcePosition:l,source:p,isWhite:c};if(c){var g=r(f,u,w);return De(g)?f+":"+u:g}else{var g=i(f,u,w);if(!De(g))return g}}});return o};var Js=St;(function(e,t){var n=R,s=Js;function r(a,o){var l=new s(o);return l.process(a)}t=e.exports=r,t.FilterCSS=s;for(var i in n)t[i]=n[i];typeof window<"u"&&(window.filterCSS=e.exports)})(ke,ke.exports);var Me=ke.exports,$e={indexOf:function(e,t){var n,s;if(Array.prototype.indexOf)return e.indexOf(t);for(n=0,s=e.length;n<s;n++)if(e[n]===t)return n;return-1},forEach:function(e,t,n){var s,r;if(Array.prototype.forEach)return e.forEach(t,n);for(s=0,r=e.length;s<r;s++)t.call(n,e[s],s,e)},trim:function(e){return String.prototype.trim?e.trim():e.replace(/(^\s*)|(\s*$)/g,"")},spaceIndex:function(e){var t=/\s|\n|\t/,n=t.exec(e);return n?n.index:-1}},en=Me.FilterCSS,tn=Me.getDefaultWhiteList,ne=$e;function At(){return{a:["target","href","title"],abbr:["title"],address:[],area:["shape","coords","href","alt"],article:[],aside:[],audio:["autoplay","controls","crossorigin","loop","muted","preload","src"],b:[],bdi:["dir"],bdo:["dir"],big:[],blockquote:["cite"],br:[],caption:[],center:[],cite:[],code:[],col:["align","valign","span","width"],colgroup:["align","valign","span","width"],dd:[],del:["datetime"],details:["open"],div:[],dl:[],dt:[],em:[],figcaption:[],figure:[],font:["color","size","face"],footer:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],header:[],hr:[],i:[],img:["src","alt","title","width","height","loading"],ins:["datetime"],kbd:[],li:[],mark:[],nav:[],ol:[],p:[],pre:[],s:[],section:[],small:[],span:[],sub:[],summary:[],sup:[],strong:[],strike:[],table:["width","border","align","valign"],tbody:["align","valign"],td:["width","rowspan","colspan","align","valign"],tfoot:["align","valign"],th:["width","rowspan","colspan","align","valign"],thead:["align","valign"],tr:["rowspan","align","valign"],tt:[],u:[],ul:[],video:["autoplay","controls","crossorigin","loop","muted","playsinline","poster","preload","src","height","width"]}}var xt=new en;function sn(e,t,n){}function nn(e,t,n){}function rn(e,t,n){}function an(e,t,n){}function _t(e){return e.replace(ln,"&lt;").replace(cn,"&gt;")}function on(e,t,n,s){if(n=Ot(n),t==="href"||t==="src"){if(n=ne.trim(n),n==="#")return"#";if(!(n.substr(0,7)==="http://"||n.substr(0,8)==="https://"||n.substr(0,7)==="mailto:"||n.substr(0,4)==="tel:"||n.substr(0,11)==="data:image/"||n.substr(0,6)==="ftp://"||n.substr(0,2)==="./"||n.substr(0,3)==="../"||n[0]==="#"||n[0]==="/"))return""}else if(t==="background"){if(X.lastIndex=0,X.test(n))return""}else if(t==="style"){if(Be.lastIndex=0,Be.test(n)||(Pe.lastIndex=0,Pe.test(n)&&(X.lastIndex=0,X.test(n))))return"";s!==!1&&(s=s||xt,n=s.process(n))}return n=Vt(n),n}var ln=/</g,cn=/>/g,dn=/"/g,un=/&quot;/g,fn=/&#([a-zA-Z0-9]*);?/gim,pn=/&colon;?/gim,hn=/&newline;?/gim,X=/((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/gi,Be=/e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*\(.*/gi,Pe=/u\s*r\s*l\s*\(.*/gi;function Tt(e){return e.replace(dn,"&quot;")}function It(e){return e.replace(un,'"')}function kt(e){return e.replace(fn,function(n,s){return s[0]==="x"||s[0]==="X"?String.fromCharCode(parseInt(s.substr(1),16)):String.fromCharCode(parseInt(s,10))})}function Mt(e){return e.replace(pn,":").replace(hn," ")}function $t(e){for(var t="",n=0,s=e.length;n<s;n++)t+=e.charCodeAt(n)<32?" ":e.charAt(n);return ne.trim(t)}function Ot(e){return e=It(e),e=kt(e),e=Mt(e),e=$t(e),e}function Vt(e){return e=Tt(e),e=_t(e),e}function mn(){return""}function Cn(e,t){typeof t!="function"&&(t=function(){});var n=!Array.isArray(e);function s(a){return n?!0:ne.indexOf(e,a)!==-1}var r=[],i=!1;return{onIgnoreTag:function(a,o,l){if(s(a))if(l.isClosing){var d="[/removed]",f=l.position+d.length;return r.push([i!==!1?i:l.position,f]),i=!1,d}else return i||(i=l.position),"[removed]";else return t(a,o,l)},remove:function(a){var o="",l=0;return ne.forEach(r,function(d){o+=a.slice(l,d[0]),l=d[1]}),o+=a.slice(l),o}}}function gn(e){for(var t="",n=0;n<e.length;){var s=e.indexOf("<!--",n);if(s===-1){t+=e.slice(n);break}t+=e.slice(n,s);var r=e.indexOf("-->",s);if(r===-1)break;n=r+3}return t}function vn(e){var t=e.split("");return t=t.filter(function(n){var s=n.charCodeAt(0);return s===127?!1:s<=31?s===10||s===13:!0}),t.join("")}y.whiteList=At();y.getDefaultWhiteList=At;y.onTag=sn;y.onIgnoreTag=nn;y.onTagAttr=rn;y.onIgnoreTagAttr=an;y.safeAttrValue=on;y.escapeHtml=_t;y.escapeQuote=Tt;y.unescapeQuote=It;y.escapeHtmlEntities=kt;y.escapeDangerHtml5Entities=Mt;y.clearNonPrintableCharacter=$t;y.friendlyAttrValue=Ot;y.escapeAttrValue=Vt;y.onIgnoreTagStripAll=mn;y.StripTagBody=Cn;y.stripCommentTag=gn;y.stripBlankChar=vn;y.attributeWrapSign='"';y.cssFilter=xt;y.getDefaultCSSWhiteList=tn;var ae={},H=$e;function yn(e){var t=H.spaceIndex(e),n;return t===-1?n=e.slice(1,-1):n=e.slice(1,t+1),n=H.trim(n).toLowerCase(),n.slice(0,1)==="/"&&(n=n.slice(1)),n.slice(-1)==="/"&&(n=n.slice(0,-1)),n}function wn(e){return e.slice(0,2)==="</"}function Ln(e,t,n){var s="",r=0,i=!1,a=!1,o=0,l=e.length,d="",f="";e:for(o=0;o<l;o++){var u=e.charAt(o);if(i===!1){if(u==="<"){i=o;continue}}else if(a===!1){if(u==="<"){s+=n(e.slice(r,o)),i=o,r=o;continue}if(u===">"||o===l-1){s+=n(e.slice(r,i)),f=e.slice(i,o+1),d=yn(f),s+=t(i,s.length,d,f,wn(f)),r=o+1,i=!1;continue}if(u==='"'||u==="'")for(var p=1,h=e.charAt(o-p);h.trim()===""||h==="=";){if(h==="="){a=u;continue e}h=e.charAt(o-++p)}}else if(u===a){a=!1;continue}}return r<l&&(s+=n(e.substr(r))),s}var En=/[^a-zA-Z0-9\\_:.-]/gim;function bn(e,t){var n=0,s=0,r=[],i=!1,a=e.length;function o(p,h){if(p=H.trim(p),p=p.replace(En,"").toLowerCase(),!(p.length<1)){var c=t(p,h||"");c&&r.push(c)}}for(var l=0;l<a;l++){var d=e.charAt(l),f,u;if(i===!1&&d==="="){i=e.slice(n,l),n=l+1,s=e.charAt(n)==='"'||e.charAt(n)==="'"?n:An(e,l+1);continue}if(i!==!1&&l===s){if(u=e.indexOf(d,l+1),u===-1)break;f=H.trim(e.slice(s+1,u)),o(i,f),i=!1,l=u,n=l+1;continue}if(/\s|\n|\t/.test(d))if(e=e.replace(/\s|\n|\t/g," "),i===!1)if(u=Sn(e,l),u===-1){f=H.trim(e.slice(n,l)),o(f),i=!1,n=l+1;continue}else{l=u-1;continue}else if(u=xn(e,l-1),u===-1){f=H.trim(e.slice(n,l)),f=Ze(f),o(i,f),i=!1,n=l+1;continue}else continue}return n<e.length&&(i===!1?o(e.slice(n)):o(i,Ze(H.trim(e.slice(n))))),H.trim(r.join(" "))}function Sn(e,t){for(;t<e.length;t++){var n=e[t];if(n!==" ")return n==="="?t:-1}}function An(e,t){for(;t<e.length;t++){var n=e[t];if(n!==" ")return n==="'"||n==='"'?t:-1}}function xn(e,t){for(;t>0;t--){var n=e[t];if(n!==" ")return n==="="?t:-1}}function _n(e){return e[0]==='"'&&e[e.length-1]==='"'||e[0]==="'"&&e[e.length-1]==="'"}function Ze(e){return _n(e)?e.substr(1,e.length-2):e}ae.parseTag=Ln;ae.parseAttr=bn;var Tn=Me.FilterCSS,T=y,qt=ae,In=qt.parseTag,kn=qt.parseAttr,J=$e;function Q(e){return e==null}function Mn(e){var t=J.spaceIndex(e);if(t===-1)return{html:"",closing:e[e.length-2]==="/"};e=J.trim(e.slice(t+1,-1));var n=e[e.length-1]==="/";return n&&(e=J.trim(e.slice(0,-1))),{html:e,closing:n}}function $n(e){var t={};for(var n in e)t[n]=e[n];return t}function On(e){var t={};for(var n in e)Array.isArray(e[n])?t[n.toLowerCase()]=e[n].map(function(s){return s.toLowerCase()}):t[n.toLowerCase()]=e[n];return t}function Ht(e){e=$n(e||{}),e.stripIgnoreTag&&(e.onIgnoreTag&&console.error('Notes: cannot use these two options "stripIgnoreTag" and "onIgnoreTag" at the same time'),e.onIgnoreTag=T.onIgnoreTagStripAll),e.whiteList||e.allowList?e.whiteList=On(e.whiteList||e.allowList):e.whiteList=T.whiteList,this.attributeWrapSign=e.singleQuotedAttributeValue===!0?"'":T.attributeWrapSign,e.onTag=e.onTag||T.onTag,e.onTagAttr=e.onTagAttr||T.onTagAttr,e.onIgnoreTag=e.onIgnoreTag||T.onIgnoreTag,e.onIgnoreTagAttr=e.onIgnoreTagAttr||T.onIgnoreTagAttr,e.safeAttrValue=e.safeAttrValue||T.safeAttrValue,e.escapeHtml=e.escapeHtml||T.escapeHtml,this.options=e,e.css===!1?this.cssFilter=!1:(e.css=e.css||{},this.cssFilter=new Tn(e.css))}Ht.prototype.process=function(e){if(e=e||"",e=e.toString(),!e)return"";var t=this,n=t.options,s=n.whiteList,r=n.onTag,i=n.onIgnoreTag,a=n.onTagAttr,o=n.onIgnoreTagAttr,l=n.safeAttrValue,d=n.escapeHtml,f=t.attributeWrapSign,u=t.cssFilter;n.stripBlankChar&&(e=T.stripBlankChar(e)),n.allowCommentTag||(e=T.stripCommentTag(e));var p=!1;n.stripIgnoreTagBody&&(p=T.StripTagBody(n.stripIgnoreTagBody,i),i=p.onIgnoreTag);var h=In(e,function(c,w,g,v,C){var m={sourcePosition:c,position:w,isClosing:C,isWhite:Object.prototype.hasOwnProperty.call(s,g)},S=r(g,v,m);if(!Q(S))return S;if(m.isWhite){if(m.isClosing)return"</"+g+">";var $=Mn(v),O=s[g],V=kn($.html,function(A,I){var L=J.indexOf(O,A)!==-1,k=a(g,A,I,L);return Q(k)?L?(I=l(g,A,I,u),I?A+"="+f+I+f:A):(k=o(g,A,I,L),Q(k)?void 0:k):k});return v="<"+g,V&&(v+=" "+V),$.closing&&(v+=" /"),v+=">",v}else return S=i(g,v,m),Q(S)?d(v):S},d);return p&&(h=p.remove(h)),h};var Vn=Ht;(function(e,t){var n=y,s=ae,r=Vn;function i(o,l){var d=new r(l);return d.process(o)}t=e.exports=i,t.filterXSS=i,t.FilterXSS=r,function(){for(var o in n)t[o]=n[o];for(var l in s)t[l]=s[l]}(),typeof window<"u"&&(window.filterXSS=e.exports);function a(){return typeof self<"u"&&typeof DedicatedWorkerGlobalScope<"u"&&self instanceof DedicatedWorkerGlobalScope}a()&&(self.filterXSS=e.exports)})(Ie,Ie.exports);var qn=Ie.exports;const M=Gs(qn);var Hn=Array.isArray,Nt=function(e){var t="";if(typeof e=="string")t+=e;else if(typeof e=="object"){var n=void 0;if(Hn(e))for(var s=0,r=e.length;s<r;)n=Nt(e[s++]),n&&(t&&(t+=" "),t+=n);else for(n in e)n&&e[n]&&(t&&(t+=" "),t+=n)}return t};function Rt(){for(var e=arguments.length,t=0,n,s,r="";t<e;)n=arguments[t++],n&&(s=Nt(n),s&&(r&&(r+=" "),r+=s));return r}function Ge({children:e="",imageUrl:t,imageAlt:n="",aspectRatio:s="card-small",videoUrl:r}){return`
    <span
      class="${Rt("su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block",s==="card-small"&&"su-aspect-[3/2]",s==="card-medium"&&"su-aspect-[3/2]",s==="card-large"&&"su-aspect-[3/2]",s==="card-featured"&&"su-aspect-[3/2]",s==="square"&&"su-aspect-[1/1]",s==="video"&&"su-aspect-[16/9]",s==="vertical-video"&&"su-aspect-[9/16]")}"
    >
      ${r?`
        <video class="su-absolute su-object-cover su-object-center su-size-full">
          <source src="${r}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `:""}
      ${t?`
        <img
          class="su-absolute su-object-cover su-object-center su-size-full"
          src="${t}"
          alt="${n}"
        />
      `:""}
      ${e}
    </span>
  `}const Nn={small:"su-left-13 su-bottom-13 [&>svg]:su-text-[4rem]",medium:"su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&>svg]:su-text-[4rem] [&>svg]:md:su-text-[6rem]",large:"su-left-13 su-bottom-13 [&>svg]:su-text-[4rem]",featured:"su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&>svg]:su-text-[4rem] [&>svg]:md:su-text-[6rem]","vertical-video":"su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&>svg]:su-text-[6rem]"};function Ue({imageUrl:e,alt:t="",aspectRatio:n,videoUrl:s,size:r="small",title:i="",videoIconClasses:a,uniqueId:o}){if(s){const l=`
        {/* Add a dark overlay over the image when used in Vertical Video Cards */}
        ${r==="vertical-video"?`
          <div
            aria-hidden="true"
            class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20"
          />
        `:""}
        ${s?`
          <span
            class="${Rt("su-absolute su-leading-none",r==="vertical-video"&&"su-z-30",Nn[r],a)}">
            <svg aria-hidden="true" focusable="false" data-testid="svg-circle-play" data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg>
          </span>
        `:""}
    `;return`
      <button
        class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full"
        type="button"
        aria-haspopup="dialog"
        data-click="open-modal"
        data-modal-id="${o}"
      >
        ${Ge({imageUrl:e,imageAlt:`${`Open video ${t||""} in a modal`}`,aspectRatio:n,children:l})}
      </button>
    `}return`
    <div class="su-component-card-thumbnail su-w-full su-h-full">
      ${Ge({imageUrl:e,imageAlt:t,aspectRatio:n})}
    </div>
  `}function Rn(e,t){if(!t)return!0;const n=e.match(/(\d+-\d+-\d+)/)[0],s=t.match(/(\d+-\d+-\d+)/)[0];return n===s}function Dn({start:e,end:t}){if(!e&&!t)return null;const n=new Date(e),s=t?new Date(t):null,r={day:"numeric",month:"short",hour12:!0,time:"long",timeZone:"America/Los_Angeles",hour:"numeric",minute:"numeric"};let i="";const a=Rn(e,t);a||(delete r.time,delete r.hour,delete r.minute);const o=new Intl.DateTimeFormat("en-US",r).format(n),l=t?new Intl.DateTimeFormat("en-US",r).format(s):"";return a?`<span data-testid="event-date" class="su-mb-0 su-text-16">${o.replace(/, /," | ")}</span>`:(i+=`${o} - ${l}`,`<span data-testid="event-date" class="su-mb-0 su-text-16">${i}</span>`)}function Bn(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-alert"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
    >
        <path d="M7.99885 0.5C8.4426 0.5 8.85197 0.734375 9.07697 1.11875L15.827 12.6187C16.0551 13.0062 16.0551 13.4844 15.8332 13.8719C15.6113 14.2594 15.1957 14.5 14.7488 14.5H1.24885C0.801972 14.5 0.386347 14.2594 0.164472 13.8719C-0.0574034 13.4844 -0.0542784 13.0031 0.170722 12.6187L6.92072 1.11875C7.14572 0.734375 7.5551 0.5 7.99885 0.5ZM7.99885 4.5C7.58322 4.5 7.24885 4.83437 7.24885 5.25V8.75C7.24885 9.16562 7.58322 9.5 7.99885 9.5C8.41447 9.5 8.74885 9.16562 8.74885 8.75V5.25C8.74885 4.83437 8.41447 4.5 7.99885 4.5ZM8.99885 11.5C8.99885 11.2348 8.89349 10.9804 8.70595 10.7929C8.51842 10.6054 8.26406 10.5 7.99885 10.5C7.73363 10.5 7.47928 10.6054 7.29174 10.7929C7.1042 10.9804 6.99885 11.2348 6.99885 11.5C6.99885 11.7652 7.1042 12.0196 7.29174 12.2071C7.47928 12.3946 7.73363 12.5 7.99885 12.5C8.26406 12.5 8.51842 12.3946 8.70595 12.2071C8.89349 12.0196 8.99885 11.7652 8.99885 11.5Z" />
    </svg>`}function ye(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-analysis-and-insights"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
    >
        <path d="M15.6249 2.28118C16.0561 1.93743 16.1249 1.30618 15.7811 0.874931C15.4374 0.443681 14.8061 0.374931 14.3749 0.718681L9.9811 4.23431L6.59985 1.69993C6.23423 1.42493 5.7311 1.43431 5.37486 1.71868L0.374855 5.71868C-0.056395 6.06243 -0.125145 6.69368 0.218605 7.12493C0.562355 7.55618 1.19361 7.62493 1.62486 7.28118L6.01861 3.76556L9.39985 6.29993C9.76548 6.57493 10.2686 6.56556 10.6249 6.28118L15.6249 2.28118ZM4.99986 7.49993V13.4999C4.99986 14.0531 5.44673 14.4999 5.99986 14.4999C6.55298 14.4999 6.99986 14.0531 6.99986 13.4999V7.49993C6.99986 6.94681 6.55298 6.49993 5.99986 6.49993C5.44673 6.49993 4.99986 6.94681 4.99986 7.49993ZM0.999855 10.4999V13.4999C0.999855 14.0531 1.44673 14.4999 1.99986 14.4999C2.55298 14.4999 2.99986 14.0531 2.99986 13.4999V10.4999C2.99986 9.94681 2.55298 9.49993 1.99986 9.49993C1.44673 9.49993 0.999855 9.94681 0.999855 10.4999ZM9.99986 8.49993C9.44673 8.49993 8.99986 8.94681 8.99986 9.49993V13.4999C8.99986 14.0531 9.44673 14.4999 9.99986 14.4999C10.553 14.4999 10.9999 14.0531 10.9999 13.4999V9.49993C10.9999 8.94681 10.553 8.49993 9.99986 8.49993ZM12.9999 7.49993V13.4999C12.9999 14.0531 13.4467 14.4999 13.9999 14.4999C14.553 14.4999 14.9999 14.0531 14.9999 13.4999V7.49993C14.9999 6.94681 14.553 6.49993 13.9999 6.49993C13.4467 6.49993 12.9999 6.94681 12.9999 7.49993Z" />
    </svg>`}function Pn(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-type-announcement"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="15"
        viewBox="0 0 18 15"
        fill="none"
    >
        <path d="M17 0.5C17.5531 0.5 18 0.946875 18 1.5V13.5C18 14.0531 17.5531 14.5 17 14.5C16.4469 14.5 16 14.0531 16 13.5V1.5C16 0.946875 16.4469 0.5 17 0.5ZM2 5.44688L15 1.5V13.5L10.9031 12.2563C10.5687 13.5469 9.39688 14.5 8 14.5C6.34375 14.5 5 13.1562 5 11.5C5 11.1562 5.05938 10.8219 5.16563 10.5156L2 9.55313C1.97187 10.0813 1.53437 10.5 1 10.5C0.446875 10.5 0 10.0531 0 9.5V5.5C0 4.94688 0.446875 4.5 1 4.5C1.53437 4.5 1.97187 4.91875 2 5.44688ZM9.46875 11.8188L6.60625 10.95C6.54062 11.1187 6.50313 11.3062 6.50313 11.5C6.50313 12.3281 7.175 13 8.00313 13C8.72188 13 9.32187 12.4938 9.46875 11.8188Z" />
    </svg>`}const Zn="light";function we({variant:e=Zn}){const t=new Map;return t.set("light",`<svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="23"
            viewBox="0 0 17 23"
            fill="none"
        >
            <path
                d="M2.75 0.389648C1.2332 0.389648 0 1.62285 0 3.13965V19.6396C0 21.1564 1.2332 22.3896 2.75 22.3896H13.75C15.2668 22.3896 16.5 21.1564 16.5 19.6396V7.26465H11C10.2395 7.26465 9.625 6.6502 9.625 5.88965V0.389648H2.75ZM11 0.389648V5.88965H16.5L11 0.389648ZM11.6875 13.4521C11.6875 14.217 11.477 14.9346 11.116 15.5533L12.7617 17.199C13.1656 17.6029 13.1656 18.2561 12.7617 18.6557C12.3578 19.0553 11.7047 19.0596 11.3051 18.6557L9.65508 17.0057C9.04062 17.3709 8.32734 17.5771 7.5625 17.5771C5.28516 17.5771 3.4375 15.7295 3.4375 13.4521C3.4375 11.1748 5.28516 9.32715 7.5625 9.32715C9.83984 9.32715 11.6875 11.1748 11.6875 13.4521ZM7.5625 15.5146C8.10951 15.5146 8.63411 15.2973 9.02091 14.9106C9.4077 14.5238 9.625 13.9992 9.625 13.4521C9.625 12.9051 9.4077 12.3805 9.02091 11.9937C8.63411 11.6069 8.10951 11.3896 7.5625 11.3896C7.01549 11.3896 6.49089 11.6069 6.10409 11.9937C5.7173 12.3805 5.5 12.9051 5.5 13.4521C5.5 13.9992 5.7173 14.5238 6.10409 14.9106C6.49089 15.2973 7.01549 15.5146 7.5625 15.5146Z"
                fill="url(#paint0_linear_1077_1867)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_1077_1867"
                    x1="16.5"
                    y1="0.389648"
                    x2="-5.43552"
                    y2="10.0596"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#E50808" />
                    <stop offset="1" stop-color="#820000" />
                </linearGradient>
            </defs>
        </svg>`),t.set("dark",`<svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="23"
            viewBox="0 0 17 23"
            fill="none"
        >
            <path
                d="M2.75 0.779297C1.2332 0.779297 0 2.0125 0 3.5293V20.0293C0 21.5461 1.2332 22.7793 2.75 22.7793H13.75C15.2668 22.7793 16.5 21.5461 16.5 20.0293V7.6543H11C10.2395 7.6543 9.625 7.03984 9.625 6.2793V0.779297H2.75ZM11 0.779297V6.2793H16.5L11 0.779297ZM11.6875 13.8418C11.6875 14.6066 11.477 15.3242 11.116 15.943L12.7617 17.5887C13.1656 17.9926 13.1656 18.6457 12.7617 19.0453C12.3578 19.4449 11.7047 19.4492 11.3051 19.0453L9.65508 17.3953C9.04062 17.7605 8.32734 17.9668 7.5625 17.9668C5.28516 17.9668 3.4375 16.1191 3.4375 13.8418C3.4375 11.5645 5.28516 9.7168 7.5625 9.7168C9.83984 9.7168 11.6875 11.5645 11.6875 13.8418ZM7.5625 15.9043C8.10951 15.9043 8.63411 15.687 9.02091 15.3002C9.4077 14.9134 9.625 14.3888 9.625 13.8418C9.625 13.2948 9.4077 12.7702 9.02091 12.3834C8.63411 11.9966 8.10951 11.7793 7.5625 11.7793C7.01549 11.7793 6.49089 11.9966 6.10409 12.3834C5.7173 12.7702 5.5 13.2948 5.5 13.8418C5.5 14.3888 5.7173 14.9134 6.10409 15.3002C6.49089 15.687 7.01549 15.9043 7.5625 15.9043Z"
                fill="url(#paint0_linear_1077_1873)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_1077_1873"
                    x1="16.5"
                    y1="0.779297"
                    x2="-5.43552"
                    y2="10.4492"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#8F993E" />
                    <stop offset="1" stop-color="#279989" />
                </linearGradient>
            </defs>
        </svg>`),e&&t.get(e)?t.get(e):`
    <svg
        aria-hidden="true"
        data-testid="svg-case-study"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="17"
        viewBox="0 0 12 17"
        fill="none"
    >
        <path d="M2 0.5C0.896875 0.5 0 1.39688 0 2.5V14.5C0 15.6031 0.896875 16.5 2 16.5H10C11.1031 16.5 12 15.6031 12 14.5V5.5H8C7.44688 5.5 7 5.05312 7 4.5V0.5H2ZM8 0.5V4.5H12L8 0.5ZM8.5 10C8.5 10.5562 8.34688 11.0781 8.08438 11.5281L9.28125 12.725C9.575 13.0188 9.575 13.4938 9.28125 13.7844C8.9875 14.075 8.5125 14.0781 8.22188 13.7844L7.02187 12.5844C6.575 12.85 6.05625 13 5.5 13C3.84375 13 2.5 11.6562 2.5 10C2.5 8.34375 3.84375 7 5.5 7C7.15625 7 8.5 8.34375 8.5 10ZM5.5 11.5C5.89782 11.5 6.27936 11.342 6.56066 11.0607C6.84196 10.7794 7 10.3978 7 10C7 9.60218 6.84196 9.22064 6.56066 8.93934C6.27936 8.65804 5.89782 8.5 5.5 8.5C5.10218 8.5 4.72064 8.65804 4.43934 8.93934C4.15804 9.22064 4 9.60218 4 10C4 10.3978 4.15804 10.7794 4.43934 11.0607C4.72064 11.342 5.10218 11.5 5.5 11.5Z" />
    </svg>`}function Gn(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-news"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
    >
        <path d="M3 2.5C3 1.39688 3.89687 0.5 5 0.5H14C15.1031 0.5 16 1.39688 16 2.5V12.5C16 13.6031 15.1031 14.5 14 14.5H2.5C1.11875 14.5 0 13.3813 0 12V3.5C0 2.94688 0.446875 2.5 1 2.5C1.55313 2.5 2 2.94688 2 3.5V12C2 12.275 2.225 12.5 2.5 12.5C2.775 12.5 3 12.275 3 12V2.5ZM5 3.25V5.75C5 6.16563 5.33437 6.5 5.75 6.5H9.25C9.66562 6.5 10 6.16563 10 5.75V3.25C10 2.83437 9.66562 2.5 9.25 2.5H5.75C5.33437 2.5 5 2.83437 5 3.25ZM11.5 3C11.5 3.275 11.725 3.5 12 3.5H13.5C13.775 3.5 14 3.275 14 3C14 2.725 13.775 2.5 13.5 2.5H12C11.725 2.5 11.5 2.725 11.5 3ZM11.5 6C11.5 6.275 11.725 6.5 12 6.5H13.5C13.775 6.5 14 6.275 14 6C14 5.725 13.775 5.5 13.5 5.5H12C11.725 5.5 11.5 5.725 11.5 6ZM5 9C5 9.275 5.225 9.5 5.5 9.5H13.5C13.775 9.5 14 9.275 14 9C14 8.725 13.775 8.5 13.5 8.5H5.5C5.225 8.5 5 8.725 5 9ZM5 12C5 12.275 5.225 12.5 5.5 12.5H13.5C13.775 12.5 14 12.275 14 12C14 11.725 13.775 11.5 13.5 11.5H5.5C5.225 11.5 5 11.725 5 12Z" />
    </svg>`}function Un({className:e}){return`
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 18 15" 
        data-testid="svg-book-open-cover" 
        fill="currentColor" 
        width="16" 
        height="17"
        class="${e||""}" 
        aria-hidden
    >
        <path d="M8.55 1.16275V11.7377L2.7 10.6127V1.23869C2.7 0.68181 3.20062 0.257123 3.74906 0.349935L8.55 1.16275ZM2.52281 11.6562L9 12.9527L15.4772 11.6562C15.8991 11.5718 16.2 11.2034 16.2 10.7731V1.07275L16.9228 0.92931C17.4797 0.81681 18 1.2415 18 1.80962V12.1259C18 12.5562 17.6962 12.9246 17.2772 13.009L9 14.6627L0.722812 13.0062C0.30375 12.9246 0 12.5534 0 12.1259V1.80962C0 1.2415 0.520312 0.81681 1.07719 0.92931L1.8 1.07275V10.7759C1.8 11.2062 2.10375 11.5746 2.52281 11.659V11.6562ZM9.45 11.7377V1.16275L14.2509 0.349935C14.7994 0.257123 15.3 0.68181 15.3 1.23869V10.6127L9.45 11.7377Z"></path>
    </svg>`}function Fn(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-event"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="17"
        viewBox="0 0 14 17"
        fill="none"
    >
        <path d="M4 0.5C4.55312 0.5 5 0.946875 5 1.5V2.5H9V1.5C9 0.946875 9.44687 0.5 10 0.5C10.5531 0.5 11 0.946875 11 1.5V2.5H12.5C13.3281 2.5 14 3.17188 14 4V5.5H0V4C0 3.17188 0.671875 2.5 1.5 2.5H3V1.5C3 0.946875 3.44688 0.5 4 0.5ZM0 6.5H14V15C14 15.8281 13.3281 16.5 12.5 16.5H1.5C0.671875 16.5 0 15.8281 0 15V6.5ZM7.29063 8.34062C7.17188 8.1 6.82812 8.1 6.70625 8.34062L5.96875 9.83438L4.32188 10.075C4.05625 10.1125 3.95 10.4406 4.14062 10.6281L5.33437 11.7906L5.05312 13.4312C5.00625 13.6969 5.2875 13.9 5.525 13.775L7 13L8.475 13.775C8.7125 13.9 8.99062 13.6969 8.94687 13.4312L8.66562 11.7906L9.85938 10.6281C10.0531 10.4406 9.94688 10.1125 9.67813 10.075L8.03125 9.83438L7.29375 8.34062H7.29063Z" />
    </svg>`}function zn(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-feature"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
    >
        <path d="M8.71513 1.02175C8.61512 0.712378 8.32763 0.499878 7.9995 0.499878C7.67138 0.499878 7.38388 0.712378 7.28388 1.02175L5.70263 5.99988H0.749501C0.427626 5.99988 0.143251 6.203 0.0401256 6.50613C-0.0629994 6.80925 0.0370006 7.14363 0.290126 7.3405L4.37763 10.5218L2.78388 15.5218C2.68388 15.8343 2.7995 16.178 3.06825 16.3655C3.337 16.553 3.6995 16.5436 3.95888 16.3436L7.9995 13.1999L12.0401 16.3405C12.2995 16.5436 12.6589 16.553 12.9307 16.3624C13.2026 16.1718 13.3151 15.8343 13.2151 15.5186L11.6214 10.5218L15.7089 7.3405C15.962 7.14363 16.062 6.80925 15.9589 6.50613C15.8558 6.203 15.5714 5.99988 15.2495 5.99988H10.2964L8.71513 1.02175Z" />
    </svg>`}function Fe(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-event-highlights"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
    >
        <path 
            d="M1.00154 1.50011C1.00154 1.2349 1.10689 0.980544 1.29443 0.793008C1.48197 0.605471 1.73632 0.500114 2.00154 0.500114C2.26675 0.500114 2.52111 0.605471 2.70864 0.793008C2.89618 0.980544 3.00154 1.2349 3.00154 1.50011C3.00154 1.76533 2.89618 2.01968 2.70864 2.20722C2.52111 2.39476 2.26675 2.50011 2.00154 2.50011C1.73632 2.50011 1.48197 2.39476 1.29443 2.20722C1.10689 2.01968 1.00154 1.76533 1.00154 1.50011ZM14.0015 5.50011C14.0015 5.2349 14.1069 4.98054 14.2944 4.79301C14.482 4.60547 14.7363 4.50011 15.0015 4.50011C15.2668 4.50011 15.5211 4.60547 15.7086 4.79301C15.8962 4.98054 16.0015 5.2349 16.0015 5.50011C16.0015 5.76533 15.8962 6.01968 15.7086 6.20722C15.5211 6.39476 15.2668 6.50011 15.0015 6.50011C14.7363 6.50011 14.482 6.39476 14.2944 6.20722C14.1069 6.01968 14.0015 5.76533 14.0015 5.50011ZM15.0015 13.5001C15.2668 13.5001 15.5211 13.6055 15.7086 13.793C15.8962 13.9805 16.0015 14.2349 16.0015 14.5001C16.0015 14.7653 15.8962 15.0197 15.7086 15.2072C15.5211 15.3948 15.2668 15.5001 15.0015 15.5001C14.7363 15.5001 14.482 15.3948 14.2944 15.2072C14.1069 15.0197 14.0015 14.7653 14.0015 14.5001C14.0015 14.2349 14.1069 13.9805 14.2944 13.793C14.482 13.6055 14.7363 13.5001 15.0015 13.5001ZM5.22029 5.28136C4.92654 4.98761 4.92654 4.51261 5.22029 4.22199L5.47966 3.96261C6.00154 3.44074 6.32966 2.75636 6.41091 2.02199L6.50466 1.16574C6.55154 0.756364 6.92341 0.459489 7.33591 0.503239C7.74841 0.546989 8.04529 0.918864 7.99841 1.33136L7.90466 2.18761C7.78591 3.25949 7.30466 4.25949 6.54216 5.02199L6.28279 5.28136C5.98904 5.57511 5.51404 5.57511 5.22341 5.28136H5.22029ZM11.2203 10.2189L11.4765 9.95949C12.239 9.19699 13.239 8.71574 14.3109 8.59699L15.1672 8.50324C15.5797 8.45636 15.9484 8.75324 15.9953 9.16574C16.0422 9.57824 15.7453 9.94699 15.3328 9.99386L14.4765 10.0876C13.7422 10.1689 13.0578 10.497 12.5359 11.0189L12.2828 11.2814C11.989 11.5751 11.514 11.5751 11.2234 11.2814C10.9328 10.9876 10.9297 10.5126 11.2234 10.222L11.2203 10.2189ZM15.8234 0.765739C16.0922 1.08136 16.0515 1.55636 15.7359 1.82199L15.4234 2.08761C14.9609 2.47824 14.3703 2.68449 13.7672 2.66886C13.2484 2.65636 12.8109 3.05636 12.7797 3.57511L12.7234 4.51261C12.6453 5.84074 11.5265 6.86574 10.1984 6.83136C9.96091 6.82511 9.72966 6.90636 9.55154 7.05949L9.23904 7.32511C8.92341 7.59386 8.44841 7.55324 8.18279 7.23761C7.91716 6.92199 7.95466 6.44699 8.27029 6.18136L8.58279 5.91574C9.04529 5.52511 9.63591 5.31886 10.239 5.33449C10.7578 5.34699 11.1953 4.94699 11.2265 4.42824L11.2828 3.49074C11.3609 2.16261 12.4797 1.13761 13.8078 1.17199C14.0453 1.17824 14.2765 1.09699 14.4547 0.943864L14.7672 0.678239C15.0828 0.409489 15.5578 0.450114 15.8234 0.765739ZM4.70779 6.79386L9.70779 11.7939C9.94841 12.0345 10.0515 12.3814 9.97654 12.7126C9.90154 13.0439 9.66716 13.3189 9.35154 13.4376L8.11091 13.9032L2.59841 8.39074L3.06404 7.15011C3.18279 6.83136 3.45779 6.59699 3.78904 6.52511C4.12029 6.45324 4.46716 6.55636 4.70779 6.79386ZM1.50779 11.3001L2.21404 9.41886L7.08279 14.2876L5.20154 14.9939L1.50779 11.3001ZM1.12341 12.3282L4.17341 15.3782L1.35154 16.4376C0.985913 16.5751 0.570287 16.4845 0.292163 16.2095C0.0140375 15.9345 -0.0734625 15.5157 0.0640375 15.1501L1.12029 12.3282H1.12341Z" 
        />
    </svg>`}function Wn(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-infographic"
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
    >
        <path d="M8.5 8V1.01875C8.5 0.7375 8.71875 0.5 9 0.5C12.8656 0.5 16 3.63438 16 7.5C16 7.78125 15.7625 8 15.4813 8H8.5ZM0 9C0 5.20937 2.81562 2.07187 6.46875 1.57187C6.75625 1.53125 7 1.7625 7 2.05313V9.5L11.8906 14.3906C12.1 14.6 12.0844 14.9438 11.8438 15.1125C10.6187 15.9875 9.11875 16.5 7.5 16.5C3.35938 16.5 0 13.1438 0 9ZM16.45 9.5C16.7406 9.5 16.9688 9.74375 16.9312 10.0312C16.6906 11.7781 15.85 13.3312 14.6219 14.4781C14.4344 14.6531 14.1406 14.6406 13.9594 14.4563L9 9.5H16.45Z" />
    </svg>`}function Le(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-in-the-news"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="17"
        viewBox="0 0 18 17"
        fill="none"
    >
        <path d="M0 2.5C0 1.39688 0.896875 0.5 2 0.5H7V4.5C7 5.05312 7.44688 5.5 8 5.5H12V9.5H6.75C6.33437 9.5 6 9.83438 6 10.25C6 10.6656 6.33437 11 6.75 11H12V14.5C12 15.6031 11.1031 16.5 10 16.5H2C0.896875 16.5 0 15.6031 0 14.5V2.5ZM12 11V9.5H15.4406L14.2219 8.28125C13.9281 7.9875 13.9281 7.5125 14.2219 7.22188C14.5156 6.93125 14.9906 6.92813 15.2812 7.22188L17.7812 9.72188C18.075 10.0156 18.075 10.4906 17.7812 10.7812L15.2812 13.2812C14.9875 13.575 14.5125 13.575 14.2219 13.2812C13.9313 12.9875 13.9281 12.5125 14.2219 12.2219L15.4406 11.0031H12V11ZM12 4.5H8V0.5L12 4.5Z" />
    </svg>`}function ze(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-leadership-messages"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
    >
        <path d="M7.60856 0.580466L0.608565 3.58047C0.171065 3.76797 -0.0726847 4.23672 0.0241903 4.69922C0.121065 5.16172 0.527315 5.49922 1.00232 5.49922V5.74922C1.00232 6.16484 1.33669 6.49922 1.75232 6.49922H14.2523C14.6679 6.49922 15.0023 6.16484 15.0023 5.74922V5.49922C15.4773 5.49922 15.8867 5.16484 15.9804 4.69922C16.0742 4.23359 15.8304 3.76484 15.3961 3.58047L8.39607 0.580466C8.14607 0.474216 7.85856 0.474216 7.60856 0.580466ZM4.00232 7.49922H2.00232V13.6336C1.98357 13.643 1.96482 13.6555 1.94607 13.668L0.446065 14.668C0.0804403 14.9117 -0.0851848 15.368 0.0429402 15.7898C0.171065 16.2117 0.56169 16.4992 1.00232 16.4992H15.0023C15.4429 16.4992 15.8304 16.2117 15.9586 15.7898C16.0867 15.368 15.9242 14.9117 15.5554 14.668L14.0554 13.668C14.0367 13.6555 14.0179 13.6461 13.9992 13.6336V7.49922H12.0023V13.4992H10.7523V7.49922H8.75232V13.4992H7.25232V7.49922H5.25232V13.4992H4.00232V7.49922ZM8.00232 2.49922C8.26753 2.49922 8.52189 2.60457 8.70942 2.79211C8.89696 2.97965 9.00232 3.234 9.00232 3.49922C9.00232 3.76443 8.89696 4.01879 8.70942 4.20632C8.52189 4.39386 8.26753 4.49922 8.00232 4.49922C7.7371 4.49922 7.48274 4.39386 7.29521 4.20632C7.10767 4.01879 7.00232 3.76443 7.00232 3.49922C7.00232 3.234 7.10767 2.97965 7.29521 2.79211C7.48274 2.60457 7.7371 2.49922 8.00232 2.49922Z" />
    </svg>`}function jn(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-obituary"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="15"
        viewBox="0 0 18 15"
        fill="none"
    >
        <path d="M2 0.5C0.896875 0.5 0 1.39688 0 2.5V12.5C0 13.6031 0.896875 14.5 2 14.5H16C17.1031 14.5 18 13.6031 18 12.5V2.5C18 1.39688 17.1031 0.5 16 0.5H2ZM4.5 8.5H6.5C7.88125 8.5 9 9.61875 9 11C9 11.275 8.775 11.5 8.5 11.5H2.5C2.225 11.5 2 11.275 2 11C2 9.61875 3.11875 8.5 4.5 8.5ZM3.5 5.5C3.5 4.96957 3.71071 4.46086 4.08579 4.08579C4.46086 3.71071 4.96957 3.5 5.5 3.5C6.03043 3.5 6.53914 3.71071 6.91421 4.08579C7.28929 4.46086 7.5 4.96957 7.5 5.5C7.5 6.03043 7.28929 6.53914 6.91421 6.91421C6.53914 7.28929 6.03043 7.5 5.5 7.5C4.96957 7.5 4.46086 7.28929 4.08579 6.91421C3.71071 6.53914 3.5 6.03043 3.5 5.5ZM11.5 4.5H15.5C15.775 4.5 16 4.725 16 5C16 5.275 15.775 5.5 15.5 5.5H11.5C11.225 5.5 11 5.275 11 5C11 4.725 11.225 4.5 11.5 4.5ZM11.5 6.5H15.5C15.775 6.5 16 6.725 16 7C16 7.275 15.775 7.5 15.5 7.5H11.5C11.225 7.5 11 7.275 11 7C11 6.725 11.225 6.5 11.5 6.5ZM11.5 8.5H15.5C15.775 8.5 16 8.725 16 9C16 9.275 15.775 9.5 15.5 9.5H11.5C11.225 9.5 11 9.275 11 9C11 8.725 11.225 8.5 11.5 8.5Z" />
    </svg>`}function Yn(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-opinion"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
    >
        <path d="M8.00162 13.4984C12.4204 13.4984 16.0016 10.5891 16.0016 6.99844C16.0016 3.40782 12.4204 0.498444 8.00162 0.498444C3.58287 0.498444 0.00162356 3.40782 0.00162356 6.99844C0.00162356 8.40782 0.554749 9.71094 1.49225 10.7766C1.43287 11.5422 1.136 12.2234 0.823499 12.7422C0.651624 13.0297 0.476624 13.2609 0.348499 13.4172C0.282874 13.4953 0.232874 13.5547 0.195374 13.5953C0.176624 13.6141 0.164124 13.6297 0.154749 13.6391L0.145374 13.6484C0.00162356 13.7922 -0.0390014 14.0047 0.0391236 14.1922C0.117249 14.3797 0.298499 14.5016 0.501624 14.5016C1.3985 14.5016 2.30162 14.2234 3.05162 13.8984C3.76725 13.5859 4.37662 13.2141 4.7485 12.9422C5.74225 13.3016 6.84225 13.5016 8.00162 13.5016V13.4984ZM4.00162 5.99844C4.26684 5.99844 4.52119 6.1038 4.70873 6.29134C4.89627 6.47887 5.00162 6.73323 5.00162 6.99844C5.00162 7.26366 4.89627 7.51801 4.70873 7.70555C4.52119 7.89309 4.26684 7.99844 4.00162 7.99844C3.73641 7.99844 3.48205 7.89309 3.29452 7.70555C3.10698 7.51801 3.00162 7.26366 3.00162 6.99844C3.00162 6.73323 3.10698 6.47887 3.29452 6.29134C3.48205 6.1038 3.73641 5.99844 4.00162 5.99844ZM8.00162 5.99844C8.26684 5.99844 8.52119 6.1038 8.70873 6.29134C8.89627 6.47887 9.00162 6.73323 9.00162 6.99844C9.00162 7.26366 8.89627 7.51801 8.70873 7.70555C8.52119 7.89309 8.26684 7.99844 8.00162 7.99844C7.73641 7.99844 7.48205 7.89309 7.29452 7.70555C7.10698 7.51801 7.00162 7.26366 7.00162 6.99844C7.00162 6.73323 7.10698 6.47887 7.29452 6.29134C7.48205 6.1038 7.73641 5.99844 8.00162 5.99844ZM11.0016 6.99844C11.0016 6.73323 11.107 6.47887 11.2945 6.29134C11.4821 6.1038 11.7364 5.99844 12.0016 5.99844C12.2668 5.99844 12.5212 6.1038 12.7087 6.29134C12.8963 6.47887 13.0016 6.73323 13.0016 6.99844C13.0016 7.26366 12.8963 7.51801 12.7087 7.70555C12.5212 7.89309 12.2668 7.99844 12.0016 7.99844C11.7364 7.99844 11.4821 7.89309 11.2945 7.70555C11.107 7.51801 11.0016 7.26366 11.0016 6.99844Z" />
    </svg>`}function Xn(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-photo"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
    >
        <path d="M4.65938 1.525L4.33437 2.5H2C0.896875 2.5 0 3.39687 0 4.5V12.5C0 13.6031 0.896875 14.5 2 14.5H14C15.1031 14.5 16 13.6031 16 12.5V4.5C16 3.39687 15.1031 2.5 14 2.5H11.6656L11.3406 1.525C11.1375 0.9125 10.5656 0.5 9.91875 0.5H6.08125C5.43438 0.5 4.8625 0.9125 4.65938 1.525ZM8 5.5C8.79565 5.5 9.55871 5.81607 10.1213 6.37868C10.6839 6.94129 11 7.70435 11 8.5C11 9.29565 10.6839 10.0587 10.1213 10.6213C9.55871 11.1839 8.79565 11.5 8 11.5C7.20435 11.5 6.44129 11.1839 5.87868 10.6213C5.31607 10.0587 5 9.29565 5 8.5C5 7.70435 5.31607 6.94129 5.87868 6.37868C6.44129 5.81607 7.20435 5.5 8 5.5Z" />
    </svg>`}const We="solid";function Qn({variant:e=We}){const t=new Map;return t.set("solid",`<svg
            aria-hidden="true"
            data-testid="svg-podcast"
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="17"
            viewBox="0 0 11 17"
            fill="none"
        >
            <path d="M5.5 0.5C3.84375 0.5 2.5 1.84375 2.5 3.5V8.5C2.5 10.1562 3.84375 11.5 5.5 11.5C7.15625 11.5 8.5 10.1562 8.5 8.5V3.5C8.5 1.84375 7.15625 0.5 5.5 0.5ZM1.5 7.25C1.5 6.83437 1.16562 6.5 0.75 6.5C0.334375 6.5 0 6.83437 0 7.25V8.5C0 11.2844 2.06875 13.5844 4.75 13.95V15H3.25C2.83437 15 2.5 15.3344 2.5 15.75C2.5 16.1656 2.83437 16.5 3.25 16.5H5.5H7.75C8.16562 16.5 8.5 16.1656 8.5 15.75C8.5 15.3344 8.16562 15 7.75 15H6.25V13.95C8.93125 13.5844 11 11.2844 11 8.5V7.25C11 6.83437 10.6656 6.5 10.25 6.5C9.83438 6.5 9.5 6.83437 9.5 7.25V8.5C9.5 10.7094 7.70937 12.5 5.5 12.5C3.29063 12.5 1.5 10.7094 1.5 8.5V7.25Z" />
        </svg>`),t.set("outline",`<svg
            aria-hidden="true"
            data-testid="svg-podcast-outline"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.66634 4.16658C6.66634 2.32564 8.15873 0.833252 9.99967 0.833252C11.8406 0.833252 13.333 2.32564 13.333 4.16658V9.16658C13.333 11.0075 11.8406 12.4999 9.99967 12.4999C8.15873 12.4999 6.66634 11.0075 6.66634 9.16658V4.16658ZM9.99967 2.49992C9.0792 2.49992 8.33301 3.24611 8.33301 4.16658V9.16658C8.33301 10.0871 9.0792 10.8333 9.99967 10.8333C10.9201 10.8333 11.6663 10.0871 11.6663 9.16658V4.16658C11.6663 3.24611 10.9201 2.49992 9.99967 2.49992ZM4.16634 8.33325C4.62658 8.33325 4.99967 8.70635 4.99967 9.16658C4.99967 11.928 7.23825 14.1666 9.99967 14.1666C12.7611 14.1666 14.9997 11.928 14.9997 9.16658C14.9997 8.70635 15.3728 8.33325 15.833 8.33325C16.2932 8.33325 16.6663 8.70635 16.6663 9.16658C16.6663 12.5663 14.1216 15.3716 10.833 15.7817V17.4999H13.333C13.7932 17.4999 14.1663 17.873 14.1663 18.3333C14.1663 18.7935 13.7932 19.1666 13.333 19.1666H6.66634C6.2061 19.1666 5.83301 18.7935 5.83301 18.3333C5.83301 17.873 6.2061 17.4999 6.66634 17.4999H9.16634V15.7817C5.87775 15.3716 3.33301 12.5663 3.33301 9.16658C3.33301 8.70635 3.7061 8.33325 4.16634 8.33325Z"
            />
        </svg>`),t.get(e)!==null?t.get(e):t.get(We)}function Ee(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-poll-quiz"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="15"
        viewBox="0 0 14 15"
        fill="none"
    >
        <path d="M5 2C5 1.17188 5.67188 0.5 6.5 0.5H7.5C8.32812 0.5 9 1.17188 9 2V13C9 13.8281 8.32812 14.5 7.5 14.5H6.5C5.67188 14.5 5 13.8281 5 13V2ZM0 8C0 7.17188 0.671875 6.5 1.5 6.5H2.5C3.32812 6.5 4 7.17188 4 8V13C4 13.8281 3.32812 14.5 2.5 14.5H1.5C0.671875 14.5 0 13.8281 0 13V8ZM11.5 2.5H12.5C13.3281 2.5 14 3.17188 14 4V13C14 13.8281 13.3281 14.5 12.5 14.5H11.5C10.6719 14.5 10 13.8281 10 13V4C10 3.17188 10.6719 2.5 11.5 2.5Z" />
    </svg>`}const Kn="light";function je({variant:e=Kn}){const t=new Map;return t.set("light",`<svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="22"
            viewBox="0 0 17 22"
            fill="none"
        >
            <path
                d="M2.75 0C1.2332 0 0 1.2332 0 2.75V19.25C0 20.7668 1.2332 22 2.75 22H13.75C15.2668 22 16.5 20.7668 16.5 19.25V6.875H11C10.2395 6.875 9.625 6.26055 9.625 5.5V0H2.75ZM11 0V5.5H16.5L11 0ZM3.4375 2.75H6.1875C6.56562 2.75 6.875 3.05937 6.875 3.4375C6.875 3.81562 6.56562 4.125 6.1875 4.125H3.4375C3.05937 4.125 2.75 3.81562 2.75 3.4375C2.75 3.05937 3.05937 2.75 3.4375 2.75ZM3.4375 5.5H6.1875C6.56562 5.5 6.875 5.80937 6.875 6.1875C6.875 6.56562 6.56562 6.875 6.1875 6.875H3.4375C3.05937 6.875 2.75 6.56562 2.75 6.1875C2.75 5.80937 3.05937 5.5 3.4375 5.5ZM5.76641 16.4055C5.5043 17.2777 4.70078 17.875 3.78984 17.875H3.4375C3.05937 17.875 2.75 17.5656 2.75 17.1875C2.75 16.8094 3.05937 16.5 3.4375 16.5H3.78984C4.09492 16.5 4.36133 16.3023 4.44727 16.0102L5.0875 13.8832C5.23359 13.3977 5.68047 13.0625 6.1875 13.0625C6.69453 13.0625 7.14141 13.3934 7.2875 13.8832L7.78594 15.5418C8.10391 15.2754 8.50781 15.125 8.9375 15.125C9.6207 15.125 10.2437 15.5117 10.5488 16.1219L10.7379 16.5H13.0625C13.4406 16.5 13.75 16.8094 13.75 17.1875C13.75 17.5656 13.4406 17.875 13.0625 17.875H10.3125C10.0504 17.875 9.81406 17.7289 9.69805 17.4969L9.31992 16.7363C9.24687 16.5902 9.10078 16.5 8.9418 16.5C8.78281 16.5 8.63242 16.5902 8.56367 16.7363L8.18555 17.4969C8.06094 17.7504 7.79023 17.9008 7.51094 17.875C7.23164 17.8492 6.99102 17.6559 6.91367 17.3895L6.1875 14.9961L5.76641 16.4055Z"
                fill="url(#paint0_linear_1077_1864)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_1077_1864"
                    x1="16.5"
                    y1="0"
                    x2="-5.43552"
                    y2="9.66991"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#E50808" />
                    <stop offset="1" stop-color="#820000" />
                </linearGradient>
            </defs>
        </svg>`),t.set("dark",`<svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="23"
            viewBox="0 0 17 23"
            fill="none"
        >
            <path
                d="M2.75 0.389648C1.2332 0.389648 0 1.62285 0 3.13965V19.6396C0 21.1564 1.2332 22.3896 2.75 22.3896H13.75C15.2668 22.3896 16.5 21.1564 16.5 19.6396V7.26465H11C10.2395 7.26465 9.625 6.6502 9.625 5.88965V0.389648H2.75ZM11 0.389648V5.88965H16.5L11 0.389648ZM3.4375 3.13965H6.1875C6.56562 3.13965 6.875 3.44902 6.875 3.82715C6.875 4.20527 6.56562 4.51465 6.1875 4.51465H3.4375C3.05937 4.51465 2.75 4.20527 2.75 3.82715C2.75 3.44902 3.05937 3.13965 3.4375 3.13965ZM3.4375 5.88965H6.1875C6.56562 5.88965 6.875 6.19902 6.875 6.57715C6.875 6.95527 6.56562 7.26465 6.1875 7.26465H3.4375C3.05937 7.26465 2.75 6.95527 2.75 6.57715C2.75 6.19902 3.05937 5.88965 3.4375 5.88965ZM5.76641 16.7951C5.5043 17.6674 4.70078 18.2646 3.78984 18.2646H3.4375C3.05937 18.2646 2.75 17.9553 2.75 17.5771C2.75 17.199 3.05937 16.8896 3.4375 16.8896H3.78984C4.09492 16.8896 4.36133 16.692 4.44727 16.3998L5.0875 14.2729C5.23359 13.7873 5.68047 13.4521 6.1875 13.4521C6.69453 13.4521 7.14141 13.783 7.2875 14.2729L7.78594 15.9314C8.10391 15.665 8.50781 15.5146 8.9375 15.5146C9.6207 15.5146 10.2437 15.9014 10.5488 16.5115L10.7379 16.8896H13.0625C13.4406 16.8896 13.75 17.199 13.75 17.5771C13.75 17.9553 13.4406 18.2646 13.0625 18.2646H10.3125C10.0504 18.2646 9.81406 18.1186 9.69805 17.8865L9.31992 17.126C9.24687 16.9799 9.10078 16.8896 8.9418 16.8896C8.78281 16.8896 8.63242 16.9799 8.56367 17.126L8.18555 17.8865C8.06094 18.14 7.79023 18.2904 7.51094 18.2646C7.23164 18.2389 6.99102 18.0455 6.91367 17.7791L6.1875 15.3857L5.76641 16.7951Z"
                fill="url(#paint0_linear_1077_1870)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_1077_1870"
                    x1="16.5"
                    y1="0.389648"
                    x2="-5.43552"
                    y2="10.0596"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#8F993E" />
                    <stop offset="1" stop-color="#279989" />
                </linearGradient>
            </defs>
        </svg>`),e&&t.get(e)?t.get(e):`<svg
        aria-hidden="true"
        data-testid="svg-policy-brief"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="17"
        viewBox="0 0 12 17"
        fill="none"
    >
        <path d="M2 0.5C0.896875 0.5 0 1.39688 0 2.5V14.5C0 15.6031 0.896875 16.5 2 16.5H10C11.1031 16.5 12 15.6031 12 14.5V5.5H8C7.44688 5.5 7 5.05312 7 4.5V0.5H2ZM8 0.5V4.5H12L8 0.5ZM2.5 2.5H4.5C4.775 2.5 5 2.725 5 3C5 3.275 4.775 3.5 4.5 3.5H2.5C2.225 3.5 2 3.275 2 3C2 2.725 2.225 2.5 2.5 2.5ZM2.5 4.5H4.5C4.775 4.5 5 4.725 5 5C5 5.275 4.775 5.5 4.5 5.5H2.5C2.225 5.5 2 5.275 2 5C2 4.725 2.225 4.5 2.5 4.5ZM4.19375 12.4312C4.00312 13.0656 3.41875 13.5 2.75625 13.5H2.5C2.225 13.5 2 13.275 2 13C2 12.725 2.225 12.5 2.5 12.5H2.75625C2.97812 12.5 3.17188 12.3562 3.23438 12.1438L3.7 10.5969C3.80625 10.2438 4.13125 10 4.5 10C4.86875 10 5.19375 10.2406 5.3 10.5969L5.6625 11.8031C5.89375 11.6094 6.1875 11.5 6.5 11.5C6.99687 11.5 7.45 11.7812 7.67188 12.225L7.80937 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H7.5C7.30937 13.5 7.1375 13.3938 7.05312 13.225L6.77812 12.6719C6.725 12.5656 6.61875 12.5 6.50313 12.5C6.3875 12.5 6.27813 12.5656 6.22813 12.6719L5.95312 13.225C5.8625 13.4094 5.66563 13.5188 5.4625 13.5C5.25938 13.4812 5.08437 13.3406 5.02812 13.1469L4.5 11.4062L4.19375 12.4312Z" />
    </svg>`}function Jn(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-profile"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="17"
        viewBox="0 0 14 17"
        fill="none"
    >
        <path d="M7 8.5C8.06087 8.5 9.07828 8.07857 9.82843 7.32843C10.5786 6.57828 11 5.56087 11 4.5C11 3.43913 10.5786 2.42172 9.82843 1.67157C9.07828 0.921427 8.06087 0.5 7 0.5C5.93913 0.5 4.92172 0.921427 4.17157 1.67157C3.42143 2.42172 3 3.43913 3 4.5C3 5.56087 3.42143 6.57828 4.17157 7.32843C4.92172 8.07857 5.93913 8.5 7 8.5ZM5.57188 10C2.49375 10 0 12.4937 0 15.5719C0 16.0844 0.415625 16.5 0.928125 16.5H13.0719C13.5844 16.5 14 16.0844 14 15.5719C14 12.4937 11.5063 10 8.42813 10H5.57188Z" />
    </svg>`}function K(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-q-and-a"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="17"
        viewBox="0 0 20 17"
        fill="none"
    >
        <path d="M2 0.500345C0.896875 0.500345 0 1.39722 0 2.50035V8.50035C0 9.60347 0.896875 10.5003 2 10.5003H3V12.0003C3 12.191 3.10625 12.3628 3.275 12.4472C3.44375 12.5316 3.64687 12.5128 3.8 12.4003L6.33437 10.5003H11C12.1031 10.5003 13 9.60347 13 8.50035V2.50035C13 1.39722 12.1031 0.500345 11 0.500345H2ZM11 11.5003H8V12.5003C8 13.6035 8.89688 14.5003 10 14.5003H13.6656L16.2 16.4003C16.35 16.5128 16.5531 16.5316 16.725 16.4472C16.8969 16.3628 17 16.191 17 16.0003V14.5003H18C19.1031 14.5003 20 13.6035 20 12.5003V6.50035C20 5.39722 19.1031 4.50035 18 4.50035H14V8.50035C14 10.1566 12.6562 11.5003 11 11.5003Z" />
    </svg>`}function er(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-research"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
    >
        <path d="M5 1.5C5 0.946875 5.44688 0.5 6 0.5H7C7.55312 0.5 8 0.946875 8 1.5C8.55313 1.5 9 1.94687 9 2.5V9.5C9 10.0531 8.55313 10.5 8 10.5C8 11.0531 7.55312 11.5 7 11.5H6C5.44688 11.5 5 11.0531 5 10.5C4.44688 10.5 4 10.0531 4 9.5V2.5C4 1.94687 4.44688 1.5 5 1.5ZM1 14.5H10C12.2094 14.5 14 12.7094 14 10.5C14 8.29063 12.2094 6.5 10 6.5V4.5C13.3125 4.5 16 7.1875 16 10.5C16 12.0375 15.4219 13.4375 14.4719 14.5H15C15.5531 14.5 16 14.9469 16 15.5C16 16.0531 15.5531 16.5 15 16.5H10H1C0.446875 16.5 0 16.0531 0 15.5C0 14.9469 0.446875 14.5 1 14.5ZM3.5 12.5H9.5C9.775 12.5 10 12.725 10 13C10 13.275 9.775 13.5 9.5 13.5H3.5C3.225 13.5 3 13.275 3 13C3 12.725 3.225 12.5 3.5 12.5Z" />
    </svg>`}function tr(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-solutions"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
    >
        <path d="M8 16.5C10.1217 16.5 12.1566 15.6571 13.6569 14.1569C15.1571 12.6566 16 10.6217 16 8.5C16 6.37827 15.1571 4.34344 13.6569 2.84315C12.1566 1.34285 10.1217 0.5 8 0.5C5.87827 0.5 3.84344 1.34285 2.34315 2.84315C0.842855 4.34344 0 6.37827 0 8.5C0 10.6217 0.842855 12.6566 2.34315 14.1569C3.84344 15.6571 5.87827 16.5 8 16.5ZM11.5312 7.03125L7.53125 11.0312C7.2375 11.325 6.7625 11.325 6.47188 11.0312L4.47188 9.03125C4.17813 8.7375 4.17813 8.2625 4.47188 7.97188C4.76562 7.68125 5.24062 7.67813 5.53125 7.97188L7 9.44063L10.4688 5.96875C10.7625 5.675 11.2375 5.675 11.5281 5.96875C11.8187 6.2625 11.8219 6.7375 11.5281 7.02812L11.5312 7.03125Z" />
    </svg>`}function sr(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-survey"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="17"
        viewBox="0 0 14 17"
        fill="none"
    >
        <path d="M2 0.5C0.896875 0.5 0 1.39688 0 2.5V14.5C0 15.6031 0.896875 16.5 2 16.5H12C13.1031 16.5 14 15.6031 14 14.5V2.5C14 1.39688 13.1031 0.5 12 0.5H2ZM2 4C2 3.725 2.225 3.5 2.5 3.5H3.5C3.775 3.5 4 3.725 4 4V5C4 5.275 3.775 5.5 3.5 5.5H2.5C2.225 5.5 2 5.275 2 5V4ZM2 12C2 11.725 2.225 11.5 2.5 11.5H3.5C3.775 11.5 4 11.725 4 12V13C4 13.275 3.775 13.5 3.5 13.5H2.5C2.225 13.5 2 13.275 2 13V12ZM6.5 12H11.5C11.775 12 12 12.225 12 12.5C12 12.775 11.775 13 11.5 13H6.5C6.225 13 6 12.775 6 12.5C6 12.225 6.225 12 6.5 12ZM6 4.5C6 4.225 6.225 4 6.5 4H11.5C11.775 4 12 4.225 12 4.5C12 4.775 11.775 5 11.5 5H6.5C6.225 5 6 4.775 6 4.5ZM6.5 8H11.5C11.775 8 12 8.225 12 8.5C12 8.775 11.775 9 11.5 9H6.5C6.225 9 6 8.775 6 8.5C6 8.225 6.225 8 6.5 8ZM4.85313 7.14687C5.04688 7.34062 5.04688 7.65938 4.85313 7.85313L3.35313 9.35312C3.15938 9.54688 2.84062 9.54688 2.64687 9.35312L1.89688 8.60312C1.70312 8.40937 1.70312 8.09062 1.89688 7.89687C2.09063 7.70312 2.40938 7.70312 2.60313 7.89687L3 8.29375L4.14687 7.14687C4.34062 6.95312 4.65938 6.95312 4.85313 7.14687Z" />
    </svg>`}function nr(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-timeline"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="15"
        viewBox="0 0 20 15"
        fill="none"
    >
        <path d="M4 1.75C4.19891 1.75 4.38968 1.82902 4.53033 1.96967C4.67098 2.11032 4.75 2.30109 4.75 2.5C4.75 2.69891 4.67098 2.88968 4.53033 3.03033C4.38968 3.17098 4.19891 3.25 4 3.25C3.80109 3.25 3.61032 3.17098 3.46967 3.03033C3.32902 2.88968 3.25 2.69891 3.25 2.5C3.25 2.30109 3.32902 2.11032 3.46967 1.96967C3.61032 1.82902 3.80109 1.75 4 1.75ZM5 4.79063C5.88438 4.40625 6.5 3.525 6.5 2.5C6.5 1.11875 5.38125 0 4 0C2.61875 0 1.5 1.11875 1.5 2.5C1.5 3.525 2.11562 4.40625 3 4.79063V6.5H1C0.446875 6.5 0 6.94688 0 7.5C0 8.05313 0.446875 8.5 1 8.5H9V10.2094C8.11563 10.5938 7.5 11.475 7.5 12.5C7.5 13.8813 8.61875 15 10 15C11.3813 15 12.5 13.8813 12.5 12.5C12.5 11.475 11.8844 10.5938 11 10.2094V8.5H19C19.5531 8.5 20 8.05313 20 7.5C20 6.94688 19.5531 6.5 19 6.5H17V4.79063C17.8844 4.40625 18.5 3.525 18.5 2.5C18.5 1.11875 17.3813 0 16 0C14.6187 0 13.5 1.11875 13.5 2.5C13.5 3.525 14.1156 4.40625 15 4.79063V6.5H5V4.79063ZM15.25 2.5C15.25 2.30109 15.329 2.11032 15.4697 1.96967C15.6103 1.82902 15.8011 1.75 16 1.75C16.1989 1.75 16.3897 1.82902 16.5303 1.96967C16.671 2.11032 16.75 2.30109 16.75 2.5C16.75 2.69891 16.671 2.88968 16.5303 3.03033C16.3897 3.17098 16.1989 3.25 16 3.25C15.8011 3.25 15.6103 3.17098 15.4697 3.03033C15.329 2.88968 15.25 2.69891 15.25 2.5ZM10 11.75C10.1989 11.75 10.3897 11.829 10.5303 11.9697C10.671 12.1103 10.75 12.3011 10.75 12.5C10.75 12.6989 10.671 12.8897 10.5303 13.0303C10.3897 13.171 10.1989 13.25 10 13.25C9.80109 13.25 9.61032 13.171 9.46967 13.0303C9.32902 12.8897 9.25 12.6989 9.25 12.5C9.25 12.3011 9.32902 12.1103 9.46967 11.9697C9.61032 11.829 9.80109 11.75 10 11.75Z" />
    </svg>`}function be(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-tips-and-takeaways"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="17"
        viewBox="0 0 20 17"
        fill="none"
    >
        <path d="M2.16563 0.625936L3.66563 1.62594C4.00938 1.85719 4.10313 2.32281 3.875 2.66656C3.64687 3.01031 3.17812 3.10406 2.83437 2.87594L1.33438 1.87594C0.990625 1.64469 0.896875 1.17906 1.125 0.835311C1.35312 0.491561 1.82188 0.397811 2.16563 0.625936ZM18.6656 1.87594L17.1656 2.87594C16.8219 3.10719 16.3563 3.01344 16.125 2.66656C15.8938 2.31969 15.9875 1.85719 16.3344 1.62594L17.8344 0.625936C18.1781 0.394686 18.6437 0.488436 18.875 0.835311C19.1063 1.18219 19.0125 1.64469 18.6656 1.87594ZM0.75 5.50094H2.75C3.16563 5.50094 3.5 5.83531 3.5 6.25094C3.5 6.66656 3.16563 7.00094 2.75 7.00094H0.75C0.334375 7.00094 0 6.66656 0 6.25094C0 5.83531 0.334375 5.50094 0.75 5.50094ZM17.25 5.50094H19.25C19.6656 5.50094 20 5.83531 20 6.25094C20 6.66656 19.6656 7.00094 19.25 7.00094H17.25C16.8344 7.00094 16.5 6.66656 16.5 6.25094C16.5 5.83531 16.8344 5.50094 17.25 5.50094ZM3.66563 10.8759L2.16563 11.8759C1.82188 12.1072 1.35625 12.0134 1.125 11.6666C0.89375 11.3197 0.9875 10.8572 1.33438 10.6259L2.83437 9.62594C3.17812 9.39469 3.64375 9.48844 3.875 9.83531C4.10625 10.1822 4.0125 10.6447 3.66563 10.8759ZM17.1656 9.62906L18.6656 10.6291C19.0094 10.8603 19.1031 11.3259 18.875 11.6697C18.6469 12.0134 18.1781 12.1072 17.8344 11.8791L16.3344 10.8791C15.9906 10.6478 15.8969 10.1822 16.125 9.83844C16.3531 9.49469 16.8219 9.40094 17.1656 9.62906ZM14.0375 9.80719C13.4188 10.6541 12.7969 11.5072 12.5 12.5009H7.5C7.2 11.5041 6.57812 10.6541 5.9625 9.80719C5.8 9.58531 5.6375 9.36344 5.48125 9.13844C4.8625 8.24781 4.5 7.16656 4.5 6.00094C4.5 2.96344 6.9625 0.500936 10 0.500936C13.0375 0.500936 15.5 2.96344 15.5 6.00094C15.5 7.16656 15.1375 8.24781 14.5188 9.13531C14.3625 9.36031 14.2 9.58219 14.0375 9.80406V9.80719ZM12.5 14.0009C12.5 15.3822 11.3813 16.5009 10 16.5009C8.61875 16.5009 7.5 15.3822 7.5 14.0009V13.5009H12.5V14.0009ZM10 3.50094C10.275 3.50094 10.5 3.27594 10.5 3.00094C10.5 2.72594 10.275 2.50094 10 2.50094C8.06563 2.50094 6.5 4.06656 6.5 6.00094C6.5 6.27594 6.725 6.50094 7 6.50094C7.275 6.50094 7.5 6.27594 7.5 6.00094C7.5 4.61969 8.61875 3.50094 10 3.50094Z" />
    </svg>`}function rr(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-video"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="13"
        viewBox="0 0 18 13"
        fill="none"
    >
        <path d="M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z" />
    </svg>`}function ar(){return`
    <svg
        aria-hidden="true"
        data-testid="svg-arrow-right"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M14 5L21 12M21 12L14 19M21 12L3 12"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>`}function Ye(){return`
    <svg 
        aria-hidden="true"
        data-testid="svg-university-updates" 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="17" 
        viewBox="0 0 16 17" 
        fill="none"
    >
        <path d="M7.60856 0.580466L0.608565 3.58047C0.171065 3.76797 -0.0726847 4.23672 0.0241903 4.69922C0.121065 5.16172 0.527315 5.49922 1.00232 5.49922V5.74922C1.00232 6.16484 1.33669 6.49922 1.75232 6.49922H14.2523C14.6679 6.49922 15.0023 6.16484 15.0023 5.74922V5.49922C15.4773 5.49922 15.8867 5.16484 15.9804 4.69922C16.0742 4.23359 15.8304 3.76484 15.3961 3.58047L8.39607 0.580466C8.14607 0.474216 7.85856 0.474216 7.60856 0.580466ZM4.00232 7.49922H2.00232V13.6336C1.98357 13.643 1.96482 13.6555 1.94607 13.668L0.446065 14.668C0.0804403 14.9117 -0.0851848 15.368 0.0429402 15.7898C0.171065 16.2117 0.56169 16.4992 1.00232 16.4992H15.0023C15.4429 16.4992 15.8304 16.2117 15.9586 15.7898C16.0867 15.368 15.9242 14.9117 15.5554 14.668L14.0554 13.668C14.0367 13.6555 14.0179 13.6461 13.9992 13.6336V7.49922H12.0023V13.4992H10.7523V7.49922H8.75232V13.4992H7.25232V7.49922H5.25232V13.4992H4.00232V7.49922ZM8.00232 2.49922C8.26753 2.49922 8.52189 2.60457 8.70942 2.79211C8.89696 2.97965 9.00232 3.234 9.00232 3.49922C9.00232 3.76443 8.89696 4.01879 8.70942 4.20632C8.52189 4.39386 8.26753 4.49922 8.00232 4.49922C7.7371 4.49922 7.48274 4.39386 7.29521 4.20632C7.10767 4.01879 7.00232 3.76443 7.00232 3.49922C7.00232 3.234 7.10767 2.97965 7.29521 2.79211C7.48274 2.60457 7.7371 2.49922 8.00232 2.49922Z"></path>
    </svg>`}const x={root:"listing-item su-flex su-relative",imageWrapper:"su-shrink-0",contentWrapper:"su-flex su-flex-col",taxonomy:"su-mb-0 su-text-16 su-font-semibold su-text-digital-red dark:su-text-dark-mode-red hover:dark:su-text-dark-mode-red",taxonomyLink:"focus:su-outline-0 focus:su-ring su-text-digital-red su-no-underline hover:su-text-digital-red dark:su-text-dark-mode-red hover:dark:su-text-dark-mode-red su-block su-mt-[-6px]",heading:"su-font-sans su-my-0 su-group",link:"su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red",linkIcon:"su-inline-block su-align-middle su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform",type:"su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start",typeText:"su-font-semibold su-text-14 md:su-text-16 su-leading-4",description:"su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0",descriptionContent:"su-mb-0 su-w-full [&>*:last-child]:su-mb-0"},ir={large:{gap:"su-gap-20 lg:su-gap-48",contentGap:"su-gap-9 lg:su-gap-12",title:"su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px]",imageWrapper:"su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]"},small:{gap:"su-gap-19",contentGap:"su-gap-6",title:"su-text-18 su-font-semibold su-leading-[21.495px]",imageWrapper:"su-w-[73px] su-h-[73px]"}};function or({data:{title:e,description:t,liveUrl:n,imageUrl:s,imageAlt:r,taxonomy:i,taxonomyUrl:a,type:o,date:l,endDate:d,videoUrl:f,uniqueID:u},cardSize:p="small"}){const h=ir[p],c=new Map;return c.set("alert",Bn()),c.set("analysis & insights",ye()),c.set("analysis &amp; insights",ye()),c.set("analysis&nbsp;&amp;&nbsp;insights",ye()),c.set("case study",we({variant:"light"})),c.set("case&nbsp;study",we({variant:"light"})),c.set("casestudy",we({variant:"light"})),c.set("event",Fn()),c.set("event&nbsp;highlights",Fe()),c.set("event highlights",Fe()),c.set("feature",zn()),c.set("infographic",Wn()),c.set("in&nbsp;the&nbsp;news",Le()),c.set("in the news",Le()),c.set("inthenews",Le()),c.set("leadership&nbsp;messages",ze()),c.set("leadership messages",ze()),c.set("obituary",jn()),c.set("opinion",Yn()),c.set("photo",Xn()),c.set("policy&nbsp;brief",je({variant:"light"})),c.set("policy brief",je({variant:"light"})),c.set("poll/quiz",Ee()),c.set("poll / quiz",Ee()),c.set("poll&nbsp;/&nbsp;quiz",Ee()),c.set("profile",Jn()),c.set("research",er()),c.set("solutions",tr()),c.set("survey",sr()),c.set("timeline",nr()),c.set("tips & takeaways",be()),c.set("tips &amp; takeaways",be()),c.set("tips&nbsp;&amp;&nbsp;takeaways",be()),c.set("university&nbsp;updates",Ye()),c.set("university updates",Ye()),c.set("announcement",Pn()),c.set("news",Gn()),c.set("q&amp;a",K()),c.set("q&a",K()),c.set("q & a",K()),c.set("q&nbsp;&amp;&nbsp;a",K()),c.set("video",rr()),c.set("podcast",Qn({variant:"light"})),c.set("book",Un({className:""})),`
    <article aria-label="${e}" class="${x.root} ${h.gap}" data-testid="horizontal-card" >
      
    ${p==="large"?`
        <div class="${x.imageWrapper} ${h.imageWrapper}">
          ${s?`
            ${Ue({imageUrl:s,alt:r,videoUrl:f,mediaType:"image",aspectRatio:"card-large",size:p,uniqueId:u})}
          `:""}
        </div>
      `:""}

      ${p==="small"&&s?`
        <div class="${x.imageWrapper} ${h.imageWrapper} su-relative">
            ${Ue({imageUrl:s,alt:r,videoUrl:f,mediaType:"image",aspectRatio:"large",size:p,uniqueId:u})}
        </div>
      `:""}

      <div class="${x.contentWrapper} ${h.contentGap}">
        ${p==="small"&&i?`
          <p class="${x.taxonomy}" data-testid="horizontal-card-taxonomy">
            <a href="${a}" class="${x.taxonomyLink}">
              ${M(i)}
            </a>
          </p>
        `:""}

        <h3 class="${x.heading} ${h.title}">
          <a href="${n}" class="${x.link}">
            ${M(e)}
            ${pt(n)?`
              <svg width="${p==="small"?12:15}" aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-align-middle su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg>
            `:""}
            </a>
        </h3>

        ${p==="small"?`
          <div data-testid="horizontal-event-date">
            ${Dn({start:l,end:d})}
          </div>
        `:""}

        ${p==="large"&&o?`
          <p data-testid="horizontal-card-type" class="${x.type}">
            ${c.get(o.toLowerCase())}
            <span class="${x.typeText}">${M(o)}</span>
          </p>
        `:""}

        ${p==="large"&&t?`
          <div data-testid="horizontal-card-description" class="${x.description}">
            <div class="${x.descriptionContent}">
              ${M(t)}
            </div>
          </div>
        `:""}
      </div>
    </article>
  `}function lr({image:e,avatarSize:t="small",alt:n=""}){const s=new Map;s.set("small","su-min-w-[56px] su-w-[56px] su-h-[56px] su-p-3"),s.set("medium","su-min-w-[165px] su-w-[165px] su-h-[165px] su-p-7"),s.set("large","su-min-w-[218px] su-w-[218px] su-h-[218px] su-p-9");const r=new Map;return r.set("small","su-w-50 su-h-50 su-top-3 su-left-3"),r.set("medium","su-size-150 su-top-7 su-left-8"),r.set("large","su-size-200 su-top-9 su-left-9"),e?`
    <div
      data-test="size-${t}"
      class="su-component-avatar su-relative su-block su-rounded-full su-bg-gradient-light-red-h su-overflow-hidden ${s.get(t)}"
    >
      <img
        class="su-absolute su-rounded-full su-object-cover su-object-center ${r.get(t)}"
        src="${e}"
        alt="${n}"
      />
    </div>
  `:""}const _={root:"su-grid su-grid-gap su-grid-cols-6 lg:su-grid-cols-10",contentWrapper:"su-flex su-flex-col su-gap-12 su-col-start-1 su-col-span-full lg:su-col-span-6 lg:su-col-start-3",source:"su-text-16 lg:su-text-18 su-leading-[130%] su-font-semibold su-my-0",taxonomy:"su-relative su-text-16 su-leading-[2.3rem] lg:su-text-18 su-z-10 su-mb-0 su-font-semibold",taxonomyLink:"focus:su-outline-0 focus:su-ring su-text-digital-red su-no-underline hover:su-text-digital-red dark:su-text-dark-mode-red hover:dark:su-text-dark-mode-red hocus:su-underline",heading:"su-font-serif su-basefont-23 su-my-0",link:"su-group hocus:su-text-digital-red hocus:su-underline su-transition su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red",linkIcon:"su-text-digital-red dark:su-text-dark-mode-red su-translate-x-0 su-translate-y-0 su-transition group-hocus:su-translate-y-[-.1em] group-hocus:su-translate-x-[.1em] su-inline-block",description:"su-my-0 su-text-16 su-leading-[2.4rem] lg:su-text-18 lg:su-leading-[2.7rem]",descriptionContent:"su-mb-0 su-w-full [&>*:last-child]:su-mb-0",authorWrapper:"su-flex su-w-full su-min-h-[56px] su-self-end lg:su-self-start su-items-center su-gap-10 su-text-black dark:su-text-white su-text-16 su-leading-[19.106px]",date:"su-text-black-70 dark:su-text-black-60 su-text-16 lg:su-text-18 su-leading-[130%] su-font-semibold su-my-0"};function cr({data:{title:e,description:t,liveUrl:n,imageUrl:s,date:r,authorAvatar:i,authorDisplayName:a,displayConfiguration:o,taxonomyFeaturedUnitLandingPageUrl:l,taxonomyFeaturedUnitText:d,isTeaser:f,storySource:u}}){const p=Array.isArray(s)?s[0]:s,h=i||p,c=i?"su-ml-[-3px] su-mb-[-3px]":"";let w=pt(n)&&(Array.isArray(f)?f[0]==="true":f==="true");const g=`
    <time class="su-text-black-70 dark:su-text-black-60 su-font-semibold">
      ${a?`
        <span>${M(`&nbsp;|&nbsp;${pe(r)}`)}</span>
      `:pe(r)}
    </time>
  `,v=a?`
    <span class="su-my-0">
      ${a}
      ${g}
    </span>
  `:g;return`
    <article aria-label="${e}" class="${_.root}" data-testid="narrow-horizontal-card">
      <div class="${_.contentWrapper}">
        ${o==="In the News"&&u?`
          <p class="${_.source}">
            ${M(u)}
          </p>
        `:""}

        ${o==="Announcements"&&d?`
          <p data-testid="vertical-card-taxonomy" class="${_.taxonomy}">
            ${l?`
              <a href="${l}" class="${_.taxonomyLink}">
                ${M(d)}
              </a>
            `:`
              <span>${M(d)}</span>
            `}
          </p>
        `:""}

        <h3 class="${_.heading}">
          <a class="${_.link}" href="${n}">
            <span>${M(e)}</span>
            ${w?`
              <span class="${_.linkIcon}">
                <span class="[&>*]:su-inline-block [&>*]:su-stroke-current [&>*]:su-w-24 [&>*]:su-h-23 [&>*]:su-rotate-[-45deg] [&>*]:su-translate-x-[.12em] [&>*]:su-translate-y-[-.08em]">
                  ${ar()}
                </span>
              </span>
            `:""}
          </a>
        </h3>

        ${t?`
          <div data-testid="narrow-horizontal-card-description" class="${_.description}">
            <div class="${_.descriptionContent}">
              ${M(t)}
            </div>
          </div>
        `:""}

        ${o==="Leadership Messages"?`
          <div class="${_.authorWrapper} ${c}">
            ${h?`
              ${lr({image:h,avatarSize:"small",alt:`Photo of ${a}`})}
            `:""}
            ${v}
          </div>
        `:""}

        ${r&&o!=="Leadership Messages"&&o!=="In the News"?`
          <p class="${_.date}">
            ${pe(r)}
          </p>
        `:""}
      </div>
    </article>
  `}function dr(e){const{videoId:t,className:n="",noAutoPlay:s,title:r,isVertical:i}=e;return`
        <iframe
            width="${i?315:560}"
            height="${i?560:315}"
            class="${n}"
            src="https://www.youtube.com/embed/${t}?si=vYU81uVmaV7GSju2&amp;autoplay=${s?0:1}&amp;controls=1&amp;rel=0"
            title="${r}"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen="true"
            data-modal="iframe"
        ></iframe>
    `}const ur='section[data-component="topic-subtopic-listing"]',fr='[data-element="topics-list"]',Dt='[data-element="topics-pagination"]',Bt="su-hidden",pr='section[data-element="modal-wrapper"]',hr='button[data-click="open-modal"]',mr='button[data-dismiss="modal"]',Pt='iframe[data-modal="iframe"]';function Cr(e){const t=e.querySelector(Pt),s=t.getAttribute("src").replace("autoplay=0","autoplay=1");t.setAttribute("src",s),e.classList.remove(Bt),e.hidden=!1,document.body.style.overflow="hidden"}function Se(e){const t=e.querySelector(Pt),s=t.getAttribute("src").replace("autoplay=1","autoplay=0");t.setAttribute("src",s),e.classList.add(Bt),e.hidden=!0,document.body.style.overflow="hidden"}function Zt(e){const t=e.querySelectorAll(hr),n=e.querySelectorAll(mr);let s=null;t&&t.forEach(r=>{r&&r.addEventListener("click",function(){const i=r.dataset.modalId;if(s=e.querySelector(`div[data-modal-id="${i}"]`),!s)return;const a=s.querySelector(".su-modal-content");s.dataset.listenerAdded||(a&&s.addEventListener("click",o=>{a.contains(o.target)||Se(s)}),s.dataset.listenerAdded="true"),Cr(s)})}),n&&n.forEach(r=>{r&&r.addEventListener("click",function(){s&&Se(s)})}),document.addEventListener("keydown",function(r){r.key==="Escape"&&s&&Se(s)})}async function gr(e){const{offset:t,query:n,endpoint:s}=e,r=s+n+`&start_rank=${t}`;return await(await fetch(r).catch(o=>{throw new Error(o)})).json()}function vr(e,t,n,s){e.querySelector(fr).innerHTML=`<div class="su-w-full su-component-horizontal-card-grid" data-test="orientation-topiclisting"><div class="su-relative su-grid su-grid-cols-1 su-gap-30 md:su-gap-48 lg:su-gap-61">${t}</div></div>`,e.querySelector(Dt).innerHTML=n,e.querySelector(pr).innerHTML=s,window.scrollTo({top:0,behavior:"smooth"}),Zt(e),Gt(e)}async function yr(e){var p,h,c,w,g;const{offset:t,query:n,endpoint:s,display:r,section:i}=e,a=await gr({offset:t,query:n,endpoint:s}),o=(h=(p=a==null?void 0:a.response)==null?void 0:p.resultPacket)==null?void 0:h.resultsSummary;if(!o){console.warn("Missing resultsSummary from API response");return}const l=[],d=[];(g=(w=(c=a==null?void 0:a.response)==null?void 0:c.resultPacket)==null?void 0:w.results)==null||g.forEach(v=>{const C=j1(),m=F1(v);m.uniqueID=C,["Press Center","Leadership Messages","University Updates","Announcements","In the News"].includes(r)?(m.displayConfiguration=r,l.push(`<div class="su-relative su-grow">${cr({data:m,cardType:"narrowhorizontal"})}</div>`)):l.push(`<div class="su-relative su-grow">${or({data:m,cardType:"horizontal",cardSize:"large"})}</div>`),(m.type==="Video"||m.videoUrl)&&d.push({isVertical:m.size==="vertical-video",videoId:m.videoUrl,title:`Watch ${m.title}`,noAutoPlay:!0,uniqueID:m.uniqueID,titleID:"card-modal"})});const f=Zs({pageNumber:Number(t),allResults:o.totalMatching,resultsPerPage:o.numRanks,paginationRange:5,currentPage:Number(t)}),u=d.map(v=>`
        <div hidden="true" aria-modal="true" role="dialog" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="${v.uniqueID}"><span data-focus-scope-start="true" hidden="true"></span><div aria-describedby="${v.titleID}" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content">
        ${dr({videoId:v.videoId,title:v.title,noAutoPlay:v.noAutoPlay,isVertical:v.isVertical})}
        </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"> <svg class="su-fill-currentcolor" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z"></path></svg><span>Close</span></button><span data-focus-scope-end="true" hidden="true"></span></div>
        `).join("");vr(i,l.join(""),f,u)}function Gt(e){const{query:t,endpoint:n,display:s}=e.dataset,r=e.querySelector(Dt);if(!r)return;r.querySelectorAll("button").forEach(a=>{a.addEventListener("click",()=>{if(a.disabled)return;const o=a.getAttribute("data-offset");yr({offset:o,query:t,endpoint:n,display:s,section:e})})})}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(ur).forEach(e=>{Zt(e),Gt(e)})});const wr='section[data-component="vertical-video-panel"]',Ut="su-hidden",Lr='button[data-click="open-modal"]',Er='button[data-dismiss="modal"]',Ft='iframe[data-modal="iframe"]';function br(e){const t=e.querySelector(Ft),s=t.getAttribute("src").replace("autoplay=0","autoplay=1");t.setAttribute("src",s),e.classList.remove(Ut),e.hidden=!1,document.body.style.overflow="hidden"}function Ae(e){const t=e.querySelector(Ft),s=t.getAttribute("src").replace("autoplay=1","autoplay=0");t.setAttribute("src",s),e.classList.add(Ut),e.hidden=!0,document.body.style.overflow=""}function Sr(e){const t=e.querySelectorAll(Lr),n=e.querySelectorAll(Er);let s=null;t&&t.forEach(r=>{r&&r.addEventListener("click",function(){const i=r.dataset.modalId;if(s=e.querySelector(`div[data-modal-id="${i}"]`),!s)return;const a=s.querySelector(".su-modal-content");s.dataset.listenerAdded||(a&&s.addEventListener("click",o=>{a.contains(o.target)||Ae(s)}),s.dataset.listenerAdded="true"),br(s)})}),n&&n.forEach(r=>{r&&r.addEventListener("click",function(){s&&Ae(s)})}),document.addEventListener("keydown",function(r){r.key==="Escape"&&s&&Ae(s)})}function Ar(e){var s;const t=e.dataset.uniqueId;if(e.querySelectorAll(".swiper-slide").length>1){let r=!1;const i=new B(`section[data-unique-id="${t}"] .swiper`,{breakpoints:{0:{slidesPerView:1.4,spaceBetween:20,centeredSlides:!0,initialSlide:0},576:{slidesPerView:1.6,spaceBetween:20,centeredSlides:!0,initialSlide:0},768:{slidesPerView:1.9,spaceBetween:50,centeredSlides:!0,initialSlide:0}},slidesPerView:1,watchSlidesProgress:!0,loop:!0,loopAdditionalSlides:0,keyboard:{enabled:!0,onlyInViewport:!0},a11y:{prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide"},navigation:{nextEl:`section[data-unique-id="${t}"] .component-slider-next`,prevEl:`section[data-unique-id="${t}"] .component-slider-prev`},pagination:{el:`.component-slider-pagination-${t}`,clickable:!0,bulletElement:"button",renderBullet:function(a,o){return`<button ${a===0?'aria-current="true"':""} class="${o}"><span class="sr-only">Slide ${a+1}</span></button>`}},on:{init:a=>{N(a),b(a,"",!1)},resize:a=>{N(a)},paginationUpdate:a=>{re(a)}}});document.addEventListener("keydown",function(){r=!0}),document.addEventListener("mousedown",()=>{r=!1}),document.addEventListener("touchstart",()=>{r=!1}),document.addEventListener("pointerdown",()=>{r=!1}),i.on("slideChange",function(){setTimeout(()=>{r?b(i,"h2 a, h3 a, button",!0):b(i,"",!1)},100)})}else(s=e.querySelector(".component-slider-controls"))==null||s.remove()}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(wr).forEach(e=>{Ar(e),Sr(e)})});
