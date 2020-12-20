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

const useStyles = makeStyles((theme) => ({
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
}));

export default function Form() {
    const classes = useStyles();
    const [formState, setFormState] = React.useState({value: 0});

    const handleChange = (event, newValue) => {
        setFormState({...formState, value: newValue})
    };

    const handleClick = (event) => {
        setFormState({...formState, [event.target.name]: event.target.value});

        console.log(formState);
    };

    return (
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
                    <Button variant="contained" color="primary" >Join</Button>
                </form>
            </TabPanel>
            <TabPanel value={formState.value} index={1}>
                <form className={classes.root}>
                    <TextField name="name" label="Name" variant="outlined" onChange={handleClick}/>
                    <TextField name="questionAmount" label="Questions" type="number" variant="outlined" onChange={handleClick}/>
                    <Button variant="contained" color="primary">Create</Button>
                </form>
            </TabPanel>
        </div>
    );
}