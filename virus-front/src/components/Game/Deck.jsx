import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Card } from "./Card"

export const Deck = ({user, index, handleThrow, yourTurn, handlePlayedCard, left}) => {
    
    const {socket} = useContext(UserContext);

    return (
        <div
            className={(index == 0 ? 'topPlayer' : left ? 'leftSidePlayer' : 'rightSidePlayer') + " gameDeck"}
        >
            <div
                id={socket.id}
                style={{
                    width: "calc(100% - 2rem)",
                    height: "10rem",
                    margin: "1rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                }}
                onClick={handleThrow}
                className="playedDeck"
            >
                {user.playedDeck.map((card, index) =>
                    <Card card={card} yourTurn={yourTurn} handlePlayedCard={handlePlayedCard} index={index} />
                )}
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "calc(100% - 2rem)",
                    margin: "1rem",
                }}
            >
                <Card shadow back left/>
                <Card shadow back/>
                <Card shadow back right/>
            </div>
            <b key={index}>{user.name}</b>
        </div>
    )
}
