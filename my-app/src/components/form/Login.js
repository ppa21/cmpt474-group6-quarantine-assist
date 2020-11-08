import React from 'react';
import './Form.css';
import Button from '@material-ui/core/Button';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {Layout, Header, Navigation, Drawer, Content} from 'react-mdl';
import {Link} from "react-router-dom";
import RequestServer from "../RequestServer";


class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            isAdmin: false   // Not used, may use in the future if localStorage causes issues
        };
        this.handleChange = this.handleChange.bind(this);
    }

    setRole(response){
        if (response.data.user.role === 'ADMIN'){
            this.setState({
                isAdmin: true
            })
            localStorage.setItem("isAdmin", "true")
        }
        else if(response.data.user.role === 'USER'){
            this.setState({
                isAdmin: false
            })
            console.log('this is local storage')
            console.log(localStorage);
            localStorage.setItem("isAdmin", "false")
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    testConsoleLog(response) {
        var user = localStorage.getItem("userData")
        var admin = localStorage.getItem("isAdmin")

        console.log("User data is : " + user)
        console.log("response from server: ", response, this.state)
        console.log("ROLE: " + response.data.user.role)
        console.log("admin??: " + admin)

    }

    handleSubmit = async () => {
        //input validation
        //access to db and check if the inputs are correct or not
        // if the matching account does not exist - show error msg
        // if it exists - go to the dashboard
        var response = await RequestServer.login(this.state.username, this.state.password);
        console.log(response);
        if(response === null){
            alert( 'Incorrect Inputs' );
        } else{
            localStorage.setItem("userData", JSON.stringify(response.data));
            localStorage.setItem("loggedIn", "true");
            this.setRole(response)
            this.props.history.push(
                '/Profile',
                { detail: response.data.user }
            );

            window.location.reload();

        }

        // console.log("this is what user putted in username : " + this.state.username + " password : " + this.state.password);
    }


    render(){
        return(
            <div className="newForm">
                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}
                    style={{
                        backgroundColor: 'white', margin : 'auto', padding : '20px', textAlign: 'center'
                    }}
                >
                    <TextValidator
                        label="Username"
                        onChange={this.handleChange}
                        name="username"
                        value={this.state.username}
                        validators={['required']}
                        errorMessages={['this field is required']}
                        variant="outlined"
                    />
                    <br/>
                    <br/>
                    <TextValidator
                        label="Password"
                        onChange={this.handleChange}
                        name="password"
                        value={this.state.password}
                        type="password"
                        validators={['required']}
                        errorMessages={['this field is required']}
                        variant="outlined"
                    />
                    <br/>
                    <br/>
                    <Button type="submit" style={{backgroundColor: 'rgba(0,0,0, 0.87)', color: 'white', margin:'10px'}}>Submit</Button>
                    <Button style={{backgroundColor: 'rgba(0,0,0, 0.87)'}}><Link to="/SignUp" style={{ color: 'white'}}>SignUp</Link></Button>
                    <br/>
                </ValidatorForm>
            </div>
        )
    }
}
export default Login
