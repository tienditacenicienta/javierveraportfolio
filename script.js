// CONFIGURA AQUÍ TU NÚMERO REAL ANTES DE PUBLICAR.
// Formato internacional sin +, espacios ni guiones. Ejemplo Perú: 519XXXXXXXX
const CONFIG = {
  whatsapp: "51999999999"
};

document.getElementById("year").textContent = new Date().getFullYear();

const defaultMessage = "Hola Javier, vi tu portafolio y quisiera conversar sobre un proyecto.";
const whatsappUrl = (message) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;

document.getElementById("whatsapp-link").href = whatsappUrl(defaultMessage);

const projectForm = document.getElementById("project-form");
projectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.getElementById("project-message").value.trim();
  if (!message) return;
  const fullMessage = `Hola Javier, vi tu portafolio y quiero comentarte un proyecto:\n\n${message}`;
  window.open(whatsappUrl(fullMessage), "_blank", "noopener,noreferrer");
});

// Lightbox: abrir las piezas en tamaño ampliado.
const dialog = document.getElementById("lightbox");
const preview = dialog.querySelector("img");
document.querySelectorAll("[data-project]").forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();
    const img = card.querySelector("img");
    preview.src = img.currentSrc || img.src;
    preview.alt = img.alt;
    if (dialog.showModal) dialog.showModal();
  });
});
dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener("close", () => { preview.src = ""; });
