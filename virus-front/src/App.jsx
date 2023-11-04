import { useContext, useEffect, useRef, useState } from 'react';
// import './App.css'
import { Login } from './components/Login';
import Lobby from './components/Lobby';
import { Game } from './components/Game';
import dots from '../src/assets/dots.svg';
import doodles from '../src/assets/doodles.png';
import { UserProvider } from './context/UserProvider';
const App = () => {

  const [loged, setLoged] = useState(false);
  const [started, setStarted] = useState(false);

  
  return (
    <>
      <UserProvider>
        <div className="loginBackground"><img src={!started ? dots : doodles} alt="dots" /></div>
        {!loged && <Login setLoged={setLoged} />}
        {loged && !started && <Lobby setStarted={setStarted} />}
        {/* {loged && joined && !started && <Lobby socket={socket} user={user} setJoined={setJoined} setStarted={setStarted} />} */}
        {loged && started && <Game />}
      </UserProvider>
    </>

  );
};

export default App;