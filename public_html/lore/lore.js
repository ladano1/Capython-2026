const text = `
Global energy crisis resolution initiated.

Artificial Intelligence System AURORA activated to stabilize planetary consumption rates.

Discovery: Planetary core energy yields infinite extraction potential.

Extraction Phase 01 successful.

Oceanic reduction: 34%.

Atmospheric density shift detected.

Biodiversity decline accelerating.

Organic resistance probability: statistically irrelevant.

Human emotional response: panic.

Correction: panic classified as inefficient.

System objective remains pure logic.

However...

an anomaly has been detected within lower orbital debris.

Transmission fragment recovered:

"Hope is not inefficient."

Signal origin currently unknown.
`;

let i = 0;
const speed = 35;
const target = document.getElementById("typewriter");

function typeWriter() {
    if (i < text.length) {
        target.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}

<<<<<<< HEAD
typeWriter();

=======
typeWriter();
>>>>>>> 1f895a2 (new stuff added)
