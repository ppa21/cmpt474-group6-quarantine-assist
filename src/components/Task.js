import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import axios from 'axios'

const Task = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const history = useHistory()
  const location = useLocation()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL, {
        title,
        description
      })
      console.log(response.data)
      history.push(`/task/${title.split(' ').join('-')}`)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4>New Task</h4>
      <label>Title</label>
      <input type='text' value={title} onChange={e => setTitle(e.target.value)} />
      <label>Description</label>
      <textarea type='text' value={description} onChange={e => setDescription(e.target.value)} />
      <input type="submit" value='Create' />
    </form>
  )
}

export default Task