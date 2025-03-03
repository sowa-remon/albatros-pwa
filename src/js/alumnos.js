const cancelarRegistro = document.getElementById("cancelarRegistro");
let nombre = document.getElementById("nombre");
let apellidos = document.getElementById("apellidos");
let fechaN = document.getElementById("fechaN");
let antecedentes = document.getElementById("antecedentes");
let restricciones = document.getElementById("restricciones");
let direccion = document.getElementById("direccion");
let telefono = document.getElementById("telefono");
let nivel = document.getElementById("nivel");
let totalAlumnos = document.getElementById("total-alumnos");
const alumnoModal = document.getElementById("alumno-modal");
const regresar = document.getElementById("regresar");
const concentradoAlumnos = document.getElementById("concentrado-alumnos");
const logout = document.getElementById("logout");
const barraBusqueda = document.getElementById('barra-busqueda');
let todosAlumnos = [];

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
    if(alumno.evaluacion.fechaEv == ' ' && alumno.evaluacion.maestro == ' ' && alumno.evaluacion.observaciones == ' '){
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
    if (alumno.estado == false) {
      btnVistaDetallada.setAttribute('disabled', true)
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
          const response = await fetch(`/admin/altaAlumno/${alumno.id}`, {
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

      const response = await fetch("/admin/crearUsuarioAlumno/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Alumno registrado exitosamente");
        fetchAlumnos()
        closeModal()
      } else {
        alert("Error al registrar el alumno ?");
      }
    }
  });

fetchAlumnos();
