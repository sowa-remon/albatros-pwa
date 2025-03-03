const regresar = document.getElementById("regresar");
const logout = document.getElementById("logout");
const listaContenidos = document.getElementById('lista-contenido-pedagogico')

regresar.addEventListener("click", () => {
  window.history.back();
});

logout.addEventListener("click", async () => {
  if (confirm("¿Está seguro de que quiere cerrar sesión?")) {
    const response = await fetch("/auth/logout");
    if (response.ok) {
      alert("Sesión cerrada exitosamente");
      window.location.href = "/";
    } else {
      alert("Error al cerrar sesión");
    }
  }
});

async function fetchContenido() {
  try {
    const response = await fetch("/admin/lista-contenidos");
    if (!response.ok) {
      throw new Error(
        "Error en la solicitud del contenido: " + response.status
      );
    }
    const contenidos = await response.json();
    mostrarContenidos(contenidos);
  } catch (error) {
    console.error("Error: ", error);
  }
}

function mostrarContenidos(contenidos){
    listaContenidos.innerHTML = ''

    contenidos.forEach((contenido) => {
        const contenidoCard = document.createElement('div')
         contenidoCard.className= 'contenido-card'

        const cardEncabezado = document.createElement('div')
        cardEncabezado.className ='card-encabezado'
        
        const tituloCard = document.createElement('p')
        tituloCard.className = 'titulo-card'
        tituloCard.innerHTML  = `<span>${contenido.titulo}</span>`;
        cardEncabezado.appendChild(tituloCard)

        const cardCuerpo = document.createElement('div')
        cardCuerpo.className= 'card-cuerpo'
        let inputContenido = document.createElement('textarea')
        inputContenido.setAttribute("rows", "7")
        inputContenido.setAttribute('disabled', true)
        inputContenido.value=contenido.objetivos
        cardCuerpo.appendChild(inputContenido)

        const editar = document.createElement('button')
        editar.textContent = 'Editar'
        editar.className = 'btn btn-naranja'
        const cancelar = document.createElement('button')
        cancelar.textContent = 'Cancelar'
        cancelar.className = 'btn btn-naranja'
        cancelar.style.marginTop = '1rem'
        cancelar.style.display = 'none'
        const guardar = document.createElement('button')
        guardar.textContent = 'Guardar cambios'
        guardar.className = 'btn btn-marino'
        guardar.style.marginTop = '1rem'
        guardar.style.display = 'none' 
        
        editar.onclick = () => {
            inputContenido.removeAttribute('disabled')
            inputContenido.focus()
            editar.style.display = 'none'
            cancelar.style.display = 'block'
            guardar.style.display = 'block'
        }

        cancelar.onclick = () => {
            inputContenido.value = contenido.objetivos
            inputContenido.setAttribute('disabled', true)
            cancelar.style.display = 'none'
            guardar.style.display = 'none'
            editar.style.display = 'block'
        }

        guardar.onclick = async () => {
            const response = await fetch(`/admin/actualizarContenido/${contenido.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id: contenido.id, objetivos: inputContenido.value}),
            })
            if(response.ok){
                alert('Se actualizo el contenido')
                cancelar.style.display = 'none'
                guardar.style.display = 'none'
                editar.style.display = 'block'
                fetchContenido()
            } else {
                alert("Error al intentar cambiar el contenido")
            }
        }

        const btnsDobles = document.createElement('div')
        btnsDobles.className = 'btns-doble'
        btnsDobles.appendChild(cancelar)
        btnsDobles.appendChild(editar)
        btnsDobles.appendChild(guardar)
        cardCuerpo.appendChild(btnsDobles)

        contenidoCard.appendChild(cardEncabezado)
        contenidoCard.appendChild(cardCuerpo)
        

        listaContenidos.appendChild(contenidoCard)
    });
}

fetchContenido()
