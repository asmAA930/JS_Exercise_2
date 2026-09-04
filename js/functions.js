//! _________________________________________
function getStudent(id) {
    let student = { id: id };

    inputs.forEach(function (input) {
        let inputName = input.name,
            inputValue = input.value.trim();
        student[inputName] = inputValue;
    });

    return student;
}

//! _________________________________________
function addStudent() {
    let student = getStudent(++id);
    students.push(student);

    updateLocalStorage();
    showStudent(student);
    updateTableState(students);

    localStorage.setItem("largestId", `${student.id}`);
}

//! _________________________________________
function editStudent() {

    let studentId = form.dataset.studentId,
        student = getStudent(studentId),
        studentIndex = getStudentIndex(studentId),
        trStudent = tableBody.querySelector(`tr[data-student-${studentId}]`);

    students[studentIndex] = student;

    trStudent.innerHTML = `
        <th>${student.id}</th>
        <td>${student.firstName}</td>
        <td>${student.lastName}</td>
        <td>${student.email}</td>
        <td>${student.age}</td>
        <td>${student.phone}</td>
        <td>
            <div class="buttons">
                <button class="btn btn-edit me-3" onclick='insertStudentIntoForm(${student.id},this)'><i class="fa-solid fa-user-pen"></i> Edit</button>
                <button class="btn btn-delete" onclick='confirmDeleteStudentById(${student.id},this)'><i class="fa-solid fa-user-minus"></i> Delete</button>
            </div>
        </td>
        `;

    trStudent.classList.add("table-success");
    setTimeout(function () {
        trStudent.classList.remove("table-success");
    }, 700);

    updateLocalStorage();
}

//! _________________________________________
function getStudentIndex(id) {
    return students.findIndex((student) => student.id == id);
}

//! _________________________________________
function showStudent(student) {
    tableBody.innerHTML += `
        <tr data-student-${student.id}>
            <th>${student.id}</th>
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.email}</td>
            <td>${student.age}</td>
            <td>${student.phone}</td>
            <td>
                <div class="buttons">
                    <button class="btn btn-edit me-3" onclick='insertStudentIntoForm(${student.id},this)'><i class="fa-solid fa-user-pen"></i> Edit</button>
                    <button class="btn" onclick='confirmDeleteStudentById(${student.id},this)'><i class="fa-solid fa-user-minus"></i> Delete</button>
                </div>
            </td>
        </tr>
        `;
}

//! _________________________________________
function showAllStudents(studentData) {
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="alert border-0 table-warning text-center m-0" role="alert"
                data-alert="table">
                There are no students
            </td>
        </tr>
    `;
    studentData.forEach(function (student) {
        showStudent(student);
    });
}

//! _________________________________________
function checkInput(input) {
    let inputName = input.name,
        inputValue = input.value.trim(),
        isEmpty = inputValue == "",
        alertInput = document.querySelector(`p.alert[data-error-name="${inputName}"]`),
        isInvalid = !regexInputs[inputName].test(inputValue),
        alertInputMsg = "",
        isExistEmail = false,
        isExistPhone = false,
        existId;

    if (inputName == "email" || inputName == "phone") {

        for (let student of students) {

            if (form.getAttribute('data-type') == 'edit' && form.dataset.studentId == student.id) {
                continue;

            } else if (student.email == inputValue) {
                isExistEmail = true;
                existId = student.id;

            } else if (student.phone == inputValue) {
                isExistPhone = true;
                existId = student.id;
            }
        };
    }

    if (isEmpty) {
        alertInputMsg = "This field is required.";

    } else if ((inputName == "age") && isInvalid) {
        alertInputMsg = "Invalid field. Age must be between 20 and 30.";

    } else if (isInvalid) {
        alertInputMsg = "Invalid field.";

    } else if (isExistEmail) {
        alertInputMsg = "This email already exists.";

    } else if (isExistPhone) {
        alertInputMsg = "This phone already exists.";
    }

    // ------------------------------

    if ((isInvalid && !isEmpty) || isExistEmail || isExistPhone) {
        // inCorrect
        input.classList.add("is-invalid");
        alertInput.textContent = alertInputMsg;
        alertInput.classList.remove("d-none");
        input.classList.remove("is-valid");

        input.dataset.empty = false;

    } else if (isEmpty) {
        // inCorrect
        input.classList.add("is-invalid");
        alertInput.textContent = alertInputMsg;
        alertInput.classList.remove("d-none");
        input.classList.remove("is-valid");

        input.dataset.empty = true;

    } else {
        // correct
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        alertInput.classList.add("d-none");
        alertInput.textContent = "";
        input.dataset.empty = false;
    }
}

//! _________________________________________
function resetBtns() {
    if (form.getAttribute('data-type') == 'edit') {
        let btnSubmit = document.querySelector(".btn-submit");
        btnSubmit.innerHTML = '<i class="fa-solid fa-user-plus"></i> Add';
        btnSubmit.style.removeProperty("background");
        btnSubmit.style.removeProperty("color");

        let btnEdit = tableBody.querySelector(".buttons .btn-edit[disabled]");
        btnEdit.removeAttribute('disabled');
        btnEdit.nextElementSibling.removeAttribute('disabled');

        searchInput.removeAttribute('disabled');
        searchInput.previousElementSibling.removeAttribute("style");
        searchInput.previousElementSibling.firstElementChild.classList.remove("text-secondary");
    }
}

//! _________________________________________
function resetForm() {
    inputs.forEach(function (input) {
        input.dataset.empty = true;
        input.classList.remove("is-valid");

        input.classList.remove("is-invalid");
        let alertInput = input.parentElement.nextElementSibling;
        alertInput.classList.add("d-none");
        alertInput.textContent = "";
    });

    form.setAttribute('data-type', 'add');
    form.removeAttribute('data-student-id');
    resetEle.classList.add("d-none");

    form.reset();
}

//! _________________________________________
function updateLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
}

//! _________________________________________
function updateTableState(studentsData) {
    tableAlert = document.querySelector("[data-alert='table']");

    if (studentsData.length == 0) {
        tableAlert.classList.remove("d-none");
        btnDeleteAll.classList.add("d-none");

    } else if (studentsData.length == 1) {
        tableAlert.classList.add("d-none");
        btnDeleteAll.classList.add("d-none");

    } else if (studentsData.length > 1) {
        tableAlert.classList.add("d-none");
        btnDeleteAll.classList.remove("d-none");
    }
}

//! _________________________________________
function deleteAll() {
    if (form.dataset.type == 'edit') {
        resetEle.onclick();
    }

    students = [];
    updateLocalStorage();
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="alert border-0 table-warning text-center m-0" role="alert"
                data-alert="table">
                There are no students
            </td>
        </tr>
    `;

    updateTableState(students);
}
//! _________________________________________
function deleteStudentById(id, that) {
    let studentIndex = getStudentIndex(id);

    students.splice(studentIndex, 1);
    updateLocalStorage();
    let trStudent = that.closest("tr");

    trStudent.remove();

    updateTableState(students);
}

//! _________________________________________
function showResetIcon(currentInput) {
    if (currentInput.dataset.empty == 'false' || currentInput.classList.contains('is-invalid')) {
        resetEle.classList.remove("d-none");

    } else {
        resetEle.classList.add("d-none");
    }
}

//! _________________________________________
function insertStudentIntoForm(id, btnEdit) {
    resetBtns();
    resetForm();

    let editStudent = students.find((student) => student.id == id),
        btnSubmit = document.querySelector(".btn-submit"),
        backGroundBtnEdit;

    btnSubmit.innerHTML = btnEdit.innerHTML;
    backGroundBtnEdit = getComputedStyle(btnEdit).background;
    btnSubmit.style.background = backGroundBtnEdit;
    btnSubmit.style.color = "#000";

    form.setAttribute('data-type', 'edit');
    form.setAttribute('data-student-id', id);

    //* to set boolean attribute
    // element.setAttribute('disabled', 'disabled');
    // element.setAttribute('disabled', 'true');
    // element.setAttribute('disabled', ' ');
    btnEdit.setAttribute('disabled', 'disabled');
    btnEdit.nextElementSibling.setAttribute('disabled', 'true');

    searchInput.setAttribute('disabled', 'true');
    searchInput.previousElementSibling.style.cursor = "auto";
    searchInput.previousElementSibling.firstElementChild.classList.add("text-secondary");

    inputs.forEach(function (input) {
        input.value = editStudent[input.name];
        input.dataset.empty = "false";
        showResetIcon(input);
        checkInput(input);
    });
}

//! _________________________________________
function search(searchValue) {
    let filteredStudents = students.filter(function (student) {
        return student.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
            student.email.toLowerCase().includes(searchValue.toLowerCase()) ||
            student.age.toLowerCase().includes(searchValue.toLowerCase()) ||
            student.phone.toLowerCase().includes(searchValue.toLowerCase());
    });
    showAllStudents(filteredStudents);
    updateTableState(filteredStudents);
}

//! _________________________________________
function confirmDeleteStudentById(studentId, btnDeleteStudent) {

    popBox.innerHTML = `
    <p>Delete Student</p>
    <hr>
    <p>Are you sure you want to delete student?</p>
    <hr>
    <div class="buttons d-flex justify-content-end">
        <button class="btn me-3 btn-cancel btn-secondary ">Cancel</button>
        <button class="btn btn-delete">Yes, Delete</button>
    </div>
    `;

    openPopup();

    let btnConfirmDelete = popEle.querySelector(".btn-delete"),
        btnConfirmCancel = btnConfirmDelete.previousElementSibling;

    btnConfirmDelete.addEventListener("click", function () {
        closePopup();
        deleteStudentById(studentId, btnDeleteStudent);
    });

    btnConfirmCancel.addEventListener("click", function () {
        closePopup();
    });
}
//! _________________________________________
function confirmDeleteAllStudents() {

    popBox.innerHTML = `
    <p>Delete All</p>
    <hr>
    <p>Are you sure you want to delete all students?</p>
    <hr>
    <div class="buttons d-flex justify-content-end">
        <button class="btn me-3 btn-cancel btn-secondary ">Cancel</button>
        <button class="btn btn-delete">Yes, Delete All</button>
    </div>
    `;

    openPopup();

    let btnConfirmDeleteAll = popEle.querySelector(".btn-delete"),
        btnConfirmCancel = btnConfirmDeleteAll.previousElementSibling;

    btnConfirmDeleteAll.addEventListener("click", function () {
        closePopup();
        deleteAll();
    });

    btnConfirmCancel.addEventListener("click", function () {
        closePopup();
    });
}
//! _________________________________________
function confirmEditStudent() {

    popBox.innerHTML = `
            <p>Edit</p>
            <hr>
            <p>Are you sure you want to save these changes?</p>
            <hr>
            <div class="buttons d-flex justify-content-end">
                <button class="btn me-3 btn-cancel btn-secondary ">Cancel</button>
                <button class="btn btn-edit">Yes, Save</button>
            </div>
            `;

    openPopup();

    let btnConfirmEdit = popBox.querySelector(".btn-edit"),
        btnConfirmCancel = btnConfirmEdit.previousElementSibling;

    btnConfirmEdit.addEventListener("click", function () {
        closePopup();
        resetBtns();
        editStudent();
        resetForm();

    });

    btnConfirmCancel.addEventListener("click", function () {
        closePopup();
    });
}
//! _________________________________________
function openPopup() {
    popEle.classList.remove("d-none");

    setTimeout(function () {
        popEle.classList.add("show");
    }, 1);
}

//! _________________________________________
function closePopup() {
    popEle.classList.remove("show");

    setTimeout(function () {
        popEle.classList.add("d-none");
    }, 300);
}
