import React, { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react';
import { useHistory, useLocation } from 'react-router-dom'
import axios from 'axios'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import "./Task.css"

const Task = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [task, setTask] = useState({})

  const history = useHistory()
  const location = useLocation()
  const isNewTask = location.pathname.split('/')[2] === 'new'

  useEffect(() => {
    async function fetchTask() {
      const id = location.pathname.split('/')[2]
      const sessionObject = await Auth.currentSession();
      const idToken = sessionObject ? sessionObject.idToken.jwtToken : null;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/task/${id}`,
          {
            headers: { 'Authorization': idToken }
          }
        )
        console.log(response.data)
        setTask(response.data)
      } catch (err) {
        console.error(err)
      }
    }

    if (!isNewTask) fetchTask()

  }, [isNewTask, location.pathname])

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const sessionObject = await Auth.currentSession();
      const idToken = sessionObject ? sessionObject.idToken.jwtToken : null;
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/task`,
        {
          title,
          description
        },
        {
          headers: { 'Authorization': idToken }
        }
      )
      console.log(response.data)
      history.push(`/task/${response.data.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const parseDate = isoDate => {
    const date = new Date(isoDate)
    return date.toString().split(' ').slice(0, 5).join(' ')
  }

  return (
    <div className="container">
      {!isNewTask && !task.id && <div className="spinner">
        <Loader type="Oval" color="#008cff" />
      </div>
      }

      {isNewTask &&
        <div className="task-container">
          <form onSubmit={handleSubmit}>
            <h4>New Task</h4>
            <div className="title">
              <div className="label-container">
                <label>Title</label>
              </div>
              <input className="title-input"
                type='text' value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="description">
              <div className="label-container">
                <label>Description</label>
              </div>
              <textarea className="desc-input"
                type='text' value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="create-container">
              <input type="submit" value='Create' />
            </div>
          </form>
        </div>
      }
      {!isNewTask && task.id &&
        <div className="task-container">
          <div>
            <div className="task-title">{task.title}</div>
            <div className='task-created-at'>Posted {parseDate(task.created_at)}</div>
            <div className="task-desc">{task.description}</div>
          </div>
        </div>
      }
    </div>
  )
}

export default withAuthenticator(Task, false);
