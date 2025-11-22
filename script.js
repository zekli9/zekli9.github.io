// ========== PARTICLE BACKGROUND ==========
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
  window.addEventListener("resize", resizeCanvas);

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
    const total = Math.floor((canvas.width * canvas.height) / 16000);
    for (let i = 0; i < total; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  window.addEventListener("resize", initParticles);
}

// ========== MINI MASCOT ASSISTANT ==========
const assistant = document.querySelector(".assistant");
const bubble = document.querySelector(".assistant-bubble");
const messages = [
  "Nyaa~ Welcome to Zekli Store! 💗",
  "Check our anime figures, they’re so cool! ✨",
  "Keychains & rings are super trendy rn! 🔥",
  "Custom orders? Yesss, we do that too! 🎁"
];

if (assistant && bubble) {
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % messages.length;
    bubble.textContent = messages[idx];
  }, 4500);

  assistant.addEventListener("click", () => {
    assistant.classList.add("assistant-click");
    setTimeout(() => assistant.classList.remove("assistant-click"), 350);
  });
}
