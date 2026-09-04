import { divideWithRemainder, updateTheme, getData } from "./functions.js";
import { PDFDocument, TextAlignment } from "https://cdn.jsdelivr.net/npm/pdf-lib/+esm";

async function exportForm(event) {
    // stop page reload!
    event.preventDefault();

    // Get form inputs
    const supervisingNameAge =
        document.getElementById("supervisingNameAge").value;
    const supervisingLicense =
        document.getElementById("supervisingLicense").value;

    // Check if the form is valid
    if (supervisingNameAge === "" || supervisingLicense === "") {
        console.log("Form is invalid!!!");
        alert(
            "You are missing some information. Make sure everything is filled out correctly, then try again.",
        );
        return;
    }

    // Get the data and all that
    const data = getData();

    const existingPdfBytes = await fetch(
        "MVE-21 Permittee Driving Log Rev 10-25_2.pdf",
    ).then((res) => res.arrayBuffer());

    // Get pdf and some pages
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    // decide how many pages are needed (25 rows per page)
    const pagesNeeded = Math.ceil(data[0].length / 25);

    // create pages if needed
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
            const newPage = pdfDoc.insertPage(i + 1, willCopy);

            // do weird stuff to get the forms to work:

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
                    newTextField.setAlignment(TextAlignment.Center);
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

    // Page 1
    for (let i = 0; i < Math.min(data[0].length, 25); i++) {
        form.getTextField(`Date and TimeRow${i + 1}`).setText(data[0][i][1]);

        // time spent driving in easy to read format
        const time =
            divideWithRemainder(data[0][i][0], 60)[0] +
            "hr " +
            divideWithRemainder(data[0][i][0], 60)[1] +
            "min";
        form.getTextField(`Number of Driving HoursRow${i + 1}`).setText(time);
        if (data[0][i][2]) {
            form.getTextField(
                `Number of After Dark Driving HoursRow${i + 1}`,
            ).setText(time);
        } else {
            form.getTextField(
                `Number of After Dark Driving HoursRow${i + 1}`,
            ).setText("0");
        }

        // supervising driver stuff
        form.getTextField(
            `Supervising Drivers Name and AgeRow${i + 1}`,
        ).setText(supervisingNameAge);
        form.getTextField(
            `License Number of Supervising DriverRow${i + 1}`,
        ).setText(supervisingLicense);
    }

    // Middle pages
    if (pagesNeeded > 2) {
        // Go through each page (remember page 2 is the last one, so 3 is the second page)
        for (let page = 3; page < pagesNeeded + 1; page++) {
            // Go through the 25 items for this page. We know its a full 25 because if it wasn't, we would be on the last page, not a middle one.
            for (let i = 0; i < 25; i++) {
                console.log("NOW ON PAGE", page, "\nNOW ON item", i);

                form.getTextField(`Date and TimeRow${i + 1}_${page}`).setText(
                    data[0][i + 25 * (page - 2)][1],
                );

                // time spent driving in easy to read format
                const time =
                    divideWithRemainder(
                        data[0][i + (page - 2) * 25][0],
                        60,
                    )[0] +
                    "hr " +
                    divideWithRemainder(
                        data[0][i + (page - 2) * 25][0],
                        60,
                    )[1] +
                    "min";
                form.getTextField(
                    `Number of Driving HoursRow${i + 1}_${page}`,
                ).setText(time);
                if (data[0][i + 25 * (page - 2)][2]) {
                    form.getTextField(
                        `Number of After Dark Driving HoursRow${i + 1}_${page}`,
                    ).setText(time);
                } else {
                    form.getTextField(
                        `Number of After Dark Driving HoursRow${i + 1}_${page}`,
                    ).setText("0");
                }

                // supervising driver stuff
                form.getTextField(
                    `Supervising Drivers Name and AgeRow${i + 1}_${page}`,
                ).setText(supervisingNameAge);
                form.getTextField(
                    `License Number of Supervising DriverRow${i + 1}_${page}`,
                ).setText(supervisingLicense);
            }
        }
    }

    // Final page (called page 2)
    if (pagesNeeded > 1) {
        // Go through the remaining items in the drives
        for (let i = 0; i < data[0].length - (pagesNeeded - 1) * 25; i++) {
            form.getTextField(`Date and TimeRow${i + 1}_2`).setText(
                data[0][i][1],
            );

            // time spent driving in easy to read format
            const time =
                divideWithRemainder(data[0][i][0], 60)[0] +
                "hr " +
                divideWithRemainder(data[0][i][0], 60)[1] +
                "min";
            form.getTextField(`Number of Driving HoursRow${i + 1}_2`).setText(
                time,
            );
            if (data[0][i][2]) {
                form.getTextField(
                    `Number of After Dark Driving HoursRow${i + 1}_2`,
                ).setText(time);
            } else {
                form.getTextField(
                    `Number of After Dark Driving HoursRow${i + 1}_2`,
                ).setText("0");
            }

            // supervising driver stuff
            form.getTextField(
                `Supervising Drivers Name and AgeRow${i + 1}_2`,
            ).setText(supervisingNameAge);
            form.getTextField(
                `License Number of Supervising DriverRow${i + 1}_2`,
            ).setText(supervisingLicense);
        }
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
        document.getElementById("submit").addEventListener("click", (event) => {
        exportForm(event);
    });
});
