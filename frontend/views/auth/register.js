import * as bootstrap from 'bootstrap'
import { notificationUtilities } from "../../services/notificationService.js";
import { registerUser } from "../../services/authenticationService.js";
import { manageSession } from '../../utils/navbar.js'

manageSession();

const selectEl = document.getElementById('select');

const dniInput = document.getElementById("dni");
const universityInput = document.getElementById("university");
const nombreInput = document.getElementById("exampleInputNombre");
const apellidoInput = document.getElementById("exampleInputApellido1");
const emailInput = document.getElementById("exampleInputDireccion1");
const passwordInput = document.getElementById("exampleInputEmail1");

const sedeInput = document.getElementById("sede");
const semesterInput = document.getElementById('semester');
const telefonoInput = document.getElementById('phoneNumber');
const programaInput = document.getElementById('program');
const facultyInput = document.getElementById('faculty');
const researchTeamInput = document.getElementById('researchTeam');

const semesterDiv = document.getElementById('semesterDiv');
const programaDiv = document.getElementById('programDiv');
const facultyDiv = document.getElementById('facultyDiv');
const researchTeamDiv = document.getElementById('researchTeamDiv');

selectEl.addEventListener("change", () => {
  if (selectEl.value === 'teacher') {
    hideElements([
      semesterDiv,
      programaDiv,
      facultyDiv,
      researchTeamDiv
    ]);
  } else if (selectEl.value === 'student') {
    showElements([
      semesterDiv,
      programaDiv,
      facultyDiv,
      researchTeamDiv
    ]);
  }
});

registerForm.addEventListener("submit", (event) => register(event));

async function register(event) {
  event.preventDefault();

  if (!validFields()) return notificationUtilities.error("Debes rellenar todos los campos requeridos");

  const user = {
    dni: dniInput.value,
    name: nombreInput.value,
    lastname: apellidoInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    university: universityInput.value,
    sede: sedeInput.value
  };

  if (semesterInput && semesterInput.value.trim() !== '') {
    user.semester = semesterInput.value;
  }

  // Additional fields for student
  if (selectEl.value === 'student') {
    user.phone_number = telefonoInput.value;
    user.program = programaInput.value;
    user.faculty = facultyInput.value;
    user.research_team = researchTeamInput.value;
  }

  try {
    const response = await registerUser(user);
    const { data } = response;
    localStorage.setItem("usuario", JSON.stringify(data));
    window.location.href = "/views/auth/login.html";
  } catch (error) {
    return;
  }
}

function validFields() {
  const selectValue = selectEl.value;

  if (selectValue === 'teacher') {
    return checkFields([dniInput, nombreInput, apellidoInput, emailInput, passwordInput, universityInput]);
  } else if (selectValue === 'student') {
    return checkFields([dniInput, nombreInput, apellidoInput, emailInput, passwordInput, universityInput, semesterInput, programaInput, facultyInput, researchTeamInput]);
  }

  return false;
}

function checkFields(fields) {
  return fields.every(field => field.value.trim() !== '');
}

function hideElements(elements) {
  elements.forEach(element => {
    element.classList.add('d-none');
  });
}

function showElements(elements) {
  elements.forEach(element => {
    element.classList.remove('d-none');
  });
}
