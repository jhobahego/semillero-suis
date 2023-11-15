import * as bootstrap from 'bootstrap'

import { notificationUtilities } from "../../services/notificationService.js";
import { login, obtenerUsuarioAutenticado } from "../../services/authenticationService.js";

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

    let response = await login(formData)
    const { data } = response

    localStorage.setItem("token", data.access_token)

    response = await obtenerUsuarioAutenticado()
    localStorage.setItem("usuario", JSON.stringify(response.data))
  } catch (error) {
    return
  }

  window.location.href = "/index.html"
}

function validFields() {
  return inputEmail.value.trim() !== ''
    && inputPassword.value.trim() !== ''
}