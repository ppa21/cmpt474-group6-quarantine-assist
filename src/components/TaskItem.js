import React, { useEffect, useState } from 'react'
import './TasksPage.css'
import AWS from 'aws-sdk';

const TaskItem = ({id, title, desc, user_id, handleClick}) =>  {
    const [user, setUser] = useState({})

    useEffect(() => {
        if(user_id) getUserInfo(user_id)
    }, [])

    const getUserInfo = (sub) => {
        var cog = new AWS.CognitoIdentityServiceProvider();
    
        var filter = "sub = \"" + sub + "\"";
        var req = {
            "Filter": filter,
            "UserPoolId": `${process.env.REACT_APP_USER_POOL_ID}` // looks like us-east-9_KDFn1cvys
        };
    
        cog.listUsers(req, function(err, data) {
            if (err) {
                console.log(err);
            }
            else {
                if (data.Users.length === 1){ //as far as we search by sub, should be only one user.
                    var user = data.Users[0];
                    var attributes = user.Attributes;
                    setUser(attributes.reduce((obj, curr) => {
                        obj = {...obj, [curr.Name]: curr.Value}
                        console.log(obj)
                        return obj
                    }, {}))
                } else {
                    console.log("Something wrong.");
                }
            }
        });
    }


    return (
        <div
            className="task-container"
            key={id}
            onClick={handleClick}
        >
          <div className="task-title">{title}</div>
          {user.nickname && <div className="task-title"> {user.nickname} {user.family_name} </div>}
          <div className="task-desc">{desc}</div>
        </div>
    )
}

export default TaskItem
