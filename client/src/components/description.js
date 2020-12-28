import Typography from "@material-ui/core/Typography";
import React from "react";
import Card from "@material-ui/core/Card";

export default function Description() {
    return (
        <div>
            <Typography variant="h2" component="h1" gutterBottom>
                Who Would Rather?
            </Typography>
            <Card style={{width: 40}}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Join or create a new game below.
                </Typography>
            </Card>
        </div>
    );
}