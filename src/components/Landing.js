import React, {Component} from 'react';
import { Link } from 'react-router-dom'

class Landing extends Component {
  render(){
    return (
      <div>
        <h1>Landing Page</h1>
        <Link to='/task/new'><button>Create task</button></Link>
      </div>
    )
  }
}

export default Landing;