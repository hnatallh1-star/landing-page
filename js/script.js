/* =========================================================
   Nebula — Landing Page Interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ---- Current year in footer ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Navbar scroll state ---- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (window.scrollY > 20) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile menu toggle ---- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const closeMenu = () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", closeMenu)
  );

  /* ---- Scroll reveal animations ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // small stagger for siblings revealed together
            entry.target.style.transitionDelay = `${(i % 4) * 80}ms`;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---- Animated stat counters ---- */
  const counters = document.querySelectorAll(".stat-num");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const isDecimal = target % 1 !== 0;
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = target * eased;
      el.textContent = formatNumber(value, isDecimal) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = formatNumber(target, isDecimal) + suffix;
    };
    requestAnimationFrame(tick);
  };

  const formatNumber = (n, isDecimal) => {
    if (isDecimal) return n.toFixed(1);
    return Math.round(n).toLocaleString();
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  } else {
    counters.forEach((c) => animateCount(c));
  }

  /* ---- FAQ accordion ---- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-q");
    const answer = item.querySelector(".faq-a");
    btn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      // close all
      faqItems.forEach((other) => {
        other.classList.remove("active");
        other.querySelector(".faq-a").style.maxHeight = null;
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      // open clicked one
      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---- Contact form (demo handler) ---- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || !message) {
        status.style.color = "#fca5a5";
        status.textContent = "Please fill in all fields with a valid email.";
        return;
      }
      status.style.color = "";
      status.textContent = "Thanks! We'll be in touch shortly. 🚀";
      form.reset();
      setTimeout(() => (status.textContent = ""), 5000);
    });
  }
});
