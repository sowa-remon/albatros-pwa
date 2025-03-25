const cancelarRegistro = document.getElementById("cancelarRegistro");
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
const totalAlumnos = document.getElementById("total-alumnos");
const alumnoModal = document.getElementById("alumno-modal");
const concentradoAlumnos = document.getElementById("concentrado-alumnos");
const barraBusqueda = document.getElementById("barra-busqueda");

const meError = document.getElementById("mensaje-error");
const meExito = document.getElementById("mensaje-exito");

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();

if (dd < 10) {
  dd = "0" + dd;
}

if (mm < 10) {
  mm = "0" + mm;
}

today = yyyy + "-" + mm + "-" + dd;
fechaN.setAttribute("max", today);

let todosAlumnos = [];

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

async function fetchAlumnos() {
  try {
    const response = await fetch("/admin/lista-alumnos");
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    todosAlumnos = await response.json();
    mostrarAlumnos(todosAlumnos);
  } catch (error) {
    console.error("Error al recuperar alumnos:", error);
  }
}

function mostrarAlumnos(alumnos) {
  concentradoAlumnos.innerHTML = "";
  totalAlumnos.textContent = alumnos.length;

  alumnos.forEach((alumno) => {
    let estado;
    if (alumno.estado == false) {
      estado = document.createElement("span");
      estado.className = "status-inactivo";
      estado.innerHTML = " Inactivo";
    } else {
      estado = document.createElement("span");
      estado.className = "status-activo";
      estado.innerHTML = " Activo";
    }

    const filaAlumno = document.createElement("div");
    filaAlumno.className = "fila-alumno";

    const fichaAlumno = document.createElement("div");
    fichaAlumno.className = "ficha-alumno";

    const nombre = document.createElement("p");
    nombre.innerHTML = `<b>Nombre:</b> <span>${alumno.nombre} ${alumno.apellidos}</span>`;
    fichaAlumno.appendChild(nombre);

    const evaluacion = document.createElement("p");
    if (
      alumno.evaluacion.fechaEv == "" &&
      alumno.evaluacion.maestro == "" &&
      alumno.evaluacion.observaciones == ""
    ) {
      evaluacion.innerHTML = `<b>Evaluación:</b> <span>Pendiente</span>`;
      fichaAlumno.appendChild(evaluacion);
    } else {
      evaluacion.innerHTML = `<b>Evaluación:</b> <span>${
        alumno.evaluacion.aprobado ? "Aprobado" : "Por aprobar"
      }</span>`;
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

    const btnResetPass = document.createElement('button')
    btnResetPass.className = 'btn-texto'
    btnResetPass.style.margin =  '1rem 0'
    btnResetPass.style.setProperty("--color", "#EF8122");
    btnResetPass.textContent = 'Restaurar contraseña'
    btnResetPass.onclick = async () => {
      if (confirm("¿Desea restaurar la contraseña de este usuario?")) {
        const response = await fetch(`/admin/reset-password/${alumno.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: alumno.id }),
        });
        if (response.ok) {
          mostrarExito("Contraseña restaurada");
        } else {
          mostrarError("Error al cambiar la contraseña");
        }
      }
    };

    fichaAlumno.appendChild(btnResetPass)

    const columna = document.createElement("div");
    columna.className = "columna-1-2";

    const btnVistaDetallada = document.createElement("button");
    btnVistaDetallada.className = "btn-texto";
    btnVistaDetallada.style.setProperty("--color", "#EF8122");
    btnVistaDetallada.textContent = "Abrir vista detallada";
    if (alumno.estado == false) {
      btnVistaDetallada.setAttribute("disabled", true);
    }
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
          const response = await fetch(`/admin/bajaAlumno/${alumno.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: alumno.id }),
          });
          if (response.ok) {
            mostrarExito("Alumno dado de baja exitosamente");
            fetchAlumnos();
          } else {
            mostrarError("Error al dar de baja al alumno");
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
          const response = await fetch(`/admin/altaAlumno/${alumno.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: alumno.id }),
          });
          if (response.ok) {
            mostrarExito("Alumno dado de alta exitosamente");
            fetchAlumnos();
          } else {
            mostrarError("Error al dar de alta al alumno");
          }
        }
      };
      columna.appendChild(btnAlta);
    }
    filaAlumno.appendChild(columna);
    concentradoAlumnos.appendChild(filaAlumno);
  });
}

function filterAlumnos() {
  const alumnoDivs = document.getElementsByClassName("fila-alumno");
  const searchTerm = barraBusqueda.value.toLowerCase();
  Array.from(alumnoDivs).forEach((div) => {
    const nombre = div.getElementsByTagName("p")[0].innerText.toLowerCase();
    if (nombre.includes(searchTerm)) {
      div.style.display = "";
    } else {
      div.style.display = "none";
    }
  });
}

barraBusqueda.addEventListener("input", () => {
  filterAlumnos();
});

// Abre el modal
function openModal() {
  alumnoModal.style.display = "block";
}

// Cierra el modal
function closeModal() {
  alumnoModal.style.display = "none";
}

// Cierra el modal cuando el usuario hace clic fuera de él
window.onclick = function (event) {
  if (event.target === alumnoModal) {
    alumnoModal.style.display = "none";
  }
};

function limpiarCampos() {
  nombre.value = "";
  apellidos.value = "";
  fechaN.value = "";
  antecedentes.value = "";
  restricciones.value = "";
  direccion.value = "";
  telefono.value = "";
  contactoNombre.value = "";
  contactoTelefono.value = "";
  nivel.value = "";
}

// Cancela el registro de un alumno
cancelarRegistro.addEventListener("click", () => {
  if (confirm("¿Está seguro de que quiere cancelar el registro?")) {
    limpiarCampos();
    closeModal();
  }
});

document
  .getElementById("registrarAlumno")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const btnRegistrarAlumno = document.getElementById("btnRegistrarAlumno");
    btnRegistrarAlumno.setAttribute("disabled", true);
    if (
      !nombre.value ||
      !apellidos.value ||
      !fechaN.value ||
      !restricciones  ||
      !direccion.value ||
      !telefono.value ||
      !nivel.value ||
      !contactoTelefono ||
      !contactoNombre
    ) {
      mostrarError("Por favor, ingrese todos los campos");

      btnRegistrarAlumno.removeAttribute("disabled");
      return;
    } else {
      data = {
        nombre: nombre.value,
        apellidos: apellidos.value,
        fechaN: fechaN.value,
        antecedentes: antecedentes.value,
        restricciones: restricciones.value,
        direccion: direccion.value,
        telefono: telefono.value,
        contactoNombre: contactoNombre.value,
        contactoTelefono: contactoTelefono.value,
        nivel: nivel.value,
      };

      const response = await fetch("/admin/crearUsuarioAlumno/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        mostrarExito("Alumno registrado exitosamente");
        limpiarCampos();

        btnRegistrarAlumno.removeAttribute("disabled");
        fetchAlumnos();
        closeModal();
      } else {
        mostrarError("Error al registrar el alumno ?");
        
    btnRegistrarAlumno.removeAttribute('disabled')
      }
    }
  });

fetchAlumnos();
