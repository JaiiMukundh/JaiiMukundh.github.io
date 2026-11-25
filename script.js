/* =========================================================
   Jaii Mukundh A — portfolio interactions
   ========================================================= */

(() => {
  const nav = document.getElementById("nav");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
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
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = Array.from(document.querySelectorAll(".reveal"));

  revealEls.forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((child) =>
      child.classList.contains("reveal")
    );
    const index = siblings.indexOf(el);
    if (index > 0) el.style.setProperty("--delay", `${Math.min(index * 70, 350)}ms`);
  });

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Active nav link ---------- */
  const sections = ["home", "about", "experience", "projects", "publication", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const linkFor = new Map();
  navLinks.querySelectorAll("a").forEach((link) => {
    const id = link.getAttribute("href").replace("#", "");
    linkFor.set(id, link);
  });

  let activeId = "";
  const updateActiveLink = () => {
    const marker = window.scrollY + window.innerHeight * 0.32;
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

  let ticking = false;
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
  updateActiveLink();

  /* ---------- Card spotlight ---------- */
  if (!prefersReduced && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".project").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    });
  }

  /* ---------- Hero orb parallax ---------- */
  const hero = document.getElementById("home");
  const orbWrap = document.getElementById("orb-wrap");

  if (orbWrap && hero && !prefersReduced && window.matchMedia("(pointer: fine)").matches) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      orbWrap.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    };

    const schedule = () => {
      if (rafId === null) rafId = requestAnimationFrame(animate);
    };

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 18;
      targetY = y * 18;
      schedule();
    });

    hero.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      schedule();
    });
  }

  /* ---------- Year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
