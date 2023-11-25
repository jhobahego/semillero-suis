import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { handleDateClick, cargarEventos } from "../../utils/calendar.js";
import { manageSession } from "../../utils/navbar.js";

manageSession();

const eventos = await cargarEventos()

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
  dateClick: handleDateClick
});

calendar.render();
