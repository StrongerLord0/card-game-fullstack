import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Card } from "./Card"
import avatars from "../../helpers/avatars";

export const Deck = ({ user, index, handleThrow, yourTurn, handlePlayedCard, left }) => {

    const { color, avatar, name } = user;
    const { socket } = useContext(UserContext);

    return (
        <div
            className={(index == 0 ? 'topPlayer' : left ? 'leftSidePlayer' : 'rightSidePlayer') + " gameDeck"}
        >
            <div className="avatarContainer">
                <img
                    style={{
                        marginTop: "1rem",
                        border: `solid 0.5rem ${color}`,
                        borderRadius: "1rem",
                        height: "5rem",
                        width: "5rem",
                        boxShadow: "0 0 0rem 4px #00000024",
                        transition: "all 0.2s ease-in-out",
                    }}
                    src={avatars[avatar]} alt=""
                />
                <p>{name}</p>
            </div>
            <div
                id={user.id}
                onClick={handleThrow}
                className="playedDeck"
            >
                {user.playedDeck.map((card, index) =>
                    <Card card={card} yourTurn={yourTurn} handlePlayedCard={handlePlayedCard} index={index} />
                )}
            </div>
            <div
                className="playerDeck"
            >
                <Card shadow back left />
                <Card shadow back />
                <Card shadow back right />
            </div>
        </div>
    )
}
