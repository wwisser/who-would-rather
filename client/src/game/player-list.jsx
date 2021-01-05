import Avatar from "@material-ui/core/Avatar";
import React from "react";
import deepOrange from "@material-ui/core/colors/deepOrange";
import withTheme from "@material-ui/core/styles/withTheme";

function PlayerList({theme, players}) {
    const avatars = {};
    for (let i = 0; i < players.length; i++) {
        avatars[players[i].name] = {
            color: theme.palette.getContrastText(deepOrange[(i + 3) * 100]),
            backgroundColor: deepOrange[(i + 3) * 100],
        };
    }

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'nowrap',

        }}>
            {
                players.map(player =>
                    <div key={player.name} style={{
                        textAlign: 'center',
                        marginRight: '25px'
                    }}>
                        <Avatar
                            style={avatars[player.name]}
                        >
                            {player.name.split('')[0]}</Avatar>
                        <p>{player.name}</p>
                    </div>
                )
            }
        </div>
    )
}

export default withTheme(PlayerList);