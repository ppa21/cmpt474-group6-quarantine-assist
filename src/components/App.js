import React, { Component, useEffect, useState } from 'react';
import './App.css';
import {Layout, Header, Navigation, Drawer, Content} from 'react-mdl';
import Main from './Main';
import {Link} from 'react-router-dom';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import '@aws-amplify/ui/dist/style.css';
import { Auth } from 'aws-amplify'; 
import { onAuthUIStateChange } from '@aws-amplify/ui-components' 

// richardtest
// Adminpassword123~
// Amplify.configure(awsmobile);
const App = () => {
    const [loggedIn, setLoggedIn] = useState(false)   

    useEffect(() => {
        const currentUser = () => {
            Auth.currentAuthenticatedUser()
              .then(user => {
                console.log("USER", user);
                // setText("logged in") 
                setLoggedIn(true)  
              })
              .catch(err => {
                console.log("ERROR", err);
                // setText("not logged in") 
                setLoggedIn(false) 
              });
          };
    
          currentUser(); 
    }, []);  

    return (
      <div>
          <Layout>
              <Header className = "header-color" title = "Quarantine Assist">
                  <Navigation>
                      <Link to = "/">Home</Link>
                      <Link to="/login">Login</Link>
                      <Link to="/videos">Videos</Link> 
                      <Link to="/contact">Contact</Link>
                      <Link to="tasks/all">Tasks</Link>
                      <Link to="/profile">Profile</Link>
                      {loggedIn ? <AmplifySignOut /> : ""}
                      {/* {loggedIn && <AmplifySignOut />} */}
                      {/* <AmplifySignOut />  */} 
                  </Navigation>
              </Header>
              <Drawer className = "drawer-color" title= "Navigate to">
                  <Navigation>
                  <Link to = "/">Home</Link>
                      <Link to="/login">Login</Link>
                      <Link to="/videos">Videos</Link>
                      <Link to="/contact">Contact</Link>
                      <Link to="tasks/all">Tasks</Link>
                      <Link to="/profile">Profile</Link>
                      <AmplifySignOut /> 
                  </Navigation>
              </Drawer>
              <Content>
                  <div className="page-content" />
                  <Main/>
              </Content>     
          </Layout>
      </div> 
    ); 
}

// export default withAuthenticator(App, false);
export default App;