

const meError = document.getElementById("mensaje-error");
const meExito = document.getElementById("mensaje-exito");

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