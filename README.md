# Javier Vera — Portafolio interactivo

Una experiencia web experimental que convierte el portafolio en un pequeño laboratorio creativo. El usuario selecciona un reto y descubre un enfoque de solución, explora casos visuales por intención y puede iniciar una conversación desde la selección.

## Antes de publicar
- Cambia `TU_CORREO@ejemplo.com` por tu correo real en `index.html` y `script.js`.
- Los cuatro casos son composiciones tipográficas demostrativas en CSS, no imágenes de proyectos finales. Reemplázalas o presenta cada una claramente como caso conceptual.
- Verifica los nombres de marcas y las relaciones profesionales antes de hacer pública la página.
- El CV no se ha incorporado para evitar que la experiencia se sienta como un CV tradicional; puedes añadirlo como enlace secundario si lo deseas.

## GitHub + Cloudflare Pages
1. Crea un repositorio GitHub y sube `index.html`, `styles.css`, `script.js` y `README.md` a la raíz.
2. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**.
3. Elige el repositorio. Framework preset: **None**. Build command: vacío. Output directory: `/` o `.` según la interfaz.
4. Despliega. No necesita dependencias ni compilación.

## Interacciones incluidas
- Selector de retos con respuestas que cambian al instante.
- Filtros de casos por intención.
- Ventana modal de cada caso con explicación.
- Menú desplegable, cursor personalizado en desktop y animación de marcas.
- Diseño responsive y soporte de movimiento reducido.
