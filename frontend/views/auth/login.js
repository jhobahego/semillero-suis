import { login } from "./services.js";

const inputEmail = document.getElementById("inputEmail")
const inputPassword = document.getElementById("inputPassword")

const loginBtn = document.getElementById("loginBtn")
const loginForm = document.getElementById("loginForm")

loginForm.addEventListener('submit', (e) => loginUser(e))

const loginUser = async (e) => { // Validar cors y submit del formulario
  e.preventDefault()

  if (!validFields()) return alert("Rellena los campos necesarios")

  try {
    const formData = new FormData()

    const username = inputEmail.value
    const password = inputPassword.value

    formData.append("username", username)
    formData.append("password", password)

    const response = await login(formData)
    const { data } = response

    localStorage.setItem("token", data.access_token)
  } catch (error) {
    console.log(error)
    const { detail } = error.response.data
    return alert("Error: " + detail)
  }

  setTimeout(alert("Login existoso"), 4000)
  window.location.href = "http://localhost:5500/frontend/index.html"
}

function validFields() {
  return inputEmail.value.trim() !== ''
    || inputPassword.value.trim() !== ''
}