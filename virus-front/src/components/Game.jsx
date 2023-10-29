import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

export const Game = () => {
  const { user, setUser, socket } = useContext(UserContext);

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
    <>

      <div
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          width: "calc(100% - 2rem)",
          margin: "1rem",
        }}
      >
        <div
          id="myCards"
          style={{
            border: "solid 1px green",
            margin: "1rem",
            cursor: "pointer",
            width: "calc(100% - 2rem)",
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
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          {
            users.filter(player => player.id != socket.id).map((user, index) => {
              const firstPlayer = index == 0 ? {
                position: "fixed",
                top: "0",
                left: "50%",
                right: "50%",
                transform: "translate(-50%, 0)",
                width: 'fit-content'
              } : {};
              if (index % 2 != 0) {
                return (
                  <div
                    style={{
                      border: "solid 1px red",
                      margin: "1rem",
                      ...firstPlayer,
                    }}
                  >
                    <div
                      id={socket.id}
                      style={{
                        border: "solid 1px red",
                        margin: "1rem",
                        cursor: "pointer",
                      }}
                      onClick={handleThrow}
                    >
                      <p>PlayDeck</p>
                    </div>
                    {user.playedDeck.map((card, index) =>
                      <button
                        id={card.id}
                        key={index}
                        style={{
                          backgroundColor: `${card.color}`,
                          color: "#FFF",
                        }}
                        className={index == 0 ? 'topPlayer' : ''}
                        disabled={!yourTurn}
                        onClick={handleThrow}
                      >
                        {card.tipo}
                      </button>
                    )}
                    <b key={index}>{user.name}</b>
                  </div>
                )
              }
              return;
            })
          }
        </div>
        <div
          id="basurero"
          style={{
            border: "solid 1px black",
            margin: "1rem",
            cursor: "pointer",
            width: "10rem",
            height: "10rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleThrow}
        >
          <h3>Basurero</h3>
        </div>
        <div
          style={{

          }}
        >
          {
            users.filter(player => player.id != socket.id).map((user, index) => {
              const firstPlayer = index == 0 ? {
                position: "fixed",
                top: "0",
                left: "50%",
                right: "50%",
                transform: "translate(-50%, 0)",
                width: 'fit-content'
              } : {};
              if (index % 2 == 0) {
                return (
                  <div
                    style={{
                      border: "solid 1px red",
                      margin: "1rem",
                      ...firstPlayer,
                    }}
                  >
                    <div
                      id={socket.id}
                      style={{
                        border: "solid 1px red",
                        margin: "1rem",
                        cursor: "pointer",
                      }}
                      onClick={handleThrow}
                    >
                      <p>PlayDeck</p>
                    </div>
                    {user.playedDeck.map((card, index) =>
                      <button
                        id={card.id}
                        key={index}
                        style={{
                          backgroundColor: `${card.color}`,
                          color: "#FFFFFF",
                        }}
                        className={index == 0 ? 'topPlayer' : ''}
                        disabled={!yourTurn}
                        onClick={handleThrow}
                      >
                        {card.tipo}
                      </button>
                    )}
                    <b key={index}>{user.name}</b>
                  </div>
                )
              }
              return;
            })
          }
        </div>

      </div>
    </>

  );
}
