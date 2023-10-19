import { useEffect, useState } from "react";

export const Lobby = ({socket, user}) => {

  const [players, setPlayers] = useState(user.room.users);

  useEffect(() => {
    socket.on("playerJoined", (room) => {
      console.log("Alguien se unió");
      user.room = room;
      setPlayers(user.room.users);
    });
  }, []);

    console.log(user);
  return (
    <div>
        <h1>Hola {user.name}</h1>
        <ul>
            {user.room.users.map((user, index) => { return (<li key={index}>{user.name}</li>)})}
        </ul>
    </div>
  )
}
