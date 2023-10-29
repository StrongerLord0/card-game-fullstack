import { useContext, useEffect, useState } from "react";
import './Login.css';
import logo from '../assets/roña.png';
import 'animate.css';
import { UserContext } from "../context/UserContext";
import io from 'socket.io-client';

export const Login = ({ setLoged }) => {

    const handleSetUsername = () => {
        setLoged(true)
    }

    const { setSocket } = useContext(UserContext);

    useEffect(() => {
        setSocket(io('http://localhost:3001')); // Reemplaza con la URL de tu servidor
      }, []);

    return (
        <>
            <div className="home">
                <img className="animate__animated animate__bounce" src={logo} alt="" />
                <button className="primary animate__animated animate__jackInTheBox" onClick={handleSetUsername}>
                    <p>Jugar</p>
                </button>
            </div>
        </>
    )
}
