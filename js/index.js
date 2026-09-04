//! _______________________________________ Global_Variables _______________________________________ 

let form = document.querySelector("form"),
    inputs = Array.from(form.querySelectorAll(".box input")),
    students = [],
    id = 0,
    tableBody = document.querySelector("table tbody"),
    regexInputs = {
        firstName: /^[A-Za-z]+$/,
        lastName: /^[A-Za-z]+$/,
        email: /^[A-Za-z_][A-Za-z_\d\.]+@(gmail|yahoo)\.(com|org)$/,
        // age from 20 to 30
        age: /^(2[0-9]|30)$/,
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

    id = +localStorage.getItem("largestId");

    showAllStudents(students);

} else {
    updateLocalStorage();
}

updateTableState(students);

//! _______________________________________ Submit _______________________________________ 

form.addEventListener("submit", function (e) {
    e.preventDefault();

    inputs.forEach(function (input) {
        checkInput(input);
        showResetIcon(input);
    });

    let isInvalidInput = form.querySelector("input.is-invalid"),
        emptyInput = form.querySelector("input[data-empty='true']");

    if (isInvalidInput || emptyInput) {
        return;
    }

    // _______________________
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

//! _______________________________________ Close_Popup _______________________________________

popEle.onclick = function () {
    closePopup();
};

popBox.onclick = function (e) {
    e.stopPropagation();
};