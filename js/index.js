// 1. Input with spaces allowed - The form accepts text inputs that can contain spaces. ✅

// 2. Delete / Edit confirmation - A confirmation modal appears before deleting or editing a student record.✅

// 3. Undo edit option - An Undo button is available when editing, allowing users to cancel changes. ✅

// 4. Form reset button - A dedicated button resets the entire form. ✅

// 5. Row highlight on edit - The row being edited is visually highlighted with a CSS class . ✅

// 6. No student alert - An alert is displayed when the table has no student records. ✅

// 7. Form validation feedback - Custom design for valid and invalid input states improves user experience. ✅
// --------------------
// 8. Email & phone is unique  >> if entered before >> show error (this Email entered before) ✅
// 9. Show a submit message if any required field is empty or invalid.  ✅
// 11. Handle if submit and one of inputs is empty to display alert message  ✅
// 10. Delete All Students. ✅

//! _______________________________________ Global_Variables _______________________________________ 

let form = document.querySelector("form"),
    inputs = Array.from(form.querySelectorAll(".box input")),
    students = [],
    id = 0,
    tableBody = document.querySelector("table tbody"),
    alertTable = document.querySelector("[data-alert='table']"),
    regexInputs = {
        firstName: /^[A-Za-z]+$/,
        lastName: /^[A-Za-z]+$/,
        email: /^[A-Za-z_][A-Za-z_\d\.]+@(gmail|yahoo)\.(com|org)$/,
        age: /^\d{2}$/,
        phone: /^(02)?01(0|1|2|5)\d{8}$/,
    },
    btnDeleteAll = document.querySelector(".btn-delete-all"),
    resetEle = document.querySelector(".reset"),
    searchInput = document.querySelector("#SearchInput"),
    popEle = document.querySelector("#Popup"),
    popBox = popEle.querySelector(".box");


//! _______________________________________ local_Storage _______________________________________ 

if (localStorage.getItem("students")) {

    students = JSON.parse(localStorage.getItem("students"));

    // Get the ID of the last student.
    // Optional Chaining (?.) safely accesses the ID if a last student exists.
    // If the array is empty, it returns undefined instead of throwing an error.
    // Nullish Coalescing (??) uses 0 when the result is null or undefined.
    id = students[students.length - 1]?.id ?? 0;
    showAllStudents(students);

} else {
    updateLocalStorage();
}

updateTableState(students);

//! _______________________________________ Submit _______________________________________ 

form.addEventListener("submit", function (e) {
    e.preventDefault();


    let focusInput = form.querySelector("input:focus");
    focusInput?.blur();

    inputs.forEach(function (input) {
        checkInput(input);
        showResetIcon(input);
    });


    let isInvalidInput = form.querySelector("input.is-invalid"),
        emptyInput = form.querySelector("input[data-empty='true']"),
        alertSubmit = form.querySelector("[data-error-name='submit']"),
        alertSubmitMsg = '';

    //*  null  >>  false (falsy value);
    //* !null >>  true (truthy value)

    if (isInvalidInput && !emptyInput) {
        alertSubmit.classList.remove("d-none");
        alertSubmitMsg = "Please check invalid field";
        alertSubmit.textContent = alertSubmitMsg;
        return;

    } else if (isInvalidInput || emptyInput) {
        alertSubmit.classList.remove("d-none");
        alertSubmitMsg = "Please fill in all required fields";
        alertSubmit.textContent = alertSubmitMsg;

        return;

    } else {
        alertSubmit.classList.add("d-none");
    }

    // __________________________

    let formType = form.getAttribute("data-type");

    if (formType == 'add') {
        addStudent();
        resetForm();

    } else if (formType == 'edit') {
        confirmEditStudent();
    }

});


//! _______________________________________ Search _______________________________________

searchInput.addEventListener("keyup", function () {
    search(this.value);
});

//! _______________________________________ closePopup _______________________________________

popEle.onclick = function () {
    closePopup();
};

popBox.onclick = function (e) {
    e.stopPropagation();
};
