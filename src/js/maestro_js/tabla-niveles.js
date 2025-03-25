const tablaClases = document.getElementById('tabla-clases')

const meError = document.getElementById("mensaje-error");
const meExito = document.getElementById("mensaje-exito");

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

// ! mensaje de error
function mostrarError(mensaje) {
    meError.textContent = mensaje;
    meError.style.display = "block";
  
    setTimeout(() => {
      me.style.display = "none";
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

async function fetchClases(){
  try {
    const response = await fetch("/todas-las-clases");
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    let clases = await response.json();
    console.log(clases)
    mostrarClases(clases);
  } catch (error) {
    console.error("Error al recuperar las clases:", error);
  }
}

function mostrarClases(clases){
  if(clases.length==0){
    tablaClases.textContent = 'No hay clases'
  }
  else{
    const tabla = document.createElement('table')
    const thNivel = document.createElement('th')
    const thMaestro = document.createElement('th')
    const thAlumnos = document.createElement('th')
    thNivel.textContent = 'Nivel'
    thMaestro.textContent = 'Maestro'
    thAlumnos.textContent = 'Alumnos'
    tabla.appendChild(thNivel)
    tabla.appendChild(thMaestro)
    tabla.appendChild(thAlumnos)
    
    clases.forEach(clase => {
      const trClase = document.createElement('tr')
      trClase.innerHTML = `<td>${niveles[clase.nivel]}</td> <td>${clase.maestro.nombre}</td>`

      if(clase.alumnos == ''){
        const li = document.createElement('td')
        li.innerHTML = "No se han agregado alumnos"
        trClase.appendChild(li)
      }
      clase.alumnos.forEach(alumno =>{
        const liAlumno = document.createElement('td')
        liAlumno.innerHTML= `<li>${alumno.nombre} ${alumno.apellidos}</li>`
        trClase.appendChild(liAlumno)
      })

      tabla.appendChild(trClase)
    });

    tablaClases.appendChild(tabla)
    tablaClases.className = 'borde-tabla'
  }
}

fetchClases()
