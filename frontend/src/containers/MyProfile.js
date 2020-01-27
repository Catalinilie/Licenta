import React, {Component} from "react";
import {Button} from "react-bootstrap";
import "./Login.css";
import axios from 'axios';
import "./MyProfile.css"
import {Link} from "react-router-dom";
import Container from "reactstrap/es/Container";
import Col from "react-bootstrap/lib/Col";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {ReactComponent as VisibilityOff} from "../icons/turn-visibility-off-button.svg";
import {ReactComponent as VisibilityOn} from "../icons/visibility-button.svg";
import validator from "validator";


class MyProfile extends Component {


    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            firstName: "",
            lastName: "",
            password: "",
            type: "password",
            passwordError: false,
            phoneNumberError: false,
            firstNameError: false,
            lastNameError: false,
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
        if( this.state.phoneNumberError===true || this.state.passwordError===true || this.state.lastNameError===true || this.state.firstNameError===true )
            return false;
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

    validatePassword() {
        if (this.state.password.length < 6)
            this.setState({
                passwordError: true
            });
        else
            this.setState({
                passwordError: false
            });
    }

    focusPassword() {
        this.setState({
            passwordError: false
        });
    }

    validatePhoneNumber() {
        if (!validator.isMobilePhone(this.state.phoneNumber))
            this.setState({phoneNumberError: true});
        else
            this.setState({phoneNumberError: false});
    }

    focusPhoneNumber() {
        this.setState({
            passwordError: false
        });
    }

    validateFirstName() {
        if (this.state.firstName.length < 3)
            this.setState({
                firstNameError: true
            });
        else
            this.setState({
                firstNameError: false
            });
    }

    focusFirstName() {
        this.setState({
            firstNameError: false
        });
    }

    validateLastName() {
        if (this.state.lastName.length < 3)
            this.setState({
                lastNameError: true
            });
        else
            this.setState({
                lastNameError: false
            });
    }

    focusLastName() {
        this.setState({
            lastNameError: false
        });
    }


    showPassword(txt) {
        if (txt === "text") {
            this.setState({
                type: "password"
            });
        } else {
            this.setState({
                type: "text"
            });
        }
        return true;
    }

    selectLogo(type) {
        if (type === "text")
            return <VisibilityOff id="logoId" fill="gray"/>;
        else
            return <VisibilityOn id="logoId" fill="gray"/>;
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
                            <TextField className="textFieldClass"
                                       id="outlined-username" label="Password"
                                       variant="outlined" value={this.state.password}
                                       type={this.state.type}
                                       error={this.state.passwordError}
                                       disabled={(!this.state.updateField)}
                                       onBlur={this.validatePassword.bind(this)}
                                       onFocus={this.focusPassword.bind(this)}
                                       helperText={this.state.passwordError ? "Password should have at least 6 characters." : false}
                                       InputProps={{
                                           endAdornment: (
                                               <InputAdornment position='end'>
                                       <span onClick={() => this.showPassword(this.state.type)}>
                                           {this.selectLogo(this.state.type)}
                                       </span>

                                               </InputAdornment>
                                           ),
                                       }}
                                       onChange={e => this.setState({password: e.target.value})}
                            />
                            <TextField className="textFieldClass" id="outlined-phoneNumber" label="PhoneNumber"
                                       variant="outlined" value={this.state.phoneNumber}
                                       placeholder={this.state.phoneNumber}
                                       disabled={(!this.state.updateField)}
                                       error={this.state.phoneNumberError}
                                       onBlur={this.validatePhoneNumber.bind(this)}
                                       onFocus={this.focusPhoneNumber.bind(this)}
                                       helperText={this.state.phoneNumberError ? "Phone number incorect." : false}
                                       onChange={e => this.setState({
                                           "phoneNumber": e.target.value
                                       })}/>
                        </Col>
                        <Col md={6} className="textFieldColClass">
                            <TextField className="textFieldClass" id="outlined-firstName" label="First Name"
                                       variant="outlined" placeholder={this.state.firstName}
                                       value={this.state.firstName}
                                       error={this.state.firstNameError}
                                       onBlur={this.validateFirstName.bind(this)}
                                       onFocus={this.focusFirstName.bind(this)}
                                       helperText={this.state.firstNameError ? "First name should have at least 3 characters." : false}
                                       disabled={(!this.state.updateField)}
                                       onChange={e => this.setState({
                                           "firstName": e.target.value
                                       })}/>
                            <TextField className="textFieldClass" id="outlined-lastName" label="Last Name"
                                       variant="outlined" placeholder={this.state.lastName}
                                       value={this.state.lastName}
                                       error={this.state.lastNameError}
                                       onBlur={this.validateLastName.bind(this)}
                                       onFocus={this.focusLastName.bind(this)}
                                       helperText={this.state.lastNameError ? "Last name should have at least 3 characters." : false}
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