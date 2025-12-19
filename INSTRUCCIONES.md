# 🚀 Instrucciones Rápidas

## Para Empezar

1. **Instalar dependencias** (si no lo has hecho):
```bash
npm install
```

2. **Añadir imágenes de localizaciones**:
   - Coloca las imágenes en `public/images/locations/`
   - Nombres requeridos (según `locations.js`):
     - `tiros_libres.jpg`
     - `vestuario.jpg`
     - `cancha_principal.jpg`
     - `entrenamiento.jpg`
     - `gradas.jpg`
     - `sala_prensa.jpg`
     - `tienda.jpg`
     - `parking.jpg`

3. **Iniciar el servidor**:
```bash
npm start
# o para desarrollo con auto-reload:
npm run dev
```

4. **Abrir en el navegador**:
   - Local: `http://localhost:3000`
   - En red local: `http://TU_IP:3000`

## Integrar AdSense

1. **Banner Sticky (Footer)**:
   - Abre `public/index.html`
   - Busca el comentario `<!-- INSTRUCCIONES PARA ADSENSE: -->`
   - Reemplaza el div `#adBanner` con tu código de AdSense

2. **Publicidad Intersticial**:
   - En el mismo archivo, busca `<!-- INSTRUCCIONES PARA ADSENSE INTERSTICIAL: -->`
   - Reemplaza el contenido del div `.ad-container` con tu código de AdSense

## Añadir Nuevas Localizaciones

1. Edita `locations.js` en la raíz del proyecto
2. Añade un nuevo objeto al array:
```javascript
{ id: 9, name: "Nueva Localización", file: "nueva_imagen.jpg" }
```
3. Coloca la imagen en `public/images/locations/nueva_imagen.jpg`
4. (Opcional) Actualiza también `public/data.js` para mantener consistencia

## Desplegar

### Render.com
1. Conecta tu repositorio GitHub
2. Selecciona Node.js como entorno
3. Puerto: 3000 (o usa la variable PORT)
4. Build Command: `npm install`
5. Start Command: `npm start`

### Railway
1. Conecta tu repositorio
2. Railway detectará automáticamente Node.js
3. Añade variable de entorno `PORT` si es necesario

## Cómo Probar

1. Abre la aplicación en dos navegadores diferentes (o una ventana normal y una incógnito)
2. En el primero: Crea una partida
3. En el segundo: Únete con el código de sala
4. El host inicia la partida
5. Verifica que:
   - Los jugadores normales ven la localización
   - El impostor ve el mensaje especial
   - El botón "Finalizar Ronda" muestra el intersticial con countdown

## Notas Importantes

- ⚠️ Las partidas se pierden si el servidor se reinicia (no hay base de datos)
- 🧹 Las salas inactivas se eliminan automáticamente después de 2 horas
- 📱 La aplicación está optimizada para móviles (mobile-first)
- 🔌 Requiere WebSockets (Socket.io) - verifica que tu hosting lo soporte




