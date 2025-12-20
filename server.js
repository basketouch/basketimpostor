const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

// Configuración de Socket.io para producción
const io = socketIo(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling']
});

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON
app.use(express.json());

// Almacenamiento en memoria de las partidas
const games = {};

// Sistema de estadísticas
const statsFile = path.join(__dirname, 'stats.json');

// Cargar estadísticas desde archivo
let stats = {
  totalGames: 0,
  totalPlayers: 0,
  totalRounds: 0,
  totalClicksPubli: 0,
  clicksPubliBanner: 0,
  clicksPubliInterstitial: 0,
  gamesByTheme: {
    leyendas: 0,
    actual: 0,
    cancha: 0
  },
  lastReset: new Date().toISOString()
};

// Cargar estadísticas si el archivo existe
if (fs.existsSync(statsFile)) {
  try {
    const savedStats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    stats = { ...stats, ...savedStats };
  } catch (err) {
    console.log('Error cargando estadísticas, usando valores por defecto');
  }
}

// Función para guardar estadísticas
function saveStats() {
  try {
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
  } catch (err) {
    console.error('Error guardando estadísticas:', err);
  }
}

// Generar código de sala aleatorio (4 caracteres alfanuméricos)
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Garbage Collection: Eliminar salas inactivas (más de 2 horas)
setInterval(() => {
  const now = Date.now();
  const twoHours = 2 * 60 * 60 * 1000;
  
  Object.keys(games).forEach(roomCode => {
    if (games[roomCode].lastActivity && (now - games[roomCode].lastActivity > twoHours)) {
      console.log(`Eliminando sala inactiva: ${roomCode}`);
      delete games[roomCode];
    }
  });
}, 60 * 60 * 1000); // Ejecutar cada hora

// Socket.io - Gestión de conexiones
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Crear nueva partida
  socket.on('createGame', (playerName) => {
    let roomCode = generateRoomCode();
    // Asegurar que el código no existe
    while (games[roomCode]) {
      roomCode = generateRoomCode();
    }

    const game = {
      hostId: socket.id,
      status: 'LOBBY',
      currentLocation: null,
      impostorId: null,
      lastImpostorId: null, // Guardar el último impostor para evitar repetición
      selectedGroup: null, // Grupo seleccionado (leyendas, actual, cancha)
      players: [{
        id: socket.id,
        name: playerName || 'Jugador',
        avatar: ''
      }],
      lastActivity: Date.now()
    };

    games[roomCode] = game;
    socket.join(roomCode);
    socket.emit('gameCreated', { roomCode, isHost: true });
    socket.emit('updatePlayerList', game.players);
    
    // Estadísticas
    stats.totalGames++;
    saveStats();
    
    console.log(`[CREATE] Partida creada: ${roomCode} por ${socket.id}`);
    console.log(`[CREATE] Total de salas activas: ${Object.keys(games).length}`);
  });

  // Unirse a partida existente
  socket.on('joinGame', ({ roomCode, playerName }) => {
    console.log(`Intento de unión a sala ${roomCode} por ${socket.id}`);
    console.log('Salas activas:', Object.keys(games));
    
    // Normalizar el código de sala (mayúsculas, sin espacios)
    const normalizedRoomCode = String(roomCode).trim().toUpperCase();
    
    if (!games[normalizedRoomCode]) {
      console.log(`Sala ${normalizedRoomCode} no encontrada. Salas disponibles:`, Object.keys(games));
      socket.emit('joinError', { message: 'Sala no encontrada' });
      return;
    }

    const game = games[normalizedRoomCode];
    roomCode = normalizedRoomCode;
    
    if (game.status !== 'LOBBY') {
      socket.emit('joinError', { message: 'La partida ya ha comenzado' });
      return;
    }

    // Verificar si el jugador ya está en la sala
    const existingPlayer = game.players.find(p => p.id === socket.id);
    if (existingPlayer) {
      socket.emit('gameJoined', { roomCode, isHost: socket.id === game.hostId });
      socket.emit('updatePlayerList', game.players);
      return;
    }

    game.players.push({
      id: socket.id,
      name: playerName || 'Jugador',
      avatar: ''
    });

    game.lastActivity = Date.now();
    socket.join(roomCode);
    socket.emit('gameJoined', { roomCode, isHost: socket.id === game.hostId });
    
    // Notificar a todos los jugadores de la actualización
    io.to(roomCode).emit('updatePlayerList', game.players);
    
    // Estadísticas
    stats.totalPlayers++;
    saveStats();
    
    console.log(`${socket.id} se unió a la sala ${roomCode}`);
  });

  // Eliminar el handler de rejoinGame ya que está causando problemas
  // La reconexión automática se manejará con joinGame normal

  // Seleccionar grupo de localizaciones (solo el host)
  socket.on('selectGroup', ({ roomCode, groupKey }) => {
    const game = games[roomCode];
    
    if (!game || game.hostId !== socket.id) {
      socket.emit('error', { message: 'No tienes permisos' });
      return;
    }

    const locationGroups = require('./locations.js');
    if (!locationGroups[groupKey]) {
      socket.emit('error', { message: 'Grupo no válido' });
      return;
    }

    game.selectedGroup = groupKey;
    game.lastActivity = Date.now();
    
    // Estadísticas
    if (stats.gamesByTheme[groupKey] !== undefined) {
      stats.gamesByTheme[groupKey]++;
      saveStats();
    }
    
    // Notificar a todos los jugadores
    io.to(roomCode).emit('groupSelected', { groupKey, groupName: locationGroups[groupKey].name });
    console.log(`Grupo seleccionado en sala ${roomCode}: ${groupKey}`);
  });

  // Iniciar partida (solo el host)
  socket.on('startGame', ({ roomCode }) => {
    const game = games[roomCode];
    
    if (!game || game.hostId !== socket.id) {
      socket.emit('error', { message: 'No tienes permisos para iniciar la partida' });
      return;
    }

    if (game.players.length < 3) {
      socket.emit('error', { message: 'Se necesitan al menos 3 jugadores para empezar' });
      return;
    }

    if (!game.selectedGroup) {
      socket.emit('error', { message: 'Debes seleccionar un grupo primero' });
      return;
    }

    // Cargar grupos de localizaciones
    const locationGroups = require('./locations.js');
    const locations = locationGroups[game.selectedGroup].locations;
    
    // Seleccionar localización aleatoria del grupo seleccionado
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    game.currentLocation = randomLocation.id;
    
    // Seleccionar impostor aleatorio (evitando que sea el mismo de la ronda anterior)
    let availablePlayers = game.players;
    
    // Si hay más de 1 jugador y hubo un impostor anterior, excluirlo
    if (game.players.length > 1 && game.lastImpostorId) {
      availablePlayers = game.players.filter(player => player.id !== game.lastImpostorId);
      // Si solo queda 1 jugador disponible, usar todos (para evitar problemas)
      if (availablePlayers.length === 0) {
        availablePlayers = game.players;
      }
    }
    
    const randomPlayerIndex = Math.floor(Math.random() * availablePlayers.length);
    game.impostorId = availablePlayers[randomPlayerIndex].id;
    game.lastImpostorId = game.impostorId; // Guardar para la próxima ronda
    
    game.status = 'PLAYING';
    game.lastActivity = Date.now();

    // Enviar información a cada jugador según su rol
    game.players.forEach(player => {
      const isImpostor = player.id === game.impostorId;
      io.to(player.id).emit('gameStarted', {
        isImpostor,
        location: isImpostor ? null : randomLocation
      });
    });

    io.to(roomCode).emit('gameStateChanged', { status: 'PLAYING' });
    
    // Estadísticas
    stats.totalRounds++;
    saveStats();
    
    console.log(`Partida iniciada en sala ${roomCode}`);
  });

  // Finalizar ronda / Volver al lobby
  socket.on('endRound', ({ roomCode }) => {
    const game = games[roomCode];
    
    if (!game || game.hostId !== socket.id) {
      socket.emit('error', { message: 'No tienes permisos' });
      return;
    }

    // Obtener información del impostor antes de resetear
    let impostorInfo = null;
    if (game.impostorId) {
      const impostor = game.players.find(p => p.id === game.impostorId);
      if (impostor) {
        impostorInfo = {
          id: impostor.id,
          name: impostor.name
        };
      }
    }

    game.status = 'LOBBY';
    game.currentLocation = null;
    game.impostorId = null;
    game.lastActivity = Date.now();

    // Enviar información del impostor a todos los jugadores
    if (impostorInfo) {
      io.to(roomCode).emit('roundEnded', { impostor: impostorInfo });
    }

    io.to(roomCode).emit('gameStateChanged', { status: 'LOBBY' });
    io.to(roomCode).emit('updatePlayerList', game.players);
    console.log(`Ronda finalizada en sala ${roomCode}. Impostor: ${impostorInfo ? impostorInfo.name : 'N/A'}`);
  });

  // Manejo de desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
    
    // Buscar y eliminar jugador de todas las salas
    Object.keys(games).forEach(roomCode => {
      const game = games[roomCode];
      const playerIndex = game.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        const playerName = game.players[playerIndex].name;
        game.players.splice(playerIndex, 1);
        game.lastActivity = Date.now();
        
        // Si era el host, asignar nuevo host o marcar para eliminación diferida
        if (game.hostId === socket.id) {
          if (game.players.length > 0) {
            game.hostId = game.players[0].id;
            // Notificar cambio de host
            io.to(roomCode).emit('hostChanged', { newHostId: game.hostId });
          } else {
            // Si no hay jugadores, marcar para eliminación después de 30 segundos
            // Esto da tiempo para reconexiones
            game.markedForDeletion = true;
            game.deletionTime = Date.now() + 30000; // 30 segundos
            console.log(`Sala ${roomCode} marcada para eliminación (host desconectado, sin jugadores)`);
          }
        }
        
        // Si la sala quedó vacía, marcar para eliminación diferida
        if (game.players.length === 0 && !game.markedForDeletion) {
          game.markedForDeletion = true;
          game.deletionTime = Date.now() + 30000; // 30 segundos
          console.log(`Sala ${roomCode} marcada para eliminación (sin jugadores)`);
        }
        
        // Notificar a los demás jugadores
        if (game.players.length > 0) {
          io.to(roomCode).emit('updatePlayerList', game.players);
        }
      }
    });
  });

  // Permitir reconexión a sala existente
  socket.on('rejoinGame', ({ roomCode, playerName }) => {
    console.log(`Intento de reconexión a sala ${roomCode} por ${socket.id}`);
    
    if (!games[roomCode]) {
      socket.emit('joinError', { message: 'Sala no encontrada' });
      return;
    }

    const game = games[roomCode];
    
    // Si la sala estaba marcada para eliminación, cancelarla
    if (game.markedForDeletion) {
      game.markedForDeletion = false;
      game.deletionTime = null;
      console.log(`Sala ${roomCode} ya no será eliminada (jugador reconectado)`);
    }

    // Verificar si el jugador ya existe (por nombre, no por socket.id)
    const existingPlayer = game.players.find(p => p.name === playerName);
    
    if (existingPlayer) {
      // Actualizar el socket.id del jugador existente
      const wasHost = game.hostId === existingPlayer.id;
      existingPlayer.id = socket.id;
      
      // Si era el host, actualizar el hostId
      if (wasHost) {
        game.hostId = socket.id;
      }
    } else {
      // Añadir como nuevo jugador
      game.players.push({
        id: socket.id,
        name: playerName || 'Jugador',
        avatar: ''
      });
    }

    game.lastActivity = Date.now();
    socket.join(roomCode);
    
    const isHostRejoin = socket.id === game.hostId;
    socket.emit('gameJoined', { roomCode, isHost: isHostRejoin });
    io.to(roomCode).emit('updatePlayerList', game.players);
    
    console.log(`${socket.id} se reconectó a la sala ${roomCode}`);
  });
});

// API para tracking de clicks en publicidad
app.post('/api/track', (req, res) => {
  const { type } = req.body; // 'banner' o 'interstitial'
  
  if (type === 'banner') {
    stats.totalClicksPubli++;
    stats.clicksPubliBanner++;
  } else if (type === 'interstitial') {
    stats.totalClicksPubli++;
    stats.clicksPubliInterstitial++;
  }
  
  saveStats();
  res.json({ success: true });
});

// Panel de Admin (ruta oculta)
app.get('/admin-7x9k2m4p-basket-2024', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API para obtener estadísticas
app.get('/api/stats', (req, res) => {
  // Estadísticas en tiempo real
  const activeGames = Object.keys(games).length;
  const activePlayers = Object.values(games).reduce((sum, game) => sum + game.players.length, 0);
  
  res.json({
    ...stats,
    activeGames,
    activePlayers,
    timestamp: new Date().toISOString()
  });
});

// API para resetear estadísticas
app.post('/api/stats/reset', (req, res) => {
  stats = {
    totalGames: 0,
    totalPlayers: 0,
    totalRounds: 0,
    totalClicksPubli: 0,
    clicksPubliBanner: 0,
    clicksPubliInterstitial: 0,
    gamesByTheme: {
      leyendas: 0,
      actual: 0,
      cancha: 0
    },
    lastReset: new Date().toISOString()
  };
  saveStats();
  res.json({ success: true, message: 'Estadísticas reseteadas' });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Entorno: ${NODE_ENV}`);
  if (NODE_ENV === 'production') {
    console.log('Modo producción activado');
  }
});

