(() => {
    'use strict';

    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionToggle = document.querySelector('.motion-toggle');
    const mascot = document.querySelector('.mascot');
    const mascotPosition = document.querySelector('.mascot-position');
    let savedMotion = null;
    try { savedMotion = localStorage.getItem('nettyw-motion'); } catch { /* Storage is optional. */ }
    let motionEnabled = !reducedMotion.matches && savedMotion !== 'off';

    function updateMotion() {
        root.dataset.motion = motionEnabled ? 'on' : 'off';
        motionToggle.setAttribute('aria-pressed', String(!motionEnabled));
        const label = motionEnabled ? 'Приостановить анимацию' : 'Включить анимацию';
        motionToggle.setAttribute('aria-label', label);
        motionToggle.title = label;
        mascotPosition.style.transform = '';
    }
    updateMotion();
    motionToggle.hidden = false;
    motionToggle.addEventListener('click', () => {
        // The system preference always takes precedence over decorative movement.
        if (reducedMotion.matches) {
            showToast('Анимация отключена в настройках устройства.');
            return;
        }
        motionEnabled = !motionEnabled;
        savedMotion = motionEnabled ? 'on' : 'off';
        try { localStorage.setItem('nettyw-motion', savedMotion); } catch { /* Keep the in-session choice. */ }
        updateMotion();
    });
    reducedMotion.addEventListener('change', () => {
        motionEnabled = !reducedMotion.matches && savedMotion !== 'off';
        updateMotion();
    });
    document.addEventListener('visibilitychange', () => {
        root.dataset.suspended = String(document.hidden);
    });

    const universe = document.querySelector('.universe');
    universe.addEventListener('pointermove', (event) => {
        if (!motionEnabled || !finePointer.matches) return;
        const bounds = universe.getBoundingClientRect();
        const x = (event.clientX - bounds.left - bounds.width / 2) * .035;
        const y = (event.clientY - bounds.top - bounds.height / 2) * .035;
        mascotPosition.style.transform = `translate(${x}px, ${y}px)`;
    });
    universe.addEventListener('pointerleave', () => { mascotPosition.style.transform = ''; });

    const toast = document.querySelector('.toast');
    let toastTimeout;
    let greetingTimeout;
    function showToast(message) {
        clearTimeout(toastTimeout);
        toast.textContent = message;
        toast.classList.add('is-visible');
        toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 3200);
    }
    const greetings = ['Космический привет! ✦', 'Мяу. Хорошо, что ты здесь.', 'Ты на своей орбите. Всё в порядке.'];
    let greetingIndex = 0;
    mascot.disabled = false;
    mascot.addEventListener('click', () => {
        showToast(greetings[greetingIndex % greetings.length]);
        greetingIndex += 1;
        clearTimeout(greetingTimeout);
        mascot.classList.add('is-greeting');
        greetingTimeout = setTimeout(() => mascot.classList.remove('is-greeting'), 1000);
    });

    const dialog = document.querySelector('.qr-dialog');
    const qrPreview = document.querySelector('.qr-preview');
    if (typeof dialog.showModal === 'function') {
        qrPreview.disabled = false;
        qrPreview.addEventListener('click', () => dialog.showModal());
        dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
        // Only a press and release outside the panel count as a backdrop click.
        let backdropPress = false;
        const outsidePanel = (event) => {
            const bounds = dialog.getBoundingClientRect();
            return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
        };
        dialog.addEventListener('pointerdown', (event) => { backdropPress = outsidePanel(event); });
        dialog.addEventListener('click', (event) => {
            if (backdropPress && outsidePanel(event)) dialog.close();
            backdropPress = false;
        });
    }
    document.querySelector('#year').textContent = new Date().getFullYear();
})();
