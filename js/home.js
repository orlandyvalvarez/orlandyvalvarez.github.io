/* =========================================================
   home.js  -  solo para index.html
   Requiere main.js cargado antes (usa window.Port)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Traducciones ---------- */
  const I18N = {
    es: {
      skip: "Saltar al contenido",
      nav_about: "Perfil", nav_edu: "Formación", nav_skills: "Stack", nav_projects: "Proyectos", nav_contact: "Contacto",
      available: "Disponible para nuevas oportunidades",
      lead: "Licenciado en Informática enfocado en cloud, infraestructura TI, networking, Linux y automatización. Interesado en oportunidades profesionales en infraestructura, soporte IT, redes, sistemas y cloud.",
      cta_projects: "Ver proyectos",
      about_t: "Perfil",
      about_p1: "Licenciado en Informática con formación técnica en soporte IT, redes Cisco, administración de sistemas Windows y Linux, bases de datos, Microsoft 365, cloud computing y fundamentos de seguridad.",
      about_p2: "Actualmente desarrollo laboratorios y proyectos prácticos orientados a infraestructura IT, sistemas y cloud. Cada uno tiene su propia página con el proceso de implementación y las evidencias.",
      f1k: "Formación", f1v: "Licenciatura en Informática, UNICARIBE (2024)",
      f2k: "Redes", f2v: "Cisco CCNA 2 y CCNA 3 (ITLA)",
      f3k: "Seguridad", f3v: "Fortinet NSE 1, 2 y 3",
      f4k: "Cloud", f4v: "INFOTEP e INDOTEL (nivel intermedio)",
      path_t: "Cómo se conecta mi formación",
      n1: "Soporte IT", n2: "Redes", n3: "Sistemas", n4: "Linux / Windows Server", n5: "Cloud", n6: "Seguridad",
      edu_t: "Formación y certificaciones",
      edu_p: "Estudios universitarios y cursos técnicos que respaldan el stack.",
      e0s: "Graduado en 2024",
      e1s: "Cursos técnicos",
      e2s: "Cursos de redes y soporte",
      e3s: "Curso de nube",
      e4s: "Cursos en línea",
      e5s: "Seguridad de red",
      skills_t: "Stack técnico",
      skills_p: "Las herramientas con las que trabajo, agrupadas por área.",
      s1: "Soporte TI e ITSM", s2: "Administración de sistemas", s3: "Redes", s4: "Virtualización y automatización", s5: "Cloud", s6: "Monitoreo y seguridad",
      proj_t: "Proyectos",
      proj_p: "Los publicados tienen documentación completa. Los demás están en preparación.",
      live: "Publicado", soon: "En preparación", view: "Ver proyecto", soon_l: "Próximamente",
      p1t: "AWS Enterprise Infrastructure", p1d: "Infraestructura cloud diseñada y desplegada con AWS y Terraform.",
      p2t: "Linux Server Automation", p2d: "Automatización y configuración de servidores Linux con Ansible y Docker.",
      p3t: "Windows Server Directory Services", p3d: "Implementación y administración de Active Directory, DNS, DHCP y políticas de grupo (GPO) en Windows Server.",
      p4t: "Infrastructure Monitoring", p4d: "Sistema de monitoreo de infraestructura con Prometheus y Grafana.",
      p5t: "IT Service Desk & Ticketing", p5d: "Plataforma de mesa de ayuda con GLPI 11: solicitudes de soporte, categorías ITIL, seguimiento, soluciones y cierre de incidencias.",
      p6t: "Network Storage & Backup Server", p6d: "Servidor de archivos compartidos y políticas de respaldo automatizado para la red local.",
      contact_t: "Hablemos",
      contact_p: "Mi código está en GitHub y puedo responder por correo o LinkedIn.",
      copy: "Copiar correo", copied: "Correo copiado", copy_err: "No se pudo copiar. Selecciónalo manualmente."
    },
    en: {
      skip: "Skip to content",
      nav_about: "About", nav_edu: "Education", nav_skills: "Stack", nav_projects: "Projects", nav_contact: "Contact",
      available: "Open to new opportunities",
      lead: "Computer Science graduate focused on cloud, IT infrastructure, networking, Linux and automation. I build and run servers, networks and services.",
      cta_projects: "View projects",
      about_t: "About",
      about_p1: "Computer Science graduate with technical training in IT support, Cisco networking, Windows and Linux system administration, databases, Microsoft 365, cloud computing and security fundamentals.",
      about_p2: "I currently build hands-on labs and projects focused on IT infrastructure, systems and cloud. Each one has its own page with the implementation process and the evidence.",
      f1k: "Education", f1v: "B.S. in Computer Science, UNICARIBE (2024)",
      f2k: "Networking", f2v: "Cisco CCNA 2 and CCNA 3 (ITLA)",
      f3k: "Security", f3v: "Fortinet NSE 1, 2 and 3",
      f4k: "Cloud", f4v: "INFOTEP and INDOTEL (intermediate level)",
      path_t: "How my training connects",
      n1: "IT Support", n2: "Networking", n3: "Systems", n4: "Linux / Windows Server", n5: "Cloud", n6: "Security",
      edu_t: "Education and certifications",
      edu_p: "University studies and technical courses behind the stack.",
      e0s: "Graduated in 2024",
      e1s: "Technical courses",
      e2s: "Networking and support courses",
      e3s: "Cloud course",
      e4s: "Online courses",
      e5s: "Network security",
      skills_t: "Technical stack",
      skills_p: "The tools I work with, grouped by area.",
      s1: "IT Support & ITSM", s2: "Systems & data", s3: "Networking", s4: "Virtualization & automation", s5: "Cloud", s6: "Monitoring & security",
      proj_t: "Projects",
      proj_p: "Published projects have full documentation. The rest are in preparation.",
      live: "Published", soon: "In preparation", view: "View project", soon_l: "Coming soon",
      p1t: "AWS Enterprise Infrastructure", p1d: "Cloud infrastructure designed and deployed with AWS and Terraform.",
      p2t: "Linux Server Automation", p2d: "Linux server automation and configuration with Ansible and Docker.",
      p3t: "Windows Server Directory Services", p3d: "Deployment and administration of Active Directory, DNS, DHCP and Group Policy (GPO) on Windows Server.",
      p4t: "Infrastructure Monitoring", p4d: "Infrastructure monitoring system built with Prometheus and Grafana.",
      p5t: "IT Service Desk & Ticketing", p5d: "Help desk platform on GLPI 11: support requests, ITIL categories, tracking, solutions and incident closure.",
      p6t: "Network Storage & Backup Server", p6d: "Shared file server and automated backup policies for the local network.",
      contact_t: "Let's talk",
      contact_p: "My code is on GitHub, and I answer by email or LinkedIn.",
      copy: "Copy email", copied: "Email copied", copy_err: "Couldn't copy. Please select it manually."
    }
  };

  let lang = Port.getLang();

  function applyLang(l) {
    lang = l;
    document.documentElement.lang = l;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const v = I18N[l][el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === l));
    });
    Port.setLang(l);
  }
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.dataset.lang); });
  });
  applyLang(lang);

  /* ---------- Copiar correo ---------- */
  const copyBtn = document.getElementById("copyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async function () {
      const mail = document.getElementById("mail").textContent.trim();
      const ok = await Port.copy(mail);
      Port.toast(ok ? I18N[lang].copied : I18N[lang].copy_err);
    });
  }

  /* ---------- Terminal que se escribe sola ---------- */
  const body = document.getElementById("termBody");
  if (!body) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const script = [
    { cmd: "whoami", out: '<span class="k">orlandy-vilorio</span>' },
    { cmd: "cat role.txt", out: "Cloud &amp; Infrastructure" },
    { cmd: "systemctl status availability", out: '<span class="p">●</span> availability.service\n   Active: <span class="p">active (running)</span> - open to work' },
    { cmd: "ls stack/", out: '<span class="k">linux</span>  <span class="k">windows-server</span>  <span class="k">docker</span>  <span class="k">ansible</span>\n<span class="k">terraform</span>  <span class="k">aws</span>  <span class="k">prometheus</span>  <span class="k">grafana</span>' }
  ];
  const prompt = '<span class="p">$</span> ';
  const caret = '<span class="caret"></span>';
  const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  if (reduce) {
    body.innerHTML = script.map(function (s) {
      return prompt + '<span class="c">' + s.cmd + '</span>\n<span class="o">' + s.out + "</span>";
    }).join("\n\n") + "\n\n" + prompt + caret;
    return;
  }

  (async function run() {
    let html = "";
    await sleep(700);
    for (const s of script) {
      let typed = "";
      for (const ch of s.cmd) {
        typed += ch;
        body.innerHTML = html + prompt + '<span class="c">' + typed + "</span>" + caret;
        await sleep(38 + Math.random() * 45);
      }
      await sleep(260);
      html += prompt + '<span class="c">' + s.cmd + '</span>\n<span class="o">' + s.out + "</span>\n\n";
      body.innerHTML = html + caret;
      await sleep(420);
    }
    body.innerHTML = html + prompt + caret;
  })();
})();
