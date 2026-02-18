import {divideWithRemainder, updateDarkMode} from './functions.js';

function exportCsv() {
    // Get drives from localStorage
    const drives = JSON.parse(localStorage.getItem("drives")) || [];
    let formattedDrives = [];

    // Format drives to save to CSV
    for (let i = 0; i < drives.length; i++) {
        // Format time
        const time = divideWithRemainder(drives[i][0], 60)[0] + "hr " + divideWithRemainder(drives[i][0], 60)[1] + "min";

        // Append to list
        if (drives[i][2]) {
            // If night drive
            formattedDrives.push([drives[i][1], time, time]);
        } else {
            // If daytime drive
            formattedDrives.push([drives[i][1], time, "0"]);
        }
    }

    // Create CSV rows
    let csv = [["Date", "Total Time", "Night time"]];
    csv.push(...formattedDrives);
    console.log("CSV rows", csv);

    // Add newlines to CSV
    csv = csv.join("\n");
    console.log("CSV string", csv);

    // Create blob with CSV data and a url for it
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);

    // Create link element to start the download
    const a = document.createElement('a');
    a.href = url;
    a.download = "drives.csv";

    // Append the link element to the document, then click it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.addEventListener("DOMContentLoaded", () => {
    // Check whether to use dark mode
    updateDarkMode();

    // Add event listeners
    document.getElementById("exportCsv").addEventListener("click", exportCsv);
});