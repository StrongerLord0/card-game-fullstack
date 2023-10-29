import { useEffect, useState } from 'react'
import { useFetch } from '../hooks/useFetch';
import { Profile } from './Profile';
import { Rooms } from './Rooms';

const Lobby = () => {

  return (
    <div className='app'>
      <Profile />
      <Rooms />
    </div>
  );
};

export default Lobby;