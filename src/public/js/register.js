const registerButton = document.getElementById("registerButton");

registerButton.addEventListener("click", () => {
  Swal.fire({
    text: "Su registro fue exitoso",
    allowOutsideClick: false,
    icon: "success",
    showConfirmButton: false,
    footer: '<a href="/login">Loguearme</a>',
  });
});
