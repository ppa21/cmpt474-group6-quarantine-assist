import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify'
import { useHistory, Link } from 'react-router-dom'
import axios from 'axios'
import AWS from 'aws-sdk';
import Amplify from 'aws-amplify';
import {awsmobile, awsconfig} from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import TaskItem from './TaskItem'
import './TasksPage.css'

AWS.config.update(awsconfig);
Amplify.configure(awsmobile);
const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const history = useHistory()

  useEffect(() => {
    console.log(process.env.REACT_APP_API_URL)
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
        console.log(response.data)
        setTasks(response.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchTasks()
  }, [])

  const compare = (a, b) => {
    // sort by descending updated_at (most recent first)
    if (a.updated_at < b.updated_at) return 1
    else if (a.updated_at > b.updated_at) return -1
    else return 0
  }


  return (
    <div className="container">
      <h1>Latest tasks</h1>
      {!tasks.length && <div className="spinner">
        <Loader type="Oval" color="#008cff" />
      </div>}

      {tasks.sort(compare).map(task => (
        <TaskItem 
          className="task-container"
          key={task.id}
          handleClick={() => history.push(`/task/${task.id}`)}
          title={task.title}          
          desc={task.description}
          user_id={task.user_id}
        />
      ))}
      <div className="create-btn-container">
        <Link to='/task/new'><button className='create-btn'>Create task</button></Link>
      </div>
    </div>
  )
}

export default withAuthenticator(TasksPage, false);