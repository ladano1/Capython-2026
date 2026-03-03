document.addEventListener("DOMContentLoaded", () => {
    const grid = document.createElement("div");
    grid.style.position = "fixed";
    grid.style.inset = "0";
    grid.style.zIndex = "-1";
    grid.style.pointerEvents = "none";
    grid.style.backgroundImage =
        "linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px), " +
        "linear-gradient(90deg, rgba(0,255,255,0.04) 1px, transparent 1px)";
    grid.style.backgroundSize = "50px 50px";
    document.body.appendChild(grid);

    let offset = 0;

    function animateGrid() {
        offset += 0.2;
        grid.style.transform = `translate(${offset}px, ${offset}px)`;
        requestAnimationFrame(animateGrid);
    }

    animateGrid();


   

    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 1s ease";

    requestAnimationFrame(() => {
        document.body.style.opacity = "1";
    });


  

    const boxes = document.querySelectorAll(".archive-box");

    boxes.forEach((box, index) => {
        let direction = 1;
        let y = 0;

        function float() {
            y += 0.05 * direction;

            if (y > 3 || y < -3) direction *= -1;

            box.style.transform = `translateY(${y}px)`;
            requestAnimationFrame(float);
        }

        setTimeout(float, index * 200);
    });


 

    const classified = document.querySelectorAll(".classified");

    classified.forEach(text => {
        setInterval(() => {
            text.style.opacity =
                text.style.opacity === "0.4" ? "1" : "0.4";
        }, 800);
    });


   

    const title = document.querySelector("h1");

    if (title) {
        let glow = 0;

        function pulse() {
            glow = (Math.sin(Date.now() / 800) + 1) / 2;
            title.style.textShadow =
                `0 0 ${glow * 20}px rgba(0,247,255,0.7)`;
            requestAnimationFrame(pulse);
        }

        pulse();
    }

});