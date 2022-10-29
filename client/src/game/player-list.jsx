import Avatar from "@material-ui/core/Avatar";
import React from "react";
import deepOrange from "@material-ui/core/colors/deepOrange";
import withTheme from "@material-ui/core/styles/withTheme";
import config from "../config.json";

function PlayerList({theme, game, token, nameSelf}) {
    const isVotingEnabled = () => game.state === 'PLAYING';
    const didVoteForPlayer = (player) => {
        return game.votes[game.currentQuestion]?.some(vote => vote.target.name === player.name && vote.from.name === nameSelf);
    };

    const didVote = () => {
        return game.votes[game.currentQuestion]?.some(vote => vote.from.name === nameSelf);
    };

    const avatars = {};

    const updateAvatars = () => {
        for (let i = 0; i < game.players.length; i++) {
            const player = game.players[i];

            const style = {
                color: theme.palette.getContrastText(deepOrange[(i + 3) * 100]),
                backgroundColor: deepOrange[(i + 3) * 100],
                cursor: isVotingEnabled() && !didVote() ? 'pointer' : null
            };

            if (game.votes[game.currentQuestion]?.find(vote => vote.target.name === player.name && vote.from.name === nameSelf)) {
                style.border = '2px solid yellowgreen';
            }

            avatars[player.name] = style;
        }
    };

    updateAvatars();

    const getAvatar = (player) => {
        return <Avatar onClick={() => submitVote(player)}
                       style={avatars[player.name]}>{player.name.split('')[0]}</Avatar>
    };

    const submitVote = (target) => {
        if (!isVotingEnabled() || didVote()) {
            return;
        }

        fetch(`${config.API_HOST}/games/${game.id}/votes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Token': token,
            },
            body: JSON.stringify({target: target.name})
        }).then(updateAvatars).catch(console.error)
    };

    const getPlayerName = (name) => {
        return (
            <p style={{fontSize: "smaller"}}>{name} {nameSelf === name ? '(you)' : ''}</p>
        )
    }

    return (
        <div style={{display: 'flex', flexWrap: 'nowrap',}}>
            {
                game.players.map(player =>
                    <div key={player.name} style={{textAlign: 'center', marginRight: '25px'}}>
                        <div>
                            {getAvatar(player)}
                            {getPlayerName(player.name)}
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default withTheme(PlayerList);