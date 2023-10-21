import { useEffect, useState } from "react";

export const Lobby = ({ socket, user, setStarted }) => {

  const [players, setPlayers] = useState(user.room.users);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [creator, setCreator] = useState(false);

  useEffect(() => {
    socket.on("playerJoined", (room) => {
      console.log("Alguien se unió");
      user.room = room;
      setPlayers(user.room.users);
    });

    socket.on("recievedMessage", (msg) => {
      console.log('Mensaje recibido',msg, socket.id);
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    socket.on("gameStarted", (deck, room) => {
      console.log(deck);
      user.deck = deck;
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
    <div>
      <h1>Hola {user.name}</h1>
      <ul>
        {user.room.users.map((user, index) => { return (<li key={index}>{user.name}</li>) })}
      </ul>
      {(user.room.createdBy == socket.id) && <button onClick={handlePlay}>Jugar</button>}
      <br />
      <div>
        <ul>
          {messages.map((message, index) => { return (<li key={index}><b>{message.user}: </b>{message.message}</li>) })}
        </ul>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}/>
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  )
}
