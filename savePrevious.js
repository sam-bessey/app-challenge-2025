function savePrevious(event) {
    // Format of drives:
    // [number of minutes, date and time, night true/false]

    // Stop page reload
    event.preventDefault();

    // Get form inputs
    const dateInput = document.getElementById("date").value;
    const timeInput = document.getElementById("time").value;
    const hoursInput = document.getElementById("hours").value;
    const minutesInput = document.getElementById("minutes").value;
    const totalMinutes = Number(hoursInput) * 60 + Number(minutesInput);

    // Is it night?
    let isNight;
    if (document.getElementById("dayAndNight").value == "Day") {
        isNight = false;
    } else {
        isNight = true;
    }

    // Get the current list of drives and then save the new drive
    const drives = JSON.parse(localStorage.getItem("drives")) || []; // Get list of all drives
    drives.push([totalMinutes, dateInput + " " + timeInput, isNight]); // Format and save to drives list
    const toSave = JSON.stringify(drives); // Format so its ready to be saved
    localStorage.setItem("drives", toSave); // And save it!

    // Redirect to homepage
    window.location.href = "index.html";
}
