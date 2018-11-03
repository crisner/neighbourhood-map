import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import * as serviceWorker from './serviceWorker';
require('dotenv').config();

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#646464',
      main: '#3e3e3e',
      dark: '#2b2b2b',
      contrastText: '#fff',
    },
    secondary: {
      light: '#999999',
      main: '#808080',
      dark: '#595959',
      contrastText: '#fff',
    },
  },
});

ReactDOM.render(<MuiThemeProvider theme={theme}><App /></MuiThemeProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
