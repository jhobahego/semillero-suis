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

  popup(title, text, timer = 3000, color = 'white', position = 'top-end', icon) {
    const options = {
      title,
      text,
      icon,
      position,
      showClass: {
        popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `,
      },
      hideClass: {
        popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `,
      },
      grow: 'row',
      width: 300,
      showConfirmButton: false,
      background: '#00447b',
      color
    }

    if (timer > 0) {
      options.timer = timer
    }

    return Swal.fire(options)
  },

  success(text) {
    this.toast("Operacion existosa", text, "success")
  },

  error(text) {
    this.toast("Se ha producido un error", text, "error")
  }
}