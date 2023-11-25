import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

import { createEvent, getEvents } from '../services/eventService';
import { getUsers } from '../services/userServices';

const modal = new Modal(document.getElementById("myModal"));
const formCalendar = document.getElementById("formCalendar");

document.getElementById("cancelBtn").addEventListener("click", () => {
  modal.hide();
});


export async function handleDateClick(info) {
  setDefaultDates(info.dateStr);

  // Se cargan los usuarios de la base de datos en select del responsable y sus datos en los campos correspondientes
  // para que solo facilitar el llenado del formulario
  const { data } = await getUsers();
  const managerSelect = document.getElementById("manager");

  let optionsHTML = '';

  data.forEach(usuario => {
    const { id, name } = usuario;
    const option = `<option value="${id}">${name}</option>`;
    optionsHTML += option;
  });

  managerSelect.innerHTML = optionsHTML;

  const addButton = document.querySelector("#formCalendar button[type='submit']");
  const deleteButton = document.querySelector("#formCalendar button.btn-danger");

  addButton.textContent = 'Agregar evento';
  addButton.classList.remove('btn-warning');
  deleteButton.style.display = 'none';

  modal.show();
  formCalendar.addEventListener("submit", handleFormSubmit);
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const inputValues = getInputValues()

  const {
    eventType,
    managerId,
    title,
    descripcion,
    startDate,
    endDate,
    color,
    duration,
    event_location,
  } = inputValues

  // Valida los datos del formulario y muestra un error en caso de que falte un valor
  for (let key of Object.keys(inputValues)) {
    if (inputValues[key] === '') {
      showWarningAlert();
      return;
    }
  }

  const eventData = {
    activity_type: eventType,
    title: title,
    description: descripcion,
    manager_id: parseInt(managerId),
    color: color,
    start: startDate,
    finished_at: endDate !== '' ? endDate : null,
    event_location: event_location,
    duration: duration
  };

  const { data } = await createEvent(eventData)

  if (data) {
    modal.hide();
    showSuccessAlert();
    resetFormInputs();
  }
}

// Se obtienen todos los valores de los campos de los formularios
function getInputValues() {
  const eventType = document.getElementById("selectType").value;
  const managerId = document.getElementById("manager").value;
  const title = document.getElementById("title").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  const color = document.getElementById("color").value;
  const descripcion = document.getElementById("descripcionEvento").value;
  const event_location = document.getElementById("event-location").value;
  const duration = document.getElementById("duration").value;

  return {
    eventType,
    managerId,
    title,
    startDate,
    endDate,
    color,
    descripcion,
    event_location,
    duration
  }
}

function resetFormInputs() {
  document.getElementById("title").value = '';
  document.getElementById("start-date").value = '';
  document.getElementById("end-date").value = '';
  document.getElementById("color").value = '';
  document.getElementById("descripcionEvento").value = '';
  document.getElementById("event-location").value = '';
  document.getElementById("duration").value = '';
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

function showWarningAlert() {
  Swal.fire({
    title: 'Fallo al agendar',
    text: 'Todos los campos son requeridos',
    icon: 'warning',
  });
}

function showSuccessAlert() {
  Swal.fire({
    title: "¿Seguro que quiere agregar el evento?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    denyButtonText: "No guardar"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Evento agendado',
        text: 'El evento se ha agendado con éxito',
        icon: 'success',
      })
      window.location.reload()
    } else if (result.isDenied) {
      Swal.fire({
        title: "Se ha descartado en el guardado del evento",
        info: "info"
      });
    }
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