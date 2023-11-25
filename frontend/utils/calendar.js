import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

import { calendar } from '../views/admin/admin';
import { createEvent, getEvents } from '../services/eventService';
import axiosInstance from '../services/axios';

const modal = new Modal(document.getElementById("myModal"));
const formCalendar = document.getElementById("formCalendar");

document.getElementById("cancelBtn").addEventListener("click", () => {
  modal.hide();
});

export async function handleDateClick(info) {
  setDefaultDates(info.dateStr);

  // Se cargan los usuarios de la base de datos en select del responsable y sus datos en los campos correspondientes
  // para que solo facilitar el llenado del formulario
  const usuarios = await obtenerUsuarios();
  const managerSelect = document.getElementById("manager");

  let optionsHTML = '';

  usuarios.forEach(usuario => {
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

  const eventType = document.getElementById("selectType").value;
  const managerId = document.getElementById("manager").value;
  const title = document.getElementById("title").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  const color = document.getElementById("color").value;
  const descripcion = document.getElementById("descripcionEvento").value;
  const event_location = document.getElementById("event-location").value;
  const duration = document.getElementById("duration").value;

  if (
    managerId === '' ||
    title === '' ||
    startDate === '' ||
    endDate === '' ||
    color === '' ||
    descripcion === '' ||
    event_location === '' ||
    duration === ''
  ) {
    showWarningAlert();
  } else {

    try {
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
      // console.log(data);
    } catch (error) {

    }

    addCalendarEvent(title, startDate, endDate, color);

    modal.hide();
    showSuccessAlert();
    resetFormInputs();
    // formCalendar.removeEventListener("submit", handleFormSubmit);
  }
}

function addCalendarEvent(title, startDate, endDate, color) {
  calendar.addEvent({ title, start: startDate, end: endDate, backgroundColor: color });
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
    } else if (result.isDenied) {
      Swal.fire({
        title: "Se ha descartado en el guardado del evento",
        info: "info"
      });
    }
  });
}

async function obtenerUsuarios() {
  try {
    const { data } = await axiosInstance.get("/users")
    return data
  } catch (error) {

  }
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