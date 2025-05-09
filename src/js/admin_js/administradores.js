const concentradoAdmins = document.getElementById("concentrado-admins");
const totalAdmins = document.getElementById("total-admins");
const meError = document.getElementById("mensajeError");
const meExito = document.getElementById("mensajeExito");
const modalAdmin = document.getElementById('admin-modal')
const abrirAdminModal = document.getElementById('abrirAdminModal') 
const usuarioAdmin = document.getElementById('usuario')

const cancelarAdmin = document.getElementById('cancelarAdmin')
const closeAdmin = document.getElementById('closeAdmin')


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


const mensajeError = document.getElementById('mensajeError')
const mensajeExito = document.getElementById('mensajeExito')


// ! mensaje de error
function mostrarError2(mensaje) {
  meError.textContent = mensaje;
  meError.style.display = "block";

  setTimeout(() => {
    meError.style.display = "none";
  }, 4500);
}

// * mensaje de éxito
function mostrarExito2(mensaje) {
  meExito.textContent = mensaje;
  meExito.style.display = "block";

  setTimeout(() => {
    meExito.style.display = "none";
  }, 4500);
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

let miId;

async function fetchAdmin() {
  try {
    const response = await fetch("/auth/perfil");
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    let admin = await response.json();
    miId = admin.usuario.id;
  } catch (error) {
    console.error("Error al recuperar los datos edl admin:", error);
  }
}
fetchAdmin();

async function fetchAdmins() {
  try {
    const response = await fetch("/admin/lista-admins");
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    let todosAdmins = await response.json();
    mostrarAdmins(todosAdmins);
  } catch (error) {
    console.error("Error al recuperar los administradores:", error);
  }
}

function mostrarAdmins(admins) {
  concentradoAdmins.innerHTML = "";
  totalAdmins.textContent = admins.length;

  admins.forEach((admin) => {
    let estado;
    if (admin.activo == false) {
      estado = document.createElement("span");
      estado.className = "status-inactivo";
      estado.innerHTML = " Inactivo";
    } else {
      estado = document.createElement("span");
      estado.className = "status-activo";
      estado.innerHTML = " Activo";
    }

    const filaAdmin = document.createElement("div");
    filaAdmin.className = "fila-alumno";

    const fichaAdmin = document.createElement("div");
    fichaAdmin.className = "ficha-alumno";

    const status = document.createElement("p");
    status.innerHTML = `<b><span>Status:</span></b>`;
    status.appendChild(estado);
    fichaAdmin.appendChild(status);
  
    const btnResetPass = document.createElement('button')
    btnResetPass.className = 'btn-texto'
    btnResetPass.style.margin =  '1rem 0'
    btnResetPass.style.setProperty("--color", "#EF8122");
    btnResetPass.textContent = 'Restaurar contraseña'
    btnResetPass.onclick = async () => {
      if (confirm("¿Desea restaurar la contraseña de este usuario?")) {
        const response = await fetch(`/admin/reset-password/${admin.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: admin.id }),
        });
        if (response.ok) {
          mostrarExito2("Contraseña restaurada");
        } else {
          mostrarError2("Error al cambiar la contraseña");
        }
      }
    };

    fichaAdmin.appendChild(btnResetPass)

    filaAdmin.appendChild(fichaAdmin);

    const usuario = document.createElement("p");
    usuario.innerHTML = `<b>Usuario:</b> <span>${admin.usuario}</span>`;
    fichaAdmin.appendChild(usuario);

    const columna = document.createElement("div");
    columna.className = "columna-1-2";

    if (admin.activo == true) {
      const btnBaja = document.createElement("button");
      btnBaja.className = "btn-texto";
      btnBaja.style.setProperty("--color", "#2E3192");
      btnBaja.textContent = "Eliminar admin";
      btnBaja.onclick = async () => {
        if (admin.id == miId) {
          mostrarError2("No te puedes eliminar a ti mismo");
          return;
        }
        if (confirm("¿Eliminar definitivamente este administrador?")) {
          const response = await fetch(`/admin/eliminar-admin/${admin.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            mostrarExito2("Administrador eliminado definitivamente");
            fetchAdmins();
          } else {
            mostrarError2("Ocurrió un error al eliminar");
          }
        }
      };
      columna.appendChild(btnBaja);
    }
    filaAdmin.appendChild(columna);
    concentradoAdmins.appendChild(filaAdmin);
  });
}



fetchAdmins();
