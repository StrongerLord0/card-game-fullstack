import deckCards from "../../helpers/cards";

export const Card = ({ card, yourTurn, handlePlayedCard, index, shadow, left, right }) => {
    return (
        (<button
            id={card.id}
            key={index}
            className={`gameCard ${left ? "left" : ""} ${right ? "right" : ""}`}
            disabled={!yourTurn}
            onClick={handlePlayedCard}
        >
            {card.tipo != "tratamiento" && <img
                style={{
                    filter: shadow ? "drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.35))" : "",
                }}
                src={deckCards.find(deckCard => deckCard.color == card.color && deckCard.tipo == card.tipo).img} alt=""
            />
            }
        </button>)
    )
}
