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
        const starCount = 90;

        for (let i = 0; i < starCount; i++) {
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
    hud.style.color = "#00b4d8";
    hud.style.zIndex = "20";
    document.body.appendChild(hud);

    function updateSignal() {
        const strength = Math.floor(Math.random() * 40) + 60;
        const hex = Math.floor(Math.random() * 999999)
            .toString(16)
            .toUpperCase()
            .padStart(6, "0");

        hud.innerText = `VOYAGER::SIG ${strength}% 0x${hex}`;
    }

    updateSignal();
    setInterval(updateSignal, 1200);



    const warnings = document.querySelectorAll(".warning");

    warnings.forEach(el => {
        setInterval(() => {
            el.style.transform = "scale(1.05)";
            setTimeout(() => {
                el.style.transform = "scale(1)";
            }, 200);
        }, 3000);
    });



    if (!isTouch && !prefersReducedMotion) {
        document.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 4;
            const y = (e.clientY / window.innerHeight - 0.5) * 4;

            document.body.style.transform =
                `rotateY(${x}deg) rotateX(${-y}deg)`;
        }, { passive: true });
    }



    function glitchFlash() {
        document.body.style.filter = "contrast(1.4) hue-rotate(20deg)";
        setTimeout(() => {
            document.body.style.filter = "none";
        }, 150);
    }

    setInterval(() => {
        if (Math.random() > 0.88) glitchFlash();
    }, 4000);

});