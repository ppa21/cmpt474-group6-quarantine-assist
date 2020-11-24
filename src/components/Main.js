import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Videos from './Videos';
import Login from './Login/Login';
import Contact from './Contact';
import Task from './Task'
import Profile from './Profile'
import Home from "./Home"
import TasksPage from './TasksPage';

const Main = () => (
  <Switch>
    <Route exact path = "/" component={Home} />
    <Route exact path = "/tasks/all" component={TasksPage} />
    {/* <Route path = "/videos" component = {Videos} /> */}
    <Route path="/login" exact component={Login} />
    {/* <Route path="/contact" exact component={Contact} /> */}
    <Route path='/task' component={Task} />
    <Route path='/profile' component={Profile} />
  </Switch>
)

export default Main;