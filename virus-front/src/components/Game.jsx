import { useEffect, useState } from "react";

export const Game = ({ socket, user, setUser }) => {

  const [yourTurn, setYourTurn] = useState(false);
  const [playedCard, setPlayedCard] = useState(null);
  const [deck, setDeck] = useState(user.deck);
  const [playedDeck, setPlayedDeck] = useState([]);
  const [users, setUsers] = useState(user.room.users);

  useEffect(() => {
    setYourTurn(user.room.createdBy == socket.id);

    socket.on('cardThrown', (card, destination, turn, users) => {
      console.log("Se jugó la carta:", card, "hacia", destination, ", ahora es turno de", turn, "y yo soy", socket.id);
      setUsers(users);
      if (turn == socket.id) {
        setYourTurn(true);
      } else {
        setYourTurn(false);
      }
    });

    socket.on('turnEnded', (user, room) => {
      setDeck(user.deck);
      setPlayedDeck(user.playedDeck);
    });

  }, []);

  const handlePlayedCard = (event) => {
    const playedCard = deck.find(card => card.id === event.currentTarget.id);
    console.log(playedCard);
    setPlayedCard(playedCard);
  }

  const handleThrow = (event) => {
    if (!yourTurn || !playedCard) return;
    const destination = event.currentTarget.id;
    setPlayedCard(null);
    socket.emit('throwCard', playedCard, destination);
  }


  return (
    <div>
      <ul>
        <div
          id="basurero"
          style={{
            border: "solid 1px black",
            margin: "1rem",
            cursor: "pointer"
          }}
          onClick={handleThrow}
        >
          <h3>Basurero</h3>
        </div>
        <div
          id="myCards"
          style={{
            border: "solid 1px green",
            margin: "1rem",
            cursor: "pointer"
          }}
          onClick={handleThrow}
        >
          <h3>Mis cartas</h3>
          {playedDeck.map((card, index) =>
            <button
              id={card.id}
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
          {deck.map((card, index) =>
            <button
              id={card.id}
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
          {
            users.filter(player => player.id != socket.id).map((user, index) => {
              return (
                <div>
                  <div
                    id={socket.id}
                    style={{
                      border: "solid 1px red",
                      margin: "1rem",
                      cursor: "pointer"
                    }}
                    onClick={handleThrow}
                  >
                    <p>Cartas</p>
                    {user.playedDeck.map((card, index) =>
                      <button
                        id={card.id}
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
                  <b key={index}>{user.name}</b>
                </div>
              )
            })
          }

        </div>
      </ul>
    </div>

  );
}
