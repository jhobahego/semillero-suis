import { notificationUtilities } from "../../services/notificationService.js";
import { registerUser } from "../../services/authenticationService.js";

let nombreInput = document.getElementById("exampleInputNombre");
let apellidoInput = document.getElementById("exampleInputApellido1");
let emailInput = document.getElementById("exampleInputDireccion1");
let passwordInput = document.getElementById("exampleInputEmail1");

registerForm.addEventListener("submit", (event) => register(event))

async function register(event) {
  event.preventDefault()

  if (!validFields()) return notificationUtilities.error("Debes rellenar todos los campos requeridos");

  const user = {
    name: nombreInput.value,
    lastname: apellidoInput.value,
    email: emailInput.value,
    password: passwordInput.value
  }

  try {
    const response = await registerUser(user)
    const { data } = response

    localStorage.setItem("usuario", JSON.stringify(data))
  } catch (error) {
    return
  }

  window.location.href = "http://localhost:5500/frontend/views/auth/login.html"
}

function validFields() {
  return nombreInput.value.trim() !== ''
    && apellidoInput.value.trim() !== ''
    && emailInput.value.trim() !== ''
    && passwordInput.value.trim() !== ''
}
