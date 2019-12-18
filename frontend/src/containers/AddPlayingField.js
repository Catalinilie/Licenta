import React, {useState} from "react";
import {Button, FormGroup, FormControl} from "react-bootstrap";
import "./Login.css";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import axios from 'axios';

export default function Login(props) {
    const [type, setType] = useState("");
    const [numberOfPlayers, setNumberOfPlayers] = useState("");
    const [street, setStreet] = useState("");
    const [streetNr, setStreetNr] = useState("");
    const [city, setCity] = useState("");
    const [region, setRegion] = useState("");
    const [country, setCountry] = useState("");
    const [addressCode, setAddressCode] = useState("");

    function validateForm() {
        return type.length > 0
            && numberOfPlayers.length > 0
            && street.length > 0
            && streetNr.length > 0
            && city.length > 0
            && region.length > 0
            && country.length > 0
            && addressCode.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const params = {
            "type": type,
            "numberOfPlayers": numberOfPlayers,
            "userId": props.userId,
            "address": {
                "street": street,
                "streetNr": streetNr,
                "city": city,
                "region": region,
                "country": country,
                "addressCode": addressCode
            }
        };
        const res = await axios.post('http://localhost:4996/playingField?token=' + props.token, params);
        console.log(res.data);
        props.history.push("/myPlayingFields");
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="type">
                    <ControlLabel column={"type"}>Type</ControlLabel>
                    <FormControl
                        autoFocus
                        type="type"
                        value={type}
                        onChange={e => setType(e.target.value)}
                    />
                </FormGroup>

                <FormGroup controlId="numberOfPlayers">
                    <ControlLabel column={"numberOfPlayers"}>Number of players</ControlLabel>
                    <FormControl
                        autoFocus
                        type="numbeOfPlayers"
                        value={numberOfPlayers}
                        onChange={e => setNumberOfPlayers(e.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="street">
                    <ControlLabel column={"street"}>Street</ControlLabel>
                    <FormControl
                        autoFocus
                        type="street"
                        value={street}
                        onChange={e => setStreet(e.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="streetNr">
                    <ControlLabel column={"streetNr"}>Street number</ControlLabel>
                    <FormControl
                        value={streetNr}
                        onChange={e => setStreetNr(e.target.value)}
                        type="streetNr"
                    />
                </FormGroup>
                <FormGroup controlId="city">
                    <ControlLabel column={"city"}>City</ControlLabel>
                    <FormControl
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        type="city"
                    />
                </FormGroup>
                <FormGroup controlId="region">
                    <ControlLabel column={"region"}>Region</ControlLabel>
                    <FormControl
                        value={region}
                        onChange={e => setRegion(e.target.value)}
                        type="region"
                    />
                </FormGroup>
                <FormGroup controlId="country">
                    <ControlLabel column={"country"}>Country</ControlLabel>
                    <FormControl
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        type="country"
                    />
                </FormGroup>
                <FormGroup controlId="addressCode">
                    <ControlLabel column={"addressCode"}>Postal Code</ControlLabel>
                    <FormControl
                        value={addressCode}
                        onChange={e => setAddressCode(e.target.value)}
                        type="addressCode"
                    />
                </FormGroup>
                <Button block bsSize="large" disabled={!validateForm()} type="submit">
                    Add Playing Field
                </Button>
            </form>
        </div>
    );
}