import { useEffect, useState } from 'react'
import { useFetch } from '../hooks/useFetch';

const Rooms = ({ socket, user, setJoined }) => {
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const { data, isLoading, hasError } = useFetch("http://localhost:3001/rooms");

  useEffect(() => {
    if(!isLoading)
      setRooms(data);

  }, [isLoading]);

  useEffect(() => {
    socket.on('createRoom', (room) => {
      const { name, id, createdBy } = room;
      console.log(name, id, createdBy);
      setRooms([...rooms, room]);
    });
  
    socket.on('createdRoom', (room) => {
      console.log("Has creado la sala:", room);
      joinRoom(room.id);
    });
    
    socket.on('joinedRoom', (room) => { 
      console.log("Te has unido correctamente");
      user.room = room;
      console.log(room);
      setJoined(true);
    });
    
  },[]);

  const handleCreateRoom = () => {
    console.log("Creando sala", roomName);
    socket.emit('createRoom', roomName);
  }

  const joinRoom = (id) => {
    socket.emit('joinRoom', id);
  }

  const handleJoinRoom = (event) => {
    console.log(event.currentTarget.id);
    joinRoom(event.currentTarget.id);
  }

  return (
    <div>
      <h1>Hola {user.name}</h1>
      <div>
        {rooms.length == 0 ? <p>No hay salas creadas</p> :
          rooms.map((room, index) => (
            <div key={index} style={{ display: 'flex' }}>
              <p>{room.name}</p>
              <button id={room.id} onClick={handleJoinRoom}>Join</button>
            </div>
          ))}
      </div>
      <div>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Crear room</button>

      </div>

    </div>
  );
};

export default Rooms;