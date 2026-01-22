// This is the code for the timer
import {divideWithRemainder, updateDarkMode} from './functions.js';

let timing = true;
let hours = 0;
let minutes = 0;
let seconds = 0;

function timer() {
    if (timing) {
        // Get start time
        const startTime = JSON.parse(sessionStorage.getItem("startTime"));

        // Get current time
        const now = Date.now();

        // Get difference between start and current
        const timeDifference = now - startTime;

        // Reformat it to use totalSeconds
        console.log("total milliseconds", timeDifference);
        const totalSeconds = Math.floor(timeDifference / 1000);
        hours = divideWithRemainder(totalSeconds, 3600)[0];
        minutes = divideWithRemainder(
            divideWithRemainder(totalSeconds, 3600)[1],
            60,
        )[0];
        seconds = divideWithRemainder(
            divideWithRemainder(totalSeconds, 3600)[1],
            60,
        )[1];

        // Format it to display
        if (hours < 10) {
            hours = "0" + hours;
        }

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        // Display new time
        document.getElementById("hours").innerText = hours;
        document.getElementById("minutes").innerText = minutes;
        document.getElementById("seconds").innerText = seconds;

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
    const minutesToSave = Number(hours) * 60 + Number(minutes);

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
    if (document.getElementById("dayAndNight").value === "Day") {
        isNight = false;
    } else {
        isNight = true;
    }

    // Get the current list of drives and then save the new drive
    const drives = JSON.parse(localStorage.getItem("drives")) || []; // Get list of all drives
    drives.push([minutesToSave, dateToSave, isNight]);
    const toSave = JSON.stringify(drives);
    localStorage.setItem("drives", toSave);

    // Clear the start time from session storage
    sessionStorage.removeItem("startTime");

    // Redirect to homepage once saving finishes
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    // Check whether to use dark mode
    updateDarkMode();

    // check if start time has been set yet, and if not, set it
    if (sessionStorage.getItem("startTime") === null) {
        console.log("Drive not started yet");

        // Get the current time and save it to sessionStorage
        const date = new Date();
        sessionStorage.setItem(
            "startTime",
            JSON.stringify(Date.now())
        );
    }

    // Add event listeners
    document.getElementById("doneButton").addEventListener("click", stopTimer);
    document.getElementById("deleteButton").addEventListener("click", () => {
        sessionStorage.removeItem('startTime');
        window.location.href = 'index.html'
    })
    document.getElementById("saveButton").addEventListener("click", saveDrive);

    // Run timer
    timer();
});
