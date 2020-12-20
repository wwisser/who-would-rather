import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(() => ({
    paper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '10px'
    },
}));

export default function Form() {
    const classes = useStyles();

    return (
        <Paper class={classes.paper}>
            <Tabs
                value={0}
                indicatorColor="primary"
                textColor="primary"
                onChange={() => console.log('187')}
                aria-label="disabled tabs example"
            >
                <Tab label="Create Game"/>
                <Tab label="Join Game"/>
            </Tabs>

        </Paper>
    );
}