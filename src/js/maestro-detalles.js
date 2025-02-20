const regresar = document.getElementById("regresar");
const formDetalles = document.getElementById("form-detalle-maestro");
const nombre = document.getElementById("nombre");
const apellidos = document.getElementById("apellidos");
const fechaN = document.getElementById("fechaN");
const curriculum = document.getElementById("curriculum");
const direccion = document.getElementById("direccion");
const telefono = document.getElementById("telefono");

regresar.addEventListener("click", () => {
  window.history.back();
});

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
      alert("Cambios guardados exitosamente");
    } else {
      alert("Error al guardar los cambios en el if");
    }
  } catch (error) {
    console.error("Error al guardar los cambios:", error);
  }
});
