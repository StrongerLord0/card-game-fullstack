import deckCards from "../../helpers/cards";
import backCard from "../../assets/Cards/back_big.png"
export const Card = ({ card, yourTurn, handlePlayedCard = null, index = 0, shadow, left, right, back }) => {
    console.log(card);

    if (back)
        return (
            (<button
                key={index}
                className={`gameCard ${left ? "left" : ""} ${right ? "right" : ""}`}
                disabled
            >
                {<img
                    style={{
                        filter: shadow ? "drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.35))" : "",
                    }}
                    src={backCard} alt=""
                />
                }
            </button>)
        )

    return (
        (<button
            id={card.id}
            key={index}
            className={`gameCard ${left ? "left" : ""} ${right ? "right" : ""}`}
            disabled={!yourTurn}
            onClick={handlePlayedCard}
        >
            {<img
                style={{
                    filter: shadow ? "drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.35))" : "",
                }}
                src={deckCards.find(deckCard => deckCard.color == card.color && deckCard.tipo == card.tipo).img} alt=""
            />
            }
        </button>)
    )
}
