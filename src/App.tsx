import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TableView from './views/TableView';
import PivotTableView from './views/PivotTableView';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Primary color
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    h4: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App-header">
          <Switch>
            <Route path="/pivot-table">
              <PivotTableView />
            </Route>
            <Route path="/">
              <TableView />
            </Route>
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
