# Javier Vera — Portfolio Space Black

Portafolio de una sola página con narrativa vertical cinematográfica, inspirado en la forma en que Apple presenta visualmente el iPad Pro, sin copiar su diseño literal.

## Incluye
- Dirección de arte Space Black con acentos azul eléctrico.
- Hero con composición visual en capas y perspectiva.
- Scroll vertical con revelados progresivos y secciones editoriales amplias.
- Proyectos interactivos con modal de detalle.
- Menú flotante, microinteracciones y ajustes para dispositivos móviles.
- Formulario que prepara el mensaje y abre WhatsApp.

## Antes de publicar
1. Sustituye las imágenes SVG de `assets/projects/` por capturas o mockups de tus campañas reales. Puedes conservar los nombres de archivo o actualizar las rutas en `index.html` y `script.js`.
2. En `script.js`, reemplaza `51999999999` por tu número de WhatsApp en formato internacional, sin `+` ni espacios.
3. Ajusta los textos de cada proyecto a trabajos que realmente hayas realizado. No publiques resultados, clientes o métricas que no puedas respaldar.
4. Sube el contenido de esta carpeta a la raíz del repositorio conectado a Cloudflare Pages.

No requiere build ni dependencias de JavaScript. Las tipografías se cargan desde Google Fonts; si el visitante no tiene conexión, se usan fuentes de sistema como respaldo.


Se agregó la sección “Sobre mí” con métricas profesionales y una muestra tipográfica de marcas como referencia. Antes de publicar, verifica que todas las marcas mostradas correspondan a proyectos en los que participaste y reemplaza los logotipos tipográficos por los archivos oficiales que tengas autorización de usar.


## Escena iPad + reels (integración)
- La sección `#work` incorpora un iPad central con 5 proyectos que avanzan continuamente con el scroll vertical.
- Los dos laterales están dentro de marcos de iPhone. Haz clic en un lateral para ampliarlo al centro; el iPad se desplaza hacia ese lado. Haz clic otra vez, pulsa “VOLVER A LOS PROYECTOS” o presiona Escape para regresar.
- Las piezas actuales son SVG conceptuales. Sustituye los archivos en `assets/projects/` o cambia las rutas en `index.html` para usar tus imágenes reales.
- Añade los videos `assets/reels/reel-01.mp4` y `assets/reels/reel-02.mp4` cuando estén listos. Mientras no existan, se muestran placeholders.
- El comportamiento de la escena está en `ipad-experience.js` y sus estilos al final de `styles.css`.
- La demo mantiene el resto de secciones y textos del ZIP que compartiste.


## Ajuste de ubicación (versión corregida)
La experiencia iPad/iPhone ahora sustituye el collage de tarjetas del inicio (hero). La sección “Campañas y proyectos” se restauró desde el ZIP original descargado del repositorio y no contiene la experiencia iPad. Los archivos de reels continúan siendo opcionales; mientras no existan, se muestran las composiciones de reserva.
