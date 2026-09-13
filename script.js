document.addEventListener("DOMContentLoaded", () => {
  const downloadBtn = document.getElementById("download-button");
  const toast = document.getElementById("toast");

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      // Affichage fluide de la notification toast (sans alert bloquant)
      if (toast) {
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
        }, 3200);
      }
    });
  }
});