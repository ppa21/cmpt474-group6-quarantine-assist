import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Landing from './Landing';
import Videos from './Videos';
import Login from './Login/Login';
import Contact from './Contact';
import Task from './Task'

const Main = () => (
  <Switch>
    <Route exact path = "/" component = {Landing} />
    <Route path = "/videos" component = {Videos} />
    <Route path="/login" exact component={Login} />
    <Route path="/contact" exact component={Contact} />
    <Route path='/task' component={Task} />
  </Switch>
)

export default Main;