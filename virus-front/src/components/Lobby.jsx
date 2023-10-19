export const Lobby = ({socket, user}) => {
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
