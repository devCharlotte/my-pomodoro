let timerInterval;
let remainingTime = 0;

// Fetch the music information from music.txt
fetch("music/music.txt")
    .then((response) => response.text())
    .then((data) => {
        const alarmSoundSelect = document.getElementById("alarm-sound");
        const lines = data.split("\n").filter((line) => line.trim() !== "");

        // Populate the dropdown with the music information
        lines.forEach((line) => {
            const [filename, description] = line.split(" - ");
            const option = document.createElement("option");
            option.value = filename.trim();
            option.textContent = description.trim();
            alarmSoundSelect.appendChild(option);
        });
    })
    .catch((error) => console.error("Error loading music information:", error));

document.getElementById("start").addEventListener("click", () => {
    const hours = parseInt(document.getElementById("hours").value) || 0;
    const minutes = parseInt(document.getElementById("minutes").value) || 0;
    const seconds = parseInt(document.getElementById("seconds").value) || 0;

    remainingTime = hours * 3600 + minutes * 60 + seconds;

    if (remainingTime <= 0) {
        alert("Please set a valid time.");
        return;
    }

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
});

document.getElementById("pause").addEventListener("click", () => {
    clearInterval(timerInterval);
});

document.getElementById("reset").addEventListener("click", () => {
    clearInterval(timerInterval);
    remainingTime = 0;
    updateDisplay(0, 0, 0);
});

function updateTimer() {
    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        playSound();
        alert("Time's up!");
        return;
    }

    remainingTime--;

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    updateDisplay(hours, minutes, seconds);
}

function updateDisplay(hours, minutes, seconds) {
    document.getElementById("hours").value = hours;
    document.getElementById("minutes").value = minutes;
    document.getElementById("seconds").value = seconds;
}

function playSound() {
    const sound = document.getElementById("alarm-sound").value;
    const audio = new Audio(`music/${sound}`);
    audio.play();
}
