const cancelarRegistro = document.getElementById("cancelarRegistro");
let titulo = document.getElementById("titulo");
let contenido = document.getElementById("contenido");
let imagen = document.getElementById("imagen");
let duracion = document.getElementById("duracion");
let tipo = document.getElementById("tipo");
let totalAnuncios = document.getElementById("total-anuncios");
const anuncioModal = document.getElementById("anuncio-modal");
const regresar = document.getElementById("regresar");
const concentradoAnuncios = document.getElementById("concentrado-anuncios");
const logout = document.getElementById("logout");

regresar.addEventListener("click", () => {
  window.history.back();
});

logout.addEventListener("click", async () => {
  if (confirm("¿Está seguro de que quiere cerrar sesión?")) {
    const response = await fetch("/auth/logout");
    if (response.ok) {
      alert("Sesión cerrada exitosamente");
      window.location.href = "/";
    } else {
      alert("Error al cerrar sesión");
    }
  }
});

async function fetchAnuncios() {
  try {
    const response = await fetch("/lista-anuncios");
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    anuncios = await response.json();
    mostrarAnuncios(todosAnuncios);
  } catch (error) {
    console.error("Error al recuperar anuncios:", error);
  }
}

function mostrarAnuncios(anuncios) {
  concentradoAnuncios.innerHTML = "";
  totalAnuncios.textContent = anuncios.length;

  anuncios.forEach((anuncio) => {

    const filaAnuncio = document.createElement("div");
    filaAnuncio.className = "fila-anuncio";

    const fichaAlumno = document.createElement("div");
    fichaAlumno.className = "ficha-alumno";

    const nombre = document.createElement("p");
    nombre.innerHTML = `<b>Nombre:</b> <span>${alumno.nombre} ${alumno.apellidos}</span>`;
    fichaAlumno.appendChild(nombre);

    const evaluacion = document.createElement("p");
    if(alumno.evaluacion.fechaEv == '' && alumno.evaluacion.maestro == '' && alumno.evaluacion.observaciones == ''){
      evaluacion.innerHTML = `<b>Evaluación:</b> <span>Pendiente</span>`;
      fichaAlumno.appendChild(evaluacion);
    }
    else{
      evaluacion.innerHTML = `<b>Evaluación:</b> <span>${alumno.evaluacion.aprobado ? "Aprobado" : "Por aprobar"}</span>`;
      fichaAlumno.appendChild(evaluacion);  
    }

    const status = document.createElement("p");
    status.innerHTML = `<b><span>Status:</span></b>`;
    status.appendChild(estado);
    fichaAlumno.appendChild(status);

    filaAlumno.appendChild(fichaAlumno);

    const usuario = document.createElement("p");
    usuario.innerHTML = `<b>Usuario:</b> <span>${alumno.usuario}</span>`;
    fichaAlumno.appendChild(usuario);

    const columna = document.createElement("div");
    columna.className = "columna-1-2";

    const btnVistaDetallada = document.createElement("button");
    btnVistaDetallada.className = "btn-texto";
    btnVistaDetallada.style.setProperty("--color", "#EF8122");
    btnVistaDetallada.textContent = "Abrir vista detallada";
    btnVistaDetallada.onclick = () => {
      window.location.href = `/admin/detalle-alumno?id=${alumno.id}`;
    };
    columna.appendChild(btnVistaDetallada);

    if (alumno.estado == true) {
      const btnBaja = document.createElement("button");
      btnBaja.className = "btn-texto";
      btnBaja.style.setProperty("--color", "#2E3192");
      btnBaja.textContent = "Dar de baja";
      btnBaja.onclick = async () => {
        if (confirm("¿Está seguro de que quiere dar de baja a este alumno?")) {
          const response = await fetch(`/admin/bajaAlumno?id=${alumno.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: alumno.id }),
          });
          if (response.ok) {
            alert("Alumno dado de baja exitosamente");
            fetchAlumnos();
          } else {
            alert("Error al dar de baja al alumno");
          }
        }
      };
      columna.appendChild(btnBaja);
    }
    if (alumno.estado == false) {
      const btnAlta = document.createElement("button");
      btnAlta.className = "btn-texto";
      btnAlta.style.setProperty("--color", "#2E3192");
      btnAlta.textContent = "Dar de alta";
      btnAlta.onclick = async () => {
        if (confirm("¿Está seguro de que quiere dar de alta a este alumno?")) {
          const response = await fetch(`/admin/altaAlumno?id=${alumno.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: alumno.id }),
          });
          if (response.ok) {
            alert("Alumno dado de alta exitosamente");
            fetchAlumnos();
          } else {
            alert("Error al dar de alta al alumno");
          }
        }
      };
      columna.appendChild(btnAlta);
    }
    filaAlumno.appendChild(columna);
    concentradoAlumnos.appendChild(filaAlumno);
  });
}

// Abre el modal
function openModal() {
  anuncioModal.style.display = "block";
}

// Cierra el modal
function closeModal() {
  anuncioModal.style.display = "none";
}

// Cierra el modal cuando el usuario hace clic fuera de él
window.onclick = function (event) {
  if (event.target === anuncioModal) {
    anuncioModal.style.display = "none";
  }
};

// Cancela el registro de un alumno
cancelarRegistro.addEventListener("click", () => {
  if (confirm("¿Está seguro de que quiere cancelar el registro?")) {
    nombre.value = "";
    apellidos.value = "";
    fechaN.value = "";
    antecedentes.value = "";
    restricciones.value = "";
    direccion.value = "";
    telefono.value = "";
    nivel.value = "";
    closeModal();
  }
});

// Maneja el envío del formulario de registro de alumnos
document
  .getElementById("registrarAlumno")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    if (
      !nombre.value ||
      !apellidos.value ||
      !fechaN.value ||
      !antecedentes.value ||
      !restricciones.value ||
      !direccion.value ||
      !telefono.value ||
      !nivel.value
    ) {
      console("Por favor, ingrese todos los campos");
      return;
    } else {
      const formData = new FormData(document.getElementById("registrarAlumno"));

      // Envía los datos a tu servidor (ajusta la URL según tu configuración)
      const response = await fetch("/admin/crearUsuarioAlumno/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Alumno registrado exitosamente");
        fetchAlumnos()
        closeModal()
        // Aquí puedes actualizar la lista de alumnos sin recargar la página
      } else {
        alert("Error al registrar el alumno ?");
      }
    }
  });

fetchAlumnos();
