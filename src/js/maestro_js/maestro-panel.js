const nombreMaestro = document.getElementById("nombre-maestro");
const usuarioMaestro = document.getElementById("usuario-maestro");
const curriculum = document.getElementById("curriculum");
const editarCurriculum = document.getElementById("editar-curriculum");
const guardarCurriculum = document.getElementById("guardar-curriculum");
const cancelarCurriculum = document.getElementById("cancelar-curriculum");
const editarPass = document.getElementById("editar-password");
const guardarPass = document.getElementById("guardar-password");
const cancelarPass = document.getElementById("cancelar-password");
const passwordMaestro = document.getElementById("password-maestro");
const editarHorario = document.getElementById("editar-horario");
const btnsHorario = document.getElementById("btns-horario");
const guardarHorario = document.getElementById("guardar-horario");
const cancelarHorario = document.getElementById("cancelar-horario");

let dataUsuarioOriginal

async function fetchPerfil() {
  try {
    const response = await fetch("/auth/perfil");
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const data = await response.json();
    dataUsuarioOriginal = data.usuario
    mostrarPerfil(data.usuario);
  } catch (error) {
    console.error("Error al recuperar perfil:", error);
  }
}

function mostrarPerfil(user) {
  nombreMaestro.value = user.nombre;
  usuarioMaestro.value = user.usuario;
  if(user.curriculum){
    curriculum.value = user.curriculum;
  }
  else{
    curriculum.value = "No se ha ingresado el currículum. Presiona el botón 'Editar' para agregarlo.";
  }
}

function validarPass(pass){
    if(pass.length < 8){
        alert("La contraseña debe tener al menos 8 caracteres");
        return false;
    }
    if(pass.length > 20){
        alert("La contraseña debe tener menos de 20 caracteres");
        return false;
    }
    return true;
}

editarCurriculum.addEventListener("click", () => {
    editarCurriculum.style.display = "none";
    guardarCurriculum.style.display = "block";
    cancelarCurriculum.style.display = "block";
    if(dataUsuarioOriginal.curriculum == ""){
        curriculum.value = "";
    }
    else{
        curriculum.value = dataUsuarioOriginal.curriculum;
    }
    curriculum.removeAttribute("disabled");
    curriculum.focus();
})

cancelarCurriculum.addEventListener("click", () => {
    editarCurriculum.style.display = "block";
    guardarCurriculum.style.display = "none";
    cancelarCurriculum.style.display = "none";
    curriculum.setAttribute("disabled", true);
    mostrarPerfil(dataUsuarioOriginal)
})

guardarCurriculum.addEventListener("click", async () => {
    const response = await fetch("/maestro/actualizar-curriculum", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ curriculum: curriculum.value }),
    })
    if(response.ok){
        alert("Currículum actualizado exitosamente");
        editarCurriculum.style.display = "block";
        guardarCurriculum.style.display = "none";
        cancelarCurriculum.style.display = "none";
        fetchPerfil()
    } else{
        alert("Error al actualizar el currículum");
    }
})

editarPass.addEventListener("click", () => {
    editarPass.style.display = "none"
    guardarPass.style.display = "block"
    cancelarPass.style.display = "block"
    passwordMaestro.value = ""
    passwordMaestro.removeAttribute("disabled")
    passwordMaestro.focus()
})

cancelarPass.addEventListener("click", () => {
    editarPass.style.display = "block"
    guardarPass.style.display = "none"
    cancelarPass.style.display = "none"
    passwordMaestro.setAttribute("disabled", true)
    passwordMaestro.value = "*********"
})

guardarPass.addEventListener("click", async () => {  
    if(!validarPass(passwordMaestro.value)){
        return false
    }
    const response = await fetch("/auth/actualizar-password", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: passwordMaestro.value }),
    })
    if(response.ok){
        alert("Contraseña actualizada exitosamente");
        editarPass.style.display = "block"
        guardarPass.style.display = "none"
        cancelarPass.style.display = "none"
        fetchPerfil()
    } else{
        alert("Error al actualizar la contraseña");
    }
 })

 editarHorario.addEventListener("click", () => {
    btnsHorario.style.display = "block"
    editarHorario.style.display = "none"
 })

 cancelarHorario.addEventListener("click", () => {
    btnsHorario.style.display = "none"
    editarHorario.style.display = "block"
 })

fetchPerfil()