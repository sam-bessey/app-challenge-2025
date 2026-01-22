import {divideWithRemainder, updateDarkMode} from './functions.js';

function getData() {
    // Gets saved data and updates homepage with it

    // Check if new user or not
    if (localStorage.getItem("usedBefore") == null) {
        // TODO: Show login page here

        // For now just reset all local storage. Once login page is finished, this will not be here
        localStorage.setItem("drives", "[]");
        localStorage.setItem("usedBefore", "yes");
    } else {
        // Format of drives:
        // [number of minutes, date and time, night true/false]

        let drives = JSON.parse(localStorage.getItem("drives")) || []; // Get list of all drives
        console.log("drives:", drives);

        // Find total minutes and night minutes from this list of all drives
        let minutes = 0;
        let nightMinutes = 0;
        for (let i = 0; i < drives.length; i++) {
            minutes += drives[i][0];

            // If drive was at night, also add to the night minutes
            if (drives[i][2]) {
                nightMinutes += drives[i][0];
            }
        }

        // Update display
        document.getElementById("totalHours").innerText =
            `${divideWithRemainder(minutes, 60)[0]}hr ${divideWithRemainder(minutes, 60)[1]}min`;
        document.getElementById("nightHours").innerText =
            `${divideWithRemainder(nightMinutes, 60)[0]}hr ${divideWithRemainder(nightMinutes, 60)[1]}min night`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Decide whether or not to use dark mode
    updateDarkMode();

    // Get data after page loads
    getData();
});
