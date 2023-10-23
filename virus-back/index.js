const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Importa el paquete 'cors'

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: ['http://10.1.10.202:5173', 'http://localhost:5173']
}));
const io = socketIo(server, {
    cors: {
        origin: ['http://10.1.10.202:5173', 'http://localhost:5173'],
        methods: ["GET", "POST"]
    }
});

io.to('some room').emit('some event');

// Función para generar IDs únicos
function generateUniqueID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Crear un mazo de cartas con IDs únicos
const mazoVirus = [
    ...Array(5).fill({ id: generateUniqueID(), tipo: "órgano", color: "#FF0000", nombre: "corazón" }),
    ...Array(5).fill({ id: generateUniqueID(), tipo: "órgano", color: "#008000", nombre: "estómago" }),
    ...Array(5).fill({ id: generateUniqueID(), tipo: "órgano", color: "#0000FF", nombre: "cerebro" }),
    ...Array(5).fill({ id: generateUniqueID(), tipo: "órgano", color: "#FFFF00", nombre: "hueso" }),
    { id: generateUniqueID(), tipo: "órgano", color: "#FFFFFF", nombre: "órgano comodín" },
    ...Array(4).fill({ id: generateUniqueID(), tipo: "virus", color: "#FF0000" }),
    ...Array(4).fill({ id: generateUniqueID(), tipo: "virus", color: "#008000" }),
    ...Array(4).fill({ id: generateUniqueID(), tipo: "virus", color: "#0000FF" }),
    ...Array(4).fill({ id: generateUniqueID(), tipo: "virus", color: "#FFFF00" }),
    { id: generateUniqueID(), tipo: "virus", color: "#FFFFFF", nombre: "virus comodín" },
    ...Array(4).fill({ id: generateUniqueID(), tipo: "medicina", color: "#FF0000" }),
    ...Array(4).fill({ id: generateUniqueID(), tipo: "medicina", color: "#008000" }),
    ...Array(4).fill({ id: generateUniqueID(), tipo: "medicina", color: "#0000FF" }),
    ...Array(4).fill({ id: generateUniqueID(), tipo: "medicina", color: "#FFFF00" }),
    ...Array(4).fill({ id: generateUniqueID(), tipo: "medicina", color: "#FFFFFF" }),
    ...Array(3).fill({ id: generateUniqueID(), tipo: "tratamiento", nombre: "Trasplante" }),
    ...Array(3).fill({ id: generateUniqueID(), tipo: "tratamiento", nombre: "Ladrón de órganos" }),
    ...Array(2).fill({ id: generateUniqueID(), tipo: "tratamiento", nombre: "Contagio" }),
    { id: generateUniqueID(), tipo: "tratamiento", nombre: "Guante de látex" },
    { id: generateUniqueID(), tipo: "tratamiento", nombre: "Error médico" }
];

const connectedUsers = {};

const rooms = [];

app.get('/rooms', (req, res) => {
    res.send(JSON.stringify(rooms));
});
app.get('/room', (req, res) => {
    res.send(JSON.stringify(rooms[req.params.id]));
});

// Escucha eventos de conexión
io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    connectedUsers[socket.id] = socket.id;

    socket.on('setUsername', (username) => {
        connectedUsers[socket.id] = username;
        console.log(socket.id, 'ahora es', username);
    });

    socket.on('createRoom', (name) => {
        const room = {
            name,
            users: [],
            id: rooms.length,
            createdBy: socket.id
        };
        rooms.push(room);
        console.log(`Sala creada por ${connectedUsers[socket.id]}: ${room}`);
        io.emit('createRoom', room);
        io.to(socket.id).emit('createdRoom', room);
    });

    socket.on('joinRoom', (id) => {
        if (!rooms[id].users.map(user => user.id).includes(socket.id)) {
            rooms[id].users.push({
                id: socket.id,
                name: connectedUsers[socket.id],
                playedDeck: [],
                deck: []
            });
            console.log(`${connectedUsers[socket.id]} se ha unido a la sala ${(rooms[id].id)}`);
        }

        socket.join("room" + id);
        io.to("room" + id).emit('playerJoined', rooms[id]);
        io.to(socket.id).emit('joinedRoom', rooms[id]);
    });

    socket.on('sendMessage', ({ message, room }) => {
        console.log(`Mensaje de ${connectedUsers[socket.id]} recibido en la sala ${room.id}: ${message}`);
        const messageObject = { message, user: connectedUsers[socket.id] };
        io.to("room" + room.id).emit('recievedMessage', messageObject);
    });

    socket.on('startGame', (user) => {
        const { room } = user;
        rooms[room.id].deck = [...mazoVirus];

        const usersInRoom = io.sockets.adapter.rooms.get("room" + room.id);

        console.log(rooms[room.id]);
        rooms[room.id].currentTurnId = socket.id;

        if (room.createdBy === rooms[room.id].createdBy) {
            usersInRoom.forEach(socket => {

                const deck = [];

                for (let i = 0; i < 3; i++) {
                    const randomCardIndex = Math.floor(Math.random() * rooms[room.id].deck.length);
                    const randomCard = rooms[room.id].deck.splice(randomCardIndex, 1)[0]; // Elimina la carta del mazoVirus
                    deck.push(randomCard); // Agrega la carta al deck del jugador
                }

                console.table(rooms[room.id].deck);
                console.table(deck);
                io.to(socket).emit('gameStarted', deck);
            
                rooms[room.id].users.find(user => user.id === socket).deck = deck;
                rooms[room.id].users.find(user => user.id === socket).playedDeck = [];
            });
        }
        console.log("La partida en la sala " + room.id + " ha comenzado:", JSON.stringify(rooms[room.id]));
    });

    // Manejo de desconexión
    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });

    socket.on('throwCard', (playedCard, destination) => {
        //Eliminar la carta de su deck
        //Darle una nueva carta al jugador del mazo de la room
        //Avisarle a la raza del movimiento
        //Asignar el turno al siguiente
        
        console.log(playedCard, destination);
        
        const room = rooms.find(room => !!room.users.find(user => user.id === socket.id));
        const user = room.users.find(user => user.id === socket.id);
        const otherUsers = room.user.find(user => user.id !== socket.id);

        if(destination == 'myCards' && ownRules(playedCard, user)) {
            user.playedDeck.push(playedCard);
        }
        else if (destination == '' && otherRules(playedCard, otherUsers)){
            console.log("Movimiento inválido");
        }

        const deleted = user.deck.splice(user.deck.findIndex(card => card.id == playedCard.id), 1);
        console.log("deleted:",deleted);

        const randomCard = room.deck[Math.floor(Math.random() * room.deck.length)];

        user.deck.push(randomCard);
        room.deck.splice(room.deck.findIndex(card => card.id == randomCard.id), 1);

        const turnIndex = room.users.findIndex(user => user.id == socket.id);

        const turn = turnIndex < room.users.length - 1 ? room.users[turnIndex + 1].id : room.users[0].id;

        io.to("room" + room.id).emit('cardThrown', playedCard, destination, turn, room.users);
        io.to(user.id).emit('turnEnded', user, room);
    });

    function ownRules(playedCard, user) {
        if (playedCard.tipo === 'órgano') {
            // Verificar que el usuario no tenga la carta en su playedDeck
            if (user.playedDeck.find(card => (card.tipo === playedCard.tipo) && (card.color === playedCard.color))) {
                return false; // El usuario ya tiene esta carta, movimiento inválido.
            } else {
                return true; // Movimiento válido, el usuario no tiene esta carta.
            }
        } else if (playedCard.tipo === 'medicina' || playedCard.tipo === 'virus') {
            // Verificar que el usuario tenga un órgano del mismo color
            const hasMatchingOrgan = user.playedDeck.some(card => card.tipo === 'órgano' && card.color === playedCard.color);
            
            // Verificar la cantidad máxima de cartas del mismo tipo (medicina o virus)
            const maxCardCount = (playedCard.tipo === 'medicina') ? 2 : 2;
    
            // Contar las cartas del mismo tipo (medicina o virus) en el playedDeck del usuario
            const sameTypeCount = user.playedDeck.filter(card => card.tipo === playedCard.tipo).length;
    
            if (hasMatchingOrgan && sameTypeCount < maxCardCount) {
                // Movimiento válido, el usuario tiene un órgano del mismo color y no excede la cantidad máxima de cartas del mismo tipo.
                return true;
            }
        }
    
        return false; // En cualquier otro caso, el movimiento es inválido.
    }

    function otherRules(playedCard, otherUsers) {
        otherUsers.forEach(user => {
            if (playedCard.tipo === 'órgano') {
                // Verificar que el usuario no tenga la carta en su playedDeck
                if (user.playedDeck.find(card => (card.tipo === playedCard.tipo) && (card.color === playedCard.color))) {
                    return false; // El usuario ya tiene esta carta, movimiento inválido.
                } else {
                    return true; // Movimiento válido, el usuario no tiene esta carta.
                }
            } else if (playedCard.tipo === 'medicina' || playedCard.tipo === 'virus') {
                // Verificar que el usuario tenga un órgano del mismo color
                const hasMatchingOrgan = user.playedDeck.some(card => card.tipo === 'órgano' && card.color === playedCard.color);
                
                // Verificar la cantidad máxima de cartas del mismo tipo (medicina o virus)
                const maxCardCount = (playedCard.tipo === 'medicina') ? 2 : 2;
        
                // Contar las cartas del mismo tipo (medicina o virus) en el playedDeck del usuario
                const sameTypeCount = user.playedDeck.filter(card => card.tipo === playedCard.tipo).length;
        
                if (hasMatchingOrgan && sameTypeCount < maxCardCount) {
                    // Movimiento válido, el usuario tiene un órgano del mismo color y no excede la cantidad máxima de cartas del mismo tipo.
                    return true;
                }
            }
            return false; // En cualquier otro caso, el movimiento es inválido.
        });
    }
});

io.on('error', (error) => {
    console.log(`Error en la conexión: ${error}`);
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
