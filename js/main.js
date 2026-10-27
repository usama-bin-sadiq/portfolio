/* ═══════════════════════════════════════════════
   SECTION LOADER
═══════════════════════════════════════════════ */
const SECTIONS = [
  { id: "slot-hero", file: "sections/hero.html" },
  { id: "slot-about", file: "sections/about.html" },
  { id: "slot-experience", file: "sections/experience.html" },
  { id: "slot-skills", file: "sections/skills.html" },
  { id: "slot-contact", file: "sections/contact.html" },
];

async function loadSections() {
  await Promise.all(
    SECTIONS.map(async ({ id, file }) => {
      const slot = document.getElementById(id);
      if (!slot) {
        console.error(
          `Could not load ${file}: section slot #${id} is missing.`,
        );
        return;
      }

      try {
        const res = await fetch(file);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const html = await res.text();
        if (!html.trim()) {
          throw new Error("The section response was empty.");
        }
        slot.innerHTML = html;
      } catch (error) {
        console.error(`Could not load ${file}.`, error);
        const message = document.createElement("div");
        message.className = "section-load-error";
        message.setAttribute("role", "status");

        const text = document.createElement("p");
        text.textContent =
          "This section could not be loaded. Check your connection and try again.";

        message.append(text);
        slot.replaceChildren(message);
      } finally {
        slot.setAttribute("aria-busy", "false");
      }
    }),
  );
}

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
function init() {
  /* footer year */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* nav scroll state */
  const nav = document.getElementById("nav");
  window.addEventListener(
    "scroll",
    () => {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 60);
    },
    { passive: true },
  );

  /* hamburger */
  const ham = document.getElementById("ham");
  const mobMenu = document.getElementById("mob-menu");
  if (ham && mobMenu) {
    ham.addEventListener("click", () => {
      const open = ham.classList.toggle("open");
      mobMenu.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobMenu.querySelectorAll(".mob-link, .mob-cta").forEach((a) => {
      a.addEventListener("click", () => {
        ham.classList.remove("open");
        mobMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* scroll reveal */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("vis");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.06 },
  );

  document.querySelectorAll(".ei").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 0.08}s`;
    io.observe(el);
  });
  document.querySelectorAll(".sg").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 0.07}s`;
    io.observe(el);
  });

  /* hero reveal */
  requestAnimationFrame(() => {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("in"));
  });

  /* smooth anchor scroll */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* ═══════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", async () => {
  await loadSections();
  init();
});
