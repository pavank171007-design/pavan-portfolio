
"use strict";

// Theme toggle
const themeToggle = document.getElementById("themeToggle");

function setTheme(light) {
  document.body.classList.toggle("light-theme", light);

  themeToggle.innerHTML = light
    ? '☾ <span>Theme</span>'
    : '☼ <span>Theme</span>';

  themeToggle.setAttribute(
    "aria-label",
    light ? "Switch to dark theme" : "Switch to light theme"
  );
}

let savedTheme = "dark";

try {
  savedTheme = localStorage.getItem("pavan-theme") || "dark";
} catch (error) {
  // Continue with the default dark theme.
}

setTheme(savedTheme === "light");

themeToggle.addEventListener("click", () => {
  const light = !document.body.classList.contains("light-theme");
  setTheme(light);

  try {
    localStorage.setItem("pavan-theme", light ? "light" : "dark");
  } catch (error) {
    // Theme switching still works if storage is unavailable.
  }
});

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeMenu() {
  navLinks.classList.remove("show");
  menuToggle.textContent = "☰";
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("show");

  menuToggle.textContent = open ? "✕" : "☰";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation"
  );
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 720) closeMenu();
});

// Project filters
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    projectCards.forEach(card => {
      card.hidden =
        filter !== "all" && card.dataset.category !== filter;
    });
  });
});

// Expand and collapse project details
document.querySelectorAll(".details-btn").forEach(button => {
  button.addEventListener("click", () => {
    const details = button.nextElementSibling;
    const expanded = button.getAttribute("aria-expanded") === "true";

    details.hidden = expanded;
    button.setAttribute("aria-expanded", String(!expanded));

    button.innerHTML = expanded
      ? 'View Details <span>＋</span>'
      : 'Hide Details <span>−</span>';
  });
});

// Contact form validation
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("visitorName").value.trim();
  const email = document.getElementById("visitorEmail").value.trim();
  const message = document.getElementById("visitorMessage").value.trim();

  if (!name || !email || !message) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage("Please enter a valid email address.", "error");
    document.getElementById("visitorEmail").focus();
    return;
  }

  showMessage(
    `Thank you, ${name}! Your form passed validation. No email was sent.`,
    "success"
  );

  contactForm.reset();
});

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = type;
}

// Current year in footer
document.getElementById("currentYear").textContent =
  new Date().getFullYear();

// Active navigation indicator
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-links a");

function updateNavigation() {
  let current = "home";

  sections.forEach(section => {
    if (section.getBoundingClientRect().top <= 150) {
      current = section.id;
    }
  });

  links.forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${current}`
    );
  });
}

window.addEventListener("scroll", updateNavigation, { passive: true });
updateNavigation();

// Animated hero text
const typingText = document.getElementById("typingText");

const phrases = [
  "digital experiences.",
  "modern websites.",
  "creative solutions."
];

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (reducedMotion) {
  typingText.textContent = phrases[0];
} else {
  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let deleting = true;

  function typeEffect() {
    const phrase = phrases[phraseIndex];

    charIndex += deleting ? -1 : 1;
    typingText.textContent = phrase.slice(0, charIndex);

    let delay = deleting ? 45 : 85;

    if (!deleting && charIndex === phrase.length) {
      deleting = true;
      delay = 1300;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 300;
    }

    window.setTimeout(typeEffect, delay);
  }

  window.setTimeout(typeEffect, 1400);
}