import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import App from './components/App';
import GlobalStyles from './lib/GlobalStyles';
import reportWebVitals from './reportWebVitals';
import Header from './components/Header';
import Footer from './components/Footer';

import { AuthProvider } from './lib/AuthProvider';

const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple.A700
    },
  }
});

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <GlobalStyles />
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router>
            <Header />
            <App />
            <Footer />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </DndProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
 