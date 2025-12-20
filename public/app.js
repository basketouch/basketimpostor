// Conexión Socket.io
const socket = io();

// Verificar conexión
socket.on('connect', () => {
    console.log('Conectado al servidor:', socket.id);
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
});

socket.on('connect_error', (error) => {
    console.error('Error de conexión:', error);
    showError('Error de conexión con el servidor');
});

// Estado de la aplicación
let currentRoomCode = null;
let isHost = false;
let currentLocation = null;
let isImpostor = false;

// Referencias a elementos del DOM
const homeScreen = document.getElementById('homeScreen');
const lobbyScreen = document.getElementById('lobbyScreen');
const gameScreen = document.getElementById('gameScreen');
const playerNameInput = document.getElementById('playerName');
const roomCodeInput = document.getElementById('roomCode');
const createGameBtn = document.getElementById('createGameBtn');
const joinGameBtn = document.getElementById('joinGameBtn');
const displayRoomCode = document.getElementById('displayRoomCode');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const playersList = document.getElementById('playersList');
const playerCount = document.getElementById('playerCount');
const startGameBtn = document.getElementById('startGameBtn');
const leaveLobbyBtn = document.getElementById('leaveLobbyBtn');
const normalPlayerView = document.getElementById('normalPlayerView');
const impostorView = document.getElementById('impostorView');
const locationName = document.getElementById('locationName');
const endRoundBtn = document.getElementById('endRoundBtn');
const backToLobbyBtn = document.getElementById('backToLobbyBtn');
const errorMessage = document.getElementById('errorMessage');
const adInterstitial = document.getElementById('adInterstitial');
const countdown = document.getElementById('countdown');
const groupSelection = document.getElementById('groupSelection');
const selectedGroupDisplay = document.getElementById('selectedGroupDisplay');
const selectedGroupName = document.getElementById('selectedGroupName');
const groupButtons = document.querySelectorAll('.group-btn');
const instructionsToggle = document.getElementById('instructionsToggle');
const instructionsContent = document.getElementById('instructionsContent');
const impostorRevealModal = document.getElementById('impostorRevealModal');
const impostorName = document.getElementById('impostorName');
const closeModalBtn = document.getElementById('closeModalBtn');
const minPlayersWarning = document.getElementById('minPlayersWarning');

// Funciones de utilidad
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

function updatePlayerList(players) {
    playersList.innerHTML = '';
    playerCount.textContent = players.length;
    
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player.name;
        if (player.id === socket.id) {
            li.textContent += ' (Tú)';
            li.style.fontWeight = 'bold';
        }
        playersList.appendChild(li);
    });

    // Mostrar/ocultar aviso de mínimo de jugadores
    if (isHost && players.length < 3) {
        minPlayersWarning.style.display = 'block';
        if (startGameBtn) {
            startGameBtn.disabled = true;
            startGameBtn.style.opacity = '0.5';
            startGameBtn.style.cursor = 'not-allowed';
        }
    } else {
        minPlayersWarning.style.display = 'none';
        if (startGameBtn) {
            startGameBtn.disabled = false;
            startGameBtn.style.opacity = '1';
            startGameBtn.style.cursor = 'pointer';
        }
    }
}

// Event Listeners
createGameBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (!name) {
        showError('Por favor, ingresa tu nombre');
        return;
    }
    socket.emit('createGame', name);
});

joinGameBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    const code = roomCodeInput.value.trim().toUpperCase();
    
    if (!name) {
        showError('Por favor, ingresa tu nombre');
        return;
    }
    
    if (!code || code.length !== 4) {
        showError('El código de sala debe tener 4 caracteres');
        return;
    }
    
    // Verificar que el socket esté conectado
    if (!socket.connected) {
        showError('No hay conexión con el servidor. Espera un momento...');
        return;
    }
    
    console.log('Intentando unirse a sala:', code);
    socket.emit('joinGame', { roomCode: code, playerName: name });
});

copyCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(currentRoomCode).then(() => {
        copyCodeBtn.textContent = '¡Copiado!';
        setTimeout(() => {
            copyCodeBtn.textContent = 'Copiar';
        }, 2000);
    });
});

// Toggle de instrucciones
instructionsToggle.addEventListener('click', () => {
    const isActive = instructionsToggle.classList.contains('active');
    if (isActive) {
        instructionsToggle.classList.remove('active');
        instructionsContent.style.display = 'none';
    } else {
        instructionsToggle.classList.add('active');
        instructionsContent.style.display = 'block';
    }
});

// Selección de grupo
groupButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!isHost) return;
        
        const groupKey = btn.dataset.group;
        socket.emit('selectGroup', { roomCode: currentRoomCode, groupKey });
        
        // Actualizar UI
        groupButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });
});

startGameBtn.addEventListener('click', () => {
    if (isHost) {
        socket.emit('startGame', { roomCode: currentRoomCode });
    }
});

leaveLobbyBtn.addEventListener('click', () => {
    socket.disconnect();
    socket.connect();
    currentRoomCode = null;
    isHost = false;
    showScreen(homeScreen);
});

endRoundBtn.addEventListener('click', () => {
    if (isHost) {
        showInterstitialAd();
    }
});

backToLobbyBtn.addEventListener('click', () => {
    if (isHost) {
        socket.emit('endRound', { roomCode: currentRoomCode });
    }
});

// Función para mostrar publicidad intersticial con countdown
function showInterstitialAd() {
    adInterstitial.style.display = 'flex';
    let timeLeft = 5;
    countdown.textContent = timeLeft;
    
    const interval = setInterval(() => {
        timeLeft--;
        countdown.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            adInterstitial.style.display = 'none';
            socket.emit('endRound', { roomCode: currentRoomCode });
        }
    }, 1000);
}

// Socket Event Handlers
socket.on('gameCreated', ({ roomCode, isHost: host }) => {
    currentRoomCode = roomCode;
    isHost = host;
    displayRoomCode.textContent = roomCode;
    showScreen(lobbyScreen);
    
    // Mostrar botón de iniciar y selección de grupo si es el host
    if (isHost) {
        startGameBtn.style.display = 'block';
        endRoundBtn.style.display = 'block';
        groupSelection.style.display = 'block';
    } else {
        startGameBtn.style.display = 'none';
        endRoundBtn.style.display = 'none';
        groupSelection.style.display = 'none';
    }
});

socket.on('gameJoined', ({ roomCode, isHost: host }) => {
    currentRoomCode = roomCode;
    isHost = host;
    displayRoomCode.textContent = roomCode;
    showScreen(lobbyScreen);
    
    if (isHost) {
        startGameBtn.style.display = 'block';
        endRoundBtn.style.display = 'block';
        groupSelection.style.display = 'block';
    } else {
        startGameBtn.style.display = 'none';
        endRoundBtn.style.display = 'none';
        groupSelection.style.display = 'none';
    }
});

socket.on('groupSelected', ({ groupKey, groupName }) => {
    selectedGroupName.textContent = groupName;
    selectedGroupDisplay.style.display = 'block';
    
    // Actualizar botones
    groupButtons.forEach(btn => {
        if (btn.dataset.group === groupKey) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
});

socket.on('joinError', ({ message }) => {
    console.error('Error al unirse:', message);
    showError(message);
});

socket.on('error', ({ message }) => {
    showError(message);
});

socket.on('updatePlayerList', (players) => {
    updatePlayerList(players);
});

socket.on('hostChanged', ({ newHostId }) => {
    isHost = socket.id === newHostId;
    if (isHost) {
        startGameBtn.style.display = 'block';
        endRoundBtn.style.display = 'block';
        groupSelection.style.display = 'block';
    } else {
        groupSelection.style.display = 'none';
    }
});

socket.on('gameStarted', ({ isImpostor: impostor, location }) => {
    isImpostor = impostor;
    currentLocation = location;
    
    if (isImpostor) {
        normalPlayerView.style.display = 'none';
        impostorView.style.display = 'block';
    } else {
        normalPlayerView.style.display = 'block';
        impostorView.style.display = 'none';
        
        if (location) {
            // Mostrar el nombre de la localización letra por letra
            const locationNameEl = document.getElementById('locationName');
            locationNameEl.innerHTML = '';
            
            // Crear cada letra como un elemento separado para efecto visual
            location.name.split('').forEach((letter, index) => {
                const span = document.createElement('span');
                span.textContent = letter === ' ' ? '\u00A0' : letter; // Non-breaking space
                span.className = 'location-letter';
                span.style.animationDelay = `${index * 0.1}s`;
                locationNameEl.appendChild(span);
            });
        }
    }
    
    // Mostrar botones según si es host
    if (isHost) {
        endRoundBtn.style.display = 'block';
        backToLobbyBtn.style.display = 'block';
    } else {
        endRoundBtn.style.display = 'none';
        backToLobbyBtn.style.display = 'none';
    }
    
    showScreen(gameScreen);
});

// Función para trackear clicks en publicidad
function trackClick(type) {
    fetch('/api/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
    }).catch(err => console.error('Error tracking click:', err));
}

// Handler para cuando termina la ronda - mostrar quién era el impostor
socket.on('roundEnded', ({ impostor }) => {
    if (impostor) {
        impostorName.textContent = impostor.name;
        impostorRevealModal.style.display = 'flex';
    }
});

// Cerrar modal y volver al lobby
closeModalBtn.addEventListener('click', () => {
    impostorRevealModal.style.display = 'none';
    showScreen(lobbyScreen);
});

socket.on('gameStateChanged', ({ status }) => {
    if (status === 'LOBBY') {
        showScreen(lobbyScreen);
        isImpostor = false;
        currentLocation = null;
        // Limpiar selección visual de grupo (pero mantener la selección en el servidor)
        groupButtons.forEach(btn => btn.classList.remove('selected'));
        selectedGroupDisplay.style.display = 'none';
        // Ocultar botones de juego
        endRoundBtn.style.display = 'none';
        backToLobbyBtn.style.display = 'none';
    }
});

// Manejo de entrada en mayúsculas para código de sala
roomCodeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
});

// Cargar localizaciones al iniciar (para referencia)
fetch('/data.js')
    .then(response => response.text())
    .then(data => {
        // El archivo data.js se carga dinámicamente si es necesario
        console.log('Aplicación cargada');
    })
    .catch(err => console.error('Error cargando datos:', err));

