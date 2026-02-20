import {updateDarkMode} from './functions.js';

function savePrevious(event) {
    // Format of drives:
    // [number of minutes, date and time, night true/false]

    // Stop page reload
    event.preventDefault();

    // Get form inputs
    const dateInput = document.getElementById("date").value;
    const timeInput = document.getElementById("time").value;
    const hoursInput = document.getElementById("hours").value;
    const minutesInput = document.getElementById("minutes").value;
    const totalMinutes = Number(hoursInput) * 60 + Number(minutesInput);

    // Check if the form is valid
    if (dateInput === "" || timeInput === "" || totalMinutes === 0) {
        console.log("Form is invalid!!!");
        alert("You are missing some information. Make sure everything is filled out correctly, then try again.");
        return;
    }

    // Is it night?
    let isNight;
    if (document.getElementById("dayAndNight").value === "Day") {
        isNight = false;
    } else {
        isNight = true;
    }

    // Format the date correctly
    let formattedDate = new Date(dateInput);
    formattedDate = formattedDate.toLocaleDateString("en-US");

    // Get the current list of drives and then save the new drive
    const drives = JSON.parse(localStorage.getItem("drives")) || []; // Get list of all drives
    drives.push([totalMinutes, formattedDate + " " + timeInput, isNight]); // Format and save to drives list
    const toSave = JSON.stringify(drives); // Format so it's ready to be saved
    localStorage.setItem("drives", toSave); // And save it!

    // Redirect to homepage
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    // Use dark mode if needed
    updateDarkMode();

    // Add event listeners for buttons
    document.getElementById("submit").addEventListener("click", () => {
        savePrevious(event);
    });
});