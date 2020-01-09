import React, {useState} from "react";
import {FormGroup, FormControl} from "react-bootstrap";
import "./Login.css";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import axios from 'axios';
import LoaderButton from "../components/LoaderButton";
import {useFormFields} from "../libs/hooksLib";

export default function Login(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [wrongCredential, setWrongCredential] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        username: "",
        password: ""
    });

    function validateForm() {
        return fields.username.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        const params = {
            "username": fields.username,
            "password": fields.password
        };
        try {
            const res = await axios.post('http://localhost:4996/login', params);

            sessionStorage.setItem("isAuthenticated", "true");
            console.log(res.data);
            sessionStorage.setItem("userId", res.data["userId"]);
            sessionStorage.setItem("token", res.data["token"]);
            props.history.push("/home");
        } catch (e) {
            if (e.message !== "Network Error") {
                if (e.response.status === 401)
                    setWrongCredential(true);
            } else
                alert(e.message);
            setIsLoading(false);
        }
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="username">
                    <ControlLabel>Username</ControlLabel>
                    <FormControl
                        autoFocus
                        type="username"
                        value={fields.username}
                        onChange={handleFieldChange}
                        placeholder="Enter username"
                    />
                </FormGroup>
                <FormGroup controlId="password">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                        placeholder="Password"
                    />
                </FormGroup>
                {wrongCredential &&
                < div className="form-group has-danger">
                    <label className="form-control-label is-invalid" id="inputInvalid" htmlFor="inputDanger1"/>
                    <div className="invalid-feedback" style={{'font-size': "1rem"}}>Wrong credential. Please try again
                    </div>
                </div>
                }
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                    className="btn btn-primary LoginButton"
                >
                    Login
                </LoaderButton>
            </form>
        </div>
    );
}