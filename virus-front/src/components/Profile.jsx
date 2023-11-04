import { useContext, useState } from 'react';
import doodles from '../assets/doodles.png';
import avatars from '../helpers/avatars';
import { CirclePicker } from 'react-color';
import { UserContext } from '../context/UserContext';

export const Profile = () => {
    const [color, setColor] = useState('#ffae00');
    const [avatar, setAvatar] = useState(0);

    const { user, setUser, socket } = useContext(UserContext);

    console.log(color);

    const handleSetUser = () => {
        socket.emit('setUser', user);
    }

    const handleColorSelection = (color) => {
        setColor(color.hex);
        setUser({ ...user, color: color.hex });
    }

    const handleAvatarSelection = () => {
        setAvatar(avatar => (avatar + 1) % avatars.length);
        setUser({ ...user, avatar: ((avatar + 1) % avatars.length) });
    }

    return (
        <div className="card animate__animated animate__bounceIn" style={{ width: '25%' }}>
            <img className='doodles' src={doodles} alt="" />
            <img
                style={{
                    marginTop: "1rem",
                    border: `solid 0.5rem ${color}`,
                    borderRadius: "1rem",
                    height: "6rem",
                    boxShadow: "0 0 0rem 4px #00000024",
                    transition: "all 0.2s ease-in-out",
                }}
                onClick={handleAvatarSelection}
                src={avatars[avatar]} alt="" />

            <div
                style={{
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '1rem',
                    borderRadius: '1rem',
                    marginTop: '1rem',
                    width: 'calc(100% - 5rem)',
                }}
            >
                <CirclePicker
                    color={color}
                    onChangeComplete={handleColorSelection}
                />
            </div>
            <input
                type="text"
                placeholder='Nombre'
                style={{
                    width: 'calc(100% - 4rem)',
                    marginTop: '1rem',
                    padding: '0.5rem',
                    borderRadius: '1rem',
                    textAlign: 'center',
                    color: 'var(--text)',
                }}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
            <button className='secondary' style={{ marginTop: '1rem' }} onClick={handleSetUser}>Guardar</button>
        </div>
    )
}
