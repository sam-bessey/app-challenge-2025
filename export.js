import { divideWithRemainder, updateTheme, getData } from "./functions.js";
import { PDFDocument } from "https://cdn.jsdelivr.net/npm/pdf-lib/+esm";

function exportCsv() {
    // Get drives from localStorage
    const drives = JSON.parse(localStorage.getItem("drives")) || [];
    let formattedDrives = [];

    // Format drives to save to CSV
    for (let i = 0; i < drives.length; i++) {
        // Format time
        const time =
            divideWithRemainder(drives[i][0], 60)[0] +
            "hr " +
            divideWithRemainder(drives[i][0], 60)[1] +
            "min";

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
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create link element to start the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "drives.csv";

    // Append the link element to the document, then click it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function exportForm() {
    const data = getData();

    const existingPdfBytes = await fetch(
        "MVE-21 Permittee Driving Log Rev 10-25_2.pdf",
    ).then((res) => res.arrayBuffer());

    // Get pdf and some pages
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    // decide how many pages are needed (25 rows per page)
    const pagesNeeded = Math.ceil(data[0].length / 25);

    // create pages 2-? if needed
    if (pagesNeeded > 2) {
        // create pages if needed
        for (let i = 0; i < pagesNeeded - 2; i++) {
            // get blank page (blank does not mean EMPTY. it means no other forms besides driving log
            const blankDoc = await PDFDocument.load(
                await fetch("BLANK driving log.pdf").then((res) =>
                    res.arrayBuffer(),
                ),
            );
            const blankPage = blankDoc.getPages()[0];
            const [willCopy] = await pdfDoc.copyPages(blankDoc, [0]);

            // and insert it!
            const newPage = pdfDoc.insertPage(1, willCopy);

            // do weird stuff with the forms:

            // find the forms
            const blankForm = blankDoc.getForm();
            const destForm = pdfDoc.getForm();

            // recreate the form fields on the destination page
            const blankFields = blankForm.getFields();
            blankFields.forEach((field) => {
                const fieldName = `${field.getName()}_${i + 3}`; // add 3 to the end because 2 is the last page
                const newTextField = destForm.createTextField(fieldName);

                // Get position/dimensions from existing field widgets if needed
                const widgets = field.acroField.getWidgets();
                if (widgets.length > 0) {
                    const rect = widgets[0].getRectangle();
                    newTextField.addToPage(newPage, {
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height,
                        borderWidth: 0,
                    });
                }
            });
        }
    }

    // get the form and fields
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    // log form fields
    console.log("Available Form Fields:");
    fields.forEach((field) => {
        const name = field.getName();
        const type = field.constructor.name; // Displays PDFTextField, PDFCheckBox, etc.
        console.log(`- Name: "${name}" | Type: ${type}`);
    });

    // Fill out the fields that only appear once
    form.getTextField("TOTAL HOURS OF PRACTICE DRIVING").setText(
        `${divideWithRemainder(getData()[1], 60)[0]}hr ${divideWithRemainder(getData()[1], 60)[1]}min`,
    );
    form.getTextField("TOTAL HOURS OF NIGHT DRIVING").setText(
        `${divideWithRemainder(getData()[2], 60)[0]}hr ${divideWithRemainder(getData()[2], 60)[1]}min`,
    );

    // Fill out the actual driving

    // page 1
    for (let i = 0; i < Math.min(data[0].length, 25); i++) {
        form.getTextField(`Date and TimeRow${i + 1}`).setText(data[0][i][1]);
    }

    // save it and stuff like that
    const pdfBytes = await pdfDoc.save();

    // Create blob with CSV data and a url for it
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const fileUrl = window.URL.createObjectURL(blob);

    // Create link element to start the download
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = "Driving Log.csv";

    // Append the link element to the document, then click it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.addEventListener("DOMContentLoaded", () => {
    // Check whether to use dark mode
    updateTheme();

    // Add event listeners
    document.getElementById("exportCsv").addEventListener("click", exportCsv);
    document.getElementById("exportForm").addEventListener("click", exportForm);
});
