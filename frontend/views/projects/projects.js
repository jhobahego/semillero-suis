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