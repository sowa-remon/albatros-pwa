const modalPassword = document.getElementById('password-modal')
const abrirModal = document.getElementById('abrirPasswordModal') 
const pass1 = document.getElementById('pass1')
const pass2 = document.getElementById('pass2')
const cancelarPassword = document.getElementById('cancelarPassword')
const closePass = document.getElementById('closepass')
const mensajeError = document.getElementById('mensajeError')
const mensajeExito = document.getElementById('mensajeExito')

// ! mensaje de error
function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.style.display = "block";
  
    setTimeout(() => {
      mensajeError.style.display = "none";
    }, 4500);
  }
  
  // * mensaje de éxito
  function mostrarExito(mensaje) {
    mensajeExito.textContent = mensaje;
    mensajeExito.style.display = "block";
  
    setTimeout(() => {
      mensajeExito.style.display = "none";
    }, 4500);
  }

abrirModal.onclick = () =>{
    modalPassword.style.display = 'block'
}

cancelarPassword.onclick = () =>{
    modalPassword.style.display = 'none'
}
closePass.onclick = () =>{
    modalPassword.style.display = 'none'
} 


modalPassword.onsubmit = async (e) =>{
e.preventDefault()
    if(!pass1.value || !pass2.value) {
        mostrarError('Ingrese su contraseña')
        return
    }
    if(pass1.value != pass2.value){
        mostrarError('Las contraseñas no coinciden')
        return
    }
    try{
        const response = await fetch("/auth/actualizar-password", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: pass1.value }),
          });
          if (response.ok) {
            mostrarExito("Contraseña actualizada exitosamente")
            modalPassword.style.display  ='none'
          } else {
            mostrarError("Error al actualizar la contraseña");
          }
        }
        catch(e){
            mostrarError(e)
        }
}
       
