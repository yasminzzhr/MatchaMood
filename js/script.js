// Nav Toggle
const navbarNav = document.querySelector(".navbar-nav");
const hamburger = document.querySelector("#hamburger-menu");
const body = document.body;

function openNav() {
  navbarNav.classList.add("active");
  body.classList.add("no-scroll");
  if (hamburger) hamburger.setAttribute("aria-expanded", "true");
}

function closeNav() {
  navbarNav.classList.remove("active");
  body.classList.remove("no-scroll");
  if (hamburger) hamburger.setAttribute("aria-expanded", "false");
}

function toggleNav(e) {
  e?.preventDefault?.();
  const isOpen = navbarNav.classList.contains("active");
  isOpen ? closeNav() : openNav();
}

// When hamburger clicked
if (hamburger) {
  hamburger.addEventListener("click", toggleNav);
}

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    closeNav();
  }
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
