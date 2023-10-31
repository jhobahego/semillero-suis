import { registerUser } from "./services.js";

let nombreInput = document.getElementById("exampleInputNombre");
let apellidoInput = document.getElementById("exampleInputApellido1");
let emailInput = document.getElementById("exampleInputDireccion1");
let passwordInput = document.getElementById("exampleInputEmail1");

let registerBtn = document.getElementById("registerBtn")

registerBtn.addEventListener("click", () => register())

async function register() {
  if (!validFields()) return alert("Debes rellenar antes todos los campos");

  const user = {
    name: nombreInput.value,
    lastname: apellidoInput.value,
    email: emailInput.value,
    password: passwordInput.value
  }

  try {
    const response = await registerUser(user)
    const { data } = response // usuario registrado en DB
  } catch (error) {
    const { detail } = error.response.data
    return alert("Error: " + detail)
  }

  setTimeout(alert("registro existoso"), 4000)
  window.location.href = "http://localhost:5500/frontend/index.html"
}

function validFields() {
  return nombreInput.value.trim() !== ''
    || apellidoInput.value.trim() !== ''
    || emailInput.value.trim() !== ''
    || passwordInput.value.trim() !== ''
}
