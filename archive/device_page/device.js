document.addEventListener("DOMContentLoaded", () => {

    const prefersReducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;



    if (!isTouch && !prefersReducedMotion) {
        const glow = document.createElement("div");
        glow.style.position = "fixed";
        glow.style.width = "200px";
        glow.style.height = "200px";
        glow.style.borderRadius = "50%";
        glow.style.pointerEvents = "none";
        glow.style.background =
            "radial-gradient(circle, rgba(0,247,255,0.2) 0%, transparent 70%)";
        glow.style.transform = "translate(-50%, -50%)";
        glow.style.zIndex = "5";
        document.body.appendChild(glow);

        document.addEventListener("mousemove", (e) => {
            glow.style.left = e.clientX + "px";
            glow.style.top = e.clientY + "px";
        }, { passive: true });
    }


    if (!prefersReducedMotion) {
const elements = document.querySelectorAll("h1, p:not(:has(a))");

        elements.forEach(el => {
            if (el.dataset.typed === "1") return;
            el.dataset.typed = "1";

            const text = el.textContent.trim();
            el.textContent = "";

            let i = 0;

            function type() {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 20);
                }
            }

            type();
        });
    }



    if (!prefersReducedMotion) {
        const hud = document.createElement("div");
        hud.style.position = "fixed";
        hud.style.top = "20px";
        hud.style.right = "40px";
        hud.style.fontSize = "12px";
        hud.style.opacity = "0.8";
        hud.style.zIndex = "20";
        document.body.appendChild(hud);

        function updateData() {
            const hex = Math.floor(Math.random() * 999999)
                .toString(16)
                .toUpperCase()
                .padStart(6, "0");

            hud.innerText = "DEVICE::0x" + hex;
        }

        updateData();
        setInterval(updateData, 600);
    }



    if (!isTouch && !prefersReducedMotion) {
        document.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 8;
            const y = (e.clientY / window.innerHeight - 0.5) * 8;

            document.body.style.transform =
                `rotateY(${x}deg) rotateX(${-y}deg)`;
        }, { passive: true });
    }

   

    const links = document.querySelectorAll("a");

    links.forEach(link => {
        link.addEventListener("click", () => {
            document.body.style.filter = "hue-rotate(90deg) contrast(1.5)";
            setTimeout(() => {
                document.body.style.filter = "none";
            }, 200);
        });
    });

});