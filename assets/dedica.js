/* Dedica finale: polvere d'oro che si raccoglie in una rotta, versi che compaiono uno a uno */
(function () {
  const sec = document.getElementById('dedica'); if (!sec || !window.gsap) return;
  const reduce = window.__reduce;
  const canvas = sec.querySelector('canvas');

  /* ---- Three.js: particelle ---- */
  if (window.THREE && canvas) {
    const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); r.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(45, 2, .1, 50); cam.position.z = 9;
    const N = 2400, start = new Float32Array(N * 3), target = new Float32Array(N * 3), pos = new Float32Array(N * 3), ph = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      // partenza: nube sparsa
      start[i*3] = (Math.random() - .5) * 18; start[i*3+1] = (Math.random() - .5) * 10; start[i*3+2] = (Math.random() - .5) * 6;
      // arrivo: una rotta sinuosa da sinistra a destra, più densa al centro
      const t = Math.random(); const x = -8 + t * 16; const y = Math.sin(t * Math.PI * 1.6) * 1.1 + (Math.random() - .5) * (0.25 + Math.abs(x) * .06);
      target[i*3] = x; target[i*3+1] = y; target[i*3+2] = (Math.random() - .5) * .6;
      ph[i] = Math.random() * 6.28;
    }
    pos.set(start);
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xC9A94F, size: .045, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false });
    scene.add(new THREE.Points(geo, mat));
    const state = { mix: 0 };
    function resize() { const w = sec.clientWidth, h = sec.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
    resize(); addEventListener('resize', resize);
    let t = 0, visible = false;
    ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'bottom top', onToggle: s => visible = s.isActive });
    ScrollTrigger.create({ trigger: sec, start: 'top 70%', once: true, onEnter: () => gsap.to(state, { mix: 1, duration: reduce ? 0 : 4.5, ease: 'power2.inOut' }) });
    (function tick() {
      requestAnimationFrame(tick); if (!visible) return; t += reduce ? 0 : .01;
      const m = state.mix, e = m * m * (3 - 2 * m);
      for (let i = 0; i < N; i++) {
        const k = i * 3, w = Math.sin(t * .8 + ph[i]) * .08 * (1 - e * .5);
        pos[k] = start[k] + (target[k] - start[k]) * e + Math.sin(t * .3 + ph[i]) * .05;
        pos[k+1] = start[k+1] + (target[k+1] - start[k+1]) * e + w;
        pos[k+2] = start[k+2] + (target[k+2] - start[k+2]) * e;
      }
      geo.attributes.position.needsUpdate = true;
      mat.opacity = .55 + e * .35;
      r.render(scene, cam);
    })();
  }

  /* ---- GSAP: i versi compaiono uno a uno, come scritti ---- */
  const lines = sec.querySelectorAll('.poem .l');
  gsap.set(lines, { opacity: 0, y: 14, filter: 'blur(6px)' });
  gsap.set(sec.querySelectorAll('.after > *'), { opacity: 0, y: 12 });
  gsap.set(sec.querySelector('.goldline'), { scaleX: 0, transformOrigin: '0 50%' });
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
  tl.to(sec.querySelector('.dedica-head'), { opacity: 1, y: 0, duration: 1 }, 0)
    .to(lines, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: .55 }, .6)
    .to(sec.querySelector('.goldline'), { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, '-=.4')
    .to(sec.querySelectorAll('.after > *'), { opacity: 1, y: 0, duration: .9, stagger: .15 }, '-=.6');
  gsap.set(sec.querySelector('.dedica-head'), { opacity: 0, y: 10 });
  ScrollTrigger.create({ trigger: sec, start: 'top 65%', once: true, onEnter: () => { if (reduce) tl.progress(1); else tl.play(); } });

  /* ---- la vela: dettagli per il contributo ---- */
  const btn = sec.querySelector('.vela-btn'), box = sec.querySelector('.vela');
  btn?.addEventListener('click', () => {
    const open = box.classList.toggle('open');
    btn.textContent = open ? 'Grazie, di cuore' : btn.dataset.label;
    if (open) gsap.fromTo(box, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .6 });
  });
  sec.querySelector('.copy-iban')?.addEventListener('click', async e => {
    try { await navigator.clipboard.writeText(e.target.dataset.iban); e.target.textContent = 'Copiato'; } catch (_) {}
  });
})();
