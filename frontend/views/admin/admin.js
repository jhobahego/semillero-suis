import * as bootstrap from 'bootstrap'

// Importación de módulos y estilos
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'

import { Modal } from 'bootstrap'
import Swal from 'sweetalert2';

import { manageSession } from "../../utils/navbar.js";

manageSession()

document.addEventListener("DOMContentLoaded", () => {
  const modal = new Modal(document.getElementById("myModal"));
  const calendarEl = document.getElementById("calendario")
  const formCalendar = document.getElementById("formCalendar");

  // Función para manejar clics en fechas
  function handleDateClick(info) {
    document.getElementById("fecha").value = info.dateStr;
    modal.show();
    formCalendar.addEventListener("submit", handleFormSubmit);
  }

  // Función para manejar envío del formulario
  function handleFormSubmit(event) {
    event.preventDefault();

    const fecha = document.getElementById("fecha").value;
    const color = document.getElementById("color").value;
    const descripcion = document.getElementById("descripcionEvento").value;

    if (fecha === '' || color === '' || descripcion === '') {
      showWarningAlert();
    } else {
      addCalendarEvent(descripcion, fecha, color);
      modal.hide();
      showSuccessAlert();
      resetFormInputs();
      formCalendar.removeEventListener("submit", handleFormSubmit);
    }
  }



  // Funciones modulares para mostrar alertas
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

  // Funciones modulares para manipular el calendario y el modal
  function addCalendarEvent(title, start, color) {
    calendar.addEvent({ title, start, color })
  }

  function resetFormInputs() {
    document.getElementById("fecha").value = '';
    document.getElementById("color").value = '';
    document.getElementById("descripcionEvento").value = '';
  }
  let calendar = new Calendar(calendarEl, {
    locale: 'es',
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek'
    },
    eventClick: (info) => {
      console.log(info) // Al hacer click mostrar modal con mas datos del evento #TODO
    },
    dateClick: handleDateClick,
    eventMouseEnter: (info) => {
      // Al pasar sobre el evento debo mostrar un popover de bootstrap #TODO
      console.log(info)
    }
  })
  calendar.render()
})
