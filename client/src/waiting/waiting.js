import React from "react";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import PlayerList from "../components/player-list";
import CardActions from "@material-ui/core/CardActions/CardActions";
import Button from "@material-ui/core/Button";
import CopyLink from "./copy-link";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => {
    return {
        waiting: {
            minWidth: 275,
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 13,
            marginBottom: '-15px'
        },
        pos: {
            marginBottom: 12,
        },
        topic: {
            display: 'flex',
            alignItems: 'center'
        },
        icon: {
            height: '10%',
            width: '10%',
            marginRight: '15px'
        },
        playerName: {
            fontSize: 13,
        },
        playerView: {
            textAlign: 'center',
            marginRight: '25px'
        },
        players: {
            display: 'flex',
            flexWrap: 'nowrap',
        }
    };
});

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 4;

export default function Waiting({game, nameSelf, token}) {
    const classes = useStyles();

    return (
        <Card className={classes.waiting}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Game Lobby <i>{game.id}</i>
                </Typography>
                <Typography variant="h5" component="h2" className={classes.topic}>
                    <CircularProgress className={classes.icon} size={18}/>
                    <p>
                        Waiting for Players ({game.players.length}/{MAX_PLAYERS})
                    </p>
                </Typography>
                <PlayerList players={game.players}/>
                <Typography variant="body2" component="span">
                    Amount of players required for start: {MIN_PLAYERS}
                </Typography>
            </CardContent>
            <CardActions>
                {
                    game.owner.name === nameSelf
                        ? <Button disabled={game.players.length < MIN_PLAYERS} variant="contained"
                                  color="primary" onClick={() => {
                            fetch(`http://localhost:8080/games/${game.id}/start`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Token': token
                                },
                            }).catch(console.error)
                        }
                        }>Start</Button>
                        : null
                }
                <CopyLink gameId={game.id}/>
            </CardActions>
        </Card>
    );
}