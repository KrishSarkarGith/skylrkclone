import{m as bt}from"./module.esm-BWrzqhGa.js";const Lh="modulepreload",Ih=function(n,e){return new URL(n,e).href},Ol={},Fh=function(e,t,i){let r=Promise.resolve();if(t&&t.length>0){let c=function(u){return Promise.all(u.map(f=>Promise.resolve(f).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};const o=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),l=a?.nonce||a?.getAttribute("nonce");r=c(t.map(u=>{if(u=Ih(u,i),u in Ol)return;Ol[u]=!0;const f=u.endsWith(".css"),h=f?'[rel="stylesheet"]':"";if(i)for(let g=o.length-1;g>=0;g--){const _=o[g];if(_.href===u&&(!f||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${h}`))return;const p=document.createElement("link");if(p.rel=f?"stylesheet":Lh,f||(p.as="script"),p.crossOrigin="",p.href=u,l&&p.setAttribute("nonce",l),document.head.appendChild(p),f)return new Promise((g,_)=>{p.addEventListener("load",g),p.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return r.then(o=>{for(const a of o||[])a.status==="rejected"&&s(a.reason);return e().catch(s)})};function Mt(...n){}function Wa(n){const e=n.replace("#","");return[parseInt(e.slice(0,2),16)/255,parseInt(e.slice(2,4),16)/255,parseInt(e.slice(4,6),16)/255]}function Xa(n,e,t){const i=Math.max(n,e,t),r=Math.min(n,e,t),s=(i+r)/2;if(i===r)return[0,0,s];const o=i-r,a=s>.5?o/(2-i-r):o/(i+r);let l=0;return i===n?l=((e-t)/o+(e<t?6:0))/6:i===e?l=((t-n)/o+2)/6:l=((n-e)/o+4)/6,[l*360,a,s]}function Di(n,e,t){const i=n/360;if(e===0)return[t,t,t];const r=t<.5?t*(1+e):t+e-t*e,s=2*t-r,o=a=>(a<0&&(a+=1),a>1&&(a-=1),a<1/6?s+(r-s)*6*a:a<1/2?r:a<2/3?s+(r-s)*(2/3-a)*6:s);return[o(i+1/3),o(i),o(i-1/3)]}function Cu(n){const[e,t,i]=Wa(n),[r,s,o]=Xa(e,t,i);if(o>=.25)return n;const a=Math.max(o,.12)+.13,[l,c,u]=Di(r,s,a),f=h=>Math.round(h*255).toString(16).padStart(2,"0");return`#${f(l)}${f(c)}${f(u)}`}function Ru(n){const[e,t,i]=Wa(n),[r,s,o]=Xa(e,t,i);if(o<.75)return n;const a=.65+(o-.75)*.4,l=Math.min(s*1.3,1),[c,u,f]=Di(r,l,a),h=p=>Math.round(p*255).toString(16).padStart(2,"0");return`#${h(c)}${h(u)}${h(f)}`}function ws(n){const[e,t,i]=Wa(n),[r,s,o]=Xa(e,t,i),a=s*.85,l=s*.95,c=s*.9,u=s*.7,f=Math.min(o+.25,.78),h=Math.max(o-.2,.22),p=o;return{top:Di(r,a,f),bottom:Di(r,l,h),accent:Di(r,c,p),dark:Di(r,u,.18)}}const Bs=`
varying vec2 vTextureCoord;
void main() {
  vTextureCoord = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Nh=`
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uTopColor;
uniform vec3 uBottomColor;
uniform vec3 uAccentColor;
uniform vec3 uDarkColor;
uniform vec2 uFocusPoint;
uniform float uFocusStrength;

varying vec2 vTextureCoord;

#define filmGrainIntensity 0.1

mat2 Rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
  return fract(sin(p) * 43758.5453);
}

float noise(in vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float n = mix(mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                    dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                    dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
  return 0.5 + 0.5 * n;
}

float filmGrainNoise(in vec2 uv) {
  return length(hash(vec2(uv.x, uv.y)));
}

void main() {
  vec2 uv = vTextureCoord;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 tuv = uv - 0.5;

  float t = uTime * 0.5;

  // Rotate with noise
  float degree = noise(vec2(t * 0.05, tuv.x * tuv.y));
  tuv.y *= 1.0 / aspectRatio;
  tuv *= Rot(radians((degree - 0.5) * 720.0 + 180.0));
  tuv.y *= aspectRatio;

  // Wave warp with sine
  float frequency = 5.0;
  float amplitude = 30.0;
  float speed = t * 2.0;
  tuv.x += sin(tuv.y * frequency + speed) / amplitude;
  tuv.y += sin(tuv.x * frequency * 1.5 + speed) / (amplitude * 0.5);

  // Dark palette from uniforms
  vec3 color1 = uTopColor;
  vec3 color2 = uDarkColor;
  vec3 color3 = uAccentColor;
  vec3 color4 = uBottomColor;

  // --- Flat gradient (original 4-color lava lamp blend) ---
  vec3 layer1 = mix(color3, color2, smoothstep(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));
  vec3 layer2 = mix(color4, color1, smoothstep(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));
  vec3 flatColor = mix(layer1, layer2, smoothstep(0.5, -0.3, tuv.y));

  // --- Radial brightness boost at focus point ---
  // Distortion offset: how much the lava lamp warped each pixel
  vec2 warp = tuv - (uv - 0.5);

  // Radial distance: anchored to mouse, edges wobble with lava lamp
  vec2 focusPt = uFocusPoint - 0.5;
  vec2 delta = (uv - 0.5) - focusPt + warp * 0.5;
  delta.x *= aspectRatio;
  float d = length(delta);

  // Soft radial glow — brighten the lava lamp toward the lightest palette color
  float radialMask = smoothstep(0.6, 0.0, d) * uFocusStrength;
  vec3 col = mix(flatColor, mix(flatColor, color1, 0.45), radialMask);

  // Film grain
  col = col - filmGrainNoise(uv) * filmGrainIntensity;

  gl_FragColor = vec4(col, 1.0);
}
`,Uh=`
precision highp float;
precision highp int;

varying vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
uniform float uIntensity;

vec3 channel_mix(vec3 a, vec3 b, vec3 w) {
  return vec3(mix(a.r, b.r, w.r), mix(a.g, b.g, w.g), mix(a.b, b.b, w.b));
}

float gaussian(float z, float u, float o) {
  return (1.0 / (o * sqrt(2.0 * 3.1415))) * exp(-(((z - u) * (z - u)) / (2.0 * (o * o))));
}

void main() {
  vec2 uv = vTextureCoord;
  vec4 color = texture2D(uTexture, uv);

  float t = uTime * 2.0;
  float seed = dot(uv, vec2(12.9898, 78.233));
  float noise = fract(sin(seed) * 43758.5453 + t);
  noise = gaussian(noise, 0.0, 0.5 * 0.5);

  vec3 grain = vec3(noise) * (1.0 - color.rgb);
  color.rgb += grain * uIntensity;

  gl_FragColor = color;
}
`,Oh=`
precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uFadeIn;

void main() {
  vec4 tex = texture2D(uTexture, vTextureCoord);
  gl_FragColor = vec4(tex.rgb * uFadeIn, uFadeIn);
}
`,Co=[{id:"lava-lamp",name:"Lava Lamp",author:"welches",url:"https://www.shadertoy.com/view/DdcfzH",fragmentShader:Nh}];function Bl(n){const e=i=>i<=.03928?i/12.92:Math.pow((i+.055)/1.055,2.4);return .2126*e(n[0])+.7152*e(n[1])+.0722*e(n[2])>.4}const qa="#5252CC",Bh=ws(qa);function Vh(){const n=window.SKYLRK?.initialGradientColor||window.SKYLRK?.fallbackGradientColor;return n?{colors:ws(n),hex:n}:{colors:Bh,hex:qa}}function zh(n){n.store("menu",{isOpen:!1,toggle(){this.isOpen=!this.isOpen},close(){this.isOpen=!1}});const e=Vh(),t=window.SKYLRK?.fallbackGradientColor||qa;n.store("gradient",{currentHex:e.hex,fallbackGradientHex:t,shouldTextBeDark:Bl(e.colors.top),topColor:e.colors.top,bottomColor:e.colors.bottom,accentColor:e.colors.accent,darkColor:e.colors.dark,focusPoint:null,effectId:Co[0].id,transitionDuration:0,isTransitioning:!1,init(){this.shouldTextBeDark},setFromHex(i,r){if(i=(l=>{if(!l||typeof l!="string")return null;let c=l.trim();if(!c)return null;c.startsWith("#")||(c=`#${c}`);const u=c.slice(1);if(/^[0-9A-Fa-f]{3}$/.test(u)){const[f,h,p]=u;return`#${f}${f}${h}${h}${p}${p}`}return/^[0-9A-Fa-f]{6}$/.test(u)?`#${u}`:/^[0-9A-Fa-f]{8}$/.test(u)?`#${u.slice(0,6)}`:null})(i)??this.fallbackGradientHex,this.isTransitioning&&this.currentHex===i)return;this.isTransitioning=!0,this.transitionDuration=r??.8,this.currentHex=i;const a=ws(i);this.topColor=a.top,this.bottomColor=a.bottom,this.accentColor=a.accent,this.darkColor=a.dark,this.shouldTextBeDark=Bl(a.top),this.shouldTextBeDark,setTimeout(()=>{this.isTransitioning=!1},(r??.8)*1e3)},revertToFallback(i){this.setFromHex(this.fallbackGradientHex,i??.8)}}),n.store("wallpaper",{open:!1,data:null,clearDataTimeoutId:null,openModal(i,r){this.clearDataTimeoutId&&(clearTimeout(this.clearDataTimeoutId),this.clearDataTimeoutId=null),this.data=i,this.open=!0,n.store("modal")?.open?.("wallpaper");const o=i?.color;let a=null;if(typeof o=="string"&&/^#?[0-9A-Fa-f]{6}$/.test(o.trim()))a=o.trim().startsWith("#")?o.trim():`#${o.trim()}`;else if(o&&typeof o=="object"){if(typeof o.hex=="string"&&/^#?[0-9A-Fa-f]{6}$/.test(o.hex.trim())){const u=o.hex.trim();a=u.startsWith("#")?u:`#${u}`}else if(typeof o.color=="string"&&/^#?[0-9A-Fa-f]{6}$/.test(o.color.trim())){const u=o.color.trim();a=u.startsWith("#")?u:`#${u}`}else if(typeof o.r=="number"&&typeof o.g=="number"&&typeof o.b=="number"){const u=Number(o.r),f=Number(o.g),h=Number(o.b);u>=0&&u<=1&&f>=0&&f<=1&&h>=0&&h<=1?a="#"+[u,f,h].map(p=>Math.round(p*255).toString(16).padStart(2,"0")).join(""):u>=0&&u<=255&&f>=0&&f<=255&&h>=0&&h<=255&&(a="#"+[Math.round(u),Math.round(f),Math.round(h)].map(p=>p.toString(16).padStart(2,"0")).join(""))}}const l=n.store("gradient"),c=a&&window.SKYLRK?.adjustGradientHex&&window.SKYLRK.adjustGradientHex(a)||a;if(a&&l){if(r?.clientX!=null&&r?.clientY!=null){const f=r.clientX/window.innerWidth,h=1-r.clientY/window.innerHeight;l.focusPoint=[f,h]}else l.focusPoint=null;const u=n.nextTick;u?u(()=>{l.setFromHex?.(c,.8)}):l.setFromHex?.(c,.8)}else l&&(l.focusPoint=null,l.revertToFallback?.(.8))},closeModal(){this.open=!1;const i=n.store("modal"),r=n.store("gradient");i?.close?.("wallpaper"),r?.revertToFallback?.(.8),this.clearDataTimeoutId=setTimeout(()=>{this.open||(this.data=null),this.clearDataTimeoutId=null},350)},openInNewTab(i){i&&window.open(i,"_blank","noopener,noreferrer")}})}var kh="1.3.17";function Pu(n,e,t){return Math.max(n,Math.min(e,t))}function Gh(n,e,t){return(1-t)*n+t*e}function Hh(n,e,t,i){return Gh(n,e,1-Math.exp(-t*i))}function Wh(n,e){return(n%e+e)%e}var Xh=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(n){if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=n;const t=Pu(0,this.currentTime/this.duration,1);e=t>=1;const i=e?1:this.easing(t);this.value=this.from+(this.to-this.from)*i}else this.lerp?(this.value=Hh(this.value,this.to,this.lerp*60,n),Math.round(this.value)===this.to&&(this.value=this.to,e=!0)):(this.value=this.to,e=!0);e&&this.stop(),this.onUpdate?.(this.value,e)}stop(){this.isRunning=!1}fromTo(n,e,{lerp:t,duration:i,easing:r,onStart:s,onUpdate:o}){this.from=this.value=n,this.to=e,this.lerp=t,this.duration=i,this.easing=r,this.currentTime=0,this.isRunning=!0,s?.(),this.onUpdate=o}};function qh(n,e){let t;return function(...i){let r=this;clearTimeout(t),t=setTimeout(()=>{t=void 0,n.apply(r,i)},e)}}var Yh=class{constructor(n,e,{autoResize:t=!0,debounce:i=250}={}){this.wrapper=n,this.content=e,t&&(this.debouncedResize=qh(this.resize,i),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize,!1):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize,!1)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},Du=class{events={};emit(n,...e){let t=this.events[n]||[];for(let i=0,r=t.length;i<r;i++)t[i]?.(...e)}on(n,e){return this.events[n]?.push(e)||(this.events[n]=[e]),()=>{this.events[n]=this.events[n]?.filter(t=>e!==t)}}off(n,e){this.events[n]=this.events[n]?.filter(t=>e!==t)}destroy(){this.events={}}},Vl=100/6,In={passive:!1},$h=class{constructor(n,e={wheelMultiplier:1,touchMultiplier:1}){this.element=n,this.options=e,window.addEventListener("resize",this.onWindowResize,!1),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,In),this.element.addEventListener("touchstart",this.onTouchStart,In),this.element.addEventListener("touchmove",this.onTouchMove,In),this.element.addEventListener("touchend",this.onTouchEnd,In)}touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new Du;on(n,e){return this.emitter.on(n,e)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize,!1),this.element.removeEventListener("wheel",this.onWheel,In),this.element.removeEventListener("touchstart",this.onTouchStart,In),this.element.removeEventListener("touchmove",this.onTouchMove,In),this.element.removeEventListener("touchend",this.onTouchEnd,In)}onTouchStart=n=>{const{clientX:e,clientY:t}=n.targetTouches?n.targetTouches[0]:n;this.touchStart.x=e,this.touchStart.y=t,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:n})};onTouchMove=n=>{const{clientX:e,clientY:t}=n.targetTouches?n.targetTouches[0]:n,i=-(e-this.touchStart.x)*this.options.touchMultiplier,r=-(t-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=e,this.touchStart.y=t,this.lastDelta={x:i,y:r},this.emitter.emit("scroll",{deltaX:i,deltaY:r,event:n})};onTouchEnd=n=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:n})};onWheel=n=>{let{deltaX:e,deltaY:t,deltaMode:i}=n;const r=i===1?Vl:i===2?this.window.width:1,s=i===1?Vl:i===2?this.window.height:1;e*=r,t*=s,e*=this.options.wheelMultiplier,t*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:e,deltaY:t,event:n})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}},zl=n=>Math.min(1,1.001-Math.pow(2,-10*n)),Ui=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;isTouching;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new Xh;emitter=new Du;dimensions;virtualScroll;constructor({wrapper:n=window,content:e=document.documentElement,eventsTarget:t=n,smoothWheel:i=!0,syncTouch:r=!1,syncTouchLerp:s=.075,touchInertiaExponent:o=1.7,duration:a,easing:l,lerp:c=.1,infinite:u=!1,orientation:f="vertical",gestureOrientation:h=f==="horizontal"?"both":"vertical",touchMultiplier:p=1,wheelMultiplier:g=1,autoResize:_=!0,prevent:m,virtualScroll:d,overscroll:y=!0,autoRaf:S=!1,anchors:T=!1,autoToggle:b=!1,allowNestedScroll:A=!1,__experimental__naiveDimensions:C=!1,naiveDimensions:P=C,stopInertiaOnNavigate:x=!1}={}){window.lenisVersion=kh,(!n||n===document.documentElement)&&(n=window),typeof a=="number"&&typeof l!="function"?l=zl:typeof l=="function"&&typeof a!="number"&&(a=1),this.options={wrapper:n,content:e,eventsTarget:t,smoothWheel:i,syncTouch:r,syncTouchLerp:s,touchInertiaExponent:o,duration:a,easing:l,lerp:c,infinite:u,gestureOrientation:h,orientation:f,touchMultiplier:p,wheelMultiplier:g,autoResize:_,prevent:m,virtualScroll:d,overscroll:y,autoRaf:S,anchors:T,autoToggle:b,allowNestedScroll:A,naiveDimensions:P,stopInertiaOnNavigate:x},this.dimensions=new Yh(n,e,{autoResize:_}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick,!1),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown,!1),this.virtualScroll=new $h(t,{touchMultiplier:p,wheelMultiplier:g}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd,{passive:!0})),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown,!1),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick,!1),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(n,e){return this.emitter.on(n,e)}off(n,e){return this.emitter.off(n,e)}onScrollEnd=n=>{n instanceof CustomEvent||(this.isScrolling==="smooth"||this.isScrolling===!1)&&n.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){const n=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[n]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=n=>{n.propertyName.includes("overflow")&&this.checkOverflow()};setScroll(n){this.isHorizontal?this.options.wrapper.scrollTo({left:n,behavior:"instant"}):this.options.wrapper.scrollTo({top:n,behavior:"instant"})}onClick=n=>{const t=n.composedPath().filter(i=>i instanceof HTMLAnchorElement&&i.getAttribute("href"));if(this.options.anchors){const i=t.find(r=>r.getAttribute("href")?.includes("#"));if(i){const r=i.getAttribute("href");if(r){const s=typeof this.options.anchors=="object"&&this.options.anchors?this.options.anchors:void 0,o=`#${r.split("#")[1]}`;this.scrollTo(o,s)}}}this.options.stopInertiaOnNavigate&&t.find(r=>r.host===window.location.host)&&this.reset()};onPointerDown=n=>{n.button===1&&this.reset()};onVirtualScroll=n=>{if(typeof this.options.virtualScroll=="function"&&this.options.virtualScroll(n)===!1)return;const{deltaX:e,deltaY:t,event:i}=n;if(this.emitter.emit("virtual-scroll",{deltaX:e,deltaY:t,event:i}),i.ctrlKey||i.lenisStopPropagation)return;const r=i.type.includes("touch"),s=i.type.includes("wheel");this.isTouching=i.type==="touchstart"||i.type==="touchmove";const o=e===0&&t===0;if(this.options.syncTouch&&r&&i.type==="touchstart"&&o&&!this.isStopped&&!this.isLocked){this.reset();return}const l=this.options.gestureOrientation==="vertical"&&t===0||this.options.gestureOrientation==="horizontal"&&e===0;if(o||l)return;let c=i.composedPath();c=c.slice(0,c.indexOf(this.rootElement));const u=this.options.prevent;if(c.find(m=>m instanceof HTMLElement&&(typeof u=="function"&&u?.(m)||m.hasAttribute?.("data-lenis-prevent")||r&&m.hasAttribute?.("data-lenis-prevent-touch")||s&&m.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.checkNestedScroll(m,{deltaX:e,deltaY:t}))))return;if(this.isStopped||this.isLocked){i.cancelable&&i.preventDefault();return}if(!(this.options.syncTouch&&r||this.options.smoothWheel&&s)){this.isScrolling="native",this.animate.stop(),i.lenisStopPropagation=!0;return}let h=t;this.options.gestureOrientation==="both"?h=Math.abs(t)>Math.abs(e)?t:e:this.options.gestureOrientation==="horizontal"&&(h=e),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&t>0||this.animatedScroll===this.limit&&t<0))&&(i.lenisStopPropagation=!0),i.cancelable&&i.preventDefault();const p=r&&this.options.syncTouch,_=r&&i.type==="touchend";_&&(h=Math.sign(this.velocity)*Math.pow(Math.abs(this.velocity),this.options.touchInertiaExponent)),this.scrollTo(this.targetScroll+h,{programmatic:!1,...p?{lerp:_?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling==="native"){const n=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-n,this.direction=Math.sign(this.animatedScroll-n),this.isStopped||(this.isScrolling="native"),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty("overflow");return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty("overflow","clip");return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=n=>{const e=n-(this.time||n);this.time=n,this.animate.advance(e*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(n,{offset:e=0,immediate:t=!1,lock:i=!1,programmatic:r=!0,lerp:s=r?this.options.lerp:void 0,duration:o=r?this.options.duration:void 0,easing:a=r?this.options.easing:void 0,onStart:l,onComplete:c,force:u=!1,userData:f}={}){if(!((this.isStopped||this.isLocked)&&!u)){if(typeof n=="string"&&["top","left","start","#"].includes(n))n=0;else if(typeof n=="string"&&["bottom","right","end"].includes(n))n=this.limit;else{let h;if(typeof n=="string"?(h=document.querySelector(n),h||(n==="#top"?n=0:console.warn("Lenis: Target not found",n))):n instanceof HTMLElement&&n?.nodeType&&(h=n),h){if(this.options.wrapper!==window){const g=this.rootElement.getBoundingClientRect();e-=this.isHorizontal?g.left:g.top}const p=h.getBoundingClientRect();n=(this.isHorizontal?p.left:p.top)+this.animatedScroll}}if(typeof n=="number"){if(n+=e,n=Math.round(n),this.options.infinite){if(r){this.targetScroll=this.animatedScroll=this.scroll;const h=n-this.animatedScroll;h>this.limit/2?n=n-this.limit:h<-this.limit/2&&(n=n+this.limit)}}else n=Pu(0,n,this.limit);if(n===this.targetScroll){l?.(this),c?.(this);return}if(this.userData=f??{},t){this.animatedScroll=this.targetScroll=n,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),c?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}r||(this.targetScroll=n),typeof o=="number"&&typeof a!="function"?a=zl:typeof a=="function"&&typeof o!="number"&&(o=1),this.animate.fromTo(this.animatedScroll,n,{duration:o,easing:a,lerp:s,onStart:()=>{i&&(this.isLocked=!0),this.isScrolling="smooth",l?.(this)},onUpdate:(h,p)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=h-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=h,this.setScroll(this.scroll),r&&(this.targetScroll=h),p||this.emit(),p&&(this.reset(),this.emit(),c?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}checkNestedScroll(n,{deltaX:e,deltaY:t}){const i=Date.now(),r=n._lenis??={};let s,o,a,l,c,u,f,h;const p=this.options.gestureOrientation;if(i-(r.time??0)>2e3){r.time=Date.now();const b=window.getComputedStyle(n);r.computedStyle=b;const A=b.overflowX,C=b.overflowY;if(s=["auto","overlay","scroll"].includes(A),o=["auto","overlay","scroll"].includes(C),r.hasOverflowX=s,r.hasOverflowY=o,!s&&!o||p==="vertical"&&!o||p==="horizontal"&&!s)return!1;c=n.scrollWidth,u=n.scrollHeight,f=n.clientWidth,h=n.clientHeight,a=c>f,l=u>h,r.isScrollableX=a,r.isScrollableY=l,r.scrollWidth=c,r.scrollHeight=u,r.clientWidth=f,r.clientHeight=h}else a=r.isScrollableX,l=r.isScrollableY,s=r.hasOverflowX,o=r.hasOverflowY,c=r.scrollWidth,u=r.scrollHeight,f=r.clientWidth,h=r.clientHeight;if(!s&&!o||!a&&!l||p==="vertical"&&(!o||!l)||p==="horizontal"&&(!s||!a))return!1;let g;if(p==="horizontal")g="x";else if(p==="vertical")g="y";else{const b=e!==0,A=t!==0;b&&s&&a&&(g="x"),A&&o&&l&&(g="y")}if(!g)return!1;let _,m,d,y,S;if(g==="x")_=n.scrollLeft,m=c-f,d=e,y=s,S=a;else if(g==="y")_=n.scrollTop,m=u-h,d=t,y=o,S=l;else return!1;return(d>0?_<m:_>0)&&y&&S}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){const n=this.options.wrapper;return this.isHorizontal?n.scrollX??n.scrollLeft:n.scrollY??n.scrollTop}get scroll(){return this.options.infinite?Wh(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(n){this._isScrolling!==n&&(this._isScrolling=n,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(n){this._isStopped!==n&&(this._isStopped=n,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(n){this._isLocked!==n&&(this._isLocked=n,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get className(){let n="lenis";return this.options.autoToggle&&(n+=" lenis-autoToggle"),this.isStopped&&(n+=" lenis-stopped"),this.isLocked&&(n+=" lenis-locked"),this.isScrolling&&(n+=" lenis-scrolling"),this.isScrolling==="smooth"&&(n+=" lenis-smooth"),n}updateClassName(){this.cleanUpClassName(),this.rootElement.className=`${this.rootElement.className} ${this.className}`.trim()}cleanUpClassName(){this.rootElement.className=this.rootElement.className.replace(/lenis(-\w+)?/g,"").trim()}};class hs extends Error{constructor(e,t,i){super(e),this.status=t,this.response=i,this.name="ShopifyFetchError"}}async function Vs(n,e="GET",t){const i={method:e,headers:{"Content-Type":"application/json",Accept:"application/json"}};t&&e==="POST"&&(i.body=JSON.stringify(t));const r=await fetch(n,i);if(!r.ok){const s=await r.json().catch(()=>null);throw new hs(s?.message||s?.description||`Request failed with status ${r.status}`,r.status,s)}return r.json()}function fr(n,e="USD"){return new Intl.NumberFormat("en-US",{style:"currency",currency:e}).format(n/100)}let Zn=null;const Kh={shopify:null,isOpen:!1,loading:!1,adding:!1,error:null,swatchMap:{},get count(){return this.shopify?.item_count??0},get items(){return this.shopify?.items??[]},get totalPrice(){return this.shopify?fr(this.shopify.total_price,this.shopify.currency):fr(0)},get hasItems(){return this.count>0},get currency(){return this.shopify?.currency??"USD"},init(){try{const n=document.getElementById("cart-swatch-data");n?.textContent&&(this.swatchMap=JSON.parse(n.textContent))}catch(n){console.error("[cart store] Failed to parse swatch data:",n)}this.load(),document.addEventListener("keydown",n=>{n.key==="Escape"&&this.isOpen&&this.close()}),document.addEventListener("click",n=>{if(!this.isOpen)return;const e=n.target,t=document.querySelector(".cart-drawer"),i=document.querySelector(".header-cart-btn");t?.contains(e)||i?.contains(e)||this.close()})},open(){if(this.isOpen)return;this.isOpen=!0,document.body.style.overflow="hidden",window.Alpine?.store("modal")?.open("cart"),requestAnimationFrame(()=>{const e=document.querySelector(".cart-drawer__content");if(e&&!Zn){Zn=new Ui({wrapper:e,content:e,smoothWheel:!0,lerp:.1});const t=i=>{Zn&&(Zn.raf(i),requestAnimationFrame(t))};requestAnimationFrame(t)}})},close(){if(!this.isOpen)return;this.isOpen=!1,document.body.style.overflow="",window.Alpine?.store("modal")?.close("cart"),Zn&&(Zn.destroy(),Zn=null)},toggle(){this.isOpen?this.close():this.open()},async load(){this.loading=!0,this.error=null;try{this.shopify=await Vs("/cart.js","GET"),Mt("[cart store] cart loaded:",this.shopify?.item_count,"items")}catch(n){this.error=n instanceof hs?n.message:"Failed to load cart",console.error("[cart store] load error:",n)}finally{this.loading=!1}},async addItem(n,e=1,t){this.adding=!0,this.error=null;try{const i={id:n,quantity:e,...t&&{properties:t}},r=await Vs("/cart/add.js","POST",i);Mt("[cart store] addItem success:",r),await this.load(),this.open()}catch(i){this.error=i instanceof hs?i.message:"Failed to add item",console.error("[cart store] addItem error:",i)}finally{this.adding=!1}},async updateItem(n,e){this.loading=!0,this.error=null;try{const t={id:n,quantity:e};this.shopify=await Vs("/cart/change.js","POST",t)}catch(t){this.error=t instanceof hs?t.message:"Failed to update item",console.error("Update cart error:",t)}finally{this.loading=!1}},async removeItem(n){await this.updateItem(n,0)},getSwatchStyle(n){const e=this.swatchMap[n?.toLowerCase()];return e?e.image?`background-image: url(${e.image}); background-size: cover;`:e.hex?`background-color: ${e.hex}`:"":""},hasSwatchData(n){const e=this.swatchMap[n?.toLowerCase()];return!!(e?.hex||e?.image)}};function Zh(n,e){n.indexOf(e)===-1&&n.push(e)}function Ya(n,e){const t=n.indexOf(e);t>-1&&n.splice(t,1)}const Xn=(n,e,t)=>t>e?e:t<n?n:t;let $a=()=>{};const Cn={},Lu=n=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(n);function jh(n){return typeof n=="object"&&n!==null}const Iu=n=>/^0[^.\s]+$/u.test(n);function Ka(n){let e;return()=>(e===void 0&&(e=n()),e)}const Wi=n=>n,Jh=(n,e)=>t=>e(n(t)),Za=(...n)=>n.reduce(Jh),ja=(n,e,t)=>{const i=e-n;return i===0?1:(t-n)/i};class Fu{constructor(){this.subscriptions=[]}add(e){return Zh(this.subscriptions,e),()=>Ya(this.subscriptions,e)}notify(e,t,i){const r=this.subscriptions.length;if(r)if(r===1)this.subscriptions[0](e,t,i);else for(let s=0;s<r;s++){const o=this.subscriptions[s];o&&o(e,t,i)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const En=n=>n*1e3,tn=n=>n/1e3;function Nu(n,e){return e?n*(1e3/e):0}const Qh=(n,e,t)=>{const i=e-n;return((t-n)%i+i)%i+n},Uu=(n,e,t)=>(((1-3*t+3*e)*n+(3*t-6*e))*n+3*e)*n,ed=1e-7,td=12;function nd(n,e,t,i,r){let s,o,a=0;do o=e+(t-e)/2,s=Uu(o,i,r)-n,s>0?t=o:e=o;while(Math.abs(s)>ed&&++a<td);return o}function Cr(n,e,t,i){if(n===e&&t===i)return Wi;const r=s=>nd(s,0,1,n,t);return s=>s===0||s===1?s:Uu(r(s),e,i)}const Ou=n=>e=>e<=.5?n(2*e)/2:(2-n(2*(1-e)))/2,Bu=n=>e=>1-n(1-e),Vu=Cr(.33,1.53,.69,.99),Ja=Bu(Vu),zu=Ou(Ja),ku=n=>(n*=2)<1?.5*Ja(n):.5*(2-Math.pow(2,-10*(n-1))),Qa=n=>1-Math.sin(Math.acos(n)),id=Bu(Qa),Gu=Ou(Qa),rd=Cr(.42,0,1,1),sd=Cr(0,0,.58,1),Hu=Cr(.42,0,.58,1),Wu=n=>Array.isArray(n)&&typeof n[0]!="number";function Xu(n,e){return Wu(n)?n[Qh(0,n.length,e)]:n}const qu=n=>Array.isArray(n)&&typeof n[0]=="number",od={linear:Wi,easeIn:rd,easeInOut:Hu,easeOut:sd,circIn:Qa,circInOut:Gu,circOut:id,backIn:Ja,backInOut:zu,backOut:Vu,anticipate:ku},ad=n=>typeof n=="string",Ro=n=>{if(qu(n)){$a(n.length===4);const[e,t,i,r]=n;return Cr(e,t,i,r)}else if(ad(n))return od[n];return n},Vr=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function ld(n,e){let t=new Set,i=new Set,r=!1,s=!1;const o=new WeakSet;let a={delta:0,timestamp:0,isProcessing:!1};function l(u){o.has(u)&&(c.schedule(u),n()),u(a)}const c={schedule:(u,f=!1,h=!1)=>{const g=h&&r?t:i;return f&&o.add(u),g.has(u)||g.add(u),u},cancel:u=>{i.delete(u),o.delete(u)},process:u=>{if(a=u,r){s=!0;return}r=!0,[t,i]=[i,t],t.forEach(l),t.clear(),r=!1,s&&(s=!1,c.process(u))}};return c}const cd=40;function Yu(n,e){let t=!1,i=!0;const r={delta:0,timestamp:0,isProcessing:!1},s=()=>t=!0,o=Vr.reduce((S,T)=>(S[T]=ld(s),S),{}),{setup:a,read:l,resolveKeyframes:c,preUpdate:u,update:f,preRender:h,render:p,postRender:g}=o,_=()=>{const S=Cn.useManualTiming?r.timestamp:performance.now();t=!1,Cn.useManualTiming||(r.delta=i?1e3/60:Math.max(Math.min(S-r.timestamp,cd),1)),r.timestamp=S,r.isProcessing=!0,a.process(r),l.process(r),c.process(r),u.process(r),f.process(r),h.process(r),p.process(r),g.process(r),r.isProcessing=!1,t&&e&&(i=!1,n(_))},m=()=>{t=!0,i=!0,r.isProcessing||n(_)};return{schedule:Vr.reduce((S,T)=>{const b=o[T];return S[T]=(A,C=!1,P=!1)=>(t||m(),b.schedule(A,C,P)),S},{}),cancel:S=>{for(let T=0;T<Vr.length;T++)o[Vr[T]].cancel(S)},state:r,steps:o}}const{schedule:Rn,cancel:Po,state:Ss}=Yu(typeof requestAnimationFrame<"u"?requestAnimationFrame:Wi,!0);let ds;function ud(){ds=void 0}const Vt={now:()=>(ds===void 0&&Vt.set(Ss.isProcessing||Cn.useManualTiming?Ss.timestamp:performance.now()),ds),set:n=>{ds=n,queueMicrotask(ud)}},$u=n=>e=>typeof e=="string"&&e.startsWith(n),Ku=$u("--"),fd=$u("var(--"),el=n=>fd(n)?hd.test(n.split("/*")[0].trim()):!1,hd=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function kl(n){return typeof n!="string"?!1:n.split("/*")[0].includes("var(--")}const Xi={test:n=>typeof n=="number",parse:parseFloat,transform:n=>n},gr={...Xi,transform:n=>Xn(0,1,n)},zr={...Xi,default:1},hr=n=>Math.round(n*1e5)/1e5,tl=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function dd(n){return n==null}const pd=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,nl=(n,e)=>t=>!!(typeof t=="string"&&pd.test(t)&&t.startsWith(n)||e&&!dd(t)&&Object.prototype.hasOwnProperty.call(t,e)),Zu=(n,e,t)=>i=>{if(typeof i!="string")return i;const[r,s,o,a]=i.match(tl);return{[n]:parseFloat(r),[e]:parseFloat(s),[t]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}},md=n=>Xn(0,255,n),zs={...Xi,transform:n=>Math.round(md(n))},ai={test:nl("rgb","red"),parse:Zu("red","green","blue"),transform:({red:n,green:e,blue:t,alpha:i=1})=>"rgba("+zs.transform(n)+", "+zs.transform(e)+", "+zs.transform(t)+", "+hr(gr.transform(i))+")"};function gd(n){let e="",t="",i="",r="";return n.length>5?(e=n.substring(1,3),t=n.substring(3,5),i=n.substring(5,7),r=n.substring(7,9)):(e=n.substring(1,2),t=n.substring(2,3),i=n.substring(3,4),r=n.substring(4,5),e+=e,t+=t,i+=i,r+=r),{red:parseInt(e,16),green:parseInt(t,16),blue:parseInt(i,16),alpha:r?parseInt(r,16)/255:1}}const Do={test:nl("#"),parse:gd,transform:ai.transform},Rr=n=>({test:e=>typeof e=="string"&&e.endsWith(n)&&e.split(" ").length===1,parse:parseFloat,transform:e=>`${e}${n}`}),zn=Rr("deg"),Ii=Rr("%"),Pe=Rr("px"),_d=Rr("vh"),vd=Rr("vw"),Gl={...Ii,parse:n=>Ii.parse(n)/100,transform:n=>Ii.transform(n*100)},Li={test:nl("hsl","hue"),parse:Zu("hue","saturation","lightness"),transform:({hue:n,saturation:e,lightness:t,alpha:i=1})=>"hsla("+Math.round(n)+", "+Ii.transform(hr(e))+", "+Ii.transform(hr(t))+", "+hr(gr.transform(i))+")"},mt={test:n=>ai.test(n)||Do.test(n)||Li.test(n),parse:n=>ai.test(n)?ai.parse(n):Li.test(n)?Li.parse(n):Do.parse(n),transform:n=>typeof n=="string"?n:n.hasOwnProperty("red")?ai.transform(n):Li.transform(n),getAnimatableNone:n=>{const e=mt.parse(n);return e.alpha=0,mt.transform(e)}},xd=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function Sd(n){return isNaN(n)&&typeof n=="string"&&(n.match(tl)?.length||0)+(n.match(xd)?.length||0)>0}const ju="number",Ju="color",Md="var",yd="var(",Hl="${}",Ed=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function _r(n){const e=n.toString(),t=[],i={color:[],number:[],var:[]},r=[];let s=0;const a=e.replace(Ed,l=>(mt.test(l)?(i.color.push(s),r.push(Ju),t.push(mt.parse(l))):l.startsWith(yd)?(i.var.push(s),r.push(Md),t.push(l)):(i.number.push(s),r.push(ju),t.push(parseFloat(l))),++s,Hl)).split(Hl);return{values:t,split:a,indexes:i,types:r}}function Qu(n){return _r(n).values}function ef(n){const{split:e,types:t}=_r(n),i=e.length;return r=>{let s="";for(let o=0;o<i;o++)if(s+=e[o],r[o]!==void 0){const a=t[o];a===ju?s+=hr(r[o]):a===Ju?s+=mt.transform(r[o]):s+=r[o]}return s}}const Td=n=>typeof n=="number"?0:mt.test(n)?mt.getAnimatableNone(n):n;function bd(n){const e=Qu(n);return ef(n)(e.map(Td))}const qn={test:Sd,parse:Qu,createTransformer:ef,getAnimatableNone:bd};function ks(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*(2/3-t)*6:n}function Ad({hue:n,saturation:e,lightness:t,alpha:i}){n/=360,e/=100,t/=100;let r=0,s=0,o=0;if(!e)r=s=o=t;else{const a=t<.5?t*(1+e):t+e-t*e,l=2*t-a;r=ks(l,a,n+1/3),s=ks(l,a,n),o=ks(l,a,n-1/3)}return{red:Math.round(r*255),green:Math.round(s*255),blue:Math.round(o*255),alpha:i}}function Ms(n,e){return t=>t>0?e:n}const qi=(n,e,t)=>n+(e-n)*t,Gs=(n,e,t)=>{const i=n*n,r=t*(e*e-i)+i;return r<0?0:Math.sqrt(r)},wd=[Do,ai,Li],Cd=n=>wd.find(e=>e.test(n));function Wl(n){const e=Cd(n);if(!e)return!1;let t=e.parse(n);return e===Li&&(t=Ad(t)),t}const Xl=(n,e)=>{const t=Wl(n),i=Wl(e);if(!t||!i)return Ms(n,e);const r={...t};return s=>(r.red=Gs(t.red,i.red,s),r.green=Gs(t.green,i.green,s),r.blue=Gs(t.blue,i.blue,s),r.alpha=qi(t.alpha,i.alpha,s),ai.transform(r))},Lo=new Set(["none","hidden"]);function Rd(n,e){return Lo.has(n)?t=>t<=0?n:e:t=>t>=1?e:n}function Pd(n,e){return t=>qi(n,e,t)}function il(n){return typeof n=="number"?Pd:typeof n=="string"?el(n)?Ms:mt.test(n)?Xl:Id:Array.isArray(n)?tf:typeof n=="object"?mt.test(n)?Xl:Dd:Ms}function tf(n,e){const t=[...n],i=t.length,r=n.map((s,o)=>il(s)(s,e[o]));return s=>{for(let o=0;o<i;o++)t[o]=r[o](s);return t}}function Dd(n,e){const t={...n,...e},i={};for(const r in t)n[r]!==void 0&&e[r]!==void 0&&(i[r]=il(n[r])(n[r],e[r]));return r=>{for(const s in i)t[s]=i[s](r);return t}}function Ld(n,e){const t=[],i={color:0,var:0,number:0};for(let r=0;r<e.values.length;r++){const s=e.types[r],o=n.indexes[s][i[s]],a=n.values[o]??0;t[r]=a,i[s]++}return t}const Id=(n,e)=>{const t=qn.createTransformer(e),i=_r(n),r=_r(e);return i.indexes.var.length===r.indexes.var.length&&i.indexes.color.length===r.indexes.color.length&&i.indexes.number.length>=r.indexes.number.length?Lo.has(n)&&!r.values.length||Lo.has(e)&&!i.values.length?Rd(n,e):Za(tf(Ld(i,r),r.values),t):Ms(n,e)};function nf(n,e,t){return typeof n=="number"&&typeof e=="number"&&typeof t=="number"?qi(n,e,t):il(n)(n,e)}const Fd=n=>{const e=({timestamp:t})=>n(t);return{start:(t=!0)=>Rn.update(e,t),stop:()=>Po(e),now:()=>Ss.isProcessing?Ss.timestamp:Vt.now()}},rf=(n,e,t=10)=>{let i="";const r=Math.max(Math.round(e/t),2);for(let s=0;s<r;s++)i+=Math.round(n(s/(r-1))*1e4)/1e4+", ";return`linear(${i.substring(0,i.length-2)})`},ys=2e4;function rl(n){let e=0;const t=50;let i=n.next(e);for(;!i.done&&e<ys;)e+=t,i=n.next(e);return e>=ys?1/0:e}function sf(n,e=100,t){const i=t({...n,keyframes:[0,e]}),r=Math.min(rl(i),ys);return{type:"keyframes",ease:s=>i.next(r*s).value/e,duration:tn(r)}}const Nd=5;function of(n,e,t){const i=Math.max(e-Nd,0);return Nu(t-n(i),e-i)}const ht={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1},Hs=.001;function Ud({duration:n=ht.duration,bounce:e=ht.bounce,velocity:t=ht.velocity,mass:i=ht.mass}){let r,s,o=1-e;o=Xn(ht.minDamping,ht.maxDamping,o),n=Xn(ht.minDuration,ht.maxDuration,tn(n)),o<1?(r=c=>{const u=c*o,f=u*n,h=u-t,p=Io(c,o),g=Math.exp(-f);return Hs-h/p*g},s=c=>{const f=c*o*n,h=f*t+t,p=Math.pow(o,2)*Math.pow(c,2)*n,g=Math.exp(-f),_=Io(Math.pow(c,2),o);return(-r(c)+Hs>0?-1:1)*((h-p)*g)/_}):(r=c=>{const u=Math.exp(-c*n),f=(c-t)*n+1;return-Hs+u*f},s=c=>{const u=Math.exp(-c*n),f=(t-c)*(n*n);return u*f});const a=5/n,l=Bd(r,s,a);if(n=En(n),isNaN(l))return{stiffness:ht.stiffness,damping:ht.damping,duration:n};{const c=Math.pow(l,2)*i;return{stiffness:c,damping:o*2*Math.sqrt(i*c),duration:n}}}const Od=12;function Bd(n,e,t){let i=t;for(let r=1;r<Od;r++)i=i-n(i)/e(i);return i}function Io(n,e){return n*Math.sqrt(1-e*e)}const Vd=["duration","bounce"],zd=["stiffness","damping","mass"];function ql(n,e){return e.some(t=>n[t]!==void 0)}function kd(n){let e={velocity:ht.velocity,stiffness:ht.stiffness,damping:ht.damping,mass:ht.mass,isResolvedFromDuration:!1,...n};if(!ql(n,zd)&&ql(n,Vd))if(n.visualDuration){const t=n.visualDuration,i=2*Math.PI/(t*1.2),r=i*i,s=2*Xn(.05,1,1-(n.bounce||0))*Math.sqrt(r);e={...e,mass:ht.mass,stiffness:r,damping:s}}else{const t=Ud(n);e={...e,...t,mass:ht.mass},e.isResolvedFromDuration=!0}return e}function vr(n=ht.visualDuration,e=ht.bounce){const t=typeof n!="object"?{visualDuration:n,keyframes:[0,1],bounce:e}:n;let{restSpeed:i,restDelta:r}=t;const s=t.keyframes[0],o=t.keyframes[t.keyframes.length-1],a={done:!1,value:s},{stiffness:l,damping:c,mass:u,duration:f,velocity:h,isResolvedFromDuration:p}=kd({...t,velocity:-tn(t.velocity||0)}),g=h||0,_=c/(2*Math.sqrt(l*u)),m=o-s,d=tn(Math.sqrt(l/u)),y=Math.abs(m)<5;i||(i=y?ht.restSpeed.granular:ht.restSpeed.default),r||(r=y?ht.restDelta.granular:ht.restDelta.default);let S;if(_<1){const b=Io(d,_);S=A=>{const C=Math.exp(-_*d*A);return o-C*((g+_*d*m)/b*Math.sin(b*A)+m*Math.cos(b*A))}}else if(_===1)S=b=>o-Math.exp(-d*b)*(m+(g+d*m)*b);else{const b=d*Math.sqrt(_*_-1);S=A=>{const C=Math.exp(-_*d*A),P=Math.min(b*A,300);return o-C*((g+_*d*m)*Math.sinh(P)+b*m*Math.cosh(P))/b}}const T={calculatedDuration:p&&f||null,next:b=>{const A=S(b);if(p)a.done=b>=f;else{let C=b===0?g:0;_<1&&(C=b===0?En(g):of(S,b,A));const P=Math.abs(C)<=i,x=Math.abs(o-A)<=r;a.done=P&&x}return a.value=a.done?o:A,a},toString:()=>{const b=Math.min(rl(T),ys),A=rf(C=>T.next(b*C).value,b,30);return b+"ms "+A},toTransition:()=>{}};return T}vr.applyToOptions=n=>{const e=sf(n,100,vr);return n.ease=e.ease,n.duration=En(e.duration),n.type="keyframes",n};function Fo({keyframes:n,velocity:e=0,power:t=.8,timeConstant:i=325,bounceDamping:r=10,bounceStiffness:s=500,modifyTarget:o,min:a,max:l,restDelta:c=.5,restSpeed:u}){const f=n[0],h={done:!1,value:f},p=P=>a!==void 0&&P<a||l!==void 0&&P>l,g=P=>a===void 0?l:l===void 0||Math.abs(a-P)<Math.abs(l-P)?a:l;let _=t*e;const m=f+_,d=o===void 0?m:o(m);d!==m&&(_=d-f);const y=P=>-_*Math.exp(-P/i),S=P=>d+y(P),T=P=>{const x=y(P),M=S(P);h.done=Math.abs(x)<=c,h.value=h.done?d:M};let b,A;const C=P=>{p(h.value)&&(b=P,A=vr({keyframes:[h.value,g(h.value)],velocity:of(S,P,h.value),damping:r,stiffness:s,restDelta:c,restSpeed:u}))};return C(0),{calculatedDuration:null,next:P=>{let x=!1;return!A&&b===void 0&&(x=!0,T(P),C(P)),b!==void 0&&P>=b?A.next(P-b):(!x&&T(P),h)}}}function Gd(n,e,t){const i=[],r=t||Cn.mix||nf,s=n.length-1;for(let o=0;o<s;o++){let a=r(n[o],n[o+1]);if(e){const l=Array.isArray(e)?e[o]||Wi:e;a=Za(l,a)}i.push(a)}return i}function Hd(n,e,{clamp:t=!0,ease:i,mixer:r}={}){const s=n.length;if($a(s===e.length),s===1)return()=>e[0];if(s===2&&e[0]===e[1])return()=>e[1];const o=n[0]===n[1];n[0]>n[s-1]&&(n=[...n].reverse(),e=[...e].reverse());const a=Gd(e,i,r),l=a.length,c=u=>{if(o&&u<n[0])return e[0];let f=0;if(l>1)for(;f<n.length-2&&!(u<n[f+1]);f++);const h=ja(n[f],n[f+1],u);return a[f](h)};return t?u=>c(Xn(n[0],n[s-1],u)):c}function af(n,e){const t=n[n.length-1];for(let i=1;i<=e;i++){const r=ja(0,e,i);n.push(qi(t,1,r))}}function lf(n){const e=[0];return af(e,n.length-1),e}function Wd(n,e){return n.map(t=>t*e)}function Xd(n,e){return n.map(()=>e||Hu).splice(0,n.length-1)}function dr({duration:n=300,keyframes:e,times:t,ease:i="easeInOut"}){const r=Wu(i)?i.map(Ro):Ro(i),s={done:!1,value:e[0]},o=Wd(t&&t.length===e.length?t:lf(e),n),a=Hd(o,e,{ease:Array.isArray(r)?r:Xd(e,r)});return{calculatedDuration:n,next:l=>(s.value=a(l),s.done=l>=n,s)}}const qd=n=>n!==null;function sl(n,{repeat:e,repeatType:t="loop"},i,r=1){const s=n.filter(qd),a=r<0||e&&t!=="loop"&&e%2===1?0:s.length-1;return!a||i===void 0?s[a]:i}const Yd={decay:Fo,inertia:Fo,tween:dr,keyframes:dr,spring:vr};function cf(n){typeof n.type=="string"&&(n.type=Yd[n.type])}class ol{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(e=>{this.resolve=e})}notifyFinished(){this.resolve()}then(e,t){return this.finished.then(e,t)}}const $d=n=>n/100;class al extends ol{constructor(e){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.stop=()=>{const{motionValue:t}=this.options;t&&t.updatedAt!==Vt.now()&&this.tick(Vt.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),this.options.onStop?.())},this.options=e,this.initAnimation(),this.play(),e.autoplay===!1&&this.pause()}initAnimation(){const{options:e}=this;cf(e);const{type:t=dr,repeat:i=0,repeatDelay:r=0,repeatType:s,velocity:o=0}=e;let{keyframes:a}=e;const l=t||dr;l!==dr&&typeof a[0]!="number"&&(this.mixKeyframes=Za($d,nf(a[0],a[1])),a=[0,100]);const c=l({...e,keyframes:a});s==="mirror"&&(this.mirroredGenerator=l({...e,keyframes:[...a].reverse(),velocity:-o})),c.calculatedDuration===null&&(c.calculatedDuration=rl(c));const{calculatedDuration:u}=c;this.calculatedDuration=u,this.resolvedDuration=u+r,this.totalDuration=this.resolvedDuration*(i+1)-r,this.generator=c}updateTime(e){const t=Math.round(e-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=t}tick(e,t=!1){const{generator:i,totalDuration:r,mixKeyframes:s,mirroredGenerator:o,resolvedDuration:a,calculatedDuration:l}=this;if(this.startTime===null)return i.next(0);const{delay:c=0,keyframes:u,repeat:f,repeatType:h,repeatDelay:p,type:g,onUpdate:_,finalKeyframe:m}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,e):this.speed<0&&(this.startTime=Math.min(e-r/this.speed,this.startTime)),t?this.currentTime=e:this.updateTime(e);const d=this.currentTime-c*(this.playbackSpeed>=0?1:-1),y=this.playbackSpeed>=0?d<0:d>r;this.currentTime=Math.max(d,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=r);let S=this.currentTime,T=i;if(f){const P=Math.min(this.currentTime,r)/a;let x=Math.floor(P),M=P%1;!M&&P>=1&&(M=1),M===1&&x--,x=Math.min(x,f+1),x%2&&(h==="reverse"?(M=1-M,p&&(M-=p/a)):h==="mirror"&&(T=o)),S=Xn(0,1,M)*a}const b=y?{done:!1,value:u[0]}:T.next(S);s&&(b.value=s(b.value));let{done:A}=b;!y&&l!==null&&(A=this.playbackSpeed>=0?this.currentTime>=r:this.currentTime<=0);const C=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&A);return C&&g!==Fo&&(b.value=sl(u,this.options,m,this.speed)),_&&_(b.value),C&&this.finish(),b}then(e,t){return this.finished.then(e,t)}get duration(){return tn(this.calculatedDuration)}get iterationDuration(){const{delay:e=0}=this.options||{};return this.duration+tn(e)}get time(){return tn(this.currentTime)}set time(e){e=En(e),this.currentTime=e,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=e:this.driver&&(this.startTime=this.driver.now()-e/this.playbackSpeed),this.driver?.start(!1)}get speed(){return this.playbackSpeed}set speed(e){this.updateTime(Vt.now());const t=this.playbackSpeed!==e;this.playbackSpeed=e,t&&(this.time=tn(this.currentTime))}play(){if(this.isStopped)return;const{driver:e=Fd,startTime:t}=this.options;this.driver||(this.driver=e(r=>this.tick(r))),this.options.onPlay?.();const i=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=i):this.holdTime!==null?this.startTime=i-this.holdTime:this.startTime||(this.startTime=t??i),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(Vt.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){this.notifyFinished(),this.teardown(),this.state="finished",this.options.onComplete?.()}cancel(){this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),this.options.onCancel?.()}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(e){return this.startTime=0,this.tick(e,!0)}attachTimeline(e){return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),this.driver?.stop(),e.observe(this)}}function Kd(n){for(let e=1;e<n.length;e++)n[e]??(n[e]=n[e-1])}const li=n=>n*180/Math.PI,No=n=>{const e=li(Math.atan2(n[1],n[0]));return Uo(e)},Zd={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:n=>(Math.abs(n[0])+Math.abs(n[3]))/2,rotate:No,rotateZ:No,skewX:n=>li(Math.atan(n[1])),skewY:n=>li(Math.atan(n[2])),skew:n=>(Math.abs(n[1])+Math.abs(n[2]))/2},Uo=n=>(n=n%360,n<0&&(n+=360),n),Yl=No,$l=n=>Math.sqrt(n[0]*n[0]+n[1]*n[1]),Kl=n=>Math.sqrt(n[4]*n[4]+n[5]*n[5]),jd={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:$l,scaleY:Kl,scale:n=>($l(n)+Kl(n))/2,rotateX:n=>Uo(li(Math.atan2(n[6],n[5]))),rotateY:n=>Uo(li(Math.atan2(-n[2],n[0]))),rotateZ:Yl,rotate:Yl,skewX:n=>li(Math.atan(n[4])),skewY:n=>li(Math.atan(n[1])),skew:n=>(Math.abs(n[1])+Math.abs(n[4]))/2};function Oo(n){return n.includes("scale")?1:0}function Bo(n,e){if(!n||n==="none")return Oo(e);const t=n.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let i,r;if(t)i=jd,r=t;else{const a=n.match(/^matrix\(([-\d.e\s,]+)\)$/u);i=Zd,r=a}if(!r)return Oo(e);const s=i[e],o=r[1].split(",").map(Qd);return typeof s=="function"?s(o):o[s]}const Jd=(n,e)=>{const{transform:t="none"}=getComputedStyle(n);return Bo(t,e)};function Qd(n){return parseFloat(n.trim())}const Yi=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],$i=new Set(Yi),Zl=n=>n===Xi||n===Pe,ep=new Set(["x","y","z"]),tp=Yi.filter(n=>!ep.has(n));function np(n){const e=[];return tp.forEach(t=>{const i=n.getValue(t);i!==void 0&&(e.push([t,i.get()]),i.set(t.startsWith("scale")?1:0))}),e}const Hn={width:({x:n},{paddingLeft:e="0",paddingRight:t="0"})=>n.max-n.min-parseFloat(e)-parseFloat(t),height:({y:n},{paddingTop:e="0",paddingBottom:t="0"})=>n.max-n.min-parseFloat(e)-parseFloat(t),top:(n,{top:e})=>parseFloat(e),left:(n,{left:e})=>parseFloat(e),bottom:({y:n},{top:e})=>parseFloat(e)+(n.max-n.min),right:({x:n},{left:e})=>parseFloat(e)+(n.max-n.min),x:(n,{transform:e})=>Bo(e,"x"),y:(n,{transform:e})=>Bo(e,"y")};Hn.translateX=Hn.x;Hn.translateY=Hn.y;const hi=new Set;let Vo=!1,zo=!1,ko=!1;function uf(){if(zo){const n=Array.from(hi).filter(i=>i.needsMeasurement),e=new Set(n.map(i=>i.element)),t=new Map;e.forEach(i=>{const r=np(i);r.length&&(t.set(i,r),i.render())}),n.forEach(i=>i.measureInitialState()),e.forEach(i=>{i.render();const r=t.get(i);r&&r.forEach(([s,o])=>{i.getValue(s)?.set(o)})}),n.forEach(i=>i.measureEndState()),n.forEach(i=>{i.suspendedScrollY!==void 0&&window.scrollTo(0,i.suspendedScrollY)})}zo=!1,Vo=!1,hi.forEach(n=>n.complete(ko)),hi.clear()}function ff(){hi.forEach(n=>{n.readKeyframes(),n.needsMeasurement&&(zo=!0)})}function ip(){ko=!0,ff(),uf(),ko=!1}class ll{constructor(e,t,i,r,s,o=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...e],this.onComplete=t,this.name=i,this.motionValue=r,this.element=s,this.isAsync=o}scheduleResolve(){this.state="scheduled",this.isAsync?(hi.add(this),Vo||(Vo=!0,Rn.read(ff),Rn.resolveKeyframes(uf))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:e,name:t,element:i,motionValue:r}=this;if(e[0]===null){const s=r?.get(),o=e[e.length-1];if(s!==void 0)e[0]=s;else if(i&&t){const a=i.readValue(t,o);a!=null&&(e[0]=a)}e[0]===void 0&&(e[0]=o),r&&s===void 0&&r.set(e[0])}Kd(e)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(e=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,e),hi.delete(this)}cancel(){this.state==="scheduled"&&(hi.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const rp=n=>n.startsWith("--");function sp(n,e,t){rp(e)?n.style.setProperty(e,t):n.style[e]=t}const op=Ka(()=>window.ScrollTimeline!==void 0),ap={};function lp(n,e){const t=Ka(n);return()=>ap[e]??t()}const hf=lp(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),ar=([n,e,t,i])=>`cubic-bezier(${n}, ${e}, ${t}, ${i})`,jl={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:ar([0,.65,.55,1]),circOut:ar([.55,0,1,.45]),backIn:ar([.31,.01,.66,-.59]),backOut:ar([.33,1.53,.69,.99])};function df(n,e){if(n)return typeof n=="function"?hf()?rf(n,e):"ease-out":qu(n)?ar(n):Array.isArray(n)?n.map(t=>df(t,e)||jl.easeOut):jl[n]}function cp(n,e,t,{delay:i=0,duration:r=300,repeat:s=0,repeatType:o="loop",ease:a="easeOut",times:l}={},c=void 0){const u={[e]:t};l&&(u.offset=l);const f=df(a,r);Array.isArray(f)&&(u.easing=f);const h={delay:i,duration:r,easing:Array.isArray(f)?"linear":f,fill:"both",iterations:s+1,direction:o==="reverse"?"alternate":"normal"};return c&&(h.pseudoElement=c),n.animate(u,h)}function cl(n){return typeof n=="function"&&"applyToOptions"in n}function up({type:n,...e}){return cl(n)&&hf()?n.applyToOptions(e):(e.duration??(e.duration=300),e.ease??(e.ease="easeOut"),e)}class fp extends ol{constructor(e){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!e)return;const{element:t,name:i,keyframes:r,pseudoElement:s,allowFlatten:o=!1,finalKeyframe:a,onComplete:l}=e;this.isPseudoElement=!!s,this.allowFlatten=o,this.options=e,$a(typeof e.type!="string");const c=up(e);this.animation=cp(t,i,r,c,s),c.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!s){const u=sl(r,this.options,a,this.speed);this.updateMotionValue?this.updateMotionValue(u):sp(t,i,u),this.animation.cancel()}l?.(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){this.animation.finish?.()}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:e}=this;e==="idle"||e==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){const e=this.options?.element;!this.isPseudoElement&&e?.isConnected&&this.animation.commitStyles?.()}get duration(){const e=this.animation.effect?.getComputedTiming?.().duration||0;return tn(Number(e))}get iterationDuration(){const{delay:e=0}=this.options||{};return this.duration+tn(e)}get time(){return tn(Number(this.animation.currentTime)||0)}set time(e){this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=En(e)}get speed(){return this.animation.playbackRate}set speed(e){e<0&&(this.finishedTime=null),this.animation.playbackRate=e}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(e){this.manualStartTime=this.animation.startTime=e}attachTimeline({timeline:e,observe:t}){return this.allowFlatten&&this.animation.effect?.updateTiming({easing:"linear"}),this.animation.onfinish=null,e&&op()?(this.animation.timeline=e,Wi):t(this)}}const pf={anticipate:ku,backInOut:zu,circInOut:Gu};function hp(n){return n in pf}function dp(n){typeof n.ease=="string"&&hp(n.ease)&&(n.ease=pf[n.ease])}const Ws=10;class pp extends fp{constructor(e){dp(e),cf(e),super(e),e.startTime!==void 0&&(this.startTime=e.startTime),this.options=e}updateMotionValue(e){const{motionValue:t,onUpdate:i,onComplete:r,element:s,...o}=this.options;if(!t)return;if(e!==void 0){t.set(e);return}const a=new al({...o,autoplay:!1}),l=Math.max(Ws,Vt.now()-this.startTime),c=Xn(0,Ws,l-Ws);t.setWithVelocity(a.sample(Math.max(0,l-c)).value,a.sample(l).value,c),a.stop()}}const Jl=(n,e)=>e==="zIndex"?!1:!!(typeof n=="number"||Array.isArray(n)||typeof n=="string"&&(qn.test(n)||n==="0")&&!n.startsWith("url("));function mp(n){const e=n[0];if(n.length===1)return!0;for(let t=0;t<n.length;t++)if(n[t]!==e)return!0}function gp(n,e,t,i){const r=n[0];if(r===null)return!1;if(e==="display"||e==="visibility")return!0;const s=n[n.length-1],o=Jl(r,e),a=Jl(s,e);return!o||!a?!1:mp(n)||(t==="spring"||cl(t))&&i}function Go(n){n.duration=0,n.type="keyframes"}const _p=new Set(["opacity","clipPath","filter","transform"]),vp=Ka(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function xp(n){const{motionValue:e,name:t,repeatDelay:i,repeatType:r,damping:s,type:o}=n;if(!(e?.owner?.current instanceof HTMLElement))return!1;const{onUpdate:l,transformTemplate:c}=e.owner.getProps();return vp()&&t&&_p.has(t)&&(t!=="transform"||!c)&&!l&&!i&&r!=="mirror"&&s!==0&&o!=="inertia"}const Sp=40;class Mp extends ol{constructor({autoplay:e=!0,delay:t=0,type:i="keyframes",repeat:r=0,repeatDelay:s=0,repeatType:o="loop",keyframes:a,name:l,motionValue:c,element:u,...f}){super(),this.stop=()=>{this._animation&&(this._animation.stop(),this.stopTimeline?.()),this.keyframeResolver?.cancel()},this.createdAt=Vt.now();const h={autoplay:e,delay:t,type:i,repeat:r,repeatDelay:s,repeatType:o,name:l,motionValue:c,element:u,...f},p=u?.KeyframeResolver||ll;this.keyframeResolver=new p(a,(g,_,m)=>this.onKeyframesResolved(g,_,h,!m),l,c,u),this.keyframeResolver?.scheduleResolve()}onKeyframesResolved(e,t,i,r){this.keyframeResolver=void 0;const{name:s,type:o,velocity:a,delay:l,isHandoff:c,onUpdate:u}=i;this.resolvedAt=Vt.now(),gp(e,s,o,a)||((Cn.instantAnimations||!l)&&u?.(sl(e,i,t)),e[0]=e[e.length-1],Go(i),i.repeat=0);const h={startTime:r?this.resolvedAt?this.resolvedAt-this.createdAt>Sp?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:t,...i,keyframes:e},p=!c&&xp(h),g=h.motionValue?.owner?.current,_=p?new pp({...h,element:g}):new al(h);_.finished.then(()=>{this.notifyFinished()}).catch(Wi),this.pendingTimeline&&(this.stopTimeline=_.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=_}get finished(){return this._animation?this.animation.finished:this._finished}then(e,t){return this.finished.finally(e).then(()=>{})}get animation(){return this._animation||(this.keyframeResolver?.resume(),ip()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(e){this.animation.time=e}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(e){this.animation.speed=e}get startTime(){return this.animation.startTime}attachTimeline(e){return this._animation?this.stopTimeline=this.animation.attachTimeline(e):this.pendingTimeline=e,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){this._animation&&this.animation.cancel(),this.keyframeResolver?.cancel()}}class yp{constructor(e){this.stop=()=>this.runAll("stop"),this.animations=e.filter(Boolean)}get finished(){return Promise.all(this.animations.map(e=>e.finished))}getAll(e){return this.animations[0][e]}setAll(e,t){for(let i=0;i<this.animations.length;i++)this.animations[i][e]=t}attachTimeline(e){const t=this.animations.map(i=>i.attachTimeline(e));return()=>{t.forEach((i,r)=>{i&&i(),this.animations[r].stop()})}}get time(){return this.getAll("time")}set time(e){this.setAll("time",e)}get speed(){return this.getAll("speed")}set speed(e){this.setAll("speed",e)}get state(){return this.getAll("state")}get startTime(){return this.getAll("startTime")}get duration(){return Ql(this.animations,"duration")}get iterationDuration(){return Ql(this.animations,"iterationDuration")}runAll(e){this.animations.forEach(t=>t[e]())}play(){this.runAll("play")}pause(){this.runAll("pause")}cancel(){this.runAll("cancel")}complete(){this.runAll("complete")}}function Ql(n,e){let t=0;for(let i=0;i<n.length;i++){const r=n[i][e];r!==null&&r>t&&(t=r)}return t}class Ep extends yp{then(e,t){return this.finished.finally(e).then(()=>{})}}const Tp=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function bp(n){const e=Tp.exec(n);if(!e)return[,];const[,t,i,r]=e;return[`--${t??i}`,r]}function mf(n,e,t=1){const[i,r]=bp(n);if(!i)return;const s=window.getComputedStyle(e).getPropertyValue(i);if(s){const o=s.trim();return Lu(o)?parseFloat(o):o}return el(r)?mf(r,e,t+1):r}const Ap={type:"spring",stiffness:500,damping:25,restSpeed:10},wp=n=>({type:"spring",stiffness:550,damping:n===0?2*Math.sqrt(550):30,restSpeed:10}),Cp={type:"keyframes",duration:.8},Rp={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},Pp=(n,{keyframes:e})=>e.length>2?Cp:$i.has(n)?n.startsWith("scale")?wp(e[1]):Ap:Rp,Dp=n=>n!==null;function Lp(n,{repeat:e,repeatType:t="loop"},i){const r=n.filter(Dp),s=e&&t!=="loop"&&e%2===1?0:r.length-1;return r[s]}function gf(n,e){return n?.[e]??n?.default??n}function Ip({when:n,delay:e,delayChildren:t,staggerChildren:i,staggerDirection:r,repeat:s,repeatType:o,repeatDelay:a,from:l,elapsed:c,...u}){return!!Object.keys(u).length}const _f=(n,e,t,i={},r,s)=>o=>{const a=gf(i,n)||{},l=a.delay||i.delay||0;let{elapsed:c=0}=i;c=c-En(l);const u={keyframes:Array.isArray(t)?t:[null,t],ease:"easeOut",velocity:e.getVelocity(),...a,delay:-c,onUpdate:h=>{e.set(h),a.onUpdate&&a.onUpdate(h)},onComplete:()=>{o(),a.onComplete&&a.onComplete()},name:n,motionValue:e,element:s?void 0:r};Ip(a)||Object.assign(u,Pp(n,u)),u.duration&&(u.duration=En(u.duration)),u.repeatDelay&&(u.repeatDelay=En(u.repeatDelay)),u.from!==void 0&&(u.keyframes[0]=u.from);let f=!1;if((u.type===!1||u.duration===0&&!u.repeatDelay)&&(Go(u),u.delay===0&&(f=!0)),(Cn.instantAnimations||Cn.skipAnimations||r?.shouldSkipAnimations)&&(f=!0,Go(u),u.delay=0),u.allowFlatten=!a.type&&!a.ease,f&&!s&&e.get()!==void 0){const h=Lp(u.keyframes,a);if(h!==void 0){Rn.update(()=>{u.onUpdate(h),u.onComplete()});return}}return a.isSync?new al(u):new Mp(u)};function ec(n){const e=[{},{}];return n?.values.forEach((t,i)=>{e[0][i]=t.get(),e[1][i]=t.getVelocity()}),e}function vf(n,e,t,i){if(typeof e=="function"){const[r,s]=ec(i);e=e(t!==void 0?t:n.custom,r,s)}if(typeof e=="string"&&(e=n.variants&&n.variants[e]),typeof e=="function"){const[r,s]=ec(i);e=e(t!==void 0?t:n.custom,r,s)}return e}function Fp(n,e,t){const i=n.getProps();return vf(i,e,i.custom,n)}const xf=new Set(["width","height","top","left","right","bottom",...Yi]),tc=30,Np=n=>!isNaN(parseFloat(n));class Up{constructor(e,t={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=i=>{const r=Vt.now();if(this.updatedAt!==r&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(i),this.current!==this.prev&&(this.events.change?.notify(this.current),this.dependents))for(const s of this.dependents)s.dirty()},this.hasAnimated=!1,this.setCurrent(e),this.owner=t.owner}setCurrent(e){this.current=e,this.updatedAt=Vt.now(),this.canTrackVelocity===null&&e!==void 0&&(this.canTrackVelocity=Np(this.current))}setPrevFrameValue(e=this.current){this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt}onChange(e){return this.on("change",e)}on(e,t){this.events[e]||(this.events[e]=new Fu);const i=this.events[e].add(t);return e==="change"?()=>{i(),Rn.read(()=>{this.events.change.getSize()||this.stop()})}:i}clearListeners(){for(const e in this.events)this.events[e].clear()}attach(e,t){this.passiveEffect=e,this.stopPassiveEffect=t}set(e){this.passiveEffect?this.passiveEffect(e,this.updateAndNotify):this.updateAndNotify(e)}setWithVelocity(e,t,i){this.set(t),this.prev=void 0,this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt-i}jump(e,t=!0){this.updateAndNotify(e),this.prev=e,this.prevUpdatedAt=this.prevFrameValue=void 0,t&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){this.events.change?.notify(this.current)}addDependent(e){this.dependents||(this.dependents=new Set),this.dependents.add(e)}removeDependent(e){this.dependents&&this.dependents.delete(e)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const e=Vt.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||e-this.updatedAt>tc)return 0;const t=Math.min(this.updatedAt-this.prevUpdatedAt,tc);return Nu(parseFloat(this.current)-parseFloat(this.prevFrameValue),t)}start(e){return this.stop(),new Promise(t=>{this.hasAnimated=!0,this.animation=e(t),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.dependents?.clear(),this.events.destroy?.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function xr(n,e){return new Up(n,e)}const Op=n=>Array.isArray(n);function Bp(n,e,t){n.hasValue(e)?n.getValue(e).set(t):n.addValue(e,xr(t))}function Vp(n){return Op(n)?n[n.length-1]||0:n}function zp(n,e){const t=Fp(n,e);let{transitionEnd:i={},transition:r={},...s}=t||{};s={...s,...i};for(const o in s){const a=Vp(s[o]);Bp(n,o,a)}}const Ct=n=>!!(n&&n.getVelocity);function kp(n){return!!(Ct(n)&&n.add)}function Gp(n,e){const t=n.getValue("willChange");if(kp(t))return t.add(e);if(!t&&Cn.WillChange){const i=new Cn.WillChange("auto");n.addValue("willChange",i),i.add(e)}}function ul(n){return n.replace(/([A-Z])/g,e=>`-${e.toLowerCase()}`)}const Hp="framerAppearId",Wp="data-"+ul(Hp);function Xp(n){return n.props[Wp]}function qp({protectedKeys:n,needsAnimating:e},t){const i=n.hasOwnProperty(t)&&e[t]!==!0;return e[t]=!1,i}function Yp(n,e,{delay:t=0,transitionOverride:i,type:r}={}){let{transition:s=n.getDefaultTransition(),transitionEnd:o,...a}=e;const l=s?.reduceMotion;i&&(s=i);const c=[],u=r&&n.animationState&&n.animationState.getState()[r];for(const f in a){const h=n.getValue(f,n.latestValues[f]??null),p=a[f];if(p===void 0||u&&qp(u,f))continue;const g={delay:t,...gf(s||{},f)},_=h.get();if(_!==void 0&&!h.isAnimating&&!Array.isArray(p)&&p===_&&!g.velocity)continue;let m=!1;if(window.MotionHandoffAnimation){const S=Xp(n);if(S){const T=window.MotionHandoffAnimation(S,f,Rn);T!==null&&(g.startTime=T,m=!0)}}Gp(n,f);const d=l??n.shouldReduceMotion;h.start(_f(f,h,p,d&&xf.has(f)?{type:!1}:g,n,m));const y=h.animation;y&&c.push(y)}return o&&Promise.all(c).then(()=>{Rn.update(()=>{o&&zp(n,o)})}),c}const $p={test:n=>n==="auto",parse:n=>n},Sf=n=>e=>e.test(n),Mf=[Xi,Pe,Ii,zn,vd,_d,$p],nc=n=>Mf.find(Sf(n));function Kp(n){return typeof n=="number"?n===0:n!==null?n==="none"||n==="0"||Iu(n):!0}const Zp=new Set(["brightness","contrast","saturate","opacity"]);function jp(n){const[e,t]=n.slice(0,-1).split("(");if(e==="drop-shadow")return n;const[i]=t.match(tl)||[];if(!i)return n;const r=t.replace(i,"");let s=Zp.has(e)?1:0;return i!==t&&(s*=100),e+"("+s+r+")"}const Jp=/\b([a-z-]*)\(.*?\)/gu,Ho={...qn,getAnimatableNone:n=>{const e=n.match(Jp);return e?e.map(jp).join(" "):n}},ic={...Xi,transform:Math.round},Qp={rotate:zn,rotateX:zn,rotateY:zn,rotateZ:zn,scale:zr,scaleX:zr,scaleY:zr,scaleZ:zr,skew:zn,skewX:zn,skewY:zn,distance:Pe,translateX:Pe,translateY:Pe,translateZ:Pe,x:Pe,y:Pe,z:Pe,perspective:Pe,transformPerspective:Pe,opacity:gr,originX:Gl,originY:Gl,originZ:Pe},fl={borderWidth:Pe,borderTopWidth:Pe,borderRightWidth:Pe,borderBottomWidth:Pe,borderLeftWidth:Pe,borderRadius:Pe,borderTopLeftRadius:Pe,borderTopRightRadius:Pe,borderBottomRightRadius:Pe,borderBottomLeftRadius:Pe,width:Pe,maxWidth:Pe,height:Pe,maxHeight:Pe,top:Pe,right:Pe,bottom:Pe,left:Pe,inset:Pe,insetBlock:Pe,insetBlockStart:Pe,insetBlockEnd:Pe,insetInline:Pe,insetInlineStart:Pe,insetInlineEnd:Pe,padding:Pe,paddingTop:Pe,paddingRight:Pe,paddingBottom:Pe,paddingLeft:Pe,paddingBlock:Pe,paddingBlockStart:Pe,paddingBlockEnd:Pe,paddingInline:Pe,paddingInlineStart:Pe,paddingInlineEnd:Pe,margin:Pe,marginTop:Pe,marginRight:Pe,marginBottom:Pe,marginLeft:Pe,marginBlock:Pe,marginBlockStart:Pe,marginBlockEnd:Pe,marginInline:Pe,marginInlineStart:Pe,marginInlineEnd:Pe,fontSize:Pe,backgroundPositionX:Pe,backgroundPositionY:Pe,...Qp,zIndex:ic,fillOpacity:gr,strokeOpacity:gr,numOctaves:ic},em={...fl,color:mt,backgroundColor:mt,outlineColor:mt,fill:mt,stroke:mt,borderColor:mt,borderTopColor:mt,borderRightColor:mt,borderBottomColor:mt,borderLeftColor:mt,filter:Ho,WebkitFilter:Ho},yf=n=>em[n];function Ef(n,e){let t=yf(n);return t!==Ho&&(t=qn),t.getAnimatableNone?t.getAnimatableNone(e):void 0}const tm=new Set(["auto","none","0"]);function nm(n,e,t){let i=0,r;for(;i<n.length&&!r;){const s=n[i];typeof s=="string"&&!tm.has(s)&&_r(s).values.length&&(r=n[i]),i++}if(r&&t)for(const s of e)n[s]=Ef(t,r)}class im extends ll{constructor(e,t,i,r,s){super(e,t,i,r,s,!0)}readKeyframes(){const{unresolvedKeyframes:e,element:t,name:i}=this;if(!t||!t.current)return;super.readKeyframes();for(let u=0;u<e.length;u++){let f=e[u];if(typeof f=="string"&&(f=f.trim(),el(f))){const h=mf(f,t.current);h!==void 0&&(e[u]=h),u===e.length-1&&(this.finalKeyframe=f)}}if(this.resolveNoneKeyframes(),!xf.has(i)||e.length!==2)return;const[r,s]=e,o=nc(r),a=nc(s),l=kl(r),c=kl(s);if(l!==c&&Hn[i]){this.needsMeasurement=!0;return}if(o!==a)if(Zl(o)&&Zl(a))for(let u=0;u<e.length;u++){const f=e[u];typeof f=="string"&&(e[u]=parseFloat(f))}else Hn[i]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:e,name:t}=this,i=[];for(let r=0;r<e.length;r++)(e[r]===null||Kp(e[r]))&&i.push(r);i.length&&nm(e,i,t)}measureInitialState(){const{element:e,unresolvedKeyframes:t,name:i}=this;if(!e||!e.current)return;i==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=Hn[i](e.measureViewportBox(),window.getComputedStyle(e.current)),t[0]=this.measuredOrigin;const r=t[t.length-1];r!==void 0&&e.getValue(i,r).jump(r,!1)}measureEndState(){const{element:e,name:t,unresolvedKeyframes:i}=this;if(!e||!e.current)return;const r=e.getValue(t);r&&r.jump(this.measuredOrigin,!1);const s=i.length-1,o=i[s];i[s]=Hn[t](e.measureViewportBox(),window.getComputedStyle(e.current)),o!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=o),this.removedTransforms?.length&&this.removedTransforms.forEach(([a,l])=>{e.getValue(a).set(l)}),this.resolveNoneKeyframes()}}function Tf(n,e,t){if(n==null)return[];if(n instanceof EventTarget)return[n];if(typeof n=="string"){let i=document;e&&(i=e.current);const r=t?.[n]??i.querySelectorAll(n);return r?Array.from(r):[]}return Array.from(n).filter(i=>i!=null)}const bf=(n,e)=>e&&typeof n=="number"?e.transform(n):n,{schedule:rm}=Yu(queueMicrotask,!1);function Af(n){return jh(n)&&"ownerSVGElement"in n}function sm(n){return Af(n)&&n.tagName==="svg"}function om(n,e){if(n==="first")return 0;{const t=e-1;return n==="last"?t:t/2}}function rc(n=.1,{startDelay:e=0,from:t=0,ease:i}={}){return(r,s)=>{const o=typeof t=="number"?t:om(t,s),a=Math.abs(o-r);let l=n*a;if(i){const c=s*n;l=Ro(i)(l/c)*c}return e+l}}const am=[...Mf,mt,qn],lm=n=>am.find(Sf(n)),sc=()=>({min:0,max:0}),hl=()=>({x:sc(),y:sc()}),Wo={current:null},wf={current:!1},cm=typeof window<"u";function um(){if(wf.current=!0,!!cm)if(window.matchMedia){const n=window.matchMedia("(prefers-reduced-motion)"),e=()=>Wo.current=n.matches;n.addEventListener("change",e),e()}else Wo.current=!1}const Sr=new WeakMap;function fm(n){return n!==null&&typeof n=="object"&&typeof n.start=="function"}function hm(n){return typeof n=="string"||Array.isArray(n)}const dm=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],pm=["initial",...dm];function Cf(n){return fm(n.animate)||pm.some(e=>hm(n[e]))}function mm(n){return!!(Cf(n)||n.variants)}function gm(n,e,t){for(const i in e){const r=e[i],s=t[i];if(Ct(r))n.addValue(i,r);else if(Ct(s))n.addValue(i,xr(r,{owner:n}));else if(s!==r)if(n.hasValue(i)){const o=n.getValue(i);o.liveStyle===!0?o.jump(r):o.hasAnimated||o.set(r)}else{const o=n.getStaticValue(i);n.addValue(i,xr(o!==void 0?o:r,{owner:n}))}}for(const i in t)e[i]===void 0&&n.removeValue(i);return e}const oc=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let ac={};class Rf{scrapeMotionValuesFromProps(e,t,i){return{}}constructor({parent:e,props:t,presenceContext:i,reducedMotionConfig:r,skipAnimations:s,blockInitialAnimation:o,visualState:a},l={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=ll,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const p=Vt.now();this.renderScheduledAt<p&&(this.renderScheduledAt=p,Rn.render(this.render,!1,!0))};const{latestValues:c,renderState:u}=a;this.latestValues=c,this.baseTarget={...c},this.initialValues=t.initial?{...c}:{},this.renderState=u,this.parent=e,this.props=t,this.presenceContext=i,this.depth=e?e.depth+1:0,this.reducedMotionConfig=r,this.skipAnimationsConfig=s,this.options=l,this.blockInitialAnimation=!!o,this.isControllingVariants=Cf(t),this.isVariantNode=mm(t),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(e&&e.current);const{willChange:f,...h}=this.scrapeMotionValuesFromProps(t,{},this);for(const p in h){const g=h[p];c[p]!==void 0&&Ct(g)&&g.set(c[p])}}mount(e){this.current=e,Sr.set(e,this),this.projection&&!this.projection.instance&&this.projection.mount(e),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((t,i)=>this.bindToMotionValue(i,t)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(wf.current||um(),this.shouldReduceMotion=Wo.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,this.parent?.addChild(this),this.update(this.props,this.presenceContext)}unmount(){this.projection&&this.projection.unmount(),Po(this.notifyUpdate),Po(this.render),this.valueSubscriptions.forEach(e=>e()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent?.removeChild(this);for(const e in this.events)this.events[e].clear();for(const e in this.features){const t=this.features[e];t&&(t.unmount(),t.isMounted=!1)}this.current=null}addChild(e){this.children.add(e),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(e)}removeChild(e){this.children.delete(e),this.enteringChildren&&this.enteringChildren.delete(e)}bindToMotionValue(e,t){this.valueSubscriptions.has(e)&&this.valueSubscriptions.get(e)();const i=$i.has(e);i&&this.onBindTransform&&this.onBindTransform();const r=t.on("change",o=>{this.latestValues[e]=o,this.props.onUpdate&&Rn.preRender(this.notifyUpdate),i&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let s;typeof window<"u"&&window.MotionCheckAppearSync&&(s=window.MotionCheckAppearSync(this,e,t)),this.valueSubscriptions.set(e,()=>{r(),s&&s(),t.owner&&t.stop()})}sortNodePosition(e){return!this.current||!this.sortInstanceNodePosition||this.type!==e.type?0:this.sortInstanceNodePosition(this.current,e.current)}updateFeatures(){let e="animation";for(e in ac){const t=ac[e];if(!t)continue;const{isEnabled:i,Feature:r}=t;if(!this.features[e]&&r&&i(this.props)&&(this.features[e]=new r(this)),this.features[e]){const s=this.features[e];s.isMounted?s.update():(s.mount(),s.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):hl()}getStaticValue(e){return this.latestValues[e]}setStaticValue(e,t){this.latestValues[e]=t}update(e,t){(e.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=e,this.prevPresenceContext=this.presenceContext,this.presenceContext=t;for(let i=0;i<oc.length;i++){const r=oc[i];this.propEventSubscriptions[r]&&(this.propEventSubscriptions[r](),delete this.propEventSubscriptions[r]);const s="on"+r,o=e[s];o&&(this.propEventSubscriptions[r]=this.on(r,o))}this.prevMotionValues=gm(this,this.scrapeMotionValuesFromProps(e,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(e){return this.props.variants?this.props.variants[e]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(e){const t=this.getClosestVariantNode();if(t)return t.variantChildren&&t.variantChildren.add(e),()=>t.variantChildren.delete(e)}addValue(e,t){const i=this.values.get(e);t!==i&&(i&&this.removeValue(e),this.bindToMotionValue(e,t),this.values.set(e,t),this.latestValues[e]=t.get())}removeValue(e){this.values.delete(e);const t=this.valueSubscriptions.get(e);t&&(t(),this.valueSubscriptions.delete(e)),delete this.latestValues[e],this.removeValueFromRenderState(e,this.renderState)}hasValue(e){return this.values.has(e)}getValue(e,t){if(this.props.values&&this.props.values[e])return this.props.values[e];let i=this.values.get(e);return i===void 0&&t!==void 0&&(i=xr(t===null?void 0:t,{owner:this}),this.addValue(e,i)),i}readValue(e,t){let i=this.latestValues[e]!==void 0||!this.current?this.latestValues[e]:this.getBaseTargetFromProps(this.props,e)??this.readValueFromInstance(this.current,e,this.options);return i!=null&&(typeof i=="string"&&(Lu(i)||Iu(i))?i=parseFloat(i):!lm(i)&&qn.test(t)&&(i=Ef(e,t)),this.setBaseTarget(e,Ct(i)?i.get():i)),Ct(i)?i.get():i}setBaseTarget(e,t){this.baseTarget[e]=t}getBaseTarget(e){const{initial:t}=this.props;let i;if(typeof t=="string"||typeof t=="object"){const s=vf(this.props,t,this.presenceContext?.custom);s&&(i=s[e])}if(t&&i!==void 0)return i;const r=this.getBaseTargetFromProps(this.props,e);return r!==void 0&&!Ct(r)?r:this.initialValues[e]!==void 0&&i===void 0?void 0:this.baseTarget[e]}on(e,t){return this.events[e]||(this.events[e]=new Fu),this.events[e].add(t)}notify(e,...t){this.events[e]&&this.events[e].notify(...t)}scheduleRenderMicrotask(){rm.render(this.render)}}class Pf extends Rf{constructor(){super(...arguments),this.KeyframeResolver=im}sortInstanceNodePosition(e,t){return e.compareDocumentPosition(t)&2?1:-1}getBaseTargetFromProps(e,t){const i=e.style;return i?i[t]:void 0}removeValueFromRenderState(e,{vars:t,style:i}){delete t[e],delete i[e]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:e}=this.props;Ct(e)&&(this.childSubscription=e.on("change",t=>{this.current&&(this.current.textContent=`${t}`)}))}}function _m({top:n,left:e,right:t,bottom:i}){return{x:{min:e,max:t},y:{min:n,max:i}}}function vm(n,e){if(!e)return n;const t=e({x:n.left,y:n.top}),i=e({x:n.right,y:n.bottom});return{top:t.y,left:t.x,bottom:i.y,right:i.x}}function xm(n,e){return _m(vm(n.getBoundingClientRect(),e))}const Sm={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},Mm=Yi.length;function ym(n,e,t){let i="",r=!0;for(let s=0;s<Mm;s++){const o=Yi[s],a=n[o];if(a===void 0)continue;let l=!0;if(typeof a=="number")l=a===(o.startsWith("scale")?1:0);else{const c=parseFloat(a);l=o.startsWith("scale")?c===1:c===0}if(!l||t){const c=bf(a,fl[o]);if(!l){r=!1;const u=Sm[o]||o;i+=`${u}(${c}) `}t&&(e[o]=c)}}return i=i.trim(),t?i=t(e,r?"":i):r&&(i="none"),i}function Df(n,e,t){const{style:i,vars:r,transformOrigin:s}=n;let o=!1,a=!1;for(const l in e){const c=e[l];if($i.has(l)){o=!0;continue}else if(Ku(l)){r[l]=c;continue}else{const u=bf(c,fl[l]);l.startsWith("origin")?(a=!0,s[l]=u):i[l]=u}}if(e.transform||(o||t?i.transform=ym(e,n.transform,t):i.transform&&(i.transform="none")),a){const{originX:l="50%",originY:c="50%",originZ:u=0}=s;i.transformOrigin=`${l} ${c} ${u}`}}function Lf(n,{style:e,vars:t},i,r){const s=n.style;let o;for(o in e)s[o]=e[o];r?.applyProjectionStyles(s,i);for(o in t)s.setProperty(o,t[o])}function lc(n,e){return e.max===e.min?0:n/(e.max-e.min)*100}const Ji={correct:(n,e)=>{if(!e.target)return n;if(typeof n=="string")if(Pe.test(n))n=parseFloat(n);else return n;const t=lc(n,e.target.x),i=lc(n,e.target.y);return`${t}% ${i}%`}},Em={correct:(n,{treeScale:e,projectionDelta:t})=>{const i=n,r=qn.parse(n);if(r.length>5)return i;const s=qn.createTransformer(n),o=typeof r[0]!="number"?1:0,a=t.x.scale*e.x,l=t.y.scale*e.y;r[0+o]/=a,r[1+o]/=l;const c=qi(a,l,.5);return typeof r[2+o]=="number"&&(r[2+o]/=c),typeof r[3+o]=="number"&&(r[3+o]/=c),s(r)}},Tm={borderRadius:{...Ji,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:Ji,borderTopRightRadius:Ji,borderBottomLeftRadius:Ji,borderBottomRightRadius:Ji,boxShadow:Em};function bm(n,{layout:e,layoutId:t}){return $i.has(n)||n.startsWith("origin")||(e||t!==void 0)&&(!!Tm[n]||n==="opacity")}function If(n,e,t){const i=n.style,r=e?.style,s={};if(!i)return s;for(const o in i)(Ct(i[o])||r&&Ct(r[o])||bm(o,n)||t?.getValue(o)?.liveStyle!==void 0)&&(s[o]=i[o]);return s}function Am(n){return window.getComputedStyle(n)}class wm extends Pf{constructor(){super(...arguments),this.type="html",this.renderInstance=Lf}readValueFromInstance(e,t){if($i.has(t))return this.projection?.isProjecting?Oo(t):Jd(e,t);{const i=Am(e),r=(Ku(t)?i.getPropertyValue(t):i[t])||0;return typeof r=="string"?r.trim():r}}measureInstanceViewportBox(e,{transformPagePoint:t}){return xm(e,t)}build(e,t,i){Df(e,t,i.transformTemplate)}scrapeMotionValuesFromProps(e,t,i){return If(e,t,i)}}function Cm(n,e){return n in e}class Rm extends Rf{constructor(){super(...arguments),this.type="object"}readValueFromInstance(e,t){if(Cm(t,e)){const i=e[t];if(typeof i=="string"||typeof i=="number")return i}}getBaseTargetFromProps(){}removeValueFromRenderState(e,t){delete t.output[e]}measureInstanceViewportBox(){return hl()}build(e,t){Object.assign(e.output,t)}renderInstance(e,{output:t}){Object.assign(e,t)}sortInstanceNodePosition(){return 0}}const Pm={offset:"stroke-dashoffset",array:"stroke-dasharray"},Dm={offset:"strokeDashoffset",array:"strokeDasharray"};function Lm(n,e,t=1,i=0,r=!0){n.pathLength=1;const s=r?Pm:Dm;n[s.offset]=`${-i}`,n[s.array]=`${e} ${t}`}const Im=["offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function Fm(n,{attrX:e,attrY:t,attrScale:i,pathLength:r,pathSpacing:s=1,pathOffset:o=0,...a},l,c,u){if(Df(n,a,c),l){n.style.viewBox&&(n.attrs.viewBox=n.style.viewBox);return}n.attrs=n.style,n.style={};const{attrs:f,style:h}=n;f.transform&&(h.transform=f.transform,delete f.transform),(h.transform||f.transformOrigin)&&(h.transformOrigin=f.transformOrigin??"50% 50%",delete f.transformOrigin),h.transform&&(h.transformBox=u?.transformBox??"fill-box",delete f.transformBox);for(const p of Im)f[p]!==void 0&&(h[p]=f[p],delete f[p]);e!==void 0&&(f.x=e),t!==void 0&&(f.y=t),i!==void 0&&(f.scale=i),r!==void 0&&Lm(f,r,s,o,!1)}const Ff=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),Nm=n=>typeof n=="string"&&n.toLowerCase()==="svg";function Um(n,e,t,i){Lf(n,e,void 0,i);for(const r in e.attrs)n.setAttribute(Ff.has(r)?r:ul(r),e.attrs[r])}function Om(n,e,t){const i=If(n,e,t);for(const r in n)if(Ct(n[r])||Ct(e[r])){const s=Yi.indexOf(r)!==-1?"attr"+r.charAt(0).toUpperCase()+r.substring(1):r;i[s]=n[r]}return i}class Bm extends Pf{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=hl}getBaseTargetFromProps(e,t){return e[t]}readValueFromInstance(e,t){if($i.has(t)){const i=yf(t);return i&&i.default||0}return t=Ff.has(t)?t:ul(t),e.getAttribute(t)}scrapeMotionValuesFromProps(e,t,i){return Om(e,t,i)}build(e,t,i){Fm(e,t,this.isSVGTag,i.transformTemplate,i.style)}renderInstance(e,t,i,r){Um(e,t,i,r)}mount(e){this.isSVGTag=Nm(e.tagName),super.mount(e)}}function Vm(n,e,t){const i=Ct(n)?n:xr(n);return i.start(_f("",i,e,t)),i.animation}function dl(n){return typeof n=="object"&&!Array.isArray(n)}function Nf(n,e,t,i){return n==null?[]:typeof n=="string"&&dl(e)?Tf(n,t,i):n instanceof NodeList?Array.from(n):Array.isArray(n)?n.filter(r=>r!=null):[n]}function zm(n,e,t){return n*(e+1)}function cc(n,e,t,i){return typeof e=="number"?e:e.startsWith("-")||e.startsWith("+")?Math.max(0,n+parseFloat(e)):e==="<"?t:e.startsWith("<")?Math.max(0,t+parseFloat(e.slice(1))):i.get(e)??n}function km(n,e,t){for(let i=0;i<n.length;i++){const r=n[i];r.at>e&&r.at<t&&(Ya(n,r),i--)}}function Gm(n,e,t,i,r,s){km(n,r,s);for(let o=0;o<e.length;o++)n.push({value:e[o],at:qi(r,s,i[o]),easing:Xu(t,o)})}function Hm(n,e){for(let t=0;t<n.length;t++)n[t]=n[t]/(e+1)}function Wm(n,e){return n.at===e.at?n.value===null?1:e.value===null?-1:0:n.at-e.at}const Xm="easeInOut";function qm(n,{defaultTransition:e={},...t}={},i,r){const s=e.duration||.3,o=new Map,a=new Map,l={},c=new Map;let u=0,f=0,h=0;for(let p=0;p<n.length;p++){const g=n[p];if(typeof g=="string"){c.set(g,f);continue}else if(!Array.isArray(g)){c.set(g.name,cc(f,g.at,u,c));continue}let[_,m,d={}]=g;d.at!==void 0&&(f=cc(f,d.at,u,c));let y=0;const S=(T,b,A,C=0,P=0)=>{const x=Ym(T),{delay:M=0,times:R=lf(x),type:O=e.type||"keyframes",repeat:I,repeatType:F,repeatDelay:V=0,...z}=b;let{ease:B=e.ease||"easeOut",duration:W}=b;const K=typeof M=="function"?M(C,P):M,Q=x.length,ee=cl(O)?O:r?.[O||"keyframes"];if(Q<=2&&ee){let Ne=100;if(Q===2&&Zm(x)){const re=x[1]-x[0];Ne=Math.abs(re)}const q={...e,...z};W!==void 0&&(q.duration=En(W));const Y=sf(q,Ne,ee);B=Y.ease,W=Y.duration}W??(W=s);const $=f+K;R.length===1&&R[0]===0&&(R[1]=1);const ie=R.length-x.length;if(ie>0&&af(R,ie),x.length===1&&x.unshift(null),I){W=zm(W,I);const Ne=[...x],q=[...R];B=Array.isArray(B)?[...B]:[B];const Y=[...B];for(let re=0;re<I;re++){x.push(...Ne);for(let ye=0;ye<Ne.length;ye++)R.push(q[ye]+(re+1)),B.push(ye===0?"linear":Xu(Y,ye-1))}Hm(R,I)}const de=$+W;Gm(A,x,B,R,$,de),y=Math.max(K+W,y),h=Math.max(de,h)};if(Ct(_)){const T=uc(_,a);S(m,d,fc("default",T))}else{const T=Nf(_,m,i,l),b=T.length;for(let A=0;A<b;A++){m=m,d=d;const C=T[A],P=uc(C,a);for(const x in m)S(m[x],$m(d,x),fc(x,P),A,b)}}u=f,f+=y}return a.forEach((p,g)=>{for(const _ in p){const m=p[_];m.sort(Wm);const d=[],y=[],S=[];for(let C=0;C<m.length;C++){const{at:P,value:x,easing:M}=m[C];d.push(x),y.push(ja(0,h,P)),S.push(M||"easeOut")}y[0]!==0&&(y.unshift(0),d.unshift(d[0]),S.unshift(Xm)),y[y.length-1]!==1&&(y.push(1),d.push(null)),o.has(g)||o.set(g,{keyframes:{},transition:{}});const T=o.get(g);T.keyframes[_]=d;const{type:b,...A}=e;T.transition[_]={...A,duration:h,ease:S,times:y,...t}}}),o}function uc(n,e){return!e.has(n)&&e.set(n,{}),e.get(n)}function fc(n,e){return e[n]||(e[n]=[]),e[n]}function Ym(n){return Array.isArray(n)?n:[n]}function $m(n,e){return n&&n[e]?{...n,...n[e]}:{...n}}const Km=n=>typeof n=="number",Zm=n=>n.every(Km);function jm(n){const e={presenceContext:null,props:{},visualState:{renderState:{transform:{},transformOrigin:{},style:{},vars:{},attrs:{}},latestValues:{}}},t=Af(n)&&!sm(n)?new Bm(e):new wm(e);t.mount(n),Sr.set(n,t)}function Jm(n){const e={presenceContext:null,props:{},visualState:{renderState:{output:{}},latestValues:{}}},t=new Rm(e);t.mount(n),Sr.set(n,t)}function Qm(n,e){return Ct(n)||typeof n=="number"||typeof n=="string"&&!dl(e)}function Uf(n,e,t,i){const r=[];if(Qm(n,e))r.push(Vm(n,dl(e)&&e.default||e,t&&(t.default||t)));else{if(n==null)return r;const s=Nf(n,e,i),o=s.length;for(let a=0;a<o;a++){const l=s[a],c=l instanceof Element?jm:Jm;Sr.has(l)||c(l);const u=Sr.get(l),f={...t};"delay"in f&&typeof f.delay=="function"&&(f.delay=f.delay(a,o)),r.push(...Yp(u,{...e,transition:f},{}))}}return r}function eg(n,e,t){const i=[];return qm(n,e,t,{spring:vr}).forEach(({keyframes:s,transition:o},a)=>{i.push(...Uf(a,s,o))}),i}function tg(n){return Array.isArray(n)&&n.some(Array.isArray)}function ng(n={}){const{scope:e,reduceMotion:t}=n;function i(r,s,o){let a=[],l;if(tg(r))a=eg(r,t!==void 0?{reduceMotion:t,...s}:s,e);else{const{onComplete:u,...f}=o||{};typeof u=="function"&&(l=u),a=Uf(r,s,t!==void 0?{reduceMotion:t,...f}:f,e)}const c=new Ep(a);return l&&c.finished.then(l),e&&(e.animations.push(c),c.finished.then(()=>{Ya(e.animations,c)})),c}return i}const Yt=ng(),ig={some:0,all:1};function rg(n,e,{root:t,margin:i,amount:r="some"}={}){const s=Tf(n),o=new WeakMap,a=c=>{c.forEach(u=>{const f=o.get(u.target);if(u.isIntersecting!==!!f)if(u.isIntersecting){const h=e(u.target,u);typeof h=="function"?o.set(u.target,h):l.unobserve(u.target)}else typeof f=="function"&&(f(u),o.delete(u.target))})},l=new IntersectionObserver(a,{root:t,rootMargin:i,threshold:typeof r=="number"?r:ig[r]});return s.forEach(c=>l.observe(c)),()=>l.disconnect()}const $t={outQuart:[.165,.84,.44,1],inOutQuart:[.77,0,.175,1],inOutQuint:[.87,0,.13,1]};function sg(){const n=navigator.userAgent;return!!(/iPhone|iPod|Android/i.test(n)||/Macintosh/i.test(n)&&navigator.maxTouchPoints>1)}let jn=null;function og(){return document.querySelectorAll("model-viewer").length>0}function ag(n,e){const t=document.querySelectorAll("[data-variant-ids]");for(const i of t){const r=(i.dataset.variantIds??"").split(",").map(Number);if(r.includes(n)&&r.includes(e))return!0}return!1}const lg={product:null,variants:[],options:[],selectedOptions:{},currentVariant:null,pendingVariant:null,quantity:1,imageEl:null,swatchOptionName:null,swatchMap:{},shippingNote:"",variantShippingNotes:{},notifyModalOpen:!1,notifyEmail:"",notifySuccess:!1,notifySubmitting:!1,sizeGuideOpen:!1,get currentVariantId(){return this.currentVariant?.id??null},get isAvailable(){return this.currentVariant?.available??!1},get price(){const n=window.SKYLRK?.currency||"USD";return this.currentVariant?fr(this.currentVariant.price,n):fr(0,n)},get compareAtPrice(){const n=window.SKYLRK?.currency||"USD";return!this.currentVariant?.compare_at_price||this.currentVariant.compare_at_price<=this.currentVariant.price?null:fr(this.currentVariant.compare_at_price,n)},get hasOnSale(){return this.compareAtPrice!==null},get currentShippingNote(){if(this.currentVariant){const n=this.variantShippingNotes[String(this.currentVariant.id)];if(n)return n}return this.shippingNote},get currentImage(){return this.currentVariant?.featured_image?.src?this.currentVariant.featured_image.src:this.product?.featured_image??null},setProduct(n,e,t){Mt("[product store] setProduct called with:",n.title),this.product=n,this.variants=e?.length?n.variants.filter(r=>!e.includes(r.id)):n.variants;const i=n.options;if(this.options=i.map((r,s)=>{const o=`option${s+1}`,a=[...new Set(this.variants.map(l=>l[o]).filter(l=>l!==null))];return{name:r,position:s+1,values:a}}),Mt("[product store] built options:",JSON.stringify(this.options)),this.variants.length>0){let r=t?this.variants.find(o=>o.id===t):void 0,s;r?.available?s=r:r?s=this.variants.find(o=>o.available&&o.option1===r.option1)||r:s=this.variants.find(o=>o.available)||this.variants[0],Mt("[product store] initial variant:",s.title),this.options.forEach((o,a)=>{const l=`option${a+1}`,c=s[l];c&&(this.selectedOptions[o.name]=c,Mt("[product store] set option",o.name,"=",c))}),this.currentVariant=s,Mt("[product store] currentVariant set:",this.currentVariant.id)}this.quantity=1},setSwatchData(n){this.swatchOptionName=n.optionName||null,this.swatchMap=n.swatches||{},this.shippingNote=n.shippingNote||"",this.variantShippingNotes=n.variantShippingNotes||{}},setImageEl(n){this.imageEl=n},selectOption(n,e){Mt("[product store] selectedOptions BEFORE:",JSON.stringify(this.selectedOptions)),this.selectedOptions[n]=e,Mt("[product store] selectedOptions AFTER:",JSON.stringify(this.selectedOptions)),this.updateVariant()},async updateVariant(){Mt("[product store] updateVariant called with selectedOptions:",JSON.stringify(this.selectedOptions));const e=this.variants.find(s=>{const o=this.options.every((a,l)=>{const c=`option${l+1}`,u=this.selectedOptions[a.name];return s[c]===u});return o&&Mt("[product store] found matching variant:",s.title),o})??null;if(e&&this.currentVariant&&e.id!==this.currentVariant.id&&sg()&&og()&&!ag(this.currentVariant.id,e.id)){const s=new URL(window.location.href);s.searchParams.set("variant",String(e.id)),window.location.replace(s.toString());return}const t=this.currentImage,i=e?.featured_image?.src??this.product?.featured_image??null;if(t!==i&&this.imageEl?(this.pendingVariant=e,await Yt(this.imageEl,{opacity:0},{duration:.2,ease:$t.inOutQuart}).finished,this.currentVariant=this.pendingVariant,this.pendingVariant=null):this.currentVariant=e,Mt("[product store] variant updated:",this.currentVariant?.title,"image:",this.currentVariant?.featured_image?.src??"none (using product image)"),this.currentVariant){const s=new URL(window.location.href);s.searchParams.set("variant",String(this.currentVariant.id)),window.history.replaceState({},"",s.toString())}},isOptionAvailable(n,e){const t={...this.selectedOptions,[n]:e};return this.variants.some(i=>i.available?this.options.every((r,s)=>{const o=`option${s+1}`,a=t[r.name];return i[o]===a}):!1)},addToCart(){if(!this.currentVariant||!this.isAvailable)return;const n={};if(this.swatchOptionName){const t=this.selectedOptions[this.swatchOptionName],i=this.swatchMap[t];i?.hex&&(n._swatch_color=i.hex),i?.image&&(n._swatch_image=i.image)}this.currentShippingNote&&(n._shipping_notes=this.currentShippingNote);const e=window.Alpine?.store("cart");if(e){const t=Object.keys(n).length>0?n:void 0;e.addItem(this.currentVariant.id,this.quantity,t)}},increment(){this.quantity++},decrement(){this.quantity>1&&this.quantity--},onImageLoad(){this.imageEl&&Yt(this.imageEl,{opacity:1},{duration:.3,ease:$t.inOutQuart})},openNotifyModal(){this.notifyModalOpen=!0,window.Alpine?.store("modal")?.open("notify")},closeNotifyModal(){this.notifyModalOpen=!1,this.notifyEmail="",this.notifySuccess=!1,this.notifySubmitting=!1,window.Alpine?.store("modal")?.close("notify")},async submitNotifyForm(){if(!(!this.notifyEmail||this.notifySubmitting)){this.notifySubmitting=!0;try{if(!(await fetch("https://skylrk-api.vercel.app/api/klaviyo/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:this.notifyEmail,variantId:this.currentVariantId,listId:"UrBE5D"})})).ok)throw new Error("Request failed");this.notifySuccess=!0}catch(n){console.error("[product store] notify form error:",n)}finally{this.notifySubmitting=!1}}},openSizeGuide(){this.sizeGuideOpen=!0,window.Alpine?.store("modal")?.open("size-guide"),requestAnimationFrame(()=>{const e=document.querySelector(".size-guide__table-wrap");if(e&&!jn){jn=new Ui({wrapper:e,content:e,orientation:"horizontal",smoothWheel:!1,lerp:.1});const t=i=>{jn&&(jn.raf(i),requestAnimationFrame(t))};requestAnimationFrame(t)}})},closeSizeGuide(){this.sizeGuideOpen=!1,window.Alpine?.store("modal")?.close("size-guide"),jn&&(jn.destroy(),jn=null)}},cg={stack:[],get isOpen(){return this.stack.length>0},open(n){this.stack.includes(n)||(this.stack=[...this.stack,n])},close(n){this.stack=this.stack.filter(e=>e!==n)}},ug=()=>({init(){Mt("Component initialized",this.$el),this.animateFadeIn()},animateFadeIn(){const n=this.$el,e=n.querySelectorAll("[data-animate-fade]"),t=n.querySelectorAll("[data-animate-fade-after]");if(!e?.length&&!t?.length)return;const i=.4,r=.45;rg(n,()=>{e.length&&Yt(e,{opacity:1},{duration:i,delay:rc(.005),ease:$t.inOutQuint}),t.length&&Yt(t,{opacity:1},{duration:.35,delay:rc(.02,{startDelay:e.length?r:0}),ease:$t.inOutQuint})},{margin:"0px 0px -10% 0px"})}});function fg(){return{menuOpen:!1,toggle(){this.menuOpen=!this.menuOpen},close(){this.menuOpen=!1},onEscape(n){n.key==="Escape"&&this.menuOpen&&this.close()},init(){this.onEscape=this.onEscape.bind(this),document.addEventListener("keydown",this.onEscape)},destroy(){document.removeEventListener("keydown",this.onEscape)}}}function pl(n){return typeof n=="number"}function Xo(n){return typeof n=="string"}function Cs(n){return typeof n=="boolean"}function hc(n){return Object.prototype.toString.call(n)==="[object Object]"}function ct(n){return Math.abs(n)}function ml(n){return Math.sign(n)}function pr(n,e){return ct(n-e)}function hg(n,e){if(n===0||e===0||ct(n)<=ct(e))return 0;const t=pr(ct(n),ct(e));return ct(t/n)}function dg(n){return Math.round(n*100)/100}function Mr(n){return yr(n).map(Number)}function nn(n){return n[Pr(n)]}function Pr(n){return Math.max(0,n.length-1)}function gl(n,e){return e===Pr(n)}function dc(n,e=0){return Array.from(Array(n),(t,i)=>e+i)}function yr(n){return Object.keys(n)}function Of(n,e){return[n,e].reduce((t,i)=>(yr(i).forEach(r=>{const s=t[r],o=i[r],a=hc(s)&&hc(o);t[r]=a?Of(s,o):o}),t),{})}function qo(n,e){return typeof e.MouseEvent<"u"&&n instanceof e.MouseEvent}function pg(n,e){const t={start:i,center:r,end:s};function i(){return 0}function r(l){return s(l)/2}function s(l){return e-l}function o(l,c){return Xo(n)?t[n](l):n(e,l,c)}return{measure:o}}function Er(){let n=[];function e(r,s,o,a={passive:!0}){let l;if("addEventListener"in r)r.addEventListener(s,o,a),l=()=>r.removeEventListener(s,o,a);else{const c=r;c.addListener(o),l=()=>c.removeListener(o)}return n.push(l),i}function t(){n=n.filter(r=>r())}const i={add:e,clear:t};return i}function mg(n,e,t,i){const r=Er(),s=1e3/60;let o=null,a=0,l=0;function c(){r.add(n,"visibilitychange",()=>{n.hidden&&g()})}function u(){p(),r.clear()}function f(m){if(!l)return;o||(o=m,t(),t());const d=m-o;for(o=m,a+=d;a>=s;)t(),a-=s;const y=a/s;i(y),l&&(l=e.requestAnimationFrame(f))}function h(){l||(l=e.requestAnimationFrame(f))}function p(){e.cancelAnimationFrame(l),o=null,a=0,l=0}function g(){o=null,a=0}return{init:c,destroy:u,start:h,stop:p,update:t,render:i}}function gg(n,e){const t=e==="rtl",i=n==="y",r=i?"y":"x",s=i?"x":"y",o=!i&&t?-1:1,a=u(),l=f();function c(g){const{height:_,width:m}=g;return i?_:m}function u(){return i?"top":t?"right":"left"}function f(){return i?"bottom":t?"left":"right"}function h(g){return g*o}return{scroll:r,cross:s,startEdge:a,endEdge:l,measureSize:c,direction:h}}function pi(n=0,e=0){const t=ct(n-e);function i(c){return c<n}function r(c){return c>e}function s(c){return i(c)||r(c)}function o(c){return s(c)?i(c)?n:e:c}function a(c){return t?c-t*Math.ceil((c-e)/t):c}return{length:t,max:e,min:n,constrain:o,reachedAny:s,reachedMax:r,reachedMin:i,removeOffset:a}}function Bf(n,e,t){const{constrain:i}=pi(0,n),r=n+1;let s=o(e);function o(h){return t?ct((r+h)%r):i(h)}function a(){return s}function l(h){return s=o(h),f}function c(h){return u().set(a()+h)}function u(){return Bf(n,a(),t)}const f={get:a,set:l,add:c,clone:u};return f}function _g(n,e,t,i,r,s,o,a,l,c,u,f,h,p,g,_,m,d,y){const{cross:S,direction:T}=n,b=["INPUT","SELECT","TEXTAREA"],A={passive:!1},C=Er(),P=Er(),x=pi(50,225).constrain(p.measure(20)),M={mouse:300,touch:400},R={mouse:500,touch:600},O=g?43:25;let I=!1,F=0,V=0,z=!1,B=!1,W=!1,K=!1;function Q(J){if(!y)return;function le(ce){(Cs(y)||y(J,ce))&&q(ce)}const be=e;C.add(be,"dragstart",ce=>ce.preventDefault(),A).add(be,"touchmove",()=>{},A).add(be,"touchend",()=>{}).add(be,"touchstart",le).add(be,"mousedown",le).add(be,"touchcancel",re).add(be,"contextmenu",re).add(be,"click",ye,!0)}function ee(){C.clear(),P.clear()}function $(){const J=K?t:e;P.add(J,"touchmove",Y,A).add(J,"touchend",re).add(J,"mousemove",Y,A).add(J,"mouseup",re)}function ie(J){const le=J.nodeName||"";return b.includes(le)}function de(){return(g?R:M)[K?"mouse":"touch"]}function Ne(J,le){const be=f.add(ml(J)*-1),ce=u.byDistance(J,!g).distance;return g||ct(J)<x?ce:m&&le?ce*.5:u.byIndex(be.get(),0).distance}function q(J){const le=qo(J,i);K=le,W=g&&le&&!J.buttons&&I,I=pr(r.get(),o.get())>=2,!(le&&J.button!==0)&&(ie(J.target)||(z=!0,s.pointerDown(J),c.useFriction(0).useDuration(0),r.set(o),$(),F=s.readPoint(J),V=s.readPoint(J,S),h.emit("pointerDown")))}function Y(J){if(!qo(J,i)&&J.touches.length>=2)return re(J);const be=s.readPoint(J),ce=s.readPoint(J,S),Ie=pr(be,F),qe=pr(ce,V);if(!B&&!K&&(!J.cancelable||(B=Ie>qe,!B)))return re(J);const D=s.pointerMove(J);Ie>_&&(W=!0),c.useFriction(.3).useDuration(.75),a.start(),r.add(T(D)),J.preventDefault()}function re(J){const be=u.byDistance(0,!1).index!==f.get(),ce=s.pointerUp(J)*de(),Ie=Ne(T(ce),be),qe=hg(ce,Ie),D=O-10*qe,et=d+qe/50;B=!1,z=!1,P.clear(),c.useDuration(D).useFriction(et),l.distance(Ie,!g),K=!1,h.emit("pointerUp")}function ye(J){W&&(J.stopPropagation(),J.preventDefault(),W=!1)}function pe(){return z}return{init:Q,destroy:ee,pointerDown:pe}}function vg(n,e){let i,r;function s(f){return f.timeStamp}function o(f,h){const g=`client${(h||n.scroll)==="x"?"X":"Y"}`;return(qo(f,e)?f:f.touches[0])[g]}function a(f){return i=f,r=f,o(f)}function l(f){const h=o(f)-o(r),p=s(f)-s(i)>170;return r=f,p&&(i=f),h}function c(f){if(!i||!r)return 0;const h=o(r)-o(i),p=s(f)-s(i),g=s(f)-s(r)>170,_=h/p;return p&&!g&&ct(_)>.1?_:0}return{pointerDown:a,pointerMove:l,pointerUp:c,readPoint:o}}function xg(){function n(t){const{offsetTop:i,offsetLeft:r,offsetWidth:s,offsetHeight:o}=t;return{top:i,right:r+s,bottom:i+o,left:r,width:s,height:o}}return{measure:n}}function Sg(n){function e(i){return n*(i/100)}return{measure:e}}function Mg(n,e,t,i,r,s,o){const a=[n].concat(i);let l,c,u=[],f=!1;function h(m){return r.measureSize(o.measure(m))}function p(m){if(!s)return;c=h(n),u=i.map(h);function d(y){for(const S of y){if(f)return;const T=S.target===n,b=i.indexOf(S.target),A=T?c:u[b],C=h(T?n:i[b]);if(ct(C-A)>=.5){m.reInit(),e.emit("resize");break}}}l=new ResizeObserver(y=>{(Cs(s)||s(m,y))&&d(y)}),t.requestAnimationFrame(()=>{a.forEach(y=>l.observe(y))})}function g(){f=!0,l&&l.disconnect()}return{init:p,destroy:g}}function yg(n,e,t,i,r,s){let o=0,a=0,l=r,c=s,u=n.get(),f=0;function h(){const A=i.get()-n.get(),C=!l;let P=0;return C?(o=0,t.set(i),n.set(i),P=A):(t.set(n),o+=A/l,o*=c,u+=o,n.add(o),P=u-f),a=ml(P),f=u,b}function p(){const A=i.get()-e.get();return ct(A)<.001}function g(){return l}function _(){return a}function m(){return o}function d(){return S(r)}function y(){return T(s)}function S(A){return l=A,b}function T(A){return c=A,b}const b={direction:_,duration:g,velocity:m,seek:h,settled:p,useBaseFriction:y,useBaseDuration:d,useFriction:T,useDuration:S};return b}function Eg(n,e,t,i,r){const s=r.measure(10),o=r.measure(50),a=pi(.1,.99);let l=!1;function c(){return!(l||!n.reachedAny(t.get())||!n.reachedAny(e.get()))}function u(p){if(!c())return;const g=n.reachedMin(e.get())?"min":"max",_=ct(n[g]-e.get()),m=t.get()-e.get(),d=a.constrain(_/o);t.subtract(m*d),!p&&ct(m)<s&&(t.set(n.constrain(t.get())),i.useDuration(25).useBaseFriction())}function f(p){l=!p}return{shouldConstrain:c,constrain:u,toggleActive:f}}function Tg(n,e,t,i,r){const s=pi(-e+n,0),o=f(),a=u(),l=h();function c(g,_){return pr(g,_)<=1}function u(){const g=o[0],_=nn(o),m=o.lastIndexOf(g),d=o.indexOf(_)+1;return pi(m,d)}function f(){return t.map((g,_)=>{const{min:m,max:d}=s,y=s.constrain(g),S=!_,T=gl(t,_);return S?d:T||c(m,y)?m:c(d,y)?d:y}).map(g=>parseFloat(g.toFixed(3)))}function h(){if(e<=n+r)return[s.max];if(i==="keepSnaps")return o;const{min:g,max:_}=a;return o.slice(g,_)}return{snapsContained:l,scrollContainLimit:a}}function bg(n,e,t){const i=e[0],r=t?i-n:nn(e);return{limit:pi(r,i)}}function Ag(n,e,t,i){const s=e.min+.1,o=e.max+.1,{reachedMin:a,reachedMax:l}=pi(s,o);function c(h){return h===1?l(t.get()):h===-1?a(t.get()):!1}function u(h){if(!c(h))return;const p=n*(h*-1);i.forEach(g=>g.add(p))}return{loop:u}}function wg(n){const{max:e,length:t}=n;function i(s){const o=s-e;return t?o/-t:0}return{get:i}}function Cg(n,e,t,i,r){const{startEdge:s,endEdge:o}=n,{groupSlides:a}=r,l=f().map(e.measure),c=h(),u=p();function f(){return a(i).map(_=>nn(_)[o]-_[0][s]).map(ct)}function h(){return i.map(_=>t[s]-_[s]).map(_=>-ct(_))}function p(){return a(c).map(_=>_[0]).map((_,m)=>_+l[m])}return{snaps:c,snapsAligned:u}}function Rg(n,e,t,i,r,s){const{groupSlides:o}=r,{min:a,max:l}=i,c=u();function u(){const h=o(s),p=!n||e==="keepSnaps";return t.length===1?[s]:p?h:h.slice(a,l).map((g,_,m)=>{const d=!_,y=gl(m,_);if(d){const S=nn(m[0])+1;return dc(S)}if(y){const S=Pr(s)-nn(m)[0]+1;return dc(S,nn(m)[0])}return g})}return{slideRegistry:c}}function Pg(n,e,t,i,r){const{reachedAny:s,removeOffset:o,constrain:a}=i;function l(g){return g.concat().sort((_,m)=>ct(_)-ct(m))[0]}function c(g){const _=n?o(g):a(g),m=e.map((y,S)=>({diff:u(y-_,0),index:S})).sort((y,S)=>ct(y.diff)-ct(S.diff)),{index:d}=m[0];return{index:d,distance:_}}function u(g,_){const m=[g,g+t,g-t];if(!n)return g;if(!_)return l(m);const d=m.filter(y=>ml(y)===_);return d.length?l(d):nn(m)-t}function f(g,_){const m=e[g]-r.get(),d=u(m,_);return{index:g,distance:d}}function h(g,_){const m=r.get()+g,{index:d,distance:y}=c(m),S=!n&&s(m);if(!_||S)return{index:d,distance:g};const T=e[d]-y,b=g+u(T,0);return{index:d,distance:b}}return{byDistance:h,byIndex:f,shortcut:u}}function Dg(n,e,t,i,r,s,o){function a(f){const h=f.distance,p=f.index!==e.get();s.add(h),h&&(i.duration()?n.start():(n.update(),n.render(1),n.update())),p&&(t.set(e.get()),e.set(f.index),o.emit("select"))}function l(f,h){const p=r.byDistance(f,h);a(p)}function c(f,h){const p=e.clone().set(f),g=r.byIndex(p.get(),h);a(g)}return{distance:l,index:c}}function Lg(n,e,t,i,r,s,o,a){const l={passive:!0,capture:!0};let c=0;function u(p){if(!a)return;function g(_){if(new Date().getTime()-c>10)return;o.emit("slideFocusStart"),n.scrollLeft=0;const y=t.findIndex(S=>S.includes(_));pl(y)&&(r.useDuration(0),i.index(y,0),o.emit("slideFocus"))}s.add(document,"keydown",f,!1),e.forEach((_,m)=>{s.add(_,"focus",d=>{(Cs(a)||a(p,d))&&g(m)},l)})}function f(p){p.code==="Tab"&&(c=new Date().getTime())}return{init:u}}function lr(n){let e=n;function t(){return e}function i(l){e=o(l)}function r(l){e+=o(l)}function s(l){e-=o(l)}function o(l){return pl(l)?l:l.get()}return{get:t,set:i,add:r,subtract:s}}function Vf(n,e){const t=n.scroll==="x"?o:a,i=e.style;let r=null,s=!1;function o(h){return`translate3d(${h}px,0px,0px)`}function a(h){return`translate3d(0px,${h}px,0px)`}function l(h){if(s)return;const p=dg(n.direction(h));p!==r&&(i.transform=t(p),r=p)}function c(h){s=!h}function u(){s||(i.transform="",e.getAttribute("style")||e.removeAttribute("style"))}return{clear:u,to:l,toggleActive:c}}function Ig(n,e,t,i,r,s,o,a,l){const u=Mr(r),f=Mr(r).reverse(),h=d().concat(y());function p(C,P){return C.reduce((x,M)=>x-r[M],P)}function g(C,P){return C.reduce((x,M)=>p(x,P)>0?x.concat([M]):x,[])}function _(C){return s.map((P,x)=>({start:P-i[x]+.5+C,end:P+e-.5+C}))}function m(C,P,x){const M=_(P);return C.map(R=>{const O=x?0:-t,I=x?t:0,F=x?"end":"start",V=M[R][F];return{index:R,loopPoint:V,slideLocation:lr(-1),translate:Vf(n,l[R]),target:()=>a.get()>V?O:I}})}function d(){const C=o[0],P=g(f,C);return m(P,t,!1)}function y(){const C=e-o[0]-1,P=g(u,C);return m(P,-t,!0)}function S(){return h.every(({index:C})=>{const P=u.filter(x=>x!==C);return p(P,e)<=.1})}function T(){h.forEach(C=>{const{target:P,translate:x,slideLocation:M}=C,R=P();R!==M.get()&&(x.to(R),M.set(R))})}function b(){h.forEach(C=>C.translate.clear())}return{canLoop:S,clear:b,loop:T,loopPoints:h}}function Fg(n,e,t){let i,r=!1;function s(l){if(!t)return;function c(u){for(const f of u)if(f.type==="childList"){l.reInit(),e.emit("slidesChanged");break}}i=new MutationObserver(u=>{r||(Cs(t)||t(l,u))&&c(u)}),i.observe(n,{childList:!0})}function o(){i&&i.disconnect(),r=!0}return{init:s,destroy:o}}function Ng(n,e,t,i){const r={};let s=null,o=null,a,l=!1;function c(){a=new IntersectionObserver(g=>{l||(g.forEach(_=>{const m=e.indexOf(_.target);r[m]=_}),s=null,o=null,t.emit("slidesInView"))},{root:n.parentElement,threshold:i}),e.forEach(g=>a.observe(g))}function u(){a&&a.disconnect(),l=!0}function f(g){return yr(r).reduce((_,m)=>{const d=parseInt(m),{isIntersecting:y}=r[d];return(g&&y||!g&&!y)&&_.push(d),_},[])}function h(g=!0){if(g&&s)return s;if(!g&&o)return o;const _=f(g);return g&&(s=_),g||(o=_),_}return{init:c,destroy:u,get:h}}function Ug(n,e,t,i,r,s){const{measureSize:o,startEdge:a,endEdge:l}=n,c=t[0]&&r,u=g(),f=_(),h=t.map(o),p=m();function g(){if(!c)return 0;const y=t[0];return ct(e[a]-y[a])}function _(){if(!c)return 0;const y=s.getComputedStyle(nn(i));return parseFloat(y.getPropertyValue(`margin-${l}`))}function m(){return t.map((y,S,T)=>{const b=!S,A=gl(T,S);return b?h[S]+u:A?h[S]+f:T[S+1][a]-y[a]}).map(ct)}return{slideSizes:h,slideSizesWithGaps:p,startGap:u,endGap:f}}function Og(n,e,t,i,r,s,o,a,l){const{startEdge:c,endEdge:u,direction:f}=n,h=pl(t);function p(d,y){return Mr(d).filter(S=>S%y===0).map(S=>d.slice(S,S+y))}function g(d){return d.length?Mr(d).reduce((y,S,T)=>{const b=nn(y)||0,A=b===0,C=S===Pr(d),P=r[c]-s[b][c],x=r[c]-s[S][u],M=!i&&A?f(o):0,R=!i&&C?f(a):0,O=ct(x-R-(P+M));return T&&O>e+l&&y.push(S),C&&y.push(d.length),y},[]).map((y,S,T)=>{const b=Math.max(T[S-1]||0);return d.slice(b,y)}):[]}function _(d){return h?p(d,t):g(d)}return{groupSlides:_}}function Bg(n,e,t,i,r,s,o){const{align:a,axis:l,direction:c,startIndex:u,loop:f,duration:h,dragFree:p,dragThreshold:g,inViewThreshold:_,slidesToScroll:m,skipSnaps:d,containScroll:y,watchResize:S,watchSlides:T,watchDrag:b,watchFocus:A}=s,C=2,P=xg(),x=P.measure(e),M=t.map(P.measure),R=gg(l,c),O=R.measureSize(x),I=Sg(O),F=pg(a,O),V=!f&&!!y,z=f||!!y,{slideSizes:B,slideSizesWithGaps:W,startGap:K,endGap:Q}=Ug(R,x,M,t,z,r),ee=Og(R,O,m,f,x,M,K,Q,C),{snaps:$,snapsAligned:ie}=Cg(R,F,x,M,ee),de=-nn($)+nn(W),{snapsContained:Ne,scrollContainLimit:q}=Tg(O,de,ie,y,C),Y=V?Ne:ie,{limit:re}=bg(de,Y,f),ye=Bf(Pr(Y),u,f),pe=ye.clone(),Te=Mr(t),J=({dragHandler:ue,scrollBody:Ae,scrollBounds:Ve,options:{loop:se}})=>{se||Ve.constrain(ue.pointerDown()),Ae.seek()},le=({scrollBody:ue,translate:Ae,location:Ve,offsetLocation:se,previousLocation:ge,scrollLooper:we,slideLooper:Le,dragHandler:me,animation:He,eventHandler:L,scrollBounds:xe,options:{loop:ae}},Me)=>{const oe=ue.settled(),te=!xe.shouldConstrain(),fe=ae?oe:oe&&te,ke=fe&&!me.pointerDown();ke&&He.stop();const rt=Ve.get()*Me+ge.get()*(1-Me);se.set(rt),ae&&(we.loop(ue.direction()),Le.loop()),Ae.to(se.get()),ke&&L.emit("settle"),fe||L.emit("scroll")},be=mg(i,r,()=>J(De),ue=>le(De,ue)),ce=.68,Ie=Y[ye.get()],qe=lr(Ie),D=lr(Ie),et=lr(Ie),Be=lr(Ie),$e=yg(qe,et,D,Be,h,ce),Ce=Pg(f,Y,de,re,Be),w=Dg(be,ye,pe,$e,Ce,Be,o),v=wg(re),N=Er(),j=Ng(e,t,o,_),{slideRegistry:ne}=Rg(V,y,Y,q,ee,Te),Z=Lg(n,t,ne,w,$e,N,o,A),De={ownerDocument:i,ownerWindow:r,eventHandler:o,containerRect:x,slideRects:M,animation:be,axis:R,dragHandler:_g(R,n,i,r,Be,vg(R,r),qe,be,w,$e,Ce,ye,o,I,p,g,d,ce,b),eventStore:N,percentOfView:I,index:ye,indexPrevious:pe,limit:re,location:qe,offsetLocation:et,previousLocation:D,options:s,resizeHandler:Mg(e,o,r,t,R,S,P),scrollBody:$e,scrollBounds:Eg(re,et,Be,$e,I),scrollLooper:Ag(de,re,et,[qe,et,D,Be]),scrollProgress:v,scrollSnapList:Y.map(v.get),scrollSnaps:Y,scrollTarget:Ce,scrollTo:w,slideLooper:Ig(R,O,de,B,W,$,Y,et,t),slideFocus:Z,slidesHandler:Fg(e,o,T),slidesInView:j,slideIndexes:Te,slideRegistry:ne,slidesToScroll:ee,target:Be,translate:Vf(R,e)};return De}function Vg(){let n={},e;function t(c){e=c}function i(c){return n[c]||[]}function r(c){return i(c).forEach(u=>u(e,c)),l}function s(c,u){return n[c]=i(c).concat([u]),l}function o(c,u){return n[c]=i(c).filter(f=>f!==u),l}function a(){n={}}const l={init:t,emit:r,off:o,on:s,clear:a};return l}const zg={align:"center",axis:"x",container:null,slides:null,containScroll:"trimSnaps",direction:"ltr",slidesToScroll:1,inViewThreshold:0,breakpoints:{},dragFree:!1,dragThreshold:10,loop:!1,skipSnaps:!1,duration:25,startIndex:0,active:!0,watchDrag:!0,watchResize:!0,watchSlides:!0,watchFocus:!0};function kg(n){function e(s,o){return Of(s,o||{})}function t(s){const o=s.breakpoints||{},a=yr(o).filter(l=>n.matchMedia(l).matches).map(l=>o[l]).reduce((l,c)=>e(l,c),{});return e(s,a)}function i(s){return s.map(o=>yr(o.breakpoints||{})).reduce((o,a)=>o.concat(a),[]).map(n.matchMedia)}return{mergeOptions:e,optionsAtMedia:t,optionsMediaQueries:i}}function Gg(n){let e=[];function t(s,o){return e=o.filter(({options:a})=>n.optionsAtMedia(a).active!==!1),e.forEach(a=>a.init(s,n)),o.reduce((a,l)=>Object.assign(a,{[l.name]:l}),{})}function i(){e=e.filter(s=>s.destroy())}return{init:t,destroy:i}}function Dr(n,e,t){const i=n.ownerDocument,r=i.defaultView,s=kg(r),o=Gg(s),a=Er(),l=Vg(),{mergeOptions:c,optionsAtMedia:u,optionsMediaQueries:f}=s,{on:h,off:p,emit:g}=l,_=R;let m=!1,d,y=c(zg,Dr.globalOptions),S=c(y),T=[],b,A,C;function P(){const{container:Te,slides:J}=S;A=(Xo(Te)?n.querySelector(Te):Te)||n.children[0];const be=Xo(J)?A.querySelectorAll(J):J;C=[].slice.call(be||A.children)}function x(Te){const J=Bg(n,A,C,i,r,Te,l);if(Te.loop&&!J.slideLooper.canLoop()){const le=Object.assign({},Te,{loop:!1});return x(le)}return J}function M(Te,J){m||(y=c(y,Te),S=u(y),T=J||T,P(),d=x(S),f([y,...T.map(({options:le})=>le)]).forEach(le=>a.add(le,"change",R)),S.active&&(d.translate.to(d.location.get()),d.animation.init(),d.slidesInView.init(),d.slideFocus.init(pe),d.eventHandler.init(pe),d.resizeHandler.init(pe),d.slidesHandler.init(pe),d.options.loop&&d.slideLooper.loop(),A.offsetParent&&C.length&&d.dragHandler.init(pe),b=o.init(pe,T)))}function R(Te,J){const le=ee();O(),M(c({startIndex:le},Te),J),l.emit("reInit")}function O(){d.dragHandler.destroy(),d.eventStore.clear(),d.translate.clear(),d.slideLooper.clear(),d.resizeHandler.destroy(),d.slidesHandler.destroy(),d.slidesInView.destroy(),d.animation.destroy(),o.destroy(),a.clear()}function I(){m||(m=!0,a.clear(),O(),l.emit("destroy"),l.clear())}function F(Te,J,le){!S.active||m||(d.scrollBody.useBaseFriction().useDuration(J===!0?0:S.duration),d.scrollTo.index(Te,le||0))}function V(Te){const J=d.index.add(1).get();F(J,Te,-1)}function z(Te){const J=d.index.add(-1).get();F(J,Te,1)}function B(){return d.index.add(1).get()!==ee()}function W(){return d.index.add(-1).get()!==ee()}function K(){return d.scrollSnapList}function Q(){return d.scrollProgress.get(d.offsetLocation.get())}function ee(){return d.index.get()}function $(){return d.indexPrevious.get()}function ie(){return d.slidesInView.get()}function de(){return d.slidesInView.get(!1)}function Ne(){return b}function q(){return d}function Y(){return n}function re(){return A}function ye(){return C}const pe={canScrollNext:B,canScrollPrev:W,containerNode:re,internalEngine:q,destroy:I,off:p,on:h,emit:g,plugins:Ne,previousScrollSnap:$,reInit:_,rootNode:Y,scrollNext:V,scrollPrev:z,scrollProgress:Q,scrollSnapList:K,scrollTo:F,selectedScrollSnap:ee,slideNodes:ye,slidesInView:ie,slidesNotInView:de};return M(e,t),setTimeout(()=>l.emit("init"),0),pe}Dr.globalOptions=void 0;function di(){return di=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(n[i]=t[i])}return n},di.apply(this,arguments)}var Hg=.996,Wg=function(e,t){return t===void 0&&(t=Hg),e*t/(1-t)};function Xg(n){return n[n.length-1]}function qg(n){return n.reduce(function(e,t){return e+t})/n.length}var Yg=function(e,t,i){return Math.min(Math.max(t,e),i)};function Xs(n,e){if(n.length!==e.length)throw new Error("vectors must be same length");return n.map(function(t,i){return t+e[i]})}function pc(n){return Math.max.apply(Math,n.map(Math.abs))}function Oi(n){return Object.freeze(n),Object.values(n).forEach(function(e){e!==null&&typeof e=="object"&&!Object.isFrozen(e)&&Oi(e)}),n}function $g(){var n={};function e(r,s){return n[r]=(n[r]||[]).concat(s),function(){return t(r,s)}}function t(r,s){n[r]=(n[r]||[]).filter(function(o){return o!==s})}function i(r,s){r in n&&n[r].forEach(function(o){return o(s)})}return Oi({on:e,off:t,dispatch:i})}function Kg(n){var e=[],t=function(o){return o.addEventListener("wheel",n,{passive:!1}),e.push(o),function(){return i(o)}},i=function(o){o.removeEventListener("wheel",n),e=e.filter(function(a){return a!==o})},r=function(){e.forEach(i)};return Oi({observe:t,unobserve:i,disconnect:r})}var Zg=16*1.125,jg=typeof window<"u"&&window.innerHeight||800,qs=[1,Zg,jg];function Jg(n){var e=n.deltaX*qs[n.deltaMode],t=n.deltaY*qs[n.deltaMode],i=(n.deltaZ||0)*qs[n.deltaMode];return{timeStamp:n.timeStamp,axisDelta:[e,t,i]}}var Qg=[-1,-1,-1];function e0(n,e){if(!e)return n;var t=e===!0?Qg:e.map(function(i){return i?-1:1});return di({},n,{axisDelta:n.axisDelta.map(function(i,r){return i*t[r]})})}var mc=700,t0=function(e){return di({},e,{axisDelta:e.axisDelta.map(function(t){return Yg(t,-mc,mc)})})},n0=.6,i0=.96,r0=2,gc=5,_c=Oi({preventWheelAction:!0,reverseSign:[!0,!0,!1]}),s0=400;function vc(){return{isStarted:!1,isStartPublished:!1,isMomentum:!1,startTime:0,lastAbsDelta:1/0,axisMovement:[0,0,0],axisVelocity:[0,0,0],accelerationFactors:[],scrollPoints:[],scrollPointsToMerge:[],willEndTimeout:s0}}function o0(n){n===void 0&&(n={});var e=$g(),t=e.on,i=e.off,r=e.dispatch,s=_c,o=vc(),a,l=!1,c,u=function(F){Array.isArray(F)?F.forEach(function(V){return g(V)}):g(F)},f=function(F){return F===void 0&&(F={}),Object.values(F).some(function(V){return V==null})?s:s=Oi(di({},_c,s,F))},h=function(F){var V=di({event:a,isStart:!1,isEnding:!1,isMomentumCancel:!1,isMomentum:o.isMomentum,axisDelta:[0,0,0],axisVelocity:o.axisVelocity,axisMovement:o.axisMovement,get axisMovementProjection(){return Xs(V.axisMovement,V.axisVelocity.map(function(z){return Wg(z)}))}},F);r("wheel",di({},V,{previous:c})),c=V},p=function(F,V){var z=s,B=z.preventWheelAction,W=V[0],K=V[1],Q=V[2];if(typeof B=="boolean")return B;switch(B){case"x":return Math.abs(W)>=F;case"y":return Math.abs(K)>=F;case"z":return Math.abs(Q)>=F;default:return!1}},g=function(F){var V=t0(e0(Jg(F),s.reverseSign)),z=V.axisDelta,B=V.timeStamp,W=pc(z);if(F.preventDefault&&p(W,z)&&F.preventDefault(),o.isStarted?o.isMomentum&&W>Math.max(2,o.lastAbsDelta*2)&&(P(!0),A()):A(),W===0&&Object.is&&Object.is(F.deltaX,-0)){l=!0;return}a=F,o.axisMovement=Xs(o.axisMovement,z),o.lastAbsDelta=W,o.scrollPointsToMerge.push({axisDelta:z,timeStamp:B}),_(),h({axisDelta:z,isStart:!o.isStartPublished}),o.isStartPublished=!0,C()},_=function(){o.scrollPointsToMerge.length===r0?(o.scrollPoints.unshift({axisDeltaSum:o.scrollPointsToMerge.map(function(F){return F.axisDelta}).reduce(Xs),timeStamp:qg(o.scrollPointsToMerge.map(function(F){return F.timeStamp}))}),d(),o.scrollPointsToMerge.length=0,o.scrollPoints.length=1,o.isMomentum||T()):o.isStartPublished||m()},m=function(){o.axisVelocity=Xg(o.scrollPointsToMerge).axisDelta.map(function(F){return F/o.willEndTimeout})},d=function(){var F=o.scrollPoints,V=F[0],z=F[1];if(!(!z||!V)){var B=V.timeStamp-z.timeStamp;if(!(B<=0)){var W=V.axisDeltaSum.map(function(Q){return Q/B}),K=W.map(function(Q,ee){return Q/(o.axisVelocity[ee]||1)});o.axisVelocity=W,o.accelerationFactors.push(K),y(B)}}},y=function(F){var V=Math.ceil(F/10)*10*1.2;o.isMomentum||(V=Math.max(100,V*2)),o.willEndTimeout=Math.min(1e3,Math.round(V))},S=function(F){return F===0?!0:F<=i0&&F>=n0},T=function(){if(o.accelerationFactors.length>=gc){if(l&&(l=!1,pc(o.axisVelocity)>=.2)){b();return}var F=o.accelerationFactors.slice(gc*-1),V=F.every(function(z){var B=!!z.reduce(function(K,Q){return K&&K<1&&K===Q?1:0}),W=z.filter(S).length===z.length;return B||W});V&&b(),o.accelerationFactors=F}},b=function(){o.isMomentum=!0},A=function(){o=vc(),o.isStarted=!0,o.startTime=Date.now(),c=void 0,l=!1},C=(function(){var I;return function(){clearTimeout(I),I=setTimeout(P,o.willEndTimeout)}})(),P=function(F){F===void 0&&(F=!1),o.isStarted&&(o.isMomentum&&F?h({isEnding:!0,isMomentumCancel:!0}):h({isEnding:!0}),o.isMomentum=!1,o.isStarted=!1)},x=Kg(u),M=x.observe,R=x.unobserve,O=x.disconnect;return f(n),Oi({on:t,off:i,observe:M,unobserve:R,disconnect:O,feedWheel:u,updateOptions:f})}var a0={active:!0,breakpoints:{},wheelDraggingClass:"is-wheel-dragging",forceWheelAxis:void 0,target:void 0};Rs.globalOptions=void 0;function Rs(n){n===void 0&&(n={});var e,t=function(){};function i(s,o){var a,l,c=o.mergeOptions,u=o.optionsAtMedia,f=c(a0,Rs.globalOptions),h=c(f,n);e=u(h);var p=s.internalEngine(),g=(a=e.target)!=null?a:s.containerNode().parentNode,_=(l=e.forceWheelAxis)!=null?l:p.options.axis,m=o0({preventWheelAction:_,reverseSign:[!0,!0,!1]});function d(){C=(_==="x"?p.containerRect.width:p.containerRect.height)/2}var y=m.observe(g),S=m.on("wheel",W),T=!1,b,A=0,C=0,P=!1;d(),s.on("resize",d);function x(K){try{b=new MouseEvent("mousedown",K.event),V(b)}catch{return t()}T=!0,A=0,R(),e.wheelDraggingClass&&g.classList.add(e.wheelDraggingClass)}function M(K){T=!1,V(F("mouseup",K)),O(),e.wheelDraggingClass&&g.classList.remove(e.wheelDraggingClass)}function R(){document.documentElement.addEventListener("mousemove",I,!0),document.documentElement.addEventListener("mouseup",I,!0),document.documentElement.addEventListener("mousedown",I,!0)}function O(){document.documentElement.removeEventListener("mousemove",I,!0),document.documentElement.removeEventListener("mouseup",I,!0),document.documentElement.removeEventListener("mousedown",I,!0)}function I(K){T&&K.isTrusted&&K.stopImmediatePropagation()}function F(K,Q){var ee,$;if(_===p.options.axis){var ie=Q.axisMovement;ee=ie[0],$=ie[1]}else{var de=Q.axisMovement;$=de[0],ee=de[1]}var Ne=z(Q),q=Ne.isAtBoundary;if(q){var Y=Math.min(A/C,1),re=.25+Y*.5,ye=ee>0?-1:1,pe=A*ye,Te=pe*re;ee+=Te,$+=Te}if(!p.options.skipSnaps&&!p.options.dragFree){var J=p.containerRect.width,le=p.containerRect.height;ee=ee<0?Math.max(ee,-J):Math.min(ee,J),$=$<0?Math.max($,-le):Math.min($,le)}return new MouseEvent(K,{clientX:b.clientX+ee,clientY:b.clientY+$,screenX:b.screenX+ee,screenY:b.screenY+$,movementX:ee,movementY:$,button:0,bubbles:!0,cancelable:!0,composed:!0})}function V(K){s.containerNode().dispatchEvent(K)}function z(K){var Q=K.axisDelta,ee=Q[0],$=Q[1],ie=s.scrollProgress(),de=ie<1,Ne=ie>0,q=_==="x"?ee:$,Y=q<0,re=q>0,ye=Y&&!de||re&&!Ne;return{isAtBoundary:ye,primaryAxisDelta:q}}function B(K){var Q=z(K),ee=Q.isAtBoundary,$=Q.primaryAxisDelta;if(ee&&!K.isMomentum){if(A+=Math.abs($),A>C)return P=!0,M(K),!0}else A=0;return!1}function W(K){var Q=K.axisDelta,ee=Q[0],$=Q[1],ie=_==="x"?ee:$,de=_==="x"?$:ee,Ne=K.isMomentum&&K.previous&&!K.previous.isMomentum,q=K.isEnding&&!K.isMomentum||Ne,Y=Math.abs(ie)>Math.abs(de);Y&&!T&&!K.isMomentum&&!P&&x(K),P&&K.isEnding&&(P=!1),T&&(B(K)||(q?M(K):V(F("mousemove",K))))}t=function(){y(),S(),s.off("resize",d),O()}}var r={name:"wheelGestures",options:n,init:i,destroy:function(){return t()}};return r}const l0=.52,xc=10,Sc=(n,e,t)=>Math.min(Math.max(n,e),t);function Bi(n){return l0*n.scrollSnapList().length}function Tn(n,e,t){const i=n.scrollProgress();n.scrollSnapList().forEach((s,o)=>{let a=s-i;if(n.internalEngine().options.loop){const h=n.internalEngine().slideLooper?.loopPoints;h&&h.forEach(p=>{const g=p.target();if(o===p.index&&g!==0){const _=Math.sign(g);_===-1&&(a=s-(1+i)),_===1&&(a=s+(1-i))}})}const l=1-Math.abs(a*e),c=Sc(l,.5,1),u=Sc((1-l)*xc*1.5,0,xc),f=t[o];f&&(f.style.transform=`scale(${c})`,f.style.filter=u>.1?`blur(${u}px)`:"none")})}function Mc(n){return n.slideNodes().map(e=>e.querySelector(".variant-carousel__slide-inner"))}const c0=()=>({embla:null,selectedIndex:0,isVisible:!1,variantIds:[],isModelInteractionLocked:!1,emblaBaseOptions:{axis:"y",loop:!0,align:"center",containScroll:!1,dragFree:!1,skipSnaps:!1,duration:18},keydownHandler:null,modelCursorEl:null,cursorX:0,cursorY:0,cursorTargetX:0,cursorTargetY:0,cursorVisible:!1,cursorRafId:0,cursorCleanup:null,init(){const n=this,e=n.$el,t=e.dataset.variantIds;this.variantIds=t?t.split(",").map(r=>parseInt(r,10)):[],n.$watch("$store.product.currentVariant",async r=>{const s=r,o=s&&this.variantIds.includes(s.id);o&&!this.isVisible?(this.isVisible=!0,e.style.opacity="0",e.style.pointerEvents="auto",await new Promise(a=>setTimeout(a,250)),e.style.display="flex",requestAnimationFrame(()=>{this.initCarousel(),Yt(e,{opacity:[0,1]},{duration:.35,ease:$t.inOutQuart})})):!o&&this.isVisible&&(e.style.pointerEvents="none",await Yt(e,{opacity:0},{duration:.25,ease:$t.inOutQuart}).finished,this.isVisible=!1,e.style.display="none",this.destroyCarousel())});const i=this.$store;i.product.currentVariant&&this.variantIds.includes(i.product.currentVariant.id)?(this.isVisible=!0,e.style.opacity="0",e.style.pointerEvents="auto",requestAnimationFrame(()=>{this.initCarousel(),Yt(e,{opacity:[0,1]},{duration:.4,ease:$t.inOutQuart})})):(e.style.display="none",e.style.pointerEvents="none")},initCarousel(){const e=this.$el.querySelector(".variant-carousel__viewport");if(!e)return;this.destroyCarousel();const t=this.getEmblaOptions();this.embla=Dr(e,t,[Rs({forceWheelAxis:"y"})]);let i=Mc(this.embla),r=Bi(this.embla);Tn(this.embla,r,i),this.selectedIndex=0,this.embla.slideNodes().forEach((s,o)=>{s.addEventListener("click",()=>{this.embla&&this.embla.selectedScrollSnap()!==o&&this.embla.scrollTo(o)})}),this.embla.on("scroll",()=>{Tn(this.embla,r,i);const s=this.embla.scrollProgress(),o=this.embla.scrollSnapList();let a=0,l=1/0;o.forEach((c,u)=>{let f=Math.abs(c-s);f=Math.min(f,Math.abs(c-s+1),Math.abs(c-s-1)),f<l&&(l=f,a=u)}),this.selectedIndex=a}),this.embla.on("select",()=>{this.selectedIndex=this.embla.selectedScrollSnap()}),this.embla.on("reInit",()=>{i=Mc(this.embla),r=Bi(this.embla),Tn(this.embla,r,i),this.selectedIndex=this.embla.selectedScrollSnap()}),this.keydownHandler=s=>{!this.embla||!this.isVisible||(s.key==="ArrowDown"||s.key==="ArrowRight"?(s.preventDefault(),this.embla.scrollNext()):(s.key==="ArrowUp"||s.key==="ArrowLeft")&&(s.preventDefault(),this.embla.scrollPrev()))},document.addEventListener("keydown",this.keydownHandler),this.initModelCursor()},destroyCarousel(){this.unlockModelInteraction(),this.destroyModelCursor(),this.keydownHandler&&(document.removeEventListener("keydown",this.keydownHandler),this.keydownHandler=null),this.embla&&(this.embla.destroy(),this.embla=null)},initModelCursor(){const e=this.$el;if(!window.matchMedia("(hover: hover)").matches||(this.modelCursorEl=e.querySelector(".model-cursor"),!this.modelCursorEl))return;const t=e.querySelectorAll(".variant-carousel__model-wrapper");if(t.length===0)return;!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&t.forEach(u=>{u.style.cursor="none"});const r=u=>{this.cursorTargetX=u.clientX,this.cursorTargetY=u.clientY,this.cursorX=u.clientX,this.cursorY=u.clientY,this.showModelCursor()},s=u=>{this.cursorTargetX=u.clientX,this.cursorTargetY=u.clientY},o=()=>{this.unlockModelInteraction(),this.hideModelCursor()},a=u=>{!this.cursorVisible||u.button!==0||this.lockModelInteraction()},l=()=>{this.unlockModelInteraction()},c=u=>{this.isModelInteractionLocked&&(u.preventDefault(),u.stopPropagation())};t.forEach(u=>{u.addEventListener("mouseenter",r),u.addEventListener("mousemove",s),u.addEventListener("mouseleave",o),u.addEventListener("mousedown",a),u.addEventListener("wheel",c,{passive:!1})}),document.addEventListener("mouseup",l),this.cursorCleanup=()=>{t.forEach(u=>{u.removeEventListener("mouseenter",r),u.removeEventListener("mousemove",s),u.removeEventListener("mouseleave",o),u.removeEventListener("mousedown",a),u.removeEventListener("wheel",c)}),document.removeEventListener("mouseup",l)}},getEmblaOptions(){return{...this.emblaBaseOptions,watchDrag:!this.isModelInteractionLocked}},reInitEmblaPreservingIndex(){if(!this.embla)return;const n=this.embla.selectedScrollSnap();this.embla.reInit(this.getEmblaOptions()),this.embla.scrollTo(n,!0),this.selectedIndex=n},lockModelInteraction(){this.isModelInteractionLocked||(this.isModelInteractionLocked=!0,this.reInitEmblaPreservingIndex())},unlockModelInteraction(){this.isModelInteractionLocked&&(this.isModelInteractionLocked=!1,this.reInitEmblaPreservingIndex())},showModelCursor(){!this.modelCursorEl||this.cursorVisible||(this.cursorVisible=!0,this.modelCursorEl.style.opacity="1",this.startCursorLoop())},hideModelCursor(){this.modelCursorEl&&(this.cursorVisible=!1,this.modelCursorEl.style.opacity="0")},startCursorLoop(){const t=(r,s,o)=>r+(s-r)*o,i=()=>{this.cursorX=t(this.cursorX,this.cursorTargetX,.25),this.cursorY=t(this.cursorY,this.cursorTargetY,.25),this.modelCursorEl&&(this.modelCursorEl.style.transform=`translate3d(${this.cursorX+8}px, ${this.cursorY+8}px, 0)`),this.cursorVisible||Math.abs(this.cursorX-this.cursorTargetX)>.1||Math.abs(this.cursorY-this.cursorTargetY)>.1?this.cursorRafId=requestAnimationFrame(i):this.cursorRafId=0};this.cursorRafId||(this.cursorRafId=requestAnimationFrame(i))},destroyModelCursor(){this.cursorRafId&&(cancelAnimationFrame(this.cursorRafId),this.cursorRafId=0),this.cursorCleanup&&(this.cursorCleanup(),this.cursorCleanup=null),this.unlockModelInteraction(),this.modelCursorEl&&(this.modelCursorEl.style.opacity="0"),this.cursorVisible=!1,this.modelCursorEl=null},goToSlide(n){this.embla&&this.embla.scrollTo(n)},destroy(){this.destroyCarousel()}});function yc(n){return n.slideNodes().map(e=>e.querySelector(".variant-carousel-mobile__slide-inner"))}const u0=()=>({embla:null,selectedIndex:0,isVisible:!1,variantIds:[],activeModelIndex:null,outsideTapHandler:null,isTouchDevice:typeof window.matchMedia=="function"&&window.matchMedia("(hover: none) and (pointer: coarse)").matches,emblaBaseOptions:{axis:"x",loop:!0,align:"center",containScroll:!1,dragFree:!1,skipSnaps:!0,duration:24},init(){const n=this,e=n.$el;this.outsideTapHandler=r=>{if(this.activeModelIndex===null)return;const s=e.querySelector(`.variant-carousel-mobile__slide[data-slide-index="${this.activeModelIndex}"] .variant-carousel__model-wrapper--mobile`);if(!s){this.deactivateModelInteraction();return}const o=r.target;o&&!s.contains(o)&&this.deactivateModelInteraction()},document.addEventListener("pointerdown",this.outsideTapHandler);const t=e.dataset.variantIds;this.variantIds=t?t.split(",").map(r=>parseInt(r,10)):[],n.$watch("$store.product.currentVariant",async r=>{const s=r,o=s&&this.variantIds.includes(s.id);o&&!this.isVisible?(this.isVisible=!0,this.deactivateModelInteraction(),e.style.opacity="0",e.style.pointerEvents="auto",await new Promise(a=>setTimeout(a,250)),e.style.display="block",requestAnimationFrame(()=>{this.initCarousel(),Yt(e,{opacity:[0,1]},{duration:.35,ease:$t.inOutQuart})})):!o&&this.isVisible&&(this.deactivateModelInteraction(),e.style.pointerEvents="none",await Yt(e,{opacity:0},{duration:.25,ease:$t.inOutQuart}).finished,this.isVisible=!1,e.style.display="none",this.destroyCarousel())});const i=this.$store;i.product.currentVariant&&this.variantIds.includes(i.product.currentVariant.id)?(this.isVisible=!0,e.style.opacity="0",e.style.pointerEvents="auto",requestAnimationFrame(()=>{this.initCarousel(),this.syncActiveModelSource(),Yt(e,{opacity:[0,1]},{duration:.4,ease:$t.inOutQuart})})):(e.style.display="none",e.style.pointerEvents="none",this.unloadAllModelSources())},initCarousel(){const e=this.$el.querySelector(".variant-carousel-mobile__viewport");if(!e)return;this.destroyCarousel();const t=this.getEmblaOptions();this.embla=Dr(e,t);let i=yc(this.embla),r=Bi(this.embla);Tn(this.embla,r,i),this.selectedIndex=0,this.embla.on("scroll",()=>{Tn(this.embla,r,i);const s=this.embla.scrollProgress(),o=this.embla.scrollSnapList();let a=0,l=1/0;o.forEach((c,u)=>{let f=Math.abs(c-s);f=Math.min(f,Math.abs(c-s+1),Math.abs(c-s-1)),f<l&&(l=f,a=u)}),this.selectedIndex=a}),this.embla.on("select",()=>{this.selectedIndex=this.embla.selectedScrollSnap(),this.syncActiveModelSource()}),this.embla.on("reInit",()=>{i=yc(this.embla),r=Bi(this.embla),Tn(this.embla,r,i),this.selectedIndex=this.embla.selectedScrollSnap(),this.syncActiveModelSource()}),this.syncActiveModelSource()},goToSlide(n){this.deactivateModelInteraction(),this.embla&&this.embla.scrollTo(n)},getEmblaOptions(){return{...this.emblaBaseOptions,watchDrag:this.activeModelIndex===null}},isModelInteractive(n){return this.activeModelIndex===n},activateModelInteraction(n){this.activeModelIndex!==n&&(this.activeModelIndex=n,this.reInitEmblaPreservingIndex())},deactivateModelInteraction(){this.activeModelIndex!==null&&(this.activeModelIndex=null,this.reInitEmblaPreservingIndex())},reInitEmblaPreservingIndex(){if(!this.embla)return;const n=this.embla.selectedScrollSnap();this.embla.reInit(this.getEmblaOptions()),this.embla.scrollTo(n,!0),this.selectedIndex=n},destroyCarousel(){this.unloadAllModelSources(),this.embla&&(this.embla.destroy(),this.embla=null)},getModelSource(n){const e=n.dataset.modelSrc;if(e)return e;const t=n.getAttribute("src");return t?(n.dataset.modelSrc=t,t):null},getModelSlideIndex(n){const e=n.closest(".variant-carousel-mobile__slide");if(!e?.dataset.slideIndex)return null;const t=Number.parseInt(e.dataset.slideIndex,10);return Number.isNaN(t)?null:t},syncActiveModelSource(){if(!this.isTouchDevice)return;const e=this.$el.querySelectorAll("model-viewer");e.length!==0&&e.forEach(t=>{const i=this.getModelSource(t),r=this.getModelSlideIndex(t);r!==null&&r===this.selectedIndex&&i?t.getAttribute("src")!==i&&t.setAttribute("src",i):t.hasAttribute("src")&&t.removeAttribute("src")})},unloadAllModelSources(){if(!this.isTouchDevice)return;this.$el.querySelectorAll("model-viewer[src]").forEach(e=>{const t=e.getAttribute("src");t&&!e.dataset.modelSrc&&(e.dataset.modelSrc=t),e.removeAttribute("src")})},destroy(){this.deactivateModelInteraction(),this.outsideTapHandler&&(document.removeEventListener("pointerdown",this.outsideTapHandler),this.outsideTapHandler=null),this.destroyCarousel()}});function f0(){return{visible:!1,currentPath:"",policyUrls:[],init(){const n=this.$el,e=n.dataset.policyUrls||"";this.policyUrls=e.split(",").filter(Boolean),this.currentPath=window.location.pathname,this.visible=n.dataset.policyActive==="true"},update(n){this.currentPath=n,this.visible=this.policyUrls.includes(n)}}}function h0(){return{lenis:null,init(){const n=this.$el.querySelector("[data-policy-scroll]");if(!n||!window.matchMedia("(min-width: 768px)").matches)return;this.lenis=new Ui({wrapper:n,content:n,smoothWheel:!0,lerp:.1});const e=t=>{this.lenis&&(this.lenis.raf(t),requestAnimationFrame(e))};requestAnimationFrame(e)},destroy(){this.lenis&&(this.lenis.destroy(),this.lenis=null)}}}const Ec=(n,e,t)=>n+(e-n)*t,Tc=[{x:.005,y:.007,ease:.013},{x:.008,y:.004,ease:.02},{x:.003,y:.009,ease:.012},{x:.01,y:.006,ease:.017},{x:.004,y:.008,ease:.023},{x:.007,y:.003,ease:.015},{x:.006,y:.01,ease:.018},{x:.009,y:.005,ease:.013},{x:.005,y:.007,ease:.022},{x:.009,y:.007,ease:.013},{x:.007,y:.009,ease:.017},{x:.005,y:.005,ease:.02},{x:.008,y:.008,ease:.014},{x:.004,y:.006,ease:.018},{x:.009,y:.005,ease:.016},{x:.006,y:.009,ease:.017}],d0=()=>({_mouseX:0,_mouseY:0,_currentX:[],_currentY:[],_rafId:0,_tiles:[],_prefersReducedMotion:!1,_soldOutCursorCleanup:null,init(){const n=this.$el;if(this.initSoldOutCursor(n),this._prefersReducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches,this._prefersReducedMotion||!window.matchMedia("(hover: hover) and (pointer: fine)").matches)return;this._tiles=Array.from(n.querySelectorAll(".floating-product-grid__item")),this._currentX=this._tiles.map(()=>0),this._currentY=this._tiles.map(()=>0),this._mouseX=0,this._mouseY=0;const t=r=>{this._mouseX=(r.clientX/window.innerWidth-.5)*2,this._mouseY=(r.clientY/window.innerHeight-.5)*2};n.addEventListener("mousemove",t,{passive:!0}),n.addEventListener("mouseleave",()=>{this._mouseX=0,this._mouseY=0},{passive:!0});const i=()=>{for(let r=0;r<this._tiles.length;r++){const s=Tc[r%Tc.length],o=this._mouseX*s.x*window.innerWidth,a=this._mouseY*s.y*window.innerHeight;this._currentX[r]=Ec(this._currentX[r],o,s.ease),this._currentY[r]=Ec(this._currentY[r],a,s.ease);const l=this._tiles[r],c=l.style.getPropertyValue("--offset-x").trim()||"0px",u=l.style.getPropertyValue("--offset-y").trim()||"0px";l.style.transform=`translate(calc(${c} * 3 + ${this._currentX[r].toFixed(1)}px), calc(${u} * 3 + ${this._currentY[r].toFixed(1)}px))`}this._rafId=requestAnimationFrame(i)};this._rafId=requestAnimationFrame(i),this.$cleanup?.(()=>{cancelAnimationFrame(this._rafId),n.removeEventListener("mousemove",t)})},destroy(){cancelAnimationFrame(this._rafId),this._soldOutCursorCleanup?.(),this._soldOutCursorCleanup=null},initSoldOutCursor(n){if(!window.matchMedia("(hover: hover) and (pointer: fine)").matches)return;const e=n.querySelector(".model-cursor--grid-sold-out"),t=n.querySelectorAll(".floating-product-grid__item--sold-out");if(!e||t.length===0)return;const i=8,r=.25,s=(d,y,S)=>d+(y-d)*S;let o=0,a=0,l=0,c=0,u=!1,f=0;const h=()=>{o=s(o,l,r),a=s(a,c,r),e.style.transform=`translate3d(${o+i}px, ${a+i}px, 0)`,u||Math.abs(o-l)>.1||Math.abs(a-c)>.1?f=requestAnimationFrame(h):f=0},p=()=>{f||(f=requestAnimationFrame(h))},g=d=>{l=d.clientX,c=d.clientY,o=d.clientX,a=d.clientY,u||(u=!0,e.style.opacity="1"),p()},_=d=>{l=d.clientX,c=d.clientY},m=()=>{u=!1,e.style.opacity="0",p()};t.forEach(d=>{d.addEventListener("mouseenter",g),d.addEventListener("mousemove",_),d.addEventListener("mouseleave",m)}),this._soldOutCursorCleanup=()=>{t.forEach(d=>{d.removeEventListener("mouseenter",g),d.removeEventListener("mousemove",_),d.removeEventListener("mouseleave",m)}),f&&(cancelAnimationFrame(f),f=0),e.style.opacity="0",u=!1}},onTileHover(n,e){if(n)try{const t=e.clientX/window.innerWidth,i=1-e.clientY/window.innerHeight;this.$store.gradient.focusPoint=[t,i];const r=Ru(Cu(n));this.$store.gradient.setFromHex(r,.8)}catch{}},onTileLeave(){try{const n=this.$store,e=n?.wallpaper?.open,t=n?.modal?.isOpen;if(e||t){n.gradient.focusPoint=null;return}n.gradient.focusPoint=null,n.gradient.revertToFallback(.8)}catch{}}});function bc(n){return n.slideNodes().map(e=>e.querySelector(".product-grid-mobile__slide-inner"))}const p0=()=>({embla:null,selectedIndex:0,_slideClickCleanups:[],init(){this.initCarousel()},initCarousel(){const e=this.$el.querySelector(".product-grid-mobile__viewport");if(!e)return;this.destroyCarousel();const t={axis:"y",loop:!0,align:"center",containScroll:!1,dragFree:!1,skipSnaps:!0,duration:24,startIndex:0};this.embla=Dr(e,t,[Rs()]);let i=bc(this.embla),r=Bi(this.embla);Tn(this.embla,r,i),this.selectedIndex=0,setTimeout(()=>this.updateGradientFromSlide(0),100),this.embla.slideNodes().forEach((s,o)=>{const a=s.querySelector(".product-grid-mobile__slide-inner");if(!a)return;const l=c=>{if(!this.embla)return;if(!(this.embla.selectedScrollSnap()===o)){c.preventDefault(),this.embla.scrollTo(o);return}a.querySelector("[data-product-sold-out]")&&c.preventDefault()};a.addEventListener("click",l,!0),this._slideClickCleanups.push(()=>{a.removeEventListener("click",l,!0)})}),this.embla.on("scroll",()=>{Tn(this.embla,r,i)}),this.embla.on("select",()=>{this.selectedIndex=this.embla.selectedScrollSnap(),this.updateGradientFromSlide(this.selectedIndex)}),this.embla.on("reInit",()=>{i=bc(this.embla),r=Bi(this.embla),Tn(this.embla,r,i),this.selectedIndex=this.embla.selectedScrollSnap()})},updateGradientFromSlide(n,e){if(window.matchMedia("(hover: hover) and (pointer: fine)").matches||!this.embla)return;const i=this.embla.slideNodes()[n];if(!i)return;const r=i.dataset.tileHex;if(!r)return;const s=this.$store.gradient;if(s.currentHex!==r)try{s.setFromHex(r,e??.8)}catch{}},destroyCarousel(){this._slideClickCleanups.forEach(n=>n()),this._slideClickCleanups=[],this.embla&&(this.embla.destroy(),this.embla=null)},destroy(){this.destroyCarousel()}}),m0=()=>({emailError:!1,init(){const n=this.$el,e=n.querySelector("[data-contact-success]");n.querySelector("form");const t=n.querySelector('input[type="email"]');t&&(t.addEventListener("invalid",()=>{this.emailError=!0}),t.addEventListener("input",()=>{this.emailError=!1})),e&&this.animateTransition(n)},async animateTransition(n){const e=n.querySelector("[data-contact-form]"),t=n.querySelector("[data-contact-success]");!e||!t||(await Yt(e,{opacity:0},{duration:.25,ease:$t.inOutQuart}).finished,e.style.display="none",Yt(t,{opacity:1},{duration:.4,ease:$t.outQuart}))}});function g0(){return{open:!1,lenis:null,rafId:null,toggle(){this.open=!this.open,this.open?this.$nextTick(()=>{const n=this.$refs.localeList;if(!n)return;this.lenis=new Ui({wrapper:n,content:n,smoothWheel:!0,lerp:.1});const e=t=>{this.lenis&&(this.lenis.raf(t),this.rafId=requestAnimationFrame(e))};this.rafId=requestAnimationFrame(e)}):this.destroyLenis()},close(){this.open=!1,this.destroyLenis()},destroyLenis(){this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.lenis&&(this.lenis.destroy(),this.lenis=null)},selectCountry(n){const e=this.$refs.countryInput;e&&(e.value=n,e.closest("form")?.submit())},onEscape(n){n.key==="Escape"&&this.open&&this.close()},init(){this.onEscape=this.onEscape.bind(this),document.addEventListener("keydown",this.onEscape)},destroy(){document.removeEventListener("keydown",this.onEscape),this.destroyLenis()}}}zh(bt);bt.store("modal",cg);bt.store("cart",Kh);bt.store("product",lg);bt.data("Component",ug);bt.data("Header",fg);bt.data("VariantImageCarousel",c0);bt.data("VariantImageCarouselMobile",u0);bt.data("policyNav",f0);bt.data("policyPage",h0);bt.data("FloatingProductGrid",d0);bt.data("ProductGridCarousel",p0);bt.data("ContactForm",m0);bt.data("LocaleSelector",g0);window.Alpine=bt;function Ac(){Mt('Alpine init: x-data="Component" elements found:',document.querySelectorAll('[x-data="Component"]').length),bt.start()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ac):Ac();const he={scroller:null,end:300,isDragging:!1,scrollerScrollWidth:300,scrollerWidth:300,scrollerScrollHeight:300,scrollerHeight:300,padding:{start:0,end:0},scrollPadding:{start:0,end:0},slidePositions:[],hasSnap:!1,dir:1};function _0(n,e,t){return(1-t)*n+t*e}function Qi(n,e,t,i){return _0(n,e,1-Math.exp(Math.log(1-t)*(i/(1e3/60))))}function zf(n,e,t){return Math.max(e,Math.min(t,n))}function Ys(n,e=0){const t=Math.pow(10,e);return Math.round(n*t)/t}function v0(n,e,t){return n+e/(1-t)}const kn=.72,$s=.12,wc=new Event("scrollend",{bubbles:!0,cancelable:!0}),_l=(n,e,t)=>{const i=t?new CustomEvent(e,{bubbles:!0,cancelable:!0,detail:t}):new Event(e,{bubbles:!0,cancelable:!0});return n?.dispatchEvent(i),i},Ks=(n,e)=>_l(n,"overscroll",e),x0=n=>(n?.dispatchEvent(wc),wc),S0=(n,e)=>_l(n,"scrollsnapchange",e),kf=(n,e)=>_l(n,"scrollsnapchanging",e),Rt={positions:[],activePosition:{target:null,x:0}};function M0(n){let e=[],t=0;const i=o=>{if(t++,t>100)return;const a=window.getComputedStyle(o).scrollSnapAlign;if(a!=="none"){e.push({align:a,el:o});return}const l=o.children;if(l.length!==0)for(let c of l)i(c)};i(n);const r=n.getBoundingClientRect(),s=e.map(({el:o,align:a},l)=>{const c=o.getBoundingClientRect(),u=o.clientWidth,f=c.left-r.left+n.scrollLeft;switch(a){case"start":return{target:o,x:f-he.scrollPadding.start,y:0};case"end":return{target:o,x:f+u-he.scrollerWidth+he.scrollPadding.end,y:0};case"center":return{target:o,x:f+u*.5-he.scrollerWidth/2,y:0};default:return null}}).filter(o=>o!==null).reduce((o,a)=>((o.length===0||o[o.length-1].x!==a.x)&&o.push(a),o),[]);Rt.positions=s}function y0(n,e,t){const i=Gf(n,e,t);return i.x!==Rt.activePosition.x&&kf(he.scroller,{snapTargetInline:(i||Rt.activePosition).target,snapTargetBlock:(i||Rt.activePosition).target}),Rt.activePosition=i,(zf(i.x,Math.min((he.scrollerScrollWidth-he.scrollerWidth)*he.dir,0),Math.max((he.scrollerScrollWidth-he.scrollerWidth)*he.dir,0))-n)*(1-kn)*(1/kn)}function Gf(n,e,t){const i=v0(n,e,t);return Rt.positions.length?Rt.positions.reduce((r,s)=>Math.abs(s.x-i)<Math.abs(r.x-i)?s:r):{target:null,x:zf(i,Math.min(he.end,0),Math.max(he.end,0)),y:0}}function E0(){S0(he.scroller,{snapTargetInline:Rt.activePosition.target,snapTargetBlock:Rt.activePosition.target})}function T0(n,e,t){const i=Gf(n,e,t);i.x!==Rt.activePosition.x&&(Rt.activePosition=i,kf(he.scroller,{snapTargetInline:(i||Rt.activePosition).target,snapTargetBlock:(i||Rt.activePosition).target}))}const b0={center:(n,e)=>n+e*.5-he.scrollerWidth/2,end:(n,e)=>n+e-he.scrollerWidth+he.scrollPadding.end,start:(n,e)=>n-he.scrollPadding.start};function Cc(n,e,t){if(he.hasSnap)return n;const i=b0[t||"start"];return i(n,e)}function Hf(n,e){if(!he.scroller)return 0;const t=he.scroller.scrollLeft,i=Rt.positions.length?Rt.positions:he.slidePositions;if(n==="prev")for(let r=i.length-1;r>=0;r--){const s=Cc(i[r].x,i[r].width||0,e);if(s<t-1)return s}else for(let r=0;r<i.length;r++){const s=Cc(i[r].x,i[r].width||0,e);if(s>t+1)return s}return 0}function A0({align:n}={}){const e=Hf("prev",n);e&&he.scroller.scrollTo({left:e,behavior:"smooth"})}function w0({align:n}={}){const e=Hf("next",n);e&&he.scroller.scrollTo({left:e,behavior:"smooth"})}const C0=(n,e)=>{he.scroller=n;let t=!0;const i={x:0,y:0},r={x:0,y:0},s={x:0,y:0},o=new Proxy({x:0,y:0},{set($,ie,de){return $[ie]===de||($[ie]=de,($.x>=10||$.y>=10)&&(R.value=!0)),!0}}),a=new Proxy({x:!1,y:!1},{set($,ie,de){return $[ie]===de||($[ie]=de,$.x||$.y?(n.setAttribute("has-overflow","true"),n.addEventListener("pointerdown",T),n.addEventListener("wheel",C,{passive:!1})):(n.removeAttribute("has-overflow"),n.removeEventListener("pointerdown",T),n.removeEventListener("wheel",C))),!0}});let l=null,c=null,u=null,f=null,h;function p(){n?.setAttribute("blossom-carousel","true"),c=n?.querySelectorAll("a[href]")||null,c?.forEach(de=>{de.addEventListener("click",_)}),window.addEventListener("keydown",P),n.addEventListener("scroll",y),u=new ResizeObserver(m),u.observe(n),f=new MutationObserver(d),f.observe(n,{attributes:!1,childList:!0,subtree:!1});const $=window.matchMedia("(hover: hover) and (pointer: fine)").matches;he.dir=n.closest('[dir="rtl"]')?-1:1;const{scrollSnapType:ie}=window.getComputedStyle(n);he.hasSnap=ie!=="none",n.style.setProperty("--snap-type",ie),$&&n.style.setProperty("scroll-snap-type","none"),n.setAttribute("has-snap",t?"true":"false"),n.setAttribute("has-repeat",e?.repeat?"true":"false"),h=Q(de=>{(de===n||n.contains(de))&&(R.value=!1)})}function g(){n.removeAttribute("blossom-carousel"),u?.disconnect(),f?.disconnect(),l&&cancelAnimationFrame(l),window.removeEventListener("keydown",P),n.removeEventListener("scroll",y),c?.forEach($=>{$.removeEventListener("click",_)}),h?.()}function _($){o.x>10&&$.preventDefault()}function m(){if(!n)return;const $="ontouchmove"in window;he.scrollerScrollWidth=n.scrollWidth,he.scrollerWidth=n.clientWidth,he.scrollerScrollHeight=n.scrollHeight,he.scrollerHeight=n.clientHeight;const ie=window.getComputedStyle(n);a.x=!$&&he.scrollerScrollWidth>he.scrollerWidth&&["auto","scroll"].includes(ie.getPropertyValue("overflow-x")),a.y=!$&&he.scrollerScrollHeight>he.scrollerHeight&&["auto","scroll"].includes(ie.getPropertyValue("overflow-y")),he.padding.end=parseInt(ie.paddingInlineEnd)||0,he.padding.start=parseInt(ie.paddingInlineStart)||0,he.scrollPadding.start=parseInt(ie.scrollPaddingInlineStart)||0,he.scrollPadding.end=parseInt(ie.scrollPaddingInlineEnd)||0,he.dir=n.closest('[dir="rtl"]')?-1:1,he.end=(he.scrollerScrollWidth-he.scrollerWidth-4)*he.dir,he.hasSnap?M0(n):he.slidePositions=Array.from(n.children).map(de=>{const Ne=de.getBoundingClientRect(),q=n.getBoundingClientRect(),Y=Ne.left-q.left+n.scrollLeft;return{target:de,x:Y-he.scrollPadding.start,y:0,width:Ne.width,height:Ne.height}}),e?.repeat&&x(null,null)}function d(){m()}function y(){if(e?.repeat){x(null,null);return}if(he.isDragging||!n)return;const $=n.scrollLeft;$<0?Ks(n,{left:$*-1}):$>he.scrollerScrollWidth-he.scrollerWidth&&Ks(n,{left:$*-1+he.scrollerScrollWidth-he.scrollerWidth})}const S={x:0,y:0};function T($){n&&(a.x&&(S.x=n.scrollLeft,i.x=$.clientX,s.x=0),a.y&&(S.y=n.scrollTop,i.y=$.clientY,s.y=0),o.x=0,he.isDragging=!0,window.addEventListener("pointermove",b),window.addEventListener("pointerup",A))}function b($){if($.preventDefault(),a.x){const ie=i.x-$.clientX;r.x+=ie,s.x+=ie,i.x=$.clientX,o.x+=Math.abs(ie)}if(a.y){const ie=i.y-$.clientY;r.y+=ie,s.y+=ie,i.y=$.clientY,o.y+=Math.abs(ie)}}function A(){window.removeEventListener("pointermove",b),window.removeEventListener("pointerup",A),he.isDragging=!1,!(o.x<=10)&&(a.x&&(s.x*=2),a.y&&(s.y*=2),s.x=y0(r.x,s.x,kn),ee())}function C($){if(Math.abs($.deltaX)>Math.abs($.deltaY)){if(R.value=!1,he.isDragging||!n)return;a.x&&(S.x=n.scrollLeft),a.y&&(S.y=n.scrollTop)}}function P($){["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes($.key)&&(R.value=!1)}function x($,ie){if(!n)return;const de=ie??n.scrollLeft,Ne=he.padding.start-de,q=de-(he.scrollerScrollWidth-he.scrollerWidth-he.padding.end),Y=Array.from(n.children),re=(pe,Te,J,le)=>{let be=0;const ce=le?-1:1,Ie=le?-(he.scrollerScrollWidth-he.scrollerWidth):he.scrollerScrollWidth-he.scrollerWidth;for(let qe=pe;le?qe>=Te:qe<Te;qe+=ce){const D=be>J;Y[qe].style.translate=`${D?0:Ie}px 0`,be+=Y[qe].clientWidth}};if(re(Y.length-1,Y.length/2,Ne,!0),re(0,Y.length/2,q,!1),he.isDragging)return;const ye=de>he.end?4:de<4?he.end:null;ye&&(B=!0,n.scrollTo({left:ye,behavior:"instant"}))}function M($){R.value&&$.stopPropagation()}const R=new Proxy({value:!1},{set($,ie,de){return t=!de,$[ie]===de?!0:n?(n.setAttribute("has-snap",t?"true":"false"),de&&!R.value?(I=performance.now(),a.x&&(r.x=n.scrollLeft),a.y&&(r.y=n.scrollTop),n.addEventListener("scrollend",M,{capture:!0,passive:!1}),l||(l=requestAnimationFrame(F))):de||(l&&cancelAnimationFrame(l),l=null,n.removeEventListener("scrollend",M)),$[ie]=de,!0):!1}});let O=0,I=0;function F($){l=requestAnimationFrame(F),O=$-I,n&&(a.x&&(s.x*=kn,he.isDragging?S.x=Qi(S.x,r.x,kn,O):(r.x+=s.x,S.x=Qi(S.x,r.x,$s,O))),a.y&&(s.y*=kn,he.isDragging?S.y=Qi(S.y,r.y,kn,O):(r.y+=s.y,S.y=Qi(S.y,r.y,$s,O))),e?.repeat&&(S.x>he.end&&(S.x=r.x=4),S.x<4&&(S.x=r.x=he.end)),B=!0,n.scrollTo({left:S.x,top:S.y,behavior:"instant"}),he.isDragging&&he.hasSnap&&T0(r.x,s.x,kn),!he.isDragging&&Ys(s.x,12)===0&&(R.value=!1,x0(n),he.hasSnap&&E0()),e?.repeat?x(null,S.x):z(Ys(S.x,2)),I=$)}let V=0;function z($){if(!n)return;const ie=he.end;let de=0;if($*he.dir<=0?de=he.isDragging?$*-.2:0:$*he.dir>ie*he.dir&&(de=he.isDragging?($-ie)*-.2:0),V=Qi(V,de,he.isDragging?.8:$s,O),Math.abs(V)>.01){if(Ks(n,{left:V}).defaultPrevented)return;n.style.transform=`translateX(${Ys(V,3)}px)`;return}n.style.transform="",V=0}let B=!1;const W=n.scrollTo.bind(n);n.scrollTo=function(...$){B===!0||(R.value=!1),B=!1,W(...$)};const K=n.scrollBy.bind(n);n.scrollBy=function(...$){B===!0||(R.value=!1),B=!1,K(...$)};function Q($){const ie=[],de=Element.prototype.scrollIntoView;return de&&(Element.prototype.scrollIntoView=function(Ne){return $(this,"scrollIntoView",[Ne]),de.call(this,Ne)},ie.push(()=>{Element.prototype.scrollIntoView=de})),()=>ie.forEach(Ne=>Ne())}function ee(){const $=ie=>{ie.preventDefault(),ie.stopPropagation(),window.removeEventListener("click",$,!0)};window.addEventListener("click",$,!0)}return{snap:t,hasOverflow:a,init:p,destroy:g,prev:A0,next:w0}};class R0 extends HTMLElement{carouselInstance;constructor(){super();const e=this.attachShadow({mode:"open"});this.setAttribute("blossom-carousel","true");const t=document.createElement("slot");e.appendChild(t)}connectedCallback(){this.carouselInstance=C0(this,{repeat:this.hasAttribute("repeat")}),this.carouselInstance.init()}disconnectedCallback(){this.carouselInstance.destroy()}prev(e){this.carouselInstance.prev(e)}next(e){this.carouselInstance.next(e)}}customElements.define("blossom-carousel",R0);const vl="182",P0=0,Rc=1,D0=2,ps=1,L0=2,cr=3,Yn=0,Ft=1,Mn=2,bn=0,Fi=1,Pc=2,Dc=3,Lc=4,I0=5,si=100,F0=101,N0=102,U0=103,O0=104,B0=200,V0=201,z0=202,k0=203,Yo=204,$o=205,G0=206,H0=207,W0=208,X0=209,q0=210,Y0=211,$0=212,K0=213,Z0=214,Ko=0,Zo=1,jo=2,Vi=3,Jo=4,Qo=5,ea=6,ta=7,Wf=0,j0=1,J0=2,un=0,Xf=1,qf=2,Yf=3,$f=4,Kf=5,Zf=6,jf=7,Jf=300,mi=301,zi=302,na=303,ia=304,Ps=306,ra=1e3,yn=1001,sa=1002,yt=1003,Q0=1004,kr=1005,St=1006,Zs=1007,ci=1008,Xt=1009,Qf=1010,eh=1011,Tr=1012,xl=1013,hn=1014,ln=1015,dn=1016,Sl=1017,Ml=1018,br=1020,th=35902,nh=35899,ih=1021,rh=1022,qt=1023,Pn=1026,ui=1027,sh=1028,yl=1029,ki=1030,El=1031,Tl=1033,ms=33776,gs=33777,_s=33778,vs=33779,oa=35840,aa=35841,la=35842,ca=35843,ua=36196,fa=37492,ha=37496,da=37488,pa=37489,ma=37490,ga=37491,_a=37808,va=37809,xa=37810,Sa=37811,Ma=37812,ya=37813,Ea=37814,Ta=37815,ba=37816,Aa=37817,wa=37818,Ca=37819,Ra=37820,Pa=37821,Da=36492,La=36494,Ia=36495,Fa=36283,Na=36284,Ua=36285,Oa=36286,e_=3200,t_=0,n_=1,Gn="",Wt="srgb",Gi="srgb-linear",Es="linear",it="srgb",_i=7680,Ic=519,i_=512,r_=513,s_=514,bl=515,o_=516,a_=517,Al=518,l_=519,Fc=35044,Nc="300 es",cn=2e3,Ts=2001;function oh(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function bs(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function c_(){const n=bs("canvas");return n.style.display="block",n}const Uc={};function Oc(...n){const e="THREE."+n.shift();console.log(e,...n)}function Ge(...n){const e="THREE."+n.shift();console.warn(e,...n)}function Je(...n){const e="THREE."+n.shift();console.error(e,...n)}function Ar(...n){const e=n.join(" ");e in Uc||(Uc[e]=!0,Ge(...n))}function u_(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}class Ki{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Et=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],js=Math.PI/180,Ba=180/Math.PI;function Lr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Et[n&255]+Et[n>>8&255]+Et[n>>16&255]+Et[n>>24&255]+"-"+Et[e&255]+Et[e>>8&255]+"-"+Et[e>>16&15|64]+Et[e>>24&255]+"-"+Et[t&63|128]+Et[t>>8&255]+"-"+Et[t>>16&255]+Et[t>>24&255]+Et[i&255]+Et[i>>8&255]+Et[i>>16&255]+Et[i>>24&255]).toLowerCase()}function Ke(n,e,t){return Math.max(e,Math.min(t,n))}function f_(n,e){return(n%e+e)%e}function Js(n,e,t){return(1-t)*n+t*e}function er(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function It(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class Qe{constructor(e=0,t=0){Qe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ke(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ir{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],f=i[r+3],h=s[o+0],p=s[o+1],g=s[o+2],_=s[o+3];if(a<=0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f;return}if(a>=1){e[t+0]=h,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(f!==_||l!==h||c!==p||u!==g){let m=l*h+c*p+u*g+f*_;m<0&&(h=-h,p=-p,g=-g,_=-_,m=-m);let d=1-a;if(m<.9995){const y=Math.acos(m),S=Math.sin(y);d=Math.sin(d*y)/S,a=Math.sin(a*y)/S,l=l*d+h*a,c=c*d+p*a,u=u*d+g*a,f=f*d+_*a}else{l=l*d+h*a,c=c*d+p*a,u=u*d+g*a,f=f*d+_*a;const y=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=y,c*=y,u*=y,f*=y}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],f=s[o],h=s[o+1],p=s[o+2],g=s[o+3];return e[t]=a*g+u*f+l*p-c*h,e[t+1]=l*g+u*h+c*f-a*p,e[t+2]=c*g+u*p+a*h-l*f,e[t+3]=u*g-a*f-l*h-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),f=a(s/2),h=l(i/2),p=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=h*u*f+c*p*g,this._y=c*p*f-h*u*g,this._z=c*u*g+h*p*f,this._w=c*u*f-h*p*g;break;case"YXZ":this._x=h*u*f+c*p*g,this._y=c*p*f-h*u*g,this._z=c*u*g-h*p*f,this._w=c*u*f+h*p*g;break;case"ZXY":this._x=h*u*f-c*p*g,this._y=c*p*f+h*u*g,this._z=c*u*g+h*p*f,this._w=c*u*f-h*p*g;break;case"ZYX":this._x=h*u*f-c*p*g,this._y=c*p*f+h*u*g,this._z=c*u*g-h*p*f,this._w=c*u*f+h*p*g;break;case"YZX":this._x=h*u*f+c*p*g,this._y=c*p*f+h*u*g,this._z=c*u*g-h*p*f,this._w=c*u*f-h*p*g;break;case"XZY":this._x=h*u*f-c*p*g,this._y=c*p*f-h*u*g,this._z=c*u*g+h*p*f,this._w=c*u*f+h*p*g;break;default:Ge("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],f=t[10],h=i+a+f;if(h>0){const p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>f){const p=2*Math.sqrt(1+i-a-f);this._w=(u-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>f){const p=2*Math.sqrt(1+a-i-f);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+f-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-t;if(a<.9995){const c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class G{constructor(e=0,t=0,i=0){G.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Bc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Bc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),f=2*(s*i-o*t);return this.x=t+l*c+o*f-a*u,this.y=i+l*u+a*c-s*f,this.z=r+l*f+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Qs.copy(this).projectOnVector(e),this.sub(Qs)}reflect(e){return this.sub(Qs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ke(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Qs=new G,Bc=new Ir;class We{constructor(e,t,i,r,s,o,a,l,c){We.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],f=i[7],h=i[2],p=i[5],g=i[8],_=r[0],m=r[3],d=r[6],y=r[1],S=r[4],T=r[7],b=r[2],A=r[5],C=r[8];return s[0]=o*_+a*y+l*b,s[3]=o*m+a*S+l*A,s[6]=o*d+a*T+l*C,s[1]=c*_+u*y+f*b,s[4]=c*m+u*S+f*A,s[7]=c*d+u*T+f*C,s[2]=h*_+p*y+g*b,s[5]=h*m+p*S+g*A,s[8]=h*d+p*T+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=u*o-a*c,h=a*l-u*s,p=c*s-o*l,g=t*f+i*h+r*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=f*_,e[1]=(r*c-u*i)*_,e[2]=(a*i-r*o)*_,e[3]=h*_,e[4]=(u*t-r*l)*_,e[5]=(r*s-a*t)*_,e[6]=p*_,e[7]=(i*l-c*t)*_,e[8]=(o*t-i*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(eo.makeScale(e,t)),this}rotate(e){return this.premultiply(eo.makeRotation(-e)),this}translate(e,t){return this.premultiply(eo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const eo=new We,Vc=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zc=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function h_(){const n={enabled:!0,workingColorSpace:Gi,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===it&&(r.r=An(r.r),r.g=An(r.g),r.b=An(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===it&&(r.r=Ni(r.r),r.g=Ni(r.g),r.b=Ni(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Gn?Es:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Ar("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Ar("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Gi]:{primaries:e,whitePoint:i,transfer:Es,toXYZ:Vc,fromXYZ:zc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Wt},outputColorSpaceConfig:{drawingBufferColorSpace:Wt}},[Wt]:{primaries:e,whitePoint:i,transfer:it,toXYZ:Vc,fromXYZ:zc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Wt}}}),n}const Ze=h_();function An(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ni(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let vi;class d_{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{vi===void 0&&(vi=bs("canvas")),vi.width=e.width,vi.height=e.height;const r=vi.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=vi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=bs("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=An(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(An(t[i]/255)*255):t[i]=An(t[i]);return{data:t,width:e.width,height:e.height}}else return Ge("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let p_=0;class wl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:p_++}),this.uuid=Lr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(to(r[o].image)):s.push(to(r[o]))}else s=to(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function to(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?d_.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ge("Texture: Unable to serialize Texture."),{})}let m_=0;const no=new G;class Pt extends Ki{constructor(e=Pt.DEFAULT_IMAGE,t=Pt.DEFAULT_MAPPING,i=yn,r=yn,s=St,o=ci,a=qt,l=Xt,c=Pt.DEFAULT_ANISOTROPY,u=Gn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:m_++}),this.uuid=Lr(),this.name="",this.source=new wl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Qe(0,0),this.repeat=new Qe(1,1),this.center=new Qe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(no).x}get height(){return this.source.getSize(no).y}get depth(){return this.source.getSize(no).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ge(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Ge(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Jf)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ra:e.x=e.x-Math.floor(e.x);break;case yn:e.x=e.x<0?0:1;break;case sa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ra:e.y=e.y-Math.floor(e.y);break;case yn:e.y=e.y<0?0:1;break;case sa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Pt.DEFAULT_IMAGE=null;Pt.DEFAULT_MAPPING=Jf;Pt.DEFAULT_ANISOTROPY=1;class dt{constructor(e=0,t=0,i=0,r=1){dt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],f=l[8],h=l[1],p=l[5],g=l[9],_=l[2],m=l[6],d=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(c+1)/2,T=(p+1)/2,b=(d+1)/2,A=(u+h)/4,C=(f+_)/4,P=(g+m)/4;return S>T&&S>b?S<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(S),r=A/i,s=C/i):T>b?T<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(T),i=A/r,s=P/r):b<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(b),i=C/s,r=P/s),this.set(i,r,s,t),this}let y=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(h-u)*(h-u));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(f-_)/y,this.z=(h-u)/y,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class g_ extends Ki{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:St,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new dt(0,0,e,t),this.scissorTest=!1,this.viewport=new dt(0,0,e,t);const r={width:e,height:t,depth:i.depth},s=new Pt(r);this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:St,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new wl(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class rn extends g_{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class ah extends Pt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=yt,this.minFilter=yt,this.wrapR=yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class __ extends Pt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=yt,this.minFilter=yt,this.wrapR=yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Fr{constructor(e=new G(1/0,1/0,1/0),t=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Zt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Zt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Zt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Zt):Zt.fromBufferAttribute(s,o),Zt.applyMatrix4(e.matrixWorld),this.expandByPoint(Zt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Gr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Gr.copy(i.boundingBox)),Gr.applyMatrix4(e.matrixWorld),this.union(Gr)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Zt),Zt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(tr),Hr.subVectors(this.max,tr),xi.subVectors(e.a,tr),Si.subVectors(e.b,tr),Mi.subVectors(e.c,tr),Fn.subVectors(Si,xi),Nn.subVectors(Mi,Si),Jn.subVectors(xi,Mi);let t=[0,-Fn.z,Fn.y,0,-Nn.z,Nn.y,0,-Jn.z,Jn.y,Fn.z,0,-Fn.x,Nn.z,0,-Nn.x,Jn.z,0,-Jn.x,-Fn.y,Fn.x,0,-Nn.y,Nn.x,0,-Jn.y,Jn.x,0];return!io(t,xi,Si,Mi,Hr)||(t=[1,0,0,0,1,0,0,0,1],!io(t,xi,Si,Mi,Hr))?!1:(Wr.crossVectors(Fn,Nn),t=[Wr.x,Wr.y,Wr.z],io(t,xi,Si,Mi,Hr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Zt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Zt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(mn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const mn=[new G,new G,new G,new G,new G,new G,new G,new G],Zt=new G,Gr=new Fr,xi=new G,Si=new G,Mi=new G,Fn=new G,Nn=new G,Jn=new G,tr=new G,Hr=new G,Wr=new G,Qn=new G;function io(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){Qn.fromArray(n,s);const a=r.x*Math.abs(Qn.x)+r.y*Math.abs(Qn.y)+r.z*Math.abs(Qn.z),l=e.dot(Qn),c=t.dot(Qn),u=i.dot(Qn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const v_=new Fr,nr=new G,ro=new G;class Cl{constructor(e=new G,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):v_.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;nr.subVectors(e,this.center);const t=nr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(nr,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ro.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(nr.copy(e.center).add(ro)),this.expandByPoint(nr.copy(e.center).sub(ro))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const gn=new G,so=new G,Xr=new G,Un=new G,oo=new G,qr=new G,ao=new G;class x_{constructor(e=new G,t=new G(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,gn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=gn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(gn.copy(this.origin).addScaledVector(this.direction,t),gn.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){so.copy(e).add(t).multiplyScalar(.5),Xr.copy(t).sub(e).normalize(),Un.copy(this.origin).sub(so);const s=e.distanceTo(t)*.5,o=-this.direction.dot(Xr),a=Un.dot(this.direction),l=-Un.dot(Xr),c=Un.lengthSq(),u=Math.abs(1-o*o);let f,h,p,g;if(u>0)if(f=o*l-a,h=o*a-l,g=s*u,f>=0)if(h>=-g)if(h<=g){const _=1/u;f*=_,h*=_,p=f*(f+o*h+2*a)+h*(o*f+h+2*l)+c}else h=s,f=Math.max(0,-(o*h+a)),p=-f*f+h*(h+2*l)+c;else h=-s,f=Math.max(0,-(o*h+a)),p=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-o*s+a)),h=f>0?-s:Math.min(Math.max(-s,-l),s),p=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-s,-l),s),p=h*(h+2*l)+c):(f=Math.max(0,-(o*s+a)),h=f>0?s:Math.min(Math.max(-s,-l),s),p=-f*f+h*(h+2*l)+c);else h=o>0?-s:s,f=Math.max(0,-(o*h+a)),p=-f*f+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(so).addScaledVector(Xr,h),p}intersectSphere(e,t){gn.subVectors(e.center,this.origin);const i=gn.dot(this.direction),r=gn.dot(gn)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),f>=0?(a=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(a=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,gn)!==null}intersectTriangle(e,t,i,r,s){oo.subVectors(t,e),qr.subVectors(i,e),ao.crossVectors(oo,qr);let o=this.direction.dot(ao),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Un.subVectors(this.origin,e);const l=a*this.direction.dot(qr.crossVectors(Un,qr));if(l<0)return null;const c=a*this.direction.dot(oo.cross(Un));if(c<0||l+c>o)return null;const u=-a*Un.dot(ao);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class gt{constructor(e,t,i,r,s,o,a,l,c,u,f,h,p,g,_,m){gt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,f,h,p,g,_,m)}set(e,t,i,r,s,o,a,l,c,u,f,h,p,g,_,m){const d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=r,d[1]=s,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=u,d[10]=f,d[14]=h,d[3]=p,d[7]=g,d[11]=_,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new gt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,r=1/yi.setFromMatrixColumn(e,0).length(),s=1/yi.setFromMatrixColumn(e,1).length(),o=1/yi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const h=o*u,p=o*f,g=a*u,_=a*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=p+g*c,t[5]=h-_*c,t[9]=-a*l,t[2]=_-h*c,t[6]=g+p*c,t[10]=o*l}else if(e.order==="YXZ"){const h=l*u,p=l*f,g=c*u,_=c*f;t[0]=h+_*a,t[4]=g*a-p,t[8]=o*c,t[1]=o*f,t[5]=o*u,t[9]=-a,t[2]=p*a-g,t[6]=_+h*a,t[10]=o*l}else if(e.order==="ZXY"){const h=l*u,p=l*f,g=c*u,_=c*f;t[0]=h-_*a,t[4]=-o*f,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*u,t[9]=_-h*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const h=o*u,p=o*f,g=a*u,_=a*f;t[0]=l*u,t[4]=g*c-p,t[8]=h*c+_,t[1]=l*f,t[5]=_*c+h,t[9]=p*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const h=o*l,p=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=_-h*f,t[8]=g*f+p,t[1]=f,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=p*f+g,t[10]=h-_*f}else if(e.order==="XZY"){const h=o*l,p=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=h*f+_,t[5]=o*u,t[9]=p*f-g,t[2]=g*f-p,t[6]=a*u,t[10]=_*f+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(S_,e,M_)}lookAt(e,t,i){const r=this.elements;return Ot.subVectors(e,t),Ot.lengthSq()===0&&(Ot.z=1),Ot.normalize(),On.crossVectors(i,Ot),On.lengthSq()===0&&(Math.abs(i.z)===1?Ot.x+=1e-4:Ot.z+=1e-4,Ot.normalize(),On.crossVectors(i,Ot)),On.normalize(),Yr.crossVectors(Ot,On),r[0]=On.x,r[4]=Yr.x,r[8]=Ot.x,r[1]=On.y,r[5]=Yr.y,r[9]=Ot.y,r[2]=On.z,r[6]=Yr.z,r[10]=Ot.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],f=i[5],h=i[9],p=i[13],g=i[2],_=i[6],m=i[10],d=i[14],y=i[3],S=i[7],T=i[11],b=i[15],A=r[0],C=r[4],P=r[8],x=r[12],M=r[1],R=r[5],O=r[9],I=r[13],F=r[2],V=r[6],z=r[10],B=r[14],W=r[3],K=r[7],Q=r[11],ee=r[15];return s[0]=o*A+a*M+l*F+c*W,s[4]=o*C+a*R+l*V+c*K,s[8]=o*P+a*O+l*z+c*Q,s[12]=o*x+a*I+l*B+c*ee,s[1]=u*A+f*M+h*F+p*W,s[5]=u*C+f*R+h*V+p*K,s[9]=u*P+f*O+h*z+p*Q,s[13]=u*x+f*I+h*B+p*ee,s[2]=g*A+_*M+m*F+d*W,s[6]=g*C+_*R+m*V+d*K,s[10]=g*P+_*O+m*z+d*Q,s[14]=g*x+_*I+m*B+d*ee,s[3]=y*A+S*M+T*F+b*W,s[7]=y*C+S*R+T*V+b*K,s[11]=y*P+S*O+T*z+b*Q,s[15]=y*x+S*I+T*B+b*ee,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],f=e[6],h=e[10],p=e[14],g=e[3],_=e[7],m=e[11],d=e[15],y=l*p-c*h,S=a*p-c*f,T=a*h-l*f,b=o*p-c*u,A=o*h-l*u,C=o*f-a*u;return t*(_*y-m*S+d*T)-i*(g*y-m*b+d*A)+r*(g*S-_*b+d*C)-s*(g*T-_*A+m*C)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=e[9],h=e[10],p=e[11],g=e[12],_=e[13],m=e[14],d=e[15],y=f*m*c-_*h*c+_*l*p-a*m*p-f*l*d+a*h*d,S=g*h*c-u*m*c-g*l*p+o*m*p+u*l*d-o*h*d,T=u*_*c-g*f*c+g*a*p-o*_*p-u*a*d+o*f*d,b=g*f*l-u*_*l-g*a*h+o*_*h+u*a*m-o*f*m,A=t*y+i*S+r*T+s*b;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/A;return e[0]=y*C,e[1]=(_*h*s-f*m*s-_*r*p+i*m*p+f*r*d-i*h*d)*C,e[2]=(a*m*s-_*l*s+_*r*c-i*m*c-a*r*d+i*l*d)*C,e[3]=(f*l*s-a*h*s-f*r*c+i*h*c+a*r*p-i*l*p)*C,e[4]=S*C,e[5]=(u*m*s-g*h*s+g*r*p-t*m*p-u*r*d+t*h*d)*C,e[6]=(g*l*s-o*m*s-g*r*c+t*m*c+o*r*d-t*l*d)*C,e[7]=(o*h*s-u*l*s+u*r*c-t*h*c-o*r*p+t*l*p)*C,e[8]=T*C,e[9]=(g*f*s-u*_*s-g*i*p+t*_*p+u*i*d-t*f*d)*C,e[10]=(o*_*s-g*a*s+g*i*c-t*_*c-o*i*d+t*a*d)*C,e[11]=(u*a*s-o*f*s-u*i*c+t*f*c+o*i*p-t*a*p)*C,e[12]=b*C,e[13]=(u*_*r-g*f*r+g*i*h-t*_*h-u*i*m+t*f*m)*C,e[14]=(g*a*r-o*_*r-g*i*l+t*_*l+o*i*m-t*a*m)*C,e[15]=(o*f*r-u*a*r+u*i*l-t*f*l-o*i*h+t*a*h)*C,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,f=a+a,h=s*c,p=s*u,g=s*f,_=o*u,m=o*f,d=a*f,y=l*c,S=l*u,T=l*f,b=i.x,A=i.y,C=i.z;return r[0]=(1-(_+d))*b,r[1]=(p+T)*b,r[2]=(g-S)*b,r[3]=0,r[4]=(p-T)*A,r[5]=(1-(h+d))*A,r[6]=(m+y)*A,r[7]=0,r[8]=(g+S)*C,r[9]=(m-y)*C,r[10]=(1-(h+_))*C,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;if(e.x=r[12],e.y=r[13],e.z=r[14],this.determinant()===0)return i.set(1,1,1),t.identity(),this;let s=yi.set(r[0],r[1],r[2]).length();const o=yi.set(r[4],r[5],r[6]).length(),a=yi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),jt.copy(this);const c=1/s,u=1/o,f=1/a;return jt.elements[0]*=c,jt.elements[1]*=c,jt.elements[2]*=c,jt.elements[4]*=u,jt.elements[5]*=u,jt.elements[6]*=u,jt.elements[8]*=f,jt.elements[9]*=f,jt.elements[10]*=f,t.setFromRotationMatrix(jt),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=cn,l=!1){const c=this.elements,u=2*s/(t-e),f=2*s/(i-r),h=(t+e)/(t-e),p=(i+r)/(i-r);let g,_;if(l)g=s/(o-s),_=o*s/(o-s);else if(a===cn)g=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===Ts)g=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=cn,l=!1){const c=this.elements,u=2/(t-e),f=2/(i-r),h=-(t+e)/(t-e),p=-(i+r)/(i-r);let g,_;if(l)g=1/(o-s),_=o/(o-s);else if(a===cn)g=-2/(o-s),_=-(o+s)/(o-s);else if(a===Ts)g=-1/(o-s),_=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const yi=new G,jt=new gt,S_=new G(0,0,0),M_=new G(1,1,1),On=new G,Yr=new G,Ot=new G,kc=new gt,Gc=new Ir;class Dn{constructor(e=0,t=0,i=0,r=Dn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],f=r[2],h=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(Ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ke(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ke(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:Ge("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return kc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(kc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Gc.setFromEuler(this),this.setFromQuaternion(Gc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Dn.DEFAULT_ORDER="XYZ";class lh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let y_=0;const Hc=new G,Ei=new Ir,_n=new gt,$r=new G,ir=new G,E_=new G,T_=new Ir,Wc=new G(1,0,0),Xc=new G(0,1,0),qc=new G(0,0,1),Yc={type:"added"},b_={type:"removed"},Ti={type:"childadded",child:null},lo={type:"childremoved",child:null};class zt extends Ki{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:y_++}),this.uuid=Lr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=zt.DEFAULT_UP.clone();const e=new G,t=new Dn,i=new Ir,r=new G(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new gt},normalMatrix:{value:new We}}),this.matrix=new gt,this.matrixWorld=new gt,this.matrixAutoUpdate=zt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new lh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ei.setFromAxisAngle(e,t),this.quaternion.multiply(Ei),this}rotateOnWorldAxis(e,t){return Ei.setFromAxisAngle(e,t),this.quaternion.premultiply(Ei),this}rotateX(e){return this.rotateOnAxis(Wc,e)}rotateY(e){return this.rotateOnAxis(Xc,e)}rotateZ(e){return this.rotateOnAxis(qc,e)}translateOnAxis(e,t){return Hc.copy(e).applyQuaternion(this.quaternion),this.position.add(Hc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Wc,e)}translateY(e){return this.translateOnAxis(Xc,e)}translateZ(e){return this.translateOnAxis(qc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(_n.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?$r.copy(e):$r.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ir.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_n.lookAt(ir,$r,this.up):_n.lookAt($r,ir,this.up),this.quaternion.setFromRotationMatrix(_n),r&&(_n.extractRotation(r.matrixWorld),Ei.setFromRotationMatrix(_n),this.quaternion.premultiply(Ei.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Je("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Yc),Ti.child=e,this.dispatchEvent(Ti),Ti.child=null):Je("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(b_),lo.child=e,this.dispatchEvent(lo),lo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),_n.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),_n.multiply(e.parent.matrixWorld)),e.applyMatrix4(_n),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Yc),Ti.child=e,this.dispatchEvent(Ti),Ti.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ir,e,E_),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ir,T_,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),f=o(e.shapes),h=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}zt.DEFAULT_UP=new G(0,1,0);zt.DEFAULT_MATRIX_AUTO_UPDATE=!0;zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Jt=new G,vn=new G,co=new G,xn=new G,bi=new G,Ai=new G,$c=new G,uo=new G,fo=new G,ho=new G,po=new dt,mo=new dt,go=new dt;class en{constructor(e=new G,t=new G,i=new G){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Jt.subVectors(e,t),r.cross(Jt);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){Jt.subVectors(r,t),vn.subVectors(i,t),co.subVectors(e,t);const o=Jt.dot(Jt),a=Jt.dot(vn),l=Jt.dot(co),c=vn.dot(vn),u=vn.dot(co),f=o*c-a*a;if(f===0)return s.set(0,0,0),null;const h=1/f,p=(c*l-a*u)*h,g=(o*u-a*l)*h;return s.set(1-p-g,g,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,xn)===null?!1:xn.x>=0&&xn.y>=0&&xn.x+xn.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,xn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,xn.x),l.addScaledVector(o,xn.y),l.addScaledVector(a,xn.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return po.setScalar(0),mo.setScalar(0),go.setScalar(0),po.fromBufferAttribute(e,t),mo.fromBufferAttribute(e,i),go.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(po,s.x),o.addScaledVector(mo,s.y),o.addScaledVector(go,s.z),o}static isFrontFacing(e,t,i,r){return Jt.subVectors(i,t),vn.subVectors(e,t),Jt.cross(vn).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Jt.subVectors(this.c,this.b),vn.subVectors(this.a,this.b),Jt.cross(vn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return en.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return en.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return en.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return en.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return en.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;bi.subVectors(r,i),Ai.subVectors(s,i),uo.subVectors(e,i);const l=bi.dot(uo),c=Ai.dot(uo);if(l<=0&&c<=0)return t.copy(i);fo.subVectors(e,r);const u=bi.dot(fo),f=Ai.dot(fo);if(u>=0&&f<=u)return t.copy(r);const h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(bi,o);ho.subVectors(e,s);const p=bi.dot(ho),g=Ai.dot(ho);if(g>=0&&p<=g)return t.copy(s);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(i).addScaledVector(Ai,a);const m=u*g-p*f;if(m<=0&&f-u>=0&&p-g>=0)return $c.subVectors(s,r),a=(f-u)/(f-u+(p-g)),t.copy(r).addScaledVector($c,a);const d=1/(m+_+h);return o=_*d,a=h*d,t.copy(i).addScaledVector(bi,o).addScaledVector(Ai,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const ch={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bn={h:0,s:0,l:0},Kr={h:0,s:0,l:0};function _o(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class ot{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Wt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ze.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=Ze.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ze.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=Ze.workingColorSpace){if(e=f_(e,1),t=Ke(t,0,1),i=Ke(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=_o(o,s,e+1/3),this.g=_o(o,s,e),this.b=_o(o,s,e-1/3)}return Ze.colorSpaceToWorking(this,r),this}setStyle(e,t=Wt){function i(s){s!==void 0&&parseFloat(s)<1&&Ge("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ge("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);Ge("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Wt){const i=ch[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ge("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=An(e.r),this.g=An(e.g),this.b=An(e.b),this}copyLinearToSRGB(e){return this.r=Ni(e.r),this.g=Ni(e.g),this.b=Ni(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Wt){return Ze.workingToColorSpace(Tt.copy(this),e),Math.round(Ke(Tt.r*255,0,255))*65536+Math.round(Ke(Tt.g*255,0,255))*256+Math.round(Ke(Tt.b*255,0,255))}getHexString(e=Wt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ze.workingColorSpace){Ze.workingToColorSpace(Tt.copy(this),t);const i=Tt.r,r=Tt.g,s=Tt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const f=o-a;switch(c=u<=.5?f/(o+a):f/(2-o-a),o){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Ze.workingColorSpace){return Ze.workingToColorSpace(Tt.copy(this),t),e.r=Tt.r,e.g=Tt.g,e.b=Tt.b,e}getStyle(e=Wt){Ze.workingToColorSpace(Tt.copy(this),e);const t=Tt.r,i=Tt.g,r=Tt.b;return e!==Wt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Bn),this.setHSL(Bn.h+e,Bn.s+t,Bn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Bn),e.getHSL(Kr);const i=Js(Bn.h,Kr.h,t),r=Js(Bn.s,Kr.s,t),s=Js(Bn.l,Kr.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Tt=new ot;ot.NAMES=ch;let A_=0;class Ds extends Ki{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:A_++}),this.uuid=Lr(),this.name="",this.type="Material",this.blending=Fi,this.side=Yn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Yo,this.blendDst=$o,this.blendEquation=si,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ot(0,0,0),this.blendAlpha=0,this.depthFunc=Vi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ic,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_i,this.stencilZFail=_i,this.stencilZPass=_i,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ge(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Ge(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Fi&&(i.blending=this.blending),this.side!==Yn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Yo&&(i.blendSrc=this.blendSrc),this.blendDst!==$o&&(i.blendDst=this.blendDst),this.blendEquation!==si&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Vi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ic&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==_i&&(i.stencilFail=this.stencilFail),this.stencilZFail!==_i&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==_i&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class uh extends Ds{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dn,this.combine=Wf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const pt=new G,Zr=new Qe;let w_=0;class fn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:w_++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Fc,this.updateRanges=[],this.gpuType=ln,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Zr.fromBufferAttribute(this,t),Zr.applyMatrix3(e),this.setXY(t,Zr.x,Zr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix3(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix4(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.applyNormalMatrix(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.transformDirection(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=er(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=It(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=er(t,this.array)),t}setX(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=er(t,this.array)),t}setY(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=er(t,this.array)),t}setZ(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=er(t,this.array)),t}setW(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),i=It(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),i=It(i,this.array),r=It(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),i=It(i,this.array),r=It(r,this.array),s=It(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Fc&&(e.usage=this.usage),e}}class fh extends fn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class hh extends fn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class wn extends fn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let C_=0;const Ht=new gt,vo=new zt,wi=new G,Bt=new Fr,rr=new Fr,xt=new G;class Ln extends Ki{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:C_++}),this.uuid=Lr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(oh(e)?hh:fh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new We().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ht.makeRotationFromQuaternion(e),this.applyMatrix4(Ht),this}rotateX(e){return Ht.makeRotationX(e),this.applyMatrix4(Ht),this}rotateY(e){return Ht.makeRotationY(e),this.applyMatrix4(Ht),this}rotateZ(e){return Ht.makeRotationZ(e),this.applyMatrix4(Ht),this}translate(e,t,i){return Ht.makeTranslation(e,t,i),this.applyMatrix4(Ht),this}scale(e,t,i){return Ht.makeScale(e,t,i),this.applyMatrix4(Ht),this}lookAt(e){return vo.lookAt(e),vo.updateMatrix(),this.applyMatrix4(vo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(wi).negate(),this.translate(wi.x,wi.y,wi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new wn(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Ge("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Fr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Bt.setFromBufferAttribute(s),this.morphTargetsRelative?(xt.addVectors(this.boundingBox.min,Bt.min),this.boundingBox.expandByPoint(xt),xt.addVectors(this.boundingBox.max,Bt.max),this.boundingBox.expandByPoint(xt)):(this.boundingBox.expandByPoint(Bt.min),this.boundingBox.expandByPoint(Bt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Je('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Cl);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(e){const i=this.boundingSphere.center;if(Bt.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];rr.setFromBufferAttribute(a),this.morphTargetsRelative?(xt.addVectors(Bt.min,rr.min),Bt.expandByPoint(xt),xt.addVectors(Bt.max,rr.max),Bt.expandByPoint(xt)):(Bt.expandByPoint(rr.min),Bt.expandByPoint(rr.max))}Bt.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)xt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(xt));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)xt.fromBufferAttribute(a,c),l&&(wi.fromBufferAttribute(e,c),xt.add(wi)),r=Math.max(r,i.distanceToSquared(xt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Je('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Je("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new fn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<i.count;P++)a[P]=new G,l[P]=new G;const c=new G,u=new G,f=new G,h=new Qe,p=new Qe,g=new Qe,_=new G,m=new G;function d(P,x,M){c.fromBufferAttribute(i,P),u.fromBufferAttribute(i,x),f.fromBufferAttribute(i,M),h.fromBufferAttribute(s,P),p.fromBufferAttribute(s,x),g.fromBufferAttribute(s,M),u.sub(c),f.sub(c),p.sub(h),g.sub(h);const R=1/(p.x*g.y-g.x*p.y);isFinite(R)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(f,-p.y).multiplyScalar(R),m.copy(f).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(R),a[P].add(_),a[x].add(_),a[M].add(_),l[P].add(m),l[x].add(m),l[M].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let P=0,x=y.length;P<x;++P){const M=y[P],R=M.start,O=M.count;for(let I=R,F=R+O;I<F;I+=3)d(e.getX(I+0),e.getX(I+1),e.getX(I+2))}const S=new G,T=new G,b=new G,A=new G;function C(P){b.fromBufferAttribute(r,P),A.copy(b);const x=a[P];S.copy(x),S.sub(b.multiplyScalar(b.dot(x))).normalize(),T.crossVectors(A,x);const R=T.dot(l[P])<0?-1:1;o.setXYZW(P,S.x,S.y,S.z,R)}for(let P=0,x=y.length;P<x;++P){const M=y[P],R=M.start,O=M.count;for(let I=R,F=R+O;I<F;I+=3)C(e.getX(I+0)),C(e.getX(I+1)),C(e.getX(I+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new fn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,p=i.count;h<p;h++)i.setXYZ(h,0,0,0);const r=new G,s=new G,o=new G,a=new G,l=new G,c=new G,u=new G,f=new G;if(e)for(let h=0,p=e.count;h<p;h+=3){const g=e.getX(h+0),_=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,p=t.count;h<p;h+=3)r.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)xt.fromBufferAttribute(e,t),xt.normalize(),e.setXYZ(t,xt.x,xt.y,xt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,f=a.normalized,h=new c.constructor(l.length*u);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*u;for(let d=0;d<u;d++)h[g++]=c[p++]}return new fn(h,u,f)}if(this.index===null)return Ge("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ln,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,f=c.length;u<f;u++){const h=c[u],p=e(h,i);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){const p=c[f];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],f=s[c];for(let h=0,p=f.length;h<p;h++)u.push(f[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Kc=new gt,ei=new x_,jr=new Cl,Zc=new G,Jr=new G,Qr=new G,es=new G,xo=new G,ts=new G,jc=new G,ns=new G;class Kt extends zt{constructor(e=new Ln,t=new uh){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){ts.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],f=s[l];u!==0&&(xo.fromBufferAttribute(f,e),o?ts.addScaledVector(xo,u):ts.addScaledVector(xo.sub(t),u))}t.add(ts)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),jr.copy(i.boundingSphere),jr.applyMatrix4(s),ei.copy(e.ray).recast(e.near),!(jr.containsPoint(ei.origin)===!1&&(ei.intersectSphere(jr,Zc)===null||ei.origin.distanceToSquared(Zc)>(e.far-e.near)**2))&&(Kc.copy(s).invert(),ei.copy(e.ray).applyMatrix4(Kc),!(i.boundingBox!==null&&ei.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ei)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,h=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],d=o[m.materialIndex],y=Math.max(m.start,p.start),S=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let T=y,b=S;T<b;T+=3){const A=a.getX(T),C=a.getX(T+1),P=a.getX(T+2);r=is(this,d,e,i,c,u,f,A,C,P),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){const y=a.getX(m),S=a.getX(m+1),T=a.getX(m+2);r=is(this,o,e,i,c,u,f,y,S,T),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],d=o[m.materialIndex],y=Math.max(m.start,p.start),S=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let T=y,b=S;T<b;T+=3){const A=T,C=T+1,P=T+2;r=is(this,d,e,i,c,u,f,A,C,P),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){const y=m,S=m+1,T=m+2;r=is(this,o,e,i,c,u,f,y,S,T),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function R_(n,e,t,i,r,s,o,a){let l;if(e.side===Ft?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===Yn,a),l===null)return null;ns.copy(a),ns.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(ns);return c<t.near||c>t.far?null:{distance:c,point:ns.clone(),object:n}}function is(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,Jr),n.getVertexPosition(l,Qr),n.getVertexPosition(c,es);const u=R_(n,e,t,i,Jr,Qr,es,jc);if(u){const f=new G;en.getBarycoord(jc,Jr,Qr,es,f),r&&(u.uv=en.getInterpolatedAttribute(r,a,l,c,f,new Qe)),s&&(u.uv1=en.getInterpolatedAttribute(s,a,l,c,f,new Qe)),o&&(u.normal=en.getInterpolatedAttribute(o,a,l,c,f,new G),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:l,c,normal:new G,materialIndex:0};en.getNormal(Jr,Qr,es,h.normal),u.face=h,u.barycoord=f}return u}class Nr extends Ln{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],f=[];let h=0,p=0;g("z","y","x",-1,-1,i,t,e,o,s,0),g("z","y","x",1,-1,i,t,-e,o,s,1),g("x","z","y",1,1,e,i,t,r,o,2),g("x","z","y",1,-1,e,i,-t,r,o,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new wn(c,3)),this.setAttribute("normal",new wn(u,3)),this.setAttribute("uv",new wn(f,2));function g(_,m,d,y,S,T,b,A,C,P,x){const M=T/C,R=b/P,O=T/2,I=b/2,F=A/2,V=C+1,z=P+1;let B=0,W=0;const K=new G;for(let Q=0;Q<z;Q++){const ee=Q*R-I;for(let $=0;$<V;$++){const ie=$*M-O;K[_]=ie*y,K[m]=ee*S,K[d]=F,c.push(K.x,K.y,K.z),K[_]=0,K[m]=0,K[d]=A>0?1:-1,u.push(K.x,K.y,K.z),f.push($/C),f.push(1-Q/P),B+=1}}for(let Q=0;Q<P;Q++)for(let ee=0;ee<C;ee++){const $=h+ee+V*Q,ie=h+ee+V*(Q+1),de=h+(ee+1)+V*(Q+1),Ne=h+(ee+1)+V*Q;l.push($,ie,Ne),l.push(ie,de,Ne),W+=6}a.addGroup(p,W,x),p+=W,h+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Hi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(Ge("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function wt(n){const e={};for(let t=0;t<n.length;t++){const i=Hi(n[t]);for(const r in i)e[r]=i[r]}return e}function P_(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function dh(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ze.workingColorSpace}const D_={clone:Hi,merge:wt};var L_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,I_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class kt extends Ds{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=L_,this.fragmentShader=I_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Hi(e.uniforms),this.uniformsGroups=P_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class ph extends zt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new gt,this.projectionMatrix=new gt,this.projectionMatrixInverse=new gt,this.coordinateSystem=cn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Vn=new G,Jc=new Qe,Qc=new Qe;class Qt extends ph{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ba*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(js*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ba*2*Math.atan(Math.tan(js*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Vn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Vn.x,Vn.y).multiplyScalar(-e/Vn.z),Vn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Vn.x,Vn.y).multiplyScalar(-e/Vn.z)}getViewSize(e,t){return this.getViewBounds(e,Jc,Qc),t.subVectors(Qc,Jc)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(js*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ci=-90,Ri=1;class F_ extends zt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Qt(Ci,Ri,e,t);r.layers=this.layers,this.add(r);const s=new Qt(Ci,Ri,e,t);s.layers=this.layers,this.add(s);const o=new Qt(Ci,Ri,e,t);o.layers=this.layers,this.add(o);const a=new Qt(Ci,Ri,e,t);a.layers=this.layers,this.add(a);const l=new Qt(Ci,Ri,e,t);l.layers=this.layers,this.add(l);const c=new Qt(Ci,Ri,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===cn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ts)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(f,h,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class mh extends Pt{constructor(e=[],t=mi,i,r,s,o,a,l,c,u){super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class gh extends rn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new mh(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Nr(5,5,5),s=new kt({name:"CubemapFromEquirect",uniforms:Hi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ft,blending:bn});s.uniforms.tEquirect.value=t;const o=new Kt(r,s),a=t.minFilter;return t.minFilter===ci&&(t.minFilter=St),new F_(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}class rs extends zt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const N_={type:"move"};class So{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new rs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new rs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new rs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,i),d=this._getHandJoint(c,_);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),p=.02,g=.005;c.inputState.pinching&&h>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(N_)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new rs;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class eu extends zt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Dn,this.environmentIntensity=1,this.environmentRotation=new Dn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class U_ extends Pt{constructor(e=null,t=1,i=1,r,s,o,a,l,c=yt,u=yt,f,h){super(null,o,a,l,c,u,r,s,f,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Mo=new G,O_=new G,B_=new We;class ri{constructor(e=new G(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Mo.subVectors(i,t).cross(O_.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Mo),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||B_.getNormalMatrix(e),r=this.coplanarPoint(Mo).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ti=new Cl,V_=new Qe(.5,.5),ss=new G;class _h{constructor(e=new ri,t=new ri,i=new ri,r=new ri,s=new ri,o=new ri){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=cn,i=!1){const r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],f=s[5],h=s[6],p=s[7],g=s[8],_=s[9],m=s[10],d=s[11],y=s[12],S=s[13],T=s[14],b=s[15];if(r[0].setComponents(c-o,p-u,d-g,b-y).normalize(),r[1].setComponents(c+o,p+u,d+g,b+y).normalize(),r[2].setComponents(c+a,p+f,d+_,b+S).normalize(),r[3].setComponents(c-a,p-f,d-_,b-S).normalize(),i)r[4].setComponents(l,h,m,T).normalize(),r[5].setComponents(c-l,p-h,d-m,b-T).normalize();else if(r[4].setComponents(c-l,p-h,d-m,b-T).normalize(),t===cn)r[5].setComponents(c+l,p+h,d+m,b+T).normalize();else if(t===Ts)r[5].setComponents(l,h,m,T).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ti.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ti.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ti)}intersectsSprite(e){ti.center.set(0,0,0);const t=V_.distanceTo(e.center);return ti.radius=.7071067811865476+t,ti.applyMatrix4(e.matrixWorld),this.intersectsSphere(ti)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(ss.x=r.normal.x>0?e.max.x:e.min.x,ss.y=r.normal.y>0?e.max.y:e.min.y,ss.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ss)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class wr extends Pt{constructor(e,t,i=hn,r,s,o,a=yt,l=yt,c,u=Pn,f=1){if(u!==Pn&&u!==ui)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:f};super(h,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new wl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class z_ extends wr{constructor(e,t=hn,i=mi,r,s,o=yt,a=yt,l,c=Pn){const u={width:e,height:e,depth:1},f=[u,u,u,u,u,u];super(e,e,t,i,r,s,o,a,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class vh extends Pt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ur extends Ln{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,f=e/a,h=t/l,p=[],g=[],_=[],m=[];for(let d=0;d<u;d++){const y=d*h-o;for(let S=0;S<c;S++){const T=S*f-s;g.push(T,-y,0),_.push(0,0,1),m.push(S/a),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let y=0;y<a;y++){const S=y+c*d,T=y+c*(d+1),b=y+1+c*(d+1),A=y+1+c*d;p.push(S,T,A),p.push(T,b,A)}this.setIndex(p),this.setAttribute("position",new wn(g,3)),this.setAttribute("normal",new wn(_,3)),this.setAttribute("uv",new wn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ur(e.width,e.height,e.widthSegments,e.heightSegments)}}class k_ extends kt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class G_ extends Ds{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=e_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class H_ extends Ds{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class As extends ph{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class W_ extends Qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class X_{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function tu(n,e,t,i){const r=q_(i);switch(t){case ih:return n*e;case sh:return n*e/r.components*r.byteLength;case yl:return n*e/r.components*r.byteLength;case ki:return n*e*2/r.components*r.byteLength;case El:return n*e*2/r.components*r.byteLength;case rh:return n*e*3/r.components*r.byteLength;case qt:return n*e*4/r.components*r.byteLength;case Tl:return n*e*4/r.components*r.byteLength;case ms:case gs:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case _s:case vs:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case aa:case ca:return Math.max(n,16)*Math.max(e,8)/4;case oa:case la:return Math.max(n,8)*Math.max(e,8)/2;case ua:case fa:case da:case pa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ha:case ma:case ga:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case _a:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case va:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case xa:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Sa:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ma:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case ya:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Ea:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Ta:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case ba:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Aa:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case wa:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Ca:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Ra:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Pa:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Da:case La:case Ia:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Fa:case Na:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Ua:case Oa:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function q_(n){switch(n){case Xt:case Qf:return{byteLength:1,components:1};case Tr:case eh:case dn:return{byteLength:2,components:1};case Sl:case Ml:return{byteLength:2,components:4};case hn:case xl:case ln:return{byteLength:4,components:1};case th:case nh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:vl}}));typeof window<"u"&&(window.__THREE__?Ge("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=vl);function xh(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function Y_(n){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,f=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function i(a,l,c){const u=l.array,f=l.updateRanges;if(n.bindBuffer(c,a),f.length===0)n.bufferSubData(c,0,u);else{f.sort((p,g)=>p.start-g.start);let h=0;for(let p=1;p<f.length;p++){const g=f[h],_=f[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,f[h]=_)}f.length=h+1;for(let p=0,g=f.length;p<g;p++){const _=f[p];n.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var $_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,K_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Z_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,j_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,J_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Q_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ev=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,tv=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,nv=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,iv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,rv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ov=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,av=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,lv=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,cv=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,uv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,fv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,hv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,pv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,mv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,gv=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,_v=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,vv=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,xv=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Sv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Mv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,yv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ev=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Tv="gl_FragColor = linearToOutputTexel( gl_FragColor );",bv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Av=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,wv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Cv=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Rv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Pv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Dv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Lv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Iv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Fv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Nv=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Uv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ov=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Bv=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Vv=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,zv=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,kv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Gv=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Wv=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Xv=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,qv=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Yv=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,$v=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Kv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Zv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,jv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ex=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,tx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,nx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ix=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,sx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ox=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ax=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,lx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cx=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ux=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,hx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,dx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,px=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,gx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,_x=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,vx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,xx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Sx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Mx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,yx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ex=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Tx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ax=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,wx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Cx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Px=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Dx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Lx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ix=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Fx=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Nx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ux=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Ox=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Bx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Vx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,zx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,kx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Gx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Hx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Wx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,qx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Yx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$x=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,eS=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,tS=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,nS=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,iS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,rS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sS=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,oS=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,aS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,lS=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cS=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,uS=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fS=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,hS=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dS=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,pS=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,mS=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gS=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_S=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,vS=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xS=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,SS=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,MS=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,yS=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ES=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,TS=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,bS=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,AS=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:$_,alphahash_pars_fragment:K_,alphamap_fragment:Z_,alphamap_pars_fragment:j_,alphatest_fragment:J_,alphatest_pars_fragment:Q_,aomap_fragment:ev,aomap_pars_fragment:tv,batching_pars_vertex:nv,batching_vertex:iv,begin_vertex:rv,beginnormal_vertex:sv,bsdfs:ov,iridescence_fragment:av,bumpmap_pars_fragment:lv,clipping_planes_fragment:cv,clipping_planes_pars_fragment:uv,clipping_planes_pars_vertex:fv,clipping_planes_vertex:hv,color_fragment:dv,color_pars_fragment:pv,color_pars_vertex:mv,color_vertex:gv,common:_v,cube_uv_reflection_fragment:vv,defaultnormal_vertex:xv,displacementmap_pars_vertex:Sv,displacementmap_vertex:Mv,emissivemap_fragment:yv,emissivemap_pars_fragment:Ev,colorspace_fragment:Tv,colorspace_pars_fragment:bv,envmap_fragment:Av,envmap_common_pars_fragment:wv,envmap_pars_fragment:Cv,envmap_pars_vertex:Rv,envmap_physical_pars_fragment:zv,envmap_vertex:Pv,fog_vertex:Dv,fog_pars_vertex:Lv,fog_fragment:Iv,fog_pars_fragment:Fv,gradientmap_pars_fragment:Nv,lightmap_pars_fragment:Uv,lights_lambert_fragment:Ov,lights_lambert_pars_fragment:Bv,lights_pars_begin:Vv,lights_toon_fragment:kv,lights_toon_pars_fragment:Gv,lights_phong_fragment:Hv,lights_phong_pars_fragment:Wv,lights_physical_fragment:Xv,lights_physical_pars_fragment:qv,lights_fragment_begin:Yv,lights_fragment_maps:$v,lights_fragment_end:Kv,logdepthbuf_fragment:Zv,logdepthbuf_pars_fragment:jv,logdepthbuf_pars_vertex:Jv,logdepthbuf_vertex:Qv,map_fragment:ex,map_pars_fragment:tx,map_particle_fragment:nx,map_particle_pars_fragment:ix,metalnessmap_fragment:rx,metalnessmap_pars_fragment:sx,morphinstance_vertex:ox,morphcolor_vertex:ax,morphnormal_vertex:lx,morphtarget_pars_vertex:cx,morphtarget_vertex:ux,normal_fragment_begin:fx,normal_fragment_maps:hx,normal_pars_fragment:dx,normal_pars_vertex:px,normal_vertex:mx,normalmap_pars_fragment:gx,clearcoat_normal_fragment_begin:_x,clearcoat_normal_fragment_maps:vx,clearcoat_pars_fragment:xx,iridescence_pars_fragment:Sx,opaque_fragment:Mx,packing:yx,premultiplied_alpha_fragment:Ex,project_vertex:Tx,dithering_fragment:bx,dithering_pars_fragment:Ax,roughnessmap_fragment:wx,roughnessmap_pars_fragment:Cx,shadowmap_pars_fragment:Rx,shadowmap_pars_vertex:Px,shadowmap_vertex:Dx,shadowmask_pars_fragment:Lx,skinbase_vertex:Ix,skinning_pars_vertex:Fx,skinning_vertex:Nx,skinnormal_vertex:Ux,specularmap_fragment:Ox,specularmap_pars_fragment:Bx,tonemapping_fragment:Vx,tonemapping_pars_fragment:zx,transmission_fragment:kx,transmission_pars_fragment:Gx,uv_pars_fragment:Hx,uv_pars_vertex:Wx,uv_vertex:Xx,worldpos_vertex:qx,background_vert:Yx,background_frag:$x,backgroundCube_vert:Kx,backgroundCube_frag:Zx,cube_vert:jx,cube_frag:Jx,depth_vert:Qx,depth_frag:eS,distance_vert:tS,distance_frag:nS,equirect_vert:iS,equirect_frag:rS,linedashed_vert:sS,linedashed_frag:oS,meshbasic_vert:aS,meshbasic_frag:lS,meshlambert_vert:cS,meshlambert_frag:uS,meshmatcap_vert:fS,meshmatcap_frag:hS,meshnormal_vert:dS,meshnormal_frag:pS,meshphong_vert:mS,meshphong_frag:gS,meshphysical_vert:_S,meshphysical_frag:vS,meshtoon_vert:xS,meshtoon_frag:SS,points_vert:MS,points_frag:yS,shadow_vert:ES,shadow_frag:TS,sprite_vert:bS,sprite_frag:AS},ve={common:{diffuse:{value:new ot(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new Qe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ot(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ot(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new ot(16777215)},opacity:{value:1},center:{value:new Qe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},an={basic:{uniforms:wt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:wt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new ot(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:wt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new ot(0)},specular:{value:new ot(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:wt([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new ot(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:wt([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new ot(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:wt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:wt([ve.points,ve.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:wt([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:wt([ve.common,ve.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:wt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:wt([ve.sprite,ve.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distance:{uniforms:wt([ve.common,ve.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distance_vert,fragmentShader:Xe.distance_frag},shadow:{uniforms:wt([ve.lights,ve.fog,{color:{value:new ot(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};an.physical={uniforms:wt([an.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new Qe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new ot(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new Qe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new ot(0)},specularColor:{value:new ot(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new Qe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const os={r:0,b:0,g:0},ni=new Dn,wS=new gt;function CS(n,e,t,i,r,s,o){const a=new ot(0);let l=s===!0?0:1,c,u,f=null,h=0,p=null;function g(S){let T=S.isScene===!0?S.background:null;return T&&T.isTexture&&(T=(S.backgroundBlurriness>0?t:e).get(T)),T}function _(S){let T=!1;const b=g(S);b===null?d(a,l):b&&b.isColor&&(d(b,1),T=!0);const A=n.xr.getEnvironmentBlendMode();A==="additive"?i.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||T)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(S,T){const b=g(T);b&&(b.isCubeTexture||b.mapping===Ps)?(u===void 0&&(u=new Kt(new Nr(1,1,1),new kt({name:"BackgroundCubeMaterial",uniforms:Hi(an.backgroundCube.uniforms),vertexShader:an.backgroundCube.vertexShader,fragmentShader:an.backgroundCube.fragmentShader,side:Ft,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(A,C,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),ni.copy(T.backgroundRotation),ni.x*=-1,ni.y*=-1,ni.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(ni.y*=-1,ni.z*=-1),u.material.uniforms.envMap.value=b,u.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(wS.makeRotationFromEuler(ni)),u.material.toneMapped=Ze.getTransfer(b.colorSpace)!==it,(f!==b||h!==b.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,f=b,h=b.version,p=n.toneMapping),u.layers.enableAll(),S.unshift(u,u.geometry,u.material,0,0,null)):b&&b.isTexture&&(c===void 0&&(c=new Kt(new Ur(2,2),new kt({name:"BackgroundMaterial",uniforms:Hi(an.background.uniforms),vertexShader:an.background.vertexShader,fragmentShader:an.background.fragmentShader,side:Yn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=b,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.toneMapped=Ze.getTransfer(b.colorSpace)!==it,b.matrixAutoUpdate===!0&&b.updateMatrix(),c.material.uniforms.uvTransform.value.copy(b.matrix),(f!==b||h!==b.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,f=b,h=b.version,p=n.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function d(S,T){S.getRGB(os,dh(n)),i.buffers.color.setClear(os.r,os.g,os.b,T,o)}function y(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,T=1){a.set(S),l=T,d(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,d(a,l)},render:_,addToRenderList:m,dispose:y}}function RS(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=h(null);let s=r,o=!1;function a(M,R,O,I,F){let V=!1;const z=f(I,O,R);s!==z&&(s=z,c(s.object)),V=p(M,I,O,F),V&&g(M,I,O,F),F!==null&&e.update(F,n.ELEMENT_ARRAY_BUFFER),(V||o)&&(o=!1,T(M,R,O,I),F!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function u(M){return n.deleteVertexArray(M)}function f(M,R,O){const I=O.wireframe===!0;let F=i[M.id];F===void 0&&(F={},i[M.id]=F);let V=F[R.id];V===void 0&&(V={},F[R.id]=V);let z=V[I];return z===void 0&&(z=h(l()),V[I]=z),z}function h(M){const R=[],O=[],I=[];for(let F=0;F<t;F++)R[F]=0,O[F]=0,I[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:O,attributeDivisors:I,object:M,attributes:{},index:null}}function p(M,R,O,I){const F=s.attributes,V=R.attributes;let z=0;const B=O.getAttributes();for(const W in B)if(B[W].location>=0){const Q=F[W];let ee=V[W];if(ee===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(ee=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(ee=M.instanceColor)),Q===void 0||Q.attribute!==ee||ee&&Q.data!==ee.data)return!0;z++}return s.attributesNum!==z||s.index!==I}function g(M,R,O,I){const F={},V=R.attributes;let z=0;const B=O.getAttributes();for(const W in B)if(B[W].location>=0){let Q=V[W];Q===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(Q=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(Q=M.instanceColor));const ee={};ee.attribute=Q,Q&&Q.data&&(ee.data=Q.data),F[W]=ee,z++}s.attributes=F,s.attributesNum=z,s.index=I}function _(){const M=s.newAttributes;for(let R=0,O=M.length;R<O;R++)M[R]=0}function m(M){d(M,0)}function d(M,R){const O=s.newAttributes,I=s.enabledAttributes,F=s.attributeDivisors;O[M]=1,I[M]===0&&(n.enableVertexAttribArray(M),I[M]=1),F[M]!==R&&(n.vertexAttribDivisor(M,R),F[M]=R)}function y(){const M=s.newAttributes,R=s.enabledAttributes;for(let O=0,I=R.length;O<I;O++)R[O]!==M[O]&&(n.disableVertexAttribArray(O),R[O]=0)}function S(M,R,O,I,F,V,z){z===!0?n.vertexAttribIPointer(M,R,O,F,V):n.vertexAttribPointer(M,R,O,I,F,V)}function T(M,R,O,I){_();const F=I.attributes,V=O.getAttributes(),z=R.defaultAttributeValues;for(const B in V){const W=V[B];if(W.location>=0){let K=F[B];if(K===void 0&&(B==="instanceMatrix"&&M.instanceMatrix&&(K=M.instanceMatrix),B==="instanceColor"&&M.instanceColor&&(K=M.instanceColor)),K!==void 0){const Q=K.normalized,ee=K.itemSize,$=e.get(K);if($===void 0)continue;const ie=$.buffer,de=$.type,Ne=$.bytesPerElement,q=de===n.INT||de===n.UNSIGNED_INT||K.gpuType===xl;if(K.isInterleavedBufferAttribute){const Y=K.data,re=Y.stride,ye=K.offset;if(Y.isInstancedInterleavedBuffer){for(let pe=0;pe<W.locationSize;pe++)d(W.location+pe,Y.meshPerAttribute);M.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let pe=0;pe<W.locationSize;pe++)m(W.location+pe);n.bindBuffer(n.ARRAY_BUFFER,ie);for(let pe=0;pe<W.locationSize;pe++)S(W.location+pe,ee/W.locationSize,de,Q,re*Ne,(ye+ee/W.locationSize*pe)*Ne,q)}else{if(K.isInstancedBufferAttribute){for(let Y=0;Y<W.locationSize;Y++)d(W.location+Y,K.meshPerAttribute);M.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Y=0;Y<W.locationSize;Y++)m(W.location+Y);n.bindBuffer(n.ARRAY_BUFFER,ie);for(let Y=0;Y<W.locationSize;Y++)S(W.location+Y,ee/W.locationSize,de,Q,ee*Ne,ee/W.locationSize*Y*Ne,q)}}else if(z!==void 0){const Q=z[B];if(Q!==void 0)switch(Q.length){case 2:n.vertexAttrib2fv(W.location,Q);break;case 3:n.vertexAttrib3fv(W.location,Q);break;case 4:n.vertexAttrib4fv(W.location,Q);break;default:n.vertexAttrib1fv(W.location,Q)}}}}y()}function b(){P();for(const M in i){const R=i[M];for(const O in R){const I=R[O];for(const F in I)u(I[F].object),delete I[F];delete R[O]}delete i[M]}}function A(M){if(i[M.id]===void 0)return;const R=i[M.id];for(const O in R){const I=R[O];for(const F in I)u(I[F].object),delete I[F];delete R[O]}delete i[M.id]}function C(M){for(const R in i){const O=i[R];if(O[M.id]===void 0)continue;const I=O[M.id];for(const F in I)u(I[F].object),delete I[F];delete O[M.id]}}function P(){x(),o=!0,s!==r&&(s=r,c(s.object))}function x(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:P,resetDefaultState:x,dispose:b,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:y}}function PS(n,e,t){let i;function r(c){i=c}function s(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function o(c,u,f){f!==0&&(n.drawArraysInstanced(i,c,u,f),t.update(u,i,f))}function a(c,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,f);let p=0;for(let g=0;g<f;g++)p+=u[g];t.update(p,i,1)}function l(c,u,f,h){if(f===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],u[g],h[g]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,h,0,f);let g=0;for(let _=0;_<f;_++)g+=u[_]*h[_];t.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function DS(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(C){return!(C!==qt&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const P=C===dn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Xt&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==ln&&!P)}function l(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(Ge("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),S=n.getParameter(n.MAX_VARYING_VECTORS),T=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),b=n.getParameter(n.MAX_SAMPLES),A=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:y,maxVaryings:S,maxFragmentUniforms:T,maxSamples:b,samples:A}}function LS(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new ri,a=new We,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const p=f.length!==0||h||i!==0||r;return r=h,i=f.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){t=u(f,h,0)},this.setState=function(f,h,p){const g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,d=n.get(f);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{const y=s?0:i,S=y*4;let T=d.clippingState||null;l.value=T,T=u(g,h,S,p);for(let b=0;b!==S;++b)T[b]=t[b];d.clippingState=T,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,h,p,g){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const d=p+_*4,y=h.matrixWorldInverse;a.getNormalMatrix(y),(m===null||m.length<d)&&(m=new Float32Array(d));for(let S=0,T=p;S!==_;++S,T+=4)o.copy(f[S]).applyMatrix4(y,a),o.normal.toArray(m,T),m[T+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function IS(n){let e=new WeakMap;function t(o,a){return a===na?o.mapping=mi:a===ia&&(o.mapping=zi),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===na||a===ia)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new gh(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}const Wn=4,nu=[.125,.215,.35,.446,.526,.582],oi=20,FS=256,sr=new As,iu=new ot;let yo=null,Eo=0,To=0,bo=!1;const NS=new G;class ru{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){const{size:o=256,position:a=NS}=s;yo=this._renderer.getRenderTarget(),Eo=this._renderer.getActiveCubeFace(),To=this._renderer.getActiveMipmapLevel(),bo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=au(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ou(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(yo,Eo,To),this._renderer.xr.enabled=bo,e.scissorTest=!1,Pi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===mi||e.mapping===zi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),yo=this._renderer.getRenderTarget(),Eo=this._renderer.getActiveCubeFace(),To=this._renderer.getActiveMipmapLevel(),bo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:St,minFilter:St,generateMipmaps:!1,type:dn,format:qt,colorSpace:Gi,depthBuffer:!1},r=su(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=su(e,t,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=US(s)),this._blurMaterial=BS(s,e,t),this._ggxMaterial=OS(s,e,t)}return r}_compileMaterial(e){const t=new Kt(new Ln,e);this._renderer.compile(t,sr)}_sceneToCubeUV(e,t,i,r,s){const l=new Qt(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,p=f.toneMapping;f.getClearColor(iu),f.toneMapping=un,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(r),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Kt(new Nr,new uh({name:"PMREM.Background",side:Ft,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let d=!1;const y=e.background;y?y.isColor&&(m.color.copy(y),e.background=null,d=!0):(m.color.copy(iu),d=!0);for(let S=0;S<6;S++){const T=S%3;T===0?(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[S],s.y,s.z)):T===1?(l.up.set(0,0,c[S]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[S],s.z)):(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[S]));const b=this._cubeSize;Pi(r,T*b,S>2?b:0,b,b),f.setRenderTarget(r),d&&f.render(_,l),f.render(e,l)}f.toneMapping=p,f.autoClear=h,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===mi||e.mapping===zi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=au()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ou());const s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;const a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Pi(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,sr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=i}_applyGGXFilter(e,t,i){const r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;const l=o.uniforms,c=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),h=0+c*1.25,p=f*h,{_lodMax:g}=this,_=this._sizeLods[i],m=3*_*(i>g-Wn?i-g+Wn:0),d=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=g-t,Pi(s,m,d,3*_,2*_),r.setRenderTarget(s),r.render(a,sr),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=g-i,Pi(e,m,d,3*_,2*_),r.setRenderTarget(e),r.render(a,sr)}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&Je("blur direction must be either latitudinal or longitudinal!");const u=3,f=this._lodMeshes[r];f.material=c;const h=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*oi-1),_=s/g,m=isFinite(s)?1+Math.floor(u*_):oi;m>oi&&Ge(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${oi}`);const d=[];let y=0;for(let C=0;C<oi;++C){const P=C/_,x=Math.exp(-P*P/2);d.push(x),C===0?y+=x:C<m&&(y+=2*x)}for(let C=0;C<d.length;C++)d[C]=d[C]/y;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=d,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:S}=this;h.dTheta.value=g,h.mipInt.value=S-i;const T=this._sizeLods[r],b=3*T*(r>S-Wn?r-S+Wn:0),A=4*(this._cubeSize-T);Pi(t,b,A,3*T,2*T),l.setRenderTarget(t),l.render(f,sr)}}function US(n){const e=[],t=[],i=[];let r=n;const s=n-Wn+1+nu.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);e.push(a);let l=1/a;o>n-Wn?l=nu[o-n+Wn-1]:o===0&&(l=0),t.push(l);const c=1/(a-2),u=-c,f=1+c,h=[u,u,f,u,f,f,u,u,f,f,u,f],p=6,g=6,_=3,m=2,d=1,y=new Float32Array(_*g*p),S=new Float32Array(m*g*p),T=new Float32Array(d*g*p);for(let A=0;A<p;A++){const C=A%3*2/3-1,P=A>2?0:-1,x=[C,P,0,C+2/3,P,0,C+2/3,P+1,0,C,P,0,C+2/3,P+1,0,C,P+1,0];y.set(x,_*g*A),S.set(h,m*g*A);const M=[A,A,A,A,A,A];T.set(M,d*g*A)}const b=new Ln;b.setAttribute("position",new fn(y,_)),b.setAttribute("uv",new fn(S,m)),b.setAttribute("faceIndex",new fn(T,d)),i.push(new Kt(b,null)),r>Wn&&r--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function su(n,e,t){const i=new rn(n,e,t);return i.texture.mapping=Ps,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Pi(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function OS(n,e,t){return new kt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:FS,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ls(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function BS(n,e,t){const i=new Float32Array(oi),r=new G(0,1,0);return new kt({name:"SphericalGaussianBlur",defines:{n:oi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Ls(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function ou(){return new kt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ls(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function au(){return new kt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ls(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function Ls(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function VS(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===na||l===ia,u=l===mi||l===zi;if(c||u){let f=e.get(a);const h=f!==void 0?f.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==h)return t===null&&(t=new ru(n)),f=c?t.fromEquirectangular(a,f):t.fromCubemap(a,f),f.texture.pmremVersion=a.pmremVersion,e.set(a,f),f.texture;if(f!==void 0)return f.texture;{const p=a.image;return c&&p&&p.height>0||u&&p&&r(p)?(t===null&&(t=new ru(n)),f=c?t.fromEquirectangular(a):t.fromCubemap(a),f.texture.pmremVersion=a.pmremVersion,e.set(a,f),a.addEventListener("dispose",s),f.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function zS(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Ar("WebGLRenderer: "+i+" extension not supported."),r}}}function kS(n,e,t,i){const r={},s=new WeakMap;function o(f){const h=f.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete r[h.id];const p=s.get(h);p&&(e.remove(p),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(f,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,t.memory.geometries++),h}function l(f){const h=f.attributes;for(const p in h)e.update(h[p],n.ARRAY_BUFFER)}function c(f){const h=[],p=f.index,g=f.attributes.position;let _=0;if(p!==null){const y=p.array;_=p.version;for(let S=0,T=y.length;S<T;S+=3){const b=y[S+0],A=y[S+1],C=y[S+2];h.push(b,A,A,C,C,b)}}else if(g!==void 0){const y=g.array;_=g.version;for(let S=0,T=y.length/3-1;S<T;S+=3){const b=S+0,A=S+1,C=S+2;h.push(b,A,A,C,C,b)}}else return;const m=new(oh(h)?hh:fh)(h,1);m.version=_;const d=s.get(f);d&&e.remove(d),s.set(f,m)}function u(f){const h=s.get(f);if(h){const p=f.index;p!==null&&h.version<p.version&&c(f)}else c(f);return s.get(f)}return{get:a,update:l,getWireframeAttribute:u}}function GS(n,e,t){let i;function r(h){i=h}let s,o;function a(h){s=h.type,o=h.bytesPerElement}function l(h,p){n.drawElements(i,p,s,h*o),t.update(p,i,1)}function c(h,p,g){g!==0&&(n.drawElementsInstanced(i,p,s,h*o,g),t.update(p,i,g))}function u(h,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,h,0,g);let m=0;for(let d=0;d<g;d++)m+=p[d];t.update(m,i,1)}function f(h,p,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<h.length;d++)c(h[d]/o,p[d],_[d]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,h,0,_,0,g);let d=0;for(let y=0;y<g;y++)d+=p[y]*_[y];t.update(d,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function HS(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:Je("WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function WS(n,e,t){const i=new WeakMap,r=new dt;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=u!==void 0?u.length:0;let h=i.get(a);if(h===void 0||h.count!==f){let x=function(){C.dispose(),i.delete(a),a.removeEventListener("dispose",x)};h!==void 0&&h.texture.dispose();const p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],d=a.morphAttributes.normal||[],y=a.morphAttributes.color||[];let S=0;p===!0&&(S=1),g===!0&&(S=2),_===!0&&(S=3);let T=a.attributes.position.count*S,b=1;T>e.maxTextureSize&&(b=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const A=new Float32Array(T*b*4*f),C=new ah(A,T,b,f);C.type=ln,C.needsUpdate=!0;const P=S*4;for(let M=0;M<f;M++){const R=m[M],O=d[M],I=y[M],F=T*b*4*M;for(let V=0;V<R.count;V++){const z=V*P;p===!0&&(r.fromBufferAttribute(R,V),A[F+z+0]=r.x,A[F+z+1]=r.y,A[F+z+2]=r.z,A[F+z+3]=0),g===!0&&(r.fromBufferAttribute(O,V),A[F+z+4]=r.x,A[F+z+5]=r.y,A[F+z+6]=r.z,A[F+z+7]=0),_===!0&&(r.fromBufferAttribute(I,V),A[F+z+8]=r.x,A[F+z+9]=r.y,A[F+z+10]=r.z,A[F+z+11]=I.itemSize===4?r.w:1)}}h={count:f,texture:C,size:new Qe(T,b)},i.set(a,h),a.addEventListener("dispose",x)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let p=0;for(let _=0;_<c.length;_++)p+=c[_];const g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:s}}function XS(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,f=e.get(l,u);if(r.get(f)!==c&&(e.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return f}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}const qS={[Xf]:"LINEAR_TONE_MAPPING",[qf]:"REINHARD_TONE_MAPPING",[Yf]:"CINEON_TONE_MAPPING",[$f]:"ACES_FILMIC_TONE_MAPPING",[Zf]:"AGX_TONE_MAPPING",[jf]:"NEUTRAL_TONE_MAPPING",[Kf]:"CUSTOM_TONE_MAPPING"};function YS(n,e,t,i,r){const s=new rn(e,t,{type:n,depthBuffer:i,stencilBuffer:r}),o=new rn(e,t,{type:dn,depthBuffer:!1,stencilBuffer:!1}),a=new Ln;a.setAttribute("position",new wn([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new wn([0,2,0,0,2,0],2));const l=new k_({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new Kt(a,l),u=new As(-1,1,1,-1,0,1);let f=null,h=null,p=!1,g,_=null,m=[],d=!1;this.setSize=function(y,S){s.setSize(y,S),o.setSize(y,S);for(let T=0;T<m.length;T++){const b=m[T];b.setSize&&b.setSize(y,S)}},this.setEffects=function(y){m=y,d=m.length>0&&m[0].isRenderPass===!0;const S=s.width,T=s.height;for(let b=0;b<m.length;b++){const A=m[b];A.setSize&&A.setSize(S,T)}},this.begin=function(y,S){if(p||y.toneMapping===un&&m.length===0)return!1;if(_=S,S!==null){const T=S.width,b=S.height;(s.width!==T||s.height!==b)&&this.setSize(T,b)}return d===!1&&y.setRenderTarget(s),g=y.toneMapping,y.toneMapping=un,!0},this.hasRenderPass=function(){return d},this.end=function(y,S){y.toneMapping=g,p=!0;let T=s,b=o;for(let A=0;A<m.length;A++){const C=m[A];if(C.enabled!==!1&&(C.render(y,b,T,S),C.needsSwap!==!1)){const P=T;T=b,b=P}}if(f!==y.outputColorSpace||h!==y.toneMapping){f=y.outputColorSpace,h=y.toneMapping,l.defines={},Ze.getTransfer(f)===it&&(l.defines.SRGB_TRANSFER="");const A=qS[h];A&&(l.defines[A]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=T.texture,y.setRenderTarget(_),y.render(c,u),_=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){s.dispose(),o.dispose(),a.dispose(),l.dispose()}}const Sh=new Pt,Va=new wr(1,1),Mh=new ah,yh=new __,Eh=new mh,lu=[],cu=[],uu=new Float32Array(16),fu=new Float32Array(9),hu=new Float32Array(4);function Zi(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=lu[r];if(s===void 0&&(s=new Float32Array(r),lu[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function _t(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function vt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Is(n,e){let t=cu[e];t===void 0&&(t=new Int32Array(e),cu[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function $S(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function KS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;n.uniform2fv(this.addr,e),vt(t,e)}}function ZS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(_t(t,e))return;n.uniform3fv(this.addr,e),vt(t,e)}}function jS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;n.uniform4fv(this.addr,e),vt(t,e)}}function JS(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(_t(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,i))return;hu.set(i),n.uniformMatrix2fv(this.addr,!1,hu),vt(t,i)}}function QS(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(_t(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,i))return;fu.set(i),n.uniformMatrix3fv(this.addr,!1,fu),vt(t,i)}}function eM(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(_t(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,i))return;uu.set(i),n.uniformMatrix4fv(this.addr,!1,uu),vt(t,i)}}function tM(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function nM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;n.uniform2iv(this.addr,e),vt(t,e)}}function iM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;n.uniform3iv(this.addr,e),vt(t,e)}}function rM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;n.uniform4iv(this.addr,e),vt(t,e)}}function sM(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function oM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;n.uniform2uiv(this.addr,e),vt(t,e)}}function aM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;n.uniform3uiv(this.addr,e),vt(t,e)}}function lM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;n.uniform4uiv(this.addr,e),vt(t,e)}}function cM(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Va.compareFunction=t.isReversedDepthBuffer()?Al:bl,s=Va):s=Sh,t.setTexture2D(e||s,r)}function uM(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||yh,r)}function fM(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Eh,r)}function hM(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Mh,r)}function dM(n){switch(n){case 5126:return $S;case 35664:return KS;case 35665:return ZS;case 35666:return jS;case 35674:return JS;case 35675:return QS;case 35676:return eM;case 5124:case 35670:return tM;case 35667:case 35671:return nM;case 35668:case 35672:return iM;case 35669:case 35673:return rM;case 5125:return sM;case 36294:return oM;case 36295:return aM;case 36296:return lM;case 35678:case 36198:case 36298:case 36306:case 35682:return cM;case 35679:case 36299:case 36307:return uM;case 35680:case 36300:case 36308:case 36293:return fM;case 36289:case 36303:case 36311:case 36292:return hM}}function pM(n,e){n.uniform1fv(this.addr,e)}function mM(n,e){const t=Zi(e,this.size,2);n.uniform2fv(this.addr,t)}function gM(n,e){const t=Zi(e,this.size,3);n.uniform3fv(this.addr,t)}function _M(n,e){const t=Zi(e,this.size,4);n.uniform4fv(this.addr,t)}function vM(n,e){const t=Zi(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function xM(n,e){const t=Zi(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function SM(n,e){const t=Zi(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function MM(n,e){n.uniform1iv(this.addr,e)}function yM(n,e){n.uniform2iv(this.addr,e)}function EM(n,e){n.uniform3iv(this.addr,e)}function TM(n,e){n.uniform4iv(this.addr,e)}function bM(n,e){n.uniform1uiv(this.addr,e)}function AM(n,e){n.uniform2uiv(this.addr,e)}function wM(n,e){n.uniform3uiv(this.addr,e)}function CM(n,e){n.uniform4uiv(this.addr,e)}function RM(n,e,t){const i=this.cache,r=e.length,s=Is(t,r);_t(i,s)||(n.uniform1iv(this.addr,s),vt(i,s));let o;this.type===n.SAMPLER_2D_SHADOW?o=Va:o=Sh;for(let a=0;a!==r;++a)t.setTexture2D(e[a]||o,s[a])}function PM(n,e,t){const i=this.cache,r=e.length,s=Is(t,r);_t(i,s)||(n.uniform1iv(this.addr,s),vt(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||yh,s[o])}function DM(n,e,t){const i=this.cache,r=e.length,s=Is(t,r);_t(i,s)||(n.uniform1iv(this.addr,s),vt(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Eh,s[o])}function LM(n,e,t){const i=this.cache,r=e.length,s=Is(t,r);_t(i,s)||(n.uniform1iv(this.addr,s),vt(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Mh,s[o])}function IM(n){switch(n){case 5126:return pM;case 35664:return mM;case 35665:return gM;case 35666:return _M;case 35674:return vM;case 35675:return xM;case 35676:return SM;case 5124:case 35670:return MM;case 35667:case 35671:return yM;case 35668:case 35672:return EM;case 35669:case 35673:return TM;case 5125:return bM;case 36294:return AM;case 36295:return wM;case 36296:return CM;case 35678:case 36198:case 36298:case 36306:case 35682:return RM;case 35679:case 36299:case 36307:return PM;case 35680:case 36300:case 36308:case 36293:return DM;case 36289:case 36303:case 36311:case 36292:return LM}}class FM{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=dM(t.type)}}class NM{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=IM(t.type)}}class UM{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const Ao=/(\w+)(\])?(\[|\.)?/g;function du(n,e){n.seq.push(e),n.map[e.id]=e}function OM(n,e,t){const i=n.name,r=i.length;for(Ao.lastIndex=0;;){const s=Ao.exec(i),o=Ao.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){du(t,c===void 0?new FM(a,n,e):new NM(a,n,e));break}else{let f=t.map[a];f===void 0&&(f=new UM(a),du(t,f)),t=f}}}class xs{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);OM(a,l,this)}const r=[],s=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function pu(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const BM=37297;let VM=0;function zM(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const mu=new We;function kM(n){Ze._getMatrix(mu,Ze.workingColorSpace,n);const e=`mat3( ${mu.elements.map(t=>t.toFixed(4))} )`;switch(Ze.getTransfer(n)){case Es:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return Ge("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function gu(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+zM(n.getShaderSource(e),a)}else return s}function GM(n,e){const t=kM(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const HM={[Xf]:"Linear",[qf]:"Reinhard",[Yf]:"Cineon",[$f]:"ACESFilmic",[Zf]:"AgX",[jf]:"Neutral",[Kf]:"Custom"};function WM(n,e){const t=HM[e];return t===void 0?(Ge("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const as=new G;function XM(){Ze.getLuminanceCoefficients(as);const n=as.x.toFixed(4),e=as.y.toFixed(4),t=as.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function qM(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ur).join(`
`)}function YM(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function $M(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function ur(n){return n!==""}function _u(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function vu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const KM=/^[ \t]*#include +<([\w\d./]+)>/gm;function za(n){return n.replace(KM,jM)}const ZM=new Map;function jM(n,e){let t=Xe[e];if(t===void 0){const i=ZM.get(e);if(i!==void 0)t=Xe[i],Ge('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return za(t)}const JM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function xu(n){return n.replace(JM,QM)}function QM(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Su(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const ey={[ps]:"SHADOWMAP_TYPE_PCF",[cr]:"SHADOWMAP_TYPE_VSM"};function ty(n){return ey[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const ny={[mi]:"ENVMAP_TYPE_CUBE",[zi]:"ENVMAP_TYPE_CUBE",[Ps]:"ENVMAP_TYPE_CUBE_UV"};function iy(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":ny[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const ry={[zi]:"ENVMAP_MODE_REFRACTION"};function sy(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":ry[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const oy={[Wf]:"ENVMAP_BLENDING_MULTIPLY",[j0]:"ENVMAP_BLENDING_MIX",[J0]:"ENVMAP_BLENDING_ADD"};function ay(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":oy[n.combine]||"ENVMAP_BLENDING_NONE"}function ly(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function cy(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=ty(t),c=iy(t),u=sy(t),f=ay(t),h=ly(t),p=qM(t),g=YM(s),_=r.createProgram();let m,d,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ur).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ur).join(`
`),d.length>0&&(d+=`
`)):(m=[Su(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ur).join(`
`),d=[Su(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==un?"#define TONE_MAPPING":"",t.toneMapping!==un?Xe.tonemapping_pars_fragment:"",t.toneMapping!==un?WM("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,GM("linearToOutputTexel",t.outputColorSpace),XM(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ur).join(`
`)),o=za(o),o=_u(o,t),o=vu(o,t),a=za(a),a=_u(a,t),a=vu(a,t),o=xu(o),a=xu(a),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===Nc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Nc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const S=y+m+o,T=y+d+a,b=pu(r,r.VERTEX_SHADER,S),A=pu(r,r.FRAGMENT_SHADER,T);r.attachShader(_,b),r.attachShader(_,A),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function C(R){if(n.debug.checkShaderErrors){const O=r.getProgramInfoLog(_)||"",I=r.getShaderInfoLog(b)||"",F=r.getShaderInfoLog(A)||"",V=O.trim(),z=I.trim(),B=F.trim();let W=!0,K=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(W=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,b,A);else{const Q=gu(r,b,"vertex"),ee=gu(r,A,"fragment");Je("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+V+`
`+Q+`
`+ee)}else V!==""?Ge("WebGLProgram: Program Info Log:",V):(z===""||B==="")&&(K=!1);K&&(R.diagnostics={runnable:W,programLog:V,vertexShader:{log:z,prefix:m},fragmentShader:{log:B,prefix:d}})}r.deleteShader(b),r.deleteShader(A),P=new xs(r,_),x=$M(r,_)}let P;this.getUniforms=function(){return P===void 0&&C(this),P};let x;this.getAttributes=function(){return x===void 0&&C(this),x};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(_,BM)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=VM++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=b,this.fragmentShader=A,this}let uy=0;class fy{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new hy(e),t.set(e,i)),i}}class hy{constructor(e){this.id=uy++,this.code=e,this.usedTimes=0}}function dy(n,e,t,i,r,s,o){const a=new lh,l=new fy,c=new Set,u=[],f=new Map,h=r.logarithmicDepthBuffer;let p=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(x){return c.add(x),x===0?"uv":`uv${x}`}function m(x,M,R,O,I){const F=O.fog,V=I.geometry,z=x.isMeshStandardMaterial?O.environment:null,B=(x.isMeshStandardMaterial?t:e).get(x.envMap||z),W=B&&B.mapping===Ps?B.image.height:null,K=g[x.type];x.precision!==null&&(p=r.getMaxPrecision(x.precision),p!==x.precision&&Ge("WebGLProgram.getParameters:",x.precision,"not supported, using",p,"instead."));const Q=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ee=Q!==void 0?Q.length:0;let $=0;V.morphAttributes.position!==void 0&&($=1),V.morphAttributes.normal!==void 0&&($=2),V.morphAttributes.color!==void 0&&($=3);let ie,de,Ne,q;if(K){const tt=an[K];ie=tt.vertexShader,de=tt.fragmentShader}else ie=x.vertexShader,de=x.fragmentShader,l.update(x),Ne=l.getVertexShaderID(x),q=l.getFragmentShaderID(x);const Y=n.getRenderTarget(),re=n.state.buffers.depth.getReversed(),ye=I.isInstancedMesh===!0,pe=I.isBatchedMesh===!0,Te=!!x.map,J=!!x.matcap,le=!!B,be=!!x.aoMap,ce=!!x.lightMap,Ie=!!x.bumpMap,qe=!!x.normalMap,D=!!x.displacementMap,et=!!x.emissiveMap,Be=!!x.metalnessMap,$e=!!x.roughnessMap,Ce=x.anisotropy>0,w=x.clearcoat>0,v=x.dispersion>0,N=x.iridescence>0,j=x.sheen>0,ne=x.transmission>0,Z=Ce&&!!x.anisotropyMap,De=w&&!!x.clearcoatMap,ue=w&&!!x.clearcoatNormalMap,Ae=w&&!!x.clearcoatRoughnessMap,Ve=N&&!!x.iridescenceMap,se=N&&!!x.iridescenceThicknessMap,ge=j&&!!x.sheenColorMap,we=j&&!!x.sheenRoughnessMap,Le=!!x.specularMap,me=!!x.specularColorMap,He=!!x.specularIntensityMap,L=ne&&!!x.transmissionMap,xe=ne&&!!x.thicknessMap,ae=!!x.gradientMap,Me=!!x.alphaMap,oe=x.alphaTest>0,te=!!x.alphaHash,fe=!!x.extensions;let ke=un;x.toneMapped&&(Y===null||Y.isXRRenderTarget===!0)&&(ke=n.toneMapping);const rt={shaderID:K,shaderType:x.type,shaderName:x.name,vertexShader:ie,fragmentShader:de,defines:x.defines,customVertexShaderID:Ne,customFragmentShaderID:q,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:p,batching:pe,batchingColor:pe&&I._colorsTexture!==null,instancing:ye,instancingColor:ye&&I.instanceColor!==null,instancingMorph:ye&&I.morphTexture!==null,outputColorSpace:Y===null?n.outputColorSpace:Y.isXRRenderTarget===!0?Y.texture.colorSpace:Gi,alphaToCoverage:!!x.alphaToCoverage,map:Te,matcap:J,envMap:le,envMapMode:le&&B.mapping,envMapCubeUVHeight:W,aoMap:be,lightMap:ce,bumpMap:Ie,normalMap:qe,displacementMap:D,emissiveMap:et,normalMapObjectSpace:qe&&x.normalMapType===n_,normalMapTangentSpace:qe&&x.normalMapType===t_,metalnessMap:Be,roughnessMap:$e,anisotropy:Ce,anisotropyMap:Z,clearcoat:w,clearcoatMap:De,clearcoatNormalMap:ue,clearcoatRoughnessMap:Ae,dispersion:v,iridescence:N,iridescenceMap:Ve,iridescenceThicknessMap:se,sheen:j,sheenColorMap:ge,sheenRoughnessMap:we,specularMap:Le,specularColorMap:me,specularIntensityMap:He,transmission:ne,transmissionMap:L,thicknessMap:xe,gradientMap:ae,opaque:x.transparent===!1&&x.blending===Fi&&x.alphaToCoverage===!1,alphaMap:Me,alphaTest:oe,alphaHash:te,combine:x.combine,mapUv:Te&&_(x.map.channel),aoMapUv:be&&_(x.aoMap.channel),lightMapUv:ce&&_(x.lightMap.channel),bumpMapUv:Ie&&_(x.bumpMap.channel),normalMapUv:qe&&_(x.normalMap.channel),displacementMapUv:D&&_(x.displacementMap.channel),emissiveMapUv:et&&_(x.emissiveMap.channel),metalnessMapUv:Be&&_(x.metalnessMap.channel),roughnessMapUv:$e&&_(x.roughnessMap.channel),anisotropyMapUv:Z&&_(x.anisotropyMap.channel),clearcoatMapUv:De&&_(x.clearcoatMap.channel),clearcoatNormalMapUv:ue&&_(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ae&&_(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Ve&&_(x.iridescenceMap.channel),iridescenceThicknessMapUv:se&&_(x.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&_(x.sheenColorMap.channel),sheenRoughnessMapUv:we&&_(x.sheenRoughnessMap.channel),specularMapUv:Le&&_(x.specularMap.channel),specularColorMapUv:me&&_(x.specularColorMap.channel),specularIntensityMapUv:He&&_(x.specularIntensityMap.channel),transmissionMapUv:L&&_(x.transmissionMap.channel),thicknessMapUv:xe&&_(x.thicknessMap.channel),alphaMapUv:Me&&_(x.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(qe||Ce),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!V.attributes.uv&&(Te||Me),fog:!!F,useFog:x.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:re,skinning:I.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:ee,morphTextureStride:$,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:ke,decodeVideoTexture:Te&&x.map.isVideoTexture===!0&&Ze.getTransfer(x.map.colorSpace)===it,decodeVideoTextureEmissive:et&&x.emissiveMap.isVideoTexture===!0&&Ze.getTransfer(x.emissiveMap.colorSpace)===it,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Mn,flipSided:x.side===Ft,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:fe&&x.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(fe&&x.extensions.multiDraw===!0||pe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return rt.vertexUv1s=c.has(1),rt.vertexUv2s=c.has(2),rt.vertexUv3s=c.has(3),c.clear(),rt}function d(x){const M=[];if(x.shaderID?M.push(x.shaderID):(M.push(x.customVertexShaderID),M.push(x.customFragmentShaderID)),x.defines!==void 0)for(const R in x.defines)M.push(R),M.push(x.defines[R]);return x.isRawShaderMaterial===!1&&(y(M,x),S(M,x),M.push(n.outputColorSpace)),M.push(x.customProgramCacheKey),M.join()}function y(x,M){x.push(M.precision),x.push(M.outputColorSpace),x.push(M.envMapMode),x.push(M.envMapCubeUVHeight),x.push(M.mapUv),x.push(M.alphaMapUv),x.push(M.lightMapUv),x.push(M.aoMapUv),x.push(M.bumpMapUv),x.push(M.normalMapUv),x.push(M.displacementMapUv),x.push(M.emissiveMapUv),x.push(M.metalnessMapUv),x.push(M.roughnessMapUv),x.push(M.anisotropyMapUv),x.push(M.clearcoatMapUv),x.push(M.clearcoatNormalMapUv),x.push(M.clearcoatRoughnessMapUv),x.push(M.iridescenceMapUv),x.push(M.iridescenceThicknessMapUv),x.push(M.sheenColorMapUv),x.push(M.sheenRoughnessMapUv),x.push(M.specularMapUv),x.push(M.specularColorMapUv),x.push(M.specularIntensityMapUv),x.push(M.transmissionMapUv),x.push(M.thicknessMapUv),x.push(M.combine),x.push(M.fogExp2),x.push(M.sizeAttenuation),x.push(M.morphTargetsCount),x.push(M.morphAttributeCount),x.push(M.numDirLights),x.push(M.numPointLights),x.push(M.numSpotLights),x.push(M.numSpotLightMaps),x.push(M.numHemiLights),x.push(M.numRectAreaLights),x.push(M.numDirLightShadows),x.push(M.numPointLightShadows),x.push(M.numSpotLightShadows),x.push(M.numSpotLightShadowsWithMaps),x.push(M.numLightProbes),x.push(M.shadowMapType),x.push(M.toneMapping),x.push(M.numClippingPlanes),x.push(M.numClipIntersection),x.push(M.depthPacking)}function S(x,M){a.disableAll(),M.instancing&&a.enable(0),M.instancingColor&&a.enable(1),M.instancingMorph&&a.enable(2),M.matcap&&a.enable(3),M.envMap&&a.enable(4),M.normalMapObjectSpace&&a.enable(5),M.normalMapTangentSpace&&a.enable(6),M.clearcoat&&a.enable(7),M.iridescence&&a.enable(8),M.alphaTest&&a.enable(9),M.vertexColors&&a.enable(10),M.vertexAlphas&&a.enable(11),M.vertexUv1s&&a.enable(12),M.vertexUv2s&&a.enable(13),M.vertexUv3s&&a.enable(14),M.vertexTangents&&a.enable(15),M.anisotropy&&a.enable(16),M.alphaHash&&a.enable(17),M.batching&&a.enable(18),M.dispersion&&a.enable(19),M.batchingColor&&a.enable(20),M.gradientMap&&a.enable(21),x.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),x.push(a.mask)}function T(x){const M=g[x.type];let R;if(M){const O=an[M];R=D_.clone(O.uniforms)}else R=x.uniforms;return R}function b(x,M){let R=f.get(M);return R!==void 0?++R.usedTimes:(R=new cy(n,M,x,s),u.push(R),f.set(M,R)),R}function A(x){if(--x.usedTimes===0){const M=u.indexOf(x);u[M]=u[u.length-1],u.pop(),f.delete(x.cacheKey),x.destroy()}}function C(x){l.remove(x)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:T,acquireProgram:b,releaseProgram:A,releaseShaderCache:C,programs:u,dispose:P}}function py(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function my(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Mu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function yu(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(f,h,p,g,_,m){let d=n[e];return d===void 0?(d={id:f.id,object:f,geometry:h,material:p,groupOrder:g,renderOrder:f.renderOrder,z:_,group:m},n[e]=d):(d.id=f.id,d.object=f,d.geometry=h,d.material=p,d.groupOrder=g,d.renderOrder=f.renderOrder,d.z=_,d.group=m),e++,d}function a(f,h,p,g,_,m){const d=o(f,h,p,g,_,m);p.transmission>0?i.push(d):p.transparent===!0?r.push(d):t.push(d)}function l(f,h,p,g,_,m){const d=o(f,h,p,g,_,m);p.transmission>0?i.unshift(d):p.transparent===!0?r.unshift(d):t.unshift(d)}function c(f,h){t.length>1&&t.sort(f||my),i.length>1&&i.sort(h||Mu),r.length>1&&r.sort(h||Mu)}function u(){for(let f=e,h=n.length;f<h;f++){const p=n[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function gy(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new yu,n.set(i,[o])):r>=s.length?(o=new yu,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function _y(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new G,color:new ot};break;case"SpotLight":t={position:new G,direction:new G,color:new ot,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new G,color:new ot,distance:0,decay:0};break;case"HemisphereLight":t={direction:new G,skyColor:new ot,groundColor:new ot};break;case"RectAreaLight":t={color:new ot,position:new G,halfWidth:new G,halfHeight:new G};break}return n[e.id]=t,t}}}function vy(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let xy=0;function Sy(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function My(n){const e=new _y,t=vy(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new G);const r=new G,s=new gt,o=new gt;function a(c){let u=0,f=0,h=0;for(let x=0;x<9;x++)i.probe[x].set(0,0,0);let p=0,g=0,_=0,m=0,d=0,y=0,S=0,T=0,b=0,A=0,C=0;c.sort(Sy);for(let x=0,M=c.length;x<M;x++){const R=c[x],O=R.color,I=R.intensity,F=R.distance;let V=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===ki?V=R.shadow.map.texture:V=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)u+=O.r*I,f+=O.g*I,h+=O.b*I;else if(R.isLightProbe){for(let z=0;z<9;z++)i.probe[z].addScaledVector(R.sh.coefficients[z],I);C++}else if(R.isDirectionalLight){const z=e.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const B=R.shadow,W=t.get(R);W.shadowIntensity=B.intensity,W.shadowBias=B.bias,W.shadowNormalBias=B.normalBias,W.shadowRadius=B.radius,W.shadowMapSize=B.mapSize,i.directionalShadow[p]=W,i.directionalShadowMap[p]=V,i.directionalShadowMatrix[p]=R.shadow.matrix,y++}i.directional[p]=z,p++}else if(R.isSpotLight){const z=e.get(R);z.position.setFromMatrixPosition(R.matrixWorld),z.color.copy(O).multiplyScalar(I),z.distance=F,z.coneCos=Math.cos(R.angle),z.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),z.decay=R.decay,i.spot[_]=z;const B=R.shadow;if(R.map&&(i.spotLightMap[b]=R.map,b++,B.updateMatrices(R),R.castShadow&&A++),i.spotLightMatrix[_]=B.matrix,R.castShadow){const W=t.get(R);W.shadowIntensity=B.intensity,W.shadowBias=B.bias,W.shadowNormalBias=B.normalBias,W.shadowRadius=B.radius,W.shadowMapSize=B.mapSize,i.spotShadow[_]=W,i.spotShadowMap[_]=V,T++}_++}else if(R.isRectAreaLight){const z=e.get(R);z.color.copy(O).multiplyScalar(I),z.halfWidth.set(R.width*.5,0,0),z.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=z,m++}else if(R.isPointLight){const z=e.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),z.distance=R.distance,z.decay=R.decay,R.castShadow){const B=R.shadow,W=t.get(R);W.shadowIntensity=B.intensity,W.shadowBias=B.bias,W.shadowNormalBias=B.normalBias,W.shadowRadius=B.radius,W.shadowMapSize=B.mapSize,W.shadowCameraNear=B.camera.near,W.shadowCameraFar=B.camera.far,i.pointShadow[g]=W,i.pointShadowMap[g]=V,i.pointShadowMatrix[g]=R.shadow.matrix,S++}i.point[g]=z,g++}else if(R.isHemisphereLight){const z=e.get(R);z.skyColor.copy(R.color).multiplyScalar(I),z.groundColor.copy(R.groundColor).multiplyScalar(I),i.hemi[d]=z,d++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ve.LTC_FLOAT_1,i.rectAreaLTC2=ve.LTC_FLOAT_2):(i.rectAreaLTC1=ve.LTC_HALF_1,i.rectAreaLTC2=ve.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=h;const P=i.hash;(P.directionalLength!==p||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==m||P.hemiLength!==d||P.numDirectionalShadows!==y||P.numPointShadows!==S||P.numSpotShadows!==T||P.numSpotMaps!==b||P.numLightProbes!==C)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=d,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=T,i.spotShadowMap.length=T,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=T+b-A,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=C,P.directionalLength=p,P.pointLength=g,P.spotLength=_,P.rectAreaLength=m,P.hemiLength=d,P.numDirectionalShadows=y,P.numPointShadows=S,P.numSpotShadows=T,P.numSpotMaps=b,P.numLightProbes=C,i.version=xy++)}function l(c,u){let f=0,h=0,p=0,g=0,_=0;const m=u.matrixWorldInverse;for(let d=0,y=c.length;d<y;d++){const S=c[d];if(S.isDirectionalLight){const T=i.directional[f];T.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(m),f++}else if(S.isSpotLight){const T=i.spot[p];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(m),T.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(m),p++}else if(S.isRectAreaLight){const T=i.rectArea[g];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(m),o.identity(),s.copy(S.matrixWorld),s.premultiply(m),o.extractRotation(s),T.halfWidth.set(S.width*.5,0,0),T.halfHeight.set(0,S.height*.5,0),T.halfWidth.applyMatrix4(o),T.halfHeight.applyMatrix4(o),g++}else if(S.isPointLight){const T=i.point[h];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(m),h++}else if(S.isHemisphereLight){const T=i.hemi[_];T.direction.setFromMatrixPosition(S.matrixWorld),T.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:i}}function Eu(n){const e=new My(n),t=[],i=[];function r(u){c.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function yy(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new Eu(n),e.set(r,[a])):s>=o.length?(a=new Eu(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const Ey=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ty=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,by=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],Ay=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],Tu=new gt,or=new G,wo=new G;function wy(n,e,t){let i=new _h;const r=new Qe,s=new Qe,o=new dt,a=new G_,l=new H_,c={},u=t.maxTextureSize,f={[Yn]:Ft,[Ft]:Yn,[Mn]:Mn},h=new kt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Qe},radius:{value:4}},vertexShader:Ey,fragmentShader:Ty}),p=h.clone();p.defines.HORIZONTAL_PASS=1;const g=new Ln;g.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Kt(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ps;let d=this.type;this.render=function(A,C,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;A.type===L0&&(Ge("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),A.type=ps);const x=n.getRenderTarget(),M=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),O=n.state;O.setBlending(bn),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const I=d!==this.type;I&&C.traverse(function(F){F.material&&(Array.isArray(F.material)?F.material.forEach(V=>V.needsUpdate=!0):F.material.needsUpdate=!0)});for(let F=0,V=A.length;F<V;F++){const z=A[F],B=z.shadow;if(B===void 0){Ge("WebGLShadowMap:",z,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;r.copy(B.mapSize);const W=B.getFrameExtents();if(r.multiply(W),s.copy(B.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/W.x),r.x=s.x*W.x,B.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/W.y),r.y=s.y*W.y,B.mapSize.y=s.y)),B.map===null||I===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===cr){if(z.isPointLight){Ge("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new rn(r.x,r.y,{format:ki,type:dn,minFilter:St,magFilter:St,generateMipmaps:!1}),B.map.texture.name=z.name+".shadowMap",B.map.depthTexture=new wr(r.x,r.y,ln),B.map.depthTexture.name=z.name+".shadowMapDepth",B.map.depthTexture.format=Pn,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=yt,B.map.depthTexture.magFilter=yt}else{z.isPointLight?(B.map=new gh(r.x),B.map.depthTexture=new z_(r.x,hn)):(B.map=new rn(r.x,r.y),B.map.depthTexture=new wr(r.x,r.y,hn)),B.map.depthTexture.name=z.name+".shadowMap",B.map.depthTexture.format=Pn;const Q=n.state.buffers.depth.getReversed();this.type===ps?(B.map.depthTexture.compareFunction=Q?Al:bl,B.map.depthTexture.minFilter=St,B.map.depthTexture.magFilter=St):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=yt,B.map.depthTexture.magFilter=yt)}B.camera.updateProjectionMatrix()}const K=B.map.isWebGLCubeRenderTarget?6:1;for(let Q=0;Q<K;Q++){if(B.map.isWebGLCubeRenderTarget)n.setRenderTarget(B.map,Q),n.clear();else{Q===0&&(n.setRenderTarget(B.map),n.clear());const ee=B.getViewport(Q);o.set(s.x*ee.x,s.y*ee.y,s.x*ee.z,s.y*ee.w),O.viewport(o)}if(z.isPointLight){const ee=B.camera,$=B.matrix,ie=z.distance||ee.far;ie!==ee.far&&(ee.far=ie,ee.updateProjectionMatrix()),or.setFromMatrixPosition(z.matrixWorld),ee.position.copy(or),wo.copy(ee.position),wo.add(by[Q]),ee.up.copy(Ay[Q]),ee.lookAt(wo),ee.updateMatrixWorld(),$.makeTranslation(-or.x,-or.y,-or.z),Tu.multiplyMatrices(ee.projectionMatrix,ee.matrixWorldInverse),B._frustum.setFromProjectionMatrix(Tu,ee.coordinateSystem,ee.reversedDepth)}else B.updateMatrices(z);i=B.getFrustum(),T(C,P,B.camera,z,this.type)}B.isPointLightShadow!==!0&&this.type===cr&&y(B,P),B.needsUpdate=!1}d=this.type,m.needsUpdate=!1,n.setRenderTarget(x,M,R)};function y(A,C){const P=e.update(_);h.defines.VSM_SAMPLES!==A.blurSamples&&(h.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new rn(r.x,r.y,{format:ki,type:dn})),h.uniforms.shadow_pass.value=A.map.depthTexture,h.uniforms.resolution.value=A.mapSize,h.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(C,null,P,h,_,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(C,null,P,p,_,null)}function S(A,C,P,x){let M=null;const R=P.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(R!==void 0)M=R;else if(M=P.isPointLight===!0?l:a,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const O=M.uuid,I=C.uuid;let F=c[O];F===void 0&&(F={},c[O]=F);let V=F[I];V===void 0&&(V=M.clone(),F[I]=V,C.addEventListener("dispose",b)),M=V}if(M.visible=C.visible,M.wireframe=C.wireframe,x===cr?M.side=C.shadowSide!==null?C.shadowSide:C.side:M.side=C.shadowSide!==null?C.shadowSide:f[C.side],M.alphaMap=C.alphaMap,M.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,M.map=C.map,M.clipShadows=C.clipShadows,M.clippingPlanes=C.clippingPlanes,M.clipIntersection=C.clipIntersection,M.displacementMap=C.displacementMap,M.displacementScale=C.displacementScale,M.displacementBias=C.displacementBias,M.wireframeLinewidth=C.wireframeLinewidth,M.linewidth=C.linewidth,P.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const O=n.properties.get(M);O.light=P}return M}function T(A,C,P,x,M){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&M===cr)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,A.matrixWorld);const I=e.update(A),F=A.material;if(Array.isArray(F)){const V=I.groups;for(let z=0,B=V.length;z<B;z++){const W=V[z],K=F[W.materialIndex];if(K&&K.visible){const Q=S(A,K,x,M);A.onBeforeShadow(n,A,C,P,I,Q,W),n.renderBufferDirect(P,null,I,Q,A,W),A.onAfterShadow(n,A,C,P,I,Q,W)}}}else if(F.visible){const V=S(A,F,x,M);A.onBeforeShadow(n,A,C,P,I,V,null),n.renderBufferDirect(P,null,I,V,A,null),A.onAfterShadow(n,A,C,P,I,V,null)}}const O=A.children;for(let I=0,F=O.length;I<F;I++)T(O[I],C,P,x,M)}function b(A){A.target.removeEventListener("dispose",b);for(const P in c){const x=c[P],M=A.target.uuid;M in x&&(x[M].dispose(),delete x[M])}}}const Cy={[Ko]:Zo,[jo]:ea,[Jo]:ta,[Vi]:Qo,[Zo]:Ko,[ea]:jo,[ta]:Jo,[Qo]:Vi};function Ry(n,e){function t(){let L=!1;const xe=new dt;let ae=null;const Me=new dt(0,0,0,0);return{setMask:function(oe){ae!==oe&&!L&&(n.colorMask(oe,oe,oe,oe),ae=oe)},setLocked:function(oe){L=oe},setClear:function(oe,te,fe,ke,rt){rt===!0&&(oe*=ke,te*=ke,fe*=ke),xe.set(oe,te,fe,ke),Me.equals(xe)===!1&&(n.clearColor(oe,te,fe,ke),Me.copy(xe))},reset:function(){L=!1,ae=null,Me.set(-1,0,0,0)}}}function i(){let L=!1,xe=!1,ae=null,Me=null,oe=null;return{setReversed:function(te){if(xe!==te){const fe=e.get("EXT_clip_control");te?fe.clipControlEXT(fe.LOWER_LEFT_EXT,fe.ZERO_TO_ONE_EXT):fe.clipControlEXT(fe.LOWER_LEFT_EXT,fe.NEGATIVE_ONE_TO_ONE_EXT),xe=te;const ke=oe;oe=null,this.setClear(ke)}},getReversed:function(){return xe},setTest:function(te){te?Y(n.DEPTH_TEST):re(n.DEPTH_TEST)},setMask:function(te){ae!==te&&!L&&(n.depthMask(te),ae=te)},setFunc:function(te){if(xe&&(te=Cy[te]),Me!==te){switch(te){case Ko:n.depthFunc(n.NEVER);break;case Zo:n.depthFunc(n.ALWAYS);break;case jo:n.depthFunc(n.LESS);break;case Vi:n.depthFunc(n.LEQUAL);break;case Jo:n.depthFunc(n.EQUAL);break;case Qo:n.depthFunc(n.GEQUAL);break;case ea:n.depthFunc(n.GREATER);break;case ta:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Me=te}},setLocked:function(te){L=te},setClear:function(te){oe!==te&&(xe&&(te=1-te),n.clearDepth(te),oe=te)},reset:function(){L=!1,ae=null,Me=null,oe=null,xe=!1}}}function r(){let L=!1,xe=null,ae=null,Me=null,oe=null,te=null,fe=null,ke=null,rt=null;return{setTest:function(tt){L||(tt?Y(n.STENCIL_TEST):re(n.STENCIL_TEST))},setMask:function(tt){xe!==tt&&!L&&(n.stencilMask(tt),xe=tt)},setFunc:function(tt,sn,pn){(ae!==tt||Me!==sn||oe!==pn)&&(n.stencilFunc(tt,sn,pn),ae=tt,Me=sn,oe=pn)},setOp:function(tt,sn,pn){(te!==tt||fe!==sn||ke!==pn)&&(n.stencilOp(tt,sn,pn),te=tt,fe=sn,ke=pn)},setLocked:function(tt){L=tt},setClear:function(tt){rt!==tt&&(n.clearStencil(tt),rt=tt)},reset:function(){L=!1,xe=null,ae=null,Me=null,oe=null,te=null,fe=null,ke=null,rt=null}}}const s=new t,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let u={},f={},h=new WeakMap,p=[],g=null,_=!1,m=null,d=null,y=null,S=null,T=null,b=null,A=null,C=new ot(0,0,0),P=0,x=!1,M=null,R=null,O=null,I=null,F=null;const V=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,B=0;const W=n.getParameter(n.VERSION);W.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(W)[1]),z=B>=1):W.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),z=B>=2);let K=null,Q={};const ee=n.getParameter(n.SCISSOR_BOX),$=n.getParameter(n.VIEWPORT),ie=new dt().fromArray(ee),de=new dt().fromArray($);function Ne(L,xe,ae,Me){const oe=new Uint8Array(4),te=n.createTexture();n.bindTexture(L,te),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let fe=0;fe<ae;fe++)L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?n.texImage3D(xe,0,n.RGBA,1,1,Me,0,n.RGBA,n.UNSIGNED_BYTE,oe):n.texImage2D(xe+fe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,oe);return te}const q={};q[n.TEXTURE_2D]=Ne(n.TEXTURE_2D,n.TEXTURE_2D,1),q[n.TEXTURE_CUBE_MAP]=Ne(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[n.TEXTURE_2D_ARRAY]=Ne(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),q[n.TEXTURE_3D]=Ne(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Y(n.DEPTH_TEST),o.setFunc(Vi),Ie(!1),qe(Rc),Y(n.CULL_FACE),be(bn);function Y(L){u[L]!==!0&&(n.enable(L),u[L]=!0)}function re(L){u[L]!==!1&&(n.disable(L),u[L]=!1)}function ye(L,xe){return f[L]!==xe?(n.bindFramebuffer(L,xe),f[L]=xe,L===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=xe),L===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=xe),!0):!1}function pe(L,xe){let ae=p,Me=!1;if(L){ae=h.get(xe),ae===void 0&&(ae=[],h.set(xe,ae));const oe=L.textures;if(ae.length!==oe.length||ae[0]!==n.COLOR_ATTACHMENT0){for(let te=0,fe=oe.length;te<fe;te++)ae[te]=n.COLOR_ATTACHMENT0+te;ae.length=oe.length,Me=!0}}else ae[0]!==n.BACK&&(ae[0]=n.BACK,Me=!0);Me&&n.drawBuffers(ae)}function Te(L){return g!==L?(n.useProgram(L),g=L,!0):!1}const J={[si]:n.FUNC_ADD,[F0]:n.FUNC_SUBTRACT,[N0]:n.FUNC_REVERSE_SUBTRACT};J[U0]=n.MIN,J[O0]=n.MAX;const le={[B0]:n.ZERO,[V0]:n.ONE,[z0]:n.SRC_COLOR,[Yo]:n.SRC_ALPHA,[q0]:n.SRC_ALPHA_SATURATE,[W0]:n.DST_COLOR,[G0]:n.DST_ALPHA,[k0]:n.ONE_MINUS_SRC_COLOR,[$o]:n.ONE_MINUS_SRC_ALPHA,[X0]:n.ONE_MINUS_DST_COLOR,[H0]:n.ONE_MINUS_DST_ALPHA,[Y0]:n.CONSTANT_COLOR,[$0]:n.ONE_MINUS_CONSTANT_COLOR,[K0]:n.CONSTANT_ALPHA,[Z0]:n.ONE_MINUS_CONSTANT_ALPHA};function be(L,xe,ae,Me,oe,te,fe,ke,rt,tt){if(L===bn){_===!0&&(re(n.BLEND),_=!1);return}if(_===!1&&(Y(n.BLEND),_=!0),L!==I0){if(L!==m||tt!==x){if((d!==si||T!==si)&&(n.blendEquation(n.FUNC_ADD),d=si,T=si),tt)switch(L){case Fi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Pc:n.blendFunc(n.ONE,n.ONE);break;case Dc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Lc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Je("WebGLState: Invalid blending: ",L);break}else switch(L){case Fi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Pc:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Dc:Je("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Lc:Je("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Je("WebGLState: Invalid blending: ",L);break}y=null,S=null,b=null,A=null,C.set(0,0,0),P=0,m=L,x=tt}return}oe=oe||xe,te=te||ae,fe=fe||Me,(xe!==d||oe!==T)&&(n.blendEquationSeparate(J[xe],J[oe]),d=xe,T=oe),(ae!==y||Me!==S||te!==b||fe!==A)&&(n.blendFuncSeparate(le[ae],le[Me],le[te],le[fe]),y=ae,S=Me,b=te,A=fe),(ke.equals(C)===!1||rt!==P)&&(n.blendColor(ke.r,ke.g,ke.b,rt),C.copy(ke),P=rt),m=L,x=!1}function ce(L,xe){L.side===Mn?re(n.CULL_FACE):Y(n.CULL_FACE);let ae=L.side===Ft;xe&&(ae=!ae),Ie(ae),L.blending===Fi&&L.transparent===!1?be(bn):be(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),o.setFunc(L.depthFunc),o.setTest(L.depthTest),o.setMask(L.depthWrite),s.setMask(L.colorWrite);const Me=L.stencilWrite;a.setTest(Me),Me&&(a.setMask(L.stencilWriteMask),a.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),a.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),et(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?Y(n.SAMPLE_ALPHA_TO_COVERAGE):re(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ie(L){M!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),M=L)}function qe(L){L!==P0?(Y(n.CULL_FACE),L!==R&&(L===Rc?n.cullFace(n.BACK):L===D0?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):re(n.CULL_FACE),R=L}function D(L){L!==O&&(z&&n.lineWidth(L),O=L)}function et(L,xe,ae){L?(Y(n.POLYGON_OFFSET_FILL),(I!==xe||F!==ae)&&(n.polygonOffset(xe,ae),I=xe,F=ae)):re(n.POLYGON_OFFSET_FILL)}function Be(L){L?Y(n.SCISSOR_TEST):re(n.SCISSOR_TEST)}function $e(L){L===void 0&&(L=n.TEXTURE0+V-1),K!==L&&(n.activeTexture(L),K=L)}function Ce(L,xe,ae){ae===void 0&&(K===null?ae=n.TEXTURE0+V-1:ae=K);let Me=Q[ae];Me===void 0&&(Me={type:void 0,texture:void 0},Q[ae]=Me),(Me.type!==L||Me.texture!==xe)&&(K!==ae&&(n.activeTexture(ae),K=ae),n.bindTexture(L,xe||q[L]),Me.type=L,Me.texture=xe)}function w(){const L=Q[K];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function v(){try{n.compressedTexImage2D(...arguments)}catch(L){Je("WebGLState:",L)}}function N(){try{n.compressedTexImage3D(...arguments)}catch(L){Je("WebGLState:",L)}}function j(){try{n.texSubImage2D(...arguments)}catch(L){Je("WebGLState:",L)}}function ne(){try{n.texSubImage3D(...arguments)}catch(L){Je("WebGLState:",L)}}function Z(){try{n.compressedTexSubImage2D(...arguments)}catch(L){Je("WebGLState:",L)}}function De(){try{n.compressedTexSubImage3D(...arguments)}catch(L){Je("WebGLState:",L)}}function ue(){try{n.texStorage2D(...arguments)}catch(L){Je("WebGLState:",L)}}function Ae(){try{n.texStorage3D(...arguments)}catch(L){Je("WebGLState:",L)}}function Ve(){try{n.texImage2D(...arguments)}catch(L){Je("WebGLState:",L)}}function se(){try{n.texImage3D(...arguments)}catch(L){Je("WebGLState:",L)}}function ge(L){ie.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),ie.copy(L))}function we(L){de.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),de.copy(L))}function Le(L,xe){let ae=c.get(xe);ae===void 0&&(ae=new WeakMap,c.set(xe,ae));let Me=ae.get(L);Me===void 0&&(Me=n.getUniformBlockIndex(xe,L.name),ae.set(L,Me))}function me(L,xe){const Me=c.get(xe).get(L);l.get(xe)!==Me&&(n.uniformBlockBinding(xe,Me,L.__bindingPointIndex),l.set(xe,Me))}function He(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},K=null,Q={},f={},h=new WeakMap,p=[],g=null,_=!1,m=null,d=null,y=null,S=null,T=null,b=null,A=null,C=new ot(0,0,0),P=0,x=!1,M=null,R=null,O=null,I=null,F=null,ie.set(0,0,n.canvas.width,n.canvas.height),de.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:Y,disable:re,bindFramebuffer:ye,drawBuffers:pe,useProgram:Te,setBlending:be,setMaterial:ce,setFlipSided:Ie,setCullFace:qe,setLineWidth:D,setPolygonOffset:et,setScissorTest:Be,activeTexture:$e,bindTexture:Ce,unbindTexture:w,compressedTexImage2D:v,compressedTexImage3D:N,texImage2D:Ve,texImage3D:se,updateUBOMapping:Le,uniformBlockBinding:me,texStorage2D:ue,texStorage3D:Ae,texSubImage2D:j,texSubImage3D:ne,compressedTexSubImage2D:Z,compressedTexSubImage3D:De,scissor:ge,viewport:we,reset:He}}function Py(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Qe,u=new WeakMap;let f;const h=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,v){return p?new OffscreenCanvas(w,v):bs("canvas")}function _(w,v,N){let j=1;const ne=Ce(w);if((ne.width>N||ne.height>N)&&(j=N/Math.max(ne.width,ne.height)),j<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const Z=Math.floor(j*ne.width),De=Math.floor(j*ne.height);f===void 0&&(f=g(Z,De));const ue=v?g(Z,De):f;return ue.width=Z,ue.height=De,ue.getContext("2d").drawImage(w,0,0,Z,De),Ge("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+Z+"x"+De+")."),ue}else return"data"in w&&Ge("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),w;return w}function m(w){return w.generateMipmaps}function d(w){n.generateMipmap(w)}function y(w){return w.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?n.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function S(w,v,N,j,ne=!1){if(w!==null){if(n[w]!==void 0)return n[w];Ge("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Z=v;if(v===n.RED&&(N===n.FLOAT&&(Z=n.R32F),N===n.HALF_FLOAT&&(Z=n.R16F),N===n.UNSIGNED_BYTE&&(Z=n.R8)),v===n.RED_INTEGER&&(N===n.UNSIGNED_BYTE&&(Z=n.R8UI),N===n.UNSIGNED_SHORT&&(Z=n.R16UI),N===n.UNSIGNED_INT&&(Z=n.R32UI),N===n.BYTE&&(Z=n.R8I),N===n.SHORT&&(Z=n.R16I),N===n.INT&&(Z=n.R32I)),v===n.RG&&(N===n.FLOAT&&(Z=n.RG32F),N===n.HALF_FLOAT&&(Z=n.RG16F),N===n.UNSIGNED_BYTE&&(Z=n.RG8)),v===n.RG_INTEGER&&(N===n.UNSIGNED_BYTE&&(Z=n.RG8UI),N===n.UNSIGNED_SHORT&&(Z=n.RG16UI),N===n.UNSIGNED_INT&&(Z=n.RG32UI),N===n.BYTE&&(Z=n.RG8I),N===n.SHORT&&(Z=n.RG16I),N===n.INT&&(Z=n.RG32I)),v===n.RGB_INTEGER&&(N===n.UNSIGNED_BYTE&&(Z=n.RGB8UI),N===n.UNSIGNED_SHORT&&(Z=n.RGB16UI),N===n.UNSIGNED_INT&&(Z=n.RGB32UI),N===n.BYTE&&(Z=n.RGB8I),N===n.SHORT&&(Z=n.RGB16I),N===n.INT&&(Z=n.RGB32I)),v===n.RGBA_INTEGER&&(N===n.UNSIGNED_BYTE&&(Z=n.RGBA8UI),N===n.UNSIGNED_SHORT&&(Z=n.RGBA16UI),N===n.UNSIGNED_INT&&(Z=n.RGBA32UI),N===n.BYTE&&(Z=n.RGBA8I),N===n.SHORT&&(Z=n.RGBA16I),N===n.INT&&(Z=n.RGBA32I)),v===n.RGB&&(N===n.UNSIGNED_INT_5_9_9_9_REV&&(Z=n.RGB9_E5),N===n.UNSIGNED_INT_10F_11F_11F_REV&&(Z=n.R11F_G11F_B10F)),v===n.RGBA){const De=ne?Es:Ze.getTransfer(j);N===n.FLOAT&&(Z=n.RGBA32F),N===n.HALF_FLOAT&&(Z=n.RGBA16F),N===n.UNSIGNED_BYTE&&(Z=De===it?n.SRGB8_ALPHA8:n.RGBA8),N===n.UNSIGNED_SHORT_4_4_4_4&&(Z=n.RGBA4),N===n.UNSIGNED_SHORT_5_5_5_1&&(Z=n.RGB5_A1)}return(Z===n.R16F||Z===n.R32F||Z===n.RG16F||Z===n.RG32F||Z===n.RGBA16F||Z===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function T(w,v){let N;return w?v===null||v===hn||v===br?N=n.DEPTH24_STENCIL8:v===ln?N=n.DEPTH32F_STENCIL8:v===Tr&&(N=n.DEPTH24_STENCIL8,Ge("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===hn||v===br?N=n.DEPTH_COMPONENT24:v===ln?N=n.DEPTH_COMPONENT32F:v===Tr&&(N=n.DEPTH_COMPONENT16),N}function b(w,v){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==yt&&w.minFilter!==St?Math.log2(Math.max(v.width,v.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?v.mipmaps.length:1}function A(w){const v=w.target;v.removeEventListener("dispose",A),P(v),v.isVideoTexture&&u.delete(v)}function C(w){const v=w.target;v.removeEventListener("dispose",C),M(v)}function P(w){const v=i.get(w);if(v.__webglInit===void 0)return;const N=w.source,j=h.get(N);if(j){const ne=j[v.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&x(w),Object.keys(j).length===0&&h.delete(N)}i.remove(w)}function x(w){const v=i.get(w);n.deleteTexture(v.__webglTexture);const N=w.source,j=h.get(N);delete j[v.__cacheKey],o.memory.textures--}function M(w){const v=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(v.__webglFramebuffer[j]))for(let ne=0;ne<v.__webglFramebuffer[j].length;ne++)n.deleteFramebuffer(v.__webglFramebuffer[j][ne]);else n.deleteFramebuffer(v.__webglFramebuffer[j]);v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer[j])}else{if(Array.isArray(v.__webglFramebuffer))for(let j=0;j<v.__webglFramebuffer.length;j++)n.deleteFramebuffer(v.__webglFramebuffer[j]);else n.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&n.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let j=0;j<v.__webglColorRenderbuffer.length;j++)v.__webglColorRenderbuffer[j]&&n.deleteRenderbuffer(v.__webglColorRenderbuffer[j]);v.__webglDepthRenderbuffer&&n.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const N=w.textures;for(let j=0,ne=N.length;j<ne;j++){const Z=i.get(N[j]);Z.__webglTexture&&(n.deleteTexture(Z.__webglTexture),o.memory.textures--),i.remove(N[j])}i.remove(w)}let R=0;function O(){R=0}function I(){const w=R;return w>=r.maxTextures&&Ge("WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+r.maxTextures),R+=1,w}function F(w){const v=[];return v.push(w.wrapS),v.push(w.wrapT),v.push(w.wrapR||0),v.push(w.magFilter),v.push(w.minFilter),v.push(w.anisotropy),v.push(w.internalFormat),v.push(w.format),v.push(w.type),v.push(w.generateMipmaps),v.push(w.premultiplyAlpha),v.push(w.flipY),v.push(w.unpackAlignment),v.push(w.colorSpace),v.join()}function V(w,v){const N=i.get(w);if(w.isVideoTexture&&Be(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&N.__version!==w.version){const j=w.image;if(j===null)Ge("WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)Ge("WebGLRenderer: Texture marked for update but image is incomplete");else{q(N,w,v);return}}else w.isExternalTexture&&(N.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,N.__webglTexture,n.TEXTURE0+v)}function z(w,v){const N=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&N.__version!==w.version){q(N,w,v);return}else w.isExternalTexture&&(N.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,N.__webglTexture,n.TEXTURE0+v)}function B(w,v){const N=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&N.__version!==w.version){q(N,w,v);return}t.bindTexture(n.TEXTURE_3D,N.__webglTexture,n.TEXTURE0+v)}function W(w,v){const N=i.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&N.__version!==w.version){Y(N,w,v);return}t.bindTexture(n.TEXTURE_CUBE_MAP,N.__webglTexture,n.TEXTURE0+v)}const K={[ra]:n.REPEAT,[yn]:n.CLAMP_TO_EDGE,[sa]:n.MIRRORED_REPEAT},Q={[yt]:n.NEAREST,[Q0]:n.NEAREST_MIPMAP_NEAREST,[kr]:n.NEAREST_MIPMAP_LINEAR,[St]:n.LINEAR,[Zs]:n.LINEAR_MIPMAP_NEAREST,[ci]:n.LINEAR_MIPMAP_LINEAR},ee={[i_]:n.NEVER,[l_]:n.ALWAYS,[r_]:n.LESS,[bl]:n.LEQUAL,[s_]:n.EQUAL,[Al]:n.GEQUAL,[o_]:n.GREATER,[a_]:n.NOTEQUAL};function $(w,v){if(v.type===ln&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===St||v.magFilter===Zs||v.magFilter===kr||v.magFilter===ci||v.minFilter===St||v.minFilter===Zs||v.minFilter===kr||v.minFilter===ci)&&Ge("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(w,n.TEXTURE_WRAP_S,K[v.wrapS]),n.texParameteri(w,n.TEXTURE_WRAP_T,K[v.wrapT]),(w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY)&&n.texParameteri(w,n.TEXTURE_WRAP_R,K[v.wrapR]),n.texParameteri(w,n.TEXTURE_MAG_FILTER,Q[v.magFilter]),n.texParameteri(w,n.TEXTURE_MIN_FILTER,Q[v.minFilter]),v.compareFunction&&(n.texParameteri(w,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(w,n.TEXTURE_COMPARE_FUNC,ee[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===yt||v.minFilter!==kr&&v.minFilter!==ci||v.type===ln&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const N=e.get("EXT_texture_filter_anisotropic");n.texParameterf(w,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function ie(w,v){let N=!1;w.__webglInit===void 0&&(w.__webglInit=!0,v.addEventListener("dispose",A));const j=v.source;let ne=h.get(j);ne===void 0&&(ne={},h.set(j,ne));const Z=F(v);if(Z!==w.__cacheKey){ne[Z]===void 0&&(ne[Z]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,N=!0),ne[Z].usedTimes++;const De=ne[w.__cacheKey];De!==void 0&&(ne[w.__cacheKey].usedTimes--,De.usedTimes===0&&x(v)),w.__cacheKey=Z,w.__webglTexture=ne[Z].texture}return N}function de(w,v,N){return Math.floor(Math.floor(w/N)/v)}function Ne(w,v,N,j){const Z=w.updateRanges;if(Z.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,v.width,v.height,N,j,v.data);else{Z.sort((se,ge)=>se.start-ge.start);let De=0;for(let se=1;se<Z.length;se++){const ge=Z[De],we=Z[se],Le=ge.start+ge.count,me=de(we.start,v.width,4),He=de(ge.start,v.width,4);we.start<=Le+1&&me===He&&de(we.start+we.count-1,v.width,4)===me?ge.count=Math.max(ge.count,we.start+we.count-ge.start):(++De,Z[De]=we)}Z.length=De+1;const ue=n.getParameter(n.UNPACK_ROW_LENGTH),Ae=n.getParameter(n.UNPACK_SKIP_PIXELS),Ve=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,v.width);for(let se=0,ge=Z.length;se<ge;se++){const we=Z[se],Le=Math.floor(we.start/4),me=Math.ceil(we.count/4),He=Le%v.width,L=Math.floor(Le/v.width),xe=me,ae=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,He),n.pixelStorei(n.UNPACK_SKIP_ROWS,L),t.texSubImage2D(n.TEXTURE_2D,0,He,L,xe,ae,N,j,v.data)}w.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ue),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ae),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ve)}}function q(w,v,N){let j=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(j=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(j=n.TEXTURE_3D);const ne=ie(w,v),Z=v.source;t.bindTexture(j,w.__webglTexture,n.TEXTURE0+N);const De=i.get(Z);if(Z.version!==De.__version||ne===!0){t.activeTexture(n.TEXTURE0+N);const ue=Ze.getPrimaries(Ze.workingColorSpace),Ae=v.colorSpace===Gn?null:Ze.getPrimaries(v.colorSpace),Ve=v.colorSpace===Gn||ue===Ae?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ve);let se=_(v.image,!1,r.maxTextureSize);se=$e(v,se);const ge=s.convert(v.format,v.colorSpace),we=s.convert(v.type);let Le=S(v.internalFormat,ge,we,v.colorSpace,v.isVideoTexture);$(j,v);let me;const He=v.mipmaps,L=v.isVideoTexture!==!0,xe=De.__version===void 0||ne===!0,ae=Z.dataReady,Me=b(v,se);if(v.isDepthTexture)Le=T(v.format===ui,v.type),xe&&(L?t.texStorage2D(n.TEXTURE_2D,1,Le,se.width,se.height):t.texImage2D(n.TEXTURE_2D,0,Le,se.width,se.height,0,ge,we,null));else if(v.isDataTexture)if(He.length>0){L&&xe&&t.texStorage2D(n.TEXTURE_2D,Me,Le,He[0].width,He[0].height);for(let oe=0,te=He.length;oe<te;oe++)me=He[oe],L?ae&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,me.width,me.height,ge,we,me.data):t.texImage2D(n.TEXTURE_2D,oe,Le,me.width,me.height,0,ge,we,me.data);v.generateMipmaps=!1}else L?(xe&&t.texStorage2D(n.TEXTURE_2D,Me,Le,se.width,se.height),ae&&Ne(v,se,ge,we)):t.texImage2D(n.TEXTURE_2D,0,Le,se.width,se.height,0,ge,we,se.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){L&&xe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Me,Le,He[0].width,He[0].height,se.depth);for(let oe=0,te=He.length;oe<te;oe++)if(me=He[oe],v.format!==qt)if(ge!==null)if(L){if(ae)if(v.layerUpdates.size>0){const fe=tu(me.width,me.height,v.format,v.type);for(const ke of v.layerUpdates){const rt=me.data.subarray(ke*fe/me.data.BYTES_PER_ELEMENT,(ke+1)*fe/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,ke,me.width,me.height,1,ge,rt)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,me.width,me.height,se.depth,ge,me.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,oe,Le,me.width,me.height,se.depth,0,me.data,0,0);else Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?ae&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,me.width,me.height,se.depth,ge,we,me.data):t.texImage3D(n.TEXTURE_2D_ARRAY,oe,Le,me.width,me.height,se.depth,0,ge,we,me.data)}else{L&&xe&&t.texStorage2D(n.TEXTURE_2D,Me,Le,He[0].width,He[0].height);for(let oe=0,te=He.length;oe<te;oe++)me=He[oe],v.format!==qt?ge!==null?L?ae&&t.compressedTexSubImage2D(n.TEXTURE_2D,oe,0,0,me.width,me.height,ge,me.data):t.compressedTexImage2D(n.TEXTURE_2D,oe,Le,me.width,me.height,0,me.data):Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?ae&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,me.width,me.height,ge,we,me.data):t.texImage2D(n.TEXTURE_2D,oe,Le,me.width,me.height,0,ge,we,me.data)}else if(v.isDataArrayTexture)if(L){if(xe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Me,Le,se.width,se.height,se.depth),ae)if(v.layerUpdates.size>0){const oe=tu(se.width,se.height,v.format,v.type);for(const te of v.layerUpdates){const fe=se.data.subarray(te*oe/se.data.BYTES_PER_ELEMENT,(te+1)*oe/se.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,te,se.width,se.height,1,ge,we,fe)}v.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,ge,we,se.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Le,se.width,se.height,se.depth,0,ge,we,se.data);else if(v.isData3DTexture)L?(xe&&t.texStorage3D(n.TEXTURE_3D,Me,Le,se.width,se.height,se.depth),ae&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,ge,we,se.data)):t.texImage3D(n.TEXTURE_3D,0,Le,se.width,se.height,se.depth,0,ge,we,se.data);else if(v.isFramebufferTexture){if(xe)if(L)t.texStorage2D(n.TEXTURE_2D,Me,Le,se.width,se.height);else{let oe=se.width,te=se.height;for(let fe=0;fe<Me;fe++)t.texImage2D(n.TEXTURE_2D,fe,Le,oe,te,0,ge,we,null),oe>>=1,te>>=1}}else if(He.length>0){if(L&&xe){const oe=Ce(He[0]);t.texStorage2D(n.TEXTURE_2D,Me,Le,oe.width,oe.height)}for(let oe=0,te=He.length;oe<te;oe++)me=He[oe],L?ae&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,ge,we,me):t.texImage2D(n.TEXTURE_2D,oe,Le,ge,we,me);v.generateMipmaps=!1}else if(L){if(xe){const oe=Ce(se);t.texStorage2D(n.TEXTURE_2D,Me,Le,oe.width,oe.height)}ae&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ge,we,se)}else t.texImage2D(n.TEXTURE_2D,0,Le,ge,we,se);m(v)&&d(j),De.__version=Z.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function Y(w,v,N){if(v.image.length!==6)return;const j=ie(w,v),ne=v.source;t.bindTexture(n.TEXTURE_CUBE_MAP,w.__webglTexture,n.TEXTURE0+N);const Z=i.get(ne);if(ne.version!==Z.__version||j===!0){t.activeTexture(n.TEXTURE0+N);const De=Ze.getPrimaries(Ze.workingColorSpace),ue=v.colorSpace===Gn?null:Ze.getPrimaries(v.colorSpace),Ae=v.colorSpace===Gn||De===ue?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);const Ve=v.isCompressedTexture||v.image[0].isCompressedTexture,se=v.image[0]&&v.image[0].isDataTexture,ge=[];for(let te=0;te<6;te++)!Ve&&!se?ge[te]=_(v.image[te],!0,r.maxCubemapSize):ge[te]=se?v.image[te].image:v.image[te],ge[te]=$e(v,ge[te]);const we=ge[0],Le=s.convert(v.format,v.colorSpace),me=s.convert(v.type),He=S(v.internalFormat,Le,me,v.colorSpace),L=v.isVideoTexture!==!0,xe=Z.__version===void 0||j===!0,ae=ne.dataReady;let Me=b(v,we);$(n.TEXTURE_CUBE_MAP,v);let oe;if(Ve){L&&xe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Me,He,we.width,we.height);for(let te=0;te<6;te++){oe=ge[te].mipmaps;for(let fe=0;fe<oe.length;fe++){const ke=oe[fe];v.format!==qt?Le!==null?L?ae&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe,0,0,ke.width,ke.height,Le,ke.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe,He,ke.width,ke.height,0,ke.data):Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe,0,0,ke.width,ke.height,Le,me,ke.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe,He,ke.width,ke.height,0,Le,me,ke.data)}}}else{if(oe=v.mipmaps,L&&xe){oe.length>0&&Me++;const te=Ce(ge[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Me,He,te.width,te.height)}for(let te=0;te<6;te++)if(se){L?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,ge[te].width,ge[te].height,Le,me,ge[te].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,He,ge[te].width,ge[te].height,0,Le,me,ge[te].data);for(let fe=0;fe<oe.length;fe++){const rt=oe[fe].image[te].image;L?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe+1,0,0,rt.width,rt.height,Le,me,rt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe+1,He,rt.width,rt.height,0,Le,me,rt.data)}}else{L?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Le,me,ge[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,He,Le,me,ge[te]);for(let fe=0;fe<oe.length;fe++){const ke=oe[fe];L?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe+1,0,0,Le,me,ke.image[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe+1,He,Le,me,ke.image[te])}}}m(v)&&d(n.TEXTURE_CUBE_MAP),Z.__version=ne.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function re(w,v,N,j,ne,Z){const De=s.convert(N.format,N.colorSpace),ue=s.convert(N.type),Ae=S(N.internalFormat,De,ue,N.colorSpace),Ve=i.get(v),se=i.get(N);if(se.__renderTarget=v,!Ve.__hasExternalTextures){const ge=Math.max(1,v.width>>Z),we=Math.max(1,v.height>>Z);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,Z,Ae,ge,we,v.depth,0,De,ue,null):t.texImage2D(ne,Z,Ae,ge,we,0,De,ue,null)}t.bindFramebuffer(n.FRAMEBUFFER,w),et(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,ne,se.__webglTexture,0,D(v)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,j,ne,se.__webglTexture,Z),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ye(w,v,N){if(n.bindRenderbuffer(n.RENDERBUFFER,w),v.depthBuffer){const j=v.depthTexture,ne=j&&j.isDepthTexture?j.type:null,Z=T(v.stencilBuffer,ne),De=v.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;et(v)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,D(v),Z,v.width,v.height):N?n.renderbufferStorageMultisample(n.RENDERBUFFER,D(v),Z,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,Z,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,De,n.RENDERBUFFER,w)}else{const j=v.textures;for(let ne=0;ne<j.length;ne++){const Z=j[ne],De=s.convert(Z.format,Z.colorSpace),ue=s.convert(Z.type),Ae=S(Z.internalFormat,De,ue,Z.colorSpace);et(v)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,D(v),Ae,v.width,v.height):N?n.renderbufferStorageMultisample(n.RENDERBUFFER,D(v),Ae,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,Ae,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function pe(w,v,N){const j=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,w),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ne=i.get(v.depthTexture);if(ne.__renderTarget=v,(!ne.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),j){if(ne.__webglInit===void 0&&(ne.__webglInit=!0,v.depthTexture.addEventListener("dispose",A)),ne.__webglTexture===void 0){ne.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,ne.__webglTexture),$(n.TEXTURE_CUBE_MAP,v.depthTexture);const Ve=s.convert(v.depthTexture.format),se=s.convert(v.depthTexture.type);let ge;v.depthTexture.format===Pn?ge=n.DEPTH_COMPONENT24:v.depthTexture.format===ui&&(ge=n.DEPTH24_STENCIL8);for(let we=0;we<6;we++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+we,0,ge,v.width,v.height,0,Ve,se,null)}}else V(v.depthTexture,0);const Z=ne.__webglTexture,De=D(v),ue=j?n.TEXTURE_CUBE_MAP_POSITIVE_X+N:n.TEXTURE_2D,Ae=v.depthTexture.format===ui?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(v.depthTexture.format===Pn)et(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Ae,ue,Z,0,De):n.framebufferTexture2D(n.FRAMEBUFFER,Ae,ue,Z,0);else if(v.depthTexture.format===ui)et(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Ae,ue,Z,0,De):n.framebufferTexture2D(n.FRAMEBUFFER,Ae,ue,Z,0);else throw new Error("Unknown depthTexture format")}function Te(w){const v=i.get(w),N=w.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==w.depthTexture){const j=w.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),j){const ne=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,j.removeEventListener("dispose",ne)};j.addEventListener("dispose",ne),v.__depthDisposeCallback=ne}v.__boundDepthTexture=j}if(w.depthTexture&&!v.__autoAllocateDepthBuffer)if(N)for(let j=0;j<6;j++)pe(v.__webglFramebuffer[j],w,j);else{const j=w.texture.mipmaps;j&&j.length>0?pe(v.__webglFramebuffer[0],w,0):pe(v.__webglFramebuffer,w,0)}else if(N){v.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[j]),v.__webglDepthbuffer[j]===void 0)v.__webglDepthbuffer[j]=n.createRenderbuffer(),ye(v.__webglDepthbuffer[j],w,!1);else{const ne=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Z=v.__webglDepthbuffer[j];n.bindRenderbuffer(n.RENDERBUFFER,Z),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,Z)}}else{const j=w.texture.mipmaps;if(j&&j.length>0?t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=n.createRenderbuffer(),ye(v.__webglDepthbuffer,w,!1);else{const ne=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Z=v.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,Z),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,Z)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function J(w,v,N){const j=i.get(w);v!==void 0&&re(j.__webglFramebuffer,w,w.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),N!==void 0&&Te(w)}function le(w){const v=w.texture,N=i.get(w),j=i.get(v);w.addEventListener("dispose",C);const ne=w.textures,Z=w.isWebGLCubeRenderTarget===!0,De=ne.length>1;if(De||(j.__webglTexture===void 0&&(j.__webglTexture=n.createTexture()),j.__version=v.version,o.memory.textures++),Z){N.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)if(v.mipmaps&&v.mipmaps.length>0){N.__webglFramebuffer[ue]=[];for(let Ae=0;Ae<v.mipmaps.length;Ae++)N.__webglFramebuffer[ue][Ae]=n.createFramebuffer()}else N.__webglFramebuffer[ue]=n.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){N.__webglFramebuffer=[];for(let ue=0;ue<v.mipmaps.length;ue++)N.__webglFramebuffer[ue]=n.createFramebuffer()}else N.__webglFramebuffer=n.createFramebuffer();if(De)for(let ue=0,Ae=ne.length;ue<Ae;ue++){const Ve=i.get(ne[ue]);Ve.__webglTexture===void 0&&(Ve.__webglTexture=n.createTexture(),o.memory.textures++)}if(w.samples>0&&et(w)===!1){N.__webglMultisampledFramebuffer=n.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let ue=0;ue<ne.length;ue++){const Ae=ne[ue];N.__webglColorRenderbuffer[ue]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,N.__webglColorRenderbuffer[ue]);const Ve=s.convert(Ae.format,Ae.colorSpace),se=s.convert(Ae.type),ge=S(Ae.internalFormat,Ve,se,Ae.colorSpace,w.isXRRenderTarget===!0),we=D(w);n.renderbufferStorageMultisample(n.RENDERBUFFER,we,ge,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.RENDERBUFFER,N.__webglColorRenderbuffer[ue])}n.bindRenderbuffer(n.RENDERBUFFER,null),w.depthBuffer&&(N.__webglDepthRenderbuffer=n.createRenderbuffer(),ye(N.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Z){t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture),$(n.TEXTURE_CUBE_MAP,v);for(let ue=0;ue<6;ue++)if(v.mipmaps&&v.mipmaps.length>0)for(let Ae=0;Ae<v.mipmaps.length;Ae++)re(N.__webglFramebuffer[ue][Ae],w,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Ae);else re(N.__webglFramebuffer[ue],w,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0);m(v)&&d(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(De){for(let ue=0,Ae=ne.length;ue<Ae;ue++){const Ve=ne[ue],se=i.get(Ve);let ge=n.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ge=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ge,se.__webglTexture),$(ge,Ve),re(N.__webglFramebuffer,w,Ve,n.COLOR_ATTACHMENT0+ue,ge,0),m(Ve)&&d(ge)}t.unbindTexture()}else{let ue=n.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ue=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ue,j.__webglTexture),$(ue,v),v.mipmaps&&v.mipmaps.length>0)for(let Ae=0;Ae<v.mipmaps.length;Ae++)re(N.__webglFramebuffer[Ae],w,v,n.COLOR_ATTACHMENT0,ue,Ae);else re(N.__webglFramebuffer,w,v,n.COLOR_ATTACHMENT0,ue,0);m(v)&&d(ue),t.unbindTexture()}w.depthBuffer&&Te(w)}function be(w){const v=w.textures;for(let N=0,j=v.length;N<j;N++){const ne=v[N];if(m(ne)){const Z=y(w),De=i.get(ne).__webglTexture;t.bindTexture(Z,De),d(Z),t.unbindTexture()}}}const ce=[],Ie=[];function qe(w){if(w.samples>0){if(et(w)===!1){const v=w.textures,N=w.width,j=w.height;let ne=n.COLOR_BUFFER_BIT;const Z=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,De=i.get(w),ue=v.length>1;if(ue)for(let Ve=0;Ve<v.length;Ve++)t.bindFramebuffer(n.FRAMEBUFFER,De.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,De.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,De.__webglMultisampledFramebuffer);const Ae=w.texture.mipmaps;Ae&&Ae.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,De.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,De.__webglFramebuffer);for(let Ve=0;Ve<v.length;Ve++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),ue){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,De.__webglColorRenderbuffer[Ve]);const se=i.get(v[Ve]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,se,0)}n.blitFramebuffer(0,0,N,j,0,0,N,j,ne,n.NEAREST),l===!0&&(ce.length=0,Ie.length=0,ce.push(n.COLOR_ATTACHMENT0+Ve),w.depthBuffer&&w.resolveDepthBuffer===!1&&(ce.push(Z),Ie.push(Z),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Ie)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ce))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ue)for(let Ve=0;Ve<v.length;Ve++){t.bindFramebuffer(n.FRAMEBUFFER,De.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.RENDERBUFFER,De.__webglColorRenderbuffer[Ve]);const se=i.get(v[Ve]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,De.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.TEXTURE_2D,se,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,De.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const v=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[v])}}}function D(w){return Math.min(r.maxSamples,w.samples)}function et(w){const v=i.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Be(w){const v=o.render.frame;u.get(w)!==v&&(u.set(w,v),w.update())}function $e(w,v){const N=w.colorSpace,j=w.format,ne=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||N!==Gi&&N!==Gn&&(Ze.getTransfer(N)===it?(j!==qt||ne!==Xt)&&Ge("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Je("WebGLTextures: Unsupported texture color space:",N)),v}function Ce(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=I,this.resetTextureUnits=O,this.setTexture2D=V,this.setTexture2DArray=z,this.setTexture3D=B,this.setTextureCube=W,this.rebindTextures=J,this.setupRenderTarget=le,this.updateRenderTargetMipmap=be,this.updateMultisampleRenderTarget=qe,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=re,this.useMultisampledRTT=et,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Dy(n,e){function t(i,r=Gn){let s;const o=Ze.getTransfer(r);if(i===Xt)return n.UNSIGNED_BYTE;if(i===Sl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Ml)return n.UNSIGNED_SHORT_5_5_5_1;if(i===th)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===nh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Qf)return n.BYTE;if(i===eh)return n.SHORT;if(i===Tr)return n.UNSIGNED_SHORT;if(i===xl)return n.INT;if(i===hn)return n.UNSIGNED_INT;if(i===ln)return n.FLOAT;if(i===dn)return n.HALF_FLOAT;if(i===ih)return n.ALPHA;if(i===rh)return n.RGB;if(i===qt)return n.RGBA;if(i===Pn)return n.DEPTH_COMPONENT;if(i===ui)return n.DEPTH_STENCIL;if(i===sh)return n.RED;if(i===yl)return n.RED_INTEGER;if(i===ki)return n.RG;if(i===El)return n.RG_INTEGER;if(i===Tl)return n.RGBA_INTEGER;if(i===ms||i===gs||i===_s||i===vs)if(o===it)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===ms)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===gs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===_s)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===vs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===ms)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===gs)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===_s)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===vs)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===oa||i===aa||i===la||i===ca)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===oa)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===aa)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===la)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ca)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ua||i===fa||i===ha||i===da||i===pa||i===ma||i===ga)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===ua||i===fa)return o===it?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===ha)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===da)return s.COMPRESSED_R11_EAC;if(i===pa)return s.COMPRESSED_SIGNED_R11_EAC;if(i===ma)return s.COMPRESSED_RG11_EAC;if(i===ga)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===_a||i===va||i===xa||i===Sa||i===Ma||i===ya||i===Ea||i===Ta||i===ba||i===Aa||i===wa||i===Ca||i===Ra||i===Pa)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===_a)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===va)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===xa)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Sa)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ma)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ya)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ea)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ta)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ba)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Aa)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===wa)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ca)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ra)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Pa)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Da||i===La||i===Ia)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Da)return o===it?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===La)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ia)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Fa||i===Na||i===Ua||i===Oa)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Fa)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Na)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ua)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Oa)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===br?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Ly=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Iy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Fy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new vh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new kt({vertexShader:Ly,fragmentShader:Iy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Kt(new Ur(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ny extends Ki{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,f=null,h=null,p=null,g=null;const _=typeof XRWebGLBinding<"u",m=new Fy,d={},y=t.getContextAttributes();let S=null,T=null;const b=[],A=[],C=new Qe;let P=null;const x=new Qt;x.viewport=new dt;const M=new Qt;M.viewport=new dt;const R=[x,M],O=new W_;let I=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let Y=b[q];return Y===void 0&&(Y=new So,b[q]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(q){let Y=b[q];return Y===void 0&&(Y=new So,b[q]=Y),Y.getGripSpace()},this.getHand=function(q){let Y=b[q];return Y===void 0&&(Y=new So,b[q]=Y),Y.getHandSpace()};function V(q){const Y=A.indexOf(q.inputSource);if(Y===-1)return;const re=b[Y];re!==void 0&&(re.update(q.inputSource,q.frame,c||o),re.dispatchEvent({type:q.type,data:q.inputSource}))}function z(){r.removeEventListener("select",V),r.removeEventListener("selectstart",V),r.removeEventListener("selectend",V),r.removeEventListener("squeeze",V),r.removeEventListener("squeezestart",V),r.removeEventListener("squeezeend",V),r.removeEventListener("end",z),r.removeEventListener("inputsourceschange",B);for(let q=0;q<b.length;q++){const Y=A[q];Y!==null&&(A[q]=null,b[q].disconnect(Y))}I=null,F=null,m.reset();for(const q in d)delete d[q];e.setRenderTarget(S),p=null,h=null,f=null,r=null,T=null,Ne.stop(),i.isPresenting=!1,e.setPixelRatio(P),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,i.isPresenting===!0&&Ge("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,i.isPresenting===!0&&Ge("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(r,t)),f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(q){if(r=q,r!==null){if(S=e.getRenderTarget(),r.addEventListener("select",V),r.addEventListener("selectstart",V),r.addEventListener("selectend",V),r.addEventListener("squeeze",V),r.addEventListener("squeezestart",V),r.addEventListener("squeezeend",V),r.addEventListener("end",z),r.addEventListener("inputsourceschange",B),y.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let re=null,ye=null,pe=null;y.depth&&(pe=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=y.stencil?ui:Pn,ye=y.stencil?br:hn);const Te={colorFormat:t.RGBA8,depthFormat:pe,scaleFactor:s};f=this.getBinding(),h=f.createProjectionLayer(Te),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),T=new rn(h.textureWidth,h.textureHeight,{format:qt,type:Xt,depthTexture:new wr(h.textureWidth,h.textureHeight,ye,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const re={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,re),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),T=new rn(p.framebufferWidth,p.framebufferHeight,{format:qt,type:Xt,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Ne.setContext(r),Ne.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function B(q){for(let Y=0;Y<q.removed.length;Y++){const re=q.removed[Y],ye=A.indexOf(re);ye>=0&&(A[ye]=null,b[ye].disconnect(re))}for(let Y=0;Y<q.added.length;Y++){const re=q.added[Y];let ye=A.indexOf(re);if(ye===-1){for(let Te=0;Te<b.length;Te++)if(Te>=A.length){A.push(re),ye=Te;break}else if(A[Te]===null){A[Te]=re,ye=Te;break}if(ye===-1)break}const pe=b[ye];pe&&pe.connect(re)}}const W=new G,K=new G;function Q(q,Y,re){W.setFromMatrixPosition(Y.matrixWorld),K.setFromMatrixPosition(re.matrixWorld);const ye=W.distanceTo(K),pe=Y.projectionMatrix.elements,Te=re.projectionMatrix.elements,J=pe[14]/(pe[10]-1),le=pe[14]/(pe[10]+1),be=(pe[9]+1)/pe[5],ce=(pe[9]-1)/pe[5],Ie=(pe[8]-1)/pe[0],qe=(Te[8]+1)/Te[0],D=J*Ie,et=J*qe,Be=ye/(-Ie+qe),$e=Be*-Ie;if(Y.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX($e),q.translateZ(Be),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),pe[10]===-1)q.projectionMatrix.copy(Y.projectionMatrix),q.projectionMatrixInverse.copy(Y.projectionMatrixInverse);else{const Ce=J+Be,w=le+Be,v=D-$e,N=et+(ye-$e),j=be*le/w*Ce,ne=ce*le/w*Ce;q.projectionMatrix.makePerspective(v,N,j,ne,Ce,w),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function ee(q,Y){Y===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(Y.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(r===null)return;let Y=q.near,re=q.far;m.texture!==null&&(m.depthNear>0&&(Y=m.depthNear),m.depthFar>0&&(re=m.depthFar)),O.near=M.near=x.near=Y,O.far=M.far=x.far=re,(I!==O.near||F!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),I=O.near,F=O.far),O.layers.mask=q.layers.mask|6,x.layers.mask=O.layers.mask&3,M.layers.mask=O.layers.mask&5;const ye=q.parent,pe=O.cameras;ee(O,ye);for(let Te=0;Te<pe.length;Te++)ee(pe[Te],ye);pe.length===2?Q(O,x,M):O.projectionMatrix.copy(x.projectionMatrix),$(q,O,ye)};function $(q,Y,re){re===null?q.matrix.copy(Y.matrixWorld):(q.matrix.copy(re.matrixWorld),q.matrix.invert(),q.matrix.multiply(Y.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(Y.projectionMatrix),q.projectionMatrixInverse.copy(Y.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Ba*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(h===null&&p===null))return l},this.setFoveation=function(q){l=q,h!==null&&(h.fixedFoveation=q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(O)},this.getCameraTexture=function(q){return d[q]};let ie=null;function de(q,Y){if(u=Y.getViewerPose(c||o),g=Y,u!==null){const re=u.views;p!==null&&(e.setRenderTargetFramebuffer(T,p.framebuffer),e.setRenderTarget(T));let ye=!1;re.length!==O.cameras.length&&(O.cameras.length=0,ye=!0);for(let le=0;le<re.length;le++){const be=re[le];let ce=null;if(p!==null)ce=p.getViewport(be);else{const qe=f.getViewSubImage(h,be);ce=qe.viewport,le===0&&(e.setRenderTargetTextures(T,qe.colorTexture,qe.depthStencilTexture),e.setRenderTarget(T))}let Ie=R[le];Ie===void 0&&(Ie=new Qt,Ie.layers.enable(le),Ie.viewport=new dt,R[le]=Ie),Ie.matrix.fromArray(be.transform.matrix),Ie.matrix.decompose(Ie.position,Ie.quaternion,Ie.scale),Ie.projectionMatrix.fromArray(be.projectionMatrix),Ie.projectionMatrixInverse.copy(Ie.projectionMatrix).invert(),Ie.viewport.set(ce.x,ce.y,ce.width,ce.height),le===0&&(O.matrix.copy(Ie.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),ye===!0&&O.cameras.push(Ie)}const pe=r.enabledFeatures;if(pe&&pe.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){f=i.getBinding();const le=f.getDepthInformation(re[0]);le&&le.isValid&&le.texture&&m.init(le,r.renderState)}if(pe&&pe.includes("camera-access")&&_){e.state.unbindTexture(),f=i.getBinding();for(let le=0;le<re.length;le++){const be=re[le].camera;if(be){let ce=d[be];ce||(ce=new vh,d[be]=ce);const Ie=f.getCameraImage(be);ce.sourceTexture=Ie}}}}for(let re=0;re<b.length;re++){const ye=A[re],pe=b[re];ye!==null&&pe!==void 0&&pe.update(ye,Y,c||o)}ie&&ie(q,Y),Y.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Y}),g=null}const Ne=new xh;Ne.setAnimationLoop(de),this.setAnimationLoop=function(q){ie=q},this.dispose=function(){}}}const ii=new Dn,Uy=new gt;function Oy(n,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,dh(n)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function r(m,d,y,S,T){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(m,d):d.isMeshToonMaterial?(s(m,d),f(m,d)):d.isMeshPhongMaterial?(s(m,d),u(m,d)):d.isMeshStandardMaterial?(s(m,d),h(m,d),d.isMeshPhysicalMaterial&&p(m,d,T)):d.isMeshMatcapMaterial?(s(m,d),g(m,d)):d.isMeshDepthMaterial?s(m,d):d.isMeshDistanceMaterial?(s(m,d),_(m,d)):d.isMeshNormalMaterial?s(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?l(m,d,y,S):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Ft&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Ft&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const y=e.get(d),S=y.envMap,T=y.envMapRotation;S&&(m.envMap.value=S,ii.copy(T),ii.x*=-1,ii.y*=-1,ii.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(ii.y*=-1,ii.z*=-1),m.envMapRotation.value.setFromMatrix4(Uy.makeRotationFromEuler(ii)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,y,S){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*y,m.scale.value=S*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function f(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function h(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,y){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ft&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function _(m,d){const y=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function By(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,S){const T=S.program;i.uniformBlockBinding(y,T)}function c(y,S){let T=r[y.id];T===void 0&&(g(y),T=u(y),r[y.id]=T,y.addEventListener("dispose",m));const b=S.program;i.updateUBOMapping(y,b);const A=e.render.frame;s[y.id]!==A&&(h(y),s[y.id]=A)}function u(y){const S=f();y.__bindingPointIndex=S;const T=n.createBuffer(),b=y.__size,A=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,b,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,T),T}function f(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return Je("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(y){const S=r[y.id],T=y.uniforms,b=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let A=0,C=T.length;A<C;A++){const P=Array.isArray(T[A])?T[A]:[T[A]];for(let x=0,M=P.length;x<M;x++){const R=P[x];if(p(R,A,x,b)===!0){const O=R.__offset,I=Array.isArray(R.value)?R.value:[R.value];let F=0;for(let V=0;V<I.length;V++){const z=I[V],B=_(z);typeof z=="number"||typeof z=="boolean"?(R.__data[0]=z,n.bufferSubData(n.UNIFORM_BUFFER,O+F,R.__data)):z.isMatrix3?(R.__data[0]=z.elements[0],R.__data[1]=z.elements[1],R.__data[2]=z.elements[2],R.__data[3]=0,R.__data[4]=z.elements[3],R.__data[5]=z.elements[4],R.__data[6]=z.elements[5],R.__data[7]=0,R.__data[8]=z.elements[6],R.__data[9]=z.elements[7],R.__data[10]=z.elements[8],R.__data[11]=0):(z.toArray(R.__data,F),F+=B.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,O,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(y,S,T,b){const A=y.value,C=S+"_"+T;if(b[C]===void 0)return typeof A=="number"||typeof A=="boolean"?b[C]=A:b[C]=A.clone(),!0;{const P=b[C];if(typeof A=="number"||typeof A=="boolean"){if(P!==A)return b[C]=A,!0}else if(P.equals(A)===!1)return P.copy(A),!0}return!1}function g(y){const S=y.uniforms;let T=0;const b=16;for(let C=0,P=S.length;C<P;C++){const x=Array.isArray(S[C])?S[C]:[S[C]];for(let M=0,R=x.length;M<R;M++){const O=x[M],I=Array.isArray(O.value)?O.value:[O.value];for(let F=0,V=I.length;F<V;F++){const z=I[F],B=_(z),W=T%b,K=W%B.boundary,Q=W+K;T+=K,Q!==0&&b-Q<B.storage&&(T+=b-Q),O.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=T,T+=B.storage}}}const A=T%b;return A>0&&(T+=b-A),y.__size=T,y.__cache={},this}function _(y){const S={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(S.boundary=4,S.storage=4):y.isVector2?(S.boundary=8,S.storage=8):y.isVector3||y.isColor?(S.boundary=16,S.storage=12):y.isVector4?(S.boundary=16,S.storage=16):y.isMatrix3?(S.boundary=48,S.storage=48):y.isMatrix4?(S.boundary=64,S.storage=64):y.isTexture?Ge("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Ge("WebGLRenderer: Unsupported uniform value type.",y),S}function m(y){const S=y.target;S.removeEventListener("dispose",m);const T=o.indexOf(S.__bindingPointIndex);o.splice(T,1),n.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function d(){for(const y in r)n.deleteBuffer(r[y]);o=[],r={},s={}}return{bind:l,update:c,dispose:d}}const Vy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let on=null;function zy(){return on===null&&(on=new U_(Vy,16,16,ki,dn),on.name="DFG_LUT",on.minFilter=St,on.magFilter=St,on.wrapS=yn,on.wrapT=yn,on.generateMipmaps=!1,on.needsUpdate=!0),on}class ky{constructor(e={}){const{canvas:t=c_(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:p=Xt}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;const _=p,m=new Set([Tl,El,yl]),d=new Set([Xt,hn,Tr,br,Sl,Ml]),y=new Uint32Array(4),S=new Int32Array(4);let T=null,b=null;const A=[],C=[];let P=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=un,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const x=this;let M=!1;this._outputColorSpace=Wt;let R=0,O=0,I=null,F=-1,V=null;const z=new dt,B=new dt;let W=null;const K=new ot(0);let Q=0,ee=t.width,$=t.height,ie=1,de=null,Ne=null;const q=new dt(0,0,ee,$),Y=new dt(0,0,ee,$);let re=!1;const ye=new _h;let pe=!1,Te=!1;const J=new gt,le=new G,be=new dt,ce={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ie=!1;function qe(){return I===null?ie:1}let D=i;function et(E,U){return t.getContext(E,U)}try{const E={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${vl}`),t.addEventListener("webglcontextlost",ke,!1),t.addEventListener("webglcontextrestored",rt,!1),t.addEventListener("webglcontextcreationerror",tt,!1),D===null){const U="webgl2";if(D=et(U,E),D===null)throw et(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw Je("WebGLRenderer: "+E.message),E}let Be,$e,Ce,w,v,N,j,ne,Z,De,ue,Ae,Ve,se,ge,we,Le,me,He,L,xe,ae,Me,oe;function te(){Be=new zS(D),Be.init(),ae=new Dy(D,Be),$e=new DS(D,Be,e,ae),Ce=new Ry(D,Be),$e.reversedDepthBuffer&&h&&Ce.buffers.depth.setReversed(!0),w=new HS(D),v=new py,N=new Py(D,Be,Ce,v,$e,ae,w),j=new IS(x),ne=new VS(x),Z=new Y_(D),Me=new RS(D,Z),De=new kS(D,Z,w,Me),ue=new XS(D,De,Z,w),He=new WS(D,$e,N),we=new LS(v),Ae=new dy(x,j,ne,Be,$e,Me,we),Ve=new Oy(x,v),se=new gy,ge=new yy(Be),me=new CS(x,j,ne,Ce,ue,g,l),Le=new wy(x,ue,$e),oe=new By(D,w,$e,Ce),L=new PS(D,Be,w),xe=new GS(D,Be,w),w.programs=Ae.programs,x.capabilities=$e,x.extensions=Be,x.properties=v,x.renderLists=se,x.shadowMap=Le,x.state=Ce,x.info=w}te(),_!==Xt&&(P=new YS(_,t.width,t.height,r,s));const fe=new Ny(x,D);this.xr=fe,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const E=Be.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Be.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(E){E!==void 0&&(ie=E,this.setSize(ee,$,!1))},this.getSize=function(E){return E.set(ee,$)},this.setSize=function(E,U,X=!0){if(fe.isPresenting){Ge("WebGLRenderer: Can't change size while VR device is presenting.");return}ee=E,$=U,t.width=Math.floor(E*ie),t.height=Math.floor(U*ie),X===!0&&(t.style.width=E+"px",t.style.height=U+"px"),P!==null&&P.setSize(t.width,t.height),this.setViewport(0,0,E,U)},this.getDrawingBufferSize=function(E){return E.set(ee*ie,$*ie).floor()},this.setDrawingBufferSize=function(E,U,X){ee=E,$=U,ie=X,t.width=Math.floor(E*X),t.height=Math.floor(U*X),this.setViewport(0,0,E,U)},this.setEffects=function(E){if(_===Xt){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let U=0;U<E.length;U++)if(E[U].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}P.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(z)},this.getViewport=function(E){return E.copy(q)},this.setViewport=function(E,U,X,H){E.isVector4?q.set(E.x,E.y,E.z,E.w):q.set(E,U,X,H),Ce.viewport(z.copy(q).multiplyScalar(ie).round())},this.getScissor=function(E){return E.copy(Y)},this.setScissor=function(E,U,X,H){E.isVector4?Y.set(E.x,E.y,E.z,E.w):Y.set(E,U,X,H),Ce.scissor(B.copy(Y).multiplyScalar(ie).round())},this.getScissorTest=function(){return re},this.setScissorTest=function(E){Ce.setScissorTest(re=E)},this.setOpaqueSort=function(E){de=E},this.setTransparentSort=function(E){Ne=E},this.getClearColor=function(E){return E.copy(me.getClearColor())},this.setClearColor=function(){me.setClearColor(...arguments)},this.getClearAlpha=function(){return me.getClearAlpha()},this.setClearAlpha=function(){me.setClearAlpha(...arguments)},this.clear=function(E=!0,U=!0,X=!0){let H=0;if(E){let k=!1;if(I!==null){const _e=I.texture.format;k=m.has(_e)}if(k){const _e=I.texture.type,Ee=d.has(_e),Se=me.getClearColor(),Re=me.getClearAlpha(),Fe=Se.r,ze=Se.g,Ue=Se.b;Ee?(y[0]=Fe,y[1]=ze,y[2]=Ue,y[3]=Re,D.clearBufferuiv(D.COLOR,0,y)):(S[0]=Fe,S[1]=ze,S[2]=Ue,S[3]=Re,D.clearBufferiv(D.COLOR,0,S))}else H|=D.COLOR_BUFFER_BIT}U&&(H|=D.DEPTH_BUFFER_BIT),X&&(H|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ke,!1),t.removeEventListener("webglcontextrestored",rt,!1),t.removeEventListener("webglcontextcreationerror",tt,!1),me.dispose(),se.dispose(),ge.dispose(),v.dispose(),j.dispose(),ne.dispose(),ue.dispose(),Me.dispose(),oe.dispose(),Ae.dispose(),fe.dispose(),fe.removeEventListener("sessionstart",Pl),fe.removeEventListener("sessionend",Dl),$n.stop()};function ke(E){E.preventDefault(),Oc("WebGLRenderer: Context Lost."),M=!0}function rt(){Oc("WebGLRenderer: Context Restored."),M=!1;const E=w.autoReset,U=Le.enabled,X=Le.autoUpdate,H=Le.needsUpdate,k=Le.type;te(),w.autoReset=E,Le.enabled=U,Le.autoUpdate=X,Le.needsUpdate=H,Le.type=k}function tt(E){Je("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function sn(E){const U=E.target;U.removeEventListener("dispose",sn),pn(U)}function pn(E){Th(E),v.remove(E)}function Th(E){const U=v.get(E).programs;U!==void 0&&(U.forEach(function(X){Ae.releaseProgram(X)}),E.isShaderMaterial&&Ae.releaseShaderCache(E))}this.renderBufferDirect=function(E,U,X,H,k,_e){U===null&&(U=ce);const Ee=k.isMesh&&k.matrixWorld.determinant()<0,Se=Ah(E,U,X,H,k);Ce.setMaterial(H,Ee);let Re=X.index,Fe=1;if(H.wireframe===!0){if(Re=De.getWireframeAttribute(X),Re===void 0)return;Fe=2}const ze=X.drawRange,Ue=X.attributes.position;let Ye=ze.start*Fe,st=(ze.start+ze.count)*Fe;_e!==null&&(Ye=Math.max(Ye,_e.start*Fe),st=Math.min(st,(_e.start+_e.count)*Fe)),Re!==null?(Ye=Math.max(Ye,0),st=Math.min(st,Re.count)):Ue!=null&&(Ye=Math.max(Ye,0),st=Math.min(st,Ue.count));const ut=st-Ye;if(ut<0||ut===1/0)return;Me.setup(k,H,Se,X,Re);let ft,at=L;if(Re!==null&&(ft=Z.get(Re),at=xe,at.setIndex(ft)),k.isMesh)H.wireframe===!0?(Ce.setLineWidth(H.wireframeLinewidth*qe()),at.setMode(D.LINES)):at.setMode(D.TRIANGLES);else if(k.isLine){let Oe=H.linewidth;Oe===void 0&&(Oe=1),Ce.setLineWidth(Oe*qe()),k.isLineSegments?at.setMode(D.LINES):k.isLineLoop?at.setMode(D.LINE_LOOP):at.setMode(D.LINE_STRIP)}else k.isPoints?at.setMode(D.POINTS):k.isSprite&&at.setMode(D.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Ar("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),at.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Be.get("WEBGL_multi_draw"))at.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Oe=k._multiDrawStarts,nt=k._multiDrawCounts,je=k._multiDrawCount,Nt=Re?Z.get(Re).bytesPerElement:1,gi=v.get(H).currentProgram.getUniforms();for(let Ut=0;Ut<je;Ut++)gi.setValue(D,"_gl_DrawID",Ut),at.render(Oe[Ut]/Nt,nt[Ut])}else if(k.isInstancedMesh)at.renderInstances(Ye,ut,k.count);else if(X.isInstancedBufferGeometry){const Oe=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,nt=Math.min(X.instanceCount,Oe);at.renderInstances(Ye,ut,nt)}else at.render(Ye,ut)};function Rl(E,U,X){E.transparent===!0&&E.side===Mn&&E.forceSinglePass===!1?(E.side=Ft,E.needsUpdate=!0,Br(E,U,X),E.side=Yn,E.needsUpdate=!0,Br(E,U,X),E.side=Mn):Br(E,U,X)}this.compile=function(E,U,X=null){X===null&&(X=E),b=ge.get(X),b.init(U),C.push(b),X.traverseVisible(function(k){k.isLight&&k.layers.test(U.layers)&&(b.pushLight(k),k.castShadow&&b.pushShadow(k))}),E!==X&&E.traverseVisible(function(k){k.isLight&&k.layers.test(U.layers)&&(b.pushLight(k),k.castShadow&&b.pushShadow(k))}),b.setupLights();const H=new Set;return E.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const _e=k.material;if(_e)if(Array.isArray(_e))for(let Ee=0;Ee<_e.length;Ee++){const Se=_e[Ee];Rl(Se,X,k),H.add(Se)}else Rl(_e,X,k),H.add(_e)}),b=C.pop(),H},this.compileAsync=function(E,U,X=null){const H=this.compile(E,U,X);return new Promise(k=>{function _e(){if(H.forEach(function(Ee){v.get(Ee).currentProgram.isReady()&&H.delete(Ee)}),H.size===0){k(E);return}setTimeout(_e,10)}Be.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let Ns=null;function bh(E){Ns&&Ns(E)}function Pl(){$n.stop()}function Dl(){$n.start()}const $n=new xh;$n.setAnimationLoop(bh),typeof self<"u"&&$n.setContext(self),this.setAnimationLoop=function(E){Ns=E,fe.setAnimationLoop(E),E===null?$n.stop():$n.start()},fe.addEventListener("sessionstart",Pl),fe.addEventListener("sessionend",Dl),this.render=function(E,U){if(U!==void 0&&U.isCamera!==!0){Je("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;const X=fe.enabled===!0&&fe.isPresenting===!0,H=P!==null&&(I===null||X)&&P.begin(x,I);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),fe.enabled===!0&&fe.isPresenting===!0&&(P===null||P.isCompositing()===!1)&&(fe.cameraAutoUpdate===!0&&fe.updateCamera(U),U=fe.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,U,I),b=ge.get(E,C.length),b.init(U),C.push(b),J.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),ye.setFromProjectionMatrix(J,cn,U.reversedDepth),Te=this.localClippingEnabled,pe=we.init(this.clippingPlanes,Te),T=se.get(E,A.length),T.init(),A.push(T),fe.enabled===!0&&fe.isPresenting===!0){const Ee=x.xr.getDepthSensingMesh();Ee!==null&&Us(Ee,U,-1/0,x.sortObjects)}Us(E,U,0,x.sortObjects),T.finish(),x.sortObjects===!0&&T.sort(de,Ne),Ie=fe.enabled===!1||fe.isPresenting===!1||fe.hasDepthSensing()===!1,Ie&&me.addToRenderList(T,E),this.info.render.frame++,pe===!0&&we.beginShadows();const k=b.state.shadowsArray;if(Le.render(k,E,U),pe===!0&&we.endShadows(),this.info.autoReset===!0&&this.info.reset(),(H&&P.hasRenderPass())===!1){const Ee=T.opaque,Se=T.transmissive;if(b.setupLights(),U.isArrayCamera){const Re=U.cameras;if(Se.length>0)for(let Fe=0,ze=Re.length;Fe<ze;Fe++){const Ue=Re[Fe];Il(Ee,Se,E,Ue)}Ie&&me.render(E);for(let Fe=0,ze=Re.length;Fe<ze;Fe++){const Ue=Re[Fe];Ll(T,E,Ue,Ue.viewport)}}else Se.length>0&&Il(Ee,Se,E,U),Ie&&me.render(E),Ll(T,E,U)}I!==null&&O===0&&(N.updateMultisampleRenderTarget(I),N.updateRenderTargetMipmap(I)),H&&P.end(x),E.isScene===!0&&E.onAfterRender(x,E,U),Me.resetDefaultState(),F=-1,V=null,C.pop(),C.length>0?(b=C[C.length-1],pe===!0&&we.setGlobalState(x.clippingPlanes,b.state.camera)):b=null,A.pop(),A.length>0?T=A[A.length-1]:T=null};function Us(E,U,X,H){if(E.visible===!1)return;if(E.layers.test(U.layers)){if(E.isGroup)X=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(U);else if(E.isLight)b.pushLight(E),E.castShadow&&b.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||ye.intersectsSprite(E)){H&&be.setFromMatrixPosition(E.matrixWorld).applyMatrix4(J);const Ee=ue.update(E),Se=E.material;Se.visible&&T.push(E,Ee,Se,X,be.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||ye.intersectsObject(E))){const Ee=ue.update(E),Se=E.material;if(H&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),be.copy(E.boundingSphere.center)):(Ee.boundingSphere===null&&Ee.computeBoundingSphere(),be.copy(Ee.boundingSphere.center)),be.applyMatrix4(E.matrixWorld).applyMatrix4(J)),Array.isArray(Se)){const Re=Ee.groups;for(let Fe=0,ze=Re.length;Fe<ze;Fe++){const Ue=Re[Fe],Ye=Se[Ue.materialIndex];Ye&&Ye.visible&&T.push(E,Ee,Ye,X,be.z,Ue)}}else Se.visible&&T.push(E,Ee,Se,X,be.z,null)}}const _e=E.children;for(let Ee=0,Se=_e.length;Ee<Se;Ee++)Us(_e[Ee],U,X,H)}function Ll(E,U,X,H){const{opaque:k,transmissive:_e,transparent:Ee}=E;b.setupLightsView(X),pe===!0&&we.setGlobalState(x.clippingPlanes,X),H&&Ce.viewport(z.copy(H)),k.length>0&&Or(k,U,X),_e.length>0&&Or(_e,U,X),Ee.length>0&&Or(Ee,U,X),Ce.buffers.depth.setTest(!0),Ce.buffers.depth.setMask(!0),Ce.buffers.color.setMask(!0),Ce.setPolygonOffset(!1)}function Il(E,U,X,H){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[H.id]===void 0){const Ye=Be.has("EXT_color_buffer_half_float")||Be.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[H.id]=new rn(1,1,{generateMipmaps:!0,type:Ye?dn:Xt,minFilter:ci,samples:$e.samples,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ze.workingColorSpace})}const _e=b.state.transmissionRenderTarget[H.id],Ee=H.viewport||z;_e.setSize(Ee.z*x.transmissionResolutionScale,Ee.w*x.transmissionResolutionScale);const Se=x.getRenderTarget(),Re=x.getActiveCubeFace(),Fe=x.getActiveMipmapLevel();x.setRenderTarget(_e),x.getClearColor(K),Q=x.getClearAlpha(),Q<1&&x.setClearColor(16777215,.5),x.clear(),Ie&&me.render(X);const ze=x.toneMapping;x.toneMapping=un;const Ue=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),b.setupLightsView(H),pe===!0&&we.setGlobalState(x.clippingPlanes,H),Or(E,X,H),N.updateMultisampleRenderTarget(_e),N.updateRenderTargetMipmap(_e),Be.has("WEBGL_multisampled_render_to_texture")===!1){let Ye=!1;for(let st=0,ut=U.length;st<ut;st++){const ft=U[st],{object:at,geometry:Oe,material:nt,group:je}=ft;if(nt.side===Mn&&at.layers.test(H.layers)){const Nt=nt.side;nt.side=Ft,nt.needsUpdate=!0,Fl(at,X,H,Oe,nt,je),nt.side=Nt,nt.needsUpdate=!0,Ye=!0}}Ye===!0&&(N.updateMultisampleRenderTarget(_e),N.updateRenderTargetMipmap(_e))}x.setRenderTarget(Se,Re,Fe),x.setClearColor(K,Q),Ue!==void 0&&(H.viewport=Ue),x.toneMapping=ze}function Or(E,U,X){const H=U.isScene===!0?U.overrideMaterial:null;for(let k=0,_e=E.length;k<_e;k++){const Ee=E[k],{object:Se,geometry:Re,group:Fe}=Ee;let ze=Ee.material;ze.allowOverride===!0&&H!==null&&(ze=H),Se.layers.test(X.layers)&&Fl(Se,U,X,Re,ze,Fe)}}function Fl(E,U,X,H,k,_e){E.onBeforeRender(x,U,X,H,k,_e),E.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),k.onBeforeRender(x,U,X,H,E,_e),k.transparent===!0&&k.side===Mn&&k.forceSinglePass===!1?(k.side=Ft,k.needsUpdate=!0,x.renderBufferDirect(X,U,H,k,E,_e),k.side=Yn,k.needsUpdate=!0,x.renderBufferDirect(X,U,H,k,E,_e),k.side=Mn):x.renderBufferDirect(X,U,H,k,E,_e),E.onAfterRender(x,U,X,H,k,_e)}function Br(E,U,X){U.isScene!==!0&&(U=ce);const H=v.get(E),k=b.state.lights,_e=b.state.shadowsArray,Ee=k.state.version,Se=Ae.getParameters(E,k.state,_e,U,X),Re=Ae.getProgramCacheKey(Se);let Fe=H.programs;H.environment=E.isMeshStandardMaterial?U.environment:null,H.fog=U.fog,H.envMap=(E.isMeshStandardMaterial?ne:j).get(E.envMap||H.environment),H.envMapRotation=H.environment!==null&&E.envMap===null?U.environmentRotation:E.envMapRotation,Fe===void 0&&(E.addEventListener("dispose",sn),Fe=new Map,H.programs=Fe);let ze=Fe.get(Re);if(ze!==void 0){if(H.currentProgram===ze&&H.lightsStateVersion===Ee)return Ul(E,Se),ze}else Se.uniforms=Ae.getUniforms(E),E.onBeforeCompile(Se,x),ze=Ae.acquireProgram(Se,Re),Fe.set(Re,ze),H.uniforms=Se.uniforms;const Ue=H.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ue.clippingPlanes=we.uniform),Ul(E,Se),H.needsLights=Ch(E),H.lightsStateVersion=Ee,H.needsLights&&(Ue.ambientLightColor.value=k.state.ambient,Ue.lightProbe.value=k.state.probe,Ue.directionalLights.value=k.state.directional,Ue.directionalLightShadows.value=k.state.directionalShadow,Ue.spotLights.value=k.state.spot,Ue.spotLightShadows.value=k.state.spotShadow,Ue.rectAreaLights.value=k.state.rectArea,Ue.ltc_1.value=k.state.rectAreaLTC1,Ue.ltc_2.value=k.state.rectAreaLTC2,Ue.pointLights.value=k.state.point,Ue.pointLightShadows.value=k.state.pointShadow,Ue.hemisphereLights.value=k.state.hemi,Ue.directionalShadowMap.value=k.state.directionalShadowMap,Ue.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ue.spotShadowMap.value=k.state.spotShadowMap,Ue.spotLightMatrix.value=k.state.spotLightMatrix,Ue.spotLightMap.value=k.state.spotLightMap,Ue.pointShadowMap.value=k.state.pointShadowMap,Ue.pointShadowMatrix.value=k.state.pointShadowMatrix),H.currentProgram=ze,H.uniformsList=null,ze}function Nl(E){if(E.uniformsList===null){const U=E.currentProgram.getUniforms();E.uniformsList=xs.seqWithValue(U.seq,E.uniforms)}return E.uniformsList}function Ul(E,U){const X=v.get(E);X.outputColorSpace=U.outputColorSpace,X.batching=U.batching,X.batchingColor=U.batchingColor,X.instancing=U.instancing,X.instancingColor=U.instancingColor,X.instancingMorph=U.instancingMorph,X.skinning=U.skinning,X.morphTargets=U.morphTargets,X.morphNormals=U.morphNormals,X.morphColors=U.morphColors,X.morphTargetsCount=U.morphTargetsCount,X.numClippingPlanes=U.numClippingPlanes,X.numIntersection=U.numClipIntersection,X.vertexAlphas=U.vertexAlphas,X.vertexTangents=U.vertexTangents,X.toneMapping=U.toneMapping}function Ah(E,U,X,H,k){U.isScene!==!0&&(U=ce),N.resetTextureUnits();const _e=U.fog,Ee=H.isMeshStandardMaterial?U.environment:null,Se=I===null?x.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Gi,Re=(H.isMeshStandardMaterial?ne:j).get(H.envMap||Ee),Fe=H.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,ze=!!X.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ue=!!X.morphAttributes.position,Ye=!!X.morphAttributes.normal,st=!!X.morphAttributes.color;let ut=un;H.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(ut=x.toneMapping);const ft=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,at=ft!==void 0?ft.length:0,Oe=v.get(H),nt=b.state.lights;if(pe===!0&&(Te===!0||E!==V)){const At=E===V&&H.id===F;we.setState(H,E,At)}let je=!1;H.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==nt.state.version||Oe.outputColorSpace!==Se||k.isBatchedMesh&&Oe.batching===!1||!k.isBatchedMesh&&Oe.batching===!0||k.isBatchedMesh&&Oe.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Oe.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Oe.instancing===!1||!k.isInstancedMesh&&Oe.instancing===!0||k.isSkinnedMesh&&Oe.skinning===!1||!k.isSkinnedMesh&&Oe.skinning===!0||k.isInstancedMesh&&Oe.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Oe.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Oe.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Oe.instancingMorph===!1&&k.morphTexture!==null||Oe.envMap!==Re||H.fog===!0&&Oe.fog!==_e||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==we.numPlanes||Oe.numIntersection!==we.numIntersection)||Oe.vertexAlphas!==Fe||Oe.vertexTangents!==ze||Oe.morphTargets!==Ue||Oe.morphNormals!==Ye||Oe.morphColors!==st||Oe.toneMapping!==ut||Oe.morphTargetsCount!==at)&&(je=!0):(je=!0,Oe.__version=H.version);let Nt=Oe.currentProgram;je===!0&&(Nt=Br(H,U,k));let gi=!1,Ut=!1,ji=!1;const lt=Nt.getUniforms(),Dt=Oe.uniforms;if(Ce.useProgram(Nt.program)&&(gi=!0,Ut=!0,ji=!0),H.id!==F&&(F=H.id,Ut=!0),gi||V!==E){Ce.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),lt.setValue(D,"projectionMatrix",E.projectionMatrix),lt.setValue(D,"viewMatrix",E.matrixWorldInverse);const Lt=lt.map.cameraPosition;Lt!==void 0&&Lt.setValue(D,le.setFromMatrixPosition(E.matrixWorld)),$e.logarithmicDepthBuffer&&lt.setValue(D,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&lt.setValue(D,"isOrthographic",E.isOrthographicCamera===!0),V!==E&&(V=E,Ut=!0,ji=!0)}if(Oe.needsLights&&(nt.state.directionalShadowMap.length>0&&lt.setValue(D,"directionalShadowMap",nt.state.directionalShadowMap,N),nt.state.spotShadowMap.length>0&&lt.setValue(D,"spotShadowMap",nt.state.spotShadowMap,N),nt.state.pointShadowMap.length>0&&lt.setValue(D,"pointShadowMap",nt.state.pointShadowMap,N)),k.isSkinnedMesh){lt.setOptional(D,k,"bindMatrix"),lt.setOptional(D,k,"bindMatrixInverse");const At=k.skeleton;At&&(At.boneTexture===null&&At.computeBoneTexture(),lt.setValue(D,"boneTexture",At.boneTexture,N))}k.isBatchedMesh&&(lt.setOptional(D,k,"batchingTexture"),lt.setValue(D,"batchingTexture",k._matricesTexture,N),lt.setOptional(D,k,"batchingIdTexture"),lt.setValue(D,"batchingIdTexture",k._indirectTexture,N),lt.setOptional(D,k,"batchingColorTexture"),k._colorsTexture!==null&&lt.setValue(D,"batchingColorTexture",k._colorsTexture,N));const Gt=X.morphAttributes;if((Gt.position!==void 0||Gt.normal!==void 0||Gt.color!==void 0)&&He.update(k,X,Nt),(Ut||Oe.receiveShadow!==k.receiveShadow)&&(Oe.receiveShadow=k.receiveShadow,lt.setValue(D,"receiveShadow",k.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Dt.envMap.value=Re,Dt.flipEnvMap.value=Re.isCubeTexture&&Re.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&U.environment!==null&&(Dt.envMapIntensity.value=U.environmentIntensity),Dt.dfgLUT!==void 0&&(Dt.dfgLUT.value=zy()),Ut&&(lt.setValue(D,"toneMappingExposure",x.toneMappingExposure),Oe.needsLights&&wh(Dt,ji),_e&&H.fog===!0&&Ve.refreshFogUniforms(Dt,_e),Ve.refreshMaterialUniforms(Dt,H,ie,$,b.state.transmissionRenderTarget[E.id]),xs.upload(D,Nl(Oe),Dt,N)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(xs.upload(D,Nl(Oe),Dt,N),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&lt.setValue(D,"center",k.center),lt.setValue(D,"modelViewMatrix",k.modelViewMatrix),lt.setValue(D,"normalMatrix",k.normalMatrix),lt.setValue(D,"modelMatrix",k.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const At=H.uniformsGroups;for(let Lt=0,Os=At.length;Lt<Os;Lt++){const Kn=At[Lt];oe.update(Kn,Nt),oe.bind(Kn,Nt)}}return Nt}function wh(E,U){E.ambientLightColor.needsUpdate=U,E.lightProbe.needsUpdate=U,E.directionalLights.needsUpdate=U,E.directionalLightShadows.needsUpdate=U,E.pointLights.needsUpdate=U,E.pointLightShadows.needsUpdate=U,E.spotLights.needsUpdate=U,E.spotLightShadows.needsUpdate=U,E.rectAreaLights.needsUpdate=U,E.hemisphereLights.needsUpdate=U}function Ch(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(E,U,X){const H=v.get(E);H.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),v.get(E.texture).__webglTexture=U,v.get(E.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:X,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,U){const X=v.get(E);X.__webglFramebuffer=U,X.__useDefaultFramebuffer=U===void 0};const Rh=D.createFramebuffer();this.setRenderTarget=function(E,U=0,X=0){I=E,R=U,O=X;let H=null,k=!1,_e=!1;if(E){const Se=v.get(E);if(Se.__useDefaultFramebuffer!==void 0){Ce.bindFramebuffer(D.FRAMEBUFFER,Se.__webglFramebuffer),z.copy(E.viewport),B.copy(E.scissor),W=E.scissorTest,Ce.viewport(z),Ce.scissor(B),Ce.setScissorTest(W),F=-1;return}else if(Se.__webglFramebuffer===void 0)N.setupRenderTarget(E);else if(Se.__hasExternalTextures)N.rebindTextures(E,v.get(E.texture).__webglTexture,v.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const ze=E.depthTexture;if(Se.__boundDepthTexture!==ze){if(ze!==null&&v.has(ze)&&(E.width!==ze.image.width||E.height!==ze.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");N.setupDepthRenderbuffer(E)}}const Re=E.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(_e=!0);const Fe=v.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Fe[U])?H=Fe[U][X]:H=Fe[U],k=!0):E.samples>0&&N.useMultisampledRTT(E)===!1?H=v.get(E).__webglMultisampledFramebuffer:Array.isArray(Fe)?H=Fe[X]:H=Fe,z.copy(E.viewport),B.copy(E.scissor),W=E.scissorTest}else z.copy(q).multiplyScalar(ie).floor(),B.copy(Y).multiplyScalar(ie).floor(),W=re;if(X!==0&&(H=Rh),Ce.bindFramebuffer(D.FRAMEBUFFER,H)&&Ce.drawBuffers(E,H),Ce.viewport(z),Ce.scissor(B),Ce.setScissorTest(W),k){const Se=v.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+U,Se.__webglTexture,X)}else if(_e){const Se=U;for(let Re=0;Re<E.textures.length;Re++){const Fe=v.get(E.textures[Re]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Re,Fe.__webglTexture,X,Se)}}else if(E!==null&&X!==0){const Se=v.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Se.__webglTexture,X)}F=-1},this.readRenderTargetPixels=function(E,U,X,H,k,_e,Ee,Se=0){if(!(E&&E.isWebGLRenderTarget)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=v.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ee!==void 0&&(Re=Re[Ee]),Re){Ce.bindFramebuffer(D.FRAMEBUFFER,Re);try{const Fe=E.textures[Se],ze=Fe.format,Ue=Fe.type;if(!$e.textureFormatReadable(ze)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!$e.textureTypeReadable(Ue)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=E.width-H&&X>=0&&X<=E.height-k&&(E.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Se),D.readPixels(U,X,H,k,ae.convert(ze),ae.convert(Ue),_e))}finally{const Fe=I!==null?v.get(I).__webglFramebuffer:null;Ce.bindFramebuffer(D.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(E,U,X,H,k,_e,Ee,Se=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=v.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ee!==void 0&&(Re=Re[Ee]),Re)if(U>=0&&U<=E.width-H&&X>=0&&X<=E.height-k){Ce.bindFramebuffer(D.FRAMEBUFFER,Re);const Fe=E.textures[Se],ze=Fe.format,Ue=Fe.type;if(!$e.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$e.textureTypeReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ye=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Ye),D.bufferData(D.PIXEL_PACK_BUFFER,_e.byteLength,D.STREAM_READ),E.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Se),D.readPixels(U,X,H,k,ae.convert(ze),ae.convert(Ue),0);const st=I!==null?v.get(I).__webglFramebuffer:null;Ce.bindFramebuffer(D.FRAMEBUFFER,st);const ut=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await u_(D,ut,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Ye),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,_e),D.deleteBuffer(Ye),D.deleteSync(ut),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,U=null,X=0){const H=Math.pow(2,-X),k=Math.floor(E.image.width*H),_e=Math.floor(E.image.height*H),Ee=U!==null?U.x:0,Se=U!==null?U.y:0;N.setTexture2D(E,0),D.copyTexSubImage2D(D.TEXTURE_2D,X,0,0,Ee,Se,k,_e),Ce.unbindTexture()};const Ph=D.createFramebuffer(),Dh=D.createFramebuffer();this.copyTextureToTexture=function(E,U,X=null,H=null,k=0,_e=null){_e===null&&(k!==0?(Ar("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),_e=k,k=0):_e=0);let Ee,Se,Re,Fe,ze,Ue,Ye,st,ut;const ft=E.isCompressedTexture?E.mipmaps[_e]:E.image;if(X!==null)Ee=X.max.x-X.min.x,Se=X.max.y-X.min.y,Re=X.isBox3?X.max.z-X.min.z:1,Fe=X.min.x,ze=X.min.y,Ue=X.isBox3?X.min.z:0;else{const Gt=Math.pow(2,-k);Ee=Math.floor(ft.width*Gt),Se=Math.floor(ft.height*Gt),E.isDataArrayTexture?Re=ft.depth:E.isData3DTexture?Re=Math.floor(ft.depth*Gt):Re=1,Fe=0,ze=0,Ue=0}H!==null?(Ye=H.x,st=H.y,ut=H.z):(Ye=0,st=0,ut=0);const at=ae.convert(U.format),Oe=ae.convert(U.type);let nt;U.isData3DTexture?(N.setTexture3D(U,0),nt=D.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(N.setTexture2DArray(U,0),nt=D.TEXTURE_2D_ARRAY):(N.setTexture2D(U,0),nt=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,U.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,U.unpackAlignment);const je=D.getParameter(D.UNPACK_ROW_LENGTH),Nt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),gi=D.getParameter(D.UNPACK_SKIP_PIXELS),Ut=D.getParameter(D.UNPACK_SKIP_ROWS),ji=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,ft.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ft.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Fe),D.pixelStorei(D.UNPACK_SKIP_ROWS,ze),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ue);const lt=E.isDataArrayTexture||E.isData3DTexture,Dt=U.isDataArrayTexture||U.isData3DTexture;if(E.isDepthTexture){const Gt=v.get(E),At=v.get(U),Lt=v.get(Gt.__renderTarget),Os=v.get(At.__renderTarget);Ce.bindFramebuffer(D.READ_FRAMEBUFFER,Lt.__webglFramebuffer),Ce.bindFramebuffer(D.DRAW_FRAMEBUFFER,Os.__webglFramebuffer);for(let Kn=0;Kn<Re;Kn++)lt&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,v.get(E).__webglTexture,k,Ue+Kn),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,v.get(U).__webglTexture,_e,ut+Kn)),D.blitFramebuffer(Fe,ze,Ee,Se,Ye,st,Ee,Se,D.DEPTH_BUFFER_BIT,D.NEAREST);Ce.bindFramebuffer(D.READ_FRAMEBUFFER,null),Ce.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(k!==0||E.isRenderTargetTexture||v.has(E)){const Gt=v.get(E),At=v.get(U);Ce.bindFramebuffer(D.READ_FRAMEBUFFER,Ph),Ce.bindFramebuffer(D.DRAW_FRAMEBUFFER,Dh);for(let Lt=0;Lt<Re;Lt++)lt?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Gt.__webglTexture,k,Ue+Lt):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Gt.__webglTexture,k),Dt?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,At.__webglTexture,_e,ut+Lt):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,At.__webglTexture,_e),k!==0?D.blitFramebuffer(Fe,ze,Ee,Se,Ye,st,Ee,Se,D.COLOR_BUFFER_BIT,D.NEAREST):Dt?D.copyTexSubImage3D(nt,_e,Ye,st,ut+Lt,Fe,ze,Ee,Se):D.copyTexSubImage2D(nt,_e,Ye,st,Fe,ze,Ee,Se);Ce.bindFramebuffer(D.READ_FRAMEBUFFER,null),Ce.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else Dt?E.isDataTexture||E.isData3DTexture?D.texSubImage3D(nt,_e,Ye,st,ut,Ee,Se,Re,at,Oe,ft.data):U.isCompressedArrayTexture?D.compressedTexSubImage3D(nt,_e,Ye,st,ut,Ee,Se,Re,at,ft.data):D.texSubImage3D(nt,_e,Ye,st,ut,Ee,Se,Re,at,Oe,ft):E.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,_e,Ye,st,Ee,Se,at,Oe,ft.data):E.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,_e,Ye,st,ft.width,ft.height,at,ft.data):D.texSubImage2D(D.TEXTURE_2D,_e,Ye,st,Ee,Se,at,Oe,ft);D.pixelStorei(D.UNPACK_ROW_LENGTH,je),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Nt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,gi),D.pixelStorei(D.UNPACK_SKIP_ROWS,Ut),D.pixelStorei(D.UNPACK_SKIP_IMAGES,ji),_e===0&&U.generateMipmaps&&D.generateMipmap(nt),Ce.unbindTexture()},this.initRenderTarget=function(E){v.get(E).__webglFramebuffer===void 0&&N.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?N.setTextureCube(E,0):E.isData3DTexture?N.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?N.setTexture2DArray(E,0):N.setTexture2D(E,0),Ce.unbindTexture()},this.resetState=function(){R=0,O=0,I=null,Ce.reset(),Me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ze._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ze._getUnpackColorSpace()}}const Gy=window.SKYLRK?.initialGradientColor||window.SKYLRK?.fallbackGradientColor||"#5252CC",Fs=ws(Gy),ls=Fs.top,cs=Fs.bottom,us=Fs.accent,fs=Fs.dark;function Hy(n){const e=new ky({canvas:n,antialias:!0,alpha:!0});e.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.setSize(window.innerWidth,window.innerHeight,!1);const t=new As(-1,1,1,-1,0,1),i=new As(-1,1,1,-1,0,1),r=Math.min(window.devicePixelRatio,2),s=Math.floor(window.innerWidth*r),o=Math.floor(window.innerHeight*r),a=()=>new rn(s,o,{magFilter:St,minFilter:St,format:qt,type:dn}),l=[a(),a()],c=l.map(()=>new eu),u=new Ur(2,2),f=new Map;for(const J of Co)f.set(J.id,new kt({uniforms:{uTime:{value:0},uResolution:{value:new Qe(s,o)},uTopColor:{value:new G(...ls)},uBottomColor:{value:new G(...cs)},uAccentColor:{value:new G(...us)},uDarkColor:{value:new G(...fs)},uFocusPoint:{value:new Qe(.5,.5)},uFocusStrength:{value:0}},vertexShader:Bs,fragmentShader:J.fragmentShader}));let h=Co[0].id;const p=f.get(h),g=new kt({uniforms:{uTime:{value:0},uResolution:{value:new Qe(s,o)},uTexture:{value:null},uIntensity:{value:.05}},vertexShader:Bs,fragmentShader:Uh}),_=new kt({uniforms:{uTexture:{value:null},uFadeIn:{value:0}},vertexShader:Bs,fragmentShader:Oh,transparent:!0}),m=[new Kt(u.clone(),p),new Kt(u.clone(),g)];m.forEach((J,le)=>c[le].add(J));const d=new eu,y=new Kt(u.clone(),_);d.add(y);const S=()=>{const J=n.clientWidth,le=n.clientHeight,be=Math.min(window.devicePixelRatio,2);e.setSize(J,le,!1),l.forEach(Ie=>{Ie.setSize(Math.floor(J*be),Math.floor(le*be))});const ce=new Qe(J*be,le*be);for(const Ie of f.values())Ie.uniforms.uResolution.value=ce;g.uniforms.uResolution.value=ce};window.addEventListener("resize",S),window.visualViewport?.addEventListener("resize",S);const T=new X_;let b,A=0,C=1,P=0;const x=[...ls],M=[...cs],R=[...us],O=[...fs],I=[...ls],F=[...cs],V=[...us],z=[...fs],B=[...ls],W=[...cs],K=[...us],Q=[...fs],ee=[.5,.5];let $=[.5,.5],ie=0,de=0;const Ne=.15;let q=!1;const Y=J=>1-Math.pow(1-J,5),re=(J,le)=>J[0]!==le[0]||J[1]!==le[1]||J[2]!==le[2],ye=(J,le,be,ce)=>{be[0]=J[0]+(le[0]-J[0])*ce,be[1]=J[1]+(le[1]-J[1])*ce,be[2]=J[2]+(le[2]-J[2])*ce};function pe(J){const le=f.get(h);le.uniforms.uTime.value=J,g.uniforms.uTime.value=J,e.setRenderTarget(l[0]),e.render(c[0],i),g.uniforms.uTexture.value=l[0].texture,e.setRenderTarget(l[1]),e.render(c[1],i),_.uniforms.uTexture.value=l[1].texture,e.setRenderTarget(null),e.render(d,t)}function Te(){b=requestAnimationFrame(Te);const J=T.getElapsedTime();if(!q){const ce=Math.min(J/Ne,1);_.uniforms.uFadeIn.value=ce,ce>=1&&(q=!0)}try{const ce=window.Alpine?.store?.("gradient");if(ce&&ce.topColor&&ce.bottomColor&&ce.accentColor&&ce.darkColor){if(ce.effectId&&ce.effectId!==h){const Be=f.get(ce.effectId);Be&&(h=ce.effectId,m[0].material=Be,Be.uniforms.uTime.value=J,Be.uniforms.uTopColor.value.set(x[0],x[1],x[2]),Be.uniforms.uBottomColor.value.set(M[0],M[1],M[2]),Be.uniforms.uAccentColor.value.set(R[0],R[1],R[2]),Be.uniforms.uDarkColor.value.set(O[0],O[1],O[2]))}const Ie=re(I,ce.topColor),qe=re(F,ce.bottomColor),D=re(V,ce.accentColor),et=re(z,ce.darkColor);if((Ie||qe||D||et)&&(A=ce.transitionDuration??.8,P=J,C=0,B[0]=x[0],B[1]=x[1],B[2]=x[2],W[0]=M[0],W[1]=M[1],W[2]=M[2],K[0]=R[0],K[1]=R[1],K[2]=R[2],Q[0]=O[0],Q[1]=O[1],Q[2]=O[2],I[0]=ce.topColor[0],I[1]=ce.topColor[1],I[2]=ce.topColor[2],F[0]=ce.bottomColor[0],F[1]=ce.bottomColor[1],F[2]=ce.bottomColor[2],V[0]=ce.accentColor[0],V[1]=ce.accentColor[1],V[2]=ce.accentColor[2],z[0]=ce.darkColor[0],z[1]=ce.darkColor[1],z[2]=ce.darkColor[2]),ce.focusPoint?($=[ce.focusPoint[0],ce.focusPoint[1]],de=1):($=[.5,.5],de=0),C<1){C=A<=0?1:Math.min((J-P)/A,1);const Be=Y(C);ye(B,I,x,Be),ye(W,F,M,Be),ye(K,V,R,Be),ye(Q,z,O,Be);const $e=f.get(h);$e.uniforms.uTopColor.value.set(x[0],x[1],x[2]),$e.uniforms.uBottomColor.value.set(M[0],M[1],M[2]),$e.uniforms.uAccentColor.value.set(R[0],R[1],R[2]),$e.uniforms.uDarkColor.value.set(O[0],O[1],O[2])}}}catch{}const le=.04;ee[0]+=($[0]-ee[0])*le,ee[1]+=($[1]-ee[1])*le,ie+=(de-ie)*le;const be=f.get(h);be.uniforms.uFocusPoint.value.set(ee[0],ee[1]),be.uniforms.uFocusStrength.value=ie,pe(J)}return pe(0),Te(),()=>{cancelAnimationFrame(b),window.removeEventListener("resize",S),window.visualViewport?.removeEventListener("resize",S),e.dispose(),l.forEach(J=>J.dispose()),u.dispose();for(const J of f.values())J.dispose();g.dispose(),_.dispose()}}console.log("Built by Rei + Tanya + Lucas + Matt + Simon + Corey");typeof window<"u"&&window.SKYLRK&&(window.SKYLRK.adjustGradientHex=n=>Ru(Cu(n)));let Sn=null,mr=null,bu=null,fi=null;function ka(){typeof window.matchMedia=="function"&&window.matchMedia("(hover: none) and (pointer: coarse)").matches&&document.querySelectorAll("model-viewer").forEach(e=>{e.setAttribute("loading","lazy"),e.removeAttribute("auto-rotate")})}function Au(){const n=document.querySelector("#gradient-canvas");if(n&&!bu)try{bu=Hy(n),Mt("Gradient shader initialized successfully")}catch(e){console.error("Failed to initialize shader:",e)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Au(),Ga(),ka()}):(Au(),Ga(),ka());function Ga(){if(Sn)return;const n=document.querySelector(".wallpaper-lenis-wrapper"),e=document.querySelector(".wallpaper-lenis-content"),t=!!document.querySelector(".section-pdp-minimal"),i=window.innerWidth>=1e3;if(typeof window.matchMedia=="function"&&window.matchMedia("(hover: none) and (pointer: coarse)").matches&&t&&!n&&!e)return;n&&e?Sn=new Ui({wrapper:n,content:e,lerp:.1,smoothWheel:!0,infinite:!i,syncTouch:!0}):Sn=new Ui({lerp:.1,smoothWheel:!0,infinite:!1,syncTouch:!0});const s=o=>{Sn?.raf(o),mr=requestAnimationFrame(s)};if(mr=requestAnimationFrame(s),window.Alpine){fi&&(fi(),fi=null);const o=window.Alpine.effect(()=>{(window.Alpine.store("modal")?.stack??[]).some(u=>["cart","notify","size-guide"].includes(u))?Sn?.stop():Sn?.start()});typeof o=="function"&&(fi=o)}}async function wu(){try{const{default:n}=await Fh(async()=>{const{default:t}=await import("./Swup.modern-D_rAiYJY.js");return{default:t}},[],import.meta.url);new n({containers:["#swup"],animationSelector:'[class*="transition-"]',cache:!0}).hooks.on("content:replace",()=>{mr!==null&&(cancelAnimationFrame(mr),mr=null),Sn&&(Sn.destroy(),Sn=null),fi&&(fi(),fi=null),document.querySelectorAll('form input[name="return_to"]').forEach(s=>{s.value=window.location.pathname}),window.Alpine&&document.querySelectorAll("[x-data]").forEach(s=>{s._x_dataStack||window.Alpine.initTree(s)}),Ga(),ka(),Ha();const t=document.querySelector("[data-policy-nav]");if(t){const s=t._x_dataStack?.[0];s?.update&&s.update(window.location.pathname)}const r=document.querySelector("[data-page-gradient]")?.dataset.pageGradient;if(window.SKYLRK&&(window.SKYLRK.initialGradientColor=r||window.SKYLRK.fallbackGradientColor),window.Alpine){const s=window.Alpine.store("gradient");r&&s?.setFromHex&&s.currentHex!==r?s.setFromHex(r,.8):!r&&s?.revertToFallback&&window.matchMedia("(hover: hover) and (pointer: fine)").matches&&s.revertToFallback(.8)}}),Mt("Swup initialized")}catch{}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",wu):wu();function Ha(){if(typeof window.matchMedia=="function"&&window.matchMedia("(hover: none) and (pointer: coarse)").matches)return;const e=new Set;document.querySelectorAll("model-viewer[src]").forEach(t=>{if(t.offsetParent===null)return;const i=t.getAttribute("src");i&&e.add(i)}),e.forEach(t=>{fetch(t,{mode:"cors"}).catch(()=>{})}),e.size>0&&Mt(`Prefetching ${e.size} 3D model(s)`)}"requestIdleCallback"in window?requestIdleCallback(Ha):setTimeout(Ha,2e3);
