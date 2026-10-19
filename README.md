# Javier Vera — Portafolio editorial interactivo

Maqueta en HTML, CSS y JavaScript vanilla inspirada en el storytelling de páginas de lanzamiento de producto: una portada con impacto visual, proyectos como protagonistas, un capítulo de enfoque y contacto. Combina scroll vertical con transiciones entre capítulos desde el menú.

## Archivos
- `index.html`: estructura y textos.
- `styles.css`: diseño responsive, composición, animaciones y transiciones.
- `script.js`: navegación entre capítulos, detalle de proyectos y formulario que prepara un mensaje de WhatsApp.
- `assets/projects/`: portadas SVG conceptuales de muestra.

## Antes de publicar
1. Abre `script.js` y reemplaza `51999999999` por tu número de WhatsApp en formato internacional, sin el signo `+` ni espacios.
2. Sustituye las seis portadas SVG de `assets/projects/` por imágenes de tus proyectos reales. Las actuales son muestras conceptuales, no trabajos reales.
3. Edita los textos, categorías y casos de estudio en `index.html` y `script.js`.

## Publicar en GitHub + Cloudflare Pages
Sube el contenido de esta carpeta a la raíz del repositorio conectado a Cloudflare Pages. No requiere instalar dependencias ni compilar. Puedes probar abriendo `index.html` localmente o con Live Server.

## Formulario
El formulario no guarda datos ni envía correos: arma el mensaje y abre WhatsApp para que el visitante lo envíe manualmente.
