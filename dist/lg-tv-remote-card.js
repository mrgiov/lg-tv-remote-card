var Ue="media_player.lg_tv",m=["dpad","pad","keys","apps"],_={entity:Ue,name:"",favorites:["Netflix","YouTube","Prime Video","Disney+","RaiPlay","Stremio"],hidden:["Developer Mode","Memory Care","OfficeViewer","FlexIt"],scroll_gain:2,scroll_invert:!1,favorite_channels:[],haptics:"soft",auto_open_keyboard:!0},x={Netflix:"#b1121b",YouTube:"#c4302b","Prime Video":"#0a5ea8","Disney+":"#1a2c6b",RaiPlay:"#1b6fb0",Stremio:"#4a3a6b"},Y="#444444",g={gain:2.8,accelerationPx:14,tickMs:33,moveThresholdPx:8,tapMaxMs:400,doubleTapMs:300},X={tickMs:50},f={minDistancePx:60,horizontalRatio:1.5,maxMs:700,ghostClickMs:350},P={delayMs:450,intervalMs:180},U="lgtv_pointer_keyboard",j=1e4,G=250,M=1e3,I=4e4,R=12e3,Q=3500,J=1400,N={soft:{scale:1,native:{tap:"selection",step:"selection",success:"light",error:"warning",heavy:"medium"}},normal:{scale:1.6,native:{tap:"light",step:"selection",success:"success",error:"warning",heavy:"medium"}},strong:{scale:2.6,native:{tap:"medium",step:"light",success:"success",error:"failure",heavy:"heavy"}}},Z={tap:20,step:12,success:[40,50,40],error:[80,60,80],heavy:80},k={delayMs:1800,maxDigits:3},ee=6e4,z=1440*60*1e3,te=300*1e3,T=8,ie=3500,ne=120,h={gap:4,padding:4,selectedFlex:1.75,animationMs:360,stretchMax:.32};var je=/^HDMI \d+$/,Ge="Canali TV",ae=i=>!!i&&i.state!=="off"&&i.state!=="unavailable";function D(i,{favorites:e,hidden:t}){let n=e.filter(o=>i.includes(o)),a=i.filter(o=>je.test(o)||o===Ge),s=i.filter(o=>!n.includes(o)&&!a.includes(o)&&!t.includes(o));return{favorites:n,inputs:a,others:s}}function se(i,{dx:e,dy:t,durationMs:n}){let a=Math.abs(e)>=f.minDistancePx,s=Math.abs(e)>=Math.abs(t)*f.horizontalRatio;if(!a||!s||n>f.maxMs)return null;let o=e<0?1:-1;return m[m.indexOf(i)+o]??null}function oe({dx:i,dy:e,moved:t}){return t?Math.abs(i)>Math.abs(e)?i>0?"RIGHT":"LEFT":e>0?"DOWN":"UP":"ENTER"}function re(i,e){let t=1+Math.min(1,Math.hypot(i,e)/g.accelerationPx),n=g.gain*t;return{x:i*n,y:e*n}}var le=i=>({text:i,replace:!0});function ce({layoutHeight:i,visualHeight:e,visualOffsetTop:t}){return Math.max(0,Math.round(i-e-t))}function de({focus:i,sheetOpen:e,hasText:t}){return i?e?null:"open":e&&!t?"close":null}function pe(i,{waking:e,sleeping:t=!1}){if(!i)return"Entit\xE0 non trovata";if(t)return"Spegnimento\u2026";if(e)return"Accensione\u2026";if(i.state==="unavailable")return"Non raggiungibile";if(i.state==="off")return"Spenta";let{source:n,media_title:a}=i.attributes;return n&&a?`${n} \xB7 ${a}`:n||"Accesa"}function he({tvOn:i,context:e}){return i?e==="text"?{title:"Nessun campo di testo aperto",hint:"Apri una ricerca sulla TV e riprova."}:e==="pointer"?{title:"Puntatore non disponibile",hint:"Riprova tra un attimo."}:{title:"Comando non riuscito",hint:"Riprova."}:{title:"TV non raggiungibile",hint:"Accendila e riprova."}}var ue=i=>!i?.app_id||i.app_id==="com.webos.app.home";function O(i){return i===!1||i==="off"?"off":i in N?i:"soft"}function be(i,e){let t=O(i);if(t==="off")return null;let{scale:n,native:a}=N[t],s=Z[e],o=Array.isArray(s)?s.map(r=>Math.round(r*n)):Math.round(s*n);return{native:a[e],pattern:o}}function me({innerWidth:i,count:e,selectedIndex:t,gap:n,padding:a,selectedFlex:s}){let o=(i-n*(e-1))/(e-1+s);return{left:a+t*(o+n),width:o*s}}function ge(i,e){let t=0,n=1/0;return e.forEach(({left:a,width:s},o)=>{let r=i<a?a-i:i>a+s?i-(a+s):0;r<n&&(t=o,n=r)}),t}function fe(i){let[e,t,n,a,s,o]=i.split(",").map(Number);return new Date(e,t-1,n,a,s,o)}function H(i,e=new Date){for(let t of i??[]){let n=fe(t.localStartTime),a=fe(t.localEndTime);if(n<=e&&e<a)return{name:t.programName,start:n,end:a,progress:(e-n)/(a-n),minutesLeft:Math.max(1,Math.ceil((a-e)/6e4))}}return null}function xe(i){return(i??[]).filter(e=>e.TV&&!e.Radio&&!e.Invisible).map(e=>({id:e.channelId,number:String(e.channelNumber),name:e.channelName})).sort((e,t)=>parseFloat(e.number)-parseFloat(t.number))}var _e=i=>i.toLowerCase().normalize("NFD").replace(/\p{M}/gu,"");function ve(i,e){let t=_e(e.trim());return t?i.filter(n=>_e(n.name).includes(t)||n.number.startsWith(t)):i}function E(i,e){return e?i.find(t=>parseFloat(t.number)===parseFloat(e))??null:null}function ye(i,e){return i.includes(e)?i.filter(t=>t!==e):[...i,e]}function S(i,e,t=8){return e.length?i.filter(n=>e.includes(n.number)):i.slice(0,t)}function v(i){let e=0;for(let t of i)e=e*31+t.charCodeAt(0)>>>0;return`hsl(${e%360} 55% 38%)`}var L=i=>i?.app_id==="com.webos.app.livetv";var we="lg-tv-remote:";function C(i,e=1/0){try{let t=JSON.parse(localStorage.getItem(we+i));return t&&Date.now()-t.at<e?t.value:null}catch{return null}}function A(i,e){try{localStorage.setItem(we+i,JSON.stringify({at:Date.now(),value:e}))}catch{}}async function ke(i,e,t,n,a){let s=await i.callWS({type:"call_service",domain:e,service:t,service_data:{entity_id:n,...a},return_response:!0});return s?.response?.[n]??s?.response}var Te=(i,e,t,n)=>ke(i,"webostv","command",e,n?{command:t,payload:n}:{command:t});async function Ee(i,e){let t=C(`channels:${e}`,z);if(t)return t;let a=((await Te(i,e,"tv/getChannelList"))?.channelList??[]).map(s=>({channelId:s.channelId,channelNumber:s.channelNumber,channelName:s.channelName,TV:s.TV,Radio:s.Radio,Invisible:s.Invisible}));return a.length&&A(`channels:${e}`,a),a}async function B(i,e,t){let n=await Te(i,e,"tv/getChannelProgramInfo",t?{channelId:t}:void 0);return{channel:n?.channel,programList:n?.programList??[]}}async function Se(i,e){let t=C(`icons:${e}`,z);if(t)return t;if(!i.services.lgtv_pointer?.app_icons)return{};let a=(await ke(i,"lgtv_pointer","app_icons",e,{}))?.icons??{};return Object.keys(a).length&&A(`icons:${e}`,a),a}var Le=`
  :host { display:block; height:100%; }
  ha-card {
    --tint:#1d4ed8; --fg:#fff; --mute:rgba(255,255,255,.7); --accent:#4aa8ff; --red:#ff453a;
    --glass:linear-gradient(160deg, rgba(255,255,255,.22), rgba(255,255,255,.08));
    --glass-line:rgba(255,255,255,.28); --glass-shadow:inset 0 1px 0 rgba(255,255,255,.45), 0 8px 24px rgba(0,0,0,.28);
    position:relative; display:flex; flex-direction:column; gap:8px; height:100%; max-width:520px; margin:0 auto; overflow:hidden;
    max-height:100vh; max-height:calc(100dvh - var(--header-height, 56px)); /* never taller than the screen: long lists scroll inside */
    padding:12px 12px max(12px, env(safe-area-inset-bottom)); box-sizing:border-box; color:var(--fg);
    background:radial-gradient(90% 50% at 15% 0%, var(--tint), transparent 70%), radial-gradient(80% 45% at 100% 100%, #5b21b6, transparent 70%), #0b0e14;
    touch-action:pan-y; user-select:none; -webkit-user-select:none; -webkit-tap-highlight-color:transparent;
  }
  button { font-family:inherit; color:inherit; touch-action:manipulation; }
  ha-icon { --mdc-icon-size:22px; display:inline-flex; }

  /* glass surfaces */
  .key, .rail, .pad, .now, .tabs, .chip, .panel-sheet, .kb-sheet, .ch-row, .tile, .toast, .sheet, .num-display, .search {
    background:var(--glass); border:1px solid var(--glass-line); box-shadow:var(--glass-shadow);
    backdrop-filter:blur(20px) saturate(1.7); -webkit-backdrop-filter:blur(20px) saturate(1.7);
  }
  .key {
    display:flex; align-items:center; justify-content:center; min-height:44px; padding:0; border-radius:20px;
    font-size:16px; font-weight:600; cursor:pointer;
  }
  .key:active, .tile:active, .ch-row:active, .chip:active { filter:brightness(1.35); transform:scale(.97); }
  .key.primary { background:linear-gradient(160deg, #6cb8ff, #2f7fe0); }
  .key.alert { background:linear-gradient(160deg, #ff6b61, #d92b20); }
  .key:focus-visible, .tab:focus-visible, .ch-row:focus-visible, .tile:focus-visible { outline:2px solid #fff; outline-offset:2px; }

  /* header */
  .head { display:flex; align-items:center; gap:8px; flex:none; }
  .head .info { flex:1; min-width:0; }
  .title { font-weight:700; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .status { font-size:12px; color:var(--mute); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .head .key { width:44px; min-height:44px; border-radius:50%; flex:none; }
  .head .power { background:linear-gradient(160deg, #ff6b61, #d92b20); box-shadow:inset 0 1px 0 rgba(255,255,255,.55), 0 8px 22px rgba(255,69,58,.5); }
  .head .power.off { background:linear-gradient(160deg, #9a9ea8, #5f636d); box-shadow:inset 0 1px 0 rgba(255,255,255,.4), 0 8px 24px rgba(0,0,0,.28); color:rgba(255,255,255,.85); }

  /* loading ring: a bright arc that turns around the power button while the TV switches on or off */
  .head .key.power, .power-big { position:relative; }
  .head .power.busy::after, .power-big.busy::after {
    content:""; position:absolute; inset:-5px; border-radius:50%; pointer-events:none;
    background:conic-gradient(from 0deg, rgba(255,255,255,0) 0 55%, rgba(255,255,255,.25) 75%, #fff 100%);
    -webkit-mask:radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px)); mask:radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
    filter:drop-shadow(0 0 4px rgba(255,255,255,.9)); animation:ring-spin .9s linear infinite;
  }
  .power-big.busy::after { inset:-8px; -webkit-mask:radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px)); mask:radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px)); }
  @keyframes ring-spin { to { transform:rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { .head .power.busy::after, .power-big.busy::after { animation:none; } }
  .head .power.holding { box-shadow:0 0 0 3px #fff, 0 8px 22px rgba(255,69,58,.5); }

  /* now playing strip: channel with prev/next, or app with transport */
  .now { display:flex; align-items:center; gap:8px; padding:6px; border-radius:24px; flex:none; }
  .now.gone { display:none; }
  .now[data-mode=live] .app-only, .now[data-mode=app] .live-only { display:none; }
  .now .step { flex:none; width:36px; height:36px; min-height:0; border-radius:50%; }
  .now .step ha-icon { --mdc-icon-size:18px; }
  .now .open { flex:1; min-width:0; display:flex; align-items:center; gap:10px; padding:0; border:none; background:transparent; text-align:left; cursor:pointer; }
  .now .logo { flex:none; width:40px; height:40px; border-radius:12px; display:grid; place-items:center; font-weight:800; font-size:14px; color:#fff;
               background-color:var(--logo, #0a4aa8); box-shadow:inset 0 1px 0 rgba(255,255,255,.4); background-size:cover; background-position:center; }
  .now .text { flex:1; min-width:0; }
  .now .line1 { font-weight:700; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .now .line2 { font-size:12px; color:var(--mute); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .now .bar { height:3px; margin-top:4px; border-radius:2px; background:rgba(255,255,255,.22); overflow:hidden; }
  .now .bar i { display:block; height:100%; background:#fff; border-radius:2px; }

  /* body: stage plus the scroll strip on the touchpad tab */
  .body { display:flex; gap:8px; flex:1; min-height:0; }
  .rail { flex:none; width:44px; border-radius:22px; display:flex; flex-direction:column; align-items:center; justify-content:space-between; padding:4px 0; }
  .rail.scroll { display:none; touch-action:none; color:var(--mute); padding:10px 0; }
  .rail.scroll.available { display:flex; }
  .rail.scroll .vertical { writing-mode:vertical-rl; font-size:11px; }
  .body:not([data-active-tab=pad]) .rail.scroll { display:none; }

  /* stage */
  .stage { position:relative; display:flex; flex-direction:column; flex:1; min-width:0; min-height:0; }
  .stage.standby > .center, .stage.standby > .scroll-view { opacity:.18; pointer-events:none; }
  .center { display:flex; flex-direction:column; justify-content:center; flex:1; min-height:0; }
  .panel { display:none; width:100%; }
  .panel.active { display:block; }
  .panel[data-panel=pad].active { display:flex; flex:1; min-height:0; }
  .scroll-view { display:none; flex:1; min-height:0; overflow-y:auto; scrollbar-width:none; }
  .scroll-view.active { display:block; }

  .dpad { display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(3,1fr); gap:6px; width:100%; max-width:min(100%,300px); max-height:100%; aspect-ratio:1/1; margin:0 auto; }
  .dpad .key { min-height:0; font-size:20px; border-radius:18px; }
  .dpad .ok { border-radius:50%; font-size:15px; }
  .transport { display:flex; gap:6px; margin-top:12px; } .transport .key { flex:1; }

  .pad {
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; flex:1; min-width:0; padding:8px; box-sizing:border-box;
    border-radius:26px; color:var(--mute); font-size:12px; line-height:1.5; text-align:center; touch-action:none;
  }
  .pad ha-icon { --mdc-icon-size:30px; }

  .keypad { display:grid; grid-template-columns:repeat(3,1fr); grid-auto-rows:clamp(42px,7vh,54px); gap:6px; }
  .keypad .key { min-height:0; font-size:19px; }
  .keys-extra { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-top:6px; }
  .colors { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-top:6px; }
  .colors .key { min-height:30px; }
  .colors .red { background:rgba(255,69,58,.55); } .colors .green { background:rgba(52,211,153,.55); }
  .colors .yellow { background:rgba(251,191,36,.6); } .colors .blue { background:rgba(74,168,255,.6); }

  /* dock and tabs */
  .dock { display:grid; grid-template-columns:repeat(5,1fr); gap:6px; flex:none; }
  .dock .key { min-height:50px; border-radius:22px; }
  .dock .key.active { background:linear-gradient(160deg, #6cb8ff, #2f7fe0); }
  .tabs { --ease:cubic-bezier(.25,.8,.25,1); position:relative; display:flex; gap:${h.gap}px; padding:${h.padding}px; border-radius:26px; flex:none; }
  .tab-pill {
    position:absolute; top:${h.padding}px; bottom:${h.padding}px; left:0; width:0; pointer-events:none; will-change:transform, width;
    transition:transform ${h.animationMs}ms var(--spring), width ${h.animationMs}ms var(--spring);
  }
  /* the liquid glass bubble: bright rim, soft inner glow, a specular highlight, and it squashes and stretches as it moves */
  .tab-pill .blob {
    position:absolute; inset:0; border-radius:20px; transform-origin:center; transition:transform .22s var(--spring);
    background:radial-gradient(130% 160% at 25% 0%, rgba(255,255,255,.3), rgba(255,255,255,0) 55%), color-mix(in srgb, var(--tint) 34%, transparent);
    border:1px solid rgba(255,255,255,.55);
    box-shadow:inset 0 1.5px 0 rgba(255,255,255,.8), inset 0 -2px 5px rgba(255,255,255,.16), inset 0 0 14px color-mix(in srgb, var(--tint) 45%, transparent), 0 6px 16px rgba(0,0,0,.28);
    backdrop-filter:blur(3px) saturate(2.1) brightness(1.15); -webkit-backdrop-filter:blur(3px) saturate(2.1) brightness(1.15);
  }
  .tab-pill .blob::after { content:""; position:absolute; left:16%; right:16%; top:2px; height:36%; border-radius:99px; background:linear-gradient(rgba(255,255,255,.55), transparent); }
  .tabs { touch-action:none; --spring:cubic-bezier(.3,1.35,.5,1); }
  .tabs:not(.settled) .tab-pill { transition:none; }
  .tabs.dragging .tab-pill { transition:none; }
  .tabs.dragging.grab .tab-pill { transition:transform .22s var(--spring), width .22s var(--spring); }
  .tabs.dragging .tab-pill .blob { transform:scale(var(--sx,1), var(--sy,1)); border-radius:50%; background:radial-gradient(130% 160% at 25% 0%, rgba(255,255,255,.4), rgba(255,255,255,0) 60%), color-mix(in srgb, var(--tint) 22%, transparent); backdrop-filter:blur(1px) saturate(2.4) brightness(1.35); -webkit-backdrop-filter:blur(1px) saturate(2.4) brightness(1.35); }
  .tab {
    position:relative; z-index:1; flex:1; min-width:0; height:40px; display:flex; align-items:center; justify-content:center; border:none; border-radius:20px; background:transparent;
    color:var(--mute); font-size:12px; font-weight:600; cursor:pointer; transition:flex ${h.animationMs}ms var(--ease), color .2s;
  }
  .tab .tab-icon { width:22px; height:22px; flex:none; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; transition:transform ${h.animationMs}ms var(--ease); }
  .tab .tab-label { display:inline-block; max-width:0; padding-left:0; opacity:0; overflow:hidden; white-space:nowrap; transition:max-width ${h.animationMs}ms var(--ease), padding ${h.animationMs}ms var(--ease), opacity .2s; }
  .tab.selected { flex:${h.selectedFlex}; color:#fff; }
  .tabs.dragging .tab { color:var(--mute); } .tabs.dragging .tab.hover { color:#fff; }
  .tab.selected .tab-label { max-width:90px; padding-left:6px; opacity:1; transition-delay:0s, 0s, .08s; }
  .tab:active .tab-icon { transform:scale(.88); }
  @media (prefers-reduced-motion: reduce) { .tab-pill, .tab-pill .blob, .tab, .tab .tab-label, .tab .tab-icon { transition:none; } }
  .disabled { opacity:.35; pointer-events:none; }

  /* apps */
  .label { margin:8px 0 6px; font-size:11px; letter-spacing:.08em; color:var(--mute); }
  .tiles { display:grid; grid-template-columns:repeat(4,1fr); gap:6px 4px; margin-bottom:4px; }
  .tile {
    display:flex; flex-direction:column; align-items:center; gap:4px; padding:4px 0 2px; min-width:0; border:none; border-radius:16px;
    background:none; box-shadow:none; backdrop-filter:none; -webkit-backdrop-filter:none; color:#fff; font-size:11px; font-weight:600; text-align:center; cursor:pointer;
  }
  .tile .icon { width:52px; height:52px; border-radius:14px; background-size:cover; background-position:center; display:grid; place-items:center; font-size:20px; font-weight:800;
                box-shadow:inset 0 1px 0 rgba(255,255,255,.35), 0 4px 12px rgba(0,0,0,.3); }
  .tile span { display:block; max-width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .tile.current .icon { box-shadow:0 0 0 2px #fff, 0 4px 12px rgba(0,0,0,.3); }
  .chips { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:6px; }
  .chip { min-height:40px; padding:0 14px; border-radius:20px; font-size:13px; font-weight:600; cursor:pointer; }
  .chip.current { background:linear-gradient(160deg, #6cb8ff, #2f7fe0); }
  .chips.collapsed { display:none; }

  /* bottom sheets: one at a time, lined up with the card and above the phone keyboard */
  .kb-backdrop { position:fixed; inset:0; z-index:20; background:rgba(3,6,12,.5); backdrop-filter:blur(4px); opacity:0; pointer-events:none; transition:opacity .2s; }
  ha-card[data-sheet] .kb-backdrop { opacity:1; pointer-events:auto; }
  .panel-sheet, .kb-sheet {
    position:fixed; left:var(--kb-left,0px); width:var(--kb-width,100%); bottom:var(--kb-inset,0px); z-index:21; box-sizing:border-box;
    display:flex; flex-direction:column; gap:8px; padding:8px 12px max(14px, env(safe-area-inset-bottom)); max-height:82vh;
    border-radius:30px 30px 0 0; background:linear-gradient(170deg, rgba(60,70,100,.66), rgba(20,24,36,.88));
    transform:translateY(110%); visibility:hidden; transition:transform .24s ease-out, visibility 0s .24s;
  }
  ha-card[data-sheet=channels] #channels-sheet, ha-card[data-sheet=numpad] #numpad-sheet, ha-card[data-sheet=inputs] #inputs-sheet, ha-card[data-sheet=keyboard] #kb-sheet {
    transform:none; visibility:visible; transition:transform .24s ease-out;
  }
  .sheet-grip { align-self:center; width:38px; height:4px; border-radius:2px; background:rgba(255,255,255,.4); flex:none; }
  .sheet-head { display:flex; align-items:center; gap:8px; flex:none; }
  .sheet-head b { flex:1; font-size:16px; }
  .sheet-head .key { width:42px; min-height:42px; border-radius:50%; }
  .sheet-scroll { overflow-y:auto; display:flex; flex-direction:column; gap:6px; min-height:0; scrollbar-width:none; }
  .search { display:flex; align-items:center; gap:8px; min-height:42px; padding:0 14px; border-radius:21px; flex:none; }
  .search input { flex:1; min-width:0; background:transparent; border:none; outline:none; color:#fff; font:inherit; font-size:16px; }

  .ch-row { display:flex; align-items:center; gap:10px; width:100%; padding:5px 10px 5px 5px; border-radius:18px; text-align:left; cursor:pointer; flex:none; box-sizing:border-box; }
  .ch-row.current { box-shadow:inset 0 0 0 2px #fff, 0 6px 18px rgba(0,0,0,.3); }
  .ch-row .logo { flex:none; width:38px; height:38px; border-radius:11px; display:grid; place-items:center; font-weight:800; font-size:13px; background:var(--logo); }
  .ch-row .text { flex:1; min-width:0; } .ch-row .line1 { font-weight:700; font-size:14px; } .ch-row .line2 { font-size:12px; color:var(--mute); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ch-row .star { flex:none; width:40px; height:40px; display:grid; place-items:center; border:none; background:transparent; color:var(--mute); cursor:pointer; }
  .ch-row .star.on { color:#fbbf24; }
  .ch-row .mini { height:3px; margin-top:4px; border-radius:2px; background:rgba(255,255,255,.2); overflow:hidden; } .ch-row .mini i { display:block; height:100%; background:#fff; }
  .more { min-height:42px; flex:none; gap:6px; width:100%; }

  .num-display { position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; height:92px; border-radius:24px; flex:none; cursor:pointer; }
  .num-display b { font-size:36px; letter-spacing:.12em; line-height:1; min-height:36px; font-variant-numeric:tabular-nums; }
  .num-display span { font-size:13px; color:var(--mute); min-height:18px; }
  .num-ring { position:absolute; inset:5px; border-radius:20px; border:3px solid transparent; opacity:0; pointer-events:none;
    background:conic-gradient(var(--accent) var(--p,0%), rgba(255,255,255,.14) 0) border-box;
    -webkit-mask:linear-gradient(#000 0 0) padding-box exclude, linear-gradient(#000 0 0); mask:linear-gradient(#000 0 0) padding-box exclude, linear-gradient(#000 0 0);
    -webkit-mask-composite:xor; mask-composite:exclude; }
  .num-display.counting .num-ring { opacity:1; }
  .num-display.bad { animation:shake .3s; }
  @keyframes shake { 25% { transform:translateX(-6px); } 75% { transform:translateX(6px); } }
  .num-keys { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; flex:none; } .num-keys .key { min-height:50px; font-size:20px; }

  .inputs-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(58px,1fr)); gap:6px; margin-bottom:4px; }
  .inputs-grid .key { min-height:52px; flex-direction:column; gap:2px; font-size:11px; border-radius:20px; }
  .inputs-grid .key.current { box-shadow:inset 0 0 0 2px #fff, var(--glass-shadow); }

  .kb-sheet .line { display:flex; gap:8px; }
  .kb-sheet .line .key { flex:1; font-size:15px; }
  .kb-sheet .line .key.icon-only { flex:none; width:48px; }
  .kb-sheet input {
    flex:1; min-width:0; min-height:46px; padding:0 14px; border-radius:23px; font-size:16px; color:#fff;
    border:1px solid var(--glass-line); background:rgba(0,0,0,.25);
  }
  .kb-sheet .status { white-space:normal; line-height:1.4; }


  /* expanding volume and channel controls, opened from the dock */
  .pop-scrim { position:absolute; inset:0; z-index:12; display:none; }
  ha-card[data-pop] .pop-scrim { display:block; }
  .pop {
    position:absolute; z-index:13; bottom:var(--pop-bottom, 140px); right:var(--pop-right, 12px); width:104px; padding:10px; box-sizing:border-box;
    display:flex; flex-direction:column; gap:8px; border-radius:34px; background:linear-gradient(170deg, rgba(70,80,115,.72), rgba(24,28,42,.9));
    border:1px solid var(--glass-line); box-shadow:var(--glass-shadow), 0 18px 40px rgba(0,0,0,.45); backdrop-filter:blur(24px) saturate(1.7); -webkit-backdrop-filter:blur(24px) saturate(1.7);
    transform-origin:var(--pop-origin, 85% 100%); transform:scale(.3); opacity:0; pointer-events:none; transition:transform .22s cubic-bezier(.2,.9,.3,1.2), opacity .16s;
  }
  ha-card[data-pop=volume] #pop-volume, ha-card[data-pop=channel] #pop-channel { transform:none; opacity:1; pointer-events:auto; }
  .pop-row { display:flex; gap:6px; } .pop-row .key { flex:1; min-width:0; min-height:46px; border-radius:23px; }
  .vpill { position:relative; height:min(30vh, 220px); min-height:150px; border-radius:26px; overflow:hidden; touch-action:none; cursor:ns-resize;
           background:rgba(255,255,255,.12); border:1px solid var(--glass-line); }
  .vfill { position:absolute; left:0; right:0; bottom:0; height:0; background:linear-gradient(0deg, #ffffffee, #ffffffcc); transition:height .08s linear; }
  .vlabel { position:absolute; left:0; right:0; bottom:12px; display:flex; flex-direction:column; align-items:center; gap:2px; color:#10151c; mix-blend-mode:normal; pointer-events:none; }
  .vlabel b { font-size:20px; font-variant-numeric:tabular-nums; }
  .vpill.low .vlabel { color:#fff; }
  .cpill { display:flex; flex-direction:column; border-radius:26px; overflow:hidden; background:rgba(255,255,255,.1); border:1px solid var(--glass-line); }
  .cpill .key { min-height:64px; border-radius:0; border:none; box-shadow:none; background:transparent; backdrop-filter:none; font-size:24px; }
  .cpill .key:active { background:rgba(255,255,255,.22); transform:none; filter:none; }
  .clabel { display:flex; flex-direction:column; align-items:center; gap:2px; padding:6px 4px; border-block:1px solid var(--glass-line); text-align:center; min-height:64px; justify-content:center; }
  .clabel b { font-size:24px; } .clabel span { font-size:11px; color:var(--mute); max-width:80px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

  /* standby overlay */
  .standby-overlay { position:absolute; inset:0; z-index:2; display:none; flex-direction:column; align-items:center; justify-content:center; gap:14px; text-align:center; }
  .stage.standby .standby-overlay { display:flex; }
  .power-big {
    display:flex; align-items:center; justify-content:center; width:112px; height:112px; border:none; border-radius:50%; cursor:pointer;
    background:linear-gradient(160deg, #ff6b61, #d92b20); box-shadow:inset 0 1px 0 rgba(255,255,255,.55), 0 12px 32px rgba(255,69,58,.5);
  }
  .power-big ha-icon { --mdc-icon-size:54px; }
  .power-big:active { filter:brightness(.85); transform:scale(.97); }
  .power-big.busy { animation:pulse 1.2s ease-in-out infinite; }
  @keyframes pulse { 50% { opacity:.55; } }
  .standby-overlay b { display:block; font-weight:600; font-size:15px; }
  .standby-overlay span { font-size:12px; color:var(--mute); }

  /* transient messages */
  .toast, .sheet { position:absolute; left:6px; right:6px; bottom:6px; z-index:5; padding:10px 14px; border-radius:20px; font-size:12px; line-height:1.4; opacity:0; pointer-events:none; transition:opacity .2s; }
  .toast { border-color:rgba(255,120,110,.6); color:#ffd0cc; }
  .sheet { text-align:center; }
  .toast.visible, .sheet.visible { opacity:1; }
  .toast b, .sheet b { font-weight:600; }
  .sheet b { font-size:14px; }
  .sheet .hint { color:var(--mute); }
  .sheet .track { height:5px; margin-top:10px; border-radius:3px; background:rgba(255,255,255,.2); overflow:hidden; }
  .sheet .fill { width:0; height:100%; border-radius:3px; background:var(--red); }

  /* tab change animation */
  @keyframes from-right { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:none; } }
  @keyframes from-left { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:none; } }
  .slide-forward { animation:from-right .18s ease-out; }
  .slide-back { animation:from-left .18s ease-out; }
`;var l=i=>`<ha-icon icon="mdi:${i}"></ha-icon>`,Qe={dpad:'<path d="M12 3l3 4h-6zM12 21l3-4h-6zM3 12l4-3v6zM21 12l-4-3v6z"/><circle cx="12" cy="12" r="2"/>',touch:'<path d="M5 4l5 15 2.5-6 6-2.5z"/>',keypad:'<path d="M6 6h.01M12 6h.01M18 6h.01M6 12h.01M12 12h.01M18 12h.01M6 18h.01M12 18h.01M18 18h.01" style="stroke-width:3.4"/>',apps:'<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>'},Je=i=>`<svg class="tab-icon" viewBox="0 0 24 24" aria-hidden="true">${Qe[i]}</svg>`,d=(i,{button:e,action:t,className:n="",label:a=""})=>{let s=e?`data-button="${e}"`:`data-action="${t}"`,o=a?` aria-label="${a}"`:"";return`<button class="key ${n}" ${s}${o}>${i}</button>`},Ze=()=>`
  <div class="dpad">
    <span></span>${d(l("chevron-up"),{button:"UP",label:"Su"})}<span></span>
    ${d(l("chevron-left"),{button:"LEFT",label:"Sinistra"})}${d("OK",{button:"ENTER",className:"ok primary"})}${d(l("chevron-right"),{button:"RIGHT",label:"Destra"})}
    <span></span>${d(l("chevron-down"),{button:"DOWN",label:"Gi\xF9"})}<span></span>
  </div>`,et=()=>`
  <div class="transport">
    ${d(l("rewind"),{button:"REWIND",label:"Indietro veloce"})}
    ${d(l("play-pause"),{action:"play-pause",label:"Play e pausa"})}
    ${d(l("fast-forward"),{button:"FASTFORWARD",label:"Avanti veloce"})}
  </div>`,tt=()=>`
    <div class="keypad">${[1,2,3,4,5,6,7,8,9].map(e=>d(e,{button:String(e)})).join("")}${d("Lista",{button:"LIST"})}${d("0",{button:"0"})}${d("Guida",{button:"GUIDE"})}</div>
    <div class="keys-extra">
      ${d(l("menu"),{button:"MENU",label:"Menu"})}
      ${d(l("information-outline"),{button:"INFO",label:"Info"})}
      ${d(l("exit-to-app"),{button:"EXIT",label:"Esci"})}
    </div>
    <div class="colors">
      ${d("",{button:"RED",className:"red",label:"Rosso"})}${d("",{button:"GREEN",className:"green",label:"Verde"})}
      ${d("",{button:"YELLOW",className:"yellow",label:"Giallo"})}${d("",{button:"BLUE",className:"blue",label:"Blu"})}
    </div>`,V=(i,e="")=>`
  <div class="sheet-grip"></div>
  <div class="sheet-head"><b>${i}</b>${e}${d(l("close"),{action:"close-sheet",label:"Chiudi"})}</div>`,it=()=>`
  <div class="kb-sheet" id="kb-sheet" role="dialog" aria-label="Tastiera">
    <div class="sheet-grip"></div>
    <div class="line">
      <input type="text" id="text" placeholder="Scrivi o detta\u2026" autocomplete="off" autocapitalize="sentences" enterkeyhint="send">
      ${d(l("microphone"),{action:"dictate",className:"icon-only",label:"Detta"})}
      ${d(l("close"),{action:"close-sheet",className:"icon-only",label:"Chiudi"})}
    </div>
    <div class="line">
      ${d("Cancella",{action:"clear-text"})}
      ${d(`${l("keyboard-return")}&nbsp;Invio`,{action:"enter-key",className:"primary"})}
    </div>
    <div class="status">Il testo appare subito sul campo aperto della TV. Invio conferma e chiude.</div>
  </div>`,nt=()=>`
  <div class="panel-sheet" id="channels-sheet" role="dialog" aria-label="Canali">
    ${V("Canali",d(l("dialpad"),{action:"open-numpad",label:"Digita il numero"}))}
    <label class="search">${l("magnify")}<input type="search" id="channel-search" placeholder="Cerca un canale" autocomplete="off" enterkeyhint="search"></label>
    <div class="sheet-scroll" id="channel-list"></div>
  </div>`,at=()=>{let i=e=>`<button class="key" data-digit="${e}">${e}</button>`;return`
  <div class="panel-sheet" id="numpad-sheet" role="dialog" aria-label="Numero del canale">
    ${V("Numero del canale")}
    <div class="num-display" id="num-display" role="button" aria-label="Vai al canale"><span class="num-ring" id="num-ring"></span><b id="num-value"></b><span id="num-name"></span></div>
    <div class="num-keys">
      ${[1,2,3,4,5,6,7,8,9].map(i).join("")}
      <button class="key" data-digit="-" aria-label="Trattino">${l("minus")}</button>${i(0)}<button class="key" data-digit="del" aria-label="Cancella">${l("backspace-outline")}</button>
    </div>
  </div>`},st=()=>`
  <div class="panel-sheet" id="inputs-sheet" role="dialog" aria-label="Ingressi e app">
    ${V("Ingressi e app")}
    <div class="sheet-scroll" id="inputs-body"></div>
  </div>`,ot=()=>`
  <div class="pop-scrim" id="pop-scrim"></div>
  <div class="pop" id="pop-volume" role="dialog" aria-label="Volume">
    <div class="vpill" id="vpill"><div class="vfill" id="vfill"></div><div class="vlabel">${l("volume-high")}<b id="vol-level">\u2013</b></div></div>
    <div class="pop-row">
      <button class="key" data-repeat="VOLUMEDOWN" aria-label="Volume gi\xF9">${l("minus")}</button>
      <button class="key" data-repeat="VOLUMEUP" aria-label="Volume su">${l("plus")}</button>
    </div>
  </div>
  <div class="pop" id="pop-channel" role="dialog" aria-label="Canale">
    <div class="cpill">
      <button class="key" data-repeat="CHANNELUP" aria-label="Canale su">${l("chevron-up")}</button>
      <div class="clabel"><b id="pop-channel-number">\u2013</b><span id="pop-channel-name"></span></div>
      <button class="key" data-repeat="CHANNELDOWN" aria-label="Canale gi\xF9">${l("chevron-down")}</button>
    </div>
    <div class="pop-row">
      <button class="key" data-action="open-numpad" aria-label="Digita il numero">${l("dialpad")}</button>
      <button class="key" data-action="open-channels" aria-label="Elenco canali">${l("format-list-bulleted")}</button>
    </div>
  </div>`,rt=[{tab:"dpad",icon:"dpad",label:"Frecce"},{tab:"pad",icon:"touch",label:"Touchpad"},{tab:"keys",icon:"keypad",label:"Tasti"},{tab:"apps",icon:"apps",label:"App"}];function Ce(){let i=rt.map(e=>`<button class="tab" data-tab="${e.tab}" aria-label="${e.label}">${Je(e.icon)}<span class="tab-label">${e.label}</span></button>`).join("");return`
<ha-card>
  <div class="kb-backdrop" id="kb-backdrop"></div>
  <div class="head">
    <button class="key power" id="power" aria-label="Accensione">${l("power")}</button>
    <div class="info"><div class="title" id="name"></div><div class="status" id="status"></div></div>
    <button class="key" data-action="open-inputs" aria-label="Ingressi e app" data-group="controls">${l("video-input-hdmi")}</button>
    <button class="key" id="mute" data-action="mute" aria-label="Muto"></button>
  </div>

  <div class="now" id="now" data-mode="live" data-group="controls">
    <button class="key step live-only" data-repeat="CHANNELDOWN" aria-label="Canale gi\xF9">${l("chevron-left")}</button>
    <button class="open" data-action="open-now" aria-label="Canali e app">
      <div class="logo" id="now-logo"></div>
      <div class="text"><div class="line1" id="now-title"></div><div class="line2" id="now-sub"></div><div class="bar" id="now-bar"><i id="now-fill"></i></div></div>
    </button>
    <button class="key step live-only" data-repeat="CHANNELUP" aria-label="Canale su">${l("chevron-right")}</button>
    <button class="key step app-only" data-button="REWIND" aria-label="Indietro veloce">${l("rewind")}</button>
    <button class="key step app-only" data-action="play-pause" aria-label="Play e pausa">${l("play-pause")}</button>
    <button class="key step app-only" data-button="FASTFORWARD" aria-label="Avanti veloce">${l("fast-forward")}</button>
  </div>

  <div class="body" id="body" data-active-tab="dpad">
    <div class="stage" id="stage">
      <div class="center" id="center">
        <div class="panel" data-panel="dpad">${Ze()}${et()}</div>
        <div class="panel" data-panel="pad"><div class="pad" id="pad"></div></div>
        <div class="panel" data-panel="keys">${tt()}</div>
      </div>
      <div class="scroll-view" data-view="apps"><div id="apps"></div></div>

      <div class="standby-overlay">
        <button class="power-big" id="power-big" aria-label="Accendi la TV">${l("power")}</button>
        <div><b id="standby-title"></b><span id="standby-hint"></span></div>
      </div>
      <div class="toast" id="toast" role="status"></div>
      <div class="sheet" id="sheet">
        <b>Spegnere la TV?</b>
        <div class="hint" id="sheet-hint"></div>
        <div class="track"><div class="fill" id="sheet-fill"></div></div>
      </div>
    </div>
    <div class="rail scroll" id="strip"><span>\u25B2</span><span class="vertical">scorri</span><span>\u25BC</span></div>
  </div>

  <div class="dock" data-group="controls">
    ${d(l("keyboard-backspace"),{button:"BACK",label:"Indietro"})}
    ${d(l("home"),{button:"HOME",label:"Home"})}
    ${d(l("keyboard-outline"),{action:"open-keyboard",label:"Tastiera"})}
    <button class="key" data-action="toggle-volume" id="dock-volume" aria-label="Volume">${l("volume-high")}</button>
    <button class="key" data-action="toggle-channel" id="dock-channel" aria-label="Canali">${l("television-guide")}</button>
  </div>
  <div class="tabs" id="tabs" data-group="controls"><span class="tab-pill" id="tab-pill"><i class="blob" id="tab-blob"></i></span>${i}</div>
  ${ot()}
  ${it()}${nt()}${at()}${st()}
</ha-card>`}var Ae=i=>l(i?"volume-off":"volume-high"),$e=i=>i?`${l("cursor-default-click-outline")}<span>Trascina per muovere<br>Tocca per cliccare<br>Doppio tocco tenuto: trascina</span>`:`${l("gesture-swipe")}<span>Swipe = frecce<br>Tocco = OK</span>`;var b=(i,e,t)=>{let n=document.createElement(i);return e&&(n.className=e),t!==void 0&&(n.textContent=t),n},$=(i,e)=>{let t=document.createDocumentFragment();return t.append(b("div","label",i),e),t};function lt(i,{current:e,icons:t,onSelect:n}){let a=b("button",i===e?"tile current":"tile"),s=b("div","icon");return t?.[i]?s.style.backgroundImage=`url("${t[i]}")`:(s.style.background=x[i]??Y,s.textContent=i.charAt(0)),a.append(s,b("span","",i)),a.addEventListener("click",()=>n(i)),a}var ct=i=>i==="Canali TV"?"television":"video-input-hdmi";function F(i,{current:e,icons:t,onSelect:n}){let a=b("div","tiles");return i.forEach(s=>a.append(lt(s,{current:e,icons:t,onSelect:n}))),a}function dt(i,{current:e,onSelect:t,showIcon:n}){let a=b("div","inputs-grid");return i.forEach(s=>{let o=b("button",s===e?"key current":"key");o.innerHTML=`${n(ct(s))}<span>${s.replace("HDMI ","")}</span>`,o.setAttribute("aria-label",s),o.addEventListener("click",()=>t(s)),a.append(o)}),a}function Pe(i,{sources:e,current:t,config:n,icons:a,onSelect:s,showIcon:o}){if(i.replaceChildren(),!e.length){i.append(b("div","status","Elenco disponibile a TV accesa"));return}let r=D(e,n),c={current:t,icons:a,onSelect:s,showIcon:o};r.favorites.length&&i.append($("PREFERITE",F(r.favorites,c))),r.others.length&&i.append($(r.favorites.length?"ALTRE APP":"APP",F(r.others,c)))}function Me(i,{sources:e,current:t,config:n,icons:a,onSelect:s,showIcon:o}){if(i.replaceChildren(),!e.length){i.append(b("div","status","Elenco disponibile a TV accesa"));return}let r=D(e,n),c={current:t,icons:a,onSelect:s,showIcon:o},p=b("button","key more");p.dataset.action="show-all-apps",p.textContent=`Tutte le app \xB7 ${r.others.length+r.favorites.length}`,i.append($("INGRESSI",dt(r.inputs,c)),$("APP",F(r.favorites,c)),p)}var y=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function pt(i){return i?.name?`${y(i.name)} \xB7 ${i.minutesLeft} min`:""}function ht(i,{current:e,starred:t,program:n}){let a=n?.name?`<div class="mini"><i style="width:${Math.round(n.progress*100)}%"></i></div>`:"";return`
    <div class="ch-row${i.number===e?" current":""}" role="button" tabindex="0" data-channel="${y(i.number)}">
      <div class="logo" style="--logo:${v(i.name)}">${y(i.number)}</div>
      <div class="text"><div class="line1">${y(i.name)}</div><div class="line2">${pt(n)}</div>${a}</div>
      <button class="star${t?" on":""}" data-star="${y(i.number)}" aria-label="${t?"Togli dai preferiti":"Aggiungi ai preferiti"}">${l(t?"star":"star-outline")}</button>
    </div>`}function Ie({channels:i,favorites:e,query:t,showAll:n,current:a,programs:s}){if(!i.length)return'<div class="status">Elenco disponibile a TV accesa</div>';let o=u=>ht(u,{current:a,starred:e.includes(u.number),program:s[u.number]});if(t.trim()){let u=ve(i,t).slice(0,60);return u.length?u.map(o).join(""):'<div class="status">Nessun canale trovato</div>'}let r=S(i,e,T),c=e.length?"PREFERITI":"PRIMI CANALI \xB7 tocca la stella per scegliere i tuoi",p=`<button class="key more" data-action="toggle-all-channels">${n?"Mostra solo i preferiti":`Tutti i canali \xB7 ${i.length}`}${l(n?"chevron-up":"chevron-down")}</button>`;return`<div class="label">${c}</div>${r.map(o).join("")}${p}${n?`<div class="label">TUTTI I CANALI</div>${i.map(o).join("")}`:""}`}var Re=[{name:"entity",required:!0,selector:{entity:{domain:"media_player",integration:"webostv"}}},{name:"name",selector:{text:{}}},{name:"haptics",selector:{select:{mode:"dropdown",options:[{value:"off",label:"Spenta"},{value:"soft",label:"Leggera"},{value:"normal",label:"Normale"},{value:"strong",label:"Forte"}]}}},{name:"auto_open_keyboard",selector:{boolean:{}}},{name:"scroll_gain",selector:{number:{min:1,max:5,step:.5,mode:"slider"}}},{name:"scroll_invert",selector:{boolean:{}}}],Ne={entity:"TV",name:"Nome mostrato",haptics:"Vibrazione",auto_open_keyboard:"Apri la tastiera quando la TV chiede un testo",scroll_gain:"Velocit\xE0 di scorrimento",scroll_invert:"Inverti la direzione dello scorrimento"},ze={haptics:"Si sente su Android e nell'app di Home Assistant. Su iPhone non \xE8 disponibile.",scroll_invert:"Attivala se la striscia laterale scorre al contrario."};async function ut(){if(!customElements.get("ha-form")){try{await(await(await window.loadCardHelpers?.())?.createCardElement({type:"entities",entities:[]}))?.constructor?.getConfigElement?.()}catch{}await Promise.race([customElements.whenDefined("ha-form"),new Promise(i=>setTimeout(i,4e3))])}}var K=class extends HTMLElement{setConfig(e){this._config={...e},ut().then(()=>this._render())}set hass(e){this._hass=e,this._form&&(this._form.hass=e)}_render(){this._form||(this._form=document.createElement("ha-form"),this._form.schema=Re,this._form.computeLabel=e=>Ne[e.name]??e.name,this._form.computeHelper=e=>ze[e.name],this._form.addEventListener("value-changed",e=>this._onChange(e)),this.append(this._form)),this._form.hass=this._hass,this._form.data={..._,...this._config,haptics:O(this._config.haptics)}}_onChange(e){e.stopPropagation(),this._config={...this._config,...e.detail.value},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}};customElements.define("lg-tv-remote-card-editor",K);var De=["pointerup","pointerleave","pointercancel"];function Oe(i,e){let t=0,n=0,a=null,s=0,o=()=>{clearTimeout(a),a=null;let r=Math.round(t),c=Math.round(n);!r&&!c||(t-=r,n-=c,s=performance.now(),i(r,c))};return{flush:o,reset(){t=0,n=0},add(r,c){t+=r,n+=c;let p=e-(performance.now()-s);p<=0?o():a===null&&(a=setTimeout(o,p))}}}function He(i,e){let t,n=null,a=-1/0,s=()=>{n=null,a=performance.now(),i(t)};return o=>{t=o;let r=e-(performance.now()-a);r<=0?s():n===null&&(n=setTimeout(s,r))}}function Be(i,e){i.forEach(t=>{let n,a,s=()=>{clearTimeout(n),clearInterval(a)};t.addEventListener("pointerdown",o=>{o.preventDefault();let r=t.dataset.repeat;e(r),n=setTimeout(()=>{a=setInterval(()=>e(r),P.intervalMs)},P.delayMs)}),De.forEach(o=>t.addEventListener(o,s))})}function Ve(i,{durationMs:e,enabled:t,onStart:n,onComplete:a,onCancel:s}){let o=null,r=()=>{o!==null&&(clearTimeout(o),o=null,s())};i.addEventListener("pointerdown",c=>{t()&&(c.preventDefault(),n(),o=setTimeout(()=>{o=null,a()},e))}),De.forEach(c=>i.addEventListener(c,r))}function Fe(i,e){let t={id:null,x:0,y:0,startX:0,startY:0,startedAt:0,moved:!1},n=!1,a=0,s=Oe((r,c)=>e.pointer("move",n?{dx:r,dy:c,down:1}:{dx:r,dy:c}),g.tickMs),o=()=>{n&&(n=!1,e.pointer("move",{dx:0,dy:0,down:0}))};i.addEventListener("pointerdown",r=>{i.setPointerCapture(r.pointerId),s.reset(),n=e.hasPointer()&&Date.now()-a<g.doubleTapMs,n&&e.buzz(),Object.assign(t,{id:r.pointerId,x:r.clientX,y:r.clientY,startX:r.clientX,startY:r.clientY,startedAt:Date.now(),moved:!1})}),i.addEventListener("pointermove",r=>{if(t.id!==r.pointerId||(Math.abs(r.clientX-t.startX)+Math.abs(r.clientY-t.startY)>g.moveThresholdPx&&(t.moved=!0),!e.hasPointer()))return;let p=re(r.clientX-t.x,r.clientY-t.y);t.x=r.clientX,t.y=r.clientY,s.add(p.x,p.y)}),i.addEventListener("pointerup",r=>{if(t.id===r.pointerId){if(t.id=null,e.hasPointer()){if(s.flush(),n)return o();!t.moved&&Date.now()-t.startedAt<g.tapMaxMs&&(e.buzz(),a=Date.now(),e.pointer("click",{}));return}e.press(oe({dx:r.clientX-t.startX,dy:r.clientY-t.startY,moved:t.moved}))}}),i.addEventListener("pointercancel",()=>{t.id=null,s.flush(),o()})}function Ke(i,{gain:e,send:t}){let n=null,a=0,s=Oe((o,r)=>t(r),X.tickMs);i.addEventListener("pointerdown",o=>{i.setPointerCapture(o.pointerId),n=o.pointerId,a=o.clientY,s.reset()}),i.addEventListener("pointermove",o=>{n===o.pointerId&&(s.add(0,(o.clientY-a)*e),a=o.clientY)}),["pointerup","pointercancel"].forEach(o=>i.addEventListener(o,()=>{n=null}))}function We(i,e){let t=["pad","strip","text","power","tabs"],n=null;i.addEventListener("pointerdown",a=>{if(!e.enabled()){n=null;return}n=a.composedPath().some(o=>t.includes(o.id)||o.dataset?.repeat)?null:{id:a.pointerId,x:a.clientX,y:a.clientY,at:Date.now()}}),i.addEventListener("pointerup",a=>{if(!n||n.id!==a.pointerId)return;let s={dx:a.clientX-n.x,dy:a.clientY-n.y,durationMs:Date.now()-n.at};n=null;let o=se(e.currentTab(),s);o&&(e.markSwiped(),e.buzz(),e.goTo(o,s.dx<0?1:-1))}),i.addEventListener("pointercancel",()=>{n=null})}function qe(i,e,t){let a=null;i.addEventListener("pointerdown",o=>{let r=e.getBoundingClientRect();o.clientX<r.left||o.clientX>r.right||(a={id:o.pointerId,startX:o.clientX,moving:!1})}),i.addEventListener("pointermove",o=>{if(!(!a||a.id!==o.pointerId)){if(!a.moving){if(Math.abs(o.clientX-a.startX)<6)return;a.moving=!0;try{i.setPointerCapture(o.pointerId)}catch{}t.start()}t.move(o.clientX-i.getBoundingClientRect().left)}});let s=o=>{if(!a||a.id!==o.pointerId)return;let r=a.moving;a=null,r&&t.drop()};i.addEventListener("pointerup",s),i.addEventListener("pointercancel",s)}var bt=["apps"],Ye="com.webos.service.ime",mt=800,W=class extends HTMLElement{static getConfigElement(){return document.createElement("lg-tv-remote-card-editor")}static getStubConfig(e){return{entity:Object.keys(e?.states??{}).find(n=>n.startsWith("media_player.")&&/lg|webos/i.test(n))??_.entity}}setConfig(e){this._config={..._,...e},this._tab=m[0],this._wakeRequestedAt=0,this._sleepRequestedAt=0,this._powerHeldAt=0,this._swipedAt=0,this._sheet=null,this._watchingKeyboard=!1,this._keyboardWatchRetryAt=0,this._channels=[],this._favorites=C("favorites")??this._config.favorite_channels.map(String),this._programs={},this._now=null,this._channelQuery="",this._showAllChannels=!1,this._typed="",this._icons={},this._root||this._render()}set hass(e){this._hass=e,this._subscribeKeyboardEvents(),this._refresh()}connectedCallback(){this._dataTimer=setInterval(()=>this._refreshNow(),ee)}disconnectedCallback(){clearInterval(this._dataTimer),clearTimeout(this._laterTimer),this._keyboardEvents?.then(e=>e()),this._keyboardEvents=null}get _keyboardOpen(){return this._sheet==="keyboard"}getCardSize(){return 12}get _stateObj(){return this._hass?.states[this._config.entity]}get _tvOn(){return ae(this._stateObj)}get _hasPointer(){return!!this._hass?.services.lgtv_pointer}async _callService(e,t,n,a){try{return await this._hass.callService(e,t,n),!0}catch{return this._showError(a),!1}}_press(e){return this._buzz(),this._callService("webostv","button",{entity_id:this._config.entity,button:e})}_command(e,t,n){return this._callService("webostv","command",{entity_id:this._config.entity,command:e,payload:t},n)}_mediaPlayer(e,t={}){return this._callService("media_player",e,{entity_id:this._config.entity,...t})}_pointer(e,t){return this._callService("lgtv_pointer",e,{entity_id:this._config.entity,...t},"pointer")}_haptic(e="tap"){let t=be(this._config.haptics,e);if(!t||this._hass?.vibrate===!1)return;let n=this._hass?.auth?.external;try{n?.fireMessage?n.fireMessage({type:"haptic",payload:{hapticType:t.native}}):navigator.vibrate?.(t.pattern)}catch{}}_buzz(){this._haptic("tap")}_render(){this._root=this.attachShadow({mode:"open"}),this._root.innerHTML=`<style>${Le}</style>${Ce()}`,this._ui=this._queryElements(),this._wire(),this._goToTab(this._tab)}_queryElements(){let e=t=>this._root.getElementById(t);return{card:this._root.querySelector("ha-card"),stage:e("stage"),center:e("center"),body:e("body"),tabs:e("tabs"),tabPill:e("tab-pill"),tabBlob:e("tab-blob"),now:e("now"),nowLogo:e("now-logo"),nowTitle:e("now-title"),nowSub:e("now-sub"),nowBar:e("now-bar"),nowFill:e("now-fill"),channelList:e("channel-list"),channelSearch:e("channel-search"),inputsBody:e("inputs-body"),numDisplay:e("num-display"),numValue:e("num-value"),numName:e("num-name"),numRing:e("num-ring"),name:e("name"),status:e("status"),mute:e("mute"),power:e("power"),pad:e("pad"),strip:e("strip"),apps:e("apps"),text:e("text"),dock:this._root.querySelector(".dock"),dockVolume:e("dock-volume"),dockChannel:e("dock-channel"),popScrim:e("pop-scrim"),popVolume:e("pop-volume"),popChannel:e("pop-channel"),vpill:e("vpill"),vfill:e("vfill"),volLevel:e("vol-level"),popChannelNumber:e("pop-channel-number"),popChannelName:e("pop-channel-name"),standbyTitle:e("standby-title"),standbyHint:e("standby-hint"),powerBig:e("power-big"),backdrop:e("kb-backdrop"),toast:e("toast"),sheet:e("sheet"),sheetHint:e("sheet-hint"),sheetFill:e("sheet-fill"),controls:this._root.querySelectorAll("[data-group=controls]")}}_wire(){let e=this._ui;this._root.addEventListener("click",t=>this._onClick(t)),e.text.addEventListener("input",()=>this._scheduleTextSync()),e.text.addEventListener("keydown",t=>this._onTextKey(t)),e.backdrop.addEventListener("click",()=>this._closeSheet()),e.popScrim.addEventListener("click",()=>this._closePop());for(let t of[e.popVolume,e.popChannel])t.addEventListener("pointerdown",()=>this._armPopTimer());this._wireVolumeSlider(),e.channelSearch.addEventListener("input",()=>{this._channelQuery=e.channelSearch.value,this._renderChannelList()}),e.numDisplay.addEventListener("click",()=>this._confirmNumber()),window.visualViewport?.addEventListener("resize",()=>this._placeSheets()),window.addEventListener("resize",()=>{this._placeSheets(),this._placeTabPill()}),e.power.addEventListener("click",()=>this._onPowerClick()),e.powerBig.addEventListener("click",()=>this._requestPowerOn()),Be(this._root.querySelectorAll("[data-repeat]"),t=>this._press(t)),Ve(e.power,{durationMs:M,enabled:()=>this._tvOn,onStart:()=>this._startPowerHold(),onComplete:()=>this._completePowerHold(),onCancel:()=>this._cancelPowerHold()}),Fe(e.pad,{hasPointer:()=>this._hasPointer,pointer:(t,n)=>this._pointer(t,n),press:t=>this._press(t),buzz:()=>this._buzz()}),Ke(e.strip,{gain:this._config.scroll_gain,send:t=>this._pointer("scroll",{dx:0,dy:this._config.scroll_invert?-t:t})}),qe(e.tabs,e.tabPill,{start:()=>this._startPillDrag(),move:t=>this._dragPill(t),drop:()=>this._dropPill()}),We(e.card,{enabled:()=>!this._sheet&&!this._pop,currentTab:()=>this._tab,goTo:(t,n)=>this._goToTab(t,n),buzz:()=>this._buzz(),markSwiped:()=>{this._swipedAt=Date.now()}})}_refresh(){if(!this._ui||!this._hass)return;let e=this._tvOn;e?this._wakeRequestedAt=0:this._sleepRequestedAt=0;let t=this._isWaking(),n=this._isSleeping(),a=this._stateObj,s=a?.attributes??{},o=this._ui;this._watchTvKeyboard(e),o.name.textContent=this._config.name||s.friendly_name||"TV",o.status.textContent=pe(a,{waking:t,sleeping:n}),o.power.classList.toggle("busy",t||n),o.power.classList.toggle("off",!e),o.stage.classList.toggle("standby",!e),o.controls.forEach(w=>w.classList.toggle("disabled",!e)),o.mute.classList.toggle("disabled",!e),o.standbyTitle.textContent=t?"Accensione in corso\u2026":a?.state==="unavailable"?"TV non raggiungibile":"Accendi la TV",o.standbyHint.textContent=t?"Attendi qualche secondo":"Ci vogliono circa 15 secondi",o.powerBig.classList.toggle("busy",t);let r=!!s.is_volume_muted;o.mute.classList.toggle("alert",r),o.mute.innerHTML=Ae(r),this._renderVolume(s.volume_level,r),o.strip.classList.toggle("available",this._hasPointer),o.pad.innerHTML=$e(this._hasPointer);let c=s.source_list??[],p=`${c.join("|")}#${s.source??""}#${Object.keys(this._icons).length}`;p!==this._appsRenderKey&&(this._appsRenderKey=p,this._renderSources(c,s.source)),e&&this._ensureIcons();let u=`${e}|${s.app_id}|${s.media_title}|${s.source}`;u!==this._nowKey&&(this._nowKey=u,this._now=null,this._refreshNow()),this._renderNow()}_renderSources(e,t){let n={sources:e,current:t,config:this._config,icons:this._icons,showIcon:l,onSelect:a=>this._selectSource(a)};Pe(this._ui.apps,n),Me(this._ui.inputsBody,n)}async _refreshNow(){if(!(!this._hass||!this._tvOn||!L(this._stateObj?.attributes)||this._nowBusy)){this._nowBusy=!0;try{let{channel:e,programList:t}=await B(this._hass,this._config.entity);if(!e)return;this._now={number:String(e.channelNumber),name:e.channelName,program:H(t)},this._renderNow()}catch{}finally{this._nowBusy=!1}}}_renderNow(){let e=this._stateObj?.attributes??{},t=this._ui,n=L(e);t.now.classList.toggle("gone",ue(e)),t.now.dataset.mode=n?"live":"app",t.nowBar.style.display="none";let a="#1d4ed8";if(n){let s=this._now?.number,o=this._now?.name??e.media_title??"Canali TV",r=this._now?.program;t.nowLogo.style.cssText=`--logo:${v(o)}`,t.nowLogo.textContent=s??"",t.nowTitle.textContent=o,t.nowSub.textContent=r?`${r.name} \xB7 ${r.minutesLeft} min`:"Canali TV",r&&(t.nowBar.style.display="",t.nowFill.style.width=`${Math.round(r.progress*100)}%`),a=v(o),t.popChannelNumber.textContent=s??"\u2013",t.popChannelName.textContent=o}else{let s=e.source??"TV",o=this._icons[s];t.nowLogo.style.cssText=o?`background-image:url("${o}")`:`--logo:${x[s]??"#444"}`,t.nowLogo.textContent=o?"":s.charAt(0),t.nowTitle.textContent=s,t.nowSub.textContent=/^HDMI/.test(s)?"Ingresso":"In riproduzione",a=x[s]??"#1d4ed8",t.popChannelNumber.textContent="\u2013",t.popChannelName.textContent=s}t.card.style.setProperty("--tint",a)}async _ensureIcons(){if(!(Object.keys(this._icons).length||this._iconsTried&&Date.now()-this._iconsTried<6e4)){this._iconsTried=Date.now();try{let e=await Se(this._hass,this._config.entity);Object.keys(e).length&&(this._icons=e,this._appsRenderKey=null,this._refresh())}catch{}}}_isSleeping(){return this._sleepRequestedAt>0&&Date.now()-this._sleepRequestedAt<R}_refreshAfter(e){clearTimeout(this._laterTimer),this._laterTimer=setTimeout(()=>this._refresh(),e+100)}_isWaking(){return this._wakeRequestedAt>0&&Date.now()-this._wakeRequestedAt<I}_goToTab(e,t=0){let n=this._tab;this._tab=e;let a=bt.includes(e);if(this._root.querySelectorAll("[data-tab]").forEach(s=>s.classList.toggle("selected",s.dataset.tab===e)),this._ui.body.dataset.activeTab=e,this._placeTabPill(),this._root.querySelectorAll("[data-panel]").forEach(s=>s.classList.toggle("active",s.dataset.panel===e)),this._root.querySelectorAll("[data-view]").forEach(s=>s.classList.toggle("active",s.dataset.view===e)),this._ui.center.style.display=a?"none":"flex",t&&n!==e){let s=a?this._root.querySelector(`[data-view=${e}]`):this._ui.center;this._animateSlide(s,t)}}_placeTabPill(){let{tabs:e,tabPill:t}=this._ui,n=e.clientWidth;if(!n){requestAnimationFrame(()=>this._placeTabPill());return}let a=me({innerWidth:n-2*h.padding,count:m.length,selectedIndex:m.indexOf(this._tab),gap:h.gap,padding:h.padding,selectedFlex:h.selectedFlex}),s=Math.abs(a.left-(this._pillLeft??a.left));this._pillLeft=a.left,t.style.width=`${a.width}px`,t.style.transform=`translateX(${a.left}px)`,s>1&&e.classList.contains("settled")&&this._stretchBlob(s),e.classList.contains("settled")||requestAnimationFrame(()=>requestAnimationFrame(()=>e.classList.add("settled")))}_stretchBlob(e){if(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)return;let t=Math.min(h.stretchMax,e/360);this._ui.tabBlob.animate([{transform:"scale(1, 1)"},{transform:`scale(${1+t}, ${1-t*.55})`,offset:.3},{transform:`scale(${1-t*.25}, ${1+t*.3})`,offset:.65},{transform:"scale(1, 1)"}],{duration:h.animationMs+160,easing:"ease-out"})}_startPillDrag(){let{tabs:e}=this._ui;this._pillIndex=null,e.classList.add("dragging","grab"),clearTimeout(this._grabTimer),this._grabTimer=setTimeout(()=>e.classList.remove("grab"),260)}_dragPill(e){let{tabs:t,tabPill:n}=this._ui,a=n.offsetHeight,s=Math.min(Math.max(e-a/2,h.padding),t.clientWidth-h.padding-a);n.style.width=`${a}px`,n.style.transform=`translateX(${s}px)`;let o=Math.abs(s-(this._pillLeft??s));this._pillLeft=s,t.style.setProperty("--sx",1+Math.min(.3,o/50)),t.style.setProperty("--sy",1-Math.min(.14,o/110));let r=[...t.querySelectorAll(".tab")],c=ge(e,r.map(p=>({left:p.offsetLeft,width:p.offsetWidth})));c!==this._pillIndex&&(this._pillIndex=c,this._haptic("step"),r.forEach((p,u)=>p.classList.toggle("hover",u===c)))}_dropPill(){let{tabs:e}=this._ui,t=this._pillIndex??m.indexOf(this._tab);e.classList.remove("dragging","grab"),e.style.removeProperty("--sx"),e.style.removeProperty("--sy"),e.querySelectorAll(".tab").forEach(n=>n.classList.remove("hover")),this._pillIndex=null,this._swipedAt=Date.now(),this._haptic("tap"),this._goToTab(m[t])}_animateSlide(e,t){e.classList.remove("slide-forward","slide-back"),e.offsetWidth,e.classList.add(t>0?"slide-forward":"slide-back")}_onClick(e){if(Date.now()-this._swipedAt<f.ghostClickMs)return;let t=e.target.closest("[data-tab]");if(t)return this._buzz(),this._goToTab(t.dataset.tab);let n=e.target.closest("[data-star]");if(n)return this._toggleStar(n.dataset.star);let a=e.target.closest("[data-channel]");if(a)return this._tuneChannel(a.dataset.channel);let s=e.target.closest("[data-digit]");if(s)return this._onDigit(s.dataset.digit);let o=e.target.closest("[data-button]");if(o)return this._press(o.dataset.button);let r=e.target.closest("[data-action]");r&&this._runAction(r.dataset.action)}_runAction(e){switch(e){case"mute":return this._buzz(),this._mediaPlayer("volume_mute",{is_volume_muted:!this._stateObj?.attributes.is_volume_muted});case"play-pause":return this._buzz(),this._mediaPlayer("media_play_pause");case"toggle-volume":return this._togglePop("volume");case"toggle-channel":return this._togglePop("channel");case"open-keyboard":return this._openSheet("keyboard");case"close-sheet":return this._closeSheet();case"open-now":return this._openSheet(L(this._stateObj?.attributes)?"channels":"inputs");case"open-channels":return this._openSheet("channels");case"open-inputs":return this._openSheet("inputs");case"open-numpad":return this._openSheet("numpad");case"toggle-all-channels":return this._showAllChannels=!this._showAllChannels,this._renderChannelList();case"show-all-apps":return this._closeSheet(),this._goToTab("apps");case"clear-text":return this._clearText();case"enter-key":return this._pressEnterKey();case"dictate":return this._dictate();default:throw new Error(`Unknown card action: ${e}`)}}_selectSource(e){this._haptic("success"),this._mediaPlayer("select_source",{source:e}),this._closeSheet()}_scheduleTextSync(){clearTimeout(this._textSyncTimer),this._textSyncTimer=setTimeout(()=>this._syncText(),G)}_syncText(){return this._textSync?(this._textDirty=!0,this._textSync):(this._textSync=this._flushText().finally(()=>{this._textSync=null}),this._textSync)}async _flushText(){let e;do this._textDirty=!1,e=await this._command(`${Ye}/insertText`,le(this._ui.text.value),"text");while(this._textDirty&&e)}_clearText(){this._ui.text.value="",clearTimeout(this._textSyncTimer),this._syncText()}async _pressEnterKey(){clearTimeout(this._textSyncTimer),await this._syncText(),await this._command(`${Ye}/sendEnterKey`,{},"text")&&(this._ui.text.value="",this._closeSheet())}_onTextKey(e){e.key==="Enter"?this._pressEnterKey():e.key==="Escape"&&this._closeSheet()}_subscribeKeyboardEvents(){!this._config.auto_open_keyboard||this._keyboardEvents||!this._hass?.connection||(this._keyboardEvents=this._hass.connection.subscribeEvents(e=>this._onTvKeyboardEvent(e.data),U))}_watchTvKeyboard(e){if(!this._config.auto_open_keyboard)return;if(!e){this._watchingKeyboard=!1;return}!this._hass.services.lgtv_pointer?.watch_keyboard||this._watchingKeyboard||Date.now()<this._keyboardWatchRetryAt||(this._watchingKeyboard=!0,this._hass.callService("lgtv_pointer","watch_keyboard",{entity_id:this._config.entity}).catch(()=>{this._watchingKeyboard=!1,this._keyboardWatchRetryAt=Date.now()+j}))}_onTvKeyboardEvent({entity_id:e,focus:t}){if(e!==this._config.entity)return;let n=de({focus:t,sheetOpen:this._keyboardOpen,hasText:!!this._ui.text.value});n==="open"?this._openSheet("keyboard"):n==="close"&&this._closeSheet()}_togglePop(e){if(this._buzz(),this._pop===e)return this._closePop();this._pop=e;let{card:t,dock:n,popVolume:a,popChannel:s}=this._ui,o=e==="volume"?this._ui.dockVolume:this._ui.dockChannel,r=e==="volume"?a:s,c=t.getBoundingClientRect(),p=n.getBoundingClientRect(),u=o.getBoundingClientRect(),w=r.offsetWidth||104,q=Math.max(8,c.right-u.right-(w-u.width)/2);t.style.setProperty("--pop-right",`${q}px`),t.style.setProperty("--pop-bottom",`${c.bottom-p.top+8}px`);let Xe=c.right-q-w;t.style.setProperty("--pop-origin",`${u.left+u.width/2-Xe}px 100%`),t.dataset.pop=e,o.classList.add("active"),this._armPopTimer()}_closePop(){this._pop&&(this._pop=null,delete this._ui.card.dataset.pop,this._ui.dockVolume.classList.remove("active"),this._ui.dockChannel.classList.remove("active"),clearTimeout(this._popTimer))}_armPopTimer(){clearTimeout(this._popTimer),this._popTimer=setTimeout(()=>this._closePop(),ie)}_wireVolumeSlider(){let{vpill:e}=this._ui,t=n=>{let a=e.getBoundingClientRect(),s=Math.min(1,Math.max(0,(a.bottom-n.clientY)/a.height)),o=Math.round(s*33);o!==this._volumeNotch&&(this._volumeNotch=o,this._haptic("step")),this._renderVolume(s,!1),this._volumeSetter(s),this._armPopTimer()};this._volumeSetter=He(n=>this._mediaPlayer("volume_set",{volume_level:Math.round(n*100)/100}),ne),e.addEventListener("pointerdown",n=>{e.setPointerCapture(n.pointerId),t(n)}),e.addEventListener("pointermove",n=>{e.hasPointerCapture(n.pointerId)&&t(n)})}_renderVolume(e,t){let{vfill:n,vpill:a,volLevel:s,dockVolume:o}=this._ui,r=e==null?0:Math.round(e*100);n.style.height=`${r}%`,a.classList.toggle("low",r<18),s.textContent=e==null?"\u2013":r,o.innerHTML=l(t?"volume-off":e!=null&&e<.34?"volume-low":"volume-high")}_openSheet(e){this._buzz(),this._closePop(),this._sheet=e,this._ui.card.dataset.sheet=e,this._placeSheets(),e==="keyboard"&&this._ui.text.focus(),e==="channels"&&this._onChannelsOpened(),e==="numpad"&&this._onNumpadOpened(),e==="inputs"&&this._renderSources(this._stateObj?.attributes.source_list??[],this._stateObj?.attributes.source)}_closeSheet(){this._sheet=null,delete this._ui.card.dataset.sheet,this._ui.text.blur(),this._ui.channelSearch.blur(),this._cancelNumberTimer()}_placeSheets(){let{card:e}=this._ui,{left:t,width:n}=e.getBoundingClientRect();e.style.setProperty("--kb-left",`${t}px`),e.style.setProperty("--kb-width",`${n}px`);let a=window.visualViewport;if(!a)return;let s=ce({layoutHeight:window.innerHeight,visualHeight:a.height,visualOffsetTop:a.offsetTop});e.style.setProperty("--kb-inset",`${s}px`)}async _ensureChannels(){if(!(this._channels.length||this._loadingChannels||!this._tvOn)){this._loadingChannels=!0;try{this._channels=xe(await Ee(this._hass,this._config.entity))}catch{this._showError("channels")}finally{this._loadingChannels=!1}}}async _onChannelsOpened(){this._ui.channelSearch.value="",this._channelQuery="",this._renderChannelList(),await this._ensureChannels(),this._renderChannelList(),this._loadListedPrograms()}_renderChannelList(){this._ui.channelList.innerHTML=Ie({channels:this._channels,favorites:this._favorites,query:this._channelQuery,showAll:this._showAllChannels,current:this._now?.number,programs:this._programs})}async _loadListedPrograms(){let e=S(this._channels,this._favorites,T);for(let t of e){let n=this._programs[t.number];if(!(n&&Date.now()-n.at<te)){if(this._sheet!=="channels")return;try{let{programList:a}=await B(this._hass,this._config.entity,t.id);this._programs[t.number]={...H(a)??{},at:Date.now()},this._renderChannelList()}catch{return}}}}_toggleStar(e){this._favorites=ye(this._favorites,e),A("favorites",this._favorites),this._renderChannelList(),this._loadListedPrograms()}_tuneChannel(e){this._haptic("success"),this._mediaPlayer("play_media",{media_content_type:"channel",media_content_id:e}),this._closeSheet(),setTimeout(()=>{this._nowKey=null,this._refreshNow()},1500)}_onNumpadOpened(){this._typed="",this._renderNumpad(),this._ensureChannels().then(()=>this._renderNumpad())}_onDigit(e){this._buzz(),e==="del"?this._typed=this._typed.slice(0,-1):this._typed.length<k.maxDigits&&(this._typed+=e),this._renderNumpad(),this._armNumberTimer()}_renderNumpad(){let{numValue:e,numName:t}=this._ui,n=E(this._channels,this._typed);e.textContent=this._typed,this._typed?n?t.textContent=n.name:t.textContent=this._typed.length>=2?"Canale non trovato":"":t.textContent="Scrivi il numero del canale"}_armNumberTimer(){if(this._cancelNumberTimer(),!E(this._channels,this._typed))return;let{numDisplay:e,numRing:t}=this._ui,n=Date.now();e.classList.add("counting");let a=()=>{let s=Math.min(1,(Date.now()-n)/k.delayMs);t.style.setProperty("--p",`${Math.round(s*100)}%`),s<1&&(this._numberFrame=requestAnimationFrame(a))};a(),this._numberTimer=setTimeout(()=>this._confirmNumber(),k.delayMs)}_cancelNumberTimer(){clearTimeout(this._numberTimer),cancelAnimationFrame(this._numberFrame),this._ui.numDisplay.classList.remove("counting"),this._ui.numRing.style.setProperty("--p","0%")}_confirmNumber(){this._cancelNumberTimer();let e=E(this._channels,this._typed);if(!e){let{numDisplay:t}=this._ui;t.classList.remove("bad"),t.offsetWidth,t.classList.add("bad"),this._haptic("error");return}this._typed="",this._tuneChannel(e.number)}_dictate(){let e=window.SpeechRecognition||window.webkitSpeechRecognition;if(!e){this._ui.text.placeholder="Usa il microfono della tastiera",this._ui.text.focus();return}let t=new e;t.lang="it-IT",t.interimResults=!1,t.onresult=n=>{this._ui.text.value=n.results[0][0].transcript,this._syncText()},t.onerror=()=>{this._ui.text.placeholder="Dettatura non riuscita"},t.start()}_onPowerClick(){let e=Date.now()-this._powerHeldAt<mt;!this._tvOn&&!e&&this._requestPowerOn()}_requestPowerOn(){this._haptic("heavy"),this._wakeRequestedAt=Date.now(),this._mediaPlayer("turn_on"),this._refresh(),this._refreshAfter(I)}_startPowerHold(){let{sheet:e,sheetHint:t,sheetFill:n,power:a}=this._ui;clearTimeout(this._sheetHideTimer),t.textContent="Tieni premuto il tasto per un secondo",e.classList.add("visible"),a.classList.add("holding"),this._setHoldProgress(0,"none"),n.offsetWidth,this._setHoldProgress(100,`width ${M}ms linear`)}_completePowerHold(){this._powerHeldAt=Date.now(),this._haptic("heavy"),this._sleepRequestedAt=Date.now(),this._mediaPlayer("turn_off"),this._refresh(),this._refreshAfter(R),this._ui.sheet.classList.remove("visible"),this._ui.power.classList.remove("holding"),this._setHoldProgress(0,"none")}_cancelPowerHold(){this._ui.power.classList.remove("holding"),this._setHoldProgress(0,"none"),this._ui.sheetHint.textContent="Tieni premuto pi\xF9 a lungo per spegnere",this._sheetHideTimer=setTimeout(()=>this._ui.sheet.classList.remove("visible"),J)}_setHoldProgress(e,t){this._ui.sheetFill.style.transition=t,this._ui.sheetFill.style.width=`${e}%`}_showError(e){this._haptic("error");let{title:t,hint:n}=he({tvOn:this._tvOn,context:e});this._ui.toast.innerHTML=`<b>${t}</b><br>${n}`,this._ui.toast.classList.add("visible"),clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>this._ui.toast.classList.remove("visible"),Q)}};customElements.define("lg-tv-remote-card",W);window.customCards=window.customCards||[];window.customCards.push({type:"lg-tv-remote-card",name:"LG TV Remote",description:"Telecomando LG webOS per smartphone: touchpad, app, testo, volume e canali"});
