import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import './Profile.css';


const Profile = () => {
  const [user, setUser] = useState({})
  const [attributes, setAttributes] = useState({})
  const [newAttributes, setNewAttributes] = useState({})
  const attrKeys = {
    'given_name': 'First Name', 
    'family_name': 'Last Name',
    'middle_name': 'Middle Name',
    'nickname': 'Nickname',
    'preferred_username': 'Username',
    'email':'Email',
    'address': 'Address',
    'birthdate': 'Birthdate',
    'phone_number': 'Phone Number'
  }

  useEffect(() => {
    async function fetchUserAttributes() {
      const c_user = await Auth.currentAuthenticatedUser()
      console.log(c_user.attributes);
      setUser(c_user);
      setAttributes(c_user.attributes);
      setNewAttributes(c_user.attributes);
    }

    fetchUserAttributes()
  }, [])

  const updateAttributes = async () => {
    // let result = await Auth.updateUserAttributes(user, JSON.stringify(newAttributes))
    console.log(JSON.stringify(newAttributes))
    try{
    	let result = await Auth.updateUserAttributes(user, newAttributes)
    } catch(e){
    	console.log(e)
    }
  }


  return (
    <div className="profile">
      <h1>Your Profile</h1>
      <div className="all-attributes-container">
        {Object.keys(attrKeys).map((key) => (
          <div className="attribute-container" key={key}>
            <h4>{attrKeys[key]}</h4>
            <div className="attribute-input">
              <input
                type='text' 
                placeholder={(key in attributes) ? attributes[key] : "-"} 
                value={newAttributes[key]}
                onChange={e => {
                  setNewAttributes({...newAttributes, [key]: e.target.value})
                  console.log(newAttributes)
                }} 
              />
            </div>
          </div>
        ))}
        <div className="submit-btn-container">
          <button className="submit-btn" onClick={updateAttributes}> Submit </button>
        </div>
      </div>
    </div>
  )
}

export default Profile