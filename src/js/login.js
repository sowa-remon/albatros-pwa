const usuario = document.getElementById("usuario");
const password = document.getElementById("password");
const loader = document.getElementById("loader");
const regresar = document.getElementById("regresar");
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loader.style.display = "block";
    if (!usuario.value || !password.value) {
      showSnackbar("Por favor, ingrese su nombre de usuario y contraseña");
      return;
    } else {
      const formData = new FormData(document.getElementById("login-form"));
      const response = await fetch("/auth/login", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        showSnackbar("Inicio de sesión exitoso");
        window.location.href = result.redirect;
        loader.style.display = "none";
      } else {
        showSnackbar("Error al iniciar sesión: " + result.message);
        loader.style.display = "none";
      }
    }
  });

function showSnackbar(message) {
  const snackbar = document.getElementById("snackbar-login");
  snackbar.textContent = message;
  snackbar.className = "show";
  setTimeout(() => {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}

regresar.addEventListener("click", () => {
  window.location.href = "/";
});


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service_worker.js', {scope: '/'})
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenir que el navegador muestre el prompt de instalación
  e.preventDefault();
  // Guardar el evento para activarlo más tarde
  deferredPrompt = e;
  // Mostrar el botón de instalación
  const installButton = document.getElementById('installButton');
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    // Mostrar el prompt de instalación
    deferredPrompt.prompt();
    // Esperar la elección del usuario
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Limpiar la referencia al prompt
      deferredPrompt = null;
    });
  });
});