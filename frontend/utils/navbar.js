export const manageSession = () => {
  document.addEventListener("DOMContentLoaded", () => {
    const registroItem = document.getElementById('register-item')
    const adminItem = document.getElementById('administracion-item')
    const iniciarSesionBtn = document.getElementById('iniciarSesionBtn')
    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn')

    const usuario = localStorage.getItem('usuario')
    const token = localStorage.getItem('token')

    if (token && token !== '') {
      registroItem.style.display = 'none'
      iniciarSesionBtn.style.display = 'none'
    } else if (usuario) {
      registroItem.style.display = 'none'
      cerrarSesionBtn.style.display = 'block'
    } else {
      registroItem.style.display = 'block'
      cerrarSesionBtn.style.display = 'none'
      adminItem.style.display = 'none'
    }

    cerrarSesionBtn.addEventListener('click', () => {
      localStorage.removeItem('usuario')
      localStorage.removeItem('token')
      window.location.href = "/views/auth/login.html"
    })

    iniciarSesionBtn.addEventListener('click', () => {
      window.location.href = "/views/auth/login.html"
    })

    console.log({ usuario, token })
  })
}
