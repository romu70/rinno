// Shared behaviour for the project-page redesign mocks.
(() => {
  // Top bar border + reading progress
  const bar = document.querySelector('.topbar'), prog = document.querySelector('.progress');
  const onScroll = () => {
    const h = document.documentElement;
    bar && bar.classList.toggle('scrolled', h.scrollTop > 8);
    if (prog) prog.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Scroll-spy: chapters (top level) and sub-sections (h3 with id)
  const links = [...document.querySelectorAll('.rail a')];
  const byId = Object.fromEntries(links.map(a => [a.getAttribute('href').slice(1), a]));
  const targets = links.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  const setActive = id => {
    const a = byId[id]; if (!a) return;
    const isSub = !!a.closest('.sub');
    const top = isSub ? a.closest('.sub').parentElement.querySelector(':scope > a') : a;
    links.forEach(l => l.classList.remove('on'));
    document.querySelectorAll('.rail li.open').forEach(li => li.classList.remove('open'));
    top.classList.add('on'); top.parentElement.classList.add('open');
    if (isSub) a.classList.add('on');
    // keep the active chip visible on small screens (rail scrolls horizontally there)
    const rail = document.querySelector('.rail');
    if (rail && rail.scrollWidth > rail.clientWidth) rail.scrollTo({ left: top.offsetLeft - 20, behavior: 'smooth' });
  };
  // Active = last target (chapter or sub-section) whose top has passed 35% of the viewport
  let current = null, ticking = false;
  const spy = () => {
    ticking = false;
    const line = innerHeight * 0.35;
    let id = targets[0] && targets[0].id;
    targets.forEach(t => { if (t.getBoundingClientRect().top <= line) id = t.id; });
    if (id !== current) { current = id; setActive(id); }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
  spy();

  // Step tabs (WAI-ARIA tabs, ← → Home End, plus prev/next buttons)
  document.querySelectorAll('[data-steps]').forEach(root => {
    const tabs = [...root.querySelectorAll('[role=tab]')];
    const prev = root.querySelector('[data-prev]'), next = root.querySelector('[data-next]');
    let cur = 0;
    const select = (i, focus) => {
      cur = (i + tabs.length) % tabs.length;
      tabs.forEach((t, j) => {
        const on = j === cur;
        t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (prev) prev.disabled = cur === 0;
      if (next) next.disabled = cur === tabs.length - 1;
      if (focus) tabs[cur].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', e => {
        const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (k === undefined) return; e.preventDefault(); select(k, true);
      });
    });
    prev && prev.addEventListener('click', () => select(cur - 1));
    next && next.addEventListener('click', () => select(cur + 1));
    select(0);
  });

  // Lightbox
  const lb = document.getElementById('lb');
  if (lb) {
    const img = lb.querySelector('img'), cap = lb.querySelector('p');
    document.querySelectorAll('button.frame').forEach(b => {
      b.insertAdjacentHTML('beforeend', '<span class="zoom-hint" aria-hidden="true">⤢</span>');
      b.setAttribute('aria-label', 'Agrandir : ' + (b.querySelector('img').alt || 'image'));
      b.addEventListener('click', () => {
        const i = b.querySelector('img');
        img.src = i.src; img.alt = i.alt;
        cap.textContent = b.closest('figure')?.querySelector('figcaption')?.textContent || i.alt;
        lb.showModal();
      });
    });
    lb.querySelector('.close').addEventListener('click', () => lb.close());
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  }
})();
