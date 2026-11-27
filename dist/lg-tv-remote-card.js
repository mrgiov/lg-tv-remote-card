var Qe="media_player.lg_tv",f=["dpad","pad","keys","apps"],x={entity:Qe,name:"",favorites:["Netflix","YouTube","Prime Video","Disney+","RaiPlay","Stremio"],hidden:["Developer Mode","Memory Care","OfficeViewer","FlexIt"],scroll_gain:2,scroll_invert:!1,favorite_channels:[],haptics:"soft",auto_open_keyboard:!0},v={Netflix:"#b1121b",YouTube:"#c4302b","Prime Video":"#0a5ea8","Disney+":"#1a2c6b",RaiPlay:"#1b6fb0",Stremio:"#4a3a6b"},j="#444444",g={gain:2.8,accelerationPx:14,tickMs:33,moveThresholdPx:8,tapMaxMs:400,doubleTapMs:300},G={tickMs:50},_={minDistancePx:60,horizontalRatio:1.5,maxMs:700,ghostClickMs:350},I={delayMs:450,intervalMs:180},Q="lgtv_pointer_keyboard",J=1e4,Z=250,N=1e3,R=4e4,O=12e3,ee=3500,te=1400,D={soft:{scale:1,native:{tap:"selection",step:"selection",success:"light",error:"warning",heavy:"medium"}},normal:{scale:1.6,native:{tap:"light",step:"selection",success:"success",error:"warning",heavy:"medium"}},strong:{scale:2.6,native:{tap:"medium",step:"light",success:"success",error:"failure",heavy:"heavy"}}},ie={tap:20,step:12,success:[40,50,40],error:[80,60,80],heavy:80},k={delayMs:1800,maxDigits:3},ae=6e4,z=1440*60*1e3,ne=300*1e3,T=8,se=3500,oe=120,h={gap:4,padding:4,selectedFlex:1.75,animationMs:360,stretchMax:.32};var Je=/^HDMI \d+$/,Ze="Canali TV",re=i=>!!i&&i.state!=="off"&&i.state!=="unavailable";function H(i,{favorites:e,hidden:t}){let a=e.filter(o=>i.includes(o)),n=i.filter(o=>Je.test(o)||o===Ze),s=i.filter(o=>!a.includes(o)&&!n.includes(o)&&!t.includes(o));return{favorites:a,inputs:n,others:s}}function le(i,{dx:e,dy:t,durationMs:a}){let n=Math.abs(e)>=_.minDistancePx,s=Math.abs(e)>=Math.abs(t)*_.horizontalRatio;if(!n||!s||a>_.maxMs)return null;let o=e<0?1:-1;return f[f.indexOf(i)+o]??null}function ce({dx:i,dy:e,moved:t}){return t?Math.abs(i)>Math.abs(e)?i>0?"RIGHT":"LEFT":e>0?"DOWN":"UP":"ENTER"}function de(i,e){let t=1+Math.min(1,Math.hypot(i,e)/g.accelerationPx),a=g.gain*t;return{x:i*a,y:e*a}}var pe=i=>({text:i,replace:!0});function he({layoutHeight:i,visualHeight:e,visualOffsetTop:t}){return Math.max(0,Math.round(i-e-t))}function ue({focus:i,sheetOpen:e,hasText:t}){return i?e?null:"open":e&&!t?"close":null}function be(i,{waking:e,sleeping:t=!1,t:a}){if(!i)return a("status.notFound");if(t)return a("status.sleeping");if(e)return a("status.waking");if(i.state==="unavailable")return a("status.unavailable");if(i.state==="off")return a("status.off");let{source:n,media_title:s}=i.attributes;return n&&s?`${n} \xB7 ${s}`:n||a("status.on")}function me({tvOn:i,context:e,t}){let a=i?e==="text"||e==="pointer"?e:"generic":"unreachable";return{title:t(`error.${a}.title`),hint:t(`error.${a}.hint`)}}var fe=i=>!i?.app_id||i.app_id==="com.webos.app.home";function F(i){return i===!1||i==="off"?"off":i in D?i:"soft"}function ge(i,e){let t=F(i);if(t==="off")return null;let{scale:a,native:n}=D[t],s=ie[e],o=Array.isArray(s)?s.map(r=>Math.round(r*a)):Math.round(s*a);return{native:n[e],pattern:o}}function _e({innerWidth:i,count:e,selectedIndex:t,gap:a,padding:n,selectedFlex:s}){let o=(i-a*(e-1))/(e-1+s);return{left:n+t*(o+a),width:o*s}}function xe(i,e){let t=0,a=1/0;return e.forEach(({left:n,width:s},o)=>{let r=i<n?n-i:i>n+s?i-(n+s):0;r<a&&(t=o,a=r)}),t}function ve(i){let[e,t,a,n,s,o]=i.split(",").map(Number);return new Date(e,t-1,a,n,s,o)}function V(i,e=new Date){for(let t of i??[]){let a=ve(t.localStartTime),n=ve(t.localEndTime);if(a<=e&&e<n)return{name:t.programName,start:a,end:n,progress:(e-a)/(n-a),minutesLeft:Math.max(1,Math.ceil((n-e)/6e4))}}return null}function we(i){return(i??[]).filter(e=>e.TV&&!e.Radio&&!e.Invisible).map(e=>({id:e.channelId,number:String(e.channelNumber),name:e.channelName})).sort((e,t)=>parseFloat(e.number)-parseFloat(t.number))}var ye=i=>i.toLowerCase().normalize("NFD").replace(/\p{M}/gu,"");function ke(i,e){let t=ye(e.trim());return t?i.filter(a=>ye(a.name).includes(t)||a.number.startsWith(t)):i}function S(i,e){return e?i.find(t=>parseFloat(t.number)===parseFloat(e))??null:null}function Te(i,e){return i.includes(e)?i.filter(t=>t!==e):[...i,e]}function E(i,e,t=8){return e.length?i.filter(a=>e.includes(a.number)):i.slice(0,t)}function y(i){let e=0;for(let t of i)e=e*31+t.charCodeAt(0)>>>0;return`hsl(${e%360} 55% 38%)`}var L=i=>i?.app_id==="com.webos.app.livetv";var Se="lg-tv-remote:";function $(i,e=1/0){try{let t=JSON.parse(localStorage.getItem(Se+i));return t&&Date.now()-t.at<e?t.value:null}catch{return null}}function C(i,e){try{localStorage.setItem(Se+i,JSON.stringify({at:Date.now(),value:e}))}catch{}}async function Ee(i,e,t,a,n){let s=await i.callWS({type:"call_service",domain:e,service:t,service_data:{entity_id:a,...n},return_response:!0});return s?.response?.[a]??s?.response}var Le=(i,e,t,a)=>Ee(i,"webostv","command",e,a?{command:t,payload:a}:{command:t});async function $e(i,e){let t=$(`channels:${e}`,z);if(t)return t;let n=((await Le(i,e,"tv/getChannelList"))?.channelList??[]).map(s=>({channelId:s.channelId,channelNumber:s.channelNumber,channelName:s.channelName,TV:s.TV,Radio:s.Radio,Invisible:s.Invisible}));return n.length&&C(`channels:${e}`,n),n}async function B(i,e,t){let a=await Le(i,e,"tv/getChannelProgramInfo",t?{channelId:t}:void 0);return{channel:a?.channel,programList:a?.programList??[]}}async function Ce(i,e){let t=$(`icons:${e}`,z);if(t)return t;if(!i.services.lgtv_pointer?.app_icons)return{};let n=(await Ee(i,"lgtv_pointer","app_icons",e,{}))?.icons??{};return Object.keys(n).length&&C(`icons:${e}`,n),n}var Ae=`
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
`;var U={"status.notFound":"Entity not found","status.sleeping":"Switching off\u2026","status.waking":"Switching on\u2026","status.unavailable":"Unreachable","status.off":"Off","status.on":"On","standby.waking":"Switching on\u2026","standby.unavailable":"TV unreachable","standby.off":"Switch the TV on","standby.wakingHint":"Please wait a few seconds","standby.offHint":"Takes about 15 seconds","error.unreachable.title":"TV unreachable","error.unreachable.hint":"Switch it on and try again.","error.text.title":"No text field open","error.text.hint":"Open a search on the TV and try again.","error.pointer.title":"Pointer unavailable","error.pointer.hint":"Try again in a moment.","error.generic.title":"Command failed","error.generic.hint":"Try again.","now.input":"Input","now.playing":"Playing","now.minutes":"{n} min","list.empty":"List available when the TV is on","list.noMatch":"No channels found","list.favorites":"FAVOURITES","list.firstChannels":"FIRST CHANNELS \xB7 tap the star to pick yours","list.showFavorites":"Show favourites only","list.allCount":"All channels \xB7 {n}","list.all":"ALL CHANNELS","star.add":"Add to favourites","star.remove":"Remove from favourites","apps.favorites":"FAVOURITES","apps.others":"OTHER APPS","apps.title":"APPS","apps.inputs":"INPUTS","apps.allCount":"All apps \xB7 {n}","num.prompt":"Type the channel number","num.notFound":"Channel not found","dictate.unsupported":"Use the keyboard microphone","dictate.failed":"Dictation failed","dictate.lang":"en-US","hold.start":"Hold the button for a second","hold.more":"Hold longer to switch off","sheet.powerOff":"Switch the TV off?","pad.pointer":"Drag to move<br>Tap to click<br>Double-tap and hold: drag","pad.swipe":"Swipe = arrows<br>Tap = OK","rail.scroll":"scroll","tab.dpad":"Arrows","tab.pad":"Touchpad","tab.keys":"Keys","tab.apps":"Apps","label.up":"Up","label.down":"Down","label.left":"Left","label.right":"Right","label.rewind":"Rewind","label.playPause":"Play/pause","label.fastForward":"Fast forward","label.list":"List","label.guide":"Guide","label.menu":"Menu","label.info":"Info","label.exit":"Exit","label.red":"Red","label.green":"Green","label.yellow":"Yellow","label.blue":"Blue","label.close":"Close","label.keyboard":"Keyboard","label.dictate":"Dictate","label.clear":"Clear","label.enter":"Enter","label.delete":"Delete","label.dash":"Dash","label.back":"Back","label.home":"Home","label.power":"Power","label.mute":"Mute","label.volume":"Volume","label.volumeDown":"Volume down","label.volumeUp":"Volume up","label.channel":"Channel","label.channels":"Channels","label.channelUp":"Channel up","label.channelDown":"Channel down","label.channelList":"Channel list","label.channelNumber":"Channel number","label.typeNumber":"Enter the number","label.goToChannel":"Go to channel","label.inputsAndApps":"Inputs and apps","label.channelsAndApps":"Channels and apps","kb.placeholder":"Type or dictate\u2026","kb.hint":"The text appears right away in the open field on the TV. Enter confirms and closes.","search.placeholder":"Search channels","editor.entity":"TV","editor.name":"Displayed name","editor.haptics":"Vibration","editor.auto_open_keyboard":"Open the keyboard when the TV asks for text","editor.scroll_gain":"Scroll speed","editor.scroll_invert":"Invert the scroll direction","editor.haptics.helper":"Works on Android and in the Home Assistant app. Not available on iPhone.","editor.scroll_invert.helper":"Turn it on if the side strip scrolls the wrong way.","editor.haptics.off":"Off","editor.haptics.soft":"Light","editor.haptics.normal":"Normal","editor.haptics.strong":"Strong"},et={"status.notFound":"Entit\xE0 non trovata","status.sleeping":"Spegnimento\u2026","status.waking":"Accensione\u2026","status.unavailable":"Non raggiungibile","status.off":"Spenta","status.on":"Accesa","standby.waking":"Accensione in corso\u2026","standby.unavailable":"TV non raggiungibile","standby.off":"Accendi la TV","standby.wakingHint":"Attendi qualche secondo","standby.offHint":"Ci vogliono circa 15 secondi","error.unreachable.title":"TV non raggiungibile","error.unreachable.hint":"Accendila e riprova.","error.text.title":"Nessun campo di testo aperto","error.text.hint":"Apri una ricerca sulla TV e riprova.","error.pointer.title":"Puntatore non disponibile","error.pointer.hint":"Riprova tra un attimo.","error.generic.title":"Comando non riuscito","error.generic.hint":"Riprova.","now.input":"Ingresso","now.playing":"In riproduzione","now.minutes":"{n} min","list.empty":"Elenco disponibile a TV accesa","list.noMatch":"Nessun canale trovato","list.favorites":"PREFERITI","list.firstChannels":"PRIMI CANALI \xB7 tocca la stella per scegliere i tuoi","list.showFavorites":"Mostra solo i preferiti","list.allCount":"Tutti i canali \xB7 {n}","list.all":"TUTTI I CANALI","star.add":"Aggiungi ai preferiti","star.remove":"Togli dai preferiti","apps.favorites":"PREFERITE","apps.others":"ALTRE APP","apps.title":"APP","apps.inputs":"INGRESSI","apps.allCount":"Tutte le app \xB7 {n}","num.prompt":"Scrivi il numero del canale","num.notFound":"Canale non trovato","dictate.unsupported":"Usa il microfono della tastiera","dictate.failed":"Dettatura non riuscita","dictate.lang":"it-IT","hold.start":"Tieni premuto il tasto per un secondo","hold.more":"Tieni premuto pi\xF9 a lungo per spegnere","sheet.powerOff":"Spegnere la TV?","pad.pointer":"Trascina per muovere<br>Tocca per cliccare<br>Doppio tocco tenuto: trascina","pad.swipe":"Swipe = frecce<br>Tocco = OK","rail.scroll":"scorri","tab.dpad":"Frecce","tab.pad":"Touchpad","tab.keys":"Tasti","tab.apps":"App","label.up":"Su","label.down":"Gi\xF9","label.left":"Sinistra","label.right":"Destra","label.rewind":"Indietro veloce","label.playPause":"Play e pausa","label.fastForward":"Avanti veloce","label.list":"Lista","label.guide":"Guida","label.menu":"Menu","label.info":"Info","label.exit":"Esci","label.red":"Rosso","label.green":"Verde","label.yellow":"Giallo","label.blue":"Blu","label.close":"Chiudi","label.keyboard":"Tastiera","label.dictate":"Detta","label.clear":"Cancella","label.enter":"Invio","label.delete":"Cancella","label.dash":"Trattino","label.back":"Indietro","label.home":"Home","label.power":"Accensione","label.mute":"Muto","label.volume":"Volume","label.volumeDown":"Volume gi\xF9","label.volumeUp":"Volume su","label.channel":"Canale","label.channels":"Canali","label.channelUp":"Canale su","label.channelDown":"Canale gi\xF9","label.channelList":"Elenco canali","label.channelNumber":"Numero del canale","label.typeNumber":"Digita il numero","label.goToChannel":"Vai al canale","label.inputsAndApps":"Ingressi e app","label.channelsAndApps":"Canali e app","kb.placeholder":"Scrivi o detta\u2026","kb.hint":"Il testo appare subito sul campo aperto della TV. Invio conferma e chiude.","search.placeholder":"Cerca un canale","editor.entity":"TV","editor.name":"Nome mostrato","editor.haptics":"Vibrazione","editor.auto_open_keyboard":"Apri la tastiera quando la TV chiede un testo","editor.scroll_gain":"Velocit\xE0 di scorrimento","editor.scroll_invert":"Inverti la direzione dello scorrimento","editor.haptics.helper":"Si sente su Android e nell'app di Home Assistant. Su iPhone non \xE8 disponibile.","editor.scroll_invert.helper":"Attivala se la striscia laterale scorre al contrario.","editor.haptics.off":"Spenta","editor.haptics.soft":"Leggera","editor.haptics.normal":"Normale","editor.haptics.strong":"Forte"},tt={en:U,it:et};function A(i){let e=String(i?.locale?.language??i?.language??"").toLowerCase();return e==="it"||e.startsWith("it-")?"it":"en"}function P(i){let e=tt[i]??U;return(t,a={})=>(e[t]??U[t]??t).replace(/\{(\w+)\}/g,(n,s)=>a[s]??"")}var l=i=>`<ha-icon icon="mdi:${i}"></ha-icon>`,it={dpad:'<path d="M12 3l3 4h-6zM12 21l3-4h-6zM3 12l4-3v6zM21 12l-4-3v6z"/><circle cx="12" cy="12" r="2"/>',touch:'<path d="M5 4l5 15 2.5-6 6-2.5z"/>',keypad:'<path d="M6 6h.01M12 6h.01M18 6h.01M6 12h.01M12 12h.01M18 12h.01M6 18h.01M12 18h.01M18 18h.01" style="stroke-width:3.4"/>',apps:'<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>'},at=i=>`<svg class="tab-icon" viewBox="0 0 24 24" aria-hidden="true">${it[i]}</svg>`,d=(i,{button:e,action:t,className:a="",label:n=""})=>{let s=e?`data-button="${e}"`:`data-action="${t}"`,o=n?` aria-label="${n}"`:"";return`<button class="key ${a}" ${s}${o}>${i}</button>`},nt=i=>`
  <div class="dpad">
    <span></span>${d(l("chevron-up"),{button:"UP",label:i("label.up")})}<span></span>
    ${d(l("chevron-left"),{button:"LEFT",label:i("label.left")})}${d("OK",{button:"ENTER",className:"ok primary"})}${d(l("chevron-right"),{button:"RIGHT",label:i("label.right")})}
    <span></span>${d(l("chevron-down"),{button:"DOWN",label:i("label.down")})}<span></span>
  </div>`,st=i=>`
  <div class="transport">
    ${d(l("rewind"),{button:"REWIND",label:i("label.rewind")})}
    ${d(l("play-pause"),{action:"play-pause",label:i("label.playPause")})}
    ${d(l("fast-forward"),{button:"FASTFORWARD",label:i("label.fastForward")})}
  </div>`,ot=i=>`
    <div class="keypad">${[1,2,3,4,5,6,7,8,9].map(t=>d(t,{button:String(t)})).join("")}${d(i("label.list"),{button:"LIST"})}${d("0",{button:"0"})}${d(i("label.guide"),{button:"GUIDE"})}</div>
    <div class="keys-extra">
      ${d(l("menu"),{button:"MENU",label:i("label.menu")})}
      ${d(l("information-outline"),{button:"INFO",label:i("label.info")})}
      ${d(l("exit-to-app"),{button:"EXIT",label:i("label.exit")})}
    </div>
    <div class="colors">
      ${d("",{button:"RED",className:"red",label:i("label.red")})}${d("",{button:"GREEN",className:"green",label:i("label.green")})}
      ${d("",{button:"YELLOW",className:"yellow",label:i("label.yellow")})}${d("",{button:"BLUE",className:"blue",label:i("label.blue")})}
    </div>`,K=(i,e,t="")=>`
  <div class="sheet-grip"></div>
  <div class="sheet-head"><b>${e}</b>${t}${d(l("close"),{action:"close-sheet",label:i("label.close")})}</div>`,rt=i=>`
  <div class="kb-sheet" id="kb-sheet" role="dialog" aria-label="${i("label.keyboard")}">
    <div class="sheet-grip"></div>
    <div class="line">
      <input type="text" id="text" placeholder="${i("kb.placeholder")}" autocomplete="off" autocapitalize="sentences" enterkeyhint="send">
      ${d(l("microphone"),{action:"dictate",className:"icon-only",label:i("label.dictate")})}
      ${d(l("close"),{action:"close-sheet",className:"icon-only",label:i("label.close")})}
    </div>
    <div class="line">
      ${d(i("label.clear"),{action:"clear-text"})}
      ${d(`${l("keyboard-return")}&nbsp;${i("label.enter")}`,{action:"enter-key",className:"primary"})}
    </div>
    <div class="status">${i("kb.hint")}</div>
  </div>`,lt=i=>`
  <div class="panel-sheet" id="channels-sheet" role="dialog" aria-label="${i("label.channels")}">
    ${K(i,i("label.channels"),d(l("dialpad"),{action:"open-numpad",label:i("label.typeNumber")}))}
    <label class="search">${l("magnify")}<input type="search" id="channel-search" placeholder="${i("search.placeholder")}" autocomplete="off" enterkeyhint="search"></label>
    <div class="sheet-scroll" id="channel-list"></div>
  </div>`,ct=i=>{let e=t=>`<button class="key" data-digit="${t}">${t}</button>`;return`
  <div class="panel-sheet" id="numpad-sheet" role="dialog" aria-label="${i("label.channelNumber")}">
    ${K(i,i("label.channelNumber"))}
    <div class="num-display" id="num-display" role="button" aria-label="${i("label.goToChannel")}"><span class="num-ring" id="num-ring"></span><b id="num-value"></b><span id="num-name"></span></div>
    <div class="num-keys">
      ${[1,2,3,4,5,6,7,8,9].map(e).join("")}
      <button class="key" data-digit="-" aria-label="${i("label.dash")}">${l("minus")}</button>${e(0)}<button class="key" data-digit="del" aria-label="${i("label.delete")}">${l("backspace-outline")}</button>
    </div>
  </div>`},dt=i=>`
  <div class="panel-sheet" id="inputs-sheet" role="dialog" aria-label="${i("label.inputsAndApps")}">
    ${K(i,i("label.inputsAndApps"))}
    <div class="sheet-scroll" id="inputs-body"></div>
  </div>`,pt=i=>`
  <div class="pop-scrim" id="pop-scrim"></div>
  <div class="pop" id="pop-volume" role="dialog" aria-label="${i("label.volume")}">
    <div class="vpill" id="vpill"><div class="vfill" id="vfill"></div><div class="vlabel">${l("volume-high")}<b id="vol-level">\u2013</b></div></div>
    <div class="pop-row">
      <button class="key" data-repeat="VOLUMEDOWN" aria-label="${i("label.volumeDown")}">${l("minus")}</button>
      <button class="key" data-repeat="VOLUMEUP" aria-label="${i("label.volumeUp")}">${l("plus")}</button>
    </div>
  </div>
  <div class="pop" id="pop-channel" role="dialog" aria-label="${i("label.channel")}">
    <div class="cpill">
      <button class="key" data-repeat="CHANNELUP" aria-label="${i("label.channelUp")}">${l("chevron-up")}</button>
      <div class="clabel"><b id="pop-channel-number">\u2013</b><span id="pop-channel-name"></span></div>
      <button class="key" data-repeat="CHANNELDOWN" aria-label="${i("label.channelDown")}">${l("chevron-down")}</button>
    </div>
    <div class="pop-row">
      <button class="key" data-action="open-numpad" aria-label="${i("label.typeNumber")}">${l("dialpad")}</button>
      <button class="key" data-action="open-channels" aria-label="${i("label.channelList")}">${l("format-list-bulleted")}</button>
    </div>
  </div>`,ht=[{tab:"dpad",icon:"dpad"},{tab:"pad",icon:"touch"},{tab:"keys",icon:"keypad"},{tab:"apps",icon:"apps"}];function Pe(i){let e=ht.map(t=>`<button class="tab" data-tab="${t.tab}" aria-label="${i(`tab.${t.tab}`)}">${at(t.icon)}<span class="tab-label">${i(`tab.${t.tab}`)}</span></button>`).join("");return`
<ha-card>
  <div class="kb-backdrop" id="kb-backdrop"></div>
  <div class="head">
    <button class="key power" id="power" aria-label="${i("label.power")}">${l("power")}</button>
    <div class="info"><div class="title" id="name"></div><div class="status" id="status"></div></div>
    <button class="key" data-action="open-inputs" aria-label="${i("label.inputsAndApps")}" data-group="controls">${l("video-input-hdmi")}</button>
    <button class="key" id="mute" data-action="mute" aria-label="${i("label.mute")}"></button>
  </div>

  <div class="now" id="now" data-mode="live" data-group="controls">
    <button class="key step live-only" data-repeat="CHANNELDOWN" aria-label="${i("label.channelDown")}">${l("chevron-left")}</button>
    <button class="open" data-action="open-now" aria-label="${i("label.channelsAndApps")}">
      <div class="logo" id="now-logo"></div>
      <div class="text"><div class="line1" id="now-title"></div><div class="line2" id="now-sub"></div><div class="bar" id="now-bar"><i id="now-fill"></i></div></div>
    </button>
    <button class="key step live-only" data-repeat="CHANNELUP" aria-label="${i("label.channelUp")}">${l("chevron-right")}</button>
    <button class="key step app-only" data-button="REWIND" aria-label="${i("label.rewind")}">${l("rewind")}</button>
    <button class="key step app-only" data-action="play-pause" aria-label="${i("label.playPause")}">${l("play-pause")}</button>
    <button class="key step app-only" data-button="FASTFORWARD" aria-label="${i("label.fastForward")}">${l("fast-forward")}</button>
  </div>

  <div class="body" id="body" data-active-tab="dpad">
    <div class="stage" id="stage">
      <div class="center" id="center">
        <div class="panel" data-panel="dpad">${nt(i)}${st(i)}</div>
        <div class="panel" data-panel="pad"><div class="pad" id="pad"></div></div>
        <div class="panel" data-panel="keys">${ot(i)}</div>
      </div>
      <div class="scroll-view" data-view="apps"><div id="apps"></div></div>

      <div class="standby-overlay">
        <button class="power-big" id="power-big" aria-label="${i("standby.off")}">${l("power")}</button>
        <div><b id="standby-title"></b><span id="standby-hint"></span></div>
      </div>
      <div class="toast" id="toast" role="status"></div>
      <div class="sheet" id="sheet">
        <b>${i("sheet.powerOff")}</b>
        <div class="hint" id="sheet-hint"></div>
        <div class="track"><div class="fill" id="sheet-fill"></div></div>
      </div>
    </div>
    <div class="rail scroll" id="strip"><span>\u25B2</span><span class="vertical">${i("rail.scroll")}</span><span>\u25BC</span></div>
  </div>

  <div class="dock" data-group="controls">
    ${d(l("keyboard-backspace"),{button:"BACK",label:i("label.back")})}
    ${d(l("home"),{button:"HOME",label:i("label.home")})}
    ${d(l("keyboard-outline"),{action:"open-keyboard",label:i("label.keyboard")})}
    <button class="key" data-action="toggle-volume" id="dock-volume" aria-label="${i("label.volume")}">${l("volume-high")}</button>
    <button class="key" data-action="toggle-channel" id="dock-channel" aria-label="${i("label.channels")}">${l("television-guide")}</button>
  </div>
  <div class="tabs" id="tabs" data-group="controls"><span class="tab-pill" id="tab-pill"><i class="blob" id="tab-blob"></i></span>${e}</div>
  ${pt(i)}
  ${rt(i)}${lt(i)}${ct(i)}${dt(i)}
</ha-card>`}var Me=i=>l(i?"volume-off":"volume-high"),Ie=(i,e)=>i?`${l("cursor-default-click-outline")}<span>${e("pad.pointer")}</span>`:`${l("gesture-swipe")}<span>${e("pad.swipe")}</span>`;var m=(i,e,t)=>{let a=document.createElement(i);return e&&(a.className=e),t!==void 0&&(a.textContent=t),a},M=(i,e)=>{let t=document.createDocumentFragment();return t.append(m("div","label",i),e),t};function ut(i,{current:e,icons:t,onSelect:a}){let n=m("button",i===e?"tile current":"tile"),s=m("div","icon");return t?.[i]?s.style.backgroundImage=`url("${t[i]}")`:(s.style.background=v[i]??j,s.textContent=i.charAt(0)),n.append(s,m("span","",i)),n.addEventListener("click",()=>a(i)),n}var bt=i=>i==="Canali TV"?"television":"video-input-hdmi";function W(i,{current:e,icons:t,onSelect:a}){let n=m("div","tiles");return i.forEach(s=>n.append(ut(s,{current:e,icons:t,onSelect:a}))),n}function mt(i,{current:e,onSelect:t,showIcon:a}){let n=m("div","inputs-grid");return i.forEach(s=>{let o=m("button",s===e?"key current":"key");o.innerHTML=`${a(bt(s))}<span>${s.replace("HDMI ","")}</span>`,o.setAttribute("aria-label",s),o.addEventListener("click",()=>t(s)),n.append(o)}),n}function Ne(i,{sources:e,current:t,config:a,icons:n,onSelect:s,showIcon:o,t:r}){if(i.replaceChildren(),!e.length){i.append(m("div","status",r("list.empty")));return}let c=H(e,a),p={current:t,icons:n,onSelect:s,showIcon:o};c.favorites.length&&i.append(M(r("apps.favorites"),W(c.favorites,p))),c.others.length&&i.append(M(r(c.favorites.length?"apps.others":"apps.title"),W(c.others,p)))}function Re(i,{sources:e,current:t,config:a,icons:n,onSelect:s,showIcon:o,t:r}){if(i.replaceChildren(),!e.length){i.append(m("div","status",r("list.empty")));return}let c=H(e,a),p={current:t,icons:n,onSelect:s,showIcon:o},u=m("button","key more");u.dataset.action="show-all-apps",u.textContent=r("apps.allCount",{n:c.others.length+c.favorites.length}),i.append(M(r("apps.inputs"),mt(c.inputs,p)),M(r("apps.title"),W(c.favorites,p)),u)}var w=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function ft(i,e){return i?.name?`${w(i.name)} \xB7 ${e("now.minutes",{n:i.minutesLeft})}`:""}function gt(i,{current:e,starred:t,program:a,t:n}){let s=a?.name?`<div class="mini"><i style="width:${Math.round(a.progress*100)}%"></i></div>`:"";return`
    <div class="ch-row${i.number===e?" current":""}" role="button" tabindex="0" data-channel="${w(i.number)}">
      <div class="logo" style="--logo:${y(i.name)}">${w(i.number)}</div>
      <div class="text"><div class="line1">${w(i.name)}</div><div class="line2">${ft(a,n)}</div>${s}</div>
      <button class="star${t?" on":""}" data-star="${w(i.number)}" aria-label="${n(t?"star.remove":"star.add")}">${l(t?"star":"star-outline")}</button>
    </div>`}function Oe({channels:i,favorites:e,query:t,showAll:a,current:n,programs:s,t:o}){if(!i.length)return`<div class="status">${o("list.empty")}</div>`;let r=b=>gt(b,{current:n,starred:e.includes(b.number),program:s[b.number],t:o});if(t.trim()){let b=ke(i,t).slice(0,60);return b.length?b.map(r).join(""):`<div class="status">${o("list.noMatch")}</div>`}let c=E(i,e,T),p=o(e.length?"list.favorites":"list.firstChannels"),u=`<button class="key more" data-action="toggle-all-channels">${a?o("list.showFavorites"):o("list.allCount",{n:i.length})}${l(a?"chevron-up":"chevron-down")}</button>`;return`<div class="label">${p}</div>${c.map(r).join("")}${u}${a?`<div class="label">${o("list.all")}</div>${i.map(r).join("")}`:""}`}var _t=["off","soft","normal","strong"],De=i=>[{name:"entity",required:!0,selector:{entity:{domain:"media_player",integration:"webostv"}}},{name:"name",selector:{text:{}}},{name:"haptics",selector:{select:{mode:"dropdown",options:_t.map(e=>({value:e,label:i(`editor.haptics.${e}`)}))}}},{name:"auto_open_keyboard",selector:{boolean:{}}},{name:"scroll_gain",selector:{number:{min:1,max:5,step:.5,mode:"slider"}}},{name:"scroll_invert",selector:{boolean:{}}}],ze=(i,e)=>i(`editor.${e.name}`),He=(i,e)=>["haptics","scroll_invert"].includes(e.name)?i(`editor.${e.name}.helper`):void 0;async function xt(){if(!customElements.get("ha-form")){try{await(await(await window.loadCardHelpers?.())?.createCardElement({type:"entities",entities:[]}))?.constructor?.getConfigElement?.()}catch{}await Promise.race([customElements.whenDefined("ha-form"),new Promise(i=>setTimeout(i,4e3))])}}var Y=class extends HTMLElement{setConfig(e){this._config={...e},xt().then(()=>this._render())}set hass(e){this._hass=e,this._form&&(this._form.hass=e)}_render(){if(!this._form){let e=P(A(this._hass));this._form=document.createElement("ha-form"),this._form.schema=De(e),this._form.computeLabel=t=>ze(e,t),this._form.computeHelper=t=>He(e,t),this._form.addEventListener("value-changed",t=>this._onChange(t)),this.append(this._form)}this._form.hass=this._hass,this._form.data={...x,...this._config,haptics:F(this._config.haptics)}}_onChange(e){e.stopPropagation(),this._config={...this._config,...e.detail.value},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}};customElements.define("lg-tv-remote-card-editor",Y);var Fe=["pointerup","pointerleave","pointercancel"];function Ve(i,e){let t=0,a=0,n=null,s=0,o=()=>{clearTimeout(n),n=null;let r=Math.round(t),c=Math.round(a);!r&&!c||(t-=r,a-=c,s=performance.now(),i(r,c))};return{flush:o,reset(){t=0,a=0},add(r,c){t+=r,a+=c;let p=e-(performance.now()-s);p<=0?o():n===null&&(n=setTimeout(o,p))}}}function Be(i,e){let t,a=null,n=-1/0,s=()=>{a=null,n=performance.now(),i(t)};return o=>{t=o;let r=e-(performance.now()-n);r<=0?s():a===null&&(a=setTimeout(s,r))}}function Ue(i,e){i.forEach(t=>{let a,n,s=()=>{clearTimeout(a),clearInterval(n)};t.addEventListener("pointerdown",o=>{o.preventDefault();let r=t.dataset.repeat;e(r),a=setTimeout(()=>{n=setInterval(()=>e(r),I.intervalMs)},I.delayMs)}),Fe.forEach(o=>t.addEventListener(o,s))})}function Ke(i,{durationMs:e,enabled:t,onStart:a,onComplete:n,onCancel:s}){let o=null,r=()=>{o!==null&&(clearTimeout(o),o=null,s())};i.addEventListener("pointerdown",c=>{t()&&(c.preventDefault(),a(),o=setTimeout(()=>{o=null,n()},e))}),Fe.forEach(c=>i.addEventListener(c,r))}function We(i,e){let t={id:null,x:0,y:0,startX:0,startY:0,startedAt:0,moved:!1},a=!1,n=0,s=Ve((r,c)=>e.pointer("move",a?{dx:r,dy:c,down:1}:{dx:r,dy:c}),g.tickMs),o=()=>{a&&(a=!1,e.pointer("move",{dx:0,dy:0,down:0}))};i.addEventListener("pointerdown",r=>{i.setPointerCapture(r.pointerId),s.reset(),a=e.hasPointer()&&Date.now()-n<g.doubleTapMs,a&&e.buzz(),Object.assign(t,{id:r.pointerId,x:r.clientX,y:r.clientY,startX:r.clientX,startY:r.clientY,startedAt:Date.now(),moved:!1})}),i.addEventListener("pointermove",r=>{if(t.id!==r.pointerId||(Math.abs(r.clientX-t.startX)+Math.abs(r.clientY-t.startY)>g.moveThresholdPx&&(t.moved=!0),!e.hasPointer()))return;let p=de(r.clientX-t.x,r.clientY-t.y);t.x=r.clientX,t.y=r.clientY,s.add(p.x,p.y)}),i.addEventListener("pointerup",r=>{if(t.id===r.pointerId){if(t.id=null,e.hasPointer()){if(s.flush(),a)return o();!t.moved&&Date.now()-t.startedAt<g.tapMaxMs&&(e.buzz(),n=Date.now(),e.pointer("click",{}));return}e.press(ce({dx:r.clientX-t.startX,dy:r.clientY-t.startY,moved:t.moved}))}}),i.addEventListener("pointercancel",()=>{t.id=null,s.flush(),o()})}function Ye(i,{gain:e,send:t}){let a=null,n=0,s=Ve((o,r)=>t(r),G.tickMs);i.addEventListener("pointerdown",o=>{i.setPointerCapture(o.pointerId),a=o.pointerId,n=o.clientY,s.reset()}),i.addEventListener("pointermove",o=>{a===o.pointerId&&(s.add(0,(o.clientY-n)*e),n=o.clientY)}),["pointerup","pointercancel"].forEach(o=>i.addEventListener(o,()=>{a=null}))}function qe(i,e){let t=["pad","strip","text","power","tabs"],a=null;i.addEventListener("pointerdown",n=>{if(!e.enabled()){a=null;return}a=n.composedPath().some(o=>t.includes(o.id)||o.dataset?.repeat)?null:{id:n.pointerId,x:n.clientX,y:n.clientY,at:Date.now()}}),i.addEventListener("pointerup",n=>{if(!a||a.id!==n.pointerId)return;let s={dx:n.clientX-a.x,dy:n.clientY-a.y,durationMs:Date.now()-a.at};a=null;let o=le(e.currentTab(),s);o&&(e.markSwiped(),e.buzz(),e.goTo(o,s.dx<0?1:-1))}),i.addEventListener("pointercancel",()=>{a=null})}function Xe(i,e,t){let n=null;i.addEventListener("pointerdown",o=>{let r=e.getBoundingClientRect();o.clientX<r.left||o.clientX>r.right||(n={id:o.pointerId,startX:o.clientX,moving:!1})}),i.addEventListener("pointermove",o=>{if(!(!n||n.id!==o.pointerId)){if(!n.moving){if(Math.abs(o.clientX-n.startX)<6)return;n.moving=!0;try{i.setPointerCapture(o.pointerId)}catch{}t.start()}t.move(o.clientX-i.getBoundingClientRect().left)}});let s=o=>{if(!n||n.id!==o.pointerId)return;let r=n.moving;n=null,r&&t.drop()};i.addEventListener("pointerup",s),i.addEventListener("pointercancel",s)}var vt=["apps"],je="com.webos.service.ime",yt=800,q=class extends HTMLElement{static getConfigElement(){return document.createElement("lg-tv-remote-card-editor")}static getStubConfig(e){return{entity:Object.keys(e?.states??{}).find(a=>a.startsWith("media_player.")&&/lg|webos/i.test(a))??x.entity}}setConfig(e){this._config={...x,...e},this._tab=f[0],this._wakeRequestedAt=0,this._sleepRequestedAt=0,this._powerHeldAt=0,this._swipedAt=0,this._sheet=null,this._watchingKeyboard=!1,this._keyboardWatchRetryAt=0,this._channels=[],this._favorites=$("favorites")??this._config.favorite_channels.map(String),this._programs={},this._now=null,this._channelQuery="",this._showAllChannels=!1,this._typed="",this._icons={}}set hass(e){this._hass=e,this._t=P(A(e)),!this._root&&this._config&&this._render(),this._subscribeKeyboardEvents(),this._refresh()}connectedCallback(){this._dataTimer=setInterval(()=>this._refreshNow(),ae)}disconnectedCallback(){clearInterval(this._dataTimer),clearTimeout(this._laterTimer),this._keyboardEvents?.then(e=>e()),this._keyboardEvents=null}get _keyboardOpen(){return this._sheet==="keyboard"}getCardSize(){return 12}get _stateObj(){return this._hass?.states[this._config.entity]}get _tvOn(){return re(this._stateObj)}get _hasPointer(){return!!this._hass?.services.lgtv_pointer}async _callService(e,t,a,n){try{return await this._hass.callService(e,t,a),!0}catch{return this._showError(n),!1}}_press(e){return this._buzz(),this._callService("webostv","button",{entity_id:this._config.entity,button:e})}_command(e,t,a){return this._callService("webostv","command",{entity_id:this._config.entity,command:e,payload:t},a)}_mediaPlayer(e,t={}){return this._callService("media_player",e,{entity_id:this._config.entity,...t})}_pointer(e,t){return this._callService("lgtv_pointer",e,{entity_id:this._config.entity,...t},"pointer")}_haptic(e="tap"){let t=ge(this._config.haptics,e);if(!t||this._hass?.vibrate===!1)return;let a=this._hass?.auth?.external;try{a?.fireMessage?a.fireMessage({type:"haptic",payload:{hapticType:t.native}}):navigator.vibrate?.(t.pattern)}catch{}}_buzz(){this._haptic("tap")}_render(){this._root=this.attachShadow({mode:"open"}),this._root.innerHTML=`<style>${Ae}</style>${Pe(this._t)}`,this._ui=this._queryElements(),this._wire(),this._goToTab(this._tab)}_queryElements(){let e=t=>this._root.getElementById(t);return{card:this._root.querySelector("ha-card"),stage:e("stage"),center:e("center"),body:e("body"),tabs:e("tabs"),tabPill:e("tab-pill"),tabBlob:e("tab-blob"),now:e("now"),nowLogo:e("now-logo"),nowTitle:e("now-title"),nowSub:e("now-sub"),nowBar:e("now-bar"),nowFill:e("now-fill"),channelList:e("channel-list"),channelSearch:e("channel-search"),inputsBody:e("inputs-body"),numDisplay:e("num-display"),numValue:e("num-value"),numName:e("num-name"),numRing:e("num-ring"),name:e("name"),status:e("status"),mute:e("mute"),power:e("power"),pad:e("pad"),strip:e("strip"),apps:e("apps"),text:e("text"),dock:this._root.querySelector(".dock"),dockVolume:e("dock-volume"),dockChannel:e("dock-channel"),popScrim:e("pop-scrim"),popVolume:e("pop-volume"),popChannel:e("pop-channel"),vpill:e("vpill"),vfill:e("vfill"),volLevel:e("vol-level"),popChannelNumber:e("pop-channel-number"),popChannelName:e("pop-channel-name"),standbyTitle:e("standby-title"),standbyHint:e("standby-hint"),powerBig:e("power-big"),backdrop:e("kb-backdrop"),toast:e("toast"),sheet:e("sheet"),sheetHint:e("sheet-hint"),sheetFill:e("sheet-fill"),controls:this._root.querySelectorAll("[data-group=controls]")}}_wire(){let e=this._ui;this._root.addEventListener("click",t=>this._onClick(t)),e.text.addEventListener("input",()=>this._scheduleTextSync()),e.text.addEventListener("keydown",t=>this._onTextKey(t)),e.backdrop.addEventListener("click",()=>this._closeSheet()),e.popScrim.addEventListener("click",()=>this._closePop());for(let t of[e.popVolume,e.popChannel])t.addEventListener("pointerdown",()=>this._armPopTimer());this._wireVolumeSlider(),e.channelSearch.addEventListener("input",()=>{this._channelQuery=e.channelSearch.value,this._renderChannelList()}),e.numDisplay.addEventListener("click",()=>this._confirmNumber()),window.visualViewport?.addEventListener("resize",()=>this._placeSheets()),window.addEventListener("resize",()=>{this._placeSheets(),this._placeTabPill()}),e.power.addEventListener("click",()=>this._onPowerClick()),e.powerBig.addEventListener("click",()=>this._requestPowerOn()),Ue(this._root.querySelectorAll("[data-repeat]"),t=>this._press(t)),Ke(e.power,{durationMs:N,enabled:()=>this._tvOn,onStart:()=>this._startPowerHold(),onComplete:()=>this._completePowerHold(),onCancel:()=>this._cancelPowerHold()}),We(e.pad,{hasPointer:()=>this._hasPointer,pointer:(t,a)=>this._pointer(t,a),press:t=>this._press(t),buzz:()=>this._buzz()}),Ye(e.strip,{gain:this._config.scroll_gain,send:t=>this._pointer("scroll",{dx:0,dy:this._config.scroll_invert?-t:t})}),Xe(e.tabs,e.tabPill,{start:()=>this._startPillDrag(),move:t=>this._dragPill(t),drop:()=>this._dropPill()}),qe(e.card,{enabled:()=>!this._sheet&&!this._pop,currentTab:()=>this._tab,goTo:(t,a)=>this._goToTab(t,a),buzz:()=>this._buzz(),markSwiped:()=>{this._swipedAt=Date.now()}})}_refresh(){if(!this._ui||!this._hass)return;let e=this._tvOn;e?this._wakeRequestedAt=0:this._sleepRequestedAt=0;let t=this._isWaking(),a=this._isSleeping(),n=this._stateObj,s=n?.attributes??{},o=this._ui;this._watchTvKeyboard(e),o.name.textContent=this._config.name||s.friendly_name||"TV",o.status.textContent=be(n,{waking:t,sleeping:a,t:this._t}),o.power.classList.toggle("busy",t||a),o.power.classList.toggle("off",!e),o.stage.classList.toggle("standby",!e),o.controls.forEach(b=>b.classList.toggle("disabled",!e)),o.mute.classList.toggle("disabled",!e),o.standbyTitle.textContent=this._t(t?"standby.waking":n?.state==="unavailable"?"standby.unavailable":"standby.off"),o.standbyHint.textContent=this._t(t?"standby.wakingHint":"standby.offHint"),o.powerBig.classList.toggle("busy",t);let r=!!s.is_volume_muted;o.mute.classList.toggle("alert",r),o.mute.innerHTML=Me(r),this._renderVolume(s.volume_level,r),o.strip.classList.toggle("available",this._hasPointer),o.pad.innerHTML=Ie(this._hasPointer,this._t);let c=s.source_list??[],p=`${c.join("|")}#${s.source??""}#${Object.keys(this._icons).length}`;p!==this._appsRenderKey&&(this._appsRenderKey=p,this._renderSources(c,s.source)),e&&this._ensureIcons();let u=`${e}|${s.app_id}|${s.media_title}|${s.source}`;u!==this._nowKey&&(this._nowKey=u,this._now=null,this._refreshNow()),this._renderNow()}_renderSources(e,t){let a={sources:e,current:t,config:this._config,icons:this._icons,showIcon:l,t:this._t,onSelect:n=>this._selectSource(n)};Ne(this._ui.apps,a),Re(this._ui.inputsBody,a)}async _refreshNow(){if(!(!this._hass||!this._tvOn||!L(this._stateObj?.attributes)||this._nowBusy)){this._nowBusy=!0;try{let{channel:e,programList:t}=await B(this._hass,this._config.entity);if(!e)return;this._now={number:String(e.channelNumber),name:e.channelName,program:V(t)},this._renderNow()}catch{}finally{this._nowBusy=!1}}}_renderNow(){let e=this._stateObj?.attributes??{},t=this._ui,a=L(e);t.now.classList.toggle("gone",fe(e)),t.now.dataset.mode=a?"live":"app",t.nowBar.style.display="none";let n="#1d4ed8";if(a){let s=this._now?.number,o=this._now?.name??e.media_title??"Canali TV",r=this._now?.program;t.nowLogo.style.cssText=`--logo:${y(o)}`,t.nowLogo.textContent=s??"",t.nowTitle.textContent=o,t.nowSub.textContent=r?`${r.name} \xB7 ${this._t("now.minutes",{n:r.minutesLeft})}`:"Canali TV",r&&(t.nowBar.style.display="",t.nowFill.style.width=`${Math.round(r.progress*100)}%`),n=y(o),t.popChannelNumber.textContent=s??"\u2013",t.popChannelName.textContent=o}else{let s=e.source??"TV",o=this._icons[s];t.nowLogo.style.cssText=o?`background-image:url("${o}")`:`--logo:${v[s]??"#444"}`,t.nowLogo.textContent=o?"":s.charAt(0),t.nowTitle.textContent=s,t.nowSub.textContent=/^HDMI/.test(s)?this._t("now.input"):this._t("now.playing"),n=v[s]??"#1d4ed8",t.popChannelNumber.textContent="\u2013",t.popChannelName.textContent=s}t.card.style.setProperty("--tint",n)}async _ensureIcons(){if(!(Object.keys(this._icons).length||this._iconsTried&&Date.now()-this._iconsTried<6e4)){this._iconsTried=Date.now();try{let e=await Ce(this._hass,this._config.entity);Object.keys(e).length&&(this._icons=e,this._appsRenderKey=null,this._refresh())}catch{}}}_isSleeping(){return this._sleepRequestedAt>0&&Date.now()-this._sleepRequestedAt<O}_refreshAfter(e){clearTimeout(this._laterTimer),this._laterTimer=setTimeout(()=>this._refresh(),e+100)}_isWaking(){return this._wakeRequestedAt>0&&Date.now()-this._wakeRequestedAt<R}_goToTab(e,t=0){let a=this._tab;this._tab=e;let n=vt.includes(e);if(this._root.querySelectorAll("[data-tab]").forEach(s=>s.classList.toggle("selected",s.dataset.tab===e)),this._ui.body.dataset.activeTab=e,this._placeTabPill(),this._root.querySelectorAll("[data-panel]").forEach(s=>s.classList.toggle("active",s.dataset.panel===e)),this._root.querySelectorAll("[data-view]").forEach(s=>s.classList.toggle("active",s.dataset.view===e)),this._ui.center.style.display=n?"none":"flex",t&&a!==e){let s=n?this._root.querySelector(`[data-view=${e}]`):this._ui.center;this._animateSlide(s,t)}}_placeTabPill(){let{tabs:e,tabPill:t}=this._ui,a=e.clientWidth;if(!a){requestAnimationFrame(()=>this._placeTabPill());return}let n=_e({innerWidth:a-2*h.padding,count:f.length,selectedIndex:f.indexOf(this._tab),gap:h.gap,padding:h.padding,selectedFlex:h.selectedFlex}),s=Math.abs(n.left-(this._pillLeft??n.left));this._pillLeft=n.left,t.style.width=`${n.width}px`,t.style.transform=`translateX(${n.left}px)`,s>1&&e.classList.contains("settled")&&this._stretchBlob(s),e.classList.contains("settled")||requestAnimationFrame(()=>requestAnimationFrame(()=>e.classList.add("settled")))}_stretchBlob(e){if(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)return;let t=Math.min(h.stretchMax,e/360);this._ui.tabBlob.animate([{transform:"scale(1, 1)"},{transform:`scale(${1+t}, ${1-t*.55})`,offset:.3},{transform:`scale(${1-t*.25}, ${1+t*.3})`,offset:.65},{transform:"scale(1, 1)"}],{duration:h.animationMs+160,easing:"ease-out"})}_startPillDrag(){let{tabs:e}=this._ui;this._pillIndex=null,e.classList.add("dragging","grab"),clearTimeout(this._grabTimer),this._grabTimer=setTimeout(()=>e.classList.remove("grab"),260)}_dragPill(e){let{tabs:t,tabPill:a}=this._ui,n=a.offsetHeight,s=Math.min(Math.max(e-n/2,h.padding),t.clientWidth-h.padding-n);a.style.width=`${n}px`,a.style.transform=`translateX(${s}px)`;let o=Math.abs(s-(this._pillLeft??s));this._pillLeft=s,t.style.setProperty("--sx",1+Math.min(.3,o/50)),t.style.setProperty("--sy",1-Math.min(.14,o/110));let r=[...t.querySelectorAll(".tab")],c=xe(e,r.map(p=>({left:p.offsetLeft,width:p.offsetWidth})));c!==this._pillIndex&&(this._pillIndex=c,this._haptic("step"),r.forEach((p,u)=>p.classList.toggle("hover",u===c)))}_dropPill(){let{tabs:e}=this._ui,t=this._pillIndex??f.indexOf(this._tab);e.classList.remove("dragging","grab"),e.style.removeProperty("--sx"),e.style.removeProperty("--sy"),e.querySelectorAll(".tab").forEach(a=>a.classList.remove("hover")),this._pillIndex=null,this._swipedAt=Date.now(),this._haptic("tap"),this._goToTab(f[t])}_animateSlide(e,t){e.classList.remove("slide-forward","slide-back"),e.offsetWidth,e.classList.add(t>0?"slide-forward":"slide-back")}_onClick(e){if(Date.now()-this._swipedAt<_.ghostClickMs)return;let t=e.target.closest("[data-tab]");if(t)return this._buzz(),this._goToTab(t.dataset.tab);let a=e.target.closest("[data-star]");if(a)return this._toggleStar(a.dataset.star);let n=e.target.closest("[data-channel]");if(n)return this._tuneChannel(n.dataset.channel);let s=e.target.closest("[data-digit]");if(s)return this._onDigit(s.dataset.digit);let o=e.target.closest("[data-button]");if(o)return this._press(o.dataset.button);let r=e.target.closest("[data-action]");r&&this._runAction(r.dataset.action)}_runAction(e){switch(e){case"mute":return this._buzz(),this._mediaPlayer("volume_mute",{is_volume_muted:!this._stateObj?.attributes.is_volume_muted});case"play-pause":return this._buzz(),this._mediaPlayer("media_play_pause");case"toggle-volume":return this._togglePop("volume");case"toggle-channel":return this._togglePop("channel");case"open-keyboard":return this._openSheet("keyboard");case"close-sheet":return this._closeSheet();case"open-now":return this._openSheet(L(this._stateObj?.attributes)?"channels":"inputs");case"open-channels":return this._openSheet("channels");case"open-inputs":return this._openSheet("inputs");case"open-numpad":return this._openSheet("numpad");case"toggle-all-channels":return this._showAllChannels=!this._showAllChannels,this._renderChannelList();case"show-all-apps":return this._closeSheet(),this._goToTab("apps");case"clear-text":return this._clearText();case"enter-key":return this._pressEnterKey();case"dictate":return this._dictate();default:throw new Error(`Unknown card action: ${e}`)}}_selectSource(e){this._haptic("success"),this._mediaPlayer("select_source",{source:e}),this._closeSheet()}_scheduleTextSync(){clearTimeout(this._textSyncTimer),this._textSyncTimer=setTimeout(()=>this._syncText(),Z)}_syncText(){return this._textSync?(this._textDirty=!0,this._textSync):(this._textSync=this._flushText().finally(()=>{this._textSync=null}),this._textSync)}async _flushText(){let e;do this._textDirty=!1,e=await this._command(`${je}/insertText`,pe(this._ui.text.value),"text");while(this._textDirty&&e)}_clearText(){this._ui.text.value="",clearTimeout(this._textSyncTimer),this._syncText()}async _pressEnterKey(){clearTimeout(this._textSyncTimer),await this._syncText(),await this._command(`${je}/sendEnterKey`,{},"text")&&(this._ui.text.value="",this._closeSheet())}_onTextKey(e){e.key==="Enter"?this._pressEnterKey():e.key==="Escape"&&this._closeSheet()}_subscribeKeyboardEvents(){!this._config.auto_open_keyboard||this._keyboardEvents||!this._hass?.connection||(this._keyboardEvents=this._hass.connection.subscribeEvents(e=>this._onTvKeyboardEvent(e.data),Q))}_watchTvKeyboard(e){if(!this._config.auto_open_keyboard)return;if(!e){this._watchingKeyboard=!1;return}!this._hass.services.lgtv_pointer?.watch_keyboard||this._watchingKeyboard||Date.now()<this._keyboardWatchRetryAt||(this._watchingKeyboard=!0,this._hass.callService("lgtv_pointer","watch_keyboard",{entity_id:this._config.entity}).catch(()=>{this._watchingKeyboard=!1,this._keyboardWatchRetryAt=Date.now()+J}))}_onTvKeyboardEvent({entity_id:e,focus:t}){if(e!==this._config.entity)return;let a=ue({focus:t,sheetOpen:this._keyboardOpen,hasText:!!this._ui.text.value});a==="open"?this._openSheet("keyboard"):a==="close"&&this._closeSheet()}_togglePop(e){if(this._buzz(),this._pop===e)return this._closePop();this._pop=e;let{card:t,dock:a,popVolume:n,popChannel:s}=this._ui,o=e==="volume"?this._ui.dockVolume:this._ui.dockChannel,r=e==="volume"?n:s,c=t.getBoundingClientRect(),p=a.getBoundingClientRect(),u=o.getBoundingClientRect(),b=r.offsetWidth||104,X=Math.max(8,c.right-u.right-(b-u.width)/2);t.style.setProperty("--pop-right",`${X}px`),t.style.setProperty("--pop-bottom",`${c.bottom-p.top+8}px`);let Ge=c.right-X-b;t.style.setProperty("--pop-origin",`${u.left+u.width/2-Ge}px 100%`),t.dataset.pop=e,o.classList.add("active"),this._armPopTimer()}_closePop(){this._pop&&(this._pop=null,delete this._ui.card.dataset.pop,this._ui.dockVolume.classList.remove("active"),this._ui.dockChannel.classList.remove("active"),clearTimeout(this._popTimer))}_armPopTimer(){clearTimeout(this._popTimer),this._popTimer=setTimeout(()=>this._closePop(),se)}_wireVolumeSlider(){let{vpill:e}=this._ui,t=a=>{let n=e.getBoundingClientRect(),s=Math.min(1,Math.max(0,(n.bottom-a.clientY)/n.height)),o=Math.round(s*33);o!==this._volumeNotch&&(this._volumeNotch=o,this._haptic("step")),this._renderVolume(s,!1),this._volumeSetter(s),this._armPopTimer()};this._volumeSetter=Be(a=>this._mediaPlayer("volume_set",{volume_level:Math.round(a*100)/100}),oe),e.addEventListener("pointerdown",a=>{e.setPointerCapture(a.pointerId),t(a)}),e.addEventListener("pointermove",a=>{e.hasPointerCapture(a.pointerId)&&t(a)})}_renderVolume(e,t){let{vfill:a,vpill:n,volLevel:s,dockVolume:o}=this._ui,r=e==null?0:Math.round(e*100);a.style.height=`${r}%`,n.classList.toggle("low",r<18),s.textContent=e==null?"\u2013":r,o.innerHTML=l(t?"volume-off":e!=null&&e<.34?"volume-low":"volume-high")}_openSheet(e){this._buzz(),this._closePop(),this._sheet=e,this._ui.card.dataset.sheet=e,this._placeSheets(),e==="keyboard"&&this._ui.text.focus(),e==="channels"&&this._onChannelsOpened(),e==="numpad"&&this._onNumpadOpened(),e==="inputs"&&this._renderSources(this._stateObj?.attributes.source_list??[],this._stateObj?.attributes.source)}_closeSheet(){this._sheet=null,delete this._ui.card.dataset.sheet,this._ui.text.blur(),this._ui.channelSearch.blur(),this._cancelNumberTimer()}_placeSheets(){let{card:e}=this._ui,{left:t,width:a}=e.getBoundingClientRect();e.style.setProperty("--kb-left",`${t}px`),e.style.setProperty("--kb-width",`${a}px`);let n=window.visualViewport;if(!n)return;let s=he({layoutHeight:window.innerHeight,visualHeight:n.height,visualOffsetTop:n.offsetTop});e.style.setProperty("--kb-inset",`${s}px`)}async _ensureChannels(){if(!(this._channels.length||this._loadingChannels||!this._tvOn)){this._loadingChannels=!0;try{this._channels=we(await $e(this._hass,this._config.entity))}catch{this._showError("channels")}finally{this._loadingChannels=!1}}}async _onChannelsOpened(){this._ui.channelSearch.value="",this._channelQuery="",this._renderChannelList(),await this._ensureChannels(),this._renderChannelList(),this._loadListedPrograms()}_renderChannelList(){this._ui.channelList.innerHTML=Oe({channels:this._channels,favorites:this._favorites,query:this._channelQuery,showAll:this._showAllChannels,current:this._now?.number,programs:this._programs,t:this._t})}async _loadListedPrograms(){let e=E(this._channels,this._favorites,T);for(let t of e){let a=this._programs[t.number];if(!(a&&Date.now()-a.at<ne)){if(this._sheet!=="channels")return;try{let{programList:n}=await B(this._hass,this._config.entity,t.id);this._programs[t.number]={...V(n)??{},at:Date.now()},this._renderChannelList()}catch{return}}}}_toggleStar(e){this._favorites=Te(this._favorites,e),C("favorites",this._favorites),this._renderChannelList(),this._loadListedPrograms()}_tuneChannel(e){this._haptic("success"),this._mediaPlayer("play_media",{media_content_type:"channel",media_content_id:e}),this._closeSheet(),setTimeout(()=>{this._nowKey=null,this._refreshNow()},1500)}_onNumpadOpened(){this._typed="",this._renderNumpad(),this._ensureChannels().then(()=>this._renderNumpad())}_onDigit(e){this._buzz(),e==="del"?this._typed=this._typed.slice(0,-1):this._typed.length<k.maxDigits&&(this._typed+=e),this._renderNumpad(),this._armNumberTimer()}_renderNumpad(){let{numValue:e,numName:t}=this._ui,a=S(this._channels,this._typed);e.textContent=this._typed,this._typed?a?t.textContent=a.name:t.textContent=this._typed.length>=2?this._t("num.notFound"):"":t.textContent=this._t("num.prompt")}_armNumberTimer(){if(this._cancelNumberTimer(),!S(this._channels,this._typed))return;let{numDisplay:e,numRing:t}=this._ui,a=Date.now();e.classList.add("counting");let n=()=>{let s=Math.min(1,(Date.now()-a)/k.delayMs);t.style.setProperty("--p",`${Math.round(s*100)}%`),s<1&&(this._numberFrame=requestAnimationFrame(n))};n(),this._numberTimer=setTimeout(()=>this._confirmNumber(),k.delayMs)}_cancelNumberTimer(){clearTimeout(this._numberTimer),cancelAnimationFrame(this._numberFrame),this._ui.numDisplay.classList.remove("counting"),this._ui.numRing.style.setProperty("--p","0%")}_confirmNumber(){this._cancelNumberTimer();let e=S(this._channels,this._typed);if(!e){let{numDisplay:t}=this._ui;t.classList.remove("bad"),t.offsetWidth,t.classList.add("bad"),this._haptic("error");return}this._typed="",this._tuneChannel(e.number)}_dictate(){let e=window.SpeechRecognition||window.webkitSpeechRecognition;if(!e){this._ui.text.placeholder=this._t("dictate.unsupported"),this._ui.text.focus();return}let t=new e;t.lang=this._t("dictate.lang"),t.interimResults=!1,t.onresult=a=>{this._ui.text.value=a.results[0][0].transcript,this._syncText()},t.onerror=()=>{this._ui.text.placeholder=this._t("dictate.failed")},t.start()}_onPowerClick(){let e=Date.now()-this._powerHeldAt<yt;!this._tvOn&&!e&&this._requestPowerOn()}_requestPowerOn(){this._haptic("heavy"),this._wakeRequestedAt=Date.now(),this._mediaPlayer("turn_on"),this._refresh(),this._refreshAfter(R)}_startPowerHold(){let{sheet:e,sheetHint:t,sheetFill:a,power:n}=this._ui;clearTimeout(this._sheetHideTimer),t.textContent=this._t("hold.start"),e.classList.add("visible"),n.classList.add("holding"),this._setHoldProgress(0,"none"),a.offsetWidth,this._setHoldProgress(100,`width ${N}ms linear`)}_completePowerHold(){this._powerHeldAt=Date.now(),this._haptic("heavy"),this._sleepRequestedAt=Date.now(),this._mediaPlayer("turn_off"),this._refresh(),this._refreshAfter(O),this._ui.sheet.classList.remove("visible"),this._ui.power.classList.remove("holding"),this._setHoldProgress(0,"none")}_cancelPowerHold(){this._ui.power.classList.remove("holding"),this._setHoldProgress(0,"none"),this._ui.sheetHint.textContent=this._t("hold.more"),this._sheetHideTimer=setTimeout(()=>this._ui.sheet.classList.remove("visible"),te)}_setHoldProgress(e,t){this._ui.sheetFill.style.transition=t,this._ui.sheetFill.style.width=`${e}%`}_showError(e){this._haptic("error");let{title:t,hint:a}=me({tvOn:this._tvOn,context:e,t:this._t});this._ui.toast.innerHTML=`<b>${t}</b><br>${a}`,this._ui.toast.classList.add("visible"),clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>this._ui.toast.classList.remove("visible"),ee)}};customElements.define("lg-tv-remote-card",q);window.customCards=window.customCards||[];window.customCards.push({type:"lg-tv-remote-card",name:"LG TV Remote",description:"LG webOS remote for your phone: touchpad, apps, text, volume and channels"});
