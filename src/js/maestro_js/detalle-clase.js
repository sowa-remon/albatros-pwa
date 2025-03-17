const nivelClase = document.getElementById('nivel-clase')
const duracion = document.getElementById('duracion')
const alumnos = document.getElementById('alumnos')
const horarios = document.getElementById('horarios')
const agregarAlumnosModal = document.getElementById('agregar-alumnos-modal')
const btnAgregar = document.getElementById('btnAgregar')

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
  
async function fetchAnuncioDetalles() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  try {
    const response = await fetch(`/maestro/clase/${id}`);
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const clase = await response.json();
    mostrarClase(clase)

  } catch (error) {
    console.error("Error al recuperar los detalles del anuncio:", error);
  }
}

async function fetchAlumnos(nivel) {
    try {
      const response = await fetch(`/maestro/alumnos/${nivel}`);
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      alumnosDisponibles = await response.json();
      
      console.log(alumnosDisponibles, nivel)
      generarInputsAlumnos(alumnosDisponibles);
    } catch (error) {
      console.error("Error al recuperar el horario:", error);
    }
  }

    function generarInputsAlumnos(alumnos) {
        const contenedor = document.getElementById("alumnos-disponibles-container");
        contenedor.innerHTML = ""; // Limpiar contenido previo
      
        alumnos.forEach(alumno => {
            console.log(alumno)
          const input = document.createElement("input");
          input.type = "checkbox";
          input.value = alumno.id;
          input.id = `alumno-${alumno.id}`;
      
          const label = document.createElement("label");
          label.htmlFor = `alumno-${alumno.id}`;
          label.textContent = `${alumno.nombre} (Nivel: ${alumno.nivel})`;
      
          const div = document.createElement("div");
          div.appendChild(input);
          div.appendChild(label);
      
          contenedor.appendChild(div);
        });
      }
      

function abrirModalAgregar(){
    agregarAlumnosModal.style.display = 'block'
}

function mostrarClase(clase){
    nivelClase.innerHTML = `<b>Nivel: </b> ${niveles[clase.nivel-1]}`
    duracion.innerHTML  = `<b>Duración de la clase: </b> ${programas[clase.nivel-1]} minutos`

    clase.horas.forEach((hora) => {
        const liHora = document.createElement("li");
        liHora.textContent = `${hora.dia}: ${hora.horaInicio}`;
        horarios.appendChild(liHora);
      });
      
      if(clase.alumnos){
        clase.alumnos.forEach((alumno) => {
            const liAlumno = document.createElement("li");
            liAlumno.textContent = `${alumno.nombre}: ${alumno.apellido}`;
            const eliminarAlumno = document.createElement('button')
            eliminarAlumno.textContent = 'Expulsar'
            eliminarAlumno.className = 'btn-texto'

            alumnos.appendChild(liAlumno);
            alumnos.appendChild(eliminarAlumno)
          });
      }
      else{
        const liAlumno = document.createElement("li");
        liAlumno.textContent = "No hay alumnos";
        alumnos.appendChild(liAlumno)
      }
      
btnAgregar.onclick = () =>{
    fetchAlumnos(clase.nivel)
    abrirModalAgregar()
}

}

document.addEventListener("DOMContentLoaded", fetchAnuncioDetalles);
