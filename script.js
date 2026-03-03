document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches;



  const canvas = document.getElementById("particles");
  let ctx = null;
  let particles = [];

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Re-seed particles so it stays consistent after resize/orientation change
    if (particles.length) {
      particles = particles.map(p => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: p.size,
        speedY: p.speedY
      }));
    }
  }

  function initParticles() {
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resizeCanvas();

    const count = prefersReducedMotion ? 60 : 120;

    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speedY: Math.random() * 0.6 + 0.2
      });
    }

    function animateParticles() {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.y += p.speedY;
        if (p.y > canvas.height) {
          p.y = 0;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,247,255,0.7)";
        ctx.fill();
      });

      requestAnimationFrame(animateParticles);
    }

    if (!prefersReducedMotion) animateParticles();
  }

  if (canvas) {
    initParticles();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    window.addEventListener("orientationchange", resizeCanvas, { passive: true });
  }

 

  const bootScreen = document.getElementById("bootScreen");
  const bootType = document.getElementById("bootType");
  const bootBar = document.getElementById("bootBar");
  const bootSub = document.getElementById("bootSub");

  if (bootScreen && bootType && bootBar && bootSub && !prefersReducedMotion) {
    if (!bootType.hasAttribute("data-text")) {
      bootType.setAttribute("data-text", bootType.textContent.trim());
    }

    typeWriter(bootType, 25);

    const phases = [
      "ACCESSING SECURE NODE...",
      "DECRYPTING TRANSMISSION...",
      "SYNCING ORBITAL RELAY...",
      "CALIBRATING SIGNAL...",
      "READY."
    ];

    let pct = 0;
    let phaseIndex = 0;

    const loader = setInterval(() => {
      pct += Math.floor(Math.random() * 9) + 3;
      if (pct > 100) pct = 100;

      bootBar.style.width = pct + "%";

      if (pct >= (phaseIndex + 1) * 20 && phaseIndex < phases.length - 1) {
        phaseIndex++;
        bootSub.textContent = phases[phaseIndex];

        document.body.classList.add("glitch-burst");
        setTimeout(() => document.body.classList.remove("glitch-burst"), 250);
      }

      if (pct === 100) {
        clearInterval(loader);

        setTimeout(() => {
          bootScreen.style.opacity = "0";

          setTimeout(() => {
            bootScreen.style.display = "none";
            startMainAnimations({ isTouchDevice, prefersReducedMotion });
          }, 1000);
        }, 450);
      }
    }, 220);
  } else {
    startMainAnimations({ isTouchDevice, prefersReducedMotion });
  }
});


function startMainAnimations({ isTouchDevice, prefersReducedMotion }) {



  if (!prefersReducedMotion) {
    const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, .typewriter");

    elements.forEach(el => {
      // Skip anything inside links/buttons so we don't erase clickable text
      if (el.closest("a, button")) return;

      // Prevent double-run
      if (el.dataset.twDone === "1") return;
      el.dataset.twDone = "1";

      if (!el.hasAttribute("data-text")) {
        el.setAttribute("data-text", el.textContent.trim());
      }

      typeWriter(el, 35);
    });
  }

 

  if (!isTouchDevice && !prefersReducedMotion) {
    const coords = document.createElement("div");
    coords.classList.add("hud-coords");
    document.body.appendChild(coords);

    document.addEventListener("mousemove", (e) => {
      coords.innerText =
        `X:${e.clientX.toString().padStart(4, "0")} ` +
        `Y:${e.clientY.toString().padStart(4, "0")}`;
    }, { passive: true });
  }

  

  if (!prefersReducedMotion) {
    const dataStream = document.createElement("div");
    dataStream.classList.add("hud-stream");
    document.body.appendChild(dataStream);

    function generateData() {
      const randomHex = Math.floor(Math.random() * 999999)
        .toString(16)
        .toUpperCase()
        .padStart(6, "0");

      dataStream.innerText = "SYS.DATA::0x" + randomHex;
    }

    generateData();
    setInterval(generateData, 500);
  }

 

  const container = document.querySelector(".container");
  if (container && !isTouchDevice && !prefersReducedMotion) {
    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;

      container.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    }, { passive: true });
  } else if (container) {
  
    container.style.transform = "none";
  }

  

  const reveals = document.querySelectorAll(".reveal");

  function revealOnScroll() {
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll, { passive: true });
  revealOnScroll();

 

  const btn = document.querySelector(".launch-btn");
  if (btn && !prefersReducedMotion) {
    btn.addEventListener("click", () => {
      document.body.classList.add("glitch-burst");
      setTimeout(() => {
        document.body.classList.remove("glitch-burst");
      }, 300);
    });
  }
}


function typeWriter(element, speed = 40) {
  const text = element.getAttribute("data-text") || "";
  element.textContent = "";

  let i = 0;

  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }

  typing();
}