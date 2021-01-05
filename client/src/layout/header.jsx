import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import HowToVote from '@material-ui/icons/HowToVote'
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {useHistory} from "react-router-dom";
import {makeStyles} from "@material-ui/core";

export default function Header() {
    const useStyles = makeStyles((theme) => ({
        icon: {
            marginRight: theme.spacing(2)
        }
    }));

    const classes = useStyles();
    const history = useHistory();

    const navigateHome = () => {
        history.push('/');
    };

    return (
        <React.Fragment>
            <CssBaseline/>
            <AppBar position="relative">
                <Toolbar>
                    <HowToVote className={classes.icon}/>
                    <Button onClick={navigateHome}
                            style={{cursor: 'pointer', color: 'white', textTransform: 'none'}}>
                        <Typography variant="h6" color="inherit" noWrap>
                            Who Would Rather?</Typography>
                    </Button>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    )
}