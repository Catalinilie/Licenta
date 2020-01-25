import React, {Component} from "react";
import {FormGroup} from "react-bootstrap";
import "./AddPlayingField.css";
import axios from 'axios';
import "./AddPlayingField.css"
import LoaderButton from "../components/LoaderButton";
import {Link} from "react-router-dom";
import Container from "reactstrap/es/Container";
import Col from "react-bootstrap/lib/Col";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import countryList from 'react-select-country-list';
import Autocomplete from '@material-ui/lab/Autocomplete';

const {postcodeValidator} = require('postcode-validator');

class AddPlayingField extends Component {


    constructor(props) {
        super(props);
        this.options = countryList().getData();
        this.state = {
            options: this.options,
            title: "",
            type: "",
            numberOfPlayers: "",
            price: "",
            street: "",
            streetNr: "",
            city: "",
            region: "",
            country: "",
            countryPref: "",
            addressCode: "",
            description: "",
            image: null,
            imagePreview: null,
            titleError: false,
            typeError: false,
            numberOfPlayersError: false,
            streetError: false,
            streetNumberError: false,
            cityError: false,
            regionError: false,
            descriptionError: false,
            postalCodeError: false,
            classes: this.useStyles()
        };
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

    onTagsChange = (event, values) => {
        if (values) {
            this.setState({
                country: values.label
            });
            this.setState({countryPref: values.value});
        }
    };

    validateForm() {
        if (
            this.state.type === undefined
            || this.state.title === undefined
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
                this.state.title.length > 0
                && this.state.type.length > 0
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

    validateTitle() {
        if (this.state.title.length < 5)
            this.setState({titleError: true});
        else
            this.setState({titleError: false});
    }

    focusTitle() {
        this.setState({titleError: false});
    }

    validateType() {
        if (this.state.type.length < 3)
            this.setState({typeError: true});
        else
            this.setState({typeError: false});
    }

    focusType() {
        this.setState({typeError: false});
    }

    validateNumberOfPlayers() {
        if (this.state.numberOfPlayers.length < 0) {
            this.setState({numberOfPlayersError: true});
        } else
            this.setState({numberOfPlayersError: false});
    }

    focusNumberOfPlayers() {
        this.setState({numberOfPlayersError: false});
    }

    validatePostalCode() {
        try {
            if (!postcodeValidator(this.state.addressCode, this.state.countryPref)) {
                this.setState({postalCodeError: true});
            } else
                this.setState({postalCodeError: false});
        } catch (e) {
        }
    }

    focusPostalCode() {
        this.setState({postalCodeError: false});
    }

    validateStreet() {
        if (this.state.street.length < 5) {
            this.setState({streetError: true});
        } else
            this.setState({streetError: false});
    }

    focusStreet() {
        this.setState({streetError: false});
    }

    validateStreetNumber() {
        if (this.state.streetNr.length < 0) {
            this.setState({streetNumberError: true});
        } else
            this.setState({streetNumberError: false});
    }

    focusStreetNumber() {
        this.setState({streetNumberError: false});
    }

    validateCity() {
        if (this.state.city.length < 3) {
            this.setState({cityError: true});
        } else
            this.setState({cityError: false});
    }

    focusCity() {
        this.setState({cityError: false});
    }

    validateRegion() {
        if (this.state.region.length < 4) {
            this.setState({regionError: true});
        } else
            this.setState({regionError: false});
    }

    focusRegion() {
        this.setState({regionError: false});
    }

    validateDescription() {
        if (this.state.description.length < 10) {
            this.setState({descriptionError: true});
        } else
            this.setState({descriptionError: false});
    }

    focusDescription() {
        this.setState({descriptionError: false});
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
            "title": this.state.title,
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
                .catch();
        }
        this.props.history.push("/myPlayingFields");
        return res;
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
                    <form className="{this.state.classes.root}">
                        <div className="addPlayingFieldContainer row">
                            <Col md={6} className="addPlayingFieldClass">
                                <TextField className="textFieldClass" id="outlined-title" label="Title"
                                           error={this.state.titleError}
                                           autoComplete="off"
                                           onBlur={this.validateTitle.bind(this)}
                                           onFocus={this.focusTitle.bind(this)}
                                           helperText={this.state.titleError ? "Title should have at least 5 characters." : false}
                                           variant="outlined" value={this.state.title}
                                           onChange={e => this.setState({title: e.target.value})}/>

                                <TextField className="textFieldClass" id="outlined-type" label="Type"
                                           variant="outlined" value={this.state.type}
                                           error={this.state.typeError}
                                           autoComplete="off"
                                           onBlur={this.validateType.bind(this)}
                                           onFocus={this.focusType.bind(this)}
                                           helperText={this.state.typeError ? "Type should have at least 3 characters." : false}
                                           onChange={e => this.setState({type: e.target.value})}/>
                                <TextField className="textFieldClass" id="outlined-number-of-players"
                                           label="Number of players"
                                           error={this.state.numberOfPlayersError}
                                           autoComplete="off"
                                           onBlur={this.validateNumberOfPlayers.bind(this)}
                                           onFocus={this.focusNumberOfPlayers.bind(this)}
                                           helperText={this.state.numberOfPlayersError ? "Number of players shouldn't be empty." : false}
                                           variant="outlined" value={this.state.numberOfPlayers}
                                           onChange={e => this.setState({numberOfPlayers: e.target.value})}/>
                                <TextField className="textFieldClass" id="outlined-price" label="Price/hour"
                                           variant="outlined" value={this.state.price}
                                           autoComplete="off"
                                           onChange={e => this.setState({price: e.target.value})}/>
                                <TextField className="textFieldClass" id="outlined-street" label="Street"
                                           variant="outlined" value={this.state.street}
                                           error={this.state.streetError}
                                           onBlur={this.validateStreet.bind(this)}
                                           onFocus={this.focusStreet.bind(this)}
                                           helperText={this.state.streetError ? "Street should have at least 5 characters." : false}
                                           autoComplete="off"
                                           onChange={e => this.setState({street: e.target.value})}/>

                            </Col>
                            <Col md={6}>
                                <TextField className="textFieldClass" id="outlined-street-number" label="Street number"
                                           variant="outlined" value={this.state.streetNr}
                                           error={this.state.streetNumberError}
                                           onBlur={this.validateStreetNumber.bind(this)}
                                           onFocus={this.focusStreetNumber.bind(this)}
                                           helperText={this.state.streetNumberError ? "Street number shouldn't be empty." : false}
                                           autoComplete="off"
                                           onChange={e => this.setState({streetNr: e.target.value})}/>
                                <Autocomplete
                                    id="autoCompleteField"
                                    options={this.state.options}
                                    getOptionLabel={option => option.label}
                                    onChange={this.onTagsChange}
                                    renderInput={params => (
                                        <TextField {...params} className="textFieldClass" id="outlined-country"
                                                   label="Country"
                                                   variant="outlined" value={this.state.country}
                                        />
                                    )}
                                />
                                <TextField className="textFieldClass" id="outlined-city" label="City"
                                           variant="outlined" value={this.state.city}
                                           error={this.state.cityError}
                                           onBlur={this.validateCity.bind(this)}
                                           onFocus={this.focusCity.bind(this)}
                                           helperText={this.state.cityError ? "Invalid city." : false}
                                           autoComplete="off"
                                           onChange={e => this.setState({city: e.target.value})}/>
                                <TextField className="textFieldClass" id="outlined-region" label="Region"
                                           variant="outlined" value={this.state.region}
                                           error={this.state.regionError}
                                           onBlur={this.validateRegion.bind(this)}
                                           onFocus={this.focusRegion.bind(this)}
                                           helperText={this.state.regionError ? "Region should have at least 4 characters" : false}
                                           autoComplete="off"
                                           onChange={e => this.setState({region: e.target.value})}/>
                                <TextField className="textFieldClass" id="outlined-postal-code" label="Postal Code"
                                           variant="outlined" value={this.state.addressCode}
                                           error={this.state.postalCodeError}
                                           onBlur={this.validatePostalCode.bind(this)}
                                           onFocus={this.focusPostalCode.bind(this)}
                                           helperText={this.state.postalCodeError ? "Postal code incorrect." : false}
                                           autoComplete="off"
                                           onChange={e => this.setState({addressCode: e.target.value})}/>

                            </Col>

                            <Col md={12}>
                                <TextField className="textFieldClass" id="outlined-description" label="Description"
                                           multiline
                                           error={this.state.descriptionError}
                                           onBlur={this.validateDescription.bind(this)}
                                           onFocus={this.focusDescription.bind(this)}
                                           helperText={this.state.descriptionError ? "Description should have at least 10 characters" : false}
                                           variant="outlined" value={this.state.description}
                                           autoComplete="off"
                                           onChange={e => this.setState({description: e.target.value})}/>
                            </Col>
                        </div>

                        <div className="col align-self-center addPlayingFieldButtonClass">
                            <div style={{"margin": "auto", "display": "table"}}>
                                <FormGroup style={{"margin": "auto", "display": "table"}}>
                                    <div className="form-group">
                                        <input type="file" className="form-control-file"
                                               onChange={this.handleImageChange}/>
                                        <img src={this.state.imagePreview} className="img-thumbnail" alt=""/>
                                    </div>
                                </FormGroup>

                            </div>
                            <div className="col align-self-center addPlayingFieldButtonClass">
                                <div style={{"margin": "auto", "display": "table"}}>
                                    <FormGroup style={{"margin": "auto", "display": "table"}}>
                                        <div className="form-group">
                                            <LoaderButton block bsSize="large"
                                                          className="btn btn-primary LoginButtonClass"
                                                          onClick={(e) => this.handleSubmit(this.state, e)}
                                                          disabled={!this.validateForm.bind(this)}
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