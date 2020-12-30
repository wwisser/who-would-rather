import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import PlayerList from "../components/player-list";
import React from "react";
import {makeStyles} from "@material-ui/core";
import HowToVote from '@material-ui/icons/HowToVote'


export default function Playing({game, token}) {
    const useStyles = makeStyles((theme) => {
        return {
            paper: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                padding: '10px',
                minWidth: 275
            },
            root: {
                '& > *': {
                    margin: theme.spacing(1),
                    width: '25ch',
                },
            },
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

    console.log(game);

    const [votes, setVotes] = React.useState({});

    const interval = setInterval(() => {
        fetch(`http://localhost:8080/games/${game.id}/votes`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Token': token
            },
        })
            .then(res => {
                res.text().then(res => {
                    const votes = JSON.parse(res);

                    if (game.state === 'ENDING') {
                        clearInterval(interval);
                    }

                    setVotes(votes);
                    console.log(votes);
                })
            })
            .catch(console.error)
    }, 400);

    return (
        <Card className={classes.waiting}>
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