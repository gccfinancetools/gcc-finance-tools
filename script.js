const currencies = {
    Qatar: "QAR",
    "Saudi Arabia": "SAR",
    "United Arab Emirates": "AED",
    Kuwait: "KWD",
    Oman: "OMR",
    Bahrain: "BHD"
};

const vatRates = {
    Qatar: 0,
    "Saudi Arabia": 15,
    "United Arab Emirates": 5,
    Kuwait: 0,
    Oman: 5,
    Bahrain: 10
};

let companyLogoData = "";


/* =========================
   COUNTRY
========================= */

function updateCountry() {
    const countryElement = document.getElementById("country");

    if (!countryElement) return;

    const country = countryElement.value;
    const currency = currencies[country] || "";
    const vatRate = vatRates[country] ?? 0;

    /* Update currency */

    const currencyElements =
        document.querySelectorAll(".currency-code");

    currencyElements.forEach(function (element) {
        element.textContent = currency;
    });


    /* Update Invoice VAT */

    const invoiceVat =
        document.getElementById("invoiceVat");

    if (invoiceVat) {
        invoiceVat.value = vatRate;
    }


    /* Update VAT Calculator VAT Rate */

    const vatRateElement =
        document.getElementById("vatRate");

    if (vatRateElement) {
        vatRateElement.value = vatRate;
    }


    /* Recalculate */

    calculateSalary();
    calculateInvoice();
    calculateVAT();
    calculateGratuity();
}


/* =========================
   MENU / NAVIGATION
========================= */

function hideTools() {
    const sections =
        document.querySelectorAll(".tool-section");

    sections.forEach(function (section) {
        section.style.display = "none";
    });

    const dashboard =
        document.getElementById("dashboard");

    if (dashboard) {
        dashboard.style.display = "grid";
    }
}


function goHome() {
    hideTools();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showTool(toolId) {
    const sections =
        document.querySelectorAll(".tool-section");

    sections.forEach(function (section) {
        section.style.display = "none";
    });

    const dashboard =
        document.getElementById("dashboard");

    if (dashboard) {
        dashboard.style.display = "none";
    }

    const tool =
        document.getElementById(toolId);

    if (tool) {
        tool.style.display = "block";

        window.scrollTo({
            top: tool.offsetTop - 20,
            behavior: "smooth"
        });
    }
}


function showPage(pageId) {
    const sections =
        document.querySelectorAll(".tool-section");

    sections.forEach(function (section) {
        section.style.display = "none";
    });

    const dashboard =
        document.getElementById("dashboard");

    if (dashboard) {
        dashboard.style.display = "none";
    }

    const page =
        document.getElementById(pageId);

    if (page) {
        page.style.display = "block";

        window.scrollTo({
            top: page.offsetTop - 20,
            behavior: "smooth"
        });
    }
}


/* =========================
   NUMBER FORMATTING
========================= */

function formatNumberInput(input) {
    if (!input) return;

    let value =
        input.value.replace(/,/g, "");

    if (value === "") return;

    const number = Number(value);

    if (!isNaN(number)) {
        input.value =
            number.toLocaleString("en-US");
    }
}


function getNumberValue(id) {
    const element =
        document.getElementById(id);

    if (!element) return 0;

    const value =
        element.value
            .replace(/,/g, "")
            .replace(/[^\d.-]/g, "");

    const number =
        parseFloat(value);

    return isNaN(number) ? 0 : number;
}


function getNumberFromText(text) {
    if (!text) return 0;

    const number =
        parseFloat(
            String(text)
                .replace(/,/g, "")
                .replace(/[^\d.-]/g, "")
        );

    return isNaN(number) ? 0 : number;
}


function formatAmount(amount) {
    const number =
        Number(amount) || 0;

    return number.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


/* =========================
   SALARY CALCULATOR
========================= */

function calculateSalary() {
    const basicSalary =
        getNumberValue("basicSalary");

    const allowances =
        getNumberValue("allowances");

    const deductions =
        getNumberValue("deductions");

    const netSalary =
        basicSalary +
        allowances -
        deductions;

    const result =
        document.getElementById("netSalary");

    if (result) {
        result.textContent =
            formatAmount(netSalary);
    }
}


/* =========================
   INVOICE NUMBER
========================= */

function generateInvoiceNumber() {
    const year =
        new Date().getFullYear();

    let counter =
        parseInt(
            localStorage.getItem(
                "gccInvoiceCounter"
            ) || "0",
            10
        );

    counter++;

    localStorage.setItem(
        "gccInvoiceCounter",
        String(counter)
    );

    return (
        "INV-" +
        year +
        "-" +
        String(counter).padStart(3, "0")
    );
}


function setNewInvoiceNumber() {
    const invoiceNumber =
        document.getElementById(
            "invoiceNumber"
        );

    if (invoiceNumber) {
        invoiceNumber.value =
            generateInvoiceNumber();
    }
}


/* =========================
   NEW INVOICE
========================= */

function newInvoice() {

    const fieldsToClear = [
        "customerName",
        "customerVat",
        "bankName",
        "accountName",
        "accountNumber",
        "iban",
        "paymentTerms",
        "invoiceNotes"
    ];

    fieldsToClear.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }
    });


    const invoiceDate =
        document.getElementById(
            "invoiceDate"
        );

    if (invoiceDate) {
        invoiceDate.value =
            new Date()
                .toISOString()
                .split("T")[0];
    }


    const invoiceStatus =
        document.getElementById(
            "invoiceStatus"
        );

    if (invoiceStatus) {
        invoiceStatus.value = "Unpaid";
    }


    const invoiceDiscount =
        document.getElementById(
            "invoiceDiscount"
        );

    if (invoiceDiscount) {
        invoiceDiscount.value = "0";
    }


    const country =
        document.getElementById("country");

    const invoiceVat =
        document.getElementById(
            "invoiceVat"
        );

    if (invoiceVat) {
        invoiceVat.value =
            country
                ? vatRates[country.value] ?? 0
                : 0;
    }


    setNewInvoiceNumber();


    const invoiceItems =
        document.getElementById(
            "invoiceItems"
        );

    if (invoiceItems) {

        invoiceItems.innerHTML = "";

        addInvoiceItem();
    }


    calculateInvoice();
}


/* =========================
   INVOICE ITEMS
========================= */

function addInvoiceItem() {

    const container =
        document.getElementById(
            "invoiceItems"
        );

    if (!container) return;

    const row =
        document.createElement("tr");

    row.innerHTML = `
        <td>
            <input
                type="text"
                class="item-description"
                placeholder="Description"
            >
        </td>

        <td>
            <input
                type="number"
                class="item-quantity"
                value="1"
                min="0"
            >
        </td>

        <td>
            <input
                type="number"
                class="item-price"
                value="0"
                min="0"
                step="0.01"
            >
        </td>

        <td>
            <span class="item-total">
                0.00
            </span>
        </td>

        <td>
            <button
                type="button"
                class="remove-item-button"
            >
                Remove
            </button>
        </td>
    `;

    container.appendChild(row);


    const quantity =
        row.querySelector(
            ".item-quantity"
        );

    const price =
        row.querySelector(
            ".item-price"
        );

    const removeButton =
        row.querySelector(
            ".remove-item-button"
        );


    if (quantity) {
        quantity.addEventListener(
            "input",
            calculateInvoice
        );
    }


    if (price) {
        price.addEventListener(
            "input",
            calculateInvoice
        );
    }


    if (removeButton) {

        removeButton.addEventListener(
            "click",
            function () {

                row.remove();

                calculateInvoice();
            }
        );
    }


    calculateInvoice();
}


function removeInvoiceItem(button) {

    if (!button) return;

    const row =
        button.closest("tr");

    if (row) {
        row.remove();
    }

    calculateInvoice();
}


/* =========================
   INVOICE CALCULATION
========================= */

function calculateInvoice() {

    const container =
        document.getElementById(
            "invoiceItems"
        );

    let subtotal = 0;


    if (container) {

        const rows =
            container.querySelectorAll("tr");

        rows.forEach(function (row) {

            const quantityElement =
                row.querySelector(
                    ".item-quantity"
                );

            const priceElement =
                row.querySelector(
                    ".item-price"
                );

            const totalElement =
                row.querySelector(
                    ".item-total"
                );


            const quantity =
                parseFloat(
                    quantityElement?.value
                ) || 0;

            const price =
                parseFloat(
                    priceElement?.value
                ) || 0;


            const total =
                quantity * price;

            subtotal += total;


            if (totalElement) {
                totalElement.textContent =
                    formatAmount(total);
            }
        });
    }


    const discount =
        getNumberValue(
            "invoiceDiscount"
        );


    const afterDiscount =
        Math.max(
            subtotal - discount,
            0
        );


    const vatRate =
        getNumberValue(
            "invoiceVat"
        );


    const vatAmount =
        afterDiscount *
        vatRate /
        100;


    const grandTotal =
        afterDiscount +
        vatAmount;


    const subtotalElement =
        document.getElementById(
            "invoiceSubtotal"
        );

    const discountElement =
        document.getElementById(
            "invoiceDiscountAmount"
        );

    const vatElement =
        document.getElementById(
            "invoiceVatAmount"
        );

    const totalElement =
        document.getElementById(
            "invoiceTotal"
        );


    if (subtotalElement) {
        subtotalElement.textContent =
            formatAmount(subtotal);
    }


    if (discountElement) {
        discountElement.textContent =
            formatAmount(discount);
    }


    if (vatElement) {
        vatElement.textContent =
            formatAmount(vatAmount);
    }


    if (totalElement) {
        totalElement.textContent =
            formatAmount(grandTotal);
    }
}


/* =========================
   VAT CALCULATOR
========================= */

function calculateVAT() {

    const amount =
        getNumberValue(
            "vatAmount"
        );


    const vatRateElement =
        document.getElementById(
            "vatRate"
        );


    const vatRate =
        vatRateElement
            ? parseFloat(
                vatRateElement.value
            ) || 0
            : 0;


    const vatAmount =
        amount *
        vatRate /
        100;


    const total =
        amount +
        vatAmount;


    const vatResult =
        document.getElementById(
            "vatAmountResult"
        );

    const totalResult =
        document.getElementById(
            "vatTotalResult"
        );


    if (vatResult) {
        vatResult.textContent =
            formatAmount(vatAmount);
    }


    if (totalResult) {
        totalResult.textContent =
            formatAmount(total);
    }
}


/* =========================
   GRATUITY CALCULATOR
========================= */

function calculateGratuity() {

    const basicSalary =
        getNumberValue(
            "gratuityBasicSalary"
        );


    const years =
        getNumberValue(
            "gratuityYears"
        );


    const daysPerYear =
        getNumberValue(
            "gratuityDays"
        ) || 21;


    const gratuity =
        (basicSalary / 30) *
        daysPerYear *
        years;


    const result =
        document.getElementById(
            "gratuityResult"
        );


    if (result) {
        result.textContent =
            formatAmount(gratuity);
    }
}


/* =========================
   LOGO PREVIEW
========================= */

function previewLogo(event) {

    const file =
        event?.target?.files?.[0];

    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        function (e) {

            companyLogoData =
                e.target.result;


            const preview =
                document.getElementById(
                    "logoPreview"
                );


            if (preview) {

                preview.innerHTML =
                    `<img src="${companyLogoData}" alt="Company Logo">`;
            }


            localStorage.setItem(
                "gccCompanyLogo",
                companyLogoData
            );
        };


    reader.readAsDataURL(file);
}


/* =========================
   HTML ESCAPE
========================= */

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================
   INVOICE DATA
========================= */

function getInvoiceData() {

    const items = [];

    const container =
        document.getElementById(
            "invoiceItems"
        );


    if (container) {

        container
            .querySelectorAll("tr")
            .forEach(function (row) {

                const description =
                    row.querySelector(
                        ".item-description"
                    )?.value || "";


                const quantity =
                    parseFloat(
                        row.querySelector(
                            ".item-quantity"
                        )?.value
                    ) || 0;


                const price =
                    parseFloat(
                        row.querySelector(
                            ".item-price"
                        )?.value
                    ) || 0;


                items.push({
                    description: description,
                    quantity: quantity,
                    price: price,
                    total: quantity * price
                });
            });
    }


    return {

        companyName:
            document.getElementById(
                "companyName"
            )?.value || "",

        companyAddress:
            document.getElementById(
                "companyAddress"
            )?.value || "",

        companyVat:
            document.getElementById(
                "companyVat"
            )?.value || "",

        companyPhone:
            document.getElementById(
                "companyPhone"
            )?.value || "",

        companyEmail:
            document.getElementById(
                "companyEmail"
            )?.value || "",

        invoiceNumber:
            document.getElementById(
                "invoiceNumber"
            )?.value || "",

        invoiceDate:
            document.getElementById(
                "invoiceDate"
            )?.value || "",

        invoiceStatus:
            document.getElementById(
                "invoiceStatus"
            )?.value || "",

        customerName:
            document.getElementById(
                "customerName"
            )?.value || "",

        customerVat:
            document.getElementById(
                "customerVat"
            )?.value || "",

        invoiceDiscount:
            getNumberValue(
                "invoiceDiscount"
            ),

        invoiceVat:
            getNumberValue(
                "invoiceVat"
            ),

        bankName:
            document.getElementById(
                "bankName"
            )?.value || "",

        accountName:
            document.getElementById(
                "accountName"
            )?.value || "",

        accountNumber:
            document.getElementById(
                "accountNumber"
            )?.value || "",

        iban:
            document.getElementById(
                "iban"
            )?.value || "",

        paymentTerms:
            document.getElementById(
                "paymentTerms"
            )?.value || "",

        invoiceNotes:
            document.getElementById(
                "invoiceNotes"
            )?.value || "",

        items: items
    };
}


/* =========================
   INVOICE HISTORY
========================= */

function getInvoiceHistory() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "gccInvoiceHistory"
            ) || "[]"
        );

    } catch (error) {

        return [];
    }
}


function saveInvoiceToHistory() {

    const data =
        getInvoiceData();

    if (!data.invoiceNumber) return;


    const history =
        getInvoiceHistory();


    const existingIndex =
        history.findIndex(
            function (invoice) {
                return (
                    invoice.invoiceNumber ===
                    data.invoiceNumber
                );
            }
        );


    if (existingIndex >= 0) {

        history[existingIndex] =
            data;

    } else {

        history.push(data);
    }


    localStorage.setItem(
        "gccInvoiceHistory",
        JSON.stringify(history)
    );
}


function deleteInvoiceFromHistory(
    invoiceNumber
) {

    const history =
        getInvoiceHistory()
            .filter(
                function (invoice) {

                    return (
                        invoice.invoiceNumber !==
                        invoiceNumber
                    );
                }
            );


    localStorage.setItem(
        "gccInvoiceHistory",
        JSON.stringify(history)
    );
}


function loadInvoiceFromHistory(
    invoiceNumber
) {

    const history =
        getInvoiceHistory();


    const invoice =
        history.find(
            function (item) {

                return (
                    item.invoiceNumber ===
                    invoiceNumber
                );
            }
        );


    if (!invoice) return;


    const fields = [
        "companyName",
        "companyAddress",
        "companyVat",
        "companyPhone",
        "companyEmail",
        "invoiceNumber",
        "invoiceDate",
        "invoiceStatus",
        "customerName",
        "customerVat",
        "invoiceDiscount",
        "invoiceVat",
        "bankName",
        "accountName",
        "accountNumber",
        "iban",
        "paymentTerms",
        "invoiceNotes"
    ];


    fields.forEach(function (id) {

        const element =
            document.getElementById(id);


        if (
            element &&
            invoice[id] !== undefined
        ) {
            element.value =
                invoice[id];
        }
    });


    const container =
        document.getElementById(
            "invoiceItems"
        );


    if (container) {

        container.innerHTML = "";


        invoice.items.forEach(
            function (item) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `
                    <td>
                        <input
                            type="text"
                            class="item-description"
                            value="${escapeHtml(item.description)}"
                        >
                    </td>

                    <td>
                        <input
                            type="number"
                            class="item-quantity"
                            value="${item.quantity}"
                            min="0"
                        >
                    </td>

                    <td>
                        <input
                            type="number"
                            class="item-price"
                            value="${item.price}"
                            min="0"
                            step="0.01"
                        >
                    </td>

                    <td>
                        <span class="item-total">
                            ${formatAmount(item.total)}
                        </span>
                    </td>

                    <td>
                        <button
                            type="button"
                            class="remove-item-button"
                        >
                            Remove
                        </button>
                    </td>
                `;


                container.appendChild(row);


                row.querySelector(
                    ".item-quantity"
                )?.addEventListener(
                    "input",
                    calculateInvoice
                );


                row.querySelector(
                    ".item-price"
                )?.addEventListener(
                    "input",
                    calculateInvoice
                );


                row.querySelector(
                    ".remove-item-button"
                )?.addEventListener(
                    "click",
                    function () {

                        row.remove();

                        calculateInvoice();
                    }
                );
            }
        );
    }


    calculateInvoice();
}


/* =========================
   PDF
========================= */

function downloadInvoicePDF() {

    if (
        typeof window.jspdf ===
        "undefined"
    ) {

        alert(
            "PDF library is not available."
        );

        return;
    }


    saveInvoiceToHistory();


    const { jsPDF } =
        window.jspdf;


    const doc =
        new jsPDF();


    const data =
        getInvoiceData();


    let y = 20;


    if (companyLogoData) {

        try {

            doc.addImage(
                companyLogoData,
                "PNG",
                15,
                10,
                40,
                25
            );

        } catch (error) {

            console.log(
                "Logo could not be added."
            );
        }
    }


    doc.setFontSize(18);


    doc.text(
        data.companyName ||
        "Invoice",
        60,
        y
    );


    y += 10;


    doc.setFontSize(10);


    if (data.companyAddress) {

        doc.text(
            data.companyAddress,
            60,
            y
        );

        y += 6;
    }


    if (data.companyPhone) {

        doc.text(
            "Phone: " +
            data.companyPhone,
            60,
            y
        );

        y += 6;
    }


    if (data.companyEmail) {

        doc.text(
            "Email: " +
            data.companyEmail,
            60,
            y
        );

        y += 6;
    }


    y += 10;


    doc.setFontSize(16);


    doc.text(
        "INVOICE",
        15,
        y
    );


    y += 10;


    doc.setFontSize(10);


    doc.text(
        "Invoice No: " +
        data.invoiceNumber,
        15,
        y
    );


    doc.text(
        "Date: " +
        data.invoiceDate,
        120,
        y
    );


    y += 7;


    doc.text(
        "Customer: " +
        data.customerName,
        15,
        y
    );


    y += 12;


    const tableRows =
        data.items.map(
            function (item) {

                return [
                    item.description,
                    item.quantity,
                    formatAmount(
                        item.price
                    ),
                    formatAmount(
                        item.total
                    )
                ];
            }
        );


    if (
        typeof doc.autoTable ===
        "function"
    ) {

        doc.autoTable({

            startY: y,

            head: [[
                "Description",
                "Qty",
                "Unit Price",
                "Total"
            ]],

            body: tableRows,

            theme: "grid"
        });


        y =
            doc.lastAutoTable.finalY +
            10;

    } else {

        tableRows.forEach(
            function (row) {

                doc.text(
                    row.join(" | "),
                    15,
                    y
                );

                y += 7;
            }
        );

        y += 10;
    }


    const subtotal =
        getNumberFromText(
            document.getElementById(
                "invoiceSubtotal"
            )?.textContent
        );


    const discount =
        getNumberFromText(
            document.getElementById(
                "invoiceDiscountAmount"
            )?.textContent
        );


    const vat =
        getNumberFromText(
            document.getElementById(
                "invoiceVatAmount"
            )?.textContent
        );


    const total =
        getNumberFromText(
            document.getElementById(
                "invoiceTotal"
            )?.textContent
        );


    doc.text(
        "Subtotal: " +
        formatAmount(subtotal),
        140,
        y
    );


    y += 7;


    doc.text(
        "Discount: " +
        formatAmount(discount),
        140,
        y
    );


    y += 7;


    doc.text(
        "VAT: " +
        formatAmount(vat),
        140,
        y
    );


    y += 8;


    doc.setFontSize(12);


    doc.text(
        "Total: " +
        formatAmount(total),
        140,
        y
    );


    y += 15;


    doc.setFontSize(10);


    if (data.bankName) {

        doc.text(
            "Bank: " +
            data.bankName,
            15,
            y
        );

        y += 6;
    }


    if (data.accountName) {

        doc.text(
            "Account Name: " +
            data.accountName,
            15,
            y
        );

        y += 6;
    }


    if (data.accountNumber) {

        doc.text(
            "Account Number: " +
            data.accountNumber,
            15,
            y
        );

        y += 6;
    }


    if (data.iban) {

        doc.text(
            "IBAN: " +
            data.iban,
            15,
            y
        );

        y += 6;
    }


    if (data.paymentTerms) {

        doc.text(
            "Payment Terms: " +
            data.paymentTerms,
            15,
            y
        );

        y += 8;
    }


    if (data.invoiceNotes) {

        doc.text(
            "Notes: " +
            data.invoiceNotes,
            15,
            y
        );
    }


    doc.save(
        (data.invoiceNumber ||
            "invoice") +
        ".pdf"
    );
}


/* =========================
   AUTO CALCULATION
========================= */

function setupAutoCalculation() {

    /* Salary */

    [
        "basicSalary",
        "allowances",
        "deductions"
    ].forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.addEventListener(
                "input",
                calculateSalary
            );
        }
    });


    /* VAT */

    [
        "vatAmount",
        "vatRate"
    ].forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.addEventListener(
                "input",
                calculateVAT
            );

            element.addEventListener(
                "change",
                calculateVAT
            );
        }
    });


    /* Gratuity */

    [
        "gratuityBasicSalary",
        "gratuityYears",
        "gratuityDays"
    ].forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.addEventListener(
                "input",
                calculateGratuity
            );

            element.addEventListener(
                "change",
                calculateGratuity
            );
        }
    });


    /* Invoice */

    [
        "invoiceDiscount",
        "invoiceVat"
    ].forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.addEventListener(
                "input",
                calculateInvoice
            );

            element.addEventListener(
                "change",
                calculateInvoice
            );
        }
    });
}


/* =========================
   INITIALIZATION
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* Country */

        const country =
            document.getElementById(
                "country"
            );


        if (country) {

            country.addEventListener(
                "change",
                updateCountry
            );
        }


        /* Company information */

        const companyFields = [
            "companyName",
            "companyAddress",
            "companyVat",
            "companyPhone",
            "companyEmail"
        ];


        companyFields.forEach(
            function (id) {

                const element =
                    document.getElementById(
                        id
                    );


                if (!element) return;


                const savedValue =
                    localStorage.getItem(
                        "gcc_" + id
                    );


                if (
                    savedValue !== null
                ) {
                    element.value =
                        savedValue;
                }


                element.addEventListener(
                    "input",
                    function () {

                        localStorage.setItem(
                            "gcc_" + id,
                            element.value
                        );
                    }
                );
            }
        );


        /* Logo */

        const savedLogo =
            localStorage.getItem(
                "gccCompanyLogo"
            );


        if (savedLogo) {

            companyLogoData =
                savedLogo;


            const preview =
                document.getElementById(
                    "logoPreview"
                );


            if (preview) {

                preview.innerHTML =
                    `<img src="${savedLogo}" alt="Company Logo">`;
            }
        }


        /* Logo upload */

        const logoInput =
            document.getElementById(
                "companyLogo"
            );


        if (logoInput) {

            logoInput.addEventListener(
                "change",
                previewLogo
            );
        }


        /* Invoice number */

        const invoiceNumber =
            document.getElementById(
                "invoiceNumber"
            );


        if (
            invoiceNumber &&
            !invoiceNumber.value
        ) {

            invoiceNumber.value =
                generateInvoiceNumber();
        }


        /* Invoice date */

        const invoiceDate =
            document.getElementById(
                "invoiceDate"
            );


        if (
            invoiceDate &&
            !invoiceDate.value
        ) {

            invoiceDate.value =
                new Date()
                    .toISOString()
                    .split("T")[0];
        }


        /* Initial invoice item */

        const invoiceItems =
            document.getElementById(
                "invoiceItems"
            );


        if (
            invoiceItems &&
            invoiceItems.children.length === 0
        ) {

            addInvoiceItem();
        }


        /* Setup calculations */

        setupAutoCalculation();


        /* Apply country VAT */

        updateCountry();


        /* Initial calculations */

        calculateSalary();
        calculateInvoice();
        calculateVAT();
        calculateGratuity();


        /* Start on home */

        const dashboard =
            document.getElementById(
                "dashboard"
            );


        if (dashboard) {
            dashboard.style.display =
                "grid";
        }
    }
);