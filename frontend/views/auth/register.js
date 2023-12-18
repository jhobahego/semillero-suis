import * as bootstrap from 'bootstrap'
import { notificationUtilities } from "../../services/notificationService.js";
import { registerUser } from "../../services/authenticationService.js";
import { validFields, hideElements, showElements } from '../../utils/register.js';
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

// Muestra u oculta campos segun si es profesor o estudiante
selectEl.addEventListener("change", () => {
  if (selectEl.value === 'TEACHER') {
    hideElements([
      semesterDiv,
      programaDiv,
      facultyDiv,
      researchTeamDiv
    ]);
  } else if (selectEl.value === 'STUDENT') {
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

  const selectValue = selectEl.value
  if (!validFields({
    selectValue,
    dniInput,
    nombreInput,
    apellidoInput,
    telefonoInput,
    emailInput,
    passwordInput,
    universityInput,
    semesterInput,
    programaInput,
    facultyInput,
    researchTeamInput
  })) return notificationUtilities.error("Debes rellenar todos los campos requeridos");

  const user = {
    dni: dniInput.value,
    name: nombreInput.value,
    lastname: apellidoInput.value,
    phone_number: telefonoInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    university: universityInput.value,
    sede: sedeInput.value,
    rol: selectEl.value
  };

  // Campos adicionales para usuario estudiante
  if (selectEl.value === 'STUDENT') {
    user.semester = semesterInput.value;
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
