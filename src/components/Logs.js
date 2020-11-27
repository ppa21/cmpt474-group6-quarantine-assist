import React, { useEffect, useState } from 'react'
import { withAuthenticator } from 'aws-amplify-react'
import './Logs.css'

const Logs = () => {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const fetchLogs = () => {
      console.log('fetching')
    }

    fetchLogs()
  }, [])

  return (
    <div className='container'>
      <h1>Application Logs</h1>
    </div>
  )
}

export default withAuthenticator(Logs, false)
