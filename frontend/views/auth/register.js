import * as bootstrap from 'bootstrap'

import { notificationUtilities } from "../../services/notificationService.js";
import { registerUser } from "../../services/authenticationService.js";

import { manageSession } from "../../utils/navbar.js";

manageSession()

let dniInput = document.getElementById("dni");
let universityInput = document.getElementById("university");
let semesterInput = document.getElementById("semester");
let sedeInput = document.getElementById("sede");
let nombreInput = document.getElementById("exampleInputNombre");
let apellidoInput = document.getElementById("exampleInputApellido1");
let emailInput = document.getElementById("exampleInputDireccion1");
let passwordInput = document.getElementById("exampleInputEmail1");

const selectEl = document.getElementById('select');
const semesterLabel = document.getElementById('semestre-label')

selectEl.addEventListener("click", () => {
  if (selectEl.value === 'teacher') {
    semesterInput.classList.add('d-none')
    semesterLabel.classList.add('d-none')
  } else if (selectEl.value === 'student') {
    semesterInput.classList.remove('d-none')
    semesterLabel.classList.remove('d-none')
  }
})

registerForm.addEventListener("submit", (event) => register(event))

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

  try {
    const response = await registerUser(user);
    const { data } = response;

    localStorage.setItem("usuario", JSON.stringify(data));
    window.location.href = "http://localhost:5500/frontend/views/auth/login.html";
  } catch (error) {
    return;
  }
}

function validFields() {
  const selectValue = selectEl.value

  if (selectValue === 'teacher') {
    return (
      dniInput.value.trim() !== '' &&
      nombreInput.value.trim() !== '' &&
      apellidoInput.value.trim() !== '' &&
      emailInput.value.trim() !== '' &&
      passwordInput.value.trim() !== '' &&
      universityInput.value.trim() !== ''
    );
  } else if (selectValue === 'student') {
    return (
      dniInput.value.trim() !== '' &&
      nombreInput.value.trim() !== '' &&
      apellidoInput.value.trim() !== '' &&
      emailInput.value.trim() !== '' &&
      passwordInput.value.trim() !== '' &&
      universityInput.value.trim() !== '' &&
      semesterInput.value.trim() !== ''
    );
  }

  return false;
}







// async function register(event) {
//   event.preventDefault()

//   if (!validFields()) return notificationUtilities.error("Debes rellenar todos los campos requeridos");

//   const user = {
//     name: nombreInput.value,
//     lastname: apellidoInput.value,
//     email: emailInput.value,
//     password: passwordInput.value
//   }

//   try {
//     const response = await registerUser(user)
//     const { data } = response

//     localStorage.setItem("usuario", JSON.stringify(data))
//   } catch (error) {
//     return
//   }

//   window.location.href = "http://localhost:5500/frontend/views/auth/login.html"
// }

// function validFields() {
//   return nombreInput.value.trim() !== ''
//     && apellidoInput.value.trim() !== ''
//     && emailInput.value.trim() !== ''
//     && passwordInput.value.trim() !== ''
// }
