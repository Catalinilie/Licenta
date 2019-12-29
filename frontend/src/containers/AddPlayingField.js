import React, {Component} from "react";
import {Button, FormGroup, FormControl} from "react-bootstrap";
import "./Login.css";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import axios from 'axios';
import "./AddPlayingField.css"
import ImageUploader from 'react-images-upload';



class Login extends Component {


    constructor(props) {
        super(props);
        this.state = {
            type: "",
            numberOfPlayers: "",
            street: "",
            streetNr: "",
            city: "",
            region: "",
            country: "",
            addressCode: "",
            description: "",
            image: ""
        };
        // const [type, setType] = useState("");
        // const [numberOfPlayers, setNumberOfPlayers] = useState("");
        // const [street, setStreet] = useState("");
        // const [streetNr, setStreetNr] = useState("");
        // const [city, setCity] = useState("");
        // const [region, setRegion] = useState("");
        // const [country, setCountry] = useState("");
        // const [addressCode, setAddressCode] = useState("");
        // const [description, setDescription] = useState("");
        // const [image, setImage] = useState(null);
    }

    validateForm() {
        return this.state.type.length > 0
            && this.state.numberOfPlayers.length > 0
            && this.state.street.length > 0
            && this.state.streetNr.length > 0
            && this.state.city.length > 0
            && this.state.region.length > 0
            && this.state.country.length > 0
            && this.state.addressCode.length > 0;
    }

    onDrop(picture) {
        this.setState({
            pictures: this.state.pictures.concat(picture),
        });
    }

    onClickHandler() {
        const data = new FormData();
        data.append('image', this.state.image);
        axios.post('http://localhost:4996/uploadImage?playingFieldId=' + "30f7d752-d0d0-4458-866d-c55101ca8a58", data)
            .then(res => console.log(res.statusText));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const params = {
            "type": this.state.type,
            "numberOfPlayers": this.state.numberOfPlayers,
            "userId": this.props.userId,
            "description": this.state.description,
            "address": {
                "street": this.state.street,
                "streetNr": this.state.streetNr,
                "city": this.state.city,
                "region": this.state.region,
                "country": this.state.country,
                "addressCode": this.state.addressCode
            }
        };
        const res = await axios.post('http://localhost:4996/playingField?token=' + this.props.token, params);
        console.log(res.data);
        this.props.history.push("/myPlayingFields");
    }

    render() {
        if (this.props.token == null)
            return this.props.history.push("/login");
        else
            return (
                <div className="Login">
                    <form onSubmit={e => this.handleSubmit({e})}>
                        <FormGroup controlId="type">
                            <ControlLabel column={"type"}>Type</ControlLabel>
                            <FormControl
                                autoFocus
                                type="type"
                                value={this.state.type}
                                onChange={e => this.setState({type: e.target.value})}
                            />
                        </FormGroup>

                        <FormGroup controlId="numberOfPlayers">
                            <ControlLabel column={"numberOfPlayers"}>Number of players</ControlLabel>
                            <FormControl
                                autoFocus
                                type="numbeOfPlayers"
                                value={this.state.numberOfPlayers}
                                onChange={e => this.setState({numberOfPlayers: e.target.value})}
                            />
                        </FormGroup>
                        <FormGroup controlId="street">
                            <ControlLabel column={"street"}>Street</ControlLabel>
                            <FormControl
                                autoFocus
                                type="street"
                                value={this.state.street}
                                onChange={e => this.setState({street: e.target.value})}
                            />
                        </FormGroup>
                        <FormGroup controlId="streetNr">
                            <ControlLabel column={"streetNr"}>Street number</ControlLabel>
                            <FormControl
                                value={this.state.streetNr}
                                onChange={e => this.setState({streetNr: e.target.value})}
                                type="streetNr"
                            />
                        </FormGroup>
                        <FormGroup controlId="city">
                            <ControlLabel column={"city"}>City</ControlLabel>
                            <FormControl
                                value={this.state.city}
                                onChange={e => this.setState({city: e.target.value})}
                                type="city"
                            />
                        </FormGroup>
                        <FormGroup controlId="region">
                            <ControlLabel column={"region"}>Region</ControlLabel>
                            <FormControl
                                value={this.state.region}
                                onChange={e => this.setState({region: e.target.value})}
                                type="region"
                            />
                        </FormGroup>
                        <FormGroup controlId="country">
                            <ControlLabel column={"country"}>Country</ControlLabel>
                            <FormControl
                                value={this.state.country}
                                onChange={e => this.setState({country: e.target.value})}
                                type="country"
                            />
                        </FormGroup>
                        <FormGroup controlId="this.addressCode">
                            <ControlLabel column={"addressCode"}>Postal Code</ControlLabel>
                            <FormControl
                                value={this.state.addressCode}
                                onChange={e => this.setState({addressCode: e.target.value})}
                                type="addressCode"
                            />
                        </FormGroup>
                        <FormGroup controlId="description">
                            <ControlLabel column={"description"}>Description</ControlLabel>
                            <FormControl
                                value={this.state.description}
                                onChange={e => this.setState({description: e.target.value})}
                                type="description"
                            />
                        </FormGroup>
                        <ImageUploader
                            withIcon={true}
                            buttonText='Choose images'
                            onChange={this.onDrop}
                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                            maxFileSize={5242880}
                        />
                        <Button block bsSize="large" disabled={!this.validateForm()} type="submit">
                            Add Playing Field
                        </Button>
                    </form>
                </div>
            );
    }
}

export default Login;