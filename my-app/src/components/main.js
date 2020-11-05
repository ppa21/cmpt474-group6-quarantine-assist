import React from 'react';
import {Switch, Route} from 'react-router-dom';
import LandingPage from './landingpage';
import Videos from './videos';
import Login from './login';
import Contact from './contact';

const Main = () => (
  <Switch>
    <Route exact path = "/" component = {LandingPage} />
    <Route path = "/videos" component = {Videos} />
    <Route path="/login" exact component={Login} />
    <Route path="/contact" exact component={Contact} />

  </Switch>
)

export default Main;
