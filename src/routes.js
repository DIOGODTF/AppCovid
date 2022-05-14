import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Principal from './components/principal';

import CovidTable from './components/covid/list.js';


const Routes = () => (
    <Switch>
        <Route exact path='/' component={Principal} />
        <Route exact path='/lista' component={CovidTable} />
    </Switch>
)

export default Routes;