const agregarClase = document.getElementById("agregar-clase");
const dialogAgregarClase = document.getElementById("agregar-clase-dialog");
const closeDialog = document.getElementById("closeAgregar");
const container = document.getElementById("dias-horarios-container");
const cancelarRegistro = document.getElementById("cancelar-clase");
const agregarClaseBtn = document.getElementById("agregar-clase-btn");
const nivel = document.getElementById("nivel-clase");
const concentradoClases = document.getElementById("concentrado-mis-clases");
const loader = document.getElementById('loader')

const mensajeError = document.getElementById("mensajeError");
const mensajeExito = document.getElementById("mensajeExito");

let horario;

const niveles = [
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

// funciones simples
function abrirModal() {
  dialogAgregarClase.style.display = "block";
}

function cerrarModal() {
  dialogAgregarClase.style.display = "none";
}

function limpiarCampos() {
  nivel.value = "";
}

// ** FETCHES
async function fetchClases() {
  
  loader.style.display = "block";
  try {
    const response = await fetch("/maestro/clases");
    if (!response.ok) {
      if(response.status == 404){
        concentradoClases.innerHTML = "<h3>No se encontró ninguna clase</h3>";
      }
      throw new Error("Error en la solicitud: " + response.status);
      
    }
    misClases = await response.json();
    mostrarClases(misClases.clases);
    
  loader.style.display = "none";
  } catch (error) {
    console.error("Error al recuperar las clases:", error)
    
  loader.style.display = "none";
  }
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

function generarInputsHorarios(horario) {
  container.innerHTML = ""; // Limpiar contenedor

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

      container.appendChild(div);
    }
  });
}

function mostrarClases(clases) {
  concentradoClases.innerHTML = "";

  clases.forEach((clase) => {
    const fichaClase = document.createElement("div");
    fichaClase.className = "rectangulo";
    fichaClase.style.setProperty("--color", "#2e3192");
    fichaClase.style.marginBottom = "2rem";
    fichaClase.innerHTML = `<b>Nivel:</b> ${niveles[clase.nivel - 1]}`;

    const hr = document.createElement("hr");

    const alumnosHorario = document.createElement("div");
    alumnosHorario.className = "fila-a-columna";

    const alumnos = document.createElement("ul");
    alumnos.innerHTML = "<b><p>Alumnos: </p></b>";

    if (clase.alumnos.length===0) {
      alumnos.innerHTML = "<b><p>Alumnos: </p></b>No se han agregado alumnos.";
    } else if (clase.alumnos.length != 0){
      clase.alumnos.forEach((alumno) => {
        const liAlumno = document.createElement("li");
        liAlumno.textContent = `${alumno.nombre} ${alumno.apellidos}`;
        alumnos.appendChild(liAlumno);
      });
    }

    const horario = document.createElement("ul");
    horario.innerHTML = "<b><p>Horario: </p></b>";
    clase.horas.forEach((hora) => {
      const liHora = document.createElement("li");
      liHora.textContent = `${hora.dia}: ${hora.horaInicio}`;
      horario.appendChild(liHora);
    });

    const evaluaciones = document.createElement("div");
    evaluaciones.className = "fila-a-columna";

    const ultimaEv = document.createElement("p");
    if (clase.ultimaEv=='') {
      ultimaEv.innerHTML =
        "<b><p>Última evaluación: </p></b>No se ha evaluado.";
    } else {
      ultimaEv.innerHTML = `<b><p>Última evaluación: </p></b>${clase.ultimaEv}`;
    }
    const siguienteEv = document.createElement("p");
    if (clase.siguienteEv=='') {
      siguienteEv.innerHTML =
        "<b><p>Siguiente evaluación: </p></b>No se ha asignado.";
    } else {
      siguienteEv.innerHTML = `<b><p>Siguiente evaluación: </p></b>${clase.siguienteEv}`;
    }

    const botones = document.createElement("div");
    botones.className = "btns-doble";

    const abrirVista = document.createElement("button");
    abrirVista.className = "btn-texto";
    abrirVista.textContent = "Abrir vista detallada";
    abrirVista.style.setProperty("--color", "#2e3192")
    abrirVista.style.margin = '1rem 0'
    abrirVista.onclick =  () => {
      window.location.href = `/maestro/detalle-clase?id=${clase.id}`;
    }

    const eliminarClase = document.createElement("button");
    eliminarClase.className = "btn-texto";
    eliminarClase.textContent = "Eliminar clase";
    eliminarClase.style.setProperty("--color", "#ef8122")
    eliminarClase.style.margin = '1rem 0'

    eliminarClase.onclick = async () => {
      if (confirm("¿Está seguro de que quiere eliminar la clase?")) {
        
  loader.style.display = "block";
        const response = await fetch(`/maestro/eliminarClase/${clase.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          mostrarExito("Clase eliminada.");
          
  loader.style.display = "none";
          fetchClases();
        } else {
          mostrarError("UPS! Ocurrió un error al eliminar la clase");
        }
      }
    };

    botones.appendChild(eliminarClase);
    botones.appendChild(abrirVista);

    alumnosHorario.appendChild(alumnos);
    alumnosHorario.appendChild(horario);
    evaluaciones.appendChild(ultimaEv);
    evaluaciones.appendChild(siguienteEv);

    fichaClase.appendChild(hr);

    const columnaFila = document.createElement("div");
    columnaFila.className = "columna-a-fila";
    columnaFila.appendChild(alumnosHorario);
    columnaFila.appendChild(evaluaciones);

    fichaClase.appendChild(columnaFila);
    fichaClase.appendChild(botones);
    concentradoClases.appendChild(fichaClase);
  });
}

// Abre el diálogo para agregar una clase

agregarClase.addEventListener("click", () => {
  fetchHorario();
  abrirModal();
});

closeDialog.addEventListener("click", () => {
  cerrarModal();
});

cancelarRegistro.addEventListener("click", () => {
  if (confirm("¿Está seguro de que quiere cancelar el registro?")) {
    limpiarCampos();
    cerrarModal();
  }
});

agregarClaseBtn.addEventListener("click", async (event) => {
  if (!nivel.value) {
    mostrarError("No ha ingresado el nivel de la clase.");
    return;
  } else {
    // Obtener hora de inicio seleccionada
    const inputsHoraInicio = container.querySelectorAll('input[type="time"]');
    const inputsCheckbox = container.querySelectorAll('input[type="checkbox"]');

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

    loader.style.display = "block";
    try {
      const response = await fetch("/maestro/crear-clase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nivel: nivel.value,
          horarios: horariosSeleccionados,
        }),
      });

      if (response.ok) {
        
  loader.style.display = "none";
        mostrarExito("Clase creada exitosamente");
        fetchClases();
        cerrarModal();
      }
    } catch {
      mostrarError("Hubo un error al crear la clase. ");
    }
  }
});

fetchClases();
