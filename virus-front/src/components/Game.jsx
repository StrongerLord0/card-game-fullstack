import { useEffect, useState } from "react";

export const Game = ({ socket, user }) => {

  const [yourTurn, setYourTurn] = useState(true);
  const [playedCard, setPlayedCard] = useState(null);

  useEffect(() => {
    socket.on('yourTurn', () => {
      console.log("Tu turno");
      setYourTurn(true);
    });
  }, []);

  const handlePlayedCard = (event) => {
    const playedCard = user.deck[event.currentTarget.id];
    console.log(playedCard);
    setPlayedCard(playedCard);
  }

  const handleThrow = () => {
    socket.emit('throwCard', playedCard, destination);
    setYourTurn(false);
  }

  return (
    <div>
      <h1>Game</h1>
      <ul>
        <div>
          {user.deck.map((card, index) =>
            <button
              id={index}
              key={index}
              style={{
                backgroundColor: `${card.color}`,
                color: "#000000",
              }}
              disabled={!yourTurn}
              onClick={handlePlayedCard}
            >
              {card.tipo}
            </button>
          )}

        </div>
        <div>
          <ul>
            {user.room.users.filter(player => player.id != socket.id).map((user, index) => { return (<li key={index}>{user.name}</li>) })}
          </ul>
        </div>
      </ul>
    </div>

  );
}
