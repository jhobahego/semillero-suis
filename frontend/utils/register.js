export function validFields({
  selectValue,
  dniInput,
  nombreInput,
  apellidoInput,
  telefonoInput,
  emailInput,
  passwordInput,
  universityInput,
  semesterInput,
  programaInput,
  facultyInput,
  researchTeamInput
}) {
  if (selectValue === 'TEACHER') {
    return checkFields([
      dniInput,
      nombreInput,
      apellidoInput,
      telefonoInput,
      emailInput,
      passwordInput,
      universityInput
    ]);
  } else if (selectValue === 'STUDENT') {
    return checkFields([
      dniInput,
      nombreInput,
      apellidoInput,
      telefonoInput,
      emailInput,
      passwordInput,
      universityInput,
      semesterInput,
      programaInput,
      facultyInput,
      researchTeamInput
    ]);
  }
  return false;
}

function checkFields(fields) {
  return fields.every(field => field.value.trim() !== '');
}

export function hideElements(elements) {
  elements.forEach(element => {
    element.classList.add('d-none');
  });
}

export function showElements(elements) {
  elements.forEach(element => {
    element.classList.remove('d-none');
  });
}