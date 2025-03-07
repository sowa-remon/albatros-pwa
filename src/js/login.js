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