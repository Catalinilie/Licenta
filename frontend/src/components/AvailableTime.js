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
            classes: this.useStyles()
        };
        this.getData().then(r => console.log(r));
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

    validateForm() {
        let res = this.state.dayFrom === undefined || this.state.dayFrom === null
            || this.state.dayTo === undefined || this.state.dayTo === null
            || this.state.hourFrom === undefined || this.state.hourFrom === null
            || this.state.hourTo === undefined || this.state.hourTo === null;
        if (Boolean(res))
            return false;
        else
            return Boolean(this.state.dayFrom.length > 0
                && this.state.dayTo.length > 0
                && this.state.hourFrom.length > 0
                && this.state.hourTo.length > 0);
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
        const params = {
            "playingFieldId": this.props.playingFieldId,
            "dayOfWeekFrom": this.state.dayFrom,
            "dayOfWeekTo": this.state.dayTo,
            "hourOfOpening": this.state.hourFrom,
            "hourOfClosing": this.state.hourTo
        };
        let res;
        try {
            res = await axios.post('http://localhost:4996/addOrUpdateAvailableTime', params)
                .then(res => console.log(res.data));
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
                            <TextField className="textFieldClass" id="outlined-day-from" label="Day of week from"
                                       variant="outlined"
                                       onChange={e => this.setState({
                                           "dayFrom": e.target.value
                                       })}
                                       value={this.state.dayFrom}
                                       disabled={(!this.state.updateField)}/>
                            <TextField className="textFieldClass" id="outlined-day-to" label="Day of week to"
                                       variant="outlined" value={this.state.dayTo}
                                       disabled={(!this.state.updateField)}
                                       onChange={e => this.setState({
                                           "dayTo": e.target.value
                                       })}/>
                        </Col>
                        <Col md={6} className="textFieldColClass">

                            <TextField className="textFieldClass" id="outlined-hour-from"
                                       label="Hour of opening"
                                       variant="outlined" value={this.state.hourFrom}
                                       disabled={(!this.state.updateField)}
                                       onChange={e => this.setState({
                                           "hourFrom": e.target.value
                                       })}/>

                            <TextField className="textFieldClass" id="outlined-hour-to"
                                       label="Hour of Closing"
                                       variant="outlined" value={this.state.hourTo}
                                       disabled={(!this.state.updateField)}
                                       onChange={e => this.setState({
                                           "hourTo": e.target.value
                                       })}/>
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

export default AvailableTime;