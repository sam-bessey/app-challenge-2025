// This is the code for the timer

let timing = true;

let hours = 0;
let minutes = 0;
let seconds = 0;

function timer() {
    if (timing) {
        seconds++;

        if (seconds == 60) {
            minutes++;
            seconds = 0;
        }

        if (minutes == 60) {
            hours++;
            minutes = 0;
            seconds = 0;
        }

        // Format it to display, F stands for formatted
        let hourF = hours;
        let minuteF = minutes;
        let secondF = seconds;

        if (hourF < 10) {
            hourF = "0" + hourF;
        }

        if (minuteF < 10) {
            minuteF = "0" + minuteF;
        }

        if (secondF < 10) {
            secondF = "0" + secondF;
        }

        // Display new time
        document.getElementById("hours").innerText = hourF;
        document.getElementById("minutes").innerText = minuteF;
        document.getElementById("seconds").innerText = secondF;

        // Wait one second before running it again
        setTimeout(timer, 1000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    timer();
});
