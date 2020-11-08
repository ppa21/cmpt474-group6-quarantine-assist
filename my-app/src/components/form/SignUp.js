import React from 'react';
import './Form.css';
import Button from '@material-ui/core/Button';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import RequestServer from "../RequestServer";


const Role = {
    ADMIN: "ADMIN",
    USER: "USER"
}

class SignUp extends React.Component {
    constructor(props) {
        super(props)
        // This part is for testing purpose
        // this.state = {
        //     id: '',
        //     username: 'test1',
        //     password: 'test',
        //     name: '',
        //     fname: 'gaeun',
        //     lname: 'lee',
        //     email: 'gaeunl@sfu.ca',
        //     repeatPassword:'test',
        //     role: Role.USER
        // };
        this.state = {
            id: '',
            username: '',
            password: '',
            name: '',
            fname: '',
            lname: '',
            email: '',
            repeatPassword:'',
            role: Role.USER
        };
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    componentDidMount() {

        //Need to add some validator for username
        ValidatorForm.addValidationRule('checkUsername', (value) => {
            let valid = this.checkUsername(value)
                .catch(() => {
                    return true;
                });
            return valid;
        });

        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.password) {
                return false;
            }
            return true;
        });

    }

    async checkUsername(username) {
        var response = await RequestServer.getByUsername(username);
        if (response === null) {
            return true;
        }
        return false;
    }

    handleSubmit = async () => {
        //input validation
        this.setState({
            name: this.state.fname + ' ' + this.state.lname,
        })
        var response = await RequestServer.addUser(this.state);
        if(response === null){
            alert( 'Incorrect Inputs' )
        }else{
            console.log(response)
            this.props.history.push(
                '/login'
            )
        }
    }

    render() {
        return (
            <div className="newForm">
                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}
                    style={{
                        backgroundColor: 'white',
                            margin : 'auto',
                            padding : '20px',
                            textAlign: 'center'
                    }}
                >
                    <TextValidator
                        label="First Name"
                        onChange={this.handleChange}
                        name="fname"
                        value={this.state.fname}
                        validators={['required', 'matchRegexp:^[A-Za-z]+$']}
                        errorMessages={['this field is required', 'Invalid input (only letters)']}
                        variant="outlined"
                    />
                    <br/>
                    <br/>
                    <TextValidator
                        label="Last Name"
                        onChange={this.handleChange}
                        name="lname"
                        value={this.state.lname}
                        validators={['required', 'matchRegexp:^[A-Za-z]+$']}
                        errorMessages={['this field is required', 'Invalid input (only letters)']}
                        variant="outlined"
                    />
                    <br/>
                    <br/>
                    <TextValidator
                        label="Username"
                        onChange={this.handleChange}
                        name="username"
                        value={this.state.username}
                        validators={['required', 'checkUsername']}
                        errorMessages={['this field is required', 'Existing Username: Re-enter the username']}
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
                    /> <br/> <br/>
                    <TextValidator
                        label="Repeat password"
                        onChange={this.handleChange}
                        name="repeatPassword"
                        value={this.state.repeatPassword}
                        type="password"
                        validators={['isPasswordMatch', 'required']}
                        errorMessages={['password mismatch', 'this field is required']}
                        variant="outlined"
                        />
                    <br/>
                    <br/>
                     <TextValidator
                        label="Email"
                        onChange={this.handleChange}
                        name="email"
                        value={this.state.email}
                        validators={['required', 'isEmail']}
                        errorMessages={['this field is required', 'email is not valid']}
                        variant="outlined"
                            />

                            <br/>
                            <br/>
                    <Button type="submit" style={{backgroundColor: 'rgba(0,0,0, 0.87)', color: 'white'}}>Submit</Button>
                    <br/>
                </ValidatorForm>

            </div>
        );
    }
}

export default SignUp
