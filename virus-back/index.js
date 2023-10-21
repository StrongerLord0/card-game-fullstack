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
    { id: generateUniqueID(), tipo: "tratamiento", nombre: "Trasplante" },
    { id: generateUniqueID(), tipo: "tratamiento", nombre: "Ladrón de órganos" },
    { id: generateUniqueID(), tipo: "tratamiento", nombre: "Contagio" },
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
            });
            console.log(`${connectedUsers[socket.id]} se ha unido a la sala ${JSON.stringify(rooms[id])}`);
            console.log(rooms[id].users);
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

        const usersInRoom = io.sockets.adapter.rooms.get("room" + room.id);

        console.log(rooms[room.id]);

        if (room.createdBy === rooms[room.id].createdBy) {
            usersInRoom.forEach(socket => {

                const deck = [];

                for (let i = 0; i < 3; i++) {
                    const randomCardIndex = Math.floor(Math.random() * mazoVirus.length);
                    const randomCard = mazoVirus.splice(randomCardIndex, 1)[0]; // Elimina la carta del mazoVirus
                    deck.push(randomCard); // Agrega la carta al deck del jugador
                }

                console.table(mazoVirus);
                console.table(deck);
                io.to(socket).emit('gameStarted', deck);
                rooms[room.id].users.find(user => user.id === socket).deck = deck;
            });
        }
        console.log("La partida en la sala " + room.id + " ha comenzado:", JSON.stringify(rooms[room.id]));
    });

    // Manejo de desconexión
    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

io.on('error', (error) => {
    console.log(`Error en la conexión: ${error}`);
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
