// This is the code for the timer

let timing = true;

let hours = 0;
let minutes = 0;
let seconds = 0;

function timer() {
    if (timing) {
        seconds++;

        if (seconds == 60) {
            minutes++;
            seconds = 0;
        }

        if (minutes == 60) {
            hours++;
            minutes = 0;
            seconds = 0;
        }

        // Format it to display, F stands for formatted
        let hourF = hours;
        let minuteF = minutes;
        let secondF = seconds;

        if (hourF < 10) {
            hourF = "0" + hourF;
        }

        if (minuteF < 10) {
            minuteF = "0" + minuteF;
        }

        if (secondF < 10) {
            secondF = "0" + secondF;
        }

        // Display new time
        document.getElementById("hours").innerText = hourF;
        document.getElementById("minutes").innerText = minuteF;
        document.getElementById("seconds").innerText = secondF;

        // Wait one second before running it again
        setTimeout(timer, 1000);
    }
}

function stopTimer() {
    // Stops timer and shows UI for saving

    timing = false;
    document.getElementById("saveUI").hidden = false;
    document.getElementById("doneButton").setAttribute("hidden", "");
}

function saveDrive() {
    // Format to save:
    // [number of minutes, date and time, night true/false]

    // Change save button to say "saving"
    document.getElementById("saveButton").innerText = "Saving...";
    document.getElementById("saveButton").style.filter = "grayscale()";

    // Find number of minutes driven
    const minutesToSave = hours * 60 + minutes;

    // Get date and format it in a user-friendly way
    // Example formatted date: 1/4/2025 14:45
    const date = new Date();
    const dateToSave =
        Number(Number(date.getMonth()) + 1) + // Add 1 to the month because getMonth() gives month numbers from 0-11, not 1-12
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes();

    // Is it night?
    let isNight;
    if (document.getElementById("dayAndNight").value == "Day") {
        isNight = false;
    } else {
        isNight = true;
    }

    // Get the current list of drives and then save the new drive
    const drives = JSON.parse(localStorage.getItem("drives")) || []; // Get list of all drives
    drives.push([minutesToSave, dateToSave, isNight]);
    const toSave = JSON.stringify(drives);
    localStorage.setItem("drives", toSave);

    // Redirect to homepage once saving finishes
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    timer();
});
