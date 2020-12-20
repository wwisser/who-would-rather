import Typography from "@material-ui/core/Typography";
import React from "react";

export default function Description() {
    return (
        <div>
            <Typography variant="h2" component="h1" gutterBottom>
                Who Would Rather?
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                Join or create a new game below.
            </Typography>
        </div>
    );
}