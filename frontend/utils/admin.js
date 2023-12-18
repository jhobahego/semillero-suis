import { Modal } from "bootstrap";
import { getUsers } from '../services/userServices';
import { notificationUtilities } from '../services/notificationService.js';

const userModal = document.getElementById("userModal");
const modal = new Modal(userModal);

const userModalTitle = document.getElementById("userModalTitle");
const userModalSubtitle = document.getElementById("userModalSubtitle");

export async function manageUser() {
  const userForm = document.getElementById("userForm");

  const { data: users } = await getUsers(); // Supongamos que getUsers() retorna un array de usuarios

  // Mostrar el modal con la información del usuario
  modal.show();

  // Al darle a buscar usuario
  document.getElementById("userSearchButton").addEventListener("click", () => {
    const search = document.getElementById("userSearchInput").value;
    const criteria = document.getElementById("userSearchCriteria").value;

    console.log({ search, criteria });

    const user = users.find(user => {
      if (criteria === "name") {
        return user.name === search;
      }

      return user.email === search;
    })

    if (!user) {
      const translatedCriteria = criteria === "name" ? "nombre" : "correo";
      return notificationUtilities.popup('Usuario no encontrado', `Usuario con ${translatedCriteria}: ${search} no encontrado`);
    }

    // Rellenar los campos del formulario con la información del usuario seleccionado
    document.getElementById("userId").value = user.id;
    document.getElementById("userName").value = user.name;
    document.getElementById("userLastName").value = user.lastname;
    document.getElementById("userEmail").value = user.email;

    // Manejo de permisos del usuario #TODO: Creacion de endpoint para obtener los permisos desde la api
    // const permisos = await getAuthorities();

    // permisos.forEach((permiso) => {
    //   const checkboxDiv = document.createElement('div');
    //   checkboxDiv.classList.add('form-check');

    //   const checkboxInput = document.createElement('input');
    //   checkboxInput.classList.add('form-check-input');
    //   checkboxInput.type = 'checkbox';
    //   checkboxInput.id = `permiso_${permiso.id}`;
    //   checkboxInput.value = permiso.id;

    //   const checkboxLabel = document.createElement('label');
    //   checkboxLabel.classList.add('form-check-label');
    //   checkboxLabel.setAttribute('for', `permiso_${permiso.id}`);
    //   checkboxLabel.textContent = permiso.nombre;

    //   checkboxDiv.appendChild(checkboxInput);
    //   checkboxDiv.appendChild(checkboxLabel);

    //   document.getElementById("authorities").appendChild(checkboxDiv);
    // });

    document.getElementById("userInformation").classList.remove("d-none");

    userForm.addEventListener("submit", (event) => {
      event.preventDefault();
    })
  });

  document.getElementById("closeUserModalBtn").addEventListener("click", () => modal.hide());
}
