import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

import { createEvent, getEvents, getEvent, updateEvent } from '../services/eventService';
import { getUsers, getUser } from '../services/userServices';
import { notificationUtilities } from '../services/notificationService';
import { calendar } from '../views/admin/admin';

const modal = new Modal(document.getElementById("myModal"));
const formCalendar = document.getElementById("formCalendar");

document.getElementById("cancelBtn").addEventListener("click", () => {
  modal.hide();
});

// Funcion para agregar eventos
export async function handleDateClick(info) {
  formCalendar.reset();
  // document.getElementById("start-date").value = info.dateStr;
  // document.getElementById("end-date").value = info.dateStr;
  console.log(info);
  setDefaultDates(info.date);
  modal.show();

  const managerSelect = document.getElementById("manager");

  const optionResponsables = await obtenerResponsables();

  managerSelect.innerHTML = optionResponsables;

  // Personaliza el formulario con información referente a agregar un evento
  setFormInformation('Creación de evento', 'Agregar evento', 'Guardar evento', 'add');

  formCalendar.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = {
      formAction: 'add',
      eventId: -1
    }

    const notificationData = {
      title: '¿Estás seguro?',
      text: '¿Seguro que deseas agendar este evento?',
      confirmButtonText: 'Sí, agendar!',
      successTitle: 'Evento agendado',
      successText: 'El evento se ha agendado con éxito',
      successDuration: 2000
    }

    handleFormSubmit(data, notificationData);
  });
}

// Función para editar un evento
export async function handleEditEvent(info) {
  const { publicId } = info.event._def;

  const eventId = parseInt(publicId);

  // Petición al servidor para obtener los detalles del evento a editar
  const { data } = await getEvent(eventId);
  if (data) {
    modal.show();

    // Se carga el select de los responsables con los usuarios de la BD
    document.getElementById("manager").innerHTML = await obtenerResponsables();

    // Se selecciona el responsable del evento en el select
    selectManagerInDropdown(data.manager_id);

    // Actualiza los campos del formulario con los detalles del evento a editar
    setEditFormValues(data);

    // Personaliza el formulario con información referente a editar un evento
    setFormInformation('Edición de evento', 'Editar evento', 'Guardar cambios', 'edit');

    formCalendar.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = {
        formAction: 'edit',
        eventId
      }

      const notificationData = {
        title: '¿Estás seguro?',
        text: '¿Seguro que deseas guardar los cambios del evento?',
        confirmButtonText: 'Sí, guardar cambios!',
        successTitle: 'Cambios guardados',
        successText: 'Se ha editado el evento correctamente',
        successDuration: 2000
      }

      handleFormSubmit(data, notificationData);
    });
  }
}

async function handleFormSubmit(data, notificationData) {
  const { formAction, eventId } = data;
  const eventData = getInputValues();

  const submitFunction = () => {
    if (formAction === 'add') {
      // Valida los datos del formulario y muestra un error en caso de que falte un valor
      for (let key of Object.keys(eventData)) {
        if (eventData[key] === '') {
          notificationUtilities.warning('Fallo al agendar', 'Todos los campos son requeridos');
          return;
        }
      }

      return createEvent(eventData);
    }

    if (formAction === 'edit') {
      return updateEvent(eventId, eventData);
    }
  }

  confirmSubmitNotification(notificationData, formAction, submitFunction);
}

function confirmSubmitNotification(notificationData, formAction, submitFunction) {
  const {
    title,
    text,
    confirmButtonText,
    successTitle,
    successText,
    successDuration
  } = notificationData

  Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { data, status } = await submitFunction(formAction);

      if (data || status === 204) {
        modal.hide();

        notificationUtilities.popup(
          successTitle,
          successText,
          successDuration
        );

        if (formAction === 'add') {
          console.log("agregando evento");
          calendar.addEvent(data)
        }
      }
    }
  })
}

function setDefaultDates(dateStr) {
  document.getElementById("start-date").value = dateStr;
  document.getElementById("end-date").value = dateStr;
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

function setFormInformation(titleText, subtitleText, submitButtonText, option) {
  const titleElement = document.getElementById("titulo")
  const subTitleElement = document.getElementById("subtitle")
  const addButton = document.querySelector("#formCalendar button[type='submit']");
  const deleteButton = document.querySelector("#formCalendar button.btn-danger");

  titleElement.textContent = titleText;
  subTitleElement.textContent = subtitleText;
  addButton.textContent = submitButtonText;

  if (option === 'add') {
    addButton.classList.remove('btn-warning');
    deleteButton.style.display = 'none';

  } else if (option === 'edit') {
    addButton.classList.add('btn-warning');
    deleteButton.style.display = 'none';

  } else if (option === 'delete') {
    addButton.style.display = 'none';
    deleteButton.style.display = 'block';
  }
}

async function setEditFormValues(data) {
  const { manager_id } = data

  let response = await getUser(manager_id)
  const { name, lastname, email } = response.data
  const managerFullname = `${name} ${lastname}`

  document.getElementById("managerName").value = managerFullname;
  document.getElementById("managerEmail").value = email;

  document.getElementById("selectType").value = data.activity_type;
  document.getElementById("title").value = data.title;
  document.getElementById("start-date").value = data.start;
  document.getElementById("end-date").value = data.finished_at;
  document.getElementById("color").value = data.color;
  document.getElementById("descripcionEvento").value = data.description;
  document.getElementById("event-location").value = data.event_location;
  document.getElementById("duration").value = data.duration;
}

function selectManagerInDropdown(managerId) {
  const managerSelect = document.getElementById("manager");

  for (let i = 0; i < managerSelect.options.length; i++) {
    if (managerSelect.options[i].value === managerId) {
      managerSelect.options[i].selected = true;
      break;
    }
  }
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