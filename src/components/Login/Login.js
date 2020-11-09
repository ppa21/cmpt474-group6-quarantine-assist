import React, {Component} from 'react';
import Amplify from 'aws-amplify';
import awsmobile from '../aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import "./Login.css";

// richardtest
// Adminpassword123~

Amplify.configure(awsmobile);
class Login extends Component {
  render(){
    return (
      <div class="Login">
        <header className="Login-header">
          <h1>Logged in</h1>
        </header>
      </div>
    )
  }
}

export default withAuthenticator(Login, true);
//export default Login;