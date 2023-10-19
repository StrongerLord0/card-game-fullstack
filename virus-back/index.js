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
        const room = { name, users: [], id: rooms.length, createdBy: connectedUsers[socket.id] };
        rooms.push(room);
        console.log(`Sala creada por ${connectedUsers[socket.id]}: ${room}`);
        io.emit('createRoom', room);
        io.to(socket.id).emit('createdRoom', room);
    });

    socket.on('joinRoom', (id) => {
        if(!rooms[id].users.map(user => user.id).includes(socket.id)) {
            rooms[id].users.push({ id: socket.id, name: connectedUsers[socket.id] });
            console.log(`${connectedUsers[socket.id]} se ha unido a la sala ${rooms[id]}`);
        }
        
        socket.join("room"+id);
        io.to("room"+id).emit('playerJoined', rooms[id]);
        io.to(socket.id).emit('joinedRoom', rooms[id]);
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
