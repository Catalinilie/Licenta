import React, {useState} from "react";
import "./Login.css";
import axios from 'axios';
import LoaderButton from "../components/LoaderButton";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {ReactComponent as VisibilityOff} from "../icons/turn-visibility-off-button.svg"
import {ReactComponent as VisibilityOn} from "../icons/visibility-button.svg"

export default function Login(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [wrongCredential, setWrongCredential] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState("password");

    function validateForm() {
        return username.length > 0 && password.length > 0;
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

        setIsLoading(true);

        const params = {
            "username": username,
            "password": password
        };
        try {
            const res = await axios.post('http://localhost:4996/login', params);

            sessionStorage.setItem("isAuthenticated", "true");
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

    function selectLogo(type) {
        if (type === "text")
            return <VisibilityOff id="logoId" fill="gray"/>;
        else
            return <VisibilityOn id="logoId" fill="gray"/>;
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <div className="loginContainer">
                    <TextField className="textFieldClass"
                               id="outlined-username" label="Username"
                               variant="outlined" value={username}
                               onChange={(e) => setUsername(e.target.value)}/>
                    <TextField className="textFieldClass" id="outlined-password" label="Password"
                               variant="outlined" value={password}
                               type={type}
                               onChange={(e) => setPassword(e.target.value)}
                               InputProps={{
                                   endAdornment: (
                                       <InputAdornment position='end'>
                                       <span onClick={() => showPassword(type)}>
                                           {selectLogo(type)}
                                       </span>

                                       </InputAdornment>
                                   ),
                               }}
                    />

                </div>
                {wrongCredential &&
                < div className="form-group has-danger">
                    <label className="form-control-label is-invalid" id="inputInvalid" htmlFor="inputDanger1"/>
                    <div className="invalid-feedback" style={{'font-size': "1rem"}}>Wrong credential. Please try
                        again
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