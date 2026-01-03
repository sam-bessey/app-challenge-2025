console.log("hello world");

function divideWithRemainder(number1, number2) {
    let quotient = Math.floor(number1 / number2)
    let remainder = number1 % number2
    return [quotient, remainder]
}

function getData() {
    // Gets saved data and updates homepage with it

    // Check if new user or not
    if (localStorage.getItem("usedBefore") == null) {
        // TODO: Show login page here

        // For now just reset all local storage. Once login page is finished, this will not be here
        localStorage.setItem("minutes", 0)
        localStorage.setItem("minutesNight", 0)
        localStorage.setItem("drives", "[]")
        localStorage.setItem("usedBefore", "yes")
    } else {
        let minutes = localStorage.getItem("minutes"); // Total number of minutes driving, including night
        let nightMinutes = localStorage.getItem("minutesNight"); // Number of minutes at night

        let drives = JSON.parse(localStorage.getItem("drives")) || []; // Get list of all drives
        console.log("drives:", drives);

        // Update display
        document.getElementById("totalHours").innerText = `${divideWithRemainder(minutes, 60)[0]}hr ${divideWithRemainder(minutes, 60)[1]}min`
        document.getElementById("nightHours").innerText = `${divideWithRemainder(nightMinutes, 60)[0]}hr ${divideWithRemainder(nightMinutes, 60)[1]}min`
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Get data after page loads
    getData();
});
