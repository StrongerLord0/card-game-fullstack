import { useContext, useState } from 'react';
import doodles from '../assets/doodles.png';
import avatars from '../helpers/avatars';
import { CirclePicker } from 'react-color';
import { UserContext } from '../context/UserContext';

export const Profile = () => {
    const [color, setColor] = useState('#ffae00');

    const { user, setUser, socket } = useContext(UserContext);

    console.log(color);

    const handleSetUsername = () => {
        socket.emit('setUsername', user.name);
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
                src={avatars[0]} alt="" />

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
                    onChangeComplete={(color) => setColor(color.hex)}
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
            <button className='secondary' style={{ marginTop: '1rem' }} onClick={handleSetUsername}>Guardar</button>
        </div>
    )
}
