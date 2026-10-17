# Javier Vera — Portafolio Liquid Glass

Boceto funcional en HTML, CSS y JavaScript. Navegación entre vistas con un shader WebGL procedural que dibuja una membrana de gel transparente, asimétrica y brillante, expandiéndose desde el centro de la pantalla.

## Probar localmente

Abre `index.html` en un navegador moderno. WebGL debe estar habilitado. Para evitar restricciones de archivos locales, también puedes ejecutar un servidor estático desde esta carpeta (`python3 -m http.server 8000`) y visitar `http://localhost:8000`.

## Publicar

Sustituye los archivos de la carpeta en tu repositorio de GitHub y realiza un commit. Cloudflare Pages desplegará el cambio si está conectado al repositorio.

## Antes de publicar

- Cambia `WHATSAPP_NUMBER` en `script.js` por tu número internacional, sin `+` ni espacios.
- Sustituye los SVG de ejemplo en `assets/projects/` por imágenes reales de tus proyectos.
- Añade tu CV en `assets/Javier-Vera-CV.pdf` o elimina el enlace correspondiente.

La transición es una representación visual procedural con WebGL, no una simulación física exacta ni una refracción real del DOM.
