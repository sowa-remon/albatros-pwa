const regresar = document.getElementById("regresar");
const titulo = document.getElementById("titulo-anuncio");
const contenido = document.getElementById("contenido");
const tipo = document.getElementById("tipo");
const fechaInicio = document.getElementById("fechaInicio");
const fechaFinal = document.getElementById("fechaFinal");
const imagen = document.getElementById("imagen");
const contenedorImagen = document.getElementById("contenedor-imagen-anuncio");
const modalImagen = document.getElementById('modal-imagen')
const imagenModal = document.getElementById('imagen-modal')
const btnAbrir = document.getElementById('abrir-imagen')

regresar.addEventListener("click", () => {
  window.history.back();
});

async function fetchAnuncioDetalles() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  try {
    const response = await fetch(`/admin/anuncio/${id}`);
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const anuncio = await response.json();
    const opcionesFecha = { year: "numeric", month: "long", day: "numeric" };
    
    const fechaI = new Date(anuncio.fechaInicio._seconds * 1000);
    const fechaInicioFormateada = fechaI.toLocaleDateString(
      "es-ES",
      opcionesFecha
    );

    let fechaF;
    let fechaFinalFormateada;

    if (anuncio.fechaFinal) {
      fechaF = new Date(anuncio.fechaFinal._seconds * 1000);
      fechaFinalFormateada = fechaF.toLocaleDateString("es-ES", opcionesFecha);
    }
   
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

    titulo.textContent = anuncio.titulo;
    fechaInicio.innerHTML = `<b>Fecha de publicación: </b>${fechaInicioFormateada}`;
    if(fechaF){
      fechaFinal.innerHTML = `<b>Duración hasta el día: </b>${fechaFinalFormateada}`;
    } else{
      fechaFinal.innerHTML = '<b>Duración: </b> Permanente'
   
    }
    contenido.textContent = anuncio.contenido;
    if (anuncio.imagen) {
      imagen.src = anuncio.imagen;
      imagenModal.src = anuncio.imagen;
      contenedorImagen.style.display = "block";
    }
  } catch (error) {
    console.error("Error al recuperar los detalles del anuncio:", error);
  }
}

function abrirModal () {
    modalImagen.style.display = 'block'
}

function cerrarModal() {
      modalImagen.style.display = 'none'
  }

window.onclick = function (event) {
  if (event.target === modalImagen) {
    modalImagen.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", fetchAnuncioDetalles);
