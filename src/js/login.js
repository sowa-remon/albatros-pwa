usuario = document.getElementById('usuario');
password = document.getElementById('password');

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  if(!usuario.value || !password.value){
    showSnackbar('Por favor, ingrese su nombre de usuario y contraseña');
    return;
  }
  else{
    const formData = new FormData(document.getElementById('login-form'));

    const response = await fetch('/auth/login', {
      method: 'POST',
      body: formData,
    });
  
    const result = await response.json();
    if (response.ok) {
      showSnackbar('Inicio de sesión exitoso');
      window.location.href = result.redirect; 
    } else {
      showSnackbar('Error al iniciar sesión: ' + result.message);
    }
  }
  
});

function showSnackbar(message) {
  const snackbar = document.getElementById('snackbar-login');
  snackbar.textContent = message;
  snackbar.className = 'show';
  setTimeout(() => { snackbar.className = snackbar.className.replace('show', ''); }, 3000);
}