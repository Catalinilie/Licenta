import React, {Component} from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import "./ResetPassword.css"
import LoaderButton from "../components/LoaderButton";
import {ReactComponent as VisibilityOff} from "../icons/turn-visibility-off-button.svg"
import {ReactComponent as VisibilityOn} from "../icons/visibility-button.svg"
import axios from "axios";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: this.props.match.params.token,
            email: this.props.match.params.email,
            password: "",
            type: "password"
        };
    }

    selectLogo(type) {
        if (type === "text")
            return <VisibilityOff id="logoId" fill="gray"/>;
        else
            return <VisibilityOn id="logoId" fill="gray"/>;
    }

    showPassword(txt) {
        if (txt === "text") {
            this.setState({type: "password"});
        } else {
            this.setState({type: "text"});
        }
        return true;
    }
     validateForm() {
        return this.state.password.length > 0;
    }

    async handleSubmit(e) {
        e.preventDefault();
        const params = {
            "email": this.state.email,
            "newPassword": this.state.password
        };
       await axios.patch('http://localhost:4996/resetPassword?token=' + this.state.token, params)
           .then(() => this.props.history.push("/home"));

    }

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="resetPasswordContainer">
                        <TextField className="textFieldClass"
                                   id="outlined-email" label="Email"
                                   variant="outlined" value={this.state.email}
                                   disabled={true}/>
                        <TextField className="textFieldClass" id="outlined-password" label="New Password"
                                   variant="outlined" value={this.state.password}
                                   type={this.state.type}
                                   onChange={(e) => this.setState({password: e.target.value})}
                                   InputProps={{
                                       endAdornment: (
                                           <InputAdornment position='end'>
                                       <span onClick={() => this.showPassword(this.state.type)}>
                                           {this.selectLogo(this.state.type)}
                                       </span>

                                           </InputAdornment>
                                       ),
                                   }}
                        />
                        <LoaderButton
                            block
                            type="submit"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            className="btn btn-primary LoginButton"
                            onClick={(e) => this.handleSubmit(e)}
                        >
                            Reset Password
                        </LoaderButton>
                    </div>
                </form>
            </div>
        )
    }
}

export default ResetPassword;