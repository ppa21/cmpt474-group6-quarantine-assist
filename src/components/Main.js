import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Landing from './Landing';
import Videos from './Videos';
import Login from './Login/Login';
import Contact from './Contact';

const Main = () => (
  <Switch>
    <Route exact path = "/" component = {Landing} />
    <Route path = "/videos" component = {Videos} />
    <Route path="/login" exact component={Login} />
    <Route path="/contact" exact component={Contact} />
  </Switch>
)

export default Main;