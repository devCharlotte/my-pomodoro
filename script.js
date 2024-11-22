let timerInterval;
let remainingTime = 0;
let totalTime = 0;

// Fetch the music information from music.txt
fetch("music.txt")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch music list.");
        }
        return response.text();
    })
    .then((data) => {
        const alarmSoundSelect = document.getElementById("alarm-sound");
        alarmSoundSelect.innerHTML = ""; // Clear placeholder options
        const lines = data.split("\n").filter((line) => line.trim() !== "");

        if (lines.length === 0) {
            const option = document.createElement("option");
            option.textContent = "No music available";
            option.disabled = true;
            alarmSoundSelect.appendChild(option);
        } else {
            // Populate the dropdown with the music information
            lines.forEach((line) => {
                const [filename, description] = line.split(" - ");
                const option = document.createElement("option");
                option.value = filename.trim();
                option.textContent = description.trim();
                alarmSoundSelect.appendChild(option);
            });
        }
    })
    .catch((error) => {
        console.error("Error loading music information:", error);
        const alarmSoundSelect = document.getElementById("alarm-sound");
        alarmSoundSelect.innerHTML = ""; // Clear placeholder options
        const option = document.createElement("option");
        option.textContent = "Error loading music";
        option.disabled = true;
        alarmSoundSelect.appendChild(option);
    });

document.getElementById("start").addEventListener("click", () => {
    const input = prompt("Set timer duration:\nEnter seconds (e.g., 45) or minutes (e.g., 1m, 90m):");

    if (!input) {
        alert("No input provided.");
        return;
    }

    const time = parseInput(input);

    if (time === null || time < 0 || time > 5400) {
        alert("Please enter a valid time between 0 seconds and 90 minutes (5400 seconds).");
        return;
    }

    totalTime = time;
    remainingTime = totalTime;

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    updateProgress(1);
});

document.getElementById("pause").addEventListener("click", () => {
    clearInterval(timerInterval);
});

document.getElementById("reset").addEventListener("click", () => {
    clearInterval(timerInterval);
    remainingTime = 0;
    totalTime = 0;
    updateProgress(0);
    updateTimeDisplay(0);
});

function parseInput(input) {
    const secondsPattern = /^[0-9]+$/;
    const minutesPattern = /^([0-9]+)m$/;

    if (secondsPattern.test(input)) {
        return parseInt(input, 10);
    } else if (minutesPattern.test(input)) {
        return parseInt(input.match(minutesPattern)[1], 10) * 60;
    }

    return null;
}

function updateTimer() {
    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        playSoundAndShowPopup();
        return;
    }

    remainingTime--;
    updateProgress(remainingTime / totalTime);
    updateTimeDisplay(remainingTime);
}

function updateTimeDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById("time-display").textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateProgress(progress) {
    const circle = document.getElementById("progress-circle");
    const offset = 565 * (1 - progress);
    circle.style.strokeDashoffset = offset;
}

function playSoundAndShowPopup() {
    const sound = document.getElementById("alarm-sound").value;

    if (sound) {
        const audio = new Audio(`music/${sound}`);
        audio.play();
    }

    const popup = document.createElement("div");
    popup.id = "custom-popup";
    popup.textContent = "Time's up!";
    document.body.appendChild(popup);

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => popup.remove());
    popup.appendChild(closeButton);
}
