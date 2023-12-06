import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

import { createEvent, getEvents, getEvent, updateEvent, markEventAsInactive } from '../services/eventService';
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

export async function handleMouseEnter(info, eventos) {
  const { id } = info.event;
  const evento = eventos.find(evento => evento.id === parseInt(id))

  const { title, start, description, duration, event_location, color, manager_id } = evento;
  const { data } = await getUser(manager_id);

  const tooltip = document.getElementById('tooltip');

  document.getElementById("card-title").textContent = `${title}`;
  document.getElementById("card-description").textContent = `${description}`;
  document.getElementById("card-fecha").textContent = `Fecha de inicio: ${start}`;
  document.getElementById("card-location").textContent = `Duración: ${duration > 60 ? Math.floor(duration / 60) + ' Horas' : duration + ' Minutos'}`;
  document.getElementById("card-duration").textContent = `Lugar del evento: ${event_location}`;
  document.getElementById("card-manager").textContent = `Responsable: ${data.name} ${data.lastname}`;

  const eventElement = info.el;

  if (window.innerWidth > 1023) {
    tooltip.classList.remove('d-none');
    tooltip.style.border = `2px solid ${color}`;

    // Detecta la posición del tooltip y del mouse
    const tooltipRect = tooltip.getBoundingClientRect();
    const mouseX = info.jsEvent.clientX;
    const mouseY = info.jsEvent.clientY;

    // Calcula la distancia entre el borde derecho del tooltip y el borde derecho de la ventana
    const rightDistance = window.innerWidth - (tooltipRect.left + tooltipRect.width);

    // Mueve el tooltip al lado opuesto si el mouse está justo encima de él
    if (mouseX >= tooltipRect.left && mouseX <= tooltipRect.right && mouseY >= tooltipRect.top && mouseY <= tooltipRect.bottom) {
      if (rightDistance < tooltipRect.width) {
        // Si el mouse está en el tooltip y no hay suficiente espacio a la derecha, mueve el tooltip a la izquierda
        tooltip.classList.remove('preview-right');
        tooltip.classList.add('preview-left');
      } else {
        // Si hay suficiente espacio a la derecha, mueve el tooltip a la derecha
        tooltip.classList.remove('preview-left');
        tooltip.classList.add('preview-right');
      }
    }
  }

  // Elimina el tooltip cuando el mouse sale del evento
  eventElement.addEventListener('mouseleave', () => {
    tooltip.classList.add('d-none');
  });
}

export async function handleReminder(eventos) {
  for (const event of eventos) {
    let index = 0;

    const { id, start, title, active } = event;

    const now = new Date();
    const eventStartDate = new Date(start);

    // Se obtiene el tiempo que falta para que el evento empiece
    const timeDifference = eventStartDate - now;

    const minutesUntilEvent = Math.floor(timeDifference / 60000); // Convertir a minutos
    const hoursUntilEvent = Math.floor(minutesUntilEvent / 60); // Convertir a horas

    // Si es un evento que ya pasó, se pone como inactivo en BD
    if (active && minutesUntilEvent < 0) {
      await updateEventActiveStatus(event, false);
    } else if (minutesUntilEvent > 1 && !active) { // Si se actualiza la fecha se debe volver a poner como activo
      await updateEventActiveStatus(event, true);
    }

    const hoursNotified = JSON.parse(localStorage.getItem(`hoursNotified_${id}`));
    const minutesNotified = JSON.parse(localStorage.getItem(`minutesNotified_${id}`));

    let canHourNotified = hoursNotified == null && minutesUntilEvent > 60;
    let canMinuteNotified = minutesNotified == null && minutesUntilEvent < 61;

    const canNotified = canHourNotified || canMinuteNotified;

    // Si no puedes notificar, es un evento inactivo o faltan mas de 24 horas no se notifica ese evento
    if (!canNotified || !active || hoursUntilEvent > 24) continue;

    index += 1;

    const svgIcon = document.getElementById('notificationIcon');

    const reminder = document.getElementById('notificationItems');
    reminder.style.color = 'white';
    reminder.innerText = index;

    let timeMessage = '';
    if (canMinuteNotified) {
      timeMessage = `Quedan ${minutesUntilEvent} minutos para el evento`;
    } else if (canHourNotified) {
      const hoursText = hoursUntilEvent > 1 ? 'horas' : 'hora';
      timeMessage = `Quedan al menos ${hoursUntilEvent} ${hoursText} ${minutesUntilEvent} minutos para el evento`;
    }

    svgIcon.addEventListener('click', async () => {
      return Swal.fire({
        title: `${title}`,
        text: timeMessage,
        color: 'white',
        position: 'top-start',
        icon: 'info',
        background: '#00447b',
        width: 400,
        showCancelButton: true,
        confirmButtonColor: '#00447b',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ocultar notificación'
      }).then((result) => {
        if (result.isConfirmed) {
          if (canHourNotified) {
            localStorage.setItem(`hoursNotified_${id}`, 'true');
          } else if (canMinuteNotified) {
            localStorage.setItem(`minutesNotified_${id}`, 'true');
          }
          location.reload();
        }
      })
    })

  }
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
          calendar.addEvent(data)
        }
      }
    }
  })
}

async function updateEventActiveStatus(evento, active) {
  const updateEventData = { ...evento, active };
  const { data } = await updateEvent(evento.id, updateEventData);
  return data;
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

export async function cargarEventos() {
  const { data } = await getEvents()

  return data;
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