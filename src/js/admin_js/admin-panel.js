
const mensajeError2 = document.getElementById('mensajeError')
const mensajeExito2 = document.getElementById('mensajeExito')

// ! mensaje de error
function mostrarError2(mensaje) {
    mensajeError2.textContent = mensaje;
    mensajeError2.style.display = "block";
  
    setTimeout(() => {
      mensajeError2.style.display = "none";
    }, 4500);
  }
  
  // * mensaje de éxito
  function mostrarExito2(mensaje) {
    mensajeExito2.textContent = mensaje;
    mensajeExito2.style.display = "block";
  
    setTimeout(() => {
      mensajeExito2.style.display = "none";
    }, 4500);
  }

       
