/**
 * Terms & conditions consent gate.
 *
 * The dialog is built here rather than pasted into eight HTML files: every page
 * loads this module through main.ts, so the copy, the version and the storage
 * key have exactly one home. Nothing renders until this runs, which is also why
 * a visitor without JavaScript reads the site ungated instead of meeting a dead
 * overlay.
 */

const STORAGE_KEY = 'dgi-terms-consent';
const TERMS_VERSION = '2026-11-04';
const TERMS_PAGE = 'terms.html';
const CLOSE_MS = 280; // matches the transition in site.css

interface StoredConsent {
  version: string;
  acceptedAt: string;
}

function readConsent(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (typeof parsed.version !== 'string' || typeof parsed.acceptedAt !== 'string') return null;
    return { version: parsed.version, acceptedAt: parsed.acceptedAt };
  } catch {
    // Private mode, disabled storage or corrupt JSON: ask again.
    return null;
  }
}

function storeConsent(): void {
  try {
    const value: StoredConsent = { version: TERMS_VERSION, acceptedAt: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Nothing to do; the gate simply reappears on the next visit.
  }
}

const MARKUP = `
  <div class="dgi-terms-card" role="dialog" aria-modal="true" aria-labelledby="dgi-terms-title" aria-describedby="dgi-terms-copy">
    <p class="dgi-terms-eyebrow"><span class="dgi-terms-dot" aria-hidden="true"></span>Before you continue</p>
    <h2 class="dgi-terms-title" id="dgi-terms-title">Terms &amp; Conditions</h2>
    <p class="dgi-terms-copy" id="dgi-terms-copy">
      Digirfu publishes its terms in plain English. Accept them to carry on, or read the
      full document first — nothing here hides in fine print.
    </p>
    <ul class="dgi-terms-list">
      <li>Published prices are starting points; final scope is agreed in writing.</li>
      <li>Client work stays anonymised until the client signs off on the write-up.</li>
      <li>No tracking cookies are set. Your acceptance is stored in this browser only.</li>
    </ul>
    <div class="dgi-terms-actions">
      <button class="btn dgi-terms-accept" type="button">
        <span>Accept &amp; continue</span>
        <span class="dot" aria-hidden="true">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M4.5 2.5 8 6l-3.5 3.5" fill="none" stroke="#0b1d3a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </button>
      <div class="dgi-terms-meta">
        <a class="dgi-terms-read" href="${TERMS_PAGE}" target="_blank" rel="noopener">Read the full terms</a>
        <button class="dgi-terms-later" type="button">Not now</button>
      </div>
    </div>
  </div>
`;

export function initConsentGate(): void {
  // The terms page itself is never gated: visitors arrive there from this dialog.
  if (window.location.pathname.endsWith(TERMS_PAGE)) return;

  const stored = readConsent();
  if (stored && stored.version === TERMS_VERSION) return;

  const root = document.createElement('div');
  root.className = 'dgi-terms';
  root.id = 'dgi-terms';
  root.dataset.open = 'false';
  root.innerHTML = MARKUP;

  const card = root.querySelector<HTMLElement>('.dgi-terms-card');
  const acceptBtn = root.querySelector<HTMLButtonElement>('.dgi-terms-accept');
  const laterBtn = root.querySelector<HTMLButtonElement>('.dgi-terms-later');
  if (!card || !acceptBtn || !laterBtn) return;

  const previousFocus = document.activeElement as HTMLElement | null;

  const close = (accepted: boolean): void => {
    if (accepted) storeConsent();
    root.dataset.open = 'false';
    document.body.classList.remove('dgi-terms-lock');
    document.removeEventListener('keydown', onKeydown, true);
    window.setTimeout(() => {
      root.remove();
      if (previousFocus && previousFocus !== document.body && document.contains(previousFocus)) {
        previousFocus.focus({ preventScroll: true });
      }
    }, CLOSE_MS);
  };

  // Focus stays inside the card while it is open.
  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close(false);
      return;
    }
    if (event.key !== 'Tab') return;

    const items = Array.from(card.querySelectorAll<HTMLElement>('button, a[href]'));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && (document.activeElement === first || document.activeElement === card)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  acceptBtn.addEventListener('click', () => close(true));
  laterBtn.addEventListener('click', () => close(false));

  // Appended last so the .dgi-chat + .dgi-menu sibling rule keeps working.
  document.body.appendChild(root);
  document.body.classList.add('dgi-terms-lock');
  document.addEventListener('keydown', onKeydown, true);

  window.requestAnimationFrame(() => {
    root.dataset.open = 'true';
    acceptBtn.focus({ preventScroll: true });
  });
}
