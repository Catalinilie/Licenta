import React, {Component} from "react";
import {Button} from "react-bootstrap";
import axios from 'axios';
import "./UpdatePlayingField.css"
import {Link} from "react-router-dom";
import Container from "reactstrap/es/Container";
import Col from "react-bootstrap/lib/Col";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import countryList from "react-select-country-list";
import makeStyles from "@material-ui/core/styles/makeStyles";


class UpdatePlayingField extends Component {


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
            addressCode: "",
            description: "",
            image: null,
            imagePreview: null,
            classes: this.useStyles()
        };
        this.getData().then();
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

    updateFieldFlag() {
        this.setState({
            updateField: true
        });
    }

    onTagsChange = (event, values) => {
        if (values)
            this.setState({
                country: values.label
            });
    };

    validateForm() {
        let res = this.state.type === undefined || this.state.type === null
            || this.state.title === undefined || this.state.title === null
            || this.state.numberOfPlayers === undefined || this.state.numberOfPlayers === null
            || this.state.price === undefined || this.state.price === null
            || this.state.street === undefined || this.state.street === null
            || this.state.streetNr === undefined || this.state.streetNr === null
            || this.state.city === undefined || this.state.city === null
            || this.state.region === undefined || this.state.region === null
            || this.state.country === undefined || this.state.country === null
            || this.state.addressCode === undefined || this.state.addressCode === null
            || this.state.description === undefined || this.state.description === null;
        if (Boolean(res))
            return false;
        else
            return Boolean(this.state.title.length > 5
                && this.state.type.length > 4
                && this.state.numberOfPlayers.length !== 0
                && this.state.price.length > 3
                && this.state.street.length > 4
                && this.state.streetNr.length > 1
                && this.state.city.length > 3
                && this.state.region.length > 3
                && this.state.country.length > 4
                && this.state.addressCode.length > 3
                && this.state.description.length > 10);
    }

    cancelUpdate() {
        this.setState({
            updateField: false
        });
    }

    async getData() {
        const params = {
            "playingFieldId": this.props.playingFieldId
        };
        return await axios.get('http://localhost:4996/playingField', {params: params})
            .then(res => {
                if (res) {
                    this.setState({
                        "title": res.data.title
                    });
                    this.setState({
                        "type": res.data.type
                    });
                    this.setState({
                        "numberOfPlayers": res.data.numberOfPlayers
                    });
                    this.setState({
                        "price": res.data.price
                    });
                    this.setState({
                        "street": res.data.address.street
                    });
                    this.setState({
                        "streetNr": res.data.address.streetNr
                    });
                    this.setState({
                        "country": res.data.address.country
                    });
                    this.setState({
                        "city": res.data.address.city
                    });
                    this.setState({
                        "region": res.data.address.region
                    });
                    this.setState({
                        "addressCode": res.data.address.addressCode
                    });
                    this.setState({
                        "description": res.data.description
                    });
                }
            });
    }

    async handleSubmit(state, e) {
        e.preventDefault();
        const params = {
            "title": this.state.title,
            "type": this.state.type,
            "numberOfPlayers": this.state.numberOfPlayers,
            "price": this.state.price,
            "street": this.state.street,
            "streetNr": this.state.streetNr,
            "city": this.state.city,
            "region": this.state.region,
            "country": this.state.country,
            "addressCode": this.state.addressCode,
            "description": this.state.description,
        };
        let res;
        try {
            res = await axios.patch('http://localhost:4996/playingField?id=' + this.props.playingFieldId, params);
        } catch (e) {
        }
        if (e.message === "Network Error")
            alert(e.message);

        window.location.reload();
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
                    <form className="row myProfileContainerClass">
                        <Col md={6} className="textFieldColClass">
                            <TextField className="textFieldClass" id="outlined-title" label="Title"
                                       variant="outlined"
                                       onChange={e => this.setState({
                                           "title": e.target.value
                                       })}
                                       value={this.state.title}
                                       disabled={(!this.state.updateField)}/>
                            <TextField className="textFieldClass" id="outlined-type" label="Type"
                                       variant="outlined" value={this.state.type}
                                       disabled={(!this.state.updateField)}
                                       onChange={e => this.setState({
                                           "type": e.target.value
                                       })}/>
                            <TextField className="textFieldClass" id="outlined-number-of-players"
                                       label="Number of Players"
                                       variant="outlined" value={this.state.numberOfPlayers}
                                       disabled={(!this.state.updateField)}
                                       onChange={e => this.setState({
                                           "numberOfPlayers": e.target.value
                                       })}/>
                            <TextField className="textFieldClass" id="outlined-price" label="Price"
                                       variant="outlined" value={this.state.price}
                                       disabled={(!this.state.updateField)}
                                       onChange={e => this.setState({
                                           "price": e.target.value
                                       })}/>
                            <div className="row">
                                <Col md={8}>
                                    <TextField className="textFieldClass" id="outlined-street" label="Street"
                                               variant="outlined" value={this.state.street}
                                               disabled={(!this.state.updateField)}
                                               onChange={e => this.setState({
                                                   "street": e.target.value
                                               })}/>
                                </Col>
                                <Col md={4}>
                                    <TextField className="textFieldClass" id="outlined-streetNumber"
                                               label="Street Number"
                                               variant="outlined"
                                               disabled={(!this.state.updateField)}
                                               onChange={e => this.setState({
                                                   "streetNr": e.target.value
                                               })}
                                               value={this.state.streetNr}/>
                                </Col>
                            </div>
                        </Col>
                        <Col md={6} className="textFieldColClass">
                            <Autocomplete
                                id="autoCompleteField"
                                options={this.state.options}
                                option={this.state.country}
                                getOptionLabel={option => option.label}
                                onChange={this.onTagsChange}
                                disabled={(!this.state.updateField)}
                                renderInput={params => (
                                    <TextField {...params} className="textFieldClass" id="outlined-country"
                                               label="Country"
                                               variant="outlined" value={this.state.country}
                                    />
                                )}
                            />

                            <TextField className="textFieldClass" id="outlined-city"
                                       label="City"
                                       variant="outlined" value={this.state.city}
                                       disabled={(!this.state.updateField)}
                                       onChange={e => this.setState({
                                           "city": e.target.value
                                       })}/>

                            <TextField className="textFieldClass" id="outlined-region"
                                       label="Region"
                                       variant="outlined" value={this.state.region}
                                       disabled={(!this.state.updateField)}
                                       onChange={e => this.setState({
                                           "region": e.target.value
                                       })}/>
                            <TextField className="textFieldClass" id="outlined-addressCode"
                                       label="Postal Code"
                                       variant="outlined" value={this.state.addressCode}
                                       disabled={(!this.state.updateField)}
                                       onChange={e => this.setState({
                                           "addressCode": e.target.value
                                       })}/>
                        </Col>
                        <Col md={12}>
                            <TextField className="textFieldClass" id="outlined-description" label="Description"
                                       multiline disabled={(!this.state.updateField)}
                                       variant="outlined" value={this.state.description}
                                       onChange={e => this.setState({description: e.target.value})}/>
                        </Col>
                        <div className="col align-self-center myProfileBoxClass">
                            {!this.state.updateField &&
                            <div className="myProfileUpdateButtonClass">
                                <Button block bsSize="large" onClick={this.updateFieldFlag.bind(this)}
                                        className="btn btn-primary" style={{"margin": "auto", "display": "table"}}>
                                    Update
                                </Button>
                            </div>
                            }
                            {this.state.updateField &&
                            <>
                                <div className="container-fluid">
                                    <div className="row buttonClassControl">
                                        <Button bsSize="large" onClick={(e) => this.handleSubmit(this.state, e)}
                                                disabled={!this.validateForm()} type="submit"
                                                className="btn btn-primary">
                                            Save
                                        </Button>
                                        <Button bsSize="large"
                                                type="submit"
                                                onClick={this.cancelUpdate.bind(this)}
                                                className="btn btn-primary">

                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </>
                            }
                        </div>
                    </form>
                </Container>
            );
    }
}

export default UpdatePlayingField;