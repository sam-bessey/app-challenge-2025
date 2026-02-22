import {divideWithRemainder, updateDarkMode} from "./functions.js";

let selectedDrive; // Create variable to keep track of which drive is selected

function convertDate(originalDate) {
    // Converts date to format yyyy-mm-dd to use in things like input type date
    // Original date should be like mm/dd/yyyy or m/d/yyyy

    // Get original dates
    let year = originalDate.split("/")[2];
    let month = originalDate.split("/")[0];
    let day = originalDate.split("/")[1];

    // Add 0s at the start of the month and day if necesary
    if (month.length === 1) {
        month = "0" + month;
    }
    if (day.length === 1) {
        day = "0" + day;
    }

    return year + "-" + month + "-" + day;
}

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

        // Date of drive
        const date = document.createElement("h4");
        date.innerText = drives[i][1];

        // Time spent
        const time = document.createElement("p");
        time.innerText = `${divideWithRemainder(drives[i][0], 60)[0]}hr ${divideWithRemainder(drives[i][0], 60)[1]}min`;
        if (drives[i][2]) {
            time.innerText = time.innerText + " Night";
        }

        // Div to hold controls
        const controls = document.createElement("div");
        controls.setAttribute("class", "rightSide");

        // Edit drive
        const editButton = document.createElement("button");
        editButton.setAttribute("class", "button circleButton secondaryButton");
        editButton.addEventListener("click", () => {
            selectedDrive = i;
            document.getElementById("edit").hidden = false;

            // Fill out drive info
            document.getElementById("date").value = convertDate(drives[i][1].split(" ")[0]);
            document.getElementById("time").value = drives[i][1].split(" ")[1];
            document.getElementById("hours").value = divideWithRemainder(drives[i][0], 60)[0];
            document.getElementById("minutes").value = divideWithRemainder(drives[i][0], 60)[1];
            if (drives[i][2]) {
                document.getElementById("dayAndNight").value = "Night";
            } else {
                document.getElementById("dayAndNight").value = "Day"
            }
        });

        const editIcon = document.createElement("span");
        editIcon.setAttribute("class", "material-symbols-outlined");
        editIcon.innerText = "edit";
        editButton.appendChild(editIcon); // Add icon to the button

        // Delete drive
        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "button circleButton redButton");
        deleteButton.addEventListener("click", () => {
            selectedDrive = i;
            document.getElementById("confirm").hidden = false;
        });

        const deleteIcon = document.createElement("span");
        deleteIcon.setAttribute("class", "material-symbols-outlined");
        deleteIcon.innerText = "delete";
        deleteButton.appendChild(deleteIcon); // Add icon to the button

        // Append everything
        item.appendChild(date);
        item.appendChild(time);
        controls.appendChild(editButton);
        controls.appendChild(deleteButton);
        item.appendChild(controls);

        // Add the item to the list
        driveList.appendChild(item);
    }
}

function editDrive() {
    // Get drives from localStorage
    const drives = JSON.parse(localStorage.getItem("drives")) || [];

    // Get form inputs
    const dateInput = document.getElementById("date").value;
    const timeInput = document.getElementById("time").value;
    const hoursInput = document.getElementById("hours").value;
    const minutesInput = document.getElementById("minutes").value;
    const totalMinutes = Number(hoursInput) * 60 + Number(minutesInput);

    // Check if the form is valid
    if (dateInput === "" || timeInput === "" || totalMinutes === 0) {
        console.log("Form is invalid!!!");
        alert("You are missing some information. Make sure everything is filled out correctly, then try again.");
        return;
    }

    // Is it night?
    let isNight;
    if (document.getElementById("dayAndNight").value === "Day") {
        isNight = false;
    } else {
        isNight = true;
    }

    // Format the date correctly
    const formattedDate = new Date(dateInput.split("-")[0], dateInput.split("-")[1] - 1, dateInput.split("-")[2]).toLocaleDateString("en-US");
    console.log("FOrmatted date", formattedDate)

    // Replace saved drive with edited drive
    drives[selectedDrive] = [totalMinutes, formattedDate + " " + timeInput, isNight];
    localStorage.setItem("drives", JSON.stringify(drives));

    // Update drive list
    displayDrives();

    // Close the edit menu
    document.getElementById("edit").hidden = true;
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
        document.getElementById('confirm').hidden = true;
    });
    document.getElementById("deleteButton").addEventListener("click", deleteDrive);
    document.getElementById("cancelEdit").addEventListener("click", () => {
        document.getElementById('edit').hidden = true;
    });
    document.getElementById("saveEdit").addEventListener("click", editDrive);

    // Display list of saved drives
    displayDrives();
});
