/* Comportamenti comuni a tutte le landing */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.__reduce = reduce;

  /* nav: trasparente sopra il hero, solida dopo */
  const top = document.querySelector('.top');
  const hero = document.querySelector('.hero');
  if (top && hero) {
    const io = new IntersectionObserver(([e]) => top.classList.toggle('solid', !e.isIntersecting), { rootMargin: '-80px 0px 0px 0px', threshold: 0 });
    io.observe(hero);
  }

  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  /* reveal: ogni sezione entra una volta, con i figli in leggero stagger */
  if (!reduce) {
    document.querySelectorAll('.section').forEach(sec => {
      const items = sec.querySelectorAll('[data-reveal]');
      if (!items.length) return;
      gsap.to(items, {
        opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .08,
        scrollTrigger: { trigger: sec, start: 'top 72%', once: true }
      });
    });
  }

  /* RSVP: demo senza backend, conferma animata */
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const done = form.querySelector('.done');
      const name = (form.querySelector('[name=nome]')?.value || 'ospite misterioso').trim();
      done.querySelector('.who').textContent = name;
      done.style.display = 'flex';
      gsap.fromTo(done, { opacity: 0, scale: .96 }, { opacity: 1, scale: 1, duration: .6, ease: 'power3.out' });
      gsap.fromTo(done.querySelector('h3'), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .6, delay: .15 });
    });
    form.querySelector('.reset')?.addEventListener('click', () => {
      form.reset(); form.querySelector('.done').style.display = 'none';
    });
  }

  /* lista nozze: scegli un regalo (demo) */
  document.querySelectorAll('.gift .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.gift');
      card.classList.add('taken');
      btn.textContent = document.body.dataset.takenLabel || 'Scelto, grazie';
      gsap.fromTo(card, { scale: 1 }, { scale: .98, duration: .15, yoyo: true, repeat: 1 });
    });
  });
})();
