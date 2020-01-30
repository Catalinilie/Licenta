import React, {useState} from "react";
import {Button} from "react-bootstrap";
import "./Register.css";
import axios from 'axios';
import Container from "reactstrap/es/Container";
import Col from "react-bootstrap/lib/Col";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {ReactComponent as VisibilityOff} from "../icons/turn-visibility-off-button.svg";
import {ReactComponent as VisibilityOn} from "../icons/visibility-button.svg";
import validator from 'validator'


export default function Register(props) {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emailAlreadyUsed, setEmailAlreadyUsed] = useState(false);
    const [usernameAlreadyUsed, seUsernameAlreadyUsed] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [type, setType] = useState("password");

    function validateForm() {
        if (usernameError === true || passwordError === true || lastNameError === true || firstNameError === true || phoneNumberError === true || emailError === true)
            return false;
        return username.length > 0 && password.length > 0 && firstName.length > 0 && lastName.length > 0 && email.length > 0 && phoneNumber.length > 0;
    }

    function validateUsername() {
        if (username.length < 5)
            setUsernameError(true);
        else
            setUsernameError(false);
    }

    function focusUserName() {
        setUsernameError(false);
    }

    function validateEmail() {
        const expression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let valid = expression.test(String(email).toLowerCase());
        if (!valid)
            setEmailError(true);
        else
            setEmailError(false);
    }

    function focusEmail() {
        setEmailError(false);
    }

    function validatePassword() {
        if (password.length < 6)
            setPasswordError(true);
        else
            setPasswordError(false);
    }

    function focusPassword() {
        setPasswordError(false);
    }

    function validateFirstName() {
        if (firstName.length < 3)
            setFirstNameError(true);
        else
            setFirstNameError(false);
    }

    function focusFirstName() {
        setFirstNameError(false);
    }

    function validateLastName() {
        if (lastName.length < 3)
            setLastNameError(true);
        else
            setLastNameError(false);
    }

    function focusLastName() {
        setLastNameError(false);
    }

    function validatePhoneNumber() {
        if (!validator.isMobilePhone(phoneNumber))
            setPhoneNumberError(true);
        else
            setPhoneNumberError(false);
    }

    function focusPhoneNumber() {
        setPhoneNumberError(false);
    }


    function selectLogo(type) {
        if (type === "text")
            return <VisibilityOff id="logoId" fill="gray"/>;
        else
            return <VisibilityOn id="logoId" fill="gray"/>;
    }

    function showPassword(txt) {
        if (txt === "text") {
            setType("password");
        } else {
            setType("text");
        }
        return true;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        seUsernameAlreadyUsed(false);
        setEmailAlreadyUsed(false);
        const params = {
            "username": username,
            "firstName": firstName,
            "lastName": lastName,
            "phoneNumber": phoneNumber,
            "email": email,
            "password": password
        };
        try {
            await axios.post('http://localhost:4996/register', params);
            props.history.push("/home");
        } catch (e) {
            if (e.message !== "Network Error") {
                if (e.response.data === "Username already exist.")
                    seUsernameAlreadyUsed(true);
                else if (e.response.data === "Email already used by another user.")
                    setEmailAlreadyUsed(true);
            } else
                alert(e.message);
        }
    }

    return (
        <Container>
            <form onSubmit={handleSubmit} style={{"marginTop": "3em"}}>
                <div className="registerContainer row">
                    <Col md={6} style={{"marginBottom": "2em"}}>
                        <TextField className="textFieldClass"
                                   autoFocus
                                   id="outlined-username" label="Username"
                                   error={usernameError}
                                   onBlur={validateUsername}
                                   onFocus={focusUserName}
                                   helperText={usernameError ? "Username should have at least 6 characters." : false}
                                   variant="outlined" value={username}
                                   onChange={(e) => setUsername(e.target.value)}/>
                        <TextField className="textFieldClass"
                                   type="email"
                                   error={emailError}
                                   onBlur={validateEmail}
                                   onFocus={focusEmail}
                                   helperText={emailError ? "Email invalid." : false}
                                   id="outlined-email" label="Email"
                                   variant="outlined" value={email}
                                   onChange={e => setEmail(e.target.value)}/>
                        <TextField className="textFieldClass"
                                   id="outlined-password" label="Password"
                                   variant="outlined" value={password}
                                   type={type}
                                   error={passwordError}
                                   onBlur={validatePassword}
                                   onFocus={focusPassword}
                                   helperText={passwordError ? "Password should have at least 6 characters." : false}
                                   InputProps={{
                                       endAdornment: (
                                           <InputAdornment position='end'>
                                       <span onClick={() => showPassword(type)}>
                                           {selectLogo(type)}
                                       </span>

                                           </InputAdornment>
                                       ),
                                   }}
                                   onChange={e => setPassword(e.target.value)}
                        />
                    </Col>
                    <Col md={6} style={{"marginBottom": "2em"}}>
                        <TextField className="textFieldClass"
                                   id="outlined-first-name" label="First Name"
                                   error={firstNameError}
                                   onBlur={validateFirstName}
                                   onFocus={focusFirstName}
                                   helperText={firstNameError ? "First Name should have at least 3 characters." : false}
                                   variant="outlined" value={firstName}
                                   onChange={e => setFirstName(e.target.value)}
                        />
                        <TextField className="textFieldClass"
                                   id="outlined-last-name" label="Last Name"
                                   error={lastNameError}
                                   onBlur={validateLastName}
                                   onFocus={focusLastName}
                                   helperText={lastNameError ? "Last Name should have at least 3 characters." : false}
                                   variant="outlined" value={lastName}
                                   onChange={e => setLastName(e.target.value)}
                        />
                        <TextField className="textFieldClass"
                                   id="outlined-phone-number" label="Phone Number"
                                   error={phoneNumberError}
                                   onBlur={validatePhoneNumber}
                                   onFocus={focusPhoneNumber}
                                   helperText={phoneNumberError ? "Phone number invalid." : false}
                                   variant="outlined" value={phoneNumber}
                                   onChange={e => setPhoneNumber(e.target.value)}
                        />
                    </Col>
                </div>
                <div className="col align-self-center" style={{"textAlign": "center"}}>
                    <div style={{"margin": "auto", "display": "table"}}>
                        {emailAlreadyUsed &&
                        < div className="form-group has-danger">
                            <label className="form-control-label is-invalid" id="inputInvalid" htmlFor="inputDanger1"/>
                            <div className="invalid-feedback"
                                 style={{"font-size": "1rem", "text-align": "center"}}> This
                                email
                                is already in use. Please use another one.
                            </div>
                        </div>
                        }
                        {usernameAlreadyUsed &&
                        < div className="form-group has-danger">
                            <label className="form-control-label is-invalid" id="inputInvalid" htmlFor="inputDanger1"/>
                            <div className="invalid-feedback"
                                 style={{"font-size": "1rem", "text-align": "center"}}> This
                                username is already in use. Please use another one.
                            </div>
                        </div>
                        }
                    </div>
                    <div style={{"margin": "auto", "display": "table"}}>
                        <Button block bsSize="large" disabled={!validateForm()} type="submit"
                                className="btn btn-primary" style={{"margin": "auto", "display": "table"}}>
                            Register
                        </Button>
                    </div>
                </div>
            </form>
        </Container>
    );
}