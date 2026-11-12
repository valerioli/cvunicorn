import { NextRequest, NextResponse } from "next/server";
import {
  caseStudySites,
  siteStyleOptions,
  type GeneratedCaseSite,
  type SiteStyleOption,
} from "@/content/showcase";

export const dynamic = "force-dynamic";

type Lang = "en" | "zh";
type StyleId = SiteStyleOption["id"];

function text(value: { en: string; zh: string }, lang: Lang) {
  return value[lang];
}

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function validStyle(value: string | null, fallback: StyleId): StyleId {
  return siteStyleOptions.some((style) => style.id === value) ? (value as StyleId) : fallback;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

function renderDemo(site: GeneratedCaseSite, lang: Lang, styleId: StyleId) {
  if (styleId === "mercury") {
    return `
      <div class="demo demo-ledger" aria-label="${lang === "zh" ? "金融数据动效 demo" : "Animated finance demo"}">
        <div class="ledger-head">
          <span>${lang === "zh" ? "Runway model" : "Runway model"}</span>
          <strong>${esc(text(site.metric, lang))}</strong>
        </div>
        <div class="bars">
          ${[54, 72, 61, 88, 76, 94, 68, 83].map((height, index) => `<i style="--h:${height}%;--d:${index * 90}ms"></i>`).join("")}
        </div>
        <div class="ledger-lines">
          <span></span><span></span><span></span><span></span>
        </div>
      </div>`;
  }

  if (styleId === "resend") {
    return `
      <div class="demo demo-flow" aria-label="${lang === "zh" ? "产品设计动效 demo" : "Animated product design demo"}">
        <div class="flow-card active"><b>01</b><span>${lang === "zh" ? "Intake" : "Intake"}</span></div>
        <div class="flow-card"><b>02</b><span>${lang === "zh" ? "Triage" : "Triage"}</span></div>
        <div class="flow-card active delay"><b>03</b><span>${lang === "zh" ? "Review" : "Review"}</span></div>
        <div class="pulse-line"></div>
      </div>`;
  }

  if (styleId === "active") {
    return `
      <div class="demo demo-radar" aria-label="${lang === "zh" ? "机器人动效 demo" : "Animated robotics demo"}">
        <div class="radar">
          <span class="beam"></span>
          <i style="--x:22%;--y:58%"></i>
          <i style="--x:62%;--y:30%"></i>
          <i style="--x:74%;--y:70%"></i>
        </div>
        <div class="robot-path">
          <span></span><span></span><span></span><span></span>
        </div>
      </div>`;
  }

  if (styleId === "notion") {
    return `
      <div class="demo demo-doc" aria-label="${lang === "zh" ? "工作区文档 demo" : "Workspace document demo"}">
        <div class="doc-title"></div>
        <div class="doc-row wide"></div>
        <div class="doc-row"></div>
        <div class="doc-grid"><span></span><span></span><span></span><span></span></div>
      </div>`;
  }

  return `
    <div class="demo demo-editorial" aria-label="${lang === "zh" ? "杂志式作品 demo" : "Editorial work demo"}">
      <div class="poster one">${esc(initials(site.name))}</div>
      <div class="poster two">${esc(site.site.stats[0].value)}</div>
      <div class="poster three">${esc(text(site.sections[0], lang))}</div>
    </div>`;
}

function renderWorkVisual(index: number, styleId: StyleId) {
  if (styleId === "mercury") {
    return `<div class="work-visual ledger-mini"><i></i><i></i><i></i><i></i><span></span></div>`;
  }
  if (styleId === "resend") {
    return `<div class="work-visual product-mini"><i></i><i></i><i></i><span>${String(index + 1).padStart(2, "0")}</span></div>`;
  }
  if (styleId === "active") {
    return `<div class="work-visual kinetic-mini"><i></i><i></i><i></i><span></span></div>`;
  }
  if (styleId === "notion") {
    return `<div class="work-visual doc-mini"><i></i><i></i><i></i><span></span></div>`;
  }
  return `<div class="work-visual editorial-mini"><i>${String(index + 1).padStart(2, "0")}</i><span></span></div>`;
}

function renderSite(site: GeneratedCaseSite, lang: Lang, styleId: StyleId, origin: string) {
  const style = siteStyleOptions.find((item) => item.id === styleId)!;
  const heroImage = site.heroImage
    ? site.heroImage.startsWith("/")
      ? `${origin}${site.heroImage}`
      : site.heroImage
    : "";
  const stats = site.site.stats
    .map(
      (stat) => `
        <div class="stat">
          <strong>${esc(stat.value)}</strong>
          <span>${esc(text(stat.label, lang))}</span>
        </div>
      `,
    )
    .join("");

  const works = site.site.works
    .map(
      (work, index) => `
        <article class="work-card">
          <div class="work-index">${String(index + 1).padStart(2, "0")}</div>
          <div>
            <p>${esc(text(work.meta, lang))}</p>
            <h2>${esc(text(work.title, lang))}</h2>
            <span>${esc(text(work.body, lang))}</span>
          </div>
          ${renderWorkVisual(index, styleId)}
        </article>
      `,
    )
    .join("");

  const chapters = site.site.chapters
    .map(
      (chapter) => `
        <li>
          <b>${esc(text(chapter.title, lang))}</b>
          <span>${esc(text(chapter.body, lang))}</span>
        </li>
      `,
    )
    .join("");

  const proof = site.site.proof
    .map((item) => `<li>${esc(text(item, lang))}</li>`)
    .join("");

  return `<!doctype html>
<html lang="${lang === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(site.name)} · ${esc(style.name)}</title>
  <style>
    :root {
      --bg: #f3f0e8;
      --panel: #fffaf0;
      --ink: #15130e;
      --muted: #746d5f;
      --line: #15130e;
      --accent: #cdf24a;
      --hot: #e8442a;
      --soft: #ece6d8;
      --shadow: 8px 8px 0 var(--ink);
      --radius: 8px;
      --mono: "JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
      --serif: Fraunces, Georgia, "Times New Roman", serif;
      --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .theme-resend {
      --bg: #000000;
      --panel: #080808;
      --ink: #f8f8f6;
      --muted: #9b9b95;
      --line: #2a2a2a;
      --accent: #9281f7;
      --hot: #9281f7;
      --soft: #111111;
      --shadow: none;
      --radius: 6px;
      --serif: Georgia, "Times New Roman", serif;
    }
    .theme-mercury {
      --bg: #f2f7fb;
      --panel: #ffffff;
      --ink: #10243e;
      --muted: #607086;
      --line: #cddbe8;
      --accent: #2864ff;
      --hot: #0d8f6f;
      --soft: #e5eef7;
      --shadow: none;
      --radius: 14px;
      --serif: "Times New Roman", Georgia, serif;
    }
    .theme-notion {
      --bg: #fbfaf7;
      --panel: #ffffff;
      --ink: #1f1f1d;
      --muted: #787267;
      --line: #d8d2c4;
      --accent: #2f6fed;
      --hot: #d65a31;
      --soft: #f1eee7;
      --shadow: 0 18px 50px rgba(31,31,29,.08);
      --radius: 8px;
      --serif: ui-serif, Georgia, serif;
    }
    .theme-active {
      --bg: #080512;
      --panel: rgba(16,10,42,.68);
      --ink: #f8f7ff;
      --muted: #b2a9d0;
      --line: rgba(194,180,255,.3);
      --accent: #7c3cff;
      --hot: #00e5ff;
      --soft: rgba(124,60,255,.16);
      --shadow: none;
      --radius: 22px;
      --serif: Inter, ui-sans-serif, system-ui, sans-serif;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: var(--mono);
      font-size: 15px;
      -webkit-font-smoothing: antialiased;
    }
    .site {
      min-height: 100vh;
      overflow: hidden;
      color: var(--ink);
      background:
        linear-gradient(90deg, color-mix(in oklab, var(--line) 10%, transparent) 1px, transparent 1px),
        linear-gradient(180deg, color-mix(in oklab, var(--line) 10%, transparent) 1px, transparent 1px),
        var(--bg);
      background-size: 64px 64px;
    }
    .site.theme-resend { background: #000; }
    .site.theme-mercury {
      background:
        linear-gradient(90deg, rgba(16,36,62,.06) 1px, transparent 1px),
        linear-gradient(180deg, rgba(16,36,62,.06) 1px, transparent 1px),
        linear-gradient(180deg, #fbfdff 0%, #eef6fb 56%, #f5f9fc 100%);
      background-size: 52px 52px, 52px 52px, auto;
      font-family: var(--sans);
    }
    .site.theme-active {
      position: relative;
      background:
        radial-gradient(circle at 73% 18%, rgba(0,229,255,.24), transparent 22%),
        radial-gradient(circle at 16% 78%, rgba(124,60,255,.35), transparent 28%),
        linear-gradient(140deg, #080512 0%, #15102f 46%, #030207 100%);
      font-family: var(--sans);
    }
    .site.theme-active::before {
      content: "";
      position: fixed;
      inset: -18%;
      z-index: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 50% 42%, rgba(124,60,255,.64), transparent 7%),
        radial-gradient(circle at 48% 40%, rgba(0,229,255,.24), transparent 2%),
        radial-gradient(circle at 68% 24%, rgba(255,255,255,.13), transparent 1.5%),
        radial-gradient(circle at 26% 70%, rgba(0,229,255,.1), transparent 1.2%);
      filter: blur(.2px);
      animation: voiddrift 12s ease-in-out infinite alternate;
    }
    .site.theme-active > * { position: relative; z-index: 1; }
    @keyframes voiddrift { to { transform: translate3d(-2%, 1%, 0) scale(1.04); opacity: .78; } }
    .wrap { max-width: 1180px; margin: 0 auto; padding-left: 28px; padding-right: 28px; }
    header {
      position: sticky;
      top: 0;
      z-index: 20;
      border-bottom: 2px solid var(--line);
      background: color-mix(in oklab, var(--bg) 90%, transparent);
      backdrop-filter: blur(14px);
    }
    .topbar {
      display: grid;
      grid-template-columns: 1fr auto auto;
      align-items: center;
      gap: 14px;
      padding-top: 15px;
      padding-bottom: 14px;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0;
    }
    .brand { font-weight: 900; }
    .style {
      border: 2px solid var(--line);
      border-radius: 999px;
      background: var(--accent);
      color: #15130e;
      padding: 7px 10px;
      white-space: nowrap;
    }
    .topbar a, .cta {
      border: 2px solid var(--line);
      border-radius: 999px;
      color: var(--ink);
      background: var(--panel);
      padding: 9px 12px;
      text-decoration: none;
      white-space: nowrap;
      transition: transform .2s ease, background .2s ease;
    }
    .topbar a:hover, .cta:hover { transform: translateY(-2px); background: var(--accent); color: #15130e; }
    .theme-resend .topbar a, .theme-resend .cta,
    .theme-active .topbar a, .theme-active .cta {
      background: var(--ink);
      border-color: var(--ink);
      color: var(--bg);
      font-weight: 800;
    }
    .theme-resend .topbar a:hover, .theme-resend .cta:hover,
    .theme-active .topbar a:hover, .theme-active .cta:hover {
      background: var(--accent);
      color: #050505;
    }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(340px, .95fr);
      gap: 34px;
      align-items: end;
      padding-top: 54px;
      padding-bottom: 42px;
    }
    .hero-copy h1 {
      margin: 0;
      font-family: var(--serif);
      font-size: clamp(58px, 11vw, 148px);
      line-height: .84;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .theme-resend .hero-copy h1, .theme-active .hero-copy h1 { text-transform: none; font-weight: 760; }
    .role {
      margin-top: 20px;
      color: var(--hot);
      font-weight: 850;
      text-transform: uppercase;
      letter-spacing: 0;
    }
    .lead {
      display: grid;
      grid-template-columns: .82fr 1.18fr;
      gap: 22px;
      margin-top: 24px;
      border-left: 10px solid var(--accent);
      padding-left: 18px;
    }
    .lead p, .lead small { margin: 0; }
    .lead p {
      font-family: var(--sans);
      font-size: clamp(19px, 2.3vw, 30px);
      line-height: 1.12;
      letter-spacing: 0;
    }
    .lead small { color: var(--muted); line-height: 1.58; }
    .photo {
      position: relative;
      min-height: 560px;
      border: 3px solid var(--line);
      border-radius: var(--radius);
      overflow: hidden;
      background: var(--soft);
      box-shadow: var(--shadow);
      isolation: isolate;
    }
    .photo img {
      width: 100%;
      height: 100%;
      min-height: 560px;
      object-fit: cover;
      display: block;
      filter: saturate(1.04) contrast(1.02);
    }
    .photo::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, transparent 44%, color-mix(in oklab, var(--bg) 45%, transparent)),
        repeating-linear-gradient(90deg, transparent 0 26px, color-mix(in oklab, var(--accent) 18%, transparent) 26px 27px);
      mix-blend-mode: screen;
      pointer-events: none;
    }
    .fallback-photo {
      display: grid;
      place-items: center;
      min-height: 560px;
      font-family: var(--serif);
      font-size: 110px;
      background: linear-gradient(135deg, var(--accent), var(--panel) 52%, var(--hot));
      color: #15130e;
    }
    .ticker {
      border-block: 2px solid var(--line);
      overflow: hidden;
      background: var(--ink);
      color: var(--bg);
      white-space: nowrap;
    }
    .ticker div { width: max-content; padding: 12px 0; animation: ticker 24s linear infinite; }
    .ticker span { margin-right: 30px; color: var(--accent); }
    @keyframes ticker { to { transform: translateX(-50%); } }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding-top: 34px;
    }
    .stat {
      border: 2px solid var(--line);
      border-left: 0;
      background: color-mix(in oklab, var(--panel) 88%, transparent);
      padding: 24px 22px;
    }
    .stat:first-child { border-left: 2px solid var(--line); }
    .stat strong {
      display: block;
      font-family: var(--serif);
      font-size: clamp(42px, 7vw, 86px);
      line-height: .86;
      letter-spacing: 0;
    }
    .stat span { display: block; margin-top: 10px; color: var(--muted); line-height: 1.45; }
    main { padding-top: 48px; padding-bottom: 84px; }
    .section-kicker {
      margin: 0 0 18px;
      color: var(--hot);
      font-size: 12px;
      font-weight: 850;
      text-transform: uppercase;
      letter-spacing: 0;
    }
    .work-layout {
      display: grid;
      grid-template-columns: minmax(0, .92fr) minmax(340px, 1.08fr);
      gap: 22px;
      align-items: stretch;
    }
    .work-list { display: grid; gap: 14px; }
    .work-card {
      display: grid;
      grid-template-columns: 56px minmax(0, 1fr);
      gap: 16px;
      border: 2px solid var(--line);
      border-radius: var(--radius);
      background: var(--panel);
      padding: 20px;
      box-shadow: var(--shadow);
    }
    .theme-resend .work-card {
      border-width: 1px;
      box-shadow: none;
      background: linear-gradient(180deg, #111, #090909);
    }
    .theme-mercury .work-card {
      border: 0;
      background: linear-gradient(180deg, #12243a, #0b1a2b);
    }
    .theme-active .work-card {
      border-color: rgba(182,255,59,.28);
      background: linear-gradient(135deg, rgba(255,61,127,.09), rgba(182,255,59,.04)), #0d0b15;
    }
    .work-index { color: var(--hot); font-weight: 900; }
    .work-card p {
      margin: 0;
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0;
    }
    .work-card h2 {
      margin: 8px 0 9px;
      font-family: var(--serif);
      font-size: clamp(27px, 3vw, 48px);
      line-height: .98;
      letter-spacing: 0;
    }
    .work-card span { color: var(--muted); font-family: var(--sans); line-height: 1.55; }
    .work-visual {
      grid-column: 1 / -1;
      position: relative;
      min-height: 168px;
      overflow: hidden;
      border: 2px solid var(--line);
      border-radius: calc(var(--radius) + 2px);
      background: var(--soft);
    }
    .theme-resend .work-visual { border-width: 1px; border-color: #2d2d2a; background: #050505; }
    .theme-mercury .work-visual { border: 0; background: #07111f; }
    .theme-active .work-visual { border-color: rgba(182,255,59,.34); background: radial-gradient(circle at 68% 20%, rgba(255,61,127,.22), transparent 34%), #050508; }
    .ledger-mini i {
      position: absolute;
      bottom: 22px;
      width: 13%;
      border-radius: 999px 999px 4px 4px;
      background: linear-gradient(180deg, var(--hot), var(--accent));
      animation: bar 1.9s ease-in-out infinite alternate;
    }
    .ledger-mini i:nth-child(1) { left: 14%; height: 52%; }
    .ledger-mini i:nth-child(2) { left: 34%; height: 78%; animation-delay: .18s; }
    .ledger-mini i:nth-child(3) { left: 54%; height: 64%; animation-delay: .36s; }
    .ledger-mini i:nth-child(4) { left: 74%; height: 88%; animation-delay: .54s; }
    .ledger-mini span {
      position: absolute;
      inset: 24px 24px auto;
      height: 1px;
      background: repeating-linear-gradient(90deg, rgba(145,199,255,.6) 0 18px, transparent 18px 30px);
    }
    .product-mini i {
      position: absolute;
      left: 26px;
      right: 26px;
      height: 34px;
      border: 1px solid #343431;
      background: #111;
      animation: floatcard 2.4s ease-in-out infinite alternate;
    }
    .product-mini i:nth-child(1) { top: 28px; }
    .product-mini i:nth-child(2) { top: 68px; animation-delay: .25s; }
    .product-mini i:nth-child(3) { top: 108px; animation-delay: .5s; }
    .product-mini span {
      position: absolute;
      right: 24px;
      bottom: 18px;
      color: #f7f7f5;
      font-size: 52px;
      font-weight: 900;
      opacity: .18;
    }
    .kinetic-mini i {
      position: absolute;
      width: 80px;
      height: 80px;
      border: 1px solid #b6ff3b;
      transform: rotate(45deg);
      animation: kinetic 3s ease-in-out infinite alternate;
    }
    .kinetic-mini i:nth-child(1) { left: 24px; top: 42px; }
    .kinetic-mini i:nth-child(2) { left: 42%; top: 20px; border-color: #ff3d7f; animation-delay: .35s; }
    .kinetic-mini i:nth-child(3) { right: 28px; bottom: 24px; animation-delay: .7s; }
    .kinetic-mini span {
      position: absolute;
      inset: 50% 20px auto;
      height: 2px;
      background: linear-gradient(90deg, transparent, #b6ff3b, #ff3d7f, transparent);
      animation: pulse 1.7s linear infinite;
    }
    @keyframes kinetic { to { transform: translateY(-16px) rotate(135deg) scale(.82); opacity: .55; } }
    .doc-mini { padding: 22px; }
    .doc-mini i {
      display: block;
      height: 14px;
      margin-bottom: 13px;
      border-radius: 5px;
      background: #d8d2c4;
      width: 72%;
    }
    .doc-mini i:nth-child(2) { width: 48%; }
    .doc-mini i:nth-child(3) { width: 88%; }
    .doc-mini span {
      display: block;
      height: 52px;
      border: 1px solid #d8d2c4;
      border-radius: 8px;
      background: #fff;
    }
    .editorial-mini {
      display: grid;
      place-items: center;
      background: var(--accent);
      color: #15130e;
      font-family: var(--serif);
      font-size: 74px;
      font-weight: 900;
    }
    .editorial-mini span {
      position: absolute;
      inset: 18px;
      border: 3px solid #15130e;
      animation: editorial 2.2s ease-in-out infinite alternate;
    }
    .demo {
      position: sticky;
      top: 88px;
      min-height: 520px;
      border: 2px solid var(--line);
      border-radius: var(--radius);
      background: var(--panel);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .demo-ledger { padding: 28px; background: linear-gradient(180deg, #0d1c30, #081524); }
    .ledger-head { display: flex; justify-content: space-between; gap: 20px; color: var(--ink); }
    .ledger-head span { color: var(--muted); }
    .bars { position: absolute; inset: 120px 34px 82px; display: flex; align-items: end; gap: 14px; }
    .bars i {
      flex: 1;
      height: var(--h);
      border-radius: 999px 999px 4px 4px;
      background: linear-gradient(180deg, var(--hot), var(--accent));
      animation: bar 1.8s ease-in-out infinite alternate;
      animation-delay: var(--d);
    }
    @keyframes bar { from { transform: scaleY(.62); opacity: .58; } to { transform: scaleY(1); opacity: 1; } }
    .ledger-lines { position: absolute; inset: auto 28px 28px; display: grid; gap: 10px; }
    .ledger-lines span { height: 12px; border-radius: 999px; background: color-mix(in oklab, var(--accent) 25%, transparent); }
    .demo-flow { padding: 28px; display: grid; place-items: center; background: #080808; }
    .flow-card {
      width: min(360px, 80%);
      border: 1px solid #343431;
      background: #111;
      color: #f7f7f5;
      padding: 18px;
      margin: -10px 0;
      display: flex;
      justify-content: space-between;
      transform: translateX(-16px);
      animation: floatcard 2.4s ease-in-out infinite alternate;
    }
    .flow-card.active { border-color: #f7f7f5; }
    .flow-card.delay { animation-delay: .6s; }
    @keyframes floatcard { to { transform: translateX(20px); } }
    .pulse-line { width: 72%; height: 2px; background: linear-gradient(90deg, transparent, #fff, transparent); animation: pulse 1.8s linear infinite; }
    @keyframes pulse { from { transform: translateX(-40%); opacity: .25; } to { transform: translateX(40%); opacity: 1; } }
    .demo-radar { display: grid; place-items: center; background: radial-gradient(circle, #171025, #050508 70%); }
    .radar {
      position: relative;
      width: min(380px, 76%);
      aspect-ratio: 1;
      border: 1px solid #b6ff3b;
      border-radius: 50%;
      background:
        repeating-radial-gradient(circle, transparent 0 44px, rgba(182,255,59,.16) 45px 46px),
        linear-gradient(90deg, transparent 49.6%, rgba(255,61,127,.55) 50%, transparent 50.4%),
        linear-gradient(0deg, transparent 49.6%, rgba(255,61,127,.55) 50%, transparent 50.4%);
      box-shadow: 0 0 55px rgba(182,255,59,.18);
    }
    .beam {
      position: absolute;
      inset: 50% auto auto 50%;
      width: 48%;
      height: 2px;
      background: linear-gradient(90deg, #b6ff3b, transparent);
      transform-origin: left center;
      animation: sweep 3s linear infinite;
    }
    @keyframes sweep { to { transform: rotate(360deg); } }
    .radar i {
      position: absolute;
      left: var(--x);
      top: var(--y);
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ff3d7f;
      box-shadow: 0 0 18px #ff3d7f;
    }
    .robot-path { position: absolute; bottom: 34px; left: 36px; right: 36px; display: flex; justify-content: space-between; }
    .robot-path span { width: 18px; height: 18px; border: 2px solid #b6ff3b; transform: rotate(45deg); animation: blink 1.4s ease-in-out infinite alternate; }
    @keyframes blink { to { opacity: .22; transform: rotate(45deg) scale(.72); } }
    .demo-doc { padding: 32px; background: #fff; }
    .doc-title { width: 64%; height: 44px; background: #1f1f1d; border-radius: 6px; }
    .doc-row { height: 16px; width: 58%; margin-top: 18px; background: #d8d2c4; border-radius: 4px; }
    .doc-row.wide { width: 86%; }
    .doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 34px; }
    .doc-grid span { height: 126px; border: 1px solid #d8d2c4; border-radius: 8px; animation: doclift 2.2s ease-in-out infinite alternate; }
    @keyframes doclift { to { transform: translateY(-6px); background: #f1eee7; } }
    .demo-editorial { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 16px; background: var(--bg); }
    .poster {
      display: grid;
      place-items: center;
      border: 3px solid var(--line);
      font-family: var(--serif);
      font-size: clamp(30px, 5vw, 72px);
      background: var(--panel);
      min-height: 180px;
      animation: editorial 2.5s ease-in-out infinite alternate;
    }
    .poster.one { background: var(--accent); color: #15130e; grid-row: span 2; }
    .poster.two { background: var(--ink); color: var(--bg); animation-delay: .4s; }
    .poster.three { color: var(--hot); animation-delay: .8s; }
    @keyframes editorial { to { transform: translateY(-8px) rotate(-1deg); } }
    .chapters-proof {
      display: grid;
      grid-template-columns: .9fr 1.1fr;
      gap: 22px;
      margin-top: 46px;
    }
    .chapter-list, .proof, blockquote {
      border: 2px solid var(--line);
      border-radius: var(--radius);
      background: var(--panel);
      box-shadow: var(--shadow);
    }
    .chapter-list { list-style: none; margin: 0; padding: 24px; display: grid; gap: 18px; }
    .chapter-list li b { display: block; font-family: var(--serif); font-size: 28px; line-height: 1; }
    .chapter-list li span { display: block; color: var(--muted); line-height: 1.5; margin-top: 8px; }
    .proof { padding: 24px; }
    .proof ul { margin: 0; padding-left: 18px; color: var(--muted); line-height: 1.58; }
    .proof li + li { margin-top: 10px; }
    blockquote {
      grid-column: 1 / -1;
      margin: 0;
      padding: 28px;
      font-family: var(--serif);
      font-size: clamp(32px, 5vw, 72px);
      line-height: .98;
      letter-spacing: 0;
    }
    footer {
      border-top: 2px solid var(--line);
      padding-top: 28px;
      padding-bottom: 34px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      color: var(--muted);
    }
    footer strong {
      color: var(--ink);
      font-family: var(--serif);
      font-size: clamp(36px, 7vw, 96px);
      line-height: .9;
      letter-spacing: 0;
    }
    .theme-mercury header {
      border-bottom: 1px solid rgba(16,36,62,.14);
      background: rgba(248,251,255,.86);
    }
    .theme-mercury .style {
      border: 1px solid #cddbe8;
      background: #ffffff;
      color: #2864ff;
      border-radius: 40px;
    }
    .theme-mercury .topbar a, .theme-mercury .cta {
      border: 0;
      background: #5266eb;
      color: #fff;
      border-radius: 32px;
      font-weight: 480;
    }
    .theme-mercury .topbar a:hover, .theme-mercury .cta:hover {
      background: #10243e;
      color: #fff;
      transform: translateY(-1px);
    }
    .theme-mercury .hero {
      min-height: 82vh;
      align-items: center;
      gap: 44px;
      padding-top: 72px;
      padding-bottom: 72px;
    }
    .theme-mercury .hero-copy h1 {
      font-size: clamp(54px, 8vw, 104px);
      line-height: .96;
      text-transform: none;
      font-weight: 700;
      color: #10243e;
      font-family: var(--serif);
    }
    .theme-mercury .role {
      color: #0d8f6f;
      font-weight: 800;
    }
    .theme-mercury .lead {
      border-left: 0;
      padding-left: 0;
      grid-template-columns: 1fr;
    }
    .theme-mercury .lead p {
      font-size: clamp(22px, 3vw, 42px);
      line-height: 1.15;
      letter-spacing: .01em;
      color: #10243e;
    }
    .theme-mercury .lead small { color: #607086; }
    .theme-mercury .photo {
      border: 1px solid #cddbe8;
      border-radius: 12px;
      background: #ffffff;
      min-height: 600px;
      box-shadow: none;
    }
    .theme-mercury .photo::after {
      background:
        linear-gradient(180deg, rgba(255,255,255,0) 46%, rgba(242,247,251,.68)),
        linear-gradient(90deg, rgba(40,100,255,.12), transparent 28%, rgba(13,143,111,.1));
      mix-blend-mode: multiply;
    }
    .theme-mercury .stats, .theme-mercury .work-layout, .theme-mercury .chapters-proof {
      gap: 16px;
    }
    .theme-mercury .stat,
    .theme-mercury .work-card,
    .theme-mercury .demo,
    .theme-mercury .chapter-list,
    .theme-mercury .proof,
    .theme-mercury blockquote {
      border: 0;
      border-radius: 12px;
      background: #ffffff;
      box-shadow: none;
      padding: 32px;
      color: #10243e;
    }
    .theme-mercury .stat:first-child { border-left: 0; }
    .theme-mercury .stat strong,
    .theme-mercury .work-card h2,
    .theme-mercury .chapter-list li b,
    .theme-mercury footer strong,
    .theme-mercury blockquote {
      color: #10243e;
      font-weight: 700;
      letter-spacing: .01em;
    }
    .theme-mercury .stat span,
    .theme-mercury .work-card p,
    .theme-mercury .work-card span,
    .theme-mercury .chapter-list li span,
    .theme-mercury .proof ul,
    .theme-mercury footer {
      color: #607086;
    }
    .theme-mercury .work-visual,
    .theme-mercury .demo-ledger {
      border: 1px solid #d7e3ee;
      background: linear-gradient(180deg, #f8fbff, #e8f1f8);
      box-shadow: none;
    }
    .theme-mercury .bars i,
    .theme-mercury .ledger-mini i {
      background: linear-gradient(180deg, #0d8f6f, #2864ff);
    }
    .theme-mercury .ledger-head,
    .theme-mercury .ledger-head strong {
      color: #10243e;
    }

    .theme-resend header {
      border-bottom: 1px solid #2a2a2a;
      background: rgba(0,0,0,.86);
    }
    .theme-resend .style {
      border: 1px solid #2a2a2a;
      background: #080808;
      color: #9281f7;
      border-radius: 16px;
    }
    .theme-resend .topbar a, .theme-resend .cta {
      border: 1px solid #f8f8f6;
      background: #f8f8f6;
      color: #000;
      border-radius: 16px;
      font-weight: 700;
    }
    .theme-resend .topbar a:hover, .theme-resend .cta:hover {
      background: #000;
      color: #f8f8f6;
      transform: translateY(-1px);
    }
    .theme-resend .hero {
      min-height: 76vh;
      align-items: center;
    }
    .theme-resend .hero-copy h1 {
      font-size: clamp(58px, 10vw, 128px);
      line-height: .9;
      font-weight: 500;
      text-transform: none;
      color: #f8f8f6;
    }
    .theme-resend .role {
      color: #9281f7;
      letter-spacing: 0;
    }
    .theme-resend .lead {
      border-left: 0;
      padding-left: 0;
      grid-template-columns: 1fr;
    }
    .theme-resend .lead p,
    .theme-resend .work-card h2,
    .theme-resend .chapter-list li b,
    .theme-resend .stat strong,
    .theme-resend footer strong,
    .theme-resend blockquote {
      color: #f8f8f6;
    }
    .theme-resend .lead small,
    .theme-resend .work-card p,
    .theme-resend .work-card span,
    .theme-resend .chapter-list li span,
    .theme-resend .proof ul,
    .theme-resend footer,
    .theme-resend .stat span {
      color: #9b9b95;
    }
    .theme-resend .photo {
      min-height: 520px;
      border: 1px solid #2a2a2a;
      border-radius: 16px;
      background:
        linear-gradient(135deg, rgba(146,129,247,.09), transparent 34%),
        #050505;
      box-shadow: none;
    }
    .theme-resend .photo img {
      display: block;
      filter: grayscale(1) contrast(1.18) brightness(.9);
      opacity: .9;
      mix-blend-mode: normal;
    }
    .theme-resend .photo::before {
      content: "";
      position: absolute;
      inset: 18px;
      z-index: 2;
      border-radius: 12px;
      background:
        linear-gradient(135deg, rgba(255,255,255,.16), transparent 28%),
        linear-gradient(180deg, transparent 46%, rgba(0,0,0,.58)),
        repeating-linear-gradient(0deg, transparent 0 18px, rgba(255,255,255,.035) 18px 19px);
      border: 1px solid #2a2a2a;
      pointer-events: none;
    }
    .theme-resend .photo::after {
      content: "noah@cvunicorn.com";
      position: absolute;
      z-index: 3;
      bottom: 28px;
      left: 28px;
      color: #9281f7;
      font-family: var(--mono);
      font-size: 12px;
      background: none;
      mix-blend-mode: normal;
    }
    @keyframes cubeturn { to { transform: rotateX(54deg) rotateZ(51deg) translateY(-10px); } }
    .theme-resend .stat,
    .theme-resend .work-card,
    .theme-resend .demo,
    .theme-resend .chapter-list,
    .theme-resend .proof,
    .theme-resend blockquote {
      border: 1px solid #2a2a2a;
      background: #080808;
      box-shadow: none;
    }
    .theme-resend .stat:first-child { border-left: 1px solid #2a2a2a; }
    .theme-resend .work-visual { border: 1px solid #2a2a2a; }
    .theme-resend .product-mini span { color: #9281f7; opacity: .72; }

    .theme-active header {
      border-bottom: 0;
      background: transparent;
    }
    .theme-active .topbar {
      justify-content: end;
      font-size: 10px;
    }
    .theme-active .brand {
      font-weight: 400;
      color: rgba(255,255,255,.74);
    }
    .theme-active .style,
    .theme-active .topbar a,
    .theme-active .cta {
      border: 1px solid rgba(0,229,255,.56);
      border-radius: 5px;
      background: rgba(8,5,18,.68);
      color: #f8f7ff;
      backdrop-filter: blur(4px);
      font-size: 10px;
      font-weight: 400;
      text-transform: uppercase;
    }
    .theme-active .cta {
      border-radius: 500px;
      background: #f8f7ff;
      border-color: #f8f7ff;
      color: #080512;
      padding: 10px 16px;
      font-weight: 800;
    }
    .theme-active .topbar a:hover, .theme-active .cta:hover {
      background: #00e5ff;
      border-color: #00e5ff;
      color: #080512;
      transform: none;
    }
    .theme-active .hero {
      min-height: 88vh;
      align-items: center;
      padding-top: 64px;
      padding-bottom: 48px;
    }
    .theme-active .hero-copy h1 {
      font-size: clamp(54px, 9vw, 132px);
      line-height: .86;
      text-transform: uppercase;
      font-family: Impact, Haettenschweiler, "Arial Narrow Bold", var(--sans);
      font-weight: 900;
      color: #f8f7ff;
    }
    .theme-active .role {
      color: #00e5ff;
      font-size: 10px;
      letter-spacing: 0;
    }
    .theme-active .lead {
      border-left: 0;
      padding-left: 0;
      grid-template-columns: 1fr;
      max-width: 620px;
    }
    .theme-active .lead p {
      font-family: var(--sans);
      font-size: clamp(22px, 3.4vw, 48px);
      line-height: .98;
      color: #f8f7ff;
      font-weight: 850;
    }
    .theme-active .lead small { color: #b2a9d0; }
    .theme-active .photo {
      min-height: 620px;
      border: 1px solid rgba(0,229,255,.28);
      border-radius: 32px;
      background:
        radial-gradient(circle at 52% 38%, rgba(0,229,255,.22), transparent 24%),
        radial-gradient(circle at 42% 62%, rgba(124,60,255,.58), rgba(124,60,255,.18) 34%, transparent 68%),
        #080512;
      box-shadow: none;
    }
    .theme-active .photo img {
      opacity: .86;
      filter: saturate(1.12) contrast(1.08) brightness(.82);
      mix-blend-mode: normal;
    }
    .theme-active .photo::after {
      background:
        linear-gradient(180deg, rgba(8,5,18,0) 34%, rgba(8,5,18,.52)),
        linear-gradient(90deg, rgba(124,60,255,.32), transparent 34%, rgba(0,229,255,.2)),
        radial-gradient(circle, transparent 52%, rgba(8,5,18,.44) 82%);
      mix-blend-mode: normal;
    }
    .theme-active .ticker { display: none; }
    .theme-active .stat,
    .theme-active .work-card,
    .theme-active .demo,
    .theme-active .chapter-list,
    .theme-active .proof,
    .theme-active blockquote {
      border: 1px solid rgba(194,180,255,.22);
      background: rgba(16,10,42,.64);
      box-shadow: none;
      backdrop-filter: blur(4px);
      color: #f8f7ff;
    }
    .theme-active .stat:first-child { border-left: 1px solid rgba(255,255,255,.16); }
    .theme-active .work-card h2,
    .theme-active .chapter-list li b,
    .theme-active .stat strong,
    .theme-active footer strong,
    .theme-active blockquote {
      color: #f8f7ff;
      font-family: Impact, Haettenschweiler, "Arial Narrow Bold", var(--sans);
      font-weight: 900;
      text-transform: uppercase;
    }
    .theme-active .work-card p,
    .theme-active .work-card span,
    .theme-active .chapter-list li span,
    .theme-active .proof ul,
    .theme-active footer,
    .theme-active .stat span {
      color: #b2a9d0;
    }
    .theme-active .work-visual {
      border: 1px solid rgba(0,229,255,.24);
      background:
        radial-gradient(circle at 70% 18%, rgba(0,229,255,.2), transparent 26%),
        rgba(8,5,18,.56);
    }
    .theme-active .demo-radar {
      border: 1px solid rgba(0,229,255,.24);
      background: radial-gradient(circle at 50% 48%, rgba(124,60,255,.82), transparent 34%), #080512;
    }
    .theme-active .radar {
      border-color: rgba(0,229,255,.68);
      background:
        repeating-radial-gradient(circle, transparent 0 44px, rgba(0,229,255,.16) 45px 46px),
        linear-gradient(90deg, transparent 49.6%, rgba(248,247,255,.36) 50%, transparent 50.4%),
        linear-gradient(0deg, transparent 49.6%, rgba(248,247,255,.36) 50%, transparent 50.4%);
      box-shadow: 0 0 60px rgba(0,229,255,.13);
    }
    .theme-active .beam { background: linear-gradient(90deg, #00e5ff, transparent); }
    .theme-active .radar i {
      background: #00e5ff;
      box-shadow: 0 0 22px rgba(0,229,255,.72);
    }
    .theme-active .robot-path span,
    .theme-active .kinetic-mini i {
      border-color: rgba(255,255,255,.72);
    }
    .theme-active .kinetic-mini i:nth-child(2) { border-color: #343755; }
    .theme-active .kinetic-mini span {
      background: linear-gradient(90deg, transparent, #fff, #343755, transparent);
    }
    @media (max-width: 820px) {
      .wrap { padding-left: 18px; padding-right: 18px; }
      .topbar { grid-template-columns: 1fr; }
      .hero, .lead, .work-layout, .chapters-proof { grid-template-columns: 1fr; }
      .photo, .photo img, .fallback-photo { min-height: 380px; }
      .stats { grid-template-columns: 1fr; }
      .stat, .stat:first-child { border-left: 2px solid var(--line); border-top: 0; }
      .demo { position: relative; top: auto; min-height: 430px; }
      footer { display: block; }
      footer .cta { display: inline-flex; margin-top: 18px; }
    }
  </style>
</head>
<body>
  <div class="site theme-${styleId}">
    <header>
      <div class="topbar wrap">
        <div class="brand">${esc(site.name)}</div>
        <div class="style">${esc(style.name)}</div>
        <a href="#contact">${lang === "zh" ? "联系合作" : "Contact"}</a>
      </div>
    </header>
    <section class="hero wrap">
      <div class="hero-copy">
        <h1>${esc(site.name)}</h1>
        <div class="role">${esc(text(site.site.eyebrow, lang))}</div>
        <div class="lead">
          <p>${esc(text(site.site.headline, lang))}</p>
          <small>${esc(text(site.site.subhead, lang))}</small>
        </div>
      </div>
      <div class="photo">
        ${
          heroImage
            ? `<img src="${esc(heroImage)}" alt="${esc(site.name)} ${lang === "zh" ? "虚构案例照片" : "fictional case study portrait"}" />`
            : `<div class="fallback-photo">${esc(initials(site.name))}</div>`
        }
      </div>
    </section>
    <div class="ticker" aria-hidden="true">
      <div><span>${esc(text(site.role, lang))}</span>${esc(text(site.materials, lang))}<span>${esc(text(site.role, lang))}</span>${esc(text(site.materials, lang))}</div>
    </div>
    <section class="stats wrap">${stats}</section>
    <main id="work" class="wrap">
      <p class="section-kicker">${lang === "zh" ? "作品与 demo" : "Selected work and demos"}</p>
      <section class="work-layout">
        <div class="work-list">${works}</div>
        ${renderDemo(site, lang, styleId)}
      </section>
      <section class="chapters-proof">
        <ul class="chapter-list">${chapters}</ul>
        <div class="proof">
          <p class="section-kicker">${lang === "zh" ? "关键证明" : "Selected proof"}</p>
          <ul>${proof}</ul>
        </div>
        <blockquote>${esc(text(site.site.quote, lang))}</blockquote>
      </section>
    </main>
    <footer id="contact" class="wrap">
      <div>
        <span>${lang === "zh" ? "准备好开启对话" : "Ready for the next conversation"}</span>
        <strong>${lang === "zh" ? "示例人物 · 设计演示" : "Illustrative profile · design demo"}</strong>
      </div>
      <a class="cta" href="https://cvunicorn.com/start" target="_blank" rel="noopener">${lang === "zh" ? "创建我的网站" : "Build my own site"}</a>
    </footer>
  </div>
</body>
</html>`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const site = caseStudySites.find((item) => item.slug === slug);
  if (!site) {
    return new NextResponse("Not found", { status: 404 });
  }

  const lang = request.nextUrl.searchParams.get("lang") === "zh" ? "zh" : "en";
  const style = validStyle(request.nextUrl.searchParams.get("style"), site.style);
  const origin = request.nextUrl.origin;

  return new NextResponse(renderSite(site, lang, style, origin), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-robots-tag": "noindex, follow",
    },
  });
}
