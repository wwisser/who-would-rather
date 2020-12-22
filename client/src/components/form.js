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
import deepPurple from "@material-ui/core/colors/deepPurple";
import deepOrange from "@material-ui/core/colors/deepOrange";

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
    const styles = {
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
            fontSize: 13
        },
    };

    return styles;
});

export default function Form() {
    const classes = useStyles();
    const [formState, setFormState] = React.useState({
        value: 0,
        name: null,
        questionAmount: 2,
        gameId: null,
        showInput: true,
        token: null,
        game: null,
        copied: false,
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
                    updateGameState()
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
                    formState.game = JSON.parse(res);
                    setFormState({
                        ...formState,
                        showInput: false
                    });

                    for (let i = 0; i < formState.game.players.length; i++) {
                        classes[formState.game.players[i].name] = makeStyles((theme) => {
                            return {
                                color: theme.palette.getContrastText(deepOrange[i * 100]),
                                backgroundColor: deepOrange[i * 100]
                            }
                        })();
                    }
                })
            })
            .catch(console.error)
    };

    const submitJoin = () => {
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
                                Waiting for Players ({formState.game.players.length}/2)
                            </p>
                        </div>
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        {
                            formState.game.players.map(player =>
                                <div>
                                    <Avatar
                                        className={classes[player.name]}
                                    >
                                        {player.name.split('')[0]}</Avatar>
                                    <p className={classes.playerName}>{player.name}</p>
                                </div>
                            )
                        }
                    </Typography>
                    <Typography variant="body2" component="p">
                        well meaning and kindly.
                        <br/>
                        {'"a benevolent smile"'}
                    </Typography>
                </CardContent>
                <CardActions>
                    {
                        formState.game.owner.name === formState.name
                            ? <Button disabled={formState.game.players.length < 2} variant="contained"
                                      color="primary">Start</Button>
                            : null
                    }
                    <Button variant="contained" color="primary"
                            size="small"
                            onClick={() => {
                                const input = document.createElement('input');
                                input.setAttribute('value', 'http://localhost:3000/game/' + formState.gameId);
                                document.body.appendChild(input);
                                input.select();
                                document.execCommand('copy');
                                document.body.removeChild(input);
                                setFormState({...formState, copied: true});
                            }}
                    >{formState.copied === false ? 'Copy Invite Link' : 'Copied to Clipboard'}
                    </Button>
                </CardActions>
            </Card>
            : formState.game.state === 'PLAYING' ?
                <p>Game</p>
                : formState.game.state === 'ENDING' ?
                    <p>Ending</p>
                    : <span>Nothing</span>
    );
}