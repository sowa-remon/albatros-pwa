const modalAdmin = document.getElementById('admin-modal')
const abrirAdminModal = document.getElementById('abrirAdminModal') 
const usuarioAdmin = document.getElementById('usuario')

const cancelarAdmin = document.getElementById('cancelarAdmin')
const closeAdmin = document.getElementById('closeAdmin')
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

abrirAdminModal.onclick = () =>{
    modalAdmin.style.display = 'block'
    console.log(modalAdmin)
}

cancelarAdmin.onclick = () =>{
    modalAdmin.style.display = 'none'
}
closeAdmin.onclick = () =>{
    modalAdmin.style.display = 'none'
} 


modalAdmin.onsubmit = async (e) =>{
e.preventDefault()

    if(!usuarioAdmin.value){
        mostrarError('Ingrese el nombre de usuario del nuevo administrador')
        return
    }
    try{
        const response = await fetch("/admin/crearUsuarioAdmin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ usuario: usuarioAdmin.value }),
          });
          if (response.ok) {
            mostrarExito2("Usuario creado")
            modalAdmin.style.display  ='none'
          } else {
            mostrarError2("Error al crear al usuario");
          }
        }
        catch(e){
            mostrarError2(e)
        }
}
       
