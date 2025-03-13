const nombreMaestro = document.getElementById("nombre-maestro");
const usuarioMaestro = document.getElementById("usuario-maestro");
const curriculum = document.getElementById("curriculum");
const editarCurriculum = document.getElementById("editar-curriculum");
const guardarCurriculum = document.getElementById("guardar-curriculum");
const cancelarCurriculum = document.getElementById("cancelar-curriculum");
const editarPass = document.getElementById("editar-password");
const guardarPass = document.getElementById("guardar-password");
const cancelarPass = document.getElementById("cancelar-password");
const passwordMaestro = document.getElementById("password-maestro");
const editarHorario = document.getElementById("editar-horario");
const btnsHorario = document.getElementById("btns-horario");
const guardarHorario = document.getElementById("guardar-horario");
const cancelarHorario = document.getElementById("cancelar-horario");
const lunes = document.getElementById("lunes");
const horaInicioLunes = document.getElementById("hora-inicio-lunes");
const horaFinLunes = document.getElementById("hora-final-lunes");
const martes = document.getElementById("martes");
const horaInicioMartes = document.getElementById("hora-inicio-martes");
const horaFinMartes = document.getElementById("hora-final-martes");
const miercoles = document.getElementById("miercoles");
const horaInicioMiercoles = document.getElementById("hora-inicio-miercoles");
const horaFinMiercoles = document.getElementById("hora-final-miercoles");
const jueves = document.getElementById("jueves");
const horaInicioJueves = document.getElementById("hora-inicio-jueves");
const horaFinJueves = document.getElementById("hora-final-jueves");
const viernes = document.getElementById("viernes");
const horaInicioViernes = document.getElementById("hora-inicio-viernes");
const horaFinViernes = document.getElementById("hora-final-viernes");
const sabado = document.getElementById("sabado");
const horaInicioSabado = document.getElementById("hora-inicio-sabado");
const horaFinSabado = document.getElementById("hora-final-sabado");

let dataUsuarioOriginal;

async function fetchPerfil() {
  try {
    const response = await fetch("/auth/perfil");
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const data = await response.json();
    dataUsuarioOriginal = data.usuario;
    mostrarPerfil(data.usuario);
  } catch (error) {
    console.error("Error al recuperar perfil:", error);
  }
}

function mostrarPerfil(user) {
  nombreMaestro.value = user.nombre;
  usuarioMaestro.value = user.usuario;
  if (user.curriculum) {
    curriculum.value = user.curriculum;
  } else {
    curriculum.value =
      "No se ha ingresado el currículum. Presiona el botón 'Editar' para agregarlo.";
  }
  horaInicioLunes.value = user.horario.lunes.horaInicio;
  horaFinLunes.value = user.horario.lunes.horaFin;
  
  horaInicioMartes.value = user.horario.martes.horaInicio;
  horaFinMartes.value = user.horario.martes.horaFin;

  horaInicioMiercoles.value = user.horario.miercoles.horaInicio;
  horaFinMiercoles.value = user.horario.miercoles.horaFin;

  horaInicioJueves.value = user.horario.jueves.horaInicio;
  horaFinJueves.value = user.horario.jueves.horaFin;

  horaInicioViernes.value = user.horario.viernes.horaInicio;
  horaFinViernes.value = user.horario.viernes.horaFin;

  horaInicioSabado.value = user.horario.sabado.horaInicio;
  horaFinSabado.value = user.horario.sabado.horaFin;
}

function validarPass(pass) {
  if (pass.length < 8) {
    alert("La contraseña debe tener al menos 8 caracteres");
    return false;
  }
  if (pass.length > 20) {
    alert("La contraseña debe tener menos de 20 caracteres");
    return false;
  }
  return true;
}

editarCurriculum.addEventListener("click", () => {
  editarCurriculum.style.display = "none";
  guardarCurriculum.style.display = "block";
  cancelarCurriculum.style.display = "block";
  if (dataUsuarioOriginal.curriculum == "") {
    curriculum.value = "";
  } else {
    curriculum.value = dataUsuarioOriginal.curriculum;
  }
  curriculum.removeAttribute("disabled");
  curriculum.focus();
});

cancelarCurriculum.addEventListener("click", () => {
  editarCurriculum.style.display = "block";
  guardarCurriculum.style.display = "none";
  cancelarCurriculum.style.display = "none";
  curriculum.setAttribute("disabled", true);
  mostrarPerfil(dataUsuarioOriginal);
});

guardarCurriculum.addEventListener("click", async () => {
  const response = await fetch("/maestro/actualizar-curriculum", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ curriculum: curriculum.value }),
  });
  if (response.ok) {
    alert("Currículum actualizado exitosamente");
    editarCurriculum.style.display = "block";
    guardarCurriculum.style.display = "none";
    cancelarCurriculum.style.display = "none";
    fetchPerfil();
  } else {
    alert("Error al actualizar el currículum");
  }
});

editarPass.addEventListener("click", () => {
  editarPass.style.display = "none";
  guardarPass.style.display = "block";
  cancelarPass.style.display = "block";
  passwordMaestro.value = "";
  passwordMaestro.removeAttribute("disabled");
  passwordMaestro.focus();
});

cancelarPass.addEventListener("click", () => {
  editarPass.style.display = "block";
  guardarPass.style.display = "none";
  cancelarPass.style.display = "none";
  passwordMaestro.setAttribute("disabled", true);
  passwordMaestro.value = "*********";
});

guardarPass.addEventListener("click", async () => {
  if (!validarPass(passwordMaestro.value)) {
    return false;
  }
  const response = await fetch("/auth/actualizar-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: passwordMaestro.value }),
  });
  if (response.ok) {
    alert("Contraseña actualizada exitosamente");
    editarPass.style.display = "block";
    guardarPass.style.display = "none";
    cancelarPass.style.display = "none";
    fetchPerfil();
  } else {
    alert("Error al actualizar la contraseña");
  }
});

function activaChecks(){
  lunes.removeAttribute("disabled")
  martes.removeAttribute("disabled")
  miercoles.removeAttribute("disabled")
  jueves.removeAttribute("disabled")
  viernes.removeAttribute("disabled")
  sabado.removeAttribute("disabled")
}

function desactivaChecks(){
  lunes.setAttribute("disabled", true)
  martes.setAttribute("disabled", true)
  miercoles.setAttribute("disabled", true)
  jueves.setAttribute("disabled", true)
  viernes.setAttribute("disabled", true)
  sabado.setAttribute("disabled", true)
  horaInicioLunes.setAttribute("disabled", true)
  horaFinLunes.setAttribute("disabled", true)
  horaInicioMartes.setAttribute("disabled", true)
  horaFinMartes.setAttribute("disabled", true)
  horaInicioMiercoles.setAttribute("disabled", true)
  horaFinMiercoles.setAttribute("disabled", true)
  horaInicioJueves.setAttribute("disabled", true)
  horaFinJueves.setAttribute("disabled", true)
  horaInicioViernes.setAttribute("disabled", true)
  horaFinViernes.setAttribute("disabled", true)
  horaInicioSabado.setAttribute("disabled", true)
  horaFinSabado.setAttribute("disabled", true)
}

function validarHorario(h){
  if(lunes.checked == true ){
    if(h.lunes.horaInicio == "" || h.lunes.horaFin == ""){
      alert("Por favor, ingrese la hora de inicio y final del lunes")
      return false
    }
    if(h.lunes.horaInicio >= h.lunes.horaFin){
      alert("La hora de término debe ser mayor a la hora de inicio de la jornada del día lunes")
      return false
    }
  }
  if(martes.checked == true ){
    if(h.martes.horaInicio == "" || h.martes.horaFin == ""){
      alert("Por favor, ingrese la hora de inicio y final del martes")
      return false
    }
    if(h.martes.horaInicio >= h.martes.horaFin){
      alert("La hora de término debe ser mayor a la hora de inicio de la jornada del día martes")
      return false
    }
  }
  if(miercoles.checked == true ){
    if(h.miercoles.horaInicio == "" || h.miercoles.horaFin == ""){
      alert("Por favor, ingrese la hora de inicio y final del miércoles")
      return false
    }
    if(h.miercoles.horaInicio >= h.miercoles.horaFin){
      alert("La hora de término debe ser mayor a la hora de inicio de la jornada del día miércoles")
      return false
    }
  }
  if(jueves.checked == true){
    if(h.jueves.horaInicio == "" || h.jueves.horaFin == ""){
      alert("Por favor, ingrese la hora de inicio y final del jueves")
      return false
    }
    if(h.jueves.horaInicio >= h.jueves.horaFin){
      alert("La hora de término debe ser mayor a la hora de inicio de la jornada del día jueves")
      return false
    }
  }
  if(viernes.checked == true){
    if(h.viernes.horaInicio == "" || h.viernes.horaFin == ""){
      alert("Por favor, ingrese la hora de inicio y final del viernes")
      return false
    }
    if(h.viernes.horaInicio >= h.viernes.horaFin){
      alert("La hora de término debe ser mayor a la hora de inicio de la jornada del día viernes")
      return false
    }
  }
  if(sabado.checked == true){
    if(h.sabado.horaInicio == "" || h.sabado.horaFin == ""){
      alert("Por favor, ingrese la hora de inicio y final del sábado")
      return false
    }
    if(h.sabado.horaInicio >= h.sabado.horaFin){
      alert("La hora de término debe ser mayor a la hora de inicio de la jornada del día sábado")
      return false
    }
  }
  console.log("todo bien")
  return true
}

editarHorario.addEventListener("click", () => {
  activaChecks()
  btnsHorario.style.display = "block";
  editarHorario.style.display = "none";
});

lunes.addEventListener("change", () => {
  if (lunes.checked) {
    horaInicioLunes.removeAttribute("disabled");
    horaFinLunes.removeAttribute("disabled");
  } else {
    horaInicioLunes.setAttribute("disabled", true);
    horaFinLunes.setAttribute("disabled", true);
    horaInicioLunes.value = ""
    horaFinLunes.value = ""
  }
});

martes.addEventListener("change", () => {
  if (martes.checked) {
    horaInicioMartes.removeAttribute("disabled");
    horaFinMartes.removeAttribute("disabled");
  } else {
    horaInicioMartes.setAttribute("disabled", true);
    horaFinMartes.setAttribute("disabled", true);
    horaInicioMartes.value = ""
    horaFinMartes.value = ""
  }
});

miercoles.addEventListener("change", () => {
  if (miercoles.checked) {
    horaInicioMiercoles.removeAttribute("disabled")
    horaFinMiercoles.removeAttribute("disabled")
  } else {
    horaInicioMiercoles.setAttribute("disabled", true)
    horaFinMiercoles.setAttribute("disabled", true)
    horaInicioMiercoles.value = ""
    horaFinMiercoles.value = ""
  }
});

jueves.addEventListener("change", () => {
  if (jueves.checked) {
    horaInicioJueves.removeAttribute("disabled");
    horaFinJueves.removeAttribute("disabled");
  } else {
    horaInicioJueves.setAttribute("disabled", true);
    horaFinJueves.setAttribute("disabled", true);
    horaInicioJueves.value = ""
    horaFinJueves.value = ""
  }
});

viernes.addEventListener("change", () => {
  if (viernes.checked) {
    horaInicioViernes.removeAttribute("disabled");
    horaFinViernes.removeAttribute("disabled");
  } else {
    horaInicioViernes.setAttribute("disabled", true);
    horaFinViernes.setAttribute("disabled", true)
    horaInicioViernes.value = ""
    horaFinViernes.value = ""
  }
});

sabado.addEventListener("change", () => {
    if (sabado.checked) {
        horaInicioSabado.removeAttribute("disabled");
        horaFinSabado.removeAttribute("disabled");
    } else {
        horaInicioSabado.setAttribute("disabled", true);
        horaFinSabado.setAttribute("disabled", true)
        horaInicioSabado.value = ""
        horaFinSabado.value = ""
    }
})

cancelarHorario.addEventListener("click", () => {
  desactivaChecks()
  btnsHorario.style.display = "none";
  editarHorario.style.display = "block";
  fetchPerfil()
});

guardarHorario.addEventListener("click", async (e) => {
  e.preventDefault();
  const horario = {
    lunes: {
      horaInicio: horaInicioLunes.value,
      horaFin: horaFinLunes.value,
    },
    martes: {
      horaInicio: horaInicioMartes.value,
      horaFin: horaFinMartes.value,
    },
    miercoles: {
      horaInicio: horaInicioMiercoles.value,
      horaFin: horaFinMiercoles.value,
    },
    jueves: {
      horaInicio: horaInicioJueves.value,
      horaFin: horaFinJueves.value,
    },
    viernes: {
      horaInicio: horaInicioViernes.value,
      horaFin: horaFinViernes.value,
    },
    sabado: {
      horaInicio: horaInicioSabado.value,
      horaFin: horaFinSabado.value,
    },
  };

  console.log(horario)

  if (!validarHorario(horario)) {
    console.log("entra a validar")
    return false;
  }
  
  const response = await fetch("/maestro/actualizar-horario", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({horario: horario}),
  });
  if (response.ok) {
    alert("Horario actualizado exitosamente");
    btnsHorario.style.display = "none";
    editarHorario.style.display = "block";
    fetchPerfil();
  } else {
    console.log(horario)
    alert("Error al actualizar el horario");
  }
});

fetchPerfil();
