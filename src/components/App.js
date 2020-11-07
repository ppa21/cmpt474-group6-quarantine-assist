import React, { Component } from 'react';
import './App.css';
// import {Layout, Header, Navigation, Drawer, Content} from 'react-mdl';
import {Layout, Header, Navigation, Drawer, Content} from "react-mdl";
import Main from './Main';
import {Link} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
          <Layout>
              <Header className = "header-color" title = "Title">
                  <Navigation>
                      <Link to = "/">Home</Link>
                      <Link to="/login">Login</Link>
                      <Link to="/videos">Videos</Link>
                      <Link to="/contact">Contact</Link>
                  </Navigation>
              </Header>
              <Drawer className = "drawer-color" title= "Drawer Title">
                  <Navigation>
                      <Link to="/resume">Link</Link>
                      <Link to="/aboutme">Link</Link>
                      <Link to="/projects">Link</Link>
                      <Link to="/contact">Link</Link>
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

export default App;