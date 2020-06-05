import React from 'react';
import { Route, BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route exact component={Home} path="/" />
                <Route component={CreatePoint} path="/create-point" />
                <Redirect to="/" />
            </Switch>
        </Router>
    )
}

export default Routes;
