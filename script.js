(() => {
  const isMobile = window.innerWidth < 600;

  // ---------- Sparkle particles ----------
  const particleHost = document.getElementById('particles');
  const glyphs = ['🤍', '✦', '♡', '✧', '☆', '✨', '💗', '💖'];
  const COUNT = isMobile ? 18 : 28;
  for (let i = 0; i < COUNT; i++) {
    const s = document.createElement('span');
    s.textContent = glyphs[i % glyphs.length];
    const size = 8 + Math.random() * 14;
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = (100 + Math.random() * 30) + 'vh';
    s.style.fontSize = size + 'px';
    const dur = 10 + Math.random() * 10;
    s.style.animationDuration = dur + 's';
    s.style.animationDelay = (-Math.random() * dur) + 's';
    s.style.opacity = .7 + Math.random() * .3;
    particleHost.appendChild(s);
  }

  // ---------- Floating balloons ----------
  const balloonHost = document.getElementById('balloons');
  const balloonColors = ['#ec4899', '#a855f7', '#f472b6', '#8b5cf6', '#fb7185', '#c084fc', '#fcd34d', '#60a5fa', '#34d399'];
  const BALLOON_COUNT = isMobile ? 10 : 16;
  for (let i = 0; i < BALLOON_COUNT; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.left = Math.random() * 100 + 'vw';
    b.style.setProperty('--bc', balloonColors[(Math.random() * balloonColors.length) | 0]);
    const dur = 14 + Math.random() * 12;
    const swayDur = 3 + Math.random() * 4;
    b.style.setProperty('--dur', dur + 's');
    b.style.setProperty('--delay', (-Math.random() * dur) + 's');
    b.style.setProperty('--swayDur', swayDur + 's');
    b.style.setProperty('--swayDelay', (-Math.random() * swayDur) + 's');
    const scale = .75 + Math.random() * .7;
    b.style.fontSize = scale + 'em';
    b.style.transform = `scale(${scale})`;
    b.style.transformOrigin = 'bottom center';
    balloonHost.appendChild(b);
  }

  // ---------- Ambient lights ----------
  const lightHost = document.getElementById('lights');
  const LIGHT_COUNT = isMobile ? 14 : 22;
  for (let i = 0; i < LIGHT_COUNT; i++) {
    const l = document.createElement('span');
    l.style.left = Math.random() * 100 + 'vw';
    l.style.top = (Math.random() * 60) + 'vh';
    l.style.animationDelay = (-Math.random() * 3) + 's';
    l.style.animationDuration = (2 + Math.random() * 3) + 's';
    lightHost.appendChild(l);
  }

  // ---------- Confetti (canvas) ----------
  const cvs = document.getElementById('confetti');
  const ctx = cvs.getContext('2d');
  let W = cvs.width = window.innerWidth;
  let H = cvs.height = window.innerHeight;
  window.addEventListener('resize', () => { W = cvs.width = window.innerWidth; H = cvs.height = window.innerHeight; });
  const confs = [];
  const conColors = ['#ec4899', '#a855f7', '#f9a8d4', '#fde68a', '#67e8f9', '#fb7185', '#c084fc'];
  function burst(x, y, count = 80, power = 1) {
    for (let i = 0; i < count; i++) {
      confs.push({
        x, y,
        vx: (Math.random() - .5) * 9 * power,
        vy: (Math.random() * -10 - 3) * power,
        g: 0.22,
        s: 4 + Math.random() * 5,
        c: conColors[(Math.random() * conColors.length) | 0],
        r: Math.random() * Math.PI,
        vr: (Math.random() - .5) * .3,
        life: 160 + Math.random() * 80,
      });
    }
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (let i = confs.length - 1; i >= 0; i--) {
      const p = confs[i];
      p.vy += p.g;
      p.x += p.vx; p.y += p.vy;
      p.r += p.vr; p.life--;
      if (p.life <= 0 || p.y > H + 30) { confs.splice(i, 1); continue; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 80));
      ctx.fillRect(-p.s/2, -p.s/2, p.s, p.s * .55);
      ctx.restore();
    }
    requestAnimationFrame(tick);
  }
  tick();

  // ---------- Audio (with mobile fallback) ----------
  const audio = document.getElementById('bgMusic');
  const tap = document.getElementById('tapStart');
  audio.volume = 0.55;

  const hideTap = () => {
    tap.classList.add('hidden');
    setTimeout(() => tap.remove(), 900);
    // opening burst
    setTimeout(openingBurst, 200);
  };
  const tryPlay = () => { try { const p = audio.play(); if (p && p.catch) p.catch(()=>{}); } catch(e){} };

  audio.play().then(() => hideTap()).catch(() => {});
  const startFromTap = () => { tryPlay(); hideTap(); };
  tap.addEventListener('click', startFromTap, { once: true });
  tap.addEventListener('touchend', startFromTap, { once: true, passive: true });

  function openingBurst() {
    burst(W * 0.2, H * 0.35, 60);
    burst(W * 0.8, H * 0.35, 60);
    setTimeout(() => burst(W * 0.5, H * 0.45, 90, 1.1), 300);
  }

  // ---------- Cake candle blow ----------
  const cake = document.getElementById('cake');
  const flame = document.getElementById('flame');
  const cakeHint = document.getElementById('cakeHint');
  let blown = false;
  cake.addEventListener('click', () => {
    if (blown) return;
    blown = true;
    flame.classList.add('out');
    cakeHint.textContent = 'wish made 💫';
    cakeHint.classList.add('gone');
    setTimeout(() => { cakeHint.style.display = 'none'; }, 700);
    burst(W * 0.5, H * 0.5, 120, 1.2);
  });

  // ---------- Scene switching ----------
  const scenes = document.querySelectorAll('.scene');
  const goTo = (n) => {
    scenes.forEach(sc => sc.classList.toggle('active', Number(sc.dataset.scene) === n));
    if (n === 2) revealMemories();
    if (n === 3) { revealFinal(); setTimeout(() => { burst(W*0.3, H*0.4, 70); burst(W*0.7, H*0.4, 70); }, 600); setTimeout(() => burst(W*0.5, H*0.45, 100, 1.1), 4000); }
  };

  document.getElementById('yesBtn').addEventListener('click', (e) => {
    burst(e.clientX || W/2, e.clientY || H/2, 80, 1.1);
    setTimeout(() => goTo(2), 350);
  });
  document.getElementById('nextBtn').addEventListener('click', () => goTo(3));

  // ---------- Naughty No button ----------
  const noBtn = document.getElementById('noBtn');
  const noTexts = [
    'no', 'really?', 'are you sure?', 'bro come on 😭', 'still no?',
    'think again', 'akashhhh 😭', 'not allowed', 'friendship broken?',
    "you can't say no", 'again???', 'last chance', 'be serious',
    'try harder 😂', 'nope, try yes', 'one more time?', 'pleasee',
  ];
  let noIdx = 0;
  let noScale = 1;
  const dodge = () => {
    const pad = 12;
    const w = window.innerWidth, h = window.innerHeight;
    const bw = noBtn.offsetWidth, bh = noBtn.offsetHeight;
    const x = pad + Math.random() * Math.max(1, (w - bw - pad * 2));
    const y = pad + Math.random() * Math.max(1, (h - bh - pad * 2));
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
    noIdx = (noIdx + 1) % noTexts.length;
    noBtn.textContent = noTexts[noIdx];
    noScale = Math.max(0.55, noScale * 0.94);
    noBtn.style.transform = `scale(${noScale})`;
  };
  noBtn.addEventListener('mouseenter', dodge);
  noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); dodge(); }, { passive: false });
  noBtn.addEventListener('click', dodge);

  // ---------- Memory reveal ----------
  let memoriesRevealed = false;
  function revealMemories() {
    if (memoriesRevealed) return;
    memoriesRevealed = true;
    const items = document.querySelectorAll('#memList li');
    items.forEach((li, i) => setTimeout(() => li.classList.add('show'), 400 + i * 700));
    setTimeout(() => document.getElementById('nextBtn').classList.add('show'), 400 + items.length * 700 + 200);
  }

  // ---------- Final reveal ----------
  let finalRevealed = false;
  function revealFinal() {
    if (finalRevealed) return;
    finalRevealed = true;
    setTimeout(() => document.getElementById('finalMsg').classList.add('show'), 300);
    setTimeout(() => document.getElementById('glowLine').classList.add('show'), 4200);
    setTimeout(() => document.querySelector('.outro').classList.add('show'), 6000);
  }
})();
