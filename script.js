// Configura tus datos reales antes de publicar.
const CONFIG = { whatsapp: "51999999999", email: "hola@javiervera.design" };
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("whatsapp-link").href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Hola Javier, vi tu portafolio y quisiera conversar sobre un proyecto.")}`;
document.getElementById("email-link").href = `mailto:${CONFIG.email}`;
const dialog = document.getElementById("lightbox"), preview = dialog.querySelector("img");
document.querySelectorAll("[data-project]").forEach((card) => card.addEventListener("click", (event) => {
  event.preventDefault(); const img = card.querySelector("img"); preview.src = img.currentSrc || img.src; preview.alt = img.alt;
  if (dialog.showModal) dialog.showModal();
}));
dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener("close", () => { preview.src = ""; });