export const manageSession = () => {
  document.addEventListener("DOMContentLoaded", () => {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const registroLink = document.querySelector('a[href="/frontend/views/auth/register.html"]');
    const iniciarSesionBtn = document.getElementById('iniciarSesionBtn');
    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');

    const usuario = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (token && token !== '') {
      registroLink.style.display = 'none';
      iniciarSesionBtn.style.display = 'none';
    } else if (usuario) {
      registroLink.style.display = 'none';
      cerrarSesionBtn.style.display = 'block';
    } else {
      registroLink.style.display = 'block';
      cerrarSesionBtn.style.display = 'none';
    }

    cerrarSesionBtn.addEventListener('click', () => {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      window.location.href = "/frontend/views/auth/login.html";
    });

    iniciarSesionBtn.addEventListener('click', () => {
      window.location.href = "/frontend/views/auth/login.html";
    });

    console.log({ usuario, token });
  });
}
