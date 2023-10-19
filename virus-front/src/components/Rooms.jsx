import { useEffect, useState } from 'react'
import { useFetch } from '../hooks/useFetch';

const Rooms = ({ socket, user, setJoined }) => {
  // const [message, setMessage] = useState('');
  // const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const { data, isLoading, hasError } = useFetch("http://10.1.10.202:3001/rooms")
  // const handleSendMessage = () => {
  //   socket.emit('chat message', message);
  //   setMessage('');
  // };

  console.log(data);

  useEffect(() => {
    if(isLoading) return;

    setRooms(data);

  }, [isLoading])

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