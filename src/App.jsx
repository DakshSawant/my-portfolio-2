import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:#020508; --bg1:#030709; --bg2:#04090f; --bg3:#060d16;
  --glass:rgba(0,180,255,0.04); --glass2:rgba(0,180,255,0.08);
  --border:rgba(0,180,255,0.10); --border2:rgba(0,180,255,0.22); --border3:rgba(0,180,255,0.45);
  --cyan:#00c8ff; --cyan2:rgba(0,200,255,0.15); --cyan3:rgba(0,200,255,0.06);
  --green:#00ff9d; --green2:rgba(0,255,157,0.12);
  --amber:#ffcc00; --amber2:rgba(255,204,0,0.12);
  --rose:#ff3366; --rose2:rgba(255,51,102,0.12);
  --violet:#aa66ff; --violet2:rgba(170,102,255,0.12);
  --text:#b8d8f0; --text2:#4d7090; --text3:#1e3048;
  --f-hud:'Orbitron',monospace; --f-body:'Rajdhani',sans-serif; --f-mono:'JetBrains Mono',monospace;
  --nav-h:58px;
}

html { scroll-behavior: smooth; }
body { background:var(--bg); color:var(--text); font-family:var(--f-body); font-size:15px; line-height:1.6; overflow-x:hidden; cursor:none; }

/* Grain */
body::after { content:''; position:fixed; inset:0; pointer-events:none; z-index:9000; opacity:.025;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:160px; }

/* Scanlines */
body::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:8999;
  background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 4px); }

a { color:inherit; text-decoration:none; }
::-webkit-scrollbar { width:3px; }
::-webkit-scrollbar-thumb { background:var(--border2); border-radius:2px; }

/* ── KEYFRAMES ── */
@keyframes orbDrift   { 0%{transform:translate(0,0)} 100%{transform:translate(40px,25px)} }
@keyframes hexSpin    { from{transform:rotate(0)} to{transform:rotate(360deg)} }
@keyframes gridDrift  { 0%{background-position:0 0} 100%{background-position:0 48px} }
@keyframes blink      { 0%,100%{opacity:1} 50%{opacity:.3} }
@keyframes fadeReveal { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes skillGlow  { 0%,100%{opacity:.6} 50%{opacity:0} }
@keyframes mobileMenuIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

/* ── REVEAL ── */
.reveal   { opacity:0; transform:translateY(20px);  transition:opacity .6s,transform .6s; }
.reveal-l { opacity:0; transform:translateX(-20px); transition:opacity .6s,transform .6s; }
.reveal-r { opacity:0; transform:translateX(20px);  transition:opacity .6s,transform .6s; }
.reveal.in,.reveal-l.in,.reveal-r.in { opacity:1; transform:none; }

/* ── BACKGROUND LAYERS ── */
.grid-bg { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.grid-bg::before { content:''; position:absolute; inset:-50%;
  background-image:linear-gradient(rgba(0,180,255,.07) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(0,180,255,.07) 1px,transparent 1px);
  background-size:48px 48px;
  animation:gridDrift 30s linear infinite;
  transform:perspective(600px) rotateX(30deg) scale(2.5) translateY(10%); }

.orb { position:fixed; border-radius:50%; pointer-events:none; z-index:1; filter:blur(90px); animation:orbDrift 20s ease-in-out infinite alternate; }
.orb1 { width:700px;height:700px; background:radial-gradient(#003060,transparent 70%); top:-200px;left:-200px; opacity:.25; animation-duration:24s; }
.orb2 { width:500px;height:500px; background:radial-gradient(#002040,transparent 70%); bottom:-150px;right:-100px; opacity:.2; animation-duration:30s; animation-delay:-12s; }
.hex-watermark { position:fixed; right:-60px;bottom:-80px; z-index:1; pointer-events:none; font-size:320px; color:var(--cyan); opacity:.025; font-family:var(--f-hud); animation:hexSpin 80s linear infinite; line-height:1; }

/* ── CURSOR ── */
#cur      { position:fixed; width:8px;height:8px; border-radius:50%; background:var(--cyan); pointer-events:none; z-index:10000; transform:translate(-50%,-50%); box-shadow:0 0 12px var(--cyan); transition:width .15s,height .15s; }
#cur-ring { position:fixed; width:32px;height:32px; border-radius:50%; border:1px solid rgba(0,200,255,.5); pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition:width .2s,height .2s,border-color .2s; }

/* ── NAV ── */
nav { position:fixed; top:0;left:0;right:0; height:var(--nav-h); z-index:2000; display:flex; align-items:center; justify-content:space-between; padding:0 32px; background:rgba(2,5,8,.92); border-bottom:1px solid var(--border2); backdrop-filter:blur(20px); }
nav::after { content:''; position:absolute; bottom:0;left:0;right:0; height:1px; background:linear-gradient(90deg,transparent,var(--cyan),transparent); opacity:.4; }
.nav-logo { font-family:var(--f-hud); font-size:18px; font-weight:700; color:var(--cyan); letter-spacing:.12em; cursor:pointer; text-shadow:0 0 20px rgba(0,200,255,.5); flex-shrink:0; }
.nav-links { display:flex; gap:24px; }
.nav-lnk { font-family:var(--f-hud); font-size:9px; font-weight:500; letter-spacing:.18em; color:var(--text2); cursor:pointer; transition:all .2s; position:relative; text-transform:uppercase; white-space:nowrap; }
.nav-lnk:hover,.nav-lnk.active { color:var(--cyan); text-shadow:0 0 10px rgba(0,200,255,.6); }
.nav-lnk.active::after { content:''; position:absolute; bottom:-4px;left:0;right:0; height:1px; background:var(--cyan); box-shadow:0 0 6px var(--cyan); }
.nav-clock { font-family:var(--f-mono); font-size:11px; color:var(--text2); padding:5px 10px; border:1px solid var(--border); background:var(--glass); border-radius:3px; letter-spacing:.06em; white-space:nowrap; }
.nav-hire { padding:7px 18px; border-radius:3px; background:transparent; border:1px solid var(--border3); color:var(--cyan); font-family:var(--f-hud); font-size:9px; font-weight:700; letter-spacing:.15em; cursor:pointer; transition:all .2s; overflow:hidden; white-space:nowrap; }
.nav-hire:hover { box-shadow:0 0 18px rgba(0,200,255,.3); background:rgba(0,200,255,.06); }
.nav-hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:4px; background:none; border:none; }
.nav-hamburger span { display:block; width:20px; height:1.5px; background:var(--cyan); border-radius:1px; transition:all .25s; }
.nav-hamburger.open span:nth-child(1) { transform:translateY(6.5px) rotate(45deg); }
.nav-hamburger.open span:nth-child(2) { opacity:0; }
.nav-hamburger.open span:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); }
.mobile-menu { display:none; position:fixed; top:var(--nav-h); left:0; right:0; z-index:1999; background:rgba(2,5,8,.97); border-bottom:1px solid var(--border2); backdrop-filter:blur(20px); padding:20px 24px; flex-direction:column; gap:4px; animation:mobileMenuIn .2s both; }
.mobile-menu.open { display:flex; }
.mobile-menu-lnk { font-family:var(--f-hud); font-size:11px; font-weight:500; letter-spacing:.18em; color:var(--text2); cursor:pointer; padding:12px 8px; border-bottom:1px solid var(--border); transition:color .2s; text-transform:uppercase; }
.mobile-menu-lnk:last-child { border-bottom:none; }
.mobile-menu-lnk:hover,.mobile-menu-lnk.active { color:var(--cyan); }

/* ── LAYOUT ── */
section { position:relative; z-index:2; }
.container { max-width:1200px; margin:0 auto; padding:0 36px; }
.divider { height:1px; background:linear-gradient(90deg,transparent,var(--border2),transparent); }

/* ── SHARED TYPOGRAPHY ── */
.hud-label { font-family:var(--f-hud); font-size:9px; font-weight:500; letter-spacing:.2em; color:var(--cyan); text-transform:uppercase; display:flex; align-items:center; gap:8px; margin-bottom:12px; }
.hud-label::before { content:'//'; opacity:.5; font-size:8px; }
.hud-label::after  { content:''; flex:1; max-width:60px; height:1px; background:linear-gradient(90deg,var(--cyan),transparent); opacity:.6; }
.sec-title { font-family:var(--f-hud); font-size:clamp(36px,5.5vw,72px); font-weight:900; line-height:.9; letter-spacing:.06em; margin-bottom:14px; color:#fff; text-shadow:0 0 40px rgba(0,200,255,.15); }
.sec-title span { color:var(--cyan); display:block; text-shadow:0 0 30px rgba(0,200,255,.4); }

/* ── CARD ── */
.card { background:var(--glass); border:1px solid var(--border2); border-radius:8px; position:relative; overflow:hidden; transition:border-color .25s,box-shadow .25s; }
.card::before { content:''; position:absolute; top:0;left:0;right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(0,200,255,.35),transparent); pointer-events:none; }
.card:hover { border-color:var(--border3); }

/* ── BUTTONS ── */
.btn-primary { padding:11px 26px; border-radius:3px; background:var(--cyan); color:#000; font-family:var(--f-hud); font-size:10px; font-weight:700; letter-spacing:.14em; cursor:pointer; border:none; transition:all .25s; text-decoration:none; display:inline-flex; align-items:center; gap:8px; }
.btn-primary:hover { background:#22ddff; box-shadow:0 0 28px rgba(0,200,255,.45); transform:translateY(-1px); }
.btn-outline { padding:10px 26px; border-radius:3px; background:transparent; border:1px solid var(--border3); color:var(--cyan); font-family:var(--f-hud); font-size:10px; font-weight:600; letter-spacing:.14em; cursor:pointer; transition:all .25s; text-decoration:none; display:inline-flex; align-items:center; gap:8px; }
.btn-outline:hover { background:rgba(0,200,255,.08); box-shadow:0 0 16px rgba(0,200,255,.2); }

/* ── HERO ── */
.hero-grid { display:grid; grid-template-columns:1fr 340px; gap:60px; align-items:center; width:100%; }
.hero-system-id { display:inline-flex; align-items:center; gap:10px; padding:5px 14px; border:1px solid var(--border2); border-radius:2px; background:var(--glass); font-family:var(--f-mono); font-size:10px; color:var(--text2); letter-spacing:.08em; margin-bottom:24px; flex-wrap:wrap; }
.sys-dot { width:6px;height:6px; border-radius:50%; background:var(--green); box-shadow:0 0 8px var(--green); animation:blink 1.8s ease-in-out infinite; flex-shrink:0; }
.hero-name { font-family:var(--f-hud); font-size:clamp(48px,7vw,96px); font-weight:900; line-height:.88; letter-spacing:.08em; margin-bottom:10px; color:#fff; }
.hero-name .accent { color:var(--cyan); text-shadow:0 0 40px rgba(0,200,255,.5); display:block; }
.hero-role { font-family:var(--f-hud); font-size:clamp(10px,1.4vw,14px); font-weight:500; color:var(--text2); letter-spacing:.15em; margin-bottom:24px; text-transform:uppercase; }
.hero-btns { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:40px; }
.hero-kpis { display:grid; grid-template-columns:repeat(4,1fr); border:1px solid var(--border2); border-radius:6px; overflow:hidden; background:var(--glass); }
.hero-kpi  { padding:16px 14px; border-right:1px solid var(--border); }
.hero-kpi:last-child { border-right:none; }
.hkpi-val  { font-family:var(--f-hud); font-size:clamp(18px,2vw,24px); font-weight:800; color:#fff; line-height:1; }
.hkpi-val span { font-size:13px; }
.hkpi-label { font-family:var(--f-mono); font-size:8px; color:var(--text2); text-transform:uppercase; letter-spacing:.1em; margin-top:4px; }
.hero-panel { border-radius:10px; border:1px solid var(--border2); background:var(--glass); overflow:hidden; position:relative; }
.hero-panel::before { content:''; position:absolute; inset:0; background:linear-gradient(160deg,rgba(0,200,255,.05),transparent 60%); pointer-events:none; z-index:1; }
.hero-panel-img { width:100%; aspect-ratio:.75; object-fit:cover; object-position:top center; display:block; filter:saturate(.8) contrast(1.1); mix-blend-mode:luminosity; opacity:.7; }
.hero-panel-overlay { position:absolute; bottom:0;left:0;right:0; padding:20px; background:linear-gradient(0deg,rgba(2,5,8,.98),rgba(2,5,8,.6),transparent); z-index:2; }
.hero-panel-name { font-family:var(--f-hud); font-size:16px; font-weight:700; color:#fff; letter-spacing:.1em; margin-bottom:3px; }
.hero-panel-role { font-size:11px; color:var(--text2); font-family:var(--f-mono); margin-bottom:10px; }
.hero-panel-tags { display:flex; flex-wrap:wrap; gap:5px; }
.h-tag { padding:2px 8px; border-radius:2px; font-family:var(--f-mono); font-size:9px; background:rgba(0,200,255,.08); border:1px solid rgba(0,200,255,.18); color:var(--cyan); }
.hero-badge { position:absolute; top:16px; right:-14px; z-index:10; background:rgba(2,5,8,.9); border:1px solid var(--border3); border-radius:6px; padding:10px 14px; backdrop-filter:blur(10px); box-shadow:0 0 20px rgba(0,200,255,.15); }
.hbadge-val { font-family:var(--f-hud); font-size:22px; font-weight:900; color:var(--cyan); line-height:1; text-shadow:0 0 14px var(--cyan); }
.hbadge-label { font-family:var(--f-mono); font-size:8px; color:var(--text2); text-transform:uppercase; letter-spacing:.1em; margin-top:2px; }
.corner { position:absolute; width:14px;height:14px; pointer-events:none; z-index:5; }
.corner-tl { top:8px;left:8px;    border-top:1px solid var(--cyan); border-left:1px solid var(--cyan);   opacity:.6; }
.corner-tr { top:8px;right:8px;   border-top:1px solid var(--cyan); border-right:1px solid var(--cyan);  opacity:.6; }
.corner-bl { bottom:8px;left:8px;  border-bottom:1px solid var(--cyan); border-left:1px solid var(--cyan);  opacity:.6; }
.corner-br { bottom:8px;right:8px; border-bottom:1px solid var(--cyan); border-right:1px solid var(--cyan); opacity:.6; }

/* ── PROJECTS ── */
.proj-header { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:32px; flex-wrap:wrap; gap:16px; }
.proj-filters { display:flex; gap:6px; flex-wrap:wrap; }
.pf { padding:5px 14px; border-radius:2px; border:1px solid var(--border); background:transparent; color:var(--text2); font-family:var(--f-hud); font-size:8px; letter-spacing:.14em; cursor:pointer; transition:all .2s; }
.pf.active { border-color:var(--border3); background:var(--cyan2); color:var(--cyan); }
.pf:hover:not(.active) { border-color:var(--border2); color:var(--text); }
.proj-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; }
.proj-card { position:relative; overflow:hidden; cursor:pointer; transition:all .3s; min-height:200px; }
.proj-card::before { content:''; position:absolute; top:0;left:0;right:0; height:2px; box-shadow:0 0 12px var(--pc,var(--cyan)); background:var(--pc,var(--cyan)); opacity:.8; z-index:3; }
.proj-card-bg { position:absolute; inset:0; opacity:.06; font-size:100px; display:flex; align-items:center; justify-content:center; transition:all .4s; filter:blur(2px); }
.proj-card:hover .proj-card-bg { opacity:.12; transform:scale(1.1); }
.proj-card-inner { padding:22px; position:relative; z-index:2; height:100%; display:flex; flex-direction:column; }
.proj-id     { font-family:var(--f-mono); font-size:9px; color:var(--text3); letter-spacing:.1em; margin-bottom:10px; }
.proj-name   { font-family:var(--f-hud); font-size:clamp(13px,1.6vw,18px); font-weight:700; letter-spacing:.06em; color:#fff; line-height:1.2; margin-bottom:6px; flex:1; }
.proj-tech   { font-family:var(--f-mono); font-size:9px; color:var(--text2); margin-bottom:16px; letter-spacing:.04em; }
.proj-foot   { display:flex; align-items:center; justify-content:space-between; padding-top:14px; border-top:1px solid var(--border); flex-wrap:wrap; gap:6px; }
.proj-impact { font-family:var(--f-hud); font-size:12px; font-weight:700; }
.ps-live { background:var(--green2); color:var(--green); border:1px solid rgba(0,255,157,.2); }
.ps-ship { background:rgba(0,200,255,.1); color:var(--cyan); border:1px solid rgba(0,200,255,.2); }
.ps-pub  { background:var(--amber2); color:var(--amber); border:1px solid rgba(255,204,0,.2); }
.proj-status-pill { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:2px; font-family:var(--f-mono); font-size:9px; font-weight:600; }

/* ── EXPERIENCE ── */
.exp-layout { display:grid; grid-template-columns:280px 1fr; gap:32px; margin-top:48px; align-items:start; }
.exp-tab { padding:14px 16px; border-radius:4px; cursor:pointer; border:1px solid transparent; transition:all .2s; position:relative; margin-bottom:3px; }
.exp-tab.active { background:var(--glass2); border-color:var(--border2); }
.exp-tab.active::before { content:''; position:absolute; left:0;top:0;bottom:0; width:2px; border-radius:2px 0 0 2px; background:var(--tc,var(--cyan)); box-shadow:0 0 10px var(--tc,var(--cyan)); }
.exp-tab:hover:not(.active) { background:var(--glass); border-color:var(--border); }
.exp-tab-period  { font-family:var(--f-mono); font-size:8px; color:var(--text3); letter-spacing:.1em; margin-bottom:4px; }
.exp-tab-company { font-family:var(--f-hud); font-size:13px; font-weight:600; color:var(--text); letter-spacing:.06em; transition:color .2s; }
.exp-tab.active .exp-tab-company { color:var(--tc,var(--cyan)); }
.exp-tab-role { font-size:11px; color:var(--text2); margin-top:2px; }
.exp-metrics-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin:18px 0; }
.exp-metric { padding:12px 14px; border-radius:6px; background:rgba(0,0,0,.2); border:1px solid var(--border); position:relative; overflow:hidden; }
.exp-metric::before { content:''; position:absolute; top:0;left:0;right:0; height:1px; background:var(--mc,var(--cyan)); opacity:.5; }
.exp-metric-val   { font-family:var(--f-hud); font-size:22px; font-weight:800; line-height:1; margin-bottom:2px; }
.exp-metric-label { font-family:var(--f-mono); font-size:8px; color:var(--text2); text-transform:uppercase; letter-spacing:.1em; }
.bullet-row { display:flex; gap:10px; align-items:flex-start; margin-bottom:10px; }
.bullet-dot { width:4px;height:4px; border-radius:50%; flex-shrink:0; margin-top:8px; }
.bullet-text { font-size:13px; color:var(--text2); line-height:1.75; }
.stack-row { display:flex; flex-wrap:wrap; gap:5px; margin-top:18px; padding-top:16px; border-top:1px solid var(--border); }
.s-pill { padding:3px 9px; border-radius:2px; font-family:var(--f-mono); font-size:9px; background:var(--glass); border:1px solid var(--border); color:var(--text2); transition:all .2s; }
.s-pill:hover { background:var(--cyan2); border-color:rgba(0,200,255,.3); color:var(--cyan); }
.edu-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:24px; }
.edu-card { padding:14px 16px; border-radius:6px; position:relative; overflow:hidden; }
.edu-card::before { content:''; position:absolute; top:0;left:0; width:2px; height:100%; background:var(--ec,var(--cyan)); box-shadow:0 0 8px var(--ec,var(--cyan)); }
.edu-cgpa { font-family:var(--f-hud); font-size:26px; font-weight:900; line-height:1; margin-bottom:4px; }
.edu-deg  { font-size:12px; font-weight:600; color:var(--text); margin-bottom:2px; line-height:1.3; }
.edu-inst { font-size:10px; font-family:var(--f-mono); margin-bottom:2px; opacity:.8; }
.edu-period { font-size:9px; color:var(--text3); font-family:var(--f-mono); }

/* ── SKILLS ── */
.skills-layout { display:grid; grid-template-columns:1fr 1fr; gap:48px; margin-top:48px; }
.rings-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:20px; }
.ring-card { padding:16px; border-radius:6px; display:flex; flex-direction:column; align-items:center; gap:8px; position:relative; overflow:hidden; transition:border-color .2s; }
.ring-card:hover { border-color:var(--border3); }
.ring-label { font-family:var(--f-hud); font-size:8px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; text-align:center; margin-top:4px; }
.ring-sub   { font-size:10px; color:var(--text2); font-family:var(--f-mono); text-align:center; }
.skill-item { margin-bottom:18px; }
.skill-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:7px; }
.skill-name { font-family:var(--f-hud); font-size:11px; font-weight:600; letter-spacing:.08em; color:var(--text); }
.skill-cat  { padding:2px 7px; border-radius:2px; font-family:var(--f-mono); font-size:8px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; }
.skill-pct  { font-family:var(--f-mono); font-size:11px; font-weight:500; }
.skill-track { height:4px; border-radius:2px; background:rgba(255,255,255,.05); overflow:hidden; position:relative; }
.skill-fill  { height:100%; border-radius:2px; position:relative; transition:width 1.4s cubic-bezier(.22,1,.36,1); width:0; }
.skill-fill::after { content:''; position:absolute; right:0;top:0; height:100%; width:6px; background:rgba(255,255,255,.6); border-radius:2px; animation:skillGlow 2s ease-in-out infinite; opacity:0; }
.skill-item.vis .skill-fill::after { opacity:1; }
.sg-card { padding:16px 18px; border-radius:6px; margin-bottom:10px; position:relative; overflow:hidden; }
.sg-card::before { content:''; position:absolute; top:0;left:0;right:0; height:1px; background:linear-gradient(90deg,var(--sc,var(--cyan)),transparent); opacity:.6; }
.sg-title { font-family:var(--f-hud); font-size:11px; font-weight:600; letter-spacing:.1em; margin-bottom:10px; }
.sg-pills { display:flex; flex-wrap:wrap; gap:5px; }
.sg-pill  { padding:3px 8px; border-radius:2px; font-family:var(--f-mono); font-size:9px; background:rgba(255,255,255,.03); border:1px solid var(--border); color:var(--text2); }

/* ── CONTACT ── */
.contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:start; }
.contact-big { font-family:var(--f-hud); font-size:clamp(32px,4.5vw,58px); font-weight:900; letter-spacing:.06em; line-height:.95; margin-bottom:20px; }
.contact-big span { color:var(--cyan); display:block; text-shadow:0 0 24px rgba(0,200,255,.4); }
.contact-row { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:5px; border:1px solid var(--border); background:var(--glass); transition:all .25s; text-decoration:none; margin-bottom:8px; }
.contact-row:hover { border-color:var(--border3); background:var(--glass2); transform:translateX(4px); box-shadow:0 0 16px rgba(0,200,255,.08); }
.cr-icon  { width:30px;height:30px; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:12px; flex-shrink:0; }
.cr-label { font-family:var(--f-mono); font-size:8px; color:var(--text3); text-transform:uppercase; letter-spacing:.12em; }
.cr-val   { font-family:var(--f-hud); font-size:11px; font-weight:600; color:var(--text); letter-spacing:.04em; overflow:hidden; text-overflow:ellipsis; }
.form-panel-title { font-family:var(--f-hud); font-size:18px; font-weight:700; letter-spacing:.1em; color:#fff; margin-bottom:4px; }
.form-panel-sub   { font-family:var(--f-mono); font-size:10px; color:var(--text2); margin-bottom:24px; letter-spacing:.04em; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
.fg { display:flex; flex-direction:column; gap:5px; }
.fl { font-family:var(--f-mono); font-size:8px; font-weight:600; color:var(--text2); text-transform:uppercase; letter-spacing:.12em; }
.fi { background:rgba(0,0,0,.3); border:1px solid var(--border); border-radius:4px; padding:9px 12px; color:var(--text); font-family:var(--f-mono); font-size:11px; outline:none; transition:all .2s; width:100%; }
.fi:focus { border-color:rgba(0,200,255,.4); box-shadow:0 0 0 2px rgba(0,200,255,.07); }
.fi::placeholder { color:var(--text3); }
select.fi option { background:#04090f; }
.f-sub { width:100%; padding:12px; border-radius:4px; background:var(--cyan); color:#000; font-family:var(--f-hud); font-size:10px; font-weight:800; letter-spacing:.15em; border:none; cursor:pointer; transition:all .25s; margin-top:4px; }
.f-sub:hover { background:#22ddff; box-shadow:0 0 24px rgba(0,200,255,.35); transform:translateY(-1px); }

/* ── FOOTER ── */
footer { border-top:1px solid var(--border2); padding:24px 36px; display:flex; align-items:center; justify-content:space-between; background:var(--bg); position:relative; z-index:2; flex-wrap:wrap; gap:12px; }
footer::before { content:''; position:absolute; top:0;left:0;right:0; height:1px; background:linear-gradient(90deg,transparent,var(--cyan),transparent); opacity:.3; }
.footer-logo { font-family:var(--f-hud); font-size:16px; font-weight:800; color:var(--cyan); letter-spacing:.14em; text-shadow:0 0 14px rgba(0,200,255,.4); }
.footer-copy { font-family:var(--f-mono); font-size:9px; color:var(--text3); letter-spacing:.1em; }
.footer-link { font-family:var(--f-mono); font-size:9px; color:var(--text3); letter-spacing:.1em; transition:color .2s; }
.footer-link:hover { color:var(--cyan); }

/* ══════════════════════════════════════════════
   RESPONSIVE BREAKPOINTS
══════════════════════════════════════════════ */

/* ── TABLET  ≤ 1024px ── */
@media (max-width:1024px) {
  .container { padding:0 24px; }

  /* Nav: hide desktop links, show hamburger */
  .nav-links { display:none; }
  .nav-clock  { display:none; }
  .nav-hamburger { display:flex; }

  /* Hero */
  .hero-grid { grid-template-columns:1fr; gap:40px; }
  .hero-panel-wrap { order:-1; max-width:320px; margin:0 auto; }
  .hero-badge { right:8px; top:12px; }

  /* Projects: 2 cols */
  .proj-grid { grid-template-columns:1fr 1fr; }

  /* Experience: stack */
  .exp-layout { grid-template-columns:1fr; gap:24px; }
  .exp-metrics-grid { grid-template-columns:repeat(2,1fr); }

  /* Skills: stack */
  .skills-layout { grid-template-columns:1fr; gap:32px; }

  /* Contact: stack */
  .contact-grid { grid-template-columns:1fr; gap:32px; }
}

/* ── MOBILE ≤ 640px ── */
@media (max-width:640px) {
  :root { --nav-h:54px; }
  body { cursor:auto; }
  #cur, #cur-ring { display:none; }
  .container { padding:0 16px; }

  /* Nav */
  nav { padding:0 16px; }
  .nav-logo { font-size:14px; }
  .nav-hire  { padding:6px 12px; font-size:8px; letter-spacing:.1em; }

  /* Section padding */
  section.sec-pad { padding:72px 0; }

  /* Hero */
  .hero-grid { gap:32px; }
  .hero-system-id { font-size:9px; padding:4px 10px; }
  .hero-name { font-size:clamp(40px,12vw,64px); }
  .hero-role { font-size:10px; letter-spacing:.1em; }
  .hero-btns { flex-direction:column; gap:10px; }
  .hero-btns .btn-primary,
  .hero-btns .btn-outline { width:100%; justify-content:center; }
  .hero-kpis { grid-template-columns:1fr 1fr; }
  .hero-kpi { border-bottom:1px solid var(--border); }
  .hero-kpi:nth-child(2) { border-right:none; }
  .hero-kpi:nth-child(3),.hero-kpi:nth-child(4) { border-bottom:none; }
  .hkpi-val { font-size:20px; }
  .hero-badge { display:none; }

  /* Projects: 1 col */
  .proj-grid { grid-template-columns:1fr; }
  .proj-header { flex-direction:column; align-items:flex-start; gap:12px; }
  .proj-filters { width:100%; justify-content:flex-start; }

  /* Experience */
  .exp-metrics-grid { grid-template-columns:1fr 1fr; }
  .exp-metric-val { font-size:18px; }
  .edu-grid { grid-template-columns:1fr; }

  /* Skills */
  .rings-grid { grid-template-columns:repeat(3,1fr); gap:8px; }
  .ring-card { padding:10px 8px; }
  .ring-sub  { display:none; }

  /* Contact form row: 1 col */
  .form-row { grid-template-columns:1fr; }

  /* Footer */
  footer { flex-direction:column; align-items:center; text-align:center; padding:20px 16px; gap:8px; }
  .footer-links { display:flex; gap:16px; }
}

/* ── SMALL MOBILE ≤ 400px ── */
@media (max-width:400px) {
  .hero-name { font-size:clamp(34px,11vw,52px); }
  .sec-title { font-size:clamp(30px,8vw,42px); }
  .rings-grid { grid-template-columns:repeat(2,1fr); }
  .proj-filters .pf { padding:4px 10px; font-size:7px; }
}
`;

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const PROJECTS = [
  { id: "PRJ-001", name: "HSNCU UNIVERSITY\nWEBSITE", tech: "WordPress · JS · cPanel", sf: "live", impact: "10K+ Users", color: "var(--cyan)", icon: "🌐" },
  { id: "PRJ-002", name: "AI DOCUMENT\nVERIFIER", tech: "Python · OpenCV · ML", sf: "live", impact: "60% Faster", color: "var(--green)", icon: "🔍" },
  { id: "PRJ-003", name: "ENROLLMENT\nMANAGEMENT", tech: "React · REST API · MySQL", sf: "live", impact: "2K+ Applicants", color: "var(--amber)", icon: "📋" },
  { id: "PRJ-004", name: "IoT HEALTHCARE\nRESEARCH", tech: "IoT · mHealth", sf: "pub", impact: "IJRAR 2023", color: "var(--violet)", icon: "📡", link: "http://www.ijrar.org/papers/IJRAR23C1417.pdf" },
  { id: "PRJ-005", name: "ERP DATA\nMIGRATION", tech: "MySQL · ERP · Systems", sf: "ship", impact: "Zero Data Loss", color: "var(--rose)", icon: "🗄️" },
  { id: "PRJ-006", name: "WEATHER\nDASHBOARD", tech: "JavaScript · REST API", sf: "live", impact: "Live Data", color: "var(--cyan)", icon: "⛅" },
];

const EXP = [
  {
    id: "EXP-001", company: "HSNC UNIVERSITY", role: "Website Coordinator & ERP Specialist", period: "Oct 2023 – Present", type: "Full-time", color: "var(--cyan)", status: "active",
    metrics: [["10K+", "Users"], ["99.9%", "Uptime"], ["60%", "Faster"], ["0", "Data Loss"]],
    bullets: ["Oversaw hsncu.edu.in for 10,000+ users — 99.9% uptime, 30% faster page loads", "AI/ML image processing (Python, OpenCV) — cut doc verification time 60%", "Built Enrollment Management System for 2,000+ applicants per cycle", "Migrated 10K+ student records to ERP — zero data loss, one week early"],
    stack: ["WordPress", "JavaScript", "Python", "OpenCV", "MySQL", "ERP", "REST API", "cPanel"]
  },
  {
    id: "EXP-002", company: "IB EXPERTS", role: "Digital Marketing Executive", period: "Sep – Oct 2023", type: "Full-time", color: "var(--amber)", status: "completed",
    metrics: [],
    bullets: ["Planned & optimised campaigns across Google Ads, Facebook, LinkedIn", "On-page & off-page SEO via Google Analytics and Search Console", "Developed content calendars coordinating writers, designers, email campaigns"],
    stack: ["Google Ads", "SEO", "Analytics", "Content Strategy", "Email Marketing"]
  },
  {
    id: "EXP-003", company: "NN SOLUTION PVT LTD", role: "Trainee Analyst Intern", period: "Mar – Sep 2023", type: "Internship", color: "var(--violet)", status: "completed",
    metrics: [],
    bullets: ["Figma UI/UX prototypes for 3 client projects — 25% less onboarding friction", "Cleaned & analysed 100K+ row datasets with SQL and Python (Pandas)", "Presented findings in weekly agile stakeholder reviews"],
    stack: ["Figma", "SQL", "Python", "Pandas", "UI/UX", "Agile"]
  },
];

const SKILLS = [
  { name: "HTML5 / CSS3", pct: 95, cat: "Frontend", color: "var(--cyan)", cc: "rgba(0,200,255,.1)", tc: "var(--cyan)" },
  { name: "JavaScript", pct: 92, cat: "Frontend", color: "var(--cyan)", cc: "rgba(0,200,255,.1)", tc: "var(--cyan)" },
  { name: "WordPress", pct: 95, cat: "CMS", color: "var(--violet)", cc: "rgba(170,102,255,.1)", tc: "var(--violet)" },
  { name: "ERP Systems", pct: 92, cat: "Systems", color: "var(--violet)", cc: "rgba(170,102,255,.1)", tc: "var(--violet)" },
  { name: "REST APIs", pct: 90, cat: "Backend", color: "var(--green)", cc: "rgba(0,255,157,.1)", tc: "var(--green)" },
  { name: "React.js", pct: 88, cat: "Frontend", color: "var(--cyan)", cc: "rgba(0,200,255,.1)", tc: "var(--cyan)" },
  { name: "MySQL", pct: 88, cat: "Backend", color: "var(--green)", cc: "rgba(0,255,157,.1)", tc: "var(--green)" },
  { name: "Python", pct: 85, cat: "Backend", color: "var(--green)", cc: "rgba(0,255,157,.1)", tc: "var(--green)" },
  { name: "Figma", pct: 80, cat: "Design", color: "var(--rose)", cc: "rgba(255,51,102,.1)", tc: "var(--rose)" },
  { name: "OpenCV/ML", pct: 78, cat: "AI", color: "var(--amber)", cc: "rgba(255,204,0,.1)", tc: "var(--amber)" },
];

const RINGS = [
  { label: "Frontend", val: 92, sub: "HTML+JS+React", color: "var(--cyan)" },
  { label: "Backend", val: 88, sub: "Python+MySQL", color: "var(--green)" },
  { label: "Systems", val: 92, sub: "ERP+WordPress", color: "var(--violet)" },
  { label: "AI / ML", val: 78, sub: "OpenCV+IoT", color: "var(--amber)" },
  { label: "Design", val: 80, sub: "Figma+UX", color: "var(--rose)" },
  { label: "DevOps", val: 85, sub: "cPanel+DNS", color: "var(--cyan)" },
];

const SKILL_GROUPS = [
  { title: "Frontend Stack", color: "var(--cyan)", items: ["React.js", "JavaScript", "HTML5", "CSS3", "Bootstrap", "jQuery"] },
  { title: "Backend & Data", color: "var(--green)", items: ["Python", "MySQL", "PHP", "REST APIs", "SQL", "Pandas"] },
  { title: "CMS & DevOps", color: "var(--violet)", items: ["WordPress", "cPanel", "DNS/SSL", "ERP Admin", "Git", "Linux"] },
  { title: "AI & Research", color: "var(--amber)", items: ["OpenCV", "Machine Learning", "IoT", "mHealth", "Gen AI"] },
  { title: "Design & Growth", color: "var(--rose)", items: ["Figma", "UI/UX", "SEO", "Google Analytics", "Wireframing"] },
];

const SF_MAP = { live: "ps-live", ship: "ps-ship", pub: "ps-pub" };
const SF_LABEL = { live: "LIVE", ship: "SHIPPED", pub: "PUBLISHED" };
const PHOTO = "/pp.png";
const SECTIONS = ["hero", "projects", "experience", "skills", "contact"];

/* ═══════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════ */
function useClock() {
  const [t, set] = useState("00:00:00");
  useEffect(() => {
    const tick = () => { const n = new Date(); set([n.getHours(), n.getMinutes(), n.getSeconds()].map(v => String(v).padStart(2, "0")).join(":")); };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return t;
}

function useReveal(threshold = 0.1) {
  const ref = useRef(null); const [vis, set] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) set(true); }, { threshold });
    if (ref.current) obs.observe(ref.current); return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function useCounter(target, decimals = 0, duration = 1500, active = true) {
  const [val, set] = useState(0);
  useEffect(() => {
    if (!active) return;
    const s = performance.now();
    const tick = t => { const p = Math.min((t - s) / duration, 1), e = 1 - Math.pow(1 - p, 4); set(parseFloat((e * target).toFixed(decimals))); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, [target, active]);
  return decimals === 0 ? val.toLocaleString() : val.toFixed(decimals);
}

function useActiveSection() {
  const [active, set] = useState("hero");
  useEffect(() => {
    const fn = () => { let cur = "hero"; SECTIONS.forEach(id => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < 100) cur = id; }); set(cur); };
    window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn);
  }, []);
  return active;
}

/* ═══════════════════════════════════════════════
   SMALL HELPERS
═══════════════════════════════════════════════ */
const gotoSec = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
const Divider = () => <div className="divider" />;
const HudLabel = ({ children }) => <div className="hud-label">{children}</div>;
const SecTitle = ({ line1, line2 }) => <div className="sec-title">{line1}<span>{line2}</span></div>;

function RingGauge({ label, val, sub, color }) {
  const circ = 2 * Math.PI * 22, dash = (val / 100) * circ;
  return (
    <div className="ring-card card">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="3" />
        <circle cx="28" cy="28" r="22" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${dash.toFixed(1)} ${circ.toFixed(1)}`}
          strokeDashoffset={(circ / 4).toFixed(1)} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
        <text x="28" y="30" textAnchor="middle" dominantBaseline="middle"
          fontFamily="Orbitron,monospace" fontSize="10" fontWeight="700" fill="white">{val}%</text>
      </svg>
      <div className="ring-label" style={{ color }}>{label}</div>
      <div className="ring-sub">{sub}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CURSOR (desktop only)
═══════════════════════════════════════════════ */
function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [ring, setRing] = useState({ x: 0, y: 0 });
  const mx = useRef(0), my = useRef(0);
  useEffect(() => {
    const move = e => { mx.current = e.clientX; my.current = e.clientY; setPos({ x: e.clientX, y: e.clientY }); };
    document.addEventListener("mousemove", move);
    let rx = 0, ry = 0;
    const raf = () => { rx += (mx.current - rx) * .1; ry += (my.current - ry) * .1; setRing({ x: Math.round(rx), y: Math.round(ry) }); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => document.removeEventListener("mousemove", move);
  }, []);
  return (<><div id="cur" style={{ left: pos.x, top: pos.y }} /><div id="cur-ring" style={{ left: ring.x, top: ring.y }} /></>);
}

/* ═══════════════════════════════════════════════
   NAVBAR  (responsive)
═══════════════════════════════════════════════ */
function Navbar({ active }) {
  const time = useClock();
  const [menuOpen, setMenu] = useState(false);
  const nav = id => { gotoSec(id); setMenu(false); };

  return (
    <>
      <nav>
        <div className="nav-logo" onClick={() => window.scrollTo(0, 0)}>DAKSH·SAWANT</div>
        <div className="nav-links">
          {SECTIONS.map(id => (
            <span key={id} className={`nav-lnk${active === id ? " active" : ""}`} onClick={() => gotoSec(id)}>
              {id.toUpperCase()}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="nav-clock">{time}</div>
          <button className="nav-hire" onClick={() => gotoSec("contact")}>HIRE ME ▶</button>
          <button className={`nav-hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenu(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="mobile-menu open">
          {SECTIONS.map(id => (
            <div key={id} className={`mobile-menu-lnk${active === id ? " active" : ""}`} onClick={() => nav(id)}>
              {id.toUpperCase()}
            </div>
          ))}
          <div style={{ marginTop: 8, paddingTop: 12, borderTop: "1px solid var(--border)", fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--text2)" }}>{time}</div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════ */
function HeroKpi({ target, suffix, decimals, label, color }) {
  const [ref, vis] = useReveal(0.1);
  const val = useCounter(target, decimals, 1500, vis);
  return (
    <div className="hero-kpi" ref={ref}>
      <div className="hkpi-val" style={{ textShadow: `0 0 20px ${color}` }}>
        {val}<span style={{ color }}>{suffix}</span>
      </div>
      <div className="hkpi-label">{label}</div>
    </div>
  );
}

function HeroSection() {
  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "var(--nav-h)" }}>
      <div className="container">
        <div className="hero-grid">
          {/* LEFT */}
          <div style={{ animation: "fadeReveal .7s .1s both" }}>
            <div className="hero-system-id">
              <span className="sys-dot" />
              SYS·ID: DS·2025·MCA·VESIT &nbsp;|&nbsp; STATUS: ONLINE
            </div>
            <div className="hero-name">DAKSH<span className="accent">SAWANT</span></div>
            <div className="hero-role">Full‑Stack Developer · ERP Specialist · IoT Researcher</div>
            <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.85, maxWidth: 500, marginBottom: 36 }}>
              Building digital infrastructure at real scale — 10,000+ concurrent users, 99.9% uptime, zero data loss. MCA 8.78 CGPA · VESIT Mumbai · Published IJRAR 2023.
            </p>
            <div className="hero-btns">
              <a href="#contact" className="btn-primary"
                onClick={e => { e.preventDefault(); gotoSec("contact") }}>INITIATE CONTACT ▶</a>
              <a href="http://www.ijrar.org/papers/IJRAR23C1417.pdf" target="_blank" rel="noreferrer" className="btn-outline">
                RESEARCH ↗
              </a>
            </div>
            <div className="hero-kpis">
              <HeroKpi target={10247} suffix="+" decimals={0} label="Users Served" color="var(--cyan)" />
              <HeroKpi target={99.9} suffix="%" decimals={1} label="Uptime" color="var(--green)" />
              <HeroKpi target={6} suffix="+" decimals={0} label="Live Projects" color="var(--violet)" />
              <HeroKpi target={8.78} suffix="" decimals={2} label="MCA CGPA" color="var(--amber)" />
            </div>
          </div>
          {/* RIGHT */}
          <div className="hero-panel-wrap" style={{ position: "relative", animation: "fadeReveal .7s .3s both" }}>
            <div className="corner corner-tl" /><div className="corner corner-tr" />
            <div className="corner corner-bl" /><div className="corner corner-br" />
            <div className="hero-badge">
              <div className="hbadge-val">8.78</div>
              <div className="hbadge-label">MCA CGPA</div>
            </div>
            <div className="hero-panel">
              <img className="hero-panel-img" src={PHOTO} alt="Daksh Sawant" />
              <div className="hero-panel-overlay">
                <div className="hero-panel-name">DAKSH SAWANT</div>
                <div className="hero-panel-role">Mumbai, India · Open to Opportunities</div>
                <div className="hero-panel-tags">
                  {["WordPress", "React", "Python", "ERP", "OpenCV"].map(t => <span key={t} className="h-tag">{t}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════════ */
function ProjectsSection() {
  const [filter, setFilter] = useState("all");
  const [ref, vis] = useReveal(0.08);
  const shown = filter === "all" ? PROJECTS : PROJECTS.filter(p => p.sf === filter);
  return (
    <section id="projects" className="sec-pad" style={{ background: "var(--bg2)" }}>
      <div className="container">
        <div ref={ref} className={`reveal${vis ? " in" : ""}`}>
          <div className="proj-header">
            <div><HudLabel>Selected Work</HudLabel><SecTitle line1="PROJECTS" line2="REGISTRY" /></div>
            <div className="proj-filters">
              {[["all", "ALL"], ["live", "LIVE"], ["ship", "SHIPPED"], ["pub", "PUBLISHED"]].map(([f, l]) => (
                <button key={f} className={`pf${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{l}</button>
              ))}
            </div>
          </div>
          <div className="proj-grid">
            {shown.map((p, i) => (
              <div key={p.id} className="proj-card card"
                style={{ "--pc": p.color, background: "rgba(0,0,0,.25)", animation: `fadeReveal .4s ${i * 60}ms both` }}
                onClick={() => p.link && window.open(p.link, "_blank")}>
                <div className="proj-card-bg">{p.icon}</div>
                <div className="proj-card-inner">
                  <div className="proj-id">{p.id}</div>
                  <div className="proj-name" style={{ color: p.color, textShadow: `0 0 16px ${p.color}80` }}>
                    {p.name.split("\n").map((l, j) => <span key={j} style={{ display: "block" }}>{l}</span>)}
                  </div>
                  <div className="proj-tech">{p.tech}</div>
                  <div className="proj-foot">
                    <span className="proj-impact" style={{ color: p.color }}>{p.impact}</span>
                    <span className={`proj-status-pill ${SF_MAP[p.sf]}`}>
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor", display: "inline-block", boxShadow: "0 0 5px currentColor" }} />
                      {SF_LABEL[p.sf]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   EXPERIENCE
═══════════════════════════════════════════════ */
function ExperienceSection() {
  const [active, setActive] = useState(0);
  const [leftRef, lv] = useReveal(0.08);
  const [rightRef, rv] = useReveal(0.08);
  const exp = EXP[active];
  return (
    <section id="experience" className="sec-pad">
      <div className="container">
        <div className={`reveal${lv ? " in" : ""}`} ref={leftRef}>
          <HudLabel>Career Log</HudLabel>
          <SecTitle line1="EXPERIENCE" line2="TIMELINE" />
        </div>
        <div className="exp-layout">
          {/* LEFT */}
          <div>
            <div className={`reveal-l${lv ? " in" : ""}`} ref={leftRef}>
              {EXP.map((e, i) => (
                <div key={e.id} className={`exp-tab${i === active ? " active" : ""}`}
                  style={{ "--tc": e.color }} onClick={() => setActive(i)}>
                  <div className="exp-tab-period">{e.period} · {e.type}</div>
                  <div className="exp-tab-company">{e.company}</div>
                  <div className="exp-tab-role">{e.role}</div>
                </div>
              ))}
            </div>
            <div className={`edu-grid reveal-l${lv ? " in" : ""}`} style={{ transitionDelay: ".15s" }}>
              {[
                { deg: "Master of Computer Applications", inst: "VESIT · University of Mumbai", period: "2021–2023", cgpa: "8.78", color: "var(--cyan)" },
                { deg: "B.Sc. Information Technology", inst: "KC · University of Mumbai", period: "2018–2021", cgpa: "8.52", color: "var(--green)" },
              ].map(ed => (
                <div key={ed.deg} className="edu-card card" style={{ "--ec": ed.color }}>
                  <div className="edu-cgpa" style={{ color: ed.color, textShadow: `0 0 14px ${ed.color}` }}>{ed.cgpa}</div>
                  <div className="edu-deg">{ed.deg}</div>
                  <div className="edu-inst" style={{ color: ed.color }}>{ed.inst}</div>
                  <div className="edu-period">{ed.period}</div>
                </div>
              ))}
            </div>
          </div>
          {/* RIGHT */}
          <div ref={rightRef} className={`reveal-r${rv ? " in" : ""}`}>
            <div key={active} className="card" style={{ padding: 28, animation: "fadeIn .3s both", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: exp.color, boxShadow: `0 0 12px ${exp.color}` }} />
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: exp.color, letterSpacing: ".12em" }}>{exp.id}</span>
                <span style={{
                  padding: "2px 8px", borderRadius: 2, fontFamily: "var(--f-mono)", fontSize: 8, fontWeight: 700,
                  background: exp.status === "active" ? "var(--green2)" : "rgba(30,48,72,.4)",
                  color: exp.status === "active" ? "var(--green)" : "var(--text3)",
                  border: `1px solid ${exp.status === "active" ? "rgba(0,255,157,.2)" : "var(--border)"}`
                }}>
                  {exp.status.toUpperCase()}
                </span>
              </div>
              <div style={{ fontFamily: "var(--f-hud)", fontSize: clamp(14, 18), fontWeight: 700, letterSpacing: ".06em", color: "#fff", lineHeight: 1.2, marginBottom: 5 }}>{exp.role}</div>
              <div style={{ fontFamily: "var(--f-hud)", fontSize: 13, color: exp.color, textShadow: `0 0 10px ${exp.color}`, letterSpacing: ".08em", marginBottom: 3 }}>{exp.company}</div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: "var(--text3)", letterSpacing: ".1em", marginBottom: 18 }}>{exp.period}</div>
              {exp.metrics.length > 0 && (
                <div className="exp-metrics-grid">
                  {exp.metrics.map(([v, l]) => (
                    <div key={l} className="exp-metric" style={{ "--mc": exp.color }}>
                      <div className="exp-metric-val" style={{ color: exp.color, textShadow: `0 0 12px ${exp.color}` }}>{v}</div>
                      <div className="exp-metric-label">{l}</div>
                    </div>
                  ))}
                </div>
              )}
              <div>{exp.bullets.map((b, i) => (
                <div key={i} className="bullet-row">
                  <div className="bullet-dot" style={{ background: exp.color, boxShadow: `0 0 8px ${exp.color}` }} />
                  <div className="bullet-text">{b}</div>
                </div>
              ))}</div>
              <div className="stack-row">{exp.stack.map(s => <span key={s} className="s-pill">{s}</span>)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function clamp(min, max) { return `clamp(${min}px,2vw,${max}px)`; }

/* ═══════════════════════════════════════════════
   SKILLS
═══════════════════════════════════════════════ */
function SkillBar({ skill, index, visible }) {
  return (
    <div className={`skill-item${visible ? " vis" : ""}`}>
      <div className="skill-head">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="skill-name">{skill.name}</span>
          <span className="skill-cat" style={{ background: skill.cc, color: skill.tc }}>{skill.cat}</span>
        </div>
        <span className="skill-pct" style={{ color: skill.color }}>{skill.pct}%</span>
      </div>
      <div className="skill-track">
        <div className="skill-fill"
          style={{
            background: `linear-gradient(90deg,${skill.color}55,${skill.color})`,
            width: visible ? `${skill.pct}%` : "0%",
            transitionDelay: `${index * 0.055}s`
          }} />
      </div>
    </div>
  );
}

function SkillsSection() {
  const [lRef, lv] = useReveal(0.08);
  const [rRef, rv] = useReveal(0.08);
  const [tRef, tv] = useReveal(0.08);
  return (
    <section id="skills" className="sec-pad" style={{ background: "var(--bg2)" }}>
      <div className="container">
        <div ref={tRef} className={`reveal${tv ? " in" : ""}`}>
          <HudLabel>Technical Arsenal</HudLabel>
          <SecTitle line1="SKILLS" line2="MATRIX" />
        </div>
        <div className="skills-layout">
          <div ref={lRef} className={`reveal-l${lv ? " in" : ""}`}>
            <div className="rings-grid">
              {RINGS.map(r => <RingGauge key={r.label} {...r} />)}
            </div>
            {SKILLS.map((sk, i) => <SkillBar key={sk.name} skill={sk} index={i} visible={lv} />)}
          </div>
          <div ref={rRef} className={`reveal-r${rv ? " in" : ""}`}>
            {SKILL_GROUPS.map(g => (
              <div key={g.title} className="sg-card card" style={{ "--sc": g.color }}>
                <div className="sg-title" style={{ color: g.color, textShadow: `0 0 10px ${g.color}60` }}>{g.title}</div>
                <div className="sg-pills">{g.items.map(it => <span key={it} className="sg-pill">{it}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════ */
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", company: "", type: "Full-time Role", msg: "" });
  const [sent, setSent] = useState(false);
  const [lRef, lv] = useReveal(0.08);
  const [rRef, rv] = useReveal(0.08);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => { if (!form.name || !form.email || !form.msg) return; setSent(true); };

  const LINKS = [
    { href: "mailto:daksh.s.1808@gmail.com", icon: "✉", bg: "rgba(0,200,255,.1)", c: "var(--cyan)", label: "Email", val: "daksh.s.1808@gmail.com" },
    { href: "tel:+919834606550", icon: "☎", bg: "rgba(0,255,157,.1)", c: "var(--green)", label: "Phone", val: "+91 98346 06550" },
    { href: "https://linkedin.com/in/daksh-sawant", target: "_blank", icon: "in", bg: "rgba(170,102,255,.1)", c: "var(--violet)", label: "LinkedIn", val: "linkedin.com/in/daksh-sawant" },
    { href: "http://www.ijrar.org/papers/IJRAR23C1417.pdf", target: "_blank", icon: "📄", bg: "rgba(255,204,0,.1)", c: "var(--amber)", label: "Research", val: "IoT & mHealth · IJRAR 2023" },
  ];

  return (
    <section id="contact" className="sec-pad">
      <div className="container">
        <div className="contact-grid">
          <div ref={lRef} className={`reveal-l${lv ? " in" : ""}`}>
            <HudLabel>Open Channel</HudLabel>
            <div className="contact-big">INITIATE<span>CONTACT</span></div>
            <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.85, maxWidth: 380, marginBottom: 8 }}>
              Available for full-time roles, contract work, and research collaborations. Response within 24 hours.
            </p>
            <div style={{ marginTop: 20 }}>
              {LINKS.map(l => (
                <a key={l.label} href={l.href} target={l.target} rel="noreferrer" className="contact-row">
                  <div className="cr-icon" style={{ background: l.bg, color: l.c }}>{l.icon}</div>
                  <div style={{ minWidth: 0 }}>
                    <div className="cr-label">{l.label}</div>
                    <div className="cr-val">{l.val}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div ref={rRef} className={`reveal-r${rv ? " in" : ""}`}>
            <div className="card" style={{ padding: 28 }}>
              {sent ? (
                <div style={{ minHeight: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center" }}>
                  <div style={{ width: 60, height: 60, borderRadius: 8, background: "var(--green2)", border: "1px solid rgba(0,255,157,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 0 20px rgba(0,255,157,.2)" }}>✓</div>
                  <div style={{ fontFamily: "var(--f-hud)", fontSize: 22, fontWeight: 800, color: "var(--green)", letterSpacing: ".1em" }}>TRANSMISSION SENT</div>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--text2)", lineHeight: 1.7, maxWidth: 260 }}>
                    Message received from {form.name.split(" ")[0].toUpperCase()}.<br />Response within 24H.
                  </div>
                  <button className="btn-outline" onClick={() => { setSent(false); setForm({ name: "", email: "", company: "", type: "Full-time Role", msg: "" }); }}>
                    SEND ANOTHER ▶
                  </button>
                </div>
              ) : (
                <>
                  <div className="form-panel-title">NEW MESSAGE</div>
                  <div className="form-panel-sub">TRANSMIT YOUR REQUEST // RESPONSE &lt; 24H</div>
                  <div className="form-row">
                    <div className="fg"><label className="fl">Name</label><input className="fi" placeholder="Jane Smith" value={form.name} onChange={e => set("name", e.target.value)} /></div>
                    <div className="fg"><label className="fl">Email</label><input className="fi" placeholder="jane@co.com" value={form.email} onChange={e => set("email", e.target.value)} /></div>
                    <div className="fg"><label className="fl">Company</label><input className="fi" placeholder="Acme Corp" value={form.company} onChange={e => set("company", e.target.value)} /></div>
                    <div className="fg">
                      <label className="fl">Type</label>
                      <select className="fi" value={form.type} onChange={e => set("type", e.target.value)}>
                        <option>Full-time Role</option><option>Contract / Freelance</option><option>Consultation</option><option>Collaboration</option>
                      </select>
                    </div>
                  </div>
                  <div className="fg" style={{ marginBottom: 16 }}>
                    <label className="fl">Message</label>
                    <textarea className="fi" rows={4} placeholder="Describe your project or role…" value={form.msg}
                      onChange={e => set("msg", e.target.value)} style={{ resize: "none", lineHeight: 1.6 }} />
                  </div>
                  <button className="f-sub" onClick={submit}>TRANSMIT MESSAGE ▶</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════ */
function Footer() {
  return (
    <footer>
      <div className="footer-logo">DS·2025</div>
      <div className="footer-copy">© 2025 DAKSH SAWANT // ALL SYSTEMS NOMINAL</div>
      <div className="footer-links" style={{ display: "flex", gap: 16 }}>
        {[["EMAIL", "mailto:daksh.s.1808@gmail.com"], ["LINKEDIN", "https://www.linkedin.com/in/daksh-sawant-622920236?utm_source=share_via&utm_content=profile&utm_medium=member_android"], ["RESEARCH", "http://www.ijrar.org/papers/IJRAR23C1417.pdf"]].map(([l, h]) => (
          <a key={l} href={h} target="_blank" rel="noreferrer" className="footer-link">{l}</a>
        ))}
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function App() {
  const activeSection = useActiveSection();

  useEffect(() => {
    const id = "daksh-global-css";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <>
      <Cursor />
      <div className="grid-bg" />
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="hex-watermark">⬡</div>
      <Navbar active={activeSection} />
      <main>
        <HeroSection />
        <Divider />
        <ProjectsSection />
        <Divider />
        <ExperienceSection />
        <Divider />
        <SkillsSection />
        <Divider />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
