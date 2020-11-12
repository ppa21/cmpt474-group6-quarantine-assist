import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

const Profile = () => {
  const [attributes, setAttributes] = useState({})
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
      const user = await Auth.currentAuthenticatedUser();
      console.log(user.attributes);
      setAttributes(user.attributes);
    }

    fetchUserAttributes()
  }, [])

  return (
    <div>
      <h1>Your Profile</h1>

      <div className="all-attributes-container">
        {Object.keys(attrKeys).map((key) => (
          <div className="attribute-container" key={key}>
      	  <h3>attrKeys[key]</h3>
          <h4>{(key in attributes) ? attributes[key] : "-"}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Profile