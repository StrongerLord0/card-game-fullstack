import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

import './Game.css';
import { Card } from "./Game/Card";
import { Deck } from "./Game/Deck";

export const Game = () => {
  const { user, setUser, socket } = useContext(UserContext);

  const [yourTurn, setYourTurn] = useState(false);
  const [playedCard, setPlayedCard] = useState(null);
  const [deck, setDeck] = useState(user.deck);
  const [playedDeck, setPlayedDeck] = useState([]);
  const [trashCards, setTrashCards] = useState([]); // [{card, destination}
  const [users, setUsers] = useState(user.room.users);


  useEffect(() => {
    setYourTurn(user.room.createdBy == socket.id);

    socket.on('cardThrown', (card, destination, turn, users) => {
      console.log("Se jugó la carta:", card, "hacia", destination, ", ahora es turno de", turn, "y yo soy", socket.id);
      if(destination == "basurero") {
        setTrashCards(trashCards => [...trashCards, card])
      }
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
          id={socket.id}
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
            return <Card card={card} yourTurn={yourTurn} handlePlayedCard={handlePlayedCard} index={index} left={index == 0} right={index == 2} shadow />
          }
          )}

        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: "100%",
          height: "fit-content",
          justifyContent: "space-between",
        }}
      >
        <div className="sideContainer">
          {
            users.filter(player => player.id != socket.id).map((user, index) => {
              if (index % 2 != 0) {
                return (
                  <Deck user={user} index={index} handlePlayedCard={handlePlayedCard} handleThrow={handleThrow} yourTurn={yourTurn} left/>
                )
              }
              return;
            })
          }
        </div>
        <div
          id="basurero"
          style={{
            margin: "1rem",
            cursor: "pointer",
            width: "10rem",
            height: "10rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: "50%",
            left: "50%",
            transform: "translate(-61%, 50%) rotate(90deg)",
          }}
          onClick={handleThrow}
        >
          {
            trashCards.length > 0 ?
              <Card card={trashCards[trashCards.length - 1]} yourTurn={false}/>
            : <p>Basurero</p>
          }
        </div>
        <div className="sideContainer">
          {
            users.filter(player => player.id != socket.id).map((user, index) => {
              if (index % 2 == 0) {
                return (
                  <Deck user={user} index={index} handlePlayedCard={handlePlayedCard} handleThrow={handleThrow} yourTurn={yourTurn} right/>
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
