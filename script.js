/* =========================================================
   Jaii Mukundh A — portfolio interactions
   ========================================================= */

(() => {
  const nav = document.getElementById("nav");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const brand = document.querySelector(".brand");
  const pageMain = document.querySelector("main");
  const pageFooter = document.querySelector(".footer");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav state ---------- */
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const closeMenu = () => {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    if (pageMain) pageMain.inert = false;
    if (pageFooter) pageFooter.inert = false;
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    if (pageMain) pageMain.inert = isOpen;
    if (pageFooter) pageFooter.inert = isOpen;
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  if (brand) brand.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMenu();
  });

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    ".section-head, .about-grid, .exp-row, .case, .pub-grid, .toolkit-grid, .contact .wrap > *"
  );

  if (!prefersReduced && "IntersectionObserver" in window) {
    revealTargets.forEach((el) => el.classList.add("reveal"));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Active nav link ---------- */
  const sectionIds = ["home", "about", "experience", "work", "publication", "toolkit", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const linkFor = new Map();
  navLinks.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href.startsWith("#")) linkFor.set(href.slice(1), link);
  });

  let activeId = "";
  let ticking = false;

  const updateActiveLink = () => {
    const marker = window.scrollY + window.innerHeight * 0.34;
    let current = sections[0]?.id || "";

    for (const section of sections) {
      if (section.offsetTop <= marker) current = section.id;
    }

    if (current === activeId) return;
    activeId = current;

    navLinks.querySelectorAll("a").forEach((link) => link.classList.remove("active"));
    const activeLink = linkFor.get(current);
    if (activeLink) activeLink.classList.add("active");
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateActiveLink();
        ticking = false;
      });
    },
    { passive: true }
  );

  window.addEventListener("resize", updateActiveLink);
  updateActiveLink();

  /* ---------- Year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
