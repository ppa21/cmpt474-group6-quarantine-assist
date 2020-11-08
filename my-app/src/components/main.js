import React from 'react';
import {Switch, Route} from 'react-router-dom';
import LandingPage from './landingpage';
import Videos from './videos';
import Login from './form/Login';
import Contact from './contact';
import SignUp from './form/SignUp';

const Main = () => (
  <Switch>
    <Route exact path = "/" component = {LandingPage} />
    <Route path = "/videos" component = {Videos} />
    <Route path="/login" exact component={Login} />
    <Route path="/contact" exact component={Contact} />
    <Route path = "/SignUp" component = {SignUp} />

  </Switch>
)

export default Main;
