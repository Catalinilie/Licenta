import React, {Component} from "react";
import {FormGroup, FormControl} from "react-bootstrap";
import "./Login.css";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import axios from 'axios';
import "./AddPlayingField.css"
import LoaderButton from "../components/LoaderButton";
import {Link} from "react-router-dom";
import Container from "reactstrap/es/Container";
import Col from "react-bootstrap/lib/Col";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";


class AddPlayingField extends Component {


    constructor(props) {
        super(props);
        this.state = {
            type: "",
            numberOfPlayers: "",
            price: "",
            street: "",
            streetNr: "",
            city: "",
            region: "",
            country: "",
            addressCode: "",
            description: "",
            image: null,
            imagePreview: null,
            classes: this.useStyles()
        };


        this.handleImagePreview = this.handleImagePreview.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
    }

    useStyles() {
        return makeStyles(theme => ({
            root: {
                '& > *': {
                    margin: theme.spacing(1),
                    width: 200,
                },
            },
        }));
    }

    validateForm() {
        if (
            this.state.type === undefined
            || this.state.numberOfPlayers === undefined
            || this.state.price === undefined
            || this.state.street === undefined
            || this.state.streetNr === undefined
            || this.state.city === undefined
            || this.state.region === undefined
            || this.state.country === undefined
            || this.state.addressCode === undefined
            || this.state.description === undefined
        )
            return false;
        else
            return (
                this.state.type.length > 0
                && this.state.numberOfPlayers.length > 0
                && this.state.price.length > 0
                && this.state.street.length > 0
                && this.state.streetNr.length > 0
                && this.state.city.length > 0
                && this.state.region.length > 0
                && this.state.country.length > 0
                && this.state.addressCode.length > 0
                && this.state.description.length > 0
            );
    }

    handleImageChange = (e) => {
        this.setState({
            image: e.target.files[0]
        });
        this.setState({
            imagePreview: URL.createObjectURL(e.target.files[0])
        })
    };

    async handleSubmit(state, e) {
        e.preventDefault();
        const params = {
            "type": this.state.type,
            "numberOfPlayers": this.state.numberOfPlayers,
            "price": this.state.price,
            "userId": sessionStorage.getItem("userId"),
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
        let playingFieldId = "";
        let token = sessionStorage.getItem("token");
        const res = await axios.post('http://localhost:4996/playingField?token=' + token, params)
            .then(res => (playingFieldId = res.data.id));


        if (this.state.image !== null) {
            let form_data = new FormData();
            form_data.append('image', this.state.image, this.state.image.name);
            form_data.append('title', this.state.title);
            form_data.append('content', this.state.content);
            let url = 'http://localhost:4996/uploadImage?playingFieldId=' + playingFieldId;

            axios.post(url, form_data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
                .then(res => {
                    console.log(res.data);
                })
                .catch(err => console.log(err));
        }
        this.props.history.push("/myPlayingFields");
        return res;
    }


    handleImagePreview(previewEvent) {
        this.setState({
            file: URL.createObjectURL(previewEvent.target.files[0])
        })
    }

    handleImageUpload(uploadEvent) {
        uploadEvent.preventDefault();
        let fileToUpload = this.state.file;
        const formData = new FormData();

        formData.append("file", fileToUpload);

        axios({
            method: 'post',
            url: 'http://localhost:4996/uploadImage?playingFieldId=6755d469-e4f1-480b-a6ae-5a21d80cd8d2',
            data: formData,
            config: {headers: {'Content-Type': 'multipart/form-data'}}
        })
            .then(response => console.log(response))
            .catch(errors => console.log(errors));

    }

    render() {
        if (sessionStorage.getItem("isAuthenticated") === "false")
            return (
                <div className="container-fluid">
                    <div className="col-sm-12">
                        <div className="as">
                            <div className="card text-white bg-danger mb-3"
                                 style={{"text-align": "center", "margin-top": "3rem"}}>
                                <div className="card-header">You don't have access here!</div>
                                <div className="card-body">
                                    <h4 className="card-title">Access restricted</h4>
                                    <p className="card-text">Please go to login page. </p>
                                    <Link className="btn btn-primary" to="/login">Login</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        else
            return (
                <Container>
                    <form className="{this.state.classes.root} row" style={{"margin-top": "2em"}}>
                        <Col md={6} style={{"text-position": "center"}}>
                            {/*<FormGroup controlId="type">*/}
                            {/*<ControlLabel column={"type"}>Type</ControlLabel>*/}
                            {/*<FormControl
                                    autoFocus
                                    type="type"
                                    value={this.state.type}
                                    onChange={e => this.setState({type: e.target.value})}
                                />
                            </FormGroup>*/}

                            <TextField className="textFieldClass" id="outlined-type" label="Type"
                                       autoFocus
                                       variant="outlined" value={this.state.type}
                                       onChange={e => this.setState({type: e.target.value})}/>
                            {/*<FormGroup controlId="numberOfPlayers">
                                <ControlLabel column={"numberOfPlayers"}>Number of players</ControlLabel>
                                <FormControl
                                    type="numbeOfPlayers"
                                    value={this.state.numberOfPlayers}
                                    onChange={e => this.setState({numberOfPlayers: e.target.value})}
                                />
                            </FormGroup><FormGroup controlId="price">*/}
                            <TextField className="textFieldClass" id="outlined-number-of-players"
                                       label="Number of players"
                                       variant="outlined" value={this.state.numberOfPlayers}
                                       onChange={e => this.setState({numberOfPlayers: e.target.value})}/>
                            {/*<ControlLabel column={"price"}>Price per hour.</ControlLabel>*/}
                            {/*<FormControl
                                type="price"
                                value={this.state.price}
                                onChange={e => this.setState({price: e.target.value})}
                            />*/}
                            <TextField className="textFieldClass" id="outlined-price" label="Price"
                                       variant="outlined" value={this.state.price}
                                       onChange={e => this.setState({price: e.target.value})}/>
                            {/*</FormGroup>*/}
                            {/* <FormGroup controlId="street">
                                <ControlLabel column={"street"}>Street</ControlLabel>
                                <FormControl
                                    type="street"
                                    value={this.state.street}
                                    onChange={e => this.setState({street: e.target.value})}
                                />
                            </FormGroup>*/}
                            <TextField className="textFieldClass" id="outlined-street" label="Street"
                                       variant="outlined" value={this.state.street}
                                       onChange={e => this.setState({street: e.target.value})}/>
                            {/*<FormGroup controlId="streetNr">
                                <ControlLabel column={"streetNr"}>Street number</ControlLabel>
                                <FormControl
                                    value={this.state.streetNr}
                                    onChange={e => this.setState({streetNr: e.target.value})}
                                    type="streetNr"
                                />
                            </FormGroup>*/}
                            <TextField className="textFieldClass" id="outlined-street-number" label="Street number"
                                       variant="outlined" value={this.state.streetNr}
                                       onChange={e => this.setState({streetNr: e.target.value})}/>
                        </Col>
                        <Col md={6}>
                            {/*<FormGroup controlId="city">
                                <ControlLabel column={"city"}>City</ControlLabel>
                                <FormControl
                                    value={this.state.city}
                                    onChange={e => this.setState({city: e.target.value})}
                                    type="city"
                                />
                            </FormGroup>*/}
                            <TextField className="textFieldClass" id="outlined-city" label="City"
                                       variant="outlined" value={this.state.city}
                                       onChange={e => this.setState({city: e.target.value})}/>
                            {/*<FormGroup controlId="region">
                                <ControlLabel column={"region"}>Region</ControlLabel>
                                <FormControl
                                    value={this.state.region}
                                    onChange={e => this.setState({region: e.target.value})}
                                    type="region"
                                />
                            </FormGroup>*/}
                            <TextField className="textFieldClass" id="outlined-region" label="Region"
                                       variant="outlined" value={this.state.region}
                                       onChange={e => this.setState({region: e.target.value})}/>
                            {/*<FormGroup controlId="country">
                                <ControlLabel column={"country"}>Country</ControlLabel>
                                <FormControl
                                    value={this.state.country}
                                    onChange={e => this.setState({country: e.target.value})}
                                    type="country"
                                />
                            </FormGroup>*/}
                            <TextField className="textFieldClass" id="outlined-country" label="Country"
                                       variant="outlined" value={this.state.country}
                                       onChange={e => this.setState({country: e.target.value})}/>
                            {/*<FormGroup controlId="this.addressCode">
                                <ControlLabel column={"addressCode"}>Postal Code</ControlLabel>
                                <FormControl
                                    value={this.state.addressCode}
                                    onChange={e => this.setState({addressCode: e.target.value})}
                                    type="addressCode"
                                />
                            </FormGroup>*/}
                            <TextField className="textFieldClass" id="outlined-postal-code" label="Postal Code"
                                       variant="outlined" value={this.state.addressCode}
                                       onChange={e => this.setState({addressCode: e.target.value})}/>
                            {/*<FormGroup controlId="description">*/}
                            {/*    <ControlLabel column={"description"}>Description</ControlLabel>*/}
                            {/*    <FormControl*/}
                            {/*        value={this.state.description}*/}
                            {/*        onChange={e => this.setState({description: e.target.value})}*/}
                            {/*        type="description"*/}
                            {/*    />*/}
                            {/*</FormGroup>*/}
                            <TextField className="textFieldClass" id="outlined-description" label="Description"
                                       variant="outlined" value={this.state.description}
                                       onChange={e => this.setState({description: e.target.value})}/>
                        </Col>
                        <div className="col align-self-center" style={{"text-align": " center"}}>
                            <div style={{"margin": "auto", "display": "table"}}>
                                <FormGroup style={{"margin": "auto", "display": "table"}}>
                                    <div className="form-group">
                                        <input type="file" className="form-control-file"
                                               onChange={this.handleImageChange}/>
                                        <img src={this.state.imagePreview} className="img-thumbnail" alt=""/>
                                    </div>
                                </FormGroup>

                            </div>
                            <div className="col align-self-center" style={{"text-align": " center"}}>
                                <div style={{"margin": "auto", "display": "table"}}>
                                    <FormGroup style={{"margin": "auto", "display": "table"}}>
                                        <div className="form-group">
                                            <LoaderButton block bsSize="large"
                                                          className="btn btn-primary LoginButton"
                                                          onClick={(e) => this.handleSubmit(this.state, e)}
                                                          disabled={!this.validateForm()}
                                                          style={{
                                                              "margin": "auto",
                                                              "display": "table",
                                                              "margin-bottom": "3em"
                                                          }}
                                                          type="submit">
                                                Add Playing Field
                                            </LoaderButton>
                                        </div>
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                    </form>
                </Container>
            );
    }
}

export default AddPlayingField;