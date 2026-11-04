import {
  interpolateBowlKeys,
  pointToSegmentDistance,
  computeLetterProgress,
  calculateLetterState,
  hexToRgb,
  smoothstep,
  clamp,
} from './utils/glow-math';
import { initChatbot } from './chatbot';
import { initPageMenu } from './menu';

interface CharItem {
  span: HTMLElement;
  isHl: boolean;
}

// Brand gradient used by the .hl class in the stylesheet; the split has to
// reproduce it per glyph, because the original wrapper element is discarded.
const HIGHLIGHT_GRADIENT = 'linear-gradient(135deg, #00d4ff 0%, #0070f3 50%, #84cc16 100%)';

function splitTextIntoChars(el: HTMLElement): CharItem[] {
  const originalNodes = Array.from(el.childNodes);
  el.innerHTML = '';
  const result: CharItem[] = [];

  function processNode(node: Node, insideHl: boolean) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      const parts = text.split(/(\s+)/);
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          el.appendChild(document.createTextNode(part));
        } else {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';

          for (let i = 0; i < part.length; i++) {
            const ch = part[i];
            const charSpan = document.createElement('span');
            charSpan.textContent = ch;
            charSpan.style.display = 'inline-block';
            charSpan.style.willChange = 'opacity, filter, color';
            wordSpan.appendChild(charSpan);
            result.push({ span: charSpan, isHl: insideHl });
          }
          el.appendChild(wordSpan);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const elem = node as HTMLElement;
      if (elem.tagName.toLowerCase() === 'br') {
        el.appendChild(document.createElement('br'));
      } else {
        const isHl = insideHl || elem.classList.contains('hl');
        Array.from(elem.childNodes).forEach(child => processNode(child, isHl));
      }
    }
  }

  originalNodes.forEach(node => processNode(node, false));

  // Give every highlighted glyph one slice of a single gradient stretched over
  // the whole run, so the colour flows across the phrase (left to right)
  // instead of restarting inside each letter.
  const highlights = result.filter(item => item.isHl);
  const total = highlights.length;

  highlights.forEach((item, index) => {
    const { style } = item.span;
    style.backgroundImage = HIGHLIGHT_GRADIENT;
    style.backgroundSize = `${total * 100}% 100%`;
    style.backgroundRepeat = 'no-repeat';
    style.backgroundPosition = total > 1 ? `${(index / (total - 1)) * 100}% 0` : '0 0';
    style.backgroundClip = 'text';
    style.setProperty('-webkit-background-clip', 'text');
    style.setProperty('-webkit-text-fill-color', 'transparent');
  });

  return result;
}

function paint(
  chars: CharItem[],
  p: number,
  spread: number,
  finalHex: string,
  accentHex: string,
  ghostHex: string
) {
  const n = chars.length;
  const ghost = hexToRgb(ghostHex);
  const accent = hexToRgb(accentHex);
  const finalDef = hexToRgb(finalHex);
  const hlColor = hexToRgb('#0070f3');

  for (let i = 0; i < n; i++) {
    const item = chars[i];
    const t = computeLetterProgress(p, i, n, spread);
    const final = item.isHl ? hlColor : finalDef;
    const style = calculateLetterState(t, ghost, accent, final);

    item.span.style.opacity = style.opacity.toString();
    item.span.style.color = style.color;
    item.span.style.filter = style.blur > 0 ? `blur(${style.blur.toFixed(2)}px)` : 'none';
  }
}

// Elements
const canvas = document.getElementById('bg') as HTMLCanvasElement;
const ctx = canvas?.getContext('2d', { willReadFrequently: false });
const nav = document.getElementById('nav') as HTMLElement;
const h1El = document.getElementById('h1') as HTMLElement;
const stmtEl = document.getElementById('stmt') as HTMLElement;
const h2El = document.getElementById('h2') as HTMLElement;
const rowEl = document.getElementById('row') as HTMLElement;
const splitEl = document.getElementById('split') as HTMLElement;
const shipEl = document.getElementById('ship') as HTMLElement;

// Section titles for letter-by-letter reveal
const hSolutionsEl = document.getElementById('h-solutions') as HTMLElement;
const hCompanyEl = document.getElementById('h-company') as HTMLElement;
const hSecurityEl = document.getElementById('h-security') as HTMLElement;
const hDemoEl = document.getElementById('h-demo') as HTMLElement;

let h1Chars: CharItem[] = [];
let stmtChars: CharItem[] = [];
let h2Chars: CharItem[] = [];
let hSolutionsChars: CharItem[] = [];
let hCompanyChars: CharItem[] = [];
let hSecurityChars: CharItem[] = [];
let hDemoChars: CharItem[] = [];

if (h1El) h1Chars = splitTextIntoChars(h1El);
if (stmtEl) stmtChars = splitTextIntoChars(stmtEl);
if (h2El) h2Chars = splitTextIntoChars(h2El);
if (hSolutionsEl) hSolutionsChars = splitTextIntoChars(hSolutionsEl);
if (hCompanyEl) hCompanyChars = splitTextIntoChars(hCompanyEl);
if (hSecurityEl) hSecurityChars = splitTextIntoChars(hSecurityEl);
if (hDemoEl) hDemoChars = splitTextIntoChars(hDemoEl);

// Paint all initially at p = 0 with logo-matched electric cyan accent
paint(h1Chars, 0, 0.35, '#0b1d3a', '#00d4ff', '#ffffff');
paint(stmtChars, 0, 0.16, '#0b1d3a', '#00d4ff', '#ffffff');
paint(h2Chars, 0, 0.35, '#ffffff', '#00e5ff', '#5c6f92');
paint(hSolutionsChars, 0, 0.35, '#0b1d3a', '#00d4ff', '#ffffff');
paint(hCompanyChars, 0, 0.35, '#0b1d3a', '#00d4ff', '#ffffff');
paint(hSecurityChars, 0, 0.35, '#0b1d3a', '#00d4ff', '#ffffff');
paint(hDemoChars, 0, 0.35, '#0b1d3a', '#00d4ff', '#ffffff');

// Bowl Glow state
let curTip = -0.3;
let curHalf = 0.3;
let curSoft = 0.1;
let tgtTip = 0.30;
let tgtHalf = 0.34;
let tgtSoft = 0.22;

const startTime = performance.now();
let introFinished = false;

// Scroll state cache
let scrollY = window.scrollY || window.pageYOffset || 0;
let innerH = window.innerHeight || 800;
let innerW = window.innerWidth || 1200;

function updateScrollState() {
  scrollY = window.scrollY || window.pageYOffset || 0;
  innerH = window.innerHeight || 800;
  innerW = window.innerWidth || 1200;

  const q = scrollY / innerH;
  const interp = interpolateBowlKeys(q);
  tgtTip = interp.tip;
  tgtHalf = interp.half;
  tgtSoft = interp.soft;

  // Statement rise: s = clamp((q - .69) / .74)
  // translateY = 0.205 * (1 - s)^2 * innerHeight
  if (stmtEl) {
    const s = clamp((q - 0.69) / 0.74, 0, 1);
    const riseY = 0.205 * Math.pow(1 - s, 2) * innerH;
    stmtEl.style.transform = `translateY(${riseY.toFixed(2)}px)`;

    // Statement reveal: p = clamp((q - .56) / 2.03)
    const pStmt = clamp((q - 0.56) / 2.03, 0, 1);
    paint(stmtChars, pStmt, 0.16, '#0b1d3a', '#00d4ff', '#ffffff');

    // Nav CTA toggle when p > 0.4
    if (nav) {
      if (pStmt > 0.4) {
        nav.classList.add('on');
      } else {
        nav.classList.remove('on');
      }
    }
  }

  // Dark Split headline and row
  if (splitEl) {
    const splitRect = splitEl.getBoundingClientRect();
    const splitTop = splitRect.top;

    // p2 = clamp((.8 - splitTop/innerHeight)/.65)
    const p2 = clamp((0.8 - splitTop / innerH) / 0.65, 0, 1);
    paint(h2Chars, p2, 0.35, '#ffffff', '#00e5ff', '#5c6f92');

    // Row: visible once p2 > 0.92, back again when <= 0.92
    if (rowEl) {
      if (p2 > 0.92) {
        rowEl.classList.add('show');
      } else {
        rowEl.classList.remove('show');
      }
    }

    // Ship scale: 1.08 - 0.08 * clamp(1 - splitTop/innerHeight)
    if (shipEl) {
      const arriveProgress = clamp(1 - splitTop / innerH, 0, 1);
      const shipScale = 1.08 - 0.08 * arriveProgress;
      shipEl.style.transform = `scale(${shipScale.toFixed(4)})`;
    }
  }

  // Letter-by-letter reveal for newly added section titles matching hero aesthetic
  function updateSectionHeading(el: HTMLElement | null, chars: CharItem[]) {
    if (!el || chars.length === 0) return;
    const rect = el.getBoundingClientRect();
    const p = clamp((0.88 - rect.top / innerH) / 0.44, 0, 1);
    paint(chars, p, 0.35, '#0b1d3a', '#00d4ff', '#ffffff');
  }

  updateSectionHeading(hSolutionsEl, hSolutionsChars);
  updateSectionHeading(hCompanyEl, hCompanyChars);
  updateSectionHeading(hSecurityEl, hSecurityChars);
  updateSectionHeading(hDemoEl, hDemoChars);

}

window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', updateScrollState, { passive: true });

// Preallocated canvas imageData buffer (96x60x4 = 23040 bytes)
const imgData = ctx?.createImageData(96, 60);
const imgPixels = imgData?.data;
const pts: { x: number; y: number }[] = new Array(48);
for (let i = 0; i < 48; i++) {
  pts[i] = { x: 0, y: 0 };
}

function renderCanvas(now: number) {
  if (!ctx || !imgPixels || !imgData) return;

  const elapsed = (now - startTime) / 1000;

  // Intro interpolation
  if (!introFinished) {
    if (elapsed < 0.25) {
      curTip = -0.3;
      curHalf = 0.3;
      curSoft = 0.1;
    } else if (elapsed < 1.30) {
      const introProgress = (elapsed - 0.25) / 1.05;
      const easeP = smoothstep(introProgress);
      curTip = -0.3 + (tgtTip - (-0.3)) * easeP;
      curHalf = 0.3 + (tgtHalf - 0.3) * easeP;
      curSoft = 0.1 + (tgtSoft - 0.1) * easeP;
    } else {
      introFinished = true;
    }
  } else {
    // Normal chasing loop with 0.12 inertia
    curTip += (tgtTip - curTip) * 0.12;
    curHalf += (tgtHalf - curHalf) * 0.12;
    curSoft += (tgtSoft - curSoft) * 0.12;
  }

  // Hero headline reveal: time-based p from 0 to 1 over 1.25s from load
  const h1Progress = clamp(elapsed / 1.25, 0, 1);
  paint(h1Chars, h1Progress, 0.35, '#0b1d3a', '#00d4ff', '#ffffff');

  // Idle drift breathing wobble
  const driftTip = curTip + Math.sin(now * 0.00033 + 1.3) * 0.02;
  const driftHalf = curHalf + Math.sin(now * 0.0005) * 0.015;
  const activeSoft = Math.max(0.01, curSoft);

  const aspect = innerW / innerH;

  // Build edge curve from 48 points with yy running from -0.3 to driftTip
  const safeTip = Math.max(0.001, driftTip);
  for (let k = 0; k < 48; k++) {
    const yy = -0.3 + (driftTip - (-0.3)) * (k / 47);
    const ratio = Math.max(0, 1 - yy / safeTip);
    const cx = driftHalf * aspect * Math.pow(ratio, 0.72);
    pts[k].x = cx;
    pts[k].y = yy;
  }

  // Fast symmetric rasterization (48 x 60 = 2880 pixels calculated, mirrored to 96x60)
  for (let y = 0; y < 60; y++) {
    const py = (y + 0.5) / 60;
    const canBeInside = py < driftTip && driftTip > 0;
    const boundX = canBeInside ? driftHalf * aspect * Math.pow(Math.max(0, 1 - py / safeTip), 0.72) : -1;

    for (let x = 0; x < 48; x++) {
      const px = Math.abs((x + 0.5) / 96 - 0.5) * aspect;

      // Distance to nearest polyline segment
      let minD = 9999;
      for (let s = 0; s < 47; s++) {
        const d = pointToSegmentDistance(px, py, pts[s].x, pts[s].y, pts[s + 1].x, pts[s + 1].y);
        if (d < minD) minD = d;
      }

      let sd = minD;
      if (canBeInside && px < boundX) {
        sd = -minD;
      }
      sd -= 0.25; // Round the bottom (RND = 0.25)

      // g = 1 - smoothstep((sd + soft) / (2 * soft))
      const u = clamp((sd + activeSoft) / (2 * activeSoft), 0, 1);
      const g = 1 - (u * u * (3 - 2 * u));

      let r: number, gr: number, b: number;
      if (g < 0.38) {
        const sg = smoothstep(g / 0.38);
        r = Math.round(255 + (205 - 255) * sg);
        gr = Math.round(255 + (230 - 255) * sg);
        b = 255;
      } else {
        const sg = smoothstep((g - 0.38) / 0.62);
        r = Math.round(205 + (90 - 205) * sg);
        gr = Math.round(230 + (215 - 230) * sg);
        b = Math.round(255 + (250 - 255) * sg);
      }

      // Left pixel
      const idx1 = (y * 96 + x) * 4;
      imgPixels[idx1] = r;
      imgPixels[idx1 + 1] = gr;
      imgPixels[idx1 + 2] = b;
      imgPixels[idx1 + 3] = 255;

      // Right mirrored pixel
      const mirrorX = 95 - x;
      const idx2 = (y * 96 + mirrorX) * 4;
      imgPixels[idx2] = r;
      imgPixels[idx2 + 1] = gr;
      imgPixels[idx2 + 2] = b;
      imgPixels[idx2 + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  requestAnimationFrame(renderCanvas);
}

// Start sequence on first animation frame
requestAnimationFrame((now) => {
  document.body.classList.add('ready');
  updateScrollState();
  requestAnimationFrame(renderCanvas);
});

// ========================================================
// IntersectionObserver: Scroll-triggered element entrance animations
// ========================================================
function setupIntersectionObserver() {
  const revealCards = document.querySelectorAll<HTMLElement>('.reveal-card');
  if (!revealCards.length) return;

  if (typeof IntersectionObserver !== 'undefined') {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1,
      }
    );

    revealCards.forEach((card) => {
      // If already in viewport on load, reveal immediately
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        card.classList.add('in-view');
      } else {
        revealObserver.observe(card);
      }
    });
  } else {
    revealCards.forEach((card) => card.classList.add('in-view'));
  }
}

// Initialize observer
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupIntersectionObserver);
} else {
  setupIntersectionObserver();
}


// ========================================================
// Digirfu Growth & ROI Calculator + Forms
// ========================================================

// 1. Discovery Call Form submission
const trialForm = document.getElementById('trial-form') as HTMLFormElement;
const formSuccess = document.getElementById('form-success') as HTMLElement;

if (trialForm) {
  trialForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = trialForm.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      const lbl = btn.querySelector('.form-btn-lbl');
      if (lbl) lbl.textContent = 'Connecting with Digirfu Agent...';
    }

    setTimeout(() => {
      if (formSuccess) formSuccess.style.display = 'block';
      if (btn) btn.style.display = 'none';
      trialForm.reset();
    }, 800);
  });
}

// ========================================================
// Floating AI assistant
// ========================================================
initChatbot();

// ========================================================
// Page menu (mobile & tablet only)
// ========================================================
initPageMenu();
