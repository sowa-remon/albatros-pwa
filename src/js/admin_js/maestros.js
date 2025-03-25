const concentradoMaestros = document.getElementById("concentrado-maestros");
const cancelarRegistro = document.getElementById("cancelarRegistro");
const registrarMaestro = document.getElementById("registrarMaestro");
const totalMaestros = document.getElementById("total-maestros");
const barraBusqueda = document.getElementById("barra-busqueda");
const maestroModal = document.getElementById("maestro-modal");
const apellidos = document.getElementById("apellidos");
const direccion = document.getElementById("direccion");
const telefono = document.getElementById("telefono");
const nombre = document.getElementById("nombre");
const fechaN = document.getElementById("fechaN");

const loader = document.getElementById('loader')

const meError = document.getElementById("mensajeError");
const meExito = document.getElementById("mensajeExito");

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

let todosMaestros = [];

async function fetchMaestros() {
  
  loader.style.display = "block"
  try {
    const response = await fetch("/admin/lista-maestros");
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    todosMaestros = await response.json();
    mostrarMaestros(todosMaestros);
    
  loader.style.display = "none"
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
    
    const btnResetPass = document.createElement('button')
    btnResetPass.className = 'btn-texto'
    btnResetPass.style.margin =  '1rem 0'
    btnResetPass.style.setProperty("--color", "#EF8122");
    btnResetPass.textContent = 'Restaurar contraseña'
    btnResetPass.onclick = async () => {
      if (confirm("¿Desea restaurar la contraseña de este usuario?")) {
        const response = await fetch(`/admin/reset-password/${maestro.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: maestro.id }),
        });
        if (response.ok) {
          mostrarExito("Contraseña restaurada");
        } else {
          mostrarError("Error al cambiar la contraseña");
        }
      }
    };

    fichaMaestro.appendChild(btnResetPass)

    const columna = document.createElement("div");
    columna.className = "columna-1-2";

    const btnVistaDetallada = document.createElement("button");
    btnVistaDetallada.className = "btn-texto";
    btnVistaDetallada.style.setProperty("--color", "#EF8122");
    if (maestro.estado == false) {
      btnVistaDetallada.setAttribute("disabled", true);
    }
    btnVistaDetallada.textContent = "Abrir vista detallada";
    btnVistaDetallada.onclick = () => {
      window.location.href = `/admin/detalle-maestro?id=${maestro.id}`;
    };
    columna.appendChild(btnVistaDetallada);

    if (maestro.estado == true) {
      const btnBaja = document.createElement("button");
      btnBaja.className = "btn-texto";
      btnBaja.style.setProperty("--color", "#2E3192");
      btnBaja.textContent = "Dar de baja";
      btnBaja.onclick = async () => {
        if (confirm("¿Está seguro de que quiere dar de baja a este maestro?")) {
          const response = await fetch(`/admin/bajaMaestro/${maestro.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: maestro.id }),
          });
          if (response.ok) {
            mostrarExito("Maestro dado de baja exitosamente");
            fetchMaestros();
          } else {
            mostrarError("Error al dar de baja al maestro");
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
          const response = await fetch(`/admin/altaMaestro/${maestro.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: maestro.id }),
          });
          if (response.ok) {
            mostrarExito("Maestro dado de alta exitosamente");
            fetchMaestros();
          } else {
            mostrarError("Error al dar de alta al maestro");
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
  closeModal();
});

// Maneja el envío del formulario de registro de alumnos
registrarMaestro.addEventListener("submit", async (event) => {
  event.preventDefault();
  const btnRegistrar = document.getElementById("btnRegistrar");
  btnRegistrar.setAttribute("disabled", true);
  if (
    !nombre.value ||
    !apellidos.value ||
    !fechaN.value ||
    !direccion.value ||
    !telefono.value
  ) {
    mostrarError("Por favor, ingrese todos los campos");
    btnRegistrar.removeAttribute("disabled");
    return;
  } else {
    // Crear un objeto con los datos del formulario
    const data = {
      nombre: nombre.value,
      apellidos: apellidos.value,
      fechaN: fechaN.value,
      direccion: direccion.value,
      telefono: telefono.value,
    };
    const response = await fetch("/admin/crearUsuarioMaestro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      mostrarExito("Maestro registrado exitosamente");

      btnRegistrar.removeAttribute("disabled");
      fetchMaestros();
      closeModal();
    } else {
      mostrarError("Error al registrar el maestro");

      btnRegistrar.removeAttribute("disabled");
    }
  }
});

fetchMaestros();
