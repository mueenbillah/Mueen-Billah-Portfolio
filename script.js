
/* =========================================
   MUEEN BILLAH — PORTFOLIO JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const body = document.body;

  // Elements
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  const langBtn = document.getElementById("langBtn");
  const themeBtn = document.getElementById("themeBtn");
  const backToTop = document.getElementById("backToTop");
  const scrollProgress = document.getElementById("scrollProgress");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  // Current settings
  let currentLanguage = "en";
  let currentTheme = "dark";

  // =====================================
  // 1. THEME SWITCHER
  // =====================================

  function updateThemeButton() {
    if (!themeBtn) return;

    const icon = themeBtn.querySelector("i");

    if (icon) {
      icon.className =
        currentTheme === "dark"
          ? "fa-solid fa-sun"
          : "fa-solid fa-moon";
    }

    themeBtn.setAttribute(
      "aria-label",
      currentTheme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme"
    );

    themeBtn.title =
      currentTheme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme";
  }

  function setTheme(theme) {
    currentTheme = theme;
    html.setAttribute("data-theme", theme);

    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch (error) {
      // The theme still works if storage is unavailable.
    }

    updateThemeButton();
  }

  try {
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      currentTheme = savedTheme;
    }
  } catch (error) {
    // Use the default dark theme.
  }

  setTheme(currentTheme);

  themeBtn?.addEventListener("click", () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });

  // =====================================
  // 2. BANGLA / ENGLISH SWITCHER
  // =====================================

  function setLanguage(language) {
    currentLanguage = language;

    html.lang = language === "bn" ? "bn" : "en";

    document.querySelectorAll("[data-en][data-bn]").forEach((element) => {
      const translatedText =
        language === "bn"
          ? element.dataset.bn
          : element.dataset.en;

      if (translatedText !== undefined) {
        // These translation attributes are authored in this HTML file.
        // innerHTML also preserves intentional markup in section headings.
        element.innerHTML = translatedText;
      }
    });

    document
      .querySelectorAll("[data-placeholder-en][data-placeholder-bn]")
      .forEach((element) => {
        element.placeholder =
          language === "bn"
            ? element.dataset.placeholderBn
            : element.dataset.placeholderEn;
      });

    if (langBtn) {
      langBtn.textContent = language === "en" ? "বাং" : "EN";

      langBtn.setAttribute(
        "aria-label",
        language === "en"
          ? "Switch to Bangla"
          : "Switch to English"
      );

      langBtn.title =
        language === "en" ? "বাংলায় দেখুন" : "View in English";
    }

    // Update the navigation button after translating its content.
    updateMenuButton();

    try {
      localStorage.setItem("portfolio-language", language);
    } catch (error) {
      // Language switching still works without storage.
    }
  }

  try {
    const savedLanguage = localStorage.getItem("portfolio-language");

    if (savedLanguage === "bn" || savedLanguage === "en") {
      currentLanguage = savedLanguage;
    }
  } catch (error) {
    // English is the default language.
  }

  // Initialize the language on page load.
  setLanguage(currentLanguage);

  langBtn?.addEventListener("click", () => {
    setLanguage(currentLanguage === "en" ? "bn" : "en");
  });

  // =====================================
  // 3. MOBILE NAVIGATION
  // =====================================

  function updateMenuButton() {
    if (!menuBtn) return;

    const icon = menuBtn.querySelector("i");
    const isOpen = navLinks?.classList.contains("open") ?? false;

    if (icon) {
      icon.className = isOpen
        ? "fa-solid fa-xmark"
        : "fa-solid fa-bars";
    }

    menuBtn.setAttribute("aria-expanded", String(isOpen));

    menuBtn.setAttribute(
      "aria-label",
      isOpen
        ? currentLanguage === "bn"
          ? "মেনু বন্ধ করুন"
          : "Close navigation"
        : currentLanguage === "bn"
          ? "মেনু খুলুন"
          : "Open navigation"
    );
  }

  function closeMenu() {
    navLinks?.classList.remove("open");
    body.classList.remove("menu-open");
    updateMenuButton();
  }

  menuBtn?.addEventListener("click", () => {
    navLinks?.classList.toggle("open");

    const isOpen = navLinks?.classList.contains("open") ?? false;

    body.classList.toggle("menu-open", isOpen);
    updateMenuButton();
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Node)) return;

    const clickedInsideMenu = navLinks?.contains(target);
    const clickedMenuButton = menuBtn?.contains(target);

    if (!clickedInsideMenu && !clickedMenuButton) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      closeMenu();
    }
  });

  // =====================================
  // 4. PROJECT FILTER
  // =====================================

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const isActive = item === button;

        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      projectCards.forEach((card) => {
        const categories = (card.dataset.category || "")
          .split(/\s+/)
          .filter(Boolean);

        const shouldShow =
          selectedFilter === "all" ||
          categories.includes(selectedFilter);

        card.classList.toggle("is-hidden", !shouldShow);
      });
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );
  });

  // =====================================
  // 5. SCROLL EFFECTS
  // =====================================

  const navItems = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  function updateScrollUI() {
    const scrollTop =
      window.scrollY || document.documentElement.scrollTop;

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      scrollableHeight > 0
        ? (scrollTop / scrollableHeight) * 100
        : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    backToTop?.classList.toggle("visible", scrollTop > 500);

    // Highlight the navigation link for the visible section.
    let activeSection = "home";

    sections.forEach((section) => {
      const sectionTop =
        section.getBoundingClientRect().top + window.scrollY;

      if (scrollTop >= sectionTop - 160) {
        activeSection = section.id;
      }
    });

    navItems.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeSection}`;

      link.classList.toggle("active", isActive);
    });
  }

  let scrollTicking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;

      scrollTicking = true;

      window.requestAnimationFrame(() => {
        updateScrollUI();
        scrollTicking = false;
      });
    },
    { passive: true }
  );

  updateScrollUI();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // =====================================
  // 6. REVEAL ANIMATIONS
  // =====================================

  const revealElements = document.querySelectorAll(".reveal");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // =====================================
  // 7. CONTACT FORM
  // =====================================
  // This form prepares an email in the visitor's email application.
  // It does not store messages or send them directly from the website.

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const subject =
      document.getElementById("subject")?.value.trim() || "";
    const message =
      document.getElementById("message")?.value.trim() || "";

    const recipient = "mueenbillah214@gmail.com";

    const emailSubject = encodeURIComponent(subject);

    const emailBody = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n\n` +
      `Message:\n${message}`
    );

    const mailtoLink =
      `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;

    if (formStatus) {
      formStatus.textContent =
        currentLanguage === "bn"
          ? "আপনার ইমেইল অ্যাপ খোলার চেষ্টা করা হচ্ছে..."
          : "Opening your email application...";
    }

    window.location.href = mailtoLink;
  });

  // =====================================
  // 8. AUTOMATIC FOOTER YEAR
  // =====================================

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // =====================================
  // 9. TYPEWRITER-STYLE HERO ROLE
  // =====================================

  const typedText = document.getElementById("typedText");

  const roleTranslations = {
    en: [
      "Future Software Engineer",
      "CST Student",
      "Web Development Learner",
      "Problem Solver in Progress",
    ],
    bn: [
      "ভবিষ্যৎ সফটওয়্যার ইঞ্জিনিয়ার",
      "CST শিক্ষার্থী",
      "ওয়েব ডেভেলপমেন্ট শিক্ষার্থী",
      "সমস্যা সমাধান শিখছি",
    ],
  };

  let roleIndex = 0;
  let characterIndex = 0;
  let deleting = false;
  let typingTimer = null;

  function typeRole() {
    if (!typedText) return;

    const roles = roleTranslations[currentLanguage];
    const currentRole = roles[roleIndex % roles.length];

    if (deleting) {
      characterIndex--;
    } else {
      characterIndex++;
    }

    typedText.textContent = currentRole.slice(0, characterIndex);

    let delay = deleting ? 35 : 65;

    if (!deleting && characterIndex >= currentRole.length) {
      deleting = true;
      delay = 1500;
    } else if (deleting && characterIndex <= 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350;
    }

    typingTimer = window.setTimeout(typeRole, delay);
  }

  if (typedText && !prefersReducedMotion) {
    typingTimer = window.setTimeout(typeRole, 700);
  }

  // Restart the role animation when the language changes.
  langBtn?.addEventListener("click", () => {
    if (!typedText || prefersReducedMotion) return;

    window.clearTimeout(typingTimer);

    roleIndex = 0;
    characterIndex = 0;
    deleting = false;

    typedText.textContent = "";

    typingTimer = window.setTimeout(typeRole, 250);
  });
});
