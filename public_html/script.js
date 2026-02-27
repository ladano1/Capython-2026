

document.addEventListener("DOMContentLoaded", () => {



    const coords = document.createElement("div");
    coords.classList.add("hud-coords");
    document.body.appendChild(coords);

    document.addEventListener("mousemove", (e) => {
        coords.innerText = 
            `X:${e.clientX.toString().padStart(4, "0")}  Y:${e.clientY.toString().padStart(4, "0")}`;
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


    const bootScreen = document.createElement("div");
    bootScreen.classList.add("boot-screen");
    bootScreen.innerHTML = `
        <div class="boot-text">
            INITIALIZING AI CORE...
        </div>
    `;
    document.body.appendChild(bootScreen);

    setTimeout(() => {
        bootScreen.style.opacity = "0";
        setTimeout(() => bootScreen.remove(), 1000);
    }, 2500);


    const btn = document.querySelector(".launch-btn");
    if (btn) {
        btn.addEventListener("click", () => {
            document.body.classList.add("glitch-burst");
            setTimeout(() => {
                document.body.classList.remove("glitch-burst");
            }, 300);
        });
    }

});


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

setTimeout(() => {
    document.querySelectorAll(".typewriter").forEach(el => {
        typeWriter(el, 35);
    });
}, 2600);