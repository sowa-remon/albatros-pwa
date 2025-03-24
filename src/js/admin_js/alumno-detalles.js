const formEvaluacion = document.getElementById("form-evaluacion-alumno");
const formDetalles = document.getElementById("form-detalle-alumno");
const nombre = document.getElementById("nombre");
const apellidos = document.getElementById("apellidos");
const fechaN = document.getElementById("fechaN");
const antecedentes = document.getElementById("antecedentes");
const restricciones = document.getElementById("restricciones");
const direccion = document.getElementById("direccion");
const telefono = document.getElementById("telefono");
const contactoNombre = document.getElementById("contactoNombre");
const contactoTelefono = document.getElementById("contactoTelefono");
const nivel = document.getElementById("nivel");
const estadoEvaluacion = document.getElementById("estado-evaluacion");
const fechaEv = document.getElementById("fechaEv");
const maestro = document.getElementById("maestro");
const observaciones = document.getElementById("observaciones");
const aprobar = document.getElementById("aprobar");

async function fetchAlumnoDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  try {
    const response = await fetch(`/admin/alumno/${id}`);
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const alumno = await response.json();

    nombre.value = alumno.nombre;
    apellidos.value = alumno.apellidos;
    fechaN.value = alumno.fechaN;
    antecedentes.value = alumno.antecedentes;
    restricciones.value = alumno.restricciones;
    direccion.value = alumno.direccion;
    telefono.value = alumno.telefono;
    contactoNombre.value = alumno.contactoE.contactoNombre;
    contactoTelefono.value = alumno.contactoE.contactoTelefono;
    nivel.value = alumno.nivel;

    estadoEvaluacion.innerHTML = alumno.evaluacion.aprobado
      ? "Aprobado"
      : "Por aprobar";

    fechaEv.value = alumno.evaluacion.fechaEv;
    maestro.value = alumno.evaluacion.maestro;
    observaciones.value = alumno.evaluacion.observaciones;

    if (alumno.evaluacion.aprobado) {
      estadoEvaluacion.innerHTML = "Aprobado";
      observaciones.setAttribute("disabled", true);
      aprobar.setAttribute("disabled", true);
    }
    
    if(alumno.evaluacion.fechaEv == '' && alumno.evaluacion.maestro == '' && alumno.evaluacion.observaciones == ''){
      observaciones.setAttribute('disabled', true)
      estadoEvaluacion.innerHTML = 'Pendiente'
      aprobar.innerHTML = "Evaluación pendiente";
      aprobar.setAttribute('disabled', true);
    }

    const originalValues = {
      nombre: alumno.nombre,
      apellidos: alumno.apellidos,
      fechaN: alumno.fechaN,
      antecedentes: alumno.antecedentes,
      restricciones: alumno.restricciones,
      direccion: alumno.direccion,
      telefono: alumno.telefono,
      contactoNombre: alumno.contactoE.contactoNombre,
      contactoTelefono: alumno.contactoE.contactoTelefono,
      nivel: alumno.nivel,
    };

    document.getElementById("cancelar").addEventListener("click", () => {
      if (
        alumno.nombre == originalValues.nombre &&
        alumno.apellidos == originalValues.apellidos &&
        alumno.fechaN == originalValues.fechaN &&
        alumno.antecedentes == originalValues.antecedentes &&
        alumno.restricciones == originalValues.restricciones &&
        alumno.direccion == originalValues.direccion &&
        alumno.telefono == originalValues.telefono &&
        alumno.contactoE.contactoNombre == originalValues.contactoNombre &&
        alumno.contactoE.contactoTelefono == originalValues.contactoTelefono &&
        alumno.nivel == originalValues.nivel
      ) {
        return window.history.back();
      }
      // Confirmar cancelación
      if (confirm("¿Está seguro de que quiere cancelar los cambios?")) {
        nombre.value = originalValues.nombre;
        apellidos.value = originalValues.apellidos;
        fechaN.value = originalValues.fechaN;
        antecedentes.value = originalValues.antecedentes;
        restricciones.value = originalValues.restricciones;
        direccion.value = originalValues.direccion;
        telefono.value = originalValues.telefono;
        contactoNombre.value = originalValues.contactoNombre;
        contactoTelefono.value = originalValues.contactoTelefono;
        nivel.value = originalValues.nivel;

        // Redirige a la página anterior
        window.history.back();
      }
    });
  } catch (error) {
    console.error("Error al recuperar los detalles del alumno:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchAlumnoDetails);

formDetalles.addEventListener("submit", async (event) => {
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const formData = new FormData(event.target);
  let data = Object.fromEntries(formData.entries());
  data.contactoE = {
    contactoNombre: data.contactoNombre,
    contactoTelefono: data.contactoTelefono,
  }; 
  delete data.contactoNombre;
  delete data.contactoTelefono;

  try {
    const response = await fetch(`/admin/actualizarAlumno/${id}`, {
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

formEvaluacion.addEventListener("submit", async (event) => {
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id")
  console.log(id)

  try {
    const response = await fetch(`/admin/publicarEvaluacion/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({observaciones: observaciones.value}),
    });

    if (response.ok) {
      alert("Se publicó la evaluación al alumno");
      estadoEvaluacion.innerHTML = "Aprobado";
      observaciones.setAttribute("disabled", true);
      aprobar.setAttribute("disabled", true);
    } else {
      alert("No se pudo publicar la evaluación");
    }
  } catch (error) {
    console.error("Error al guardar los cambios:", error);
  }
});
