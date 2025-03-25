const formDetalles = document.getElementById("form-detalle-maestro");
const nombre = document.getElementById("nombre");
const apellidos = document.getElementById("apellidos");
const fechaN = document.getElementById("fechaN");
const curriculum = document.getElementById("curriculum");
const direccion = document.getElementById("direccion");
const telefono = document.getElementById("telefono");
const horario = document.getElementById("horario");


const meError = document.getElementById("mensajeError");
const meExito = document.getElementById("mensajeExito");


// ! mensaje de error
function mostrarError(mensaje) {
  meError.textContent = mensaje;
  meError.style.display = "block";

  setTimeout(() => {
    meError.style.display = "none";
  }, 4500);
}

// * mensaje de éxito
function mostrarExito(mensaje) {
  meExito.textContent = mensaje;
  meExito.style.display = "block";

  setTimeout(() => {
    meExito.style.display = "none";
  }, 4500);
}

function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.slice(1);
}

async function fetchMaestroDetalles() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  try {
    const response = await fetch(`/admin/maestro/${id}`);
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const maestro = await response.json();

    nombre.value = maestro.nombre;
    apellidos.value = maestro.apellidos;
    fechaN.value = maestro.fechaN;
    curriculum.value = maestro.curriculum;
    direccion.value = maestro.direccion;
    telefono.value = maestro.telefono;

    const horarios = maestro.horario 
    for (const dia in horarios) {

      const { horaInicio, horaFin } = horarios[dia];
      if (horaInicio && horaFin) {
        const diaHorario = document.createElement('li')
        diaHorario.textContent =`${capitalizeFirstLetter(dia)}:   de ${horaInicio} a ${horaFin}`

        horario.appendChild(diaHorario)
      } 
    }
        
    const originalValues = {
      nombre: maestro.nombre,
      apellidos: maestro.apellidos,
      fechaN: maestro.fechaN,
      curriculum: maestro.curriculum,
      direccion: maestro.direccion,
      telefono: maestro.telefono,
    };

    document.getElementById("cancelar").addEventListener("click", () => {
      if (
        maestro.nombre == originalValues.nombre &&
        maestro.apellidos == originalValues.apellidos &&
        maestro.fechaN == originalValues.fechaN &&
        maestro.curriculum == originalValues.curriculum &&
        maestro.direccion == originalValues.direccion &&
        maestro.telefono == originalValues.telefono
      ) {
        return window.history.back();
      }
      // Confirmar cancelación
      if (confirm("¿Está seguro de que quiere cancelar los cambios?")) {
        nombre.value = originalValues.nombre;
        apellidos.value = originalValues.apellidos;
        fechaN.value = originalValues.fechaN;
        curriculum.value = originalValues.curriculum;
        direccion.value = originalValues.direccion;
        telefono.value = originalValues.telefono;

        // Redirige a la página anterior
        window.history.back();
      }
    });
  } catch (error) {
    console.error("Error al recuperar los detalles del maestro:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchMaestroDetalles);

formDetalles.addEventListener("submit", async (event) => {
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`/admin/actualizarMaestro/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      mostrarExito("Cambios guardados exitosamente");
    } else {
      mostrarError("Error al guardar los cambios");
    }
  } catch (error) {
    console.error("Error al guardar los cambios:", error);
  }
});
