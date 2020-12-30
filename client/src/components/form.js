import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import * as PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import CopyLink from "../lobby/copy-link";
import {useHistory} from "react-router-dom";
import PlayerList from "./player-list";
import Playing from "../lobby/playing";

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
                    <div>{children}</div>
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
            padding: '10px',
            minWidth: 275
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

function Form({match}) {
    const history = useHistory();

    const showJoin = match.path.includes('join');

    const classes = useStyles();
    const [formState, setFormState] = React.useState({
        value: showJoin ? 1 : 0,
        name: null,
        questionAmount: 2,
        gameId: match.params.gameId ? match.params.gameId : null,
        showInput: true,
        token: null,
        game: null
    });

    let interval = null;

    const handleChange = (event, newValue) => {
        setFormState({...formState, value: newValue});
        history.push(newValue === 0 ? '/game' : '/game/join');
    };

    const handleInput = (event) => {
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
                    interval = setInterval(updateGameState, 500);
                })
            })
            .catch(console.error)
    };

    const updateGameState = () => {
        fetch(`http://localhost:8080/games/${formState.gameId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Token': formState.token
            },
        })
            .then(res => {
                res.text().then(res => {
                    const game = JSON.parse(res);

                    if (game.state === 'ENDING') {
                        clearInterval(interval);
                    }

                    setFormState({...formState, showInput: false, game});
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
            <Card className={classes.paper}>
                <Tabs
                    value={formState.value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="disabled tabs example"
                >
                    <Tab label="Create Game" {...a11yProps(0)} />
                    <Tab label="Join Game" {...a11yProps(1)} />
                </Tabs>

                <TabPanel value={formState.value} index={0}>
                    <form className={classes.root}>
                        <TextField name="name" label="Name" variant="outlined" onChange={handleInput}/>
                        <TextField name="questionAmount" label="Questions" type="number" variant="outlined"
                                   defaultValue={2}
                                   onChange={handleInput}/>
                        <Button disabled={!formState.name || !formState.questionAmount} variant="contained"
                                color="primary"
                                onClick={submitCreate}>Create</Button>
                    </form>
                </TabPanel>
                <TabPanel value={formState.value} index={1}>
                    <form className={classes.root}>
                        <TextField name="name" label="Name" variant="outlined" onChange={handleInput}/>
                        <TextField name="gameId" label="Game ID" variant="outlined"
                                   value={formState.gameId ? formState.gameId : ""}
                                   onChange={handleInput}/>
                        <Button disabled={!formState.name || !formState.gameId} variant="contained" color="primary"
                                onClick={submitJoin}>Join</Button>
                    </form>
                </TabPanel>
            </Card>

            : formState.game.state === 'WAITING' ?
            <Card className={classes.waiting}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Game Lobby <i>{formState.gameId}</i>
                    </Typography>
                    <Typography variant="h5" component="h2" className={classes.topic}>
                        <CircularProgress className={classes.icon} size={18}/>
                        <p>
                            Waiting for Players ({formState.game.players.length}/{MAX_PLAYERS})
                        </p>
                    </Typography>
                    <PlayerList players={formState.game.players}/>
                    <Typography variant="body2" component="span">
                        Amount of players required for start: {MIN_PLAYERS}
                    </Typography>
                </CardContent>
                <CardActions>
                    {
                        formState.game.owner.name === formState.name
                            ? <Button disabled={formState.game.players.length < MIN_PLAYERS} variant="contained"
                                      color="primary" onClick={() => {
                                fetch(`http://localhost:8080/games/${formState.gameId}/start`, {
                                    method: 'PUT',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                        'Token': formState.token
                                    },
                                    body: JSON.stringify(formState),
                                })
                                    .then(res => {
                                        res.text().then(() => {
                                            formState.game.state = 'PLAYING';
                                            setFormState(formState);
                                        })
                                    })
                                    .catch(console.error)
                            }
                            }>Start</Button>
                            : null
                    }
                    < CopyLink gameId={formState.gameId}/>
                </CardActions>
            </Card>
            : formState.game.state === 'PLAYING' ?
                <Playing game={formState.game} token={formState.token}/>
                : formState.game.state === 'ENDING' ?
                    <p>Ending</p>
                    : <span>Nothing</span>
    );
}

export default Form;