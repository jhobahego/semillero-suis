import * as bootstrap from 'bootstrap'

import { notificationUtilities } from "../../services/notificationService.js";
import { login, obtenerUsuarioAutenticado } from "../../services/authenticationService.js";
import Swal from 'sweetalert2'

import { manageSession } from "../../utils/navbar.js";

manageSession()

const inputEmail = document.getElementById("inputEmail")
const inputPassword = document.getElementById("inputPassword")

const loginForm = document.getElementById("loginForm")

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('token')) return document.location.href = '/index.html'

  const usuario = JSON.parse(localStorage.getItem('usuario'))
  if (usuario != undefined) {
    notificationUtilities.popup(
      'Registro existoso',
      'Te has logueado correctamente, ya puedes iniciar sesión',
    )
  }
})

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