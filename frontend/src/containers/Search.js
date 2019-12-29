import React, {useState} from "react";
import {FormGroup, FormControl} from "react-bootstrap";
import "./Login.css";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import axios from 'axios';
import LoaderButton from "../components/LoaderButton";
import {useFormFields} from "../libs/hooksLib";
import Async from "react-async";
import PlayingFieldCard from "../components/PlayingFieldCard";

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
        if(event) event.preventDefault();
        setIsLoading(true);

        const params = {
            "type": fields.type,
            "numberOfPlayers": fields.numberOfPlayers
        };
        try {
            const res = await axios.get('http://localhost:4996/search', params);

            console.log(res.data);

        } catch (e) {
            alert(e.message);
            setIsLoading(false);
        }
    }

    function display(event) {
        if(event) event.preventDefault();
        return (
            <div>
                <Async promiseFn={getResults}>
                    {({data, err, isLoading}) => {
                        if (isLoading) return "Loading...";
                        if (err) return `Something went wrong: ${err.message}`;

                        if (data)
                            return (<div>
                                {data.data.map(playingField => (
                                    <PlayingFieldCard field={playingField}/>
                                ))}
                            </div>);
                    }}
                </Async>
            </div>
        );
    }

    return (
        <div className="Login">
            <form onSubmit={display}>
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
                    className="btn btn-primary"
                >
                    Search
                </LoaderButton>
            </form>
        </div>
    );
}