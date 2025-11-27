window.addEventListener("DOMContentLoaded", () => {
  // Element
  const hm = document.querySelector("#hamburger-menu");
  const sb = document.querySelector("#search-button");
  const scBtn = document.querySelector("#shopping-cart-button");
  const navbarNav = document.querySelector(".navbar-nav");
  const searchForm = document.querySelector(".search-form");
  const shoppingCart = document.querySelector(".shopping-cart");

  function closeAll() {
    navbarNav?.classList.remove("active");
    searchForm?.classList.remove("active");
    shoppingCart?.classList.remove("active");
    cartOpen = false;
  }

  const panels = [navbarNav, searchForm, shoppingCart];
  function toggleExclusive(target) {
    const isActive = target?.classList.toggle("active");
    if (isActive) {
      panels.forEach(
        (el) => el && el !== target && el.classList.remove("active")
      );
    }
  }

  // Nav
  hm?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleExclusive(navbarNav);
  });

  // search
  sb?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleExclusive(searchForm);

    if (searchForm?.classList.contains("active")) {
      const sbx = document.querySelector("#search-box");
      setTimeout(() => sbx?.focus(), 0);
    }
  });

  const sbx = document.querySelector("#search-box");
  sbx?.addEventListener("input", (e) => {
    const section = document.querySelector("[x-data^='products']");
    if (!section || !section.__x) return;
    section.__x.$data.search = e.target.value;
  });

  // cart
  let cartOpen = false;

  scBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    cartOpen = !cartOpen;
    shoppingCart?.classList.toggle("active", cartOpen);
    navbarNav?.classList.remove("active");
    searchForm?.classList.remove("active");
  });

  // click outside
  document.addEventListener("click", (e) => {
    const path = e.composedPath ? e.composedPath() : null;
    const inEl = (el) => {
      if (!el) return false;
      return path ? path.includes(el) : el.contains(e.target);
    };

    const clickInNav = inEl(navbarNav);
    const clickInSearch = inEl(searchForm);
    const clickInCart = inEl(shoppingCart);
    const clickInButtons = inEl(hm) || inEl(sb) || inEl(scBtn);

    if (!clickInNav && !clickInSearch && !clickInCart && !clickInButtons) {
      closeAll();
    }
  });

  // Feather Icons
  if (window.feather?.replace) feather.replace();

  // auto assign star ratings
  (function () {
    const cards = Array.from(
      document.querySelectorAll(".product-card[data-price]")
    );
    if (!cards.length) return;

    const prices = cards
      .map((c) => Number(c.dataset.price) || 0)
      .filter((n) => n > 0);
    const minPrice = prices.length ? Math.min(...prices) : Infinity;
    const HIGH_PRICE_THRESHOLD = 1200000;

    cards.forEach((card) => {
      const stars = card.querySelector(".product-stars");
      if (!stars) return;

      const price = Number(card.dataset.price) || 0;
      let rating;
      if (price === minPrice) rating = 3;
      else if (price >= HIGH_PRICE_THRESHOLD) rating = 5;
      else rating = Math.random() < 0.5 ? 4 : 5;

      stars.classList.remove("rating-3", "rating-4", "rating-5");
      stars.classList.add(`rating-${rating}`);
    });
  })();

  // Modal Box
  document.addEventListener("click", (e) => {
    const a = e.target.closest(".item-detail-button");
    if (!a) return;

    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") {
      e.stopImmediatePropagation();
    }

    const card = a.closest(".product-card");
    const id = card?.dataset?.id;
    if (!id) return;

    const payload =
      typeof window.__getProductById === "function"
        ? window.__getProductById(id)
        : null;

    if (payload) {
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("open-detail", { detail: payload })
        );
      }, 0);
    }
  });
});
