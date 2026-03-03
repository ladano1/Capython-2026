document.addEventListener("DOMContentLoaded", () => {

    const prefersReducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;


    if (!prefersReducedMotion) {

        const canvas = document.createElement("canvas");
        canvas.style.position = "fixed";
        canvas.style.inset = "0";
        canvas.style.zIndex = "-3";
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d");

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener("resize", resize, { passive: true });

        const stars = [];
        const starCount = 70;

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5,
                speed: Math.random() * 0.25 + 0.05
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
                ctx.fillStyle = "rgba(255,255,255,0.6)";
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }



    const hud = document.createElement("div");
    hud.style.position = "fixed";
    hud.style.top = "20px";
    hud.style.right = "40px";
    hud.style.fontSize = "11px";
    hud.style.opacity = "0.7";
    hud.style.fontFamily = "monospace";
    hud.style.color = "#888";
    hud.style.zIndex = "20";
    document.body.appendChild(hud);

    function updateHUD() {
        const rand = Math.floor(Math.random() * 999999)
            .toString(16)
            .toUpperCase()
            .padStart(6, "0");

        hud.innerText = "FACILITY::MTN-LOG 0x" + rand;
    }

    updateHUD();
    setInterval(updateHUD, 800);

 

    const highlights = document.querySelectorAll(".highlight");

    highlights.forEach(el => {
        setInterval(() => {
            el.style.textShadow =
                "0 0 15px #ff3c3c, 0 0 30px rgba(255,60,60,0.7)";
            el.style.transform = "scale(1.05)";
            el.style.display = "inline-block";

            setTimeout(() => {
                el.style.textShadow =
                    "0 0 8px #ff3c3c, 0 0 18px rgba(255,60,60,0.4)";
                el.style.transform = "scale(1)";
            }, 250);

        }, 3500);
    });

 

    if (!isTouch && !prefersReducedMotion) {
        document.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 5;
            const y = (e.clientY / window.innerHeight - 0.5) * 5;

            document.body.style.transform =
                `rotateY(${x}deg) rotateX(${-y}deg)`;
        }, { passive: true });
    }

   

    function glitchFlash() {
        document.body.style.filter = "contrast(1.4) brightness(1.1)";
        setTimeout(() => {
            document.body.style.filter = "none";
        }, 120);
    }

    setInterval(() => {
        if (Math.random() > 0.85) glitchFlash();
    }, 3000);

});