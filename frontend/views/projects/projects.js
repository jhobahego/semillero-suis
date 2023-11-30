import { Modal } from 'bootstrap'

import { manageSession } from "../../utils/navbar.js";

manageSession()

const modal = new Modal(document.getElementById("myModal"))

const closeCreateFormBtn = document.getElementById("closeCreateForm")
const showCreateFormBtn = document.getElementById("createFormBtn")

// Muestra el modal al dar click en boton de crear proyecto
showCreateFormBtn.addEventListener("click", () => {
  modal.show()
})

// Oculta el modal al dar click en el boton de cierre
closeCreateFormBtn.addEventListener("click", () => {
  modal.hide()
})




// funcion para  cargue de documentos

document.addEventListener('DOMContentLoaded', function () {
  const uploadInput = document.getElementById('upload');
  const fileWrapper = document.getElementById('filewrapper');

  uploadInput.addEventListener('change', handleFileSelect);

  function handleFileSelect(event) {
    const files = event.target.files;

    for (const file of files) {
      const fileType = getFileType(file.name);
      const fileDiv = createFileDiv(fileType, file.name);
      fileWrapper.appendChild(fileDiv);
    }
  }

  function getFileType(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    return extension;
  }

  function createFileDiv(fileType, fileName) {
    const fileDiv = document.createElement('div');
    fileDiv.classList.add('showfilebox');

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left');

    const fileTypeSpan = document.createElement('span');
    fileTypeSpan.classList.add('filetype');
    fileTypeSpan.textContent = fileType;

    const fileNameH3 = document.createElement('h3');
    fileNameH3.textContent = fileName;

    leftDiv.appendChild(fileTypeSpan);
    leftDiv.appendChild(fileNameH3);

    const rightDiv = document.createElement('div');
    rightDiv.classList.add('right');
    rightDiv.innerHTML = '<span class="delete-file">&#215;</span>';

    rightDiv.addEventListener('click', function () {
      fileDiv.remove();
    });

    fileDiv.appendChild(leftDiv);
    fileDiv.appendChild(rightDiv);

    return fileDiv;
  }
});