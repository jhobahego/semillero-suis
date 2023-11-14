import Swal from "sweetalert2"

export const notificationUtilities = {
  toast(title, text, icon, timer = 0) {
    const swalertOptions = {
      title,
      text,
      icon
    }

    if (timer > 0) {
      swalertOptions.timer = timer
    }

    return Swal.fire(swalertOptions)
  },

  success(text) {
    this.toast("Operacion existosa", text, "success")
  },

  error(text) {
    this.toast("Se ha producido un error", text, "error")
  }
}