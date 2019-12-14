import React, {useState} from "react";
import {Button, FormGroup, FormControl} from "react-bootstrap";
import "./Login.css";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import axios from 'axios';

export default function Login(props) {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    function validateForm() {
        return username.length > 0 && password.length > 0 && firstName.length > 0 && lastName.length > 0 && email.length > 0 && phoneNumber.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const params = {
            "username": username,
            "firstName": firstName,
            "lastName": lastName,
            "phoneNumber": phoneNumber,
            "email": email,
            "password": password
        };
        const res = await axios.post('http://localhost:4996/register', params);
        console.log(res.data);
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="email" bsSize="medium">
                    <ControlLabel column={"username"}>Username</ControlLabel>
                    <FormControl
                        autoFocus
                        type="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </FormGroup>

                <FormGroup controlId="firstName" bsSize="medium">
                    <ControlLabel column={"firstName"}>First Name</ControlLabel>
                    <FormControl
                        autoFocus
                        type="firstName"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="lastName" bsSize="medium">
                    <ControlLabel column={"firstName"}>Last Name</ControlLabel>
                    <FormControl
                        autoFocus
                        type="lastName"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="phoneNumber" bsSize="medium">
                    <ControlLabel column={"password"}>PhoneNumber</ControlLabel>
                    <FormControl
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        type="phoneNumber"
                    />
                </FormGroup>
                <FormGroup controlId="email" bsSize="medium">
                    <ControlLabel column={"password"}>Email</ControlLabel>
                    <FormControl
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="medium">
                    <ControlLabel column={"password"}>Password</ControlLabel>
                    <FormControl
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                </FormGroup>
                <Button block bsSize="large" disabled={!validateForm()} type="submit">
                    Register
                </Button>
            </form>
        </div>
    );
}