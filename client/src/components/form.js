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
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Paper class={classes.paper}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="disabled tabs example"
                >
                    <Tab label="Join Game" {...a11yProps(0)} />
                    <Tab label="Create Game" {...a11yProps(1)} />
                </Tabs>

            </Paper>
            <TabPanel value={value} index={0}>
                <form className={classes.root}>
                    <TextField id="outlined-basic" label="Name" variant="outlined"/>
                    <TextField id="outlined-basic" label="Game ID" variant="outlined"/>
                    <Button variant="contained" color="primary" href="#contained-buttons">Join</Button>
                </form>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <form className={classes.root}>
                    <TextField id="outlined-basic" label="Name" variant="outlined"/>
                    <TextField id="outlined-basic" label="Questions" type="number" variant="outlined"/>
                    <Button variant="contained" color="primary" href="#contained-buttons">Create</Button>
                </form>
            </TabPanel>
        </div>
    );
}