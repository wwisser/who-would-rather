import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import * as PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Game from "../game/game";

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
    currentTab: PropTypes.any.isRequired,
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

export default function Form({match}) {
    const classes = useStyles();
    const [formData, setFormData] = React.useState({
        currentTab: match.path.includes('join') ? 1 : 0,
        name: null,
        questionAmount: 2,
        gameId: match.params.gameId ? match.params.gameId : null,
        token: null,
    });

    const handleTabValue = (event, newValue) => {
        setFormData({...formData, currentTab: newValue});
    };

    const handleInput = (event) => {
        setFormData({
            ...formData,
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
            body: JSON.stringify({name: formData.name, questionAmount: formData.questionAmount})
        })
            .then(res => {
                res.text().then(text => {
                    const obj = JSON.parse(text);

                    setFormData({...formData, token: obj.token, gameId: obj.gameId})
                })
            })
            .catch(console.error)
    };

    const submitJoin = () => {
        fetch(`http://localhost:8080/games/${formData.gameId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: formData.name})
        })
            .then(res => {
                res.text().then(text => {
                    const obj = JSON.parse(text);

                    setFormData({...formData, token: obj.token})
                })
            })
            .catch(console.error)
    };

    if (formData.gameId && formData.token && formData.name) {
        return <Game token={formData.token} gameId={formData.gameId} nameSelf={formData.name}/>
    }

    return (
        <Card className={classes.paper}>
            <Tabs
                value={formData.currentTab}
                onChange={handleTabValue}
                indicatorColor="primary"
                textColor="primary"
                aria-label="disabled tabs example"
            >
                <Tab label="Create Game" {...a11yProps(0)} />
                <Tab label="Join Game" {...a11yProps(1)} />
            </Tabs>

            <TabPanel value={formData.currentTab} index={0}>
                <form className={classes.root}>
                    <TextField name="name" label="Name" variant="outlined" onChange={handleInput}/>
                    <TextField name="questionAmount" label="Questions" type="number" variant="outlined"
                               defaultValue={2}
                               onChange={handleInput}/>
                    <Button disabled={!formData.name || !formData.questionAmount} variant="contained"
                            color="primary"
                            onClick={submitCreate}>Create</Button>
                </form>
            </TabPanel>
            <TabPanel value={formData.currentTab} index={1}>
                <form className={classes.root}>
                    <TextField name="name" label="Name" variant="outlined" onChange={handleInput}/>
                    <TextField name="gameId" label="Game ID" variant="outlined"
                               value={formData.gameId ? formData.gameId : ""}
                               onChange={handleInput}/>
                    <Button disabled={!formData.name || !formData.gameId} variant="contained" color="primary"
                            onClick={submitJoin}>Join</Button>
                </form>
            </TabPanel>
        </Card>
    );
}
