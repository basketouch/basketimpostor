# 🏀 Basket Impostor

Aplicación web multijugador en tiempo real basada en la mecánica del juego de mesa "Spyfall", adaptada a la temática de Baloncesto.

## 🚀 Características

- **Multijugador en tiempo real** usando WebSockets (Socket.io)
- **Sin base de datos**: Todo se almacena en memoria del servidor
- **Mobile First**: Diseño optimizado para dispositivos móviles
- **Sistema de salas**: Códigos de 4 caracteres para unirse a partidas
- **Publicidad integrada**: Preparado para AdSense (banner sticky e intersticial)

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

## 🔧 Instalación

1. Clona o descarga el repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Añade las imágenes de localizaciones en la carpeta `public/images/locations/`

Las imágenes deben tener los nombres especificados en `public/data.js`:
- `tiros_libres.jpg`
- `vestuario.jpg`
- `cancha_principal.jpg`
- `entrenamiento.jpg`
- `gradas.jpg`
- `sala_prensa.jpg`
- `tienda.jpg`
- `parking.jpg`

## ▶️ Ejecución

### Modo Desarrollo (con auto-reload):

```bash
npm run dev
```

### Modo Producción:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
BasketImpostor/
├── server.js              # Servidor Express + Socket.io
├── package.json           # Dependencias del proyecto
├── public/
│   ├── index.html         # Página principal (SPA)
│   ├── styles.css         # Estilos CSS
│   ├── app.js             # Lógica del cliente
│   ├── data.js            # Configuración de localizaciones
│   └── images/
│       └── locations/     # Imágenes de las localizaciones
└── README.md
```

## 🎮 Cómo Jugar

1. **Crear o Unirse a una Partida**:
   - Ingresa tu nombre
   - Crea una nueva partida o únete con un código de 4 caracteres

2. **Lobby**:
   - Comparte el código de sala con tus amigos
   - El host puede iniciar la partida cuando haya al menos 2 jugadores

3. **Juego**:
   - Los jugadores normales ven la localización (imagen y nombre)
   - El impostor NO ve la localización
   - Haz preguntas para encontrar al impostor o disimula si eres el impostor

4. **Finalizar Ronda**:
   - El host puede finalizar la ronda
   - Se mostrará publicidad intersticial antes de volver al lobby

## ⚙️ Configuración de Localizaciones

Para añadir nuevas localizaciones, edita el archivo `locations.js` en la raíz del proyecto:

```javascript
const locations = [
  { id: 1, name: "Tiros Libres", file: "tiros_libres.jpg" },
  { id: 2, name: "Nueva Localización", file: "nueva_localizacion.jpg" },
  // ...
];
```

Luego añade la imagen correspondiente en `public/images/locations/` con el nombre especificado.

**Nota**: El archivo `public/data.js` es una copia de referencia para el cliente. Si modificas `locations.js`, actualiza también `public/data.js` para mantener consistencia.

## 📱 Integración de Publicidad (AdSense)

Para integrar Google AdSense:

1. **Banner Sticky (Footer)**:
   Edita `public/index.html` y reemplaza el contenido del div `#adBanner` con tu código de AdSense.

2. **Publicidad Intersticial**:
   Edita `public/index.html` y reemplaza el contenido del div `.ad-container` dentro de `#adInterstitial` con tu código de AdSense.

## 🚢 Despliegue

La aplicación está lista para desplegarse en plataformas como:
- **Render**: Soporta WebSockets y Node.js
- **Railway**: Fácil despliegue con Git
- **Fly.io**: Buena opción para aplicaciones Node.js

### Variables de Entorno

- `PORT`: Puerto del servidor (por defecto: 3000)

## 🧹 Garbage Collection

El servidor automáticamente elimina salas inactivas (más de 2 horas sin actividad) para liberar memoria RAM.

## 📝 Notas Técnicas

- **Stateless**: No se usa base de datos. Si el servidor se reinicia, las partidas activas se pierden.
- **WebSockets**: Comunicación en tiempo real mediante Socket.io
- **Mobile First**: Diseño responsive optimizado para móviles

## 🐛 Solución de Problemas

- **Error de conexión**: Verifica que el servidor esté corriendo y que el puerto no esté en uso
- **Imágenes no cargan**: Asegúrate de que las imágenes estén en `public/images/locations/` con los nombres correctos
- **Socket.io no funciona**: Verifica que la versión de Node.js sea compatible (14+)

## 📄 Licencia

ISC

