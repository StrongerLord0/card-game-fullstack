import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

import './Game.css';
import { Card } from "./Game/Card";

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
        className="myCards"
      >
        <div
          id="myCards"
          onClick={handleThrow}
          className="playDeck"
        >
          <div
            className="playedDeck"
          >
            {playedDeck.map((card, index) =>
              <Card card={card} yourTurn={yourTurn} handlePlayedCard={handlePlayedCard} index={index} />
            )}
          </div>
        </div>
        <div
          className="deck"
        >
          {deck.map((card, index) => {
            return <Card card={card} yourTurn={yourTurn} handlePlayedCard={handlePlayedCard} index={index} left={index == 0} right={index == 2} shadow/>
          }
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
                display: "flex",
                width: 'fit-content',
                transform: "rotate(180deg)",
              } : {};
              if (index % 2 != 0) {
                return (
                  <div
                    style={{
                      border: "solid 1px red",
                      margin: "1rem",
                      transform: "rotate(90deg)",
                      display: "flex",
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
                      <Card card={card} yourTurn={yourTurn} handlePlayedCard={handlePlayedCard} index={index} />
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
                  className="myCards"
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
                        display: "flex",
                      }}
                      onClick={handleThrow}
                    >
                      <p>PlayDeck</p>
                    </div>
                    <div
                      style={{
                        display: 'flex'
                      }}
                    >
                      {user.playedDeck.map((card, index) =>
                        <Card card={card} yourTurn={yourTurn} handlePlayedCard={handlePlayedCard} index={index} />
                      )}
                    </div>
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
