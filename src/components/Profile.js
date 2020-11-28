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
  const attrKeys = {
    'given_name': 'First Name',
    'family_name': 'Last Name',
    'nickname': 'Nickname',
    'email': 'Email',
    'address': 'Address',
    'birthdate': 'Birthdate (YYYY-MM-DD)',
    'phone_number': 'Phone Number'
  }

  const [user, setUser] = useState({})
  const [attributes, setAttributes] = useState(
    Object.keys(attrKeys).reduce((map, key) => {
      return {...map, [key] : ''};
    }, {})
  )
  const [newAttributes, setNewAttributes] = useState(
    Object.keys(attrKeys).reduce((map, key) => {
      return {...map, [key] : ''}
    }, {})
  )

  const toastSettings = { position: "bottom-center", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, }

  useEffect(() => {
    const fetchUserAttributes = async () => {
      const c_user = await Auth.currentAuthenticatedUser()
      setUser(c_user)
      setAttributes(a => ({...a, ...c_user.attributes}))
      setNewAttributes(c_user.attributes)
    }

    fetchUserAttributes()
  }, [])

  

  const updateAttributes = async () => {
    if ('birthdate' in newAttributes && !isValidDate(newAttributes['birthdate'])) {
      toast.error('Please Enter a Valid Date', toastSettings)
      return
    }

    if (noChangesMade(attributes, newAttributes)) {
      toast.warning('No changes made', { ...toastSettings, progressClassName: "warning-progress-bar" })
      return
    }

    try {
      await Auth.updateUserAttributes(user, newAttributes)
      setAttributes(newAttributes)
      toast.info('Success!', toastSettings)
    } catch (e) {
      console.log(e)
    }

  }

  const isValidDate = (date) => {
    return (/\d{4}-\d{2}-\d{2}/g).test(date) && date.length === 10
  }

  const noChangesMade = (oldObj, newObj) => {
    for(const key of Object.keys(oldObj)){
      if(oldObj[key] !== newObj[key]) return false
    }
    return true
  }

  return (
    <div className="container profile">
      <h1>Your Profile</h1>
      <div className="all-attributes-container">
        {Object.keys(newAttributes).length && Object.keys(attrKeys).map((key) => (
          <div className="attribute-container" key={key}>
            {attrKeys[key]}
            <div className="attribute-input">
              <div className="input-text">
                <input
                  type='text'
                  value={newAttributes[key]}
                  onChange={e => setNewAttributes({ ...newAttributes, [key]: e.target.value })}
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
      <ToastContainer className="toast" />
    </div>
  )
}

export default withAuthenticator(Profile, false);
// export default Profile