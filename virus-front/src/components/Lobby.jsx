import { useEffect, useRef, useState } from 'react'
import { useFetch } from '../hooks/useFetch';
import { Profile } from './Profile';
import { Rooms } from './Rooms';
import theme from '../assets/roña soundtrack.mp3';

const Lobby = ({setStarted}) => {

  const audioPlayer = useRef(null);
  
  useEffect(() => {
    audioPlayer.current.play();
    audioPlayer.current.volume = 0.4;
  }, []);

  return (
    <div className='app'>
      <Profile />
      <Rooms setStarted={setStarted} />
      <audio ref={audioPlayer} src={theme} autoPlay loop/>
    </div>
  );
};

export default Lobby;