document.addEventListener("DOMContentLoaded", () => {

    const launchBtn = document.querySelector(".launch-btn");
    const warningBox = document.querySelector(".warning-box");
    const overview = document.querySelector(".overview");
    const glitchText = document.querySelector(".glitch");

    launchBtn.addEventListener("click", () => {

        // Disable button after click
        launchBtn.disabled = true;
        launchBtn.textContent = "INITIALIZING...";

        // Add flicker effect
        document.body.style.animation = "flicker 0.2s infinite";

        setTimeout(() => {
            document.body.style.animation = "";
            launchSequence();
        }, 2000);
    });

    function launchSequence() {

        warningBox.innerHTML = "<h2>ACCESS GRANTED</h2><p>Launching infiltration protocol...</p>";
        glitchText.textContent = "MISSION ACTIVE";
        glitchText.setAttribute("data-text", "MISSION ACTIVE");

        typeEffect(overview,
            "Connecting to AI flagship...\nBypassing security layers...\nEnergy core located...\nHope restored."
        );
    }

    function typeEffect(element, text) {
        element.innerHTML = "";
        let index = 0;

        const interval = setInterval(() => {
            if (index < text.length) {
                element.innerHTML += text.charAt(index) === "\n" ? "<br>" : text.charAt(index);
                index++;
            } else {
                clearInterval(interval);
                launchBtn.textContent = "MISSION DEPLOYED";
            }
        }, 40);
    }

});