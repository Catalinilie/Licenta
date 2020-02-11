import React, {Component} from "react";
import {Button} from "react-bootstrap";
import axios from 'axios';
import "./AvailableTime.css"
import Col from "react-bootstrap/lib/Col";
import TextField from "@material-ui/core/TextField";
import countryList from "react-select-country-list";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";


class AvailableTime extends Component {


    constructor(props) {
        super(props);
        this.options = countryList().getData();
        this.state = {
            dayFrom: "",
            dayTo: "",
            hourFrom: "",
            hourTo: "",
            availableTimes: this.props.availableTimes,
            classes: this.useStyles()
        };
        this.getData();
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
        let res = this.state.dayFrom === undefined || this.state.dayFrom === null
            || this.state.hourFrom === undefined || this.state.hourFrom === null
            || this.state.hourTo === undefined || this.state.hourTo === null;
        if (Boolean(res))
            return false;
        else
            return Boolean(this.state.dayFrom !== ""
                && this.state.hourFrom !== ""
                && this.state.hourTo !== "");
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

    delete(item) {
        this.setState(prevState => ({
            availableTimes: prevState.availableTimes.filter(el => el !== item)
        }));
    }

    async handleSubmit(state, e) {
        e.preventDefault();
        if (this.state.dayFrom !== "" && this.state.hourFrom !== "" && this.state.hourTo !== "") {
            let availableTime = {
                dayOfWeekFrom: this.state.dayFrom,
                dayOfWeekTo: this.state.dayTo,
                hourOfOpening: this.state.hourFrom,
                hourOfClosing: this.state.hourTo
            };
            this.setState({
                availableTimes: this.state.availableTimes.concat(availableTime)
            })
        }
    }

    async save(e) {
        e.preventDefault();
        const params = {
            "playingFieldId": this.props.playingFieldId,
            "availableTimes": this.state.availableTimes
        };
        try {
            let token = sessionStorage.getItem("token");
            await axios.post('http://localhost:4996/addOrUpdateAvailableTime?token=' + token, params);
        } catch (e) {
        }
        if (e.message === "Network Error")
            alert(e.message);

        window.location.reload();

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
                            <TextField className="textFieldClass" id="outlined-day-from" label="Day from"
                                       variant="outlined"
                                       onChange={e => this.setState({
                                           "dayFrom": e.target.value
                                       })}
                            />
                            <TextField className="textFieldClass" id="outlined-day-to" label="Day to *"
                                       variant="outlined"
                                       onChange={e => this.setState({
                                           "dayTo": e.target.value
                                       })}/>
                        </Col>
                        <Col md={6} className="textFieldColClass">

                            <TextField className="textFieldClass" id="outlined-hour-from"
                                       label="Hour of opening"
                                       variant="outlined"
                                       onChange={e => this.setState({
                                           "hourFrom": e.target.value
                                       })}/>

                            <TextField className="textFieldClass" id="outlined-hour-to"
                                       label="Hour of Closing"
                                       variant="outlined"
                                       onChange={e => this.setState({
                                           "hourTo": e.target.value
                                       })}/>
                        </Col>
                        <div className="col align-self-center myProfileBoxClass">
                            <div className="container-fluid">
                                <div className="row buttonClassControl">
                                    <Button bsSize="large" onClick={(e) => this.handleSubmit(this.state, e)}
                                            disabled={!this.validateForm()} type="submit"
                                            className="btn btn-primary addFacilityButton">
                                        Add
                                    </Button>
                                    <Button bsSize="large"
                                            type="submit"
                                            onClick={this.save.bind(this)}
                                            className="btn btn-primary addFacilityButton">
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <hr className="my-4"/>
                    <ul>
                        {this.state.availableTimes.map(item => ((
                                (item.dayOfWeekTo != null) &&
                                <span key={item.id}
                                      className="badge badge-primary badge-pill facilityRemoveButtonClass">{item.dayOfWeekFrom} - {item.dayOfWeekTo}: {item.hourOfOpening}-{item.hourOfClosing}
                                    <button className="btn btn-sm facilityRemoveButtonClassx"
                                            onClick={() => this.delete(item)}>X</button>
                            </span>)
                            || (
                                <span key={item.id}
                                      className="badge badge-primary badge-pill facilityRemoveButtonClass">{item.dayOfWeekFrom} : {item.hourOfOpening}-{item.hourOfClosing}
                                    <button className="btn btn-sm facilityRemoveButtonClassx"
                                            onClick={() => this.delete(item)}>X</button>
                            </span>)
                        ))}
                    </ul>
                </Container>
            );
    }
}

export default AvailableTime;