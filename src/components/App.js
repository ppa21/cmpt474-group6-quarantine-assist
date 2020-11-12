import React, { Component } from 'react';
import './App.css';
import {Layout, Header, Navigation, Drawer, Content} from 'react-mdl';
import Main from './Main';
import {Link} from 'react-router-dom';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import '@aws-amplify/ui/dist/style.css';

// richardtest
// Adminpassword123~
Amplify.configure(awsmobile);
class App extends Component {
  render() {   
    return (
      <div>
          <Layout>
              <Header className = "header-color" title = "Quarantine Assist">
                  <Navigation>
                      <Link to = "/">Home</Link>
                      <Link to="/login">Login</Link>
                      <Link to="/videos">Videos</Link>
                      <Link to="/contact">Contact</Link>
                      <AmplifySignOut /> 
                  </Navigation>
              </Header>
              <Drawer className = "drawer-color" title= "Navigate to">
                  <Navigation>
                  <Link to = "/">Home</Link>
                      <Link to="/login">Login</Link>
                      <Link to="/videos">Videos</Link>
                      <Link to="/contact">Contact</Link>
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
}

export default withAuthenticator(App, false);
// export default App;