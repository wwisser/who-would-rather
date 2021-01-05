import React, {useEffect} from "react";
import Waiting from "./waiting";
import Playing from "./playing";

export default function Game({gameId, nameSelf, token}) {
    const [game, setGame] = React.useState({});

    const updateGameState = () => {
        fetch(`http://localhost:8080/games/${gameId}`, {
            headers: {
                'Accept': 'application/json',
                'Token': token
            },
        })
            .then(res => res.text().then(res => setGame(JSON.parse(res))))
            .catch(console.error)
    };

    useEffect(() => {
        updateGameState();
        const interval = setInterval(updateGameState, 400);

        return () => {
            clearInterval(interval);
        };
    });

    switch (game.state) {
        case 'WAITING':
            return <Waiting nameSelf={nameSelf} token={token} game={game}/>;
        case 'PLAYING':
            return <Playing game={game}/>;
        case 'ENDING':
            return <p>Thanks for playing</p>;
        default:
            return <p>Loading...</p>;
    }
}

