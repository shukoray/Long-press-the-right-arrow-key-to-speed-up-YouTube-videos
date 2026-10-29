const speedSelect = document.getElementById("speedSelect");

// when opening popup, read the previously saved speed
chrome.storage.local.get(["speed"], (result) => {
    if (result.speed) {
        speedSelect.value = result.speed;
    }
});

// when user selects a new speed, save it
speedSelect.addEventListener("change", () => {
    const speed = Number(speedSelect.value);

    chrome.storage.local.set({
        speed: speed
    });

    console.log("Saved speed:", speed);
});