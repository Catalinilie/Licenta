import React, {useState} from "react";
import "./Login.css";
import axios from 'axios';
import LoaderButton from "../components/LoaderButton";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {ReactComponent as VisibilityOff} from "../icons/turn-visibility-off-button.svg"
import {ReactComponent as VisibilityOn} from "../icons/visibility-button.svg"
import Button from "@material-ui/core/Button";
import Modal from "react-modal";

const addFacilitiesModalStyle = {
    content: {
        height: "20em",
        width: "40em",
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

export default function Login(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [wrongCredential, setWrongCredential] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState("password");
    const [modalResetPassword, setModalResetPassword] = useState(false);
    const [emailError, setEmailError] = useState(false);

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

    function validateResetPassword(){
        const expression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let valid = expression.test(String(email).toLowerCase());
        if (!valid)
            setEmailError(true);
        else
            setEmailError(false);
        return emailError !== true;

    }

    async function accountExist() {
        let emailValid = validateResetPassword();
        if(!emailValid)
        {
            return ;
        }
        try{
        await axios.get("http://localhost:4996/accountExists?email=" + email).then(
            (res) => {
                if (res.status === 200)
                    resetPassword();
                else
                    console.log("Account doesn't exist.")
            }
        );
    } catch (e) {
        if (e.response.status === 404)
            console.log(e);
    }
    setEmail("");
    }

    async function resetPassword() {
        const param = {
            "email": email
        };

        await axios.post("http://localhost:4996/resetPassword", param);
        setModalResetPassword(false);
    }

    function openResetPasswordModal() {
        setModalResetPassword(true);
    }

    function closeModal() {
        setModalResetPassword(false);
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
                    <span>
                        <Button className="forgotPasswordButtonClass"
                                onClick={openResetPasswordModal}>Reset Password</Button>
                    </span>
                </div>
                {wrongCredential &&
                < div className="form-group has-danger">
                    <label className="form-control-label is-invalid" id="inputInvalid" htmlFor="inputDanger1"/>
                    <div className="invalid-feedback" style={{'font-size': "1rem"}}>Wrong credential. Please try
                        again.
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
            <Modal
                isOpen={modalResetPassword}
                enforceFocus={true}
                onRequestClose={closeModal}
                style={addFacilitiesModalStyle}
                contentLabel="Add Facilities"
            >
                <Button className="btn btn-primary closeButtonModal"
                        onClick={closeModal}>Close</Button>
                <div className="resetPasswordContainerClass">
                    <div className="resetPasswordTextClass">
                        Reset Password
                    </div>
                    <br/>
                    <div>
                        In order to reset your password please enter your email address.
                    </div>
                    <form>
                        <TextField className="resetPasswordContainerText"
                                   id="outlined-email" label="Email address"
                                   error={emailError}
                                   onBlur={validateEmail}
                                   onFocus={focusEmail}
                                   helperText={emailError ? "Email invalid." : false}
                                   variant="outlined" value={email}
                                   onChange={(e) => setEmail(e.target.value)}/>
                    </form>
                    <Button className="btn btn-primary resetPasswordModalButtonClass"
                            onClick={accountExist}>Reset Password</Button>
                </div>
            </Modal>
        </div>);
}