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
let todosAnuncios = []

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
  totalAnuncios.textContent = anuncios.length;

  anuncios.forEach((anuncio) => {

    const filaAnuncio = document.createElement("div");
    filaAnuncio.className = "fila-anuncio";

    const fichaAnuncio = document.createElement("div");
    fichaAnuncio.className = "ficha-anuncio";

    const titulo = document.createElement("div");
    titulo.innerHTML = `<p><b>${anuncio.titulo}</b></p> <p>${anuncio.fechaInicio}</p>`;
    titulo.className = "titulo-anuncio"
    fichaAnuncio.appendChild(titulo);

    filaAnuncio.appendChild(fichaAnuncio);

    const contenido = document.createElement("p");
    contenido.innerHTML = `${anuncio.contenido}`;
    fichaAnuncio.appendChild(contenido);

    const tipo = document.createElement("p")
    if(anuncio.tipo == 'bolsa'){
      tipo.innerHTML = "Bolsa de trabajo"
      tipo.className = "anuncio-bolsa"
    } else if(anuncio.tipo == 'promocion'){
      tipo.innerHTML = "Promoción"
      tipo.className = "anuncio-promo"
    } else {
      tipo.innerHTML = "General"
      tipo.className = "anuncio-general"
    }
    concentradoAnuncios.appendChild(filaAnuncio);
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
  .getElementById("publicarAnuncio")
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

fetchAnuncios()