function register(event) {
  event.preventDefault()

  if (!validFields()) return alert("Debes rellenar antes todos los campos");

  return alert("registro")
}

function validFields() {
  var nombreInput = document.getElementById("exampleInputNombre");
  var apellidoInput = document.getElementById("exampleInputApellido1");
  var emailInput = document.getElementById("exampleInputDireccion1");
  var passwordInput = document.getElementById("exampleInputEmail1");

  var nombre = nombreInput.value.trim();
  var apellido = apellidoInput.value.trim();
  var email = emailInput.value.trim();
  var password = passwordInput.value.trim();

  if (nombre === "" || apellido === "" || email === "" || password === "") return false

  return true
}
