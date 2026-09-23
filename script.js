/* =========================================================
   GCC FINANCE TOOLS
   Final Script
========================================================= */


/* =========================================================
   GCC SETTINGS
========================================================= */

const currencies = {
    Qatar: "QAR",
    SaudiArabia: "SAR",
    UAE: "AED",
    Kuwait: "KWD",
    Oman: "OMR",
    Bahrain: "BHD"
};

const vatRates = {
    Qatar: 0,
    SaudiArabia: 15,
    UAE: 5,
    Kuwait: 0,
    Oman: 5,
    Bahrain: 10
};

let companyLogoData = "";


/* =========================================================
   COUNTRY
========================================================= */

function updateCountry() {
    const countrySelect = document.getElementById("country");

    if (!countrySelect) return;

    const country = countrySelect.value;

    const currency = currencies[country] || "QAR";
    const vatRate = vatRates[country] ?? 0;

    const currencyElements = document.querySelectorAll(".currency");

    currencyElements.forEach(element => {
        element.textContent = currency;
    });

    const invoiceVat = document.getElementById("invoiceVat");

    if (invoiceVat) {
        invoiceVat.value = vatRate;
    }

    calculateInvoice();

    const invoiceNumber = document.getElementById("invoiceNumber");

    if (invoiceNumber && !invoiceNumber.value) {
        setNewInvoiceNumber();
    }
}


/* =========================================================
   TOOL NAVIGATION
========================================================= */

function hideTools() {
    const sections = document.querySelectorAll(".tool-section");

    sections.forEach(section => {
        section.style.display = "none";
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function showTool(toolId) {
    hideTools();

    const section = document.getElementById(toolId);

    if (!section) return;

    section.style.display = "block";

    setTimeout(() => {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 50);
}


/* =========================================================
   NUMBER FORMATTING
========================================================= */

function formatNumberInput(input) {
    if (!input) return;

    let value = input.value;

    value = value.replace(/,/g, "");

    if (value === "") return;

    const number = Number(value);

    if (isNaN(number)) {
        input.value = "";
        return;
    }

    input.value = number.toLocaleString("en-US", {
        maximumFractionDigits: 2
    });
}

function getNumberValue(id) {
    const element = document.getElementById(id);

    if (!element) return 0;

    const value = element.value
        .toString()
        .replace(/,/g, "")
        .trim();

    const number = parseFloat(value);

    return isNaN(number) ? 0 : number;
}

function getNumberFromText(id) {
    const element = document.getElementById(id);

    if (!element) return 0;

    const value = element.textContent
        .replace(/[^\d.-]/g, "")
        .trim();

    const number = parseFloat(value);

    return isNaN(number) ? 0 : number;
}

function formatAmount(amount) {
    const number = Number(amount) || 0;

    return number.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


/* =========================================================
   SALARY CALCULATOR
========================================================= */

function calculateSalary() {
    const salary = getNumberValue("salary");

    const result = document.getElementById("salaryResult");

    if (!result) return;

    if (salary <= 0) {
        result.innerHTML = "Please enter a valid salary.";
        return;
    }

    const monthly = salary;
    const annual = salary * 12;

    result.innerHTML = `
        <strong>Monthly Salary:</strong> ${formatAmount(monthly)}<br>
        <strong>Annual Salary:</strong> ${formatAmount(annual)}
    `;
}


/* =========================================================
   INVOICE NUMBER
========================================================= */

function generateInvoiceNumber() {
    const year = new Date().getFullYear();

    const storageKey = "gccInvoiceCounter";

    let counter = parseInt(
        localStorage.getItem(storageKey) || "0",
        10
    );

    counter++;

    localStorage.setItem(
        storageKey,
        counter.toString()
    );

    return `INV-${year}-${String(counter).padStart(3, "0")}`;
}

function setNewInvoiceNumber() {
    const invoiceNumber = document.getElementById("invoiceNumber");

    if (!invoiceNumber) return;

    invoiceNumber.value = generateInvoiceNumber();
}


/* =========================================================
   NEW INVOICE
========================================================= */

function newInvoice() {
    const companyName = document.getElementById("companyName")?.value || "";
    const companyAddress = document.getElementById("companyAddress")?.value || "";
    const companyVat = document.getElementById("companyVat")?.value || "";
    const companyPhone = document.getElementById("companyPhone")?.value || "";
    const companyEmail = document.getElementById("companyEmail")?.value || "";

    const logo = companyLogoData;

    const customerName = document.getElementById("customerName");
    const customerVat = document.getElementById("customerVat");

    const bankName = document.getElementById("bankName");
    const accountName = document.getElementById("accountName");
    const accountNumber = document.getElementById("accountNumber");
    const iban = document.getElementById("iban");

    const paymentTerms = document.getElementById("paymentTerms");
    const invoiceNotes = document.getElementById("invoiceNotes");

    if (customerName) customerName.value = "";
    if (customerVat) customerVat.value = "";

    if (bankName) bankName.value = "";
    if (accountName) accountName.value = "";
    if (accountNumber) accountNumber.value = "";
    if (iban) iban.value = "";

    if (paymentTerms) paymentTerms.value = "";
    if (invoiceNotes) invoiceNotes.value = "";

    const invoiceDate = document.getElementById("invoiceDate");

    if (invoiceDate) {
        invoiceDate.value = new Date().toISOString().split("T")[0];
    }

    const invoiceStatus = document.getElementById("invoiceStatus");

    if (invoiceStatus) {
        invoiceStatus.value = "Unpaid";
    }

    const discount = document.getElementById("invoiceDiscount");

    if (discount) {
        discount.value = "0";
    }

    const invoiceVat = document.getElementById("invoiceVat");

    const country = document.getElementById("country")?.value || "Qatar";

    if (invoiceVat) {
        invoiceVat.value = vatRates[country] ?? 0;
    }

    const items = document.getElementById("invoiceItems");

    if (items) {
        items.innerHTML = "";
    }

    addInvoiceItem();

    setNewInvoiceNumber();

    /*
       Restore company information.
       This is intentionally kept when creating a new invoice.
    */
    const companyFields = {
        companyName,
        companyAddress,
        companyVat,
        companyPhone,
        companyEmail
    };

    Object.keys(companyFields).forEach(id => {
        const element = document.getElementById(id);

        if (!element) return;

        element.value = eval(id) || "";
    });

    companyLogoData = logo;

    if (logo) {
        const preview = document.getElementById("logoPreview");

        if (preview) {
            preview.innerHTML = `<img src="${logo}" alt="Company Logo">`;
        }
    }

    calculateInvoice();
}


/* =========================================================
   INVOICE ITEMS
========================================================= */

function addInvoiceItem() {
    const table = document.getElementById("invoiceItems");

    if (!table) return;

    const row = document.createElement("tr");

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
                step="0.01"
                oninput="calculateInvoice()"
            >
        </td>

        <td>
            <input
                type="text"
                class="item-price"
                value="0"
                oninput="formatNumberInput(this); calculateInvoice()"
            >
        </td>

        <td>
            <span class="item-total">0.00</span>
        </td>

        <td>
            <button
                type="button"
                class="remove-item-button"
                onclick="removeInvoiceItem(this)"
            >
                Remove
            </button>
        </td>
    `;

    table.appendChild(row);

    calculateInvoice();
}

function removeInvoiceItem(button) {
    if (!button) return;

    const row = button.closest("tr");

    if (row) {
        row.remove();
    }

    const table = document.getElementById("invoiceItems");

    if (table && table.children.length === 0) {
        addInvoiceItem();
    }

    calculateInvoice();
}


/* =========================================================
   INVOICE CALCULATION
========================================================= */

function calculateInvoice() {
    const table = document.getElementById("invoiceItems");

    if (!table) return;

    let subtotal = 0;

    const rows = table.querySelectorAll("tr");

    rows.forEach(row => {
        const quantityInput = row.querySelector(".item-quantity");
        const priceInput = row.querySelector(".item-price");
        const totalElement = row.querySelector(".item-total");

        if (!quantityInput || !priceInput || !totalElement) return;

        const quantity = parseFloat(quantityInput.value) || 0;

        const price = parseFloat(
            priceInput.value.replace(/,/g, "")
        ) || 0;

        const total = quantity * price;

        subtotal += total;

        totalElement.textContent = formatAmount(total);
    });

    const discount = getNumberValue("invoiceDiscount");

    const discountAmount = Math.min(
        Math.max(discount, 0),
        subtotal
    );

    const taxableAmount = Math.max(
        subtotal - discountAmount,
        0
    );

    const vatRate = getNumberValue("invoiceVat");

    const vatAmount = taxableAmount * (vatRate / 100);

    const grandTotal = taxableAmount + vatAmount;

    const subtotalElement =
        document.getElementById("invoiceSubtotal");

    const discountElement =
        document.getElementById("invoiceDiscountAmount");

    const vatElement =
        document.getElementById("invoiceVatAmount");

    const totalElement =
        document.getElementById("invoiceTotal");

    if (subtotalElement) {
        subtotalElement.textContent = formatAmount(subtotal);
    }

    if (discountElement) {
        discountElement.textContent = formatAmount(discountAmount);
    }

    if (vatElement) {
        vatElement.textContent = formatAmount(vatAmount);
    }

    if (totalElement) {
        totalElement.textContent = formatAmount(grandTotal);
    }
}


/* =========================================================
   VAT CALCULATOR
========================================================= */

function calculateVAT() {
    const amount = getNumberValue("vatAmount");
    const rate = getNumberValue("vatRate");

    const result = document.getElementById("vatResult");

    if (!result) return;

    if (amount < 0 || rate < 0) {
        result.innerHTML = "Please enter valid values.";
        return;
    }

    const vat = amount * (rate / 100);

    const total = amount + vat;

    result.innerHTML = `
        <strong>Amount:</strong> ${formatAmount(amount)}<br>
        <strong>VAT (${formatAmount(rate)}%):</strong> ${formatAmount(vat)}<br>
        <strong>Total Including VAT:</strong> ${formatAmount(total)}
    `;
}


/* =========================================================
   GRATUITY / END OF SERVICE
========================================================= */

function calculateGratuity() {
    const salary = getNumberValue("gratuitySalary");
    const years = getNumberValue("gratuityYears");

    const result = document.getElementById("gratuityResult");

    if (!result) return;

    if (salary <= 0 || years <= 0) {
        result.innerHTML =
            "Please enter a valid salary and service period.";

        return;
    }

    /*
       Basic GCC-style estimate:
       First 5 years = 21 days of salary per year
       After 5 years = 30 days of salary per year

       This is a general estimate only.
       Actual entitlement depends on the applicable
       country's labour law and employment circumstances.
    */

    const firstFiveYears = Math.min(years, 5);

    const remainingYears = Math.max(years - 5, 0);

    const dailySalary = salary / 30;

    const firstPeriod =
        firstFiveYears * dailySalary * 21;

    const secondPeriod =
        remainingYears * dailySalary * 30;

    const gratuity = firstPeriod + secondPeriod;

    result.innerHTML = `
        <strong>Daily Salary:</strong> ${formatAmount(dailySalary)}<br>
        <strong>Estimated End-of-Service Benefit:</strong>
        ${formatAmount(gratuity)}
    `;
}


/* =========================================================
   COMPANY LOGO
========================================================= */

function previewLogo() {
    const input = document.getElementById("companyLogo");

    const preview = document.getElementById("logoPreview");

    if (!input || !preview) return;

    const file = input.files?.[0];

    if (!file) {
        companyLogoData = "";
        preview.innerHTML = "No logo selected";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        companyLogoData = event.target.result;

        preview.innerHTML = `
            <img
                src="${companyLogoData}"
                alt="Company Logo"
            >
        `;
    };

    reader.readAsDataURL(file);
}


/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   SAVE INVOICE
========================================================= */

function getInvoiceData() {
    const country =
        document.getElementById("country")?.value || "Qatar";

    const items = [];

    document
        .querySelectorAll("#invoiceItems tr")
        .forEach(row => {

            const description =
                row.querySelector(".item-description")?.value || "";

            const quantity =
                parseFloat(
                    row.querySelector(".item-quantity")?.value
                ) || 0;

            const price =
                parseFloat(
                    row.querySelector(".item-price")?.value
                        .replace(/,/g, "")
                ) || 0;

            if (description || quantity || price) {
                items.push({
                    description,
                    quantity,
                    price
                });
            }
        });

    return {
        country,
        currency: currencies[country] || "QAR",

        company: {
            name: document.getElementById("companyName")?.value || "",
            address: document.getElementById("companyAddress")?.value || "",
            vat: document.getElementById("companyVat")?.value || "",
            phone: document.getElementById("companyPhone")?.value || "",
            email: document.getElementById("companyEmail")?.value || ""
        },

        customer: {
            name: document.getElementById("customerName")?.value || "",
            vat: document.getElementById("customerVat")?.value || ""
        },

        invoice: {
            number: document.getElementById("invoiceNumber")?.value || "",
            date: document.getElementById("invoiceDate")?.value || "",
            status: document.getElementById("invoiceStatus")?.value || "Unpaid"
        },

        items,

        discount: getNumberValue("invoiceDiscount"),
        vatRate: getNumberValue("invoiceVat"),

        payment: {
            bankName: document.getElementById("bankName")?.value || "",
            accountName: document.getElementById("accountName")?.value || "",
            accountNumber: document.getElementById("accountNumber")?.value || "",
            iban: document.getElementById("iban")?.value || ""
        },

        terms: document.getElementById("paymentTerms")?.value || "",
        notes: document.getElementById("invoiceNotes")?.value || "",

        logo: companyLogoData,

        totals: {
            subtotal: getNumberFromText("invoiceSubtotal"),
            discount: getNumberFromText("invoiceDiscountAmount"),
            vat: getNumberFromText("invoiceVatAmount"),
            total: getNumberFromText("invoiceTotal")
        },

        savedAt: new Date().toISOString()
    };
}

function saveInvoiceToHistory() {
    const invoice = getInvoiceData();

    if (!invoice.invoice.number) {
        return;
    }

    let history = [];

    try {
        history = JSON.parse(
            localStorage.getItem("gccInvoiceHistory") || "[]"
        );
    } catch (error) {
        history = [];
    }

    const existingIndex = history.findIndex(
        item => item.invoice.number === invoice.invoice.number
    );

    if (existingIndex >= 0) {
        history[existingIndex] = invoice;
    } else {
        history.unshift(invoice);
    }

    /*
       Keep the most recent 50 invoices.
    */
    history = history.slice(0, 50);

    localStorage.setItem(
        "gccInvoiceHistory",
        JSON.stringify(history)
    );
}


/* =========================================================
   INVOICE HISTORY
========================================================= */

function getInvoiceHistory() {
    try {
        return JSON.parse(
            localStorage.getItem("gccInvoiceHistory") || "[]"
        );
    } catch (error) {
        return [];
    }
}

function deleteInvoiceFromHistory(invoiceNumber) {
    let history = getInvoiceHistory();

    history = history.filter(
        invoice => invoice.invoice.number !== invoiceNumber
    );

    localStorage.setItem(
        "gccInvoiceHistory",
        JSON.stringify(history)
    );
}

function loadInvoiceFromHistory(invoiceNumber) {
    const history = getInvoiceHistory();

    const invoice = history.find(
        item => item.invoice.number === invoiceNumber
    );

    if (!invoice) {
        alert("Invoice not found.");
        return;
    }

    const countrySelect = document.getElementById("country");

    if (countrySelect && invoice.country) {
        countrySelect.value = invoice.country;
    }

    const fields = {
        companyName: invoice.company.name,
        companyAddress: invoice.company.address,
        companyVat: invoice.company.vat,
        companyPhone: invoice.company.phone,
        companyEmail: invoice.company.email,

        customerName: invoice.customer.name,
        customerVat: invoice.customer.vat,

        invoiceNumber: invoice.invoice.number,
        invoiceDate: invoice.invoice.date,
        invoiceStatus: invoice.invoice.status,

        invoiceDiscount: invoice.discount,
        invoiceVat: invoice.vatRate,

        bankName: invoice.payment.bankName,
        accountName: invoice.payment.accountName,
        accountNumber: invoice.payment.accountNumber,
        iban: invoice.payment.iban,

        paymentTerms: invoice.terms,
        invoiceNotes: invoice.notes
    };

    Object.keys(fields).forEach(id => {
        const element = document.getElementById(id);

        if (element) {
            element.value = fields[id];
        }
    });

    companyLogoData = invoice.logo || "";

    const preview = document.getElementById("logoPreview");

    if (preview) {
        if (companyLogoData) {
            preview.innerHTML = `
                <img
                    src="${companyLogoData}"
                    alt="Company Logo"
                >
            `;
        } else {
            preview.innerHTML = "No logo selected";
        }
    }

    const table = document.getElementById("invoiceItems");

    if (table) {
        table.innerHTML = "";

        invoice.items.forEach(item => {
            addInvoiceItem();

            const row =
                table.lastElementChild;

            const description =
                row.querySelector(".item-description");

            const quantity =
                row.querySelector(".item-quantity");

            const price =
                row.querySelector(".item-price");

            if (description) {
                description.value = item.description;
            }

            if (quantity) {
                quantity.value = item.quantity;
            }

            if (price) {
                price.value = formatAmount(item.price);
            }
        });

        if (invoice.items.length === 0) {
            addInvoiceItem();
        }
    }

    updateCountry();
    calculateInvoice();

    showTool("invoice");
}


/* =========================================================
   PDF INVOICE
========================================================= */

async function downloadInvoicePDF() {
    if (
        typeof window.jspdf === "undefined" ||
        typeof window.jspdf.jsPDF === "undefined"
    ) {
        alert(
            "PDF library is not loaded. Please check your internet connection and refresh the page."
        );

        return;
    }

    calculateInvoice();

    const data = getInvoiceData();

    saveInvoiceToHistory();

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const currency = data.currency;

    const pageWidth = doc.internal.pageSize.getWidth();

    let y = 20;

    /* -----------------------------------------------------
       HEADER
    ----------------------------------------------------- */

    if (data.logo) {
        try {
            doc.addImage(
                data.logo,
                "AUTO",
                15,
                12,
                35,
                22
            );
        } catch (error) {
            console.warn("Unable to add logo:", error);
        }
    }

    const companyX = data.logo ? 55 : 15;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");

    doc.text(
        data.company.name || "Company Name",
        companyX,
        20
    );

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    let companyY = 27;

    if (data.company.address) {
        doc.text(
            data.company.address,
            companyX,
            companyY,
            {
                maxWidth: 90
            }
        );

        companyY += 6;
    }

    if (data.company.phone) {
        doc.text(
            `Phone: ${data.company.phone}`,
            companyX,
            companyY
        );

        companyY += 5;
    }

    if (data.company.email) {
        doc.text(
            `Email: ${data.company.email}`,
            companyX,
            companyY
        );

        companyY += 5;
    }

    if (data.company.vat) {
        doc.text(
            `VAT No.: ${data.company.vat}`,
            companyX,
            companyY
        );
    }

    /* -----------------------------------------------------
       INVOICE TITLE
    ----------------------------------------------------- */

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");

    doc.text(
        "INVOICE",
        pageWidth - 15,
        20,
        {
            align: "right"
        }
    );

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.text(
        `Invoice No.: ${data.invoice.number}`,
        pageWidth - 15,
        29,
        {
            align: "right"
        }
    );

    doc.text(
        `Date: ${data.invoice.date}`,
        pageWidth - 15,
        35,
        {
            align: "right"
        }
    );

    doc.text(
        `Status: ${data.invoice.status}`,
        pageWidth - 15,
        41,
        {
            align: "right"
        }
    );

    /* -----------------------------------------------------
       CUSTOMER
    ----------------------------------------------------- */

    y = 62;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");

    doc.text("Bill To", 15, y);

    y += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(
        data.customer.name || "Customer",
        15,
        y
    );

    y += 6;

    if (data.customer.vat) {
        doc.text(
            `VAT No.: ${data.customer.vat}`,
            15,
            y
        );

        y += 6;
    }

    /* -----------------------------------------------------
       ITEMS TABLE
    ----------------------------------------------------- */

    const tableBody = data.items.map(item => [
        item.description || "",
        item.quantity.toString(),
        `${currency} ${formatAmount(item.price)}`,
        `${currency} ${formatAmount(item.quantity * item.price)}`
    ]);

    if (tableBody.length === 0) {
        tableBody.push([
            "",
            "0",
            `${currency} 0.00`,
            `${currency} 0.00`
        ]);
    }

    if (typeof doc.autoTable === "function") {
        doc.autoTable({
            startY: y + 5,
            head: [
                [
                    "Description",
                    "Qty",
                    "Unit Price",
                    "Amount"
                ]
            ],
            body: tableBody,
            theme: "grid",
            styles: {
                fontSize: 9,
                cellPadding: 4
            },
            headStyles: {
                fontStyle: "bold"
            },
            columnStyles: {
                0: {
                    cellWidth: 85
                },
                1: {
                    cellWidth: 20,
                    halign: "center"
                },
                2: {
                    cellWidth: 35,
                    halign: "right"
                },
                3: {
                    cellWidth: 35,
                    halign: "right"
                }
            }
        });

        y = doc.lastAutoTable.finalY + 10;
    } else {
        y += 15;

        tableBody.forEach(row => {
            doc.text(row[0], 15, y);
            doc.text(row[1], 105, y);
            doc.text(row[2], 130, y);
            doc.text(row[3], 170, y);

            y += 7;
        });

        y += 10;
    }

    /* -----------------------------------------------------
       TOTALS
    ----------------------------------------------------- */

    const totalsX = pageWidth - 85;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.text(
        "Subtotal:",
        totalsX,
        y
    );

    doc.text(
        `${currency} ${formatAmount(data.totals.subtotal)}`,
        pageWidth - 15,
        y,
        {
            align: "right"
        }
    );

    y += 7;

    doc.text(
        "Discount:",
        totalsX,
        y
    );

    doc.text(
        `${currency} ${formatAmount(data.totals.discount)}`,
        pageWidth - 15,
        y,
        {
            align: "right"
        }
    );

    y += 7;

    doc.text(
        `VAT (${formatAmount(data.vatRate)}%):`,
        totalsX,
        y
    );

    doc.text(
        `${currency} ${formatAmount(data.totals.vat)}`,
        pageWidth - 15,
        y,
        {
            align: "right"
        }
    );

    y += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    doc.text(
        "TOTAL:",
        totalsX,
        y
    );

    doc.text(
        `${currency} ${formatAmount(data.totals.total)}`,
        pageWidth - 15,
        y,
        {
            align: "right"
        }
    );

    y += 15;

    /* -----------------------------------------------------
       PAYMENT DETAILS
    ----------------------------------------------------- */

    if (
        data.payment.bankName ||
        data.payment.accountName ||
        data.payment.accountNumber ||
        data.payment.iban
    ) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");

        doc.text(
            "Payment Details",
            15,
            y
        );

        y += 7;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        if (data.payment.bankName) {
            doc.text(
                `Bank: ${data.payment.bankName}`,
                15,
                y
            );

            y += 5;
        }

        if (data.payment.accountName) {
            doc.text(
                `Account Name: ${data.payment.accountName}`,
                15,
                y
            );

            y += 5;
        }

        if (data.payment.accountNumber) {
            doc.text(
                `Account Number: ${data.payment.accountNumber}`,
                15,
                y
            );

            y += 5;
        }

        if (data.payment.iban) {
            doc.text(
                `IBAN: ${data.payment.iban}`,
                15,
                y
            );

            y += 5;
        }

        y += 8;
    }

    /* -----------------------------------------------------
       TERMS
    ----------------------------------------------------- */

    if (data.terms) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        doc.text(
            "Payment Terms",
            15,
            y
        );

        y += 6;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        const termsLines = doc.splitTextToSize(
            data.terms,
            pageWidth - 30
        );

        doc.text(
            termsLines,
            15,
            y
        );

        y += termsLines.length * 5 + 8;
    }

    /* -----------------------------------------------------
       NOTES
    ----------------------------------------------------- */

    if (data.notes) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        doc.text(
            "Notes",
            15,
            y
        );

        y += 6;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        const notesLines = doc.splitTextToSize(
            data.notes,
            pageWidth - 30
        );

        doc.text(
            notesLines,
            15,
            y
        );
    }

    /* -----------------------------------------------------
       FOOTER
    ----------------------------------------------------- */

    const pageHeight =
        doc.internal.pageSize.getHeight();

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    doc.text(
        "Generated by GCC Finance Tools",
        pageWidth / 2,
        pageHeight - 10,
        {
            align: "center"
        }
    );

    /* -----------------------------------------------------
       SAVE PDF
    ----------------------------------------------------- */

    const filename =
        `${data.invoice.number || "Invoice"}.pdf`;

    doc.save(filename);
}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* -----------------------------------------------------
       Country
    ----------------------------------------------------- */

    const countrySelect =
        document.getElementById("country");

    if (countrySelect) {
        updateCountry();

        countrySelect.addEventListener(
            "change",
            updateCountry
        );
    }


    /* -----------------------------------------------------
       Invoice Date
    ----------------------------------------------------- */

    const invoiceDate =
        document.getElementById("invoiceDate");

    if (invoiceDate && !invoiceDate.value) {
        invoiceDate.value =
            new Date().toISOString().split("T")[0];
    }


    /* -----------------------------------------------------
       Invoice Number
    ----------------------------------------------------- */

    const invoiceNumber =
        document.getElementById("invoiceNumber");

    if (
        invoiceNumber &&
        !invoiceNumber.value
    ) {
        setNewInvoiceNumber();
    }


    /* -----------------------------------------------------
       Invoice Status
    ----------------------------------------------------- */

    const invoiceStatus =
        document.getElementById("invoiceStatus");

    if (invoiceStatus && !invoiceStatus.value) {
        invoiceStatus.value = "Unpaid";
    }


    /* -----------------------------------------------------
       Invoice Items
    ----------------------------------------------------- */

    const invoiceItems =
        document.getElementById("invoiceItems");

    if (
        invoiceItems &&
        invoiceItems.children.length === 0
    ) {
        addInvoiceItem();
    }


    /* -----------------------------------------------------
       Number Input Formatting
    ----------------------------------------------------- */

    document.addEventListener(
        "input",
        function (event) {

            const target = event.target;

            if (
                target.matches(
                    "#salary, #invoiceDiscount, #invoiceVat, #vatAmount, #vatRate, #gratuitySalary, #gratuityYears, .item-price"
                )
            ) {
                /*
                   Do not format while the user is entering
                   a decimal point manually.
                */
                if (
                    target.value &&
                    target.value.endsWith(".")
                ) {
                    return;
                }

                formatNumberInput(target);
            }

            if (
                target.matches(
                    ".item-quantity, .item-price"
                )
            ) {
                calculateInvoice();
            }
        }
    );


    /* -----------------------------------------------------
       Invoice Calculations
    ----------------------------------------------------- */

    calculateInvoice();


    /* -----------------------------------------------------
       Restore Saved Company Information
       If available
    ----------------------------------------------------- */

    try {

        const savedCompany =
            JSON.parse(
                localStorage.getItem(
                    "gccCompanyInformation"
                ) || "null"
            );

        if (savedCompany) {

            const companyFields = {
                companyName: savedCompany.name,
                companyAddress: savedCompany.address,
                companyVat: savedCompany.vat,
                companyPhone: savedCompany.phone,
                companyEmail: savedCompany.email
            };

            Object.keys(companyFields).forEach(id => {

                const element =
                    document.getElementById(id);

                if (
                    element &&
                    !element.value &&
                    companyFields[id]
                ) {
                    element.value =
                        companyFields[id];
                }
            });
        }

    } catch (error) {
        console.warn(
            "Unable to restore company information."
        );
    }


    /* -----------------------------------------------------
       Automatically Save Company Information
    ----------------------------------------------------- */

    const companyFieldIds = [
        "companyName",
        "companyAddress",
        "companyVat",
        "companyPhone",
        "companyEmail"
    ];

    companyFieldIds.forEach(id => {

        const element =
            document.getElementById(id);

        if (!element) return;

        element.addEventListener(
            "input",
            function () {

                const companyData = {
                    name:
                        document.getElementById(
                            "companyName"
                        )?.value || "",

                    address:
                        document.getElementById(
                            "companyAddress"
                        )?.value || "",

                    vat:
                        document.getElementById(
                            "companyVat"
                        )?.value || "",

                    phone:
                        document.getElementById(
                            "companyPhone"
                        )?.value || "",

                    email:
                        document.getElementById(
                            "companyEmail"
                        )?.value || ""
                };

                localStorage.setItem(
                    "gccCompanyInformation",
                    JSON.stringify(companyData)
                );
            }
        );
    });


    /* -----------------------------------------------------
       Logo Persistence
    ----------------------------------------------------- */

    const savedLogo =
        localStorage.getItem(
            "gccCompanyLogo"
        );

    if (savedLogo) {

        companyLogoData = savedLogo;

        const preview =
            document.getElementById("logoPreview");

        if (preview) {
            preview.innerHTML = `
                <img
                    src="${savedLogo}"
                    alt="Company Logo"
                >
            `;
        }
    }


    /* -----------------------------------------------------
       Save Logo When Uploaded
    ----------------------------------------------------- */

    const logoInput =
        document.getElementById("companyLogo");

    if (logoInput) {

        logoInput.addEventListener(
            "change",
            function () {

                setTimeout(() => {

                    if (companyLogoData) {

                        localStorage.setItem(
                            "gccCompanyLogo",
                            companyLogoData
                        );
                    }

                }, 100);
            }
        );
    }

});