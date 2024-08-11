import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TableView from './views/TableView';
import PivotTableView from './views/PivotTableView';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/pivot-table">
          <PivotTableView />
        </Route>
        <Route path="/">
          <TableView />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
