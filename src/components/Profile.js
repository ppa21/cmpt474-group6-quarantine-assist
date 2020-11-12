import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom'
import { Auth } from 'aws-amplify';

const Profile = () => {
  const [attributes, setAttributes] = useState({})

  useEffect(() => {
    async function fetchUserAttributes() {
      const user = await Auth.currentAuthenticatedUser();
      console.log(user.attributes);
      setAttributes(user.attributes);
    }

    fetchUserAttributes()
    checkUser()
  }, [])

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
      {Object.keys(attributes).map((key) => (
      	<div className="attribute-container" key={key}>
      	  <h3>{key}</h3>
          <h4>{attributes[key]}</h4>
        </div>
      ))}
    </div>
  )
}

export default Profile