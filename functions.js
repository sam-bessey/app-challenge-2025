// Functions that other files can use

export function divideWithRemainder(number1, number2) {
    let quotient = Math.floor(number1 / number2);
    let remainder = number1 % number2;
    return [quotient, remainder];
}

export function updateTheme() {
    // Use dark mode (or not) depending on time of day

    // Check sessionStorage for dark mode
    let darkMode;
    if (sessionStorage.getItem("darkMode") === null) {
        // Session storage not set yet
        // Try to guess if its day or night based on the current time (day is between 7am and 6pm)
        const date = new Date();
        darkMode = date.getHours() <= 6 || date.getHours() >= 18;
        sessionStorage.setItem("darkMode", darkMode);
    } else {
        darkMode = JSON.parse(sessionStorage.getItem("darkMode"));
    }

    // set dark mode if needed
    if (darkMode) {
        document.getElementById("body").classList.add("darkMode");
    } else {
        document.getElementById("body").classList.remove("darkMode");
    }
}

export function getData() {
    // Check if new user or not
    if (localStorage.getItem("usedBefore") == null) {
        // TODO: Show login page here

        // For now just reset all local storage. Once login page is finished, this will not be here
        localStorage.setItem("drives", "[]");
        localStorage.setItem("usedBefore", "yes");
        window.location.reload(); // also delete this eventually
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
        // Returns: [list of drives, total minutes, night minutes]
        console.log("MINUTES:", minutes);
        return [drives, minutes, nightMinutes];
    }

}