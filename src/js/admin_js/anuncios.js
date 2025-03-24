const cancelarRegistro = document.getElementById("cancelarRegistro");
const titulo = document.getElementById("titulo");
const contenido = document.getElementById("contenido");
const imagen = document.getElementById("imagen");
const duracion = document.getElementById("duracion");
const tipo = document.getElementById("tipo");
const totalAnuncios = document.getElementById("total-anuncios");
const anuncioModal = document.getElementById("anuncio-modal");
const concentradoAnuncios = document.getElementById("concentrado-anuncios");
const publicarAnuncio = document.getElementById("publicarAnuncio");

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

let todosAnuncios = [];

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
    let fechaFinal;
    if (anuncio.fechaFinal) {
      fechaFinal = new Date(anuncio.fechaFinal._seconds * 1000);
    }
    const opcionesFecha = { year: "numeric", month: "long", day: "numeric" };

    const fechaInicioFormateada = fechaInicio.toLocaleDateString(
      "es-ES",
      opcionesFecha
    );
    const hoy = new Date();

    if (hoy <= fechaFinal || anuncio.fechaFinal == null) {
      const filaAnuncio = document.createElement("div");
      filaAnuncio.className = "fila-anuncio";

      const fichaAnuncio = document.createElement("div");
      fichaAnuncio.className = "ficha-anuncio";

      const titulo = document.createElement("div");
      titulo.innerHTML = `<p>${anuncio.titulo}</p> <p class="fecha-anuncio"><b> Publicado el: <br></b> ${fechaInicioFormateada}</p>`;
      titulo.className = "titulo-anuncio";
      fichaAnuncio.appendChild(titulo);

      filaAnuncio.appendChild(fichaAnuncio);

      const contenido = document.createElement("p");
      contenido.innerHTML = `${anuncio.contenido}`;
      contenido.className = "anuncio-contenido";
      fichaAnuncio.appendChild(contenido);

      const divImagen = document.createElement("img");
      divImagen.style.height = "10vh";
      divImagen.style.borderRadius = "5px";
      if (anuncio.imagen) {
        divImagen.src = `${anuncio.imagen}`;
      }

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
      btnEliminar.style.marginBottom = "4rem";
      btnEliminar.style.alignSelf = "end";
      btnEliminar.textContent = "Eliminar";
      btnEliminar.onclick = async () => {
        if (confirm("¿Está seguro de que quiere eliminar el anuncio?")) {
          const response = await fetch(`/admin/eliminarAnuncio/${anuncio.id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            mostrarExito("Anuncio eliminado");
            fetchAnuncios();
          } else {
            mostrarError("Error al eliminar");
          }
        }
      };
      if (anuncio.imagen) {
        filaTipoEliminar.appendChild(divImagen);
      }
      fichaAnuncio.appendChild(filaTipoEliminar);

      fichaAnuncio.onclick = () => {
        window.location.href = `/detalle-anuncio?id=${anuncio.id}`;
      };
      concentradoAnuncios.appendChild(filaAnuncio);
      concentradoAnuncios.appendChild(btnEliminar);
    }
  });
}

function openModal() {
  anuncioModal.style.display = "block";
}

function closeModal() {
  anuncioModal.style.display = "none";
}

function limpiarCampos() {
  titulo.value = "";
  contenido.value = "";
  duracion.value = "";
  tipo.value = "";
  imagen.value = "";
}

window.onclick = function (event) {
  if (event.target === anuncioModal) {
    closeModal();
  }
};

cancelarRegistro.addEventListener("click", () => {
  if (confirm("¿Está seguro de que quiere cancelar el registro?")) {
    limpiarCampos();
    closeModal();
  }
});

publicarAnuncio.addEventListener("submit", async (event) => {
  event.preventDefault();
  const btnPublicar = document.getElementById("btnPublicar");
  btnPublicar.setAttribute("disabled", true);
  if (!titulo.value || !contenido.value || !duracion.value || !tipo.value) {
    mostrarError("Por favor, ingrese todos los campos");
    btnPublicar.removeAttribute("disabled");
    return;
  } else {
    const formData = new FormData(publicarAnuncio);

    const response = await fetch("/admin/crearAnuncio/", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      mostrarExito("Anuncio publicado");

      btnPublicar.removeAttribute("disabled");
      fetchAnuncios();
      limpiarCampos();
      closeModal();
    } else {
      mostrarError("Error al publicar el anuncio");

      btnPublicar.removeAttribute("disabled");
    }
  }
});

fetchAnuncios();
