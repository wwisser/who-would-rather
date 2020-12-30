import React from "react";
import GitHubIcon from '@material-ui/icons/GitHub';
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";

export default function Footer() {
    return (
        <Grid container direction="row" alignItems="center">
            <Link color="inherit" href="https://github.com/wwisser">
                <GitHubIcon style={{marginRight: 8}}/>
            </Link>
            <a href="https://github.com/wwisser" style={{textDecoration: 'none', color: 'black'}}>@wwisser</a>
        </Grid>
    );
}