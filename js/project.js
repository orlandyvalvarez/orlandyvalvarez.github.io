/* =========================================================
   project.js  -  solo para Proyectos/Proyecto-0X.html
   Requiere main.js cargado antes (usa window.Port)
   ========================================================= */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Barra de progreso de lectura ---------- */
  const bar = document.getElementById("progress");
  if (bar) {
    let ticking = false;
    const update = function () {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = "scaleX(" + p + ")";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Capturas: carga y error ---------- */
  document.querySelectorAll(".shot").forEach(function (btn) {
    const img = btn.querySelector("img");
    if (!img) return;
    const ok = function () { btn.classList.add("loaded"); };
    const fail = function () {
      btn.classList.add("failed");
      btn.removeAttribute("data-full");
      btn.disabled = true;
      btn.textContent = "No se pudo cargar la captura.";
    };
    img.addEventListener("load", ok);
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth > 0) ok();
  });

  /* ---------- Pasos: riel y lista lateral ---------- */
  const steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
  const navLinks = Array.prototype.slice.call(document.querySelectorAll(".steps-nav a"));
  if (steps.length && "IntersectionObserver" in window) {
    // El paso se marca como "visto" al llegar a él y no se desmarca
    const seenObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("seen");
      });
    }, { rootMargin: "0px 0px -35% 0px" });
    steps.forEach(function (s) { seenObs.observe(s); });

    // El paso activo de la lista lateral es el que cruza el centro de la pantalla
    const activeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          const on = a.getAttribute("href") === "#" + e.target.id;
          a.classList.toggle("active", on);
          if (on) {
            const box = a.parentElement;
            if (box && box.scrollHeight > box.clientHeight) {
              const top = a.offsetTop - box.clientHeight / 2 + a.clientHeight / 2;
              box.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
            }
          }
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    steps.forEach(function (s) { activeObs.observe(s); });
  } else {
    steps.forEach(function (s) { s.classList.add("seen"); });
  }

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById("lightbox");
  const shots = Array.prototype.slice.call(document.querySelectorAll(".shot[data-full]"));
  if (lb && shots.length) {
    const lbImg = lb.querySelector("img");
    const lbTitle = lb.querySelector(".lb-title");
    const lbCount = lb.querySelector(".lb-count");
    const btnClose = lb.querySelector("[data-lb='close']");
    const btnPrev = lb.querySelector("[data-lb='prev']");
    const btnNext = lb.querySelector("[data-lb='next']");
    let index = 0, opener = null;

    function show(i) {
      index = (i + shots.length) % shots.length;
      const s = shots[index];
      lbImg.src = s.dataset.full;
      lbImg.alt = s.dataset.alt || "";
      lbTitle.textContent = s.dataset.title || "";
      lbCount.textContent = (index + 1) + " / " + shots.length;
    }
    function open(i, from) {
      opener = from;
      show(i);
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      btnClose.focus();
    }
    function close() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      lbImg.removeAttribute("src");
      document.body.style.overflow = "";
      if (opener) opener.focus();
    }

    shots.forEach(function (s, i) {
      s.addEventListener("click", function () { open(i, s); });
    });
    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", function () { show(index - 1); });
    btnNext.addEventListener("click", function () { show(index + 1); });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lb-stage")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(index - 1);
      else if (e.key === "ArrowRight") show(index + 1);
      else if (e.key === "Tab") { // mantiene el foco dentro del visor
        const f = [btnClose, btnPrev, btnNext];
        const cur = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(cur + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
      }
    });
  }

  /* ---------- Copiar comandos ---------- */
  document.querySelectorAll(".cmd-head button").forEach(function (b) {
    b.addEventListener("click", async function () {
      const lines = Array.prototype.map.call(
        b.closest(".cmd").querySelectorAll("pre span"),
        function (s) { return s.textContent; }
      );
      const ok = await Port.copy(lines.join("\n"));
      const en = Port.getLang() === "en";
      Port.toast(ok ? (en ? "Copied" : "Copiado") : (en ? "Couldn't copy" : "No se pudo copiar"));
    });
  });

  /* ---------- Idioma: Google Translate (como en tu versión original) ---------- */
  let lang = Port.getLang();

  // Si el visitante eligió inglés en otra página, la traducción arranca sola
  function setTransCookie(l) {
    if (l === "en") document.cookie = "googtrans=/es/en; path=/";
    else document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }
  setTransCookie(lang);

  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: "es",
      includedLanguages: "es,en",
      autoDisplay: false
    }, "google_translate_element");
  };

  function translatePage(l, attempts) {
    attempts = attempts || 0;
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = l;
      select.dispatchEvent(new Event("change"));
      return;
    }
    if (attempts < 15) setTimeout(function () { translatePage(l, attempts + 1); }, 300);
  }

  function markLang(l) {
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === l));
    });
  }
  markLang(lang);

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () {
      lang = b.dataset.lang;
      Port.setLang(lang);
      markLang(lang);
      translatePage(lang);
    });
  });

  const gt = document.createElement("script");
  gt.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  gt.async = true;
  document.body.appendChild(gt);
})();
