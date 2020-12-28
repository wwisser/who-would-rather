import React from 'react';
import ReactDOM from 'react-dom';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Footer from "./components/footer";
import Description from "./components/description";
import Form from "./components/form";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {BrowserRouter, Route} from "react-router-dom";
import Header from "./components/header";

function App() {
    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
        },
        main: {
            marginTop: theme.spacing(8),
            marginBottom: theme.spacing(2),
        },
        footer: {
            padding: theme.spacing(3, 2),
            marginTop: 'auto',
            backgroundColor:
                theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        },
    }));

    const theme = createMuiTheme();
    const classes = useStyles();

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <div className={classes.root}>
                    <Header/>
                    <Container component="main" className={classes.main} maxWidth="sm">
                        <Route path="/game" exact component={Form}/>
                        <Route path="/game/join" exact component={Form}/>
                        <Route path="/game/join/:gameId" exact component={Form}/>
                        <Route path="/" exact component={Description}/>
                    </Container>
                    <footer className={classes.footer}>
                        <Container maxWidth="sm">
                            <Typography variant="body1">Who Would Rather?</Typography>
                            <Footer/>
                        </Container>
                    </footer>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    );
}

ReactDOM.render(
    <App/>
    ,
    document.getElementById('root')
);

