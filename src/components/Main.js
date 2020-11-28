import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from './Login/Login';
import Task from './Task'
import Profile from './Profile'
import Home from "./Home"
import TasksPage from './TasksPage';
import VolunteeredTasks from "./VolunteeredTasks"
import MyTasks from "./MyTasks"

const Main = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/tasks/all" component={TasksPage} />
    <Route path="/tasks/volunteered_tasks" component={VolunteeredTasks} />
    <Route path="/tasks/mytasks" component={MyTasks} />
    <Route path="/login" exact component={Login} />
    <Route path='/task' component={Task} />
    <Route path='/profile' component={Profile} />
  </Switch>
)

export default Main;