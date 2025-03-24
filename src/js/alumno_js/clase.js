const nombreAlumno = document.getElementById("nombreAlumno");
const nivelAlumno = document.getElementById("nivelAlumno");
const fechaEvaluacion = document.getElementById("fechaEvaluacion");
const proximaClase = document.getElementById("proximaClase");
const duracionClase = document.getElementById("duracionClase");
const nombreMaestro = document.getElementById("nombreMaestro");
const curriculumMaestro = document.getElementById("curriculumMaestro");
const contenidoPedagogico = document.getElementById('contenidoPedagogico')
const diasHorario = document.getElementById('dias-horario')

const niveles = [
  "Ninguno",
  "Bebé",
  "Cangrejo",
  "Caballito de  mar",
  "Estrella de mar",
  "Patito",
  "Ajolote",
  "Pecesito",
  "Tortuga",
  "Rana",
  "Pingüino",
  "Delfín",
  "Mantarraya",
  "Pez vela",
  "Albatros",
  "Adulto",
];

const programas = {
  0: 0,
  1: 30,
  2: 30,
  3: 40,
  4: 55,
  5: 55,
  6: 50,
  7: 50,
  8: 55,
  9: 55,
  10: 55,
  11: 55,
  12: 55,
  13: 55,
  14: 55,
  15: 60,
};

let idClase;
let nivel;

async function fetchClase(id) {
  try {
    const response = await fetch(`/alumno/mi-clase/${id}`);
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const data = await response.json();
    mostrarClase(data);
  } catch (error) {
    console.error("Error al recuperar la clase:", error);
  }
}

async function fetchContenido(n) {
  try {
    const response = await fetch(`/alumno/contenido/${n}`);
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const data = await response.json();
    mostrarContenido(data);
  } catch (error) {
    console.error("Error al recuperar:", error);
  }
}

async function fetchPerfil() {
  try {
    const response = await fetch("/auth/perfil");
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const data = await response.json();

    idClase = data.usuario.clase;
    if (idClase == "") {
    } else {
      fetchClase(idClase);
    }

    nivel = data.usuario.nivel;
    if(Number(nivel)==0){

    }else{
        console.log(Number(nivel))
        fetchContenido(Number(nivel))
    }

  } catch (error) {
    console.error("Error al recuperar perfil:", error);
  }
}

function mostrarClase(clase) {
  nombreMaestro.textContent = clase.maestro.nombre;
  if (clase.maestro.curriculum == "") {
    curriculumMaestro.textContent = "Tu maestro no ha agregado su currículum";
  }
  if (clase.maestro.curriculum != "") {
    curriculumMaestro.textContent = clase.maestro.curriculum;
  }
  duracionClase.textContent = programas[nivel] + ' minutos'

  clase.horas.forEach(hora => {
    const elementHora = document.createElement('div')
    elementHora.className = 'dato'
    let dia = capitalizeFirstLetter(hora.dia) 
    elementHora.innerHTML = `<p><b>${dia}</b></p> <p>${hora.horaInicio}</p>`

    diasHorario.appendChild(elementHora)
  });
}
function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  function mostrarContenido(con){
    contenidoPedagogico.textContent = con.objetivos
    if(con.video==''){}
    else{
        const videoContenido = document.createElement('video')
        const sourceVideo = document.createElement('source')
        sourceVideo.src = con.video
        videoContenido.appendChild(sourceVideo)
        videoContenido.className = 'video-contenido'
        videoContenido.autoplay = true
        videoContenido.loop = true
        videoContenido.muted = true; 
        const contenido = document.getElementById('contenido')
        contenido.appendChild(videoContenido)
    }
  }
fetchPerfil();
