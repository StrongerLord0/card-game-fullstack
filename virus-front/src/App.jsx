import { useContext, useEffect, useState } from 'react';
// import './App.css'
import { Login } from './components/Login';
import Lobby from './components/Lobby';
import { Game } from './components/Game';
import dots from '../src/assets/dots.svg';
import { UserProvider } from './context/UserProvider';

const App = () => {

  const [loged, setLoged] = useState(false);
  const [started, setStarted] = useState(false);

  return (
    <>
      <UserProvider>
        <div className="loginBackground"><img src={dots} alt="dots" /></div>
        {!loged && <Login setLoged={setLoged} />}
        {loged && <Lobby />}
        {/* {loged && joined && !started && <Lobby socket={socket} user={user} setJoined={setJoined} setStarted={setStarted} />} */}
        {loged && started && <Game setStarted={setStarted} />}
      </UserProvider>

    </>

  );
};

export default App;