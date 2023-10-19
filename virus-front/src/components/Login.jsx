import { useState } from "react";

export const Login = ({ socket, setLoged, setUser }) => {

    const [username, setUsername] = useState('');

    const handleSetUsername = () => {
        socket.emit('setUsername', username);
        setUser({name: username})
        setLoged(true)
    }

    return (
        <div>
            <h1>Roña</h1>
            <input 
                type="text" 
                placeholder="Nombre" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <button onClick={handleSetUsername}>Entrar</button>
        </div>
    )
}
