import React, { useEffect, useState } from 'react';
import 'semantic-ui-css/semantic.min.css'
import './App.css';
import { Layout, Header, Navigation, Drawer, Content } from 'react-mdl';
import Main from './Main';
import { useHistory, Link } from 'react-router-dom';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import { Hub } from '@aws-amplify/core';
import '@aws-amplify/ui/dist/style.css';

// richardtest
// Adminpassword123~
// Amplify.configure(awsmobile);
const App = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [username, setUsername] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const history = useHistory()

    useEffect(() => {
        const currentUser = () => {
            Auth.currentAuthenticatedUser()
                .then(user => {
                    // setText("logged in") 
                    setLoggedIn(true)
                    setUsername(user.username)
                    const userGroups = user.signInUserSession.accessToken.payload['cognito:groups']
                    setIsAdmin(userGroups?.includes('Admin'))
                    history.push('/')
                })
                .catch(err => {
                    // setText("not logged in") 
                    setLoggedIn(false)
                    setUsername('')
                    setIsAdmin(false)
                });
        };

        Hub.listen('auth', currentUser) // listen for login/signup events
        currentUser();  // check manually the first time because we won't get a Hub event
        return () => Hub.remove('auth', currentUser) // cleanup

    }, [history]);

    return (
        <div>
            <Layout>
                <Header
                    className="header-color"
                    title={
                        <div>Quarantine Assist&nbsp;&nbsp;
                            {isAdmin && <span style={{ fontSize: 'small' }}>(ADMIN)</span>}
                        </div>
                    }
                >
                    <Navigation>
                        <Link to="/">Home</Link>
                        <Link to="/tasks/all">Tasks</Link>
                        <Link to='/tasks/volunteered_tasks'>Volunteered Tasks</Link>
                        <Link to="/tasks/mytasks">My Tasks</Link>
                        {loggedIn ? <Link to="/profile">Profile ({username})</Link> : ""}
                        {isAdmin && <Link to='/logs'>Logs</Link>}
                        {!loggedIn
                            ? <Link to="/login">
                                <button className='amplify-button'>SIGN IN</button>
                            </Link>
                            : ""
                        }
                        {loggedIn ? <AmplifySignOut /> : ""}
                        {/* {loggedIn && <AmplifySignOut />} */}
                        {/* <AmplifySignOut />  */}
                    </Navigation>
                </Header>
                <Drawer className="drawer-color" title="Navigate to">
                    <Navigation>
                        <Link to="/">Home</Link>
                        <Link to="/tasks/all">Tasks</Link>
                        <Link to='/tasks/volunteered_tasks'>Volunteered Tasks</Link>
                        <Link to="/tasks/mytasks">My Tasks</Link>
                        {loggedIn ? <Link to="/profile">Profile ({username})</Link> : ""}
                        {isAdmin && <Link to='/logs'>Logs</Link>}
                        {!loggedIn
                            ? <Link to="/login">
                                <button className='amplify-button'>SIGN IN</button>
                            </Link>
                            : ""
                        }
                        {loggedIn ? <AmplifySignOut /> : ""}
                    </Navigation>
                </Drawer>
                <Content>
                    <div className="page-content" />
                    <Main />
                </Content>
            </Layout>
        </div>
    );
}

// export default withAuthenticator(App, false);
export default App;