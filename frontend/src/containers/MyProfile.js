import React, {Component} from "react";
import {Button, FormControl, FormGroup} from "react-bootstrap";
import "./Login.css";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import axios from 'axios';
import "./AddPlayingField.css"
import {Link} from "react-router-dom";
import Container from "reactstrap/es/Container";
import Col from "react-bootstrap/lib/Col";


class MyProfile extends Component {


    constructor(props) {
        super(props);
        this.state = {
            email: "",
            username: "",
            phoneNumber: "",
            firstName: "",
            lastName: "",
            password: "",
            emailAlreadyUsed: false,
            usernameAlreadyUsed: false,
            updateField: false
        };
        this.getData().then(r => console.log(r));
    }


    async updateFieldFlag() {
        this.setState({
            updateField: true
        });
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0 && this.state.firstName.length > 0
            && this.state.lastName.length > 0 && this.state.email.length > 0 && this.state.phoneNumber.length > 0;
    }

    async getData() {
        const params = {
            "userId": sessionStorage.getItem("userId")
        };
        let token = sessionStorage.getItem("token");
        return await axios.get('http://localhost:4996/users?token=' + token, {params: params})
            .then(res => {
                if (res) {
                    this.setState({
                        "email": res.data[0]["email"]
                    });
                    this.setState({
                        "username": res.data[0]["username"]
                    });
                    this.setState({
                        "phoneNumber": res.data[0]["phoneNumber"]
                    });
                    this.setState({
                        "firstName": res.data[0]["firstName"]
                    });
                    this.setState({
                        "lastName": res.data[0]["lastName"]
                    });
                }
            });
    }

    async handleSubmit(state, e) {
        e.preventDefault();
        const params = {
            "userId": sessionStorage.getItem("userId"),
            "email": this.state.email,
            "username": this.state.username,
            "phoneNumber": this.state.phoneNumber,
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "password": this.state.password,
        };
        let token = sessionStorage.getItem("token");
        let res;
        try {
            res = await axios.post('http://localhost:4996/users?token=' + token, params)
                .then(res => console.log(res.data));
        } catch (e) {
            if (e.message !== "Network Error") {
                if (e.response.data === "Username already exist.")
                    this.setState({
                        "usernameAlreadyUsed": true
                    });
                else if (e.response.data === "Email already used by another user.")
                    this.setState({
                        "emailAlreadyUsed": true
                    });
            } else
                alert(e.message);
        }
        window.location.reload();
        return res;
    }

    render() {
        if (sessionStorage.getItem("isAuthenticated") === "false")
            return (
                <div className="container-fluid">
                    <div className="col-sm-12">
                        <div className="as">
                            <div className="card text-white bg-danger mb-3"
                                 style={{"text-align": "center", "margin-top": "3rem"}}>
                                <div className="card-header">You don't have access here!</div>
                                <div className="card-body">
                                    <h4 className="card-title">Access restricted</h4>
                                    <p className="card-text">Please go to login page. </p>
                                    <Link className="btn btn-primary" to="/login">Login</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        else
            return (
                <Container>
                    <form className="row" onSubmit={this.handleSubmit} style={{"margin-top": "3em"}}>
                        <Col md={6} style={{"margin-bottom": "2em"}}>
                            <FormGroup controlId="usernameInputField">
                                <ControlLabel column={"username"}>Username</ControlLabel>
                                <FormControl
                                    autoFocus
                                    type="username"
                                    value={this.state.username}
                                    disabled={(this.state.updateField) ? "" : "disabled"}
                                    placeholder={this.state.username}
                                    onChange={e => this.setState({
                                        "username": e.target.value
                                    })}
                                />
                            </FormGroup>
                            <FormGroup controlId="emailInputField">
                                <ControlLabel column={"password"}>Email</ControlLabel>
                                <FormControl
                                    value={this.state.email}
                                    placeholder={this.state.email}
                                    onChange={e => this.setState({
                                        "email": e.target.value
                                    })}
                                    type="email"
                                    disabled={(this.state.updateField) ? "" : "disabled"}
                                />
                            </FormGroup>
                            <FormGroup controlId="passwordInputField">
                                <ControlLabel column={"password"}>Password</ControlLabel>
                                <FormControl
                                    placeholder="Enter password"
                                    onChange={e => this.setState({
                                        "password": e.target.value
                                    })}
                                    value={this.state.password}
                                    type="password"
                                    disabled={(this.state.updateField) ? "" : "disabled"}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6} style={{"margin-bottom": "2em"}}>
                            <FormGroup controlId="firstNameInputField">
                                <ControlLabel column={"firstName"}>First Name</ControlLabel>
                                <FormControl
                                    type="firstName"
                                    placeholder={this.state.firstName}
                                    value={this.state.firstName}
                                    disabled={(this.state.updateField) ? "" : "disabled"}
                                    onChange={e => this.setState({
                                        "firstName": e.target.value
                                    })}
                                />
                            </FormGroup>
                            <FormGroup controlId="lastNameInputField">
                                <ControlLabel column={"lastName"}>Last Name</ControlLabel>
                                <FormControl
                                    type="lastName"
                                    placeholder={this.state.lastName}
                                    value={this.state.lastName}
                                    disabled={(this.state.updateField) ? "" : "disabled"}
                                    onChange={e => this.setState({
                                        "lastName": e.target.value
                                    })}
                                />
                            </FormGroup>
                            <FormGroup controlId="phoneNumberNameInputField">
                                <ControlLabel column={"password"}>PhoneNumber</ControlLabel>
                                <FormControl
                                    value={this.state.phoneNumber}
                                    placeholder={this.state.phoneNumber}
                                    disabled={(this.state.updateField) ? "" : "disabled"}
                                    onChange={e => this.setState({
                                        "phoneNumber": e.target.value
                                    })}
                                    type="phoneNumber"
                                />
                            </FormGroup>
                        </Col>
                        <div className="col align-self-center" style={{"text-align": " center"}}>
                            <div style={{"margin": "auto", "display": "table"}}>
                                {this.state.emailAlreadyUsed &&
                                < div className="form-group has-danger">
                                    <label className="form-control-label is-invalid" id="inputInvalid"
                                           htmlFor="inputDanger1"/>
                                    <div className="invalid-feedback"
                                         style={{"font-size": "1rem", "text-align": "center"}}> This
                                        email
                                        is already in use. Please use another one.
                                    </div>
                                </div>
                                }
                                {this.state.usernameAlreadyUsed &&
                                < div className="form-group has-danger">
                                    <label className="form-control-label is-invalid" id="inputInvalid"
                                           htmlFor="inputDanger1"/>
                                    <div className="invalid-feedback"
                                         style={{"font-size": "1rem", "text-align": "center"}}> This
                                        username is already in use. Please use another one.
                                    </div>
                                </div>
                                }
                            </div>
                            {!this.state.updateField &&
                            <div style={{"margin": "auto", "display": "table"}}>
                                <Button block bsSize="large" onClick={this.updateFieldFlag.bind(this)}
                                        className="btn btn-primary" style={{"margin": "auto", "display": "table"}}>
                                    Update
                                </Button>
                            </div>
                            }
                            {this.state.updateField &&
                            <div style={{"margin": "auto", "display": "table"}}>
                                <Button block bsSize="large" onClick={this.updateFieldFlag.bind(this)}
                                        disabled={!this.validateForm()} type="submit"
                                        className="btn btn-primary" style={{"margin": "auto", "display": "table"}}>
                                    Save
                                </Button>
                            </div>
                            }
                        </div>
                    </form>
                </Container>
            );
    }
}

export default MyProfile;