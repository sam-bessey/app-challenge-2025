import {divideWithRemainder, getData, updateTheme} from './functions.js';

function updateHomepage() {
    // Gets saved data and updates homepage with it

    // Update display
    document.getElementById("totalHours").innerText = `${divideWithRemainder(getData()[1], 60)[0]}hr ${divideWithRemainder(getData()[1], 60)[1]}min`;
    document.getElementById("nightHours").innerText = `${divideWithRemainder(getData()[2], 60)[0]}hr ${divideWithRemainder(getData()[2], 60)[1]}min night`;

}

document.addEventListener("DOMContentLoaded", () => {
    // Decide whether or not to use dark mode
    updateTheme();

    // Get data after page loads
    updateHomepage();

    // Update progress bar
    const progressBar = document.getElementById("totalProgress");
    let progress = 0;
    let endValue = getData()[1] / 4200 * 100;

    const nightProgressBar = document.getElementById("nightProgress");
    let nightProgress = 0;
    let nightEndValue = getData()[2] / 600 * 100;

    const progressInterval = setInterval(() => {
        progress += 0.25;

        // Update the gradient
        progressBar.style.background = `conic-gradient(
        var(--totalProgressColor) ${progress * 3.6}deg, 
        var(--backgroundColor) ${progress * 3.6}deg
          )`;

        // Check if animation can finish
        if (progress >= endValue) {
            clearInterval(progressInterval);
        }
    }, 5);
    const nightProgressInterval = setInterval(() => {
        nightProgress += 0.15;

        // Update the gradient
        nightProgressBar.style.background = `conic-gradient(
            var(--nightProgressColor) ${nightProgress * 3.6}deg, 
            var(--backgroundColor) ${nightProgress * 3.6}deg
            )`;

        // Check if animation can finish
        if (nightProgress >= nightEndValue) {
            clearInterval(nightProgressInterval);
        }
    }, 5);
});
