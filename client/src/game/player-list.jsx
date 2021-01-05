import Avatar from "@material-ui/core/Avatar";
import React from "react";
import deepOrange from "@material-ui/core/colors/deepOrange";
import withTheme from "@material-ui/core/styles/withTheme";
import Badge from "@material-ui/core/Badge";
import VerifiedUserTwoToneIcon from '@material-ui/icons/VerifiedUserTwoTone';
import withStyles from "@material-ui/core/styles/withStyles";

function PlayerList({theme, game, token}) {
    const isVotingEnabled = () => game.state === 'PLAYING';
    const hasVoted = (player) => {
        return game.votes[game.currentQuestion]?.find(vote => vote.from.name === player.name)
    };

    const avatars = {};
    for (let i = 0; i < game.players.length; i++) {
        avatars[game.players[i].name] = {
            color: theme.palette.getContrastText(deepOrange[(i + 3) * 100]),
            backgroundColor: deepOrange[(i + 3) * 100],
            cursor: isVotingEnabled() && !hasVoted(game.players[i]) ? 'pointer' : null
        };

    }

    const VotedIcon = withStyles(() => ({
        root: {
            width: 17,
            height: 17,
            fill: 'green',
        },
    }))(VerifiedUserTwoToneIcon);

    const getAvatar = (player) => {
        return <Avatar onClick={() => submitVote(player.name)}
                       style={avatars[player.name]}>{player.name.split('')[0]}</Avatar>
    };

    const submitVote = (target) => {
        fetch(`http://localhost:8080/games/${game.id}/votes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Token': token,
            },
            body: JSON.stringify({target: target})
        }).catch(console.error)
    };

    return (
        <div style={{display: 'flex', flexWrap: 'nowrap',}}>
            {
                game.players.map(player =>
                    <div key={player.name} style={{textAlign: 'center', marginRight: '25px'}}>
                        {
                            isVotingEnabled() && hasVoted(player)
                                ? <div>
                                    <Badge
                                        overlap="circle"
                                        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                                        badgeContent={<VotedIcon/>}
                                    >
                                        {getAvatar(player)}
                                    </Badge>
                                    <p>{player.name}</p>
                                </div>
                                : <div>
                                    {getAvatar(player)}
                                    <p>{player.name}</p>
                                </div>
                        }
                    </div>
                )
            }
        </div>
    )
}

export default withTheme(PlayerList);