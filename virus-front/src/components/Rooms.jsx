import { useContext, useEffect, useState } from 'react';
import doodles from '../assets/doodles.png';
import ellipse from '../assets/ellipse.svg';
import { useFetch } from '../hooks/useFetch';
import { UserContext } from "../context/UserContext";
import { RoomMenu } from './Rooms/RoomMenu';
import { RoomLobby } from './Rooms/RoomLobby';

export const Rooms = () => {
    const { user, setUser, socket } = useContext(UserContext);

    console.log(user);
    const [roomName, setRoomName] = useState("");
    const { data, isLoading, hasError } = useFetch("http://localhost:3001/rooms");
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        if (!isLoading)
            setUser({ ...user, rooms : [...data] })

    }, [isLoading]);

    useEffect(() => {
        socket.on('createRoom', (room) => {
            setUser((user) => ({...user, rooms: [...user.rooms, room]}));
            const { name, id, createdBy } = room;
            console.log(name, id, createdBy);
        });

        socket.on('createdRoom', (room) => {
            console.log("Has creado la sala:", room);
            joinRoom(room.id);
        });

        socket.on('joinedRoom', (room) => {
            console.log("Te has unido correctamente");
            setUser((user)=> ({ ...user, room }));
            console.log(room);
            setJoined(true);
        });

    }, []);

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

    console.log("Joined", joined);

    return (
        <>
            <div className="card animate__animated animate__bounceIn" style={{ width: '60%' }}>
                <img className='doodles' src={doodles} alt="" />
                {joined ? <RoomLobby socket={socket} setJoined={setJoined} /> :
                    <>
                        <div className='inCard'>
                            <p style={{
                                color: 'var(--accent)',
                                fontSize: '3rem',
                            }}>+ </p>
                            <input
                                placeholder='Nombre de la sala'
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                            />
                            <button
                                className='primary'
                                style={{
                                    fontSize: '1rem',
                                    padding: '1rem'
                                }}
                                onClick={handleCreateRoom}
                            >
                                <p>Crear</p>
                            </button>
                        </div>
                        <hr />
                        {user.rooms.length == 0 ? <p>No hay salas creadas</p> :
                            user.rooms.map((room, index) => (
                                <div className='inCard' key={index} style={{ display: 'flex' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img style={{ height: '1rem', marginRight: '1rem' }} src={ellipse} alt="" />
                                        <div>
                                            <p style={{ fontSize: '1.5rem' }}>{room.name}</p>
                                            <p style={{ color: '#A0A0A0' }}>Clásico</p>
                                        </div>
                                    </div>
                                    <button className='secondary' id={room.id} onClick={handleJoinRoom}>Join</button>
                                </div>
                            ))}
                    </>
                }
            </div>
        </>
    )
}
