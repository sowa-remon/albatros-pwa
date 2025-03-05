const regresar = document.getElementById("regresar");
const logout = document.getElementById("logout");

regresar.addEventListener("click", () => {
  window.history.back();
});

logout.addEventListener("click", async () => {
  if (confirm("¿Está seguro que quiere cerrar sesión?")) {
    const response = await fetch("/auth/logout");
    if (response.ok) {
      window.location.href = "/";
    } else {
      alert("Error al cerrar sesión");
    }
  }
});
