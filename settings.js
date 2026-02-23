import {updateTheme} from "./functions.js";

document.addEventListener("DOMContentLoaded", () => {
    // Use dark mode if needed
    updateTheme();

    // Update theme menu to show current theme
    document.getElementById("theme").value = localStorage.getItem("theme") || "Pink";

    document.getElementById("theme").addEventListener("change", () => {
        // Update local storage
        localStorage.setItem("theme", document.getElementById("theme").value);

        // Update theme
        updateTheme();
    });
});
