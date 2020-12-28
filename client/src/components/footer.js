import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import React from "react";

export default function Footer() {
    return (
        <Typography variant="body2" color="textSecondary">
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/wwisser">
                Wendelin Wisser
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}