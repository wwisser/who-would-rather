import React from "react";
import Button from "@material-ui/core/Button";

export default function CopyLink({gameId}) {
    const [copied, setCopied] = React.useState(false);

    return (
        <Button variant="contained" color="primary"
                size="small"
                onClick={() => {
                    const input = document.createElement('input');
                    input.setAttribute('currentTab', 'http://localhost:3000/game/join/' + gameId);
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