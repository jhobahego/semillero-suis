import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

const modal = new Modal(document.getElementById("myModal"));
const formCalendar = document.getElementById("formCalendar");

document.getElementById("cancelBtn").addEventListener("click", () => {
  modal.hide();
});

export function handleDateClick(info) {
  setDefaultDates(info.dateStr);

  const addButton = document.querySelector("#formCalendar button[type='submit']");
  const deleteButton = document.querySelector("#formCalendar button.btn-danger");

  addButton.textContent = 'Agregar evento';
  addButton.classList.remove('btn-warning');
  deleteButton.style.display = 'none';

  modal.show();
  formCalendar.addEventListener("submit", handleFormSubmit);
}

function handleFormSubmit(event) {
  event.preventDefault();

  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  const color = document.getElementById("color").value;
  const descripcion = document.getElementById("descripcionEvento").value;

  if (startDate === '' || endDate === '' || color === '' || descripcion === '') {
    showWarningAlert();
  } else {
    addCalendarEvent(descripcion, startDate, endDate, color);

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
  document.getElementById("start-date").value = '';
  document.getElementById("end-date").value = '';
  document.getElementById("color").value = '';
  document.getElementById("descripcionEvento").value = '';
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
    title: 'Evento agendado',
    text: 'El evento se ha agendado con éxito',
    icon: 'success',
  });
}
