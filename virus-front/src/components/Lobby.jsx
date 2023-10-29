import { useEffect, useState } from 'react'
import { useFetch } from '../hooks/useFetch';
import { Profile } from './Profile';
import { Rooms } from './Rooms';

const Lobby = ({setStarted}) => {

  return (
    <div className='app'>
      <Profile />
      <Rooms setStarted={setStarted} />
    </div>
  );
};

export default Lobby;