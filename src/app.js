document.addEventListener("alpine:init", () => {
  // cart store
  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,

    add(newItem) {
      const exist = this.items.find((i) => i.id === newItem.id);
      if (exist) {
        exist.quantity++;
      } else {
        this.items.push({ ...newItem, quantity: 1 });
      }
      this.quantity++;
      this.total += newItem.price;

      // 🔔 notify
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: { message: `${newItem.name} successfully added` },
        })
      );
    },

    increment(id) {
      const i = this.items.find((it) => it.id === id);
      if (!i) return;
      i.quantity++;
      this.quantity++;
      this.total += i.price;
    },

    decrement(id) {
      const i = this.items.find((it) => it.id === id);
      if (!i) return;
      i.quantity--;
      this.quantity--;
      this.total -= i.price;
      if (i.quantity <= 0) {
        this.items = this.items.filter((it) => it.id !== id);
      }
    },
  });

  // Products component
  Alpine.data("products", () => ({
    // UI state
    search: "",
    sort: "popular",

    // modal state
    openItem: null,

    // catalog
    items: [
      {
        id: 1,
        name: "Uji Kyoto Ceremonial Matcha",
        img: "img/products/product1.jpg",
        price: 980000,
      },
      {
        id: 2,
        name: "Nishio Premium Matcha Blend",
        img: "img/products/product2.jpg",
        price: 860000,
      },
      {
        id: 3,
        name: "Shizuoka Organic Ceremonial Matcha",
        img: "img/products/product3.jpg",
        price: 1150000,
      },
      {
        id: 4,
        name: "Organic Kagoshima Matcha",
        img: "img/products/product4.jpg",
        price: 920000,
      },
      {
        id: 5,
        name: "Nakamura Tokichi Matcha",
        img: "img/products/product5.jpg",
        price: 1200000,
      },
      {
        id: 6,
        name: "Fukujuen Matcha Mujyō",
        img: "img/products/product6.jpg",
        price: 1080000,
      },
      {
        id: 7,
        name: "Yamamasa Koyamaen Chajyu no Mukashi",
        img: "img/products/product7.jpg",
        price: 1340000,
      },
      {
        id: 8,
        name: "Matcha Konomi",
        img: "img/products/product8.jpg",
        price: 990000,
      },
    ],

    // descriptions
    details: {
      1: {
        was: 1080000,
        desc: "Handcrafted from the finest tencha leaves of Uji, this ceremonial-grade matcha embodies quiet refinement. Stone-ground to a velvety powder, it reveals layers of umami depth and a lingering sweetness that whispers luxury in every sip.",
      },
      2: {
        was: 930000,
        desc: "A signature blend from Nishio, where time-honored cultivation meets modern artistry. Its creamy, mellow body and gentle vegetal aroma create a harmonious taste, elegant, balanced, and deeply serene.",
      },
      3: {
        was: 1250000,
        desc: "Sustainably grown in the misty hills of Shizuoka, this organic ceremonial matcha expresses pure clarity and grace. Its jade-green color, silky texture, and naturally sweet aroma define true Japanese sophistication.",
      },
      4: {
        was: 990000,
        desc: "From the fertile soil of Kagoshima comes a matcha of serene elegance. Subtle marine notes blend with a soft, buttery body, leaving a tranquil, lasting aftertaste that embodies mindful luxury.",
      },
      5: {
        was: 1320000,
        desc: "A heritage masterpiece from Nakamura Tokichi, celebrated for its deep umami and polished smoothness. Each bowl unveils the essence of Kyoto tradition, indulgent, pure, and artfully composed.",
      },
      6: {
        was: 1180000,
        desc: "Fukujuen Matcha Mujyō captures the spirit of Kyoto refinement. Its rich, creamy froth and balanced aroma evoke the quiet sophistication of Japanese tea ceremonies, luxurious in simplicity.",
      },
      7: {
        was: 1480000,
        desc: "Yamamasa Koyamaen’s Chajyu no Mukashi stands among Japan’s most exquisite ceremonial matcha. With its luminous color and profound umami, it offers an immersive, meditative experience, a taste of timeless prestige.",
      },
      8: {
        was: 1070000,
        desc: "Matcha Konomi embodies modern minimalism with artisanal roots. Its bright, vibrant flavor and smooth finish elevate every moment — versatile, refined, and effortlessly elegant.",
      },
    },

    detail(id) {
      return this.details[id] ?? { was: null, desc: "" };
    },

    // list
    get filtered() {
      const q = this.search.trim().toLowerCase();
      const out = this.items.filter((i) => i.name.toLowerCase().includes(q));
      if (this.sort === "price-asc") out.sort((a, b) => a.price - b.price);
      else if (this.sort === "price-desc")
        out.sort((a, b) => b.price - a.price);
      return out;
    },

    // helpers
    format(n) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(n);
    },

    // add to cart
    addToCart(item) {
      this.$store.cart.add(item);
    },

    // helper
    init() {
      window.__getProductById = (id) => {
        const it = this.items.find((i) => i.id === Number(id));
        if (!it) return null;
        return { ...it, ...this.detail(it.id) };
      };
    },

    // Modal Control
    openDetail(item) {
      const d = this.detail(item.id);
      const payload = { ...item, ...d };
      window.dispatchEvent(new CustomEvent("open-detail", { detail: payload }));
      document.body.style.overflow = "hidden";
      this.$nextTick(() => feather.replace());
    },
    closeDetail() {
      window.dispatchEvent(new Event("close-detail"));
      document.body.style.overflow = "";
      this.openItem = null;
    },
    addToCartModal() {
      if (!this.openItem) return;
      this.$store.cart.add(this.openItem);
    },
  }));

  // Form Validation
  const checkoutButton = document.querySelector(".checkout-button");
  checkoutButton.disabled = true;

  const form = document.querySelector("#checkoutForm");
  form.addEventListener("keyup", function () {
    let allFilled = true;
    for (let i = 0; i < form.elements.length; i++) {
      const el = form.elements[i];
      if (el.tagName === "INPUT" && el.type !== "hidden") {
        if ((el.value || "").trim().length === 0) {
          allFilled = false;
          break;
        }
      }
    }
    checkoutButton.disabled = !allFilled;
    checkoutButton.classList.toggle("disabled", !allFilled);
  });

  // Send data when checkout button clicked
  const formatMessage = (obj) => {
    const rupiah = (n) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(Number(n) || 0);

    // return for string is ready send to wa
    return `Data Customer
Name : ${obj.name}
Email : ${obj.email}
Phone : ${obj.phone}

Order Details
${JSON.parse(obj.items)
  .map(
    (item) =>
      `${item.name} (${item.quantity} x ${rupiah(item.price)} = ${rupiah(
        item.price * item.quantity
      )})`
  )
  .join("\n")}

Total : ${rupiah(obj.total)}

With gratitude from MatchaMood, your matcha journey begins`;
  };

  checkoutButton.addEventListener("click", function (e) {
    e.preventDefault();
    if (checkoutButton.disabled) return;

    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);

    // fallback
    objData.items = objData.items || JSON.stringify(Alpine.store("cart").items);
    objData.total = objData.total || Alpine.store("cart").total;

    const message = formatMessage(objData);
    window.open(
      "https://wa.me/6281938027921?text=" + encodeURIComponent(message),
      "_blank"
    );
  });

  // toast
  Alpine.data("toast", () => ({
    open: false,
    text: "",
    timer: null,
    duration: 2200,
    show(msg) {
      this.text = msg || "Added to cart";
      this.open = true;
      this.$nextTick(() => {
        if (window.feather?.replace) feather.replace();
      });
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.hide(), this.duration);
    },
    hide() {
      this.open = false;
    },
  }));

  // Modal Component
  Alpine.data("modal", () => ({
    open: false,
    item: null,

    format(n) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(n || 0);
    },

    openFromEvent(e) {
      this.item = e.detail || null;
      this.open = !!this.item;

      this.$nextTick(() => {
        this.$el.classList.add("show");
        if (window.feather?.replace) feather.replace();
      });

      document.body.style.overflow = "hidden";
    },

    close() {
      this.$el.classList.remove("show");
      this.open = false;
      this.item = null;
      document.body.style.overflow = "";
    },
  }));
});
