import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify'
import { useHistory, Link } from 'react-router-dom'
import axios from 'axios'

const Landing = () => {
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
    <div>
      <h1>Latest tasks</h1>
      <Link to='/task/new'><button>Create task</button></Link>
      {tasks.sort(compare).map(task => (
        <div
          key={task.id}
          onClick={() => history.push(`/task/${task.id}`)}
          style={{
            marginBottom: '15px',
            background: '#d7f5df',
            borderRadius: '3px',
            padding: '3px',
            cursor: 'pointer'
          }}
        >
          <h4>{task.title}</h4>
          <p>{task.description}</p>
        </div>
      ))}
    </div>
  )
}

export default Landing