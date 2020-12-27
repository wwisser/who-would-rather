import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from "./components/copyright";
import Description from "./components/description";
import Form from "./components/form";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


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


function App() {
    const theme = createMuiTheme();
    const classes = useStyles();
    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <CssBaseline />
                <Container component="main" className={classes.main} maxWidth="sm">
                    <Description/>
                    <Form/>
                </Container>
                <footer className={classes.footer}>
                    <Container maxWidth="sm">
                        <Typography variant="body1">Who Would Rather?</Typography>
                        <Copyright />
                    </Container>
                </footer>
            </div>
        </ThemeProvider>
    );
}

ReactDOM.render(<App/>, document.getElementById('root'));

