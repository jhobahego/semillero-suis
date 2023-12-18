import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { handleDateClick, cargarEventos, handleEditEvent, handleMouseEnter, handleReminder } from "../../utils/calendar.js";
import { manageSession } from "../../utils/navbar.js";
import { manageUser } from '../../utils/admin.js';


manageSession();

const eventos = await cargarEventos()

// Verifica si hay evento cercano y notifica al usuario
handleReminder(eventos)

const calendarEl = document.getElementById("calendario");

export const calendar = new Calendar(calendarEl, {
  locale: 'ES-es',
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,listWeek'
  },
  events: eventos,
  dateClick: handleDateClick,
  eventClick: handleEditEvent,
  eventMouseEnter: (info) => handleMouseEnter(info),
});

calendar.render();

// Manejo de usuario
const manageUserBtn = document.getElementById("manageUserBtn");
manageUserBtn.addEventListener("click", () => manageUser());