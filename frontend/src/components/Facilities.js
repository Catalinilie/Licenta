import React, {Component} from "react";
import {Button} from "react-bootstrap";
import axios from 'axios';
import "./Facilities.css"
import Col from "react-bootstrap/lib/Col";
import TextField from "@material-ui/core/TextField";
import countryList from "react-select-country-list";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";


class Facilities extends Component {


    constructor(props) {
        super(props);
        this.options = countryList().getData();
        this.state = {
            facilities: this.props.facilities,
            facility: "",
            classes: this.useStyles()
        };
        this.getData().then(r => console.log(r));
        console.log(this.props.facilities)
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
        let res = this.state.facility === undefined || this.state.facility === null;
        if (Boolean(res))
            return false;
        else
            return Boolean(this.state.facility.length > 0);
    }

    async save(e) {
        e.preventDefault();
        const params = {
            "playingFieldId": this.props.playingFieldId,
            "facilities": this.state.facilities
        };
        try {
            let token = sessionStorage.getItem("token");
            await axios.post('http://localhost:4996/addOrUpdateFacilities?token=' + token, params)
                .then(res => console.log(res));
        } catch (e) {
        }
        if (e.message === "Network Error")
            alert(e.message);

        window.location.reload();
    }

    async getData() {
        const params = {
            "playingFieldId": this.props.playingFieldId
        };
        return await axios.get('http://localhost:4996/getAvailableTime', {params: params})
            .then(res => {
                if (res) {
                    this.setState({
                        "dayFrom": res.data.dayOfWeekFrom
                    });
                    this.setState({
                        "dayTo": res.data.dayOfWeekTo
                    });
                    this.setState({
                        "hourFrom": res.data.hourOfOpening
                    });
                    this.setState({
                        "hourTo": res.data.hourOfClosing
                    });
                }
            });
    }

    async handleSubmit(state, e) {
        e.preventDefault();
        this.setState({
            "facilities": this.state.facilities.concat(this.state.facility)
        })
    }

    delete(item) {
        this.setState(prevState => ({
            facilities: prevState.facilities.filter(el => el !== item)
        }));
    }

    render() {
        if (sessionStorage.getItem("isAuthenticated") === "false")
            return (
                <div className="container-fluid">
                    <div className="col-sm-12">
                        <div className="facilitiesModalClass">
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
                            <TextField className="textFieldClass" id="outlined-facility" label="Facility"
                                       variant="outlined"
                                       onChange={e => this.setState({
                                           facility: e.target.value
                                       })}/>
                        </Col>
                        <Col md={3}>
                            <Button bsSize="large" onClick={(e) => this.handleSubmit(this.state, e)}
                                    disabled={!this.validateForm()} type="submit"
                                    className="btn btn-primary addFacilityButton">
                                Add
                            </Button>
                        </Col>
                        <Col md={3}>
                            <Button bsSize="large"
                                    type="submit"
                                    onClick={this.save.bind(this)}
                                    disabled={Boolean(this.state.facilities.length === 0)}
                                    className="btn btn-primary addFacilityButton">
                                Save
                            </Button>
                        </Col>
                        <div className="col align-self-center myProfileBoxClass">

                            <div className="container-fluid">
                                <div className="row buttonClassControl">

                                </div>
                            </div>
                        </div>
                    </form>
                    <hr className="my-4"/>
                    <ul>
                        {this.state.facilities.map(item => (
                            <span key={item} className="badge badge-primary badge-pill facilityRemoveButtonClass">{item}
                                <button className="btn btn-sm facilityRemoveButtonClassx" onClick={() => this.delete(item)}>X</button>
                            </span>

                        ))}
                    </ul>
                </Container>
            )
                ;
    }
}

export default Facilities;