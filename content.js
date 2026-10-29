let originalSpeed = 1;
let speeding = false;
let holdTimer = null;
let keyDown = false;

const HOLD_DELAY = 300;


document.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight") return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (keyDown) return;
    keyDown = true;

    const video = document.querySelector("video");
    if (!video) return;

    holdTimer = setTimeout(() => {
        originalSpeed = video.playbackRate;
        chrome.storage.local.get(["speed"], (result) => {
            const selectedSpeed = result.speed ?? 2;
            video.playbackRate = selectedSpeed;
            speeding = true;
            showSpeedIndicator(selectedSpeed);
            console.log("Speeding:", selectedSpeed);
        });
    }, HOLD_DELAY);
}, true);


document.addEventListener("keyup", (event) => {
    if (event.key !== "ArrowRight") return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const video = document.querySelector("video");
    if (!video) return;

    clearTimeout(holdTimer);

    if (speeding) {
        video.playbackRate = originalSpeed;
        hideSpeedIndicator();
        speeding = false;
        console.log("Restored:", originalSpeed);
    } else {
        video.currentTime += 5;
        showSkipIndicator();
        console.log("Skip +5 seconds");
    }
    keyDown = false;
}, true);

function showSpeedIndicator(speed) {
    // prevent multiple indicators from being created
    if (document.getElementById("hold-speed-indicator")) {
        return;
    }

    const indicator = document.createElement("div");

    indicator.id = "hold-speed-indicator";
    indicator.textContent = `${speed}x`;

    indicator.style.position = "fixed";
    indicator.style.top = "80px";
    indicator.style.left = "50%";
    indicator.style.transform = "translateX(-50%)";

    indicator.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    indicator.style.color = "white";

    indicator.style.padding = "8px 16px";
    indicator.style.borderRadius = "20px";

    indicator.style.fontSize = "16px";
    indicator.style.fontWeight = "bold";

    indicator.style.zIndex = "999999";

    document.body.appendChild(indicator);
}


function hideSpeedIndicator() {
    const indicator = document.getElementById("hold-speed-indicator");

    if (indicator) {
        indicator.remove();
    }
}

function showSkipIndicator() {
    const indicator = document.createElement("div");

    indicator.id = "skip-indicator";
    indicator.textContent = "+5 seconds";

    indicator.style.position = "fixed";
    indicator.style.top = "50%";
    indicator.style.left = "70%";
    indicator.style.transform = "translate(-50%, -50%)";

    indicator.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    indicator.style.color = "white";
    indicator.style.padding = "10px 18px";
    indicator.style.borderRadius = "20px";
    indicator.style.fontSize = "16px";
    indicator.style.fontWeight = "bold";
    indicator.style.zIndex = "999999";
    indicator.style.pointerEvents = "none";

    document.body.appendChild(indicator);

    setTimeout(() => {
        indicator.remove();
    }, 500);
}