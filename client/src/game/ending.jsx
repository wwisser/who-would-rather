import Avatar from "@material-ui/core/Avatar";
import React from "react";
import deepOrange from "@material-ui/core/colors/deepOrange";
import withTheme from "@material-ui/core/styles/withTheme";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import HowToVote from "@material-ui/icons/HowToVote";
import {makeStyles} from "@material-ui/core";
import {Divider} from "@mui/material";

function Ending({theme, game}) {
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
    const avatars = {};
    const classes = useStyles();


    const updateAvatars = () => {
        for (let i = 0; i < game.players.length; i++) {
            avatars[game.players[i].name] = {
                color: theme.palette.getContrastText(deepOrange[(i + 3) * 100]),
                backgroundColor: deepOrange[(i + 3) * 100]
            };

        }
    };
    updateAvatars();

    const getAvatar = (name) => {
        if (!name) {
            return <p>what</p>
        }

        return <Avatar
            style={avatars[name]}>{name.split('')[0]}</Avatar>
    };

    const getVoteResults = () => {
        return Object.keys(game.votes).map(question => {
            const results = game.votes[question].map(vote => {
                return {
                    name: vote.target.name,
                    voters: [],
                    count: 0
                }
            });

            game.votes[question].forEach(vote => {
                results.find(result => result.name === vote.target.name).count += 1;
                results.find(result => result.name === vote.target.name).voters.push(vote.from.name);
            });


            const countPerTarget = {};
            results.forEach(result => countPerTarget[result.name] = result.count)

            const sortedKeys = Object.keys(countPerTarget).sort(function (a, b) {
                return countPerTarget[b] - countPerTarget[a]
            });

            return {
                question,
                result: results.find(result => result.name === sortedKeys[0])
            }
        })
    }

    return (
        <Card>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Game <i>{game.id}</i>
                </Typography>
                <Typography variant="h5" component="h2" className={classes.topic}>
                    <HowToVote className={classes.icon}/>
                    <p>
                        Thank you for playing!
                    </p>
                </Typography>
                <div>
                    <h1>Results</h1>
                    <Divider style={{marginBottom: 25}}/>

                    {
                        getVoteResults().map(resultEntry =>
                            <div>
                                {getAvatar(resultEntry.result.name)}
                                <p>Who would rather <b>{resultEntry.question}</b>?</p>

                                <p><b>Winner</b>: {resultEntry.result.name} ({resultEntry.result.count} votes)</p>
                                <p><b>Voters</b>: {resultEntry.result.voters.join(', ')} </p>
                                <Divider style={{marginBottom: 25}}/>
                            </div>
                        )
                    }
                </div>
            </CardContent>
        </Card>
    )
}

export default withTheme(Ending);