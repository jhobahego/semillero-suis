import * as bootstrap from 'bootstrap'

import { manageSession } from "../../utils/navbar.js";

manageSession()

function generateProjectForm() {
  const form = document.createElement('form');
  form.setAttribute('action', '/submit_project');
  form.setAttribute('method', 'post');

  const titleInput = createInput('title', 'Título:', 'text', true);
  const descriptionTextarea = createTextarea('description', 'Descripción:', 4, 50, true);
  const generalObjectivesTextarea = createTextarea('generalObjectives', 'Objetivos Generales:', 4, 50, true);
  const specificObjectivesTextarea = createTextarea('specificObjectives', 'Objetivos Específicos:', 4, 50, true);

  const projectTypeSelect = createSelect('projectType', 'Tipo de Proyecto:');
  const projectTypeOption1 = createOption('investigacion', 'Investigación');
  const projectTypeOption2 = createOption('otro', 'Otro');
  projectTypeSelect.appendChild(projectTypeOption1);
  projectTypeSelect.appendChild(projectTypeOption2);

  const startedAtInput = createInput('startedAt', 'Comenzó en:', 'datetime-local', false);
  const finishedAtInput = createInput('finishedAt', 'Terminó en:', 'datetime-local', false);
  const projectLinkInput = createInput('projectLink', 'Enlace del Proyecto:', 'text', false);
  const portraitURLInput = createInput('portraitURL', 'URL del Retrato:', 'text', false);

  const statusSelect = createSelect('status', 'Estado:');
  const statusOption1 = createOption('pending', 'Pendiente');
  const statusOption2 = createOption('aprobado', 'Aprobado');
  const statusOption3 = createOption('rechazado', 'Rechazado');
  statusSelect.appendChild(statusOption1);
  statusSelect.appendChild(statusOption2);
  statusSelect.appendChild(statusOption3);

  const membersTextarea = createTextarea('members', 'Miembros:', 4, 50, true);

  const submitButton = document.createElement('input');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('value', 'Crear Proyecto');

  form.appendChild(titleInput);
  form.appendChild(descriptionTextarea);
  form.appendChild(generalObjectivesTextarea);
  form.appendChild(specificObjectivesTextarea);
  form.appendChild(projectTypeSelect);
  form.appendChild(startedAtInput);
  form.appendChild(finishedAtInput);
  form.appendChild(projectLinkInput);
  form.appendChild(portraitURLInput);
  form.appendChild(statusSelect);
  form.appendChild(membersTextarea);
  form.appendChild(submitButton);

  return form;
}

function createInput(id, label, type, required) {
  const div = document.createElement('div');
  const labelElem = document.createElement('label');
  labelElem.setAttribute('for', id);
  labelElem.textContent = label;
  const inputElem = document.createElement('input');
  inputElem.setAttribute('type', type);
  inputElem.setAttribute('id', id);
  inputElem.setAttribute('name', id);
  if (required) {
    inputElem.setAttribute('required', 'required');
  }
  div.appendChild(labelElem);
  div.appendChild(inputElem);
  return div;
}

function createTextarea(id, label, rows, cols, required) {
  const div = document.createElement('div');
  const labelElem = document.createElement('label');
  labelElem.setAttribute('for', id);
  labelElem.textContent = label;
  const textareaElem = document.createElement('textarea');
  textareaElem.setAttribute('id', id);
  textareaElem.setAttribute('name', id);
  textareaElem.setAttribute('rows', rows);
  textareaElem.setAttribute('cols', cols);
  if (required) {
    textareaElem.setAttribute('required', 'required');
  }
  div.appendChild(labelElem);
  div.appendChild(textareaElem);
  return div;
}

function createSelect(id, label) {
  const div = document.createElement('div');
  const labelElem = document.createElement('label');
  labelElem.setAttribute('for', id);
  labelElem.textContent = label;
  const selectElem = document.createElement('select');
  selectElem.setAttribute('id', id);
  selectElem.setAttribute('name', id);
  div.appendChild(labelElem);
  div.appendChild(selectElem);
  return div;
}

function createOption(value, text) {
  const option = document.createElement('option');
  option.setAttribute('value', value);
  option.textContent = text;
  return option;
}

document.addEventListener("DOMContentLoaded", () => {
  const mostrarFormularioBtn = document.getElementById('mostrarFormularioBtn');
  const formularioContainer = document.getElementById('formularioContainer');

  mostrarFormularioBtn.addEventListener('click', () => {
    const formulario = generateProjectForm(); // Usamos la función previamente creada para generar el formulario
    formularioContainer.innerHTML = ''; // Limpiamos el contenedor por si ya existía un formulario
    formularioContainer.appendChild(formulario);
  });
});