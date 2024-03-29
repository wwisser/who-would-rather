import React from "react";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Alert from '@material-ui/lab/Alert';
import TableContainer from "@material-ui/core/TableContainer";
import config from "../config.json";

class Description extends React.Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            lastUpdate: '-',
            rowData: []
        };
        this.setState = this.setState.bind(this);

        this.interval = setInterval(() => {
            fetch(`${config.API_HOST}/games`, {
                headers: {
                    'Accept': 'application/json',
                },
            })
                .then(res => {
                    res.text().then(res => {
                        const games = JSON.parse(res).filter(game => game.state === 'WAITING');
                        const date = new Date();

                        const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                        const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

                        this.setState({
                            loaded: true,
                            rowData: games,
                            lastUpdate: hours + ':' + minutes + ":" + date.getSeconds()
                        });
                    })
                })
                .catch(console.error);
        }, 400);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    static getCreatedFormatted(created) {
        const diffMs = new Date() - new Date(created);

        const min = Math.floor(diffMs / 1000 / 60);

        const secs = Math.round((diffMs - (min * 1000 * 60)) / 1000);

        return min + 'm ' + secs + 's';
    }

    render() {
        return (
            <div>
                <Typography variant="h2" component="h1" gutterBottom>
                    Who Would Rather?
                </Typography>
                <Paper style={{width: '65vh', padding: 20}}>
                    <Alert style={{marginBottom: 10}} severity="info">
                        A game where up to 4 players vote each other or them selves.
                        <br/>Whoever they think a randomly occurring question applies the most.
                    </Alert>
                    <Typography component="h1" variant="h6" color="primary" gutterBottom>
                        Players
                        Online: {this.state.rowData.map(game => game.players.length).reduce((pv, cv) => pv + cv, 0)}
                    </Typography>
                    <Typography style={{marginBottom: 4, fontSize: 'small'}} color="textSecondary">
                        Last Update: {this.state.lastUpdate}
                    </Typography>
                    <Button style={{marginRight: 10}} variant="contained" color="primary" size="small"
                            onClick={() => this.props.history.push('/game')}>
                        Create a game
                    </Button>
                    <Button variant="contained" color="primary" size="small"
                            onClick={() => this.props.history.push('/game/join')}>
                        Join a game
                    </Button>
                </Paper>

                <TableContainer style={{maxHeight: 300, width: 600}}>
                    <Table size="small" style={{marginTop: 60}} stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Owner</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell align="right">Players</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.rowData.map((game) => (
                                <TableRow key={game.id}>
                                    <TableCell>{game.id}</TableCell>
                                    <TableCell>{game.owner.name}</TableCell>
                                    <TableCell>{Description.getCreatedFormatted(game.created)} ago</TableCell>
                                    <TableCell align="center">{game.players.length + '/4'}</TableCell>
                                    <TableCell align="right" style={{fontSize: '2px'}}>
                                        <Button variant="contained" color="primary" size="small" onClick={() => {
                                            const {history} = this.props;
                                            history.push(`/game/join/${game.id}`);
                                        }}>Join
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    };
}

export default withRouter(Description);
