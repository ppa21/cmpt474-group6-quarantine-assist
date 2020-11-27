import React, { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react';
import { useHistory, useLocation } from 'react-router-dom'
import axios from 'axios'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import "./Task.css"
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const Task = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [task, setTask] = useState({})
  const [ownsTask, setOwnsTask] = useState(false)
  const [status, setStatus] = useState('')

  const history = useHistory()
  const location = useLocation()
  const isNewTask = location.pathname.split('/')[2] === 'new'

  const [anchorEl, setAnchorEl] = React.useState(null);

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
        const userInfo = await Auth.currentUserInfo()
        setOwnsTask(response.data.user_id === userInfo.attributes.sub)
        setTask(response.data)
        setDescription(response.data.description)
      } catch (err) {
        console.error(err)
      }
    }

    if (!isNewTask) fetchTask()

  }, [isNewTask, location.pathname])

  const deleteTask = async e => {
    e.preventDefault()
    try {
      const sessionObject = await Auth.currentSession();
      const idToken = sessionObject ? sessionObject.idToken.jwtToken : null;
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/task/${task.id}`,
        {
          headers: { 'Authorization': idToken }
        }
      )
      console.log(response.data)

      invalidateTasksCache(idToken);

      history.push(`/tasks/all`)
    } catch (err) {
      console.error(err)
    }
  }

  const validationCheck = async event => {
    event.preventDefault();

    // for(var e : event) {
      
    // }

    if(event === null) {
      alert("can't be null.")
      return false
    } else {
      return true
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if(title.trim() !== "") {
      try {
        const sessionObject = await Auth.currentSession();
        const idToken = sessionObject ? sessionObject.idToken.jwtToken : null;
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/task`,
          {
            title,
            description,
            status
          },
          {
            headers: { 'Authorization': idToken }
          }
        )
        console.log(response.data)

        invalidateTasksCache(idToken);
  
        history.push(`/task/${response.data.id}`)
      } catch (err) {
        console.error(err)
      }
    } else {
      alert("Title can't be empty.");
      return;
    }
  }

  const updateTask = async e => {
    e.preventDefault()
    try {
      const sessionObject = await Auth.currentSession();
      const idToken = sessionObject ? sessionObject.idToken.jwtToken : null;
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/task/${task.id}`,
        {
          description
        },
        {
          headers: { 'Authorization': idToken }
        }
      )

      invalidateTasksCache(idToken);

      console.log(response.data)
      history.push(`/tasks/all`)
    } catch (err) {
      console.error(err)
    }
  } 

  const parseDate = isoDate => {
    const date = new Date(isoDate)
    return date.toString().split(' ').slice(0, 5).join(' ')
  }

  const invalidateTasksCache = idToken => {
    // Call the Tasks endpoint with Cache-control: max-age=0 to invalidate the tasks cache
    axios.get(
      `${process.env.REACT_APP_API_URL}/task`,
      {
        headers: { 'Authorization': idToken, 'Cache-control': 'max-age=0' }
      }
    )
  }

  const changeStatus = async e => {
    e.preventDefault()
    try {
      const sessionObject = await Auth.currentSession();
      const idToken = sessionObject ? sessionObject.idToken.jwtToken : null;
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/task/${task.id}/status`,
        {
          status
        },
        {
          headers: { 'Authorization': idToken }
        }
      )

      invalidateTasksCache(idToken);

      console.log(response.data)
      history.push(`/tasks/all`)
    } catch (err) {
      console.error(err)
    }
  } 

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
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
                type='text' required value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="description">
              <div className="label-container">
                <label>Description</label>
              </div>
              <textarea
                className="desc-input"
                type='text'
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="create-container">
              <input type="submit" value='Create' onClick={e => setStatus("Open")}/>
            </div>
          </form>
        </div>
      }

      {!isNewTask && task.id &&
        <div className="task-container">
          <div>
            <div className="task-title">{task.title}</div>
            <div className='task-created-at'>
              Posted {parseDate(task.created_at)}
              {task.updated_at > task.created_at && ' (edited)'}
            </div>
            <h4>Status: {task.status}</h4>
            {ownsTask
              ? <div> 
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}> Set Status </Button>
              <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {/* <MenuItem onClick={handleClose}>Open</MenuItem>
            <MenuItem onClick={handleClose}>Close</MenuItem>
            <MenuItem onClick={handleClose}>Help Offered</MenuItem> */}
     
            <MenuItem onClick= {e => {
              setStatus("Open");
              //updateTask();
              handleClose();
            }}
            >Open</MenuItem>

            <MenuItem onClick= {e => {
              setStatus("Close");
              //changeStatus();
              handleClose();
            }}
            >Close</MenuItem>

            <MenuItem onClick= {e => {
              setStatus("Help Offered");
              //changeStatus();
              handleClose();
            }}
            >Help Offered</MenuItem>
          </Menu>
              </div>
            : <div className="status-dropdown"></div>
            }
            {ownsTask
              ? <textarea
                className='edit-description'
                type='text'
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              : <div className="task-desc">{task.description}</div>
            }
          </div>
        </div>
      }

      {!isNewTask && task.id && ownsTask &&
        <div className='task-actions'>
          <button onClick={updateTask}>Update task</button>
          <button onClick={deleteTask}>Delete task</button>
          <button onClick={changeStatus}>Update status</button>
        </div>
      }
    </div>
  )
}

export default withAuthenticator(Task, false);
