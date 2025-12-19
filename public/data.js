// Configuración de localizaciones de baloncesto
// Para añadir nuevas localizaciones, simplemente agrega un objeto al array
// y coloca la imagen correspondiente en /public/images/locations/

const locations = [
  { id: 1, name: "Tiros Libres", file: "tiros_libres.svg" },
  { id: 2, name: "Vestuario", file: "vestuario.svg" },
  { id: 3, name: "Cancha Principal", file: "cancha_principal.svg" },
  { id: 4, name: "Entrenamiento", file: "entrenamiento.svg" },
  { id: 5, name: "Gradas", file: "gradas.svg" },
  { id: 6, name: "Sala de Prensa", file: "sala_prensa.svg" },
  { id: 7, name: "Tienda de Merchandising", file: "tienda.svg" },
  { id: 8, name: "Parking", file: "parking.svg" }
];

// Exportar para uso en Node.js (server.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = locations;
}

