const nivelClase = document.getElementById("nivel-clase");
const duracion = document.getElementById("duracion");
const alumnos = document.getElementById("alumnos");
const horarios = document.getElementById("horarios");
const agregarAlumnosModal = document.getElementById("agregar-alumnos-modal");
const btnAgregar = document.getElementById("btnAgregar");
const btnAgregarAlumnos = document.getElementById("agregar-alumnos-btn");
const btnCancelarAlumnos = document.getElementById("cancelar-alumnos-btn");
const closeAgregarAlumnosModal = document.getElementById("closeAgregar");
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
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  try {
    const response = await fetch(`/maestro/clase/${id}`);
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const clase = await response.json();
    idClase = clase.id;
    mostrarClase(clase);
  } catch (error) {
    console.error("Error al recuperar los detalles del anuncio:", error);
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
    console.log(alumno);
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
        location.reload();
      } else {
        mostrarError("UPS! Hubo un error al agregar a los alumnos.");
      }
    } catch (error) {
      mostrarError(`Error al enviar la solicitud: ${error.message}`);
    }
  };
}

function abrirModalAgregar() {
  agregarAlumnosModal.style.display = "block";
}
function cerrarModalAgregar() {
  agregarAlumnosModal.style.display = "none";
}

function mostrarClase(clase) {
  nivelClase.innerHTML = `<b>Nivel: </b> ${niveles[clase.nivel]}`;
  duracion.innerHTML = `<b>Duración de la clase: </b> ${
    programas[clase.nivel]
  } minutos`;

  clase.horas.forEach((hora) => {
    const liHora = document.createElement("li");
    liHora.textContent = `${hora.dia}: ${hora.horaInicio}`;
    horarios.appendChild(liHora);
  });

  if (clase.alumnos) {
    clase.alumnos.forEach((alumno) => {
      const liAlumno = document.createElement("li");
      liAlumno.textContent = `${alumno.nombre} ${alumno.apellidos}`;

      const eliminarAlumno = document.createElement("button");
      eliminarAlumno.textContent = "Remover";
      eliminarAlumno.className = "btn-texto";
      eliminarAlumno.style.setProperty("--color", "#ef8122");

      eliminarAlumno.onclick = async () => {
        if (confirm("¡Está seguro que quiere remover al alumno de la clase?")) {
          console.log(alumno.id)
          const response = await fetch(`/maestro/removerAlumno`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idClase: idClase, idAlumno: alumno.id }),
          });
          if (response.ok) {
            liAlumno.remove()
            eliminarAlumno.remove()
            mostrarExito("Se eliminó al alumno correctamente");
          } else {
            mostrarError("Ocurrió un error al intentar remover al alumno");
          }
        }
      };

      alumnos.appendChild(liAlumno);
      alumnos.appendChild(eliminarAlumno);
    });
  } else {
    const liAlumno = document.createElement("li");
    liAlumno.textContent = "No hay alumnos";
    alumnos.appendChild(liAlumno);
  }

  btnAgregar.onclick = () => {
    fetchAlumnos(clase.nivel);
    abrirModalAgregar();
  };
}

btnCancelarAlumnos.onclick = () => {
  cerrarModalAgregar();
};

closeAgregarAlumnosModal.onclick = () => {
  cerrarModalAgregar();
};

document.addEventListener("DOMContentLoaded", fetchClaseDetalles);
