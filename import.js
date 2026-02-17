import {updateDarkMode} from './functions.js';

let newDrives;

function importDrives(event) {
    const file = event.target.files[0];
    console.log("File", file);

    // Check for errors
    if (!file) {
        alert("There was an error uploading your file. Please try again.");
        return;
    }

    // Read the file
    const reader = new FileReader();
    reader.onload = () => {
        console.log(reader.result);

        // Convert it to an array
        const rows = reader.result.split("\n");
        newDrives = rows.map(row => {
            return row.split(",")
        });
        newDrives.shift();
        console.log("New drives", newDrives);
    }
    reader.onerror = () => {
        alert("There was an error reading your file. Please try again");
    }
    reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => {
    // Use dark mode if needed
    updateDarkMode();

    // Add event listeners for buttons
    document.getElementById("fileSelectButton").addEventListener("click", () => {
        document.getElementById("fileSelect").click();
    });
    document.getElementById("fileSelect").addEventListener("change", importDrives);
});