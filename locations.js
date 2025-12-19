// Configuración de localizaciones de baloncesto organizadas por grupos
// Para añadir nuevas localizaciones, agrega un objeto al array del grupo correspondiente

const locationGroups = {
  "leyendas": {
    name: "Leyendas y Nostalgia",
    description: "Nivel: Cultura General",
    locations: [
      { id: 1, name: "Michael Jordan" },
      { id: 2, name: "Chicago Bulls" },
      { id: 3, name: "Shaquille O'Neal" },
      { id: 4, name: "Space Jam" },
      { id: 5, name: "Kobe Bryant" },
      { id: 6, name: "Magic Johnson" },
      { id: 7, name: "Pau Gasol" },
      { id: 8, name: "Harlem Globetrotters" },
      { id: 9, name: "Dennis Rodman" },
      { id: 10, name: "Dream Team" },
      { id: 11, name: "Kareem Abdul-Jabbar" },
      { id: 12, name: "Air Jordan" },
      { id: 13, name: "Larry Bird" },
      { id: 14, name: "Fernando Martín" },
      { id: 15, name: "Concurso de Mates" },
      { id: 16, name: "Animadoras / Cheerleaders" },
      { id: 17, name: "El Entrenador gritando" },
      { id: 18, name: "Mascota del equipo" },
      { id: 19, name: "All-Star" },
      { id: 20, name: "Medalla de Oro Olímpica" }
    ]
  },
  "actual": {
    name: "Baloncesto Actual",
    description: "Nivel: Lo que sale en el Telediario",
    locations: [
      { id: 21, name: "LeBron James" },
      { id: 22, name: "Stephen Curry" },
      { id: 23, name: "Luka Dončić" },
      { id: 24, name: "Un Triple" },
      { id: 25, name: "El Árbitro" },
      { id: 26, name: "El VAR / Repetición" },
      { id: 27, name: "Tiempo Muerto" },
      { id: 28, name: "Tiros Libres" },
      { id: 29, name: "Un Tapón" },
      { id: 30, name: "Una Asistencia" },
      { id: 31, name: "El Banquillo" },
      { id: 32, name: "La Prórroga" },
      { id: 33, name: "Falta Personal" },
      { id: 34, name: "Los Angeles Lakers" },
      { id: 35, name: "Victor Wembanyama" },
      { id: 36, name: "Ricky Rubio" },
      { id: 37, name: "Giannis Antetokounmpo" },
      { id: 38, name: "La Bocina final" },
      { id: 39, name: "Mandar a callar al público" },
      { id: 40, name: "Hacer un Gestito tras meter canasta" }
    ]
  },
  "cancha": {
    name: "Elementos de la Cancha",
    description: "Nivel: Cosas Físicas",
    locations: [
      { id: 41, name: "El Balón" },
      { id: 42, name: "La Canasta / El Aro" },
      { id: 43, name: "La Red" },
      { id: 44, name: "El Tablero" },
      { id: 45, name: "El Silbato" },
      { id: 46, name: "Las Zapatillas" },
      { id: 47, name: "El Parquet" },
      { id: 48, name: "La Grada" },
      { id: 49, name: "El Vestuario" },
      { id: 50, name: "La Camiseta de tirantes" },
      { id: 51, name: "El Marcador" },
      { id: 52, name: "La Pizarra del entrenador" },
      { id: 53, name: "La Botella de agua / Gatorade" },
      { id: 54, name: "La Toalla" },
      { id: 55, name: "El Micrófono" },
      { id: 56, name: "La Copa / El Trofeo" },
      { id: 57, name: "La Linea de banda" },
      { id: 58, name: "Cámara de TV" },
      { id: 59, name: "Vendedor de perritos/comida" },
      { id: 60, name: "La Mopa" }
    ]
  }
};

module.exports = locationGroups;
