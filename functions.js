// Functions that other files can use

export function divideWithRemainder(number1, number2) {
    let quotient = Math.floor(number1 / number2);
    let remainder = number1 % number2;
    return [quotient, remainder];
}

function decideDarkMode() {
    // Try to guess if its day or night based on the current time (day is between 7am and 6pm)
    const date = new Date();
    return date.getHours() <= 6 || date.getHours() >= 18;
}

export function updateDarkMode() {
    // Use dark mode (or not) depending on time of day

    // Check sessionStorage for dark mode
    let darkMode;
    if (sessionStorage.getItem("darkMode") === null) {
        // Session storage not set yet
        darkMode = decideDarkMode();
        sessionStorage.setItem("darkMode", darkMode);
    } else {
        darkMode = JSON.parse(sessionStorage.getItem("darkMode"));
    }

    // set dark mode if needed
    if (darkMode) {
        document.getElementById("body").classList.add("darkMode");
    }
}