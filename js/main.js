/* =========================================================
   main.js  -  comportamiento compartido (home + proyectos)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Idioma guardado (compartido entre páginas) ---------- */
  const Port = (window.Port = window.Port || {});
  Port.getLang = function () {
    try {
      const s = localStorage.getItem("lang");
      if (s === "es" || s === "en") return s;
    } catch (e) {}
    return "es";
  };
  Port.setLang = function (l) {
    try { localStorage.setItem("lang", l); } catch (e) {}
  };

  /* ---------- Toast + copiar ---------- */
  const toast = document.getElementById("toast");
  let toastTimer;
  Port.toast = function (msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
  };
  Port.copy = async function (text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Respaldo para navegadores sin permiso de portapapeles
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        ta.remove();
        return ok;
      } catch (e2) {
        return false;
      }
    }
  };

  /* ---------- Menú móvil ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a.link").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Enlace activo según la sección visible ---------- */
  const links = Array.prototype.slice.call(document.querySelectorAll("a.link[href^='#']"));
  if (links.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) obs.observe(target);
    });
  }

  /* ---------- Red animada del hero ---------- */
  const c = document.getElementById("net");
  if (!c) return;
  const ctx = c.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = getComputedStyle(document.documentElement);
  const ACCENT = css.getPropertyValue("--accent").trim() || "#4FC3F7";
  const SIGNAL = css.getPropertyValue("--signal").trim() || "#F2B84B";
  let w = 0, h = 0, dpr = 1, nodes = [], packets = [], mouse = null, visible = true, linkDist = 140;

  function rgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  function resize() {
    const r = c.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    linkDist = w < 700 ? 110 : 150;
    const n = Math.round(Math.min(80, Math.max(26, (w * h) / 20000)));
    nodes = Array.from({ length: n }, function () {
      return {
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
        r: 1.4 + Math.random() * 1.4, hub: Math.random() < 0.13
      };
    });
    packets = [];
    if (reduce) draw(0);
  }

  function draw(dt) {
    ctx.clearRect(0, 0, w, h);
    for (const p of nodes) {
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    const pairs = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < linkDist) {
          pairs.push([a, b]);
          ctx.strokeStyle = rgba(ACCENT, (1 - d / linkDist) * 0.28);
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    if (mouse) {
      for (const p of nodes) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < linkDist * 1.3) {
          ctx.strokeStyle = rgba(SIGNAL, (1 - d / (linkDist * 1.3)) * 0.55);
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    }
    if (!reduce && pairs.length && packets.length < 14 && Math.random() < 0.06) {
      const l = pairs[(Math.random() * pairs.length) | 0];
      packets.push({ a: l[0], b: l[1], t: 0, s: 0.006 + Math.random() * 0.008, warm: Math.random() < 0.2 });
    }
    for (let i = packets.length - 1; i >= 0; i--) {
      const k = packets[i];
      k.t += k.s * dt;
      if (k.t >= 1 || Math.hypot(k.a.x - k.b.x, k.a.y - k.b.y) > linkDist) { packets.splice(i, 1); continue; }
      const x = k.a.x + (k.b.x - k.a.x) * k.t, y = k.a.y + (k.b.y - k.a.y) * k.t;
      const col = k.warm ? SIGNAL : ACCENT;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
      g.addColorStop(0, rgba(col, 0.9)); g.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 7); ctx.fill();
    }
    for (const p of nodes) {
      if (p.hub) {
        ctx.strokeStyle = rgba(ACCENT, 0.5); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 4, 0, 7); ctx.stroke();
      }
      ctx.fillStyle = rgba(ACCENT, p.hub ? 0.95 : 0.6);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.hub ? p.r + 1 : p.r, 0, 7); ctx.fill();
    }
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(40, now - last) / 16.67; last = now;
    if (visible) draw(dt);
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", resize);
  if (reduce) return;

  const hero = c.parentElement;
  hero.addEventListener("pointermove", function (e) {
    const r = c.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
  });
  hero.addEventListener("pointerleave", function () { mouse = null; });
  new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(hero);
  requestAnimationFrame(loop);
})();
