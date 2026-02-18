import {updateDarkMode} from './functions.js';

let formattedDrives = []; // Imported drives, formatted the same as the rest of the app

function convertTime(time) {
    // Converts time as a string ("1hr 30min") to a number of minutes

    const hours = Number(time.split(" ")[0].split("hr")[0]);
    const minutes = Number(time.split(" ")[1].split("min")[0]);

    return hours * 60 + minutes;
}

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
        let importedDrives = rows.map(row => {
            return row.split(",");
        });
        importedDrives.shift(); // Remove the header row

        // Format it so it's compatible with the rest of the app
        for (let i = 0; i < importedDrives.length; i++) {
            formattedDrives.push([convertTime(importedDrives[i][1]), importedDrives[i][0], importedDrives[i][2] !== "0"]);
        }

        console.log("New drives", formattedDrives);

        // Hide file upload menu and show add/replace menu
        document.getElementById("upload").hidden = true;
        document.getElementById("controls").hidden = false;
    };

    // Show error message if something goes wrong
    reader.onerror = () => {
        alert("There was an error reading your file. Please try again");
    };

    // Read the file!
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

    document.getElementById("replaceButton").addEventListener("click", () => {
        // Replace drive list with new drives
        const toSave = JSON.stringify(formattedDrives); // Format so it's ready to be saved
        localStorage.setItem("drives", toSave); // And save it!

        // Redirect to my drives page so people can see the new drives
        window.location.href = "list.html";
    });

    document.getElementById("keepButton").addEventListener("click", () => {
        const drives = JSON.parse(localStorage.getItem("drives")) || []; // Get list of all drives

        // Add these drives to the end of the list
        for (let i = 0; i < formattedDrives.length; i++) {
            drives.push(formattedDrives[i]);
        }

        const toSave = JSON.stringify(drives); // Format so it's ready to be saved
        localStorage.setItem("drives", toSave); // And save it!

        // Redirect to my drives page so people can see the new drives
        window.location.href = "list.html";
    });
});