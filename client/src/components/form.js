import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Paper from "@material-ui/core/Paper";
import * as PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import deepOrange from "@material-ui/core/colors/deepOrange";
import {withTheme} from '@material-ui/core/styles';
import CopyLink from "../lobby/copy-link";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 4;

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => {
    return {
        paper: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '10px'
        },
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
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
        spinner: {
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

function Form({theme}) {
    const classes = useStyles();
    const [formState, setFormState] = React.useState({
        value: 0,
        name: null,
        questionAmount: 2,
        gameId: null,
        showInput: true,
        token: null,
        game: null,
        avatarClasses: {}
    });

    const handleChange = (event, newValue) => {
        setFormState({...formState, value: newValue})
    };

    const handleClick = (event) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value
        });
    };

    const submitCreate = () => {
        fetch('http://localhost:8080/games', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formState)
        })
            .then(res => {
                res.text().then(text => {
                    const obj = JSON.parse(text);

                    formState.token = obj.token;
                    formState.gameId = obj.gameId;

                    updateGameState();
                    setInterval(updateGameState, 500);
                })
            })
            .catch(console.error)
    };

    const updateGameState = () => {
        fetch(`http://localhost:8080/games/${formState.gameId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': formState.token
            },
        })
            .then(res => {
                res.text().then(res => {
                    const game = JSON.parse(res);

                    const newAvatars = {};
                    for (let i = 0; i < game.players.length; i++) {
                        newAvatars[game.players[i].name] = {
                            color: theme.palette.getContrastText(deepOrange[(i + 3) * 100]),
                            backgroundColor: deepOrange[(i + 3) * 100],
                        };
                    }
                    setFormState({...formState, avatarClasses: newAvatars, showInput: false, game});
                })
            })
            .catch(console.error)
    };

    const submitJoin = () => {
        fetch(`http://localhost:8080/games/${formState.gameId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formState)
        })
            .then(res => {
                res.text().then(text => {
                    const obj = JSON.parse(text);

                    formState.token = obj.token;

                    updateGameState();
                    setInterval(updateGameState, 500);
                })
            })
            .catch(console.error)
    };

    return (
        formState.showInput && !formState.game ?
            <div>
                <Paper class={classes.paper}>
                    <Tabs
                        value={formState.value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        aria-label="disabled tabs example"
                    >
                        <Tab label="Join Game" {...a11yProps(0)} />
                        <Tab label="Create Game" {...a11yProps(1)} />
                    </Tabs>

                </Paper>
                <TabPanel value={formState.value} index={0}>
                    <form className={classes.root}>
                        <TextField name="name" label="Name" variant="outlined" onChange={handleClick}/>
                        <TextField name="gameId" label="Game ID" variant="outlined" onChange={handleClick}/>
                        <Button disabled={!formState.name || !formState.gameId} variant="contained" color="primary"
                                onClick={submitJoin}>Join</Button>
                    </form>
                </TabPanel>
                <TabPanel value={formState.value} index={1}>
                    <form className={classes.root}>
                        <TextField name="name" label="Name" variant="outlined" onChange={handleClick}/>
                        <TextField name="questionAmount" label="Questions" type="number" variant="outlined"
                                   defaultValue={2}
                                   onChange={handleClick}/>
                        <Button disabled={!formState.name || !formState.questionAmount} variant="contained"
                                color="primary"
                                onClick={submitCreate}>Create</Button>
                    </form>
                </TabPanel>
            </div>
            : formState.game.state === 'WAITING' ?
            <Card className={classes.waiting}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Game Lobby <i>{formState.gameId}</i>
                    </Typography>
                    <Typography variant="h5" component="h2">
                        <div className={classes.topic}>
                            <CircularProgress className={classes.spinner} size={18}/>
                            <p>
                                Waiting for Players ({formState.game.players.length}/{MAX_PLAYERS})
                            </p>
                        </div>
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        <div className={classes.players}>
                            {
                                formState.game.players.map(player =>
                                    <div className={classes.playerView}>
                                        <Avatar
                                            style={formState.avatarClasses[player.name]}
                                        >
                                            {player.name.split('')[0]}</Avatar>
                                        <p className={classes.playerName}>{player.name}</p>
                                    </div>
                                )
                            }
                        </div>
                    </Typography>
                    <Typography variant="body2" component="p">
                        Amount of players required for start: {MIN_PLAYERS}
                    </Typography>
                </CardContent>
                <CardActions>
                    {
                        formState.game.owner.name === formState.name
                            ? <Button disabled={formState.game.players.length < MIN_PLAYERS} variant="contained"
                                      color="primary">Start</Button>
                            : null
                    }
                    <CopyLink gameId={formState.gameId}/>
                </CardActions>
            </Card>
            : formState.game.state === 'PLAYING' ?
                <p>Game</p>
                : formState.game.state === 'ENDING' ?
                    <p>Ending</p>
                    : <span>Nothing</span>
    );
}

export default withTheme(Form);