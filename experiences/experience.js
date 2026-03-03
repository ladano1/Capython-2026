document.addEventListener("DOMContentLoaded", () => {

    const prefersReducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;


    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 1.2s ease";

    requestAnimationFrame(() => {
        document.body.style.opacity = "1";
    });

  

    if (!prefersReducedMotion) {
        const canvas = document.createElement("canvas");
        canvas.style.position = "fixed";
        canvas.style.inset = "0";
        canvas.style.zIndex = "-2";
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d");

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener("resize", resize);

        const stars = [];
        const count = 70;

        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5,
                speed: Math.random() * 0.2 + 0.05
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.y += star.speed;
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255,255,255,0.5)";
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

 

    const warnings = document.querySelectorAll(".warning");

    warnings.forEach(warn => {
        setInterval(() => {
            warn.style.boxShadow = "0 0 30px rgba(255,60,60,0.6)";
            setTimeout(() => {
                warn.style.boxShadow = "none";
            }, 300);
        }, 3000);
    });

 

    const buttons = document.querySelectorAll(".button");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            document.body.style.filter =
                "contrast(1.3) hue-rotate(20deg)";
            setTimeout(() => {
                document.body.style.filter = "none";
            }, 200);
        });
    });

   

    if (!isTouch && !prefersReducedMotion) {
        document.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 4;
            const y = (e.clientY / window.innerHeight - 0.5) * 4;

            document.body.style.transform =
                `rotateY(${x}deg) rotateX(${-y}deg)`;
        });
    }

 

    const hud = document.createElement("div");
    hud.style.position = "fixed";
    hud.style.top = "20px";
    hud.style.right = "40px";
    hud.style.fontSize = "11px";
    hud.style.opacity = "0.6";
    hud.style.fontFamily = "monospace";
    hud.style.color = "#00f7ff";
    hud.style.zIndex = "10";
    document.body.appendChild(hud);

    function updateHUD() {
        const rand = Math.floor(Math.random() * 999999)
            .toString(16)
            .toUpperCase()
            .padStart(6, "0");

        hud.innerText = "EXPERIENCE::0x" + rand;
    }

    updateHUD();
    setInterval(updateHUD, 1000);

});