export const manageSession = () => {
  document.addEventListener("DOMContentLoaded", () => {
    const registroItem = document.getElementById('register-item');
    const adminItem = document.getElementById('administracion-item');
    const iniciarSesionBtn = document.getElementById('iniciarSesionBtn');
    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');

    const isActive = usuario ? usuario.is_active : false;
    const isSuperuser = usuario ? usuario.is_superuser : false;
    const isLoggedIn = token && token !== null;

    // Elementos para manejar navbar responsive
    const navbarToggler = document.getElementById('navbar-toggler');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');

    // Muestra u oculta el menu lateral al hacer clic en el botón de hamburguesa
    navbarToggler.addEventListener('click', function () {
      mobileMenu.classList.toggle('show');
      overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', function () {
      if (mobileMenu.classList.contains('show')) {
        mobileMenu.classList.remove('show');
        overlay.classList.remove('show');
      }
    });

    const hideElement = (element) => {
      if (element) {
        element.style.display = 'none';
      }
    };

    const showElement = (element) => {
      if (element) {
        element.style.display = 'block';
      }
    };

    const hideRegisterAndLogin = () => {
      hideElement(registroItem);
      hideElement(iniciarSesionBtn);
    };

    const showLogout = () => {
      showElement(cerrarSesionBtn);
    };

    const hideLogout = () => {
      hideElement(cerrarSesionBtn);
    };

    const hideAdminItem = () => {
      hideElement(adminItem);
    };

    // Logica de renderizado en base al usuario y su rol
    if (isLoggedIn) {
      hideRegisterAndLogin();
      showLogout();
      if (isActive && isSuperuser) {
        showElement(adminItem);
      } else {
        hideAdminItem();
      }
    } else {
      showElement(registroItem);
      hideLogout();
      hideAdminItem();
    }

    cerrarSesionBtn.addEventListener('click', () => {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      localStorage.removeItem('sessionStarted');
      window.location.href = "/views/auth/login.html";
    });

    iniciarSesionBtn.addEventListener('click', () => {
      window.location.href = "/views/auth/login.html";
    });
  });
};
