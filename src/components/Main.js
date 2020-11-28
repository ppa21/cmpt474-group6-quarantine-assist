import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from './Login/Login';
import Task from './Task'
import Profile from './Profile'
import Home from "./Home"
import TasksPage from './TasksPage';
import Logs from './Logs'

const Main = () => (
  <Switch>
    <Route exact path = "/" component={Home} />
    <Route exact path = "/tasks/all" component={TasksPage} />
    <Route path="/login" exact component={Login} />
    <Route path='/task' component={Task} />
    <Route path='/profile' component={Profile} />
    <Route path='/logs' exact component={Logs} />
  </Switch>
)

export default Main;