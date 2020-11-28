import axios from 'axios'
import { Auth } from 'aws-amplify'

export const parseDate = isoDate => {
  let date = new Date(isoDate)
  date = date.toString().split(' ')
  date.splice(4, 0, 'at')
  return date.slice(0, 6).join(' ')
}

export const LogType = {
  CREATE_TASK: 'createTask',
  UPDATE_TASK: 'updateTask',
  DELETE_TASK: 'deleteTask',
  VOLUNTEER_TASK: 'volunteerTask'
}

export const logEvent = async (task, type) => {
  try {
    const sessionObject = await Auth.currentSession()
    const idToken = sessionObject?.idToken.jwtToken
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/log/`,
      {
        task,
        type
      },
      {
        headers: { 'Authorization': idToken }
      }
    )
    //console.log(response.data)
  } catch (err) {
    console.error(err)
  }
}
