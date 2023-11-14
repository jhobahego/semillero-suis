import { notificationUtilities } from "../../services/notificationService.js";
import { login } from "../../services/authenticationService.js";

import { manageSession } from "../../utils/navbar.js";

manageSession()

const inputEmail = document.getElementById("inputEmail")
const inputPassword = document.getElementById("inputPassword")

const loginForm = document.getElementById("loginForm")

loginForm.addEventListener('submit', (e) => loginUser(e))

export const loginUser = async (e) => {
  e.preventDefault()

  if (!validFields()) return notificationUtilities.error("Rellena los campos necesarios")

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
    return
  }

  window.location.href = "http://localhost:5500/frontend/index.html"
}

function validFields() {
  return inputEmail.value.trim() !== ''
    && inputPassword.value.trim() !== ''
}