let titulo = document.getElementById("titulo");
let contenido = document.getElementById("contenido");
let imagen = document.getElementById("imagen");
let duracion = document.getElementById("duracion");
let tipo = document.getElementById("tipo");
let totalAnuncios = document.getElementById("total-anuncios");
const concentradoAnuncios = document.getElementById("concentrado-anuncios");
let todosAnuncios = [];

async function fetchAnuncios() {
  try {
    
  loader.style.display = "block"
    const response = await fetch("/lista-anuncios");
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    anuncios = await response.json();
    mostrarAnuncios(anuncios);
    
  loader.style.display = "none"
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
    if(anuncio.fechaFinal){
       fechaFinal = new Date(anuncio.fechaFinal._seconds * 1000);
    }
    const opcionesFecha = { year: "numeric", month: "long", day: "numeric" };

    const fechaInicioFormateada = fechaInicio.toLocaleDateString(
      "es-ES",
      opcionesFecha
    );
    const hoy = new Date();
    

    if (hoy<=fechaFinal || anuncio.fechaFinal == null) {
      const filaAnuncio = document.createElement("div");
      filaAnuncio.className = "fila-anuncio";

      const fichaAnuncio = document.createElement("div");
      fichaAnuncio.style.marginBottom = '4rem'
      fichaAnuncio.className = "ficha-anuncio";

      const titulo = document.createElement("div");
      titulo.innerHTML = `<p>${anuncio.titulo}</p> <p class="fecha-anuncio"><b> Publicado el: <br></b> ${fechaInicioFormateada}</p>`;
      titulo.className = "titulo-anuncio";
      fichaAnuncio.appendChild(titulo);

      filaAnuncio.appendChild(fichaAnuncio);

      const contenido = document.createElement("p");
      contenido.innerHTML = `${anuncio.contenido}`;
      contenido.className = 'anuncio-contenido'
      fichaAnuncio.appendChild(contenido);

      
      const divImagen = document.createElement("img")
      divImagen.style.height = "10vh"
      divImagen.style.borderRadius = '5px'
      if(anuncio.imagen){
        divImagen.src = `${anuncio.imagen}` 
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

      
      if(anuncio.imagen){
        filaTipoEliminar.appendChild(divImagen)
      }
      fichaAnuncio.appendChild(filaTipoEliminar);
      
      fichaAnuncio.onclick = () => {
        window.location.href = `/detalle-anuncio?id=${anuncio.id}`;
      }
      concentradoAnuncios.appendChild(filaAnuncio)
      
    }
  });
}


fetchAnuncios();
