import { TAB_BAR } from './constants.js';

/** Card stylesheet: dark "liquid glass" look. --tint (set from the current channel or app) colours the background. */
export const STYLES = /* css */ `
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
  .tabs { --ease:cubic-bezier(.25,.8,.25,1); position:relative; display:flex; gap:${TAB_BAR.gap}px; padding:${TAB_BAR.padding}px; border-radius:26px; flex:none; }
  .tab-pill {
    position:absolute; top:${TAB_BAR.padding}px; bottom:${TAB_BAR.padding}px; left:0; width:0; pointer-events:none; will-change:transform, width;
    transition:transform ${TAB_BAR.animationMs}ms var(--spring), width ${TAB_BAR.animationMs}ms var(--spring);
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
    color:var(--mute); font-size:12px; font-weight:600; cursor:pointer; transition:flex ${TAB_BAR.animationMs}ms var(--ease), color .2s;
  }
  .tab .tab-icon { width:22px; height:22px; flex:none; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; transition:transform ${TAB_BAR.animationMs}ms var(--ease); }
  .tab .tab-label { display:inline-block; max-width:0; padding-left:0; opacity:0; overflow:hidden; white-space:nowrap; transition:max-width ${TAB_BAR.animationMs}ms var(--ease), padding ${TAB_BAR.animationMs}ms var(--ease), opacity .2s; }
  .tab.selected { flex:${TAB_BAR.selectedFlex}; color:#fff; }
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
`;
