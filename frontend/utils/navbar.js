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
      window.location.href = "/views/auth/login.html";
    });

    iniciarSesionBtn.addEventListener('click', () => {
      window.location.href = "/views/auth/login.html";
    });
  });
};
