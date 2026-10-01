/* Save the Date: gratta e scopri la foto, calendario, condivisione */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const card = document.querySelector('.card');
  const canvas = card.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const cover = card.dataset.cover || '#6E7C4A';
  const coverText = card.dataset.coverText || 'Gratta qui';
  const coverText2 = card.dataset.coverText2 || '';
  const textColor = card.dataset.coverFg || '#F1E9DA';
  let revealed = false, strokes = 0;

  function paintCover() {
    const r = card.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = r.width * dpr; canvas.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = cover; ctx.fillRect(0, 0, r.width, r.height);
    /* grana leggera, come una gratta e vinci di una volta */
    ctx.fillStyle = 'rgba(255,255,255,.06)';
    for (let i = 0; i < 900; i++) ctx.fillRect(Math.random() * r.width, Math.random() * r.height, 1.5, 1.5);
    /* pattern a scelta del concept, disegnato dalla pagina */
    if (window.coverPattern) window.coverPattern(ctx, r.width, r.height);
    ctx.fillStyle = textColor; ctx.textAlign = 'center';
    ctx.font = `italic 500 ${Math.round(r.width * .11)}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillText(coverText, r.width / 2, r.height / 2 - 6);
    if (coverText2) {
      ctx.font = `300 ${Math.round(r.width * .04)}px Jost, sans-serif`;
      ctx.fillText(coverText2, r.width / 2, r.height / 2 + r.width * .06);
    }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(36, r.width * .11);
  }
  paintCover(); addEventListener('resize', () => { if (!revealed) paintCover(); });

  let last = null;
  const pos = e => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  canvas.addEventListener('pointerdown', e => { canvas.setPointerCapture(e.pointerId); last = pos(e); scratch(last, last); });
  canvas.addEventListener('pointermove', e => { if (!last) return; const p = pos(e); scratch(last, p); last = p; });
  canvas.addEventListener('pointerup', () => { last = null; check(); });
  canvas.addEventListener('pointercancel', () => { last = null; });

  function scratch(a, b) {
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    if (++strokes % 12 === 0) check();
  }
  function check() {
    if (revealed) return;
    const w = canvas.width, h = canvas.height, step = 16;
    const data = ctx.getImageData(0, 0, w, h).data; let clear = 0, total = 0;
    for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) { total++; if (data[(y * w + x) * 4 + 3] < 40) clear++; }
    if (clear / total > .45) reveal();
  }
  function reveal() {
    revealed = true; card.classList.add('revealed');
    const img = card.querySelector('img');
    if (window.gsap && !reduce) {
      gsap.to(canvas, { opacity: 0, duration: 1, ease: 'power2.inOut', onComplete: () => canvas.remove() });
      gsap.fromTo(img, { scale: 1.06 }, { scale: 1, duration: 1.6, ease: 'power3.out' });
    } else canvas.remove();
    document.querySelector('.hint')?.remove();
    document.querySelector('.reveal-btn')?.remove();
    if (navigator.vibrate) navigator.vibrate(30);
  }
  document.querySelector('.reveal-btn')?.addEventListener('click', reveal);

  /* calendario */
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//cidiciamo.si//Save the Date//IT\r\nBEGIN:VEVENT\r\nUID:may-morgan-2027@cidiciamo.si\r\nDTSTAMP:20261001T120000Z\r\nDTSTART;VALUE=DATE:20270601\r\nDTEND;VALUE=DATE:20270602\r\nSUMMARY:Matrimonio di May e Morgan\r\nLOCATION:Villa Savino, Cernusco Lombardo\r\nDESCRIPTION:Save the date. Dettagli e inviti in arrivo su cidiciamo.si\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
  const cal = document.querySelector('.cal');
  if (cal) { cal.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); cal.download = 'may-e-morgan-1-giugno-2027.ics'; }

  /* condivisione */
  const share = document.querySelector('.share');
  if (share) share.addEventListener('click', async () => {
    const data = { title: 'May & Morgan, 1 giugno 2027', text: 'Save the date: May e Morgan si sposano il 1 giugno 2027 a Villa Savino.', url: location.href };
    try { if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(location.href); share.textContent = 'Link copiato'; } } catch (e) {}
  });
})();
