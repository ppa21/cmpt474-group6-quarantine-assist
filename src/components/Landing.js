import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom'
import axios from 'axios'

const Landing = () => {
  const [tasks, setTasks] = useState([])
  const history = useHistory()

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/task`
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

  const parseDate = isoDate => {
    const date = new Date(isoDate)
    return date.toString().split(' ').slice(0,5).join(' ')
  }

  return (
    <div>
      <h1>Latest tasks</h1>
      <Link to='/task/new'><button>Create task</button></Link>
      {tasks.sort(compare).map(task => (
        <div
          key={task.id}
          onClick={() =>history.push(`/task/${task.id}`)}
          style={{
            marginBottom: '15px',
            background: '#d7f5df',
            borderRadius: '3px',
            padding: '3px',
            cursor: 'pointer'
          }}
        >
          <h4>{task.title} (Last updated: {parseDate(task.updated_at)})</h4>
          <p>{task.description}</p>
        </div>
      ))}
    </div>
  )
}

export default Landing