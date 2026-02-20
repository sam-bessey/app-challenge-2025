import {updateTheme} from "./functions.js";

document.addEventListener("DOMContentLoaded", () => {
    // Use dark mode if needed
    updateTheme();

    document.getElementById("theme").addEventListener("change", () => {
        // Update local storage
        localStorage.setItem("theme", document.getElementById("theme").value);

        // Update theme
    });
});