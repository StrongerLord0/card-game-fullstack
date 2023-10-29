import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

export const RoomLobby = ({ setStarted }) => {
    const { user, setUser, socket } = useContext(UserContext);

    const [players, setPlayers] = useState(user.room.users);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [creator, setCreator] = useState(false);


    useEffect(() => {
        socket.on("playerJoined", (room) => {
            console.log("Alguien se unió");
            setUser({ ...user, room });
            setPlayers(user.room.users);
        });

        socket.on("recievedMessage", (msg) => {
            console.log('Mensaje recibido', msg, socket.id);
            setMessages(prevMessages => [...prevMessages, msg]);
        });

        socket.on("gameStarted", (deck, room) => {
            console.log(deck);
            setUser({ ...user, deck, room });
            setStarted(true);
        });
    }, []);

    const handleSendMessage = () => {
        socket.emit("sendMessage", { message, room: user.room });
    }

    const handlePlay = () => {
        socket.emit("startGame", user);
    }

    return (
        <div style={{
            width: "calc(100% - 2rem)",
            height: "calc(100% - 2rem)",
            padding: "1rem",
            display: "flex",
            justifyContent: "space-around",
        }}>
            <div
                style={{
                    backgroundColor: "white",
                    height: "calc(100% - 2rem)",
                    width: "calc(14rem - 2rem)",
                    borderRadius: "1rem",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <h4>Jugadores</h4>
                    {user.room.users.map((player, index) => {
                        const creator = user.room.createdBy == player.id;
                        return (
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                height: "2rem",
                            }}>
                                {creator ?
                                    <svg
                                        style={{
                                            fill: "var(--accent)",
                                            marginBottom: '0.2rem',
                                            padding: '0'
                                        }}
                                        xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 22" width="22" height="22"><path d="M22.766,4.566A1.994,1.994,0,0,0,20.586,5L18,7.586,13.414,3a2,2,0,0,0-2.828,0L6,7.586,3.414,5A2,2,0,0,0,0,6.414V17a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V6.414A2,2,0,0,0,22.766,4.566Z" />
                                    </svg>
                                    : <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="11" cy="11" r="11" fill="#D9D9D9" />
                                    </svg>
                                }
                                <p key={index}
                                    style={{
                                        color: 'var(--background)',
                                        margin: `0.25rem 0 0.25rem 0.25rem`
                                    }}>{player.name}</p>
                            </div>
                        )
                    })}
                </div>
                {(user.room.createdBy == socket.id) && <button onClick={handlePlay} className="secondary">Jugar</button>}
            </div>
            <br />
            <div
                style={{
                    width: "calc(100% - 18rem)",
                    height: "calc(100% - 2rem)",
                    backgroundColor: "white",
                    borderRadius: "1rem",
                    display: "flex",
                    flexDirection: "column-reverse",
                    padding: "1rem",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",

                    }}
                >
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
                        style={{
                            borderBottom: "solid 2px #00000020"
                        }}
                        placeholder="Escribe algo..."
                    />
                    <button onClick={handleSendMessage}
                        style={{
                            background: "none",
                            border: "none",
                            padding: '0 1rem'
                        }}
                    >
                        <svg
                            style={{
                                width: "1.5rem",
                                height: "1.5rem",
                                fill: "var(--background)",
                                cursor: "pointer",

                            }}
                            xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="m.172,3.708C-.216,2.646.076,1.47.917.713,1.756-.041,2.951-.211,3.965.282l18.09,8.444c.97.454,1.664,1.283,1.945,2.273H4.048L.229,3.835c-.021-.041-.04-.084-.057-.127Zm3.89,9.292L.309,20.175c-.021.04-.039.08-.054.122-.387,1.063-.092,2.237.749,2.993.521.467,1.179.708,1.841.708.409,0,.819-.092,1.201-.279l18.011-8.438c.973-.456,1.666-1.288,1.945-2.28H4.062Z" /></svg>
                    </button>
                </div>

                <div
                    style={{
                        height: "calc(100% - 4rem)",
                        overflowY: "scroll",
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column"

                    }}
                >
                    {messages.map((message, index) => {

                        const isMe = message.user == user.name || message.user == socket.id;

                        const recieved = {
                            backgroundColor: "#EEEEEE",
                            margin: "0.25rem",
                            padding: "0.5rem",
                            borderRadius: "0 1rem 1rem 1rem",
                            maxWidth: "60%",
                            width: "fit-content",
                        }
                        const sent = {
                            backgroundColor: "var(--background)",
                            margin: "0.25rem",
                            padding: "0.5rem",
                            borderRadius: "1rem 0rem 1rem 1rem",
                            maxWidth: "60%",
                            width: "fit-content",
                            marginLeft: "auto",
                        }

                        return (
                            <div key={index}
                                style={isMe ? sent : recieved}
                            >
                                {!isMe && <p style={{ color: 'var(--background)', margin: '0.25rem' }}>{message.user}</p>}
                                <p style={{ margin: '0.25rem', color: `${isMe ? 'white' : 'var(--text)'}` }}>{message.message}</p>
                            </div>
                        )
                    })}
                </div>
                <h4>Chat</h4>
            </div>
        </div>
    )
}