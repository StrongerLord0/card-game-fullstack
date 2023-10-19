import { useEffect, useState } from 'react';
import './App.css'
import { Login } from './components/login';
import io from 'socket.io-client';
import Rooms from './components/Rooms';
import { Lobby } from './components/Lobby';

const App = () => {

  const [loged, setLoged] = useState(false);
  const [joined, setJoined] = useState(false);
  const [user, setUser] = useState({ name: '' })

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io('http://localhost:3001')); // Reemplaza con la URL de tu servidor
  }, []);

  return (
    <>
      {!loged && <Login socket={socket} setLoged={setLoged} setUser={setUser} />}
      {loged && !joined && <Rooms socket={socket} user={user} setJoined={setJoined} />}
      {loged && joined && <Lobby socket={socket} user={user} setJoined={setJoined} />}
    </>

  );
};

export default App;