import React, {Component} from "react";
import {Button} from "react-bootstrap";
import "./Login.css";
import axios from 'axios';
import "./MyProfile.css"
import {Link} from "react-router-dom";
import Container from "reactstrap/es/Container";
import Col from "react-bootstrap/lib/Col";
import TextField from "@material-ui/core/TextField";


class MyProfile extends Component {


    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            firstName: "",
            lastName: "",
            password: "",
            emailAlreadyUsed: false,
            usernameAlreadyUsed: false,
            updateField: false
        };
        this.getData();
    }


    updateFieldFlag() {
        this.setState({
            updateField: true
        });
    }

    cancelUpdate() {
        this.setState({
            updateField: false
        });
    }

    validateForm() {
        return this.state.firstName.length > 0 && this.state.lastName.length > 0
            && this.state.password.length > 0 && this.state.phoneNumber.length > 0;
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
                        "phoneNumber": res.data.phoneNumber
                    });
                    this.setState({
                        "firstName": res.data.firstName
                    });
                    this.setState({
                        "lastName": res.data.lastName
                    });
                }
            });
    }

    async handleSubmit(state, e) {
        e.preventDefault();
        const params = {
            "userId": sessionStorage.getItem("userId"),
            "phoneNumber": this.state.phoneNumber,
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "password": this.state.password,
        };
        let token = sessionStorage.getItem("token");
        let res;
        try {
            res = await axios.patch('http://localhost:4996/users?token=' + token, params);
        } catch (e) {
        }
        if (e.message === "Network Error")
            alert(e.message);

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
                    <form className="row myProfileContainerClass">
                        <Col md={6} className="textFieldColClass">
                            <TextField className="textFieldClass" id="outlined-password" label="Password"
                                       variant="outlined" placeholder="Enter password"
                                       onChange={e => this.setState({
                                           "password": e.target.value
                                       })}
                                       value={this.state.password}
                                       type="password"
                                       disabled={(!this.state.updateField)}/>
                            <TextField className="textFieldClass" id="outlined-phoneNumber" label="PhoneNumber"
                                       variant="outlined" value={this.state.phoneNumber}
                                       placeholder={this.state.phoneNumber}
                                       disabled={(!this.state.updateField)}
                                       onChange={e => this.setState({
                                           "phoneNumber": e.target.value
                                       })}/>
                        </Col>
                        <Col md={6} className="textFieldColClass">
                            <TextField className="textFieldClass" id="outlined-firstName" label="First Name"
                                       variant="outlined" placeholder={this.state.firstName}
                                       value={this.state.firstName}
                                       disabled={(!this.state.updateField)}
                                       onChange={e => this.setState({
                                           "firstName": e.target.value
                                       })}/>
                            <TextField className="textFieldClass" id="outlined-lastName" label="Last Name"
                                       variant="outlined" placeholder={this.state.lastName}
                                       value={this.state.lastName}
                                       disabled={(!this.state.updateField)}
                                       onChange={e => this.setState({
                                           "lastName": e.target.value
                                       })}/>
                        </Col>
                        <div className="col align-self-center myProfileBoxClass">
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
                            <div className="myProfileUpdateButtonClass">
                                <Button block bsSize="large" onClick={this.updateFieldFlag.bind(this)}
                                        className="btn btn-primary" style={{"margin": "auto", "display": "table"}}>
                                    Update
                                </Button>
                            </div>
                            }
                            {this.state.updateField &&
                            <>
                                <div className="container-fluid">
                                    <div className="row buttonClassControl">
                                        <Button bsSize="large" onClick={(e) => this.handleSubmit(this.state, e)}
                                                disabled={!this.validateForm()} type="submit"
                                                className="btn btn-primary">
                                            Save
                                        </Button>
                                        <Button bsSize="large" onClick={this.cancelUpdate.bind(this)}
                                                type="submit"
                                                className="btn btn-primary">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </>
                            }
                        </div>
                    </form>
                </Container>
            );
    }
}

export default MyProfile;