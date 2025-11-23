/* ================================
   ZEKLI STORE - SCRIPT.JS
   Particles • Loader • Filters • Cart • Assistant
   ================================ */

/* ========= BACKGROUND PARTICLES ========= */
const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  const colors = ["#ffb7f8", "#ffe9ff", "#c9fff7", "#ffd5f0"];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 0.6 + 0.2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.y += this.speedY;
      if (this.y > canvas.height + 10) {
        this.y = -10;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const total = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < total; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
}

/* ========= LOADING SCREEN ========= */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 600); // small delay for smoothness
  }
});

/* ========= MINI MASCOT ASSISTANT ========= */
const assistant = document.querySelector(".assistant");
const bubble = document.querySelector(".assistant-bubble");

if (assistant && bubble) {
  const messages = [
    "Nyaa~ Welcome to Zekli Store! 💗",
    "Check our anime figures, they’re so cool! ✨",
    "Keychains & rings are super trendy rn! 🔥",
    "Custom orders? Yesss, we do that too! 🎁",
    "Search your favourite anime item above! 🔍"
  ];
  let idx = 0;

  setInterval(() => {
    idx = (idx + 1) % messages.length;
    bubble.textContent = messages[idx];
  }, 4500);

  assistant.addEventListener("click", () => {
    assistant.classList.add("assistant-click");
    setTimeout(() => assistant.classList.remove("assistant-click"), 300);
  });
}

/* ========= PRODUCTS FILTER + SEARCH ========= */
/* This code is safe to run on all pages; it only does something on products.html */

let activeCategory = "all";

function applyProductFilters() {
  const cards = document.querySelectorAll(".product-card");
  const searchInput = document.getElementById("searchInput");
  const searchText = searchInput ? searchInput.value.toLowerCase() : "";

  cards.forEach((card) => {
    const category = card.dataset.category || "other";
    const name = (card.dataset.name || "").toLowerCase();

    const matchCategory =
      activeCategory === "all" || category === activeCategory;
    const matchSearch = name.includes(searchText);

    if (matchCategory && matchSearch) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.filter || "all";
    applyProductFilters();
  });
});

const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    applyProductFilters();
  });
}

/* ========= SIMPLE ADD-TO-CART SYSTEM ========= */
/* Uses localStorage; reads/writes same cart across pages */

let zekliCart = [];
try {
  const stored = localStorage.getItem("zekliCart");
  if (stored) {
    zekliCart = JSON.parse(stored);
  }
} catch (e) {
  zekliCart = [];
}

function saveCart() {
  localStorage.setItem("zekliCart", JSON.stringify(zekliCart));
}

function addToCart(product) {
  zekliCart.push(product);
  saveCart();
  alert("✨ Added to cart!");
  renderCartIfOnCartPage();
}

/* Attach to buttons with class .btn-add-cart */
document.querySelectorAll(".btn-add-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const product = {
      name: btn.dataset.name || "Product",
      price: btn.dataset.price || "0",
      img: btn.dataset.img || ""
    };
    addToCart(product);
  });
});

/* ========= CART PAGE RENDER ========= */
function renderCartIfOnCartPage() {
  const cartContainer = document.getElementById("cartItems");
  if (!cartContainer) return;

  cartContainer.innerHTML = "";
  if (zekliCart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty ~ nyaaa 🛒</p>";
    return;
  }

  zekliCart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.img || "img/mascot.png"}" alt="">
      <div class="cart-item-info">
        <p>${item.name}</p>
        <small>₹${item.price}</small>
      </div>
      <button data-index="${index}">Remove</button>
    `;
    cartContainer.appendChild(div);
  });

  cartContainer.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.dataset.index, 10);
      zekliCart.splice(i, 1);
      saveCart();
      renderCartIfOnCartPage();
    });
  });
}

/* Run on cart page load */
document.addEventListener("DOMContentLoaded", () => {
  renderCartIfOnCartPage();
});
