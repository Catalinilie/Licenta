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

export default function Register(props) {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emailAlreadyUsed, setEmailAlreadyUsed] = useState(false);
    const [usernameAlreadyUsed, seUsernameAlreadyUsed] = useState(false);
    const [type, setType] = useState("password");

    function validateForm() {
        return username.length > 0 && password.length > 0 && firstName.length > 0 && lastName.length > 0 && email.length > 0 && phoneNumber.length > 0;
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
            <form onSubmit={handleSubmit} style={{"margin-top": "3em"}}>
                <div className="registerContainer row">
                    <Col md={6} style={{"margin-bottom": "2em"}}>
                        <TextField className="textFieldClass"
                                   autofocus
                                   id="outlined-username" label="Username"
                                   variant="outlined" value={username}
                                   onChange={(e) => setUsername(e.target.value)}/>
                        <TextField className="textFieldClass"
                                   autofocus
                                   id="outlined-username" label="Email"
                                   variant="outlined" value={email}
                                   onChange={e => setEmail(e.target.value)}/>
                        <TextField className="textFieldClass"
                                   autofocus
                                   id="outlined-username" label="Password"
                                   variant="outlined" value={password}
                                   type={type}
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
                    <Col md={6} style={{"margin-bottom": "2em"}}>
                        <TextField className="textFieldClass"
                                   autofocus
                                   id="outlined-username" label="First Name"
                                   variant="outlined" value={firstName}
                                   onChange={e => setFirstName(e.target.value)}
                        />
                        <TextField className="textFieldClass"
                                   autofocus
                                   id="outlined-username" label="Last Name"
                                   variant="outlined" value={lastName}
                                   onChange={e => setLastName(e.target.value)}
                        />
                        <TextField className="textFieldClass"
                                   autofocus
                                   id="outlined-username" label="Phone Number"
                                   variant="outlined" value={phoneNumber}
                                   onChange={e => setPhoneNumber(e.target.value)}
                        />
                    </Col>
                </div>
                <div className="col align-self-center" style={{"text-align": " center"}}>
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