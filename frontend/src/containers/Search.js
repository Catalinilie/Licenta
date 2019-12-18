import React, {useState} from "react";
import {FormGroup, FormControl} from "react-bootstrap";
import "./Login.css";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import axios from 'axios';
import LoaderButton from "../components/LoaderButton";
import {useFormFields} from "../libs/hooksLib";

export default function Login(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        type: "",
        numberOfPlayers: ""
    });

    function validateForm() {
        return fields.type.length > 0 && fields.numberOfPlayers.length > 0;
    }

    async function getResults(event) {
        event.preventDefault();

        setIsLoading(true);

        const params = {
            "type": fields.type,
            "numberOfPlayers": fields.numberOfPlayers
        };
        try {
            const res = await axios.get('http://localhost:4996/playingFields', params);

            console.log(res.data);

        } catch (e) {
            alert(e.message);
            setIsLoading(false);
        }
    }

    return (
        <div className="Login">
            <form onSubmit={getResults}>
                <FormGroup controlId="type">
                    <ControlLabel>Type</ControlLabel>
                    <FormControl
                        autoFocus
                        type="type"
                        value={fields.type}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="numberOfPlayers">
                    <ControlLabel>Number of players</ControlLabel>
                    <FormControl
                        type="numberOfPlayers"
                        value={fields.numberOfPlayers}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                    className="LoginButton"
                >
                    Search
                </LoaderButton>
            </form>
        </div>
    );
}