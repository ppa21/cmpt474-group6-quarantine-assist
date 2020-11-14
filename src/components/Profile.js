import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';

Amplify.configure(awsmobile);
const Profile = () => {
  const [user, setUser] = useState({})
  const [attributes, setAttributes] = useState({})
  const [newAttributes, setNewAttributes] = useState({})
  const attrKeys = {
    'given_name': 'First Name', 
    'family_name': 'Last Name',
    'nickname': 'Nickname',
    'email':'Email',
    'address': 'Address',
    'birthdate': 'Birthdate (YYYY-MM-DD)',
    'phone_number': 'Phone Number'
  }

  const toastSettings = {position: "bottom-center", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,}

  useEffect(() => {
    fetchUserAttributes()
  }, [])

  const fetchUserAttributes = async () => {
    const c_user = await Auth.currentAuthenticatedUser()
    console.log(c_user.attributes);
    setUser(c_user);
    setAttributes(c_user.attributes);
    setNewAttributes(c_user.attributes);
  }

  const updateAttributes = async () => {
    console.log(JSON.stringify(newAttributes))
    if('birthdate' in newAttributes && !isValidDate(newAttributes['birthdate'])){
      toast.error('Please Enter a Valid Date', toastSettings)
      return
    }

    if(JSON.stringify(attributes) === JSON.stringify(newAttributes)){
      toast.warning('No changes made', {...toastSettings, progressClassName: "warning-progress-bar"})
      return
    }

    try{
      let result = await Auth.updateUserAttributes(user, newAttributes)
      console.log(result)
      setAttributes(newAttributes)
      toast.info('Success!', toastSettings)
    } catch(e){
    	console.log(e)
    }
  }

  const isValidDate = (date) => {
    return (/\d{4}-\d{2}-\d{2}/g).test(date) && date.length === 10
  }


  return (
    <div className="profile">
      <h1>Your Profile</h1>
      <div className="all-attributes-container">
        {Object.keys(attrKeys).map((key) => (
          <div className="attribute-container" key={key}>
            {attrKeys[key]}
            <div className="attribute-input">
              <div className="input-text">
                <input
                  type='text' 
                  placeholder={(key in attributes) ? attributes[key] : "-"} 
                  value={newAttributes[key]}
                  onChange={e => setNewAttributes({...newAttributes, [key]: e.target.value})} 
                />
              </div>
              <div className="reset-btn-container">
                <button className="reset-btn" onClick={() => setNewAttributes({
                    ...newAttributes, 
                    [key]: (key in attributes) ? attributes[key] : ''
                })}>
                  Reset
                </button>
              </div>
              
            </div>
          </div>
        ))}
        <div className="submit-btn-container">
          <button className="submit-btn" onClick={updateAttributes}> Submit </button>
        </div>
      </div>
      <ToastContainer className="toast"/>
    </div>
  )
}

export default withAuthenticator(Profile, false);
// export default Profile