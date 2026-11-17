/* Maskot Kuncung untuk landing page: lingkaran dengan poni, kuncung, dan dua mata.
   Mata mengikuti kursor (atau melirik acak di layar sentuh), berkedip, dan kuncungnya bergoyang. */
(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const FACE = `<svg class="kc" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <g class="kc-face">
      <circle cx="50" cy="58" r="36" fill="#FFF3DB"/>
      <path d="M16.8 44 A36 36 0 0 1 83.2 44 C82 49 78 51 74 47 C70 43 65 43 62 48 C59 53 54 52 51 47 C48 42 43 42 40 48 C37 53 31 53 28 47 C25 43 20 42 16.8 44Z" fill="#2B1B14"/>
      <g class="kc-tuft"><path d="M45.5 25.5 C38.5 15 42.5 3.5 53.5 3.2 C62.5 3 68.5 9.4 65.2 16.2 C63.4 11.4 58.2 10.2 55.2 13 C52.8 15.4 54.6 19.4 58.6 20.8 C55.8 25.8 49.6 27.8 45.5 25.5Z" fill="#2B1B14"/></g>
      <g class="kc-pupil">
        <g class="kc-eye" style="transform-origin:38px 66px"><circle cx="38" cy="66" r="5.8" fill="#2B1B14"/><circle cx="39.9" cy="63.9" r="1.8" fill="#FFF3DB"/></g>
        <g class="kc-eye" style="transform-origin:62px 66px"><circle cx="62" cy="66" r="5.8" fill="#2B1B14"/><circle cx="63.9" cy="63.9" r="1.8" fill="#FFF3DB"/></g>
      </g>
    </g>
  </svg>`;

  const slots = [...document.querySelectorAll("[data-kc]")];
  slots.forEach((el) => {
    el.insertAdjacentHTML("afterbegin", FACE);
  });
  const faces = slots.map((el) => el.querySelector(".kc")).filter(Boolean);
  if (!faces.length) return;

  // ---- mata mengikuti kursor
  let ptr = null;
  let lastMove = 0;
  let raf = 0;
  const look = (el, x, y) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.bottom < -80 || r.top > innerHeight + 80) return;
    const dx = x - (r.left + r.width / 2);
    const dy = y - (r.top + r.height * 0.56);
    const d = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, d / 80);
    el.style.setProperty("--px", ((dx / d) * k * 4.4).toFixed(2));
    el.style.setProperty("--py", ((dy / d) * k * 3.4).toFixed(2));
    el.style.setProperty("--hx", ((dx / d) * k * 1.4).toFixed(2));
    el.style.setProperty("--hy", ((dy / d) * k * 1.1).toFixed(2));
  };
  const update = () => {
    raf = 0;
    if (ptr) faces.forEach((f) => look(f, ptr.x, ptr.y));
  };
  addEventListener(
    "pointermove",
    (e) => {
      ptr = { x: e.clientX, y: e.clientY };
      lastMove = performance.now();
      if (!raf) raf = requestAnimationFrame(update);
    },
    { passive: true },
  );
  addEventListener("scroll", () => ptr && !raf && (raf = requestAnimationFrame(update)), { passive: true });

  // ---- melirik acak bila kursor lama diam (mis. layar sentuh)
  if (!reduce) {
    setInterval(() => {
      if (performance.now() - lastMove < 5000) return;
      const a = Math.random() * Math.PI * 2;
      faces.forEach((f) => {
        const k = Math.random() < 0.35 ? 0 : 0.8;
        f.style.setProperty("--px", (Math.cos(a) * k * 4).toFixed(2));
        f.style.setProperty("--py", (Math.sin(a) * k * 3).toFixed(2));
      });
    }, 2300);

    // ---- kedip
    faces.forEach((f) => {
      const loop = () =>
        setTimeout(() => {
          f.classList.add("blink");
          setTimeout(() => f.classList.remove("blink"), 140);
          loop();
        }, 2200 + Math.random() * 4200);
      loop();
    });
  }
})();
