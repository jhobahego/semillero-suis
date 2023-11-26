import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

import { createEvent, getEvents, getEvent, updateEvent } from '../services/eventService';
import { getUsers, getUser } from '../services/userServices';
import { notificationUtilities } from '../services/notificationService';

const modal = new Modal(document.getElementById("myModal"));
const formCalendar = document.getElementById("formCalendar");

document.getElementById("cancelBtn").addEventListener("click", () => {
  modal.hide();
});


export async function handleDateClick(info) {
  formCalendar.reset();
  setDefaultDates(info.dateStr);

  const managerSelect = document.getElementById("manager");

  const optionResponsables = await obtenerResponsables();

  managerSelect.innerHTML = optionResponsables;

  const titleElement = document.getElementById("titulo")
  const subTitleElement = document.getElementById("subtitle")
  const addButton = document.querySelector("#formCalendar button[type='submit']");
  const deleteButton = document.querySelector("#formCalendar button.btn-danger");

  titleElement.textContent = 'Creacion de evento';
  subTitleElement.textContent = 'Agregar evento';
  addButton.textContent = 'Agregar evento';
  addButton.classList.remove('btn-warning');
  deleteButton.style.display = 'none';

  modal.show();
  formCalendar.addEventListener("submit", handleFormSubmit);
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const eventData = getInputValues();

  // Valida los datos del formulario y muestra un error en caso de que falte un valor
  for (let key of Object.keys(eventData)) {
    if (eventData[key] === '') {
      notificationUtilities.warning('Fallo al agendar', 'Todos los campos son requeridos');
      return;
    }
  }

  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Seguro que deseas agendar este evento?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, agendar!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { data } = await createEvent(eventData)
      if (data) {
        modal.hide();
        notificationUtilities.popup(
          'Evento agendado',
          'El evento se ha agendado con éxito',
          2000
        );

        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
    }
  });

}

// Función para editar un evento
export async function handleEditEvent(info) {
  const { publicId } = info.event._def
  const { manager_id } = info.event.extendedProps

  const eventId = parseInt(publicId)

  // Se obtiene los datos del responsable desde la base de datos
  let response = await getUser(manager_id)
  const { name, lastname, email } = response.data
  const managerFullname = `${name} ${lastname}`

  // Petición al servidor para obtener los detalles del evento a editar
  response = await getEvent(eventId);
  if (response.data) {
    const { data } = response

    const managerSelect = document.getElementById("manager");

    // Se carga el select con los responsables
    const optionResponsables = await obtenerResponsables();
    managerSelect.innerHTML = optionResponsables;

    // Se selecciona el responsable de este evento en el select
    for (let i = 0; i < managerSelect.options.length; i++) {
      if (managerSelect.options[i].value === data.manager_id.toString()) {
        managerSelect.options[i].selected = true;
        break;
      }
    }

    // Actualiza los campos del formulario con los detalles del evento a editar
    document.getElementById("selectType").value = data.activity_type;
    document.getElementById("managerName").value = managerFullname;
    document.getElementById("managerEmail").value = email;
    document.getElementById("title").value = data.title;
    document.getElementById("start-date").value = data.start;
    document.getElementById("end-date").value = data.finished_at;
    document.getElementById("color").value = data.color;
    document.getElementById("descripcionEvento").value = data.description;
    document.getElementById("event-location").value = data.event_location;
    document.getElementById("duration").value = data.duration;

    // Actualiza los textos de los elementos en el formulario o modal
    document.getElementById("titulo").textContent = "Edición de evento";
    document.getElementById("subtitle").textContent = "Editar evento";

    const addButton = document.querySelector("#formCalendar button[type='submit']");
    const deleteButton = document.querySelector("#formCalendar button.btn-danger");

    // Se cambian los textos de los botones
    addButton.textContent = 'Guardar cambios';
    addButton.classList.add('btn-warning');
    deleteButton.style.display = 'none';

    const submitHandler = async (event) => {
      event.preventDefault();

      const editedEventData = getInputValues();

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas guardar los cambios del evento?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar cambios'
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, procede a actualizar el evento
          const { data } = await updateEvent(eventId, editedEventData);
          if (data) {
            modal.hide();
            notificationUtilities.popup(
              'Cambios guardados',
              'Los cambios se han guardado con éxito',
              2000
            );

            setTimeout(() => {
              window.location.reload();
            }, 2500);
          }
        }
      });
    };

    formCalendar.addEventListener("submit", submitHandler);
    modal.show();
  }
}

// Se obtienen todos los valores de los campos de los formularios
function getInputValues() {
  const activity_type = document.getElementById("selectType").value;
  const manager_id = document.getElementById("manager").value;
  const title = document.getElementById("title").value;
  const start = document.getElementById("start-date").value;
  const finished_at = document.getElementById("end-date").value;
  const color = document.getElementById("color").value;
  const description = document.getElementById("descripcionEvento").value;
  const event_location = document.getElementById("event-location").value;
  const duration = document.getElementById("duration").value;

  return {
    activity_type,
    manager_id,
    title,
    start,
    finished_at,
    color,
    description,
    event_location,
    duration
  }
}

function setDefaultDates(dateStr) {
  document.getElementById("start-date").value = dateStr;
  document.getElementById("end-date").value = dateStr;
}

function showDeleteSuccessAlert() {
  Swal.fire({
    title: 'Evento eliminado',
    text: 'El evento se ha eliminado con éxito',
    icon: 'success',
  });
}

export async function cargarEventos() {
  try {
    const { data } = await getEvents()
    if (data) {
      return data
    }
  } catch (error) {

  }
}

async function obtenerResponsables() {
  const { data } = await getUsers();

  let optionsHTML = '';

  data.forEach(usuario => {
    const { id, name } = usuario;
    const option = `<option value="${id}">${name}</option>`;
    optionsHTML += option;
  });

  return optionsHTML;
}