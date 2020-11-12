import React, { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'
import { useHistory, useLocation } from 'react-router-dom'
import axios from 'axios'

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
    <div>
      {isNewTask &&
        <form onSubmit={handleSubmit}>
          <h4>New Task</h4>
          <label>Title</label>
          <input type='text' value={title} onChange={e => setTitle(e.target.value)} />
          <label>Description</label>
          <textarea type='text' value={description} onChange={e => setDescription(e.target.value)} />
          <input type="submit" value='Create' />
        </form>
      }
      {task.id &&
        <div>
          <h4>{task.title} (Last updated: {parseDate(task.updated_at)})</h4>
          <p>{task.description}</p>
        </div>
      }
    </div>
  )
}

export default Task
