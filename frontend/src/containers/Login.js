import React, {useState} from "react";
import { FormGroup, FormControl} from "react-bootstrap";
import "./Login.css";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import axios from 'axios';
import LoaderButton from "../components/LoaderButton";
import {useFormFields} from "../libs/hooksLib";

export default function Login(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(false);
    const [token, setToken] = useState(false);
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

            props.userHasAuthenticated(true);
            console.log(res.data);
            setUserId(res.data["userId"]);
            setToken(res.data["token"]);
            props.history.push("/home");
        } catch (e) {
            alert(e.message);
            setIsLoading(false);
        }
    }

    return (
        <div className="Login" userId={userId} token={token}>
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="username" bsSize="large">
                    <ControlLabel>Username</ControlLabel>
                    <FormControl
                        autoFocus
                        type="username"
                        value={fields.username}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                    />
                </FormGroup >
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                    className="LoginButton"
                >
                    Login
                </LoaderButton>
            </form>
        </div>
    );
}