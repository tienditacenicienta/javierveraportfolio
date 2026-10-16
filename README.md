# Javier Vera® — Portafolio web

Sitio estático, responsive e interactivo. No necesita frameworks, instalación ni servidor propio.

## Archivos
- `index.html`: estructura y contenido.
- `styles.css`: identidad visual y adaptación a móvil.
- `script.js`: filtros, navegación móvil, progreso de lectura y modales.
- `JAVIER-VERA-CV.pdf`: CV descargable.

## Antes de publicar
1. Abre `index.html`.
2. Busca `TU_CORREO@ejemplo.com` y reemplázalo por tu correo real.
3. Revisa los proyectos de muestra: los bloques gráficos actuales son composiciones conceptuales hechas en CSS. Reemplázalos por imágenes de tus proyectos finales cuando quieras.
4. Verifica que los nombres, colaboraciones y licencias estén descritos de forma precisa.

## Publicar con GitHub + Cloudflare Pages
1. Crea un repositorio nuevo en GitHub, por ejemplo `javier-vera-portfolio`.
2. Sube **todos** los archivos de esta carpeta a la raíz del repositorio.
3. En Cloudflare, entra a **Workers & Pages → Create → Pages → Connect to Git**.
4. Selecciona el repositorio.
5. Configura:
   - **Framework preset:** None
   - **Build command:** dejar vacío
   - **Build output directory:** `/` o `.` según lo que muestre la interfaz
6. Pulsa **Save and Deploy**.

Al ser una web estática, no requiere Node.js ni comandos de compilación.

## Personalización rápida
- Colores principales: variables al inicio de `styles.css`.
- Textos y marcas: `index.html`.
- Filtros y comportamiento: `script.js`.
