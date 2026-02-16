import {updateDarkMode} from './functions.js';

function importDrives() {

}

document.addEventListener("DOMContentLoaded", () => {
    // Use dark mode if needed
    updateDarkMode();

    // Add event listeners for buttons
    document.getElementById("fileSelectButton").addEventListener("click", () => {
        document.getElementById("fileSelect").click();
    });
    document.getElementById("fileSelect").addEventListener("change", importDrives)
});