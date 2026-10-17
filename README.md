# Javier Vera® — Portafolio web

Sitio estático en HTML, CSS y JavaScript. No requiere framework, dependencias ni build.

## Antes de publicar
1. En `script.js`, reemplaza `whatsapp` y `email` por tus datos reales.
2. Sustituye las 8 composiciones de muestra en `assets/proyectos/` por tus proyectos finales y actualiza las rutas `src`/`href` en `index.html`. Las imágenes SVG actuales son placeholders de diseño, no trabajos reales.
3. Incorpora los logos oficiales en `assets/logos/` y actualiza las rutas en el HTML. La lista de marcas es orientativa: confirma que cada una represente correctamente tu participación y que puedas mostrarla.
4. Coloca tu CV en `assets/Javier-Vera-CV.pdf` o modifica el enlace “Ver CV”.
5. Revisa todo en móvil y escritorio antes de publicar.

## Cambiar las imágenes
Busca los bloques `a class="project"` en `index.html`. Cambia el `src` de la imagen y el `href` del enlace para apuntar a tu archivo real. El collage es continuo, sin filtros, categorías ni descripciones por proyecto.

Usa preferentemente WebP/JPG optimizado, lado largo de 1600–2200 px y peso aproximado de 250–700 KB por pieza.

## Publicar en GitHub + Cloudflare Pages
1. Sube el contenido de esta carpeta al repositorio, dejando `index.html` en la raíz.
2. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
3. Selecciona el repositorio.
4. Framework preset: **None**. Build command: vacío. Build output directory: `/` o `.` según la interfaz.
5. Guarda y despliega. Los siguientes `git push` publicarán los cambios automáticamente.

## Contenido
- No se usan filtros ni etiquetas de categoría.
- El presupuesto se conversa según el objetivo y alcance; no hay tarifas fijas visibles.
- Verifica nombres de marcas y permisos antes de publicar.
