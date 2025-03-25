const nivelClase = document.getElementById("nivel-clase");
const duracion = document.getElementById("duracion");
const alumnos = document.getElementById("alumnos");
const horarios = document.getElementById("horarios");

const loader = document.getElementById("loader");

// Elementos modal agregar alumnos
const agregarAlumnosModal = document.getElementById("agregar-alumnos-modal");
const btnAgregar = document.getElementById("btnAgregar");
const btnAgregarAlumnos = document.getElementById("agregar-alumnos-btn");
const btnCancelarAlumnos = document.getElementById("cancelar-alumnos-btn");
const closeAgregarAlumnosModal = document.getElementById("closeAgregar");
// Elementos modal editar horarios
const editarHorariosModal = document.getElementById("editar-horarios-modal");
const btnEditar = document.getElementById("btnEditar");
const btnEditarHorarios = document.getElementById("editar-horarios-btn");
const btnCancelarHorarios = document.getElementById("cancelar-horarios-btn");
const closeEditarHorariosModal = document.getElementById("closeEditar");
const containerHorarios = document.getElementById(
  "horarios-disponibles-container"
);
// Elementos modal evaluacion
const evaluacionModal = document.getElementById("evaluacion-modal");
const btnEvaluacion = document.getElementById("btnEvaluacion");
const btnAsignarEvaluacion = document.getElementById("asignar-evaluacion-btn");
const btnCancelarEvaluacion = document.getElementById(
  "cancelar-evaluacion-btn"
);
const closeEvaluacionModal = document.getElementById("closeEvaluacion");
const grupo = document.getElementById("grupo");
const alumnnosEvaluacionContainer = document.getElementById(
  "alumnos-evaluacion-container"
);
const fechaEvaluacionInput = document.getElementById("fecha-evaluacion");
const diasEvaluacionContainer = document.getElementById(
  "dias-evaluacion-container"
);

// Elementos modal resultados
const resultadosModal = document.getElementById("resultados-modal");
const btnResultados = document.getElementById("btnResultados");
const btnAsignarResultados = document.getElementById("asignar-resultados-btn");
const btnCancelarResultados = document.getElementById(
  "cancelar-resultados-btn"
);
const closeResultadosModal = document.getElementById("closeResultados");
const formResultados = document.getElementById("form-resultados");

const select = document.getElementById("diasEvaluacion");
const ultimaEvElemento = document.getElementById("ultimaEv");
const siguienteEvElemento = document.getElementById("siguienteEv");

const tablaBorde = document.getElementById("tabla-borde");
// Elementos mensajes
const mensajeError = document.getElementById("mensajeError");
const mensajeExito = document.getElementById("mensajeExito");

const niveles = [
  "Ninguno",
  "Bebé",
  "Cangrejo",
  "Caballito de  mar",
  "Estrella de mar",
  "Patito",
  "Ajolote",
  "Pecesito",
  "Tortuga",
  "Rana",
  "Pingüino",
  "Delfín",
  "Mantarraya",
  "Pez vela",
  "Albatros",
  "Adulto",
];

const programas = {
  0: 0,
  1: 30,
  2: 30,
  3: 40,
  4: 55,
  5: 55,
  6: 50,
  7: 50,
  8: 55,
  9: 55,
  10: 55,
  11: 55,
  12: 55,
  13: 55,
  14: 55,
  15: 60,
};

let idClase;
let horario;
let fechaEvaluacion;
let alumnosEvaluados;
let nivelActual;
let alumnosDisponibles;

// ! mensaje de error
function mostrarError(mensaje) {
  mensajeError.textContent = mensaje;
  mensajeError.style.display = "block";

  setTimeout(() => {
    mensajeError.style.display = "none";
  }, 4500);
}

// * mensaje de éxito
function mostrarExito(mensaje) {
  mensajeExito.textContent = mensaje;
  mensajeExito.style.display = "block";

  setTimeout(() => {
    mensajeExito.style.display = "none";
  }, 4500);
}

async function fetchClaseDetalles() {
  loader.style.display = "block";
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  try {
    const response = await fetch(`/maestro/clase/${id}`);
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const clase = await response.json();
    idClase = clase.id;
    nivelActual = clase.nivel;
    mostrarClase(clase);

    loader.style.display = "none";
  } catch (error) {
    console.error("Error al recuperar los detalles del anuncio:", error);

    loader.style.display = "none";
  }
}

async function fetchAlumnos(nivel) {
  try {
    const response = await fetch(`/maestro/alumnos/${nivel}`);
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    alumnosDisponibles = await response.json();

    generarInputsAlumnos(alumnosDisponibles);
  } catch (error) {
    console.error("Error al recuperar el horario:", error);
  }
}

function generarInputsAlumnos(alumnos) {
  const contenedor = document.getElementById("alumnos-disponibles-container");
  contenedor.innerHTML = ""; // Limpiar contenido previo

  if (alumnos.length == 0) {
    contenedor.innerHTML = "No hay alumnos disponibles";
    btnAgregarAlumnos.setAttribute("disabled", true);
    return;
  }
  alumnos.forEach((alumno) => {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = alumno.id;
    input.id = `alumno-${alumno.id}`;

    const label = document.createElement("label");
    label.htmlFor = `alumno-${alumno.id}`;
    label.textContent = `${alumno.nombre} ${alumno.apellidos}`;

    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.margin = "1rem 0";
    div.appendChild(input);
    div.appendChild(label);

    contenedor.appendChild(div);
  });

  btnAgregarAlumnos.onclick = async () => {
    // Recopilar los alumnos seleccionados con todos sus datos
    const checkboxes = document.querySelectorAll(
      "#alumnos-disponibles-container input[type='checkbox']:checked"
    );
    const alumnosSeleccionados = Array.from(checkboxes).map((checkbox) => {
      const alumnoId = checkbox.value;
      return alumnos.find((alumno) => alumno.id === alumnoId); // Obtener datos completos del alumno
    });

    if (alumnosSeleccionados.length === 0) {
      mostrarError("Debes seleccionar al menos un alumno.");
      return;
    }

    loader.style.display = "block";
    // Hacer la petición a la ruta para agregar alumnos
    try {
      const response = await fetch(`/maestro/agregarAlumnos`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alumnos: alumnosSeleccionados,
          idClase, // Asegúrate de tener definido el ID de la clase
        }),
      });

      if (response.ok) {
        mostrarExito("Alumnos agregados exitosamente.");

        loader.style.display = "none";
        location.reload();
      } else {
        mostrarError("UPS! Hubo un error al agregar a los alumnos.");

        loader.style.display = "none";
      }
    } catch (error) {
      mostrarError(`Error al enviar la solicitud: ${error.message}`);

      loader.style.display = "none";
    }
  };
}

async function fetchHorario() {
  try {
    const response = await fetch("/maestro/obtener-horario");
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    horario = await response.json();
    generarInputsHorarios(horario.horario);
  } catch (error) {
    console.error("Error al recuperar el horario:", error);
  }
}
function generarDiasEvaluacion(mes, horas) {
  // Limpiar el contenedor para evitar duplicados
  diasEvaluacionContainer.innerHTML = "";

  // Parsear el mes en formato yyyy-mm a un objeto Date
  const [year, month] = mes.value.split("-");
  const diasEnElMes = new Date(year, month, 0).getDate(); // Último día del mes

  // Generar fechas y verificar coincidencias
  for (let dia = 1; dia <= diasEnElMes; dia++) {
    const fecha = new Date(year, month - 1, dia); // Crear fecha

    const opcionesDiaSemana = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
    ];
    const nombreDia = opcionesDiaSemana[fecha.getDay()];

    const diaCoincide = horas.some(
      (hora) => hora.dia.toLowerCase() === nombreDia.toLowerCase()
    );

    if (diaCoincide) {
      const option = document.createElement("option");
      option.textContent = `${nombreDia.substring(0, 3)} ${dia}`;
      option.value = `${fecha.toISOString().split("T")[0]}`; // Formato ISO
      select.appendChild(option);
    }
  }

  // Agregar el <select> al contenedor
  diasEvaluacionContainer.appendChild(select);
}

function generarInputsHorarios(horario) {
  containerHorarios.innerHTML = ""; // Limpiar contenedor

  Object.keys(horario).forEach((dia) => {
    const { horaInicio, horaFin } = horario[dia];

    // Verificar que ambos horarios sean válidos
    if (horaInicio && horaFin) {
      // Crear contenedor para cada día
      const div = document.createElement("div");
      div.classList.add("dia-horario");

      // Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `checkbox-${dia}`;
      checkbox.name = dia;
      checkbox.onchange = () => {
        if (checkbox.checked) {
          inputHoraInicio.removeAttribute("disabled");
        } else {
          inputHoraInicio.value = horaInicio;
          inputHoraInicio.setAttribute("disabled", true);
        }
      };

      // Etiqueta para el día
      const label = document.createElement("label");
      label.htmlFor = `checkbox-${dia}`;
      label.textContent = dia.charAt(0).toUpperCase() + dia.slice(1);

      // Etiqueta para el inicio
      const horaI = document.createElement("label");
      horaI.htmlFor = `input-${horaInicio}`;
      horaI.textContent = "Hora de inicio de clase";

      // Input de hora de inicio
      const inputHoraInicio = document.createElement("input");
      inputHoraInicio.setAttribute("disabled", true);
      inputHoraInicio.type = "time";
      inputHoraInicio.name = `horaInicio-${dia}`;
      inputHoraInicio.min = horaInicio;
      inputHoraInicio.max = horaFin;
      inputHoraInicio.value = horaInicio;

      // Agregar elementos al contenedor
      const diaCheck = document.createElement("div");
      diaCheck.style.display = "flex";
      diaCheck.style.alignItems = "center";
      diaCheck.style.margin = "1rem 0";
      diaCheck.appendChild(checkbox);
      diaCheck.appendChild(label);

      div.appendChild(diaCheck);
      div.appendChild(horaI);
      div.appendChild(inputHoraInicio);

      containerHorarios.appendChild(div);
    }
  });
}

function abrirModalAgregar() {
  agregarAlumnosModal.style.display = "block";
}
function cerrarModalAgregar() {
  agregarAlumnosModal.style.display = "none";
}
function abrirModalEditar() {
  editarHorariosModal.style.display = "block";
}
function cerrarModalEditar() {
  editarHorariosModal.style.display = "none";
}
function abrirModalEvaluacion() {
  evaluacionModal.style.display = "block";
}
function cerrarModalEvaluacion() {
  evaluacionModal.style.display = "none";
}
function abrirModalResultados(a) {
  const alumnoEvaluado = document.getElementById("alumnoEvaluado");
  const nivelSelect = document.getElementById("nivelSelect");
  const observaciones = document.getElementById("observaciones");
  const idAlumno = document.getElementById("idAlumno");
  idAlumno.style.display = "none";
  idAlumno.textContent = a.id;
  alumnoEvaluado.textContent = `${a.nombre} ${a.apellidos}`;
  nivelSelect.value = nivelActual;

  resultadosModal.style.display = "block";
}
function cerrarModalResultados() {
  resultadosModal.style.display = "none";
}

function mostrarClase(clase) {
  nivelClase.innerHTML = `<b>Nivel: </b> ${niveles[clase.nivel]}`;
  duracion.innerHTML = `<b>Duración de la clase: </b> ${
    programas[clase.nivel]
  } minutos`;

  if (clase.ultimaEv == "") {
    ultimaEvElemento.innerHTML = "No se ha evaluado";
  } else {
    ultimaEvElemento.innerHTML = clase.ultimaEv;
  }

  if (clase.siguienteEv == "") {
    siguienteEvElemento.innerHTML = "No se ha asignado";
  } else {
    siguienteEvElemento.innerHTML = clase.siguienteEv;
  }

  clase.horas.forEach((hora) => {
    const liHora = document.createElement("li");
    liHora.textContent = `${hora.dia}: ${hora.horaInicio}`;
    horarios.appendChild(liHora);
  });

  if (clase.alumnos.length != 0) {
    clase.alumnos.forEach((alumno) => {
      const trAlumno = document.createElement("tr");
      const tdNombre = document.createElement("td");

      const checkboxAlumno = document.createElement("input");
      checkboxAlumno.type = "checkbox";
      checkboxAlumno.value = alumno.id;
      const labelAlumno = document.createElement("label");
      labelAlumno.textContent = alumno.nombre + ' ' + alumno.apellidos;

      // TODO: Agregar info médica en un dialog
      const tdRestricciones = document.createElement("td");
      const tdAntecedentes = document.createElement("td");
      const tdEliminar = document.createElement("td");

      tdNombre.textContent = `${alumno.nombre} ${alumno.apellidos}`;

      const eliminarAlumno = document.createElement("button");
      eliminarAlumno.textContent = "Remover";
      eliminarAlumno.className = "btn-texto";
      eliminarAlumno.style.setProperty("--color", "#ef8122");

      eliminarAlumno.onclick = async () => {
        if (confirm("¡Está seguro que quiere remover al alumno de la clase?")) {
          console.log(alumno.id);
          const response = await fetch(`/maestro/removerAlumno`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idClase: idClase, idAlumno: alumno.id }),
          });
          if (response.ok) {
            trAlumno.remove();
            mostrarExito("Se eliminó al alumno correctamente");
          } else {
            mostrarError("Ocurrió un error al intentar remover al alumno");
          }
        }
      };

      tdEliminar.appendChild(eliminarAlumno);
      trAlumno.appendChild(tdNombre);
      trAlumno.appendChild(tdEliminar);
      alumnos.appendChild(trAlumno);

      const alumnoCheck = document.createElement("div");
      alumnoCheck.style.display = "flex";
      alumnoCheck.style.alignItems = "center";
      alumnoCheck.style.margin = "1rem 0";
      alumnoCheck.appendChild(checkboxAlumno);
      alumnoCheck.appendChild(labelAlumno);

      alumnnosEvaluacionContainer.appendChild(alumnoCheck);

      if (alumno.evaluar == true) {
        const tdEvaluar = document.createElement("td");
        const btnEvaluar = document.createElement("button");
        btnEvaluar.className = "btn-texto";
        btnEvaluar.style.setProperty("--color", "#2e3192");

        btnEvaluar.textContent = "Añadir ev.";
        tdEvaluar.appendChild(btnEvaluar);

        trAlumno.appendChild(tdEvaluar);

        btnEvaluar.onclick = () => {
          abrirModalResultados(alumno);
        };
      }
    });
  }
  if (clase.alumnos.length == 0) {
    const liAlumno = document.createElement("p");
    liAlumno.textContent = "No hay alumnos";
    tablaBorde.style.border = "none";
    alumnos.replaceChildren(liAlumno);

    alumnnosEvaluacionContainer.innerHTML =
      '<p class="negro">No hay alumnos para evaluar</p>';
  }

  btnAgregar.onclick = () => {
    fetchAlumnos(clase.nivel);
    abrirModalAgregar();
  };
  btnEditar.onclick = () => {
    fetchHorario();
    abrirModalEditar();
  };
  btnEvaluacion.onclick = () => {
    grupo.innerHTML = `Grupo: <span class="negro">${
      niveles[clase.nivel]
    }</span>`;

    const mesEvaluacion = document.getElementById("mes-evaluacion");
    mesEvaluacion.onchange = () => {
      generarDiasEvaluacion(mesEvaluacion, clase.horas);
    };
    abrirModalEvaluacion();
  };
}

btnEditarHorarios.addEventListener("click", async () => {
  const inputsHoraInicio =
    containerHorarios.querySelectorAll('input[type="time"]');
  const inputsCheckbox = containerHorarios.querySelectorAll(
    'input[type="checkbox"]'
  );

  // Crear un array con los horarios seleccionados
  let horariosSeleccionados = [];
  inputsCheckbox.forEach((checkbox, index) => {
    if (checkbox.checked) {
      const horaInicio = inputsHoraInicio[index].value; // Hora de inicio correspondiente
      if (horaInicio) {
        horariosSeleccionados.push({
          dia: checkbox.name, // Nombre del día
          horaInicio: horaInicio,
        });
      }
    }
  });
  // Verifica si se seleccionaron horarios
  if (horariosSeleccionados.length === 0) {
    mostrarError("Por favor, seleccione al menos un horario.");
    return;
  }

  try {
    const response = await fetch("/maestro/actualizar-horario-clase", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idClase: idClase,
        horas: horariosSeleccionados,
      }),
    });

    if (response.ok) {
      mostrarExito("Horarios actualizados exitosamente");
      location.reload();
    } else {
      const errorData = await response.json();
      mostrarError("Error del servidor: " + errorData.message);
    }
  } catch {
    mostrarError("Hubo un error al actualizar la clase. ");
  }
});

btnAsignarEvaluacion.onclick = async () => {
  const inputsAlumnosEvaluacion = alumnnosEvaluacionContainer.querySelectorAll(
    'input[type="checkbox"]'
  );

  let alumnosParaEvaluar = [];
  inputsAlumnosEvaluacion.forEach((checkbox, index) => {
    if (checkbox.checked) {
      const alumnoEvaluar = inputsAlumnosEvaluacion[index].value; // Hora de inicio correspondiente
      if (alumnoEvaluar) {
        alumnosParaEvaluar.push({
          id: checkbox.value,
        });
      }
    }
  });

  const fecha = select.value;

  // Verificar que ambos valores estén seleccionados
  if (!fecha) {
    mostrarError("Por favor, selecciona la fecha");
    return;
  }

  if (alumnosParaEvaluar.length === 0) {
    mostrarError("Seleccione al menos un alumno para evaluación.");
    return;
  }

  loader.style.display = "block";
  try {
    const response = await fetch("/maestro/asignar-evaluacion", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        alumnos: alumnosParaEvaluar,
        idClase: idClase,
        fecha: fecha,
      }),
    });

    if (response.ok) {
      mostrarExito("Se asignó la evaluación");
      
  loader.style.display = "none";
      location.reload();
    } else {
      const errorData = await response.json();
      mostrarError("Error del servidor: " + errorData.message);
      
  loader.style.display = "none";
    }
  } catch {
    mostrarError("Hubo un error al asignar la evaluación. ");
    
  loader.style.display = "none";
  }
};

btnCancelarAlumnos.onclick = () => {
  cerrarModalAgregar();
};
closeAgregarAlumnosModal.onclick = () => {
  cerrarModalAgregar();
};
btnCancelarHorarios.onclick = () => {
  cerrarModalEditar();
};
closeEditarHorariosModal.onclick = () => {
  cerrarModalEditar();
};
btnCancelarEvaluacion.onclick = () => {
  cerrarModalEvaluacion();
};
closeEvaluacionModal.onclick = () => {
  cerrarModalEvaluacion();
};
btnCancelarResultados.onclick = () => {
  cerrarModalResultados();
};
closeResultadosModal.onclick = () => {
  cerrarModalResultados();
};

formResultados.onsubmit = async (e) => {
  e.preventDefault();

  if (observaciones.value == "") {
    mostrarError("Por favor incluye las observaciones");
    return;
  }

  const data = {
    idAlumno: idAlumno.textContent,
    idClase: idClase,
    nivel: nivelSelect.value,
    observaciones: observaciones.value,
  };
  console.log(data);
  try {
    const response = await fetch("/maestro/publicar-evaluacion", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      mostrarExito("Se asignó la evaluación");
      location.reload();
    } else {
      const errorData = await response.json();
      mostrarError("Error del servidor: " + errorData.message);
    }
  } catch {
    mostrarError("Hubo un error al asignar la evaluación. ");
  }
};
document.addEventListener("DOMContentLoaded", fetchClaseDetalles);
