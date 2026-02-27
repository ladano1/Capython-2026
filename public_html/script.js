document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("particles");
    let ctx;

    if (canvas) {
        ctx = canvas.getContext("2d");
        resizeCanvas();

        let particles = [];

        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                speedY: Math.random() * 0.6 + 0.2
            });
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.y += p.speedY;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(0,247,255,0.7)";
                ctx.fill();
            });

            requestAnimationFrame(animateParticles);
        }

        animateParticles();

        window.addEventListener("resize", resizeCanvas);

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

 

    const bootScreen = document.getElementById("bootScreen");
    const bootType = document.getElementById("bootType");
    const bootBar = document.getElementById("bootBar");
    const bootSub = document.getElementById("bootSub");

    if (bootScreen && bootType && bootBar && bootSub) {

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
                setTimeout(() => {
                    document.body.classList.remove("glitch-burst");
                }, 250);
            }

            if (pct === 100) {
                clearInterval(loader);

                setTimeout(() => {
                    bootScreen.style.opacity = "0";

                    setTimeout(() => {
                        bootScreen.style.display = "none";
                        startMainAnimations();
                    }, 1000);

                }, 450);
            }

        }, 220);

    } else {
        startMainAnimations();
    }

});



function startMainAnimations() {

    /* TYPEWRITER FOR CONTENT */
    const elements = document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, p, .typewriter"
    );

    elements.forEach(el => {
        if (!el.hasAttribute("data-text")) {
            el.setAttribute("data-text", el.textContent.trim());
        }
        typeWriter(el, 35);
    });


    const coords = document.createElement("div");
    coords.classList.add("hud-coords");
    document.body.appendChild(coords);

    document.addEventListener("mousemove", (e) => {
        coords.innerText =
            `X:${e.clientX.toString().padStart(4, "0")} ` +
            `Y:${e.clientY.toString().padStart(4, "0")}`;
    });

  
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

    setInterval(generateData, 500);

    const container = document.querySelector(".container");
    if (container) {
        document.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 10;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;

            container.style.transform =
                `rotateY(${x}deg) rotateX(${-y}deg)`;
        });
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

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

  
    const btn = document.querySelector(".launch-btn");
    if (btn) {
        btn.addEventListener("click", () => {
            document.body.classList.add("glitch-burst");
            setTimeout(() => {
                document.body.classList.remove("glitch-burst");
            }, 300);
        });
    }
}



function typeWriter(element, speed = 40) {

    const text = element.getAttribute("data-text");
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