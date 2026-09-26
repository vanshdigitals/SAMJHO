/* Tracks whether the user's last input was a pointer or the keyboard, and
   records it on <html data-modality>. The focus-ring rule in tokens.css reads
   it, so a mouse click never leaves a ring behind while keyboard navigation
   always shows one. Registered once, before React mounts. */
export function initModalityTracking() {
  const set = (mode: 'pointer' | 'keyboard') => {
    document.documentElement.dataset.modality = mode;
  };

  set('pointer');

  window.addEventListener('pointerdown', () => set('pointer'), { capture: true });

  window.addEventListener(
    'keydown',
    (e) => {
      /* A bare modifier press is not navigation. */
      if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;
      set('keyboard');
    },
    { capture: true },
  );
}
