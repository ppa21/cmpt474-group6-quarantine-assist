import React, { useEffect, useState } from 'react';
import './App.css';
import { Layout, Header, Navigation, Drawer, Content } from 'react-mdl';
import Main from './Main';
import { Link } from 'react-router-dom';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import { Hub } from '@aws-amplify/core';
import '@aws-amplify/ui/dist/style.css';

// richardtest
// Adminpassword123~
// Amplify.configure(awsmobile);
const App = () => {
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        const currentUser = () => {
            Auth.currentAuthenticatedUser()
                .then(user => {
                    // setText("logged in") 
                    setLoggedIn(true)
                })
                .catch(err => {
                    // setText("not logged in") 
                    setLoggedIn(false)
                });
        };

        Hub.listen('auth', currentUser) // listen for login/signup events
        currentUser();  // check manually the first time because we won't get a Hub event
        return () => Hub.remove('auth', currentUser) // cleanup

    }, []);

    return (
        <div>
            <Layout>
                <Header className="header-color" title="Quarantine Assist">
                    <Navigation>
                        <Link to="/">Home</Link>

                        {/* <Link to="/videos">Videos</Link>  */}
                        {/* <Link to="/contact">Contact</Link> */}
                        <Link to="/tasks/all">Tasks</Link>
                        <Link to="/profile">Profile</Link>
                        {!loggedIn ? <Link to="/login">Login</Link> : ""}
                        {loggedIn ? <AmplifySignOut /> : ""}
                        {/* {loggedIn && <AmplifySignOut />} */}
                        {/* <AmplifySignOut />  */}
                    </Navigation>
                </Header>
                <Drawer className="drawer-color" title="Navigate to">
                    <Navigation>
                        <Link to="/">Home</Link>
                        {/* <Link to="/videos">Videos</Link> */}
                        {/* <Link to="/contact">Contact</Link> */}
                        <Link to="/tasks/all">Tasks</Link>
                        <Link to="/profile">Profile</Link>
                        {!loggedIn ? <Link to="/login">Login</Link> : ""}
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