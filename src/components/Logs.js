import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Auth } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react'
import { LogType } from '../utils'
import './Logs.css'

const Logs = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [logs, setLogs] = useState([])
  
  useEffect(() => {
    async function fetchLogs() {
      try {
        const sessionObject = await Auth.currentSession();
        const idToken = sessionObject ? sessionObject.idToken.jwtToken : null;
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/log`,
          {
            headers: { 'Authorization': idToken }
          }
        )
        //console.log(response.data)
        setLogs(response.data.map(log => ({ ...log, isExpanded: false })))
        setIsMounted(true)
      } catch (err) {
        console.error(err)
      }
    }

    fetchLogs()
  }, [])

  const describeEvent = type => {
    switch(type) {
      case LogType.CREATE_TASK:
        return 'created'
      case LogType.UPDATE_TASK:
        return 'updated'
      case LogType.DELETE_TASK:
        return 'deleted'
      case LogType.VOLUNTEER_TASK:
        return 'volunteered for'
      default:
        return ''
    }
  }

  // remove keys that should be hidden in the expanded object output
  const filterLog = log => {
    const { isExpanded, type, ...rest } = log
    return rest
  }

  const toggleExpanded = (e, timestamp) => {
    e.preventDefault()
    setLogs(logs.map(log => {
      return log.timestampUTC === timestamp ? { ...log, isExpanded: !log.isExpanded } : { ...log }
    }))
  }

  return (
    <div className='container'>
      <h1>Application Logs</h1>
      <div className='logs'>
        {!isMounted && <div>Loading...</div>}
        {isMounted && logs.length === 0 && <div>No logs found</div>}
        {logs.length > 0 &&
          logs
            .sort((a, b) => new Date(a.timestampUTC) > new Date(b.timestampUTC) ? -1 : 1 )  // newest first
            .map((log, i) => (
              <div key={i} className='log'>
                <i
                  className={`fas fa-caret-square-${log.isExpanded ? 'down' : 'right'}`}
                  onClick={e => toggleExpanded(e, log.timestampUTC)}
                />
                <span className='timestamp'>{log.timestampUTC}</span>&nbsp;
                user '{log.username}' {describeEvent(log.type)} task '{log.task.title}'
                {log.isExpanded && <div className='log-expanded'>
                  {JSON.stringify(filterLog(log), null, 2)}
                </div>}
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default withAuthenticator(Logs, false)
