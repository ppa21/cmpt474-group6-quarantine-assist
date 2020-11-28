import React, { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react';
import { useHistory, useLocation, Router } from 'react-router-dom'
import { Button, Modal, Header } from 'semantic-ui-react'
import axios from 'axios'
import Loader from 'react-loader-spinner'
import { parseDate, logEvent, LogType } from '../utils'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import "./Task.css"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const TaskStatus = {
  Open: 'Open',
  HelpOffered: 'Help Offered',
  Done: 'Done'
}

const Task = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [task, setTask] = useState({})
  const [ownsTask, setOwnsTask] = useState(false)
  const [isTaskVolunteer, setIsTaskVolunteer] = useState(false)
  const [status, setStatus] = useState('')
  const [confirm, setConfirm] = useState(false)

  const history = useHistory()
  const location = useLocation()
  const isNewTask = location.pathname.split('/')[2] === 'new'

  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    async function fetchTask() {
      const id = location.pathname.split('/')[2]
      const sessionObject = await Auth.currentSession();
      const idToken = sessionObject ? sessionObject.idToken.jwtToken : null;
      await loadTask(idToken, id);
    }

    if (!isNewTask) fetchTask()

  }, [isNewTask, location.pathname])

  const loadTask = async (idToken, taskId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/task/${taskId}`,
        {
          headers: { 'Authorization': idToken }
        }
      )
      const userInfo = await Auth.currentUserInfo()
      setOwnsTask(response.data.user_id === userInfo.attributes.sub)
      setIsTaskVolunteer(response.data.volunteer_id && response.data.volunteer_id === userInfo.attributes.sub)
      setTask(response.data)
      setStatus(response.data.status)
      setDescription(response.data.description)
      setIsLoading(false);
      return response.data;
    } catch (err) {
      console.error(err)
    }
  }

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
      //console.log(response.data)

      invalidateTasksCache(idToken);
      logEvent(task, LogType.DELETE_TASK)
      history.push(`/tasks/all`)
    } catch (err) {
      console.error(err)
    }
  }

  const validationCheck = async event => {
    event.preventDefault();

    if (event === null) {
      alert("can't be null.")
      return false
    } else {
      return true
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (title.trim() !== "") {
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
        //console.log(response.data)

        invalidateTasksCache(idToken);
        logEvent(response.data, LogType.CREATE_TASK)
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
          description,
          status
        },
        {
          headers: { 'Authorization': idToken }
        }
      )

      invalidateTasksCache(idToken);
      logEvent(response.data, LogType.UPDATE_TASK)
      //console.log(response.data)
      history.push(`/tasks/all`)
    } catch (err) {
      console.error(err)
    }
  }

  const volunteerForTask = async e => {
    try {
      const sessionObject = await Auth.currentSession();
      const idToken = sessionObject ? sessionObject.idToken.jwtToken : null;
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/task/${task.id}/volunteer`,
        { status: TaskStatus.HelpOffered },
        {
          headers: { 'Authorization': idToken }
        }
      )

      const updatedTask = await loadTask(idToken, task.id)
      invalidateTasksCache(idToken);
      logEvent(updatedTask, LogType.VOLUNTEER_TASK)
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

return (
  <div className="container">
    {!isNewTask && isLoading && <div className="spinner">
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
            <input type="submit" value='Create' onClick={e => setStatus(TaskStatus.Open)} />
          </div>
        </form>
      </div>
    }

    {!isNewTask && task.id && !isLoading &&
      <>
        {isTaskVolunteer && <div className="task-current-volunteer">You have volunteered for this task</div>}
        <div className="task-container">
          <div>
            <div className="task-title">{task.title}</div>
            <div className='task-by'>
              Posted by <b>{task.user.nickname || task.user.given_name || task.user.username}</b>
              <div className='task-by-created-at'>
                - Posted {parseDate(task.created_at)} PST
              {task.updated_at > task.created_at && ' (edited)'}
              </div>
            </div>
            <div className="task-attr-label"><span>Status:</span> {status}</div>

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
            <MenuItem onClick= {e => {
              setStatus(TaskStatus.Open);
              handleClose();
            }}
            >Open</MenuItem>

            <MenuItem onClick= {e => {
              setStatus(TaskStatus.Done);
              handleClose();
            }}
            >Done</MenuItem>

            <MenuItem onClick= {e => {
              setStatus(TaskStatus.HelpOffered);
              handleClose();
            }}
            >Help Offered</MenuItem>
          </Menu>
              </div>
            : <div className="status-dropdown"></div>
            }

            <div className="task-attr-label"><span>Description:</span></div>
            {ownsTask
              ? <textarea
                className='edit-description'
                type='text'
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              : <div className="task-desc">{task.description}</div>
            }
            {task.user.email &&
              <div className="task-attr-label"><span>Owner Email:</span> <a href={"mailto:" + task.user.email}>{task.user.email}</a></div>
            }
            {task.user.volunteer_email &&
              <div className="task-attr-label"><span>Volunteer Email:</span> <a href={"mailto:" + task.user.volunteer_email}>{task.user.volunteer_email}</a></div>
            }
          </div>
        </div>
      </>
    }

    {!isNewTask && task.id && ownsTask &&
      <div className='task-actions'>
        <button onClick={updateTask}>Update task</button>
        <button onClick={deleteTask}>Delete task</button>
      </div>
    }
    {!isNewTask && task.id && !ownsTask &&
      <div className='task-actions'>
        {status === TaskStatus.Open &&
          <Button primary className="volunteer-btn" onClick={() => setConfirm(true)}>
            Volunteer
          </Button>
        }

        <Modal open={confirm} >
          <Header>
            Are you sure you want to volunteer? <br />
            Your email will be shown to the task owner
          </Header>
          <Modal.Content>
            <p>
              Once you have volunteered, the owner's email will be displayed. <br />
              Please get in touch with the task owner at your earliest convenience to get more information about them and their task. <br /><br />
              Thank you for volunteering.
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' inverted onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button color='green' inverted onClick={() => {
              setConfirm(false);
              volunteerForTask();
            }}>
              Ok
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    }
  </div>
)
}
export default withAuthenticator(Task, false);
