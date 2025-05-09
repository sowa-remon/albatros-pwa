const nombreAlumno = document.getElementById("nombreAlumno");
const nivelAlumno = document.getElementById("nivelAlumno");
const fechaEvaluacion = document.getElementById("fechaEvaluacion");
const proximaClase = document.getElementById("proximaClase");
const duracionClase = document.getElementById("duracionClase");
const nombreMaestro = document.getElementById("nombreMaestro");
const curriculumMaestro = document.getElementById("curriculumMaestro");

const btnVerNivel = document.getElementById("btnVerNivel");
const modalNivel = document.getElementById("modalNivel");
const btnAceptar = document.getElementById("aceptarNivel");
const fechaEvaluado = document.getElementById('fechaEvaluado')
const observaciones = document.getElementById('observaciones')
const closeNivel = document.getElementById('closeNivel') 

const divMaestro = document.getElementById("maestro");
const divHorarios = document.getElementById("horario");
const divDetalles = document.getElementById("alumno");

const loader = document.getElementById('loader')

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
  'Iniciación deportiva'
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
  16:60
};

let idClase;
let nivel;

async function fetchClase(id) {
  
  loader.style.display = "block"

  try {
    const response = await fetch(`/alumno/mi-clase/${id}`);
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const data = await response.json();
    mostrarClase(data);
    
  loader.style.display = "none"
  } catch (error) {
    console.error("Error al recuperar la clase:", error);
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
      divHorarios.textContent =
        "Tus horarios de clase aparecerán cuando seas asignado a una clase.";
      divMaestro.textContent =
        "Los datos de tu maestro aparecerán cuando seas asignado a una clase.";
    } else {
      fetchClase(idClase);
    }

    if(data.usuario.evaluacion.aprobado==false){
        btnVerNivel.setAttribute('disabled', true)
    }else{
        fechaEvaluado.textContent = data.usuario.evaluacion.fechaEv
        observaciones.textContent = data.usuario.evaluacion.observaciones
    }

    nivel = data.usuario.nivel;
    mostrarPerfil(data.usuario);
  } catch (error) {
    console.error("Error al recuperar perfil:", error);
  }
}

function mostrarPerfil(alumno) {
  nombreAlumno.textContent = alumno.nombre + " " + alumno.apellidos;
  nivelAlumno.textContent = niveles[alumno.nivel];
  if (alumno.evaluacion.fechaEv == "") {
    fechaEvaluacion.textContent = "No se ha asignado";
  } else {
    fechaEvaluacion.textContent = alumno.evaluacion.fechaEv;
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
  duracionClase.textContent = programas[nivel] + " minutos";

  console.log(clase)
  const c = obtenerClaseMasProxima(clase.horas);
  proximaClase.textContent =
    capitalizeFirstLetter(c.dia) + " a las " + c.horaInicio;
}function obtenerClaseMasProxima(clases) {
  if (!clases || clases.length === 0) {
    return null; // No classes available
  }

  const diasSemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  const hoy = new Date();
  const diaHoy = diasSemana[hoy.getDay()];
  const horaActual = hoy.getHours() * 60 + hoy.getMinutes(); // Convert current time to minutes for comparison

  let claseMasProxima = null;
  let diferenciaMinima = Number.MAX_VALUE;

  clases.forEach((clase) => {
    const { dia, horaInicio } = clase;

    // Parse the horaInicio into minutes
    const [horaClase, minutoClase] = horaInicio.split(":").map(Number);
    const horaClaseEnMinutos = horaClase * 60 + minutoClase;

    // Calculate the difference in days between today and the class day
    let diferenciaDias = diasSemana.indexOf(dia) - diasSemana.indexOf(diaHoy);

    // If the class day is before today, consider it for the next week
    if (diferenciaDias < 0 || (diferenciaDias === 0 && horaClaseEnMinutos < horaActual)) {
      diferenciaDias += 7; // Wrap around to the next week
    }

    // Calculate the total difference in minutes (days to minutes + hour difference)
    const diferenciaEnMinutos = diferenciaDias * 1440 + (horaClaseEnMinutos - horaActual);

    if (diferenciaEnMinutos >= 0 && diferenciaEnMinutos < diferenciaMinima) {
      diferenciaMinima = diferenciaEnMinutos;
      claseMasProxima = clase;
    }
  });

  console.log(claseMasProxima);
  return claseMasProxima;
}

function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.slice(1);
}

btnVerNivel.onclick = async () => {
  modalNivel.style.display = "block";
};
btnAceptar.onclick = ()=>{
    modalNivel.style.display = 'none'
}
closeNivel.onclick = ()=>{
    modalNivel.style.display = 'none'
}



fetchPerfil();
