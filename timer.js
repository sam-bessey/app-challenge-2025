// This is the code for the timer

function divideWithRemainder(number1, number2) {
    let quotient = Math.floor(number1 / number2);
    let remainder = number1 % number2;
    return [quotient, remainder];
}

let timing = true;

function timer() {
    if (timing) {
        // Get start time and split it to variables (S stands for Start)
        const startTime = sessionStorage.getItem("startTime");
        const times = startTime.split(":");
        const hourS = Number(times[0]);
        const minuteS = Number(times[1]);
        const secondS = Number(times[2]);

        // Get current time and split it to variables (N stands for Now)
        const date = new Date();
        const hourN = date.getHours();
        const minuteN = date.getMinutes();
        const secondN = date.getSeconds();

        // Get difference between start and current
        let hourD = hourN - hourS;
        let minuteD = minuteN - minuteS;
        let secondD = secondN - secondS;

        // Reformat it to use totalSeconds
        let totalSeconds = hourD * 360 + minuteD * 60 + secondD;
        hourD = divideWithRemainder(totalSeconds, 360)[0];
        minuteD = divideWithRemainder(
            divideWithRemainder(totalSeconds, 360)[1],
            60,
        )[0];
        secondD = divideWithRemainder(
            divideWithRemainder(totalSeconds, 360)[1],
            60,
        )[1];

        // Format it to display, F stands for formatted
        if (hourD < 10) {
            hourD = "0" + hourD;
        }

        if (minuteD < 10) {
            minuteD = "0" + minuteD;
        }

        if (secondD < 10) {
            secondD = "0" + secondD;
        }

        // Display new time
        document.getElementById("hours").innerText = hourD;
        document.getElementById("minutes").innerText = minuteD;
        document.getElementById("seconds").innerText = secondD;

        // Wait one second before running it again
        setTimeout(timer, 1000);
    }
}

function stopTimer() {
    // Stops timer and shows UI for saving

    timing = false;
    document.getElementById("saveUI").hidden = false;
    document.getElementById("doneButton").setAttribute("hidden", "");
}

function saveDrive() {
    // Format to save:
    // [number of minutes, date and time, night true/false]

    // Change save button to say "saving"
    document.getElementById("saveButton").innerText = "Saving...";
    document.getElementById("saveButton").style.filter = "grayscale()";

    // Find number of minutes driven
    const minutesToSave = hours * 60 + minutes;

    // Get date and format it in a user-friendly way
    // Example formatted date: 1/4/2025 14:45
    const date = new Date();
    const dateToSave =
        Number(Number(date.getMonth()) + 1) + // Add 1 to the month because getMonth() gives month numbers from 0-11, not 1-12
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes();

    // Is it night?
    let isNight;
    if (document.getElementById("dayAndNight").value === "Day") {
        isNight = false;
    } else {
        isNight = true;
    }

    // Get the current list of drives and then save the new drive
    const drives = JSON.parse(localStorage.getItem("drives")) || []; // Get list of all drives
    drives.push([minutesToSave, dateToSave, isNight]);
    const toSave = JSON.stringify(drives);
    localStorage.setItem("drives", toSave);

    // Redirect to homepage once saving finishes
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    // check if start time has been set yet, and if not, set it
    if (sessionStorage.getItem("startTime") === null) {
        console.log("Drive not started yet");

        // Get the current time and save it to sessionStorage
        const date = new Date();
        sessionStorage.setItem(
            "startTime",
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
        );
    }

    // Run timer
    timer();
});
