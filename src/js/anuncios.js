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
const publicarAnuncio = document.getElementById("publicarAnuncio");
let todosAnuncios = [];

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
    mostrarAnuncios(anuncios);
  } catch (error) {
    console.error("Error al recuperar anuncios:", error);
  }
}

function mostrarAnuncios(anuncios) {
  concentradoAnuncios.innerHTML = "";

  anuncios.forEach((anuncio) => {
    // Convertir Timestamp a Date y formatear la fecha
    const fechaInicio = new Date(anuncio.fechaInicio._seconds * 1000);
    const fechaFinal = new Date(anuncio.fechaFinal._seconds * 1000);
    const opcionesFecha = { year: "numeric", month: "long", day: "numeric" };

    const fechaInicioFormateada = fechaInicio.toLocaleDateString(
      "es-ES",
      opcionesFecha
    );
    const fechaFinalFormateada = fechaFinal.toLocaleDateString(
      "es-ES",
      opcionesFecha
    );
    const hoy = new Date();
    

    if (hoy<=fechaFinal) {
      const filaAnuncio = document.createElement("div");
      filaAnuncio.className = "fila-anuncio";

      const fichaAnuncio = document.createElement("div");
      fichaAnuncio.className = "ficha-anuncio";

      const titulo = document.createElement("div");
      titulo.innerHTML = `<p><b>${anuncio.titulo}</b></p> <p>Fecha: ${fechaInicioFormateada}</p>`;
      titulo.className = "titulo-anuncio";
      fichaAnuncio.appendChild(titulo);

      filaAnuncio.appendChild(fichaAnuncio);

      const contenido = document.createElement("p");
      contenido.innerHTML = `${anuncio.contenido}`;
      fichaAnuncio.appendChild(contenido);

      const tipo = document.createElement("p");
      if (anuncio.tipo == "bolsa") {
        tipo.innerHTML = "Bolsa de trabajo";
        tipo.className = "anuncio-bolsa";
      } else if (anuncio.tipo == "promocion") {
        tipo.innerHTML = "Promoción";
        tipo.className = "anuncio-promo";
      } else {
        tipo.innerHTML = "General";
        tipo.className = "anuncio-general";
      }

      const filaTipoEliminar = document.createElement("div");
      filaTipoEliminar.style.display = "flex";
      filaTipoEliminar.style.justifyContent = "space-between";
      filaTipoEliminar.appendChild(tipo);

      const btnEliminar = document.createElement("button");
      btnEliminar.className = "btn-texto";
      btnEliminar.style.setProperty("--color", "#EF8122");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.onclick = async () => {
        if (confirm("¿Está seguro de que quiere eliminar el anuncio?")) {
          const response = await fetch(
            `/admin/eliminarAnuncio?id=${anuncio.id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: anuncio.id }),
            }
          );
          if (response.ok) {
            alert("Anuncio eliminado");
            fetchAnuncios();
          } else {
            alert("Error al eliminar");
          }
        }
      };
      filaTipoEliminar.appendChild(btnEliminar);
      fichaAnuncio.appendChild(filaTipoEliminar);
      concentradoAnuncios.appendChild(filaAnuncio);
    }
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
    titulo.value = "";
    contenido.value = "";
    duracion.value = "";
    tipo.value = "";
    closeModal();
  }
});

// Formulario de registro y publicación de anuncio
publicarAnuncio.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!titulo.value || !contenido.value || !duracion.value || !tipo.value) {
    console("Por favor, ingrese todos los campos");
    return;
  } else {
    const formData = new FormData(publicarAnuncio);

    const response = await fetch("/admin/crearAnuncio/", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Anuncio publicado");
      fetchAnuncios();
      closeModal();    
      titulo.value = "";
      contenido.value = "";
      duracion.value = "";
      tipo.value = "";
      } else {
      alert("Error al publicar el anuncio");
    }
  }
});

fetchAnuncios();
