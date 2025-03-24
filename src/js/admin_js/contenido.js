const listaContenidos = document.getElementById('lista-contenido-pedagogico')
const videoModal = document.getElementById('video-modal')
const closeVideo = document.getElementById('closeVideo')
const cancelarVideo = document.getElementById('cancelarVideo')
const guardarVideo = document.getElementById('guardarVideo')

const meError = document.getElementById("mensaje-error");
const meExito = document.getElementById("mensaje-exito");

// ! mensaje de error
function mostrarError(mensaje) {
  meError.textContent = mensaje;
  meError.style.display = "block";

  setTimeout(() => {
    meError.style.display = "none";
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

closeVideo.onclick = () =>{
  videoModal.style.display = 'none'
}

cancelarVideo.onclick = () =>{
  videoModal.style.display = 'none'
}

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

        const filaAcolumna = document.createElement('div')
        filaAcolumna.style.display = 'flex'

        const videoContenido = document.createElement('video')
        const sourceVideo = document.createElement('source')
        sourceVideo.src = contenido.video
        videoContenido.appendChild(sourceVideo)
        videoContenido.className = 'video-contenido'
        videoContenido.autoplay = true
        videoContenido.loop = true
        videoContenido.muted = true; 

        const btnVideo = document.createElement('button')
        btnVideo.className = 'btn-texto'
        btnVideo.textContent = 'Cambiar video'
        
        btnVideo.style.setProperty("--color", "#EF8122");

        btnVideo.onclick = async () =>{
          videoModal.style.display = 'block'
          
        guardarVideo.onclick=(e)=>{
          guardarVideo.setAttribute('disabled', true)
          e.preventDefault()
          modalVideo(contenido.id)
        }

        }

        filaAcolumna.appendChild(videoContenido)
        filaAcolumna.appendChild(btnVideo)

        let inputContenido = document.createElement('textarea')
        inputContenido.setAttribute("rows", "7")
        inputContenido.setAttribute('disabled', true)
        inputContenido.value=contenido.objetivos

        cardCuerpo.appendChild(filaAcolumna)
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
                mostrarExito('Se actualizó el contenido')
                cancelar.style.display = 'none'
                guardar.style.display = 'none'
                editar.style.display = 'block'
                fetchContenido()
            } else {
                mostrarError("Error al intentar cambiar el contenido")
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

async function modalVideo(id) {
  const videoContenido = document.getElementById('videoContenido')
        
  if(!videoContenido.value){
    mostrarError('Sube el video por favor')
    
    guardarVideo.removeAttribute('disabled')
    return
  }
  try{
     // Crear un objeto FormData para enviar el archivo y el ID
     const formData = new FormData();
     formData.append('video', videoContenido.files[0]); // Agregar el archivo
     formData.append('id', id); // Agregar el ID del contenido
 
    
    const response = await fetch("/admin/subir-video-contenido", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      mostrarExito("Video publicado");

      guardarVideo.removeAttribute("disabled");
      fetchContenido();
      videoModal.style.display = 'none'
    } else {
      mostrarError("Error al publicar el anuncio");

      guardarVideo.removeAttribute('disabled')
    }
  }
  catch{
    mostrarError('error')
  }
}

fetchContenido()
