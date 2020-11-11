import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'

const Landing = () => {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL)
        console.log(response.data)
        setTasks(response.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchTasks()
  }, [])

  const parseDate = isoDate => {
    const date = new Date(isoDate)
    return date.toString().split(' ').slice(0,5).join(' ')
  }

  return (
    <div>
      <h1>Landing Page</h1>
      <Link to='/task/new'><button>Create task</button></Link>
      {tasks.reverse().map(task => (
        <div key={task.title}>
          <h4>{task.title} (Last updated: {parseDate(task.updated_at)})</h4>
          <p>{task.description}</p>
        </div>
      ))}
    </div>
  )
}

export default Landing