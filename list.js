import {divideWithRemainder, updateDarkMode} from "./functions.js";

let selectedDrive; // Create variable to keep track of which drive is selected

function displayDrives() {
    // Format of drives:
    // [number of minutes, date and time, night true/false]

    const driveList = document.getElementById("driveList");
    driveList.innerHTML = ""; // Clear the list area first

    const drives = JSON.parse(localStorage.getItem("drives")) || []; // Get list of all drives

    // Display all drives
    for (let i = 0; i < drives.length; i++) {
        const item = document.createElement("li");
        item.setAttribute("class", "driveListItem");

        const date = document.createElement("h4");
        date.innerText = drives[i][1];

        const time = document.createElement("p");
        time.innerText = `${divideWithRemainder(drives[i][0], 60)[0]}hr ${divideWithRemainder(drives[i][0], 60)[1]}min`;

        if (drives[i][2]) {
            time.innerText = time.innerText + " Night";
        }

        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "button circleButton rightButton redButton");
        deleteButton.addEventListener("click", () => {
            selectedDrive = i;
            document.getElementById("confirm").hidden = false;
        });

        const deleteIcon = document.createElement("span");
        deleteIcon.setAttribute("class", "material-symbols-outlined");
        deleteIcon.innerText = "delete";
        deleteButton.appendChild(deleteIcon); // Add icon to the button

        // Add date and time to the list item
        item.appendChild(date);
        item.appendChild(time);
        item.appendChild(deleteButton);

        // Add the item to the list
        driveList.appendChild(item);
    }
}

function importDrive() {

}

function deleteDrive() {
    // Get drives from localStorage
    const drives = JSON.parse(localStorage.getItem("drives")) || [];

    // Remove item from the list
    drives.splice(selectedDrive, 1);

    // Save new list to localStorage
    const toSave = JSON.stringify(drives);
    localStorage.setItem("drives", toSave);

    // Update the display
    displayDrives();

    // Close the confirmation window
    document.getElementById("confirm").hidden = true;
}

document.addEventListener("DOMContentLoaded", () => {
    // Decide whether or not to use dark mode
    updateDarkMode();

    // Add event listeners for buttons
    document.getElementById("cancelConfirm").addEventListener("click", () => {
        document.getElementById('confirm').hidden = true
    });
    document.getElementById("deleteButton").addEventListener("click", deleteDrive)

    // Display list of saved drives
    displayDrives();
});
