import React from 'react'
import { Link } from 'react-router-dom'
import { parseDate } from '../utils' 
import './TaskItem.css'

const statusStyle = {
    'Open' : 'open',
    'Help Offered': 'help_offered',
    'Done': 'done'
}

const TaskItem = ({task}) => {
    return (
        <Link
        to={`/task/${task.id}`}
        className="task-container"
        key={task.id}
        >
            <div className="task-header">
                <div className="task-title">
                    {task.title} 
                </div>
                <div className={"task-status " + statusStyle[task.status]}>
                    {task.status}
                </div>
            </div>
            <div className='task-created-at'>
                Posted {parseDate(task.created_at)} PST
                {task.updated_at > task.created_at && ' (edited)'}
            </div>
            <div className="task-desc">{task.description}</div>
        </Link>
    )
}

export default TaskItem