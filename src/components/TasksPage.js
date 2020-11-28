/*
  Reference for search bar = https://dev.to/iam_timsmith/lets-build-a-search-bar-in-react-120j
*/

import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './TasksPage.css'
import "./SearchBar.css"
import { parseDate } from '../utils'
// import SearchBar from "./SearchBar"

Amplify.configure(awsmobile);
const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [filteredList, setFilteredList] = useState(tasks)

  useEffect(() => {
    async function fetchTasks() {
      try {
        const sessionObject = await Auth.currentSession();
        const idToken = sessionObject ? sessionObject.idToken.jwtToken : null;
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/task`,
          {
            headers: { 'Authorization': idToken }
          }
        )
        setTasks(response.data)
        setFilteredList(response.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchTasks()
  }, []) 

  const handleChange = async e => {
    var currentTaskList = [];
    var newTaskList = [];

    if (e.target.value !== "") {
      currentTaskList = tasks; 

      newTaskList = currentTaskList.filter(task => {
        const title = task.title.toLowerCase();
        const userInput = e.target.value.toLowerCase(); 
        return title.includes(userInput);
      });
    } else { 
        newTaskList = tasks; 
    } 

    setTasks(newTaskList) 

    if(e.target.value.trim() === "") {
      setTasks(filteredList)
    }
  } 

  return (
    <div className="container tasks">
      <h1 className="custom-h1">Latest tasks</h1>

      <div className="grid-container">
        <div className="ui search grid-item">
          <input className="prompt search" type="text" placeholder="Search for a task..." onChange={e => handleChange(e)} /> 
          <div className="results"></div>
        </div>
        {/* <div className="grid-item">
          <SearchBar placeholder="Search for a task..." handleChange={e => handleChange(e)} /> 
        </div> */}
        <div className="grid-item create-btn-container">
          <Link to='/task/new'><button className='grid-item create-btn'>New task</button></Link>
        </div>
      </div>

      {!tasks.length && <div className="spinner">
        <Loader type="Oval" color="#008cff" />
      </div>}
      {tasks
        .sort((a, b) => (a.created_at > b.created_at) ? -1 : 1)  // sort by (descending) created_at
        .map(task => (
        <Link
          to={`/task/${task.id}`}
          className="task-container"
          key={task.id}
        >
          <div className="task-title">{task.title}</div>
          <div className='task-created-at'>
            Posted {parseDate(task.created_at)}
            {task.updated_at > task.created_at && ' (edited)'}
          </div>
          <div className="task-desc">{task.description}</div>
        </Link>
      ))}
    </div>
  )
}

export default withAuthenticator(TasksPage, false);