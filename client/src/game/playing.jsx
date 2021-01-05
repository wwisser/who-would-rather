import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import PlayerList from "./player-list";
import React from "react";
import {makeStyles} from "@material-ui/core";
import HowToVote from '@material-ui/icons/HowToVote'

export default function Playing({game}) {
    const useStyles = makeStyles((theme) => {
        return {
            title: {
                fontSize: 13,
                marginBottom: '5px'
            },
            topic: {
                display: 'flex',
                alignItems: 'center',
                fontSize: 18,
                marginBottom: '5px'
            },
            icon: {
                height: 35,
                width: 35,
                marginRight: '15px'
            },
        };
    });

    const classes = useStyles();

    return (
        <Card>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Game <i>{game.id}</i>
                </Typography>
                <Typography variant="h5" component="h2" className={classes.topic}>
                    <HowToVote className={classes.icon}/>
                    <p>
                        Who would rather <b>{game.currentQuestion}</b>?
                    </p>
                </Typography>
                <PlayerList players={game.players}/>
                <Typography variant="body2" component="span">
                    Click an avatar to vote for a player. You can also vote for yourself.
                </Typography>
            </CardContent>
        </Card>
    );
}