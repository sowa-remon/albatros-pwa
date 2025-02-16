const cancelarRegistro = document.getElementById("cancelarRegistro");
const nombre = document.getElementById("nombre");
const apellidos = document.getElementById("apellidos");
const direccion = document.getElementById("direccion");
const fechaN = document.getElementById("fechaN");
const telefono = document.getElementById("telefono");
const totalMaestros = document.getElementById("total-maestros");
const maestroModal = document.getElementById("maestro-modal");
const regresar = document.getElementById("regresar");
const concentradoMaestros = document.getElementById("concentrado-maestros");
const logout = document.getElementById("logout");
const barraBusqueda = document.getElementById('barra-busqueda');
const registrarMaestro = document.getElementById('registrarMaestro')
let todosMaestros = [];

// TODO: Cambiar a un archivo el boton de regresar y logout para reutilizar código
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

async function fetchMaestros() {
  try {
    const response = await fetch("/admin/lista-maestros");
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    todosMaestros = await response.json();
    mostrarMaestros(todosMaestros);
  } catch (error) {
    console.error("Error al recuperar maestros:", error);
  }
}

function mostrarMaestros(maestros) {
  concentradoMaestros.innerHTML = "";
  totalMaestros.textContent = maestros.length;

  maestros.forEach((maestro) => {
    let estado;
    if (maestro.estado == false) {
      estado = document.createElement("span");
      estado.className = "status-inactivo";
      estado.innerHTML = " Inactivo";
    } else {
      estado = document.createElement("span");
      estado.className = "status-activo";
      estado.innerHTML = " Activo";
    }

    const filaMaestro = document.createElement("div");
    filaMaestro.className = "fila-alumno";

    const fichaMaestro = document.createElement("div");
    fichaMaestro.className = "ficha-alumno";

    const nombre = document.createElement("p");
    nombre.innerHTML = `<b>Nombre:</b> <span>${maestro.nombre} ${maestro.apellidos}</span>`;
    fichaMaestro.appendChild(nombre);

    const status = document.createElement("p");
    status.innerHTML = `<b><span>Status:</span></b>`;
    status.appendChild(estado);
    fichaMaestro.appendChild(status);

    filaMaestro.appendChild(fichaMaestro);

    const usuario = document.createElement("p");
    usuario.innerHTML = `<b>Usuario:</b> <span>${maestro.usuario}</span>`;
    fichaMaestro.appendChild(usuario);

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

    if (maestro.estado == true) {
      const btnBaja = document.createElement("button");
      btnBaja.className = "btn-texto";
      btnBaja.style.setProperty("--color", "#2E3192");
      btnBaja.textContent = "Dar de baja";
      btnBaja.onclick = async () => {
        if (confirm("¿Está seguro de que quiere dar de baja a este alumno?")) {
          const response = await fetch(`/admin/bajaMaestro?id=${maestro.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: maestro.id }),
          });
          if (response.ok) {
            alert("Alumno dado de baja exitosamente");
            fetchMaestros();
          } else {
            alert("Error al dar de baja al alumno");
          }
        }
      };
      columna.appendChild(btnBaja);
    }
    if (maestro.estado == false) {
      const btnAlta = document.createElement("button");
      btnAlta.className = "btn-texto";
      btnAlta.style.setProperty("--color", "#2E3192");
      btnAlta.textContent = "Dar de alta";
      btnAlta.onclick = async () => {
        if (confirm("¿Está seguro de que quiere dar de alta a este maestro?")) {
          const response = await fetch(`/admin/altaMaestro?id=${alumno.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: maestro.id }),
          });
          if (response.ok) {
            alert("Maestro dado de alta exitosamente");
            fetchAlumnos();
          } else {
            alert("Error al dar de alta al alumno");
          }
        }
      };
      columna.appendChild(btnAlta);
    }
    filaMaestro.appendChild(columna);
    concentradoMaestros.appendChild(filaMaestro);
  });
}

function filterMaestros() {
  const maestroDivs = document.getElementsByClassName("fila-alumno");
  const searchTerm = barraBusqueda.value.toLowerCase();
  Array.from(maestroDivs).forEach((div) => {
    const nombre = div.getElementsByTagName("p")[0].innerText.toLowerCase();
    if (nombre.includes(searchTerm)) {
      div.style.display = "";
    } else {
      div.style.display = "none";
    }
  });
}

barraBusqueda.addEventListener("input", () => {
  filterMaestros();
});

// Abre el modal
function openModal() {
  maestroModal.style.display = "block";
}

// Cierra el modal
function closeModal() {
  maestroModal.style.display = "none";
}

// Cierra el modal cuando el usuario hace clic fuera de él
window.onclick = function (event) {
  if (event.target === maestroModal) {
    maestroModal.style.display = "none";
  }
};

// Cancela el registro de un alumno
cancelarRegistro.addEventListener("click", () => {
  if (confirm("¿Está seguro de que quiere cancelar el registro?")) {
    nombre.value = "";
    apellidos.value = "";
    fechaN.value = "";
    direccion.value = "";
    telefono.value = "";
    closeModal();
  }
});

// Maneja el envío del formulario de registro de alumnos
  registrarMaestro.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (
      !nombre.value ||
      !apellidos.value ||
      !fechaN.value ||
      !direccion.value ||
      !telefono.value
    ) {
      console.log("Por favor, ingrese todos los campos");
      return;
    } else {
      const formData = new FormData(registrarMaestro);
      // Envía los datos a tu servidor (ajusta la URL según tu configuración)
      const response = await fetch("/admin/crearUsuarioMaestro", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Alumno registrado exitosamente");
        fetchMaestros()
        closeModal()
        // Aquí puedes actualizar la lista de alumnos sin recargar la página
      } else {
        alert("Error al registrar el maestro ?");
      }
    }
  });

fetchMaestros();
