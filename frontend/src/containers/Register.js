import React, {useState} from "react";
import {Button, FormGroup, FormControl} from "react-bootstrap";
import "./Login.css";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import axios from 'axios';
import Container from "reactstrap/es/Container";
import Col from "react-bootstrap/lib/Col";

export default function Register(props) {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emailAlreadyUsed, setEmailAlreadyUsed] = useState(false);
    const [usernameAlreadyUsed, seUsernameAlreadyUsed] = useState(false);

    function validateForm() {
        return username.length > 0 && password.length > 0 && firstName.length > 0 && lastName.length > 0 && email.length > 0 && phoneNumber.length > 0;
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
            const res = await axios.post('http://localhost:4996/register', params);
            console.log(res.data);
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
            <form className="row" onSubmit={handleSubmit} style={{"margin-top": "3em"}}>
                <Col md={6} style={{"margin-bottom": "2em"}}>
                    <FormGroup controlId="username">
                        <ControlLabel column={"username"}>Username</ControlLabel>
                        <FormControl
                            autoFocus
                            type="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup controlId="email">
                        <ControlLabel column={"password"}>Email</ControlLabel>
                        <FormControl
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                        />
                    </FormGroup>
                    <FormGroup controlId="password">
                        <ControlLabel column={"password"}>Password</ControlLabel>
                        <FormControl
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            type="password"
                        />
                    </FormGroup>
                </Col>
                <Col md={6} style={{"margin-bottom": "2em"}}>
                    <FormGroup controlId="firstName">
                        <ControlLabel column={"firstName"}>First Name</ControlLabel>
                        <FormControl
                            type="firstName"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup controlId="lastName">
                        <ControlLabel column={"lastName"}>Last Name</ControlLabel>
                        <FormControl
                            type="lastName"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup controlId="phoneNumber">
                        <ControlLabel column={"password"}>PhoneNumber</ControlLabel>
                        <FormControl
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                            type="phoneNumber"
                        />
                    </FormGroup>
                </Col>
                <div className="col align-self-center" style={{"text-align":" center"}}>
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