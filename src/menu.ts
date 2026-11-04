/**
 * Mobile / tablet page menu.
 *
 * The fixed pill nav hides its links below 960px, so phones and tablets get a
 * floating circular button in the bottom-left corner that opens the page list.
 * CSS hides the control entirely above that breakpoint, which makes it safe to
 * wire on every page.
 */
export function initPageMenu(): void {
  const root = document.getElementById('dgi-menu');
  const fab = document.getElementById('dgi-menu-fab');
  const panel = document.getElementById('dgi-menu-panel');

  if (!root || !fab || !panel) return;

  const setOpen = (open: boolean): void => {
    root.dataset.open = open ? 'true' : 'false';
    panel.hidden = !open;
    fab.setAttribute('aria-expanded', open ? 'true' : 'false');
    fab.setAttribute('aria-label', open ? 'Close page menu' : 'Open page menu');
  };

  fab.addEventListener('click', () => setOpen(root.dataset.open !== 'true'));

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  // Tapping anywhere outside the control dismisses it.
  document.addEventListener('click', (event) => {
    if (root.dataset.open !== 'true') return;
    const target = event.target as Node | null;
    if (target && !root.contains(target)) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || root.dataset.open !== 'true') return;
    setOpen(false);
    fab.focus();
  });

  // Crossing back to the desktop layout removes the button, so close first.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 960 && root.dataset.open === 'true') setOpen(false);
  });
}
