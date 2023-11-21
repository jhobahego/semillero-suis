import * as bootstrap from 'bootstrap'
import { manageSession } from "./utils/navbar.js"
import { notificationUtilities } from './services/notificationService.js'

manageSession()

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const sessionStarted = localStorage.getItem('sessionStarted')

  if (token && usuario && !sessionStarted) {
    const { name } = usuario

    notificationUtilities.popup(
      'Sesión iniciada correctamente',
      `¡Bienvenido ${name}!`,
    )

    localStorage.setItem('sessionStarted', true)
  }
})
