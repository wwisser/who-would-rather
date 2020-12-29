import React from "react";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import {Title} from "@material-ui/icons";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";

export default class Description extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            rowData: []
        };
        this.setState = this.setState.bind(this);

        setInterval(() => {
            fetch(`http://localhost:8080/games`, {
                headers: {
                    'Accept': 'application/json',
                },
            })
                .then(res => {
                    res.text().then(res => {
                        const games = JSON.parse(res);

                        this.setState({loaded: true, rowData: games})
                    })
                })
                .catch(console.error);
        }, 400);
    }

    render() {
        return (
            <div>
                <Typography variant="h2" component="h1" gutterBottom>
                    Who Would Rather?
                </Typography>
                <Card style={{minWidth: 275}}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Join or create a new game below.
                    </Typography>
                </Card>
                <Title>Recent Orders</Title>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Owner</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell align="right">Players</TableCell>
                            <TableCell >Join</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.rowData.map((game) => (
                            <TableRow key={game.id}>
                                <TableCell>{game.owner.name}</TableCell>
                                <TableCell>{game.created}</TableCell>
                                <TableCell align="center">{game.players.length + '/4'}</TableCell>
                                <TableCell align="right"><Button>187</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    };
}