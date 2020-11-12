import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom'
import { Auth } from 'aws-amplify';
import axios from 'axios'

const Landing = () => {
  const [tasks, setTasks] = useState([])
  const history = useHistory()
  const [attributes, setAttributes] = useState({})

  useEffect(() => {
    console.log(process.env.REACT_APP_API_URL)
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

    async function fetchUserAttributes() {
      const { attr } = await Auth.currentAuthenticatedUser();
      console.log(attr);
      setAttributes(attr);
    }

    fetchUserAttributes()
    fetchTasks()
    checkUser()
  }, [])

  const compare = (a, b) => {
    // sort by descending updated_at (most recent first)
    if (a.updated_at < b.updated_at) return 1
    else if (a.updated_at > b.updated_at) return -1
    else return 0
  }
  const checkUser = () => {
    Auth.currentAuthenticatedUser()
      .then(user =>{
        setAttributes(user.attributes)
        console.log({ user })
      })
      .catch(err => console.log(err))
  }

  return (
    <div>
      <button onClick={checkUser}>Check User</button>
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