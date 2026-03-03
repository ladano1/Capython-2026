document.addEventListener("DOMContentLoaded", () => {

    const glow = document.createElement("div");
    glow.classList.add("cursor-glow");
    document.body.appendChild(glow);

    document.addEventListener("mousemove", (e) => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
    });


    const panels = document.querySelectorAll(".section, .logo-box");

    panels.forEach(panel => {
        panel.addEventListener("mousemove", (e) => {

            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            panel.style.transform =
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        panel.addEventListener("mouseleave", () => {
            panel.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        });
    });

});