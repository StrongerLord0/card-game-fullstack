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
    ...Array(3).fill({ id: generateUniqueID(), tipo: "tratamiento", nombre: "Trasplante", color: "#F000F0"  }),
    ...Array(3).fill({ id: generateUniqueID(), tipo: "tratamiento", nombre: "Ladrón de órganos", color: "#F000F0"  }),
    ...Array(2).fill({ id: generateUniqueID(), tipo: "tratamiento", nombre: "Contagio", color: "#F000F0"  }),
    { id: generateUniqueID(), tipo: "tratamiento", nombre: "Guante de látex", color: "#F000F0"  },
    { id: generateUniqueID(), tipo: "tratamiento", nombre: "Error médico", color: "#F000F0" },
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

        if (destination === 'myCards' && rules(playedCard, user)) {
            user.playedDeck.push(playedCard);
            const deleted = user.deck.splice(user.deck.findIndex(card => card.id === playedCard.id), 1);
            console.log("deleted:", deleted);
            const randomCard = room.deck[Math.floor(Math.random() * room.deck.length)];
            user.deck.push(randomCard);
            room.deck.splice(room.deck.findIndex(card => card.id === randomCard.id), 1);
            const turnIndex = room.users.findIndex(user => user.id === socket.id);
            const turn = turnIndex < room.users.length - 1 ? room.users[turnIndex + 1].id : room.users[0].id;
            io.to("room" + room.id).emit('cardThrown', playedCard, destination, turn, room.users);
            io.to(user.id).emit('turnEnded', user, room);
        }

        if (destination === 'basurero') {
            // Agrega la carta a jugar al mazo disponible (deck)
            room.deck.push(playedCard);
            // Quita la carta del dueño
            const deleted = user.deck.splice(user.deck.findIndex(card => card.id === playedCard.id), 1);
            console.log("deleted:", deleted);
            // Agrega una carta aleatoria del mazo disponible al dueño
            const randomCardIndex = Math.floor(Math.random() * room.deck.length);
            const randomCard = room.deck.splice(randomCardIndex, 1)[0];
            user.deck.push(randomCard);

            const turnIndex = room.users.findIndex(user => user.id === socket.id);
            const turn = turnIndex < room.users.length - 1 ? room.users[turnIndex + 1].id : room.users[0].id;
            io.to("room" + room.id).emit('cardThrown', playedCard, destination, turn, room.users);
            io.to(user.id).emit('turnEnded', user, room);
        }
        checkGame(playedCard, user, room);

    });

    function rules(playedCard, user) {
        // Verificar que el usuario no tenga el órgano en su playedDeck
        if (playedCard.tipo === 'órgano')
            return !user.playedDeck.find(card => (card.tipo === playedCard.tipo) && (card.color === playedCard.color));

        else if (playedCard.tipo === 'medicina' || playedCard.tipo === 'virus') {
            // Verificar que el usuario tenga un órgano del mismo color
            const hasMatchingOrgan = user.playedDeck.some(card => card.tipo === 'órgano' && card.color === playedCard.color);

            // Verificar la cantidad máxima de cartas del mismo tipo (medicina o virus)
            const hasTwoCardsOfSameColor = user.playedDeck.filter(card => (card.color === playedCard.color) && (card.tipo === playedCard.tipo)).length < 2 ? true : false;

            if (hasMatchingOrgan && hasTwoCardsOfSameColor) {
                // Movimiento válido, el usuario tiene un órgano del mismo color y no excede la cantidad máxima de cartas del mismo tipo.
                return true;
            }

        }
        //Logica al emplear un tratamiento, aqui va el desmadre :O

        return false; // En cualquier otro caso, el movimiento es inválido.
    }

    //Verificación del juego y estatus, si hay un virus y un medicamento en el mismo deck, se eliminan entre sí.
    //Valida cuando alguien ganó en el juego.

    function checkGame(playedCard, user, room) {
        // Verificar si el usuario tiene 4 órganos
        if (user.playedDeck.filter(card => card.tipo === 'órgano').length === 4 && !user.playedDeck.some(card => card.tipo === 'virus')) {
            // El usuario ganó el juego
            io.to("room" + room.id).emit('gameEnded', user);
            console.log(`${user.name} ha ganado el juego!`);
        }

        if (user.playedDeck.filter(card => card.tipo === "virus").map(card => card.color).some(color => user.playedDeck.filter(card => card.tipo === "medicina").map(medicina => medicina.color).includes(color))){
            // Encuentra los colores que coinciden
            const matchingColors = user.playedDeck.filter(card => card.tipo === "virus").map(card => card.color).filter(color => user.playedDeck.filter(card => card.tipo === "medicina").map(medicina => medicina.color).includes(color));
        
            // Para cada color que coincide, elimina la carta de virus y medicina del mazo del jugador y añádelas al mazo de la sala
            matchingColors.forEach(color => {
                const virusIndex = user.playedDeck.findIndex(card => card.tipo === "virus" && card.color === color);
                const medicineIndex = user.playedDeck.findIndex(card => card.tipo === "medicina" && card.color === color);
        
                // Elimina las cartas del mazo del jugador
                const virusCard = user.playedDeck.splice(virusIndex, 1)[0];
                const medicineCard = user.playedDeck.splice(medicineIndex, 1)[0];
        
                // Añade las cartas al mazo de la sala
                room.deck.push(virusCard, medicineCard);
            });
        }


        // //Eliminar virus y medicina del mismo color
        // if(user.playedDeck.some(card => card.tipo === 'virus' && card.color === playedCard.color) && user.playedDeck.some(card => card.tipo === 'medicina' && card.color === playedCard.color)){
        //     const virus = user.playedDeck.findIndex(card => card.tipo === 'virus' && card.color === playedCard.color);
        //     const medicina = user.playedDeck.findIndex(card => card.tipo === 'medicina' && card.color === playedCard.color);
        //     user.playedDeck.splice(virus, 1);
        //     user.playedDeck.splice(medicina, 1);
        //     console.log("Se eliminaron el virus y la medicina del mismo color");
        // }
    }
});

io.on('error', (error) => {
    console.log(`Error en la conexión: ${error}`);
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
