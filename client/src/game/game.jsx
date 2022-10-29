import React, {useEffect} from "react";
import Waiting from "./waiting";
import Playing from "./playing";
import Ending from "./ending";
import config from "../config.json";

export default function Game({gameId, nameSelf, token}) {
    const [game, setGame] = React.useState({});

    const updateGameState = () => {
        if (game.state === 'ENDING') {
            return;
        }

        fetch(`${config.API_HOST}/games/${gameId}`, {
            headers: {
                'Accept': 'application/json',
                'Token': token
            },
        })
            .then(res => res.text().then(res => setGame(JSON.parse(res))))
            .catch(console.error)
    };

    useEffect(() => {
        const interval = setInterval(updateGameState, 400);

        return () => {
            clearInterval(interval);
        };
    });

    switch (game.state) {
        case 'WAITING':
            return <Waiting nameSelf={nameSelf} token={token} game={game}/>;
        case 'PLAYING':
            return <Playing game={game} token={token} nameSelf={nameSelf}/>;
        case 'ENDING':
            return <Ending game={game} nameSelf={nameSelf}/>;
        default:
            return <p>Loading...</p>;
    }
}

