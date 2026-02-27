document.addEventListener("DOMContentLoaded", () => {

 
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
           
            pct += Math.floor(Math.random() * 9) + 3; // 3..11
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

    
    const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, .typewriter, .glitch");
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
            `X:${e.clientX.toString().padStart(4, "0")} Y:${e.clientY.toString().padStart(4, "0")}`;
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