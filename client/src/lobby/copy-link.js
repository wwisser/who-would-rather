import React from "react";
import Button from "@material-ui/core/Button";

export default function CopyLink(props) {
    const [copied, setCopied] = React.useState(false);

    return (
        <Button variant="contained" color="primary"
                size="small"
                onClick={() => {
                    const input = document.createElement('input');
                    input.setAttribute('value', 'http://localhost:3000/game/' + props.gameId);
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand('copy');
                    document.body.removeChild(input);
                    setCopied(true);
                }}
        >
            {copied ? 'Copied to Clipboard' : 'Copy Invite Link'}
        </Button>
    );
}